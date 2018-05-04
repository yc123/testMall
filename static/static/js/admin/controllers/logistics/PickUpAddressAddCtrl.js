define([ 'app/app' ], function(app) {
	app.register.controller('PickUpAddressAddCtrl', ['$scope', '$stateParams', 'PickUpAddress', 'toaster', function($scope, $stateParams, PickUpAddress, toaster) {
		$scope.address = {
				id: null,
				area: null,
				detailAddress: null
		};
		
		var getData = function() {
			PickUpAddress.getById({id: $stateParams.id}, function(data){
				$scope.address = data;
			})
		};
		if($stateParams.id != null){
			getData();
		}
		
		$scope.submitAddress = function(){
			var pickUpAddress = {
					id: null,
					area: null,
					detailAddress: null
			};
			pickUpAddress.id = $stateParams.id;
			pickUpAddress.area = $scope.address.area;
			pickUpAddress.detailAddress = $scope.address.detailAddress;
			
			PickUpAddress.save({}, pickUpAddress, function(){
				toaster.pop("success", "新增地址成功");
				window.location.href = "admin#/logistics/pickUpAddress";
				
			}, function(){
				toaster.pop("error", "新增地址失败");
			})
		}
	}]);
	
});