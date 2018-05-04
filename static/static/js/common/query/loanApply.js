define([ 'ngResource' ], function() {
	angular.module('loanApplyService', [ 'ngResource' ]).factory('LoanApply', ['$resource', function($resource) {
		return $resource('api/fa/loanApply', {}, {
      		getAllByPage:{
				method:'GET'
			}
		});
	}])
});