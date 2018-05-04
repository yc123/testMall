define([ 'app/app' ], function(app) {
	//入库单
	app.register.controller('HistTransferCtrl', ['$scope', '$anchorScroll', '$filter', 'BaseService' , 'ngTableParams', 'bankTransferService', 'toaster', '$stateParams', function($scope, $anchorScroll, $filter, BaseService ,ngTableParams, bankTransferService, toaster, $stateParams) {
		BaseService.scrollBackToTop();
		$scope.keyword = "";
		
		$scope.active = "isVender";
			
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'isVender' :
					state = true; break;
				case 'notVender' :
					state = false; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.historyTransferTableParams.page() == 1)
				$scope.historyTransferTableParams.reload();
			else
				$scope.historyTransferTableParams.page(1);
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
		}
		
		// 根据搜索框输入流水单号搜索对应转账单
		$scope.search = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.historyTransferTableParams.reload();
		}
		
		var hideBankFilter = $filter("hideBankFilter");
		
		$scope.historyTransferTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				tranferCreateTime : 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.isVender = getState();
				bankTransferService.getAdminBankTransfer.call(null, param, function(page) {
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