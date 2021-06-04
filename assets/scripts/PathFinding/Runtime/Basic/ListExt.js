(function() {
    var p = Array.prototype

    function define(name, func) {
        if (p[name] != null) {
            return;
        }
        try {
            Object.defineProperty(p, name, {
                value: func,
                enumerable: false
            })
        } catch (e) {

        }
    }

    define("remove", function(value) {
        var index = this.indexOf(value)
        if (index != -1) {
            this.splice(index, 1)
        }
        return this;
    })
    define("sum", function(callback) {
        var sum = 0;
        for (var i = 0; i < this.length; i++) {
            var element = this[i];
            var value = callback(element)
            sum += value;
        }
        return sum;
    })
    define("pushList", function(array) {
        this.push(...array)
        return this;
    })
    define("unpack", function() {
        if (this[0] instanceof Array == false)
            return this;
        var a = this[0];
        for (var i = 1; i < this.length; i++) {
            a = a.concat(this[i]);
        }
        return a;
    })
    define("find", function(callback, thisArg) {
        for (var i = 1; i < this.length; i++) {
            var e = callback(this[i], i, this)
            if (typeof(e) == "undefined") {
                e = thisArg
            }
            if (!!e) {
                return this[i]
            }
        }
        return undefined
    })
    define("clear", function() {
        return this.length = 0
    })
})();