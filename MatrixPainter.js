"use strict"

function MatrixPainter(canvas, matrix, width, height) {
  self = this;

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
    for (var i = 0; i <= size.y; i++) {
      context.beginPath();
      context.moveTo(0, i * cell.height);
      context.lineTo(width, i * cell.height);
      context.stroke();
    }
  }

  function drawActiveElements() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle   = "#F82"; // Fill active cell color.
    for (var i = 0; i < size.x; i++) {
      for (var j = 0; j < size.y; j++) {
        if (self.matrix[i][j] == 1) {
          context.fillRect(j * cell.width,
                   i * cell.height,
                   cell.width,
                   cell.height);
        }
      }
    }
  }

  self.getPositionFromCoord = function(x, y) {
    return {x: Math.floor(x / cell.width), y: Math.floor(y / cell.height)};
  }
  
  self.update = function(matrix) {
    self.matrix = matrix;
    drawActiveElements();
    drawGrid();
  }

  self = this;
  self.width = width;
  self.height = height;
  self.matrix = matrix;

  var size = new Object();
  size.x = matrix[0].length;
  size.y = matrix.length;

  var cell = new Object();
  cell.width = width / size.x;
  cell.height = height / size.y;

  var context = canvas.getContext("2d");
  canvas.width  = width;
  canvas.height = height;

  drawActiveElements();
  drawGrid();
}