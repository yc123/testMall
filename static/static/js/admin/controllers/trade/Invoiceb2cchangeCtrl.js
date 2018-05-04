define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('Invoiceb2cchangeCtrl', ['$scope', '$anchorScroll', '$location' , 'ngTableParams', 'Invoice','SessionService' , 'BaseService' , 'toaster', 'ShippingAddress', '$stateParams', 'Logistics', function($scope, $anchorScroll, $location , ngTableParams, Invoice , SessionService , BaseService ,toaster,ShippingAddress , $stateParams, Logistics) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminInvoiceb2chState')? SessionService.get('adminInvoiceb2chState'):'tobeshipped';
		
		/*
		 * 待收货（inbound）按钮下显示待出货（406）和待收货（404）状态的卖家出货单，
		 * 已收货（received）按钮下显示已收货（405）状态的卖家出货单，
		 * 待收款（toreceivemoney）按钮下显示待收款（506）状态的卖家出货单，
		 * 已收货（moneyreceived）按钮下显示已收货（505）状态的卖家出货单，
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'inbound' :
					state = '404'; break;
				case 'received' :
					state = '405'; break;
				case 'tobeshipped' : 
					state = '406'; break;			
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			SessionService.set('adminInvoiceb2chState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.invoiceForB2TableParams.page() == 1)
				$scope.invoiceForB2TableParams.reload();
			else
				$scope.invoiceForB2TableParams.page(1);
		};
		
		$scope.invoiceForB2TableParams = new ngTableParams({
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
				Invoice.getAdminInFchToB2c(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						clearchecked();//清零数据
						var invoiceCount = page.content.length;
						while($scope.checkCodes.length <  invoiceCount) {
							$scope.checkCodes.push(false);
						}
						//备份一份，因为需要修改从后台传输过来的数据，所以做一个备份。
						//那就只修改这个备份的数据,原数据不做改变
						$scope.localInvoice = angular.copy(page.content);
						$scope.count = 0;//代表当前选中的行数  用在button
						/*防止原来的数据存在，删除之前的操作*/
						delete $scope.deliveryStatusSaveDelivery;
						delete $scope.deliveryStatusEntryCheck;
						delete $scope.selectSendAddr;
						delete $scope.logistics;
						delete $scope.batchInvoice;
						delete $scope.sendAddr;
					}
				});
			}
		});

		//根据出货单号搜索出货单
		$scope.onSearch = function() {
			$scope.invoiceForB2TableParams.reload();
		}

		/**
		 * 平台确认发货
		 */
		$scope.ensureSend = function(invoice) {
//			Invoice.ensureSend({inid:invoice.id},null,function(data) {
//				$scope.invoiceForB2TableParams.reload();
//				toaster.pop('success', '处理成功', '平台出货成功');
//			},function() {
//				toaster.pop('error', '出货失败');
//			})
			
			//初始化信息
			$scope.selectSendAddr = {}; //默认的发货地址
			$scope.logistics = {}; //快递信息
			
			if(invoice) {
				$scope.batchInvoice = [];
				$scope.batchInvoice.push(invoice);
			}else {
				$scope.batchInvoice = $scope.getBatch();
			}
			
			angular.forEach($scope.batchInvoice, function(invoice) {
				invoice.expose = false;
				if(invoice.jsonSpAddress) {
					invoice.jsonSpAddress = angular.fromJson(invoice.jsonSpAddress);
				}
			});
			if(angular.equals(angular.toJson($scope.batchInvoice),"[]")) {
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
		
		$scope.select = function(add) {
			$scope.selectSendAddr = add;
		}
		
		/*批量确认出货  开始代码*/
		$scope.getBatch = function() {
			var batchInvoice = [];
			for (var i = 0; i < $scope.checkCodes.length; i++) {
				if($scope.checkCodes[i]) {
					batchInvoice.push($scope.localInvoice[i]);
				};
			}
			return batchInvoice;
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
			angular.forEach($scope.batchInvoice, function(change) {
				change.logistics = {};
				$scope.logisitcsDetail = angular.fromJson($scope.logistics.companyName);
				change.logistics.companyName = $scope.logisitcsDetail.name;
				change.logistics.companyId = $scope.logisitcsDetail.id;
				change.logistics.number = Number($scope.logistics.number) + index;
				index++;
			});
			$scope.deliveryStatusSaveDelivery = true;
			$scope.deliveryStatusEntryCheck = false;
			
		}
		
		$scope.confirmAndDelivery = function() {
			var logistics = [];
			angular.forEach($scope.batchInvoice, function(change) {
				change.jsonSpAddress = angular.toJson(change.jsonSpAddress);
				change.jsonSdAddress = angular.toJson($scope.selectSendAddr);
				logistics.push(change.logistics);
			});
			if(angular.equals(angular.toJson(logistics),'[]')) {
				toaster.pop('error','错误', '请返回上一步输入物流信息');
				return;				
			}
			if(angular.equals(angular.toJson($scope.selectSendAddr),'{}')) {
				toaster.pop('error','错误', '请返回上一步选择发货地址');
				return;					
			}
			Invoice.ensureSend({}, $scope.batchInvoice, function(data) {
				$scope.invoiceForB2TableParams.reload();
				toaster.pop('success', '成功', '转出货单成功');
			});
			delete $scope.deliveryStatusSaveDelivery;
			delete $scope.deliveryStatusEntryCheck;
			delete $scope.selectSendAddr;
			delete $scope.logistics;
			delete $scope.batchInvoice;
			delete $scope.sendAddr;
		}
		
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
				$scope.count = $scope.localInvoice.length;
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