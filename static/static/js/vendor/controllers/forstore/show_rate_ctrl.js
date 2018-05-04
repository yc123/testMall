define(['app/app'], function(app) {
    app.register.controller('showRateCtrl', ['$scope', '$rootScope', '$stateParams','$state', 'toaster','Rate','Order','BaseService','ngTableParams', function ($scope, $rootScope, $stateParams, $state, toaster, Rate, Order, BaseService, ngTableParams) {

        /***********卖家回复评论模块 *** start *****************************/
        document.title = '查看评价-优软商城';
        $scope.cont = false;
        $scope.setContFalse = function () {
            $scope.cont = false;
        };
        $scope.buyEmail = $stateParams.buyEmail;
            //初始化
        var init = function () {
                //卖家评价买家
                Rate.getRateBuyer({orderId: $scope.order.orderid},{},function (data) {
                    $scope.sellerRateBuyer = data.data;
                },function (error) {
                    toaster.pop('error', '获取卖家评价买家数据失败');
                })
                //买家评价卖家
                Rate.getRateVendor({orderId: $scope.order.orderid},{},function (data) {
                    $scope.buyerRateSeller = data.data;
                    // $scope.buyerRateSeller.describeLevel = $scope.range(buyerRateSeller.describeLevel);
                    // $scope.buyerRateSeller.logisticsLevel = $scope.range(buyerRateSeller.logisticsLevel);
                    // $scope.buyerRateSeller.vendorLevel = $scope.range(buyerRateSeller.vendorLevel);
                },function (error) {
                    toaster.pop('error', '获取买家评价卖家数据失败');
                })
            }

        //分页
        $scope.$$kdnData = {};
        $scope.showRateTableParams = new ngTableParams({
            page : 1,
            count : 10
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                //买家评价商品
                Order.get({orderid : $stateParams.orderId}, function (data) {
                    if (data.length != 1) {
                        toaster.pop('warning', '获取订单信息失败');
                        return;
                    }
                    $scope.order = data[0];
                    Rate.getRateGoodsByOrderId({orderId: $scope.order.orderid, page: param.page, count: param.count}, {}, function (data) {
                        $scope.$$kdnData.totalElements = data.data.totalElements;
                        if(Number(data.data.totalElements) > 0) {
                            $scope.$$kdnData.start = Number(data.data.size) * (Number(data.data.number) - 1) + 1;
                        }else {
                            $scope.$$kdnData.start = 0;
                        }
                        $scope.$$kdnData.end = Number(data.data.size) * (Number(data.data.number) - 1) + Number(data.data.numberOfElements);
                        params.total(data.data.totalElements);
                        $defer.resolve(data.data.content);
                        $scope.buyerRateGoods = data.data.content;
                        angular.forEach($scope.buyerRateGoods, function (item, index) {
                            for (var i = 0; i < $scope.order.orderDetails.length; i++) {
                                item.showRateReply = false;
                                item.showAddRateReply = false;
                                if (item.goodsId == $scope.order.orderDetails[i].id) {

                                    item.goodsDetail = $scope.order.orderDetails[i];
                                }
                            }
                            init();
                        });
                    });
                }, function (res) {
                    toaster.pop('error', '获取信息失败 ', res.data);
                });
            }
        });

        // //数字->数组
        // $scope.range = function(n) {
        //     return new Array(n);
        // }
        $scope.listenRateContent = function () {
            var str = $scope.modalTempData.rateContent
            if (str.length > 200) {
                var el = angular.element('#rateContent');
                el.blur();
                $scope.modalTempData.rateContent = str.substring(0, 200);
                el.focus();
            }
        }

        $scope.modalData = [];

        $scope.getModal = function (detail, type) {
            // $scope.rateContent.storeid = purchase.storeid;
            // $scope.rateContent.purchaseid = purchase.purchaseid;
            // $scope.rateContent.orderid = purchase.orderid;
            if(type == 'allRate'){
                var count= 0 ;
                if ($scope.order.rateStatus == 523){
                    angular.forEach($scope.buyerRateGoods,function (item,index) {
                        if (item.buyerRate != '此用户没有填写评价！' && item.buyerRate != '此用户未及时做出评价，系统默认好评！'){
                            if (!item.returnMeg || item.returnMeg =='' ){
                            }else{count++;}
                        }else{count++;}
                    });
                }else if ($scope.order.rateStatus == 522){
                    angular.forEach($scope.buyerRateGoods,function (item,index) {
                        if (item.buyerAfterRate && !item.afterReturnMeg){}else {count++;}
                    })
                }
                if (count == $scope.buyerRateGoods.length){
                    $scope.setShowRateBoxFlag(false);
                    toaster.pop('warning', '您当前没有可回复的评价');
                    return;
                }
            }
            $scope.rateType = type;
            if (detail) {$scope.goodsId = detail.goodsId;
                Rate.getRateTemplate({storeuuid: detail.storeId},{},function (data) {
                    $scope.modalData = data.data;
                },function (error) {
                    toaster.pop('error', '获取模板信息失败');
                });
                $scope.setShowRateBoxFlag(true);
            }else {
                Rate.getRateTemplate({storeuuid: $scope.order.storeid},{},function (data) {
                    $scope.modalData = data.data;
                },function (error) {
                    toaster.pop('error', '获取模板信息失败');
                });
                $scope.setShowRateBoxFlag(true);
            }

        }

        //控制评论模态框的显示隐藏
        $scope.showRateBoxFlag = false;

        $scope.setShowRateBoxFlag = function (flag) {
            $scope.showRateBoxFlag = flag;
            if (!flag){
                $scope.rateContent.level = 1;
                $scope.boxStatus = 2;
                $scope.modalTempData.rateContent = '';
                $scope.modalTempData.modalTitle = '';
            }
        }

        //评价类型：追评addRate/初次评价firstRate，默认初评
        $scope.rateType = 'firstRate';

        $scope.setRateType = function (type) {
            $scope.rateType = type;
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
            if ($scope.boxStatus == 4) {
                $scope.currentModal.rateTemplateContent = $scope.modalTempData.rateContent;
                $scope.currentModal.rateTemplateName = $scope.modalTempData.modalTitle;
                Rate.saveRateTemplate({storeuuid: $scope.order.storeid},$scope.currentModal, function (data) {
                    toaster.pop('success', '保存成功');
                    $scope.boxStatus = 1;
                }, function (error) {
                    toaster.pop('error', '保存失败');
                })
            } else if ($scope.boxStatus == 3) {
                Rate.saveRateTemplate({storeuuid: $scope.order.storeid},{rateTemplateName: $scope.modalTempData.modalTitle, rateTemplateContent: $scope.modalTempData.rateContent}, function (data) {
                    toaster.pop('success', '保存成功');
                    Rate.getRateTemplate({storeuuid: $scope.order.storeid},{},function (data) {
                        $scope.modalData = data.data;
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
        $scope.rateContent = {};

        $scope.submitRate = function () {
            var param = {
                goodsId: $scope.goodsId,
                returnMeg: $scope.modalTempData.rateContent
            };
            if ($scope.rateType == "firstRate") {
                Rate.saveReply({orderId: $scope.order.orderid, goodsId: $scope.goodsId, returnMeg: $scope.modalTempData.rateContent},{},function (data) {
                    toaster.pop('success', '回复成功');
                    $state.reload();
                },function (error) {
                    toaster.pop('error', '回复失败');
                });
            } else if ($scope.rateType == "addRate") {
                Rate.saveAfterReply({orderId: $scope.order.orderid, goodsId: $scope.goodsId, returnMeg: $scope.modalTempData.rateContent},{},function (data) {
                    toaster.pop('success', '回复成功');
                    $state.reload();
                },function (error) {
                    toaster.pop('error', '回复失败');
                });
            } else if ($scope.rateType == "allRate") {
                var count= 0 ;
                if ($scope.order.rateStatus == 523){
                    angular.forEach($scope.buyerRateGoods,function (item,index) {
                        if (item.buyerRate != '此用户没有填写评价！'){
                            if (!item.returnMeg || item.returnMeg =='' ){
                                item.returnMeg = param.returnMeg;
                            }else{count++;}
                        }else{count++;}
                    })
                    if (count == $scope.buyerRateGoods.length){
                        $scope.setShowRateBoxFlag(false);
                        toaster.pop('warning', '所有商品都已回复完成');
                        return;
                    }
                }else if ($scope.order.rateStatus == 522){
                    angular.forEach($scope.buyerRateGoods,function (item,index) {
                        if (item.buyerAfterRate && !item.afterReturnMeg){
                            item.afterReturnMeg = param.returnMeg;
                        }else {count++;}
                    })
                    if (count == $scope.buyerRateGoods.length){
                        $scope.setShowRateBoxFlag(false);
                        toaster.pop('warning', '所有商品都已回复完成');
                        return;
                    }
                }
                Rate.saveAllReply({orderId: $scope.order.orderid},$scope.buyerRateGoods,function (data) {
                    toaster.pop('success', '批量回复成功');
                    $state.reload();
                },function (error) {
                    toaster.pop('error', '回复失败');
                });
            }
        }


        /***********卖家回复评论模块 *** end *****************************/
    }]);
});