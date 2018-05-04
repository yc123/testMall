define(['app/app'], function(app) {
	'use strict';
	app.register.controller('CheckSaveCtrl', ['$scope', 'toaster', 'InvoiceFPurchase', 'ChineseToPinYin', 'Order' , '$modal', '$stateParams', 'ComponentActive', '$rootScope','$window','$state', 'BaseService', 'ShippingAddress', 'Logistics', '$filter', function($scope, toaster, InvoiceFPurchase, ChineseToPinYin, Order , $modal, $stateParams, ComponentActive, $rootScope, $window, $state, BaseService, ShippingAddress, Logistics, $filter) {
		BaseService.scrollBackToTop();
		
		$scope.logistics = {};
		$scope.jsonSdAddress = {};
		$scope.selfDeliveryPerson = {};
		
		InvoiceFPurchase.tobeshippedByInvoiceid({ids: $stateParams.ids}, {}, function(data) {
			$scope.checkinvoice = data;
			$scope.checkinvoice[0].jsonSpAddress = angular.fromJson($scope.checkinvoice[0].jsonSpAddress);
			$scope.checkinvoice[0].show = false;
		}, function () {
			toaster.pop("error", "错误", "加载出货信息失败");
		});
		
		$scope.setShow = function(invoice) {
			invoice.addrShow = false;
			invoice.show = !invoice.show;
			if(!invoice.show) {
				invoice.deliveryShow = "hide";
			}
		};
		
		
		$scope.setAddrShow = function(invoice) {
			invoice.deliveryShow = "hide";
			invoice.show = false;
			invoice.addrShow = !invoice.addrShow;
		};
		
		//选择地址
		$scope.chooseAdd = function(invoice, add) {
			$scope.jsonSdAddress = add;
			invoice.addrShow = false;
		};
		
		//删除收货地址
		$scope.deleteAddr = function(addr){
			if(!addr || angular.equals({}, addr)) {
				toaster.pop('info', '请选择要删除的信息');
				return;
			}
			$scope.isnotCheck = true;
			var isSure = confirm('确认删除？删除后不可恢复，请谨慎操作！');
			if(isSure) {
				var id = addr.id;
				ShippingAddress.del({addid: id}, {}, function(data){
					//重新加载购物数据
					loadAddrs();
				}, function () {
					toaster.pop('error', '系统错误', '删除收货地址失败');
				});
			}
		};

		/**
		 * 新增或修改发货地址
		 *
		 * @param isSetTop		是否新增发货地址
		 * @param addr			待修改的地址信息
		 */
		$scope.editAddr = function(isSetTop, addr) {
			if(!isSetTop && (!addr || angular.equals({}, addr))) {
				toaster.pop('info', '请选择要编辑的信息');
				return;
			}
			$scope.isnotCheck = true;
			$modal.open({
				templateUrl : 'static/view/prod/modal/editAddr_modal.html',
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
				if(!addr) {
					loadAddrs(true);
				}else {
					loadAddrs();
				}

			}, function(){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		};
		
		//加载发货地址
		var loadAddrs = function() {
			ShippingAddress.getListEnterprise({ship : false}, function(data) {
				$scope.addresss = data;
				$scope.jsonSdAddress = {};
				if($scope.addresss.length > 0) {
					$scope.jsonSdAddress = $scope.addresss[0];
				}
			}, function(res) {
				toaster.pop('error', '错误', res.data);
			});
		};
		
		loadAddrs();
		
		$scope.saveCheck = function() {
			if(!$scope.checkinvoice || angular.equals(angular.toJson($scope.checkinvoice), "[]")) {
				toaster.pop("info", "提示", "出货单信息为空，不能保存，请返回出货单管理界面");
				return ;
			}
			
			if(!$scope.jsonSdAddress || angular.equals({}, $scope.jsonSdAddress)) {
				toaster.pop("info", "提示", "发货地址不能为空,请返回出货单管理界面");
				return ;
			}
			
			var toSendInvoice = angular.copy($scope.checkinvoice);
			angular.forEach(toSendInvoice, function(invoice) {
				invoice.jsonSdAddress = angular.toJson($scope.jsonSdAddress);
				invoice.jsonSpAddress = angular.toJson(invoice.jsonSpAddress);
				delete invoice.show;
				delete $stateParams.ids;
			});
			
			var isValid = validDeliveryInfo($scope.checkinvoice[0].deliveryType);
			if(!isValid) {
				return ;
			}
			var sendInfo = {};
			if($scope.checkinvoice[0].deliveryType == 'logistics') {
				sendInfo.deliveryType = 'logistics';
				sendInfo.logisticsInfo = $scope.logistics;
			}else if($scope.checkinvoice[0].deliveryType == 'selfDelivery'){
				sendInfo.deliveryType = 'selfDelivery';
				sendInfo.selfDeliveryPerson = $scope.selfDeliveryPerson;
			}else {
				toaster.pop('info', '提示', '配送方式有误');
				return ;
			}
			sendInfo.jsonSdAddress = angular.toJson($scope.jsonSdAddress);
			InvoiceFPurchase.saveInvoiceFPurchase({id : $scope.checkinvoice[0].id}, sendInfo, function(data) {
				toaster.pop("success", "信息", "保存成功,返回出订单管理界面");
				// TODO 这边要停5秒钟之后，在跳转到出货单管理界面
				/*var fromPage = window.sessionStorage.getItem("orderAdmin");
				if(fromPage == "invoiceProofing") {
					$state.go('invoiceProofing');
				}else {
					$state.go('invoice');
				}*/
				// TODO huxz 跳转到订单管理页面
				$state.go('cusPurchase');
			}, function(response) {
				toaster.pop('error', '错误', response.data);
			});
		};
		
		$scope.selectDelivery = function(invoice, result) {
			invoice.deliveryShow = result;
		};
		
		$scope.deliveryComfirm = function(invoice, inputType) {
			var isValid = validDeliveryInfo(inputType);
			if(!isValid) {
				return ;
			}
			invoice.deliveryShow = 'hide';
			invoice.show = false;
			invoice.deliveryType = inputType;
		};
		
		var validDeliveryInfo = function(inputType) {
			if(angular.equals(inputType, 'logistics')) {
				if(!$scope.logistics.companyName ||  angular.equals($scope.logistics.companyName.trim(), '')) {
					toaster.pop('info', '注意', '物流公司名称为空');
					return false;
				}
				if(!$scope.logistics.number || angular.equals($scope.logistics.number.trim(), '')) {
					toaster.pop('info', '注意', '物流单号为空');
					return false;
				}

			}else if(angular.equals(inputType, 'selfDelivery')){
				if(!$scope.selfDeliveryPerson.name || angular.equals($scope.selfDeliveryPerson.name.trim(), '')) {
					toaster.pop('info', '注意', '送货人名称为空');
					return false;
				}
				if(!$scope.selfDeliveryPerson.phone || angular.equals($scope.selfDeliveryPerson.phone.trim(), '')) {
					toaster.pop('info', '注意', '送货人电话为空');
					return false;
				}
			}
			
			return true;
		};
		
		$scope.cancle = function(invoice) {
			invoice.deliveryShow = 'hide';
		};
		
		$scope.goBack = function() {
			$state.go("cusPurchase");
		};
		
		// 获取全部快递公司信息
		$scope.isCompany = false;
		var getLogisticsCompany = function() {
			$scope.companies = [];
			Logistics.findCompany({}, {}, function(data) {
				$scope.companies = data;
			}, function() {
			
			});
		};
		
		getLogisticsCompany();
		
		//申请一个数组存放筛选之后的物流公司名称
		$scope.filterCom = [];
		
		// 若输入框为空不显示提示框
		$scope.inputCompany = function() {
			$scope.isCompany = true;
			if($scope.logistics.companyName.length > 0) {
				$scope.filterCom = $filter('filter')($scope.companies, {name :$scope.logistics.companyName});
				if($scope.filterCom == null || $scope.filterCom.length == 0){
					$scope.isCompany = false;
				}		
			} else {
				$scope.filterCom = $scope.companies;
			}
		};
		
		$scope.clearSelect = function() {
			$scope.selectIndex = 0;
		};
		
		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function() {
			$scope.isCompany = true;
			$scope.filterCom = $scope.companies;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
		};

		// 点击下拉按钮打开联想词框显示联想框
		$scope.openSuggestion = function () {
			$scope.isCompany = !$scope.isCompany;
			if ($scope.isCompany) {
				$scope.filterCom = $scope.companies;
				$scope.selectIndex = -1;
				if(!$scope.keyword) $scope.keyword = '';
			}
		};

		// 鼠标进入联想词框，不能关闭联想词框
		$scope.onAssociateEnter = function() {
			$scope.associateEnter = true;
			$scope.isCompany = false;
		};
		
		// 隐藏提示框
		$scope.clearSuggestion = function() {
			$scope.isCompany = false;
		};
		
		// 搜索框通过按键选取想要的联想词
		$scope.onKeyDown = function(e) {
			if($scope.isCompany) {
				if(event.keyCode == 40) { //监听到按下键
					$scope.selectIndex ++;
					if($scope.selectIndex >= $scope.filterCom.length) $scope.selectIndex = 0;
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
					$scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if($scope.selectIndex < 0) $scope.selectIndex = $scope.filterCom.length - 1;
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
					$scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
				}else if(event.keyCode == 13) { //确定键
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
					$scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
					$scope.isCompany = false;
				}
			}
		};
		
		// 选择快递公司
		$scope.chooseCompany = function(company) {
			$scope.logistics.companyName = company.name;
			$scope.logistics.companyId = company.id;
			$scope.isCompany = false;
		};
		
	}]);
	
	//地址编辑模态框
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, isSetTop, addr, $modalInstance, toaster, $http, ShippingAddress){
		$scope.isSetTop = isSetTop;
		
		$scope.isSendType = true;
		//验证数据
		$scope.checkeds = {};
		$scope.checkform = function(name,num) {
			if(num == 1) {
				$scope.checkeds.name = !angular.isUndefined(name);
			} else if(num == 2) {
				$scope.checkeds.detailAddress = !angular.isUndefined(name);
			} else if(num == 3) {
				$scope.checkeds.tel = !angular.isUndefined(name);
			}
		};
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
				$scope.addr = true;
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
	    	
	    	// send属性 控制本地址是否是发货地址
	    	ShippingAddress.save({isSetTop: $scope.isSetTop, send: true, isPersonal: false}, address, function(data){
	    		toaster.pop('success', '成功 ', '保存发货地址成功');
	    		$modalInstance.close(data);
			}, function (res) {
				toaster.pop('error', '保存发货地址失败 ', res.data);
	    	});
	    };
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);
});