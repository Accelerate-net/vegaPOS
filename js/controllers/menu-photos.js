
/* read categories */
function fetchAllCategoriesPhotos(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
                  },
      "fields"    : ["identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

	          	var categories = data.docs[0].value;
	          	categories.sort(); //alphabetical sorting 
	          	var categoryTag = '';

				for (var i=0; i<categories.length; i++){
					categoryTag = categoryTag + '<tr class="subMenuList" onclick="openSubMenuPhotos(\''+categories[i]+'\')"><td><i class="fa fa-caret-right"></i>'+categories[i]+'</td></tr>';
				}

				if(!categoryTag)
					categoryTag = '<p style="color: #bdc3c7">No Category added yet.</p>';
			

				document.getElementById("categoryAreaPhotos").innerHTML = categoryTag;

          }
          else{
            showToast('Not Found Error: Menu Category data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu Category data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Category data.', '#e74c3c');
      }

    }); 
}

function openSubMenuPhotos(subtype){	


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MASTER_MENU" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

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
								itemsInSubMenu = itemsInSubMenu + '<tag onclick="openPhotoOptions(\''+mastermenu[i].items[j].name+'\', \''+mastermenu[i].items[j].code+'\', \'PHOTO_AVAILABLE\', \''+subtype+'\')" class="btn btn-both btn-flat product listedMenuImage"><span class="bg-img" style="background: none !important;"><img id="menu_item_'+mastermenu[i].items[j].code+'" src="images/common/download_in_progress.jpg" alt="'+mastermenu[i].items[j].name+'" style="width: 110px; height: 110px;"></span><span><span>'+mastermenu[i].items[j].name+'</span></span></tag>';
								loadImageFromServer(mastermenu[i].items[j].code);
							}
							else{
								itemsInSubMenu = itemsInSubMenu + '<tag onclick="openPhotoOptions(\''+mastermenu[i].items[j].name+'\', \''+mastermenu[i].items[j].code+'\', \'PHOTO_NOT_AVAILABLE\', \''+subtype+'\')" class="btn btn-both btn-flat product listedMenuImage"><span class="bg-img"><div class="itemImage">'+getImageCode(mastermenu[i].items[j].name)+'</div></span><span><span>'+mastermenu[i].items[j].name+'</span></span></tag>';
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
            showToast('Not Found Error: Menu data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Menu data.', '#e74c3c');
      }

    });  



	//menuRenderArea
	document.getElementById("menuDetailsAreaPhotos").style.display = "block";
}



function loadImageFromServer(itemCode){

		itemCode = parseInt(itemCode);

        $.ajax({
            type: 'GET',
            url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/'+itemCode,
            timeout: 10000,
            success: function(serverData) {
              if(serverData.data != ''){
              	$('#menu_item_'+itemCode).attr("src", serverData.data);
              }
              else{
              	$('#menu_item_'+itemCode).attr("src", 'images/common/download_failed.jpg');
              }
            },
            error: function(data){
            	$('#menu_item_'+itemCode).attr("src", 'images/common/download_failed.jpg');
            }
        });     
}




function openPhotoOptions(name, item, type, category){
	if(type == 'PHOTO_AVAILABLE'){ /* Photo Already Uploaded */
		document.getElementById("photoOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader"><b>'+name+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="loadPhotoCropper(\''+item+'\', \''+name+'\', \''+category+'\', 1)"><i class="fa fa-image" style=""></i><tag style="padding-left: 15px">Change Photo</tag></button> '+
                  '<button class="btn btn-danger tableOptionsButtonBig" onclick="removeItemPhoto(\''+item+'\', \''+name+'\', \''+category+'\')"><i class="fa fa-ban" style="color: #FFF"></i><tag style="padding-left: 15px">Remove Photo</tag></button> '+ 
                  '<button class="btn btn-default tableOptionsButton" onclick="hidePhotoOptions()">Close</button> ';
	

        document.getElementById("photoOptionsModal").style.display ='block';
	}
	else if(type == 'PHOTO_NOT_AVAILABLE'){ /* No photo */

		/*
		document.getElementById("photoOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader"><b>'+name+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="loadPhotoCropper(\''+item+'\', \''+name+'\', \''+category+'\', 0)"><i class="fa fa-image" style=""></i><tag style="padding-left: 15px">Upload Photo</tag></button> '+ 
                  '<button class="btn btn-default tableOptionsButton" onclick="hidePhotoOptions()">Close</button> ';

        */

        //Directly load the cropper
        loadPhotoCropper(item, name, category, 0);
	}
}

function hidePhotoOptions(){
	document.getElementById("photoOptionsModal").style.display ='none';
}



//Photo Cropper

function loadPhotoCropper(code, name, category, changeFlag){

	hidePhotoOptions();

	

	document.getElementById("renderPhotoSelectionWizard").innerHTML = ''+
		'<div class="modal-header"> <h5 class="modal-title" style="font-size: 18px; text-align: center">Choose Photo for <b>'+name+'</b></h5> </div>'+
		'<div class="modal-body"  style="max-height: 60vh; overflow: auto !important;">'+
			'<tag id="selectionActionsWindow" style="display: block; text-align: center;">'+
	            '<div style="border: 1px dashed #d2d6de; color: #999; text-align: center; cursor: pointer; width: 120px; display: inline-block; height: 120px; border-radius: 50%; font-family: \'Roboto\'; line-height: 20px; font-size: 16px; padding-top: 42px; text-transform: uppercase;">Select an Image<input type="file" id="itemPhotoFileInput" style="position: absolute; z-index: 1000; opacity: 0; cursor: pointer; right: 0; top: 0; height: 100%; font-size: 24px; width: 100%;"/>'+
	            '</div>'+
	            '<p style="margin: 15px 0 0 0; padding: 0 80px; color: #848484;">Upload High Quality image only. Use minimum 180px x 180px resolution. Only JPG, PNG files supported.</p>'+
            '</tag>'+
            '<div class="img-container" id="uploadedItemImageContainer" style="display: none; height: 400px !important">'+
              '<img id="uploadedItemImage" src="" alt="Picture">'+
            '</div>'+
        '</div>'+
        '<div class="modal-footer">'+
            '<button  class="btn btn-default" onclick="hidePhotoCropper()" style="float: left">Cancel</button>'+
            '<button  id="cropUploadedImageButton" class="btn btn-success">Save</button>'+
        '</div>';

    document.getElementById("photoCropperModal").style.display = 'block';

    


      var image = "";
      
      var cropBoxData = "";
      var canvasData = "";
      var cropper = "";
      

      var resultImage = "";

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
	    	document.getElementById("selectionActionsWindow").style.display = 'none';
	        handleFileSelect(this);
	    });

	    //Saved Cropped Image
      	$("#cropUploadedImageButton").click(function(){
	        cropBoxData = cropper.getCropBoxData();
	        canvasData = cropper.getCroppedCanvas({
				  width: 180,
				  height: 180,
				  fillColor: '#f5f5f5',
				  imageSmoothingEnabled: false,
				  imageSmoothingQuality: 'high',
				});

	        

	        var newFile = canvasData.toDataURL();
	        cropper.destroy();

			if(changeFlag == 1){ //Image already exists, replace.
				replaceImageOnServer(code, name, category, newFile);
			}
			else if(changeFlag == 0){
				pushImageToServer(code, name, category, newFile);
			}
		});
}


function pushImageToServer(itemCode, itemName, category, encodedData){

	          var imageObject = {}; 
	          imageObject._id = itemCode;
	          imageObject.code = parseInt(itemCode);
	          imageObject.category = category;
	          imageObject.data = encodedData;

	          //Post to local Server
	          $.ajax({
	            type: 'POST',
	            url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/',
	            data: JSON.stringify(imageObject),
	            contentType: "application/json",
	            dataType: 'json',
	            timeout: 10000,
	            success: function(data) {
	              	if(data.ok){
	              		showToast('Image for <b>'+itemName+'</b> saved Successfully', '#27ae60');
	              	
	              		changePhotoFlagInMenu(itemCode, 0, category);
              			hidePhotoCropper();
	              	}
	              	else{
	              		showToast('Warning: Image was not uploaded for <b>'+itemName+'</b>. Try again.', '#e67e22');
	              	}
	            },
	            error: function(data){   
	                  
	              showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
	            }
	          });  
			  //End - post to Server 	
}

function replaceImageOnServer(itemCode, itemName, category, encodedData){

	itemCode = parseInt(itemCode);

    var requestData = { "selector" :{ "code": itemCode }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          	var imageFile = data.docs[0];
          	imageFile.data = encodedData;

          		/*Save changes in Image Data*/

                //Update
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_menu_images/'+(imageFile._id)+'/',
                  data: JSON.stringify(imageFile),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Image of <b>'+itemName+'</b> updated', '#27ae60');
                      changePhotoFlagInMenu(itemCode, 1, category);
              		  hidePhotoCropper();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Image.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: No Image found to update.', '#e74c3c');
          pushImageToServer(itemCode.toString(), itemName, category, encodedData);
        }       
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Images data.', '#e74c3c');
      }

    }); 	
}


function hidePhotoCropper(){

	//Clear Caches
	$('#uploadedItemImage').attr('src', "");


	document.getElementById("uploadedItemImageContainer").style.display = 'none';
	document.getElementById("photoCropperModal").style.display = 'none';

}



function removeItemPhoto(itemCode, itemName, category){

                  itemCode = parseInt(itemCode);

                  var requestData = { "selector" :{ "code": itemCode }, "fields" : ["_id", "_rev"] }

                  $.ajax({
                    type: 'POST',
                    url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/_find',
                    data: JSON.stringify(requestData),
                    contentType: "application/json",
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data) {
                      if(data.docs.length > 0){

                        //Proceed to Delete
                        $.ajax({
                          type: 'DELETE',
                          url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/'+data.docs[0]._id+'?rev='+data.docs[0]._rev,
                          contentType: "application/json",
                          dataType: 'json',
                          timeout: 10000,
                          success: function(data) {

                          	showToast('Image of <b>'+itemName+'</b> deleted', '#27ae60');

							changePhotoFlagInMenu(itemCode, 5, category);
							hidePhotoOptions();
							openSubMenuPhotos(category);
                          },
                          error: function(data) {
                            showToast('Server Warning: Unable to modify Menu Images data.', '#e67e22');
                          }
                        }); 

                      }
                      else{
                        changePhotoFlagInMenu(itemCode, 5, category);
                      	hidePhotoOptions();
						openSubMenuPhotos(category);
                      }
                    },
                    error: function(data) {
                      showToast('Server Warning: Unable to modify Menu Images data.', '#e67e22');
                    }

                  });
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
	                    "identifierTag": "ACCELERATE_MASTER_MENU" 
	                  },
	      "fields"    : ["_rev", "identifierTag", "value"]
	    }

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
	      data: JSON.stringify(requestData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {
	        if(data.docs.length > 0){
	          if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

		        var mastermenu = data.docs[0].value; 
				
				for (var i=0; i<mastermenu.length; i++){
					for(var j=0; j<mastermenu[i].items.length; j++){

						if(mastermenu[i].items[j].code == code){

						   	mastermenu[i].items[j].isPhoto = optedFlag;

						    //Update
			                var updateData = {
			                  "_rev": data.docs[0]._rev,
			                  "identifierTag": "ACCELERATE_MASTER_MENU",
			                  "value": mastermenu
			                }


			                $.ajax({
			                  type: 'PUT',
			                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MASTER_MENU/',
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
			                    showToast('System Error: Unable to make changes in Menu data.', '#e74c3c');
			                  }

			                }); 

			                break; 
						}
				
					}					
				}

	          }
	          else{
	            showToast('Not Found Error: Menu data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Menu data not found.', '#e74c3c');
	        }
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Menu data.', '#e74c3c');
	      }
	    });  
}
