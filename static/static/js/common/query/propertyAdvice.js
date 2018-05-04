/**
 * 类目属性建议 - 数据交互
 */
define([ 'ngResource'], function() {
	angular.module('common.query.propertyAdvice', [ 'ngResource'
	]).factory('PropertyAdvice', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
		var cache = $cacheFactory('PropertyAdvice');
		return $resource('produce/propertyAdvice/:id', {}, {
			
		});
	}]);
});