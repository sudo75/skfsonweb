const paddle1 = document.querySelector(".paddle1")
const paddle2 = document.querySelector('.paddle2');
const ball = document.querySelector('.ball');
const gameArea = document.querySelector('.board');

const boardWidth = gameArea.clientWidth;
const boardHeight = gameArea.clientHeight;
const ballWidth = ball.clientWidth;
const ballHeight = ball.clientHeight;

const Paddle1Height = paddle1.clientHeight;
const paddle1Width = ball.clientWidth;

const Paddle2Height = paddle1.clientHeight;
const paddle2Width = ball.clientWidth;

let result = "playing";
let score1 = 0;
let score2 = 0;
let previousTurnWin = null;
let firstTo = 7;

let fps = 60;
let running = false;

let paddle1Pos = [30, 170];
let paddle2Pos = [570, 170];
let paddle1Moving = null;
let paddle2Moving = null;
let ballPos = [295, 195];
let ballSpeed = [3, 3];
let topBottomYCooldown1 = false;
let topBottomYCooldown2 = false;
initialBallSpeed();
updateBoard();

function initialBallSpeed() {

    let newXspeed = Math.random() * 3 + 1;
    let newYspeed = Math.random() * 3 + 1;

    //X direction
    if (previousTurnWin == null || previousTurnWin == "player2") {
        newXspeed *= -1;
    }
    //Y direction
    if (trueOrFalse()) {
        newYspeed *= -1;
    }

    ballSpeed[0] = newXspeed;
    ballSpeed[1] = newYspeed;

    function trueOrFalse() {
        let booleanTrueOrFalse = Math.random();
        if(booleanTrueOrFalse > 0.5) {
            return true;
        } else {
            return false;
        }
    }
}

function newRound() {
    initialBallSpeed();
    previousTurnWin = null;
    clearInterval(update);
    running = false;
    ballPos = [295, 195];
    result = "playing";
    updateBoard();

    start();
}

function start() {
    if (result !== "playing") {
        return;
    }
    if (running == false) {
        running = true;
        update = setInterval(() => {
            updateBoard();
        }, 1000 / fps);
    } else {
        running = false;
        clearInterval(update);
    }
}

function reset() {
    clearInterval(update);
    running = false;
    paddle1Pos = [30, 170];
    paddle2Pos = [570, 170];
    ballPos = [295, 195];
    initialBallSpeed();
    result = "playing";
    document.getElementById("result").innerHTML = "Player vs. Player";
    score1 = 0;
    document.getElementById("score1").innerHTML = score1;
    score2 = 0;
    document.getElementById("score2").innerHTML = score2;

    updateBoard();
}

function updateBoard() {
    
    //Update Paddle Positions
    paddlePositionUpdate();
    function paddlePositionUpdate() {
        if (paddle1Moving == "up") {
            paddle1Pos[1] -= 4;
        }
        if (paddle1Moving == "down") {
            paddle1Pos[1] += 4;
        }
        if (paddle2Moving == "up") {
            paddle2Pos[1] -= 4;
        }
        if (paddle2Moving == "down") {
            paddle2Pos[1] += 4;
        }
    
        //Paddle Min and Max Y Positions
        if (paddle1Pos[1] <= 0) {
            paddle1Pos[1] = 0;
        }
        if (paddle2Pos[1] <= 0) {
            paddle2Pos[1] = 0;
        }
        if (paddle1Pos[1] + Paddle1Height >= boardHeight) {
            paddle1Pos[1] = boardHeight - Paddle1Height;
        }
        if (paddle2Pos[1] + Paddle2Height >= boardHeight) {
            paddle2Pos[1] = boardHeight - Paddle2Height;
        }
    }
    paddle1.style.left = `${paddle1Pos[0]}px` //Paddle1 X
    paddle1.style.top = `${paddle1Pos[1]}px` //Paddle1 Y

    paddle2.style.left = `${paddle2Pos[0]}px` //Paddle2 X
    paddle2.style.top = `${paddle2Pos[1]}px` //Paddle2 Y

    //Update Ball Positions
    ballPositionUpdate();
    function ballPositionUpdate() {
        ballPos[0] = ballPos[0] + ballSpeed[0];
        ballPos[1] = ballPos[1] + ballSpeed[1];
        ballCollisionLogic();
        function ballCollisionLogic() {
            //Wall Collision
                //Left
            if (ballPos[0] <= 0) {
                ballSpeed[0] *= -1;
                previousTurnWin = "player2";
                score2 += 1;
                document.getElementById("score2").innerHTML = score2;
            }
                //Right
            if (ballPos[0] + ballWidth >= boardWidth) {
                ballSpeed[0] *= -1;
                previousTurnWin = "player1";
                score1 += 1;
                document.getElementById("score1").innerHTML = score1;
            }
                //Top
            if (ballPos[1] <= 0) {
                ballPos[1] = 0;
                ballSpeed[1] *= -1;
            }
                //Bottom
            if (ballPos[1] + ballHeight >= boardHeight) {
                ballPos[1] = boardHeight - ballHeight;
                ballSpeed[1] *= -1;
            }
        
            //Paddle1 Collision
            const paddle1MaxX = paddle1Pos[0] + paddle1Width;
            const paddle1MaxY = paddle1Pos[1] + Paddle1Height;
        
            if (//Right side
                ballPos[0] <= paddle1MaxX &&
                ballPos[0] >= paddle1MaxX - 8 &&
                ballPos[1] + ballHeight >= paddle1Pos[1] &&
                ballPos[1] <= paddle1MaxY &&
                !topBottomYCooldown1
            ) {
                topBottomYCooldown1 = true;
                ballSpeed[0] *= -1;
                ballCollisionAngle();
            } else if (//Top and bottom
                ballPos[0] < paddle1MaxX - 8 &&
                ballPos[0] + ballWidth >= paddle1Pos[0] &&
                ballPos[1] + ballHeight >= paddle1Pos[1] &&
                ballPos[1] <= paddle1MaxY &&
                !topBottomYCooldown1
            ) {
                topBottomYCooldown1 = true;
                ballSpeed[0] *= -1;
                ballSpeed[1] *= -1;
                ballCollisionAngle();
            } else {
                topBottomYCooldown1 = false;
            }
        
            //Paddle2 Collision
            const paddle2MaxX = paddle2Pos[0] + paddle2Width;
            const paddle2MaxY = paddle2Pos[1] + Paddle2Height;
        
            if (//Left side
                ballPos[0] + ballWidth <= paddle2Pos[0] + 8 &&
                ballPos[0] + ballWidth >= paddle2Pos[0] &&
                ballPos[1] + ballHeight >= paddle2Pos[1] &&
                ballPos[1] <= paddle2MaxY &&
                !topBottomYCooldown2
            ) {
                topBottomYCooldown2 = true;
                ballSpeed[0] *= -1;
                ballCollisionAngle();
            } else if (//Top and bottom
                ballPos[0] + ballWidth <= paddle2MaxX &&
                ballPos[0] > paddle2Pos[0] + 8 &&
                ballPos[1] + ballHeight >= paddle2Pos[1] &&
                ballPos[1] <= paddle2MaxY &&
                !topBottomYCooldown2
            ) {
                topBottomYCooldown2 = true;
                ballSpeed[0] *= -1;
                ballSpeed[1] *= -1;
                ballCollisionAngle();
            } else {
                topBottomYCooldown2 = false;
            }
        
            function ballCollisionAngle() {
                //Setup
                let newXspeed = Math.random() * 3 + 1;
                let newYspeed = Math.random() * 3 + 1;
        
                if (newXspeed + newYspeed <= 4) {
                    if (newXspeed > newYspeed) {
                        newYspeed += 1;
                    } else {
                        newXspeed += 1;
                    }
                }

                //Change direction
                if (ballSpeed[0] < 0) {
                    ballSpeed[0] = -newXspeed;
                } else {
                    ballSpeed[0] = newXspeed;
                }
                if (ballSpeed[1] < 0) {
                    ballSpeed[1] = -newYspeed;
                } else {
                    ballSpeed[1] = newYspeed;
                }
            }
        }
    }
    ball.style.left = `${ballPos[0]}px` //Ball X
    ball.style.top = `${ballPos[1]}px` //Ball Y

    if (score1 >= 7) {//Checking for player1 win
        result = "player1"; //Player1 Win
        document.getElementById("result").innerHTML = result + " Wins!"
    } else if (score2 >= 7) {//Checking for player2 win
        result = "player2"; //Player2 Win
        document.getElementById("result").innerHTML = result + " Wins!"
    }
    if (previousTurnWin !== null) {
        newRound();
    }
}

{//Key detection
    document.addEventListener('keydown', function() {
        const key = event.key;
    
        //Paddle1
        if (key == "w") {
            paddle1Moving = "up";
        }
        if (key == "s") {
            paddle1Moving = "down";
        }
    
        //Paddle2
        if (key == "ArrowUp") {
            paddle2Moving = "up";
        }
        if (key == "ArrowDown") {
            paddle2Moving = "down";
        }
    });
    
    document.addEventListener('keyup', function(event) {
        const key = event.key;
    
        //Paddle1
        if (key == "w" || key == "s") {
            paddle1Moving = null; // Stop paddle1 movement when 'w' or 's' key is released
        }
    
        //Paddle2
        if (key == "ArrowUp" || key == "ArrowDown") {
            paddle2Moving = null; // Stop paddle2 movement when arrow up or arrow down key is released
        }
    });
}
