define([ 'angular', 'jquery-summernote' ], function(angular) {
	'use strict';
	angular.module('ui.form', []).controller('SummernoteController', ['$scope', '$attrs', function($scope, $attrs) {
	    var currentElement, summernoteConfig = $scope.summernoteConfig || {};
	    summernoteConfig.fontNames =['宋体', '黑体', '楷体', '隶书', '幼圆', '仿宋', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica Neue', 'Impact', 'Lucida Grande', 'Tahoma', 'Times New Roman', 'Verdana'];
	    summernoteConfig.defaultFontName = 'Tahoma';
	    if (angular.isDefined($attrs.height)) { summernoteConfig.height = $attrs.height; }
	    if (angular.isDefined($attrs.focus)) { summernoteConfig.focus = true; }
	    if (angular.isDefined($attrs.lang)) {
	      if (!angular.isDefined($.summernote.lang[$attrs.lang])) {
	        throw new Error('"' + $attrs.lang + '" lang file must be exist.');
	      }
	      summernoteConfig.lang = $attrs.lang;
	    }

	    summernoteConfig.oninit = $scope.init;
	    summernoteConfig.onenter = function(evt) { $scope.enter({evt:evt}); };
	    summernoteConfig.onfocus = function(evt) { $scope.focus({evt:evt}); };
	    summernoteConfig.onblur = function(evt) { $scope.blur({evt:evt}); };
	    summernoteConfig.onpaste = function(evt) { $scope.paste({evt:evt}); };
	    summernoteConfig.onkeydown = function(evt) { $scope.keydown({evt:evt}); };
	    if (angular.isDefined($attrs.showImageDialog)) {
	    	summernoteConfig.showImageDialog = function(oLayoutInfo){
	    		$scope.imageDialog({oLayoutInfo: oLayoutInfo});
	    	};
	    }
	    if (angular.isDefined($attrs.onImageUpload)) {
	      summernoteConfig.onImageUpload = function(files, editor, welEditable) {
	        $scope.imageUpload({files:files, editor:editor, welEditable:welEditable});
	      };
	    }

	    this.activate = function(scope, element, ngModel) {
	      var updateNgModel = function() {
	        var newValue = element.code();
	        if (ngModel && ngModel.$viewValue !== newValue) {
	          ngModel.$setViewValue(newValue);
	          if ($scope.$$phase !== '$apply' || $scope.$$phase !== '$digest' ) {
	            scope.$apply();
	          }
	        }
	      };

	      summernoteConfig.onkeyup = function(evt) {
	        updateNgModel();
	        $scope.keyup({evt:evt});
	      };

	      element.summernote(summernoteConfig);

	      var editor$ = element.next('.note-editor'),
	          unwatchNgModel;
	      editor$.find('.note-toolbar').click(function() {
	        updateNgModel();

	        // sync ngModel in codeview mode
	        if (editor$.hasClass('codeview')) {
	          editor$.on('keyup', updateNgModel);
	          if (ngModel) {
	            unwatchNgModel = scope.$watch(function () {
	              return ngModel.$modelValue;
	            }, function(newValue, oldValue) {
	              editor$.find('.note-codable').val(newValue);
	            });
	          }
	        } else {
	          editor$.off('keyup', updateNgModel);
	          if (angular.isFunction(unwatchNgModel)) {
	            unwatchNgModel();
	          }
	        }
	      });

	      if (ngModel) {
	        ngModel.$render = function() {
	          element.code(ngModel.$viewValue || '');
	        };
	      }

	      currentElement = element;
	    };

	    $scope.$on('$destroy', function () {
	      currentElement.destroy();
	    });
	  }])
	  .directive('summernote', [function() {
	    /**
		  * 基于jQuery和bootstrap的编辑器
		  */
	    return {
	      restrict: 'EA',
	      transclude: true,
	      replace: true,
	      require: ['summernote', '^?ngModel'],
	      controller: 'SummernoteController',
	      scope: {
	        summernoteConfig: '=config',
	        init: '&onInit',
	        enter: '&onEnter',
	        focus: '&onFocus',
	        blur: '&onBlur',
	        paste: '&onPaste',
	        keyup: '&onKeyup',
	        keydown: '&onKeydown',
	        imageDialog: '&showImageDialog',
	        imageUpload: '&onImageUpload'
	      },
	      template: '<div class="summernote"></div>',
	      link: function(scope, element, attrs, ctrls) {
	        var summernoteController = ctrls[0],
	            ngModel = ctrls[1];

	        summernoteController.activate(scope, element, ngModel);
	      }
	    };
	  }]);
});