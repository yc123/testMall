define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('GoodsPriceCtrl', ['$scope', 'toaster', '$modal', 'BaseService', 'ngTableParams', 'Price', 'ExpressPrice', function($scope, toaster, $modal, BaseService ,ngTableParams , Price, ExpressPrice) {
		BaseService.scrollBackToTop();
		
		var data = [];
		$scope.active = 'available';
		// 记录全选状态
		$scope.selectedAll = false;
		$scope.batch = false;
		$scope.ids = [];
		// 设置全选和全不选
		$scope.selecteAll = function() {
			$scope.selectedAll = !$scope.selectedAll;
			if ($scope.selectedAll) {
				var param = {};
				param.keyword = $scope.keyword;
				param.status = $scope.active;
				// 从后台服务器获取所有ID值
				Price.findIdsByStatusAndKeyword(param, function(data) {
					if (data.length > 0) {
						$scope.ids = data;
					}
				}, function(response) {
				});
			} else {
				$scope.ids.length = 0;
			}
		};
		// 设置商品价格的状态
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.selectedAll = false;
			// 加载数据
			if ($scope.priceTableParams.page() == 1) {
				$scope.priceTableParams.reload();
			}
			$scope.priceTableParams.page(1);
		};
		// 添加或删除选中商品的id
		$scope.changeIds = function(id) {
			var index = -1;
			angular.forEach($scope.ids, function(value, key) {
				// 如果找到id则删除
				if (value == id) {
					index = key;
					return;
				}
			});
			// 如果没有找到则添加到ids中
			if (index == -1) {
				$scope.ids.push(id);
			} else {
				$scope.ids.splice(index, 1);
			}
			// 如果ids为空数组，则取消全选checkbox的选中状态
			if ($scope.ids.length == 0) {
				$scope.selectedAll = false;
			}
		};
		
		$scope.priceTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				code : 'ASC',
				currencyName : 'ASC',
				tax : 'ASC'
			}
		}, {
			total : 0,
			counts : [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = $scope.active;
				Price.findPriceInfos(param, function(page) {
					// 加载数据
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						data = page.content;
					}
				}, function(response) {
					toaster.pop("error", "加载数据出错" + response.text);
				});
			}
		});
		
		//根据品牌、类型、型号、币别查询价格信息
		$scope.onSearch = function() {
			$scope.selectedAll = false;
			// 更新列表从第1页开始显示
			if ($scope.priceTableParams.page() == 1) {
				$scope.priceTableParams.reload();
			}
			$scope.priceTableParams.page(1);
		};
		
		// 修改一条价格信息
		$scope.maintain = function(priceInfo) {
			if ($scope.active == 'unavailable') {
				toaster.pop("warnning", "请不要修改库存为0或下架的商品的价格信息");
				return ;
			}
			$scope.batch = false;
			modalOperator(priceInfo.id);
		};
		// 批量修改价格信息
		$scope.batchUpdate = function() {
			if ($scope.active == 'unavailable') {
				toaster.pop("warnning", "请不要修改库存为0或下架的商品的价格信息");
				return ;
			}
			if ($scope.ids.length > 0) {
				$scope.batch = true;
				modalOperator($scope.ids);
			} else {
				toaster.pop("warnning", "请选中至少一条要修改的价格信息");
			}
		}
		
		function modalOperator(id) {
			$modal.open({
				animation : true,
				templateUrl : 'static/view/vendor/price_update_modal.html',
				controller : 'PriceUpdateCtrl',
				windowClass : 'modal-normal'
			}).result.then(function(data){ 
				var param = {
					data : id,
					newPrice : data.newPrice,
					range : data.range,
					batch : $scope.batch
				}
				Price.maintainPrice({}, param, function(data) {
					if (data) {
						$scope.priceTableParams.reload();
					}
					$scope.selectedAll = false;
					$scope.ids.length = 0;
				}, function(response) {
					toaster.pop("error", "加载数据出错" + response.text);
				});
			}, function(){
				// 取消模态框
			});
		}
		
	}]);
	
	// 商品价格修改模态框用到的Ctrl
	app.register.controller('PriceUpdateCtrl', ['$scope', 'toaster', '$modalInstance', function($scope, toaster, $modalInstance) {
		$scope.chooseKind = 1;
		$scope.range = null;
		$scope.newPrice = null;
		// 取消修改
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.switchKind = function() {
			console.log($scope.chooseKind);
			if ($scope.chooseKind == 1) {
				$scope.newPrice = null;
			}
			if ($scope.chooseKind == 2) {
				$scope.range = null;
			}
		}
		
		// 确认保存
		$scope.check = function() {
			var a = {};
			// 如果调整幅度存在，则按照调整幅度进行调整
			if ($scope.range) {
				a.range = $scope.range;
				$modalInstance.close(a);
				return true;
			}
			if ($scope.newPrice) {
				a.newPrice = $scope.newPrice;
				$modalInstance.close(a);
				return true;
			}
		};
	}]);
});