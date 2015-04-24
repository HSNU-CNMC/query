angular.module('hq').config(function($stateProvider){
    $stateProvider.state('root', {
        url: '',
        templateUrl: '/views/app.html',
        controller: 'ApplicationController'
    });
});

angular.module('hq').controller('ApplicationController', function(Session, $http, $localStorage, $state, $scope, $rootScope, $sce){
    $scope.username = null;
    $scope.menuOpen = false;
    $scope.list = [];
    $scope.tableHtml = '';
    $scope.tableName = '';
    $scope.loading = false;

    $scope.$on('login', function(evt, username){
        $scope.username = username;
        $localStorage.session = Session.cookie;
        $state.go('root.home');
        $http.get('/proxy/list?session=' + Session.cookie).then(function(resp){
            $scope.list = resp.data.list;
        });
    });

    $scope.query = function(index){
        $scope.tableName = $scope.tableHtml = '';
        $scope.loading = true;
        $http.post('/proxy/query', {
            session: Session.cookie,
            action: $scope.list[index].action
        }).then(function(resp){
            $scope.loading = false;
            $scope.tableName = $scope.list[index].name;
            $scope.tableHtml = $sce.trustAsHtml(resp.data.result);
        });
    };

    $scope.logout = function(){
        Session.destroy();
        $scope.username = null;
        $state.go('root.login');
    };

    if(!$localStorage.session){
        $state.go('root.login', {}, { location: 'replace' });
    } else {
        Session.create($localStorage.session);
        $http.get('/proxy/profile?session=' + Session.cookie).then(function(resp){
            if(resp.data.status === 'error') $scope.logout();
            else $rootScope.$broadcast('login', resp.data.username);
        });
    }
});
