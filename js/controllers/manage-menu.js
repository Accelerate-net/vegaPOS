
/* read categories */
function fetchAllCategories(){


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
					categoryTag = categoryTag + '<tr class="subMenuList" onclick="openSubMenu(\''+categories[i]+'\')"><td>'+categories[i]+'</td></tr>';
				}

				if(!categoryTag)
					categoryTag = '<p style="color: #bdc3c7">No Category added yet.</p>';
			

				document.getElementById("categoryArea").innerHTML = categoryTag;

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


/* mark an item unavailable */
function markAvailability(code){

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

	          	var remember_avail = 0;

				
				for (var i=0; i<mastermenu.length; i++){
					for(var j=0; j<mastermenu[i].items.length; j++){

						if(mastermenu[i].items[j].code == code){

							mastermenu[i].items[j].isAvailable = !mastermenu[i].items[j].isAvailable;

							remember_avail = mastermenu[i].items[j].isAvailable ? 1 : 0;
							
							if(document.getElementById("item_avail_"+code).innerHTML != 'Available'){
								document.getElementById("item_avail_"+code).innerHTML = 'Available';
								document.getElementById("item_avail_"+code).style.background = "#27ae60";	
							}
							else{
								document.getElementById("item_avail_"+code).innerHTML = 'Out of Stock';
								document.getElementById("item_avail_"+code).style.background = "#e74c3c";		
							}


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

			                  	//Update online menu (if enabled)
                                var online_flag = 0;
                                online_flag = window.localStorage.appOtherPreferences_syncOnlineMenu ? window.localStorage.appOtherPreferences_syncOnlineMenu : 0;

                                if(online_flag == 1){
                                    sendConfirmationResponseToCloud(code, remember_avail);
                                }

			                  	return '';
			                  },
			                  error: function(data) {
			                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
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





      //Send update to Cloud Server
      function sendConfirmationResponseToCloud(id, status){

          var data = {
            "token": window.localStorage.loggedInAdmin,
            "code": id,
            "status": status
          }

          showLoading(10000, 'Updating Online Menu');

          $.ajax({
            type: 'POST',
            url: 'https://www.accelerateengine.app/apis/itemstatus.php',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(data) {

              hideLoading();

              if(data.status){

              }
              else{
                 
                showToast('Cloud Server Warning: Online Menu not updated', '#e67e22');
              }
            },
            error: function(data){
              hideLoading();
              showToast('Failed to reach Cloud Server. Please check your connection.', '#e74c3c');
              return '';
            }
          });       
      }

}


/*edit price of the item*/
function editItemPrice(encodedItem, inCateogry){

	//removes cache
	document.getElementById("extraChoicesArea").innerHTML = ''; 
	document.getElementById("removeExtraChoiceButton").style.display = 'none';	

	var item = JSON.parse(decodeURI(encodedItem));

	var editContent = '';
	var customRow = '';

	document.getElementById("editMenuItemPriceModal").style.display = "block";
	document.getElementById("editItemPriceModalTitle").innerHTML = 'Edit <b id="editItemTitleName">'+item.name+'</b>';
	document.getElementById("editPriceModalActions").innerHTML = '<button class="btn btn-default" onclick="hideEditMenuItemPrice()" style="float: left">Cancel</button>'+
                  												   '<button onclick="reviewItemPrice(\''+inCateogry+'\')" class="btn btn-success">Save</button>';

    //Check if More Options already added
    if((item.cookingTime && item.cookingTime != '') || (item.ingredients && item.ingredients.length > 0) || (item.shortCode && item.shortCode != '') || item.isPackaged){

    	document.getElementById("edit_moreOptionsArea").style.display = 'block';
    	
    	document.getElementById("packagedItemFlagEdit").checked = item.isPackaged;

    	if(item.shortCode && item.shortCode != ''){
    		document.getElementById("edit_more_options_customCode").value = item.shortCode;
    	}
    	else{
    		document.getElementById("edit_more_options_customCode").value = '';
    	}

    	if(item.shortNumber && item.shortNumber != ''){
    		document.getElementById("edit_more_options_customNumber").value = item.shortNumber;
    	}
    	else{
    		document.getElementById("edit_more_options_customNumber").value = '';
    	}

    	if(item.cookingTime && item.cookingTime != ''){
    		document.getElementById("edit_more_options_cookingTime").value = item.cookingTime;
    	}
    	else{
    		document.getElementById("edit_more_options_cookingTime").value = '';
    	}

    	if(item.ingredients && item.ingredients.length > 0){
    		document.getElementById("edit_more_options_ingredients").value = (item.ingredients).toString();
    		document.getElementById("edit_ingredientsResetButton").style.display = 'inline-block';
    	}
    	else{
    		document.getElementById("edit_more_options_ingredients").value = '';
    		edit_addMoreOptions('RELOAD');
    	}

		document.getElementById("edit_moreOptionsButtonWrap").innerHTML = '<button style="float: right;" class="btn btn-sm btn-default specialPinkButton" onclick="edit_removeMoreOptions()">Remove Options</button> <button class="btn btn-sm btn-default changeCategoryButton" onclick="changeCategoryOfItem(\''+item.code+'\', \''+item.name+'\')">Change Category <i class="fa fa-exchange"></i></button>';
    }
    else{
    	document.getElementById("edit_moreOptionsArea").style.display = 'none';
    	document.getElementById("edit_more_options_customCode").value = '';
    	document.getElementById("edit_more_options_customNumber").value = '';
    	document.getElementById("edit_more_options_cookingTime").value = '';
    	document.getElementById("edit_more_options_ingredients").value = '';
    	document.getElementById("edit_moreOptionsButtonWrap").innerHTML = '<button style="float: right;" class="btn btn-sm btn-default" onclick="edit_addMoreOptions()">More Options</button> <button class="btn btn-sm btn-default changeCategoryButton" onclick="changeCategoryOfItem(\''+item.code+'\', \''+item.name+'\')">Change Category <i class="fa fa-exchange"></i></button>';
    }
	
	if(item.isCustom){
			for(var i=1; i<=item.customOptions.length; i++){
				customRow = customRow + '<div class="row" id="edit_choiceNamed_"'+i+'>'+
	                        '<div class="col-lg-8">'+
	                           '<div class="form-group">'+
	                              '<label for="new_item_name">Choice '+i+'</label> <input type="text" value="'+item.customOptions[i-1].customName+'" id="edit_choiceName_'+i+'" class="form-control tip"/>'+
	                           '</div>'+
	                        '</div>'+
	                        '<div class="col-lg-4">'+
	                           '<div class="form-group">'+
	                              '<label for="new_item_price">Price</label> <input type="text" value="'+item.customOptions[i-1].customPrice+'" class="form-control tip" id="edit_choicePrice_'+i+'" required="required" />'+
	                           '</div>'+
	                        '</div>'+                     
	                     '</div>';
			}

			editContent = '<div class="row">'+
	                        '<div class="col-lg-8">'+
	                           '<div class="form-group">'+
	                              '<label for="new_item_name">Item Name</label> <input type="text" value="'+item.name+'" id="item_main_name" class="form-control tip"/>'+
	                           '</div>'+
	                        '</div>'+  
	                        '<div class="col-lg-4" id="item_main_price_unit" style="display: none">'+
	                           '<div class="form-group">'+
	                              '<label for="new_item_name">Item Price</label> <input type="hidden" value="" id="item_main_price" class="form-control tip"/>'+
	                           '</div>'+
	                        '</div>'+  	                                          
	                     '</div>';

	        editContent = editContent + '<div id="existingChoices">' + customRow + '</div>';       

	}
	else{
			editContent = '<div class="row">'+
	                        '<div class="col-lg-8">'+
	                           '<div class="form-group">'+
	                              '<label for="new_item_name">Item Name</label> <input type="text" id="item_main_name" value="'+item.name+'" class="form-control tip"/>'+
	                           '</div>'+
	                        '</div>'+
	                        '<div class="col-lg-4" id="item_main_price_unit">'+
	                           '<div class="form-group">'+
	                              '<label for="new_item_price">Price</label> <input type="text" value="'+item.price+'" class="form-control tip" id="item_main_price" required="required" />'+
	                           '</div>'+
	                        '</div>'+                     
	                     '</div>'+
	                     '<div id="existingChoices"></div>';
	}


	topEditContent = '<div class="row">'+
                        '<div class="col-lg-4">'+
                           '<div class="form-group">'+
                              '<label for="new_item_name">Item Code</label> <input type="number" value="'+item.code+'" class="form-control tip" id="edit_item_manual_code" disabled/>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-lg-8">'+
                           '<div class="form-group">'+
                              '<label for="new_item_price">Type</label>'+
                              '<div style="display: block" id="newItemTypeOptions">'+
                                 '<button onclick="triggerItemType(this)" veg-flag="0" class="btn btn-default foodTypeButton '+(!item.vegFlag || item.vegFlag == 0 ? 'active' : '')+'">Not Set</button>'+
                                 '<button onclick="triggerItemType(this)" veg-flag="1" class="btn btn-default foodTypeButton '+(item.vegFlag == 1 ? 'active' : '')+'"><img src="images/common/food_veg.png">Vegetarian</button>'+
                                 '<button onclick="triggerItemType(this)" veg-flag="2" class="btn btn-default foodTypeButton '+(item.vegFlag == 2 ? 'active' : '')+'"><img src="images/common/food_nonveg.png">Non-Vegetarian</button>'+
                              '</div>'
                           '</div>'
                        '</div>'                        
                     '</div>'


	document.getElementById("topEditItemArea").innerHTML = topEditContent;
	document.getElementById("editItemArea").innerHTML = editContent;

	$("#item_main_name").focus();
	document.getElementById("editItemCodeSecret").innerHTML = '<input type="hidden" id="item_main_code_secret" value="'+item.code+'"/>';

	//If it has choices already, show CLEAR Choice buttons 
	if(item.isCustom){
		document.getElementById("removeExtraChoiceButton").style.display = 'block';	 
	}
}

function hideEditMenuItemPrice(){
	document.getElementById("editMenuItemPriceModal").style.display = "none";
}


/*edit - add new choice*/
function editAddMoreChoice(){

	var count = 1; //The number of choices already have (plus 1)

	while($("#edit_choicePrice_"+count).length != 0){
		count++;
	}

	/* clear choices button */
	document.getElementById("removeExtraChoiceButton").style.display = 'block';
	document.getElementById("item_main_price").value = '';	
	document.getElementById("item_main_price_unit").style.display = 'none';	

	var newChoice = $(document.createElement('div'))
	     .attr("id", 'TextBoxDiv'+count);


	var newRow = 	'<div class="row">'+
					    '<div class="col-lg-8">'+
					        '<div class="form-group">'+
					        	'<label for="new_item_name">Choice '+count+': Name</label>'+
					        	'<input type="text" class="form-control tip" id="edit_choiceName_'+count+'" required="required" />'+
					        '</div>'+
					    '</div>'+
					    '<div class="col-lg-4">'+
					        '<div class="form-group">'+
					            '<label for="new_item_price">Choice '+count+': Price</label>'+
					            '<input type="text" class="form-control tip" id="edit_choicePrice_'+count+'" required="required" />'+
					        '</div>'+
					    '</div>'+                     
					'</div>';




	newChoice.after().html(newRow);

	newChoice.appendTo("#extraChoicesArea");

}

/* edit - clear all the choices */
function removeExtraChoice(){
	document.getElementById("existingChoices").innerHTML = "";
	document.getElementById("extraChoicesArea").innerHTML = ""; 
	document.getElementById("removeExtraChoiceButton").style.display = 'none';

	/* All choices removed - option for entering single price */
	document.getElementById("item_main_price").type = 'text';
	document.getElementById("item_main_price").value = 0;
	document.getElementById("item_main_price_unit").style.display = 'block';
}




function getVegIcon(flag){

	if(!flag || flag == undefined){
		return '<tag style="display: inline-block; width: 12px"></tag>';
	}

	if(flag == 1){ //Veg
		return '<img style="width: 12px; position: relative; top: -2px; left: -5px;" src="images/common/food_veg.png">';
	}
	else if(flag == 2){ //Non Veg
		return '<img style="width: 12px; position: relative; top: -2px; left: -5px;" src="images/common/food_nonveg.png">';
	}
	else{
		return '<tag style="display: inline-block; width: 12px"></tag>';
	}
}


function openSubMenu(menuCategory, optionalHighlighItem){	

	//read menu
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MASTER_MENU" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

	          var mastermenu = data.docs[0].value;
	          var itemsInCategory = "";
	          var availabilityTag = "";

				for (var i=0; i<mastermenu.length; i++){

					if(menuCategory == mastermenu[i].category){

						//alphabetical sorting
						mastermenu[i].items.sort(function(obj1, obj2) {
			                // Ascending: first age less than the previous
			                return obj1.code - obj2.code;
			            });

						for(var j=0; j<mastermenu[i].items.length; j++){

							if(mastermenu[i].items[j].isAvailable){
								availabilityTag = '<span class="label availTag" id="item_avail_'+mastermenu[i].items[j].code+'" onclick="markAvailability(\''+mastermenu[i].items[j].code+'\')">Available</span>';
							}
							else{
								availabilityTag = '<span class="label notavailTag" id="item_avail_'+mastermenu[i].items[j].code+'" onclick="markAvailability(\''+mastermenu[i].items[j].code+'\')">Out of Stock</span>';
							}

							itemsInCategory = itemsInCategory + '<tr id="menu_item_row_'+mastermenu[i].items[j].code+'">'+
							                                       '<td class="deleteItemWrap" style="padding-left: 25px">'+getVegIcon(mastermenu[i].items[j].vegFlag)+mastermenu[i].items[j].name+'<tag class="deleteItemIcon" onclick="deleteItemFromMenu(\''+encodeURI(JSON.stringify(mastermenu[i].items[j]))+'\', \''+menuCategory+'\')"><i class="fa fa-minus-circle"></i></tag><span style="display: block; font-size: 10px; color: #8a8a8a; letter-spacing: 1px; margin-left: 13px;">'+mastermenu[i].items[j].code+'</span></td>'+
							                                       '<td><button class="btn btn-sm itemPriceTag" onclick="editItemPrice(\''+encodeURI(JSON.stringify(mastermenu[i].items[j]))+'\', \''+menuCategory+'\')"><i class="fa fa-inr"></i>'+mastermenu[i].items[j].price+'</button></td>'+
							                                       '<td>'+availabilityTag+'</td>'+
							                                    '</tr>';
				
						}
					}

				}


				
				document.getElementById("menuRenderTitle").innerHTML = '<div class="box-header" id="menuRenderTitle" style="padding: 10px 0px">'+
                              '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">'+menuCategory+'</h3>'+
                           '</div>';

               	//Submenu options
               	var subOptions = '<div class="floaty" style="right: -85px; top: 10px">'+
                                  '<div class="floaty-btn" onclick="openNewMenuItem(\''+menuCategory+'\')">'+
                                    '<span class="floaty-btn-label">Add a New '+menuCategory+'</span>'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#fff"/>'+
                                      '<path d="M0 0h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                  '</div>'+
                                  '<ul class="floaty-list">'+
                                    '<li class="floaty-list-item floaty-list-item--blue" onclick="openEditCategoryName(\''+menuCategory+'\')">'+
                                      '<span class="floaty-list-item-label">Edit Category Name</span>'+
                                      '<svg width="20" height="20" viewBox="0 0 24 24" class="absolute-center">'+
                                        '<path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98L13.87 11h-3.74L12 5.98z"/>'+
                                        '<path d="M0 0h24v24H0z" fill="none"/>'+
                                      '</svg>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--yellow" onclick="markAllItemsAvailability(\''+menuCategory+'\')">'+
                                      '<span class="floaty-list-item-label">Mark Availability</span>'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 16px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-check"></i>'+
                                    '</tag>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--red" onclick="openDeleteConfirmation(\''+menuCategory+'\')">'+
                                      '<span class="floaty-list-item-label">Delete '+menuCategory+'</span>'+
                                      '<svg width="20" height="20" viewBox="0 0 24 24" class="absolute-center">'+
                                          '<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>'+
                                          '<path d="M0 0h24v24H0z" fill="none"/>'+
                                      '</svg>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';

                document.getElementById("submenuOptions").innerHTML = subOptions;

				//Floating Button Animation
				var $floaty = $('.floaty');

				$floaty.on('mouseover click', function(e) {
				  $floaty.addClass('is-active');
				  e.stopPropagation();
				});

				$floaty.on('mouseout', function() {
				  $floaty.removeClass('is-active');
				});

				$('.container').on('click', function() {
				  $floaty.removeClass('is-active');
				});



                if(!itemsInCategory)
                	itemsInCategory = '<p style="color: #bdc3c7">No items found in '+menuCategory+'</p>';
				
				document.getElementById("menuRenderContent").innerHTML = itemsInCategory;


				//Highlight item row (optional)
				if(optionalHighlighItem && optionalHighlighItem != ''){
					$('#menu_item_row_'+optionalHighlighItem).addClass('borderedItemSelection');
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
	document.getElementById("menuDetailsArea").style.display = "block";
}


//To mark items availability -- batch process
function markAllItemsAvailability(current){
	document.getElementById("markAllItemsAvailabilityConsent").innerHTML = ''+
                  			'<button onclick="markAvailabilityBatch(\''+current+'\', \'ALL_NOT_AVAIL\')" class="btn btn-danger" style="float: left; width: 49.5%; height: 45px; border: none; border-radius: 0; margin: 0;">Mark All NOT Available</button>'+
                  			'<button onclick="markAvailabilityBatch(\''+current+'\', \'ALL_AVAIL\')" class="btn btn-success" style="float: right; width: 49.5%; height: 45px; border: none; border-radius: 0; margin: 0;">Mark All Available</button>';
	
	document.getElementById("markAllItemsAvailabilityContent").innerHTML = '<div class="row">'+
	                        '<div class="col-lg-12" style="padding: 0;">Please select an option to mark the availability of <b>'+current+'</b> items.'+
	                        '</div>'+                  
	                     '</div>';

	document.getElementById("markAllItemsAvailabilityModal").style.display = 'block';

	$("#edit_category_new_name").focus();
	
}

function markAllItemsAvailabilityHide(){
	document.getElementById("markAllItemsAvailabilityModal").style.display = 'none';
}


function markAvailabilityBatch(category, option){

    /*to find the latest item code*/
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

                var n = 0;
                while(mastermenu[n]){
                	if(mastermenu[n].category == category){
						
						var m = 0;
						while(mastermenu[n].items[m]){

							mastermenu[n].items[m].isAvailable = (option == 'ALL_AVAIL') ? true : false;

							if(m == mastermenu[n].items.length - 1){
								markAvailabilityBatchAfterProcess(mastermenu, category, data.docs[0]._rev);
							}
							m++;
						}

                		break;
                	}
                	n++;
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

function markAvailabilityBatchAfterProcess(menu, category, revID){

			                //Update
			                var updateData = {
			                  "_rev": revID,
			                  "identifierTag": "ACCELERATE_MASTER_MENU",
			                  "value": menu
			                }

			                $.ajax({
			                  type: 'PUT',
			                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MASTER_MENU/',
			                  data: JSON.stringify(updateData),
			                  contentType: "application/json",
			                  dataType: 'json',
			                  timeout: 10000,
			                  success: function(data) {
			                  	markAllItemsAvailabilityHide();
			                  	openSubMenu(category);
						        showToast('Success! All <b>'+ category +'</b> items are updated.', '#27ae60');
						      },
			                  error: function(data) {
			                    showToast('System Error: Unable to make changes in Menu data.', '#e74c3c');
         					  }

			                });  
}


// Quick view un-available items
function quickViewUnavailableItems(){

	var overallRenderContent = '';

	//read menu
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MASTER_MENU" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

          	  clearMenuRenderArea();

	          var mastermenu = data.docs[0].value;
	          var itemsInCategory = "";
	          var availabilityTag = "";
	          var menuCategory = '';

	          //alphabetical sorting
			  mastermenu.sort(function(a, b) {
			  	if(a.category < b.category) { return -1; }
			    if(a.category > b.category) { return 1; }
			    return 0;
			  });


				for (var i=0; i<mastermenu.length; i++){

						menuCategory = mastermenu[i].category;

						//alphabetical sorting
						mastermenu[i].items.sort(function(obj1, obj2) {
			                // Ascending: first age less than the previous
			                return obj1.code - obj2.code;
			            });

			            itemsInCategory = "";

						for(var j=0; j<mastermenu[i].items.length; j++){

							if(mastermenu[i].items[j].isAvailable){

							}
							else{
								availabilityTag = '<span class="label notavailTag" style="height: 28px; line-height: 21px; font-size: 14px; min-width: 95px" id="item_avail_'+mastermenu[i].items[j].code+'" onclick="markAvailability(\''+mastermenu[i].items[j].code+'\')">Out of Stock</span>';
							
								itemsInCategory = itemsInCategory + '<tr class="itemRowHighlighter" id="menu_item_row_'+mastermenu[i].items[j].code+'">'+
							                                       '<td class="deleteItemWrap" style="font-size: 16px;">'+mastermenu[i].items[j].name+'<tag style="margin-left: 10px">'+getVegIcon(mastermenu[i].items[j].vegFlag)+'</tag><span style="display: block; font-size: 10px; color: #8a8a8a; letter-spacing: 1px; margin-left: 0;">'+mastermenu[i].items[j].code+'</span></td>'+
							                                       '<td><button class="btn btn-sm itemPriceTag" style="font-size: 16px;"><i class="fa fa-inr"></i>'+mastermenu[i].items[j].price+'</button></td>'+
							                                       '<td>'+availabilityTag+'</td>'+
							                                    '</tr>';
							}

							
							//last iteration
							if(j == mastermenu[i].items.length - 1){
								if(itemsInCategory != ''){
									overallRenderContent += '<h1 style="font-size: 20px; margin: 10px 0; font-weight: 400; color: #2f9fe0;">'+menuCategory+'</h1>' + itemsInCategory;
								}
							}
				
						}
						
						//last iteration
						if(i == mastermenu.length - 1){
							
							if(overallRenderContent == ''){
								overallRenderContent = '<p style="margin: 25px 0; font-size: 16px; color: #737272;">There are <b>no</b> items marked as <b>Out of Stock</b> currently.</p>'
							}

	                		document.getElementById("unavailQuickViewModal").style.display = 'block';	
	                		document.getElementById("outOfStockRenderContent").innerHTML = overallRenderContent;
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


function quickViewUnavailableItemsHide(){
	document.getElementById("unavailQuickViewModal").style.display = 'none';
}

function clearMenuRenderArea(){
	document.getElementById("menuDetailsArea").style.display = 'none';
}


function openBatchProcessMenuAllAvailableWindow(){
	document.getElementById("batchAvailabilityConfirmWindow").style.display = 'block';
}

function hideBatchProcessMenuAllAvailableWindow(){
	document.getElementById("batchAvailabilityConfirmWindow").style.display = 'none';
}	


function batchProcessMenuAllAvailable(){

	hideBatchProcessMenuAllAvailableWindow();

    /*to find the latest item code*/
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

                var n = 0;
                while(mastermenu[n]){

						var m = 0;
						while(mastermenu[n].items[m]){

							mastermenu[n].items[m].isAvailable = true;

							if(n == mastermenu.length - 1 && m == mastermenu[n].items.length - 1){
								batchProcessMenuAllAvailableAfterProcess(mastermenu, data.docs[0]._rev);
							}
							m++;
						}
                	
                	n++;
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


function batchProcessMenuAllAvailableAfterProcess(menu, revID){

			                //Update
			                var updateData = {
			                  "_rev": revID,
			                  "identifierTag": "ACCELERATE_MASTER_MENU",
			                  "value": menu
			                }

			                $.ajax({
			                  type: 'PUT',
			                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MASTER_MENU/',
			                  data: JSON.stringify(updateData),
			                  contentType: "application/json",
			                  dataType: 'json',
			                  timeout: 10000,
			                  success: function(data) {
			                  	renderPage('manage-menu', 'Manage Menu');
						        showToast('Success! All items are marked Available.', '#27ae60');
						      },
			                  error: function(data) {
			                    showToast('System Error: Unable to make changes in Menu data.', '#e74c3c');
         					  }

			                });  
}




function deleteItemFromMenu(encodedItem, categoryName){

	var item = JSON.parse(decodeURI(encodedItem));

    /*to find the latest item code*/
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

                var n = 0;
                while(mastermenu[n]){
                	if(mastermenu[n].category == categoryName){
						
						var m = 0;
						while(mastermenu[n].items[m]){
							if(mastermenu[n].items[m].code == item.code){
								mastermenu[n].items.splice(m,1);
								deleteItemFromMenuAfterProcess(encodedItem, categoryName, mastermenu, data.docs[0]._rev);
								break;
							}
							m++;
						}

                		break;
                	}
                	n++;
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



function deleteItemFromMenuAfterProcess(encodedItem, categoryName, newMenuObj, revID){

	   var item = JSON.parse(decodeURI(encodedItem));
 
			                //Update
			                var updateData = {
			                  "_rev": revID,
			                  "identifierTag": "ACCELERATE_MASTER_MENU",
			                  "value": newMenuObj
			                }

			                $.ajax({
			                  type: 'PUT',
			                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MASTER_MENU/',
			                  data: JSON.stringify(updateData),
			                  contentType: "application/json",
			                  dataType: 'json',
			                  timeout: 10000,
			                  success: function(data) {
			                  	openSubMenu(categoryName);
						        showUndo('<b>'+item.name+'</b> was deleted', 'saveEncodedItemToFile(\''+categoryName+'\', \''+encodedItem+'\')');
						      },
			                  error: function(data) {
			                    showToast('System Error: Unable to make changes in Menu data.', '#e74c3c');
         					  }

			                });  
	
}


function hideNewBill(){
	document.getElementById("newBillArea").style.display = "none";
	document.getElementById("openNewBillButton").style.display = "block";
}


/* Modal - New Category*/
function openNewMenuCategory(){
	document.getElementById("newMenuCategoryModal").style.display = "block";
	$("#add_new_category_name").focus();
}

function hideNewMenuCategory(){	
	document.getElementById("newMenuCategoryModal").style.display = "none";
}


/* Modal - New Item*/
function openNewMenuItem(category){
	/* removes previous cache */
	removeMoreOptions();
	document.getElementById("newItemChoicesArea").innerHTML = ""; 
	document.getElementById("new_item_choice_count").value = 0;
	document.getElementById("new_item_price").disabled = false;
	document.getElementById("removeChoiceButton").style.display = 'none';

	if(category){
		document.getElementById("newItemModalTitle").innerHTML = "Add New <b>"+category+"</b>";
		document.getElementById("newItemModalActions").innerHTML = '<button class="btn btn-default" onclick="hideNewMenuItem()" style="float: left">Cancel</button>'+
                  								'<button onclick="readNewItem(\''+category+'\')" class="btn btn-success">Add</button>';
	}
		
	document.getElementById("new_item_name").value = '';  
	document.getElementById("new_item_manual_code").value = '';
	document.getElementById("new_item_price").value = '';
	document.getElementById("newMenuItemModal").style.display = "block";
	$("#new_item_manual_code").focus();


	suggestItemCode();

	function suggestItemCode(){

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

	             	var highest_code = 0;

	             	var m = 0;
	             	while(mastermenu[m]){
	             		for(var c = 0; c < mastermenu[m].items.length; c++){
	             			if(parseInt(mastermenu[m].items[c].code) > highest_code){
	             				highest_code = parseInt(mastermenu[m].items[c].code);
	             			}
	             		}

	             		if(m == mastermenu.length - 1){ //last iteration
	             			$("#new_item_manual_code").val(highest_code + 1);
	             		}

	             		m++;
	             	}

	          }
	        }
	      },
	      error: function(data) {
	        
	      }
	    });  
	}
}

function hideNewMenuItem(){	
	document.getElementById("newMenuItemModal").style.display = "none";
}

/*view more options*/
function addMoreOptions(optionalSource){

	document.getElementById("moreOptionsButtonWrap").innerHTML = '<button style="float: right;" class="btn btn-sm btn-default specialPinkButton" onclick="removeMoreOptions()">Remove Options</button>';
	
	document.getElementById("moreOptionsArea").style.display = 'block';

	if(optionalSource && optionalSource == 'RESET'){
		document.getElementById("more_options_ingredients").value = '';
		document.getElementById("ingredientsResetButton").style.display = 'none';
	}
	else{
		document.getElementById("more_options_cookingTime").value = '';
		document.getElementById("more_options_customCode").value = '';
		document.getElementById("more_options_customNumber").value = '';
		document.getElementById("more_options_ingredients").value = '';
		$("#more_options_customCode").focus();
	}



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_COOKING_INGREDIENTS'){

              	var modes = data.docs[0].value;
              	modes.sort(); //alphabetical sorting 
              	var modesTag = '';

		        for (var i=0; i<modes.length; i++){
		          modesTag = modesTag + '<tag class="extrasSelButton" onclick="addIngredientToInput(\''+modes[i]+'\', \'ingredient_'+i+'\')" id="ingredient_'+i+'">'+modes[i]+'</tag>';
		        }

		        if(!modesTag){
		            document.getElementById("ingredientsList").innerHTML = '<i>*Please update <b style="cursor: pointer" onclick="openOtherSettings(\'ingredientsList\')">Cooking Ingredient List</b> first.</i>';
		        }
		        else{            
		            document.getElementById("ingredientsList").innerHTML = 'Ingredients List: '+modesTag;
		        }

          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data.', '#e74c3c');
      }

    });  



}

function addIngredientToInput(name, id){

  document.getElementById("ingredientsResetButton").style.display = 'inline-block';

  if(document.getElementById("more_options_ingredients").value == "" || document.getElementById("more_options_ingredients").value == "Choose from below list"){
    document.getElementById("more_options_ingredients").value = name;
  }
  else{
    document.getElementById("more_options_ingredients").value = document.getElementById("more_options_ingredients").value + ',' +name;
  }

  document.getElementById(id).style.display = "none";
}


/*view more options - EDIT */
function edit_addMoreOptions(optionalSource){

	var temp_item_code = $('#edit_item_manual_code').val();
	var temp_item_name = $('#editItemTitleName').html();

	document.getElementById("edit_moreOptionsButtonWrap").innerHTML = '<button style="float: right;" class="btn btn-sm btn-default specialPinkButton" onclick="edit_removeMoreOptions()">Remove Options</button><button class="btn btn-sm btn-default changeCategoryButton" onclick="changeCategoryOfItem(\''+temp_item_code+'\', \''+temp_item_name+'\')">Change Category <i class="fa fa-exchange"></i></button>';

	document.getElementById("edit_moreOptionsArea").style.display = 'block';

	if(optionalSource && optionalSource == 'RESET'){
		document.getElementById("edit_more_options_ingredients").value = '';
		document.getElementById("edit_ingredientsResetButton").style.display = 'none';
	}
	else if(optionalSource && optionalSource == 'RELOAD'){
		document.getElementById("edit_ingredientsResetButton").style.display = 'inline-block';
	}
	else{
		document.getElementById("edit_more_options_cookingTime").value = '';
		document.getElementById("edit_more_options_customCode").value = '';
		document.getElementById("edit_more_options_customNumber").value = '';
		document.getElementById("edit_more_options_ingredients").value = '';
		document.getElementById("packagedItemFlagEdit").checked = false;
		
		$("#edit_more_options_customCode").focus();
	}



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_COOKING_INGREDIENTS'){

              	var modes = data.docs[0].value;
              	modes.sort(); //alphabetical sorting 
              	var modesTag = '';

		        for (var i=0; i<modes.length; i++){
		          modesTag = modesTag + '<tag class="extrasSelButton" onclick="edit_addIngredientToInput(\''+modes[i]+'\', \'edit_ingredient_'+i+'\')" id="edit_ingredient_'+i+'">'+modes[i]+'</tag>';
		        }

		        if(!modesTag){
		            document.getElementById("edit_ingredientsList").innerHTML = '<i>*Please update <b style="cursor: pointer" onclick="openOtherSettings(\'ingredientsList\')">Cooking Ingredient List</b> first.</i>';
		        }
		        else{            
		            document.getElementById("edit_ingredientsList").innerHTML = 'Ingredients List: '+modesTag;
		        }

          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data.', '#e74c3c');
      }

    });  
}

function edit_addIngredientToInput(name, id){

  document.getElementById("edit_ingredientsResetButton").style.display = 'inline-block';

  if(document.getElementById("edit_more_options_ingredients").value == "" || document.getElementById("edit_more_options_ingredients").value == "Choose from below list"){
    document.getElementById("edit_more_options_ingredients").value = name;
  }
  else{
    document.getElementById("edit_more_options_ingredients").value = document.getElementById("edit_more_options_ingredients").value + ',' +name;
  }

  document.getElementById(id).style.display = "none";
}


/* move item to different category */
function changeCategoryOfItem (item_code, item_name) {
	
	if($('#editMenuItemPriceModal').is(':visible')) {
		document.getElementById("editMenuItemPriceModal").style.display = 'none';
	}

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

               var categoryList = data.docs[0].value;
               categoryList.sort();

               var renderContent = '';
               var n = 0;
               while(categoryList[n]){

               		renderContent += '<button class="btn btn-primary" style="margin: 0 5px 5px 0; font-size: 16px;" onclick="moveItemToCategory(\''+item_code+'\', \''+item_name+'\', \''+categoryList[n]+'\')">'+categoryList[n]+'</button>';

               		n++;
               }

               document.getElementById("selectNewCategoryForItemWindow").style.display = 'block';
               document.getElementById("selectNewCategoryForItemWindowTitle").innerHTML = 'Select a New Category for <b>'+item_name+'</b>';
               document.getElementById("selectNewCategoryForItemWindowRenderContent").innerHTML = renderContent;

          }
          else{
            showToast('Not Found Error: Categories data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Categories data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Categories data.', '#e74c3c');
      }

    });  

}

function selectNewCategoryForItemWindowHide() {
	document.getElementById("selectNewCategoryForItemWindow").style.display = 'none';
}

function moveItemToCategory(item_code, item_name, item_category){

	if(item_code == "" || item_name == "" || item_category == ""){
		selectNewCategoryForItemWindowHide();
		showToast('Warning! Invalid Parameters.', '#e67e22');
		return '';
	}

	selectNewCategoryForItemWindowHide();


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
             			var remember_item = '';

             			var n = 0;
             			var isItemFound = false;
             			while(mastermenu[n] && !isItemFound){
             				for(var i = 0; i < mastermenu[n].items.length; i++){
             					if(mastermenu[n].items[i].code == item_code){
             						remember_item = mastermenu[n].items[i];
									mastermenu[n].items.splice(i, 1); //remove item from this category        						
             						isItemFound = true;
             						addItemToNewCategory();

             						break;
             					}
             				}
             				n++;
             			}


             			function addItemToNewCategory(){
	             			var k = 0;
	             			while(mastermenu[k]){
	             				if(mastermenu[k].category == item_category){
	             					mastermenu[k].items.push(remember_item);
	             					saveUpdates();
	             					break;
	             				}

	             				if(k == mastermenu.length - 1){ //last iteration and no category found ==> Create new cat
	             					var newItemsList = [];
				                	newItemsList.push(remember_item);

				                	mastermenu.push({
				                		"category": item_category,
				                        "items": newItemsList
				                    });

				                    saveUpdates();
				                    break;
	             				}

	             				k++;
	             			}             				
             			}
                    	

                    	function saveUpdates() {
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
			                  	showToast('Success! <b>' + item_name + '</b> has been move to '+item_category, '#27ae60');
			                  	openSubMenu(item_category);
			                  },
			                  error: function(data) {
			                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
			                  }

			                });  
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



function removeMoreOptions(){
	document.getElementById("ingredientsResetButton").style.display = 'none';
	document.getElementById("moreOptionsArea").style.display = 'none';
	document.getElementById("moreOptionsButtonWrap").innerHTML = '<button style="float: right;" class="btn btn-sm btn-default" onclick="addMoreOptions()">More Options</button>';
}

function edit_removeMoreOptions(){
	document.getElementById("edit_ingredientsResetButton").style.display = 'none';
	document.getElementById("edit_moreOptionsArea").style.display = 'none';

	var temp_item_code = $('#edit_item_manual_code').val();
	var temp_item_name = $('#editItemTitleName').html();
	document.getElementById("edit_moreOptionsButtonWrap").innerHTML = '<button style="float: right;" class="btn btn-sm btn-default" onclick="edit_addMoreOptions()">More Options</button><button class="btn btn-sm btn-default changeCategoryButton" onclick="changeCategoryOfItem(\''+temp_item_code+'\', \''+temp_item_name+'\')">Change Category <i class="fa fa-exchange"></i></button>';	
}

/* add new choice*/
function addChoice(){	

	if(!document.getElementById("newItemChoicesArea").innerHTML){
		document.getElementById("new_item_price").value = '';
		document.getElementById("new_item_price").disabled = true;
		document.getElementById("removeChoiceButton").style.display = 'block';
	}

	var count = document.getElementById("new_item_choice_count").value;
	count++;
	document.getElementById("new_item_choice_count").value = count;


	var newChoice = $(document.createElement('div'))
	     .attr("id", 'TextBoxDiv'+count);


	var newRow = 	'<div class="row">'+
					    '<div class="col-lg-8">'+
					        '<div class="form-group">'+
					        	'<label for="new_item_name">Choice '+count+': Name</label>'+
					        	'<input type="text" class="form-control tip" id="choice_name_'+count+'" required="required" />'+
					        '</div>'+
					    '</div>'+
					    '<div class="col-lg-4">'+
					        '<div class="form-group">'+
					            '<label for="new_item_price">Choice '+count+': Price</label>'+
					            '<input type="text" class="form-control tip" id="choice_price_'+count+'" required="required" />'+
					        '</div>'+
					    '</div>'+                     
					'</div>';




	newChoice.after().html(newRow);

	newChoice.appendTo("#newItemChoicesArea");

	$("#choice_name_"+count).focus();

}


/* remove from new choice*/
function removeChoice(id){
	document.getElementById("newItemChoicesArea").innerHTML = ""; 
	document.getElementById("new_item_choice_count").value = 0;
	document.getElementById("removeChoiceButton").style.display = 'none';
	document.getElementById("new_item_price").disabled = false;
	$("#new_item_name").focus();
}


/*read and validate form with new item details*/
function validateMenuItem(item){

	var error = '';

	if(item.code == '' || isNaN(item.code)){
		error = 'Item Code has to be a valid number.';
		return {'status': false, 'error': error}
	}
	else if(item.name == ''){
		error = 'Item Name can not be empty.';
		return {'status': false, 'error': error}
	}
	else if(!item.isCustom && item.price == ''){
		error = 'Item Price can not be empty.';
		return {'status': false, 'error': error}		
	}
	else if(!item.isCustom && isNaN(item.price)){
		error = 'Item Price has to be a valid Number.';
		return {'status': false, 'error': error}		
	}
	else if(item.isCustom){

		var i = 0;
		while(item.customOptions[i]){
			
			if(item.customOptions[i].customName == ''){
				error = 'Choice Names can not be empty.';
				return {'status': false, 'error': error}
			}
			else if(item.customOptions[i].customPrice == ''){
				error = 'Choice Prices can not be empty.';
				return {'status': false, 'error': error}
			}
			else if(isNaN(item.customOptions[i].customPrice)){
				error = 'Choice Prices must be valid Numbers.';
				return {'status': false, 'error': error}
			}

			i++;
		}	

		error = '';
		return {'status': true, 'error': error}	
	}	
	else{
		error = '';
		return {'status': true, 'error': error}		
	}
}


function saveItemToFile(category, item) {

	if(item == null){
		showToast('Something went wrong. Try again.', '#e74c3c');
		return "";
	}

	
    /*to find the latest item code*/

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

                /*beautify item price if Custom item*/
                if (item.isCustom) {
                    var min = 0;  //Index of min and max values.
                    var max = 0;
                    var g = 0;
                    while (item.customOptions[g]) {
                        if (parseInt(item.customOptions[g].customPrice) > parseInt(item.customOptions[max].customPrice)) {
                            max = g;
                        }
                        if (parseInt(item.customOptions[min].customPrice) > parseInt(item.customOptions[g].customPrice)) {
                            min = g;
                        }

                        //Last iteration
                        if(g == item.customOptions.length - 1){
                        	if (item.customOptions[min].customPrice != item.customOptions[max].customPrice) {
		                        item.price = item.customOptions[min].customPrice + '-' + item.customOptions[max].customPrice;
		                    } else {
		                        item.price = item.customOptions[max].customPrice;
		                    }
                        }

                        g++;
                    }
                }


                //PROCEED TO SAVE

                /*begin save*/
                if(mastermenu == []){
                	//Menu is completely empty

                	var newItemsList = [];
                	newItemsList.push(item);

                	mastermenu.push({
                		"category": category,
                        "items": newItemsList
                    });

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
	                  	showToast('Success! <b>'+ item.name +'</b> is added to the Menu.', '#27ae60');
	                  	openSubMenu(category);
	                  },
	                  error: function(data) {
	                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
	                  }

	                });  

                }
                else{
                	//Check if Category Exists or not
                	var categoryExists = false;
                    for (var i = 0; i < mastermenu.length; i++) {
                        if (mastermenu[i].category == category) {
                           	categoryExists = true;
                            break;
                        }
                    }

                    if(categoryExists){ //Add to EXISTING Category
                    	var isItemDuplicate = false;

                    	var f = 0;
                    	while(mastermenu[f]){

	                        for (var j = 0; j < mastermenu[f].items.length; j++) {
	                            if (mastermenu[f].items[j].code == item.code) {
	                                isItemDuplicate = true;
	                                break;
	                            }
	                        }

	                        f++;
	                    }

                        if(isItemDuplicate){ 
	                        showToast('Warning: Item Code <b>#'+item.code+'</b> already exists. Please choose a different code.', '#e67e22');
	                        return '';
                        }
                        


                        //Completely a New Item 
                        if(!isItemDuplicate){
                            
                            mastermenu[i].items.push(item);
                     	
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
			                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
			                  	openSubMenu(category);
			                  },
			                  error: function(data) {
			                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
			                  }

			                });  
                        }
                    }
                    else{ //Add NEW Category

	                	var newItemsList = [];
	                	newItemsList.push(item);

	                	mastermenu.push({
	                		"category": category,
	                        "items": newItemsList
	                    });

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
		                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
		                  	openSubMenu(category);
		                  },
		                  error: function(data) {
		                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
		                  }

		                });  	                    
                    }
                }
				/* end of save */ 

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






function saveEditedItemToFile(category, item) {

	if(item == null){
		showToast('Something went wrong. Try again.', '#e74c3c');
		return "";
	}

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

                /*beautify item price if Custom item*/
                if (item.isCustom) {
                    var min = 0;  //Index of min and max values.
                    var max = 0;
                    var g = 0;
                    while (item.customOptions[g]) {
                        if (parseInt(item.customOptions[g].customPrice) > parseInt(item.customOptions[max].customPrice)) {
                            max = g;
                        }
                        if (parseInt(item.customOptions[min].customPrice) > parseInt(item.customOptions[g].customPrice)) {
                            min = g;
                        }

                        //Last iteration
                        if(g == item.customOptions.length - 1){
                        	if (item.customOptions[min].customPrice != item.customOptions[max].customPrice) {
		                        item.price = item.customOptions[min].customPrice + '-' + item.customOptions[max].customPrice;
		                    } else {
		                        item.price = item.customOptions[max].customPrice;
		                    }
                        }

                        g++;
                    }
                }


                //PROCEED TO SAVE

                /*begin save*/
                if(mastermenu == []){
                	//Menu is completely empty

                	var newItemsList = [];
                	newItemsList.push(item);

                	mastermenu.push({
                		"category": category,
                        "items": newItemsList
                    });

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
	                  	showToast('Success! <b>'+ item.name +'</b> is added to the Menu.', '#27ae60');
	                  	openSubMenu(category);
	                  },
	                  error: function(data) {
	                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
	                  }

	                });  

                }
                else{

                	//Check if Category Exists or not
                	var categoryExists = false;
                    for (var i = 0; i < mastermenu.length; i++) {
                        if (mastermenu[i].category == category) {
                           	categoryExists = true;
                            break;
                        }
                    }

                    if(categoryExists){ //Add to EXISTING Category
                    	var isItemDuplicate = false;

                    	var f = 0;
                    	var track_index = null;
                    	while(mastermenu[f]){

	                        for (var j = 0; j < mastermenu[f].items.length; j++) {
	                            if (parseInt(mastermenu[f].items[j].code) == parseInt(item.code)) {
	                                isItemDuplicate = true;
	                                track_index = j;
	                                break;
	                            }
	                        }

	                        f++;
	                    }

                        if(track_index == null){
	                        showToast('Warning: Item Code <b>#'+item.code+'</b> was not found.', '#e67e22');
	                        return '';
                        }
                        else{
                        	
                            mastermenu[i].items[track_index] = item;
                     	
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
			                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
			                  	openSubMenu(category);
			                  },
			                  error: function(data) {
			                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
			                  }

			                });  
                        }
                    }
                    else{ //Add NEW Category

	                	var newItemsList = [];
	                	newItemsList.push(item);

	                	mastermenu.push({
	                		"category": category,
	                        "items": newItemsList
	                    });

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
		                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
		                  	openSubMenu(category);
		                  },
		                  error: function(data) {
		                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
		                  }

		                });  	                    
                    }
                }
				/* end of save */ 

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




function saveEncodedItemToFile(category, encodedItem) { //Custom function for Undo Delete

	var item = JSON.parse(decodeURI(encodedItem));

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

                /*beautify item price if Custom item*/
                if (item.isCustom) {
                    var min = 0;
                    var max = 0;
                    var i = 0;
                    while (item.customOptions[i]) {
                        if (i == 0) {
                            min = item.customOptions[i].customPrice;
                        }

                        if (max < item.customOptions[i].customPrice) {
                            max = item.customOptions[i].customPrice;
                        }

                        if (min > item.customOptions[i].customPrice) {
                            min = item.customOptions[i].customPrice;
                        }

                        i++;
                    }

                    if (min < max) {
                        item.price = min + '-' + max;
                    } else {
                        item.price = max;
                    }

                }



                //PROCEED TO SAVE

                /*begin save*/
                if(mastermenu == []){
                	//Menu is completely empty

                	var newItemsList = [];
                	newItemsList.push(item);

                	mastermenu.push({
                		"category": category,
                        "items": newItemsList
                    });

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
	                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
	                  	openSubMenu(category);
	                  },
	                  error: function(data) {
	                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
	                  }

	                });  

                }
                else{
                	//Check if Category Exists or not
                	var categoryExists = false;
                    for (var i = 0; i < mastermenu.length; i++) {
                        if (mastermenu[i].category == category) {
                           	categoryExists = true;
                            break;
                        }
                    }

                    if(categoryExists){ //Add to EXISTING Category
                    	var isItemDuplicate = false;

                        for (var j = 0; j < mastermenu[i].items.length; j++) {
                            if (mastermenu[i].items[j].code == item.code) {
                                isItemDuplicate = true;
                                break;
                            }
                        }

                        if(isItemDuplicate){ 
                            
                            if(editFlag){ //Editing, so no issue with duplicate code
	                            mastermenu[i].items[j] = item;

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
				                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
				                  	openSubMenu(category);
				                  },
				                  error: function(data) {
				                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
				                  }

				                });
				            }  
				            else{
	                        	showToast('Warning: Item Code <b>#'+item.code+'</b> already exists. Please choose a different code.', '#e67e22');
	                            return '';
	                        }
                        }
                        


                        //Completely a New Item 
                        if(!isItemDuplicate){
                            
                            mastermenu[i].items[j] = item;
                     	
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
			                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
			                  	openSubMenu(category);
			                  },
			                  error: function(data) {
			                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
			                  }

			                });  
                        }
                    }
                    else{ //Add NEW Category

	                	var newItemsList = [];
	                	newItemsList.push(item);

	                	mastermenu.push({
	                		"category": category,
	                        "items": newItemsList
	                    });

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
		                  	showToast('Success! <b>' + item.name + '</b> is added to the Menu.', '#27ae60');
		                  	openSubMenu(category);
		                  },
		                  error: function(data) {
		                    showToast('System Error: Unable to update Menu data.', '#e74c3c');
		                  }

		                });  	                    
                    }
                }
				/* end of save */ 

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





function readNewItem(category){

	var item = {};
	item.name = document.getElementById("new_item_name").value;
	item.price = document.getElementById("new_item_price").value;
	item.isCustom = document.getElementById("new_item_choice_count").value > 0 ? true: false;

	//0 - Unknown, 1 - Veg, 2 - Non Veg
	item.vegFlag = 0;
    $("#newItemTypeOptions .foodTypeButton").each(function(){
        if($(this).hasClass("active")){
            item.vegFlag = $(this).attr("veg-flag");
        }
    });


    item.code = document.getElementById("new_item_manual_code").value != '' ? document.getElementById("new_item_manual_code").value : '';

    //Consider More Options
    if($('#moreOptionsArea').is(':visible')) {

	    item.isPackaged = document.getElementById("packagedItemFlag").checked;

		if(document.getElementById("more_options_customCode") && document.getElementById("more_options_customCode").value != ''){
			item.shortCode = document.getElementById("more_options_customCode").value;
		}

		if(document.getElementById("more_options_customNumber") && document.getElementById("more_options_customNumber").value != ''){
			item.shortNumber = document.getElementById("more_options_customNumber").value;
		}

		if(document.getElementById("more_options_cookingTime") && document.getElementById("more_options_cookingTime").value != ''){
			item.cookingTime = parseInt(document.getElementById("more_options_cookingTime").value);
		}

		if(document.getElementById("more_options_ingredients") && document.getElementById("more_options_ingredients").value != ''){
			 var tempList = document.getElementById("more_options_ingredients").value;
			 item.ingredients = tempList.split(',');
		}
	}
	else{
		item.isPackaged = false;
		item.shortCode = '';
		item.cookingTime = '';
		item.ingredients = [];
	}

	if(item.isCustom){
		var custom = [];
		var i = 1;
		while($("#choice_name_"+i).length != 0){
			custom.push({'customName': $("#choice_name_"+i).val(), 'customPrice': $("#choice_price_"+i).val()});
			i++;
		}

		item.customOptions = custom;		
	}


	/* VALIDATE BEFORE ADDING TO DATA FILE */
	var response = validateMenuItem(item);

	if(response.status){
		item.isAvailable = true;
		saveItemToFile(category, item);
		document.getElementById("newMenuItemModal").style.display = 'none';
	}
	else{
		showToast('Warning: '+response.error, '#e67e22');
	}
}

/*read and validate form with edited item details*/
function reviewItemPrice(category){
	
	var item = {};
	
	item.name = document.getElementById("item_main_name").value;
	item.price = document.getElementById("item_main_price").value;
	item.code = document.getElementById("item_main_code_secret").value;


	//0 - Unknown, 1 - Veg, 2 - Non Veg
	item.vegFlag = 0;
    $("#newItemTypeOptions .foodTypeButton").each(function(){
        if($(this).hasClass("active")){
            item.vegFlag = $(this).attr("veg-flag");
        }
    });


	//if more options is removed
	if(document.getElementById("edit_moreOptionsArea").style.display == 'none'){
		if(item.shortCode){
			delete item.shortCode;
		}	
		if(item.cookingTime){
			delete item.cookingTime;
		}	
		if(item.ingredients){
			delete item.ingredients;
		}
		if(item.isPackaged){
			delete item.isPackaged;
		}
	}
	else{
		//other cases

		item.isPackaged = document.getElementById("packagedItemFlagEdit").checked;

		if(document.getElementById("edit_more_options_customCode") && document.getElementById("edit_more_options_customCode").value != ''){
			item.shortCode = document.getElementById("edit_more_options_customCode").value;
		}
		else{
			if(item.shortCode){
				delete item.shortCode;
			}
		}

		if(document.getElementById("edit_more_options_customNumber") && document.getElementById("edit_more_options_customNumber").value != ''){
			item.shortNumber = document.getElementById("edit_more_options_customNumber").value;
		}
		else{
			if(item.shortNumber){
				delete item.shortNumber;
			}
		}

		if(document.getElementById("edit_more_options_cookingTime") && document.getElementById("edit_more_options_cookingTime").value != ''){
			item.cookingTime = parseInt(document.getElementById("edit_more_options_cookingTime").value);
		}
		else{
			if(item.cookingTime){
				delete item.cookingTime;
			}
		}
	
		if(document.getElementById("edit_more_options_ingredients") && document.getElementById("edit_more_options_ingredients").value != ''){
			 var tempList = document.getElementById("edit_more_options_ingredients").value;
			 item.ingredients = tempList.split(',');
		}
		else{
			if(item.ingredients){
				delete item.ingredients;
			}
		}
	}

		var custom = [];
		var i = 1;
		while($("#edit_choiceName_"+i).length != 0){
			custom.push({'customName': $("#edit_choiceName_"+i).val(), 'customPrice': $("#edit_choicePrice_"+i).val()});
			i++;
		}

		item.customOptions = custom;	

 		custom.length > 0 ? item.isCustom = true : item.isCustom = false;

	/* VALIDATE BEFORE ADDING TO DATA FILE */
	var response = validateMenuItem(item);

	if(response.status){
		item.isAvailable = true;
		saveEditedItemToFile(category, item);
		document.getElementById("editMenuItemPriceModal").style.display = 'none';
	}
	else{
		showToast('Warning: '+response.error, '#e67e22');
	}
}


/* add new category */
function addCategory() {  

	var name = document.getElementById("add_new_category_name").value;

	if(name == ''){
		showToast('Warning: Category Name is invalid. Please set a name.', '#e67e22');
		return ''
	}


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

             var categoryList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<categoryList.length; i++) {
               if (categoryList[i] == name){
                  flag = 1;
                  break;
               }
             }


             if(flag == 1){
               showToast('Warning: Category already exists. Please choose a different name.', '#e67e22');
             }
             else{

                categoryList.push(name);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_MENU_CATEGORIES",
                  "value": categoryList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MENU_CATEGORIES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

	                fetchAllCategories(); //refresh the list
	                hideNewMenuCategory();
	                openSubMenu(name);

                  },
                  error: function(data) {
                     
                    showToast('System Error: Unable to update Categories data.', '#e74c3c');
                  }

                });  

             }
                
          }
          else{
            showToast('Not Found Error: Categories data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Categories data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Categories data.', '#e74c3c');
      }

    });    
}


/* delete items in a given category */
function deleteCategoryFromMaster(menuCategory){

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

					if(menuCategory == mastermenu[i].category){
						mastermenu.splice(i,1);
						break;
					}

				}
		       
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
                    fetchAllCategories();
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Menu data.', '#e74c3c');
                  }

                });  
                
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


/* delete a category */
function deleteCategory(name) {  

	/* delete from cateogry list and delete all the entries from master menu as well */


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

               var categoryList = data.docs[0].value;

               for (var i=0; i<categoryList.length; i++) {  
                 if (categoryList[i] == name){
                    categoryList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_MENU_CATEGORIES",
                  "value": categoryList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MENU_CATEGORIES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
	                   /* on successful delete */
	                   deleteCategoryFromMaster(name);
	                   deleteCategoryFromKOTRelays(name);

					   /* on successful delete */
					   document.getElementById("menuDetailsArea").style.display = "none";
					   document.getElementById("categoryDeleteConfirmation").style.display = 'none';
					   //location.reload();

                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Categories data.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Categories data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Categories data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Categories data.', '#e74c3c');
      }

    });  

}




function openDeleteConfirmation(type){
	document.getElementById("deleteConfirmationConsent").innerHTML = '<button class="btn btn-default" onclick="cancelDeleteConfirmation()" style="float: left">Cancel</button>'+
                  							'<button class="btn btn-danger" onclick="deleteCategory(\''+type+'\')">Delete</button>';

	document.getElementById("deleteConfirmationText").innerHTML = 'All the items in the <b>'+type+'</b> category will also be deleted. Are you sure want to delete this category?';
	document.getElementById("categoryDeleteConfirmation").style.display = 'block';
}

function cancelDeleteConfirmation(){
	document.getElementById("categoryDeleteConfirmation").style.display = 'none';
}

/*edit category name alone */
function renameCategoryFromMaster(current, newName){


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

					if(current == mastermenu[i].category){
						mastermenu[i].category = newName;
						break;
					}

				}
		       
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
                    fetchAllCategories();
                    renameKOTRelaysList(current, newName);
		        	openSubMenu(newName);
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Menu data.', '#e74c3c');
                  }

                });  
                
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



function renameKOTRelaysList(current, newName){

	/* 
		Check if this category is listed under "KOT Relaying"
		and if added, update its name
	*/


    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_KOT_RELAYING" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_RELAYING'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){

                    for (var i=0; i<settingsList[n].data.length; i++){
                      if(settingsList[n].data[i].name == current){
                        settingsList[n].data[i].name = newName;
                        break;
                      }
                    }

                    updateRelayData(settingsList, data.docs[0]._rev);

                  break;
                }
              }


          }
          else{
            showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relaying data.', '#e74c3c');
      }

    });  
}


function deleteCategoryFromKOTRelays(name){

	/* 
		Check if this category is listed under "KOT Relaying"
		and if added, remove the name
	*/


    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_KOT_RELAYING" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_RELAYING'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){

                    for (var i=0; i<settingsList[n].data.length; i++){
                      if(settingsList[n].data[i].name == name){
                        settingsList[n].data.splice(i,1);
                        break;
                      }
                    }

                    updateRelayData(settingsList, data.docs[0]._rev);

                  break;
                }
              }


          }
          else{
            showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relaying data.', '#e74c3c');
      }

    });  	
}


function updateRelayData(customList, rev){

                    //Update
                    var updateData = {
                      "_rev": rev,
                      "identifierTag": "ACCELERATE_KOT_RELAYING",
                      "value": customList
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_KOT_RELAYING/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update KOT Relaying data.', '#e74c3c');
                      }
                    });     
}



function saveNewCategoryName(currentName){

	var newName = document.getElementById("edit_category_new_name").value;

	if(newName == ''){
		showToast('Warning: Name is invalid. Please set a name.', '#e67e22');
		return ''
	}

	if(currentName != newName){ /* replace category name*/

		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
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
		          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

		             var categoryList = data.docs[0].value;
		             var locatedPointer = '';

		       		 for (var i=0; i<categoryList.length; i++) { 
				       	 /*check if new name exists*/
				       	 if(categoryList[i] == newName){
				       	 	showToast('Warning: Name already exists. Please choose a different name.', '#e67e22');
				       	 	return '';
				       	 }

				       	 /*find the match for name change*/ 
				         if (categoryList[i] == currentName && locatedPointer == ''){
				         	locatedPointer = i;
				         }
		       		 }

				       	//Change name to new name
				       	categoryList[locatedPointer] = newName;

		                //Update
		                var updateData = {
		                  "_rev": data.docs[0]._rev,
		                  "identifierTag": "ACCELERATE_MENU_CATEGORIES",
		                  "value": categoryList
		                }

		                $.ajax({
		                  type: 'PUT',
		                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MENU_CATEGORIES/',
		                  data: JSON.stringify(updateData),
		                  contentType: "application/json",
		                  dataType: 'json',
		                  timeout: 10000,
		                  success: function(data) {
			                renameCategoryFromMaster(currentName, newName);
		                  },
		                  error: function(data) {
		                    showToast('System Error: Unable to update Categories data.', '#e74c3c');
		                  }

		                });  
  
		          }
		          else{
		            showToast('Not Found Error: Categories data not found.', '#e74c3c');
		          }
		        }
		        else{
		          showToast('Not Found Error: Categories data not found.', '#e74c3c');
		        }

		      },
		      error: function(data) {
		        showToast('System Error: Unable to read Categories data.', '#e74c3c');
		      }

		    });   

	}

	document.getElementById("categoryEditNameConfirmation").style.display = 'none';
}


function openEditCategoryName(current){
	document.getElementById("editCategoryNameConsent").innerHTML = '<button class="btn btn-default" onclick="hideEditCategoryName()" style="float: left">Cancel</button>'+
                  							'<button onclick="saveNewCategoryName(\''+current+'\')" class="btn btn-success">Save</button>';
	
	document.getElementById("editCategoryNameArea").innerHTML = '<div class="row">'+
	                        '<div class="col-lg-12">'+
	                           '<div class="form-group">'+
	                              '<input style="border: none; border-bottom: 1px solid" placeholder="Enter a Name" type="text" id="edit_category_new_name" value="'+current+'" class="form-control tip"/>'+
	                           '</div>'+
	                        '</div>'+                  
	                     '</div>';

	document.getElementById("categoryEditNameConfirmation").style.display = 'block';

	$("#edit_category_new_name").focus();
	
}

function hideEditCategoryName(){
	document.getElementById("categoryEditNameConfirmation").style.display = 'none';
}

//showToast('Hello from Abhijith', 'blue');


/* Veg / Non Veg types */

function triggerItemType(element){
	$("#newItemTypeOptions .foodTypeButton").each(function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }
    });

	$(element).addClass('active');    
}



