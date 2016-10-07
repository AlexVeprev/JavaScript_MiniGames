"use strict"

var world = null;

function World(sizeX, sizeY, width, height) {
	var self = this;
	self.matrix = [];
	self.width = width;
	self.height = height;

	// Initiate world with zeros.
	for (var i = 0; i < sizeX; i++) {
		var row = [];
		for (var j = 0; j < sizeY; j++) {
			row.push(0);
		}
		self.matrix.push(row);
	}
	
	var painter = new MatrixPainter(document.getElementById("canvas"), self.matrix, width, height);

	self.draw = function() {
		painter.update(self.matrix);
	}

	self.handleClick = function(x, y) {
		var pos = painter.getPositionFromCoord(x, y);
		self.matrix[pos.y][pos.x] = Math.abs(self.matrix[pos.y][pos.x] - 1);
		painter.update(self.matrix);
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