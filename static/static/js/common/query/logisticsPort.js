define([ 'ngResource' ], function() {
	angular.module('logisticsPortService', [ 'ngResource' ]).factory('LogisticsPort', ['$resource', function($resource) {
		return $resource('trade/logisticsPort', {}, {
			// 邮政新增订单接口3.2
			EMSNewOrderMailNo : {
				url : 'trade/logisticsPort/newOrderMailNo',
				method : 'POST'
			},	
			queryLogistics: {
				url : 'trade/logisticsPort/queryLogistics',
				method : 'POST'
			},
			cancelOrder: {
				url : 'trade/logisticsPort/cancelOrder',
				method : 'POST'
			},
			getMailNo: {
				url : 'trade/logisticsPort/getMailNo',
				method : 'POST'
			}
			
		});
	}]).factory('KdnLogistics', ['$resource', function($resource){
		return $resource('trade/kdnLogistics', {}, {
			kdnQuery : {
				url : 'kdn/logistics/query',
				method : 'GET'
			},
			kdnQueryCompany : {
				url : 'kdn/logistics/findCompany/:companyName',
				method : 'GET'
			},
			kdnBooking : {
				url : 'kdn/logistics/booking',
				method : 'POST'
			},
			getCompanyName : {
				url : 'kdn/logistics/companyName',
				method : 'GET',
				isArray: true
			},
			getKdnAndSeller : {
				url : 'kdn/logistics/kdnAndSeller',
				method : 'GET'
			},
			findKdnPage : {
				url : 'kdn/logistics/page',
				method : 'GET'
			},
			saveSellerLogistics : {
				url : 'kdn/logistics/seller/save',
				method : 'POST'
			},
			kdnEOrder: {
				url : 'kdn/logistics/eorder',
				method : 'POST'
			},
			kdnLogisticsList: {
				url : 'kdn/logistics/list',
				method : 'GET'
			}
		});
	}]).factory('Distributor',['$resource', function($resource){
		return $resource('trade/distributor', {}, {
			saveDistributor : {
				url: 'trade/distributor/save',
				method: 'POST',
				isArray : true
			},
			deleteOne : {
				url: 'trade/distributor/delete/:id',
				method: 'PUT'
			},
			findAllSelected : {
				url: 'trade/distributor/selected',
				method: 'GET',
				isArray : true
			}
		});
	}]).factory('DistributionRule', ['$resource', function ($resource) {
		return $resource('trade/distributionRule',　{},　{
			saveRule : {
				url: 'trade/distributionRule/save',
				method: 'POST'
			},
			deleteOne : {
				url: 'trade/distributionRule/delete/:id',
				method: 'PUT'
			},
			/**
			 * 分页获取配送规则列表
			 */
			findAllRule : {
				url: 'trade/distributionRule/page',
				method: 'GET'
			},
			findAllRuleName : {
				url: 'trade/distributionRule/ruleName',
				method: 'GET',
				isArray : true
			},
			changeActive : {
				url: 'trade/distributionRule/status',
				method: 'POST'
			},
			findCountOfRule : {
				url: 'trade/distributionRule/count',
				method: 'GET'
			},
			findCountOfActiveRule : {
				url: 'trade/distributionRule/active/count',
				method: 'GET'
			},
			checkRuleName : {
				url: 'trade/distributionRule/checkName',
				method: 'GET'
			},
			findMatchRule : {
				url: 'trade/distributionRule/rule/matchArea',
				method: 'GET',
				isArray : true
			},
			findFareOfRule : {
				url: 'trade/distributionRule/fare',
				method: 'POST',
				isArray : true
			},
			findUsableRule : {
				url: 'trade/distributionRule/usable/rule',
				method: 'POST'
			}
		})
	}]).factory('TipRecord', ['$resource', function ($resource) {
		return $resource('tip/record', {}, {
			findTipRecordOfRule : {
				url: 'tip/record/rule',
				method: 'GET'
			},
			turnTipRecordOfRule : {
				url: 'tip/record/rule/close',
				method: 'PUT'
			}
		})
	}]);
});