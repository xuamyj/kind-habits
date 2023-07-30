// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
// and `npm install --save @types/node`
import { readFileSync } from 'fs';
import * as http from 'http'; 
import express from 'express';

import { createClient } from '@supabase/supabase-js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const hostname = '127.0.0.1';
const port = 3000;

require("dotenv").config();
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const testUserId = process.env.TEST_USER_ID

app.get('/', (req, res) => {
  const html = readFileSync('index.html'); 
  res.set('Content-Type', 'text/html');
  res.send(html);
})

// view all boards for [user]: GET
app.get('/view_boards/:userId', async (req, res) => {
  const userId = req.params.userId;
  // Query the "public.boards" table
  const { data: boards, error } = await supabase.from('boards').select('*').eq('user_id', userId);

  if (error) {
    console.error(error)
  } else {
    console.log(`\nBoards: ${boards}`)
  }
  // res.send(`View all boards for ${userId}!`);

  const html = readFileSync('test-html/create_board.html'); 
  res.set('Content-Type', 'text/html');
  res.send(html);
})
  
// create new [board] for [user]: POST
// app.post('/create_board/:userId', async (req, res) => {
//   const userId = req.params.userId;
  
app.post('/create_board', async (req, res) => {
  const board_name = req.body.board_name;
  const board_description = req.body.board_description;
  const board_color = req.body.board_color;
  
  console.log("\nHI");
  // console.log(`userId: ${userId}`); 
  console.log(`board_name: ${board_name}`); 
  console.log(`board_description: ${board_description}`); 
  console.log(`board_color: ${board_color}`); 

  // Define the new row data
  const newRowData = {
    board_name: board_name,
    board_description: board_description,
    board_color: board_color,
    user_id: testUserId,
  }

  // Insert the new row into the "public.boards" table
  const { data, error } = await supabase.from('boards').insert(newRowData)

  if (error) {
    console.error(error)
  } else {
    console.log(`Data: ${data}`)
  }

  res.send(`Finish!`);
})

// view board info for [board]: GET
app.get('/view_board_info/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  res.send(`View board info for ${boardId}!`);
})

  // edit board info for [board]: POST - check board exists?
  // delete board for [board]: POST - check board exists? 
  
// view current month of days on [board]: GET
app.get('/view_curr_month/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  res.send(`View curr month for ${boardId}!`);
})

  // view [month] of days on [board]: GET
  // create new [day] on [board]: POST

// view day for [day]: GET
app.get('/view_day/:dayId', (req, res) => {
  const dayId = req.params.dayId;
  res.send(`View day for ${dayId}!`);
})

  // edit day for [day]: POST - check day exists? 
  // delete day for [day]: POST - check day exists? 
  
// view profile: GET
app.get('/view_profile/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`View profile for ${userId}!`);
})

  // create profile: POST
  // edit profile: POST
  
  // create account: POST
  // login: POST
  // logout: POST

app.get('/test', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('Hello World');
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
