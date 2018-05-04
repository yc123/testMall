define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('vendorUploadCtrl', ['$scope', '$rootScope', 'ngTableParams', '$upload', '$q', 'AuthenticationService', 'BaseService', 'StoreInfo', 'SessionService', '$modal', 'toaster', 'ReleaseProductByBatch', 'Loading', 'Enterprise', 'DistributionRule', '$state', '$location', function ($scope, $rootScope, ngTableParams, $upload, $q, AuthenticationService, BaseService, StoreInfo, SessionService, $modal, toaster, ReleaseProductByBatch, Loading, Enterprise, DistributionRule, $state, $location) {
	    if (!$rootScope.$$productOn) {
            $rootScope.$$productOn = {};
            $rootScope.$$productOn.leadIn = 'bathOn';
            $rootScope.$$productOn.tab = 'bathOn';
        }
		$rootScope.active = 'vendor_productOn';
		document.title = '产品导入-优软商城';
        //切换展示的信息
        $scope.toggleActive = function(active) {
            if($scope.tab != active) {
                $rootScope.$$productOn.tab = active;
                $state.reload();
            }
        };

        if ($location.$$search.type && $location.$$search.type == 'self') {
            $rootScope.$$productOn.tab = 'bathOnPerson';
        } else if ($location.$$search.type && $location.$$search.type == 'company'){
            $rootScope.$$productOn.tab = 'bathOn';
        }
        $scope.deletePop = false;
        $scope.personMedol =false;
        $scope.setPersonMedol = function () {
            $scope.personMedol =false;
        };

        $scope.showTip = true;

        $scope.closeTip = function () {
            $scope.showTip = false;
        }

        //获取币别信息
        Enterprise.getCurrencyByRegisterAddress(null, function (data) {
            if(data.code == 1) {
                $scope.batch.currency = data.data;
            }else {
                toaster.pop('info', '提示', '您公司的注册地址为空，无法确定币别，系统默认为人民币');
                $scope.batch.currency = 'RMB';
            }
        }, function (response) {
            toaster.pop('info', '提示', '获取不到公司的币别信息');
        });

        $scope.batch = {};
        $scope.batch.myFiles = null;
        //批量发布的类型
        $scope.batch.sellType = null;


        $scope.repeatImport = 0;
		$scope.switchImport = function (type) {
			$scope.repeatImport = type;
		};

        //翻页的信息
        $scope.pageParams = {};

		// 自营店铺选择寄售提示框
		$scope.showSelfSellRemindBox = false;

		$scope.setShowSelfSellRemindBox = function (flag, type) {
			if (type && type == 'no') {
				$scope.sellType('self');
			}
			$scope.showSelfSellRemindBox = flag;
		}

		//选择相应的销售类型
		$scope.sellType = function(type) {
			if($scope.batch.selfSellEabled) {
				$scope.batch.sellType = type;
				if (type == 'UAS') {
					$scope.setShowSelfSellRemindBox(true);
				}
			}else {
				$scope.batch.sellType = 'UAS';
			}

        };

        //上架信息展示
        $scope.relTableParams = new ngTableParams({
            count : 10,
            page : 1
        }, {
            total : 0,
            getData : function($defer, params) {
                var param = BaseService.parseParams(params.url());
                if($scope.result && $scope.result.batch) {
                    param.batch = $scope.result.batch;
                    ReleaseProductByBatch.getPageBatchRelease(param, function(page) {
                        $defer.resolve(page.content);
                        params.total(page.totalElements);
                        $scope.pageParams.number = page.number;
                        $scope.pageParams.content = page.content;
                        $scope.pageParams.totalElements = page.totalElements;
                        $scope.pageParams.totalPages = page.totalPages;
                        $scope.pageParams.start = ((page.number - 1) * page.size) + 1;
                        $scope.pageParams.end =  page.number * page.size;
                        if($scope.pageParams.end > $scope.pageParams.totalElements) {
                            $scope.pageParams.end = $scope.pageParams.totalElements
                        }
                    }, function(data) {
                        toaster.pop();
                    });
                }
            }
        });

        /**
         * 打开删除的模态框
         */
        $scope.showDelete = function (item) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'static/view/common/modal/delete_modal.html',
                controller: 'product_delete_ctrl',
                resolve: {
                    id : function() {
                        return item.id;
                    }
                }
            });
            modalInstance.result.then(function(){
                if (item.releaseCode == 112){
                    $scope.result.success = $scope.result.success - 1;
                }else if(item.releaseCode == 113){
                    $scope.result.failure = $scope.result.failure - 1;
                }
                //不需要返回的第一页
                $scope.relTableParams.reload();
            }, function(){
            });
        };

        var initRuleCount = function () {
            return DistributionRule.findCountOfActiveRule({},{},function (data) {
                if (data.success){
                    $scope.needShowTip = data.data;
                }
            }, function (error) {
                toaster.pop("error", error.data);
            })
        };
        initRuleCount();

        // 查看范例
        $scope.showImg = function() {
            var src = '';
            if($scope.batch.currency === 'RMB') {
                src = $rootScope.rootPath + "/static/img/product/releaseByBatch-rmb.png";
            }else {
                src = $rootScope.rootPath + "/static/img/product/releaseByBatch-usd.png";
            }
            var box = $('#image-box');
            box.find('img').attr('src', src);
            box.find('a').click(function(){
                box.hide();
            });
            box.dblclick(function(){
                box.hide();
            });
            box.show();
        };

        //获取登录的信息
        var getAuthentication = function () {
            return AuthenticationService.getAuthentication().success(function(data) {
                if(data && data.enterprises) {
                    data.enterprise = data.enterprises[data.enterprises.length - 1];
                    if(data.enterprises.length > 1) {
                        var enSelect = [];
                        angular.forEach(data.enterprises, function(e){
                            if(e.current)
                                data.enterprise = e;
                            else
                                enSelect.push(e);
                        });
                        data.enSelect = enSelect;
                    }
                }
                $rootScope.userInfo = data;
            }).error(function(response) {
                toaster.pop('info', '获取定单的信息' + response);
            });
        };

        //判断是否是商城管理公司，是否可以选择自营。
        $q.all([getAuthentication()]).then(function() {
            //获取店铺的信息
            StoreInfo.getStoreInfoByEnuu({enUU : $rootScope.userInfo.enterprise.uu}, function(data) {
                $scope.storeInfo = data;
                if(!data.uuid || data.storeName.indexOf('优软测试二') > -1 || data.storeName.indexOf('优软商城') > -1) {
                    $scope.batch.sellType = 'UAS';
                    $scope.batch.selfSellEabled = false;
                }else {
                    $scope.batch.sellType = 'self';
                    $scope.batch.selfSellEabled = true;
                }
            }, function(response) {
                toaster.pop('error', '获取店铺的信息失败, ' + response.data);
            });
        });

        // 返回店铺的uuid，未开店则返回寄售uuid
        $q.all([getAuthentication()]).then(function() {
            //获取店铺的信息
            StoreInfo.getUuidByEnuu({enUU : $rootScope.userInfo.enterprise.uu}, function(data) {
                $scope.storeUuid = data.data;
            }, function(response) {
                toaster.pop('error', '获取店铺的信息失败, ' + response.data);
            });
        });


        //选择文件
        $scope.selectFile = function(value) {
            if(value != null) {
                upload_text.value = value;
            }else {
                var fileInput = angular.element('#uploadCommodity')[0];
                upload_text.value = fileInput.value;
            }
        };

		// 上传Excel批量发布（大量）
		$scope.upload = function() {
			if(($scope.batch.myFiles == null) || ($scope.batch.myFiles.length == 0)) {
				return ;
			}
			var file = $scope.batch.myFiles[0];
			if(!file) {
				toaster.pop('info', '请选择需要上传的文件');
				return;
			}
			if ($rootScope.$$productOn.tab === 'bathOnPerson') {
				var param = {selfSale : $scope.batch.sellType == 'self', currency : $scope.batch.currency, isPerson : 1};
			} else {
                var param = {selfSale : $scope.batch.sellType == 'self', currency : $scope.batch.currency, repeatImport : $scope.repeatImport};
			}
			$upload.upload({
				url: 'release/product/release/excel',
				file: file,
				method: 'POST',
				params : param
			}).success(function(data) {
				$scope.selectFile(' ');
				$scope.batch.myFiles = [];
				$scope.proInfo = data.info;
				$scope.result = data;
				$scope.hadImport = false;
				// var message = "";
				// if($scope.result.success) {
				// 	message = '标准产品' + $scope.result.success + '个';
				// }
				// if($scope.result.failure) {
				// 	if(message) {
				// 		message = message + '，非标产品' + $scope.result.failure +  '个';
				// 	}else {
				// 		message = '非标产品' + $scope.result.failure +  '个';
				// 	}
				// }
				// if($scope.result.filter) {
				// 	if(message) {
				// 		message = message + '，过滤' + $scope.result.filter +  '条';
				// 	}else {
				// 		message = '过滤' + $scope.result.filter +  '条';
				// 	}
				// }
				// if(!message) {
				// 	message = '没有提交任何信息'
				// }
				toaster.pop('info', '提示', '上传完成');
				$scope.relTableParams.page(1);
				$scope.relTableParams.reload();
                if ($rootScope.$$productOn.tab === 'bathOnPerson') {
                    publicPersonProduct();
                }
            }).error(function(response) {
                $scope.result = {};
                $scope.result.total = 0;
                $scope.pageParams.number = 0;
                $scope.pageParams.content = null;
                $scope.pageParams.totalElements = 0;
                $scope.pageParams.totalPages = 0;
                toaster.pop('error', response.data || response);
            });
        };

        // 下载模板
        $scope.download = function() {
            var show = SessionService.get($scope.userInfo.userUU + "-releasetip");
            if (!show) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl : $rootScope.rootPath + '/static/view/vendor/modal/releaseProductByBatchTip.html',
                    controller : 'releaseProductByBatchTipCtrl'
                });
                modalInstance.result.then(function(response) {
                }, function(res) {
                    window.location.href = $rootScope.rootPath + '/release/product/release/template?currency' + '=' + $scope.batch.currency + ($rootScope.$$productOn.tab == 'bathOnPerson' ? '&isPerson=1' : '');
                });
            } else {
                window.location.href = $rootScope.rootPath + '/release/product/release/template?currency' + '=' + $scope.batch.currency + ($rootScope.$$productOn.tab == 'bathOnPerson' ? '&isPerson=1' : '');
            }
        };

        //批量发布
        $scope.publish = function(event) {
            if ($scope.pageParams.totalElements > 0) {
                ReleaseProductByBatch.batchRelease({batch : $scope.result.batch}, null, function(data) {
                    $modal.open({
                        animation : true,
                        templateUrl : 'static/view/common/modal/product_upload_modal.html',
                        controller : 'rule_tip_ctrl',
                        resolve : {
                            type : function() {
                                return 'upload';
                            },
                            tipModal : function() {
                                return true;
                            },
                            success : function () {
                                return $scope.needShowTip;
                            },
                            uuid: function () {
                                return $scope.storeUuid;
                            }
                        }
                    });
                    $scope.relTableParams.page(1);
                    $scope.relTableParams.reload();
                    $scope.result.success = 0;//设置成0，让前端用户不能点击
                    $scope.hadImport = true; //上架后隐藏提示语
                }, function(res) {
                    toaster.pop("error", "发布失败", res.data);
                });
            } else {
                event.stopPropagation();//阻止冒泡事件
                event.preventDefault();//阻止默认的事件。
                toaster.pop("info", "提示", "没有信息发布");
            }
        };

        function publicPersonProduct() {
            ReleaseProductByBatch.batchReleasePerson({batch : $scope.result.batch}, null, function(data) {
                if ($scope.needShowTip) {
                    $scope.relTableParams.page(1);
                    $scope.relTableParams.reload();
                    //$scope.result.success = 0;//设置成0，让前端用户不能点击
                    $modal.open({
                        animation : true,
                        templateUrl : 'static/view/common/modal/product_upload_modal.html',
                        controller : 'rule_tip_ctrl',
                        resolve : {
                            type : function() {
                                return 'upload';
                            },
                            tipModal : function() {
                                return true;
                            },
                            success : function () {
                                return false;
                            },
                            uuid: function () {
                                return null;
                            }
                        }
                    });
                    return ;
                }
                // toaster.pop("success", "提示", "发布成功 ：" + data.data + "条");
                $scope.personMedol = true;
                $scope.relTableParams.page(1);
                $scope.relTableParams.reload();
                //$scope.result.success = 0;//设置成0，让前端用户不能点击
                /*$scope.hadImport = true; //上架后隐藏提示语*/ // 个人上传不隐藏
            }, function(res) {
                toaster.pop("error", "发布失败", res.data);
            });
        }

        //下载未匹配成功的数据
        $scope.downloadExcel = function(){
            if ($rootScope.$$productOn.tab === 'bathOnPerson') {
                var datatem = {isAjax : true, batch : $scope.result.batch, isPerson : 1};
            } else {
                var datatem = {isAjax : true, batch : $scope.result.batch};
            }
            if($scope.result && $scope.result.batch && $scope.result.filter) {
                var form = document.getElementById('load-error');
                form.action= 'release/product/release/failure/xls';
                form.submit();
                Loading.show();
                var intervalId = null;
                var getDownLoadStatus = function () {
                    $.ajax({
                        type: 'GET',
                        url: 'release/product/release/failure/xls',
                        data : datatem,
                        dataType : 'json',
                        success: function (data) {
                            if(!data.load) {
                                $scope.$apply(function () {
                                    Loading.hide();
                                    /*toaster.pop('success', '数据处理完毕，正在下载文件，请稍等。');*/
                                });
                                clearInterval(intervalId);
                            }
                        },
                        error: function () {
                            Loading.hide();
                            clearInterval(intervalId);
                        }
                    });
                };
                intervalId= setInterval(function () {
                    getDownLoadStatus();
                }, 500);
            }else {
                if(!$scope.result || !$scope.result.batch) {
                    toaster.pop('info', '提示', '您没有上传信息');
                }else if(!$scope.result.filter) {
                    toaster.pop('info', '提示', '您没有匹配不成功的数据');
                }
            }
        };
	}]);

	//批量上架的Ctrl
	app.register.controller('batchPutOnCtrl', ['$scope', '$rootScope', 'ngTableParams', '$upload', '$q', 'AuthenticationService', 'BaseService', 'StoreInfo', 'SessionService', '$modal', 'toaster', 'ReleaseProductByBatch', 'Loading', 'Enterprise', 'DistributionRule', function ($scope, $rootScope, ngTableParams, $upload, $q, AuthenticationService, BaseService, StoreInfo, SessionService, $modal, toaster, ReleaseProductByBatch, Loading, Enterprise, DistributionRule) {


	}]);

	//下载表格时显示提示信息
	app.register.controller('releaseProductByBatchTipCtrl', ['$scope', '$modalInstance', 'SessionService', function($scope, $modalInstance, SessionService) {
		$scope.IKnow = function() {
			$modalInstance.dismiss();
		};

		$scope.donShowAgain = function() {
			var show = SessionService.set($scope.userInfo.userUU + "-releasetip", 1);
			$modalInstance.dismiss();
		};
	}]);

	app.register.controller('product_delete_ctrl', ['$scope', 'id', 'toaster', '$modalInstance', 'ReleaseProductByBatch', function ($scope, id, toaster, $modalInstance, ReleaseProductByBatch) {
		$scope.deleteModal = true;

		$scope.cancleDelete = function () {
			$scope.deleteModal = false;
			$modalInstance.dismiss();
		};

		$scope.confirmDelete = function () {
			//删除指定id的信息
			if(!id || id == '') {
				return ;
			}
			ReleaseProductByBatch.deleteProInfo({id : id}, function (data) {
				if (data){
					$scope.deleteModal = false;
					$modalInstance.close();
				}
			}, function (error) {
				toaster.pop('error', '删除失败，请重新操作');
			});
		};

		/**
		 * 监听点击的事件
		 */
		document.onclick = function (event) {
			if($scope.deleteModal) {
				if(event) {
					var tag = event.target;
					if(tag) {
						var attribute = tag.getAttribute("name");
						while(tag.nodeName != 'BODY') {
							if((attribute == 'comfirm-delete-modal') ||
								attribute == 'delete-material') {
								return ;
							}
							tag = tag.parentElement;
							attribute = tag.getAttribute("name");
						}
						$scope.deleteModal = false;
						$modalInstance.dismiss();
					}
				}
			}
		};
	}]);
});