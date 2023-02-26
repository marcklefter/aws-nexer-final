const env = require('env-var');

// ...

const queueUrl = process.env.COPILOT_QUEUE_URI;
        
// ...

module.exports = {
    queueUrl: 
        process.env.NODE_ENV === 'development' 
        ? 'https://sqs.eu-north-1.amazonaws.com/847606970464/ex3'
        : queueUrl
};