import {Board} from './chess/board.js';

class Game {
    constructor() {
        this.turn = 'white';
        this.state = 'unloaded';
        this.menuOpen = false;
        this.time = {timed: false, white: null, black: null, start: null, last: {white: null, black: null}};
    }

    start(timeSet) {
        board = new Board();
        this.turn = 'white';
        this.time = {timed: false, white: null, black: null, start: null, last: {white: null, black: null}};

        board.initializeUI();
        board.initializePieces();

        board.updateUI();
        this.state = 'playing';

        if (timeSet === 0) {
            this.time.timed = false;
        } else {
            this.time.timed = true;
        }
        this.initializeTimer(timeSet, this.time.timed);

        this.updateSidebar();
    }

    calcTime(colour) {
        if (!this.time.last[colour] || this.turn !== colour) {
            return this.time[colour];
        }
        const elapsedTime = Math.floor(Date.now() - this.time.last[colour]);

        return this.time[colour] - elapsedTime;
    }

    initializeTimer(timeSet, timed) {
        this.time = {timed: timed, white: timeSet * 1000, black: timeSet * 1000, start: Date.now(), last: {white: Date.now(), black: null}};
        const interval_timeUI = setInterval(() => {

            const div_time_white = document.querySelector('.time_white');
            const div_time_black = document.querySelector('.time_black');

            if (timeSet === 0) {
                div_time_white.innerText = "Untimed";
                div_time_black.innerText = "Untimed";
                clearInterval(interval_timeUI);
                return;
            }
            if (this.state !== 'playing') {
                div_time_white.innerText = "Untimed";
                div_time_black.innerText = "Untimed";
                clearInterval(interval_timeUI);
                return;
            }
            
            let time_white = this.calcTime('white');
            let time_black = this.calcTime('black');

            if (time_white <= 10) {
                div_time_white.innerText = "00:00.000";
                if (board.isInsufficientMaterial('black')) {
                    this.end('Draw By White Time');
                } else {
                    this.end('Win By Time: Black');
                }
                clearInterval(interval_timeUI);
                return;
            } else if (time_black <= 10) {
                if (board.isInsufficientMaterial('white')) {
                    this.end('Draw By Black Time');
                } else {
                    this.end('Win By Time: White');
                }

                div_time_black.innerText = "00:00.000";
                clearInterval(interval_timeUI);
                return;
            }
            
            function getTime(time) {
                let min = JSON.stringify(Math.floor(time / 60000));
                let sec = JSON.stringify(Math.floor(time / 1000) - min * 60);
                let mil = JSON.stringify(time - min * 60000 - sec * 1000);

                min = min.length === 1 ? '0' + min: min;
                sec = sec.length === 1 ? '0' + sec: sec;
                while (mil.length < 3) {
                    mil = '0' + mil;
                }
                
                if (time <= 60000) {
                    return `${min}:${sec}.${mil}`;
                } else {
                    return `${min}:${sec}`;
                }
            }

            time_white = getTime(time_white);
            time_black = getTime(time_black);
            
            div_time_white.innerText = time_white;
            div_time_black.innerText = time_black;
        }, 100);
    }

    elapseTime(colour) {
        this.time[colour] = this.calcTime(colour);
    }

    startPlayerTime(colour) {
        this.time.last[colour] = Date.now();
    }

    end(result) {
        this.createOverlay();
        this.setHeadingText(`${result}`);
        this.state = 'ended';

        const btn_resign = document.querySelector('.resign');
        btn_resign.classList.add('btn_unavailable');
        const btn_draw = document.querySelector('.draw');
        btn_draw.classList.add('btn_unavailable');

        const btn_newGame = document.querySelector('.newGame');
        btn_newGame.classList.remove('btn_unavailable');
    }

    endTurn() {
        if (this.time.timed) {
            this.elapseTime(this.turn);
        }
        board.move++;
        board.stateBank.push(_.cloneDeep(board.board));
        this.updateSidebar();

        this.newTurn();
    }

    updateSidebar() {
        //Set material value
        function calcMatVal(colour) {
            let matVal = 0;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (board.board[i][j]) {
                        if (board.board[i][j].colour === colour) {
                            switch (board.board[i][j].type) {
                                case 'queen':
                                    matVal += 9;
                                    break;
                                case 'rook':
                                    matVal += 5;
                                    break;
                                case 'bishop':
                                    matVal += 3;
                                    break;
                                case 'knight':
                                    matVal += 3;
                                    break;
                                case 'pawn':
                                    matVal += 1;
                                    break;
                            }
                        }
                    }
                }
            }

            return matVal;
        }

        const div_matVal_white = document.querySelector('.stat_matVal_white');
        div_matVal_white.innerText = calcMatVal('white');

        const div_matVal_black = document.querySelector('.stat_matVal_black');
        div_matVal_black.innerText = calcMatVal('black');

        //Set Avg. turn length



    }

    checkForRepetition() {

    }

    newTurn() {
        this.turn = this.turn === 'white' ? 'black': 'white';

        this.startPlayerTime(this.turn);

        let text;
        if (this.turn === 'white') {
            text = "Turn: White";
        } else {
            text = "Turn: Black";
        }
        this.setHeadingText(text);

        //Find king
        let kingPos = board.findKing(this.turn);

        //Add check styling
        const all_div_tile = document.querySelectorAll('.tile');
        all_div_tile.forEach((tile) => {
            tile.classList.remove('check');
        });

        if (board.board[kingPos.row][kingPos.col].isInCheck(kingPos.row, kingPos.col, board.board)) {
            const index = kingPos.row * 8 + kingPos.col;
            all_div_tile[index].classList.add('tile_selected');

            all_div_tile[index].classList.add('check');
        }

        //Check for mate
        if (board.board[kingPos.row][kingPos.col].isInCheckMate(kingPos.row, kingPos.col, board.board)) {
            this.end(`Win By Checkmate: ${this.turn === 'white' ? 'Black': 'White'}`);
        }

        if (board.isInsufficientMaterial()) {
            this.end('Draw: Insufficient Material');
        }

        if (board.isStaleMate(kingPos.row, kingPos.col)) {
            this.end('Draw: Stalemate');
        }

        if (board.repetition()) {
            this.end('Draw: Threefold Repetition');
        }

        if (board.move - Math.max(board.lastPawnMove, board.lastCapture) >= 50) {
            this.end('50+ Moves');  //Technical rule adj.
        }
    }

    setHeadingText(text) {
        const heading_txt = document.querySelector('.heading_txt');
        heading_txt.innerText = text;
    }

    handleClick(event) {
        const p0 = performance.now(); //DEBUG

        const target = event.target;
        const all_div_tile = document.querySelectorAll('.tile');
        const tileIndex = Array.from(all_div_tile).indexOf(target);

        const col = tileIndex % 8;
        const row = (tileIndex - col) / 8;

        switch (true) {
            case target.classList.contains('legal_move'):
                board.movePiece(board.selectedTile.row, board.selectedTile.col, row, col);
                if (board.checkPawnPromotion(row, col)) {
                    this.openPromotionMenu(event.clientX, event.clientY);
                    board.selectedTile = {row: row, col: col};
                }
                this.endTurn();
                break;

            case target.classList.contains('move_capture'):
                board.capturePiece(row, col);
                if (board.checkPawnPromotion(row, col)) {
                    this.openPromotionMenu(event.clientX, event.clientY);
                    board.selectedTile = {row: row, col: col};
                }
                this.endTurn();
                break;

            case target.classList.contains('move_castle'):
                board.castleKing(row, col);
                this.endTurn();
                break;

            case target.classList.contains('move_en_passant'):
                board.enPassant(row, col);
                this.endTurn();
                break;

            case target.classList.contains('tile'):
                if (board.board[row][col]) {
                    if (board.board[row][col].colour !== this.turn) {
                        break;
                    }
                }
                board.selectTile(row, col);
                break;

            case target.classList.contains('btn_unavailable'):
                break;

            case target.classList.contains('resign'):
                this.resign();
                break;

            case target.classList.contains('draw'):
                this.requestDraw();
                break;

            case target.classList.contains('newGame'):
                this.openStartMenu();
                break;
        }
        
        const p1 = performance.now(); //DEBUG
        console.log(`Performance debugger: ${(p1 - p0).toFixed(2)} ms - ideal is under 5 ms`);
    }

    openPromotionMenu(x, y) {
        this.menuOpen = true;

        let menu = document.createElement('div');
        menu.classList.add('menu');
        menu.classList.add('menu_promotion');

        let head = document.createElement('div');
        head.classList.add('menu_head');
        head.innerText = "Promote:";
        head.style.height = "40px";

        menu.appendChild(head);

        let options = ["knight", "bishop", "rook", "queen"];
        const width = 100;
        const height = options.length * 40 + 40; // Add 40 for head

        options.forEach((option) => {
            const element = document.createElement('button');
            element.classList.add('btn', 'menu_option');
            element.innerText = option;

            element.addEventListener('click', () => {
                this.promotePawn(element.innerText);
                this.closeMenu();
            });

            menu.appendChild(element);
        });

        menu.style.height = `${height}px`;
        menu.style.width = `${width}px`;
        
        const menuPos = menuPosition(x, y, width, height);
        
        menu.style.left = `${menuPos.x}px`;
        menu.style.top = `${menuPos.y}px`;

        const board = document.querySelector('.board');
        board.appendChild(menu);
        this.createOverlay();

        function menuPosition(og_x, og_y, width, height) {
            let newPos = {x: og_x, y: og_y};
            if (window.innerWidth <= og_x + width) {
                newPos.x -= width;
            }
            if (window.innerHeight <= og_y + height) {
                newPos.y -= height;
            }
            return newPos;
        }
    }

    createOverlay() {
        const board = document.querySelector('.board');

        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.style.display = "block";
        overlay.style.width = board.offsetWidth + "px";
        overlay.style.height = board.offsetHeight + "px";
        overlay.style.top = board.offsetTop + "px";
        overlay.style.left = board.offsetLeft + "px";

        board.appendChild(overlay);
    }

    closeMenu() {
        this.menuOpen = false;

        const menu = document.querySelector('.menu');
        if (menu) {
            menu.remove();
        }

        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    promotePawn(type) {
        board.spawnPiece(type, board.board[board.selectedTile.row][board.selectedTile.col].colour, board.selectedTile.row, board.selectedTile.col);
        board.updateUI();
    }

    openStartMenu() {
        if (!this.menuOpen) {
            this.menuOpen = true;
        const board = document.querySelector('.board');

        let menu = document.createElement('div');
        menu.classList.add('menu');
        menu.classList.add('menu_start');
        menu.style.width = "200px";
    
        let head = document.createElement('div');
        head.classList.add('menu_head');
        head.innerText = "New Game";
        head.style.height = "40px";

        const time = document.createElement('button');
        time.classList.add('btn', 'menu_option');
        time.innerText = "10 min";
        let timeSet = 600;
        time.addEventListener('click', () => {
            timeSet = changeTime(timeSet);
            if (timeSet === 0) {
                time.innerText = "Untimed";
            } else {
                time.innerText = `${timeSet / 60} min`;
            }
        });

        function changeTime(timeSet) {
            switch (timeSet) {
                case 0:
                    return 60;
                case 60:
                    return 120;
                case 120:
                    return 180;
                case 180:
                    return 240;
                case 240:
                    return 300;
                case 300:
                    return 600;
                case 600:
                    return 900;
                case 900:
                    return 1200;
                case 1200:
                    return 1800;
                case 1800:
                    return 0;
            }
        }

        const line = document.createElement('hr');
        line.style.width = "90%"

        const start = document.createElement('button');
        start.classList.add('btn', 'menu_option');
        start.innerText = "Start Game!";
        start.addEventListener('click', () => {
            this.showLoading(timeSet);
        });
        
        menu.style.left = board.offsetWidth;
        menu.style.top = board.offsetHeight;
    
        menu.appendChild(head);
        menu.appendChild(time);
        menu.appendChild(line);
        menu.appendChild(start);

        board.appendChild(menu);
        }
    }

    showLoading(timeSet) {
        this.closeMenu();
        board.closeUI();

        const btn_resign = document.querySelector('.resign');
        btn_resign.classList.remove('btn_unavailable');
        const btn_draw = document.querySelector('.draw');
        btn_draw.classList.remove('btn_unavailable');

        const btn_newGame = document.querySelector('.newGame');
        btn_newGame.classList.add('btn_unavailable');

        this.createOverlay();
        let time = 0;
        let dots = 1;
        
        const tasks = [
            "Loading game logic",
            "Loading pawn code",
            "Loading knight code",
            "Loading bishop code",
            "Loading rook code",
            "Loading queen code",
            "Loading king code",
            "Loading game data"
        ];

        const loadingDisplay = setInterval(() => {
            let text = '';
            if (time < 0) {
                text = '';
            } else if (time < 400) {
                text = tasks[0];
            } else if (time < 0) {
                text = tasks[1];
            } else if (time < 0) {
                text = tasks[2];
            } else if (time < 0) {
                text = tasks[3];
            } else if (time < 0) {
                text = tasks[4];
            } else if (time < 0) {
                text = tasks[5];
            } else if (time < 0) {
                text = tasks[6];
            } else if (time < 0) {
                text = tasks[7];
            } else if (time < 0) {
                text = '';
            } else if (time >= 400) {
                clearInterval(loadingDisplay);
                this.setHeadingText('Turn: White');
                this.start(timeSet);
                this.closeMenu();
                return;
            }

            if (time % 250 === 0) {
                dots = (dots % 3) + 1;
            }

            let dotText = "";
            for (let i = 0; i < dots; i++) {
                dotText += '.';
            }

            text += dotText;
            this.setHeadingText(text);

            time += 20;
        }, 20);
    }

    openRequestMenu(heading_txt, body_txt, onAccept) {
        this.menuOpen = true;
        const board = document.querySelector('.board');

        let menu = document.createElement('div');
        menu.classList.add('menu');
        menu.classList.add('menu_info');
    
        let head = document.createElement('div');
        head.classList.add('menu_head');
        head.innerText = heading_txt;
        head.style.height = "40px";

        let body = document.createElement('div');
        body.classList.add('menu_body');
        body.innerText = body_txt;

        let accept = document.createElement('button');
        accept.classList.add('btn', 'menu_option');
        accept.innerText = "Accept";
        accept.addEventListener('click', () => {
            onAccept();
        });

        let decline = document.createElement('button');
        decline.classList.add('btn', 'menu_option');
        decline.innerText = "Decline";
        decline.addEventListener('click', () => {
            this.closeMenu();
        });
        
        menu.style.left = board.offsetWidth;
        menu.style.top = board.offsetHeight;
    
        menu.appendChild(head);
        menu.appendChild(body);
        menu.appendChild(accept);
        menu.appendChild(decline);

        board.appendChild(menu);
    }

    requestDraw() {
        if (!this.menuOpen) {
            this.createOverlay();
            this.openRequestMenu(
                `${this.turn === 'white' ? 'Black': 'White'}, Draw?`,
                `Take ${this.turn}'s draw offer?`,
                () => {
                    this.closeMenu();
                    this.end('Draw: Agreed');
                }
            );
        }
    }

    resign() {
        if (!this.menuOpen) {
            if (confirm(`Are you (${game.turn}) sure you want to resign?`)) {
                this.end(`Win by resignation: ${this.turn === 'white' ? 'Black': 'White'}`);
            }
        }
    }
}

//Runtime
let game = new Game();
let board = new Board();

gameLoop();
function gameLoop() {
    //Allow input
    document.addEventListener('click', (event) => {
        game.handleClick(event);
    });
}