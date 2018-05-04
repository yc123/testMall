define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('InactionStockCtrl', ['$scope', 'toaster', '$stateParams','ComponentActive' ,'Cart', 'Goods', 'ngTableParams' ,'$modal' ,'BaseService' ,'KindAPI', '$location', '$rootScope', function($scope, toaster, $stateParams, ComponentActive, Cart, Goods, ngTableParams, $modal, BaseService, KindAPI, $location, $rootScope) {
		$rootScope.page = 'inactionStock';// 导航栏锚点状态，'工厂库存'状态显示激活
		
		//推荐品牌
		ComponentActive.recommendOriginal({qty:3},function(data) {
			$scope.recommends = data;
		}, function(response) {
			toaster.pop('error', '获取类目信息失败 ');
		});
		KindAPI.getChildren({parentId: 0}, function(data) {
			$scope.kinds = [];
			var allkind = {'nameCn':'全部','id':-1};
			$scope.kinds.push(allkind);
			$scope.kinds.push.apply($scope.kinds,data);
			$scope.myflag = {
				'flag':true,
				'activeid':-1
			};
		}, function(response) {
			toaster.pop('error', '获取类目信息失败 ');
		});

		// 设置库存类型为呆滞库存1312
		$scope.original = 1312;
		// 获取子作用域的TableParams
		$scope.setComponentTableParams = function (tableParams) {
			$scope.componentTableParams = tableParams;
		};

		$scope.onFlag = function (){
			$scope.myflag.flag = !$scope.myflag.flag;
		};
		
		$scope.onSearch = function() {
			$scope.componentTableParams.reload();
		};
		
		$scope.searchKind = function(kind) {
			if(kind.id) {
				$scope.myflag.activeid = kind.id;
				if( kind.id != -1) {
					$scope.kindId = kind.id
				} else{
					delete $scope.kindId;
				}
			}
			$scope.componentTableParams.reload();
		};
	}]);
});
