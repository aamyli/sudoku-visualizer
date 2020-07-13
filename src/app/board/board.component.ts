import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit {
  board:number[][];
  sudokuHTMLElement:HTMLElement;
  numSet:number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  speed:number = 35;
  constructor() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
   }

  ngOnInit(): void {
    this.sudokuHTMLElement= document.getElementById('sudoku-board');
    this.renderSudoku();
    //this.shuffle(this.numSet);
  }

  clear() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.board[i][j] == 0;
        this.renderCell(`cell-${i}-${j}`, '');
      }
    }
  }

  renderSudoku() {
    // Remove all children of the sudokuHTMLElement
    while (this.sudokuHTMLElement.firstChild) {
        this.sudokuHTMLElement.removeChild(this.sudokuHTMLElement.firstChild);
    }
    for (let i = 0; i < 9; i++) {
        let sudokuRow = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            let sudokuCell = document.createElement('td');
            let num = this.board[i][j];
            sudokuCell.id = `cell-${i}-${j}`;

            if (num !== 0) {
                sudokuCell.textContent = num.toString();
                // sudokuCell.classList.add('given-num');
            }
            // else {
            //     sudokuCell.classList.add('discovered-num');
            // }

            if (i === 2 || i === 5) {
                sudokuCell.classList.add('box-boundary-row');
            }
            if (j === 2 || j === 5) {
                sudokuCell.classList.add('box-boundary-col');
            }

            sudokuRow.appendChild(sudokuCell);
        }
        this.sudokuHTMLElement.appendChild(sudokuRow);
    }
}

  renderCell(cellId, value) {
    let cell = document.getElementById(cellId);
    cell.classList.add('given-num');
    cell.textContent = value;
  }

  renderSolveCell(cellId, value) {
    let cell = document.getElementById(cellId);
    cell.classList.add('discovered-num');
    cell.textContent = value;
  }


  async fillBoard() {
    var row:number, col:number;
      var isEmpty = true;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (this.board[i][j] == 0) {
            row = i;
            col = j;
            isEmpty = false;
            break;
          }
        }
        if (!isEmpty) {
          break;
        }
      }
      if (isEmpty) {
        return true;
      }
      this.numSet = this.shuffle(this.numSet);
      for (var x in this.numSet) {
        if (this.verifySolution(this.numSet[x], row, col)) {
          this.board[row][col] = this.numSet[x];
          this.renderCell(`cell-${row}-${col}`, this.numSet[x]);
          await UtilFuncs.sleep(this.speed);

          if (await this.fillBoard()) {
            return true;
          } else {
            this.board[row][col] = 0;
            this.renderCell(`cell-${row}-${col}`, '');
          }
        }
      }
      return false;
    }

    shuffle(a:number[]) {
      var j:number, x:number, i:number;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    }

    verifySolution(num:number, i:number, j:number) {
      for (let p = 0; p < 9; p++) {
        if (this.board[i][p] == num) {
          return false;
        }
        if (this.board[p][j] == num) {
          return false;
        }
      }

      let k = this.quadrant(i);
      let l = this.quadrant(j);
      let kLim = k + 3;
      let lLim = l + 3;
      for (let c = k; c < kLim; c++) {
        for (let d = l; d < lLim; d++) {
          if (this.board[c][d] == num) {
            return false;
          }
        }
      }
      return true;
    }

    quadrant(i:number) {
      return Math.floor(i / 3) * 3;
    }

    async createSudoku(numOfSpaces:number) {
      for (let i = 0; i < numOfSpaces; i++) {
        var ranRow = Math.floor(Math.random() * 9);
        var ranCol = Math.floor(Math.random() * 9);
        var saveNum:number;
        if (this.board[ranRow][ranCol] != 0) {
          saveNum = this.board[ranRow][ranCol];
          this.board[ranRow][ranCol] = 0;
          this.renderCell(`cell-${ranRow}-${ranCol}`, '');
          await UtilFuncs.sleep(this.speed);
          if (!this.oneSolution()) {
            this.board[ranRow][ranCol] = saveNum;
            this.renderCell(`cell-${ranRow}-${ranCol}`, '');
            await UtilFuncs.sleep(this.speed);
            i--;
          }
        } else {
          i--;
        }
      }
      console.table(this.board);
    }

     oneSolution() {
        console.log("one solution");
        var copyA = new Array();
        for (let a = 0; a < 9; a++) {
          copyA[a] = new Array(9);
        }
        this.copyBoard(copyA);
        if(this.sudokuSolver(copyA, 9)) {
          return true;
        }
        else {
          return false;
        }
      }

      copyBoard(copy:number[][]) {
        console.log("copyboard");
        console.log(this.board[0][0]);
        for (let a = 0; a < 9; a++) {
          console.log("for loop");
          for (let b = 0; b < 9; b++) {
            console.log("here");
            copy[a][b] = this.board[a][b];
          }
        }
      }

     sudokuSolver(board:number[][], boardSize:number) {
       console.log("solver");
        var row:number, col:number;
        var isEmpty = true;
        console.log("solver2");
        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            console.log("in for");
            if (board[i][j] == 0) {
              row = i;
              col = j;
              isEmpty = false;
              break;
            }
          }
          if (!isEmpty) {
            break;
          }
        }
        if (isEmpty) {
          return true;
        }
        for (
          let potentialAnswer = 1;
          potentialAnswer <= boardSize;
          potentialAnswer++
        ) {
          console.log("before verify");
          if (this.verifySolution(potentialAnswer, row, col)) {
            console.log("verify solution");
            board[row][col] = potentialAnswer;
            if (this.sudokuSolver(board, boardSize)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }

      async solveSudoku() {
         var row:number, col:number;
         var isEmpty = true;
         for (let i = 0; i < 9; i++) {
           for (let j = 0; j < 9; j++) {
             console.log("in for");
             if (this.board[i][j] == 0) {
               row = i;
               col = j;
               isEmpty = false;
               break;
             }
           }
           if (!isEmpty) {
             break;
           }
         }
         if (isEmpty) {
           return true;
         }
         for (let potentialAnswer = 1; potentialAnswer <= 9; potentialAnswer++) {
           if (this.verifySolution(potentialAnswer, row, col)) {
            this.board[row][col] = potentialAnswer;
            this.renderSolveCell(`cell-${row}-${col}`, potentialAnswer.toString());
            await UtilFuncs.sleep(this.speed);
              if (await this.solveSudoku()) {
                return true;
              } 
              else {
                this.board[row][col] = 0;
                this.renderSolveCell(`cell-${row}-${col}`, '');
                await UtilFuncs.sleep(this.speed);
              }
           }
         }
         return false;
       }

}

const UtilFuncs = {
  /**
   * Sleeps for a certain number of milliseconds
   * @param {Number} ms Number of milliseconds to sleep
   * @throws Will throw if the argument is null or undefined
   */
  sleep: async function (ms) {
      if (ms === 0) return;
      if (!ms) throw new Error('Parameter ms not defined!');

      return new Promise((resolve, reject) => {
          setTimeout(resolve, ms);
      });
  }
}