
/* read categories */
function fetchAllCategoriesPhotos(){

		if(fs.existsSync('./data/static/menuCategories.json')) {
	      fs.readFile('./data/static/menuCategories.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Category data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var categories = JSON.parse(data);
	          	categories.sort(); //alphabetical sorting 
	          	var categoryTag = '';

				for (var i=0; i<categories.length; i++){
					categoryTag = categoryTag + '<tr class="subMenuList" onclick="openSubMenuPhotos(\''+categories[i]+'\')"><td>'+categories[i]+'</td></tr>';
				}

				if(!categoryTag)
					categoryTag = '<p style="color: #bdc3c7">No Category added yet.</p>';
			

				document.getElementById("categoryAreaPhotos").innerHTML = categoryTag;
		}
		});
	    } else {
	      showToast('System Error: Unable to read Category data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}

function openSubMenuPhotos(subtype){	

		if(fs.existsSync('./data/static/mastermenu.json')) {
	      fs.readFile('./data/static/mastermenu.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	          		var mastermenu = JSON.parse(data); 

	          		var itemsInSubMenu = "";

					if(!subtype){
						subtype = mastermenu[0].category;
					}

	         
				for (var i=0; i<mastermenu.length; i++){

					if(mastermenu[i].category == subtype){
						itemsInSubMenu = '';
						for(var j=0; j<mastermenu[i].items.length; j++){
							var temp = encodeURI(JSON.stringify(mastermenu[i].items[j]));
							if(mastermenu[i].items[j].isPhoto){
								itemsInSubMenu = itemsInSubMenu + '<button onclick="openPhotoOptions(\''+mastermenu[i].items[j].name+'\', \''+mastermenu[i].items[j].code+'\', \'PHOTO_AVAILABLE\', \''+subtype+'\')" type="button" type="button" class="btn btn-both btn-flat product"><span class="bg-img" style="background: none !important;"><img src="data/photos/menu/'+mastermenu[i].items[j].code+'.jpg" alt="'+mastermenu[i].items[j].name+'" style="width: 110px; height: 110px;"></span><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
							}
							else{
								itemsInSubMenu = itemsInSubMenu + '<button onclick="openPhotoOptions(\''+mastermenu[i].items[j].name+'\', \''+mastermenu[i].items[j].code+'\', \'PHOTO_NOT_AVAILABLE\', \''+subtype+'\')" type="button" type="button" class="btn btn-both btn-flat product"><span class="bg-img"><div id="itemImage">'+getImageCode(mastermenu[i].items[j].name)+'</div></span><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
							}
						}
						break;
					}
				}
				
				document.getElementById("item-list").innerHTML = itemsInSubMenu;
				document.getElementById("posSubMenuTitle").innerHTML = subtype;

				if(!itemsInSubMenu){
					document.getElementById("item-list").innerHTML = '<p style="font-size: 18px; color: #bfbfbf; padding: 20px 0;">No available items in '+subtype+'</p>';
				}
		}
		});
	    } else {
	      showToast('System Error: Unable to read Menu data. Please contact Accelerate Support.', '#e74c3c');
	    }			

	//menuRenderArea
	document.getElementById("menuDetailsAreaPhotos").style.display = "block";
}


function openPhotoOptions(name, item, type, category){
	if(type == 'PHOTO_AVAILABLE'){ /* Photo Already Uploaded */
		document.getElementById("photoOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader"><b>'+name+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="loadPhotoCropper(\''+item+'\', \''+name+'\', \''+category+'\', 1)"><i class="fa fa-image" style=""></i><tag style="padding-left: 15px">Change Photo</tag></button> '+
                  '<button class="btn btn-danger tableOptionsButtonBig" onclick="removeItemPhoto(\''+item+'\', \''+category+'\')"><i class="fa fa-ban" style="color: #FFF"></i><tag style="padding-left: 15px">Remove Photo</tag></button> '+ 
                  '<button class="btn btn-default tableOptionsButton" onclick="hidePhotoOptions()">Close</button> ';
	}
	else if(type == 'PHOTO_NOT_AVAILABLE'){ /* No photo */
		document.getElementById("photoOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader"><b>'+name+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="loadPhotoCropper(\''+item+'\', \''+name+'\', \''+category+'\', 0)"><i class="fa fa-image" style=""></i><tag style="padding-left: 15px">Upload Photo</tag></button> '+ 
                  '<button class="btn btn-default tableOptionsButton" onclick="hidePhotoOptions()">Close</button> ';
	}

	document.getElementById("photoOptionsModal").style.display ='block';
}

function hidePhotoOptions(){
	document.getElementById("photoOptionsModal").style.display ='none';
}


function removeItemPhoto(item, category){

    if(fs.existsSync('./data/photos/menu/'+item+'.jpg')) {
	    fs.unlinkSync('./data/photos/menu/'+item+'.jpg')
	}

	changePhotoFlagInMenu(item, 5, category);
	hidePhotoOptions();
	openSubMenuPhotos(category);
}

//Photo Cropper
function loadPhotoCropper(code, name, category, changeFlag){

	hidePhotoOptions();
	document.getElementById("photoEditModalTitle").innerHTML = 'Choose Photo for <b>'+name+'</b>';
	document.getElementById("photoCropperModal").style.display = 'block';

      var image;
      
      var cropBoxData;
      var canvasData;
      var cropper;

      var resultImage;

	    var handleFileSelect = function(input) {

	    	document.getElementById("uploadedItemImageContainer").style.display = 'block';

	      		var file = input.files[0];
	      		var reader = new FileReader();

	      		reader.onload = function (evt) {
	          		resultImage = evt.target.result;
	          		$('#uploadedItemImage').attr('src', evt.target.result);
		          	image = document.getElementById('uploadedItemImage');

				      cropper = new Cropper(image, {
				      	  aspectRatio: 1 / 1,
						  autoCropArea: 0.8,
						  scalable: true,
				          ready: function () {
				            cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
				          }
				      }); 
		  
	      		};
	      
	      		reader.readAsDataURL(file);
	    };


	    //File Upload
	    $("#itemPhotoFileInput").change(function(){
	        handleFileSelect(this);
	    });

	    //Saved Cropped Image
      	$("#cropUploadedImageButton").click(function(){
	        cropBoxData = cropper.getCropBoxData();
	        canvasData = cropper.getCroppedCanvas({
				  width: 180,
				  height: 180,
				  fillColor: '#fff',
				  imageSmoothingEnabled: false,
				  imageSmoothingQuality: 'high',
				});

	        

	        var newFile = canvasData.toDataURL();
	        cropper.destroy();

	        var data = newFile.replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer(data, 'base64');
			fs.writeFile('./data/photos/menu/'+code+'.jpg', buf, (err) => {
              if(err){
				showToast('Oops! The photo was not uploaded.', '#e74c3c');
              }
              else{
              	showToast('Photo saved Successfully', '#27ae60');
              	changePhotoFlagInMenu(code, changeFlag, category);
              	hidePhotoCropper();
              }
              	 
           });


		});

}

function hidePhotoCropper(){
	document.getElementById("uploadedItemImageContainer").style.display = 'none';
	document.getElementById("photoCropperModal").style.display = 'none';
}

function changePhotoFlagInMenu(code, changeFlag, optionalCategory){

		var optedFlag = false;

		if(changeFlag == 1){ //Changing Photo
			return '';
		}
		else if(changeFlag == 0){ //Uploading New Photo
			optedFlag = true;
		}
		else if(changeFlag == 5){ //Removing Existing Photo
			optedFlag = false;
		}
		
		/* Just invert the item availability status here*/
		if(fs.existsSync('./data/static/mastermenu.json')) {
	      fs.readFile('./data/static/mastermenu.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Failed to make changes in Menu data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

				if(data == ''){ data = '[]'; }
	          
	          	var mastermenu = JSON.parse(data); 
				for (var i=0; i<mastermenu.length; i++){
					for(var j=0; j<mastermenu[i].items.length; j++){

						if(mastermenu[i].items[j].code == code){

						   mastermenu[i].items[j].isPhoto = optedFlag;

					       var newjson = JSON.stringify(mastermenu);
					       fs.writeFile('./data/static/mastermenu.json', newjson, 'utf8', (err) => {
					         if(err){
					            showToast('System Error: Unable to save Categories data. Please contact Accelerate Support.', '#e74c3c');
					         }
					         else{
					         	if(optionalCategory){
					         		renderPage('photos-manager', 'Photos Manager');
					         		openSubMenuPhotos(optionalCategory);
					         	}
					         	return '';

					         }
					       }); 

						}
				
					}					
				}
		}
		});
	    } else {
	      showToast('System Error: Failed to make changes in Menu data. Please contact Accelerate Support.', '#e74c3c');
	    }	

}
