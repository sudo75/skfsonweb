let occupied = ["t", "t", "t", "t", "t", "t", "t", "t", "t"],
vacant = 9,
turn = "x",
square,
varSetting = "Player";
computerDifficulty = "easy"
document.getElementById("setting").innerHTML = "Player vs. " + varSetting;

//Win and Score

let winX = false,
winO = false,
tie = false,
scoreX = 0,
scoreO = 0;
let gameNumber = 0;
let computerNewTurn = false;

//Computer move delay
let computerMoveDone = false;

function reset() {
    occupied = ["t", "t", "t", "t", "t", "t", "t", "t", "t"];
    if (vacant == 0) {
        gameNumber += 1;
    } else
    if (winX || winO || tie) {
        gameNumber += 1;
    }
    if (gameNumber % 2 == 0) {
        turn = "x"
    } else {
        turn = "o";
    }
    vacant = 9;
    winX = false;
    winO = false;
    tie = false;
    document.getElementById("turn").innerHTML = "Turn: " + turn;
    document.getElementById("result").innerHTML = "Result";

    for (let i = 1; i <= 9; i++) {
        document.getElementById(i.toString()).innerHTML = "‎";
    }

    if (turn == "o" && varSetting == "Computer") {
        computerNewTurn = true;
        logic();
    }
}

function resetAll() {
    //reset
    gameNumber = 0;
    occupied = ["t", "t", "t", "t", "t", "t", "t", "t", "t"];
    vacant = 9;
    turn = "x"
    winX = false;
    winO = false;
    tie = false;
    document.getElementById("turn").innerHTML = "Turn: " + turn;
    document.getElementById("result").innerHTML = "Result";

    for (let i = 1; i <= 9; i++) {
        document.getElementById(i.toString()).innerHTML = "‎";
    }

    //Other resets
    scoreX = 0;
    scoreO = 0;
    computerNewTurn = false;
    document.getElementById("scoreX").innerHTML = "X: " + scoreX;
    document.getElementById("scoreO").innerHTML = "O: " + scoreX;
}


////////////////////////////////////
function logic(square) {
    
if (computerNewTurn == true) {
    computerNewTurn = false;
    } else if (computerMoveDone) {
        return;
    } else {

    //Error Handling
    if (winX || winO || tie) {
        return;
    }

    if (occupied[square - 1] !== "t") {
        return;
    }

    //Logic

    console.log(turn);//Debug

    vacant -= 1;
    if (turn === "x") {
        occupied[square - 1] = "x";
        document.getElementById(square.toString()).innerHTML = "X";
        console.log(turn);//Debug
        console.log(document.getElementById(square.toString()).innerHTML);
        turn = "o";
    } else if (turn === "o") {
        occupied[square - 1] = "o";
        document.getElementById(square.toString()).innerHTML = "O";
        turn = "x";
    }


    //Find Result
    checkWin();
    if (winX || winO || tie) {
        return;
    }

}

    //Computer Logic
    function computerLogic() {

        function easy() {
            square = Math.ceil(Math.random() * 9);
            if (occupied[square - 1] !== "t") {
                easy();
            }
        }
        function medium() {
            //Check for winning chances
            if (
                //Row 1
                (
                    (occupied[0] == "o" && occupied[1] == "o") ||
                    (occupied[0] == "o" && occupied[2] == "o") ||
                    (occupied[1] == "o" && occupied[2] == "o")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else if (
                //Row 2
                (
                    (occupied[3] == "o" && occupied[4] == "o") ||
                    (occupied[3] == "o" && occupied[5] == "o") ||
                    (occupied[4] == "o" && occupied[5] == "o")
                )
            ) {
                if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[5] == "t") {
                    square = 6;
                }
            } else if (
                //Row 3
                (
                    (occupied[6] == "o" && occupied[7] == "o") ||
                    (occupied[6] == "o" && occupied[8] == "o") ||
                    (occupied[7] == "o" && occupied[8] == "o")
                )
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[7] == "t") {
                    square = 8;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Column 1
                (
                    (occupied[0] == "o" && occupied[3] == "o") ||
                    (occupied[0] == "o" && occupied[6] == "o") ||
                    (occupied[3] == "o" && occupied[6] == "o")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[6] == "t") {
                    square = 7;
                }
            } else if (
                //Column 2
                (
                    (occupied[1] == "o" && occupied[4] == "o") ||
                    (occupied[1] == "o" && occupied[7] == "o") ||
                    (occupied[4] == "o" && occupied[7] == "o")
                )
            ) {
                if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[7] == "t") {
                    square = 8;
                }
            } else if (
                //Column 3
                (
                    (occupied[2] == "o" && occupied[5] == "o") ||
                    (occupied[2] == "o" && occupied[8] == "o") ||
                    (occupied[5] == "o" && occupied[8] == "o")
                )
            ) {
                if (occupied[2] == "t") {
                    square = 3;
                } else if (occupied[5] == "t") {
                    square = 6;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Down
                (
                    (occupied[0] == "o" && occupied[4] == "o") ||
                    (occupied[0] == "o" && occupied[8] == "o") ||
                    (occupied[4] == "o" && occupied[8] == "o")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Up
                (
                    (occupied[6] == "o" && occupied[4] == "o") ||
                    (occupied[6] == "o" && occupied[2] == "o") ||
                    (occupied[4] == "o" && occupied[2] == "o")
                )
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else
            
            //Check for opponent winning chances
            if (
                //Row 1
                (
                    (occupied[0] == "x" && occupied[1] == "x") ||
                    (occupied[0] == "x" && occupied[2] == "x") ||
                    (occupied[1] == "x" && occupied[2] == "x")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else if (
                //Row 2
                (
                    (occupied[3] == "x" && occupied[4] == "x") ||
                    (occupied[3] == "x" && occupied[5] == "x") ||
                    (occupied[4] == "x" && occupied[5] == "x")
                )
            ) {
                if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[5] == "t") {
                    square = 6;
                }
            } else if (
                //Row 3
                (
                    (occupied[6] == "x" && occupied[7] == "x") ||
                    (occupied[6] == "x" && occupied[8] == "x") ||
                    (occupied[7] == "x" && occupied[8] == "x")
                )
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[7] == "t") {
                    square = 8;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Column 1
                (
                    (occupied[0] == "x" && occupied[3] == "x") ||
                    (occupied[0] == "x" && occupied[6] == "x") ||
                    (occupied[3] == "x" && occupied[6] == "x")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[6] == "t") {
                    square = 7;
                }
            } else if (
                //Column 2
                (
                    (occupied[1] == "x" && occupied[4] == "x") ||
                    (occupied[1] == "x" && occupied[7] == "x") ||
                    (occupied[4] == "x" && occupied[7] == "x")
                )
            ) {
                if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[7] == "t") {
                    square = 8;
                }
            } else if (
                //Column 3
                (
                    (occupied[2] == "x" && occupied[5] == "x") ||
                    (occupied[2] == "x" && occupied[8] == "x") ||
                    (occupied[5] == "x" && occupied[8] == "x")
                )
            ) {
                if (occupied[2] == "t") {
                    square = 3;
                } else if (occupied[5] == "t") {
                    square = 6;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Down
                (
                    (occupied[0] == "x" && occupied[4] == "x") ||
                    (occupied[0] == "x" && occupied[8] == "x") ||
                    (occupied[4] == "x" && occupied[8] == "x")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Up
                (
                    (occupied[6] == "x" && occupied[4] == "x") ||
                    (occupied[6] == "x" && occupied[2] == "x") ||
                    (occupied[4] == "x" && occupied[2] == "x")
                )
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else {
                easy();
            }
        }
        function hard() {
            //Check for winning chances
            if (
                //Row 1
                (
                    (occupied[0] == "o" && occupied[1] == "o") ||
                    (occupied[0] == "o" && occupied[2] == "o") ||
                    (occupied[1] == "o" && occupied[2] == "o")
                ) &&
                (occupied[0] == "t" || occupied[1] == "t" || occupied[2] == "t")
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else if (
                //Row 2
                (
                    (occupied[3] == "o" && occupied[4] == "o") ||
                    (occupied[3] == "o" && occupied[5] == "o") ||
                    (occupied[4] == "o" && occupied[5] == "o")
                ) &&
                (occupied[3] == "t" || occupied[4] == "t" || occupied[5] == "t")
            ) {
                if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[5] == "t") {
                    square = 6;
                }
            } else if (
                //Row 3
                (
                    (occupied[6] == "o" && occupied[7] == "o") ||
                    (occupied[6] == "o" && occupied[8] == "o") ||
                    (occupied[7] == "o" && occupied[8] == "o")
                ) &&
                (occupied[6] == "t" || occupied[7] == "t" || occupied[8] == "t")
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[7] == "t") {
                    square = 8;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Column 1
                (
                    (occupied[0] == "o" && occupied[3] == "o") ||
                    (occupied[0] == "o" && occupied[6] == "o") ||
                    (occupied[3] == "o" && occupied[6] == "o")
                ) &&
                (occupied[0] == "t" || occupied[3] == "t" || occupied[6] == "t")
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[6] == "t") {
                    square = 7;
                }
            } else if (
                //Column 2
                (
                    (occupied[1] == "o" && occupied[4] == "o") ||
                    (occupied[1] == "o" && occupied[7] == "o") ||
                    (occupied[4] == "o" && occupied[7] == "o")
                ) &&
                (occupied[1] == "t" || occupied[4] == "t" || occupied[7] == "t")
            ) {
                if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[7] == "t") {
                    square = 8;
                }
            } else if (
                //Column 3
                (
                    (occupied[2] == "o" && occupied[5] == "o") ||
                    (occupied[2] == "o" && occupied[8] == "o") ||
                    (occupied[5] == "o" && occupied[8] == "o")
                ) &&
                (occupied[2] == "t" || occupied[5] == "t" || occupied[8] == "t")
            ) {
                if (occupied[2] == "t") {
                    square = 3;
                } else if (occupied[5] == "t") {
                    square = 6;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Down
                (
                    (occupied[0] == "o" && occupied[4] == "o") ||
                    (occupied[0] == "o" && occupied[8] == "o") ||
                    (occupied[4] == "o" && occupied[8] == "o")
                ) &&
                (occupied[0] == "t" || occupied[4] == "t" || occupied[8] == "t")
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Up
                (
                    (occupied[6] == "o" && occupied[4] == "o") ||
                    (occupied[6] == "o" && occupied[2] == "o") ||
                    (occupied[4] == "o" && occupied[2] == "o")
                ) &&
                (occupied[2] == "t" || occupied[4] == "t" || occupied[6] == "t")
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else
            
            //Check for opponent winning chances
            if (
                //Row 1
                (
                    (occupied[0] == "x" && occupied[1] == "x") ||
                    (occupied[0] == "x" && occupied[2] == "x") ||
                    (occupied[1] == "x" && occupied[2] == "x")
                ) &&
                (occupied[0] == "t" || occupied[1] == "t" || occupied[2] == "t")
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else if (
                //Row 2
                (
                    (occupied[3] == "x" && occupied[4] == "x") ||
                    (occupied[3] == "x" && occupied[5] == "x") ||
                    (occupied[4] == "x" && occupied[5] == "x")
                ) &&
                (occupied[3] == "t" || occupied[4] == "t" || occupied[5] == "t")
            ) {
                if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[5] == "t") {
                    square = 6;
                }
            } else if (
                //Row 3
                (
                    (occupied[6] == "x" && occupied[7] == "x") ||
                    (occupied[6] == "x" && occupied[8] == "x") ||
                    (occupied[7] == "x" && occupied[8] == "x")
                ) &&
                (occupied[6] == "t" || occupied[7] == "t" || occupied[8] == "t")
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[7] == "t") {
                    square = 8;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Column 1
                (
                    (occupied[0] == "x" && occupied[3] == "x") ||
                    (occupied[0] == "x" && occupied[6] == "x") ||
                    (occupied[3] == "x" && occupied[6] == "x")
                ) &&
                (occupied[0] == "t" || occupied[3] == "t" || occupied[6] == "t")
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[3] == "t") {
                    square = 4;
                } else if (occupied[6] == "t") {
                    square = 7;
                }
            } else if (
                //Column 2
                (
                    (occupied[1] == "x" && occupied[4] == "x") ||
                    (occupied[1] == "x" && occupied[7] == "x") ||
                    (occupied[4] == "x" && occupied[7] == "x")
                ) &&
                (occupied[1] == "t" || occupied[4] == "t" || occupied[7] == "t")
            ) {
                if (occupied[1] == "t") {
                    square = 2;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[7] == "t") {
                    square = 8;
                }
            } else if (
                //Column 3
                (
                    (occupied[2] == "x" && occupied[5] == "x") ||
                    (occupied[2] == "x" && occupied[8] == "x") ||
                    (occupied[5] == "x" && occupied[8] == "x")
                ) &&
                (occupied[2] == "t" || occupied[5] == "t" || occupied[8] == "t")
            ) {
                if (occupied[2] == "t") {
                    square = 3;
                } else if (occupied[5] == "t") {
                    square = 6;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Down
                (
                    (occupied[0] == "x" && occupied[4] == "x") ||
                    (occupied[0] == "x" && occupied[8] == "x") ||
                    (occupied[4] == "x" && occupied[8] == "x")
                ) &&
                (occupied[0] == "t" || occupied[4] == "t" || occupied[8] == "t")
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if (
                //Diagonal Up
                (
                    (occupied[6] == "x" && occupied[4] == "x") ||
                    (occupied[6] == "x" && occupied[2] == "x") ||
                    (occupied[4] == "x" && occupied[2] == "x")
                ) &&
                (occupied[2] == "t" || occupied[4] == "t" || occupied[6] == "t")
            ) {
                if (occupied[6] == "t") {
                    square = 7;
                } else if (occupied[4] == "t") {
                    square = 5;
                } else if (occupied[2] == "t") {
                    square = 3;
                }
            } else if (computerDifficulty == "hard") {
                hardAdditionalCode();
            } else if (computerDifficulty == "vHard") {
                vHardAdditionalCode();
            }
        }
        function hardAdditionalCode() {
            if ( //Trap A1
                ((occupied[0] == "t" || occupied[8] == "t") && (occupied[0] == "x" || occupied[8] == "x")) &&
                (
                    (occupied[1] == "t" && occupied[2] == "t" && occupied[5] == "t") ||
                    (occupied[3] == "t" && occupied[6] == "t" && occupied[7] == "t")
                )
            ) {
                if (occupied[0] == "t") {
                    square = 1;
                } else if (occupied[8] == "t") {
                    square = 9;
                }
            } else if ( //Trap A2
                ((occupied[6] == "t" || occupied[2] == "t") && (occupied[6] == "x" || occupied[2] == "x")) &&
                (
                    (occupied[0] == "t" && occupied[1] == "t" && occupied[3] == "t") ||
                    (occupied[7] == "t" && occupied[8] == "t" && occupied[5] == "t")
                )
            ) {
                if (occupied[2] == "t") {
                    square = 3;
                } else if (occupied[6] == "t") {
                    square = 7;
                }
            }
        }
        function vHard() {
            hard();
        }
        function vHardAdditionalCode() {
            if (
                (occupied[0] == "x" || occupied[2] == "x" || occupied[6] == "x" || occupied[8] == "x")            ) {
                square = 5;
            }
            if (
                (occupied[0] == "x" || occupied[2] == "x" || occupied[6] == "x" || occupied[8] == "x") &&
                occupied[4] == "o"
            ) {
                const rand = Math.floor(Math.random() * 4)
                if (rand == 0) {
                    square = 2;
                } else if (rand == 1) {
                    square = 4;
                } else if (rand == 2) {
                    square = 6;
                } else if (rand == 3) {
                    square = 8;
                }
            } else if (
                (occupied[1] == "x" && occupied[5] == "x") ||
                (occupied[5] == "x" && occupied[7] == "x") ||
                (occupied[7] == "x" && occupied[3] == "x") ||
                (occupied[3] == "x" && occupied[1] == "x")
            ) {
                square = 4;
            } else if (
                occupied[0] == "x" && occupied[7] == "x" && occupied[6] == "t"
            ) {
                square = 7;
            } else if (
                occupied[6] == "x" && occupied[5] == "x" && occupied[8] == "t"
            ) {
                square = 9;
            } else if (
                occupied[8] == "x" && occupied[2] == "x" && occupied[2] == "t"
            ) {
                square = 3;
            } else if (
                occupied[2] == "x" && occupied[3] == "x" && occupied[0] == "t"
            ) {
                square = 1;
            }
        }

        if (computerDifficulty == "easy") {
            easy();
        } else if (computerDifficulty == "medium") {
            medium();
        } else if (computerDifficulty == "hard") {
            hard();
        } else {
            vHard();
        }

        vacant -= 1;
        if (turn === "o") {
            if (occupied[square - 1] !== "t") {//Used for Failsafe
                easy();
                }
            occupied[square - 1] = "o";
            document.getElementById(square.toString()).innerHTML = "O";
            turn = "x";
        } else {
            occupied[square - 1] = "x"
            document.getElementById(square.toString()).innerHTML = "X"
            turn = "o";
        }
        checkWin();
        computerMoveDone = false;
    }

    if (varSetting === "Computer" && !winX && !winO && !tie && turn === "o") {
        computerMoveDone = true;
        setTimeout(computerLogic, 500);
    }
}


function checkWin() {
    //Check for X
    if (
        //rows
        (occupied[0] === "x" && occupied[1] === "x" && occupied[2] === "x") ||
        (occupied[3] === "x" && occupied[4] === "x" && occupied[5] === "x") ||
        (occupied[6] === "x" && occupied[7] === "x" && occupied[8] === "x") ||
        //Columns
        (occupied[0] === "x" && occupied[3] === "x" && occupied[6] === "x") ||
        (occupied[1] === "x" && occupied[4] === "x" && occupied[7] === "x") ||
        (occupied[2] === "x" && occupied[5] === "x" && occupied[8] === "x") ||
        //Diagonals
        (occupied[0] === "x" && occupied[4] === "x" && occupied[8] === "x")||
        (occupied[2] === "x" && occupied[4] === "x" && occupied[6] === "x")
        ) {
        winX = true;
        scoreX += 1;
        document.getElementById("scoreX").innerHTML = "X: " + scoreX;
        document.getElementById("result").innerHTML = "X won";
    } else
    //Check for O
    if (
        //rows
        (occupied[0] === "o" && occupied[1] === "o" && occupied[2] === "o") ||
        (occupied[3] === "o" && occupied[4] === "o" && occupied[5] === "o") ||
        (occupied[6] === "o" && occupied[7] === "o" && occupied[8] === "o") ||
        //Columns
        (occupied[0] === "o" && occupied[3] === "o" && occupied[6] === "o") ||
        (occupied[1] === "o" && occupied[4] === "o" && occupied[7] === "o") ||
        (occupied[2] === "o" && occupied[5] === "o" && occupied[8] === "o") ||
        //Diagonals
        (occupied[0] === "o" && occupied[4] === "o" && occupied[8] === "o")||
        (occupied[2] === "o" && occupied[4] === "o" && occupied[6] === "o")
        ) {
        winO = true;
        scoreO += 1;
        document.getElementById("scoreO").innerHTML = "O: " + scoreO;
        document.getElementById("result").innerHTML = "O won";
    } else
    //Check for Tie
    if (vacant == 0) {
        tie = true;
        scoreX += 0.5;
        scoreO += 0.5;
        document.getElementById("scoreX").innerHTML = "X: " + scoreX;
        document.getElementById("scoreO").innerHTML = "O: " + scoreO;
        document.getElementById("result").innerHTML = "Draw";
    }
    document.getElementById("turn").innerHTML = "Turn: " + turn;
}

{//Game Buttons
function f1() {
    logic(1);
}

function f2() {
    logic(2);
}

function f3() {
    logic(3);
}

function f4() {
    logic(4);
}

function f5() {
    logic(5);
}

function f6() {
    logic(6);
}

function f7() {
    logic(7);
}

function f8() {
    logic(8);
}

function f9() {
    logic(9);
}


function setting() {
    resetAll();

    if (varSetting == "Computer") {
        if (computerDifficulty == "easy") {
            computerDifficulty = "medium";
        } else if (computerDifficulty == "medium") {
            computerDifficulty = "hard";
        } else if (computerDifficulty == "hard") {
            computerDifficulty = "vHard";
        } else if (computerDifficulty == "vHard") {
            varSetting = "Player";
        }
    } else {
        varSetting = "Computer";
        computerDifficulty = "easy";
    }

    if (varSetting == "Computer") {
        document.getElementById("setting").innerHTML = "Player vs. " + varSetting + " - " + computerDifficulty;
    } else {
        document.getElementById("setting").innerHTML = "Player vs. " + varSetting;
    }
}
}
