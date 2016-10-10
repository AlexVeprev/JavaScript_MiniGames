"use strict";

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function Snake(canvas, sizeX, sizeY, width, height) {
  var self = this;

  self.width = {};
  self.width.pixel = width;
  self.width.num = sizeX;
  self.height = {};
  self.height.pixel = height;
  self.height.num = sizeY;

  var field = [];
  var head = {};
  initiate();

  var painter = new MatrixPainter(canvas, field, self.width.pixel, self.height.pixel);

  self.draw = function() {
    painter.update(field);
  };

  function initiate() {
    initiateField();
    placeInitialSnake();
    placeFood();
  }

  function initiateField() {    
    for (var y = 0; y < self.height.num; y++) {
      var row = [];
      for (var x = 0; x < self.width.num; x++) {
        row.push(0);
      }
      field.push(row);
    }
  }

  function placeInitialSnake() {
    head.x = Math.floor(self.width.num / 2);
    head.y = Math.floor(self.height.num / 2);

    field[head.y][head.x] = 2;
    field[head.y - 1][head.x] = 1; // Tail.
  }

  function placeFood() {
    var x;
    var y;

    while (true) {
      x = getRandomArbitrary(0, self.width.num);
      y = getRandomArbitrary(0, self.height.num);
      if (field[y][x] === 0) {
        field[y][x] = -1;
        break;
      }
    }
  }
}

function startSnake(canvas, sizeX, sizeY) {
  var size = window.innerHeight < window.innerWidth - 300 ? window.innerHeight : window.innerWidth - 300;
  var normalizedSize = Math.round(size * 0.9 / 10) * 10;
  var snake = new Snake(canvas, sizeX, sizeY, normalizedSize, normalizedSize);
  snake.draw();
  return snake;
}