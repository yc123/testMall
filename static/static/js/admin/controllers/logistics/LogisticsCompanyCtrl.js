define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('LogisticsCompanyCtrl', ['$scope', 'toaster', 'Logistics', function($scope, toaster, Logistics) {
		$scope.sorting = false;
		
		var loadData = function() {
			Logistics.findCompany({}, {}, function(data) {
			$scope.companies = data;
		}, function(res) {
			toaster.pop('error', '提示', '获取快递公司信息失败');
		});
		};

		loadData();
		
		// 激活/禁用快递公司
		$scope.active = function(company) {
			Logistics.active({id : company.id}, {}, function(data) {
				loadData();
			}, function(res) {
				toaster.pop('error', '提示', '操作失败，请重新操作');
			})
		};
		
		var getActived = function(){
			Logistics.getActived({}, {}, function(data) {
				$scope.actived = data
			}, function() {
				toaster.pop('error', '提示', '获取数据失败，请刷新');			
			});
		}
		
		// 进入排序
		$scope.sort = function(){
			$scope.sorting = true;
			getActived();
		};
		
		// 取消排序
		$scope.back = function(){
			$scope.sorting = false;
		};
		
		// 交换位置
		$scope.exchange = function(pre, post){
			Logistics.exchange({preId: pre.id, postId: post.id}, {}, function(data){
				toaster.pop('sucess', '提示', '操作成功');
				getActived();
			}, function(res){
				toaster.pop('error', '提示', '操作失败，请重试');
			});
		};
	}]);
});