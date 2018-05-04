define(['app/app'], function (app) {
	"use strict";
	app.register.controller('vendorStoreWaitCtrl', ['$scope', '$rootScope', 'StoreInfo', '$modal', 'toaster', '$timeout', '$state', function($scope, $rootScope, StoreInfo, $modal, toaster, $timeout, $state) {
		$rootScope.active = "vendor_store";

	}]);

});
