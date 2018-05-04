define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('WastageCtrl', ['$scope', 'toaster', '$stateParams','ComponentActive' ,'Cart', 'Goods', 'ngTableParams' ,'$modal' ,'BaseService' ,'KindAPI', '$location', '$rootScope','SessionService','$window', 'AuthenticationService',  function($scope, toaster, $stateParams, ComponentActive, Cart, Goods, ngTableParams, $modal, BaseService, KindAPI, $location, $rootScope, SessionService, $window, AuthenticationService) {
		$rootScope.page = 'wastage';// 导航栏锚点状态，'工厂库存'状态显示激活
		//推荐品牌
		ComponentActive.recommendOriginal({qty:3},function(data) {
			$scope.recommends = data;
		}, function(response) {
			toaster.pop('error', '获取类目信息失败 ');
		});
		KindAPI.getChildren({parentId: 0}, function(data) {
			$scope.kinds = [];
			var allkind = {'nameCn':'全部','id':-1};
			$scope.kinds.push(allkind);
			$scope.kinds.push.apply($scope.kinds,data);
			$scope.myflag = {
				'flag':true,
				'activeid':-1
			};
		}, function(response) {
			toaster.pop('error', '获取类目信息失败 ');
		});
		
		$scope.onFlag = function (){
			$scope.myflag.flag = !$scope.myflag.flag;
		};
		
		$scope.onSearch = function() {
			$scope.componentTableParams.reload();
		};
		
		$scope.searchKind = function(kind) {
			if(kind.id) {
				$scope.myflag.activeid = kind.id;
				if( kind.id != -1) {
					$scope.kindId = kind.id
				} else{
					delete $scope.kindId;
				}
			}
			$scope.componentTableParams.reload();
		};
		
		$scope.payNow = function(goods) {
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			var modalInstance = $modal.open({
				templateUrl : 'static/view/prod/modal/payNow_modal.html',  
				controller : 'PayNowCtrl',// 初始化模态范围
				size : 'md', //大小配置
				backdrop : "static",
				resolve : {
					goods : function() {
						return angular.copy(goods);
					}
				}
			});
		    modalInstance.result.then(function(orderid){
	        	//是否立即购买的判断
        		$location.path("orderEnsure/" + orderid);
	        }, function(reason){
	        	
	        });
		}
	}]);
	
	//地址编辑模态框的Controller
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, isSetTop, addr, $modalInstance, toaster, $http, ShippingAddress){
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
	    	/*
	    	 TODO 这里没做校验
	    	 */
	    	var strAres = address.province + ',' + address.city + ',' + address.district;
	    	address.area = strAres;
	    	
	    	// send属性 控制本地址是否是发货地址
	    	ShippingAddress.save({isSetTop: $scope.isSetTop, send: false}, address, function(data){
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
	

	
});