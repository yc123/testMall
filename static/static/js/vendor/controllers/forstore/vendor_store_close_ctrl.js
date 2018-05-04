define(['app/app'], function (app) {
    "use strict";
    app.register.controller('vendorStoreColseCtrl', ['$scope', '$rootScope', 'StoreViolations', 'StoreInfo', '$modal', 'toaster', '$timeout', '$state', function($scope, $rootScope, StoreViolations, StoreInfo, $modal, toaster, $timeout, $state) {
        $rootScope.active = "vendor_store";

        $scope.showComplaintArea = false;

		$scope.showImg = showImg;
        // 卖家申述信息
        $scope.complaint = {};
        $scope.complaint.complaintProof = [];

        $scope.clickShowComplaintArea = clickShowComplaintArea;

		$scope.onUploadProof = onUploadProof;
		$scope.deleteProofInfo = deleteProofInfo;

        $scope.submitComplaintInfo = submitComplaintInfo;

        active();

		/**
		 * 初始化
		 */
		function active() {
			$rootScope.storePromise.then(function (store) {
				StoreViolations.showViolationsWhenSellerReadNotification({storeUuid: store.uuid}, {}, function (result) {
					if (result.success && result.data && result.data.id) {
						$scope.violations = result.data;

						// 初始化用户的申述证明信息
						for (var i = 0; i < 5; i++) {
							$scope.complaint.complaintProof.push({createTime: new Date()});
						}
					} else if (result.success && (!result.data || !result.data.id)) {
						toaster.pop('warning', '当前店铺没有处于违规关店处置中');
						$state.go('vendor_index');
					} else if (!result.success) {
						toaster.pop('warning', result.message);
						$state.go('vendor_index');
					}
				}, function (error) {
					console.log(error);
					$state.go('vendor_index');
				});
			}, function (error) {
				console.log(error);
				$state.go('vendor_index');
			});

		}

		/**
		 * 显示申述提交区域
		 */
		function clickShowComplaintArea() {
			if ($scope.showComplaintArea) {
				$scope.complaint = {};
				$scope.complaint.complaintProof = [];

				// 初始化用户的申述证明信息
				for (var i = 0; i < 5; i++) {
					$scope.complaint.complaintProof.push({createTime: new Date()});
				}
			}
			$scope.showComplaintArea = !$scope.showComplaintArea;
		}

		/**
		 * 上传申述证明信息
		 *
		 * @param $data		证明图片上传信息，包含URL
		 * @param index		序号
		 */
		function onUploadProof($data, index) {
			if (!$scope.complaint.complaintProof) {
				$scope.complaint.complaintProof = [];
			}
			if (!$data || !$data.path) {
				toaster.pop('error', '资质信息上传失败');
				return ;
			}
			$scope.complaint.complaintProof[index] = {createTime: new Date(), url: $data.path};
		}

		/**
		 * 删除上传的申述证明图片
		 *
		 * @param index		序号
		 */
		function deleteProofInfo(index) {
			if (!$scope.complaint.complaintProof) {
				$scope.complaint.complaintProof = [];
			}
			if ($scope.complaint.complaintProof[index]) {
				delete $scope.complaint.complaintProof[index].url;
			}
		}

		/**
		 * 提交卖家的申述信息
		 */
		function submitComplaintInfo() {
			// 验证卖家待提交申述信息
			if (!$scope.complaint.complaintInfo || $scope.complaint.complaintInfo === '') {
				toaster.pop('error', '申述说明信息不能为空');
				return 0;
			}

			// 处理卖家待申述信息，去掉没有上传的证明信息
			if ($scope.complaint.complaintProof && $scope.complaint.complaintProof.length > 0) {
				$scope.violations.complaintProof = $scope.complaint.complaintProof.filter(function (proof) {
					return proof && proof.url && proof.url !== '';
				});
			}

			// 设置卖家申述信息到违规处理记录中
			$scope.violations.complaintInfo = $scope.complaint.complaintInfo;

			StoreViolations.launchComplaintWhenSellerDisagree({}, $scope.violations, function (result) {
				if (result.success) {
					$scope.violations = result.data;
					toaster.pop('success', '提交申述信息成功，请耐心等待！');
				} else {
					$scope.complaint = {};
					// toaster.pop('error', result.message);
					window.location.reload();
				}
			}, function (error) {
				console.log(error);
				$scope.complaint = {};
				toaster.pop('error', '提交申述信息出错，请重新提交！');
			});
		}
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
    }]);

});
