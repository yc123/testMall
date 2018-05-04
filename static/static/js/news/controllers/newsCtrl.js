define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('newsCtrl', ['$scope', '$rootScope', 'toaster','News', function ($scope, $rootScope, toaster, News ) {
		$rootScope.page = 'news';
		$scope.param = {};
		$scope.param.page = 1;
		$scope.param.pageSize = 10;
		var loadData = function () {
			//获取资讯列表
			News.get($scope.param,{},function (data) {
				$scope.count = data.count;
				$scope.param.currentPage = $scope.param.page;
				$scope.news = data.content;
				if ($scope.count % 10 == 0 ){
					$scope.totalPages = data.count / $scope.param.pageSize;
				}else{
					$scope.totalPages = parseInt(data.count / $scope.param.pageSize) + 1;
				}
				$scope.acculatePages($scope.param.currentPage, $scope.totalPages);
				console.log(data);
			},function (response) {
				toaster.pop('error', '获取新闻数据失败，请重新刷新界面，' + response.data);
			})
		};
		loadData();

		/******************根据页数设置翻页的信息********start**************************/



		//输入框监听Enter事件
		$scope.listenEnter = function () {
			if(event.keyCode == 13) {
				$scope.setPage("page", $scope.param.currentPage);
			}
		};

		$scope.setPage = function(type, number) {
			if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
				return ;
			};
			var page = -1;
			switch (type) {
				case "page":
					if(number < 1) {
						page = 1;
					}else if(number > $scope.totalPages) {
						page = $scope.totalPages;
					}else {
						page = number;
					};
					break;
				case "prev":
					if($scope.param.page <= 1) {
						page = 1;
					}else {
						page =$scope.param.page - 1;
					};
					break;
				case "next":
					if($scope.param.page >= $scope.totalPages) {
						page = $scope.totalPages;
					}else {
						page =$scope.param.page + 1;
					}
					break;
				case "first":
					page = 1;
					break;
				case "last":
					page = $scope.totalPages;
					break;
			}
			if(page == $scope.param.page || page < 1 || page > $scope.totalPages) {
				$scope.param.currentPage = $scope.param.page;
				return ;
			}
			$scope.param.page = page;
			loadData();
		};

		//当前页在前段的计算方式
		$scope.frontSegment = function (currentPage, totalElementPages) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 8:
						page.type = 'more';
						page.active = false;
						break;
					case 0:
						if(currentPage == 1) {
							page.active = false;
						}
					default : {
						page.current = (currentPage == page.number);
					}
				}
			});
		};

		//当前页在后端计算方式
		$scope.endSegment = function (currentPage, totalElementPages) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 2:
						page.active = false;
						page.type = 'more';
						break;
					case 10:
						if(currentPage == totalElementPages) {
							page.active = false;
						}
						break;
					case 0:
					case 1:
						break;
					default:
						if(page.number != totalElementPages) {
							page.number = totalElementPages - 9 + page.number;
						}
						page.current = (currentPage == page.number);
						break;
				}
			});
		};

		//当前页在中间计算方式
		$scope.middleSegment = function (currentPage) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 2:
					case 8:
						page.type ='more';
						page.active = false;
						break;
					case 3:
						page.number = currentPage - 2;
						break;
					case 4:
						page.number = currentPage - 1;
						break;
					case 5:
						page.number = currentPage;
						page.current = true;
						break;
					case 6:
						page.number = currentPage + 1;
						break;
					case 7:
						page.number = currentPage + 2;
						break;
				}
			});
		}

		//初始化页数信息
		$scope.initPages = function (totalElementPages) {
			var pageNum = [];
			if(totalElementPages == 1) {
				return ;
			}else if(totalElementPages < 10) {
				for(var i = 0; i < totalElementPages + 2; i++) {
					pageNum.push(i);
				}
			}else {
				pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			}
			angular.forEach(pageNum, function (number) {
				var page = {active : true, type : 'page', number : number};
				if(number == 0) {
					page.type = 'prev';
				}else if(number == 1) {
					page.type = 'first';
				}else if(number == pageNum.length - 2) {
					page.type = 'last';
					page.number = totalElementPages;
				}else if(number == pageNum.length - 1){
					page.type = 'next';
				}
				$scope.pages.push(page);
			});
		}

		//计算页数的方式。
		$scope.acculatePages = function(currentPage, totalElementPages) {
			$scope.pages = [];
			if(totalElementPages < 1)  {
				return ;
			}
			//初始化页面数据
			$scope.initPages(totalElementPages);
			if(totalElementPages < 10) {
				angular.forEach($scope.pages, function (page) {
					if(page.number == currentPage) {
						page.current = true;
					}
				});
			}else if(currentPage < 6) {//当期页小于6
				$scope.frontSegment(currentPage, totalElementPages);
			}else if(currentPage > totalElementPages - 5) { //当期页在后面
				$scope.endSegment(currentPage, totalElementPages);
			}else { //当期页在中间
				$scope.middleSegment(currentPage);
			}
		};
		/******************根据页数设置翻页的信息********end**************************/


	}]);

});
