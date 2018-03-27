var express = require("express");
var app = express();
var path = require("path");

// Para validar cada vez que se llame a una rutina api que hay un usuario conectado y activo
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/lib", express.static(__dirname + '/lib'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/", express.static(__dirname + '/'));


app.use("/", express.static(__dirname + '/'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

const port = process.env.PORT || 9097

app.listen(port);
