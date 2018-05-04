define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('DisableComponentCtrl', ['$scope', 'NgTableParams', 'ComponentActive', 'ComponentDisable', 'toaster', 'BaseService', function($scope, NgTableParams, ComponentActive, ComponentDisable, toaster, BaseService) {
		BaseService.scrollBackToTop();
		$scope.isDisable = false;
		
		$scope.load =  function(params) {
			if (params == "disabled") {
				ComponentDisable.getSimpleInfoPage({}, {}, function(data) {
					$scope.components =data.content;
					$scope.isDisable = true;
					$scope.componentsTableParams = new NgTableParams({}, { dataset: $scope.components});
				}, function(){
					
				})
			} else {
				$scope.isDisable = false;
				loadData();
			}
		};
		
		var loadData = function(code) {
			ComponentActive.getByCode({ code: code}, {}, function(data){
				$scope.components = data;
				$scope.componentsTableParams = new NgTableParams({}, { dataset: $scope.components});
			}, function(){
				
			})
		}
		
		$scope.search = function(code){
			loadData(code);
		};
		
		$scope.disable = function(brand){
			ComponentActive.disable({uuid: brand.uuid}, {}, function(data){
				toaster.pop('success', '处理成功', '【' + data.code + '】' + '禁用成功');
				$scope.search();
			}, function(res){
				toaster.pop('error', '错误', res.data);
			})
		};
		
	}]);
});