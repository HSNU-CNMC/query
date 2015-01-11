angular.module('hq', [
	'ui.router',
	'angular-loading-bar',
	'ngStorage',
	'ngDialog'
]);

angular.module('hq').config(function($locationProvider){
    $locationProvider.html5Mode(true);
});
