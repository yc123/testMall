define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindAdviceCtrl', ['$scope', 'toaster', 'KindAdvice', 'ngTableParams', 'BaseService',  function($scope, toaster, KindAdvice, ngTableParams, BaseService) {
		$scope.kindAdviceTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				date: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				KindAdvice.get(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
	}]);
});