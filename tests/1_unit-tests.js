const chai = require('chai');
const assert = chai.assert;

const puzzleString = require('../controllers/puzzle-strings.js').puzzlesAndSolutions
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

suite('Unit Tests', () => {

  // beforeEach(async () => {
  //   await new Promise(resolve => setTimeout(resolve, 700));
  //   console.log("----------------------");
  // });

  suite('Validate String', () => {

    test('a valid puzzle string of 81 characters', function(done) {
      assert.strictEqual(solver.validate(puzzleString[0][0]), 'valid puzzle string')
      done()
    })

    test('a puzzle string with invalid characters', function(done) {
      assert.strictEqual(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.30e'), 'invalid characters')
      done()
    })

    test('a puzzle string that is not 81 characters in length', function(done) {
      assert.strictEqual(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914'), 'not 81 characters long')
      done()
    })
    
  })

  suite('Check row placement', () => {
    
    test('valid row placement', function(done) {
      assert.isTrue(solver.checkRowPlacement(puzzleString[0][0], "A", 9, 9))
      done()
    })
    
    test('invalid row placement', function(done) {
      assert.isFalse(solver.checkRowPlacement(puzzleString[0][0], "A", 9, 1))
      done()
    })
    
  })

  suite('Check column placement', () => {
    
    test('valid column placement', function(done) {
      assert.isTrue(solver.checkColPlacement(puzzleString[0][0], "B", 1, 9))
      done()
    })
    
    test('invalid row placement', function(done) {
      assert.isFalse(solver.checkColPlacement(puzzleString[0][0], "B", 1, 1))
      done()
    })
    
  })

  suite('Check region placement', () => {

    test('valid region placement', function(done) {
      assert.isTrue(solver.checkRegionPlacement(puzzleString[0][0], "A", 2, 7))
      done()
    })

    test('invalid region placement', function(done) {
      assert.isFalse(solver.checkRegionPlacement(puzzleString[0][0], "A", 2, 1))
      done()
    })
  })

  let invalidStr = 'e.0..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

  suite('solver', () => {
    test('valid puzzle string pass the solver', function(done) {
      assert.strictEqual(solver.solve(puzzleString[0][0]), puzzleString[0][1])
      done()
    })

    test('invalid puzzle string fail the solver', function(done) {
      assert.isFalse(solver.solve(invalidStr))
      done()
    })

    test('returns the expected solution for an incomplete puzzle', function(done) {
      assert.strictEqual(solver.solve(puzzleString[1][0]), puzzleString[1][1])
      done()
    })
    
  })

  
});
