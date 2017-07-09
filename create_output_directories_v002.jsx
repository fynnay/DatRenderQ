{
/*
//resources used:
http://aenhancers.com/viewtopic.php?f=8&t=744

*/


clearOutput(); //clears the info window console
	// RENDER OUTPUT SETTINGS
var projectFile = app.project.file.name;
var projectDir = app.project.file.fsName.slice(0,app.project.file.fsName.length-projectFile.length);

function setDefaultOutput(){
	var fold = new Folder(projectDir+'/'+'renders');
	if (fold.exists==false){
		alert('making new render folder');
		fold.create();
	}
	return fold.fsName;
}
function setCustomOutput(){
	var renderLoc = new Folder(Folder.selectDialog("Select a render output folder...").toString())
	return renderLoc.fsName;
}
function createSubDir(parentDir,subName){
	var renderLoc = parentDir;
	if(renderLoc!='/null'){
		// make new folder and plot the destination folder+’/newfoldername’
		var nName = subName;//prompt('enter new name for new folder');
		var fold = new Folder (renderLoc+'/'+nName);
		if(fold.exists==true){
		}else if(fold.exists==false){
			fold.create();
		}
	}
	return fold.fsName;
}

function appendFrames(){
	var append = '[';
	var checkLen = (thisComp.duration*thisComp.frameRate).toString().length;
	for(i=0;i<checkLen;i++){
		append = append+'#';
	}
	append = append+']';
	return append;
}

// //open browser window to ask if user wants to define custom output
var customOut = confirm('You wanna set a custom output path?\nby default the renders will be placed in a "renders"folder next to this project file.');
var output = customOut==true?setCustomOutput():setDefaultOutput();
	// RENDER QUEUE SETTINGS
function clearRenderQ(){
	while (renderQ.numItems>0){
		renderQ.item(renderQ.numItems).remove()
	}
}
var thisComp = app.project.activeItem;
var renderQ = app.project.renderQueue;
clearRenderQ(); //clear the render queue ####just for testing###
//renderQ.numItems>0?renderQ.item(1).remove():null;
renderQ.items.add(thisComp);
var outputName = thisComp.name;
var curRenderItem = renderQ.item(renderQ.numItems);
var appendFrames = false ==true?appendFrames():'';
var newPath = output+'/'+outputName+appendFrames;
var curOM = curRenderItem.outputModule(1);
	curOM.file = new File(newPath);

}