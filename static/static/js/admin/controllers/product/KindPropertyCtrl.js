define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindPropertyCtrl', ['$scope', 'KindAPI', '$stateParams', function($scope, KindAPI, $stateParams) {
		
	}]);
	
	app.register.controller('KindProperty_1Ctrl', ['$scope', 'KindAPI', '$stateParams', '$state', 'toaster', function($scope, KindAPI, $stateParams, $state, toaster) {
		$scope.$parent.step = 1;
		
		$scope.kinds = $scope.$parent.kinds || [[],[],[],[]];// 存放各级分类，最多四级
		$scope.actives = $scope.$parent.actives || [];
		$scope.active = $scope.$parent.active || {};
		$scope.activeDeep = $scope.$parent.activeDeep || 0;
		
		/**
		  *  获取子类目
		  */
		var getChildren = function(pid, deep) {
			KindAPI.getChildren({parentId: pid}, function(data) {
				$scope.kinds[deep] = data;
			}, function(response) {
				toaster.pop('error', '获取子类目失败', response.data);
			});
		};
		
		/**
		 * 改变节点选中状态
		 */
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
			// 是否选到了子节点
			$scope.enableNext = item.isLeaf;
			// 当前可操作的层级
			if(deep < 3) {
				$scope.activeDeep = deep + 1;
			}
		};
		
		/**
		 * 选择节点
		 * @param item 节点
		 * @param deep 级别
		 */
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
		if(!$scope.$parent.kinds) {
			if($scope.$parent.actives) {
				angular.forEach($scope.$parent.actives, function(v, k) {
					KindAPI.getChildren({parentId: v.parentId}, function(data) {
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
		}
		
		$scope.next = function() {
			$scope.$parent.actives = $scope.actives;
			$scope.$parent.active = $scope.active;
			$scope.$parent.kinds = $scope.kinds;
			$scope.$parent.activeDeep = $scope.activeDeep;
			$state.go('kindProperty.step2', {kindId: $scope.active.id})
		};
	}]);
	
	app.register.controller('KindProperty_2Ctrl', ['$scope', 'toaster', '$modal', 'Kind', 'Property', '$location', '$stateParams', '$filter', 'KindAPI', function($scope, toaster, $modal, Kind, Property, $location, $stateParams, $filter, KindAPI) {
		
		$scope.$parent.step = 2;
		$scope.kind = {id: $stateParams.kindId};
		$scope.properties = [];
		$scope.allProperties = [];
		
		
		//获取全部属性
		var getAllProperties = function() {
			var propertiesList = [];
			var i = 0;
			Property.getProperties({},{}, function(data) {
				$scope.allProperties = data;
//				console.log(propertiesList);
//				angular.forEach(propertiesList, function(p){
//					$scope.allProperties[i] = p;
//					i++;
//					console.log(p);
//				});
//				console.log($scope.allProperties);
			}, function(response) {
				toaster.pop('error', '错误', '获取属性信息失败');
			});
		};
		
		getAllProperties();
		$scope.property = {};
		$scope.property.keyword = '';
		
		// 获取类目的属性信息
		var getProperties = function() {
			KindAPI.getKindProperties({
				kindId: $scope.kind.id
			}, function(data) {
				$scope.kind.properties = data;
			}, function(response) {
				toaster.pop('error', '错误', '获取类目的原有属性信息失败');
			});
		};
		
		$scope.$watch('property.keyword', function(newValue, oldValue, scope) {
			if(!$scope.property.keyword) {
				$scope.properties = {};
			}else {
				$scope.properties = $filter('filter')($scope.allProperties, $scope.property.keyword);
			}
		}, false);
		
		getProperties();
		
		// 展示属性详细值
		$scope.onValues = function(property) {
			if (property) {
				property.isValue = true;
			}
		}
		
		//  隐藏属性详细值
		$scope.offValues = function(property) {
			if (property) {
				property.isValue = false;
			}
		}
		
		// 维护属性详细值
		$scope.changeValue = function(property) {
	        var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/modal/kindPropertyValue_modal.html',  //指向上面创建的视图
	            controller : 'KindPropertyValueModalCtrl',// 初始化模态范围
	            size : 'lg', // 大小配置
            	resolve: {
					property: function() {
						return property;
					},
					allProperties: function() {
						return $scope.allProperties;
					}
				}
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(updatedProperty){
	        	Kind.updateKindProperty({}, updatedProperty, function(data) {
	        		toaster.pop('success', '提示', '修改 ' + updatedProperty.property.labelCn + ' 成功');
	        		getProperties();
	        	}, function(res) {
	        		toaster.pop('error', '提示', '保存失败，请重新修改');
	        	})
	        }, function(reason){
	        	
	        });
		}
		
		// 添加新属性
		$scope.addProperty = function() {
			openModal(null);
		}
		
		// 打开属性编辑模态框
		var openModal = function(id) {
			var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/modal/property_edit_modal.html',  //指向上面创建的视图
	            controller : 'PropertyEditModalCtrl',// 初始化模态范围
	            size : 'sm', // 大小配置
	            resolve: {
	            	id: function() {
						return id;
					}
				}
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        	
	        });  
	        modalInstance.result.then(function(updatedProperty){
	        	location.reload([true]);
	        }, function(res){
	        });
		}
		
		// 新增类目属性
		$scope.newProperty = function() {
			$scope.kind.properties.push({detno: 0});
		}
		
		// 组件接触到可放置的位置时
		$scope.onDropEnter = function(data, e) {
			return typeof data === 'object';
		};
		
		// 摆放组件
		$scope.onDropComplete2 = function(data, e, self) {
			if (data.detno) {// 已存在的组件，放在self之上
				var m = data.detno, n = self.detno;
				if (data.detno != self.detno) {
					Kind.changeDetno({activeId: data.id, passiveId : self.id}, {}, function(data) {
						getProperties();
					}, function(res) {
						toaster.pop('error', '提示', res.data);
					});
				}
			} else {// 新组件，放在self之上
				var newKindProperty = {
					kindId: $scope.kind.id, 
					propertyId: data.id, 
					property: {
						id: data.id,
						labelCn: data.labelCn
					},
					detno: self.detno
				};
				Kind.addKindProperty({}, newKindProperty, function(data) {
					toaster.pop('success', '提示', '添加 ' + newKindProperty.property.labelCn + ' 成功');
					getProperties();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		};
		
		/**
		 * 删除组件
		 */
		$scope.onDropDelete = function(property) {
			var isDelete = confirm('是否确认删除 ' + property.property.labelCn + ' ?');
			if (isDelete) {
				Kind.deleteKindProperty({kindPropertyId : property.id}, {}, function(data) {
					toaster.pop('success', '提示', '删除 ' + property.property.labelCn + ' 成功');
					getProperties();
				}, function(res) {
					toaster.pop('error', '提示', '删除失败，请重新操作');
				})
			}
		};
		
		/**
		 * 保存属性设置
		 */
//		$scope.save = function() {
//			var kindId = $scope.kind.id, data = [];
//			var requiredCount = 0;
//			angular.forEach($scope.kind.properties, function(p){
//				var _p = angular.copy(p);
//				_p.required = _p.required ? 1 : 0;
//				_p.detno = p.detno;
//				if(p.required) requiredCount++;// 统计本类目的主要属性的个数
//				data.push(_p);
//			});
//			var numPro = 0;
//			for (var i = 0; i < data.length; i++) {
//				for (var j = 0; j < data.length; j++) {
//					if (data[i].propertyId == data[j].propertyId) {//对比已选属性是否相同
//						numPro++;
//						if (numPro>1){
//							toaster.pop('error', '提醒', '请不要保存相同属性');
//							return;
//						} 
//					}
//				}
//				numPro = 0;
//			}
//			
//			Kind.updateProperties({
//				kindId: kindId
//			}, data, function(data){
//				toaster.pop('success', '提示', '保存成功！');
//				$scope.kind.properties = data;
//			}, function(response){
//				toaster.pop('error', '错误', '保存失败！' + response.data);
//			});
//		};
		
		// 预览页面
		$scope.preview = function() {
			$modal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'static/view/prod/product_kindProperty_preview.html',
				controller: 'KindPropertyPreviewCtrl',
				resolve: {
					kind: function() {
						return $scope.kind;
					}
				}
			}).result.then(function(){
				
			});
		};
		
	}]);
		
	// 预览页面的Controller
	app.register.controller('KindPropertyPreviewCtrl', ['$scope', '$modalInstance', 'kind', function($scope, $modalInstance, kind) {
		$scope.kind = kind;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);
	
	// 修改类目属性详细值页面的Controller
	app.register.controller('KindPropertyValueModalCtrl', ['$scope', '$modalInstance', 'property', 'allProperties', '$modal', function($scope, $modalInstance, property, allProperties, $modal) {
		// 深拷贝property
		$scope.property = angular.copy(property);
		$scope.allProperties = allProperties;
		var unitDetno = 0;
		var optionDetno = 0;
		angular.forEach($scope.property.multiUnits, function(unit) {
			if (unit.number > unitDetno) {
				unitDetno = unit.number;
			}
		});
		angular.forEach($scope.property.options, function(option) {
			if (option.number > optionDetno) {
				optionDetno = option.number;
			}
		});
		
		if ($scope.property.multiUnits.length > 0) {
			angular.forEach($scope.property.multiUnits, function(units) {
				units.isChange = false;
			});
		}
		if ($scope.property.options.length > 0) {
			angular.forEach($scope.property.options, function(option) {
				option.isChange = false;
			});
		}
		// 编辑属性
		$scope.updateProperty = function(property) {
			var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/modal/property_change_modal.html',  //指向上面创建的视图
	            controller : 'PropertyChangeModalCtrl',// 初始化模态范围
	            size : 'sm', // 大小配置
	            resolve: {
	            	property: function() {
						return property;
					},
					allProperties: function() {
						return $scope.allProperties;
					}
				}
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        	
	        });  
	        modalInstance.result.then(function(updatedProperty){
	        	location.reload([true]);
	        }, function(res){
	        });
		}
		
		// 修改现有单位值
		$scope.changeUnits = function(units) {
			units.isChange = true;
		}
		
		// 修改现有可能值
		$scope.changeOption = function(option) {
			option.isChange = true;
		}
		
		// 添加单位
		$scope.addUnit = function() {
			var unit = {kindProperId : $scope.property.id, number: unitDetno + 1, radix: '', unit: ''};
			$scope.property.multiUnits.push(unit);
		}
		
		// 判断对应数组下标
		var getIndex = function(item, arr) {
			for (var i = 0; i < arr.length ; i++) {
				if (arr[i] == item) {
					return i
				}
			}
		}
		
		// 删除单位
		$scope.deleteUnit = function(unit) {
			$scope.property.multiUnits.splice(getIndex(unit, $scope.property.multiUnits), 1);
		}
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
		// 添加可能值
		$scope.addOption = function() {
			var value = {kindPropertyId : $scope.property.id, number : optionDetno + 1, option : ''};
			$scope.property.options.push(value);
		}
		
		// 删除可能值
		$scope.deleteOption = function(value) {
			$scope.property.options.splice(getIndex(value, $scope.property.options), 1);
		}
		
		$scope.confirm = function() {
			$modalInstance.close($scope.property);
			$scope.property = null;
		};
	}]);
	
	// 修改类目属性详细值页面的Controller
	app.register.controller('PropertyEditModalCtrl', ['$scope', '$modalInstance', 'Property', 'id', 'toaster', function($scope, $modalInstance, Property, id, toaster) {
		if (id) {
			Property.get({id : id}, function(data) {
				$scope.property = data
			}, function(res) {
				toaster.pop('error', '提示', '获取属性信息失败，请刷新页面');
			});
		}
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		// 确认
		$scope.confirm = function() {
			// 更新属性
			if ($scope.property.id) {
				Property.update({}, $scope.property, function(data) {
					toaster.pop('success', '提示', '修改属性成功');
					$modalInstance.close();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			} else {
				Property.add({}, $scope.property, function(data) {
					toaster.pop('success', '提示', '添加属性成功');
					$modalInstance.close();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		};
	}]);
	
	// 更换类目属性页面的Controller
	app.register.controller('PropertyChangeModalCtrl', ['$scope', '$modalInstance', 'Property', 'Kind', 'property', 'allProperties', 'toaster', function($scope, $modalInstance, Property, Kind, property, allProperties, toaster) {
		$scope.allProperties = allProperties;
		if (property) {
			console.log(property);
			Property.get({id : property.propertyId}, function(data) {
				$scope.property = data
			}, function(res) {
				toaster.pop('error', '提示', '获取属性信息失败，请刷新页面');
			});
		}
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		// 确认
		$scope.confirm = function() {
			// 更换属性
			Kind.changeKindProperty({labelCn : $scope.property.labelCn, kindPropertyId : property.id}, {}, function(data) {
				toaster.pop('success', '提示', '更换属性成功');
				$modalInstance.close();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			});
		};
	}]);
});