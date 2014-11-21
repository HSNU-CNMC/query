var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/build'));

app.use(function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});

app.listen(8088, function(){
	console.log('started');
});