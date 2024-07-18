const version = "0.4.0";

//Display
const canvas = document.querySelector('canvas');

canvas.width = 408;
canvas.height = 725;

let scale = {x: 1, y: 1};

const ctx = canvas.getContext('2d');

//Global Display Variables
let pauseButtonPos = {};

//Sounds
const lossAudio = new Audio('assets/loss.mp3');
lossAudio.load();
lossAudio.volume = 0.15;
const pointAudio = new Audio('assets/point.mp3');
pointAudio.load();
pointAudio.volume = 0.5;
const wooshAudio = new Audio('assets/woosh.mp3');
wooshAudio.load();
wooshAudio.volume = 0.3;
const pixel_perfect = new Audio('assets/pixel-perfect.mp3');
pixel_perfect.load();
pixel_perfect.volume = 0.5;
const chompAudio = new Audio('assets/chomp.mp3');
chompAudio.load();
chompAudio.volume = 1;
const bangAudio = new Audio('assets/bang.mp3');
bangAudio.load();
bangAudio.volume = 1;

//Debug


//Enential variables
let score = 0;
let hiScore = 0;
let screen = "title";

    background = new Image;

    bird = new Image;
    bird.height = 36;
    bird.width = 51;
    birdPos = {x: canvas.width / 8, y: canvas.height / 2};
    bird.health = 5;
    bird.energy = 10;

    powerUp = [];

    powerUpImage = [];
    powerUpImage[0] = new Image;
    powerUpImage[0].src = 'assets/coffee-bean.png';
    powerUpImage[1] = new Image;
    powerUpImage[1].src = 'assets/heart.png';
    powerUpImage[2] = new Image;
    powerUpImage[2].src = 'assets/blue-heart.png';
    powerUpImage[3] = new Image;
    powerUpImage[3].src = 'assets/black-heart.png';

    pipeTop = new Image;
    pipeBottom = new Image;
    pipeTop.height = 408;
    pipeTop.width = 51;
    pipeBottom.height = 408;
    pipeBottom.width = 51;
    topPipe = [{x: canvas.width * 0.5, y: -153, yVel: 0}];
    bottomPipe = [{x: canvas.width * 0.5, y: canvas.height * 0.5 + 51, yVel: 0}];

function reset() {
    topPipe = [{x: canvas.width * 0.5, y: -153, yVel: 0}];
    bottomPipe = [{x: canvas.width * 0.5, y: canvas.height * 0.5 + 51, yVel: 0}];
    birdPos = {x: canvas.width / 8, y: canvas.height / 2};
    powerUp = [];
    score = 0;
    birdVelocity = 1;
    birdVelocityChange = 0.2;
    bird.energy = 10
    bird.health = 5;

    gametick = 0;
}

//Title Screen
drawTitleScreen();
function drawTitleScreen() {
    //Craete background
    const height = canvas.height;
    const width = canvas.width;

    ctx.fillStyle = 'rgb(115, 205, 175)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgb(145, 255, 225)';

    const scoreBox = {x: width * 0.2, y: height * 0.25, width: width * 0.6, height: height * 0.2}
    ctx.fillRect(scoreBox.x, scoreBox.y, scoreBox.width, scoreBox.height);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.strokeRect(scoreBox.x, scoreBox.y, scoreBox.width, scoreBox.height);

    //Display Title
    displayTitle();
    function displayTitle() {
        const fontSize = 50;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'blue';
        const text = "Floppy Bird";
        const textWidth = ctx.measureText(text).width
        ctx.fillText(text, width / 2 - textWidth / 2, height * 0.1);
    }

    //Display Score
    displayScoreOnTitle();
    function displayScoreOnTitle() {
        const fontSize = 24;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'blue';
        const text = [`Score: ${score}`, `HiScore: ${hiScore}`];
        let textWidth = [];
        textWidth[0] = ctx.measureText(text[0]).width;
        textWidth[1] = ctx.measureText(text[1]).width;
        ctx.fillText(text[0], scoreBox.x + scoreBox.width / 2 - textWidth[0] / 2, scoreBox.y + scoreBox.height / 2 - fontSize);
        ctx.fillText(text[1], scoreBox.x + scoreBox.width / 2 - textWidth[1] / 2, scoreBox.y + scoreBox.height / 2 + fontSize);
    }

    //Start Button
    startButton = {x: width * 0.2, y: height * 0.5, width: width * 0.6, height: height * 0.1}
    ctx.fillStyle = 'rgb(145, 255, 225)';
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.strokeRect(startButton.x, startButton.y, startButton.width, startButton.height);
    displayStartButtonText();
    function displayStartButtonText() {
        const fontSize = 24;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'blue';
        const text = "Start";
        const textWidth = ctx.measureText(text).width
        ctx.fillText(text, startButton.x + startButton.width / 2 - textWidth / 2, startButton.y + startButton.height / 2 + 5);
    }
}


//Draw Images
function drawBackground_game() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function start() {
        reset();
        screen = "playing";
    background.src = 'assets/flappybirdbg.png';
    background.onload = drawBackground_game();
    bird.src = 'assets/flappybird.png';
    bird.onload = drawBird();
    pipeTop.src = 'assets/toppipe.png';
    pipeBottom.src = 'assets/bottompipe.png';
    pipeBottom.onload = drawPipes();
    animate();
    //animationFrame = setInterval(animate, 1000/60);
    hop();
}

function drawPipes() {
    topPipe.forEach((pipe, i) => {
        ctx.drawImage(pipeTop, topPipe[i].x, topPipe[i].y, 51, 408);
    });
    bottomPipe.forEach((pipe, i) => {
        ctx.drawImage(pipeBottom, bottomPipe[i].x, bottomPipe[i].y, 51, 408);
    });
}

function drawPauseButton() {
    pauseButtonPos = {x: canvas.width * 0.7, y: canvas.width * 0.05, width: canvas.width * 0.25, height: canvas.width * 0.15};
    ctx.fillStyle = 'rgba(50, 50, 50, 0.4)';
    ctx.fillRect(pauseButtonPos.x, pauseButtonPos.y, pauseButtonPos.width, pauseButtonPos.height);
    ctx.beginPath();
    ctx.moveTo(pauseButtonPos.x, pauseButtonPos.y);
    ctx.lineTo(pauseButtonPos.x + pauseButtonPos.width, pauseButtonPos.y);
    ctx.lineTo(pauseButtonPos.x + pauseButtonPos.width, pauseButtonPos.y + pauseButtonPos.height);
    ctx.lineTo(pauseButtonPos.x, pauseButtonPos.y + pauseButtonPos.height);
    ctx.lineTo(pauseButtonPos.x, pauseButtonPos.y);
    ctx.stroke();
        const fontSize = 24;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'blue';
        let text;
        switch (screen) {
            case "playing":
                text = "Pause";
            break;
            case "paused":
                text = "Resume";
            break;
        }

        const textWidth = ctx.measureText(text).width
        ctx.fillText(text, pauseButtonPos.x + pauseButtonPos.width / 2 - textWidth / 2, pauseButtonPos.y + pauseButtonPos.height / 2 + 5);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function collisionDetection(x1, y1, maxX1, maxY1, x2, y2, maxX2, maxY2) {
    if (
        x1 < maxX2 &&
        maxX1 > x2 &&
        y1 < maxY2 &&
        maxY1 > y2
    ) {
        return true;
    }
}

let birdAngle = "straight";
let angle = 0;
function drawBird() {
    if (birdVelocity > 0) {
        birdAngle = "down";
    }

    // Save the current canvas context state
    ctx.save();

    if (birdAngle === "down" && angle !== 0.2) {
        ctx.translate(birdPos.x + bird.width / 2, birdPos.y + bird.height / 2);
        ctx.rotate(0.2);
        ctx.translate(-(birdPos.x + bird.width / 2), -(birdPos.y + bird.height / 2));
        angle = 0.2;
    }

    if (birdAngle === "up" && angle !== -0.2) {
        ctx.translate(birdPos.x + bird.width / 2, birdPos.y + bird.height / 2);
        ctx.rotate(-0.2);
        ctx.translate(-(birdPos.x + bird.width / 2), -(birdPos.y + bird.height / 2));
        angle = -0.2;
    }

    ctx.drawImage(bird, birdPos.x, birdPos.y, 51, 36);

    // Restore the previous canvas context state
    ctx.restore();
    angle = 0;
}

//Results

function afterLoss() {
    if (score > hiScore) {
        hiScore = score;
    }
    pixel_perfect.pause();
    pixel_perfect.currentTime = 0;
    lossAudio.play();
    screen = "title";
    clearCanvas();
    drawTitleScreen();
    score = 0;
}

let birdVelocity = 1;
let birdVelocityChange = 0.2;
let gametick = 0;
let ZeroEnergyStart;
let animation;
let then = Date.now();

function animate() {
    let stopAnimtation = false;

    function birdFall() {
        birdPos.y += birdVelocity;
        birdVelocity += birdVelocityChange;

        if (birdPos.y > canvas.height - bird.height) {
            stopAnimtation = true;
        }
    }

    function checkBirdCollision() {
        
        //Max Y
        if (birdPos.y < 0) {
            birdPos.y = 0;
        }

        //Pipe collision
        topPipe.forEach(pipe => {
            
            if (
                collisionDetection(birdPos.x, birdPos.y, birdPos.x + bird.width, birdPos.y + bird.height, pipe.x, pipe.y, pipe.x + pipeTop.width, pipe.y + pipeTop.height)
            ) {
                stopAnimtation = true;
            }
        });
        bottomPipe.forEach(pipe => {
            if (
                collisionDetection(birdPos.x, birdPos.y, birdPos.x + bird.width, birdPos.y + bird.height, pipe.x, pipe.y, pipe.x + pipeTop.width, pipe.y + pipeBottom.height)
            ) {
                stopAnimtation = true;
            }
        });

        //Power-up collision
        for (i = 0; i < powerUp.length; i++) {
            const currentPowerUp = powerUp[i];
            if (collisionDetection(birdPos.x, birdPos.y, birdPos.x + bird.width, birdPos.y + bird.height, currentPowerUp.x, currentPowerUp.y, currentPowerUp.x + currentPowerUp.width, currentPowerUp.y + currentPowerUp.height)) {
                console.log('trigger');
                switch (currentPowerUp.type) {
                    case "coffee-bean":
                    bird.energy += 3;
                    powerUp.splice(i, 1);
                    chompAudio.play();
                    break;

                    case "heart":
                    powerUp.splice(i, 1);
                    chompAudio.play();
                    break;

                    case "blue-heart":
                    if (bird.energy < 4) {
                        bird.energy += 2;
                    } else if (bird.energy > 20) {
                        bird.energy -= 2;
                    }
                    bird.health = 5;
                    powerUp.splice(i, 1);
                    chompAudio.play();
                    break;

                    case "black-heart":
                    bird.health -= 1;
                    bird.energy -= 3;
                    powerUp.splice(i, 1);
                    bangAudio.play();
                    break;
                }
            }
            
        }

    }

    function pipeMovement() {
        function randomYVel() { //value for moving pipes
            const rand = Math.random();
            let multiplier;
            if (rand > 0.5) {
                multiplier = -0.8;
            } else {
                multiplier = 0.8;
            }
            return Math.random() * multiplier + multiplier * 0.5;
        }

            const gap = Math.round(Math.random() * 102) + 102;
            const topPipeY = Math.round(Math.random() * -204);
            const bottomPipeY = topPipeY + pipeTop.height + gap;

        for (let i = topPipe.length - 1; i >= 0; i--) {
            
            const randYVelocity = randomYVel();
            if (topPipe[i]) { //top pipe
                if (topPipe[i].x === canvas.width * 0.5) { //If old pipe is in the middle of the canvas, create new pipe
                    topPipe.push({x: canvas.width, y: topPipeY, yVel: 0});
                    if (score >= 8) {//Top pipe YVelocity takes care of bottom pipe
                        const rand = Math.random();
                        if (score === 8) {
                            topPipe[topPipe.length - 1].yVel = randYVelocity;
                        }
                        if (Math.floor(rand * 10) < 3) { //30% chance of moving pipe
                            topPipe[topPipe.length - 1].yVel = randYVelocity;
                        }

                    }
                }
                if (topPipe[i].x === 0 - pipeTop.width) { //If pipe goes off-screen, delete it
                    topPipe.splice(i, 1);
                } else {
                    topPipe[i].x--;
                    if (topPipe[i].y <= -204) {
                        topPipe[i].yVel *= -1;
                    }
                    if (topPipe[i].y >= 0) {
                        topPipe[i].yVel *= -1;
                    }
                    topPipe[i].y += topPipe[i].yVel;
                }

            if (bottomPipe[i]) { //bottom pipe
                if (bottomPipe[i].x === canvas.width * 0.5) { //If old pipe is in the middle of the canvas, create new pipe
                    bottomPipe.push({x: canvas.width, y: bottomPipeY, yVel: 0});
                }
                if (bottomPipe[i].x === 0 - pipeTop.width) { //If pipe goes off-screen, delete it
                    bottomPipe.splice(i, 1);
                } else {
                    bottomPipe[i].x--;
                    bottomPipe[i].yVel = topPipe[i].yVel;
                    bottomPipe[i].y += bottomPipe[i].yVel;
                }
            }
            }
        }

    }
    
    function statManager() {
        if (gametick % 50 === 0) {
            if (bird.energy > 0) {
                bird.energy -= 0.1;
            }
        }

        if (bird.energy <= 0) { //Bird will lose health if energy is 0
            if (ZeroEnergyStart === null) {
                ZeroEnergyStart = gametick;
            }
            if ((gametick - ZeroEnergyStart) % 150 === 0) {
                bird.health -= 1;
                bangAudio.play();
            }
        } else {
            ZeroEnergyStart = null;
        }

        if (bird.health >= 5) {
            bird.health = 5;
        }
        if (bird.health <= 0) {
            stopAnimtation = true;
        }
        
    }

    function drawStats() {
        //Round Values
        let energy = bird.energy.toFixed(1);

        //Draw
        let stats = {x: canvas.width * 0.1, y: canvas.height * 0.92, width: canvas.width * 0.8, height: canvas.height * 0.07};
        ctx.fillStyle = 'rgba(50, 50, 50, 0.3)';
        ctx.fillRect(stats.x, stats.y, stats.width, stats.height);
        ctx.beginPath();
        ctx.moveTo(stats.x, stats.y);
        ctx.lineTo(stats.x + stats.width, stats.y);
        ctx.lineTo(stats.x + stats.width, stats.y + stats.height);
        ctx.lineTo(stats.x, stats.y + stats.height);
        ctx.lineTo(stats.x, stats.y);
        ctx.stroke();
            const fontSize = 24;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = 'blue';
            let text = ["Health: " + bird.health, "Energy: " + energy];

            ctx.fillText(text[0], stats.x + 15, stats.y + (stats.height + fontSize) / 2);
            ctx.fillText(text[1], stats.x + 15 + stats.width / 2, stats.y + (stats.height + fontSize) / 2);
    }

    function spawnAndMovePowerUps() {
        {//Movement
            for (i = 0; i < powerUp.length; i++) {
                powerUp[i].x--;
            }

            for (i = 0; i < powerUp.length; i++) {

                powerUp[i].y += powerUp[i].velocity;

                //Upper and lower bounds
                if (powerUp[i].y < canvas.height * 0.2 || powerUp[i].y > canvas.height * 0.8) {
                    powerUp[i].velocity *= -1;
                }
            }

        }
        if (Math.floor(topPipe[topPipe.length - 1].x + pipeTop.width / 2) !== Math.floor(canvas.width - (topPipe[topPipe.length - 1].x - topPipe[topPipe.length - 2].x) / 2)){
            return;
        }
        let chance;
        
        {//Coffee Bean
            chance = 30;
            if (score >= 10) {
                chanceReductionCoefficient = Math.floor((score - 10) / 5); // Every 5 pts after 10, reduce chance of power-up by 2
                chance = chance - 2 * chanceReductionCoefficient;
                if (chance < 15) {
                    chance = 15;
                }
            }

            if (Math.ceil(Math.random() * 100) <= chance) { //Chance should be a value from 0 to 100
                let randomY = Math.floor((Math.random() * canvas.height * 0.5) + canvas.height * 0.25);
                powerUp.push({type: "coffee-bean", x: canvas.width, y: randomY, width: 30, height: 30, velocity: Math.random() * 1.5 + 0.5});
                
                for (i = 0; i < powerUp.length; i++) {//Ensure no overlapping
                    lastEle = powerUp[powerUp.length - 1];
                    if (collisionDetection(lastEle.x, lastEle.y, lastEle.x + lastEle.width, lastEle.y + lastEle.height, powerUp[i].x, powerUp[i].y, powerUp[i].x + powerUp[i].width, powerUp[i].y + powerUp[i].height)) {
                        if (lastEle.y + powerUp[i].y > canvas.height) {//if the avg of both y's is more than half the canvas
                            if (lastEle.y > powerUp[i].y) {
                                powerUp[i].y -= (lastEle.height + powerUp[i].height) * 1.5;
                            } else {
                                lastEle.y -= (lastEle.height + powerUp[i].height) * 1.5;
                            }
                        }
                    }
                }
            }
        }

        {//Heart
            chance = 0;
            if (score % 10 === 0 && score !== 0) {
                chance = 100;
            }
            if (Math.ceil(Math.random() * 100) <= chance) { //Chance should be a value from 0 to 100
                let randomY = Math.floor((Math.random() * canvas.height * 0.5) + canvas.height * 0.25);
                powerUp.push({type: "heart", x: canvas.width, y: randomY, width: 30, height: 30, velocity: Math.random() * 1.5 + 0.5});
            }
        }

        {//Blue Heart
            chance = 5;

            if (Math.ceil(Math.random() * 100) <= chance) { //Chance should be a value from 0 to 100
                let randomY = Math.floor((Math.random() * canvas.height * 0.5) + canvas.height * 0.25);
                powerUp.push({type: "blue-heart", x: canvas.width, y: randomY, width: 30, height: 30, velocity: Math.random() * 1.5 + 0.5});
            }
        }

        {//Black Heart
            chance = 15;
            if (score >= 10) {
                chanceReductionCoefficient = Math.floor((score - 10) / 10); // Every 10 pts after 10, increase chance of spawn by 8
                chance = chance + 8 * chanceReductionCoefficient;
                if (chance > 60) {
                    chance = 60;
                }
            }

            if (Math.ceil(Math.random() * 100) <= chance) { //Chance should be a value from 0 to 100
                let randomY = Math.floor((Math.random() * canvas.height * 0.5) + canvas.height * 0.25);
                powerUp.push({type: "black-heart", x: canvas.width, y: randomY, width: 30, height: 30, velocity: Math.random() * 1.5 + 0.5});
            }
        }

    }

    function drawPowerUps() {
        for (i = 0; i < powerUp.length; i++) {
            const currentPowerUp = powerUp[i];
            switch (currentPowerUp.type) {
                case "coffee-bean":
                    ctx.drawImage(powerUpImage[0], currentPowerUp.x, currentPowerUp.y, currentPowerUp.width, currentPowerUp.height);
                break;

                case "heart":
                    ctx.drawImage(powerUpImage[1], currentPowerUp.x, currentPowerUp.y, currentPowerUp.width, currentPowerUp.height);
                break;

                case "blue-heart":
                    ctx.drawImage(powerUpImage[2], currentPowerUp.x, currentPowerUp.y, currentPowerUp.width, currentPowerUp.height);
                break;

                case "black-heart":
                    ctx.drawImage(powerUpImage[3], currentPowerUp.x, currentPowerUp.y, currentPowerUp.width, currentPowerUp.height);
                break;
            }
        }
    }

    function setScore() {
        topPipe.forEach(pipe => {
            if (birdPos.x === pipe.x + pipeTop.width) {
                pointAudio.play();
                score++;
            }
        });
    }

    ctx.font = '24px Arial';
    ctx.fillStyle = 'blue';
    function displayScore(score) {
        ctx.fillText(score, 50, 50);
    }

    targetFPS = 60;
    let now = Date.now();
    let difference = now - then;

    if (difference > 1000 / targetFPS / 2) {
        //Animation functions
        drawPauseButton();
        clearCanvas();
        drawBackground_game();
        birdFall();
        drawBird();
        checkBirdCollision();
        pipeMovement();
        drawPipes();
        setScore();
        spawnAndMovePowerUps();
        drawPowerUps();

        drawStats();
        statManager();
        drawPauseButton();
        displayScore(score);

        then = now;
    }

    pixel_perfect.play();
    if (stopAnimtation) {
        afterLoss();
        return;
    }
    if (screen === "paused") {
        return;
    }

    animation = requestAnimationFrame(animate);
    
    gametick++;
    if (gametick === 1000) {
        gametick = 0;
    }
    
}

canvas.addEventListener('click', click);
document.addEventListener('keydown', keypress);

function click(event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;
    
    {//Start Button
        // Check if the click occurred within the boundaries of the start button
        if (
            screen === "title" &&
            clickX >= startButton.x &&
            clickX <= startButton.x + startButton.width &&
            clickY >= startButton.y &&
            clickY <= startButton.y + startButton.height
        ) {
            start();
        }
    }

    {//Pause Button
        // Check if the click occurred within the boundaries of the pause button
        if (
            clickX >= pauseButtonPos.x &&
            clickX <= pauseButtonPos.x + pauseButtonPos.width &&
            clickY >= pauseButtonPos.y &&
            clickY <= pauseButtonPos.y + pauseButtonPos.height
        ) {
            pause();
            hop();
            return;
        }
    }

    //Resume by clicking
    if (screen === "paused") {
        pause();
    }

    if (screen === "playing") {
        hop();
    }

}

function keypress(event) {
    const key = event.key;

    if (key === ' ' || key === 'ArrowUp' || key === 'Enter') {
        hop();
        if (screen === "title") {
            start(0);
        }
        if (screen === "paused") {
            pause();
            hop();
        }
    }
    if (key === "p" && (screen === "playing" || screen === "paused")) {
        pause();
        hop();
    }
}
function hop() {
    if (screen === "playing") {
        birdVelocity = -4;
        if (bird.energy <= 4) {
            birdVelocity += 0.5 * (4 - bird.energy);
        }
        if (bird.energy > 20) {
            birdVelocity -= 0.25 * (bird.energy - 20);
            if (birdVelocity < -6) {
                birdVelocity = -6;
            }  
        }
        birdAngle = "up";
        wooshAudio.currentTime = 0;
        wooshAudio.play();
    }
}

function pause() {
    if (screen === "playing") {
        screen = "paused";
    } else if (screen === "paused") {
        screen = "playing";
        animate();
    }
}