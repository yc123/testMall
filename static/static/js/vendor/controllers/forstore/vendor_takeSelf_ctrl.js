define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendorTakeSelfCtrl', ['$scope', '$rootScope', 'ngTableParams', 'BaseService', 'TakeSelf', '$modal', 'toaster', function ($scope, $rootScope, ngTableParams, BaseService, TakeSelf, $modal, toaster) {
        $scope.tab = 'takeSelf';
        $rootScope.active = 'vendor_logistics';
        $scope.$$takeSelf = {};
        document.title = '自提点-优软商城';
        $scope.takeSelfTableParams = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                createtime : 'desc'
            }
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                TakeSelf.findAllTakeSelf(param, function (page){
                    $scope.$$takeSelf.totalElements = page.totalElements;
                    if(Number(page.totalElements) > 0) {
                        $scope.$$takeSelf.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }else {
                        $scope.$$takeSelf.start = 0;
                    }
                    $scope.$$takeSelf.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                },function () {
                    toaster.pop('error', '获取自提点地址失败');
                } )
            }
        });

        $scope.changeActive = function (takeSelf, active) {
            TakeSelf.saveTakeSelf( {isActive:active}, takeSelf, function (data) {
                if (data){
                    $scope.takeSelfTableParams.reload();
                }
            },function () {
                toaster.pop('error', '更新自提点地址失败');
            })
        };

        $scope.showDeleteFrame = function (object) {
            $scope.deleteObject = object;
            $scope.deleteFrame = true;
        };

        $scope.cancelDelete = function () {
            $scope.deleteFrame = false;
        };

        $scope.deleteTakeSelf = function (id) {
            TakeSelf.deleteTakeSelf({id:id}, {}, function () {
                $scope.deleteFrame = false;
                toaster.pop('info', '删除自提点地址成功');
                $scope.loadTakeSelfAddress();
            }, function () {
                toaster.pop('error', '删除自提点地址失败');
            });
        };

        $scope.editTakeSelf = function (addressTakeSelf) {
            $modal.open({
                templateUrl : 'static/view/vendor/modal/edit_address_takeSelf.html',
                controller : 'editTakeSelfCtrl',
                size : 'lg',
                resolve : {
                    addressTakeSelf : function () {
                        return angular.copy(addressTakeSelf);
                    },
                    nameList : function (){
                        return $scope.nameList;
                    },
                    isModify : function () {
                        if (addressTakeSelf){
                            return true;
                        }else {
                            return false;
                        }
                    }
                }
            }).result.then(function(addressTakeSelf){
                if (addressTakeSelf) {
                    $scope.loadTakeSelfAddress();
                }
            }, function(){

            });
        };

        //地址编辑模态框
        app.register.controller('editTakeSelfCtrl', ['$scope', '$rootScope', 'isModify', '$modalInstance', 'addressTakeSelf', 'nameList', '$http', function ($scope, $rootScope, isModify, $modalInstance, addressTakeSelf, nameList, $http) {
            $scope.isModify = isModify;
            $scope.nameList = nameList;
            if (!addressTakeSelf){
                $scope.isActive = true;
            }else {
                $scope.isActive = addressTakeSelf.active == 1;
            }

            $http.get('static/js/prod/data/city.json').success(function(data) {
                $scope.division = data;
                if(addressTakeSelf && addressTakeSelf.area){
                    // $scope.takeSelf = addressTakeSelf;
                    //拼装下拉选择框
                    var arr = addressTakeSelf.area.split(',');
                    addressTakeSelf.province = arr[0];
                    addressTakeSelf.city = arr[1];
                    addressTakeSelf.district = arr[2];
                    $scope.takeSelf = addressTakeSelf;
                }
            }).error(function() {
                toaster.pop('error', '系统错误 ' + '加载城市信息失败');
            });

            $scope.containsName = function (value) {
                var key = 1;
                if (value){
                    angular.forEach($scope.nameList, function (data) {
                        if (data == value){
                            key = 0;
                            return;
                        }
                    });
                    if (key == 1){
                        $scope.repeatError = false;
                    }else {
                        $scope.repeatError = true;
                    }
                }
            };

            $scope.nameError = false;
            $scope.businessError = false;
            $scope.addressError = false;
            $scope.checkFrom = function (num) {
                var size;
                if (num == 1){
                    if($scope.takeSelf.takename){
                        $scope.containsName($scope.takeSelf.takename);
                        size = $scope.takeSelf.takename.replace(/[^x00-xFF]/g,'**').length;
                        if (size > 30){
                            $scope.nameError = true;
                            return;
                        }
                        $scope.nameError = false;
                    }
                }
                if (num == 2){
                    if($scope.takeSelf.businesstime){
                        size = $scope.takeSelf.businesstime.replace(/[^x00-xFF]/g,'**').length;
                        if (size > 30){
                            $scope.businessError = true;
                            return;
                        }
                        $scope.businessError = false;
                    }
                }
                if (num == 3){
                    if($scope.takeSelf.detailAddress){
                        size = $scope.takeSelf.detailAddress.replace(/[^x00-xFF]/g,'**').length;
                        if (size > 60){
                            $scope.addressError = true;
                            return;
                        }
                        $scope.addressError = false;
                    }
                }
            };

            $scope.saveAddressTakeSelf = function () {
                var address = $scope.takeSelf;
                if (!address){
                    toaster.pop('error', '请补充未填写的信息');
                    return ;
                }
                if (!address.takename || !address.province || !address.city || !address.district ||
                    !address.detailAddress || !address.businesstime){
                    toaster.pop('error', '请补充未填写的信息');
                    return ;
                }
                if ($scope.nameError || $scope.repeatError || $scope.businessError || $scope.addressError){
                    toaster.pop('error', '请修改填写有误的信息');
                    return ;
                }
                //拼装地区
                address.area = address.province + ',' + address.city + ',' + address.district;

                TakeSelf.saveTakeSelf( {isActive:$scope.isActive}, address, function (data) {
                    if (data){
                        toaster.pop('success', '成功', '保存自提点地址成功');
                    }
                    $modalInstance.close(data);
                },function (response) {
                    toaster.pop('error', '保存自提点地址失败'+ ' '+ response.data);
                })
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };
        }]);

        /**
         * 刷新自提点地址
         */
        $scope.loadTakeSelfAddress = function () {
            $scope.takeSelfTableParams.page(1);
            $scope.takeSelfTableParams.reload();
            $scope.getTakeSelfName();
        };

        $scope.nameList = {};
        $scope.getTakeSelfName = function () {
            TakeSelf.findAllTakeName({}, function (data) {
                if (data){
                    $scope.nameList = data;
                }
            }, function () {
                toaster.pop('error', '保存自提点地址失败');
            })
        };
        $scope.getTakeSelfName();

    }]);
});