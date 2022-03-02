var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs-extra");
var mongoose = require('mongoose');
const multer  = require('multer');
const bodyParser= require('body-parser');
const upload = multer({ dest: 'tmp/' })
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
/**Rendering the HTML -  Embedded JavaScript (EJS)  */
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', (req, res)=> {
  res.sendFile(__dirname + '/index.html')
})
app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //    console.log( data );
       res.end( data );
    });
 });

 app.get('/listEmployees', function (req, res) {  
    try {
        employeeModel.find({}, (err, employees) => {
            //res.send(employees);
            res.render('index.ejs', { employeesList: employees })
        });
    } catch (error) {
      res.status(500).send(error);
    }
 });

 app.post('/addEmployee', function (req, res) {
  //console.log(req.body)
    const employee = new employeeModel(req.body);
  
    try {
      employee.save();
      //res.send(employee);
      res.redirect('/listEmployees')
    } catch (error) {
      res.status(500).send(error);
    }
 });
 app.put('/updateEmployee', function (req, res) {
  //console.log(req.body)
  try {
      employeeModel.findOneAndUpdate({name:req.body.name}, {
        $set: {
          name: "Vithal",
          mobile: "99999999999"
        }
      },
      {
        upsert: true
      }).then(result => {
        console.log(result);
        //res.redirect('/listEmployees')
          
      });
  } catch (error) {
    res.status(500).send(error);
  }
 });
 app.delete('/deleteEmployee', (req, res) => {
  employeeModel.deleteOne(
    { name: req.body.name }
  )
    .then(result => {
      res.send(req.body.name+" got deleted");
    })
    .catch(error => console.error(error))
})
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

app.post('/fileUploader', upload.single('file'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any 
  console.log(req.file, req.body);
  if (req.file) {
    const path_temp = req.file.path;
    const filePath = 'uploads/' + req.file.originalname;
    fs.move(path_temp, filePath, function(err) {
        if (err) return console.error(err)
        res.send("File uploaded!");
    });
  } else {
    res.send("File upload failed!");
  }  
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