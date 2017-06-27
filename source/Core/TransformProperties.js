/*
 * Copied from DisplayProps
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
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

define(
	'Core/TransformProperties',
	['Core',
		'Core/Matrix3x3'],
	function (Core) {
	"use strict";

	function TransformProperties(visible, alpha, compositeOperation, matrix) {
		this.setValues(visible, alpha, compositeOperation, matrix);
	}

	TransformProperties.prototype.setValues = function (visible, alpha, compositeOperation, matrix) {
		this.visible = visible == null ? true : !!visible;
		this.alpha = alpha == null ? 1 : alpha;
		this.compositeOperation = compositeOperation;
		this.matrix = matrix || (this.matrix && this.matrix.identity()) || new Core.Matrix3x3();
		return this;
	};

	TransformProperties.prototype.append = function (visible, alpha, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.compositeOperation = compositeOperation || this.compositeOperation;
		this.visible = this.visible && visible;
		matrix && this.matrix.appendMatrix(matrix);
		return this;
	};

	TransformProperties.prototype.prepend = function (visible, alpha, compositeOperation, matrix) {
		this.alpha *= alpha;
		this.compositeOperation = this.compositeOperation || compositeOperation;
		this.visible = this.visible && visible;
		matrix && this.matrix.prependMatrix(matrix);
		return this;
	};

	TransformProperties.prototype.identity = function () {
		this.visible = true;
		this.alpha = 1;
		this.compositeOperation = null;
		this.matrix.identity();
		return this;
	};

	TransformProperties.prototype.clone = function () {
		return new TransformProperties(this.alpha, this.compositeOperation, this.visible, this.matrix.clone());
	};

	Core.TransformProperties = TransformProperties;
	return TransformProperties;
});
