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
    .service("UserService", function($http, $location, SessionService,httpBuffer) {

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
                httpBuffer.retryLastRequest();

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
    .factory("httpBuffer", function($injector) {

        var $http;
        var buffer = {};

        function retryHttpRequest(config, deferred) {
            console.log(buffer,config,deferred);
          function successCallback(response) {
            deferred.resolve(response);
          }
          function errorCallback(response) {
            deferred.reject(response);
          }
          $http = $http || $injector.get("$http");
          $http(config).then(successCallback, errorCallback);
        }

        return {
            storeRequest : function(request) {
                buffer = request ;
            },
            retryLastRequest : function() {
                retryHttpRequest(buffer.config,buffer.deferred);
            }
        };
    });
