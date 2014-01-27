jQuery Deferreds for nodejs
===========================
jQuery Deferreds source and unit tests ported verbatim to nodejs using minimal, automated, code transformation.

### Rationale

This is the exact same code, running the exact same unit tests. Why use a bad copy when you can use the original?

### Installation

* use npm: `npm install JQDeferred`
* or put JQDeferred as a dependency in `package.json`.

### Using

`var Deferred = require( "JQDeferred" );`

### Correspondences

| jQuery        | JQDeferred           |
| -------------:|:--------------------:|
| `$.Deferred`  | `Deferred`           |
| `$._Deferred` | `Deferred._Deferred` |
| `$.when`      | `Deferred.when`      |
| `$.Callbacks` | `Deferred.Callbacks` |

`_Deferred` only available prior to 1.7.0

`Callbacks` only available as of 1.7.0.

### Documentation

Just head to the [jQuery API site](http://api.jquery.com/):
* [`Deferred`](http://api.jquery.com/category/deferred-object/)
* [`Callbacks`](http://api.jquery.com/category/callbacks-object/)

### Versioning

There is an exact correspondence between the version of the package and the version of jQuery from which it has been extracted. So, if you want to use Deferreds as they were in jQuery 1.5.2, just use `npm install JQDeferred@1.5.2`.

Of course, this is not _really_ semantic versioning but it makes a lot more sense than maintaining a separate version.