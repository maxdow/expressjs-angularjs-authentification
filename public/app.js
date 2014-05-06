angular.module("AuthApp",[
    "AuthServices",
    "AuthAppServices",
    "AuthAppControllers",
    "ui.router"
]).
config(function($stateProvider,$locationProvider,$httpProvider) {



    $httpProvider.interceptors.push(function($q, $location) {

        return {
            "responseError": function(response) {
                if(response.status === 401) {
                    console.log("unauth");
                    //$location.path("/login");
                }
                return $q.reject(response);
            }
        };
    });

    $locationProvider.html5Mode(true);
});
