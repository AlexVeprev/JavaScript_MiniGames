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
 * A world where game of life acts.
 * @constructor
 * @param {int} sizeX  Number of elements on a horizontal.
 * @param {int} sizeY  Number of elements on a vertical.
 * @param {int} width  Width of life field in pixels.
 * @param {int} height Height of life field in pixels.
 */
function World(sizeX, sizeY, width, height) {
  var self = this;
  self.generation = [];
  self.width = width;
  self.height = height;

  self.size = new Object();
  self.size.x = sizeX
  self.size.y = sizeY

  // Initiate world with zeros.
  for (var i = 0; i < self.size.y; i++) {
    var row = [];
    for (var j = 0; j < self.size.x; j++) {
      row.push(0);
    }
    self.generation.push(row);
  }
  
  self.generation = randomGenration(0.1);
  var painter = new MatrixPainter(document.getElementById("canvas"), self.generation, width, height);

  self.draw = function() {
    painter.update(self.generation);
  }

  function randomGenration(probability) {
    var randomGeneration = [];

    for (var i = 0; i < self.size.y; i++) {
      var row = [];
      for (var j = 0; j < self.size.x; j++) {
        row.push(Math.floor(Math.random() + probability));
      }
      randomGeneration.push(row);
    }

    return randomGeneration;
  }

  function newGeneration() {
    var newGeneration = [];

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

    return newGeneration;
  }

  self.step = function() {
    self.generation = newGeneration();
    painter.update(self.generation);
  }

  self.handleClick = function(x, y) {
    var pos = painter.getPositionFromCoord(x, y);
    self.generation[pos.y][pos.x] = Math.abs(self.generation[pos.y][pos.x] - 1);
    painter.update(self.generation);
  }

}

function createWorld() {
  var size = window.innerHeight < window.innerWidth - 300 ? window.innerHeight : window.innerWidth - 300;
  var normalizedSize = Math.round(size * 0.9 / 10) * 10;
  world = new World(20, 20, normalizedSize, normalizedSize);
  world.draw();
}

function relMouseCoords(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  }
  while (currentElement = currentElement.offsetParent)

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function handleClick(event) {
  var canvas = document.getElementById("canvas");
  var coords = canvas.relMouseCoords(event);
  world.handleClick(coords.x, coords.y);
}