define([ 'app/app' ], function(app) {
	app.register.controller('MyProofingCtrl', ['$scope', 'ngTableParams', '$window' ,'BaseService', 'Order', 'toaster', 'EncryptionService','Proofing' ,'OrderSimpleInfo' , function($scope, ngTableParams, $window , BaseService, Order, toaster,EncryptionService, Proofing,OrderSimpleInfo) {
		BaseService.scrollBackToTop();
		
		$scope.active = "unaudit";
		var getState = function() {
			var state = '403';
			switch($scope.active) {
				case 'unaudit': //已申请
				state = '605-403'; break;
				case 'intransit': //在途
				state = '407-408'; break;
				case 'inbound': //待收货
				state = '404'; break;
				case 'received' : //已收货
					state = '405'; break;
				case 'unavailable' : //已失效
					state = '606'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.ordertodoTableParams.page() == 1)
				$scope.ordertodoTableParams.reload();
			else
				$scope.ordertodoTableParams.page(1);
		};

		$scope.ordertodoTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				status : "DESC",
				creattime : "DESC"
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
				Order.getIndividualProof(param, function(page) {
					//将数据清零
					clearchecked();
					var orderCount = page.content.length;
					$scope.checks.checked = false;
					if(orderCount != 0) {
						angular.forEach(page.content, function(value, key){
							//给checkCodes数组赋初始值
							if($scope.checkCodes.length < orderCount) {
								$scope.checkCodes.push(false);
							}
						});
					}
					
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						$scope.orderLength = page.content.length;
						$scope.count = 0;
					}
				});
			}
		});
			
		//将数据清零
		var clearchecked = function () {
			$scope.canDo = false;
			$scope.checks = {
					checked : false
				};
			$scope.checkCodes = [];
		};
		
		//多选操作
		$scope.checks = {
			checked : false
		};
		
		$scope.checkCodes = [];
		
		// 点击勾选Code全部的复选框
		$scope.checkAll = function() {
			if($scope.checks.checked) {
				$scope.count = $scope.orderLength;
			}else {
				$scope.count = 0;
			}
			angular.forEach($scope.checkCodes, function(item, key) {
				$scope.checkCodes[key] = $scope.checks.checked;
			});
		};
		
		//点击Code单选
		$scope.checkOne = function(index) {
			var result = true;
			if($scope.checkCodes[index]) {
				$scope.count++;
			}else {
				$scope.count--;
			}
			angular.forEach($scope.checkCodes, function(item,key) {
				if(!item){
					result = false;
					return;
				}
			});
			$scope.checks.checked = result;
		}
		
		
		//根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.orderdoneTableParams.reload();
		}
		
		//确认收货
		$scope.ensureAccept = function(order) {
			var ids = order ? order.id : getStrids();
			OrderSimpleInfo.ensureAccept({ids: ids},{},function(data){
				$scope.ordertodoTableParams.reload();
				toaster.pop('success', '处理成功');
				$scope.ordertodoTableParams.reload();
			}, function(res){
				toaster.pop('error', '失败！');
			});
		}
		
		/**
		 * 取消申请
		 */
		$scope.cancel = function(order) {
			var c = confirm("是否确定要取消此订单？");
			//TODO 作废订单 释放库存 
			if(c) {
				Proofing.cancelProof({id:order.orderid}, null ,function(data) {
					toaster.pop('success', '取消申请成功，订单已失效！');
					$scope.setActive('unavailable');
				},function(res) {
					console.log(res)
					toaster.pop('error', '系统错误' + res);
				})
			}
		}
		
	}]);
	
});