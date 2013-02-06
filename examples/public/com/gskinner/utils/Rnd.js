/*
 * Copyright (c) 2010 Grant Skinner
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
(function (window) {

	var Rnd = function () {
		throw new Error('Rnd is static and cannot be instantiated.');
	};

	Rnd.setSeed = function (value) {
		Rnd._currentSeed = value;
	};

	Rnd.randFloat = function (min, max) {
		if (isNaN(max)) {
			max = min;
			min = 0;
		}
		return Math.random() * (max - min) + min;
	};

	// boolean(); // returns true or false (50% chance of true)
	// boolean(0.8); // returns true or false (80% chance of true)
	Rnd.randBoolean = function (chance) {
		if (isNaN(chance)) {
			chance = .5;
		}
		return (Math.random() < chance);
	};

	// sign(); // returns 1 or -1 (50% chance of 1)
	// sign(0.8); // returns 1 or -1 (80% chance of 1)
	Rnd.randSign = function (chance) {
		if (isNaN(chance)) {
			chance = .5;
		}
		return (Math.random() < chance) ? 1 : -1;
	}

	// bit(); // returns 1 or 0 (50% chance of 1)
	// bit(0.8); // returns 1 or 0 (80% chance of 1)
	Rnd.randBit = function bit(chance) {
		if (isNaN(chance)) {
			chance = .5;
		}
		return (Math.random() < chance) ? 1 : 0;
	};

	// integer(50); // returns an integer between 0-49 inclusive
	// integer(20,50); // returns an integer between 20-49 inclusive
	Rnd.randInteger = function (min, max) {
		if (isNaN(max)) {
			max = min;
			min = 0;
		}
		// Need to use floor instead of bit shift to work properly with negative values:
		return Math.floor(Rnd.randFloat(min, max));
	};

	Rnd.random = function () {
		var rand = (Rnd._currentSeed = (Rnd._currentSeed * 16807) % 2147483647) / 0x7FFFFFFF + 0.000000000233;
		return rand;
	}

	window.Rnd = Rnd;

}((typeof exports == 'undefined') ? window : exports));
