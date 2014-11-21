angular.module('hq').config(function($stateProvider){
    $stateProvider.state('root', {
        url: '',
        templateUrl: '/views/app.html',
        controller: 'ApplicationController'
    });
});

angular.module('hq').controller('ApplicationController', function($localStorage, $state, $scope){
    $scope.session = null;
    $scope.menuOpen = true;
    if(!$localStorage.session){
        $state.go('root.login');
    }
});