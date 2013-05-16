var Canvas = require('canvas');
var Image = Canvas.Image;
var fs = require('fs');
var exec = require('child_process').exec;

require('../src/node-easel.js');

var SpritesheetTest = function (success) {
	this.init(success);
}
exports.SpritesheetTest = SpritesheetTest;

var p = SpritesheetTest.prototype = {};
var s = SpritesheetTest;

s.RUNNING_RATE = 2.5;

p.init = function (success) {
	var cmd = "find " + __dirname + "/output -name '*.mpg' -exec rm -f {} \\;";
	console.log(cmd);
	exec(cmd);

	this.success = success;

	this.canvas = new Canvas(960, 400);
	this.stage = new createjs.Stage(this.canvas);

	this.index = 0;

	var spriteSheet = {"animations":{"run":[0, 25], "jump":[26, 63]}, "images":[this.loadImage("runningGrant.png")], "frames":{"regX":0, "height":292.5, "count":64, "regY":0, "width":165.75}};

	var ss = new createjs.SpriteSheet(spriteSheet);
	this.grant = new createjs.BitmapAnimation(ss);

	// Set up looping
	ss.getAnimation("run").next = "run";
	ss.getAnimation("jump").next = "run";
	this.grant.gotoAndPlay("run");

	// Position the Grant sprite
	this.grant.x = -200;
	this.grant.y = 90;
	this.grant.scaleX = this.grant.scaleY = 0.8;

	// grab canvas width and height for later calculations:
	this.w = this.canvas.width;
	this.h = this.canvas.height;

	var sky = new createjs.Shape(new createjs.Graphics().beginBitmapFill(this.loadImage('sky.png')).drawRect(0, 0, this.w, this.h));

	this.ground = new createjs.Shape();
	var g = this.ground.graphics;
	g.beginBitmapFill(this.loadImage('ground.png'));
	g.drawRect(0, 0, this.w + 330, 79);
	this.ground.y = this.h - 79;

	this.hill = new createjs.Shape(new createjs.Graphics().beginBitmapFill(this.loadImage('parallaxHill1.png')).drawRect(0, 0, 282, 59));
	this.hill.x = Math.random() * this.w;
	this.hill.scaleX = this.hill.scaleY = 3;
	this.hill.y = 144;

	this.hill2 = new createjs.Shape(new createjs.Graphics().beginBitmapFill(this.loadImage('parallaxHill2.png')).drawRect(0, 0, 212, 50));
	this.hill2.x = Math.random() * this.w;
	this.hill2.scaleX = this.hill2.scaleY = 3;
	this.hill2.y = 171;

	this.stage.addChild(sky, this.ground, this.hill, this.hill2, this.grant);

	this.tickFunction = this.tick.bind(this);
	var fps = 80;
	createjs.Ticker.setFPS(fps);
	createjs.Ticker.addEventListener("tick", this.tickFunction);

	var seconds = 10;
	var millseconds = seconds * 1000;
	console.log(millseconds);
	setTimeout(this.stopCapture.bind(this), millseconds);
}

p.stopCapture = function () {
	createjs.Ticker.removeEventListener("tick", this.tickFunction);
	console.log('begin video encoding');
	exec('cd ' + __dirname + '/output && ffmpeg -f image2 -i test_%d.png -sameq video.mpg', this.handleVideoEncoded.bind(this));
}

p.handleVideoEncoded = function () {
	console.log('Video Encoded');

	var cmd = "find " + __dirname + "/output -name '*.png' -exec rm -f {} \\;";
	exec(cmd);
	this.success('video.mpg');

	createjs.Ticker.halt();
}

p.loadImage = function (name) {
	var img = new Image();
	img.src = fs.readFileSync(__dirname + '/img/' + name);
	return img;
}

p.handleJumpStart = function () {
	this.grant.gotoAndPlay("jump");
}

p.tick = function () {
	var outside = this.w + 20;
	var position = this.grant.x + s.RUNNING_RATE;
	this.grant.x = (position >= outside) ? -200 : position;

	this.ground.x = (this.ground.x - 15) % 330;
	this.hill.x = (this.hill.x - 0.8);
	if (this.hill.x + 838 <= 0) {
		this.hill.x = outside;
	}
	this.hill2.x = (this.hill2.x - 1.2);
	if (this.hill2.x + 633 <= 0) {
		this.hill2.x = outside;
	}

	this.stage.update();

	var fileName = __dirname + '/output/test_' + (this.index++) + '.png';
	fs.writeFileSync(fileName, this.canvas.toBuffer(), '');
}
