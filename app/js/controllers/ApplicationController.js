angular.module('hq').config(function($stateProvider){
    $stateProvider.state('root', {
        url: '',
        templateUrl: '/views/app.html',
        controller: 'ApplicationController'
    });
});

angular.module('hq').controller('ApplicationController', function(Session, $localStorage, $state, $scope){
    $scope.username = null;
    $scope.menuOpen = false;

    if(!$localStorage.session){
        $state.go('root.login');
    }
});