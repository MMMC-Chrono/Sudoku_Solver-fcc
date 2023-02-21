const chai = require("chai");
const chaiHttp = require('chai-http');
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  const solve_api = '/api/solve'
  const check_api = '/api/check'
  const invalid_char_puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.30e'
  const short_puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914'
  const cannot_solve = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.111...4..8916..85.72...3'

  suite('POST - /api/solve', () => {

    test('valid puzzle string', function(done) {
      chai
        .request(server)
        .post(solve_api)
        .send({
          puzzle: puzzlesAndSolutions[0][0]
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.isObject(body)
          assert.deepEqual(body, { solution: puzzlesAndSolutions[0][1] })
          done()
        })
    })

    test('invalid puzzle string', function(done) {
      chai
        .request(server)
        .post(solve_api)
        .send({
          puzzle: ''
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.deepEqual(body, { error: 'Required field missing' })
          done()
        })
    })

    test('puzzle with invalid characters', function(done) {
      chai
        .request(server)
        .post(solve_api)
        .send({
          puzzle: invalid_char_puzzle
        }) 
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.deepEqual(body, { error: 'Invalid characters in puzzle' })
          done()
        })
    })

    test('puzzle with incorrect length', function(done) {
      chai
        .request(server)
        .post(solve_api)
        .send({
          puzzle: short_puzzle
        }) 
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.deepEqual(body, { error: 'Expected puzzle to be 81 characters long' })
          done()
        })
    })

    test('puzzle cannot be solved', function(done) {
      chai
        .request(server)
        .post(solve_api)
        .send({
          puzzle: cannot_solve
        }) 
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          assert.deepEqual(body, { error: 'Puzzle cannot be solved' })
          done()
        })
    })
    
  })

  suite('POST - /api/check', () => {

    test("puzzle placement with all fields", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { valid: true })
          done()
        })
    })

    test("puzzle placement with single placement conflict", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B2',
          value: '3'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { valid: false, conflict: ["row"] })
          done()
        })
    })

    test("puzzle placement with multiple placement conflicts", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'B1',
          value: '3'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { valid: false, conflict: ["row", "column"] })
          done()
        })
    })

    test("puzzle placement with all placement conflicts", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'a1',
          value: '5'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { valid: false, conflict: ["row", "column", "region"] })
          done()
        })
    })

    test("puzzle with missing required fields", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: '',
          coordinate: '',
          value: '5'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { error: 'Required field(s) missing' })
          done()
        })
    })

    test("puzzle with invalid characters", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: invalid_char_puzzle,
          coordinate: 'a2',
          value: '5'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { error: 'Invalid characters in puzzle' })
          done()
        })
    })

    test("puzzle with incorrect length", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: short_puzzle,
          coordinate: 'a2',
          value: '5'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { error: 'Expected puzzle to be 81 characters long' })
          done()
        })
    })

    test("invalid placement coordinate", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'z2',
          value: '5'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { error: 'Invalid coordinate'})
          done()
        })
    })

    test("invalid placement value", function(done) {
      chai
        .request(server)
        .post(check_api)
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: 'a2',
          value: '0'
        })
        .end(function(err, res) {
          if (err) console.log(err)
          const { body } = res;
          console.log(body)
          assert.deepEqual(body, { error: 'Invalid value'})
          done()
        })
    })
  })

});

