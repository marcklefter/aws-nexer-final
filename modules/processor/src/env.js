const env = require('env-var');

// ...

const queueUrl = process.env.COPILOT_QUEUE_URI;
        
// ...

module.exports = {
    queueUrl: 
        process.env.QUEUE_URI ?? queueUrl
};