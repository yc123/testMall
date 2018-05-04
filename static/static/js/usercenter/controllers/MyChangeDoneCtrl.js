define([ 'app/app' ], function(app) {
	app.register.controller('MyChangeDoneCtrl', ['$scope', '$location', 'ngTableParams', 'BaseService', '$stateParams', 'Change'  ,'SessionService', '$filter' ,'$state' , 'toaster', function($scope, $location, ngTableParams, BaseService, $stateParams, Change , SessionService, $filter , $state ,toaster) {
		BaseService.scrollBackToTop();
		
		//保存历史点击
		$scope.active = SessionService.get('custChangeState') ? SessionService.get('custChangeState'):'TOBEREFUND';
		var enIdFilter = $filter('EncryptionFilter');
		$scope.setActive = function(state) {
			SessionService.set('custChangeState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.changetodoTableParams.page() == 1)
				$scope.changetodoTableParams.reload();
			else
				$scope.changetodoTableParams.page(1);
		};
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeshippedback' :
					state = '409'; break;
				case 'shippingin' :
					state = '410-406-403-407-408'; break;
				case 'inbound' :
					state = '404'; break;
				case 'received' :
					state = '405'; break;
				case 'notallow' :
					state = '103'; break;
			}
			return state;
		};
		
		$scope.changetodoTableParams = new ngTableParams({
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
				Change.getIndividualTodoChange(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						$scope.orderLength = page.content.length;
						$scope.count = 0;
					}
				});
			}
		});
		
		$scope.toDetail = function(changeid) {
			$location.url("home/myChange_done/" + enIdFilter(changeid));
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
			$scope.changetodoTableParams.reload();
		};
		
		/**
		 * 客户发换货单
		 */
		$scope.sendChange = function(change) {
			$state.go("ship",{id: enIdFilter(change.changeid)});
//			Change.sendChange({changeid:change.id},null,function(data) {
//				$scope.active = 'inbound';
//				$scope.changetodoTableParams.reload();
//				toaster.pop('success', '发货成功!');
//			}, function(res){
//				
//			})
		}
		/**
		 * 收货
		 */
		$scope.ensureAccept = function(change) {
			Change.custAccept({changeid:change.id},{},function(data){
				$scope.changetodoTableParams.reload();
				toaster.pop('success', '处理成功');
			}, function(res){
				toaster.pop('error', '失败！');
			});
		}
		
	}]);
	
});