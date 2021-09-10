const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connection = require("../sql/connection");
const mysql = require("mysql");

function signIn(req, res) {
  //note that we do not print the body, since we do not want to leak the password in our logs
  console.log("POST /signin", req.body.email);

  //read the username and password from the post body
  const email = req.body.email;
  const password = req.body.password;

  //select the username, role and stored hash from the db for the user passed in
  connection.query(
    "SELECT name, email, password FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        res.status(500).send("Error with SQL");
        return;
      }

      const user = results[0];

      if (!user || !comparePasswords(password, user.password)) {
        res.status(400).send("incorrect email or password");
        return;
      }

      const token = generateJwtToken(user.id);
      res.json({ token });
      return;
    }
  );
}

function signUp(req, res) {
  //note that we do not include the password in the log
  console.log("POST /signup", req.body.email);
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  //we need to queries in order for this to work
  //first, make sure the user does not exist
  //second, new user is created (insert into)

  //get the user my email
  const queryToGetUser = mysql.format("SELECT *  FROM users WHERE email = ?", [
    email,
  ]);

  connection.query(queryToGetUser, (error, results) => {
    if (error) {
      res.status(500).send("Error with SQL");
      return;
    }

    const user = results[0];

    if (user) {
      res.status(400).send("email already used");
      return;
    }

    const encryptedPassword = encryptPassword(password);

    //we now know the email hasn't be used before
    //we can safely create (insert into) the new user
    const insertNewUser = mysql.format(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
      [name, email, encryptedPassword]
    );

    connection.query(insertNewUser, (error, results) => {
      if (error) {
        res.status(500).send("Error with SQL");
        return;
      }
      const token = generateJwtToken(results.insertId);
      res.json({ token });
    });
  });
}

//middleware
function authenticateJwtToken(req, res, next) {
  console.log("Processing JWT authentication check");

  // //read the token from the header
  // let token;
  // if (req.headers.authorization) {
  //   let bearer = req.headers.authorization.split(" ");
  //   token = bearer[1];
  // } else {
  //   token = null;
  // }

  // //if the token is valid, there is nothing to check
  // if (!token) {
  //   return res.status(401).send("Unauthorized!");
  // }

  // //verify the token
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   //if we get an error message then the token is not valid
  //   if (err) {
  //     console.log("Did not verify jwt", err)
  //     return res.status(401).send("Unauthorized!");
  //   }

  //   //the token is valid, store, the username from the token in the request, so that it is
  //   //available to all following this call
  //   console.log(decoded);
  //   req.name = decoded.name;
  //   //call the next middleware function in the chain
  next();
  // });
}

// helper functions
function comparePasswords(plainTextPassword, encryptedPassword) {
  const areEqual = bcrypt.compareSync(plainTextPassword, encryptedPassword);
  return areEqual;
}

function encryptPassword(plainTextPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(plainTextPassword, salt);
  return hash;
}

function generateJwtToken(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
}

module.exports = { signIn, signUp, authenticateJwtToken };
