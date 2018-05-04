require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/vendor',
		'angular' : 'lib/angular/angular.min',
		'angularAMD' : 'lib/angular/angularAMD',
		'angular-toaster': 'lib/angular/angular-toaster.min',
		'angular-sanitize' : 'lib/angular/angular-sanitize.min',
		'bootstrap' : 'lib/bootstrap/js/bootstrap.min',
		'common': 'js/common',
		'dynamicInput' : 'js/common/directives/dynamicInput',
		'jquery' : 'lib/jquery/jquery.min',
		'jquery-imagezoom' : 'lib/jquery/jquery.imagezoom.min',
		'jquery-uploadify' : 'lib/jquery/jquery.uploadify.min',
		'jquery-summernote' : 'lib/jquery/summernote.min',
		'jquery-summernote-lang' : 'lib/jquery/summernote-zh-CN',
		'jquery-chart' : 'lib/jquery/Chart.min',
		'ngLocal' : 'lib/angular/angular-i18n',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'ngDraggable' : 'lib/angular/angular-draggable-min',
		'ngResource' : 'lib/angular/angular-resource.min',
		'ngTable' : 'lib/angular/ng-table.min',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'ui.router' : 'lib/angular/angular-ui-router.min',
		'ui-form' : 'js/common/directives/ui-form',
		'ui-jquery': 'js/common/ui-jquery',
		'file-upload': 'lib/angular/angular-file-upload.min',
		'file-upload-shim': 'lib/angular/angular-file-upload-shim.min',
		'showdown' : 'lib/showdown/showdown.min',
		'calendar': 'lib/calendar/calendar',
		'big': 'lib/decimal/big.min'
	},
	shim : {
		'angular' : {
			'exports' : 'angular',
			'deps' : [ 'jquery' ]
		},
		'angularAMD' : {
			'exports' : 'angularAMD',
			'deps' : [ 'angular' ]
		},
		'ngLocal' : {
			'exports' : 'ngLocal',
			'deps' : [ 'angular' ]
		},
		'ui.router' : ['angular'],
		'ui-bootstrap' : ['angular'],
		'bootstrap' : ['jquery'],
		'jquery-imagezoom' : ['jquery'],
		'jquery-summernote' : ['jquery', 'bootstrap'],
		'jquery-summernote-lang' : ['jquery-summernote'],
		'jquery-chart' : ['jquery'],
		'ui-form' : ['angular', 'jquery-summernote', 'jquery-summernote-lang'],
		'jquery-uploadify' : [ 'jquery' ],
		'ui-jquery': ['jquery'],
		'ngAnimate': ['angular'],
		'angular-toaster': ['angular', 'ngAnimate'],
		'ngDraggable': [ 'jquery', 'angular' ],
		'angular-sanitize': ['angular'],
		'ngResource': ['angular'],
		'dynamicInput': ['angular'],
		'ngTable' : {
			'exports' : 'ngTable',
			'deps' : [ 'angular' ]
		},
		'file-upload': ['angular', 'file-upload-shim'],
		'calendar': ['jquery'],
		'big' : ['jquery']
	}
});
require([ 'app/app', 'common/controllers/commonCtrls' ], function(app) {
	app.init();
});