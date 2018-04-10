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

app.get('/CubeFlexIntegration.ashx', function (req, res) {

  var Data = {"responseCode":"100-1n3vt54cayosg0nxl4nkaqsr","CubeFlexIntegration":
  {"DATA":
  [
  {"ID":"2","NAME":"Electronics","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/electronics.jpg"},
  {"ID":"3","NAME":"Clothing","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/clothing.jpg"},
  {"ID":"4","NAME":"Sports","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/sports.jpg"},
  {"ID":"5","NAME":"Automotive","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/auto.jpg"},
  {"ID":"6","NAME":"Beauty & Health","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/beuaty.jpg"}
  ]
  }
  }

  res.end(JSON.stringify(Data))
});

const port = process.env.PORT || 9097

app.listen(port);
