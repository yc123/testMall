define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendorDeliveryRuleCtrl', ['$scope', '$rootScope', 'ngTableParams', 'DistributionRule', 'BaseService', 'toaster', '$state', '$http', 'Enterprise', 'TreeData','$q','NumberService','TipRecord', function ($scope, $rootScope, ngTableParams, DistributionRule, BaseService, toaster, $state, $http, Enterprise, TreeData,$q,NumberService,TipRecord) {
        $rootScope.active = 'vendor_logistics';
        $scope.tab = 'deliverRule';
        $scope.title = '配送规则';
        $scope.$$rule = {};
        $scope.currentStep = 1;
        document.title = '配送规则-优软商城';
        $scope.imgIndex = ['static/img/tour/1.gif','static/img/tour/2.gif','static/img/tour/3.gif','static/img/tour/4.gif','static/img/tour/5.png'];
        $scope.imagesObject = [{'img' : 'static/img/tour/1.gif'},{'img' : ''},{'img' : ''},{'img' : ''},{'img' : ''}];
        $scope.ruleTableParams = new ngTableParams({
            page : 1,
            count : 10,
            sorting : {
                num : 'asc'
            }
        },{
            total : 0,
            getData : function ($defer, params) {
                var param = BaseService.parseParams(params.url());
                DistributionRule.findAllRule(param, function (page){
                    $scope.$$rule.totalElements = page.totalElements;
                    if(Number(page.totalElements) > 0) {
                        $scope.$$rule.start = Number(page.size) * (Number(page.number) - 1) + 1;
                    }else {
                        $scope.$$rule.start = 0;
                    }
                    $scope.$$rule.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                    params.total(page.totalElements);
                    $defer.resolve(page.content);
                },function () {
                    toaster.pop('error', '获取配送规则失败');
                } )
            }
        });

        /**
         * 切换标题
         */
        $scope.toggleTab = function (tab) {
            $scope.tab = tab;
        };

        var getTipRecord = function () {
            TipRecord.findTipRecordOfRule({}, {}, function (data) {
                $scope.showOperate = data.tipAgain == 0;
            }, function (error) {
                toaster.pop("error", error.data);
            });
        };
        getTipRecord();

        /**
         * 编辑或新增配送规则，初始化
         * @param data
         */
        $scope.editRule = function (data) {
            $scope.editFrame = true;
            $scope.tab = 'editRule';
            if ($scope.tree){
                $scope.resetData($scope.tree.$data);
            }
            if (data){
                $scope.modifyRule = data;
                $scope.isModify = true;
                $scope.isActive = $scope.modifyRule.active == 1;
                $scope.fareArray = [];
                if ($scope.modifyRule.fareType == 2){
                    $scope.fareArray = angular.fromJson($scope.modifyRule.fares);
                }
                $scope.currencySymbol = $scope.modifyRule.currencyName == "RMB" ? "￥" : "$";
                if ($scope.fareArray.length == 0){
                    var firstFare = {
                        start : "0",
                        end : "",
                        fare : ""
                    };
                    var secondFare = {
                        start : "",
                        fare : ""
                    };
                    $scope.fareArray.push(firstFare);
                    $scope.fareArray.push(secondFare);
                }
                if ($scope.modifyRule.orderType){
                    var orderTypeArray = $scope.modifyRule.orderType.split("-");
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
                $scope.mapArray = [];
                if ($scope.modifyRule.areas){
                    var data = angular.fromJson($scope.modifyRule.areas);
                    $scope.tree = $scope.tree ? $scope.tree : new TreeData($scope.cityData);
                    $scope.tree.newInitData(data);
                    $scope.mapArray = $scope.tree.getChecked();
                }
            }else {
                $scope.isModify = false;
                $scope.modifyRule = {};
                $scope.isActive = true;
                $scope.modifyRule.fareType = 1;
                $scope.modifyRule.userType = 1301;
                $scope.orderType = {
                    normal : true,
                    preSale : true,
                    bill : false
                };
                Enterprise.getCurrencyByRegisterAddress({}, {} ,function (data) {
                    if (data){
                        /**
                         * 目前存在没有注册地址的公司，暂时设为RMB
                         */
                        $scope.modifyRule.currencyName = data.data ? data.data : 'RMB';
                        $scope.currencySymbol = $scope.modifyRule.currencyName == "RMB" ? "￥" : "$";
                    }
                }, function (error) {
                    toaster.pop('error', "获取企业币别信息失败");
                });

                DistributionRule.findCountOfRule({}, {}, function (data) {
                    if (data){
                        var num = data.data;
                        $scope.modifyRule.num = num + 1;
                    }
                });

                $scope.mapArray = [];

                $scope.fareArray = [];
                var firstFare = {
                    start : "0",
                    end : "",
                    fare : ""
                };
                var secondFare = {
                    start : "",
                    fare : ""
                };
                $scope.fareArray.push(firstFare);
                $scope.fareArray.push(secondFare);
            }
        };
        // 新手引导
        $scope.prevIndex = function () {
            $scope.currentStep =  $scope.currentStep - 1;
            angular.forEach ($scope.imagesObject, function (object, index) {
                object.img = '';
                if ($scope.currentStep == index + 1) {
                    object.img = $scope.imgIndex[index];
                }
            })
        };
        $scope.currentIndex = function (idx) {
            $scope.currentStep = idx;
            angular.forEach ($scope.imagesObject, function (object, index) {
                object.img = '';
                if ($scope.currentStep == index + 1) {
                    object.img = $scope.imgIndex[index];
                }
            })
        };
        $scope.nextIndex = function () {
            $scope.currentStep =  $scope.currentStep + 1;
            angular.forEach ($scope.imagesObject, function (object, index) {
                object.img = '';
                if ($scope.currentStep == index + 1) {
                    object.img = $scope.imgIndex[index];
                }
            })

        };

        $scope.cancelOperateTip = function (noTip) {
            if (noTip){
                TipRecord.turnTipRecordOfRule({}, {}, function (data) {
                    
                },function (error) {
                    toaster.pop("error", error.data)
                })
            }
            $scope.currentStep = 1;
            $scope.showOperate = false;
        };

        //配送方式类型
        $scope.deliveryMethod = {
            1301: '第三方配送',
            1302: '卖家配送',
            1303: '上门自提'
        };

        $scope.inputNum = function (data) {
            if(isNaN(data.num)){
                data.num = null;
                toaster.pop('warning', '提示', '请输入大于0的整数');
                return false;
            }
            if(Number(data.num) < 1 || Number(data.num) % 1 != 0) {
                data.num = null;
                toaster.pop('warning', '提示', '请输入大于0的整数');
                return false;
            }
            if(Number(data.num) > 100000){
                data.num = 100000;
                return false;
            }
        };

        $scope.loadCityData = function () {
            $http.get('static/js/prod/data/city.json').success(function (data) {
                $scope.cityJson = data;
                $scope.cityData = convert($scope.cityJson, null);
            }).error(function (res) {
                console.log(res);
            });

        };
        $scope.loadCityData();

        $scope.repeatError = false;
        $scope.checkRuleNameSize = function () {
            if ($scope.modifyRule.ruleName){
                var size = $scope.modifyRule.ruleName.replace(/[^\x00-\xff]/g,'**').length;
                if (size > 50) {
                    $scope.nameError = true;
                }else {
                    $scope.nameError = false;
                }
            }
            if ($scope.nameError){
                toaster.pop("error", "规则名称，最多可输入25个文字");
                return;
            }
        };

        /**
         * 添加一个分段费用
         * @param data
         */
        $scope.addQtyFare = function (data) {
            if (Number(data.start) == 1000000){
                toaster.pop('warning', '提示', '已达到最大值1,000,000,请修改后再新增');
                return;
            }
            var index = $scope.fareArray.length-1;
            $scope.fareArray[index].end = "";
            var fare = {
                start : data.end,
                fare : ""
            };
            $scope.fareArray.push(fare);
        };

        /**
         * 删除一个分段费用
         * @param index
         */
        $scope.deleteQtyFare = function (index) {
            $scope.fareArray[index+1].start = $scope.fareArray[index-1].end;
            $scope.fareArray.splice(index, 1);
        };

        $scope.inputFare = function (data) {
            if(isNaN(data.fare)){
                data.fare = "";
                toaster.pop('warning', '提示', '运费必须是整数');
                return;
            }
            if(Number(data.fare) < 0 || Number(data.fare) % 1 != 0) {
                data.fare = "";
                toaster.pop('warning', '提示', '运费必须是整数');
                return;
            }
            if(Number(data.fare) > 100000){
                data.fare = 100000;
                toaster.pop('warning', '提示', '请勿超过100,100');
            }
            if(data.fare.length > 0){
                data.fare = Number(data.fare);
            }
        };

        $scope.inputUniform = function () {
            if(isNaN($scope.modifyRule.uniformPrice)){
                $scope.modifyRule.uniformPrice = "";
                toaster.pop('warning', '提示', '运费必须是整数');
                return false;
            }
            if(Number($scope.modifyRule.uniformPrice) < 0 || Number($scope.modifyRule.uniformPrice) % 1 != 0) {
                $scope.modifyRule.uniformPrice = "";
                toaster.pop('warning', '提示', '运费必须是整数');
                return false;
            }
            if(Number($scope.modifyRule.uniformPrice) > 100000){
                $scope.modifyRule.uniformPrice = 100000;
            }
            if ($scope.modifyRule.uniformPrice.length != 0){
                $scope.modifyRule.uniformPrice = Number($scope.modifyRule.uniformPrice);
            }
        };

        $scope.exchangeActive = function (data) {
            $scope.isActive = data;
        };

        $scope.inputQtyFare = function (data, index) {
            if(isNaN(data.end)) {
                data.end = "";
                toaster.pop('warning', '提示', '仅可输入数值');
                return;
            }
            if(Number(data.end) > 1000000){
                data.end = "";
                toaster.pop('warning', '提示', '请勿超过1,000,000');
                return;
            }
            if(Number(data.end) <= Number(data.start)) {
                data.end = "";
                toaster.pop('warning', '提示', '输入值应大于该行起始金额');
                return;
            }
            if ($scope.fareArray[index+1].end){
                if($scope.fareArray[index+1].end.length != 0){
                    if (Number(data.end) >= Number($scope.fareArray[index+1].end)){
                        data.end = "";
                        toaster.pop('warning', '提示', '输入值应小于下一行结束金额');
                        return;
                    }
                }
            }
            if (data.end.length != 0){
                data.end = Number(NumberService.toCeil(data.end, 2)) + "";
                $scope.fareArray[index+1].start = data.end;
            }
        };

        $scope.formatMoney = function (data) {
            if (Number(data) > 100000){
                data = 100000;
            }
            return Number(data);
        };

        /**
         * 后台检查规则名是否重复
         * @param newSave
         * @returns {*|{url, method}}
         */
        var checkRepeatName = function (newSave) {
            return DistributionRule.checkRuleName({id:$scope.modifyRule.id,ruleName:$scope.modifyRule.ruleName,newSave:newSave}, {}, function (data) {

            })
        };

        /**
         * 检查配送规则字段
         * @returns {boolean}
         */
        var checkRuleError = function () {
            if (!$scope.modifyRule.shippingMethod){
                toaster.pop('error', "请选择配送方式");
                return false;
            }
            if(!$scope.modifyRule.ruleName){
                toaster.pop('error', "请填写规则名称");
                return false;
            }
            if($scope.nameError){
                toaster.pop('error', "规则名称，最多可输入25个文字");
                return false;
            }
            if($scope.repeatError){
                toaster.pop('error', "该规则名称已存在，请修改");
                return false;
            }
            /**
             * TODO 暂时注释，以后在放出来
             */
            // if(!$scope.orderType.normal && !$scope.orderType.preSale && !$scope.orderType.bill){
            //     toaster.pop('error', "请选择适用类型");
            //     return false;
            // }
            // if(!$scope.modifyRule.userType){
            //     toaster.pop('error', "请选择适用类型");
            //     return false;
            // }
            if (!$scope.mapArray){
                toaster.pop('error', "您还没有选择任何地区");
                return false;
            }
            if ($scope.mapArray.length > 0){
                var resultArray = convertArray($scope.mapArray);
                $scope.modifyRule.qtyArea = angular.toJson(resultArray);
            }else {
                toaster.pop('error', "您还没有选择任何地区");
                return false;
            }
            if (!$scope.modifyRule.qtyArea){
                toaster.pop('error', "您还没有选择任何地区");
                return false;
            }
            if ($scope.modifyRule.fareType == 1){
                if (typeof($scope.modifyRule.uniformPrice) == 'undefined' ||
                    typeof($scope.modifyRule.uniformPrice) == 'string'){
                    toaster.pop('error', "请输入统一规定运费");
                    return false;
                }
            }
            if ($scope.modifyRule.fareType == 2){
                var lackData = false;
                angular.forEach($scope.fareArray, function (item) {
                    if (item.start.length == 0 || item.fare.length == 0){
                        lackData = true
                    }
                    if (item.end){
                        if (item.end.length == 0){
                            lackData = true
                        }
                    }
                });
                if (lackData){
                    toaster.pop('error', "请完善计费方式");
                    return false;
                }
                $scope.modifyRule.qtyFare = angular.toJson($scope.fareArray);
            }
            return true;
        };

        /**
         * isAdd false-另存为
         * @param isAdd
         */
        $scope.saveDistributionRule = function (isAdd) {
            if ($scope.modifyRule.ruleName){
                $q.all([checkRepeatName(!isAdd).$promise]).then(function(data) {
                    if (data){
                        $scope.repeatError = data[0].data;
                    }
                    var valid = checkRuleError();
                    if (!valid){
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
                    $scope.modifyRule.orderType = typeArray.join("-");

                    if (!$scope.modifyRule.qtyArea){
                        toaster.pop('error', "您还没有选择任何地区");
                        return;
                    }

                    if (valid){
                        DistributionRule.saveRule({isAdd:isAdd, isActive:$scope.isActive}, $scope.modifyRule , function (data) {
                            if (data.success){
                                $scope.editFrame = false;
                                $scope.chooseBox = false;
                                $scope.tab = 'deliverRule';
                                if (isAdd){
                                    toaster.pop('info', "保存成功");
                                }else{
                                    toaster.pop('info', "新增规则成功");
                                }
                            }else {
                                toaster.pop('error', data.message);
                                return;
                            }
                        },function (error) {
                            toaster.pop('error', "保存配送规则失败 " + error);
                        })
                    }
                });
            }else {
                toaster.pop('error', "请填写规则名称");
                return;
            }

        };

        // 切换计费类型
        $scope.checkTab = function (t) {
            $scope.modifyRule.fareType = t;
        };

        var convertArray = function (array) {
            var resultArray = angular.copy(array);
            var indexArray = [];
            angular.forEach(array, function (item, index) {
                if (item.mainland && !item.province){
                    indexArray.push(index);
                    angular.forEach($scope.tree.$data, function (v) {
                        if (v.label == item.mainland){
                            angular.forEach(v.items, function (p) {
                                var object = {
                                    province : p.label
                                };
                                resultArray.push(object);
                            })
                        }
                    });
                }
            });
            var count = 0;
            angular.forEach(indexArray, function (index) {
                resultArray.splice(index - count, 1);
                count++;
            });
            return resultArray;
        };

        $scope.chooseBox = false;
        $scope.cancel = function () {
            $scope.resetData($scope.tree.$data);
            if ($scope.mapArray.length > 0){
                var resultArray = convertArray($scope.mapArray);
                $scope.tree.newInitData(resultArray);
            }
            $scope.chooseBox = false;
        };

        $scope.cancelEdit = function () {
            $scope.editFrame = false;
            $scope.chooseBox = false;
            $scope.tab = 'deliverRule';
        };

        $scope.resetData = function (items) {
            angular.forEach(items, function (item) {
                item.checked = false;
                if (item.parent == null){
                    item.folded = false;
                }else {
                    item.folded = true;
                }
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
            $scope.tree.newInitData($scope.mapArray);
            $scope.chooseBox = false;
        };

        $scope.deleteMapItem = function (index) {
            $scope.mapArray.splice(index, 1);
            $scope.resetData($scope.tree.$data);
            if ($scope.mapArray.length > 0){
                var resultArray = convertArray($scope.mapArray);
                $scope.tree.newInitData(resultArray);
            }
        };

        /**
         * 将本地地址数据转化为可用的结构
         * @param item
         * @returns {Array}
         */
        function convert(item, parent) {
            var arr = [];
            if(angular.isArray(item)) {
                angular.forEach(item, function (v) {
                    arr.push({
                        label: v,
                        checked: false,
                        parent:parent
                    })
                })
            } else {
                if (parent == null){
                    var china = {
                        label:'中国大陆',
                        checked: false,
                        parent:null,
                        items:null,
                        selectedNum: 0,
                        folded: false
                    };
                    $scope.hmt = {
                        label:'港澳台',
                        checked: false,
                        parent:null,
                        items:null,
                        selectedNum:0,
                        folded: false
                    };
                    china.items = convert(item, china);
                    arr.push(china);
                    arr.push($scope.hmt);
                }else {
                    angular.forEach(item, function (v, k) {
                        if (k　!= '香港特别行政区'){
                            var object = {
                                label: k,
                                checked: false,
                                parent:parent,
                                items: null,
                                selectedNum : 0,
                                folded: true
                            };
                            object.items = convert(v, object);
                            arr.push(object);
                        }else {
                            $scope.hmtChild = {
                                label: k,
                                checked: false,
                                parent:$scope.hmt,
                                items: null,
                                selectedNum : 0,
                                folded: true
                            };
                            $scope.hmtChild.items = convert(v, $scope.hmtChild);
                            var hmtArr = [];
                            hmtArr.push($scope.hmtChild);
                            $scope.hmt.items = hmtArr;
                            // arr.push($scope.hmtChild);
                        }
                    })
                }
            }
            return arr;
        }
        // 选择地区
        $scope.chooseAddress = function () {
            $scope.chooseBox = true;
            $scope.tree = $scope.tree ? $scope.tree : new TreeData($scope.cityData);
            $scope.tree.newInitData($scope.mapArray);
        };

        /**
         * 切换生效状态
         * @param rule
         * @param isAdd
         * @param active
         */
        $scope.changeActive = function (ruleId, active) {
            DistributionRule.changeActive({id:ruleId, isActive:active}, {}, function (data) {
                if (data){
                    $scope.ruleTableParams.reload();
                }
            })
        };

        $scope.showDeleteFrame = function (data) {
            $scope.deleteFrame = true;
            $scope.deleteObject = data;
        };

        /**
         * 根据id删除指定配送规则
         * @param id
         */
        $scope.deleteRule = function (id) {
            DistributionRule.deleteOne({id:id}, {}, function () {
                $scope.deleteFrame = false;
                toaster.pop('info', '删除配送规则成功');
                $scope.loadDeliveryRule();
            }, function (res) {
                toaster.pop('error', '删除配送规则失败 ' + res);
            });
        };

        /**
         * 刷新配送规则
         */
        $scope.loadDeliveryRule = function () {
            $scope.ruleTableParams.page(1);
            $scope.ruleTableParams.reload();
        };

        //取消删除
        $scope.cancelDelete = function () {
            $scope.deleteFrame = false;
        };

        // document.addEventListener('click', this.checkShowFilter){
        //
        // }

    }]);

    // 地区选择
    app.register.factory('TreeData', function(){
        return function (tree) {
            var me = this;
            me.$data = tree;

            /**
             * 根据已选地区映射到树对象中
             * @param initData
             */
            me.newInitData = function (initData) {
                if (initData){
                     angular.forEach(me.$data, function (v) {
                         me.initData(v.items, initData);
                    })
                }
                me._updateParentsCheck(me.$data);
            };

            me.initData = function (data, initData) {
                if(initData) {
                    angular.forEach(initData, function (v) {
                        var p = {};
                        for(var i in data) {
                            var value = data[i];//获取单个省
                            if(value.label == v.province) {
                                p = value; break;
                            }
                        }
                        p.checked = true;
                        if(v.city) {
                            var c = {};
                            for(var i in p.items) {
                                var value = p.items[i];//获取单个市
                                if(value.label == v.city) {
                                    c = value; break;
                                }
                            }
                            c.checked = true;
                            if(v.area) {
                                for(var i in c.items) {
                                    var a = c.items[i];//获取单个区
                                    if(a.label == v.area) {
                                        a.checked = true; break;
                                    }
                                }
                            }else {
                                angular.forEach(c.items, function (area) {
                                    area.checked = true;
                                })
                            }
                        }else {
                            angular.forEach(p.items, function (city) {
                                city.checked = true;
                                angular.forEach(city.items, function (area) {
                                    area.checked = true;
                                })
                            })
                        }
                    })
                }
            };

            /**
             * 折叠或展开文件夹
             * @param item
             * @param folded
             */
            me.toggleFold = function (item, folded) {
                var f = item.folded;
                if (item.items){
                    me._resetFold(me.$data);
                    if (item.parent != null){
                        me._unFoldThisItem(item.parent);
                    }
                }
                item.folded = angular.isUndefined(folded) ? !f : folded;
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
                if (item.items){
                    me._resetFold(me.$data);
                    me._unFoldThisItem(item);
                }
                me._updateChildrenCheck(item);
                me._updateParentsCheck(me.$data);

            }

            /**
             * 展开当前列表和父列表
             * @param item
             * @private
             */
            me._unFoldThisItem = function (item) {
                me.unFold(item);
                if (item.parent != null){
                    me._unFoldThisItem(item.parent);
                }
            }

            /**
             * 折叠全部
             * @param items
             * @private
             */
            me._resetFold = function (items) {
                angular.forEach(items, function (v) {
                    v.folded = true;
                    if (v.items){
                        me._resetFold(v.items);
                    }
                });
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
                                mainland : v.label
                            };
                            addressArray.push(first);
                        } else {
                            angular.forEach(v.items, function (data) {
                                if (data.checked){
                                    if(!data.semiChecked) {
                                        var second = {
                                            // mainland : v.label,
                                            province : data.label
                                        };
                                        addressArray.push(second);
                                    }else {
                                        angular.forEach(data.items, function (item) {
                                            if(!item.semiChecked) {
                                                var third = {
                                                    // mainland : v.label,
                                                    province : data.label,
                                                    city : item.label
                                                };
                                                addressArray.push(third);
                                            }else {
                                                angular.forEach(item.items, function (m) {
                                                    if (m.checked){
                                                        var forth = {
                                                            // mainland : v.label,
                                                            province : data.label,
                                                            city : item.label,
                                                            area : m.label
                                                        };
                                                        addressArray.push(forth);
                                                    }
                                                })
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
