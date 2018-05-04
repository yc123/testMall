/**
 * 类目结构建议 - 数据交互
 */
define([ 'ngResource'], function() {
	angular.module('common.query.kindAdvice', [ 'ngResource'
	]).factory('KindAdvice', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
		var cache = $cacheFactory('KindAdvice');
		return $resource('produce/kindAdvice/:id', {}, {
			
		});
	}]);
});