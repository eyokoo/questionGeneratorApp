/**
 * DISCLAIMER: this is not production grade. Would use AuthOnly to set up authentication if time was available to set it up.
 * this file has the route, controller, and middleware all in one. usually these would be 3 or 4 separate files
 * simple authentication setup in your own Mysql Database. Remember that in your own database you are storing the password hash not the password itself.
To store the first user, you can use the createUser end point without authentication the first time you run your application to seed the app with a user that your admin user that you know the password for.
 */
const express = require("express");
const router = express.Router(); //getting the router from express

//to support parsing json
const bodyParser = require("body-parser");

//to connect to the sql database
const db = require("./sql/connection");

//to get the password hash, since our database does not store the password directly
const bcrypt = require("bcrypt");

//used to sign and verify JWT
const jwt = require('jsonwebtoken');

//the JWT secret that is used when signing JWT
const jwtSecret = process.env.JWT_SECRET


isAdmin = (req, res, next) => {
  // if (req.isAdmin) {
    
  // } else {
  //   res.status(401).send("Unauthorization");
  // }
}


//the middleware function to call when processing an authorization URL
checkJwt = (req, res, next) => {
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
  // jwt.verify(token, jwtSecret, (err, decoded) => {
  //   //if we get an error message then the token is not valid
  //   if (err) {
  //     console.log("Did not verify jwt", err)
  //     return res.status(401).send("Unauthorized!");
  //   }

  //   //the token is valid, store, the username from the token in the request, so that it is
  //   //available to all following this call
  //   console.log(decoded);
  //   req.username = decoded.username;
  //   req.isAdmin = decoded.role == 'admin'
  //   //call the next middleware function in the chain
    next();
    //   });
    // };
  }
    

/**
 * GET /everyone
 * 
 * Returns a message to everyone, no authentication required
 */
router.get("/everyone", (req, res) => {
  res.json("Everyone can");
})

/**
 * Returns a success message that includes the username ased on the JWT Token
 * This path is only available to authenticated users
 * 
 * GET /authOnly
 */
router.get("/authOnly", checkJwt, (req, res) => {
  //return a message that show that they are logged in, and tell them the username you see
  res.json("Only the special people can, we see you as " + req.username);
})

/**
 * Generates a signed JWT token that can be used as evidence that the user is logged in
 * POST /login -d {
 *    "username" : "bob",
 *    "password" : "password"
 * }
 * 
 * Returns a JWT Token
 */
//login call, that passes in the username and password
//if you are using a service that manages the username and passwords
//then you would not have this available
router.post("/login", (req, res) => {
  //note that we do not print the body, since we do not want to leak the password in our logs
  console.log("POST /login", req.body.username);

  //read the username and password from the post body
  const username = req.body.username;
  const password = req.body.password;

  //select the username, role and stored hash from the db for the user passed in
  db.query("SELECT username, password_hash, role from users where username = ?", [username], (err, rows) => {

    //assumes the password provided in the request is bad
    let goodPassword = false;
    let role;

    //if the database failed then log an error
    if (err) {
      console.error("Error when querying the db", err);
    }

    //if the database returned too many rows then log the error
    if (rows.length > 1) {
      console.error("Found too many rows with the username", username);
    }

    //if the database returned no rows, then log it, but its not an error
    //maybe the username never signed up with our application
    if (rows.length == 0) {
      console.log("Did not find a row with the username", username);
    }

    //if query ran without an error, and only 1 row came back,
    //then check the stored hash against the password provided in the request
    if (!err && rows.length == 1) {
      row = rows[0];
     
      //get the stored hash from the database
      let hash = row.password_hash

      //get the role from the database
      role = row.role;

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
        username: username,
        role: role
      };
      //sign the token using the JWT secret
      const accessToken = jwt.sign(unsignedToken, jwtSecret);

      //send the signed token back
      res.json(accessToken);
    } else {
      //if the password provided was not good, or was not able to be verified
      //send an authorized message and code back
      res.status(401).send("Unauthorized!")
    
    }

  });
})

/**
 * This for creating a new user. The JWT token is checked for appropriated role
 * 
 * POST /createUser {
 *    "username" : "bob",
 *    "password" : "somePassword",
 *    "confirmPassword" : "somePassword"
 * }
 */

//create a user in the database, note that we check that the JWT token is valid,
//and that the JWT token has admin role
router.post("/createUser", [checkJwt,isAdmin],(req,res)=>{
  //note that we do not include the password in the log
  console.log("POST /createUser", req.body.username);
  let username = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  //make sure that the password and confirm password are the same
  if(password !== confirmPassword){
    return res.status(400).send("Passwords do not match");
  }

  //generate the hash of the password that will be stored in the database
  let passwordHash = bcrypt.hashSync(password,10);
  let sql = "INSERT INTO users(username, password_hash, role) values (?, ?, ?);"
  db.query(sql, [username, passwordHash, 'user'], (err, rows) =>{

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
})

module.exports = {router, isAdmin, checkJwt};