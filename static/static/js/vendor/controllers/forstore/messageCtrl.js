/**
 * Created by yangck on 2017/3/30.
 */
define(['app/app'], function(app) {
    app.register.controller('MessageCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.active = 'message';
        $scope.message = {};
    }]);
});