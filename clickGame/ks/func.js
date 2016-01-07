// Globale Variablen
var grid;
var times;
var glx, gly;
var tileWidth, tileHeight;
var score;
function start(x, y, width, height) {
	score = 0;
	tileWidth = width;
	tileHeight = height;
	init(x, y);
	setInterval("draw()", 20);
}

function init(x, y) {
	glx = x;
	gly = y;
	grid = new Array();
	for (var i = 0; i < x; ++i) {
		grid.push(new Array());
		for (var j = 0; j < y; ++j) {
			var rand = Math.floor(Math.random() * 3);
			var color = "";
			var borderColor = "";
			switch (rand) {
				case 0:
					color = "rgba(255,0,0,255)";
					borderColor = "rgba(200,0,0,255)";
					break;
				case 1:
					color = "rgba(0,255,0,255)";
					borderColor = "rgba(0,200,0,255)";
					break;
				case 2:
				default:
					color = "rgba(0,0,255,255)";
					borderColor = "rgba(0,0,200,255)";
			}
			var t = new Tile(i, j, tileWidth, tileHeight, color);
			t.graphic.setBorder(2, borderColor);
			(grid[i]).push(t);
		}
	}
}

function clickHandler(e) {
	//alert((e.pageX-10)+" "+(e.pageY-10));
	var rect = e.srcElement==undefined?e.currentTarget.getBoundingClientRect():e.srcElement.getBoundingClientRect();

	var coords = {
		x : e.clientX - rect.left,
		y : e.clientY - rect.top
	};
	//var x = Math.ceil((e.pageX - e.target.offsetLeft) / tileWidth) - 1;
	//var y = Math.ceil((e.pageY - e.target.offsetTop) / tileHeight) - 1;
	var x = Math.ceil(coords.x / tileWidth) - 1;
	var y = Math.ceil(coords.y / tileHeight) - 1;
	//alert(x+" "+y);
	updateGrid();
	var falling = false;
	for (var g = 0; g < grid.length; ++g) {
		falling = falling || (grid[g]).some(function(x) {
			return x.falling == true;
		});
	}
	if (!falling) {
		var pieces = checkSurrounding(x, y);
		pieces.sort(function(x, y) {
			return x.y < y.y || x.x < y.x;
		});
		if (pieces.length > 2) {
			for (var piece = 0; piece < pieces.length; ++piece) {
				pop((pieces[piece]).x, (pieces[piece]).y);
				updateGrid();
			}
			score += (pieces.length * 10) + Math.pow(2, (pieces.length - 2));
		}
	}
}

function checkSurrounding(x, y, pieces) {
	if (pieces == undefined || pieces.length == 0) {
		pieces = new Array();
	}
	var exists = false;
	for (var p = 0; p < pieces.length; ++p) {
		if ((pieces[p]).x == x && (pieces[p]).y == y) {
			exists = true;
			break;
		}
	}
	if (!exists && grid[x] != undefined && grid[x][y] != undefined && !(grid[x][y]).falling && (grid[x][y]).color != "") {
		pieces.push(grid[x][y]);
		var thisColor = (grid[x][y]).color;
		var upperColor = grid[x][y + 1] != undefined ? (grid[x][y + 1]).color : "undefined";
		var lowerColor = grid[x][y - 1] != undefined ? (grid[x][y - 1]).color : "undefined";
		var leftColor = grid[x - 1] != undefined ? grid[x - 1][y] != undefined ? (grid[x - 1][y]).color : "undefinend" : "undefined";
		var rightColor = grid[x + 1] != undefined ? grid[x + 1][y] != undefined ? (grid[x + 1][y]).color : "undefined" : "undefined";
		//check up
		if (thisColor == upperColor) {
			checkSurrounding(x, y + 1, pieces);
		}
		//check down
		if (thisColor == lowerColor) {
			checkSurrounding(x, y - 1, pieces);
		}
		//check left
		if (thisColor == leftColor) {
			checkSurrounding(x - 1, y, pieces);
		}
		//check right
		if (thisColor == rightColor) {
			checkSurrounding(x + 1, y, pieces);
		}
		//grid[x][y].color = thisColor;
	}
	return pieces;
}

function pop(x, y) {
	if ((grid[x][y]).y == y) {
		var newGrid = new Array();
		var gridSize = (grid[x]).length;
		var newSize = gridSize - 1;
		for (var ii = 0; ii < y; ++ii) {
			newGrid.push(grid[x][ii]);
		};
		for (var i = y + 1; i <= newSize; ++i) {
			newGrid.push(grid[x][i]);
			(grid[x][i]).setFalling(newGrid.length - 1);
		};
		grid[x] = newGrid;
	}
}

function updateGrid() {
	var newGrid = new Array();
	for (var ii = 0; ii < grid.length; ++ii) {
		if ((grid[ii]).length > 0) {
			newGrid.push(grid[ii]);
		}
	}
	grid = undefined;
	grid = newGrid;
	for (var i = 0; i < grid.length; ++i) {
		var j = Number(i);
		if ((grid[j][0]).x != j) {
			for (var ii = 0; ii < grid[j].length; ++ii) {
				(grid[j][ii]).shift(j - (grid[j][ii]).x);
			}
		}
	}
}

function draw() {
	var c = document.getElementById('test');
	c.addEventListener("click", clickHandler, false);
	var ctx = c.getContext('2d');
	var width = c.getAttribute('width');
	var height = c.getAttribute('height');
	ctx.fillStyle = "rgba(200,255,255,255)";
	ctx.fillRect(0, 0, width, height);
	times++;

	for (var i = 0; i < grid.length; ++i) {
		for (var j = 0; j < grid[i].length; ++j) {
			(grid[i][j]).draw(ctx);
		}
	}
	ctx.fillStyle = "rgba(0,0,0,255)";
	var rightBound=tileWidth*glx;
	ctx.fillRect(rightBound, 0, 3, height);
	ctx.font = "20px Arial";
	ctx.fillText("Score: " + score, rightBound+10, 30);
}

function loadResources() {
	var list = new XMLHttpRequest();
	list.open('get', 'resources/resources.txt', false);
	list.send();
	var resourcesList = list.responseText;
	var lines = resourcesList.split("\n");
	var resources = new Object();
	for (var line in lines) {
		var lineSplit = lines[line].split("=");
		resources[lineSplit[0]] = lineSplit[1];
	}
	return resources;
}