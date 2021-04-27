const http = require('http');
const options = {
    host: '0.0.0.0',
    port: 5002,
    timeout: 2000,
    path: '/health-check'
};

const healthCheck = http.request(options, (res) => {
    console.log(`HEALTH-CHECK STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) {
        process.exit(0);
    }
    else {
        process.exit(1);
    }
});

healthCheck.on('error', function (err) {
    console.error('ERROR');
    process.exit(1);
});

healthCheck.end();
