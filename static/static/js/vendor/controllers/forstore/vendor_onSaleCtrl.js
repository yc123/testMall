define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendor_onSaleCtrl', ['$scope', '$rootScope', 'Goods', '$modal', 'toaster', 'Loading', 'StoreInfo', 'AuthenticationService', '$q', 'StoreCms', 'NumberService', 'Enterprise', 'ByteCountService', 'DistributionRule', function ($scope, $rootScope, Goods, $modal, toaster, Loading, StoreInfo, AuthenticationService, $q, StoreCms, NumberService, Enterprise, ByteCountService, DistributionRule) {
        $rootScope.active = 'vendor_material';
        $scope.keyword = '';
        $scope.tab = 'onSale';
        $scope.isInt = /^[0-9]*[1-9][0-9]*$/;
        document.title = '卖家在售产品-优软商城';
        //数字的正则表达式
        var intPattern = /^[1-9]+$/;

        $scope.packageArray = ["Bulk-散装", "Reel-卷装", "Tape/Reel-编带", "Tray-盘装",
            "Tube-管装", "盒装", "袋装", "罐装", "瓶装", "桶装", "箱装"];

        //只包含中文和英文的字符
        var pattern = /^[\u4e00-\u9fa5a-zA-Z]+$/;
        $scope.param = {
            page : 1,
            count : 10,
            sorting : {
                createdDate: 'DESC'
            },
            status : "601-602"
        };

        /**
         * 最大
         * @type {number}
         */
        $scope.maxReserve = 999999999;
        /**
         * 最小包装量的最大值
         */
        $scope.maxPackQty = 999999;
        $scope.minReserve = 1;

        // 商品分页数据
        $scope.goodsPageParams = {};
        $scope.selfSupportType = {
            ALL: '销售方式',
            SELF_SUPPORT: '自营',
            CONSIGNMENT: '寄售'
        };
        $scope.selfSupport = $scope.selfSupportType.ALL;

        $scope.onsale = {};

        //获取币别信息
        Enterprise.getCurrencyByRegisterAddress(null, function (data) {
            if(data.code == 1) {
                $scope.onsale.currency = data.data;
            }else {
                toaster.pop('info', '提示', '您公司的注册地址为空，无法确定币别，系统默认为人民币');
                $scope.onsale.currency = 'RMB';
            }
        }, function (response) {
            toaster.pop('info', '提示', '获取不到公司的币别信息');
        });

        //获取登录的信息
        var getAuthentication = function () {
            return AuthenticationService.getAuthentication().success(function(data) {
                if(data && data.enterprises) {
                    data.enterprise = data.enterprises[data.enterprises.length - 1];
                    if(data.enterprises.length > 1) {
                        var enSelect = [];
                        angular.forEach(data.enterprises, function(e){
                            if(e.current)
                                data.enterprise = e;
                            else
                                enSelect.push(e);
                        });
                        data.enSelect = enSelect;
                    }
                }
                $rootScope.userInfo = data;
            }).error(function(response) {
                toaster.pop('info', '获取定单的信息' + response);
            });
        }

        //判断是否是商城管理公司，是否可以选择自营。
        $q.all([getAuthentication()]).then(function() {
            //获取店铺的信息
            StoreInfo.getStoreInfoByEnuu({enUU : $rootScope.userInfo.enterprise.uu}, function(data) {
                $scope.storeInfo = data;
            }, function(response) {
                toaster.pop('error', '获取店铺的信息失败, ' + response.data);
            });
        });

        //初始化页数信息
        $scope.initPages = function (totalElementPages) {
            var pageNum = [];
            if(totalElementPages == 1) {
                return ;
            }else if(totalElementPages < 10) {
                for(var i = 0; i < totalElementPages + 2; i++) {
                    pageNum.push(i);
                }
            }else {
                pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
            angular.forEach(pageNum, function (number) {
                var page = {active : true, type : 'page', number : number};
                if(number == 0) {
                    page.type = 'prev';
                }else if(number == 1) {
                    page.type = 'first';
                }else if(number == pageNum.length - 2) {
                    page.type = 'last';
                    page.number = totalElementPages;
                }else if(number == pageNum.length - 1){
                    page.type = 'next';
                }
                $scope.pages.push(page);
            });
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
                        if(currentPage == 1) {
                            page.active = false;
                        }
                    default : {
                        page.current = (currentPage == page.number);
                    }
                }
            });
        };

        //当前页在后端计算方式
        $scope.endSegment = function (currentPage, totalElementPages) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 2:
                        page.active = false;
                        page.type = 'more';
                        break;
                    case 10:
                        if(currentPage == totalElementPages) {
                            page.active = false;
                        }
                        break;
                    case 0:
                    case 1:
                        break;
                    default:
                        if(page.number != totalElementPages) {
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
                        page.type ='more';
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
        };

        //输入框监听Enter事件
        $scope.listenEnter = function () {
            if($scope.param.currentPage) {
                if(!intPattern.test($scope.param.currentPage)) {
                    $scope.param.currentPage = $scope.param.page;
                    return ;
                }
            }
            if(event.keyCode == 13) {
                $scope.setPage("page", $scope.param.currentPage);
            }
        };

        $scope.setPage = function(type, number) {
            if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
                return ;
            };
            var page = -1;
            switch (type) {
                case "page":
                    if(number < 1) {
                        page = 1;
                    }else if(number > $scope.goodsAll.totalPages) {
                        page = $scope.goodsAll.totalPages;
                    }else {
                        page = number;
                    };
                    break;
                case "prev":
                    if($scope.param.page <= 1) {
                        page = 1;
                    }else {
                        page =$scope.param.page - 1;
                    };
                    break;
                case "next":
                    if($scope.param.page >= $scope.goodsAll.totalPages) {
                        page = $scope.goodsAll.totalPages
                    }else {
                        page =$scope.param.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.goodsAll.totalPages;
                    break;
            }
            if(page == $scope.param.page || page < 1 || page > $scope.goodsAll.totalPages) {
                $scope.param.currentPage = $scope.param.page;
                return ;
            }
            $scope.param.page = page;
            loadData();
        };

        //计算页数的方式。
        $scope.acculatePages = function(currentPage, totalElementPages) {
            $scope.pages = [];
            if(totalElementPages < 1)  {
                return ;
            }
            //初始化页面数据
            $scope.initPages(totalElementPages);

            if(totalElementPages < 10) {
                angular.forEach($scope.pages, function (page) {
                    if(page.number == currentPage) {
                        page.current = true;
                    }
                });
            }else if(currentPage < 6) {//当期页小于6
                $scope.frontSegment(currentPage, totalElementPages);
            }else if(currentPage > totalElementPages - 5) { //当期页在后面
                $scope.endSegment(currentPage, totalElementPages);
            }else { //当期页在中间
                $scope.middleSegment(currentPage);
            }
        };

        $scope.onSearch = function () {
            loadDataReload();
        };

        var loadData = function () {
            if ($scope.selfSupport === $scope.selfSupportType.SELF_SUPPORT) {
                $scope.param.isSelfSupport = true;
            } else if ($scope.selfSupport === $scope.selfSupportType.CONSIGNMENT) {
                $scope.param.isSelfSupport = false;
            } else {
                $scope.param.isSelfSupport = null;
            }
            $scope.param.keyword = $scope.keyword;
            Goods.getGoodsByPageAndStatus($scope.param, function (data) {
                $scope.goodsAll = data;
                $scope.currenctGoods = data.content;
                if ($scope.currenctGoods.length == 0) {
                    $scope.chooseAllPage = false;
                }
                $scope.param.currentPage = data.number;
                if ($scope.param.currentPage == data.totalPages) {
                    $scope.endNumber = data.totalElements;
                } else {
                    $scope.endNumber = data.number * data.size;
                }
                $scope.acculatePages(data.number, data.totalPages);
                if($scope.currenctGoods.length > 0) {
                    //防止默认选择的RMB不是用户上传的币别信息
                    if($scope.currenctGoods[0].currencyName == 'USD') {
                        $scope.onsale.currency = 'USD';
                    }else {
                        $scope.onsale.currency = 'RMB';
                    }
                    angular.forEach($scope.currenctGoods, function (goods) {
                        if ($scope.chooseAllPage) {
                            goods.isChoosed = true;
                        } else {
                            goods.isChoosed = false;
                        }
                    });
                }
                $scope.chooseAll = false;
            });
        };

        // 全选
        $scope.chooseAllItem = function () {
            $scope.chooseAll = !$scope.chooseAll;
            angular.forEach($scope.currenctGoods, function (goods) {
                goods.isChoosed = $scope.chooseAll;
            });
            if (!$scope.chooseAll) {
                $scope.chooseAllPage = false;
            }
        };

        $scope.turnAllPage = function () {
            if ($scope.chooseAll) {
                $scope.chooseAllPage = true;
            }
        };

        $scope.cancelAllPage = function () {
            $scope.chooseAllPage = false;
            $scope.chooseAll = false;
            angular.forEach($scope.currenctGoods, function (goods) {
                goods.isChoosed = false;
            });
        };

        // 检查是否全选
        var checkChoosedAll = function () {
            $scope.chooseAll = true;
            angular.forEach($scope.currenctGoods, function (goods) {
                if (!goods.isChoosed) {
                    $scope.chooseAll = false;
                }
            });
            if (!$scope.chooseAll) {
                $scope.chooseAllPage = false;
            }
        };

        $scope.isDoubleChecked = false;
        // 单选
        $scope.chooseOne = function (event, goods) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
                $scope.isDoubleChecked = true;
            }
            if (typeof goods.isChoosed == 'undefined' || !goods.isChoosed) {
                goods.isChoosed = true;
            } else {
                goods.isChoosed = false;
            }
            if ($scope.isDoubleChecked) {
                goods.isChoosed = !goods.isChoosed;
                $scope.isDoubleChecked = false;
            }
            checkChoosedAll();
        };

        //获取选中之后的信息
        var getChooseBatch = function () {
            $scope.choosedBatch = [];
            angular.forEach($scope.currenctGoods, function (goods) {
                if (goods.isChoosed) {
                    $scope.choosedBatch.push(goods.batchCode);
                }
            });
        };

        //获取选中之后的信息
        var getChooseInfo = function () {
            $scope.choosedIds = [];
            angular.forEach($scope.currenctGoods, function (goods) {
                if (goods.isChoosed) {
                    $scope.choosedIds.push(goods.id);
                }
            });
        };

        $scope.cancelBatch = function (event) {
            if (event) {
                event.stopPropagation();
            }
            $scope.batchStatus = false;
        };

        $scope.batchOperation = function (num) {
            getChooseInfo();
            if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
                toaster.pop('info', '您尚未选中任何产品');
                return ;
            }
            $scope.batchStatus = true;
            $scope.batchType = num;
            if (num == 1) {
                $scope.batchTitle = '是否要删除选中的产品？'
            } else {
                $scope.batchTitle = '是否要下架选中的产品？'
            }
        };

        /**
         * 批量删除
         */
        $scope.batchDelete = function () {
            if ($scope.chooseAllPage) {
                Goods.deleteGoodsByEnUU({}, {}, function (result) {
                    if (result.success) {
                        var message = "成功删除"+ result.data.success +"个产品，另有"
                            + result.data.fail + "个产品无法删除";
                        toaster.pop('success', message);
                        $scope.batchStatus = false;
                        loadDataReload();
                    } else {
                        toaster.pop('error', result.message);
                    }
                })
            } else {
                getChooseInfo();
                if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
                    toaster.pop("info", "您尚未选中任何产品");
                    return ;
                }
                Goods.deleteGoodsByIdList({}, $scope.choosedIds, function (result) {
                    if (result.success) {
                        var message = "成功删除"+ result.data.success +"个产品，另有"
                            + result.data.fail + "个产品无法删除";
                        toaster.pop('success', message);
                        $scope.batchStatus = false;
                        loadDataReload();
                    } else {
                        toaster.pop('error', result.message);
                    }
                })
            }
        };

        $scope.batchDown = function () {
            if ($scope.chooseAllPage) {
                Goods.downNowEnterpriseGoods({}, {}, function(result) {
                    if (result.success) {
                        toaster.pop('success', '下架成功');
                        $scope.batchStatus = false;
                        loadDataReload();
                    } else {
                        toaster.pop('error', result.message);
                    }
                });
            } else {
                getChooseBatch();
                if (!$scope.choosedBatch || $scope.choosedBatch.length == 0) {
                    toaster.pop("info", "您尚未选中任何产品");
                    return ;
                }
                var batchs = $scope.choosedBatch.join(",");
                Goods.offShelfGoodsByProvider({batchCodes : batchs}, {}, function(map){
                    if (map.success) {
                        toaster.pop('success', '下架成功');
                        $scope.batchStatus = false;
                        loadDataReload();
                    } else {
                        toaster.pop('error', map.message);
                    }
                }, function(){
                    toaster.pop('error', '下架失败');
                });
            }
        };

        $scope.updateCommodityInfo = function (commodity) {
            Goods.offShelfGoodsByProvider({batchCodes : commodity.batchCode}, {}, function(map){
                if (map.success) {
                    toaster.pop('success', '下架成功');
                    $scope.isSoldOut = false;
                    loadDataReload();
                } else {
                    toaster.pop('error', map.message);
                }
            }, function(){
                toaster.pop('error', '下架失败');
            });
        };

        /*查看大图*/
        $scope.showImg = function(imgUrl) {
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

        /*******************************编辑库存信息 start****************************************/

        var countLength = function (string) {
            return string.replace(/[^\x00-\xff]/g,'**').length;
        };

        var cutOutString = function (str, length) {
            for (var i = 1; i <= str.length; i++) {
                if (countLength(str.substr(0, i)) > length){
                    str = str.substr(0, i-1);
                    break;
                }
            }
            return str;
        };

        /**
         * 编辑包装方式的信息
         * @param goods
         * @param edit
         */
        $scope.editPackaging = function(goods) {
            if (goods.editPackaging) {
                if (!pattern.test(goods.editPackaging)) {
                    if (!$scope.enterSaveButton) {
                        goods.editPackagingInvalid = true;
                        toaster.pop('warning', '提示', '包装方式只能填写中英文');
                        return ;
                    }
                }
            }
            goods.editPackagingInvalid = false;
        };

        $scope.changePackaging = function (goods) {
            if (goods.editPackaging) {
                goods.editPackaging = cutOutString(goods.editPackaging, 10);
            }
        };

        $scope.editProduceDateFa = function(commodity) {
            if($scope.enterSaveButton) {
                return ;
            }
            commodity.editProduceDateInvalid = false;
            if(commodity.editProduceDate) {
                commodity.editProduceDate = cutOutString(commodity.editProduceDate, 12);
                // if(goods.editProduceDate.length > 11) {
                //     goods.editProduceDateInvalid = true;
                //     toaster.pop('warning', '提示', '生产日期不能超过十一个字符');
                // }
            }
        }

        /**
         * 自定义标签的判断逻辑
         * @param commodity
         */
        $scope.editTag = function (commodity) {
            if (!commodity.editTag) {
                toaster.pop("warning", "自定义标签不能为空");
            }
            if (commodity.editTag) {
                Goods.getRepeatByTagAndProductId({goodId:commodity.id, productId:commodity.productid, tag:commodity.editTag}, function (data) {
                    if (data.success) {
                        if (data.data) {
                            toaster.pop("warning", "该产品下已存在相同的自定义标签");
                        }
                    } else {
                        toaster.pop("error", data.message);
                    }
                }, function (error) {
                    toaster.pop("error","判断标签重复请求错误" + error.date);
                })
            }
        }

        /**
         * 修改字符串信息
         */
        $scope.changeTag = function (commodity) {
            var length = ByteCountService.strByteLength(commodity.editTag);
            if (length > 20) {
                commodity.editTag = commodity.editTagPre;
            } else {
                commodity.editTagPre = commodity.editTag;
            }
        }
        /**
         * 增加对应的分段。
         * @param commodity
         */
        $scope.addFragment = function (commodity) {
            if(commodity.editPrices.length > 2) {
                toaster.pop('warning', "提示", "批次最多只能有三个分段");
                return ;
            }
            var price = {};
            price.start = null;
            price.startPre = null;
            price.end = commodity.editPrices[commodity.editPrices.length - 1].end;
            price.endPre = price.end;
            price.uSDPrice = null;
            price.uSDPricePre = null;
            price.rMBPrice = null;
            price.rMBPricePre = null;
            commodity.editPrices[commodity.editPrices.length - 1].end = null;
            commodity.editPrices[commodity.editPrices.length - 1].endPre = null;
            commodity.editPrices.push(price);
        }

        /**
         * 删除对应的分段.
         * @param commodity
         */
        $scope.deleteFragment = function(commodity, index) {
            if (index > -1 && index < commodity.editPrices.length) {
                if (commodity.editPrices.length < 2) {
                    toaster.pop('warning', "提示", "商品至少需要一个分段");
                    return ;
                }
                if (index < commodity.editPrices.length - 1) { //不是最后一个分段
                    var price = commodity.editPrices.splice(index, 1);
                    commodity.editPrices[index].start = price[0].start;
                } else if (index == commodity.editPrices.length - 1) { //如果删除的是最后一个分段，
                    var price = commodity.editPrices.splice(index, 1);
                    commodity.editPrices[index -1].end = price[0].end;
                }
                if (commodity.editMinBuyQty && $scope.isInt.test(commodity.editMinBuyQty) &&
                    parseInt(commodity.editPrices[0].end) >= parseInt(commodity.editMinBuyQty)) {
                    if (commodity.editMinBuyQtyInValid) {
                        commodity.editMinBuyQtyInValid = false;
                        commodity.editPrices[0].start = commodity.editMinBuyQty;
                    }
                }
            }
        };

        /**
         * 去对应的批次信息
         */
        $scope.goToBatchDetail = function (event, commodity) {
            event.stopPropagation();
            if(!commodity || !event || commodity.edit) {
                return ;
            };
            var tag = event.target;
            if(tag) {
                while((tag != null) && (tag.nodeName != 'BODY')) {
                    var name = tag.getAttribute('name');
                    if(name != null &&(name == 'edit-a' || name == 'down-a'
                        || name == 'img-a' || name == 'kind-a' || name == 'brand-a'
                        || name == 'cancle-a' || name == 'save-a' || name == 'reduce-a'
                        || name == 'add-a' || name == 'check-one')) {
                        return ;
                    }
                    tag = tag.parentElement;
                }
            };
            window.open("/store/productDetail/" + commodity.batchCode);
        };

        /**
         * 取消修改订单
         */
        $scope.cancleEdit = function (commodity) {
            if(!commodity) {
                return ;
            }
            for(var i = 0; i < $scope.currenctGoods.length; i++) {
                if($scope.currenctGoods[i].id == commodity.id) {
                    $scope.currenctGoods.splice(i, 1, $scope.onsale.editGoods);
                }
            };
        };

        /**
         * 编辑库存信息,
         * 将需要编辑的信息增加一个备份
         * @param commodity
         */
        $scope.editCommodity = function (commodity) {
            if(commodity == null) {
                true;
            }
            $scope.onsale.editGoods = angular.copy(commodity);
            angular.forEach($scope.currenctGoods, function (goods) {
                goods.edit = false;
            });
            commodity.edit = true;

            commodity.editPrices = angular.copy(commodity.prices);
            angular.forEach(commodity.editPrices, function (price) {
                price.startPre = price.start;
                price.startDirty = false;

                price.endPre = price.end;
                price.endDirty = false;

                price.rMBPricePre = price.rMBPrice;
                price.rMBPriceDirty = false;

                price.uSDPricePre = price.uSDPrice;
                price.uSDPriceDirty = false;
            });

            commodity.editTagInvalid = false;
            commodity.editTag = commodity.tag;
            commodity.editTagPre = commodity.tag;
            commodity.editTagDirty = false;

            commodity.editPrices[commodity.editPrices.length - 1].end = $scope.maxReserve;
            commodity.editPrices[commodity.editPrices.length - 1].endPre = $scope.maxReserve;
            // commodity.editPrices[0].start = $scope.minReserve;
            // commodity.editPrices[0].startPre = $scope.minReserve;

            commodity.editReserve = commodity.reserve;
            commodity.editReservePre = commodity.reserve;
            commodity.editReserveDirty = false;
            commodity.editReserveInvalid = false;

            commodity.editMinBuyQty = commodity.minBuyQty;
            commodity.editMinBuyQtyPre = commodity.minBuyQty;
            commodity.editMinBuyQtyDirty = false;
            commodity.editMinBuyQtyInValid = false;

            commodity.editMinPackQty = commodity.minPackQty;
            commodity.editMinPackQtyPre = commodity.minPackQty;
            commodity.editMinPackQtyDirty = false;
            commodity.editMinPackQtyInValid = false;

            commodity.editBreakUp = commodity.breakUp;
            commodity.editBreakUpPre = commodity.breakUp;
            commodity.editBreakUpDirty = false;

            commodity.editPackaging = commodity.packaging;
            commodity.editPackagingPre = commodity.packaging;
            commodity.editPackagingDirty = false;
            commodity.editPackagingInvalid = false;

            commodity.editProduceDate = new String(commodity.produceDate || '');
            commodity.editProduceDatePre = commodity.produceDate;
            commodity.editProduceDateDirty = false;
            commodity.editProduceDateInvalid = false;

            commodity.editSelfDeliveryHKMinTime = commodity.selfDeliveryHKMinTime;
            commodity.editSelfDeliveryHKMinTimePre = commodity.selfDeliveryHKMinTime;
            commodity.editSelfDeliveryHKMinTimeDirty = false;

            commodity.editSelfDeliveryHKMaxTime = commodity.selfDeliveryHKMaxTime;
            commodity.editSelfDeliveryHKMaxTimePre = commodity.selfDeliveryHKMaxTime;
            commodity.editSelfDeliveryHKMaxTimeDirty = false;

            commodity.editSelfDeliveryDemMinTime = commodity.selfDeliveryDemMinTime;
            commodity.editSelfDeliveryDemMinTimePre = commodity.selfDeliveryDemMinTime;
            commodity.editSelfDeliveryDemMinTimeDirty = false;

            commodity.editSelfDeliveryDemMaxTime = commodity.selfDeliveryDemMaxTime;
            commodity.editSelfDeliveryDemMaxTimePre = commodity.selfDeliveryDemMaxTime;
            commodity.editSelfDeliveryDemMaxTimeDirty = false;

            commodity.editMinDelivery = commodity.minDelivery;
            commodity.editMinDeliveryPre = commodity.minDelivery;
            commodity.editMinDeliveryDirty = false;
            commodity.editMinDeliveryinValid = false;

            commodity.editMaxDelivery = commodity.maxDelivery;
            commodity.editMaxDeliveryPre = commodity.maxDelivery;
            commodity.editMaxDeliveryDirty = false;
            commodity.editMaxDeliveryinValid = false;
            commodity.editPic = commodity.img;

            commodity.editSelfSale = $scope.storeInfo.uuid != 'undefind' && commodity.storeid == $scope.storeInfo.uuid && $scope.storeInfo.storeName.indexOf('优软测试二') < 0 && $scope.storeInfo.storeName.indexOf('优软商城') < 0 ? 1 : 2;
        };

        /**
         * 是否可拆卖
         * @param commodity
         */
        $scope.toggleIsBreadUp = function (commodity) {
            commodity.editBreakUp = !commodity.editBreakUp;
            if(!commodity.editBreakUp) {
                $scope.isNotBreakUp(commodity);
            }
        };

        /**
         * 修改commodity的系列的dirty属性 为true;
         * @param commodity
         */
        $scope.initDirtyTrue = function(commodity) {
            angular.forEach(commodity.editPrices, function (price) {
                price.startDirty = false;
                price.endDirty = false;
                price.rMBPriceDirty = false;
                price.uSDPriceDirty = false;
            });
            commodity.editReserveDirty = false;
            commodity.editMinBuyQtyDirty = false;
            commodity.editMinPackQtyDirty = false;
            commodity.editPackagingDirty = false;
            commodity.editProduceDateDirty = false;
            commodity.editSelfDeliveryHKMinTimeDirty = false;
            commodity.editSelfDeliveryHKMaxTimeDirty = false;
            commodity.editSelfDeliveryDemMinTimeDirty = false;
            commodity.editSelfDeliveryDemMaxTimeDirty = false;
        };

        /**
         * 修改分段的数量
         * @param commodity 批次信息
         * @param index 索引值
         * @param isEnd 是否是结束值
         */
        $scope.editQty = function (commodity, index, isEnd, num) {
            commodity.editPrices[index].endInValid = false;
            commodity.editPrices[index].startInValid = false;
            if(commodity.editPrices.length < index || index < 0) {
                return ;
            }
            if(!num) {
                return ;
            }
            if (!$scope.isInt.test(num)) {
                if(!$scope.enterSaveButton) {
                    if (isEnd) {
                        delete commodity.editPrices[index].end;
                        //commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                    } else {
                        delete commodity.editPrices[index].start;
                        //commodity.editPrices[index].start = commodity.editPrices[index].startPre;
                    }
                    toaster.pop('warning', '提示', '分段数量必须为正整数');
                }
                return ;
            }
            if (isEnd) {
                if (index < commodity.editPrices.length - 1) {
                    if (parseInt(commodity.editPrices[index].end) < parseInt(commodity.editPrices[index].start)) {
                        if(!$scope.enterSaveButton) {
                            toaster.pop('warning', '提示', '输入值必须大于' +  commodity.editPrices[index].start);
                            delete commodity.editPrices[index].end;
                        }
                        //commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                    } else if ((commodity.editPrices[index + 1].end) && (parseInt(commodity.editPrices[index].end) + 1) >= parseInt(commodity.editPrices[index + 1].end)) {
                        if(!$scope.enterSaveButton) {
                            toaster.pop('warning', '提示', '输入的值必须小于'+(parseInt(commodity.editPrices[index].end) - 1));
                            delete commodity.editPrices[index].end;
                        }
                        //commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                    } else {
                        commodity.editPrices[index + 1].start = parseInt(commodity.editPrices[index].end) + 1;
                        commodity.editPrices[index].endPre = commodity.editPrices[index].end;
                        commodity.editPrices[index + 1].startPre = commodity.editPrices[index + 1].start;
                    }
                }
                // else {
                //     if(commodity.editPrices[index].end > commodity.editMinBuyQty) {
                //         if(commodity.editPrices[index].end > commodity.reserve) {
                //             toaster.pop('warning', '提示', '修改最后一个分段的结束值之后，新的库存量大于原有的库存量');
                //             commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                //         }else {
                //             commodity.editReserve = commodity.editPrices[index].end;
                //             commodity.editPrices[index].endPre = commodity.editPrices[index].end;
                //             commodity.editReservePre = commodity.editReserve;
                //         }
                //     }else {
                //         toaster.pop('warning', '提示', '修改最后一个分段的结束值之后导致库存量小于起拍量');
                //         commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                //     }
                // }
            } else {
                if (index != 0) {
                    if (parseInt(commodity.editPrices[index].start) > parseInt(commodity.editPrices[index].end)) {
                        // toaster.pop('warning', '提示', '修改本分段之后，会导致分段的起始值' + commodity.editPrices[index ].start + '大于结束值' + parseInt(commodity.editPrices[index].end));
                        //commodity.editPrices[index].start = commodity.editPrices[index].startPre;
                        if(!$scope.enterSaveButton) {
                            toaster.pop('warning', '提示', '输入值必须小于'+ + commodity.editPrices[index].end);
                            delete commodity.editPrices[index].start;
                        }
                    } else if ((parseInt(commodity.editPrices[index].start) - 1) < commodity.editPrices[index - 1].start) {
                        // toaster.pop('warning', '提示', '修改本分段之后，会导致前一个分段的起始值' + commodity.editPrices[index - 1].start + '大于结束值' + (parseInt(commodity.editPrices[index].start) - 1));
                        // commodity.editPrices[index].start = commodity.editPrices[index].startPre;
                        if(!$scope.enterSaveButton) {
                            toaster.pop('warning', '提示', '输入值会导致梯度重叠，请重新修改');
                            delete commodity.editPrices[index].start;
                        }
                    } else {
                        commodity.editPrices[index - 1].end = parseInt(commodity.editPrices[index].start) - 1;
                        commodity.editPrices[index].startPre = commodity.editPrices[index].start;
                        commodity.editPrices[index - 1].endPre = commodity.editPrices[index - 1].end;
                    }
                 }//else {
                //     if(commodity.editMinPackQty) {
                //         if(commodity.editPrices[index].start % commodity.editMinPackQty != 0) {
                //             commodity.editPrices[index].startInValid = false;
                //             commodity.editPrices[index].start = commodity.editMinBuyQty;
                //             commodity.editPrices[index].startPre = commodity.editMinBuyQty;
                //             toaster.pop('warning', '提示', '第一个分段的起始量必须是倍数(' + commodity.editMinPackQty + ")的整数倍");
                //         }else {
                //             commodity.editMinBuyQty = commodity.editPrices[index].start;
                //             commodity.editMinBuyQtyPre = commodity.editPrices[index].start;
                //             commodity.editMinBuyQtyInValid = false;
                //         }
                //     }else {
                //         commodity.editMinBuyQty = commodity.editPrices[index].start;
                //         commodity.editMinBuyQtyPre = commodity.editMinBuyQty;
                //         commodity.editPrices[index].startPre = commodity.editPrices[index].start;
                //         commodity.editMinBuyQtyInValid = false;
                //     }
                // }
            }
        };

        /**
         * @param commodity 需要验证的批次的信息
         * @returns {boolean}
         */
        var changeQtyPrice = function(commodity) {
            var price = commodity.editPrices;
            var previousEnd = -1;
            for(var i = 0; i < price.length; i++){
                price[i].startInValid = false;
                price[i].endInValid = false;
                if(isNaN(price[i].start)) {
                    price[i].startInValid = true;
                    toaster.pop('warning', "提示", "分段数量必须是数字");
                    return false;
                }
                if(parseInt(price[i].start) <= previousEnd) {
                    price[i].startInValid = true;
                    toaster.pop('warning', "提示", "存在上一个分段的结束值大于下一个分段的起始值");
                    return false;
                }
                if(isNaN(price[i].end)) {
                    price[i].endInValid = true;
                    toaster.pop('warning', "提示", "分段数量必须是数字");
                    return false;
                }
                if(parseInt(price[i].start) > parseInt(price[i].end)) {
                    price[i].startInValid = true;
                    toaster.pop('warning', "提示", "存在分段的起始值大于分段的结束值");
                    return false;
                }
                previousEnd = price[i].end;
            }
            return true;
        };

        /**
         * commodity，
         * 验证库存量是否大于原有的库存量
         */
        $scope.changeReserve = function (commodity) {
            commodity.editReserveInvalid = true;
            if (typeof commodity.editReserve == 'undefined') {
                return;
            }
            if (!commodity.editReserve) {
                //commodity.editReserve = commodity.editReservePre;
                if (!$scope.enterSaveButton) {
                    commodity.editReserveInvalid = true;
                    toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                }
                return false;
            }
            if (!$scope.isInt.test(commodity.editReserve)) {
                //commodity.editReserve = commodity.editReservePre;
                if (!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                    commodity.editReserveInvalid = true;
                }
                return false;
            }
            // if (parseInt(commodity.editReserve) < parseInt(commodity.editMinBuyQty)) {
            //     //commodity.editReserve = commodity.editReservePre;
            //     commodity.editReserveInvalid = true;
            //     toaster.pop('warning', '提示', '库存必须是大于等于起订量的整数');
            //     return false;
            // }
            if (parseInt(commodity.editReserve) > $scope.maxReserve || commodity.editReserve < $scope.minReserve) {
                //commodity.editReserve = commodity.editReservePre;
                if (!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                    commodity.editReserveInvalid = true;
                }
                return false;
            }
            commodity.editReservePre = commodity.editReserve;
            commodity.editReserveInvalid = false;
            if (!commodity.breakUp) {
                $scope.isNotBreakUp(commodity);
            }
            return true;

        }

        var initRuleCount = function () {
            return DistributionRule.findCountOfActiveRule({},{},function (data) {
                if (data.success){
                    $scope.needShowTip = data.data;
                }
            }, function (error) {
                toaster.pop("error", error.data);
            })
        };
        initRuleCount();

        $q.all([initRuleCount().$promise]).then(function (data) {
            if (data){
                if ($scope.needShowTip){
                    $modal.open({
                        animation: true,
                        templateUrl: 'static/view/common/modal/delivery_rule_modal.html',
                        controller: 'rule_tip_ctrl',
                        resolve : {
                            type : function() {
                                return 'product';
                            },
                            tipModal : function() {
                                return true;
                            },
                            success : function () {
                                return false;
                            },
                            uuid: function () {
                                return null;
                            }
                        }
                    });
                }
            }
        });

        /**
         *
         * @param commodity
         * 验证库存的最小起订量是否大于库存量
         */
        $scope.changeMinBuyQty = function (commodity) {
            // commodity.editMinBuyQtyInValid = false;
            // if (typeof commodity.editMinBuyQty == 'undefined') {
            //     commodity.editMinBuyQtyInValid = true;
            //     return false;
            // }
            if (!$scope.isInt.test(commodity.editMinBuyQty) || parseInt(commodity.editMinBuyQty) < 1) {
                // goods.editMinBuyQtyInValid = true;
                if (commodity.editBreakUp) {
                    commodity.editMinBuyQty = 1;
                    commodity.editPrices[0].start = commodity.editMinBuyQty;
                } else {
                    if (commodity.editMinPackQty) {
                        commodity.editMinBuyQty = commodity.editMinPackQty;
                        commodity.editPrices[0].start = commodity.editMinBuyQty;
                    }
                }
                if (!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '起订量必须是大于0的整数');
                    return false;
                }
                return false;
            }
            commodity.editMinBuyQtyPre = commodity.editMinBuyQty;
            if (!commodity.editBreakUp) {
                $scope.isNotBreakUp(commodity);
            }
        };

        $scope.updateStartNumber = function (commodity) {
            commodity.editPrices[0].start = commodity.editMinBuyQty;
        };

        /**
         * 修改批次信息的包装个数
         * @param commodity
         */
        $scope.changeMinPackQty = function(commodity) {
            if(typeof commodity.editMinPackQty == 'undefined') {
                return;
            }
            if(!$scope.isInt.test(commodity.editMinPackQty)) {
                if(!$scope.enterSaveButton) {
                    commodity.editMinPackQtyInValid = true;
                    toaster.pop('warning', '提示', '包装数必须是大于0的整数');
                }
                return false;
            }
            if(commodity.editMinPackQty < 1) {
                if(!$scope.enterSaveButton) {
                    commodity.editMinPackQtyInValid = true;
                    toaster.pop('warning', '提示', '包装数必须是大于0的整数');
                }
                return false;
            }
            // if(commodity.editMinPackQty > commodity.editReserve) {
            //     toaster.pop('warning', '提示', '包装数必须小于等于库存量。');
            //     return false;
            // }
            if(parseInt(commodity.editMinPackQty) > $scope.maxPackQty) {
                if(!$scope.enterSaveButton) {
                    commodity.editMinPackQtyInValid = true;
                    toaster.pop('warning', '提示', '包装数量必须小于等于' + $scope.maxPackQty);
                }
                return false;
            }
            if(commodity.editMinBuyQty) {
                if(!commodity.editBreakUp) {
                    $scope.isNotBreakUp(commodity);
                }
            }
            commodity.editMinPackQtyPre = commodity.editMinPackQty;
            commodity.editMinPackQtyInValid = false;
        }

        /**
         * 比较交货周期的大小
         * @param min 本来是最小值
         * @param max 本来是最大值
         * @param type 2 表示当前验证的香港交期, 1表示当前验证的是大陆交期
         * @param commodity 批次信息
         * @returns {boolean} true 表示验证通过，false 表示验证失败。
         */
        $scope.compareNum = function(min, max, type, commodity) {
            if(!min) {
                commodity.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期存在空值，请重新操作');
                return false;
            }else if(!max) {
                commodity.editMaxDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期存在空值，请重新操作');
                return false;
            }
            if(!$scope.isInt.test(min)) {
                commodity.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                return false;
            }
            if(!$scope.isInt.test(max)) {
                commodity.editMaxDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                return false;
            }
            if(min < 1 || min > 999) {
                commodity.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的值');
                return false;
            }
            if(max < 1 || max > 999) {
                commodity.editMaxDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期的时间必须是1-999之内');
                return false;
            }
            if(Number(min) > Number(max)) {
                commodity.editMaxDeliveryinValid = true;
                commodity.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '最短交期应小于等于最长交期');
                return false;
            }
            return true;
        }

        /**
         * @param min 最小值
         * @param max 最大值
         * @param isMin 传入的是否是最小值
         * @param isHk 是否是香港交货周期
         * @param commodity 批次信息
         */
        $scope.changeDelivery = function(min, max, isMin, isHk, commodity) {
            if(isMin) {
                commodity.editMinDeliveryinValid = false;
            }else {
                commodity.editMaxDeliveryinValid = false;
            }
            var day = -1;
            if(isMin) {
                if(min && $scope.isInt.test(min)) {
                    day = min;
                }else {
                    if(!min) {
                        return ;
                    }
                    if(!$scope.isInt.test(min)) {
                        if(!$scope.enterSaveButton) {
                            commodity.editMinDeliveryinValid = true;
                            toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                        }
                    }
                    return ;
                }
            }else {
                if(max && $scope.isInt.test(max)) {
                    day = max;
                }else {
                    if(!max) {
                        return ;
                    }
                    if(!$scope.isInt.test(max)) {
                        if (!$scope.enterSaveButton) {
                            commodity.editMaxDeliveryinValid = true;
                            toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                        }
                    }
                    return ;
                }

            }
            if(day > 999 || day < 1) {
                if(!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                    if(isMin) {
                        commodity.editMinDeliveryinValid = true;
                    }else {
                        commodity.editMaxDeliveryinValid = true;
                    }
                }
                return ;
            }
            if(Number(min) > Number(max)) {
                if(!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '最短交期应小于等于最长交期');
                    commodity.editMinDeliveryinValid = true;
                    commodity.editMaxDeliveryinValid = true;
                }
                return ;
            }

            commodity.editMinDeliveryinValid = false;
            commodity.editMaxDeliveryinValid = false;
        }

        /**
         * 鼠标移入到保存按钮
         */
        $scope.impedeBlur = function () {
            $scope.enterSaveButton = true;
        }

        /**
         * 鼠标移出保存按钮
         */
        $scope.recoveryBlur = function () {
            $scope.enterSaveButton = false;
        }

        /**
         * 判断价格是否合理，只设置验证的结果
         * @param prices 分段价格
         * @param price 对应的价格
         * @param index 索引
         */
        $scope.changePrices = function (prices, price, index) {
            prices[index].priceInvalid = false;
            if(!prices || !prices[index] || !price) {
                return ;
            }
            if(isNaN(price)) {
                if (!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '单价必须是大于0的数字');
                    prices[index].priceInvalid = true;
                    return;
                }
            }
            if(new Number(price) <= 0) {
                if (!$scope.enterSaveButton) {
                    toaster.pop('warning', '提示', '单价必须是大于0的数字');
                    prices[index].priceInvalid = true;
                }
                return;
            }
            if(price.indexOf('.') > -1) {
                var arr = price.split(".");
                if(arr[0].length > 4 || arr[1].length > 6) {
                    prices[index].priceInvalid = true;
                    return ;
                }
            }else {
                if(price.toString().length > 4) {
                    prices[index].priceInvalid = true;
                    return ;
                }
            }
        };

        /**
         * 	验证库存信息的正确性,
         * @param goods 需要验证的GOODS信息
         * @returns {boolean}
         * 返回false 代表验证不通过。
         * 返回true  代表验证成功。
         */
        $scope.checkGoodsInfo = function (goods) {
            var result = false;
            if (!goods) {
                toaster.pop('warning', '提示', '库存信息丢失，请重新操作');
                return result;
            }
            if (!goods.editTag) {
                goods.editTagInvalid = true;
                toaster.pop('warning', '提示', '请填写标签信息');
                return result;
            }
            if (goods.editTag.length > 20) {
                goods.editTagInvalid = true;
                toaster.pop('warning', '提示', '标签信息超过了20个字符');
                return result;
            }
            if (!goods.editPackaging) {
                goods.editPackagingInvalid = true;
                toaster.pop('warning', '提示', '请填写包装方式');
                return result;
            }
            // if (!pattern.test(goods.editPackaging)) {
            //     goods.editPackagingInvalid = true;
            //     toaster.pop('warning', '提示', '包装方式仅能包含中文和英文字符');
            //     return result;
            // }
            // if (goods.editPackaging.length > 10) {
            //     goods.editPackagingInvalid = true;
            //     toaster.pop('warning', '提示', '包装方式不能超过10个字符');
            //     return result;
            // }
            if (!goods.editProduceDate) {
                goods.editProduceDateInvalid = true;
                toaster.pop('warning', '提示', '请填写生产日期');
                return result;
            }
            if (goods.editProduceDate.length > 12) {
                goods.editProduceDateInvalid = true;
                toaster.pop('warning', '提示', '生产日期不能超过12个字符');
                return result;
            }
            if (!goods.editReserve) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                return result;
            }
            if (isNaN(goods.editReserve)) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                return result;
            }
            if (goods.editReserve < $scope.minReserve) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                return result;
            }
            if (goods.editReserve > $scope.maxReserve) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '库存须填写小于10亿的正整数');
                return result;
            }
            if (typeof goods.editMinBuyQty == 'undefined') {
                goods.editMinBuyQtyInValid  = true;
                toaster.pop('warning', '提示', '起订量不能为空');
                return result;
            }
            // if(!goods.editMinBuyQty) {
            //     goods.editMinBuyQtyInValid  = true;
            //     toaster.pop('warning', '提示', '起订量必须填写');
            //     return result;
            // }
            if (!$scope.isInt.test(goods.editMinBuyQty)) {
                goods.editMinBuyQtyInValid  = true;
                toaster.pop('warning', '提示', '起订量必须是大于0的整数');
                return result;
            }
            // if(goods.editReserve < goods.editMinBuyQty) {
            //     goods.editReserveInvalid  = true;
            //     goods.editMinBuyQtyInValid = true;
            //     toaster.pop('warning', '提示', '库存必须是大于等于起订量的整数');
            //     return result;
            // }
            if (!goods.editMinPackQty) {
                goods.editMinPackQtyInValid = true;
                toaster.pop('warning', '提示', '包装数量必须填写');
                return result;
            }
            if (!$scope.isInt.test(goods.editMinPackQty)) {
                goods.editMinPackQtyInValid  = true;
                toaster.pop('warning', '提示', '包装数必须是正整数');
                return result;
            }
            if (Number(goods.editMinPackQty) > $scope.maxPackQty) {
                goods.editMinPackQtyInValid = true;
                toaster.pop('warning', '提示', '包装量数量必须小于' + $scope.maxPackQty);
                return result;
            }
            if (!goods.editBreakUp) {
                $scope.isNotBreakUp(goods);
            }
            var lastEnd = -1;
            for (var i = 0; i < goods.editPrices.length; i++) {
                if (isNaN(goods.editPrices[i].start)) {
                    goods.editPrices[i].startInValid = true;
                    toaster.pop('warning', '提示', '分段数量必须是数字');
                    return result;
                }
                if (goods.editPrices[i].start <= lastEnd) {
                    goods.editPrices[i].startInValid = true;
                    toaster.pop('warning', '提示', "存在分段的起始值小于等于上一个分段的结束值");
                    return result;
                }
                if (!goods.editPrices[i].end) {
                    goods.editPrices[i].endInValid = true;
                    toaster.pop('warning', '提示', '分段数量必须填写');
                    return result;
                }
                if (isNaN(goods.editPrices[i].end)) {
                    goods.editPrices[i].endInValid = true;
                    toaster.pop('warning', '提示', '分段数量必须是数字');
                    return result;
                }
                if (goods.editPrices[i].start > goods.editPrices[i].end) {
                    goods.editPrices[i].startInValid = true;
                    goods.editPrices[i].endInValid = true;
                    toaster.pop('warning', '提示', "存在分段的起始值大于分段的结束值");
                    return result;
                }
                if (goods.currencyName.indexOf('USD') > -1) {
                    if (!goods.editPrices[i].uSDPrice) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (isNaN(goods.editPrices[i].uSDPrice)) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (Number(goods.editPrices[i].uSDPrice) <= 0) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    }
                }
                if (goods.currencyName.indexOf('RMB') > -1) {
                    if (!goods.editPrices[i].rMBPrice) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (isNaN(goods.editPrices[i].rMBPrice)) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (Number(goods.editPrices[i].rMBPrice) <= 0) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    }
                }
            }
            if (goods.currencyName.indexOf('USD') > -1 && !$scope.compareNum(goods.editMinDelivery, goods.editMaxDelivery, 2, goods)) {
                return result;
            }

            if (goods.currencyName.indexOf('RMB') > -1 && !$scope.compareNum(goods.editMinDelivery, goods.editMaxDelivery, 1, goods)) {
                return result;
            }

            result = true;
            return result;
        }

        /**
         * 更新库存的信息
         * @param commodity
         */
        $scope.updateGoods = function(commodity, index){
            //验证库存信息
            if(!$scope.checkGoodsInfo(commodity)) {
                return ;
            }
            //更新分段信息
            if(!changeQtyPrice(commodity)) {
                return ;
            };



            //将修改的信息映射到对应的字段
            inserseCommodity(commodity);
            Goods.updateGoods(null, commodity, function(data){
                if(data.code == 1) {
                    toaster.pop('success', '修改成功');
                    $scope.currenctGoods.splice(index, 1, data.data);
                }else {
                    toaster.pop('error', '失败', data.message);
                }
            }, function(response){
                toaster.pop('error', '失败', response.data);
            });
        };

        var inserseCommodity = function (commodity) {
            commodity.packaging = commodity.editPackaging;
            commodity.produceDate = commodity.editProduceDate;
            commodity.oldReserve =  commodity.reserve;
            commodity.reserve =  commodity.editReserve;
            commodity.minBuyQty = commodity.editMinBuyQty;
            commodity.prices = commodity.editPrices;
            commodity.selfDeliveryHKMinTime = commodity.editSelfDeliveryHKMinTime;
            commodity.selfDeliveryHKMaxTime = commodity.editSelfDeliveryHKMaxTime;
            commodity.selfDeliveryDemMinTime = commodity.editSelfDeliveryDemMinTime;
            commodity.selfDeliveryDemMaxTime = commodity.editSelfDeliveryDemMaxTime;
            commodity.minDelivery = commodity.editMinDelivery;
            commodity.maxDelivery = commodity.editMaxDelivery;
            commodity.selfSale = commodity.editSelfSale;
            commodity.minPackQty = commodity.editMinPackQty;
            commodity.img = commodity.editPic;
            commodity.breakUp = typeof commodity.editBreakUp == 'undefined' ? false : commodity.editBreakUp;
            commodity.tag = commodity.editTag;
        };

        /**
         * 修改批次信息的图片
         */
        $scope.editGoodsPicture = function(pic, commodity) {
            var modalInstance = $modal.open({
                templateUrl : 'static/view/vendor/modal/edit_goods_modal.html',
                size : 'md',
                controller : 'editPictureCtrl',
                resolve : {
                    pic : function() {
                        return pic;
                    }
                }
            });
            modalInstance.result.then(function (editPic) {
                if(editPic) {
                    commodity.editPic = editPic;
                }
            }, function() {

            });
        }

        /**
         * 切换销售模式
         */
        $scope.changeSaleMode = function (commodity) {
            StoreCms.validCommdityisAdvantageCommodity({batchcode : commodity.batchCode}, function (data) {
                if(data.code != 1) {
                    toaster.pop('warning', '提示', data.message);
                }
            }, function (response) {
            });

        };

        /*******************************编辑库存信息 end****************************************/

        /**
         * 获取当前需要下载的在售产品信息的ID
         */
        var getDownLoadGoodsId = function() {
            var goodsID = [];
            angular.forEach($scope.currenctGoods, function (good) {
                goodsID.push(good.id);
            });
            return goodsID;
        };

        function downloadByJs(url, keyword, type) {
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'get');
            form.attr('action', url);

            var input1 = $('<input>');
            input1.attr('type', 'hidden');
            input1.attr('name', 'keyword');
            input1.attr('value', keyword);

            var input2 = $('<input>');
            input1.attr('type', 'hidden');
            input1.attr('name', 'isSelfSupport');
            input1.attr('value', type);

            $('body').append(form);  //将表单放置在web中
            form.append(input1);   //将查询参数控件提交到表单上
            form.append(input2);
            form.submit();
        }

        function downloadSelectedByJs(url, idList) {
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'get');
            form.attr('action', url);

            var input1 = $('<input>');
            input1.attr('type', 'hidden');
            input1.attr('name', 'ids');
            input1.attr('value', idList);

            $('body').append(form);  //将表单放置在web中
            form.append(input1);   //将查询参数控件提交到表单上
            form.submit();
        }

        // 下载模板
        $scope.download = function() {
            if ($scope.currenctGoods && $scope.currenctGoods.length == 0) {
                toaster.pop('info', '当前产品列表为空，无法下载');
                return;
            }
            if ($scope.chooseAllPage) {
                if ($scope.selfSupport === $scope.selfSupportType.SELF_SUPPORT) {
                    $scope.param.isSelfSupport = true;
                } else if ($scope.selfSupport === $scope.selfSupportType.CONSIGNMENT) {
                    $scope.param.isSelfSupport = false;
                } else {
                    $scope.param.isSelfSupport = null;
                }
                downloadByJs('trade/goods/down/goods', $scope.param.keyword, $scope.param.isSelfSupport);
            } else {
                getChooseInfo();
                if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
                    toaster.pop("info", "您尚未选中任何产品");
                    return ;
                }
                var idStr = $scope.choosedIds.join('-');
                downloadSelectedByJs('trade/goods/down/ids', idStr);
            }
        };

        /**
         * 下载当前页的订单信息
         */
        $scope.localInfo = {};
        $scope.downGoods = function () {
            var listId = getDownLoadGoodsId();
            if(listId.length < 1) {
                toaster.pop('warning', '提示', '当前需要下载的订单条数为0');
                return ;
            }
            Loading.show();
            $scope.localInfo.ids = listId.join("-");
            $scope.$apply();
            var form = document.getElementById('down-load-goods');
            form.action = 'trade/goods/down/ids';
            form.submit();
            var clockID = null;
            var getDownLoadStatus = function () {
                $.ajax({
                    url : 'trade/goods/down/ids',
                    data : {isAjax : true, ids : $scope.localInfo.ids},
                    method : 'GET',
                    dataType : 'json',
                    success : function (data) {
                        if(data.loading) {
                            clockID = setInterval(function() {
                                getDownLoadStatus()
                            }, 500);
                        }else {
                            $scope.$apply(function () {
                                toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                                Loading.hide();
                            });
                            if(!clockID) {
                                clearInterval(clockID);
                            }
                        }
                    },
                    error : function () {
                        Loading.hide();
                        if(!clockID) {
                            clearInterval(clockID);
                        }
                    }
                });
            };
            getDownLoadStatus();
        };

        // 点击下架操作
        $scope.soldOut = function (commodity) {
            $scope.isSoldOut = true;
            $scope.soldOutCommodity = commodity;
        };

        // 取消删除的操作
        $scope.cancleSoldOut = function (event) {
            if (event) {
                event.stopPropagation();
            }
            $scope.isSoldOut = false;
            $scope.soldOutCommodity = null;
        };

        // 点击下架操作
        $scope.soldOut = function (event, commodity) {
            if (event) {
                event.stopPropagation();
            }
            $scope.isSoldOut = true;
            $scope.soldOutCommodity = commodity;
        };

        var loadDataReload = function () {
            $scope.param = {
                page : 1,
                count : 10,
                sorting : {
                    createdDate: 'DESC'
                },
                status : "601-602"
            };
            loadData();
        };

        loadData();

        /**
         * 筛选商品类型
         *
         * @param type		商品上架类型
         */
        $scope.selfSupport = '销售方式';
        $scope.changeSupportType = function (type) {
            if (!type) return ;
            $scope.selfSupport = type;
            loadDataReload();
        };

        /**
         * 如果不拆分需要重新计算最小起订量的信息
         * @param goods
         */
        $scope.isNotBreakUp = function (commodity) {
            if (commodity.editMinPackQty&&commodity.editMinBuyQty) {
                var remainder = commodity.editMinBuyQty % commodity.editMinPackQty;
                if (remainder != 0) {
                    toaster.pop('warning', '提示', '不可拆卖时，起订量必须是包装数量的倍数');
                    if (parseInt(commodity.editMinBuyQty) > parseInt(commodity.editMinPackQty)) {
                        commodity.editMinBuyQty = Number(NumberService.sub(commodity.editMinBuyQty, remainder));
                    } else {
                        commodity.editMinBuyQty = commodity.editMinPackQty;
                    }
                    commodity.editPrices[0].start = commodity.editMinBuyQty;
                }
            }
        }
    }]);

    app.register.controller('editPictureCtrl', ['$scope', 'pic', '$modalInstance', function ($scope, pic, $modalInstance) {
        $scope.pic = pic;
        $scope.cancel = function () {
            $modalInstance.close();
        };

        // 图片上传成功之后
        $scope.onUploadSuccess = function(data){
            $scope.pic = data.path;
        };

        $scope.confirm = function() {
            $modalInstance.close($scope.pic);
        }
    }]);
});
