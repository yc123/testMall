define([ 'ngResource' ], function() {
	angular.module('seekQualityBuyerServices', [ 'ngResource' ]).factory('seekQualityBuyer', ['$resource', 'BaseService', function($resource, BaseService) {
		const rootPath = BaseService.getRootPath();
		return $resource('seek/qualityBuyer', {}, {
      getBuyerPageInfo:{
        url:'seek/qualityBuyer/getBuyerPageInfo',
        method:'GET'
			},
      saveBuyer:{
        url:'seek/qualityBuyer/saveBuyer',
        method:'POST'
			},
      getOneBuyer:{
        url:'seek/qualityBuyer/getOneBuyer',
        method:'GET'
			},
      deleteBuyer:{
        url:'seek/qualityBuyer/deleteBuyer',
        method:'PUT'
      }
		});
}])
});