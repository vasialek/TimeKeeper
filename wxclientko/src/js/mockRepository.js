let Repository = {
    _timeEntries: [
        new TimeEntry({
            timeEntryId: "768651c68ac6497f918b51e7477c7872",
            userId: "1234567890123456789012",
            isPaid: true,
            projectId: "646d935e655a46b89ae3934ec79a67d7",
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
            projectId: "9a3d967b2eb74eff9c631bb341db6a82",
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
            projectId: "9a3d967b2eb74eff9c631bb341db6a82",
            projectName: "SSI",
            date: "2020-02-13",
            minutes: 15,
            priceMinor: 250,
            remarks: "Fake record from OTHER user",
        }),
    ],
    _projects: [
        {
            projectId: "ba14259570aa4226871b855c39d884d8", 
            name: "Vida", 
            costPerHourMinor: 2000, 
            isEnabled: true
        },
        {
            projectId: "9a3d967b2eb74eff9c631bb341db6a82", 
            name: "SSI", 
            costPerHourMinor: 1000, 
            isEnabled: true
        },
    ],

    _customProjects: [
        new CustomProjectEntry("a84c967b2eb74eff9c631bb341db83d1", "G19")
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

    createCustomEntry: function(user, entry, callbak, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        let errors = TkValidator.validateTimeEntry(timeEntry);
        if (errors.length > 0) {
            errorCallback(errors);
            return;
        }

        callbak(entry);
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

    loadCustomProjects: function(user, callback, errorCallback) {
        if (TkHelper.isValidJwt(user.jwt) == false) {
            errorCallback(["You are not logged in. Please re-login."]);
            return;
        }

        callback(this._customProjects);
    }
};
