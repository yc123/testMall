/**
 * Created by yujia on 2017/7/9.
 *
 */
define(['app/app'], function (app) {
    'use strict';
    app.register.controller('vendorRepositoryCtrl', ['$scope', '$rootScope', 'ngTableParams', 'toaster', 'Material', 'BaseService', 'Enterprise', 'stockInOutService', function ($scope, $rootScope, ngTableParams, toaster, Material, BaseService, Enterprise, stockInOutService) {
        $rootScope.active = 'vendor_repository';

        $scope.$$repository = {};

        //库存的信息
        $scope.$$stock = {};
        $scope.keyword = "";

        $scope.status = 'standard';

        $scope.maxPackQty = 999999;

        $scope.toggleStandardStatus = function (status) {
            if($scope.status != status) {
                $scope.status = status;
                $scope.keyword = "";
                $scope.ngRepositoryTable.page(1);
                $scope.ngRepositoryTable.reload();
            }
        };
        $scope.ngRepositoryTable = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                id : 'desc'
            }
        }, {
            total : 0,
            getData : function($defer, params) {
                var param = BaseService.parseParams(params.url());
                if($scope.keyword) {
                    param.keyword = $scope.keyword;
                }
                param.type = $scope.status;
                Material.getAll(param, function (page) {
                    $scope.$$repository.totalElements = page.totalElements;
                    if(Number(page.totalElements) > 0) {
                        $scope.$$repository.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }else {
                        $scope.$$repository.start = 0;
                    }
                    $scope.$$repository.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                    $scope.currenctMaterial = page.content;
                    angular.forEach($scope.currenctMaterial, function (data) {
                        if(data.minPackQty == null || data.minPackQty == 0){
                            data.minPackQty = 1;
                        }
                    })
                }, function (response) {
                });
            }
        });

        /**
         * 编辑
         * @param product
         */
        $scope.editProduct = function (product) {
            detailDisplayNone(product);
            product.stockOut = true;
            product.stockIn = false;
            product.displayDetail = false;
            $scope.currentPro.packaging = product.packaging;
            $scope.currentPro.minPackQty = product.minPackQty;
            $scope.currentPro.produceDate = product.produceDate;
            getCurrencyByRegisterAddress();
        };

        /**
         * 出库/入库动作
         */
        $scope.stockInAndOut = function (product) {
            detailDisplayNone(product);
            product.stockIn = true;
            product.stockOut = false;
            product.displayDetail = false;
            product.defaultValue = "1";
            $scope.currentStock = { };
            $scope.isStockIn = false;
            $scope.currentStock.currentIsStockIn = $scope.isStockIn;
            getCurrencyByRegisterAddress();
        };

        /**
         * 展示出入库明细
         * @param product
         */
        $scope.displayDetail = function (product) {
            detailDisplayNone(product);
            product.stockOut = false;
            product.stockIn = false;
            product.displayDetail = !product.displayDetail;
            if(!product.detailStockInOut || product.detailStockInOut.length < 1) {
                stockInOutService.getstockInOutHist({productId : product.id}, function (data) {
                    product.detailStockInOut = data;
                }, function (response) {
                    toaster.pop('error', '获取明细失败');
                });
            }
        };

        $scope.currentPro = { };
        // 保存对产品包装，包装数量，生产日期的修改
        $scope.updateProduct = function (product) {
            if($scope.currentPro.packaging == null ){
                $scope.currentPro.packaging = "";
            }
            if($scope.currentPro.packaging.length > 10){
                toaster.pop('warning', '提示', '包装字符数必须小于10');
                return ;
            }
            if($scope.currentPro.produceDate == null ){
                $scope.currentPro.produceDate = "";
            }
            if($scope.currentPro.produceDate.length > 20){
                toaster.pop('warning', '提示', '生产日期字符数必须小于20');
                return ;
            }
            if($scope.currentPro.minPackQty == null ){
                $scope.currentPro.minPackQty = "";
            }
            if(Number($scope.currentPro.minPackQty) < 1 && $scope.currentPro.minPackQty.length > 0 ) {
                toaster.pop('warning', '提示', '包装数量必须大于0');
                return ;
            }
            if(Number($scope.currentPro.minPackQty) % 1 != 0 && $scope.currentPro.minPackQty.length > 0){
                toaster.pop('warning', '提示', '包装数量必须为整数');
                return ;
            }
            if(Number($scope.currentPro.minPackQty) > $scope.maxPackQty) {
                toaster.pop('warning', '提示', '包装数量必须小于' + $scope.maxPackQty);
                return ;
            }
            var updateProduct = { };
            updateProduct.id = product.id;
            updateProduct.standard = product.standard;
            updateProduct.packaging = $scope.currentPro.packaging;
            updateProduct.minPackQty = $scope.currentPro.minPackQty;
            updateProduct.produceDate = $scope.currentPro.produceDate;
            Material.updateProduct(updateProduct, function(response){
                product.stockOut = false;
                if(response.data == "success"){
                    $scope.currentPro = { };
                    $scope.ngRepositoryTable.reload();
                    toaster.pop('success', '保存成功');
                }
            })
        };
        /**
         * 将对应出入库的展示值设置为false
         * @param product
         */
        var detailDisplayNone = function (product) {
            var arr = $scope.ngRepositoryTable.data;
            angular.forEach(arr, function (detail) {
                if(detail.id != product.id) {
                    detail.stockOut = false;
                    detail.stockIn = false;
                    detail.displayDetail = false;
                }
            });
        };

        /**
         * 向后台发起请求，根据注册地址获取币别信息
         */
        var getCurrencyByRegisterAddress = function () {
            if($scope.$$repository.currency) {
               return ;
            }
            Enterprise.getCurrencyByRegisterAddress(null, function (data) {
                if(data.code == 1) {
                    $scope.$$repository.currency = data.data;
                }else {
                    toaster.pop('warning', '提示', '您的币别的信息不能确定，' + data.message);
                }
            }, function (response) {
                console.log(response);
                toaster.pop('error', '获取您公司的币别信息失败，请重新刷新界面');
            });
        };
        $scope.onSearch = function (event) {
            $scope.ngRepositoryTable.page(1);
            $scope.ngRepositoryTable.reload();
        };

        // 下载模板
        $scope.download = function() {
            if ($scope.currenctMaterial && $scope.currenctMaterial.length == 0) {
                toaster.pop('info', '当前产品列表为空，无法下载');
                return;
            }
            if ('standard' == $scope.status)
                downloadByJs('trade/products/template/download/type', $scope.keyword, 'standard');
            if ('nStandard' == $scope.status)
                downloadByJs('trade/products/template/download/type', $scope.keyword, 'nStandard');
        };

        function downloadByJs(url, keyword, type) {
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'post');
            form.attr('action', url);

            var input1 = $('<input>');
            input1.attr('type', 'hidden');
            input1.attr('name', 'keyword');
            input1.attr('value', keyword);

            var input1 = $('<input>');
            input1.attr('type', 'hidden');
            input1.attr('name', 'type');
            input1.attr('value', type);

            $('body').append(form);  //将表单放置在web中
            form.append(input1);   //将查询参数控件提交到表单上
            form.submit();
        }

        $scope.$$repository.defaultValue = 1;

        // 出库入库状态切换
        $scope.toggleInOut = function(standardPro){
            $scope.isStockIn = standardPro.defaultValue == 2 ? true : false;
            $scope.currentStock.currentIsStockIn = $scope.isStockIn;
        };

        /**
         * 保存出入库的动作
         * @param product
         * @param isStockIn
         */
        $scope.currentStock = { };
        $scope.stockInMainten = function (product) {
            $scope.$$stock.stockQty = $scope.currentStock.stockQty;
            $scope.$$stock.cost = $scope.currentStock.cost;
            $scope.$$stock.repository = $scope.currentStock.repository;
            $scope.$$stock.currency = $scope.$$repository.currency;
            if(!validStockData($scope.currentStock.currentIsStockIn)) {
                return ;
            }
            $scope.$$stock.prodid = product.id;
            stockInOutService.save({isStockIn : $scope.currentStock.currentIsStockIn}, $scope.$$stock, function (data) {
                if(data.code == 1) {
                    if(!product.detailStockInOut) {
                        product.detailStockInOut = [];
                    }
                    product.detailStockInOut.push(data.data);
                    toaster.pop('success', '保存成功');
                    product.stockIn = false;
                    product.stockOut = false;
                    product.displayDetail = false;
                    $scope.$$stock = {};
                    $scope.currentStock = { };
                    $scope.isStockIn = false;
                    $scope.currentStock.currentIsStockIn = $scope.isStockIn;
                    $scope.ngRepositoryTable.reload();
                }else {
                    toaster.pop('warning', '提示', '保存失败，' + data.message);
                }
            }, function (response) {
                toaster.pop('error', '保存失败');
            });
        };
        var validStockData = function(isStockIn) {
            if(isStockIn) {
                if(!$scope.$$stock.stockQty) {
                    toaster.pop('warning', '提示', '请填写入库的数量');
                    return false;
                }
                if(isNaN($scope.$$stock.stockQty)) {
                    toaster.pop('warning', '提示', '入库的数量中包含不是数字的信息');
                    return false;
                }
                if(Number($scope.$$stock.stockQty) < 1) {
                    toaster.pop('warning', '提示', '入库的数量必须大于0');
                    return false;
                }
            }else {
                if(!$scope.$$stock.stockQty) {
                    toaster.pop('warning', '提示', '请填写出库的数量');
                    return false;
                }
                if(isNaN($scope.$$stock.stockQty)) {
                    toaster.pop('warning', '提示', '出库的数量中包含不是数字的信息');
                    return false;
                }
                if(Number($scope.$$stock.stockQty) < 1) {
                    toaster.pop('warning', '提示', '出库的数量必须大于0');
                    return false;
                }
            }

            if($scope.$$stock.cost) {
                if(isNaN($scope.$$stock.cost)) {
                    toaster.pop('warning', '提示', '成本信息中包含不是数字的信息');
                    return false;
                }
                if(Number($scope.$$stock.cost) <= 0) {
                    toaster.pop('warning', '提示', '成本必须大于0');
                    return false;
                }
            }

            return true;
        };
        /**
         * 清空之前的数据
         * @param product
         */
        $scope.stockCancle = function (product) {
            product.stockOut = false;
            product.stockIn = false;
            product.displayDetail = false;
            $scope.$$stock = {};
            $scope.currentPro = { };
            $scope.currentStock = { };
        }
    }]);

    app.register.filter('ioSellerFilter', function () {
        return function (type) {
            var result = '暂无对应状态';
            switch (type) {
                case 1666:
                    result = '入库';
                    break;
                case 1667:
                    result = '出库';
                    break;
                case 1668:
                    result = '销售';
                    break;
            }
            return result ;
        }
    });
});