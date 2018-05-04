/**
 * 店铺详情页面控制器
 *
 * history:
 * Created by huxz on 2017-3-22 15:51:06
 */
define(['app/app'], function(app) {
	app.register.controller('StoreDescriptionCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
		console.log("Description page");

		$scope.showImg = showImg;

		activate();

		////////////

		/**
		 * 启动逻辑
		 */
		function activate() {
			var qualifications = angular.copy($rootScope.storeInfo.qualifications || []);
			$scope.qualifications = qualifications.filter(function (qualification) {
				return qualification && qualification.type == 'APTITUDE';
			});
			angular.forEach($scope.qualifications, function (qualification) {
				qualification.isPdf = isPdf(qualification.resourceUrl);
			});
			console.log($scope.qualifications);
		}

		function isPdf(path) {
			// 根据path文件名来判断文件是否是PDF文件
			if(path) {
				var str = path.slice(path.lastIndexOf('.')).toLowerCase();
				if(str == '.pdf'){
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		/**
		 * 查看大图
		 *
		 * @param imgUrl		图片链接
		 */
		function showImg(imgUrl) {
			var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		}
	}]);
});
