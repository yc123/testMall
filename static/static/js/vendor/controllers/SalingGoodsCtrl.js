define(['app/app'], function(app) {
	'use strict';
	app.register.controller('SalingGoodsCtrl', ['$scope', 'Goods', 'toaster', '$modal', '$stateParams', 'BaseService', 'ngTableParams', 'ComponentActiveAPI', '$state', function($scope, Goods, toaster, $modal, $stateParams, BaseService ,ngTableParams ,ComponentActiveAPI,$state) {
		BaseService.scrollBackToTop();
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('downedGoodsState')? window.sessionStorage.getItem('downedGoodsState'):'available';

		var getState = function() {
			var state = '';
			switch($scope.active) {
				case 'available' :
					state = 'AVAILABLE'; break;
				case 'unavailable' : 
					state = 'UNAVAILABLE'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			window.sessionStorage.setItem('downedGoodsState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.salingGoodsTableParams.page() == 1) {
				$scope.salingGoodsTableParams.reload();
			}
			$scope.salingGoodsTableParams.page(1);
		};
		
		$scope.activeComp = [];// 存储标准元器件信息的数组
		//分页获取产品信息
		$scope.salingGoodsTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createdDate: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Goods.findSalingGoods(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						var data = page.content;
					}
				}, function(response) {
					toaster.pop("error", "加载数据出错" + response.text);
				});
			}
		});
		
		// 搜索框内容转换成大写
		var t;
		var setTime = function() {
			if($scope.time > 0) {
				t = setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				$scope.keyword = angular.uppercase($scope.keyword);
			}
		};
		
		//根据批次号搜索单据
		$scope.onSearch = function() {
			if($scope.salingGoodsTableParams.page() == 1) {
				$scope.salingGoodsTableParams.reload();
			}
			$scope.salingGoodsTableParams.page(1);
		}

		//刷新批次有效期
		$scope.refresh = function(goods) {
			Goods.refresh({id : goods.id}, {}, function(data) {
				toaster.pop("success", '', "刷新成功");
			}, function(res) {
				toaster.pop("error", '错误', res.data);
			});
		}
		
		//下架
		$scope.discharge = function(goods, index) {
			var component = $scope.activeComp[index];
			var modalInstance = $modal.open({
				templateUrl : "static/view/vendor/modal/discharge_goods_modal.html",
				controller : "GoodsDischargeCtrl",
				size : "lg",
				resolve : {
					goods : function() {
						console.log(goods);
						return angular.copy(goods);
					}
				}
			});
			modalInstance.result.then(function() {
				$scope.salingGoodsTableParams.reload();
			}, function() {
				
			});
		}
	
		//批量下架
		$scope.batchDown = function() {
			Goods.batchDownAll({}, function(){
				toaster.pop("success", "批量下架成功");
				$scope.salingGoodsTableParams.reload();
			}),function(){
				toaster.pop("error", "批量下架失败");
			};
		};
		
		
	}]);
	
});