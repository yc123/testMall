define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('DisableBrandCtrl', ['$scope', 'NgTableParams', 'BrandDisable', 'BrandActive', 'toaster', 'BaseService', function($scope, NgTableParams, BrandDisable, BrandActive ,toaster, BaseService) {
		BaseService.scrollBackToTop();
		$scope.isDisable = false;
		
		$scope.load =  function(params) {
			if (params == "disabled") {
				BrandDisable.getSimpleInfoPage({}, {}, function(data) {
					$scope.brands =data.content;
					$scope.isDisable = true;
					$scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
				}, function(){
					
				})
			} else {
				$scope.isDisable = false;
				loadData();
			}
		};
		
		var loadData = function(){
			BrandActive.getSimpleInfo({}, {}, function(data){
				$scope.brands = data;
				$scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
			}, function(){
				
			})
		};
		
		loadData();
		
		$scope.disable = function(brand){
			BrandActive.disable({uuid: brand.uuid}, {}, function(data){
				toaster.pop('success', '处理成功', '【' + data[0].nameCn + '】' + '禁用成功');
				loadData();
			}, function(res){
				toaster.pop('error', '错误', res.data);
			})
		};
		
	}]);
});