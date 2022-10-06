let TkValidator = {
    validateTimeEntry: function(timeEntry) {
        let errors = [];

        console.log("Validating Time entry to persist:");
        console.log(timeEntry);

        if (timeEntry.projectId < 1) {
            errors.push("You Time entry is not linked to any project.");
        }
        if (timeEntry.minutes < 1) {
            errors.push("Please specify number of minutes.");
        }

        return errors;
    },

    validateAchievmentEntry: function(entry) {
        let errors = [];
        let count = parseInt(entry.count);
        if (isNaN(count) || count < 1) {
            errors.push("Provide number which is greater than 0.");
        }
        if (TkHelper.isValidUid(entry.achievmentId) == false) {
            errors.push("Select any of achievments category.");
        }

        return errors;
    },

    ensureCouldModify: function(jwt, ownerId, errorMsg = "You can't modify this object.") {
        let errors = [];

        if (TkHelper.isValidJwt(jwt) == false) {
            errors.push("You are not logged in. Please re-login.");
        }

        let attrs = TkHelper.parseJwt(jwt);
        if (attrs.uid != ownerId) {
            errors.push(errorMsg);
        }

        return errors;
    },

    validateLogin: function(credentials) {
        let errors = [];

        if (credentials.email.length < 5) {
            errors.push("Your e-mail address is too short.");
        }
        if (credentials.password.length < 1) {
            errors.push("Please enter your password.");
        }

        return errors;
    }
};
