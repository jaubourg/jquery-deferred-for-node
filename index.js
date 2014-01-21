require( "plus" );

var fs = require( "fs" ),
	path = require( "path" ),
	wrench = require( "wrench" ),
	exec = require('child_process').exec,
	imports = require( "./import/main" ),
	versions = require( "./versions" ),

	isWindows = path.sep === "\\",
	testDirs = [],
	start = +new Date();

function pather( expr ) {
	return expr.replace( /\//g, path.sep );
}

function next() {

	if ( versions.length ) {

		var version = versions.shift(),
			fullVersion = version + ( version.length < 5 ? ".0" : "" ),
			packageDir = "./generated/" + fullVersion + "/";

		function test() {
			var nodeunit = pather( "node_modules/.bin/nodeunit" + ( isWindows ? ".cmd " : " " ) + packageDir + "test" );
			console.log( "\n" + nodeunit + "\n" );
			exec( nodeunit, function( error, stdout, stderr ) {
				if ( error ) {
					throw stderr;
				}
				console.log( stdout );
				next();
			});
		}

		console.log( "\n---- STARTING GENERATION for JQUERY " + version + " ----\n" );

		wrench.rmdirSyncRecursive( packageDir, true );
		wrench.mkdirSyncRecursive( packageDir + "lib", 0777);
		wrench.mkdirSyncRecursive( packageDir + "test", 0777);

		({
			"package.json": function( code ) {
				return code.replace( "@VERSION@", fullVersion );
			},
			"lib/jquery.js": function( code ) {
				return code;
			}
		}).forEach(function( filter, filename ) {
			fs.readFile( "./template/" + path.basename( filename ), function( err, data ) {
				if ( err ) {
					throw err;
				}
				fs.writeFile( packageDir + filename, filter( "" + data ), function( err ) {
					if ( err ) {
						throw err;
					}
				});
			});
		});

		exec( "git checkout " + version, { cwd: "./jquery" }, function( error, stdout, stderr ) {

			if ( error ) {
				throw stderr;
			}

			var out = {
					jquery: "var jQuery = require( \"./jquery\" );\n"
				},
				src = version < "1.5.2" ? [ "core" ]
					: ( version < "1.7" ? [ "deferred" ] :
						( version < "1.8" ? [ "deferred", "callbacks" ] : [ "core", "deferred", "callbacks" ] ) ),
				count = src.length,
				countNext = count + 1;

			src.forEach(function( id ) {
				out[ id ] = undefined; // for proper ordering
				if ( id === "core" && version >= "1.5.2" ) {
					// Let's filter out older stuff
					countNext--;
				} else {
					imports.unit( id, function( err, code ) {
						if ( err ) {
							throw err;
						}
						fs.writeFile( packageDir + "test/" + id + ".js", code, function( err ) {
							if ( err ) {
								throw err;
							}
							if ( !( --countNext ) ) {
								test();
							}
						});
					});
				}
				imports.src( id, function( err, code ) {
					if ( err ) {
						throw err;
					}
					out[ id ] = code;
					if ( !( --count ) ) {
						fs.writeFile( packageDir + "lib/jquery-deferred.js", out.join( "\n" ), function( err ) {
							if ( err ) {
								throw err;
							}
							if ( !( --countNext ) ) {
								test();
							}
						});
					}
				});
			});
		});
	} else {
		console.log( "\n---- FINISHED IN " + ( (new Date) - start ) * 0.001 + " sec ----\n" );
	}

}

fs.exists( "./jquery", function( exists ) {

	if ( exists ) {
		next();
	} else {
		console.log( "\n---- CLONING JQUERY REPOSITORY ----\n" );
		exec( "git clone git://github.com/jquery/jquery.git", function( error, stdout, stderr ) {

			if ( error ) {
				throw stderr;
			}

			console.log( stdout );

			next();
		});
	}

});
