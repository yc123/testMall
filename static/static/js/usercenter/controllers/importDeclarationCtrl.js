define([ 'app/app'], function(app) {
	
	app.register.controller('importDeclarationCtrl', ['$scope', 'ngTableParams', 'importDeclarationService', 'BaseService', '$filter', 'SessionService', function($scope, ngTableParams, importDeclarationService, BaseService, $filter, SessionService) {
		
		//获取历史记录
		$scope.importTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				date: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				$scope.count = 0;
				importDeclarationService.getImportDemands(param, function(page) {
					console.log(page);
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						$scope.orderLength = page.content.length;
						$scope.count = 0;
					}
				});
			}
		});
		
		console.log($scope.importTableParams);
	}]);
	
	app.register.controller('newImportDeclarationCtrl', ['$scope', 'ngTableParams', 'importDeclarationService', '$filter', 'SessionService', 'toaster', '$location', function($scope, ngTableParams, importDeclarationService, $filter, SessionService, toaster, $location) {
		
		// 获取当前登录用户信息
		if(SessionService.get('authenticated')) {
			importDeclarationService.getBasicInfo(null, function(data) {
				$scope.importt = data;
				$scope.hasInfo = true;
			}, function(response) {
				toaster.pop('error', '获取个人信息失败，请重新加载界面');
			});
		};
		
		importDeclarationService.getImportEnterprise(function(data) {
			$scope.enterprises = data;
			console.log($scope.enterprises);
		}, function(res) {
			
		});
		
		$scope.submitDemands = function(demand, enterprise) {
			$scope.id = enterprise.id;
			importDeclarationService.saveNewDemad({demand: demand, id: $scope.id}, {}, function(data) {
				toaster.pop("success", "提示", "提交成功");
				$location.path('home/import_declaration');
			}, function(response) {
				toaster.pop("error", "提交失败", response.data);
			});
		}
		
	}])
})