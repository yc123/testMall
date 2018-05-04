/**
 * Created by yujia on 2017/7/11.
 *
 */
define(['app/app'], function (app) {
    'use strict';
    app.register.controller('vendor_standardPutOnCtrl', ['$scope', '$rootScope', 'StandardPutOnAdminService', 'ngTableParams', 'BaseService', 'toaster', 'Enterprise', '$q', 'Loading', '$modal', 'ConsignmentAgreementRecord', function ($scope, $rootScope, StandardPutOnAdminService, ngTableParams, BaseService, toaster, Enterprise, $q, Loading, $modal, ConsignmentAgreementRecord) {
        $rootScope.active = 'vendor_goods';
        $scope.keyword = '';
        $scope.tab = 'vendor_standardPutOn';

        $scope.$$putOn = {};

        $scope.canSubmit = true;

        //判断是否是店铺信息
        var initSelfSale = function () {
            $scope.$$putOn.isSelfStore = true;
            Enterprise.getStoreInfo(null, function (data) {
                if(data.code == 1) {
                    $scope.$$putOn.storeInfo = data.data;
                    if($scope.$$putOn.storeInfo) {
                        if(($scope.$$putOn.storeInfo.storeName.indexOf("优软测试二") > -1) && $scope.$$putOn.storeInfo.storeName.indexOf("优软商城") > -1) {
                            $scope.$$putOn.isSelfStore = false;
                        }
                    }else {
                        $scope.$$putOn.isSelfStore = false;
                    }
                }
            }, function (response) {
            });
        };

        initSelfSale();

        $scope.standarPutOnTable = new ngTableParams ({
            page : 1,
            count : 10,
            sorting : {
                id : 'desc'
            }
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                param.keyword = $scope.$$putOn.keyword;
                StandardPutOnAdminService.getProductStandardPutOnInfoByPage(param, function (page) {
                    $scope.$$putOn.totalElements = page.totalElements;
                    if(Number(page.totalElements) > 0) {
                        $scope.$$putOn.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }else {
                        $scope.$$putOn.start = 0;
                    }
                    $scope.$$putOn.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    params.total(page.totalElements);
                    angular.forEach(page.content, function (info) {
                        // TODO 设置默认商品销售方式
                        if(typeof info.selfSale == 'undefined') {
                            info.selfSale = $scope.$$putOn.isSelfStore;
                        }
                        if(!info.minPackQty) {
                            info.minPackQty = 1;
                        }
                        if(!info.minBuyQty) {
                            info.minBuyQty = info.minPackQty;
                        }
                    });
                    $defer.resolve(page.content);

                    initCurrency();
                }, function () {
                });
            }
        });

        //获取币别信息
        var initCurrency = function () {
            Enterprise.getCurrencyByRegisterAddress(null, function (data) {
                if(data.code == 1) {
                    $scope.$$putOn.currency = data.data;
                    var arr = $scope.standarPutOnTable.data;
                    angular.forEach(arr, function (info) {
                        if(!info.currency) {
                            info.currency =  $scope.$$putOn.currency;
                        }
                    });
                }else {
                    toaster.pop('warning', '提示', data.message);
                }
            }, function (response) {
                console.log(response);
            });
        }


        /**
         * 编辑信息
         * @param standard
         */
        $scope.edit = function (standard) {
            var arr = $scope.standarPutOnTable.data;
            for(var i = 0; i < arr.length; i++) {
                if(arr[i].id != standard.id) {
                    arr[i].isEditStatus = false;
                }
            }
            standard.isEditStatus = true;
            initEdit(standard);
        }

        var initEdit = function (standard) {
            standard.editImg = standard.img;
            standard.editMinDelivery = standard.minDelivery;
            standard.editMaxDelivery = standard.maxDelivery;
            standard.editMinBuyQty = standard.minBuyQty;
            standard.editQtyPrices = angular.copy(standard.qtyPrices);
            standard.editIsSelfSale = !standard.selfSale ? false : true;
            standard.editSelfSaleNum = standard.editIsSelfSale ? 0 : 1;
            standard.editLockQty = standard.lockQty;
            standard.editAvailableOnSale = standard.availableOnSale;
            standard.editOnSaleQty = standard.onSaleQty;
            standard.insertQty = null;
            $scope.changeFragment(standard);
        };

        $scope.cancle = function (standard) {
            standard.isEditStatus = false;
        }

        /**
         * 获取数据的最大值
         * @param number1
         * @param number2
         * @returns {*}
         */
        var getMaxNumber = function(number1, number2) {
            if(!number1 && !number2) {
                return 1;
            }
            if(!number1 || !number2) {
                return !number1 ? number2 : number1;
            }
            return number1 > number2 ? number1 : number2;
        };

        /**
         * 修改最小起订量
         */
        $scope.validMinBuyQty = function (standard) {
            if(!standard.editMinBuyQty) {
                return ;
            };
            if(isNaN(standard.editMinBuyQty)) {
                standard.editMinBuyQty = standard.minPackQty;
                toaster.pop('warning','提示', '最小的起订量只能是数字');
            }
            if(Number(standard.editMinBuyQty) <=0) {
                standard.editMinBuyQty = standard.minPackQty;
                toaster.pop('warning','提示', '最小的起订量只能是大于0的数');
            }
            if((Number(standard.editMinBuyQty) % Number(standard.minPackQty)) != 0) {
                var i = Math.floor(Number(standard.editMinBuyQty) / Number(standard.minPackQty));
                i = (i  == 0 ? 1 : i);
                standard.editMinBuyQty = (i * standard.minPackQty);
                toaster.pop('warning','提示', '起订量必须是包装数的倍数');
            }

            $scope.changeFragment(standard);
        };

        /**
         * 修改了分段的信息
         * @param standard
         */
        $scope.changeFragment = function(standard) {
            standard.editAvailableOnSale = !standard.editAvailableOnSale ? 0 : standard.editAvailableOnSale;
            standard.editOnSaleQty = !standard.editOnSaleQty ? 0 : standard.editOnSaleQty;
            var toBeSale = Number(standard.editAvailableOnSale) + Number(standard.editOnSaleQty);
            var maxEnd = Number(getMaxNumber(toBeSale, standard.editMinBuyQty));
            if(!standard.editQtyPrices || standard.editQtyPrices.length == 0) {
                standard.editQtyPrices = [];
                var obj = {
                    start : 1,
                    end : getMaxNumber(toBeSale, standard.editMinBuyQty),
                    rMBPrice : null,
                    uSDPrice : null
                }
                standard.editQtyPrices.push(obj);
            }else {
                var lastStart =  Number(standard.editQtyPrices[standard.editQtyPrices.length - 1].start);
                standard.editQtyPrices[standard.editQtyPrices.length - 1].end = maxEnd > lastStart ? maxEnd : standard.editQtyPrices[standard.editQtyPrices.length - 1].end;
            }
        };

        /**
         * 根据数量增加一个分段
         */
        $scope.addFragment = function (standard) {
            if(!standard.insertQty) {
                toaster.pop('warning', '提示', '请输入插入的分段');
                return ;
            }
            var fragmentPrices = standard.editQtyPrices;
            if(fragmentPrices.length > 2) {
                toaster.pop('warning', '提示', '分段数不能超过三个');
                return ;
            }
            if(isNaN(standard.insertQty)) {
                toaster.pop('warning', '提示', '输入的分段数量中包含了不是数字的字符');
                return ;
            }

            var qty = Number(standard.insertQty);
            if(qty <= fragmentPrices[0].start) {
                toaster.pop('warning', '提示', '输入的分段数量小于等于了第一个分段的起始值');
                return ;
            }
            if(qty >= fragmentPrices[fragmentPrices.length - 1].end) {
                toaster.pop('warning', '提示', '输入的分段数量大于等于了最后一个分段的起始值');
                return ;
            }
            for(var i = 0; i< fragmentPrices.length; i++) {
                var price = fragmentPrices[i];
                if(qty == price.start) {
                    toaster.pop('warning', '提示', '输入的分段数量等于第'+ (i+1)+'分段的起始值');
                    return ;
                }else if(qty == price.end) {
                    toaster.pop('warning', '提示', '输入的分段数量等于第'+ (i+1)+'分段的结束值');
                    return ;
                }else if(qty < price.end) {
                    var end = price.end;
                    price.end = qty -1;
                    var obj = {start : qty, end : end, rMBPrice : null, uSDPrice : null};
                    standard.editQtyPrices.splice(i + 1 , 0 , obj);
                    standard.insertQty = null;
                    return ;
                }
            }
        };

        /**
         * 删除对应的分段.
         * @param commodity
         */
        $scope.deleteFragment = function(standard, index) {
            if(index > -1 && index < standard.editQtyPrices.length) {
                if(standard.editQtyPrices.length < 2) {
                    toaster.pop('warning', "提示", "批次至少需要一个分段");
                    return ;
                }
                if(index < standard.editQtyPrices.length - 1) { //不是最后一个分段
                    var price = standard.editQtyPrices.splice(index, 1);
                    standard.editQtyPrices[index].start = price[0].start;
                }else if(index == standard.editQtyPrices.length - 1) { //如果删除的是最后一个分段，
                    var price = standard.editQtyPrices.splice(index, 1);
                    standard.editQtyPrices[index -1].end = price[0].end;
                }
            };
            if(standard.editQtyPrices.length == 1) {
                $scope.changeFragment(standard);
            }
        };

        /**
         * 改变锁库数
         * @param standard
         */
        $scope.blurLockQty = function (standard) {
            if(!standard.editLockQty) {
				$scope.canSubmit = true;
                return ;
            }
            if(isNaN(standard.editLockQty)) {
                toaster.pop('warning', '提示', '锁库数只能是数字');
				$scope.canSubmit = false;
                return ;
            }
            if(Number(standard.editLockQty) < 0) {
                toaster.pop('warning', '提示', '锁库数必须是大于等于0');
				$scope.canSubmit = false;
                return ;
            }
            if(Number(standard.repositoryQty) < Number(standard.editLockQty)) {
                toaster.pop('warning', '提示', '锁库数大于了总库存数');
				$scope.canSubmit = false;
				return ;
            }
            standard.lockQty = !standard.lockQty ? 0 : standard.lockQty;
            standard.editLockQty =!standard.editLockQty ? 0 : standard.editLockQty;
            standard.onSaleQty = !standard.onSaleQty ? 0 : standard.onSaleQty;
            standard.availableOnSale = !standard.availableOnSale ? 0 : standard.availableOnSale;
            var onSale = Number(standard.onSaleQty) + Number(standard.availableOnSale);
            var minus = Number(standard.editLockQty)  - Number(standard.lockQty);
            if(minus > onSale) {
                toaster.pop('warning', '提示', '新增锁库数不能超过可用库存');
				$scope.canSubmit = false;
				return ;

				/*standard.editLockQty = onSale + standard.lockQty;
				standard.editAvailableOnSale = 0;
				standard.editOnSaleQty = 0;*/
            }else {
				$scope.canSubmit = true;
                standard.editOnSaleQty = Number(standard.onSaleQty) - minus;
                if(standard.editOnSaleQty < 1) {
                    standard.editAvailableOnSale = standard.editOnSaleQty + standard.availableOnSale;
                    standard.editOnSaleQty = 0;
                }else {
                    standard.editAvailableOnSale =  standard.availableOnSale;
                }
            }
            $scope.changeFragment(standard);
        };

        /**
         * 用户更新库存信息上架库存信息
         * @param standard
         * @param index
         */
        $scope.putOn = function (standard, index) {

			//验证库存信息
			if(!$scope.checkGoodsInfo(standard)) {
				return ;
			}
            productStandardPutOnInfoPutOn(standard, index);
            /*// 如果没有开启店铺，第一次寄售时则弹出寄售协议
            if (!$scope.$$putOn.isSelfStore) {
				ConsignmentAgreementRecord.findRecordOfUser({}, {}, function (record) {
					if (!record.id) {
						// 弹出寄售协议弹窗
						$modal.open({
							templateUrl : 'static/view/vendor/modal/confirm_consignment_agreement.html',
							controller : 'ConfirmConsignmentAgreement'
						}).result.then(function(){
							productStandardPutOnInfoPutOn(standard, index);
							// toaster.pop('success', '操作成功');
						}, function(){
							toaster.pop('success', '请签订寄售协议');
						});
					} else {
						productStandardPutOnInfoPutOn(standard, index);
                    }
				}, function (error) {
					console.log(error);
					toaster.pop('error', '系统异常，请联系管理员寻求帮助');
				});
            } else {
				productStandardPutOnInfoPutOn(standard, index);
            }*/
        };

        function productStandardPutOnInfoPutOn(standard, index) {

			StandardPutOnAdminService.productStandardPutOnInfoPutOn(null, standard, function(data){
				if(data.code == 1) {
					toaster.pop('success', '上架成功');
					$scope.standarPutOnTable.data.splice(index, 1, data.data);
				}else {
					toaster.pop('warning', '失败', data.message);
				}
			}, function(response){
				toaster.pop('error', '修改失败', response.data);
			});
		}

        /**
         * 用户更新库存信息
         * @param standard
         * @param index
         */
        $scope.updateInfo = function (standard, index) {
			//验证库存信息
			if(!$scope.checkGoodsInfo(standard)) {
			    console.log('AVSSC');
				return ;
			}
			updateProductStandardPutOnInfo(standard, index);

			// 如果没有开启店铺，第一次寄售时则弹出寄售协议
			/*if (!$scope.$$putOn.isSelfStore) {
				ConsignmentAgreementRecord.findRecordOfUser({}, {}, function (record) {
					if (!record.id) {
						// 弹出寄售协议弹窗
						$modal.open({
							templateUrl : 'static/view/vendor/modal/confirm_consignment_agreement.html',
							controller : 'ConfirmConsignmentAgreement'
						}).result.then(function(){
							updateProductStandardPutOnInfo(standard, index);
							// toaster.pop('success', '操作成功');
						}, function(){
							toaster.pop('success', '请签订寄售协议');
						});
					} else {
						updateProductStandardPutOnInfo(standard, index);
                    }
				}, function (error) {
					console.log(error);
					toaster.pop('error', '系统异常，请联系管理员寻求帮助');
				});
			} else {
				updateProductStandardPutOnInfo(standard, index);
			}*/
        };

        function updateProductStandardPutOnInfo(standard, index) {
			StandardPutOnAdminService.updateProductStandardPutOnInfo(null, standard, function(data){
				if(data.code == 1) {
					toaster.pop('success', '标准上架信息更新成功');
					$scope.standarPutOnTable.data.splice(index, 1, data.data);
				}else {
					toaster.pop('warning', '失败', data.message);
				}
			}, function(response){
				toaster.pop('error', '修改失败', response.data);
			});
		}

        /**
         * 改变销售方式
         */
        $scope.changeSale = function (standard) {
            standard.editIsSelfSale = standard.editSelfSaleNum == 0;

            /*if (!standard.editIsSelfSale) {
				checkAndShowConsignmentAgreement(standard);
            }*/
        };

		/**
         * 检查是否签订寄售协议，否则弹出寄售协议弹框
         *
		 * @param standard  标准产品信息
		 */
		function checkAndShowConsignmentAgreement(standard) {
			ConsignmentAgreementRecord.findRecordOfUser({}, {}, function (record) {
				if (!record.id) {
					// 弹出寄售协议弹窗
					$modal.open({
						templateUrl : 'static/view/vendor/modal/confirm_consignment_agreement.html',
						controller : 'ConfirmConsignmentAgreement'
					}).result.then(function(){
						toaster.pop('success', '操作成功');
					}, function(){
						standard.editSelfSaleNum = 0;
						standard.editIsSelfSale = standard.editSelfSaleNum === 0;
					});
				}
			}, function (error) {
				console.log(error);
				toaster.pop('error', '系统异常，请联系管理员寻求帮助');
			});
		}

        /**
         * 搜索的方法
         */
        $scope.onSearch = function () {
            $scope.standarPutOnTable.page(1);
            $scope.standarPutOnTable.reload();
        };

        /**
         * 删除标准上架的图片
         * @param standard
         */
        $scope.deleteStandardImg = function (standard) {
            if(standard.editImg) {
                $modal.open({
                    templateUrl : 'static/view/common/modal/delete_modal.html',
                    controller : 'deleStandardImg'
                }).result.then(function(address){
                    standard.editImg = null;
                    toaster.pop('success', '删除成功');
                }, function(){
                    toaster.pop('info', '提示 ' + '您已取消删除图片');
                });
            }
        };

        /**
         * 修改上架信息的图片
         * @param standard
         */
        $scope.modifyImg = function (img, standard) {
            var modalInstance = $modal.open({
                templateUrl : 'static/view/vendor/modal/edit_goods_modal.html',
                size : 'md',
                controller : 'editPictureCtrl',
                resolve : {
                    pic : function() {
                        return img;
                    }
                }
            });
            modalInstance.result.then(function (editPic) {
                standard.editImg = editPic;
            }, function() {

            });
        }


        /**
         * 	验证库存信息的正确性,
         * @param goods 需要验证的GOODS信息
         * @returns {boolean}
         * 返回false 代表验证不通过。
         * 返回true  代表验证成功。
         */
        $scope.checkGoodsInfo = function (standard) {
            var result = false;
            if(!standard) {
                toaster.pop('warning', '信息丢失，请重新操作');
                return result;
            }
            if(!$scope.compareNum(standard.editMinDelivery, standard.editMaxDelivery)) {
                return result;
            }
            if(!standard.editMinBuyQty) {
                toaster.pop('warning', '请填写起订量');
                return result;
            }
            if(isNaN(standard.editMinBuyQty)) {
                toaster.pop('warning', '最小起订必须是数字');
                return result;
            }
            if(standard.editMinBuyQty % standard.minPackQty != 0) {
                toaster.pop('warning', '起订量必须是倍数的整数倍');
                return result;
            }
            if(!changeQtyPrice(standard)) {
                return result;
            }
            if(standard.editLockQty && isNaN(standard.editLockQty)) {
                toaster.pop('warning', '提示', '锁库数只能是数字');
                return result;
            }
            if(Number(standard.editLockQty) < 0) {
                toaster.pop('warning', '提示', '锁库数必须是大于等于0');
                return result;
            }
            if(Number(standard.repositoryQty) < Number(standard.editLockQty)) {
                toaster.pop('warning', '提示', '锁库数大于了总库存数');
                return result;
            }
            return true;
        };

        /**
         * @param commodity 需要验证的批次的信息
         * @returns {boolean}
         */
        var changeQtyPrice = function(standard) {
            var result = false;
            var lastEnd = -1;
            var fragments = standard.editQtyPrices;
            for (var i = 0; i < fragments.length; i++) {
                if(isNaN(fragments[i].start)) {
                    toaster.pop('warning', '第' +(i + 1)+'个分段的起始值必须是数字');
                    return result;
                }
                if(Number(fragments[i].start) <= lastEnd) {
                    toaster.pop('warning', "存在分段的起始值小于等于上一个分段的结束值");
                    return result;
                }
                if(isNaN(fragments[i].end)) {
                    toaster.pop('warning', '第' +(i + 1)+'个分段的结束值必须是数字');
                    return result;
                }
                if(Number(fragments[i].start) >= Number(fragments[i].end)) {
                    toaster.pop('warning', '第' +(i + 1)+'个分段的起始值大于等于分段的结束值');
                    return result;
                }

                if(!$scope.$$putOn.currency) {
                    toaster.pop('warning', '该公司的注册地址为空，不能确定币别信息，请完善注册地址信息');
                    return result;
                }
                //目前系统中存在双币别，与现有的逻辑冲突，暂时先用企业地址确定币别
                if($scope.$$putOn.currency.indexOf('USD') > -1) {
                    if(!fragments[i].uSDPrice) {
                        toaster.pop('warning', '第' +(i + 1)+'个分段的单价($)为空，请填写后再次提交！');
                        return result;
                    }else if(isNaN(fragments[i].uSDPrice)){
                        toaster.pop('warning', '第' +(i + 1)+'个分段的单价($)信息必须是数字');
                        return result;
                    }else if(Number(fragments[i].uSDPrice) < 0) {
                        toaster.pop('warning', '第' +(i + 1)+'个分段的单价($)信息必须是大于零的数字');
                        return result;
                    }
                }
                if($scope.$$putOn.currency.indexOf('RMB') > -1) {
                    if(!fragments[i].rMBPrice) {
                        toaster.pop('warning', '第' +(i + 1)+'个分段的单价(￥)为空，请填写后再次提交！');
                        return result;
                    }else if(isNaN(fragments[i].rMBPrice)){
                        toaster.pop('warning', '第' +(i + 1)+'个分段的单价(￥)信息必须是数字');
                        return result;
                    }else if(Number(fragments[i].rMBPrice) < 0) {
                        toaster.pop('warning', '第' +(i + 1)+'个分段的单价(￥)信息必须是大于零的数字');
                        return result;
                    }
                }
            }

            return true;
        };

        /**
         * 验证是否合理
         * @param num 需要验证的数据
         * @param price 当前的分段
         * @param isRMB 是否是人民币
         */
        $scope.validPrice = function (price, num ,isRMB) {
            if(!num) {
               return ;
            }else if(isNaN(num)){
                toaster.pop('warning', '价格的信息必须只能包含数字');
                if(isRMB) {
                    price.rMBPrice = null;
                }else {
                    price.uSDPrice = null;
                }
                return ;
            }else if(Number(num) <= 0) {
                toaster.pop('warning', '价格的信息必须是大于零的数字');
                if(isRMB) {
                    price.rMBPrice = null;
                }else {
                    price.uSDPrice = null;
                }
                return ;
            }
        };

        /**
         * 比较交货周期的大小
         * @param min 本来是最小值
         * @param max 本来是最大值
         * @param standard 批次信息
         * @returns {boolean} true 表示验证通过，false 表示验证失败。
         */
        $scope.compareNum = function(min, max) {
            if(!min || !max) {
                toaster.pop('warning', '交期存在空值，请填写对应的信息');
                return false;
            }
            if(isNaN(min)) {
                toaster.pop('warning', '最小交期必须是数字');
                return false;
            }
            if(isNaN(max)) {
                toaster.pop('warning', '最大交期必须是数字');
                return false;
            }
            if(Number(min) < 1 || Number(max) < 1) {
                toaster.pop('warning', '交期的时间必须大于0');
                return false;
            }
            if(Number(min) > Number(max)) {
                toaster.pop('warning', '最短交期必须小于等于最大交期');
                return false;
            }
            return true;
        };


        /**
         * @param min 最小值
         * @param max 最大值
         * @param isMin 传入的是否是最小值
         */
        $scope.blurDelivery = function(min, max, isMin, standard) {
            var day = -1;
            if(isMin) {
                if(min && !isNaN(min)) {
                    day = min;
                }else {
                    if(!min) {
                        return ;
                    }else {
                        if(isMin) {
                            standard.editMinDelivery = null;
                        }else {
                            standard.editMaxDelivery = null;
                        }
                        toaster.pop('warning', '提示', '交期必须为大于0数字');
                        return ;
                    }
                }

            }else {
                if(max && !isNaN(max)) {
                    day = max;
                }else {
                    if(!max) {
                        return
                    }else {
                        if(isMin) {
                            standard.editMinDelivery = null;
                        }else {
                            standard.editMaxDelivery = null;
                        }
                        toaster.pop('warning', '提示', '交期必须为大于0数字');
                        return ;
                    }
                }
            }
            if(Number(day) < 1) {
                if(isMin) {
                    standard.editMinDelivery = null;
                }else {
                    standard.editMaxDelivery = null;
                }
                toaster.pop('warning', '提示', '交期必须为大于0数字');
                return ;
            }
            if((min && !isNaN(min)) && (max && !isNaN(max))) {
                if(Number(min) > Number(max)) {
                    toaster.pop('warning', '提示', '最小交期必须小于最大交期');
                    return ;
                }
            }
        };

        $scope.updatePrice = function () {
            StandardPutOnAdminService.updateQtyPrice({},{},function (data) {

            })
        };

        /**
         * 一键更新
         */
        $scope.batchUpdate = function () {
            StandardPutOnAdminService.updateProductStandardPutOnInfoByBatch(null, null, function (data) {
                if(data.code == 1) {
                    $scope.standarPutOnTable.page(1);
                    $scope.standarPutOnTable.reload();
                    if(!data.data) {
                        toaster.pop('success', '没有数据可以更新');
                    }else {
                        toaster.pop('success', '成功更新' + data.data + "条");
                    }
                }else {
                    toaster.pop('warning', '提示', data.message);
                }
            }, function (response) {
                toaster.pop('error', '对不起，系统出错，试试刷新界面');
            });
        };

        /**
         * 导出数据
         */
        $scope.downGoods = function () {
            if ($scope.$$putOn.totalElements == 0) {
                return;
            }
            downloadByJs('trade/prodStandPutOnInfo/download/standardPutOn', $scope.$$putOn.keyword);
        }

        function downloadByJs(url, keyword) {
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'POST');
            form.attr('action', url + "?keyword=" + (keyword || ''));

            $('body').append(form);  //将表单放置在web中
            form.submit();
            $scope.$$putOn.clockID = setInterval(function() {
                getDownLoadStatus(keyword)
            }, 500);
        };

        var getDownLoadStatus = function (keyword) {
            Loading.show();
            $.ajax({
                url : 'trade/prodStandPutOnInfo/download/standardPutOn',
                data : {isAjax : true, keyword : (keyword || '')},
                method : 'POST',
                dataType : 'json',
                success : function (data) {
                    if(!data.loading){
                        $scope.$apply(function () {
                            toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                            Loading.hide();
                        });
                        if($scope.$$putOn.clockID) {
                            clearInterval($scope.$$putOn.clockID);
                        }
                    }
                },
                error : function () {
                    Loading.hide();
                    if($scope.$$putOn.clockID) {
                        clearInterval($scope.$$putOn.clockID);
                    }
                }
            });
        };
    }]);

    app.register.controller('deleStandardImg', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        /**
         * 取消删除
         */
        $scope.cancleDelete = function () {
            $modalInstance.dismiss();
        }

        /**
         * 确认删除
         */
        $scope.confirmDelete= function () {
            $modalInstance.close();
        }
    }]);

	/**
     * 店铺寄售协议确认弹框
	 */
	app.register.controller('ConfirmConsignmentAgreement', ['$scope', '$modalInstance', 'ConsignmentAgreementRecord', 'toaster', function ($scope, $modalInstance, ConsignmentAgreementRecord, toaster) {

	    $scope.agreement = false;
	    $scope.article = '';

	    ConsignmentAgreementRecord.obtainAConsignmentAgreement({}, {}, function (data) {
	        if (data && data.article) {
	            $scope.article = data.article;
            }
            console.log(data);
		}, function (error) {
            console.log(error);
		});

		/**
         * 确认操作
		 */
		$scope.confirm = function () {
			ConsignmentAgreementRecord.saveRecordWhenUserAgree({}, {agreement: $scope.agreement}, function (result) {
                if (result.success) {
					$modalInstance.close();
                } else {
					console.log(result.message);
					toaster.pop('error', '用户信息异常，请联系管理员寻求帮助');
                }
			}, function (error) {
                console.log(error);
				toaster.pop('error', '系统异常，请联系管理员寻求帮助');
			});
		};

		/**
         * 取消操作
		 */
		$scope.cancel = function () {
            $modalInstance.dismiss();
		};
	}]);
});
