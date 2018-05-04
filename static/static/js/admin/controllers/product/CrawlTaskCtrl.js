define(['app/app'], function(app) {
	'use strict';
	app.register.controller('CrawlTaskCtrl', ['$scope', 'CrawlTask', 'ngTableParams', 'BaseService', function($scope, CrawlTask, ngTableParams, BaseService) {
		BaseService.scrollBackToTop();
		$scope.active = 'to_crawl';
		$scope.searchMore = false;
		
		$scope.setActive = function(status) {
			if($scope.active != status) {
				$scope.active = status;
				$scope.crawlTaskTableParams.page(1);
				$scope.crawlTaskTableParams.reload();
			}
		};
		
		var getStatus = function() {
			switch($scope.active) {
				case 'to_crawl' : 
					status = 'to_crawl'; break;
				case 'running' :
					status = 'running'; break;
				case 'crawled' :
					status = 'crawled'; break;
				case 'failed' :
					status = 'failed'; break;
					default : 
						status = 'to_crawl';
			}
			return  status;
		};
		
		// 展示收起搜索栏
		$scope.showMore = function() {
			$scope.searchMore = !$scope.searchMore;
		};
		
		$scope.crawlTaskTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createDate: 'DESC'
			}
		}, {
			total : 0,
			counts : [10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.taskId = $scope.taskId;
				param.contrast = $scope.contrast;
				param.creater = $scope.creater;
				CrawlTask[getStatus()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						angular.forEach(page.content, function(task) {
							task.contrast = angular.fromJson(task.contrast);
						})
						$defer.resolve(page.content);
					}
				}, function() {
					
				});
			}
		});
		
		// 搜索
		$scope.onSearch = function() {
			$scope.crawlTaskTableParams.page(1);
			$scope.crawlTaskTableParams.reload();
		};
	}]);
});