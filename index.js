var start = +new Date();

require( "plus" );

var exec = require('child_process').exec;
var fs = require( "fs" );
var imports = require( "./import/main" );
var path = require( "path" );
var versions = require( "./versions" );
var wrench = require( "wrench" );

var adaptCommand = path.sep === "\\" ? function( expr ) {
	// Windows
	return expr.replace( /\//g, "\\" );
} : function( expr ) {
	// The rest of the free world
	return expr.replace( ".cmd", "" )
}

function fileForVersion( fileForVersion ) {
	var current;
	versions.forEach( function( version ) {
		if ( version in fileForVersion ) {
			current = fileForVersion[ version ] = fileForVersion[ version ].split( " " );
		} else {
			fileForVersion[ version ] = current;
		}
	} );
	return fileForVersion;
}

var sourceForVersion = fileForVersion( {
	"1.5": "core",
	"1.5.2": "deferred",
	"1.7": "deferred callbacks",
	"1.8.0": "core deferred callbacks",
	"1.11.0": "deferred callbacks",
	"2.0.0": "core deferred callbacks",
	"2.1.0": "deferred callbacks"
} );

var unitsForVersion = fileForVersion( {
	"1.5": "core",
	"1.5.2": "deferred",
	"1.7": "callbacks deferred"
} );

function throwOnError( func ) {
	return function( error, arg ) {
		if ( error ) {
			throw error;
		}
		if ( func ) {
			func( arg );
		}
	};
}

function throwOnCommandError( func, log ) {
	return function( error, stdout, stderr ) {
		if ( error ) {
			throw stderr || error;
		}
		if ( log ) {
			console.log( stdout );
		}
		func && func();
	}
}

function next() {

	if ( versions.length ) {

		var version = versions.shift();
		var fullVersion = version + ( version.length < 5 ? ".0" : "" );
		var packageDir = "./generated/" + fullVersion + "/";

		function test() {
			var nodeunit = adaptCommand( "node_modules/.bin/nodeunit.cmd " + packageDir + "test" );
			console.log( "\n" + nodeunit + "\n" );
			exec( nodeunit, throwOnCommandError( next, "log" ) );
		}

		console.log( "\n---- STARTING GENERATION for JQUERY " + version + " ----\n" );

		wrench.rmdirSyncRecursive( packageDir, true );
		wrench.mkdirSyncRecursive( packageDir + "lib", 0777);
		wrench.mkdirSyncRecursive( packageDir + "test", 0777);

		( {

			"template/package.json": function( code ) {
				return code.replace( "@VERSION@", fullVersion );
			},
			"template/jquery.js > lib/jquery.js": false,
			"README.md": false

		} ).forEach( function( filter, expression ) {
			expression = expression.split( /\s*>\s*/ );
			var source = expression[ 0 ];
			var target = expression[ 1 ] || path.basename( source );
			fs.readFile( source, throwOnError( function( data ) {
				data = data + "";
				fs.writeFile( path.join( packageDir, target ), filter ? filter( data ) : data, throwOnError );
			} ) );

		} );

		exec( "git checkout " + version, { cwd: "./jquery" }, throwOnCommandError( function() {

			var out = {
				jquery: "var jQuery = require( \"./jquery\" );\n"
			};
			var src = sourceForVersion[ version ];
			var units = unitsForVersion[ version ];
			var srcCount = src.length;
			var countBeforeTest = units.length + 1;

			var done = throwOnError( function() {
				if ( !( --countBeforeTest ) ) {
					test();
				}
			} );

			src.forEach( function( id ) {
				out[ id ] = undefined; // for proper ordering
				imports.src( id, throwOnError( function( code ) {
					out[ id ] = code;
					if ( !( --srcCount ) ) {
						fs.writeFile( packageDir + "lib/jquery-deferred.js", out.join( "\n" ), done );
					}
				} ) );
			} );

			units.forEach( function( id ) {
				imports.unit( id, throwOnError( function( code ) {
					fs.writeFile( packageDir + "test/" + id + ".js", code, done );
				} ) );
			} );

		} ) );

	} else {

		console.log( "\n---- FINISHED IN " + ( (new Date) - start ) * 0.001 + " sec ----\n" );

	}

}

fs.exists( "./jquery", function( exists ) {

	if ( exists ) {

		next();

	} else {

		console.log( "\n---- CLONING JQUERY REPOSITORY ----\n" );
		exec( "git clone git://github.com/jquery/jquery.git", throwOnCommandError( next, "log" ) );

	}

} );
