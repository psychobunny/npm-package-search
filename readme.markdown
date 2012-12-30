# npm-package-search

search npm with a local synchronized package list

# example

``` js
var npmSearch = require('npm-package-search');
var search = npmSearch(__dirname + '/npm.json');

var query = process.argv.slice(2).join(' ');
search(query, function (err, packages) {
    packages.forEach(function (pkg) {
        console.log(pkg.name);
    });
});
```

The first time you run this example, it will take about as long as `npm search`
currently takes but then searches are fast:

```
$ time node example/search.js git push http
glog
pushover
github-push-receive
pushover-f
pushhub

real    0m0.694s
user    0m0.636s
sys 0m0.068s
```

# methods

``` js
var npmSearch = require('npm-package-search')
```

## var search = npmSearch(file, opts={})

Return a function `search(query, cb)` that you can use to search `file`.

If `opts.interval` is set, synchronize the package list at `file` with the npm
registry every `opts.interval` milliseconds.

If `opts.filter` is set, you can return a custom filter function to pass along
to the underlying
[npm-package-sync](https://github.com/substack/npm-package-sync) library.

## search(query, cb)

For a search string `query`, return matching packages in `cb(err, results)`.

## search.update(cb)

Synchronize with the npm registry. `cb` fires when the synchronization is
complete.

## search.close()

If `opts.interval` was specified, clear the update interval.

# install

With [npm](https://npmjs.org) do:

```
npm install npm-package-search
```

# license

MIT
