define(['app/app'], function(app) {
	app.register.controller('adressAdminCtrl', ['$scope', '$anchorScroll', '$location', 'ShippingAddress', 'ngTableParams', 'BaseService', '$modal', 'toaster', function($scope, $anchorScroll, $location, ShippingAddress, ngTableParams, BaseService, $modal, toaster) {
		BaseService.scrollBackToTop();
		
		$scope.active = "ship";
		$scope.setActive = function(status) {
			$scope.active = status;
			loadAddrs();
		}
		
		$scope.isSendType = false;
		
		var getMethod = function() {
			switch($scope.active) {
			case 'ship':
				$scope.isSendType = false; break;
			case 'send':
				$scope.isSendType = true; break;
			}
		}
		
		var loadAddrs = function() {
			getMethod();
			ShippingAddress.get({send: $scope.isSendType}, function(data) {
				$scope.shipAddress = data;
			}, function(response) {
				toaster.pop('error', '获取地址失败 ' + response);
			});
		}
		loadAddrs();
		
		$scope.setDefaultAddress = function(id) {
			ShippingAddress.setTop({addid: id}, null, function(data) {
				toaster.pop('success', '设置成功');
				loadAddrs();
			}, function(response) {
				toaster.pop('error', '设置失败');
			});
		}
		
		//删除收货地址
		$scope.deleteAddr = function(addr){
			var isSure = confirm('确认删除？删除后不可恢复，请谨慎操作！');
			if(isSure) {
				var id = addr.id;
				ShippingAddress.del({addid: id}, {}, function(data){
					//重新加载购物数据
					loadAddrs();
				}, function(res){
					toaster.pop('error', '系统错误', '删除收货地址失败');
				});
			}
		};
		
		//编辑收货地址
		$scope.editAddr = function(isSetTop, addr) {
			$modal.open({
				templateUrl : 'static/view/prod/modal/editAddr_modal.html',
				controller : 'editAddrCtrl',
				backdrop : 'static',
				size : 'lg',
				resolve : {
					isSetTop : function(){
                    	//必须用 angular.copy深拷贝一份
                        return angular.copy(isSetTop);
                    },
                    addr : function(){
                    	return angular.copy(addr);
                    },
                    isSendType : function() {
                    	return $scope.isSendType;
                    }
				}
			}).result.then(function(address){
				loadAddrs();
			}, function(reason){
			});
		};
		
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', 'isSendType', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, isSetTop, addr, isSendType, $modalInstance, toaster, $http, ShippingAddress){
		$scope.isSetTop = isSetTop;
		
		$scope.isSendType = isSendType;
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
	    	ShippingAddress.save({isSetTop: $scope.isSetTop, send: $scope.isSendType, isPersonal: true}, address, function(data){
	    		toaster.pop('success', '成功 ', '保存收货地址成功');
	    		$modalInstance.close(data);
	    	}, function(res){
	    		toaster.pop('error', '保存收货地址失败 ', res.data);
	    	});
	    }
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
})