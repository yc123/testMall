define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('MessageBoardCtrl', [ '$scope', 'MessageBoard', 'ngTableParams', 'BaseService', function($scope, MessageBoard, ngTableParams, BaseService) {
		BaseService.scrollBackToTop();
		$scope.active = 'tobehandle';
		
		// 设置状态
		$scope.setActive = function(active) {
			if ($scope.active != active) {
				$scope.active = active;
				$scope.messageBoardTableParams.reload();
			}
		};
		
		// 获取状态
		var getStatus = function() {
			var status;
			switch($scope.active) {
				case 'all' :
					status = 'getAllPageInfo'; break;
				case 'tobehandle' :
					status = 'getToBeHandlePageInfo'; break;
				case 'handled' :
					status = 'getHandledPageInfo'; break;
					default : 
						status = 'getToBeHandlePageInfo';
			}
			return  status;
		};
		
		// 搜索
		$scope.onSearch = function() {
			$scope.messageBoardTableParams.reload();
		};

		$scope.messageBoardTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createDate: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				MessageBoard[getStatus()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
	}]);
});