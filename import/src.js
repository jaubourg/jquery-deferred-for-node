require( "plus" );

var r_closure = /\(function\( jQuery \) {\n|}\)\( jQuery \);\n/g,
	exprs = {
		"document": "global", // <= crazy right?
		"jQuery.Callbacks": "Deferred.Callbacks",
		"jQuery.Deferred": "Deferred",
		"jQuery._Deferred": "Deferred._Deferred",
		"jQuery.isFunction": "\"function\" === jQuery.type",
		"jQuery.when": "Deferred.when",
		"window": "global"
	},
	r_inArray = /(jQuery\.inArray\(\s*)(.+?)(\s*,\s*)(.+?)(\s*[,\)])/g,
	r_exprs = [];

exprs.forEach(function( _, search ) {
	r_exprs.push( search.replace( ".", "\\." ) );
});

r_exprs = new RegExp( "(\\b)(" + r_exprs.join( "|" ) + ")(\\b)", "g" );

module.exports = function( code ) {
	return code.replace( r_closure, "" )
		.replace( r_inArray, "$1$4$3$2$5" )
		.replace( r_exprs, function( _, before, expr, after ) {
			return before + exprs[ expr ] + after;
		});
};