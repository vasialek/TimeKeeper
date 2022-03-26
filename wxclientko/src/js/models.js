function LoginModel(email, password) {
    let self = this;
    self.email = email;
    self.password = password;
}
function UserData(userId, nick, email, jwt) {
    let self = this;
    self.userId = userId;
    self.jwt = jwt;
    self.nick = nick;
    self.email = email;
    self.isLoggedIn = ko.computed(function() {
        return self.jwt != null && self.jwt.length > 32;
    });
}
function ErrorMessage(message, errors) {
    let self = this;
    self.message = message;
    self.errors = errors;
}

function TimeEntryEditable(project, date, minutes, remarks = "") {
    let self = this;
    self.project = ko.observable(project);
    self.date = date;
    self.minutes = ko.observable(minutes);
    self.remarks = remarks;
    self.time = ko.computed(function() {
        return self.minutes() + "min.";
    });
    self.costPerMinuteFmt = ko.computed(function() {
        let project = self.project();
        console.log(project);
        return project == null ? "" : self.project().costPerMinuteFmt();
    });
}

function TimeEntry(timeEntry) {
    let self = this;
    self.timeEntryId = timeEntry.timeEntryId;
    self.userId = timeEntry.userId;
    self.isPaid = timeEntry.isPaid;
    self.projectId = timeEntry.projectId;
    self.projectName = timeEntry.projectName;
    self.date = timeEntry.date;
    self.minutes = timeEntry.minutes;
    self.priceMinor = timeEntry.priceMinor;
    self.remarks = timeEntry.remarks;
    self.priceFmt = ko.computed(function() {
        return (self.priceMinor / 100).toFixed(2);
    });
}

function ProjectEntry(projectId, name, costPerHour, enabled = false) {
    let self = this;
    self.projectId = projectId;
    self.name = ko.observable(name);
    self.costPerHour = ko.observable(costPerHour);
    self.enabled = ko.observable(enabled);
    self.costPerMinuteMinor = ko.computed(function() {
        return Math.round(self.costPerHour() / 60);
    });
    self.costPerMinuteFmt = ko.computed(function() {
        return (self.costPerMinuteMinor() / 100).toFixed(2);
    });
}

class CustomProjectEntry {
    constructor(projectId, name) {
        let self = this;
        self.projectId = projectId;
        self.name = name;
        self.customTimes = ko.computed(function() {
            return [50, 75, 100, 150, 200];
        });
    }

}

function MinutesEntry(minutes) {
    let self = this;
    self.minutes = minutes;
    self.minutesFmt = ko.computed(function() {
        if (self.minutes < 60) {
            return self.minutes;
        }
        let hours = Math.floor(self.minutes / 60);
        let minutes = self.minutes - hours * 60;
        return minutes == 0 ? hours + "h" : hours + "h " + minutes;
    });
}

function FilterForTimes(projectName, projectId, isPaid) {
    let self = this;
    self.projectName = projectName;
    self.projectId = projectId;
    self.isPaid = isPaid;
    self.doFiltering = ko.computed(function() {
        return self.projectName.length > 1 || self.isPaid != null;
    });
}
