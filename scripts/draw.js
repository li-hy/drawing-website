/* need to contain jsxgraphcore.js and jsxgraph.css first */

/* create two canvases for hand-paint and math functions */
var paintLayer = idName('paint-layer');
var funcLayer = idName('func-layer');
canvasWidth = paintLayer.getAttribute("width");
canvasHeight = paintLayer.getAttribute('height');

if (paintLayer.getContext) {
	var paintCtx = paintLayer.getContext('2d');
}
if (funcLayer.getContext) {
	var funcCtx = funcLayer.getContext('2d');
}

/* mouse status when drawing */
var mouseStatus = {
	paint:        0,	/* paint now */
	erase:        1,	/* erase now */
	circle:       2,	/* draw circle now */
	rectangle:    3,	/* draw rectangle now */
	line:         4,	/* draw line now */
	other:        5
};

/* create a mouse object for hand-paint */
var mouse = new Object();
mouse.status = mouseStatus.other;	/* mouse status */
mouse.penSize = 1;		/* pen size */
mouse.eraserSize = 1;		/* eraser size */
mouse.hold = false;		/* is holding mouse now? */
mouse.X = 0;			/* mouse x position */
mouse.Y = 0;			/* mouse y position */
mouse.color = '#000000';	/* mouse(pen only) color */
const rect = paintLayer.getBoundingClientRect();

/* get the objects by id */
function idName(name) {
	return document.getElementById(name);
}

/* get the objects by class name */
function className(name) {
	return document.getElementsByClassName(name);
}

/* set the color of the button when it is pressed down or released */
function setBtnColor(btn, press) {
	if (press)
		btn.style.backgroundColor = '#e74c3c';
	else
		btn.style.backgroundColor = '#3d4450';
}

/* reset mouse function button */
function resetMFuncBtn() {
	setBtnColor(idName('pen'), false);
	setBtnColor(idName('eraser'), false);
	setBtnColor(idName('line'), false);
	setBtnColor(idName('circle'), false);
	setBtnColor(idName('rectangle'), false);
}

/* set status when click the button pen */
function setPen(btn) {
	resetMFuncBtn();
	mouse.status = (mouse.status == mouseStatus.paint) ?
		mouseStatus.other : mouseStatus.paint;
	setBtnColor(btn, (mouse.status == mouseStatus.paint));
}

/* set status when click the button eraser */
function setEraser(btn) {
	resetMFuncBtn();
	mouse.status = (mouse.status == mouseStatus.erase) ?
		mouseStatus.other : mouseStatus.erase;
	setBtnColor(btn, (mouse.status == mouseStatus.erase));
}

paintLayer.addEventListener('mousedown', e => {
	mouse.X = e.clientX - rect.left;
	mouse.Y = e.clientY - rect.top;
	switch (mouse.status) {
	case mouseStatus.paint:
		drawDot(paintCtx, mouse.X, mouse.Y, mouse.color,
			mouse.penSize);
		break;
	case mouseStatus.erase:
		eraseSquare(paintCtx, mouse.X, mouse.Y,
			mouse.eraserSize);
		break;
	default:
		break;
	}
	mouse.hold = true;
})

paintLayer.addEventListener('mousemove', e => {
	if (mouse.hold) {
		let curMouseX = e.clientX - rect.left
		let curMouseY = e.clientY - rect.top;
		switch (mouse.status) {
		case mouseStatus.paint:
			drawLine(paintCtx, mouse.X, mouse.Y,
				curMouseX, curMouseY,
				mouse.color, mouse.penSize);
			break;
		case mouseStatus.erase:
			eraseLine(paintCtx, mouse.X, mouse.Y,
				curMouseX, curMouseY,
				mouse.eraserSize);
			break;
		default:
			break;
		}
		mouse.X = curMouseX;
		mouse.Y = curMouseY;
	}
})

paintLayer.addEventListener('mouseup', e => {
	if (mouse.hold == true) {
		let curMouseX = e.clientX - rect.left
		let curMouseY = e.clientY - rect.top;
		switch (mouse.status) {
		case mouseStatus.paint:
			drawDot(paintCtx, curMouseX, curMouseY,
				mouse.color, mouse.penSize);
			break;
		case mouseStatus.erase:
			eraseSquare(paintCtx, curMouseX, curMouseY,
				mouse.eraserSize);
			break;
		default:
			break;
		}
	}
	mouse.hold = false;
})

/* draw a dot in the canvas */
function drawDot(ctx, x, y, color = '#000000', size = 1) {
	ctx.beginPath();
	size /= 2;
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

/* erase a square in the canvas */
function eraseSquare(ctx, x, y, size = 1) {
	ctx.clearRect(x - size / 2, y - size / 2, size, size);
}

/* draw a line in the canvas */
function drawLine(ctx, x1, y1, x2, y2, color = '#000000', size = 1) {
	if (x1 != x2 || y1 != y2) {
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	} else {
		drawDot(ctx, x1, y1, color, size);
	}
}

/* erase a line in the canvas */
function eraseLine(ctx, x1, y1, x2, y2, size = 1) {
	if (x1 != x2 || y1 != y2) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		if (dx == 0) {
			let yMin = (y1 < y2) ? y1 : y2;
			for (let i = 0; i <= Math.abs(dy); ++i)
				eraseSquare(ctx, x1, yMin + i, size);
		} else if (dy == 0) {
			let xMin = (x1 < x2) ? x1 : x2;
			for (let i = 0; i <= Math.abs(dx); ++i)
				eraseSquare(ctx, y1, xMin + i, size);
		} else {
			let k = dy / dx;
			let x, y;
			let x0, y0;
			if (Math.abs(dx) >= Math.abs(dy)) {
				if (x1 < x2) {
					x0 = x1;
					y0 = y1;
				} else {
					x0 = x2;
					y0 = y2;
				}
				for (let i = 0; i <= Math.abs(dx); ++i) {
					x = x0 + i;
					y = y0 + k * i;
					eraseSquare(ctx, x, y, size);
				}
			} else {
				if (y1 < y2) {
					y0 = y1;
					x0 = x1;
				} else {
					y0 = y2;
					x0 = x2;
				}
				for (let i = 0; i <= Math.abs(dy); ++i) {
					y = y0 + i;
					x = x0 + i / k;
					eraseSquare(ctx, x, y, size);
				}
			}
		}
	}
}

function clearAllTracks(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

var axis = new Object();
axis.set = false;
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

/* blank between function image and axis */
funcBlank = 5;

/* const parameter, some options' positions in the function area */
/* color option */
var colorPos = 0;
/* function expression string */
var funcStrPos = 1;
/* operator */
var opPos = 2;
/* show this function? */
var showFuncPos = 3;
/* bold line */
var boldPos = 4;

/* set division of x axis */
function setAxisDivision(axis) {
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

function getRandomColor() {
	let color = '#';
	while (color.length < 7)
		color += '0123456789abcdef'[Math.floor(Math.random() * 16)];
	return color;
}

/* set origin */
function setOrigin(ctx, axis) {
	ctx.translate(-1 * axis.xLeftRange + axis.blank,
		-1 * axis.yRightRange + axis.blank);
}

/* reset origin */
function resetOrigin(ctx, axis) {
	ctx.translate(axis.xLeftRange - axis.blank,
		axis.yRightRange - axis.blank);
}

/* set axis objects */
function setAxis(ctx, axis, width, height, xLeftValue, xRightValue,
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

	setAxisDivision(axis);

	/* set origin */
	setOrigin(ctx, axis);

	/* has set axis? */
	axis.set = true;
}

/* reset axis objects */
function resetAxis(ctx, axis) {
	/* reset origin */
	resetOrigin(ctx, axis);

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
	axis.set = false;
}

/* auto set axis after web page loaded */
function autoSetAxis(ctx, axis) {
	let xLeftValue = idName('x-left-value').value;
	let xRightValue = idName('x-right-value').value;
	let yLeftValue = idName('y-left-value').value;
	let yRightValue = idName('y-right-value').value;

	setAxis(ctx, axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
		yLeftValue, yRightValue);
}

/* draw a triangle with the coordinates of it's three vertices */
function drawTriangle(ctx, x1, y1, x2, y2, x3, y3,
	isFill = false, color = '#000000', size = 1) {
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
	isFill = false, rotate = 0, color = '#000000', size = 1) {
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

function drawAxis(ctx, axis, color = '#000000') {
	ctx.font = "normal 12px serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = color;

	let arrowRadius = 5;	/* radius of axis arrow circumcircle */
	let lineSize = 2;	/* axis line size */

	/* draw x-axis */
	drawLine(ctx, axis.xLeftRange, axis.yLeftRange,
		axis.xRightRange + axis.blank - 5, axis.yLeftRange,
		color, lineSize);
	drawEquilateralTriangle(ctx, axis.xRightRange + axis.blank - 5,
		axis.yLeftRange, arrowRadius, true, 1, color);
	drawLine(ctx, axis.xLeftRange, axis.yRightRange,
		axis.xRightRange, axis.yRightRange, color, lineSize);
	let i, tx, ty;
	ty = axis.yLeftRange + 10;
	for (i = 0; i < axis.xDivision.length; ++i) {
		tx = axis.xDivision[i];
		drawLine(ctx, tx, axis.yLeftRange, tx, axis.yLeftRange - 3,
			color, lineSize);
		ctx.fillText((axis.xLeftValue + i * axis.dx /
			(axis.xDivision.length - 1)).toFixed(1), tx, ty);
	}
	ctx.fillText('x', axis.xRightRange + axis.blank - 10, ty);

	/* y axis */
	drawLine(ctx, axis.xLeftRange, axis.yLeftRange,
		axis.xLeftRange, axis.yRightRange - axis.blank + 5,
		color, lineSize);
	drawEquilateralTriangle(ctx, axis.xLeftRange,
		axis.yRightRange - axis.blank + 5, arrowRadius, true, 0, color);
	drawLine(ctx, axis.xRightRange, axis.yLeftRange,
		axis.xRightRange, axis.yRightRange, color, lineSize);
	tx = axis.xLeftRange - 15;
	for (i = 0; i <= axis.yDivision.length; ++i) {
		ty =  axis.yDivision[i];
		drawLine(ctx, axis.xLeftRange, ty, axis.xLeftRange + 3, ty,
			color, lineSize);
		ctx.fillText((axis.yLeftValue + i * axis.dy /
			(axis.yDivision.length - 1)).toFixed(1), tx - 1, ty);
	}
	ctx.fillText('y', tx, axis.yRightRange - axis.blank + 10);
}

/* clear the function layer */
function clearFuncLayer(ctx, axis) {
	ctx.clearRect(axis.xLeftRange - axis.blank, axis.yRightRange - axis.blank,
		canvasWidth, canvasHeight);
}

function showAxis(ctx, axis, color = '#000000') {
	if (!axis.show)
		return;
	if (axis.set) {
		drawAxis(ctx, axis, color);
	} else {
		let xLeftValue = idName('x-left-value').value;
		let xRightValue = idName('x-right-value').value;
		let yLeftValue = idName('y-left-value').value;
		let yRightValue = idName('y-right-value').value;

		setAxis(ctx, axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
			yLeftValue, yRightValue);
		drawAxis(ctx, axis, color);
	}
}

/* show grid on axis */
function showGrid(ctx, axis, color = '#000000') {
	if (!axis.displayGrid)
		return;
	if (!axis.set) {
		alert('You must set AXIS first!');
		return;
	}
	let lineSize = 1;
	let i = 0;
	for (; i < axis.xDivision.length; ++i) {
		x = axis.xDivision[i];
		drawLine(ctx, x, axis.yLeftRange, x, axis.yRightRange,
			color, lineSize);
	}
	/* yLeft is pos and yRight is neg */
	for (i = 0; i < axis.yDivision.length; ++i) {
		y = axis.yDivision[i];
		drawLine(ctx, axis.xLeftRange, y, axis.xRightRange, y,
			color, lineSize);
	}
}

function drawFunc(ctx, axis, color, funcStr, show = false, blod = false) {
	if (!show) {
		return;
	} else if (blod){
		lineSize = 4;
	} else {
		lineSize = 2;
	}
	if (funcStr.length == 0)	/* input is null */
		return;
	funcStr = input2FuncStr(funcStr);
	let func = str2Func(funcStr);
	/* define the drawing range */
	let xLeft = axis.xLeftRange + funcBlank;
	let xRight = axis.xRightRange - funcBlank;
	/* yLeftRange is pos and yRightRange is neg */
	let yLeft = axis.yLeftRange - funcBlank;
	let yRight = axis.yRightRange + funcBlank;
	let yb, yc;
	for (let x = xLeft; x <= xRight; ++x) {
		yb = -1 * axis.yScale * func((x - 1) / axis.xScale);
		yc = -1 * axis.yScale * func(x / axis.xScale);
		/* yLeft is pos and yRight is neg */
		if (yb <= yLeft && yb >= yRight &&
			yc <= yLeft && yc >= yRight)
			drawLine(ctx, (x - 1), yb, x, yc, color, lineSize);
	}
}

/* draw all functions */
function drawAllFunc(ctx, axis) {
	if (!axis.set) {
		alert('You must set AXIS first!');
		return;
	}
	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		let color = funcList[i].children[0].children[colorPos].value;
		let funcStr = funcList[i].children[0].children[funcStrPos].value;
		let show = funcList[i].children[0].children[showFuncPos].checked;
		let isBold = funcList[i].children[0].children[boldPos].checked;
		drawFunc(ctx, axis, color, funcStr, show, isBold);
	}
}

/* change axis */
function changeAxis(ctx, axis) {
	clearFuncLayer(ctx, axis);
	resetAxis(ctx, axis);

	let xLeftValue = idName('x-left-value').value;
	let xRightValue = idName('x-right-value').value;
	let yLeftValue = idName('y-left-value').value;
	let yRightValue = idName('y-right-value').value;

	setAxis(ctx, axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
		yLeftValue, yRightValue);
	drawAllFunc(ctx, axis);
	showGrid(ctx, axis);
	showAxis(ctx, axis);
}

/* erase all functions' images */
function eraseAllFunc(ctx, axis) {
	clearFuncLayer(ctx, axis);

	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		funcList[i].children[0].children[showFuncPos].checked = false;
		funcList[i].children[0].children[boldPos].checked = false;
	}

	showAxis(ctx, axis);
	showGrid(ctx, axis);
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
function deleteAFormula(ctx, axis, aFormula) {
	clearFuncLayer(ctx, axis);
	if (className('a-formula').length > 1) {
		aFormula.parentNode.removeChild(aFormula);
	} else {
		aFormula.children[0].children[colorPos].value = '#000000';
		aFormula.children[0].children[funcStrPos].value = '';
		aFormula.children[0].children[showFuncPos].checked = false;
		aFormula.children[0].children[boldPos].checked = false;
	}
	showAxis(ctx, axis);
	showGrid(ctx, axis);
	drawAllFunc(ctx, axis);
}

/* reset the funcion editor setting */
function resetFunc(ctx, axis) {
	idName('show-axis').checked = false;
	idName('grid').checked = false;
	funcList = className('a-formula');

	funcList[0].children[0].children[colorPos].value = '#000000';
	funcList[0].children[0].children[funcStrPos].value = '';
	funcList[0].children[0].children[showFuncPos].checked = false;
	funcList[0].children[0].children[boldPos].checked = false;

	for (; funcList.length > 1;) {
		funcList[0].parentNode.removeChild(funcList[1]);
	}

	clearFuncLayer(ctx, axis);
}

/* add operator to the end of function expression */
function addOperator(func) {
	func.children[funcStrPos].value += func.children[opPos].value;
}

function clickPaint() {
	idName('paint-layer').style.pointerEvents = 'auto';
	idName('shape-layer').style.pointerEvents = 'none';
}

function clickShape() {
	idName('shape-layer').style.pointerEvents = 'auto';
	idName('paint-layer').style.pointerEvents = 'none';
}

/* set status when click the button line */
function setLine(btn) {
	resetMFuncBtn();
	mouse.status = (mouse.status == mouseStatus.line) ?
		mouseStatus.other : mouseStatus.line;
	setBtnColor(btn, (mouse.status == mouseStatus.line));
}

/* set status when click the button circle */
function setCircle(btn) {
	resetMFuncBtn();
	mouse.status = (mouse.status == mouseStatus.circle) ?
		mouseStatus.other : mouseStatus.circle;
	setBtnColor(btn, (mouse.status == mouseStatus.circle));
}

/* set status when click the button rectangle */
function setRectangle(btn) {
	resetMFuncBtn();
	mouse.status = (mouse.status == mouseStatus.rectangle) ?
		mouseStatus.other : mouseStatus.rectangle;
	setBtnColor(btn, (mouse.status == mouseStatus.rectangle));
}

/* create a div element for jsxgraph */
var brd = JXG.JSXGraph.initBoard('shape-layer', {boundingbox: [0, 0, 1050, -630], axis:false, showNavigation: false, showCopyright: false});

var shapeLayer = idName('shape-layer');
var shapeLayerOx = shapeLayer.getBoundingClientRect().left;
var shapeLayerOy = shapeLayer.getBoundingClientRect().top;
var lP;	/* the last point */
var cP;	/* the current point */

function createPoint(board, x, y, sz = 1) {
	return board.create('point', [x, -1 * y], {size: sz, name: ''});
}

/* create a line
 * @board	: the JXG board
 * @p1		: one point of the line
 * @p2		: the other point of the line
 * @sz		: the width of the line
 * @style	: dash style
 */
function createLine(board, p1, p2, sz = 1, style = 0) {
	return board.create('line', [p1, p2], {straightFirst:false,
		straightLast:false, strokeWidth:sz, dash:style});
}

/* create a circle
 * @board	: the JXG board
 * @c		: center of circle
 * @r		: radius
 * @sz		: width of line
 * @style	: dash style
 * @color	: filling color
 * @trans	: transparency
 */
function createCircle(board, c, r, sz = 1, style = 0,
	color = '#ffffff', trans = 1) {
	board.create('circle', [c, r], {strokeWidth: sz, dash: style,
		fillColor: color, fillOpacity: trans});
}

/* create a rectangle
 * @board	: the JXG board
 * @p1		: one point on the diagonal
 * @p2		: the other point on the diagonal
 */
function createRect(board, p1, p2, color = '#ffffff') {
	let p3 = board.create('point', [function() { return p1.X() }, function() { return p2.Y() }], {color: 'blue', size:1, name: ''});
	let p4 = board.create('point', [function() { return p2.X() }, function() { return p1.Y() }], {color: 'blue', size:1, name: ''});
	board.create('polygon', [p1, p4, p2, p3], {hasInnerPoints: true, fillColor: color});
	p3.isDraggable = true;
	p4.isDraggable = true;
}

shapeLayer.addEventListener('mousedown', e => {
	mouse.X = e.clientX - shapeLayerOx;
	mouse.Y = e.clientY - shapeLayerOy;
	switch (mouse.status) {
	case mouseStatus.line:
	case mouseStatus.circle:
	case mouseStatus.rectangle:
		lP = createPoint(brd, mouse.X, mouse.Y);
		break;
	default:
		break;
	}
	mouse.hold = true;
})

shapeLayer.addEventListener('mousemove', e => {
	curMouseX = e.clientX - shapeLayerOx;
	curMouseY = e.clientY - shapeLayerOy;
})

shapeLayer.addEventListener('mouseup', e => {
	curMouseX = e.clientX - shapeLayerOx;
	curMouseY = e.clientY - shapeLayerOy;
	switch (mouse.status) {
	case mouseStatus.line:
		cP = createPoint(brd, curMouseX, curMouseY);
		createLine(brd, lP, cP);
		break;
	case mouseStatus.circle:
		cP = createPoint(brd, curMouseX, curMouseY);
		createCircle(brd, lP, cP);
		break;
	case mouseStatus.rectangle:
		cP = createPoint(brd, curMouseX, curMouseY);
		createRect(brd, lP, cP);
		break;
	default:
		break;
	}
	mouse.hold = false;
})

shapeLayer.oncontextmenu = function(e) {
	e.preventDefault();
	console.log(this);
}
