'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      // console.log(puzzle, coordinate, value)

      if ( typeof(puzzle) !== 'string' || typeof(coordinate) !== 'string' || typeof(value) !== 'string' || 
          puzzle.trim() === '' || coordinate.trim() === '' || value.trim() === '') {
        return res.json({ error: 'Required field(s) missing' })
      }
 
      let validated = solver.validate(puzzle)
      if (validated === 'invalid characters') {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if (validated === 'not 81 characters long') {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      if (solver.solve(puzzle) === puzzle) {
        return res.json({ error: 'Puzzle cannot be solved' })
      }
      
      if (!/[a-i]/i.test(coordinate[0]) || !/[1-9]/.test(coordinate[1]) ||
          coordinate.length !== 2) {
        return res.json({ error: 'Invalid coordinate'})
      }
      
      if (!/[1-9]/.test(value) || value.length !== 1) {
        return res.json({ error: 'Invalid value' })
      }

      let coordinate_row = solver.a2n(coordinate[0])
      
      if (puzzle[solver.rc2i(coordinate_row, coordinate[1] - 1)] === value) {
        return res.json({ valid: true })
      }

      let conflict = [];
      if (!solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value) || 
         !solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value) || 
         !solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)) {
        
        if (!solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value)) {
        conflict.push("row")
        }
        if (!solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value)) {
        conflict.push("column")
        }
        if (!solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)) {
        conflict.push("region")
        }
        
        return res.json({ valid: false, conflict})
      }
      
      return res.json({valid: true})
    });

  app.route('/api/solve')
    .post((req, res) => {

      const { puzzle } = req.body;

      if (typeof (puzzle) !== 'string' || puzzle.trim() === '') {
        return res.json({ error: 'Required field missing' })
      }

      let validated = solver.validate(puzzle)

      if (validated === 'invalid characters') {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if (validated === 'not 81 characters long') {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      let solution = solver.solve(puzzle)

      if (solution === puzzle) {
        return res.json({ error: 'Puzzle cannot be solved' })
      }
      return res.json({ solution: solver.solve(puzzle) })
    });
};
