//Make render queue from makers

/*stuff you'll need:

//idea for workaround to get compmarker names:
- make temp nullObject
- create expression to retrieve compMarkers:
	thisComp.marker.key(1).comment;
- loop through all markers inside expression and create text for it
- read text layer into script and put values in array
- use array values(marker names) for render export names


*/

{
app.beginUndoGroup('make render queue from markers');

var thisComp = app.project.activeItem;

//Delete marker null, if one exists + create null to contain marker info
while(thisComp.layer(1).name == "#MARKER_INFO"){
	thisComp.layer(1).locked = false;
	thisComp.layer(1).remove();
}
//define expression to put inside "source text" property of text layer
var sourceText = 'var contents = ""; \
for(i=1;i<=thisComp.marker.numKeys;i++){ \
	contents = (contents+thisComp.marker.key(i).comment+"#"+thisComp.marker.key(i).time+"/"); \
}; \
"/"+contents;';
var tempNull = thisComp.layers.addText(toString());
	tempNull.name = "#MARKER_INFO";
	tempNull.property("Source Text").expression = sourceText;
	tempNull.property("Source Text").value.justification = ParagraphJustification.LEFT_JUSTIFY;
	tempNull.guideLayer = true;
	tempNull.shy = true;
	tempNull.duration = thisComp.length;
	tempNull.enabled = true;
	tempNull.moveToBeginning();
	tempNull.selected = false;
	tempNull.locked = false;
//read text layer contents and create markers on null object
var markerInfo = tempNull.property("Source Text").value.toString();
function convertMarkers(){
	var hashes = [];
	var slashes = [];
	for(i=0;i<markerInfo.length;i++){
		var curL = markerInfo.slice(i,i+1);
		if(curL=="#"){
			hashes.push(i);
		}
		if(curL=="/"){
			slashes.push(i);
		}
	}
	alert("hash'n'slash"+'\rhashes= '+hashes.toString()+'\rslashes= '+slashes.toString());
	for(i=0;i<hashes.length;i++){
		var hashCheck = hashes[i];
		var slashCheck = slashes[i];
		var markerName = markerInfo.slice(slashCheck+1,hashCheck);
		var markerPos = markerInfo.slice(hashCheck+1,slashes[i+1]);
		var Lmarker = new MarkerValue(markerName);
		tempNull.property("Marker").setValueAtTime(markerPos, Lmarker);	//create marker on tempNull
	}
}
//var Lmarker = new MarkerValue(mName);
//tempNull.property("Marker").setValueAtTime(t, Lmarker);
convertMarkers();

/*
var layermarkername = thisComp.layer(1).property("Marker").keyValue(1).comment;
var comp_marker_null = thisComp.layer("comp_markers").property("Source Text").value;
alert (comp_marker_null);
alert("layer+ "+layermarkername+"\rcomp+ "+compmarkername);
*/


app.endUndoGroup();
}