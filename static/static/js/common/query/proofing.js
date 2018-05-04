define([ 'ngResource' ], function() {
	angular.module('proofingServices', [ 'ngResource' ]).factory('Proofing', ['$resource', function($resource) {
		//获取ComponentSubmit的分页数据
		return $resource('trade/profing/:id', {}, {
			saveProfing: {
				url : 'trade/profing/save',
				method : 'POST'
			},
			//判断商品是否被送样(浏览器地址)
			isSample: {
				url : 'trade/profing/:id/issample',
				method : 'GET'
			},
			//判断商品是否被送样(直接判断)
			isSampleBatch: {
				url : 'trade/profing/:batchcode/issamplebatch',
				method : 'GET'
			},
			cancelProof: {
				url : 'trade/profing/:id/cancel',
				method : 'PUT'
			}
		});
	}]);
});