var canvas = document.getElementById('my-canvas');
canvasWidth = canvas.getAttribute("width");
canvasHeight = canvas.getAttribute('height');

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
}
var axis = new Object();
axis.hasSet = false;
axis.xLeftRange = 0;
axis.yRightRange = 0;
axis.blank = 0;
axis.show = false;
axis.displayGrid = false;
axis.maxXDivision = 20;	/* max number of division of x axis */
axis.maxYDivision = 10;	/* max number of division of y axis */
/* value of division */
axis.xDivision = [];
axis.yDivision = [];

/* set division of x axis */
function setAxisDivision() {
	/* clear x and y division */
	axis.xDivision.length = 0;
	axis.yDivision.length = 0;

	/* number of division */
	let xMax = 0;
	let yMax = 0;

	xMax = (axis.dx <= axis.maxXDivision) ? axis.dx :
		axis.maxXDivision;
	yMax = (axis.dy <= axis.maxYDivision) ? axis.dy :
		axis.maxYDivision;
	xStep = (axis.width - 2 * axis.blank) / xMax;
	yStep = (axis.height - 2 * axis.blank) / yMax;

	let x = axis.xLeftRange;
	for (let i = 0; i <= xMax; ++i)
		axis.xDivision.push(x + i * xStep);
	let y = axis.yLeftRange;
	for (i = 0; i <= yMax; ++i)
		axis.yDivision.push(y - i * yStep);
}

var mouse = new Object();
mouse.draw = false;		/* is drawing now? */
mouse.erase = false;	/* is erasing now? */
mouse.penSize = 1;		/* pen size */
mouse.eraserSize = 1;	/* eraser size */
mouse.hold = false;		/* is holding mouse now? */
mouse.X = 0;			/* mouse x position */
mouse.Y = 0;			/* mouse y position */
mouse.color = 'black';	/* mouse(pen only) color */
const rect = canvas.getBoundingClientRect();

/* const parameter, some options' positions in the function area */
/* color option */
var colorPos = 0;
/* function expression string */
var funcStrPos = 1;
/* operator */
var opPos = 2;
/* show this function? */
var showFuncPos = 4;
/* bold line */
var boldPos = 5;

function getRandomColor() {
	let color = '#';
	while (color.length < 7)
		color += '0123456789abcdef'[Math.floor(Math.random() * 16)];
	return color;
}

function setPen(item) {
	mouse.draw = !mouse.draw;
	mouse.erase = false;
	setBtnColor(item, mouse.draw);
	setBtnColor(idName('eraser'), mouse.erase);
}

function setEraser(item) {
	mouse.erase = !mouse.erase;
	mouse.draw = false;
	setBtnColor(item, mouse.erase);
	setBtnColor(idName('pen'), mouse.draw);
}

function setBtnColor(item, judge) {
	if (judge)
		item.style.backgroundColor = '#e74c3c';
	else
		item.style.backgroundColor = '#3d4450';
}

canvas.addEventListener('mousedown', e => {
	mouse.X = e.clientX - rect.left -
		(-1 * axis.xLeftRange + axis.blank);
	mouse.Y = e.clientY - rect.top -
		(-1 * axis.yRightRange + axis.blank);
	if (mouse.draw)
		drawDot(mouse.X, mouse.Y, mouse.color, mouse.penSize);
	else if (mouse.erase)
		drawDot(mouse.X, mouse.Y, 'white', mouse.eraserSize);
	mouse.hold = true;
})

canvas.addEventListener('mousemove', e => {
	if (mouse.hold) {
		let curMouseX = e.clientX - rect.left -
			(-1 * axis.xLeftRange + axis.blank);
		let curMouseY = e.clientY - rect.top -
			(-1 * axis.yRightRange + axis.blank);
		if (mouse.draw)
			drawLine(mouse.X, mouse.Y, curMouseX, curMouseY,
				mouse.color, mouse.penSize);
		else if (mouse.erase)
			drawLine(mouse.X, mouse.Y, curMouseX, curMouseY,
				'white', mouse.eraserSize);
		mouse.X = curMouseX;
		mouse.Y = curMouseY;
	}
})

canvas.addEventListener('mouseup', e => {
	if (mouse.hold == true) {
		let curMouseX = e.clientX - rect.left -
			(-1 * axis.xLeftRange + axis.blank);
		let curMouseY = e.clientY - rect.top -
			(-1 * axis.yRightRange + axis.blank);
		if (mouse.draw)
			drawDot(curMouseX, curMouseY, mouse.color,
				mouse.penSize);
		else if (mouse.erase)
			drawDot(curMouseX, curMouseY, 'white', mouse.eraserSize);
	}
	mouse.hold = false;
})

/* reset axis objects */
function resetAxis() {
	/* reset origin */
	resetOrigin();

	/* canvas size */
	axis.width = 0;
	axis.height = 0;

	/* user sepcified x, y range */
	axis.xLeftValue = 0;
	axis.xRightValue = 0;
	axis.yLeftValue = 0;
	axis.yRightValue = 0;

	/* cordinate scaling, leaving some blank areas */
	axis.blank = 0;
	axis.dx = 0;
	axis.dy = 0;
	axis.xScale = 0;
	axis.yScale = 0;

	/* set the axis range on the canvas, leaving some blank areas */
	axis.xLeftRange = 0;
	axis.xRightRange = 0;
	axis.yLeftRange = 0;
	axis.yRightRange = 0;

	/* has set axis? */
	axis.hasSet = false;
}

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

	/* set the axis range on the canvas, leaving some blank areas */
	axis.xLeftRange = xLeftValue / axis.dx * (width - 2 * axis.blank);
	axis.xRightRange = xRightValue / axis.dx * (width - 2 * axis.blank);
	axis.yLeftRange = -1 * yLeftValue / axis.dy *
		(height - 2 * axis.blank);
	axis.yRightRange = -1 * yRightValue / axis.dy *
		(height - 2 * axis.blank);

	setAxisDivision();

	/* set origin */
	setOrigin();

	/* has set axis? */
	axis.hasSet = true;
}

/* auto set axis after web page loaded */
function autoSetAxis() {
	let xLeftValue = idName('x-left-value').value;
	let xRightValue = idName('x-right-value').value;
	let yLeftValue = idName('y-left-value').value;
	let yRightValue = idName('y-right-value').value;

	setAxis(axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
		yLeftValue, yRightValue);
}

/* set origin */
function setOrigin() {
	ctx.translate(-1 * axis.xLeftRange + axis.blank,
		-1 * axis.yRightRange + axis.blank);
}

/* reset origin */
function resetOrigin() {
	ctx.translate(axis.xLeftRange - axis.blank,
		axis.yRightRange - axis.blank);
}

function drawAxis(color = 'black') {
	ctx.font = "normal 12px serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = color;

	let arrowRadius;	/* radius of axis arrow circumcircle */
	let lineSize;		/* axis line size */

	if (color == 'white') {	/* erase axis */
		arrowRadius = 6;
		lineSize = 4;
	} else {				/* draw axis */
		arrowRadius = 5;
		lineSize = 2;
	}

	/* draw x-axis */
	drawLine(axis.xLeftRange, axis.yLeftRange,
		axis.xRightRange + axis.blank - 5, axis.yLeftRange,
		color, lineSize);
	drawEquilateralTriangle(axis.xRightRange + axis.blank - 5,
		axis.yLeftRange, arrowRadius, true, 1, color);
	drawLine(axis.xLeftRange, axis.yRightRange,
		axis.xRightRange, axis.yRightRange, color, lineSize);
	let i, tx, ty;
	ty = axis.yLeftRange + 10;
	for (i = 0; i < axis.xDivision.length; ++i) {
		tx = axis.xDivision[i];
		drawLine(tx, axis.yLeftRange, tx, axis.yLeftRange - 3,
			color, lineSize);
		ctx.fillText((axis.xLeftValue + i * axis.dx /
			(axis.xDivision.length - 1)).toFixed(1), tx, ty);
	}
	ctx.fillText('x', axis.xRightRange + axis.blank - 10, ty);

	/* y axis */
	drawLine(axis.xLeftRange, axis.yLeftRange,
		axis.xLeftRange, axis.yRightRange - axis.blank + 5,
		color, lineSize);
	drawEquilateralTriangle(axis.xLeftRange,
		axis.yRightRange - axis.blank + 5, arrowRadius, true, 0, color);
	drawLine(axis.xRightRange, axis.yLeftRange,
		axis.xRightRange, axis.yRightRange, color, lineSize);
	tx = axis.xLeftRange - 15;
	for (i = 0; i <= axis.yDivision.length; ++i) {
		ty =  axis.yDivision[i];
		drawLine(axis.xLeftRange, ty, axis.xLeftRange + 3, ty,
			color, lineSize);
		ctx.fillText((axis.yLeftValue + i * axis.dy /
			(axis.yDivision.length - 1)).toFixed(1), tx - 1, ty);
	}
	ctx.fillText('y', tx, axis.yRightRange - axis.blank + 10);
}

function showAxis(show) {
	let color = 'black';
	if (!show) 	/* erase axis */
		color = 'white';
	if (axis.hasSet) {
		drawAxis(color);
	} else {
		let xLeftValue = idName('x-left-value').value;
		let xRightValue = idName('x-right-value').value;
		let yLeftValue = idName('y-left-value').value;
		let yRightValue = idName('y-right-value').value;

		setAxis(axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
			yLeftValue, yRightValue);
		drawAxis(color);
	}
}

/* change axis */
function changeAxis() {
	clearAllFunc();
	showGrid(false);
	showAxis(false);
	resetAxis();

	let xLeftValue = idName('x-left-value').value;
	let xRightValue = idName('x-right-value').value;
	let yLeftValue = idName('y-left-value').value;
	let yRightValue = idName('y-right-value').value;

	setAxis(axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
		yLeftValue, yRightValue);
	showGrid(axis.displayGrid);
	drawAllFunc();
	showAxis(axis.show);
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
	/* random color */
	newFormula.children[0].children[colorPos].value = getRandomColor();
	/* clear function input */
	newFormula.children[0].children[funcStrPos].value = '';
	/* clear button 'on' */
	newFormula.children[0].children[showFuncPos].checked = false;
	/* clear button 'B' */
	newFormula.children[0].children[boldPos].checked = false;
	idName('formulas').appendChild(newFormula);
}

/* delete a formula from formula editor area */
function deleteAFormula(aFormula) {
	clearAllFunc();
	showGrid(false);
	showAxis(false);
	if (className('a-formula').length > 1) {
		aFormula.parentNode.removeChild(aFormula);
	} else {
		aFormula.children[0].children[colorPos].value = 'black';
		aFormula.children[0].children[funcStrPos].value = '';
		aFormula.children[0].children[showFuncPos].checked = false;
		aFormula.children[0].children[boldPos].checked = false;
	}
	drawAllFunc();
	showGrid(axis.displayGrid);
	showAxis(axis.show);
}

/* draw a dot in the canvas */
function drawDot(x, y, color = 'black', size = 1) {
	ctx.beginPath();
	size /= 2;
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

/* draw a line in the canvas */
function drawLine(x1, y1, x2, y2, color = 'black', size = 1) {
	if (x1 != x2 || y1 != y2) {
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	} else {
		drawDot(x1, y1, color, size);
	}
}

/* draw a triangle with the coordinates of it's three vertices */
function drawTriangle(x1, y1, x2, y2, x3, y3,
	isFill = false, color = 'black', size = 1) {
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
function drawEquilateralTriangle(x, y, radius,
	isFill = false, rotate = 0, color = 'black', size = 1) {
	let x1, x2, x3, y1, y2, y3;
	if (rotate == 0) {
		x1 = x;
		y1 = y - radius;
		x2 = x - radius * Math.sin(Math.PI / 3);
		y2 = y + radius * Math.cos(Math.PI / 3);
		x3 = x + radius * Math.sin(Math.PI / 3);
		y3 = y2;
		drawTriangle(x1, y1, x2, y2, x3, y3, isFill, color, size);
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
		drawTriangle(x1, y1, x2, y2, x3, y3, isFill, color, size);
		ctx.restore();
	} else {
		alert('Error: rotate can not less than 0');
	}
}

function drawFunc(color, funcStr, show = false, isBold = false) {
	if (!show) {	/* erase the function image */
		color = 'white';
		lineSize = 6;
	} else if (isBold){
		lineSize = 4;
	} else {
		lineSize = 2;
	}
	if (funcStr.length == 0)	/* input is null */
		return;
	funcStr = input2FuncStr(funcStr);
	let func = str2Func(funcStr);
	/* define the drawing range */
	let xLeft = axis.xLeftRange + 5;
	let xRight = axis.xRightRange -5;
	/* yLeftRange is pos and yRightRange is neg */
	let yLeft = axis.yLeftRange - 5;
	let yRight = axis.yRightRange + 5;
	let yb, yc;
	for (let x = xLeft; x <= xRight; ++x) {
		yb = -1 * axis.yScale * func((x - 1) / axis.xScale);
		yc = -1 * axis.yScale * func(x / axis.xScale);
		/* yLeft is pos and yRight is neg */
		if (yb <= yLeft && yb >= yRight &&
			yc <= yLeft && yc >= yRight)
			drawLine((x - 1), yb, x, yc, color, lineSize);
	}
}

/* show grid on axis */
function showGrid(show) {
	if (!axis.hasSet) {
		alert('You must set AXIS first!');
		return;
	}
	let color = '';
	let lineSize = 0;
	if (show) {
		color = 'black';
		lineSize = 1;
	} else {	/* erase grid */
		color = 'white';
		lineSize = 6;
	}
	let i = 1;
	for (; i < axis.xDivision.length; ++i) {
		x = axis.xDivision[i];
		drawLine(x, axis.yLeftRange, x, axis.yRightRange,
			color, lineSize);
	}
	/* yLeft is pos and yRight is neg */
	for (i = 1; i < axis.yDivision.length; ++i) {
		y = axis.yDivision[i];
		drawLine(axis.xLeftRange, y, axis.xRightRange, y,
			color, lineSize);
	}
}

/* clear all function image */
function clearAllFunc() {
	if (!axis.hasSet)
		return;
	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		let funcStr = funcList[i].children[0].children[funcStrPos].value;
		drawFunc('white', funcStr, false, false);
	}
}

/* draw all functions */
function drawAllFunc() {
	if (!axis.hasSet)
		return;
	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		let color = funcList[i].children[0].children[colorPos].value;
		let funcStr = funcList[i].children[0].children[funcStrPos].value;
		let show = funcList[i].children[0].children[showFuncPos].checked;
		let isBold = funcList[i].children[0].children[boldPos].checked;
		if (show) {
			drawFunc(color, funcStr, show, isBold);
		}
	}
}

/* clear all */
function clearAll() {
	idName('show-axis').checked = false;
	idName('grid').checked = false;
	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		funcList[i].children[0].children[showFuncPos].checked = false;
		funcList[i].children[0].children[boldPos].checked = false;
	}

	for (let x = axis.xLeftRange - axis.blank;
		x <= axis.xRightRange + axis.blank; ++x) {
		drawLine(x, axis.yLeftRange + axis.blank,
			x, axis.yRightRange - axis.blank, 'white', 2);
	}
}

/* add operator to the end of function expression */
function addOperator(func) {
	func.children[funcStrPos].value += func.children[opPos].value;
}

/* erase all function */
function eraseAllFunc() {
	clearAllFunc();
	showGrid(false);
	showAxis(false);

	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		funcList[i].children[0].children[showFuncPos].checked = false;
		funcList[i].children[0].children[boldPos].checked = false;
	}

	showGrid(axis.displayGrid);
	showAxis(axis.show)
}
