define(['app/app'], function (app) {
  app.register.controller('seekPurchaseCtrl',
      ['$scope', '$rootScope', '$stateParams', '$state', 'toaster',
        'seekPurchase', 'BaseService', 'ngTableParams', '$modal', '$upload', '$http',
        function ($scope, $rootScope, $stateParams, $state, toaster,
            seekPurchase, BaseService, ngTableParams, $modal, $upload, $http) {
          document.title = '求购询价-优软商城';
          $rootScope.active = 'vendor_seek_purchase';
          $scope.seekPurchaseRate = {};
          seekPurchase.getSeekUrl({}, function(data) {
            var seekUrl = data.url;
          $scope.initInquiryItem = function () {
            $scope.validSayPrice = {
              leadtime: false,
              repliesPrice: false,
              repliesLapQty: false
            }
          }
          $scope.initInquiryItem();

          // 获取当前卖家求购推送列表
          $scope.seekPurchaseTableParams = new ngTableParams({
            pageNumber: 1,
            pageSize: 10
          }, {
            total: 0,
            getData: function ($defer, params) {
              const param = BaseService.parseParams(params.url());
              // param.deadline = $scope.deadline;
              // param.status = $scope.status;
              param.enUU = $scope.userInfo.enterprise.uu;
              param.keyword = $scope.keyWord;
              param.fromDate = $scope.startDate
                  ? $scope.startDate.getTime() : null;
              param.endDate = $scope.endDate ? $scope.endDate.getTime()
                  : null;
              param.pageNumber = param.page;
              param.pageSize = param.count;
              if ($scope.isSearch) {
                param.page = 1;
                params.page(1);
                $scope.isSearch = false;
              }
              $http({
                method: 'get',
                dataType: 'json',
                url: seekUrl + '/inquiry/public',
                params: param
              }).success(function (data) {
                params.total(data.totalElements);
                $defer.resolve(data.content);
                $scope.seekListData = data.content;
              }).error(function (response) {
                toaster.pop('error', response);
              });
            }
          });

          // 搜索
          $scope.onSearch = function () {
            $scope.isSearch = true;
            $scope.seekPurchaseTableParams.reload();
          }

          $scope.validOffer = {
            unitPrice: false,
            minDay: false,
            maxDay: false
            // produceDate: true
          };

          /*
          * 输入价格校验
          * */
          $scope.onUnitPriceBlur = function () {
            if (angular.isNumber($scope.offer.unitPrice)) {
              if ($scope.offer.unitPrice <= 0) {
                toaster.pop('warning', '提示', '单价必须是大于0的数字');
                $scope.validOffer.unitPrice = false;
              } else {
                $scope.validOffer.unitPrice = true;
              }
            } else {
              toaster.pop('warning', '提示', '单价必须是大于0的数字');
              $scope.validOffer.unitPrice = false;
            }
          }

          $scope.onUnitPriceChange = function () {
            var price = $scope.offer.unitPrice;
            if (angular.isNumber(price)) {
              if (price >= 10000) {
                $scope.offer.unitPrice = Number(price.toString().substring(0, 4));
              } else if (price.toString().indexOf('.') > -1) {
                var arr = price.toString().split(".");
                if (arr[0].length > 4) {
                  $scope.offer.unitPrice = Number(arr[0].substring(0, 4) + '.' + arr[1]);
                } else if (arr[1].length > 6) {
                  $scope.offer.unitPrice = Number(arr[0] + '.' + arr[1].substring(0, 6));
                }
              }
            }
          }

          $scope.onMinDayInput = function () {
            if ($scope.offer.minDay < 1 || $scope.offer.minDay > 31 || $scope.offer.minDay.toString().indexOf('.') !== -1) {
              $scope.validOffer.minDay = false;
              toaster.pop('warning', '提示', '交期只能填写1-31之间的整数值');
            } else if ($scope.offer.maxDay && $scope.offer.maxDay < $scope.offer.minDay) {
              $scope.validOffer.minDay = false;
              toaster.pop('warning', '提示', '最短交期应小于等于最长交期');
            } else {
              $scope.validOffer.minDay = true;
            }
          };

          $scope.onMinDayChange = function () {
            if (angular.isNumber($scope.offer.minDay) && $scope.offer.minDay.toString().length > 2) {
              $scope.offer.minDay = Number($scope.offer.minDay.toString().substring(0, 2));
            }
          }

          $scope.onMaxDayInput = function () {
            if ($scope.offer.maxDay < 1 || $scope.offer.maxDay > 31 || $scope.offer.maxDay.toString().indexOf('.') !== -1) {
              $scope.validOffer.maxDay = false;
              toaster.pop('warning', '提示', '交期只能填写1-31之间的整数值');
            } else if ($scope.offer.minDay && $scope.offer.maxDay < $scope.offer.minDay) {
              $scope.validOffer.maxDay = false;
              toaster.pop('warning', '提示', '最短交期应小于等于最长交期');
            } else {
              $scope.validOffer.maxDay = true;
            }
          }

          $scope.onMaxDayChange = function () {
            if (angular.isNumber($scope.offer.maxDay) && $scope.offer.maxDay.toString().length > 2) {
              $scope.offer.maxDay = Number($scope.offer.maxDay.toString().substring(0, 2));
            }
          }

          var getRealLen = function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
              if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
                len += 2;
              } else {
                len++;
              }
            }
            return len;
          }

          $scope.onProduceDateChange = function () {
            if ($scope.offer.produceDate && getRealLen($scope.offer.produceDate) > 12) {
              $scope.offer.produceDate = $scope.offer.produceDate.substring(0, $scope.applyObj.produceDate.length - 1);
            }
          }

          $scope.checkAllOffer = function () {
            return $scope.validOffer.unitPrice && $scope.validOffer.minDay && $scope.validOffer.maxDay;
          }

          $scope.seekCurrency = [];
          $scope.currencyChange = function (cc) {
            for (var i = 0; i < $scope.seekCurrency.length; i++) {
              $scope.seekCurrency[i] = cc;
            }
          }
          // 保存报价
          $scope.saveOfferBtn = false;
          $scope.saveOffer = function () {
            if ($scope.checkValid()) {
              $scope.inquiryItem.vendUU = $scope.userInfo.enterprise.uu;
              $scope.inquiryItem.vendUserUU = $scope.userInfo.userUU;
              $scope.inquiryItem.qutoApp = "MALL";
              if (!$scope.inquiryItem.currency) {
                $scope.inquiryItem.currency = $scope.seekCurrency[0];
              }
              if (seekUrl == 'https://api-inquiry.usoftmall.com') {
                seekPurchase.saveOfferProd($scope.inquiryItem, function (data) {
                  toaster.pop('success', '报价成功');
                  $scope.isShowSayPriceBox = false;
                  $scope.seekPurchaseTableParams.reload();
                }, function (response) {
                  toaster.pop('error', '请勿重复报价或报价自己的求购');
                });
              } else {
                seekPurchase.saveOffer($scope.inquiryItem, function (data) {
                  toaster.pop('success', '报价成功');
                  $scope.isShowSayPriceBox = false;
                  $scope.seekPurchaseTableParams.reload();
                }, function (response) {
                  toaster.pop('error', '请勿重复报价或报价自己的求购');
                });
              }
            } else {
              toaster.pop('error', '请输入正确的报价信息');
            }
          }

          $scope.condition = {endDateOpen: false, startDateOpen: false};

          $scope.openDatePicker = function ($event, item, openParam, status) {
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
              if (item['startDateOpen']) {
                item['startDateOpen'] = !item['startDateOpen'];
              }
            }
          };
          $scope.changeEndDate = function () {
            if ($scope.condition.endDateOpen) {
              $scope.endDate = $scope.endDate.toString().replace(
                  /[0-9]{2}:[0-9]{2}:[0-9]{2}/g, '23:59:59');//;'23.59';//DateUtil.yyyyMmDd($scope.endDate.getTime() + 86399000);
              $scope.endDate = new Date(
                  formatDateTime(new Date($scope.endDate.toString())));
            }
            $scope.vaildDate(false);
          };
          $scope.vaildDate = function (isStart) {
            if ($scope.endDate !== null && $scope.startDate > $scope.endDate) {
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
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + sec;
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

          $scope.isShowSayPriceBox = false;
          /*设置列表状态*/
          $scope.setSeekActive = function (seek, flag, index) {
            if (flag) {
              angular.forEach($scope.seekListData, function (item) {
                item.$active = false;
              });
              $scope.offer = {
                currency: seek.currency ? seek.currency : "RMB",
                spId: seek.spId
              }
              $scope.inquiryItem = seek;
              $scope.inquiryItem.leadtime = '';
              $scope.inquiryItem.replies = [
                {
                  lapQty: '',
                  price: ''
                }
              ];
            }
            //seek.$active = flag;
            $scope.isShowSayPriceBox = flag;
          }


          $scope.onLeadtimeInput = function () {
            var time = $scope.inquiryItem.leadtime.toString();
            console.info();
            if (time.length > 3) {
              $scope.inquiryItem.leadtime = Number(time.substring(0, 3));
            }
          }
          $scope.onLeadtimeBlur = function () {
            if (!$scope.inquiryItem.leadtime || $scope.inquiryItem.leadtime < 1 || $scope.inquiryItem.leadtime >= 1000 || $scope.inquiryItem.leadtime.toString().indexOf('.') !== -1) {
              $scope.validSayPrice.leadtime = false;
              toaster.pop('error', '交期请填写1-999之间的正整数');
            } else {
              $scope.validSayPrice.leadtime = true;
            }
          }
          $scope.onReplyLapQtyBlur = function (index) {
            var lapQty = $scope.inquiryItem.replies[index].lapQty;
            var limitDownObj = $scope.getLimitDownQty();
            if (!lapQty || lapQty < 1) {
              $scope.inquiryItem.replies[index].lapQty = '';
              toaster.pop('error', '输入值必须为正整数');
              $scope.validSayPrice.repliesLapQty = false;
            } else if (limitDownObj.index !== index && limitDownObj.lapQty > lapQty) {
              toaster.pop('error', '输入值必须大于#该梯度的下限#');
              $scope.inquiryItem.replies[index].lapQty = '';
              $scope.validSayPrice.repliesLapQty = false;
            } else if ((index - 1 >= 0 && $scope.inquiryItem.replies[index - 1].lapQty && $scope.inquiryItem.replies[index - 1].lapQty >= lapQty) || (index + 1 < $scope.inquiryItem.replies.length && $scope.inquiryItem.replies[index + 1].lapQty && $scope.inquiryItem.replies[index + 1].lapQty <= lapQty)) {
              toaster.pop('error', '输入值会导致梯度重叠，请重新修改');
              $scope.inquiryItem.replies[index].lapQty = '';
              $scope.validSayPrice.repliesLapQty = false;
            } else {
              $scope.validSayPrice.repliesLapQty = true;
            }
          }
          $scope.onReplyLapQtyInput = function (index) {
            var lapQty =  $scope.inquiryItem.replies[index].lapQty.toString();
            if (lapQty.length >= 10) {
              $scope.inquiryItem.replies[index].lapQty = Number(lapQty.substring(0, 9));
            }
          }

          $scope.getLimitDownQty = function () {
            for (var i = 0; i < $scope.inquiryItem.replies.length; i++) {
              if ($scope.inquiryItem.replies[i].lapQty) {
                return {
                  lapQty: $scope.inquiryItem.replies[i].lapQty,
                  index: i
                };
              }
            }
            return {index: -1};
          }

          $scope.onReplyPriceInput = function (index) {
            var price = $scope.inquiryItem.replies[index].price.toString();
            if (price >= 10000) {
              $scope.inquiryItem.replies[index].price = Number(price.substring(0, 4));
            } else if (price.indexOf('.') > -1) {
              var arr = price.split('.');
              if (arr[0].length > 4) {
                $scope.inquiryItem.replies[index].price = Number(arr[0].substring(0, 4) + '.' + arr[1]);
              } else if (arr[1].length > 6) {
                $scope.inquiryItem.replies[index].price = Number(arr[0] + '.' + arr[1].substring(0, 6));
              }
            }
          }

          $scope.onReplyPriceBlur = function (index) {
            var price = $scope.inquiryItem.replies[index].price;
            // var limitDownObj = $scope.getLimitDownPrice();
            if (!price) {
              $scope.inquiryItem.replies[index].price = '';
              toaster.pop('error', '价格不能为空');
              $scope.validSayPrice.repliesPrice = false;
            } else if (price <= 0) {
              $scope.inquiryItem.replies[index].price = '';
              toaster.pop('error', '输入值必须为正整数');
              $scope.validSayPrice.repliesPrice = false;
            } else {
              $scope.validSayPrice.repliesPrice = true;
            }
          }
/*
          $scope.getLimitDownPrice = function () {
            for (var i = 0; i < $scope.inquiryItem.replies.length; i++) {
              if ($scope.inquiryItem.replies[i].price) {
                return {
                  price: $scope.inquiryItem.replies[i].price,
                  index: i
                };
              }
            }
            return {index: -1};
          }*/

          $scope.checkValid = function () {
            for (var i = 0; i < $scope.inquiryItem.replies.length; i++) {
              if (!$scope.inquiryItem.replies[i].lapQty || !$scope.inquiryItem.replies[i].price) {
                return false;
              }
            }
            return $scope.validSayPrice.leadtime && $scope.validSayPrice.repliesLapQty && $scope.validSayPrice.repliesPrice;
          }

          $scope.setReplies = function (type, index) {
            if (type === 'add' && $scope.inquiryItem.replies.length < 5) {
              if ($scope.inquiryItem.replies[index].price && $scope.inquiryItem.replies[index].lapQty) {
                $scope.inquiryItem.replies.splice(index + 1, 0, {
                  lapQty: '',
                  price: ''
                });
              } else {
                toaster.pop('error', '请填完整信息');
              }
            } else if (type === 'sub' && $scope.inquiryItem.replies.length > 1) {
              $scope.inquiryItem.replies.splice(index, 1);
            }
          }

          $scope.linkBoxIndex = -1;

          $scope.setLinkBoxIndex = function (index) {
            $scope.linkBoxIndex = index;
          }
          });
        }]);
});