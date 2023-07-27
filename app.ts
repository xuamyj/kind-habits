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

  // view all boards for [user]: GET
  // create new [board] for [user]: POST

  // view board info for [board]: GET
  // edit board info for [board]: POST - check board exists?
  // delete board for [board]: POST - check board exists? 
  
  // view current month of days on [board]: GET
  // view [month] of days on [board]: GET
  // create new [day] on [board]: POST

  // view day for [day]: GET
  // edit day for [day]: POST - check day exists? 
  // delete day for [day]: POST - check day exists? 
  
  // view profile: GET
  // create profile: POST
  // edit profile: POST
  
  // create account: POST
  // login: POST
  // logout: POST

  } else if (req.url === "/other") { 
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  } 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
