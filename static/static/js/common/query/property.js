define([ 'ngResource' ], function() {
	angular.module('propertyServices', [ 'ngResource' ]).factory('Property', ['$resource', function($resource) {
		return $resource('produce/property/:id', {}, {
			// 根据id获取属性信息
			get : {
				url : 'produce/property/:id',
				method : 'GET'
			},
			//获得所有属性数据
			getProperties : {
				url : 'produce/property',
				method : 'GET',
				isArray: true
			},
			// 分页获取所有属性
			getPropertiesPage : {
				url : 'produce/property/pageInfo',
				method : 'GET'
			},
			// 添加属性
			add : {
				url : 'produce/property',
				method : 'POST'
			},
			// 更新属性
			update : {
				url : 'produce/property/update',
				method : 'POST'
			}
		});
	}]).factory('propertiesSubmit', ['$resource', function($resource) {
		//获取ComponentSubmit的数据
		return $resource('produce/propertySubmit', {}, {
			//根据ComponentSubmit.id查找对应的propertiesSubmit
			getList : {
				url : 'produce/propertySubmit/:id',
				method : 'GET',
				isArray : true
			},
			getPropertySubmit : {
				url : 'produce/propertySubmit/property',
				method : 'GET'
			}
		});
	}]).factory('propertiesActive', ['$resource', function($resource) {
		//获取propertiesActive的数据
		return $resource('produce/propertyActive', {}, {
			//根据ComponentActive.id查找对应的propertiesActive
			getList : {
				url : 'produce/propertyActive/:id',
				method : 'GET',
				isArray : true
			}
		});
	}]);
});