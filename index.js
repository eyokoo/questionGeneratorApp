const express = require("express");
const bodyParser = require("body-parser"); //by default this app should be assuming request body data as json
const app = express();
const cors = require ('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(require("./routes/questions")); //importing the routes module

app.get('/', (req, res) => {
  res.send("Welcome to my Server")
});


const PORT = process.env.PORT || 9000
app.listen(PORT,() => {
  console.log("Listening to the port", PORT);
});
