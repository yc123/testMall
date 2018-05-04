define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('SlideImageCtrl', [ '$scope', '$modal', 'SlideImage', 'toaster', '$window', 'SlideImageAPI', function($scope, $modal, SlideImage, toaster, $window, SlideImageAPI) {
		// 选择图片（包括商品展示图片和描述内容里面的图片）
		$scope.upload = {};
		$scope.status = "normal";
		
		var loadData = function() {
			SlideImage.get({}, {}, function(data) {
				$scope.slideImages = data;
			}, function(res) {
				toaster.pop('error', '提示', '加载数据失败，请刷新页面');
			});
		};
		
		loadData();
		
		// 图片选择模态框
		$scope.showImageDialog = function(model) {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image) {
					$scope.upload.url = image.src;
				});
			});
		};
		
		// 激活/弃用图片
		$scope.active = function(slide) {
			SlideImage.active({id : slide.id}, {}, function(data) {
				loadData();
			}, function(res) {
				toaster.pop('error', '提示', '操作失败，请重新操作');
			})
		};
		
		// 删除图片
		$scope.deleteImg = function(slide) {
			SlideImage.deleteImg({id : slide.id}, {}, function(data) {
				toaster.pop('sucess', '提示', '删除成功');
				loadData();
			}, function(res) {
				toaster.pop('error', '错误', '删除失败，请重试');
			})
		}
		
		// 进入上传图片
		$scope.createImg = function() {
			if ($scope.status=="upload") {
				$scope.status = "normal";
			} else {
				$scope.status = "upload";
			}
		};
		
		// 进入预览
		$scope.showSlide = function() {
			if ($scope.status=="show") {
				$scope.status = "normal";
			} else {
				loadActived();
				$scope.status = "show";
			}
		};
		
		// 获取已激活的图片
		var loadActived = function() {
			SlideImageAPI.getActived({}, {}, function(data) {
				$scope.actived = data;
			}, function(res) {
				toaster.pop('error', '错误', '获取数据失败，请刷新页面');
			});
		};
		
		// 已激活图片左移
		$scope.onLeft = function(act, item) {
			SlideImage.exchangeDetno({
				preId : act.id,
				postId : item.id
			}, {}, function(date) {
				loadActived();
			}, function(res) {
				toaster.pop('error', '错误', '操作失败，请重试');
			});
		};
		
		// 已激活图片右移
		$scope.onRight = function(act, item) {
			SlideImage.exchangeDetno({
				preId : act.id,
				postId : item.id
			}, {}, function(date) {
				loadActived();
			}, function(res) {
				toaster.pop('error', '错误', '操作失败，请重试');
			});
		};
		
		// 上传图片
		$scope.uploadImg = function() {
			SlideImage.upload({}, $scope.upload, function(data) {
				toaster.pop('sucess', '提示', '上传成功');
				$window.location.reload();
			},function(res) {
				toaster.pop('error', '提示', '上传失败');
			});
		}
	}]);
	
	// 图片选择
	app.register.controller('ImageInsertCtrl',['$scope', '$modalInstance', 'ImgUrl', function($scope, $modalInstance, ImgUrl) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = ImgUrl.handelByWidthHeigth( path, 100, 100 );
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