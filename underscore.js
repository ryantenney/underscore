// Underscore.js
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the terms of the MIT license.
// Portions of Underscore are inspired by or borrowed from Prototype.js,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore

(function() {
  // ------------------------- Baseline setup ---------------------------------

  var

    // Establish the root object, "window" in the browser, or "global" on the server.
    root = this,

    // Save the previous value of the "_" variable.
    previousUnderscore = root._,

    // Establish the object that gets thrown to break out of a loop iteration.
    breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__',

    // Quick regexp-escaping function, because JS doesn't have RegExp.escape().
    escapeRegExp = function(s) { return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1'); },

    // Counter for _.uniqueId
    idCounter = 0,

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    templateSettings = {
      start       : '<%',
      end         : '%>',
      interpolate : /<%=(.+?)%>/g
    },

    // Save bytes in the minified (but not gzipped) version:
    _Array                = Array,
    _Object               = Object,

    ArrayProto            = _Array.prototype,
    ObjProto              = _Object.prototype,

    // Create quick reference variables for speed access to core prototypes.
    slice                 = ArrayProto.slice,
    unshift               = ArrayProto.unshift,
    toString              = ObjProto.toString,
    hasOwnProperty        = ObjProto.hasOwnProperty,
    propertyIsEnumerable  = ObjProto.propertyIsEnumerable,

    // All ECMA5 native implementations we hope to use are declared here.
    nativeForEach         = ArrayProto.forEach,
    nativeMap             = ArrayProto.map,
    nativeReduce          = ArrayProto.reduce,
    nativeReduceRight     = ArrayProto.reduceRight,
    nativeFilter          = ArrayProto.filter,
    nativeEvery           = ArrayProto.every,
    nativeSome            = ArrayProto.some,
    nativeIndexOf         = ArrayProto.indexOf,
    nativeLastIndexOf     = ArrayProto.lastIndexOf,

    isArray               = _Array.isArray || _isArray,
    keys                  = _Object.keys   || _keys,

    wrapper = function(obj, chain) { this.w = obj; this.c = !!chain; },
    wrapperProto = wrapper.prototype,

    // Create a safe reference to the Underscore object for use below.
    _ = function(obj) { return new wrapper(obj); },
    __ = function(obj) { return new wrapper(obj, 1); },

    // Current version.
    VERSION = '1.1.0';


  // Export the Underscore object for CommonJS.
  if (typeof exports !== 'undefined') {
    exports._  = _;
    exports.__ = __;
  }

  // Export underscore to global scope.
  root._  = _;
  root.__ = __;


  // ------------------------ Collection Functions: ---------------------------

  // The cornerstone, an each implementation.
  // Handles objects implementing forEach, arrays, and raw objects.
  // Delegates to JavaScript 1.6's native forEach if available.
  function each(obj, iterator, context) {
    try {
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (isNumber(obj.length)) {
        for (var i = 0, l = obj.length; i < l; i++) iterator.call(context, obj[i], i, obj);
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
        }
      }
    } catch(e) {
      if (e != breaker) throw e;
    }
    return obj;
  }

  // Return the results of applying the iterator to each element.
  // Delegates to JavaScript 1.6's native map if available.
  function map(obj, iterator, context) {
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    var results = [];
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  }

  // Reduce builds up a single result from a list of values, aka inject, or foldl.
  // Delegates to JavaScript 1.8's native reduce if available.
  function reduce(obj, iterator, memo, context) {
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = bind(iterator, context);
      return obj.reduce(iterator, memo);
    }
    each(obj, function(value, index, list) {
      memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  }

  // The right-associative version of reduce, also known as foldr. Uses
  // Delegates to JavaScript 1.8's native reduceRight if available.
  function reduceRight(obj, iterator, memo, context) {
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = bind(iterator, context);
      return obj.reduceRight(iterator, memo);
    }
    var reversed = clone(toArray(obj)).reverse();
    return reduce(reversed, iterator, memo, context);
  }

  // Return the first value which passes a truth test.
  function detect(obj, iterator, context) {
    var result;
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        breakLoop();
      }
    });
    return result;
  }

  // Return all the elements that pass a truth test.
  // Delegates to JavaScript 1.6's native filter if available.
  function filter(obj, iterator, context) {
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    var results = [];
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, iterator, context) {
    var results = [];
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  }

  // Determine whether all of the elements match a truth test.
  // Delegates to JavaScript 1.6's native every if available.
  function every(obj, iterator, context) {
    iterator = iterator || identity;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    var result = true;
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) breakLoop();
    });
    return result;
  }

  // Determine if at least one element in the object matches a truth test.
  // Delegates to JavaScript 1.6's native some if available.
  function some(obj, iterator, context) {
    iterator = iterator || identity;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    var result = false;
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) breakLoop();
    });
    return result;
  }

  // Determine if a given value is included in the array or object using '==='.
  function include(obj, target) {
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    var found = false;
    each(obj, function(value) {
      if (found = value === target) breakLoop();
    });
    return found;
  }

  // Invoke a method with arguments on every item in a collection.
  function invoke(obj, method) {
    var args = rest(arguments, 2);
    return map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  }

  // Convenience version of a common use case of map: fetching a property.
  function pluck(obj, key) {
    return map(obj, function(value){ return value[key]; });
  }

  // Return the maximum item or (item-based computation).
  function max(obj, iterator, context) {
    if (!iterator && isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iterator, context) {
    if (!iterator && isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  }

  // Sort the object's values by a criterion produced by an iterator.
  function sortBy(obj, iterator, context) {
    return pluck(map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  }

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  function sortedIndex (array, obj, iterator) {
    iterator = iterator || identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  }

  // Convert anything iterable into a real, live array.
  function toArray(iterable) {
    if (!iterable)              return [];
    if (iterable.toArray)       return iterable.toArray();
    if (isArray(iterable))      return iterable;
    if (isArguments(iterable))  return slice.call(iterable);
    return values(iterable);
  }

  // Return the number of elements in an object.
  function size(obj) {
    return toArray(obj).length;
  }

  // -------------------------- Array Functions: ------------------------------

  // Get the first element of an array. Passing "n" will return the first N
  // values in the array. Aliased as "head". The "guard" check allows it to work
  // with .map.
  function first(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  }

  // Returns everything but the first entry of the array. Aliased as "tail".
  // Especially useful on the arguments object. Passing an "index" will return
  // the rest of the values in the array from that index onward. The "guard"
   //check allows it to work with map.
  function rest(array, index, guard) {
    return slice.call(array, isUndefined(index) || guard ? 1 : index);
  }

  // Get the last element of an array.
  function last(array) {
    return array[array.length - 1];
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, function(value){ return !!value; });
  }

  // Return a completely flattened version of an array.
  function flatten(array) {
    return reduce(array, function(memo, value) {
      if (isArray(value)) return memo.concat(flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  }

  // Return a version of the array that does not contain the specified value(s).
  function without(array) {
    var values = rest(arguments);
    return filter(array, function(value){ return !include(values, value); });
  }

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  function uniq(array, isSorted) {
    return reduce(array, function(memo, el, i) {
      if (0 == i || (isSorted === true ? last(memo) != el : !include(memo, el))) memo[memo.length] = el;
      return memo;
    }, []);
  }

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersect(array) {
    var rest = rest(arguments);
    return filter(uniq(array), function(item) {
      return every(rest, function(other) {
        return indexOf(other, item) >= 0;
      });
    });
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  function zip() {
    var args = toArray(arguments);
    var length = max(pluck(args, 'length'));
    var results = new _Array(length);
    for (var i = 0; i < length; i++) results[i] = pluck(args, "" + i);
    return results;
  }

  // If the browser doesn't supply us with indexOf (I'm looking at you, MSIE),
  // we need this function. Return the position of the first occurence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to JavaScript 1.8's native indexOf if available.
  function indexOf(array, item) {
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (var i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  }


  // Delegates to JavaScript 1.6's native lastIndexOf if available.
  function lastIndexOf(array, item) {
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  }

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python range() function. See:
  // http://docs.python.org/library/functions.html#range
  function range(start, stop, step) {
    var a     = toArray(arguments);
    var solo  = a.length <= 1;
    var start = solo ? 0 : a[0], stop = solo ? a[0] : a[1], step = a[2] || 1;
    var len   = Math.ceil((stop - start) / step);
    if (len <= 0) return [];
    var range = new _Array(len);
    for (var i = start, idx = 0; true; i += step) {
      if ((step > 0 ? i - stop : stop - i) >= 0) return range;
      range[idx++] = i;
    }
  }

  // ----------------------- Function Functions: ------------------------------

  // Create a function bound to a given object (assigning 'this', and arguments,
  // optionally). Binding with arguments is also known as 'curry'.
  function bind(func, obj) {
    var args = rest(arguments, 2);
    return function() {
      return func.apply(obj || {}, args.concat(toArray(arguments)));
    };
  }

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  function bindAll(obj) {
    var funcs = rest(arguments);
    if (funcs.length == 0) funcs = functions(obj);
    each(funcs, function(f) { obj[f] = bind(obj[f], obj); });
    return obj;
  }

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memo = {};
    hasher = hasher || identity;
    return function() {
      var key = hasher.apply(this, arguments);
      return key in memo ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  function delay(func, wait) {
    var args = rest(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  }

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  function defer(func) {
    return delay.apply(_, [func, 1].concat(rest(arguments)));
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return function() {
      var args = [func].concat(toArray(arguments));
      return wrapper.apply(wrapper, args);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var funcs = toArray(arguments);
    return function() {
      var args = toArray(arguments), i = funcs.length;
      while (--i) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  }

  // ------------------------- Object Functions: ------------------------------

  // Retrieve the names of an object's properties.
  // Delegates to ECMA5's native Object.keys
  function _keys(obj) {
    if (isArray(obj)) return range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
    return keys;
  }

  // Retrieve the values of an object's properties.
  function values(obj) {
    return map(obj, identity);
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    return filter(keys(obj), function(key){ return isFunction(obj[key]); }).sort();
  }

  // Extend a given object with all the properties in passed-in object(s).
  function extend(obj) {
    each(rest(arguments), function(source) {
      for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (isArray(obj)) return obj.slice(0);
    return extend({}, obj);
  }

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_isNaN(a) && _isNaN(b)) return false;
    // Compare regular expressions.
    if (isRegExp(a) && isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = keys(a), bKeys = keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !isEqual(a[key], b[key])) return false;
    return true;
  }

  // Is a given array or object empty?
  function isEmpty(obj) {
    if (isArray(obj) || isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType == 1);
  }

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  function isArray(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);
  }

  // Is a given variable an arguments object?
  function isArguments(obj) {
    return !!(obj && obj.callee);
  }

  // Is a given value a function?
  function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  // Is a given value a string?
  function isString(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  }

  // Is a given value a number?
  function isNumber(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false;
  }

  // Is a given value a date?
  function isDate(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  }

  // Is the given value a regular expression?
  function isRegExp(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  }

  // Is the given value NaN -- this one is interesting. NaN != NaN, and
  // isNaN(undefined) == true, so we make sure it's a number first.
  function _isNaN(obj) {
    return isNumber(obj) && isNaN(obj);
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return typeof obj == 'undefined';
  }

  // -------------------------- Utility Functions: ----------------------------

  // Run Underscore.js in noConflict mode, returning the '_' variable to its
  // previous owner. Returns a reference to the Underscore object.
  function noConflict() {
    root._ = previousUnderscore;
    return this;
  }

  // Keep the identity function around for default iterators.
  function identity(value) {
    return value;
  }

  // Run a function n times.
  function times(n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  }

  // Break out of the middle of an iteration.
  function breakLoop() {
    throw breaker;
  }

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  function mixin(obj) {
    each(functions(obj), function(name){
      var func = _[name] = obj[name];
      wrapperProto[name] = function() {
        var args = toArray(arguments);
        unshift.call(args, this.w);
        return result(func.apply(_, args), this.c);
      };
    });
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  function uniqueId(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  }

  // JavaScript templating a-la ERB, pilfered from John Resig's
  // "Secrets of the JavaScript Ninja", page 83.
  // Single-quote fix from Rick Strahl's version.
  // With alterations for arbitrary delimiters, and to preserve whitespace.
  function template(str, data) {
    var
      endMatch = new RegExp("'(?=[^"+c.end.substr(0, 1)+"]*"+escapeRegExp(c.end)+")","g"),
      fn = new Function('obj',
      'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
        'with(obj||{}){__p.push(\'' +
        str.replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
          .replace(/\t/g, '\\t')
          .replace(endMatch,"✄")
          .split("'").join("\\'")
          .split("✄").join("'")
          .replace(c.interpolate, "',$1,'")
          .split(c.start).join("');")
          .split(c.end).join("__p.push('")
          + "');}return __p.join('');");
    return data ? fn(data) : fn;
  }

  // Add all of the Underscore functions to the wrapper object.
  mixin({
    each        : each,
      forEach   : each,
    map         : map,
    reduce      : reduce,
      inject    : reduce,
      foldl     : reduce,
    reduceRight : reduceRight,
      foldr     : reduceRight,
    detect      : detect,
    filter      : filter,
      select    : filter,
    reject      : reject,
    every       : every,
      all       : every,
    some        : some,
      any       : some,
    include     : include,
      contains  : include,
    invoke      : invoke,
    pluck       : pluck,
    max         : max,
    min         : min,
    sortBy      : sortBy,
    sortedIndex : sortedIndex,
    toArray     : toArray,
    size        : size,
    first        : first,
      head      : first,
    rest        : rest,
      tail      : rest,
    last        : last,
    compact     : compact,
    flatten     : flatten,
    without     : without,
    uniq        : uniq,
    intersect   : intersect,

    zip         : zip,
    indexOf     : indexOf,
    lastIndexOf : lastIndexOf,
    range       : range,
    bind        : bind,
    bindAll     : bindAll,
    memoize     : memoize,
    delay       : delay,
    defer       : defer,
    wrap        : wrap,
    compose     : compose,
    keys        : keys,
    values      : values,

    functions   : functions,
      methods   : functions,

    extend      : extend,
    clone       : clone,
    tap         : tap,
    isEqual     : isEqual,
    isEmpty     : isEmpty,
    isElement   : isElement,
    isArray     : isArray,
    isArguments : isArguments,
    isFunction  : isFunction,
    isString    : isString,
    isNumber    : isNumber,
    isBoolean   : isBoolean,
    isDate      : isDate,
    isRegExp    : isRegExp,
    isNaN       : _isNaN,
    isNull      : isNull,
    isUndefined : isUndefined,

    noConflict  : noConflict,
    identity    : identity,
    times       : times,
    breakLoop   : breakLoop,
    mixin       : mixin,
    uniqueId    : uniqueId,
    template    : template,

    VERSION     : VERSION,
    templateSettings : templateSettings
  });

  // Helper function to continue chaining intermediate results.
  function result(obj, chain) {
    return chain ? new wrapper(obj, 1) : obj;
  }

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapperProto[name] = function() {
      method.apply(this.w, arguments);
      return result(this.w, this.c);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapperProto[name] = function() {
      return result(method.apply(this.w, arguments), this.c);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapperProto.chain = function() {
    this.c = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapperProto.value = function() {
    return this.w;
  };

})();
