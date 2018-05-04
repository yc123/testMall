require.config({
	baseUrl : 'static',
	waitSeconds: 200,
	paths : {
		'app' : 'js/signin',
		'common' : 'js/common',
		'angular' : 'lib/angular/angular.min',
		'ngAnimate': 'lib/angular/angular-animate.min',
		'toaster' : 'lib/angular/angular-toaster.min',
		'ui.bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'services' : 'js/common/services',
		'ngResource' : 'lib/angular/angular-resource.min',
		'big': 'lib/decimal/big.min'
	},
	shim : {
		'angular' : {
			'exports' : 'angular'
		},
		'ngAnimate' : ['angular'],
		'toaster' : ['angular', 'ngAnimate'],
		'ui.bootstrap' : [ 'angular' ],
		'services': ['angular'],
		'ngResource': ['angular'],
		'big' : ['jquery']
	}
});
require([ 'app/app' ], function(app) {
	app.init();
});