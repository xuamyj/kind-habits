// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
// and `npm install --save @types/node`
import { readFileSync } from 'fs';
import * as http from 'http'; 
import express from 'express';
import { engine } from 'express-handlebars';

import { createClient } from '@supabase/supabase-js'
import { Database } from './types/supabase'

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
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

const testUserId = process.env.TEST_USER_ID
const emptyUserId = process.env.EMPTY_USER_ID

function getToday({yearMonthOnly = false}): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const date = today.getDate().toString().padStart(2, '0')
  // const month = ('0' + (today.getMonth() + 1)).slice(-2);
  // const date = ('0' + today.getDate()).slice(-2);

  if (yearMonthOnly) {
    return `${year}${month}`;
  } else {
    return `${year}${month}${date}`;
  }
}

async function tryGetBoardFromBoardId(boardId: string) {
  // Query the "public.boards" table
  const { data: boards, error } = await supabase.from('boards').select('*').eq('id', boardId);

  if (error) {
    console.error(error);
    throw error;
  } else if (boards.length === 0){
    console.log(`\nBoard ${boardId} does not exist!`);
    return undefined;
  } else {
    const board = boards[0];

    console.log(`\nBoard ${board.id}:`);
    console.log(`Board name: ${board.board_name}`);
    console.log(`Board description: ${board.board_description}`);
    console.log(`Board color: ${board.board_color}`);

    return board;
  }
}

type addDayFormSubmits = {
  year_month_day: string;
  done_today?: string;
  color_not_done: string;
  day_notes: string; 
}

async function addBoardDay(board_id, year_month_day, done_today, color_not_done, day_notes) {
  console.log("\nAdding day:");
  console.log(`board_id: ${board_id}`); 
  console.log(`year_month_day: ${year_month_day}`); 
  console.log(`done_today: ${done_today}`); 
  console.log(`color_not_done: ${color_not_done}`); 
  console.log(`day_notes: ${day_notes}`); 

  // Define the new row data
  const newRowData = {
    board_id: board_id,
    year_month_day: year_month_day,
    done_today: done_today,
    color_not_done: color_not_done,
    day_notes: day_notes,
  }

  // Insert the new row into the "public.boards" table
  const { data, error } = await supabase.from('board_days').insert(newRowData);

  if (error) {
    console.error(error);
    throw error;
  }
}

async function editBoardDay(boardDayId, done_today, color_not_done, day_notes) {
  console.log("\nEditing day:");
  console.log(`done_today: ${done_today}`); 
  console.log(`color_not_done: ${color_not_done}`); 
  console.log(`day_notes: ${day_notes}`); 

  const { data: boards, error } = await supabase
  .from('board_days')
  .update({ done_today: done_today, color_not_done: color_not_done, day_notes: day_notes})
  .eq('id', boardDayId);
  
  if (error) {
    console.error(error);
    throw error;
  }
}


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

type createBoardFormSubmits = {
  board_name: string;
  board_description: string;
  board_color: string; 
}
app.post('/create_board/:userId', async (req, res) => {
  const userId = req.params.userId;

  const body: createBoardFormSubmits = req.body;
  const { board_name, board_description, board_color } = body;
  
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

  const board = await tryGetBoardFromBoardId(boardId);
  if (board === undefined) {
    res.render('id_not_found', { id: boardId });
  } else {
    res.render('view_board_info', { boardId: boardId, board: board });
  }
})

// -------------------------------
// edit board info for [board]: POST - check board exists?
// -------------------------------
app.get('/edit_board_info/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  
  const board = await tryGetBoardFromBoardId(boardId);
  if (board === undefined) {
    res.render('id_not_found', { id: boardId });
  } else {
    res.render('edit_board_info_FORM', { boardId: boardId, board: board });
  }
})

type editBoardFormSubmits = {
  input_name: string;
  input_description: string;
  input_color: string; 
}
app.post('/edit_board_info/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  const body: editBoardFormSubmits = req.body;
  const { input_name, input_description, input_color } = body;

  console.log("\nEditing board:");
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

  const board = await tryGetBoardFromBoardId(boardId);
  if (board === undefined) {
    res.render('id_not_found', { id: boardId });
  } else {
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
  const yearMonth = getToday({yearMonthOnly: true});
  console.log(`Today's yearMonth: ${yearMonth}`);

  res.send(`View curr month for ${boardId}!`);
})

// -------------------------------
// view [month] of days on [board]: GET
// -------------------------------
app.get('/view_month/:boardId/:yearMonth', (req, res) => {
  const boardId = req.params.boardId;
  const yearMonth = req.params.yearMonth;
  console.log(`Viewing yearMonth: ${yearMonth}`);

  res.send(`View ${yearMonth} month for ${boardId}!`);
})

// -------------------------------
// add today on [board]: POST
// -------------------------------
app.get('/add_today/:boardId', async (req, res) => {
  const boardId = req.params.boardId;
  const yearMonthDay = getToday({yearMonthOnly: false});
  console.log(`Today's yearMonthDay: ${yearMonthDay}`);

  const board = await tryGetBoardFromBoardId(boardId);
  if (board === undefined) {
    res.render('id_not_found', { id: boardId });
  } else {
    res.render('add_today_FORM', { boardId: boardId, board: board, yearMonthDay: yearMonthDay });
  }
}) 
app.post('/add_today/:boardId', async (req, res) => {
  const boardId = req.params.boardId;

  const body: addDayFormSubmits = req.body;
  const { year_month_day, color_not_done, day_notes } = body;
  const done_today = (body.done_today === 'true')
 
  // check that boardId + year_month_day combo doesn't exist
  const { data: boardDays, error } = await supabase.from('board_days').select('*').eq('board_id', boardId).eq('year_month_day', year_month_day);

  if (error) {
    console.error(error);
  } else if (boardDays.length === 0){
    // add day
    await addBoardDay(boardId, year_month_day, done_today, color_not_done, day_notes);
    
  } else {
    // edit existing day
    const boardDay = boardDays[0];
    await editBoardDay(boardDay.id, done_today, color_not_done, day_notes);

  }
  res.send(`Finish add today!`);
})

// -------------------------------
// edit past [day] on [board]: POST 
// -------------------------------


// -------------------------------
// view day for [day]: GET
// -------------------------------
app.get('/view_day/:dayId', (req, res) => {
  const dayId = req.params.dayId;
  res.send(`View day for ${dayId}!`);
})

  
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
