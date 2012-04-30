require( "plus" );

var srcFilter = require( "./src" ),
	unitFilter = require( "./unit" );

function chain( fns ) {
	return fns.length === 1 ? fns[ 0 ] : function( input ) {
		fns.forEach(function( fn ) {
			input = fn( input );
		});
		return input;
	};
}

({
	src: {
		inputDir: "./jquery/src/",
		filter: [ srcFilter ]
	},
	unit: {
		inputDir: "./jquery/test/unit/",
		filter: [ srcFilter, unitFilter ]
	}
}).forEach(function( data, type ) {
	exports[ type ] =  function( id, callback ) {
		var fs =  require( "fs" ),
			filter = data.filter;
		try {
			filter = [ require( "./" + type + "_" + id ) ].concat( filter );
		} catch( e ) {}
		filter = chain( filter );
		fs.readFile( data.inputDir + id + ".js", function( err, code ) {
			if ( err ) {
				return callback && callback( err );
			}
			code = filter( "" + code ).trim() + "\n";
			callback && callback( undefined, code );
		});
	};
});
