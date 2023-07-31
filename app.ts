// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
// and `npm install --save @types/node`
import { readFileSync } from 'fs';
import * as http from 'http'; 
import express from 'express';
import { engine } from 'express-handlebars';

import { createClient } from '@supabase/supabase-js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
const hostname = '127.0.0.1';
const port = 3000;

require("dotenv").config();
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const testUserId = process.env.TEST_USER_ID
const emptyUserId = process.env.EMPTY_USER_ID


// -------------------------------
// Home: GET
// -------------------------------
app.get('/', (req, res) => {
  res.render('home', { testUserId: testUserId, emptyUserId: emptyUserId });
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

  res.render('view_boards', { userId: userId, boards: boards });
})

// -------------------------------
// create new [board] for [user]: POST
// -------------------------------
app.get('/create_board/:userId', (req, res) => {
  const userId = req.params.userId;

  res.render('create_board_FORM', { userId: userId });
})
app.post('/create_board/:userId', async (req, res) => {
  const userId = req.params.userId;

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
  }
  res.send(`Finish create board!`);
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
    res.render('id_not_found', { id: boardId });
  } else {    
    const board = boards[0];

    console.log(`\nBoard ${board.id}:`);
    console.log(`Board name: ${board.board_name}`);
    console.log(`Board description: ${board.board_description}`);
    console.log(`Board color: ${board.board_color}`);
    res.render('view_board_info', { boardId: boardId, board: board });
  }
})

// -------------------------------
// edit board info for [board]: POST - check board exists?
// -------------------------------
app.get('/edit_board_info/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  
  // Query the "public.boards" table
  const { data: boards, error } = await supabase.from('boards').select('*').eq('id', boardId);

  if (error) {
    console.error(error)
  } else if (boards.length === 0){
    console.log(`\nBoard ${boardId} does not exist!`); 
    res.render('id_not_found', { id: boardId });
  } else {    
    const board = boards[0];
    res.render('edit_board_info_FORM', { boardId: boardId, board: board });
  }
})
app.post('/edit_board_info/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  // Should POST also check if board exists? TODO
  const input_name = req.body.board_name;
  const input_description = req.body.board_description;
  const input_color = req.body.board_color;

  console.log("\nCreating board:");
  console.log(`input_name: ${input_name}`); 
  console.log(`input_description: ${input_description}`); 
  console.log(`input_color: ${input_color}`); 

  const { data: boards, error } = await supabase
  .from('boards')
  .update({ board_name: input_name, board_description: input_description, board_color: input_color})
  .eq('id', boardId);
  
  if (error) {
    console.error(error)
  }
  res.send(`Finish edit board info!`);
})

// -------------------------------
// delete board for [board]: POST - check board exists? 
// -------------------------------
app.get('/delete_board/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  
  // Query the "public.boards" table
  const { data: boards, error } = await supabase.from('boards').select('*').eq('id', boardId);

  if (error) {
    console.error(error)
  } else if (boards.length === 0){
    console.log(`\nBoard ${boardId} does not exist!`); 
    res.render('id_not_found', { id: boardId });
  } else {    
    const board = boards[0];
    res.render('delete_board_FORM', { boardId: boardId, board: board });
  }
})
app.post('/delete_board/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  // Should POST also check if board exists? TODO
  console.log(`\nDeleting board: ${boardId}`);

  const { data: deletedBoard, error } = await supabase
  .from('boards')
  .delete()
  .eq('id', boardId);
  
  if (error) {
    console.error(error)
  }
  res.send(`Finish delete board!`);
})

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
