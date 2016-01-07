"use strict";
/*global MutationObserver,model,document*/
var observer = new MutationObserver(function () {
    model.save();
    //alert("dom");
});
var taskTable = document.querySelector("#taskTable");
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
};
observer.observe(taskTable, config);
