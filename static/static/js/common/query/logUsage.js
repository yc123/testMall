define([ 'ngResource' ], function() {
	angular.module('logUsageServices', [ 'ngResource' ]).factory('logUsage', ['$resource', 'BaseService', function($resource, BaseService) {
		const rootPath = BaseService.getRootPath();
		return $resource('log/usage', {}, {
      getAllByPage:{
      	url:'log/usage/:userUu',
				method:'GET'
			}
		});
}])
});