define([ 'ngResource' ], function() {
	angular.module('seekSalesmanServices', [ 'ngResource' ]).factory('seekSalesman', ['$resource', 'BaseService', function($resource, BaseService) {
		const rootPath = BaseService.getRootPath();
		return $resource('seek/salesman', {}, {
            getPageInfo: {
                url: 'seek/salesman/getPageInfo',
                method: 'GET'
            }, orders: {
                url: 'seek/salesman/orders',
                method: 'POST'
            }, getMallGoodsList: {
                url: 'seek/getMallGoodsList',
                method: 'GET',
                isArray: true
            }, getMembers: {
                url: 'seek/salesman/getMembers',
                method: 'GET',
                isArray: true
            }, getSeekUrl: {
                url: 'seek/accessUrl',
                method: 'GET'
            }
        });
    }])
});