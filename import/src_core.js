require( "plus" );

var r_decl = /(\s+)(_?Deferred|when)\:((?:.|\n)+?)\1},?/g,
	r_vars = /(?:\s+)(slice|promiseMethods|core_slice|core_rspace) =([^,]+),/g;

module.exports = function( code ) {
	var defs = {
			vars: [],
			Deferred: "",
			_Deferred: "",
			when: ""
		},
		tmp;
	code.replace( r_vars, function( _, name, value ) {
		defs.vars.push( name + " =" + value );
	});
	defs.vars = "var " + defs.vars.join( ",\n\t" ) + ";";
	code.replace( r_decl, function( _, __, name, body ) {
		defs[ name ] = ( name === "Deferred" ? "var Deferred = module.exports" : "Deferred." + name ) + " =" + body + "\n};";
	});
	return defs.join( "\n\n" );
};
