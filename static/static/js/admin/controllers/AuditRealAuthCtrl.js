define(['app/app'], function (app) {
  'use strict';
  app.register.controller('AuditRealAuthCtrl', ['$scope', 'ngTableParams', 'User', 'toaster', 'BaseService', '$modal', function ($scope, ngTableParams, User, toaster, BaseService, $modal) {
    $scope.active = 'tobeAudit';
    $scope.status = 2;
    //table设置
    $scope.realAuthTableParams = new ngTableParams({
      page : 1,
      count : 5
    }, {
      total : 0,
      getData : function ($defer, params) {
        const param = BaseService.parseParams(params.url());
        param.status = $scope.status;
        User.getPageStatusRealAuth(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function (response) {
          toaster.pop('error', '获取账户信息失败 ', response.data);
        });
      }
    });

    $scope.updateIdEnable = function(idEnable, info){
        User.updateIdEnable({userUU:info.userUU,idEnable:idEnable},{},function(data){
            toaster.pop('success', '审批完成');
            $scope.realAuthTableParams.reload();
        },function(response){
            toaster.pop('error', response.data);
        });
    }

    $scope.remarks  = function (info) {
      openModal(info);
    }

    // 备注模态框
    var openModal = function(info) {
      var modalInstance = $modal.open({
        templateUrl : 'static/view/admin/modal/realAuth_remarks.html',  //指向上面创建的视图
        controller : 'AuthRemarksEditCtrl',// 初始化模态范围
        size : 'sm', // 大小配置
        resolve: {
          info: function() {
            return info;
          }
        }
      });
      modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数

      });
      modalInstance.result.then(function(updatedProperty){
        $scope.realAuthTableParams.reload();
      }, function(res){
      });
    }
  }]);

  app.register.controller('AuthRemarksEditCtrl', ['$scope','info', '$modalInstance','ngTableParams', 'User', 'toaster', 'BaseService', function ($scope, info, $modalInstance, ngTableParams, User, toaster, BaseService) {
    $scope.confirm = function(){
      User.updateIdEnable({userUU: info.userUU,idEnable: 0,idRemarks: $scope.idRemarks},{},function(data){
        toaster.pop('success', '审批完成，已将审批不通过原因发送给用户');
        $modalInstance.close();
      },function(response){
        toaster.pop('error', response.data);
      });
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }
  }]);
});