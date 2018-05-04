define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('Returnfromb2cCtrl', ['$scope', '$anchorScroll',  '$modal' , '$filter' , 'BaseService' ,'Return','ngTableParams' , 'SessionService' ,'toaster', 'ShippingAddress' , '$location' , '$stateParams', 'bankInfoService' ,'bankTransferService' , 'Logistics', function($scope, $anchorScroll, $modal , $filter , BaseService , Return ,ngTableParams, SessionService ,toaster, ShippingAddress , $location ,$stateParams, bankInfoService, bankTransferService, Logistics) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminReturnfmbState')? SessionService.get('adminReturnfmbState'):'inspecting';
		var hideBankFilter = $filter("hideBankFilter");
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'tobeshippedback' :
					state = '409'; break;
				case 'inspecting' :
					state = '410'; break;
				case 'received' :
					state = '405'; break;
			}
			return state;
		};
		
		$scope.onSearch = function() {
			$scope.returnfmb2cTableParams.reload();
		};
		
		$scope.returnfmb2cTableParams = new ngTableParams({
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
				Return.getIndividualB2c(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		console.log($scope.returnfmb2cTableParams);
		$scope.setActive = function(state) {
			SessionService.set('adminReturnfmbState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.returnfmb2cTableParams.page() == 1)
				$scope.returnfmb2cTableParams.reload();
			else
				$scope.returnfmb2cTableParams.page(1);
		};
		
		/*批量确认出货  开始代码*/
		$scope.getBatch = function() {
			var batchReturn = [];
			for (var i = 0; i < $scope.checkCodes.length; i++) {
				if($scope.checkCodes[i]) {
					batchReturn.push($scope.localReturn[i]);
				}
			}
			return batchReturn;
		};
		//展开
		$scope.deliveryExpose = function(thisreturn) {
			thisreturn.expose = !thisreturn.expose;
		};
		//切换
		$scope.back = function() {
			$scope.deliveryStatusSaveDelivery = false;
			$scope.deliveryStatusEntryCheck = true;
		};
		/**
		 * 平台发货（向供应商发）
		 */
		$scope.sendReturn = function(b2creturn) {
			//初始化信息
			$scope.selectSendAddr = {}; //默认的发货地址
			$scope.logistics = {}; //快递信息
			
			if(b2creturn) {
				$scope.batchReturn = [];
				$scope.batchReturn.push(b2creturn);
			}else {
				$scope.batchReturn = $scope.getBatch();
			}
			
			angular.forEach($scope.batchReturn, function(b2creturn) {
				b2creturn.expose = false;
				if(b2creturn.jsonAddress) {
					b2creturn.jsonAddress = angular.fromJson(b2creturn.jsonAddress);
				}
			});
			if(angular.equals(angular.toJson($scope.batchReturn),"[]")) {
				toaster.pop('error', '错误', '请选择要确认出货单的订单');
				return;
			}
			$location.hash('bottom');
			$anchorScroll();
			//获取平台的发货地址
			Logistics.getActived({}, {}, function(data) {
				$scope.express = data;
			}, function() {
				toaster.pop('info', '获取物流公司失败');
			});
			loadAddrs();
			$scope.deliveryStatusEntryCheck = true;
			$scope.deliveryStatusSaveDelivery = false;
		};
		
		$scope.select = function(add) {
			$scope.selectSendAddr = add;
		};
		
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
			if(angular.equals(angular.toJson($scope.selectSendAddr),'{}')) {
				toaster.pop('error', '错误', '请选择发货地址');
				return ;
			}
			var index = 0;
			angular.forEach($scope.batchReturn, function(thisreturn) {
				thisreturn.logistics = {};
				$scope.logisitcsDetail = angular.fromJson($scope.logistics.companyName);
				thisreturn.logistics.companyName = $scope.logisitcsDetail.name;
				thisreturn.logistics.companyId = $scope.logisitcsDetail.id;
				thisreturn.logistics.number = Number($scope.logistics.number) + index;
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
			var returnId = [];
			angular.forEach($scope.batchReturn, function(thisreturn) {
				thisreturn.jsonAddress = angular.toJson(thisreturn.jsonAddress);
				thisreturn.jsonSdAddress = angular.toJson($scope.selectSendAddr);
				logistics.push(thisreturn.logistics);
				returnId.push(thisreturn.id);
			});
			if(angular.equals(angular.toJson(returnId),'[]')) {
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
			Return.batchSendForVender({}, $scope.batchReturn, function(data) {
				toaster.pop('success', '成功', '发货成功');
				$scope.returnfmb2cTableParams.reload();
			});
			delete $scope.deliveryStatusSaveDelivery;
			delete $scope.deliveryStatusEntryCheck;
			delete $scope.selectSendAddr;
			delete $scope.logistics;
			delete $scope.batchReturn;
			delete $scope.sendAddr;
		};
		
		/**
		 * 单个订单确认退 开始
		 */
		$scope.onesEnsure = function(b2creturn) {
			$location.hash('batchCheckMoney');
			$anchorScroll();
			$scope.batchRecepit = [];
			$scope.batchRecepit.push(b2creturn);
			$scope.batchCheckStatus = true;
			getBuyAccount();
			getCustAccout();
		};
		
		//解析数据，从返回的数据中找到要解析的数据
		var resolveData = function(data) {
			var arr = new Array();
			for(var key in data) {
				var numb= Number(key);
				if(angular.isNumber(numb)&&(!isNaN(numb))) {
					arr.push(data[key]);
				}
			}
			return arr;
		};
		//排序
		var getOriginalData = function(data) {
			var result = null;
			result = data&&data.length ? data[0] : null;
			return result;
		};
		//B2C付款方
		var getBuyAccount = function() {
			//平台应付账号
			bankInfoService.getAdminEnterAccount('', function(data) {
				$scope.b2cAccountInfos = resolveData(data);
				angular.forEach($scope.b2cAccountInfos, function(b2cAccountInfos) {
					b2cAccountInfos.filterAccount = hideBankFilter(b2cAccountInfos.number);
				});
				$scope.b2cAccount = getOriginalData($scope.b2cAccountInfos);
			}, function(res) {
				toaster.pop('error', '错误', '获取卖家信息失败');
			});
		};
		//买家收款方
		var getCustAccout = function () {
			bankTransferService.getBankTransferByid ({banktfid : $scope.batchRecepit[0].banktfid},function(data) {
				if(data.jsonPament) {
					$scope.custAccount = angular.fromJson(data.jsonPament); 
					$scope.custAccount.filterAccount = hideBankFilter($scope.custAccount.number);
				}
			},function (res){
				toaster.pop('error', '错误', '获取客户账户失败');
			})
		};
		
		
		//expose代表展开的状态
		$scope.doExpose = function(expose, isCust) {
			if(isCust) {
				$scope.custExpose = expose;
			}else {
				$scope.salexpose = expose;
			}
		};
		
		//选中账号
		$scope.select = function(account, isCust) {
			if(isCust) {
				$scope.custAccount = account;
			}else {
				$scope.b2cAccount = account;
			}
		};
		
		//Delete 
		$scope.deleteAccount = function(buyAccount) {
			bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
				toaster.pop('success', '删除成功');
				getBuyAccount();
			}, function() {
				toaster.pop('error', '删除失败');
			})
		};
		
		//新增账户
		$scope.newAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoAdmin.html',
				controller : 'BankInfoCtrl',
				resolve : {
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					}
				}
			});
			
			modalInstance.result.then(function(account) {
				//企业账户
				bankInfoService.saveBuyEnterpriseBank({}, account, function(data) {
					toaster.pop('success', '保存成功','信息已添加');
					$scope.kind = account.kind;
					getBuyAccount();
				}, function(res) {
					toaster.pop('error', '错误', res.data);
				});
			}, function() {
				
			});
		};
		
		//最终确认
		$scope.confirm = function() {
			if(angular.isUndefined($scope.custAccount) || angular.equals("{}", angular.toJson($scope.custAccount))) {
				toaster.pop('error', '错误', '请选择买家账户');
				return ;
			}
			if(angular.isUndefined($scope.b2cAccount) || angular.equals("{}", angular.toJson($scope.b2cAccount))) {
				toaster.pop('error', '错误', '请选择平台账户');
				return ;
			}
			if(angular.isUndefined($scope.batchRecepit) || $scope.batchRecepit.length == 0) {
				toaster.pop('error', '错误', '没有选择要退款的退货单');
				return ;
			}
			if(!$scope.transferTime) {
				toaster.pop('error', '错误', '请选择付款日期');
				return ;
			}
			delete $scope.b2cAccount.filterAccount;
			delete $scope.custAccount.filterAccount;
			var jsonPament = angular.toJson($scope.b2cAccount);
			var jsonReceive = angular.toJson($scope.custAccount);
			var transfer = {};
			transfer.jsonPament = jsonPament;
			transfer.jsonReceive = jsonReceive;
			transfer.transferTime = $scope.transferTime;
			transfer.total = 0;
			$scope.returnids = "";
			angular.forEach($scope.batchRecepit, function(item) {
				transfer.total += item.price;
				$scope.returnids += item.id + "-";
			});
	
			bankTransferService.saveTransferFreturn({returnJson: $scope.returnids}, transfer, function(data) {
				toaster.pop("success", '成功', '保存成功!');
				//删除多余的变量
				delete $scope.batchCheckStatus;
				$scope.active = "refunded";
				$scope.returnfmb2cTableParams.reload();
			}, function() {
				toaster.pop("error", '失败', '信息保存失败');
			});
		};
		/**
		 * 确认退款
		 */
		$scope.ensurePaid = function(b2creturn) {
			Return.ensurePaid({returnid:b2creturn.id},null,function() {
				$scope.returnfmb2cTableParams.reload();
				toaster.pop('success', '处理成功', '平台退款成功！');
			},function() {
				toaster.pop('error', '退款失败');
			})
		}
		
	}]);
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', function($scope, $modalInstance, account){
		$scope.account = account;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}
		
		$scope.confirm = function() {
			$scope.account.kind = true;
			$modalInstance.close($scope.account);
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);
	
});