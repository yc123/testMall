define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendorDeliveryRuleAddCtrl', ['$scope', '$rootScope', '$stateParams', 'Enterprise', 'toaster', 'DistributionRule', '$state', '$http', 'TreeData', function ($scope, $rootScope, $stateParams, Enterprise, toaster, DistributionRule, $state, $http, TreeData) {
        $rootScope.active = 'vendor_deliveryRule';
        // $scope.tab = 'deliverRule';
        $scope.title = '新增配送规则';

        var initData = function () {
            if ($stateParams.rule){
                $scope.rule = angular.fromJson($stateParams.rule);
                $scope.isModify = true;
                $scope.isActive = $scope.rule.active == 1;
                $scope.fareArray = angular.fromJson($scope.rule.fares);
                if ($scope.rule.orderType){
                    var orderTypeArray = $scope.rule.orderType.split("-");
                    $scope.orderType = {
                        normal : false,
                        preSale : false,
                        bill : false
                    };

                    angular.forEach(orderTypeArray, function (data) {
                        if (data == 1201){
                            $scope.orderType.normal = true;
                        }else if(data == 1202){
                            $scope.orderType.preSale = true;
                        }else if(data == 1203){
                            $scope.orderType.bill = true;
                        }
                    })
                }
                //TODO 获取地区的JSON字符串，需要转换成有用的数据--需要改善
                if ($scope.rule.areas){
                    var data = angular.fromJson($scope.rule.areas);
                    $scope.mapArray = data;
                    $scope.qtyAreaArray = [];
                    angular.forEach(data, function (item) {
                        if (item.province){
                            $scope.qtyAreaArray.push(item.province);
                        }
                        if (item.city){
                            $scope.qtyAreaArray.push(item.city);
                        }
                        if (item.area){
                            $scope.qtyAreaArray.push(item.area);
                        }
                    });
                }
            }else {
                $scope.isModify = false;
                $scope.rule = {};
                $scope.isActive = true;
                $scope.rule.fareType = 1;
                $scope.rule.userType = 1301;
                $scope.orderType = {
                    normal : true,
                    preSale : true,
                    bill : false
                };
                Enterprise.getCurrencyByRegisterAddress({}, {} ,function (data) {
                    if (data){
                        $scope.rule.currencyName = data.data;
                    }
                }, function (error) {
                    toaster.pop('error', "获取企业币别信息失败");
                });

                DistributionRule.findCountOfRule({}, {}, function (data) {
                    if (data){
                        var num = data.data;
                        $scope.rule.num = num + 1;
                    }
                });

                $scope.fareArray = [];
                var firstFare = {
                    start : 0,
                    end : 0,
                    fare : 0
                };
                var secondFare = {
                    start : 0,
                    end : 0,
                    fare : 0
                };
                $scope.fareArray.push(firstFare);
                $scope.fareArray.push(secondFare);
            }
        };
        initData();

        $scope.loadCityData = function () {
            $http.get('static/js/prod/data/city.json').success(function (data) {
                $scope.cityJson = data;
                $scope.cityData = convert($scope.cityJson);
                // $scope.tree = new TreeData($scope.cityData);
            }).error(function (res) {
                console.log(res);
            });

            DistributionRule.findAllRuleName({},{},function (data) {
                $scope.nameArray = data;
            })
        };
        $scope.loadCityData();

        $scope.repeatError = false;
        $scope.checkRuleName = function () {
            var k = 1;
            angular.forEach($scope.nameArray, function (item) {
                if (item == $scope.rule.ruleName){
                    k = 0;
                    return;
                }
            });
            if (k == 1){
                $scope.repeatError = false;
            }else {
                $scope.repeatError = true;
            }

        };

        $scope.addQtyFare = function (data) {
            var fare = {
                start : data.end,
                end : 0,
                fare : 0
            };
            $scope.fareArray.push(fare);
        };

        $scope.deleteQtyFare = function (index) {
            $scope.fareArray[index+1].start = $scope.fareArray[index-1].end;
            $scope.fareArray.splice(index, 1);
        };

        $scope.inputFare = function (data) {
            if(!data.fare) {
                data.fare = 0;
                return false;
            }
            if(isNaN(data.fare)){
                data.fare = 0;
                toaster.pop('warning', '提示', '运费必须是整数');
                return false;
            }
            if(Number(data.fare) < 0 || Number(data.fare) % 1 != 0) {
                data.fare = 0;
                toaster.pop('warning', '提示', '运费必须是整数');
                return false;
            }
            if(Number(data.fare) > 100000){
                data.fare = 100000;
            }
            data.fare = Number(data.fare);
        };

        $scope.inputUniform = function () {
            if(!$scope.rule.uniformPrice) {
                $scope.rule.uniformPrice = 0;
                return false;
            }
            if(isNaN($scope.rule.uniformPrice)){
                $scope.rule.uniformPrice = 0;
                toaster.pop('warning', '提示', '运费必须是整数');
                return false;
            }
            if(Number($scope.rule.uniformPrice) < 0 || Number($scope.rule.uniformPrice) % 1 != 0) {
                data.fare = 0;
                toaster.pop('warning', '提示', '运费必须是整数');
                return false;
            }
            if(Number($scope.rule.uniformPrice) > 100000){
                $scope.rule.uniformPrice = 100000;
            }
            data.fare = Number($scope.rule.uniformPrice);
        };

        $scope.inputQtyFare = function (data, index) {
            if(!data.start && !data.end) {
                data.start = 0;
                data.end = 0;
                return false;
            }
            if(isNaN(data.start) || isNaN(data.end)) {
                data.end = data.start + 1;
                $scope.fareArray[index+1].start = Number(data.end);
                toaster.pop('warning', '提示', '金额必须是数字');
                return false;
            }
            if(Number(data.start) < 0) {
                data.start = 0;
                toaster.pop('warning', '提示', '金额必须大于0');
                return false;
            }
            if(Number(data.end) < 0){
                data.end = data.start + 1;
                $scope.fareArray[index+1].start = Number(data.end);
                toaster.pop('warning', '提示', '金额必须大于0');
                return false;
            }
            if(Number(data.end) <= Number(data.start)){
                data.end = data.start + 1;
            }
            if(Number(data.start) > 100000){
                data.start = 100000;
            }
            if(Number(data.end) > 100000){
                data.end = 100000;
            }
            data.start = Number(data.start);
            data.end = Number(data.end);
            $scope.fareArray[index+1].start = Number(data.end);
        };

        $scope.saveDistributionRule = function (isAdd) {
            console.log(angular.toJson($scope.fareArray));
            console.log(angular.toJson($scope.mapArray));
            $scope.checkRuleName();
            if (!$scope.rule.shippingMethod){
                toaster.pop('error', "请选择配送方式");
                return;
            }
            if(!$scope.rule.ruleName){
                toaster.pop('error', "请填写规则名称");
                return;
            }
            if($scope.repeatError){
                toaster.pop('error', "该规则名称已存在，请修改");
                return;
            }
            if(!$scope.orderType.normal && !$scope.orderType.preSale && !$scope.orderType.bill){
                toaster.pop('error', "请选择适用类型");
                return;
            }
            if(!$scope.rule.userType){
                toaster.pop('error', "请选择适用类型");
                return;
            }

            //拼接适用类型
            var typeArray = [];
            if ($scope.orderType.normal){
                typeArray.push(1201);
            }
            if ($scope.orderType.preSale){
                typeArray.push(1202);
            }
            if ($scope.orderType.bill){
                typeArray.push(1203);
            }
            $scope.rule.orderType = typeArray.join("-");
            $scope.rule.qtyFare = angular.toJson($scope.fareArray);
            $scope.rule.qtyArea = angular.toJson($scope.mapArray);
            DistributionRule.saveRule({isAdd:isAdd, isActive:$scope.isActive}, $scope.rule , function (data) {
                if (data){
                    // $scope.loadDeliveryRule();
                    if (isAdd){
                        toaster.pop('info', "保存成功");
                    }else{
                        toaster.pop('info', "新增规则成功");
                    }
                }
            },function (error) {
                toaster.pop('error', "保存配送规则失败 "+ error);
            })
        };

        $scope.close = function () {
            $state.go('vendor_deliveryRule');
        };

        // 切换tab
        $scope.checkTab = function (t) {
            $scope.rule.fareType = t;
        };

        $scope.chooseBox = false;
        $scope.cancel = function () {
            $scope.resetData($scope.tree.$data);
            $scope.tree.initData($scope.mapArray);
            $scope.chooseBox = false;
        };

        $scope.resetData = function (items) {
            angular.forEach(items, function (item) {
                item.checked = false;
                item.selectedNum = 0;
                if (item.items){
                    $scope.resetData(item.items);
                }
            });
        };

        $scope.showSelectedData = function () {
            $scope.mapArray = [];
            $scope.mapArray = $scope.tree.getChecked();
            if ($scope.mapArray.length == 0){
                toaster.pop("info", "您还没有选择任何地区");
                return;
            }
            $scope.tree.initData($scope.mapArray);
            $scope.chooseBox = false;
        };

        $scope.deleteMapItem = function (index) {
            $scope.mapArray.splice(index, 1);
        };

        /**
         * 将本地地址数据转化为可用的结构
         * @param item
         * @returns {Array}
         */
        function convert(item) {
            var arr = [];
            if(angular.isArray(item)) {
                angular.forEach(item, function (v) {
                    arr.push({
                        label: v
                    })
                })
            } else {
                angular.forEach(item, function (v, k) {
                    arr.push({
                        label: k,
                        items: convert(v),
                        selectedNum : 0,
                        folded: true
                    })
                })
            }
            return arr;
        }
        // 选择地区
        $scope.chooseAddress = function () {
            $scope.chooseBox = true;
            $scope.tree = new TreeData($scope.cityData);
            $scope.tree.initData($scope.mapArray);
        }
    }]);
    // 地区选择
    app.register.factory('TreeData', function(){
        return function (tree) {
            var me = this;
            me.$data = tree;

            me.initData = function (initData) {
                if(initData) {
                    angular.forEach(initData, function (v) {
                        var p = {};
                        for(var i in me.$data) {
                            var value = me.$data[i];
                            if(value.label == v.province) {
                                p = value; break;
                            }
                        }
                        p.checked = true;
                        if(v.city) {
                            var c = {};
                            for(var i in p.items) {
                                var value = p.items[i];
                                if(value.label == v.city) {
                                    c = value; break;
                                }
                            }
                            c.checked = true;
                            if(v.area) {
                                for(var i in c.items) {
                                    var value = c.items[i];
                                    if(value.label == v.area) {
                                        value.checked = true; break;
                                    }
                                }
                            } else {
                                angular.forEach(c.items, function (area) {
                                    area.checked = true;
                                })
                            }
                        } else {
                            angular.forEach(p.items, function (city) {
                                city.checked = true;
                                angular.forEach(city.items, function (area) {
                                    area.checked = true;
                                })
                            })
                        }
                    })
                    me._updateParentsCheck(me.$data);
                }
            };


            /**
             * 折叠或展开文件夹
             * @param item
             * @param folded
             */
            me.toggleFold = function (item, folded) {
                item.folded = angular.isUndefined(folded) ? !item.folded : folded;
            }

            /**
             * 折叠文件夹
             * @param item
             */
            me.fold = function (item) {
                item.folded = true;
            }

            /**
             * 展开文件夹
             * @param item
             */
            me.unFold = function (item) {
                item.folded = false;
            }

            /**
             * 选中单个
             * @param item
             */
            me.check = function (item) {
                me._updateChildrenCheck(item);
                me._updateParentsCheck(me.$data);
                // me.getChecked();
            }

            /**
             * 更新子树的选中状态
             * @param item
             * @private
             */
            me._updateChildrenCheck = function (item) {
                if(item.items) {
                    item.selectedNum = item.checked ? item.items.length : 0;
                    angular.forEach(item.items, function (v) {
                        v.checked = item.checked;
                        me._updateChildrenCheck(v);
                    })
                }
            }

            /**
             * 根据子树状态更新父节点选中状态
             * @param items
             * @private
             */
            me._updateParentsCheck = function (items) {
                angular.forEach(items, function (d) {
                    if(d.items) {
                        me._updateParentsCheck(d.items);
                        d.checked = me._hasCheckedChildren(d);
                        d.semiChecked = me._hasUncheckedChildren(d);
                    }
                })
            }


            /**
             * 判断是否有选中的子树
             * @param item
             * @returns {boolean}
             * @private
             */
            me._hasCheckedChildren = function (item) {
                var result = false;
                var count = 0;
                angular.forEach(item.items, function (v) {
                    result = result || v.checked;
                    if (v.checked){
                        count++;
                    }
                    if(v.items && !result) {
                        result = result || me._hasCheckedChildren(v);
                    }
                })
                item.selectedNum = count;
                return result;
            }

            /**
             * 判断是否有没有选中的子树
             * @param item
             * @returns {boolean}
             * @private
             */
            me._hasUncheckedChildren = function (item) {
                var result = false;
                angular.forEach(item.items, function (v) {
                    result = result || !v.checked;
                    if(v.items && !result) {
                        result = result || me._hasUncheckedChildren(v);
                    }
                })
                return result;
            }

            /**
             * 是否半选中
             * @param item
             * @returns {boolean|*}
             */
            me.isSemiChecked = function (item) {
                return item.checked && item.semiChecked;
            }

            /**
             * 获取所有选中的数据
             */
            me.getChecked = function () {
                var addressArray = [];
                angular.forEach(me.$data, function (v) {
                    if(v.checked) {
                        if(!v.semiChecked) {
                            var first = {
                                province : v.label
                            };
                            addressArray.push(first);
                        } else {
                            angular.forEach(v.items, function (data) {
                                if (data.checked){
                                    if(!data.semiChecked) {
                                        var second = {
                                            province : v.label,
                                            city : data.label
                                        };
                                        addressArray.push(second);
                                    }else {
                                        angular.forEach(data.items, function (item) {
                                            if (item.checked){
                                                var third = {
                                                    province : v.label,
                                                    city : data.label,
                                                    area : item.label
                                                };
                                                addressArray.push(third);
                                            }
                                        })
                                    }
                                }
                            });
                        }
                    }
                });
                return addressArray;
            }
        }
    })
});
