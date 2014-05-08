angular.module("AuthApp", [
    "AuthServices",
    "AuthAppServices",
    "AuthAppControllers",
    "ui.router"
]).
config(function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
        .state("Main", {
            url: "/"
        })
        .state("login", {
            url: "/login",
            onEnter: function(UserService) {
                UserService.setLoginState(true);
            },
            onExit: function(UserService) {
                UserService.setLoginState(false);
            },
            views: {
                "login": {
                    templateUrl: "authentification/login-template.html",
                    controller: "LoginCtrl"
                }
            }
        });
    $urlRouterProvider.otherwise("/");

    $httpProvider.interceptors.push(function($q, $location, httpBufferService) {

        return {

            "responseError": function(response) {
                var deferred = $q.defer();

                if (response.status === 401) {

                    $location.path("/login");

                    httpBufferService.storeRequest({
                        config: response.config,
                        deferred: deferred
                    });
                }
                return deferred.promise;
            }
        };
    });

    $locationProvider.html5Mode(true);
});
