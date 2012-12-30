var npmSearch = require('../');
var search = npmSearch(__dirname + '/npm.json');

var query = process.argv.slice(2).join(' ');
search(query, function (err, packages) {
    packages.forEach(function (pkg) {
        console.log(pkg.name);
    });
});
