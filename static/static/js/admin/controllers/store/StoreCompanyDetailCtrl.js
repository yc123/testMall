define([ 'app/app' ], function(app) {
	/**
	 * 寄售管理详情页面，列表展示签订寄售协议记录信息
	 *
	 * @author huxz
	 * @version 2017-09-01 17:17:23 create file
	 */
	app.register.controller('StoreCompanyDetailCtrl', ['$scope', 'ngTableParams', 'BaseService', 'toaster', 'ConsignmentAgreementRecord', '$stateParams', function ($scope, ngTableParams, BaseService, toaster, ConsignmentAgreementRecord, $stateParams) {

		$scope.enUU = $stateParams.enUU || 0;

		$scope.totalPages = 0;

		$scope.isShow = 'ALL';

		// 执行初始化操作
		active();

		/**
		 * 初始化操作.
		 */
		function active() {
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
					param.enUU = $scope.enUU;

					ConsignmentAgreementRecord.pageRecordWhenAdminQueryInfo(param, {}, function (page) {
						$defer.resolve(page.content || []);
						params.total(page.numberOfElements);
						$scope.totalPages = page.totalPages;
					}, function (error) {
						console.log(error);
						$defer.resolve([]);
						params.total(0);
						$scope.totalPages = 0;
						toaster.pop('error', '数据获取失败，请重新刷新页面');
					});
				}
			});
		}

		/**
		 * 改变创建时间排序
		 */
		$scope.changeShorting = function () {
			if ($scope.isShow === 'ALL') {
				$scope.isShow = 'DOWN';

				$scope.recordsTableParams.sorting({operateTime : 'DESC'});
			} else if ($scope.isShow === 'DOWN') {
				$scope.isShow = 'UP';

				$scope.recordsTableParams.sorting({operateTime : 'ASC'});
			} else if ($scope.isShow === 'UP') {
				$scope.isShow = 'ALL';

				$scope.recordsTableParams.sorting({operateTime : 'DESC'});
			}
			$scope.recordsTableParams.page(1);
			$scope.recordsTableParams.reload();
		};
	}]);
});
