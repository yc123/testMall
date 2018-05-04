define([ 'app/app' ], function(app) {
	'use strict';	
	app.register.controller('ApplySampleCtrl', ['$scope', 'toaster', 'NgTableParams', '$stateParams', 'EncryptionService', '$filter','ShippingAddress','$modal' , 'Proofing' ,'$location' ,function($scope, toaster, NgTableParams, $stateParams, EncryptionService, $filter,ShippingAddress, $modal, Proofing, $location) {
		
		if($stateParams.id){
			//判断当前的id是否被送样
			Proofing.isSample({id: $stateParams.id}, {}, function(data){
        		if(data.uuid) {
        			$scope.proofing = {};
        			$scope.proofing.batchCode = data.batchCode;
        			$scope.proofing.uuid = data.uuid;
        			$scope.express ={
        					其他: "qt", 
        					量产: "lc", 
        					批量: "pl",
        					调试: "ts",
        					设计: "sj",
        					评估: "pg"
        			};
        			
        			$scope.ok = function() {
        				var address = angular.fromJson($scope.receiveAddress);
        				$scope.proofing.jsonAddress = angular.toJson(address);
        				if($scope.proofing.fixedtel) {
        					if($scope.proofing.fixedcode) {
        						$scope.proofing.fixedphone = $scope.proofing.fixedcode + "-" + $scope.proofing.fixedtel
        					}else {
        						$scope.proofing.fixedphone = $scope.proofing.fixedtel;
        					}
        				}
        				Proofing.saveProfing($scope.proofing,function(data) {
        					toaster.pop('success', '申请成功 !', '请查看您的送样单');
        					delete $scope.proofing;
        					$scope.time = 3;
        					var setTime = function() {
        						if($scope.time > 0) {
        							setTimeout(function() {
        								$scope.$apply(function() {
        									$scope.time--;
        									setTime();
        								});
        							}, 1000);
        						}else {
        							window.location.replace('user#/home/myProofing');
        						}
        					};
        					setTime();
        				},function() {
        					
        				});
        			}
        			//加载用户收货地址
        			var loadAddrs = function(id){
        				ShippingAddress.get({send: false}, function(data) {
        					//为每个设置选择状态
        					angular.forEach(data, function(addr){
        						if(id && (id == addr.id)){
        							addr.isSelect = true;
        							//设置收货地址
        							$scope.receiveAddress = angular.toJson(addr);
        						}
        						else{
        							addr.isSelect = false;
        						}
        						/*TODO 如果没有传id ，$scope.order.jsonAddress = null;*/
        					});
        					$scope.addrs = data;
        				}, function(response) {
        					toaster.pop('error', '系统错误', '获取收货地址失败');
        				});
        			};
        			loadAddrs();
        			
        			//选择收货地址
        			$scope.selectAddr = function(addr, addrs){
        				var id = addr.id;
        				ShippingAddress.setTop({addid: id}, {}, function(data){
        					//重新加载购物数据
        					loadAddrs(id);
        				}, function(res){
        					toaster.pop('error', '系统错误', '选择收货地址失败');
        				});
        			};
        			
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
        			
        			// 展开更多地址的开关
        			$scope.moreOptionTrigger = function() {
        				$scope.moreOption = ! $scope.moreOption;
        			};
        			
        		}
			}, function(res){
				toaster.pop('error', '无权限查看', '清返回首页');
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
	    	ShippingAddress.save({isSetTop: $scope.isSetTop, send: false, isPersonal: true}, address, function(data){
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