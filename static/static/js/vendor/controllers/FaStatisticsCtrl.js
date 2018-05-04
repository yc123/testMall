define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('FaStatisticsCtrl', ['$scope', 'toaster', 'Statistics', 'BaseService', function($scope, toaster, Statistics, BaseService) {
		BaseService.scrollBackToTop();
		
		//当前日期
		var date = new Date();
		var currentYear = date.getFullYear();//年份
		var currentMonth = date.getMonth();//月份
		
		
		
		//获取账户年度销售额统计
		var faYearStat = function(){
			Statistics.getYearStat({}, function(data){
				$scope.yearStat = data;

				var lineChartData = {
						labels : [currentYear-5,currentYear-4,currentYear-3,currentYear-2,currentYear-1,currentYear],
						datasets : [
							{
								label: "元",
								fillColor : "rgba(220,220,220,0.2)",
								strokeColor : "rgba(220,220,220,1)",
								pointColor : "rgba(220,220,220,1)",
								pointStrokeColor : "#fff",
								pointHighlightFill : "#fff",
								pointHighlightStroke : "rgba(220,220,220,1)",
								data : [0,0,0,0,0,$scope.yearStat[5].total]
							}
						]

					}

				var load = function(){
					var ctx = $("#canvas3")[0].getContext("2d");
					window.myLine = new Chart(ctx).Line(lineChartData, {
						responsive: true
					});
				}
				load();
			});
		}
		faYearStat();

		
		//获取账户月度销售额统计
		var faMonthStat = function(){
			Statistics.getMonthStat({}, function(data){
				$scope.monthStat = data;

				var lineChartData = {
						labels : ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
						datasets : [
							{
								label: "月度统计",
								fillColor : "rgba(220,220,220,0.2)",
								strokeColor : "rgba(220,220,220,1)",
								pointColor : "rgba(220,220,220,1)",
								pointStrokeColor : "#fff",
								pointHighlightFill : "#fff",
								pointHighlightStroke : "rgba(220,220,220,1)",
								data : [0,0,$scope.monthStat[0].total,$scope.monthStat[1].total,0,0,0,0,0,0,0,0]
							}
						]

					}

				var load = function(){
					var ctx = $("#canvas2")[0].getContext("2d");
					window.myLine = new Chart(ctx).Line(lineChartData, {
						responsive: true
					});
				}
				load();
			});
		}
		faMonthStat();
	
		
		//获取账户上个月销售额统计
		var faDayStat = function(){
			Statistics.getDayStat({}, function(data){
				$scope.dayStat = data;
				
				var d = new Date(currentYear, currentMonth, 0);
			    var dNum =  d.getDate();
			    
				var dayArr;
				var dSal = [];
				var dSal0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				for(var i=0; i<dSal0.length; i++){
					for(var j=0;j<$scope.dayStat.length; j++){
						if($scope.dayStat[j].day == i){
							dSal0[i] = $scope.dayStat[j].day;
						}	
						}
				}
				
				if(dNum == 31){
					dayArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
					dSal = dSal0;
				}else if(dNum ==30 ){			dayArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
					dSal = dSal0.splice(30,1);
				}else if(dNum == 29){
					dayArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
					dSal = dSal0.splice(29,2);
				}else {
					dNum == [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
					dSal = dSal0.splice(28,3);
				}
				
				var lineChartData = {
						labels : dayArr,
						datasets : [
							{
								label: "上月销售统计",
								fillColor : "rgba(220,220,220,0.2)",
								strokeColor : "rgba(220,220,220,1)",
								pointColor : "rgba(220,220,220,1)",
								pointStrokeColor : "#fff",
								pointHighlightFill : "#fff",
								pointHighlightStroke : "rgba(220,220,220,1)",
								data : dSal
							}
						]

					}

				var load = function(){
					var ctx = $("#canvas1")[0].getContext("2d");
					window.myLine = new Chart(ctx).Line(lineChartData, {
						responsive: true
					});
				}
				load();
			});
		}
		faDayStat();

	}]);
});