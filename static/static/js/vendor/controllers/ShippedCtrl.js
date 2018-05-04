define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ShippedCtrl', ['$scope', 'toaster', '$rootScope','$modal','ShippingAddress', '$state', '$stateParams','InvoiceFPurchase', 'bankInfoService', 'Logistics', 'SmoothScroll', '$filter', 'BaseService', function($scope, toaster, $rootScope, $modal, ShippingAddress, $state, $stateParams, InvoiceFPurchase, bankInfoService, Logistics, SmoothScroll, $filter, BaseService) {
		BaseService.scrollBackToTop();
		
		//出货前需要判断该企业是否有银行转账的信息
		/*$scope.myAccount = null;*/
		$scope.isCompany = false;
		SmoothScroll.scrollTo(null, 'O', 0);
		/*var getBanks = function (data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankVenderModal.html',
				controller : 'BankInfoCtrl',
				backdrop : false,
				resolve : {
					kind : function() {
						//深拷贝一份
						return angular.copy(true);
					},
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
					$scope.myAccount = account;
				}, function(res) {
					toaster.pop('error', '错误', res.data);
				});
			}, function() {
				
			});
		}
		bankInfoService.getBuyEnterpriseBank({}, function(data){ 
			$scope.myAccount = data;
			if(data.length == 0) {
				getBanks();
			}
		});	*/
		
		
		// 获取全部快递公司信息
		var getLogisticsCompany = function() {
			$scope.companies = [];
			Logistics.findCompanyName({}, {}, function(data) {
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
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex];
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if($scope.selectIndex < 0) $scope.selectIndex = $scope.filterCom.length - 1;
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex];
				}else if(event.keyCode == 13) { //确定键
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex];
					$scope.isCompany = false;
				}
			}
		};
		
		// 选择快递公司
		$scope.chooseCompany = function(company) {
			$scope.logistics.companyName = company;
			$scope.isCompany = false;
		};
		
		$scope.logistics = $rootScope.logistics ? $rootScope.logistics : {};
		$scope.jsonSdAddress = $rootScope.jsonSdAddress ? $rootScope.jsonSdAddress : null;
		
		InvoiceFPurchase.tobeshippedByInvoiceid({ids: $stateParams.ids}, {}, function(data) {
			$scope.checkinvoice = data;
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
			toaster.pop("error", "错误", "加载出货信息失败");
		});
		
		$scope.setHide = function(invoice) {
			invoice.hide = !invoice.hide;
		}
		
		$scope.isSetTop = false;
		
		$scope.select = function(add) {
			$scope.jsonSdAddress = add;
		}
		
		var loadAddrs = function() {
			ShippingAddress.getListEnterprise({ship : false}, function(data) {
				$scope.addresss = data;
				if($scope.addresss.length > 0) {
					$scope.jsonSdAddress = $scope.addresss[0];
				}
			}, function(res) {
				toaster.pop('error', '错误', res.resposeText);
			});
		};
		
		loadAddrs();
		
		$scope.entryCheck = function() {
			if(!$scope.logistics.companyName) {
				toaster.pop('error','请填写物流公司名称');
				return;
			}
			if(!$scope.logistics.number) {
				toaster.pop('error','请填写快递单号');
				return;
			}
			if(!$scope.checkinvoice||angular.equals(angular.toJson($scope.checkinvoice),'[]')) {
				toaster.pop('info','出货单信息为空');
				return;
			}
			if(!$scope.jsonSdAddress||angular.equals(angular.toJson($scope.jsonSdAddress),'{}')) {
				toaster.pop('info','选择发货地址');
				return;
			}
			
			$rootScope.logistics = $scope.logistics;
			$rootScope.checkinvoice = $scope.checkinvoice;
			$rootScope.jsonSdAddress = $scope.jsonSdAddress;
			$state.go('entryCheckShip', {ids: $stateParams.ids});
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
		
		$scope.deleteAddr = function(add) {
			ShippingAddress.del({addid : add.id}, {}, function(data) {
				toaster.pop('success', '成功', '删除成功');
				loadAddrs();
			}, function(res) {
				toaster.pop('error', '删除失败', res.resposeText);
			})
		}
		
	}]);
	
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress','AuthenticationService', function($scope, isSetTop, addr, $modalInstance, toaster, $http, ShippingAddress, AuthenticationService){
		$scope.isSetTop = isSetTop;
		//验证数据
		$scope.checkeds = {};
		$scope.checkform = function(name,num) {
			if(num == 1) {
				if(angular.isUndefined(name)) {
					$scope.checkeds.name = false;
				} else {
					$scope.checkeds.name = true;
				}
			} else if(num == 2) {
				if(angular.isUndefined(name)) {
					$scope.checkeds.detailAddress = false;
				} else {
					$scope.checkeds.detailAddress = true;
				}
			} else if(num == 3) {
				if(angular.isUndefined(name)) {
					$scope.checkeds.tel = false;
				} else {
					$scope.checkeds.tel = true;
				}
			}
		}
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
	    		toaster.pop('error','保存收货地址失败 ', res.data);
	    	});
	    }
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
	
	/*app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		$scope.kind = kind;
		if($scope.account && $scope.account.length > 0) {
			$scope.title = "修改付款信息";
		}else {
			$scope.title = "新增银行转账方式";
			$scope.account = {};
		}
		
		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);*/
	
});