let TimeKeeper = {
    _view: null,
    _repository: null,
    _userId: "572fd805c61e46aa936bd93dab1ece18",

    _projects: [],

    init: function() {
        this._view = TkView;
        this._repository = TkRepository;

        this._view.init();
        this._view.hideAll();

        var self = this;
        this._repository.loadProjects(this._userId, function(projects) {
            self.log("Projects for user #" + self._userId + " are loaded.");
            console.table(projects);
            self._projects = projects;
            var template = jQuery('#TemplateProjectsDropdown').html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {projects: projects});
            jQuery("#ProjectsDropdown").html(rendered);
        }, function(errorMsg) {
            TkView.showErrors([], errorMsg);
        });
    },

    showProjectsList: function () {
        this.log("Showing projects list view", "debug");
        this._view.showProjectsList();
    },

    showTimingForProject: function (projectId) {
        this.log("Showing timing view for project #" + projectId, "debug");
        this._view.showProjectTimes();
    },

    showProjectEdit: function(projectId) {
        this.log("Showing edit project form", "debug");
        this._view.showProjectEdit();
    },

    showLogTime: function() {
        this.log("Showing log time form...");
        this._view.showTimeEdit();
    },

    saveProject: function() {
        this.log("Saving project...");
        this._view.hideProjectEdit();
    },

    cancelProjectSave: function() {
        this.log("Canceling project save...");
        this._view.hideProjectEdit();
    },

    saveTime: function() {
        this.log("Saving time...");
        let timeEntry = {
            projectId: document.getElementById("TimeProjectId").value,
            minutes: document.getElementById("TimeMinutes").value,
        };

        let errors = this._repository.saveTimeEntry(timeEntry, function() {
            TkView.showSuccess("Time is logged OK");
        }, function() {
            TkView.showErrors([], "Error logging time!");
        });
        if (errors.length < 1) {
            this._view.hideTimeEdit();
            return;
        }

        TkView.showErrors(errors);
    },

    cancelTimeSave: function() {
        this.log("Canceling time save...");
        this._view.hideTimeEdit();
        this._view.clearError();
    },

    setTimeMinutes: function(minutes) {
        this._view.setTimeMinutes(minutes);
    },

    log: function(msg, logLevel = "info") {
        TkLogger.log(msg, logLevel);
    }
};

let TkView = {
    _errorDiv: null,
    _errorMsg: null,
    _projectListDiv: null,
    _projectsTimes: null,
    _projectEditForm: null,
    _timeEditForm: null,

    init: function () {
        this._errorDiv = document.getElementById("ErrorDiv");
        this._errorMsg = document.getElementById("ErrorMsg");

        this._projectListDiv = document.getElementById("ProjectsList");
        this._projectsTimes = document.getElementById("ProjectTimes");
        this._projectEditForm = document.getElementById("ProjectEdit");
        this._timeEditForm = document.getElementById("TimeEdit");

        this.hideAll();
    },

    showSuccess: function(msg, ttlS = 0) {
        alert(msg);
    },

    showErrors: function(errors, msg = "Unexpected error") {
        TkLogger.log("Going to display errors:");
        TkLogger.log(errors);

        this._errorMsg.innerText = msg;
        let s = "";
        errors.forEach(element => {
            s += "<li>" + element.msg + "</li>";
        });
        document.getElementById("ErrorsList").innerHTML = s;
        this._errorDiv.classList.remove("hidden");
    },

    clearError: function() {
        this._errorMsg.innerText = "";
        this._errorDiv.classList.add("hidden");
    },

    showProjectsList: function () {
        this.hideAll();
        this._projectListDiv.classList.remove("hidden");
    },

    showProjectTimes: function() {
        this.hideAll();
        this._projectsTimes.classList.remove("hidden");
    },

    showProjectEdit: function() {
        this.hideAll();
        this._projectEditForm.classList.remove("hidden");
    },

    hideProjectEdit: function() {
        this._projectEditForm.classList.add("hidden");
    },

    showTimeEdit: function() {
        this.hideAll();
        this._timeEditForm.classList.remove("hidden");
    },

    hideTimeEdit: function() {
        this._timeEditForm.classList.add("hidden");
    },

    setTimeMinutes: function(minutes) {
        document.getElementById("TimeMinutes").value = minutes;
    },

    hideAll: function() {
        this._projectListDiv.classList.add("hidden");
        this._projectsTimes.classList.add("hidden");
        this._projectEditForm.classList.add("hidden");
        this._timeEditForm.classList.add("hidden");
        this._errorDiv.classList.add("hidden");
    },
};

let TkLogger = {
    log: function (msg, logLevel = "info") {
        let dt = new Date();
        let hours = dt.getHours();
        let minutes = dt.getMinutes();
        let seconds = dt.getSeconds();

        
        let time = (hours > 9 ? hours : "0" + hours) + ":";
        time += (minutes > 9 ? minutes : "0" + minutes) + ":";
        time += (seconds > 9 ? seconds : "0" + seconds);

        console.log(time + " " + "[" + logLevel.toUpperCase() + "] " + msg);
    },

    debug: function(obj, title = "") {
        this.log(title);
        console.log(obj);
        console.log("---------------------------------------------");
    }
}
