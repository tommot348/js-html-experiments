/*globals document, window*/
"use strict";
var tools = {
    mouseCoords: function (e, cellX, cellY) {
        var rect = e.srcElement === undefined ? e.currentTarget.getBoundingClientRect() : e.srcElement.getBoundingClientRect();

        var coords = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        var x = Math.ceil(coords.x / cellX) - 1;
        var y = Math.ceil(coords.y / cellY) - 1;
        return [x, y];
    },
    mix: function (colors) {
        var r = 0,
            g = 0,
            b = 0,
            divisor = colors.length;
        colors.forEach(function (e) {
            if (e !== '#ffffff' && e !== undefined) {
                r += parseInt(e.substr(1, 2), 16);
                g += parseInt(e.substr(3, 2), 16);
                b += parseInt(e.substr(5, 2), 16);
            } else {
                divisor -= 1;
            }
        });
        if (divisor === 0) {
            divisor = 1;
        }
        r = (Math.floor(r / divisor)).toString(16);
        r = r.length > 1 ? r : "0" + r;
        g = (Math.floor(g / divisor)).toString(16);
        g = g.length > 1 ? g : "0" + g;
        b = (Math.floor(b / divisor)).toString(16);
        b = b.length > 1 ? b : "0" + b;
        return "#" + r + g + b;
    }
};