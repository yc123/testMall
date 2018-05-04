/**
 * Created by yujia on 2017/3/19.
 *  求购的控制器
 */
define(['app/app'], function (app) {
  'use strict';
  app.register.controller('seekPurchaseCtrl',
      ['$scope', '$rootScope', 'seekPurchase', 'toaster', 'BaseService',
        'ngTableParams', 'Order', 'SessionService', '$filter', '$upload', '$stateParams', 'Search', '$http',
        function ($scope, $rootScope, seekPurchase, toaster, BaseService,
            ngTableParams, Order, SessionService, $filter, $upload, $stateParams, Search, $http) {
          $rootScope.active = 'seek_purchase';
          document.title = '我的求购-优软商城';
          $scope.activeType = $stateParams.type ? $stateParams.type :'seekManage';
          $scope.toogleType = function (type) {
            clearSeekStatus();
            $scope.activeType = type;
          }

          var clearSeekStatus = function () {
            angular.forEach($scope.seekListData.content, function (item) {
              item.$status = 0;
            })
          }
          var enIdFilter = $filter('EncryptionFilter');
          seekPurchase.getSeekUrl({}, function(data) {
            var seekUrl = data.url;
            $scope.tab = 'waitOffer';
            $scope.toogleTab = function (tab) {
                $scope.tab = tab;
              $scope.seekPurchaseTableParams = new ngTableParams({
                pageNumber: 1,
                pageSize: 10
              }, {
                total: 0,
                getData: function ($defer, params) {
                  const param = BaseService.parseParams(params.url());
                  param.pageNumber = param.page;
                  param.pageSize = param.count;
                  if ($scope.isSearch) {
                    param.page = 1;
                    params.page(1);
                    $scope.isSearch = false;
                  }
                  if ($scope.tab == 'waitOffer') {
                    param.state = "todo";
                    var filter = {};
                    if ($scope.userInfo.enterprise) {
                      param.enUU = $scope.userInfo.enterprise.uu;
                    } else{
                      param.userUU = $scope.userInfo.userUU;
                    }
                    param.keyword = $scope.keyWord;
                    param.fromDate = $scope.startDate
                        ? $scope.startDate.getTime() : null;
                    param.endDate = $scope.endDate ? $scope.endDate.getTime()
                        : null;
                    $http({
                      method: 'get',
                      dataType: 'json',
                      url: seekUrl + '/inquiry/buyer/list',
                      params: param
                    }).success(function (data) {
                      params.total(data.totalElements);
                      $defer.resolve(data.content);
                      $scope.seekListData = data;
                    }).error(function (response) {
                      toaster.pop('error', response);
                    });
                  } else if($scope.tab == 'offered') {
                    param._state = "done";
                    if ($scope.userInfo.enterprise) {
                      param.enUU = $scope.userInfo.enterprise.uu;
                    } else {
                      param.userUU = $scope.userInfo.userUU;
                    }
                    param.keyword = $scope.keyWord;
                    param.fromDate = $scope.startDate
                        ? $scope.startDate.getTime() : null;
                    param.endDate = $scope.endDate ? $scope.endDate.getTime()
                        : null;
                    $http({
                      method: 'get',
                      dataType: 'json',
                      url: seekUrl + '/inquiry/buyer/quotations',
                      params: param
                    }).success(function (data) {
                      params.total(data.totalElements);
                      $defer.resolve(data.content);
                      $scope.seekListData = data;
                    }).error(function (response) {
                      toaster.pop('error', response);
                    });
                  }
                }
              });
            }
          $scope.toogleTab('waitOffer');
          $scope.applyObj = {
            code: '',
            brand: '',
            unitPrice: '',
            currency: 'RMB',
            encapsulation: '',
            produceDate: '',
            amount: '',
            deadline: ''
          };
          $scope.validObj = {
            code: true,
            brand: true,
            unitPrice: true,
            amount: true,
            deadline: true
          };

          // 买家求购列表
          $scope.searchStatus = 0;


          $scope.bomSearch = {};
          $scope.bomTableParams = new ngTableParams({
            pageNumber: 1,
            pageSize: 20
          }, {
            total: 0,
            getData: function ($defer, params) {
              const param = BaseService.parseParams(params.url());
              if ($scope.userInfo.enterprise) {
                param.enUU = $scope.userInfo.enterprise.uu;
              } else {
                param.userUU = $scope.userInfo.userUU;
              }
              // 返回首页
              if ($scope.isSearch) {
                param.page = 1;
                params.page(1);
                $scope.isSearch = false;
              }
              $http({
                method: 'get',
                dataType: 'json',
                url: seekUrl + '/inquiry/buyer/inquiryList',
                params: param
              }).success(function (data) {
                params.total(data.totalElements);
                $scope.bomTotal = data.totalElements;
                $defer.resolve(data.content);
              }).error(function (response) {
                toaster.pop('error', response);
              });
            }
          });

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
          var cutOutString = function (str, length) {
            for (var i = 1; i <= str.length; i++) {
              if (getRealLen(str.substr(0, i)) > length){
                str = str.substr(0, i-1);
                break;
              }
            }
            return str;
          };

          $scope.nowDate = new Date();

          $scope.deadDate = new Date();
          $scope.deadDate.setMonth($scope.deadDate.getMonth() + 3);
          $scope.deadDate.setDate($scope.deadDate.getDate() + 1);

          $scope.checkCode = function () {
            $scope.setShowSimilarCodeList($scope.isInCodeList);
            $scope.validObj.code = $scope.applyObj.code && $scope.applyObj.code !== '';
            if (!$scope.validObj.code) {
              toaster.pop('error', '型号不能为空');
            }
            return this.validObj.code;
          }
          $scope.checkBrand = function () {
            $scope.setShowSimilarBrandList($scope.isInBrandList);
            $scope.validObj.brand = $scope.applyObj.brand
                && $scope.applyObj.brand !== '';
            if (!$scope.validObj.brand) {
              toaster.pop('error', '品牌不能为空');
            }
            return $scope.validObj.brand;
          }
          $scope.checkUnitPrice = function () {
            $scope.validObj.unitPrice = ($scope.applyObj.unitPrice === '' || !$scope.applyObj.unitPrice ) ? true
                : $scope.applyObj.unitPrice > 0 && $scope.applyObj.unitPrice
                < 100000000;
            if (!$scope.validObj.unitPrice || $scope.validObj.unitPrice <= 0) {
              toaster.pop('error', '单价必须是大于0的数字');
            }
            return $scope.validObj.unitPrice;
          }
          $scope.onUnitPriceInput = function () {
            var price = $scope.applyObj.unitPrice;
            if (angular.isNumber(price)) {
              if (price >= 10000) {
                $scope.applyObj.unitPrice = Number(price.toString().substring(0, 4));
              } else if (price.toString().indexOf('.') > -1) {
                var arr = price.toString().split(".");
                if (arr[0].length > 4) {
                  $scope.applyObj.unitPrice = Number(arr[0].substring(0, 4) + '.' + arr[1]);
                } else if (arr[1].length > 6) {
                  $scope.applyObj.unitPrice = Number(arr[0] + '.' + arr[1].substring(0, 6));
                }
              }
            }
          }
          $scope.onAmountChange = function () {
            if (!(/^[0-9]*$/).test($scope.applyObj.amount)) {
              var chineseIndex = -1;
              for (var i = 0; i < $scope.applyObj.amount.length; i++) {
                if (!(/^[0-9]*$/).test($scope.applyObj.amount.charAt(i))) {
                  chineseIndex = i;
                  break;
                }
              }
              $scope.applyObj.amount = cutOutString($scope.applyObj.amount, chineseIndex);
            } else if ($scope.applyObj.amount.length > 9) {
              $scope.applyObj.amount = cutOutString($scope.applyObj.amount, 9);
            }
          }
          $scope.onEncapsulationChange = function () {
            if ($scope.applyObj.encapsulation && getRealLen($scope.applyObj.encapsulation) > 20) {
              $scope.applyObj.encapsulation = cutOutString($scope.applyObj.encapsulation, 20);
            }
          }
          $scope.onCodeChange = function () {
            // $scope.applyObj.code = $scope.applyObj.code.trim();
            if ((/[^\x00-\xff]/g).test($scope.applyObj.code)) {
              var chineseIndex = -1;
              for (var i = 0; i < $scope.applyObj.code.length; i++) {
                if ((/[^\x00-\xff]/g).test($scope.applyObj.code.charAt(i))) {
                  chineseIndex = i;
                  break;
                }
              }
              $scope.applyObj.code = cutOutString($scope.applyObj.code, chineseIndex);
            } else if ($scope.applyObj.code && getRealLen($scope.applyObj.code) > 100) {
              $scope.applyObj.code = cutOutString($scope.applyObj.code, 100);
            } else {
              if ($scope.applyObj.code) {
                $scope.getSimilarCode();
              } else {
                $scope.showSimilarCodeList = false;
              }
            }
          }
          $scope.onBrandChange = function () {
            // $scope.applyObj.brand = $scope.applyObj.brand.trim();
            if ((/[^\x00-\xff]/g).test($scope.applyObj.brand)) {
              var chineseIndex = -1;
              for (var i = 0; i < $scope.applyObj.brand.length; i++) {
                if ((/[^\x00-\xff]/g).test($scope.applyObj.brand.charAt(i)) && !(/[\u4e00-\u9fa5]/).test($scope.applyObj.brand.charAt(i))) {
                  chineseIndex = i;
                  break;
                }
              }
              if (chineseIndex > -1) {
                $scope.applyObj.brand = $scope.applyObj.brand.substring(0, chineseIndex);
              }
            } else if ($scope.applyObj.brand && getRealLen($scope.applyObj.brand) > 50) {
              $scope.applyObj.brand = cutOutString($scope.applyObj.brand, 50);
            } else {
              if ($scope.applyObj.brand) {
                $scope.getSimilarBrand();
              } else {
                $scope.showSimilarBrandList = false;
              }
            }
          }
          $scope.onProduceDateChange = function () {
            if ($scope.applyObj.produceDate && getRealLen($scope.applyObj.produceDate) > 12) {
              $scope.applyObj.produceDate = cutOutString($scope.applyObj.produceDate, 12);
            }
          }
          $scope.checkAmount = function () {
            $scope.validObj.amount = $scope.applyObj.amount === '' ? true
                : $scope.applyObj.amount > 0 && $scope.applyObj.amount
                < 1000000000;
            return $scope.validObj.amount;
          }
          $scope.checkAll = function () {
            return $scope.checkCode() && $scope.checkBrand() && $scope.checkDeadline()
                && $scope.checkUnitPrice() && $scope.checkAmount();
          }
          $scope.checkDeadline = function () {
            $scope.validObj.deadline = $scope.applyObj.deadline
                && $scope.applyObj.deadline !== '';
            return $scope.validObj.deadline;
          }
          $scope.emptyForm = function () {
            for (var attr in $scope.applyObj) {
              $scope.applyObj[attr] = attr === 'currency' ? 'RMB' : '';
            }
          }

          // 发布求购
          $scope.release = function () {
            // 校验
            if ($scope.checkAll()) {
              var inquiry = {};
              var inquiryItem = {};
              inquiry.recorderUU = $scope.userInfo.userUU;
              inquiry.code = "MALL" + $filter('date')(new Date, 'yyyyMMddsss');
              inquiry.date = new Date();
              inquiry.recorder = $scope.userInfo.userName;
              // 截止时间处理  添加23:59:59秒
              $scope.applyObj.deadline = new Date(formatDateTime($scope.applyObj.deadline));
              inquiry.endDate = $scope.applyObj.deadline;
              inquiry.sourceapp = "MALL";
              inquiry.amount = 1;
              inquiryItem.prodTitle = $scope.applyObj.code;
              inquiryItem.userUU = $scope.userInfo.userUU;
              inquiryItem.source = "MALL";
              if ($scope.userInfo.enterprise) {
                inquiry.enUU = $scope.userInfo.enterprise.uu;
                inquiryItem.userName = $scope.userInfo.enterprise.enName;
              } else {
                inquiryItem.userName = $scope.userInfo.userName;
              }
              inquiryItem.userTel = $scope.userInfo.userTel;
              inquiryItem.needquantity = $scope.applyObj.amount;
              inquiryItem.inbrand = $scope.applyObj.brand;
              inquiryItem.currency = $scope.applyObj.currency;
              inquiryItem.cmpCode = ($scope.applyObj.code).toUpperCase();
              inquiryItem.unitPrice = $scope.applyObj.unitPrice;
              inquiryItem.produceDate = $scope.applyObj.produceDate;
              inquiryItem.date = new Date();
              inquiryItem.endDate = $scope.applyObj.deadline;
              inquiryItem.encapsulation = $scope.applyObj.encapsulation;
              var inquiryItems = [];
              inquiryItems.push(inquiryItem);
              inquiry.inquiryItems = inquiryItems;
              if (seekUrl == 'https://api-inquiry.usoftmall.com') {
                seekPurchase.saveOneSeekPurchaseProd(inquiry,
                    function (data) {
                      $scope.showUseFlag = false;
                      $scope.seekPurchaseTableParams.reload();
                      $scope.emptyForm();
                      toaster.pop('success', '求购发布成功');
                    }, function (res) {
                      toaster.pop('error', res.data);
                    });
              } else {
                seekPurchase.saveOneSeekPurchase(inquiry,
                    function (data) {
                      $scope.showUseFlag = false;
                      $scope.seekPurchaseTableParams.reload();
                      $scope.emptyForm();
                      toaster.pop('success', '求购发布成功');
                    }, function (res) {
                      toaster.pop('error', res.data);
                    });
              }

            } else {
              if (!$scope.validObj.deadline) {
                toaster.pop('error', '截止日期不能为空');
              } else if (!$scope.validObj.unitPrice) {
                // toaster.pop('error', '单价必须是大于0的数字');
              } else if (!$scope.validObj.amount) {
                toaster.pop('error', '请输入正确的数值');
              }
            }
          }

          // 立即购买
          $scope.purchase = function (go, index) {
            var goodsObj = {};
            goodsObj.batchCode = go.batchCode;
            goodsObj.currencyName = go.currencyName;
            goodsObj.minPackQty = go.minPackQty;
            goodsObj.number = $scope.fragments[index].num;
            goodsObj.storeUuid = go.storeid;
            goodsObj.storeid = go.storeid;
            var goodsList = [];
            goodsList.push(goodsObj);
            var rootPath = BaseService.getRootPath();
            if(go.minBuyQty > 0) {
              // 1、生成订单
              Order.buyNowInStore({spId: $scope.currentSeek.spId}, goodsList, function(data){
                if(data.message) {
                  toaster.pop('info', data.message);
                }
                // 控制订单确认页，直接购买不显示进度条
                SessionService.set("buyNow", true);
                // 2、跳转到订单确认页面，进行付款操作
                window.open(rootPath + '/user#/order/pay/'+ enIdFilter(data.data.orderid));
              }, function(res){
                toaster.pop('error', '警告', res.data);
              });
            }else {
              toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
            }
          }


          // 搜索
          $scope.onSearch = function (searchStatus) {
            $scope.isSearch = true;
            if (searchStatus) {
              $scope.searchStatus = searchStatus;
            }
            $scope.seekPurchaseTableParams.reload();
          }

          $scope.purchaseQuantityChange = function () {
            if ($scope.purchaseQuantity.length > 8 || !(/^[0-9]*$/).test($scope.purchaseQuantity)) {
              $scope.purchaseQuantity = $scope.purchaseQuantity.substring(0, $scope.purchaseQuantity.length - 1)
            }
          }
          // 采纳报价
          $scope.adopt = function (id) {
            $http({
              method: 'POST',
              dataType: 'json',
              url: seekUrl + '/inquiry/buyer/decide',
              params: {id: id, status: 1}
            }).success(function (data) {
              toaster.pop('success', '采纳报价成功');
              $scope.seekPurchaseTableParams.reload();
            }).error(function (response) {
              toaster.pop('error', response);
            });
          }

          $scope.offerCount = 0;
          $scope.goodsCount = 0;
          $scope.currentSeek = {};
          $scope.setSeekStatus = function (seek, status) {
            $scope.offerCount = seek.offerAmount;
            $scope.currentSeek = seek;
            seekPurchase.getMallGoodsList({code:seek.cmpCode, brand: seek.inbrand}, function (data) {
              $scope.goods = data;
              $scope.goodsCount = data.length;
            });
            // 查看报价
            if (status == 2 && $scope.offerCount != 0) {
              $scope.offer = seek.qutations;
              clearSeekStatus();
              seek.$status = status;
            } else if (status == 1 && $scope.goodsCount != 0) {// 查看现货
              clearSeekStatus();
              initFragments();
              seek.$status = status;
            } else if (status == 0) { // 收起
              seek.$status = status;
            }
            $scope.selectAmount = 0;
            $scope.selectPrice = 0;
          }

          $scope.condition = {
            endDateOpen: false,
            startDateOpen: false,
            deadlineOpen: false
          };
          // 打开日期选择框
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
            for (var key in item) {
              item[key] = false;
            }
            item[openParam] = !item[openParam];
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
            var h = 23;
            var minute = 59;
            var sec = 59;
            //minute = minute < 10 ? ('0' + minute) : minute;
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

          /*
          * input 校验
          * */
          $scope.fragments = [];

          function initFragment(commodity) {
            if (!commodity) {
              return {};
            }
            var fragment = {};
            var prices = commodity.prices[0];
            fragment.num = commodity.minBuyQty;
            fragment.prices = prices;

            if (commodity.currencyName !== 'USD') {
              fragment.currency = 'RMB';
            } else {
              fragment.currency = 'USD';
            }

            if (fragment.currency !== 'USD') {
              fragment.price = prices.rMBPrice;
            } else {
              fragment.price = prices.uSDPrice;
            }
            fragment.canAdd = true;
            fragment.canSub = false;
            return fragment;
          }

          function initFragments() {
            angular.forEach($scope.goods, function (item) {
              $scope.fragments.push(initFragment(item));
            })
          }

          function getFragment(commodity, fragment) {
            // 判断是否小于第一分段的起订量
            if (commodity.prices[0].start > fragment.num) {
              fragment.num = commodity.prices[0].start;
            }
            // 获取分段的信息
            var prices = commodity.prices;
            for (var i = 0; i < prices.length; i++) {
              if (fragment.num <= prices[i].end) {
                fragment.prices = prices[i];
                break;
              }
            }
          }

          $scope.onInput = function (index) {
            var prices = $scope.goods[index].prices;
            if (prices && prices.length) {
              for (var i = 0; i < prices.length; i++) {
                if ($scope.fragments[index].num >= prices[i].start
                    && $scope.fragments[index].num <= prices[i].end) {
                  $scope.fragments[index].price = $scope.fragments[index].currency
                  === 'RMB' ? prices[i].rMBPrice : prices[i].uSDPrice;
                  break;
                }
              }
            }
            if ($scope.goods[index].$checked) {
              var amount = 0;
              angular.forEach($scope.seekListData.content, function (item) {
                if (item.$status == 1) {
                  amount = item.amount;
                }
              })
              if (amount > 0) {
                $scope.selectAmount = 0;
              }
              $scope.selectPrice = 0;
              angular.forEach($scope.goods, function (item, index) {
                if (item.$checked) {
                  if (amount > 0) {
                    if (amount < $scope.selectAmount
                        + $scope.fragments[index].num) {
                      $scope.fragments[index].num = amount
                          - $scope.selectAmount;
                    } else {
                      $scope.selectAmount += $scope.fragments[index].num;
                    }
                  }
                  $scope.selectPrice += $scope.fragments[index].num
                      * $scope.fragments[index].price;
                }
              })
            }
          }
          $scope.changeNum = function (newNum, index) {
            var pack = $scope.goods[index].perQty
                || $scope.goods[index].minPackQty;
            var buy = $scope.goods[index].minBuyQty;
            var reserve = $scope.goods[index].reserve;
            var breakUp = $scope.goods[index].breakUp;
            if (!newNum) {
              $scope.fragments[index].num = buy;
            } else {
              newNum = parseInt(newNum);
              if (breakUp) {
                if (newNum < buy) {
                  toaster.pop('info', '提示', '最小起订量为' + buy);
                  $scope.fragments[index].num = buy;
                  $scope.fragments[index].canSub = false;
                  $scope.fragments[index].canAdd = true;
                } else if (newNum > reserve) {
                  toaster.pop('info', '提示', '库存不足');
                  $scope.fragments[index].num = reserve;
                  $scope.fragments[index].canAdd = false;
                  $scope.fragments[index].canSub = true;
                } else {
                  $scope.fragments[index].canSub = true;
                  $scope.fragments[index].canAdd = true;
                  $scope.fragments[index].num = newNum;
                  newNum === buy && ($scope.fragments[index].canSub = false);
                  newNum === reserve
                  && ($scope.fragments[index].canAdd = false);
                }
              } else {
                if (newNum < buy) {
                  toaster.pop('info', '提示', '最小起订量为' + buy);
                  $scope.fragments[index].num = buy;
                  $scope.fragments[index].canSub = false;
                  if (newNum > reserve) {
                    toaster.pop('info', '提示', '库存不足');
                    $scope.fragments[index].num = reserve - (reserve % pack);
                    $scope.fragments[index].canAdd = false;
                  }
                } else if (newNum > reserve) {
                  $scope.fragments[index].canSub = true;
                  $scope.fragments[index].canAdd = false;
                  toaster.pop('info', '提示', '库存不足');
                  $scope.fragments[index].num = reserve - (reserve % pack);
                } else {
                  $scope.fragments[index].canSub = true;
                  $scope.fragments[index].canAdd = true;
                  var remainder = newNum % pack;
                  if (remainder !== 0) {
                    toaster.pop('info', '提示', '不支持拆包且包装量为' + pack);
                    var res = (Math.floor(newNum / pack) + 1) * pack;
                    $scope.fragments[index].num = res > reserve
                        ? Math.floor(newNum / pack) * pack : res;
                  } else {
                    $scope.fragments[index].num = newNum;
                  }
                  newNum === buy && ($scope.fragments[index].canSub = false);
                  newNum === reserve
                  && ($scope.fragments[index].canAdd = false);
                }
              }
            }
          }
          $scope.subNum = function (index) {
            if ($scope.fragments[index].canSub) {
              var pack = $scope.goods[index].perQty
                  || $scope.goods[index].minPackQty;
              var newNum = 0;
              if ($scope.goods[index].breakUp) {
                newNum = $scope.fragments[index].num - 1;
              } else {
                newNum = $scope.fragments[index].num - pack;
              }
              $scope.changeNum(newNum, index)
              getFragment($scope.goods[index], $scope.fragments[index]);
              $scope.onInput(index);
            } else {
              toaster.pop('info', '提示', '该商品最少购买' + $scope.goods[index].minBuyQty + '件');
            }
          }
          $scope.addNum = function (index) {
            if ($scope.fragments[index].canAdd) {
              var pack = $scope.goods[index].perQty
                  || $scope.goods[index].minPackQty;
              var newNum = 0;
              if ($scope.goods[index].breakUp) {
                newNum = $scope.fragments[index].num + 1;
              } else {
                newNum = $scope.fragments[index].num + pack;
              }
              $scope.changeNum(newNum, index)
              getFragment($scope.goods[index], $scope.fragments[index]);
              $scope.onInput(index);
            } else {
              toaster.pop('info', '提示', '库存不足');
            }
          }
          $scope.inputNum = function (index) {
            if ((/^[\d]*$/).test($scope.fragments[index].num)) {
              $scope.changeNum($scope.fragments[index].num, index);
              getFragment($scope.goods[index], $scope.fragments[index]);
            } else {
              toaster.pop('info', '提示', '请输入整数');
              $scope.fragments[index].num = $scope.goods[index].minBuyQty;
            }
            $scope.onInput(index);
          }

          $scope.showUseFlag = false;
          $scope.setShowUseFlag = function (flag, offer) {
            $scope.purchaseQuantity = null;
            if (flag) {
              $scope.currentOffer = offer;
            }
            // 如果当前求购数量不为空
            if ($scope.currentSeek.amount) {
              $scope.purchaseQuantity = $scope.currentSeek.amount;
              flag = false;
              $scope.adopt();
            }
            $scope.showUseFlag = flag;
          }

          $scope.selectAmount = 0;
          $scope.selectPrice = 0;
          $scope.onSelectGoods = function (goods, seek, goodsIndex) {
            if (goods.$checked) {
              if (seek.amount) {
                if (seek.amount < $scope.selectAmount
                    + $scope.fragments[goodsIndex].num) {
                  goods.$checked = false;
                  return;
                }
                $scope.selectAmount += $scope.fragments[goodsIndex].num;
              }
              $scope.selectPrice += $scope.fragments[goodsIndex].num
                  * $scope.fragments[goodsIndex].price;
            } else {
              if (seek.amount) {
                $scope.selectAmount -= $scope.fragments[goodsIndex].num;
              }
              $scope.selectPrice -= $scope.fragments[goodsIndex].num
                  * $scope.fragments[goodsIndex].price;
            }
          }

          // 上传Excel批量发布（大量）
          $scope.upload = function() {
            // if(($scope.bomFiles == null) || ($scope.bomFiles.length == 0)) {
            //   return ;
            // }
            var file = angular.element('#uploadCommodity')[0].files[0];
            console.info(file);
            if(!file) {
              toaster.pop('info', '请选择需要上传的文件');
              return;
            }
            $upload.upload({
              url: 'seek/importBom',
              file: file,
              method: 'POST'
            }).success(function(data) {
              if (data.success) {
                window.open("applyPurchase/" + data.data);
              } else {
                toaster.pop('error', data.message);
              }
            }).error(function(response) {
              toaster.pop('error', response.data);
            });
          };

          // 搜索
          $scope.onBomSearch = function () {
            $scope.isSearch = true;
            $scope.bomTableParams.reload();
          }

          $scope.showSimilarCodeList = false;
          $scope.isInCodeList = false;
          $scope.showSimilarBrandList = false;
          $scope.isInBrandList = false;

          $scope.getSimilarCode = function () {
            if ($scope.applyObj.code) {
              Search.getSimilarComponents({keyword : $scope.applyObj.code}, function (data) {
                $scope.similarCode = data || [];
                $scope.setShowSimilarCodeList(data && data.length);
              }, function (error) {
                toaster.pop('error', '系统错误');
              })
            }
          }

          $scope.getSimilarBrand = function () {
            if ($scope.applyObj.brand) {
              Search.getSimilarBrands({keyword : $scope.applyObj.brand}, function (data) {
                $scope.similarBrand = data || [];
                $scope.setShowSimilarBrandList(data && data.length);
              }, function (error) {
                toaster.pop('error', '系统错误');
              })
            }
          }
          
          $scope.setCode = function (code) {
            $scope.applyObj.code = code;
            $scope.setShowSimilarCodeList(false);
          }

          $scope.setShowSimilarCodeList = function (flag) {
            $scope.showSimilarCodeList = flag;
          }

          $scope.setBrand = function (brand) {
            $scope.applyObj.brand = brand;
            $scope.setShowSimilarBrandList(false);
          }

          $scope.setShowSimilarBrandList = function (flag) {
            $scope.showSimilarBrandList = flag;
          }

          $scope.linkBoxIndex = -1;

          $scope.setLinkBoxIndex = function (index) {
            $scope.linkBoxIndex = index;
          }
          });
        }]);
});