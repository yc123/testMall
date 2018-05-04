/**
 * Created by yujia on 2017/3/24.
 *  品牌申请的控制器
 */
define(['app/app', 'jquery-uploadify'], function(app) {
    "use strict";
    app.register.controller('vendorBrandApplyCtrl', ['$scope', '$rootScope', 'toaster', 'Search', 'BrandActiveAPI', 'BrandSubmit', 'BrandActive', '$stateParams', function($scope, $rootScope, toaster, Search, BrandActiveAPI, BrandSubmit, BrandActive, $stateParams) {
        $rootScope.active = 'vendor_brand_apply';

        document.title = "品牌申请" + "-优软商城";

        $scope.imageUrl = '';
        $scope.submitEnable = true;
        // 可选的区域
        $scope.areas = [{value:'大陆'}, {value:'港澳台'}, {value:'日韩'}, {value:'欧美'}];
        // 可选的应用领域
        $scope.apps = [{value: '移动手持'}, {value: '医疗电子'}, {value: '消费电子'}, {value: '通信网络'}, {value: '汽车电子'}, {value: '能源控制'}, {value: '家用电器'}, {value: '工业控制'}, {value: '安防监控'}];

        // 处理区域
        var parseArea = function(a) {
            if(a) {
                var arr = a.split(',');
                angular.forEach(arr, function(app) {
                    var contained = false;
                    angular.forEach($scope.areas, function($app) {
                        if($app.value == app) {
                            $app.checked = true;
                            contained = true;
                        }
                    });
                    if(!contained) {
                        $scope.areas.push({value: app, checked: true});
                    }
                });
                console.log($scope.areas);
            }
        };

        // 处理应用领域
        var parseApplications = function(a) {
            if(a) {
                var arr = a.split(',');
                angular.forEach(arr, function(app) {
                    var contained = false;
                    angular.forEach($scope.apps, function($app) {
                        if($app.value == app) {
                            $app.checked = true;
                            contained = true;
                        }
                    });
                    if(!contained) {
                        $scope.apps.push({value: app, checked: true});
                    }
                });
            }
        };

        $scope.deleteImg =function () {
            $scope.brand.logoUrl = null;
            $scope.imageUrl = '';
        };

        // 查看范例
        $scope.showImg = function(imgUrl) {
            var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
            box.show();
            box.find('img').attr('src', src);
            box.find('a').click(function(){
                box.hide();
            });
            box.dblclick(function(){
                box.hide();
            });
        };

        if($stateParams.uuid) {
            BrandActive.get({uuid : $stateParams.uuid}, {}, function(data){
                //检查对应uuid的品牌是否存在，如果不存在就跳转至新增url
                if(data.version == -1){
                    toaster.pop('info', '提醒', '您将新增一个品牌信息');
                    $location.path("apply/");
                }

                $scope.brand = data;
                $scope.brand.modifyuu = null;
                $scope.brand.modifyTime = null;
                parseArea(data.area||'');
                parseApplications(data.application||'');
                $scope.imageUrl = data.logoUrl;
            }, function(data){
                console.log(data);
                toaster.pop('error', '提示', '获取品牌信息失败，请确认品牌是否存在。')
            });
        } else if($stateParams.id) {
            BrandSubmit.get({id: $stateParams.id}, function(data) {
                $scope.brand = data;
                $scope.imageUrl = data.logoUrl;
                $scope.brand = data;
                parseArea(data.area||'');
                parseApplications(data.application||'');
                delete $scope.brand.auditOpinion;
            }, function() {
                toaster.pop('error', '获取品牌信息失败');
            });
        }
        // else {
        //     // $scope.brand = {area: '大陆'};
        //     // $scope.imageUrl = 'static/img/upload/cont.jpg';
        //     // $scope.brand.nameCn = SessionService.get('brandNameCn');
        //     // $scope.brand.nameEn = SessionService.get('brandNameEn');
        // }

        // 获取联想词
        $scope.getSimilarBrands = function(keyword) {
            if (keyword) {
                return Search.getSimilarBrands({keyword : keyword}).$promise.then(function(data) {
                    return data.map(function(item) {
                        return item;
                    });
                });
            }
        };

        // 点击选取联想词（中文名）
        $scope.onAssociateClick = function(brand) {
            $scope.brand.uuid = brand.uuid;
            $scope.imageUrl = '';
            BrandActiveAPI.get({uuid : $scope.brand.uuid}, {}, function(data) {
                $scope.brand = data;
                $scope.imageUrl = $scope.brand.logoUrl;
                $scope.brand.modifyuu = null;
                $scope.brand.modifyTime = null;
                parseArea($scope.brand.area);
                parseApplications($scope.brand.application);
            }, function(res) {
                toaster.pop('error', '提示', '品牌信息加载失败，请刷新界面');
            });
        };

        // 勾选销售区域、应用领域
        $scope.selectArea = function (area) {
            area.checked = !area.checked;
        };

        // 额外区域
        $scope.extraAreas = [];
        // 添加额外区域
        $scope.addExtraAreas = function() {
            if($scope.extraAreas.length >= 5)
                toaster.pop('warning', '警告', '最多能添加5个额外区域！');
            else
                $scope.extraAreas.push({value: null});
        };
        // 删除额外区域
        $scope.removeExtraAreas = function(index) {
            $scope.extraAreas.splice(index, 1);
        };

        // 额外应用
        $scope.extraApp = [];
        // 添加额外应用
        $scope.addExtraApp = function() {
            if($scope.extraApp.length >= 5)
                toaster.pop('warning', '警告', '最多能添加5个额外应用！');
            else
                $scope.extraApp.push({value: null});
        };
        // 删除额外应用
        $scope.removeExtraApp = function(index) {
            $scope.extraApp.splice(index, 1);
        };

        // 图片上传成功之后
        $scope.onUploadSuccess = function(data){
            $scope.imageUrl = data.path;
            if (typeof($scope.brand)=="undefined") {
                $scope.brand = {};
            }
            $scope.brand.logoUrl = $scope.imageUrl;
            toaster.pop('success', '上传成功');
        };

        // 保存
        $scope.save = function() {
            $scope.submitEnable = false;

            var brand = angular.copy($scope.brand);

            if (typeof brand == 'undefined') {
                toaster.pop('warning', '请填写您要申请的品牌');
                $scope.submitEnable = true;
            }

            // 组装区域
            var myAreas = [];
            angular.forEach($scope.areas, function(area) {
                if (area.checked == true) {
                    myAreas.push(area.value);
                }
            });
            angular.forEach($scope.extraAreas, function(area) {
                myAreas.push(area.value);
            });
            brand.area = myAreas.join(',');
            // 组装应用领域
            var myApps = [];
            angular.forEach($scope.apps, function(app){
                if(app.checked == true)
                    myApps.push(app.value);
            });
            angular.forEach($scope.extraApp, function(app){
                myApps.push(app.value);
            });
            brand.application = myApps.join(',');

            if (!(brand.brief && brand.nameEn && brand.series && brand.url)) {
                toaster.pop('error', '警告', "请将信息填写完整");
                $scope.submitEnable = true;
                return;
            }

            if (brand.nameEn.length > 120) {
                toaster.pop('error', '警告', "品牌英文名不可超过120个字");
                $scope.submitEnable = true;
                return;
            }

            if (brand.nameCn != null && brand.nameCn.length > 120) {
                toaster.pop('error', '警告', "品牌中文名不可超过120个字");
                $scope.submitEnable = true;
                return;
            }

            if (brand.url.length > 120) {
                toaster.pop('error', '警告', "官网地址不可超过120个字");
                $scope.submitEnable = true;
                return;
            }

            brand.id = null;
            BrandSubmit.submit({},brand,function(data){
                toaster.pop('success', '提示', "提交成功，请等待审核");
                window.location.replace('vendor#/brand/apply_list');
            },function(res){
                $scope.submitEnable = true;
                toaster.pop('error', '警告', res.data);
            });
        };
    }]);
});
