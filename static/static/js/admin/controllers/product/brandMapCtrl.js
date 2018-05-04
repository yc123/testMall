define(['app/app'], function(app) {
	'use strict';
	app.register.controller('BrandMapCtrl', ['$scope', 'ngTableParams', 'BaseService', 'BrandMap', 'toaster', 'BrandActive', 'StoreInfo', 'Loading', function($scope, ngTableParams, BaseService, BrandMap, toaster, BrandActive, StoreInfo, Loading) {
		$scope.$$map = {};
		$scope.keyword = '';
		$scope.storeType = 'ALL';
		$scope.typeCn = '全部';
		$scope.brandMap = {};

		$scope.startDate = null;
		$scope.endDate = null;

		$scope.onSearch = function () {
			reloadData();
		};

		$scope.showType = function () {
			$scope.typeFrame = !$scope.typeFrame;
		};

		var reloadData = function () {
			$scope.brandMapTableParams.page(1);
			$scope.brandMapTableParams.reload();
		};

		$scope.exportExcel = function () {
			if ($scope.$$map.totalElements == 0) {
				toaster.pop('info', '当前品牌映射列表为空，无法下载');
				return ;
			}
			exportByAjax();
		};

		var exportByAjax = function () {
			var url = 'produce/brandMap/export';
			var strArray = [];
			if ($scope.keyword && $scope.keyword.length > 0){
				var wordStr = "keyword=" + $scope.keyword;
				strArray.push(wordStr);
			}
			if ($scope.storeType && $scope.storeType != 'ALL'){
				var typeStr = "storeType=" + $scope.storeType;
				strArray.push(typeStr);
			}
			if ($scope.startDate){
				var fromDate = "fromDate=" + $scope.startDate.getTime();
				strArray.push(fromDate);
			}
			if ($scope.endDate){
				var toDate = "toDate=" + $scope.endDate.getTime();
				strArray.push(toDate);
			}
			if (strArray.length != 0){
				var str = strArray.join("&");
				url = url + "?" + str;
			}
			var form = $("<form>");   //定义一个form表单
			form.attr('style', 'display:none');   //在form表单中添加查询参数
			form.attr('target', '');
			form.attr('method', 'POST');
			form.attr('action', url);
			console.log(url);
			$('body').append(form);  //将表单放置在web中
			form.submit();

			$scope.$$map.clockID = setInterval(function() {
				getDownLoadStatus();
			}, 500);
		};

		var getDownLoadStatus = function () {
			Loading.show();
			$.ajax({
				url : 'produce/brandMap/export',
				data : {isAjax : true},
				method : 'POST',
				dataType : 'json',
				success : function (data) {
					if(!data.loading){
						$scope.$apply(function () {
							toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
							Loading.hide();
						});
						if($scope.$$map.clockID) {
							clearInterval($scope.$$map.clockID);
						}
					}
				},
				error : function () {
					Loading.hide();
					if($scope.$$map.clockID) {
						clearInterval($scope.$$map.clockID);
					}
				}
			});
		};

		$scope.condition = {
			startDateOpen: false,
			endDateOpen: false
		};

		// 打开日期选择框
		$scope.openDatePicker = function($event, item, openParam) {
			if (!$scope.endDate){ //如果为空，则需要加入23:59:59的毫秒数
				$scope.isAdd = false;
			}
			$event.preventDefault();
			$event.stopPropagation();
			item[openParam] = !item[openParam];
		};

		var constMs = 86399000; // 23:59:59的毫秒数

		$scope.onDateCondition = function () {
			if ($scope.endDate && !$scope.isAdd){
				var ms = $scope.endDate.getTime() + constMs;
				$scope.endDate = new Date(ms);
				$scope.isAdd = !$scope.isAdd;
			}
			reloadData();
		};

		$scope.convertType = {
			'ALL' : '全部',
			'AGENCY' : '代理商',
			'DISTRIBUTION' : '经销商',
			'ORIGINAL_FACTORY' : '原厂商',
			'CONSIGNMENT' : '寄售商'
		};

		$scope.changeDateZone = function (item) {
			$scope.typeFrame = false;
			if ($scope.storeType != item){
				$scope.storeType = item;
				$scope.typeCn = $scope.convertType[item];
				reloadData();
			}
		};

		$scope.addOneMap = function () {
			$scope.addFrame = !$scope.addFrame;
			$scope.showStore = false;
			$scope.showBrand = false;
		};

		$scope.cancelAdd = function () {
			$scope.brandMap = {};
			$scope.typeInStore = 'ALL';
			if ($scope.storeInfo){
				$scope.storeInfo = null;
			}
			if ($scope.brandInfo){
				$scope.brandInfo = null;
			}
			if ($scope.ensureBrand){
				$scope.ensureBrand = null;
			}
			$scope.wordInStore = '';
			$scope.wordInBrand = '';
			$scope.initialInBrand = '';
			$scope.addFrame = false;
		};

		$scope.ensureAdd = function () {
			if (!$scope.brandMap.enName){
				toaster.pop("info", "请选择店铺信息");
				return ;
			}
			if (!$scope.brandMap.nameChildEn){
				toaster.pop("info", "请完善要对应的品牌英文名");
				return ;
			}
			if (!$scope.brandMap.nameStandardEn || !$scope.brandMap.nameStandardCn){
				toaster.pop("info", "请选择对应标准库的品牌");
				return ;
			}
			BrandMap.addOneBrandMap({}, $scope.brandMap, function (data) {
				if (data){
					$scope.brandMap = {};
					$scope.addFrame = false;
					reloadData();
				}
			}, function (error) {
				toaster.pop("error", error.data);
			})
		};

		$scope.brandMapTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				operateTime : 'DESC'
			}
		},{
			total : 0,
			getData : function ($defer, params) {
				var param = BaseService.parseParams(params.url());
				if ($scope.keyword && $scope.keyword.length > 0){
					param.keyword = $scope.keyword;
				}
				if ($scope.storeType && $scope.storeType != 'ALL'){
					param.storeType = $scope.storeType;
				}
				if ($scope.startDate){
					param.fromDate = $scope.startDate.getTime();
				}
				if ($scope.endDate){
					param.toDate = $scope.endDate.getTime();
				}
				BrandMap.getPageOfBrandMap(param, function (page){
					$scope.$$map.totalElements = page.totalElements;
					params.total(page.totalElements);
					$defer.resolve(page.content);
				},function () {
					toaster.pop('error', '获取品牌映射关系失败');
				} )
			}
		});

		$scope.showBrandFrame = function () {
			$scope.showBrand = !$scope.showBrand;
		};

		$scope.changeTextInBrand = function (item) {
			$scope.wordInBrand = item;
		};

		$scope.fitBrandObj = function (item) {
			$scope.brandInfo = item;
		};

		$scope.cancelFitBrand = function () {
			if ($scope.ensureBrand){
				$scope.brandInfo = $scope.ensureBrand;
			}else{
				$scope.brandInfo = null;
			}
			$scope.wordInBrand = '';
			$scope.showBrand = false;
		};

		$scope.fitBrandInMap = function () {
			if (!$scope.brandInfo){
				toaster.pop("info", "请选择对应标准库的品牌");
				return ;
			}
			$scope.ensureBrand = $scope.brandInfo;
			$scope.brandMap.brandid = $scope.ensureBrand.id;
			$scope.brandMap.uuid = $scope.ensureBrand.uuid;
			$scope.brandMap.nameStandardEn = $scope.ensureBrand.nameEn;
			$scope.brandMap.nameStandardCn = $scope.ensureBrand.nameCn;
			$scope.showBrand = false;
		};

		$scope.brandInfoTableParams = new ngTableParams({
			page : 1,
			count : 12
		},{
			total : 0,
			getData : function ($defer, params) {
				var param = BaseService.parseParams(params.url());
				if ($scope.wordInBrand && $scope.wordInBrand.length > 0){
					param.keyword = $scope.wordInBrand;
				}
				if ($scope.initialInBrand && $scope.initialInBrand.length > 0){
					param.initial = $scope.initialInBrand;
				}
				BrandActive.getInfoPageWithInitial(param, function (page){
					$scope.pageList = page.content;
					params.total(page.totalElements);
					$defer.resolve(page.content);
					//划分数据
					var row = Math.ceil(page.numberOfElements/3.0);
					$scope.showList = [];
					var count = 0;
					for (var i = 0; i < row; i++){
						$scope.showList[i] = [];
						for (var j = 0; j < 3; j++){
							$scope.showList[i].push($scope.pageList[count]);
							count++;
							if (count == page.numberOfElements){
								return;
							}
						}
					}
				},function () {
					toaster.pop('error', '获取标准品牌错误');
				} )
			}
		});

		var reloadBrandData = function () {
			$scope.brandInfoTableParams.page(1);
			$scope.brandInfoTableParams.reload();
		};

		$scope.clickChar = function (item) {
			$scope.initialInBrand = item;
			reloadBrandData();
		};

		$scope.searchBrand = function () {
			reloadBrandData();
		};

		$scope.wordInStore = "";
		$scope.typeInStore = 'ALL';

		$scope.showStoreFrame = function () {
			$scope.showStore = !$scope.showStore;
		};

		$scope.storeInfoTableParams = new ngTableParams({
			page : 1,
			count : 5
		},{
			total : 0,
			getData : function ($defer, params) {
				var param = BaseService.parseParams(params.url());
				if ($scope.wordInStore && $scope.wordInStore.length > 0){
					param.keyword = $scope.wordInStore;
				}
				if ($scope.typeInStore && $scope.typeInStore != 'ALL'){
					param.storeType = $scope.typeInStore;
				}
				StoreInfo.findStoresPageByKeyword(param, function (page){
					$scope.storeList = page.content;
					params.total(page.totalElements);
					$defer.resolve(page.content);
				},function () {
					toaster.pop('error', '获取标准品牌错误');
				} )
			}
		});

		$scope.searchStore = function () {
			$scope.reloadStoreData();
		};

		$scope.fitStoreObj = function (item) {
			$scope.storeInfo = item;
		};

		$scope.fitStoreInMap = function () {
			if (!$scope.storeInfo){
				toaster.pop("info", "请选择店铺信息");
				return ;
			}
			$scope.brandMap.enName = $scope.storeInfo.storeName;
			$scope.brandMap.enuu = $scope.storeInfo.enuu;
			$scope.brandMap.type= $scope.storeInfo.type;
			$scope.showStore = false;
		};

		$scope.cancelFitStore = function () {
			$scope.storeInfo = null;
			$scope.showStore = false;
			$scope.wordInStore = '';
		};

		$scope.reloadStoreData =function () {
			$scope.storeInfoTableParams.page(1);
			$scope.storeInfoTableParams.reload();
		};

		$scope.chooseTypeInStore = function (item) {
			if ($scope.typeInStore != item){
				$scope.typeInStore = item;
				$scope.reloadStoreData();
			}
		};

		$scope.changeTextInStore = function (item) {
			$scope.wordInStore = item;
		}

	}]);
});