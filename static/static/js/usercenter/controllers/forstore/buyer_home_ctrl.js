/**
 * Created by yujia on 2017/3/17.
 *
 */
define(['app/app', 'calendar'], function(app) {
    app.register.controller('homeCtrl', ['$scope', '$rootScope', 'Recommendation', 'ShippingAddress', 'Bill', '$q', 'toaster', '$modal', 'Goods', 'StoreInfo', function ($scope, $rootScope, Recommendation, ShippingAddress, Bill, $q, toaster, $modal, Goods, StoreInfo) {
        $rootScope.active = 'home';
        document.title='买家中心-优软商城';
        $scope.userInfo = $rootScope.userInfo;
        var getRecommendComps = function (userUU, usedFor, pageable) {
            Recommendation.getRecommendComps({page: pageable.page, size: pageable.size}, function (data) {
                $scope.recommendComps = data.content;
            }, function (error) {
                toaster.pop('error', '获取推荐器件失败', error);
            })
        };
        getRecommendComps(null, null, {page: 0, size: 12});

        //安全设置提醒框
      $scope.openHomeCenterModel = function() {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: $rootScope.rootPath + '/static/view/usercenter/modal/homeCenter_modal.html',
          controller:'homeModalCtrl'
        });
        modalInstance.result.then(function(){
        }, function(){
        });
      }

        //安全级别
        if(!($scope.userInfo.pwdEnable && $scope.userInfo.haveUserQuestion && $scope.userInfo.userEmail)){
          $scope.openHomeCenterModel();
        }

        /**
         * 获取推荐新店信息
         */
        var getRecommendStore = function () {
            StoreInfo.getNewStore({}, {}, function (store) {
                $scope.store = store;
                Goods.findCommodityAndKindNumberByStore({ storeUuid : store.uuid}, {}, function (data) {
                    $scope.store.commodityCount = data.commodityCount;
                    $scope.store.kindCount = data.kindCount;
                }, function () {
                    $scope.store.commodityCount = 0;
                    $scope.store.kindCount = 0;
                });
            }, function () {
                $scope.store = null;
                toaster.pop('error', '获取新开店铺信息失败');
            });
        };
        getRecommendStore();

        /**
         * 获取热卖推荐信息
         *
         * @param pageable      分页参数信息
         */
        var getRecommendGoods = function (pageable) {
            Goods.randomGetHotCommodity({page: pageable.page, size: pageable.size}, {}, function (page) {
                $scope.recommendGoods = page.content || [];
            }, function () {
                $scope.recommendGoods = [];
                toaster.pop('error', '获取热卖推荐失败');
            });
        };
        getRecommendGoods({page : 1, size : 4});

        // 加载用户收货地址
        var loadAddrs = function(isLast){
            return ShippingAddress.get({send: false}, function(data) {
                //为每个设置选择状态
                angular.forEach(data, function(addr){
                    addr.isSelect = false;
                });
                $scope.addrs = data;
                setDefaultAddr(isLast);
            }, function(response) {
                toaster.pop('error', '系统错误', '获取收货地址失败');
            });
        };

        // 设置默认地址
        var setDefaultAddr = function(isLast) {
            if ($scope.addrs.length > 0) {
                var prevAddrId= $scope.selectAddress ? $scope.selectAddress.id : undefined;// 之前选择的地址的id，修改该地址后应该仍然选中该地址
                $scope.selectAddress = isLast ? $scope.addrs.last() : $scope.addrs.first(); // 设置地址
                // 如果之前选中过地址，则更新后仍然选择该地址(该id的地址还存在的话)
                if (prevAddrId) {
                    for(var addr in $scope.addrs) {
                        if (addr.id == prevAddrId) {
                            addr.isSelect = true;
                            $scope.selectAddress = addr;
                            break;
                        }
                    }
                }
            }
        };


        //编辑收货地址
        $scope.editAddr = function(isSetTop, addr) {
            $scope.isnotCheck = true;
            $modal.open({
                templateUrl : $rootScope.rootPath + '/static/view/common/modal/edit_address_modal.html',
                controller : 'editAddrHomeCtrl',
                size : 'lg',
                resolve : {
                    isSetTop : function(){
                        //必须用 angular.copy深拷贝一份
                        return angular.copy(isSetTop);
                    },
                    addr : function(){
                        return angular.copy(addr);
                    },
                    isModify : function () {
                        if (addr){
                            return true;
                        }else {
                            return false;
                        }
                    }
                }
            }).result.then(function(address){
                if(!addr) {
                    loadAddrs(true);
                }else {
                    loadAddrs();
                }

            }, function(reason){
                toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
            });
        };


        // 获取发票信息方法	1205为增值税专用发票	1206为增值税普通发票	1207为不开发票
        var getInvoiceInfo = function() {
            return Bill.getListPersonal(null, function(data) {
                $scope.specialInvoice = {};
                angular.forEach(data, function(bill) {
                    if(bill.kind == 1205) {
                        $scope.specialInvoice = bill;
                    }else if(bill.kind == 1206) {
                        $scope.normalInvoice = bill;
                    }
                });
                $scope.invoiceType = 1205;
                $scope.selectInvoiceType(1205); // --1205专用增值税发票   --1206普通发票  --1207不开发票
            }, function(response) {
                toaster.pop('error', '获取发票信息失败 ' + response.data);
            });
        };

        $scope.modifyInvoice = function(invoice) {
            $modal.open({
                templateUrl : 'static/view/prod/modal/edit-invoice-modal.html',
                controller : 'BillInputCtrl',
                size : 'lg',
                resolve : {
                    invoiceInfo: function() {
                        if($scope.invoiceType == 1205) {
                            return 1205 + "-" +invoice.id;
                        }
                        if($scope.invoiceType == 1206) {
                            return 1206 + "-" +invoice.id;
                        }
                    }
                }
            }).result.then(function(invoice){
                if(invoice) {
                    getInvoiceInfo();
                }
            }, function(reason){
                toaster.pop('info', '提示 ' + '您已取消编辑发票信息');
            });
        };

        // 选择发票类型
        $scope.selectInvoiceType = function(type) {
            switch(type) {
                case 1207 :
                    $scope.selecInvoice = {};
                    $scope.needCreateInvoice = false;
                    break;
                case 1205 :
                    $scope.selecInvoice = $scope.specialInvoice;
                    if(!$scope.specialInvoice) {
                        $scope.needCreateInvoice = true;
                    }
                    break;
                case 1206 :
                    $scope.selecInvoice = $scope.normalInvoice;
                    if(!$scope.normalInvoice) {
                        $scope.needCreateInvoice = true;
                    }
                    break;
            }
        };

        var init = function () {
            $q.all([loadAddrs().$promise, getInvoiceInfo().$promise]).then(function(){
                setDefaultAddr(); // 设置默认地址
            });
        };
        init();
        
        /**
         *  日历组件
         * 
         */
        $('#date').calendar({
            width: 270,
            height: 220
        });
    }]);
    
  app.register.controller('homeModalCtrl', ['$rootScope', '$scope',  '$modalInstance', 'toaster', '$http', 'ShippingAddress','$state', function($rootScope, $scope, $modalInstance, toaster, $http, ShippingAddress,$state){
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          $modalInstance.dismiss();
    })
    $scope.goLink = function(op){
      $state.go('account_manager',{op:op});
      $modalInstance.dismiss('cancel');
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
  }]);

    //地址编辑模态框
    app.register.controller('editAddrHomeCtrl', ['$scope', 'isSetTop', 'isModify', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, isSetTop, isModify, addr, $modalInstance, toaster, $http, ShippingAddress){
        if (addr){
            $scope.isSetTop = addr.num == 1;
        }else {
            $scope.isSetTop = isSetTop;
        }
        $scope.isModify = isModify;
        //验证数据
        $scope.checkeds = {};

        $scope.checkForm = function(num) {
            var size;
            if(num == 1) {
                if ($scope.address.name){
                    size = $scope.address.name.replace(/[^\x00-\xff]/g,'**').length;
                    if (size > 20) {
                        console.log(size);
                        $scope.userError = true;
                        return;
                    }
                    $scope.userError = false;
                }
            } else if(num == 2) {
                if ($scope.address.tel){
                    size = $scope.address.tel.replace(/[^\x00-\xff]/g,'**').length;
                    if (size < 8 || size > 11) {
                        $scope.telError = true;
                        return;
                    }
                    $scope.telError = false;
                    var telPatt = new RegExp("^[0-9]+$");
                    if (telPatt.test($scope.address.tel)){
                        $scope.telPatternError = false;
                    }else {
                        $scope.telPatternError = true;
                    }
                }
            } else if(num == 3) {
                if ($scope.address.detailAddress){
                    size = $scope.address.detailAddress.replace(/[^\x00-\xff]/g,'**').length;
                    if (size > 60) {
                        $scope.addrError = true;
                        return;
                    }
                    $scope.addrError = false;
                }
            } else if(num == 4) {
                var emailPatt = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
                if ($scope.address.email.length > 0 && !emailPatt.test($scope.address.email)){
                    $scope.emailPatternError = true;
                }else {
                    $scope.emailPatternError = false;
                }
            }
        };

        $http.get('static/js/prod/data/city.json').success(function(data) {
            $scope.division = data;
            if(addr){
                $scope.address = addr;
                //拼装下拉选择框
                var arr = addr.area.split(',');
                addr.province = arr[0];
                addr.city = arr[1];
                addr.district = arr[2];
                $scope.address = addr;
                $scope.addr = true;
            }
        }).error(function() {
            toaster.pop('error', '系统错误 ' + '加载城市信息失败');
        });

        $scope.save = function () {
            var address = $scope.address;

            if (!address){
                toaster.pop('error', '请补充未填写的信息');
                return ;
            }
            if (!address.name || !address.province || !address.city || !address.district ||
                !address.detailAddress || !address.tel){
                toaster.pop('error', '请补充未填写的信息');
                return ;
            }
            if ($scope.userError || $scope.telError || $scope.addrError || $scope.telPatternError ||
                $scope.emailPatternError){
                toaster.pop('error', '请修改红色框内的信息');
                return ;
            }

            //拼装地区
            var strAres = address.province + ',' + address.city + ',' + address.district;
            address.area = strAres;

            // send属性 控制本地址是否是发货地址
            ShippingAddress.save({isSetTop: $scope.isSetTop, send: false, isPersonal: true}, address, function(data){
                toaster.pop('success', '成功 ', '保存收货地址成功');
                $modalInstance.close(data);
            }, function(res){
                toaster.pop('error', '保存收货地址失败', res.data);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);

    // 发票编辑模态框
    app.register.controller('BillInputCtrl', ['$scope', '$http', 'BaseService', 'Bill', 'toaster', '$stateParams', '$state', 'invoiceInfo', '$upload', '$modalInstance', function($scope, $http, BaseService, Bill, toaster, $stateParams, $state, invoiceInfo, $upload, $modalInstance) {

       $scope.bill = {};
        $scope.invoiceType = Number(invoiceInfo.split("-")[0]);
        if(invoiceInfo.split("-").length == 2) {
            $scope.invoiceId = Number(invoiceInfo.split("-")[1]);
        }
        $scope.isSpecial = true; //专票，等于true为不存在
        $scope.isNormal = true; //普票，等于true为不存在
        // 获取发票信息方法	1205为增值税专用发票	1206为增值税普通发票	1207为不开发票

        $scope.setType = function() {
            switch($scope.invoiceType) {
                case 1206:
                    $scope.bill.kind = 1206;
                    $scope.isNormal = true;
                    $scope.isSpecial = false; break;
                case 1205:
                    $scope.bill.kind = 1205;
                    $scope.isNormal = false;
                    $scope.isSpecial = true; break;
                default:
                    $scope.isNormal = true;
                    $scope.isSpecial = true;
            }
        };

        $scope.setType();

        $scope.getData = function() {
            if($scope.invoiceId) {
                Bill.getBillById({id: $scope.invoiceId}, function(data) {
                    $scope.bill = data;
                    if($scope.bill.kind == 1205) {
                        $scope.isNormal = false;
                    }else {
                        $scope.isSpecial = false;
                    }
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
                    $scope.bill.is_agree = true;
                }, function(response) {
                    toaster.pop('error', '获取指定的发票信息失败');
                });
            }else {
                $http.get('static/js/prod/data/city.json').success(function(data) {
                    $scope.division = data;
                }).error(function(e) {
                    toaster.pop('error', '系统错误 ' + '加载城市信息失败');
                });
            }
        };
        $scope.getData();

        $scope.bill.address = {};

        //保存发票信息
        $scope.saveBill = function(flag) {
            var dataValidFlag = $scope.checkValidFrom();
            if (!flag && dataValidFlag && $scope.bill.is_agree) {
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
                $modalInstance.close(data);
            }).error(function(data){
                toaster.pop('error', message + '失败');
            });
        }

        $scope.isDoUpload = false;
        //上传发票许可证
        $scope.onUploadPermission = function () {
            $scope.isDoUpload = true;
            if (event.target.files[0].size < 3*1024*1024) {
                $scope.bill.attachUrl = event.target.files[0].name;
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

        $scope.exitEdit = function () {
            $modalInstance.dismiss();
        }

    }]);
});