angular.module('hq', [
	'ui.router',
	'ngStorage',
	'ngDialog'
]);

angular.module('hq').config(function($locationProvider){
    $locationProvider.html5Mode(true);
});