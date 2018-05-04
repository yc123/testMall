define(['app/app'], function (app) {
  'use strict';
  app.register.controller('SeekQualityBuyerCtrl', ['$scope', 'seekQualityBuyer', 'toaster', 'BaseService','$modal','ngTableParams', function ($scope, seekQualityBuyer, toaster, BaseService,$modal,ngTableParams) {
    $scope.seekQualityBuyerTableParams = new ngTableParams({
      page : 1,
      count : 5
    }, {
      total : 0,
      getData : function ($defer, params) {
        const param = BaseService.parseParams(params.url());
        seekQualityBuyer.getBuyerPageInfo(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function (response) {
          toaster.pop('error', response.data);
        });
      }
    });

    // 添加采购商
    $scope.add = function() {
      openModal(null) ;
    }

    // 编辑采购商
    $scope.edit = function(id) {
      openModal(id) ;
    }

    // 删除采购商
    $scope.deleteBuyer = function (id) {
      seekQualityBuyer.deleteBuyer({id:id},function(){
        toaster.pop('success', '提示', '删除采购商成功');
        $scope.seekQualityBuyerTableParams.reload();
      },function(res){
        toaster.pop('error', '提示', res.data);
      });
    }

    var openModal = function(id) {
      var modalInstance = $modal.open({
        templateUrl : 'static/view/admin/modal/seekQualityBuyer_add_modal.html',  //指向上面创建的视图
        controller : 'SeekQualityBuyerEditCtrl',// 初始化模态范围
        size : 'sm', // 大小配置
        resolve: {
          id: function() {
            return id;
          }
        }
      });
      modalInstance.result.then(function(){
        $scope.seekQualityBuyerTableParams.reload();
      }, function(res){
      });
    }
  }]);

  /**
   * 优质采购商 添加和编辑 模态框
   */
  app.register.controller('SeekQualityBuyerEditCtrl', ['$scope','id', '$modalInstance','ngTableParams', 'seekQualityBuyer', 'toaster', 'BaseService', function ($scope, id,$modalInstance,ngTableParams, seekQualityBuyer, toaster, BaseService) {
    $scope.addModal = true;
    $scope.updateModal = false;
    if (id) {
      seekQualityBuyer.getOneBuyer({id : id}, function(data) {
        $scope.seekQualityBuyer = data;
        $scope.addModal = false;
        $scope.updateModal = true;
      }, function(res) {
        toaster.pop('error', '提示', res.data);
      });
    }

    // 保存操作
    $scope.confirm = function() {
      seekQualityBuyer.saveBuyer({},$scope.seekQualityBuyer,function(data) {
        toaster.pop('success', '提示', '添加优秀采购商成功');
        $modalInstance.close();
      }, function(res) {
        toaster.pop('error', '提示', res.data);
      });
    };


    $scope.cancel = function() {
      $modalInstance.dismiss();
    }
  }]);
});