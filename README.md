jQuery deferreds for nodejs
===========================
jQuery deferreds source and unit tests ported verbatim to nodejs using minimal, automated, code transformation.

### Rationale

This is the exact same code, running the exact same unit tests. Why use a bad copy when you can use the original?

### Installation

* use npm: `npm install jquery-deferred`
* or put jquery-deferred as a dependency in `package.json`.

### Using

`var Deferred = require( "jquery-deferred" );`

### Correspondances

| jQuery        | jquery-deferred      |
| -------------:|:--------------------:|
| `$.Deferred`  | `Deferred`           |
| `$.when`      | `Deferred.when`      |
| `$.Callbacks` | `Deferred.Callbacks` |

`Callbacks` only available as of 1.7.0.

### Versioning

There is an exact correspondance between the version of the package and the version of jQuery from which it has been generated. So, if you want to use Deferreds as they were in jQuery 1.5.2, just use `npm install jquery-deferred@1.5.2`.

Of course, this is not _really_ semantic versioning but it makes a lot more sense than maintaining a separate version.