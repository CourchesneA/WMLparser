/*Anthony Courchesne
* 260688650
* COMP302 ast 2
* october 2016
*/
//---------------Question 1----------------
//
//I will use Regex object for recognizing the tokens
console.log("START");
var TSTART = new RegExp("{{");
var TEND = new RegExp("}}");
var PIPE = new RegExp("|");
var OUTERTEXT = new RegExp(".+?(?=\||{{)"); 
var INNERTEXT = new RegExp(/.+?(?=\||{{|{:|:})/g);    //math everything but TSTART (PSTART is included),DSTART, PIPE, DEND using positive lookahead
var DSTART = new RegExp("{:");
var DEND = new RegExp(":}");
var INNERDTEXT = new RegExp("");
var PSTART = new RegExp("{{{");
var PEND = new RegExp("}}}");
var PNAME = new RegExp("");

//Q1 tests//

var str = "{: hello | you | Hi there <b> {{{ you }}} </b>:}";
var str2 = "hello  you  Hi there <b>  you }}} </b>:}";
//var reg = new RegExp("/.+?(?={{{/");
var reg2 = new RegExp(/.+?(?=\||{{|{:|:})/g);
found = reg2.exec(str2);
//var found = str2.match(reg);
console.log(found);

//TODO Check if the pipe as to be consumed
//----------------Question 2----------------
//
// Test function 
/*function scanit(s) {
    var sout = "";{
        while (s) {
            var t = scan (sm TOKENSET);
            sout += t.tokenvalue;
            s = s.substr(t.tokenvaluie.length);
        }
    }
}*/