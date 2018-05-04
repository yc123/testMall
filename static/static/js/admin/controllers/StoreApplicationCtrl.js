define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('StoreApplicationCtrl', ['$scope', '$anchorScroll', '$location', '$modal', 'BaseService', 'SessionService', 'toaster', 'ngTableParams', 'StoreInfo', '$state', function ($scope, $anchorScroll, $location, $modal, BaseService, SessionService, toaster, ngTableParams, StoreInfo, $state) {

		// 店铺类型常量
		$scope.storeType = {
			AGENCY: {
				name: 'AGENCY',
				message: '代理商'
			},
			DISTRIBUTION: {
				name: 'DISTRIBUTION',
				message: '经销商'
			},
			ORIGINAL_FACTORY: {
				name: 'ORIGINAL_FACTORY',
				message: '原厂'
			}
		};
		// 开店申请的审核类型
		$scope.authType = {
			PREPARE: {
				name: 'PREPARE',
				message: '待审核'
			},
			PASS: {
				name: 'PASS',
				message: '已通过'
			},
			UNPASS: {
				name: 'UNPASS',
				message: '未通过'
			}
		};

		$scope.ngPageInfo = {
			page : 1,
			count : 10,
			sorting : {
				createTime: 'DESC'
			}
		};

		// 保存查询店铺申请的状态
		$scope.status = $scope.authType.PREPARE.name;
		// 保存查询店铺类型的状态
		$scope.type = 'ALL_TYPE';

		/**
		 * 切换Tab
		 *
		 * @param tab	tab标签
		 * @param type	TAB类型
		 */
		$scope.switchTab = function (tab, type) {
			if (type === 'status') {
				$scope.status = tab;
				if ($scope.type !== 'ALL_TYPE') {
					$scope.type = 'ALL_TYPE';
				}
			}
			if (type === 'type') {
				$scope.type = tab;
			}
			$scope.refreshTableData();
		};



		$scope.applicationTableParams = new ngTableParams($scope.ngPageInfo, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.status = $scope.status === 'ALL' ? null : $scope.status;
				param.type = $scope.type === 'ALL_TYPE' ? null : $scope.type;
				param.keyword = $scope.keyword && $scope.keyword !== '' ? $scope.keyword : null;
				StoreInfo.pageStoreApplications(param, function (data) {
					console.log(data);
					params.total(data.totalElements);
					if (data.content) {
						$defer.resolve(data.content);
						var date = new Date();
						console.log('TIMESTAMP', date.getTime());
						angular.forEach(data.content, function (application) {
							if (application.status === $scope.authType.PREPARE.name) {
								var time = date - application.createTime;
								// 计算相差天数
								var days = Math.floor(time / (24 * 3600 * 1000));
								// 计算相差小时数
								var leave1 = time % (24 * 3600 * 1000);
								var hours = Math.floor(leave1 / (3600 * 1000));
								application.time = {
									hour: hours,
									day: days
								};
							}
						})
					} else {
						$defer.resolve([]);
					}
				});
			}
		});
		$scope.changeShorting = function () {
			if($scope.ngPageInfo.sorting.createTime == 'DESC'){
				$scope.ngPageInfo.sorting.createTime = 'ASC';
			} else {
				$scope.ngPageInfo.sorting.createTime = 'DESC';
			}
			$scope.refreshTableData();
		};

		/**
		 * 刷新表格数据
		 */
		$scope.refreshTableData = function () {
			if ($scope.applicationTableParams.page() != 1) {
				$scope.applicationTableParams.page(1);
			}
			$scope.applicationTableParams.reload();
		};

		/**
		 * 审核通过
		 */
		$scope.auditSuccess = function (application) {
			var param = {
				uuid : application.uuid,
				status : 'PASS'
			};
			handlerApplication(param);
		};

		/**
		 * 审核失败
		 */
		$scope.auditFail = function (application) {
			var param = {
				uuid : application.uuid,
				status : 'UNPASS'
			};
			handlerApplication(param);
		};

		/**
		 * 审核申请
		 */
		var handlerApplication = function (param) {
			console.log(param);
			StoreInfo.handlerApply(param, null, function (data) {
				if (data.success) {
					if (data.data) {
						toaster.pop('success', "审核通过，店铺UUID:" + data.data);
					} else {
						toaster.pop('success', "审核不通过");
					}
					$scope.refreshTableData();
				} else {
					toaster.pop('error', data.message);
				}
			})
		};

		/**
		 * 审核资质信息
		 *
		 * @param application	店铺申请信息
		 */
		$scope.auditQualification = function (application) {
			if (application && application.uuid) {
				$state.go('store_qualification_auth', { applyUuid : application.uuid });
			} else {
				toaster.pop('error', '店铺审核信息不能为空');
			}
		}

	}]);
});
