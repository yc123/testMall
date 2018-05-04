define(['app/app'], function (app) {
    'use strict';
    app.register.controller('AutomaticReceivingCtrl', ['$scope', 'tradeBasicProperties', 'toaster', function ($scope, tradeBasicProperties, toaster) {

        tradeBasicProperties.get({type : 1502}, function (data) {
            $scope.automaticReceiving = parseInt(data.info);
            console.log($scope.automaticReceiving);
            $scope.type = data.type;
        }, function (res) {
            toaster.pop('error', '获取买家自动收货的时间');
        });

        $scope.modify = function() {
            $scope.isChange = true;
            document.getElementById("valueText").disabled = false;
        }

        $scope.save = function() {
            tradeBasicProperties.saveBuyer({type : parseInt($scope.type), info : $scope.automaticReceiving}, null, function(response) {
                if(response.data == "success"){
                    toaster.pop('success', '保存成功');
                }else{
                    toaster.pop('error', '保存失败');
                }
            }, function(response) {
                toaster.pop('error', '保存失败' + response.text);
            });
        }

        $scope.cancle = function() {
            $scope.isChange = false;
            document.getElementById("valueText").disabled = "true";
        }
    }]);
})