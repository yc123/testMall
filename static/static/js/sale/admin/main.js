require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/sale/admin',
		'lib' : 'lib',
		'angular' : 'lib/angular/angular',
		'angularAMD' : 'lib/angular/angularAMD',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min'
	},
	shim : {
		'angular' : {
			'exports' : 'angular'
		},
		'angularAMD' : {
			'exports' : 'angularAMD',
			'deps' : [ 'angular' ]
		},
		'ui-bootstrap' : [ 'angular' ]
	}
});
require([ 'app/app' ], function(app) {
	app.init();
});