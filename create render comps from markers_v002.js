//Make render queue from makers

/*stuff you'll need:

## ideas of addons:
- define render path at start of script
- define output module at start of script
- define render settings at start of script
- clear renderQueue before adding new render items


*/

{
app.beginUndoGroup('make render queue from markers');

//var renderDest = prompt('paste the path you want to render to');
var projPath = app.project.file!=null?app.project.file:'save your shit!';
var thisComp = app.project.activeItem;

	//CREATE GUI HERE





var renderLoc;
var newLoc = true;
newLoc==true?renderLoc = Folder.selectDialog("Select a render output folder..."):false;

	// MAIN BLOCK OF CODE

//check if user has pressed cancel when choosing new path
if(renderLoc!=undefined || newLoc==false){
//Delete marker null, if one exists + create null to contain marker info
while(thisComp.layer(1).name == "#MARKER_INFO"){
	thisComp.layer(1).locked = false;
	thisComp.layer(1).remove();
}
//expression for "source text" property of text layer (temp null)
var markerExpression = 'var contents = ""; \
for(i=1;i<=thisComp.marker.numKeys;i++){ \
	contents = (contents+thisComp.marker.key(i).comment+"#"+thisComp.marker.key(i).time+"/"); \
}; \
"/"+contents;';
var tempNull = thisComp.layers.addText();
	tempNull.name = "#MARKER_INFO";
	tempNull.property("Source Text").expression = markerExpression;
	tempNull.property("Source Text").value.justification = ParagraphJustification.LEFT_JUSTIFY;
	tempNull.guideLayer = true;
	tempNull.shy = true;
	tempNull.duration = thisComp.length;
	tempNull.enabled = false;
	tempNull.moveToBeginning();
	tempNull.selected = false;
	tempNull.locked = false;
var markerInfo = tempNull.property("Source Text").value.toString();
var renderMarkers = []; //you'll need this to generate render outputs

//Housekeeping reads text layer's contents and creates markers on null object (that way the script can understand them)
function housekeeping(){
	writeLn('doing housekeeping');
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
	// create markers:
	for(i=0;i<hashes.length;i++){
		var hashCheck = hashes[i];
		var slashCheck = slashes[i];
		var markerName = markerInfo.slice(slashCheck+1,hashCheck);
		var markerPos = markerInfo.slice(hashCheck+1,slashes[i+1]);
		var Lmarker = new MarkerValue(markerName);
		tempNull.property("Marker").setValueAtTime(markerPos, Lmarker);	//dis make marker!
		renderMarkers.push([markerPos,markerName]);
	}
}
housekeeping();

//ChangeRenderLocations changes the render output destination and the filename to the marker's names.
//needs input: location, length of render queue before new items were added (defined at '//ADD ITEMS TO RENDER QUEUE')
function ChangeRenderLocations(loc,firstItem){
	var newLocation = loc;
	if (newLocation != null){
		app.beginUndoGroup('change render locations');
		// Process all render queue items whose status is set to Queued.
		var renderQ = app.project.renderQueue;
		var renderQlen = renderQ.numItems;
		for (i = 1; i <= renderQlen-firstItem; ++i) {
			var curItem = app.project.renderQueue.item(firstItem+i);
			if (curItem.status == RQItemStatus.QUEUED) {
				// Change all output modules for the current render queue item.
				var name = renderMarkers[i-1][1];
				for (j = 1; j <= curItem.numOutputModules; ++j) {
					var curOM = curItem.outputModule(j);
					curOM.file = new File(newLocation.toString() + "/" + name);
				}
			}
		}
		app.endUndoGroup();
	}
}
	//ADD ITEMS TO RENDER QUEUE
var renderQ = app.project.renderQueue;
var renderQlen = renderQ.numItems;
//reset working area to full range
thisComp.workAreaStart = thisComp.displayStartTime;
thisComp.workAreaDuration = thisComp.duration;
//create render item array from markers
for(i=0;i<renderMarkers.length;i++){
	var thisMarker = renderMarkers[i];
	var nextMarker = thisComp.duration;
		if(renderMarkers[i+1] != undefined){
			nextMarker = renderMarkers[i+1][0];
		}else{nextMarker = thisComp.duration;}
	var markerTime = thisMarker[0];
	var markerName = thisMarker[1];
	var duration = nextMarker-markerTime;
	thisComp.workAreaDuration = duration;
	thisComp.workAreaStart = thisMarker[0];
	writeLn(i+"tiddn ");
//add render item
	renderQ.items.add(thisComp);
		var curItem = renderQ.item(renderQlen+i+1);
		curItem.timeSpanStart = thisMarker[0];
		curItem.timeSpanDuration = duration;
		//curItem.outputModule(1).file = renderDest;
}
//SET NEW RENDER DESTINATION
newLoc==true?ChangeRenderLocations(renderLoc,renderQlen):false;
}





app.endUndoGroup();
}