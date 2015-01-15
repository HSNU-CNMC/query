var express = require('express');
var bodyParser = require('body-parser');
var request = require('urllib-sync').request;
var cheerio = require('cheerio');
var codepage = require('codepage');

var app = express();
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/build'));

app.get('/proxy/vcode', function(req, res){
	var hres = request('http://grades.hs.ntnu.edu.tw/online/image/vcode.asp?vcode=' + Math.floor(Math.random() * (Math.pow(2, 32) - 1)));
	res.send({ status: 'ok', session: hres.headers['set-cookie'][0].split(';')[0], image: hres.data.toString('base64') });
});

app.post('/proxy/login', function(req, res){
	if(!req.body.username || !req.body.password || !req.body.vcode){
		res.send({ status: 'error', message: 'invalid request' });
		return;
	}
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
		var hres = request('http://grades.hs.ntnu.edu.tw/online/student/left.asp', {
			method: 'GET',
			encoding: null,
			headers: {
				'Cookie': req.body.session
			}
		});
		var html = codepage.utils.decode(950, new Buffer(hres.data));
		var $ = cheerio.load(html);
		var name = $('a[class=Chap]').first().text().split(' ')[1];
		res.send({ status: 'ok', username: name });
	} else {
		res.send({ status: 'error' });
	}
});

app.get('/proxy/profile', function(req, res){
	if(!req.query.session){
		res.send({ status: 'error', message: 'invalid request' });
		return;
	}
	var hres = request('http://grades.hs.ntnu.edu.tw/online/student/left.asp', {
		method: 'GET',
		headers: {
			'Cookie': req.query.session
		}
	});
	var html = codepage.utils.decode(950, new Buffer(hres.data));
	if(html.indexOf('Close.asp') != -1){
		res.send({ status: 'error', message: 'login timeout' });
		return;
	}
	var $ = cheerio.load(html);
	var name = $('a[class=Chap]').first().text().split(' ')[1];
	res.send({ status: 'ok', username: name });
});

app.get('/proxy/list', function(req, res){
	if(!req.query.session){
		res.send({ status: 'error', message: 'invalid request' });
		return;
	}
	var hres = request('http://grades.hs.ntnu.edu.tw/online/selection_student/student_subjects_number.asp?action=open_window_frame', {
		method: 'GET',
		headers: {
			'Cookie': req.query.session
		}
	});
	var html = codepage.utils.decode(950, new Buffer(hres.data));
	var $ = cheerio.load(html);
	var els = $('option', 'select');
	var ret = [];
	els.each(function(idx, el){
		if(idx < 2) return true;
		ret[idx-2] = { name: $(this).text(), action: $(this).attr('value') };
	});
	res.send({ status: 'ok', list: ret });
});

app.post('/proxy/query', function(req, res){
	if(!req.body.session || !req.body.action){
		res.send({ status: 'error', message: 'invalid request' });
		return;
	}
	var hres = request('http://grades.hs.ntnu.edu.tw/online/selection_student/' + req.body.action, {
		method: 'GET',
		timeout: 15000,
		headers: {
			'Cookie': req.body.session
		}
	});
	var html = codepage.utils.decode(950, new Buffer(hres.data));
	var $ = cheerio.load(html);
	$('input').remove();
	res.send({ status: 'ok', result: $('body').html() });
});

app.use(function(req, res){
    res.sendFile(__dirname + '/build/index.html');
});

app.listen(8000, function(){
	console.log('started');
});
