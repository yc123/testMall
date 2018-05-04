require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/index',
		'nls' : 'nls',
		'lib' : 'lib',
		'common' : 'js/common',
		'angular' : 'lib/angular/angular.min',
		'angularAMD' : 'lib/angular/angularAMD',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls',
		'angular-toaster': 'lib/angular/angular-toaster.min',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'ngRoute' : 'lib/angular/angular-route.min',
		'ngResource' : 'lib/angular/angular-resource.min',
		'ngLocal' : 'lib/angular/angular-i18n',
		'ngTable' : 'lib/angular/ng-table.min',
		'jquery' : 'lib/jquery/jquery.min',
		'showdown' : 'lib/showdown/showdown.min',
		'sanitize': 'lib/angular/angular-sanitize.min',
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
		'ngRoute' : {
			'exports' : 'ngRoute',
			'deps' : [ 'angular' ]
		},
		'ngResource' : {
			'exports' : 'ngResource',
			'deps' : [ 'angular' ]
		},
		'ngLocal' : {
			'exports' : 'ngLocal',
			'deps' : [ 'angular' ]
		},
		'ngTable' : {
			'exports' : 'ngTable',
			'deps' : [ 'angular' ]
		},
		'ngAnimate': ['angular'],
		'angular-toaster': ['angular', 'ngAnimate'],
		'ui-bootstrap' : [ 'angular' ],
		'sanitize': ['angular'],
		'big' : ['jquery']
	}
});
require([ 'app/app', 'common/controllers/commonCtrls' ], function(app) {
	app.init();
});