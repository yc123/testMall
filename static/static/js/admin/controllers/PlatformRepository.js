define([ 'app/app' ], function(app) {
	app.register.controller('PlatformRepository', ['$scope', 'ShippingAddress', 'toaster', 'BaseService', 'ngTableParams', '$modal', '$location', '$anchorScroll', function($scope, ShippingAddress, toaster, BaseService, ngTableParams, $modal, $location, $anchorScroll) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'send';
		
		var getState = function() {
			var state = "getEnterprise";
			switch($scope.active) {
				case 'ship':
				state = "getB2CShipPageAddress"; break;
				case 'send':
				state = "getB2CSendPageAddress"; break;
			}
			return state;
		}
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.platformAddrTableParams.reload();
		}
		
		//获取平台仓库收发货地址
		//【收货地址】 1001 【发货地址】 1002
		$scope.platformAddrTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				type : 'ASC',
				num : 'ASC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				ShippingAddress[getState()].call(null, param, function(page) {
					if(page.content) {
						$defer.resolve(page.content);
						params.total(page.totalElements);
					}
				}, function(response) {
					toaster.pop('error', '获取平台收货地址失败', response);
				});
			}
		});
		
		$scope.addAdress = function(addr) {
			$modal.open({
				templateUrl : 'static/view/admin/modal/platformAddress_modal.html',
				controller : 'editAddrCtrl',
				size : 'md',
				resolve : {
                    addr : function(){
                    	return angular.copy(addr);
                    }
				}
			}).result.then(function(address){
				$scope.platformAddrTableParams.reload();
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消自取地址的编辑');
			});
		}
		
		$scope.deleteAddress = function(id) {
			var isSure = confirm('确认删除？ 删除后不可恢复，请谨慎操作！');
			if(isSure) {
				ShippingAddress.del({addid: id}, {}, function(data) {
					toaster.pop('success', '删除成功');
					$scope.platformAddrTableParams.reload();
				}, function(response) {
					toaster.pop('error', '删除失败', response);
				});
			}
		}
		
		$scope.setTop = function(id) {
			ShippingAddress.setTop({addid: id}, {}, function(data) {
				toaster.pop('success', '设置成功');
				$scope.platformAddrTableParams.reload();
			}, function(response) {
				toaster.pop('error', '设置失败');
			})
		}
		
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, addr, $modalInstance, toaster, $http, ShippingAddress){
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr){
				$scope.isEidt = true;
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
		
		$scope.addressType = [{'name' : '发货地址', 'code': 1002}, {'name':'收货地址', 'code' : 1001}];
		
	    $scope.save = function () {
	    	var address = $scope.address;
	    	//拼装地区
	    	/**
	    	 * TODO 这里没做校验
	    	 */
	    	var strAres = address.province + ',' + address.city + ',' + address.district;
	    	address.area = strAres;
	    	
	    	ShippingAddress.saveB2C({isSetTop: true, ship: address.type == 1001 ? true : false}, address, function(data){
				delete $scope.isEidt;
				toaster.pop("success", "新增地址成功");
				$modalInstance.close(data);
			}, function(){
				toaster.pop("error", "新增地址失败");
			})
	    }
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
});