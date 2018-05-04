define([ 'app/app' ], function(app) {
	'use strict';	
	app.register.controller('makerDemandDetailCtrl', ['$scope', 'makerDemandServices', 'toaster', '$state', '$stateParams',function($scope, makerDemandServices, toaster, $state, $stateParams) {
		
		makerDemandServices.getMakeDemandById({id: $stateParams.id}, function(data) {
			$scope.makeDemand = data
		}, function(response) {
			toaster.pop('error', '提取信息失败: '+ response.data );
		});
		
		$scope.goBack = function() {
			$state.go('make_demand_list');
		}
	}]);
});