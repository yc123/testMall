define([ 'ngResource' ], function() {
	angular.module('addressServices', [ 'ngResource' ]).factory('ShippingAddress', ['$resource', 'BaseService', function($resource, BaseService) {
		const rootPath = BaseService.getRootPath();
		//获取收货地址
		return $resource('trade/address/shipping', {}, {
			/*
			 * get,获取order的分页数据
			 */
			get : {
				isArray : true
			},
			getB2C : {
				url : 'trade/address/shipping/enterprise',
				method : 'GET',
				isArray : true
			},
			saveB2C: {
				url : 'trade/address/shipping/saveb2c',
				method : 'POST'
			},
			save : {
				url : 'trade/address/shipping/save',
				method : 'POST'
			},
			setTop : {
				url : 'trade/address/settop/:addid',
				method : 'PUT'
			},
			del : {
				url : 'trade/address/delete/:addid',
				method : 'PUT'
			},
			//用户填写退换货单据
			findB2cAdd: {
				url : 'trade/address/findb2c/b2c',
				method : 'GET',
				isArray : true
			},
			//返回一页的企业的地址
			getEnterprise: {
				url: 'trade/address/enterprise/address',
				method: 'GET'
			},
			getShipEnterprise: {
				url: 'trade/address/enterprise/address',
				method: 'GET',
				params : {
					"_type" : "ship"
				}
			},
			getB2CShipPageAddress: {
				url: 'trade/address/b2c',
				method: 'GET',
				params : {
					"_type" : "ship"
				}
			},
			getB2CSendPageAddress: {
				url: 'trade/address/b2c',
				method: 'GET',
				params: {
					"_type": "send"
				}
			},
			//返回list对象的企业的地址
			getListEnterprise: {
				url: 'trade/address/enterprise',
				method: 'GET',
				isArray: true
			},
			// 分页获取用户地址信息
			pageAddressOfUser : {
				url : rootPath + '/trade/address/page',
				method : 'GET'
			}
		});
	}]).factory('PickUpAddress', ['$resource', function($resource) {
		//获取提货地址
		return $resource('trade/pickup/:id', {}, {
			/*
			 * get,获取提货地址所有数据
			 */
			get : {
				isArray : true
			},
			//save, 保存新增地址
			save : {
				method: 'POST'
			},
			//修改地址
			update : {

			},
			//删除地址
			remove : {
				method : 'DELETE'
			},
			//根据id获取取货地址
			getById : {
				method : 'GET'
			}
		});
	}]).factory('ExpressPrice', ['$resource', function($resource) {
		// 与运费相关的操作
		return $resource('trade/express/price', {}, {
			/**
			 * 根据地址、体积和/或重量信息计算运费
			 * @see com.uas.platform.b2c.trade.controller.ExpressPriceController.getFreight(String, Double, Double)
			 */
			getFreight : {
				url : 'trade/express/freight',
				method : 'GET'
			}
		});
	}])
});