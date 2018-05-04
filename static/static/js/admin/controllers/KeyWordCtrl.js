define(['app/app'], function (app) {
  'use strict';
  app.register.controller('KeyWordCtrl', ['$scope', 'ngTableParams', 'KeyWord', 'toaster', 'BaseService','$modal', function ($scope, ngTableParams, KeyWord, toaster, BaseService,$modal) {
    $scope.keyword = '';
    //分页获取关键词
    $scope.keyWordTableParams = new ngTableParams({
      page : 1,
      count : 10
    }, {
      total : 0,
      getData : function ($defer, params) {
        $scope.paginationParams = params;
        const param = BaseService.parseParams(params.url());
        //param.status = $scope.status;
        param.keyword = $scope.keyword;
        KeyWord.getKeyWordPageInfo(param, function (data) {
          params.total(data.totalElements);
          $defer.resolve(data.content);
        }, function (response) {
          toaster.pop('error', '获取关键词失败');
        });
      }
    });
    //关键词搜索
    $scope.onSearch = function(){
      $scope.keyWordTableParams.reload();
    }

    //添加关键词
    $scope.addKeyWord = function(){
      openKeyWordModal(null) ;
    }
    //编辑关键词
    $scope.editKeyWord = function(id){
      openKeyWordModal(id) ;
    }
    //批量添加关键词
    $scope.addKeyWords = function (){
      openKeyWordModal(-1) ;
    }
    //删除关键词
    $scope.deleteKeyWord = function(id){
      KeyWord.deleteKeyWord({id : id}, function(data) {
        toaster.pop('success', '提示', '关键词删除成功');
        location.reload();
      }, function(res) {
        toaster.pop('error', '提示', '获取密保问题失败，请刷新页面');
      });
    }

    //关键词模态框
    var openKeyWordModal = function(id) {
      var modalInstance = $modal.open({
        templateUrl : 'static/view/admin/modal/keyWord_modal.html',  //指向上面创建的视图
        controller : 'KeyWordModalCtrl',// 初始化模态范围
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
  }]);

  app.register.controller('KeyWordModalCtrl', ['$scope','id', '$modalInstance','ngTableParams', 'KeyWord', 'toaster', 'BaseService', function ($scope, id,$modalInstance,ngTableParams, KeyWord, toaster, BaseService) {
    $scope.addKeyWordModal = true;
    $scope.updateKeyWordModal = false;
    $scope.addKeyWordsModal =false;
    if (id && id!=-1) {
      KeyWord.getOneKeyWord({id : id}, function(data) {
        $scope.keyWord = data;
        $scope.addKeyWordModal = false;
        $scope.addKeyWordsModal =false;
        $scope.updateKeyWordModal = true;
      }, function(res) {
        toaster.pop('error', '提示', '获取密保问题失败，请刷新页面');
      });
    }
    if(id==-1){
      $scope.addKeyWordModal = false;
      $scope.updateKeyWordModal = false;
      $scope.addKeyWordsModal =true;
    }
    // 确认
    $scope.confirm = function() {
      if($scope.keywords!=null){
        var param = {keywords:$scope.keywords};
        KeyWord.batchAddKeyWord(param,function(data){
          toaster.pop('success', '提示', '关键词保存成功');
          $modalInstance.close();
          location.reload();
        }, function(res) {
          toaster.pop('error', '提示', res.data);
        });
      }else{
        KeyWord.saveKeyWord({}, $scope.keyWord, function(data) {
          toaster.pop('success', '提示', '关键词保存成功');
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