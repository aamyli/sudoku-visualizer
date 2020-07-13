import { BoardComponent } from "./board.component";

class SudokuRenderer {
    
    sudokuHTMLElement:HTMLElement;
    sudoku: BoardComponent;
    constructor(sudokuHTMLElement) {
        this.sudokuHTMLElement = sudokuHTMLElement;
        this.sudoku = new BoardComponent();
        //this.solver = new SudokuSolver(this.sudoku, this.renderCell);
    }

    /**
     * Render the sudoku on the HTML view
     */
    renderSudoku() {
        // Remove all children of the sudokuHTMLElement
        while (this.sudokuHTMLElement.firstChild) {
            this.sudokuHTMLElement.removeChild(this.sudokuHTMLElement.firstChild);
        }

        for (let i = 0; i < this.sudoku.board.length; i++) {
            let sudokuRow = document.createElement('tr');
            for (let j = 0; j < this.sudoku.board.length; j++) {
                let sudokuCell = document.createElement('td');
                let num = this.sudoku.board[i][j];

                sudokuCell.id = `cell-${i}-${j}`;

                if (num !== 0) {
                    sudokuCell.textContent = num.toString();
                    sudokuCell.classList.add('given-num');
                }
                else {
                    sudokuCell.classList.add('discovered-num');
                }

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

    /**
     * Change the text content of the cell specified by cellId 
     * @param {String} cellId The HTML id of the cell whose text context will be changed
     * @param {String|Number} value The new text/value for the cell
     */
    renderCell(cellId, value) {
        let cell = document.getElementById(cellId);
        cell.textContent = value;
    }

    // async renderSolve() {
    //     return await this.solver.solve();
    // }

    /**
     * Re-renders the sudoku
     */
    clear() {
        //this.solver.cancelSolve();
        this.sudoku.clear();
        this.renderSudoku();
    }

    setSudoku() {
        this.sudoku.fillBoard();
    }

}