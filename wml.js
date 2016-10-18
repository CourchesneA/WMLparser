// Main entry point when the user clicks compile
function compile() {
    var inArea = document.getElementById('idtextarea');
    var outDiv = document.getElementById('iddiv');
    var inText;
    // get input text
    if (inArea.value) inText=inArea.value;
    else inText = inText.innerHTML;

    setDebugText(inText);

    // parse and return the output
    var outText = ASTtoString(startParsing(inText));

    // display result, letting the browser interpret it as HTML
    outDiv.innerHTML = outText;
}

// These two functions are for your use, to display debug information.

// Clear existing debug text and display s
function setDebugText(s) {
    var dbgDiv = document.getElementById('iddebug');
	while (dbgDiv.firstChild) 
		dbgDiv.removeChild(dbgDiv.firstChild);
    addDebugText(s);
}

// Append s to existing debug text
function addDebugText(s) {
    var dbgDiv = document.getElementById('iddebug');
	var outNL = s.split(/\n/);
	for (var i=0;i<outNL.length;i++) {
		dbgDiv.appendChild(document.createTextNode(outNL[i]));
		dbgDiv.appendChild(document.createElement('br'));
	}
}

// Within here you should call your code to parse the input string.
// Whatever this function returns will be shown at the top of the page.
function startParsing(inText) {
    // return parse(intext);
}

// Within here you should call your code to convert your AST to a string.
function ASTtoString(a) {
    // return showAST(a);
    return '<i style="color:red;">...time...running...out...must...start...assignment...</i>';
}
