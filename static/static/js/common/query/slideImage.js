define(['ngResource'], function(ngResource) {
	angular.module('slideImageService', ['ngResource', 'common.services']).factory('SlideImage', ['$resource', function($resource) {
		return $resource('operation/slideImage', {}, {
			get : {
			// 获取轮播图片库
				url : 'operation/slideImage',
				method : 'GET',
				isArray : true
			},
			upload : {
			// 上传新图片
				url : 'operation/slideImage',
				method : 'POST'
			},
			active : {
			// 激活/弃用图片
				url : 'operation/slideImage/active/:id',
				method : 'PUT'
			},
			exchangeDetno : {
			// 移动图片顺序
				url : 'operation/slideImage/exchange',
				method : 'POST'
			},
			deleteImg :{
			// 删除图片
				url : 'operation/slideImage/:id',
				method : 'DELETE'
			}
		});
	}]).factory('SlideImageAPI', ['$resource', function($resource) {
		return $resource('api/operation/slideImage', {}, {	
			getActived : {
			// 获取已激活的图片
				url : 'api/operation/slideImage/getActived',
				method : 'GET',
				isArray : true
			}
		});
	}]);
});