define([ 'ngResource' ], function() {
	angular.module('secQuestionServices', [ 'ngResource' ]).factory('secQuestion', ['$resource', 'BaseService', function($resource, BaseService) {
		const rootPath = BaseService.getRootPath();
		return $resource('user/secQuestion', {}, {
      add : {
        url : 'user/secQuestion/add',
        method : 'POST'
      },
			getPageInfo:{
        url : 'user/secQuestion/getPageInfo',
        method : 'GET'
			},
      update : {
        url : 'user/secQuestion/add',
        method : 'POST'
      },get : {
        url : 'user/secQuestion/:id',
        method : 'GET'
      },
      deleteSecQuestion : {
        url : 'user/secQuestion/delete',
        method : 'GET'
      }
		});
}])
});