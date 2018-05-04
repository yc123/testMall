/**
 * Created by yujia on 2017/7/11.
 *
 */
define(['app/app'], function (app) {
   'use strict';
    app.register.controller('vendorProductRepostoryCtrl', ['$scope', '$rootScope', 'Material', 'ngTableParams', 'BaseService', 'toaster', 'prodRepositoryService', 'Loading', function ($scope, $rootScope, Material, ngTableParams, BaseService, toaster, prodRepositoryService, Loading) {
        $rootScope.active = 'vendor_productOn';
        $rootScope.$$productOn = {};
        $rootScope.$$productOn.leadIn = 'product_repository';

        $scope.$$productRepository = {};
        $scope.$$productRepository.status = 'matchResult';

        $scope.taggeleToMatchResult = function () {
            if($scope.$$productRepository.status != 'matchResult') {
                $scope.$$productRepository.keyword = null;
                $scope.$$productRepository.status = 'matchResult';
                $scope.matchFailureTable.page(1);
                $scope.matchFailureTable.reload();
            }

        };

        /**
         * 切换状态
         */
        $scope.toggleStatus = function (status) {
            if($scope.$$productRepository.status != status) {
                $scope.$$productRepository.keyword = null;
                if($scope.$$productRepository.status != 'matchResult') {
                    $scope.$$productRepository.prStatus = $scope.$$productRepository.status;
                }
                $scope.$$productRepository.status = status;
                $scope.$$productRepository.failProMatchArr = [];
                $scope.ngRepositoryTable.page(1);
                $scope.ngRepositoryTable.reload();
            }
        };

        $scope.onSearch = function () {
            $scope.ngRepositoryTable.page(1);
            $scope.ngRepositoryTable.reload();
        };

        $scope.ngRepositoryTable = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                id : 'desc'
            }
        }, {
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                if($scope.$$productRepository.keyword) {
                    param.keyword = $scope.$$productRepository.keyword;
                }
                param.type = $scope.$$productRepository.status;
                Material.getAll(param, function (page) {
                    $scope.$$productRepository.totalElements = page.totalElements;
                    if(!$scope.$$productRepository.totalElements) {
                        $scope.$$productRepository.start = 0;
                    }else {
                        $scope.$$productRepository.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }
                    $scope.$$productRepository.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                }, function (response) {
                })
            }
        });

        // 下载模板
        $scope.download = function() {
            if ($scope.$$productRepository.totalElements == 0) {
                toaster.pop('info', '当前产品列表为空，无法下载');
                return;
            }
            downloadByJs('trade/products/template/download/type', $scope.$$productRepository.status, $scope.$$productRepository.keyword);
        };

        function downloadByJs(url, type, keyword) {
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'POST');
            form.attr('action', url + "?type=" + type + "&keyword=" + (keyword || ''));

            $('body').append(form);  //将表单放置在web中
            form.submit();
            $scope.$$productRepository.clockID = setInterval(function() {
                getDownLoadStatus(type, keyword)
            }, 500);
        };

        var getDownLoadStatus = function (type,keyword) {
            Loading.show();
            $.ajax({
                url : 'trade/products/template/download/type',
                data : {isAjax : true, type : type, keyword : (keyword || '')},
                method : 'POST',
                dataType : 'json',
                success : function (data) {
                    if(!data.loading){
                        $scope.$apply(function () {
                            toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                            Loading.hide();
                        });
                        if($scope.$$productRepository.clockID) {
                            clearInterval($scope.$$productRepository.clockID);
                        }
                    }
                },
                error : function () {
                    Loading.hide();
                    if($scope.$$productRepository.clockID) {
                        clearInterval($scope.$$productRepository.clockID);
                    }
                }
            });
        };

        /**
         * 关闭的匹配结果页
         */
        $scope.close = function () {
            $scope.$$productRepository.matchError = false;
            $scope.toggleStatus($scope.$$productRepository.prStatus);
        };
        
        $scope.matchAll = function () {
            
            prodRepositoryService.matchAll({type: 'all'}, function (data) {
                if(data.code == 1) {
                    toaster.pop('success', '成功匹配' + data.data.size + '条,待处理' + data.data.fail + "条");
                    $scope.$$productRepository.result = {};
                    $scope.$$productRepository.result.success = data.data.size;
                    $scope.$$productRepository.result.fail = data.data.fail;
                    if(data.data.fail) {
                        $scope.$$productRepository.prStatus = $scope.$$productRepository.status;
                        $scope.$$productRepository.matchError = true;
                        $scope.$$productRepository.status = 'matchResult';
                    }
                }else {
                    toaster.pop('warning', data.message);
                }
            }, function (response) {
                console.log(response);
            });
        }

        /**
         * 匹配失败的ngtable
         * @type {any}
         */
        $scope.matchFailureTable = new ngTableParams({
            count : 10,
            page : 1,
            sorting : {
                matchsize : 'asc',
                id : 'desc'
            }
        }, {
            total : 0,
            getData : function($defer, params) {
                var param = BaseService.parseParams(params.url());
                param.type = "nStandard";
                Material.getAll(param, function (page) {
                    $scope.$$productRepository.failProMatch = {};
                    $scope.$$productRepository.failProMatch.totalElements = page.totalElements;
                    $scope.$$productRepository.failProMatch.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    $scope.$$productRepository.failProMatch.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                }, function (response) {
                });

            }
        });

        /**
         * 用户选择指定的明细记录作为匹配此产品的记录
         * @param item 明细
         * @param failureImport 主记录
         */

        $scope.chooseThisComponet = function(item, nProduct) {
            if(nProduct.standard) {
                toaster.pop('warning', '提示', '当前的状态已是标准状态');
                return ;
            }
            if(!$scope.$$productRepository.failProMatchArr) {
                $scope.$$productRepository.failProMatchArr =  [];
            }
            //取消其他的明细
            angular.forEach(nProduct.matchresults, function (detail) {
                if(detail.id != item.id) {
                    detail.checked = false;
                    $scope.$$productRepository.failProMatchArr = $scope.$$productRepository.failProMatchArr.filter(function (detaill) {
                        return detaill.detailid != detail.id;
                    });
                };
            });
            if(item.checked) {
                var obj = {};
                obj.masterid = nProduct.id;
                obj.detailid = item.id;
                $scope.$$productRepository.failProMatchArr.push(obj);
            }else {
                $scope.$$productRepository.failProMatchArr = $scope.$$productRepository.failProMatchArr.filter(function (detail) {
                    return detail.detailid != item.id;
                });
            };
        };

        /**
         * 更新非标的匹配信息
         */
        $scope.updateNStandard = function () {
            if($scope.$$productRepository.failProMatchArr.length < 1) {
                return ;
            }
            prodRepositoryService.updateMatch(null, $scope.$$productRepository.failProMatchArr, function (data) {
                if(data.code == 1) {
                    var message = "";
                    if(data.data.success) {
                        message = message +  '匹配成功' + data.data.success + '条';
                    }
                    if(data.data.fail) {
                        if(!message) {
                            message = message +  '匹配失败' + data.data.fail + '条，失败的原因可能是当前器件已被转为标准';
                        }else {
                            message = message +  '，匹配失败' + data.data.fail + '条，失败的原因可能是当前器件已被转为标准';
                        }
                    }
                    if(data.data.redundance) {
                        if(!message) {
                            message = message +  '其中匹配成功中存在冗余' + data.data.redundance + '条，已为您自动合并';
                        }else {
                            message = message +  '，其中匹配成功中存在冗余' + data.data.redundance + '条,已为您自动合并';
                        }
                    }
                    if(message) {
                        toaster.pop('success', message);
                    }else {
                        toaster.pop('info', '您没有匹配任何信息');
                    }
                    $scope.matchFailureTable.page(1);
                    $scope.matchFailureTable.reload();
                    $scope.$$productRepository.failProMatchArr = [];
                }else {
                    toaster.pop('success', '操作失败：' + data.message);
                }
            }, function (response) {
                console.log(response);
            });
        }
    }]);
});