define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('MessageBoardDetailCtrl', [ '$scope', 'MessageBoard', '$stateParams', 'toaster', '$window', function($scope, MessageBoard, $stateParams, toaster, $window) {
		
		var getData = function() {
			MessageBoard.get({id : $stateParams.id}, {}, function(data) {
				$scope.messageBoard = data;
			}, function(res) {
				toaster.pop('error', '提示', '数据获取失败，请刷新页面')
			})
		};

		// 展示图片
		$scope.showImgs = function (url) {
			var src = url, box = $('#image-box'), modal = $('.modal-content');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		};

		// 处理留言
		$scope.handle = function() {
			MessageBoard.handle({}, $scope.messageBoard, function(data) {
				toaster.pop('success', '提示', '处理成功');
				$window.location.reload();
			}, function(res) {
				toaster.pop('error', res.data);
			})
		};
		
		getData();
	}]);
});