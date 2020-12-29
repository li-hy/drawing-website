/*
 * save and load the web state
 */

/* the object used to save */
var saveObj = {};
saveObj.formula = {};
/* the json of the variable save */
var saveJson = {};

/*
 * save the current website state as json
 */
function saveAsJson() {
	/* save hand-paint canvas state */
	saveObj.image = paintLayer.toDataURL();

	/* save the function panel state */
	saveObj.formula.penColor = $('#pen-color')[0].value;
	saveObj.formula.penSize = $('#pen-size')[0].value;
	saveObj.formula.eraserSize = $('#eraser-size')[0].value;
	saveObj.formula.xLeftValue = $('#x-left-value')[0].value;
	saveObj.formula.xRightValue = $('#x-right-value')[0].value;
	saveObj.formula.yLeftValue = $('#y-left-value')[0].value;
	saveObj.formula.yRightValue = $('#y-right-value')[0].value;
	saveObj.formula.axis = $('#show-axis')[0].checked;
	saveObj.formula.grid = $('#grid')[0].checked;
	let funcList = $('.a-formula');
	let len = funcList.length;
	saveObj.formula.formulaList = [];
	for (let i = 0; i < len; ++i) {
		saveObj.formula.formulaList.push({

			funcStr: funcList[i].children[funcStrPos].children[0].contentWindow.getLatexExp(),
			color: funcList[i].children[colorPos].value,
			show: funcList[i].children[showFuncPos].checked,
			isBold: funcList[i].children[boldPos].checked
		});
	}

	/* save the shape canvas */
	saveObj.shape = saveShape(shapeLayer);

	/* transform the object to json */
	saveJson = JSON.stringify(saveObj);
}

/*
 * save the shape canvas @shape
 */
function saveShape(shape) {
	return shape.toObject(['name']);
}

/*
 * load the json file, transform it to the shape canvas
 */
function loadShape(shape, json) {
	shape.loadFromJSON(json);
	shape.renderAll();
}

/*
 * save
 * ATTENTION: the file must be save in the save directory under the
 * root directory
 * @filename   : the name of the save file
 */
function mySave(filename) {
	saveAsJson();
	let blob = new Blob([saveJson],
		{type: 'text/plain;charset=utf-8'});
	saveAs(blob, filename);
}

/*
 * load
 * ATTENTION: only can load the file in the save directory under the
 *            root directory
 * @filename    : the name of the save file
 */
function myLoad(filename) {
	let loadObj;

	/* get the file name */
	let slash = new RegExp('\\\\');
	filename = filename.split(slash);
	filename = filename[filename.length - 1];
	filename = 'save/' + filename;

	/* load */
	$.getJSON(filename, function(data) {
		/* load hand-paint canvas */
		let image = new Image();
		image.onload = function() {
			paintCtx.clearRect(0, 0, canvasWidth, canvasHeight);
			paintCtx.drawImage(image, 0, 0);
		}
		image.src = data.image;

		/* load the shape canvas */
		loadShape(shapeLayer, data.shape);

		/* load the function panel */
		loadObj = data.formula;
		$('#pen-color')[0].value = loadObj.penColor;
		$('#pen-size')[0].value = loadObj.penSize;
		$('#eraser-size')[0].value = loadObj.eraserSize;
		$('#x-left-value')[0].value =
			parseFloat(loadObj.xLeftValue);
		$('#x-right-value')[0].value =
			parseFloat(loadObj.xRightValue);
		$('#y-left-value')[0].value =
			parseFloat(loadObj.yLeftValue);
		$('#y-right-value')[0].value =
			parseFloat(loadObj.yRightValue);
		$('#reset')[0].click();
		for (let i = 0; i < loadObj.formulaList.length - 1; ++i)
			$('#add-a-formula')[0].click();
		let funcList = $('.a-formula');
		for (let i = 0; i < funcList.length; ++i) {
			/* delay 500ms to wait for the formula editor
			 * to initialize
			 */
			setTimeout(function() {
				funcList[i].children[funcStrPos].children[0].contentWindow.mathField.write(loadObj.formulaList[i].funcStr);
			}, 500);
			funcList[i].children[colorPos].value =
				loadObj.formulaList[i].color;
			funcList[i].children[showFuncPos].checked =
				loadObj.formulaList[i].show;
			funcList[i].children[boldPos].checked =
				loadObj.formulaList[i].isBold;
			if (i == funcList.length - 1) {
				/* delay 600ms to wait for the formula
				 * editor to initialize
				 */
				setTimeout(function() {
					clearFuncLayer(funcCtx, axis);
					resetAxis(funcCtx, axis);
					$('#show-axis')[0].checked =
						loadObj.axis;
					$('#grid')[0].checked =
						loadObj.grid;
					let xLeftValue =
						idName('x-left-value').value;
					let xRightValue =
						idName('x-right-value').value;
					let yLeftValue =
						idName('y-left-value').value;
					let yRightValue =
						idName('y-right-value').value;

					/* repaint all function */
					axis.show =
						idName('show-axis').checked;
					axis.displayGrid =
						idName('grid').checked;

					setAxis(funcCtx, axis,
						canvasWidth, canvasHeight,
						xLeftValue, xRightValue,
						yLeftValue, yRightValue);
					drawAllFunc(funcCtx, axis);
					showGrid(funcCtx, axis);
					showAxis(funcCtx, axis);
				}, 600);
			}
		}
	});
}
