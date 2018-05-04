/**
 * Created by yujia on 2017/3/24.
 *  订单中心的控制器
 */
define(['app/app'], function (app) {
    "use strict";
    app.register.controller('vendorOrderCtrl', ['$scope', '$rootScope', 'Purchase', 'ngTableParams', 'BaseService', 'toaster', '$state', '$filter', 'Return', 'Change', '$modal', 'PuExProcess', 'Recommendation', 'DateUtil', 'Loading', 'bankInfoService', 'Logistics', 'Distributor', 'SessionService','Rate','StoreInfo', function ($scope, $rootScope, Purchase, ngTableParams, BaseService, toaster, $state, $filter, Return, Change, $modal, PuExProcess, Recommendation, DateUtil, Loading, bankInfoService, Logistics, Distributor, SessionService, Rate, StoreInfo) {
        $rootScope.active = 'vendor_order';
        document.title = '已卖出的产品-优软商城';
        // 加密过滤器
        var enIdFilter = $filter('EncryptionFilter');
        // 默认状态为所有订单
        if (SessionService.getCookie('status')){
            $scope.status = SessionService.getCookie('status');
            SessionService.removeCookie('status');
        }else {
            $scope.status = 'all';
        }
        // 分页相关数据
        $scope.pageParams = {number: 1};
        // 下拉菜单状态
        $scope.isShowPop = false;
        // 搜索关键字
        $scope.keyword = "";
        // 订单数据条数
        $scope.orderLength = 1;
        // 多选操作，存在ID
        $scope.checkedIds = {};
        // 禁用批量确认收款操作
        $scope.canEnsureRec = false;
        //是商城管理员的公司
        $scope.isYrscStore = false;
        //是寄售店铺
        $scope.isCONSIGNMENT = false;
        //分页参数
        $scope.tableParams = {
            page: 1,
            count: 5,
            sorting: {
                createtime: 'DESC'
            }
        };
        $scope.startDate = null;
        $scope.endDate = null;


        $scope.param = {};
        $scope.param.page = 1;

        $scope.localInfo = {};

        $scope.yrscStore = '33069557578d44e69bd91ad12d28a8d4';

        if ($rootScope.store && ($scope.yrscStore == $rootScope.store.uuid)) {
            $scope.isYrscStore = true;
        }
        StoreInfo.findShopOwnerApplyByNormalStatus({}, {}, function (result) {
            if (!result.data) {
                $scope.isCONSIGNMENT = true;
                $scope.storeType = 'mall';
            }else if (result.data.type == 'CONSIGNMENT' || result.data.status == 'PREPARE'){
                $scope.isCONSIGNMENT = true;
                $scope.storeType = 'mall';
            }}, function (error) {
        });

        var unavailableReasons = {
            315: '已注销',
            602: '库存不足',
            603: '一直未付款',
            604: '拒绝发货',
            605: '用户全部退货',
            606: '用户取消订单'
        };

        // 订单状态码和订单状态的映射
        $scope.stateMap = {
            501: '意向订单',
            502: '待发货',
            406: '待发货',
            404: '待收货',
            405: '待收款', /*已收货：卖家没有已收货状态，商城收货后，应该是待收款状态*/
            503: '待收款',
            524: '待收款',
            514: '待收款',
            520: '已完成',
            602: '已失效',
            603: '已失效',
            604: '已失效',
            605: '已失效',
            606: '已失效',
            315: '已失效'
        };
        // 币种币别符号映射
        $scope.currencyTrans = {
            'RMB': '￥',
            'USD': '$'
        };
        //设置子状态码的映射
        $scope.childStatus = '';
        $scope.childStatusName = '订单状态';
        $scope.setChildStatus = function (status,name) {
            $scope.childStatus = status;
            $scope.childStatusName = name;
            $scope.param.page = 1;
            $scope.orderTableParams.page(1);
            $scope.orderTableParams.reload();
        }
        // 根据订单状态获取状态码
        var getState = function () {
            var state = 'get';
            switch ($scope.status) {
                case 'all' :
                    state = '';
                    break;
                case 'tobeconfirmed' :
                    state = '501-504-524-525';
                    break;
                case 'comfirmed':
                    // TODO huxz 点击填写物流转出货单，填写完物流信息变为待收货状态
                    state = '502-406';
                    break;
                case 'inbound':
                    // TODO wangdy 待收获，包含待买家收货和售后中
                    state = '404-511';
                    break;
                case 'tobepaid':
                    // TODO huxz 平台收货后即变为待收款状态，直到买家确认收货503待付款状态
                    state = '405-503-514-506-511';
                    break;
                case 'completed':
                    // TODO huxz 平台采购单已完成，即交易完成
                    state = '520';
                    break;
                case 'unavailable':
                    // TODO huxz 平台采购单的失效状态
                    state = '602-603-315-604-605-606';
                    break;
                case 'toBeReviewed':
                    state = '404-503-520';
                    break;
                //下面的状态栏新增的状态
                case 'tobepay':
                    state = '501';
                    break;
                case 'tobeconfirmedpay':
                    state = '504';
                    break;
                case 'inaftersales':
                    state = '511';
                    break;
                case 'cancel':
                    state = '602-603-315-604-605';
                    break;
                case 'tradeclose':
                    state = '606';
                    break;
            }
            return state;
        };

        // 打印
        $scope.print = function (purchase, type) {
            var rootPath = BaseService.getRootPath();
            window.open(rootPath + '/report/print?reportName=' + type + '&whereCondition=' + "where trade$purchase.id=" + purchase.id);
        };


        $scope.setActive = function (status) {
            window.sessionStorage.removeItem("exceptionType");
            window.sessionStorage.setItem('purchaseState', status);
            if ($scope.status != status) {
                $scope.status = status;
                $scope.orderTableParams.page(1);
            }
            $scope.isShowPop = false;
            // 初始化多选记录
            $scope.startDate = null;
            $scope.endDate = null;
            $scope.checkedIds = {};
            $scope.param.page = 1;
            $scope.childStatus ='';
            $scope.childStatusName ='订单状态';
            $scope.orderTableParams.reload();
        };
        $scope.sortingState = {
            state: 'orderBycreatetimeDesc'
        };

        $scope.findSelectedDistributor = function () {
            Distributor.findAllSelected({},{},function (data) {
                if (data){
                    $scope.companyList = data;
                }
            })
        };
        $scope.findSelectedDistributor();

        //配送方式类型
        $scope.deliveryMethod = {
            1301: '第三方配送',
            1302: '卖家配送',
            1303: '上门自提'
        };
      // 获取已有物流配送商列表
        $scope.initData = function () {
            Distributor.findAllSelected({},function (data) {
                if (data){
                    $scope.data_list = data;
                }
            })
        };
        $scope.initData();
        $scope.showNameUl = false;

        $scope.showName = function () {
            $scope.showNameUl = true;
            console.log($scope.showNameUl)
        };
        $scope.onFocus = function () {
            $scope.showNameUl = true;
        };
        $scope.onBlur = function () {
            if ($scope.time){
                clearTimeout($scope.time);
            }
            $scope.time = setTimeout(function () {
                $scope.$apply(function () {
                    $scope.showNameUl = false;
                });
            }, 200);
        };
        // 选中物流
        $scope.showText = function (name) {
            $scope.logistics.companyName = name;
            $scope.showNameUl = false;
        };
        $scope.modifyLogistic = function (purchase) {
            purchase.showLogistics = !purchase.showLogistics;
            angular.forEach($scope.purchases, function (data) {
                if (data.id != purchase.id){
                    data.showLogistics = false;
                }
            });
            if (purchase.showLogistics){
                if (!purchase.lgtId){
                    $scope.logistics = {};
                }else {
                    Logistics.findLogisticsById({lgtid:purchase.lgtId}, {}, function (data) {
                        if (data){
                            $scope.logistics = data;
                        }
                    })
                }
            }
        };

        $scope.cancelModify = function (purchase) {
            purchase.showLogistics = false;
        };

        /**
         * 确认修改物流信息
         * @param purchase
         */
        $scope.ensureModifyLogistics = function (purchase) {
            if (purchase.sendType == 1301){
                if (!$scope.logistics.companyName) {
                    toaster.pop("error", "请选择物流公司");
                    return ;
                }
                if ($scope.logistics.companyName == '请选择物流公司'){
                    toaster.pop('error', '注意', '请选择物流公司');
                    return ;
                }
                if (!$scope.logistics.number) {
                    toaster.pop("error", "请填写物流单号");
                    return ;
                }
                var patt = new RegExp("^[A-Za-z0-9]+$");
                if (!patt.test($scope.logistics.number)){
                    toaster.pop("error", "注意", '请输入正确的物流单号');
                    return ;
                }
            }else {
                if ($scope.logistics.companyName && $scope.logistics.companyName != '请选择物流公司'){
                    if (!$scope.logistics.number){
                        toaster.pop("error", "注意", '请完善快递信息');
                        return ;
                    }
                }
                if ($scope.logistics.number){
                    var patt = new RegExp("^[A-Za-z0-9]+$");
                    if (!patt.test($scope.logistics.number)){
                        toaster.pop("error", "注意", '请输入正确的物流单号');
                        return ;
                    }
                    if (!$scope.logistics.companyName || $scope.logistics.companyName == '请选择物流公司'){
                        toaster.pop("error", "注意", '请完善快递信息');
                        return ;
                    }
                }
            }
            if (!purchase.lgtId){ //没有物流信息则添加物流信息
                if ($scope.logistics.companyName && $scope.logistics.number){
                    Logistics.addLogistics({inid : purchase.inid}, $scope.logistics, function (data) {
                        if (data.success){
                            $scope.orderTableParams.reload();
                            toaster.pop("success", "保存物流信息成功");
                            purchase.showLogistics = false;
                        }
                    })
                }else {
                    purchase.showLogistics = false;
                }
            }else { //更新物流信息
                if ($scope.logistics.companyName && $scope.logistics.number){
                    Logistics.updateLogistics({id : purchase.lgtId, invoiceFuid : purchase.inid}, $scope.logistics, function (data) {
                        if (data){
                            if(data.success){
                                toaster.pop("success", "修改物流信息成功");
                                purchase.showLogistics = false;
                            }
                        }
                    })
                } else {
                    if (purchase.sendType != 1301){
                        //没有则删除快递信息
                        Logistics.clearLogistics({inid : purchase.inid}, {}, function (data) {
                            if (data){
                                if(data.success){
                                    $scope.orderTableParams.reload();
                                    toaster.pop("success", "修改物流信息成功");
                                    purchase.showLogistics = false;
                                }
                            }
                        })
                    }
                }
            }
        };

        $scope.changeOrderState = function (state) {
            if ($scope.sortingState.state === state) {
                $scope.orderTableParams.sorting({createtime: 'DESC'});
                $scope.sortingState.state = 'orderBycreatetimeDesc';
                $scope.orderTableParams.reload();
                return false;
            } else {
                return true;
            }
        };
        $scope.orderBybatchQtyDesc = function () {
            if ($scope.changeOrderState('orderBybatchQtyDesc')) {
                $scope.orderTableParams.sorting({batchQty: 'DESC'});
                $scope.sortingState.state = 'orderBybatchQtyDesc';
                $scope.orderTableParams.reload();
            }
        };
        $scope.orderBybatchQtyAsc = function () {
            if ($scope.changeOrderState('orderBybatchQtyAsc')) {
                $scope.orderTableParams.sorting({batchQty: 'ASC'});
                $scope.sortingState.state = 'orderBybatchQtyAsc';
                $scope.orderTableParams.reload();
            }
        };
        $scope.orderByensurePriceDesc = function () {
            if ($scope.changeOrderState('orderByensurePriceDesc')) {
                $scope.orderTableParams.sorting({currency: 'ASC', ensurePrice: 'DESC', createtime: 'DESC'});
                $scope.sortingState.state = 'orderByensurePriceDesc';
                $scope.orderTableParams.reload();
            }
        };
        $scope.orderByensurePriceAsc = function () {
            if ($scope.changeOrderState('orderByensurePriceAsc')) {
                $scope.orderTableParams.sorting({currency: 'DESC', ensurePrice: 'ASC', createtime: 'DESC'});
                $scope.sortingState.state = 'orderByensurePriceAsc';
                $scope.orderTableParams.reload();
            }
        };

        // 异常申请/异常通知/退货/换货
        $scope.setExceptionType = function (type, active) {
            window.sessionStorage.setItem('exceptionType', type);
            window.sessionStorage.setItem('purchaseState', active);
            if ($scope.status != active) {
                $scope.status = active;
                $scope.orderTableParams.page(1);
            }
            $scope.orderTableParams.page(1);
            $scope.isShowPop = false;
            $scope.checkedIds = {};
            $scope.orderTableParams.reload();
        };

        var storeType = window.sessionStorage.getItem('storeType');
        $scope.storeType = storeType ? storeType : 'mall';
        // 设置店铺id
        $scope.setStoreType = function (storeType) {
            if ($scope.storeType != storeType) {
                $scope.storeType = storeType;
                window.sessionStorage.setItem('storeType', storeType);
                $scope.param.page = 1;
                $scope.orderTableParams.page(1);
                $scope.keyword = null;
                $scope.startDate = null;
                $scope.endDate = null;
                $scope.isShowPop = false;
                $scope.checkedIds = {};
                $scope.orderTableParams.reload();
                getCounts();
            }
        };

        // 获取各种状态订单的数量信息
        var getCounts = function () {
            if (!$scope.startDate && !$scope.endDate && !$scope.keyword){
                Purchase.getAllStatusCounts({storeType: $scope.storeType}, function (data) {
                    $scope.counts = angular.copy(data);
                    $scope.counts[$scope.status] = $scope.pageParams.totalElements;
                });
            }
        };
        getCounts();

        // 填写物流信息
        $scope.toBeShiped = function (purchase) {
            bankInfoService.getVenderBankDefault(null, function (data) {
                if (data && data.length > 0) {
                    // 如果处于406，则直接跳转到物流页面
                    if (purchase.inid) {
                        // 填写物流信息
                        $state.go("vendor_delivery", {ids: enIdFilter(purchase.inid)});
                    } else {
                        Purchase.tobeshiped({id: purchase.id}, function (data) {
                            toaster.pop('success', '转出货单成功');
                            // 填写物流信息
                            $state.go("vendor_delivery", {ids: enIdFilter(data.inId)});
                        }, function (response) {
                            toaster.pop('error', '失败', '转出货单失败' + response.data);
                        });
                    }
                } else {
                    purchase.showGotoSettle = true;
                }
            }, function (response) {
            });
        };

        $scope.showDeletePurchase = function (purchase) {
            purchase.showDelete = !purchase.showDelete;
            var showid = purchase.id;
            angular.forEach($scope.purchases, function (data) {
                if(data.id != showid){
                    data.showDelete = false;
                }
            });
        };

        //根据采购单号修改采购单的使用状态
        $scope.deletePurchase = function (purchase) {
            Purchase.changePurchaseUsed({purchaseid: purchase.purchaseid}, {}, function (data) {
                purchase.showDelete = false;
                $scope.orderTableParams.reload();
            });
        };

        //更新显示状态
        $scope.changeShow = function (purchase) {
            purchase.showGotoSettle = false;
            // Purchase.changeShowTip({purchaseid: purchase.purchaseid}, {}, function (data) {
            //     purchase.showGotoSettle = false;
            //     $scope.orderTableParams.reload();
            // });
        };
        //去结算中心
        $scope.goToSettle = function (purchase) {
            // Purchase.changeShowTip({purchaseid: purchase.purchaseid}, {}, function (data) {
            //     purchase.showGotoSettle = false;
            //     $scope.orderTableParams.reload();
            // });
            purchase.showGotoSettle = false;
            window.open("vendor#/payCenter");
        }
        // 关闭操作
        $scope.cancle = function () {
            $scope.showGotoSettle = false;
        }
        // 根据状态码获取对应状态的时间信息
        var getTimeByStatus = function (order, statushistory, statusCode, statusStr) {
            angular.forEach(eval(statushistory), function (statushistory) {
                if (statushistory.status === statusCode) {
                    order[statusStr + 'Time'] = statushistory.time;
                }
            });
        };

        // $scope.startDateStr = '2016-05-01';
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - 30);
        $scope.startDateStr = DateUtil.yyyyMmDd(tempDate);
        $scope.endDateStr = DateUtil.yyyyMmDd(new Date());
        $scope.startMils = $scope.startDateStr ? new Date(tempDate).getTime() : undefined;
        $scope.endMils = $scope.endDateStr ? new Date(new Date()).getTime() : undefined;

        // 触发订单时间筛选
        $scope.chooseInternal = function () {
            $scope.startMils = $scope.startDateStr ? new Date($scope.startDateStr).getTime() : undefined;
            $scope.endMils = $scope.endDateStr ? new Date($scope.endDateStr).getTime() : undefined;
            $scope.orderTableParams.page(1);
            $scope.orderTableParams.reload();
        };
        // 重新加载数据
        $scope.reload = function () {
            $scope.orderTableParams.reload();
        };
        $scope.orderTableParams = new ngTableParams($scope.tableParams, {
            total: 0,
            getData: function ($defer, params) {
                $scope.loading = true;
                $scope.paginationParams = params;
                var param = BaseService.parseParams(params.url());
                param.keyword = $scope.keyword ? $scope.keyword : null;
                if ($scope.childStatus!==''){
                    param.status = $scope.childStatus;
                }else{
                    param.status = getState();
                }
                param.page = $scope.param.page;
                // param.startMils = $scope.startMils;
                // param.endMils = $scope.endMils;
                param.exceptionType = window.sessionStorage.getItem('exceptionType');
                param.storeType = $scope.storeType;

                param.startMils = $scope.startDate ? $scope.startDate.getTime() : null;
                param.endMils = $scope.endDate ? $scope.endDate.getTime() : null;
                if (param.startMils != null && param.endMils != null){
                    if (param.startMils > param.endMils){
                        alert("开始时间不得超过结束时间！");
                        return;
                    }
                }

                Purchase.getByStatusAndInternal(param, function (page) {
                    if (page) {
                        if (!$scope.startDate && !$scope.endDate && !$scope.keyword) {
                            if ($scope.childStatus == '') {
                                if (page.content) {
                                    angular.forEach(page, function (value, key) {
                                        if (key == 'all' || key == 'tobeconfirmed' || key == 'comfirmed' || key == 'inbound'
                                            || key == 'tobepaid' || key == 'completed' || key == 'unavailable' || key == 'toBeReviewed') {
                                            if (!$scope.counts) {
                                                $scope.counts = {};
                                            }
                                            $scope.counts[key] = value;
                                        }
                                        $scope.counts[$scope.status] = page.totalElements;
                                    });
                                } else {
                                    $scope.counts = {};
                                }
                            }
                        }

                        $scope.purchases = page.content;
                        angular.forEach($scope.purchases, function (data) {
                            if (data.installmentId && data.installment.status == 504) {
                                angular.forEach(data.installment.installmentDetails, function (list) {
                                    if (list.detno == data.installment.currentNo) {
                                        if (list.status == 504) {
                                            data.installmentDetailPaid = true;
                                        }
                                    }
                                })
                            }
                            // 循环判断一期都没有付款并且延期的
                            if (data.installmentId && data.installment.status == 503) {
                                angular.forEach(data.installment.installmentDetails, function (detailslist) {
                                    var nowTime = new Date();
                                    if (detailslist.status == 503 && nowTime.getTime() > detailslist.deadline){
                                        data.Overtime = true;
                                    }
                                })
                            }
                            // 循环判断已付款未收款卖家可取消的

                        });
                        $scope.requestOver = 0;
                        angular.forEach($scope.purchases, function (order) {
                            Rate.getRateVendor({orderId:order.orderid},{},function (data) {
                               if (data.data){
                                   order.isEachRate = true;
                               }
                            });
                            Rate.getRateBuyer({orderId:order.orderid},{},function (data) {
                                if(data.data){
                                    if (data.data.vendorRateTime){
                                        order.isFirstRate = true; // 是否完成初评
                                    }
                                    if (data.data.vendorAfterRateTime){
                                        order.isAfterRate = true; // 是否完成追评
                                    }
                                }
                                $scope.requestOver += 1;
                            });
                            angular.forEach(JSON.parse(order.statushistory),function (data) {
                                if (data.status == 520){
                                    order.complete = data.time;
                                }
                            });
                        });
                        getExMsgState(); // 获取异常消息状态
                        getReturnByPurchaseIds(); // 获取退货单信息

                        $scope.orderLength = page.numberOfElements;
                        $scope.pageParams.content = page.content;
                        $scope.pageParams.number = page.number;
                        // 分页部分有关内容
                        $scope.param.currentPage = page.number;
                        $scope.AllOrderInfo = page;
                        $scope.acculatePages(page.number, page.totalPages);

                        $scope.pageParams.totalElements = page.totalElements;
                        $scope.pageParams.totalPages = page.totalPages;
                        params.total(page.totalElements);
                        $defer.resolve(page.content);
                        $scope.orderLength = page.content.length;

                        angular.forEach(page.content, function (order) {
                            var purchaseDetails = angular.copy(order.purchaseDetails);
                            // 获取型号数量
                            var components = {};
                            angular.forEach(purchaseDetails, function (purchaseDetail) {
                                components[purchaseDetail.uuid]++;
                            });
                            order.codeNum = Object.getOwnPropertyNames(components).length;
                            // TODO huxz 获取付款到账时间[已付款时间]
                            // 获取订单发货时间
                            getTimeByStatus(order, order.statushistory, 406, 'inbound');
                            // 获取订单收货时间
                            getTimeByStatus(order, order.statushistory, 405, 'receivedGoods');
                            // 当订单状态码为失效状态时
                            var statusCode = order.status;
                            if (statusCode == 602 || statusCode == 603 || statusCode == 604 || statusCode == 315 || statusCode == 605 || statusCode == 606) {
                                getTimeByStatus(order, order.statushistory, statusCode, 'unavailable');
                                order.unavailableReason = unavailableReasons[statusCode];
                            }
                        });
                    }
                }, function (reponse) {
                    if ("系统错误".indexOf(reponse.data) > -1) {
                        toaster.pop('error', '不好意思，系统出错，请联系客服。');
                    } else {
                        toaster.pop('info', reponse.data);
                    }
                });
            }
        });
        $scope.orderTableParams.reload();
        // 确认收款
        // 分期明细
        $scope.numArray = {
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五'
        };
        $scope.confirmPaymentBox = false;
        $scope.confirmPayment = function (item,id) {
            angular.forEach($scope.purchases, function (data) {
                if(data.id != id) {
                    data.confirmPaymentBox = false;
                }
            });
            $scope.purchaseInstallment = item;
            $scope.purchasesId = item.id;
            $scope.confirmPaymentBox = true;
            // 获取分期付款进行到哪一步
            // 存放分期详情列表
            $scope.installmentDetails = item.installment.installmentDetails;
            if (item.installmentId && item.installment.status == 504) {
                $scope.currencyNAME = item.currency;
                angular.forEach(item.installment.installmentDetails, function (list) {
                    if (list.detno == item.installment.currentNo) {
                        $scope.installmentDetailsList = list;
                        $scope.changeList = '';
                        $scope.installmentDetailsList.installmentImages = $scope.installmentDetailsList.imgs.split(",");
                        $scope.changeList = $scope.installmentDetailsList.installmentImages;
                    }
                })
            };
        };
        $scope.cancelPayment = function () {
            $scope.confirmPaymentBox = false;
        };
        // 确认收款
        $scope.confirmPaymentOk = function (installmentDetails) {
            var installmentDetailId = '';
            angular.forEach(installmentDetails, function (installmentDetail) {
                if (installmentDetail.detno == $scope.purchaseInstallment.installment.currentNo)
                    installmentDetailId = installmentDetail.id;
            });
            Purchase.confirmPaymentInstallment({id: $scope.purchasesId,installmentDetailId: installmentDetailId}, null, function () {
                toaster.pop('success', '收款成功');
                $scope.confirmPaymentBox = false;
                $scope.orderTableParams.reload();
            }, function (response) {
                toaster.pop('error', response.data);
            });
        };
        // 切换效果
        $scope.imgIndex = 0;
        $scope.changeImg = function (installmentImg, index) {
            $scope.imgIndex = index;
        };
        $scope.changePrev = function () {
            if ($scope.imgIndex == 0) {
                $scope.imgIndex = 0
            }else if($scope.imgIndex > 0){
                $scope.imgIndex -= 1;
            }
        };
        $scope.changeNext = function (installmentImg) {
            if ($scope.imgIndex == installmentImg.length-1) {
                $scope.imgIndex = 0
            }else {
                $scope.imgIndex += 1;
            }
        };
        /**
         * 查看大图
         *
         * @param imgUrl		图片链接
         */
        $scope.showImg = showImg;
        function showImg(imgUrl) {
            var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
            box.show();
            box.find('img').attr('src', src);
            box.find('a').click(function(){
                box.hide();
            });
            box.dblclick(function(){
                box.hide();
            });
        }

        // 取消订单
        $scope.sellerCancelOrder = function (data, purchaseid) {
            console.log(data);
            if(!purchaseid) {
                return ;
            }
            if (data.installmentId && data.installment.status == 503) {
                angular.forEach(data.installment.installmentDetails, function (detailslist) {
                    var nowTime = new Date();
                    console.log(detailslist.deadline);
                    console.log(nowTime.getTime())
                    if (detailslist.status == 503 && nowTime.getTime() > detailslist.deadline){
                        Purchase.sellerCancelOrder({purchaseId : purchaseid, reason : ''}, null, function () {
                            toaster.pop('success','取消订单成功');
                            $scope.orderTableParams.reload();
                            return ;
                        });
                    }
                })
            }else {
                $modal.open({
                    templateUrl: 'static/view/vendor/modal/cancelOrder_modal.html',
                    size : 'md',
                    controller : 'cancelControler',
                    resolve : {
                        purchaseid : function () {
                            return purchaseid;
                        }
                    }
                }).result.then(function () {
                    $scope.reload();
                }, function () {
                    toaster.pop('info', '提示 ' + '您取消了对订单的操作');
                });
            }
        };
        // 收退货
        $scope.receivingDialogShow = {};
        // 确认收退货：知道
        $scope.known = function (purchase) {
            var id = $scope.returnInfo[purchase.purchaseid].id;
            receiving(id);
            $scope.receivingDialogShow[id] = false
        };
        // 确认收退货：下次不再提示
        $scope.notHint = function (purchase) {
            window.localStorage.setItem('notHintEnsureReceiving', true);
            var id = $scope.returnInfo[purchase.purchaseid].id;
            receiving(id);
            $scope.receivingDialogShow[id] = false
        };
        //确认收货
        $scope.ensureReceiving = function (re, purchase) {
            if (!window.localStorage.getItem('notHintEnsureReceiving')) {
                /*var modalInstance = $modal.open({
                 templateUrl : 'static/view/vendor/modal/ensure-receiving-modal.html',
                 controller: 'ensureReceivingModalCtrl',
                 /!*size: 'sm',*!/
                 /!*windowClass: ''*!/
                 });
                 modalInstance.result.then(function (result) {
                 receiving(re.id);
                 }, function (reason) {

                 })*/
                var detailIds = [];
                angular.forEach(re.returnDetails, function (detail) {
                    detailIds.push(detail.puid);
                });
                var allUnavailable = true;
                for (var i = 0; i < purchase.purchaseDetails.length; i++) {
                    var puDetail = purchase.purchaseDetails[i];
                    if (detailIds.indexOf(puDetail.detailid) != -1) {
                        allUnavailable = false;
                        break;
                    }
                }
                // 全部明细无效才失效整张订单，从而才弹出提示
                if (allUnavailable) {
                    $scope.receivingDialogShow[re.id] = !$scope.receivingDialogShow[re.id];
                }
            } else {
                receiving(re.id);
            }
        };
        var receiving = function (id) {
            Return.venderAccept({returnid: id}, {}, function (data) {
                $scope.orderTableParams.reload();
                toaster.pop('success', '处理成功', '退货单 确认收货成功');
            }, function (error) {
                toaster.pop('error', '退货处理失败:' + error.data);
            })
        };


        //确认收退换货
        $scope.ensureExchangeReceiving = function (purchaseId) {
            Change.venderAcceptByPurchase({purchaseId: purchaseId}, function () {
                $scope.orderTableParams.page(1);
                $scope.orderTableParams.reload();
                toaster.pop('success', '处理成功', '退货单 确认收货成功');
            }, function (error) {
                toaster.pop('error', '退货处理失败:' + error.data);
            });
        };

        // 分页操作
        $scope.topage = function (num) {
            if ($scope.topagenum !== null) {
                $scope.topagenum = null;
            }
            if (num < 1) {
                num = 1;
            } else if (num > $scope.pageParams.totalPages) {
                num = $scope.pageParams.totalPages;
            }
            $scope.orderTableParams.page(num);
            $scope.orderTableParams.reload();
        };

        // 搜索框内容转换成大写
        var t;
        var setTime = function () {
            if ($scope.time > 0) {
                t = setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.time--;
                        setTime();
                    });
                }, 1000);
            } else {
                $scope.keyword = angular.uppercase($scope.keyword);
            }
        };

        $scope.upper = function () {
            $scope.time = 1;
            clearTimeout(t);
            setTime();
        };

        // TODO huxz 打开下拉菜单
        $scope.showPop = function () {
            $scope.isShowPop = !$scope.isShowPop;
        };

        // 根据输入单号搜索单据
        $scope.onSearch = function () {
            $scope.keyword = angular.uppercase($scope.keyword);
            $scope.orderTableParams.page(1);
            $scope.orderTableParams.reload();
        };

        $scope.condition = {
            startDateOpen: false,
            endDateOpen: false
        };

        // 打开日期选择框
        $scope.openDatePicker = function ($event, item, openParam,status) {
            if (status != null) {
                if (status == 1) {
                    if ($scope.startDate != null) {
                        return;
                    }
                }
                if (status == 2) {
                    if ($scope.endDate != null) {
                        return;
                    }
                }
            }
            $event.preventDefault();
            $event.stopPropagation();
            item[openParam] = !item[openParam];
            if (openParam == 'startDateOpen'){
                if (item['endDateOpen']){
                    item['endDateOpen'] = !item['endDateOpen'];
                }
            } else if(openParam == 'endDateOpen'){
                if (item['startDateOpen']){
                    item['startDateOpen'] = !item['startDateOpen'];
                }
            }
        };
        $scope.changeEndDate = function () {
            if ($scope.condition.endDateOpen) {
                $scope.endDate = $scope.endDate.toString().replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, '23:59:59');//;'23.59';//DateUtil.yyyyMmDd($scope.endDate.getTime() + 86399000);
                $scope.endDate = new Date(formatDateTime(new Date($scope.endDate.toString())));
            }
            $scope.vaildDate(false);
        };
        $scope.vaildDate = function (isStart) {
            if ($scope.endDate !== null && $scope.startDate>$scope.endDate){
                if (isStart){
                    alert("开始日期大于结束日期，请重新输入！");
                    $scope.startDate = null;
                } else {
                    alert("开始日期大于结束日期，请重新输入！");
                    $scope.endDate = null;
                }
            }
        };
        var formatDateTime = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            var sec = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+sec;
        };
        // 选择查找日期
        $scope.onDateCondition = function () {
            $scope.param.page = 1;
            $scope.orderTableParams.page(1);
            $scope.orderTableParams.reload();
        };

        /**
         * 订单搜索
         */
        $scope.search = function () {
            $scope.param.page = 1;
            if(typeof $scope.startDate == 'undefined' || typeof $scope.endDate == 'undefined'){
                alert("日期格式错误，请重新输入！");
                $scope.startDate = null;
                $scope.endDate = null;
                return;
            }
            $scope.setChildStatus('','订单状态');
            $scope.orderTableParams.page(1);
            $scope.orderTableParams.reload();
        };

        // 对意向订单拒绝
        $scope.refuse = function (purchaseDetail) {
            //为批量的拒绝留条路，ids 用-链接
            Purchase.refusePurDetail({ids: purchaseDetail.id}, function () {
                toaster.pop('success', '拒绝成功');
                $scope.orderTableParams.page(1);
                $scope.orderTableParams.reload();
            }, function (response) {
                toaster.pop('error', '拒绝失败  ' + response.text);
            });
        };

        $scope.orderTake = function (purchaseDetail) {
            //批量接单的入口
            Purchase.orderTakeDetail({ids: purchaseDetail.id}, function () {
                toaster.pop('success', '接单成功');
                $scope.orderTableParams.page(1);
                $scope.orderTableParams.reload();
            }, function (response) {
                toaster.pop('error', '接单失败  ' + response.text);
            });
        };

        // 多选操作
        $scope.checkOnePur = function (purchase) {
            // 批量确认收款
            if (purchase && purchase.id) {
                if ($scope.checkedIds[purchase.id]) {
                    delete $scope.checkedIds[purchase.id];
                } else {
                    $scope.checkedIds[purchase.id] = true;
                }
                var idArray = Object.getOwnPropertyNames($scope.checkedIds);
                $scope.canEnsureRec = idArray.length > 0;
            }
        };

        // TODO 弃用，【批量】确认收款
        $scope.ensureReceived = function (id) {
            var idArray = Object.getOwnPropertyNames($scope.checkedIds);
            var ids = id || idArray.join('-');
            Purchase.ensureReceivedMoney({ids: ids}, {}, function (data) {
                if (data.data == 'success') {
                    toaster.pop('success', '确认收款成功');
                    // 初始化多选记录
                    $scope.checkedIds = {};
                    $scope.orderTableParams.reload();
                }
            });
        };

        /**
         * 根据采购单号获取对应的退货单物流
         */
        var getReturnByPurchaseIds = function () {
            var puids = [];
            angular.forEach($scope.purchases, function (purchase) {
                puids.push(purchase.purchaseid);
            });
            //puids = puids.slice(0, -1);
            Return.getReturnByPurchaseIds({puids: puids}, function (data) {
                $scope.returnInfo = data;
            }, function (error) {
                toaster.pop('error', '获取订单关联的退货单信息失败');
            })
        };

        /**
         * 获取异常消息状态
         */
        var getExMsgState = function () {
            var applyIds = [], notifyIds = [];
            angular.forEach($scope.purchases, function (purchase) {
                if (purchase.launchPuExApplyId) {
                    applyIds.push(purchase.launchPuExApplyId);
                }
                if (purchase.exApplyIdFromBuyer) {
                    notifyIds.push(purchase.exApplyIdFromBuyer);
                }
            });
        };

        //查看物流详情
        $scope.listLogistics = function (lgtId) {
            $modal.open({
                animation: true,
                templateUrl: 'static/view/usercenter/listLogistics.html',
                controller: 'listLogisticsCtrl',
                resolve: {
                    lgtid: function () {
                        return lgtId;
                    }
                }
            }).result.then(function () {

            }, function () {

            });
        };

        var getRecommendComps = function (userUU, usedFor, pageable) {
            Recommendation.getRecommendComps({page: pageable.page, size: pageable.size}, function (data) {
                $scope.recommendComps = data.content;
            }, function (error) {
                toaster.pop('error', '获取推荐器件失败', error);
            })
        };
        getRecommendComps(null, null, {page: 0, size: 12});


        // 根据输入单号搜索单据
        $scope.onSearch = function () {
            $scope.keyword = angular.uppercase($scope.keyword);
            $scope.orderTableParams.page(1);
            $scope.orderTableParams.reload();
        };

        /**
         * 下载当前页的订单信息
         */
        $scope.downPurchase = function () {
            var listId = getDownLoadPurchaseId();
            if (listId.length < 1) {
                toaster.pop('warning', '当前需要下载的订单条数为0');
                return;
            }
            Loading.show();
            $scope.localInfo.ids = listId.join("-");
            $scope.$apply();
            var form = document.getElementById('down-load-purchase');
            form.action = 'trade/purchase/down/ids';
            form.submit();
            var clockID = null;
            var getDownLoadStatus = function () {
                $.ajax({
                    url: 'trade/purchase/down/ids',
                    data: {isAjax: true, ids: $scope.localInfo.ids},
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        if (data.loading) {
                            clockID = setInterval(function () {
                                getDownLoadStatus()
                            }, 500);
                        } else {
                            $scope.$apply(function () {
                                toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                                Loading.hide();
                            });
                            if (!clockID) {
                                clearInterval(clockID);
                            }
                        }
                    },
                    error: function () {
                        Loading.hide();
                        if (!clockID) {
                            clearInterval(clockID);
                        }
                    }
                });
            }
            getDownLoadStatus();
        }

        /**
         * 获取当前需要下载的订单信息的ID
         */
        var getDownLoadPurchaseId = function () {
            var purchaseID = [];
            angular.forEach($scope.purchases, function (pur) {
                purchaseID.push(pur.id);
            });
            return purchaseID;
        }

        $scope.contactBuyer = function (purchase) {
            purchase.active = !purchase.active;
            var activeid = purchase.id;
            angular.forEach($scope.purchases, function (data) {
                if (data.id != activeid) {
                    data.active = false;
                }
            });
        }

        /******************根据页数设置翻页的信息********start**************************/

        //输入框监听Enter事件
        $scope.listenEnter = function () {
            if (event.keyCode == 13) {
                $scope.setPage("page", $scope.param.currentPage);
            }
        };

        $scope.setPage = function (type, number) {
            if (type != 'prev' && type != 'page' && type != 'next' && type != 'last' && type != 'first') {
                return;
            }
            ;
            var page = -1;
            switch (type) {
                case "page":
                    if (number < 1) {
                        page = 1;
                    } else if (number > $scope.AllOrderInfo.totalPages) {
                        page = $scope.AllOrderInfo.totalPages;
                    } else {
                        page = number;
                    }
                    ;
                    break;
                case "prev":
                    if ($scope.param.page <= 1) {
                        page = 1;
                    } else {
                        page = $scope.param.page - 1;
                    }
                    ;
                    break;
                case "next":
                    if ($scope.param.page >= $scope.AllOrderInfo.totalPages) {
                        page = $scope.AllOrderInfo.totalPages
                    } else {
                        page = $scope.param.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.AllOrderInfo.totalPages;
                    break;
            }
            if (page == $scope.param.page || page < 1 || page > $scope.AllOrderInfo.totalPages) {
                $scope.param.currentPage = $scope.param.page;
                return;
            }
            $scope.param.page = page;
            $scope.orderTableParams.reload();
        };

        //取消订单状态码
        $scope.cancelOrderArray = {
            602: true,
            603: true,
            315: true,
            604: true,
            605: true,
            606: true
        };

        //当前页在前段的计算方式
        $scope.frontSegment = function (currentPage, totalElementPages) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 8:
                        page.type = 'more';
                        page.active = false;
                        break;
                    case 0:
                        if (currentPage == 1) {
                            page.active = false;
                        }
                    default : {
                        page.current = (currentPage == page.number);
                    }
                }
            });
        };

        document.onclick = function (event) {
            var element = event.srcElement;
            if(!element) {
               return ;
            }
            var elementName =  element.getAttribute("name");
            $scope.$apply(function () {
                for(var i = 0; i < $scope.purchases.length; i++) {
                    var isThisTag = false;
                    if(elementName && $scope.purchases[i].id == elementName) {
                        isThisTag = true;
                    }
                    if(!isThisTag) {
                        var parentElement = element.parentElement;
                        while (parentElement && parentElement.tagName && parentElement.tagName != 'BODY') {
                            var parentElementName =  parentElement.getAttribute("name");
                            if(parentElementName && $scope.purchases[i].id == parentElementName) {
                                isThisTag = true;
                            }
                            parentElement = parentElement.parentElement;
                        }
                    }
                    if(!isThisTag) {
                        $scope.purchases[i].active = false;
                    }
                };
            });
        };

        // var clickClose = function () {
        //     var myDiv = document.getElementById("linkBuyer");
        //     document.onclick = function () {
        //         angular.forEach($scope.purchases, function(data){
        //             data.active = false;
        //             console.log(data.active);
        //         });
        //     };
        //     myDiv.onclick = function(event) {
        //         event = event || window.event;
        //         event.stopPropagation();
        //     };
        // };


        //当前页在后端计算方式
        $scope.endSegment = function (currentPage, totalElementPages) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 2:
                        page.active = false;
                        page.type = 'more';
                        break;
                    case 10:
                        if (currentPage == totalElementPages) {
                            page.active = false;
                        }
                        break;
                    case 0:
                    case 1:
                        break;
                    default:
                        if (page.number != totalElementPages) {
                            page.number = totalElementPages - 9 + page.number;
                        }
                        page.current = (currentPage == page.number);
                        break;
                }
            });
        };

        //当前页在中间计算方式
        $scope.middleSegment = function (currentPage) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 2:
                    case 8:
                        page.type = 'more';
                        page.active = false;
                        break;
                    case 3:
                        page.number = currentPage - 2;
                        break;
                    case 4:
                        page.number = currentPage - 1;
                        break;
                    case 5:
                        page.number = currentPage;
                        page.current = true;
                        break;
                    case 6:
                        page.number = currentPage + 1;
                        break;
                    case 7:
                        page.number = currentPage + 2;
                        break;
                }
            });
        }

        //初始化页数信息
        $scope.initPages = function (totalElementPages) {
            var pageNum = [];
            if (totalElementPages == 1) {
                return;
            } else if (totalElementPages < 10) {
                for (var i = 0; i < totalElementPages + 2; i++) {
                    pageNum.push(i);
                }
            } else {
                pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
            angular.forEach(pageNum, function (number) {
                var page = {active: true, type: 'page', number: number};
                if (number == 0) {
                    page.type = 'prev';
                } else if (number == 1) {
                    page.type = 'first';
                } else if (number == pageNum.length - 2) {
                    page.type = 'last';
                    page.number = totalElementPages;
                } else if (number == pageNum.length - 1) {
                    page.type = 'next';
                }
                $scope.pages.push(page);
            });
        }

        //计算页数的方式。
        $scope.acculatePages = function (currentPage, totalElementPages) {
            $scope.pages = [];
            if (totalElementPages < 1) {
                return;
            }
            //初始化页面数据
            $scope.initPages(totalElementPages);
            if (totalElementPages < 10) {
                angular.forEach($scope.pages, function (page) {
                    if (page.number == currentPage) {
                        page.current = true;
                    }
                });
            } else if (currentPage < 6) {//当期页小于6
                $scope.frontSegment(currentPage, totalElementPages);
            } else if (currentPage > totalElementPages - 5) { //当期页在后面
                $scope.endSegment(currentPage, totalElementPages);
            } else { //当期页在中间
                $scope.middleSegment(currentPage);
            }
        };
        /******************根据页数设置翻页的信息********end**************************/

        /***********卖家评论模块 *** start *****************************/

        $scope.modalData = [];

        $scope.getModal = function (purchase, type) {
            $scope.rateContent.storeid = purchase.storeid;
            $scope.rateContent.purchaseid = purchase.purchaseid;
            $scope.rateContent.orderid = purchase.orderid;
            $scope.rateType = type;
            Rate.getRateTemplate({storeuuid: $scope.rateContent.storeid},{},function (data) {
                $scope.modalData = data.data;
                Rate.getRateBuyer({orderId: $scope.rateContent.orderid},{},function (data) {
                    $scope.rateBuyer = data.data;
                });
            },function (error) {
               toaster.pop('error', '获取模板信息失败');
            });
            $scope.setShowRateBoxFlag(true);
        }

        //控制评论模态框的显示隐藏
        $scope.showRateBoxFlag = false;

        $scope.setShowRateBoxFlag = function (flag) {
            $scope.showRateBoxFlag = flag;
            if (!flag){
                $scope.boxStatus = 2;
                $scope.rateContent.level = 1;
                $scope.modalTempData.rateContent = '';
                $scope.modalTempData.modalTitle = '';
            }
        }

        //评价类型：追评addRate/初次评价firstRate，默认初评
        $scope.rateType = 'firstRate';

        $scope.setRateType = function (type) {
            $scope.rateType = type;
        }


        $scope.listenRateContent = function () {
            var str = $scope.modalTempData.rateContent
            if (str.length > 200) {
                var el = angular.element('#rateContent');
                el.blur();
                $scope.modalTempData.rateContent = str.substring(0, 200);
                el.focus();
            }
        }

        /***
         * 评价模态框状态，默认为1
         * 1:使用模板
         * 2:不使用模板
         * 3:新增模板
         * 4:修改模板
         * ***/
        $scope.boxStatus = 2;


        $scope.returnStep1 = function () {
            $scope.setBoxStatus(1);
            $scope.modalTempData.rateContent = $scope.rateContentTemp;
            $scope.modalTempData.modalTitle  = $scope.modalTitleTemp;
        }

        $scope.setBoxStatus = function (boxStatus) {
            if (boxStatus == 3 || boxStatus == 4){
                $scope.rateContentTemp = angular.copy($scope.modalTempData.rateContent);
                $scope.modalTitleTemp = angular.copy($scope.modalTempData.modalTitle);
            }
            $scope.boxStatus = boxStatus;
        }

        $scope.setGo = function(){
            if ( $scope.boxStatus == 1 ){
                $scope.modalTempData.rateContent = '';
                $scope.modalTempData.modalTitle = '';
            }
            $scope.setBoxStatus($scope.boxStatus == 1?2:1);
        }

        //控制模板列表显示
        $scope.showModalListFlag = false;

        $scope.setShowModalListFlag = function (flag) {
            if (!($scope.isInListFlag && !flag)) {
                $scope.showModalListFlag = flag;
            }
        }

        //鼠标是否在模板列表中
        $scope.isInListFlag = false;
        $scope.setIsInListFlag = function (flag) {
            $scope.isInListFlag = flag;
        }

        $scope.addModal = function () {
            $scope.showModalListFlag = false;
            $scope.setBoxStatus(3);
            $scope.modalTempData = {};
        }

        //选择模板
        $scope.chooseModal = function (modal) {
            $scope.modalTempData.rateContent = modal.rateTemplateContent;
            $scope.modalTempData.modalTitle = modal.rateTemplateName;
            $scope.currentModal = modal;
            $scope.showModalListFlag = false;
        }

        $scope.listenModalTitle = function () {
            if ($scope.modalTempData.modalTitle.length > 10) {
                $scope.modalTempData.modalTitle = $scope.modalTempData.modalTitle.substring(0, 10);
            }
        }

        //保存模板
        $scope.modalTempData = {};
        $scope.saveModal = function () {
            if(!$scope.modalTempData.modalTitle || $scope.modalTempData.modalTitle ==''){
                toaster.pop('error', '您还没有填写模版名称');
                return;
            }
            if(!$scope.modalTempData.rateContent || $scope.modalTempData.rateContent ==''){
                toaster.pop('error', '您还没有填写模版内容');
                return;
            }
            //storeuuid: $scope.rateContent.storeid
            if ($scope.boxStatus == 4) {
                $scope.currentModal.rateTemplateContent = $scope.modalTempData.rateContent;
                $scope.currentModal.rateTemplateName = $scope.modalTempData.modalTitle;
                Rate.saveRateTemplate({storeuuid: $scope.rateContent.storeid},$scope.currentModal, function (data) {
                    toaster.pop('success', '保存成功');
                    $scope.boxStatus = 1;
                }, function (error) {
                    toaster.pop('error', '保存失败');
                })
            } else if ($scope.boxStatus == 3) {
                Rate.saveRateTemplate({storeuuid: $scope.rateContent.storeid},{rateTemplateName: $scope.modalTempData.modalTitle, rateTemplateContent: $scope.modalTempData.rateContent}, function (data) {
                    toaster.pop('success', '保存成功');
                    $scope.currentModal = data.data;
                    Rate.getRateTemplate({storeuuid: $scope.rateContent.storeid},{},function (data) {
                        $scope.modalData = data.data;
                        Rate.getRateBuyer({orderId: $scope.rateContent.orderid},{},function (data) {
                            $scope.rateBuyer = data.data;
                        });
                        $scope.boxStatus = 1;
                    },function (error) {
                        toaster.pop('error', '获取模板信息失败');
                    });
                    $scope.boxStatus = 1;
                }, function (error) {
                    toaster.pop('error', '保存失败');
                })
            }
        }

        //提交评论
        $scope.rateContent = {
            level: 1
        };
        /* $scope.rateContent.storeid = purchase.storeid;
         $scope.rateContent.purchaseid = purchase.purchaseid;
         $scope.rateContent.orderid = purchase.orderid;*/
        $scope.submitRate = function () {
            var param = {
                orderId: $scope.rateContent.orderid,
                purchaseId: $scope.rateContent.purchaseid,
                storeId: $scope.rateContent.storeid,
                level: $scope.rateContent.level
            };
            if ($scope.rateType == "firstRate") {
                param.vendorRate = $scope.modalTempData.rateContent;
                Rate.saveRateBuyer({purchaseId: $scope.rateContent.purchaseid},param,function (data) {
                    toaster.pop('success', '评价成功');
                    $scope.setShowRateBoxFlag(false);
                    $scope.orderTableParams.reload();
                },function (error) {
                    toaster.pop('error', '评价失败');
                });
            } else if ($scope.rateType == "addRate") {
                param.vendorAfterRate = $scope.modalTempData.rateContent;
                Rate.saveAfterRateBuyer({purchaseId: $scope.rateContent.purchaseid},param,function (data) {
                    toaster.pop('success', '评价成功');
                    $scope.setShowRateBoxFlag(false);
                    $scope.orderTableParams.reload();
                },function (error) {
                    toaster.pop('error', '评价失败');
                });
            }
        }


        /***********卖家评论模块 *** end *****************************/

    }]);

    app.register.filter('VendorStatusFilter', function () {
        return function (status) {
            var result = "暂无该状态";
            switch (status) {
                case 501:
                    result = '待买家付款';
                    break;
                case 524:
                    result = '待买家付款';
                    break;
                case 525:
                    result = '卖家发起取消,待确认';
                    break;
                case 504:
                    result = '付款确认中';
                    break;
                case 502:
                case 406:
                    result = '买家已付款';
                    break;
                case 404:
                    result = '待买家收货';
                    break;
                case 405:
                case 514:
                case 503:
                case 506:
                    result = '待商城付款';
                    break;
                case 602:
                case 603:
                case 315:
                case 604:
                case 605:
                case 606:
                    result = '已取消';
                    break;
                case 520:
                    result = '交易完成';
                    break;
                case 522:
                    result = '已完成评价';
                    break;
            }
            return result;
        }


    });
    /**
     * 与现在的时间对比，距离多少天多少小时
     */
    app.register.filter('restTime', function () {
        var day = 0, hours = 0;
        return function (time) {
            if(!time) {
                return null;
            }
            var nowTime = new Date();
            var s1 = time - nowTime.getTime();
            var totalHours = s1/(1000*60*60);//算多少个小时
            day = parseInt(totalHours) / 24;
            hours = parseInt(totalHours) % 24;
            return "还剩 " + parseInt(day) + "天" + parseInt(hours) + "小时";
        }
    });
    app.register.controller('cancelControler', ['$scope','purchaseid', 'Purchase', '$modalInstance', 'toaster', '$window', function ($scope, purchaseid, Purchase, $modalInstance, toaster, $window) {
        $scope.reloadRoute = function () {
            $window.location.reload();
        };
        $scope.purchase = {};
        $scope.purchaseid = purchaseid;

        /**
         * 确认取消订单
         */
        $scope.confirm = function () {
            if(!$scope.purchase.reason) {
                toaster.pop('info','请选择取消订单的原因');
                return ;
            }
            Purchase.sellerCancelOrder({purchaseId : purchaseid, reason : $scope.purchase.reason}, null, function () {
                toaster.pop('success','操作成功，等待买家确认');
                $modalInstance.close();
                // $scope.reloadRoute();
            }, function (res) {
                console.log(res);
                toaster.pop('error','取消订单失败，请重新操作');
            });
        }

        /**
         * 取消操作
         */
        $scope.cancel = function () {
            $modalInstance.dismiss();
        }

    }]);
});
