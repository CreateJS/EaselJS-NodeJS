var express = require('express')
var app = express();
var fs = require('fs');
var exec = require('child_process').exec;

var captcha = require('./captcha.js').Captcha;
var graphicsTest = require('./GraphicsTest.js').GraphicsTest;
var spriteSheetBuilderTest = require('./SpriteSheetBuilderTest').SpriteSheetBuilderTest;
var spritesheetTest = require('./SpritesheetTest').SpritesheetTest;

//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.use(express.errorHandler({ showStack:true }));

app.get('/captcha.png', function (req, res) {
	var seed = parseInt(req.query.seed || Math.random() * 0xffffff);

	var data = new captcha(seed);
	sendImage(data.buffer, res);
});

app.get('/graphicsTest.png', function (req, res) {
	var data = new graphicsTest();
	sendImage(data.buffer, res);
});

app.get('/spritesheetBuilder.png', function (req, res) {
	var data = new spriteSheetBuilderTest();
	sendImage(data.buffer, res);
});

app.get('/running.mpg', function (req, res) {
	exec('which ffmpeg', function (err, result) {
		if (result.length != 0) {
			new spritesheetTest(function (videoPath) {
				res.contentType('video/mpeg');
				res.sendfile(__dirname + '/output/' + videoPath);
			});
		} else {
			res.set('Content-Type', 'text/html');
			res.send(new Buffer('Error: ffmpeg is required for this demo.  Install from <a href="http://www.ffmpeg.org/">ffmpeg.org</a> '));
		}
	});


});

function sendImage(buffer, res) {
	res.contentType('image/png');

	buffer.toBuffer(function (err, buf) {
		res.send(buf);
	});
}


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.listen(9000);

var os = require('os')

var interfaces = os.networkInterfaces();
var addresses = [];
for (var n in interfaces) {
	for (var j in interfaces[n]) {
		var address = interfaces[n][j];
		if (address.family == 'IPv4' && !address.internal) {
			addresses.push(address.address)
		}
	}
}

console.log('App started: ', addresses)
