define(['app/app'], function(app) {
	app.register.controller('ComponentBatchCreateCtrl', ['$scope', '$upload', 'toaster', '$modal', 'ComponentSubmit', 'BaseService', 'Search', 'KindAPI', function($scope, $upload, toaster, $modal, ComponentSubmit, BaseService, Search, KindAPI) {
		BaseService.scrollBackToTop();
		
		$scope.submits = [{gradeOneKiName : '', gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : '', isFirst : true, isSecond : true, isThird : true}];
		
		// 展开、收拢第一步或第二步
		$scope.closeBox = function(b) {
			$scope[b] = ! $scope[b];
		};
		
		// 添加分类
		$scope.addSubmit = function() {
			$scope.submits.push({gradeOneKiName : '', gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : ''});
		};
		
		// 删除分类
		$scope.deleteSubmit = function(index) {
			if ($scope.submits[index + 1]) {
				if ($scope.submits[index].isFirst && ($scope.submits[index + 1].gradeOneKiName == $scope.submits[index].gradeOneKiName)) {
					$scope.submits[index + 1].isFirst = true;
				}
				if ($scope.submits[index].isSecond && ($scope.submits[index + 1].gradeTwoKiName == $scope.submits[index].gradeTwoKiName)) {
					$scope.submits[index + 1].isSecond = true;
				}
				if ($scope.submits[index].isThird && ($scope.submits[index + 1].gradeThreeKiName == $scope.submits[index].gradeThreeKiName)) {
					$scope.submits[index + 1].isThird = true;
				}
			}
			$scope.submits.splice(index, 1);
		};
		
		// 获取类目联想词
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
		$scope.onAssociateKindClick = function(kind, submit) {
			KindAPI.getParents({childId : kind.id}, {}, function(data) {
				$scope.actives = data;
				console.log(data);
				var size = data.length;
				if (size > 0) {
					submit.gradeOneKiName = $scope.actives[0].nameCn;
					submit.kiName = submit.gradeOneKiName;
					if (size > 1) {
						submit.gradeTwoKiName = $scope.actives[1].nameCn;
						submit.kiName = submit.gradeTwoKiName;
						if (kind.level < 3) {
							submit.gradeThreeKiName = null;
						} else if (size > 2) {
							submit.gradeThreeKiName = $scope.actives[2].nameCn;
							submit.kiName = submit.gradeThreeKiName;
						}
					}
				}
				console.log(submit);
			})
		}
		
		// 选择类目
		$scope.selectKind = function(submit) {
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
				$scope.actives = data.actives;
				var size = data.actives.length;
				submit.gradeOneKiName = '';
				submit.gradeTwoKiName = '';
				submit.gradeThreeKiName = '';
				if (size > 0) {
					submit.gradeOneKiName = $scope.actives[0].nameCn;
					if (size > 1) {
						submit.gradeTwoKiName = $scope.actives[1].nameCn;
						if (size > 2) {
							submit.gradeThreeKiName = $scope.actives[2].nameCn;
						}
					}
				}
			}, function(){
				
			});
		};
		
		// 选中单行以供添加使用
		$scope.chooseSubmit = function(submit, index, level) {
			angular.forEach($scope.submits, function(s) {
				if(s.isChoosed) {
					s.index = null;
					s.isChoosed = false;
					s.level = 0;
				}
			})
			submit.isChoosed = true;
			submit.index = index;
			submit.level = level;
		};
		
		// 添加新的一级类目项
		$scope.addSubmitWithKindOne = function() {
			$scope.submits.push({gradeOneKiName : '', gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : '', isFirst : true, isSecond : true, isThird : true});
		};
		
		// 添加同一一级类目项
		$scope.addSubmitWithKindTwo = function() {
			var added = true;
			angular.forEach($scope.submits, function(submit) {
				if (submit.isChoosed) {
					if (submit.level > 0) {
						var exist = false;
						for (var i = submit.index + 1; i < $scope.submits.length; i++) {
							if ($scope.submits[i].isFirst) {
								$scope.submits.splice(i, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : '', isSecond : true, isThird : true});
								exist = true;
								added = false;
								return;
							}
						}
						if (!exist) {
							$scope.submits.splice($scope.submits.length, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : '', isSecond : true, isThird : true});
						}
					} else {
						$scope.submits.splice(submit.index + 1, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : '', isSecond : true, isThird : true});
					}
					added = false;
					submit.index = null;
					submit.isChoosed = false;
				}
			})
			if (added) {
				$scope.submits.push({gradeOneKiName : $scope.submits[$scope.submits.length - 1].gradeOneKiName, gradeTwoKiName : '', gradeThreeKiName : '', brName : '', url : '', isSecond : true, isThird : true});
			}	
		};
		
		// 添加同一二级类目项
		$scope.addSubmitWithKindThree = function() {
			var added = true;
			angular.forEach($scope.submits, function(submit) {
				if (submit.isChoosed) {
					if (submit.level > 0) {
						var exist = false;
						for (var i = submit.index + 1; i < $scope.submits.length; i++) {
							if ($scope.submits[i].isSecond) {
								$scope.submits.splice(i, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : $scope.submits[submit.index].gradeTwoKiName, gradeThreeKiName : '', brName : '', url : '', isThird : true});
								exist = true;
								added = false;
								return;
							}
						}
						if (!exist) {
							$scope.submits.splice($scope.submits.length, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : $scope.submits[submit.index].gradeTwoKiName, gradeThreeKiName : '', brName : '', url : '', isThird : true});
						}
					} else {
						$scope.submits.splice(submit.index + 1, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : $scope.submits[submit.index].gradeTwoKiName, gradeThreeKiName : '', brName : '', url : '', isThird : true});
					}
					added = false;
					submit.index = null;
					submit.isChoosed = false;
				}
			})
			if (added) {
				$scope.submits.push({gradeOneKiName : $scope.submits[$scope.submits.length - 1].gradeOneKiName, gradeTwoKiName : $scope.submits[$scope.submits.length - 1].gradeTwoKiName, gradeThreeKiName : '', brName : '', url : '', isThird : true});
			}
		}
		
		// 添加同一三级级类目项
		$scope.addSubmitWithBrand = function() {
			var added = true;
			angular.forEach($scope.submits, function(submit) {
				if (submit.isChoosed) {
					if (submit.level > 0) {
						var exist = false;
						for (var i = submit.index + 1; i < $scope.submits.length; i++) {
							if ($scope.submits[i].isThird) {
								$scope.submits.splice(i, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : $scope.submits[submit.index].gradeTwoKiName, gradeThreeKiName : $scope.submits[submit.index].gradeThreeKiName, brName : '', url : ''});
								exist = true;
								added = false;
								return;
							}
						}
						if (!exist) {
							$scope.submits.splice($scope.submits.length, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : $scope.submits[submit.index].gradeTwoKiName, gradeThreeKiName : $scope.submits[submit.index].gradeThreeKiName, brName : '', url : ''});
						}
					} else {
						$scope.submits.splice(submit.index + 1, 0, {gradeOneKiName : $scope.submits[submit.index].gradeOneKiName, gradeTwoKiName : $scope.submits[submit.index].gradeTwoKiName, gradeThreeKiName : $scope.submits[submit.index].gradeThreeKiName, brName : '', url : ''});
					}
					added = false;
					submit.index = null;
					submit.isChoosed = false;
				}
			})
			if (added) {
				$scope.submits.push({gradeOneKiName : $scope.submits[$scope.submits.length - 1].gradeOneKiName, gradeTwoKiName : $scope.submits[$scope.submits.length - 1].gradeTwoKiName, gradeThreeKiName : $scope.submits[$scope.submits.length - 1].gradeThreeKiName, brName : '', url : ''});
			}
		}
		
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
		$scope.onAssociateBrandClick = function(brand, submit) {
			submit.brName = brand.nameCn;
		}
		
		// 选择品牌
		$scope.selectBrand = function(submit) {
			var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/product_brandChoose_modal.html',  //指向上面创建的视图
	            controller : 'BrandModalInstanceCtrl',// 初始化模态范围
	            size : 'lg' // 大小配置
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(brand){
	        	submit.brName = brand.nameCn;
	        }, function(reason){
	        	
	        });
		};
		
		function downloadByJs(url, data) { 
            var form = $("<form>");   //定义一个form表单
            form.attr('style', 'display:none');   //在form表单中添加查询参数
            form.attr('target', '');
            form.attr('method', 'post');
            form.attr('action', url);

            var input1 = $('<input>');
            input1.attr('type', 'hidden');
            input1.attr('name', 'data');
            input1.attr('value', angular.toJson(data));
            $('body').append(form);  //将表单放置在web中 
            form.append(input1);   //将查询参数控件提交到表单上
            form.submit();
         }
		
		// 查看范例
		$scope.showImg = function() {
			var src = "static/img/product/excel_component_batch.png", box = $('#image-box');
			box.show();
			box.find('img').attr('src', src);
			box.find('a').click(function(){
				box.hide();
			});
			box.dblclick(function(){
				box.hide();
			});
		}
		
		// 下载模板
		$scope.download = function() {
			for(var i = 0; i < $scope.submits.length; i++) {
				if (!$scope.submits[i].gradeOneKiName) {
					toaster.pop('error', '提示', '第' + (i+1) + '列，一级类目为空，请重新填写该列信息');
					return;
				} 
				if ($scope.submits[i].gradeThreeKiName && !$scope.submits[i].gradeTwoKiName) {
					toaster.pop('error', '提示', '第' + (i+1) + '列，二级类目为空，请重新填写该列信息');
					return;
				}
			}
			downloadByJs('produce/componentSubmit/template', $scope.submits);
		};
		
		// 上传Excel批量发布（大量）
		$scope.upload = function() {
			var file = $scope.myFiles[0];
			$upload.upload({
				url: 'produce/componentSubmit/upload/excel',
				file: file,
				method: 'POST'
			}).success(function(data) {
				toaster.pop('success', '提示', '提交成功');
				window.location.href = 'vendor#/home/componentBatchMaintenance';
			}).error(function(response) {
				toaster.pop('error', '提示', response);
			});
		};
		
		// 直接提交
		$scope.submitSubmits = function() {
			for(var i = 0; i < $scope.submits.length; i++) {
				if (!$scope.submits[i].gradeOneKiName) {
					toaster.pop('error', '提示', '第' + (i+1) + '列，一级类目为空，请重新填写该列信息');
					return;
				} 
				if ($scope.submits[i].gradeThreeKiName && !$scope.submits[i].gradeTwoKiName) {
					toaster.pop('error', '提示', '第' + (i+1) + '列，二级类目为空，请重新填写该列信息');
					return;
				}
			}
			ComponentSubmit.saveSubmits({}, $scope.submits, function(data) {
				toaster.pop('success', '提示', '提交成功');
				window.location.href = 'vendor#/home/componentBatchMaintenance';
			}, function(response) {
				toaster.pop('error', '提示', response.data);
			});
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
			var a = {
				active: $scope.active,
				actives: $scope.actives
			};
			$modalInstance.close(a);
		};
	}]);
	
	//品牌选择模态框的controller
	app.register.controller('BrandModalInstanceCtrl', ['$scope', '$modalInstance', 'NgTableParams', 'BrandActiveAPI', function($scope, $modalInstance, NgTableParams, BrandActiveAPI) {
		$scope.filter = {};
		BrandActiveAPI.getSimpleInfo({}, {}, function(data){
			$scope.brands = data;
			$scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
		}, function(){
			
		})
		// 搜索
		$scope.search = function() {
			$scope.brandsTableParams.filter({$: $scope.filter.keyword});
		};
		$scope.select = function(brand){
			$scope.ok(brand);
		};
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.ok = function(brand) {
			$modalInstance.close(brand);
		};
	}]);
});