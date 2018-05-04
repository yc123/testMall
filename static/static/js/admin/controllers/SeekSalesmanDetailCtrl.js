define(['app/app'], function (app) {
    'use strict';
    app.register.controller('SeekSalesmanDetailCtrl', ['$scope', 'seekSalesman', 'toaster', 'BaseService', '$http', '$stateParams', function ($scope, seekSalesman, toaster, BaseService, $http, $stateParams) {
        $scope.active = 'offer';
        $scope.status = 101;
        $scope.salesman_name = $stateParams.name;
        //设置状态
        $scope.setActive = function (active) {
            if($scope.active != active) {
                $scope.active = active;
                switch ($scope.active) {
                    case 'offer':
                        $scope.status = 101;
                        break;
                    case 'goods':
                        $scope.status = 104;
                        break;
                    case 'pricing':
                        $scope.status = 103;
                        break;
                }
                // $scope.bankInfoTableParams.page(1);
                // $scope.bankInfoTableParams.reload();
            }
        };
        seekSalesman.getSeekUrl({}, function(data1) {
            var seekUrl = data1.url;
            $http({
                method: 'get',
                dataType: 'json',
                url: seekUrl + '/inquiry/buyer/quotation',
                params: {id: $stateParams.uuid}
            }).success(function (data) {
                $scope.seek = data;
                seekSalesman.getMallGoodsList({code: data.cmpCode, brand: data.inbrand}, function (data1) {
                    $scope.goods = data1;
                });
            }).error(function (response) {

            });
        });

        $scope.orders = function(){
            seekSalesman.orders({id: $stateParams.uuid},{}, function(data) {
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