define(['app/app'], function (app) {
  'use strict';
  app.register.controller('SecQuestionCtrl', ['$scope', 'ngTableParams', 'secQuestion', 'toaster', 'BaseService','$modal', function ($scope, ngTableParams, secQuestion, toaster, BaseService,$modal) {
    //table设置
    $scope.secQuestionTableParams = new ngTableParams({
      page : 1,
      count : 20
    }, {
      total : 0,
      getData : function ($defer, params) {
        const param = BaseService.parseParams(params.url());
        //param.status = $scope.status;
        //param.keyword = $scope.keyword;
        secQuestion.getPageInfo(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function (response) {
          toaster.pop('error', '获取账户信息失败 ', response.data);
        });
      }
    });

    // 添加密保问题
    $scope.add = function() {
      openModal(null) ;
    }

    //编辑密保问题
    $scope.edit = function(id) {
      console.info(id);
      openModal(id) ;
    }
    var openModal = function(id) {
      var modalInstance = $modal.open({
        templateUrl : 'static/view/admin/modal/secQuestion_add_modal.html',  //指向上面创建的视图
        controller : 'SecQuestionEditCtrl',// 初始化模态范围
        size : 'sm', // 大小配置
        resolve: {
          id: function() {
            return id;
          }
        }
      });
      modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数

      });
      modalInstance.result.then(function(updatedProperty){
        $scope.propertiesTableParams.reload();
      }, function(res){
      });
    }

    //删除密保问题
    $scope.deleteSecQuestion = function (id) {
      secQuestion.deleteSecQuestion({id:id},function(){
        toaster.pop('success', '提示', '删除密保问题成功');
        location.reload();
      },function(response){
        toaster.pop('error', '提示', res.data);
      });
    }
  }]);

  app.register.controller('SecQuestionEditCtrl', ['$scope','id', '$modalInstance','ngTableParams', 'secQuestion', 'toaster', 'BaseService', function ($scope, id,$modalInstance,ngTableParams, secQuestion, toaster, BaseService) {
    $scope.addModal = true;
    $scope.updateModal = false;
    if (id) {
      secQuestion.get({id : id}, function(data) {
        $scope.secQuestion = data
        $scope.addModal = false;
        $scope.updateModal = true;
      }, function(res) {
        toaster.pop('error', '提示', '获取密保问题失败，请刷新页面');
      });
    }
    // 确认
    $scope.confirm = function() {
      // 更新属性
      if ($scope.secQuestion.id) {
        secQuestion.update({}, $scope.secQuestion, function(data) {
          toaster.pop('success', '提示', '修改密保问题成功');
          $modalInstance.close();
          location.reload();
        }, function(res) {
          toaster.pop('error', '提示', res.data);
        });
      } else {
        secQuestion.add({}, $scope.secQuestion, function(data) {
          toaster.pop('success', '提示', '添加密保问题成功');
          $modalInstance.close();
          location.reload();
        }, function(res) {
          toaster.pop('error', '提示', res.data);
        });
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }
  }]);
});