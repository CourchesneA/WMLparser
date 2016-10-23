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
var OUTERTEXT = new RegExp(/.+?(?={{|{:|:})/);         //!TSTART,DSTART, can be PSTART  TODO do not catch PSTART
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

/*function tester(testset){
    for (var s in testset){
        var p = eval(s);
        if(p == scanit(s, TOKENSET)){
            console.log("true");
        }else{
            console.log("false");
        }
    }
}
console.log(tester(testset));*/
//console.log(scanit(str));

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
        OUTERTEXT : true,
        TSTART : true,
        DSTART : true
    }

    if (!s.str){        //Check for end of string
        return null;
    }
    var t = removeToken(s,Outset);
    

    switch (t.token) {
        case OUTERTEXT:
            return {
                name: "outer",
                OUTERTEXT: t.tokenvalue,
                templateinvocation: null,
                templatedef: null,
                next: parseOuter(s)
            }

        case TSTART:        //Template invocation
            return {
                name: "outer",
                OUTERTEXT: null,
                templateinvocation: parseTemplateInvocation(s),
                templatedef: null,
                next: parseOuter(s)
            }

        case DSTART:        //Definition invocation
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
        INNERTEXT : true,
        PSTART : true,
        TSTART : true,
        DSTART : true,
        PIPE : true,
        TEND : true
    }

    if (!s.str){        //Check for end of string
        return null;
    }
    var rvalue = {
        name : "templateinvocation",
        itext : null,
        targs : null
    }
    for(var t=removeToken(s,Inset); t.token != TEND; t= removeToken(s,Inset)){

        var ans = null;
        switch (t.token) {
            case INNERTEXT: //this is itext
                ans = parseIText(s, INNERTEXT);    //call the function witht he found first token
                break;

            case PSTART:    // {{{
                ans = parseIText(s, PSTART);
                break;

            case TSTART:    // {{
                ans = parseIText(s,TSTART);
                break;

            case DSTART:    // {:
                ans = parseIText(s,DSTART);

            case PIPE:      // |
                rvalue.targs = parseTArgs(s);
        }
        rvalue.itext = ans.node;
        switch (ans.nextToken) {
            case PIPE:                  //Last token was a pipe, parse targs and return the AST
                rvalue.targs = parseTArgs(s);
                return rvalue;
            case TEND:
                return rvalue;  //The template invocation is over, return the AST
        }
    }
    return rvalue;
}

function parseTemplateDef(s){

}

function parseTParam(s){

}

function parseIText(s,ftoken){

    return {
        node: null,
        nextToken: null     //should be either PIPE or TEND
    }
}
function parseTArgs(s){

}

function removeToken(s, tset){  //take a string and a tokenset
    var t = scan(s.str, tset);
    s.str = s.str.substr(t.tokenvalue.length);
    return t;
}

function parse(s){
    var reduce = {str: s};
    parseOuter(reduce);
}





