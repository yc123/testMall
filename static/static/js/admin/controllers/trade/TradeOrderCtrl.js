define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('TradeOrderCtrl', ['$scope', '$anchorScroll', '$location', '$modal' , 'BaseService','SessionService' , 'ngTableParams', 'Order','ShippingAddress' , 'toaster', '$stateParams', '$state', function($scope, $anchorScroll, $location, $modal , BaseService ,SessionService ,ngTableParams, Order, ShippingAddress ,toaster, $stateParams, $state) {
	
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminOrderState')? SessionService.get('adminOrderState'):'tobereceived';

		/*
		 * 已付款（paid）按钮下显示待确认（501）、待付款（503）、已付款（504）三种状态的订单，
		 * 待出货（tobeshipped）按钮下显示待出货（406）、出货中（403）两种状态的订单，
		 * 已出货（shipped）按钮下显示已收货（405）、已出货（407）、发货中（408）、待收货（404）四种状态的订单，
		 * 
		 */		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobereceived' : //已付款
					state = '504-503'; break;
				case 'tobeshipped' ://待出货
					state = '406'; break;
				case 'shippingin' : //出货中
					state = '403'; break;
				case 'shipped' : //已出货
					state = '407'; break;
				case 'inbound' : //待收货
					state = '408-404'; break;
				case 'received' : //已收货
					state = '405'; break;
				case 'moneyreceived':
					state = '505'; break;
				case 'completed': 
					state = '520'; break;
				case 'unavailable': 
					state = '602-603-315-604-606'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			SessionService.set('adminOrderState',state);
			if($scope.active != state) {
				$scope.active = state;
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}
		};
		
		$scope.orderTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				creattime: 'DESC',
				status : 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Order.getAdminOrders(param, function(page) {
					//将数据清零
					clearchecked();
					var orderCount = page.content.length;
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
						//备份一份，因为需要修改从后台传输过来的数据，所以做一个备份。
						//那就只修改这个备份的数据,原数据不做改变
						$scope.localOrder = angular.copy(page.content);
						$scope.count = 0;
					}
				});
			}
		});
		
		//根据订单号搜索
		$scope.onSearch = function() {
			$scope.orderTableParams.reload();
		}
		
		
		/*已出货 转出货单的代码*/
		$scope.getBatch = function() {
			var batchOrder = [];
			for (var i = 0; i < $scope.checkCodes.length; i++) {
				if($scope.checkCodes[i]) {
					batchOrder.push($scope.localOrder[i]);
				};
			}
			return batchOrder;
		}
		
		//确认付款
		$scope.ensurePay = function(order){
			Order.ensurePay({orderid: order.orderid}, {}, function(data){
				toaster.pop('success', '处理成功', '【' + data.orderid + '】' + '确认付款');
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}, function(response){
				toaster.pop('error', '确认付款失败', response.data);
			})
		};

		/**
		 * 当用户点击审核不通过时，弹出模态框
		 * @param order
		 */
		$scope.showAuditFailureModal = function (order) {
			angular.forEach($scope.orderTableParams.data, function (or) {
				or.dislayModal = false;
			});
			order.dislayModal = true;
		}

		/**
		 * 对已经上传了水单的订单审核不通过
		 */
		$scope.auditFailure = function (order) {
			if(!order.auditFailureReason) {
				toaster.pop('info', '请输入审核不通过的原因');
				return ;
			}
			Order.auditFailure({orderId :order.orderid},{reason : order.auditFailureReason}, function (data) {
				if(data.code != 1) {
					toaster.pop('info', '保存失败：' + data.message);
				}else {
					toaster.pop('info', '保存成功');
					order.dislayModal = false;
					$scope.orderTableParams.reload();
				}
			}, function (res) {
				console.log(res);
				toaster.pop('error', '系统出现错误，');
			});
		}
		
		//点击批量收款
		$scope.batchPaid = function(order) {
			if(order) {
				$scope.batchOrder = [];
				$scope.batchOrder.push(order);
			}else {
				$scope.batchOrder = $scope.getBatch();
			}
			var orderId = [];
			angular.forEach($scope.batchOrder, function(order) {
				orderId.push(order.orderid);
			});
			//确认收款
			Order.batchEnsurePay({orderids: orderId}, {}, function(data){
				toaster.pop('success', '处理成功', '批量确认收款');
				$scope.orderTableParams.reload();
			}, function(response){
				toaster.pop('error', '批量确认收款失败', response.data);
			})
		}
		
		//点击批量转出货单
		$scope.batchCreateinFor = function(order) {
			if(order) {
				$scope.batchOrder = [];
				$scope.batchOrder.push(order);
			}else {
				$scope.batchOrder = $scope.getBatch();
			}
			var orderId = [];
			angular.forEach($scope.batchOrder, function(order) {
				orderId.push(order.id);
			});
			var postData = {ids: orderId.join('-')};
			Order.batchCreateinFor({}, postData, function(data){
				toaster.pop('success', '成功', '转出货单成功');
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}, function(res) {
				toaster.pop('error', '错误', '转出货单失败，' + res.data);
			});
		}
		/*已出货转出货单的代码*/
		
		
		//将数据清零
		var clearchecked = function () {
			$scope.checks = {
					checked : false
				};
			$scope.checkCodes = [];
		}
		
		//转采购显示开关
		$scope.createPurc = false;
		
		//多选操作
		$scope.checks = {
			checked : false
		};
		
		$scope.checkCodes = [];
		
		// 点击勾选Code全部的复选框
		$scope.checkAll = function() {
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
			angular.forEach($scope.checkCodes, function(item,key) {
				if(!item){
					result = false;
					return;
				}
			});
			$scope.checks.checked = result;
		}
		
		$scope.openBill = function(id) {
			$state.go('openBill', {id : id});
		}
		
		//将转采购数据清零
		var clearPurcData = function () {
			$scope.createPurc = false;
			$scope.checkorders = [];
			$scope.checkinfos = [];
			$scope.checkorderinfos = [];
		}
		
		//选中的订单
		$scope.checkorders = [];
		//批量转采购
		$scope.battchCreatePurc = function(checkCodes,orders){
			$scope.trag = false;
			angular.forEach(checkCodes,function(checkCode) {
				if(checkCode == true) {
					$scope.trag = true;
				}
			});
			if(!$scope.trag) {
				toaster.pop('error', '提示', '你未勾选任何订单，请重新勾选');
				return;
			}
			$scope.createPurc = true;
			$location.hash('bottom');
			$anchorScroll();
			$scope.checkorders = [];
			$scope.checkinfos = [];
			angular.forEach(checkCodes,function(checkCode,key) {
				if(checkCode == true) {
					$scope.checkinfos.push(orders[key]);
				}
			});
			//判断订单是否可以合并，将可以合并的分组显示
			Order.checkPurchase(null, $scope.checkinfos, function(data) {
				toaster.pop('success', '处理成功', '请立即确认转采购');
				$scope.checkorderinfos = data;
			}, function(res){
				toaster.pop('error', '失败！');
			});
			$scope.battchpurc = true;
			
		};
		//加载平台收货地址
		var loadAddrs = function(id){
			ShippingAddress.findB2cAdd({send: false}, function(data) {
				//为每个设置选择状态
				angular.forEach(data, function(addr){
					if(id && (id == addr.id)){
						addr.isSelect = true;
					}
					else{
						addr.isSelect = false;
					}
				});
				$scope.addrs = data;
			}, function(response) {
				toaster.pop('error', '系统错误', '获取收货地址失败');
			});
		};
		
		loadAddrs();
	
		//选择收货地址
		$scope.selectaddr = null;
		$scope.selectAddr = function(addr, addrs){
			var id = addr.id;
			$scope.selectaddr = addr;
			ShippingAddress.setTop({addid: id}, {}, function(data){
				//重新加载购物数据
				loadAddrs(id);
			}, function(res){
				toaster.pop('error', '系统错误', '选择收货地址失败');
			});
		};
		//转采购
		$scope.createPurchase = function(order){
			//转采购详情界面开关
			$scope.createPurc = true;
			$location.hash('bottom');
			$anchorScroll();
			$scope.checkorders = [];
			$scope.checkorderinfos = [];
			$scope.checkorders.push(order);
			$scope.battchpurc = false;
		};
		
		// 展开更多地址的开关
		$scope.moreOptionTrigger = function() {
			$scope.moreOption = ! $scope.moreOption;
		};
		//编辑收货地址
		$scope.editAddr = function(isSetTop, addr) {
			$modal.open({
				templateUrl : 'static/view/admin/modal/editAddr_modal.html',
				controller : 'editAddrCtrl',
				size : 'lg',
				resolve : {
					isSetTop : function(){
                    	//必须用 angular.copy深拷贝一份
                        return angular.copy(isSetTop);
                    },
                    addr : function(){
                    	return angular.copy(addr);
                    }
				}
			}).result.then(function(address){
				loadAddrs(address.id);
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		};
		//确认批量转采购单
		$scope.ensureCreatePurc = function (order, boo,addrs) {
			if($scope.selectaddr == null) {
				toaster.pop('error', '您还未填写地址');
				return;
			}
			angular.forEach(addrs, function(addr){
				addr.isSelect = false;
			})
			if(boo) {
				clearPurcData();
				Order.createPurchases({adrid: $scope.selectaddr.id}, order, function(data){
					toaster.pop('success', '处理成功', '采购单【' + data.purchaseid + '】' + '生成成功');
					$scope.active = 'shippingin';
					$scope.orderTableParams.reload();
				}, function(res){
					
				})
			} else {
				clearPurcData();
				Order.createPurchase({orid: order.id}, $scope.selectaddr, function(data){
					toaster.pop('success', '处理成功', '采购单【' + data.purchaseid + '】' + '生成成功');
					$scope.active = 'shippingin';
					$scope.orderTableParams.reload();
				}, function(res){
					
				})
			}
			
		}
		
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, isSetTop, addr, $modalInstance, toaster, $http, ShippingAddress){
		$scope.address = {};
		$scope.isSetTop = isSetTop;
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr){
				$scope.address = addr;
				//拼装下拉选择框
				var arr = addr.area.split(',');
				addr.province = arr[0];
				addr.city = arr[1];
				addr.district = arr[2];
				$scope.address = addr;
			}
		}).error(function(e) {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});
		
	    $scope.save = function () {
	    	var address = $scope.address;
	    	//拼装地区
	    	/**
	    	 * TODO 这里没做校验
	    	 */
	    	var strAres = address.province + ',' + address.city + ',' + address.district;
	    	address.area = strAres;
	    	ShippingAddress.saveB2C({isSetTop: $scope.isSetTop, ship: true}, address, function(data){
	    		toaster.pop('success', '成功 ', '保存收货地址成功');
	    		$modalInstance.close(data);
	    	}, function(res){
	    		toaster.pop('error', '系统错误 ', '保存收货地址失败');
	    	});
	    }
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
});