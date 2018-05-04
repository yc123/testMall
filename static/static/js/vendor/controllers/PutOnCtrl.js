define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('PutOnCtrl', ['$scope', 'toaster', 'BrandActive', 'ChineseToPinYin', '$modal', '$stateParams', 'ComponentActiveAPI', 'Goods', 'Currency', 'Price', 'EncryptionService', 'BaseService', function($scope, toaster, BrandActive, ChineseToPinYin, $modal, $stateParams, ComponentActiveAPI, Goods, Currency, Price, EncryptionService, BaseService) {
		BaseService.scrollBackToTop();
		
		// 上架的产品信息
		$scope.goods = {
			original : 1311,
			currencyName : 'RMB',
			tax : 17,
			minBuyQty : 1,
			minPackQty : 1,
			groundingTwoCurrency : "0"
		};
		$scope.qtyPrice = [{}];// 分段数量价格
		$scope.dataError = 0;
		// 保存币别信息
		$scope.currencies = {'RMB' : true, 'USD' : false};
		// 获取发布人信息
		Goods.getPublisherInfo({}, function (data) {
			$scope.goods.publishPhone = data.userTel;
			$scope.goods.publisherName = data.userName;
		});
		// 根据器件信息、商品型号、币别和库存类型查询价格信息
		var getPriceFun = function() {
			// 初次获取价格信息
			var param = {
				uuid : $scope.component.uuid,
				code : $scope.component.code,
				currencyName : $scope.goods.currencyName,
				original : $scope.goods.original,
			};
			Goods.findPriceByCode(param, {}, function(data) {
				if (data && data.RMB && data.RMB.price) {
					$scope.goods.minBuyQty = data.RMB.minBuyQty;
					$scope.goods.minPackQty = data.RMB.minPackQty;
					$scope.qtyPrice[0].start = data.RMB.minBuyQty;
					$scope.qtyPrice[0].RMBPrice = data.RMB.price;
				}
				if (data && data.USD && data.USD.price) {
					$scope.goods.minBuyQty = data.USD.minBuyQty;
					$scope.goods.minPackQty = data.USD.minPackQty;
					$scope.qtyPrice[0].start = data.USD.minBuyQty;
					$scope.qtyPrice[0].USDPrice = data.USD.price;
				}
				if (!data || (!(data.RMB && data.RMB.price) && !(data.USD && data.USD.price))) {
					$scope.goods.minBuyQty = 1;
					$scope.goods.minPackQty = 1;
					$scope.qtyPrice[0].start = data.minBuyQty;
					$scope.qtyPrice[0].RMBPrice = null;
					$scope.qtyPrice[0].USDPrice = null;
				}
			}, function(response) {
				// TODO huxz 待修改
				//toaster.pop('error', '获取价格失败！');
			});
		}
		if($stateParams.prodUuid) {// 第二步模式
			$scope.box1Closed = true;
			$scope.box2Closed = false;
			ComponentActiveAPI.getSimpleInfoByUuid({uuid: $stateParams.prodUuid}, function(data) {
				$scope.component = data;
				$scope.goods.currencyName = 'RMB';
				$scope.goods.shipArea = 'domestic';
				getPriceFun();
			}, function(response) {
				toaster.pop('error', '获取要发布的产品失败！');
			});
			Currency.getAllName({}, {}, function(data) {
				$scope.currency = data;
				$scope.goods.currencyName = 'RMB';
				$scope.goods.shipArea = 'domestic';
				$scope.currencies = {'RMB' : true, 'USD' : false};
			}, function() {
			});
		} else {// 第一步模式
			$scope.box1Closed = false;
			$scope.box2Closed = true;
		}

		// 展开、收拢第一步或第二步
		$scope.closeBox = function(b) {
			$scope[b] = ! $scope[b];
		};

		//
		$scope.alphabets = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

		// 当鼠标移到一个字母上时
		$scope.alphabetHover = function(a){
			if( ! $scope.$alphabetHoverLocked) {
				$scope.alphabet = a;
			}
		};

		// 点击选中一个字母
		$scope.alphabetClick = function(a) {
			if($scope.alphabet != a) {
				$scope.$alphabetHoverLocked = true;
			} else {
				$scope.$alphabetHoverLocked = !$scope.$alphabetHoverLocked;
			}
			$scope.alphabet = a;
		};

		BrandActive.getSimpleInfo({}, {}, function(data) {
			$scope.brands = data;
		}, function(){

		});

		// 品牌首字母判断
		$scope.brandNameFilter = function(brand) {
			var str = ChineseToPinYin.getPinYin(brand.nameCn)[0];
			if($scope.alphabet && str.charAt(0) != $scope.alphabet){
				return false;
			} else{
				return true;
			}
		};

		// 选择类目
		$scope.chooseKind = function() {
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
				$scope.active = data.active;
				/*$scope.actives = data.actives;*/
				window.location.href = 'produce/kind/' + $scope.active.id + '/putOn';
			}, function(){

			});
		};

		// 输入最小起订量
		$scope.setMinBuyQty = function(m) {
			if (m < 1 || m > 1000000) {
				toaster.pop('warning', '提示', '最小起订量必须在1~999999之间');
				$scope.goods.minBuyQty = null;
				$scope.dataError = 0;
				return;
			}
			if ((m - $scope.goods.reserve) > 0) {
				toaster.pop('warning', '提示', '最小起订量必须小于发布的库存数量');
				$scope.goods.minBuyQty = null;
				$scope.dataError = 0;
				return;
			}
			$scope.dataError += 1;
			var index = 0;
			for(var i = 0; i < $scope.qtyPrice.length; i++) {
				var o = $scope.qtyPrice[i];
				if((o.start - m) <= 0 && (o.end - m) >= 0) {
					index = i;
				}
			}
			if(index > 0) {
				$scope.qtyPrice.splice(0, index);
			}
			$scope.qtyPrice[0].start = m;
		};

		// 输入发布库存
		$scope.setReserve = function(r) {
			r = parseInt(r);
			if (r < 1 || r > 99999999) {
				toaster.pop('warning', '提示', '库存数量必须在1~99999999之间');
				$scope.goods.reserve = null;
				$scope.dataError = 0;
				return;
			}
			$scope.dataError += 1;
			var index = $scope.qtyPrice.length;
			for(var i=0; i<$scope.qtyPrice.length; i ++) {
				var o = $scope.qtyPrice[i];
				if(o.start <= r && o.end >= r) {
					index = i + 1;
				}
			}
			$scope.qtyPrice[0].start = 1;
			$scope.qtyPrice = $scope.qtyPrice.splice(0, index);
			$scope.qtyPrice[$scope.qtyPrice.length-1].end = r;
			$scope.qtyPrice[0].start = $scope.qtyPrice[0].start || 0;
		};

		// 选择币别
		$scope.chooseCurrency = function (currencyName) {
			$scope.currencies[currencyName] = !$scope.currencies[currencyName];
			if ($scope.currencies['RMB'] && $scope.currencies['USD']) {
				$scope.goods.shipArea = 'all';
				$scope.goods.currencyName = 'RMB-USD';
				$scope.goods.groundingTwoCurrency = "1";
				getPriceFun();
			} else {
				$scope.goods.groundingTwoCurrency = "0";
			}
			if (!$scope.currencies['RMB'] && !$scope.currencies['USD']) {
				$scope.goods.shipArea = 'domestic';
				$scope.goods.tax = 17;
				$scope.goods.minBuyQty = 1;
				$scope.goods.minPackQty = 1;
				$scope.qtyPrice[0].start = $scope.goods.minBuyQty;
				$scope.qtyPrice[0].RMBPrice = null;
				$scope.qtyPrice[0].USDPrice = null;
			}
			if ($scope.currencies['RMB'] && !$scope.currencies['USD']) {
				$scope.goods.shipArea = 'domestic';
				$scope.goods.currencyName = 'RMB';
				$scope.goods.tax = 17;
				$scope.qtyPrice[0].USDPrice = null;
				getPriceFun();
			}
			if (!$scope.currencies['RMB'] && $scope.currencies['USD']) {
				$scope.goods.shipArea = 'overseas';
				$scope.goods.currencyName = 'USD';
				$scope.goods.tax = 0;
				$scope.qtyPrice[0].RMBPrice = null;
				getPriceFun();
			}
		};

		// 插入分段
		$scope.setMidQty = function(midQty) {
			var index = -1;
			for(var i=0; i<$scope.qtyPrice.length; i ++) {
				var o = $scope.qtyPrice[i];
				if((o.start - midQty) < 0 && (o.end - midQty) > 0) {
					index = i + 1;
				}
			}
			if(index != -1 && midQty) {
				$scope.qtyPrice.splice(index, 0, {start: midQty});
				$scope.qtyPrice[index].end = $scope.qtyPrice[index - 1].end;
				$scope.qtyPrice[index - 1].end = midQty - 1;
				$scope.midQty = null;
			}
		};

		// 输入最小包装量
		$scope.setminPackQty = function(minPackQty) {
			if (minPackQty < 1 || minPackQty > 1000000) {
				toaster.pop('warning', '提示', '最小包装量必须在1~99999999之间');
				$scope.goods.minPackQty = null;
				$scope.dataError = 0;
				return;
			}
			if ((minPackQty - $scope.goods.reserve) > 0) {
				toaster.pop('warning', '提示', '最小包装量必须小于发布库存数量');
				$scope.goods.minPackQty = null;
				$scope.dataError = 0;
				return;
			}
			if ($scope.goods.minBuyQty % minPackQty != 0) {
				toaster.pop('warning', '提示', '最小起订量必须为最小包装量的整数倍');
				$scope.goods.minBuyQty = null;
				$scope.dataError = 0;
				return;
			}
			if ($scope.goods.reserve % minPackQty != 0) {
				toaster.pop('warning', '提示', '库存数量必须为最小包装量的整数倍');
				$scope.goods.reserve = null;
				$scope.dataError = 0;
				return;
			}
			$scope.dataError += 1;
		};

		// 输入交货周期
		$scope.setdeliveryTime =function(deliveryTime) {
			if (deliveryTime < 1 || deliveryTime > 4) {
				toaster.pop('warning', '提示', '交货周期必须在1~4天之间');
				$scope.dataError = 0;
				return null;
			} else {
				$scope.dataError += 1;
				return deliveryTime;
			}
		};
		// 根据企业UU、器件型号、币别、税率和库存类型查询价格
		$scope.findPrice = function() {
			var price = $scope.qtyPrice[0].taxPrice;
			if ($scope.goods.currencyName != 'RMB') { //'USD'
				$scope.goods.tax = 0;
				//如果是USD，默认国外发货
				$scope.goods.shipArea = 'overseas';
			} else if ($scope.goods.currencyName == 'RMB') { // 'RMB' 17%
				$scope.goods.shipArea = 'domestic';
				$scope.goods.tax = 17;
			}
			if ($scope.component.code && $scope.goods.currencyName && $scope.goods.original && $scope.goods.tax != null) {
				getPriceFun();
			} else {
				$scope.qtyPrice[0].rMBPrice = null;
				$scope.qtyPrice[0].uSDPrice = null;
			}
		}

		// 删除分段设置
		$scope.deleteQtyPrice = function(index) {
			$scope.qtyPrice[index-1].end = $scope.qtyPrice[index].end;
			$scope.qtyPrice.splice(index, 1);
		};

		// 打开日期输入框控件
		$scope.openDatePicker = function($event, openParam) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.goods[openParam] = !$scope.goods[openParam];
			// 获取当前时间
			var getTodayDate = function(){
				var date = new Date();
				$scope.maxDate = date;
			};
			getTodayDate();
		};

		// 发布产品
		$scope.publish = function() {
			if(!$scope.component) {
				toaster.pop('warning', '请先通过第一步选择您要上架的商品型号');
				return;
			}

			var c = confirm("是否确定要发布产品？发布之后需要确保能够提供相应的产品库存。");
			if(c) {
				$scope.goods.minBuyQty = 1;
				$scope.goods.minPackQty = 1;
				// 再次检测数据正确性
				$scope.setMinBuyQty($scope.goods.minBuyQty);
				$scope.setReserve($scope.goods.reserve);
				$scope.setminPackQty($scope.goods.minPackQty);

				if ($scope.goods.groundingTwoCurrency == 1) {
					$scope.goods.currencyName = 'RMB-USD';
					$scope.goods.shipArea = 'all';
					$scope.goods.deliveryDemTime = $scope.setdeliveryTime($scope.goods.deliveryDemTime);
					$scope.goods.deliveryHKTime = $scope.setdeliveryTime($scope.goods.deliveryHKTime);
					$scope.goods.prices = $scope.qtyPrice;
					// 检验价格
				} else if ($scope.goods.groundingTwoCurrency == 0) {
					if ($scope.goods.currencyName == 'RMB') {
						$scope.goods.deliveryDemTime = $scope.setdeliveryTime($scope.goods.deliveryDemTime);
						$scope.goods.deliveryHKTime = undefined;
						// 初始化另一种币别的价格信息
						angular.forEach($scope.qtyPrice, function (value) {
							value.USDPrice = undefined;
						});
						$scope.goods.prices = $scope.qtyPrice;
					} else if ($scope.goods.currencyName == 'USD') {
						$scope.goods.deliveryDemTime = undefined;
						$scope.goods.deliveryHKTime = $scope.setdeliveryTime($scope.goods.deliveryHKTime);
						// 初始化另一种币别的价格信息
						angular.forEach($scope.qtyPrice, function (value) {
							value.RMBPrice = undefined;
						});
						$scope.goods.prices = $scope.qtyPrice;
					} else {
						toaster.pop('warning','提醒','请选择发布商品的一种币别');
						return;
					}
				} else {
					toaster.pop('warning','提醒','请选择是否发布两种币别的商品');
					return;
				}

				$scope.goods.uuid = $scope.component.uuid;
				if (typeof $scope.goods.produceDate == 'object') {
					$scope.goods.produceDate = $scope.goods.produceDate.getTime();
				}
				$scope.goods.type = 1051;

				if (!$scope.goods.original) {
					toaster.pop('warning','提醒','请选择库存类型');
					return;
				}

				if ($scope.currencies['RMB'] || $scope.currencies['USD']) {
					if ($scope.currencies['RMB'] && $scope.currencies['USD']) {
						$scope.goods.shipArea = 'all';
						$scope.goods.currencyName = 'RMB-USD';
						$scope.goods.groundingTwoCurrency = "1";
					} else {
						$scope.goods.groundingTwoCurrency = "0";
					}
					if ($scope.currencies['RMB'] && !$scope.currencies['USD']) {
						$scope.goods.shipArea = 'domestic';
						$scope.goods.currencyName = 'RMB';
						$scope.goods.tax = 17;
					}
					if (!$scope.currencies['RMB'] && $scope.currencies['USD']) {
						$scope.goods.shipArea = 'overseas';
						$scope.goods.currencyName = 'USD';
						$scope.goods.tax = 0;
					}
				}else {
					toaster.pop('warning','提醒','请选择上架币别');
					return;
				}

				if (!$scope.goods.shipArea) {
					toaster.pop('warning','提醒','请选择发货地区');
					return;
				}

				if (!$scope.goods.tax || $scope.goods.currencyName != 'RMB' || $scope.goods.tax != 17) {
					$scope.goods.tax = 0;
					toaster.pop('warning','提醒','税率设置为0');
				}

				if (!$scope.goods.returnInWeek) {
					$scope.goods.returnInWeek = 0;
					toaster.pop('warning','提醒','此批次不支持7天无理由退货');
				} else {
					$scope.goods.returnInWeek = 1;
				}

				if ($scope.dataError < 4) {
					return;
				}
				Goods.save({}, $scope.goods, function(data){
					toaster.pop('success', '发布成功');
					$scope.goods = {};
					$scope.qtyPrice = [{}];
					$scope.box1Closed = false;// 展开第一步
					$scope.box2Closed = true;// 收拢第二步
					window.location.replace('vendor#/goodsDetail/' + EncryptionService.encry(data.batchCode));
				}, function(response) {
					toaster.pop('error', '发布失败', response.data);
				});
			}
		};
	}]);

	// 选择类目模态框用到的Ctrl
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
			// 是否选到了子节点
			$scope.enableNext = item.isLeaf;
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
			console.log(a);
			$modalInstance.close(a);
		};

	}]);

});