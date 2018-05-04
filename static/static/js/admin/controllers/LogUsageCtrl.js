define(['app/app'], function (app) {
  'use strict';
  app.register.controller('LogUsageCtrl', ['$scope', 'ngTableParams', 'logUsage', 'toaster', 'BaseService','$modal', function ($scope, ngTableParams, logUsage, toaster, BaseService,$modal) {
    //table设置
    $scope.logUsageTableParams = new ngTableParams({
      page : 1,
      count : 20
    }, {
      total : 0,
      getData : function ($defer, params) {
        $scope.paginationParams = params;
        const param = BaseService.parseParams(params.url());
        //param.status = $scope.status;
        if($scope.search !=null){
          if($scope.search == 1){
            param.userUu = $scope.searchContent;
          }
          if($scope.search == 2){
            param.userName = $scope.searchContent;
          }
        }
        logUsage.getAllByPage(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function (response) {
          toaster.pop('error', '获取用户操作日志失败');
        });
      }
    });

    //搜索
    $scope.onSearch = function(){
      if(!$scope.search){
        toaster.pop('error', '请选择搜索条件');
        return;
      }
      if($scope.searchContent==null){
        toaster.pop('error', '请输入搜索内容');
        return;
      }
      $scope.logUsageTableParams.reload();
    }
  }]);
});