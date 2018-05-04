require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/usercenter',
		'angular' : 'lib/angular/angular.min',
		'angularAMD' : 'lib/angular/angularAMD',
		'angular-toaster': 'lib/angular/angular-toaster.min',
		'angular-sanitize' : 'lib/angular/angular-sanitize.min',
		'bootstrap' : 'lib/bootstrap/js/bootstrap.min',
		'common' : 'js/common',
		'jquery' : 'lib/jquery/jquery.min',
		'jquery-uploadify' : 'lib/jquery/jquery.uploadify.min',
		'jquery-summernote' : 'lib/jquery/summernote.min',
		'jquery-summernote-lang' : 'lib/jquery/summernote-zh-CN',
		'ngResource' : 'lib/angular/angular-resource.min',
		'ngLocal' : 'lib/angular/angular-i18n',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'ngTable' : 'lib/angular/ng-table.min',
		'ngDraggable' : 'lib/angular/angular-draggable-min',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'ui.router' : 'lib/angular/angular-ui-router.min',
		'file-upload' : 'lib/angular/angular-file-upload.min',
		'file-upload-shim' : 'lib/angular/angular-file-upload-shim.min',
		'ui-form' : 'js/common/directives/ui-form',
		'ui-jquery': 'js/common/ui-jquery',
		'showdown' : 'lib/showdown/showdown.min',
		'calendar': 'lib/calendar/calendar',
		'big': 'lib/decimal/big.min',
		'angular-filter' : 'lib/angular/angular-filter.min'
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
		'ui.router' : ['angular'],
		'ui-bootstrap' : [ 'angular' ],
		'bootstrap' : ['jquery'],
		'jquery-summernote' : ['jquery', 'bootstrap'],
		'jquery-summernote-lang' : ['jquery-summernote'],
		'ui-form' : ['angular', 'jquery-summernote', 'jquery-summernote-lang'],
		'jquery-uploadify' : [ 'jquery' ],
		'ui-jquery': ['jquery'],
		'ngAnimate': ['angular'],
		'angular-toaster': ['angular', 'ngAnimate'],
		'ngDraggable': [ 'jquery', 'angular' ],
		'angular-sanitize': ['angular'],
		'ngResource': ['angular'],
		'dynamicInput': ['angular'],
		'file-upload': ['angular', 'file-upload-shim'],
		'ngTable' : {
			'exports' : 'ngTable',
			'deps' : [ 'angular' ]
		},
		'calendar': ['jquery'],
		'big' : ['jquery'],
		'angular-filter' : ['angular']
	}
});
require([ 'app/app', 'common/controllers/commonCtrls', 'common/controllers/GoodsPickUpCtrl' ], function(app) {
	app.init();
});