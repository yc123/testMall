define([ 'ngResource' ], function() {
	angular.module('logisticsServices', [ 'ngResource' ]).factory('Logistics', ['$resource', function($resource) {
		return $resource('trade/goods', {}, {
			//根据id获取logistics信息
			findLogisticsById : {
				url : 'trade/logistics/:lgtid',
				method : 'GET'
			},
			// 获取全部快递公司
			findCompany : {
				url : 'trade/logistics/company',
				method : 'GET',
				isArray : true
			},
			// 激活/弃用快递公司
			active : {
				url : 'trade/logistics/company/active/:id',
				method : 'PUT'
			},
			// 获取已激活的快递公司
			getActived : {
				url : 'kdn/logistics/companyName',
				method : 'GET',
				isArray : true
			},
			// 交换快递公司序号
			exchange : {
				url : 'trade/logistics/company/exchange',
				method : 'POST'
			},
			// 获取所有快递公司名
			findCompanyName : {
				url : 'trade/logistics/companyname',
				method : 'GET',
				isArray : true
			},
			// 获取已激活的所有快递公司名
			findActivedCompanyName : {
				url : 'trade/logistics/companyname/actived',
				method : 'GET',
				isArray : true
			},
			/**
			 * 更新采购出货单的物流信息
			 */
			 updateLogistics : {
				 url : 'trade/logistics/:id',
				 method : 'POST'
			 },
			addLogistics : {
				url : 'trade/logistics/add',
				method : 'POST'
			},
			clearLogistics : {
				url : 'trade/logistics/clear',
				method : 'PUT'
			}
		});
	}]);
});