define([ 'app/app' ], function(app) {
	app.register.controller('MyRefundDoneCtrl', ['$scope', 'refundService', '$location', 'ngTableParams', 'BaseService','SessionService' , '$filter', function($scope, refundService, $location, ngTableParams, BaseService, SessionService, $filter) {
		var enIdFilter = $filter('EncryptionFilter');
		// 保存历史点击
		$scope.active = SessionService.get('custRefundState') ? SessionService.get('custRefundState') : 'TOBEREFUND';
		// 刷新页面
		var freshPage = function () {
			if ($scope.refundToDoTableParams.page() != 1) {
				$scope.refundToDoTableParams.page(1);
			}
			$scope.refundToDoTableParams.reload();
		};
		// 切换状态
		$scope.setActive = function(state) {
			SessionService.set('custChangeState', state);
			if($scope.active != state) {
				$scope.active = state;
			}
			freshPage();
		};

		$scope.refundToDoTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createTime: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = $scope.active;
				$scope.count = 0;
				refundService.pageOnesRefundByKeyword(param, function (page) {
					if (page.content) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						$scope.orderLength = page.content.length;
						$scope.count = 0;
					}
				});
			}
		});

		// 跳转退款单详情页面
		$scope.toDetail = function(voucherID) {
			$location.url("home/myRefund_done/" + enIdFilter(voucherID));
		};

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
		};

		// 根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			freshPage();
		};
	}]);

});
