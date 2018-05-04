define(['app/app'], function (app) {
  'use strict';
  app.register.controller('LoanApplyListCtrl', ['$scope', 'ngTableParams', 'LoanApply', 'toaster', 'BaseService', function ($scope, ngTableParams, LoanApply, toaster, BaseService) {
    //table设置
    $scope.logUsageTableParams = new ngTableParams({
      page : 1,
      count : 20
    }, {
      total : 0,
      getData : function ($defer, params) {
        $scope.paginationParams = params;
        const param = BaseService.parseParams(params.url());
          LoanApply.getAllByPage(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function (response) {
          toaster.pop('error', '获取用户贷款申请列表失败');
        });
      }
    });


  }]);
});