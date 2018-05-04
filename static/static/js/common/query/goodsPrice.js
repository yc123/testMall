define([ 'ngResource' ], function() {
	angular.module('PriceServices', [ 'ngResource' ]).factory('Price', ['$resource', function($resource) {
		
		return $resource('trade/goods/price/:enuu', {}, {
			//取得商品价格消息
			findPriceInfos : {
				url : 'trade/goods/price/infos',
				method : 'GET'
			},
			// 进行商品价格维护
			maintainPrice : {
				url : 'trade/goods/price/maintain',
				method : 'POST'
			},
			// 根据状态和关键字获取当前卖家所有价格信息的ID
			findIdsByStatusAndKeyword : {
				url : 'trade/goods/price/ids',
				method : 'GET',
				isArray : true
			}
		});
	}]);
});