define(['app/app'], function(app) {
	'use strict';
	app.register.controller('CrawlTaskCMPListCtrl', ['$scope', '$stateParams', 'ngTableParams', 'BaseService', 'toaster', 'CrawlTask', 'KindAPI', function($scope, $stateParams, ngTableParams, BaseService, toaster, CrawlTask, KindAPI) {
		$scope.taskId = $stateParams.taskId;
		
		$scope.crawlComponentTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				code: 'DESC'
			}
		}, {
			total : 0,
			counts : [10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.taskId = $scope.taskId;
				CrawlTask.getCmpList(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						KindAPI.getProperties({kindId: page.content[0].kindid}, {}, function(data){
							$scope.properties = data;
						}, function(data){
							toaster.pop('error', '错误', '获取类目属性信息失败');
						});
					}
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		});
		
		// 搜索
		$scope.onSearch = function() {
			$scope.crawlComponentTableParams.reload();
		};
	}]);
});