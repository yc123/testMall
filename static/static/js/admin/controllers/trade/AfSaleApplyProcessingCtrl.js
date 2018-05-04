define(['app/app'], function(app) {
	'use strict';
	app.register.controller('AfSaleApplyProcessingCtrl', ['$scope', 'toaster', 'Order', '$stateParams', '$filter', 'AfterSale', '$location', '$q', 'BaseService', 'ngTableParams', 'AfterSaleApplyTypes', 'ApplyStatus', function ($scope, toaster, Order, $stateParams, $filter, AfterSale, $location, $q, BaseService, ngTableParams, AfterSaleApplyTypes, ApplyStatus) {

		/************************************ general ************************************/
		// shortcuts for get last element of an array
		if (!Array.prototype.last){
			Array.prototype.last = function(){
				return this[this.length - 1];
			};
		};

		var enIdFilter = $filter('EncryptionFilter');

		$scope.active = window.sessionStorage.getItem('orExStateInAdmin') || 'all';
		// 选择状态
		$scope.setActive = function(active) {
			if($scope.active != active) {
				window.sessionStorage.setItem('orExStateInAdmin', active);
				$scope.active = active;
				$scope.applyTableParams.page(1);
				$scope.applyTableParams.reload();
			}
		};

		/************************************ data ************************************/
		$scope.applyTypes = AfterSaleApplyTypes;

		// 获取一页申请单数据
		var getData = function() {
			$scope.applyTableParams = new ngTableParams({
				page : 1,
				count : 5,
				sorting: {
					updateTime : 'DESC'
				}
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var param = BaseService.parseParams(params.url());
					param.status = window.sessionStorage.getItem('orExStateInAdmin');
					AfterSale.getApplyList(BaseService.parseParams(param), function(data) {
						$defer.resolve(data.content);
						params.total(data.totalElements);
						if (data.content) {
							angular.forEach(data.content, function (apply) {
								if (apply.applyDetails) {
									Order.queryOrderDetailsNotReturn({orderId : apply.order.orderid}, {}, function (data) {
										angular.forEach(apply.applyDetails, function (detail) {
											if (!data[detail.orderDetailId]) {
												detail.isReturn = true;
											}
										});
									});
								}
							})
						}
					}, function(res) {
						toaster.pop('error', '获取信息失败 ', res.data);
					});
				}
			});
		};
		getData();


		/************************************ business logic ************************************/
		// 更新
		$scope.checkApply = function (apply) {
			for(var i = 0; i < apply.applyDetails.length; i++) {
				var detail = apply.applyDetails[i];
				if(apply.status == 'BUYER_TO_MALL' && !detail.mallToSupApplyType) {
					apply.canSubmit = false;
					return;
				}
				if(apply.status == 'SUP_TO_MALL' && !detail.mallToBuyerApplyType) {
					apply.canSubmit = false;
					return;
				}
			}
			apply.canSubmit = true;
			console.log(apply.canSubmit)
		}


		/************************************ collect data ************************************/
			// 抓取申请明细信息
		var getApplyDetailInfo = function (apply, detail) {
				var applyDetailInfo = {};
				if(apply.status == 'BUYER_TO_MALL') {
					applyDetailInfo.applyType = detail.mallToSupApplyType;
					applyDetailInfo.applyReason = detail.mallToSupApplyReason;
				}else if(apply.status == 'SUP_TO_MALL') {
					applyDetailInfo.applyType = detail.mallToBuyerApplyType;
					applyDetailInfo.applyReason = detail.mallToBuyerApplyReason;
				}
				applyDetailInfo.applyDetailId = detail.applyDetailId;
				return applyDetailInfo;
			}

		// 生成申请单信息
		var generateApplyInfo = function (apply) {
			var applyInfo = {};
			applyInfo.applyDetails = [];
			applyInfo.applyId = apply.applyId;
			angular.forEach(apply.applyDetails, function (detail) {
				applyInfo.applyDetails.push(getApplyDetailInfo(apply, detail));
			});
			return applyInfo;
		}

		/************************************ operation ************************************/

		// 更新售后协商信息
		$scope.updateAfterSaleNeg = function (apply) {
			var applyInfo = generateApplyInfo(apply);
			AfterSale.updateAfterSaleApply({applyId : apply.applyId}, applyInfo, function (data) {
				toaster.pop('success', '发送成功', '您已成功发送信息，请耐心等候！' + data.data);
                $scope.setActive(ApplyStatus.nextOrExStatus(apply.status));
				getData();
			},function (error) {
				toaster.pop('error', '发送信息失败', error.data);
			})
		}

		// 启动异常流程
        $scope.startOrExProcess = function (apply) {
            var applyInfo = generateApplyInfo(apply);
            AfterSale.startOrExProcess({applyId : apply.applyId}, applyInfo, function (data) {
                var resultInfo;
                resultInfo = '您已成功启动异常流程！';
                if(data.EXCHANGE) {
                	resultInfo = resultInfo + " 换货单号：" + data.EXCHANGE;
                }
                if(data.RETURN) {
                	resultInfo = resultInfo + " 退货单号：" + data.RETURN;
                }
                
                toaster.pop('success', '启动异常流程成功', resultInfo);
                $scope.setActive('FINISHED');
                getData();
            },function (error) {
                toaster.pop('error', '发送信息失败', error.data);
            })
        }

	}]);
});