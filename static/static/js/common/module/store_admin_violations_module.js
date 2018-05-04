
define([ 'ngResource', 'common/query/storeViolations', 'ngTable', 'ngSanitize', 'common/query/storeInfo' ], function() {
	'use strict';
	var module = angular.module('StoreAdminViolationsModule', ['ngResource', 'StoreViolationsServices', 'ngTable', 'ngSanitize', 'storeInfoServices']);

	/**
	 * 店铺违规处理状态解析过滤器
	 */
	module.filter('violationsStatus', function(){
		return function(data) {
			if (data === 'EXECUTING') return '执行中';
			if (data === 'COMPLAINT') return '申述中';
			if (data === 'SUCCESS') return '申述成功';
			if (data === 'DONE') return '处置完成';
			return '处置完成';
		}
	});

	// 1、企业信息展示页面
	// 2、违规处理页面
	// 3、违规列表展示页面
	// 4、违规列表详情页面
	/**
	 * 企业信息记录
	 */
	module.controller('EnterpriseInfoCtrl', ['$scope', 'StoreInfo', 'toaster', 'ConsignmentAgreementRecord', 'StoreAdsInformation', 'ngTableParams', 'BaseService', function ($scope, StoreInfo, toaster, ConsignmentAgreementRecord, StoreAdsInformation, ngTableParams, BaseService) {
		console.log('EnterpriseInfoCtrl');

		$scope.showRecords = true;

		$scope.tagStoreWithTag = tagStoreWithTag;

		$scope.showImg = showImg;

		active();

		/**
		 * 初始化操作
		 */
		function active() {
			StoreInfo.findByUuid({ uuid: $scope.storeUuid }, {}, function (store) {
				if (store && store.uuid) {
					$scope.store = store;
					$scope.store.auditInfo = JSON.parse(store.enQualification || "{}");
					if (store.qualifications && store.qualifications.length > 0) {
						$scope.qualifications = store.qualifications.filter(function (qualification) {
							return qualification.type === 'APTITUDE' && qualification.resourceUrl && qualification.resourceUrl !== '';
						});
					}
					// 设置店铺推荐标签
					var tags = JSON.parse($scope.store.tags || '[]');
					$scope.store.tagsObject = {};
					for (var i = 0; i < tags.length; i++) {
						$scope.store.tagsObject[tags[i]] = true;
					}
					console.log($scope.store);
					loadRecords($scope.store.enUU);
				} else {
					toaster.pop('error', '获取店铺信息失败，请刷新页面');
				}
			}, function (error) {
				console.log(error);
				toaster.pop('error', '获取店铺信息失败，请刷新页面');
			})
		}

		/**
		 * 加载寄售协议操作记录
		 *
		 * @param enUU	企业UU
		 */
		function loadRecords(enUU) {
			$scope.recordsTableParams = new ngTableParams({
				page : 1,
				count : 10,
				sorting : {
					operateTime : 'desc'
				}
			}, {
				total : 0,
				getData : function($defer, params) {
					// 处理分页参数到URL中
					var param = BaseService.parseParams(params.url());
					param.enUU = enUU || 0;

					ConsignmentAgreementRecord.pageRecordWhenAdminQueryInfo(param, {}, function (data) {
						if (data.content && data.content.length > 0) {
							$defer.resolve(data.content);
							$scope.showRecords = true;
						} else {
							$defer.resolve([]);
							$scope.showRecords = false;
						}
						console.log(data);
					}, function (error) {
						console.log(error);
						$defer.resolve([]);
						$scope.showRecords = false;
						toaster.pop('error', '数据获取失败，请重新刷新页面');
					});
				}
			});
		}

		/**
		 * 为店铺打标签
		 */
		function tagStoreWithTag(store, tag) {
			if ($scope.store.tagsObject[tag]) {
				StoreAdsInformation.cancelStoreTagsWhenAdminCancel({type: tag}, store, function (store) {
					toaster.pop('success', '操作成功');
					$scope.tags = store.tags;
					$scope.store.tagsObject[tag] = false;
				}, function (error) {
					toaster.pop('warning', '操作失败，请重试');
					window.location.reload();
				});
			} else {
				StoreAdsInformation.tagStoreInWhenAdminRecommend({type: tag}, store, function (store) {
					toaster.pop('success', '操作成功');
					$scope.tags = store.tags;
					$scope.store.tagsObject[tag] = true;
				}, function (error) {
					toaster.pop('warning', '操作失败，请重试');
					window.location.reload();
				});
			}
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

	/**
	 * 店铺违规处置
	 */
	module.controller('ViolationsHandlerCtrl', ['$scope', 'StoreViolations', 'toaster', function ($scope, StoreViolations, toaster) {
		console.log('ViolationsHandlerCtrl');

		// 保存店铺违规处置信息
		$scope.violations = {};
		$scope.disposeProof = [];

		// 违规处置操作
		$scope.cancelHandler = cancelHandler;
		$scope.submitDisposeInfo = submitDisposeInfo;

		$scope.onUploadDisposeInfo = onUploadDisposeInfo;
		$scope.deleteDisposeInfo = deleteDisposeInfo;

		$scope.showImg = showImg;

		active();

		/**
		 * 初始化操作
		 */
		function active() {
			for (var i = 0; i < 5; i++) {
				$scope.disposeProof.push({createTime: new Date()});
			}
		}

		/**
		 * 上传处置证明信息
		 *
		 * @param $data		证明图片URL
		 * @param index		序号
		 */
		function onUploadDisposeInfo($data, index) {
			if (!$scope.disposeProof) {
				$scope.disposeProof = [];
			}
			if (!$data || !$data.path) {
				toaster.pop('error', '资质信息上传失败');
				return ;
			}
			$scope.disposeProof[index] = {createTime: new Date(), url: $data.path};
		}

		/**
		 * 删除上传图片
		 *
		 * @param index		序号
		 */
		function deleteDisposeInfo(index) {
			if (!$scope.disposeProof) {
				$scope.disposeProof = [];
			}
			if ($scope.disposeProof[index]) {
				delete $scope.disposeProof[index].url;
			}
		}

		/**
		 * 取消违规处理
		 */
		function cancelHandler() {
			$scope.violations = {};
		}

		/**
		 * 提交违规处置信息
		 */
		function submitDisposeInfo() {
			console.log('submitDisposeInfo', $scope.violations);

			// 验证违规处置信息
			if (!$scope.violations.type || $scope.violations.type === '') {
				toaster.pop('error', '请选择店铺违规类型');
				return 0;
			}
			if (!$scope.violations.disposition || $scope.violations.disposition === '') {
				toaster.pop('error', '请选择店铺违规处理方式');
				return 0;
			}
			if (!$scope.violations.reason || $scope.violations.reason === '') {
				toaster.pop('error', '请填写店铺违规处置原因');
				return 0;
			}

			// 处置店铺违规处置上传证明
			if ($scope.disposeProof && $scope.disposeProof.length > 0) {
				$scope.violations.disposeProof = $scope.disposeProof.filter(function (proof) {
					return proof.url && proof.url !== '';
				});
			}

			// 设置店铺信息
			$scope.violations.storeUuid = $scope.storeUuid;

			StoreViolations.launchViolationsHandlerWhenAdminFind({}, $scope.violations, function (result) {
				if (result.success) {
					toaster.pop('success', '操作成功');
					$scope.$emit('submitDisposeInfoSuccess');
				} else {
					toaster.pop('error', result.message);
				}
			}, function (error) {
				console.log(error);
				toaster.pop('error', '提交处置信息操作失败，请重新提交！');
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

	/**
	 * 店铺违规记录
	 */
	module.controller('ViolationsListCtrl', ['$scope', 'StoreViolations', 'ngTableParams', 'BaseService', 'toaster', function ($scope, StoreViolations, ngTableParams, BaseService, toaster) {
		console.log('ViolationsListCtrl');

		$scope.showViolationsInfo = showViolationsInfo;
		$scope.violationsStatus = '';
		$scope.setViolationsStatus = setViolationsStatus;

		$scope.isShow = 'ALL';
		$scope.changeShorting = changeShorting;

		active();

		function active() {
			$scope.violationsTableParams = new ngTableParams({
				page : 1,
				count : 10,
				sorting: {
					updateTime: 'DESC'
				}
			}, {
				total : 0,
				getData : function($defer, params) {
					// 处理分页参数到URL中
					var param = BaseService.parseParams(params.url());

					// 传递其他查询参数
					param.storeUuid = $scope.storeUuid;
					if ($scope.violationsStatus && $scope.violationsStatus !== '') {
						param.status = $scope.violationsStatus;
					}

					StoreViolations.pageViolationsWhenAdminQuery(param, {}, function (result) {
						if (result.success && result.data) {
							params.total(result.data.totalElements);
							$defer.resolve(result.data.content);
						} else {
							$defer.resolve([]);
							toaster.pop('error', '数据获取失败，请重新刷新页面');
						}
					}, function (error) {
						console.log(error);
						$defer.resolve([]);
						toaster.pop('error', '数据获取失败，请重新刷新页面');
					});
				}
			});
		}

		/**
		 * 显示店铺详情
		 *
		 * @param violations	店铺违规记录
		 */
		function showViolationsInfo(violations) {
			// 通过事件将店铺违规记录信息发布到父Controller
			$scope.$emit('showViolationsDetail', { operation: 'VIOLATIONS_DETAIL', violations: violations });
		}

		/**
		 * 设置筛选的店铺违规状态，解决ng-include的view value无法同步到model value的问题
		 */
		function setViolationsStatus(violationsStatus) {
			$scope.violationsStatus = violationsStatus || '';
			$scope.violationsTableParams.page(1);
			$scope.violationsTableParams.reload();
		}

		/**
		 * 改变违规记录的处置时间排序
		 */
		function changeShorting() {
			if ($scope.isShow === 'ALL') {
				$scope.isShow = 'DOWN';

				$scope.violationsTableParams.sorting({createTime: 'desc'});
			} else if ($scope.isShow === 'DOWN') {
				$scope.isShow = 'UP';

				$scope.violationsTableParams.sorting({createTime: 'asc'});
			} else if ($scope.isShow === 'UP') {
				$scope.isShow = 'ALL';

				$scope.violationsTableParams.sorting({updateTime: 'DESC'});
			}
			$scope.violationsTableParams.page(1);
			$scope.violationsTableParams.reload();
		}

	}]);

	/**
	 * 店铺违规详情
	 */
	module.controller('ViolationsDetailCtrl', ['$scope', 'StoreViolations', 'toaster', function ($scope, StoreViolations, toaster) {
		console.log('ViolationsDetailCtrl');

		// 从父作用域获取店铺违规记录信息
		$scope.violations = angular.copy($scope.showViolationsDetail);

		// 违规处理审核信息
		$scope.restore  = false;

		// 解决ng-include 导致的无法将View Value同步到Controller中的问题
		$scope.setAuthInfo = setAuthInfo;
		$scope.setRestore = setRestore;

		// 审核操作
		$scope.cancelAuth = cancelAuth;
		$scope.submitAuthInfo = submitAuthInfo;

		// 恢复店铺经营
		$scope.showRestoreConfirmDialog = false;
		$scope.wantRestoreStore = wantRestoreStore;
		$scope.confirmRestoreStore = confirmRestoreStore;

		$scope.showImg = showImg;

		/**
		 * 设置审核信息
		 */
		function setAuthInfo(authInfo) {
			$scope.authInfo = authInfo || '';
		}

		/**
		 * 设置是否恢复店铺经营
		 *
		 * @param restore	是否恢复店铺经营
		 */
		function setRestore(restore) {
			$scope.restore = restore || false;
		}

		/**
		 * 取消审核操作
		 */
		function cancelAuth() {
			// 发布时间通知父Controller，关闭违规处理详情页面
			$scope.$emit('closeViolationsDetail');
		}

		/**
		 * 提交管理员的审核操作
		 */
		function submitAuthInfo() {
			// 验证审核信息
			if (!$scope.authInfo || $scope.authInfo === '') {
				toaster.pop('error', '审核意见不能为空，请添加完成之后再提交审核信息！');
				return 0;
			}

			// 赋值审核信息到店铺违规处理记录中
			$scope.violations.authInfo = $scope.authInfo;
			$scope.violations.restore = $scope.restore;

			// 提交审核信息到后台服务器中
			StoreViolations.launchAuthWhenAdminReceiveComplaint({}, $scope.violations, function (result) {
				if (result.success) {
					$scope.violations = result.data;
					toaster.pop('success', '提交操作成功');
				} else {
					toaster.pop('error', result.message);
				}
			}, function (error) {
				console.log(error);
				toaster.pop('error', '提交审核信息操作失败，请重新提交！');
			});
		}

		/**
		 * 打开恢复店铺经营的对话框
		 *
		 * @param flag 是否展示对话框
		 */
		function wantRestoreStore(flag) {
			$scope.showRestoreConfirmDialog = flag;
		}

		/**
		 * 恢复店铺经营状态
		 */
		function confirmRestoreStore() {
			$scope.showRestoreConfirmDialog = false;

			// 恢复店铺经营状态信息
			StoreViolations.restoreStoreOpenStatusWhenAdminRestore({}, $scope.violations, function (result) {
				if (result.success) {
					$scope.violations = result.data;
					toaster.pop('success', '恢复操作成功');
				} else {
					toaster.pop('error', result.message);
				}
			}, function (error) {
				console.log(error);
				toaster.pop('error', '恢复店铺经营操作失败，请重试！')
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
