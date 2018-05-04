define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('InvoicefromOrderCtrl', ['$scope', '$anchorScroll', '$location', '$modal' ,'BaseService' , 'ngTableParams', 'InvoiceFOrder','SessionService' , 'toaster', '$stateParams', 'ShippingAddress', 'Logistics', 'LogisticsPort', 'NumberService', function($scope, $anchorScroll, $location, $modal, BaseService, ngTableParams, InvoiceFOrder, SessionService, toaster, $stateParams, ShippingAddress, Logistics, LogisticsPort, NumberService) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminInvoiceFmorState')? SessionService.get('adminInvoiceFmorState'):'tobeshipped';
		
		/*
		 * 待出货（tobeshipped）按钮下显示待出货（406）状态的平台出货单，
		 * 待收货（inbound）按钮下显示待收货（404）状态的平台出货单，
		 * 已收货（received）按钮下显示已收货（405）状态的平台出货单
		 */	
		
		// 查看物流		
		$scope.queryLogistics = function(invoice){
			$scope.logisticsInfo ={};
			$scope.logisticsInfo.orderid = invoice.invoiceid;
			$scope.logisticsInfo.companyName= invoice.logistics.companyName
			LogisticsPort.queryLogistics({orderid:$scope.logisticsInfo.orderid,companyName:$scope.logisticsInfo.companyName},{},function(data){
				$scope.logisticsInfo = data;				
			},function(res){
				toaster.pop('error', '物流接口调用出错');
			});
		}
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeshipped' :
					state = '406'; break;
				case 'inbound' :
					state = '404'; break;
				case 'received' :
					state = '405'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			SessionService.set('adminInvoiceFmorState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.invoiceForOrTableParams.page() == 1)
				$scope.invoiceForOrTableParams.reload();
			else
				$scope.invoiceForOrTableParams.page(1);
		};
		
		$scope.invoiceForOrTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				creattime: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				InvoiceFOrder.getAdminInFor(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						//将复选框的信息清零
						clearchecked();
						var orderCount = page.content.length;
						while($scope.checkCodes.length <  orderCount) {
							$scope.checkCodes.push(false);
						}
						//备份一份，因为需要修改从后台传输过来的数据，所以做一个备份。
						//那就只修改这个备份的数据,原数据不做改变
						$scope.localOrder = angular.copy(page.content);
						$scope.count = 0;//代表当前选中的行数  用在button
						/*防止原来的数据存在，删除之前的操作*/
						delete $scope.deliveryStatusSaveDelivery;
						delete $scope.deliveryStatusEntryCheck;
						delete $scope.selectSendAddr;
						delete $scope.logistics;
						delete $scope.batchOrder;
						delete $scope.sendAddr;
					}
				});
			}
		});

		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.invoiceForOrTableParams.reload();
		}
		
		// 点击勾选Code全部的复选框
		$scope.checkAll = function(){
			if($scope.checks.checked) {
				$scope.count = $scope.localOrder.length;
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
		
		//将数据清零
		var clearchecked = function () {
			$scope.checks = {
					checked : false
				};
			$scope.checkCodes = [];
		}
		
		//多选操作
		$scope.checks = {
			checked : false
		};
		$scope.checkCodes = [];
		
		/*批量确认出货  开始代码*/
		
		$scope.getBatch = function() {
			var batchOrder = [];
			for (var i = 0; i < $scope.checkCodes.length; i++) {
				if($scope.checkCodes[i]) {
                    $scope.localOrder[i].showPrice = Number(NumberService.toCeil($scope.localOrder[i].price, 2));
					batchOrder.push($scope.localOrder[i]);
				};
			}
			return batchOrder;
		}
		
		//点击确认出货
		$scope.batchToBeShip = function(order) {

			// 初始化信息
			$scope.selectSendAddr = {}; //默认的发货地址
			$scope.logistics = {}; //快递信息
			
			$location.hash('batchToBeShip');
			$anchorScroll();
			
			if(order) {
                order.showPrice = Number(NumberService.toCeil(order.price, 2));
				$scope.batchOrder = [];
				$scope.batchOrder.push(order);
			}else {
				$scope.batchOrder = $scope.getBatch();
			}
			
			angular.forEach($scope.batchOrder, function(order) {
				order.expose = false;
				if(order.jsonSpAddress) {
					order.jsonSpAddress = angular.fromJson(order.jsonSpAddress);
				}
			});
			if(angular.equals(angular.toJson($scope.batchOrder),"[]")) {
				toaster.pop('error', '错误', '请选择要确认出货单的订单');
				return;
			}
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
		
		//录入并核对的方法
		$scope.entryCheck = function(sendAddr) {
			if(!sendAddr || sendAddr.length == 0) {
				toaster.pop('error', '错误', '您登录非优软测试二，请重新登录');
			}
			if(!$scope.logistics.companyName||angular.equals($scope.logistics.companyName, '请选择物流公司名称')) {
				toaster.pop('error', '错误', '请填写物流公司名称');
				return ;
			}
			if(!$scope.logistics.number) {
				toaster.pop('error', '错误', '请填写快递单号');
				return ;
			}
			if(angular.equals(angular.toJson($scope.selectSendAddr),'{}')) {
				toaster.pop('error', '错误', '请选择发货地址');
				return ;
			}
			var index = 0;
			var ifExpose = false;
			if($scope.batchOrder.length < 3) {
				ifExpose = true;
			}
			
			angular.forEach($scope.batchOrder, function(order) {
				order.logistics = {};
				// console.log($scope.logistics.companyName);
				// $scope.logisitcsDetail = angular.fromJson($scope.logistics.companyName);
				order.logistics.companyName = $scope.logistics.companyName;
				//order.logistics.companyId = $scope.logisitcsDetail.id;
				order.logistics.weight = $scope.logistics.weight;
				order.logistics.number = $scope.logistics.number;
				order.expose = ifExpose;
				index++;
			});
			$scope.deliveryStatusSaveDelivery = true;
			$scope.deliveryStatusEntryCheck = false;
			
		}
		
		//确认发货
		$scope.confirmAndDelivery = function() {
			var logistics = [];
			var orderId = [];
			var weight = 0;
			var sjrAddr = [];
			var invoiceid ='';
			angular.forEach($scope.batchOrder, function(order) {
				logistics.push(order.logistics);
				orderId.push(order.id);
				weight = order.logistics.weight;
				sjrAddr.push(order.jsonSpAddress);
				invoiceid = order.invoiceid;
				companyName = order.logistics.companyName
			});
			if(angular.equals(angular.toJson(orderId),'[]')) {
				toaster.pop('error','错误', '订单为空，操作失败');
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
			var postData = {
						ids: orderId.join('-'),
						logistics: angular.toJson(logistics),
						jsonSdAddress: angular.toJson($scope.selectSendAddr),
						weight: weight,
						sjr_dz:angular.toJson(sjrAddr[0]),
						invoiceid : invoiceid,
						companyName : companyName
			};
			console.log(postData);
			InvoiceFOrder.batchSend(null, postData, function(data) {
				toaster.pop('success', '成功', '出货成功');
				$scope.invoiceForOrTableParams.page(1);
				$scope.invoiceForOrTableParams.reload();
			}, function(response) {
				toaster.pop('error', '错误', response.data);
			});
			delete $scope.deliveryStatusSaveDelivery;
			delete $scope.deliveryStatusEntryCheck;
			delete $scope.selectSendAddr;
			delete $scope.logistics;
			delete $scope.batchOrder;
			delete $scope.sendAddr;
			
		}
		
		$scope.back = function() {
			$scope.deliveryStatusSaveDelivery = false;
			$scope.deliveryStatusEntryCheck = true;
		}
		
		$scope.deliveryExpose = function(order) {
			order.expose = !order.expose;
		}
		/*批量确认出货  截至代码*/
		
	}]);
});