var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs");

/** Takes care of JSON data */
app.use(express.json());

app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //    console.log( data );
       res.end( data );
    });
 });

/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));