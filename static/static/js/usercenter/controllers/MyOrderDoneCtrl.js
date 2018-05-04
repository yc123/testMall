define([ 'app/app' ], function(app) {
	app.register.controller('MyOrderDoneCtrl', ['$scope', 'ngTableParams', '$window' ,'BaseService', 'Order', 'toaster', '$filter', function($scope, ngTableParams, $window , BaseService, Order, toaster, $filter) {
		BaseService.scrollBackToTop();
		
		var enIdFilter = $filter('EncryptionFilter');
		$scope.active = "checkdeadline";
		$scope.availables = '516';
		var getState = function() {
			var state = '405';
			switch($scope.active) {
				case 'checkdeadline' : //未过期
				$scope.availables = '517'; break;
				case 'nocheckdeadline' : //已过期
				$scope.availables = '516'; break;
				case 'alreadyReturn': //已失效 （因为订单全部已退货而失效）
				state = '605'; break;
				case 'inaftersales': //售后中
				state = '511'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.orderdoneTableParams.page() == 1)
				$scope.orderdoneTableParams.reload();
			else
				$scope.orderdoneTableParams.page(1);
		};
		
		
		$scope.orderdoneTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				reciptTime: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.status = getState();
				param.available = $scope.availables;
				param.keyword = $scope.keyword;
				$scope.count = 0;
				Order.getIndividualOrder(param, function(page) {					
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
	
		
		
		//申请售后
		$scope.afterSale = function(order) {
			//先判断此订单状态是否被改变，改变成售后则刷新界面
			var encryorderid = enIdFilter(order.orderid);
			Order.findByCode({orderid:encryorderid},function(data) {
				if(data.status == 405) {
					var url = "user#/home/myAfter_sales/" + encryorderid;
					$window.open(url);
				}else {
					toaster.pop('info', '该订单已在售后处理中，请重新选择!');
					$scope.orderdoneTableParams.reload();
				}
			},function(data) {
				toaster.pop('error', '数据加载失败');
			})
		}
		
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
		
		$scope.upper = function() {
			$scope.time = 1;
			clearTimeout(t);
			setTime();
		}
		
		//根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.orderdoneTableParams.reload();
		}
		
		
	}]);
	
});