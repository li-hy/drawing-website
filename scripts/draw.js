function idName(name) {
	return document.getElementById(name);
}

function className(name) {
	return document.getElementsByClassName(name);
}

function drawAreaInit() {
	alert('drawInit');
	let myCanvas = document.getElementById('my-canvas');
	myCanvas.width = 900;
	myCanvas.height = 506;
	let myCtx = myCanvas.getContext('2d');
	return myCtx;
}

function addAFormula() {
	let newFormula = className('a-formula')[0].cloneNode(true);
	idName('formulas').appendChild(newFormula);
}

function deleteAFormula(aFormula) {
	if (className('a-formula').length > 1)
		aFormula.parentNode.removeChild(aFormula);
}

function reDraw() {
	alert('reDraw');
}

function test() {
	alert("test");
}
