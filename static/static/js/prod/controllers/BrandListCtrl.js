define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('BrandListCtrl', ['$scope', '$rootScope', 'toaster', 'BrandActiveAPI', 'Carousel', function($scope, $rootScope, toaster, BrandActiveAPI, Carousel) {
		$rootScope.page = 'brand';//导航栏锚点状态，'品牌'状态显示激活
		document.title = "品牌中心" + "-优软商城";

        $scope.choosedInitials = [];

        var chooseBrands = function(initials) {
            $scope.choosedInitials = initials;
        };

        $scope.showList = function(initials) {
            chooseBrands(initials);
        };

		var getData = function() {
			BrandActiveAPI.getInitialSimpleInfo({}, {}, function(data) {
				$scope.brands = data;
                chooseBrands('ABC');
			}, function (res) {
            });

            // Carousel.get({module : "home"}, {}, function (data) {
            //     $scope.carousels = data;
            // }, function (res) {
            // });

            // BrandActiveAPI.getNewBrands({num : 4}, function (data) {
            //     $scope.newBrands = data;
            // }, function (response) {
            // });

            BrandActiveAPI.getHotBrands({num : 5}, function (data) {
                $scope.hotBrands = data;
            }, function (response) {
            })
		};

		getData();
	}]);
	
});