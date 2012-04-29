// ultra minimal version of jQuery
// needed to have Deferred code work
// (also look into import/src[-...].js for some transformations that help)
var toString = Function.prototype.call.bind( Object.prototype.toString ),
	r_cleanType = /^\[object |\]$/g,
	typeCache = {};

module.exports = {
	each: function( object, func ) {
		var key, value;
		if ( object[ "forEach" ] ) {
			object.forEach(function( value, id ) {
				func.call( value, id, value );
			});
		} else {
			for( key in object ) {
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
