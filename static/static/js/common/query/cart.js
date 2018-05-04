define([ 'ngResource' ], function() {
	angular.module('cartServices', [ 'ngResource', 'common.utils' ]).factory('Cart', ['$resource', 'BaseService', function($resource, BaseService) {
		var rootPath = BaseService.getRootPath();
		//获取ComponentSubmit的分页数据
		return $resource('trade/cart', {}, {
			/**
			 * get
			 * 获得某人的购物车信息
			 */
			// 获取购物车分页信息
			getPageInfo : {
				url : 'trade/cart/pageInfo',
				method : 'GET'
			},
			//获取购物车数量
			getCount : {
				url : 'trade/cart/count',
				method : 'GET'
			},
			//保存
			save : {
				url : 'trade/cart/save/:uuid',
				method : 'POST',
				isArray : true,
				params: { groupby : 'uuid' }
			},
			//购物车总价
			getPrice : {
				url : 'trade/cart/totalPrice',
				method : 'GET'
			},
			//删除购物车商品
			deleteByBatchCode : {
				url : 'trade/cart/delete',
				method : 'PUT'
			},
			deleteById : {
				url : 'trade/cart/deleteById',
				method : 'DELETE',
				isArray: true
			},
			// 根据uuid获取购物车列表
			getByUuid: {
				url: 'trade/cart/:uuid',
				method: 'GET',
				isArray: true
			},
			// 根据uu获取购物车列表
			getCarts: {
				url: 'trade/cart/all',
				method: 'GET',
				isArray: true
			},
			// 批量添加商品到购物车
			saveBatch : {
				url : 'trade/cart/save/batch',
				method : 'POST',
				isArray : true
			},
			// 添加一条记录到购物车
			addOneCartRecord : {
				url : rootPath + '/trade/cart/add',
				method : 'POST'
			}
		});
	}]);
});