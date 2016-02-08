"use strict";
var iban = function (blz, kto) {
    var blznrtemp = String(Math.floor(blz / 97));
    var blzrest = blz % 97;
    var blznr = String(blz);
    var bban = blznr;
    var konto = String(kto);
    while (konto.length < 10) {
        konto = "0" + konto;
    }
    bban += konto + "131400";

    var pruef = String(98 - Number(strmod(bban, "97")));
    pruef = pruef.length === 1 ? pruef = "0" + pruef : pruef;
    return "DE" + pruef + blznr + konto;
};
