{
clearOutput();
//open browser window to let user select destination folder
var projectFile = app.project.file.name;
var projectDir = app.project.file.fsName.slice(0,app.project.file.fsName.length-projectFile.length);

function setDefaultOutput(){
	var fold = new Folder(projectDir+'/'+'renders');
	fold.create();
	return fold.fsName;
}
function setCustomOutput(){
	var renderLoc = new Folder(Folder.selectDialog("Select a render output folder...").toString())
	return renderLoc.fsName;
}
function createSubDir(parentDir){
	var renderLoc = parentDir;
	if(renderLoc!='/null'){
		// make new folder and plot the destination folder+’/newfoldername’
		var nName = prompt('enter new name for new folder');
		var fold = new Folder (renderLoc+'/'+nName);
		if(nName!=null){
			fold.create();
		}
	}
	return fold.fsName;
}
// ask if user wants to define custom output
var customOut = confirm('You wanna set a custom output path?\nby default the renders will be placed in a "renders"folder next to this project file.');
var output = customOut==true?setCustomOutput():setDefaultOutput();
alert(output);

}