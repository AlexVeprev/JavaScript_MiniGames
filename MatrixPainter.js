/**
 * Visualizes a provided numeric matrix in provided canvas.
 *
 * @param canvas            {Object}     Canvas element from a HTML-page.
 * @param matrix            {number[][]} Numeric matrix to be visualized.
 * @param width             {int}        Canvas width in pixels.
 * @param height            {int}        Canvas height in pixels.
 * @param shouldGridBeDrawn {bool}       Flag to specify if grid should be drawn.
 */
function MatrixPainter_draw(canvas, matrix, width, height, shouldGridBeDrawn) {
  "use strict";
  var context = canvas.getContext("2d");
  canvas.width  = width;
  canvas.height = height;

  var size = {};
  size.x = matrix[0].length;
  size.y = matrix.length;

  var cell = {};
  cell.width = width / size.x;
  cell.height = height / size.y;
  
  drawActiveElements();
  if (shouldGridBeDrawn) {
    drawGrid();
  }

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
        if (matrix[i][j] >= 1) {
		  context.fillStyle   = "#403026"; // Fill positive cell.
          context.fillRect(j * cell.width,
                   i * cell.height,
                   cell.width,
                   cell.height);
        }
        else if (matrix[i][j] <= -1) {
		  context.fillStyle   = "red"; // Fill negative cell.
          context.fillRect(j * cell.width,
                   i * cell.height,
                   cell.width,
                   cell.height);
        }
      }
    }
  }
}

/**
 @typedef {Object} Position
 @property {int} x The x coordinate.
 @property {int} y The y coordinate.
 */

/**
 * Finds element position in a matrix basing on pixel coordinates.
 *
 * @param x {int}             The x coordinate in pixels.
 * @param y {int}             The y coordinate in pixels.
 * @param matrix {number[][]} Numeric matrix to find element position in.
 * @param width {int}         Field (canvas) width in pixels.
 * @param height {int}        Field (canvas) height in pixels.
 *
 * @returns {Position} The position of the found element.
 */
function MatrixPainter_getPositionFromCoord(x, y, matrix, width, height) {
  "use strict";
  var size = {};
  size.x = matrix[0].length;
  size.y = matrix.length;

  var cell = {};
  cell.width = width / size.x;
  cell.height = height / size.y;

  return {x: Math.floor(x / cell.width), y: Math.floor(y / cell.height)};
}