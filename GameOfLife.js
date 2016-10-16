;(function() {
  "use strict";

  /**
   * Keeps n in a closed range min <= n < max (normilize).
   *
   * @param n   {int} A number to be normilized.
   * @param max {int} The upper limit of the closed range.
   * @param min {int} The lower limit of the closed range (default: 0).
   *
   * @throws {Error} If min >= max.
   *
   * @returns {int} Normilized n.
   */
  function normalize(n, max, min) {
    if (min === undefined) {
      min = 0;
    }

    if (min >= max) {
      throw Error("Impossible range: " + min + ".." + max);
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
   *
   * @param matrix1 {number[][]} Matrix 1.
   * @param matrix2 {number[][]} Matrix 2.
   *
   * @returns {bool} Result of comparison.
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
   @typedef {Object} Size
   @property {int} width The width.
   @property {int} height The height.
   */

  /**
   * A game of life.
   * @class
   *
   * @param fieldSize        {Size}   Field size in elements.
   * @param canvas           {Object} Canvas element from HTML page.
   * @param canvasSize       {Size}   Canvas size in pixels.
   * @param gridCheckbox     {Object} Reference to UI element: checkbox for hiding/showing grid.
   * @param speedRange       {Object} Reference to UI element: range of speed of appearing of new generations.
   */
  function GameOfLife(fieldSize, canvas, canvasSize, gridCheckbox, speedRange) {
    var self = this;
    self.generation = [];
    self.canvas = canvas;

    self.size = {};
    self.size.x = fieldSize.width;
    self.size.y = fieldSize.height;

    self.counter = {};
    resetCounters();

    var callback = {};

    self.generation = null;
    makeEmptyGeneration();
    
    var timer = null;
    var speed;
    self.setSpeed = function() {
      speed = 2000 - speedRange.value;
      if (timer) {
        self.stop();
        self.start();
      }
    };
    self.setSpeed();

    self.draw = function() {
      window.MatrixPainter.draw(self.canvas, self.generation, canvasSize.width, canvasSize.height, gridCheckbox.checked);
    };

    self.draw();

    self.resizeCanvas = function(newCanvasSize) {
      canvasSize.width = newCanvasSize.width;
      canvasSize.height = newCanvasSize.height;
      self.draw();
    };

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

    function gameOver() {
      self.stop();

      self.counter.finalGeneration = countGeneration(self.generation);

      callback.statistics(self.counter);

      resetCounters();
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

      if (self.counter.numberOfGenerations === undefined) {
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

      if (callback.statistics) {
        callback.statistics(self.counter);
      }

      if (areMatrixesEqual(newGeneration, self.generation) ||
          (self.previousGeneration && areMatrixesEqual(newGeneration, self.previousGeneration))) {

        if (self.previousGeneration && areMatrixesEqual(newGeneration, self.previousGeneration)) {
          self.counter.numberOfGenerations++;
        }
        else if (countGeneration(newGeneration) === 0) {
          self.counter.numberOfGenerations--;
        }

        self.previousGeneration = self.generation;
        self.generation = newGeneration;
        gameOver();
        return;
      }

      self.previousGeneration = self.generation;
      self.generation = newGeneration;
    }

    /** Starts the game. */
    self.start = function() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(game.step, speed);
    };

    /** Stops the game. */
    self.stop = function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
 
    /** Pauses the game. */
    self.pause = self.stop;

    /** Makes a step in the game and redraws the game field. */
    self.step = function() {
      makeNewGeneration();
      self.draw();
    };

    /** Resets the game and redraws the game field. */
    self.reset = function() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      resetCounters();
      callback.statistics(self.counter);
      makeEmptyGeneration();
      self.draw();
    };

    /** 
     * Handles mouse click on the game field, performs needed action and redraws the game field.
     * @param x {int} Horizontal coordinate of the click in pixels.
     * @param y {int} Vertical coordinate of the click in pixels.
     */
    self.handleClick = function(x, y) {
      var pos = window.MatrixPainter.getPositionFromCoord(x, y, self.generation, canvasSize.width, canvasSize.height);
      self.generation[pos.y][pos.x] = Math.abs(self.generation[pos.y][pos.x] - 1);
      self.draw();
    };

    /**
     * Randomly activates elements in the game field and redraws the game field.
     *
     * @param probability {float} Probability of element activating.
     */
    self.random = function(probability) {
      makeRandomGeneration(probability);
      self.draw();
    };

    self.registerCallback = function(type, _callback) {
      callback[type] = _callback;
    };
  }

  window.GameOfLife = GameOfLife;
})();