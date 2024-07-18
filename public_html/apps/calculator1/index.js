const version = "1.2.0";

let num1 = 0;
let num2 = 0;
let num;
let placeValue = 0;
let ans = 0;
let ansR = 0;
let ansMag = 0;
let ansMagR = 0;
let fig1 = 0;
let fig2 = 0;
let equals = false;
let consecEqualsOperation = null;
let equalsCount = 0;
let Equals = 3;
let neg = false;
let negAllow1 = true;
let negAllow2 = true;
let error = false;
let lengthNum1 = 0;
let lengthNum2 = 0;

let firstNeg1 = false;
let firstNeg2 = false;

//decimal

let decMag = 1;
let dec = false;
let decCounter = 0;

let divide = false;
let multiply = false;
let subtract = false;
let add = false;
let root = false;
let exponent = false;
let num1R = 0;
let num2R = 0;
let remainder = 0;
let dec1 = false;
let dec2 = false;

let operationPerformed = false;
let operationNumber = 0;

function reset() {
    num1 = 0;
    num2 = 0;
    placeValue = 0;
    ans = 0;
    ansR = 0;
    ansMag = 0;
    ansMagR = 0;
    fig1 = 0;
    fig2 = 0;
    equals = false;
    consecEqualsOperation = null;
    equalsCount = 0;
    neg = false;
    negAllow1 = true;
    negAllow2 = true;
    error = false;
    lengthNum1 = 0;
    lengthNum2 = 0;
    
    operationPerformed = false;
    operationNumber = 0;

    firstNeg1 = false;
    firstNeg2 = false;

    //decimal
    
    decMag = 1;
    dec = false;
    decCounter = 0;
    
    divide = false;
    multiply = false;
    subtract = false;
    add = false;
    root = false;
    exponent = false;
    num1R = 0;
    num2R = 0;
    remainder = 0;
    dec1 = false;
    dec2 = false;
}

//negative

function fNegative() {
    if (operationPerformed == true && num2 == 0) {
        if (firstNeg2 == false) {
            firstNeg2 == true;
            document.getElementById("currentNum").innerHTML = "-";
        }
    } else {
        if (firstNeg1 == false && num1 == 0) {
            firstNeg1 == true;
            document.getElementById("previousNum").innerHTML = "-";
        }
    }
    neg = true;
}

function resetForEquals() {
    placeValue = 0;
    fig1 = 0;
    fig2 = 0;
    equals = false;
    neg = false;
    negAllow1 = true;
    negAllow2 = true;
    
    operationNumber = 0;
    operationPerformed = false;
    
    //decimal
    
    decMag = 1;
    dec = false;
    decCounter = 0;
    
    num1R = 0;
    num2R = 0;
    fig1 = 0;
    fig2 = 0;
    remainder = 0;
    dec1 = false;
    dec2 = false;
}
//Do math

function numbers() {
    if (error) {
        return;
    }
    if (operationPerformed) {
        lengthNum2 += 1;
    } else {
        lengthNum1 += 1;
    }

    if (operationPerformed && lengthNum2 > 11) {
        document.getElementById("note").innerHTML = "You have reached the character limit: num2"
        return;
    } else {
        if (!operationPerformed && lengthNum1 > 11) {
            document.getElementById("note").innerHTML = "You have reached the character limit: num1"
            return;
        }
    }

    if (dec) {

        if (operationPerformed || equalsCount >= 1) {
            
            if (decCounter >= 8) {
            document.getElementById("note").innerHTML = "You have reached the character limit"
            } else {
                if (neg && negAllow2) {
                    fig2 += 1
                    num2 = num2 - num * (10 ** decMag)
                    num2R = num2.toFixed(fig2);
                } else {
                    negAllow2 = false;
                    fig2 += 1
                    num2 = num2 + num * (10 ** decMag)
                    num2R = num2.toFixed(fig2);
                }
            

            document.getElementById("currentNum").innerHTML = num2R
            }

        } else {

            if (decCounter >= 8) {
            document.getElementById("note").innerHTML = "You have reached the decimal limit"
            } else {
                if (neg && negAllow1) {
                    fig1 += 1
                    num1 = num1 - num * (10 ** decMag)
                    num1R = num1.toFixed(fig1);
                } else {
                    negAllow1 = false;
                    fig1 += 1
                    num1 = num1 + num * (10 ** decMag)
                    num1R = num1.toFixed(fig1);
                }
            document.getElementById("previousNum").innerHTML = num1R
            }
        }

    } else {
        if (operationPerformed || equalsCount >= 1) {
            if (neg && negAllow2) {
                num2 = num2 * 10 - num
            } else {
                negAllow2 = false;
                num2 = num2 * 10 + num
            }
            document.getElementById("currentNum").innerHTML = num2
            
        } else {
            if (neg && negAllow1) {
                num1 = num1 * 10 - num
            } else {
                negAllow1 = false;
                num1 = num1 * 10 + num
            }
            document.getElementById("previousNum").innerHTML = num1    

        }
    }
}


function fOperation() {
    if (operationPerformed) {
        error = true;
        ansR = "error: multiple operations"
        document.getElementById("display").innerHTML = ansR
        return;
    }
    equalsCount = 0;
    operationPerformed = true;
    dec = false;
    decCounter = 0;
    neg = false;
    document.getElementById("note").innerHTML = ""
}


function choseOperation() {
    if (error) {
        return;
    }
    
    if (divide) {
        ans = num1 / num2
    }
    if (multiply) {
        ans = num1 * num2
    }
    if (subtract) {
        ans = +num1 - +num2
    }
    if (add) {
        ans = +num1 + +num2
    }
    if (root) {
        ans = num1 ** (1 / num2)
    }
    if (exponent) {
        ans = num1 ** num2
    }
}

function fDivide() {
    if (error) {
        return;
    }
    divide = true
    document.getElementById("operate").innerHTML = "/"
}

function fMultiply() {
    if (error) {
        return;
    }
    multiply = true
    document.getElementById("operate").innerHTML = "*"
}

function fSubtract() {
    if (error) {
        return;
    }
    subtract = true
    document.getElementById("operate").innerHTML = "-"
}

function fAdd() {
    if (error) {
        return;
    }
    add = true
    document.getElementById("operate").innerHTML = "+"
}

function fExponent() {
    if (error) {
        return;
    }
    exponent = true
    document.getElementById("operate").innerHTML = "^"
}

function fRoot() {
    if (error) {
        return;
    }
    root = true
    document.getElementById("operate").innerHTML = "√"
}

//Buttons

function f7() {
    num = 7
    numbers();
    choseOperation();
    }

function f8() {
    num = 8
    numbers();
    choseOperation();
    }

function f9() {
    num = 9
    numbers();
    choseOperation();
    }

function f4() {
    num = 4
    numbers();
    choseOperation();
    }

function f5() {
    num = 5
    numbers();
    choseOperation();
}

function f6() {
    num = 6
    numbers();
    choseOperation();
    }

function f1() {
    num = 1
    numbers();
    choseOperation();
    }

function f2() {
    num = 2
    numbers();
    choseOperation();
    }

function f3() {
    num = 3
    numbers();
    choseOperation();
    }

function f0() {
    num = 0
    numbers();
    choseOperation();
    }

function fEquals() {

    //Checking for Errors

    if (error) {
        return;
    }

    if (root) {
        if (num2 == 0) {
            ansR = "error: 0th root"
            document.getElementById("display").innerHTML = ansR
            error = true;
            return;
        }
        remainder = num2/2
        if (remainder != 0 && num1 < 0) {
            ansR = "error: even root of negative"
            document.getElementById("display").innerHTML = ansR
            error = true;
            return;
        }
    }

    if (num2 == 0&& divide) {
        ansR = "error: divide by zero"
        document.getElementById("display").innerHTML = ansR
        error = true;
        return;      
    }
    
    //Equals

    if (operationPerformed == false) {
        ansR = "error: no operation"
        document.getElementById("display").innerHTML = ansR
        error = true;
        return;  
    }
    ansR = +ans.toFixed(8);
    ansMag = 0;
    ansMag = Math.log10(ansR);
    ansMagR = Math.ceil(ansMag);
    if (ansMagR > 12) {
        ansR = "error: number exceeds 10^12"   
        document.getElementById("display").innerHTML = ansR    
        return; 
    } else {
        document.getElementById("display").innerHTML = ansR
    }
    equalsCount += 1;

    lengthNum1 = ans.toString().length
    ans = Number(ans);
    lengthNum2 = 0;
    resetForEquals();
    divide = false;
    multiply = false;
    subtract = false;
    add = false;
    root = false;
    exponent = false;
    num2 = 0;
    document.getElementById("currentNum").innerHTML = "Enter a value"
    document.getElementById("operate").innerHTML = "Select an operator or "
    num1 = ansR;
    document.getElementById("previousNum").innerHTML = num1
    document.getElementById("note").innerHTML = ""
} 

function fClear() {
    reset();
    document.getElementById("display").innerHTML = "Answer"
    document.getElementById("previousNum").innerHTML = "Enter a value"
    document.getElementById("operate").innerHTML = "Select an operator"
    document.getElementById("currentNum").innerHTML = "Enter a value"
    document.getElementById("note").innerHTML = ""
}

function fDecimal() {
    if (dec) {
        if (operationPerformed) {
            return;
        } else {
            return;
        }
    }
    decMag = -1;
    dec = true

    if (operationPerformed == true) {
        document.getElementById("currentNum").innerHTML = "0.";
    } else {
        document.getElementById("previousNum").innerHTML = "0.";
    }
}

function fNum() {
    if (dec) {
        decMag = decMag - 1;
        decCounter += 1;
    } else {
        decMag = 0;
    }
}