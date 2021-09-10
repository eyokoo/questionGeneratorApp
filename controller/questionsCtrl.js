const connection = require("../sql/connection");

//GET list all questions found in database
let allQuestions = (req, res) => {
  console.log("Inside the GET list allQuestions function",req.params);
  connection.query("SELECT * FROM questions_table", (error, rows) => {
    if (error) {
      console.log("Failed to list questions", error);
      res.sendStatus(500);
    } else {
      res.json(rows);
    }
  })
}

//GET/:id  get question by id
let questionById = (req, res) => {
  console.log("Inside the GET questionById function", req.params.id);
  let id = req.params.id
  let sql = "SELECT Q.id, question, C.category FROM questions_table AS Q INNER JOIN categories_table AS C ON C.id = Q.category_id WHERE Q.id = ?" //sql command to send to the database
  let params = [id];
  
  connection.query(sql, params, (error, rows) => {//make a connection to send the query
    console.log("This is what's inside ROWS:", rows)
    if (error) {
      console.error("Failed to query the db", error);// if we get an error from the db
      res.sendStatus(500);
    } else if (!rows || rows.length == 0) {    // if we get no rows from the database
      res.sendStatus(404);
    } else {
      res.send(rows[0]);
    }
  })
}

let questionByC = (req,res) => {
console.log("Inside the GET questionsByC function",req.params.category)
let questions = req.params.category
let sql = "SELECT Q.id, question, C.category FROM questions_table AS Q INNER JOIN categories_table AS C ON C.id = Q.category_id WHERE C.id = ?"
let params = [questions]

connection.query(sql, params, (error, rows) => {//make a connection to send the query
  console.log("This is what's inside ROWS:", rows)
  if (error) {
    console.error("Failed to query the db", error);// if we get an error from the db
    res.sendStatus(500);
  } else if (!rows || rows.length == 0) {    // if we get no rows from the database
    res.sendStatus(404);
  } else {
    res.send(rows[0]);
  }
})
}

let randomQuestionByC = (req,res) => {
  console.log("Inside the GET randomQuestionByC function",req.params.category)
  let question = req.params.category
  let sql = "SELECT Q.id, question, C.category FROM questions_table AS Q INNER JOIN categories_table AS C ON C.id = Q.category_id ORDER BY rand() limit 1"
  let params = [question] //do i need to add categoy in here?
  
  connection.query(sql, params, (error, rows) => {//make a connection to send the query
    console.log("This is what's inside ROWS:", rows)
    if (error) {
      console.error("Failed to query the db", error);// if we get an error from the db
      res.sendStatus(500);
    } else if (!rows || rows.length == 0) {    // if we get no rows from the database
      res.sendStatus(404);
    } else {
      res.send(rows[0]);
    }
  })
  }

//GET/:id  get question by id at random
let randomQuestion = (req, res) => {
  console.log("Inside the GET randomQuestion function", req.params.id);
  let id = req.params.id
  let sql = "SELECT * FROM questions_table ORDER BY rand() limit 1" //sql command to send to the database
  let params = [id];
  
  connection.query(sql, params, (error, rows) => {//make a connection to send the query
    console.log("This is what's inside ROWS:", rows)
    if (error) {
      console.error("Failed to query the db", error);// if we get an error from the db
      res.sendStatus(500);
    } else if (!rows || rows.length == 0) {    // if we get no rows from the database
      res.sendStatus(404);
    } else {
      res.send(rows[0]);
    }
  })
}

//PUT/:id  edit the question by id
let editQuestion = (req, res) => {
  console.log("Inside the editQuestion function", req.params.id);
  let id = req.params.id
  let updQuestion = req.body.question
  let updCategory = req.body.category_id
  let sql = "UPDATE questions_table SET question=?, category_id=? WHERE id=?"  //sql command to send to the database to update the questions table
  let params = [updQuestion, updCategory, id]
  
  connection.query(sql,params,(error) => {
    if (error){
      console.log("Failed to update question", error);
      res.sendStatus(500);
    }else {
      res.send("Success - Question updated!");
    }
  })
}

//POST add a question
let addQuestion = (req, res) => {
  console.log("Inside the addQuestion function", req.body);
  let newQuestion = req.body.question
  let newCategory = req.body.category_id
  
  let sql = `INSERT INTO questions_table (question,category_id) VALUES (?,?);`
  let params = [newQuestion, newCategory];

    connection.query(sql, params, (error, results) => {
      if (error) {
        console.error("Failed to insert new question in the database", error);
        res.sendStatus(500);
      } else {
        res.send(results);
      }
    })
}


//DELETE a question by id
let deleteQuestion = (req, res) => {
  console.log("Inside the deleteQuestion function", req.params.id)
  let id = req.params.id
  let sql = "DELETE FROM questions_table WHERE id = ?"
  let params = [id];

    connection.query(sql, params, (error) => {
      if (error) {
        console.error("Failed to delete question in the database", error);
        res.sendStatus(500);
      } else {
        res.send("Success - You deleted a question!");
      }
    })
}


module.exports = { allQuestions, questionById, questionByC, randomQuestion, randomQuestionByC,editQuestion, addQuestion,  deleteQuestion}; //add AddUser