var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs");
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var employeeModel = require("./source/models/employee");
var auth = require("./source/middleware/auth");

var JWT_SECRET_KEY = 'ysmasd7a68764mllsdf834n';

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

 app.get('/listEmployees', auth, function (req, res) {  
    try {
        employeeModel.find({}, (err, employees) => {
            res.send(employees);
        });
    } catch (error) {
      res.status(500).send(error);
    }
 });

 app.post('/addEmployee', function (req, res) {
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

 app.post("/login", (req, res) => {
  // Validate User Here
  // Then generate JWT Token
  let data = {
      username: 'bala@gmail.com',
      password: 'test1234',
  }

  const token = jwt.sign(data, JWT_SECRET_KEY);

  res.send(token);
});

/** Server */
connectDB().catch(err => console.log(err));
const httpServer = http.createServer(app);
const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));