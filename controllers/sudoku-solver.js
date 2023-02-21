class SudokuSolver {

  i2rc(index) {
    return { row: Math.floor(index / 9), col: index % 9 }
  }

  a2n(row) {
    return row.toUpperCase() === "A"? 0:
      row.toUpperCase() === "B"? 1:
      row.toUpperCase() === "C"? 2:
      row.toUpperCase() === "D"? 3:
      row.toUpperCase() === "E"? 4:
      row.toUpperCase() === "F"? 5:
      row.toUpperCase() === "G"? 6:
      row.toUpperCase() === "H"? 7:
      row.toUpperCase() === "I"? 8: null;
  }

  rc2i(row, col) {
    return (row * 9) + col;
  }

  validate(puzzleString) {
    let arr = puzzleString.split('')
    if (arr.length === 0 || arr == null) {
      return 'invalid puzzle string'
    }
    if (arr.length !== 81) return 'not 81 characters long';
    for ( let a = 0 ; a < arr.length ; a++) {
      let valid_input = /[1-9.]+/.exec(arr[a])
      if (!valid_input) {
        return 'invalid characters'
      }
    }
    return 'valid puzzle string'
  }

  checkRowPlacement(puzzleString, row, column, value) {
    row = this.a2n(row);

    for ( let c = 0; c < 9; c++) {
      if (puzzleString[this.rc2i(row, c)] == value) return false
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    for ( let r = 0; r < 9; r++) {
      if (puzzleString[this.rc2i(r, column-1)] == value) return false
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rRegion = Math.floor(this.a2n(row) / 3) * 3;
    let cRegion = Math.floor((column - 1) / 3) * 3;
    for ( let r = rRegion; r < rRegion + 3; r++) {
      for ( let c = cRegion; c < cRegion + 3; c++) {
        if (puzzleString[this.rc2i(r, c)] == value) return false;
      }
    }
    return true
  }

  nextEmptyCell(puzzleString) {
    for ( let i = 0 ; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        return i;
      }
    }

    return -9;
  }

  checkVal(string, row, column, val) {
    for (let c = 0; c < 9; c++) {
      if (string[this.rc2i(row, c)] == val) {
        return false
      }
    }

    for ( let r = 0; r < 9; r++) {
      if (string[this.rc2i(r, column)] == val) {
        return false
      }
    }

    let rRegion = Math.floor(row / 3) * 3;
    let cRegion = Math.floor(column / 3) * 3;

    for (let rR = rRegion; rR < rRegion + 3; rR++) {
      for (let cR = cRegion; cR < cRegion + 3; cR++) {
        if (string[this.rc2i(rR, cR)] == val) {
          return false
        }
      }
    }
    
    return true;
  }

  solve(puzzleString) {
    
    if (typeof(puzzleString) === 'string') {
      if ( this.validate(puzzleString) !== 'valid puzzle string') {
        return false
      }
       puzzleString = puzzleString.split('')
    }
    
    let emptyCell = this.nextEmptyCell(puzzleString)
    let { row, col } = this.i2rc(emptyCell)
    
    if (row === -1) {
      return puzzleString;
    }

    for (let num = 1; num <= 9; num++) {
      if (this.checkVal( puzzleString, row, col, num)) {
        puzzleString[this.rc2i(row, col)] = num.toString();
        this.solve(puzzleString)
      }
    }
    

    if (this.nextEmptyCell(puzzleString) !== -9) {
      puzzleString[this.rc2i(row, col)] = "."
    }
    
    return puzzleString.join('')
  }
}
module.exports = SudokuSolver;

