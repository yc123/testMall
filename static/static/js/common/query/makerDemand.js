define([ 'ngResource'], function() {
	angular.module('makerDemand', [ 'ngResource']).factory('makerDemandServices', ['$resource' , function($resource) {
		return $resource('trade/help/makeDemand', {}, {
			saveMakeDemand: {
				url: 'trade/help/api/makeDemand/save/entity',
				method : 'POST'
			},
			saveMakeDemandAuthentic: {
				url: 'trade/help/makeDemand/save/entity',
				method : 'POST'
			},
			handleMakeDemand: {
				url: 'trade/help/makeDemand/handle/:id',
				method: 'POST'
			},
			getMakeDemandById: {
				url: 'trade/help/makeDemand/:id',
				method: 'GET'
			},
			getPageMakeDemandInfoPersonal: {
				url: 'trade/help/makeDemandInfo/page/personal',
				method: 'GET'
			},
			getPageMakeDemandInfoAdmin: {
				url: 'trade/help/makeDemandInfo/page/admin',
				method: 'GET'
			},
			getBasicInfo: {
				url: 'trade/help/user/info',
				method: 'GET'
			},
			saveSupplyDemand:{
				url: 'trade/help/suDemand/save/entity',
				method : 'POST'
			}
			
		});
	}]);
});