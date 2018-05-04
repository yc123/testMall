define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('OriginalCtrl', ['$scope', 'toaster', 'ComponentActive', 'Cart', 'Goods', 'ngTableParams', '$modal', 'BaseService', 'KindAPI', '$location', '$rootScope', function ($scope, toaster, ComponentActive, Cart, Goods, ngTableParams, $modal, BaseService, KindAPI, $location, $rootScope) {
		$rootScope.page = 'hot-products';// 导航栏锚点状态，'现货'状态显示激活

		var imgsTop = [
			'static/img/product/original/pro01.jpg',
			'static/img/product/original/pro02.jpg',
			'static/img/product/original/pro01.jpg'
		];

		var imgsCenter = [
			'static/img/product/original/pro03.jpg',
			'static/img/product/original/pro04.jpg',
			'static/img/product/original/pro05.jpg',
			'static/img/product/original/pro03.jpg',
			'static/img/product/original/pro04.jpg'
		];
		
		//推荐样品
		ComponentActive.recommendOriginal({qty:3},function(data) {
			$scope.recommends = data;
		}, function() {
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
		}, function() {
			toaster.pop('error', '获取类目信息失败 ');
		});

		// 设置库存类型为现货1311
		$scope.original = 1311;
		// 获取子作用域的TableParams
		$scope.setComponentTableParams = function (tableParams) {
			$scope.componentTableParams	= tableParams;
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

		Goods.getLatestGoods({length: 17}, function (data) {
			$scope.hotProTop = data.slice(0,3);
			// angular.forEach($scope.hotProTop, function (key, value) {
			// 	key.img = imgsTop[value];
			// });
			$scope.hotProCenter = data.slice(3,8);
			// angular.forEach($scope.hotProCenter, function (key, value) {
			// 	key.img = imgsCenter[value];
			// });
			$scope.newProTop = data.slice(8,11);
			// angular.forEach($scope.newProTop, function (key, value) {
			// 	key.img = imgsTop[value];
			// });
			$scope.newProCenter = data.slice(11,16);
			// angular.forEach($scope.newProCenter, function (key, value) {
			// 	key.img = imgsCenter[value];
			// });
		}, function (response) {
			toaster.pop('error', '获取库存的信息失败');
		})
	}]);
});
