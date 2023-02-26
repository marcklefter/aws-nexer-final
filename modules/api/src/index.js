const express   = require('express');
const env       = require('./env');
const routes    = require('./routes');

// ...

const app = express();
app.use(express.json());
app.use('/v1', routes);

// ...
// Healthcheck.
app.get('/', (_, res) => {    
    res.send('OK');
});

// ...

const srvd = app.listen(env.port, () => {
    console.log(`Listening on port ${env.port}`)
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received, closing API server'); 
   
    srvd.close(() => {
        console.log('API server closed');

        // other connnections and resources to clean up...
        
        process.exit(0);
    });
});