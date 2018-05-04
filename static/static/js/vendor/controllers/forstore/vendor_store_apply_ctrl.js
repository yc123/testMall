define(['app/app', 'jquery-uploadify'], function (app) {
	"use strict";
	app.register.controller('vendorStoreApplyCtrl', ['$scope', '$rootScope', 'Enterprise', 'StoreInfo', '$modal', 'toaster', '$timeout', '$state', '$q', 'BrandActiveAPI', 'Search','AuthenticationService', function($scope, $rootScope, Enterprise, StoreInfo, $modal, toaster, $timeout, $state, $q, BrandActiveAPI, Search, AuthenticationService) {
		$rootScope.active = "vendor_store";
		$scope.tab = 'ORIGINAL_FACTORY';

		document.title = "开店申请-优软商城";

		// 初始化店铺申请信息
		$scope.storeApply = { type : $scope.tab };
		// 初始化资质信息
		$scope.qualifications = {};
		$scope.qType = {
			taxPayer: 'TAX_PAYER',
			taxRegistration: 'TAX_REGISTRATION',
			businessLicense: 'BUSINESS_LICENSE'
		};
		// 初始化品牌信息
		$scope.brands = [{ type: 'BRAND' }];
		$scope.reason = null;

		$scope.switchTab = switchTab;

		$scope.checkBrand = checkBrand;
		$scope.getSimilarBrands = getSimilarBrands;

		$scope.deleteState = false;
		$scope.deleteBrandIndex = null;
		$scope.triggerDelete = triggerDelete;
		$scope.cancleDelete = cancleDelete;

		$scope.showBrandNotExistTip = false;
		$scope.closeBrandNotExistTip = closeBrandNotExistTip;
		$scope.goBrandApply = goBrandApply;

		$scope.showDeleteTip = false;
		$scope.deleteQualificationType = '';
		$scope.deleteTypeName = '';
		$scope.triggerDeleteTip = triggerDeleteTip;
		$scope.closeDeleteTip = closeDeleteTip;

		/**
		 * 初始化数据获取
		 */
		function activate() {
			// 获取企业信息
			var enterprise = $rootScope.userInfo.enterprise;
			Enterprise.getEnterpriseInfo({ enuu : enterprise.uu}, {}, function (enterprise) {
				$scope.enterprise = enterprise || {};

				StoreInfo.findLastUnPassApplyByEnuu({}, {}, function (result) {
					console.log('UN_PASS_APPLY', result);
					if (result) {
						switchTab(result.type);
						if (result.qualifications) {
							angular.forEach(result.qualifications, function (qualification) {
								$scope.qualifications[qualification.type] = qualification;
							});
						}else {
							Enterprise.getEnterpriseDetailInfo({ enuu : enterprise.uu},{},function (enterpriseDetail) {
								$scope.enBuinesssCode = enterpriseDetail.businessCodeImage;
                                $scope.qualifications[$scope.qType.businessLicense] = generateQualification($scope.enBuinesssCode, $scope.qType.businessLicense);;
                            });
						}
						if (result.brands) {
							$scope.brands = [];
							angular.forEach(result.brands, function (brand) {
								var newBrand = {};
								newBrand.name = brand.name;
								newBrand.url = brand.url;
								$scope.brands.push(newBrand);
							});
						}
						$scope.reason = result.reason;
					}
				}, function (error) {
					console.log('INITIAL_ERROR', error);
				});
			}, function () {
				toaster.pop('error', '获取企业信息失败');
			});
		}
		// 获取已登录的用户信息
		var getAuthentication = function() {
			return AuthenticationService.getAuthentication().success(function(data) {
				if(data && data.enterprises) {
					//data.enterprise = data.enterprises[data.enterprises.length - 1];
					if(data.enterprises.length > 1) {
						var enSelect = [];
						angular.forEach(data.enterprises, function(e){
							if(e.current)
								data.enterprise = e;
							else
								enSelect.push(e);
						});
						data.enSelect = enSelect;
					}
				}
				$scope.userInfo = data;
				// 增加收藏功能的代码
				$rootScope.userInfo = data;
				$rootScope.brandCount = 0;
				$rootScope.componentCount = 0;

				$scope.isAuthed = data != null && data.userUU;
			});
		};
		//根据用户的信息
		$q.all([getAuthentication()]).then(function () {
			if(AuthenticationService.isAuthed()) {
				activate();
			}
		}, function () {
		});
		/**
		 * 验证分类信息
		 */
		function checkBrand(brand) {
			if (brand.name && brand.name !== '') {
				setTimeout(function () {
					BrandActiveAPI.findBrandInfoByName({name : brand.name}, function (data) {
					}, function () {
						$scope.showBrandNotExistTip = true;
					})
				} , 500);
			}
		}

		/**
		 * 获取品牌联想词
		 *
		 * @param name    品牌名称
		 */
		function getSimilarBrands(name) {
			if (name) {
				return Search.getSimilarBrands({keyword : name}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					});
				});
			}
		}

		/**
		 * 触发防误删除操作
		 *
		 * @param index    品牌所有信息
		 */
		function triggerDelete(index) {
			$scope.deleteState = true;
			$scope.deleteBrandIndex = index;
		}

		/**
		 * 取消删除操作
		 */
		function cancleDelete() {
			$scope.deleteState = false;
			$scope.deleteBrandIndex = null;
		}

		/**
		 * 关闭品牌不存在提示
		 */
		function closeBrandNotExistTip() {
			$scope.showBrandNotExistTip = false;
		}

		/**
		 * 退转品牌申请页面
		 */
		function goBrandApply() {
			closeBrandNotExistTip();
			window.open('vendor#/brand/apply/');
		}

		/**
		 * 触发资质图片防误删提示框
		 *
		 * @param type		资质类型
		 */
		function triggerDeleteTip(type) {
			if (!type || type === '') return ;
			if (type === $scope.qType.businessLicense) {
				$scope.deleteTypeName = '营业执照';
			}
			if (type === $scope.qType.taxPayer) {
				$scope.deleteTypeName = '纳税人证明';
			}
			if (type === $scope.qType.taxRegistration) {
				$scope.deleteTypeName = '税务登记证';
			}
			$scope.showDeleteTip = true;
			$scope.deleteQualificationType = type;
		}

		/**
		 * 关闭资质图片防误删提示框
		 */
		function closeDeleteTip() {
			$scope.showDeleteTip = false;
			$scope.deleteQualificationType = '';
			$scope.deleteTypeName = '';
		}

		/**
		 * 切换Tab
		 *
		 * @param tab  tab标签页标题
		 */
		 function switchTab (t) {
			$scope.tab = t || 'ORIGINAL_FACTORY';
			$scope.storeApply = { type : $scope.tab };
			$scope.brands = [{ type: 'BRAND' }];
			$scope.reason = null;
		};

		/**
		 * 上传资质信息
		 *
		 * @param $data    资质图片信息
		 * @param type    资质类型
		 */
		$scope.onUploadQualification = function ($data, type) {
			console.log($data);
			if (!$data || !$data.path) {
				toaster.pop('error', '资质上传失败');
				return ;
			}
			$scope.qualifications[type] = generateQualification($data.path, type);
			$scope.qualifications[type].isPdf=isPdf($data.path);
		};

		function isPdf(path) {
			// 根据path文件名来判断文件是否是PDF文件
			if(path) {
				var str = path.slice(path.lastIndexOf('.')).toLowerCase();
				if(str == '.pdf'){
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		/**
		 * 显示资质信息
		 *
		 * @param qualification    资质信息
		 * @param isShow      是否展示显示资质
		 */
		$scope.showQualification = function (qualification, isShow) {
			qualification.isShow = isShow;
		};

		/**
		 * 删除资质信息
		 *
		 * @param type    资质类型
		 */
		$scope.deleteQualification = function (type) {
			console.log(type);
			console.log($scope.qualifications);
			if ($scope.qualifications[type]) {
				delete $scope.qualifications[type];
				closeDeleteTip();
			}
		};

		/**
		 * 生成资质信息
		 *
		 * @param resourceUrl    证明文件URL
		 * @param type        资质类型
		 */
		var generateQualification = function (resourceUrl, type) {
			return {
				resourceUrl : resourceUrl,
				type : type
			}
		};

		/**
		 * 添加品牌信息
		 */
		$scope.addBrand = function () {
			var brand = { type: 'BRAND' };
			$scope.brands.push(brand);
		};

		/**
		 * 删除品牌信息
		 *
		 * @param index    品牌信息编号
		 */
		$scope.deleteBrand = function (index) {
			cancleDelete();
			if ($scope.brands.length === 1) {
				toaster.pop('warning', '品牌信息至少包含一个');
				return ;
			}
			$scope.brands = $scope.brands.filter(function (brand, i) {
				brand = null;
				return i != index;
			})
		};

		/**
		 * 上传品牌证明图片信息
		 *
		 * @param $data    上传图片信息
		 * @param brand    品牌信息
		 */
		$scope.onUploadBrandImage = function ($data, brand) {
			if (!$data || !$data.path) {
				toaster.pop('error', '品牌证明上传失败');
				return ;
			}
			brand.url = $data.path;
			brand.isPdf = isPdf($data.path);
		};

		/**
		 * 删除品牌图片信息
		 *
		 * @param brand    品牌信息
		 */
		$scope.deleteBrandImage = function (brand) {
			delete brand.url;
			delete brand.isShow;
		};

		/**
		 * 显示品牌信息
		 *
		 * @param brand      品牌信息
		 * @param isShow    是否展示显示资质
		 */
		$scope.showBrand = function (brand, isShow) {
			brand.isShow = isShow;
		};

		/**
		 * 清除数据
		 */
		var clearData = function () {
			// 初始化店铺申请信息
			$scope.storeApply = { type : $scope.tab };
			$scope.qualifications = {};
			$scope.brands = [];
		};

		/**
		 * 提交开铺申请
		 */
		$scope.submitApplication = function () {
			console.log($scope.brands);
			console.log($scope.storeApply.type);
			// 验证资质信息
			if ($scope.storeApply.type != 'ORIGINAL_FACTORY' && $scope.storeApply.type != 'AGENCY' && $scope.storeApply.type != 'DISTRIBUTION') {
				toaster.pop('error', '开铺申请类型异常，请选择店铺类型');
				return ;
			}
			if (!$scope.qualifications[$scope.qType.businessLicense]) {
				toaster.pop('error', '请上传营业执照');
				return ;
			}
			if (($scope.storeApply.type == 'ORIGINAL_FACTORY' || $scope.storeApply.type == 'AGENCY')
				&& $scope.brands.length == 0) {
				toaster.pop('error', '请上传品牌信息');
				return ;
			}

			// 设置店铺申请资质信息
			$scope.storeApply.qualifications = [];
			$scope.storeApply.qualifications.push($scope.qualifications[$scope.qType.businessLicense]);
			$scope.storeApply.qualifications.push($scope.qualifications[$scope.qType.taxPayer]);
			$scope.storeApply.qualifications.push($scope.qualifications[$scope.qType.taxRegistration]);
			$scope.storeApply.qualifications = $scope.storeApply.qualifications.filter(function (qualification) {
				return qualification;
			});

			// 设置店铺的品牌信息
			var brands = [];
			if ($scope.storeApply.type == 'ORIGINAL_FACTORY' || $scope.storeApply.type == 'AGENCY') {
				// 获取有效品牌信息
				brands = $scope.brands.filter(function (brand) {
					return brand.name || brand.url;
				});
				console.log(brands);

				if (!brands || brands.length === 0) {
					toaster.pop('error', '请添加品牌信息');
					return ;
				}

				// 验证品牌信息名称是否存在
				for (var j = 0; j < brands.length; j++) {
					if (!brands[j] || !brands[j].name || brands[j].name === '') {
						toaster.pop('error', '请填写品牌名称信息');
						return ;
					}
					if (!brands[j] || !brands[j].url || brands[j].url === '') {
						toaster.pop('error', '请上传品牌图片');
						return ;
					}
				}
			}

			// 检测品牌信息
			var promises = new Array(brands.length);
			for(var i = 0; i < brands.length; i++) {
				promises[i] = existBrandPromise(brands[i].name);
			}
			$q.all(promises).then(function (result) {
				console.log(result);
				for(var i = 0; i < brands.length; i++) {
					if (!result[i]) {
						toaster.pop('error', '品牌' + brands[i].name + '不存在，请申请此品牌');
						return ;
					}
					brands[i].brandUuid = result[i].uuid;
				}

				$scope.storeApply.brands = brands;
				console.log(brands);
				console.log($scope.storeApply);
				submitApplyInfo();
			}, function (error) {
				var message = error.data;
				var index = message.indexOf('-');
				message = message.substring(index + 1, message.length - 1);
				console.log(message);
				toaster.pop('error', '品牌' + message + '不存在，请申请此品牌');
			});
		};

		var existBrandPromise = function (name) {
			var deffer = $q.defer();
			BrandActiveAPI.findBrandInfoByName({ name: name }, function (result) {
				deffer.resolve(result);
			}, function (error) {
				deffer.reject(error);
			});
			return deffer.promise;
		};

		var submitApplyInfo = function () {
			var deffer = $q.defer();
			StoreInfo.applyToOpenStore(null, $scope.storeApply, function(result) {
				deffer.resolve(result);
			}, function (error) {
				deffer.reject(error);
			});
			var promise = deffer.promise;

			promise.then(function (result) {
				clearData();
				if (result.success) {
					$scope.hidenSubmitBtn = true;
					toaster.pop('success', '感谢您对优软商城的支持，我们会尽快对您提交的信息进行审核，预计审核时间为3个工作日，审核结果将以站内消息及邮件形式通知您！');
					$rootScope.applyStatus = 'PREPARE';
					$timeout(function () {
						window.location.reload();
					}, 1000);
				} else {
					if (result.code == 6) {
						toaster.pop('info', '您已经开铺，即将跳转到您的店铺首页');
						$rootScope.applyStatus = 'PASS';
						$timeout(function () {
							window.location.href = $scope.rootPath + '/store/' + result.message;
						}, 1000);
					} else if (result.code == 4) {
						if (result.message == "AUTH_PREPARE") {
							toaster.pop('info', "您的店铺申请正在审核，请耐心等待……");
							$rootScope.applyStatus = 'PREPARE';
							$timeout(function () {
								$state.go('vendor_store_wait');
							}, 1000);
						} else if (result.message == "AUTH_PASS") {
							toaster.pop('info', "您的店铺申请已完成");
							$rootScope.applyStatus = 'PASS';
							$timeout(function () {
								$state.go('vendor_store_info');
							}, 1000);
						} else {
							toaster.pop('error', "系统错误");
						}
					} else {
						toaster.pop('error', result.message);
					}
				}
			}, function (error) {
				clearData();
				toaster.pop('error', '系统生成开铺申请信息失败');
			});
		}
	}]);

});