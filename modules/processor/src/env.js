const env = require('env-var');

// ...

const usedb = env.get("USE_DB").default(0).asBool();

const dbUrl
    = env.get('DB_URL').required().asString();
    
const dbName
    = env.get('DB_NAME').required().asString();

const queueUrl = env.get('COPILOT_QUEUE_URI').required().asString();
        
// ...

module.exports = {
    usedb,
    
    dbUrl,
    dbName,
    
    queueUrl
};