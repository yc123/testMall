/**
 * Created by yujia on 2017/3/24.
 *  库存管理的控制器
 */
define(['app/app'], function(app) {
	"use strict";
	app.register.controller('vendorGoodsCtrl', ['$scope', '$rootScope', 'ngTableParams', 'ComponentActiveAPI', 'BaseService', 'toaster', 'Goods', '$upload', '$http', 'ReleaseProductByBatch', '$modal', '$window', 'SessionService', 'StoreInfo', '$q', 'AuthenticationService', 'Loading', function($scope, $rootScope, ngTableParams, ComponentActiveAPI, BaseService, toaster, Goods, $upload, $http, ReleaseProductByBatch, $modal, $window, SessionService, StoreInfo, $q, AuthenticationService, Loading) {
		$rootScope.active = "vendor_goods";

		$scope.tab = 'onSale';
		// 商品的状态
		$scope.goodsStatus = 601;
		//初始时获取数据的方法
		$scope.getDataMethod = 'getGoodsByPageAndStatus';
			// 商品分页数据
		$scope.goodsPageParams = {};

		$scope.batch = {};
		$scope.batch.myFiles = null;
		//批量发布的类型
		$scope.batch.sellType = null;

		$scope.selfSupportType = {
			ALL: '自营/寄售',
			SELF_SUPPORT: '自营',
			CONSIGNMENT: '寄售'
		};
		$scope.selfSupport = $scope.selfSupportType.ALL;


		//切换展示的信息
		$scope.toggleActive = function(active) {
			if($scope.tab != active) {
				$scope.tab = active;
				$scope.selfSupport = $scope.selfSupportType.ALL;
				if ($scope.tab == 'onSale') {
					$scope.goodsStatus = 601;
					$scope.getDataMethod = 'getGoodsByPageAndStatus';
					$scope.loadGoodsList();
				} else if ($scope.tab == 'undercarriage') {
					$scope.goodsStatus = 612;
					$scope.getDataMethod = 'findDownedGoods';
					$scope.loadGoodsList();
				}
				$scope.toPage = null;
			}
		};


		var user = SessionService.get('user');

		$scope.topagenum = null;

		/**
		 * 分页获取商品列表
		 */
		$scope.goodsTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createdDate: 'DESC'
			}
		}, {
			total : 0,
			getData : function ($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.status = $scope.goodsStatus;
				if ($scope.getDataMethod === 'getGoodsByPageAndStatus') {
					if ($scope.selfSupport === $scope.selfSupportType.SELF_SUPPORT) {
						param.isSelfSupport = true;
					} else if ($scope.selfSupport === $scope.selfSupportType.CONSIGNMENT) {
						param.isSelfSupport = false;
					} else {
						param.isSelfSupport = null;
					}
				}
				Goods[$scope.getDataMethod].call(null, param, function (page) {
					console.log(page);
					$scope.goodsPageParams = page;
				});
			}
		});

		/**
		 * 加载商品数据
		 */
		$scope.loadGoodsList = function () {
			if ($scope.goodsTableParams.page() != 1) {
				$scope.goodsTableParams.page(1);
			}
			$scope.goodsTableParams.reload();
		};

		$scope.loadGoodsList();

		/**
		 * 筛选商品类型
		 *
		 * @param type		商品上架类型
		 */
		$scope.changeSupportType = function (type) {
			if (!type) return ;
			$scope.selfSupport = type;
			$scope.loadGoodsList();
		};

		/**
		 * 跳转指定页面[1~$scope.goodsPageParams.totalPages]
		 *
		 * @param pageNum	页码
		 */
		$scope.jumpToPage = function (pageNum) {
			if (typeof pageNum == "string") {
				pageNum = parseInt(pageNum);
			}
			if (pageNum && pageNum != $scope.goodsPageParams.number) {
				if (pageNum < 1) {
					pageNum = 1;
				} else if (pageNum > $scope.goodsPageParams.totalPages) {
					pageNum = $scope.goodsPageParams.totalPages;
				}
				$scope.goodsTableParams.page(pageNum);
				$scope.goodsTableParams.reload();
				$scope.toPage = pageNum;
			}
		};

		/**
		 * 修改商品信息
		 *
		 * @param commodity		待修改商品信息
		 * @param isDischarge	是否下架商品
		 */
		$scope.updateCommodityInfo = function (commodity, isDischarge) {
			if (isDischarge) {
				Goods.offShelfGoodsByProvider({batchCodes : commodity.batchCode}, {}, function(map){
					if (map.success) {
						toaster.pop('success', '下架成功');
                        $scope.isSoldOut = false;
						$scope.loadGoodsList();
					} else {
						toaster.pop('error', map.message);
					}
				}, function(){
					toaster.pop('error', '下架失败');
				});
			} else {
				var modalInstance = $modal.open({
					templateUrl : $rootScope.rootPath + "/static/view/vendor/modal/discharge_commodity_modal.html",
					controller : "GoodsDischargeCtrl",
					size : "lg",
					resolve : {
						goods : function() {
							console.log(commodity);
							return angular.copy(commodity);
						}
					}
				});
				modalInstance.result.then(function() {
					$scope.loadGoodsList();
				}, function() {
				});
			}
		};

        // 取消删除的操作
        $scope.cancleSoldOut = function () {
            $scope.isSoldOut = false;
            $scope.soldOutCommodity = null;
        }

        // 点击下架操作
        $scope.soldOut = function (commodity) {
            $scope.isSoldOut = true;
            $scope.soldOutCommodity = commodity;
        }

		/**
		 * 重新上架已下架商品
		 *
		 * @param commodity		待上架上商品
		 */
		$scope.putOnCommodityOnce = function (commodity) {
			Goods.putOnCommodityOnce({ batchCode : commodity.batchCode}, {}, function (result) {
				if (result.success) {
					toaster.pop("info", "商品重新上架成功");
					$scope.loadGoodsList();
				} else {
					toaster.pop("error", result.message);
				}
			}, function () {
				toaster.pop("error", "商品重新上架失败");
			});
		};

		// 下载模板
		$scope.download = function() {
			var show = SessionService.get($scope.userInfo.userUU + "-releasetip");
			if(!show) {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl : $rootScope.rootPath + '/static/view/vendor/modal/releaseProductByBatchTip.html',
					controller : 'releaseProductByBatchTipCtrl',
				});

				modalInstance.result.then(function(response) {
				}, function(res) {
					window.location.href = $rootScope.rootPath + '/trade/goods/release/template';
				});
			}else {
				window.location.href = $rootScope.rootPath + '/trade/goods/release/template';
			}
		};


		// 分页操作
		$scope.topage = function(num) {
			if ($scope.topagenum !== null) {
				$scope.topagenum = null;
			}
			if (num < 1) {
				num = 1;
			} else if (num > $scope.pageParams.totalPages) {
				num = $scope.pageParams.totalPages;
			}
			$scope.relTableParams.page(num);
			$scope.relTableParams.reload();
		};

		//编辑
		$scope.editProInfo = function(cmp) {
			console.log(cmp);
			var modalInstance = $modal.open({
				animation: true,
				templateUrl : 'static/view/vendor/modal/edit_proInfo_modal.html',
				controller : 'editProInfoCtrl',
				resolve : {
					ProInfo : function() {
						return cmp;
					}
				}
			});

			modalInstance.result.then(function(response) {

			}, function() {

			});
		};

		//通过id删除
		$scope.deleteById = function(cmp, index) {
			ReleaseProductByBatch.deleteProInfo({id: cmp.id}, {}, function(data) {
				toaster.pop("success","提示","删除成功");
				$scope.proInfo.splice(index, 1);
			}, function(res) {
				toaster.pop("error","提示","删除失败");
			});
		};

		//查询
		$scope.getAllInfo = function () {
			var userUU = $scope.userInfo.userUU;
			ReleaseProductByBatch.findAll({}, userUU,function(data) {
				$scope.proInfo = data;
			}, function(res) {
				toaster.pop("error", "提示", "暂未查询到相关信息");
			});
		};

		$scope.checks = { checked : false };// 全选框

		// 复选框
		$scope.checkAll = function() {
			angular.forEach($scope.proInfo, function(cmp) {
				if(cmp.releaseCode == 104 || cmp.releaseCode == 103 || cmp.releaseCode == 101) {
					cmp.checked = false;
				}else {
					cmp.checked = $scope.checks.checked;
				}
			});
		};

		//单选
		$scope.checkOne = function(cmp) {
			if(cmp.releaseCode == 104 || cmp.releaseCode == 103 || cmp.releaseCode == 101) {
				cmp.checked = false;
			}
		};

		//器件申请
		$scope.cmpApply = function(cmp) {
			var url = null;
			if(cmp) {
				var code = cmp.code;
				SessionService.set("cmpCode", angular.toJson(code));
				url = "products/componentEdit/detail/create/";
			}
			$window.open(url);
		};

		//品牌申请
		$scope.brandApply = function(cmp) {
			console.log(cmp);
			var url = null;
			if(cmp) {
				SessionService.set("brandNameEn", cmp.brandNameEn);
				SessionService.set("brandNameCn", cmp.brandNameCn);
				url = "product/brandEdit/create/";
			}
			$window.open(url);
		};

		//批量删除
		$scope.deleteByQuery = function() {
			var ids = [];
			angular.forEach($scope.proInfo, function(info) {
				console.log(info);
				if(info.checked) {
					ids.push(info.id);
				}
			});
			if(ids.length != 0) {
				ReleaseProductByBatch.deleteByQuery({}, ids, function(data) {
					toaster.pop("success", "提示", "删除成功,共删除"+ids.length+"个产品！");
					angular.forEach(ids, function(id) {
						var arr = [];
						angular.forEach($scope.proInfo, function(cmp) {
							if(cmp.id != id) {
								arr.push(cmp);
							}
						});
						$scope.proInfo = arr;
					});
					$scope.checks = { checked : false };
				}, function(res) {
					toaster.pop("error", "提示", "删除失败");
				});
			} else {
				toaster.pop("info", "提示", "未选择商品");
			}

		};


        /**
         * 下载当前页的订单信息
         */
        $scope.localInfo = {};
        $scope.downGoods = function () {
            var listId = getDownLoadGoodsId();
            if(listId.length < 1) {
                toaster.pop('warning', '当前需要下载的订单条数为0');
                return ;
            }
            Loading.show();
            $scope.localInfo.ids = listId.join("-");
            $scope.$apply();
            var form = document.getElementById('down-load-goods');
            form.action = 'trade/goods/down/ids';
            form.submit();
            var clockID = null;
            var getDownLoadStatus = function () {
                $.ajax({
                    url : 'trade/goods/down/ids',
                    data : {isAjax : true, ids : $scope.localInfo.ids},
                    method : 'GET',
                    dataType : 'json',
                    success : function (data) {
                        if(data.loading) {
                            clockID = setInterval(function() {
                                getDownLoadStatus()
                            }, 500);
                        }else {
                            $scope.$apply(function () {
                                toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                                Loading.hide();
                            });
                            if(!clockID) {
                                clearInterval(clockID);
                            }
                        }
                    },
                    error : function () {
                        Loading.hide();
                        if(!clockID) {
                            clearInterval(clockID);
                        }
                    }
                });
            }
            getDownLoadStatus();
        }

        /**
         * 获取当前需要下载的在售产品信息的ID
         */
        var getDownLoadGoodsId = function() {
            var goodsID = [];
            angular.forEach($scope.goodsPageParams.content, function (good) {
                goodsID.push(good.id);
            });
            return goodsID;
        }

	}]);

	app.register.controller('editProInfoCtrl',['$scope', '$modalInstance', 'ReleaseProductByBatch', 'ProInfo', 'toaster', function($scope, $modalInstance, ReleaseProductByBatch, ProInfo, toaster) {
		$scope.proInfo = ProInfo;
		$scope.proInfo.qtyPrice = angular.fromJson($scope.proInfo.qtyPrice);
		$scope.pricesList = [];
		$scope.pricesList = angular.copy($scope.proInfo.qtyPrice);
		$scope.addPrice = function() {
			if ($scope.pricesList.length > 2) {
				toaster.pop('info', '提示', '最大分段为3');
			} else {
				$scope.pricesList.push({start: parseInt($scope.proInfo.prices[$scope.proInfo.prices.length - 1].end) + 1,
					rMBPrice: '', uSDPrice:''});
			}
		};

		$scope.deletePrice = function(index) {
			$scope.pricesList.splice(index, 1);
		};

		$scope.updateInfo = function(proInfo) {
			proInfo.qtyPrice = angular.toJson(proInfo.qtyPrice);
			delete proInfo.usdSegPriceList;
			delete proInfo.rmbSegPriceList;
			console.log(proInfo);
			ReleaseProductByBatch.updateProInfo({}, proInfo, function(data) {
				toaster.pop("success", "提示", "保存成功");
				$modalInstance.close();
			}, function(res) {
				toaster.pop("error", "提示", "保存失败");
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);

	app.register.controller('releaseProductByBatchTipCtrl', ['$scope', '$modalInstance', 'SessionService', function($scope, $modalInstance, SessionService) {
		$scope.IKnow = function() {
			$modalInstance.dismiss();
		};

		$scope.donShowAgain = function() {
			var show = SessionService.set($scope.userInfo.userUU + "-releasetip", 1);
			$modalInstance.dismiss();
		};
	}]);

	//物料对应管理的控制器
	app.register.controller('materialMappingCtrl', ['$scope', 'materialMappingServices', 'toaster', function($scope, materialMappingServices, toaster) {

		//页的信息参数的设置
		$scope.param ={};
		$scope.param.page = 1;
		$scope.param.count = 10;

		//获取物料对应的数据
		var getData = function() {
			materialMappingServices.getPageMaterialMapping($scope.param, function(data) {
				$scope.pageMaterialMapping = data;
			}, function (response) {
				toaster.pop('warning', '获取物料对应关系有误，请重新刷新界面');
			});
		};

		getData();

		//删除指定id的物料对应关系
		$scope.deleteMaterialMapping = function(id) {
			if(!id || id == '') {
				return ;
			}
			materialMappingServices.deleteMaterialMapping({id : id}, function () {
				toaster.pop('success', '删除成功');
			}, function (response) {
				console.log(response);
				toaster.pop('error', '删除失败，请重新删除');
			});
		}

		//保存物料对应关系
		$scope.saveMaterialMapping = function () {
			//TODO需要判断对应的数据是否正确
			materialMappingServices.saveMaterialMapping(null, {}, function (data) {
				console.log(data);
				toaster.pop('success', '新增物料对应成功');
			}, function (response) {
				toaster.pop('error', '保存信息失败，请重新操作');
			});
		}

	}]);

    //修改待发布的信息
    app.register.controller('editBatchCommodity', ['$scope', function ($scope) {
        console.log('ok');
    }]);
});
