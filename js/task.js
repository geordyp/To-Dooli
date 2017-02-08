function TaskAddViewModel() {
  var self = this;
  self.name = ko.observable("");
  self.taskGroup = ko.observable("");
  self.dueDate = ko.observable("");
  self.headsUp = ko.observable("");
  self.notes = ko.observable("");

  self.clearValues = function() {
    self.name("");
    self.taskGroup("");
    self.dueDate("");
    self.headsUp("");
    self.notes("");
    $("#taskAddErrorMessage").html("");
  }

  self.taskAdd = function() {
    // check if the needed fields are filled
    if (self.name() === "" || self.taskGroup() === "" || self.dueDate() === "") {
      $("#taskAddErrorMessage").html("Please fill in Task, Task Group, and Due Date.");
    }
    else {
      var dueDatePieces = self.dueDate().split("-");
      var dueDate = dueDatePieces[1] + "-" + dueDatePieces[2] + "-" + dueDatePieces[0];

      if (self.headsUp() !== "") {
        var headsUpPieces = self.headsUp().split("-");
        var headsUp = headsUpPieces[1] + "-" + headsUpPieces[2] + "-" + headsUpPieces[0];
      }
      else {
        var headsUp = "";
      }

      tasksViewModel.taskAdd({
        name: self.name(),
        task_group: self.taskGroup(),
        due_date: dueDate,
        heads_up: headsUp,
        notes: self.notes()
      });
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


var taskAddViewModel = new TaskAddViewModel();
var editTaskViewModel = new EditTaskViewModel();
var deleteTaskViewModel = new DeleteTaskViewModel();
ko.applyBindings(taskAddViewModel, $("#taskAdd")[0]);
ko.applyBindings(editTaskViewModel, $("#editTask")[0]);
ko.applyBindings(deleteTaskViewModel, $("#deleteTask")[0]);
