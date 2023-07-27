// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
// and `npm install --save @types/node`
import { readFileSync } from 'fs';
import * as http from 'http'; 

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {  
    const html = readFileSync('index.html');  
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html'); 
    res.end(html);
  } else if (req.url === "/other") { 
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  } 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
