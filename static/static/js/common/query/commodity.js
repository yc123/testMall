define([ 'ngResource' ], function() {
	'use strict';
	angular.module('commodityServices', [ 'ngResource' ]).factory('Commodity', ['$resource', 'BaseService', function($resource, BaseService) {
		var rootPath = BaseService.getRootPath();
		return $resource('/api/commodity-service/commodities', {}, {
			/**
			 * 获取库存列表信息
			 */
			pageStoreCommoditiesByEnInfos: {
				url: rootPath + '/api/commodity/commodities',
				method: 'GET',
				params : { origin : 'store'}
			},
			/**
			 * 根据批次号获取商品信息
			 */
			findByBatchCode: {
				url: rootPath + '/api/commodity/:batchCode/detail',
				method: 'GET'
			},
			/**
			 * 根据商品器件UUID获取器件信息
			 */
			findComponentByUuid: {
				url: rootPath + '/api/commodity/component/:componentUuid',
				method: 'GET'
			},
			/**
			 * 获取店铺所有商品的列表结构信息
			 */
			getAllKindsInfoByStoreUuid: {
				url: rootPath + '/api/commodity/components/kinds',
				method: 'GET',
				isArray: true
			},
			// 分页获取批次信息
			findPageGoods: {
				url : rootPath + '/api/commodity/goods/page',
				method : 'GET'
			}
		});
	}]);
});
