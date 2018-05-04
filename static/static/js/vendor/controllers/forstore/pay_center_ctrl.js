/**
 *  结算中心控制器
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('payCenterCtrl', ['$scope', '$rootScope', 'bankInfoService', 'toaster', '$upload', 'bankTransferService', 'Purchase', '$filter', 'Loading', 'ngTableParams', 'BaseService', 'SessionService', '$stateParams', function($scope, $rootScope, bankInfoService, toaster, $upload, bankTransferService, Purchase, $filter, Loading, ngTableParams, BaseService, SessionService, $stateParams) {
        $rootScope.active = 'pay_center';

        document.title = '结算中心-优软商城';
        // 加密订单的ID过滤器
        var enIdFilter = $filter('EncryptionFilter');

        //历史记录的状态
        var hiStatus= SessionService.get('vendorCenter');

        $scope.$payCenter = {};
        $scope.param = {};

        $scope.tab = $stateParams.tab == 'accountTab' ? $stateParams.tab : hiStatus == null ? 'paymentRecord' : hiStatus;
        $scope.$$bankInfo = {};

        $scope.paytype = 'ALL';
        $scope.$$transfer = {};

        $scope.tradeRecordTableParams = new ngTableParams({
            page : 1,
            count : 30,
            sorting : {
                transferTime : 'DESC'
            }
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                if ($scope.keyword && $scope.keyword.length > 0){
                    param.keyword = $scope.keyword;
                }
                if ($scope.startDate){
                    param.fromDate = $scope.startDate.getTime();
                }
                if ($scope.endDate){
                    param.toDate = $scope.endDate.getTime();
                }
                bankTransferService.getVendorBankTransferByMall(param, function (page) {
                    if(page.code == 1) {
                        $scope.bankTransRecore = page.data.data.content;
                        if ($scope.bankTransRecore.length > 0){
                            $scope.currencySymbol = $scope.bankTransRecore[0].currencyName;
                        }
                        var pageObject = page.data.data;
                        $scope.totalPrice = page.data.total;
                        angular.forEach($scope.bankTransRecode, function (bankT) {
                            bankT.jsonReceive = angular.fromJson(bankT.jsonReceive);
                        });
                        $scope.totalPages = pageObject.totalPages;
                        $scope.param.currentPage = pageObject.number;
                        $scope.totalElements = pageObject.totalElements;

                        if(Number($scope.totalElements) > 0) {
                            $scope.$$transfer.start = Number(pageObject.size) * (Number(pageObject.number) - 1) + 1;
                        }else {
                            $scope.$$transfer.start = 0;
                        }
                        $scope.$$transfer.end = Number(pageObject.size) * (Number(pageObject.number) - 1) + Number(pageObject.numberOfElements);
                        //计算页数
                        $scope.acculatePages(pageObject.number, pageObject.totalPages);
                    }else {
                        toaster.pop('info', '获取信息失败:' + page.message);
                    }
                }, function (res) {
                    toaster.pop('error', '获取信息失败 ', res.data);
                });
            }
        });

        $scope.bankInfoTableParams = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                num : 'ASC'
            }
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                bankInfoService.getSaleEeterpriseBank(param, {}, function(page) {
                    $scope.accounts = page.content;

                    $scope.$$bankInfo.totalElements = page.totalElements;
                    if(Number(page.totalElements) > 0) {
                        $scope.$$bankInfo.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }else {
                        $scope.$$bankInfo.start = 0;
                    }
                    $scope.$$bankInfo.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);

                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                }, function(response) {
                    toaster.pop('error', '获取账户信息失败 ', response.data);
                });
            }
        });

        var loadAccountData = function() {
            $scope.bankInfoTableParams.page(1);
            $scope.bankInfoTableParams.reload();
        };

        var loadHistory = function () {
            $scope.tradeRecordTableParams.page(1);
            $scope.tradeRecordTableParams.reload();
        };

        var clearRecordParams = function () {
            $scope.keyword = null;
            $scope.startDate = null;
            $scope.endDate = null;
        };

        $scope.search = function () {
            if (!$scope.startDate && $scope.endDate){
                toaster.pop("info", "请输入起始日期");
                return ;
            }
            if ($scope.startDate && !$scope.endDate){
                toaster.pop("info", "请输入结束日期");
                return ;
            }
            loadHistory();
        };

        //获取数据的方法。
        var loadData = function() {
            switch ($scope.tab) {
                case 'paymentRecord' :
                    loadHistory();
                    break;
                case 'accountTab':
                    clearRecordParams();
                    // loadAccountData();
                    break;
            }
        };
        loadData();

        //切换tab方法
        $scope.setTab = function (tab) {
            if($scope.tab !== tab) {
                $scope.tab = tab;
                SessionService.set('vendorCenter', tab);
                loadData();
            }
        };

        $scope.condition = [];
        var start = {
            open : false
        };
        var end = {
            open : false
        };
        $scope.condition.push(start);
        $scope.condition.push(end);

        // 打开日期选择框
        $scope.openDatePicker = function($event, item, openParam, status) {
            // if (status != null) {
            //     if (status == 1) {
            //         if ($scope.startDate != null) {
            //             return;
            //         }
            //     }
            //     if (status == 2) {
            //         if ($scope.endDate != null) {
            //             return;
            //         }
            //     }
            // }
            $event.preventDefault();
            $event.stopPropagation();
            openParam == 0 ? $scope.condition[1].open = false : $scope.condition[0].open = false;
            item[openParam].open = !item[openParam].open;
        };

        $scope.onDateCondition = function (bool) {
            // var text = '';
            // var datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
            if (bool == 1){
                // text = document.getElementById("start").value;
                // if (text != '' && !datePattern.test(text)){
                //     // $scope.startDate = text;
                //     toaster.pop("info", "请输入正确开始时间格式");
                //     return;
                // }
                // if (text != '' && !validateDate(text)){
                //     // $scope.startDate = text;
                //     toaster.pop("info", "请输入正确开始时间格式");
                //     return;
                // }
                // if (!$scope.startDate && text != ''){
                //     $scope.startDate = convertTextToDate(text);
                // }
                if ($scope.startDate && !$scope.endDate){
                    var nowTime = new Date();
                    $scope.endDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
                }
                if ($scope.startDate && $scope.endDate){
                    if ($scope.startDate.getTime() > $scope.endDate.getTime()){
                        $scope.endDate = new Date($scope.startDate.getTime() + 86400000);
                    }
                }
            }else {
                // text = document.getElementById("end").value;
                // if (text != '' && !datePattern.test(text)){
                //     // $scope.endDate = text;
                //     toaster.pop("info", "请输入正确结束时间格式");
                //     return;
                // }
                // if (text != '' && !validateDate(text)){
                //     // $scope.endDate = text;
                //     toaster.pop("info", "请输入正确结束时间格式");
                //     return;
                // }
                // if (!$scope.endDate && text != ''){
                //     $scope.endDate = convertTextToDate(text);
                // }
                if ($scope.startDate && $scope.endDate){
                    if ($scope.startDate.getTime() > $scope.endDate.getTime()){
                        $scope.startDate = new Date($scope.endDate.getTime() - 86400000);
                    }
                }
            }
        };

        /**
         * 将文本转化为日期
         * @param value
         * @returns {Date}
         */
        var convertTextToDate = function (value) {
            var date = value;
            var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

            return new Date(result[1], result[3] - 1, result[4]);
        };

        /**
         * 验证日期格式是否正确
         * @param value
         * @returns {boolean}
         */
        var validateDate = function (value) {
            var date = value;
            var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

            if (result == null)
                return false;
            var d = new Date(result[1], result[3] - 1, result[4]);
            return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
        };

        // 文件上传成功之后
        $scope.uploadChange = function(){
            var fileName = $scope.account.files[0].name;
            if ($scope.account.attachUrl != fileName) {
                $scope.account.attachUrl = '';
            }
            var ext,idx;
            idx = fileName.lastIndexOf(".");
            if (idx != -1){
                ext = fileName.substr(idx+1).toUpperCase();
                ext = ext.toLowerCase( );
                if (ext != 'jpg' && ext != 'png' && ext != 'gif' && ext != 'pdf'){
                    $scope.fileError = true;
                }else {
                    $scope.fileError = false;
                }
            }
            var len = $scope.account.files[0].size;
            if (len > 3145728) {
                $scope.fileLegError = true;
            }else {
                $scope.fileLegError = false;
            }
            if($scope.fileError || $scope.fileLegError){
                $scope.account.attachUrl = '';
                $scope.account.files = null;
                return;
            }
            $scope.account.attachUrl = fileName;
            toaster.pop('success', '上传成功');
        };

        $scope.account = {};
        $scope.newAccount = function () {
            $scope.showAddFrame = true;
        };

        $scope.cancelAdd = function () {
            $scope.showAddFrame = false;
            $scope.account = {};
            $scope.account.files = null;
            $scope.showBankFrame = false;
        };

        /**
         * 验证账户格式
         * @param num
         */
        $scope.checkAccount = function (num) {
            var size;
            if (num == 1){
                //验证开户银行名称
                $scope.showBankFrame = true;
                matchArray();
            }else if(num == 2){
                //验证开户支行名称
                if($scope.account.branchname){
                    size = $scope.account.branchname.replace(/[^\x00-\xff]/g,'**').length;
                    if (size > 40){
                        $scope.branchError = true;
                    }else {
                        $scope.branchError = false;
                    }
                    var telPatt = new RegExp("^[\u2E80-\u9FFF]+$");
                    if (telPatt.test($scope.account.branchname)){
                        $scope.branchPattError = false;
                    }else {
                        $scope.branchPattError = true;
                    }
                }
            }else if(num == 3){
                //验证银行账号
                if ($scope.account.number){
                    size = $scope.account.number.replace(/[^\x00-\xff]/g,'**').length;
                    if (size > 30){
                        $scope.numberError = true;
                    }else {
                        $scope.numberError = false;
                    }
                    var numPatt = new RegExp("^[0-9]+$");
                    if (numPatt.test($scope.account.number)){
                        $scope.numberPattError = false;
                    }else {
                        $scope.numberPattError = true;
                    }
                    validateRepeat($scope.account.number);
                }
            }else if(num == 4){
                //验证开户名称
                if ($scope.account.accountname){
                    size = $scope.account.accountname.replace(/[^\x00-\xff]/g,'**').length;
                    if (size > 100){
                        $scope.nameError = true;
                    }else {
                        $scope.nameError = false;
                    }
                }
            }
        };

        var validateRepeat = function (number) {
            bankInfoService.getCountByNumber({type:1063,number:number}, {}, function (data) {
                if (data.success){
                    if (data.data != 0){
                        $scope.repeatError = true;
                    }else {
                        $scope.repeatError = false;
                    }
                }else {
                    toaster.pop("info", data.message);
                }
            });
        };

        $scope.reuseAccount = function (item) {
            $scope.showReuseFrame = true;
            $scope.reuseObject = item;
        };

        $scope.cancelReuse = function () {
            $scope.showReuseFrame = false;
        };

        $scope.ensureReuse = function () {
            if(!$scope.reuseObject){
                toaster.pop("info", "请选择重新使用的账户");
            }
            bankInfoService.setDefaultAccount({id:$scope.reuseObject.id},{},function (data) {
                toaster.pop("info", "重新使用成功");
                $scope.reuseObject = {};
                $scope.showReuseFrame = false;
                loadAccountData();
            },function () {
                toaster.pop("info", "重新使用失败");
            })
        };

        $scope.ensureAddAccount = function () {
            var account = $scope.account;

            if (!account){
                toaster.pop('error', '请按要求填写正确的信息');
                return ;
            }
            if (!account.bankname || !account.branchname || !account.number ||
                !account.accountname || !account.attachUrl){
                toaster.pop('error', '请按要求填写正确的信息');
                return ;
            }
            if (!$scope.matchData || $scope.branchError || $scope.branchPattError || $scope.numberError || $scope.numberPattError ||
                $scope.nameError || $scope.repeatError || $scope.fileError || $scope.fileLegError){
                toaster.pop('error', '请按要求填写正确的信息');
                return ;
            }

            var file = null;
            if($scope.account.files && $scope.account.files[0]) {
                file = $scope.account.files[0];
            }
            $upload.upload({
                url: 'trade/bankInfo/save/enterprise',
                file: file,
                method: 'POST',
                params : {type : 'sup'},
                data: {
                    bankInfo: $scope.account
                }
            }).success(function(data){
                if(data){
                    $scope.showAddFrame = false;
                    $scope.account = {};
                    $scope.account.files = null;
                    toaster.pop('success', '保存成功');
                    loadAccountData();
                }
            }).error(function(){
                toaster.pop('error', "保存账户信息失败");
            });
        };

        //删除账户
        $scope.deleteAccount = function(account) {
            if(account.id) {
                $scope.$payCenter.deleteDiv = true;
                $scope.$payCenter.deleteID = account.id;
            }else {
                toaster.pop('info', '请选择要删除的信息');
            }
        };

        $scope.cancelDelete = function () {
            $scope.$payCenter.deleteDiv = false;
            $scope.$payCenter.deleteID = null;
        };

        //确认删除账户信息
        $scope.confirmDelete = function () {
            if(!$scope.$payCenter.deleteID) {
                toaster.pop('info', '请选择要删除的信息');
                return ;
            }
            bankInfoService.deleteBank({id: $scope.$payCenter.deleteID}, function() {
                toaster.pop('success', '删除账户成功');
                $scope.$payCenter.deleteDiv = false;
                $scope.$payCenter.deleteID = null;
                loadAccountData();
            }, function() {
                toaster.pop('error', '删除失败');
            })
        };

        /**
         * 目前只支持的银行
         * @type {string[]}
         */
        $scope.bankList = [
            '中国银行','中国建设银行','中国工商银行','中国农业银行','交通银行','招商银行','中国民生银行',
            '兴业银行','中信银行','中国光大银行','广发银行','平安银行','中国邮政储蓄银行','华夏银行','浦发银行'
        ];

        var matchArray = function () {
            $scope.account.bankname = $scope.account.bankname ? $scope.account.bankname : '';
            $scope.resultList = $scope.bankList.filter(function (data) {
                if (data.indexOf($scope.account.bankname) >= 0){
                    return data;
                }
            });
            if ($scope.resultList.length > 0){
                $scope.matchData = true;
            }else{
                $scope.matchData = false;
            }
        };

        var initIndex = function () {
            $scope.selectIndex = -1;
            $scope.downIndex = 0;
        };

        $scope.getItemFocus = function() {
            $scope.showBankFrame = true;
            $scope.matchData = true;
            $scope.resultList = $scope.bankList;
            initIndex();
        };

        $scope.onItemBlur = function () {
            if ($scope.time){
                clearTimeout($scope.time);
            }
            $scope.time = setTimeout(function () {
                $scope.$apply(function () {
                    $scope.showBankFrame = false;
                });
            }, 200);
        };
        $scope.onKeyUp = function () {
            var dom = document.getElementById("ulContent");
            console.log(dom.scrollTop);
            if ($scope.showBankFrame){
                if(event.keyCode == 40) { //监听到按下键
                    $scope.selectIndex ++;
                    if ($scope.downIndex == 5){
                        dom.scrollTop += 44;
                    }
                    if ($scope.downIndex <= 4){
                        $scope.downIndex++;
                    }
                    if($scope.selectIndex >= $scope.resultList.length){
                        $scope.selectIndex = 0;
                        dom.scrollTop = 0;
                        $scope.downIndex = 1;
                    }
                    $scope.account.bankname = $scope.resultList[$scope.selectIndex];
                    // $scope.containsAttr($scope.logistics.companyName);
                } else if(event.keyCode == 38) { //监听到按上键
                    $scope.selectIndex --;
                    if ($scope.downIndex == 1){
                        dom.scrollTop -= 44;
                    }
                    if ($scope.downIndex >= 2){
                        $scope.downIndex--;
                    }
                    if($scope.selectIndex < 0){
                        $scope.selectIndex = $scope.resultList.length - 1;
                        dom.scrollTop = 2400;
                        $scope.downIndex = 5;
                    }
                    $scope.account.bankname = $scope.resultList[$scope.selectIndex];
                    // $scope.containsAttr($scope.logistics.companyName);
                } else if(event.keyCode == 13) { //确定键
                    $scope.showBankFrame = false;
                }
            }
        };

        $scope.fitBankToAccount = function (item) {
            $scope.account.bankname = item;
            $scope.showBankFrame = false;
        };

        $scope.showList = function () {
            $scope.showBankFrame = !$scope.showBankFrame;
            $scope.matchData = true;
            $scope.resultList = $scope.bankList;
        };

        $scope.exportToExcel = function () {
            if ($scope.totalElements == 0) {
                toaster.pop('info', '当前收款记录为空，无法导出');
                return ;
            }
            exportByAjax();
        };

        var exportByAjax = function () {
            var url = 'trade/transfer/export/bankTransfer';
            var strArray = [];
            if ($scope.keyword && $scope.keyword.length > 0){
                var wordStr = "keyword=" + $scope.keyword;
                strArray.push(wordStr);
            }
            if ($scope.startDate){
                var startStr = "fromDate=" + $scope.startDate.getTime();
                strArray.push(startStr);
            }
            if ($scope.endDate){
                var endStr = "toDate=" + $scope.endDate.getTime();
                strArray.push(endStr);
            }
            if (strArray.length != 0){
                var str = strArray.join("&");
                url = url + "?" + str;
            }
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'POST');
            form.attr('action', url);

            $('body').append(form);  //将表单放置在web中
            form.submit();

            $scope.$$transfer.clockID = setInterval(function() {
                getDownLoadStatus();
            }, 500);
        };

        var getDownLoadStatus = function () {
            Loading.show();
            $.ajax({
                url : 'trade/transfer/export/bankTransfer',
                data : {isAjax : true},
                method : 'POST',
                dataType : 'json',
                success : function (data) {
                    if(!data.loading){
                        $scope.$apply(function () {
                            toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                            Loading.hide();
                        });
                        if($scope.$$transfer.clockID) {
                            clearInterval($scope.$$transfer.clockID);
                        }
                    }
                },
                error : function () {
                    Loading.hide();
                    if($scope.$$transfer.clockID) {
                        clearInterval($scope.$$transfer.clockID);
                    }
                }
            });
        };

        //获取传入买家订单获取采购单的信息
        $scope.goToPurchaseDetail = function (orderNum) {
            if(!orderNum) {
               return ;
            }
            var tempwindow = window.open("vendor#/order/center");
            Purchase.getPurchaseByOrder({orderid : orderNum}, function (data) {
                tempwindow.location = "vendor#/purchase/detail/" + enIdFilter(data.purchaseid);
                // window.open("vendor#/purchase/detail/" + enIdFilter(data.purchaseid));
            }, function (response) {
            });
        }


        /******************根据页数设置翻页的信息********start**************************/

        //输入框监听Enter事件
        $scope.listenEnter = function () {
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
                    }else if(number > $scope.totalPages) {
                        page = $scope.totalPages;
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
                    if($scope.param.page >= $scope.totalPages) {
                        page = $scope.totalPages;
                    }else {
                        page =$scope.param.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.totalPages;
                    break;
            }
            if(page == $scope.param.page || page < 1 || page > $scope.totalPages) {
                $scope.param.currentPage = $scope.param.page;
                return ;
            }
            $scope.param.page = page;
            $scope.tradeRecordTableParams.page($scope.param.page);
            $scope.tradeRecordTableParams.reload();
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

        $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
            if(fromState.name == 'pay_center' || toState.name == 'pay_center'){
                SessionService.unset("vendorCenter");
            }
        });

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
        }

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
        }

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
        /******************根据页数设置翻页的信息********end**************************/

    }]);

    app.register.filter('bankStatusFilter', function () {
        return function (status) {
            var result = '未知状态';
            switch (status) {
                case 101 :
                    result = '待审核';
                    break;
                case 104:
                    result = '使用中';
                    break;
                case 103:
                    result = '未通过';
                    break;
                case 105:
                    result = '已失效';
                    break;
                case 112:
                    result = '已删除';
                    break;
            }
            return result;
        }
    })
});
