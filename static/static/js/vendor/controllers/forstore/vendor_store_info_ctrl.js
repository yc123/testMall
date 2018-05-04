define(['app/app', 'jquery-uploadify'], function (app) {
	"use strict";
	app.register.controller('vendorStoreInfoCtrl', ['$scope', '$rootScope', 'Enterprise', 'StoreInfo', '$modal', 'toaster', '$timeout', '$state', 'RecommendProductService', function($scope, $rootScope, Enterprise, StoreInfo, $modal, toaster, $timeout, $state, RecommendProductService) {
		$rootScope.active = "vendor_store";

		/**
		 * 简单店铺申请信息
		 */
		$scope.applySampleInfo = {};
		/**
		 * 初始化模板信息
		 */
		$scope.templates = [];

		$scope.imageType = {
			LOGO: 'LOGO',
			BANNER: 'BANNER'
		};

		// 防误删除
		$scope.showDeleteTip = false;
		$scope.deleteImageType = '';
		$scope.deleteTypeName = '';
		$scope.openDeleteTip = openDeleteTip;
		$scope.closeDeleteTip = closeDeleteTip;
		$scope.deleteImage = deleteImage;

		$scope.recommendProducts = [];

		var accessTemplates = function () {
			var array = ['http://dfs.ubtob.com/group1/M00/19/BF/CgpkyFlSBPOAQSaeAAGHE8mW2UI141.jpg', 'http://dfs.ubtob.com/group1/M00/19/BF/CgpkyFlSBRmAcascAANK5vkByag940.jpg', 'http://dfs.ubtob.com/group1/M00/19/BF/CgpkyFlSBTiASYTmAAIzYFtGUtY725.jpg'];
			for (var i = 0; i < array.length; i++) {
				var template = {};
				template.url = array[i];
				$scope.templates.push(template);
			}
		};

		function createPlainProducts() {
			for (var i = 0; i < 10; i++) {
				$scope.recommendProducts.push({ exist: false, order: i + 1 });
			}
		}

		/**
		 * 初始化操作
		 */
		$scope.initial = function () {
			$scope.enterprise = $rootScope.applyInfo.enterprise || {};
			$scope.applySampleInfo.logoUrl = null;
			accessTemplates();
			createPlainProducts();
		};
		$scope.initial();

		//------------------------------------------------- 用户确认开铺

		/**
		 * 获取店铺简介和官网地址信息
		 *
		 * @param field		字段名称
		 * @param value		字段的值
		 */
		$scope.changeInfo = function (field, value) {
			if (!field) return ;
			if (field == 'DESCRIPTION') {
				$scope.applySampleInfo.description = value || null;
			}
			if (!$scope.applySampleInfo.enterprise) {
				$scope.applySampleInfo.enterprise = {};
			}
            if (field == 'STORESHORTNAME') {
                $scope.applySampleInfo.storeShortName = value || null;
            }
			if (field == 'EN_URL') {
				$scope.applySampleInfo.enterprise.enUrl = value || null;
			}
			if (field == 'EN_ADDRESS') {
				$scope.applySampleInfo.enterprise.address = value || null;
			}
			if (field == 'EN_TEL') {
				$scope.applySampleInfo.enterprise.enTel = value || null;
			}
			if (field == 'EN_FAX') {
				$scope.applySampleInfo.enterprise.enFax = value || null;
			}
			if (field == 'STORE_UUID') {
				$scope.applySampleInfo.storeUuid = value || null;
			}
		};

		/**
		 * 上传资质信息
		 */
		$scope.onUploadQualification = function ($data, index) {
			if (!$scope.qualifications) {
				$scope.qualifications = {};
			}
			if (!$data || !$data.path) {
				toaster.pop('error', '资质信息上传失败');
				return ;
			}
			$scope.qualifications[index] = generateQualification($data.path, 'APTITUDE');
			$scope.qualifications[index].isPdf = isPdf($data.path);
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
		 * 生成资质信息
		 *
		 * @param resourceUrl		证明文件URL
		 * @param type				资质类型
		 */
		var generateQualification = function (resourceUrl, type) {
			return {
				resourceUrl : resourceUrl,
				type : type
			}
		};

		/**
		 * 上传店铺LOGO
		 */
		$scope.onUploadLogo = function ($data) {
			if (!$data || !$data.path) {
				toaster.pop('error', '店铺LOGO上传失败');
				return ;
			}
			$scope.applySampleInfo.logoUrl = $data.path;
		};

		/**
		 * 上传店铺广告图片
		 */
		$scope.onUploadBanner = function ($data) {
			if (!$data || !$data.path) {
				toaster.pop('error', '店铺广告图片上传失败');
				return ;
			}
			$scope.applySampleInfo.bannerUrl = $data.path;
		};

		/**
		 * 删除已上传的LOGO 或 BANNER
		 *
		 * @param type		图片类型
		 */
		$scope.deleteLogoOrBanner = function (type) {
			if (type === $scope.imageType.LOGO) {
				delete $scope.applySampleInfo.logoUrl;
			}
			if (type === $scope.imageType.BANNER) {
				delete $scope.applySampleInfo.bannerUrl;
			}
		};

		$scope.isShowLogo = false;
		$scope.isShowBanner = false;

		/**
		 * 查看LOGO 或 BANNER
		 *
		 * @param type			图片类型
		 * @param url			上传图片的URL
		 * @param isShow		是否展示图片
		 */
		$scope.closeBanner = function () {
			$scope.isShowBanner = false;
		}
		$scope.previewLogoOrBanner = function (type, isShow) {
			if (type === $scope.imageType.LOGO) {
				$scope.isShowLogo = isShow;
			}
			if (type === $scope.imageType.BANNER) {
				$scope.isShowBanner = isShow;
			}
		};

		//------------------------------------------------- 模板操作

		$scope.isShowTemplate = false;
		$scope.temporaryTemplate = null;
		$scope.canChooseTempalte = true;

		/**
		 * 显示模板模态框
		 *
		 * @param isShow		是否显示模态框
		 */
		$scope.showTemplate = function (isShow) {
			$scope.isShowTemplate = isShow;
			if (!isShow) {
				$scope.temporaryTemplate = null;
			}
			console.log($scope.isShowTemplate);
		};

		/**
		 * 选择模板
		 *
		 * @param template		待选择模板
		 */
		$scope.chooseTemplate = function (template) {
			$scope.temporaryTemplate = template;
		};

		/**
		 * 保存选择模板
		 */
		$scope.saveChoose = function () {
			console.log($scope.temporaryTemplate);
			$scope.applySampleInfo.bannerUrl = $scope.temporaryTemplate.url;
			$scope.showTemplate(false);
		};

		/**
		 * 清除数据
		 */
		var clearData = function () {
			$scope.applySampleInfo = {};
		};

		var confirmOpenStore = function () {
			$scope.canChooseTempalte = false;
			StoreInfo.confirmOpenStore({ uuid : $rootScope.applyInfo.uuid}, $scope.applySampleInfo, function (result) {
				clearData();
				console.log(result);
				if (result.success && result.data) {
					console.log(result.data);
					toaster.pop("info", '确认开启店铺成功');
					//saveUploadProducts(result.data);

					$timeout(function () {
						window.location.href = $scope.rootPath + '/store/' + result.data;
					}, 2000);
				} else {
					toaster.pop('error', result.message);
					$timeout(function () {
						window.location.reload();
					}, 1000);
				}
			}, function () {
				clearData();
				toaster.pop('error', '确认操作失败');
				$timeout(function () {
					window.location.reload();
				}, 1000);
			});
		};

		/**
		 * 确认开店
		 */
		$scope.confirmApplication = function () {
			if (!$scope.applySampleInfo) {
				toaster.pop('error', '开铺申请信息不能为空');
				return ;
			}
			if (!$scope.applySampleInfo.description || $scope.applySampleInfo.description == '') {
				toaster.pop('error', '店铺简介信息不能为空');
				return ;
			}
			if (!$scope.applySampleInfo.enterprise || !$scope.applySampleInfo.enterprise.enUrl || $scope.applySampleInfo.enterprise.enUrl == '') {
				toaster.pop('error', '企业官网地址不能为空');
				return ;
			}
			if (!$scope.applySampleInfo.enterprise || !$scope.applySampleInfo.enterprise.address || $scope.applySampleInfo.enterprise.address == '') {
				toaster.pop('error', '地址信息不能为空');
				return ;
			}
			if (!$scope.applySampleInfo.enterprise || !$scope.applySampleInfo.enterprise.enTel || $scope.applySampleInfo.enterprise.enTel == '') {
				toaster.pop('error', '电话信息不能为空');
				return ;
			}
			if (!/(^(\d{3,4}-)\d{7,8})$|^((1[0-9][0-9]\d{8}$))/.test($scope.applySampleInfo.enterprise.enTel)) {
				toaster.pop('error', '电话格式必须为0755-26994749 或者 18806659999');
				return ;
			}
			if (!$scope.applySampleInfo.enterprise || !$scope.applySampleInfo.enterprise.enFax || $scope.applySampleInfo.enterprise.enFax == '') {
				toaster.pop('error', '传真信息不能为空');
				return ;
			}
			if (!/(^(\d{3,4}-)\d{7,8})$/.test($scope.applySampleInfo.enterprise.enFax)) {
				toaster.pop('error', '传真格式必须为0755-26994749');
				return ;
			}
			if (!$scope.applySampleInfo.logoUrl || $scope.applySampleInfo.logoUrl == '') {
				toaster.pop('error', '店铺LOGO不能为空');
				return ;
			}
			if (!$scope.applySampleInfo.bannerUrl || $scope.applySampleInfo.bannerUrl == '') {
				toaster.pop('error', '店铺横幅广告不能为空');
				return ;
			}
			$scope.applySampleInfo.qualifications = [];
			angular.forEach($scope.qualifications, function (qualification) {
				if (qualification) {
					$scope.applySampleInfo.qualifications.push(qualification);
				}
			});
			console.log($scope.applySampleInfo);
			if ($scope.applySampleInfo.storeUuid) {
				StoreInfo.findByUuid({ uuid: $scope.applySampleInfo.storeUuid}, function (result) {
					console.log(result);
					if (!result.uuid) {
						confirmOpenStore();
					} else {
						toaster.pop('error', '店铺英文缩写已存在');
					}
				}, function (error) {
					toaster.pop('error', '查询店铺英文缩写失败');
					console.log(error);
				});
			} else {
				confirmOpenStore();
			}
		};

		// 防误删除

		/**
		 * 展示防误删提示框
		 *
		 * @param type		删除图片类型
		 */
		function openDeleteTip(type) {
			if (type == $scope.imageType.LOGO) {
				$scope.showDeleteTip = true;
				$scope.deleteImageType = type;
				$scope.deleteTypeName = '店铺LOGO';
			}
			if (type == $scope.imageType.BANNER) {
				$scope.showDeleteTip = true;
				$scope.deleteImageType = type;
				$scope.deleteTypeName = '店铺广告图片';
			}
		}

		/**
		 * 关闭防误删除提示框
		 */
		function closeDeleteTip() {
			$scope.showDeleteTip = false;
			$scope.deleteImageType = '';
			$scope.deleteTypeName = '';
		}

		/**
		 * 确认删除图片
		 *
		 * @param type		删除图片类型
		 */
		function deleteImage(type) {
			$scope.deleteLogoOrBanner(type);
			$scope.closeDeleteTip();
		}

		//------------------------------------------------- 产品推荐编辑操作

		$scope.chooseRecommendProduct = chooseRecommendProduct;
		$scope.saveUploadProducts = saveUploadProducts;
		$scope.moveRecommendProduct = moveRecommendProduct;
		$scope.deleteProductWhenEdit = deleteProductWhenEdit;

		/**
		 * 打开产品推荐模态框
		 *
		 * @param isBatch	是否批量操作
		 * @param product	待修改的单个产品信息
		 */
		function chooseRecommendProduct(isBatch, product) {
			var modalInstance = $modal.open({
				templateUrl: 'static/view/vendor/modal/recommend_product_modal.html',
				controller: 'RecommendProductController',
				size: 'sm',
				resolve: {
					isBatch: function () {
						return isBatch;
					},
					product: function () {
						return isBatch ? null : angular.copy(product);
					},
					products: function () {
						return angular.copy($scope.recommendProducts);
					}
				}
			});

			modalInstance.result.then(function (products) {
				angular.forEach(products, function (product) {
					$scope.recommendProducts[product.order - 1] = product;
				});
			}, function (reason) {
				console.log(reason);
			});
		}

		function saveUploadProducts(uuid) {
			var products = $scope.recommendProducts.filter(function (product) {
				return product.exist;
			});
			console.log(products);
			RecommendProductService.saveProductsWhenSellerUpdate(uuid, products).then(function (products) {
				$scope.recommendProducts = products;
				toaster.pop('success', '保存成功');
			}, function (error) {
				console.log(error);
				$scope.recommendProducts = [];
			});
		}

		function moveRecommendProduct(index, toIndex) {
			if (toIndex == null || toIndex < 0 || toIndex > 9) return ;

			// 更新排序
			$scope.recommendProducts[index].order = toIndex + 1;
			$scope.recommendProducts[toIndex].order = index + 1;

			// 交换对象
			var tmp = angular.copy($scope.recommendProducts[index]);
			$scope.recommendProducts[index] = angular.copy($scope.recommendProducts[toIndex]);
			$scope.recommendProducts[toIndex] = angular.copy(tmp);

			console.log($scope.recommendProducts);
		}

		function deleteProductWhenEdit(index) {
			$scope.recommendProducts[index] = { exist: false, order: index + 1 };
		}

	}]);

});
