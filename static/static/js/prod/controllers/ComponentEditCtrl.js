define([ 'app/app', 'jquery-summernote', 'jquery-uploadify' ], function(app) {
	'use strict';
	app.register.controller('ComponentEditCtrl', ['$scope', '$modal', '$window', '$location', '$http', '$templateCache', '$stateParams', 'toaster', 'ComponentSubmit', 'ComponentActive', 'ImgUrl', 'dynamicInput', '$filter', function($scope, $modal, $window, $location, $http, $templateCache, $stateParams, toaster, ComponentSubmit, ComponentActive, ImgUrl, dynamicInput, $filter) {
		
		document.title = "标准器件维护" + "-优软商城";
		
		
		app.register.controller('ComponentEdit_detailCtrl', ['$scope', '$modal', '$stateParams', 'ComponentActiveAPI', 'KindAPI', '$filter', 'Search', 'SessionService', function($scope, $modal, $stateParams, ComponentActiveAPI, KindAPI, $filter, Search, SessionService){
			$scope.component = {properties:[]};
			$scope.brand = {};
			$scope.isMessage = true;
			$scope.isProperty = false;
			$scope.isPropertyValue = false;
			$scope.$parent.step = 1;
			$scope.active = $scope.$parent.active || {};
			$scope.component.code = angular.fromJson(SessionService.get('cmpCode'));//批量发布传递器件申请信息
			// 维护器件时，获取器件信息
			if ($stateParams.uuid) {
				ComponentActiveAPI.get({uuid: $stateParams.uuid}, {}, function(data){
					$scope.oldComponent = data;
					$scope.component = angular.copy($scope.oldComponent);
					$scope.activesString = angular.copy($scope.oldComponent.kind.nameCn);// 直接赋值器件所属类目
					$scope.oldComponent.activesString = $scope.oldComponent.kind.nameCn;
					// getPackaging($scope.component.kindid);
					KindAPI.getPropertiesValues({kindId: $scope.component.kindid}, function(data) {
						$scope.kindProperties = data;
						angular.forEach($scope.kindProperties, function(i) {	
							angular.forEach($scope.component.properties, function(j){
								if(i.propertyId == j.propertyid) {
									i.isChange = false ;
									i.value = j.value;
								}
								
							});
								
						});
					}, function(response) {
						toaster.pop('error', '错误', '请刷新页面，获取属性失败');
					});
					
					// 判断器件是否有图片，将图片选择框打开方法置为空
					if ($scope.oldComponent.img) {
						$scope.showImageDialog = null;
					}
				}, function() {
					toaster.pop('error', '错误', '获取器件信息失败');
				});
			}
			
			// 获取器件联想词
			$scope.getSimilarCmps = function(code) {
				if (code) {
					return Search.getSimilarComponents({keyword : code}).$promise.then(function(data) {
						return data.map(function(item) {
							return item;
						})
					});
				}
			}
			
			// 点击联想词获取器件信息
			$scope.onAssociateCmpClick = function(cmp) {
				ComponentActiveAPI.get({uuid : cmp.uuid}, {}, function(data) {
					$scope.component = data;
					$scope.activesString = $scope.component.kind.nameCn;
					// getPackaging($scope.component.kindid);
					KindAPI.getPropertiesValues({kindId: $scope.component.kindid}, function(data) {
						$scope.kindProperties = data;
						angular.forEach($scope.kindProperties, function(kp) {
							angular.forEach($scope.component.properties, function(pro) {
								if (pro.value && (kp.propertyId == pro.propertyid)) {
									kp.value = pro.value;
								}
							});
						});
					}, function(response) {
						
					});
				}, function(res) {
					toaster.pop('error', '提示', '器件信息加载失败，请刷新页面');
				})
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
			$scope.onAssociateBrandClick = function(brand) {
				$scope.component.brand = brand;
	            $scope.component.brandid = brand.id;
			}
			
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
				$scope.component.kind = kind;
				$scope.component.kindid = kind.id;
				$scope.activesString = $scope.component.kind.nameCn;
				// getPackaging($scope.component.kindid);
				KindAPI.getPropertiesValues({kindId: $scope.component.kindid}, function(data) {
					$scope.kindProperties = data;
					angular.forEach($scope.kindProperties, function(kp) {
						angular.forEach($scope.component.properties, function(pro) {
							if (pro.value && (kp.propertyId == pro.propertyid)) {
								kp.value = pro.value;
							}
						});
					});
				}, function(response) {
					
				});
			}
			
			// 根据类目id获取封装规格信息
			// var getPackaging = function(kindid) {
			// 	ComponentActive.getPackagingByKindid({kindid: kindid}, {}, function(data) {
			// 		$scope.packagings = data;
			// 	}, function(response) {
			//
			// 	})
			// }
			
			// 修改按钮
			$scope.change = function(kp) {
				kp.isChange = true;
			}
			
			// 还原
			$scope.returns = function(kp) {
				kp.isChange = false;
			}
			
			// 打开品牌选择的模态框
			$scope.selectBrand = function(){  //打开模态 
		        var modalInstance = $modal.open({
		            templateUrl : 'static/view/prod/product_brandChoose_modal.html',  //指向上面创建的视图
		            controller : 'BrandModalInstanceCtrl'// 初始化模态范围
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
					KindAPI.getPropertiesValues({kindId: $scope.component.kindid}, function(data) {
						$scope.kindProperties = data;
					}, function(response) {
						
					});
				}, function(){
					
				});
			};
			
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
			
			// 获取联想词
			$scope.getAssociates = function(keyword) {
				return ['1A' + keyword, '2B' + keyword];
			};
			$scope.associates = ['1A', '2B', '3C'];
			
			// 返回修改信息
			$scope.returnMessage = function(){
				$scope.isMessage = true;
				$scope.isPropertyValue = false;
				$scope.$parent.step = 1;
			}
			
			// 获取用户输入的属性值
			var getProperValues = function() {
				var propertyValues = [];
				for(var i = 0; i < $scope.kindProperties.length; i ++) {
					var kp = $scope.kindProperties[i];
					if(kp.type == 'N') {
						kp.selectedUnit = kp.selectedUnit || kp.multiUnits[0];
						var numbric = kp.value * (kp.selectedUnit.radix || 1);
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.value ?  (kp.value + kp.selectedUnit.unit) : '',
							detno: propertyValues.length + 1,
							numbric: numbric,
							unit: kp.unit
						});
					} else if(kp.type == 'F') {
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
					} else if(kp.type == 'S') {
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.value,
							detno: propertyValues.length + 1
						});
					} else{
						propertyValues.push({
							propertyId: kp.propertyId,
							stringValue: kp.value ? kp.value : '',
							detno: propertyValues.length + 1
						});
					}
				}
				return propertyValues;
			};
			
			// 提交器件
			$scope.save = function(){
				$scope.component.properties = getProperValues();// 属性

				if ($scope.component.description == null) {
					toaster.pop('error', '提交失败', '详细描述不可为空');
					return;
				}
				// 提交保存
				ComponentSubmit.save({}, $scope.component, function(data){
					toaster.pop('success', '提示', '提交成功，请等待审核');
					window.location.replace('vendor#/home/componentMaintenance');
				},function(response){
					toaster.pop('error', '提交失败', response.data);
				});
			};
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
		
	}]);
});