define([ 'app/app' ], function(app) {
	// 店铺详情页面
	// 注意：子控制器通过作用域获取父作用域的数据，子作用域通过事件传递数据给父作用域
	app.register.controller('StoreInfoDetailCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {

		// 店铺UUID
		$scope.storeUuid = $stateParams.uuid;
		$scope.storeType = $stateParams.type;

		// Tab 选项，ENTERPRISE，VIOLATIONS
		$scope.tabSelected = 'ENTERPRISE';
		$scope.switchTab = switchTab;

		// 违规操作，VIOLATIONS_LIST，VIOLATIONS_HANDLE，VIOLATIONS_DETAIL
		$scope.violationsOperation = 'VIOLATIONS_HANDLE';
		$scope.switchOperation = switchOperation;

		$scope.showViolationsDetailInfo = false;
		// 待展示违规处理记录
		$scope.showViolationsDetail = {};

		// 订阅显示违规处理详情事件
		$scope.$on('showViolationsDetail', showViolationsDetail);
		$scope.$on('closeViolationsDetail', closeViolationsDetail);
		$scope.$on('submitDisposeInfoSuccess', submitDisposeInfoSuccess);

		/**
		 * 切换Tab标签
		 *
		 * @param tab	标签名称
		 */
		function switchTab(tab) {
			if (tab && tab !== '') {
				$scope.tabSelected = tab;

				if ($scope.tabSelected === 'VIOLATIONS') {
					$scope.showViolationsDetailInfo = false;
					$scope.showViolationsDetail = {};
				}
			}
		}

		/**
		 * 切换违规操作
		 *
		 * @param operation		违规操作
		 */
		function switchOperation(operation) {
			if (operation && operation !== '') {
				$scope.showViolationsDetailInfo = false;
				$scope.violationsOperation = operation;
			}
		}

		/**
		 * 显示违规处理信息
		 *
		 * @param event		事件对象
		 * @param data		操作类型
		 */
		function showViolationsDetail(event, data) {
			if (data && data.operation === 'VIOLATIONS_DETAIL' && data.violations) {
				$scope.showViolationsDetailInfo = true;
				$scope.showViolationsDetail = data.violations;
			} else {
				$scope.showViolationsDetailInfo = false;
				$scope.showViolationsDetail = {};
			}
		}

		/**
		 * 取消违规处理审核操作
		 */
		function closeViolationsDetail() {
			$scope.showViolationsDetailInfo = false;
			$scope.showViolationsDetail = {};
		}

		/**
		 * 店铺违规处理操作成功，展示违规记录信息
		 */
		function submitDisposeInfoSuccess() {
			switchOperation('VIOLATIONS_LIST');
		}

	}]);
});
