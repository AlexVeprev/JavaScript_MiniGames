"use strict";

function MatrixPainter(canvas, matrix, width, height) {
  var self = this;

  function drawGrid() {
    context.strokeStyle = "#777";    // Line color.
    // Draw vertical lines.
    for (var i = 0; i <= size.x; i++) {
      context.beginPath();
      context.moveTo(i * cell.width, 0);
      context.lineTo(i * cell.width, height);
      context.stroke();
    }

    // Draw horizontal lines.
    for (i = 0; i <= size.y; i++) {
      context.beginPath();
      context.moveTo(0, i * cell.height);
      context.lineTo(width, i * cell.height);
      context.stroke();
    }
  }

  function drawActiveElements() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < size.x; i++) {
      for (var j = 0; j < size.y; j++) {
        if (self.matrix[i][j] >= 1) {
		  context.fillStyle   = "#403026"; // Fill positive cell.
          context.fillRect(j * cell.width,
                   i * cell.height,
                   cell.width,
                   cell.height);
        }
        else if (self.matrix[i][j] <= -1) {
		  context.fillStyle   = "red"; // Fill negative cell.
          context.fillRect(j * cell.width,
                   i * cell.height,
                   cell.width,
                   cell.height);
        }
      }
    }
  }

  function draw() {
    drawActiveElements();
    drawGrid();
  }

  self.getPositionFromCoord = function(x, y) {
    return {x: Math.floor(x / cell.width), y: Math.floor(y / cell.height)};
  };
  
  self.update = function(matrix) {
    self.matrix = matrix;
    draw();
  };

  self = this;
  self.width = width;
  self.height = height;
  self.matrix = matrix;

  var size = {};
  size.x = matrix[0].length;
  size.y = matrix.length;

  var cell = {};
  cell.width = width / size.x;
  cell.height = height / size.y;

  var context = canvas.getContext("2d");
  canvas.width  = width;
  canvas.height = height;

  draw();
}