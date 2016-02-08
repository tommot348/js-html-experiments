"use strict";

function sub(x, y) {
    var carry = 0,
        i,
        xpart,
        ypart,
        subres = "";
    //pad
    if (y.length < x.length) {
        y = (new Array(x.length - y.length + 1)).join("0") + y;
    }

    for (i = y.length - 1; i >= 0; --i) {
        xpart = Number(x[i]);
        ypart = Number(y[i]) + carry;
        if (ypart === 10) {
            ypart = 0;
            carry = 1;
        } else {
            carry = 0;
        }
        if (xpart < ypart) {
            subres = String(xpart + 10 - ypart) + subres;
            carry += 1;
        } else {
            subres = String(xpart - ypart) + subres;
        }

    }
    while (subres.charAt(0) === '0') {
        subres = subres.slice(1);
    }
    return subres;
}

function moddiv(x, y) {
    var result = "",
        shift = 0,
        temp = 0,
        tempy = "";

    var xpart = x.substring(shift, y.length + shift);
    while (shift + y.length <= x.length) {
        xpart = x.substring(0, y.length + shift);
        tempy = y;
        if (tempy.length < xpart.length) {
            tempy = (new Array(xpart.length - tempy.length + 1)).join("0") + tempy;
        }
        if (xpart > tempy) {
            while (xpart > tempy) {
                xpart = sub(xpart, y);
                if (xpart.length < tempy.length) {
                    xpart = (new Array(tempy.length - xpart.length + 1)).join("0") + xpart;
                }
                temp++;
            }
        }
        console.log("before: " + x + " result: " + result);
        x = xpart + x.substring(y.length + shift);

        result += temp;
        console.log("after: " + x + " result: " + result);
        shift++;
    }
    /* console.log("xpart: " + xpart);*/
    while (xpart.charAt(0) === "0") {
        xpart = xpart.slice(1);
    }
    while (result.charAt(0) === "0") {
        result = result.slice(1);
    }
    return [result, xpart];
}

var strmod = function (x, y) {
    var result = "";
    if (y.length > x.length) {
        return x;
    } else if (y.length === x.length) {
        result = y > x ? x : (moddiv(x, y))[1];
    } else {
        result = (moddiv(x, y))[1];
    }
    console.log("modres: " + result);
    return result;
};
