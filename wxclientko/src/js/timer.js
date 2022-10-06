let TkTimer = {
    _jwtRefreshHandler: null,

    startJwtRefresh: function(callback, timeoutS = 30) {
        this.stopJwtRefresh();
        this._jwtRefreshHandler = setInterval(callback, timeoutS * 1000);
    },

    stopJwtRefresh: function() {
        if (this._jwtRefreshHandler != null) {
            clearInterval(this._jwtRefreshHandler);
        }
    }
};
