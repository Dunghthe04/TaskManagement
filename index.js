const express= require("express");
//doc body tu front end gui len
const bodyParser=require("body-parser")
require("dotenv").config();
const database= require("./config/database")

database.connect();

//route
const taskRoute = require('./api/v1/routes/index.route')

const app= express();
const port= process.env.PORT;

//parse application/json
app.use(bodyParser.json())
taskRoute(app)

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
    
})