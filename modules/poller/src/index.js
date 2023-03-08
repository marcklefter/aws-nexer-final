const env = require('./env');
const dba = require('./db');

if (env.usedb) {
    dba.init(env.dbUrl, env.dbName);
}

const job = async () => {
    console.log('Running poller @ ' + new Date());

    if (env.usedb) {
        const db = await dba.open();
        await dba.setStatusCompleted(db);
        await dba.close(); 
    }
}

job();