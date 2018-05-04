/**
 * 物流的控制器
 */
define(['app/app', 'calendar'], function (app) {
	"use strict";
	app.register.controller('vendorLogisticsCtrl', ['$scope', '$rootScope', '$http', 'ngTableParams', 'BaseService', 'ShippingAddress', 'toaster', 'SmoothScroll', '$modal','$stateParams','Purchase','Logistics','KdnLogistics','$filter','StoreInfo', function($scope, $rootScope, $http, ngTableParams, BaseService, ShippingAddress, toaster, SmoothScroll, $modal, $stateParams, Purchase, Logistics, KdnLogistics, $filter, StoreInfo) {
		// 加密过滤器
		var enIdFilter = $filter('EncryptionFilter');
		document.title = '发货地址-优软商城';
		$rootScope.active = 'vendor_logistics';
		$scope.tab = 'logistic';
		$scope.canAddTotal = 20;
        //是寄售店铺
		if ($rootScope.store && (!$rootScope.store.status || $rootScope.store.status === 'OPENED')){
            $scope.isCONSIGNMENT = false;
		}else {
            $scope.isCONSIGNMENT = true;
		}
       /* $scope.isCONSIGNMENT = false;
        StoreInfo.findShopOwnerApplyByNormalStatus({}, {}, function (result) {
            if (!result.data) {
                $scope.isCONSIGNMENT = true;
                $scope.storeType = 'mall';
            }else if (result.data.type == 'CONSIGNMENT' || result.data.status == 'PREPARE'){
                $scope.isCONSIGNMENT = true;
            }}, function (error) {

        });*/
		$scope.addressEx = {};

		//地址的条数是否超过5条
		$scope.isBiggerFive = false;

		$scope.toggleTab = function(tab) {
			if($scope.tab != tab) {
				$scope.tab = tab;
			}
		};

		/**
		 *  日历组件
		 *
		 */
		$('#date').calendar({
			width: 270,
			height: 220
		});


		/**********************************************************************
		 * 初始化
		 **********************************************************************/

		// 分页数据
		$scope.addressList = [];

		$scope.shippingAddressTableParams = new ngTableParams({
			page : 1,
			count : 20,
			sorting : {
				num : 'ASC'
			}
		}, {
			total : 0,
			getData : function ($defer, params) {
				const param = BaseService.parseParams(params.url());
				param.isSend = true;
				ShippingAddress.pageAddressOfUser(param, {}, function (page) {
					$scope.isBiggerFive = false;
					params.total(page.totalElements);
					$scope.total = page.totalElements;
					if (page.content) {
						$scope.addressList = page.content;
					} else {
						$scope.addressList = [];
					}
					angular.forEach($scope.addressList, function (attr) {
						var arr = attr.area.split(',');
						attr.province = arr[0];
						attr.city = arr[1];
						attr.district = arr[2];
					});
					// if($scope.total > 5) {
					// 	$scope.isBiggerFive = true;
					// }
				});
			}
		});

		/**
		 * 加载地址信息
		 */
		$scope.loadAddresses = function () {
			$scope.shippingAddressTableParams.page(1);
			$scope.shippingAddressTableParams.reload();
		};

		$scope.loadAddresses();

		/**
		 * 获取区域信息
		 */
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
		}).error(function() {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});

		//删除地址
		$scope.deleteAddress = function (address) {
			$scope.deleteObject = angular.copy(address);
			$scope.showDeleteFrame = true;
		};

		$scope.cancelDelete = function () {
			$scope.showDeleteFrame = false;
		};

		$scope.ensureDelete = function (addressId) {
			ShippingAddress.del({ addid : addressId }, {}, function () {
				$scope.showDeleteFrame = false;
				$scope.loadAddresses();
			}, function (res) {
				toaster.pop('error', '删除收货地址失败 '+ res);
			});
		};


		/**********************************************************************
		 * 地址相关操作
		 **********************************************************************/

		/**
		 * 显示更多地址信息
		 */
		$scope.toggleShippingAddress = function () {
			$scope.addressEx.$expand = !$scope.addressEx.$expand;
			if($scope.shippingAddressTableParams.total() == $scope.addressList.length) {
				$scope.shippingAddressTableParams.count(5);
			}else {
				$scope.shippingAddressTableParams.count($scope.shippingAddressTableParams.total());
			}
			$scope.shippingAddressTableParams.reload();
		};

		$scope.checkeds = {};

		/**
		 * 验证表单
		 */
		$scope.checkform = function(name, num) {
			var size;
			if(num == 1) {
				size = document.getElementById("userName").value.length;
				console.log(size);
				if (size > 10) {
					$scope.userError = true;
					console.log($scope.linkError);
					return;
				}
				$scope.userError = false;
				console.log($scope.userError);
			} else if(num == 2) {
				size = document.getElementById("addr").value.length;
				console.log(size);
				if (size > 30) {
					$scope.addrError = true;
					console.log($scope.linkError);
					return;
				}
				$scope.addrError = false;
				console.log($scope.userError);
			} else if(num == 3) {
				$scope.checkeds.tel = !angular.isUndefined(name);
			}
		};

		$scope.initAddress = {};
		$scope.initAddress.name = null;
		$scope.initAddress.province = null;
		$scope.initAddress.city = null;
		$scope.initAddress.district = null;
		$scope.initAddress.detailAddress = null;
		$scope.initAddress.postalCode = null;
		$scope.initAddress.tel = null;
		$scope.initAddress.landlineNumber = null;
		$scope.initAddress.email = null;

		$scope.address = angular.copy($scope.initAddress);

		/**
		 * 新增买家发货地址信息
		 *
		 * @param saveAddress	发货地址
		 * @param isSetTop		是否设置为默认发货地址
		 */
		$scope.addShippingAddress = function (saveAddress, isSetTop, myForm, userError, addrError) {
			if (!isSetTop || isSetTop == '') {
				isSetTop = false;
			}
			if (!saveAddress) {
				toaster.pop('info', '新增地址信息不能为空');
				return ;
			}
			if (!saveAddress.name) {
				toaster.pop('info', '发货人姓名不能为空');
				return ;
			}
			if (!saveAddress.province || !saveAddress.city || !saveAddress.district) {
				toaster.pop('info', '所在区域信息不能为空');
				return ;
			}
			if (!saveAddress.detailAddress) {
				toaster.pop('info', '地址详细信息不能为空');
				return ;
			}
			if (userError) {
				toaster.pop('info', '请勿超过10个字');
				return ;
			}
			if (addrError) {
				toaster.pop('info', '请勿超过30个字');
				return ;
			}


			//拼装地区
			saveAddress.area = saveAddress.province + ',' + saveAddress.city + ',' + saveAddress.district;

			// send属性 控制本地址是否是发货地址
			ShippingAddress.save({isSetTop: isSetTop, send: true, isPersonal: false}, saveAddress, function(data){
				if (data) {
					$scope.loadAddresses();
				}
				SmoothScroll.scrollTo(null, 'site-nav');
				toaster.pop('success', '成功 ', '保存发货地址成功');
				var form = document.getElementById("form");
				form.reset();
				myForm.$setUntouched();
				myForm.$setPristine();
				$scope.address = angular.copy($scope.initAddress);
			}, function(res){
				toaster.pop('error', '保存发货地址失败 ', res.data);
			});
		};

		/**
		 * 修改发货地址信息
		 *
		 * @param address	发货地址
		 */
		$scope.editShippingAddress = function (address) {
			$modal.open({
				templateUrl : $rootScope.rootPath + '/static/view/common/modal/edit_address_modal.html',
				controller : 'editAddrCtrl',
				size : 'lg',
				resolve : {
					addr : function(){
						return angular.copy(address);
					},
					isSendType : function () {
						return true;
					},
					isModify : function () {
						if (address){
							return true;
						}else {
							return false;
						}
					}
				}
			}).result.then(function(address){
				if (address) {
					$scope.loadAddresses();
				}
			}, function(){
				// toaster.pop('info', '提示 ' + '您已取消发货地址的编辑');
			});
		};

		/**
		 * 删除买家发货地址信息
		 *
		 * @param addressId	买家发货地址ID
		 */
		$scope.deleteShippingAddress = function (addressId) {
			var isDelete = window.confirm('确认删除地址信息吗？');
			if(isDelete) {
				ShippingAddress.del({ addid : addressId }, {}, function () {
					$scope.loadAddresses();
				}, function () {
					toaster.pop('error', '删除发货地址失败');
				});
			}
		};

		/**
		 * 设置默认发货地址
		 *
		 * @param addressId	买家发货地址ID
		 */
		$scope.setDefaultShippingAddress = function (addressId) {
			ShippingAddress.setTop({ addid : addressId }, {}, function () {
				$scope.loadAddresses();
			}, function () {
				toaster.pop('error', '设置默认发货地址失败');
			});
		};

		/**
		 *  查询物流信息(由于接口需要真实运单号，所以物流公司以及运单号暂时写死)
		 *
		 *  @param  kdnCompanyName	快递公司名称
		 *  @param	logisticsCode	运单号
		 *
		 */
		if ($stateParams.purchaseid && $stateParams.purchaseid != '') {
			$scope.tab = 'tracking';
			$scope.purchaseid = $stateParams.purchaseid;
			if(!$scope.purchaseid) {
				toaster.pop('warning', '没有传入有效的订单信息');
			}
			Purchase.get({purchaseId : $scope.purchaseid}, function (data) {
				if(data.code != 1) {
					toaster.pop('warning', '获取订单信息失败');
				}else {
					$scope.purchase = data.data;
					Logistics.findLogisticsById({lgtid: data.data.lgtId}, function(data){
						$scope.logistics = data;
						var params = {};
						params.companyName = $scope.logistics.companyName;
						params.logisticsCode = $scope.logistics.number;
						KdnLogistics.kdnQuery(params, {}, function(response){
							if(!response.errorInfo) {
								$scope.logisticsInfo = eval ("(" + response.traces + ")");
								$scope.hasInfo = true;
							}
						}, function(){
							$scope.logisticsInfo = [];
							toaster.pop('info', '查询物流信息失败,请核对物流公司和运单号');
						});
					}, function(){
						toaster.pop('info', '根据快递ID查询跟订单相关联的物流信息失败');
					});
				}

			}, function() {
				toaster.pop('warning', '获取订单信息失败。');
			});
		}
	}]);

	//地址编辑模态框
	app.register.controller('editAddrCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', 'isSendType', 'isModify', function($scope, addr, $modalInstance, toaster, $http, ShippingAddress, isSendType, isModify){
		if (addr){
			$scope.isSetTop = addr.num == 1;
		}else {
			$scope.isSetTop = false;
		}
		$scope.isSendType = isSendType;
		$scope.isModify = isModify;

		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr && addr.area){
				// $scope.address = addr;
				//拼装下拉选择框
				var arr = addr.area.split(',');
				addr.province = arr[0];
				addr.city = arr[1];
				addr.district = arr[2];
				$scope.address = addr;
			}
		}).error(function() {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});

		$scope.checkForm = function(num) {
			var size;
			if(num == 1) {
				if ($scope.address.name){
					size = $scope.address.name.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 20) {
						$scope.userError = true;
						return;
					}
					$scope.userError = false;
				}
			} else if(num == 2) {
				if ($scope.address.tel){
					size = $scope.address.tel.replace(/[^\x00-\xff]/g,'**').length;
					if (size < 8 || size > 11) {
						$scope.telError = true;
						return;
					}
					$scope.telError = false;
					var telPatt = new RegExp("^[0-9]+$");
					if (telPatt.test($scope.address.tel)){
						$scope.telPatternError = false;
					}else {
						$scope.telPatternError = true;
					}
				}
			} else if(num == 3) {
				if ($scope.address.detailAddress){
					size = $scope.address.detailAddress.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 60) {
						$scope.addrError = true;
						return;
					}
					$scope.addrError = false;
				}
			} else if(num == 4) {
				var emailPatt = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
				if ($scope.address.email.length > 0 && !emailPatt.test($scope.address.email)){
					$scope.emailPatternError = true;
				}else {
					$scope.emailPatternError = false;
				}
			}
		};

		$scope.save = function () {
			var address = $scope.address;

			if (!address){
				toaster.pop('error', '请补充未填写的信息');
				return ;
			}
			if (!address.name || !address.province || !address.city || !address.district ||
				!address.detailAddress || !address.tel){
				toaster.pop('error', '请补充未填写的信息');
				return ;
			}
			if ($scope.userError || $scope.telError || $scope.addrError || $scope.telPatternError ||
				$scope.emailPatternError){
				toaster.pop('error', '请修改红色框内的信息');
				return ;
			}

			//拼装地区
			address.area = address.province + ',' + address.city + ',' + address.district;

			// send属性 控制本地址是否是发货地址
			ShippingAddress.save({isSetTop: $scope.isSetTop, send: $scope.isSendType, isPersonal: !$scope.isSendType}, address, function(data){
				toaster.pop('success', '成功 ', '保存发货地址成功');
				$modalInstance.close(data);
			}, function(res){
				toaster.pop('error', '保存发货地址失败 ', res.data);
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);

});
