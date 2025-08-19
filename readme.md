# Node.js Cluster Module Learning

To run the file just user **"node multicoreHttpServer.js"**
No need to do npm init -y or npm i 
because The cluster module is a built-in Node.js module, which means it is available right out of the box with Node.js.


## 1. Imports

- **cluster**: This module is used to create child processes (workers) that share the same server port.
- **http**: Used to create an HTTP server.
- **os**: Provides information about the system’s CPU cores. `availableParallelism()` returns the number of logical CPU cores available.
- **process**: Provides information and control over the current process (like the process ID).

## 2. Primary Process (Master Process)

The `if (cluster.isPrimary)` condition checks if the current process is the primary (master) process. If it is, the following happens:

- The master process forks new worker processes based on the number of available CPU cores (`numCPUs`).
- The `cluster.on('exit')` event listener logs when a worker process exits (dies), showing the worker's process ID.

## 3. Worker Processes

In the `else` block, if the process is a worker (i.e., it’s not the primary process), it runs the following:

- It creates an HTTP server using `http.createServer()`.
- The server listens on port `8000` and responds with a simple "hello world" message to any HTTP request.
- Each worker logs its own process ID, indicating that it’s started and running.

## Why Use Clustering?

Node.js is single-threaded by default, meaning it can only handle one request at a time per process. By using the cluster module, you can take advantage of multi-core systems. This way, multiple worker processes can handle incoming requests in parallel, improving performance and scalability for CPU-bound or high-traffic applications.

### Example Use Case

If you deploy this code on a server with 4 CPU cores, it will spawn 4 worker processes to handle incoming HTTP requests, which can improve the throughput of the application as opposed to a single-threaded server.

## Basic Flow of the Cluster Module

### Primary Process (Master)

- The primary process is the one that runs initially.
- It forks multiple worker processes based on the number of CPU cores or a custom configuration.
- The master process is responsible for managing workers, handling worker exits, and monitoring them.

### Worker Processes

- Workers are forked by the primary process.
- Each worker is a new instance of the Node.js event loop and can independently handle requests.
- Workers share the same server port but each one can handle different requests.
- The workers can communicate with each other through IPC (Inter-Process Communication) channels.

### Communication

- Workers don’t communicate directly with each other but can send messages to the master process or other workers via an internal messaging system.
- The master can also listen to worker exit events and restart workers if needed.

## Key Methods in the Cluster Module

- **cluster.isPrimary**: A boolean indicating whether the current process is the primary process (master) or a worker.
- **cluster.fork()**: This method is used in the master process to create a worker. It returns the worker process object.
- **cluster.on('exit')**: An event listener that fires when a worker process exits (whether it ends normally or crashes). You can use this to log or restart workers.
- **cluster.worker**: A reference to the worker process in the worker code, which can be used for communication or management.
- **cluster.setupMaster()**: Used to configure master settings, such as setting the exec path or the env for worker processes.

## Why Use the Cluster Module?

Here are the main reasons you'd use the cluster module in your Node.js application:

### 1. Multi-Core CPU Utilization

Node.js is single-threaded by default, meaning it can only execute one task at a time (i.e., one request per event loop cycle). This is fine for low to moderate traffic applications, but it limits scalability in multi-core systems.

The cluster module allows you to utilize all CPU cores by creating multiple worker processes that can run on different cores, effectively allowing your application to handle multiple requests concurrently.

For example, if your system has 4 CPU cores, the cluster module allows you to spawn 4 worker processes, each running on a separate core. This increases the throughput of your server and makes it more efficient.

### 2. Load Balancing

Node.js, by default, uses a single process to handle incoming HTTP requests. This can quickly become a bottleneck as traffic increases.

By forking multiple workers, the cluster module allows load balancing: incoming requests are distributed across the workers (often automatically done by the operating system's kernel). This helps to scale the application efficiently across multiple CPU cores.

### 3. Fault Tolerance and Process Recovery

If a worker crashes (e.g., due to an error or exception), it will not affect other workers. The master process can detect when a worker exits and can automatically fork a new worker to replace it, ensuring minimal downtime.

This increases the resilience of your application and makes it more fault-tolerant.

### 4. Handling More Requests Simultaneously

With clustering, the system can handle multiple requests in parallel, each handled by a different worker process. This is especially useful in scenarios where the application needs to handle high concurrency, such as an API server or web server under heavy load.

### 5. Improved Performance for CPU-Intensive Operations

If your application performs CPU-heavy operations (like data processing, image manipulation, etc.), clustering can help distribute the load across multiple processes, ensuring that the server remains responsive even under heavy computation.

### 6. Simplicity and Code Reusability

The cluster module allows you to write both master and worker logic in a single script. The process of forking and managing workers is abstracted, so you don't need to create separate scripts for each worker. This makes it easier to manage your codebase.
