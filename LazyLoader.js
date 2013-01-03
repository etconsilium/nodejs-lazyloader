/**
 * @author http://habrahabr.ru/post/164665/
 * публичный репозиторий автора я не нашёл
 */
var fs = require('fs');
var path = require('path');

function getter(key, dir, file) {
    delete this[key];

    var fullPath = path.join(dir, file);
    try {
        require.resolve(fullPath);
    } catch (e) {
        if (fs.existsSync(fullPath)) {
            this[key] = new LazyLoader(path.join(dir, file));
        }
        return this[key];
    }

    this[key] = require(fullPath);
    return this[key];
}

function LazyLoader(dir) {

    var loader = this;

    if (!fs.existsSync(dir)) {
        return;
    }
    fs.readdirSync(dir).forEach(function(file) {
        var key = file.replace(/\.js$/, '');
        loader.__defineGetter__(key, getter.bind(loader, key, dir, file))
    });
}

module.exports = LazyLoader;
