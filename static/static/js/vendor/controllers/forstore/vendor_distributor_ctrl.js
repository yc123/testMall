define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendorDistributorCtrl', ['$scope','$rootScope','$modal','toaster','Distributor','KdnLogistics', function ($scope,$rootScope,$modal,toaster,Distributor,KdnLogistics) {
        $scope.tab = 'distributor';
        $rootScope.active = 'vendor_logistics';
        $scope.title = '配送商';
        document.title = '配送商-优软商城';
        $scope.initData = function () {
            Distributor.findAllSelected({},function (data) {
                if (data){
                    $scope.data_list = data;
                }
                angular.forEach($scope.data_list, function (data) {
                    data.isOpen = false;
                })
            })
        };
        $scope.initData();

        /**
         * 初始化所有的快递鸟列表
         */
        $scope.findAllKdnList = function () {
            KdnLogistics.getCompanyName({}, function (data) {
                if (data){
                    $scope.allKdnList = data;
                }
                angular.forEach($scope.allKdnList, function (data) {
                    data.isChoosed = false;
                });
            }, function (error) {

            })
        };
        $scope.findAllKdnList();

        $scope.showDeleteDialog = false;
        // $scope.data_list.forEach(function (data) {
        //     data.isOpen = false
        // });
        $scope.hover_distributor = function ($index) {
            $scope.data_list[$index].isOpen = true
        };
        $scope.leave_distributor = function ($index) {
            $scope.data_list[$index].isOpen = false
        };
        $scope.delete_distributor = function (object) {
            $scope.deleteObject = object;
            $scope.showDeleteDialog = true;
        };
        $scope.cancelDeleteDialog = function () {
            $scope.showDeleteDialog = false
        };
        $scope.doDeleteDistributor = function (id) {
            Distributor.deleteOne({id:id},{},function () {
                $scope.showDeleteDialog = false;
                $scope.initData();
            }, function () {

            });
        };
        $scope.addDistributor = function () {
            $modal.open({
                templateUrl : $rootScope.rootPath + '/static/view/vendor/modal/vendor_distributor_manage.html',
                controller : 'vendorDistributorManageCtrl',
                size : 'lg',
                resolve : {
                    allKdnList : function () {
                        return $scope.allKdnList;
                    },
                    selectedList : function () {
                        return $scope.data_list;
                    }
                }
            }).result.then(function(data){
                if (data) {
                    $scope.initData();
                }
            }, function(){
                // toaster.pop('info', '提示 ' + '您已取消配送商的编辑');
            });
        }
    }]);

    app.register.controller('vendorDistributorManageCtrl', ['$scope','$rootScope','$modal','toaster','KdnLogistics','Distributor','BaseService','ngTableParams','allKdnList','selectedList','$modalInstance', function ($scope, $rootScope, $modal, toaster, KdnLogistics, Distributor, BaseService, ngTableParams, allKdnList, selectedList, $modalInstance) {
        //获取快递鸟信息
        $scope.$$kdnData = {};
        $scope.allKdnList = allKdnList;
        $scope.chooseList = [];
        $scope.selectFlag = [];

        $scope.initArrayData = function () {
            angular.forEach(allKdnList, function (data) {
                $scope.selectFlag[data.code] = {};
                $scope.selectFlag[data.code].isChoosed = false;
            });
            angular.forEach(selectedList, function (data, index) {
                $scope.chooseList[index] = {};
                if (data.code){
                    $scope.chooseList[index].code = data.code;
                    $scope.selectFlag[data.code].isChoosed = true;
                }
                $scope.chooseList[index].companyName = data.companyName;
            });
        };
        $scope.initArrayData();

        $scope.distributorTableParams = new ngTableParams({
            page : 1,
            count : 30
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                KdnLogistics.findKdnPage(param, function (page) {
                    $scope.$$kdnData.totalElements = page.totalElements;
                    if(Number(page.totalElements) > 0) {
                        $scope.$$kdnData.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }else {
                        $scope.$$kdnData.start = 0;
                    }
                    $scope.$$kdnData.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    $scope.pageList = page.content;
                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                    //划分数据
                    var row = Math.ceil(page.numberOfElements/6.0);
                    $scope.showList = [];
                    var count = 0;
                    for (var i = 0; i<row; i++){
                        $scope.showList[i] = [];
                        for (var j = 0; j<6; j++){
                            // var code = $scope.pageList[count].code;
                            // $scope.pageList[count].isChoosed = $scope.selectFlag[code].isChoosed;
                            $scope.showList[i].push($scope.pageList[count]);
                            count++;
                            if (count == page.numberOfElements){
                                return;
                            }
                        }
                    }
                }, function () {
                    toaster.pop('error', '获取快递鸟信息失败');
                });
            }
        });

        var countLength = function (string) {
            return string.replace(/[^\x00-\xff]/g,'**').length;
        };

        $scope.inputContent = function () {
            for (var i = 1; i<=$scope.keyword.length; i++){
                if (countLength($scope.keyword.substr(0, i)) > 26){
                    $scope.keyword = $scope.keyword.substr(0, i-1);
                    break;
                }
            }
            // var addrPatt = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
            // if (!addrPatt.test($scope.keyword) && $scope.keyword.length > 0){
            //     $scope.companyError = true;
            // }else {
            //     $scope.companyError = false;
            // }
            initIndex();
            $scope.showDownFrame = true;
            matchArray();
            $scope.containsAttr($scope.keyword);
        };

        var initIndex = function () {
            $scope.selectIndex = -1;
            $scope.downIndex = 0;
        };

        $scope.getFocus = function() {
            initIndex();
        };

        /**
         * 根据输入内容获取匹配数据的长度
         */
        var matchArray = function () {
            $scope.resultList = $scope.allKdnList.filter(function (data) {
                if (data.companyName.indexOf($scope.keyword) >= 0){
                    return data;
                }
            });
            if ($scope.resultList.length > 0){
                $scope.matchData = true;
            }else{
                $scope.matchData = false;
            }
        };

        $scope.onBlur = function () {
            setTimeout(function () {
                $scope.showDownFrame = false;
            }, 120);
        };

        $scope.onKeyDown = function () {
            var dom = document.getElementById("ulContent");
            // console.log(dom.scrollTop);
            if ($scope.showDownFrame && $scope.matchData){
                if(event.keyCode == 40) { //监听到按下键
                    $scope.selectIndex ++;
                    if ($scope.downIndex == 5){
                        dom.scrollTop += 23;
                    }
                    if ($scope.downIndex <= 4){
                        $scope.downIndex++;
                    }
                    if($scope.selectIndex >= $scope.resultList.length){
                        $scope.selectIndex = 0;
                        dom.scrollTop = 0;
                        $scope.downIndex = 1;
                    }
                    $scope.inputObject = $scope.resultList[$scope.selectIndex];
                    $scope.keyword = $scope.inputObject.companyName;
                    $scope.containsAttr($scope.keyword);
                } else if(event.keyCode == 38) { //监听到按上键
                    $scope.selectIndex --;
                    if ($scope.downIndex == 1){
                        dom.scrollTop -= 22.67 ;
                    }
                    if ($scope.downIndex >= 2){
                        $scope.downIndex--;
                    }
                    if($scope.selectIndex < 0){
                        $scope.selectIndex = $scope.resultList.length - 1;
                        dom.scrollTop = 2400;
                        $scope.downIndex = 5;
                    }
                    $scope.inputObject = $scope.resultList[$scope.selectIndex];
                    $scope.keyword = $scope.inputObject.companyName;
                    $scope.containsAttr($scope.keyword);
                } else if(event.keyCode == 13) { //确定键
                    $scope.showDownFrame = false;
                }
            }
        };

        $scope.clickItem = function (data) {
            // $scope.inputObject = data;
            $scope.keyword = data.companyName;
            $scope.containsAttr($scope.keyword);
            $scope.showDownFrame = false;
        };

        /**
         * 判断快递鸟是否包含输入的快递
         * @param value
         */
        $scope.containsAttr = function (value) {
            var key = 1;
            if (value){
                angular.forEach($scope.allKdnList, function (data) {
                    if (data.companyName == value){
                        key = 0;
                        return;
                    }
                });
                if (key == 1){
                    $scope.containsItem = false;
                }else {
                    $scope.containsItem = true;
                }
            }
        };

        $scope.addItemInSelected = function () {
            if ($scope.containsItem){
                angular.forEach($scope.allKdnList, function (data) {
                    if (data.companyName == $scope.keyword){
                        if ($scope.selectFlag[data.code].isChoosed){
                            var indexItem = null;
                            if ($scope.chooseList){
                                angular.forEach($scope.chooseList, function (item, index) {
                                    if (item.code == data.code){
                                        indexItem = index;
                                    }
                                });
                            }
                            $scope.chooseList.splice(indexItem, 1);
                            $scope.selectFlag[data.code].isChoosed = !$scope.selectFlag[data.code].isChoosed;
                        }
                        $scope.ChooseDistributor(data);
                    }
                });
            }else {
                var indexItem = null;
                angular.forEach($scope.chooseList, function (item, index) {
                    if (item.companyName == $scope.keyword){
                        indexItem = index;
                    }
                });
                if (indexItem){
                    $scope.chooseList.splice(indexItem, 1);
                }
                var item = {};
                item.companyName = $scope.keyword;
                $scope.chooseList.push(item);
            }
            $scope.keyword = "";
        };

        $scope.removeDistributor = function (data, index) {
            $scope.chooseList.splice(index, 1);
            if (data.code){
                $scope.selectFlag[data.code].isChoosed = !$scope.selectFlag[data.code].isChoosed;
            }
        };

        $scope.ChooseDistributor = function (data) {
            if ($scope.selectFlag[data.code].isChoosed){
                if ($scope.chooseList){
                    angular.forEach($scope.chooseList, function (item, index) {
                        if (item.code == data.code){
                            $scope.index = index;
                        }
                    });
                }
                $scope.chooseList.splice($scope.index, 1);
            }else {
                $scope.chooseList.push(data);
            }
            $scope.selectFlag[data.code].isChoosed = !$scope.selectFlag[data.code].isChoosed;
        };

        $scope.saveChooseList = function () {
            Distributor.saveDistributor({}, $scope.chooseList ,function (data) {
                if(data){
                    toaster.pop('success', '成功', '保存配送商成功');
                }
                $modalInstance.close(data);
            },function (error) {
                toaster.pop('error', '成功', '保存配送商失败 ' + error);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);

});