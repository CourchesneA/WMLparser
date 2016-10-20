/*Anthony Courchesne
* 260688650
* COMP302 ast 2
* october 2016
*/
//---------------Question 1----------------
//
//I will use Regex object for recognizing the tokens

var TSTART = new RegExp("{{");
var TEND = new RegExp("}}");
var PIPE = new RegExp("|");
var OUTERTEXT = new RegExp(".+?(?=\||{{)"); 
var INNERTEXT = new RegExp(".+?(?=\||{{|{:|:})");    //math everything but TSTART (PSTART is included),DSTART, PIPE, DEND using positive lookahead
var DSTART = new RegExp("{:");
var DEND = new RegExp(":}");
var INNERDTEXT = new RegExp("");
var PSTART = new RegExp("{{{");
var PEND = new RegExp("}}}");
var PNAME = new RegExp("");


//----------------Question 2----------------
//
// Test function 
function scanit(s) {
    var sout = "";{
        while (s) {
            var t = scan (sm TOKENSET);
            sout += t.tokenvalue;
            s = s.substr(t.tokenvaluie.length);
        }
    }
}