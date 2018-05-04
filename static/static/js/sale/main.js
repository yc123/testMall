require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/sale',
		'nls' : 'nls',
		'lib' : 'lib',
		'common' : 'js/common',
		'angular' : 'lib/angular/angular',
		'angularAMD' : 'lib/angular/angularAMD',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls-0.8.0',
		'ngRoute' : 'lib/angular/angular-route',
		'ngResource' : 'lib/angular/angular-resource',
		'ngTable' : 'lib/angular/ng-table',
		'ngLocal' : 'lib/angular/angular-i18n',
		'big': 'lib/decimal/big.min'
	},
	shim : {
		'angular' : {
			'exports' : 'angular'
		},
		'angularAMD' : {
			'exports' : 'angularAMD',
			'deps' : [ 'angular' ]
		},
		'ngRoute' : {
			'exports' : 'ngRoute',
			'deps' : [ 'angular' ]
		},
		'ngTable' : {
			'exports' : 'ngTable',
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
		'ui-bootstrap' : [ 'angular' ],
		'big' : ['jquery']
	}
});
require([ 'app/app' ], function(app) {
	app.init();
});