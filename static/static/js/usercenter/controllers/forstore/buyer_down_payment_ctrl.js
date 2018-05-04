define([ 'app/app' ], function(app) {

    app.register.controller('downPaymentCtrl', ['$scope', '$rootScope', '$anchorScroll', '$location','SessionService', 'bankInfoService','$modal', 'toaster', 'bankTransferService', '$filter', 'ngTableParams', 'BaseService', 'OrderSimpleInfo', '$state', '$stateParams', 'Order', 'SmoothScroll', 'EncryptionService', function($scope, $rootScope, $anchorScroll, $location,SessionService, bankInfoService, $modal, toaster, bankTransferService, $filter, ngTableParams, BaseService, OrderSimpleInfo, $state, $stateParams, Order, SmoothScroll, EncryptionService) {
        BaseService.scrollBackToTop();

        $scope.type = "PAIDTOPLATFORM";
        $scope.orderList = '';
        if($stateParams.orderid) {
            Order.get({orderid : $stateParams.orderid}, function(data) {
                var arr = new Array();
                $scope.$$bankTransfer = {};
                $scope.$$bankTransfer.total = 0.0;
                for(var i = 0; i < data.length; i++) {
                    arr.push(data[i].orderid);
                    $scope.$$bankTransfer.total = $scope.$$bankTransfer.total + data[i].ensurePrice;
                }
                $scope.$$bankTransfer.currency =  data[0].currency;
                $scope.orderNum = arr.join('，');
                $scope.orderList = arr;

                // 日期换算
                $scope.availabletime = '';
                $scope.availabletime = data[0].availabletime;
                $scope.creattime = '';
                $scope.creattime = data[0].creattime;
                var SurplusTime = $scope.availabletime - $scope.creattime;
            }, function (response) {
                toaster.pop('info', '获取订单的信息有误，请确定付款的订单');
            })
        }else {
            $state.go('buyer_order');
        }
        
        $scope.purKind = $rootScope.userInfo.enterprises ? false : true;//应付账户的类别, 默认是企业
        $scope.saleKind = false;//应收账户的类别，默认是企业
        var ids=SessionService.get("ids");

        var page = Number(SessionService.get("page")) || 1;
        var count = Number(SessionService.get("count")) || 20;
        SessionService.unset("ids");
        SessionService.unset("page");
        SessionService.unset("count");
        var hideBankFilter = $filter("hideBankFilter");
        $scope.isSelectAll = false;
        $scope.isSelect = false;
        $scope.orderArray = []; //存放订单链
        $scope.total = 0;
        $scope.currencyName = ''; //存放当前币别

        $scope.nowTime = new Date().getTime();

        //解析数据，从返回的数据中找到要解析的数据
        var resolveData = function(data) {
            var arr = new Array();
            for(var key in data) {
                var numb= Number(key);
                if(angular.isNumber(numb)&&(!isNaN(numb))) {
                    arr.push(data[key]);
                }
            }
            return arr;
        };

        //获取管理平台账户信息
        var getOriginalData = function(data) {
            var result = {};
            if(data&&data.length) {
                result = data[0];
            }else {
                result = null;
            }
            return result;
        };
        var getSellerAccount = function() {
            bankInfoService.getAdminEnterAccount('', function(data) {
                $scope.saleAccountInfos = resolveData(data);
                angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
                    saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
                });
                $scope.saleAccount = getOriginalData($scope.saleAccountInfos);
            }, function(res) {
                toaster.pop('error', '错误', '获取卖家企业账户信息失败');
            });
        };
        getSellerAccount();

        // 确认订单
        //订单加密解析器
        var enIdFilter = $filter('EncryptionFilter');
        $scope.confirmOrder = function () {
            $state.go('order_transfer', {orderid : $stateParams.orderid});
        };

        $scope.buyExpose = false;
        $scope.salexpose = false;
        //expose代表展开的状态，isBuyd代表当前操作的数据
        $scope.doExpose = function(expose, isBuy) {
            if(isBuy) {
                $scope.buyExpose = expose;
            }else {
                $scope.salexpose = expose;
            }
        }

        //获取当前时间
        var getTodayDate = function(){
            var date = new Date();
            $scope.maxDate = date;
        };
        getTodayDate();
    }]);
    /**
     * 与现在的时间对比，距离多少天多少小时
     */
    app.register.filter('restTime', function () {
        var day = 0, hours = 0, minute = 0;
        return function (time) {
            if(!time) {
                return null;
            }
            var nowTime = new Date();
            var s1 = time - nowTime.getTime();
            var totalHours = s1/(1000*60*60);//算多少个小时
            day = parseInt(totalHours) / 24;
            hours = parseInt(totalHours) % 24;
            minute = parseInt(hours)% 60;
            return parseInt(day) + "天" + parseInt(hours) + "小时";
        }
    });

    /**
     * totalHours传入小时，被减去minuesTime转换成天数
     * 返回格式时  x天y小时
     */
    app.register.filter('hoursToDay', function () {
        var day = 0, hours = 0;
        return function (totalHours, minuesdTime) {
            var h = minuesdTime - totalHours;
            day = parseInt(h) / 24;
            hours = parseInt(h) % 24;
            return "还剩 " + parseInt(day) + "天" + parseInt(hours) + "小时";
        }
    });
});
