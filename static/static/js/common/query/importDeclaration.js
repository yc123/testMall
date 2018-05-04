define(['ngResource'], function(ngResource) {
	angular.module('importDeclaration', ['ngResource']).factory('importDeclarationService', ['$resource', function($resource) {
		return $resource('trade/importdeclaration', {}, {
			saveNewDemad : {
				url : 'trade/importdeclaration/save',
				method : 'POST'
			},
			getBasicInfo: {
				url: 'trade/help/user/info',
				method: 'GET'
			},
			getImportDemands : {
				url : 'trade/importdeclaration/all',
				method : 'GET'
			},
			getImportEnterprise : {
				url : 'trade/importenterprise/all',
				method : 'GET',
				isArray : true
			}
		})
	}]);
})