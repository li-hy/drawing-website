/*
 * save and load the web
 */

/* the object used to save */
var saveObj = {};
saveObj.formula = {};
/* the json of the available save */
var saveJson = {};

/*
 * save the current website as json
 */
function saveAsJson() {
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
	saveObj.shape = saveCanvas(shapeLayer);
	saveJson = JSON.stringify(saveObj);
}

/*
 * save the canvas @canvas
 */
function saveCanvas(canvas) {
	return canvas.toObject(['name']);
}

/*
 * load the json file
 */
function loadCanvas(canvas, json) {
	canvas.loadFromJSON(json);
	canvas.renderAll();
}

/*
 * save
 */
function mySave(filename) {
	saveAsJson();
	let blob = new Blob([saveJson], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, filename);
}

/*
 * load
 */
function myLoad(filename) {
	let loadObj;

	let slash = new RegExp('\\\\');
	filename = filename.split(slash);
	filename = filename[filename.length - 1];
	filename = 'save/' + filename;
	$.getJSON(filename, function(data) {
		loadCanvas(shapeLayer, data.shape);
		loadObj = data.formula;
		console.log(loadObj);
		$('#pen-color')[0].value = loadObj.penColor;
		$('#pen-size')[0].value = loadObj.penSize;
		$('#eraser-size')[0].value = loadObj.eraserSize;
		$('#x-left-value')[0].value = parseFloat(loadObj.xLeftValue);
		$('#x-right-value')[0].value = parseFloat(loadObj.xRightValue);
		$('#y-left-value')[0].value = parseFloat(loadObj.yLeftValue);
		$('#y-right-value')[0].value = parseFloat(loadObj.yRightValue);
		$('#reset')[0].click();
		for (let i = 0; i < loadObj.formulaList.length - 1; ++i)
			$('#add-a-formula')[0].click();
		let funcList = $('.a-formula');
		for (let i = 0; i < funcList.length; ++i) {
			setTimeout(function() {
				funcList[i].children[funcStrPos].children[0].contentWindow.mathField.write(loadObj.formulaList[i].funcStr);
			}, 500);
			funcList[i].children[colorPos].value = loadObj.formulaList[i].color;
			funcList[i].children[showFuncPos].checked = loadObj.formulaList[i].show;
			funcList[i].children[boldPos].checked = loadObj.formulaList[i].isBold;
			if (i == funcList.length - 1) {
				setTimeout(function() {
					clearFuncLayer(funcCtx, axis);
					resetAxis(funcCtx, axis);
					$('#show-axis')[0].checked = loadObj.axis;
					$('#grid')[0].checked = loadObj.grid;
					let xLeftValue = idName('x-left-value').value;
					let xRightValue = idName('x-right-value').value;
					let yLeftValue = idName('y-left-value').value;
					let yRightValue = idName('y-right-value').value;
					axis.show = idName('show-axis').checked;
					axis.displayGrid = idName('grid').checked;

					setAxis(funcCtx, axis, canvasWidth, canvasHeight, xLeftValue, xRightValue,
						yLeftValue, yRightValue);
					drawAllFunc(funcCtx, axis);
					showGrid(funcCtx, axis);
					showAxis(funcCtx, axis);
				}, 600);
			}
		}
	});
}
