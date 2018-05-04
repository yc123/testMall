define([ 'app/app' ], function(app) {
	app.register.controller('CheckVenderCtrl', ['$scope', '$http', 'ngTableParams', 'BaseService', '$stateParams','$state' ,'Receipt', 'Purchase', function($scope, $http, ngTableParams, BaseService, $stateParams, $state , Receipt, Purchase) {
		BaseService.scrollBackToTop();
		$scope.active = 'notsettled';
		/*
		 * 待结算 （notsettled） 显示还有出入库单未结算的企业 ,
		 * 已结算 （settled）显示还有出入库单已结算的企业 ,
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'notsettled' :
					state = '514'; break;
				case 'settled' :
					state = '515'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.checkMoneyTableParams.page() == 1)
				$scope.checkMoneyTableParams.reload();
			else
				$scope.checkMoneyTableParams.page(1);
		};
		
		$scope.checkMoneyTableParams = new ngTableParams({
			page : 1,
			count : 5
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Purchase.getEnterByStatus(param, function (page) {
					if (page.content) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					} else {
						params.total(0);
						$defer.resolve(null);
					}
				}, function (resp) {
					params.total(0);
					$defer.resolve(null);
					console.log(resp.data);
				});
			}
		});
		
		//确认结算
		$scope.ensureSettled = function(enter) {
			$state.go('request_payment',{uu:enter.uu});
		}
		
		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.checkMoneyTableParams.reload();
		}
		
			
	}]);
});