let TkRepository = {
    _baseUrl: "http://localhost:28079/api/v1/",

    saveTimeEntry: function(timeEntry, callback, errorCallback) {
        this.log("Going to log " + timeEntry.minutes + " minutes for project ID #" + timeEntry.projectId);
        TkLogger.debug(timeEntry, "Time entry to log");
        let errors = this._validateTimeEntry(timeEntry);
        if (errors.length > 0) {
            return errors;
        }

        this._post(this._baseUrl + "time", timeEntry, callback, errorCallback);
        return [];
    },

    loadProjects: function(userId, callback, errorCallback) {
        if (userId.length != 32) {
            errorCallback("Invalid ID of logged in user.");
        }

        let url = this._baseUrl + "projects";

        this._get(url, function(xhr) {
            TkLogger.debug(xhr, "Response from get projects");
            let response = JSON.parse(xhr.responseText);
            if (response.status === true) {
                callback(response.projects);
            } else {
                errorCallback("Got error from server. " + (response.message != null ? response.message : "Unknown error"));
            }
        }, function(xhr) {
            TkLogger.log("HTTP status of failed loaded projects is: " + xhr.status);
            errorCallback("Error loading your projects, please check that network is ok.");
        });
    },

    _get: function(url, callback, errorCallback) {
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.open("GET", url);
        xhr.onerror = function() {
            self.log("Error GETing from " + url, "error");
            errorCallback(this);
        }
        xhr.onload = function(resp) {
            self.log("Got response from GET request.", "info");
            callback(this);
        }
        xhr.send(null);
    },

    _post: function(url, object, callback, errorCallback) {
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.open("POST", url);
        xhr.onerror = function() {
            self.log("Error POSTing to " + url, "error");
            errorCallback();
        }
        xhr.onload = function(resp) {
            self.log(resp, "info");
            callback();
        }
        xhr.send(object);
    },

    _validateTimeEntry: function(timeEntry) {
        let errors = [];

        if (timeEntry.projectId.length != 32) {
            errors.push({msg: "Invalid ID of project to log time"});
        }
        if (timeEntry.minutes < 1) {
            errors.push({msg: "Logged minutes should be greater than 0."})
        }

        return errors;
    },

    log: function(msg, logLevel = "info") {
        TkLogger.log(msg, logLevel);
    }
}
