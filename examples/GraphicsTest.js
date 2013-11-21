var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;

require('../src/node-easel.js');

var GraphicsTest = function () {
	return this.init();
}
var p = GraphicsTest.prototype = {};

exports.GraphicsTest = GraphicsTest;

p.init = function () {
	this.canvas = new Canvas(1042, 400);

	// create a new stage and point it at our canvas:
	this.stage = new createjs.Stage(this.canvas);

	// grab canvas width and height for later calculations:
	this.w = this.canvas.width;
	this.h = this.canvas.height;

	this.img = new Image();
	this.img.src = fs.readFileSync(__dirname + '/img/daisy.png');

	this.layout();

	return {buffer:this.canvas, term:'Easel Demo'};
}

p.layout = function () {
	var arr = [
		this.createStar,
		this.createHex,
		this.createLineTo,
		this.createRadialGradientFill,
		this.createEllipse,
		this.createRectGradientFill,
		this.createBitmapFill,
		this.createGreyImage,
		this.createColorImage,
		this.createBlurImage,
		this.createSmiley,
		this.createText
	];
	var padding = 5;
	var _width = 155;
	var _height = 155;
	var cols = 6;
	var space = 0;
	var l = arr.length;

	var bgContainer = new createjs.Container();
	var bg = new createjs.Shape();
	bg.graphics.beginFill('#333').drawRect(0, 0, this.w, this.h).endFill();
	bgContainer.addChild(bg);
	this.stage.addChild(bgContainer);

	for (var i = 0; i < l; i++) {
		var func = arr[i].bind(this);
		var tile = func();
		tile.x = 42 + (_width + padding) * (i % cols);
		tile.y = 42 + (i / cols | 0) * (_height + padding);
		this.stage.addChild(tile);
	}

	var border = this.createBorder();
	this.stage.addChild(border);
	this.stage.update();
}

p.createSmiley = function () {
	var s = new createjs.Shape();
	var g = s.graphics;

	//Head
	g.setStrokeStyle(15, 'round', 'round');
	g.beginStroke("#000");
	g.beginFill("#F00");
	g.drawCircle(170, 170, 170); //55,53
	g.endFill();
	g.setStrokeStyle(1, 'round', 'round');

	//Right eye
	g.setStrokeStyle(5, 'round', 'round');
	g.beginStroke("#000");
	g.beginFill("#000");
	g.drawRoundRect(125, 64, 20, 50, 10);
	g.endFill();

	//Left eye
	g.setStrokeStyle(5, 'round', 'round');
	g.beginStroke("#000");
	g.beginFill("#000");
	g.drawRoundRect(200, 64, 20, 50, 10);
	g.endFill();

	//Mouth
	g.setStrokeStyle(15, 'round', 'round');
	g.beginStroke("#000");
	g.moveTo(45, 155);
	g.bezierCurveTo(83, 307, 254, 317, 296, 152);

	var c = new createjs.Container();
	c.addChild(s);

	c.scaleX = .4;
	c.scaleY = .4;

	c.x = 10;
	c.y = 10;

	var container = this.createTile();
	container.addChild(c);

	return container;
}

p.createText = function () {
	var container = this.createTile();
	var text = new createjs.Text("Hello World",
								 "20px bold Arial",
								 "#00ffaa");
	text.x = 10;
	text.y = 50;
	container.addChild(text);
	container.shadow = new createjs.Shadow(createjs.Graphics.getRGB(255, 0, 0, 1), 5, 5, 5);
	return container;
}

p.createGreyImage = function () {
	var greyScaleFilter = new createjs.ColorMatrixFilter([
															 0.33, 0.33, 0.33, 0, 0, // red
															 0.33, 0.33, 0.33, 0, 0, // green
															 0.33, 0.33, 0.33, 0, 0, // blue
															 0, 0, 0, 1, 0  // alpha
														 ]);
	var bitmap = this.createBitmap(this.img, [greyScaleFilter]);
	var container = this.createTile();
	container.addChild(bitmap);
	return container;
}

p.createColorImage = function () {
	var bitmap = this.createBitmap(this.img, [new createjs.ColorFilter(0, 1, 1, 1)]);
	var container = this.createTile();
	container.addChild(bitmap);
	return container;
}

p.createBlurImage = function () {
	var blurFilter = new createjs.BlurFilter(5, 2, 2);
	var bitmap = this.createBitmap(this.img, [blurFilter]);
	var container = this.createTile();
	container.addChild(bitmap);
	return container;
}

p.createBitmap = function (image, filters) {
	var bitmap = new createjs.Bitmap(image);
	bitmap.filters = filters;
	bitmap.cache(0, 0, image.width, image.height);
	bitmap.x = 40;
	bitmap.y = 40;
	return bitmap;
}

p.createBorder = function () {
	var container = new createjs.Container();
	var s = new createjs.Shape();
	s.graphics.beginBitmapStroke(this.img)
			.setStrokeStyle(32)
			.drawRect(20, 20, 1000, 360);
	container.addChild(s);
	return container;
}

p.createBitmapFill = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.beginBitmapFill(this.img)
			.setStrokeStyle(8)
			.beginRadialGradientStroke(["#FFF", "#000"],
									   [0, 1],
									   0, 0, 0, 0, 30, 130)
			.drawRect(0, 0, 130, 130);
	s.x = 12;
	s.y = 10;
	container.addChild(s);
	return container;
}

p.createRectGradientFill = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.beginLinearGradientFill(["#FFF", "#000"],
									   [0, 1], 0, 0, 0, 130)
			.drawRect(0, 0, 130, 130);
	s.x = 12;
	s.y = 10;
	container.addChild(s);
	return container;
}

p.createEllipse = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.f(createjs.Graphics.getRGB(0, 0x66, 0x99, 0.5))
			.setStrokeStyle(4)
			.beginLinearGradientStroke(["#F00", "#000"],
									   [0, 1],
									   0, 0, 70, 140)
			.drawEllipse(0, 0, 70, 140, 8);
	s.x = 40;
	s.y = 10;
	container.addChild(s);
	return container;
}

p.createRadialGradientFill = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.ss(8)
			.beginStroke("#f0f")
			.beginRadialGradientFill(["#FFF", "#0FF"],
									 [0, 1],
									 0, 0, 0, 0, 0, 40)
			.drawCircle(0, 0, 40);
	s.x = s.y = 80;
	container.addChild(s);
	return container;
}

p.createLineTo = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.setStrokeStyle(16, "round", "round")
			.beginStroke("#f90")
			.moveTo(20, 10)
			.lineTo(90, 90)
			.lineTo(90, 140);
	container.addChild(s);
	return container;
}

p.createHex = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.beginFill("#0F0")
			.drawPolyStar(0, 0, 40, 6)
			.drawPolyStar(0, 75, 40, 6);
	s.x = 80
	s.y = 40;

	container.addChild(s);
	return container;
}

p.createStar = function () {
	var container = this.createTile();
	var s = new createjs.Shape();
	s.graphics.setStrokeStyle(1)
			.beginStroke(createjs.Graphics.getRGB(255, 255, 0))
			.beginFill("#FF0")
			.endStroke()
			.drawPolyStar(0, 0, 80, 5, 0.6, -90);
	s.x = 80
	s.y = 85;

	container.addChild(s);
	return container;
}

p.createTile = function () {
	var container = new createjs.Container();
	var bg = new createjs.Shape();
	bg.graphics.beginFill('#CCCCCC').drawRect(0, 0, 155, 155).endFill();
	bg.alpha = 0.25;
	container.addChild(bg);
	return container;
}
