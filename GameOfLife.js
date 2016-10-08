"use strict"

var world = null;

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