const connection = require("../sql/connection");

//GET list all questions found in database
let allQuestions = (req, res) => {
  console.log("Inside the GET list allQuestions function",req.params);
  connection.query("SELECT * FROM questionsTable", (error, rows) => {
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
  let sql = "SELECT id, question FROM questionsTable WHERE id =?" //sql command to send to the database
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

//DO I NEED A FUNCTION TO GET A RANDOM ID?


//PUT/:id  edit the question by id
let editQuestion = (req, res) => {
  console.log("Inside the editQuestion function", req.params.id);
  let id = req.params.id
  let updQuestion= req.body
  let sql = "UPDATE questionsTable SET question=? WHERE id=?" 
  let params = [updQuestion,id]
  
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
  let newQuestion = req.body
  
  let sql = `INSERT INTO questionsTable (question) VALUES (?);`
  let params = [newQuestion];

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
  let sql = "DELETE FROM questionsTable WHERE id = ?"
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


module.exports = { allQuestions, questionById, editQuestion, addQuestion, deleteQuestion};