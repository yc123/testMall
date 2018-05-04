define(['app/app'], function(app) {
	app.register.controller('exceptionApplyCtrl', ['$scope', '$stateParams', 'Purchase', 'toaster', 'PuExAfterSale', '$filter', '$state', 'AfterSaleApplyTypes', function($scope, $stateParams, Purchase, toaster, PuExAfterSale, $filter, $state, AfterSaleApplyTypes) {
		/************************************ business logic ************************************/
		var enIdFilter = $filter('EncryptionFilter');
		$scope.applyTypes = AfterSaleApplyTypes;
		
        $scope.applyInfo = {
            batchQty : 0,
            prodQty : 0,
            prodTotalAmount : 0,
            freight : 0,
            totalAmount : 0,
            applyDetails : [],
            cmps : {},
            cmpQty : 0,
            applyReasonType : 'EXCHANGE',
            applyReason : ''
        };
		
        // 生成申请单信息
        var generateApplyInfo = function () {
            var applyInfo = $scope.applyInfo;
            applyInfo.purchaseId = $scope.purchase.purchaseid;
            applyInfo.taxRate = $scope.purchase.taxRate;
            applyInfo.applyDetails = [];
            angular.forEach($scope.purchase.purchaseDetails, function (detail,k) {
                if(detail.checked) applyInfo.applyDetails.push(getApplyDetailInfo(detail));
            });
            return applyInfo;
        }
        
        // 抓取申请明细信息
        var getApplyDetailInfo = function(detail) {
            var applyDetailInfo = {};
            applyDetailInfo.purchaseDetailId = detail.detailid;
            if(detail.applyType) {
                applyDetailInfo.applyType = detail.applyType;
            }
            applyDetailInfo.applyReason = detail.applyReason;
            return applyDetailInfo;
        }
        
        // 更新汇总信息
        $scope.updateDetailSummary = function (detail) {
            var applyInfo = $scope.applyInfo;
            if(detail.checked) {
                applyInfo.batchQty++;
                applyInfo.prodQty += detail.number;
                applyInfo.prodTotalAmount += detail.price;
                applyInfo.totalAmount = applyInfo.prodTotalAmount
            }else {
                applyInfo.batchQty--;
                applyInfo.prodQty -= detail.number;
                applyInfo.prodTotalAmount -= detail.price;
                applyInfo.totalAmount = applyInfo.prodTotalAmount;
            }

            if(!applyInfo.cmps[detail.cmpCode]) {
                applyInfo.cmps[detail.cmpCode] = [];
            }
            var cmpBatches = applyInfo.cmps[detail.cmpCode];
            var pos = cmpBatches.indexOf(detail.batchCode);
            if(pos !== -1) {
                cmpBatches.splice(pos, 1);
            }else {
                cmpBatches.push(detail.batchCode);
            }
            if(cmpBatches.toString() == "") {
                delete applyInfo.cmps[detail.cmpCode];
            }
            applyInfo.cmpQty = Object.keys(applyInfo.cmps).length;

            $scope.checkDetails();

        }
        
		Purchase.getPurchase({puid: $stateParams.purchaseid}, null, function(date) {
			$scope.purchase = date;
			if($scope.purchase.exApplyStatusFromMall) {
				PuExAfterSale.getPuExAfterSaleApply({applyId : enIdFilter($scope.purchase.exApplyIdFromMall)}, function(data) {
					$scope.apply = data;
					//将data的统计信息赋值到applyInfo中
					angular.forEach($scope.applyInfo, function(value, key) {
						$scope.applyInfo[key] = data[key];
					});
					//将所有的相关信息绑定到detail表中
					angular.forEach(data.applyDetails, function(detail, k) {
						var purchaseDetail = $scope.purchase.purchaseDetails[detail.purchaseDetail.detno - 1];
						var negotiation = detail.negotiations[0];
						purchaseDetail.checked = true;
						purchaseDetail.applyType = negotiation.mallToSupApplyType;
						purchaseDetail.applyReason = negotiation.mallToSupApplyReason;
						purchaseDetail.supToMallApplyReason = negotiation.supToMallApplyReason;
						purchaseDetail.supToMallApplyType = negotiation.supToMallApplyType;
						if(purchaseDetail.applyType == purchaseDetail.supToMallApplyType) {
							purchaseDetail.finalApplyType = purchaseDetail.applyType;
						}
					});
				}, function(response) {
					toaster.pop('error', '获取采购异常申请信息失败');
				});
			}else {
				angular.forEach($scope.purchase.purchaseDetails, function(detail, k) {
					detail.applyType = "EXCHANGE";
				});
			}
		}, function(response) {
			toaster.pop('error', '获取采购单信息失败' + response.data);
		});
		
        // 检查所有勾选的明细信息的完整性
        $scope.checkDetails = function () {
            if($scope.applyInfo.batchQty < 1) {
                $scope.detailsOK = false;
            }else {
                $scope.detailsOK = true;
            }
            angular.forEach($scope.purchase.purchaseDetails, function (detail,k) {
                if(detail.checked) {
                    if(!detail.applyType) {
                        $scope.detailsOK = false;
                        return;
                    }
                }
            })
        }
		
 		$scope.ensureApply = function() {
			var applyInfo = generateApplyInfo();
			PuExAfterSale.createPuExAfterSaleApply({purchaseId: $scope.purchase.purchaseid}, applyInfo, function(data) {
				toaster.pop('success', '创建异常申请成功');
				$state.go('trade_purchase');
			}, function(response) {
				toaster.pop('error', '异常申请失败' + response.data);
			});
		};
		
		$scope.cancleApply = function() {
			PuExAfterSale.canclePuExAfterSaleApply({applyId : $scope.apply.applyId}, function(data) {
				toaster.pop('success', '异常申请单取消成功');
				$state.go('trade_purchase');
			}, function(response) {
				toaster.pop('error', '取消异常申请单失败，请重新取消' + response.data)
			});
		};
		
		var getHandleInfo = function() {
			var jsonInfo = [];
			var exception = '';
			angular.forEach($scope.purchase.purchaseDetails, function(detail, k) {
				if(detail.checked) {
					var afterSaleDetail = {};
					afterSaleDetail.purchaseDetailId = detail.detailid;
					if(detail.finalApplyType != "EXCHANGE" && detail.finalApplyType != 'CANCLE') {
						exception = '平台异常申请的类型只能是换货或者取消当前的异常申请明细';
						return;
					}
					afterSaleDetail.finalApplyType = detail.finalApplyType;
					afterSaleDetail.finalApplyReason = detail.finalApplyReason;
					if(detail.finalApplyReason == '' || !detail.finalApplyReason) {
						exception = '亲，请给点仲裁说明吧';
						return ;
					}
					jsonInfo.push(afterSaleDetail);
				}
			});
			if(exception != '') {
				toaster.pop('info', exception);
				return ;
			}
			if(jsonInfo.length == 0) {
				toaster.pop('info', '请选择需要异常申请的明细');
				return ;
			}
			return jsonInfo;
		}
		
		$scope.agreeHandle = function() {
			var jsonInfo = getHandleInfo();
			if(!jsonInfo || jsonInfo.length == 0) {
				return;
			}
			PuExAfterSale.agreenHandlePuExAfterSaleApplyByB2C({applyId : $scope.purchase.exApplyIdFromMall}, jsonInfo, function(data) {
				var result = '';
				if(data.changeid) {
					result = result + " 生成的换货单是：" + data.changeid;
				}
				toaster.pop('success', '同意处理成功' + result);
				$state.go('trade_purchase');
			}, function(response) {
				toaster.pop('error', '同意处理失败，请重新提交');
			});
		};
	}]);
});