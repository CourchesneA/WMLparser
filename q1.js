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
