require( "plus" );

var fs = require( "fs" ),
	wrench = require( "wrench" );

fs.readFile( "./jquery/version.txt", function( err, version ) {

	if ( err ) {
		throw err;
	}

	version = ( "" + version ).trim();
	if ( version.split( "." ).length === 2 ) {
		version += ".0";
	}

	wrench.rmdirSyncRecursive( "./package", true );
	wrench.mkdirSyncRecursive( "./package/lib", 0777);
	wrench.mkdirSyncRecursive( "./package/test", 0777);

	var basename = require( "path").basename;
		imports = require( "./import/main" ),
		out = {
			jquery: "var jQuery = require( \"./jquery\" );\n"
		},
		src = version < "1.5.2" ? [ "core" ]
			: ( version < "1.7" ? [ "deferred" ] : [ "deferred", "callbacks" ] ),
		count = src.length,
		templateFiles = {
			"./package/package.json": function( code ) {
				return code.replace( "@VERSION@", version );
			},
			"./package/lib/jquery.js": function( code ) {
				return code;
			}
		};

	console.log( "Starting generation for jQuery " + version + " (" + src + ")" );

	templateFiles.forEach(function( filter, filename ) {
		fs.readFile( "./template/" + basename( filename ), function( err, data ) {
			if ( err ) {
				throw err;
			}
			fs.writeFile( filename, filter( "" + data ), function( err ) {
				if ( err ) {
					throw err;
				}
			});
		});
	});

	src.forEach(function( id ) {
		out[ id ] = undefined; // for proper ordering
		imports.unit( id, function( err ) {
			if ( err ) {
				throw err;
			}
		});
		imports.src( id, function( err, code ) {
			if ( err ) {
				throw err;
			}
			out[ id ] = code;
			if ( !( --count ) ) {
				require( "fs" ).writeFile( "./package/lib/jquery-deferred.js", out.join( "\n" ), function( err ) {
					if ( err ) {
						throw err;
					}
				});
			}
		});
	});
});

