define(['app/app'], function(app) {
	app.register.controller('UserCenterHomeCtrl', ['$scope' , '$modal', 'Order', 'toaster', 'User', '$rootScope', function($scope, $modal, Order, toaster, User, $rootScope) {
		$rootScope.active = 'index';
		// 选择Logo图片
		$scope.cartCount = $rootScope.countCart;
		$scope.user = {};
		$scope.showImageDialog = function(model) {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image){
					$scope.imageUrl = image.thumb;
					User.postImageUrl(null, angular.toJson($scope.imageUrl), function(data){
						$scope.user = data;
					}, function(response) {
						toaster.pop('error', '设置图像失败,' + response.data);
					});
					
				});
			});
		};
		
		User.getUser(null, function(data) {
			$scope.user = data;
		}, function(response) {
			toaster.pop('error', '获取个人信息失败');
		});
		
		$scope.totalToDo = 0;
		
		// 获取待确认,待付款，待收货的订单个数
		Order.getPersonalOrderCountByStatus({status: "501-503-404"}, function(data) {
			$scope.tobeConfirm = data["tobecomfirm"];
			$scope.tobepaid = data["tobepaid"];
			$scope.tobeInbound = data["tobeInbound"];
			$scope.totalToDo = parseInt($scope.tobeConfirm) + parseInt($scope.tobepaid) + parseInt($scope.tobeInbound);
		}, function(response) {
			toaster.pop('error', '获取订单个数失败');
		});
		
		$scope.setToBeComfirmedStatus = function() {
			window.sessionStorage.setItem("todoState", "tobepaid");
		}
		
		$scope.setToBePaid = function() {
			window.sessionStorage.setItem("todoState", "tobepaid");
		}
		
		$scope.setToBeInbound = function() {
			window.sessionStorage.setItem("todoState", "tobereceive");
		}
		
	}]);
	
	app.register.controller('ImageInsertCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = path.substring(0, path.lastIndexOf('.')) + "_150x90" + path.substr(path.lastIndexOf('.'));
			$scope.$apply(function(){
				$scope.image.src = data.path;
				$scope.image.thumb = path;
			});
		};
		$scope.close = function() {
			$modalInstance.dismiss();
		};
		$scope.confirm = function() {
			$modalInstance.close($scope.image);
			$scope.imageUrl = null;
		};
	}]);
	
});