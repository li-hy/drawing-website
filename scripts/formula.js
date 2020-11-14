/* get input infomation by name */
function getInput(name) {
	return document.getElementsByName(name)[0].children[0];
}

/* convert input text to function string, return a string */
function input2FuncStr(f) {
	let operator = new RegExp('([\-\+\*\/\^\(\)]+)', 'g');
	let op = f.split(operator);	/* get operands and operators */
	let funcStr = '';
	let reg = '';
	for (let i = 0; i < op.length; ++i) {
		switch (op[i]) {
		case '^':	/* power */
			last = op[i - 1];	/* last operand */
			last += '$';
			reg = new RegExp(last);
			funcStr = funcStr.replace(reg, '');
			funcStr += ('Math.pow(' + op[i - 1] + ', ' + op[++i] + ')');
			break;
		case 'ln':	/* ln */
			funcStr += 'Math.log';
			break;
		case 'lg':	/* log10 */
		case 'log10':
			funcStr += 'Math.log10';
			break;
		case 'log2':	/* log2 */
			funcStr += 'Math.log2';
			break;
		case 'sin':	/* sin */
			funcStr += 'Math.sin';
			break;
		case 'cos':	/* cos */
			funcStr += 'Math.cos';
			break;
		case 'sqrt':	/* square root */
			funcStr += 'Math.sqrt';
			break;
		default:
			funcStr += op[i];
			break;
		}
	}
	return funcStr;
}

/* create function from string */
function str2Func(s) {
	str = 'return (' + s + ')';
	return Function('x', str);
}
