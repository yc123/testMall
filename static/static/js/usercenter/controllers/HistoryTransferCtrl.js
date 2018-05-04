define(['app/app'],function(app) {
	app.register.controller('HistoryTransferCtrl', ['$scope', 'ngTableParams', 'bankTransferService', 'BaseService', '$filter', function($scope, ngTableParams, bankTransferService, BaseService, $filter) {
		BaseService.scrollBackToTop();
		
		$scope.keyword = "";
		
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
		
		// 根据搜索框输入流水单号搜索对应转账单
		$scope.search = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.historyTransferTableParams.reload();
		}
		
		var hideBankFilter = $filter("hideBankFilter");
		
		$scope.historyTransferTableParams = new ngTableParams({
			page : 1,
			count : 20,
			sorting : {
				tranferCreateTime : 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				bankTransferService.getHisBankTransfer.call(null, param, function(page) {
					if(page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						angular.forEach(page.content, function(bankTranfer) {
							bankTranfer.payAccount = angular.fromJson(bankTranfer.jsonPament);
							bankTranfer.payAccount.filterNum = hideBankFilter(bankTranfer.payAccount.number);
							bankTranfer.receiveAccount = angular.fromJson(bankTranfer.jsonReceive);
							bankTranfer.receiveAccount.filterNum = hideBankFilter(bankTranfer.receiveAccount.number);
						});
					}
				})
			}
		});
	}]);
});