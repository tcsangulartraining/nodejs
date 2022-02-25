var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs");
var mongoose = require('mongoose');
var socketIO = require('socket.io');
var jwt = require('jsonwebtoken');
var employeeModel = require("./source/models/employee");
var auth = require("./source/middleware/auth");
var WebSocketServer = require('websocket').server;

var JWT_SECRET_KEY = 'ysmasd7a68764mllsdf834n';
const PORT = 3000;

// getting-started.js
async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017/TCS-Node');
}

//MongoDB Connection Initialization
connectDB().catch(err => console.log(err));
//Creating Http Server for Node
const httpServer = http.createServer(app);

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

// Initialising Server in port 3000
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

//Mapping websocket with server
const wsServer = new WebSocketServer({
  httpServer: httpServer
});

wsServer.on('request', function(request) {
  const connection = request.accept(null, request.origin);
  connection.on('message', function(message) {
    console.log('Received Message:', message.utf8Data);
    connection.sendUTF('Hi this is WebSocket server!');
  });
  connection.on('close', function(reasonCode, description) {
      console.log('Client has disconnected.');
  });
});