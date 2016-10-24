/*Anthony Courchesne
* 260688650
* COMP302 ast 2
* october 2016
*/
//---------------Question 1----------------
//
//I will use Regex object for recognizing the tokens
var TSTART = new RegExp("^ *{{");
var TEND = new RegExp("^ *}}");
var PIPE = new RegExp("^ *\\|");
var OUTERTEXT = new RegExp(/.+?(?={{|{:|:}|$)/);         //!TSTART,DSTART, can be PSTART  TODO do not catch PSTART
var INNERTEXT = new RegExp(/.+?(?=\||{{|{:|}})/);    //match everything but TSTART (PSTART is included),DSTART, PIPE, TEND using positive lookahead
var DSTART = new RegExp("^ *{:");
var DEND = new RegExp("^ *:}");
var INNERDTEXT = new RegExp(/.+?(?=\||{{|{:|:})/);            //! TSTART, DSTART, PIPE, PSTART, DEND
var PSTART = new RegExp("^ *{{{");
var PEND = new RegExp("^ *}}}");
var PNAME = new RegExp(/.+?(?=\||}}})/);     //anything but PIPE and  PEND

//TODO, include new line
//Q1 tests//
/*
var str = "{: hello | you | Hi there <b> {{{ you }}} </b>:}";
var str2 = " hello | you | Hi there <b> {{{ you }}} this {{ t }} </b>:}";
//var reg = new RegExp("/.+?(?={{{/");
var reg2 = new RegExp(/.+?(?=\||{{|{:|:})/);
found = reg2.exec(str2);
//var found = str2.match(reg);
console.log(found);
*/
//----------------Question 2----------------
//
// Test function 
function scanit(s) {
    var sout = "";{
        while (s) {
            var t = scan (s ,TOKENSET);
            sout += t.tokenvalue;
            s = s.substr(t.tokenvalue.length);
        }
    }
    return sout;
}
var TOKENSET = {
    PSTART: true,
    PEND: true,
    TSTART: true,
    TEND: true,
    PIPE: true,
    DSTART: true,
    DEND: true,
    INNERTEXT: true,
    INNERDTEXT: true,
    PNAME: true,
    OUTERTEXT: true
}

//return the first token object
function scan(string, TOKENSET){
    for (var possibleToken in TOKENSET){
        var result = null;
        var re = eval(possibleToken);
        result = re.exec(string);
        if (result != null){
            return {token:possibleToken, tokenvalue:result[0]};
        }
    }
}

//More tests
//console.log(scan(str2,TOKENSET));
var testset = {
    str1 : "{: foo | test | {{test}} {{{t}}} t:}",
    str2 : "{{ test | {{{bar}}}}}",
    str3 : "{:says | x | y | {{{x}}} says say | {{{y}}} }} :}",
    str4 : "{{ {{ getfunc | say }} | there }}",
    str5 : "{:factorial | n | {{#ifeq | {{{n}}} | 0 | 1 | {{times | {{{n }}} | {{factorial | {{#expr | {{{n}}} -1 }} }} }} }} :}"
}


//----------Question 3---------------

//Parse in AST, one node per grammar rule applied.
//Each node have name (rule name - non terminal) and fields for each (non terminal) child objecet, including tokens
//where the content depends on the input string (OUTER/INNERTEXT, PNAME, DNAME).
//Where choice is possible, unused fields should have the value null

//First, scan tokens

//Those functions use scan and return AST
function parseOuter(s){
    //The parameter is in fact an object that contains a string so it is passed by reference to modify it within any parse function
    var Outset = {
        TSTART : true,
        DSTART : true,
        OUTERTEXT : true
    }

    if (!s.str){        //Check for end of string
        return null;
    }
    var t = removeToken(s,Outset);
    

    switch (t.token) {
        case "OUTERTEXT":
            return {
                name: "outer",
                OUTERTEXT: t.tokenvalue,
                templateinvocation: null,
                templatedef: null,
                next: parseOuter(s)
            }

        case "TSTART":        //Template invocation
            return {
                name: "outer",
                OUTERTEXT: null,
                templateinvocation: parseTemplateInvocation(s),
                templatedef: null,
                next: parseOuter(s)
            }

        case "DSTART":        //Definition invocation
            return {
                name: "outer",
                OUTERTEXT: null,
                templateinvocation: null,
                templatedef: parseTemplateDef(s),
                next: parseOuter(s)
            }
    }

}

function parseTemplateInvocation(s){
    // return template invocation ADT
    //<templateinvocation> ::= TSTART <itext> <targs> TEND
    var Inset = {
        PSTART : true,
        TSTART : true,
        DSTART : true,
        PIPE : true,
        TEND : true,
        INNERTEXT : true,
    }

    if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "templateinvocation",
        itext : null,
        targs : null
    }

    //Since we assume not empty and legal syntax, first part will be itext up to PIPE or TEND
    var ans = parseIText(s);

    rvalue.itext = ans.node;
    //var nextToken = ans.nextToken;      //last token get from the string, Should be TEND or PIPE
    switch(ans.nextToken){
        case "TEND":
            break;
        case "PIPE":
            rvalue.targs = parseTArgs(s);
            break;
    }
    return rvalue;
}

function parseTemplateDef(s){
    //Similar to templateinvocation
     var Inset = {
        PSTART : true,
        TSTART : true,
        DSTART : true,
        PIPE : true,
        DEND : true,
        INNERDTEXT : true,
    }

    if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "templatedef",
        dtext : null,
        dargs : null
    }

    //Since we assume not empty and legal syntax, first part will be itext up to PIPE or DEND
    var ans = parseDText(s);

    rvalue.dtext = ans.node;
    //var nextToken = ans.nextToken;      //last token get from the string, Should be TEND or PIPE
    switch(ans.nextToken){
        case "DEND":
            break;
        case "PIPE":
            rvalue.dargs = parseDArgs(s);
            break;
    }
    return rvalue;

}

function parseTParam(s){
     if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "tparam",
        PNAME : null
    }
    var tset = {
        PNAME : true
    }

    var t = removeToken(s,tset);
    rvalue.PNAME = t.tokenvalue;
    removeToken(s, {PEND : true});      //remove the token PEND since it will not be usefull (No error checking, expecting good input)
    return rvalue;
}

function parseIText(s){
    var Inset = {
        PSTART : true,
        TSTART : true,
        DSTART : true,
        PIPE : true,
        TEND : true,
        INNERTEXT : true
    }

    if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "itext",
        INNERTEXT : null,
        templateinvocation : null,
        templatedef : null,
        tparam : null,
        next : null
    }

    var t = null;
    t = removeToken(s, Inset);

    switch (t.token) {

        case "INNERTEXT":             //Set itext INNERTEXT and parse next itext
            rvalue.INNERTEXT = t.tokenvalue;
            break;

        case "TSTART":
            rvalue.templateinvocation = parseTemplateInvocation(s);
            break;

        case "DSTART":
            rvalue.templatedef = parseTemplateDef(s);
            break;

        case "PSTART":
            rvalue.tparam = parseTParam(s);
            break;

        case "PIPE":
            return {
                node: null,
                nextToken: t.token
            }

        case "TEND":
            return {
                node: null,
                nextToken: t.token
            }

    }
    var ans = parseIText(s);    //parse the next itext
    var nextToken = null;
    if(ans.nextToken == "PIPE" || ans.nextToken == "TEND"){
        nextToken = ans.nextToken
    }
    rvalue.next = ans.node;

    return {
        node: rvalue,
        nextToken: nextToken     //should be either PIPE or TEND
    }
}

function parseDText(s){
    var InDset = {
        PSTART: true,
        TSTART: true,
        DSTART: true,
        PIPE: true,
        DEND: true,
        INNERDTEXT: true
    }

    if (!s.str) {        //Check for end of string
        return null;
    }
    var rvalue = {
        name: "dtext",
        INNERDTEXT: null,
        templateinvocation: null,
        templatedef: null,
        tparam: null,
        next: null
    }

    var t = null;
    t = removeToken(s, InDset);

    switch (t.token) {

        case "INNERDTEXT":             //Set itext INNERTEXT and parse next itext
            rvalue.INNERDTEXT = t.tokenvalue;
            break;

        case "TSTART":
            rvalue.templateinvocation = parseTemplateInvocation(s);
            break;

        case "DSTART":
            rvalue.templatedef = parseTemplateDef(s);
            break;

        case "PSTART":
            rvalue.tparam = parseTParam(s);
            break;

        case "PIPE":
            return {
                node: null,
                nextToken: t.token
            }

        case "DEND":
            return {
                node: null,
                nextToken: t.token
            }

    }
    var ans = parseDText(s);    //parse the next itext
    var nextToken = null;
    if (ans.nextToken == "PIPE" || ans.nextToken == "DEND") {
        nextToken = ans.nextToken
    }
    rvalue.next = ans.node;

    return {
        node: rvalue,
        nextToken: nextToken     //should be either PIPE or TEND
    }
}

function parseTArgs(s){
     
    if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "targs",
        itext : null,
        next : null
    }

    //Since we assume not empty and legal syntax, first part will be itext up to PIPE or TEND
    var ans = parseIText(s);
    
    rvalue.itext = ans.node;
    var t = ans.nextToken;      //last token get from the string, Should be TEND or PIPE
    switch(ans.nextToken){
        case "TEND":
            break;
        case "PIPE":
            rvalue.next = parseTArgs(s);
            break;
    }
    return rvalue;
}

function parseDArgs(s){

    if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "dargs",
        dtext : null,
        next : null
    }

    //Since we assume not empty and legal syntax, first part will be itext up to PIPE or TEND
    var ans = parseDText(s);
    
    rvalue.dtext = ans.node;
    var t = ans.nextToken;      //last token get from the string, Should be TEND or PIPE
    switch(ans.nextToken){
        case "TEND":
            break;
        case "PIPE":
            rvalue.next = parseDArgs(s);
            break;
    }
    return rvalue;
}

function removeToken(s, tset){  //take a string and a tokenset
    var t = scan(s.str, tset);
    s.str = s.str.substr(t.tokenvalue.length);
    return t;
}

function parse(s){
    //Define the global string that will be consumed token by token
    var consume = {str: s};
    return parseOuter(consume);
}

//<<<<<<< HEAD
var teststr = "outer 1 {{ invoc2 | param2 }} outer2";
//=======
//helper
function printASTIndent(node, tabVal){
	if(typeof tabVal === 'undefined'){
		tabVal = 0;
	}
	var tabs = "";
	for(var i = 0; i < tabVal; i++){
		tabs= tabs.concat("	");
	}
	var result = "";
	for(var param in node){
		if (node.hasOwnProperty(param)){
			var curNode;
			if(typeof node[param] === 'object' && node[param] !== null){
				curNode ='\n' + printASTIndent(node[param], tabVal+1);
				result +=tabs + param +":" + curNode;

			}
			else{
				curNode = node[param];
				result +=tabs + param +":" + curNode + '\n';
			}
		}
	}
	return result;
}


//var teststr = "outer 1 {{invoc {{ invoc2 | param2 }}| param }} outer2";
//var teststr = "{:definition|arg1 {{{you}}} :}";
//>>>>>>> cee6dc78f8c96736655e0d2c876a712a93f6aa69
var teststr = "outer 1 {{ invoc2 | param2 }} outer 2"
var done = parse(teststr);
console.log(done);
console.log("Print after this");
console.log(printAST(done));
//console.log(printASTIndent(done, 4));


//TODO investigate line feed and trim

//-----------------Question 4---------------------

function printAST(a){
    return printOuter(a);
}

function printOuter(a){
    var rvalue = "";
    for (var rule in a) {
        if (!eval(rule)) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'INNERTEXT':
                rvalue += eval(rule);
                break;

            case 'templateinvoc':
                rvalue += printTInvoc(eval(rule));
                break;

            case 'templatedef':
                rvalue += printTDef(eval(rule));
                break;

            case 'next':
                rvalue += printOuter(eval(rule));
        }
    }
    return rvalue;
}

function printTInvoc(a){
    var rvalue = "";
    for (var rule in a) {
        if (!eval(rule)) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'itext':
                rvalue += printIText(eval(rule));
                break;

            case 'targs':
                rvalue += printTArgs(eval(rule));
                break;
        }
    }
    return "{{" + rvalue + "}}";
}
function printTDef(a){
    var rvalue = "";
    for (var rule in a) {
        if (!eval(rule)) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'dtext':
                rvalue += printDText(eval(rule));
                break;

            case 'dargs':
                rvalue += printDArgs(eval(rule));
                break;

        }
    }
    return "{:"+rvalue+":}";
}

function printDText(a){
    var rvalue = "";
    for (var rule in a) {
        if (!eval(rule)) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'INNERDTEXT':
                rvalue += eval(rule);
                break;

            case 'templateinvocation':
                rvalue += printTInvoc(eval(rule));
                break;

            case 'templatedef':
                rvalue += printTDef(eval(rule));
                break;

            case 'tparam':
                rvalue += printTParam(eval(rule));
                break;

            case 'next':
                rvalue += printDText(eval(rule));
                break;
        }
    }
    return rvalue;
}

function printDArgs(a){

    var rvalue = "";
    for (var rule in a) {
        if (!eval(rule)) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'dtext':
                rvalue += printDText(eval(rule));
                break;

            case 'next':
                rvalue += printDArgs(eval(rule));
                break;

        }
    }
    return "|" + rvalue;
}

function printIText(a){
    var rvalue = "";
    for(var rule in a){
        if(!eval(rule)){
            continue;       //property is null, next property
        }
        switch(rule){
            case 'INNERTEXT':
                rvalue+=eval(rule);
                break;

            case 'templateinvocation':
                rvalue+= printTInvoc(eval(rule));
                break;

            case 'templatedef':
                rvalue+= printTDef(eval(rule));
                break;

            case 'tparam':
                rvalue+= printTParam(eval(rule));
                break;

            case 'next':
                rvalue+= printIText(eval(rule));
                break;
        }
    }
    return "?"+rvalue;
}

function printTParam(a){
    var rvalue = "";
    for(var rule in a){
        if(!eval(rule)){
            continue;       //property is null, next property
        }
        switch(rule){
            case 'PNAME':
                rvalue+=eval(rule);
                break;
        }
    }
    return "{{{"+rvalue+"}}}";
}

function printTArgs(a){
    var rvalue = "";
    for(var rule in a){
        if(!eval(rule)){
            continue;       //property is null, next property
        }
        switch(rule){
            case 'itext':
                rvalue+=printIText(rule);
                break;

            case 'next':
                rvalue+=printTArgs(rule);
                break;
        }
    }
    return "|"+rvalue;
}




