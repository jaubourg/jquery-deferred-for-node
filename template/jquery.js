// ultra minimal version of jQuery
// needed to have Deferred code work
// (also look into import/src[-...].js for some transformations that help)
var toString = Function.prototype.call.bind( Object.prototype.toString ),
	r_cleanType = /^\[object |\]$/g,
	typeCache = {};

module.exports = {
	each: function( object, func ) {
		var key, value,
			length = object.length;
		if ( length === undefined || module.exports.type( object ) === "function" ) {
			for( key in object ) {
				value = object[ key ];
				func.call( value, key, value );
			}
		} else {
			for ( key = 0; key < length; key++ ) {
				value = object[ key ];
				func.call( value, key, value );
			}
		}
	},
	extend: function( target, src ) {
		for( var key in src ) {
			target[ key ] = src[ key ];
		}
	},
	noop: function() {},
	type: function( obj ) {
		var type = ( obj == null ? String : toString )( obj );
		return typeCache[ type ] || ( typeCache[ type ] = type.replace( r_cleanType, "" ).toLowerCase() );
	}
};
