const env = require('env-var');

// ...

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
    port,

    dbName,
    dbUrl,

    requestsTopic
};