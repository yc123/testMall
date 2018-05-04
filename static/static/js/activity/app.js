/**
 * 单页
 *
 */
define([ 'angularAMD', 'ui.router', 'ui-bootstrap', 'ngLocal', 'ngTable', 'common/services', 'common/directives', 'angular-toaster', 'common/query/cms', 'common/query/storeInfo', 'common/query/commonCount', 'common/query/collection', 'common/query/cart','common/query/messageBoard' ], function(angularAMD) {
    'use strict';
    var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ngTable', 'common.services', 'common.directives', 'toaster', 'cmsService', 'storeInfoServices', 'commonCountServices', 'collection', 'cartServices' ,'messageBoardServices']);
    app.init = function() {
        angularAMD.bootstrap(app);
    };
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/activity");
        $stateProvider.state("business", angularAMD.route({
            // 单页
            url : '/business',
            title : '招商注册',
            templateUrl : 'static/view/activity/business.html'
        }))
    }]);
    app.run(['$rootScope', 'BaseService', 'StoreInfo', function($rootScope, BaseService, StoreInfo) {
        $rootScope.rootPath = BaseService.getRootPath();
        StoreInfo.getUmallStoreId({}, {}, function (result) {
            if (result.data) {
                $rootScope.umallStoreId = result.data;
            } else {
                delete $rootScope.umallStoreId;
            }
        }, function () {
            delete $rootScope.umallStoreId;
        });
    }]);
    return app;
});
