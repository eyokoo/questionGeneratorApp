const express = require("express");
const router = express.Router(); //getting the router from express
const controller = require("../controller/questionsCtrl.js"); //whatever is being exported from the controller file path is being put into the variable controller
const { signIn, signUp } = require("../controller/auth");

const checkJwt = require("../controller/auth").authenticateJwtToken;
// const isAdmin = require("../auth").isAdmin

//Questions
router.get("/questions/random", [checkJwt], controller.randomQuestion); //GET returns a random question by id in my database
router.get("/questions/:id", [checkJwt], controller.questionById); // GET returns the question by id in my database
router.get("/questions/category", [checkJwt], controller.questionByC);
router.get("/questions", [checkJwt], controller.allQuestions); // GET returns the list of questions in my database
router.put("/questions/:id", [checkJwt], controller.editQuestion); //PUT should call the editQuestion function, and update the question in my database
router.post("/questions", [checkJwt], controller.addQuestion); //POST should call the addQuestion function, and add a question to my database
router.delete("/questions/:id", [checkJwt], controller.deleteQuestion); // DELETE should call the deleteQuestion function, and delete the question from my database

//Auth
router.post("/auth/signin", signIn); //POST should call the signIn function
router.post("/auth/signup", signUp); //POST should call the signUp function

// router.put("/users/:id", [checkJwt], controller.editUser);//PUT should call the editUser function, and edit a user to my database
// router.delete("/users/:id", [checkJwt], controller.deleteUser);// DELETE should call the deleteUser function, and delete the user from my database

module.exports = router; //need to export this router so that is becomes available to the rest of your code
//what im exporting here is what i am importing in my questions.js file -->app.use(require("./routes/questions"));
