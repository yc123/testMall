/**
 * Created by yujia on 2017/3/19.
 *  物流的控制器
 */
define(['app/app', 'calendar'], function(app) {
	'use strict';
	app.register.controller('buyerLogisticsCtrl', ['$scope', '$rootScope', 'ngTableParams', 'BaseService', 'ShippingAddress', 'toaster', '$modal', '$http', 'SmoothScroll', 'KdnLogistics', '$stateParams', 'Order', '$filter', 'Logistics', '$document', function($scope, $rootScope, ngTableParams, BaseService, ShippingAddress, toaster, $modal, $http, SmoothScroll, KdnLogistics, $stateParams, Order, $filter, Logistics, $document) {

		// 加密过滤器
		var enIdFilter = $filter('EncryptionFilter');

		$rootScope.active = 'buyer_logistics';
		$scope.tab = 'ship';

        //地址信息展开与否
		$scope.addressEx = {};
        $scope.addressEx.$expand = false;

		$scope.toggleTab = function(tab) {
			if($scope.tab != tab) {
				$scope.tab = tab;
			}
		};

		/**********************************************************************
		 * 初始化
		 **********************************************************************/

		// 分页数据
		$scope.addressList = [];
		//总条数是否大于5个
		$scope.isBiggerFive = false;
		$scope.shippingAddressTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				num : 'ASC'
			}
		}, {
			total : 0,
			getData : function ($defer, params) {
				const param = BaseService.parseParams(params.url());
				param.isSend = false;
				ShippingAddress.pageAddressOfUser(param, {}, function (page) {
                    $scope.isBiggerFive = false;
					$scope.total = page.totalElements;
					params.total(page.totalElements);
					if (page.content) {
						$scope.addressList = page.content;
					} else {
						$scope.addressList = [];
					}
					if($scope.total > 5) {
						$scope.isBiggerFive = true;
					}
				});
			}
		});
		$scope.shippingAddressTableParams.reload();

		// 获取区域信息
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
		}).error(function() {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});


		/**********************************************************************
		 * 地址相关操作
		 **********************************************************************/

		/**
		 * 显示更多地址信息
		 */
		$scope.toggleShippingAddress = function () {
            $scope.addressEx.$expand = !$scope.addressEx.$expand;
			if($scope.shippingAddressTableParams.count() == $scope.shippingAddressTableParams.total()) {
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
				if(angular.isUndefined(name)) {
					$scope.checkeds.tel = false;
				} else {
					$scope.checkeds.tel = true;
				}
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
		 * 新增买家收货地址信息
		 *
		 * @param saveAddress	收货地址
		 * @param isSetTop		是否设置为默认收货地址
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
				toaster.pop('info', '收件人姓名不能为空');
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
			if (myForm.tel.$invalid) {
				toaster.pop('info', '手机号格式错误');
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
			if (!saveAddress.tel) {
				toaster.pop('info', '手机号不能为空');
				return ;
			}

			//拼装地区
			saveAddress.area = saveAddress.province + ',' + saveAddress.city + ',' + saveAddress.district;

			// send属性 控制本地址是否是发货地址
			ShippingAddress.save({isSetTop: isSetTop, send: false, isPersonal: true}, saveAddress, function(data){
				if (data) {
					$scope.shippingAddressTableParams.page(1);
					$scope.shippingAddressTableParams.reload();
				}
				SmoothScroll.scrollTo(null, 'site-nav');
				toaster.pop('success', '成功 ', '保存收货地址成功');
				var form = document.getElementById("form");
				form.reset();
				myForm.$setUntouched();
				myForm.$setPristine();
				$scope.address = angular.copy($scope.initAddress);
			}, function(){
				toaster.pop('error', '系统错误 ', '保存收货地址失败');
			});
		};

		/**
		 * 修改买家收货地址信息
		 *
		 * @param address	收货地址
		 */
		$scope.updateShippingAddress = function (address) {
			$modal.open({
				templateUrl : $rootScope.rootPath + '/static/view/prod/modal/editAddr_modal.html',
				controller : 'editAddrCtrl',
				size : 'lg',
				resolve : {
					addr : function(){
						return angular.copy(address);
					}
				}
			}).result.then(function(address){
				if (address) {
					$scope.shippingAddressTableParams.page(1);
					$scope.shippingAddressTableParams.reload();
				}
			}, function(){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		};

		/**
		 * 删除买家收货地址信息
		 *
		 * @param addressId	买家收货地址ID
		 */
		$scope.deleteShippingAddress = function (addressId) {
			var isDelete = window.confirm('确认删除地址信息吗？');
			if(isDelete) {
				ShippingAddress.del({ addid : addressId }, {}, function () {
					$scope.shippingAddressTableParams.page(1);
					$scope.shippingAddressTableParams.reload();
				}, function (res) {
					toaster.pop('error', '删除收货地址失败 '+ res);
				});
			}
		};

		/**
		 * 设置默认收货地址
		 *
		 * @param addressId	买家收货地址ID
		 */
		$scope.setDefaultShippingAddress = function (addressId) {
			ShippingAddress.setTop({ addid : addressId }, {}, function () {
				$scope.shippingAddressTableParams.page(1);
				$scope.shippingAddressTableParams.reload();
			}, function () {
				toaster.pop('error', '设置默认收货地址失败');
			});
		};

		/**
		 *  日历组件
		 *
		 */
		$('#date').calendar({
			width: 270,
			height: 220
		});

		/**
		 *  查询物流信息(由于接口需要真实运单号，所以物流公司以及运单号暂时写死)
		 *
		 *  @param  kdnCompanyName	快递公司名称
		 *  @param	logisticsCode	运单号
		 *
		 */
		if ($stateParams.orderid && $stateParams.orderid != '') {
			$scope.tab = 'tracking';
			$scope.orderid = $stateParams.orderid;
			if(!$scope.orderid) {
				toaster.pop('warning', '没有传入有效的订单信息');
			}
			Order.get({orderid : $scope.orderid}, function (data) {
				if(data.length != 1) {
					toaster.pop('warning', '获取订单信息失败');
					return ;
				}
				$scope.order = data[0];
				Logistics.findLogisticsById({lgtid: data[0].lgtId}, function(data){
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
			}, function() {
				toaster.pop('warning', '获取订单信心失败。');
			});
		}
	}]);

	//地址编辑模态框
	app.register.controller('editAddrCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, addr, $modalInstance, toaster, $http, ShippingAddress){
		$scope.isSetTop = addr.num == 1;
		//验证数据
		$scope.checkeds = {};
		$scope.checkform = function(name,num) {
			var size;
			if(num == 1) {
				size = document.getElementById("muserName").value.length;
				console.log(size);
				if (size > 10) {
					$scope.userError = true;
					console.log($scope.userError);
					return;
				}
				$scope.userError = false;
				console.log($scope.userError);
			} else if(num == 2) {
				size = document.getElementById("maddr").value.length;
				console.log(size);
				if (size > 30) {
					$scope.addrError = true;
					console.log($scope.addrError);
					return;
				}
				$scope.addrError = false;
				console.log($scope.addrError);
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
			if(addr && addr.area){
				$scope.address = addr;
				//拼装下拉选择框
				var arr = addr.area.split(',');
				addr.province = arr[0];
				addr.city = arr[1];
				addr.district = arr[2];
				$scope.address = addr;
				$scope.addr = true;
			}
		}).error(function() {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});

		$scope.save = function () {
			var address = $scope.address;

			//拼装地区
			var strAres = address.province + ',' + address.city + ',' + address.district;
			address.area = strAres;

			// send属性 控制本地址是否是发货地址
			ShippingAddress.save({isSetTop: $scope.isSetTop, send: false, isPersonal: true}, address, function(data){
				toaster.pop('success', '成功 ', '保存收货地址成功');
				$modalInstance.close(data);
			}, function(){
				toaster.pop('error', '保存收货地址失败', res.data);
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);

});
