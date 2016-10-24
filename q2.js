/*Anthony Courchesne
* 260688650
* COMP302 ast 2
* october 2016
*/
//----------------Question 2----------------
//
// Given test function 
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