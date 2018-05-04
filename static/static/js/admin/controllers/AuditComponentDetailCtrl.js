define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('AuditComponentDetailCtrl', ['$scope', 'ngTableParams', '$modal', '$sanitize', 'ComponentSubmit', 'ComponentActive', 'BaseService', '$stateParams','toaster', '$location', 'Kind', 'propertiesSubmit', 'ArrayUtil', 'KindAPI', function($scope, ngTableParams, $modal, $sanitize, ComponentSubmit, ComponentActive, BaseService, $stateParams, toaster, $location, Kind, propertiesSubmit, ArrayUtil, KindAPI) {
		
		$scope.kind = {};
		$scope.isPropertyValue = false;
		//根据路由地址获取标准器件提交信息
		ComponentSubmit.get({id : $stateParams.id}, {}, function(data){
			$scope.component = data;
			$scope.activesString = $scope.component.kind.nameCn;// 直接赋值器件所属类目
			KindAPI.getPropertiesValues({kindId: $scope.component.kindid}, function(data) {
				$scope.kindProperties = data;
				angular.forEach($scope.kindProperties, function(i) {	
					angular.forEach($scope.component.properties, function(j){
						if(i.propertyId == j.propertyid) {
//							i.isChange = false ;
							i.stringValue = j.stringValue;
						}
					});
				});
			}, function(response) {
				toaster.pop('error', '错误', '请刷新页面，获取属性失败');
			});
		}, function(data){
			toaster.pop('error', '审批详情数据加载失败', data);
		});

		// 选择图片（包括商品展示图片和描述内容里面的图片）
		$scope.showImageDialog = function(model) {
			$modal.open({
				templateUrl : 'offer/image/insert.html',
				controller : 'ImageInsertCtrl',
				backdrop : 'static'
			}).result.then(function(image){
				$scope.component.img = image.src;
			});
		};

		// 图片上传成功之后
		$scope.onAttachUploadSuccess = function(data){
			$scope.$apply(function() {
				$scope.component.attachFile = data;
				$scope.component.attach = data.path;
				if($scope.component.attachFile.size >= 1024 * 1024) {
					$scope.component.attachFile.size = $filter('number')($scope.component.attachFile.size / 1024 / 1024, 1) + 'Mb';
				} else if($scope.component.attachFile.size >= 1024) {
					$scope.component.attachFile.size = $filter('number')($scope.component.attachFile.size / 1024, 1) + 'Kb';
				} else {
					$scope.component.attachFile.size = $scope.component.attachFile.size + 'b';
				}
				$scope.$uploading = false;
			});
		};

		// 重新上传，取消重新上传
		$scope.reUpload = function() {
			$scope.$uploading = !$scope.$uploading;
		};

		// 删除已上传的文件
		$scope.removeAttach = function() {
			delete $scope.component.attachFile;
			delete $scope.component.attach;
			$scope.$uploading = true;
		};
		
		// 打开品牌选择的模态框
		$scope.selectBrand = function(size){  //打开模态 
	        var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/product_brandChoose_modal.html',  //指向上面创建的视图
	            controller : 'BrandModalInstanceCtrl',// 初始化模态范围
	            size : size // 大小配置
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(brand){
	            $scope.component.brand = brand;
	            $scope.component.brandid = brand.id;
	        }, function(reason){
	        	
	        });
	    };
		
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
			}).result.then(function(data){
				$scope.active = data.active;
				$scope.actives = data.actives;
				var activesString = "";
				var size = data.actives.length;
				for(var i = 0; i < size; i++){
					if(i == 0){
						activesString = data.actives[i].nameCn;
					}
					else{
						activesString = activesString + " > " + data.actives[i].nameCn;	
					}
				}
				$scope.activesString = activesString;
				$scope.component.kindid = data.active.id;
			}, function(){
				
			});
		};
		
		// 选择单位
		$scope.selectUnit = function(p, u) {
			p['selectedUnit'] = u;
		};
		
		// 选择区间更小值的单位
		$scope.selectMinUnit = function(p, u) {
			p['minUnit'] = u;
		};
		
		// 选择区间更大值的单位
		$scope.selectMaxUnit = function(p, u) {
			p['maxUnit'] = u;
		};
		
		// 修改属性值
		$scope.changeProperty = function(property) {
			property.isChange = true;
		};
		
		// 还原属性值
		$scope.returnProperty = function(property) {
			propertiesSubmit.getPropertySubmit({componentSubmitId : $scope.component.id, propertyId : property.propertyId}, {}, function(data) {
				property.cmpsubmitId = data.cmpsubmitId;
				property.stringValue = data.stringValue;
				property.max = data.max ? data.max : null;
				property.min = data.min ? data.min : null;
				property.value = data.value ? data.value : null;
				property.isChange = false;
			}, function(res) {
				toaster.pop('error', '提示', '还原属性值失败，请重试');
			})
		}
		
		// 获取用户输入的属性值
		var getProperValues = function() {
			var propertyValues = [];
			for(var i = 0; i < $scope.kindProperties.length; i ++) {
				var kp = $scope.kindProperties[i];
				if(kp.type == 'N') {
					if (kp.isChange) {
						kp.selectedUnit = kp.selectedUnit || kp.multiUnits[0];
						var numbric = kp.value * (kp.selectedUnit.radix || 1);
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.value ?  (kp.value + kp.selectedUnit.unit) : '',
							detno: propertyValues.length + 1,
							numbric: numbric,
							unit: kp.unit
						});
					} else {
						propertyValues.push(kp);
					}
				} else if(kp.type == 'F') {
					if (kp.isChange) {
						kp.minUnit = kp.minUnit || kp.multiUnits[0];
						kp.maxUnit = kp.maxUnit || kp.multiUnits[0];
						var min = kp.min * (kp.minUnit.radix || 1);
						var max = kp.max ? kp.max * (kp.maxUnit.radix || 1) : min;
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.min ? (kp.min + kp.minUnit.unit + (kp.max ? '~' + kp.max + kp.maxUnit.unit : '')) : '',
							detno: propertyValues.length + 1,
							unit: kp.unit,
							min: min,
							max: max
						});
					} else {
						propertyValues.push(kp);
					}
				} else if(kp.type == 'S') {
					if (kp.isChange) {
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.value,
							detno: propertyValues.length + 1
						});
					} else {
						propertyValues.push(kp);
					}
				} else{
					if (kp.isChange) {
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.value ? kp.value : '',
							detno: propertyValues.length + 1
						});
					} else {
						propertyValues.push(kp);
					}
				}
			}
			return propertyValues;
		};
		
		// 审核通过
		$scope.ComponentSubmitvalid = function(){
			$scope.component.properties = getProperValues();// 属性
			$scope.component.auditOpinion = $scope.component.auditOpinion ? $scope.component.auditOpinion : '审核通过';
			console.log($scope.component.properties);
			ComponentSubmit.valid({}, $scope.component, function(data){
				toaster.pop('success', '处理成功', '【' + $scope.component.code + '】' + '通过审批');
				$location.path('/audit/component');
			}, function(res){
				toaster.pop('error', '提交失败', res.data);
			});
		};
		
		// 审核不通过
		$scope.ComponentSubmitinvalid = function(id, auditOpinion){
			if(!auditOpinion) {
				toaster.pop('error', '请填写审核意见', '审核不通过时审核意见不能为空');
			} else {
				ComponentSubmit.invalid({id : id}, {auditOpinion: auditOpinion}, function(data){
					toaster.pop('success', '处理成功', '【' + $scope.component.code + '】' + '未通过审批');
					$location.path('/audit/component');
				}, function(res) {
					toaster.pop('error', '提交失败', res.data);
				});
			}
		};
		
	}]);
	
	//品牌选择模态框的controller
	app.register.controller('BrandModalInstanceCtrl', ['$scope', '$modalInstance', 'NgTableParams', 'BrandActiveAPI', function($scope, $modalInstance, NgTableParams, BrandActiveAPI) {
		BrandActiveAPI.getSimpleInfo({}, {}, function(data){
			$scope.brands = data;
			$scope.brandsTableParams = new NgTableParams({}, { dataset: $scope.brands});
		}, function(){
			
		})
		
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

	// 图片选择
	app.register.controller('ImageInsertCtrl',['$scope', '$modalInstance', 'ImgUrl', function($scope, $modalInstance, ImgUrl) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = ImgUrl.handelByWidthHeigth( path, 100, 100 );
			$scope.image.src = data.path;
			$scope.image.thumb = path;
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