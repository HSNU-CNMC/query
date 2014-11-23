angular.module('hq').service('Session', function($localStorage){
	this.create = function(cookie){
		this.cookie = cookie;
	};
	this.destroy = function(){
		this.cookie = null;
		if($localStorage.session) delete $localStorage.session;
	};
	return this;
});
