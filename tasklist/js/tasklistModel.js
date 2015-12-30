function tasklistModel(){
	var self=this;
	self.tasks=ko.observableArray([
	]);
	self.data=ko.observable("");
	self.addTask=function(){
		self.tasks.push(
			{
				description: ko.observable(""),
				done: ko.observable(false)	
			}
		);
		//self.save();
	};
	self.removeTask=function(){
		self.tasks.remove(this);
		//self.save();
	};
	self.load=function(){				
		var json=localStorage.getItem("tasks");
	var parsed=JSON.parse(json);
		self.tasks(parsed.tasks);
		self.data("loaded "+json);
	};
	self.save=function(){
		localStorage.setItem("tasks",ko.toJSON(self));
		self.data("saved "+ ko.toJSON(self));
	};
};
var model=new tasklistModel();
ko.applyBindings(model);
model.load();