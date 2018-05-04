require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/news',
		'angular' : 'lib/angular/angular.min',
		'angularAMD' : 'lib/angular/angularAMD',
		'angular-toaster': 'lib/angular/angular-toaster.min',
		'angular-sanitize' : 'lib/angular/angular-sanitize.min',
		'bootstrap' : 'lib/bootstrap/js/bootstrap.min',
		'common' : 'js/common',
		'jquery' : 'lib/jquery/jquery.min',
		'jquery-uploadify' : 'lib/jquery/jquery.uploadify.min',
		'ngSanitize' : 'lib/angular/angular-sanitize.min',
		'jquery-summernote' : 'lib/jquery/summernote.min',
		'jquery-summernote-lang' : 'lib/jquery/summernote-zh-CN',
		'ngResource' : 'lib/angular/angular-resource.min',
		'ngLocal' : 'lib/angular/angular-i18n',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'ngTable' : 'lib/angular/ng-table.min',
		'ngDraggable' : 'lib/angular/angular-draggable-min',
		'file-upload' : 'lib/angular/angular-file-upload.min',
		'file-upload-shim' : 'lib/angular/angular-file-upload-shim.min',
		'ui.router' : 'lib/angular/angular-ui-router.min',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'ui-form' : 'js/common/directives/ui-form',
		'jquery-summernote' : 'lib/jquery/summernote.min',
		'jquery-summernote-lang' : 'lib/jquery/summernote-zh-CN',
		'ui-jquery': 'js/common/ui-jquery',
		'angular-sanitize' : 'lib/angular/angular-sanitize.min',
		'showdown' : 'lib/showdown/showdown.min',
		'big': 'lib/decimal/big.min'
	},
	shim : {
		'angular' : {
			'exports' : 'angular',
			'deps' : [ 'jquery' ]
		},
		'ngLocal' : {
			'exports' : 'ngLocal',
			'deps' : [ 'angular' ]
		},
		'angularAMD' : {
			'exports' : 'angularAMD',
			'deps' : [ 'angular' ]
		},
		'ngSanitize' : {
			'exports' : 'ngSanitize',
			'deps' : [ 'angular' ]
		},
		'ui.router' : ['angular'],
		'ui-bootstrap' : [ 'angular' ],
		'bootstrap' : ['jquery'],
		'jquery-summernote' : ['jquery', 'bootstrap'],
		'jquery-summernote-lang' : ['jquery-summernote'],
		'ui-form' : ['angular', 'jquery-summernote', 'jquery-summernote-lang'],
		'jquery-uploadify' : [ 'jquery' ],
		'ui-jquery': ['jquery'],
		'ngAnimate': ['angular'],
		'angular-sanitize' : ['angular'],
		'angular-toaster': ['angular', 'ngAnimate'],
		'ngDraggable': [ 'jquery', 'angular' ],
		'angular-sanitize': ['angular'],
		'ngResource': ['angular'],
		'jquery-summernote-lang' : ['jquery-summernote'],
		'ui-form' : ['angular', 'jquery-summernote', 'jquery-summernote-lang'],
		'file-upload': ['angular', 'file-upload-shim'],
		'dynamicInput': ['angular'],
		'ngTable' : {
			'exports' : 'ngTable',
			'deps' : [ 'angular' ]
		},
		'big' : ['jquery']
	}
});
require([ 'app/app', 'common/controllers/commonCtrls' ], function(app) {
	app.init();
});