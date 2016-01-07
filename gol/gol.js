/*globals document, window,tools*/
"use strict";

var gol = {
    grid: null,
    sCellX: null,
    sCellY: null,
    width: null,
    height: null,
    intid: null,
    color: '#000000',
    check: function (x, y) {
        var count, colors;
        count = 0;
        colors = [];

        function check(input) {
            if (input[0]) {
                count++;
                colors.push(input[1]);
            }
        }

        if (x === 0) {
            if (y === 0) {
                check(gol.grid[x + 1][y]);
                check(gol.grid[x][y + 1]);
                check(gol.grid[x + 1][y + 1]);
            } else {
                if (y === gol.grid[0].length - 1) {
                    check(gol.grid[x][y - 1]);
                    check(gol.grid[x + 1][y - 1]);
                    check(gol.grid[x + 1][y]);
                } else {
                    check(gol.grid[x][y - 1]);
                    check(gol.grid[x + 1][y - 1]);
                    check(gol.grid[x + 1][y]);
                    check(gol.grid[x][y + 1]);
                    check(gol.grid[x + 1][y + 1]);
                }
            }
        } else {
            if (x === gol.grid.length - 1) {
                if (y === 0) {
                    check(gol.grid[x - 1][y]);
                    check(gol.grid[x - 1][y + 1]);
                    check(gol.grid[x][y + 1]);
                } else {
                    if (y === gol.grid[0].length - 1) {
                        check(gol.grid[x - 1][y - 1]);
                        check(gol.grid[x][y - 1]);
                        check(gol.grid[x - 1][y]);
                    } else {
                        check(gol.grid[x - 1][y - 1]);
                        check(gol.grid[x][y - 1]);
                        check(gol.grid[x - 1][y]);
                        check(gol.grid[x - 1][y + 1]);
                        check(gol.grid[x][y + 1]);
                    }
                }
            } else {
                if (y === 0) {
                    check(gol.grid[x - 1][y]);
                    check(gol.grid[x + 1][y]);
                    check(gol.grid[x - 1][y + 1]);
                    check(gol.grid[x][y + 1]);
                    check(gol.grid[x + 1][y + 1]);
                } else {
                    if (y === gol.grid[0].length - 1) {
                        check(gol.grid[x - 1][y - 1]);
                        check(gol.grid[x][y - 1]);
                        check(gol.grid[x + 1][y - 1]);
                        check(gol.grid[x - 1][y]);
                        check(gol.grid[x + 1][y]);
                    } else {
                        check(gol.grid[x - 1][y - 1]);
                        check(gol.grid[x][y - 1]);
                        check(gol.grid[x + 1][y - 1]);
                        check(gol.grid[x - 1][y]);
                        check(gol.grid[x + 1][y]);
                        check(gol.grid[x - 1][y + 1]);
                        check(gol.grid[x][y + 1]);
                        check(gol.grid[x + 1][y + 1]);
                    }
                }
            }
        }

        if (gol.grid[x][y][0]) {
            if (count > 1 && count < 4) {
                return [true, gol.grid[x][y][1]];
            } else {
                return [false, tools.mix([gol.grid[x][y][1], '#000000'])];
            }
        } else {
            if (count === 3) {
                return [true, tools.mix(colors)];
            } else {
                return [false, gol.grid[x][y][1]];
            }
        }
    },
    update: function () {
        var ngrid = [];
        gol.grid.forEach(function (row, i) {
            ngrid.push([]);
            row.forEach(function (cell, j) {
                ngrid[i].push([cell[0] === true, cell[1]]);
            });
        });
        ngrid.forEach(function (row, i) {
            row.forEach(function (cell, j) {
                ngrid[i][j] = gol.check(i, j);
            });
        });
        gol.grid = ngrid;
    },
    draw: function () {
        setTimeout(function () {
            window.requestAnimationFrame(gol.draw);
            var canvas = document.getElementById(gol.canvasId);
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, gol.width, gol.height);

            gol.grid.forEach(function (row, i) {
                row.forEach(function (cell, j) {
                    /*if (cell[0] !== false) {*/
                    ctx.fillStyle = cell[1];
                    ctx.fillRect(i * gol.sCellX, j * gol.sCellY, gol.sCellX, gol.sCellY);
                    /*}*/
                });
            });
        }, 1000 / 60);

    },
    click: function (e) {
        var coords = tools.mouseCoords(e, gol.sCellX, gol.sCellY);
        gol.grid[coords[0]][coords[1]][1] = gol.color;
        gol.grid[coords[0]][coords[1]][0] = true;
    },
    isDrawing: false,
    setDrawing: function (b) {
        gol.isDrawing = b;
    },
    init: function (canvasId, x, y, pwidth, pheight) {
        var i, j, ii, jj, row;
        gol.grid = [];
        gol.width = pwidth;
        gol.height = pheight;
        gol.sCellX = gol.width / x;
        gol.sCellY = gol.height / y;
        if (gol.canvasId === undefined && canvasId !== undefined) {
            gol.canvasId = canvasId;
        }
        for (i = 0, j = x; i < j; ++i) {
            row = [];
            for (ii = 0, jj = x; ii < jj; ++ii) {
                row.push([false, '#ffffff']);
            }
            gol.grid.push(row);
        }
        document.getElementById(canvasId).onclick = gol.click;
        document.getElementById(canvasId).onmousedown = function () {
            gol.setDrawing(true);
        };
        document.getElementById(canvasId).onmouseup = function () {
            gol.setDrawing(false);
        };
        document.getElementById(canvasId).onmousemove = function (e) {
            if (gol.isDrawing) {
                gol.click(e);
            }
        };
        window.requestAnimationFrame(gol.draw);
    },
    start: function () {
        gol.stop();
        gol.intid = setInterval(gol.update, document.getElementById('speed').value);
    },
    stop: function () {
        if (gol.intid !== null) {
            clearInterval(gol.intid);
        }
    },
    step: function () {
        if (gol.intid !== null) {
            gol.stop();
        }
        gol.update();
    }
};
var colors = {
    init: function (canvasId) {
        var x = 0,
            y = 0,
            canvas = document.getElementById(canvasId),
            ctx = canvas.getContext("2d"),
            r = 255,
            g = 0,
            b = 0,
            colors = [];
        ctx.clearRect(0, 0, 100, 100);
        for (x = 0; x < 10; ++x) {
            b = 0;
            r = 255;
            colors[x] = [];
            for (y = 0; y < 10; ++y) {
                var rstr = r.toString(16).length > 1 ? r.toString(16) : "0" + r.toString(16);
                var gstr = g.toString(16).length > 1 ? g.toString(16) : "0" + g.toString(16);
                var bstr = b.toString(16).length > 1 ? b.toString(16) : "0" + b.toString(16);
                var color = "#" + rstr + gstr + bstr;
                colors[x][y] = color;
                ctx.fillStyle = color;
                ctx.fillRect(x * 10, y * 10, 10, 10);
                b += 255 / 10;
                b = Math.floor(b);
                r -= 255 / 10;
                r = Math.floor(r);
            }
            g += 255 / 10;
            g = Math.floor(g);
        }
        canvas.onclick = function (e) {
            var coords = tools.mouseCoords(e, 10, 10);
            gol.color = colors[coords[0]][coords[1]];
        };
    }
};