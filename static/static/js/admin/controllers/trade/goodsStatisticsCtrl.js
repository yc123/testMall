define([ 'app/app' ], function(app) {
	//在售商品信息统计
	app.register.controller('goodsStatisticsCtrl', ['$scope', 'Goods', 'toaster', 'ComponentActive', 'BrandActive', 'Goods', 'CommonCountAPI', function($scope, Goods, toaster, ComponentActive, BrandActive, Goods, CommonCountAPI) {
		// 在售商品信息汇总
		Goods.getStatistics({}, {}, function(data) {
			$scope.statistics = data;
		}, function(res) {
			toaster.pop('error', '提示', '获取数据失败，请刷新页面');
		});

		// 各月新增器件数量
		ComponentActive.getIncreaseCount({}, function(data) {
			$scope.increaseCmpCount = data;
		}, function (response) {
			toaster.pop('error', '数据获取失败，请重试');
		});

		//各月新增品牌数量
		BrandActive.getIncreaseCount({}, function(data) {
			$scope.increaseBrandCount = data;
		}, function (response) {
			toaster.pop('error', '数据获取失败，请重试');
		});

		//各月新增批次数量
		Goods.getIncreaseBatch({}, function(data) {
			$scope.increaseBatchCount = data;
		}, function (response) {
			toaster.pop('error', '数据获取失败，请重试');
		});

		//各月新增在售器件数量
		Goods.getIncreaseCmp({}, function(data) {
			$scope.increaseInSaleCmpCount = data;
		}, function (response) {
			toaster.pop('error', '数据获取失败，请重试');
		});

		// 首页轮播数据统计
		CommonCountAPI.getActived({}, function (data) {
			$scope.count = data;
		}, function (response) {
			toaster.pop('error', '数据获取失败，请重试');
		});
	}]);
});