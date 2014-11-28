'use strict';

angular.module('TodoSPA', ['ngRoute','AdalAngular', 'TodoSPA.Home', 'TodoSPA.Index', 'TodoSPA.User']);

//var app = angular.module('TodoSPA', ['ngRoute','AdalAngular']);

// version 1
angular.module('TodoSPA').config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalAuthenticationServiceProvider) {

    $routeProvider.when("/Home", {
        controller: "HomeController",
        templateUrl: "/Views/Home.html"
    }).when("/Iframe", {
        controller: "IndexController",
        templateUrl: "/Views/Iframe.html",
        requireADLogin: true
    }).when("/UserData", {
        controller: "UserDataController",
        templateUrl: "/Views/UserData.html"
    }).otherwise({ redirectTo: "/Home" });

    adalAuthenticationServiceProvider.init(
        {
            tenant: '5f388bf9-fc7f-4854-906c-d0819c9f951e',
            clientId: 'a3e5d068-a35a-4596-a33f-8fdd95c7d641',
            extraQueryParameter: ''
        },
        $httpProvider   // pass http provider to inject request interceptor to attach tokens
    );
    //5f388bf9-fc7f-4854-906c-d0819c9f951e
    //client tenantId
    //17c3954e-89ae-4242-9560-3a370147ba9e

    /*
     }).when("/TodoList", {
     controller: "TodoListController",
     templateUrl: "/Views/TodoList.html",
     requireADLogin: true
     */
}]);
