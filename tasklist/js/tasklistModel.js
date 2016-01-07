"use strict";
/*global ko, localStorage*/
function TasklistModel() {
    var self = this;
    self.tasks = ko.observableArray([
	]);
    self.data = ko.observable("");
    self.addTask = function () {
        self.tasks.push({
            description: ko.observable(""),
            done: ko.observable(false)
        });
        //self.save();
    };
    self.removeTask = function () {
        self.tasks.remove(this);
        //self.save();
    };
    self.load = function () {
        var json = localStorage.getItem("tasks");
        var parsed = JSON.parse(json);
        var tasks = [];
        if (parsed !== null) {
            parsed.forEach(function (task) {
                tasks.push({
                    description: ko.observable(task.description),
                    done: ko.observable(task.done)
                });
            });
            self.tasks(tasks);
            self.data("loaded " + json);
        }
    };
    self.save = function () {
        localStorage.removeItem("tasks");
        localStorage.setItem("tasks", ko.toJSON(self.tasks));
        self.data("saved " + ko.toJSON(self));
    };


    self.load();
}
var model = new TasklistModel();
ko.applyBindings(model);
