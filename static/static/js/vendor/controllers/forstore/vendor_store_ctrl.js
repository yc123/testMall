/**
 * Created by yujia on 2017/3/24.
 *  我的店铺的控制器
 */
define(['app/app', 'jquery-summernote', 'jquery-uploadify'], function (app) {
	"use strict";
	app.register.controller('vendorStoreCtrl', ['$scope', '$rootScope', 'StoreInfo', '$modal', 'toaster', '$timeout', function($scope, $rootScope, StoreInfo, $modal, toaster, $timeout) {
		$rootScope.active = "vendor_store";

		$scope.store = {};

		/**
		 * 初始化数据
		 */
		$scope.initState = function () {
			StoreInfo.existStore({}, {}, function (store) {
				if (store && store.uuid) {
					toaster.pop("info", '已经开铺，请不要重复申请');
					$timeout(function () {
						window.location.href = $scope.rootPath + '/store/' + store.uuid;
					}, 2000);
					return ;
				}
				if (!$rootScope.isWaitingAuth) {
					toaster.pop('info', '贵司现在还没有开通，您可以立即开通店铺！');
				}
			});
		};
		$scope.initState();

		/**********************************************************************
		 * 提交申请操作
		 **********************************************************************/

		/**
		 * 提交开铺申请信息
		 */
		$scope.openStore = function () {
			if(!$scope.store.logoUrl) {
				toaster.pop('warning', '请上传店铺的LOGO');
			} else if (!$scope.store.bannerUrl) {
				toaster.pop('warning', '请上传店铺的横幅');
			} else if (!$scope.store.storeName) {
				toaster.pop('warning', '请填写店铺名称');
			} else if (!$scope.store.description) {
				toaster.pop('warning', '填写店铺的介绍');
			} else {
				StoreInfo.applyToOpenStore(null, $scope.store, function(data) {
					console.log(data);
					if (data.success) {
						toaster.pop('success', '店铺申请成功，请耐心等待审核');
						$timeout(function () {
							window.location.reload();
						}, 2000);
					} else if (data.code == 4) {
						toaster.pop("info", '已经开铺，请不要重复申请');
						$timeout(function () {
							window.location.href = $scope.rootPath + '/store/' + data.message;
						}, 2000);
					} else {
						toaster.pop('error', data.message);
					}
				});
			}
		};

		/**
		 * 上传店铺Logo图片
		 *
		 * @param data		Logo图片上传后信息
		 */
		$scope.onUploadLogo = function(data){
			$scope.$apply(function () {
				$scope.store.logoUrl = data.path;
			});
		};

		/**
		 * 上传店铺横幅Banner图片
		 *
		 * @param data		Banner图片上传后信息
		 */
		$scope.onUploadBanner = function (data) {
			$scope.$apply(function () {
				$scope.store.bannerUrl = data.path;
			});
		};

	}]);

});
