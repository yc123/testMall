define([ 'ngResource' ], function() {
	angular.module('kindContrastServices', [ 'ngResource' ]).factory('KindContrast', ['$resource', function($resource) {
		//获取属性对应关系的分页数据
		return $resource('produce/kindContrast', {}, {
			// 获取全部参数对照规则
			all: {
				url : 'produce/kindContrast',
				method : 'GET',
				params : {_status : 'all'}
			},
			// 获取待发起参数对照规则
			outTask: {
				url : 'produce/kindContrast',
				method : 'GET',
				params : {_status : 'outTask'}
			},
			// 获取全部参数对照规则
			inTask: {
				url : 'produce/kindContrast',
				method : 'GET',
				params : {_status : 'inTask'}
			},
			// 获取任务进行中的参数对应规则
			running : {
				url : 'produce/kindContrast',
				method : 'GET',
				params : {_status : 'running'}
			},
			// 获取已结案的参数对应规则
			concluded : {
				url : 'produce/kindContrast',
				method : 'GET',
				params : {_status : 'concluded'}
			},
			// 获取异常参数对应关系规则
			failed : {
				url : 'produce/kindContrast',
				method : 'GET',
				params : {_status : 'failed'}
			},
 			// 获取参数对照规则详情
			getOne : {
				url : 'produce/kindContrast/:id',
				method : 'GET'
			},
			// 更新基础属性
			updateBasic : {
				url : 'produce/kindContrast/update/basic',
				method : 'PUT'
			},
			// 更新参数对照
			updateProperty : {
				url : 'produce/kindContrast/update/property',
				method : 'PUT'
			},
			// 新增参数对照明细
			newProperty : {
				url : 'produce/kindContrast/create/property',
				method : 'PUT'
			},
			// 删除参数对照
			deleteOne : {
				url : 'produce/kindContrast/:id',
				method : 'DELETE'
			}
		});
	}]);
});