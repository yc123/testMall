define([ 'app/app' ], function(app) {

	app.register.controller('buyerTransferCtrl', ['$scope', '$rootScope', '$anchorScroll', '$location','SessionService', 'bankInfoService','$modal', 'toaster', 'bankTransferService', '$filter', 'ngTableParams', 'BaseService', 'OrderSimpleInfo', '$state', '$stateParams', 'Order', 'SmoothScroll', 'EncryptionService','NumberService' ,'$timeout', function($scope, $rootScope, $anchorScroll, $location,SessionService, bankInfoService, $modal, toaster, bankTransferService, $filter, ngTableParams, BaseService, OrderSimpleInfo, $state, $stateParams, Order, SmoothScroll, EncryptionService, NumberService, $timeout) {
		BaseService.scrollBackToTop();

		document.title = '线下付款-优软商城';
		$scope.diliverPrice = [''];
		$scope.type = "PAIDTOPLATFORM";
		// $scope.type = "PAIDTOVENDOR";
		$scope.selectPaymentType = function (type) {
			$scope.type = type;
			// console.log($scope.type);
		};
		if($stateParams.orderid) {
			Order.get({orderid : $stateParams.orderid}, function(data) {
				var arr = [];
				$scope.$$bankTransfer = data[0];

				getSellerAccount();
				// 分期信息
				if ($scope.$$bankTransfer.installmentId){
					$scope.installmentData = data[0].installment;
					// 获取没有付款的期数
					$scope.yesPayinstallmentDetails = [];
					$scope.noPayinstallmentDetails = [];
					if ($scope.installmentData.status == 504){
						angular.forEach($scope.installmentData.installmentDetails, function (item) {
							if (item.status == 505) {
								$scope.yesPayinstallmentDetails.push(item);
								item.installmentImages = item.imgs.split(",");
								item.imgIndex = 0;
								// 已付款价格
								$scope.yesPayinstallmentDetails.payTatalPrice = 0;
								angular.forEach($scope.yesPayinstallmentDetails, function (item) {
									$scope.yesPayinstallmentDetails.payTatalPrice += item.price;
								});
							}else if(item.status == 504){
								$scope.noPayinstallmentDetails.push(item);
								item.installmentImages = item.imgs.split(",");

								// 存放当前未付款图片
								$scope.arrList = item.installmentImages;
                                $scope.diliverPrice = item.pricesArr.split(',');
								$scope.installmentNoPayImg = [];
								angular.forEach($scope.arrList, function (data) {
									$scope.installmentNoPayImg.push({imageUrl: data})
								});
							}
						})
					}
				}
				if ($scope.$$bankTransfer.installmentId) {
					$scope.type = "PAIDTOVENDOR";
				}
				$scope.$$bankTransfer.total = 0;
				for(var i = 0; i < data.length; i++) {
					var item = data[i];
					arr.push(item.orderid);
					$scope.$$bankTransfer.total += item.ensurePrice;
				}
				$scope.orderNum = arr.join('，');
                // $scope.installmentData

			}, function (response) {
				toaster.pop('info', '获取订单的信息有误，请确定付款的订单');
			})
		}else {
			$state.go('buyer_order');
		}
		// 取消
        $scope.loadPage = function () {
            $state.go('buyer_order');
        };
		// 分期付款功能开发
		$scope.loadPersonal = function () {
			bankInfoService.getBuyPersonalBank('', function(data) {
				$scope.buyAccountInfos = resolveData(data.content);
				angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
					buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
				});
				$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
			}, function(error) {
				toaster.pop('error', '错误', '提取个人账户信息失败');
			});
		};
		$scope.loadPersonal();
		// 更换账户
		$scope.changebuyAccountBox = false;
		$scope.changebuyAccount = function () {
			$scope.changebuyAccountBox = true;
		};
		$scope.buyerLists = {};
		$scope.selectItem = function (item) {
			angular.forEach($scope.buyAccountInfos, function (data) {
				if(data.id != item.id) {
					data.isFalse = false;
				}
			});
			$scope.buyerLists = $scope.buyAccountInfos;
			item.isFalse = !item.isFalse;
		};
		$scope.confirmChange = function (){
			$scope.changebuyAccountBox = false;
			angular.forEach($scope.buyerLists, function (item) {
				if (item.isFalse == true) {
					$scope.buyAccount = item;
				}
			});
		};
		// 取消
		$scope.cancelChange = function () {
			$scope.changebuyAccountBox = false;
		};
		// 上传图片
		$scope.imagesList = [{imageUrl: ''}];
		// 循环水单价格
		$scope.waterPriceList = [{price: ''}];
		$scope.addUploadImg = function () {
			$scope.imagesList.push({imageUrl: ''});
			document.onclick = function () {}
			$scope.diliverPrice.push('');
			$scope.waterPriceList.push({price: ''});
			var id = 'uploadImg-'+($scope.imagesList.length-1);
			$timeout(function(){
				angular.element('#'+id+' input').click();
			},1);
		};
		// 删除图片
		$scope.deleteProofInfo = function (index) {
			// if ($scope.imagesList.length == 1) {
			// 	$scope.imagesList[index].imageUrl = '';
			// } else {
			// 	$scope.imagesList.splice(index, 1);
			// }
			$scope.imagesList[index] = {};
			// console.log($scope.imagesList);
		};
		$scope.deleteimg = function (index) {
			$scope.installmentNoPayImg[index] = {};
		};

		$scope.addUploadImgNopay = function (event) {
			// 订单中心的document点击事件
			document.onclick = function () {}

			$scope.installmentNoPayImg.push({imageUrl: ''});
			var id = 'upload-'+($scope.installmentNoPayImg.length-1);
			console.log(id);
			$timeout(function(){
				angular.element('#'+id+' input').click();
			},1);
		};
		/**
		 * 上传付款截图
		 */
		$scope.onUploadPayment = function ($data, index) {
			if (!$data || !$data.path) {
				toaster.pop('error', '您还没有上传新的单据');
				return ;
			}
			var id = 'uploadImg-'+($scope.imagesList.length-1);
			$timeout(function(){
				angular.element('#'+id+' input').click();
			},1);
			$scope.imageUrl = $data.path;
			$scope.imagesList[index].imageUrl = $scope.imageUrl;
			// console.log($scope.imagesList);
		};
		$scope.onUploadPaymentImg = function ($data, index) {
			if (!$data || !$data.path) {
				toaster.pop('error', '您还没有上传新的单据');
				return ;
			}
			$scope.imageUrl = $data.path;
			$scope.installmentNoPayImg[index].imageUrl = $scope.imageUrl;
		};
		/**
		 * 查看大图
		 *
		 * @param imgUrl		图片链接
		 */
		$scope.showImg = showImg;
		function showImg(imgUrl) {
			var src = imgUrl, box = $('#image-box'), modal = $('.modal-content');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		}

		// 分期明细
		$scope.numArray = {
			'1': '一',
			'2': '二',
			'3': '三',
			'4': '四',
			'5': '五'
		};

		// 切换效果
		$scope.changeImg = function (installmentImg, index) {
			angular.forEach(installmentImg.installmentImages, function (data,a) {
				if (index == a){
					installmentImg.imgIndex = a;
				}
			});
		};
		$scope.changePrev = function (installmentImg) {
			if (installmentImg.imgIndex == 0) {
				installmentImg.imgIndex = 0
			}else if(installmentImg.imgIndex > 0){
				installmentImg.imgIndex -= 1;
			}
		};
		$scope.changeNext = function (installmentImg, index) {
			if (installmentImg.imgIndex == installmentImg.installmentImages.length-1) {
				installmentImg.imgIndex = 0
			}else {
				installmentImg.imgIndex += 1;
			}
		};
		//controller
		// 分期付款结束
		$scope.purKind = $rootScope.userInfo.enterprises ? false : true;//应付账户的类别, 默认是企业
		$scope.saleKind = false;//应收账户的类别，默认是企业
		var ids=SessionService.get("ids");

		var page = Number(SessionService.get("page")) || 1;
		var count = Number(SessionService.get("count")) || 20;
		SessionService.unset("ids");
		SessionService.unset("page");
		SessionService.unset("count");
		var hideBankFilter = $filter("hideBankFilter");

		$scope.isSelectAll = false;
		$scope.isSelect = false;
		$scope.orderArray = []; //存放订单链
		$scope.total = 0;
		$scope.currencyName = ''; //存放当前币别

		$scope.nowTime = new Date().getTime();

		//解析数据，从返回的数据中找到要解析的数据
		var resolveData = function(data) {
			var arr = new Array();
			for(var key in data) {
				var numb= Number(key);
				if(angular.isNumber(numb)&&(!isNaN(numb))) {
					arr.push(data[key]);
				}
			}
			return arr;
		};

		$scope.pay = function(order) {
			if(order.availabletime < new Date().getTime()) {
				toaster.pop("error", '错误', '此订单已过期，已失效');
				return;
			}
			angular.forEach($scope.tobePaidTableParams.data, function(obj) {
				obj.isSelect = false;
			});
			order.isSelect = true;
			$scope.showMe = true;
			SmoothScroll.scrollTo(null, 'O', -68);
		};

		//返回修改
		$scope.alterPay = function() {
			$location.hash('toptip');
			$anchorScroll();
			$scope.showMe = false;
		};

		$scope.batchPay = function() {
			if(!$scope.orderNum) {
				toaster.pop("error", '错误', '请选择要付款的单');
				return ;
			}
			$location.hash('anchorScroll');
			$anchorScroll();
			$scope.showMe = true;
		};

		var getOriginalData = function(data) {
			var result = {};
			if(data&&data.length) {
				result = data[0];
			}else {
				result = null;
			}
			return result;
		};

		$scope.selectAll = function() {
			$scope.isSelectAll = !$scope.isSelectAll;
			$scope.orderArray = [];
			$scope.orderNum = "";
			$scope.total = 0;
			$scope.currencyName = $scope.tobePaidTableParams.data[0].currency;
			var hasConflict = false;
			angular.forEach($scope.tobePaidTableParams.data, function(order) {
				if($scope.isSelectAll) {
					if((order.availabletime >= new Date().getTime()) && ($scope.currencyName == order.currency)) {
						$scope.orderArray.push(order.orderid);
						order.isSelect = true;
						$scope.total += Number(order.price);
					}else {
						hasConflict = true;
						order.isSelect = false;
					}

				}else {
					order.isSelect = false;
					$scope.currencyName = '';
				}
			});
			if(hasConflict) {
				toaster.pop('info', '您当前操作的订单过期或与选中的币别  '+$scope.currencyName+' 不一致,不能统一付款');
			}
			$scope.orderNum = $scope.orderArray.join('，');
		};

		$scope.doSelect = function(order) {
			var result = true;
			if(order.isSelect) {
				if($scope.orderArray.length == 0) {
					$scope.currencyName = order.currency;
				}
				if(order.availabletime < new Date().getTime()) {
					toaster.pop("info", '此订单已过付款期或');
					order.isSelect = false;
					result = false;//代表已经有没有选中的状态了
					return ;
				}
				if($scope.currencyName != order.currency) {
					toaster.pop("info", '与选中的币别 '+$scope.currencyName + ' 不一致，不能统一付款！');
					order.isSelect = false;
					result = false;//代表已经有没有选中的状态了
					return ;
				}
				$scope.orderArray.push(order.orderid);
				$scope.total += Number(order.price);
			}else {
				var index = -1;
				angular.forEach($scope.orderArray, function(item, key) {
					if(item == order.orderid) {
						index = key;
						$scope.total -= Number(order.price);
					}
				});
				$scope.orderArray.splice(index, 1);
				result = false;//代表已经有没有选中的状态了
			}
			//检查是否选中了所有的单选框
			//如果现在还为true,就检查所有行信息的是否都选中
			if(result) {
				angular.forEach($scope.tobePaidTableParams.data, function(order) {
					if(!order.isSelect) {
						result = false;
					}
				});
			}

			$scope.isSelectAll = result;
			$scope.orderNum = $scope.orderArray.join('，');
		}

		// //根据单选框的状态，提取不同的数据
		// var getBuyAccount = function() {
		// 	if(!$scope.purKind) {
		// 		bankInfoService.getBuyEnterpriseBank('', function(data) {
		// 			$scope.buyAccountInfos = resolveData(data);
		// 			angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
		// 				buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
		// 			});
		// 			$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
		// 		}, function(error) {
		// 			toaster.pop('error', '错误', '提取企业账户信息失败');
		// 		});
		// 	}else {
		// 		bankInfoService.getBuyPersonalBank('', function(data) {
		// 			$scope.buyAccountInfos = resolveData(data);
		// 			angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
		// 				buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
		// 			});
		// 			$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
		// 		}, function(error) {
		// 			toaster.pop('error', '错误', '提取个人账户信息失败');
		// 		});
		// 	}
		// };
		//
		// //开始时，就获取账户信息
		// getBuyAccount();

		//新增账户
		$scope.editAccount = function() {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoModal.html',
				controller : 'AccountCtrl',
				resolve : {
					account : function() {
						return {};
					}
				}
			});

			modalInstance.result.then(function(account) {
				$scope.buyAccount = account;
			}, function() {

			});
		};

		//获取管理平台账户信息
		var getSellerAccount = function() {
			// 平台账户
			bankInfoService.getAdminEnterAccount('', function(data) {
				$scope.saleAccountInfos = resolveData(data);
				console.log($scope.saleAccountInfos);
				angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
					saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
				});
				$scope.saleAccount = getOriginalData($scope.saleAccountInfos);
			}, function(res) {
				toaster.pop('error', '错误', '获取卖家企业账户信息失败');
			});
			// 卖家私人账户
			// bankInfoService.getAdminPersAccount('', function(data) {
			// 	$scope.saleAccountInfos = resolveData(data);
			// 	angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
			// 		saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
			// 	});
			// 	$scope.salePerAccount = getOriginalData($scope.saleAccountInfos);
			// }, function(res) {
			// 	toaster.pop('error', '错误', '获取卖家个人账户信息失败');
			// });
			//
			bankInfoService.getSaleEeterprise({enuu: $scope.$$bankTransfer.sellerenuu},{}, function(data) {
				$scope.saleAccountInfos = resolveData(data);
				angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
					saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
				});
				$scope.salePerAccount = getOriginalData($scope.saleAccountInfos);
			}, function(res) {
				toaster.pop('error', '错误', '获取卖家个人账户信息失败');
			});
		};

		// getSellerAccount();

		$scope.set = function(data, isBuy) {
			if(isBuy) {
				if(!angular.equals($scope.purKind, data)) {
					$scope.purKind = data;
					getBuyAccount();
				}
			}else {
				if(!angular.equals($scope.saleKind, data)) {
					$scope.saleKind = data;
					getSellerAccount();
				}
			}

		};

		// 搜索框内容转换成大写
		var t;
		var setTime = function() {
			if($scope.time > 0) {
				t = setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				$scope.keyword = angular.uppercase($scope.keyword);
			}
		};

		$scope.upper = function() {
			$scope.time = 1;
			clearTimeout(t);
			setTime();
		}

		// 根据搜索框输入信息搜索对应订单
		$scope.searchFor = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.tobePaidTableParams.reload();
		}

		$scope.tobePaidTableParams = new ngTableParams({
			page : page,
			count : count,
			sorting : {
				creattime: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = '503';
				Order.getIndividualOrder(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
					//重新加载数据后，数据记录删除
					$scope.isSelectAll = false;
					$scope.orderNum = ""; //单号的链接字符串
					$scope.orderArray = []; //存放
					$scope.total = 0;

					if(ids) {
						var arr = ids.split('-');
						var result = true;
						for(var i = 0; i < arr.length; i++) {
							angular.forEach(page.content, function(order) {
								if(order.orderid == arr[i]) {
									order.isSelect = true;
									$scope.orderArray.push(order.orderid);
									$scope.total += Number(order.price);
								}
							});
						}
						angular.forEach(page.content, function(order) {
							if(!order.isSelect) {
								result = false;
							}
						});
						$scope.isSelectAll = result;
						$scope.orderNum = $scope.orderArray.join('，');
						if($scope.orderNum) {
							$scope.showMe = true;
						}
					}
				});
			}
		});

		//跳出模态框，data有数据代表编辑，data为空则代表新增。
		$scope.bankInfo = function(data) {
			var modalInstance = $modal.open({
				templateUrl: 'static/common/bankInfoModal.html',
				controller: 'BankInfoCtrl',
				resolve: {
					data: function() {
						return angular.copy(data);
					}
				}
			});
		};

		//新增账户
		$scope.newAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoModal.html',
				controller : 'BankInfoCtrl',
				resolve : {
					kind : function() {
						//深拷贝一份
						return angular.copy($scope.purKind);
					},
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					}
				}
			});

			modalInstance.result.then(function(account) {
				if(account.kind) {
					bankInfoService.saveBuyPersonalBank({}, account, function(data) {
						toaster.pop('success', '成功','信息已添加');
						$scope.purKind = account.kind;
						getBuyAccount();  //这个方法不能提取到外面，因为存在异步。
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}else {
					//企业账户
					bankInfoService.saveBuyEnterpriseBank({}, account, function(data) {
						toaster.pop('success', '保存成功','信息已添加');
						$scope.purKind = account.kind;
						getBuyAccount();
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}
			}, function() {

			});
		};

		$scope.deleteAccount = function(buyAccount) {
			var  isSure = confirm('确认删除本银行账户？删除后无法恢复，请谨慎操作');
			if(isSure){
				bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
					toaster.pop('success', '删除成功');
					getBuyAccount();
				}, function(response) {
					toaster.pop('error', '删除失败');
				})
			}
		}

		$scope.onDiliverPriceChange = function (index) {
			if (!($scope.diliverPrice[index] > 0)) {
				$scope.diliverPrice[index] = '';
				toaster.pop('info', '提示', '分期金额必须大于0');
			}
		}


		$scope.confirm = function() {
			var imageArray = [];
			if ($scope.$$bankTransfer.installmentId && $scope.noPayinstallmentDetails.length > 0) {
				$scope.imagesList = $scope.installmentNoPayImg;
			}
			for (var i = 0; i< $scope.imagesList.length; i++) {
				if ($scope.imagesList.length <= 6) {
					if ($scope.imagesList[i].imageUrl && $scope.imagesList[i].imageUrl != '') {
						if ($scope.type == "PAIDTOVENDOR" && $scope.diliverPrice[i] == '') {
							toaster.pop('info','提示','请输入付款截图下对应的付款金额');
							return;
						}
						imageArray.push($scope.imagesList[i].imageUrl);
					} else if ($scope.type == "PAIDTOVENDOR" && $scope.imagesList[i].imageUrl == '') {
						toaster.pop('info','提示','请输入付款金额对应的付款截图');
						return;
					}
				}
			}
			// console.log($scope.diliverPrice);
			// console.log($scope.imagesList);
			var str = imageArray.join(",");
			if(angular.isUndefined($scope.orderNum) || angular.equals($scope.orderNum,'') || angular.equals($scope.$$bankTransfer.total, 0)) {
				toaster.pop('info', '提示', '没有选择要付款的订单,或付款总额为0');
				return ;
			}
			// if(angular.isUndefined($scope.buyAccount)||angular.equals("{}", angular.toJson($scope.buyAccount))  || $scope.buyAccount == null) {
			// 	toaster.pop('info', '提示', '请选择买家账户');
			// 	return ;
			// }
			if ($scope.type == 'PAIDTOVENDOR'){
				$scope.saleAccount = $scope.salePerAccount;
			}
			if(angular.isUndefined($scope.saleAccount)||angular.equals("{}", angular.toJson($scope.saleAccount)) || $scope.saleAccount == null) {
				if ($scope.type == 'PAIDTOVENDOR') {
					toaster.pop('info', '提示', '尚未选择收款账户，请联系卖家处理');
				} else {
					toaster.pop('info', '提示', '请选择卖家账户');
				}
				return ;
			}
			if(!str || str == ''){
				toaster.pop('info', '提示', '请选择付款截图');
				return ;
			}

			if ($scope.type == "PAIDTOVENDOR") {
				var firstItem = {};
				var firstFlag = false;
				angular.forEach($scope.installmentData.installmentDetails, function (item) {
					if (!firstFlag) {
						if (item.status != 505) {
							firstItem = item;
							firstFlag = true;
						}
					}
				});

				var tmpPrice = 0;
				angular.forEach($scope.diliverPrice, function (item) {
					if (item != '') {
						tmpPrice = NumberService.add(tmpPrice, parseFloat(item));
					}
				})

				if (firstItem.price != tmpPrice) {
					toaster.pop('info', '提示', '付款金额为空或不等于分期金额，请重新确认');
					return;
				}
			}

			var transfer = {};
			if ($scope.$$bankTransfer.installment){
				var installmentDetailId = '';
				angular.forEach($scope.$$bankTransfer.installment.installmentDetails, function (installmentDetail) {
					if (installmentDetail.detno == $scope.$$bankTransfer.installment.currentNo)
						installmentDetailId = installmentDetail.id;
				})
				transfer.installmentDetailId = installmentDetailId;
			};

			// var buyAccount = angular.copy($scope.buyAccount);
			// var saleAccount = angular.copy($scope.saleAccount);
			// delete saleAccount.filterAccount;
			// delete buyAccount.filterAccount;
			// var jsonPament = angular.toJson(buyAccount);
			// var jsonReceive = angular.toJson(saleAccount);
			// transfer.jsonPament = jsonPament;
			// transfer.jsonReceive = jsonReceive;
			// console.log(transfer.jsonReceive)
			transfer.imgUrl = str;
			transfer.type = $scope.type;
			// transfer.transferTime = $scope.transferTime.getTime();
			transfer.total = $scope.$$bankTransfer.total;
            transfer.pricesArr = $scope.diliverPrice.join(',');
			bankTransferService.saveTransfer({order: $scope.orderNum.split('，').join('-')}, transfer, function(data) {
				toaster.pop('success', '提交成功');
				$state.go('buyer_order');
			}, function(response) {
				toaster.pop("error", '失败', '提交失败:' + response.data);
			});
		}

		$scope.buyExpose = false;
		$scope.salexpose = false;
		//expose代表展开的状态，isBuy代表当前操作的数据
		$scope.doExpose = function(expose, isBuy) {
			if(isBuy) {
				$scope.buyExpose = expose;
			}else {
				$scope.salexpose = expose;
			}
		}

		// /**
		//  * 上传付款截图
		//  */
		// $scope.onUploadPayment = function ($data) {
		//     if (!$data || !$data.path) {
		//         toaster.pop('error', '付款截图上传失败');
		//         return ;
		//     }
		//     $scope.imageUrl = $data.path;
		// };

		$scope.select = function(account, isBuy) {
			if(isBuy) {
				$scope.buyAccount = account;
			}else {
				$scope.saleAccount = account;
			}
		}

		//获取当前时间
		var getTodayDate = function(){
			var date = new Date();
			$scope.maxDate = date;
		};
		getTodayDate();
	}]);

	app.register.controller('timeCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
		$scope.time = 5;
		var setTime = function() {
			if($scope.time > 0) {
				setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				$scope.closeNow();
			}
		};

		setTime();

		$scope.closeNow = function() {
			$modalInstance.close($scope.time);
		};

		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};
	}]);

	app.register.controller('AccountCtrl', ['$scope', '$modalInstance', 'account', 'bankInfoService', 'toaster', function($scope, $modalInstance, account, bankInfoService, toaster){

		/**
		 * 目前只支持的银行
		 * @type {string[]}
		 */
		$scope.bankList = [
			'中国银行','中国建设银行','中国工商银行','中国农业银行','交通银行','招商银行','中国民生银行',
			'兴业银行','中信银行','中国光大银行','广发银行','平安银行','中国邮政储蓄银行','华夏银行','浦发银行'
		];

		var initIndex = function () {
			$scope.selectIndex = -1;
			$scope.downIndex = 0;
		};

		$scope.getItemFocus = function() {
			$scope.showBankFrame = true;
			$scope.matchData = true;
			$scope.resultList = $scope.bankList;
			initIndex();
		};

		$scope.onItemBlur = function () {
			if ($scope.time){
				clearTimeout($scope.time);
			}
			$scope.time = setTimeout(function () {
				$scope.$apply(function () {
					$scope.showBankFrame = false;
				});
			}, 200);
		};
		$scope.onKeyUp = function () {
			var dom = document.getElementById("ulContent");
			console.log(event);
			if ($scope.showBankFrame){
				if(event.keyCode == 40) { //监听到按下键
					$scope.selectIndex ++;
					if ($scope.downIndex == 5){
						dom.scrollTop += 44;
					}
					if ($scope.downIndex <= 4){
						$scope.downIndex++;
					}
					if($scope.selectIndex >= $scope.resultList.length){
						$scope.selectIndex = 0;
						dom.scrollTop = 0;
						$scope.downIndex = 1;
					}
					$scope.account.bankname = $scope.resultList[$scope.selectIndex];
					// $scope.containsAttr($scope.logistics.companyName);
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if ($scope.downIndex == 1){
						dom.scrollTop -= 44;
					}
					if ($scope.downIndex >= 2){
						$scope.downIndex--;
					}
					if($scope.selectIndex < 0){
						$scope.selectIndex = $scope.resultList.length - 1;
						dom.scrollTop = 2400;
						$scope.downIndex = 5;
					}
					$scope.account.bankname = $scope.resultList[$scope.selectIndex];
					// $scope.containsAttr($scope.logistics.companyName);
				} else if(event.keyCode == 13) { //确定键
					$scope.showBankFrame = false;
				}
			}
		};

		$scope.showList = function () {
			$scope.showBankFrame = !$scope.showBankFrame;
			$scope.matchData = true;
			$scope.resultList = $scope.bankList;
		};

		$scope.inputBankName = function () {
			$scope.showBankFrame = true;
		};

		$scope.fitBankToAccount = function (item) {
			$scope.account.bankname = item;
			$scope.showBankFrame = false;
		};

		$scope.account = account;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}

		var matchArray = function () {
			$scope.account.bankname = $scope.account.bankname ? $scope.account.bankname : '';
			$scope.resultList = $scope.bankList.filter(function (data) {
				if (data.indexOf($scope.account.bankname) >= 0){
					return data;
				}
			});
			if ($scope.resultList.length > 0){
				$scope.matchData = true;
			}else{
				$scope.matchData = false;
			}
		};

		/**
		 * 验证新增账户格式
		 * @param num
		 */
		$scope.checkAccount = function (num) {
			var size;
			if (num == 1){
				//验证开户银行名称
				$scope.showBankFrame = true;
				matchArray();
			}else if(num == 2){
				//验证开户支行名称
				if($scope.account.branchname){
					size = $scope.account.branchname.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 40){
						$scope.branchError = true;
					}else {
						$scope.branchError = false;
					}
					var telPatt = new RegExp("^[\u2E80-\u9FFF]+$");
					if (telPatt.test($scope.account.branchname)){
						$scope.branchPattError = false;
					}else {
						$scope.branchPattError = true;
					}
				}
			}else if(num == 3){
				//验证银行账号
				if ($scope.account.number){
					size = $scope.account.number.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 30){
						$scope.numberError = true;
					}else {
						$scope.numberError = false;
					}
					var numPatt = new RegExp("^[0-9]+$");
					if (numPatt.test($scope.account.number)){
						$scope.numberPattError = false;
					}else {
						$scope.numberPattError = true;
					}
					validateRepeat($scope.account.number);
				}
			}else if(num == 4){
				//验证开户名称
				if ($scope.account.accountname){
					size = $scope.account.accountname.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 100){
						$scope.nameError = true;
					}else {
						$scope.nameError = false;
					}
				}
			}
		};

		var validateRepeat = function (number) {
			bankInfoService.getCountByNumber({type:1061, number:number}, {}, function (data) {
				if (data.success){
					if (data.data != 0){
						$scope.repeatError = true;
					}else {
						$scope.repeatError = false;
					}
				}else {
					toaster.pop("info", data.message);
				}
			});
		};

		$scope.confirm = function() {
			var account = $scope.account;

			if (!account){
				toaster.pop('error', '请按要求填写正确的信息');
				return ;
			}
			if (!account.bankname || !account.branchname || !account.number || !account.accountname){
				toaster.pop('error', '请按要求填写正确的信息');
				return ;
			}
			if (!$scope.matchData || $scope.branchError || $scope.branchPattError || $scope.numberError || $scope.numberPattError ||
				$scope.nameError || $scope.repeatError){
				toaster.pop('error', '请按要求填写正确的信息');
				return ;
			}

			var method = 'saveBuyPersonalBank'; //不区分个人和企业账户
			bankInfoService[method].call(null, null, $scope.account, function(data) {
				toaster.pop('success', '保存成功');
				$modalInstance.close(data)
			},function (response) {
				toaster.pop('warning', '保存信息失败');
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		}

	}]);

	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		if($scope.account) {
			$scope.eidt = true;
		} else {
			delete $scope.eidt;
		}
		$scope.kind = kind;

		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
			$scope.account.currency = 'RMB'; // 默认银行卡币别是人民币
		}

		$scope.set = function(kind) {
			$scope.kind = kind;
		}

		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}

		$scope.cancel = function() {
			$modalInstance.dismiss();
		}

	}]);

	app.register.controller('ImageInsertCtrl', ['$scope', '$modalInstance', 'SmoothScroll', function($scope, $modalInstance, SmoothScroll) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = path.substring(0, path.lastIndexOf('.')) + "_150x90" + path.substr(path.lastIndexOf('.'));
			$scope.$apply(function(){
				$scope.image.src = data.path;
				$scope.image.thumb = path;
			});
		};

		$scope.close = function() {
			$modalInstance.dismiss();
			SmoothScroll.scrollTo(null, 'O', -68);
		};

		$scope.confirm = function() {
			$modalInstance.close($scope.image);
			$scope.imageUrl = null;
			SmoothScroll.scrollTo(null, 'O', -68);
		};
	}]);
});
