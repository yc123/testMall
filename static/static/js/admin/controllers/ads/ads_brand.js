define([ 'app/app' ], function(app) {
    //品牌审批
    app.register.controller('adsBrandCtrl', ['$scope', 'NgTableParams', 'BrandDisable', 'BrandActive', 'toaster', 'BaseService', function($scope, NgTableParams, BrandDisable, BrandActive ,toaster, BaseService) {
        BaseService.scrollBackToTop();

        $scope.load =  function(params) {
            if (params == "weight") {
                BrandActive.getSimpleInfoByWeight({}, {}, function(data) {
                    $scope.brands =data;
                    //$scope.isDisable = true;
                    $scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
                }, function(){

                })
            } else {
                $scope.isDisable = false;
                loadData();
            }
        };

        var loadData = function(){
            BrandActive.getSimpleInfo({}, {}, function(data){
                $scope.brands = data;
                $scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
            }, function(){
            })
        };

        loadData();

        $scope.weight = function(brand){
            if (angular.isDefined(brand.inputWeight)) {
                BrandActive.setSimpleInfoWeight({weight: brand.inputWeight}, brand, function(data){
                    toaster.pop('success', '处理成功', '【' + data[0].nameCn + '】' + '禁用成功');
                    loadData();
                }, function(res){
                    toaster.pop('error', '错误', res.data);
                })
            } else [
                toaster.pop('warning', '请先在右侧输入权重值')
            ]
        };
        $scope.disweight = function(brand){
            BrandActive.setSimpleInfoWeight({weight: 0}, brand, function(data){
                if (data.weight == 0){
                    toaster.pop('success', '处理成功', '【' + data.nameCn + '】' + '已取消推广');
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
                BrandActive.setSimpleInfoWeight({weight: brand.inputWeight}, brand, function(data){
                    toaster.pop('success', '处理成功', '【' + data.nameCn + '】' + '已修改推广');
                    $scope.load('weight');
                }, function(res){
                    toaster.pop('error', '错误', res.data);
                })
            } else {
                toaster.pop('warning', '请先在右侧输入权重值')
            }
        };

    }]);
});