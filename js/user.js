function LoginViewModel() {
  var self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");

  self.clearValues = function() {
    self.username("");
    self.password("");
    $("#loginErrorMessage").html("");
  }

  self.login = function() {
    // check if all fields are filled
    if (self.username() === "" || self.password() === "") {
      $("#loginErrorMessage").html("All inputs need to be filled.");
    }
    else {
      tasksViewModel.login({
        name: self.username(),
        password: self.password()
      }, self);
    }
  }

  self.createUser = function() {
    tasksViewModel.openUserRegistration();
  }
}


function CreateUserViewModel() {
  var self = this;
  self.username = ko.observable("");
  self.password = ko.observable("");
  self.verifyPassword = ko.observable("");

  self.clearValues = function() {
    self.username("");
    self.password("");
    self.verifyPassword("");
    $("#createUserErrorMessage").html("");
  }

  self.createUser = function() {
    // check if passwords match
    if (self.password() !== self.verifyPassword()) {
      $("#createUserErrorMessage").html("The passwords don't match.");
      self.password("");
      self.verifyPassword("");
    }
    // check if all fields are filled
    else if (self.username() === "" || self.password() === "" || self.verifyPassword() === "") {
      $("#createUserErrorMessage").html("All inputs need to be filled.");
    }
    else {
      tasksViewModel.registerUser({
        name: self.username(),
        password: self.password()
      }, self);
    }
  }
}


function UsernameSettingViewModel() {
  var self = this;
  self.user = null;
  self.newUsername = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
  }

  self.clearValues = function() {
    self.newUsername("");
    $("#usernameSettingErrorMessage").html("");
  }

  self.updateUser = function() {
    if (self.newUsername() === "") {
      $("#usernameSettingErrorMessage").html("Please enter a new username.");
    }
    else {
      tasksViewModel.updateUser(self.user.userURI, {
        name: self.newUsername()
      }, self);
    }
  }
}


function PasswordSettingViewModel() {
  var self = this;
  self.user = null;
  self.newPassword = ko.observable("");
  self.verifyNewPassword = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
  }

  self.clearValues = function() {
    self.newPassword("");
    self.verifyNewPassword("");
    $("#passwordSettingErrorMessage").html("");
  }

  self.updateUser = function() {
    if (self.newPassword() === "" || self.verifyNewPassword() === "") {
      $("#passwordSettingErrorMessage").html("All inputs need to be filled.");
    }
    else if (self.newPassword() !== self.verifyNewPassword()) {
      $("#passwordSettingErrorMessage").html("The passwords don't match.");
      self.newPassword("");
      self.verifyNewPassword("");
    }
    else {
      tasksViewModel.updateUser(self.user.userURI, {
        password: self.newPassword()
      }, self);
    }
  }
}


function VisionSettingViewModel() {
  var self = this;
  self.user = null;
  self.vision = ko.observable("");

  self.setUser = function(user) {
    self.user = user;
    self.vision(user.vision)
  }

  self.clearValues = function() {
    self.vision("");
    $("#visionSettingErrorMessage").html("");
  }

  self.updateUser = function() {
    if (self.vision() === "") {
      $("#visionSettingErrorMessage").html("Please provide a value.");
    }
    else {
      tasksViewModel.updateUser(self.user.userURI, {
        vision: parseInt(self.vision())
      }, self);
    }
  }
}


var loginViewModel = new LoginViewModel();
var createUserViewModel = new CreateUserViewModel();
var usernameSettingViewModel = new UsernameSettingViewModel();
var passwordSettingViewModel = new PasswordSettingViewModel();
var visionSettingViewModel = new VisionSettingViewModel();
ko.applyBindings(loginViewModel, $("#login")[0]);
ko.applyBindings(createUserViewModel, $("#createUser")[0]);
ko.applyBindings(usernameSettingViewModel, $("#settings-username")[0]);
ko.applyBindings(passwordSettingViewModel, $("#settings-password")[0]);
ko.applyBindings(visionSettingViewModel, $("#settings-vision")[0]);
