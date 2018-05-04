define([ 'app/app' ], function(app) {
	app.register.controller('MyReturnDoneCtrl', ['$scope', 'ngTableParams', 'BaseService', '$stateParams', '$location', 'Return'  ,'SessionService', 'toaster', '$state' , '$filter' , function($scope, ngTableParams, BaseService , $stateParams, $location, Return , SessionService, toaster , $state, $filter) {
		BaseService.scrollBackToTop();
		
		//保存历史点击
		$scope.active = SessionService.get('custReturnState') ? SessionService.get('custReturnState'):'tobeshippedback';
		var enIdFilter = $filter('EncryptionFilter');
		$scope.setActive = function(state) {
			SessionService.set('custReturnState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.returntodoTableParams.page() == 1)
				$scope.returntodoTableParams.reload();
			else
				$scope.returntodoTableParams.page(1);
		};
		
		/*
		 * 申请中（unaudit）按钮下显示（311）订单，
		 * 待回寄（tobeshippedback）按钮下显示待回寄（409）的订单，
		 * 待收款（toreceivemoney）按钮下显示 待收款（410-411-507）三种状态的订单，
		 * 已收款（moneyreceived）按钮下显示已收款（505）状态的订单，
		 * 未通过（notallow）按钮下显示平台审核未通过（103）的订单
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeshippedback' :
					state = '409'; break;
				case 'toreceivemoney' :
					state = '410-411-507'; break;
				case 'moneyreceived' :
					state = '508'; break;
				case 'notallow' :
					state = '103'; break;
			}
			return state;
		};
		
		$scope.returntodoTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createtime: 'DESC'
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
				$scope.count = 0;
				Return.getIndividualTodoReturn(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						$scope.orderLength = page.content.length;
						$scope.count = 0;
					}
				});
			}
		});
		
		$scope.toDetail = function(returnid) {
			$location.url("home/myReturn_done/" + enIdFilter(returnid));
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
		
		// 根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.returntodoTableParams.reload();
		};
		
		$scope.afterSale = function(returns) {
			$state.go("shipFreturn",{id: enIdFilter(returns.returnid)});
			
//			Return.sendReturn({returnid:returns.id},null,function(data) {
//				$scope.active = 'toreceivemoney';
//				$scope.returntodoTableParams.reload();
//				toaster.pop('success', '发货成功!');
//			}, function(res){
//				
//			})
		}
		
		
	}]);
	
});