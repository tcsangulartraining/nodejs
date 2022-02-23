var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs");
var mongoose = require('mongoose');
var employeeModel = require("./source/models/employee");

// getting-started.js
async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017/TCS-Node');
}

/** Takes care of JSON data */
app.use(express.json());

app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //    console.log( data );
       res.end( data );
    });
 });

 app.get('/listEmployees', function (req, res) {  
    try {
        employeeModel.find({}, (err, employees) => {
            res.send(employees);
        });
    } catch (error) {
      res.status(500).send(error);
    }
 });

 app.get('/addEmployee', function (req, res) {
    const employee = new employeeModel({
        name: "Bala",
        mobile: "9976664488"
    });
  
    try {
      employee.save();
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
 });

/** Server */
connectDB().catch(err => console.log(err));
const httpServer = http.createServer(app);
const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));