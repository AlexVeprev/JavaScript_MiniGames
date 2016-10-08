"use strict"

var world = null;

/**
 * Keeps n in a closed range min <= n < max (normilize).
 * @param n {int} A number to be normilized.
 * @param max {int} The upper limit of the closed range.
 * @param min {int} The lower limit of the closed range (default: 0).
 * @return {int} Normilized n.
 */
function normalize(n, max, min) {
  if (min == undefined) {
    min = 0;
  }

  if (min >= max) {
    throw ReferenceError("Impossible range: " + min + ".." + max);
  }

  if (n >= max) {
    return n - max + min;
  }

  if (n < min) {
    return n - min + max;
  }

  return n;
}

/**
 * Compares two matrixes by going through elements one-by-one.
 * @param matrix1 {[][]} Matrix 1.
 * @param matrix2 {[][]} Matrix 2.
 * @return {bool} Result of comparison.
 */
function areMatrixesEqual(matrix1, matrix2) {
  for (var i = 0; i < matrix1.length; i++) {
    for (var j = 0; j < matrix1[i].length; j++) {
      if (matrix1[i][j] !== matrix2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * A world where game of life acts.
 * @constructor
 * @param {int} sizeX  Number of elements on a horizontal.
 * @param {int} sizeY  Number of elements on a vertical.
 * @param {int} width  Width of life field in pixels.
 * @param {int} height Height of life field in pixels.
 */
function GameOfLife(canvas, sizeX, sizeY, width, height) {
  var self = this;
  self.generation = [];
  self.canvas = canvas;
  self.width = width;
  self.height = height;

  self.size = new Object();
  self.size.x = sizeX
  self.size.y = sizeY

  self.counter = new Object();
  resetCounters();

  self.gameOverCallback = null;
  self.statisticsCallback = null;

  self.generation = null;
  makeEmptyGeneration();

  var painter = new MatrixPainter(self.canvas, self.generation, width, height);

  self.draw = function() {
    painter.update(self.generation);
  }

  function resetCounters() {
    self.counter.numberOfGenerations = undefined;
    self.counter.initialGeneration = undefined;
    self.counter.finalGeneration = undefined;
  }

  function countGeneration(generation) {
    var counter = 0;
    for (var i = 0; i < generation.length; i++) {
      for (var j = 0; j < generation[i].length; j++) {
        counter += generation[i][j];
      }
    }
    return counter;
  }

  function makeEmptyGeneration() {
    var emptyGeneration = [];

    for (var i = 0; i < self.size.y; i++) {
      var row = [];
      for (var j = 0; j < self.size.x; j++) {
        row.push(0);
      }
      emptyGeneration.push(row);
    }

    self.generation = emptyGeneration;
  }

  function makeRandomGeneration(probability) {
    var randomGeneration = [];

    for (var i = 0; i < self.size.y; i++) {
      var row = [];
      for (var j = 0; j < self.size.x; j++) {
        row.push(Math.floor(Math.random() + probability));
      }
      randomGeneration.push(row);
    }

    self.generation = randomGeneration;
  }

  function makeNewGeneration() {
    var newGeneration = [];

    if (self.counter.numberOfGenerations == undefined) {
      self.counter.numberOfGenerations = 0;
      self.counter.initialGeneration = countGeneration(self.generation);
      self.previousGeneration = undefined;
    }
    self.counter.numberOfGenerations++;

    for (var y = 0; y < self.size.y; y++) {
      var row = [];
      for (var x = 0; x < self.size.x; x++) {
        var numOfActiveNeighbors = 0;

        // Left & Right
        numOfActiveNeighbors += self.generation[y][normalize(x - 1, self.size.x)];
        numOfActiveNeighbors += self.generation[y][normalize(x + 1, self.size.x)];

        // Up & Down
        numOfActiveNeighbors += self.generation[normalize(y - 1, self.size.y)][x];
        numOfActiveNeighbors += self.generation[normalize(y + 1, self.size.y)][x];

        // Up-Left
        numOfActiveNeighbors += self.generation[normalize(y - 1, self.size.y)][normalize(x - 1, self.size.x)];
        // Up-Right
        numOfActiveNeighbors += self.generation[normalize(y - 1, self.size.y)][normalize(x + 1, self.size.x)];
        // Down-Right
        numOfActiveNeighbors += self.generation[normalize(y + 1, self.size.y)][normalize(x + 1, self.size.x)];
        // Down-Left
        numOfActiveNeighbors += self.generation[normalize(y + 1, self.size.y)][normalize(x - 1, self.size.x)];

        var currentCell = self.generation[y][x];
        if (numOfActiveNeighbors == 3) {
          currentCell = 1;
        }
        else if (numOfActiveNeighbors > 3 || numOfActiveNeighbors < 2) {
          currentCell = 0;
        }

        row.push(currentCell);
      }
      newGeneration.push(row);
    }

    if (self.statisticsCallback) {
      self.statisticsCallback(self.counter);
    }

    if (areMatrixesEqual(newGeneration, self.generation) ||
        (self.previousGeneration && areMatrixesEqual(newGeneration, self.previousGeneration))) {
      if (self.gameOverCallback) {
        self.gameOverCallback();
      }

      if (self.statisticsCallback) {
        if (self.previousGeneration && areMatrixesEqual(newGeneration, self.previousGeneration)) {
          self.counter.numberOfGenerations++;
        }

        self.counter.finalGeneration = countGeneration(newGeneration);

        self.statisticsCallback(self.counter);
      }

      resetCounters();
    }

    self.previousGeneration = self.generation;
    self.generation = newGeneration;
  }

  self.step = function() {
    makeNewGeneration();
    painter.update(self.generation);
  }

  self.reset = function() {
    makeEmptyGeneration();
    painter.update(self.generation);
  }

  self.random = function(probability) {
    makeRandomGeneration(probability);
    painter.update(self.generation);
  }

  self.handleClick = function(x, y) {
    var pos = painter.getPositionFromCoord(x, y);
    self.generation[pos.y][pos.x] = Math.abs(self.generation[pos.y][pos.x] - 1);
    painter.update(self.generation);
  }

  self.registerGameOverCallback = function(gameOverFunction) {
    self.gameOverCallback = gameOverFunction;
  }

  self.registerStatisticsCallback = function(statisticsFunction) {
    self.statisticsCallback = statisticsFunction;
  }
}

function startGameOfLife(canvas, sizeX, sizeY) {
  var size = window.innerHeight < window.innerWidth - 300 ? window.innerHeight : window.innerWidth - 300;
  var normalizedSize = Math.round(size * 0.9 / 10) * 10;
  var gameOfLife = new GameOfLife(canvas, sizeX, sizeY, normalizedSize, normalizedSize);
  gameOfLife.draw();
  return gameOfLife;
}