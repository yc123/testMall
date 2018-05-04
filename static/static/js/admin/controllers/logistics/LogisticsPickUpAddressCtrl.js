define([ 'app/app' ], function(app) {
	app.register.controller('LogisticsPickUpAddressCtrl', ['$scope', 'toaster', 'ngTableParams', 'BrandsSubmit', '$modal', 'BaseService', '$stateParams', 'PickUpAddress', '$location', '$anchorScroll', function($scope, toaster, ngTableParams, BrandsSubmit, $modal, BaseService, $stateParams, PickUpAddress, $location, $anchorScroll) {
		BaseService.scrollBackToTop();
		$scope.addAdress = function(addr) {
			$modal.open({
				templateUrl : 'static/view/admin/modal/editPickUp_modal.html',
				controller : 'editAddrCtrl',
				size : 'md',
				resolve : {
                    addr : function(){
                    	return angular.copy(addr);
                    }
				}
			}).result.then(function(address){
				loadAddrs();
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消自取地址的编辑');
			});
		}
		
		var loadAddrs = function() {
			/*
			 * 获取取货地址列表
			 */
			PickUpAddress.get({}, function(address){
				$scope.address = address;
				$scope.pickUpAddressTableParams = new ngTableParams({
					page : 1,
					count : 10
				}, {
					counts: [5, 10, 25, 50, 100],
					dataset: address
				});
			});
		}
		
		loadAddrs();
	
		/*
		 * 删除取货地址
		 */
		$scope.deleteAddress = function(id){
			var isSure = confirm('确认删除？删除后不可恢复，请谨慎操作！');
			if(isSure) {
				PickUpAddress.remove({id: id}, function(){
					toaster.pop("suceess", "删除成功");
					PickUpAddress.get({}, function(address){
						$scope.address = address;
						$scope.pickUpAddressTableParams = new ngTableParams({
							page : 1,
							count : 10
						}, {
							counts: [5, 10, 25, 50, 100],
							dataset: address
						});
					});
				}), function(){
					toaster.pop("error", "删除失败");
				};
			}
 		}
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'PickUpAddress', function($scope, addr, $modalInstance, toaster, $http, PickUpAddress){
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
		
	    $scope.save = function () {
	    	var address = $scope.address;
	    	//拼装地区
	    	/**
	    	 * TODO 这里没做校验
	    	 */
	    	var strAres = address.province + ',' + address.city + ',' + address.district;
	    	address.area = strAres;
	    	
			PickUpAddress.save({}, address, function(data){
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