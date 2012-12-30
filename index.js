var pkgSync = require('npm-package-sync');
var quotemeta = require('quotemeta');

module.exports = function (file, opts) {
    if (typeof file === 'object') {
        opts = file;
        file = opts.file;
    }
    if (!opts) opts = {};
    if (!opts.filter) opts.filter = function (pkg) {
        return {
            name: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords
        };
    };
    
    var queue = [];
    var sync = null;
    var ready = false;
    var iv;
    
    pkgSync(file, function (sync_) {
        if (f.closed) return;
        sync = f.sync = sync_;
        
        if (!sync.exists) sync.update(opts.filter);
        
        iv = opts.interval && setInterval(function () {
            sync.update(opts.filter);
        }, opts.interval);
        
        if (sync.packages.length) onsync()
        else sync.once('sync', onsync)
        
        function onsync () {
            if (f.closed) return;
            ready = true;
            queue.splice(0).forEach(function (f) { f() });
        }
    });
    
    var f = function (query, cb) {
        if (f.closed) return;
        if (!ready) queue.push(function () { f(query, cb) })
        else search(sync.packages, query, cb)
    };
    
    f.close = function () {
        f.closed = true;
        if (iv) clearInterval(iv);
    };
    
    f.update = function (cb) {
        if (f.closed) return;
        if (!ready) return queue.push(function () { f.update(cb) })
        
        if (cb) sync.once('sync', cb);
        sync.update(opts.filter)
    };
    
    return f;
};

function search (packages, query, cb) {
    var re;
    if (/^\//.test(query) && /\/$/.test(query)) {
        try {
            re = new RegExp(query)
        }
        catch (err) {
            return cb(err);
        }
    }
    else {
        re = {};
        var words = query.split(/\s+/).map(function (word) {
            return new RegExp(quotemeta(word));
        });
        re.test = function (s) {
            for (var i = 0; i < words.length; i++) {
                if (!words[i].test(s)) return false;
            }
            return true;
        };
    }
    
    cb(null, packages.filter(function (pkg) {
        return re.test(
            pkg.name + ' ' + pkg.description + ' ' + pkg.keywords
        );
    }));
}
