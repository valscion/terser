arrow_functions: {
    options = {
        arrows: true,
    }
    input: {
        (a) => b;  // 1 args
        (a, b) => c;  // n args
        () => b;  // 0 args
        (a) => (b) => c;  // func returns func returns func
        (a) => ((b) => c);  // So these parens are dropped
        () => (b,c) => d;  // func returns func returns func
        a=>{return b;}
        a => 'lel';  // Dropping the parens
    }
    expect_exact: "a=>b;(a,b)=>c;()=>b;a=>b=>c;a=>b=>c;()=>(b,c)=>d;a=>b;a=>\"lel\";"
}

arrow_return: {
    options = {
        arrows: true,
    }
    input: {
        () => {};
        () => { return; };
        a => { return 1; }
        a => { return -b }
        a => { return b; var b; }
        (x, y) => { return x - y; }
    }
    expect_exact: "()=>{};()=>{};a=>1;a=>-b;a=>{return b;var b};(x,y)=>x-y;"
}

regression_arrow_functions_and_hoist: {
    options = {
        hoist_vars: true,
        hoist_funs: true
    }
    input: {
        (a) => b;
    }
    expect_exact: "a=>b;"
}

regression_assign_arrow_functions: {
    input: {
        oninstall = e => false;
        oninstall = () => false;
    }
    expect: {
        oninstall=e=>false;
        oninstall=()=>false;
    }
}

destructuring_arguments_1: {
    input: {
        (function ( a ) { });
        (function ( [ a ] ) { });
        (function ( [ a, b ] ) { });
        (function ( [ [ a ] ] ) { });
        (function ( [ [ a, b ] ] ) { });
        (function ( [ a, [ b ] ] ) { });
        (function ( [ [ b ], a ] ) { });

        (function ( { a } ) { });
        (function ( { a, b } ) { });

        (function ( [ { a } ] ) { });
        (function ( [ { a, b } ] ) { });
        (function ( [ a, { b } ] ) { });
        (function ( [ { b }, a ] ) { });

        ( [ a ] ) => { };
        ( [ a, b ] ) => { };

        ( { a } ) => { };
        ( { a, b, c, d, e } ) => { };

        ( [ a ] ) => b;
        ( [ a, b ] ) => c;

        ( { a } ) => b;
        ( { a, b } ) => c;
    }
    expect: {
        (function(a){});
        (function([a]){});
        (function([a,b]){});
        (function([[a]]){});
        (function([[a,b]]){});
        (function([a,[b]]){});
        (function([[b],a]){});

        (function({a}){});
        (function({a,b}){});

        (function([{a}]){});
        (function([{a,b}]){});
        (function([a,{b}]){});
        (function([{b},a]){});

        ([a])=>{};
        ([a,b])=>{};

        ({a})=>{};
        ({a,b,c,d,e})=>{};

        ([a])=>b;
        ([a,b])=>c;

        ({a})=>b;
        ({a,b})=>c;
    }
}

destructuring_arguments_2: {
    input: {
        (function([]) {});
        (function({}) {});
        (function([,,,,,]) {});
        (function ([a, {b: c}]) {});
        (function ([...args]) {});
        (function ({x,}) {});
        class a { *method({ [thrower()]: x } = {}) {}};
        (function(a, b, c, d, [{e: [...f]}]){})(1, 2, 3, 4, [{e: [1, 2, 3]}]);
    }
    expect: {
        (function([]) {});
        (function({}) {});
        (function([,,,,,]) {});
        (function ([a, {b: c}]) {});
        (function ([...args]) {});
        (function ({x,}) {});
        class a { *method({ [thrower()]: x } = {}) {}};
        (function(a, b, c, d, [{e: [...f]}]){})(1, 2, 3, 4, [{e: [1, 2, 3]}]);
    }
}

destructuring_arguments_3: {
    beautify = {
        ecma: 2015
    }
    input: {
        function fn3({x: {y: {z: {} = 42}}}) {}
        const { a = (function () {}), b = (0, function() {})  } = {};
        let { c = (function () {}), d = (0, function() {})  } = {};
        var { e = (function () {}), f = (0, function() {})  } = {};
    }
    expect_exact: "function fn3({x:{y:{z:{}=42}}}){}const{a=function(){},b=(0,function(){})}={};let{c=function(){},d=(0,function(){})}={};var{e=function(){},f=(0,function(){})}={};"
}

destructuring_parameters_get_set: {
    beautify = {
        ecma: 2015
    }
    input: {
        function default_get({ get = "PASS" }) { return get }
        function default_set({ set = "PASS" }) { return set }
        const default_get_arrow = ({ get = "PASS" }) => { return get }
        const default_set_arrow = ({ set = "PASS" }) => { return set }

        console.log(default_get({}))
        console.log(default_set({}))
        console.log(default_get_arrow({}))
        console.log(default_set_arrow({}))
    }
    expect_stdout: [
        "PASS",
        "PASS",
        "PASS",
        "PASS",
    ]
}

default_arguments: {
    beautify = {
        ecma: 2015
    }
    input: {
        function x(a = 6) { }
        function x(a = (6 + 5)) { }
        function x({ foo } = {}, [ bar ] = [ 1 ]) { }
    }
    expect_exact: "function x(a=6){}function x(a=6+5){}function x({foo}={},[bar]=[1]){}"
}

keep_default_arg_when_undefined: {
    options = {
        keep_fargs: true,
        evaluate: true,
    }
    input: {
        function x(a = void 0) { }
        console.log(x.length)
    }
    expect: {
        function x(a = undefined) { }
        console.log(x.length)
    }
}

default_values_in_destructurings: {
    beautify = {
        ecma: 2015
    }
    input: {
        function x({a=(4), b}) {}
        function x([b, c=(12)]) {}
        var { x = (6), y } = x;
        var [ x, y = (6) ] = x;
    }
    expect_exact: "function x({a=4,b}){}function x([b,c=12]){}var{x=6,y}=x;var[x,y=6]=x;"
}

accept_duplicated_parameters_in_non_strict_without_spread_or_default_assignment: {
    input: {
        function a(b, b){}
        function b({c: test, c: test}){}
    }
    expect: {
        function a(b, b){}
        function b({c: test, c: test}){}
    }
}

accept_destructuring_async_word_with_default: {
    input: {
        console.log((({ async = "PASS" }) => async)({}))
    }
    expect_stdout: "PASS"
}
