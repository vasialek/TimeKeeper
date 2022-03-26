function TimeKeeperViewModel() {
    // Data
    let self = this;
    self.isProjectsListVisible = ko.observable(false);
    self.isTimesListVisible = ko.observable(true);
    self.isTimeEditVisible = ko.observable(false);
    self.isProjectEditVisible = ko.observable(false);
    self.isProjectsDropdownVisible = ko.observable(false);

    self.userData = ko.observable(new UserData("02dc14f9b2d6480981f08a7953c3ae3a", "Test user", "fake@email.zzz", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgdXNlciIsImlhdCI6MTUxNjIzOTAyMiwidWlkIjoiMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMiJ9.tUFNdahdZXrWUYfKyBCGjI9EqUUvxpJZj5Hqd2c4omo"));
    self.loginModel = ko.observable(new LoginModel("", ""));

    self.errorMessage = ko.observable(new ErrorMessage("", []));

    self.projects = ko.observableArray([]);
    self.customProjects = ko.observableArray([]);

    self.timeButtons = [
        new MinutesEntry(15), new MinutesEntry(30), new MinutesEntry(45), 
        new MinutesEntry(60), new MinutesEntry(90), new MinutesEntry(120), 
    ];
    // Custom project display/edit
    self.selectedCustomProject = ko.observable(new CustomProjectEntry("", "G19"));
    self.customEntries = ko.observableArray([]);
    self.customTimes = ko.observableArray([]);
    self.customEntryDate = ko.observable(TkHelper.getCurrentDate());
    self.customEntryCount = ko.observable(0);
    
    self.selectedProject = ko.observable(new ProjectEntry("", "", 0));
    self.times = ko.observableArray([]);
    self.timeToEdit = ko.observable(new TimeEntryEditable(null, TkHelper.getCurrentDate(), 0));
    self.projectToEdit = ko.observable(new ProjectEntry("", "", 0));

    // Filter for time entries
    self.filterForTimes = ko.observable(new FilterForTimes("", "", null));

    // Events on Times/Projects length modified
    // self.projects.subscribe(function(e) {
    //     console.log("Array changed");
    //     console.log(e);
    // }, null, "arrayChange");

    // self.times.subscribe(function(e) {
    //     console.log("Times list is changed");
    //     console.log(e);
    //     for (let i = 0; i < e.length; i++) {
    //         if (e[i].status == "added") {
    //             self.onTimeCreated(e[i].value);
    //         } else {
    //             console.log("Unknown TimeEntry status: " + e[i].status);
    //         }
    //     }
    // }, null, "arrayChange");

    self.init = function() {
        console.log("Doing initialization work...");
        self.loadTimeEntries();
        self.loadProjects();
    };

    self.loadTimeEntries = function() {
        Repository.loadTimeEntries(self.userData(), function(entries) {
            console.log(entries);
            self.times.removeAll();
            for (let i = 0; i < entries.length; i++) {
                self.times.push(new TimeEntry(entries[i]));
            }
        }, function(errors) {
            self.showErrorMessage("Error loading time entries", errors, 20);
        });
    };

    self.loadProjects = function() {
        Repository.loadProjects(self.userData(), function(projects) {
            self.projects.removeAll();
            for (let i = 0; i < projects.length; i++) {
                self.projects.push(new ProjectEntry(projects[i].projectId, projects[i].name, projects[i].costPerHourMinor, projects[i].isEnabled));
            }
        }, function(errors) {
            self.showErrorMessage("Error loading projects", errors, 20);
        });

        Repository.loadCustomProjects(self.userData(), function(customProjects) {
            console.table(customProjects);
            self.customProjects.removeAll();
            customProjects.forEach(p => {
                const customProject = new CustomProjectEntry(p.projectId, p.name);
                self.customProjects.push(customProject)
            });
        }, function(errors) {
            self.showErrorMessage("Error loading custome projects", errors, 20);
        })
    };

    self.filterByProject = function(timeEntry) {
        console.log(timeEntry);
        console.log("Going to filter by project: " + timeEntry.projectId);

        let current = self.filterForTimes();
        self.filterForTimes(new FilterForTimes(timeEntry.projectName, timeEntry.projectId, current.isPaid));

        self.applyFilterForTimes(self.filterForTimes());
    };

    self.filterByPaidStatus = function(timeEntry) {
        console.log(timeEntry);
        console.log("Going to filter by isPaid: " + timeEntry.isPaid);

        let current = self.filterForTimes();
        self.filterForTimes(new FilterForTimes(current.projectName, current.projectId, timeEntry.isPaid));

        self.applyFilterForTimes(self.filterForTimes());
    };

    self.applyFilterForTimes = function(filter) {
        if (filter.projectName.length > 0) {
            console.log("Applying project filter for project ID: " + filter.projectId);
            self.times.remove(function(item) {
                return item.projectId != filter.projectId;
            });
        }

        if (filter.isPaid != null) {
            console.log("Applying filter by is paid: " + filter.isPaid);
            self.times.remove(function(item) {
                return item.isPaid != filter.isPaid;
            });
        }
    };

    self.removeFilterByProject = function() {
        let current = self.filterForTimes();
        self.filterForTimes(new FilterForTimes("", "", current.isPaid));
        self.loadTimeEntries();
        self.applyFilterForTimes(self.filterForTimes());
    };

    self.removeFilterByPaidStatus = function() {
        let current = self.filterForTimes();
        self.filterForTimes(new FilterForTimes(current.projectName, current.projectId, null));
        self.loadTimeEntries();
        self.applyFilterForTimes(self.filterForTimes());
    };

    self.projectDropdownClass = ko.computed(function() {
        console.log("Is drop down visible: " + self.isProjectsDropdownVisible());
        if (self.isProjectsDropdownVisible()) {
            return "dropdown-menu show";
        }
        return "dropdown-menu";
    });

    self.toggleProjectDropdown = function() {
        self.isProjectsDropdownVisible(!self.isProjectsDropdownVisible());
    };

    self.goToProject = function(project) {
        self.selectedProject(project);
        self.isProjectsDropdownVisible(false);
        self.isTimeEditVisible(false);
        self.isTimesListVisible(true);
    };

    self.setMinutes = function(button) {
        self.timeToEdit().minutes(button.minutes);
    };

    self.setCustomCount = function(count) {
        self.customEntryCount(count);
    }

    self.showTimeEdit = function() {
        self.isTimeEditVisible(true);
    };

    self.showProjectEdit = function() {
        self.isProjectEditVisible(true);
    };

    self.showProjectsList = function() {
        self.isProjectsListVisible(true);
    };

    self.showCustomProject = function(customProject) {
        console.log("Showing custom project:");
        console.log(customProject);
        self.selectedCustomProject(customProject);
    };

    self.logout = function () {
        self.userData(new UserData("", "", "", ""));
    };

    self.login = function () {
        let login = self.loginModel();
        Repository.login({
            clientId: "FakeClientId",
            email: login.email,
            password: login.password
        }, function(user) {
            self.userData(new UserData(user.userId, user.nick, user.email, user.jwt));
        }, function(errors) {
            self.showErrorMessage("Can't log you in", errors, 20);
        });
    };

    self.createTime = function() {
        let timeEntry = self.timeToEdit();
        console.log("Creating time entry:");
        console.log(timeEntry);

        let project = timeEntry.project();
        Repository.createTimeEntry(self.userData(), {
            isPaid: false,
            projectId: project.projectId,
            projectName: project.name(),
            date: timeEntry.date,
            priceMinor: TkHelper.calculateCost(timeEntry.minutes(), project.costPerHour()),
            minutes: timeEntry.minutes(),
            remarks: timeEntry.remarks,
        }, function(createdEntry) {
            console.log("Persisted OK.");
            self.times.push(new TimeEntry(createdEntry));
            self.cancelCreateTime();
        }, function(errors) {
            // console.log("Error persisting Time entry:");
            // console.log(errors);
            self.showErrorMessage("Error creating Time entry", errors, 10);
        });
    };

    self.cancelCreateTime = function() {
        self.isTimeEditVisible(false);
    };

    self.saveCustomEdit = function() {
        console.log("Saving entry for custom project:");
        console.log(self.selectedCustomProject());
        
    };

    self.clearCustomEdit = function() {
        self.customEntryCount(0);
        self.customEntryDate(TkHelper.getCurrentDate());
        self.selectedCustomProject(new CustomProjectEntry("", ""));
    };

    self.deleteTimeEntry = function(timeEntry) {
        console.log("Going to delete Time entry:");
        console.log(timeEntry);
        Repository.deleteTimeEntry(self.userData(), timeEntry, function() {
            console.log("Deleted");
            self.times.remove(timeEntry);
        }, function(errors) {
            self.showErrorMessage("Error deleting Time entry", errors);
        })
    };

    self.togglePaidStatus = function(timeEntry) {
        console.log("Going to toggle Paid status of Time entry:");
        console.log(timeEntry);
        let newStatus = !timeEntry.isPaid;
        Repository.setPaidStatus(self.userData(), timeEntry, newStatus, function() {
            console.log("Is paid status was changed to: " + newStatus);
            timeEntry.isPaid = newStatus;
            self.times.replace(timeEntry, new TimeEntry(timeEntry));
        }, function(errors) {
            self.showErrorMessage("Error changing paid status of Time entry", errors, 30);
        });
    },

    self.onTimeCreated = function(timeEntry) {
        console.log(timeEntry);
    },

    self.cancelEditProject = function() { 
        self.isProjectEditVisible(false);
    };

    self.createProject = function(form) {
        console.log("Saving project...");
        console.log(self.projectToEdit());
        self.projects.push(self.projectToEdit());
        self.projectToEdit(new ProjectEntry("", "", 0));
        self.isProjectEditVisible(false);
    };

    self.showErrorMessage = function(msg, errors, timeoutS) {
        self.errorMessage(new ErrorMessage(msg, errors));
        if (timeoutS > 0) {
            setTimeout(function() {
                self.errorMessage(new ErrorMessage("", ""));
            }, timeoutS * 1000);
        }
    };

    self.clearErrorMessage = function() {
        self.errorMessage(new ErrorMessage("", []));
    };
};

let viewModel = new TimeKeeperViewModel();
ko.applyBindings(viewModel);
viewModel.init();
