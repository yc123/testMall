define([ 'angular', 'ngResource', 'ui-bootstrap', 'ui-jquery', 'angular-toaster' ], function(angular) {
	'use strict';
	var app = angular.module('myApp', [ 'ngResource', 'ui.bootstrap', 'ui.jquery', 'toaster' ]);
	app.init = function() {
		angular.bootstrap(document, [ 'myApp' ]);
	};
	var lastOne = function(arr) {
		return arr[arr.length - 1];
	};
	var getProperty = function(arr, p) {
		var r = [];
		angular.forEach(arr, function(a){
			r.push(a[p]);
		});
		return r;
	};
	/**
	 * 转成取缩略图策略的path
	 */
	app.filter('thumbnail', function() {
		return function(path, size) {
			var name = path.substr(0, path.lastIndexOf('.')), type = path.substr(path.lastIndexOf('.'));
			return name + '_' + size[0] + 'x' + size[1] * 2 + type;
		};
	});
	/**
	 * 字符串字符数
	 */
	var getStrLength = function(str) {
        for (var len = str.length, c = 0, i = 0; i < len; i++) 
        	str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126 ? c += 2 : c++;
        return c;
    };
    /**
     * 文件名称是否有效
     */
	var checkFileName = function(name, len) {
        if (!name || name.length == 0) 
        	return "名称不能为空";
        if (len || (len = 20), getStrLength(name) > len) 
        	return "名称不能超过" + len + "个字符(1个汉字为2个字符)";
        var reg = /[\\\/:*?"<>\|;]+/;
        return reg.test(name) ? '名称不能包含特殊字符 \\ / : * ? " < > | ;': void 0;
    };
    /**
     * 提供文件CRUD服务
     */
    app.factory('ImageService', function($resource){
    	return $resource('images/:folderId', {}, {
			query : {
				method : 'GET',
				params : {
					folderId : 'folderId'
				}
			},
			category : {
				url: 'images/category',
				method : 'GET'
			},
			save : {
				url: 'images/:fileType',
				params : {
					fileType : 'fileType'
				},
				method : 'POST'
			},
			remove : {
				url: 'images/:fileType/:fileId',
				params : {
					fileType : 'fileType',
					fileId : 'fileId'
				},
				method : 'DELETE'
			}
		});
    });
    /**
      * 对话框
      */
    app.factory('Dialog', function($modal){
    	return {
    		show: function(title, body, fn){
    			return $modal.open({
    				templateUrl : 'image/dialog.html',
    				controller : 'DialogCtrl',
    				backdrop : true,
    				resolve : {
    					dialog: function() {
    						return {title: title, body: body};
    					}
    				}
    			}).result.then(fn);
    		}
    	};
    }).controller('DialogCtrl', function($scope, $modalInstance, $sce, dialog){
    	dialog.body = $sce.trustAsHtml(dialog.body);
    	$scope.dialog = dialog;
    	$scope.confirm = function() {
    		$modalInstance.close(true);
    	};
    	$scope.close = function() {
    		$modalInstance.close(false);
    	};
    });
	/**
	 * 
	 */
	app.controller('MyCtrl', function($scope, $modal, $timeout, $q, ImageService, toaster, Dialog) {
		// ztree实例，在ztree调用init方法之后
		$scope.ztree = null;
		// 选择的节点
		$scope.selected = [];
		/**
		 * 选择节点时
		 */
		$scope.onNodeClick = function(node, event) {
			var arr = [ node ], n = node;
			while (n.level > 0) {
				n = n.getParentNode();
				n && arr.push(n);
			}
			$scope.selected = arr.reverse();
			getDetail(node.id);
		};
		/**
		 * 节点返回
		 */
		$scope.onNodeBack = function(node) {
			var arr = $scope.selected, index = 0;
			angular.forEach(arr, function(n, i) {
				(n.level == node.level) && (index = i);
			});
			$scope.selected = arr.slice(0, index + 1);
			$scope.ztree.selectNode(node, false);
			getDetail(node.id);
		};
		/**
		 * 刷新导航
		 */
		var refreshTree = function() {
			ImageService.category(function(data) {
				var deep = $scope.selected.length;
				var fn = function(n, v) {
					if (n.id == $scope.selected[v - 1].id)
						n.open = true;
					if (v < deep && n.children != null && n.children.length > 0) {
						angular.forEach(n.children, function(c) {
							fn(c, v + 1);
						});
					}
				};
				fn(data, 1);
				var root = $scope.ztree.getNodes()[0];
				$scope.ztree.removeChildNodes(root);
				$scope.ztree.addNodes(root, data.children);
				var node = $scope.ztree.getNodeByParam('id', lastOne($scope.selected).id);
				if(node) {
					$scope.ztree.selectNode(node, false);
					$scope.onNodeClick(node);
				}
			});
		};
		/**
		 * 上传图片操作
		 */
		$scope.uploadImage = function() {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'image/upload.html',
					controller : 'UploadCtrl',
					backdrop : 'static',
					resolve : {
						nodes : function() {
							return $scope.selected;
						}
					},
					windowClass : 'modal-default'
				}).result.then(function(nodes) {
					if (lastOne(nodes).id != lastOne($scope.selected).id) {
						var node = $scope.ztree.getNodeByParam('id', lastOne(nodes).id);
						$scope.ztree.selectNode(node, false);
						$scope.onNodeClick(node);
					}
					getDetail(lastOne(nodes).id);
				});
			});
		};
		/**
		 * 选择文件夹后，调取文件夹下面的文件信息
		 */
		function getDetail(folderId) {
			ImageService.query({folderId: folderId}, function(data, status) {
				var num = 1;
				// 加个序号
				angular.forEach(data.folders, function(f) {
					f.$index = num++;
				});
				angular.forEach(data.pictures, function(p) {
					p.$index = num++;
				});
				$scope.folders = data.folders;
				$scope.pictures = data.pictures;
			});
		}
		/**
		 * 新建文件夹
		 */
		$scope.addNewFolder = function() {
			var node = lastOne($scope.selected);
			$modal.open({
				templateUrl : 'image/newfolder.html',
				controller : 'NewFolderCtrl',
				backdrop : true,
				resolve : {
					parentId : function() {
						return node.id;
					},
					folders : function() {
						return $scope.folders;
					}
				}
			}).result.then(function(folder) {
				if (folder) {
					refreshTree();
				}
			});
		};
		/**
		 * 文件列表参数
		 */
		$scope.fileView = {
			// 显示模式
			showType : '1',
			// 所有选中的文件
			selected : {
				length : 0
			},
			// 最后一次选中的文件
			lastSelected : null,
			// 正在修改的文件
			editing : null
		};
		var deselectAll = function() {
			angular.forEach($scope.folders, function(f) {
				f.$selected = false;
			});
			angular.forEach($scope.pictures, function(p) {
				p.$selected = false;
			});
			$scope.fileView.selected = {
				length : 0
			};
			$scope.fileView.lastSelected = null;
		};
		var refreshSelected = function() {
			var sf = [], sp = [];
			angular.forEach($scope.folders, function(f) {
				f.$selected && sf.push(f);
			});
			angular.forEach($scope.pictures, function(p) {
				p.$selected && sp.push(p);
			});
			$scope.fileView.selected = {
				folders : sf,
				pictures : sp,
				length : sf.length + sp.length
			};
			var len = $scope.fileView.selected.length;
			if (len == 0)
				$scope.fileView.lastSelected = null;
			else if (len == $scope.folders.length + $scope.pictures.length)
				$scope.fileView.selectAll = true;
		};
		/**
		 * 同时选中多个
		 */
		var multiSelect = function(start, end) {
			angular.forEach($scope.folders, function(f) {
				f.$selected = f.$index >= start && f.$index <= end;
			});
			angular.forEach($scope.pictures, function(p) {
				p.$selected = p.$index >= start && p.$index <= end;
			});
		};
		/**
		 * 是否点击了文件名字
		 */
		var isFileNameEditing = function(event) {
			return event.target.className == 'item-info ng-binding';
		};
		/**
		 * 文件名修改完成，光标移开
		 */
		$scope.onInputingNameBlur = function(data, event) {
			var ed = $scope.fileView.editing, isPic = angular.isDefined(data.path);
			if(ed && data.id == ed.id && ed.name != data.name) {
				var check = checkFileName(data.name);
				if(check) {
					toaster.pop('error', '错误', check);
					data.name = ed.name;
				} else if(!isPic && data.type == 0){
					toaster.pop('error', '错误', '不允许修改系统文件');
					data.name = ed.name;
				} else {
					var fileType = isPic ? 'pictures' : 'folders';
					ImageService.save({fileType: fileType}, data, function(){
						toaster.pop('info', null, '修改成功', 2000);
						refreshTree();
					}, function(response){
						toaster.pop('error', '错误', response);
					});
				}
			}
			$scope.fileView.editing = null;
		};
		/**
		 * 文件列表里面，选中文件夹、图片
		 */
		$scope.onFileSelect = function(data, event) {
			if (data && event) {
				// ctrlKey按住时，不取消其它的
				if (event.ctrlKey) {
					data.$selected = !data.$selected;
					if (data.$selected)
						$scope.fileView.lastSelected = data;
				} else if (event.shiftKey) {
					// shiftKey按住时，从lastSelected到当前的文件一起选中,其余的取消
					if ($scope.fileView.lastSelected) {
						var i = $scope.fileView.lastSelected.$index, j = data.$index;
						multiSelect(Math.min(i, j), Math.max(i, j));
					}
				} else {
					deselectAll();
					data.$selected = true;
					$scope.fileView.lastSelected = data;
				}
				if (!isFileNameEditing(event))
					event.stopPropagation();
			}
			refreshSelected();
		};
		/**
		 * 点击了空白处
		 */
		$scope.onBlankClick = function() {
			deselectAll();
			$scope.fileView.selectAll = false;
		};
		/**
		 * (取消)选中所有文件
		 */
		$scope.$watch('fileView.selectAll', function(value) {
			angular.forEach($scope.folders, function(f) {
				f.$selected = value;
			});
			angular.forEach($scope.pictures, function(p) {
				p.$selected = value;
			});
			refreshSelected();
		});
		/**
		 * 修改文件名字
		 */
		$scope.onFileNameEdit = function(data, event) {
			if(data == null) {
				data = ($scope.fileView.selected.folders == null || $scope.fileView.selected.folders.length == 0) ? $scope.fileView.selected.pictures[0] : $scope.fileView.selected.folders[0];
			}
			$scope.fileView.editing = angular.copy(data);
			event.stopPropagation();
			$timeout(function(){
				var input = angular.element(event.currentTarget)[0].children[1];
				if(!input) {
					input = document.getElementById(data.id + '-' + $scope.fileView.showType);
				}
				if(input)
					input.focus();
			}, 50);
		};
		/**
		  * 双击文件夹打开
		  */
		$scope.onFolderDbClick = function(folder, event) {
			event.stopPropagation();
			$timeout(function(){
				var node = $scope.ztree.getNodeByParam('id', folder.id);
				$scope.ztree.selectNode(node, false);
				$scope.onNodeClick(node);
				deselectAll();
				$scope.fileView.editing = null;
			}, 50);
		};
		var allowDelete = function(f) {
			for(var i in f) {
				if(f[i].type == 0) {
					return "选择的文件里面包含有系统文件，不允许删除";
				}
			}
			return void 0;
		};
		/**
		 * 文件删除
		 */
		$scope.onFilesDelete = function() {
			Dialog.show('提示', '删除选择的文件夹和图片？<i class="text-muted">图片删除后会在回收站停留7天</i>', function(ok){
				if(ok) {
					var f = $scope.fileView.selected.folders,
						p = $scope.fileView.selected.pictures,
						e = allowDelete(f);
					if(e) {
						toaster.pop('error', '错误', e);
					} else {
						var defer = $q.defer();
						defer.promise.then(function(){
							refreshTree();
						});
						if(p.length > 0) {
							var id = getProperty(p, 'id');
							ImageService.remove({fileType: 'pictures', fileId: id.join(',')}, function(){
								toaster.pop('success', null, '图片删除成功');
								defer.resolve();
							}, function(response){
								toaster.pop('error', '删除失败', response);
							});
						}
						if(f.length > 0) {
							var id = getProperty(f, 'id');
							ImageService.remove({fileType: 'folders', fileId: id.join(',')}, function(){
								toaster.pop('success', null, '文件夹删除成功');
								defer.resolve();
							}, function(response){
								toaster.pop('error', '删除失败', response);
							});
						}
					}
				}
			});
		};
	});
	/**
	 * 图片上传
	 */
	app.controller('UploadCtrl', function($scope, $modalInstance, ImageService, toaster, nodes) {
		$scope.ztree = null;
		// 选择的树节点
		$scope.nodes = nodes;
		// 显示树形查找
		$scope.showTree = false;
		/**
		 * init前，按传入的nodes展开
		 */
		$scope.beforeInit = function(data) {
			var deep = nodes.length;
			var fn = function(n, v) {
				if (n.id == nodes[v - 1].id)
					n.open = true;
				if (v < deep && n.children != null && n.children.length > 0) {
					angular.forEach(n.children, function(c) {
						fn(c, v + 1);
					});
				}
			};
			fn(data, 1);
		};
		/**
		 * 选择节点时
		 */
		$scope.onNodeClick = function(node, event) {
			var arr = [ node ], n = node;
			while (n.level > 0) {
				n = node.getParentNode();
				n && arr.push(n);
			}
			$scope.nodes = arr.reverse();
		};
		/**
		 * 上传成功后，保存文件路径
		 */
		$scope.onUploadSuccess = function(pic, file) {
			var folderId = lastOne($scope.nodes).id;
			pic = angular.extend(pic, {
				name : file.name,
				size : file.size,
				contentType : file.type,
				folderId : folderId
			});
			ImageService.save({fileType: 'pictures'}, pic, function() {
				toaster.pop('success', null, pic.name + ' 上传成功', 2000);
			});
		};
		$scope.close = function() {
			$modalInstance.close($scope.nodes);
		};

	});
	app.controller('NewFolderCtrl', function($scope, $modalInstance, $timeout, ImageService, toaster, parentId, folders) {
		// 文件夹名字
		$scope.folder = {
			parentId : parentId
		};
		/**
		 * 文件夹名称是否被同目录下的文件使用
		 */
		var isUsefull = function() {
			for ( var i in folders) {
				if (folders[i].name == $scope.folder.name)
					return false;
			}
			return true;
		};
		$scope.confirm = function() {
			if ($scope.folder.name != null && $scope.folder.name.length > 0) {
				if (isUsefull()) {
					var check = checkFileName($scope.folder.name);
					if(check) {
						toaster.pop('error', '错误', check);
					} else {
						toaster.pop('wait', '请等待', '正在保存文件夹...', 12000);
						ImageService.save({fileType: 'folders'}, $scope.folder, function() {
							toaster.clear();
							toaster.pop('success', null, '文件夹创建成功', 2000);
							$modalInstance.close($scope.folder);
						});
					}
				} else {
					toaster.pop('warning', null, '文件夹名称已存在');
				}
			} else {
				toaster.pop('warning', null, '文件夹名称不能为空');
			}
		};
		$scope.close = function() {
			$modalInstance.close();
		};
	});
	/**
	 * 
	 */
	app.controller('PagingCtrl', function($scope) {
		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function() {
			console.log('Page changed to: ' + $scope.currentPage);
		};
	});
	return app;
});