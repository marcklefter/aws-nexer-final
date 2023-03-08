const env = require('env-var');

// ...

const usedb = env.get("USE_DB").default(0).asBool();

const port = env.get('PORT').default('80').asPortNumber();

const dbUrl
    = env.get('DB_URL').required().asString();
    
const dbName
    = env.get('DB_NAME').required().asString();

const {
    requestsTopic
} = JSON.parse(process.env.COPILOT_SNS_TOPIC_ARNS);

// ...

module.exports = {
    usedb,
    
    port,

    dbName,
    dbUrl,

    requestsTopic
};