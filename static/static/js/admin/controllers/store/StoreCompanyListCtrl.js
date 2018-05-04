define([ 'app/app' ], function(app) {
	/**
	 * 寄售管理页面，展示签订寄售协议的公司信息列表，点击“查看详情”跳转该公司签订寄售协议记录页面
	 *
	 * @author huxz
	 * @version 2017-09-01 16:28:34 create file
	 */
	app.register.controller('StoreCompanyListCtrl', ['$scope', 'ngTableParams', 'BaseService', 'toaster', 'ConsignmentAgreementRecord', '$state', function ($scope, ngTableParams, BaseService, toaster, ConsignmentAgreementRecord, $state) {

		$scope.keyword = "";
		$scope.refreshTableData = refreshTableData;
		$scope.totalPages = 0;

		$scope.goDetailPage = goDetailPage;

		// 执行初始化操作
		active();

		/**
		 * 初始化操作.
		 */
		function active() {
			$scope.recordsTableParams = new ngTableParams({
				page : 1,
				count : 10
			}, {
				total : 0,
				getData : function($defer, params) {

					// 处理分页参数到URL中
					var param = BaseService.parseParams(params.url());

					// 与服务器的分页参数名同步
					param.page = param.page - 1;
					param.size = param.count;

					// 设置搜索关键字
					if ($scope.keyword && $scope.keyword !== '') {
						param.keyword = $scope.keyword;
					}

					ConsignmentAgreementRecord.pageEnterpriseWhenAdminQueryRecord(param, {}, function (page) {
						console.log(page);
						$defer.resolve(page.content || []);
						params.total(page.totalElements);
						$scope.totalPages = page.totalPages;
					}, function (error) {
						console.log(error);
						$defer.resolve([]);
						params.total(0);
						$scope.totalPages = 0;
						toaster.pop('error', '数据获取失败，请重新刷新页面！');
					});
				}
			});
		}

		/**
		 * 触发根据搜索关键字进行搜索
		 */
		function refreshTableData() {
			console.log($scope.keyword);
			$scope.recordsTableParams.page(1);
			$scope.recordsTableParams.reload();
			console.log($scope.recordsTableParams);
		}

		/**
		 * 跳转签订寄售协议记录详情页面
		 */
		function goDetailPage(enterprise) {
			$state.go('store_company_detail', {enUU: enterprise.uu});
		}
	}]);
});
