(function(){var n=this,B=n._,r=typeof StopIteration!=="undefined"?StopIteration:"__break__",j=Array.prototype,l=Object.prototype,o=j.slice,C=j.unshift,D=l.toString,p=l.hasOwnProperty,s=j.forEach,t=j.map,u=j.reduce,v=j.reduceRight,w=j.filter,x=j.every,y=j.some,m=j.indexOf,z=j.lastIndexOf;l=Array.isArray;var E=Object.keys,b=function(a){return new k(a)};if(typeof exports!=="undefined")exports._=b;n._=b;b.VERSION="1.0.2";var i=b.forEach=function(a,c,d){try{if(s&&a.forEach===s)a.forEach(c,d);else if(b.isNumber(a.length))for(var e=
0,f=a.length;e<f;e++)c.call(d,a[e],e,a);else for(e in a)p.call(a,e)&&c.call(d,a[e],e,a)}catch(g){if(g!=r)throw g;}return a};b.map=function(a,c,d){if(t&&a.map===t)return a.map(c,d);var e=[];i(a,function(f,g,h){e.push(c.call(d,f,g,h))});return e};b.reduce=function(a,c,d,e){if(u&&a.reduce===u)return a.reduce(b.bind(d,e),c);i(a,function(f,g,h){c=d.call(e,c,f,g,h)});return c};b.reduceRight=function(a,c,d,e){if(v&&a.reduceRight===v)return a.reduceRight(b.bind(d,e),c);a=b.clone(b.toArray(a)).reverse();return b.reduce(a,
c,d,e)};b.detect=function(a,c,d){var e;i(a,function(f,g,h){if(c.call(d,f,g,h)){e=f;b.breakLoop()}});return e};b.filter=function(a,c,d){if(w&&a.filter===w)return a.filter(c,d);var e=[];i(a,function(f,g,h){c.call(d,f,g,h)&&e.push(f)});return e};b.reject=function(a,c,d){var e=[];i(a,function(f,g,h){!c.call(d,f,g,h)&&e.push(f)});return e};b.every=function(a,c,d){c=c||b.identity;if(x&&a.every===x)return a.every(c,d);var e=true;i(a,function(f,g,h){(e=e&&c.call(d,f,g,h))||b.breakLoop()});return e};b.some=
function(a,c,d){c=c||b.identity;if(y&&a.some===y)return a.some(c,d);var e=false;i(a,function(f,g,h){if(e=c.call(d,f,g,h))b.breakLoop()});return e};b.include=function(a,c){if(m&&a.indexOf===m)return a.indexOf(c)!=-1;var d=false;i(a,function(e){if(d=e===c)b.breakLoop()});return d};b.invoke=function(a,c){var d=b.rest(arguments,2);return b.map(a,function(e){return(c?e[c]:e).apply(e,d)})};b.pluck=function(a,c){return b.map(a,function(d){return d[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,
a);var e={computed:-Infinity};i(a,function(f,g,h){g=c?c.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};i(a,function(f,g,h){g=c?c.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(e,f,g){return{value:e,criteria:c.call(d,e,f,g)}}).sort(function(e,f){var g=e.criteria,h=f.criteria;return g<h?-1:g>h?
1:0}),"value")};b.sortedIndex=function(a,c,d){d=d||b.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?(e=g+1):(f=g)}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return a;if(b.isArguments(a))return o.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=function(a,c,d){return c&&!d?o.call(a,0,c):a[0]};b.rest=function(a,c,d){return o.call(a,b.isUndefined(c)||d?1:c)};b.last=function(a){return a[a.length-1]};
b.compact=function(a){return b.filter(a,function(c){return!!c})};b.flatten=function(a){return b.reduce(a,[],function(c,d){if(b.isArray(d))return c.concat(b.flatten(d));c.push(d);return c})};b.without=function(a){var c=b.rest(arguments);return b.filter(a,function(d){return!b.include(c,d)})};b.uniq=function(a,c){return b.reduce(a,[],function(d,e,f){if(0==f||(c===true?b.last(d)!=e:!b.include(d,e)))d.push(e);return d})};b.intersect=function(a){var c=b.rest(arguments);return b.filter(b.uniq(a),function(d){return b.every(c,
function(e){return b.indexOf(e,d)>=0})})};b.zip=function(){for(var a=b.toArray(arguments),c=b.max(b.pluck(a,"length")),d=new Array(c),e=0;e<c;e++)d[e]=b.pluck(a,String(e));return d};b.indexOf=function(a,c){if(m&&a.indexOf===m)return a.indexOf(c);for(var d=0,e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,c){if(z&&a.lastIndexOf===z)return a.lastIndexOf(c);for(var d=a.length;d--;)if(a[d]===c)return d;return-1};b.range=function(a,c,d){var e=b.toArray(arguments),f=e.length<=
1;a=f?0:e[0];c=f?e[0]:e[1];d=e[2]||1;e=Math.ceil((c-a)/d);if(e<=0)return[];e=new Array(e);f=a;for(var g=0;;f+=d){if((d>0?f-c:c-f)>=0)return e;e[g++]=f}};b.bind=function(a,c){var d=b.rest(arguments,2);return function(){return a.apply(c||{},d.concat(b.toArray(arguments)))}};b.bindAll=function(a){var c=b.rest(arguments);if(c.length==0)c=b.functions(a);i(c,function(d){a[d]=b.bind(a[d],a)});return a};b.delay=function(a,c){var d=b.rest(arguments,2);return setTimeout(function(){return a.apply(a,d)},c)};
b.defer=function(a){return b.delay.apply(b,[a,1].concat(b.rest(arguments)))};b.wrap=function(a,c){return function(){var d=[a].concat(b.toArray(arguments));return c.apply(c,d)}};b.compose=function(){var a=b.toArray(arguments);return function(){for(var c=b.toArray(arguments),d=a.length-1;d>=0;d--)c=[a[d].apply(this,c)];return c[0]}};b.keys=E||function(a){if(b.isArray(a))return b.range(0,a.length);var c=[];for(var d in a)p.call(a,d)&&c.push(d);return c};b.values=function(a){return b.map(a,b.identity)};
b.functions=function(a){return b.filter(b.keys(a),function(c){return b.isFunction(a[c])}).sort()};b.extend=function(a){i(b.rest(arguments),function(c){for(var d in c)a[d]=c[d]});return a};b.clone=function(a){if(b.isArray(a))return a.slice(0);return b.extend({},a)};b.tap=function(a,c){c(a);return a};b.isEqual=function(a,c,d){if(b.isUndefined(d))d=true;if(a===c)return true;var e=typeof a;if(d&&e!=typeof c)return false;if(a==c)return true;if(!a&&c||a&&!c)return false;if(a.isEqual)return a.isEqual(c);
if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!d;if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(e!=="object")return false;if(a.length&&a.length!==c.length)return false;e=b.keys(a);var f=b.keys(c);if(e.length!=f.length)return false;for(var g in a)if(!(g in c)||!b.isEqual(a[g],c[g],d))return false;return true};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===
0;for(var c in a)if(p.call(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=l||function(a){return!!(a&&a.concat&&a.unshift&&!a.callee)};b.isArguments=function(a){return a&&a.callee};b.isFunction=function(a){return!!(a&&a.constructor&&a.call&&a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return a===+a||D.call(a)==="[object Number]"};b.isBoolean=function(a){return a===true||a===false};b.isDate=function(a){return!!(a&&
a.getTimezoneOffset&&a.setUTCFullYear)};b.isRegExp=function(a){return!!(a&&a.test&&a.exec&&(a.ignoreCase||a.ignoreCase===false))};b.isNaN=function(a){return b.isNumber(a)&&isNaN(a)};b.isNull=function(a){return a===null};b.isUndefined=function(a){return typeof a=="undefined"};b.noConflict=function(){n._=B;return this};b.identity=function(a){return a};b.times=function(a,c,d){for(var e=0;e<a;e++)c.call(d,e)};b.breakLoop=function(){throw r;};b.mixin=function(a){i(b.functions(a),function(c){F(c,b[c]=a[c])})};
var G=0;b.uniqueId=function(a){var c=G++;return a?a+c:c};b.templateSettings={start:"<%",end:"%>",interpolate:/<%=(.+?)%>/g};var A={};b.template=function(a,c){var d;d=a.length;for(var e=0;--d;)e=(a.charCodeAt(d)+(e<<6)+(e<<16)-e)%Number.MAX_VALUE;d=e;e=A[d];if(!(b.isFunction(e)&&a===e._templateSource)){e=b.templateSettings;var f=new RegExp("'(?=[^"+e.end.substr(0,1)+"]*"+e.end.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1")+")","g");e=new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+
a.replace(/[\r\t\n]/g," ").replace(f,"\t").split("'").join("\\'").split("\t").join("'").replace(e.interpolate,"',$1,'").split(e.start).join("');").split(e.end).join("p.push('")+"');}return p.join('');");e._templateSource=a;A[d]=e}return c?e(c):e};b.each=b.forEach;b.foldl=b.inject=b.reduce;b.foldr=b.reduceRight;b.select=b.filter;b.all=b.every;b.any=b.some;b.head=b.first;b.tail=b.rest;b.methods=b.functions;var k=function(a){this._wrapped=a},q=function(a,c){return c?b(a).chain():a},F=function(a,c){k.prototype[a]=
function(){var d=b.toArray(arguments);C.call(d,this._wrapped);return q(c.apply(b,d),this._chain)}};b.mixin(b);i(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var c=j[a];k.prototype[a]=function(){c.apply(this._wrapped,arguments);return q(this._wrapped,this._chain)}});i(["concat","join","slice"],function(a){var c=j[a];k.prototype[a]=function(){return q(c.apply(this._wrapped,arguments),this._chain)}});k.prototype.chain=function(){this._chain=true;return this};k.prototype.value=
function(){return this._wrapped}})();
