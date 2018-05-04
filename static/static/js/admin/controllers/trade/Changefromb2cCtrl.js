define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('Changefromb2cCtrl', ['$scope' ,'BaseService' ,'Change', 'ngTableParams' , 'SessionService' ,'toaster','ShippingAddress', '$stateParams', '$anchorScroll' ,'$location' , 'Logistics', function($scope , BaseService , Change ,ngTableParams, SessionService ,toaster,ShippingAddress ,$stateParams ,$anchorScroll, $location, Logistics) {
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminChangefmbState')? SessionService.get('adminChangefmbState'):'tobeshippedback';
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
//				case 'tobeshippedback' :
//					state = 'tobeshippedback' + 'Fb2c'; break;
//				case 'inspecting' :
//					state = 'inspecting' + 'Fb2c'; break;
//				case 'received' :
//					state = 'received' + 'Fb2c'; break;
				case 'tobeshippedback' :
					state = '409'; break;
				case 'inspecting' :
					state = '410'; break;
				case 'send' :
					state = '406-407-404'; break;
			
			}
			return state;
		};
		
		$scope.onSearch = function() {
			$scope.changefmb2cTableParams.reload();
		};
		
		$scope.changefmb2cTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Change.getIndividualfb2c(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						clearchecked();//清零数据
						var orderCount = page.content.length;
						while($scope.checkCodes.length <  orderCount) {
							$scope.checkCodes.push(false);
						}
						//备份一份，因为需要修改从后台传输过来的数据，所以做一个备份。
						//那就只修改这个备份的数据,原数据不做改变
						$scope.localChange = angular.copy(page.content);
						$scope.count = 0;//代表当前选中的行数  用在button
						/*防止原来的数据存在，删除之前的操作*/
						delete $scope.deliveryStatusSaveDelivery;
						delete $scope.deliveryStatusEntryCheck;
						delete $scope.selectSendAddr;
						delete $scope.logistics;
						delete $scope.batchChange;
						delete $scope.sendAddr;
					}
				});
			}
		});
		
		$scope.setActive = function(state) {
			SessionService.set('adminChangefmbState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.changefmb2cTableParams.page() == 1)
				$scope.changefmb2cTableParams.reload();
			else
				$scope.changefmb2cTableParams.page(1);
		};

		
		/*批量确认出货  开始代码*/
		$scope.getBatch = function() {
			var batchChange = [];
			for (var i = 0; i < $scope.checkCodes.length; i++) {
				if($scope.checkCodes[i]) {
					batchChange.push($scope.localChange[i]);
				};
			}
			return batchChange;
		}
		//展开
		$scope.deliveryExpose = function(change) {
			change.expose = !change.expose;
		}
		//切换
		$scope.back = function() {
			$scope.deliveryStatusSaveDelivery = false;
			$scope.deliveryStatusEntryCheck = true;
		}
		/**
		 * 平台发货（向供应商发）
		 */
		$scope.sendChange = function(b2cChange) {
			//初始化信息
			$scope.selectSendAddr = {}; //默认的发货地址
			$scope.logistics = {}; //快递信息
			
			if(b2cChange) {
				$scope.batchChange = [];
				$scope.batchChange.push(b2cChange);
			}else {
				$scope.batchChange = $scope.getBatch();
			}
			
			angular.forEach($scope.batchChange, function(b2cChange) {
				b2cChange.expose = false;
				if(b2cChange.jsonAddress) {
					b2cChange.jsonAddress = angular.fromJson(b2cChange.jsonAddress);
				}
			});
			if(angular.equals(angular.toJson($scope.batchChange),"[]")) {
				toaster.pop('error', '错误', '请选择要确认出货单的订单');
				return;
			}
			$location.hash('bottom');
			$anchorScroll();
			
			//获取已激活物流公司信息
			Logistics.getActived({}, {}, function(data) {
				$scope.express = data;
			}, function() {
				toaster.pop('info', '获取物流公司失败');
			});
//			$http.get('static/js/common/data/expressSimple.json').success(function(data) {
//				$scope.express = data;
//			}).error(function() {
//				toaster.pop('info', '获取物流公司失败');
//			});
			loadAddrs();
			$scope.deliveryStatusEntryCheck = true;
			$scope.deliveryStatusSaveDelivery = false;
		}
		
		$scope.select = function(add) {
			$scope.selectSendAddr = add;
		}
		
		var loadAddrs = function() {
			//获取平台的发货地址
			ShippingAddress.findB2cAdd({send: true}, {}, function(data) {
				$scope.sendAddr = data;
				$scope.selectSendAddr = $scope.sendAddr[0];
			}, function(res) {
				toaster.pop('error', '获取地址信息失败');
			});
		};
		
		//录入并核对的方法
		$scope.entryCheck = function() {
			if(!$scope.logistics.companyName) {
				toaster.pop('error', '错误', '请输入物流公司');
				return ;
			}
			if(!$scope.logistics.number) {
				toaster.pop('error', '错误', '请输入快递单号');
				return ;
			}
			if(!$scope.selectSendAddr || angular.equals(angular.toJson($scope.selectSendAddr),'{}')) {
				toaster.pop('error', '错误', '请选择发货地址');
				return ;
			}
			var index = 0;
			angular.forEach($scope.batchChange, function(change) {
				change.logistics = {};
				$scope.logisitcsDetail = angular.fromJson($scope.logistics.companyName);
				change.logistics.companyName = $scope.logisitcsDetail.name;
				change.logistics.companyId = $scope.logisitcsDetail.id;
				change.logistics.number = Number($scope.logistics.number) + index;
				index++;
			});
			$scope.deliveryStatusSaveDelivery = true;
			$scope.deliveryStatusEntryCheck = false;
		};
		
		/**
		 * 确认发货
		 */
		$scope.confirmAndDelivery = function() {
			var logistics = [];
			var changeId = [];
			angular.forEach($scope.batchChange, function(change) {
				change.jsonAddress = angular.toJson(change.jsonAddress);
				change.jsonSdAddress = angular.toJson($scope.selectSendAddr);
				logistics.push(change.logistics);
				changeId.push(change.id);
			});
			if(angular.equals(angular.toJson(changeId),'[]')) {
				toaster.pop('error','错误', '换货为空，操作失败');
				return;
			}
			if(angular.equals(angular.toJson(logistics),'[]')) {
				toaster.pop('error','错误', '请返回上一步输入物流信息');
				return;				
			}
			if(angular.equals(angular.toJson($scope.selectSendAddr),'{}')) {
				toaster.pop('error','错误', '请返回上一步选择发货地址');
				return;					
			}
			Change.batchSendForVender({}, $scope.batchChange, function(data) {
				toaster.pop('success', '成功', '发货成功');
				$scope.changefmb2cTableParams.reload();
			});
			delete $scope.deliveryStatusSaveDelivery;
			delete $scope.deliveryStatusEntryCheck;
			delete $scope.selectSendAddr;
			delete $scope.logistics;
			delete $scope.batchChange;
			delete $scope.sendAddr;
		}
		
		/**
		 * 确认退款
		 */
		$scope.ensurePaid = function(b2cChange) {
			Change.ensurePaid({changeid:b2cChange.id},null,function(data) {
				$scope.changefmb2cTableParams.reload();
				toaster.pop('success', '处理成功', '平台退款成功');
			},function() {
				toaster.pop('error', '退款失败');
			})
		};
		
		//多选操作
		$scope.checks = {
			checked : false
		};
		
		$scope.checkCodes = [];
		
		//将数据清零
		var clearchecked = function () {
			$scope.checks = {
					checked : false
				};
			$scope.checkCodes = [];
		}
		// 点击勾选Code全部的复选框
		$scope.checkAll = function(){
			if($scope.checks.checked) {
				$scope.count = $scope.localChange.length;
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
			angular.forEach($scope.checkCodes, function(item, key) {
				if(!item){
					result = false;
					return;
				}
			});
			$scope.checks.checked = result;
		}
		
	}]);
});