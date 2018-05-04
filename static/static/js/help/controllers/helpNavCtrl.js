/**
 * Created by wangyc on 2017/5/3.
 */
define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('HelpNavCtrl', ['$scope', 'HelpIssueAPI', 'HelpAPI', '$stateParams', 'toaster', function ($scope, HelpIssueAPI, HelpAPI, $stateParams, toaster) {

        // 获取导航信息
        HelpAPI.get({id : $stateParams.navId}, function(data) {
            $scope.nav = data;
        }, function (response) {
            toaster.pop('error', response.data);
        });

        // 获取文章列表
        HelpIssueAPI.getIssues({navId : $stateParams.navId}, function (data) {
            $scope.issues = data;
        }, function (response) {
            toaster.pop('error', response.data);
        });

    }]);
});
