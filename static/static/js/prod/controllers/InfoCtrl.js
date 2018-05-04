define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('InfoCtrl', ['$scope', '$modal', '$window', '$location', '$http', '$templateCache', '$stateParams', 'productKinds', 'toaster', 'ComponentSubmit', 'ComponentActive', 'ImgUrl', 'dynamicInput', 'KindAPI', function($scope, $modal, $window, $location, $http, $templateCache, $stateParams, productKinds, toaster, ComponentSubmit, ComponentActive, ImgUrl, dynamicInput, KindAPI) {
		
		$scope.con = function(){
			$scope.properties = angular.fromJson($scope.tempstr);
		};
		
		$scope.clean = function(){
			$scope.tempstr = angular.toJson($scope.properties);
			$scope.properties = [];
		};
		
		$scope.readOnly = function(){
			var size = $scope.properties.length;
			
			for(var i = 0; i < size; i++){
				$scope.properties[i].readonly = true;
			}
		};
		
		$scope.console = function(){
			console.log($scope.properties);
		};
		
		$scope.component = {};
		$scope.extras = [];
		
		/**
		 * 获取类目属性
		 */
		var getProperties = function(kinds) {
			KindAPI.getProperties({kindId: kinds.last().id}, {}, function(data){
				$scope.properties = data;
			}, function(data){
				toaster.pop('error', '错误', '获取类目属性信息失败');
			});
			
			/*$http.get('product/kinds/' + kinds.last().id + '/properties', {
				cache: $templateCache
			}).success(function(properties){
				$scope.properties = properties;
			});*/
		};
		
		//根据参数判断是修改还是新增
		if($stateParams.uuid) {
			ComponentActive.getComponentActive({uuid : $stateParams.uuid}, {}, function(data){
				//检查对应uuid是否有数据，没有就直接跳转到新增url
				if(data.version == -1){
					toaster.pop('info', '提醒', '您将新增一个标准器件信息');
					$location.path("category");
				}
				$scope.component = data;
				
				//获取类目树信息
				KindAPI.getParents({childId: data.pr_kindid}, {}, function(data){
					$scope.productKinds = data;
				}, function(data){
					toaster.pop('error', '错误', '获取类目树信息失败');
				});
				
				//手动加载图片显示和品牌名称
				$scope.imageUrl = ImgUrl.handelByWidthHeigth( data.img, 100, 100 );
				$scope.brand = data.brandActive;
				//手动加载额外属性
				$scope.extras = angular.fromJson(data.scopeExtras);
				$scope.properties = angular.fromJson(data.scopeProperties);
				
			}, function(data){
				toaster.pop('warning', '错误', '获取标准器件信息失败');
			})
		} else {
			$scope.imageUrl = 'static/img/upload/cont.jpg';
			
			if (!productKinds) {
				/**
				 * TODO 在重构中，换用kindid，先请求类目信息，并判断自己如果为叶子节点，才继续，不然跳转
				 */
				
				// 不是通过路由过来的，再检查地址栏的参数kindIds
				if($location.search().kindIds && /^(\d{1,}_)*(\d){1,}$/.test($location.search().kindIds)) {
					$http.get('produce/kinds/' + $location.search().kindIds.replace(/_/g, ','), {
						cache: $templateCache
					}).success(function(kinds){
						if(kinds.length > 0 && kinds.last().isLeaf) {
							$scope.component.pr_kindid = kinds.last().id;
							$scope.productKinds = kinds;
							$scope.kindIds = $location.search().kindIds;
							getProperties(kinds);
						}
					});
				} else {
					$scope.goback();
				}
			} else {
				$scope.component.pr_kindid = productKinds.last().id;
				// 利用浏览器地址栏参数kindIds记住当前的选择
				var path = [];
				angular.forEach(productKinds, function(k){
					path.push(k.id);
				});
				$scope.kindIds = path.join('_');
				$location.search({kindIds: $scope.kindIds});
				
				getProperties(productKinds);
			}
			
		}
		
		//打开品牌选择的模态框
		$scope.open = function(size){  //打开模态 
	        var modalInstance = $modal.open({
	            templateUrl : 'offer/brand/insert.html',  //指向上面创建的视图
	            controller : 'BrandModalInstanceCtrl',// 初始化模态范围
	            size : size //大小配置
	        });
	        modalInstance.opened.then(function(){//模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(brand){
	            $scope.brand = brand;
	            $scope.component.pr_brandid = brand.id;
	        }, function(reason){
	        	
	        });
	    };
		
	    //提交标准器件信息
	    $scope.submitComponent = function(){
	    	var propertiesList = angular.toJson(dynamicInput.resolveDynamicInput($scope.properties));
	    	var component =  angular.toJson($scope.component);
	    	var scopeProperties =  angular.toJson($scope.properties);
	    	var scopeExtras =  angular.toJson($scope.extras);
	    	//因为这里一次传递多个对象，为了后台转换的方便，这里要转换为JSON字符串，而不是直接传对象
	    	ComponentSubmit.submit({}, {propertiesList: propertiesList, component: component, scopeProperties: scopeProperties, scopeExtras: scopeExtras }, function(data){
				alert("提交成功" + data);
				//$location.path("brandEdit/");
			},function(data){
				toaster.pop('warning', '提交失败', '标准器件信息提交失败');
			});
	    	
	    };
	    
		// 重新选择类目
		$scope.goback = function() {
			$location.path('category');
		};
		
		
		
		
		// 额外属性 添加
		$scope.addExtra = function() {
			if($scope.extras.length >= 5)
				toaster.pop('warning', '警告', '最多能添加5个额外属性！');
			else
				$scope.extras.push({label: null, value: null});
		};
		// 额外属性 删除
		$scope.removeExtra = function(index) {
			$scope.extras.splice(index, 1);
		};
		// 选择图片（包括商品展示图片和描述内容里面的图片）
		$scope.showImageDialog = function(model) {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image){
					$scope.component.img = image.src;
					$scope.imageUrl = image.thumb;
				});
			});
		};
	}]);
	
	app.register.controller('ImageInsertCtrl',['$scope', '$modalInstance', 'ImgUrl', function($scope, $modalInstance, ImgUrl) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = ImgUrl.handelByWidthHeigth( path, 100, 100 );
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
	/**
	 * 页面内滚动到指定id的dom
	 */
	app.register.service('anchorSmoothScroll', function() {
		this.scrollTo = function(eID) {
			var startY = currentYPosition();
			var stopY = elmYPosition(eID);
			var distance = stopY > startY ? stopY - startY : startY - stopY;
			if (distance < 100) {
				scrollTo(0, stopY);
				return;
			}
			var speed = Math.round(distance / 100);
			if (speed >= 20)
				speed = 20;
			var step = Math.round(distance / 25);
			var leapY = stopY > startY ? startY + step : startY - step;
			var timer = 0;
			if (stopY > startY) {
				for (var i = startY; i < stopY; i += step) {
					setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
					leapY += step;
					if (leapY > stopY)
						leapY = stopY;
					timer++;
				}
				return;
			}
			for (var i = startY; i > stopY; i -= step) {
				setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
				leapY -= step;
				if (leapY < stopY)
					leapY = stopY;
				timer++;
			}

			function currentYPosition() {
				// Firefox, Chrome, Opera, Safari
				if (self.pageYOffset)
					return self.pageYOffset;
				// Internet Explorer 6 - standards mode
				if (document.documentElement && document.documentElement.scrollTop)
					return document.documentElement.scrollTop;
				// Internet Explorer 6, 7 and 8
				if (document.body.scrollTop)
					return document.body.scrollTop;
				return 0;
			}

			function elmYPosition(eID) {
				var elm = document.getElementById(eID);
				var y = elm.offsetTop;
				var node = elm;
				while (node.offsetParent && node.offsetParent != document.body) {
					node = node.offsetParent;
					y += node.offsetTop;
				}
				return y;
			}

		};
	});
	app.register.controller('HelperCtrl', ['$scope', 'anchorSmoothScroll', function($scope, anchorSmoothScroll) {
		$scope.isLastOpen = true;
		// 页内导航
		$scope.scrollTo = function(div) {
//			$location.hash('product_info_' + div);
			anchorSmoothScroll.scrollTo('product_info_' + div);
		};
	}]);
	
	/**
	 * Array split
	 */
	app.register.filter('split', function(){
		return function(str, charr) {
			if(str)
				return str.split(charr);
			return [];
		};
	});
	
	//品牌选择模态框的controller
	app.register.controller('BrandModalInstanceCtrl', ['$scope', '$modalInstance', 'NgTableParams', 'BrandsActive', function($scope, $modalInstance, NgTableParams, BrandsActive) {
		$scope.filter = {};
		BrandsActive.getAllBrandActiveInfo({}, {}, function(data){
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