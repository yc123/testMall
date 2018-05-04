/**
 * Created by yujia on 2017/3/25.
 *  卖家发货的控制器
 */
define(['app/app'], function(app) {
    "use strict";
    app.register.controller('vendorDeliveryCtrl', ['$scope', '$rootScope', 'InvoiceFPurchase', 'ChineseToPinYin', 'Order' , 'Purchase', '$modal', '$stateParams', 'ComponentActive','$window','$state', 'BaseService', 'ShippingAddress', 'Logistics', '$filter', 'toaster', 'KdnLogistics', '$q', '$timeout','Distributor', 'SessionService', function($scope, $rootScope, InvoiceFPurchase, ChineseToPinYin, Order , Purchase, $modal, $stateParams, ComponentActive, $window, $state, BaseService, ShippingAddress, Logistics, $filter, toaster, KdnLogistics, $q, $timeout, Distributor, SessionService) {
        document.title = '点击发货-优软商城';
        $scope.logistics = {};
        $scope.jsonSdAddress = {};
        $scope.selfDeliveryPerson = {};
		// 获取快递鸟快递公司列表
        $scope.selectedName = ""; // 选中的物流公司名称
        var getKdnLogistics = function () {
            return KdnLogistics.getKdnAndSeller({}, function (response) {
                //分别获取快递鸟和卖家输入的快递名称
                $scope.sellerList = response.seller;
                $scope.kdnList = response.kdn;
                $scope.companyNameList = $scope.sellerList.concat($scope.kdnList);
            }, function () {
                toaster.pop("error", "错误", "获取快递公司列表失败");
            });
        };

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

        $scope.showText = function (data) {
            $scope.logistics.companyName = data.companyName;
            $scope.companyObject = data;
            $scope.showCompanyName = false;
        };

        //显示默认的选项
        $scope.showDefaultText = function () {
            $scope.logistics.companyName = '请选择物流公司';
            $scope.companyObject = {};
        };

        // $scope.showCompanyName = false;

        $scope.changeShowLogistics = function () {
            // matchArray();
            // $scope.matchData = true;
            // $scope.resultList = $scope.companyNameList;
            $scope.showCompanyName = !$scope.showCompanyName;
        };

        /**
         * 根据输入内容获取匹配数据的长度
         */
        var matchArray = function () {
            var dom = document.getElementById("addr");
            var content = dom.value ? dom.value : "";
            $scope.resultList = $scope.companyNameList.filter(function (data) {
                if (data.indexOf(content) >= 0){
                    return data;
                }
            });
            if ($scope.resultList.length > 0){
                $scope.matchData = true;
            }else{
                $scope.matchData = false;
            }
        };

        // $scope.textChange = function () {
        //     // console.log( $scope.logistics.companyName);
        //     initIndex();
        //     var dom = document.getElementById("addr");
        //     matchArray();
        //     if (dom.value) {
        //         var content = dom.value;
        //         $scope.containsAttr(content);
        //     }
        //     $scope.showCompanyName = true;
        // };

        /**
         * 判断快递鸟是否包含输入的快递
         * @param value
         */
        $scope.containsAttr = function (value) {
            var key = 1;
            if (value){
                angular.forEach($scope.kdnList, function (data) {
                    if (data == value){
                        key = 0;
                        return;
                    }
                });
                if (key == 1){
                    $scope.showTip = true;
                }else {
                    $scope.showTip = false;
                }
            }
        };

        $scope.backToDelivery = function () {
            SessionService.setCookie('status', 'comfirmed');
            $state.go('vendor_order');
        };

        var getInvoiceFPurchase = function () {
            return InvoiceFPurchase.tobeshippedByInvoiceid({ids: $stateParams.ids}, function(data) {
                $scope.checkinvoice = data[0];
                // Purchase.getOrderIdByPurchaseId({purchaseId:$scope.checkinvoice.sourceid},function(result) {
                //     $scope.checkinvoice.orderId = result.data;
                // });
                $scope.checkinvoice.jsonSpAddress = angular.fromJson($scope.checkinvoice.jsonSpAddress);
                $scope.checkinvoice.jsonSpAddress.area = $scope.checkinvoice.jsonSpAddress.area.replace(/,/g,' ');
                $scope.checkinvoice.show = false;
                if ($scope.checkinvoice.jsonRule){
                    $scope.rule = angular.fromJson($scope.checkinvoice.jsonRule);
                }
                if ($scope.checkinvoice.jsonTakeSelf){
                    $scope.takeSelf = angular.fromJson($scope.checkinvoice.jsonTakeSelf);
                    $scope.takeSelf.area = $scope.takeSelf.area.replace(/,/g,' ');
                }
                //现在默认物公司
                $scope.checkinvoice.deliveryType = 'logistics';
            }, function (response) {
                toaster.pop("error", "错误", "加载出货信息失败");
            });
        };

        $q.all([getInvoiceFPurchase().$promise, getKdnLogistics().$promise]).then(function() {
            if($scope.checkinvoice.logistics) {
                $scope.logistics.companyName = {};
                $scope.logistics.companyName = $scope.checkinvoice.logistics.companyName;
                $scope.logistics.number = $scope.checkinvoice.logistics.number;
            }
            console.log($scope.logistics.companyName);
            if ($scope.logistics.companyName){
                $scope.containsAttr($scope.logistics.companyName);
            }
        }, function () {
        });

        $scope.getSimilarLogist = function(name) {
            if (name) {
                return $scope.logistics.companyName.$promise.then(function(data) {
                    return data.map(function(item) {
                        return item;
                    })
                })
            }
        };

        $scope.setShow = function(invoice) {
            invoice.addrShow = false;
            invoice.show = !invoice.show;
            if(!invoice.show) {
                invoice.deliveryShow = "hide";
            }
        };

        //配送方式类型
        $scope.deliveryMethod = {
            1301: '第三方配送',
            1302: '卖家配送',
            1303: '上门自提'
        };

        $scope.setAddrShow = function(invoice) {
            invoice.deliveryShow = "hide";
            invoice.show = false;
            invoice.addrShow = !invoice.addrShow;
        };

        //选择地址
        $scope.chooseAdd = function(invoice, add) {
            $scope.jsonSdAddress = add;
            invoice.addrShow = false;
        };

        //删除收货地址
        $scope.deleteAddr = function(addr){
            if(!addr || angular.equals({}, addr)) {
                toaster.pop('info', '请选择要删除的信息');
                return;
            }
            $scope.isnotCheck = true;
            var isSure = confirm('确认删除？删除后不可恢复，请谨慎操作！');
            if(isSure) {
                var id = addr.id;
                ShippingAddress.del({addid: id}, {}, function(data){
                    //重新加载购物数据
                    loadAddrs();
                }, function (res) {
                    toaster.pop('error', '系统错误', '删除收货地址失败 ' + res);
                });
            }
        };

        /**
         * 新增或修改发货地址
         *
         * @param isSetTop		是否新增发货地址
         * @param addr			待修改的地址信息
         */
        $scope.editAddr = function(addr) {
            $scope.isnotCheck = true;
            $modal.open({
                templateUrl : 'static/view/common/modal/edit_address_modal.html',
                controller : 'editAddrDeCtrl',
                size : 'lg',
                resolve : {
                    addr : function(){
                        return angular.copy(addr);
                    }
                }
            }).result.then(function(address){
                if(address.isSetTop) {//置顶了地址信息，所以需要重新加载数据
                    loadAddrs();
                }else if(!addr){//新增地址
                    $scope.addresss.push(address);
                    $scope.jsonSdAddress = address;
                    $scope.jsonSdAddress.area = $scope.jsonSdAddress.area.replace(/,/g,' ');
                }else {//只是修改了地址的信息，则做替换的动作就可以了
                    $scope.addresss[address.num-1] = address;
                    $scope.jsonSdAddress = address;
                    $scope.jsonSdAddress.area = $scope.jsonSdAddress.area.replace(/,/g,' ');
                }
            }, function(){
                toaster.pop('info', '提示 ' + '您已取消发货地址的编辑');
            });
        };

        //加载发货地址
        var loadAddrs = function() {
            ShippingAddress.getListEnterprise({ship : false}, function(data) {
                $scope.addresss = data;
                $scope.total = $scope.addresss.length;
                $scope.jsonSdAddress = {};
                if($scope.addresss.length > 0) {
                    $scope.jsonSdAddress = $scope.addresss[0];
                    $scope.jsonSdAddress.area = $scope.jsonSdAddress.area.replace(/,/g,' ');
                }
            }, function(res) {
                toaster.pop('error', '错误', res.data);
            });
        };

        loadAddrs();

        $scope.taggleAddress = function() {
            $modal.open({
                templateUrl : 'static/view/vendor/modal/choose_address_modal.html',
                controller : 'chooseAddrCtrl',
                size : 'md',
                resolve : {
                    selectedAddr : function(){
                        return angular.copy($scope.jsonSdAddress);
                    },
                    address: function() {
                        return angular.copy($scope.addresss);
                    }
                }
            }).result.then(function(address){
                $scope.jsonSdAddress = address;
                toaster.pop('info', '提示' + '您修改了发货地址');
            }, function(){
                toaster.pop('info', '提示' + '您已取消地址选择');
            });
        };

        // $scope.$$downObject = {};
        var initIndex = function () {
            $scope.selectIndex = -1;
            $scope.downIndex = 0;
        };

        // 搜索框获得焦点，显示联想框
        $scope.getItemFocus = function() {
            $scope.showCompanyName = true;
            initIndex();
        };

        $scope.onItemBlur = function () {
            if ($scope.time){
                clearTimeout($scope.time);
            }
            $scope.time = setTimeout(function () {
                $scope.$apply(function () {
                    $scope.showCompanyName = false;
                });
            }, 200);
        };

        //$scope.downNumber = 0;
        $scope.onKeyup = function () {
            var dom = document.getElementById("ulContent");
            // console.log(dom.scrollTop);
            if ($scope.showCompanyName){
                if(event.keyCode == 40) { //监听到按下键
                    $scope.selectIndex ++;
                    if ($scope.downIndex == 5){
                        dom.scrollTop += 23;
                    }
                    if ($scope.downIndex <= 4){
                        $scope.downIndex++;
                    }
                    if($scope.selectIndex >= $scope.data_list.length){
                        $scope.selectIndex = 0;
                        dom.scrollTop = 0;
                        $scope.downIndex = 1;
                    }
                    $scope.logistics.companyName = $scope.data_list[$scope.selectIndex].companyName;
                    // $scope.containsAttr($scope.logistics.companyName);
                } else if(event.keyCode == 38) { //监听到按上键
                    $scope.selectIndex --;
                    if ($scope.downIndex == 1){
                        dom.scrollTop -= 22.67;
                    }
                    if ($scope.downIndex >= 2){
                        $scope.downIndex--;
                    }
                    if($scope.selectIndex < 0){
                        $scope.selectIndex = $scope.data_list.length - 1;
                        dom.scrollTop = 2400;
                        $scope.downIndex = 5;
                    }
                    $scope.logistics.companyName = $scope.data_list[$scope.selectIndex].companyName;
                    // $scope.containsAttr($scope.logistics.companyName);
                } else if(event.keyCode == 13) { //确定键
                    $scope.showCompanyName = false;
                }
            }
        };

        $scope.saveCheck = function() {
            if(!$scope.checkinvoice || angular.equals(angular.toJson($scope.checkinvoice), "{}")) {
                toaster.pop("info", "提示", "出货单信息为空，不能保存，请返回出货单管理界面");
                return ;
            }

            if(!$scope.jsonSdAddress || angular.equals({}, $scope.jsonSdAddress)) {
                toaster.pop("info", "提示", "发货地址不能为空,请返回出货单管理界面");
                return ;
            }

            // 调用快递鸟预约取件接口
            // var params = {};
            // params.orderid = $scope.checkinvoice.invoiceid;
            // params.companyName = $scope.logistics.companyName;
            // params.receiverJson = $scope.checkinvoice.jsonSpAddress;
            // params.senderJson =	 $scope.jsonSdAddress;
            // KdnLogistics.kdnBooking(params, {}, function(response){
            // 	var result = response;
            // 	if("fail" == result){
            // 		toaster.pop("info", "提示", "调用快递鸟预约取件失败")
            // 	}
            // }, function(){
            // 	/*toaster.pop("error", "错误", "快递鸟预约取件接口后台出现错误");*/
            // });
              
            //现在商城没有发货地址。
            // var toSendInvoice = angular.copy($scope.checkinvoice);
            // angular.forEach(toSendInvoice, function(invoice) {
            //     invoice.jsonSdAddress = angular.toJson($scope.jsonSdAddress);
            //     invoice.jsonSpAddress = angular.toJson(invoice.jsonSpAddress);
            //     delete invoice.show;
            //     delete $stateParams.ids;
            // });

            // var isValid = validDeliveryInfo($scope.checkinvoice.deliveryType);
            var isValid = validLogisticsInfo($scope.checkinvoice.sendType);
            if(!isValid) {
                return ;
            }
            // if ($scope.showTip){
            //     //验证通过后保存卖家输入额外的快递公司名称
            //     KdnLogistics.saveSellerLogistics({companyName :$scope.logistics.companyName}, {}, function (data) {
            //         console.log(data);
            //     });
            // }
            var sendInfo = {};
            sendInfo.sendType = $scope.checkinvoice.sendType;
            if ($scope.logistics.companyName && $scope.logistics.number){
                sendInfo.logisticsInfo = {};
                sendInfo.logisticsInfo.companyName = $scope.logistics.companyName;
                sendInfo.logisticsInfo.number = $scope.logistics.number;
            }
            // if($scope.checkinvoice.deliveryType == 'logistics') {
            //     sendInfo.deliveryType = 'logistics';
            //     sendInfo.logisticsInfo = {};
            //     sendInfo.logisticsInfo.companyName = $scope.logistics.companyName;
            //     sendInfo.logisticsInfo.number = $scope.logistics.number;
            // }else if($scope.checkinvoice.deliveryType == 'selfDelivery'){
            //     sendInfo.deliveryType = 'selfDelivery';
            //     sendInfo.selfDeliveryPerson = $scope.selfDeliveryPerson;
            // }else {
            //     toaster.pop('info', '提示', '配送方式有误');
            //     return ;
            // }
            sendInfo.jsonSdAddress = angular.toJson($scope.jsonSdAddress);
            InvoiceFPurchase.saveInvoiceFPurchase({id : $scope.checkinvoice.id}, sendInfo, function(data) {
                toaster.pop("success", "信息", "发货成功");
                // TODO 这边要停5秒钟之后，在跳转到出货单管理界面
                /*var fromPage = window.sessionStorage.getItem("orderAdmin");
                 if(fromPage == "invoiceProofing") {
                 $state.go('invoiceProofing');
                 }else {
                 $state.go('invoice');
                 }*/
                // TODO huxz 跳转到订单管理页面
                $state.go('vendor_order');
            }, function(response) {
                toaster.pop('error', '错误', response.data);
            });
        };

        /**
         * 更新invocie的物流信息
         * @param invoice
         */
        $scope.upateLogistic = function (invoice) {
            if(validDeliveryInfo('logistics')){
                var oldLogistics = angular.fromJson(invoice.logistics);
                var logistics = {};
                logistics.companyName = $scope.logistics.companyName;
                // console.log(logistics.companyName);
                logistics.number = $scope.logistics.number;
                Logistics.updateLogistics({id : oldLogistics.id, invoiceFuid : invoice.invoiceid}, logistics, function (data) {
                    if(data.code != 1) {
                        toaster.pop('info', '更新物流信息失败:' + data.message);
                    }else {
                        if ($scope.showTip){
                            //验证通过后保存卖家输入额外的快递公司名称
                            KdnLogistics.saveSellerLogistics({companyName :$scope.logistics.companyName}, {}, function (data) {
                                console.log(data);
                            });
                        }
                        toaster.pop('success', '更新物流信息成功');
                        $state.go('vendor_order');
                    }
                }, function () {
                    toaster.pop('error', '更新物流信息失败');
                })
            }
        }

        $scope.selectDelivery = function(invoice, result) {
            invoice.deliveryShow = result;
        };

        $scope.deliveryComfirm = function(invoice, inputType) {
            var isValid = validDeliveryInfo(inputType);
            if(!isValid) {
                return ;
            }
            invoice.deliveryShow = 'hide';
            invoice.show = false;
            invoice.deliveryType = inputType;
        };
        
        var validLogisticsInfo = function (sendType) {
            if (sendType == 1301){
                if (!$scope.logistics.companyName){
                    toaster.pop('error', '注意', '请选择物流公司');
                    return false;
                }
                if ($scope.logistics.companyName == '请选择物流公司'){
                    toaster.pop('error', '注意', '请选择物流公司');
                    return false;
                }
                if (!$scope.logistics.number){
                    toaster.pop('error', '注意', '请填写物流单号');
                    return false;
                }
                var patt = new RegExp("^[A-Za-z0-9]+$");
                if (!patt.test($scope.logistics.number)){
                    toaster.pop("error", "注意", '请输入正确的物流单号');
                    return false;
                }
            }else {
                if ($scope.logistics.companyName && $scope.logistics.companyName != '请选择物流公司'){
                    if (!$scope.logistics.number){
                        toaster.pop("error", "注意", '请完善快递信息');
                        return false;
                    }
                }
                if ($scope.logistics.number){
                    var patt = new RegExp("^[A-Za-z0-9]+$");
                    if (!patt.test($scope.logistics.number)){
                        toaster.pop("error", "注意", '请输入正确的物流单号');
                        return false;
                    }
                    if (!$scope.logistics.companyName || $scope.logistics.companyName == '请选择物流公司'){
                        toaster.pop("error", "注意", '请完善快递信息');
                        return false;
                    }
                }
            }
            return true;
        };

        var validDeliveryInfo = function(inputType) {
            if(angular.equals(inputType, 'logistics')) {
                if(!$scope.logistics.companyName) {
                    toaster.pop('info', '注意', '物流公司名称为空');
                    return false;
                }
                // var addrPatt = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
                // if (!addrPatt.test($scope.logistics.companyName)){
                //     toaster.pop("error", "注意", '请输入正确的物流公司名称');
                //     return false;
                // }
                var patt = new RegExp("^[A-Za-z0-9]+$");
                if (!patt.test($scope.logistics.number)){
                    toaster.pop("info", "注意", '请输入正确的物流单号');
                    return false;
                }
                if(!$scope.logistics.number || angular.equals($scope.logistics.number.trim(), '')) {
                    toaster.pop('info', '注意', '请输入正确的物流单号');
                    return false;
                }


            }else if(angular.equals(inputType, 'selfDelivery')){
                if(!$scope.selfDeliveryPerson.name || angular.equals($scope.selfDeliveryPerson.name.trim(), '')) {
                    toaster.pop('info', '注意', '送货人名称为空');
                    return false;
                }
                if(!$scope.selfDeliveryPerson.phone || angular.equals($scope.selfDeliveryPerson.phone.trim(), '')) {
                    toaster.pop('info', '注意', '送货人电话为空');
                    return false;
                }
            }

            return true;
        };


        // document.onclick = function (event) {
        //     var element = event.srcElement;
        //     var elementName =  element.getAttribute("name");
        //     $scope.$apply(function () {
        //             var isThisTag = false;
        //             if(elementName && "companyName" == elementName) {
        //                 isThisTag = true;
        //             }
        //             if(!isThisTag) {
        //                 var parentElement = element.parentElement;
        //                 while (parentElement && parentElement.tagName && parentElement.tagName != 'BODY') {
        //                     var parentElementName =  parentElement.getAttribute("name");
        //                     if(parentElementName && "companyName" == parentElementName) {
        //                         isThisTag = true;
        //                     }
        //                     parentElement = parentElement.parentElement;
        //                 }
        //             }
        //             if(!isThisTag) {
        //                 $scope.showCompanyName = false;
        //             }
        //     });
        // };

        $scope.cancle = function(invoice) {
            invoice.deliveryShow = 'hide';
        };

        $scope.goBack = function() {
            $state.go("cusPurchase");
        };

        // 获取全部快递公司信息
        $scope.isCompany = false;
        var getLogisticsCompany = function() {
            $scope.companies = [];
            Logistics.findCompany({}, {}, function(data) {
                $scope.companies = data;
            }, function() {

            });
        };

        getLogisticsCompany();

        //申请一个数组存放筛选之后的物流公司名称
        $scope.filterCom = [];

        // 若输入框为空不显示提示框
        $scope.inputCompany = function() {
            $scope.isCompany = true;
            if($scope.logistics.companyName.length > 0) {
                $scope.filterCom = $filter('filter')($scope.companies, {name :$scope.logistics.companyName});
                if($scope.filterCom == null || $scope.filterCom.length == 0){
                    $scope.isCompany = false;
                }
            } else {
                $scope.filterCom = $scope.companies;
            }
        };

        $scope.clearSelect = function() {
            $scope.selectIndex = 0;
        };

        // 搜索框获得焦点，显示联想框
        $scope.onFocus = function() {
            $scope.isCompany = true;
            $scope.filterCom = $scope.companies;
            $scope.selectIndex = -1;
            if(!$scope.keyword) $scope.keyword = '';
        };

        // 点击下拉按钮打开联想词框显示联想框
        $scope.openSuggestion = function () {
            $scope.isCompany = !$scope.isCompany;
            if ($scope.isCompany) {
                $scope.filterCom = $scope.companies;
                $scope.selectIndex = -1;
                if(!$scope.keyword) $scope.keyword = '';
            }
        };

        // 鼠标进入联想词框，不能关闭联想词框
        $scope.onAssociateEnter = function() {
            $scope.associateEnter = true;
            $scope.isCompany = false;
        };

        // 隐藏提示框
        $scope.clearSuggestion = function() {
            $scope.isCompany = false;
        };

        // 搜索框通过按键选取想要的联想词
        $scope.onKeyDown = function(e) {
            if($scope.isCompany) {
                if(event.keyCode == 40) { //监听到按下键
                    $scope.selectIndex ++;
                    if($scope.selectIndex >= $scope.filterCom.length) $scope.selectIndex = 0;
                    $scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
                    $scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
                } else if(event.keyCode == 38) { //监听到按上键
                    $scope.selectIndex --;
                    if($scope.selectIndex < 0) $scope.selectIndex = $scope.filterCom.length - 1;
                    $scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
                    $scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
                }else if(event.keyCode == 13) { //确定键
                    $scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
                    $scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
                    $scope.isCompany = false;
                }
            }
        };

        // 选择快递公司
        $scope.chooseCompany = function(company) {
            $scope.logistics.companyName = company.name;
            $scope.logistics.companyId = company.id;
            $scope.isCompany = false;
        };
        // 新增配送商
        $scope.addDistributor = function () {
            $modal.open({
                templateUrl : $rootScope.rootPath + '/static/view/vendor/modal/vendor_distributor_manage.html',
                controller : 'vendorDistributorModalCtrl',
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

    //地址编辑模态框
    app.register.controller('editAddrDeCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, addr, $modalInstance, toaster, $http, ShippingAddress){
        if (addr){
            $scope.isSetTop = addr.num == 1;
            $scope.isModify = true;
        }else {
            $scope.isSetTop = false;
            $scope.isModify = false;
        }

        $scope.isSendType = true;
        //验证数据
        $scope.checkeds = {};

        $http.get('static/js/prod/data/city.json').success(function(data) {
            $scope.division = data;
            if(addr){
                $scope.address = addr;
                //拼装下拉选择框
                var arr = addr.area.split(' ');
                addr.province = arr[0];
                addr.city = arr[1];
                addr.district = arr[2];
                $scope.address = addr;
                $scope.addr = true;
            }
        }).error(function() {
            toaster.pop('error', '系统错误 ' + '加载城市信息失败');
        });

        $scope.checkForm = function(num) {
            var size;
            if(num == 1) {
                if ($scope.address.name){
                    size = $scope.address.name.replace(/[^\x00-\xff]/g,'**').length;
                    if (size > 20) {
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
            ShippingAddress.save({isSetTop: $scope.isSetTop, send: true, isPersonal: false}, address, function(data){
                toaster.pop('success', '成功 ', '保存发货地址成功');
                data.isSetTop = $scope.isSetTop;
                $modalInstance.close(data);
            }, function (res) {
                toaster.pop('error', '保存发货地址失败 ', res.data);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);

    app.register.controller('vendorDistributorModalCtrl', ['$scope','$rootScope','$modal','toaster','KdnLogistics','Distributor','BaseService','ngTableParams','$modalInstance','$q','selectedList','allKdnList', function ($scope, $rootScope, $modal, toaster, KdnLogistics, Distributor, BaseService, ngTableParams, $modalInstance, $q, selectedList, allKdnList) {
        //获取快递鸟信息
        $scope.$$kdnData = {};
        $scope.selectedList = selectedList;
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
            return string.replace(/[^x00-xFF]/g,'**').length;
        };

        $scope.inputContent = function () {
            for (var i=0; i<$scope.keyword.length;i++){
                if (countLength($scope.keyword.substr(0, i)) >= 26){
                    $scope.keyword = $scope.keyword.substr(0, i);
                    break;
                }
            }
            var addrPatt = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
            if (!addrPatt.test($scope.keyword) && $scope.keyword.length > 0){
                $scope.companyError = true;
            }else {
                $scope.companyError = false;
            }
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
                toaster.pop('error', '成功', '保存配送商失败 '+ error);
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
    app.register.controller('chooseAddrCtrl', ['$scope', 'selectedAddr', 'address', '$modalInstance', function ($scope, selectedAddr, address, $modalInstance) {

        $scope.address = address;

        $scope.selectedAddr = selectedAddr;

        //选择地址
        $scope.chooseAddress = function (add) {
            $scope.selectedAddr = add;
        };

        //确定选择
        $scope.confirm = function () {
            $modalInstance.close($scope.selectedAddr);
        };

        //取消选择
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
});