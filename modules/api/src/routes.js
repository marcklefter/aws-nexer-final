const crypto        = require('crypto');
const express       = require('express');
const superagent    = require('superagent');

const {
    SNSClient,
    PublishCommand
} = require('@aws-sdk/client-sns');

const dba = require('./db');
const env = require('./env');


// ...

const routes = express.Router();

const sns = new SNSClient({
    region: 'eu-north-1'
});

if (env.usedb) {
    dba.init(env.dbUrl, env.dbName);
}

// ...
// TMS API.
routes.get('/status/:requestId', async (req, res) => {
    if (env.usedb) {
        const db        = await dba.open();
        const request   = await dba.getContentRequest(db, req.params.id);
        
        res.send({
            status: request.status
        });
    }

    res.send('OK: ' + req.params.requestId);
});

routes.get('/content/:requestId', async(req, res) => {
    if (env.usedb) {
        const db        = await dba.open();
        const request   = await dba.getContentRequest(db, req.params.id);
        
        res.send(request);
    }

    res.send('OK: ' + req.params.requestId);
});

routes.post('/content', async (_req, res) => {
    await superagent.post(`http://validator.${process.env.COPILOT_SERVICE_DISCOVERY_ENDPOINT}`).send({});

    // ...
    // Generate a content request ID.
    const requestId = crypto.randomUUID();

    // ...
    // Create a new content request.
    if (env.usedb) {
        const db = await dba.open();
        await dba.newContentRequest(db, requestId);
    }

    // ...
    // Publish to SNS topic.
    await sns.send(new PublishCommand({
        Message: requestId,
        TopicArn: env.requestsTopic
    }));

    // ...

    console.log('Content Request ID ' + requestId + ' published');

    res.send({
        requestId
    });   
});

// ...

module.exports = routes;