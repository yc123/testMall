/**
 * Created by yujia on 2017/3/17.
 *
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('invoiceCtrl', ['$scope', '$rootScope', 'toaster', '$modal', '$q', 'Bill', '$upload', '$http', '$location', '$stateParams', '$state', function($scope, $rootScope, toaster, $modal, $q, Bill, $upload, $http, $location, $stateParams, $state) {
        $rootScope.active = 'buyer_invoice';
        $scope.tab = 'buyer_invoice';
        document.title = '开票信息-优软商城';
        $scope.invoiceType = 1205;
        $scope.isSpecial = true; //专票，等于true为不存在
        $scope.isNormal = true; //普票，等于true为不存在
        // 获取发票信息方法	1205为增值税专用发票	1206为增值税普通发票	1207为不开发票
        var getInvoiceInfo = function() {
            Bill.getListPersonal(null, function(data) {
                $scope.invoices = data;
                angular.forEach($scope.invoices, function (item) {
                    if(item.kind == '1205'){
                        $scope.isSpecial = false;
                    } else if (item.kind == '1206') {
                        $scope.isNormal = false;
                    }
                })
            }, function(response) {
                toaster.pop('error', '获取发票信息失败 ' + response.data);
            });
        };
        getInvoiceInfo();
        // $scope.bill = {};
        // 获取省市区地理信息
        var getGeoInfo = function () {
            $http.get('static/js/prod/data/city.json').success(function(data) {
                $scope.division = data;
                if($scope.bill.area){
                    $scope.bill.address = {};
                    //拼装下拉选择框
                    var arr = $scope.bill.area.split(',');
                    $scope.bill.address.province = arr[0];
                    $scope.bill.address.city = arr[1];
                    $scope.bill.address.district = arr[2];
                }
            }).error(function(e) {
                toaster.pop('error', '系统错误 ' + '加载城市信息失败， 请重新加载界面！');
            });
        };
        getGeoInfo();

        $scope.bill = {};
        $scope.bill.address = {};

        //保存发票信息
        $scope.saveBill = function(flag) {
            var dataValidFlag = $scope.checkValidFrom();
            if (!flag && dataValidFlag && $scope.bill.is_agree) {
                $scope.bill.kind = $scope.billType
                if (!$scope.isAdd) { //修改
                    doSave('修改发票信息');
                } else { // 新增
                    doSave('添加发票');
                }
            } else if (flag || !dataValidFlag) {
                toaster.pop('error', '请填写正确的发票信息');
            } else {
                toaster.pop('error', '请勾选并阅读《发票须知》');
            }
        };
        var doSave = function (message) {
            $scope.bill.area = $scope.bill.address.province + "," + $scope.bill.address.city + "," + $scope.bill.address.district;
            var file = null;
            if($scope.bill.billInfo&&$scope.bill.billInfo[0]) {
                file = $scope.bill.billInfo[0];
            }
            $upload.upload({
                url: 'trade/bill/save',
                file: file,
                method: 'POST',
                data: {
                    bill: $scope.bill
                }
            }).success(function(data){
                toaster.pop('success', message + '成功');
                $scope.changeBillStatusFlag = false
                $state.reload();
            }).error(function(data){
                toaster.pop('error', message + '失败 ' + data);
            });
        }

        $scope.isDoUpload = false;
        //上传发票许可证
        $scope.onUploadPermission = function () {
            $scope.isDoUpload = true;
            // console.log($scope.bill.billInfo);
            if ($scope.bill.billInfo[0].size < 3*1024*1024) {
                $scope.bill.attachUrl = $scope.bill.billInfo[0].name;
            } else {
                $scope.bill.attachUrl = '';
            }
        }

        //判断中文字符串的长度
        var getRealStringLen = function (str) {
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        }

        $scope.validForm = {
            validBillHead: true,
            validBillName: true,
            validBankName: true,
            validDetailAddress: true,
            validCompanyAddress: true
        }

        $scope.initFormFlag = function () {
            $scope.initFlag = {
                initBillHead: true,
                initBillName: true,
                initBankName: true,
                initDetailAddress: true,
                initCompanyAddress: true,
                initCompanyPhone: true,
                initCompanyTaxNum: true,
                initBankAccount: true,
                initTelephone: true
            }
        }

        $scope.initFormFlag();

        $scope.checkValidFrom = function () {
            var flag = true
            angular.forEach($scope.validForm, function (item) {
                if (!item) {
                    flag = false;
                }
            })
            return flag;
        }
        $scope.checkValidFrom();
        //发票抬头check
        $scope.checkBillHead = function () {
            var len = getRealStringLen($scope.bill.head);
            if (len > 100) {
                $scope.validForm.validBillHead = false;
            } else {
                $scope.validForm.validBillHead = true;
            }
        }

        //收票人check
        $scope.checkBillName = function () {
            var len = getRealStringLen($scope.bill.name);
            if (len > 20) {
                $scope.validForm.validBillName = false;
            } else {
                $scope.validForm.validBillName = true;
            }
        }

        //开户银行Check
        $scope.checkBankName = function () {
            var len = getRealStringLen($scope.bill.bankName);
            if (len > 60) {
                $scope.validForm.validBankName = false;
            } else {
                $scope.validForm.validBankName = true;
            }
        }

        //详细地址Check
        $scope.checkDetailAddress = function () {
            var len = getRealStringLen($scope.bill.detailAddress);
            if (len > 60) {
                $scope.validForm.validDetailAddress = false;
            } else {
                $scope.validForm.validDetailAddress = true;
            }
        }

        //单位地址check
        $scope.checkCompanyAddress = function () {
            var len = getRealStringLen($scope.bill.companyAddress);
            if (len > 100) {
                $scope.validForm.validCompanyAddress = false;
            } else {
                $scope.validForm.validCompanyAddress = true;
            }
        }

        //设置新增栏目切换发票类型
        $scope.billType = 1206
        //设置发票类型
        $scope.setType = function() {
            angular.forEach($scope.invoices, function (item) {
                if(item.kind == '1205'){
                    $scope.isSpecial = false;
                } else if (item.kind == '1206') {
                    $scope.isNormal = false;
                }
            })
            if (!$scope.isNormal) {
                $scope.billType = 1205
            }
            if (!$scope.isSpecial) {
                $scope.billType = 1206
            }
        };
        //设置修改区域显示标志
        $scope.changeBillStatusFlag = false;
        $scope.showDeleteBox = false
        $scope.setChangeBillStatusFlag = function (flag) {
            $scope.changeBillStatusFlag = flag;
            if (!flag) {
                $scope.bill = {};
            }
        }
        $scope.exitEdit = function () {
            $state.reload();
        }
        $scope.addBill = function () {
            $scope.setType();
            $scope.bill = {};
            $scope.changeBillStatusFlag = true;
            $scope.isAdd = true;
        }
        $scope.setBillType = function (type) {
            $scope.bill = {};
            $scope.initFormFlag();
            $scope.billType = type;
            this.form.$setPristine();
            this.form.$setUntouched();
        }
        //修改发票
        $scope.modifyInvoice = function (invoice) {
            $scope.changeBillStatusFlag = true;
            $scope.isAdd = false;
            $scope.billType = invoice.kind
            $scope.bill = invoice;
            $scope.bill.is_agree = true;
            $scope.bill.address = {};
            var area = invoice.area.split(',');
            angular.forEach(area, function (item, index) {
                switch(index) {
                    case 0:
                        $scope.bill.address.province = item;
                        break;
                    case 1:
                        $scope.bill.address.city = item;
                        break;
                    case 2:
                        $scope.bill.address.district = item;
                        break;
                }
            });
        };
        //删除按钮点击
        $scope.deleteInvoice = function (invoice) {
            $scope.tempDeleteId = invoice.id //删除发票临时存放
            $scope.setDeleteBox(true)
        }
        //设置提示框状态
        $scope.setDeleteBox = function (flag) {
            $scope.showDeleteBox = flag
        }
        //确定删除
        $scope.doDeleteInvoice = function () {
            Bill.deleteById({id: $scope.tempDeleteId}, null, function (data) {
                toaster.pop('success', '删除发票成功')
                $state.reload();
            }, function (error) {
                toaster.pop('error', '删除发票失败')
            })
        }
    }]);

    // 发票详情
    app.register.controller('BillInfoCtrl', ['$scope', '$modalInstance', 'invoice', function($scope, $modalInstance, invoice) {
        $scope.bill = invoice;
        $scope.dismiss = function() {
            $modalInstance.dismiss();
        }
    }]);

    // 发票编辑模态框
    // app.register.controller('BillInputCtrl', ['$scope', '$http', 'BaseService', 'Bill', 'toaster', '$stateParams', '$state', 'invoiceInfo', '$upload', '$modalInstance', '$q', function($scope, $http, BaseService, Bill, toaster, $stateParams, $state, invoiceInfo, $upload, $modalInstance, $q) {
    //     //BaseService.scrollBackToTop();
    //
    //     $scope.bill = {};
    //     $scope.bill.address = {};
    //     $scope.bill.is_agree = true;
    //     $scope.linkError = false;
    //     $scope.addressError = false;
    //     $scope.bill.kind = Number(invoiceInfo.split("-")[0]);
    //     if(invoiceInfo.split("-").length == 2) {
    //         $scope.invoiceId = Number(invoiceInfo.split("-")[1]);
    //     }
    //     $scope.setType = function() {
    //         switch($scope.bill.kind) {
    //             case 1206:
    //                 $scope.isNormal = true;
    //                 $scope.isSpecial = false; break;
    //             case 1205:
    //                 $scope.isNormal = false;
    //                 $scope.isSpecial = true; break;
    //             default:
    //                 $scope.isNormal = true;
    //                 $scope.isSpecial = true;
    //         }
    //     };
    //
    //     //设置发票类型
    //     $scope.setType();
    //
    //     //获取发票信息
    //     $scope.getData = function() {
    //         if($scope.invoiceId) {
    //             return Bill.getBillById({id: $scope.invoiceId}, function(data) {
    //                 $scope.bill = data;
    //                 $scope.bill.is_agree = true;
    //                 $scope.setType();
    //             }, function(response) {
    //                 toaster.pop('error', '获取指定的发票信息失败');
    //             });
    //         }
    //     };
    //
    //     $scope.linkmanLen = function()　{
    //         var size = $scope.bill.name.length;
    //         // if (num == 1){
    //         //     size = document.getElementById("mpbillname").value.length;
    //         // }else if (num == 2){
    //         //     size = document.getElementById("mzbillname").value.length;
    //         // }
    //         if (size > 10) {
    //             $scope.linkError = true;
    //             return;
    //         }
    //         $scope.linkError = false;
    //     };
    //
    //     $scope.addressLen = function()　{
    //         var size = $scope.bill.detailAddress.length;
    //         // if (num == 1){
    //         //     size = document.getElementById("mpaddress").value.length;
    //         // }else if (num == 2){
    //         //     size = document.getElementById("mzaddress").value.length;
    //         // }
    //         if (size > 30) {
    //             $scope.addressError = true;
    //             return;
    //         }
    //         $scope.addressError = false;
    //     };
    //
    //     //等到获取到发票信息，
    //     $q.all([$scope.getData().$promise]).then(function () {
    //         $http.get('static/js/prod/data/city.json').success(function(data) {
    //             $scope.division = data;
    //             if($scope.bill.area){
    //                 $scope.bill.address = {};
    //                 //拼装下拉选择框
    //                 var arr = $scope.bill.area.split(',');
    //                 $scope.bill.address.province = arr[0];
    //                 $scope.bill.address.city = arr[1];
    //                 $scope.bill.address.district = arr[2];
    //             }
    //         }).error(function(e) {
    //             toaster.pop('error', '系统错误 ' + '加载城市信息失败');
    //         });
    //     }, function () {
    //         //ERROR
    //     });
    //
    //     //保存发票信息
    //     $scope.saveBill = function() {
    //         $scope.bill.area = $scope.bill.address.province + "," + $scope.bill.address.city + "," + $scope.bill.address.district;
    //         var file = null;
    //         if($scope.bill.billInfo&&$scope.bill.billInfo[0]) {
    //             file = $scope.bill.billInfo[0];
    //         }
    //         $upload.upload({
    //             url: 'trade/bill/save',
    //             file: file,
    //             method: 'POST',
    //             data: {
    //                 bill: $scope.bill
    //             }
    //         }).success(function(data){
    //             toaster.pop('success', '保存发票信息成功');
    //             $modalInstance.close(data);
    //         }).error(function(data){
    //             toaster.pop('error', '保存发票信息失败');
    //         });
    //     };
    //
    //     //取消发票信息操作
    //     $scope.exit = function() {
    //         $modalInstance.dismiss();
    //     }
    //
    // }]);
});