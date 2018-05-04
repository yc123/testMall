define([ 'app/app' ], function(app) {
	app.register.controller('EnsureCheckMoneyCtrl', ['$scope', '$anchorScroll', '$location', '$http','$filter' , 'ngTableParams', 'BaseService', '$stateParams','$state' ,'Receipt','DateParse' , '$modal' , 'bankInfoService', 'bankTransferService' , 'toaster' ,function($scope , $anchorScroll, $location, $http, $filter ,ngTableParams, BaseService, $stateParams, $state , Receipt, DateParse, $modal,bankInfoService , bankTransferService , toaster) {
		$scope.dateZoneText = '不限';
		$scope.condition = {dateZone: -1};
		 if($stateParams.uu) {
			 //控制变量
			$scope.kind = true;
			$scope.startDateError = false;
			$scope.endDateError = false;
			var hideBankFilter = $filter("hideBankFilter");
			
			$scope.active = 'available';
			/*
			 * 待结算 （notsettled） 显示还有出入库单未结算的企业 ,
			 * 已结算 （settled）显示还有出入库单已结算的企业 ,
			 */
			var getState = function() {
				var state = 516;
				switch($scope.active) {
					case 'available' :
						state = 516; break;
					case 'unavailable' :
						state = 517; break;
					case 'availableToBeMakeBill':
						state = 518; break;
				}
				return state;
			};
			
			$scope.setActive = function(state) {
				if($scope.active != state) {
					$scope.active = state;
				}
				if($scope.receiptTableParams.page() == 1)
					$scope.receiptTableParams.reload();
				else
					$scope.receiptTableParams.page(1);
			};
			
			//控制单号换行
			$scope.getIndex = function($index) {
				if($index > 3) {
					var boo = $index + 1;
					if(boo%5 == 0) {
						return true;
					}
				}
				return false;
			}
			
			// 改变单据日期范围
			$scope.changeDateZone = function(zone) {
				$scope.condition.dateZone = zone;
				$scope.dateZoneText = typeof zone == 'undefined' ? '半年前' : (zone == -1 ? '不限' : (zone == 1 ? '一个月内' : '半年内'));
				$scope.condition.$dateZoneOpen = false;
				getDateCondition(zone, $scope.condition);
				$scope.receiptTableParams.reload();
			};
			
			// 打开日期选择框
			$scope.openDatePicker = function($event, item, openParam) {
				$event.preventDefault();
			    $event.stopPropagation();
			    item[openParam] = !item[openParam];
			};

			// 选择查找日期
			$scope.onDateCondition = function(){
				$scope.receiptTableParams.page(1);
				$scope.receiptTableParams.reload();
			};
			
			$scope.receiptTableParams = new ngTableParams({
				page : 1,
				count : 5,
				sorting : {
					createtime: 'DESC'
				}
			}, {
				total : 0,
				counts: [5, 10, 25, 50, 100],
				getData : function($defer, params) {
					var param = BaseService.parseParams(params.url());
					param.keyword = $scope.keyword;
					//日期筛选
					param.fromDate = $scope.condition.dateFrom ? $scope.condition.dateFrom.getTime() : null;
					param.toDate = $scope.condition.dateTo ? $scope.condition.dateTo.setDate($scope.condition.dateTo.getDate()+1) : null;// datepicker默认选中时间为当天0:00，所以选中截至时间+1天
					param.enuu = $stateParams.uu
					param.available = getState();
					param.status = 514;
					Receipt.getReceiptByuu(param, function(page) {
						if (page) {
							params.total(page.totalElements);
							$defer.resolve(page.content);
							clearData();
							//那就只修改这个备份的数据,原数据不做改变
							$scope.localRecepit = angular.copy(page.content);
							$scope.count = 0;//代表当前选中的行数  用在button
							var orderCount = page.content.length;
							while($scope.checkCodes.length <  orderCount) {
								$scope.checkCodes.push(false);
							}
							
						}
					});
				}
			});
			
			//重新勾选
			$scope.cancelCheck = function() {
				$scope.batchCheckStatus = false;
				delete $scope.noticeInfo;
			}
			
			//根据采购单号搜索采购单
			$scope.onSearch = function() {
				if($scope.startDate){
					if(DateParse.match($scope.startDate) == false){
						$scope.startDateError = true;
					} else {
						$scope.startDateError = false;
						$scope.condition.dateFrom = new Date($scope.startDate);
					}
				} else {
					$scope.startDateError = false;
				}
				//暂时没有截止日期
//				if($scope.endDate){
//					if(DateParse.match($scope.endDate) == false){
//						$scope.endDateError = true;
//					} else {
//						$scope.endDateError = false;
//						$scope.condition.dateTo = new Date($scope.endDate);
//					}
//				} else {
//					$scope.endDateError = false;
//				}
				if(!$scope.startDateError) {
					$scope.receiptTableParams.reload();
					$scope.receiptTableParams.page(1);
				}
			}
			
			//清数据
			var clearData = function (){ 
				delete $scope.startDateError;
				delete $scope.endDateError;
				delete $scope.noticeInfo;
				delete $scope.batchCheckStatus;
				$scope.checks = {
						checked : false
					};
				$scope.checkCodes = [];
			}
			
			/**
			 * 多选、单选操作
			 */
			$scope.checks = {
				checked : false
			};
			
			$scope.checkCodes = [];
			
			// 点击勾选Code全部的复选框
			$scope.checkAll = function(){
				if($scope.checks.checked) {
					$scope.count = $scope.localRecepit.length;
				}else {
					$scope.count = 0;
				}
				angular.forEach($scope.checkCodes, function(item, key) {
					$scope.checkCodes[key] = $scope.checks.checked;
				});
			};
			
			//点击Code单选
			$scope.checkOne = function(index) {
				var result = true;
				if($scope.checkCodes[index]) {
					$scope.count++;
				}else {
					$scope.count--;
				}
				angular.forEach($scope.checkCodes, function(item, key) {
					if(!item){
						result = false;
						return;
					}
				});
				$scope.checks.checked = result;
			};
			
			// 最大日期为当天
			$scope.maxDate = new Date();
			
			$scope.imageUrl = 'static/img/upload/cont.jpg';
			$scope.showImageDialog = function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image){
					if(!image.src || !image) {
						$scope.logoUrl = false;
						$scope.imageUrl = false;
					}else {
						$scope.logoUrl = image.src;
						$scope.imageUrl = image.thumb;
					}
				}, function() {
					$scope.logoUrl = false;
					$scope.imageUrl =false;
				});
			}
			//删除平台账户
			$scope.deleteAccount = function(buyAccount) {
				var resurt = confirm('是否删除此银行账户,删除后将不能恢复，谨慎操作!');
				if(resurt){
					bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
						toaster.pop('success', '删除成功');
						getBuyAccount();
						//TODO 这个需要用编码变身
						if($stateParams.uu == 10030994) {
							getVenderAccount();
						}
					}, function(response) {
						toaster.pop('error', '删除失败');
					})
				}
			}
			
			//新增账户
			$scope.newAccount = function(data) {
				var modalInstance = $modal.open({
					templateUrl : 'static/view/common/bankInfoAdmin.html',
					controller : 'BankInfoCtrl',
					resolve : {
						kind : function() {
							//深拷贝一份
							return angular.copy($scope.kind);
						},
						account : function() {
							//深拷贝一份
							return angular.copy(data);
						}
					}
				});
				
				modalInstance.result.then(function(account) {
					//企业账户
					bankInfoService.saveBuyEnterpriseBank({}, account, function(data) {
						toaster.pop('success', '保存成功','信息已添加');
						$scope.kind = account.kind;
						getBuyAccount();
						//TODO 这个需要用编码变身
						if($stateParams.uu == 10030994) {
							getVenderAccount();
						}
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}, function() {
					
				});
			};
			//选中账号
			$scope.select = function(account, isVender) {
				if(isVender) {
					$scope.venderAccount = account;
				}else {
					$scope.b2cAccount = account;
				}
			}
			
			/**
			 * 批量转出货
			 */
			//expose代表展开的状态，isBuyd代表当前操作的数据
			$scope.doExpose = function(expose, isVender) {
				if(isVender) {
					$scope.venderExpose = expose;
				}else {
					$scope.salexpose = expose;
				}
			}
			
			$scope.getBatch = function() {
				var batchRecepit = [];
				for (var i = 0; i < $scope.checkCodes.length; i++) {
					if($scope.checkCodes[i]) {
						batchRecepit.push($scope.localRecepit[i]);
					};
				}
				return batchRecepit;
			}
			
			$scope.batchCheckMoney = function(recepit) {
				$location.hash('batchCheckMoney');
				$anchorScroll();
				var idArray = [];
				if(recepit) {
					$scope.count = 1;
					$scope.batchRecepit = [];
					$scope.batchRecepit.push(recepit);
				}else {
					$scope.noticeInfo = true;
					$scope.batchRecepit = $scope.getBatch();
				}
				$scope.total = 0;
				angular.forEach($scope.batchRecepit, function(item) {
					//$scope.total += item.price;
					idArray.push(item.id);
				});

				// TODO huxz 获取ID
				console.log('PRINT ARRAY IDS OF RECEIPT');
				console.log(idArray.join('-'));
				Receipt.settleReceipt({ids:idArray.join('-')}, {}, function (data) {
					if (data.status == 'success') {
						$scope.total = data.total;
					}
				}, function (resp) {
					console.log('ERROR');
					console.log(resp);
				});
				$scope.batchCheckStatus = true;
				$scope.oneCheckStatus = false;
				
			}
			
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
			//排序
			var getOriginalData = function(data) {
				var result = null;
				if(data&&data.length) {
					result = data[0];
				}
				return result;
			};
			
			var getBuyAccount = function() {
				//平台应付账号
				bankInfoService.getAdminEnterAccount('', function(data) {
					$scope.b2cAccountInfos = resolveData(data);
					angular.forEach($scope.b2cAccountInfos, function(b2cAccountInfos) {
						b2cAccountInfos.filterAccount = hideBankFilter(b2cAccountInfos.number);
					});
					$scope.b2cAccount = getOriginalData($scope.b2cAccountInfos);
				}, function(res) {
					toaster.pop('error', '错误', '获取卖家信息失败');
				});
			}
			getBuyAccount();
			
			//供应商应收账户
			var getVenderAccount = function() {
				bankInfoService.getVenderBank({venduu:$stateParams.uu},null, function(data) {
					$scope.venderAccountInfos = resolveData(data);
					angular.forEach($scope.venderAccountInfos, function(venderAccountInfos) {
						venderAccountInfos.filterAccount = hideBankFilter(venderAccountInfos.number);
					});
					$scope.venderAccount = getOriginalData($scope.venderAccountInfos);
				}, function(res) {
					toaster.pop('error', '错误', '获取卖家信息失败');
				});
			}
			getVenderAccount();
			
			$scope.confirm = function(transferTime) {
				console.log(transferTime);
				$scope.transferTime = transferTime;
				if(angular.isUndefined($scope.venderAccount) || angular.equals("{}", angular.toJson($scope.venderAccount))) {
					toaster.pop('error', '错误', '请选择卖家账户');
					return ;
				}
				if(angular.isUndefined($scope.b2cAccount) || angular.equals("{}", angular.toJson($scope.b2cAccount))) {
					toaster.pop('error', '错误', '请选择平台账户');
					return ;
				}
				if(angular.isUndefined($scope.logoUrl) || angular.equals($scope.logoUrl, 'static/img/upload/cont.jpg')) {
					toaster.pop('error', '错误', '请上传付款截图');
					return ;
				}
				if(angular.isUndefined($scope.count) || $scope.count == 0) {
					toaster.pop('error', '错误', '没有选择要付款的出入库单');
					return ;
				}
				if(!$scope.transferTime) {
					toaster.pop('error', '错误', '请选择付款日期');
					return ;
				}
				delete $scope.b2cAccount.filterAccount;
				delete $scope.venderAccount.filterAccount;
				var jsonPament = angular.toJson($scope.b2cAccount);
				var jsonReceive = angular.toJson($scope.venderAccount);
				var transfer = {};
				transfer.jsonPament = jsonPament;
				transfer.jsonReceive = jsonReceive;
				transfer.imgUrl = $scope.logoUrl;
				transfer.transferTime = $scope.transferTime.getTime();
				transfer.total = 0;
				$scope.receiptids = "";
				angular.forEach($scope.batchRecepit, function(item) {
					transfer.total += item.price;
					$scope.receiptids += item.receiptid + "-";
				});
		
				bankTransferService.saveTransferFvender({receiptes: $scope.receiptids}, transfer, function(data) {
					toaster.pop("success", '成功', '保存成功!');
					$scope.receiptTableParams.reload();
					//删除多余的变量
					delete $scope.batchCheckStatus;
//					var modalInstance = $modal.open({
//						templateUrl : 'static/view/common/timeClose.html',
//						controller : 'timeCtrl'
//					});
//					
//					modalInstance.result.then(function(time) {
//						$state.go('histTransfer');
//					}, function() {
//						
//					});
				}, function(res) {
					toaster.pop("error", '失败', '信息保存失败');
				});
			}
			
		 }
		
	}]);
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		$scope.kind = kind;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
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
	
	app.register.controller('ImageInsertCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
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
		};
		
		$scope.confirm = function() {
			$modalInstance.close($scope.image);
			$scope.imageUrl = null;
		};
	}]);
	
	
});