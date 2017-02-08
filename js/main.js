function TasksViewModel() {
  var self = this;
  self.loginURI = "http://localhost:5000/ondeck/api/v1.0/user/login";
  self.registerUserURI = "http://localhost:5000/ondeck/api/v1.0/user";
  self.serverLogin = {
    username: "me",
    password: "password"
  };

  self.user = ko.observable(null);
  self.tasks = ko.observableArray([]);
  self.doneView = ko.observable(null);
  var currentView = "";

  self.openLogin = function() {
    $("#login").modal("show");
    loginViewModel.clearValues();
  }

  self.openUserRegistration = function() {
    $("#createUser").modal("show");
  }

  self.openUsernameSetting = function() {
    $("#settings-username").modal("show");
    usernameSettingViewModel.setUser(self.user());
  }

  self.openPasswordSetting = function() {
    $("#settings-password").modal("show");
    passwordSettingViewModel.setUser(self.user());
  }

  self.openVisionSetting = function() {
    $("#settings-vision").modal("show");
    visionSettingViewModel.setUser(self.user());
  }

  self.openAdd = function() {
    $("#addTask").modal("show");
  }

  self.openEdit = function(task) {
    $("#editTask").modal("show");
    editTaskViewModel.setTask(task);
  }

  self.openDelete = function(task) {
    deleteTaskViewModel.setTask(task);
  }

  self.ajax = function(uri, method, data) {
    var request = {
      url: uri,
      type: method,
      contentType: "application/json",
      accepts: "application/json",
      cache: false,
      dataType: "json",
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization",
                             "Basic " + btoa(self.serverLogin.username + ":" + self.serverLogin.password));
      },
      error: function(jqXHR) {
        console.error("ajax error: " + jqXHR.responseText);
      }
    };
    return $.ajax(request);
  }

  self.registerUser = function(user) {
    self.ajax(self.registerUserURI, "POST", user).done(function(data) {
      $("#createUser").modal("hide");
      createUserViewModel.clearValues();
      self.user(data.user[0]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid username")) {
        $("#createUserErrorMessage").html("Invalid username.");
      }
      else if (jqXHR.responseText.includes("Invalid password")) {
        $("#createUserErrorMessage").html("Invalid password.");
        createUserViewModel.password("");
        createUserViewModel.verifyPassword("");
      }
      else if (jqXHR.responseText.includes("Username is taken")) {
        $("#createUserErrorMessage").html("That username is taken.");
      }
      else {
        $("#createUserErrorMessage").html("We couldn't create the account. Please try again.");
      }
    });
  }

  self.updateUser = function(userURI, data, settingViewModel) {
    self.ajax(userURI, 'PUT', data, settingViewModel).done(function(data) {
        $('#settings-username').modal('hide');
        $('#settings-password').modal('hide');
        $('#settings-vision').modal('hide');
        settingViewModel.clearValues();
        self.user(data.user[0]);
    }).fail(function(jqXHR) {
      console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid username")) {
        $("#usernameSettingErrorMessage").html("Invalid username.");
      }
      else if (jqXHR.responseText.includes("Username is taken")) {
        $("#usernameSettingErrorMessage").html("That username is taken.");
      }
      else if (jqXHR.responseText.includes("Invalid password")) {
        $("#passwordSettingErrorMessage").html("Invalid password.");
        settingViewModel.clearValues();
      }
      else if (jqXHR.responseText.includes("Invalid on deck setting")) {
        $("#passwordSettingErrorMessage").html("Invalid on deck setting.");
      }
      else {
        $("#usernameSettingErrorMessage").html("We couldn't update the account. Please try again.");
        $("#passwordSettingErrorMessage").html("We couldn't update the account. Please try again.");
        $("#visionSettingErrorMessage").html("We couldn't update the account. Please try again.");
      }
    });
  }

  self.login = function(user) {
    self.ajax(self.loginURI, "POST", user).done(function(data) {
      $("#login").modal("hide");
      self.user(data.user[0]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      console.error(jqXHR);
      if (jqXHR.responseText.includes("Invalid login")) {
        $("#loginErrorMessage").html("Incorrect username or password.");
        loginViewModel.password("");
      }
      else {
        $("#loginErrorMessage").html("We couldn't log into your account. Please try again.");
      }
    });
  }

  self.logout = function() {
    self.user(null);
    self.tasks([]);
  }

  self.addTask = function(task) {
    self.ajax(self.user().createTaskURI, "POST", task).done(function(data) {
      $("#addTask").modal("hide");

      self.tasks([]);
      self.getActiveTasks();
    }).fail(function(jqXHR) {
      console.error(jqXHR);
      $("#addTaskErrorMessage").html("We couldn't create the task.");
    });
  }

  self.editTask = function(taskURI, task) {
    self.ajax(taskURI, 'PUT', task).done(function(data) {
        $('#editTask').modal('hide');

        self.tasks([]);
        if (currentView === "active")
          self.getActiveTasks();
        else if (currentView === "ondeck")
          self.getOnDeckTasks();
        else
          self.getDoneTasks();
    }).fail(function(jqXHR) {
      console.error(jqXHR);
      $("#editTaskErrorMessage").html("We couldn't update the task.");
    });
  }

  self.deleteTask = function(task) {
    self.ajax(task.uri(), 'DELETE').done(function() {
      $('#deleteTask').modal('hide');

      var taskList = self.tasks();
      var index = taskList.indexOf(task);
      taskList.splice(index, 1);
      self.tasks(taskList);
    }).fail(function(jqXHR) {
      console.error(jqXHR);
      $("#deleteTaskErrorMessage").html("We couldn't delete the task.");
    });
  }

  self.toggleDone = function(task) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if (dd<10) {dd='0'+dd;}
    if (mm<10) {mm='0'+mm;}

    var todayStr = yyyy + "-" + mm + "-" + dd;
    if (task.done() === false) {
      data = {
        done: true,
        completion_date: todayStr
      };
    }
    else {
      data = {
        done: false,
        completion_date: ""
      };
    }

    self.ajax(task.uri(), 'PUT', data).done(function(data) {
      var taskList = self.tasks();
      var index = taskList.indexOf(task);
      taskList.splice(index, 1);
      self.tasks(taskList);
    }).fail(function(jqXHR) {
      console.error(jqXHR);
    });
  }

  self.getActiveTasks = function() {
    $("#pill-active").addClass("active");
    $("#pill-ondeck").removeClass("active");
    $("#pill-done").removeClass("active");
    self.doneView(false);
    currentView = "active";
    self.getTasks(self.user().activeTasksURI)
  }

  self.getOnDeckTasks = function() {
    $("#pill-ondeck").addClass("active");
    $("#pill-active").removeClass("active");
    $("#pill-done").removeClass("active");
    self.doneView(false);
    currentView = "ondeck";
    self.getTasks(self.user().onDeckTasksURI)
  }

  self.getDoneTasks = function() {
    $("#pill-done").addClass("active");
    $("#pill-ondeck").removeClass("active");
    $("#pill-active").removeClass("active");
    self.doneView(true);
    currentView = "done";
    self.getTasks(self.user().doneTasksURI)
  }

  self.getTasks = function(taskURI) {
    self.ajax(taskURI, "GET").done(function(data) {
      self.tasks([])
      for (var i = 0; i < data.tasks.length; i++) {
        var dueDate = new Date(data.tasks[i].due_date)
        var dueDateString = getDayString(dueDate.getUTCDay()) + " " + getMonthString(dueDate.getMonth()) + " " + dueDate.getUTCDate();
        self.tasks.push({
          name: ko.observable(data.tasks[i].name),
          commitment: ko.observable(data.tasks[i].commitment),
          notes: ko.observable(data.tasks[i].notes),
          dueDateString: ko.observable(dueDateString),
          dueDate: ko.observable(data.tasks[i].due_date),
          daysLeft: ko.observable(data.tasks[i].days_left),
          headsUp: ko.observable(data.tasks[i].heads_up),
          done: ko.observable(data.tasks[i].done),
          completionDate: ko.observable(data.tasks[i].completion_date),
          uri: ko.observable(data.tasks[i].uri)
        });
      }
    });
  }

  getDayString = function(d) {
    switch (d) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      default:
        console.error("day out of range");
        return;
    }
  }

  getMonthString = function(m) {
    switch (m) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sep";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
      default:
        console.error("month out of range");
        return;
    }
  }
}


var tasksViewModel = new TasksViewModel();
ko.applyBindings(tasksViewModel, $("#main")[0]);

$(document).ready(function(){
    $("[data-toggle='popover']").popover();
});
