define(['app/app'], function (app) {
	"use strict";
	app.register.controller('vendorStoreMaintainCtrl', ['$scope', '$rootScope', 'Enterprise', 'StoreInfo', '$modal', 'toaster', '$timeout', '$state', 'RecommendProductService', function($scope, $rootScope, Enterprise, StoreInfo, $modal, toaster, $timeout, $state, RecommendProductService) {
		$rootScope.active = "vendor_store";
		document.title = '我的店铺-优软商城';
		// 编辑状态
		$scope.editBasicInfo = false;
		$scope.editQualifications = false;
		$scope.editStoreImage = false;
		$scope.templates = [];

		//防误删
		$scope.showDeleteTip = false;
		$scope.closeDeleteTip = closeDeleteTip;

		var accessTemplates = function () {
			var array = ['http://dfs.ubtob.com/group1/M00/19/BF/CgpkyFlSBPOAQSaeAAGHE8mW2UI141.jpg'
				, 'http://dfs.ubtob.com/group1/M00/19/BF/CgpkyFlSBRmAcascAANK5vkByag940.jpg'
				, 'http://dfs.ubtob.com/group1/M00/19/BF/CgpkyFlSBTiASYTmAAIzYFtGUtY725.jpg'];
			for (var i = 0; i < array.length; i++) {
				var template = {};
				template.url = array[i];
				$scope.templates.push(template);
			}
		};


		$scope.showImg = showImg;

		/**
		 * 初始化操作
		 */
		$scope.initial = function () {
			accessTemplates();
			StoreInfo.existStore({}, {}, function (store) {

				$rootScope.store = store && store.uuid ? store : null;

				console.log(store);

				// 如果店铺信息还没有生成，跳转到相应的申请页面
				if (!$rootScope.store) {
					var message = '还未申请开铺，请先进行申请开铺';
					var pageUrl = 'vendor_store_apply';
					if ($rootScope.applyStatus == 'PREPARE') {
						message = '请耐心等待开铺审核';
						pageUrl = 'vendor_store_wait';
					} else if ($rootScope.applyStatus == 'PASS') {
						message = '店铺信息还未生成，请确认';
						pageUrl = 'vendor_store_info';
					}
					toaster.pop('info', message);
					$timeout(function () {
						$state.go(pageUrl);
					}, 1000);
				} else {
					updateStoreInfo();

					// 获取产品推荐信息
					loadProducts($scope.storeInfo.uuid);
				}
			});
		};
		$scope.initial();

		/**
		 * 更新店铺信息
		 */
		var qulifications = [];
		var updateStoreInfo = function () {
			$scope.storeInfo = $rootScope.store;
			console.log($scope.storeInfo);
			$scope.enterprise = $scope.storeInfo.enterprise || null;
			$scope.sampleStore = {};
			$scope.sampleStore.storeShortName = $scope.storeInfo.storeShortName;
            $scope.sampleStore.storeName = $scope.storeInfo.storeName;
			$scope.sampleStore.description = $scope.storeInfo.description;
			$scope.sampleStore.enterprise = angular.copy($scope.storeInfo.enterprise);
			$scope.sampleStore.enterprise.address = $scope.sampleStore.enterprise.address || $scope.storeInfo.enterprise.enAddress;
			qulifications = angular.copy($scope.storeInfo.qualifications);
			$scope.sampleStore.qualifications = qulifications.filter(function (qualification) {
				return qualification && qualification.type == 'APTITUDE';
			});
			$scope.sampleStore.logoUrl = $scope.storeInfo.logoUrl;
			$scope.sampleStore.bannerUrl = $scope.storeInfo.bannerUrl;
			angular.forEach($scope.sampleStore.qualifications, function (v, k) {
				v.isPdf = isPdf(v.resourceUrl);
			})
		};

		/**
		 * 获取产品推荐信息
		 */
		function loadProducts(storeUuid) {
			RecommendProductService.findProductsWhenUserVisitStore(storeUuid).then(function (products) {
				$scope.recommendProducts = products;
				$scope.backupProducts = angular.copy(products);
				// TODO print
				console.log($scope.recommendProducts);
			}, function (error) {
				console.log(error);
				$scope.recommendProducts = [];
				$scope.backupProducts = [];
			});
			
		}

		//------------------------------------------------- 编辑操作

		/**
		 * 修改具体模块的编辑区域的状态
		 *
		 * @param module		模板名称
		 * @param status		编辑区域的状态
		 */
		var changeEditStatus = function (module, status) {
			if (module == 'BASIC_INFO') {
				$scope.editBasicInfo = status;
				return ;
			}
			if (module == 'QUALIFICATIONS') {
				$scope.editQualifications = status;
				return ;
			}
			if (module == 'STORE_IMAGE') {
				$scope.editStoreImage = status;
				return ;
			}
			return false;
		};

		/**
		 * 展开具体模块的编辑区域
		 *
		 * @param module	模块名称
		 */
		$scope.showEdit = function (module) {
			changeEditStatus(module, true);
		};

		/**
		 * 关闭具体模块的编辑区域
		 *
		 * @param module	模块名称
		 */
		$scope.closeEdit = function (module) {
			changeEditStatus(module, false);
		};

		//------------------------------------------------- 撤销和保存

		/**
		 * 撤销修改
		 *
		 * @param module	模块名称
		 */
		$scope.undoModify = function (module) {
			if (module == 'BASIC_INFO') {
				$scope.sampleStore.storeShortName = $scope.storeInfo.storeShortName;
                $scope.sampleStore.storeName = $scope.storeInfo.storeName;
				$scope.sampleStore.description = $scope.storeInfo.description;
				$scope.sampleStore.enterprise = angular.copy($scope.storeInfo.enterprise);
				$scope.sampleStore.enterprise.address = $scope.sampleStore.enterprise.address || $scope.storeInfo.enterprise.enAddress;
				return $scope.closeEdit(module);
			}
			if (module == 'QUALIFICATIONS') {
				qulifications = angular.copy($scope.storeInfo.qualifications);
				$scope.sampleStore.qualifications = qulifications.filter(function (qualification) {
					return qualification && qualification.type == 'APTITUDE';
				});
				angular.forEach($scope.sampleStore.qualifications, function (qualification) {
					qualification.isPdf = isPdf(qualification.resourceUrl);
				});
				return $scope.closeEdit(module);
			}
			if (module == 'STORE_IMAGE') {
				$scope.sampleStore.logoUrl = $scope.storeInfo.logoUrl;
				$scope.sampleStore.bannerUrl = $scope.storeInfo.bannerUrl;
				return $scope.closeEdit(module);
			}
			return false;
		};

		/**
		 * 保存修改后的店铺信息
		 *
		 * @param store        	修改后的店铺信息
		 * @param module		模块名称
		 */
		var saveChanges = function (store, module) {

			StoreInfo.updateStoreInfo({uuid : $scope.storeInfo.uuid, kind : module}, store, function (result) {
				console.log('result', result);
				if (result.success) {
					$rootScope.store = result.data;
					updateStoreInfo();
					toaster.pop('success', '保存成功');
				} else {
					toaster.pop('error', result.message);
				}
				$scope.closeEdit(module);
			}, function (resp) {
				toaster.pop('error', resp);
				$scope.undoModify(module);
			});
		};

		/**
		 * 验证修改的基础信息
		 */
		var validateBasicInfo = function () {
			if (!$scope.sampleStore) {
				toaster.pop('error', '店铺信息不能为空');
				return false;
			}
			if (!$scope.sampleStore.description || $scope.sampleStore.description == '') {
				toaster.pop('error', '店铺简介信息不能为空');
				return false;
			}
			if (!$scope.sampleStore.enterprise) {
				toaster.pop('error', '企业信息不能为空');
				return false;
			}
			if (!$scope.sampleStore.enterprise.enUrl || $scope.sampleStore.enterprise.enUrl == '') {
				toaster.pop('error', '企业官网地址不能为空');
				return false;
			}
			if (!$scope.sampleStore.enterprise.address || $scope.sampleStore.enterprise.address == '') {
				toaster.pop('error', '企业地址不能为空');
				return false;
			}
			if (!$scope.sampleStore.enterprise.enTel || $scope.sampleStore.enterprise.enTel == '') {
				toaster.pop('error', '请输入正确的电话号码');
				return false;
			}
			if (!$scope.sampleStore.enterprise.enFax || $scope.sampleStore.enterprise.enFax == '') {
				toaster.pop('error', '请输入正确的企业传真');
				return false;
			}
			var store = {};
			store.storeShortName = $scope.sampleStore.storeShortName;
            store.storeName = $scope.sampleStore.storeName;
			store.description = $scope.sampleStore.description;
			store.enterprise = angular.copy($scope.sampleStore.enterprise);
			saveChanges(store, 'BASIC_INFO');
		};

		/**
		 * 验证修改的资质信息
		 */
		var validateQualifications = function () {
			if (!$scope.sampleStore) {
				toaster.pop('error', '店铺信息不能为空');
				return false;
			}
			// 去除数组中不存在的资质信息
			$scope.sampleStore.qualifications = $scope.sampleStore.qualifications.filter(function (qualification) {
				return qualification;
			});
			var store = {};
			store.qualifications = angular.copy($scope.sampleStore.qualifications);
			saveChanges(store, 'QUALIFICATIONS');
		};

		/**
		 * 验证修改的店铺图片信息
		 */
		var validateStoreImage = function () {
			if (!$scope.sampleStore) {
				toaster.pop('error', '店铺信息不能为空');
				return false;
			}
			if (!$scope.sampleStore.logoUrl || $scope.sampleStore.logoUrl == '') {
				toaster.pop('error', '店铺LOGO不能为空');
				return ;
			}
			if (!$scope.sampleStore.bannerUrl || $scope.sampleStore.bannerUrl == '') {
				toaster.pop('error', '店铺横幅广告不能为空');
				return ;
			}
			var store = {};
			store.logoUrl = $scope.sampleStore.logoUrl;
			store.bannerUrl = $scope.sampleStore.bannerUrl;
			saveChanges(store, 'STORE_IMAGE');
		};

		/**
		 * 保存某一个模块修改后的信息
		 *
		 * @param module	模块名称
		 */
		$scope.saveModify = function (module) {
			if (module == 'BASIC_INFO') {
				return validateBasicInfo();
			}
			if (module == 'QUALIFICATIONS') {
				return validateQualifications();
			}
			if (module == 'STORE_IMAGE') {
				return validateStoreImage();
			}
			return false;
		};

		//------------------------------------------------- 图片上传操作

		/**
		 * 上传资质信息
		 */
		$scope.onUploadQualification = function ($data, index) {
			console.log($data);
			if (!$scope.qualifications) {
				$scope.qualifications = {};
			}
			if (!$data || !$data.path) {
				toaster.pop('error', '资质信息上传失败');
				return ;
			}
			if (!$scope.sampleStore.qualifications[index]) {
				$scope.sampleStore.qualifications[index] = generateQualification($data.path, 'APTITUDE');
			} else {
				$scope.sampleStore.qualifications[index].resourceUrl = $data.path;
				console.log($scope.sampleStore.qualifications[index].resourceUrl);
				$scope.sampleStore.qualifications[index].isPdf = isPdf($data.path);
			}
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
			};
		};

		/**
		 * 上传店铺LOGO
		 */
		$scope.onUploadLogo = function ($data) {
			if (!$data || !$data.path) {
				toaster.pop('error', '店铺LOGO上传失败');
				return ;
			}
			$scope.sampleStore.logoUrl = $data.path;
		};

		/**
		 * 上传店铺广告图片
		 */
		$scope.onUploadBanner = function ($data) {
			if (!$data || !$data.path) {
				toaster.pop('error', '店铺广告图片上传失败');
				return ;
			}
			$scope.sampleStore.bannerUrl = $data.path;
		};
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
			$scope.sampleStore.bannerUrl = $scope.temporaryTemplate.url;
			$scope.showTemplate(false);
		};

		/**
		 * 确认开店
		 */
		$scope.confirmApplication = function () {
			console.log($scope.sampleStore);
			console.log($scope.storeInfo);

		};

		//------------------------------------------------- 编辑店铺信息

		/**
		 * 查看大图
		 *
		 * @param imgUrl		图片链接
		 */
		function showImg(imgUrl) {
			var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		}

		$scope.selectedIndex = null;
		$scope.showDeleteTipDialog = function (index) {
			if (index == null) return ;
			$scope.showDeleteTip = true;
			$scope.selectedIndex = index;
		};

		// 删除图片
		$scope.deleteImg = function (index) {
			$scope.closeDeleteTip();
			if (!$scope.sampleStore.qualifications[index]) {
				$scope.sampleStore.qualifications[index] = generateQualification(null, 'APTITUDE');
			} else {
				delete $scope.sampleStore.qualifications[index].resourceUrl;
				delete $scope.sampleStore.qualifications[index].isPdf;
			}
		};

		/**
		 * 删除店铺LOGO
		 */
		$scope.deleteLogo = function () {
			delete $scope.sampleStore.logoUrl;
		};

		/**
		 * 删除店铺广告图片
		 */
		$scope.deleteBanner = function () {
			delete $scope.sampleStore.bannerUrl;
		};

		/**
		 * 关闭资质图片防误删提示框
		 */
		function closeDeleteTip() {
			$scope.showDeleteTip = false;
			delete $scope.selectedIndex;
		}

		//------------------------------------------------- 编辑产品推荐

		$scope.canBatchOperation = false;
		$scope.canEditProduct = false;

		$scope.editRecommendProduct = editRecommendProduct;
		$scope.cancleProductEdit = cancleProductEdit;

		function editRecommendProduct(module, status) {
			if (module == 'BATCH_OPERATION') {
				$scope.canBatchOperation = status;
				return ;
			}
			if (module == 'EDIT_PRODUCTS') {
				$scope.canEditProduct = status;

				// 扩充products
				console.log(10 - $scope.recommendProducts.length);
				for (var i = $scope.recommendProducts.length; i < 10; i++) {
					$scope.recommendProducts[i] = { exist: false, order: i + 1 };
				}
				console.log($scope.recommendProducts.length);
				return ;
			}
			return false;
		}

		function cancleProductEdit(module) {
			if (module == 'BATCH_OPERATION') {
				$scope.canBatchOperation = false;
				$scope.isChooseAll = false;
				$scope.recommendProducts = angular.copy($scope.backupProducts);
				return ;
			}
			if (module == 'EDIT_PRODUCTS') {
				$scope.canEditProduct = false;
				$scope.recommendProducts = angular.copy($scope.backupProducts);
				return ;
			}
			return false;
		}

		//------------------------------------------------- 产品推荐批量操作(删除)

		$scope.isChooseAll = false;
		$scope.chooseProduct = chooseProduct;
		$scope.chooseAllProduct = chooseAllProduct;

		/**
		 * 选中推荐的产品
		 */
		function chooseProduct(product) {
			if (product.isSelect) {
				delete product.isSelect;
			} else {
				product.isSelect = true;
			}

			// 如果选中的数量为推荐产品数量，则设置为全选，否取消全选设置状态
			var count = 0;
			angular.forEach($scope.recommendProducts, function (product) {
				if (product.isSelect) {
					count ++;
				}
			});
			if (count == $scope.recommendProducts.length) {
				$scope.isChooseAll = true;
			} else {
				$scope.isChooseAll = false;
			}
		}

		function chooseAllProduct(isSelectAll) {
			$scope.isChooseAll = isSelectAll;
			angular.forEach($scope.recommendProducts, function (product) {
				product.isSelect = isSelectAll;
			});
		}

		function getSelectedProducts() {
			return $scope.recommendProducts.filter(function (product) {
				return product.isSelect;
			})
		}

		//------------------------------------------------- 产品推荐批量操作(删除)防误操作
		$scope.showDeleteProductTip = false;
		$scope.showDeleteProductTipDialog = showDeleteProductTipDialog;
		$scope.cancelDeleteProduct = cancelDeleteProduct;
		$scope.deleteProduct = deleteProduct;
		$scope.saveProducts = saveProducts;

		function showDeleteProductTipDialog() {
			if (!$scope.showDeleteProductTip && (!getSelectedProducts() || getSelectedProducts().length == 0)) {
				toaster.pop('warning', '请选择需要删除的产品');
				return ;
			}
			$scope.showDeleteProductTip = !$scope.showDeleteProductTip;
		}

		function cancelDeleteProduct() {
			$scope.showDeleteProductTip = false;
			$scope.cancleProductEdit('BATCH_OPERATION');
		}
		
		function deleteProduct() {
			$scope.recommendProducts = $scope.recommendProducts.filter(function (product) {
				return !product.isSelect;
			});
			$scope.showDeleteProductTip = false;
			$scope.isChooseAll = false;
		}
		
		function saveProducts() {
			console.log($scope.storeInfo.uuid);
			RecommendProductService.saveProductsWhenSellerUpdate($scope.storeInfo.uuid, $scope.recommendProducts).then(function (products) {
				$scope.recommendProducts = products;
				$scope.backupProducts = angular.copy(products);
				cancleProductEdit('BATCH_OPERATION');
				toaster.pop('success', '保存成功');
			}, function (error) {
				console.log(error);
				$scope.recommendProducts = [];
				$scope.backupProducts = [];
			});
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
			}, function () {
				console.log('关闭模态框');
			});
		}

		function saveUploadProducts() {
			var products = $scope.recommendProducts.filter(function (product) {
				return product.exist;
			});
			console.log(products);
			RecommendProductService.saveProductsWhenSellerUpdate($scope.storeInfo.uuid, products).then(function (products) {
				$scope.recommendProducts = products;
				$scope.backupProducts = angular.copy(products);
				cancleProductEdit('EDIT_PRODUCTS');
				toaster.pop('success', '保存成功');
			}, function (error) {
				console.log(error);
				$scope.recommendProducts = [];
				$scope.backupProducts = [];
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
			$scope.showDeleteOneProductTip = true;
			$scope.selectedOneProductIndex = index;
		}

		//------------------------------------------------- 产品推荐防误删除操作

		$scope.selectedOneProductIndex = -1;
		$scope.showDeleteOneProductTip = false;
		$scope.cancelDeleteOneProduct = cancelDeleteOneProduct;
		$scope.confirmDeleteOneProduct = confirmDeleteOneProduct;

		function cancelDeleteOneProduct() {
			$scope.selectedOneProductIndex = -1;
			$scope.showDeleteOneProductTip = false;
		}

		function confirmDeleteOneProduct() {
			$scope.recommendProducts[$scope.selectedOneProductIndex] = { exist: false, order: $scope.selectedOneProductIndex + 1 };
			cancelDeleteOneProduct();
		}
	}]);

});
