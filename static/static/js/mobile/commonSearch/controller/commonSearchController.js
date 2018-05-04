'use strict';
$(function(){
	var pageParams = {};
	var obj = vipspa.params;
	obj.w = obj.w.split("?")[0];// 在微信公众号中带了w?nsukey=""这种格式，所以需要剥离后面的字符串
	$('#search').val(obj.w);
	pageParams.page = 1;
	pageParams.count = 10;
	pageParams.filter = {};
	pageParams.w = $('#search').val();
	var loadData = [];
	var allDataLength = 0;
	var defaultImg = "static/img/all/default.png";
	
	var getOriginalData = function() {
		$('#loadingToast').css('display', 'block');
		$.get('search/component',pageParams,
	        function(data, status, xhr){
				allDataLength = data.total;
				loadData = loadData.concat(data.components);
				constructDiv(data.components);
				$('#loadingToast').css('display', 'none');
	        });
	}
	
	getOriginalData();
	
	$("#search").on('keydown', function(event) {
		if(event.keyCode == 13) {
			window.location.href="commonSearch#/component/" + $('#search')[0].value;
		}
	});
	
	var constructDiv = function(data) {
		var ul = $('#ul');
		$('#pageinfo').remove();
		$.each(data, function(index,item) {
			var li = "<li class='weui_cell item'>" +
					"<img class='weui_cell_hd img-font' width='80px' src='"+formatData(item.img, defaultImg)+"' " +"alt='"+item.code+"'></img>" 
					+"<div class='weui_cell_bd weui_cell_primary component-content'>" 
					+"<div><span class='component-code' title='器件型号'>"+formatData(item.code)+"</span>" 
					+"&nbsp;&nbsp;&nbsp;<span title='规格' class='font-size-14'>"+formatData(item.packaging, '无规格')+"</span></div>"
					+"<div class='float-left'><a class='text-info' title='品牌' data='"+ item.brand.uuid+ "'>"+ formatData(item.brand.nameCn) +"&nbsp;&nbsp;</a>" 
					+"<a class='text-info'title='类目' data='"+item.kind.id+"'>"+formatData(item.kind.nameCn)+"</a></div><br>"
			if(item.reserve) {
				li = li +"<div>" +
						"<span class='component-price text-num'>&nbsp;"+formatData(item.minPrice)+"</span>&nbsp;<span class='font-size-13'>¥最低</span>" +
						"&nbsp<span class='component-reserve text-num'>"+item.reserve+"</span><span class='font-size-13'>&nbsp;pcs&nbsp;库存</span></div></div></li>";
			}else {
				li =  li+"<div class='font-size-14'>暂无库存</div></div></li>";
			}
			var liEle = $(li);
			liEle.on('click', function(e) {
				window.location.href = 'product#/component/' + item.uuid + "/";
			});
			ul.append(liEle);	
		});
		
		var loadMoreLi = "<li class='weui_cell' id='pageinfo'><div class='weui_cell_primary weui_cell-bd'><div class='text-center'>"+ loadData.length+"/"+allDataLength + "</div>"
		if(loadData.length >= allDataLength) {
			loadMoreLi = loadMoreLi + "<div class='text-center'>已全部加载</div></div></li>"
		}
		ul.append(loadMoreLi);
	};
	
	//格式化数据
	var formatData = function(data, str) {
		var type = typeof data;
		switch(type) {
		case 'undefined': return str; break;
		case 'number': return data.toFixed(2); break;
		default :
			return data;
		}
	};
	
	function getClientHeight(){
	    var clientHeight=0;   
	    if(document.body.clientHeight&&document.documentElement.clientHeight){   
	         clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;           
	    }else{   
	         clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;       
	    }   
	    return clientHeight;   
	}
	
	function getScrollTop(){
	    var scrollTop=0;
	    scrollTop=(document.body.scrollTop>document.documentElement.scrollTop)?document.body.scrollTop:document.documentElement.scrollTop;           
	    return scrollTop;   
	}
	
	$(document).on('scroll', function() {
		 //可视窗口的高度
	    var scrollTop = 0;
	    var scrollBottom = 0;
	    var dch = getClientHeight();
        scrollTop = getScrollTop();
	    scrollBottom = document.body.scrollHeight - scrollTop;
	    if(scrollBottom >= dch && scrollBottom <= (dch+10)){
	      if(loadData.length == allDataLength){
        	  return;
	    	}
          pageParams.page++;
          getOriginalData();                
	     }
		
	});

});
