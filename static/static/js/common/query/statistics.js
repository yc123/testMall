define(['ngResource'], function(ngResource) {
	angular.module('statisticsServices', ['ngResource']).factory('Statistics', ['$resource', function($resource) {

		return $resource('trade/stat', {}, {
			getYearStat : {
				url : 'trade/stat/year',
				method : 'GET',
				isArray : true
			},
			getMonthStat : {
				url : 'trade/stat/month',
				method : 'GET',
				isArray : true
			},
			getDayStat : {
				url : 'trade/stat/day',
				method : 'GET',
				isArray : true
			}
		});
	}]);
})