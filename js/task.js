function AddTaskViewModel() {
  var self = this;
  self.name = ko.observable("");
  self.commitment = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.addTask = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.commitment() === "" || self.dueDate() === "") {
      $("#addTaskErrorMessage").html("Please fill in Task, Commitment, and Due Date.");
    }
    else {
      tasksViewModel.addTask({
        name: self.name(),
        commitment: self.commitment(),
        due_date: self.dueDate(),
        heads_up: self.headsUp(),
        notes: self.notes()
      });

      self.name("");
      self.commitment("");
      self.dueDate("");
      self.headsUp("");
      self.notes("");
      $("#addTaskErrorMessage").html("");
    }
  }
}


function EditTaskViewModel() {
  var self = this;
  self.task = null;
  self.name = ko.observable("");
  self.commitment = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.setTask = function(task) {
    self.task = task;
    self.name(task.name());
    self.commitment(task.commitment());
    self.dueDate(task.dueDate());
    self.headsUp((task.headsUp() == null) ? "" : task.headsUp());
    self.notes((task.notes() == null) ? "" : task.notes());
  }

  self.editTask = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.commitment() === "" || self.dueDate() === "") {
      $("#editTaskErrorMessage").html("Please fill in Task, Commitment, and Due Date.");
    }
    else {
      tasksViewModel.editTask(self.task.uri(), {
        name: self.name(),
        commitment: self.commitment(),
        due_date: self.dueDate(),
        heads_up: self.headsUp(),
        notes: self.notes()
      });

      self.name("");
      self.commitment("");
      self.dueDate("");
      self.headsUp("");
      self.notes("");
      $("#editTaskErrorMessage").html("");
    }
  }
}


function DeleteTaskViewModel() {
  var self = this;
  self.task = null;
  self.name = ko.observable("");

  self.setTask = function(task) {
    self.task = task;
    self.name(task.name());

    $("#deleteTask").modal("show");
  }

  self.deleteTask = function() {
    tasksViewModel.deleteTask(self.task);
    $("#deleteTaskErrorMessage").html("");
  }
}


var addTaskViewModel = new AddTaskViewModel();
var editTaskViewModel = new EditTaskViewModel();
var deleteTaskViewModel = new DeleteTaskViewModel();
ko.applyBindings(addTaskViewModel, $("#addTask")[0]);
ko.applyBindings(editTaskViewModel, $("#editTask")[0]);
ko.applyBindings(deleteTaskViewModel, $("#deleteTask")[0]);
