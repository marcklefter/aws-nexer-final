const env = require('env-var');

// ...

const dbUrl
    = env.get('DB_URL').required().asString();
    
const dbName
    = env.get('DB_NAME').required().asString();

const queueUrl = env.get('COPILOT_QUEUE_URI').required().asString();
        
// ...

module.exports = {
    dbUrl,
    dbName,
    
    queueUrl
};