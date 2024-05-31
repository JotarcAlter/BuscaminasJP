import { Casilla } from "../models/Cell";


export class CasillaService{

    buildBoard(rows: number, columns: number, numberOfMines: number) : Casilla[][]{

        let board: Casilla[][] = []
        for(let i = 0; i < rows; i++){
            let rows: Casilla[] = [];
            for(let j = 0; j < columns; j++){
              let element: Casilla = {status: 'toOpen', mine: false, mineProximity: 0, contenido: "0"};
              rows.push(element);
            }
            board.push(rows);
        }


        this.putMines(numberOfMines, board, rows, columns);
        this.GetMineProximity(board, rows, columns);

        return board;
    }


    putMines(numberOfMines: number, board: Casilla[][], rows: number, columns: number) : Casilla[][]{
        let set = new Set<([number, number])>;
        let i: number = 0;

        while(i < numberOfMines){
            let pairs: [number, number] = [Math.floor(Math.random() * (rows)), Math.floor(Math.random() * (columns))];

            if(!set.has(pairs) && !board[pairs[0]][pairs[1]].mine){
                set.add(pairs);
                board[pairs[0]][pairs[1]].mine = true;
                i++;
            }
        }

        return board;
    }


    GetMineProximity(board: Casilla[][], rows: number, columns: number) : Casilla[][]{
        
        const CASILLAS_ADYACENTES: number[][] = [
                                    [1, 1],
                                    [-1, -1],
                                    [-1, 1],
                                    [1, -1],
                                    [1, 0],
                                    [-1, 0],
                                    [0, 1],
                                    [0, -1]
        ];

        
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < columns; j++){
                let mines: number = 0;
                for(const pair of CASILLAS_ADYACENTES){
                    if(!this.isValid(i + pair[0], j + pair[1], rows, columns)){
                        continue;
                    }
                    
                    if(board[i + pair[0]][ j + pair[1]].mine){
                        mines++;
                    }
                }

                board[i][j].mineProximity = mines;
            }
        }

        return board;

    }


    gameOver(board: Casilla[][]){
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                if(board[i][j].mine){
                    board[i][j].status = 'mine';
                }
            }
        }
    }


    changeDifficulty(difficulty: string) : [number, number, number]{

        let rows, columns = 5;
        let numberOfMines = 1;
        if(difficulty == "Alevin"){
            rows = columns = 8;
            numberOfMines = 10;
        }
        else if(difficulty == "Cadete"){
            rows = columns = 13;
            numberOfMines = 20;
        }
        else if(difficulty == "Professional"){
            rows = columns = 15;
            numberOfMines = 40;
        }
        else{
            rows = columns = 15;
            numberOfMines = 90;
        }


        return [rows, columns, numberOfMines];
    }


    getDifficultys() : string[]
    {
        return ["Alevin", "Cadete", "Professional", "Estrella"];
    }

   checkCasilla(board: Casilla[][], row: number, column: number, CasillasGame: any, numberOfMines: number) {
        
       if(board[row][column].mine){
           board[row][column].status = 'mine';
           this.gameOver(board);
           console.log("Perdiste")
       }
       else if((CasillasGame.CasillasOpened) >= (CasillasGame.Casillas - CasillasGame.numberMines)){
            console.log("Ganaste")
       }

    }


    isValid(i: number, j: number, rows: number, columns: number) : boolean{
        if((i < 0 || j < 0) || (i >= rows || j >= columns)){
            return false;
        }

        return true;
    }

    openCasilla(board: Casilla[][],row: number, column: number, rows: number, columns: number, CasillasGame: any, PnumberOfFlags: any) : void {
        if(!this.isValid(row, column, rows, columns) || board[row][column].status == 'open' || board[row][column].mine){
            return;
        }
        else if(board[row][column].mineProximity != 0){
            if(board[row][column].status == 'flag'){
                PnumberOfFlags.flags += 1;
            }
            board[row][column].status = 'open';
            CasillasGame.CasillasOpened += 1;
        }
        else if(board[row][column].mineProximity == 0){
    
            if(board[row][column].status == 'flag'){
                PnumberOfFlags.flags += 1;
            }
            board[row][column].status = 'open';
            CasillasGame.CasillasOpened += 1;
            this.openCasilla(board, row + 1, column, rows, columns, CasillasGame, PnumberOfFlags);
            this.openCasilla(board, row - 1, column, rows, columns, CasillasGame, PnumberOfFlags);
            this.openCasilla(board, row, column + 1, rows, columns, CasillasGame, PnumberOfFlags);
            this.openCasilla(board, row, column - 1, rows, columns, CasillasGame, PnumberOfFlags);

            this.openCasilla(board, row + 1, column + 1, rows, columns, CasillasGame, PnumberOfFlags);
            this.openCasilla(board, row - 1, column - 1, rows, columns, CasillasGame, PnumberOfFlags);
            this.openCasilla(board, row - 1, column + 1, rows, columns, CasillasGame, PnumberOfFlags);
            this.openCasilla(board, row + 1, column - 1, rows, columns, CasillasGame, PnumberOfFlags);
        }
    }

    flag(Casilla: Casilla) : void{
        if(Casilla.status == 'toOpen'){
            Casilla.status = 'flag';
        }
        else if(Casilla.status == 'flag'){
            Casilla.status = 'toOpen';
        }
    }


    


    
}