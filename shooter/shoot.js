/*global window,document,tools*/
"use strict";
/*var tools = {
    mouseCoords: function (e, cellX, cellY) {
        var rect = e.srcElement === undefined ? e.currentTarget.getBoundingClientRect() : e.srcElement.getBoundingClientRect();

        var coords = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        var x = Math.ceil(coords.x / cellX) - 1;
        var y = Math.ceil(coords.y / cellY) - 1;
        return [x, y];
    }
};*/
var assets = {
    'player': [[false, true, true], [true, true, false], [false, true, true]],
    'enemy': [[true, false, true], [false, true, true], [true, false, true]],
    'bullet': [[true, true]]
};
var assetImgData = {};
var shoot = {
    // bla
    sCellX: 4,
    sCellY: 4,
    width: 400,
    height: 400,
    objects: {
        'player': [],
        'enemy': [],
        'bullet': []
    },
    intervals: [],
    score: 0,
    gameState: "init",
    canvasId: 0,
    updateSpeed: 1000,
    millisToNextUpdate: 0,
    createImgData: function () {
        var key;
        var makeData = function (asset) {
            var canvas, ctx, i, index, data, width, height, row, col;
            row = 0;
            width = asset.length * shoot.sCellX;
            height = asset[0].length * shoot.sCellY;
            canvas = document.getElementById(shoot.canvasId);
            ctx = canvas.getContext("2d");
            data = ctx.createImageData(width, height);
            for (i = 0; i < data.data.length; i += 4) {
                col = (i / 4) % width;
                if (i > 0 && col === 0) {
                    ++row;
                }

                if (asset[Math.floor(col / shoot.sCellX)][Math.floor(row / shoot.sCellY)]) {
                    data.data[i + 3] = 255;
                }
            }
            assetImgData[key] = data;
        };
        for (key in assets) {
            if (assets.hasOwnProperty(key)) {
                makeData(assets[key]);
            }
        }
    },
    init: function (canvasId) {
        if (shoot.intervals.length > 0) {
            shoot.intervals.forEach(function (val) {
                clearInterval(val);
            });
        }
        shoot.objects = {
            'player': [],
            'enemy': [],
            'bullet': []
        };
        shoot.score = 0;
        shoot.canvasId = canvasId;
        var canvas = document.getElementById(canvasId);
        canvas.onclick = shoot.click;
        canvas.onmouseout = function () {
            if (shoot.gameState === "running") {
                shoot.gameState = "paused";
            }
        };
        canvas.onmousemove = shoot.move;
        shoot.spawn('player', 0, 0);
        shoot.intervals.push(setInterval(function () {
            shoot.spawn('enemy', 1, 2);
        }, 3000));
        shoot.intervals.push(setInterval(function () {
            shoot.objects.enemy.forEach(function (enemy) {
                var chance = Math.random() * 10;
                if (chance > 3) {
                    shoot.shoot(enemy, "enemy");
                }
            });
        }, 1500));
        shoot.intervals.push(setInterval(function () {
            shoot.update();
            shoot.millisToNextUpdate = shoot.updateSpeed;
        }, shoot.updateSpeed));
        shoot.createImgData();
        shoot.draw();
    },
    click: function () {
        if (shoot.gameState === "running") {
            shoot.shoot(shoot.objects.player[0], 'player');
        } else {
            switch (shoot.gameState) {
            case "init":
                shoot.gameState = "running";
                break;
            case "paused":
                shoot.gameState = "running";
                break;
            case "dead":
                shoot.init(shoot.canvasId);
                shoot.gameState = "running";
                break;
            }

        }
    },
    move: function (e) {
        if (shoot.gameState === "running") {
            var coords = tools.mouseCoords(e, 1, 1);
            shoot.objects.player[0].x = coords[0] - 1;
        }
    },
    draw: function () {
        setTimeout(function () {
            var canvas, ctx, type, text, update, addToXmap, xmap;
            xmap = [];
            shoot.millisToNextUpdate -= (1000 / 60);
            window.requestAnimationFrame(function () {
                shoot.draw();
            });
            canvas = document.getElementById(shoot.canvasId);

            ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, shoot.width, shoot.height);
            addToXmap = function (ob, j) {
                var i;
                for (i = ob.x; i < (assets[type].length * shoot.sCellX) + ob.x; ++i) {
                    if (xmap[i] === undefined) {
                        xmap[i] = [];
                    }
                    xmap[i].push([type, j, ob]);
                }
            };
            update = function (ob) {
                if (ob.alive) {
                    var sameX, hit;
                    sameX = [];
                    xmap.slice(ob.x, assets[type].length * shoot.sCellX + ob.x).forEach(function (xob) {
                        xob.reduce(function (prev, curr) {
                            if (curr[0] !== type) {
                                if (prev.every(function (item) {
                                        return item[0] !== curr[0] || item[1] !== curr[1];
                                    })) {
                                    prev.push(curr);
                                }
                            }
                            return prev;
                        }, sameX);
                    });
                    hit = sameX.filter(function (obx) {
                        var newy,
                            tempy1,
                            tempy2;
                        if (ob.alive === true && obx[2].alive === true) {
                            newy = ob.y + (ob.speed * ob.direction);
                            if (ob.direction === 1) {
                                if (obx[0] !== "enemy") {
                                    tempy1 = newy + (assets[type][0].length * shoot.sCellY);
                                    tempy2 = obx[2].y;
                                    return tempy1 >= tempy2;
                                } else {
                                    return false;
                                }
                            } else {
                                if (ob.direction === -1) {
                                    if (obx[0] !== "player") {
                                        tempy1 = newy;
                                        tempy2 = obx[2].y + (assets[obx[0]][0].length * shoot.sCellY);
                                        return tempy1 <= tempy2;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            }
                        } else {
                            return false;
                        }
                    });
                    if (hit.length > 0) {
                        ob.health -= 1;
                        if (ob.health <= 0) {
                            ob.alive = false;
                        }
                        hit.forEach(function (hitd) {
                            if (hitd[0] === "enemy") {
                                shoot.score += hitd[2].y;
                            }
                            hitd[2].health -= 1;
                            if (hitd[2].health <= 0) {
                                hitd[2].alive = false;
                            }
                        });
                    }

                    ctx.putImageData(assetImgData[type], ob.x, ob.y);
                    ob.y += ob.speed * ob.direction;
                }
            };

            if (shoot.gameState === "running") {
                ctx.font = "16px Monospace";
                text = "Health: " + shoot.objects.player[0].health;
                ctx.fillText(text, 10, 20);

                ctx.font = "16px Monospace";
                text = "Score: " + shoot.score;
                ctx.fillText(text, shoot.width - 16 * text.length, 20);
                for (type in shoot.objects) {
                    if (shoot.objects.hasOwnProperty(type)) {
                        shoot.objects[type].forEach(addToXmap);
                    }
                }
                for (type in shoot.objects) {
                    if (shoot.objects.hasOwnProperty(type)) {
                        shoot.objects[type].forEach(update);
                    }
                }
            } else {
                switch (shoot.gameState) {
                case "init":
                    text = "Click to Start";
                    break;
                case "paused":
                    text = "Paused click to resume";
                    break;
                case "dead":
                    text = "You are dead. Click to restart";
                    break;
                }
                ctx.font = "16px Monospace";
                ctx.fillText(text, shoot.width / 2 - 4 * text.length, shoot.height / 2 - 8);

            }
        }, shoot.updateSpeed / shoot.sCellX);
    },
    shoot: function (ob, type) {
        var data = {
            x: (ob.x + shoot.sCellX),
            y: (type === 'player' ? ob.y - 4 * shoot.sCellY : ob.y + 4 * shoot.sCellY),
            alive: true,
            health: 1,
            direction: (type === 'player' ? -1 : 1),
            speed: 20
        };
        shoot.objects.bullet.push(data);
    },
    spawn: function (type, direction, speed) {
        var data, x;
        switch (type) {
        case 'player':
            data = {
                x: 49 * shoot.sCellX,
                y: 96 * shoot.sCellY,
                alive: true,
                health: 10,
                direction: direction,
                speed: speed
            };
            break;
        case 'enemy':
            x = Math.floor(Math.random() * 98);
            data = {
                x: x * shoot.sCellX,
                y: 0,
                alive: true,
                health: 1,
                direction: direction,
                speed: speed
            };
            break;
        }
        if (shoot.gameState === "running" || type === "player") {
            shoot.objects[type].push(data);
        }
    },
    update: function () {
        var type, filter, update;

        filter = function (a) {
            return a.alive;
        };
        update = function (ob, j) {
            if (ob.y > shoot.height) {
                ob.alive = false;
                return;
            } else {
                if (ob.y < 0) {
                    ob.alive = false;
                    return;
                }
            }
        };
        if (shoot.gameState === "running") {
            for (type in shoot.objects) {
                if (shoot.objects.hasOwnProperty(type)) {
                    shoot.objects[type].forEach(update);
                    if (!shoot.objects.player[0].alive) {
                        shoot.gameState = "dead";
                    }
                    shoot.objects[type] = shoot.objects[type].filter(filter);
                }
            }
        }
    }
};