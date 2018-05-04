define([ 'angular', 'jquery' ], function(angular) {
	'use strict';
	angular.module('ui.jquery', []).directive('treePanel', ['$http', '$templateCache', '$parse', function($http, $templateCache, $parse) {
		// require(['jquery-ztree']);
		return {
			require : '?ngModel',
			restrict : 'EA',
			scope : false,
			link : function(scope, element, attrs, ngModel) {
				var onSelectionChange = $parse(attrs.onClick),
					beforeInit = $parse(attrs.beforeInit),
					afterInit = $parse(attrs.afterInit);
				var setting = {
					callback : {
						onClick : function(event, treeId, treeNode, clickFlag) {
							onSelectionChange(scope, {$data: treeNode, $event: event});
							scope.$apply();// 用到了jquery，需要手动apply
						}
					}
				};
				$http.get(attrs.url, {
				}).success(function(data) {
					beforeInit(scope, {$data: data});
					attrs.expandFirst && (data.open = true);
					var tree = $.fn.zTree.init(element, setting, data);
					ngModel.$setViewValue(tree);
					if(attrs.expandFirst) {
						var nodes = tree.getNodes();
						if (nodes.length > 0) {
							tree.selectNode(nodes[0]);
							onSelectionChange(scope, {$data: nodes[0]});
						}
					}
					afterInit(scope);
				}).error(function(err) {
				});
			}
		};
	}]).directive("uploadify", ['$parse', function($parse) {
		// require(['jquery-uploadify']);
		var basePath = (function() {
        	var pathName = window.location.pathname.substring(1);
        	var webName = pathName == '' ? '': pathName.substring(0, pathName.indexOf('/'));
        	if (webName == "") {
        	    return window.location.protocol + '//' + window.location.host;
        	} else {
        	    return window.location.protocol + '//' + window.location.host + '/' + webName;
        	}
        })();
		return {
			require : '?ngModel',
			restrict : 'A',
			link : function(scope, element, attrs, ngModel) {
				var opts = angular.extend({}, scope.$eval(attrs.uploadify));
				var onSuccess = $parse(attrs.onSuccess);
				var isImage = opts.type == 'image';
				element.uploadify({
					auto : opts.auto != undefined ? opts.auto : true,
					multi : true,
					method : 'post',
					swf : 'static/misc/uploadify.swf',
					uploader : opts.uploader || basePath + (isImage ? '/images' : '/file'),
					buttonText : opts.buttonText || (isImage ? '上传图片':'上传附件'),
					width : opts.width || 80,
					height : opts.height || 30,
					fileSizeLimit : isImage ? '3072KB' : '10240KB',// 普通文件10MB，图片文件3MB
					fileTypeDesc : '选择文件',
					fileTypeExts : opts.fileTypeExts || (isImage ?  '*.jpg;*.jpeg;*.png;*.gif;*.bmp' : '*.*'),
					cancelImg : 'static/lib/jquery/themes/uploadify/img/uploadify-cancel.png',
					onUploadSuccess : function(file, d, response) {
						$('#' + file.id).find('.data').html(' 上传完毕');
						onSuccess(scope, {$data: angular.fromJson(d)[0], $file: file});
					}
				});
			}
		};
	}]);
});