define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('StoreQualificationCtrl', ['$scope', '$stateParams', 'toaster', 'StoreInfo', '$state', '$timeout', '$q', 'BrandActiveAPI', '$modal', function ($scope, $stateParams, toaster, StoreInfo, $state, $timeout, $q, BrandActiveAPI, $modal) {

		//------------------------------------------------- 常量

		// 资质类型
		$scope.qType = {
			taxPayer: 'TAX_PAYER',
			taxRegistration: 'TAX_REGISTRATION',
			businessLicense: 'BUSINESS_LICENSE'
		};

		//------------------------------------------------- 变量

		// 资质信息
		$scope.qualifications = {};
		// 设置默认选择资质类型为大陆
		$scope.tab = 'MAINLAND';
		$scope.switchTab = switchTab;

		// 设置公司资质信息
		$scope.enQualification = { status: '正常'};
		$scope.showQualification = showQualification;

		$scope.showBrandInfo = showBrandInfo;

		// 是否可以修改
		$scope.canUpdate = false;
		// 更新状态
		$scope.updateState = false;
		$scope.enQualificationBuckup = null;
		$scope.brandsBuckup = null;
		$scope.audit = audit;
		$scope.auditUnpass = auditUnpass;
		$scope.changeToUpdate = changeToUpdate;
		$scope.saveUpdate = saveUpdate;
		$scope.isPdf = isPdf;
		$scope.createShowUrl = createShowUrl;


		activate();

		//------------------------------------------------- Method

		/**
		 * 切换公司资质类型时，清除数据
		 */
		function clearData(type) {
			if (type === 'MAINLAND') {
				$scope.enQualification = { status: '正常'};
			}
			if (type === 'HK') {
				$scope.enQualification = { status: '正常'};
			}
		}

		/**
		 * 根据品牌UUID查询品牌信息
		 *
		 * @param brandUuid		品牌UUID
		 */
		function findBrandByUuid(brandUuid) {
			var deffer = $q.defer();
			BrandActiveAPI.getBrand({uuid: brandUuid}, function (result) {
				deffer.resolve(result);
			}, function (error) {
				deffer.reject(error);
			});
			return deffer.promise;
		}

		/**
		 * 提交审核后的申请信息到后台
		 *
		 * @param isPass			是否通过审核
		 * @param apply				请求传递数据
		 */
		function handlerApply(isPass, apply) {
			var status = 'UNPASS';
			if (isPass) {
				status = 'PASS';
			}
			var param = {
				uuid : $scope.application.uuid,
				status : status
			};
			var deffer = $q.defer();
			StoreInfo.handlerApply(param, apply || null, function (data) {
				deffer.resolve(data);
			}, function (error) {
				deffer.reject(error);
			});
			return deffer.promise;
		}

		/**
		 * 保存店铺申请信息
		 *
		 * @param apply		待保存店铺申请信息
		 */
		function saveUpdateOfApply(apply) {
			var param = {
				uuid : $scope.application.uuid
			};
			var deffer = $q.defer();
			StoreInfo.saveUpdateOfApply(param, apply || null, function (data) {
				deffer.resolve(data);
			}, function (error) {
				deffer.reject(error);
			});
			return deffer.promise;
		}

		/**
		 * 打开审核不通过原因模态框
		 */
		function openReasonModal() {
			return $modal.open({
				templateUrl: 'static/view/admin/modal/application_unpass_reason.html',
				controller: 'unpassReasonController',
				size : 'lg'
			}).result;
		}

		//------------------------------------------------- 初始化操作

		/**
		 * 初始化数据获取
		 */
		function activate() {
			var applyUuid = $stateParams.applyUuid;
			if (!applyUuid) {
				toaster.pop('error', '店铺申请编号UUID不能为空');
				return ;
			}
			StoreInfo.findApplyByUuid({uuid : applyUuid}, {}, function (apply) {
				$scope.application = apply || {};
				//初始化时备份一遍数据

				var qualifications = apply.qualifications || [];
				$scope.brands = apply.brands || [];
				$scope.brandsBackup = angular.copy($scope.brands);

				// 处理店铺资质信息
				angular.forEach(qualifications, function (qualification) {
					if (qualification.type === $scope.qType.taxPayer || qualification.type === $scope.qType.taxRegistration
						|| qualification.type === $scope.qType.businessLicense) {
						$scope.qualifications[qualification.type] = qualification;
					}
				});

				// 处理店铺的品牌信息
				if ($scope.brands && $scope.brands.length > 0) {
					var promises = new Array($scope.brands.length);
					for (var i = 0; i < $scope.brands.length; i++) {
						promises[i] = findBrandByUuid($scope.brands[i].brandUuid);
					}

					$q.all(promises).then(function (result) {
						for (var i = 0; i < result.length; i++) {
							$scope.brands[i].logoUrl = result[i].logoUrl;
							$scope.brands[i].nameCn = result[i].nameCn;
							$scope.brands[i].nameEn = result[i].nameEn;
							$scope.brands[i].website = result[i].url;
							// 初始化品牌证明文件
							if ($scope.application.type === 'ORIGINAL_FACTORY') {
								$scope.brands[i].certificate = '大陆商标注册证';
                                if ($scope.brands[i].status =='' || !$scope.brands[i].status) {
                                    $scope.brands[i].status = '正常';
                                }
							}
							if ($scope.application.type === 'AGENCY') {
								$scope.brands[i].certificate = '代理证明书';
                                if ($scope.brands[i].authorizedStatus =='' || !$scope.brands[i].authorizedStatus) {
                                    $scope.brands[i].authorizedStatus = '正常';
                                }
							}
						}
					})['catch'](function () {
						$scope.brands = [];
					});
				}

				if ($scope.application.status === 'PASS' || $scope.application.status === 'UNPASS') {
					// 设置编辑状态
					$scope.canUpdate = true;

					// 设置公司资质信息
					$scope.tab = $scope.application.enType;
					$scope.enQualification = JSON.parse($scope.application.enQualification);
					$scope.enQualificationBackup = angular.copy($scope.enQualification);
				}
			}, function () {
				toaster.pop('error', '获取店铺申请信息失败');
			});
		}

		//------------------------------------------------- 交互操作

		/**
		 * 切换资质类型
		 *
		 * @param tab		资质类型
		 */
		function switchTab(tab) {
			$scope.tab = tab;
			clearData(tab);
		}

		/**
		 * 预览资质图片
		 *
		 * @param qualification		资质信息
		 * @param isShow			是否展示资质信息
		 */
		function showQualification(qualification, isShow) {
			qualification.isShow = isShow;
		}

		/**
		 * 预览品牌图片信息
		 *
		 * @param brand			品牌信息
		 * @param isShow		是否展示品牌信息
		 */
		function showBrandInfo(brand, isShow) {
			brand.isShow = isShow;
		}

		/**
		 * 验证企业信息
		 */
		function validateEnQualification() {
			console.log('验证企业信息-' + $scope.tab);

			var props = ['name', 'type', 'address', 'representative', 'creditCode', 'capital', 'setUpDate', 'businessScope', 'status'];
			if ($scope.tab === 'HK') {
				props = ['name', 'address', 'businessNature', 'legalStatus', 'effectiveDate', 'expiryDate', 'status'];
			}
			var flag = true;
			angular.forEach(props, function (prop) {
				if ($scope.enQualification.hasOwnProperty(prop)) {
					if (!$scope.enQualification[prop] || $scope.enQualification[prop] === '') {
						console.log(prop + '不能为空');
						// TODO 记录验证信息
						flag = false;
					}
				} else {
					console.log(prop + '不能为空');
					flag = false;
				}
			});
			if ($scope.enQualification['status'] === '其他' && (!$scope.enQualification['reason'] || $scope.enQualification['reason'] === '')) {
				flag = false;
			}
			return flag;
		}

		/**
		 * 验证单个品牌信息
		 *
		 * @param brand			品牌信息
		 */
		function validateBrand(brand) {
			if (!brand) return false;
			if ($scope.application.type ==='ORIGINAL_FACTORY') {
				var props = ['certificate', 'status', 'registrant', 'number', 'address', 'registrationDate', 'effectiveDate', 'approvalUnit'];

				var flag = true;
				angular.forEach(props, function (prop) {
					if (brand.hasOwnProperty(prop)) {
						if (!brand[prop] || brand[prop] === '') {
							console.log(prop + '不能为空');
							// TODO 记录验证信息
							flag = false;
						}
					} else {
						console.log(prop + '不能为空');
						flag = false;
					}
				});
				if (brand['status'] === '其他' && (!brand['reason'] || brand['reason'] === '')) {
					flag = false;
				}
			}

			if ($scope.application.type ==='AGENCY'){
				var props = ['authorizedDate', 'authorizedStatus', 'authorizedFrom'];

				var flag = true;
				angular.forEach(props, function (prop) {
					if (brand.hasOwnProperty(prop)) {
						if (!brand[prop] || brand[prop] === '') {
							console.log(prop + '不能为空');
							// TODO 记录验证信息
							flag = false;
						}
					} else {
						console.log(prop + '不能为空');
						flag = false;
					}
				});
				if (brand['authorizedStatus'] === '其他' && (!brand['authorizedReason'] || brand['authorizedReason'] === '')) {
					flag = false;
				}
			}
			return flag;
		}

		/**
		 * 验证品牌信息
		 */
		function validateBrands() {
			console.log('验证品牌信息');
			var flag = true;
			for (var i = 0; i < $scope.brands.length; i++) {
				if (!validateBrand($scope.brands[i])) {
					flag = false;
				}
			}
			return flag;
		}

		/**
		 * 审核店铺申请信息
		 *
		 * @param isPass		是否通过审核
		 */
		function audit(isPass) {

			// 如果审核通过，验证企业信息
			if (isPass) {
				var qualificationFlag = validateEnQualification();
				var brandsFlag = validateBrands();
				if (!qualificationFlag || !brandsFlag) {
					toaster.pop('error', '请补充完信息后再次提交');
					return ;
				}
			} else {
				if (!$scope.reason || $scope.reason === '') {
					toaster.pop('error', '请填写不通过原因在提交');
					return ;
				}
			}

			var apply = {};
			apply.enType = $scope.tab;
			apply.enQualification = $scope.enQualification;
			apply.brands = $scope.brands || null;
			apply.reason = $scope.reason;

			handlerApply(isPass, apply).then(function (data) {
				if (data.success) {
					toaster.pop('success', "审核完成");
					$scope.updateState = false;
					activate();
				} else {
					toaster.pop('error', data.message);
				}
			})['catch'](function (error) {
				console.log(error);
				toaster.pop('error', '审核操作失败');
			});
		}

		/**
		 * 审核未通过开铺申请
		 */
		function auditUnpass() {
			openReasonModal().then(function (reason) {
				$scope.reason = reason;
				$scope.audit(false);
			}, function (error) {
				console.log(error);
			});
		}

		/**
		 * 变更到更新状态
		 */
		function changeToUpdate(isUpdate) {
			$scope.updateState = isUpdate;
			if ($scope.updateState == false){
				$scope.enQualification = angular.copy($scope.enQualificationBackup);
				$scope.brands = angular.copy($scope.brandsBackup);
			}
		}

		/**
		 * 保存店铺申请信息
		 */
		function saveUpdate() {
			// 先检查信息是否为空
			var qualificationFlag = validateEnQualification();
			var brandsFlag = validateBrands();
			if (!qualificationFlag || !brandsFlag) {
				toaster.pop('error', '请补充完信息后再次提交');
				return ;
			}

			var apply = {};
			apply.enType = $scope.tab;
			apply.enQualification = $scope.enQualification;
			apply.brands = $scope.brands || null;

			if (apply.enQualification.status !=='其他'){
				apply.enQualification.reason = '' ;
			}
			angular.forEach(apply.brands, function (brand) {
				if (brand.status !=='其他'){
					brand.reason = '';
				}
				if (brand.authorizedStatus !=='其他'){
					brand.authorizedReason = '';
				}
			});

			saveUpdateOfApply(apply).then(function (data) {
				if (data.success) {
					toaster.pop('success', "保存修改完成");
					angular.copy($scope.enQualificationBackup,$scope.enQualification);
					angular.copy($scope.brandsBackup,$scope.brands);
					$scope.updateState = false;
					activate();
				} else {
					toaster.pop('error', data.message);
				}
			})['catch'](function (error) {
				console.log(error);
				toaster.pop('error', '修改操作失败');
			});
		}

		/**
		 * 根据path文件名来判断文件是否是PDF文件
		 *
		 * @param path		文件名称
		 */
		function isPdf(path) {
			if(path) {
				var str = path.slice(path.lastIndexOf('.')).toLowerCase();
				return str === '.pdf';
			}
			return false;
		}

		/**
		 * 根据文件的URL生成预览文件URL
		 *
		 * @param url	文件URL
		 */
		function createShowUrl(url) {
			return isPdf(url) ? 'static/img/vendor/store/timg.png' : url;
		}

	}]);

	app.register.controller('unpassReasonController', ['$scope', '$modalInstance', 'toaster', function ($scope, $modalInstance, toaster) {
		$scope.saveReason = saveReason;
		$scope.dismiss = dismiss;
		$scope.reason = null;

		/**
		 * 保存不通过原因
		 */
		function saveReason() {
			if (!$scope.reason || $scope.reason === '') {
				toaster.pop('error', '请填写审核不通过原因');
				return ;
			}
			$modalInstance.close($scope.reason);
		}

		/**
		 * 关闭模态框
		 */
		function dismiss() {
			$modalInstance.dismiss();
		}
	}]);
});
