angular.module("AuthAppServices",[]).
factory("DataService",function($http){
    return {
        getPublicData : function(){
            return $http.get("/api/data");
        },
        getPrivateData : function() {
            return $http.get("/api/secure/data");
        }
    };
});