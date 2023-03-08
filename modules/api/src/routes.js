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

dba.init(env.dbUrl, env.dbName);

// ...
// TMS API.
routes.get('/status/:requestId', async (req, res) => {
    const db        = await dba.open();
    const request   = await dba.getContentRequest(db, req.params.id);
    
    res.send({
        status: request.status
    });
});

routes.get('/content/:requestId', async(req, res) => {
    const db        = await dba.open();
    const request   = await dba.getContentRequest(db, req.params.id);
    
    res.send(request);
});

routes.post('/content', async (req, res) => {
    await superagent.post(`http://validator.${process.env.COPILOT_SERVICE_DISCOVERY_ENDPOINT}`).send({});

    // ...
    // Generate a content request ID.
    const requestId = crypto.randomUUID();

    // ...
    // Create a new content request.
    const db = await dba.open();
    await dba.newContentRequest(db, requestId);

    // ...
    // Publish to SNS topic.
    await sns.send(new PublishCommand({
        Message: requestId,
        TopicArn: env.requestsTopic
    }));

    // ...

    res.send({
        requestId,
        status: 'created'
    });   
});

// ...

module.exports = routes;