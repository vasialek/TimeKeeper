function TimeKeeperViewModel() {
    // Data
    let self = this;
    self.isProjectsListVisible = ko.observable(false);
    self.isTimesListVisible = ko.observable(false);
    self.isTimeEditVisible = ko.observable(false);
    self.isProjectEditVisible = ko.observable(false);
    self.isProjectsDropdownVisible = ko.observable(false);
    self.isAchievmentEntriesVisible = ko.observable(false);

    self.isLoading = ko.observable(false);
    self.settings = new TkSetting(false);
    self.userData = ko.observable(new UserData("", "", "", 0, ""));
    self.loginModel = ko.observable(new LoginModel("", ""));

    self.errorMessage = ko.observable(new ErrorMessage("", []));

    self.projects = ko.observableArray([]);

    self.timeButtons = [
        new MinutesEntry(15), new MinutesEntry(30), new MinutesEntry(45), 
        new MinutesEntry(60), new MinutesEntry(90), new MinutesEntry(120), 
    ];
    self.selectedProject = ko.observable(new ProjectEntry("", "", 0));
    self.times = ko.observableArray([]);
    self.timeToEdit = ko.observable(new TimeEntryEditable(null, TkHelper.getCurrentDate(), 0));
    self.projectToEdit = ko.observable(new ProjectEntry("", "", 0));

    // custom achievments
    self.selectedAchievment = ko.observable(new Achievment("", "", ""));
    self.achievments = ko.observableArray([]);
    self.achievmentEtryToEdit = ko.observable(new AchievmentEntry("", "", "", TkHelper.getCurrentDate(), 0));
    self.achievmentEntries = ko.observableArray([]);

    // Filter for time entries
    self.filterForTimes = ko.observable(new FilterForTimes("", "", null));

    // unpaid for times
    self.unpaid = ko.observable(0);

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
        self.userData(TkLocaStorage.loadUserData());
        console.log("Loaded user:");
        console.log(self.userData());
        if (self.userData().isLoggedIn()) {
            self.loadTimeEntries();
            self.loadProjects();
            self.loadAchievments();
            self.isTimesListVisible(true);
            TkTimer.startJwtRefresh(function() {
                Repository.refreshJwt(self.userData(), function() {
                    console.log("JWT is refreshed");
                }, function() {
                    console.log("error, stopping JWT refresh...");
                    TkTimer.stopJwtRefresh();
                });
            }, 120);
        } else {
            console.log(TkLocaStorage.loadLoginData());
            self.loginModel(TkLocaStorage.loadLoginData());
        }
    };

    self.loadTimeEntriesForProject = function(project) {
        self.loadTimeEntries();
        self.filterForTimes(new FilterForTimes(project.name(), project.projectId, null));
        self.applyFilterForTimes(self.filterForTimes());
    };

    self.loadTimeEntries = function() {
        Repository.loadTimeEntries(self.userData(), function(entries) {
            console.log(entries);
            let unpaid = 0;
            self.times.removeAll();
            for (let i = 0; i < entries.length; i++) {
                self.times.push(new TimeEntry(entries[i]));
                if (entries[i].isPaid === false) {
                    unpaid += entries[i].priceMinor;
                }
            }
            self.unpaid(unpaid / 100);
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
    };

    self.loadAchievments = function(achievment) {
        Repository.loadAchievments(self.userData(), function(achievments) {
            console.log(achievments);
            self.achievments.removeAll();
            for (let i = 0; i < achievments.length; i++) {
                self.achievments.push(new Achievment(achievments[i].achievmentId, achievments[i].name, achievments[i].cssClass));
            }
        }, function(errors) {
            self.showErrorMessage("Error loading achievments", errors, 20);
        });
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
        console.log(project);
        self.hideAllForms();
        self.loadTimeEntriesForProject(project);
        self.isTimesListVisible(true);
    };

    self.goToAchivements = function(achievment) {
        console.log("Showing list of achivements for:");
        console.log(achievment);
        self.hideAllForms();
        self.selectedAchievment(achievment);
        self.isAchievmentEntriesVisible(true);
    };

    self.selectedAchievmentCssClass = function() {
        return self.selectedAchievment.cssClass;
    };

    self.setMinutes = function(button) {
        self.timeToEdit().minutes(button.minutes);
    };

    self.showTimeEdit = function() {
        self.isTimeEditVisible(true);
    };

    self.showProjectEdit = function() {
        self.isProjectEditVisible(true);
    };

    self.showProjectsList = function() {
        self.hideAllForms();
        self.isProjectsListVisible(true);
    };

    self.hideAllForms = function() {
        self.isTimesListVisible(false);
        self.isProjectsListVisible(false);
        self.isTimeEditVisible(false);
        self.isProjectsDropdownVisible(false);
    };

    self.logout = function () {
        self.userData(new UserData("", "", "", 0, ""));
        TkLocaStorage.saveUserData(self.userData());
    };

    self.login = function () {
        let login = self.loginModel();
        self.clearErrorMessage();
        Repository.login({
            clientId: "FakeClientId",
            email: login.email,
            password: login.password
        }, function(user) {
            console.log("User logged in OK. JWT: " + user);
            let payload = TkHelper.parseJwt(user.jwt);
            console.log(payload);

            self.userData(new UserData(payload.uid, payload.nick, payload.email, payload.exp * 1000, user.jwt));
            TkLocaStorage.saveUserData(self.userData());
            TkLocaStorage.saveLoginData({
                email: login.email,
                password: self.settings.isSavePassword ? login.password : "",
            });
            self.init();
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

    self.onAchievmentEntryAddClicked = function() {
        console.log("Adding achievments entry:");
        self.achievmentEtryToEdit().achievmentId = self.selectedAchievment().achievmentId;
        self.achievmentEtryToEdit().userId = self.userData().userId;
        console.log(self.achievmentEtryToEdit());

        Repository.createAchievmentEntry(self.userData(), self.achievmentEtryToEdit(), function(entry) {
            self.achievmentEntries.push(entry);
            self.achievmentEtryToEdit(new AchievmentEntry("", "", "", TkHelper.getCurrentDate(), 0));
        }, function(errors) {
            self.showErrorMessage("Error creating achievment entry", errors, 30);
        });
    };

    self.onAchievmentEntryDeleteClicked = function(achievmentEntry) {
        console.log("Going to delete:");
        console.log(achievmentEntry);

        Repository.deleteAchievmentEntry(self.userData(), achievmentEntry, function() {
            console.log("Deleted");
            self.achievmentEntries.remove(achievmentEntry);
        }, function(errors) {
            self.showErrorMessage("Can't delete achievment entry", errors, 30);
        });
    };

    self.getAchievmentsMinDate = function() {
        const achievments = self.achievmentEntries();
        let min = "9999-99-99";
        for (let i = 0; i < achievments.length; i++) {
            if (achievments[i].date < min) {
                min = achievments[i].date;
            }
        }
        return min;
    };

    self.getAchievmentsMaxDate = function() {
        const achievments = self.achievmentEntries();
        let max = "0000-00-00";
        for (let i = 0; i < achievments.length; i++) {
            if (achievments[i].date > max) {
                max = achievments[i].date;
            }
        }
        return max;
    };

    self.getAchievmentsCount = function() {
        const achievments = self.achievmentEntries();
        let count = 0;
        for (let i = 0; i < achievments.length; i++) {
            count += parseInt(achievments[i].count);
        }
        return count;
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
