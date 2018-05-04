define([ 'app/app' ], function(app) {
	//入库单
	app.register.controller('ReceiptCtrl', ['$scope', '$anchorScroll', '$location', 'BaseService' , 'ngTableParams', 'Receipt', 'toaster', '$stateParams', function($scope, $anchorScroll, $location, BaseService ,ngTableParams, Receipt, toaster, $stateParams) {

		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('adminReceiptState')? window.sessionStorage.getItem('adminReceiptState'):'available';
		
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'available' :
					state = 'available'; break;
				case 'unavailable' :
					state = 'unavailable'; break;
			}
			return state;
		};

		$scope.setActive = function(state) {
			window.sessionStorage.setItem('adminReceiptState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.receiptTableParams.page() == 1)
				$scope.receiptTableParams.reload();
			else
				$scope.receiptTableParams.page(1);
		};

		$scope.receiptTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				Receipt[getState()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});

		$scope.onSearch = function() {
			$scope.receiptTableParams.reload();
		}
		
	}]);
});