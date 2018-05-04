define(['ngResource'], function() {
	'use strict';
	angular.module('vendorServices', ['ngResource']).factory('VendorService', ['$resource', function($resource){
		return $resource('basic/vendor', {}, {
			//获取供应商信息
			getVendorInfo : {
				url : 'basic/vendor/info',
				method : 'GET'
			},
			//根据enuu获取供应商信息
			getVendorInfoByEnuu : {
				url : 'basic/vendor/:sellerenuu/findSeller',
				method : 'GET'
			},
			//获取供应商待出货出货单总数
			getToBeShippedCount : {
				url : 'basic/vendor/toshippedcount',
				method : 'GET'
			},
			//获取供应商待收货出货单总数
			getInboundCount	: {
				url : 'basic/vendor/inboundcount',
				method : 'GET'
			},
			//获取供应商待收款出货单总数
			getToMoneyCount : {
				url : 'basic/vendor/tomoneycount',
				method : 'GET'
			},
			getTransactionInfo : {
				url : 'basic/vendor/transactionInfo',
				method : 'GET'
			},
			getNotDealApplyCount: {
				url: 'basic/enterprise/applyCount',
				method: 'GET'
			}
		});
	}]).factory('TakeSelf', ['$resource', function($resource) {
		return $resource('trade/takeSelf/save', {}, {
			saveTakeSelf : {
				method : 'POST'
			},
			updateTakeSelf : {
				method : 'POST'
			},
			findAllTakeSelf : {
				url : 'trade/takeSelf/page',
				method : 'GET'
			},
			deleteTakeSelf : {
				url : 'trade/takeSelf/delete/:id',
				method : 'PUT'
			},
			findAllTakeName : {
				url : 'trade/takeSelf/takeName',
				method : 'GET',
				isArray : true
			},
			findTakeSelfByStore : {
				url : 'trade/takeSelf/store/takeSelf',
				method : 'POST'
			}
		});
	}]);
});