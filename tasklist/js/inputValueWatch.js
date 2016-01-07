"use strict";
/*global $,model*/
$('input').on('keyup', function () {
    model.save();
});
