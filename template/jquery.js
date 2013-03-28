// ultra minimal version of jQuery
// needed to have Deferred code work
// (also look into import/src[-...].js for some transformations that help)
var toString = Function.prototype.call.bind( Object.prototype.toString ),
	indexOf = Function.prototype.call.bind( Array.prototype.indexOf ),
	r_cleanType = /^\[object |\]$/g,
	typeCache = {};

module.exports = {
	each: function( object, func ) {
		func = Function.prototype.call.bind( func );
		var length = object.length,
			key;
		if ( length === undefined || module.exports.type( object ) === "function" ) {
			for( key in object ) {
				func( object[ key ], key, object[ key ] );
			}
		} else {
			for ( key = 0; key < length; key++ ) {
				func( object[ key ], key, object[ key ] );
			}
		}
	},
	extend: function( target, src ) {
		if ( src ) {
			for( var key in src ) {
				target[ key ] = src[ key ];
			}
		}
		return target;
	},
	inArray: function( array, elem ) {
		return array ? indexOf( array, elem ) : -1;
	},
	noop: function() {},
	type: function( obj ) {
		var type = ( obj == null ? String : toString )( obj );
		return typeCache[ type ] || ( typeCache[ type ] = type.replace( r_cleanType, "" ).toLowerCase() );
	}
};
