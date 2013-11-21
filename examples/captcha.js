/*
 * Copyright (c) 2013 Wes Gorgichuk
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;
var Rnd = require('./public/com/gskinner/utils/Rnd.js').Rnd;

require('../src/node-easel.js');

var Captcha = function (seed) {
	return this.init(seed);
}
exports.Captcha = Captcha;

var p = Captcha.prototype = {};

p.init = function (seed) {
	var canvas = new Canvas();
	var ctx = canvas.getContext('2d');

	Rnd.setSeed(seed);

	var c = new Canvas(175, 75);
	var ctx = c.getContext('2d');
	var stage = new createjs.Stage(c);

	var usedCharacters = [];

	var characters = 'abcdefjhjklmnpqrxtuvwxyz23456789'.split('');

	var length = 9;
	var lastX = 15;

	while (length--) {
		var char = characters[Rnd.random() * characters.length | 0];
		usedCharacters.push(char);

		var t = new createjs.Text(char, (25) + "px Verdana", "#000");
		t.textBaseline = "top";

		var w = 20;//ctx.measureText(char).width;
		var h = 25;//t.getMeasuredLineHeight();

		t.x = lastX;
		t.y = Rnd.random() * (c.height - h);
		t.skewX = Rnd.random() * w * 2;
		t.skewY = Rnd.random() * h * 2;

		stage.addChild(t);

		lastX += w + (Rnd.random() * w);
	}

	var g = new createjs.Graphics();
	g.initialize(ctx);

	var shape = new createjs.Shape(g);
	g.setStrokeStyle(1).beginStroke("#00acc");

	length = 10;
	while (length--) {
		g.lineTo(Rnd.random() * c.width, Rnd.random() * c.height);
		g.moveTo(Rnd.random() * c.width, Rnd.random() * c.height);
	}

	var g2 = new createjs.Graphics();
	g2.initialize(ctx);

	var shape2 = new createjs.Shape(g2);
	length = 40;
	while (length--) {
		g2.setStrokeStyle(0).
				beginFill('#' + (Rnd.random() * 0xffffff | 0)).
				drawCircle(Rnd.random() * c.width, Rnd.random() * c.height,
						   Rnd.random() * 3 | 0)
				.endFill();
	}

	stage.addChild(shape, shape2);

	var blurFilter = new createjs.BlurFilter(3, 2, 2);
	var margins = blurFilter.getBounds();
	t.cache(0,
			0,
			t.getMeasuredWidth() + margins.width,
			t.getMeasuredLineHeight() + margins.height);

	stage.update();

	return {buffer:c,
		term:usedCharacters.join('')};
}
