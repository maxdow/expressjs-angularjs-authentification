angular.module("AuthAppControllers",[])
.controller("HeaderCtrl",function($scope,UserService){

    $scope.user = {
        isLoggedIn : UserService.isLoggedIn()
    } ;

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