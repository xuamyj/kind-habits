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

// -------------------------------
// HOME: GET
// -------------------------------
app.get('/', (req, res) => {
  const html = readFileSync('index.html'); 
  res.set('Content-Type', 'text/html');
  res.send(html);
})

// -------------------------------
// view all boards for [user]: GET
// -------------------------------
app.get('/view_boards/:userId', async (req, res) => {
  const userId = req.params.userId;

  // Query the "public.boards" table
  const { data: boards, error } = await supabase.from('boards').select('*').eq('user_id', userId);

  if (error) {
    console.error(error)
  } else {
    console.log("\nBoards: [");
    for (const board of boards) {
      console.log(`${board.id} - ${board.board_name} - ${board.board_description} - ${board.board_color},`);
    }
    console.log("]")
  }

  const html = readFileSync('test-html/view_boards.html'); 
  res.set('Content-Type', 'text/html');
  res.send(html);
})

// -------------------------------
// create new [board] for [user]: POST
// -------------------------------
app.get('/create_board', (req, res) => {
  const html = readFileSync('test-html/create_board_FORM.html'); 
  res.set('Content-Type', 'text/html');
  res.send(html);
})
// app.post('/create_board/:userId', async (req, res) => {
//   const userId = req.params.userId;
  
app.post('/create_board', async (req, res) => {
  const userId = testUserId;

  const board_name = req.body.board_name;
  const board_description = req.body.board_description;
  const board_color = req.body.board_color;
  
  console.log("\nCreating board:");
  console.log(`board_name: ${board_name}`); 
  console.log(`board_description: ${board_description}`); 
  console.log(`board_color: ${board_color}`); 

  // Define the new row data
  const newRowData = {
    board_name: board_name,
    board_description: board_description,
    board_color: board_color,
    user_id: userId,
  }

  // Insert the new row into the "public.boards" table
  const { data, error } = await supabase.from('boards').insert(newRowData)

  if (error) {
    console.error(error)
  } else {
    console.log(`Success: ${data}`)
  }

  res.send(`Finish!`);
})

// -------------------------------
// view board info for [board]: GET
// -------------------------------
app.get('/view_board_info/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  // Query the "public.boards" table
  const { data: boards, error } = await supabase.from('boards').select('*').eq('id', boardId);

  if (error) {
    console.error(error)
  } else if (boards.length === 0){
    console.log(`\nBoard ${boardId} does not exist!`); 
  } else {    
    const board = boards[0];

    console.log(`\nBoard ${board.id}:`);
    console.log(`Board name: ${board.board_name}`);
    console.log(`Board description: ${board.board_description}`);
    console.log(`Board color: ${board.board_color}`);
  }

  const html = readFileSync('test-html/view_board_info.html'); 
  res.set('Content-Type', 'text/html');
  res.send(html);
})

// -------------------------------
// edit board info for [board]: POST - check board exists?
// -------------------------------


// -------------------------------
// delete board for [board]: POST - check board exists? 
// -------------------------------


// -------------------------------
// view current month of days on [board]: GET
// -------------------------------
app.get('/view_curr_month/:boardId', (req, res) => {
  const boardId = req.params.boardId;
  res.send(`View curr month for ${boardId}!`);
})

// -------------------------------
// view [month] of days on [board]: GET
// -------------------------------


// -------------------------------
// create new [day] on [board]: POST
// -------------------------------


// -------------------------------
// view day for [day]: GET
// -------------------------------
app.get('/view_day/:dayId', (req, res) => {
  const dayId = req.params.dayId;
  res.send(`View day for ${dayId}!`);
})

// -------------------------------
// edit day for [day]: POST - check day exists? 
// -------------------------------


// -------------------------------
// delete day for [day]: POST - check day exists? 
// -------------------------------

  
  // view profile: GET
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
