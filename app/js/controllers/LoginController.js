angular.module('hq').config(function($stateProvider){
    $stateProvider.state('root.login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'LoginController'
    });
});

angular.module('hq').controller('LoginController', function($scope){
});