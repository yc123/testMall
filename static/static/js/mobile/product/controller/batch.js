'use strict';
$(function() {
	var obj = vipspa.params;
	var uuid = obj.uuid;
	$.get('api/product/component/'+ uuid, null, function(data, status, xhr) {
		var componentEle = "";
		componentEle = componentEle + "<img class='weui_cell_hd' height='80px' width='80px' alt='" +data.code+"' src='" +data.img+"'></img>"
		+"<div class='weui_cell_bd weui_cell_primary padding-left-15'>" +
		"<div><span>产品新型号：&nbsp;</span><span class='component-code'>" +data.code+"</span></div><div>封装规格：&nbsp;" +formatData(data.packaging,'无规格')+"</div>"
		+"<div>器件类别：&nbsp;" +data.kind.nameCn+"</div><div>品牌：&nbsp;" +data.brand.nameCn+"</div>"
		+"<div class='text-num'>最低价格：&nbsp;<span>￥&nbsp;" +formatData(data.minPrice, '0')+"</span></div>"
		+"<div class='reserve text-num'>总库存：&nbsp;<span>" +formatData(data.reserve, '0')+"&nbsp;pcs</span></div>"
		+"<div class='text-num'>最小起订量：&nbsp;<span>" +formatData(data.minBuyQty, '0')+"&nbsp;pcs</span></div>" 
		+"<div class='text-num'>交期：&nbsp;<span>" +formatData(data.maxDelivery, '0')+"天</span></div></div>";
		$('#component').append(componentEle);
	});
	
	$.get('trade/goods/simple/byUuid/'+uuid, {_status:'available'}, function(data, status, type) {
		var batchEle = ""
		$.each(data, function(index, item) {
			batchEle = batchEle 
					+ "<div class='weui_cells'><div class='weui_cell weui_cell_primary no-top batch-content'><div class='weui_cell_hd'>&nbsp;" 
					+item.batchCode+"</div><div class='text-num weui_cell_bd weui_cell_primary text-right'>库存&nbsp;<span class='component-reserve'>"+item.reserve+"&nbsp;pcs</span></div></div>"
					+"<div class='weui_cell no-top batch-content'><div class='text-num weui_cell_hd'>最小包装数：<span class='component-minBuy'>" +item.minPackQty +"&nbsp;pcs</span></div><div class='text-num weui_cell_bd weui_cell_primary text-right'>交货周期："+item.deliveryTime+"&nbsp;天</div></div>";
			
			$.each(item.prices, function(index, item) {
				batchEle = batchEle + "<div class='weui_cell no-top batch-content'><div class='text-right half-width'>" +item.start +"&nbsp;-&nbsp;" + item.end+"&nbsp;pcs</div>:&nbsp;<div class='text-left component-min-price half-width'>￥&nbsp;" + item.price + "</div></div>";
			});

			batchEle = batchEle +"</div></div>"
		});
		$('#batch').append(batchEle);
	});
	
	//格式化数据
	var formatData = function(data, str) {
		var type = typeof data;
		switch(type) {
		case 'undefined': return str; break;
		case 'number': return data.toFixed(2); break;
		default :
			return data;
		}
	}
});