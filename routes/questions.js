const express = require("express");
const router = express.Router(); //getting the router from express
const controller = require("../controller/questionsCtrl.js"); //whatever is being exported from the controller file path is being put into the variable controller


const checkJwt = require("../auth").checkJwt
const isAdmin = require("../auth").isAdmin

router.get("/questions", [checkJwt], controller.allQuestions); // GET returns the list of questions in my database
router.get("/questions/:id", [checkJwt], controller.questionsById);// GET returns the question by id in my database

router.put("/questions/:id",[checkJwt, isAdmin], controller.editQuestion);//PUT should call the editQuestion function, and update the question in my database

router.post("/questions", [checkJwt, isAdmin],controller.addQuestion);//POST should call the addQuestion function, and add a question to my databse


router.delete("/question/:id", [checkJwt, isAdmin], controller.deleteQuestion);// DELETE should call the deleteQuestion function, and delete the question from my database


module.exports = router; //need to export this router so that is becomes available to the rest of your code
//what im exporting here is what i am importing in my questions.js file -->app.use(require("./routes/questions"));