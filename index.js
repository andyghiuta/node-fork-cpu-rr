const numCPUs = require('os').cpus().length;
const { fork } = require('child_process');
// forks as many as cpus
const forks = [];
for (let i = 0; i < numCPUs; i++) {
  forks.push(fork(`${__dirname}/worker.js`));
  forks[i].on('message', (m) => {
    console.log('PARENT got message', m);
    // at the last item processed disconnect all forks
    disconnectIfLast();
  });
  forks[i].on('exit', (m) => {
    // at the last item processed disconnect all forks
    disconnectIfLast();
  });
}

const disconnectAll = () => {
  for (let i = 0; i < numCPUs; i++) {
    forks[i].disconnect();
  }
}
const disconnectIfLast = () => {
  if (c === 1) {
    disconnectAll();
  }
  c -= 1;
}
// "data" count to process
let c = numCPUs * 2;
// "send work"
for (let i = 0; i < c; i++) {
  forks[i % numCPUs].send({ hello: `world ${i}` });
}