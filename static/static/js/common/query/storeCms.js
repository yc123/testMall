define([ 'ngResource' ], function() {
	'use strict';
	angular.module('StoreCmsServices', [ 'ngResource' ]).factory('StoreCms', ['$resource', function($resource) {
		return $resource('api/store-cms/advantages', {}, {
			/**
			 * 根据店铺UUID获取优势商品信息
			 */
			findByStoreUuid: {
				url: 'api/store-cms/advantages',
				method: 'GET',
				isArray: true
			},
			/**
			 * 验证批次是否存在与优势库存
			 */
			validCommdityisAdvantageCommodity : {
				url : 'api/store-cms/isAdvantageCommodity',
				method : 'GET'
			}
		});
	}]);
});
