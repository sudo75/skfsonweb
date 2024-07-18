let formula = "";
let ans = ""; //Displays ans
const placeholder = "‎";
let setting = "deg";
document.getElementById("setting").innerHTML = "Setting: Deg"

let currentRoot = 2;
let characterNum = []; //Allows deletion of whole unit, not just one character
let inverse = false;

function character(num) {
    characterNum.push(num);
}

function formulaDisplay() {
    console.log(formula);
    document.getElementById("formula").innerHTML = placeholder + ans + formula;
}

{//Buttons
{//numbers

    function f7() {
        formula += "7"
        formulaDisplay();
    }
    
    function f8() {
        formula += "8"
        formulaDisplay();
    }
    
    function f9() {
        formula += "9"
        formulaDisplay();
    }
    
    function f4() {
        formula += "4"
        formulaDisplay();
    }
    
    function f5() {
        formula += "5"
        formulaDisplay();
    }
    
    function f6() {
        formula += "6"
        formulaDisplay();
    }
    
    function f1() {
        formula += "1"
        formulaDisplay();
    }
    
    function f2() {
        formula += "2"
        formulaDisplay();
    }
    
    function f3() {
        formula += "3"
        formulaDisplay();
    }
    
    function f0() {
        formula += "0"
        formulaDisplay();
    }
}

{//Mathematical Constants

    function fPi() {
        formula += "(π)";
        formulaDisplay();
    }
    function fe() {
        formula += "(e)";
        formulaDisplay();
    }
}

{//Simple operations

function fSquareRoot() {
    formula += " Root = (2)"
    formulaDisplay();
}

function fSquare() {
    formula += " ^ 2 "
    formulaDisplay();
}

function fCube() {
    formula += " ^ 3 "
    formulaDisplay();
}

function fCubeRoot() {
    formula += " Root = (3)"
    formulaDisplay();
}

function fDivide() {
    formula += " / "
    formulaDisplay();
}

function fMultiply() {
    formula += " * "
    formulaDisplay();
}

function fAdd() {
    formula += " + "
    formulaDisplay();
}

function fSubtract() {
    formula += " - "
    formulaDisplay();
}
}

{//Complex Opperations

function fRoot() {
    formula += " Root = (";
    formulaDisplay();
}

function fExponent() {
    formula += " ^ "
    formulaDisplay();
}

function fFactorial() {
    formula += " factorial("
    formulaDisplay();
}

function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function fLog() {
    formula += " log10("
    formulaDisplay();
}

function fNatLog() {
    formula += " natLog("
    formulaDisplay();
}

}

{//Trigonometric Functions

    function fInverse() {
        if (inverse == false) {
            document.getElementById("sin").innerHTML = "Sin^-1";
            document.getElementById("cos").innerHTML = "Cos^-1";
            document.getElementById("tan").innerHTML = "Tan^-1";
            inverse = true;
        } else {
            document.getElementById("sin").innerHTML = "Sin";
            document.getElementById("cos").innerHTML = "Cos";
            document.getElementById("tan").innerHTML = "Tan";
            inverse = false;
        }
    }

    function fSetting() {
        if (setting == "rad") {
            setting = "deg";
            document.getElementById("setting").innerHTML = "Setting: Deg";
        } else {
            setting = "rad"
            document.getElementById("setting").innerHTML = "Setting: Rad";
        }
    }

    function fSin() {
        if (inverse) {
            character(11);
            if (setting === "rad") {
                formula += " sinRadInv(";
            } else if (setting === "deg") {
                formula += " sinDegInv(";
            }
        } else {
            character(8);
            if (setting === "rad") {
                formula += " sinRad(";
            } else if (setting === "deg") {
                formula += " sinDeg(";
            }
        }
            
        formulaDisplay();
    }
    
    function fCos() {
        if (inverse) {
            character(11);
            if (setting === "rad") {
                formula += " cosRadInv(";
            } else if (setting === "deg") {
                formula += " cosDegInv(";
            }
        } else {
            character(8);
            if (setting === "rad") {
                formula += " cosRad(";
            } else if (setting === "deg") {
                formula += " cosDeg(";
            }
        }
        formulaDisplay();
    }
    
    function fTan() {
        if (inverse) {
            character(11);
            if (setting === "rad") {
                formula += " tanRadInv(";
            } else if (setting === "deg") {
                formula += " tanDegInv(";
            }
        } else {
            character(8);
            if (setting === "rad") {
                formula += " tanRad(";
            } else if (setting === "deg") {
                formula += " tanDeg(";
            }
        }
        formulaDisplay();
    }

    function toDegrees(radians) {
        return radians * (180 / Math.PI)
    }

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

}

{//Misc Buttons
    function fDel() {
        formula = formula.slice(0, -characterNum[characterNum.length - 1]);
        characterNum.pop();
        formulaDisplay();
    }

    function fClear() {
        formula = "";
        document.getElementById("note").innerHTML = "";
        document.getElementById("formula").innerHTML = placeholder;
        ans = "";
        document.getElementById("display").innerHTML = placeholder;
    }

    function fDecimal() {
        formula += ".";
        formulaDisplay();
    }
    
    function fOpenBracket() {
        formula += "("
        formulaDisplay();
    }
    
    function fClosedBracket() {
        formula += ")"
        formulaDisplay();
    }
    
}

function fEquals() {

    if (formula == "") {
        return;
    }

    //Preparation
    operation = false;
    equalOneOrMore = true;

    //Translate Formula
    formula = ans + formula;
    {//Translate for Trig Functions
        formula = formula.replace(/sinDeg\(/g, "Math.sin((Math.PI / 180) * ");
        formula = formula.replace(/cosDeg\(/g, "Math.cos((Math.PI / 180) * ");
        formula = formula.replace(/tanDeg\(/g, "Math.tan((Math.PI / 180) * ");
        formula = formula.replace(/sinRad\(/g, "Math.sin(");
        formula = formula.replace(/cosRad\(/g, "Math.cos(");
        formula = formula.replace(/tanRad\(/g, "Math.tan(");
        //Inverse
        formula = formula.replace(/sinDegInv\(/g, "(180 / Math.PI) * Math.asin(");
        formula = formula.replace(/cosDegInv\(/g, "(180 / Math.PI) * Math.atan(");
        formula = formula.replace(/tanDegInv\(/g, "(180 / Math.PI) * Math.atan(");
        formula = formula.replace(/sinRadInv/g, "Math.asin");
        formula = formula.replace(/cosRadInv/g, "Math.acos");
        formula = formula.replace(/tanRadInv/g, "Math.atan");
    }
    formula = formula.replace(/log10/g, "Math.log10");
    formula = formula.replace(/natLog/g, "Math.log");
    formula = formula.replace(/\^/g, "**");
    formula = formula.replace(/Root = \(2\)/g, " ** (1/2)")
    formula = formula.replace(/Root = \(/g, " ** (1/");
    formula = formula.replace(/\)\(/g, ") * (");
    formula = formula.replace(/\(\s*e\s*\)\s*(\d+)/g, "$1 * Math.E");
    formula = formula.replace(/\(\s*π\s*\)\s*(\d+)/g, "$1 * Math.E");
    formula = formula.replace(/(\d+)\s*\(\s*e\s*\)/g, "$1 * Math.E");
    formula = formula.replace(/\(e\)/g, "Math.E");
    formula = formula.replace(/(\d+)\s*\(\s*π\s*\)/g, "$1 * Math.PI");
    formula = formula.replace(/π/g, "Math.PI");
    formula = formula.replace(/(\d+)\((\d+)\)/g, "$1 * $2");
    formula = formula.replace(/\((\d+)\)(\d+)/g, "$1 * $2");
    console.log(formula);
    
    //Calculate
    ans = eval(formula);
    ans = ans.toFixed(12);
    let ansMag = (Math.floor(Math.log10(ans)));
    console.log(ansMag);
    if (ansMag > 15 || ans == isNaN || ans == Infinity || ans == undefined) {
        fClear();
        document.getElementById("note").innerHTML = "Error";
        return;
    }
    ans = parseFloat(ans).toString();
    document.getElementById("display").innerHTML = ans;

    //Clear
    formula = "";
    //Display
    formulaDisplay();
}

}