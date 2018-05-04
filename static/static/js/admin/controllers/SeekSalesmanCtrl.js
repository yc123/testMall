define(['app/app'], function (app) {
  'use strict';
  app.register.controller('SeekSalesmanCtrl', ['$scope', 'seekSalesman', 'toaster', 'BaseService','$modal','ngTableParams', '$http', function ($scope, seekSalesman, toaster, BaseService,$modal,ngTableParams, $http) {
      $scope.seek_status = 0;
      $scope.seek_salesman = 0;
    $scope.seekSalesmanTableParams = new ngTableParams({
      page : 1,
      count : 10
    }, {
      total : 0,
      getData : function ($defer, params) {
        const param = BaseService.parseParams(params.url());
          param.status = $scope.seek_status;
          param.salesman = $scope.seek_salesman;
          param.keyword = $scope.keyword;
          seekSalesman.getPageInfo(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function(response) {
          toaster.pop('error', response.data);
        });
      }
    });

    seekSalesman.getMembers(function(data){
        $scope.members = data;
    });


    $scope.onSearchKeyWord = function() {
      $scope.seekSalesmanTableParams.reload();
   }

    $scope.onSearchStatus = function(seek_status) {
        $scope.seek_status = seek_status;
        $scope.seekSalesmanTableParams.reload();
    }

    $scope.onSearchSalesman = function(seek_salesman) {
        $scope.seek_salesman = seek_salesman;
        $scope.seekSalesmanTableParams.reload();
    }



    $scope.orders = function(id){
        seekSalesman.orders({id:id},{}, function(data) {
           if (data.code == 1) {
               toaster.pop('success', '提示', '接单成功!');
               $scope.seekSalesmanTableParams.reload();
           } else {
               toaster.pop('error', '错误', data.message);
           }
        }, function(response) {
            toaster.pop('error', response.data);
        });
    }

  }]);
});