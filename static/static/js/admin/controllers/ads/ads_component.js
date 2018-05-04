define([ 'app/app' ], function(app) {
    //器件推广
    app.register.controller('adsComponentCtrl', ['$scope', 'NgTableParams', 'ComponentActive', 'toaster', 'BaseService', function($scope, NgTableParams, ComponentActive ,toaster, BaseService) {
        BaseService.scrollBackToTop();
        $scope.isDisable = true;

        $scope.load =  function(params) {
            if (params == "weight") {
                ComponentActive.getSimpleInfoByWeight({}, {}, function(data) {
                    $scope.brands =data;
                    $scope.isDisable = true;
                    $scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
                }, function(){

                })
            } else {
                $scope.isDisable = false;
                loadData();
            }
        };

        var loadData = function(){
            ComponentActive.getSimpleInfoByWeight({}, {}, function(data){
                $scope.brands = data;
                $scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
            }, function(){
            })
        };

        loadData();

        $scope.weight = function(brand){
            if (angular.isDefined(brand.inputWeight)) {
                ComponentActive.setSimpleInfoWeight({weight: brand.inputWeight}, brand, function(data){
                    toaster.pop('success', '处理成功', '【' + data[0].code + '】' + '禁用成功');
                    loadData();
                }, function(res){
                    toaster.pop('error', '错误', res.data);
                })
            } else {
                toaster.pop('warning', '请先在右侧输入权重值');
            }
        };
        $scope.disweight = function(brand){
            ComponentActive.setSimpleInfoWeight({weight: 0}, brand, function(data){
                if (data.searchWeight == 0){
                    toaster.pop('success', '处理成功', '【' + data.code + '】' + '已取消推广');
                    $scope.load('weight');
                } else{
                    toaster.pop('error', '错误', '取消推广失败');
                }
            }, function(res){
                toaster.pop('error', '错误', res.data);
            })
        };
        $scope.updateweight = function(brand){
            if (angular.isDefined(brand.inputWeight)) {
                ComponentActive.setSimpleInfoWeight({weight: brand.inputWeight}, brand, function(data){
                    toaster.pop('success', '处理成功', '【' + data.code + '】' + '已修改推广');
                    $scope.load('weight');
                }, function(res){
                    toaster.pop('error', '错误', res.data);
                })
            } else {
                toaster.pop('warning', '请先在右侧输入权重值');
            }
        };

        $scope.searchComponent = function(keyword){
            ComponentActive.getByCode({ code: keyword}, {}, function(data){
                $scope.searchTableParams = new NgTableParams({}, { dataset: data});
            }, function(res){
                toaster.pop('error', '错误', res.data);
            })
        };

    }]);
});