define(['app/app'], function(app) {
    'use strict';
    app.register.controller('HelpPublishCtrl', ['$scope', 'BaseService', 'ngTableParams', 'HelpIssue', 'toaster', function ($scope, BaseService, ngTableParams, HelpIssue, toaster) {

        $scope.active = 'all';

        $scope.keyword = "";
        $scope.setActive = function(state) {
            if($scope.active != state) {
                $scope.active = state;
                if($scope.issueTableParams.page() == 1)
                    $scope.issueTableParams.reload();
                else
                    $scope.issueTableParams.page(1);
            }
        };

        var getState = function() {
            var state = 'getAll';
            switch($scope.active) {
                case 'all' :
                    state = 'getAll'; break;
                case 'publish' :
                    state = 'getPublished'; break;
                case 'inputing' :
                    state = 'getInputing'; break;
            }
            return  state;
        };

        $scope.issueTableParams = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                createtime: 'DESC',
            }
        }, {
            total : 0,
            getData : function($defer, params) {
                var param = BaseService.parseParams(params.url());
                param.keyword = $scope.keyword;
                HelpIssue[getState()].call(null, param, function(page) {
                    if (page) {
                        params.total(page.totalElements);
                        $defer.resolve(page.content);					}
                });
            }
        });

        $scope.onSearch = function () {
            $scope.issueTableParams.page(1);
            $scope.issueTableParams.reload();
        };

        // 发布
        $scope.publish = function(id) {
            HelpIssue.publishAndFlush({id : id}, {}, function (data) {
                toaster.pop('success', '发布成功');
                $scope.issueTableParams.reload();
            }, function(response) {
                toaster.pop('error', response.data);
            });
        };
    }]);
});