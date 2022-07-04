(function() {
    'use strict';

    var exports = {};

    exports.toBytes = function(str) {
        var output = [];
        var len = str.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = str.charCodeAt(i);
        }
        return output;
    }
    exports.fromBytes = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = String.fromCharCode(arr[i]);
        }
        return output;
    }
    exports.toByteArray = function(str) {
        var output = [];
        var p = 0;
        var i = 0;
        var len = str.length;
        var c;
        for (i; i < len; i++) {
            c = str.charCodeAt(i);
            // NOTE: c <= 0xffff since JavaScript strings are UTF-16.
            if (c > 0xff) {
                output[p++] = c & 0xff;
                c >>= 8;
            }
            output[p++] = c;
        }
        return output;
    }
    exports.fromByteArray = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = String.fromCharCode(arr[i]);
        }
        return output;
    }
    exports.toArrayBuffer = function(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        var i = 0;
        var len = str.length;
        for (i; i < len; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
    exports.fromArrayBuffer = function(buf) {
        return new Uint16Array(buf).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, "");
    }
    exports.toBinary = function(str) {
        var output = [];
        var len = str.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = str.charCodeAt(i).toString(2);
        }
        return output;
    }
    exports.fromBinary = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = String.fromCharCode(parseInt(arr[i], 2));
        }
        return output;
    }
    exports.toHex = function(str) {
        var output = [];
        var len = str.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = str.charCodeAt(i).toString(16);
        }
        return output;
    }
    exports.fromHex = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = String.fromCharCode(parseInt(arr[i], 16));
        }
        return output;
    }

    exports.toDecimal = function(str) {
        var output = [];
        var len = str.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = str.charCodeAt(i);
        }
        return output;
    }
    exports.fromDecimal = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = String.fromCharCode(parseInt(arr[i], 10));
        }
        return output;
    }
    exports.toUTF8 = function(str) {
        var output = [];
        var i;
        var len = str.length;
        var ch;
        for (i = 0; i < len; i++) {
            ch = str.charCodeAt(i);
            if (ch < 0x80) {
                output.push(ch);
            } else if (ch < 0x800) {
                output.push(0xc0 | (ch >> 6)); 
                output.push(0x80 | (ch & 0x3f));
            } else if (ch < 0xd800 || ch >= 0xe000) {
                output.push(0xe0 | (ch >> 12));
                output.push(0x80 | ((ch>>6) & 0x3f));
                output.push(0x80 | (ch & 0x3f));
            } else {
                i++;
                ch = ((ch&0x3ff)<<10)|(str.charCodeAt(i)&0x3ff);
                output.push(0xf0 | (ch >>18));
                output.push(0x80 | ((ch>>12) & 0x3f));
                output.push(0x80 | ((ch>>6) & 0x3f));
                output.push(0x80 | (ch & 0x3f));
            }
        }
        return output;
    }
    exports.fromUTF8 = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        var n;
        var ch;
        for (i = 0; i < len; i++) {
            n = arr[i];
            if (n < 0x80) {
                output.push(String.fromCharCode(n));
            } else if (n > 0xBF && n < 0xE0) {
                output.push(String.fromCharCode((n & 0x1F) << 6 | arr[i + 1] & 0x3F));
                i += 1;
            } else if (n > 0xDF && n < 0xF0) {
                output.push(String.fromCharCode((n & 0x0F) << 12 | (arr[i + 1] & 0x3F) << 6 | arr[i + 2] & 0x3F));
                i += 2;
            } else {
                // surrogate pair
                ch = ((n & 0x07) << 18 | (arr[i + 1] & 0x3F) << 12 | (arr[i + 2] & 0x3F) << 6 | arr[i + 3] & 0x3F) - 0x010000;
                output.push(String.fromCharCode(ch >> 10 | 0xD800, ch & 0x03FF | 0xDC00));
                i += 3;
            }
        }
        return output;
    }
    exports.toUnicode = function(str) {
        var output = [];
        var i = 0;
        var len = str.length;
        for (i; i < len; i++) {
            // Assumption: all characters are < 0xffff
            output[i] = "\\u" + ("000" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return output;
    }
    exports.fromUnicode = function(arr) {
        var output = [];
        var len = arr.length;
        var i;
        for (i = 0; i < len; i++) {
            output[i] = String.fromCharCode(parseInt(arr[i].slice(-4), 16));
        }
        return output;
    }

    if (typeof(window.textEncoder) === "undefined") {
        window.textEncoder = exports;
    }
})();