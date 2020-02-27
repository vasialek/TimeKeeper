let TkHelper = {
    isValidJwt: function(jwt) {
        if (jwt == null || jwt.length < 3) {
            return false;
        }
        let dotCount = (jwt.match(/\./g) || []).length;
        console.log("Dots in JWT: " + dotCount);
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
        console.log("Calculating cost for minutes: " + minutes + ", costPerHour (minor): " + costPerHourMinor);
        return Math.round(costPerHourMinor * minutes / 60);
    },

    getCurrentDate: function() {
        let dt = new Date();
        let month = dt.getMonth() + 1;
        month = month > 9 ? month : "0" + month;
        let day = dt.getDay() > 9 ? dt.getDay() : "0" + dt.getDay();
    
        return dt.getFullYear() + "-" + month + "-" + day;
    }
}
