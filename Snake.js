"use strict";

/**
 * Generates a random number between min (inclusive) and max (exclusive).
 *
 * @param min {int} Minimal limit (inclusive).
 * @param max {int} Maximum limit (exclusive).
 *
 * @returns {int} The random number.
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function replaceBiggerNeighbor(matrix) {
    
}

 /**
 @typedef {Object} Size
 @property {int} width The width.
 @property {int} height The height.
 */

/**
 * A snake game.
 * @class
 *
 * @param fieldSize        {Size}   Field size in elements.
 * @param canvas           {Object} Canvas element from HTML page.
 * @param canvasSize       {Size}   Canvas size in pixels.
 * @param gridCheckbox     {Object} Reference to UI element: checkbox for hiding/showing grid.
 */
function Snake(fieldSize, canvas, canvasSize, gridCheckbox) {
  var self = this;

  var Direction = Object.freeze({UP:    {x:  0,  y: -1, code: 38},
                                 DOWN:  {x:  0,  y:  1, code: 40},
                                 RIGHT: {x:  1,  y:  0, code: 39},
                                 LEFT:  {x: -1,  y:  0, code: 37}});

  self.width = {};
  self.width.pixel = canvasSize.width;
  self.width.num = fieldSize.width;
  self.height = {};
  self.height.pixel = canvasSize.height;
  self.height.num = fieldSize.height;

  var field = [];
  var head = {};
  initiate();

  self.callback = {};

  self.draw = function() {
    MatrixPainter_draw(canvas, field, canvasSize.width, canvasSize.height, gridCheckbox.checked);
  };
  self.draw();

  self.resizeCanvas = function(newCanvasSize) {
    canvasSize.width = newCanvasSize.width;
    canvasSize.height = newCanvasSize.height;
    self.draw();
  };

  function initiate() {
    initiateField();
    placeInitialSnake();
    placeFood();
  }

  function initiateField() {
    field = [];
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

    head.direction = Direction.UP;

    field[head.y][head.x] = 2;
    field[head.y + 1][head.x] = 1; // Tail.
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

  function checkNewHeadPos(coord) {
    if (coord.x < 0 || coord.x >= self.width.num ||
        coord.y < 0 || coord.y >= self.height.num) {
      return false;
    }

    if (field[coord.y][coord.x] > 0) {
      return false;
    }

    return true;
  }

  /** Makes a step in the game and redraws the game field. */
  self.step = function() {
    var newHeadPos = {x: head.x + head.direction.x,
                      y: head.y + head.direction.y};

    if (!checkNewHeadPos(newHeadPos)) {
      self.callback.gameover();
      return;
    }

    var food = Math.abs(field[newHeadPos.y][newHeadPos.x]);

    field[newHeadPos.y][newHeadPos.x] = field[head.y][head.x] + 1;
    head.x = newHeadPos.x;
    head.y = newHeadPos.y;

    var x = head.x;
    var y = head.y;
    var direction;
    while (true) {
      if (y - 1 >= 0 && field[y - 1][x] > 0 && field[y - 1][x] == field[y][x] - 1) {
        direction = Direction.UP;
      }
      else if (y + 1 < self.height.num && field[y + 1][x] > 0 && field[y + 1][x] == field[y][x] - 1) {
        direction = Direction.DOWN;
      }
      else if (x + 1 < self.width.num && field[y][x + 1] > 0 && field[y][x + 1] == field[y][x] - 1) {
        direction = Direction.RIGHT;
      }
      else if (x - 1 >= 0 && field[y][x - 1] > 0 && field[y][x - 1] == field[y][x] - 1) {
        direction = Direction.LEFT;
      }
      else {
        field[y][x] = food;
        break;
      }

      field[y][x] = field[y + direction.y][x + direction.x] + food;
      y = y + direction.y;
      x = x + direction.x;
    }

    if (food) {
      placeFood();
    }
    self.draw();
  };

  /**
   * Handles key-down event and performs needed actions.
   * @param keyCode {int} Code of the pressed key.
   */
  self.handleKeyDown = function(keyCode) {
    for (var key in Direction) {
      if (Direction[key].code == keyCode && (Direction[key].x != -head.direction.x || Direction[key].y != -head.direction.y)) {
        head.direction = Direction[key];
      }
    }
  };

  /** Resets the game and redraws the game field. */
  self.reset = function() {
    initiate();
    self.draw();
  };

  self.registerCallback = function(type, callback) {
    self.callback[type] = callback;
  };
}