/**
 * Created by wangyc on 2017/5/3.
 */
define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('IssueCtrl', ['$scope', 'HelpIssueAPI', 'HelpAPI', '$stateParams', 'toaster', '$sce', function ($scope, HelpIssueAPI, HelpAPI, $stateParams, toaster, $sce) {
        HelpIssueAPI.getIssue({num : $stateParams.num}, function (data) {
            $scope.issue = data;
            $scope.issue.article = $sce.trustAsHtml($scope.issue.article);
            // 获取导航信息
            HelpAPI.get({id : $scope.issue.navId}, function(data) {
                $scope.nav = data;
            }, function (response) {
                toaster.pop('error', response.data);
            });
        }, function (response) {
            toaster.pop('error', response.data);
        });

    }]);
});