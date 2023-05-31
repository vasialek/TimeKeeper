let TkHelper = {
    isValidJwt: function(jwt) {
        if (jwt == null || jwt.length < 3) {
            return false;
        }
        let dotCount = (jwt.match(/\./g) || []).length;
        return dotCount == 2;
    },

    parseJwt: function(jwt) {
        try {
            let base64Url = jwt.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let payload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        
            return JSON.parse(payload);
        } catch (error) {
            console.log(error);
        }

        return {};
    },

    isValidUid: function(uid) {
        return uid != null && uid.length == 32;
    },    

    calculateCost: function(minutes, costPerHourMinor) {
        return Math.round(costPerHourMinor * minutes / 60);
    },

    getCurrentDate: function() {
        let dt = new Date();
        let month = this.formatTwoDigits(dt.getMonth() + 1);
        let day = this.formatTwoDigits(dt.getDate());
    
        return `${dt.getFullYear()}-${month}-${day}`;
    },

    formatTwoDigits: function(value) {
        return value > 9 ? value : "0" + value;
    }
}
