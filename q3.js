/*Anthony Courchesne
* 260688650
* COMP302 ast 2
* october 2016
*/
//----------Question 3---------------
//*****TO PARSE A STRING USE PARSE(STRING)**********

//PROGRAM DESCRIPTION
/* 
The funtion parse define an object that contain a string so I can pass it as a reference
and use the string as a global, modifiable variable

The function removeToken call the scan function and reduce the string in the s object by the correct amount

The others function use recursion to parse every component, one function for each grammar rule, which
correspond to 1 function call for each node in the AST.

To parse a string, use  the function parse(string)
*/

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
