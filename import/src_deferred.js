var r_extend = /(?:\n|^)jQuery.extend\({\n((?:.|\n)+?)\n}\);(?:\n|$)/g,
	r_decl = /(\s+)(_?Deferred|when)\:((?:.|\n)+?)\1},?/g,
	r_tab = /\n\t/g;

module.exports = function( code ) {
	var _Deferred = "";
	return code.replace( r_extend, function( _, $1 ) {
		return $1.replace( r_tab, "\n" );
	}).replace( r_decl, function( _, sp, name, body ) {
		var output = sp + ( name === "Deferred" ? "var Deferred = module.exports" : "Deferred." + name ) + " =" + body + sp + "};";
		if ( name === "_Deferred" ) {
			_Deferred = output;
			output = "";
		}
		return output;
	}) + _Deferred;
};