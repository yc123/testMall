define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('ReleaseProductByBatchCtrl', ['$scope', 'ngTableParams', 'ComponentActiveAPI', 'BaseService', 'toaster', 'Goods', '$upload', '$rootScope', '$http', 'ReleaseProductByBatch', '$modal', '$window', 'SessionService', 'Loading', function($scope, ngTableParams, ComponentActiveAPI, BaseService, toaster, Goods, $upload, $rootScope, $http, ReleaseProductByBatch, $modal, $window, SessionService, Loading) {
		BaseService.scrollBackToTop();
		
		//获取当前登录用户的的基本信息
		$scope.userInfo = $rootScope.userInfo;
		
		$scope.pageParams = {};
		$scope.topagenum = null;
		
		
		$scope.relTableParams = new ngTableParams({
			count : 10,
			page : 1
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.batch = $scope.result.batch;
				ReleaseProductByBatch.getPageBatchRelease(param, function(page) {
/*							$defer.resolve(page.content);
					params.total(page.totalElements);*/
					$scope.pageParams.number = page.number;
					$scope.pageParams.content = page.content;
					$scope.pageParams.totalElements = page.totalElements;
					$scope.pageParams.totalPages = page.totalPages;
					
				}, function(data) {
					toaster.pop();
				});
			}
		});
		
		// 展开、收拢第一步或第二步
		$scope.closeBox = function(b) {
			$scope[b] = ! $scope[b];
		};
		
		// 下载模板
		$scope.download = function() {
			var show = SessionService.get($scope.userInfo.userUU + "-releasetip");
			if(!show) {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl : 'static/view/vendor/modal/releaseProductByBatchTip.html',
					controller : 'releaseProductByBatchTipCtrl',
				});
				
				modalInstance.result.then(function(response) {
				}, function(res) {
					window.location.href = 'trade/goods/release/template';
				});
			}else {
				window.location.href = 'trade/goods/release/template';
			}
		};
		
		//下载未匹配成功的数据
		$scope.downloadExcel = function(){
			if($scope.result.batch&&$scope.result.failure) {
				window.location.href = "release/product/release/failure/xls?batch=" + $scope.result.batch;
			}else {
				if(!$scope.result.batch) {
					toaster.pop('info', '提示', '您没有上传信息');
				}else if(!$scope.result.failure) {
					toaster.pop('info', '提示', '您上传的信息为空');
				}
			}
			
		}
		// 查看范例
		$scope.showImg = function() {
			var src = "static/img/product/excel_releaseByBatch_eg.png", box = $('#image-box');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		}
		
		// 上传Excel批量发布（大量）
		$scope.upload = function() {
			var file = $scope.myFiles[0];
			$upload.upload({
				url: 'release/product/release/excel',
				file: file,
				method: 'POST'
			}).success(function(data) {
				$scope.proInfo = data.info;
				$scope.result = data;
				toaster.pop('info', '提示', '验证通过' + ($scope.result.success || 0) + '条，验证失败' + ($scope.result.failure || 0) +  '条，过滤' + ($scope.result.filter || 0) + '条');
				$scope.relTableParams.page(1);
				$scope.relTableParams.reload();
			}).error(function(response) {
				$scope.result = {};
				$scope.pageParams.number = 0;
				$scope.pageParams.content = null;
				$scope.pageParams.totalElements = 0;
				$scope.pageParams.totalPages = 0;
				toaster.pop('error', response.data || response);
			});
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
		}
		
		//通过id删除
		$scope.deleteById = function(cmp, index) {
			ReleaseProductByBatch.deleteProInfo({id: cmp.id}, {}, function(data) {
				toaster.pop("success","提示","删除成功");
				$scope.proInfo.splice(index, 1);
			}, function(res) {
				toaster.pop("error","提示","删除失败");
			});
		}
		
		//查询
		$scope.getAllInfo = function () {
			var userUU = $scope.userInfo.userUU;
			ReleaseProductByBatch.findAll({}, userUU,function(data) {
				$scope.proInfo = data;
			}, function(res) {
				toaster.pop("error", "提示", "暂未查询到相关信息");
			});
		}
		
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
		}
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
		}
		
		//批量发布
		$scope.publish = function() {
			if ($scope.result.success > 0) {
				ReleaseProductByBatch.batchRelease({batch : $scope.result.batch}, null, function(data) {
					console.log(data);
					toaster.pop("success", "提示", "发布成功 ：" + data.data + "条");
					$scope.relTableParams.page(1);
					$scope.relTableParams.reload();
				}, function(res) {
					toaster.pop("error", "发布失败", res.data);
				});
			} else {
				toaster.pop("info", "提示", "验证通过的数量为零，没有信息发布");
			}
			
		}
		
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
		}
		$scope.deletePrice = function(index) {
			$scope.pricesList.splice(index, 1);
		}
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
		}
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
	
	app.register.controller('releaseProductByBatchTipCtrl', ['$scope', '$modalInstance', 'SessionService', function($scope, $modalInstance, SessionService) {
		$scope.IKnow = function() {
			$modalInstance.dismiss();
		}
		
		$scope.donShowAgain = function() {
			var show = SessionService.setCookie($scope.userInfo.userUU + "-releasetip", 1);
			$modalInstance.dismiss();
		}
		
	}])
	
});