const crypto        = require('crypto');
const express       = require('express');
const superagent    = require('superagent');

const {
    SNSClient,
    PublishCommand
} = require('@aws-sdk/client-sns');

const env = require('./env');

// ...

const routes = express.Router();

const sns = new SNSClient({
    region: 'eu-north-1'
});

// ...
// TMS API.
routes.get('/status/:requestId', (req, res) => {
    res.send('OK: ' + req.params.requestId);
});

routes.get('/content/:requestId', (req, res) => {
    res.send('OK: ' + req.params.requestId);
});

routes.post('/content', async (req, res) => {
    await superagent.post(`http://validator.${process.env.COPILOT_SERVICE_DISCOVERY_ENDPOINT}`).send({});

    const requestId = crypto.randomUUID();
    await sns.send(new PublishCommand({
        Message: requestId,
        TopicArn: env.requestsTopic
    }));

    res.send('Content request ID: ' + requestId);   
});

// ...

module.exports = routes;