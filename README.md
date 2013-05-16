# node-easel

node-easel is a node wrapper for [EaselJS](https://github.com/CreateJS/EaselJS).
For use with [NodeJS](http://nodejs.org), built on-top of [node-canvas](https://github.com/LearnBoost/node-canvas)

## Installation

	$ npm install node-easel

**Note**
Cairo graphics is required to run node-easel && node-canvas.
Read the install docs at https://github.com/LearnBoost/node-canvas, for full install instructions.

## Examples

To see a full working demo, checkout the [examples](examples/) folder.


## Simple Example

node-easel is completely polymorphic with EaselJS. A good starting point is to checkout the [EaselJS documentation](http://createjs.com/Docs/EaselJS/).

```javascript
//Import easel
require('node-easel');
var Stage = createjs.Stage;
var Shape = createjs.Shape;
var Graphics = createjs.Graphics;

var fs = require('fs');

//Create the canvas to draw to
var c = new Canvas(980, 580);
var ctx = c.getContext('2d');

//Create graphics object
var g = new createjs.Graphics();
var shape = new createjs.Shape(g);

//Draw a circle
g.setStrokeStyle(8)
.beginStroke("#F0F")
.beginRadialGradientFill(["#FF0","#00F"],[0,1],100,200,0,100,200,40)
.drawCircle(100,200,40);

//Add the item to our stage, and call .tick(); to draw the object.
var stage = new createjs.Stage(c);
stage.addChild(shape);
stage.tick();

//Create a PNG file.
fs.writeFile(__dirname + '/public/circle.png', c.toBuffer(), function() {
	createjs.Ticker.halt();
});
```
