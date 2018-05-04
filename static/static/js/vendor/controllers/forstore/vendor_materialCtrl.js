define([ 'app/app', 'jquery-uploadify' ], function(app) {
	'use strict';
	app.register.controller('vendor_materialCtrl', ['$scope', '$rootScope', 'Material', 'toaster', 'ComponentActive', 'Enterprise', '$q', 'NumberService', '$location', '$stateParams', 'Search', '$modal', 'ComponentActiveAPI', 'BrandSubmit', 'BrandActiveAPI', 'DistributionRule', 'prodRepositoryService', 'AuthenticationService', 'StoreInfo', 'ProductServiceQuery', 'StoreCms', 'ByteCountService', 'Goods', 'UASBatchPutOnPropertyServices', '$filter', function ($scope, $rootScope, Material, toaster, ComponentActive, Enterprise, $q, NumberService, $location, $stateParams, Search, $modal, ComponentActiveAPI, BrandSubmit, BrandActiveAPI, DistributionRule, prodRepositoryService, AuthenticationService, StoreInfo, ProductServiceQuery, StoreCms, ByteCountService, Goods, UASBatchPutOnPropertyServices, $filter) {
		$rootScope.active = 'vendor_material';
		document.title = '卖家产品库-优软商城';
		$scope.tab = 'material';
		$scope.standard_tab = $stateParams.standardParam ? $stateParams.standardParam : 'unstandard';
		$scope.choosedIds = [];
		$scope.showTip = true;
		$scope.resultTip = true;
		$scope.$$nonProduct = {};
        $scope.$$nonProduct.deleteDiv = false;
		$scope.$$nonProduct.deleteGoods = false;
		$scope.$$nonProduct.deleteMaterial = false;
		$scope.$$nonProduct.selfTagNoticeShow = false;
		$scope.$$nonProduct.count = 10;

		$scope.$$nonProduct.enterSaveButton = false;

		$scope.$$nonProduct.enterBatchPutOnPropertySaveButton = false;

		// $scope.salePrice = 0;

		$scope.setSalePrice = function (price) {
			$scope.uasBatchPutOnProperty.editFluctuateRate = price;
		}

		$scope.onSalePriceChange = function (salePrice) {
			if ($scope.uasBatchPutOnProperty.editFluctuateRate < 1) {
				$scope.uasBatchPutOnProperty.editFluctuateRate = 1;
			} else if ($scope.uasBatchPutOnProperty.editFluctuateRate > 200) {
				$scope.uasBatchPutOnProperty.editFluctuateRate = 200;
			}
		}

		/**
		 * 最大
		 * @type {number}
		 */
		$scope.maxReserve = 999999999;

		$scope.packageArray = ["请选择", "Bulk-散装", "Reel-卷装", "Tape/Reel-编带", "Tray-盘装",
			"Tube-管装", "盒装", "袋装", "罐装", "瓶装", "桶装", "箱装"];

		$scope.showText = function (item) {
			$scope.goods.editPackaging = item;
		};
		
		$scope.showClickText = function (goods, item) {
			goods.editPackaging = item;
		};

		/**
		 * 最小包装量的最大值
		 */
		$scope.maxPackQty = 999999;
		$scope.minReserve = 1;

		//只包含中文和英文的字符
		var pattern = /^[\u4e00-\u9fa5a-zA-Z]+$/;
		$scope.deleteDiv = false;

		//数字的正则表达式
		var intPattern = /^[1-9]+$/;

		$scope.isInt = /^[0-9]*[1-9][0-9]*$/;

		$scope.param = {
			page : 1,
			count : 10,
			sorting : {
				id : 'DESC'
			},
			isStandard : true,
			type : "nStandard"
		};

		$scope.goods = { editBreakUp: false, editSelfSale: 2, editPrices: [{}] };

        $scope.sortByERP = 'none';
        $scope.sortByERPReserve = function () {
			if ($scope.sortByERP == 'none') {
				$scope.sortByERP = 'DESC'
			} else if ($scope.sortByERP == 'DESC') {
				$scope.sortByERP = 'ASC'
			} else {
				$scope.sortByERP = 'none'
			}
			$scope.param.sorting = $scope.sortByERP == 'none' ? {id : 'DESC'} : {'erpReserve': $scope.sortByERP};
			// $scope.sortByERP = type == $scope.sortByERP ? 'none' : type;
			loadData();
		}
        //
		// var startWith = function (str, s) {
		// 	var reg = new RegExp(str + '$');
		// 	return reg.test(str);
		// };
        //
		// if (startWith($location.$$path, 'vendor_material_unstandard_erp')) {
		// 	$scope.tab = 'unstandard_material';
		// 	// $scope.standard_tab = 'unstandard';
         //    $scope.param.type = "nStandard";
         //    // $scope.param.sorting = {code : 'ASC'};
         //    $scope.isBatch = false;
		// }

		$scope.goods = { breakUp: 1, isSelfSupport: 1, prices: [{}] };
		$scope.isSelfSupport = true;
		$scope.showShelfArea = showShelfArea;
		$scope.closeShelArea = closeShelArea;

		$scope.setPriceMinAmount = setPriceMinAmount;
		$scope.setPriceMaxAmount = setPriceMaxAmount;
		$scope.setPriceMinPackAmount = setPriceMinPackAmount;

		$scope.checkMinDelivery = checkMinDelivery;
		$scope.checkMaxDelivery = checkMaxDelivery;

		$scope.isRecommendGoods = isRecommendGoods;
		$scope.editGoods = editGoods;

		$scope.closeEditGoods = closeEditGoods;

		//添加产品
		$scope.addGoods = addGoods;
		//上架
		$scope.putOn = putOn;
		//更新库存信息
		$scope.updateGoods = updateGoods;

		$scope.error = {};

		//获取币别信息
		var deferred = $q.defer();
		Enterprise.getCurrencyByRegisterAddress(null, function (data) {
			deferred.resolve(data);
		}, function (response) {
			deferred.reject(response);
		});

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
				if (!$scope.storeInfo || $scope.storeInfo.status != 'OPENED' || $scope.storeInfo.storeName.indexOf('优软测试二') > -1 || $scope.storeInfo.storeName.indexOf('优软商城') > -1) {
					$scope.$$nonProduct.canSelfSale = false;
				} else {
					$scope.$$nonProduct.canSelfSale = true;
				}
            }, function(response) {
                toaster.pop('error', '获取店铺的信息失败, ' + response.data);
            });
        });

		$scope.cancelTip = function () {
			$scope.showTip = false;
		};

		$scope.deleteImg = function (obj) {
			delete obj.editPic;
		};

		var currencyPromise = deferred.promise;

		$q.all([currencyPromise, $rootScope.storePromise]).then(function (result) {
			console.log(result);
			var curData = result[0];
			if(!$scope.store) {
				$scope.store = {};
			}
			if((curData != null) && (curData.code == 1)) {
				if(curData.data == 'USD') {
					$scope.store.enType = 'HK'
				}else {
					$scope.store.enType = 'MAINLAND'
				}
			}else {
				$scope.store.enType = 'MAINLAND';
				toaster.pop('info', '提示', '您公司的注册地址为空，无法确定币别，系统默认为人民币');
				// $scope.onsale.currency = 'RMB';
			}
		})['catch'](function (error) {
			if(!$scope.store) {
				$scope.store = {};
			}
			var curData = error[0];
			if((curData != null) && (curData.code == 1)) {
				if(curData.data == 'USD') {
					$scope.store.enType = 'HK';
				}else {
					$scope.store.enType = 'MAINLAND';
				}
			}else {
				$scope.store.enType = 'MAINLAND';
			}
		});

        /**
         * 获取批量上架的配置信息
         */
        UASBatchPutOnPropertyServices.get(null, function (data) {
            if (data && typeof data.fluctuateRate != 'undefined') {
                $scope.uasBatchPutOnProperty = data;
                $scope.uasBatchPutOnProperty.editFluctuateRate = NumberService.mul($scope.uasBatchPutOnProperty.fluctuateRate, 100) || 100;
                $scope.uasBatchPutOnProperty.editMaxDelivery = $scope.uasBatchPutOnProperty.maxDelivery || 10;
                $scope.uasBatchPutOnProperty.editMinDelivery = $scope.uasBatchPutOnProperty.minDelivery || 1;
            } else {
				$scope.uasBatchPutOnProperty = {};
                $scope.uasBatchPutOnProperty.editFluctuateRate = 100;
                $scope.uasBatchPutOnProperty.editMaxDelivery = 10;
                $scope.uasBatchPutOnProperty.editMinDelivery = 1;
            }
        }, function (response) {
            console.log(response);
        });

		/**
		 * 切换标准/非标准
		 * @param isStandard
		 */
		$scope.toggleStandard = function (isStandard) {
			if ($scope.standard_tab == 'matchResult') {
				$scope.lastMaterial = $scope.currenctMaterial;
			}
			$scope.standard_tab = isStandard;
			$scope.param.keyword = '';
			if ($scope.chooseAllPage) {
				$scope.chooseAllPage = false;
			}
			if (isStandard == 'standard')
				$scope.param.type = "standard";
			if (isStandard == 'unstandard')
				$scope.param.type = "nStandard";
			$scope.isBatch = false;
			$scope.param.count = 10;
			loadDataReload();
		};

		var updateTagCount = function () {
			Material.getCountOfProduct({}, {}, function (data) {
				if (data){
					$scope.sCount = data.standard;
					$scope.nCount = data.nStandard;
				}
			}, function (error) {
				toaster.pop("error", error.data);
			})
		};

		// 进入批量操作
		$scope.enterBatch = function () {
			closeAllEditStatus();
			$scope.isBatch = true;
			$scope.isChoosedAll = false;
		};

		// 取消批量操作
		$scope.exitBatch =function () {
			$scope.isBatch = false;
			$scope.choosedIds = [];
			$scope.isChoosedAll = false;
			angular.forEach($scope.currenctMaterial, function (material) {
				material.isChoosed = false;
			});
		};

		// 全选
		$scope.chooseAllItem = function () {
			$scope.chooseAll = !$scope.chooseAll;
			$scope.cancelTip();
			angular.forEach($scope.currenctMaterial, function (material) {
				material.isChoosed = $scope.chooseAll;
			});
			if (!$scope.chooseAll) {
				$scope.chooseAllPage = false;
			}
		};

		$scope.turnAllPage = function () {
			if ($scope.chooseAll) {
				$scope.chooseAllPage = true;
			}
		};

		$scope.cancelAllPage = function () {
			$scope.chooseAllPage = false;
			$scope.chooseAll = false;
			angular.forEach($scope.currenctMaterial, function (material) {
				material.isChoosed = false;
			});
		};

		// 检查是否全选
		var checkChoosedAll = function () {
			$scope.chooseAll = true;
			angular.forEach($scope.currenctMaterial, function (material) {
				if (!material.isChoosed) {
					$scope.chooseAll = false;
				}
			});
			if (!$scope.chooseAll) {
				$scope.chooseAllPage = false;
			}
		};

		// 单选
		$scope.chooseOne = function (material) {
			if (typeof material.isChoosed == 'undefined' || !material.isChoosed) {
				material.isChoosed = true;
			} else {
				material.isChoosed = false;
			}
			checkChoosedAll();
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

		//获取选中之后的信息
		$scope.getChoosedInfo = function () {
			$scope.choosedIds = [];
			angular.forEach($scope.currenctMaterial, function (material) {
				if (material.isChoosed) {
					$scope.choosedIds.push(material.id);
				}
			});
		};

		// 确认删除
		$scope.confirmDelete = function (ids) {
			if ($scope.isChoosedAll) {
				if ($scope.standard_tab == 'standard') {
					Material.deleteStandardAll(null, null, function (data) {
						$scope.deleteDiv = false;
						loadDataReload();
						if (data.code != 1) {
							toaster.pop('error', data.message);
						} else {
							toaster.pop('success', data.message);
						}
					}, function (response) {
						toaster.pop('error', '批量删除信息失败');
					});
				} else {
					Material.deleteUnstandardAll(null, null, function (data) {
						$scope.deleteDiv = false;
						loadDataReload();
						if (data.code != 1) {
							toaster.pop('error', data.message);
						} else {
							toaster.pop('success', data.message);
						}
					}, function (response) {
						toaster.pop('error', '批量删除信息失败');
					});
				}
			} else {
				var ids = $scope.choosedIds.join(',');
				Material.deleteBatch({ids: ids}, function (data) {
					toaster.pop('success', '删除成功');
					$scope.choosedIds = [];
					$scope.deleteDiv = false;
					loadDataReload();
				}, function (response) {
					toaster.pop('error', response.data);
					$scope.choosedIds = [];
					$scope.deleteDiv = false;
				});
			}
		};

		/**
		 * 对自定义的标签说明做隐藏或显示
		 */
		$scope.selfTagTaggle = function (status) {
			$scope.$$nonProduct.selfTagNoticeShow = status;
		};

		// 取消删除
		$scope.cancleDelete = function () {
            $scope.$$nonProduct.deleteDiv = false;
		};

		/**
		 * 关闭所有的编辑和展开状态
		 */
		var closeAllEditStatus = function (goods) {
			angular.forEach($scope.currenctMaterial, function (material) {
				if(goods) {
					if(goods.productid != material.id) {
						delete material.selected;
						material.addGoodsOper = false;
						material.exPandOper = false;
					}
				}else {
					delete material.selected;
					material.addGoodsOper = false;
					material.exPandOper = false;
				}

				angular.forEach(material.goodsArr, function (g) {
					if(goods) {
						if(goods.id != g.id) {
							goods.edit = false;
						}
					}
				});
			});
		};
		// 批量删除
		$scope.deleteBatch = function () {
            $scope.getChoosedInfo();
            if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
                toaster.pop('info', '请选择要删除的信息');
                return ;
            }
            closeAllEditStatus();
            $scope.$$nonProduct.deleteDiv = true;
            $scope.$$nonProduct.deleteGoods = false;
            $scope.$$nonProduct.deleteMaterial = true;
            $scope.$$nonProduct.deleteMessage = '';
            $scope.opendeleteModal();
		};

		// 单个删除
		$scope.deleteMaterial = function(material) {
			if (!material || !material.id) {
				return ;
			}
			Goods.getDeleteProductMessage({productid: material.id}, function (data) {
				console.log(data);
				if (data.code == 1) {
					$scope.$$nonProduct.deleteMessage = data.message;
					$scope.choosedIds = [];
					$scope.choosedIds.push(material.id);
					$scope.$$nonProduct.deleteGoods = false;
					$scope.$$nonProduct.deleteMaterial = true;
					$scope.opendeleteModal();
				} else {
					toaster.pop('warning', '提示', data.message);
				}
			}, function (response) {
				toaster.pop('error', '错误', response.data);
			});
		};

		/**
		 * 打开删除的模态框
		 */
		$scope.opendeleteModal = function () {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'static/view/common/modal/delete_modal.html',
				controller: 'vendor_delete_ctrl',
				resolve: {
					ids: function() {
						return $scope.choosedIds;
					},
					deleteMaterial: function () {
						return $scope.$$nonProduct.deleteMaterial;
					},
					deleteGoods: function () {
						return $scope.$$nonProduct.deleteGoods;
					},
					selectAll : function () {
						return $scope.chooseAllPage;
					},
					standard_tab : function () {
						return $scope.standard_tab;
					},
					message : function () {
						return $scope.$$nonProduct.deleteMessage;
					}

				}
			});
			modalInstance.result.then(function(response){
				if($scope.$$nonProduct.deleteMaterial) {
					$scope.choosedIds = [];
					loadDataReload();
				}else if($scope.$$nonProduct.deleteGoods) {
					if(!response || !response.id) {
						loadData();
					}
					for(var i = 0; i < $scope.currenctMaterial.length; i++) {
						if($scope.currenctMaterial[i].id == response.id) {
                            $scope.currenctMaterial[i].batchCount--;
                            if ($scope.currenctMaterial[i].batchCount < 1) {
                                $scope.currenctMaterial[i].exPandOper = false;
                            }
                            for(var j = 0; j < $scope.currenctMaterial[i].goodsArr.length; j++) {
                                if ($scope.choosedIds[0] == $scope.currenctMaterial[i].goodsArr[j].id) {
                                    $scope.currenctMaterial[i].goodsArr.splice(j, 1);
                                }
                            }
							// $scope.currenctMaterial.splice(i, 1, response);
						}
					}
				}
			}, function(){
			});
		};

		//获取该物料的产品信息
		$scope.expandGoods = function (material, addGoods) {
			if(!material || !material.id) {
				return ;
			}
			Material.getGoodsByProductId({id: material.id}, function (data) {
                material.goodsArr = data;
				angular.forEach($scope.currenctMaterial, function (material) {
					if(material.selected){
						delete material.selected;
					}
					material.exPandOper = false;
					material.addGoodsOper = false;
				});
				$scope.goods.editReserve = material.erpReserve;
				if ('ERP' == material.sourceApp || material.sourceId) {
					angular.forEach(material.goodsArr, function (goods) {
						if (goods.status != 612) {
							$scope.goods.editReserve = $scope.goods.editReserve - goods.reserve;
						}
					});
					$scope.goods.editReserve = $scope.goods.editReserve < 0 ? 0 : $scope.goods.editReserve;
					$scope.goods.maxReserve = $scope.goods.editReserve;
					$scope.goods.sourceApp = 'ERP';
				}

				angular.forEach(material.goodsArr, function (goods) {

				});
				material.exPandOper = true;
				material.selected = true;
				if(addGoods) {
					material.addGoodsOper = true;
				}
            }, function (response) {
				toaster.pop('error', '错误', response.data);
            });
		};

        /**
         * 监听点击的事件，关闭删除的对话框
         * @param event
         */
        // document.onclick = function (event) {
        //     if(event) {
        //         var tag = event.target;
        //         while (tag && tag.nodeName != 'SECTION') {
        //             var name = tag.getAttribute('name');
        //             if(name && (name == 'delete-modal' || name == 'delete-material')) {
        //                 return ;
        //             }
        //             console.log(name);
        //             tag = tag.parentElement;
        //         }
        //         $scope.$apply(function () {
			// 		$scope.cancleDelete();
			// 	});
        //     }
        // };

		/**
		 * 在售产品信息收起
		 */
		$scope.disExpandGoods = function (material) {
			if (!material) {
				return ;
			}
			if (material.selected) {
				delete material.selected;
			}
			material.exPandOper = false;
			material.addGoodsOper = false;

		};

		/**
		 * 是否被推荐
		 * @param goods
		 */
		function isRecommendGoods(goods) {
			if(!goods) {
				return ;
			}
            $scope.$$nonProduct.deleteMessage = '';
			closeAllEditStatus(goods);
			$scope.choosedIds = [];
			Goods.isRecommendGoods({id: goods.id}, null, function (data) {
				$scope.$$nonProduct.deleteGoods = true;
				$scope.$$nonProduct.deleteMaterial = false;
                $scope.$$nonProduct.deleteDiv = true;
				if(data.code == 1) {
					if(goods.status == '601' || goods.status == '602') {
						$scope.$$nonProduct.deleteMessage = '该产品已上架';
					}
				}else {
					$scope.$$nonProduct.deleteMessage = data.message;
				}
				$scope.choosedIds.push(goods.id);
				$scope.opendeleteModal();
			}, function (response) {
				toaster.pop('error', '错误', response.data);
			});
		};

		/**
		 * 编辑在售产品的信息
		 * @param goods
		 */
		function editGoods(material, goods) {
			angular.forEach(material.goodsArr, function (g) {
				g.edit = false;
			});
			if (material.sourceApp == 'ERP' || material.sourceId) {
				material.averMonthSalePrice = (material && material.price) ? material.price : 0;
			}
            $scope.$$nonProduct.editGoods = angular.copy(goods);
			goods.edit = true;

            goods.editTag = goods.tag;
            goods.editTagInvalid = false;
            goods.editTagPre = goods.tag;

            goods.editPackaging = goods.packaging;
            goods.editPackagingInvalid = false;
            goods.editPackaginPre = goods.packaging;

            goods.editProduceDate = goods.produceDate;
            goods.editProduceDateInvalid = false;
            goods.editProduceDatePre = goods.produceDate;

            goods.editReserve = goods.reserve;
            goods.editReserveInvalid = false;
            goods.editReservePre = goods.reserve;

            goods.editMinPackQty = goods.minPackQty;
            goods.editMinPackQtyPre = goods.minPackQty;
            goods.editMinPackQtyInValid = false;

            goods.editMinBuyQty = goods.minBuyQty;
            goods.editMinBuyQtyPre = goods.minBuyQty;
            goods.editMinBuyQtyInValid = false;

            goods.editMinDelivery = goods.minDelivery;
            goods.editMinDeliveryPre = goods.minDelivery;
            goods.editMinDeliveryinValid = false;

            goods.editMaxDelivery = goods.maxDelivery;
            goods.editMaxDeliveryPre = goods.maxDelivery;
            goods.editMaxDeliveryinValid = false;

            goods.editSelfSale = $scope.storeInfo.uuid != 'undefind' && goods.storeid == $scope.storeInfo.uuid && $scope.storeInfo.storeName.indexOf('优软测试二') < 0 && $scope.storeInfo.storeName.indexOf('优软商城') < 0 ? 1 : 2;
            goods.editBreakUp = goods.breakUp;
            goods.editPrices = angular.copy(goods.prices);
            angular.forEach(goods.editPrices, function (price) {
                price.startPre = price.start;
                price.startDirty = false;

                price.endPre = price.end;
                price.endDirty = false;

                price.rMBPricePre = price.rMBPrice;
                price.rMBPriceDirty = false;

                price.uSDPricePre = price.uSDPrice;
                price.uSDPriceDirty = false;
            });
			goods.editPic = goods.img;
		};

		/**
		 * 取消编辑
		 * @param goods
		 */
		function closeEditGoods(material, goods) {
            //替换之前的信息
            if(!material || !material.goodsArr || !goods || !$scope.$$nonProduct.editGoods) {
                return ;
            }
            for(var i = 0; i < material.goodsArr.length; i++) {
                if(material.goodsArr[i].id == goods.id) {
                    material.goodsArr.splice(i, 1, $scope.$$nonProduct.editGoods);
                    break;
                }
            };
		}

		/**
		 * 更新非标的匹配信息
		 */
		$scope.updateNStandardOne = function (product) {
			if (product.matchresults.length > 0) {
				if (product.canMatch) {
					var matchProducts = {
						matchId: product.id,
						detailId: product.cmpId
					};
				}
			}
			prodRepositoryService.saveMatchInfo(null, matchProducts, function (data) {
				if (data.code == 1 && data.data) {
					$scope.backData = data.data;
					$scope.repeatList = data.data.repeatList;
					$scope.haveRepeat = true;
					// loadData();
					$scope.standard_tab = 'matchResult';
				} else {
					$scope.haveRepeat = false;
					$scope.matchSuccess = $scope.matchSuccess + 1;
					$scope.matchFail = $scope.matchFail - 1;
					loadData();
				}
			}, function () {
				toaster.pop("error", "匹配失败")
			});
		};

		$scope.cancelChoose = function () {
			angular.forEach($scope.repeatList, function (item) {
				if (item.selected){
					delete item.selected;
				}
			});
			$scope.haveRepeat = false;
		};

		$scope.deleteIdArray = [];
		$scope.ensureDeleteRepeat = function () {
			$scope.deleteIdArray = [];
			for (var i = 0; i < $scope.repeatList.length; i++) {
				if (!$scope.repeatList[i].selected) {
					toaster.pop("info", "请选择要保留的产品信息");
					return ;
				} else {
					angular.forEach($scope.repeatList[i], function (goods) {
						if (goods.id != $scope.repeatList[i].selected){
							$scope.deleteIdArray.push(goods.id);
						}
					});
				}
			}
			if ($scope.deleteIdArray.length != $scope.repeatList.length) {
				toaster.pop("info", "请选择要保留的产品信息");
				return ;
			}

			Material.updateInfoAfterChoose({beforeId:$scope.backData.beforeId, afterId:$scope.backData.afterId, resultId:$scope.backData.resultId}, $scope.deleteIdArray, function (data) {
				if (data.success) {
					$scope.haveRepeat = false;
					$scope.matchSuccess = $scope.matchSuccess + 1;
					$scope.matchFail = $scope.matchFail - 1;
					$scope.deleteIdArray = [];
					loadData();
				}
			}, function (error) {
				toaster.pop("error", error.data);
			})
		};
		/**
		 * 修改图片信息
		 */
		$scope.editGoodsPicture = function(pic, material) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/vendor/modal/edit_goods_modal.html',
				size : 'md',
				controller : 'editPictureCtrl',
				resolve : {
					pic : function() {
						return pic;
					}
				}
			});
			modalInstance.result.then(function (editPic) {
				if(editPic) {
					material.editPic = editPic;
				}
			}, function() {

			});
		}

		// 单个匹配
		$scope.match = function (material) {
			if (!material.cmpCode) {
				toaster.pop('info', '该产品尚无产品型号，无法匹配');
				return;
			}
			if (!material.brand) {
				toaster.pop('info', '该产品尚无品牌信息，无法匹配');
				return;
			}

			Material.match({id : material.id}, function (data) {
				toaster.pop('success', '匹配成功， 可前往“标准产品”中 , 编辑上架。');
				loadDataReload();
			}, function (response) {
				toaster.pop('info', response.data);
			});
		};

		$scope.fitCountToTable = function (count) {
			console.log($scope.$$nonProduct.count);
			$scope.$$nonProduct.count = count;
			$scope.param.count = $scope.$$nonProduct.count;
			loadData();
		};

		$scope.toggleTab = function (status) {
			$scope.param.type = 'nStandard';
			$scope.param.count = $scope.$$nonProduct.count;
			if (status == 'matchResult') {
				$scope.currenctMaterial = $scope.lastMaterial;
				$scope.materialAll = {};
			} else {
				loadData();
			}
			$scope.standard_tab = status;
		};

		$scope.closeResultFrame = function (status) {
			$scope.standard_tab = status;
			$scope.resultFrame = false;
			$scope.param.type = 'nStandard';
			loadData();
		};

		$scope.closeTip = function () {
			$scope.resultTip = false;
		};

		var loadSelectedData = function () {
			$scope.materialAll = {};
			Material.getDataByBatch({batch:$scope.batch}, function (data) {
				$scope.currenctMaterial = data;
			});
		};

		// 一键匹配
		$scope.matchAll = function () {
			if ($scope.chooseAllPage) {
				Material.matchNonProduct({}, {}, function (data) {
					if (data.success) {
						$scope.resultFrame = true;
						$scope.matchTotal = data.data.total;
						$scope.matchSuccess = data.data.success;
						$scope.matchFail = data.data.fail;
						$scope.standard_tab = 'matchResult';
						$scope.param.type = "nStandard";
						loadData();
					} else {
						toaster.pop("info", data.message);
					}
				}, function (error) {
					toaster.pop("error", "匹配操作失败！")
				});
			} else {
				$scope.getChoosedInfo();
				if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
					toaster.pop("info", "您尚未选中任何产品");
					return ;
				}
				Material.matchSelected({}, $scope.choosedIds, function (data) {
					if (data.success) {
						$scope.resultFrame = true;
						$scope.matchTotal = data.data.total;
						$scope.matchSuccess = data.data.success;
						$scope.matchFail = data.data.fail;
						$scope.standard_tab = 'matchResult';
						$scope.batch = data.data.batch;
						$scope.currenctMaterial = [];
						loadSelectedData();
					} else {
						toaster.pop("error", data.message);
					}
				}, function (error) {

				})
			}
		};

        // 一键匹配erp
        $scope.matchAllForERP = function () {
            Material.matchNonProduct({}, {}, function (data) {
                if (data.success) {
                    $scope.resultFrame = true;
                    $scope.matchTotal = data.data.total;
                    $scope.matchSuccess = data.data.success;
                    $scope.matchFail = data.data.fail;
                    $scope.standard_tab = 'matchResult';
                    $scope.param.type = "nStandard";
                    loadData();
                } else {
                    toaster.pop("info", data.message);
                }
            }, function (error) {
                toaster.pop("error", "匹配操作失败！")
            });
		}

        // 一键添加到个人产品库
        $scope.setAllInPerson = function () {
            if ($scope.chooseAllPage) {
                if ('standard' == $scope.standard_tab) {
                	$scope.setPrArg = {isAll : 1, isStardand : 1};
				} else {
                    $scope.setPrArg = {isAll : 1, isStardand : 0};
				}
                Material.setAllProductsByPerson( $scope.setPrArg ,{}, function (data) {
                    if (data.success) {
                        toaster.pop("info", "绑定成功！");
                        loadData();
                    } else {
                        toaster.pop("info", data.message);
                    }
                }, function (error) {
                    toaster.pop("error", "绑定失败！")
                });
            } else {
                $scope.getChoosedInfo();
                if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
                    toaster.pop("info", "您尚未选中任何产品");
                    return ;
                }
                Material.setAllProductsByPerson({},$scope.choosedIds,function (data) {
                    if (data.success) {
                        toaster.pop("info", "绑定成功！");
                        loadData();
                    } else {
                        toaster.pop("error", data.message);
                    }
                }, function (error) {
                    toaster.pop("error", "绑定失败！")
                })
            }
        };

		function downloadByJs(url, keyword, type) {
			var form = $("<form>");   //定义一个form表单
			form.attr('style', 'display:none');   //在form表单中添加查询参数
			form.attr('target', '');
			form.attr('method', 'get');
			form.attr('action', url);

			var input1 = $('<input>');
			input1.attr('type', 'hidden');
			input1.attr('name', 'keyword');
			input1.attr('value', keyword);

			var input2 = $('<input>');
			input1.attr('type', 'hidden');
			input1.attr('name', 'type');
			input1.attr('value', type);

			$('body').append(form);  //将表单放置在web中
			form.append(input1);   //将查询参数控件提交到表单上
			form.append(input2);   //将类型参数控件提交到表单上
			form.submit();
		}

		function downloadSelectedByJs(url, idList) {
			var form = $("<form>");   //定义一个form表单
			form.attr('style', 'display:none');   //在form表单中添加查询参数
			form.attr('target', '');
			form.attr('method', 'get');
			form.attr('action', url);

			var input1 = $('<input>');
			input1.attr('type', 'hidden');
			input1.attr('name', 'idList');
			input1.attr('value', idList);

			$('body').append(form);  //将表单放置在web中
			form.append(input1);   //将查询参数控件提交到表单上
			form.submit();
		}

		// 下载模板
		$scope.download = function() {
			if ($scope.currenctMaterial && $scope.currenctMaterial.length == 0) {
				toaster.pop('info', '当前产品列表为空，无法下载');
				return;
			}
			if ($scope.chooseAllPage) {
				if ('standard' == $scope.standard_tab)
					downloadByJs('trade/products/template/download/type', $scope.param.keyword, 'standard');
				if ('unstandard' == $scope.standard_tab)
					downloadByJs('trade/products/template/download/type', $scope.param.keyword, 'nStandard');
			} else {
				$scope.getChoosedInfo();
				if (!$scope.choosedIds || $scope.choosedIds.length == 0) {
					toaster.pop("info", "您尚未选中任何产品");
					return ;
				}
				var idStr = $scope.choosedIds.join(',');
				downloadSelectedByJs('trade/products/template/selected/data', idStr);
			}
		};

		//初始化页数信息
		$scope.initPages = function (totalElementPages) {
			var pageNum = [];
			if(totalElementPages == 1) {
				return ;
			}else if(totalElementPages < 10) {
				for(var i = 0; i < totalElementPages + 2; i++) {
					pageNum.push(i);
				}
			}else {
				pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			}
			angular.forEach(pageNum, function (number) {
				var page = {active : true, type : 'page', number : number};
				if(number == 0) {
					page.type = 'prev';
				}else if(number == 1) {
					page.type = 'first';
				}else if(number == pageNum.length - 2) {
					page.type = 'last';
					page.number = totalElementPages;
				}else if(number == pageNum.length - 1){
					page.type = 'next';
				}
				$scope.pages.push(page);
			});
		};

		//当前页在前段的计算方式
		$scope.frontSegment = function (currentPage, totalElementPages) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 8:
						page.type = 'more';
						page.active = false;
						break;
					case 0:
						if(currentPage == 1) {
							page.active = false;
						}
					default : {
						page.current = (currentPage == page.number);
					}
				}
			});
		};

		//当前页在后端计算方式
		$scope.endSegment = function (currentPage, totalElementPages) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 2:
						page.active = false;
						page.type = 'more';
						break;
					case 10:
						if(currentPage == totalElementPages) {
							page.active = false;
						}
						break;
					case 0:
					case 1:
						break;
					default:
						if(page.number != totalElementPages) {
							page.number = totalElementPages - 9 + page.number;
						}
						page.current = (currentPage == page.number);
						break;
				}
			});
		};

		//当前页在中间计算方式
		$scope.middleSegment = function (currentPage) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 2:
					case 8:
						page.type ='more';
						page.active = false;
						break;
					case 3:
						page.number = currentPage - 2;
						break;
					case 4:
						page.number = currentPage - 1;
						break;
					case 5:
						page.number = currentPage;
						page.current = true;
						break;
					case 6:
						page.number = currentPage + 1;
						break;
					case 7:
						page.number = currentPage + 2;
						break;
				}
			});
		};

		//计算页数的方式。
		$scope.acculatePages = function(currentPage, totalElementPages) {
			$scope.pages = [];
			if(totalElementPages < 1)  {
				return ;
			}
			//初始化页面数据
			$scope.initPages(totalElementPages);

			if(totalElementPages < 10) {
				angular.forEach($scope.pages, function (page) {
					if(page.number == currentPage) {
						page.current = true;
					}
				});
			}else if(currentPage < 6) {//当期页小于6
				$scope.frontSegment(currentPage, totalElementPages);
			}else if(currentPage > totalElementPages - 5) { //当期页在后面
				$scope.endSegment(currentPage, totalElementPages);
			}else { //当期页在中间
				$scope.middleSegment(currentPage);
			}
		};

		//输入框监听Enter事件
		$scope.listenEnter = function () {
			if($scope.param.currentPage) {
				if(!intPattern.test($scope.param.currentPage)) {
					$scope.param.currentPage = $scope.param.page;
					return ;
				}
				if(parseInt($scope.param.currentPage) < 1) {
					$scope.param.currentPage = $scope.param.page;
					return ;
				}
			}
			if(event.keyCode == 13) {
				$scope.setPage("page", $scope.param.currentPage);
			}
		};

		$scope.setPage = function(type, number) {
			if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
				return ;
			};
			var page = -1;
			switch (type) {
				case "page":
					if(number < 1) {
						page = 1;
					}else if(number > $scope.materialAll.totalPages) {
						page = $scope.materialAll.totalPages;
					}else {
						page = number;
					};
					break;
				case "prev":
					if($scope.param.page <= 1) {
						page = 1;
					}else {
						page =$scope.param.page - 1;
					};
					break;
				case "next":
					if($scope.param.page >= $scope.materialAll.totalPages) {
						page = $scope.materialAll.totalPages
					}else {
						page =$scope.param.page + 1;
					}
					break;
				case "first":
					page = 1;
					break;
				case "last":
					page = $scope.materialAll.totalPages;
					break;
			}
			if(page == $scope.param.page || page < 1 || page > $scope.materialAll.totalPages) {
				$scope.param.currentPage = $scope.param.page;
				return ;
			}
			$scope.param.page = page;
			loadData();
		};

		var loadData = function () {
			Material.getAll($scope.param, function (data) {
				$scope.materialAll = data;
				$scope.currenctMaterial = data.content;
				updateTagCount();
				if ($scope.currenctMaterial.length == 0) {
					$scope.chooseAllPage = false;
				}
				angular.forEach($scope.currenctMaterial, function (material, index) {
					if ($scope.chooseAllPage) {
						material.isChoosed = true;
					} else {
						material.isChoosed = false;
					}
					material.submitProduct = {
						brand: {},
						commponent: {},
						kind: {}
					}
					//第一个自动展开
					if (index == 0 && $stateParams.standardParam && ($stateParams.standardParam =='standard' || $stateParams.standardParam =='unstandard')) {
						material.selected = true;
						if ('ERP' == material.sourceApp || material.sourceId)
							getProductDetail(material);
					}
				});
				$scope.param.currentPage = data.number;
				$scope.acculatePages(data.number, data.totalPages);
				$scope.choosedIds = [];
				$scope.chooseAll = false;
			}, function (response) {

			})
		};

		$scope.onSearch = function () {
			loadDataReload();
		};

		var loadDataReload = function () {
			$scope.param.page = 1;
			loadData();
		};

		var init = function () {
			$scope.param.keyword = '';
			if ($scope.standard_tab == 'standard') {
				$scope.param.type = "standard";
			} else if ($scope.standard_tab == 'unstandard') {
				$scope.param.type = "nStandard";
			}
			$scope.isBatch = false;
			$scope.param.count = 10;
		};

		init();

		loadData();

		var saveNoSaleInfo = function (product) {
			// $scope.goods.breakUp = 1 === $scope.goods.breakUp;

		};

		var saveSoldInfo = function (product) {
			Goods.updateGoods(null, $scope.goods, function(data){
				if(data.code == 1) {
					product.exPandOper = true;
					toaster.pop('success', '修改成功');
				}else {
					toaster.pop('warning', '失败', data.message);
				}
			}, function(response){
				toaster.pop('error', '修改失败', response.data);
			});
		};

        /**
         * 	验证库存信息的正确性,
         * @param goods 需要验证的GOODS信息
         * @returns {boolean}
         * 返回false 代表验证不通过。
         * 返回true  代表验证成功。
         */
        $scope.checkGoodsInfo = function (goods) {
            var result = false;
            if (!goods) {
                toaster.pop('warning', '提示', '库存信息丢失，请重新操作');
                return result;
            }
            if (!goods.editTag) {
                goods.editTagInvalid = true;
                toaster.pop('warning', '提示', '请填写标签信息');
                return result;
            }
            if (goods.editTag.length > 20) {
                goods.editTagInvalid = true;
                toaster.pop('warning', '提示', '标签信息超过了20个字符');
                return result;
            }
            if (!goods.editPackaging || goods.editPackaging == '请选择') {
                goods.editPackagingInvalid = true;
                toaster.pop('warning', '提示', '请选择包装方式');
                return result;
            }
            // if (!pattern.test(goods.editPackaging)) {
            //     goods.editPackagingInvalid = true;
            //     toaster.pop('warning', '提示', '包装方式仅能包含中文和英文字符');
            //     return result;
            // }
            // if (goods.editPackaging.length > 10) {
            //     goods.editPackagingInvalid = true;
            //     toaster.pop('warning', '提示', '包装方式不能超过10个字符');
            //     return result;
            // }
            if (!goods.editProduceDate) {
                goods.editProduceDateInvalid = true;
                toaster.pop('warning', '提示', '请填写生产日期');
                return result;
            }
            if (goods.editProduceDate.length > 12) {
                goods.editProduceDateInvalid = true;
                toaster.pop('warning', '提示', '生产日期不能超过12个字符');
                return result;
            }
            if (!goods.editReserve) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                return result;
            }
            if (isNaN(goods.editReserve)) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                return result;
            }
            if (goods.editReserve < $scope.minReserve) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
                return result;
            }
            if (goods.editReserve > $scope.maxReserve) {
                goods.editReserveInvalid  = true;
                toaster.pop('warning', '库存须填写小于10亿的正整数');
                return result;
            }
            if (typeof goods.editMinBuyQty == 'undefined') {
				goods.editMinBuyQtyInValid  = true;
				toaster.pop('warning', '提示', '起订量不能为空');
				return result;
			}
            // if(!goods.editMinBuyQty) {
            //     goods.editMinBuyQtyInValid  = true;
            //     toaster.pop('warning', '提示', '起订量必须填写');
            //     return result;
            // }
            if (!$scope.isInt.test(goods.editMinBuyQty)) {
                goods.editMinBuyQtyInValid  = true;
                toaster.pop('warning', '提示', '起订量必须是大于0的整数');
                return result;
            }
            // if(goods.editReserve < goods.editMinBuyQty) {
            //     goods.editReserveInvalid  = true;
            //     goods.editMinBuyQtyInValid = true;
            //     toaster.pop('warning', '提示', '库存必须是大于等于起订量的整数');
            //     return result;
            // }
            if (!goods.editMinPackQty) {
                goods.editMinPackQtyInValid = true;
                toaster.pop('warning', '提示', '包装数量必须填写');
                return result;
            }
            if (!$scope.isInt.test(goods.editMinPackQty)) {
                goods.editMinPackQtyInValid  = true;
                toaster.pop('warning', '提示', '包装数必须是正整数');
                return result;
            }
            if (Number(goods.editMinPackQty) > $scope.maxPackQty) {
                goods.editMinPackQtyInValid = true;
                toaster.pop('warning', '提示', '包装量数量必须小于' + $scope.maxPackQty);
                return result;
            }
            if (!goods.editBreakUp) {
                $scope.isNotBreakUp(goods);
            }
            var lastEnd = -1;
            for (var i = 0; i < goods.editPrices.length; i++) {
                if (isNaN(goods.editPrices[i].start)) {
                    goods.editPrices[i].startInValid = true;
                    toaster.pop('warning', '提示', '分段数量必须是数字');
                    return result;
                }
                if (goods.editPrices[i].start <= lastEnd) {
                    goods.editPrices[i].startInValid = true;
                    toaster.pop('warning', '提示', "存在分段的起始值小于等于上一个分段的结束值");
                    return result;
                }
                if (!goods.editPrices[i].end) {
					goods.editPrices[i].endInValid = true;
					toaster.pop('warning', '提示', '分段数量必须填写');
					return result;
				}
                if (isNaN(goods.editPrices[i].end)) {
                    goods.editPrices[i].endInValid = true;
                    toaster.pop('warning', '提示', '分段数量必须是数字');
                    return result;
                }
                if (goods.editPrices[i].start > goods.editPrices[i].end) {
                    goods.editPrices[i].startInValid = true;
                    goods.editPrices[i].endInValid = true;
                    toaster.pop('warning', '提示', "存在分段的起始值大于分段的结束值");
                    return result;
                }
                if (goods.currencyName.indexOf('USD') > -1) {
                    if (!goods.editPrices[i].uSDPrice) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (isNaN(goods.editPrices[i].uSDPrice)) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (Number(goods.editPrices[i].uSDPrice) <= 0) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    }
                }
                if (goods.currencyName.indexOf('RMB') > -1) {
                    if (!goods.editPrices[i].rMBPrice) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (isNaN(goods.editPrices[i].rMBPrice)) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    } else if (Number(goods.editPrices[i].rMBPrice) <= 0) {
                        goods.editPrices[i].priceInvalid = true;
                        toaster.pop('warning', '提示', "单价必须是大于0的数字");
                        return result;
                    }
                }
            }
            if (goods.currencyName.indexOf('USD') > -1 && !$scope.compareNum(goods.editMinDelivery, goods.editMaxDelivery, 2, goods)) {
                return result;
            }

            if (goods.currencyName.indexOf('RMB') > -1 && !$scope.compareNum(goods.editMinDelivery, goods.editMaxDelivery, 1, goods)) {
                return result;
            }

            result = true;
            return result;
        }

        /**
         * 比较交货周期的大小
         * @param min 本来是最小值
         * @param max 本来是最大值
         * @param type 2 表示当前验证的香港交期, 1表示当前验证的是大陆交期
         * @param commodity 批次信息
         * @returns {boolean} true 表示验证通过，false 表示验证失败。
         */
        $scope.compareNum = function(min, max, type, goods) {
            if(!min) {
                goods.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                return false;
            }else if(!max) {
                goods.editMaxDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                return false;
            }
            if(!$scope.isInt.test(min)) {
                goods.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                return false;
            }
            if(!$scope.isInt.test(max)) {
                goods.editMaxDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
                return false;
            }
            if(min < 1 || min > 999) {
                goods.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期只能填写1-999之间的值');
                return false;
            }
            if(max < 1 || max > 999) {
                goods.editMaxDeliveryinValid = true;
                toaster.pop('warning', '提示', '交期的时间必须是1-999之内');
                return false;
            }
            if(Number(min) > Number(max)) {
                goods.editMaxDeliveryinValid = true;
                goods.editMinDeliveryinValid = true;
                toaster.pop('warning', '提示', '最短交期应小于等于最长交期');
                return false;
            }
            return true;
        }

        /**
         * 编辑状态下的产品字段转成与后台对应的字段
         */
		function inverseGoods(goods) {
            goods.packaging = goods.editPackaging;
            goods.produceDate = goods.editProduceDate;
            goods.oldReserve =  goods.reserve;
            goods.reserve =  goods.editReserve;
            goods.minBuyQty = goods.editMinBuyQty;
            goods.prices = goods.editPrices;
            goods.minDelivery = goods.editMinDelivery;
            goods.maxDelivery = goods.editMaxDelivery;
            goods.selfSale = goods.editSelfSale;
            goods.minPackQty = goods.editMinPackQty;
            goods.img = goods.editPic;
            goods.breakUp = typeof goods.editBreakUp == 'undefined' ? false : goods.editBreakUp;
            goods.tag = goods.editTag;
        }

		/**
		 * 鼠标移入到保存按钮
		 */
		$scope.impedeBlur = function () {
			$scope.$$nonProduct.enterSaveButton = true;
		}

		/**
		 * 鼠标移出保存按钮
		 */
		$scope.recoveryBlur = function () {
			$scope.$$nonProduct.enterSaveButton = false;
		}

		/**
		 * 添加产品失败
		 * @param currenctMaterial
		 * @param goods
		 */
		function addGoods(currenctMaterial) {
			if (!$scope.checkGoodsInfo($scope.goods)) {
				return ;
			}
            inverseGoods($scope.goods);
			$scope.goods.productid = currenctMaterial.id;
			Goods.addGoods(null, $scope.goods, function (result) {
				if (result.success) {
                    ProductServiceQuery.getProductById({id: currenctMaterial.id}, function (response) {
                        if(!response || !response.id) {
                            loadData();
                        }
                        for(var i = 0; i < $scope.currenctMaterial.length; i++) {
                            if($scope.currenctMaterial[i].id == response.id) {
								if (!$scope.currenctMaterial[i].batchCount) {
									$scope.currenctMaterial[i].batchCount = 1;
								} else {
									$scope.currenctMaterial[i].batchCount++;
								}
                                // if(response.batchCount > 0) {
                                //     $scope.expandGoods($scope.currenctMaterial[i]);
                                // }else {
                                //     $scope.currenctMaterial[i].exPandOper = false;
                                // }
								$scope.expandGoods($scope.currenctMaterial[i]);
                            }
                        }
                    }, function (response) {
                        $scope.expandGoods(currenctMaterial);
                        closeShelArea(currenctMaterial);
                    });
				} else {
					toaster.pop('error', '错误', "添加产品失败" + result.message);
				}
			}, function (error) {
				toaster.pop('error', '错误', error.data);
			});
		}

		/**
		 * 更新产品信息
		 */
		function updateGoods(material, goods) {
			if(!goods || !material) {
				return ;
			}
            if (!$scope.checkGoodsInfo(goods)) {
                return ;
            }
            inverseGoods(goods);
			//不需要更新状态
			Goods.updateGoods(null, goods, function(data){
				if(data.code == 1) {
					toaster.pop('success', '修改成功');
					for(var i = 0; i < material.goodsArr.length; i++) {
						if(material.goodsArr[i].id == data.data.id) {
							material.goodsArr.splice(i, 1, data.data);
							break;
						}
					}
				}else {
					toaster.pop('error', '失败', data.message);
				}
			}, function(response){
				toaster.pop('error', '失败', response.data);
			});
		}

		/**
		 * 上架在售产品信息
		 */
		function putOn(material, goods) {
			if(!goods || !material) {
				return ;
			}
			Goods.putOn({id : goods.id}, null ,function (data) {
				toaster.pop('success', '提示', '上架成功');
				for(var i = 0; i < material.goodsArr.length; i++) {
					if(material.goodsArr[i].id == goods.id) {
						material.goodsArr.splice(i, 1, data.data);
						break;
					}
				}
			}, function (response) {
				toaster.pop('error', '提示', '上架失败：' + response.data);
			});
		}

		/**
		 * 上架只是修改Goods的状态
		 */
		$scope.publishGoods = function (product) {
			if (!validateGoods($scope.goods)) return ;

			$q.all([initRuleCount().$promise]).then(function (data) {
				if (data){
					if ($scope.needShowTip){
						$modal.open({
							templateUrl: 'static/view/common/modal/delivery_rule_modal.html',
							controller: 'rule_tip_ctrl',
							resolve : {
								type : function() {
									return 'product';
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
					$scope.goods.breakUp = 1 === $scope.goods.breakUp;
					$scope.isSelfSupport = 1 === $scope.goods.isSelfSupport;
					if (product.sourceApp == 'ERP' || product.sourceId) {
						if ($scope.goods.erpReserve < $scope.goods.b2cReserve + $scope.goods.reserve) {
							toaster.pop('error', '本次上架数量和已上架数量之和不可超过ERP空闲库存数量');
							return;
						}
					}
					Material.newStockByStandardProduct({ id: product.id, isSelfSupport: $scope.isSelfSupport}, $scope.goods, function (result) {
						if (result.success) {
							toaster.pop('success', '商品上架成功');
							closeShelArea(product);
						} else {
							toaster.pop('error', result.message);
						}
					}, function (error) {
						toaster.pop('error', error.data);
					});
				}
			});
		};

		// 保存物料详细信息
		$scope.saveDetail = function(material) {
			console.log('product',$scope.goods);
			console.log(material);
			Material.saveDetail({productId: material.id}, $scope.goods, function (data) {
				toaster.pop('success', '保存成功');
			}, function (response) {
				toaster.pop('error', response.data);
			})
		};

		$scope.fitBrandToProduct = function (product) {
			if (product.selectBrandId){
				if (product.pbranden != product.selectBrandId){
					product.cmpId = product.selectBrandId;
					product.canMatch = true;
				}else {
					product.cmpId = null;
					product.canMatch = false;
				}
			}
		};

		// $scope.onFocus = function (product) {
		// 	angular.forEach($scope.currenctMaterial, function (item) {
		// 		item.isFocus = false;
		// 	});
		// 	product.isFocus = true;
		// 	$scope.showBrand = true;
		// };
        //
		// $scope.onItemBlur = function () {
		// 	if ($scope.time){
		// 		clearTimeout($scope.time);
		// 	}
		// 	$scope.time = setTimeout(function () {
		// 		$scope.$apply(function () {
		// 			$scope.showBrand = false;
		// 		});
		// 	}, 200);
		// };

		// 保存物料详细信息
		$scope.saveDetail = function(material) {
			console.log('product',$scope.goods);
			console.log(material);
			Material.saveDetail({productId: material.id}, $scope.goods, function (data) {
				toaster.pop('success', '保存成功');
			}, function (response) {
				toaster.pop('error', response.data);
			})
		};

		/**
		 * 验证商品信息
		 *
		 * @param goods		商品信息
		 */
		function validateGoods(goods) {
			if(!goods.tag) {
				toaster.pop('warning', '提示', '产品的自定义标签为空');
				return false;
			}
			if(goods.tag.length > 20) {
				toaster.pop('warning', '提示', '产品的自定义标签超过了20个字符');
				return false;
			}
			// if(!pattern.test(goods.tag)) {
			// 	toaster.pop('warning', '提示', '产品的自定义标签只能包含中英文字符');
			// 	return false;
			// }
			if(!goods.packaging || goods.packaging === '') {
				toaster.pop('warning', '提示', '产品包装方式不能为空');
				return false;
			}
			if(!pattern.test(goods.packaging)) {
				toaster.pop('warning', '提示', '产品包装方式只能包含中文和英文字符');
				return false;
			}
			if(goods.packaging.length > 10) {
				toaster.pop('warning', '提示', '产品包装方式不能超过10个字符');
				return false;
			}
			if (!goods.produceDate || goods.produceDate === '') {
				toaster.pop('warning', '提示',  '产品生产日期不能为空');
				return false;
			}
			if(goods.produceDate.length > 11) {
				toaster.pop('warning', '提示', '产品生产日期不能超过11个字符');
				return false;
			}
			if (!goods.reserve || goods.reserve === '') {
				toaster.pop('warning', '提示', '产品库存信息不能为空');
				return false;
			}
			if (!goods.minBuyQty || goods.minBuyQty === '') {
				toaster.pop('warning', '提示', '产品的起拍数量不能为空');
				return false;
			}
			if(!goods.minPackQty || goods.minPackQty === '') {
				goods.minPackQty = 1;
			}
			if(!goods.breakUp) {
				$scope.isNotBreakUp(goods);
			}

			//console.log($scope.store.enType);
			// 根据价格生成币别
			if (!$scope.store || !$scope.store.enType || $scope.store.enType === '') {
				var rmbFlag = false;
				var usdFlag = false;
				var price = {};
				for (var i = 0; i < goods.prices.length; i++) {
					price = goods.prices[i];
					if (price.rMBPrice && price.rMBPrice !== '') {
						rmbFlag = true;
					}
					if (price.uSDPrice && price.uSDPrice !== '') {
						usdFlag = true;
					}
				}
				if (rmbFlag && usdFlag) {
					goods.currencyName = 'RMB-USD';
				} else if (rmbFlag && !usdFlag) {
					goods.currencyName = 'RMB';
				} else if (!rmbFlag && usdFlag) {
					goods.currencyName = 'USD';
				} else {
					delete goods.currencyName;
				}
			} else {
				if ($scope.store.enType === 'MAINLAND') {
					goods.currencyName = 'RMB';
				}
				if ($scope.store.enType === 'HK') {
					goods.currencyName = 'USD';
				}
			}


			for (i = 0; i < goods.prices.length; i++) {
				price = goods.prices[i];
				if (!price.start || price.start === '') {
					toaster.pop('warning', '提示', '产品价格梯度的起始数量不能为空');
					return false;
				}
				if (!price.end || price.end === '') {
					toaster.pop('warning', '提示', '产品价格梯度的终止数量不能为空');
					return false;
				}
				if (!goods.currencyName || goods.currencyName === '') {
					if ((!price.rMBPrice || price.rMBPrice === '') && (!price.uSDPrice || price.uSDPrice === '')) {
						toaster.pop('warning', '提示', '产品的人民币和美元价格不能同时为空');
						return false;
					}
				} else {
					if (goods.currencyName.indexOf('RMB') > -1) {
						if (!price.rMBPrice || price.rMBPrice === '') {
							toaster.pop('warning', '提示', '产品的人民币价格不能为空');
							return false;
						}
						if (price.rMBPrice <= 0) {
							toaster.pop('warning', '提示', '产品的人民币价格不能小于0');
							return false;
						}
					}
					if (goods.currencyName.indexOf('USD') > -1) {
						if (!price.uSDPrice || price.uSDPrice === '') {
							toaster.pop('warning', '提示', '产品的美元价格不能为空');
							return false;
						}
						if (price.uSDPrice <= 0) {
							toaster.pop('warning', '提示', '产品的美元价格不能小于0');
							return false;
						}
					}
				}
			}
			if((!goods.minDelivery || goods.minDelivery === '') || (!goods.maxDelivery || goods.maxDelivery === '')) {
				toaster.pop('warning', '提示', '交期不能为空');
				return false;
			}
			if ((goods.minDelivery < 1 || goods.minDelivery > 31) || (goods.maxDelivery < 0 || goods.maxDelivery > 31)) {
				toaster.pop('warning', '提示', '交期只能填写1-31之间的值');
				return false;
			}
			return true;
		}

		/**
		 * 获取物料交易信息
		 * @param product
		 */
		var getProductDetail = function (product) {
			var data = product.productDetail;
			$scope.goods.erpReserve = (!data || typeof data.reserve == 'undefined') ? 0 : data.reserve;
			$scope.goods.editPackaging = (data && data.packaging) || product.packaging || '无';
			$scope.goods.editProduceDate = (data && data.produceDate) || product.produceDate;
			$scope.goods.editMinPackQty = (data && data.minPackQty) || product.minPackQty || $scope.goods.minBuyQty || 1;
			$scope.goods.editMinBuyQty = (data && data.minBuyQty) || $scope.goods.minPackQty || $scope.goods.editMinPackQty;
			$scope.goods.editMinBuyQty = $scope.goods.editMinBuyQty - ($scope.goods.editMinBuyQty % $scope.goods.editMinPackQty);
			if ($scope.goods.editMinBuyQty < $scope.goods.editMinPackQty) {
				$scope.goods.editMinBuyQty = $scope.goods.editMinPackQty;
			}
			$scope.goods.editMinDelivery = (data && data.minDelivery) || $scope.uasBatchPutOnProperty.minDelivery;
			$scope.goods.editMaxDelivery = (data && data.maxDelivery) || $scope.uasBatchPutOnProperty.maxDelivery;
			product.selected = true;
			product.averMonthSalePrice = (product && product.price) ? product.price : 0;
			var goodQtyPrice = {start: $scope.goods.editMinBuyQty, end: $scope.maxReserve};
			var price = (((product && product.price) ? product.price : 0) *
			($scope.uasBatchPutOnProperty.fluctuateRate ? $scope.uasBatchPutOnProperty.fluctuateRate : 1));
			if ('MAINLAND' == $scope.store.enType) {
				goodQtyPrice.rMBPrice = $filter('formateNumber')(price, 6);
			}
			if ('HK' == $scope.store.enType) {
				goodQtyPrice.uSDPrice = $filter('formateNumber')(price, 6);
			}
			$scope.goods.editPrices = [];
			$scope.goods.editPrices.push(goodQtyPrice);
		}

		/**
		 * 获取物料交易信息
		 * @param product
		 */
		function showShelfArea(material) {
			// ComponentActive.getComponentListByUuid({ uuids: material.cmpUuId}, function (components) {
			// 	if (components.length > 0) {
			// 		var component = components[0];
			// 		angular.forEach($scope.currenctMaterial, function (product) {
			// 			delete product.selected;
			// 		});
			// 		$scope.goods = { isBreakUp: 1, isSelfSupport: 1, prices: [{}] };
			// 		$scope.goods.prices = [];
			// 		$scope.goods.prices.push({start : $scope.minReserve, end : $scope.maxReserve});
			// 		$scope.goods.isSelfSupport = $scope.store.status == 'OPENED' ? 1 : 0;
			// 		material.img = component.img || null;
			// 		if ('ERP' == product.sourceApp) {// 如果是erp上传物料获取物料交易信息
			// 			getProductDetail(product);
			// 		} else {
			// 			product.selected = true;
			// 		}
			// 	} else {
			// 		$scope.goods = { editBreakUp: false, editSelfSale: 2};
			// 		if($scope.store.enType === 'HK') {
			// 			$scope.goods.currencyName = 'USD';
			// 		}else {
			// 			$scope.goods.currencyName = 'RMB';
			// 		}
			// 		// 先保存产品id，方便去获取tag是否重复
			// 		$scope.goods.productid = material.id;
			// 		$scope.goods.prodNum = material.prodNum;
			// 		$scope.goods.editPrices = [];
			// 		$scope.goods.editPrices.push({start : $scope.minReserve, end : $scope.maxReserve});
			// 		// $scope.goods.isSelfSupport = $scope.store.status == 'OPENED' ? 1 : 0;
			// 		material.selected = true;
			// 	}
			// }, function (error) {
			// 	toaster.pop('error', '当前产品对应的器件[' + material.cmpUuId + ']已失效');
			// 	console.log(error);
			// });

			angular.forEach($scope.currenctMaterial, function (material) {
				delete material.selected;
				material.exPandOper = false;
				material.addGoodsOper = false;
			});
			material.addGoodsOper = true;
			material.exPandOper = true;
			$scope.goods = {};
			$scope.goods.editBreakUp = false;
			// 先保存产品id，方便去获取tag是否重复
			$scope.goods.productid = material.id;
			$scope.goods.prodNum = material.prodNum;
			$scope.goods.editPrices = [];
			if ($scope.store.enType === 'HK') {
				$scope.goods.currencyName = 'USD';
			} else {
				$scope.goods.currencyName = 'RMB';
			}
			$scope.goods.editSelfSale = $scope.$$nonProduct.canSelfSale ? 1 : 2;
			$scope.expandGoods(material, material.addGoodsOper);
			if ('ERP' == material.sourceApp || material.sourceId) {
				// 如果是erp上传物料获取物料交易信息
				getProductDetail(material);
			} else {
				$scope.goods.editPrices.push({start: $scope.minReserve, end: $scope.maxReserve});
				// $scope.goods.isSelfSupport = $scope.store.status == 'OPENED' ? 1 : 0;
				material.selected = true;
				// }
			}
		}

		/**
		 * 关闭上架商品填写区域
		 *
		 * @param product		产品信息
		 */
		function closeShelArea(product) {
			// 初始化商品信息
			angular.forEach($scope.currenctMaterial, function (material) {
				material.addGoodsOper = false;
				material.exPandOper = false;
			});
			$scope.goods = { editBreakUp: false, editSelfSale: 2};
			if (product.selected){
				delete product.selected;
			}
		}

		/**
		 * 设置最小起订量
		 *
		 * @param goods		商品信息
		 */
		function setPriceMinAmount(goods, edit) {
            // goods.editMinBuyQtyInValid = false;
			// if (typeof goods.editMinBuyQty == 'undefined') {
			// 	goods.editMinBuyQtyInValid = true;
			// 	return false;
			// }
            if (!$scope.isInt.test(goods.editMinBuyQty) || parseInt(goods.editMinBuyQty) < 1) {
                // goods.editMinBuyQtyInValid = true;
				if (goods.editBreakUp) {
					goods.editMinBuyQty = 1;
					goods.editPrices[0].start = goods.editMinBuyQty;
				} else {
					if (goods.editMinPackQty) {
						goods.editMinBuyQty = goods.editMinPackQty;
						goods.editPrices[0].start = goods.editMinBuyQty;
					}
				}
				if (!$scope.$$nonProduct.enterSaveButton) {
					toaster.pop('warning', '提示', '起订量必须是大于0的整数');
				}
                return false;
            }
            goods.editMinBuyQtyPre = goods.editMinBuyQty;
            if (!goods.editBreakUp) {
                $scope.isNotBreakUp(goods, edit);
            }
		}

		$scope.updateStartNumber = function (goods) {
			goods.editPrices[0].start = goods.editMinBuyQty;
		};

		/**
		 * 设置最小包数量
		 *
		 * @param goods		商品信息
		 */
		function setPriceMinPackAmount(goods) {
            goods.editMinPackQtyInValid = false;
			if (typeof goods.editMinPackQty == 'undefined') {
				if (!$scope.$$nonProduct.enterSaveButton) {
					toaster.pop('warning', '提示', '包装数量必须是大于0的整数');
				}
				return false;
			}
            if (!$scope.isInt.test(goods.editMinPackQty)) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					goods.editMinPackQtyInValid = true;
					toaster.pop('warning', '提示', '包装数量必须是大于0的整数');
				}
                return false;
            }
            if (parseInt(goods.editMinPackQty) < 1) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					goods.editMinPackQtyInValid = true;
					toaster.pop('warning', '提示', '包装数量必须是大于0的整数');
				}
                return false;
            }
            if (parseInt(goods.editMinPackQty) > $scope.maxPackQty) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					toaster.pop('warning', '提示', '包装数量必须小于' + $scope.maxPackQty);
					goods.editMinPackQtyInValid = true;
				}
                return false;
            }
            if (goods.editMinBuyQty) {
                if(!goods.editBreakUp) {
                    $scope.isNotBreakUp(goods);
                }
            }
            goods.editMinPackQtyPre = goods.editMinPackQty;
            goods.editMinPackQtyInValid = false;
		}

		/**
		 * 设置价格梯度的最大数量
		 *
		 * @param goods		商品信息
		 */
		function setPriceMaxAmount(goods, edit) {
			if (!goods.editReserve) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					goods.editReserveInvalid = true;
					toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
				}
				return false;
			}
			if (!$scope.isInt.test(goods.editReserve)) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					goods.editReserveInvalid = true;
					toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
				}
                return false;
			}
            // if(goods.editMinBuyQty) {
            //     if(parseInt(goods.editReserve) < parseInt(goods.editMinBuyQty)) {
            //         goods.editReserveInvalid = true;
            //         toaster.pop('warning', '提示', '库存必须是大于等于起订量的整数');
            //         return false;
            //     }
            // }
            if (parseInt(goods.editReserve) > $scope.maxReserve || goods.editReserve < $scope.minReserve) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					goods.editReserveInvalid = true;
					toaster.pop('warning', '提示', '库存须填写小于10亿的正整数');
				}
                return false;
            }
            if (goods.sourceApp == 'ERP') {
				if (Number(goods.maxReserve) < goods.editReserve) {
					goods.editReserve = goods.maxReserve;
					toaster.pop('warning', '提示', '不能超过可用库存');
				}
				return false;
			}
            goods.editReservePre = goods.editReserve;
            goods.editReserveInvalid = false;
			if (!goods.breakUp) {
				$scope.isNotBreakUp(goods, edit);
			}
		}

		var countLength = function (string) {
			return string.replace(/[^\x00-\xff]/g,'**').length;
		};

		var cutOutString = function (str, length) {
			for (var i = 1; i <= str.length; i++) {
				if (countLength(str.substr(0, i)) > length){
					str = str.substr(0, i-1);
					break;
				}
			}
			return str;
		};

		/***
		 * 验证交期是否正确
		 *
		 * @param min
		 * @param max
		 */
		$scope.uasBatchChangeDeliver = function(min, max, isMax) {
			if ($scope.$$nonProduct.enterBatchPutOnPropertySaveButton) {
				return ;
			}
			var day;
			day = isMax ? max : min;
			if (typeof day == 'undefined') {
				return ;
			} else {
				if ($scope.isInt.test(day)) {
					if (Number(day) < 1 || Number(day) > 31) {
						toaster.pop('warning', '提示', '交期必须是1-31的整数');
						return ;
					}
				} else {
					toaster.pop('warning', '提示', '交期必须是1-31的整数');
					return ;
				}
			}

			if ($scope.isInt.test(min) && $scope.isInt.test(max)) {
				if (max < min) {
					toaster.pop('warning', '提示', '最小交期不能大于最大交期');
				}
			}
		};

		/**
		 * 鼠标移入保存的按钮
		 */
		$scope.enterBatchPutOnPropertySaveButton = function () {
			$scope.$$nonProduct.enterBatchPutOnPropertySaveButton = true;
		}

		/**
		 * 鼠标移出保存按钮
		 */
		$scope.leaveBatchPutOnPropertySaveButton = function () {
			$scope.$$nonProduct.enterBatchPutOnPropertySaveButton = false;
		}

		/**
		 * 验证配置的信息
		 */
		$scope.validateBatchPutOnProperty = function() {
			if (!$scope.uasBatchPutOnProperty.editFluctuateRate || Number($scope.uasBatchPutOnProperty.editFluctuateRate) < 1 || Number($scope.uasBatchPutOnProperty.editFluctuateRate) > 200) {
				toaster.pop('warning', '提示', '浮动率必须介于1-200');
				return false;
			}
			if (!$scope.uasBatchPutOnProperty.editMinDelivery || !$scope.uasBatchPutOnProperty.editMaxDelivery) {
				toaster.pop('warning', '提示', '交期必须是1-31的整数');
				return false;
			}
			if (Number($scope.uasBatchPutOnProperty.editMinDelivery) > Number($scope.uasBatchPutOnProperty.editMaxDelivery)) {
				toaster.pop('warning', '提示', '最小交期不能大于最大交期');
				return false;
			}

			return true;
		}

		/**
		 * 批量保存配置信息
		 */
		$scope.saveBatchPutOnProperty = function() {
			var isPass = $scope.validateBatchPutOnProperty();
			if (!isPass) {
				return false;
			}
			$scope.uasBatchPutOnProperty.fluctuateRate = $scope.uasBatchPutOnProperty.editFluctuateRate / 100;
			$scope.uasBatchPutOnProperty.minDelivery = $scope.uasBatchPutOnProperty.editMinDelivery;
			$scope.uasBatchPutOnProperty.maxDelivery = $scope.uasBatchPutOnProperty.editMaxDelivery;
			UASBatchPutOnPropertyServices.save(null, $scope.uasBatchPutOnProperty, function (data) {
				if (data.code == 1) {
					$scope.uasBatchPutOnProperty = data.data;
					$scope.uasBatchPutOnProperty.editFluctuateRate =  NumberService.mul($scope.uasBatchPutOnProperty.fluctuateRate, 100);
					$scope.uasBatchPutOnProperty.editMinDelivery = $scope.uasBatchPutOnProperty.minDelivery;
					$scope.uasBatchPutOnProperty.editMaxDelivery = $scope.uasBatchPutOnProperty.maxDelivery;
					toaster.pop('success', '成功', "保存成功");
				} else {
					toaster.pop('error', '失败', data.message);
				}
			}, function (response) {
				toaster.pop('error', '失败', response.data);
			});
		};

		/**
		 * 批量上架信息
		 */
		$scope.batchPutOn = function () {
			var isFluctuateRateChange = $scope.uasBatchPutOnProperty.editFluctuateRate != $scope.uasBatchPutOnProperty.fluctuateRate * 100;
			var isMinDeliveryChange = $scope.uasBatchPutOnProperty.editMinDelivery != $scope.uasBatchPutOnProperty.minDelivery;
			var isMaxDeliveryChange = $scope.uasBatchPutOnProperty.editMaxDelivery != $scope.uasBatchPutOnProperty.maxDelivery;
			if (isFluctuateRateChange || isMinDeliveryChange || isMaxDeliveryChange) {
				toaster.pop('warning', '提示', '批量上架配置信息被修改，请保存批量上架配置信息之后再上架');
                return ;
			}
			$scope.choosedIds = [];
			$scope.getChoosedInfo();
			if(!$scope.isChoosedAll && (!$scope.choosedIds || $scope.choosedIds.length == 0)) {
				toaster.pop('warning', '提示','请选择要删除的信息');
				return true;
			}
			var idStr = ($scope.choosedIds != null) ? $scope.choosedIds.join(',') : null;
			var std = $scope.standard_tab == 'standard' ? 1 : 0;
			Material.batchPutOn({'standard' : std, ids : idStr}, null, function (data) {
				loadData();
				toaster.pop('success', '成功', data.message);
			}, function (response) {
				toaster.pop('error', '失败', response.data);
			});

		}

        /**
         * 编辑包装方式的信息
         * @param goods
         * @param edit
         */
        $scope.editPackaging = function(goods) {
            goods.editPackagingInvalid = false;
            if (goods.editPackaging) {
                if (!pattern.test(goods.editPackaging)) {
                    toaster.pop('warning', '提示', '包装方式只能填写中英文');
                    goods.editPackagingInvalid = true;
                }
            }
        };

        $scope.changePackaging = function (goods) {
			if (goods.editPackaging) {
				goods.editPackaging = cutOutString(goods.editPackaging, 10);
			}
		};

        /**
         * 编辑生产日期
         * @param commodity
         */
        $scope.editProduceDateFa = function(goods) {
			if($scope.$$nonProduct.enterSaveButton) {
				return ;
			}
            goods.editProduceDateInvalid = false;
            if(goods.editProduceDate) {
				goods.editProduceDate = cutOutString(goods.editProduceDate, 12);
                // if(goods.editProduceDate.length > 11) {
                //     goods.editProduceDateInvalid = true;
                //     toaster.pop('warning', '提示', '生产日期不能超过十一个字符');
                // }
            }
        };

		/**
		 * 判断价格是否合理，只设置验证的结果
		 * @param prices 分段价格
		 * @param price 对应的价格
		 * @param index 索引
		 */
		$scope.changePrices = function (prices, price, index) {
			prices[index].priceInvalid = false;
			if(!prices || !prices[index] || !price) {
				return ;
			}
			if(isNaN(price)) {
				prices[index].priceInvalid = true;
				toaster.pop('warning', '提示', '单价必须是大于0的数字');
				return;
			}
			if(new Number(price) <= 0) {
				prices[index].priceInvalid = true;
				toaster.pop('warning', '提示', '单价必须是大于0的数字');
				return;
			}
			if(price.toString().indexOf('.') > -1) {
				var arr = price.toString().split(".");
				if(arr[0].length > 4 || arr[1].length > 6) {
					prices[index].priceInvalid = true;
					return ;
				}
			}else {
				if(price.toString().toString().length > 4) {
					prices[index].priceInvalid = true;
					return ;
				}
			}
		};

        /**
         * 修改分段的数量
         * @param commodity 批次信息
         * @param index 索引值
         * @param isEnd 是否是结束值
         */
        $scope.editQty = function (goods, index, isEnd, num) {
            goods.editPrices[index].endInValid = false;
            goods.editPrices[index].startInValid = false;
            if (goods.editPrices.length < index || index < 0) {
                return ;
            }
            if (typeof num == 'undefined') {
				return ;
			}
            if (!$scope.isInt.test(num)) {
				if (!$scope.$$nonProduct.enterSaveButton) {
					if (isEnd) {
						//goods.editPrices[index].endInValid = true;
						delete goods.editPrices[index].end;
					} else {
						//goods.editPrices[index].startInValid = true;
						delete goods.editPrices[index].start;
					}
					toaster.pop('warning', '提示', '输入值必须为正整数');
				}
                return ;
            }
            if (isEnd) {
                if (index < goods.editPrices.length - 1) {
                    if (parseInt(goods.editPrices[index].end) < parseInt(goods.editPrices[index].start)) {
						if (!$scope.$$nonProduct.enterSaveButton) {
							toaster.pop('warning', '提示', '输入值必须大于' + goods.editPrices[index].start);
							//goods.editPrices[index].endInValid = true;
							delete goods.editPrices[index].end;
						}
                    } else if ((goods.editPrices[index + 1].end) && (parseInt(goods.editPrices[index].end) + 1) >= parseInt(goods.editPrices[index + 1].end)) {
						if (!$scope.$$nonProduct.enterSaveButton) {
							toaster.pop('warning', '提示', '输入值必须小于'+(parseInt(goods.editPrices[index + 1].end) - 1));
							//goods.editPrices[index].endInValid = true;
							delete goods.editPrices[index].end;
						}
                    } else {
                        goods.editPrices[index + 1].start = parseInt(goods.editPrices[index].end) + 1;
						goods.editPrices[index + 1].startInValid = false;
						goods.editPrices[index].endPre = goods.editPrices[index].end;
						goods.editPrices[index + 1].startPre = goods.editPrices[index + 1].start;
                    }
                }
                // else {
                //     if(commodity.editPrices[index].end > commodity.editMinBuyQty) {
                //         if(commodity.editPrices[index].end > commodity.reserve) {
                //             toaster.pop('warning', '提示', '修改最后一个分段的结束值之后，新的库存量大于原有的库存量');
                //             commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                //         }else {
                //             commodity.editReserve = commodity.editPrices[index].end;
                //             commodity.editPrices[index].endPre = commodity.editPrices[index].end;
                //             commodity.editReservePre = commodity.editReserve;
                //         }
                //     }else {
                //         toaster.pop('warning', '提示', '修改最后一个分段的结束值之后导致库存量小于起拍量');
                //         commodity.editPrices[index].end = commodity.editPrices[index].endPre;
                //     }
                // }
            } else {
                if (index != 0) {
                    if (parseInt(goods.editPrices[index].start) > parseInt(goods.editPrices[index].end)) {
                        // toaster.pop('warning', '提示', '修改本分段之后，会导致分段的起始值' + goods.editPrices[index ].start + '大于结束值' + parseInt(goods.editPrices[index].end));
						//goods.editPrices[index].startInValid = true;
						if (!$scope.$$nonProduct.enterSaveButton) {
							toaster.pop('warning', '提示', '输入值必须小于'+ + goods.editPrices[index].end);
							delete goods.editPrices[index].start;
						}
                    } else if ((parseInt(goods.editPrices[index].start) - 1) < goods.editPrices[index - 1].start) {
                        // toaster.pop('warning', '提示', '修改本分段之后，会导致前一个分段的起始值' + goods.editPrices[index - 1].start + '大于结束值' + (parseInt(goods.editPrices[index].start) - 1));
						//goods.editPrices[index].startInValid = true;
						if (!$scope.$$nonProduct.enterSaveButton) {
							toaster.pop('warning', '提示', '输入值会导致梯度重叠，请重新修改');
							delete goods.editPrices[index].start;
						}
                    } else {
                        goods.editPrices[index - 1].end = parseInt(goods.editPrices[index].start) - 1;
						goods.editPrices[index - 1].endInValid = false;
                        goods.editPrices[index].startPre = goods.editPrices[index].start;
                        goods.editPrices[index - 1].endPre = goods.editPrices[index - 1].end;
                    }
                }//else {
                //     if(commodity.editMinPackQty) {
                //         if(commodity.editPrices[index].start % commodity.editMinPackQty != 0) {
                //             commodity.editPrices[index].startInValid = false;
                //             commodity.editPrices[index].start = commodity.editMinBuyQty;
                //             commodity.editPrices[index].startPre = commodity.editMinBuyQty;
                //             toaster.pop('warning', '提示', '第一个分段的起始量必须是倍数(' + commodity.editMinPackQty + ")的整数倍");
                //         }else {
                //             commodity.editMinBuyQty = commodity.editPrices[index].start;
                //             commodity.editMinBuyQtyPre = commodity.editPrices[index].start;
                //             commodity.editMinBuyQtyInValid = false;
                //         }
                //     }else {
                //         commodity.editMinBuyQty = commodity.editPrices[index].start;
                //         commodity.editMinBuyQtyPre = commodity.editMinBuyQty;
                //         commodity.editPrices[index].startPre = commodity.editPrices[index].start;
                //         commodity.editMinBuyQtyInValid = false;
                //     }
                // }
            }
        };

        /**
         * 删除对应的分段.
         * @param commodity
         */
        $scope.deleteFragment = function(goods, index) {
            if (index > -1 && index < goods.editPrices.length) {
                if (goods.editPrices.length < 2) {
                    toaster.pop('warning', "提示", "商品至少需要一个分段");
                    return ;
                }
                if (index < goods.editPrices.length - 1) { //不是最后一个分段
                    var price = goods.editPrices.splice(index, 1);
                    goods.editPrices[index].start = price[0].start;
                } else if (index == goods.editPrices.length - 1) { //如果删除的是最后一个分段，
                    var price = goods.editPrices.splice(index, 1);
                    goods.editPrices[index -1].end = price[0].end;
                }
				if (goods.editMinBuyQty && $scope.isInt.test(goods.editMinBuyQty) &&
					parseInt(goods.editPrices[0].end) >= parseInt(goods.editMinBuyQty)) {
					if (goods.editMinBuyQtyInValid) {
						goods.editMinBuyQtyInValid = false;
						goods.editPrices[0].start = goods.editMinBuyQty;
					}
				}
            }
        };

        /**
         * 增加对应的分段。
         * @param commodity
         */
        $scope.addFragment = function (goods) {
            if(goods.editPrices.length > 2) {
                toaster.pop('warning', "提示", "商品最多只能有三个分段");
                return ;
            }
            var price = {};
            price.start = null;
            price.startPre = null;
            price.end = goods.editPrices[goods.editPrices.length - 1].end;
            price.endPre = price.end;
            price.uSDPrice = null;
            price.uSDPricePre = null;
            price.rMBPrice = null;
            price.rMBPricePre = null;
            goods.editPrices[goods.editPrices.length - 1].end = null;
            goods.editPrices[goods.editPrices.length - 1].endPre = null;
            goods.editPrices.push(price);
        }

		/**
		 * 修改字符串信息
		 */
		$scope.blurTag = function (goods) {
			if (!goods.editTag) {
				toaster.pop("warning", "自定义标签不能为空");
			}
			if (goods.editTag) {
				Goods.getRepeatByTagAndProductId({goodId:goods.id, productId:goods.productid, tag:goods.editTag}, function (data) {
					if (data.success) {
						if (data.data) {
							toaster.pop("warning", "该产品下已存在相同的自定义标签");
						}
					} else {
						toaster.pop("error", data.message);
					}
				}, function (error) {
					toaster.pop("error","判断标签重复请求错误" + error.date);
				})
			}
		};

		/**
		 * 修改字符串信息，失去焦点
		 */
		$scope.changeTag = function (goods) {
			var length = ByteCountService.strByteLength(goods.editTag);
			if (length > 20) {
				goods.editTag = goods.editTagPre;
			} else {
				goods.editTagPre = goods.editTag;
			}
		};


        /**
         * @param min 最小值
         * @param max 最大值
         * @param isMin 传入的是否是最小值
         * @param commodity 批次信息
         */
        $scope.changeDelivery = function(min, max, isMin, goods) {
			if(isMin) {
				goods.editMinDeliveryinValid = false;
			}else {
				goods.editMaxDeliveryinValid = false;
			}
            var day = -1;
            if(isMin) {
                if(min && $scope.isInt.test(min)) {
                    day = min;
                }else {
					if(typeof min == 'undefined') {
						return ;
					}
                    if(!$scope.isInt.test(min)) {
						if(!$scope.$$nonProduct.enterSaveButton) {
							toaster.pop('warning', '提示', '交期请输入1-999的整数');
							goods.editMinDeliveryinValid = true;
						}
                    }
                    return ;
                }

            }else {
                if(max && $scope.isInt.test(max)) {
                    day = max;
                }else {
					if(typeof max == 'undefined') {
						return ;
					}
                    if(!$scope.isInt.test(max)) {
						if(!$scope.$$nonProduct.enterSaveButton) {
							toaster.pop('warning', '提示', '交期只能填写1-999之间的整数值');
							goods.editMaxDeliveryinValid = true;
						}
                    }
                    return ;
                }

            }
            if(day > 999 || day < 1) {
				if(!$scope.$$nonProduct.enterSaveButton) {
					if(isMin) {
						goods.editMinDeliveryinValid = true;
					}else {
						goods.editMaxDeliveryinValid = true;
					}
					toaster.pop('warning', '提示', '交期的值必须在1-999天');
				}
                return ;
            }
            if(Number(min) > Number(max)) {
				if(!$scope.$$nonProduct.enterSaveButton) {
					goods.editMinDeliveryinValid = true;
					goods.editMaxDeliveryinValid = true;
					toaster.pop('warning', '提示', '最短交期应小于等于最长交期');
				}
                return ;
            }
			goods.editMinDeliveryinValid = false;
			goods.editMaxDeliveryinValid = false;
        };

        /**
         * 切换销售模式
         */
        $scope.changeSaleMode = function (goods) {
            if(!goods || !goods.batchCode) {
                return ;
            }
            StoreCms.validCommdityisAdvantageCommodity({batchcode : goods.batchCode}, function (data) {
                if(data.code != 1) {
                    toaster.pop('warning', '提示', data.message);
                }
            }, function (response) {
            });

        };

		/**
		 * 验证最短交期数据
		 *
		 * @param goods			商品信息
		 * @param type			交期类型
		 */
		function checkMinDelivery(goods, type) {
			if (goods.minDelivery == null) {
				return ;
			}
			if (goods.minDelivery < 0 || goods.minDelivery > 31) {
				toaster.pop('warning', '提示', '交期只能填写1-31之间的值');
				return ;
			}
			if (goods.minDelivery && goods.minDelivery > goods.maxDelivery) {
				toaster.pop('warning', '提示', '最短交期必须小于最长交期');
				return ;
			}
			return true;
		}

		/**
		 * 验证最长交期数据
		 *
		 * @param goods			商品信息
		 * @param type			交期类型
		 */
		function checkMaxDelivery(goods, type) {
			if (goods.maxDelivery == null) {
				return ;
			}
			if (goods.maxDelivery < 0 || goods.maxDelivery > 31) {
				toaster.pop('warning', '提示', '交期只能填写1-31之间的值');
				return ;
			}
			if (goods.maxDelivery && goods.minDelivery > goods.maxDelivery) {
				toaster.pop('warning', '提示', '交期只能填写1-31之间的值');
				return ;
			}
			return true;
		}
		/**
		 * 是否可拆卖
		 * @param commodity
		 */
		$scope.toggleIsBreadUp = function(goods, edit) {
            goods.editBreakUp = !goods.editBreakUp;
            if(!goods.editBreakUp) {
                $scope.isNotBreakUp(goods);
            }
		};

		/**
		 * 如果不拆分需要重新计算最小起订量的信息
		 * @param goods
		 */
		$scope.isNotBreakUp = function (goods, edit) {
            if (goods.editMinPackQty && goods.editMinBuyQty) {
                var remainder = goods.editMinBuyQty % goods.editMinPackQty;
                if (remainder != 0) {
					toaster.pop('warning', '提示', '不可拆卖时，起订量必须是包装数量的倍数');
					if (parseInt(goods.editMinBuyQty) > parseInt(goods.editMinPackQty)) {
						goods.editMinBuyQty = Number(NumberService.sub(goods.editMinBuyQty, remainder));
					} else {
						goods.editMinBuyQty = goods.editMinPackQty;
					}
					goods.editPrices[0].start = goods.editMinBuyQty;
                }
            }
		}

		// 获取品牌联想词
		$scope.getSimilarBrands = function(keyword) {
			if (keyword) {
				return Search.getSimilarBrands({keyword : keyword}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					});
				});
			}
		};

		// 选择品牌
		$scope.onAssociateClickBrand = function (material, brand) {
			BrandActiveAPI.getBrand({uuid: brand.uuid}, {} , function (data) {
				material.submitProduct.brand = data;
			}, function (response) {
				toaster.pop('error', response.data);
			});
		};

		// 获取器件联想词
		$scope.getSimilarCmps = function(code) {
			if (code) {
				return Search.getSimilarComponents({keyword : code}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					})
				});
			}
		};
		// 选择器件
		$scope.onAssociateClickCmp = function (material, cmp) {
			$scope.submitProduct.component = cmp;
			ComponentActiveAPI.get({uuid : cmp.uuid}, {}, function(data) {
				var component = data;
				$scope.submitProduct.brand = component.brand;
				$scope.submitProduct.kind = component.kind;
			});
		};

		// 获取末级类目联想词
		$scope.getSimilarKinds = function(name) {
			if (name) {
				return Search.getSimilarLeafKinds({keyword: name}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					})
				})
			}
		};

		$scope.onAssociateClickKind = function (material, kind) {
			$scope.submitProduct.kind = kind;
		};

		// 选择类目
		$scope.selectKind = function() {
			$modal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'static/view/prod/product_kindChoose_modal.html',
				controller: 'KindChooseCtrl',
				resolve: {
					actives: function() {
						return $scope.actives;
					}
				}
			}).result.then(function(data){
				$scope.submitProduct.kind = data.actives[data.actives.length - 1];
			}, function(){

			});
		};

		// 提交申请
		$scope.submit = function (material) {
			if (typeof material.submitProduct.brand == 'undefined' || material.submitProduct.brand.nameEn == null) {
				toaster.pop('warning', '请填写品牌英文名');
				return;
			}
			if (typeof material.submitProduct.brand.url == 'undefined' || material.submitProduct.brand.url == null) {
				toaster.pop('warning', '请填写品牌官网');
				return;
			}
			if (!material.pbranduuid) { // 品牌申请
				if (typeof material.submitProduct.brand.brief == 'undefined' || material.submitProduct.brand.brief == null) {
					toaster.pop('warning', '请填写品牌简介');
					return;
				}
				if (typeof material.submitProduct.brand.series == 'undefined' || material.submitProduct.brand.series == null) {
					toaster.pop('warning', '请填写主要产品');
					return;
				}
				BrandSubmit.unstandardSubmit({}, material.submitProduct, function (data) {

				}, function (response) {

				})
			} else {
				toaster.pop('enter component submit');
				if (typeof material.submitProduct.component == 'undefined' || material.submitProduct.component.code == null) {
					toaster.pop('warning', '请填写原厂型号');
					return;
				}

				if (typeof material.submitProduct.kind == 'undefined' || material.submitProduct.kind.id == null) {
					toaster.pop('warning', '请填写或选择商城已有类目');
					return;
				}
				if ($scope.attachName == '') {
					toaster.pop('warning', '请填上传规格书');
					return;
				} else {
					material.submitProduct.attach = $scope.attachName;
				}

				Material.submitProduct({}, material.submitProduct, function (data) {
					if (data.data == '已存在此器件') {
						toaster.pop('info',  '已存在此器件');
					} else {
						toaster.pop('info', data.data);
					}
				}, function (response) {
					toaster.pop('error', response.data);
				})
			}
		};

		$scope.attachNameInfo = '';
		//上传规格书
		$scope.onAttachInput = function (event) {
			$scope.attachNameInfo = event.target.files[0].name;
		};
		$scope.deleteAttach = function () {
			$scope.attachNameInfo = '';
		};

	}]);

	//类目选择模态框
	app.register.controller('KindChooseCtrl', ['$scope', 'KindAPI', 'actives', 'toaster', '$modalInstance', function($scope, KindAPI, actives, toaster, $modalInstance) {
		$scope.actives = actives;
		$scope.kinds = [[], [], [], []];
		// 获取子类目
		var getChildren = function(pid, deep) {
			KindAPI.getChildren({parentId: pid}, function(data) {
				$scope.kinds[deep] = data;
			}, function(response) {
				toaster.pop('error', '获取子类目失败', response.data);
			});
		};

		// 改变节点选中状态
		var changeStatus = function(item, deep) {
			var actives = [], level = 0;
			angular.forEach($scope.kinds, function(ks, i) {
				if(i > deep) {
					$scope.kinds[i] = [];
				} else {
					angular.forEach(ks, function(k, j) {
						if(i == deep) {
							if(k.id == item.id) {
								$scope.kinds[i][j].$active = true;
								actives.push(k);
							} else {
								k.$active = null;
							}
						} else {
							if(k.$active) {
								actives.push(k);
							}
						}
					});
				}
			});
			// 选择的节点
			$scope.actives = actives;
			$scope.active = item;
			// 当前可操作的层级
			if(deep < 3) {
				$scope.activeDeep = deep + 1;
			}
		};

		// 节点点击后获取子类目，节点被选中
		$scope.onItemClick = function(item, deep) {
			changeStatus(item, deep);
			if (!item.isLeaf) {
				getChildren(item.id, deep + 1);
			}
		};

		// 重新加载数据
		function reload(deep) {
			var pid;
			if(deep) {
				pid = $scope.actives[deep - 1].id;
			} else {
				pid = 0;
				deep = 0;
			}
			getChildren(pid, deep);
		}

		// 初始加载数据，获取第一层的类目
		if($scope.actives) {
			angular.forEach($scope.actives, function(v, k) {
				KindAPI.getChildren({parentId: v.parentid}, function(data) {
					$scope.kinds[k] = data;
					angular.forEach($scope.kinds[k], function(kind, i){
						if(kind.id == v.id) {
							$scope.kinds[k][i].$active = true;
							$scope.actives[k] = $scope.kinds[k][i];
						}
					})
				}, function(response) {
					toaster.pop('error', '获取子类目失败', response.data);
				});
			});
		} else {
			reload();
		}

		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};

		// 确认选择
		$scope.check = function() {
			var a = {
				active: $scope.active,
				actives: $scope.actives
			};
			$modalInstance.close(a);
		};
	}]);



	//批量删除信息
	app.register.controller('vendor_delete_ctrl', ['$scope', 'ids', 'Goods', 'Material', 'toaster', 'deleteMaterial', 'deleteGoods', 'selectAll', 'ProductServiceQuery', 'standard_tab', '$modalInstance', 'message', function ($scope, ids, Goods, Material, toaster, deleteMaterial, deleteGoods, selectAll, ProductServiceQuery, standard_tab, $modalInstance, message) {
		$scope.deleteModal = true;
        $scope.message = message;

        $scope.ids = ids;

        // 确认删除
        $scope.confirmDelete = function () {
            if (deleteMaterial) {
                if (selectAll) {
                    if (standard_tab == 'standard') {
                        Material.deleteStandardAll(null, null, function (data) {
                            if (data.code != 1) {
                                toaster.pop('error','错误' ,data.message);
                            } else {
                                toaster.pop('success', '删除成功');
								$scope.deleteModal = false;
                                $modalInstance.close(data);
                            }
                        }, function (response) {
                            toaster.pop('error', '错误', response.data);
                        });
                    } else {
                        Material.deleteUnstandardAll(null, null, function (data) {
                            if(data.code != 1) {
                                toaster.pop('error', '错误', data.message);
                            }else {
                                toaster.pop('success', '删除成功');
								$scope.deleteModal = false;
                                $modalInstance.close(data);
                            }
                        }, function (response) {
                            toaster.pop('error', '错误', response.data);
                        });
                    }
                } else {
                    if(!$scope.ids || $scope.ids.length == 0) {
                        toaster.pop('warning', '提示','请选择要删除的信息');
                        return ;
                    }
                    var idStr = $scope.ids.join(',');
                    Material.deleteBatch({ids : idStr}, function (data) {
                        toaster.pop('success', '删除成功');
						$scope.deleteModal = false;
                        $modalInstance.close(data);
                    }, function (response) {
                        toaster.pop('error', response.data);
                    });
                }
            } else if (deleteGoods) {
                if (!$scope.ids || $scope.ids.length < 1) {
                    return ;
                }
                Goods.deleteGoodsById({id: $scope.ids[0]}, function (data) {
                    ProductServiceQuery.getProductById({id: data.productid}, function (response) {
						$scope.deleteModal = false;
                        $modalInstance.close(response);
                        toaster.pop('success', '提示', '删除成功');
                    }, function (response) {
                        toaster.pop('error', '错误', response.data);
                    });
                }, function (response) {
                    toaster.pop('error',  '错误', response.data);
                });
            }
        };


        $scope.cancleDelete = function () {
			$scope.deleteModal = false;
            $modalInstance.dismiss();
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
								attribute == 'delete-material' || attribute == 'delete-goods') {
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
