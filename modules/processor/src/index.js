const env = require('./env');
const { 
  SQSClient, 
  DeleteMessageCommand,
  ReceiveMessageCommand 
} = require("@aws-sdk/client-sqs");

const dba = require('./db');
const env = require('./env');

// ...

const client = new SQSClient({ region: "eu-north-1" });

// ...

let running = true;
const stopRunning = () => {
  console.log('Exiting polling loop');
  running = false;
}

process.on('SIGINT', stopRunning);
process.on('SIGTERM', stopRunning);

const processor = async () => {
  while (running) {
    // TODO 1. Send ReceiveMessageCommand.
    const out = await client.send(new ReceiveMessageCommand({
      QueueUrl: env.queueUrl,
      WaitTimeSeconds: 15
    }));    
    
    if (!running) {
      console.log('Processor shutting down...');
      break;
    }

    if (out.Messages === undefined || out.Messages.length === 0) {
        // note: continue instead of return! 
        continue;
    }

    const db = await dba.open(env.dbUrl, env.dbName);
      
    for (const message of out.Messages) {
      const {
        Body,
        ReceiptHandle
      } = message;

      const body      = JSON.parse(Body);
      const requestId = body.Message;

      // ...
      // Process message by updating the request status.
      console.log('Processing request with ID: ' + requestId);
      await dba.setStatusPending(db, requestId);
      

      // TODO 2. Send DeleteMessageCommand to instruct the queue the this message has been handled and can be removed.
      await client.send(new DeleteMessageCommand({
        QueueUrl: env.queueUrl,
        ReceiptHandle
      }));
    } 
  }
}

processor();