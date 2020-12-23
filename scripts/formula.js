/* available operators and basic functions */
var avail = ['', 'x', '+', '-', '*', '/', 'pow', '(', ')', ',', 'sqrt',
	'log2', 'log_2', 'ln', 'lg', 'log10', 'log_10', 'sin', 'cos'];

/* get input infomation by name */
function getInput(name) {
	return document.getElementsByName(name)[0].children[0];
}

function preprocessStr(s) {
	let blank = new RegExp('[ \\\\]', 'g');
	let tmp = s.split(blank);
	s = '';
	for (let i = 0; i < tmp.length; ++i) {
		if (tmp[i] != ' ')
			s += tmp[i];
	}
	let mutiply = new RegExp('(cdot)');
	tmp = s.split(mutiply);
	s = '';
	for (let i = 0; i < tmp.length; ++i) {
		if (tmp[i] == 'cdot') {
			s += '*';
			continue;
		}
		if (tmp[i] != ' ')
			s += tmp[i];
	}
	return s;
}

/* check if the function expression is available, @s is a string array */
function check(s) {
	for (let i = 0; i < s.length; ++i) {
		offset = avail.indexOf(s[i]);
		if (offset == -1 && isNaN(s[i])) {
			return false
		}
	}
	return true;
}

/* convert input text to function string, return a string */
function input2FuncStr(f) {
	f = latex_to_js(f);
	f = preprocessStr(f);	/* preprocess the string */
	let operator = new RegExp('([\-\+\*\/\^\(\)\,x])', 'g');
	let op = f.split(operator);	/* get operands and operators */
	if (!check(op)) {
		alert('Error: the function expression is wrong.');
		return;
	}
	let funcStr = '';
	for (let i = 0; i < op.length; ++i) {
		switch (op[i]) {
		case 'cdot':    /* mutiply */
			funcStr += '*';
			break;
		case 'pow':	/* power */
			funcStr += 'Math.pow';
			while (op[++i] != ')')
				funcStr += op[i];
			--i;
			break;
		case 'ln':	/* ln */
			funcStr += 'Math.log';
			break;
		case 'lg':	/* log10 */
		case 'log10':
		case 'log_10':
			funcStr += 'Math.log10';
			break;
		case 'log2':	/* log2 */
		case 'log_2':
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
