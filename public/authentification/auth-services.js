angular.module("AuthServices", []).
factory("UserService",function(){

    var currentUser = {
        name : ""
    }; //$cookieStore.get('user') || { username: '', role: userRoles.public };

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        isLoggedIn : function(){
            if(currentUser.name === ""){

                return false;
            } else {
                return true;
            }
        },
        login: function(user) {
            return $http.post('/login', user).success(function(user){
                changeUser(user);
            });
        },
        logout: function() {
            return $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                });
            });
        },
    };
});