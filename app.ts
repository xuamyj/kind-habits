// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
// and `npm install --save @types/node`
import * as http from 'http'; 

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
