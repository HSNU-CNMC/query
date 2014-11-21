angular.module('hq').config(function($stateProvider){
    $stateProvider.state('root.home', {
        url: '/',
        templateUrl: '/views/home.html',
        controller: 'HomeController'
    });
});

angular.module('hq').controller('HomeController', function($scope){

});