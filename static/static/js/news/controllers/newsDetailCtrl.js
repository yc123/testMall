define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('newsDetailCtrl', ['$scope', '$rootScope', 'News', '$stateParams', function ($scope, $rootScope, News, $stateParams) {
		$rootScope.page = 'news';

		var init = function () {
			var id = $stateParams.id;

			News.getNewsById({ id: id}, {}, function (data) {
				console.log('detail', data);
				$scope.newsDetail = data;
			}, function (error) {
				console.log(error);
			})
		};
		init();
	}]);
});
