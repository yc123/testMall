define(['app/app'], function(app) {
    app.register.controller('purchaseAcceptCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'toaster', 'seekPurchase', 'BaseService', 'ngTableParams', '$modal', function ($scope, $rootScope, $stateParams, $state, toaster, seekPurchase, BaseService, ngTableParams, $modal) {
        document.title = '我的报价-优软商城';
        $rootScope.active = 'vendor_seek_purchase';
        $scope.seekPurchaseRate = {};
        $scope.offer = {};

        // 获取当前卖家求购成交率
        seekPurchase.getSeekPurchaseRate(function(data) {
            $scope.seekPurchaseRate = data;
        }, function(response) {
            toaster.pop('error', '错误', response.data);
        });

        // 获取我的报价列表
        $scope.seekPurchaseTableParams = new ngTableParams({
          pageNumber: 1,
          pageSize: 10
        }, {
            total : 0,
            getData : function ($defer, params) {
                const param = BaseService.parseParams(params.url());
                filter = {};
                filter.vendUU = $scope.userInfo.enterprise.uu;

                // param.enUU = $scope.userInfo.enterprise.uu;
                // param.deadline = $scope.deadline;
                // param.status = $scope.status;
                param._state = "agreed";
                filter.keyword = $scope.keyWord;
                filter.fromDate = $scope.startDate
                  ? $scope.startDate.getTime() : null;
                filter.endDate = $scope.endDate ? $scope.endDate.getTime()
                  : null;
                param.filter = filter;
                param.pageNumber = param.page;
                param.pageSize = param.count;
              if ($scope.isSearch) {
                param.page = 1;
                params.page(1);
                $scope.isSearch = false;
              }
                seekPurchase.getMyOfferPageInfo(param, function (data) {
                    params.total(data.totalElements);
                    $defer.resolve(data.content);
                }, function (response) {
                    toaster.pop('error', '获取求购列表失败');
                });
            }
        });

        // 搜索
        $scope.onSearch = function(){
            $scope.isSearch = true;
            $scope.seekPurchaseTableParams.reload();
        }

        $scope.condition = {endDateOpen:false, startDateOpen: false};

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
            if (openParam == 'startDateOpen') {
                if (item['endDateOpen']) {
                    item['endDateOpen'] = !item['endDateOpen'];
                }
            } else if (openParam == 'endDateOpen') {
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
                if (isStart) {
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

        /*获取时间戳代表的天数*/
        $scope.getDay = function (timeStamp) {
            return Math.floor(timeStamp / (1000 * 60 * 60 * 24));
        }
        /*获取时间戳代表的小时*/
        $scope.getHours = function (timeStamp) {
            return Math.floor((timeStamp / (1000 * 60 * 60)) % 24);
        }

        /*设置列表状态*/
        $scope.setSeekActive = function (seek, flag) {
            seek.$active = flag;
            console.info(seek);
            if (flag) {
                $scope.offer.currency = seek.currency ? "RMB" : seek.currency;
                $scope.offer.spId = seek.spId;
            }
        }

        /*上架模态框*/
        $scope.goGrounding = function (seek) {
            $modal.open({
                templateUrl : 'static/view/vendor/modal/groundingSeek.html',
                controller : 'groundingSeekCtrl',
                size : 'lg',
                resolve : {
                    seek : function() {
                        return angular.copy(seek);
                    }
                }
            });
        }

    }]);
    app.register.controller('groundingSeekCtrl', ['$scope', 'toaster', 'seek', '$modalInstance', function ($scope, toaster, seek, $modalInstance) {
        $scope.seek = angular.copy(seek);
        $scope.cancel = function () {
            $modalInstance.dismiss();
        }

        $scope.formData = {
            minPackQty: 1,
            breakUp: true
        };

        $scope.prices = [{}];
        
        // 库存校验
        $scope.checkReserve = function () {
            if ($scope.formData.reserve) {
                $scope.formData.reserve = $scope.formData.reserve < 1 ? 1 : $scope.formData.reserve > 99999999 ? 99999999 : $scope.formData.reserve;
            }
        }

        // 起订量校验
        $scope.checkMinBuyQty = function () {
            if ($scope.formData.minBuyQty < 1) {
                $scope.formData.minBuyQty = 1
            } else if ($scope.formData.reserve && $scope.formData.minBuyQty > $scope.formData.reserve) {
                $scope.formData.minBuyQty = $scope.formData.reserve
            } else if (!$scope.formData.breakUp) {
                if ($scope.formData.minBuyQty < $scope.formData.minPackQty) {
                    $scope.formData.minBuyQty = $scope.formData.minPackQty;
                } else if ($scope.formData.minBuyQty % $scope.formData.minPackQty != 0) {
                    $scope.formData.minBuyQty = $scope.formData.minBuyQty - $scope.formData.minBuyQty % $scope.formData.minPackQty;
                }
            }
        }
        
        // 最小包装数量校验
        $scope.checkMinPacyQty = function () {
            if ($scope.formData.minPackQty) {
                $scope.formData.minPackQty = $scope.formData.minPackQty < 1 ? 1 : $scope.formData.minPackQty > 99999 ? 99999 : $scope.formData.minPackQty;
            }
        }

        $scope.checkMinDate = function () {
            $scope.formData.minDate = $scope.formData.minDate < 1 ? 1 : $scope.formData.minDate > 31 ? 31 : $scope.formData.minDate;
            if ($scope.formData.maxDate && $scope.formData.minDate > $scope.formData.maxDate) {
                $scope.formData.minDate = $scope.formData.maxDate;
            }
        }

        $scope.checkMaxDate = function () {
            $scope.formData.maxDate = $scope.formData.maxDate < 1 ? 1 : $scope.formData.maxDate > 31 ? 31 : $scope.formData.maxDate;
            if ($scope.formData.minDate && $scope.formData.minDate > $scope.formData.maxDate) {
                $scope.formData.maxDate = $scope.formData.minDate;
            }
        }

        $scope.addPrices = function () {
            if ($scope.prices.length < 3) {
                $scope.prices.push({});
            }
        }

        $scope.subPrices = function (index) {
            if ($scope.prices.length > 1) {
                $scope.prices.splice(index, 1);
            }
        }

    }]);
});