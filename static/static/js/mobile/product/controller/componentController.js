'use strict';
$(function(){
	var obj = vipspa.params;
	var uuid = obj.uuid;
	var defaultImg = "static/img/all/default.png";
	$.get('api/product/component/'+ uuid, null, function(data, status, xhr) {
	var img_hd_Ele ="<img class='weui_cell_hd' height='80px' width='80px' alt='" +data.code+"' src='" +formatData(data.img, defaultImg)+"'></img>";
	var basic_bd_Ele = "<div class='weui_cell_bd weui_cell_primary padding-left-15'><span class='title'>基本属性:</span>" 
					 +"<div><span class='component-code'>" +data.code+"</span></div><div>封装规格：&nbsp;" +formatData(data.packaging,'无规格')+"</div>"
				     +"<div>器件类别：&nbsp;" +data.kind.nameCn+"</div><div>品牌：&nbsp;" +data.brand.nameCn+"</div></div>";
	var deliRes_Cell_Ele = "<div class='weui_cell paddingTB_0'>" 
								+"<div class='text-num weui_cell_hd'>交期：&nbsp;<span class='component-delivery'>" 
								+ formatData(data.maxDelivery, '0') + "天</span></div>"
								+"<div class='reserve text-num weui_cell_bd text-right weui_cell_primary'>总库存：&nbsp;<i class='fa fa-link'></i><span class='component-reserve'>" 
								+formatData(data.reserve, '0')+"&nbsp;pcs</span></div>"
							+"</div>";
	var minBuyAndPrice_Cell_Ele = "<div class='weui_cell paddingTB_0'>"
										+"<div class='text-num weui_cell_bd'>最低价格：&nbsp;<span class='component-min-price'>￥&nbsp;" 
										+formatData(data.minPrice, '0')+"</span></div>"
										+"<div class='text-num weui_cell_hd weui_cell_primary text-right'>最小起订量：&nbsp;<span class='component-minBuy'>" 
										+formatData(data.minBuyQty, '0')+"&nbsp;pcs</span></div>"
								  +"</div>";
				
	var  attach_Cell_Ele = "";
	if(data.attach) {
		attach_Cell_Ele = "<div class='weui_cell paddingTB_0'><span>附件：&nbsp;</span><a href='" + data.attach + "'>下载附件</a></div>";
	} else {
		attach_Cell_Ele = "<div class='weui_cell paddingTB_0'><span>附件：&nbsp;</span><a>无附件</a></div>";
	}
	//交易的属性，包含最小起订量，最小包装量，总库存，交期等信心
	var transation_Cell_Ele = deliRes_Cell_Ele + minBuyAndPrice_Cell_Ele + attach_Cell_Ele;
	var divEle = "<div class='weui_cells'>"
		 				+"<div class='weui_cell'>" +img_hd_Ele+basic_bd_Ele+"</div>"
		 				+transation_Cell_Ele
		 		 + "</div>";
		divEle = divEle + "<div class='weui_cell'><div class='weui_cell-bd weui_cell_primary'><div class='title'>标准属性：</div>"
		$.each(data.properties, function(index, item) {
			if(item.value) {
				divEle = divEle +"<div class='component-standard'><span>"+item.property.labelCn+ "</span>&nbsp;：<span>" + item.value+"</span></div>";
			}
		});
		
		divEle = divEle + "</div></div></div>";
		$('#content').append(divEle);
		
		$('.reserve').on('click', function(event) {
			window.location.href = 'product#/batch/' + uuid;
		});
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