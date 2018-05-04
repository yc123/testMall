require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/admin',
		'nls' : 'nls',
		'lib' : 'lib',
		'common' : 'js/common',
		'angular' : 'lib/angular/angular.min',
		'ngResource' : 'lib/angular/angular-resource.min',
		'angularAMD' : 'lib/angular/angularAMD',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'ui.router' : 'lib/angular/angular-ui-router.min',
		'jquery' : 'lib/jquery/jquery.min',
		'jquery-uploadify' : 'lib/jquery/jquery.uploadify.min',
		'ngLocal' : 'lib/angular/angular-i18n',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'ngDraggable' : 'lib/angular/angular-draggable-min',
		'angular-toaster': 'lib/angular/angular-toaster.min',
		'file-upload' : 'lib/angular/angular-file-upload.min',
		'file-upload-shim' : 'lib/angular/angular-file-upload-shim.min',
		'ngTable' : 'lib/angular/ng-table.min',
		'ngSanitize' : 'lib/angular/angular-sanitize.min',
		'ui-jquery': 'js/common/ui-jquery',
		'bootstrap' : 'lib/bootstrap/js/bootstrap.min',
		'jquery-summernote' : 'lib/jquery/summernote.min',
		'jquery-summernote-lang' : 'lib/jquery/summernote-zh-CN',
		'ui-form' : 'js/common/directives/ui-form',
		'showdown' : 'lib/showdown/showdown.min',
		'quill-core' : 'lib/quill/quill.core',
		'quill' : 'lib/quill/quill',
		'big': 'lib/decimal/big.min'
	},
	shim : {
		'angular' : {
			'exports' : 'angular',
			'deps' : [ 'jquery' ]
		},
		'ngResource' : {
			'exports' : 'ngResource',
			'deps' : [ 'angular' ]
		},
		'angularAMD' : {
			'exports' : 'angularAMD',
			'deps' : [ 'angular' ]
		},
		'ui.router' : ['angular'],
		'ngLocal' : {
			'exports' : 'ngLocal',
			'deps' : [ 'angular' ]
		},
		'ui-bootstrap' : [ 'angular' ],
		'ngTable' : {
			'exports' : 'ngTable',
			'deps' : [ 'angular' ]
		},
		'ngSanitize' : {
			'exports' : 'ngSanitize',
			'deps' : [ 'angular' ]
		},
		'ngAnimate' : ['angular'],
		'bootstrap' : ['jquery'],
		'jquery-uploadify' : [ 'jquery' ],
		'jquery-summernote' : ['jquery', 'bootstrap'],
		'jquery-summernote-lang' : ['jquery-summernote'],
		'ui-form' : ['angular', 'jquery-summernote', 'jquery-summernote-lang'],
		'ui-jquery': ['jquery'],
		'file-upload': ['angular', 'file-upload-shim'],
		'angular-toaster' : ['angular', 'ngAnimate'],
		'ngDraggable': [ 'jquery', 'angular' ],
		'quill-core' : [],
		'quill' : ['quill-core'],
		'big' : ['jquery']
	}
});
require([ 'app/app' ], function(app) {
	app.init();
});