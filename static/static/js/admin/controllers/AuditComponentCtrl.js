define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('AuditComponentCtrl', ['$scope', 'ngTableParams', 'ComponentsSubmit', 'BaseService', function($scope, ngTableParams, ComponentsSubmit, BaseService) {
		BaseService.scrollBackToTop();// 页面滚动至最顶部
		
		$scope.keyword = "";
		$scope.active = 'unAudited';
		
		// 选择不同状态条件
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
				if($scope.componentTableParams.page() == 1)
					$scope.componentTableParams.reload();
				else
					$scope.componentTableParams.page(1);
			}
		};
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'unAudited' :
					state = 'getUnAudited'; break;
				case 'allow' :
					state = 'getAllow'; break;
				case 'notAllow' :
					state = 'getNotAllow'; break;
			}
			return  state;
		};
		
		// 表格参数
		$scope.componentTableParams = new ngTableParams({
			page : 1,
			count : 50,
			sorting : {
				lastModifyDate: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				ComponentsSubmit[getState()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		// 搜索
		$scope.onSearch = function() {
			$scope.componentTableParams.page(1);
			$scope.componentTableParams.reload();
		}
		
	}]);
});