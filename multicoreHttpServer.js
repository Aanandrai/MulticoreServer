const cluster = require('node:cluster');
const http = require('node:http');
const os = require('node:os');

// Get the number of CPU cores available on the machine
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process (PID: ${process.pid}) is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();  // Fork worker processes
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker process (PID: ${process.pid}) is running`);

  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello, world!');
  }).listen(8000);  // Workers share this port
}
