require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/sale/image',
		'lib' : 'lib',
		'angular' : 'lib/angular/angular',
		'angularAMD' : 'lib/angular/angularAMD',
		'ngResource' : 'lib/angular/angular-resource',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'jquery' : 'lib/jquery/jquery.min',
		'jquery-ztree' : 'lib/jquery/jquery.ztree.min',
		'jquery-uploadify' : 'lib/jquery/jquery.uploadify.min',
		'ui-jquery': 'js/common/ui-jquery',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'angular-toaster': 'lib/angular/angular-toaster.min',
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
		'ngResource' : {
			'exports' : 'ngResource',
			'deps' : [ 'angular' ]
		},
		'ui-bootstrap' : [ 'angular' ],
		'jquery-ztree' : [ 'jquery' ],
		'jquery-uploadify' : [ 'jquery' ],
		'ui-jquery' : ['jquery', 'jquery-ztree'],
		'ngAnimate' : ['angular'],
		'angular-toaster' : ['angular', 'ngAnimate']
	}
});
require([ 'app/app' ], function(app) {
	app.init();
});