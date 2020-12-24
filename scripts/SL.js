/*
 * save and load the web
 */

/* the object used to save */
var saveObj = {};
/* the json of the available save */
var saveJson = {};

/*
 * save the current website as json
 */
function saveAsJson() {
	saveObj.penColor = $('#pen-color')[0].value;
	saveObj.penSize = $('#pen-size')[0].value;
	saveObj.eraserSize = $('#eraser-size')[0].value;
	saveObj.xLeftValue = $('#x-left-value')[0].value;
	saveObj.xRightValue = $('#x-right-value')[0].value;
	saveObj.yLeftValue = $('#y-left-value')[0].value;
	saveObj.yRightValue = $('#y-right-value')[0].value;
	saveObj.axis = $('#show-axis')[0].checked;
	saveObj.grid = $('#grid')[0].checked;
	let funcList = $('.a-formula');
	let len = funcList.length;
	saveObj.formulaList = [];
	for (let i = 0; i < len; ++i) {
		saveObj.formulaList.push({

			funcStr: funcList[i].children[funcStrPos].children[0].contentWindow.getLatexExp(),
			color: funcList[i].children[colorPos].value,
			show: funcList[i].children[showFuncPos].checked,
			isBold: funcList[i].children[boldPos].checked
		});
	}
	saveJson.shape = saveCanvas(shapeLayer);
	saveJson.formula = JSON.stringify(saveObj);
}

/*
 * save the canvas @canvas
 */
function saveCanvas(canvas) {
	return JSON.stringify(canvas.toJSON(['name']));
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
	let blob = new Blob([JSON.stringify(saveJson)], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, filename);
}
