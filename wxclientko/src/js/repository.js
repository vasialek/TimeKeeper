let Repository = {
    _baseUrl: "http://localhost:28079/api/v1/",

    loadProjects: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        let self = this;
        self._doGet(self._baseUrl + "projects", function(json) {
            let response = JSON.parse(json);
            console.log(response);
            callback(response.projects);
        }, function(xhr) {
            console.log("Error loading projects from server.");
            errorCallback(["Error communicating with remote server."]);
        });

    },

    createTimeEntry: function(user, timeEntry, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        let errors = TkValidator.validateTimeEntry(timeEntry);
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        let self = this;

        let model = {
            "projectId": "50d8e67673a84d17964ee0834fb72fc9",
            "date": "2019-12-30",
            "minutes": 25
          };

          // self._doPost(self._baseUrl + "times/1234/", JSON.stringify(model), function(json) {
        self._doPost(self._baseUrl + "times", JSON.stringify(timeEntry), function(json) {
          console.log("Time entry was created on server.");
            let response = JSON.parse(json);
            console.log(response);
            if (response.status == true) {
                callback(response.timeEntry);
            } else {
                errorCallback(["There was an error saving Time entry."]);
            }
        }, function(xhr) {
            console.log("Error creating Time entry");
        });
    },

    setPaidStatus: function(user, timeEntry, isPaid, callback, errorCallback) {
        // let errors = TkValidator.ensureCouldModify(user.jwt, timeEntry.userId, "You can't change status for other user.");
        // if (errors.length > 0) {
        //     errorCallback(errors);
        //     return;
        // }

        let self = this;
        let paidStatus = isPaid ? "1" : "0";
        self._doGet(self._baseUrl + "times/" + timeEntry.timeEntryId + "/paid/" + paidStatus, function(json) {
            let response = JSON.parse(json);
            if (response.status == true) {
                callback(timeEntry);
            } else {
                errorCallback(["There was an error changing status of Time enty."]);
            }
        }, function(xhr) {
            errorCallback(["Error communicating with remote server."]);
        })
    },

    loadTimeEntries: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        let self = this;
        self._doGet(self._baseUrl + "times", function(json) {
            console.log("Loaded Times entry");
            let response = JSON.parse(json);
            callback(response.timeEntries);
        }, function(xhr) {
            console.log("Error loading Time entry." + xhr.status + " " + xhr.statusText);
            errorCallback(["Error communicating with remote server."]);
        });
    },

    deleteTimeEntry: function(user, timeEntry, callback, errorCallback) {
        // let errors = TkValidator.ensureCouldModify(user.jwt, timeEntry.userId, "You can't delete other user Time entry.");
        // if (errors.length > 0) {
        //     errorCallback(errors);
        //     return;
        // }

        let self = this;
        self._doDelete(self._baseUrl + "times/" + timeEntry.timeEntryId, function(json) {
            console.log("Got response on Time entry delete:");
            console.log(json);
            let response = JSON.parse(json);
            if (response.status == true) {
                callback(timeEntry);
            } else {
                errorCallback(["There was an error deleting Time entry"]);
            }
        }, function(xhr) {
            errorCallback(["Error communicating with remote server."]);
        });
    },

    _doGet(url, callback, errorCallback) {
        this._doRequest(url, "GET", callback, errorCallback);
    },

    _doDelete(url, callback, errorCallback) {
        this._doRequest(url, "DELETE", callback, errorCallback);
    },

    _doRequest(url, method, callback, errorCallback) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() {
            console.log("Got response from server: " + xhr.status + " (" + xhr.statusText + ")");
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(xhr.responseText);
            } else {
                errorCallback(xhr);
            }
        };
        xhr.onerror = function() {
            console.log("Error sending " + method + " request to " + url + "." + xhr.status + " " + xhr.statusText);
            errorCallback(xhr);
        };
        xhr.send();
    },

    _doPost(url, data, callback, errorCallback) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.setRequestHeader("Accept", "*/*");
        // xhr.setRequestHeader("Sec-Fetch-Dest", "object");
        // xhr.setRequestHeader("Content-Length", data.length);

        xhr.onload = function() {
            callback(xhr.responseText);
        };
        xhr.onerror = function() {
            console.log("Error POSTing request to " + url + "." + xhr.status + " " + xhr.statusText);
            errorCallback(xhr);
        };
        xhr.send(data);
    }
};
