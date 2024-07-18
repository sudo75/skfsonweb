class Piece {
    constructor(colour) {
        this.colour = colour;
        this.isSelected = false;
        this.hasMoved = false;
    }

    visibleTiles(row, col, board) {
        let visibleTiles = [];

        visibleTiles = visibleTiles.concat(this.visible_H(row, col, board));
        visibleTiles = visibleTiles.concat(this.visible_V(row, col, board));
        visibleTiles = visibleTiles.concat(this.visible_DAsc(row, col, board));
        visibleTiles = visibleTiles.concat(this.visible_DDes(row, col, board));
        
        return visibleTiles;
    }

    capture_H(row, col, board) {
        //Add visible as moves
        let moves = this.visible_H(row, col, board);
        
        //Fix lower and upper bounds - avoid errors where moves are on one side of the piece 
        if (moves.length === 0 || moves[0].col - 1 === col) {
            moves.unshift({row: row, col: col, type: "default"});
        }
        if (moves.length === 0 || moves[moves.length - 1].col + 1 === col) {
            moves.push({row: row, col: col, type: "default"});
        }

        //Compute Lower bound
        if (moves[0].col - 1 >= 0) {
            if (board[row][moves[0].col - 1]) {
                if (board[row][moves[0].col - 1].colour !== board[row][col].colour) {
                    moves.unshift({row: row, col: moves[0].col - 1, type: "capture"});
                }
            }
        }

        //Compute Upper bound
        if (moves[moves.length - 1].col + 1 <= 7) {
            if (board[row][moves[moves.length - 1].col + 1]) {
                if (board[row][moves[moves.length - 1].col + 1].colour !== board[row][col].colour) {
                    moves.push({row: row, col: moves[moves.length - 1].col + 1, type: "capture"});
                }
            }
        }

        for (let i = moves.length - 1; i >= 0; i--) {
            if (!moves[i].type) {
                moves[i].type = "move";
            }
            if (moves[i].type === "default") {
                moves.splice(i, 1);
            }
        }

        return moves;
    }

    capture_V(row, col, board) {
        //Add visible as moves
        let moves = this.visible_V(row, col, board);
        
        //Fix lower and upper bounds - avoid errors where moves are on one side of the piece 
        if (moves.length === 0 || moves[0].row - 1 === row) {
            moves.unshift({row: row, col: col, type: "default"});
        }
        if (moves.length === 0 || moves[moves.length - 1].row + 1 === row) {
            moves.push({row: row, col: col, type: "default"});
        }

        //Compute Lower bound
        if (moves[0].row - 1 >= 0) {
            if (board[moves[0].row - 1][col]) {
                if (board[moves[0].row - 1][col].colour !== board[row][col].colour) {
                    moves.unshift({row: moves[0].row - 1, col: col, type: "capture"});
                }
            }
        }

        //Compute Upper bound
        if (moves[moves.length - 1].row + 1 <= 7) {
            if (board[moves[moves.length - 1].row + 1][col]) {
                if (board[moves[moves.length - 1].row + 1][col].colour !== board[row][col].colour) {
                    moves.push({row: moves[moves.length - 1].row + 1, col: col, type: "capture"});
                }
            }
        }

        for (let i = moves.length - 1; i >= 0; i--) {
            if (!moves[i].type) {
                moves[i].type = "move";
            }
            if (moves[i].type === "default") {
                moves.splice(i, 1);
            }
        }

        return moves;
    }

    capture_DDes(row, col, board) {
        //Add visible as moves
        let moves = this.visible_DDes(row, col, board);

        //Fix lower and upper bounds - avoid errors where moves are on one side of the piece
        if (moves.length === 0 || (moves[0].row - 1 === row && moves[0].col - 1 === col)) {
            moves.unshift({row: row, col: col, type: "default"});
        }
        if (moves.length === 0 || (moves[moves.length - 1].row + 1 === row && moves[moves.length - 1].col + 1 === col)) {
            moves.push({row: row, col: col, type: "default"});
        }

        //Compute Lower bound
        if (moves[0].row - 1 >= 0 && moves[0].col - 1 >= 0) {
            if (board[moves[0].row - 1][moves[0].col - 1]) {
                if (board[moves[0].row - 1][moves[0].col - 1].colour !== board[row][col].colour) {
                    moves.unshift({row: moves[0].row - 1, col: moves[0].col - 1, type: "capture"});
                }
            }
        }

        //Compute Upper bound
        if (moves[moves.length - 1].row + 1 <= 7 && moves[moves.length - 1].col + 1 <= 7) {
            if (board[moves[moves.length - 1].row + 1][moves[moves.length - 1].col + 1]) {
                if (board[moves[moves.length - 1].row + 1][moves[moves.length - 1].col + 1].colour !== board[row][col].colour) {
                    moves.push({row: moves[moves.length - 1].row + 1, col: moves[moves.length - 1].col + 1, type: "capture"});
                }
            }
        }

        for (let i = moves.length - 1; i >= 0; i--) {
            if (!moves[i].type) {
                moves[i].type = "move";
            }
            if (moves[i].type === "default") {
                moves.splice(i, 1);
            }
        }

        return moves;
    }

    capture_DAsc(row, col, board) {
        //Add visible as moves
        let moves = this.visible_DAsc(row, col, board);

        //Note vivible moves are ordered by row

        //Fix lower and upper bounds - avoid errors where moves are on one side of the piece
        if (moves.length === 0 || (moves[0].row - 1 === row && moves[0].col + 1 === col)) {
            moves.unshift({row: row, col: col, type: "default"});
        }
        if (moves.length === 0 || (moves[moves.length - 1].row + 1 === row && moves[moves.length - 1].col - 1 === col)) {
            moves.push({row: row, col: col, type: "default"});
        }

        //Compute Lower bound
        if (moves[moves.length - 1].row + 1 <= 7 && moves[moves.length - 1].col - 1 >= 0) {
            if (board[moves[moves.length - 1].row + 1][moves[moves.length - 1].col - 1]) {
                if (board[moves[moves.length - 1].row + 1][moves[moves.length - 1].col - 1].colour !== board[row][col].colour) {
                    moves.push({row: moves[moves.length - 1].row + 1, col: moves[moves.length - 1].col - 1, type: "capture"});
                }
            }
        }

        //Compute Upper bound
        if (moves[0].row - 1 >= 0 && moves[0].col + 1 <= 7) {
            if (board[moves[0].row - 1][moves[0].col + 1]) {
                if (board[moves[0].row - 1][moves[0].col + 1].colour !== board[row][col].colour) {
                    moves.unshift({row: moves[0].row - 1, col: moves[0].col + 1, type: "capture"});
                }
            }
        }

        for (let i = moves.length - 1; i >= 0; i--) {
            if (!moves[i].type) {
                moves[i].type = "move";
            }
            if (moves[i].type === "default") {
                moves.splice(i, 1);
            }
        }

        return moves;
    }

    visible_H(row, col, board) {
        let visibleTiles = [];
        //Columns with a greater index
        for (let i = 1; col + i < 8; i++) {
            if (board[row][col + i]) {
                //visibleTiles.push({row: row, col: col + i, type: "capture"});
                i = 8;
                break;
            }
            visibleTiles.push({row: row, col: col + i});
        }
        //Columns with a lesser index
        for (let i = 1; col - i >= 0; i++) {
            if (board[row][col - i]) {
                //visibleTiles.push({row: row, col: col - i, type: "capture"});
                i = 0;
                break;
            }
            visibleTiles.push({row: row, col: col - i});
        }
        //Sort
        visibleTiles.sort((a, b) => a.col - b.col);
        
        return visibleTiles;
    }

    visible_V(row, col, board) {
        let visibleTiles = [];
        //Rows with a greater index
        for (let i = 1; row + i < 8; i++) {
            if (board[row + i][col]) {
                //visibleTiles.push({row: row + i, col: col, type: "capture"});
                i = 8;
                break;
            }
            visibleTiles.push({row: row + i, col: col});
        }
        //Rows with a lesser index
        for (let i = 1; row - i >= 0; i++) {
            if (board[row - i][col]) {
                //visibleTiles.push({row: row - i, col: col, type: "capture"});
                i = 0;
                break;
            }
            visibleTiles.push({row: row - i, col: col});
        }
        //Sort
        visibleTiles.sort((a, b) => a.row - b.row);

        return visibleTiles;
    }

    visible_DAsc(row, col, board) {
        let visibleTiles = [];
        //Lower
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            if (board[row + i][col - i]) {
                i = 20;
                break;
            }
            visibleTiles.push({row: row + i, col: col - i});
        }
        //Upper
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            if (board[row - i][col + i]) {
                i = 20;
                break;
            }
            visibleTiles.push({row: row - i, col: col + i});
        }
        //Sort
        visibleTiles.sort((a, b) => a.row - b.row);

        return visibleTiles;
    }

    visible_DDes(row, col, board) {
        let visibleTiles = [];
        //Lower
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
            if (board[row + i][col + i]) {
                i = 8;
                break;
            }
            visibleTiles.push({row: row + i, col: col + i});
        }
        //Upper
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            if (board[row - i][col - i]) {
                i = 0;
                break;
            }
            visibleTiles.push({row: row - i, col: col - i});
        }

        //Sort
        visibleTiles.sort((a, b) => a.row - b.row);
        
        return visibleTiles;
    }

    //For pawn captures
    filterInvisibleTiles(legalMoves, row, col, board) {
        const visibleTiles = this.visibleTiles(row, col, board);
        let _legalMoves = [];
        for (let i = 0; i < legalMoves.length; i++) {
            for (let j = 0; j < visibleTiles.length; j++) {
                if (legalMoves[i].row === visibleTiles[j].row && legalMoves[i].col === visibleTiles[j].col) {
                    _legalMoves.push(legalMoves[i]);
                }
            }   
            
        }

        return _legalMoves;
    }

    //Some of the worst code in the game
    filterIllegalMoves(legalMoves, row, col, board, kingPos) {
        //Check inducing moves
        for (let i = legalMoves.length - 1; i >= 0; i--) {

            let vKingPos = _.cloneDeep(kingPos);
            let vBoard = _.cloneDeep(board);

            vBoard[legalMoves[i].row][legalMoves[i].col] = vBoard[row][col];
            vBoard[row][col] = null;

            //If king is moving
            if (row === vKingPos.row && col === vKingPos.col) {
                vKingPos = {
                    row: legalMoves[i].row,
                    col: legalMoves[i].col
                };
            }

            if (vBoard[vKingPos.row][vKingPos.col].isInCheck(vKingPos.row, vKingPos.col, vBoard)) {
                legalMoves.splice(i, 1);
            }
        }

        //Castling while in check
        for (let i = legalMoves.length - 1; i >= 0; i--) {
            if (legalMoves[i].type === "castle") {
                if (board[kingPos.row][kingPos.col].isInCheck(kingPos.row, kingPos.col, board)) {
                    legalMoves.splice(i, 1);
                }
            }
        }

        return legalMoves
    }

    legalMoves(row, col, board) {
        let legalMoves = this.potentialLegalMoves(row, col, board);

        function findKing(colour, board) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (board[i][j]) {
                        if (board[i][j].type === "king" && board[i][j].colour === colour) {
                            return {row: i, col: j};
                        }
                    }
                }
            }
        }

        const kingPos = findKing(board[row][col].colour, board);
                
        legalMoves = this.filterIllegalMoves(legalMoves, row, col, board, kingPos);

        return legalMoves;
    }

    allColourLegalMoves(row, col, board) {
        const colour = board[row][col].colour;

        const allPlayerPieces = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j]) {
                    if (board[i][j].colour === colour) {
                        allPlayerPieces.push({row: i, col: j});
                    }
                }
            }   
        }
        let allLegalMoves = [];
        allPlayerPieces.forEach((piece) => {
            allLegalMoves = allLegalMoves.concat(board[piece.row][piece.col].legalMoves(piece.row, piece.col, board));
        });

        return allLegalMoves;
    }
}

//Piece Classes

class Pawn extends Piece {
    constructor(colour) {
        super(colour);
        this.type = "pawn";
        this.enPassantEligible = false;
        this.enPassantVictimEligible = false;
    }

    potentialLegalMoves(row, col, board) {
        let legalMoves = [];
        //logic

        {//Move forward 1 or 2
            const rowOffset = this.colour === "white" ? -1: 1;
            let _legalMoves = [];

                _legalMoves.push({row: row + rowOffset, col: col, type: "move"});
            if (this.hasMoved === false) {
                _legalMoves.push({row: row + rowOffset * 2, col: col, type: "move"});
            }
        
            _legalMoves = this.filterInvisibleTiles(_legalMoves, row, col, board);

            legalMoves = legalMoves.concat(_legalMoves);
        }
        
        {//Add capture moves
            let _legalCaptures = [];
            const rowOffset = this.colour === "white" ? -1: 1;

                _legalCaptures = [
                    {row: row + rowOffset, col: col - 1, type: "capture"},
                    {row: row + rowOffset, col: col + 1, type: "capture"}
                ];

                for (let i = _legalCaptures.length - 1; i >= 0; i--) {
                    const move = _legalCaptures[i];
                    if (_legalCaptures[i].row < 0 || _legalCaptures[i].row > 7) {
                        _legalCaptures.splice(i, 1);
                    } else if (!board[move.row][move.col]) {
                        _legalCaptures.splice(i, 1);
                    } else if (board[row][col].colour === board[move.row][move.col].colour) {
                        _legalCaptures.splice(i, 1);
                    }
                }
            legalMoves = legalMoves.concat(_legalCaptures);
        }

        {//En passant
            if (this.enPassantEligible) {
                for (let i = 0; i < 2; i++) {
                    const colOffset = i === 0 ? 1: -1;
                    if (board[row][col + colOffset]) {
                        if (board[row][col + colOffset].type === 'pawn') {
                            if (board[row][col + colOffset].enPassantVictimEligible) {
                                const rowOffset = board[row][col + colOffset].colour === 'white' ? 1: -1;
                                legalMoves = legalMoves.concat({row: row + rowOffset, col: col + colOffset, type: "en_passant"});
                            }
                        }    
                    }
                }
            }
        }

        return legalMoves;
    }
}

class Knight extends Piece {
    constructor(colour) {
        super(colour);
        this.type = "knight";
    }
    potentialLegalMoves(row, col, board) {
        let legalMoves = [];

        //Top right
        legalMoves.push({row: row - 2, col: col + 1});
        legalMoves.push({row: row - 1, col: col + 2});
        //Bottom right
        legalMoves.push({row: row + 1, col: col + 2});
        legalMoves.push({row: row + 2, col: col + 1});
        //Bottom left
        legalMoves.push({row: row + 2, col: col - 1});
        legalMoves.push({row: row + 1, col: col - 2});
        //Top left
        legalMoves.push({row: row - 1, col: col - 2});
        legalMoves.push({row: row - 2, col: col - 1});

        //Typing
        for (let i = legalMoves.length - 1; i >= 0; i--) {
            if (legalMoves[i].row > 7 || legalMoves[i].col > 7 || legalMoves[i].row < 0 || legalMoves[i].col < 0) { //if move is not on board
                legalMoves.splice(i, 1);
            } else if (board[legalMoves[i].row][legalMoves[i].col]) { //if tile is occupied
                if (board[legalMoves[i].row][legalMoves[i].col].colour !== board[row][col].colour) { //if tile is not of the same colour
                    legalMoves[i].type = "capture";
                } else {
                    legalMoves.splice(i, 1);
                }
            } else {//if move is not a capture
                legalMoves[i].type = "move";
            }
        }

        return legalMoves;
    }
}

class Bishop extends Piece {
    constructor(colour, boundTileColour) {
        super(colour);
        this.type = "bishop";
        this.boundTileColour = boundTileColour;
    }
    potentialLegalMoves(row, col, board) {
        let legalMoves = this.capture_DAsc(row, col, board);
        legalMoves = legalMoves.concat(this.capture_DDes(row, col, board));

        return legalMoves;
    }
}

class Rook extends Piece {
    constructor(colour) {
        super(colour);
        this.type = "rook";
    }
    potentialLegalMoves(row, col, board) {
        let legalMoves = this.capture_V(row, col, board);
        legalMoves = legalMoves.concat(this.capture_H(row, col, board));

        return legalMoves;
    }
}

class Queen extends Piece {
    constructor(colour) {
        super(colour);
        this.type = "queen";
    }
    potentialLegalMoves(row, col, board) {
        let legalMoves = this.capture_H(row, col, board);
        legalMoves = legalMoves.concat(this.capture_V(row, col, board));
        legalMoves = legalMoves.concat(this.capture_DAsc(row, col, board));
        legalMoves = legalMoves.concat(this.capture_DDes(row, col, board));

        return legalMoves;
    }
}

class King extends Piece {
    constructor(colour) {
        super(colour);
        this.type = "king";
    }
    potentialLegalMoves(row, col, board) {
        let legalMoves = [];
        
        legalMoves.push({row: row - 1, col: col});
        legalMoves.push({row: row - 1, col: col + 1});

        legalMoves.push({row: row, col: col + 1});
        legalMoves.push({row: row + 1, col: col + 1});

        legalMoves.push({row: row + 1, col: col});
        legalMoves.push({row: row + 1, col: col - 1});

        legalMoves.push({row: row, col: col - 1});
        legalMoves.push({row: row - 1, col: col - 1});

        {//Castling
            if (!board[row][col].hasMoved) {
                const colour = board[row][col].colour
                const rowSet = colour === 'white' ? 7: 0;


                //Short castle
                if ((row === rowSet && col === 4) && board[rowSet][7] && board[rowSet][5] === null && board[rowSet][6] === null) {
                    if (board[rowSet][7].type === 'rook' && board[rowSet][7].colour === colour) {
                        legalMoves.push({row: row, col: 6, type: "castle"});
                    }
                }

                //Long castle
                if ((row === rowSet && col === 4) && board[rowSet][0] && board[rowSet][1] === null && board[rowSet][2] === null && board[rowSet][3] === null) {
                    if (board[rowSet][0].type === 'rook' && board[rowSet][0].colour === colour) {
                        legalMoves.push({row: row, col: 1, type: "castle"});
                    }
                }
            }
        }

        for (let i = legalMoves.length - 1; i >= 0; i--) {
            const _row = legalMoves[i].row;
            const _col = legalMoves[i].col;

            if (_row > 7 || _row < 0 || _col > 7 || _col < 0) {
                legalMoves.splice(i, 1);
            } else if (board[_row][_col] !== null) {
                if (board[_row][_col].colour !== board[row][col].colour) {
                    if (legalMoves[i].type == undefined) {
                        legalMoves[i].type = "capture";
                    }
                } else {
                    legalMoves.splice(i, 1);
                }
            } else {
                if (legalMoves[i].type == undefined) {
                    legalMoves[i].type = "move";
                }
            }
        }

        return legalMoves;
    }

    isInCheck(row, col, board) {
        const colour = board[row][col].colour;
        let opposingPieces = [];

        let inCheck = false;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j]) {
                    if (board[i][j].colour !== colour) {
                        opposingPieces.push({row: i, col: j});
                    }
                }
            }   
        }

        opposingPieces.forEach((piece) => {
            const legalMoves = board[piece.row][piece.col].potentialLegalMoves(piece.row, piece.col, board);
            legalMoves.forEach((move) => {
                if (row === move.row && col === move.col) {
                    inCheck = true;
                }
            });
        });

        return inCheck;
    }

    isInCheckMate(row, col, board) {
        const allLegalMoves = this.allColourLegalMoves(row, col, board);
        return allLegalMoves.length === 0 ? true: false;
    }
}

export {Piece, Pawn, Knight, Bishop, Rook, Queen, King};