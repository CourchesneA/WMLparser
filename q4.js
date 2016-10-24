/*Anthony Courchesne
* 260688650
* COMP302 ast 2
* october 2016
*/
//--------Question 4-------------

/*PROGRAM DESCRIPTION

All the function are similar to printOuter. The take the node, print information that is in it 
or look in reference recursively.

*/

function printAST(a){
    return printOuter(a);
}

function printOuter(a){
    var rvalue = "";
    for (var rule in a) {
        if (!a[rule]) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'OUTERTEXT':
                rvalue += a[rule];
                break;

            case 'templateinvocation':
                rvalue += printTInvoc(a[rule]);
                break;

            case 'templatedef':
                rvalue += printTDef(a[rule]);
                break;

            case 'next':
                rvalue += printOuter(a[rule]);
        }
    }
    return rvalue;
}

function printTInvoc(a){
    var rvalue = "";
    for (var rule in a) {
        if (!a[rule]) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'itext':
                rvalue += printIText(a[rule]);
                break;

            case 'targs':
                rvalue += printTArgs(a[rule]);
                break;
        }
    }
    return "{{" + rvalue + "}}";
}
function printTDef(a){
    var rvalue = "";
    for (var rule in a) {
        if (!a[rule]) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'dtext':
                rvalue += printDText(a[rule]);
                break;

            case 'dargs':
                rvalue += printDArgs(a[rule]);
                break;

        }
    }
    return "{:"+rvalue+":}";
}

function printDText(a){
    var rvalue = "";
    for (var rule in a) {
        if (!a[rule]) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'INNERDTEXT':
                rvalue += a[rule];
                break;

            case 'templateinvocation':
                rvalue += printTInvoc(a[rule]);
                break;

            case 'templatedef':
                rvalue += printTDef(a[rule]);
                break;

            case 'tparam':
                rvalue += printTParam(a[rule]);
                break;

            case 'next':
                rvalue += printDText(a[rule]);
                break;
        }
    }
    return rvalue;
}

function printDArgs(a){

    var rvalue = "";
    for (var rule in a) {
        if (!a[rule]) {
            continue;       //property is null, next property
        }
        switch (rule) {
            case 'dtext':
                rvalue += printDText(a[rule]);
                break;

            case 'next':
                rvalue += printDArgs(a[rule]);
                break;

        }
    }
    return "|" + rvalue;
}

function printIText(a){
    var rvalue = "";
    for(var rule in a){
        if(!a[rule]){
            continue;       //property is null, next property
        }
        switch(rule){
            case 'INNERTEXT':
                rvalue+=a[rule];
                break;

            case 'templateinvocation':
                rvalue+= printTInvoc(a[rule]);
                break;

            case 'templatedef':
                rvalue+= printTDef(a[rule]);
                break;

            case 'tparam':
                rvalue+= printTParam(a[rule]);
                break;

            case 'next':
                rvalue+= printIText(a[rule]);
                break;
        }
    }
    return rvalue;
}

function printTParam(a){
    var rvalue = "";
    for(var rule in a){
        if(!a[rule]){
            continue;       //property is null, next property
        }
        switch(rule){
            case 'PNAME':
                rvalue+=a[rule];
                break;
        }
    }
    return "{{{"+rvalue+"}}}";
}

function printTArgs(a){
    var rvalue = "";
    for(var rule in a){
        if(!a[rule]){
            continue;       //property is null, next property
        }
        switch(rule){
            case 'itext':
                rvalue+=printIText(a[rule]);
                break;

            case 'next':
                rvalue+=printTArgs(a[rule]);
                break;
        }
    }
    return "|"+rvalue;
}