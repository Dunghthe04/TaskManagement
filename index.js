const express= require("express");
//doc body tu front end gui len
const bodyParser=require("body-parser")
const cors=require("cors")// chia sẻ nguồn tài nguyên chung
require("dotenv").config();
const database= require("./config/database")
const cookieParser = require('cookie-parser')

database.connect();

//route
const taskRoute = require('./api/v1/routes/index.route')

const app= express();
const port= process.env.PORT;

//cors
app.use(cors())

//cookie parser
app.use(cookieParser());


//parse application/json
app.use(bodyParser.json())
taskRoute(app)

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
    
})