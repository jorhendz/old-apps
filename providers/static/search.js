(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Services$Success = function (a) {
	return {$: 'Success', a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Services$GotServiceCategories = function (a) {
	return {$: 'GotServiceCategories', a: a};
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$CategorizationModels$ServiceCategory = F2(
	function (id, name) {
		return {id: id, name: name};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Services$serviceCategoryDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$CategorizationModels$ServiceCategory,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $author$project$Services$getServiceCategories = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$Services$GotServiceCategories,
			$elm$json$Json$Decode$list($author$project$Services$serviceCategoryDecoder)),
		url: '/api/service-categories'
	});
var $author$project$Services$GotServices = function (a) {
	return {$: 'GotServices', a: a};
};
var $author$project$Services$BackendServiceObject = F7(
	function (category, priceType, priceValue, online, administration_included, transport_included, for_parents) {
		return {administration_included: administration_included, category: category, for_parents: for_parents, online: online, priceType: priceType, priceValue: priceValue, transport_included: transport_included};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map7 = _Json_map7;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Services$serviceDecoder = A8(
	$elm$json$Json$Decode$map7,
	$author$project$Services$BackendServiceObject,
	A2(
		$elm$json$Json$Decode$field,
		'category',
		$elm$json$Json$Decode$maybe($author$project$Services$serviceCategoryDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'price_type',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'price_value',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int)),
	A2(
		$elm$json$Json$Decode$field,
		'online',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$bool)),
	A2(
		$elm$json$Json$Decode$field,
		'administration_included',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$bool)),
	A2(
		$elm$json$Json$Decode$field,
		'transport_included',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$bool)),
	A2(
		$elm$json$Json$Decode$field,
		'for_parents',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$bool)));
var $author$project$Services$getServices = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$Services$GotServices,
			$elm$json$Json$Decode$list($author$project$Services$serviceDecoder)),
		url: '/api/services'
	});
var $author$project$Services$PriceUnknown = {$: 'PriceUnknown'};
var $author$project$Services$serviceInit = {administration_included: false, category: $elm$core$Maybe$Nothing, for_parents: false, online: false, price: $author$project$Services$PriceUnknown, transport_included: false};
var $author$project$Services$init = function (providerId) {
	return _Utils_Tuple2(
		$author$project$Services$Success(
			{
				categories: _List_fromArray(
					[
						{id: 1, name: 'Test 1'},
						{id: 2, name: 'Test 2'}
					]),
				providerId: providerId,
				services: _List_fromArray(
					[$author$project$Services$serviceInit, $author$project$Services$serviceInit])
			}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[$author$project$Services$getServiceCategories, $author$project$Services$getServices])));
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Services$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Services$DailyPriced = {$: 'DailyPriced'};
var $author$project$Services$PriceKnown = function (a) {
	return {$: 'PriceKnown', a: a};
};
var $author$project$Services$priceDaily = function (n) {
	return $author$project$Services$PriceKnown(
		{priceType: $author$project$Services$DailyPriced, priceValue: n});
};
var $author$project$Services$Free = {$: 'Free'};
var $author$project$Services$priceFree = $author$project$Services$PriceKnown(
	{priceType: $author$project$Services$Free, priceValue: 0});
var $author$project$Services$HourlyPriced = {$: 'HourlyPriced'};
var $author$project$Services$priceHourly = function (n) {
	return $author$project$Services$PriceKnown(
		{priceType: $author$project$Services$HourlyPriced, priceValue: n});
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Services$decodeBackendServiceObject = function (bso) {
	var value = function () {
		var _v1 = bso.priceValue;
		if (_v1.$ === 'Just') {
			var n = _v1.a;
			return n;
		} else {
			return 0;
		}
	}();
	var price = function () {
		var _v0 = bso.priceType;
		if (_v0.$ === 'Just') {
			switch (_v0.a) {
				case 'HOURLY':
					return $author$project$Services$priceHourly(value);
				case 'DAILY':
					return $author$project$Services$priceDaily(value);
				case 'FREE':
					return $author$project$Services$priceFree;
				default:
					return $author$project$Services$priceFree;
			}
		} else {
			return $author$project$Services$PriceUnknown;
		}
	}();
	return {
		administration_included: A2($elm$core$Maybe$withDefault, false, bso.administration_included),
		category: bso.category,
		for_parents: A2($elm$core$Maybe$withDefault, false, bso.for_parents),
		online: A2($elm$core$Maybe$withDefault, false, bso.online),
		price: price,
		transport_included: A2($elm$core$Maybe$withDefault, false, bso.transport_included)
	};
};
var $author$project$Services$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Services$fail = function (errorMessage) {
	return _Utils_Tuple2(
		$author$project$Services$Failure(errorMessage),
		$elm$core$Platform$Cmd$none);
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$list_extra$List$Extra$removeAt = F2(
	function (index, l) {
		if (index < 0) {
			return l;
		} else {
			var _v0 = A2($elm$core$List$drop, index, l);
			if (!_v0.b) {
				return l;
			} else {
				var rest = _v0.b;
				return _Utils_ap(
					A2($elm$core$List$take, index, l),
					rest);
			}
		}
	});
var $author$project$Services$GotResult = function (a) {
	return {$: 'GotResult', a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Services$encodeService = function (service) {
	var _v0 = service.category;
	if (_v0.$ === 'Just') {
		var category = _v0.a;
		return $elm$json$Json$Encode$object(
			_Utils_ap(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'id',
						$elm$json$Json$Encode$int(category.id)),
						_Utils_Tuple2(
						'online',
						$elm$json$Json$Encode$bool(service.online)),
						_Utils_Tuple2(
						'administration_included',
						$elm$json$Json$Encode$bool(service.administration_included)),
						_Utils_Tuple2(
						'transport_included',
						$elm$json$Json$Encode$bool(service.transport_included)),
						_Utils_Tuple2(
						'for_parents',
						$elm$json$Json$Encode$bool(service.for_parents))
					]),
				function () {
					var _v1 = service.price;
					if (_v1.$ === 'PriceUnknown') {
						return _List_fromArray(
							[
								_Utils_Tuple2('hourly_price', $elm$json$Json$Encode$null),
								_Utils_Tuple2('full_day_price', $elm$json$Json$Encode$null)
							]);
					} else {
						var r = _v1.a;
						return _List_fromArray(
							[
								_Utils_Tuple2(
								'hourly_price',
								_Utils_eq(r.priceType, $author$project$Services$HourlyPriced) ? $elm$json$Json$Encode$int(r.priceValue) : (_Utils_eq(r.priceType, $author$project$Services$Free) ? $elm$json$Json$Encode$int(0) : $elm$json$Json$Encode$null)),
								_Utils_Tuple2(
								'full_day_price',
								_Utils_eq(r.priceType, $author$project$Services$DailyPriced) ? $elm$json$Json$Encode$int(r.priceValue) : $elm$json$Json$Encode$null)
							]);
					}
				}()));
	} else {
		return $elm$json$Json$Encode$null;
	}
};
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{body: r.body, expect: r.expect, headers: _List_Nil, method: 'POST', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Services$submitServices = function (services) {
	return $elm$http$Http$post(
		{
			body: $elm$http$Http$jsonBody(
				A2($elm$json$Json$Encode$list, $author$project$Services$encodeService, services)),
			expect: A2($elm$http$Http$expectJson, $author$project$Services$GotResult, $elm$json$Json$Decode$string),
			url: '/api/set_services'
		});
};
var $elm_community$list_extra$List$Extra$updateAt = F3(
	function (index, fn, list) {
		if (index < 0) {
			return list;
		} else {
			var tail = A2($elm$core$List$drop, index, list);
			var head = A2($elm$core$List$take, index, list);
			if (tail.b) {
				var x = tail.a;
				var xs = tail.b;
				return _Utils_ap(
					head,
					A2(
						$elm$core$List$cons,
						fn(x),
						xs));
			} else {
				return list;
			}
		}
	});
var $author$project$Services$update = F2(
	function (msg, model) {
		if (model.$ === 'Failure') {
			var x = model.a;
			return $author$project$Services$fail(x);
		} else {
			var data = model.a;
			switch (msg.$) {
				case 'GotServiceCategories':
					var result = msg.a;
					if (result.$ === 'Err') {
						return $author$project$Services$fail('Failed to fetch service categories');
					} else {
						var scs = result.a;
						return _Utils_Tuple2(
							$author$project$Services$Success(
								_Utils_update(
									data,
									{categories: scs})),
							$elm$core$Platform$Cmd$none);
					}
				case 'AddEmptyService':
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{
									services: _Utils_ap(
										data.services,
										_List_fromArray(
											[$author$project$Services$serviceInit]))
								})),
						$elm$core$Platform$Cmd$none);
				case 'RemoveServiceByIndex':
					var index = msg.a;
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{
									services: A2($elm_community$list_extra$List$Extra$removeAt, index, data.services)
								})),
						$elm$core$Platform$Cmd$none);
				case 'SetPrice':
					var index = msg.a;
					var newPrice = msg.b;
					var updateService = function (service) {
						return _Utils_update(
							service,
							{price: newPrice});
					};
					var newServices = A3($elm_community$list_extra$List$Extra$updateAt, index, updateService, data.services);
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{services: newServices})),
						$author$project$Services$submitServices(newServices));
				case 'SetAdministrationValue':
					var index = msg.a;
					var newAdministrationValue = msg.b;
					var updateService = function (service) {
						return _Utils_update(
							service,
							{administration_included: newAdministrationValue});
					};
					var newServices = A3($elm_community$list_extra$List$Extra$updateAt, index, updateService, data.services);
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{services: newServices})),
						$author$project$Services$submitServices(newServices));
				case 'SetTransportValue':
					var index = msg.a;
					var newTransportValue = msg.b;
					var updateService = function (service) {
						return _Utils_update(
							service,
							{transport_included: newTransportValue});
					};
					var newServices = A3($elm_community$list_extra$List$Extra$updateAt, index, updateService, data.services);
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{services: newServices})),
						$author$project$Services$submitServices(newServices));
				case 'SetOnlineValue':
					var index = msg.a;
					var newOnlineValue = msg.b;
					var updateService = function (service) {
						return _Utils_update(
							service,
							{online: newOnlineValue});
					};
					var newServices = A3($elm_community$list_extra$List$Extra$updateAt, index, updateService, data.services);
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{services: newServices})),
						$author$project$Services$submitServices(newServices));
				case 'SetForParentsValue':
					var index = msg.a;
					var newForParentsValue = msg.b;
					var updateService = function (service) {
						return _Utils_update(
							service,
							{for_parents: newForParentsValue});
					};
					var newServices = A3($elm_community$list_extra$List$Extra$updateAt, index, updateService, data.services);
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{services: newServices})),
						$author$project$Services$submitServices(newServices));
				case 'SetCategory':
					var index = msg.a;
					var newCategory = msg.b;
					var updateCategory = function (service) {
						return _Utils_update(
							service,
							{
								category: $elm$core$Maybe$Just(newCategory)
							});
					};
					return _Utils_Tuple2(
						$author$project$Services$Success(
							_Utils_update(
								data,
								{
									services: A3($elm_community$list_extra$List$Extra$updateAt, index, updateCategory, data.services)
								})),
						$author$project$Services$submitServices(data.services));
				case 'Save':
					return _Utils_Tuple2(
						model,
						$author$project$Services$submitServices(data.services));
				case 'GotResult':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				default:
					var result = msg.a;
					if (result.$ === 'Err') {
						return $author$project$Services$fail('Failed to fetch current services');
					} else {
						var serviceObjects = result.a;
						return _Utils_Tuple2(
							$author$project$Services$Success(
								_Utils_update(
									data,
									{
										services: A2($elm$core$List$map, $author$project$Services$decodeBackendServiceObject, serviceObjects)
									})),
							$elm$core$Platform$Cmd$none);
					}
			}
		}
	});
var $author$project$Services$AddEmptyService = {$: 'AddEmptyService'};
var $author$project$Services$Save = {$: 'Save'};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$Services$contrastColor = 'rgb(202,235,228)';
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Services$primaryDarkColor = 'rgb(33,37,41)';
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Services$RemoveServiceByIndex = function (a) {
	return {$: 'RemoveServiceByIndex', a: a};
};
var $author$project$Services$SetAdministrationValue = F2(
	function (a, b) {
		return {$: 'SetAdministrationValue', a: a, b: b};
	});
var $author$project$Services$SetForParentsValue = F2(
	function (a, b) {
		return {$: 'SetForParentsValue', a: a, b: b};
	});
var $author$project$Services$SetOnlineValue = F2(
	function (a, b) {
		return {$: 'SetOnlineValue', a: a, b: b};
	});
var $author$project$Services$SetTransportValue = F2(
	function (a, b) {
		return {$: 'SetTransportValue', a: a, b: b};
	});
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$core$Basics$not = _Basics_not;
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Services$primaryColor = 'rgb(155, 214, 202)';
var $author$project$Services$secondaryColor = 'rgb(73,105,99)';
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Services$dropdown_ = F5(
	function (hasBackground, isSelected, id_, title, choices) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dropdown')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'false'),
							$elm$html$Html$Attributes$class('btn btn-default dropdown-toggle btn-block'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.75em'),
							A2(
							$elm$html$Html$Attributes$style,
							'background-color',
							isSelected ? (hasBackground ? $author$project$Services$secondaryColor : '#fff') : (hasBackground ? $author$project$Services$primaryColor : '#fff')),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2(
							$elm$html$Html$Attributes$style,
							'color',
							isSelected ? '#fff' : $author$project$Services$primaryDarkColor),
							A2($elm$html$Html$Attributes$style, 'overflow', 'inital'),
							A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'dropdown'),
							$elm$html$Html$Attributes$id(id_),
							hasBackground ? A2($elm$html$Html$Attributes$style, 'border-color', 'transparent') : A2($elm$html$Html$Attributes$style, 'border-color', '#B8B8B8'),
							$elm$html$Html$Attributes$type_('button')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'dropdownMenuButton1'),
							$elm$html$Html$Attributes$class('dropdown-menu'),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'inital'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2000000'),
							A2($elm$html$Html$Attributes$attribute, 'data-popper-placement', 'bottom-start')
						]),
					choices)
				]));
	});
var $author$project$Services$dropdown = A2($author$project$Services$dropdown_, true, false);
var $author$project$Services$dropdownSelected = A2($author$project$Services$dropdown_, true, true);
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Services$SetCategory = F2(
	function (a, b) {
		return {$: 'SetCategory', a: a, b: b};
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Services$viewServiceCategoryOption = F2(
	function (i, sc) {
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-item'),
							$elm$html$Html$Attributes$href('#'),
							$elm$html$Html$Events$onClick(
							A2($author$project$Services$SetCategory, i, sc))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(sc.name)
						]))
				]));
	});
var $author$project$Services$serviceCategoryDropdown = F3(
	function (index, categories, selectedCategory) {
		return _List_fromArray(
			[
				function () {
				if (selectedCategory.$ === 'Nothing') {
					return A3(
						$author$project$Services$dropdown,
						'Vælg...',
						'Vælg...',
						A2(
							$elm$core$List$map,
							$author$project$Services$viewServiceCategoryOption(index),
							A2(
								$elm$core$List$sortBy,
								function ($) {
									return $.name;
								},
								categories)));
				} else {
					var sc = selectedCategory.a;
					return A3(
						$author$project$Services$dropdownSelected,
						'Indsatser',
						sc.name,
						A2(
							$elm$core$List$map,
							$author$project$Services$viewServiceCategoryOption(index),
							A2(
								$elm$core$List$sortBy,
								function ($) {
									return $.name;
								},
								A2(
									$elm$core$List$filter,
									function (cat) {
										return !_Utils_eq(cat.name, sc.name);
									},
									categories))));
				}
			}()
			]);
	});
var $author$project$Services$serviceIsFree = function (service) {
	var _v0 = service.price;
	if (_v0.$ === 'PriceKnown') {
		var r = _v0.a;
		return _Utils_eq(r.priceType, $author$project$Services$Free);
	} else {
		return false;
	}
};
var $author$project$Services$SetPrice = F2(
	function (a, b) {
		return {$: 'SetPrice', a: a, b: b};
	});
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$Services$priceDropdown = F2(
	function (index, selectedPrice) {
		var showOption = function (option) {
			return A2(
				$elm$html$Html$li,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dropdown-item'),
								$elm$html$Html$Attributes$href('#'),
								$elm$html$Html$Events$onClick(
								A2($author$project$Services$SetPrice, index, option.value))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(option.name)
							]))
					]));
		};
		var currentPriceType = function () {
			if (selectedPrice.$ === 'PriceUnknown') {
				return 'Pris ikke oplyst';
			} else {
				var r = selectedPrice.a;
				var _v2 = r.priceType;
				switch (_v2.$) {
					case 'HourlyPriced':
						return 'Timepris';
					case 'DailyPriced':
						return 'Dagspris';
					default:
						return 'Gratis';
				}
			}
		}();
		var currentPriceInt = function () {
			if (selectedPrice.$ === 'PriceUnknown') {
				return $elm$core$Maybe$Nothing;
			} else {
				var r = selectedPrice.a;
				return $elm$core$Maybe$Just(r.priceValue);
			}
		}();
		var options = _List_fromArray(
			[
				{name: 'Gratis', value: $author$project$Services$priceFree},
				{
				name: 'Timepris',
				value: $author$project$Services$priceHourly(
					A2($elm$core$Maybe$withDefault, 0, currentPriceInt))
			},
				{
				name: 'Dagspris',
				value: $author$project$Services$priceDaily(
					A2($elm$core$Maybe$withDefault, 0, currentPriceInt))
			}
			]);
		return A3(
			$author$project$Services$dropdown,
			'choose',
			currentPriceType,
			A2($elm$core$List$map, showOption, options));
	});
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Services$viewPrice = F2(
	function (index, price) {
		var setPriceMsg = function (inputValue) {
			if (inputValue === '') {
				return price;
			} else {
				var _v2 = $elm$core$String$toInt(inputValue);
				if (_v2.$ === 'Just') {
					var n = _v2.a;
					if (price.$ === 'PriceKnown') {
						var r = price.a;
						var _v4 = r.priceType;
						switch (_v4.$) {
							case 'HourlyPriced':
								return $author$project$Services$priceHourly(n);
							case 'DailyPriced':
								return $author$project$Services$priceDaily(n);
							default:
								return $author$project$Services$priceFree;
						}
					} else {
						return $author$project$Services$PriceUnknown;
					}
				} else {
					return price;
				}
			}
		};
		if (price.$ === 'PriceUnknown') {
			return A2($author$project$Services$priceDropdown, index, price);
		} else {
			var r = price.a;
			var _v1 = r.priceType;
			switch (_v1.$) {
				case 'DailyPriced':
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$Services$priceDropdown, index, price),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (s) {
											return A2(
												$author$project$Services$SetPrice,
												index,
												setPriceMsg(s));
										}),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(r.priceValue)),
										A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.5em')
									]),
								_List_Nil),
								$elm$html$Html$text('/ dag')
							]));
				case 'HourlyPriced':
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$Services$priceDropdown, index, price),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (s) {
											return A2(
												$author$project$Services$SetPrice,
												index,
												setPriceMsg(s));
										}),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(r.priceValue)),
										A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.5em')
									]),
								_List_Nil),
								$elm$html$Html$text('/ time')
							]));
				default:
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$Services$priceDropdown, index, price)
							]));
			}
		}
	});
var $author$project$Services$viewService = F3(
	function (index, services, service) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '3em')
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn')
							]),
						A3($author$project$Services$serviceCategoryDropdown, index, services, service.category)),
						A2($author$project$Services$viewPrice, index, service.price),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(service.online),
										A2($elm$html$Html$Attributes$style, 'margin-top', '0.5em'),
										A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em'),
										$elm$html$Html$Events$onClick(
										A2($author$project$Services$SetOnlineValue, index, !service.online)),
										A2($elm$html$Html$Attributes$style, 'border-color', $author$project$Services$primaryDarkColor)
									]),
								_List_Nil),
								$elm$html$Html$text('Indsatsen tilbydes online')
							]))
					]),
				_Utils_ap(
					$author$project$Services$serviceIsFree(service) ? _List_Nil : _List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(service.administration_included),
											A2($elm$html$Html$Attributes$style, 'margin-top', '0.5em'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em'),
											$elm$html$Html$Events$onClick(
											A2($author$project$Services$SetAdministrationValue, index, !service.administration_included)),
											A2($elm$html$Html$Attributes$style, 'border-color', $author$project$Services$primaryDarkColor)
										]),
									_List_Nil),
									$elm$html$Html$text('Administration inkluderet i prisen')
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(service.transport_included),
											A2($elm$html$Html$Attributes$style, 'margin-top', '0.5em'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em'),
											$elm$html$Html$Events$onClick(
											A2($author$project$Services$SetTransportValue, index, !service.transport_included)),
											A2($elm$html$Html$Attributes$style, 'border-color', $author$project$Services$primaryDarkColor)
										]),
									_List_Nil),
									$elm$html$Html$text('Transport inkluderet i prisen')
								]))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(service.for_parents),
											A2($elm$html$Html$Attributes$style, 'margin-top', '0.5em'),
											A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em'),
											$elm$html$Html$Events$onClick(
											A2($author$project$Services$SetForParentsValue, index, !service.for_parents)),
											A2($elm$html$Html$Attributes$style, 'border-color', $author$project$Services$primaryDarkColor)
										]),
									_List_Nil),
									$elm$html$Html$text('Indsatsen er rettet mod forældre')
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn'),
											A2($elm$html$Html$Attributes$style, 'width', '100%'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '0.5em'),
											$elm$html$Html$Events$onClick(
											$author$project$Services$RemoveServiceByIndex(index)),
											A2($elm$html$Html$Attributes$style, 'border-color', $author$project$Services$primaryDarkColor)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Slet indsats')
										]))
								]))
						]))));
	});
var $author$project$Services$view = function (model) {
	if (model.$ === 'Failure') {
		var message = model.a;
		return $elm$html$Html$text(message);
	} else {
		var data = model.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('col')
				]),
			_Utils_ap(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, service) {
							return A3($author$project$Services$viewService, index, data.categories, service);
						}),
					data.services),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Services$AddEmptyService),
								$elm$html$Html$Attributes$class('btn'),
								A2($elm$html$Html$Attributes$style, 'width', '45%'),
								A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Services$contrastColor)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Tilføj indsats')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn'),
								A2($elm$html$Html$Attributes$style, 'width', '10%')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('')
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Services$Save),
								$elm$html$Html$Attributes$class('btn'),
								A2($elm$html$Html$Attributes$style, 'width', '45%'),
								A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Services$contrastColor),
								A2($elm$html$Html$Attributes$style, 'vertical-align', 'left'),
								$elm$html$Html$Attributes$href('/profile'),
								A2($elm$html$Html$Attributes$style, 'appearance', 'button')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', $author$project$Services$primaryDarkColor),
										A2($elm$html$Html$Attributes$style, 'text-decoration', 'none')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Gem og tilbage')
									]))
							]))
					])));
	}
};
var $author$project$Services$main = $elm$browser$Browser$element(
	{init: $author$project$Services$init, subscriptions: $author$project$Services$subscriptions, update: $author$project$Services$update, view: $author$project$Services$view});
var $author$project$Search$CategorizationModelsMsg = function (a) {
	return {$: 'CategorizationModelsMsg', a: a};
};
var $author$project$Search$FreeTextLabel = function (a) {
	return {$: 'FreeTextLabel', a: a};
};
var $author$project$Search$Loading = {$: 'Loading'};
var $author$project$Search$Page = function (a) {
	return {$: 'Page', a: a};
};
var $author$project$CategorizationModels$emptyCategorizationModels = {areas: _List_Nil, creditations: _List_Nil, languages: _List_Nil, postalCodes: _List_Nil, regions: _List_Nil, serviceCategories: _List_Nil, themes: _List_Nil};
var $author$project$Search$FreeLabel = {$: 'FreeLabel'};
var $author$project$Search$InternalLabel = {$: 'InternalLabel'};
var $author$project$Search$WaitingTimeLabel = {$: 'WaitingTimeLabel'};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Search$getCreditationFromLabel = function (label) {
	if (label.$ === 'CreditationLabel') {
		var cred = label.a;
		return $elm$core$Maybe$Just(cred);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$getFreeTextFromLabel = function (label) {
	if (label.$ === 'FreeTextLabel') {
		var s = label.a;
		return $elm$core$Maybe$Just(s);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$getGenderFromLabel = function (label) {
	if (label.$ === 'GenderLabel') {
		var g = label.a;
		return $elm$core$Maybe$Just(g);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $gribouille$elm_prelude$Prelude$Maybe$catMaybes = $elm$core$List$filterMap($elm$core$Basics$identity);
var $gribouille$elm_prelude$Prelude$Maybe$mapMaybe = F2(
	function (f, x) {
		return $gribouille$elm_prelude$Prelude$Maybe$catMaybes(
			A2($elm$core$List$map, f, x));
	});
var $author$project$Search$getGenderFromLabels = function (labels) {
	var genders = A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getGenderFromLabel, labels);
	return $elm$core$List$head(genders);
};
var $author$project$Search$getLanguageFromLabel = function (label) {
	if (label.$ === 'LanguageLabel') {
		var lang = label.a;
		return $elm$core$Maybe$Just(lang);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$getLocationFromLabel = function (label) {
	if (label.$ === 'LocationLabel') {
		var loc = label.a;
		return $elm$core$Maybe$Just(loc);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$getLocationsFromLabels = function (labels) {
	return A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getLocationFromLabel, labels);
};
var $author$project$Search$getServiceCategoryFromLabel = function (label) {
	if (label.$ === 'ServiceCategoryLabel') {
		var sc = label.a;
		return $elm$core$Maybe$Just(sc);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$getServiceCategoryFromLabels = function (labels) {
	var categories = A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getServiceCategoryFromLabel, labels);
	return $elm$core$List$head(categories);
};
var $author$project$Search$getThemeFromLabel = function (label) {
	if (label.$ === 'ThemeLabel') {
		var theme = label.a;
		return $elm$core$Maybe$Just(theme);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$isFreeTextLabel = function (label) {
	if (label.$ === 'FreeTextLabel') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Search$generateQuery = F2(
	function (page, labels) {
		var themes = A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getThemeFromLabel, labels);
		return {
			creditations: A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getCreditationFromLabel, labels),
			free: A2($elm$core$List$member, $author$project$Search$FreeLabel, labels),
			freeText: A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$andThen,
					$author$project$Search$getFreeTextFromLabel,
					$elm$core$List$head(
						A2($elm$core$List$filter, $author$project$Search$isFreeTextLabel, labels)))),
			gender: $author$project$Search$getGenderFromLabels(labels),
			internal: A2($elm$core$List$member, $author$project$Search$InternalLabel, labels),
			languages: A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getLanguageFromLabel, labels),
			locations: $author$project$Search$getLocationsFromLabels(labels),
			noWaitingTime: A2($elm$core$List$member, $author$project$Search$WaitingTimeLabel, labels),
			page: page,
			serviceCategory: $author$project$Search$getServiceCategoryFromLabels(labels),
			themes: themes
		};
	});
var $author$project$CategorizationModels$GotAreas = function (a) {
	return {$: 'GotAreas', a: a};
};
var $author$project$CategorizationModels$Area = F2(
	function (id, name) {
		return {id: id, name: name};
	});
var $author$project$CategorizationModels$areaDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$CategorizationModels$Area,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $author$project$CategorizationModels$getAreas = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotAreas,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$areaDecoder)),
		url: '/api/areas'
	});
var $author$project$CategorizationModels$GotCreditations = function (a) {
	return {$: 'GotCreditations', a: a};
};
var $author$project$CategorizationModels$Creditation = F2(
	function (id, name) {
		return {id: id, name: name};
	});
var $author$project$CategorizationModels$creditationDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$CategorizationModels$Creditation,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $author$project$CategorizationModels$getCreditations = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotCreditations,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$creditationDecoder)),
		url: '/api/creditations'
	});
var $author$project$CategorizationModels$GotLanguages = function (a) {
	return {$: 'GotLanguages', a: a};
};
var $author$project$CategorizationModels$Language = F2(
	function (id, name) {
		return {id: id, name: name};
	});
var $author$project$CategorizationModels$languageDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$CategorizationModels$Language,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $author$project$CategorizationModels$getLanguages = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotLanguages,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$languageDecoder)),
		url: '/api/languages'
	});
var $author$project$CategorizationModels$GotPostalCodes = function (a) {
	return {$: 'GotPostalCodes', a: a};
};
var $author$project$CategorizationModels$PostalCode = F3(
	function (id, name, number) {
		return {id: id, name: name, number: number};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$CategorizationModels$postalCodeDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$CategorizationModels$PostalCode,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'number', $elm$json$Json$Decode$int));
var $author$project$CategorizationModels$getPostalCodes = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotPostalCodes,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$postalCodeDecoder)),
		url: '/api/postal-codes'
	});
var $author$project$CategorizationModels$GotRegions = function (a) {
	return {$: 'GotRegions', a: a};
};
var $author$project$CategorizationModels$Region = F2(
	function (id, name) {
		return {id: id, name: name};
	});
var $author$project$CategorizationModels$regionDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$CategorizationModels$Region,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $author$project$CategorizationModels$getRegions = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotRegions,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$regionDecoder)),
		url: '/api/regions'
	});
var $author$project$CategorizationModels$GotServiceCategories = function (a) {
	return {$: 'GotServiceCategories', a: a};
};
var $author$project$CategorizationModels$serviceCategoryDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$CategorizationModels$ServiceCategory,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $author$project$CategorizationModels$getServiceCategories = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotServiceCategories,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$serviceCategoryDecoder)),
		url: '/api/service-categories'
	});
var $author$project$CategorizationModels$GotThemes = function (a) {
	return {$: 'GotThemes', a: a};
};
var $author$project$CategorizationModels$Theme = F3(
	function (id, name, theme_type) {
		return {id: id, name: name, theme_type: theme_type};
	});
var $author$project$CategorizationModels$MentalType = {$: 'MentalType'};
var $author$project$CategorizationModels$PhysicalType = {$: 'PhysicalType'};
var $author$project$CategorizationModels$SocialType = {$: 'SocialType'};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$CategorizationModels$themeTypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Socialt':
				return $elm$json$Json$Decode$succeed($author$project$CategorizationModels$SocialType);
			case 'Fysisk':
				return $elm$json$Json$Decode$succeed($author$project$CategorizationModels$PhysicalType);
			case 'Psykisk':
				return $elm$json$Json$Decode$succeed($author$project$CategorizationModels$MentalType);
			default:
				var somethingElse = str;
				return $elm$json$Json$Decode$fail('Unknown theme type: ' + somethingElse);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$CategorizationModels$themeDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$CategorizationModels$Theme,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'theme_type', $author$project$CategorizationModels$themeTypeDecoder));
var $author$project$CategorizationModels$getThemes = $elm$http$Http$get(
	{
		expect: A2(
			$elm$http$Http$expectJson,
			$author$project$CategorizationModels$GotThemes,
			$elm$json$Json$Decode$list($author$project$CategorizationModels$themeDecoder)),
		url: '/api/themes/'
	});
var $author$project$CategorizationModels$getCategorizationModels = $elm$core$Platform$Cmd$batch(
	_List_fromArray(
		[$author$project$CategorizationModels$getPostalCodes, $author$project$CategorizationModels$getThemes, $author$project$CategorizationModels$getLanguages, $author$project$CategorizationModels$getRegions, $author$project$CategorizationModels$getServiceCategories, $author$project$CategorizationModels$getAreas, $author$project$CategorizationModels$getCreditations]));
var $author$project$Search$GotProviders = F2(
	function (a, b) {
		return {$: 'GotProviders', a: a, b: b};
	});
var $author$project$Search$Provider = function (id) {
	return function (name) {
		return function (contactName) {
			return function (contactPhone) {
				return function (price) {
					return function (contactPostalCode) {
						return function (isOnline) {
							return function (isTransportIncluded) {
								return function (isAdministrationIncluded) {
									return function (isForParents) {
										return function (isInternal) {
											return function (membership) {
												return {contactName: contactName, contactPhone: contactPhone, contactPostalCode: contactPostalCode, id: id, isAdministrationIncluded: isAdministrationIncluded, isForParents: isForParents, isInternal: isInternal, isOnline: isOnline, isTransportIncluded: isTransportIncluded, membership: membership, name: name, price: price};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm_community$json_extra$Json$Decode$Extra$andMap = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $author$project$Search$providerDecoder = A2(
	$elm_community$json_extra$Json$Decode$Extra$andMap,
	A2($elm$json$Json$Decode$field, 'membership', $elm$json$Json$Decode$int),
	A2(
		$elm_community$json_extra$Json$Decode$Extra$andMap,
		A2($elm$json$Json$Decode$field, 'is_internal', $elm$json$Json$Decode$bool),
		A2(
			$elm_community$json_extra$Json$Decode$Extra$andMap,
			A2($elm$json$Json$Decode$field, 'is_for_parents', $elm$json$Json$Decode$bool),
			A2(
				$elm_community$json_extra$Json$Decode$Extra$andMap,
				A2($elm$json$Json$Decode$field, 'is_administration_included', $elm$json$Json$Decode$bool),
				A2(
					$elm_community$json_extra$Json$Decode$Extra$andMap,
					A2($elm$json$Json$Decode$field, 'is_transport_included', $elm$json$Json$Decode$bool),
					A2(
						$elm_community$json_extra$Json$Decode$Extra$andMap,
						A2($elm$json$Json$Decode$field, 'is_online', $elm$json$Json$Decode$bool),
						A2(
							$elm_community$json_extra$Json$Decode$Extra$andMap,
							A2(
								$elm$json$Json$Decode$field,
								'contact_postal_code',
								$elm$json$Json$Decode$maybe($elm$json$Json$Decode$int)),
							A2(
								$elm_community$json_extra$Json$Decode$Extra$andMap,
								A2(
									$elm$json$Json$Decode$field,
									'price_string',
									$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
								A2(
									$elm_community$json_extra$Json$Decode$Extra$andMap,
									A2(
										$elm$json$Json$Decode$field,
										'contact_phone',
										$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
									A2(
										$elm_community$json_extra$Json$Decode$Extra$andMap,
										A2(
											$elm$json$Json$Decode$field,
											'contact_name',
											$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
										A2(
											$elm_community$json_extra$Json$Decode$Extra$andMap,
											A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
											A2(
												$elm_community$json_extra$Json$Decode$Extra$andMap,
												A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
												$elm$json$Json$Decode$succeed($author$project$Search$Provider)))))))))))));
var $author$project$Search$Boys = {$: 'Boys'};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $author$project$Search$getAreaFromLocation = function (location) {
	if (location.$ === 'LocationArea') {
		var area = location.a;
		return $elm$core$Maybe$Just(area);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Search$getPostalCodeFromLocation = function (location) {
	if (location.$ === 'LocationPostalCode') {
		var pc = location.a;
		return $elm$core$Maybe$Just(pc);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 'QueryParameter', a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$int = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$core$String$fromInt(value));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$Search$queryUrl = function (query) {
	var postalCodes = A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getPostalCodeFromLocation, query.locations);
	var areas = A2($gribouille$elm_prelude$Prelude$Maybe$mapMaybe, $author$project$Search$getAreaFromLocation, query.locations);
	return A2(
		$elm$url$Url$Builder$absolute,
		_List_fromArray(
			['api', 'providers']),
		_Utils_ap(
			_List_Nil,
			_Utils_ap(
				A2(
					$elm$core$List$map,
					function (t) {
						return A2($elm$url$Url$Builder$int, 'theme_ids', t.id);
					},
					query.themes),
				_Utils_ap(
					A2(
						$elm$core$List$map,
						function (l) {
							return A2($elm$url$Url$Builder$int, 'language_ids', l.id);
						},
						query.languages),
					_Utils_ap(
						A2(
							$elm$core$List$map,
							function (l) {
								return A2($elm$url$Url$Builder$int, 'area_ids', l.id);
							},
							areas),
						_Utils_ap(
							A2(
								$elm$core$List$map,
								function (c) {
									return A2($elm$url$Url$Builder$int, 'creditation_ids', c.id);
								},
								query.creditations),
							_Utils_ap(
								A2(
									$elm$core$List$map,
									function (l) {
										return A2($elm$url$Url$Builder$int, 'postal_code_ids', l.id);
									},
									postalCodes),
								_Utils_ap(
									query.noWaitingTime ? _List_fromArray(
										[
											A2($elm$url$Url$Builder$string, 'misc', 'NOWAITING')
										]) : _List_Nil,
									_Utils_ap(
										query.free ? _List_fromArray(
											[
												A2($elm$url$Url$Builder$string, 'misc', 'VOLUNTEER')
											]) : _List_Nil,
										_Utils_ap(
											query.internal ? _List_fromArray(
												[
													A2($elm$url$Url$Builder$string, 'misc', 'INTERNAL')
												]) : _List_Nil,
											_Utils_ap(
												(!(query.freeText === '')) ? _List_fromArray(
													[
														A2($elm$url$Url$Builder$string, 'freetext', query.freeText)
													]) : _List_Nil,
												_Utils_ap(
													_Utils_ap(
														A2(
															$elm$core$Maybe$withDefault,
															_List_Nil,
															A2(
																$elm$core$Maybe$map,
																function (g) {
																	return _List_fromArray(
																		[
																			A2(
																			$elm$url$Url$Builder$string,
																			'gender',
																			_Utils_eq(g, $author$project$Search$Boys) ? 'BOYS' : 'GIRLS')
																		]);
																},
																query.gender)),
														$gribouille$elm_prelude$Prelude$Maybe$catMaybes(
															_List_fromArray(
																[
																	A2(
																	$elm$core$Maybe$map,
																	function (sc) {
																		return A2($elm$url$Url$Builder$int, 'service_category_id', sc.id);
																	},
																	query.serviceCategory)
																]))),
													_List_fromArray(
														[
															A2($elm$url$Url$Builder$int, 'page', query.page)
														])))))))))))));
};
var $author$project$Search$getProviders = function (query) {
	var msg = $author$project$Search$GotProviders(query.page);
	return $elm$http$Http$get(
		{
			expect: A2(
				$elm$http$Http$expectJson,
				msg,
				$elm$json$Json$Decode$list($author$project$Search$providerDecoder)),
			url: $author$project$Search$queryUrl(query)
		});
};
var $kirchner$elm_selectize$Selectize$Selectize$LDivider = function (a) {
	return {$: 'LDivider', a: a};
};
var $kirchner$elm_selectize$Selectize$Selectize$LEntry = F2(
	function (a, b) {
		return {$: 'LEntry', a: a, b: b};
	});
var $kirchner$elm_selectize$Selectize$Selectize$closed = F3(
	function (id, toLabel, entries) {
		var addLabel = function (e) {
			if (e.$ === 'Entry') {
				var a = e.a;
				return A2(
					$kirchner$elm_selectize$Selectize$Selectize$LEntry,
					a,
					toLabel(a));
			} else {
				var text = e.a;
				return $kirchner$elm_selectize$Selectize$Selectize$LDivider(text);
			}
		};
		var labeledEntries = A2($elm$core$List$map, addLabel, entries);
		return {entries: labeledEntries, entryHeights: _List_Nil, id: id, menuHeight: 0, mouseFocus: $elm$core$Maybe$Nothing, open: false, preventBlur: false, query: '', scrollTop: 0, zipList: $elm$core$Maybe$Nothing};
	});
var $kirchner$elm_selectize$Selectize$closed = F3(
	function (id, toLabel, entries) {
		return A3($kirchner$elm_selectize$Selectize$Selectize$closed, id, toLabel, entries);
	});
var $kirchner$elm_selectize$Selectize$Selectize$Entry = function (a) {
	return {$: 'Entry', a: a};
};
var $kirchner$elm_selectize$Selectize$Selectize$entry = function (a) {
	return $kirchner$elm_selectize$Selectize$Selectize$Entry(a);
};
var $kirchner$elm_selectize$Selectize$entry = function (a) {
	return $kirchner$elm_selectize$Selectize$Selectize$entry(a);
};
var $author$project$LocationPicker$locationString = function (loc) {
	if (loc.$ === 'LocationPostalCode') {
		var pc = loc.a;
		return $elm$core$String$fromInt(pc.number) + (' - ' + pc.name);
	} else {
		var area = loc.a;
		return area.name;
	}
};
var $author$project$LocationPicker$locationId = $author$project$LocationPicker$locationString;
var $author$project$LocationPicker$init = function (locations) {
	return _Utils_Tuple2(
		{
			locations: locations,
			textfieldMenu: A3(
				$kirchner$elm_selectize$Selectize$closed,
				'textfield-menu',
				$elm$core$Basics$identity,
				A2(
					$elm$core$List$map,
					A2($elm$core$Basics$composeR, $author$project$LocationPicker$locationId, $kirchner$elm_selectize$Selectize$entry),
					locations)),
			textfieldSelection: $elm$core$Maybe$Nothing
		},
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Search$init = function (freeTextQuery) {
	var initialLabels = function () {
		if (freeTextQuery === '') {
			return _List_Nil;
		} else {
			var s = freeTextQuery;
			return _List_fromArray(
				[
					$author$project$Search$FreeTextLabel(s)
				]);
		}
	}();
	return _Utils_Tuple2(
		$author$project$Search$Page(
			{
				categorizations: $author$project$CategorizationModels$emptyCategorizationModels,
				freeTextQuery: '',
				labels: initialLabels,
				loadedPage: 0,
				locationPicker: $author$project$LocationPicker$init(_List_Nil).a,
				sorting: $elm$core$Maybe$Nothing,
				state: $author$project$Search$Loading
			}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					A2($elm$core$Platform$Cmd$map, $author$project$Search$CategorizationModelsMsg, $author$project$CategorizationModels$getCategorizationModels),
					$author$project$Search$getProviders(
					A2($author$project$Search$generateQuery, 0, initialLabels))
				])));
};
var $author$project$Search$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Search$Failure = {$: 'Failure'};
var $author$project$Search$Loaded = function (a) {
	return {$: 'Loaded', a: a};
};
var $author$project$Search$LoadingAnotherPage = function (a) {
	return {$: 'LoadingAnotherPage', a: a};
};
var $author$project$Search$LocationLabel = function (a) {
	return {$: 'LocationLabel', a: a};
};
var $author$project$Search$LocationPickerMsg = function (a) {
	return {$: 'LocationPickerMsg', a: a};
};
var $author$project$Search$SortNameAsc = {$: 'SortNameAsc'};
var $author$project$Search$SortNameDesc = {$: 'SortNameDesc'};
var $author$project$Search$SortPostalCodeAsc = {$: 'SortPostalCodeAsc'};
var $author$project$Search$SortPostalCodeDesc = {$: 'SortPostalCodeDesc'};
var $author$project$Search$SortPrice = {$: 'SortPrice'};
var $author$project$Search$currentProviders = function (state) {
	switch (state.$) {
		case 'Loading':
			return _List_Nil;
		case 'Loaded':
			var providers = state.a;
			return providers;
		default:
			var providers = state.a;
			return providers;
	}
};
var $author$project$Search$uniqueIdentifier = function (label) {
	switch (label.$) {
		case 'ThemeLabel':
			var theme = label.a;
			return 'theme-' + $elm$core$String$fromInt(theme.id);
		case 'LanguageLabel':
			var lang = label.a;
			return 'lang-' + $elm$core$String$fromInt(lang.id);
		case 'CreditationLabel':
			var cred = label.a;
			return 'cred-' + $elm$core$String$fromInt(cred.id);
		case 'ServiceCategoryLabel':
			var sc = label.a;
			return 'sc-' + $elm$core$String$fromInt(sc.id);
		case 'WaitingTimeLabel':
			return 'nowait';
		case 'InternalLabel':
			return 'internal';
		case 'FreeLabel':
			return 'free';
		case 'AgeLabel':
			var age = label.a;
			return 'age' + $elm$core$String$fromInt(age);
		case 'GenderLabel':
			var g = label.a;
			if (g.$ === 'Boys') {
				return 'gender-boys';
			} else {
				return 'gender-girls';
			}
		case 'RegionLabel':
			var r = label.a;
			return 'region-' + $elm$core$String$fromInt(r.id);
		case 'LocationLabel':
			var loc = label.a;
			if (loc.$ === 'LocationPostalCode') {
				var pc = loc.a;
				return $elm$core$String$fromInt(pc.number) + (' - ' + pc.name);
			} else {
				var area = loc.a;
				return area.name;
			}
		default:
			var s = label.a;
			return 'freetext-' + s;
	}
};
var $author$project$Search$labelsEqual = F2(
	function (labelA, labelB) {
		return _Utils_eq(
			$author$project$Search$uniqueIdentifier(labelA),
			$author$project$Search$uniqueIdentifier(labelB));
	});
var $author$project$LocationPicker$LocationArea = function (a) {
	return {$: 'LocationArea', a: a};
};
var $author$project$LocationPicker$LocationPostalCode = function (a) {
	return {$: 'LocationPostalCode', a: a};
};
var $author$project$LocationPicker$locationList = F2(
	function (postalCodes, areas) {
		return _Utils_ap(
			A2($elm$core$List$map, $author$project$LocationPicker$LocationArea, areas),
			A2($elm$core$List$map, $author$project$LocationPicker$LocationPostalCode, postalCodes));
	});
var $author$project$Search$isAgeLabel = function (label) {
	if (label.$ === 'AgeLabel') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Search$isGenderLabel = function (label) {
	if (label.$ === 'GenderLabel') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Search$isServiceCategoryLabel = function (label) {
	if (label.$ === 'ServiceCategoryLabel') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Search$reviseLabels = F2(
	function (newLabel, allLabels) {
		var labels = A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Search$labelsEqual(newLabel),
				$elm$core$Basics$not),
			allLabels);
		switch (newLabel.$) {
			case 'ServiceCategoryLabel':
				return _Utils_ap(
					A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeR, $author$project$Search$isServiceCategoryLabel, $elm$core$Basics$not),
						labels),
					_List_fromArray(
						[newLabel]));
			case 'GenderLabel':
				return _Utils_ap(
					A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeR, $author$project$Search$isGenderLabel, $elm$core$Basics$not),
						labels),
					_List_fromArray(
						[newLabel]));
			case 'AgeLabel':
				return _Utils_ap(
					A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeR, $author$project$Search$isAgeLabel, $elm$core$Basics$not),
						labels),
					_List_fromArray(
						[newLabel]));
			case 'FreeTextLabel':
				return _Utils_ap(
					A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeR, $author$project$Search$isFreeTextLabel, $elm$core$Basics$not),
						labels),
					_List_fromArray(
						[newLabel]));
			default:
				return _Utils_ap(
					labels,
					_List_fromArray(
						[newLabel]));
		}
	});
var $author$project$Search$sortByPostalCode = F2(
	function (fst, snd) {
		return (_Utils_cmp(
			A2($elm$core$Maybe$withDefault, 0, fst.contactPostalCode),
			A2($elm$core$Maybe$withDefault, 0, snd.contactPostalCode)) < 1) ? $elm$core$Basics$GT : $elm$core$Basics$LT;
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Search$makePriceToInt = function (string) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$String$toInt(
			A2(
				$elm$core$Maybe$withDefault,
				'0',
				$elm$core$List$head(
					A2($elm$core$String$split, ' ', string)))));
};
var $author$project$Search$sortByPrice = F2(
	function (fst, snd) {
		return (A2($elm$core$Maybe$withDefault, '', fst.price) === 'Gratis') ? $elm$core$Basics$LT : ((A2($elm$core$Maybe$withDefault, '', snd.price) === 'Gratis') ? $elm$core$Basics$GT : ((A2($elm$core$Maybe$withDefault, '', fst.price) === 'Kontakt for pris') ? $elm$core$Basics$GT : ((A2($elm$core$Maybe$withDefault, '', snd.price) === 'Kontakt for pris') ? $elm$core$Basics$LT : ((_Utils_cmp(
			$author$project$Search$makePriceToInt(
				A2($elm$core$Maybe$withDefault, '', fst.price)),
			$author$project$Search$makePriceToInt(
				A2($elm$core$Maybe$withDefault, '', snd.price))) > -1) ? $elm$core$Basics$GT : $elm$core$Basics$LT))));
	});
var $elm$core$List$sortWith = _List_sortWith;
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $author$project$CategorizationModels$update = F2(
	function (msg, models) {
		switch (msg.$) {
			case 'GotThemes':
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (themes) {
						return _Utils_update(
							models,
							{themes: themes});
					},
					result);
			case 'GotPostalCodes':
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (pcs) {
						return _Utils_update(
							models,
							{postalCodes: pcs});
					},
					result);
			case 'GotRegions':
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (regions) {
						return _Utils_update(
							models,
							{regions: regions});
					},
					result);
			case 'GotServiceCategories':
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (scs) {
						return _Utils_update(
							models,
							{serviceCategories: scs});
					},
					result);
			case 'GotAreas':
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (areas) {
						return _Utils_update(
							models,
							{areas: areas});
					},
					result);
			case 'GotLanguages':
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (langs) {
						return _Utils_update(
							models,
							{languages: langs});
					},
					result);
			default:
				var result = msg.a;
				return A2(
					$elm$core$Result$map,
					function (creds) {
						return _Utils_update(
							models,
							{creditations: creds});
					},
					result);
		}
	});
var $author$project$LocationPicker$SelectTextfieldLicense = function (a) {
	return {$: 'SelectTextfieldLicense', a: a};
};
var $author$project$LocationPicker$TextfieldMenuMsg = function (a) {
	return {$: 'TextfieldMenuMsg', a: a};
};
var $author$project$LocationPicker$andDo = F2(
	function (cmd2, _v0) {
		var model = _v0.model;
		var cmd = _v0.cmd;
		var chosenLocation = _v0.chosenLocation;
		return {
			chosenLocation: chosenLocation,
			cmd: $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[cmd, cmd2])),
			model: model
		};
	});
var $author$project$LocationPicker$getLocation = F2(
	function (locations, query) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$author$project$LocationPicker$locationId,
					function (x) {
						return _Utils_eq(x, query);
					}),
				locations));
	});
var $kirchner$elm_selectize$Selectize$Selectize$NoOp = {$: 'NoOp'};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$browser$Browser$Dom$blur = _Browser_call('blur');
var $kirchner$elm_selectize$Selectize$Selectize$textfieldId = function (id) {
	return id + '__textfield';
};
var $kirchner$elm_selectize$Selectize$Selectize$blur = function (id) {
	return A2(
		$elm$core$Task$attempt,
		function (_v0) {
			return $kirchner$elm_selectize$Selectize$Selectize$NoOp;
		},
		$elm$browser$Browser$Dom$blur(
			$kirchner$elm_selectize$Selectize$Selectize$textfieldId(id)));
};
var $kirchner$elm_selectize$Selectize$Selectize$currentEntry = function (_v0) {
	var current = _v0.current;
	if (current.a.$ === 'Entry') {
		var a = current.a.a;
		return $elm$core$Maybe$Just(a);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $kirchner$elm_selectize$Selectize$Selectize$focus = function (id) {
	return A2(
		$elm$core$Task$attempt,
		function (_v0) {
			return $kirchner$elm_selectize$Selectize$Selectize$NoOp;
		},
		$elm$browser$Browser$Dom$focus(
			$kirchner$elm_selectize$Selectize$Selectize$textfieldId(id)));
};
var $kirchner$elm_selectize$Selectize$Selectize$Divider = function (a) {
	return {$: 'Divider', a: a};
};
var $kirchner$elm_selectize$Selectize$Selectize$removeLabel = function (labeledEntry) {
	if (labeledEntry.$ === 'LEntry') {
		var a = labeledEntry.a;
		return $kirchner$elm_selectize$Selectize$Selectize$Entry(a);
	} else {
		var text = labeledEntry.a;
		return $kirchner$elm_selectize$Selectize$Selectize$Divider(text);
	}
};
var $kirchner$elm_selectize$Selectize$Selectize$zipHelper = F3(
	function (listA, listB, sum) {
		zipHelper:
		while (true) {
			var _v0 = _Utils_Tuple2(listA, listB);
			if (_v0.a.b && _v0.b.b) {
				var _v1 = _v0.a;
				var a = _v1.a;
				var restA = _v1.b;
				var _v2 = _v0.b;
				var b = _v2.a;
				var restB = _v2.b;
				var $temp$listA = restA,
					$temp$listB = restB,
					$temp$sum = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(a, b),
					sum);
				listA = $temp$listA;
				listB = $temp$listB;
				sum = $temp$sum;
				continue zipHelper;
			} else {
				return sum;
			}
		}
	});
var $kirchner$elm_selectize$Selectize$Selectize$zip = F2(
	function (listA, listB) {
		return $elm$core$List$reverse(
			A3($kirchner$elm_selectize$Selectize$Selectize$zipHelper, listA, listB, _List_Nil));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $kirchner$elm_selectize$Selectize$Selectize$zipFirst = function (zipList) {
	var front = zipList.front;
	var current = zipList.current;
	var back = zipList.back;
	var currentTop = zipList.currentTop;
	if (current.a.$ === 'Divider') {
		if (!back.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var next = back.a;
			var rest = back.b;
			return $kirchner$elm_selectize$Selectize$Selectize$zipFirst(
				{
					back: rest,
					current: next,
					currentTop: currentTop + current.b,
					front: A2($elm$core$List$cons, current, front)
				});
		}
	} else {
		return $elm$core$Maybe$Just(zipList);
	}
};
var $kirchner$elm_selectize$Selectize$Selectize$fromList = F2(
	function (entries, entryHeights) {
		var _v0 = _Utils_Tuple2(
			A2($elm$core$List$map, $kirchner$elm_selectize$Selectize$Selectize$removeLabel, entries),
			entryHeights);
		if (_v0.a.b && _v0.b.b) {
			var _v1 = _v0.a;
			var firstEntry = _v1.a;
			var restEntries = _v1.b;
			var _v2 = _v0.b;
			var firstHeight = _v2.a;
			var restHeights = _v2.b;
			return $kirchner$elm_selectize$Selectize$Selectize$zipFirst(
				{
					back: A2($kirchner$elm_selectize$Selectize$Selectize$zip, restEntries, restHeights),
					current: _Utils_Tuple2(firstEntry, firstHeight),
					currentTop: 0,
					front: _List_Nil
				});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$toLower = _String_toLower;
var $kirchner$elm_selectize$Selectize$Selectize$contains = F2(
	function (query, label) {
		return A2(
			$elm$core$String$contains,
			$elm$core$String$toLower(query),
			$elm$core$String$toLower(label));
	});
var $kirchner$elm_selectize$Selectize$Selectize$fromListWithFilter = F3(
	function (query, entries, entryHeights) {
		var filtered = A2(
			$elm$core$List$filterMap,
			function (_v1) {
				var e = _v1.a;
				var height = _v1.b;
				if (e.$ === 'LEntry') {
					var a = e.a;
					var label = e.b;
					return A2($kirchner$elm_selectize$Selectize$Selectize$contains, query, label) ? $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$kirchner$elm_selectize$Selectize$Selectize$Entry(a),
							height)) : $elm$core$Maybe$Nothing;
				} else {
					var text = e.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$kirchner$elm_selectize$Selectize$Selectize$Divider(text),
							height));
				}
			},
			A2($kirchner$elm_selectize$Selectize$Selectize$zip, entries, entryHeights));
		if (filtered.b) {
			var first = filtered.a;
			var rest = filtered.b;
			return $kirchner$elm_selectize$Selectize$Selectize$zipFirst(
				{back: rest, current: first, currentTop: 0, front: _List_Nil});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $kirchner$elm_selectize$Selectize$Selectize$zipNext = function (zipList) {
	var front = zipList.front;
	var current = zipList.current;
	var back = zipList.back;
	var currentTop = zipList.currentTop;
	if (!back.b) {
		return zipList;
	} else {
		var next = back.a;
		var rest = back.b;
		return A2(
			$elm$core$Maybe$withDefault,
			zipList,
			$kirchner$elm_selectize$Selectize$Selectize$zipFirst(
				{
					back: rest,
					current: next,
					currentTop: currentTop + current.b,
					front: A2($elm$core$List$cons, current, front)
				}));
	}
};
var $kirchner$elm_selectize$Selectize$Selectize$moveForwardToHelper = F2(
	function (a, zipList) {
		if (_Utils_eq(
			zipList.current.a,
			$kirchner$elm_selectize$Selectize$Selectize$Entry(a))) {
			return $elm$core$Maybe$Just(zipList);
		} else {
			var _v0 = zipList.back;
			if (!_v0.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				return A2(
					$kirchner$elm_selectize$Selectize$Selectize$moveForwardToHelper,
					a,
					$kirchner$elm_selectize$Selectize$Selectize$zipNext(zipList));
			}
		}
	});
var $kirchner$elm_selectize$Selectize$Selectize$moveForwardTo = F2(
	function (a, zipList) {
		return A2(
			$elm$core$Maybe$withDefault,
			zipList,
			A2($kirchner$elm_selectize$Selectize$Selectize$moveForwardToHelper, a, zipList));
	});
var $kirchner$elm_selectize$Selectize$Selectize$reset = function (state) {
	return _Utils_update(
		state,
		{mouseFocus: $elm$core$Maybe$Nothing, open: false, query: '', zipList: $elm$core$Maybe$Nothing});
};
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $kirchner$elm_selectize$Selectize$Selectize$menuId = function (id) {
	return id + '__menu';
};
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $kirchner$elm_selectize$Selectize$Selectize$scroll = F2(
	function (id, y) {
		return A2(
			$elm$core$Task$attempt,
			function (_v0) {
				return $kirchner$elm_selectize$Selectize$Selectize$NoOp;
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					var viewport = _v1.viewport;
					return A3(
						$elm$browser$Browser$Dom$setViewportOf,
						$kirchner$elm_selectize$Selectize$Selectize$menuId(id),
						viewport.x,
						y);
				},
				$elm$browser$Browser$Dom$getViewportOf(
					$kirchner$elm_selectize$Selectize$Selectize$menuId(id))));
	});
var $kirchner$elm_selectize$Selectize$Selectize$zipCurrentHeight = function (_v0) {
	var current = _v0.current;
	return current.b;
};
var $kirchner$elm_selectize$Selectize$Selectize$scrollToKeyboardFocus = F3(
	function (id, scrollTop, _v0) {
		var state = _v0.a;
		var cmd = _v0.b;
		var maybeMsg = _v0.c;
		var _v1 = state.zipList;
		if (_v1.$ === 'Just') {
			var zipList = _v1.a;
			var top = zipList.currentTop;
			var height = $kirchner$elm_selectize$Selectize$Selectize$zipCurrentHeight(zipList);
			var y = (_Utils_cmp(top, scrollTop) < 0) ? top : ((_Utils_cmp(top + height, scrollTop + state.menuHeight) > 0) ? ((top + height) - state.menuHeight) : scrollTop);
			return _Utils_Tuple3(
				state,
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A2($kirchner$elm_selectize$Selectize$Selectize$scroll, id, y),
							cmd
						])),
				maybeMsg);
		} else {
			return _Utils_Tuple3(state, cmd, maybeMsg);
		}
	});
var $kirchner$elm_selectize$Selectize$Selectize$selectFirst = F2(
	function (entries, a) {
		selectFirst:
		while (true) {
			if (!entries.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = entries.a;
				var rest = entries.b;
				if (first.$ === 'LEntry') {
					var value = first.a;
					var label = first.b;
					if (_Utils_eq(a, value)) {
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(a, label));
					} else {
						var $temp$entries = rest,
							$temp$a = a;
						entries = $temp$entries;
						a = $temp$a;
						continue selectFirst;
					}
				} else {
					var $temp$entries = rest,
						$temp$a = a;
					entries = $temp$entries;
					a = $temp$a;
					continue selectFirst;
				}
			}
		}
	});
var $kirchner$elm_selectize$Selectize$Selectize$zipReverseFirst = function (zipList) {
	var front = zipList.front;
	var current = zipList.current;
	var back = zipList.back;
	var currentTop = zipList.currentTop;
	if (current.a.$ === 'Divider') {
		if (!front.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var previous = front.a;
			var rest = front.b;
			return $kirchner$elm_selectize$Selectize$Selectize$zipReverseFirst(
				{
					back: A2($elm$core$List$cons, current, back),
					current: previous,
					currentTop: currentTop - previous.b,
					front: rest
				});
		}
	} else {
		return $elm$core$Maybe$Just(zipList);
	}
};
var $kirchner$elm_selectize$Selectize$Selectize$zipPrevious = function (zipList) {
	var front = zipList.front;
	var current = zipList.current;
	var back = zipList.back;
	var currentTop = zipList.currentTop;
	if (!front.b) {
		return zipList;
	} else {
		var previous = front.a;
		var rest = front.b;
		return A2(
			$elm$core$Maybe$withDefault,
			zipList,
			$kirchner$elm_selectize$Selectize$Selectize$zipReverseFirst(
				{
					back: A2($elm$core$List$cons, current, back),
					current: previous,
					currentTop: currentTop - previous.b,
					front: rest
				}));
	}
};
var $kirchner$elm_selectize$Selectize$Selectize$updateKeyboardFocus = F3(
	function (select, movement, state) {
		var newZipList = function () {
			switch (movement.$) {
				case 'Up':
					return A2($elm$core$Maybe$map, $kirchner$elm_selectize$Selectize$Selectize$zipPrevious, state.zipList);
				case 'Down':
					return A2($elm$core$Maybe$map, $kirchner$elm_selectize$Selectize$Selectize$zipNext, state.zipList);
				default:
					return state.zipList;
			}
		}();
		return _Utils_Tuple3(
			_Utils_update(
				state,
				{zipList: newZipList}),
			$elm$core$Platform$Cmd$none,
			$elm$core$Maybe$Just(
				select($elm$core$Maybe$Nothing)));
	});
var $kirchner$elm_selectize$Selectize$Selectize$update = F4(
	function (select, maybeSelection, state, msg) {
		switch (msg.$) {
			case 'NoOp':
				return _Utils_Tuple3(state, $elm$core$Platform$Cmd$none, $elm$core$Maybe$Nothing);
			case 'OpenMenu':
				var heights = msg.a;
				var scrollTop = msg.b;
				var newZipList = A2(
					$elm$core$Maybe$map,
					function () {
						if (maybeSelection.$ === 'Just') {
							var a = maybeSelection.a;
							return $kirchner$elm_selectize$Selectize$Selectize$moveForwardTo(a);
						} else {
							return $elm$core$Basics$identity;
						}
					}(),
					A2($kirchner$elm_selectize$Selectize$Selectize$fromList, state.entries, heights.entries));
				var top = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.currentTop;
						},
						newZipList));
				var height = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm$core$Maybe$map, $kirchner$elm_selectize$Selectize$Selectize$zipCurrentHeight, newZipList));
				return _Utils_Tuple3(
					_Utils_update(
						state,
						{entryHeights: heights.entries, menuHeight: heights.menu, mouseFocus: $elm$core$Maybe$Nothing, open: true, query: '', scrollTop: scrollTop, zipList: newZipList}),
					A2($kirchner$elm_selectize$Selectize$Selectize$scroll, state.id, top - ((heights.menu - height) / 2)),
					$elm$core$Maybe$Nothing);
			case 'CloseMenu':
				return state.preventBlur ? _Utils_Tuple3(state, $elm$core$Platform$Cmd$none, $elm$core$Maybe$Nothing) : _Utils_Tuple3(
					$kirchner$elm_selectize$Selectize$Selectize$reset(state),
					$elm$core$Platform$Cmd$none,
					$elm$core$Maybe$Nothing);
			case 'FocusTextfield':
				return _Utils_Tuple3(
					state,
					$kirchner$elm_selectize$Selectize$Selectize$focus(state.id),
					$elm$core$Maybe$Nothing);
			case 'BlurTextfield':
				return _Utils_Tuple3(
					state,
					$kirchner$elm_selectize$Selectize$Selectize$blur(state.id),
					$elm$core$Maybe$Nothing);
			case 'PreventClosing':
				var preventBlur = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						state,
						{preventBlur: preventBlur}),
					$elm$core$Platform$Cmd$none,
					$elm$core$Maybe$Nothing);
			case 'SetQuery':
				var newQuery = msg.a;
				var newZipList = A3($kirchner$elm_selectize$Selectize$Selectize$fromListWithFilter, newQuery, state.entries, state.entryHeights);
				return _Utils_Tuple3(
					_Utils_update(
						state,
						{mouseFocus: $elm$core$Maybe$Nothing, query: newQuery, zipList: newZipList}),
					A2($kirchner$elm_selectize$Selectize$Selectize$scroll, state.id, 0),
					$elm$core$Maybe$Just(
						select($elm$core$Maybe$Nothing)));
			case 'SetMouseFocus':
				var newFocus = msg.a;
				return _Utils_Tuple3(
					_Utils_update(
						state,
						{mouseFocus: newFocus}),
					$elm$core$Platform$Cmd$none,
					$elm$core$Maybe$Nothing);
			case 'Select':
				var a = msg.a;
				var selection = A2($kirchner$elm_selectize$Selectize$Selectize$selectFirst, state.entries, a);
				return _Utils_Tuple3(
					$kirchner$elm_selectize$Selectize$Selectize$reset(state),
					$elm$core$Platform$Cmd$none,
					$elm$core$Maybe$Just(
						select(
							$elm$core$Maybe$Just(a))));
			case 'SetKeyboardFocus':
				var movement = msg.a;
				var scrollTop = msg.b;
				return A3(
					$kirchner$elm_selectize$Selectize$Selectize$scrollToKeyboardFocus,
					state.id,
					scrollTop,
					A3($kirchner$elm_selectize$Selectize$Selectize$updateKeyboardFocus, select, movement, state));
			case 'SelectKeyboardFocusAndBlur':
				var selection = A2(
					$elm$core$Maybe$andThen,
					$kirchner$elm_selectize$Selectize$Selectize$selectFirst(state.entries),
					A2($elm$core$Maybe$andThen, $kirchner$elm_selectize$Selectize$Selectize$currentEntry, state.zipList));
				return _Utils_Tuple3(
					$kirchner$elm_selectize$Selectize$Selectize$reset(state),
					$kirchner$elm_selectize$Selectize$Selectize$blur(state.id),
					$elm$core$Maybe$Just(
						select(
							A2($elm$core$Maybe$andThen, $kirchner$elm_selectize$Selectize$Selectize$currentEntry, state.zipList))));
			default:
				return _Utils_Tuple3(
					state,
					$elm$core$Platform$Cmd$none,
					$elm$core$Maybe$Just(
						select($elm$core$Maybe$Nothing)));
		}
	});
var $kirchner$elm_selectize$Selectize$update = F4(
	function (select, selection, state, msg) {
		return A4($kirchner$elm_selectize$Selectize$Selectize$update, select, selection, state, msg);
	});
var $author$project$LocationPicker$update = F2(
	function (msg, model) {
		if (msg.$ === 'TextfieldMenuMsg') {
			var selectizeMsg = msg.a;
			var _v1 = A4($kirchner$elm_selectize$Selectize$update, $author$project$LocationPicker$SelectTextfieldLicense, model.textfieldSelection, model.textfieldMenu, selectizeMsg);
			var newMenu = _v1.a;
			var menuCmd = _v1.b;
			var maybeMsg = _v1.c;
			var cmd = A2($elm$core$Platform$Cmd$map, $author$project$LocationPicker$TextfieldMenuMsg, menuCmd);
			var newModel = _Utils_update(
				model,
				{textfieldMenu: newMenu});
			if (maybeMsg.$ === 'Just') {
				var nextMsg = maybeMsg.a;
				return A2(
					$author$project$LocationPicker$andDo,
					cmd,
					A2($author$project$LocationPicker$update, nextMsg, newModel));
			} else {
				return {chosenLocation: $elm$core$Maybe$Nothing, cmd: cmd, model: newModel};
			}
		} else {
			var newSelection = msg.a;
			var chosenLocation = A2(
				$elm$core$Maybe$andThen,
				$author$project$LocationPicker$getLocation(model.locations),
				newSelection);
			return {
				chosenLocation: chosenLocation,
				cmd: $elm$core$Platform$Cmd$none,
				model: function () {
					if (chosenLocation.$ === 'Nothing') {
						return _Utils_update(
							model,
							{textfieldSelection: newSelection});
					} else {
						return $author$project$LocationPicker$init(model.locations).a;
					}
				}()
			};
		}
	});
var $author$project$Search$update = F2(
	function (msg, model) {
		if (model.$ === 'Page') {
			var data = model.a;
			switch (msg.$) {
				case 'GotProviders':
					var page = msg.a;
					var result = msg.b;
					if (result.$ === 'Ok') {
						var providers = result.a;
						if (!page) {
							return _Utils_Tuple2(
								$author$project$Search$Page(
									_Utils_update(
										data,
										{
											loadedPage: page,
											state: $author$project$Search$Loaded(providers)
										})),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								$author$project$Search$Page(
									_Utils_update(
										data,
										{
											loadedPage: page,
											state: $author$project$Search$Loaded(
												_Utils_ap(
													$author$project$Search$currentProviders(data.state),
													providers))
										})),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2($author$project$Search$Failure, $elm$core$Platform$Cmd$none);
					}
				case 'Sort':
					var maybeSorting = msg.a;
					if (maybeSorting.$ === 'Just') {
						switch (maybeSorting.a.$) {
							case 'SortNameAsc':
								var _v5 = maybeSorting.a;
								return _Utils_Tuple2(
									$author$project$Search$Page(
										_Utils_update(
											data,
											{
												sorting: $elm$core$Maybe$Just($author$project$Search$SortNameAsc),
												state: $author$project$Search$Loaded(
													A2(
														$elm$core$List$sortBy,
														function ($) {
															return $.name;
														},
														$author$project$Search$currentProviders(data.state)))
											})),
									$elm$core$Platform$Cmd$none);
							case 'SortNameDesc':
								var _v6 = maybeSorting.a;
								return _Utils_Tuple2(
									$author$project$Search$Page(
										_Utils_update(
											data,
											{
												sorting: $elm$core$Maybe$Just($author$project$Search$SortNameDesc),
												state: $author$project$Search$Loaded(
													$elm$core$List$reverse(
														A2(
															$elm$core$List$sortBy,
															function ($) {
																return $.name;
															},
															$author$project$Search$currentProviders(data.state))))
											})),
									$elm$core$Platform$Cmd$none);
							case 'SortPostalCodeAsc':
								var _v7 = maybeSorting.a;
								return _Utils_Tuple2(
									$author$project$Search$Page(
										_Utils_update(
											data,
											{
												sorting: $elm$core$Maybe$Just($author$project$Search$SortPostalCodeAsc),
												state: $author$project$Search$Loaded(
													A2(
														$elm$core$List$sortWith,
														$author$project$Search$sortByPostalCode,
														$author$project$Search$currentProviders(data.state)))
											})),
									$elm$core$Platform$Cmd$none);
							case 'SortPostalCodeDesc':
								var _v8 = maybeSorting.a;
								return _Utils_Tuple2(
									$author$project$Search$Page(
										_Utils_update(
											data,
											{
												sorting: $elm$core$Maybe$Just($author$project$Search$SortPostalCodeDesc),
												state: $author$project$Search$Loaded(
													$elm$core$List$reverse(
														A2(
															$elm$core$List$sortWith,
															$author$project$Search$sortByPostalCode,
															$author$project$Search$currentProviders(data.state))))
											})),
									$elm$core$Platform$Cmd$none);
							default:
								var _v9 = maybeSorting.a;
								return _Utils_Tuple2(
									$author$project$Search$Page(
										_Utils_update(
											data,
											{
												sorting: $elm$core$Maybe$Just($author$project$Search$SortPrice),
												state: $author$project$Search$Loaded(
													A2(
														$elm$core$List$sortWith,
														$author$project$Search$sortByPrice,
														$author$project$Search$currentProviders(data.state)))
											})),
									$elm$core$Platform$Cmd$none);
						}
					} else {
						var newLabels = _List_Nil;
						return _Utils_Tuple2(
							$author$project$Search$Page(
								_Utils_update(
									data,
									{sorting: $elm$core$Maybe$Nothing, state: $author$project$Search$Loading})),
							$author$project$Search$getProviders(
								A2($author$project$Search$generateQuery, 0, newLabels)));
					}
				case 'AddLabel':
					var label = msg.a;
					var newLabels = A2($author$project$Search$reviseLabels, label, data.labels);
					return _Utils_Tuple2(
						$author$project$Search$Page(
							_Utils_update(
								data,
								{
									freeTextQuery: $author$project$Search$isFreeTextLabel(label) ? '' : data.freeTextQuery,
									labels: newLabels,
									sorting: $elm$core$Maybe$Nothing,
									state: $author$project$Search$Loading
								})),
						$author$project$Search$getProviders(
							A2($author$project$Search$generateQuery, 0, newLabels)));
				case 'RemoveLabel':
					var index = msg.a;
					var newLabels = A2($elm_community$list_extra$List$Extra$removeAt, index, data.labels);
					return _Utils_Tuple2(
						$author$project$Search$Page(
							_Utils_update(
								data,
								{labels: newLabels, sorting: $elm$core$Maybe$Nothing, state: $author$project$Search$Loading})),
						$author$project$Search$getProviders(
							A2($author$project$Search$generateQuery, 0, newLabels)));
				case 'RemoveSameLabel':
					var label = msg.a;
					var newLabels = A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$author$project$Search$labelsEqual(label),
							$elm$core$Basics$not),
						data.labels);
					return _Utils_Tuple2(
						$author$project$Search$Page(
							_Utils_update(
								data,
								{labels: newLabels, sorting: $elm$core$Maybe$Nothing, state: $author$project$Search$Loading})),
						$author$project$Search$getProviders(
							A2($author$project$Search$generateQuery, 0, newLabels)));
				case 'ResetPage':
					var newLabels = _List_Nil;
					return _Utils_Tuple2(
						$author$project$Search$Page(
							_Utils_update(
								data,
								{labels: newLabels, sorting: $elm$core$Maybe$Nothing, state: $author$project$Search$Loading})),
						$author$project$Search$getProviders(
							A2($author$project$Search$generateQuery, 0, newLabels)));
				case 'CategorizationModelsMsg':
					var innerMsg = msg.a;
					var result = A2($author$project$CategorizationModels$update, innerMsg, data.categorizations);
					if (result.$ === 'Ok') {
						var newCats = result.a;
						return _Utils_Tuple2(
							$author$project$Search$Page(
								_Utils_update(
									data,
									{
										categorizations: newCats,
										locationPicker: $author$project$LocationPicker$init(
											A2($author$project$LocationPicker$locationList, newCats.postalCodes, newCats.areas)).a
									})),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2($author$project$Search$Failure, $elm$core$Platform$Cmd$none);
					}
				case 'LocationPickerMsg':
					var innerMsg = msg.a;
					var updated = A2($author$project$LocationPicker$update, innerMsg, data.locationPicker);
					var _v11 = updated.chosenLocation;
					if (_v11.$ === 'Nothing') {
						return _Utils_Tuple2(
							$author$project$Search$Page(
								_Utils_update(
									data,
									{locationPicker: updated.model})),
							A2($elm$core$Platform$Cmd$map, $author$project$Search$LocationPickerMsg, updated.cmd));
					} else {
						var location = _v11.a;
						var newLabels = A2(
							$author$project$Search$reviseLabels,
							$author$project$Search$LocationLabel(location),
							data.labels);
						return _Utils_Tuple2(
							$author$project$Search$Page(
								_Utils_update(
									data,
									{labels: newLabels, locationPicker: updated.model})),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2($elm$core$Platform$Cmd$map, $author$project$Search$LocationPickerMsg, updated.cmd),
										$author$project$Search$getProviders(
										A2($author$project$Search$generateQuery, 0, newLabels))
									])));
					}
				case 'UpdateFreeTextQuery':
					var q = msg.a;
					return _Utils_Tuple2(
						$author$project$Search$Page(
							_Utils_update(
								data,
								{freeTextQuery: q})),
						$elm$core$Platform$Cmd$none);
				default:
					var _v12 = data.state;
					if (_v12.$ === 'Loaded') {
						var providers = _v12.a;
						return _Utils_Tuple2(
							$author$project$Search$Page(
								_Utils_update(
									data,
									{
										sorting: $elm$core$Maybe$Nothing,
										state: $author$project$Search$LoadingAnotherPage(providers)
									})),
							$author$project$Search$getProviders(
								A2($author$project$Search$generateQuery, data.loadedPage + 1, data.labels)));
					} else {
						return _Utils_Tuple2(
							$author$project$Search$Page(data),
							$elm$core$Platform$Cmd$none);
					}
			}
		} else {
			return _Utils_Tuple2($author$project$Search$Failure, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Search$AddLabel = function (a) {
	return {$: 'AddLabel', a: a};
};
var $author$project$Search$Girls = {$: 'Girls'};
var $author$project$Search$LoadMoreProviders = {$: 'LoadMoreProviders'};
var $author$project$Search$ResetPage = {$: 'ResetPage'};
var $author$project$Search$UpdateFreeTextQuery = function (a) {
	return {$: 'UpdateFreeTextQuery', a: a};
};
var $elm$html$Html$b = _VirtualDom_node('b');
var $author$project$Search$gaNamify = function (title) {
	switch (title) {
		case 'Internt tilbud':
			return 'Internal';
		case 'Frivilligt tilbud':
			return 'Volunteer';
		case 'Uden ventetid':
			return 'NoWaiting';
		case 'Sociale':
			return 'Social';
		case 'Fysiske':
			return 'Physical';
		case 'Psykiske':
			return 'Psychological';
		default:
			return 'Other';
	}
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Search$primaryColor = 'rgb(155, 214, 202)';
var $author$project$Search$secondaryColor = 'rgb(73,105,99)';
var $author$project$Search$borderedCheckbox = F3(
	function (title, msgFunc, isChecked) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card '),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.85rem'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '0em'),
					A2($elm$html$Html$Attributes$style, 'padding-top', '0.575rem'),
					A2($elm$html$Html$Attributes$style, 'padding-bottom', '0.575rem'),
					A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$primaryColor),
					A2($elm$html$Html$Attributes$style, 'border', '1.25'),
					A2($elm$html$Html$Attributes$style, 'border-color', 'transparent')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-check'),
							$elm$html$Html$Events$onClick(
							msgFunc(isChecked)),
							A2($elm$html$Html$Attributes$style, 'margin-left', '1.75em'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '-0.18em'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '-0.18em')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(
										'form-check-input' + (' gaFilterBy' + $author$project$Search$gaNamify(title))),
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(isChecked)
									]),
								isChecked ? _List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$secondaryColor),
										A2($elm$html$Html$Attributes$style, 'border', '0')
									]) : _List_Nil),
							_List_Nil),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-check-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								]))
						]))
				]));
	});
var $elm$html$Html$br = _VirtualDom_node('br');
var $author$project$Search$broad_dropdown_ = F5(
	function (hasBackground, isSelected, id_, title, choices) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dropdown')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'false'),
							$elm$html$Html$Attributes$class('btn btn-default dropdown-toggle btn-block'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.75em'),
							A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
							A2(
							$elm$html$Html$Attributes$style,
							'color',
							isSelected ? '#fff' : ''),
							A2(
							$elm$html$Html$Attributes$style,
							'background-color',
							isSelected ? (hasBackground ? $author$project$Search$secondaryColor : '#fff') : (hasBackground ? $author$project$Search$primaryColor : '#fff')),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'inital'),
							A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'dropdown'),
							$elm$html$Html$Attributes$id(id_),
							hasBackground ? A2($elm$html$Html$Attributes$style, 'border-color', 'transparent') : A2($elm$html$Html$Attributes$style, 'border-color', '#B8B8B8'),
							$elm$html$Html$Attributes$type_('button')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'dropdownMenuButton1'),
							$elm$html$Html$Attributes$class('dropdown-menu'),
							A2($elm$html$Html$Attributes$style, 'width', 'auto%'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'inital'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2000000'),
							A2($elm$html$Html$Attributes$attribute, 'data-popper-placement', 'bottom-start')
						]),
					choices)
				]));
	});
var $author$project$Search$broad_dropdown = A2($author$project$Search$broad_dropdown_, true, false);
var $author$project$Search$colContactName = '20';
var $author$project$Search$colIcons = '10';
var $author$project$Search$colMembership = '3';
var $author$project$Search$colName = '39';
var $author$project$Search$colPostalCode = '10';
var $author$project$Search$colPrice = '18';
var $author$project$Search$dropdown_ = F5(
	function (hasBackground, isSelected, id_, title, choices) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dropdown')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'false'),
							$elm$html$Html$Attributes$class('btn btn-default dropdown-toggle btn-block'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.75em'),
							A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
							A2(
							$elm$html$Html$Attributes$style,
							'color',
							isSelected ? '#fff' : ''),
							A2(
							$elm$html$Html$Attributes$style,
							'background-color',
							isSelected ? (hasBackground ? $author$project$Search$secondaryColor : '#fff') : (hasBackground ? $author$project$Search$primaryColor : '#fff')),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'inital'),
							A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'dropdown'),
							$elm$html$Html$Attributes$id(id_),
							hasBackground ? A2($elm$html$Html$Attributes$style, 'border-color', 'transparent') : A2($elm$html$Html$Attributes$style, 'border-color', '#B8B8B8'),
							$elm$html$Html$Attributes$type_('button')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'dropdownMenuButton1'),
							$elm$html$Html$Attributes$class('dropdown-menu'),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'inital'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2000000'),
							A2($elm$html$Html$Attributes$attribute, 'data-popper-placement', 'bottom-start')
						]),
					choices)
				]));
	});
var $author$project$Search$dropdown = A2($author$project$Search$dropdown_, true, false);
var $author$project$Search$dropdownSelected = A2($author$project$Search$dropdown_, true, true);
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Search$RemoveSameLabel = function (a) {
	return {$: 'RemoveSameLabel', a: a};
};
var $author$project$Search$labelCheckboxAction = F2(
	function (label, check) {
		return check ? $author$project$Search$RemoveSameLabel(label) : $author$project$Search$AddLabel(label);
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$Search$onEnter = function (msg) {
	var isEnter = function (code) {
		return (code === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('not ENTER');
	};
	return A2(
		$elm$html$Html$Events$on,
		'keydown',
		A2($elm$json$Json$Decode$andThen, isEnter, $elm$html$Html$Events$keyCode));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$Search$searchBoxTitle = function (title) {
	return A2(
		$elm$html$Html$p,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.45em'),
				A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '1.35em')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(title)
			]));
};
var $author$project$Search$ServiceCategoryLabel = function (a) {
	return {$: 'ServiceCategoryLabel', a: a};
};
var $author$project$Search$viewServiceCategoryChoice = function (sc) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-item gaFilterBySC'),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$AddLabel(
							$author$project$Search$ServiceCategoryLabel(sc)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(sc.name)
					]))
			]));
};
var $author$project$Search$serviceCategoryDropdown = F2(
	function (categories, selectedCategory) {
		return _List_fromArray(
			[
				function () {
				if (selectedCategory.$ === 'Nothing') {
					return A3(
						$author$project$Search$dropdown,
						'Indsats',
						'Indsats',
						A2(
							$elm$core$List$map,
							$author$project$Search$viewServiceCategoryChoice,
							A2(
								$elm$core$List$sortBy,
								function ($) {
									return $.name;
								},
								categories)));
				} else {
					var sc = selectedCategory.a;
					return A3(
						$author$project$Search$dropdownSelected,
						'Indsats',
						sc.name,
						A2(
							$elm$core$List$map,
							$author$project$Search$viewServiceCategoryChoice,
							A2(
								$elm$core$List$sortBy,
								function ($) {
									return $.name;
								},
								categories)));
				}
			}()
			]);
	});
var $author$project$Search$sortingTitle = function (maybeSorting) {
	if (maybeSorting.$ === 'Nothing') {
		return 'Ingen sortering';
	} else {
		var sorting = maybeSorting.a;
		switch (sorting.$) {
			case 'SortNameAsc':
				return 'Navn (A-Å)';
			case 'SortNameDesc':
				return 'Navn (Å-A)';
			case 'SortPostalCodeAsc':
				return 'Postnr (lav-høj)';
			case 'SortPostalCodeDesc':
				return 'Postnr (høj-lav)';
			default:
				return 'Pris (lav-høj)';
		}
	}
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $kirchner$elm_selectize$Selectize$Selectize$PreventClosing = function (a) {
	return {$: 'PreventClosing', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $elm$html$Html$Attributes$map = $elm$virtual_dom$VirtualDom$mapAttribute;
var $kirchner$elm_selectize$Selectize$Selectize$noOp = function (attrs) {
	return A2(
		$elm$core$List$map,
		$elm$html$Html$Attributes$map(
			function (_v0) {
				return $kirchner$elm_selectize$Selectize$Selectize$NoOp;
			}),
		attrs);
};
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $kirchner$elm_selectize$Selectize$Selectize$Select = function (a) {
	return {$: 'Select', a: a};
};
var $kirchner$elm_selectize$Selectize$Selectize$SetMouseFocus = function (a) {
	return {$: 'SetMouseFocus', a: a};
};
var $kirchner$elm_selectize$Selectize$Selectize$mapToNoOp = $elm$html$Html$map(
	function (_v0) {
		return $kirchner$elm_selectize$Selectize$Selectize$NoOp;
	});
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $kirchner$elm_selectize$Selectize$Selectize$viewEntry = F4(
	function (config, keyboardFocused, mouseFocus, e) {
		var _v0 = function () {
			if (e.$ === 'Entry') {
				var actualEntry = e.a;
				return A3(
					config.entry,
					actualEntry,
					_Utils_eq(
						mouseFocus,
						$elm$core$Maybe$Just(actualEntry)),
					keyboardFocused);
			} else {
				var title = e.a;
				return config.divider(title);
			}
		}();
		var attributes = _v0.attributes;
		var children = _v0.children;
		var liAttrs = function (attrs) {
			return _Utils_ap(
				attrs,
				$kirchner$elm_selectize$Selectize$Selectize$noOp(attributes));
		};
		return A2(
			$elm$html$Html$li,
			liAttrs(
				function () {
					if (e.$ === 'Entry') {
						var actualEntry = e.a;
						return _List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$kirchner$elm_selectize$Selectize$Selectize$Select(actualEntry)),
								$elm$html$Html$Events$onMouseEnter(
								$kirchner$elm_selectize$Selectize$Selectize$SetMouseFocus(
									$elm$core$Maybe$Just(actualEntry))),
								$elm$html$Html$Events$onMouseLeave(
								$kirchner$elm_selectize$Selectize$Selectize$SetMouseFocus($elm$core$Maybe$Nothing))
							]);
					} else {
						return _List_Nil;
					}
				}()),
			A2($elm$core$List$map, $kirchner$elm_selectize$Selectize$Selectize$mapToNoOp, children));
	});
var $kirchner$elm_selectize$Selectize$Selectize$viewFocusedEntry = function (config) {
	return A2($kirchner$elm_selectize$Selectize$Selectize$viewEntry, config, true);
};
var $kirchner$elm_selectize$Selectize$Selectize$viewCurrentEntry = F3(
	function (config, state, current) {
		return A3($kirchner$elm_selectize$Selectize$Selectize$viewFocusedEntry, config, state.mouseFocus, current.a);
	});
var $kirchner$elm_selectize$Selectize$Selectize$viewUnfocusedEntry = function (config) {
	return A2($kirchner$elm_selectize$Selectize$Selectize$viewEntry, config, false);
};
var $kirchner$elm_selectize$Selectize$Selectize$viewEntries = F3(
	function (config, state, front) {
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				A3($elm$html$Html$Lazy$lazy3, $kirchner$elm_selectize$Selectize$Selectize$viewUnfocusedEntry, config, state.mouseFocus)),
			front);
	});
var $kirchner$elm_selectize$Selectize$Selectize$view = F3(
	function (config, selection, state) {
		var selectionText = A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$Maybe$andThen,
				$kirchner$elm_selectize$Selectize$Selectize$selectFirst(state.entries),
				selection));
		var menuAttrs = _Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(
					$kirchner$elm_selectize$Selectize$Selectize$menuId(state.id)),
					$elm$html$Html$Events$onMouseDown(
					$kirchner$elm_selectize$Selectize$Selectize$PreventClosing(true)),
					$elm$html$Html$Events$onMouseUp(
					$kirchner$elm_selectize$Selectize$Selectize$PreventClosing(false)),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute')
				]),
			$kirchner$elm_selectize$Selectize$Selectize$noOp(config.menu));
		var _v0 = state.zipList;
		if (_v0.$ === 'Nothing') {
			return A2(
				$elm$html$Html$div,
				_Utils_ap(
					$kirchner$elm_selectize$Selectize$Selectize$noOp(config.container),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
							A2($elm$html$Html$Attributes$style, 'position', 'relative')
						])),
				_List_fromArray(
					[
						A4(config.input, state.id, selectionText, state.query, state.open),
						A2(
						$elm$html$Html$div,
						menuAttrs,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$ul,
								$kirchner$elm_selectize$Selectize$Selectize$noOp(config.ul),
								A2(
									$elm$core$List$map,
									A2(
										$elm$core$Basics$composeR,
										$kirchner$elm_selectize$Selectize$Selectize$removeLabel,
										A2($kirchner$elm_selectize$Selectize$Selectize$viewUnfocusedEntry, config, $elm$core$Maybe$Nothing)),
									state.entries))
							]))
					]));
		} else {
			var zipList = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'relative')
					]),
				_List_fromArray(
					[
						A4(config.input, state.id, selectionText, state.query, state.open),
						A2(
						$elm$html$Html$div,
						menuAttrs,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$ul,
								$kirchner$elm_selectize$Selectize$Selectize$noOp(config.ul),
								$elm$core$List$concat(
									_List_fromArray(
										[
											$elm$core$List$reverse(
											A3($kirchner$elm_selectize$Selectize$Selectize$viewEntries, config, state, zipList.front)),
											_List_fromArray(
											[
												A3($kirchner$elm_selectize$Selectize$Selectize$viewCurrentEntry, config, state, zipList.current)
											]),
											A3($kirchner$elm_selectize$Selectize$Selectize$viewEntries, config, state, zipList.back)
										])))
							]))
					]));
		}
	});
var $kirchner$elm_selectize$Selectize$view = $elm$html$Html$Lazy$lazy3($kirchner$elm_selectize$Selectize$Selectize$view);
var $kirchner$elm_selectize$Selectize$Selectize$CloseMenu = {$: 'CloseMenu'};
var $kirchner$elm_selectize$Selectize$Selectize$SetQuery = function (a) {
	return {$: 'SetQuery', a: a};
};
var $kirchner$elm_selectize$Selectize$Selectize$BlurTextfield = {$: 'BlurTextfield'};
var $kirchner$elm_selectize$Selectize$Selectize$ClearSelection = {$: 'ClearSelection'};
var $kirchner$elm_selectize$Selectize$Selectize$FocusTextfield = {$: 'FocusTextfield'};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $kirchner$elm_selectize$Selectize$Selectize$buttons = F4(
	function (clearButton, toggleButton, sthSelected, open) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'right', '0'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex')
				]),
			_List_fromArray(
				[
					function () {
					var _v0 = _Utils_Tuple2(clearButton, sthSelected);
					if ((_v0.a.$ === 'Just') && _v0.b) {
						var clear = _v0.a.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($kirchner$elm_selectize$Selectize$Selectize$ClearSelection)
								]),
							_List_fromArray(
								[
									$kirchner$elm_selectize$Selectize$Selectize$mapToNoOp(clear)
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}(),
					function () {
					if (toggleButton.$ === 'Just') {
						var toggle = toggleButton.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									function () {
									if (open) {
										return A2(
											$elm$html$Html$Events$preventDefaultOn,
											'click',
											$elm$json$Json$Decode$succeed(
												_Utils_Tuple2($kirchner$elm_selectize$Selectize$Selectize$BlurTextfield, true)));
									} else {
										return A2(
											$elm$html$Html$Events$preventDefaultOn,
											'click',
											$elm$json$Json$Decode$succeed(
												_Utils_Tuple2($kirchner$elm_selectize$Selectize$Selectize$FocusTextfield, true)));
									}
								}()
								]),
							_List_fromArray(
								[
									$kirchner$elm_selectize$Selectize$Selectize$mapToNoOp(
									toggle(open))
								]));
					} else {
						return A2($elm$html$Html$div, _List_Nil, _List_Nil);
					}
				}()
				]));
	});
var $kirchner$elm_selectize$Selectize$Selectize$OpenMenu = F2(
	function (a, b) {
		return {$: 'OpenMenu', a: a, b: b};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $kirchner$elm_selectize$Selectize$Selectize$entryHeightsDecoder = function () {
	var loop = F2(
		function (idx, xs) {
			return A2(
				$elm$json$Json$Decode$andThen,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$map(
						function (x) {
							return A2(
								loop,
								idx + 1,
								A2($elm$core$List$cons, x, xs));
						}),
					$elm$core$Maybe$withDefault(
						$elm$json$Json$Decode$succeed(xs))),
				$elm$json$Json$Decode$maybe(
					A2(
						$elm$json$Json$Decode$at,
						_List_fromArray(
							[
								$elm$core$String$fromInt(idx),
								'offsetHeight'
							]),
						$elm$json$Json$Decode$float)));
		});
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$List$reverse,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['target', 'parentElement', 'parentElement', 'childNodes', '1', 'childNodes', '0', 'childNodes']),
			A2(loop, 0, _List_Nil)));
}();
var $kirchner$elm_selectize$Selectize$Selectize$menuHeightDecoder = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'parentElement', 'parentElement', 'childNodes', '1', 'clientHeight']),
	$elm$json$Json$Decode$float);
var $kirchner$elm_selectize$Selectize$Selectize$scrollTopDecoder = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'parentElement', 'parentElement', 'childNodes', '1', 'scrollTop']),
	$elm$json$Json$Decode$float);
var $kirchner$elm_selectize$Selectize$Selectize$focusDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (entryHeights, menuHeight, scrollTop) {
			return A2(
				$kirchner$elm_selectize$Selectize$Selectize$OpenMenu,
				{entries: entryHeights, menu: menuHeight},
				scrollTop);
		}),
	$kirchner$elm_selectize$Selectize$Selectize$entryHeightsDecoder,
	$kirchner$elm_selectize$Selectize$Selectize$menuHeightDecoder,
	$kirchner$elm_selectize$Selectize$Selectize$scrollTopDecoder);
var $kirchner$elm_selectize$Selectize$Selectize$Down = {$: 'Down'};
var $kirchner$elm_selectize$Selectize$Selectize$SelectKeyboardFocusAndBlur = {$: 'SelectKeyboardFocusAndBlur'};
var $kirchner$elm_selectize$Selectize$Selectize$SetKeyboardFocus = F2(
	function (a, b) {
		return {$: 'SetKeyboardFocus', a: a, b: b};
	});
var $kirchner$elm_selectize$Selectize$Selectize$Up = {$: 'Up'};
var $kirchner$elm_selectize$Selectize$Selectize$fromResult = function (result) {
	if (result.$ === 'Ok') {
		var val = result.a;
		return $elm$json$Json$Decode$succeed(val);
	} else {
		var reason = result.a;
		return $elm$json$Json$Decode$fail(reason);
	}
};
var $kirchner$elm_selectize$Selectize$Selectize$keydownDecoder = A2(
	$elm$json$Json$Decode$andThen,
	$kirchner$elm_selectize$Selectize$Selectize$fromResult,
	A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (code, scrollTop) {
				switch (code) {
					case 38:
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								A2($kirchner$elm_selectize$Selectize$Selectize$SetKeyboardFocus, $kirchner$elm_selectize$Selectize$Selectize$Up, scrollTop),
								true));
					case 40:
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								A2($kirchner$elm_selectize$Selectize$Selectize$SetKeyboardFocus, $kirchner$elm_selectize$Selectize$Selectize$Down, scrollTop),
								true));
					case 13:
						return $elm$core$Result$Ok(
							_Utils_Tuple2($kirchner$elm_selectize$Selectize$Selectize$SelectKeyboardFocusAndBlur, true));
					case 27:
						return $elm$core$Result$Ok(
							_Utils_Tuple2($kirchner$elm_selectize$Selectize$Selectize$BlurTextfield, true));
					default:
						return $elm$core$Result$Err('not handling that key here');
				}
			}),
		$elm$html$Html$Events$keyCode,
		$kirchner$elm_selectize$Selectize$Selectize$scrollTopDecoder));
var $kirchner$elm_selectize$Selectize$Selectize$keyupDecoder = A2(
	$elm$json$Json$Decode$andThen,
	$kirchner$elm_selectize$Selectize$Selectize$fromResult,
	A2(
		$elm$json$Json$Decode$map,
		function (code) {
			switch (code) {
				case 8:
					return $elm$core$Result$Ok($kirchner$elm_selectize$Selectize$Selectize$ClearSelection);
				case 46:
					return $elm$core$Result$Ok($kirchner$elm_selectize$Selectize$Selectize$ClearSelection);
				default:
					return $elm$core$Result$Err('not handling that key here');
			}
		},
		$elm$html$Html$Events$keyCode));
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $kirchner$elm_selectize$Selectize$Selectize$autocomplete = F5(
	function (config, id, selection, query, open) {
		var inputAttrs = $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						$elm$html$Html$Attributes$value(query),
						$elm$html$Html$Attributes$id(
						$kirchner$elm_selectize$Selectize$Selectize$textfieldId(id)),
						A2($elm$html$Html$Events$on, 'focus', $kirchner$elm_selectize$Selectize$Selectize$focusDecoder)
					]),
					_Utils_eq(selection, $elm$core$Maybe$Nothing) ? (open ? _List_fromArray(
					[
						$elm$html$Html$Attributes$placeholder(config.placeholder)
					]) : _List_fromArray(
					[
						$elm$html$Html$Attributes$value(config.placeholder)
					])) : _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', 'transparent')
					]),
					open ? _List_fromArray(
					[
						$elm$html$Html$Events$onBlur($kirchner$elm_selectize$Selectize$Selectize$CloseMenu),
						A2($elm$html$Html$Events$on, 'keyup', $kirchner$elm_selectize$Selectize$Selectize$keyupDecoder),
						A2($elm$html$Html$Events$preventDefaultOn, 'keydown', $kirchner$elm_selectize$Selectize$Selectize$keydownDecoder),
						$elm$html$Html$Events$onInput($kirchner$elm_selectize$Selectize$Selectize$SetQuery)
					]) : _List_Nil,
					$kirchner$elm_selectize$Selectize$Selectize$noOp(
					A2(
						config.attrs,
						!_Utils_eq(selection, $elm$core$Maybe$Nothing),
						open))
				]));
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2($elm$html$Html$input, inputAttrs, _List_Nil),
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'height', '100%'),
								A2($elm$html$Html$Attributes$style, 'left', '0'),
								A2($elm$html$Html$Attributes$style, 'top', '0'),
								A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-color', 'transparent'),
								A2($elm$html$Html$Attributes$style, 'background-color', 'transparent'),
								A2($elm$html$Html$Attributes$style, 'box-shadow', 'none')
							]),
						$kirchner$elm_selectize$Selectize$Selectize$noOp(
							A2(
								config.attrs,
								!_Utils_eq(selection, $elm$core$Maybe$Nothing),
								open))),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', selection))
						])),
					A4(
					$kirchner$elm_selectize$Selectize$Selectize$buttons,
					config.clearButton,
					config.toggleButton,
					!_Utils_eq(selection, $elm$core$Maybe$Nothing),
					open)
				]));
	});
var $kirchner$elm_selectize$Selectize$autocomplete = function (config) {
	return $kirchner$elm_selectize$Selectize$Selectize$autocomplete(config);
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$LocationPicker$clearButton = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('selectize__menu-toggle')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$i,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('material-icons'),
						$elm$html$Html$Attributes$class('selectize__icon')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('clear')
					]))
			])));
var $author$project$LocationPicker$toggleButton = $elm$core$Maybe$Just(
	function (open) {
		return A2(
			$elm$html$Html$i,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'fa fa-caret-' + (open ? 'up' : 'down')),
					A2($elm$html$Html$Attributes$style, 'padding-right', '1em'),
					A2($elm$html$Html$Attributes$style, 'padding-top', '0.5em'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle')
				]),
			_List_Nil);
	});
var $author$project$LocationPicker$textfieldSelector = $kirchner$elm_selectize$Selectize$autocomplete(
	{
		attrs: F2(
			function (sthSelected, open) {
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$class('btn'),
						$elm$html$Html$Attributes$class('btn-default'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('selectize__textfield--selection', sthSelected),
								_Utils_Tuple2('selectize__textfield--no-selection', !sthSelected),
								_Utils_Tuple2('selectize__textfield--menu-open', open)
							])),
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'border-style', 'solid'),
						A2($elm$html$Html$Attributes$style, 'border-color', '#B8B8B8'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'left')
					]);
			}),
		clearButton: $author$project$LocationPicker$clearButton,
		placeholder: 'Vælg område eller postnummer...',
		toggleButton: $author$project$LocationPicker$toggleButton
	});
var $kirchner$elm_selectize$Selectize$viewConfig = function (config) {
	return {container: config.container, divider: config.divider, entry: config.entry, input: config.input, menu: config.menu, ul: config.ul};
};
var $author$project$LocationPicker$viewConfig = function (selector) {
	return $kirchner$elm_selectize$Selectize$viewConfig(
		{
			container: _List_Nil,
			divider: function (title) {
				return {
					attributes: _List_fromArray(
						[
							$elm$html$Html$Attributes$class('selectize__divider')
						]),
					children: _List_fromArray(
						[
							$elm$html$Html$text(title)
						])
				};
			},
			entry: F3(
				function (tree, mouseFocused, keyboardFocused) {
					return {
						attributes: _List_fromArray(
							[
								$elm$html$Html$Attributes$class('selectize__item gaFilterByArea'),
								A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
								A2($elm$html$Html$Attributes$style, 'list-style', 'none'),
								A2($elm$html$Html$Attributes$style, 'padding-left', '1rem'),
								A2($elm$html$Html$Attributes$style, 'padding-top', '0.25rem'),
								A2($elm$html$Html$Attributes$style, 'padding-bottom', '0.25rem'),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('btn-secondaryColor', mouseFocused),
										_Utils_Tuple2('selectize__item--key-selected', keyboardFocused)
									])),
								A2(
								$elm$html$Html$Attributes$style,
								'background-color',
								(keyboardFocused || mouseFocused) ? '#e9ecef' : 'white')
							]),
						children: _List_fromArray(
							[
								$elm$html$Html$text(tree)
							])
					};
				}),
			input: selector,
			menu: _List_fromArray(
				[
					$elm$html$Html$Attributes$class('selectize__menu'),
					A2($elm$html$Html$Attributes$style, 'width', '100%')
				]),
			ul: _List_fromArray(
				[
					$elm$html$Html$Attributes$class('selectize__list'),
					A2($elm$html$Html$Attributes$style, 'padding-left', '0')
				])
		});
};
var $author$project$LocationPicker$viewConfigTextfield = $author$project$LocationPicker$viewConfig($author$project$LocationPicker$textfieldSelector);
var $author$project$LocationPicker$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-flow', 'column'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'overflow', 'inherit%'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$map,
				$author$project$LocationPicker$TextfieldMenuMsg,
				A3($kirchner$elm_selectize$Selectize$view, $author$project$LocationPicker$viewConfigTextfield, model.textfieldSelection, model.textfieldMenu))
			]));
};
var $author$project$Search$AgeLabel = function (a) {
	return {$: 'AgeLabel', a: a};
};
var $author$project$Search$viewAgeChoice = function (age) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-item gaFilterByAge'),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$AddLabel(
							$author$project$Search$AgeLabel(age)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(age))
					]))
			]));
};
var $author$project$Search$CreditationLabel = function (a) {
	return {$: 'CreditationLabel', a: a};
};
var $author$project$Search$viewCreditationsChoice = function (cred) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-item gaFilterByCred'),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$AddLabel(
							$author$project$Search$CreditationLabel(cred)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(cred.name)
					]))
			]));
};
var $author$project$Search$GenderLabel = function (a) {
	return {$: 'GenderLabel', a: a};
};
var $author$project$Search$viewGenderChoice = function (gen) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-item gaFilterByGender'),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$AddLabel(
							$author$project$Search$GenderLabel(gen)))
					]),
				_List_fromArray(
					[
						function () {
						if (gen.$ === 'Boys') {
							return $elm$html$Html$text('Kun for drenge');
						} else {
							return $elm$html$Html$text('Kun for piger');
						}
					}()
					]))
			]));
};
var $author$project$Search$RemoveLabel = function (a) {
	return {$: 'RemoveLabel', a: a};
};
var $author$project$Search$labelName = function (label) {
	switch (label.$) {
		case 'ServiceCategoryLabel':
			var sc = label.a;
			return sc.name;
		case 'RegionLabel':
			var r = label.a;
			return r.name;
		case 'LanguageLabel':
			var l = label.a;
			return l.name;
		case 'WaitingTimeLabel':
			return 'Uden ventetid';
		case 'ThemeLabel':
			var t = label.a;
			return t.name;
		case 'FreeLabel':
			return 'Frivilligt tilbud';
		case 'InternalLabel':
			return 'Internt tilbud';
		case 'GenderLabel':
			if (label.a.$ === 'Boys') {
				var _v1 = label.a;
				return 'Tilbud kun til drenge';
			} else {
				var _v2 = label.a;
				return 'Tilbud kun til piger';
			}
		case 'AgeLabel':
			var age = label.a;
			return $elm$core$String$fromInt(age) + ' år';
		case 'LocationLabel':
			var loc = label.a;
			if (loc.$ === 'LocationPostalCode') {
				var pc = loc.a;
				return $elm$core$String$fromInt(pc.number) + (' - ' + pc.name);
			} else {
				var area = loc.a;
				return area.name;
			}
		case 'FreeTextLabel':
			var text = label.a;
			return 'Navn indeholder: ' + text;
		default:
			var c = label.a;
			return c.name;
	}
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Search$viewLabel = F2(
	function (index, label) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('badge'),
					A2($elm$html$Html$Attributes$attribute, 'style', 'margin: 0.25em'),
					A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$secondaryColor)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Search$labelName(label))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn-close'),
							$elm$html$Html$Events$onClick(
							$author$project$Search$RemoveLabel(index)),
							$elm$html$Html$Attributes$type_('button')
						]),
					_List_Nil)
				]));
	});
var $author$project$Search$LanguageLabel = function (a) {
	return {$: 'LanguageLabel', a: a};
};
var $author$project$Search$viewLanguageChoice = function (lang) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-item gaFilterByLanguage'),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$AddLabel(
							$author$project$Search$LanguageLabel(lang)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(lang.name)
					]))
			]));
};
var $author$project$Search$basis = 1;
var $author$project$Search$expert = 2;
var $author$project$Search$ifZero = function (string) {
	return (string === '0') ? '' : string;
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $elm$html$Html$td = _VirtualDom_node('td');
var $author$project$Search$viewProvider = function (provider) {
	return _Utils_eq(provider.membership, $author$project$Search$expert) ? A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'role', 'row'),
				$elm$html$Html$Attributes$class('fixedheight'),
				A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$primaryColor),
				A2($elm$html$Html$Attributes$style, 'color', '#000')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$img,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$src('/static/diamond_icon.webp'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'trigger', 'hover focus click'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Ekspert')
											]),
										_List_Nil)
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
										A2($elm$html$Html$Attributes$style, 'color', '#000'),
										$elm$html$Html$Attributes$href(
										'/provider/' + $elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$id(
										$elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$rel('noopener noreferrer'),
										$elm$html$Html$Attributes$id('424'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$b,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(provider.name)
													]))
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
										A2($elm$html$Html$Attributes$style, 'color', '#000'),
										$elm$html$Html$Attributes$href(
										'/provider/' + $elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$id(
										$elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$rel('noopener noreferrer'),
										$elm$html$Html$Attributes$id('424'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$b,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$Search$ifZero(
													$elm$core$String$fromInt(
														A2($elm$core$Maybe$withDefault, 0, provider.contactPostalCode))))
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$b,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($elm$core$Maybe$withDefault, '', provider.contactName))
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$b,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($elm$core$Maybe$withDefault, 'Kontakt for pris', provider.price))
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										provider.isOnline ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-globe'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen tilbydes online')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isTransportIncluded ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-car-side'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'trigger', 'hover focus click'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Kørsel er inkluderet i prisen')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isAdministrationIncluded ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-file-invoice'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Administration er inkluderet i prisen')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isForParents ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-users'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen er rettet mod forældre')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isInternal ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-home'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen er et internt tilbud')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil)
									]))
							]))
					]))
			])) : (_Utils_eq(provider.membership, $author$project$Search$basis) ? A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'role', 'row'),
				$elm$html$Html$Attributes$class('fixedheight'),
				A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$primaryColor)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$img,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$src('/static/star_icon.webp'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'trigger', 'hover focus click'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Kørsel er inkluderet i prisen')
											]),
										_List_Nil)
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('link-dark'),
										A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
										$elm$html$Html$Attributes$href(
										'/provider/' + $elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$id(
										$elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$rel('noopener noreferrer'),
										$elm$html$Html$Attributes$id('424'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(provider.name)
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Search$ifZero(
											$elm$core$String$fromInt(
												A2($elm$core$Maybe$withDefault, 0, provider.contactPostalCode))))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, '', provider.contactName))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, 'Kontakt for pris', provider.price))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										provider.isOnline ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-globe'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen tilbydes online')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isTransportIncluded ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-car-side'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'trigger', 'hover focus click'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Kørsel er inkluderet i prisen')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isAdministrationIncluded ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-file-invoice'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Administration er inkluderet i prisen')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isForParents ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-users'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen er rettet mod forældre')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isInternal ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-home'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen er et internt tilbud')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil)
									]))
							]))
					]))
			])) : A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'role', 'row'),
				$elm$html$Html$Attributes$class('fixedheight')
			]),
		_List_fromArray(
			[
				A2($elm$html$Html$td, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('link-dark'),
										A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
										$elm$html$Html$Attributes$href(
										'/provider/' + $elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$id(
										$elm$core$String$fromInt(provider.id)),
										$elm$html$Html$Attributes$rel('noopener noreferrer'),
										$elm$html$Html$Attributes$id('424'),
										$elm$html$Html$Attributes$target('_blank')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(provider.name)
											]))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Search$ifZero(
											$elm$core$String$fromInt(
												A2($elm$core$Maybe$withDefault, 0, provider.contactPostalCode))))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, '', provider.contactName))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'color', '#000'),
								$elm$html$Html$Attributes$href(
								'/provider/' + $elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$id(
								$elm$core$String$fromInt(provider.id)),
								$elm$html$Html$Attributes$rel('noopener noreferrer'),
								$elm$html$Html$Attributes$id('424'),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, 'Kontakt for pris', provider.price))
									]))
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										provider.isOnline ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-globe'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen tilbydes online')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isTransportIncluded ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-car-side'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'trigger', 'hover focus click'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Kørsel er inkluderet i prisen')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isAdministrationIncluded ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-file-invoice'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Administration er inkluderet i prisen')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isForParents ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-users'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen er rettet mod forældre')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil),
										provider.isInternal ? A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-home'),
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-toggle', 'tooltip'),
												A2($elm$html$Html$Attributes$attribute, 'data-bs-placement', 'bottom'),
												A2($elm$html$Html$Attributes$attribute, 'title', 'Indsatsen er et internt tilbud')
											]),
										_List_Nil) : A2($elm$html$Html$i, _List_Nil, _List_Nil)
									]))
							]))
					]))
			])));
};
var $author$project$Search$Sort = function (a) {
	return {$: 'Sort', a: a};
};
var $author$project$Search$viewSortingChoice = function (maybeSorting) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-item gaFilterBySorting'),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$Sort(maybeSorting))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Search$sortingTitle(maybeSorting))
					]))
			]));
};
var $author$project$Search$themeTypeName = function (tt) {
	switch (tt.$) {
		case 'SocialType':
			return 'Sociale';
		case 'PhysicalType':
			return 'Fysiske';
		default:
			return 'Psykiske';
	}
};
var $author$project$Search$ThemeLabel = function (a) {
	return {$: 'ThemeLabel', a: a};
};
var $author$project$Search$viewThemeChoice = function (theme) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						'dropdown-item' + (' gaFilterBy' + $author$project$Search$gaNamify(
							$author$project$Search$themeTypeName(theme.theme_type)))),
						$elm$html$Html$Attributes$href('#'),
						$elm$html$Html$Events$onClick(
						$author$project$Search$AddLabel(
							$author$project$Search$ThemeLabel(theme)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(theme.name)
					]))
			]));
};
var $author$project$Search$viewThemeDropdown = F2(
	function (themes, themeType) {
		return A3(
			$author$project$Search$dropdown,
			'choose' + $author$project$Search$themeTypeName(themeType),
			$author$project$Search$themeTypeName(themeType),
			A2(
				$elm$core$List$map,
				$author$project$Search$viewThemeChoice,
				A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.name;
					},
					A2(
						$elm$core$List$filter,
						function (t) {
							return _Utils_eq(t.theme_type, themeType);
						},
						themes))));
	});
var $author$project$Search$searchForm = F6(
	function (catModels, maybeSorting, searchState, labels, query, locationPicker) {
		var themes = catModels.themes;
		var serviceCategories = catModels.serviceCategories;
		var languages = catModels.languages;
		var creditations = catModels.creditations;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container'),
					A2($elm$html$Html$Attributes$attribute, 'style', 'padding-top: 2em;padding-left: 2em;padding-right: 2em; text-align: left;')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-8')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('input-group'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.75em')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('form-control'),
													$elm$html$Html$Attributes$type_('text'),
													$elm$html$Html$Attributes$placeholder('Søg efter tilbudsnavn...'),
													$elm$html$Html$Events$onInput($author$project$Search$UpdateFreeTextQuery),
													$elm$html$Html$Attributes$value(query),
													$author$project$Search$onEnter(
													$author$project$Search$AddLabel(
														$author$project$Search$FreeTextLabel(query)))
												]),
											_List_Nil),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-default'),
													A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$primaryColor),
													$elm$html$Html$Events$onClick(
													$author$project$Search$AddLabel(
														$author$project$Search$FreeTextLabel(query)))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Søg')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-8')
								]),
							_List_fromArray(
								[
									$author$project$Search$searchBoxTitle('Hvilken type hjælp søger du?'),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									A2(
										$author$project$Search$serviceCategoryDropdown,
										serviceCategories,
										$author$project$Search$getServiceCategoryFromLabels(labels))),
									$author$project$Search$searchBoxTitle('Hvor skal hjælpen gives?'),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row'),
											A2($elm$html$Html$Attributes$style, 'padding-bottom', '4em')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$map,
											$author$project$Search$LocationPickerMsg,
											$author$project$LocationPicker$view(locationPicker))
										])),
									$author$project$Search$searchBoxTitle('Hvad er udfordringen? (Vælg gerne flere)'),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col')
												]),
											_List_fromArray(
												[
													A2($author$project$Search$viewThemeDropdown, themes, $author$project$CategorizationModels$SocialType)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col')
												]),
											_List_fromArray(
												[
													A2($author$project$Search$viewThemeDropdown, themes, $author$project$CategorizationModels$MentalType)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col')
												]),
											_List_fromArray(
												[
													A2($author$project$Search$viewThemeDropdown, themes, $author$project$CategorizationModels$PhysicalType)
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col')
								]),
							_List_fromArray(
								[
									$author$project$Search$searchBoxTitle('Er der andre vigtige kriterier?'),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col'),
											A2($elm$html$Html$Attributes$style, 'width', '100%')
										]),
									_List_fromArray(
										[
											A3(
											$author$project$Search$borderedCheckbox,
											'Uden ventetid',
											$author$project$Search$labelCheckboxAction($author$project$Search$WaitingTimeLabel),
											A2($elm$core$List$member, $author$project$Search$WaitingTimeLabel, labels))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col-md-6'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.1rem')
												]),
											_List_fromArray(
												[
													A3(
													$author$project$Search$dropdown,
													'køn',
													'Køn',
													A2(
														$elm$core$List$map,
														$author$project$Search$viewGenderChoice,
														_List_fromArray(
															[$author$project$Search$Boys, $author$project$Search$Girls])))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col-md-6'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.1rem')
												]),
											_List_fromArray(
												[
													A3(
													$author$project$Search$dropdown,
													'alder',
													'Alder',
													A2(
														$elm$core$List$map,
														$author$project$Search$viewAgeChoice,
														A2($elm$core$List$range, 0, 23)))
												]))
										])),
									A3(
									$author$project$Search$dropdown,
									'sprog',
									'Sprog',
									A2($elm$core$List$map, $author$project$Search$viewLanguageChoice, languages)),
									A3(
									$author$project$Search$broad_dropdown,
									'kvalitetsstempel',
									'Kvalitetstempler',
									A2($elm$core$List$map, $author$project$Search$viewCreditationsChoice, creditations)),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row')
										]),
									_List_fromArray(
										[
											$author$project$Search$searchBoxTitle('Søg kun efter'),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col'),
													A2($elm$html$Html$Attributes$style, 'margin-top', '0.15em')
												]),
											_List_fromArray(
												[
													A3(
													$author$project$Search$borderedCheckbox,
													'Internt tilbud',
													$author$project$Search$labelCheckboxAction($author$project$Search$InternalLabel),
													A2($elm$core$List$member, $author$project$Search$InternalLabel, labels))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col'),
													A2($elm$html$Html$Attributes$style, 'margin-top', '0.15rem')
												]),
											_List_fromArray(
												[
													A3(
													$author$project$Search$borderedCheckbox,
													'Frivilligt tilbud',
													$author$project$Search$labelCheckboxAction($author$project$Search$FreeLabel),
													A2($elm$core$List$member, $author$project$Search$FreeLabel, labels))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container-fluid'),
							A2($elm$html$Html$Attributes$style, 'padding-left', '0')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row')
								]),
							$elm$core$List$isEmpty(labels) ? _List_Nil : _List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-top', '1.5em'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.0em')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Du har valgt:')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-md-10'),
											A2($elm$html$Html$Attributes$style, 'padding-left', '0.5em')
										]),
									A2($elm$core$List$indexedMap, $author$project$Search$viewLabel, labels)),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-md-2'),
											A2($elm$html$Html$Attributes$style, 'text-align', 'right')
										]),
									$elm$core$List$isEmpty(labels) ? _List_Nil : _List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('row')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Search$ResetPage),
															$elm$html$Html$Attributes$class('btn'),
															A2($elm$html$Html$Attributes$attribute, 'style', 'margin: 0.25em'),
															A2($elm$html$Html$Attributes$style, 'font-size', '0.75em'),
															A2($elm$html$Html$Attributes$style, 'padding-top', '0.75em'),
															A2($elm$html$Html$Attributes$style, 'padding-bottom', '0.75em'),
															A2($elm$html$Html$Attributes$style, 'text-align', 'right')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Nulstil')
																]))
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '2em'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '1.5em')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-md-10')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-md-2'),
											A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
											A2($elm$html$Html$Attributes$style, 'padding-right', '0'),
											A2($elm$html$Html$Attributes$style, 'padding-left', '1.25em')
										]),
									_List_fromArray(
										[
											function () {
											if (maybeSorting.$ === 'Nothing') {
												return A3(
													$author$project$Search$dropdown,
													'sorting',
													'Sortér efter',
													A2(
														$elm$core$List$map,
														$author$project$Search$viewSortingChoice,
														A2(
															$elm$core$List$cons,
															$elm$core$Maybe$Nothing,
															A2(
																$elm$core$List$map,
																$elm$core$Maybe$Just,
																_List_fromArray(
																	[$author$project$Search$SortNameAsc, $author$project$Search$SortNameDesc, $author$project$Search$SortPostalCodeAsc, $author$project$Search$SortPostalCodeDesc, $author$project$Search$SortPrice])))));
											} else {
												var sorting = maybeSorting.a;
												return A3(
													$author$project$Search$dropdownSelected,
													'sorting',
													$author$project$Search$sortingTitle(
														$elm$core$Maybe$Just(sorting)),
													A2(
														$elm$core$List$map,
														$author$project$Search$viewSortingChoice,
														A2(
															$elm$core$List$cons,
															$elm$core$Maybe$Nothing,
															A2(
																$elm$core$List$map,
																$elm$core$Maybe$Just,
																_List_fromArray(
																	[$author$project$Search$SortNameAsc, $author$project$Search$SortNameDesc, $author$project$Search$SortPostalCodeAsc, $author$project$Search$SortPostalCodeDesc, $author$project$Search$SortPrice])))));
											}
										}()
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row'),
									A2($elm$html$Html$Attributes$style, 'padding-left', '0.75em')
								]),
							function () {
								var tableTitle = function (title) {
									return A2(
										$elm$html$Html$b,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-left', '0.5em'),
												A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(title)
											]));
								};
								var faIcon = function (icon) {
									return A2(
										$elm$html$Html$i,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('fas'),
												$elm$html$Html$Attributes$class('fa-' + icon)
											]),
										_List_Nil);
								};
								switch (searchState.$) {
									case 'Loading':
										return _List_fromArray(
											[
												$elm$html$Html$text('Loading')
											]);
									case 'Loaded':
										var providers = searchState.a;
										return _List_fromArray(
											[
												A2(
												$elm$html$Html$table,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('table table-striped dataTable no-footer'),
														$elm$html$Html$Attributes$id('results')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$thead,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$tr,
																_List_fromArray(
																	[
																		A2($elm$html$Html$Attributes$attribute, 'role', 'row'),
																		A2($elm$html$Html$Attributes$style, 'background-color', $author$project$Search$secondaryColor),
																		A2($elm$html$Html$Attributes$style, 'color', '#fff')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colMembership + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_Nil),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colName + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('building'),
																				tableTitle('Tilbud')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colPostalCode + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('map-marked-alt'),
																				tableTitle('Postnr.')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colContactName + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('user'),
																				tableTitle('Kontaktperson')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colPrice + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('coins'),
																				tableTitle('Pris')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colIcons + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$tbody,
														_List_Nil,
														A2($elm$core$List$map, $author$project$Search$viewProvider, providers))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'text-align', 'center')
													]),
												_Utils_eq(
													A2($elm$core$List$map, $author$project$Search$viewProvider, providers),
													_List_Nil) ? _List_fromArray(
													[
														$elm$html$Html$text('Der er desværre ingen, der tilbyder det, du søger efter.'),
														A2($elm$html$Html$br, _List_Nil, _List_Nil),
														$elm$html$Html$text('Prøv at lave en bredere søgning for at finde et godt alternativ.'),
														A2($elm$html$Html$br, _List_Nil, _List_Nil),
														$elm$html$Html$text('God fortsat søgning.')
													]) : _List_fromArray(
													[
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('bb-center-button'),
																$elm$html$Html$Attributes$class('btn'),
																$elm$html$Html$Events$onClick($author$project$Search$LoadMoreProviders)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Vis flere tilbud')
															]))
													]))
											]);
									default:
										var providers = searchState.a;
										return _List_fromArray(
											[
												A2(
												$elm$html$Html$table,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('table table-striped dataTable no-footer'),
														$elm$html$Html$Attributes$id('results')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$thead,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$tr,
																_List_fromArray(
																	[
																		A2($elm$html$Html$Attributes$attribute, 'role', 'row')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colMembership + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_Nil),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colName + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('building'),
																				tableTitle('Tilbud')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colPostalCode + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('map-marked-alt'),
																				tableTitle('Postnr.')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colContactName + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('user'),
																				tableTitle('Kontaktperson')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colPrice + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_fromArray(
																			[
																				faIcon('coins'),
																				tableTitle('Pris')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('th-sm sorting'),
																				A2($elm$html$Html$Attributes$attribute, 'colspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'rowspan', '1'),
																				A2($elm$html$Html$Attributes$attribute, 'style', 'width: ' + ($author$project$Search$colIcons + '%;')),
																				A2($elm$html$Html$Attributes$attribute, 'tabindex', '0')
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$tbody,
														_List_Nil,
														A2($elm$core$List$map, $author$project$Search$viewProvider, providers))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'text-align', 'center')
													]),
												_Utils_eq(
													A2($elm$core$List$map, $author$project$Search$viewProvider, providers),
													_List_Nil) ? _List_fromArray(
													[
														$elm$html$Html$text('Der er desværre ingen, der tilbyder det, du søger efter.'),
														A2($elm$html$Html$br, _List_Nil, _List_Nil),
														$elm$html$Html$text('Prøv at lave en bredere søgning for at finde et godt alternativ.'),
														A2($elm$html$Html$br, _List_Nil, _List_Nil),
														$elm$html$Html$text('God fortsat søgning.')
													]) : _List_Nil)
											]);
								}
							}())
						]))
				]));
	});
var $author$project$Search$view = function (model) {
	if (model.$ === 'Failure') {
		return $elm$html$Html$text('Failed');
	} else {
		var modelData = model.a;
		return A6($author$project$Search$searchForm, modelData.categorizations, modelData.sorting, modelData.state, modelData.labels, modelData.freeTextQuery, modelData.locationPicker);
	}
};
var $author$project$Search$main = $elm$browser$Browser$element(
	{init: $author$project$Search$init, subscriptions: $author$project$Search$subscriptions, update: $author$project$Search$update, view: $author$project$Search$view});
_Platform_export({'Search':{'init':$author$project$Search$main($elm$json$Json$Decode$string)(0)},'Services':{'init':$author$project$Services$main($elm$json$Json$Decode$int)(0)}});}(this));