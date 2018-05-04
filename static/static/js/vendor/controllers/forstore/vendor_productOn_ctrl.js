/**
 * Created by yujia on 2017/7/7.
 *
 */
define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendorProductOnCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.$$productOn = {};
        $rootScope.active = 'vendor_productOn';
        $rootScope.$$productOn.leadIn = 'bathOn';
        // 切换批量与单个建档
        $scope.style = 'batch'
        $scope.checkTab = function (type) {
            $scope.style = type;
        }
    }]);

    //产品导入的Ctrl
    app.register.controller('productOnCtrl', ['$scope', '$rootScope', 'ngTableParams', '$upload', '$q', 'AuthenticationService', 'BaseService', 'SessionService', '$modal', 'toaster', 'Loading', 'productImportServie', function ($scope, $rootScope, ngTableParams, $upload, $q, AuthenticationService, BaseService, SessionService, $modal, toaster, Loading, productImportServie) {

        $scope.$$productImport = {};
        $scope.result = {};

        /**
         * 匹配成功的ngtable
         * @type {any}
         */
        $scope.matchSuccessTable = new ngTableParams({
                count : 10,
                page : 1,
                sorting : {
                    updateTime : 'desc'
                }
            }, {
                total : 0,
                getData : function($defer, params) {
                    if($scope.result.uploadNum && $scope.result.success > 0) {
                        var param = BaseService.parseParams(params.url());
                        param.status = "105"; //105 是匹配成功的状态码
                        param.uploadNum = $scope.result.uploadNum;
                        productImportServie.getPageProductImport(param, function (page) {
                            params.total(page.totalElements);
                            $defer.resolve(page.content);
                            $scope.result.success = page.totalElements;
                            $scope.$$productImport.succProMatch = {};
                            $scope.$$productImport.succProMatch.pageStart = (page.number - 1) * page.size + 1;
                            $scope.$$productImport.succProMatch.pageEnd = (page.number - 1) * page.size + page.numberOfElements;
                            $scope.$$productImport.succProMatch.pageTotal = page.totalElements;
                        }, function (response) {
                            toaster.pop('error', '获取信息失败,' + response.data);
                        });
                    }

                }
            });



        /**
         * 失败的产品 选择之后重新匹配的动作
         */
        $scope.matchFailureProduct = function() {
            if(!$scope.$$productImport.failProMatchArr || $scope.$$productImport.failProMatchArr.length < 1) {
                toaster.pop('warning', '选择相应的明细进行匹配');
                return ;
            }
            productImportServie.updateFailureMatch(null, $scope.$$productImport.failProMatchArr, function (data) {
                if(data.data.failure > 0) {
                    toaster.pop('info', '提示', '成功：' + data.data.success + '条，失败：' + data.data.failure + '条');
                }else {
                    toaster.pop('success', '成功：' + data.data.success + '条');
                }
                $scope.matchFailureTable.page(1);
                $scope.matchFailureTable.reload();
                $scope.matchSuccessTable.page(1);
                $scope.matchSuccessTable.reload();
            }, function (response) {
                console.log(response);
                toaster.pop('error', '更新失败，请重新操作');
            });
        };

        $scope.importToProRepository = function () {
            if(!$scope.result || !$scope.result.all || ($scope.result.all < 1) || ($scope.result.success < 1 && $scope.result.failure < 1)) {
                return ;
            };
            productImportServie.importToProRepository({uploadNum :$scope.result.uploadNum}, null, function (data) {
                if(data.code = 1) {
                    $scope.matchFailureTable.reload();
                    $scope.matchSuccessTable.reload();
                    toaster.pop('success', '成功导入：' + data.data + '条');
                }else {
                    toaster.pop('info', '提示', '操作失败' + data.message);
                }
            }, function (response) {
                toaster.pop('error', '操作失败');
            });

        };

        //切换展示的信息
        $scope.toggleActive = function(active) {
            if($scope.tab != active) {
                $rootScope.$$productOn.tab = active;
            }
        };

        // 查看范例
        $scope.showImg = function() {
            var src = $rootScope.rootPath + "/static/img/product/excel_product_import.png", box = $('#image-box');
            box.show();
            box.find('img').attr('src', src);
            box.find('a').click(function(){
                box.hide();
            });
            box.dblclick(function(){
                box.hide();
            });
        };


        //选择文件
        $scope.selectFile = function(value) {
            if(value != null) {
                upload_text.value = value;
            }else {
                var fileInput = angular.element('#uploadProduct')[0];
                upload_text.value = fileInput.value;
            }
        };

        // 上传Excel批量发布（大量）
        $scope.upload = function() {
            var file = $scope.$$productImport.files[0];
            if(!file) {
                toaster.pop('info', '请选择需要上传的文件');
                return;
            }
            $upload.upload({
                url: 'trade/productImport/import/upload',
                file: file,
                method: 'POST'
            }).success(function(data) {
                if(data.code == 1) {
                    $scope.selectFile(' ');
                    $scope.$$productImport.files = [];
                    $scope.result = data.data;
                    toaster.pop('success', "导入成功:" +  ($scope.result.success || 0) + "条，导入失败:" + ($scope.result.importError || 0) + "条");
                }else {
                    toaster.pop('warning', "操作失败，" + data.message);
                }
            }).error(function(response) {
                toaster.pop('error', response.data || response);
            });
        };

        // 下载模板
        $scope.download = function() {
            window.location.href = $rootScope.rootPath + '/trade/productImport/import/template';
            // var show = SessionService.get($scope.userInfo.userUU + "-releasetip");
            // if(!show) {
            //     var modalInstance = $modal.open({
            //         animation: true,
            //         templateUrl : $rootScope.rootPath + '/static/view/vendor/modal/releaseProductByBatchTip.html',
            //         controller : 'releaseProductByBatchTipCtrl',
            //     });
            //
            //     modalInstance.result.then(function(response) {
            //     }, function(res) {
            //         window.location.href = $rootScope.rootPath + '/trade/products/release/template';
            //     });
            // }else {
            //     window.location.href = $rootScope.rootPath + '/trade/products/import/template';
            // }
        };

        //下载未匹配成功的数据
        $scope.downLoadImportError = function(){
            if($scope.result && ($scope.result.importError > 0)) {
                var form = document.getElementById('load-error');
                form.action= 'trade/productImport/failure/xls';
                form.submit();
                Loading.show();
                var intervalId = null;
                var getDownLoadStatus = function () {
                    $.ajax({
                        type: 'GET',
                        url: 'trade/productImport/failure/xls',
                        data : {isAjax : true, uploadNum : $scope.result.uploadNum},
                        dataType : 'json',
                        success: function (data) {
                            if(!data.load) {
                                $scope.$apply(function () {
                                    Loading.hide();
                                    toaster.pop('success', '数据处理完毕，正在下载文件，请稍等。');
                                });
                                clearInterval(intervalId);
                            }
                        },
                        error: function () {
                            Loading.hide();
                            clearInterval(intervalId);
                        }
                    });
                };
                intervalId= setInterval(function () {
                    getDownLoadStatus();
                }, 500);
            }
        };
    }]);
});

