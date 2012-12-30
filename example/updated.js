var npmSearch = require('../');
var search = npmSearch(__dirname + '/npm.json');

var query = process.argv.slice(2).join(' ');
search(query, function (err, packages) {
    packages.forEach(function (pkg) {
        console.log(pkg.name);
    });
    
    search.update(function () {
        search(query, function (err, newPackages) {
            newPackages.forEach(function (pkg) {
                if (packages.indexOf(pkg) >= 0) return;
                console.log(pkg.name);
            });
        });
    });
});
