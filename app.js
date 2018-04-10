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
  {"ID":"6","NAME":"Beauty & Health","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/beuaty.jpg"},
  {"ID":"6","NAME":"Beauty & Health","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/beuaty.jpg"},
  {"ID":"6","NAME":"Beauty & Health","DESCRIPTION": "Some quick example text to build on the card title and make up the bulk of the card's content.","PARENTID":"1","GROUPIMG":"img/beuaty.jpg"}
  ]
  }
  }

  res.end(JSON.stringify(Data))
});

app.get('/CubeFlexIntegration2.ashx', function (req, res) {

  var Data = {"responseCode":"100-1n3vt54cayosg0nxl4nkaqsr","CubeFlexIntegration":
  {"DATA":
  [
  {"ID":"2","HOMELOGO":"img/logo-cube-mia.png","Home": true,"Products":true,"Service":true, "Apps": true, "CubeLocalPhone": "   + 786-293-3272", "AboutCube": "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.", "CubeLocation": "Cube-US", "CubeEmail": "email@example.com", "Link1": "Link 1", "Link2": "Link 2", "Link3": "Link 3", "Link4": "Link 4"}
  ]
  }
  }

  res.end(JSON.stringify(Data))
});

app.get('/CubeFlexIntegration4.ashx', function (req, res) {

  var Data = {"responseCode":"100-1n3vt54cayosg0nxl4nkaqsr","CubeFlexIntegration":
  {"DATA":
  [
    {"ID":0,"Image":"img/cameras1100x700.png","Title": "New Collection","Message":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", "ButtonText": "READ MORE"},
    {"ID":1,"Image":"img/pesas.jpeg","Title": "New Collection","Message":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", "ButtonText": "READ MORE"},
    {"ID":2,"Image":"img/person-music.jpeg","Title": "New Collection","Message":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", "ButtonText": "READ MORE"},
    {"ID":3,"Image":"img/mac.jpg","Title": "New Collection","Message":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", "ButtonText": "READ MORE"}
  ]
  }
  }

  res.end(JSON.stringify(Data))
});

const port = process.env.PORT || 9097

app.listen(port);
