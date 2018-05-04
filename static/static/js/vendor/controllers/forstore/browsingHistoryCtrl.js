/**
 * Created by yangck on 2017/3/30.
 */
define(['app/app'], function(app) {
    app.register.controller('BrowsingHistoryCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.active = 'browsing-history';
        $scope.browsingHistoryCtrl = {};
    }]);
});