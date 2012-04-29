var r_module = /^\s*module\(.*$/,
	r_stop = /(^|\b)stop\(\);/g,
	r_start = /(^|\b)start(\b|$)/g,
	r_test = /^(\s*)test\(([^,]+),.+$/,
	r_is_local = /if \( !isLocal \) \{(?:.|\n)+?\}/g,
	r_ops = /(^|\b)(deepEqual|equals?|expect|notDeepEqual|notStrictEqual|notEqual|ok|same|strictEqual|throws)\(/g,
	r_interesting = /Deferred|Callbacks|when/,
	fixTestMethod = {
		equals: "equal",
		same: "deepEqual"
	};

module.exports = function( code ) {
	code = code.split( "\n" );
	var output = [],
		end,
		endSpacing,
		skip,
		hasDone;
	code.forEach(function( line ) {
		var tmp;
		if ( !r_module.test( line ) ) {
			if ( line ) {
				line = line.replace( r_stop, "$1" )
					.replace( r_start, function( $0, $1, $2) {
						hasDone = true;
						return $1 + "______.done" + $2;
					});
				if ( !line.trim() ) {
					return;
				}
				if ( end && end.test( line ) ) {
					end = undefined;
					if ( skip ) {
						skip = false;
						return;
					}
					if ( !hasDone ) {
						output.push( "", endSpacing + "\t______.done();" );
					}
				} else if ( !skip ) {
					if (( tmp = r_test.exec( line ) )) {
						skip = !r_interesting.test( line );
						hasDone = false;
						end = new RegExp( "^" + (( endSpacing = tmp[ 1 ] )) + "}\\);$" );
						if ( !skip ) {
							line = tmp[ 1 ] + "exports[ " + tmp[ 2 ].trim() + " ] = (function( ______ ) {";
						}
					} else {
						line = line.replace( r_ops, function( _, space, method ) {
							return space + "______." + ( fixTestMethod[ method ] || method ) + "(";
						});
					}
				}
			}
			if ( !skip ) {
				output.push( line );
			}
		}
	});
	return "var Deferred = require( \"../lib/jquery-deferred\" ),\n	jQuery = require( \"../lib/jquery\" );\n\n"
		+ output.join( "\n" ).replace( r_is_local, "" ).trim() + "\n";
};
