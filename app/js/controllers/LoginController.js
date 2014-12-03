angular.module('hq').config(function($stateProvider){
    $stateProvider.state('root.login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'LoginController'
    });
});

angular.module('hq').controller('LoginController', function(Session, $rootScope, $scope, $http){
	$scope.vcodeUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	$scope.error = false;

	$http.get('/proxy/vcode').then(function(resp){
		var data = resp.data;
		$scope.vcodeUrl = 'data:image/gif;base64,' + data.image;
		Session.create(data.session);
	});

	$scope.login = function(credentials){
		$http.post('/proxy/login', {
			username: credentials.username,
			password: credentials.password,
			vcode: credentials.vcode,
			session: Session.cookie
		}).then(function(resp){
			var data = resp.data;
			if(data.status === 'ok'){
				$rootScope.$broadcast('login', data.username);
			} else {
				$scope.error = true;
			}
		});
	};
});