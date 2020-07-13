import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BoardComponent implements OnInit {
  board: number[][];
  sudokuHTMLElement: HTMLElement;
  numSet: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  speed: number = 35;
  text: String;
  title: String;
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
    this.sudokuHTMLElement = document.getElementById('sudoku-board');
    this.renderSudoku();
    //this.shuffle(this.numSet);
  }

  clear() {
    this.title = null;
    this.text = null;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.board[i][j] = 0;
        console.log(this.board[i][j]);
        this.renderCell(`cell-${i}-${j}`, '');
      }
    }
    console.table(this.board);
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
    cell.classList.remove('discovered-wrong-num');
    cell.classList.remove('discovered-num');
    cell.classList.add('given-num');
    cell.textContent = value;
  }

  renderSolveCell(cellId, value) {
    let cell = document.getElementById(cellId);
    cell.classList.remove('discovered-wrong-num');
    cell.classList.add('discovered-num');
    cell.textContent = value;
  }

  renderWrongSolveCell(cellId, value) {
    let cell = document.getElementById(cellId);
    cell.classList.remove('discovered-num');
    cell.classList.add('discovered-wrong-num');
    cell.textContent = value;
  }

  async fillBoard() {
    this.title='filling the board';
    this.text =
      'Each box has its own shuffled number set of 1-9 that it goes through. If the inputted number is valid (within the row, column, and 3x3), recursively the function calls to fill the next empty box. If found that there are no possible solutions to the next box, the program backtracks and tries again with a new number.';
    var row: number, col: number;
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

  shuffle(a: number[]) {
    var j: number, x: number, i: number;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  verifySolution(num: number, i: number, j: number) {
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

  quadrant(i: number) {
    return Math.floor(i / 3) * 3;
  }

  async createSudoku(numOfSpaces: number) {
    this.title='creating the puzzle';
    this.text="Randomly, boxes are chosen to be set empty. The back-tracking solver algorithm then is used to ensure there is still a possible solution to the puzzle. If there isn’t, the number is put back. This continues until the set number of boxes are removed. ";
    for (let i = 0; i < numOfSpaces; i++) {
      var ranRow = Math.floor(Math.random() * 9);
      var ranCol = Math.floor(Math.random() * 9);
      var saveNum: number;
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
    var copyA = new Array();
    for (let a = 0; a < 9; a++) {
      copyA[a] = new Array(9);
    }
    this.copyBoard(copyA);
    if (this.sudokuSolver(copyA, 9)) {
      return true;
    } else {
      return false;
    }
  }

  copyBoard(copy: number[][]) {
    for (let a = 0; a < 9; a++) {
      for (let b = 0; b < 9; b++) {
        copy[a][b] = this.board[a][b];
      }
    }
  }

  sudokuSolver(board: number[][], boardSize: number) {
    var row: number, col: number;
    var isEmpty = true;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
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
      if (this.verifySolution(potentialAnswer, row, col)) {
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
    this.title='solving the puzzle';
    this.text="The numbers 1-9 are put into each box. If it is valid within the column, row, and 3x3, recursively the algorithm moves to the next empty space. If no possible solution is found, the algorithm backtracks and tries the next possible solution for the previous box. ";
    var row: number, col: number;
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
    for (let potentialAnswer = 1; potentialAnswer <= 9; potentialAnswer++) {
      if (this.verifySolution(potentialAnswer, row, col)) {
        this.board[row][col] = potentialAnswer;
        this.renderSolveCell(`cell-${row}-${col}`, potentialAnswer.toString());
        await UtilFuncs.sleep(this.speed);
        if (await this.solveSudoku()) {
          return true;
        } else {
          this.board[row][col] = 0;
          this.renderWrongSolveCell(`cell-${row}-${col}`, '');
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
  },
};
