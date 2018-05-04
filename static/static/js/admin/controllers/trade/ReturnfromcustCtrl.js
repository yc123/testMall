define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('ReturnfromcustCtrl', ['$scope', '$anchorScroll', '$location', '$modal' ,'BaseService' ,'Return','ngTableParams' , 'SessionService' ,'toaster', '$stateParams', '$filter' ,'bankInfoService' ,'bankTransferService', function($scope, $anchorScroll, $location ,$modal , BaseService , Return ,ngTableParams, SessionService ,toaster, $stateParams, $filter , bankInfoService , bankTransferService) {
		//这里是需要立马处理的单据，如果积压超过1000张都是不正常的，所以后台是一次加载所有的分类，直接前端搜索
		var enIdFilter = $filter('EncryptionFilter');
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('adminReturnfmcState')? SessionService.get('adminReturnfmcState'):'inspecting';
		var hideBankFilter = $filter("hideBankFilter");
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'tobeshipback' :
					state = '409'; break;
				case 'inspecting' :
					state = '410'; break;
				case 'inspected' :
					state = '411'; break;
				case 'toberefunded' :
					state = '507'; break;
				case 'refunded' :
					state = '508'; break;
			}
			return state;
		};
		
		$scope.returnfmcustTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.status = getState();
				param.keyword = $scope.keyword;
				Return.getIndividualCust(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		//根据出货单号搜索出货单
		$scope.onSearch = function() {
			$scope.returnfmcustTableParams.reload();
		};
		
		// 查看客户退货单明细(加密订单号)
		$scope.toDetail = function(returnid) {
			$location.url("/trade/returnfromcust/"+ enIdFilter(returnid))
		};
		
		$scope.setActive = function(state) {
			delete $scope.batchCheckStatus;
			SessionService.set('adminReturnfmcState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.returnfmcustTableParams.page() == 1)
				$scope.returnfmcustTableParams.reload();
			else
				$scope.returnfmcustTableParams.page(1);
		};
		/**
		 * 审核客户退货单
		 */
		$scope.auditReturn = function(custreturn, boo) {
			Return.auditReturn({result:boo},{id: custreturn.id},function(data) {
				$scope.returnfmcustTableParams.reload();
				toaster.pop('success', '处理成功', '平台审核成功');
			},function(response) {
				toaster.pop('error', '审核失败' + response.text);
			})
		};
		/**
		 * 平台确认收货
		 */
		$scope.ensureAccept = function(custreturn) {
			Return.ensureAccept({returnid:custreturn.id},null,function(data) {
				$scope.returnfmcustTableParams.reload();
				toaster.pop('success', '处理成功', '平台收货成功');
			},function() {
				toaster.pop('error', '收货失败');
			})
		};
		
		/**
		 * 单个订单确认退款开始
		 */
		$scope.onesEnsure = function(custReturn) {
			window.location.href = 'admin_n#/check/refund';
			// TODO huxz 待整理
			// 更新退货单的状态，并退转到退款流程
			/*Return.ensurePaid({returnid : custReturn.id}, null, function (data) {
				if (data) {
					window.location.href = 'admin_n#/check/refund';
				}
			}, function () {
				toaster.pop('error', '收货失败');
			});*/
		};
		
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
			result = data&&data.length ? data[0] : null;
			return result;
		};
		//B2C付款方
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
		};

		//买家收款方
		var getCustAccout = function () {
			bankTransferService.getBankTransferByOrderid ({orderid : $scope.batchRecepit[0].orid},function(data) {
				$scope.custAccount = data;
				$scope.custAccount.filterAccount = hideBankFilter($scope.custAccount.number);
			},function (){
				toaster.pop('error', '错误', '获取客户账户失败');
			})
		};
		
		
		//expose代表展开的状态
		$scope.doExpose = function(expose, isCust) {
			if(isCust) {
				$scope.custExpose = expose;
			}else {
				$scope.salexpose = expose;
			}
		};
		
		//选中账号
		$scope.select = function(account, isCust) {
			if(isCust) {
				$scope.custAccount = account;
			}else {
				$scope.b2cAccount = account;
			}
		};
		
		//Delete 
		$scope.deleteAccount = function(buyAccount) {
			var isSure = confirm('是否删除本银行账户，删除后无法恢复，请谨慎操作！');
			if(isSure) {
				bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
					toaster.pop('success', '删除成功');
					getBuyAccount();
				}, function(response) {
					toaster.pop('error', '删除失败');
				})
			}
		};
		
		//新增账户
		$scope.newAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoAdmin.html',
				controller : 'BankInfoCtrl',
				resolve : {
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
				}, function(res) {
					toaster.pop('error', '错误', res.data);
				});
			}, function() {
				
			});
		};
		
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
		};
		
		//最终确认
		$scope.confirm = function() {
			if(angular.isUndefined($scope.custAccount) || angular.equals("{}", angular.toJson($scope.custAccount))) {
				toaster.pop('error', '错误', '请选择买家账户');
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
			if(angular.isUndefined($scope.batchRecepit) || $scope.batchRecepit.length == 0) {
				toaster.pop('error', '错误', '没有选择要退款的退货单');
				return ;
			}
			$scope.transferTime = new Date();
			if(!$scope.transferTime) {
				toaster.pop('error', '错误', '请选择付款日期');
				return ;
			}
			delete $scope.b2cAccount.filterAccount;
			delete $scope.custAccount.filterAccount;
			var jsonPament = angular.toJson($scope.b2cAccount);
			var jsonReceive = angular.toJson($scope.custAccount);
			var transfer = {};
			transfer.jsonPament = jsonPament;
			transfer.jsonReceive = jsonReceive;
			transfer.imgUrl = $scope.logoUrl;
			transfer.transferTime = $scope.transferTime;
			transfer.total = 0;
			$scope.returnids = "";
			angular.forEach($scope.batchRecepit, function(item) {
				transfer.total += item.price;
				$scope.returnids += item.id + "-";
			});
	
			bankTransferService.saveTransferFreturn({returnJson: $scope.returnids}, transfer, function(data) {
				toaster.pop("success", '成功', '保存成功!');
				//删除多余的变量
				$scope.setActive("refunded");
				$scope.returnfmb2cTableParams.reload();
//				var modalInstance = $modal.open({
//					templateUrl : 'static/view/common/timeClose.html',
//					controller : 'timeCtrl'
//				});
//				modalInstance.result.then(function(time) {
//					$state.go('histTransfer');
//				}, function() {
//					
//				});
			}, function(res) {
				toaster.pop("error", '失败', '信息保存失败');
			});
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
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', function($scope, $modalInstance, account){
		$scope.account = account;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}
		
		$scope.confirm = function() {
			$scope.account.kind = true;
			$modalInstance.close($scope.account);
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);
	
});