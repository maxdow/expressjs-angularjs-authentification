angular.module("AuthAppControllers",[])
.controller("LoginCtrl",function($scope,UserService){

    $scope.user = UserService.currentUser ;

    $scope.login = function() {
        UserService.login($scope.user)
        .error(function(response){
            $scope.errMsg = response;
        })
        .success(function(){
            $scope.errMsg = "";
        });
    };

})
.controller("HeaderCtrl",function($scope,UserService){

    $scope.userService = UserService ;

    $scope.user = UserService.currentUser;

    $scope.logout = function() {
        UserService.logout();
    };


})
.controller("MainCtrl",function($scope,DataService){

    $scope.data = "" ;

    $scope.loadPublicData = function(){
        DataService.getPublicData().then(function(response){
            $scope.data = response.data.content;
        });
    };
    $scope.loadSecureData = function(){
        DataService.getPrivateData().then(function(response){
            $scope.data = response.data.content;
        });
    };

});