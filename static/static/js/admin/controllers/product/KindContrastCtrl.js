define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindContrastCtrl', ['$scope', '$modal', 'BaseService', 'ngTableParams', 'KindContrast', 'CrawlTask', 'toaster', function($scope, $modal, BaseService, ngTableParams, KindContrast, CrawlTask, toaster) {
		BaseService.scrollBackToTop();
		$scope.active = 'outTask';
		$scope.searchMore = false;
		
		$scope.setActive = function(status) {
			if($scope.active != status) {
				$scope.active = status;
				$scope.kindContrastTableParams.reload();
			}
		};
		
		// 展示收起搜索栏
		$scope.showMore = function() {
			$scope.searchMore = !$scope.searchMore;
		};
		
		var getStatus = function() {
			switch($scope.active) {
				case 'all' : 
					status = 'all'; break;
				case 'outTask' :
					status = 'outTask'; break;
				case 'inTask' :
					status = 'inTask'; break;
				case 'running' :
					status = 'running';break;
				case 'concluded' :
					status = 'concluded';break;
				case 'failed' :
					status = 'failed';break;
					default : 
						status = 'outTask';
			}
			return  status;
		};
		
		$scope.kindContrastTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				updateDate: 'DESC'
			}
		}, {
			total : 0,
			counts : [10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.resource = $scope.resource;
				param.b2cBrand = $scope.b2cBrand;
				param.kiName = $scope.kiName;
				param.b2cKind = $scope.b2cKind;
				param.creater = $scope.creater;
				KindContrast[getStatus()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		$scope.onSearch = function () {
			$scope.kindContrastTableParams.reload();
		};
		
		// 新增属性对照关系
		$scope.addContrast = function() {
	        var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/modal/kindContrast_edit_modal.html',  //指向上面创建的视图
	            controller : 'KindContrastEditModalCtrl',// 初始化模态范围
	            size : 'lg', // 大小配置
	            backdrop : 'static'
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(){
	        	$scope.kindContrastTableParams.reload();
	        }, function(reason){
	        	
	        });
		}
		
		// 创建任务
		$scope.createTask = function(id) {
			CrawlTask.save({id : id}, {}, function(data) {
				toaster.pop('success', '提示', '生成任务成功');
				$scope.kindContrastTableParams.reload();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		};
		
		$scope.deleteContrast = function(id) {
			KindContrast.deleteOne({id : id}, {}, function(data) {
				toaster.pop('success', '提示', '删除成功');
				$scope.kindContrastTableParams.reload();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		}
	}]);
	
	// 修改属性对照关系的Controller
	app.register.controller('KindContrastEditModalCtrl', ['$scope', '$modalInstance', 'Search', '$modal', 'KindAPI', 'KindContrast', 'toaster', function($scope, $modalInstance, Search, $modal, KindAPI, KindContrast, toaster) {
		$scope.contrast = {};
		$scope.contrast.properties = [];
		// 打开品牌选择的模态框
		$scope.selectBrand = function(){  //打开模态 
	        var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/product_brandChoose_modal.html',  //指向上面创建的视图
	            controller : 'BrandModalInstanceCtrl'// 初始化模态范围
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(brand){
	        	$scope.contrast.b2cBrand = brand;
	        	$scope.contrast.b2cBrId = brand.id;
	            $scope.contrast.b2cBrName = brand.nameCn;
	        }, function(reason){
	        	
	        });
	    };
		
		// 获取品牌联想词
		$scope.getSimilarBrands = function(name) {
			if (name) {
				return Search.getSimilarBrands({keyword : name}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					});
				});
			}
		}
		
		// 点击联想词获取品牌信息
		$scope.onAssociateBrandClick = function(brand) {
            $scope.contrast.b2cBrand = brand;
            $scope.contrast.b2cBrId = brand.id;
            $scope.contrast.b2cBrName = brand.nameCn;
		}
		
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
			}).result.then(function(kind){
				$scope.contrast.properties = [];
				$scope.contrast.b2cKind = kind;
				$scope.contrast.b2cKiId = kind.id;
		        $scope.contrast.b2cKiName = kind.nameCn;
		        KindAPI.getPropertiesValues({kindId : $scope.contrast.b2cKind.id}, function(data) {
					$scope.kindProperties = data;
					angular.forEach($scope.kindProperties, function(kp) {
		        		 var newProperty = {
		        			names : [{name : ''}],
		        			units : kp.multiUnits,
		        			type : kp.type,
		        			propertyId : kp.propertyId,
		        			property : kp.property,
		        			detno : kp.detno
		        		 };
		        		 $scope.contrast.properties.push(newProperty);
		        	 })
				}, function(response) {
					
				});
			}, function(){
				
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
		}
		
		// 点击联想词获取类目信息
		$scope.onAssociateKindClick = function(kind) {
			$scope.contrast.properties = [];
			$scope.contrast.b2cKind = kind;
			$scope.contrast.b2cKiId = kind.id;
		    $scope.contrast.b2cKiName = kind.nameCn;
		    KindAPI.getPropertiesValues({kindId : $scope.contrast.b2cKind.id}, function(data) {
		    	$scope.kindProperties = data;
		    	angular.forEach($scope.kindProperties, function(kp) {
		    		var newProperty = {
			    		names : [{name : ''}],
			    		units : kp.multiUnits,
			    		type : kp.type,
			    		propertyId : kp.propertyId,
			    		property : kp.property,
			    		detno : kp.detno
		    		};
		    		$scope.contrast.properties.push(newProperty);
		    	});
		     }, function(response) {
				
		     });
		}
		
		// 选择类似类目
		$scope.chooseContrast = function() {
			if (!$scope.contrast.b2cKiId) {
				toaster.pop('error', '提示', '请先选择商城类目');
				return;
			}
			$modal.open({
				animation: true,
				size: 'lg',
				templateUrl : 'static/view/admin/modal/product_kindContrast_modal.html',  //指向上面创建的视图
		        controller : 'KindContrastChooseCtrl',// 初始化模态范围
				resolve: {
					actives: function() {
						return $scope.actives;
					}
				}
			}).result.then(function(contrast){
				angular.forEach($scope.contrast.properties, function(newPro) {
					angular.forEach(contrast.properties, function(oldPro) {
						if (newPro.propertyId == oldPro.propertyId) {
							if (oldPro.name) {
								var nameList = oldPro.name.split(",");
								if (nameList.length > 0) {
									newPro.names.splice(0,1);
									angular.forEach(nameList, function(data) {
										newPro.names.push({name : data});
									});
								}
							}
							newPro.remark = oldPro.remark;
							newPro.unit = oldPro.unit;
							return;
						}
					})
				});
			}, function(){
				
			});
		}
		
		// 添加目标参数名
		$scope.addName = function(kp) {
			kp.names.push({name: ''});
		}
		// 删除目标参数名
		$scope.deleteName = function(kp, index) {
			kp.names.splice(index, 1);
		}
		// 确认
		$scope.confirm = function() {
			if (!$scope.contrast.b2cKiId) {
				toaster.pop('error', '提示', '请重新选择类目');
				return;
			}
			if (!$scope.contrast.b2cBrId) {
				toaster.pop('error', '提示', '请重新选择品牌');
				return;
			}
			angular.forEach($scope.contrast.properties, function(pro) {
				var nameList = [];
				angular.forEach(pro.names, function(names) {
					nameList.push(names.name);
				});
				pro.name = nameList.join(',');
			});
			KindContrast.save({}, $scope.contrast, function(data) {
				$modalInstance.close();
			}, function (res) {
				toaster.pop('error', '提示', '提交失败，请重试');
			})
		}
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
	
	//品牌选择模态框的controller
	app.register.controller('BrandModalInstanceCtrl', ['$scope', '$modalInstance', 'NgTableParams', 'BrandActiveAPI', function($scope, $modalInstance, NgTableParams, BrandActiveAPI) {
		$scope.filter = {};
		BrandActiveAPI.getSimpleInfo({}, {}, function(data){
			$scope.brands = data;
			$scope.brandsTableParams = new NgTableParams({
				sorting: {nameCn: 'asc'}
			}, {dataset: $scope.brands});
		}, function(){
			
		});
		
		// 搜索
		$scope.search = function() {
			$scope.brandsTableParams.filter({$: $scope.filter.keyword});
		};
		// 选择
		$scope.select = function(brand){
			$modalInstance.close(brand);
		};
		// 关闭
		$scope.cancel = function() {
			$modalInstance.dismiss();
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
			$modalInstance.close($scope.active);
		};
		
	}]);
	
	// 属性对照关系的Controller
	app.register.controller('KindContrastChooseCtrl', ['$scope', '$modalInstance', 'BaseService', 'ngTableParams', 'KindContrast', '$modal', function($scope, $modalInstance, BaseService, ngTableParams, KindContrast, $modal) {
		
		// 参数对照关系列表
		$scope.kindContrastTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				resource: 'ASC',
				b2cBrId: 'ASC',
				kindName: 'ASC',
				b2cKiId: 'ASC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.b2cKind = $scope.keyword;
				KindContrast.all(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		// 搜索
		$scope.onSearch = function () {
			$scope.kindContrastTableParams.reload();
		};
		
		// 查看参数对应关系详情
		$scope.preview = function(id) {
			 var modalInstance = $modal.open({
		            templateUrl : 'static/view/admin/modal/product_kindContrast_detail_modal.html',  //指向上面创建的视图
		            controller : 'KindContrastDetailCtrl',// 初始化模态范围
		            size : 'md', // 大小配置
		            resolve :  {
		            	 id: function() {
		            		return id;
		            	 } 
		            }
		        });
		        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
		        });  
		        modalInstance.result.then(function(contrast){
		        }, function(reason){
		        });
		}
		
		// 确认选择参数对应关系
		$scope.chooseContrast = function(contrast) {
			$modalInstance.close(contrast);
		}
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
	
	// 属性对照关系详情的Controller
	app.register.controller('KindContrastDetailCtrl', ['$scope', '$modalInstance', 'id', 'KindContrast', function($scope, $modalInstance, id, KindContrast) {

		KindContrast.getOne({id : id}, {}, function(data) {
			$scope.kindContrast = data;
		}, function(res) {
			toaster.pop('error', '提示', res.data);
		})
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
});	