angular.module('TodoSPA.Home', ['TodoSPA.Home.Controllers']);

angular.module('TodoSPA.Home.Controllers', [])
.controller('HomeController', ['$scope', 'adalAuthenticationService','$location', function ($scope, adalAuthenticationService, $location) {
    $scope.Login = function () {
        adalAuthenticationService.login();
    };
    $scope.Logout = function () {
        adalAuthenticationService.logOut();
    };
    $scope.isActive = function (viewLocation) {        
        return viewLocation === $location.path();
    };
    $scope.loginError = function(){
    }
}]);