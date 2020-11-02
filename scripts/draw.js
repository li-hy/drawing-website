var canvas = document.getElementById('my-canvas');
canvasWidth = canvas.getAttribute("width");
canvasHeight = canvas.getAttribute('height');

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
}
var axis = new Object();
axis.hasSet = false;

/* set axis objects */
function setAxis(axis, width, height, xLeftValue, xRightValue,
	yLeftValue, yRightValue) {
	/* canvas size */
	axis.width = parseFloat(width);
	axis.height = parseFloat(height);

	/* user sepcified x, y range */
	axis.xLeftValue = parseFloat(xLeftValue);
	axis.xRightValue = parseFloat(xRightValue);
	axis.yLeftValue = parseFloat(yLeftValue);
	axis.yRightValue = parseFloat(yRightValue);

	/* cordinate scaling, leaving some blank areas */
	axis.blank = 30;
	axis.dx = xRightValue - xLeftValue;
	axis.dy = yRightValue - yLeftValue;
	axis.xScale = (width - 2 * axis.blank) / axis.dx;
	axis.yScale = (height - 2 * axis.blank) / axis.dy;

	/* set the positive and negative axis, leaving some blank areas */
	axis.xNegAxis = Math.abs(xLeftValue) / axis.dx *
		(width - 2 * axis.blank);
	axis.xPosAxis = xRightValue / axis.dx * (width - 2 * axis.blank);
	axis.yNegAxis = Math.abs(yLeftValue) / axis.dy *
		(height - 2 * axis.blank);
	axis.yPosAxis = yRightValue / axis.dy * (height - 2 * axis.blank);

	/* has set origin, initialize to false */
	axis.hasSetOrigin = false;

	/* has set axis? */
	axis.hasSet = true;
}

/* set origin, @ox is the x negative axis's length,
 * @oy is y positive axis's length
 */
function setOrigin(ctx, axis) {
	ctx.translate(axis.xNegAxis + axis.blank,
		axis.yPosAxis + axis.blank);
}

function drawAxis(ctx, axis) {
	ctx.font = "12px";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	if (!axis.hasSetOrigin)
		setOrigin(ctx, axis);

	/* x-axis range on the canvas */
	let xLeftRange = -1 * axis.xNegAxis;
	let xRightRange = axis.xPosAxis;
	/* y-axis range on the canvas */
	let yLeftRange = axis.yNegAxis;
	let yRightRange = -1 * axis.yPosAxis;

	/* draw x-axis */
	drawLine(ctx, xLeftRange, yLeftRange,
		xRightRange + axis.blank - 5, yLeftRange);
	drawEquilateralTriangle(ctx, xRightRange + axis.blank - 5,
		yLeftRange, 5, true, 1);
	drawLine(ctx, xLeftRange, yRightRange,
		xRightRange, yRightRange);
	let i, tx, ty;
	ty = yLeftRange + 10;
	for (i = 0; i <= axis.dx; ++i) {
		tx = xLeftRange + i * axis.xScale;
		drawLine(ctx, tx, yLeftRange, tx, yLeftRange - 3);
		ctx.fillText(axis.xLeftValue + i, tx, ty);
	}
	ctx.fillText('x', xRightRange + axis.blank - 10, ty);

	/* y axis */
	drawLine(ctx, xLeftRange, yLeftRange,
		xLeftRange, yRightRange - axis.blank + 5);
	drawEquilateralTriangle(ctx, xLeftRange,
		yRightRange - axis.blank + 5, 5, true);
	drawLine(ctx, xRightRange, yLeftRange,
		xRightRange, yRightRange);
	tx = xLeftRange - 10
	for (i = 0; i <= axis.dy; ++i) {
		ty =  yRightRange + i * axis.yScale;
		drawLine(ctx, xLeftRange, ty, xLeftRange + 3, ty);
		ctx.fillText(axis.yRightValue - i, tx - 1, ty);
	}
	ctx.fillText('y', tx, yRightRange - axis.blank + 10);
}

function displayAxis(ctx, axis) {
	if (axis.hasSet) {
		drawAxis(ctx, axis);
	} else {
		let xLeftValue = idName('x-left-value').value;
		let xRightValue = idName('x-right-value').value;
		let yLeftValue = idName('y-left-value').value;
		let yRightValue = idName('y-right-value').value;

		setAxis(axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
			yLeftValue, yRightValue);
		drawAxis(ctx, axis);
	}
}

/* get the objects by id */
function idName(name) {
	return document.getElementById(name);
}

/* get the objects by class name */
function className(name) {
	return document.getElementsByClassName(name);
}

/* add a new formula into formula editor's area */
function addAFormula() {
	let newFormula = className('a-formula')[0].cloneNode(true);
	idName('formulas').appendChild(newFormula);
}

/* delete a formula from formula editor area */
function deleteAFormula(aFormula) {
	if (className('a-formula').length > 1)
		aFormula.parentNode.removeChild(aFormula);
}

/* draw a dot in the canvas */
function drawDot(ctx, x, y, color = 'black', size = 2) {
	if (size % 2 != 0)
		size += 1;
	ctx.beginPath();
	size /= 2;
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fillSytle = color;
	ctx.fill();
}

/* draw a line in the canvas */
function drawLine(ctx, x1, y1, x2, y2, color = 'black', size = 2) {
	ctx.strokeStyle = color;
	if (size % 2 != 0)
		size += 1;
	ctx.lineWidth = size;
	ctx.lineCap = 'round';
	if (x1 != x2 || y1 != y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	} else {
		drawDot(ctx, x1, y1, color, size);
	}
}

/* draw y = @A * sin(x) in the range of @xBegin~@xEnd */
function drawSin(ctx, xBegin, xEnd, yBase, A, color = 'black', size = 2) {
	ctx.fillSytle = color;
	if (size % 2 != 0)
		size += 1;
	for (x = xBegin; x <= xEnd; ++x) {
		y = yBase + A * (Math.sin(x / (2 * Math.PI)));
		drawDot(ctx, x, y, color, size);
	}
}

/* draw a triangle with the coordinates of it's three vertices */
function drawTriangle(ctx, x1, y1, x2, y2, x3, y3,
	isFill = false, color = 'black', size = 2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	if (isFill == false) {
		ctx.closePath();
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
		ctx.stroke();
	} else {
		ctx.fillStyle = color;
		ctx.fill();
	}
}

/* draw a equilateral triangle with the center and radius of it's
 * circumcircle, then rotate it @rotate * pi / 4
 */
function drawEquilateralTriangle(ctx, x, y, radius,
	isFill = false, rotate = 0, color = 'black', size = 2) {
	let x1, x2, x3, y1, y2, y3;
	if (rotate == 0) {
		x1 = x;
		y1 = y - radius;
		x2 = x - radius * Math.sin(Math.PI / 3);
		y2 = y + radius * Math.cos(Math.PI / 3);
		x3 = x + radius * Math.sin(Math.PI / 3);
		y3 = y2;
		drawTriangle(ctx, x1, y1, x2, y2, x3, y3, isFill, color, size);
	} else if (rotate > 0){
		ctx.save();
		ctx.translate(x, y);
		for (; rotate > 0; --rotate)
			ctx.rotate(Math.PI / 2);
		x1 = 0;
		y1 = -radius;
		x2 = - radius * Math.sin(Math.PI / 3);
		y2 = radius * Math.cos(Math.PI / 3);
		x3 = radius * Math.sin(Math.PI / 3);
		y3 = y2;
		drawTriangle(ctx, x1, y1, x2, y2, x3, y3, isFill, color, size);
		ctx.restore();
	} else {
		alert('Error: rotate can not less than 0');
	}
}

function reDraw() {
	alert('reDraw');
}

function test() {
	alert("test");
}
