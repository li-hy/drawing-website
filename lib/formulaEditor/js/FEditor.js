var loseFocus = function () { //使页面失去焦点
    //移除所有含有的"mq-cursor mq-blink"的标签元素
    $("span").remove(".mq-cursor");
    $("span").remove(".mq-blink");
    mathField.blur();
}

function saveAsPicture(callback) {   //另存为图片
    loseFocus();
    var element = document.querySelector(".mq-root-block");
    // var width = element.offsetWidth; //dom宽
    // var height = element.offsetHeight; //dom高

    var myHeight = "30px";
    var subCollection = element.getElementsByClassName("mq-sub1");
    var supCollection = element.getElementsByClassName("mq-sup");
    if (subCollection.length != 0) { //有下标
        myHeight = "30px";
    }
    if (supCollection.length != 0) { //有上标
        myHeight = "40px";
    }
    if (subCollection.length == 0 && supCollection.length == 0) { //既没有上标也没有下标
        myHeight = "22px";
    }

    var height = element.offsetHeight; //dom高
    var scale = 2;//放大倍数
    $(".mq-root-block").css("width", "auto"); //设置公式显示区域宽度自适应
    html2canvas(element, {
        dpi: window.devicePixelRatio * 2,
        scale: scale,
        height: height
    }).then(function (canvas) {
        //先把公式的html保存为canvas，然后将canvas保存为base64格式的文件，并输入到tinymce网页文本框中
        var image = canvas.toDataURL("image/png");
        /*var imageHTML = "<img height='30px' src='" + image + "'data-latex='" + mathField.latex() + "' style='vertical-align: middle'/>";*/
        if (myHeight == "30px" || myHeight == "40px") {
            var imageHTML = "<img height='" + myHeight + "' src='" + image + "'data-latex='" + mathField.latex() + "' style='vertical-align: middle'/>";
        } else {
            var imageHTML = "<img height='" + myHeight + "' src='" + image + "'data-latex='" + mathField.latex() + "' style='vertical-align: -6px'/>";
        }
        callback(imageHTML);
    });
}

var removeBlock = function () {
    var subArea = document.querySelectorAll(".button-area ul li.subtype1 div.sub-area");
    for (var i = 0; i < subArea.length; i++) {
        if (subArea[i].style.display = "block") {
            subArea[i].style.display = "none";
        }
    }
}
/******************************************按钮区******************************************* */

/*0 nice*/
function ysFormula1() {
    mathField.write("x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}");
    mathField.focus();
    document.getElementById("ysFormula1").parentNode.parentNode.style.display = "none";
}

function ysFormula2() {
    mathField.write("(x+a)^2=\\sum_{k=0}^{n}\\binom{n}{k}x^ka^{n-k}");
    mathField.focus();
    document.getElementById("ysFormula2").parentNode.parentNode.style.display = "none";
}

function ysFormula3() {
    mathField.write("a^2+b^2=c^2");
    mathField.focus();
    document.getElementById("ysFormula3").parentNode.parentNode.style.display = "none";
}

function ysFormula4() {
    mathField.write("f(x)=a_0+\\sum_{n=1}^{\\infty }\\left(a_n\\cos \\frac{(n\\pi x)}{L}+b_n\\sin \\frac{(n\\pi x)}{L}\\right)");
    mathField.focus();
    document.getElementById("ysFormula4").parentNode.parentNode.style.display = "none";
}

function ysFormula5() {
    mathField.write("\\left(1+x\\right)^n=1+\\frac{nx}{1!}+\\frac{n\\left(n-1\\right)x^2}{2!}+\\cdots");
    mathField.focus();
    document.getElementById("ysFormula5").parentNode.parentNode.style.display = "none";
}


/*3*/
function button0301() {
    mathField.focus();
}

function button0302() {
    mathField.write("\\prime");
    mathField.focus();
    removeBlock();
}

function button0303() {
    mathField.write("\\pprim");
    mathField.focus();
    removeBlock();
}

function button0304() {
    mathField.write("\\prime");
    mathField.write("\\pprim");
    mathField.focus();
    removeBlock();
} /*求三次导*/
function button0305() {
    mathField.write("\\xprim");
    mathField.focus();
    removeBlock();
}

function button0306() {
}

function button0307() {
}

function button0308() {
}

function button0309() {
}

function button0310() {
}

function button0311() {
    mathField.write("\\onepoint");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0312() {
    mathField.write("\\twopoint");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0313() {
    mathField.write("\\threepoint");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0314() {
    mathField.write("\\fourpoint");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0315() {
} /*blank*/
function button0316() {
    mathField.write("\\pointone");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0317() {
    mathField.write("\\pointtwo");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0318() {
    mathField.write("\\pointthree");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0319() {
    mathField.write("\\pointfour");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0320() {
} /*blank*/
function button0321() {
    mathField.write("\\threetwoone");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0322() {
    mathField.write("\\threetwotwo");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}
function button0323() {
    mathField.write("\\threetwothree");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0324() {
    mathField.write("\\threetwofour");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0325() {
    mathField.write("\\threetwofive");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0326() {
    mathField.write("\\threetwoonedown");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0327() {
    mathField.write("\\threetwotwodown");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0328() {
    mathField.write("\\threetwothreedown");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0329() {
    mathField.write("\\threetwofourdown");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0330() {
} /*blank*/
function button0331() {
    mathField.write("\\threethreeone");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}/*later*/
function button0332() {
    mathField.write("\\threethreetwo");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}/*later*/
function button0333() {
    mathField.write("\\threethreethree");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0334() {
    mathField.write("\\threethreefour");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0335() {
    mathField.write("\\threethreefive");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button0336() {
    mathField.write("\\threethreesix");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}/*later*/
function button0337() {
    mathField.write("\\threethreeseven");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}/*later*/
function button0338() {
    mathField.write("\\threethreeeight");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0339() {
    mathField.write("\\threethreenine");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button0340() {
    mathField.write("\\threefourzero");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}


/*9 nice*/
function button0901() {
    mathField.write("\\alpha");
    mathField.focus();
    removeBlock();
}

function button0902() {
    mathField.write("\\beta");
    mathField.focus();
    removeBlock();
}

function button0903() {
    mathField.write("\\chi");
    mathField.focus();
    removeBlock();
}

function button0904() {
    mathField.write("\\delta");
    mathField.focus();
    removeBlock();
}

function button0905() {
    mathField.write("\\varepsilon");
    mathField.focus();
    removeBlock();
}

function button0906() {
    mathField.write("\\phi");
    mathField.focus();
    removeBlock();
}

function button0907() {
    mathField.write("\\varphi");
    mathField.focus();
    removeBlock();
}

function button0908() {
    mathField.write("\\gamma");
    mathField.focus();
    removeBlock();
}

function button0909() {
    mathField.write("\\eta");
    mathField.focus();
    removeBlock();
}

function button0910() {
    mathField.write("\\iota");
    mathField.focus();
    removeBlock();
}

function button0911() {
    mathField.write("\\kappa");
    mathField.focus();
    removeBlock();
}

function button0912() {
    mathField.write("\\lambda");
    mathField.focus();
    removeBlock();
}

function button0913() {
    mathField.write("\\mu");
    mathField.focus();
    removeBlock();
}

function button0914() {
    mathField.write("\\nu");
    mathField.focus();
    removeBlock();
}

function button0915() {
    mathField.write("\o");
    mathField.focus();
    removeBlock();
}

function button0916() {
    mathField.write("\\pi");
    mathField.focus();
    removeBlock();
}

function button0917() {
    mathField.write("\\varpi");
    mathField.focus();
    removeBlock();
}

function button0918() {
    mathField.write("\\theta");
    mathField.focus();
    removeBlock();
}

function button0919() {
    mathField.write("\\vartheta");
    mathField.focus();
    removeBlock();
}

function button0920() {
    mathField.write("\\rho");
    mathField.focus();
    removeBlock();
}

function button0921() {
    mathField.write("\\sigma");
    mathField.focus();
    removeBlock();
}

function button0922() {
    mathField.write("\\varsigma");
    mathField.focus();
    removeBlock();
}

function button0923() {
    mathField.write("\\tau");
    mathField.focus();
    removeBlock();
}

function button0924() {
    mathField.write("\\upsilon");
    mathField.focus();
    removeBlock();
}

function button0925() {
    mathField.write("\\omega");
    mathField.focus();
    removeBlock();
}

function button0926() {
    mathField.write("\\xi");
    mathField.focus();
    removeBlock();
}

function button0927() {
    mathField.write("\\psi");
    mathField.focus();
    removeBlock();
}

function button0928() {
    mathField.write("\\zeta");
    mathField.focus();
    removeBlock();
}

/*10 nice*/
function button1001() {
    mathField.write("\\mathrm{A}");
    mathField.focus();
    removeBlock();
}

function button1002() {
    mathField.write("\\mathrm{B}");
    mathField.focus();
    removeBlock();
}

function button1003() {
    mathField.write("\\mathrm{X}");
    mathField.focus();
    removeBlock();
}

function button1004() {
    mathField.write("\\Delta");
    mathField.focus();
    removeBlock();
}

function button1005() {
    mathField.write("\\mathrm{E}");
    mathField.focus();
    removeBlock();
}

function button1006() {
    mathField.write("\\Phi");
    mathField.focus();
    removeBlock();
}

function button1007() {
    mathField.write("\\Gamma");
    mathField.focus();
    removeBlock();
}

function button1008() {
    mathField.write("\\mathrm{H}");
    mathField.focus();
    removeBlock();
}

function button1009() {
    mathField.write("\\mathrm{I}");
    mathField.focus();
    removeBlock();
}

function button1010() {
    mathField.write("\\mathrm{K}");
    mathField.focus();
    removeBlock();
}

function button1011() {
    mathField.write("\\Lambda");
    mathField.focus();
    removeBlock();
}

function button1012() {
    mathField.write("\\mathrm{M}");
    mathField.focus();
    removeBlock();
}

function button1013() {
    mathField.write("\\mathrm{N}");
    mathField.focus();
    removeBlock();
}

function button1014() {
    mathField.write("\\mathrm{O}");
    mathField.focus();
    removeBlock();
}

function button1015() {
    mathField.write("\\Pi");
    mathField.focus();
    removeBlock();
}

function button1016() {
    mathField.write("\\Theta");
    mathField.focus();
    removeBlock();
}

function button1017() {
    mathField.write("\\mathrm{P}");
    mathField.focus();
    removeBlock();
}

function button1018() {
    mathField.write("\\Sigma");
    mathField.focus();
    removeBlock();
}

function button1019() {
    mathField.write("\\mathrm{T}");
    mathField.focus();
    removeBlock();
}

function button1020() {
    mathField.write("\\Upsilon");
    mathField.focus();
    removeBlock();
}

function button1021() {
    mathField.write("\\Omega");
    mathField.focus();
    removeBlock();
}

function button1022() {
    mathField.write("\\Xi");
    mathField.focus();
    removeBlock();
}

function button1023() {
    mathField.write("\\Psi");
    mathField.focus();
    removeBlock();
}

function button1024() {
    mathField.write("\\mathrm{Z}");
    mathField.focus();
    removeBlock();
}

/*12 nice*/
function button1201() {
    mathField.write("\\frac{}{}");
    mathField.keystroke('Left');
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1202() {
    mathField.write("\\fracc");
    mathField.keystroke('Left');
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1203() {
    mathField.write("\\fraccc_{}^{}");
    mathField.keystroke('Left');
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1204() {
    mathField.write("\\solidusss_{}^{}");
    mathField.keystroke('Left');
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1205() {
    mathField.write("\\solidus_{}^{}");
    mathField.keystroke('Left');
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1206() {
}

function button1207() {
    mathField.write("\\sqrt{}");
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1208() {
    mathField.write("\\sqrt[]{}");
    mathField.keystroke('Left');
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1209() {
    mathField.write("\\longdiv");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button1210() {
    mathField.write("\\longdivtwo");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

/*13*/
function button1301() {
    mathField.write("\\^{}");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1302() {
    mathField.write("\\_{}");
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1303() {
    mathField.write("\\_{}^{}");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}/*later*/

/*added at 2020-06-23 16:51*/
function button1304() {
    mathField.write("\\^{}");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1305() {
    mathField.write("\\_{}");
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1306() {
    mathField.write("\\_{}^{}");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

/*added at 2020-06-23 16:51*/
function button1307() {
    mathField.write("\\thirteenseven");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button1308() {
    mathField.write("\\thirteeneight");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1309() {
    mathField.write("\\thirteenseven_{\\thirteeneight_{ }^{ }}^{ }");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1310() {
    mathField.write("\\^{}");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1311() {
    mathField.write("\\_{}");
    mathField.keystroke('Left');
    mathField.focus();
    removeBlock();
}

function button1312() {
    mathField.write("\\_{}^{}");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button1313() {
    mathField.write("\\thirteenseven");
    mathField.keystroke('Down');
    mathField.focus();
    removeBlock();
}

function button1314() {
    mathField.write("\\thirteeneight");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

function button1315() {
    mathField.write("\\thirteenseven_{\\thirteeneight_{ }^{ }}^{ }");
    mathField.keystroke('Up');
    mathField.focus();
    removeBlock();
}

/*21-28 nice*/
function button21() {
    mathField.write("\\pi");
    mathField.focus();
}

function button22() {
    mathField.write("\\theta");
    mathField.focus();
}

function button26() {
    mathField.write("\\partial");
    mathField.focus();
}

function button33() {
    mathField.write("\\frac{}{}");
    mathField.keystroke('Up');
    mathField.focus();
}

function button35() {
    mathField.write("\\sqrt{}");
    mathField.keystroke('Left');
    mathField.focus();
}

function button36() {
    mathField.write("\\^{}");
    mathField.keystroke('Up');
    mathField.focus();
}

function button37() {
    mathField.write("\\_{}");
    mathField.keystroke('Down');
    mathField.focus();
}

function button38() {
    mathField.write("\\_{}^{}");
    mathField.keystroke('Down');
    mathField.focus();
}
/*end*/
/******************************************按钮区******************************************* */

/* my code */
/*
 * get the LaTex expression of the formula
 * return the LaTex expression
 */
function getLatexExp() {
	let txt = mathField.latex();
	return txt;
}
