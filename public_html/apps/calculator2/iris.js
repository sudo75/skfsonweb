console.log("js working");

//Start and Clear
document.getElementById("note").innerHTML = "";

let num,
num1 = "",
num2 = "",
dec1 = true, //works, don't touch
dec2 = true, //works, don't touch
ans = "",
operation = "",
operationDisplay = "",
booleanOperation = false,
display = "",
previousCalc = "",
error = false;

function fClear() {
    document.getElementById("note").innerHTML = "";
    num = "";
    num1 = "";
    num2 = "";
    dec1 = true;
    dec2 = true;
    ans = "";
    operation = "";
    booleanOperation = false;
    previousCalc = "";
    error = false;

//Display
    document.getElementById("num").innerHTML = "Enter a value"
    document.getElementById("display").innerHTML = ans
}

function clearForEquals() {
    document.getElementById("note").innerHTML = "";
    previousCalc = "";
    numbersDisplay();
    previousCalc = document.getElementById("num");
    num1 = ans;
    num2 = "";
    typeof(ans);
    dec1 = Number.isInteger(ans);
    console.log(dec1);
    dec2 = true;
    operation = "";
    booleanOperation = false;
}

//Display Numbers

function numbersDisplay() {
    if(error) {
        return;
    }
    display = num1 + operation + num2;
    document.getElementById("num").innerHTML = display;
}

function numbers() {
//Error Handling
if(error) {
    return;
}
//Print Numbers
    if (booleanOperation) {
        num2 += num;
    }else{
        num1 += num;
    }

//Display Numbers
    numbersDisplay();
}


//Buttons

function fNegative() {
    if(error) {
        return;
    }
    if (booleanOperation) {
        if(num2 == 0) {
            return;
        }
        num2 *= -1
        num2 = num2.toString();
        numbersDisplay();
    } else {
        if(num1 == 0) {
            return;
        }
        num1 *= -1
        num1 = num1.toString();
        numbersDisplay();
    }
}

function fDivide() {
    if (booleanOperation) {
        fEquals();
        operation = "/"
        booleanOperation = true;
        numbersDisplay();
    } else {
        operation = "/"
        booleanOperation = true;
        numbersDisplay();
    }
}

function fMultiply() {
    if (booleanOperation) {
        fEquals();
        operation = "*"
        booleanOperation = true;
        numbersDisplay();
    } else {
        operation = "*"
        booleanOperation = true;
        numbersDisplay();
    }
}

function fAdd() {
    if (booleanOperation) {
        fEquals();
        operation = "+"
        booleanOperation = true;
        numbersDisplay();
    } else {
        operation = "+"
        booleanOperation = true;
        numbersDisplay();
    }
}

function fSubtract() {
    if (booleanOperation) {
        fEquals();
        operation = "-"
        booleanOperation = true;
        numbersDisplay();
    } else {
        operation = "-"
        booleanOperation = true;
        numbersDisplay();
    }
}

function fExponent() {
    if (booleanOperation) {
        fEquals();
        operation = "^"
        booleanOperation = true;
        numbersDisplay();
    } else {
        operation = "^"
        booleanOperation = true;
        numbersDisplay();
    }
}

function fRoot() {
    if (booleanOperation) {
        fEquals();
        operation = "√"
        booleanOperation = true;
        numbersDisplay();
        num2 = 2;
            //Error Handling For Negatives
            if (operation == "√" && num1 < 0) {
                ans = "Math Error"
                error = true;
                document.getElementById("display").innerHTML = ans
                return;
            }
    fEquals();
    } else {
        operation = "√"
        booleanOperation = true;
        numbersDisplay();
        num2 = 2;
            //Error Handling For Negatives
            if (operation == "√" && num1 < 0) {
                ans = "Math Error"
                error = true;
                document.getElementById("display").innerHTML = ans
                return;
            }
    fEquals();
    }
}


function f7() {
    num = "7"
    numbers();
}

function f8() {
    num = "8"
    numbers();
}

function f9() {
    num = "9"
    numbers();
}

function f4() {
    num = "4"
    numbers();
}

function f5() {
    num = "5"
    numbers();
}

function f6() {
    num = "6"
    numbers();
}

function f1() {
    num = "1"
    numbers();
}

function f2() {
    num = "2"
    numbers();
}

function f3() {
    num = "3"
    numbers();
}

function f0() {
    num = "0"
    numbers();
}

document.addEventListener("keydown", keyHandle);

function keyHandle() {
    const key = event.key;
    if (key == 0) {
        f0();
    }
    if (key == 1) {
        f1();
    }
    if (key == 2) {
        f2();
    }
    if (key == 3) {
        f3();
    }
    if (key == 4) {
        f4();
    }
    if (key == 5) {
        f5();
    }
    if (key == 6) {
        f6();
    }
    if (key == 7) {
        f7();
    }
    if (key == 8) {
        f8();
    }
    if (key == 9) {
        f9();
    }
    if (key == ".") {
        fDecimal();
    }
    if (key == "+") {
        fAdd();
    }
    if (key == "-") {
        fSubtract();
    }
    if (key == "*") {
        fMultiply();
    }
    if (key == "/") {
        fDivide();
    }
    if (key == "^") {
        fExponent();
    }
    if (key == "c") {
        fClear();
    }
    if (key == "Enter") {
        fEquals();
    }
}

function fDecimal() {

    if(operation) {
        if(!dec2) {
                return;
        }
        dec2 = false;
    }else {
            if(!dec1) {
                return;
            }
            dec1 = false
        }
    
    //Display
    num = "."
    numbers();
}

function fEquals() {

    //Ensure all values are present
    if (num1 == "") {
        return;    
    } else {
        num1 = Number(num1);
    }

    if (num2 == "") {
        return;
    } else {
        num2 = Number(num2);    
    }

    //Error Handling
    if(error) {
        return;
    }

    if (num2 == 0&& operation == "/") {
        ans = "Math Error"
        error = true;
        document.getElementById("display").innerHTML = ans
        return;
    }

    //Calculate
    
    calculate();

    //Rounding
    ans = ans.toFixed(12);
    ans = parseFloat(ans).toString();
    console.log(typeof ans);

    //Reset
    clearForEquals();

    //Display
    ans = ans.toLocaleString("en-US");
    console.log(typeof ans);
    document.getElementById("display").innerHTML = ans;
}

//Calculate

function calculate() {

    if (operation == "+") {
        ans = num1 + num2
    }
    if (operation == "-") {
        ans = num1 - num2
    }
    if (operation == "*") {
        ans = num1 * num2
    }
    if (operation == "/") {
        ans = num1 / num2
    }
    if (operation == "^") {
        ans = num1 ** num2
    }
    if (operation == "√") {
        ans = num1 ** (1/num2)
    }
}