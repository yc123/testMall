define([ 'app/app' ], function(app) {
	//器件批量建档审核
	app.register.controller('AuditComponentBatchMaintenanceCtrl', ['$scope', 'ngTableParams', 'BaseService', 'ComponentSubmit', function($scope, ngTableParams, BaseService, ComponentSubmit) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'unAudited';
		
		$scope.keyword = "";
		$scope.setActive = function(status) {
			if($scope.active != status) {
				$scope.active = status;
				$scope.componentTableParams.reload();
			}
		};
		
		var getStatus = function() {
			switch($scope.active) {
				case 'all' : 
					status = 'allBatchManage'; break;
				case 'unAudited' :
					status = 'unAuditedBatchManage'; break;
				case 'pass' :
					status = 'passBatchManage'; break;
				case 'forbidden' :
					status = 'forbiddenBatchManage'; break;
					default : 
						status = 'all';
			}
			return  status;
		};
		
		$scope.componentTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createDate: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				ComponentSubmit[getStatus()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);					}
				});
			}
		});
		
		$scope.onSearch = function() {
			$scope.componentTableParams.reload();
		}
	}]); 
});