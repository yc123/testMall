define([ 'ngResource' ], function() {
	angular.module('validtimeServices', [ 'ngResource' ]).factory('Validtime', ['$resource', function($resource) {
		return $resource('trade/validtime', {}, {
			/**
			 * 获取批次有效期规则
			 */
			get : {
				isArray : true
			},
			/**
			 * 提交有效期规则
			 */
			save : {
				url : 'trade/validtime/:isUpdate',
				method : 'PUT'
			}
		});
	}]);
})