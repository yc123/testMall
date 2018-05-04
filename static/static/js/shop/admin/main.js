require.config({
	baseUrl : 'static',
	paths : {
		'app' : 'js/shop/admin',
		'jquery' : 'lib/jquery/jquery.min',
		'angular' : 'lib/angular/angular',
		'angularAMD' : 'lib/angular/angularAMD',
		'ngRoute' : 'lib/angular/angular-route',
		'ui-bootstrap' : 'lib/angular/ui-bootstrap-tpls.min',
		'ngDraggable' : 'lib/angular/angular-draggable'
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
		'ui-bootstrap' : [ 'angular' ],
		'ngDraggable' : [ 'jquery', 'angular' ]
	}
});
require([ 'app/app' ], function(app) {
	app.init();
});