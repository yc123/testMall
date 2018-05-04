/**
 * Created by yujia on 2017/3/19.
 *  求购的控制器
 */
define(['app/app'], function (app) {
    'use strict';
    app.register.controller('bomDetailCtrl',
        ['$scope', '$rootScope', 'seekPurchase', 'toaster', 'BaseService',
            'ngTableParams', 'Order', 'SessionService', '$filter', '$upload', '$stateParams', '$http',
            function ($scope, $rootScope, seekPurchase, toaster, BaseService,
                      ngTableParams, Order, SessionService, $filter, $upload, $stateParams, $http) {
                $rootScope.active = 'seek_purchase';
                document.title = '我的求购-优软商城';
                $scope.isEditName = false;

                // BOM名称
                $scope.bomName = '';
              seekPurchase.getSeekUrl({}, function(data) {
                var seekUrl = data.url;
                var getBomInfo = function () {
                  if ($stateParams.id) {
                    $http({
                      method: 'get',
                      dataType: 'json',
                      url: seekUrl + '/inquiry/public/findInquiryById',
                      params: {id: $stateParams.id}
                    }).success(function (data) {
                      $scope.bomInfo = data;
                    }).error(function (response) {
                      toaster.pop('error', response);
                    });
                  }
                }
                getBomInfo();

                $scope.setIsEditName = function (flag) {
                  if (flag) {
                    $scope.bomName = $scope.bomInfo.name;
                  }
                  $scope.isEditName = flag;
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

                $scope.onBomNameChange = function () {
                  if (getRealLen($scope.bomName) > 40) {
                    $scope.bomName = $scope.bomName.substring(
                        0, $scope.bomName.length - 1);
                  }
                }

                $scope.saveBomName = function () {
                  if (!$scope.bomName.length) {
                    toaster.pop('info', 'bom名称不能为空');
                  } else if (getRealLen($scope.bomName) > 40) {
                    toaster.pop('info', 'bom名称不能超过40个字符');
                  } else {
                    seekPurchase.saveBomName(
                        {id: $scope.bomInfo.bomId, name: $scope.bomName},
                        function (data) {
                          if (data.success) {
                            toaster.pop('success', '修改成功');
                            $scope.bomInfo.name = $scope.bomName;
                            $scope.setIsEditName(false);
                          } else {
                            toaster.pop('error', data.message);
                          }
                        }, function (response) {
                          toaster.pop('error', response.data);
                        })
                  }
                }

                var enIdFilter = $filter('EncryptionFilter');

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

                $scope.nowDate = new Date();

                $scope.deadDate = new Date();
                $scope.deadDate.setMonth($scope.deadDate.getMonth() + 3);

                $scope.checkCode = function () {
                  $scope.validObj.code = $scope.applyObj.code
                      && $scope.applyObj.code
                      !== '';
                  return this.validObj.code;
                }
                $scope.checkBrand = function () {
                  $scope.validObj.brand = $scope.applyObj.brand
                      && $scope.applyObj.brand !== '';
                  return $scope.validObj.brand;
                }
                $scope.checkUnitPrice = function () {
                  $scope.validObj.unitPrice = ($scope.applyObj.unitPrice === ''
                      || !$scope.applyObj.unitPrice ) ? true
                      : $scope.applyObj.unitPrice > 0
                      && $scope.applyObj.unitPrice
                      < 100000000;
                  return $scope.validObj.unitPrice;
                }
                $scope.onUnitPriceInput = function () {
                  var price = $scope.applyObj.unitPrice;
                  if (angular.isNumber(price)) {
                    if (price >= 10000) {
                      $scope.applyObj.unitPrice = Number(
                          price.toString().substring(0, 4));
                    } else if (price.toString().indexOf('.') > -1) {
                      var arr = price.toString().split(".");
                      if (arr[0].length > 4) {
                        $scope.applyObj.unitPrice = Number(arr[0].substring(0,
                            4) + '.' + arr[1]);
                      } else if (arr[1].length > 6) {
                        $scope.applyObj.unitPrice = Number(arr[0] + '.'
                            + arr[1].substring(0, 6));
                      }
                    }
                  }
                }
                $scope.onEncapsulationChange = function () {
                  if ($scope.applyObj.encapsulation && getRealLen(
                          $scope.applyObj.encapsulation) > 20) {
                    $scope.applyObj.encapsulation = $scope.applyObj.encapsulation.substring(
                        0, $scope.applyObj.encapsulation.length - 1)
                  }
                }
                $scope.onCodeChange = function () {
                  if ($scope.applyObj.code && getRealLen($scope.applyObj.code)
                      > 30) {
                    $scope.applyObj.code = $scope.applyObj.code.substring(
                        0, $scope.applyObj.code.length - 1)
                  }
                }
                $scope.onBrandChange = function () {
                  if ($scope.applyObj.brand && getRealLen($scope.applyObj.brand)
                      > 20) {
                    $scope.applyObj.brand = $scope.applyObj.brand.substring(
                        0, $scope.applyObj.brand.length - 1)
                  }
                }
                $scope.onProduceDateChange = function () {
                  if ($scope.applyObj.produceDate && getRealLen(
                          $scope.applyObj.produceDate) > 12) {
                    $scope.applyObj.produceDate = $scope.applyObj.produceDate.substring(
                        0, $scope.applyObj.produceDate.length - 1)
                  }
                }
                $scope.checkAmount = function () {
                  $scope.validObj.amount = $scope.applyObj.amount === '' ? true
                      : $scope.applyObj.amount > 0 && $scope.applyObj.amount
                      < 100000000;
                  return $scope.validObj.amount;
                }
                $scope.checkAll = function () {
                  return $scope.checkCode() && $scope.checkBrand()
                      && $scope.checkUnitPrice() && $scope.checkAmount()
                      && $scope.checkDeadline();
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
                  if (go.minBuyQty > 0) {
                    // 1、生成订单
                    Order.buyNowInStore({spId: $scope.currentSeek.spId},
                        goodsList, function (data) {
                          if (data.message) {
                            toaster.pop('info', data.message);
                          }
                          // 控制订单确认页，直接购买不显示进度条
                          SessionService.set("buyNow", true);
                          // 2、跳转到订单确认页面，进行付款操作
                          window.open(rootPath + '/user#/order/pay/'
                              + enIdFilter(data.data.orderid));
                        }, function (res) {
                          toaster.pop('error', '警告', res.data);
                        });
                  } else {
                    toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
                  }
                }

                // 买家求购列表
                $scope.searchStatus = 0;
                $scope.seekPurchaseTableParams = new ngTableParams({
                  page: 1,
                  count: 10
                }, {
                  total: 0,
                  getData: function ($defer, params) {
                    const param = BaseService.parseParams(params.url());
                    // param.isMallGoods = $scope.isMallGoods;
                    // param.deadline = $scope.deadline;
                    // param.keyWord = $scope.keyWord;
                    // param.status = $scope.searchStatus;
                    param.id = $stateParams.id;
                    // param.minReleaseDate = $scope.startDate
                    //     ? $scope.startDate.getTime() : null;
                    // param.maxReleaseDate = $scope.endDate ? $scope.endDate.getTime()
                    //     : null;
                    if ($scope.isSearch) {
                      param.page = 1;
                      params.page(1);
                      $scope.isSearch = false;
                    }
                    $http({
                      method: 'get',
                      dataType: 'json',
                      url: seekUrl + '/inquiry/sale/publicInquiry/detail',
                      params: param
                    }).success(function (data) {
                      params.total(data.totalElements);
                      $defer.resolve(data.content);
                      $scope.seekListData = data;
                    }).error(function (response) {
                      toaster.pop('error', response);
                    });
                  }
                });

                // 搜索
                $scope.onSearch = function (searchStatus) {
                  $scope.isSearch = true;
                  if (searchStatus) {
                    $scope.searchStatus = searchStatus;
                  }
                  $scope.seekPurchaseTableParams.reload();
                }

                // 采纳报价
                $scope.adopt = function () {
                  if (!$scope.purchaseQuantity) {
                    toaster.pop('error', "请输入正确的采购数量");
                    return;
                  }
                  seekPurchase.updateSeekPurchaseStatus({
                    spId: $scope.currentOffer.spId,
                    ofId: $scope.currentOffer.id,
                    purchaseQuantity: $scope.purchaseQuantity
                  }, {}, function (data) {
                    if (data.success) {
                      $scope.currentOffer = null;
                      $scope.seekPurchaseTableParams.reload();
                      $scope.showUseFlag = false;
                      toaster.pop('success', '采纳报价成功');
                    } else {
                      toaster.pop('error', data.message);
                    }
                  }, function (response) {
                    toaster.pop('error', response.data);
                  });
                }

                $scope.offerCount = 0;
                $scope.goodsCount = 0;
                $scope.currentSeek = {};
                $scope.setSeekStatus = function (seek, status) {
                  $scope.offerCount = seek.offerAmount || 0;
                  $scope.goodsCount = seek.goodsAmount || 0;
                  $scope.currentSeek = seek;
                  // 查看报价
                  if (status == 2 && $scope.offerCount != 0) {
                    seekPurchase.getSeekPurchaseOfferPageInfo(
                        {count: 100, page: 1, spId: seek.spId},
                        function (data) {
                          $scope.offer = data.content;
                          clearSeekStatus();
                          seek.$status = status;
                        });
                  } else if (status == 1 && $scope.goodsCount != 0) {// 查看现货
                    seekPurchase.getMallGoodsList({spId: seek.spId},
                        function (data) {
                          $scope.goods = data;
                          clearSeekStatus();
                          initFragments();
                          seek.$status = status;
                        });
                  } else if (status == 0) { // 收起
                    seek.$status = status;
                  }
                  $scope.selectAmount = 0;
                  $scope.selectPrice = 0;
                }

                var clearSeekStatus = function () {
                  angular.forEach($scope.seekListData.content, function (item) {
                    item.$status = 0;
                  })
                }

                $scope.condition = {
                  endDateOpen: false,
                  startDateOpen: false,
                  deadlineOpen: false
                };
                // 打开日期选择框
                $scope.openDatePicker = function ($event, item, openParam,
                    status) {
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
                  if ($scope.endDate !== null && $scope.startDate
                      > $scope.endDate) {
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
                  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':'
                      + sec;
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
                    angular.forEach($scope.seekListData.content,
                        function (item) {
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
                        newNum === buy
                        && ($scope.fragments[index].canSub = false);
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
                          $scope.fragments[index].num = reserve - (reserve
                              % pack);
                          $scope.fragments[index].canAdd = false;
                        }
                      } else if (newNum > reserve) {
                        $scope.fragments[index].canSub = true;
                        $scope.fragments[index].canAdd = false;
                        toaster.pop('info', '提示', '库存不足');
                        $scope.fragments[index].num = reserve - (reserve
                            % pack);
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
                        newNum === buy
                        && ($scope.fragments[index].canSub = false);
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
                    toaster.pop('info', '提示', '该商品最少购买'
                        + $scope.goods[index].minBuyQty + '件');
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
                $scope.upload = function () {
                  // if(($scope.bomFiles == null) || ($scope.bomFiles.length == 0)) {
                  //   return ;
                  // }
                  var file = angular.element('#uploadCommodity')[0].files[0];
                  console.info(file);
                  if (!file) {
                    toaster.pop('info', '请选择需要上传的文件');
                    return;
                  }
                  $upload.upload({
                    url: 'seek/importBom',
                    file: file,
                    method: 'POST'
                  }).success(function (data) {
                    window.open("http://10.1.51.90:3000/applyPurchase/"
                        + data.data);
                  }).error(function (response) {
                  });
                };

                $scope.bomTableParams = new ngTableParams({
                  page: 1,
                  count: 10
                }, {
                  total: 0,
                  getData: function ($defer, params) {
                    const param = BaseService.parseParams(params.url());
                    seekPurchase.getSeekPurchaseBomListPage(param,
                        function (data) {
                          params.total(data.totalElements);
                          $scope.bomTotal = data.totalElements;
                          $defer.resolve(data.content);
                        }, function (response) {
                          toaster.pop('error', response.data);
                        });
                  }
                });
              });
            }]);
});