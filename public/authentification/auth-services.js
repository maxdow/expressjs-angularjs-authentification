angular.module("AuthServices", [])
    .service("SessionService", function() {
        this.setValue = function(key, value) {
            localStorage.setItem(key, value);
        };
        this.getValue = function(key) {
            return localStorage.getItem(key);
        };
        this.destroyItem = function(key) {
            localStorage.removeItem(key);
        };
    })
    .service("UserService", function($http, $location, SessionService, httpBufferService) {

        this.currentUser = {
            name: SessionService.getValue("session.name") || "",
            isLoggedIn: (SessionService.getValue("session.name") ? true : false)
        };

        this.login = function(user) {
            var _this = this;
            return $http.post("/login", {
                "username": user.name,
                "password": user.pass
            }).success(function(response) {

                _this.currentUser.name = response.username;
                _this.currentUser.isLoggedIn = true;
                SessionService.setValue("session.name", response.username);
                $location.path("/");
                httpBufferService.retryLastRequest();

            });
        };
        this.logout = function() {
            var _this = this;
            return $http.post("/logout").success(function() {
                _this.currentUser.isLoggedIn = false;
                SessionService.destroyItem("session.name");
            });
        };


        this.loginShowing = false;

        this.setLoginState = function(state) {
            this.loginShowing = state;
        };
    })
    .factory("httpBufferService", function($injector) {

        var $http;
        var buffer = {};


        return {
            storeRequest: function(request) {
                buffer = request;
            },
            retryLastRequest: function() {

                function successCallback(response) {
                    buffer.deferred.resolve(response);
                }

                function errorCallback(response) {
                    buffer.deferred.reject(response);
                }
                $http = $http || $injector.get("$http");
                $http(buffer.config).then(successCallback, errorCallback);
            }
        };
    });
