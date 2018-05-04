define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ShipFchangeCtrl', ['$scope', 'toaster','$modal','ShippingAddress', '$state', '$stateParams','Invoice', 'Logistics', '$filter', 'BaseService', function($scope, toaster, $modal, ShippingAddress, $state, $stateParams, Invoice, Logistics, $filter, BaseService) {
		BaseService.scrollBackToTop();
		
		$scope.isCompany = false;
		// 获取全部快递公司信息
		var getLogisticsCompany = function() {
			$scope.companies = [];
			Logistics.findCompany({}, {}, function(data) {
				$scope.companies = data;
			}, function() {
			
			});
		}
		
		getLogisticsCompany();
		
		//申请一个数组存放筛选之后的物流公司名称
		$scope.filterCom = [];
		
		// 若输入框为空不显示提示框
		$scope.inputCompany = function() {
			if($scope.logistics.companyName.length > 0) {
				$scope.filterCom = $filter('filter')($scope.companies, $scope.logistics.companyName);
			} else {
				$scope.filterCom = null;
			}
		};
		
		$scope.clearSelect = function() {
			$scope.selectIndex = 0;
		}
		
		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function() {
			$scope.isCompany = true;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
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
			$scope.logistics.companyName = company;
			$scope.isCompany = false;
		};
		
		$scope.logistics = {};
		$scope.jsonSdAddress = null;
		Invoice.findByinvoiceIds({ids: $stateParams.ids}, {}, function(data) {
			$scope.checkinvoice = data;
			$scope.checkinvoice.hide = true;
			angular.forEach($scope.checkinvoice, function(invoice) {
				if(invoice.jsonSpAddress) {
					invoice.jsonSpAddress = angular.fromJson(invoice.jsonSpAddress);
				}
				invoice.hide = true;
			});
			if($scope.checkinvoice.length > 0) {
				$scope.checkinvoice[0].hide = false;
			}
		}, function(res) {
			toaster.pop("error", "错误", "加载换货信息失败");
		});
		
		$scope.setHide = function(checkinvoice) {
			checkinvoice.hide = !checkinvoice.hide;
		}
		
		$scope.isSetTop = false;
		
		$scope.select = function(add) {
			$scope.jsonSdAddress = add;
		}
		
		var loadAddrs = function() {
			ShippingAddress.getListEnterprise({send: true}, function(data) {
				$scope.addresss = data;
				if($scope.addresss.length > 0) {
					$scope.jsonSdAddress = $scope.addresss[0];
				}
			}, function(res) {
				toaster.pop('error', '错误！！', res.resposeText);
			});
		};
		
		loadAddrs();
		
		$scope.entryCheck = function(checkinvoice) {
			if(!$scope.logistics.companyName || angular.equals($scope.logistics.companyName, '物流公司')) {
				toaster.pop('info', '请填写物流公司名称');
				return ;
			}
			if(!$scope.logistics.number) {
				toaster.pop('info', '请填写快递单号');
				return ;
			}
			if(!$scope.checkinvoice || angular.equals(angular.toJson($scope.checkinvoice),'[]')) {
				toaster.pop('info','出货单信息为空');
				return;
			}
			if(!$scope.jsonSdAddress || angular.equals(angular.toJson($scope.jsonSdAddress),'{}')) {
				toaster.pop('info','选择发货地址');
				return;
			}
			
			angular.forEach($scope.checkinvoice, function(thischeckinvoice) {
				thischeckinvoice.jsonSdAddress = angular.copy($scope.jsonSdAddress);
			})
			
			var newModel = function(checkinvoice) {
				$modal.open({
					templateUrl : 'static/view/vendor/modal/editinvoice_modal.html',
					controller : 'ensureInvoiceCtrl',
					size : 'lg',
					resolve : {
	                    checkinvoices : function() {
	                    	return angular.copy($scope.checkinvoice);
	                    },
	                    logistis : function() {
	                    	return angular.copy($scope.logistics);
	                    }
					}
				}).result.then(function(address){
					loadAddrs();
				});
			}
			newModel();
		}
		
		$scope.newAddress = function(addr) {
			$modal.open({
				templateUrl : 'static/view/vendor/modal/editAddr_modal.html',
				controller : 'editAddrCtrl',
				size : 'lg',
				resolve : {
					isSetTop : function(){
                    	//必须用 angular.copy深拷贝一份
                        return $scope.isSetTop;
                    },
                    addr : function(){
                    	return angular.copy(addr);
                    }
				}
			}).result.then(function(address){
				loadAddrs();
				$scope.select(address);
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		}
		
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('ensureInvoiceCtrl', ['$scope', 'logistis', 'checkinvoices', '$modalInstance', 'toaster', 'Invoice', 'ShippingAddress','$state', function($scope, logistis, checkinvoices, $modalInstance, toaster, Invoice, ShippingAddress, $state){
		$scope.checkinvoices = checkinvoices;
		$scope.invoice = checkinvoices[0];
		//总价
		$scope.totalprice = 0;
		angular.forEach(checkinvoices,function(invoice) {
			$scope.totalprice += invoice.price;
		});
		$scope.logistics = logistis;
		$scope.invoice.jsonSdAddress = angular.fromJson($scope.invoice.jsonSdAddress);
		$scope.invoice.jsonSpAddress = angular.fromJson($scope.invoice.jsonSpAddress);
	    $scope.save = function (invoice) {
			angular.forEach($scope.checkinvoice, function(invoice) {
				if(invoice.jsonSpAddress) {
					invoice.jsonSpAddress = angular.fromJson(invoice.jsonSpAddress);
				}
				invoice.hide = true;
				invoice.logistics = angular.copy($scope.logistics);
				invoice.logistics.number = Number($scope.logistics.number) + (index++);
				
			});
			var index = 0;
	    	angular.forEach($scope.checkinvoices ,function(checkinvoice) {
	    		checkinvoice.jsonSdAddress = angular.toJson(checkinvoice.jsonSdAddress) ;
	    		checkinvoice.jsonSpAddress = angular.toJson(checkinvoice.jsonSpAddress) ;
	    		checkinvoice.logistics = angular.copy($scope.logistics);
	    		checkinvoice.logistics.number = Number($scope.logistics.number) + (index++);
	    	});
	    	Invoice.sendinFch({},$scope.checkinvoices,function(data) {
				toaster.pop('success', '发货成功!');
				$modalInstance.dismiss();
				$state.go('invoiceChange');
			}, function(res){
				toaster.pop('error', '失败, ' + res.data);
			})
	    }
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress','AuthenticationService', function($scope, isSetTop, addr, $modalInstance, toaster, $http, ShippingAddress, AuthenticationService){
		$scope.isSetTop = isSetTop;
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr){
				//拼装下拉选择框
				var arr = addr.area.split(',');
				addr.province = arr[0];
				addr.city = arr[1];
				addr.district = arr[2];
				$scope.address = addr;
			} 
			if($scope.address){
				$scope.$watch('address.tel', function(){
					delete $scope.telErrorInfo;
					var patt = new RegExp(/^((\(\d{3}\))|(\d{3}\\-))?(13|15|17|18)\d{9}$/);
					if(patt.test($scope.address.tel)) {
						
					} else {
						$scope.telErrorInfo = '格式错误';
					}
				});
			}
		}).error(function(e) {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});
		
//	    AuthenticationService.getAuthentication().success(function(data){
//	    	if(data && addr) {
//	    		if(!$scope.address){
//	    			$scope.address = {};
//	    		}
//	    		$scope.address.name = data.userName;
//	    		$scope.address.tel = data.userTel;
//	    		$scope.address.email = data.userEmail;
//	    	}
//	    });
		
	    $scope.save = function () {
	    	var address = $scope.address;
	    	//拼装地区
	    	/**
	    	 * TODO 这里没做校验
	    	 */
	    	var strAres = address.province + ',' + address.city + ',' + address.district;
	    	address.area = strAres;
	    	ShippingAddress.save({isSetTop: $scope.isSetTop, send: true, isPersonal: false}, address, function(data){
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