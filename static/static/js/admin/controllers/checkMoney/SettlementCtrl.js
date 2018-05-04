define(['app/app'], function(app) {
	'use strict';
	app.register.controller('SettlementCtrl', ['$scope','toaster', 'BaseService', 'Purchase', 'ngTableParams', '$location', '$anchorScroll', 'bankInfoService', '$stateParams', '$filter', '$modal', function($scope, toaster, BaseService, Purchase, ngTableParams, $location, $anchorScroll, bankInfoService, $stateParams, $filter, $modal) {
		/**********************************************************************
		 * init
		 **********************************************************************/
		BaseService.scrollBackToTop();
		var hideBankFilter = $filter("hideBankFilter");
		// 保存激活Tab标识
		$scope.active = 'available';
		// 待结算是否到期
		$scope.type = 2;
		// 根据当前激活Tab获取查询状态信息
		var getState = function() {
			var state = null;
			switch($scope.active) {
				case 'unavailable' :
					state = '514';
					$scope.type = 1; break;
				case 'available' :
					state = '514';
					$scope.type = 2; break;
				case 'settled' :
					state = '515'; break;
				default :
					state = '514'; break;
			}
			return state;
		};
		// 切换Tab
		$scope.setActive = function(status) {
			if($scope.active != status) {
				$scope.active = status;
				$scope.paymentTableParams.page(1);
				$scope.paymentTableParams.reload();
				if(status == 'available') {
					delete $scope.transferTime;
					delete $scope.imgUrl;
					delete $scope.logoUrl;
					delete $scope.imageUrl;
					delete $scope.b2cAccount.filterAccount;
					if ($scope.venderAccount.filterAccount){
						delete $scope.venderAccount.filterAccount;
					}
					$scope.batchCheckStatus = false;
					$scope.oneCheckStatus = true;
				}
			}

		};
		// 获取table数据
		$scope.paymentTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createTime : 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				if (param.status == 514) {
					param.type = $scope.type;
				}
				$scope.count = 0;
				Purchase.getRequestPayBypage(param, function (page) {
					console.log('PRINT PAGE DATA OF REQUEST PAYMENT');
					console.log(page);
					if (page.content) {
						$defer.resolve(page.content);
						params.total(page.totalElements);
					} else {
						$defer.resolve(null);
						params.total(0);
					}
				}, function (data) {
					$defer.resolve(null);
					params.total(0);
					console.log('ERROR INFORMATION OF THIS OPERATOR');
					console.log(data);
				});
			}
		});

		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.paymentTableParams.page(1);
			$scope.paymentTableParams.reload();
		};
		// 确认结算
		$scope.checkMoney = function(payment) {
			$scope.batchCheckStatus = true;
			$scope.oneCheckStatus = false;
			console.log(payment);
			$location.hash('batchCheckMoney');
			$anchorScroll();
			if(payment) {
				$scope.count = 1;
				$scope.batchPayment = [];
				$scope.batchPayment.push(payment);
				$scope.total = payment.price;
				getVenderAccount(payment.sellerenuu);
				getAdminAccount();
			}
		};

        /**
         * 上传付款截图
         */
        $scope.onUpload = function ($data) {
            if (!$data || !$data.path) {
                toaster.pop('error', '付款截图上传失败');
                return ;
            }
            $scope.logoUrl = $data.path;
        };

		/**********************************************************************
		 * 确认结算
		 **********************************************************************/
		// 最大日期为当天
		$scope.maxDate = new Date();

		// 打开日期选择框
		$scope.openDatePicker = function($event, item, openParam) {
			$event.preventDefault();
			$event.stopPropagation();
			item[openParam] = !item[openParam];
		};

		//平台应付账号
		var getAdminAccount = function() {
			bankInfoService.getAdminEnterAccount('', function(data) {
				$scope.b2cAccountInfos = resolveData(data);
				angular.forEach($scope.b2cAccountInfos, function(b2cAccountInfos) {
					b2cAccountInfos.filterAccount = hideBankFilter(b2cAccountInfos.number);
				});
				$scope.b2cAccount = getOriginalData($scope.b2cAccountInfos);
			}, function(res) {
				toaster.pop('error', '错误', '获取卖家信息失败');
			});
		};
		getAdminAccount();

		//供应商应收账户
		var getVenderAccount = function(venduu) {
			bankInfoService.getVenderBank({venduu:venduu},null, function(data) {
				$scope.venderAccountInfos = resolveData(data);
				angular.forEach($scope.venderAccountInfos, function(venderAccountInfos) {
					venderAccountInfos.filterAccount = hideBankFilter(venderAccountInfos.number);
				});
				$scope.venderAccount = getOriginalData($scope.venderAccountInfos);
			}, function(res) {
				toaster.pop('error', '错误', '获取卖家信息失败');
			});
		};

		//解析数据，从返回的数据中找到要解析的数据
		var resolveData = function(data) {
			var arr = [];
			for(var key in data) {
				var numb= Number(key);
				if(angular.isNumber(numb)&&(!isNaN(numb))) {
					arr.push(data[key]);
				}
			}
			return arr;
		};

		//排序
		var getOriginalData = function(data) {
			var result = null;
			if(data&&data.length) {
				result = data[0];
			}
			return result;
		};

		//删除平台账户
		$scope.deleteAccount = function(buyAccount) {
			var resurt = confirm('是否删除此银行账户,删除后将不能恢复，谨慎操作!');
			if(resurt){
				bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
					toaster.pop('success', '删除成功');
					getAdminAccount();
					//TODO 这个需要用编码变身
					if($stateParams.uu == 10030994) {
						getVenderAccount();
					}
				}, function(response) {
					toaster.pop('error', '删除失败');
				})
			}
		};

		//新增账户
		$scope.newAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoAdmin.html',
				controller : 'BankInfoCtrl',
				resolve : {
					kind : function() {
						//深拷贝一份
						return angular.copy($scope.kind);
					},
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					}
				}
			});

			modalInstance.result.then(function(account) {
				//企业账户
				bankInfoService.saveAdminEnteAccount({}, account, function(data) {
					toaster.pop('success', '保存成功','信息已保存');
					$scope.kind = account.kind;
					getAdminAccount();
					//TODO 这个需要用编码变身
					if($stateParams.uu == 10030994) {
						getVenderAccount();
					}
				}, function(res) {
					toaster.pop('error', '错误', res.data);
				});
			}, function() {

			});
		};

		//选中账号
		$scope.select = function(account, isVender) {
			if(isVender) {
				$scope.venderAccount = account;
			}else {
				$scope.b2cAccount = account;
			}
		};

		//expose代表展开的状态，isBuyd代表当前操作的数据
		$scope.doExpose = function(expose, isVender) {
			if(isVender) {
				$scope.venderExpose = expose;
			}else {
				$scope.salexpose = expose;
			}
		};

		// 打开图像上传模态框
		$scope.imageUrl = 'static/img/upload/cont.jpg';
		$scope.showImageDialog = function() {
			$modal.open({
				templateUrl : 'offer/image/insert.html',
				controller : 'ImageInsertCtrl',
				backdrop : 'static'
			}).result.then(function(image){
				if(!image.src || !image) {
					$scope.logoUrl = false;
					$scope.imageUrl = false;
				}else {
					$scope.logoUrl = image.src;
					$scope.imageUrl = image.thumb;
				}
			}, function() {
				$scope.logoUrl = false;
				$scope.imageUrl =false;
			});
		};

		// 确认付款
		$scope.confirm = function(transferTime) {
			console.log(transferTime);
			$scope.transferTime = transferTime;
			if (angular.isUndefined($scope.venderAccount) || angular.equals("{}", angular.toJson($scope.venderAccount))) {
				toaster.pop('error', '错误', '请选择卖家账户');
				return;
			}
			if (angular.isUndefined($scope.b2cAccount) || angular.equals("{}", angular.toJson($scope.b2cAccount))) {
				toaster.pop('error', '错误', '请选择平台账户');
				return;
			}
			if (angular.isUndefined($scope.logoUrl) || angular.equals($scope.logoUrl, 'static/img/upload/cont.jpg')) {
				toaster.pop('error', '错误', '请上传付款截图');
				return;
			}
			if (angular.isUndefined($scope.count) || $scope.count == 0) {
				toaster.pop('error', '错误', '没有选择要付款的出入库单');
				return;
			}
			if (!$scope.transferTime) {
				toaster.pop('error', '错误', '请选择付款日期');
				return;
			}
			delete $scope.b2cAccount.filterAccount;
			delete $scope.venderAccount.filterAccount;
			var jsonPament = angular.toJson($scope.b2cAccount);
			var jsonReceive = angular.toJson($scope.venderAccount);
			var transfer = {};
			transfer.jsonPament = jsonPament;
			transfer.jsonReceive = jsonReceive;
			transfer.imgUrl = $scope.logoUrl;
			transfer.transferTime = $scope.transferTime.getTime();
			var id = $scope.batchPayment[0].id;
			Purchase.ensurePayment({id:id}, transfer, function (data) {
				toaster.pop("success", '成功', '结算成功!');
				$scope.paymentTableParams.page(1);
				$scope.paymentTableParams.reload();
				$scope.batchCheckStatus = false;
				$scope.oneCheckStatus = true;
				// 清除日期和图片信息
				delete $scope.transferTime;
				delete $scope.imgUrl;
				delete $scope.logoUrl;
				delete $scope.imageUrl;
				window.location.href = 'admin#/check/settlement#batchCheckMoney';
			}, function () {
				toaster.pop("error", '失败', '信息保存失败');
			});
		};
	}]);

	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		$scope.kind = kind;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}

		$scope.set = function(kind) {
			$scope.kind = kind;
		}

		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}

		$scope.cancel = function() {
			$modalInstance.dismiss();
		}

	}]);

	app.register.controller('ImageInsertCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = path.substring(0, path.lastIndexOf('.')) + "_150x90" + path.substr(path.lastIndexOf('.'));
			$scope.$apply(function(){
				$scope.image.src = data.path;
				$scope.image.thumb = path;
			});
		};

		$scope.close = function() {
			$modalInstance.dismiss();
		};

		$scope.confirm = function() {
			$modalInstance.close($scope.image);
			$scope.imageUrl = null;
		};
	}]);
});