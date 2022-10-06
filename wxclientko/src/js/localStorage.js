let TkLocaStorage = {
    saveUserData: function(userData) {
        let user = {
            userId: userData.userId,
            jwt: userData.jwt,
            nick: userData.nick,
            email: userData.email,
            expiredAt: userData.expiredAt,
            jwt: userData.jwt
        };
        this._set("user", JSON.stringify(user));
    },

    loadUserData: function() {
        let s = this._get("user");
        if (s === null) {
            return new UserData("", "", "", 0, "");
        }
        let user = JSON.parse(s);
        return new UserData(user.userId, user.nick, user.email, user.expiredAt, user.jwt);
    },

    saveLoginData: function(settings) {
        let entry = {
            email: settings.email,
            password: settings.password,
        };
        this._set("login", JSON.stringify(entry));
    },

    loadLoginData: function() {
        let s = this._get("login");
        if (s == null) {
            return new LoginModel("", "");
        }
        return JSON.parse(s);
    },

    saveSettings: function(settings) {
        this._set("settings", JSON.stringify(settings));
    },

    loadSettings: function() {
        let s = this._get("settings");
        if (s === null) {
            return new TkSetting(false);
        }
        return JSON.parse(s);
    },

    _set: function(key, value) {
        localStorage.setItem(key, value);
    },

    _get: function(key) {
        return localStorage.getItem(key);
    }
};
