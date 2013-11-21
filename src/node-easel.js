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
var Canvas = require('canvas');
var Image = Canvas.Image;

/**
 * Surpress addEventListener errors on easel.
 * Its currently only used for MouseEvent, so its not needed on the server.
 *
 */
Canvas.prototype.addEventListener = function () { };

/**
 * Inject a window object
 *
 * @type {Object}
 */
window = { addEventListener:function () { } };

/**
 * node-canvas doesn't support cloneNode();
 * So create our own.
 *
 * @return {Canvas}
 */
Canvas.prototype.cloneNode = function () {
	var c = new Canvas(this.width, this.height);
	c.type = this.type;

	return c;
};

// Easel uses instanceof HTMLCanvasElement, so change it to Canvas.
HTMLCanvasElement = Canvas;

// Create our global createjs namespace.
createjs = {
	_snapToPixelEnabled:true,

	createCanvas:function () {
		return new Canvas();
	},

	createImage:function () {
		return new Image();
	}
};

var classes = [
	// Shared
	'createjs/events/EventDispatcher',
	'createjs/events/Event',
	'createjs/utils/IndexOf',

	// TweenJS code (used by MovieClip)
	'tweenjs/CSSPlugin',
	'tweenjs/Ease',
	'tweenjs/MotionGuidePlugin',
	'tweenjs/Timeline',
	'tweenjs/Tween',
	'tweenjs/version',

	// EaselJS code
	'easeljs/utils/UID',
	'easeljs/utils/SpriteSheetBuilder',
	'easeljs/utils/SpriteSheetUtils',
	'easeljs/utils/Ticker',
	'easeljs/events/MouseEvent',
	'easeljs/geom/Matrix2D',
	'easeljs/geom/Rectangle',
	'easeljs/geom/Point',
	'easeljs/display/DisplayObject',
	'easeljs/display/Container',
	'easeljs/display/Stage',
	'easeljs/display/Shadow',
	'easeljs/display/Shape',
	'easeljs/display/SpriteSheet',
	'easeljs/display/Sprite',
	'easeljs/display/Text',
	'easeljs/display/Bitmap',
	'easeljs/display/BitmapText',
	'easeljs/display/BitmapAnimation',
	'easeljs/display/Graphics',
	'easeljs/display/MovieClip',
	'easeljs/filters/Filter',
	'easeljs/filters/AlphaMapFilter',
	'easeljs/filters/AlphaMaskFilter',
	'easeljs/filters/BlurFilter',
	'easeljs/filters/ColorFilter',
	'easeljs/filters/ColorMatrix',
	'easeljs/filters/ColorMatrixFilter',
	'easeljs/version',
	'easeljs/version_movieclip'
];

for (var i = 0; i < classes.length; i++) {
	var path = classes[i];
	var name = path.split('/').pop();
	require('./' + path + '.js')[name];
};

/**
 * Inject custom functionality that is only required on the server.
 * So we can keep the same EaselJS source desktop / server.
 *
 */

/**
 * Inject a halt method for Ticker.
 * Clears the Ticker's Timeout, and stops all animation.
 * Should only be called when your ready to stop the node instance.
 *
 */
createjs.Ticker.halt = function() {
	if (createjs.Ticker.timeoutID !== null) {
		clearTimeout(createjs.Ticker.timeoutID);
	}
}
