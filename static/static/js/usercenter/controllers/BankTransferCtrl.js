define([ 'app/app' ], function(app) {
	
	app.register.controller('BankTransferCtrl', ['$scope', '$anchorScroll', '$location','SessionService', 'bankInfoService','$modal', 'toaster', 'bankTransferService', '$filter', 'ngTableParams', 'BaseService', 'OrderSimpleInfo', '$state', '$stateParams', 'Order', 'SmoothScroll', function($scope, $anchorScroll, $location,SessionService, bankInfoService, $modal, toaster, bankTransferService, $filter, ngTableParams, BaseService, OrderSimpleInfo, $state, $stateParams, Order, SmoothScroll) {
		BaseService.scrollBackToTop();
		
		$scope.purKind = false;//应付账户的类别, 默认是企业
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
		$scope.orderNum = ""; //单号的链接字符串
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
		}
		
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
		
		//根据单选框的状态，提取不同的数据
		var getBuyAccount = function() {
			if(!$scope.purKind) {
				bankInfoService.getBuyEnterpriseBank('', function(data) {
					$scope.buyAccountInfos = resolveData(data);
					angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
						buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
					});
					$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
				}, function(error) {
					toaster.pop('error', '错误', '提取企业账户信息失败');
				});
			}else {
				bankInfoService.getBuyPersonalBank('', function(data) {
					$scope.buyAccountInfos = resolveData(data);
					angular.forEach($scope.buyAccountInfos, function(buyAccountInfo) {
						buyAccountInfo.filterAccount = hideBankFilter(buyAccountInfo.number);
					});
					$scope.buyAccount = getOriginalData($scope.buyAccountInfos);
				}, function(error) {
					toaster.pop('error', '错误', '提取个人账户信息失败');
				});
			}
		};
		
		//开始时，就获取账户信息
		getBuyAccount();
		
		//获取管理平台账户信息
		var getSellerAccount = function() {
			if(!$scope.saleKind) {
				bankInfoService.getAdminEnterAccount('', function(data) {
					$scope.saleAccountInfos = resolveData(data);
					angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
						saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
					});
					$scope.saleAccount = getOriginalData($scope.saleAccountInfos);
				}, function(res) {
					toaster.pop('error', '错误', '获取卖家企业账户信息失败');
				});
			}else {
				bankInfoService.getAdminPersAccount('', function(data) {
					$scope.saleAccountInfos = resolveData(data);
					angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
						saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
					});
					$scope.saleAccount = getOriginalData($scope.saleAccountInfos);
				}, function(res) {
					toaster.pop('error', '错误', '获取卖家个人账户信息失败');
				});
			}
		}
		
		getSellerAccount();

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
				param.status = '503'
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
		
		$scope.confirm = function() {
			if(angular.isUndefined($scope.orderNum) || angular.equals($scope.orderNum,'') || angular.equals($scope.total, 0)) {
				toaster.pop('info', '提示', '没有选择要付款的订单,或付款总额为0');
				return ;
			}
			if(angular.isUndefined($scope.buyAccount)||angular.equals("{}", angular.toJson($scope.buyAccount))) {
				toaster.pop('info', '提示', '请选择买家账户');
				return ;
			}
			if(angular.isUndefined($scope.saleAccount)||angular.equals("{}", angular.toJson($scope.saleAccount))) {
				toaster.pop('info', '提示', '请选择卖家账户');
				return ;
			}
			if(!$scope.transferTime) {
				toaster.pop('info', '提示', '请选择付款日期');
				return ;
			}
			var buyAccount = angular.copy($scope.buyAccount);
			var saleAccount = angular.copy($scope.saleAccount);
			delete saleAccount.filterAccount;
			delete buyAccount.filterAccount;
			var jsonPament = angular.toJson(buyAccount);
			var jsonReceive = angular.toJson(saleAccount);
			var transfer = {};
			transfer.jsonPament = jsonPament;
			transfer.jsonReceive = jsonReceive;
			transfer.imgUrl = $scope.logoUrl;
			transfer.transferTime = $scope.transferTime.getTime();
			transfer.total = $scope.total;
			bankTransferService.saveTransfer({order: $scope.orderNum.split('，').join('-')}, transfer, function(data) {
				$scope.tobePaidTableParams.page(1);
				$scope.tobePaidTableParams.reload();
				var modalInstance = $modal.open({
					templateUrl : 'static/view/common/timeClose.html',
					controller : 'timeCtrl'
				});
				
				modalInstance.result.then(function(time) {
					$state.go('myOrder_todo');
				}, function() {
					
				});
			}, function(response) {
				toaster.pop("error", '失败', '信息保存失败:' + response.data);
			});
		}
		
		$scope.imageUrl = 'static/img/upload/cont.jpg';
		
		$scope.buyExpose = false;
		$scope.salexpose = false;
		//expose代表展开的状态，isBuyd代表当前操作的数据
		$scope.doExpose = function(expose, isBuy) {
			if(isBuy) {
				$scope.buyExpose = expose;
			}else {
				$scope.salexpose = expose;
			}
		}
		
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