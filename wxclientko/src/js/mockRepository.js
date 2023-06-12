let Repository = {
    _timeEntries: [
        new TimeEntry({
            timeEntryId: "768651c68ac6497f918b51e7477c7872",
            userId: "1234567890123456789012",
            isPaid: true,
            projectId: "f8bebe7a7ff14d15811b489ebc4cf97b",
            projectName: "Vida",
            date: "2020-02-07",
            minutes: 30,
            priceMinor: 500,
            remarks: "Just fake record for test",
        }),
        new TimeEntry({
            timeEntryId: "53373753d70d4645890f7f61093bf948",
            userId: "1234567890123456789012",
            isPaid: false,
            projectId: "50d8e67673a84d17964ee0834fb72fc9",
            projectName: "SSI",
            date: "2020-02-05",
            minutes: 15,
            priceMinor: 250,
            remarks: "Just fake record for test",
        }),
        new TimeEntry({
            timeEntryId: "53373753d70d4645890f7f61093bf456",
            userId: "OtherUserId__db6a82",
            isPaid: false,
            projectId: "50d8e67673a84d17964ee0834fb72fc9",
            projectName: "SSI",
            date: "2020-02-13",
            minutes: 15,
            priceMinor: 250,
            remarks: "Fake record from OTHER user",
        }),
    ],
    _projects: [
        {
            projectId: "f8bebe7a7ff14d15811b489ebc4cf97b", 
            name: "Vida", 
            costPerHourMinor: 2000, 
            isEnabled: true
        },
        {
            projectId: "50d8e67673a84d17964ee0834fb72fc9", 
            name: "SSI", 
            costPerHourMinor: 1000, 
            isEnabled: true
        },
    ],
    _achievments: [
        new Achievment("74e1d19ad0c144de90c423ece65b4a72", "FAKE achievment 1", "fas fa-crosshairs text-warning"),
        new Achievment("fcda469f74c0425bb0f23e13b7bcd92f", "FAKE achievment 2", "fas fa-chess-knight text-warning")
    ],
    _achievmentEntries: [
        new AchievmentEntry("bf0346d72196420bb64171277e895fc2", "74e1d19ad0c144de90c423ece65b4a72", "1234567890123456789012", "2023-04-05", 100),
        new AchievmentEntry("b4a6221dc281429898a8f29ff5887c2d", "74e1d19ad0c144de90c423ece65b4a72", "OtherUserId", "2000-01-02", 666),
        new AchievmentEntry("563209930ea44284aef6b31c4d94db20", "fcda469f74c0425bb0f23e13b7bcd92f", "1234567890123456789012", "2023-02-12", 4)
    ],

    login: function (credentials, callback, errorCallback) {
        let errors = TkValidator.validateLogin(credentials);
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        callback({
            userId: "1234567890123456789012",
            nick: "Mock user",
            email: "fake@email.zzz",
            jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgdXNlciIsImlhdCI6MTUxNjIzOTAyMiwidWlkIjoiMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMiJ9.tUFNdahdZXrWUYfKyBCGjI9EqUUvxpJZj5Hqd2c4omo",
        });
    },

    refreshJwt: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }
        
        callback();
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

        let entry = new TimeEntry({
            timeEntryId: "768651c68ac6497f918b51e7477c7872",
            userId: user.userId,
            isPaid: false,
            projectId: timeEntry.projectId,
            projectName: timeEntry.projectName,
            date: timeEntry.date,
            minutes: timeEntry.minutes,
            priceMinor: timeEntry.priceMinor,
            remarks: timeEntry.remarks,
        });
        console.log("Persisting Time entry:");
        console.log(entry);
        this._timeEntries.push(entry);
        callback(entry);
    },

    setPaidStatus: function(user, timeEntry, isPaid, callback, errorCallback) {
        let errors = TkValidator.ensureCouldModify(user.jwt, timeEntry.userId, "You can't change status for other user.");
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        callback(timeEntry);
    },

    loadTimeEntries: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        callback(this._timeEntries);
    },

    deleteTimeEntry: function(user, timeEntry, callback, errorCallback) {
        console.log("Checking could Time entry (owner: " + timeEntry.userId + ") be deleted by user with JWT: " + user.jwt);
        let errors = TkValidator.ensureCouldModify(user.jwt, timeEntry.userId, "You can't delete other user Time entry.");
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        callback();
    },

    loadProjects: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        callback(this._projects);
    },

    createAchievmentEntry: function(user, achievmentEntry, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        let errors = TkValidator.validateAchievmentEntry(achievmentEntry);
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        achievmentEntry.achievmentEntryId = "c96e955b2b3347209b27a773c8b7458" + (this._achievmentEntries.length + 1).toString();
        this._achievmentEntries.push(achievmentEntry);

        callback(achievmentEntry);
    },

    deleteAchievmentEntry: function(user, achievmentEntry, callback, errorCallback) {
        let errors = TkValidator.ensureCouldModify(user.jwt, achievmentEntry.userId, "You can't delete other user Time entry.");
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        callback();
    },

    loadAchievments: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }
        callback(this._achievments);
    },

    loadAchievmentEntries: function(user, achievmentId, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        let entries = [];
        console.log(`Loading achievment entries for achievment ID ${achievmentId}`);
        for (let i = 0; i < this._achievmentEntries.length; i++) {
            if (this._achievmentEntries[i].achievmentId == achievmentId) {
                entries.push(this._achievmentEntries[i]);
            }
        }

        callback(entries);
    }
};
