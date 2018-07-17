
/* read categories */
function fetchAllCategoriesPhotos(){


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_MENU_CATEGORIES" 
                  },
      "fields"    : ["identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_MENU_CATEGORIES'){

	          	var categories = data.docs[0].value;
	          	categories.sort(); //alphabetical sorting 
	          	var categoryTag = '';

				for (var i=0; i<categories.length; i++){
					categoryTag = categoryTag + '<tr class="subMenuList" onclick="openSubMenuPhotos(\''+categories[i]+'\')"><td>'+categories[i]+'</td></tr>';
				}

				if(!categoryTag)
					categoryTag = '<p style="color: #bdc3c7">No Category added yet.</p>';
			

				document.getElementById("categoryAreaPhotos").innerHTML = categoryTag;

          }
          else{
            showToast('Not Found Error: Menu Category data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu Category data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Category data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}

function openSubMenuPhotos(subtype){	


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_MASTER_MENU" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_MASTER_MENU'){

	          	var mastermenu = data.docs[0].value; 

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
          else{
            showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Menu data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  



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
		
		/* Just invert the photo availability status here*/

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_MASTER_MENU" 
	                  },
	      "fields"    : ["_rev", "identifierTag", "value"]
	    }

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
	      data: JSON.stringify(requestData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {
	        if(data.docs.length > 0){
	          if(data.docs[0].identifierTag == 'ZAITOON_MASTER_MENU'){

		        var mastermenu = data.docs[0].value; 
				
				for (var i=0; i<mastermenu.length; i++){
					for(var j=0; j<mastermenu[i].items.length; j++){

						if(mastermenu[i].items[j].code == code){

						   	mastermenu[i].items[j].isPhoto = optedFlag;

						    //Update
			                var updateData = {
			                  "_rev": data.docs[0]._rev,
			                  "identifierTag": "ZAITOON_MASTER_MENU",
			                  "value": mastermenu
			                }


			                $.ajax({
			                  type: 'PUT',
			                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_MASTER_MENU/',
			                  data: JSON.stringify(updateData),
			                  contentType: "application/json",
			                  dataType: 'json',
			                  timeout: 10000,
			                  success: function(data) {
					         	if(optionalCategory){
					         		renderPage('photos-manager', 'Photos Manager');
					         		openSubMenuPhotos(optionalCategory);
					         	}
					         	return '';
			                  },
			                  error: function(data) {
			                    showToast('System Error: Unable to make changes in Menu data. Please contact Accelerate Support.', '#e74c3c');
			                  }

			                }); 

			                break; 
						}
				
					}					
				}

		          
	          }
	          else{
	            showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
	        }

	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Menu data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });  
}
