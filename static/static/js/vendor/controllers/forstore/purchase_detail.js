
define(['app/app'], function(app) {
	"use strict";
	app.register.controller('purchaseDetailCtrl', ['$scope', 'Order', 'Logistics', 'ComponentActive', 'toaster', '$stateParams', '$state', 'Purchase', 'KdnLogistics', '$rootScope', 'NumberService', 'Installment', function($scope, Order, Logistics, ComponentActive, toaster, $stateParams, $state, Purchase, KdnLogistics, $rootScope, NumberService, Installment) {

		// 保存采购单编号信息
		$scope.purchaseId = $stateParams.purchaseId;
		$scope.open = false;
		document.title = '订单详情-优软商城';
		// 记录状态激活信息
		$scope.steps = {
			step1 : false,
			step2 : false,
			step3 : false,
			step4 : false,
			step5 : false
		};

		// TODO 暂时假设运费固定为0
		$scope.freight = 0;

		/**********************************************************************
		 * 初始化
		 **********************************************************************/

		/**
		 * 处理错误信息
		 */
		$scope.error = function (message) {
			toaster.pop('error', message);
			$state.go('vendor_index');
		};

		/**
		 * 根据状态码获取状态码对应的时间
		 *
		 * @param status	采购单状态码
		 */
        $scope.startDate = new Date()
		$scope.getTimeOfStatus = function (status) {
			var time = null;
			angular.forEach($scope.purchase.purchaseHistory, function (history) {
				if (history.status == status) {
					time = history.time;
				}
			});
			return time;
		};
		// 分期付款
		$scope.isShow = false;
		$scope.cancelInstallmentBox = false;
		$scope.showNoAccountBox = false;
		$scope.setShowNoAccountBox = function (flag) {
			$scope.showNoAccountBox = flag;
		}
		$scope.switchToggle = function () {
			$scope.isChange = false;
			if ($scope.purchase.installmentId){
				if ($scope.isShow == true) {
					$scope.cancelInstallmentBox = true;
				}
			} else {
				if (!$scope.isShow) {
					Installment.validationCount({purchaseId : $scope.purchase.id}, null, function (data) {
						if (!data.success) {
							// code==3,表示未设置账户
							if (data.code == 3) {
								$scope.setShowNoAccountBox(true);
							} else {
								toaster.pop('error', data.message);
							}
							$scope.isShow = false;
						} else {
							$scope.isShow = true;
						}
					}, function (error) {
						toaster.pop('error', '系统错误');
					});
				} else {
					$scope.isShow = false;
				}
				// $scope.isShow = !$scope.isShow;
				// if ($scope.isShow == true) {
				// }

			}
			// 验证是否能启用分期信息


		};
		$scope.cancelInstallment = function () {
			$scope.cancelInstallmentBox = false;
		};
		// 删除分期
		$scope.confirmInstallment = function (purchaseid) {
			Installment.deleteInstallment({purchaseId: purchaseid}, null, function () {
				toaster.pop('success', '删除分期成功');
				$scope.cancelInstallmentBox = false;
				$scope.updatePurchase();
				$scope.isShow = false;
				$scope.installmentDetails = [{price: '',deadline: '','detno': 1, 'deadlineShow': false}];
			}, function (response) {
				toaster.pop('error', response.data);
			});
		};
		$scope.numArray = {
			'1': '一',
			'2': '二',
			'3': '三',
			'4': '四',
			'5': '五'
		};
		// 新增一条分期付款
		$scope.installmentDetails  = [{price: '','detno': 1,'deadline': '', 'deadlineShow': false}];
		$scope.addInstallment = function () {
			$scope.installmentDetails.push({price: '','detno': $scope.installmentDetails.length + 1, 'deadline': '','deadlineShow': false});
		};
		// 删除一条分期付款
		$scope.deleteInstallment = function (index) {
			$scope.installmentDetails.splice(index, 1);
			for (var i = index; i < $scope.installmentDetails.length; i++){
				$scope.installmentDetails[i].detno -= 1;
			}
		};

		// 打开日期选择框
		$scope.openDatePicker = function ($event, item, openParam) {
			$event.preventDefault();
			$event.stopPropagation();
			item[openParam] = !item[openParam];
			if ($scope.purchase.installment) {
				angular.forEach($scope.purchase.installment.installmentDetails, function (tmpItem) {
					if (tmpItem != item) {
						tmpItem[openParam] = false;
					}
				});
			}
		};
		//小数位监控
		$scope.inputInstallmentPrice = function (item, price) {
			if (price.split('.').length>1&&price.split('.').last().length > 2) {
				item.price = item.price.substring(0, item.price.length-1);
			}
		}
		// 监控价格
		$scope.changeInstallmentPrice = function (item, price, index) {
			if (price == '') {
				toaster.pop('warning', '提示', '支付金额不能为空');
			} else if (isNaN(price)) {
				toaster.pop('warning', '提示', '金额应该为数字');
				item.price = '';
			} else if (price <= 0) {
				toaster.pop('warning', '提示', '输入金额应该大于0');
				item.price = '';
			} else if (price.split('.').length>1&&price.split('.').last().length > 2) {
				toaster.pop('warning', '提示', '输入小数点位数不能大于2');
			} else if (price > $scope.purchase.ensurePrice) {
				toaster.pop('warning', '提示', '输入金额不得大于或等于总支付金额');
			}
			// $scope.totalNum();
			// if(index == $scope.installmentDetails.length -1){
			// 	return ;
			// }else {
			// 	$scope.installmentDetails[$scope.installmentDetails.length -1].price = $scope.purchase.price - $scope.totalPrice;
			// }
		};
		// 时期
		// $scope.changeBlurDeadline = function (item, index) {
		// 	if (item.deadline && item.deadline.getTime() <= $scope.installmentDetails[index-1].deadline.getTime()) {
		// 		toaster.pop('warning', '提示', '付款时间后一期须大于前一期');
		// 	}
		// };
		$scope.changeEndDate = function (item, first, last) {
			if (typeof item.deadline == 'undefined') {
				alert("日期格式错误，请重新输入！");
				item.deadline = '';
				return;
			}
			if (item.deadline) {
				item.deadline = item.deadline.toString().replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, '23:59:59');
				item.deadline = new Date(formatDateTime(new Date(item.deadline.toString())));
			}
			var nowTime = new Date();
			if (item.deadline < nowTime){
				item.deadline = '';
				toaster.pop('warning','付款时间要大于今天的日期');
				return ;
			}
			if (first != 'first' && first.deadline != ''){
				if (item.deadline <= first.deadline){
					item.deadline = '';
					toaster.pop('warning','付款时间后一期须大于前一期');
					return ;
				}
			}
			if (last != 'last' && last.deadline != ''){
				if (item.deadline >= last.deadline){
					item.deadline = '';
					toaster.pop('warning','付款时间前一期须小于后一期');
					return ;
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
			return y + '-' + m + '-' + d+' '+h+':'+minute+':'+sec;
		};
		$scope.totalPrice = 0;
		$scope.totalNum = function () {
			$scope.totalPrice = 0;
			angular.forEach($scope.installmentDetails, function (item) {
				$scope.totalPrice += Number(item.price);
			})
		};
		// 保存分期付款
		$scope.saveInstallment = function (installmentDetails) {
			// if(!$scope.changeBlurDeadline(installmentDetails)){
			// 	return ;
			// }
			$scope.totalNum();
			for (var i = 0; i < installmentDetails.length; i++) {
				if (!installmentDetails[i].price) {
					toaster.pop('warning', '提示', '支付金额不能为空');
				}
				if (!installmentDetails[i].deadline) {
					toaster.pop('warning', '提示', '付款时间不能为空');
					return ;
				}
			}
			if ($scope.totalPrice.toFixed(2) != $scope.purchase.ensurePrice) {
				toaster.pop('warning', '提示', '输入金额须等于总支付金额');
				return ;
			}
			$scope.installment = {};
			$scope.installment.installmentDetails = installmentDetails;
			var obj = {
				installment: $scope.installment,
				purchaseId: $scope.purchase.id
			};
			Installment.addInstallment(null, obj, function(data){
				$scope.installments = data;
				toaster.pop('success', '提示', '新增分期成功');
				$scope.installmentBox = true;
				$scope.updatePurchase()
			}, function (response) {
				toaster.pop('error', response.data);
			});
		};
		// 取消保存
		$scope.cancelSwitch = function () {
			$scope.isShow = false;
			$scope.installmentDetails = [{price: '',deadline: '','detno': 1, 'deadlineShow': false}];
		};
		$scope.installmentBox = false;
		// 更新分期
		$scope.editBox = false;
		$scope.editInstallment = function () {
			$scope.editBox = true;
			$scope.isChange = false;
		};
		// 取消编辑
		$scope.cancelEdit = function () {
			$scope.editBox = false;
			$scope.updatePurchase()
		};
		//更新分期信息
		$scope.updateInstallment = function (item) {
			// 计算金额
			$scope.totalPrice = 0;
			angular.forEach(item.installmentDetails, function (item) {
				$scope.totalPrice = NumberService.add($scope.totalPrice, Number(item.price));
			});
			for (var i = 0; i < item.installmentDetails.length; i++) {
				if (item.installmentDetails[i].price == '') {
					toaster.pop('warning', '提示', '支付金额不能为空');
					return ;
				} else if (!item.installmentDetails[i].deadline) {
					toaster.pop('warning', '提示', '付款日期不能为空');
					return ;
				}
			}
			if ($scope.totalPrice != $scope.purchase.ensurePrice) {
				toaster.pop('warning', '提示', '输入金额须等于总支付金额');
				return ;
			}
			var obj = {
				installment: item,
				purchaseId: $scope.purchase.id
			};
			Installment.updateInstallment(null, obj, function(){
				toaster.pop('success', '提示', '修改分期成功');
				$scope.editBox = false;
			}, function (response) {
				toaster.pop('error', response.data);
			});
		}
		// 编辑新增一条数据
		$scope.addInstallmentList = function () {
			$scope.purchase.installment.installmentDetails.push({price: '',deadline: '','detno': $scope.purchase.installment.installmentDetails.length + 1, 'deadlineShow': false});
		};
		// 编辑删除数据一条数据
		$scope.deleteInstallmentlist = function (index) {
			$scope.purchase.installment.installmentDetails.splice(index, 1);
			for (var i = index; i < $scope.purchase.installment.installmentDetails.length; i++){
				$scope.purchase.installment.installmentDetails[i].detno -= 1;
			}
		}
		// 联系卖家弹框
		$scope.contactBNox = false;
		$scope.contactSeller = function () {
			$scope.contactBNox = !$scope.contactBNox;
		};
		$scope.closeBox = function () {
			$scope.contactBNox = false;
		};
		/**
		 * 确认当前采购单所属状态
		 */
		$scope.stepStyle = function (status) {
			if (!status || status == '') {
				$scope.error('订单状态不能为空');
				return ;
			}

			angular.forEach($scope.steps, function (value, key) {
				if (value) {
					$scope.steps[key] = false;
				}
			});

			if (status == 501 || status == 524 || status == 525) {
				$scope.steps.step1 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(status);
			} else if (status == 502 || status == 406) {
				$scope.steps.step2 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(status);
			} else if (status == 404) {
				$scope.steps.step3 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(406);
				$scope.steps.time3 = $scope.getTimeOfStatus(status);
			} else if (status == 405 || status == 503 || status == 514) {
				$scope.steps.step4 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(406);
				$scope.steps.time3 = $scope.getTimeOfStatus(404);
				$scope.steps.time4 = $scope.getTimeOfStatus(status);
			} else if (status == 520){
				$scope.steps.step5 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(406);
				$scope.steps.time3 = $scope.getTimeOfStatus(404);
				$scope.steps.time4 = $scope.getTimeOfStatus(514);
				$scope.steps.time5 = $scope.getTimeOfStatus(status);
			}
		};

		// 根据收货地址字符串获取地址信息
		$scope.handlerAddressJSON = function (addressJson) {
			$scope.address = angular.fromJson(addressJson);
			$scope.address.area = $scope.address.area.replace(/,/g, ' ');
		};

		/**
		 *  查询物流信息(接口需要真实运单号)
		 *
		 *  @param  kdnCompanyName	快递公司名称
		 *  @param	logisticsCode	运单号
		 *
		 */
		$scope.hasInfo = false;
		$scope.canShowInfo = false;
		var queryLogistics = function(lgtId){
			if (lgtId) {
				Logistics.findLogisticsById({lgtid: lgtId}, function(data){
					$scope.logistics = data;
					var params = {};
					console.log($scope.logistics);
					params.companyName = $scope.logistics.companyName;
					KdnLogistics.kdnQueryCompany({companyName:$scope.logistics.companyName}, function(response){
						console.log(response);
						if (response.code){
							$scope.canShowInfo = true;
						}else{
							$scope.canShowInfo = false;
						}
					},function (ex) {
						$scope.canShowInfo = false;
					});
					console.log($scope.canShowInfo);
					params.logisticsCode = $scope.logistics.number;
					KdnLogistics.kdnQuery(params, {}, function(response){
						if(!response.errorInfo) {
							$scope.logisticsInfo = eval ("(" + response.traces + ")");
							if($scope.logisticsInfo.length !=0){
								$scope.hasInfo = true;
							}
						}
					}, function(){

					});
				}, function(){

				});
			}
		};

		//物流信息的数组，没有物流信息的status
		$scope.noLogisticInfoArray = {
			501: true,
			502: true,
			504: true,
			406: true,
			603: true
		};

		//配送方式列表
		$scope.deliveryMethod = {
			1301 : '第三方配送',
			1302 : '卖家配送',
			1303 : '上门自提'
		};



		// 检测采购单编号ID是否存在，如果不存在跳转卖家中心首页
		$scope.updatePurchase = function () {
			Purchase.findPurchaseByPurchaseId({ purchaseId : $scope.purchaseId }, null, function (result) {
				if (!result.success) {
					$scope.error(result.message);
					return ;
				}
				$scope.purchase = result.data;
				$scope.purchase.installment = result.data.installment
				if ($scope.purchase.installment) {
					$scope.isShow = true;
				}
				if ($scope.purchase.installment) {
					$scope.installmentBox = true
				}else {
					$scope.installmentBox = false
				}
				$scope.purchase.purchaseHistory = angular.fromJson($scope.purchase.statushistory);
				$scope.purchase.currentTotal = $scope.purchase.price;
				if ($scope.purchase.jsonRule){
					$scope.rule = angular.fromJson($scope.purchase.jsonRule);
				}
				//自提点信息
				if ($scope.purchase.jsonTakeSelf){
					$scope.takeSelf = angular.fromJson($scope.purchase.jsonTakeSelf);
					$scope.takeSelf.area = $scope.takeSelf.area.replace(/,/g,' ');
				}
				// 取消原因
				$scope.purchase.unavailableReason = angular.fromJson($scope.purchase.unavailableReason)
				// 设置状态样式
				$scope.stepStyle($scope.purchase.status);
				// 获取物流信息
				queryLogistics($scope.purchase.lgtId);
				// 发货地址信息
				$scope.handlerAddressJSON($scope.purchase.jsonAddress);

				// 计算
				$scope.purchase.price += $scope.freight;
				$scope.purchase.price = Number(NumberService.toCeil($scope.purchase.price, 2));

				$scope.purchase.invoiceInfo = angular.fromJson($scope.purchase.invoiceAddress)

			}, function () {
				$scope.error('获取订单信息请求失败');
			});
		}
		if (!$scope.purchaseId || $scope.purchaseId == '') {
			$scope.error('订单编号ID不能为空');
		} else {
			$scope.updatePurchase()
			/**
			 * 根据采购单编号ID获取采购单信息
			 */
		}

		var onUnitPriceChange = function (data, price) {
			if (angular.isNumber(price)) {
				if (price >= 10000) {
					data.currentTaxUnitPrice = Number(price.toString().substring(0, 4));
				} else if (price.toString().indexOf('.') > -1) {
					var arr = price.toString().split(".");
					if (arr[0].length > 4) {
						data.currentTaxUnitPrice = Number(arr[0].substring(0, 4) + '.' + arr[1]);
					} else if (arr[1].length > 6) {
						data.currentTaxUnitPrice = Number(arr[0] + '.' + arr[1].substring(0, 6));
					}
				}
			}
		};


		$scope.updateTotal = function (data) {
			onUnitPriceChange(data, data.currentTaxUnitPrice);
			if (data.currentTaxUnitPrice == null){
				data.currentTaxUnitPrice = "";
			}
			if (isNaN(data.currentTaxUnitPrice)){
				data.currentTaxUnitPrice = "";
				toaster.pop('warning', '提示', '输入的价格必须是数字');
			}
			if (Number(data.currentTaxUnitPrice) < 0){
				data.currentTaxUnitPrice = "";
			}
			if (data.currentTaxUnitPrice.length == 0) {
				data.detailTotal = "-";
				$scope.purchase.currentTotal = "-";
				return;
			}
			data.currentTaxUnitPrice = Number(NumberService.toCeil(data.currentTaxUnitPrice, 6));
			data.detailTotal = data.currentTaxUnitPrice * data.number;
			$scope.purchase.currentTotal = 0;
			for (var i = 0; i < $scope.purchase.purchaseDetails.length; i++) {
				if ($scope.purchase.purchaseDetails[i].detailTotal == '-') {
					$scope.purchase.currentTotal = '-';
					return;
				}
				var taxUnit = $scope.purchase.purchaseDetails[i].currentTaxUnitPrice;
				var number = $scope.purchase.purchaseDetails[i].number;
				$scope.purchase.currentTotal += NumberService.mul(taxUnit, number);
			}
			if ($scope.purchase.currentTotal == '-') {
				return;
			}
			//加上运费
			$scope.purchase.currentTotal = NumberService.add($scope.purchase.currentTotal, $scope.purchase.fare);
			$scope.purchase.currentTotal = Number(NumberService.toCeil($scope.purchase.currentTotal, 2));
		};

		// 改价
		$scope.isChange = false;
		$scope.changePrice = function () {
            $scope.isChange = true;
			if ($scope.installmentBox) {
				$scope.cancelEdit();
			} else {
				$scope.cancelSwitch();
			}
			angular.forEach($scope.purchase.purchaseDetails, function (detail) {
				detail.currentTaxUnitPrice = detail.taxUnitPrice;
				detail.detailTotal = detail.taxUnitPrice * detail.number;
			});
			$scope.purchase.currentTotal = $scope.purchase.ensurePrice;
        };

        // 取消
		$scope.cancle = function(){
            $scope.isChange = false;
			angular.forEach($scope.purchase.purchaseDetails, function (detail) {
				detail.currentTaxUnitPrice = "";
			});
		}

		// 保存改价信息
		$scope.saveChange = function(){
			var list = [];
			for(var i = 0; i< $scope.purchase.purchaseDetails.length; i++){
                var param = { };
                param.detailid  = $scope.purchase.purchaseDetails[i].detailid;
                param.modifyingUnitPrice = $scope.purchase.purchaseDetails[i].currentTaxUnitPrice;
				if ($scope.purchase.purchaseDetails[i].detailTotal == '-'){
					toaster.pop('info', '单价不能为空');
					return;
				}
                if ($scope.purchase.purchaseDetails[i].currentTaxUnitPrice < 0.000001){
                    toaster.pop('info', '金额必须要大于0.000001');
                    return;
                }
                list.push(param);
			}
			if ($scope.purchase.currentTotal == '-') {
				toaster.pop('info', '单价不能为空');
				return;
			}
            Purchase.savePurchasePrice({ }, list, function(response){
                $scope.isChange = false;
                Purchase.findPurchaseByPurchaseId({ purchaseId : $scope.purchaseId }, null, function (result) {
                    if (!result.success) {
                        $scope.error(result.message);
                        return ;
                    }
                    $scope.purchase = result.data;
                    $scope.purchase.purchaseHistory = angular.fromJson($scope.purchase.statushistory);
                    // 设置状态样式
                    $scope.stepStyle($scope.purchase.status);
                    // 获取物流信息
                    queryLogistics($scope.purchase.lgtId);
                    // 发货地址信息
                    $scope.handlerAddressJSON($scope.purchase.jsonAddress);

                    // 计算
                    $scope.purchase.price += $scope.freight;
                    $scope.purchase.price = Number(NumberService.toCeil($scope.purchase.price, 2));

                    $scope.purchase.invoiceInfo = angular.fromJson($scope.purchase.invoiceAddress)

                }, function () {
                    $scope.error('获取订单信息请求失败');
                });
                toaster.pop('success', '保存成功');
			}, function(){
                toaster.pop('error', '保存失败');
			})
		}

	}]);
	app.register.filter('noLogisticFilter', function () {
		return function (status) {
			var result = "";
			switch(status) {
				case 501:
				case 504:
				case 502:
				case 406:
					result = "该订单还未发货，没有对应的物流信息";
					break;
				case 404:
				case 405:
				case 503:
				case 514:
				case 506:
				case 520:
					result = "暂无物流信息";
					break;
				case 602:
				case 603:
				case 315:
				case 604:
				case 605:
				case 606:
					result = "该订单已经被取消，未找到对应的物流信息";
					break;
			}
			return result;
		}
	});
});
