const env = require('./env');
const dba = require('./db');

const job = async () => {
    const db = await dba.open(env.dbUrl, env.dbName);
    await dba.setStatusCompleted(db);
    await dba.close(); 
}

job();