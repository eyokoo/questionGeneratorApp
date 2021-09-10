const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getUserByEmail, createUser } = require("./users");
const connection = require("../sql/connection");

function signIn(req, res) {
//note that we do not print the body, since we do not want to leak the password in our logs
console.log("POST /signin", req.body.email);

//read the name and password from the post body
const email = req.body.email;
const password = req.body.password;

//select the username, role and stored hash from the db for the user passed in
connection.query("SELECT id, name, email, password FROM users WHERE email = ?", [email], (err, rows) => {

  //assumes the password provided in the request is bad
  let goodPassword = false;

  //if the database failed then log an error
  if (err) {
    console.error("Error when querying the db", err);
    res.status(400).send("Incorrect email or password.");
    return;
  }

  // //if the database returned too many rows then log the error
  // if (rows.length > 1) {
  //   res.status(400).send("User already exists.")
  //   console.error("Found too many rows with the username", name);
  // }

  //if the database returned no rows, then log it, but its not an error
  //maybe the username never signed up with our application
  if (rows.length == 0) {
    res.status(400).send("User does not exist.")
    console.log("Did not find a row with the email", email);
    return
  }

  //if query ran without an error, and only 1 row came back,
  //then check the stored hash against the password provided in the request
  if (!err && rows.length == 1) {
    row = rows[0];
   
    //get the stored hash from the database
    let hash = row.password

    //check that the hash in the database matched the password provided
    goodPassword = bcrypt.compareSync(password, hash);
  }

  //if the password provided is good then return
  //a signed copy of the access token
  if (goodPassword) {
    //the token should include the things that you are sending back to the client
    //which include the username and role
    //not a good idea to send the password or the hash of the password back
    const unsignedToken = {
      id: row.id
    };
    //sign the token using the JWT secret
    const accessToken = jwt.sign(unsignedToken, jwtSecret); //string

    //send the signed token back
    res.json({accessToken, name: row.name});
    return
  } else {
    //if the password provided was not good, or was not able to be verified
    //send an authorized message and code back
    res.status(400).send("Incorrect email or password.")
    return 
  
  }

});
}

function signUp(req, res) {
 //note that we do not include the password in the log
 console.log("POST /signup", req.body.name);
 let name = req.body.name;
 let password = req.body.password;
 let confirmPassword = req.body.confirmPassword;

 //make sure that the password and confirm password are the same
 if(password !== confirmPassword){
   return res.status(400).send("Passwords do not match");
 }

 //generate the hash of the password that will be stored in the database
 let pwEncrypt = bcrypt.hashSync(password,10);
 let sql = "INSERT INTO users(name, email, password) values (?, ?, ?);"
 connnection.query(sql, [name, pwEncrypt, 'user'], (err, rows) =>{

   //if the insert query returned an error, we log the error
   //and return a failed message back
   if(err){
     console.error("Failed to add user", err);
     res.status(500).send("Failed to add user");
   } else {
     //if the insert statement ran without an error, then the user was created
     res.send("User created");
   }
 })
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

function generateJwtToke(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
}

module.exports = { signIn, signUp, authenticateJwtToken };