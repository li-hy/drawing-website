/* create two canvases for hand-paint and math functions */
var paintLayer = idName('paint-layer');
var funcLayer = idName('func-layer');

/* the canvas's height and width */
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
	paint:        0,        /* paint now */
	erase:        1,        /* erase now */
	other:        2         /* the other */
};

/* create a mouse object for hand-paint */
var mouse = new Object();
mouse.status = mouseStatus.other;  /* mouse status */
mouse.penSize = 1;                 /* pen size */
mouse.eraserSize = 1;              /* eraser size */
mouse.hold = false;                /* is holding mouse now? */
mouse.X = 0;                       /* mouse x position */
mouse.Y = 0;                       /* mouse y position */
mouse.color = '#000000';           /* mouse color(only use for pen) */
const rect = paintLayer.getBoundingClientRect();

/* get the objects by id, return the matching object */
function idName(name) {
	return document.getElementById(name);
}

/* get the objects by class name, return the matching object */
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

/*
 * set all buttons' color and select which
 * canvas the mouse can click on
 */
function setAllBtnColor() {
	setBtnColor(idName('pen'), (mouse.status == mouseStatus.paint));
	setBtnColor(idName('eraser'),
		(mouse.status == mouseStatus.erase));
	if (mouse.status == mouseStatus.other)
		clickShape();
	else
		clickPaint();
}

/* set mosue status when click the button pen */
function setPen() {
	mouse.status = (mouse.status == mouseStatus.paint) ?
		mouseStatus.other : mouseStatus.paint;
	setAllBtnColor();
}

/* set mouse status when click the button eraser */
function setEraser() {
	mouse.status = (mouse.status == mouseStatus.erase) ?
		mouseStatus.other : mouseStatus.erase;
	setAllBtnColor();
}

/* add mouse down listener event on the hand-paint layer */
paintLayer.addEventListener('mousedown', e => {
	/* the position of the mouse */
	mouse.X = e.clientX - rect.left;
	mouse.Y = e.clientY - rect.top;
	/* set mouse actions according to the status */
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
	/* mouse down */
	mouse.hold = true;
})

/* add moving mouse listener event on the hand-paint layer */
paintLayer.addEventListener('mousemove', e => {
	/* hold and move the mouse */
	if (mouse.hold) {
		/* the current position of the mouse */
		let curMouseX = e.clientX - rect.left
		let curMouseY = e.clientY - rect.top;
		/* set mouse actions according to the status */
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

/* add release mouse listener event on the hand-paint layer */
paintLayer.addEventListener('mouseup', e => {
	/* release the mouse */
	if (mouse.hold == true) {
		/* the current position of the mouse */
		let curMouseX = e.clientX - rect.left
		let curMouseY = e.clientY - rect.top;
		/* set mouse actions according to the status */
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
	/* release the mouse */
	mouse.hold = false;
})

/*
 * draw a dot in the canvas
 * @ctx      : canvas to be painted
 * @x        : dot's x coordinate
 * @y        : dot's y coordinate
 * @color    : dot's color
 * @size     : dot's diameter
 */
function drawDot(ctx, x, y, color = '#000000', size = 1) {
	ctx.beginPath();
	size /= 2;
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

/*
 * erase a square area in the canvas
 * @ctx      : the canvas to be erased
 * @x        : the x coordinate of the square center
 * @y        : the y coordinate of the square center
 * @size     : square's side length
 */
function eraseSquare(ctx, x, y, size = 1) {
	ctx.clearRect(x - size / 2, y - size / 2, size, size);
}

/*
 * draw a line in the canvas
 * @ctx             : the canvas to be painted
 * @x1, x2, y1, y2  : the x and y coordinates of the end of line
 * @color           : the color of line
 * @size            : theckness of the line
 */
function drawLine(ctx, x1, y1, x2, y2, color = '#000000', size = 1) {
	/* if (x1, y1) and (x2, y2) aren't the same dot, draw a line */
	if (x1 != x2 || y1 != y2) {
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	} else { /* (x1, y1) and (x2, y2) are the same dot */
		drawDot(ctx, x1, y1, color, size);
	}
}

/*
 * erase a line on the canvas
 * @ctx             : the canvas to be erased
 * @x1, y1, x2, y2  : the coordinate of the end of line
 * @size            : the theckness of the line
 */
function eraseLine(ctx, x1, y1, x2, y2, size = 1) {
	/* (x1, y1), (x2, y2) aren't the same dot */
	if (x1 != x2 || y1 != y2) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		if (dx == 0) { /* slope is infinite */
			let yMin = (y1 < y2) ? y1 : y2;
			for (let i = 0; i <= Math.abs(dy); ++i)
				eraseSquare(ctx, x1, yMin + i, size);
		} else if (dy == 0) { /* slope is 0 */
			let xMin = (x1 < x2) ? x1 : x2;
			for (let i = 0; i <= Math.abs(dx); ++i)
				eraseSquare(ctx, y1, xMin + i, size);
		} else { /* slope is not 0 or infinite */
			let k = dy / dx;
			let x, y;
			let x0, y0;
			/* erase as manay point as possible
			 * to ensure accuracy
			 */
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
	} else { /* (x1, y1) and (x2, y2) are the same dot */
		eraseSquare(ctx, x1, y1, size);
	}
}

/*
 * clear all tracks on the canvas
 * @ctx      : canvas
 */
function clearAllTracks(ctx) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

/* the axis object, use to record the status of axis */
var axis = new Object();
axis.set = false;         /* has the axis be set? */
/* the distance between the coordinate axis and the edge of the cnvas */
axis.blank = 0;
/* show the axis? */
axis.show = false;
/* display the grid? */
axis.displayGrid = false;
axis.maxXDivision = 20;   /* max number allowed of division of x axis */
axis.maxYDivision = 10;   /* max number allowed of division of y axis */
/* value of divisions */
axis.xDivision = [];
axis.yDivision = [];

/* blank between function image and axis */
var funcBlank = 3;

/* const parameter, some options' positions in the function area in the
 * file drawing.html, if it is changed, check here please
 */
/* function expression string */
var funcStrPos = 0;
/* color */
var colorPos = 1;
/* show this function? */
var showFuncPos = 2;
/* bold line? */
var boldPos = 3;

/*
 * set division of x axis
 * @axis   : the axis object
 */
function setAxisDivision(axis) {
	/* reset x and y division */
	axis.xDivision.length = 0;
	axis.yDivision.length = 0;

	/* number of division */
	let xMax = 0;
	let yMax = 0;

	xMax = (axis.dx <= axis.maxXDivision) ? axis.dx :
		axis.maxXDivision;
	yMax = (axis.dy <= axis.maxYDivision) ? axis.dy :
		axis.maxYDivision;
	/* interval size */
	xStep = (axis.width - 2 * axis.blank) / xMax;
	yStep = (axis.height - 2 * axis.blank) / yMax;

	let x = axis.xLeftRange;
	for (let i = 0; i <= xMax; ++i)
		axis.xDivision.push(x + i * xStep);
	let y = axis.yLeftRange;
	for (i = 0; i <= yMax; ++i)
		axis.yDivision.push(y - i * yStep);
}

/* return a random color */
function getRandomColor() {
	let color = '#';
	while (color.length < 7)
		color += '0123456789abcdef'[Math.floor(Math.random() * 16)];
	return color;
}

/*
 * set origin of the canvas
 * @ctx      : canvas corresponding to the axis
 * @axis     : axis
 */
function setOrigin(ctx, axis) {
	ctx.translate(-1 * axis.xLeftRange + axis.blank,
		-1 * axis.yRightRange + axis.blank);
}

/*
 * reset origin
 * @ctx      : canvas corresponding to the axis
 * @axis     : axis
 */
function resetOrigin(ctx, axis) {
	ctx.translate(axis.xLeftRange - axis.blank,
		axis.yRightRange - axis.blank);
}

/*
 * set axis objects
 * @ctx            : canvas corresponding to the axis
 * @axis           : axis
 * @width          : width of the canvas
 * @height         : height of the canvas
 * @xLeftValue     : x-axis starting point
 * @xRightValue    : x-axis end point
 * @yLeftValue     : y-axis starting point
 * @yRightValue    : y-axis starting point
 */
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

	/* coordinate scaling, leaving some blank areas */
	axis.blank = 30;
	axis.dx = xRightValue - xLeftValue;
	axis.dy = yRightValue - yLeftValue;
	axis.xScale = (width - 2 * axis.blank) / axis.dx;
	axis.yScale = (height - 2 * axis.blank) / axis.dy;

	/* set the axis pixel range on the canvas,
	 * leaving some blank areas
	 */
	axis.xLeftRange = xLeftValue / axis.dx *
		(width - 2 * axis.blank);
	axis.xRightRange = xRightValue / axis.dx *
		(width - 2 * axis.blank);
	axis.yLeftRange = -1 * yLeftValue / axis.dy *
		(height - 2 * axis.blank);
	axis.yRightRange = -1 * yRightValue / axis.dy *
		(height - 2 * axis.blank);

	/* set division of axis */
	setAxisDivision(axis);

	/* set origin */
	setOrigin(ctx, axis);

	/* has set axis? */
	axis.set = true;
}

/*
 * reset axis objects
 * @ctx      : canvas corresponding to the axis
 * @axis     : axis
 */
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

	/* reset the blank and coordinate scaling */
	axis.blank = 0;
	axis.dx = 0;
	axis.dy = 0;
	axis.xScale = 0;
	axis.yScale = 0;

	/* rest set the axis range on the canvas */
	axis.xLeftRange = 0;
	axis.xRightRange = 0;
	axis.yLeftRange = 0;
	axis.yRightRange = 0;

	/* has set axis? */
	axis.set = false;
}

/*
 * auto set axis after web page loaded
 * @ctx        : canvas corresponding to the axis
 * @axis       : axis
 */
function autoSetAxis(ctx, axis) {
	/* get the user specified axis range */
	let xLeftValue = idName('x-left-value').value;
	let xRightValue = idName('x-right-value').value;
	let yLeftValue = idName('y-left-value').value;
	let yRightValue = idName('y-right-value').value;

	setAxis(ctx, axis, canvasWidth, canvasHeight, xLeftValue,
		xRightValue, yLeftValue, yRightValue);
}

/*
 * draw a triangle with the coordinates of it's three vertices
 * @ctx                    : canvas to be painted
 * @x1, y1, x2, y2, x3, y3 : coordinates of the triangle
 * @isFill                 : need to fill?
 * @color                  : color of the triangle
 * @size                   : line theckness of the triangle
 */
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

/*
 * draw a equilateral triangle with the center and radius of it's
 * circumcircle, then rotate it @rotate * pi / 4
 * @ctx         : canvas to be painted
 * @x, y        : coordinates of the equilateral triangle's center
 * @raduis      : radius of it's circumcircle
 * @ifFill      : need to fill?
 * @rotate      : the number of pi/4 to rotate
 * @color       : color
 * @size        : line theckness
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
		/* move the canvas origin to the
		 * center of the triangle
		 */
		ctx.translate(x, y);
		/* rotate the canvas */
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

/*
 * disable a input element
 * @id      : the input id
 * @disable : disable or not
 */
function disableInput(id, disable) {
	if (disable)
		idName(id).disabled = "disabled";
	else
		idName(id).disabled = "";
}

/*
 * draw the axis
 * @ctx      : canvas to be painted
 * @axis     : axis
 * @color    : color of the axis
 */
function drawAxis(ctx, axis, color = '#000000') {
	/* axis font parameter */
	ctx.font = "normal 12px serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = color;

	let arrowRadius = 5;	/* radius of axis arrow circumcircle */
	let lineSize = 2;	/* axis line size */

	/* get the axis origin coordinates */
	let originX = parseFloat(idName('origin-X').value);
	let originY = parseFloat(idName('origin-Y').value);
	if (originX < axis.xLeftValue || originX > axis.xRightValue ||
		originY < axis.yLeftValue || originY > axis.yRightValue) {
		alert('The origin is out of the canvas');
		return;
	}
	originX = axis.xLeftRange + axis.xScale *
		(originX - axis.xLeftValue);
	/* yLeftRange is pos and yRightRange is neg */
	originY = axis.yLeftRange - axis.yScale *
		(originY - axis.yLeftValue);

	/* draw x-axis */
	drawLine(ctx, axis.xLeftRange, originY,
		axis.xRightRange + axis.blank - 5, originY, color, lineSize);
	drawEquilateralTriangle(ctx, axis.xRightRange + axis.blank - 5,
		originY, arrowRadius, true, 1, color);
	let i, tx, ty;
	ty = originY + 10;
	for (i = 0; i < axis.xDivision.length; ++i) {
		tx = axis.xDivision[i];
		drawLine(ctx, tx, originY, tx, originY - 3, color, lineSize);
		ctx.fillText((axis.xLeftValue + i * axis.dx /
			(axis.xDivision.length - 1)).toFixed(1), tx, ty);
	}
	ctx.fillText('x', axis.xRightRange + axis.blank - 10, ty);

	/* draw y axis */
	drawLine(ctx, originX, axis.yLeftRange, originX,
		axis.yRightRange - axis.blank + 5, color, lineSize);
	drawEquilateralTriangle(ctx, originX,
		axis.yRightRange - axis.blank + 5, arrowRadius, true, 0, color);
	tx = originX - 15;
	for (i = 0; i <= axis.yDivision.length; ++i) {
		ty =  axis.yDivision[i];
		drawLine(ctx, originX, ty, originX + 3, ty, color, lineSize);
		ctx.fillText((axis.yLeftValue + i * axis.dy /
			(axis.yDivision.length - 1)).toFixed(1), tx - 1, ty);
	}
	ctx.fillText('y', tx, axis.yRightRange - axis.blank + 10);
}

/*
 * draw the axis as a frame
 * @ctx      : canvas to be painted
 * @axis     : axis
 * @color    : color of the axis
 */
function drawAxisAsFrame(ctx, axis, color = '#000000') {
	/* axis font parameter */
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

	/* draw y axis */
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

/*
 * clear the function layer
 * @ctx    : the function canvas
 * @axis   : axis
 */
function clearFuncLayer(ctx, axis) {
	ctx.clearRect(axis.xLeftRange - axis.blank, axis.yRightRange - axis.blank,
		canvasWidth, canvasHeight);
}

/*
 * draw axis on the canvas
 * @ctx      : canvas to be painted
 * @axis     : axis
 * @color    : color of the axis
 */
function showAxis(ctx, axis, color = '#000000') {
	if (!axis.show) /* do not show axis */
		return;
	if (!axis.set) { /* haven't set axis */
		let xLeftValue = idName('x-left-value').value;
		let xRightValue = idName('x-right-value').value;
		let yLeftValue = idName('y-left-value').value;
		let yRightValue = idName('y-right-value').value;

		setAxis(ctx, axis, canvasWidth, canvasHeight, xLeftValue,
			xRightValue, yLeftValue, yRightValue);
	}
	if (axis.frame) { /* show axis as a frame*/
		drawAxisAsFrame(ctx, axis, color);
	} else {          /* show axis as normal */
		drawAxis(ctx, axis, color);
	}
}

/*
 * show grid on axis
 * @ctx      : canvas to be painted
 * @axis     : axis
 * @color    : color of the grid
 */
function showGrid(ctx, axis, color = '#000000') {
	if (!axis.displayGrid) /* do not show grid */
		return;
	if (!axis.set) {       /* haven't set axis */
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

/*
 * draw a function on canvas
 * @ctx       : canvas to be painted
 * @axis      : axis
 * @color     : color of the function image
 * @funcStr   : the function expression string
 * @show      : need to show?
 * @blod      : need to blod the line?
 */
function drawFunc(ctx, axis, color, funcStr, show = false, blod = false) {
	if (!show) {              /* do now show */
		return;
	} else if (blod){         /* need to blod the line */
		lineSize = 4;
	} else {                  /* don't need to blod the line */
		lineSize = 2;
	}
	if (funcStr.length == 0)  /* input is null */
		return;
	/* transform the function expression string to a function */
	funcStr = input2FuncStr(funcStr);
	let func = str2Func(funcStr);
	/* define the drawing range */
	let xLeft = axis.xLeftRange + funcBlank;
	let xRight = axis.xRightRange - funcBlank;
	/* yLeftRange is pos and yRightRange is neg */
	let yLeft = axis.yLeftRange - funcBlank;
	let yRight = axis.yRightRange + funcBlank;
	let yc, yb; /* the current point and the point before it */
	for (let x = xLeft; x <= xRight; ++x) {
		yb = -1 * axis.yScale * func((x - 1) / axis.xScale);
		yc = -1 * axis.yScale * func(x / axis.xScale);
		/* ensure the function image does not exceed the axis
		 * area, yLeft is pos and yRight is neg
		 */
		if (yb <= yLeft && yb >= yRight &&
			yc <= yLeft && yc >= yRight)
			drawLine(ctx, (x - 1), yb, x, yc, color, lineSize);
	}
}

/*
 * draw all functions
 * @ctx   : canvas to be painted
 * @axis  : axis
 */
function drawAllFunc(ctx, axis) {
	if (!axis.set) { /* haven't set the axis */
		alert('You must set AXIS first!');
		return;
	}
	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		let funcStr = funcList[i].children[funcStrPos].children[0].contentWindow.getLatexExp();
		let color = funcList[i].children[colorPos].value;
		let show = funcList[i].children[showFuncPos].checked;
		let isBold = funcList[i].children[boldPos].checked;
		drawFunc(ctx, axis, color, funcStr, show, isBold);
	}
}

/*
 * change axis
 * @ctx    : canvas corresponding to the axis
 * @axis   : axis
 */
function changeAxis(ctx, axis) {
	clearFuncLayer(ctx, axis);
	resetAxis(ctx, axis);

	/* get the user specified axis range */
	let xLeftValue = idName('x-left-value').value;
	let xRightValue = idName('x-right-value').value;
	let yLeftValue = idName('y-left-value').value;
	let yRightValue = idName('y-right-value').value;

	setAxis(ctx, axis, canvasWidth, canvasHeight, xLeftValue,
		xRightValue, yLeftValue, yRightValue);
	drawAllFunc(ctx, axis);
	showGrid(ctx, axis);
	showAxis(ctx, axis);
}

/*
 * erase all functions' images
 * @ctx       : canvas corresponding to the axis
 * @axis      : axis
 */
function eraseAllFunc(ctx, axis) {
	clearFuncLayer(ctx, axis);

	funcList = className('a-formula');
	for (let i = 0; i < funcList.length; ++i) {
		funcList[i].children[showFuncPos].checked = false;
		funcList[i].children[boldPos].checked = false;
	}

	showAxis(ctx, axis);
	showGrid(ctx, axis);
}

/* add a new formula into formula editor's area */
function addAFormula() {
	let newFormula = className('a-formula')[0].cloneNode(true);
	newFormula.children[colorPos].value = getRandomColor();
	newFormula.children[showFuncPos].checked = false;
	newFormula.children[boldPos].checked = false;
	idName('formulas').appendChild(newFormula);
}

/* delete a formula from formula editor area */
function deleteAFormula(ctx, axis, aFormula) {
	clearFuncLayer(ctx, axis);
	if (className('a-formula').length > 1) {  /* delete it */
		aFormula.parentNode.removeChild(aFormula);
	} else {   /* it's the only formula, reset it */
		aFormula.children[colorPos].value = '#000000';
		aFormula.children[showFuncPos].checked = false;
		aFormula.children[boldPos].checked = false;
	}
	showAxis(ctx, axis);
	showGrid(ctx, axis);
	drawAllFunc(ctx, axis);
}

/*
 * reset the funcion editor setting
 * @ctx    : canvas corresponding to the axis
 * @axis   : axis
 */
function resetFunc(ctx, axis) {
	idName('show-axis').checked = false;
	idName('grid').checked = false;
	let funcList = className('a-formula');

	funcList[0].children[colorPos].value = '#000000';
	funcList[0].children[showFuncPos].checked = false;
	funcList[0].children[boldPos].checked = false;

	for (; funcList.length > 1;) { /* funcList change in real time */
		funcList[0].parentNode.removeChild(funcList[1]);
	}

	clearFuncLayer(ctx, axis);
}

/* let the mouse click on hand-paint canvas */
function clickPaint() {
	idName('paint-layer').style.pointerEvents = 'auto';
	idName('shape-layer').style.pointerEvents = 'none';
	className('upper-canvas')[0].style.pointerEvents = 'none';
}

/* let the mouse click on shape canvas */
function clickShape() {
	idName('shape-layer').style.pointerEvents = 'auto';
	className('upper-canvas')[0].style.pointerEvents = 'auto';
	idName('paint-layer').style.pointerEvents = 'none';
}

var shapeLayer;        /* shape canvas */
var contextMenuItems;  /* menu item */
var menuPos;           /* menu position */

window.onload = function() {
	autoSetAxis(funcCtx, axis);
	/* add right-click event monitoring on the upper object of the
	 * canvas
	 */
	shapeLayer = new fabric.Canvas('shape-layer');
	$(".upper-canvas").contextmenu(onContextmenu);
	/* use the shape center coordinates to create it */
	fabric.Object.prototype.originX = 'center';
	fabric.Object.prototype.originY = 'center';

	/* initialize the right-click menu */
	$.contextMenu({
		selector: '#contextmenu-output',
		trigger: 'none',
		build: function() {
			return {
				callback: contextMenuClick,
				items: contextMenuItems
			}
		}

	})
}

/* be called when right-click */
function onContextmenu(e) {
	let pointer = shapeLayer.getPointer(e.originalEvent);
	let objs = shapeLayer.getObjects();
	for (let i = 0; i < objs.length; ++i) {
		let obj = objs[i];
		/* judge if the pointer is in the object */
		if (obj.containsPoint(pointer)) {
			/* select the object */
			shapeLayer.setActiveObject(obj);
		}
	}
	/* show the menu */
	let setlectedObjs = shapeLayer.getActiveObjects();
	showContextMenu(e, setlectedObjs);
	/* prevent system right-click menu */
	e.preventDefault();
}

/* show right-click menu */
function showContextMenu(e, obj) {
	contextMenuItems = {
		'copy': {
			name: 'Copy',
			icon: 'fa-copy fa-lg',
			data: obj,
			disabled: function() {
				if (obj.length == 0)
					return true;
			}
		},
		'paste': {
			name: 'Paste',
			icon: 'fa-paste fa-lg',
			data: obj,
			disabled: function() {
				if (obj.length == 0)
					return true;
			}
		},
		'delete': {
			name: 'Delete',
			icon: 'fa-trash-o fa-lg',
			data: obj,
			disabled: function() {
				if (obj.length == 0)
					return true;
			}
		},
		'formula': {
			name: 'Formula',
			icon: 'fa-pencil fa-lg',
			data: obj,
			disabled: function() {
				if (obj.length != 1 ||
					(obj[0].get('type') !==
					'textbox' &&
					obj[0].get('type') !== 'image'))
					return true;
			},
		},
	};
	/* the position where the right-click menu is showed */
	menuPos = {
		x: e.clientX,
		y: e.clientY
	};
	$('#contextmenu-output').contextMenu(menuPos);
}

/* formula text */
var fTxt;

/* right-click function */
function contextMenuClick(key) {
	if (key == 'copy') {
		copy(shapeLayer);
	}
	if (key == 'paste') {
		paste(shapeLayer);
	}
	if (key == 'delete') {
		for (let i = 0;
			i < contextMenuItems[key].data.length; ++i)
			shapeLayer.remove(contextMenuItems[key].data[i]);
		shapeLayer.discardActiveObject();
		shapeLayer.requestRenderAll();
	}
	if (key == 'formula') {
		if (contextMenuItems[key].data[0].get('type')
			=== 'textbox') {
			let fE = $('#right-click-formula-editor');
			fE.css({'left': menuPos.x,
				'top': menuPos.y - 40});
			fE.show();
		} else if (contextMenuItems[key].data[0].get('type')
			=== 'image') {
			let fE = $('#right-click-formula-editor');
			fE.css({'left': menuPos.x,
				'top': menuPos.y - 40});
			fE.show();
			fTxt = contextMenuItems[key].data[0].name;
		}
	}
}

/*
 * add a rectangle to the canvas layer
 * @layer       : layer used to add a rectangle
 * @w           : rectangle's width
 * @h           : rectangle's height
 * @borderColor : rectangle border's color
 * @fillColor   : fill color
 */
function addRectangle(layer, w, h, borderColor = 'black',
	fillColor = 'transparent',) {
	mouse.status = mouseStatus.other;
	setAllBtnColor();
	let rectangle = new fabric.Rect({
		left: 530,
		top: 315,
		width: w,
		height: h,
		stroke: borderColor,
		strokeWidth: 1,
		fill: fillColor
	});
	layer.add(rectangle);
	rectangle.name = 'shape';
}

/*
 * add a circle to the canvas layer
 * @layer         : layer used to add a circle
 * @r             : radius of the circle
 * @borderColor   : border color of the circle
 * @fillColor     : fill color
 */
function addCircle(layer, r, borderColor = 'black',
	fillColor = 'transparent') {
	mouse.status = mouseStatus.other;
	setAllBtnColor();
	let circle = new fabric.Circle({
		left: 530,
		top: 315,
		radius: r,
		stroke: borderColor,
		strokeWidth: 1,
		fill: fillColor
	});
	layer.add(circle);
	circle.name = 'shape';
}

/*
 * add a line to the canvas layer
 * @layer         : layer used to add a line
 * @lineColor     : color of the line
 */
function addLine(layer, lineColor = 'black') {
	mouse.status = mouseStatus.other;
	setAllBtnColor();
	let line = new fabric.Line(
		[480, 315, 580, 315],
		{
			stroke: lineColor,
			strokeWidth: 2,
		});
	layer.add(line);
	line.name = 'shape';
}

/*
 * add a text box to the canvas layer
 * @layer         : layer used to add a text box
 */
function addTextBox(layer) {
	mouse.status = mouseStatus.other;
	setAllBtnColor();
	let textbox = new fabric.Textbox('', {
		left: 530,
		top: 315,
		width: 100,
		height: 30,
		lineHeight: 1.3,
		fontSize: 16,
		fontWeight: '530',
		fontcolor: 'black',
	});
	layer.add(textbox);
	textbox.name = 'textBox';
	layer.setActiveObject(textbox);
}

/*
 * add a formula image to the canvas layer
 * @layer     : layer used to add formula
 * @src       : the image source url
 * @fTxt      : the function expression text
 */
function addFormula(layer, src, fTxt) {
	/* remove the text box */
	let setlectedObjs = layer.getActiveObjects();
	layer.remove(setlectedObjs[0]);
	layer.discardActiveObject();
	layer.requestRenderAll();

	/* add the formula image */
	fabric.Image.fromURL(src, function(img) {
		let oImg = img.set({ left: menuPos.x,
			top: menuPos.y - 60 }).scale(0.5);
		oImg.name = fTxt;
		layer.add(oImg);
		layer.setActiveObject(oImg);
	});
}

/*
 * copy the selected objects
 * @layer    : the canvas corresponding to the objects
 */
function copy(layer) {
	layer.getActiveObject().clone(function(cloned) {
		_clipboard = cloned;
	});
}

/*
 * paste the copied objects to the canvas layer
 * @layer    : the canvas used to paste
 */
function paste(layer) {
	/* clone again, so can do multiple copies */
	_clipboard.clone(function(clonedObj) {
		layer.discardActiveObject();
		clonedObj.set({
			left: clonedObj.left + 10,
			top: clonedObj.top + 10,
			evented: true,
		});
		if (clonedObj.type === 'activeSelection') {
			/* active selection needs a
			 * reference to the layer
			 */
			clonedObj.canvas = layer;
			clonedObj.forEachObject(function(obj) {
				layer.add(obj);
			});
			/* this should solve the unselectability */
			clonedObj.setCoords();
		} else {
			layer.add(clonedObj);
		}
		_clipboard.top += 10;
		_clipboard.left += 10;
		layer.setActiveObject(clonedObj);
		layer.requestRenderAll();
	});
}
