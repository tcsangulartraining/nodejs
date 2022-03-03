var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs");
var mongoose = require('mongoose');
var employeeModel = require("./source/models/employee");
var usersRouter = require('./source/routes');
var cors= require('cors');
// getting-started.js
async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017/Venkat-Node');
}

/** Takes care of JSON data */
app.use(express.json());
var passport = require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(session({
  name:'myname.sid',
  resave:false,
  saveUninitialized:false,
  secret:'secret',
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  },
  store: new MongoStore({ mongoUrl:  'mongodb://localhost:27017/Venkat-Node'})
}));
require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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