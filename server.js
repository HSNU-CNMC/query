var express = require('express');
var bodyParser = require('body-parser');
var request = require('urllib-sync').request;

var app = express();
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/build'));

app.get('/proxy/vcode', function(req, res){
	var hres = request('http://grades.hs.ntnu.edu.tw/online/image/vcode.asp?vcode=' + Math.floor(Math.random() * (Math.pow(2, 32) - 1)));
	res.send({ status: 'ok', session: hres.headers['set-cookie'][0].split(';')[0], image: hres.data.toString('base64') });
});

app.post('/proxy/login', function(req, res){
	var hres = request('http://grades.hs.ntnu.edu.tw/online/login.asp', {
		method: 'POST',
		data: {
			'Loginid': req.body.username,
			'LoginPwd': req.body.password,
			'Uid': '',
			'vcode': req.body.vcode,
			'division': 'senior',
			'Enter': 'LOGIN'
		},
		headers: {
			'Cookie': req.body.session
		}
	});
	var html = hres.data.toString();
	if(html.indexOf('frames.asp') != -1){
		res.send({ status: 'ok' });
	} else {
		res.send({ status: 'error' });
	}
});

app.use(function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});

app.listen(8000, function(){
	console.log('started');
});
