define(['app/app'], function(app) {
    'use strict';
    app.register.controller('CrawlTaskCMPDetailCtrl', ['$scope', '$rootScope', 'ComponentActive', '$stateParams', 'AuthenticationService', function ($scope, $rootScope, ComponentActive, $stateParams, AuthenticationService) {

        ComponentActive.get({uuid: $stateParams.uuid}, function (data) {
            $scope.component = data;
        }, function (response) {
            toaster.pop('error', response.data);
        });

        // 下载PDF
        $scope.downloadpdf = function(attach) {
            window.open(attach);
        };
    }]);
});