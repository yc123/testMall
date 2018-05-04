define([ 'ngResource'], function() {
	angular.module('suDemandServices', [ 'ngResource']).factory('SuDemand', ['$resource' , function($resource) {
		return $resource('help/suDemand', {}, {
			sendEmail : {
				url : 'help/suDemand/sendEmail/:id',
				method : 'GET'
			}
		});
	}]);
});