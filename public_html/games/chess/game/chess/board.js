import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from "./pieces.js";
import { initialPieces } from "./initial.js";

class Board {
    constructor() {
        this.board = null;
        this.selectedTile = {row: null, col: null};
        this.move = 0;
        this.lastPawnMove = 0;
        this.lastCapture = 0;
        this.stateBank = this.initializeStateBank();
    }

    initializeStateBank() {
        let stateBank = [];
        setTimeout(() => {
            stateBank.push(_.cloneDeep(this.board));
        }, 10);
        return stateBank;
    }

    //Create board array
    createBlank() {
        let board = [];
        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                row.push(null);
            }
            board.push(row);
        }
        return board;
    }

    //Add pieces to array
    initializeUI() {
        if (document.querySelector('.tile')) {
            return;
        }

        //Initialize tiles
        const div_board = document.querySelector('.board');
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const tile = document.createElement("div");
                tile.classList.add('tile');

                if ((r + c) % 2 === 0 ) {//if even
                    tile.classList.add("tile_light"); //because top right tile must be light
                } else {
                    tile.classList.add("tile_dark");
                }

                div_board.appendChild(tile);
            }
        }
    }

    closeUI() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach((element) => {
            element.remove();
        });
    }

    initializePieces() {
        this.board = this.createBlank();
        initialPieces.forEach(({type, colour, row, col}) => {
            this.spawnPiece(type, colour, row, col);
        });
    }

    //Spawn piece in specified location & save to array
    spawnPiece(type, colour, row, col) {
        let piece = null;
        switch (type) {
            case "pawn":
                piece = new Pawn(colour);
                break;
            case "knight":
                piece = new Knight(colour);
                break;
            case "bishop":
                let boundTileColour = (row * 9 + col) % 2 === 0 ? 'black': 'white';
                piece = new Bishop(colour, boundTileColour);
                break;
            case "rook":
                piece = new Rook(colour);
                break;
            case "queen":
                piece = new Queen(colour);
                break;
            case "king":
                piece = new King(colour);
                break;
            default:
                return;
        }


        this.board[row][col] = piece;
    }

    //Update interface to match data
    updateUI() {
        const all_div_tile = document.querySelectorAll('.tile');
        all_div_tile.forEach((tile) => {
            const classesToRemove = ['piece', 'pawn-white', 'pawn-black', 'knight-white', 'knight-black', 'bishop-white', 'bishop-black', 'rook-white', 'rook-black', 'queen-white', 'queen-black', 'king-white', 'king-black'];
            classesToRemove.forEach((className) => {
                if (tile.classList.contains(className)) {
                    tile.classList.remove(className);
                }
            });
        });
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const tileIndex = r * 8 + c;
                const selectedTile = all_div_tile[tileIndex];
                if (this.board[r][c]) {
                    selectedTile.classList.add("piece");
                    selectedTile.classList.add(`${this.board[r][c].type}-${this.board[r][c].colour}`);
                }
            }
        }
    }

    selectTile(row, col) {
        this.updateTileUI(row, col);
        if (this.board[row][col]) {
            this.selectedTile = {row: row, col: col};
        } else {
            this.selectedTile = {row: null, col: null};
        }
    }

    //Highlight tile and legal moves
    updateTileUI(row, col) {//row and col for selected tile
        const all_div_tile = document.querySelectorAll('.tile');

        //Unhighlight all other tiles
        all_div_tile.forEach((tile) => {
            tile.classList.remove('tile_selected');
            tile.classList.remove('legal_move');
            tile.classList.remove('move_capture');
            tile.classList.remove('move_castle');
            tile.classList.remove('move_en_passant');
        });

        if ((!row || !col) && (row !== 0 && col !== 0)) {
            return;
        }

        const index = row * 8 + col;

        if (this.board[row][col]) {
            //Highlight selected tile
            all_div_tile[index].classList.add('tile_selected');

            //Highlight legal moves
            const legalMoves = this.board[row][col].legalMoves(row, col, this.board);

            legalMoves.forEach((move) => {
                const index = move.row * 8 + move.col;
                let classAdd = '';
                switch (move.type) {
                    case 'move':
                        classAdd = 'legal_move';
                        break;
                    case 'capture':
                        classAdd = 'move_capture';
                        break;
                    case 'castle':
                        classAdd = 'move_castle';
                        break;
                    case 'en_passant':
                        classAdd = 'move_en_passant'
                        break;
                    default:
                        classAdd = 'move_err-def'
                }
                all_div_tile[index].classList.add(classAdd);
            });
        }
    }

    movePiece(og_row, og_col, new_row, new_col) {
        this.board[new_row][new_col] = this.board[og_row][og_col];
        this.board[og_row][og_col] = null;

        this.board[new_row][new_col].hasMoved = true;

        //Reset all en passant eligible properties
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j]) {
                    if (this.board[i][j].type === "pawn") {
                        this.board[i][j].enPassantEligible = false;
                        this.board[i][j].enPassantVictimEligible = false;
                    }
                }
            }
        }

        if (this.board[new_row][new_col].type === 'pawn') {
            //For 50 move rule
            this.lastPawnMove = this.move;

            //For en passant
            if (Math.abs(new_row - og_row) === 2) { //If 2 square movement
                for (let i = 0; i < 2; i++) {
                    const colOffset = i === 0 ? 1: -1;
                    if (this.board[new_row][new_col + colOffset]) {
                        if (this.board[new_row][new_col + colOffset].type === 'pawn') {
                            if (this.board[new_row][new_col + colOffset].colour !== this.board[new_row][new_col].colour) {
                                this.board[new_row][new_col + colOffset].enPassantEligible = true;
                                this.board[new_row][new_col].enPassantVictimEligible = true;
                            }
                        }    
                    }
                }
            }
        }

        this.updateTileUI();
        this.updateUI();
    }

    capturePiece(row, col) {
        this.lastCapture = this.move;
        this.movePiece(this.selectedTile.row, this.selectedTile.col, row, col);
    }

    enPassant(row, col) {
        const colour = this.board[this.selectedTile.row][this.selectedTile.col].colour;
        const offset = colour === 'white' ? 1: -1;

        this.lastCapture = this.move;
        this.board[row + offset][col] = null;

        this.movePiece(this.selectedTile.row, this.selectedTile.col, row, col);
    }    

    castleKing(row, col) {
        this.movePiece(this.selectedTile.row, this.selectedTile.col, row, col);
        if (row === 7 && col === 6) {
            this.movePiece(7, 7, 7, 5);
        }
        if (row === 7 && col === 1) {
            this.movePiece(7, 0, 7, 2);
        }
        if (row === 0 && col === 6) {
            this.movePiece(0, 7, 0, 5);
        }
        if (row === 0 && col === 1) {
            this.movePiece(0, 0, 0, 2);
        }
    }

    checkPawnPromotion(row, col) {
        if (
            this.board[row][col].type === "pawn" &&
            (
                (this.board[row][col].colour === "white" && row === 0) ||
                (this.board[row][col].colour === "black" && row === 7)
            )
        
        ) {
            return true;
        }
    }

    findKing(colour) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j]) {
                    if (this.board[i][j].type === "king" && this.board[i][j].colour === colour) {
                        return {row: i, col: j};
                    }
                }
            }
        }
    }

    isInsufficientMaterial(colour) {
        //Cases:
            //king vs king
            //king and bishop vs. king
            //king and bishop vs. king and bishop (of same colour)

        let allPieces = [];
        let allPieceTypes = [];

        if (colour) { //for draws
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (this.board[i][j]) {
                        if (this.board[i][j].colour === colour || this.board[i][j].type === 'king') {
                            allPieces.push(this.board[i][j]);
                            allPieceTypes.push(this.board[i][j].type)
                        }
                    }
                }
            }
        } else { //for wins
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (this.board[i][j]) {
                        allPieces.push(this.board[i][j]);
                        allPieceTypes.push(this.board[i][j].type)
                    }
                }
            }
        }

        //king vs king
        function case0(allPieces, allPieceTypes) {
            if (allPieces.length === 2 && allPieceTypes.filter(type => type === "king").length === 2) {
                return true;
            }
        }

        //king and bishop vs. king
        function case1(allPieces, allPieceTypes) {
            if (allPieces.length === 3 && allPieceTypes.includes("bishop")) {
                return true;
            } else {
                return false;
            }
        }

        //king and bishop vs. king and bishop (of same colour)
        function case2(allPieces, allPieceTypes) {
            if (allPieces.length === 4 && allPieceTypes.filter(type => type === "king").length === 2 && allPieceTypes.filter(type => type === "bishop").length === 2) {
                const bishops = allPieces.filter(piece => piece.type === "bishop");
                if (bishops[0].boundTileColour === bishops[1].boundTileColour) {
                    return true;
                }
            } else {
                return false;
            }
        }

        if (case0(allPieces, allPieceTypes) || case1(allPieces, allPieceTypes) || case2(allPieces, allPieceTypes)) {
            return true;
        } else {
            return false;
        }
    }

    isStaleMate(kingRow, kingCol) {

        if (!this.board[kingRow][kingCol].isInCheck(kingRow, kingCol, this.board)) {
            if (this.board[kingRow][kingCol].allColourLegalMoves(kingRow, kingCol, this.board).length === 0) {
                return true;
            }
        }

        return false;
    }

    repetition() {
        let identicalBoards = 0;
        this.stateBank.forEach(board => {
            function instanceIdentitcal(currentBoard) {
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (board[row][col] === null || currentBoard[row][col] === null) {
                            if (board[row][col] !== currentBoard[row][col]) {
                                return false;
                            }
                        } else if (board[row][col].type !== currentBoard[row][col].type && board[row][col].colour !== currentBoard[row][col].colour) {
                            return false;
                        }
                    }
                }
                return true;
            }
            
            instanceIdentitcal(this.board) ? identicalBoards++ : undefined;
            
        });
        if (identicalBoards >= 3) {
            return true;
        }

        return false;
    }

}

export {Board};