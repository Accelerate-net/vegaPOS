
//Trigger Right Panel 
function triggerRightPanelDisplay(){
	//to show Menu
	if(window.localStorage.appCustomSettings_OrderPageRightPanelDisplay && window.localStorage.appCustomSettings_OrderPageRightPanelDisplay == 'MENU'){
		document.getElementById("fullRightPanelMenu").style.display = 'block';
		document.getElementById("fullRightPanelTable").style.display = 'none';
		renderMenu();
	} //to show Table
	else if(window.localStorage.appCustomSettings_OrderPageRightPanelDisplay && window.localStorage.appCustomSettings_OrderPageRightPanelDisplay == 'TABLE'){
		document.getElementById("fullRightPanelTable").style.display = 'block';
		document.getElementById("fullRightPanelMenu").style.display = 'none';
		renderTables();
	}
	else{ //Render menu by default
		document.getElementById("fullRightPanelMenu").style.display = 'block';
		document.getElementById("fullRightPanelTable").style.display = 'none';
		renderMenu();
	}
	
}

/*Add Item to Cart */
function saveToCart(productToAdd, optionalSource){

		var cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];


		/*

		********************************
		OLD - Compact Cart (deprecated)
		********************************

		var i = 0;
		var flag = -1;

		while(i < cart_products.length){
          if(cart_products[i].code == productToAdd.code){

              if(cart_products[i].variant == productToAdd.variant){
                flag = i;
                break;
              }         	
          }

          i++;
        }


      if(flag != -1){
         	cart_products[flag].qty +=1;
      }
      else{
      		cart_products.push({"name": productToAdd.name, "category": productToAdd.category, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "isPackaged": productToAdd.isPackaged, "variant": productToAdd.variant, "code": productToAdd.code, "ingredients": productToAdd.ingredients ? productToAdd.ingredients : "", "qty": 1});
      }

      */

      var maxCartIndex = 0;

      if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
      	if(window.localStorage.maxCartIndex && window.localStorage.maxCartIndex != 0){
      		if(optionalSource == 'DELETE_REVERSAL'){
      			//Do nothing.
      		}
      		else{
      			maxCartIndex = parseInt(window.localStorage.maxCartIndex) + 1;
      			window.localStorage.maxCartIndex = maxCartIndex;
      		}
      	}
      	else{
      		var i = 0;
			maxCartIndex = 0;

			while(i < cart_products.length){
	          if(maxCartIndex <= cart_products[i].cartIndex){
				    maxCartIndex = cart_products[i].cartIndex;
	          }

	          i++;
	        }
      	}
      }
      else{
      	var i = 0;
		maxCartIndex = 0;

		while(i < cart_products.length){
          if(maxCartIndex <= cart_products[i].cartIndex){
			    maxCartIndex = cart_products[i].cartIndex;
          }

          i++;
        }
      }
      

      if(optionalSource == 'DELETE_REVERSAL'){ //For deleted item's reversal case.
      	cart_products.push({"cartIndex": productToAdd.cartIndex, "name": productToAdd.name, "category": productToAdd.category, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "isPackaged": productToAdd.isPackaged, "variant": productToAdd.variant, "code": productToAdd.code, "ingredients": productToAdd.ingredients ? productToAdd.ingredients : "", "qty": productToAdd.qty ? productToAdd.qty : 1, "cookingTime" : productToAdd.cookingTime ? parseInt(productToAdd.cookingTime) : 0});
      }
      else{
        cart_products.push({"cartIndex": maxCartIndex + 1, "name": productToAdd.name, "category": productToAdd.category, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "isPackaged": productToAdd.isPackaged, "variant": productToAdd.variant, "code": productToAdd.code, "ingredients": productToAdd.ingredients ? productToAdd.ingredients : "", "qty": 1, "cookingTime" : productToAdd.cookingTime ? parseInt(productToAdd.cookingTime) : 0});
      }


      window.localStorage.accelerate_cart = JSON.stringify(cart_products)
}

function additemtocart(encodedItem, category, optionalSource){

	/*
		category == 'ATTACHED_WITHIN' (encodedItem itself contains the category name)
		when the item is added through the spotlight tool
	*/


	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		
		if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

		}
		else{
			if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
				showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
				return '';
			}			
		}
	}

	var productToAdd = JSON.parse(decodeURI(encodedItem));

	if(category != '' && category != 'ATTACHED_WITHIN'){
		productToAdd.category = category;
	}

	if(!productToAdd.isAvailable && optionalSource != 'DELETE_REVERSAL'){
		showToast('Out of Stock: <b>'+productToAdd.name+'</b> is not available', '#48929B');
		return '';
	}

	//Allergy Check
	var allergicIngredients = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData) : [];
	if(allergicIngredients.length > 0){

		if(productToAdd.ingredients && productToAdd.ingredients.length > 0){
			var a = 0;
			var allergyIngredientDetected = false;
			while(allergicIngredients[a] && !allergyIngredientDetected){
				
				for(var i = 0; i < productToAdd.ingredients.length; i++){
					if(allergicIngredients[a] == productToAdd.ingredients[i]){
						showToast('Ingredient Filter Warning: '+productToAdd.name+' contains <b>'+ allergicIngredients[a] + '</b>', '#48929B');
						allergyIngredientDetected = true;
						break;
					}
				}

				a++;
			}			
		}
	}


	if(productToAdd.isCustom){

		console.log(productToAdd)
		
		//Pop up
		
		var i = 0;
		var optionList = '';
		while(productToAdd.customOptions[i]){
			optionList = optionList + '<li class="easySelectTool_customItem" onclick="addCustomToCart(\''+productToAdd.name+'\', \''+productToAdd.category+'\', \''+productToAdd.code+'\', \''+productToAdd.cookingTime+'\', \''+productToAdd.customOptions[i].customPrice+'\', \''+productToAdd.customOptions[i].customName+'\', \'SUGGESTION\', \''+(productToAdd.ingredients ? encodeURI(JSON.stringify(productToAdd.ingredients)) : '')+'\', \'\', \''+productToAdd.isPackaged+'\')">'+
										'<a>'+productToAdd.customOptions[i].customName+'<tag class="spotlightCustomItemTick"><i class="fa fa-check"></i></tag> <tag style="float: right"><i class="fa fa-inr"></i>'+productToAdd.customOptions[i].customPrice+'</tag></a>'+
									  '</li>';
			i++;
		}
		document.getElementById("customiseItemModal").style.display ='block';
		document.getElementById("customiseItemTitle").innerHTML = "Choice of <b>"+productToAdd.name+"</b>";
		document.getElementById("customOptionsList").innerHTML = '<ol class="rectangle-list">'+optionList+'</ol>';


          /*
            EasySelect Tool (LISTS)
          */
          var li = $('#customOptionsList .easySelectTool_customItem');
          var liSelected = li.eq(0).addClass('selectCustomItem');

          var easySelectTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#customOptionsList').is(':visible')) {

                 switch(e.which){
                  case 38:{ //  ^ Up Arrow 

					if(liSelected){
					    liSelected.removeClass('selectCustomItem');
					   	next = liSelected.prev();
						if(next.length > 0){
							liSelected = next.addClass('selectCustomItem');
						}else{
							liSelected = li.last().addClass('selectCustomItem');
						}
					}else{
						liSelected = li.last().addClass('selectCustomItem');
					}                      

                    break;
                  }
                  case 40:{ // Down Arrow \/ 

					if(liSelected){
						liSelected.removeClass('selectCustomItem');
						next = liSelected.next();
						if(next.length > 0){
							liSelected = next.addClass('selectCustomItem');
						}else{
							liSelected = li.eq(0).addClass('selectCustomItem');
						}
					}else{
						liSelected = li.eq(0).addClass('selectCustomItem');
					}

                    break;
                  }
                  case 27:{ // Escape (Close)
                    document.getElementById("customiseItemModal").style.display ='none';
                    easySelectTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)

                    $("#customOptionsList .easySelectTool_customItem").each(function(){
                      if($(this).hasClass("selectCustomItem")){

                      	easySelectTool.unbind();   
                        $(this).click();
                        e.preventDefault(); 
                        
                      }
                    });    

                    break;
                  }
                 }
            }
          });
	}
	else if(!productToAdd.isCustom){
		saveToCart(productToAdd, optionalSource)
		
		if(optionalSource == 'SUGGESTION'){

			$('#add_item_by_search').val('');
			$('#searchResultsRenderArea').html('');

			//UX Improvements
			//Focus last added item's qty input
			var iteration_count = 0;
			$("#cartDetails .itemQuantityInput").each(function(){

				if(iteration_count == 0){
					renderCart('', 'FOCUS_LATEST_QUANTITY');
				}

				iteration_count++;
			});		

			if(iteration_count == 0){
				renderCart('', 'FOCUS_LATEST_QUANTITY');
			}
		}
		else{
			renderCart();
		}
	}	


	$("#add_item_by_search").focus();
}

function addCustomToCart(name, category, code, cookTime, price, variant, optionalSource, encodedIngredients, cart_index, packagedExclusionFlag){

		var ingredientsTemp = encodedIngredients && encodedIngredients != '' ? JSON.parse(decodeURI(encodedIngredients)) : '';

		var productToAdd = {};
		productToAdd.name = name;
		productToAdd.category = category;
		productToAdd.code = code;
		productToAdd.cookingTime = parseInt(cookTime);
		productToAdd.price = price;
		productToAdd.variant = variant;
		productToAdd.isCustom = true;
		productToAdd.ingredients = ingredientsTemp;

		if(packagedExclusionFlag == 'true' || packagedExclusionFlag == true){
			productToAdd.isPackaged = true;	
		}

		if(optionalSource == 'DELETE_REVERSAL'){
			productToAdd.cartIndex = cart_index;
			saveToCart(productToAdd, 'DELETE_REVERSAL');
		}
		else{
			saveToCart(productToAdd);
		}
		
		document.getElementById("customiseItemModal").style.display ='none';

		if(optionalSource == 'SUGGESTION'){

			$('#add_item_by_search').val('');
			$('#searchResultsRenderArea').html('');

			//UX Improvements
			//Focus last added item's qty input
			var iteration_count = 0;
			$("#cartDetails .itemQuantityInput").each(function(){

				if(iteration_count == 0){
					renderCart('', 'FOCUS_LATEST_QUANTITY_CUSTOM_ITEM');
				}

				iteration_count++;
			});		

			if(iteration_count == 0){
				renderCart('', 'FOCUS_LATEST_QUANTITY_CUSTOM_ITEM');
			}
		}
		else{
			renderCart();
		}	
}

function hideCustomiseItem(){
	document.getElementById("customiseItemModal").style.display ='none';
}


/* Special Custom Item */
//To be entered manually

function addSpecialCustomItem(optionalText){



  // LOGGED IN USER INFO
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }
 else{
  	showToast('No Permission: Only an Admin can <b>add custom</b> item.', '#e67e22');
  	return '';
  }


	var itemName = '';

	if(optionalText && optionalText != ""){
		itemName =  optionalText;
	}

	document.getElementById("newManualCustomItemModal").style.display ='block';
	$('#add_new_manual_custom_name').val(itemName);
	$('#add_new_manual_custom_price').val(0);
	$('#add_new_manual_custom_name').focus();

          var easyActionsTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#newManualCustomItemModal').is(':visible')) {

                  if(e.which == 27){ // Escape (Close)
                    document.getElementById("newManualCustomItemModal").style.display ='none';
                    easyActionsTool.unbind();
                    $('#add_item_by_search').focus();
                    $('#add_item_by_search').select();
                  }
                  else if(e.which == 13){ // Enter (Confirm)
                    $("#addManualCustomItemOKButton").click();
                    e.preventDefault(); 
                    easyActionsTool.unbind();
                  }

            }
          });

}

function addSpecialCustomItemHide(){
	document.getElementById("newManualCustomItemModal").style.display ='none';	
	$('#add_item_by_search').focus();
	$('#add_item_by_search').select();
}

function addManualCustomItem(){

	var name = $('#add_new_manual_custom_name').val();
	var price = $('#add_new_manual_custom_price').val();
	var trimmed_name = name.replace(/\s/g,'');
	var trimmed_price = price.replace(/\s/g,'');

	if(trimmed_price.length > 0){
		price = parseInt(price);
	}


	var tax_flag = $('#add_new_manual_custom_taxable').is(":checked") ? true : false;

	if(trimmed_name.length == 0 || name == ''){
		showToast('Warning: Please add a name for the Item', '#e67e22');
		return '';
	}

	if(price == '' || price < 1){
		showToast('Warning: Please add a correct price for the Item', '#e67e22');
		return '';
	}

		var cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
		
		var i = 0;
		var top_manual_index = 0;
		var isFirstManualItem = true;

		while(i < cart_products.length){
          if(cart_products[i].code < 100){

          	if(cart_products[i].code > top_manual_index){
          		top_manual_index = cart_products[i].code;
          	}

          }

          i++;
        }

        top_manual_index++;


		var productToAdd = {};
		productToAdd.name = name;
		productToAdd.category = 'MANUAL_UNKNOWN';
		productToAdd.code = top_manual_index;
		productToAdd.price = price;	
		productToAdd.isCustom = false;

		if(tax_flag){ //tax applicable
			productToAdd.isPackaged = false;
		}
		else{
			productToAdd.isPackaged = true;
		}

		$('#add_item_by_search').val('');
		$('#add_item_by_search').focus();

		saveToCart(productToAdd);

		addSpecialCustomItemHide();
		renderCart();
}


function deleteItem(cart_index){
				
	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

		if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

		}
		else{
			if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
				showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
				return '';
			}		
		}

		
	}

	var cart_products = JSON.parse(window.localStorage.accelerate_cart)

	var i = 0;
	while(i < cart_products.length){

		if(cart_products[i].cartIndex == cart_index){
			cart_products.splice(i,1);
			break;
		}
	   	i++;
	}


    if(cart_products.length == 0){
    	window.localStorage.accelerate_cart = '';
    }
    else{
    	window.localStorage.accelerate_cart = JSON.stringify(cart_products)
    }
    
    renderCart();
}



function senseQuantityChange(event, cart_index){

	var x = document.getElementById("qty_"+cart_index);
	var current_value = parseInt(x.value);

	console.log('current: '+current_value)

	if(event.which === 40){ //Decrease Qty

		if(current_value == 1){
			return '';
		}

		x.value = current_value - 1;
	}
	else if(event.which === 38){ //Increase Qty
		x.value = current_value + 1;
	}
	else{
		//Do nothing if not UP or DOWN key pressed.
		return '';

	}

	var optionalFocusKey = "qty_"+cart_index;

	changeqty(cart_index, optionalFocusKey);
}


function changeqty(cart_index, optionalFocusKey){
console.log('qty changes....')
	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		

		if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

		}
		else{
			if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
				showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
				return '';
			}	
		}

	}


	var cart_products = JSON.parse(window.localStorage.accelerate_cart)
	
	var i = 0;
	while(i < cart_products.length){
		
		if(cart_products[i].cartIndex == cart_index){
			
			var temp = document.getElementById("qty_"+cart_index).value;
			if(temp == '' || isNaN(temp) || temp == 0){
				//temp = 1;
				console.log('am here...', cart_index)
				//Delete from Cart
				deleteItem(cart_index);
				$('#add_item_by_search').focus();

				return "";
			}

			if(temp < 0){
				temp = Math.abs(temp);
			}

			cart_products[i].qty = parseInt(temp);
			break;
		}

		i++;
	}

    window.localStorage.accelerate_cart = JSON.stringify(cart_products)
    renderCart();

    $('#add_item_by_search').focus();
}


/*

********************************
OLD - Compact Cart (deprecated)
********************************

function deleteItem(item, isCustom, variant){

	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

		if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

		}
		else{
			if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
				showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
				return '';
			}		
		}

		
	}


	var itemCode = JSON.parse(decodeURI(item))
	var cart_products = JSON.parse(window.localStorage.accelerate_cart)

		if(isCustom == 'true'){

				var i = 0;
					while(i < cart_products.length){

							if(cart_products[i].code == itemCode && cart_products[i].variant == variant){
								cart_products.splice(i,1);
								break;
							}
				        i++;
				    }


		}
        else{
				var i = 0;

					while(i < cart_products.length){

						if(cart_products[i].code == itemCode){
							cart_products.splice(i,1);
							break;
						}
				        i++;
				    }

        }

    if(cart_products.length == 0){
    	window.localStorage.accelerate_cart = '';
    }
    else{
    	window.localStorage.accelerate_cart = JSON.stringify(cart_products)
    }
    
    renderCart()

}



function senseQuantityChange(event, item, isCustom, variant){

	if(isCustom != 'true'){
		variant = '';	
	}

	if(event.which === 40){ //Decrease Qty

		if(document.getElementById("qty"+item+variant).value == 1){
			return '';
		}

		document.getElementById("qty"+item+variant).value = parseInt(document.getElementById("qty"+item+variant).value) - 1;
	}
	else if(event.which === 38){ //Increase Qty
		document.getElementById("qty"+item+variant).value = parseInt(document.getElementById("qty"+item+variant).value) + 1;
	}
	else{
		//Do nothing if not UP or DOWN key pressed.
		return '';

	}

	var optionalFocusKey = "qty"+item+variant;

	changeqty(item, isCustom, variant, optionalFocusKey);
}


function changeqty(item, isCustom, variant, optionalFocusKey){


	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		

		if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

		}
		else{
			if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
				showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
				return '';
			}	
		}

	}


	var itemCode = JSON.parse(decodeURI(item))
	var cart_products = JSON.parse(window.localStorage.accelerate_cart)
	

		if(isCustom == 'true'){

				var i = 0;
					while(i < cart_products.length){

							if(cart_products[i].code == itemCode && cart_products[i].variant == variant){
								var temp = document.getElementById("qty"+cart_products[i].code+cart_products[i].variant).value;
								if(temp == '' || isNaN(temp) || temp == 0){
									temp = 1;
									break;
								}
								cart_products[i].qty = parseInt(temp);
								break;
							}
				        i++;
				    }


		}
        else{
				var i = 0;

					while(i < cart_products.length){

						if(cart_products[i].code == itemCode){
							temp = document.getElementById("qty"+cart_products[i].code).value;
								if(temp == '' || isNaN(temp) || temp == 0){
									//temp = 1;
									//break;

									//Remove the item
									deleteItem(item, isCustom, variant);
									$('#add_item_by_search').focus();
									return '';
								}
							cart_products[i].qty = parseInt(temp);
							break;
						}
				        i++;
				    }

        }



    window.localStorage.accelerate_cart = JSON.stringify(cart_products)
    renderCart();

    $('#add_item_by_search').focus();
}

*/


function renderCart(optionalFocusKey, forceRequest){ //optionalFocusKey --> Which input field to be focused


	//Add Custom item button visibility
	  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
	        
	  if(jQuery.isEmptyObject(loggedInStaffInfo)){
	    loggedInStaffInfo.name = "";
	    loggedInStaffInfo.code = "";
	    loggedInStaffInfo.role = "";
	  }

	  //either profile not chosen, or not an admin
	  var isUserAnAdmin = false
	  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
	    isUserAnAdmin = true;
	  	document.getElementById("customItemAddShortcutButton").style.display = 'block';
	  }
	  else{
	  	document.getElementById("customItemAddShortcutButton").style.display = 'none';
	  }





	//Render Cart Items based on local storage
	var cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];

	var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
	
	var selectedBillingModeName = $('#customer_form_data_mode').attr("selected-mode");
	var selectedBillingModeInfo = '';


	//TWEAK
	if(selectedBillingModeName == ''){
		selectedBillingModeName = $('#customer_form_data_mode').html();
	}


	var n = 0;
	while(billing_modes[n]){
		if(billing_modes[n].name == selectedBillingModeName){
			selectedBillingModeInfo = billing_modes[n];
			break;
		}
		n++;
	}

	var licenceRequest = window.localStorage.accelerate_licence_number ? window.localStorage.accelerate_licence_number : '';

	//Caution: BILLING MODE not found
	if(!selectedBillingModeInfo || selectedBillingModeInfo == ''){
		
		if(licenceRequest != '') //show notification if application is activated.
			showToast('Error: Unknown Billing Mode. Check if mode <b>'+(selectedBillingModeName != undefined && selectedBillingModeName != '' ? selectedBillingModeName : '')+'</b> exists', '#e74c3c');
		
		selectedBillingModeInfo = {
			"name": "Unknown",
			"extras": [],
			"isDiscountable": false,
			"maxDiscount": 0,
			"type": "ERROR"
		}
	}


	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

	              	var params = data.docs[0].value;
		          	var selectedModeExtrasList = selectedBillingModeInfo.extras;
		          	var cartExtrasList = [];
		          	var n = 0, m = 0;
		          	while(selectedModeExtrasList[n]){
		          		m = 0;
		          		while(params[m]){	  
		          			if(selectedModeExtrasList[n].name == params[m].name)  
		          			{
		          				params[m].value = parseFloat(selectedModeExtrasList[n].value);      			
		          				cartExtrasList.push(params[m]);
		          			}
		          			m++;
		          		}
		          		n++;
		          	}

		          	renderCartAfterProcess(cart_products, selectedBillingModeInfo, cartExtrasList, optionalFocusKey, forceRequest);	          	

	          }
	          else{
	            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });

}

function renderCartAfterProcess(cart_products, selectedBillingModeInfo, selectedModeExtras, optionalFocusKey, forceRequest){


  // LOGGED IN USER INFO

  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  //either profile not chosen, or not an admin
  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }


	/*
		cart_products - cart of items 
		selectedBillingModeInfo - info relating to the particular mode like minBillAmount, isDiscountable? etc.
		selectedModeExtras - extras of taxes to be calculated		
	*/


	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	var disableQuantityChange = false;
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
			
			var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
			
			if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

			}
			else{
				if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
					disableQuantityChange = true;
					//to prevent changes
				}
			}
	}



	//Editing Mode
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		//Empty Cart --> NEGLECT!
	}
	else{
		if(cart_products.length < 1){
			document.getElementById("cartTitleHead").innerHTML = '';
			document.getElementById("summaryDisplay").innerHTML = '';
			document.getElementById("summarySumDisplay").innerHTML = '<div style="height: 30vh !important;"></div>';

			document.getElementById("cartDetails").innerHTML = '<p style="font-size: 18px; margin: 15px 0 0 0 ; text-align: center; font-weight: 300; color: #b9b9b9; }">'+
								'<img style="width: 18%; margin: 20px 0px 5px 0px;" src="images/common/emptycart.png"><br>No items in Cart</p>';
			
			document.getElementById("cartActionButtons").innerHTML = '';

			return 0;
		}		
	}

	var i = 0;
	var temp = '';
	var totqty = 0;
	var tot = 0;
	var totPackaged = 0;
	var grandPayableSum = 0;

	var hasUnsavedChanges = false;
	var particularItemHasChanges = false;

	var variantName = '';
	var notifyIcon = '';


	//Editing Mode (Check for unsaved changes w.r.t Original Cart)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

		var my_copy_KOT_original = JSON.parse(window.localStorage.edit_KOT_originalCopy);
		var my_copy_KOTNumber = my_copy_KOT_original.KOTNumber;
		var my_copy_SourceTable = my_copy_KOT_original.table;
		var my_copy_BillingMode = my_copy_KOT_original.orderDetails.mode;
		var my_copy_isDineMode = false;

		if(my_copy_KOT_original.orderDetails.modeType == 'DINE'){
			my_copy_isDineMode = true;	
		}


		while(i < cart_products.length){
			variantName = '';
			notifyIcon = '';
			particularItemHasChanges = false;

			var tempItemCheck = checkForItemChanges(cart_products[i].code, cart_products[i].variant, cart_products[i].qty, cart_products[i].cartIndex);

			switch(tempItemCheck){
				case 'QUANTITY_INCREASE':{
					notifyIcon = '<i class="fa fa-caret-up" style="color: #2ecc71; padding-left: 3px; font-size: 12px"></i>';
					hasUnsavedChanges = true;
					particularItemHasChanges = true;
					break;
				}
				case 'QUANTITY_DECREASE':{
					notifyIcon = '<i class="fa fa-caret-down" style="color: #c0392b; padding-left: 3px; font-size: 12px"></i>';
					hasUnsavedChanges = true;
					particularItemHasChanges = true;
					break;
				}
				case 'NEW_ITEM':{
					notifyIcon = '<i class="fa fa-star" style="color: #ffa500; padding-left: 3px; font-size: 10px"></i>';
					hasUnsavedChanges = true;
					particularItemHasChanges = true;
					break;
				}
				default:{
					notifyIcon = '';
					break;
				}
			}



			totqty = totqty + cart_products[i].qty
			tot = tot + (cart_products[i].price*cart_products[i].qty)

			if(cart_products[i].isPackaged){
				totPackaged += (cart_products[i].price*cart_products[i].qty);
			}

			var itemrem = cart_products[i].code;

			if(cart_products[i].isCustom){
				variantName = ' ('+cart_products[i].variant+')';
			}


				var allergyIngredientDetected = false;


				//Allergy Check
				var allergicIngredients = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData) : [];
				if(allergicIngredients.length > 0){
					if(cart_products[i].ingredients && cart_products[i].ingredients.length > 0){
						
						var itemContainsAllergicIngredient = false;

						var a = 0;
						while(allergicIngredients[a] && !itemContainsAllergicIngredient){
							
							for(var c = 0; c < cart_products[i].ingredients.length; c++){
								if(allergicIngredients[a] == cart_products[i].ingredients[c]){
									itemContainsAllergicIngredient = true;
									allergyIngredientDetected = true;
									temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"' : (my_copy_isDineMode && isUserAnAdmin ? 'onclick="openShiftItemWizard(\''+my_copy_SourceTable+'\', \''+my_copy_KOTNumber+'\', \''+my_copy_BillingMode+'\', \''+encodeURI(JSON.stringify(cart_products[i]))+'\')"' : '') )+'><span class="sname">'+cart_products[i].name+variantName+'<i class="bannedIngredient fa fa-ban" title="Contains Allergic Ingredients"></i>'+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
											'<td style="vertical-align: middle">'+
											'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
											'</td>'+
											'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
													
									break;
								}
							}

							if(a == allergicIngredients.length - 1 && !itemContainsAllergicIngredient){ //Last iteration
								temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"' : (my_copy_isDineMode && isUserAnAdmin ? 'onclick="openShiftItemWizard(\''+my_copy_SourceTable+'\', \''+my_copy_KOTNumber+'\', \''+my_copy_BillingMode+'\', \''+encodeURI(JSON.stringify(cart_products[i]))+'\')"' : ''))+'><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
									'<td style="vertical-align: middle">'+
									'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
									'</td>'+
									'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
								
							}

							a++;
						}			
					}
					else{
						temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"' : (my_copy_isDineMode && isUserAnAdmin  ? 'onclick="openShiftItemWizard(\''+my_copy_SourceTable+'\', \''+my_copy_KOTNumber+'\', \''+my_copy_BillingMode+'\', \''+encodeURI(JSON.stringify(cart_products[i]))+'\')"' : ''))+'><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
							'<td style="vertical-align: middle">'+
							'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
							'</td>'+
							'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
						
					}
				}
				else{
					temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"' : (my_copy_isDineMode && isUserAnAdmin ? 'onclick="openShiftItemWizard(\''+my_copy_SourceTable+'\', \''+my_copy_KOTNumber+'\', \''+my_copy_BillingMode+'\', \''+encodeURI(JSON.stringify(cart_products[i]))+'\')"' : ''))+'><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
						'<td style="vertical-align: middle">'+
						'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
						'</td>'+
						'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
				
				}	
			
				/*
				if(i == cart_products.length - 1){
					if(allergyIngredientDetected){
						showToast('<i class="fa fa-ban"></i> Ingredient Filter Warning: Certain items in this order contains allergic ingredients', '#48929B');
					}
				}
				*/

			i++	
		}
	}
	else{ //New Order

		var allergyIngredientDetected = false;

		while(i < cart_products.length){
			
			variantName = '';
			totqty = totqty + cart_products[i].qty
			tot = tot + (cart_products[i].price*cart_products[i].qty)
			var itemrem = cart_products[i].code;


			if(cart_products[i].isPackaged){
				totPackaged += (cart_products[i].price*cart_products[i].qty);
			}

			if(cart_products[i].isCustom){
				variantName = ' ('+cart_products[i].variant+')';
			}

			//Allergy Check
			var allergicIngredients = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData) : [];
			if(allergicIngredients.length > 0){
				if(cart_products[i].ingredients && cart_products[i].ingredients.length > 0){
					
					var itemContainsAllergicIngredient = false;

					var a = 0;
					while(allergicIngredients[a] && !itemContainsAllergicIngredient){
						
						for(var c = 0; c < cart_products[i].ingredients.length; c++){
							if(allergicIngredients[a] == cart_products[i].ingredients[c]){
								itemContainsAllergicIngredient = true;
								allergyIngredientDetected = true;
								temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"><span class="sname">'+cart_products[i].name+variantName+'<i class="bannedIngredient fa fa-ban" title="Contains Allergic Ingredients"></i>'+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
								break;
							}
						}

						if(a == allergicIngredients.length - 1 && !itemContainsAllergicIngredient){ //Last iteration
							temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
						}

						a++;
					}			
				}
				else{
					temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
				}
			}
			else{
				temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem('+cart_products[i].cartIndex+')"></i></td><td><button id="cart_item_name_'+cart_products[i].cartIndex+'" class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\', '+cart_products[i].cartIndex+')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty_'+cart_products[i].cartIndex+'" cart-index="'+cart_products[i].cartIndex+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, '+cart_products[i].cartIndex+')" onchange="changeqty('+cart_products[i].cartIndex+')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
			}

			/*
			if(i == cart_products.length - 1){
				if(allergyIngredientDetected){
					showToast('<i class="fa fa-ban"></i> Ingredient Filter Warning: Certain items in this order contains allergic ingredients', '#48929B');
				}
			}
			*/

			i++
		}
	}


	//Check for deleted items
	var itemDeleteTest = checkIfItemDeleted();

	if(itemDeleteTest == 'DELETED'){
		hasUnsavedChanges = true;
		temp = '<tr class="success" onclick="quickViewRemovedItems()"><td colspan="5" style="color: #e74c3c; text-align: center; cursor: pointer"><i class="fa fa-exclamation-circle"></i> Removed some items</td></tr>' + temp;
	}
	else if(itemDeleteTest == 'DELETED_ALL'){
		hasUnsavedChanges = true;
		temp = '<tr class="success" onclick="quickViewRemovedItems()"><td colspan="5" style="color: #e74c3c; text-align: center; cursor: pointer;"><i class="fa fa-exclamation-circle"></i> Removed all items</td></tr>' + temp;
	}

	
	document.getElementById("cartTitleHead").innerHTML = '<tr class="success cartTitleRow"> <th class="satu cartTitleRow" onclick="clearCartConsent()"><i class="fa fa-trash-o"></i></th><th class="cartTitleRow">Item</th> <th class="cartTitleRow">Price</th> <th class="cartTitleRow" >Qty</th> <th class="cartTitleRow">Total</th>  </tr>';
	document.getElementById("cartDetails").innerHTML = temp;
	

	/*Calculate Taxes and Other Charges*/ 
	//---------------------------------//

	/* IMPORTANT NOTE:
		>> 	In editing mode, the Extras, Discounts, Other Charges has to be re-calculated w.r.t the original kot parameters.
			NOT w.r.t the modeType (VERY IMPORTANT).
		>>	Calculations w.r.t the modeType is done only while punching new order for display purposes.
		>>	Once KOT is punched, everything is w.r.t the data inside the KOT JSON!
	*/


	/*
		NOTE: Do not apply tax or other extras
		marked with 'excludePackagedFoods' = true on items
		like Pepsi etc. which is marked with 'isPackaged' = true.
		These are sold at MRP. Packaging Charges, Delivery charges etc. not applicable.
	*/

          var otherChargesSum = 0;        
          var otherCharges = '';
          var otherChargerRenderCount = 1;

          var otherCustomChargesValue = 0;
          var discountValue = 0;

          otherCharges = '<tr class="info">'; //Beginning	

    //Editing Mode (Discount and Other Charges might not be ZERO)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		
		selectedModeExtras = calculableOriginalKOT.extras;

          if(selectedModeExtras.length > 0){

          	for(var k = 0; k < selectedModeExtras.length; k++){
          		if(k%2 == 0){
          			otherCharges = otherCharges + '</tr><tr class="info">';
          		}

          		var tempExtraTotal = 0;
          		if(selectedModeExtras[k].isPackagedExcluded){

		          		if(selectedModeExtras[k].value != 0){
		          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
		          				tempExtraTotal = (selectedModeExtras[k].value * (tot - totPackaged))/100;
		          			}
		          			else if(selectedModeExtras[k].unit == 'FIXED'){
		          				tempExtraTotal = selectedModeExtras[k].value;
		          			}
		          		}
          		}
          		else{
		          		if(selectedModeExtras[k].value != 0){
		          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
		          				tempExtraTotal = selectedModeExtras[k].value * tot/100;
		          			}
		          			else if(selectedModeExtras[k].unit == 'FIXED'){
		          				tempExtraTotal = selectedModeExtras[k].value;
		          			}
		          		}          			
          		}


          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

          		otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+selectedModeExtras[k].name+' ('+(selectedModeExtras[k].unit == 'PERCENTAGE'? selectedModeExtras[k].value + '%': '<i class="fa fa-inr"></i>'+selectedModeExtras[k].value)+')</td><td width="15%" class="text-right cartSummaryRow"><i class="fa fa-inr"></i>'+tempExtraTotal+'</td>';
          	
          		otherChargesSum = otherChargesSum + tempExtraTotal;
          		
          	}
          }

		otherChargerRenderCount = otherChargerRenderCount + k;
		

		//Calculate Discount and Custom Extra

		if(calculableOriginalKOT.discount.value && calculableOriginalKOT.discount.value != 0){

			if(calculableOriginalKOT.discount.unit == 'PERCENTAGE'){
				discountValue = calculableOriginalKOT.discount.value * tot/100;
			}
			else{
				discountValue = calculableOriginalKOT.discount.value;
			}
		}

		discountValue = Math.round(discountValue * 100) / 100;



		if(calculableOriginalKOT.customExtras.value && calculableOriginalKOT.customExtras.value != 0){
	
			if(calculableOriginalKOT.customExtras.unit == 'PERCENTAGE'){
				otherCustomChargesValue = calculableOriginalKOT.customExtras.value * tot/100;
			}
			else{
				otherCustomChargesValue = calculableOriginalKOT.customExtras.value;
			}
		}

		otherCustomChargesValue = Math.round(otherCustomChargesValue * 100) / 100;

		 
          if(otherChargerRenderCount%2 == 0){
          	otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+( otherCustomChargesValue != 0 ? calculableOriginalKOT.customExtras.type+' ('+(calculableOriginalKOT.customExtras.unit == 'PERCENTAGE'? calculableOriginalKOT.customExtras.value+'%' : '<i class="fa fa-inr"></i>'+calculableOriginalKOT.customExtras.value)+') ' : 'Other Charges' )+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(otherCustomChargesValue != 0 ? '<i class="fa fa-inr"></i>'+otherCustomChargesValue : '0')+'</td></tr>'+
          				'<tr class="info"><td width="35%" class="cartSummaryRow">'+( discountValue != 0 ? 'Discounts ('+(calculableOriginalKOT.discount.unit == 'PERCENTAGE'? calculableOriginalKOT.discount.value+'%' : '<i class="fa fa-inr"></i>'+calculableOriginalKOT.discount.value)+') ' : 'Discounts' )+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(discountValue != 0? '<tag style="color: #e74c3c">- <i class="fa fa-inr"></i>'+discountValue+'</tag>' : '0')+'</td>'+
          				'<td class="cartSummaryRow"></td><td class="cartSummaryRow"></td></tr>';
          }
          else{
          	otherCharges = otherCharges + '</tr> <tr class="info"><td width="35%" class="cartSummaryRow">'+( otherCustomChargesValue != 0 ? calculableOriginalKOT.customExtras.type+' ('+(calculableOriginalKOT.customExtras.unit == 'PERCENTAGE'? calculableOriginalKOT.customExtras.value+'%' : '<i class="fa fa-inr"></i>'+calculableOriginalKOT.customExtras.value)+') ' : 'Other Charges' )+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(otherCustomChargesValue != 0 ? '<i class="fa fa-inr"></i>'+otherCustomChargesValue : '0')+'</td>'+
          					'<td width="35%" class="cartSummaryRow">'+( discountValue != 0 ? 'Discounts ('+(calculableOriginalKOT.discount.unit == 'PERCENTAGE'? calculableOriginalKOT.discount.value+'%' : '<i class="fa fa-inr"></i>'+calculableOriginalKOT.discount.value)+') ' : 'Discounts' )+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(discountValue != 0? '<tag style="color: #e74c3c">- <i class="fa fa-inr"></i>'+discountValue+'</tag>' : '0')+'</td></tr>';
          }
    }
    else{ //Not editing, new order being punched - Discount, other charges can not be applied at this stage -> both equals to 0

    	  /* Unsaved changes flag - applicable for Editing Orders only */
		  window.localStorage.hasUnsavedChangesFlag = 0;
		  //document.getElementById("leftdiv").style.borderColor = "#FFF";


          if(selectedModeExtras.length > 0){

          	for(var k = 0; k < selectedModeExtras.length; k++){
          		if(k%2 == 0){
          			otherCharges = otherCharges + '</tr><tr class="info">';
          		}

          		var tempExtraTotal = 0;
          		if(selectedModeExtras[k].excludePackagedFoods){

		          		if(selectedModeExtras[k].value != 0){
		          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
		          				tempExtraTotal = (selectedModeExtras[k].value * (tot - totPackaged))/100;
		          			}
		          			else if(selectedModeExtras[k].unit == 'FIXED'){
		          				tempExtraTotal = selectedModeExtras[k].value;
		          			}
		          		}
          		}
          		else{

		          		if(selectedModeExtras[k].value != 0){
		          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
		          				tempExtraTotal = selectedModeExtras[k].value * tot/100;
		          			}
		          			else if(selectedModeExtras[k].unit == 'FIXED'){
		          				tempExtraTotal = selectedModeExtras[k].value;
		          			}
		          		}          			
          		}

          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

          		otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+selectedModeExtras[k].name+' ('+(selectedModeExtras[k].unit == 'PERCENTAGE'? selectedModeExtras[k].value + '%': '<i class="fa fa-inr"></i>'+selectedModeExtras[k].value)+')</td><td width="15%" class="text-right cartSummaryRow"><i class="fa fa-inr"></i>'+tempExtraTotal+'</td>';
          	
          		otherChargesSum = otherChargesSum + tempExtraTotal;
          		
          	}
          }


          otherChargerRenderCount = otherChargerRenderCount + k;



          if(otherChargerRenderCount%2 == 0){
          	otherCharges = otherCharges + '<td class="cartSummaryRow"></td><td class="cartSummaryRow"></td></tr>';
          }
          else{
          	otherCharges = otherCharges + '</tr>';
          }
    }

          grandPayableSum = tot + otherChargesSum + otherCustomChargesValue - discountValue;

          grandPayableSum = Math.round(grandPayableSum * 100) / 100;


	document.getElementById("summaryDisplay").innerHTML = '<table class="table table-condensed totals" style="margin: 0">'+
                        '   <tbody>'+
                        '     <tr class="info">'+
                        '         <td width="35%" class="cartSummaryRow">Total Items</td>'+
                        '        <td class="text-right cartSummaryRow" style="padding-right:10px;" width="15%"><span id="count">'+totqty+'</span></td>'+
                        '         <td width="35%" class="cartSummaryRow">Total</td>'+
                        '         <td class="text-right cartSummaryRow" colspan="2" width="15%"><span id="total"><i class="fa fa-inr"></i>'+tot+'</span></td>'+
                        '      </tr>'+otherCharges+
                        '   </tbody>'+
                        '</table>';

    document.getElementById("summarySumDisplay").innerHTML = '<table class="table table-condensed totals" style="margin: 0">'+
    					'   <tbody>'+ 
                        '      <tr class="success cartSumRow">'+
                        '         <td colspan="2" class="cartSumRow" style="font-weight: 400 !important; font-size: 16px;">'+
                        '            Payable Amount'+
                        '         </td>'+
                        '         <td class="text-right cartSumRow" colspan="2" ><span id="total-payable"><i class="fa fa-inr"></i>'+properRoundOff(grandPayableSum)+'</span></td>'+
                        '      </tr>'+ 
    					'   </tbody>'+
                        '</table>';

/*
	DISPLAY ACTIONS
*/



  // LOGGED IN USER INFO

  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  //either profile not chosen, or not an admin
  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }



//Editing Mode
if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

	var editingKOTContent = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

 	//EDIT - Actions   
 	if(!selectedBillingModeInfo || selectedBillingModeInfo == '' || selectedBillingModeInfo.name == 'Unknown'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+	
	                        '<div class="col-xs-12" style="padding: 0">'+
	                           '<div class="btn-group-vertical btn-block">'+
	                              '<button class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height:40px;" onclick="startFreshOrder()" id="triggerClick_HideCartButton" >Close</button>'+
	                           '</div>'+
	                        '</div>'+
	                     '</div>';
 		return '';
 	}

 	//If editing allowed?
 	var isEditingEnabled = false;
 	if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed != ''){
 		if(window.localStorage.appOtherPreferences_orderEditingAllowed == 1)
 			isEditingEnabled = true;
 	}

 	if(!isEditingEnabled){ //Editing NOT ALLOWED after KOT PRINTED
	 	if(selectedBillingModeInfo.type == 'PARCEL' || selectedBillingModeInfo.type == 'TOKEN' || selectedBillingModeInfo.type == 'DELIVERY'){
	 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                           	  (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel Order</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px;" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+ 	
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button id="triggerClick_PrintItemViewButton" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat shortcutSafe" onclick="printCurrentKOTView(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Print View</button>'+
		                           '</div>'+
		                        '</div>'+	
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button class="btn btn-success btn-block btn-flat shortcutSafe" style="height:71px;" onclick="generateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" id="triggerClick_PrintBillButton">Proceed to Bill</button>'+
		                           '</div>'+
		                        '</div>'+
		                     '</div>';
	 	}   
	 	else if(selectedBillingModeInfo.type == 'DINE'){

	 		if(hasUnsavedChanges){

	 			/* Set unsaved changes flag */
	 			window.localStorage.hasUnsavedChangesFlag = 1;
	 			document.getElementById("leftdiv").style.borderColor = "#e74c3c";
	 			


				document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel Order</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px;" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="undoChangesInKOT()">Undo Changes</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat shortcutSafe" onclick="generateKOT()" id="triggerClick_PrintKOTButton">Print Changed KOT</button>'+
		                           	  '<button class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTSilentlyButton" style="height:5px; display: none;" onclick="generateKOT(\'SILENTLY\')">Print Silent</button>'+
		                           '</div>'+
		                        '</div>'+                           
		                     '</div>';
	 		}
	 		else{

	 			/* Set unsaved changes flag */
	 			window.localStorage.hasUnsavedChangesFlag = 0;
	 			document.getElementById("leftdiv").style.borderColor = "#FFF";

		 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel Order</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button id="triggerClick_PrintItemViewButton" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat shortcutSafe" onclick="printCurrentKOTView(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Print View</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<button  class="btn btn-success btn-block btn-flat shortcutSafe" onclick="compareChangesAndGenerateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" style="height:71px;" id="triggerClick_PrintBillButton">Proceed to Bill</button>'+
		                        '</div>'+                            
		                     '</div>';
	 		}
	 	}  	
	}
	else{
	 		if(hasUnsavedChanges){
	 			/* Set unsaved changes flag */
	 			window.localStorage.hasUnsavedChangesFlag = 1;
	 			document.getElementById("leftdiv").style.borderColor = "#e74c3c";
	 			


				document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel Order</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px;" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="undoChangesInKOT()">Undo Changes</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat shortcutSafe" onclick="generateKOT()" id="triggerClick_PrintKOTButton">Print Changed KOT</button>'+
		                              '<button  class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTSilentlyButton" style="height:5px; display: none;" onclick="generateKOT(\'SILENTLY\')">Print Silent</button>'+
		                           '</div>'+
		                        '</div>'+                           
		                     '</div>';
	 		}
	 		else{

	 			/* Set unsaved changes flag */
	 			window.localStorage.hasUnsavedChangesFlag = 0;
	 			document.getElementById("leftdiv").style.borderColor = "#FFF";

		 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel Order</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button id="triggerClick_PrintItemViewButton" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat shortcutSafe" onclick="printCurrentKOTView(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Print View</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<button  class="btn btn-success btn-block btn-flat shortcutSafe" onclick="compareChangesAndGenerateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" style="height:71px;" id="triggerClick_PrintBillButton">Proceed to Bill</button>'+
		                        '</div>'+                            
		                     '</div>';
	 		}
	}	
}
else{
 	//NEW ORDER - Actions 

 	if(!selectedBillingModeInfo || selectedBillingModeInfo == '' || selectedBillingModeInfo.name == 'Unknown'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+	
	                        '<div class="col-xs-12" style="padding: 0">'+
	                           '<div class="btn-group-vertical btn-block">'+
	                              '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height:40px;" onclick="startFreshOrder()" id="triggerClick_HideCartButton" >Close</button>'+
	                           '</div>'+
	                        '</div>'+
	                     '</div>';

 		return '';
 	}

 	if(selectedBillingModeInfo.type == 'TOKEN'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button  style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="clearCurrentOrder()" id="triggerClick_closeOrderButton" >Close</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
                           '<button  class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTButton" style="height:71px;" onclick="generateKOT()">Print KOT & Bill</button>'+
                           '<button  class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTSilentlyButton" style="height:5px; display: none;" onclick="generateKOT(\'SILENTLY\')">Print Silent</button>'+
                        '</div>'+
                     '</div>';
 	}   
 	else if(selectedBillingModeInfo.type == 'PARCEL' || selectedBillingModeInfo.type == 'DELIVERY'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button  style="margin-bottom: 4px" class="btn btn-warning btn-block btn-flat" id="triggerClick_saveOrderButton" onclick="addToHoldKOT()">Save</button>'+
                              '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" onclick="clearCurrentOrder()" id="triggerClick_closeOrderButton" >Close</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
                           '<button  class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTButton" style="height:71px;" onclick="generateKOT()">Print KOT & Bill</button>'+
                           '<button  class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTSilentlyButton" style="height:5px; display: none;" onclick="generateKOT(\'SILENTLY\')">Print Silent</button>'+
                        '</div>'+
                     '</div>';
 	}
 	else if(selectedBillingModeInfo.type == 'DINE'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button  style="margin-bottom: 4px" class="btn btn-warning btn-block btn-flat" id="triggerClick_saveOrderButton" onclick="addToHoldKOT()">Save</button>'+
                              '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" onclick="clearCurrentOrder()" id="triggerClick_closeOrderButton" >Close</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button  style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat shortcutSafe" onclick="generateKOT()" id="triggerClick_PrintKOTButton">Print KOT</button>'+
                              '<button  class="btn btn-success btn-block btn-flat shortcutSafe" id="triggerClick_PrintKOTSilentlyButton" style="height:5px; display: none;" onclick="generateKOT(\'SILENTLY\')">Print Silent</button>'+
                           '</div>'+
                        '</div>'+                    
                     '</div>';
 	}  
}

	//optionalFocusKey --> Which input field to be focused after cart is rendered
	if(optionalFocusKey && optionalFocusKey != '' && optionalFocusKey != undefined && (!forceRequest || forceRequest == "" || forceRequest == undefined)){
		/* cuurently used for quantity up and down operation only!  --> ADD MORE */
		$('#'+optionalFocusKey).focus();
	}

	//Overwrite (if any Force Request)
	if(forceRequest == "FOCUS_LATEST_QUANTITY"){
			//UX Improvements
			//Focus last added item's qty input
			var iteration_count = 0;
			$("#cartDetails .itemQuantityInput").each(function(){

				if(iteration_count == 0){
					$(this).focus();
					$(this).select();


			        //UX Improvements
					var approveItemQuantityTriggerer = $(this).keyup(function(e) {
							if (e.which === 13) {
						        var cart_index = parseInt($(this).attr("cart-index")); 
						        changeqty(cart_index);
						        approveItemQuantityTriggerer.unbind();
						    }
					}); 
				}

				iteration_count++;
			});	
	}
	else if(forceRequest == "FOCUS_LATEST_QUANTITY_CUSTOM_ITEM"){ //to fix double ENTER bug
			//UX Improvements
			//Focus last added item's qty input
			var iteration_count = 0;
			$("#cartDetails .itemQuantityInput").each(function(){

				if(iteration_count == 0){

					$(this).focus();
					$(this).select();


			        //UX Improvements
			        var firstEnterTriggered = false;
					var approveItemQuantityTriggerer = $(this).keyup(function(e) {

							if (e.which === 13) {

								if(firstEnterTriggered){
						        	var cart_index = parseInt($(this).attr("cart-index")); 
						        	changeqty(cart_index);
						        	approveItemQuantityTriggerer.unbind();
						    	}

						    	firstEnterTriggered = true;
						    }
					}); 
				}

				iteration_count++;
			});	
	}  
}





/* To Print Current KOT View */
function printCurrentKOTView(kotID, optionalSource){

	$("#triggerClick_PrintItemViewButton").removeClass("shortcutSafe"); //Shortcut safe

    //Set _id from Branch mentioned in Licence
    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
      showToast('Invalid Licence Error: KOT can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
      return '';
    }

    var kot_request_data = accelerate_licencee_branch +"_KOT_"+ kotID;

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+kot_request_data,
      timeout: 10000,
      success: function(data) {
        if(data._id == kot_request_data){
          var kot = data;
          sendToPrinter(kot, 'VIEW');

          showToast('Items View of #'+kotID+' generated Successfully', '#27ae60');

          clearCurrentEditingOrder();
          $("#add_item_by_search").focus();
          
        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }
    }); 	
}


function startFreshOrder(){

	//to remove cart info, customer info
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

	customerInfo.name = "";
	customerInfo.mobile ="";
	customerInfo.count = "";
	customerInfo.mappedAddress = "";
	customerInfo.reference = "";
	customerInfo.isOnline = false;


		var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
		
		if(billing_modes.length == 0){
			showToast('Warning: There are no billing modes created.', '#e67e22');
		}
		else{

			var n = 0;
			while(billing_modes[n]){
				if(billing_modes[n].type == 'DINE'){
					customerInfo.mode = billing_modes[n].name;
					customerInfo.modeType = 'DINE';
					break;
				}

				if(n == billing_modes.length - 1){ //No dine modes ==> Set first in the list be default
					customerInfo.mode = billing_modes[0].name;
					customerInfo.modeType = billing_modes[0].type;
				}

				n++;
			}	

		}

	window.localStorage.customerData = JSON.stringify(customerInfo);
	window.localStorage.accelerate_cart = '';
	window.localStorage.edit_KOT_originalCopy = '';
	window.localStorage.userAutoFound = '';
	window.localStorage.userDetailsAutoFound = '';

	window.localStorage.specialRequests_comments = '';
	window.localStorage.allergicIngredientsData = '[]';

	window.localStorage.hasUnsavedChangesFlag = 0;
	window.localStorage.maxCartIndex = 0;
 	document.getElementById("leftdiv").style.borderColor = "#FFF";

	renderCustomerInfo();
	renderTables();
}

function undoChangesInKOT(){
	//Reset accelerate_cart same as the originalKOT Cart

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

		window.localStorage.accelerate_cart = JSON.stringify(originalData.cart);
		showToast('Undone the changes!', '#27ae60');

		//Recalculate max cartIndex
		var i = 0;
		var maxCartIndex = 0;

		while(i < originalData.cart.length){
          if(maxCartIndex <= originalData.cart[i].cartIndex){
			    maxCartIndex = originalData.cart[i].cartIndex;
          }

          i++;
        }

    	window.localStorage.maxCartIndex = maxCartIndex;


		renderCustomerInfo();
	}
	else{
		showToast('Oops! Failed to undo the changes.', '#e74c3c');
		return '';
	}
}


function compareChangesAndGenerateBillFromKOT(kotID, optionalPageRef){

	$("#triggerClick_PrintBillButton").removeClass("shortcutSafe"); //Shortcut safe

	/*
		Proceed to bill generation only if,
			1. There are no un-printed items in active Cart
			2. Meaning, accelerate_cart equals cart in originalKOT
	*/

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){


		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		
		var changedCustomerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
		if(jQuery.isEmptyObject(changedCustomerInfo)){
			showToast('Customer Details missing', '#e74c3c');
			return '';
		}

		var changed_cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
		if(changed_cart_products.length == 0){
			showToast('Oops! There are unsaved changes and Bill can not be generated.', '#e74c3c');
			return '';
		}


		//Compare changes in the Cart
		var original_cart_products = originalData.cart;

		//Search for changes in the existing items
		var n = 0;
		while(original_cart_products[n]){
			
			//Find each item in original cart in the changed cart
			var itemFound = false;
			for(var i = 0; i < changed_cart_products.length; i++){
				//same item found, check for its quantity and report changes
				if(original_cart_products[n].cartIndex == changed_cart_products[i].cartIndex){
					
					itemFound = true;

					//Change in Quantity
					if(changed_cart_products[i].qty > original_cart_products[n].qty){ //qty increased
						showToast('Oops! There are unsaved changes and Bill can not be generated.', '#e74c3c');
						return '';
					}
					else if(changed_cart_products[i].qty < original_cart_products[n].qty){ //qty decreased
						showToast('Oops! There are unsaved changes and Bill can not be generated.', '#e74c3c');
						return '';
					}
					else{ //same qty
						
					}

					break;
					
				}

				//Last iteration to find the item
				if(i == changed_cart_products.length-1){
					if(!itemFound){ //Item Deleted
						showToast('Oops! There are unsaved changes and Bill can not be generated.', '#e74c3c');
						return '';
					}
				}
			} 

			n++;
		}


		//Search for new additions to the Cart
		var j = 0;
		while(changed_cart_products[j]){

			for(var m = 0; m < original_cart_products.length; m++){
				//check if item is found, not found implies New Item!
				if(changed_cart_products[j].cartIndex == original_cart_products[m].cartIndex){
					//Item Found
					break;
				}

				//Last iteration to find the item
				if(m == original_cart_products.length-1){ //New item
					showToast('Oops! There are unsaved changes and Bill can not be generated.', '#e74c3c');
					return '';
				}
			} 

			j++;
		}

	}
	else{

		return '';
	}

	generateBillFromKOT(kotID, optionalPageRef);
}




function checkForItemChanges(code, variant, quantity, cart_index){

/*
	Check if a particular item in accelerate_cart has any change w.r.t originalCart 
	(useful while editing an order)
*/

	var isCustom = true;
	if(!variant || variant == ''){
		isCustom = false;
	}

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		
		var changed_cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
		if(changed_cart_products.length == 0){
			return 'ERROR';
		}


		//Compare changes in the Cart
		var original_cart_products = originalData.cart;
		if(original_cart_products.length == 0){
			return 'ERROR';
		}


			//Search for the item in orignal Cart
			for(var m = 0; m < original_cart_products.length; m++){
				//check if item is found, not found implies New Item!
				if(!isCustom && (code == original_cart_products[m].code && cart_index == original_cart_products[m].cartIndex)){
					//Item Found
					if(quantity > original_cart_products[m].qty){ //qty increased
						return 'QUANTITY_INCREASE';
					}
					else if(quantity < original_cart_products[m].qty){ //qty decreased
						return 'QUANTITY_DECREASE';
					}
					
					break;
				}
				else if(isCustom && (code == original_cart_products[m].code && cart_index == original_cart_products[m].cartIndex) && (variant == original_cart_products[m].variant)){
					//Item Found
					if(quantity > original_cart_products[m].qty){ //qty increased
						return 'QUANTITY_INCREASE';
					}
					else if(quantity < original_cart_products[m].qty){ //qty decreased
						return 'QUANTITY_DECREASE';
					}
					break;
				}

				//Last iteration to find the item
				if(m == original_cart_products.length-1){ //New item
					return 'NEW_ITEM';
				}
			} 
	}
	else{
		return 'ERROR';
	}

	return 'NO_CHANGE';
}


function checkIfItemDeleted(){

/*
	Check if any item in accelerate_cart has been deleted w.r.t originalCart 
	(useful while editing an order)
*/

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){


		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

		var changed_cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
		if(changed_cart_products.length == 0){
			return 'DELETED_ALL';
		}


		//Compare changes in the Cart
		var original_cart_products = originalData.cart;
		if(original_cart_products.length == 0){
			return 'ERROR';
		}

		//Search for changes in the existing items
		var n = 0;
		while(original_cart_products[n]){
			
			//Find each item in original cart in the changed cart
			var itemFound = false;
			for(var i = 0; i < changed_cart_products.length; i++){
				//same item found, check for its quantity and report changes
				if((original_cart_products[n].cartIndex == changed_cart_products[i].cartIndex) && (original_cart_products[n].code == changed_cart_products[i].code)){
					itemFound = true;
					break;
				}

				//Last iteration to find the item
				if(i == changed_cart_products.length-1){
					if(!itemFound){ //Item Deleted
						return 'DELETED';
					}
				}
			} 

			n++;
		}

		return 'NONE';

	}
	else{
		return 'ERROR';
	}

}

/* Default Actions 

					'<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button  style="margin-bottom: 4px" class="btn btn-warning btn-block btn-flat" id="suspend">Hold</button>'+
                              '<button  class="btn btn-danger btn-block btn-flat" id="reset">Cancel</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-4" style="padding: 0 4px;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button  style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()">Print KOT</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<button  class="btn btn-success btn-block btn-flat" id="payment" style="height:71px;">Print Bill</button>'+
                        '</div>'+
                     '</div>';

*/


function clearCurrentOrder(){
	clearAllMetaData();
	renderCustomerInfo();
	renderTables();
}

function addHoldOrderToCurrent(encodedItem, id){

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		confirmHoldOverWritingModal(encodedItem, id);
		return '';
	}
	else if(window.localStorage.accelerate_cart && window.localStorage.accelerate_cart != ''){
		confirmHoldOverWritingModal(encodedItem, id);
		return '';
	}


    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_SAVED_ORDERS" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_ORDERS'){

				var holding_orders = data.docs[0].value;
				holding_orders.splice(id,1);

				showToast('Order loaded from the Saved Orders', '#27ae60');

				var order = JSON.parse(decodeURI(encodedItem));
				window.localStorage.customerData = JSON.stringify(order.customerDetails);
				window.localStorage.accelerate_cart = JSON.stringify(order.cartDetails);

				//Remove from Table mapping (if already added)
				if(order.customerDetails.modeType == 'DINE' && order.customerDetails.mappedAddress != ''){
					removeTableFromReserveList(order.customerDetails.mappedAddress)
				}


                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ACCELERATE_SAVED_ORDERS",
                      "value": holding_orders
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SAVED_ORDERS/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
						renderCustomerInfo();
						renderTables();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Saved Orders data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });     

          }
          else{
            showToast('Not Found Error: Saved Orders data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Orders data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Orders data. Please contact Accelerate Support.', '#e74c3c');
      }
    });
}

function confirmHoldOverWritingModal(encodedItem, id){
	document.getElementById("overWriteHoldOrderModal").style.display = 'block';
	document.getElementById("overWriteHoldOrderModalActions").innerHTML = '<button  class="btn btn-default" onclick="confirmHoldOverWritingModalHide()" style="float: left">Cancel</button>'+
                  						'<button  class="btn btn-danger" onclick="openHeldOrderConfirm(\''+encodedItem+'\', \''+id+'\')">Open Saved Order</button>';
}

function confirmHoldOverWritingModalHide(){
	document.getElementById("overWriteHoldOrderModal").style.display = 'none';
}


function openHeldOrderConfirm(encodedItem, id){

	window.localStorage.edit_KOT_originalCopy = '';
	window.localStorage.accelerate_cart = '';
	window.localStorage.customerData = '';

	addHoldOrderToCurrent(encodedItem, id);

	confirmHoldOverWritingModalHide();

}


function generateInvoice(){
	//generate Invoice for original_KOT
}

function clearCurrentEditingOrder(){

	clearAllMetaData();

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		window.localStorage.edit_KOT_originalCopy = '';
	}

	renderCustomerInfo();	
}

/*Hold KOT*/
function addToHoldKOT(){
	//ensure its a NEW ORDER
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		showToast('Oops! The Order has already been printed.', '#e67e22');
		return '';
	}
	else{

		var time = getCurrentTime('TIME');

	    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_SAVED_ORDERS" } }

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
	      data: JSON.stringify(requestData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {

	        if(data.docs.length > 0){
	          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_ORDERS'){

					var holding_orders = data.docs[0].value;
					console.log('Current:', holding_orders)

					var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData): [];
					var product_cart = window.localStorage.accelerate_cart ? JSON.parse(window.localStorage.accelerate_cart): [];

					if(customerInfo.length == 0){
						showToast('Oops! The Customer Details missing.', '#e67e22');
						return '';
					}
					else if(product_cart.length == 0){
						showToast('Oops! The Order Cart is empty!', '#e67e22');
						return '';
					}

					var new_holding_order = {};
					new_holding_order.customerDetails = customerInfo;
					new_holding_order.cartDetails = product_cart;
					new_holding_order.timestamp = time;

						holding_orders.push(new_holding_order);

						console.log('Updated:', holding_orders)

	                    //Update
	                    var updateData = {
	                      "_rev": data.docs[0]._rev,
	                      "identifierTag": "ACCELERATE_SAVED_ORDERS",
	                      "value": holding_orders
	                    }

	                    $.ajax({
	                      type: 'PUT',
	                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SAVED_ORDERS/',
	                      data: JSON.stringify(updateData),
	                      contentType: "application/json",
	                      dataType: 'json',
	                      timeout: 10000,
	                      success: function(data) {
							clearAllMetaData();
							renderCustomerInfo();
	                      },
	                      error: function(data) {
	                        showToast('System Error: Unable to update Saved Orders data. Please contact Accelerate Support.', '#e74c3c');
	                      }
	                    });     


					//Mark the table as 'Reserved' if added to hold list
					if(customerInfo.modeType == 'DINE' && customerInfo.mappedAddress != ''){
						addTableToReserveList(customerInfo.mappedAddress, 'Hold Order');
					}

					showToast('The Order has been moved to Saved List', '#27ae60');
	          }
	          else{
	            showToast('Not Found Error: Saved Orders data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Saved Orders data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Saved Orders data. Please contact Accelerate Support.', '#e74c3c');
	      }
	    });
	}	
}

function removeAllHoldOrders(){

    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_SAVED_ORDERS" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_ORDERS'){

					var holding_orders = []

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ACCELERATE_SAVED_ORDERS",
                      "value": holding_orders
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SAVED_ORDERS/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                      	renderCustomerInfo();
                      	clearSavedOrderMappingFromTables();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Saved Orders data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });     

          }
          else{
            showToast('Not Found Error: Saved Orders data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Orders data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Orders data. Please contact Accelerate Support.', '#e74c3c');
      }
    });
}



function clearSavedOrderMappingFromTables(){
	

	//removes all the "Saved Mapping" from Tables.

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbysavedorders',
      timeout: 10000,
      success: function(data) {

        if(data.rows.length > 0){

              var tableData = data.rows;

              var index = 0;
              processTable(0);

              function processTable(index){

                  if(index == tableData.length){ //last iteration
                    renderTables();
                    return "";
                  }

                  var remember_id = tableData[index].value._id;
                  var remember_rev = tableData[index].value._rev;

                  tableData[index].value.assigned = "";
                  tableData[index].value.remarks = "";
                  tableData[index].value.KOT = "";
                  tableData[index].value.status = 0;
                  tableData[index].value.lastUpdate = ""; 
                  tableData[index].value.guestName = ""; 
                  tableData[index].value.guestContact = ""; 
                  tableData[index].value.reservationMapping = "";   
                  tableData[index].value.guestCount = "";

                  //appendToLog(tableData[index].value.table+' : Clearing Saved Order');          


                    //Update
                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_tables/'+remember_id+'/',
                      data: JSON.stringify(tableData[index].value),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        processTable(index + 1);
                      },
                      error: function(data) {
                      	processTable(index + 1);
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });   

              }
        }
        else{
          showToast('Not Found Error: There are no Tables mapped to this Section. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

}


function addTableToReserveList(tableID, optionalComments){

	var comments = optionalComments;

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
      timeout: 10000,
      success: function(data) {
        if(data.rows.length == 1){

              var tableData = data.rows[0].value;

              var remember_id = null;
              var remember_rev = null;

              if(tableData.table == tableID){

                remember_id = tableData._id;
                remember_rev = tableData._rev;

                var timestamp = getCurrentTime('TIME');

                tableData.assigned = comments;
                tableData.remarks = "";
                tableData.KOT = "";
                tableData.status = 5;
                tableData.lastUpdate = timestamp;  
                tableData.guestName = ""; 
                tableData.guestContact = ""; 
                tableData.reservationMapping = "";   
                tableData.guestCount = "";         


                    //Update
                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_tables/'+remember_id+'/',
                      data: JSON.stringify(tableData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        renderTables();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });   

              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


function removeTableFromReserveList(tableID){

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
      timeout: 10000,
      success: function(data) {
        if(data.rows.length == 1){

              var tableData = data.rows[0].value;

              var remember_id = null;
              var remember_rev = null;

              if(tableData.table == tableID){

                remember_id = tableData._id;
                remember_rev = tableData._rev;

                tableData.assigned = "";
                tableData.remarks = "";
                tableData.KOT = "";
                tableData.status = 0;
                tableData.lastUpdate = "";   
                tableData.guestName = ""; 
                tableData.guestContact = ""; 
                tableData.reservationMapping = "";
                tableData.guestCount = "";

                //appendToLog(tableID + ' : Removing Table from Reserve List');           


                    //Update
                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_tables/'+remember_id+'/',
                      data: JSON.stringify(tableData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        renderTables();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });   


              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}




/*Clear cart*/
function clearCart(){

		//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
		if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
			var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

			if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

			}
			else{
				if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
					showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
					return '';
				}
			}

			
		}

		window.localStorage.accelerate_cart = "";
		renderCart();
		hideClearCartModal();
}

function clearCartConsent(){

		//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
		if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
			var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
			
			if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

			}
			else{
				if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
					showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
					return '';
				}
			}			

		}

		document.getElementById("clearCartConsentModal").style.display = "block";
}

function hideClearCartModal(){
	document.getElementById("clearCartConsentModal").style.display = "none";
}


function openBillingModeSelector(content){

	var billingModes = JSON.parse(decodeURI(content));
	document.getElementById("billingModesModalHome").style.display = "block";

	var renderContent = '';
	var n = 0;
	while(billingModes[n]){
		renderContent += '<button class="billModeListedButton easySelectTool_chooseBillingMode" onclick="changeCustomerInfo(\'mode\', \''+billingModes[n].name+'\')">'+billingModes[n].name+'<span class="modeSelectionBrief">'+billingModes[n].type+'</span><tag class="modeSelectionIcon"><i class="fa fa-check"></i></tag></button>';
		n++;
	}

	document.getElementById("billingModesModalHomeContent").innerHTML = '<div id="billingModesModalList">'+renderContent+'</div>';

          /*
            EasySelect Tool (LISTS)
          */

          var li = $('#billingModesModalList .easySelectTool_chooseBillingMode');
          var liSelected = li.eq(0).addClass('selectedMode');

          var easySelectTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#billingModesModalList').is(':visible')) {

                 switch(e.which){
                  case 38:{ //  ^ Up Arrow 

					if(liSelected){
					    liSelected.removeClass('selectedMode');
					   	next = liSelected.prev();
						if(next.length > 0){
							liSelected = next.addClass('selectedMode');
						}else{
							liSelected = li.last().addClass('selectedMode');
						}
					}else{
						liSelected = li.last().addClass('selectedMode');
					}                      

                    break;
                  }
                  case 40:{ // Down Arrow \/ 

					if(liSelected){
						liSelected.removeClass('selectedMode');
						next = liSelected.next();
						if(next.length > 0){
							liSelected = next.addClass('selectedMode');
						}else{
							liSelected = li.eq(0).addClass('selectedMode');
						}
					}else{
						liSelected = li.eq(0).addClass('selectedMode');
					}

                    break;
                  }
                  case 27:{ // Escape (Close)
                    document.getElementById("billingModesModalHome").style.display ='none';
                    easySelectTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)

                    $("#billingModesModalList .easySelectTool_chooseBillingMode").each(function(){
                      if($(this).hasClass("selectedMode")){
                        $(this).click();
                        e.preventDefault(); 
                        easySelectTool.unbind();   
                      }
                    });    

                    break;
                  }
                 }
            }
          });

}

function hideBillingModeSelector(){
	document.getElementById("billingModesModalHome").style.display = "none";
}




/*customer info*/
function renderCustomerInfo(optionalSource){

    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_SAVED_ORDERS" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_ORDERS'){

				var holding_orders = data.docs[0].value;
				renderCustomerInfoBeforeProcess(holding_orders, optionalSource);  
          }
          else{
            renderCustomerInfoBeforeProcess([], optionalSource);  
          }
        }
        else{
        	renderCustomerInfoBeforeProcess([], optionalSource);    
        }
      },
      error: function(data) {
      	renderCustomerInfoBeforeProcess([], optionalSource);  
      }
    });
}

function renderCustomerInfoBeforeProcess(holding_orders, optionalSource){

	var addressOptionsAvailable = false;
	var addressObj; 
	var userInfoAutoFound;

	if(!window.localStorage.userAutoFound || window.localStorage.userAutoFound == ''){
		addressOptionsAvailable = false;
	}
	else{
		userInfoAutoFound = window.localStorage.userDetailsAutoFound ? JSON.parse(window.localStorage.userDetailsAutoFound) : {};
		if(!jQuery.isEmptyObject(userInfoAutoFound)){
			addressObj = userInfoAutoFound.savedAddresses;
			if(addressObj && addressObj.length > 0){
				addressOptionsAvailable = true;
			}
		}
	}
	

	//Check if New Order / Editing KOT
	var isEditingKOT = false;

	//Check if Special Requests added
	var isSpecialRequests = false;
	if((window.localStorage.allergicIngredientsData && window.localStorage.allergicIngredientsData != '[]' && window.localStorage.allergicIngredientsData != '') || (window.localStorage.specialRequests_comments && window.localStorage.specialRequests_comments != '')){
		isSpecialRequests = true;
	}

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		isEditingKOT = true;
		var kotCopy = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : {};
		
		document.getElementById("ongoingOrderTitle").innerHTML = '<tag class="cartCustomerLabel blink_me" style="display: block; color: #FFF; font-weight: bold !important; position: fixed; margin-top: -8px;">Running Order</tag><tag>#'+kotCopy.KOTNumber+'<tag id="triggerClick_SpecialRequestsButton" onclick="openSpecialRequestModal()" class="specialRequestsHolder"><tag class="'+(isSpecialRequests ? 'specialRequestsButtonActive' : 'specialRequestsButton')+'"><i class="fa fa-bell-o swing"></i></tag></tag></tag>'+( kotCopy.orderDetails.modeType == 'DINE'? '<tag style="float: right; font-weight: 300;"><tag style="text-transform: none; font-size: 80%">Table</tag> <b class="blink_me">'+kotCopy.table+'</b></tag>' : '');
	}
	else{



		//Check if any order in Hold List
		if(holding_orders.length > 0){
			
			var n = 0;
			var holdListRender = '';
			while(holding_orders[n]){

				var itemList = '';
				for(var i = 0; i <  holding_orders[n].cartDetails.length; i++){
					if(i == 0)
						itemList = holding_orders[n].cartDetails[i].name;
					else
						itemList = itemList+', '+holding_orders[n].cartDetails[i].name;
				}

				var displayAddress = '';
				
					if(holding_orders[n].customerDetails.modeType =='DINE'){
						if(holding_orders[n].customerDetails.mappedAddress == ''){
							displayAddress = '<tag style="font-weight: 400">'+holding_orders[n].customerDetails.mode+'</tag>';
						}
						else{
							
							displayAddress = holding_orders[n].customerDetails.mappedAddress;

						}
					}
					else if(holding_orders[n].customerDetails.modeType =='PARCEL' || holding_orders[n].customerDetails.modeType =='DELIVERY'){
						if(holding_orders[n].customerDetails.mappedAddress == ''){
							displayAddress = '<tag style="font-weight: 400">'+holding_orders[n].customerDetails.mode+'</tag>';
						}
						else{
							var address = JSON.parse(holding_orders[n].customerDetails.mappedAddress);
							displayAddress = address.name+', '+address.flatNo+', '+address.flatName+', '+address.landmark+', '+address.area;
						}
					}
				
				holdListRender += '<a href="#" onclick="addHoldOrderToCurrent(\''+encodeURI(JSON.stringify(holding_orders[n]))+'\', '+n+')"><p class="holdTableName">'+(holding_orders[n].customerDetails.modeType == 'DINE' ? 'Table '+(holding_orders[n].customerDetails.mappedAddress ? '#'+holding_orders[n].customerDetails.mappedAddress : 'Unknown') : holding_orders[n].customerDetails.modeType+(holding_orders[n].customerDetails.name != '' ? ' <tag style="font-weight: 300; font-size: 90%">('+holding_orders[n].customerDetails.name+')</tag>' : '')  )+
									'<tag class="holdTimeAgo">'+getFormattedTime(holding_orders[n].timestamp)+' ago</tag></p>'+
									'<p class="holdItemsBrief">'+itemList+'</p>'+
								  '</a>';
				n++;
			}

			if(holding_orders.length != 0){
				document.getElementById("ongoingOrderTitle").innerHTML = 'New Order<tag id="triggerClick_SpecialRequestsButton" onclick="openSpecialRequestModal()" class="specialRequestsHolder"><tag class="'+(isSpecialRequests ? 'specialRequestsButtonActive' : 'specialRequestsButton')+'"><i class="fa fa-bell-o swing"></i></tag></tag>'+
													        '<div id="triggerClick_SavedOrdersButton" class="holddropdown">'+
											                 	'<div class="holddropbtn"><tag class="fa fa-cloud-download" style="color: #d2d6de; padding-right: 5px"></tag><b>'+n+'</b> '+(n == 1? 'Saved Order': 'Saved Orders')+'</div>'+
											                 	'<div class="holddropdown-content"><div class="holdContentArea">'+holdListRender+'</div>'+
											                 	'<div class="holdCancelButton" onclick="removeAllHoldOrders()">Remove All</div>'+
											                 	'</div>'+
											               	'</div>';
			}
			else{
				document.getElementById("ongoingOrderTitle").innerHTML = 'New Order<tag id="triggerClick_SpecialRequestsButton" onclick="openSpecialRequestModal()" class="specialRequestsHolder"><tag class="'+(isSpecialRequests ? 'specialRequestsButtonActive' : 'specialRequestsButton')+'"><i class="fa fa-bell-o swing"></i></tag></tag>'
			}
		}
		else{
			document.getElementById("ongoingOrderTitle").innerHTML = 'New Order<tag id="triggerClick_SpecialRequestsButton" onclick="openSpecialRequestModal()" class="specialRequestsHolder"><tag class="'+(isSpecialRequests ? 'specialRequestsButtonActive' : 'specialRequestsButton')+'"><i class="fa fa-bell-o swing"></i></tag></tag>'
		}
	}

	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	var billingModesInfo = [];


	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.count = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
		customerInfo.isOnline = false;
	}



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILLING_MODES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_MODES'){

	          	billingModesInfo = data.docs[0].value;
	          	billingModesInfo.sort(); //alphabetical sorting 

	          	window.localStorage.billingModesData = JSON.stringify(billingModesInfo); /*For cart rendering purpose*/
	          	
				/*Billing modes not set or not rendering*/
				if(jQuery.isEmptyObject(billingModesInfo)){
					document.getElementById("orderCustomerInfo").innerHTML = '<p style="text-align: left; margin: 10px 0; color: #dd4b39;">Billing Modes not set.<br><tag class="extrasSelButton" onclick="renderPage(\'bill-settings\', \'Bill Settings\'); openBillSettings(\'billingModes\')">Adding Billing Modes</tag> to continue</p>';
					showToast('Warning: Billing Modes are not set', '#e67e22');
					return '';
				}

				if(jQuery.isEmptyObject(customerInfo)){
					customerInfo.name = "";
					customerInfo.mobile = "";
					customerInfo.count = "";
					customerInfo.mode = "";
					customerInfo.modeType = "";
					customerInfo.mappedAddress = "";
					customerInfo.reference = "";
					customerInfo.isOnline = false;
				}
				else{

					var n = 0;
					var currentModeIndex = 0;
					while(billingModesInfo[n]){
						if(billingModesInfo[n].name == customerInfo.mode){
							currentModeIndex = n;
							break;
						}
						n++;
					}
					
					var billingModesList = 	'<tag selected-mode="\''+billingModesInfo[currentModeIndex].name+'\'" onclick="openBillingModeSelector(\''+(encodeURI(JSON.stringify(billingModesInfo)))+'\')" id="customer_form_data_mode" class="btn chosenModeButton" style="color: #FFF; width: 100%; text-overflow: ellipsis; overflow: hidden; text-align: left">'+billingModesInfo[currentModeIndex].name+'</tag>';
					

					var selectMappedAddressButton = '';
					var tempModeType = customerInfo.modeType;
					
					if(customerInfo.mode == ""){ //Mode not set
						tempModeType = billingModesInfo[0].type; //First value in modes list - temporarily by default
					}

					//Ask for MappedAddress value
					if(!isEditingKOT){
						if(tempModeType == 'DELIVERY'){ //ask for address

							if(addressOptionsAvailable){
									selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag id="parcelAddressButtonWrap"><tag id="triggerClick_TableAddressButton" class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag></tag>';
									
									if(customerInfo.mappedAddress && customerInfo.mappedAddress != ''){
										selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag id="parcelAddressButtonWrap"><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="chooseAddressFromSavedList()" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+getFormattedAddress(customerInfo.mappedAddress)+'</tag></tag>';
									}	
							}
							else{
									selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag id="parcelAddressButtonWrap"><tag id="triggerClick_TableAddressButton" class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag></tag>';
									
									if(customerInfo.mappedAddress && customerInfo.mappedAddress != ''){
										selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag id="parcelAddressButtonWrap"><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="pickAddressForNewOrder(\''+encodeURI(customerInfo.mappedAddress)+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+getFormattedAddress(customerInfo.mappedAddress)+'</tag></tag>';
									}								
							}
			 			}
						else if(tempModeType == 'DINE'){ //ask for table
							selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-danger" style="width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickTableForNewOrder()">Select Table</tag>';
							
							if(customerInfo.mappedAddress){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="pickTableForNewOrder(\''+customerInfo.mappedAddress+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}					
						else if(tempModeType == 'TOKEN' || tempModeType == 'PARCEL'){ //assign token
							
							var isTokenValid = true;
							var isTokenAutoChanged = false;

							if(window.localStorage.claimedTokenNumberTimestamp && window.localStorage.claimedTokenNumberTimestamp != ''){
								
								var currentTime = new Date();
								var recordedTime = new Date(window.localStorage.claimedTokenNumberTimestamp);

								if(currentTime - recordedTime > 300000){ //Old Token, reclaim for new Token
									isTokenValid = false;
									isTokenAutoChanged = true;
								}
								else{
									isTokenValid = true;
								}
							}
							else{
								isTokenValid = false;
							}

							if(isTokenValid && window.localStorage.claimedTokenNumber && window.localStorage.claimedTokenNumber != ''){
								customerInfo.mappedAddress = parseInt(window.localStorage.claimedTokenNumber);
								selectMappedAddressButton = '<label class="cartCustomerLabel">Token No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="setTokenManually()" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
								renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList, optionalSource);
							}
							else{ //Claim a Token from Server

							    var requestData = {
							      "selector"  :{ 
							                    "identifierTag": "ACCELERATE_TOKEN_INDEX" 
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
							          if(data.docs[0].identifierTag == 'ACCELERATE_TOKEN_INDEX'){

							            var tempToken = parseInt(data.docs[0].value);

										if(!tempToken || tempToken == ''){
											tempToken = 1;
										}


										if(!isTokenValid && isTokenAutoChanged){
											showToast('Warning: Token Number has been adjusted to the latest Count', '#e67e22');
										}

										//Save the Claimed Token locally
										window.localStorage.claimedTokenNumber = tempToken;
										window.localStorage.claimedTokenNumberTimestamp = new Date();

										//Update next token on Server
										updateTokenCountOnServer(tempToken+1, data.docs[0]._rev);

										customerInfo.mappedAddress = tempToken;
										selectMappedAddressButton = '<label class="cartCustomerLabel">Token No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="setTokenManually()" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';

										renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList, optionalSource);
							          }
							          else{
							            showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
							          }
							        }
							        else{
							          showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
							        }

							      },
							      error: function(data) {
							        showToast('System Error: Unable to read Token Index. Please contact Accelerate Support.', '#e74c3c');
							      }

							    });

							}

							
						}
					} //Not Editing
					else{ //Editing

						if(tempModeType == 'DELIVERY'){ //ask for address
							selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag id="parcelAddressButtonWrap"><tag class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag></tag>';
							
							if(customerInfo.mappedAddress && customerInfo.mappedAddress != ''){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag id="parcelAddressButtonWrap"><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="pickAddressForNewOrder(\''+encodeURI(customerInfo.mappedAddress)+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+getFormattedAddress(customerInfo.mappedAddress)+'</tag></tag>';
							}
						}
						else if(tempModeType == 'DINE'){ //ask for table
							selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-danger disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">Not Set</tag>';
							
							if(customerInfo.mappedAddress && customerInfo.mappedAddress != ''){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}					
						else if(tempModeType == 'TOKEN' || tempModeType == 'PARCEL'){ //assign token

							//customerInfo.mappedAddress = parseInt(window.localStorage.claimedTokenNumber);
							selectMappedAddressButton = '<label class="cartCustomerLabel">Token No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-default" style="width: 100%; text-overflow: ellipsis; overflow: hidden; cursor: not-allowed">'+customerInfo.mappedAddress+'</tag>';
							renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList, optionalSource);
							
						}						
					} //Editing	

					if(tempModeType != 'TOKEN' && tempModeType != 'PARCEL'){ /* TWEAK */
						renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList, optionalSource);
					}
					//Note: Because Token involves a network call delay.

				}
          }
          else{
            showToast('Not Found Error: Billing Modes data not found. Please contact Accelerate Support.', '#e74c3c');
          	renderCart();
          }
        }
        else{
          showToast('Not Found Error: Billing Modes data not found. Please contact Accelerate Support.', '#e74c3c');
          renderCart();
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
      	renderCart();
      }

    });

}



function renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList, optionalSource){


					var modalTemplate = ''+
					        '<div id="billingModesModalHome" class="modal billModalSelect">'+
					             '<div class="modal-dialog" style="width: 100%; margin: 0">'+
					                '<div class="modal-content" id="billingModesModalHomeContent">'+
					                '</div>'+
					             '</div>'+
					        '</div>';

					        

					if(isEditingKOT){ //Editing KOT
					
					document.getElementById("orderCustomerInfo").innerHTML = '<div class="row" style="padding: 0 15px; margin-bottom: 6px; position: relative"> '+
			                                 '<div class="col-xs-8" style="padding: 0; padding-right: 2px">'+
			                                    '<label class="cartCustomerLabel">Order Type<tag id="orderTypeDisplay" style="color: #40739e; font-size: 10px; font-weight: bold; padding-left: 3px;">'+customerInfo.modeType+'</tag></label>'+
			                                    '<input type="text" value="'+customerInfo.mode+'" selected-mode="'+customerInfo.mode+'" id="customer_form_data_mode" style="border-radius: 4px !important; height: 33px;" class="form-control kb-text" disabled/>'+
			                                ' </div>'+
			                                 '<div class="col-xs-4" style="padding: 0; padding-left: 2px">'+selectMappedAddressButton+'</div> '+                       
			                           '</div>'+
			                           '<div class="row" style="padding: 0 15px">'+
			                                 '<div class="col-xs-5" style="padding: 0; padding-right: 2px">'+
			                                   ' <div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="number" onchange="changeCustomerInfo(\'mobile\')" value="'+customerInfo.mobile+'" id="customer_form_data_mobile" onkeyup="suggestCustomerInfoFromMobile(\'GENERIC\', this)" class="form-control kb-text" placeholder="Guest Mobile" />'+
			                                    '</div>'+
			                                 '</div>   '+      			                           
			                                 '<div class="col-xs-5" style="padding: 0; padding-left: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="text" onchange="changeCustomerInfo(\'name\')" value="'+customerInfo.name+'" id="customer_form_data_name" class="form-control kb-text" placeholder="Guest Name" />'+
			                                    '</div>'+
			                                 '</div>'+ 
			                                 '<div class="col-xs-2" style="padding: 0; padding-left: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="number" onchange="changeCustomerInfo(\'count\')" value="'+customerInfo.count+'" id="customer_form_data_count" class="form-control kb-text" placeholder="Count" '+(tempModeType == 'DINE' ? '' : 'disabled')+'/>'+
			                                    '</div>'+
			                                 '</div>'+               
			                           '</div>';
					}
					else{ //New Order

					document.getElementById("orderCustomerInfo").innerHTML = '<div class="row" style="padding: 0 15px; margin-bottom: 6px; position: relative"> '+
			                                 '<div class="col-xs-8" style="padding: 0; padding-right: 2px">'+
			                                       '<label class="cartCustomerLabel">Order Type</label><tag id="orderTypeDisplay" style="color: #40739e; font-weight: bold; padding-left: 3px; font-size: 10px">'+customerInfo.modeType+'</tag>'+
			                                       billingModesList+
			                                 '</div>'+
			                                 '<div class="col-xs-4" style="padding: 0; padding-left: 2px">'+selectMappedAddressButton+'</div>'+  
			                                 '<div class="blue-box" style="width: 90%; position: absolute; top: 60px;">'+modalTemplate+'</div>'+                     
			                           '</div>'+
			                           '<div class="row" style="padding: 0 15px">'+
			                                 '<div class="col-xs-5" style="padding: 0; padding-right: 2px">'+
			                                   ' <div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="number" onchange="changeCustomerInfo(\'mobile\')" value="'+customerInfo.mobile+'" id="customer_form_data_mobile" onkeyup="suggestCustomerInfoFromMobile(\'GENERIC\', this)" class="form-control kb-text" placeholder="Guest Mobile" />'+
			                                    '</div>'+
			                                 '</div>   '+    			                           
			                                 '<div class="col-xs-5" style="padding: 0; padding-left: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="text" onchange="changeCustomerInfo(\'name\')" value="'+customerInfo.name+'" id="customer_form_data_name" class="form-control kb-text" placeholder="Guest Name" />'+
			                                    '</div>'+
			                                 '</div>'+ 
			                                 '<div class="col-xs-2" style="padding: 0; padding-left: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="number" onchange="changeCustomerInfo(\'count\')" value="'+customerInfo.count+'" id="customer_form_data_count" class="form-control kb-text" placeholder="Count" '+(tempModeType == 'DINE' ? '' : 'disabled')+'/>'+
			                                    '</div>'+
			                                 '</div>'+                 
			                           '</div>';
			        }	


			        $('#customer_form_data_mode').attr("selected-mode", customerInfo.mode);
		
			        /*First dropdown item as default*/ /*TWEAK*/
			        // if(customerInfo.mode == ""){
			        // 	$("#customer_form_data_mode").val($("#customer_form_data_mode option:first").val());
			        // 	customerInfo.modeType = billingModesInfo[0].type;
			        // 	customerInfo.mode = billingModesInfo[0].name;
			        // }

			        window.localStorage.customerData = JSON.stringify(customerInfo);

			        if(optionalSource == "FOCUS_GUEST_COUNT"){
			        	$("#customer_form_data_count").focus();
			        }

			        renderCart();



			        //UX Improvements
					var triggerCustomerChecker = $('#customer_form_data_mobile').keyup(function(e) {
							if (e.which === 13) {
						        suggestCustomerInfoFromMobile('GENERIC', '', 'FORCE_SEARCH');
						    }
					});

					var guestCountEnter = $('#customer_form_data_count').keyup(function(e) {
							if (e.which === 13) {
						        $('#add_item_by_search').focus();
						    }
					}); 

					


}


function getFormattedAddress(addressObject){
	var address = JSON.parse(addressObject);

	if(address){
		var addressString = (address.flatNo && address.flatNo != '' ? address.flatNo + ', ' : '')+(address.flatName && address.flatName != '' ? address.flatName + ', ' : '')+address.landmark+' '+address.area+' ';
		return addressString;
	}
	else{
		return '-';
	}
}

function updateTokenCountOnServer(nextToken, revID){


	console.log('Token Updated >> '+nextToken)


			                          //Update token number on server
			                          var updateData = {
			                            "_rev": revID,
			                            "identifierTag": "ACCELERATE_TOKEN_INDEX",
			                            "value": nextToken
			                          }

			                          $.ajax({
			                            type: 'PUT',
			                            url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_TOKEN_INDEX/',
			                            data: JSON.stringify(updateData),
			                            contentType: "application/json",
			                            dataType: 'json',
			                            timeout: 10000,
			                            success: function(data) {
			                              
			                            },
			                            error: function(data) {
			                              showToast('System Error: Unable to update Token Index. Next Token Number might be faulty. Please contact Accelerate Support.', '#e74c3c');
			                            }

			                          });  
}



/*
	CUSTOMER DETAILS MANAGEMENT
*/


function suggestCustomerInfoFromMobile(mode, inputElement, optionalRequest){

	var mobileNumber = '';

	if(mode == 'GENERIC'){
		mobileNumber = $('#customer_form_data_mobile').val();
	}
	else if(mode == 'DIRECT'){
		mobileNumber = inputElement;
	}

	//auto search if mobile length is 10, or if ENTER clicked..
	if(mobileNumber.length == 10 || optionalRequest == 'FORCE_SEARCH'){

	  $.ajax({
	    type: 'GET',
	    url: COMMON_LOCAL_SERVER_IP+'/accelerate_users/'+mobileNumber,
	    timeout: 10000,
	    success: function(data) {
	      if(data._id != ""){ //USER FOUND!!!

	      	window.localStorage.userAutoFound = 1;
	      	window.localStorage.userDetailsAutoFound = JSON.stringify(data);

	      	var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData) : {};
	      	
	      	if(data.name != ''){
	      		document.getElementById("customer_form_data_name").value = data.name;
	      		customerInfo.name = data.name;
	      	}

	      	//Set Address if any saved address found and the mode == 'PARCEL'
	      	var savedAddressesEncoded = '';
	      	if(data.savedAddresses){

	      		savedAddressesEncoded = encodeURI(JSON.stringify(data.savedAddresses));
	      	
	      		//set default address to 1st saved address
		      	if(customerInfo.modeType == 'DELIVERY' && data.savedAddresses.length > 0){
		      		customerInfo.mappedAddress = JSON.stringify(data.savedAddresses[0]);   			
	      		}
	      	}
	      	else{
	      		if(customerInfo.modeType == 'DELIVERY'){
		      		//set default address to null
		      		customerInfo.mappedAddress = "";  			
	      		}
	      	}

	      	//save changes
	      	customerInfo.mobile = mobileNumber;
	      	window.localStorage.customerData = JSON.stringify(customerInfo);
	      	$("#add_item_by_search").focus();
			renderCustomerInfo();

	      }
	      else{ //USER NOT FOUND

	      	if(window.localStorage.userAutoFound && window.localStorage.userAutoFound == 1){
	      		//The previous search had found user and set address, name accordingly.
	      		//So, reset those on this iteration
	      		window.localStorage.userAutoFound = 0;
	      		window.localStorage.userDetailsAutoFound = '';
	      		
	      		var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData) : {};
	      		
	      		customerInfo.name = '';
	      		document.getElementById("customer_form_data_name").value = ''; /*TWEAK*/
	      		
	      		customerInfo.mobile = mobileNumber;
	      		
	      		if(customerInfo.modeType == 'DELIVERY'){
	      			customerInfo.mappedAddress = '';
	      			document.getElementById("parcelAddressButtonWrap").innerHTML = '<tag class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag>';
	      		}
	      		
	      		window.localStorage.customerData = JSON.stringify(customerInfo);
	      		//renderCustomerInfo(); // WHY? --> reloading causes focusing out input fields
	      	}

	      }
	    }
	  });  
	}
	else{

		if(window.localStorage.userAutoFound && window.localStorage.userAutoFound == 1){
	      		//The previous search had found user and set address, name accordingly.
	      		//So, reset those on this iteration
	      		window.localStorage.userAutoFound = 0;
	      		window.localStorage.userDetailsAutoFound = '';
	      		
	      		var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData) : {};
	      		
	      		customerInfo.name = '';
	      		document.getElementById("customer_form_data_name").value = ''; /*TWEAK*/
	      		
	      		customerInfo.mobile = mobileNumber;
	      		
	      		if(customerInfo.modeType == 'DELIVERY'){
	      			customerInfo.mappedAddress = '';
	      			document.getElementById("parcelAddressButtonWrap").innerHTML = '<tag class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag>';
	      		}
	      		
	      		window.localStorage.customerData = JSON.stringify(customerInfo);
	      		//renderCustomerInfo(); // WHY? --> reloading causes focusing out input fields
	    }
	}
}


function changeCustomerInfo(type, optionalValue){

	var value = '';

	if(type == 'mode'){
		value = optionalValue;
	}
	else{
		value = document.getElementById("customer_form_data_"+type).value;
	}

	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];


	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.count = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
		customerInfo.isOnline = false;
	}

		switch(type){
			case "name":{
				customerInfo.name = value;
				break;
			}
			case "mobile":{
				customerInfo.mobile = value;
				break;
			}	
			case "count":{
				customerInfo.count = value;
				break;
			}	
			case "mode":{
				customerInfo.mode = value;

				//Set mode type
				var n = 0;
				while(billing_modes[n]){
					if(billing_modes[n].name == value){

						//reset address if type changed
						if(customerInfo.modeType != billing_modes[n].type){
							customerInfo.mappedAddress = "";

							var tempNumber = document.getElementById("customer_form_data_mobile").value;
							if(tempNumber != '')
								suggestCustomerInfoFromMobile('DIRECT', tempNumber)
						}

						customerInfo.modeType = billing_modes[n].type;
						break;
					}
					n++;
				}

				hideBillingModeSelector();

				window.localStorage.customerData = JSON.stringify(customerInfo);
				renderCart();
				renderCustomerInfo();
				renderTables();

				$("#add_item_by_search").focus();

				return '';
			}
			case "reference":{
				customerInfo.reference = value;
				break;
			}										
		}

		window.localStorage.customerData = JSON.stringify(customerInfo);
}

function setCustomerInfoTable(tableID){
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.mode = "";
		customerInfo.count = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
		customerInfo.isOnline = false
	}

	customerInfo.mappedAddress = tableID;

	window.localStorage.customerData = JSON.stringify(customerInfo);

	pickTableForNewOrderHide();
	renderCustomerInfo('FOCUS_GUEST_COUNT');

	//re-render right panel
	if(window.localStorage.appCustomSettings_OrderPageRightPanelDisplay && window.localStorage.appCustomSettings_OrderPageRightPanelDisplay == 'TABLE'){
		renderTables();
	}

}



function renderTables(){

	//re-render right panel
	if(window.localStorage.appCustomSettings_OrderPageRightPanelDisplay && window.localStorage.appCustomSettings_OrderPageRightPanelDisplay == 'TABLE'){
		//Proceed
	}
	else{
		return '';
	}


	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	if(customerInfo.modeType == 'DINE'){
		currentTableID = customerInfo.mappedAddress;
	}
	else{
		currentTableID = '';
	}


	//To display Large (default) or Small Tables
	var smallTableFlag = '';

 
	//PRELOAD TABLE MAPPING
    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/all/',
      timeout: 10000,
      success: function(data) {
        if(data.total_rows > 0){

              var tableData = data.rows;
              tableData.sort(function(obj1, obj2) {
                return obj1.key - obj2.key; //Key is equivalent to sortIndex
              });

              if(tableData.length < 50 && tableData.length > 30){ //As per UI, it can include 30 large tables 
              	smallTableFlag = ' mediumTile';
              }
              else if(tableData.length > 50){
              	smallTableFlag = ' smallTile';
              }
 

				    var requestData = {
				      "selector"  :{ 
				                    "identifierTag": "ACCELERATE_TABLE_SECTIONS" 
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
				          if(data.docs[0].identifierTag == 'ACCELERATE_TABLE_SECTIONS'){

				              var tableSections = data.docs[0].value;
				              tableSections.sort(); //alphabetical sorting 


							              var renderSectionArea = '';

							              var n = 0;
							              while(tableSections[n]){
							        
							              	var renderTableArea = ''
							              	for(var i = 0; i<tableData.length; i++){
							              		if(tableData[i].value.type == tableSections[n]){

							              			if(tableData[i].value.status != 0){ /*Occuppied*/
														if(tableData[i].value.status == 1){
								              				renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" style="cursor: pointer" onclick="retrieveTableInfo(\''+tableData[i].value.table+'\', \'MAPPED\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(tableData[i].value.assigned && tableData[i].value.assigned != '' ? tableData[i].value.assigned : tableData[i].value.capacity+' Seater' )+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">'+(currentTableID != '' && currentTableID == tableData[i].value.table ? '<i class="fa fa-check" style="color: #FFF"></i>' : 'Running')+'</tag>'+
																					        	'</tag>';	
														}
														else if(tableData[i].value.status == 2){
															renderTableArea = renderTableArea + '<tag class="tableTileYellow'+smallTableFlag+'" style="cursor: pointer" onclick="pickTableForNewOrderHide(); preSettleBill(\''+tableData[i].value.KOT+'\', \'ORDER_PUNCHING\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(tableData[i].value.assigned && tableData[i].value.assigned != '' ? tableData[i].value.assigned : tableData[i].value.capacity+' Seater' )+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">'+(currentTableID != '' && currentTableID == tableData[i].value.table ? '<i class="fa fa-check" style="color: #FFF"></i>' : 'Bill' +(tableData[i].value.remarks && tableData[i].value.remarks != '' ? ' <b><i class="fa fa-inr"></i>'+tableData[i].value.remarks+'</b>' : '') )+'</tag>'+
																					        	'</tag>';	
														}									
														else if(tableData[i].value.status == 5){
															if(currentTableID != '' && currentTableID == tableData[i].value.table){
								              				renderTableArea = renderTableArea + '<tag class="tableTileBlue'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tableData[i].value.table+'\', \'FREE\', \''+(tableData[i].value.assigned != "" && tableData[i].value.assigned != "Hold Order" ? tableData[i].value.assigned : '')+'\', '+(tableData[i].value.assigned != "" && tableData[i].value.assigned == "Hold Order" ? 1 : 0)+')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+ (tableData[i].value.assigned == 'Hold Order' ? '<i class="fa fa-cloud-download"></i>' : (tableData[i].value.guestName && tableData[i].value.guestName != "" ? 'For '+tableData[i].value.guestName : 'For Guest')) + '</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';	
															}	
															else{
								              				renderTableArea = renderTableArea + '<tag class="tableReserved'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tableData[i].value.table+'\', \'FREE\', \''+(tableData[i].value.assigned != "" && tableData[i].value.assigned != "Hold Order" ? tableData[i].value.assigned : '')+'\', '+(tableData[i].value.assigned != "" && tableData[i].value.assigned == "Hold Order" ? 1 : 0)+')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+ (tableData[i].value.assigned == 'Hold Order' ? '<i class="fa fa-cloud-download"></i>' : (tableData[i].value.guestName && tableData[i].value.guestName != "" ? 'For '+tableData[i].value.guestName : 'For Guest')) + '</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">'+(tableData[i].value.assigned == 'Hold Order' ? 'Saved Order' : 'Reserved')+'</tag>'+
																					        	'</tag>';	
															}

														}									
														else{
							              				renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" style="cursor: pointer" onclick="retrieveTableInfo(\''+tableData[i].value.table+'\', \'MAPPED\')">'+
																				            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																				            '<tag class="tableCapacity'+smallTableFlag+'">'+tableData[i].value.capacity+' Seater</tag>'+
																				            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																				        	'</tag>';											
														}


							              			}
							              			else{

							              				if(currentTableID != '' && currentTableID == tableData[i].value.table){
							              					renderTableArea = renderTableArea + '<tag class="tableTileBlue'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tableData[i].value.table+'\', \'FREE\')">'+
																				            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																				            '<tag class="tableCapacity'+smallTableFlag+'">'+tableData[i].value.capacity+' Seater</tag>'+
																				            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																				        	'</tag>';
														}	
														else{
															renderTableArea = renderTableArea + '<tag class="tableTileGreen'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tableData[i].value.table+'\', \'FREE\')">'+
																				            '<tag class="tableTitle'+smallTableFlag+'">'+tableData[i].value.table+'</tag>'+
																				            '<tag class="tableCapacity'+smallTableFlag+'">'+tableData[i].value.capacity+' Seater</tag>'+
																				            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																				        	'</tag>';
														}							        	              				
							              			}

							              		}
							              	}

							              	if(renderTableArea != ''){
							              	renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																					   '<h1 class="seatingPlanHead'+smallTableFlag+'" style="font-weight: 400; font-size: 18px; background: #f6f6f6; margin: 5px 5px; padding: 10px;">'+tableSections[n]+'</h1>'+
																					   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+'</div>'+
																					'</div>';
											}

							              	n++;
							              }
							              
							              document.getElementById("tableRenderPlane").innerHTML = renderSectionArea;
   
				          }
				          else{
				            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
				          }
				        }
				        else{
				          showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
				        }

				      },
				      error: function(data) {
				        showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
				      }

				    });

        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


/* AUTO REFRESH TABLES STATUS */

/*Track Inactivity*/
var TABLE_RENDER_IDLE = 15; //default time delay = 20 secs
var idleTableSecondsCounter = 0;
var refreshTableInterval;

function AutoRenderTable(){

  idleTableSecondsCounter = 0;
  clearInterval(refreshTableInterval);

  refreshTableInterval = window.setInterval(function() { CheckTablesIdleTime(); }, 1000);  

  //Start Tracking Events
  document.onclick = function() {
   	idleTableSecondsCounter = 0;
  };

  document.onmousemove = function() {
    idleTableSecondsCounter = 0;
  };

  document.onkeypress = function() {
    idleTableSecondsCounter = 0;
  };
}

AutoRenderTable();


function CheckTablesIdleTime() {
      
    idleTableSecondsCounter++;

    if(idleTableSecondsCounter >= TABLE_RENDER_IDLE){
    	//re-render tables
    	idleTableSecondsCounter = 0;
    	renderTables();
    }
}





function retrieveTableInfo(tableID, statusCode, optionalCustomerName, optionalSaveFlag){

	/* warn if unsaved order (Not editing case) */
	if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){
	    if(window.localStorage.accelerate_cart && window.localStorage.accelerate_cart != ''){
	        showToast('Warning! There is an unsaved order being punched. Please complete it to continue.', '#e67e22');
	        
	       // document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
	        //document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button  class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
	          //                                      '<button  class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
	    	return '';
	    }    
	}
	

	if(statusCode == 'MAPPED'){

	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
	      timeout: 10000,
	      success: function(data) {
	        if(data.rows.length == 1){

	              var tableData = data.rows[0].value;

	              if(tableData.table == tableID){
	              	moveToEditKOT(tableData.KOT);
	              }
	              else{
	                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
	              }
	        }
	        else{
	          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
	        }

	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });

	}
	else if(statusCode == 'FREE'){

	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
	      timeout: 10000,
	      success: function(data) {
	        if(data.rows.length == 1){

	              var tableData = data.rows[0].value;

	              if(tableData.table == tableID){
	              	freshOrderOnTable(tableID, tableData, optionalSaveFlag);
	              }
	              else{
	                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
	              }
	        }
	        else{
	          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
	        }

	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });	
	}
}



function retrieveTableInfoForNewOrder(tableID){

	/* warn if unsaved order (Not editing case) */
	if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){
	    if(window.localStorage.accelerate_cart && window.localStorage.accelerate_cart != ''){
	        showToast('Warning! There is an unsaved order being punched. Please complete it to continue.', '#e67e22');
	        
	       // document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
	        //document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button  class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
	          //                                      '<button  class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
	    	return '';
	    }    
	}


	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
	      timeout: 10000,
	      success: function(data) {
	        if(data.rows.length == 1){

	              var tableData = data.rows[0].value;

	              if(tableData.table == tableID){
	              	moveToEditKOT(tableData.KOT);
	              }
	              else{
	                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
	              }

	              pickTableForNewOrderHide();
	        }
	        else{
	          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
	        }

	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
}



/*Add to edit KOT*/
function moveToEditKOT(kotID){

    //Set _id from Branch mentioned in Licence
    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
      showToast('Invalid Licence Error: KOT can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
      return '';
    }

    var kot_request_data = accelerate_licencee_branch +"_KOT_"+ kotID;

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+kot_request_data,
      timeout: 10000,
      success: function(data) {
        if(data._id != ""){

          	var kot = data;

		    if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

		        var alreadyEditingKOT = JSON.parse(window.localStorage.edit_KOT_originalCopy);
		        if(alreadyEditingKOT.KOTNumber == kot.KOTNumber)//if thats the same order, neglect.
		        {
		            //renderPage('new-order', 'Editing Order');
		            renderCustomerInfo();
					initOrderPunch();
					renderTables();
		            return '';
		        }
		        else{

			    	//Editing order has unsaved changes
			    	if(window.localStorage.hasUnsavedChangesFlag && window.localStorage.hasUnsavedChangesFlag == 1){
				        showToast('Warning! There is already an active order being modified. Please complete it to continue.', '#e67e22');
			    		return '';
			    	}
		        }
		    }

		    /*
		    if(window.localStorage.accelerate_cart && window.localStorage.accelerate_cart != ''){

		    	showToast('Warning! There is a new order being punched. Please complete it to continue.', '#e67e22');
			        
			    document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
			    document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button  class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
			                                                '<button  class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
		    	return '';
		    }    
		    */

		    overWriteCurrentRunningOrder(kot);

        }
        else{
          showToast('Not Found Error: KOT #'+kotID+' not found on the Server, might have billed already.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('Not Found Error: KOT #'+kotID+' not found on the Server, might have billed already.', '#e74c3c');
      }

    });   
}

function overWriteCurrentRunningOrder(kot){

    //var kot = JSON.parse(decodeURI(encodedKOT));

    console.log('editing ...')


    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.count = parseInt(kot.guestCount);
    customerInfo.mappedAddress = kot.table;
    customerInfo.mode = kot.orderDetails.mode;
    customerInfo.modeType = kot.orderDetails.modeType;
    customerInfo.reference = kot.orderDetails.reference;
    customerInfo.isOnline = kot.orderDetails.isOnline;


    if(kot.specialRemarks && kot.specialRemarks != ''){
    	window.localStorage.specialRequests_comments = kot.specialRemarks;
    }
    else{
    	window.localStorage.specialRequests_comments = '';
    }

    if(kot.allergyInfo && kot.allergyInfo != []){
    	window.localStorage.allergicIngredientsData = JSON.stringify(kot.allergyInfo);
    }
    else{
    	window.localStorage.allergicIngredientsData = '';
    }


    //Pending new order will be removed off the cart.
    window.localStorage.accelerate_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);

    //window.localStorage.edit_KOT_originalCopy = decodeURI(encodedKOT);
    window.localStorage.edit_KOT_originalCopy = JSON.stringify(kot);


    //record max cart index
		var i = 0;
		var maxCartIndex = 0;

		while(i < kot.cart.length){
          if(maxCartIndex <= kot.cart[i].cartIndex){
			    maxCartIndex = kot.cart[i].cartIndex;
          }

          i++;
        }

    window.localStorage.maxCartIndex = maxCartIndex;


    //renderPage('new-order', 'Running Order');
    renderCustomerInfo();
	initOrderPunch();
	renderTables();
}






function renderCategoryTab(defaultTab){


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
					if(categories[i] == defaultTab)
					{
						categoryTag = categoryTag + '<button  class="btn btn-outline-sub activeCatTab" onclick="renderMenu(\''+categories[i]+'\')">'+categories[i]+'</button>'
					}	
					else{
						categoryTag = categoryTag + '<button  class="btn btn-outline-sub" onclick="renderMenu(\''+categories[i]+'\')">'+categories[i]+'</button>'
					}
				}

				if(!categoryTag)
					categoryTag = '<p style="color: #dd4b39; padding: 20px; text-align: center; font-size: 14px; margin-bottom: 0px;">Menu is not added yet.</p>';


				document.getElementById("subMenuSelectionArea").innerHTML = categoryTag;
	        

	        	var dropTag = '';
				for (var i=0; i<categories.length; i++){
					if(categories[i] == defaultTab)
					{
						dropTag = dropTag + '<a href="#" onclick="renderMenu(\''+categories[i]+'\')">'+categories[i]+'</a>';
					}	
					else{
						dropTag = dropTag + '<a href="#" onclick="renderMenu(\''+categories[i]+'\')">'+categories[i]+'</a>';
					}
				}

				if(!dropTag)
					dropTag = '<p style="color: #dd4b39; padding: 20px; text-align: center; font-size: 14px; margin-bottom: 0px;">Menu is not added yet.</p>';

				document.getElementById("posSubMenuDropdown").innerHTML = dropTag;


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



function renderMenu(subtype){

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

				/* PERSONALISATIONS */
				var showPhotosFlag = window.localStorage.appCustomSettings_ImageDisplay == 'true' ? true: false;

	          	var itemsInSubMenu = "";

				if(!subtype){
					subtype = mastermenu[0].category;
				}

				renderCategoryTab(subtype);
	         
				for (var i=0; i<mastermenu.length; i++){

					if(mastermenu[i].category == subtype){
						itemsInSubMenu = '';
						for(var j=0; j<mastermenu[i].items.length; j++){
							var temp = encodeURI(JSON.stringify(mastermenu[i].items[j]));
							if(mastermenu[i].items[j].isPhoto && showPhotosFlag){
								itemsInSubMenu = itemsInSubMenu + '<button onclick="additemtocart(\''+temp+'\', \''+subtype+'\')" type="button" type="button" class="btn btn-both btn-flat product"><tag id="menu_image_holder_'+mastermenu[i].items[j].code+'"><div id="itemImage" style="position: relative">'+(mastermenu[i].items[j].vegFlag == 2 ? '<img src="images/common/food_nonveg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+(mastermenu[i].items[j].vegFlag == 1 ? '<img src="images/common/food_veg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+getImageCode(mastermenu[i].items[j].name)+'</div></tag><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
								fetchImageFromServer(mastermenu[i].items[j].code, mastermenu[i].items[j].vegFlag);
							}
							else{
								itemsInSubMenu = itemsInSubMenu + '<button onclick="additemtocart(\''+temp+'\', \''+subtype+'\')" type="button" type="button" class="btn btn-both btn-flat product"><span class="bg-img"><div id="itemImage" style="position: relative">'+(mastermenu[i].items[j].vegFlag == 2 ? '<img src="images/common/food_nonveg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+(mastermenu[i].items[j].vegFlag == 1 ? '<img src="images/common/food_veg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+getImageCode(mastermenu[i].items[j].name)+'</div></span><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
							}
						}
						break;
					}
				}
				
				document.getElementById("item-list").innerHTML = itemsInSubMenu;
				document.getElementById("posSubMenuTitle").innerHTML = subtype;

				if(!itemsInSubMenu){
					document.getElementById("item-list").innerHTML = '<p style="font-size: 18px; color: #bfbfbf; padding: 20px;">No available items in '+subtype+'</p>';
				}

				/*Adjust height*/ /*TWEAK*/
				var measures = {};
				measures.fullHeight = document.getElementById("fullRightPanelMenu").offsetHeight;
				measures.menuOriginal = document.getElementById("item-list").offsetHeight;
				measures.menuRendered = document.getElementById("item-list").scrollHeight;
				measures.subOriginal = document.getElementById("subMenuSelectionArea").offsetHeight;
				measures.subRendered = document.getElementById("subMenuSelectionArea").scrollHeight;

				document.getElementById('subMenuSelectionArea').setAttribute("style","height: auto !important; overflow: none !important");

				if(measures.menuRendered > measures.menuOriginal){
					if(measures.subRendered + measures.menuRendered > measures.fullHeight){
						/*Adjust Height*/
						document.getElementById('subMenuSelectionArea').setAttribute("style","height: 17vh !important; overflow: scroll !important");
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


function fetchImageFromServer(itemCode, vegFlag){

		itemCode = parseInt(itemCode);

        $.ajax({
            type: 'GET',
            url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/'+itemCode,
            timeout: 10000,
            success: function(serverData) {
              if(serverData.data != ''){
              	$('#menu_image_holder_'+itemCode).html('<span class="bg-img" style="background: none !important; position: relative"><img src="'+serverData.data+'" style="width: 110px; height: 110px;">'+(vegFlag == 2 ? '<img src="images/common/food_nonveg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+(vegFlag == 1 ? '<img src="images/common/food_veg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+'</span>');
              }
            },
            error: function(data){
            }
        });     
}




/* Sample KOT */
/*

{
	"KOTNumber": "KOT1001",
	"orderDetails": {
		"mode": "Dine In",
		"modeType": "DINE",
		"reference": ""
	},
	"table": "T3",
	"customerName": "Abhijith",
	"customerMobile": "9043960876",
	"stewardName": "Maneesh",
	"stewardCode": "9848010922",
	"orderStatus": 1,
	"date": "24-01-2018",
	"timePunch": "2217",
	"timeKOT": "2219",
	"timeBill": "",
	"timeSettle": "",
	"cart": [{
		"name": "Chicken Shawarma",
		"code": "1086",
		"qty": 1,
		"isCustom": true,
		"variant": "Paratha Roll",
		"price": "75",
		"comments": ""
	}, {
		"code": "1081",
		"name": "Boneless BBQ Fish",
		"qty": 1,
		"isCustom": false,
		"price": "220",
		"comments": "Make it less spicy"
	}],
	"extras": [{
		"name": "GST",
		"value": 5,
		"unit": "PERCENTAGE",
		"amount": 15
	}, {
		"name": "Service Charge",
		"value": 45,
		"unit": "FIXED",
		"amount": 45
	}],
	"discount": {
		"amount": 35.4,
		"type": "Staffs Guest",
		"unit": "PERCENTAGE",
		"value": "12"
	},
	"specialRemarks": "Allergic to Tomato"
}

*/

function generateKOT(silentFlag){

	$("#triggerClick_PrintKOTButton").removeClass("shortcutSafe"); //Shortcut safe
	$("#triggerClick_PrintKOTSilentlyButton").removeClass("shortcutSafe"); //Shortcut safe

	//Editing Case
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		generateEditedKOTPreprocess(silentFlag);
	}
	else if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){ //New Order Case
		generateNewKOT(silentFlag);
	}
}

/*Generate KOT for Editing Order */
function generateEditedKOTPreprocess(silentFlag){

	//recheck orginal KOT data to avoid KOT PUNCHING CONFLICT
	var originalDataCached = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
	
    //Set _id from Branch mentioned in Licence
    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
      showToast('Invalid Licence Error: KOT can not be generated. Please contact Accelerate Support if problem persists.', '#e74c3c');
      return '';
    }

    var KOTNumber = originalDataCached.KOTNumber;
    var kot_request_data = accelerate_licencee_branch +"_KOT_"+ KOTNumber;

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+kot_request_data,
      timeout: 10000,
      success: function(latestData) {
        if(latestData._id != ""){

        	var cart_latest = JSON.stringify(latestData.cart);
        	var cart_cached = JSON.stringify(originalDataCached.cart);
          	

          	if(cart_latest == cart_cached){
          		generateEditedKOT(originalDataCached, silentFlag)
          	}
          	else{
          		document.getElementById("kotUpdateConflictWarning").style.display = 'block'; 
          		document.getElementById("kotUpdateConflictWarningConsent").innerHTML = '<button class="btn btn-default" onclick="hideKOTConflictWarning()" style="float: left">Cancel</button>'+
                  							'<button class="btn btn-info" onclick="clearAndReopenKOT(\''+latestData.KOTNumber+'\')">Refresh KOT</button>';
          	}
        }
        else{
          showToast('Not Found Error: KOT #'+KOTNumber+' not found on the Server, might have billed already.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('Not Found Error: KOT #'+KOTNumber+' not found on the Server, might have billed already.', '#e74c3c');
      }
    });   
}

function clearAndReopenKOT(kot_id){
	clearCurrentEditingOrder();
	moveToEditKOT(kot_id);
	hideKOTConflictWarning();
	showToast('KOT Refreshed. You can make your changes now.', '#27ae60');
}

function hideKOTConflictWarning(){
	document.getElementById("kotUpdateConflictWarning").style.display = 'none'; 
}


function generateEditedKOT(originalData, silentFlag){

	var changedCustomerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	if(jQuery.isEmptyObject(changedCustomerInfo)){
		showToast('Customer Details missing', '#e74c3c');
		return '';
	}

	var changed_cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
	if(changed_cart_products.length == 0){
		showToast('Empty Cart! Add items and try again', '#e74c3c');
		return '';
	}


	//Check if Item Deleted or Count Decreased (only Admins can do this!)
	var hasRestrictedEdits = false;


	//Track changes in the KOT
	var comparisonResult = [];

	//Compare changes in the Cart
	var original_cart_products = originalData.cart;

	//Search for changes in the existing items
	checkForItemChanges(original_cart_products[0], 0);

	function checkForItemChanges(checkingItem, index){
		//Find each item in original cart in the changed cart
		var itemFound = false;
		for(var i = 0; i < changed_cart_products.length; i++){
			
			//same item found, check for its quantity and report changes
			if((checkingItem.code == changed_cart_products[i].code) && (checkingItem.cartIndex == changed_cart_products[i].cartIndex)){
				
				itemFound = true;

				//Change in Quantity
				if(changed_cart_products[i].qty > checkingItem.qty){ //qty increased
					//console.log(checkingItem.name+' x '+changed_cart_products[i].qty+' ('+(changed_cart_products[i].qty-checkingItem.qty)+' More)');
					
					var tempItem = changed_cart_products[i];
					tempItem.change = "QUANTITY_INCREASE";
					tempItem.oldValue = checkingItem.qty;
					if(changed_cart_products[i].comments != '' && checkingItem.comments != changed_cart_products[i].comments){
						tempItem.newComments = changed_cart_products[i].comments;
					}
					comparisonResult.push(tempItem);
				}
				else if(changed_cart_products[i].qty < checkingItem.qty){ //qty decreased
					//console.log(changed_cart_products[i].name+' x '+changed_cart_products[i].qty+' ('+(checkingItem.qty-changed_cart_products[i].qty)+' Less)');
					
					var tempItem = changed_cart_products[i];
					tempItem.change = "QUANTITY_DECREASE";
					tempItem.oldValue = checkingItem.qty;
					if(changed_cart_products[i].comments != '' && checkingItem.comments != changed_cart_products[i].comments){
						tempItem.newComments = changed_cart_products[i].comments;
					}
					comparisonResult.push(tempItem);

					hasRestrictedEdits = true;
				}
				else{ //same qty
					//console.log(checkingItem.name+' x '+checkingItem.qty);
				}

				break;
				
			}

			//Last iteration to find the item
			if(i == changed_cart_products.length-1){
				if(!itemFound){ //Item Deleted
						
						var tempItem = checkingItem;
						
						tempItem.change = "ITEM_DELETED";
						tempItem.oldValue = "";
						if(changed_cart_products[i].comments != '' && checkingItem.comments != changed_cart_products[i].comments){
							tempItem.newComments = changed_cart_products[i].comments;
						}
						comparisonResult.push(tempItem);

						hasRestrictedEdits = true;
				}
			}
		}

		if(original_cart_products[index+1]){
			checkForItemChanges(original_cart_products[index+1], index+1);
		}
		else{
			checkForNewItems();
		}

	} //end - function


	//Search for new additions to the Cart
	function checkForNewItems(){
		var j = 0;
		while(changed_cart_products[j]){

			for(var m = 0; m < original_cart_products.length; m++){
				//check if item is found, not found implies New Item!
				if((changed_cart_products[j].cartIndex == original_cart_products[m].cartIndex) && (changed_cart_products[j].code == original_cart_products[m].code)){
					//Item Found
					break;
				}

				//Last iteration to find the item
				if(m == original_cart_products.length-1){
					//console.log(changed_cart_products[j].name+' x '+changed_cart_products[j].qty+' (New)');
					
					var tempItem = changed_cart_products[j];
					tempItem.change = "NEW_ITEM";
					tempItem.oldValue = "";
					if(changed_cart_products[j].comments != ''){
						tempItem.newComments = changed_cart_products[j].comments;
					}
					
					comparisonResult.push(tempItem);
				}
			}

			//last iteration
			if(j == changed_cart_products.length - 1){
				generateEditedKOTAfterProcess(originalData.KOTNumber, changed_cart_products, changedCustomerInfo, comparisonResult, hasRestrictedEdits, silentFlag)
			} 

			j++;
		}
	}

}


function generateEditedKOTAfterProcess(kotID, newCart, changedCustomerInfo, compareObject, hasRestrictedEdits, silentFlag){


  // LOGGED IN USER INFO
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }

  if(hasRestrictedEdits && !isUserAnAdmin){
  	showToast('No Permission: Only an Admin can reduce item quantity.', '#e67e22');
  	return '';
  }

    //Set _id from Branch mentioned in Licence
    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
      showToast('Invalid Licence Error: KOT can not be generated. Please contact Accelerate Support if problem persists.', '#e74c3c');
      return '';
    }

    var kot_request_data = accelerate_licencee_branch +"_KOT_"+ kotID;

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+kot_request_data,
      timeout: 10000,
      success: function(data) {
        if(data._id != ""){
          
          var kot = data;

          //Updates the KOT
          kot.customerMobile = changedCustomerInfo.mobile;
          kot.customerName = changedCustomerInfo.name;
          kot.guestCount = parseInt(changedCustomerInfo.count);
          kot.timeKOT = getCurrentTime('TIME');
          kot.cart = newCart;

          if(window.localStorage.specialRequests_comments && window.localStorage.specialRequests_comments != ''){
          	kot.specialRemarks = window.localStorage.specialRequests_comments;
          }

          var allergyData = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData) : [];
          kot.allergyInfo = allergyData;



			/* RECALCULATE New Figures*/
			var subTotal = 0;
			var packagedSubTotal = 0;

			var n = 0;
			while(kot.cart[n]){
				subTotal = subTotal + kot.cart[n].qty * kot.cart[n].price;

				if(kot.cart[n].isPackaged){
					packagedSubTotal += kot.cart[n].qty * kot.cart[n].price;
				}

				n++;
			}

			/*Calculate Taxes and Other Charges*/
	        var k = 0;
	        if(kot.extras.length > 0){
	          	for(k = 0; k < kot.extras.length; k++){

	          		var tempExtraTotal = 0;

	          		if(kot.extras[k].isPackagedExcluded){
			          		if(kot.extras[k].value != 0){
			          			if(kot.extras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = (kot.extras[k].value * (subTotal - packagedSubTotal))/100;
			          			}
			          			else if(kot.extras[k].unit == 'FIXED'){
			          				tempExtraTotal = kot.extras[k].value;
			          			}
			          		}
			        }
			        else{
			          		if(kot.extras[k].value != 0){
			          			if(kot.extras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = kot.extras[k].value * subTotal/100;
			          			}
			          			else if(kot.extras[k].unit == 'FIXED'){
			          				tempExtraTotal = kot.extras[k].value;
			          			}
			          		}			        	
			        }


	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		kot.extras[k] = {
				 		"name": kot.extras[k].name,
						"value": kot.extras[k].value,
						"unit": kot.extras[k].unit,
						"amount": tempExtraTotal,
						"isPackagedExcluded": kot.extras[k].isPackagedExcluded
	          		};
	          	}
	        }

	        /*Calculate Discounts if Any*/     
	        if(kot.discount){
	          		var tempExtraTotal = 0;
	          		if(kot.discount.value != 0){
	          			if(kot.discount.unit == 'PERCENTAGE'){
	          				tempExtraTotal = kot.discount.value * subTotal/100;
	          			}
	          			else if(kot.discount.unit == 'FIXED'){
	          				tempExtraTotal = kot.discount.value;
	          			}
	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		kot.discount.amount = tempExtraTotal;
	        }


	        /*Calculate Custom Extras if Any*/     
	        if(kot.customExtras){
	          		var tempExtraTotal = 0;
	          		if(kot.customExtras.value != 0){
	          			if(kot.customExtras.unit == 'PERCENTAGE'){
	          				tempExtraTotal = kot.customExtras.value * subTotal/100;
	          			}
	          			else if(kot.customExtras.unit == 'FIXED'){
	          				tempExtraTotal = kot.customExtras.value;
	          			}
	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		kot.customExtras.amount = tempExtraTotal;
	        }


	        var minimum_cooking_time = 0;

	        for(var t = 0; t < compareObject.length; t++){
	        	if(compareObject[t].change == "NEW_ITEM" || compareObject[t].change == "QUANTITY_INCREASE"){
					
					/* min cooking time */
					if(compareObject[t].cookingTime && compareObject[t].cookingTime > 0){
						if(minimum_cooking_time <= compareObject[t].cookingTime){
							minimum_cooking_time = compareObject[t].cookingTime;
						}
					}

	        	}
	        }


          	  	//Update on Server
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_kot/'+(kot._id)+'/',
                  data: JSON.stringify(kot),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                  	 
	              	//Show minimum cooking time...
					var display_minimum_cooking_time_flag = window.localStorage.appOtherPreferences_minimumCookingTime && window.localStorage.appOtherPreferences_minimumCookingTime == 1 ? true : false;

					  if(display_minimum_cooking_time_flag && minimum_cooking_time > 0){
						flashMinimumCookingTime(minimum_cooking_time);
				   	  }

                  	  if(silentFlag == 'SILENTLY'){ //Skip Printing..
                  	  	showToast('<b>Skipped Printing!</b> Changed KOT #'+kot.KOTNumber+' generated Successfully.', '#27ae60');
                  	  }
                  	  else{
                      	sendKOTChangesToPrinterPreProcess(kot, compareObject);
                      	showToast('Changed KOT #'+kot.KOTNumber+' generated Successfully', '#27ae60');
                      }

                      /*
                      	clearAllMetaData();
                  	  	renderCustomerInfo();
                  	  */

                  	  pushCurrentOrderAsEditKOT(kot);

                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                });         

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }
    }); 
}


function sendKOTChangesToPrinterPreProcess(kot, compareObject){
	
	/*
		**********************************************
		OLD - Direct Printing from Client (deprecated)
		**********************************************
					

			              	var isKOTRelayingEnabled = window.localStorage.appOtherPreferences_KOTRelayEnabled ? (window.localStorage.appOtherPreferences_KOTRelayEnabled == 1 ? true : false) : false;
							var isKOTRelayingEnabledOnDefault = window.localStorage.appOtherPreferences_KOTRelayEnabledDefaultKOT ? (window.localStorage.appOtherPreferences_KOTRelayEnabledDefaultKOT == 1 ? true : false) : false;

			              	var default_set_KOT_printer = window.localStorage.systemOptionsSettings_defaultKOTPrinter ? window.localStorage.systemOptionsSettings_defaultKOTPrinter : '';
                        	var default_set_KOT_printer_data = null;
                        	var only_KOT_printer = null;


                        	findDefaultKOTPrinter();

                        	function findDefaultKOTPrinter(){

	                              var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

	                              var g = 0;
	                              while(allConfiguredPrintersList[g]){

	                                if(allConfiguredPrintersList[g].type == 'KOT'){
		                              	for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
		                                    if(allConfiguredPrintersList[g].list[a].name == default_set_KOT_printer){
		                                      default_set_KOT_printer_data = allConfiguredPrintersList[g].list[a];
		                                    }
											else if(only_KOT_printer == null){
		                                    	only_KOT_printer = allConfiguredPrintersList[g].list[a];
		                                    }
	                                	}

	                                	break;
	                                }
	                               
	                                g++;
	                              }
	                        }

	                        if(default_set_KOT_printer_data == null){
	                        	default_set_KOT_printer_data = only_KOT_printer;
	                        }


			              	if(isKOTRelayingEnabled){

			              		showPrintingAnimation();

			              		var relayRuleList = window.localStorage.custom_kot_relays ? JSON.parse(window.localStorage.custom_kot_relays) : [];
			              		var relaySkippedItems = [];

			              		populateRelayRules();

			              		function populateRelayRules(){
				              		var n = 0;
				              		while(relayRuleList[n]){

				              			relayRuleList[n].subcart = [];

				              			for(var i = 0; i < compareObject.length; i++){
				              				if(compareObject[i].category == relayRuleList[n].name && relayRuleList[n].printer != ''){
				              					relayRuleList[n].subcart.push(compareObject[i]);
				              				}
				              			}	

				              			if(n == relayRuleList.length - 1){
				              				generateRelaySkippedItems();
				              			}

				              			n++;
				              		}

				              		if(relayRuleList.length == 0){
				              			generateRelaySkippedItems();
				              		}
				              	}

				              	function generateRelaySkippedItems(){
				              		var m = 0;
				              		while(compareObject[m]){

				              			if(relayRuleList.length != 0){
					              			for(var i = 0; i < relayRuleList.length; i++){
					              				if(compareObject[m].category == relayRuleList[i].name && relayRuleList[i].printer != ''){
					              					//item found
					              					break;
					              				}

					              				if(i == relayRuleList.length - 1){ //last iteration and item not found
					              					relaySkippedItems.push(compareObject[m])
					              				}
					              			}	
					              		}
					              		else{ //no relays set, skip all items
					              			relaySkippedItems.push(compareObject[m]);
					              		}

				              			if(m == compareObject.length - 1){

				              				if(relaySkippedItems.length > 0){
				              					//Print skipped items (non-relayed items)
							              		var defaultKOTPrinter = window.localStorage.systemOptionsSettings_defaultKOTPrinter ? window.localStorage.systemOptionsSettings_defaultKOTPrinter : '';
							              		
							              		if(defaultKOTPrinter == ''){
							              			sendKOTChangesToPrinter(kot, relaySkippedItems);
							              			printRelayedKOT(relayRuleList);
							              		}
							              		else{
													var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
												    var selected_printer = '';

												    var g = 0;
												    while(allConfiguredPrintersList[g]){
												      if(allConfiguredPrintersList[g].type == 'KOT'){
														for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
													        if(allConfiguredPrintersList[g].list[a].name == defaultKOTPrinter){
													        	selected_printer = allConfiguredPrintersList[g].list[a];

													        	if(isKOTRelayingEnabledOnDefault){
													        		sendKOTChangesToPrinter(kot, relaySkippedItems, selected_printer);
													        		printRelayedKOT(relayRuleList);	
													        	}
													        	else{
													        		sendKOTChangesToPrinter(kot, compareObject, selected_printer);
													        		printRelayedKOT(relayRuleList);	
													        	}

													        	break;
													        }
													    }
												      }
												      

												      if(g == allConfiguredPrintersList.length - 1){
												      	if(selected_printer == ''){ //No printer found, print on default!
												      		if(isKOTRelayingEnabledOnDefault){
										           				sendKOTChangesToPrinter(kot, relaySkippedItems, default_set_KOT_printer_data);
										           				printRelayedKOT(relayRuleList);	
										           			}
										             		else{
										              			sendKOTChangesToPrinter(kot, compareObject, default_set_KOT_printer_data);
										              			printRelayedKOT(relayRuleList);	
										              		}
												      	}
												      }
												      
												      g++;
												    }
							              		}

				              				}
				              				else{
												if(!isKOTRelayingEnabledOnDefault){
											        sendKOTChangesToPrinter(kot, compareObject, default_set_KOT_printer_data);
											    	printRelayedKOT(relayRuleList);	
											    }
											    else{
											    	printRelayedKOT(relayRuleList, 'NO_DELAY_PLEASE');	
											    }			              					
				              				}

				              				
				              				
				              			}

				              			m++;
				              		}
				              	}

				              	function printRelayedKOT(relayedList, optionalRequest){

				              		var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
								    var g = 0;
								    var allPrintersList = [];

								    while(allConfiguredPrintersList[g]){

								      	if(allConfiguredPrintersList[g].type == 'KOT'){ //filter only KOT Printers
									      for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
									          allPrintersList.push({
									            "name": allConfiguredPrintersList[g].list[a].name,
									            "target": allConfiguredPrintersList[g].list[a].target,
									            "template": allConfiguredPrintersList[g].list[a]
									          });
									      }

									      //Start relay after some significant delay. 
									      //Printing of relay skipped items might not be completed yet...
									      if(optionalRequest == 'NO_DELAY_PLEASE'){
									      		startRelayPrinting(0);
									      }
									      else{
					              			  setTimeout(function(){ 
										      	 startRelayPrinting(0);
										      }, 888);
										  }

									      break;
									    }

								      	if(g == allConfiguredPrintersList.length - 1){
									      	if(optionalRequest == 'NO_DELAY_PLEASE'){
									      		  startRelayPrinting(0);
										    }
										    else{
						              			  setTimeout(function(){ 
											      	 startRelayPrinting(0);
											      }, 888);
											}
								      	}
								      
								      	g++;
								    }

								    function startRelayPrinting(index){
								    	
								    	console.log('Relay Print - Round '+index+' on '+allPrintersList[index].name);

								    	var relayedItems = [];
								    	for(var i = 0; i < relayedList.length; i++){
								    		if(relayedList[i].subcart.length > 0 && relayedList[i].printer == allPrintersList[index].name){
								    			relayedItems = relayedItems.concat(relayedList[i].subcart)	
								    		}

								    		if(i == relayedList.length - 1){ //last iteration
								    			if(relayedItems.length > 0){

								    				sendKOTChangesToPrinter(kot, relayedItems, allPrintersList[index].template);

								    				if(allPrintersList[index+1]){
								    					//go to next after some delay
				              							setTimeout(function(){ 
								    						startRelayPrinting(index+1);
								    					}, 999);
								    				}
								    				else{
								    					finishPrintingAnimation();
								    				}
								    			}
								    			else{
								    				//There are no items to relay. Go to next.
								    				if(allPrintersList[index+1]){
								    					startRelayPrinting(index+1);
								    				}
								    				else{
								    					finishPrintingAnimation();
								    				}
								    			}
								    		}
								    	}
								    }


								    //LEGACY - Start
								    function startRelayPrinting(index){

								    	console.log('*Relay Print - Round '+index+' on '+allPrintersList[index].name)

								    	if(index == 0){
								    		showPrintingAnimation();
								    	}

										//add some delay
				              			setTimeout(function(){ 
				              			
								    		var relayedItems = [];
								    		for(var i = 0; i < relayedList.length; i++){
								    			if(relayedList[i].subcart.length > 0 && relayedList[i].printer == allPrintersList[index].name){
								    				relayedItems = relayedItems.concat(relayedList[i].subcart)	
								    			}

								    			if(i == relayedList.length - 1){ //last iteration

								    				if(relayedItems.length > 0){
								    					
								    					sendKOTChangesToPrinter(kot, relayedItems, allPrintersList[index].template);
								    					
								    					if(allPrintersList[index+1]){
								    						startRelayPrinting(index+1);
								    					}
								    					else{
								    						finishPrintingAnimation();
								    					}
								    				}
								    				else{
								    					if(allPrintersList[index+1]){
								    						startRelayPrinting(index+1);
								    					}
								    					else{
								    						finishPrintingAnimation();
								    					}
								    				}
								    			}
								    		}

								    	}, 999);
								    }
								    //LEGACY - End

				              	}
			              	}
			              	else{ //no relay (normal case)
			              		
			              		var defaultKOTPrinter = window.localStorage.systemOptionsSettings_defaultKOTPrinter ? window.localStorage.systemOptionsSettings_defaultKOTPrinter : '';
			              		
			              		if(defaultKOTPrinter == ''){
			              			sendKOTChangesToPrinter(kot, compareObject);
			              		}
			              		else{
									var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
								    var selected_printer = '';

								    var g = 0;
								    while(allConfiguredPrintersList[g]){
								      if(allConfiguredPrintersList[g].type == 'KOT'){
										for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
									        if(allConfiguredPrintersList[g].list[a].name == defaultKOTPrinter){
									        	selected_printer = allConfiguredPrintersList[g].list[a];
									        	sendKOTChangesToPrinter(kot, compareObject, selected_printer);
									        	break;
									        }
									    }
								      }
								      

								      if(g == allConfiguredPrintersList.length - 1){
								      	if(selected_printer == ''){ //No printer found, print on default!
								      		sendKOTChangesToPrinter(kot, compareObject);
								      	}
								      }
								      
								      g++;
								    }
			              		}
			              			
			              	}
	*/




			            /*
							LATEST - Printing from Single Server (Pre-release 2019 March)
			            */


						  //Get staff info.
						  var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
						
						  if(jQuery.isEmptyObject(loggedInStaffInfo)){
								loggedInStaffInfo.name = 'Default';
								loggedInStaffInfo.code = '0000000000';
						  }	

			              var printRequestObject = kot;

			              printRequestObject.printRequest = {
			              	"KOT": printRequestObject._id,
							"action": "KOT_EDITING",
							"table": kot.table,
							"staffName": loggedInStaffInfo.name,
							"staffCode": loggedInStaffInfo.code,
							"machine": window.localStorage.appCustomSettings_SystemName && window.localStorage.appCustomSettings_SystemName != "" ? window.localStorage.appCustomSettings_SystemName : window.localStorage.accelerate_licence_machineUID,
							"time": moment().format('HHmm'),
							"date": moment().format('DD-MM-YYYY'),
							"comparison": compareObject
			              };

			              delete printRequestObject._rev;
			              delete printRequestObject._id;

				          //Post to local Server
				          $.ajax({
				            type: 'POST',
				            url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot_print_requests/',
				            data: JSON.stringify(printRequestObject),
				            contentType: "application/json",
				            dataType: 'json',
				            timeout: 10000,
				            success: function(data) {
				              	if(data.ok){
					          
					          	}
					          	else{
					          		showToast('Print Failed: KOT was not printed.', '#e74c3c');
					          	}
					        },
					        error: function(data){  
					           	if(data.responseJSON.error == "conflict"){
					           		showToast('The same KOT is yet to be printed. Failed!!!!!', '#e74c3c');
					           	} 
					            else{
					           		showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
					           	}
					        }
					      });  	


}





/* to quick view what items got removed */
function quickViewRemovedItems(){

	var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
	var changed_cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
	


	var itemDeletedList = [];

	//Compare changes in the Cart
	var original_cart_products = originalData.cart;

	//Corner case --> All items are removed
	if(changed_cart_products.length == 0){
		openQuickDeletedViewModal(original_cart_products);
		return '';
	}


	//Search for changes in the existing items
	var n = 0;
	while(original_cart_products[n]){
		
		//Find each item in original cart in the changed cart
		var itemFound = false;
		for(var i = 0; i < changed_cart_products.length; i++){
			
			//same item found, check for its quantity and report changes
			if((original_cart_products[n].cartIndex == changed_cart_products[i].cartIndex) && (original_cart_products[n].code == changed_cart_products[i].code)){			
				itemFound = true;
				break;
			}

			//Last iteration to find the item
			if(i == changed_cart_products.length-1){
				if(!itemFound){ //Item Deleted
					itemDeletedList.push(original_cart_products[n]);
				}
			}
		} 

		//Last iteration of items search
		if(n == original_cart_products.length-1){
			openQuickDeletedViewModal(itemDeletedList);
		}

		n++;
	}

}

function openQuickDeletedViewModal(listObj){

		if(listObj.length == 0){
			hideUndoDelete();
			return '';
		}

		var i = 0;
		var deleteList = '';
		while(listObj[i]){
			deleteList = deleteList + '<button style="margin-right: 5px" class="btn btn-outline savedCommentButton" onclick="revertDelete(\''+encodeURI(JSON.stringify(listObj[i]))+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-undo"></i></tag>'+listObj[i].name+(listObj[i].isCustom ? ' ('+listObj[i].variant+')' : '')+' x '+listObj[i].qty+'</button>';
			i++;
		}

		document.getElementById("deleteItemsListing").innerHTML = deleteList;
		document.getElementById("undoDeleteModal").style.display = 'block';
}

function hideUndoDelete(){
	document.getElementById("undoDeleteModal").style.display = 'none';
}

function revertDelete(encodedItem){
	var item = JSON.parse(decodeURI(encodedItem));

	if(item.isCustom){
		addCustomToCart(item.name,  item.category, item.code, item.cookingTime, item.price, item.variant, 'DELETE_REVERSAL',  item.ingredients ? encodeURI(JSON.stringify(item.ingredients)) : "", item.cartIndex, item.isPackaged);
	}
	else{
		additemtocart(encodedItem, 'ATTACHED_WITHIN', 'DELETE_REVERSAL');
	}
	
	quickViewRemovedItems();
}


/* Generate KOT for Fresh Order */
function generateNewKOT(silentFlag){

	//Render Cart Items based on local storage
	var cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
	if(cart_products.length == 0){
		showToast('Empty Cart! Add items and try again', '#e74c3c');
		return '';
	}

	var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
	
	var selectedBillingModeName = $('#customer_form_data_mode').attr("selected-mode");
	var selectedBillingModeInfo = '';
	
	var n = 0;
	while(billing_modes[n]){
		if(billing_modes[n].name == selectedBillingModeName){
			selectedBillingModeInfo = billing_modes[n];
			break;
		}
		n++;
	}



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

	          	var params = data.docs[0].value;

	          	var selectedModeExtrasList = selectedBillingModeInfo.extras;
	          	var cartExtrasList = [];

	          	if(selectedModeExtrasList == undefined){
	          		showToast("Something went wrong. Select Billing Mode again.", '#e74c3c');
	          	}

	          	var n = 0;
	          	var m = 0;
	          	while(selectedModeExtrasList[n]){
	          		m = 0;
	          		while(params[m]){	  
	          			if(selectedModeExtrasList[n].name == params[m].name){  
	          				params[m].value = parseFloat(selectedModeExtrasList[n].value);    			
	          				cartExtrasList.push(params[m]);
	          			}
	          			
	          			m++;
	          		}
	          		n++;
	          	}
	          	
	          	generateKOTAfterProcess(cart_products, selectedBillingModeInfo, cartExtrasList, silentFlag)	

          }
          else{
            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

}



//Save New Customer to Database

function addCustomerToDatabase(customerData){

	//Set _id from Branch mentioned in Licence
	var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
	if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
	  	showToast('Invalid Licence Error: Customer Database can not be modified. Please contact Accelerate Support if problem persists.', '#e74c3c');
	  	return '';
	}

	customerData._id = customerData.mobile;
	customerData.branch = accelerate_licencee_branch;

	//Post to local Server
	$.ajax({
	    type: 'POST',
	    url: COMMON_LOCAL_SERVER_IP+'/accelerate_users/',
	    data: JSON.stringify(customerData),
	    contentType: "application/json",
	    dataType: 'json',
	    timeout: 10000,
	    success: function(data) {

        },
        error: function(data) {
                	
        }
	});  

}

function updateCustomerAddressOnDatabase(mobile, newAddress){

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_users/'+mobile,
      timeout: 10000,
      success: function(data) {
        if(data._id != ""){

          		var userData = data;
          		userData.savedAddresses.push(newAddress);

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_users/'+mobile+'/',
                  data: JSON.stringify(userData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                  },
                  error: function(data) {
                      showToast('Warning: Customer\'s Address on the Server was not updated', '#e67e22');
                  }
                }); 
        }
        else{
        	showToast('Warning: Customer\'s Address on the Server was not updated', '#e67e22');
        }
      },
      error: function(data) {
        showToast('Warning: Customer\'s Address on the Server was not updated', '#e67e22');
      }

    }); 
}


function removeCustomerAddressFromDatabase(mobile, addressID){

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_users/'+mobile,
      timeout: 10000,
      success: function(data) {
        if(data._id != ""){

          		var userData = data;
          		var n = 0;
          		while(userData.savedAddresses[n]){
          			if(userData.savedAddresses[n].id == addressID){
          				userData.savedAddresses.splice(n, 1);
          				break;
          			}
          			n++;
          		}

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_users/'+mobile+'/',
                  data: JSON.stringify(userData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                  },
                  error: function(data) {
                      showToast('Warning: Customer\'s Address on the Server was not updated', '#e67e22');
                  }
                }); 
        }
      },
      error: function(data) {
        showToast('Warning: Customer\'s Address on the Server was not updated', '#e67e22');
      }

    }); 
}


function generateKOTAfterProcess(cart_products, selectedBillingModeInfo, selectedModeExtras, silentFlag){
		
		/*Process Figures*/
		var subTotal = 0;
		var packagedSubTotal = 0;

		var minimum_cooking_time = 0;

		var n = 0;
		while(cart_products[n]){

			/* min cooking time */
			if(cart_products[n].cookingTime && cart_products[n].cookingTime > 0){
				if(minimum_cooking_time <= cart_products[n].cookingTime){
					minimum_cooking_time = cart_products[n].cookingTime;
				}
			}


			subTotal = subTotal + cart_products[n].qty * cart_products[n].price;

			if(cart_products[n].isPackaged){
				packagedSubTotal = packagedSubTotal + cart_products[n].qty * cart_products[n].price;
			}

			n++;
		}

		  /*Calculate Taxes and Other Charges*/ 

		  //Note: Skip tax and other extras (with isCompulsary no) on packaged food Pepsi ect. (marked with 'isPackaged' = true)

          var otherCharges = [];        
          var k = 0;

          if(selectedModeExtras.length > 0){
          	for(k = 0; k < selectedModeExtras.length; k++){

          		var tempExtraTotal = 0;

          		if(selectedModeExtras[k].value != 0){
          			if(selectedModeExtras[k].excludePackagedFoods){
		          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
		          				tempExtraTotal = (selectedModeExtras[k].value * (subTotal-packagedSubTotal))/100;
		          			}
		          			else if(selectedModeExtras[k].unit == 'FIXED'){
		          				tempExtraTotal = selectedModeExtras[k].value;
		          			}          				
          			}
          			else{
		          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
		          				tempExtraTotal = selectedModeExtras[k].value * subTotal/100;
		          			}
		          			else if(selectedModeExtras[k].unit == 'FIXED'){
		          				tempExtraTotal = selectedModeExtras[k].value;
		          			}                 				
          			}


          		}

          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

          		otherCharges.push({
			 		"name": selectedModeExtras[k].name,
					"value": selectedModeExtras[k].value,
					"unit": selectedModeExtras[k].unit,
					"amount": tempExtraTotal,
					"isPackagedExcluded": selectedModeExtras[k].excludePackagedFoods
          		})
          	}
          }


    //Get customer info.
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		showToast('Customer Details missing', '#e74c3c');
		return '';
	}


	if(customerInfo.mappedAddress == '' && customerInfo.modeType != 'PARCEL'){
		switch(customerInfo.modeType){
			case "TOKEN":{
				showToast('Token is not set', '#e74c3c');
				return '';
				break;
			}
			case "PARCEL":{
				showToast('Token is not set', '#e74c3c');
				return '';
				break;
			}
			case "DELIVERY":{
				showToast('Delivery Address not set', '#e74c3c');
				return '';
				break;
			}
			case "DINE":{
				showToast('Table not selected', '#e74c3c');
				return '';
				break;
			}
			default:{
				showToast('Table Number or Address missing', '#e74c3c');
				return '';
				break;
			}
		}
		
	}

	/* customerInfo.json
		{
			"name": "Anas Jafry",
			"mobile": "9884179675",
			"mode": "Dine AC",
			"mappedAddress": "T3",
			"reference": "Ref. to any other API (say booking number)"
		}
	*/

	//Get staff info.
	var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
	
	if(jQuery.isEmptyObject(loggedInStaffInfo)){
		loggedInStaffInfo.name = 'Default';
		loggedInStaffInfo.code = '0000000000';
	}	

	var spremarks = '';

	var orderMetaInfo = {};
	orderMetaInfo.mode = customerInfo.mode;
	orderMetaInfo.modeType = customerInfo.modeType;
	orderMetaInfo.reference = customerInfo.reference;
	orderMetaInfo.isOnline = customerInfo.isOnline;

	if(customerInfo.isOnline){
		orderMetaInfo.onlineOrderDetails = customerInfo.onlineOrderDetails;
	}


	//User not found in DB ==> Add USER to DB
	if(!window.localStorage.userAutoFound || window.localStorage.userAutoFound == ''){
		
		if(customerInfo.mobile != ''){

			var customerObject = {
				"name": customerInfo.name,
				"mobile": customerInfo.mobile,
				"savedAddresses": []
			}


			if(customerInfo.modeType == 'DELIVERY'){

				var address = JSON.parse(decodeURI(customerInfo.mappedAddress));

				customerObject.savedAddresses. push({
				      "id": 1,
				      "name": address.name,
				      "flatNo": address.flatNo,
				      "flatName": address.flatName,
				      "landmark": address.landmark,
				      "area": address.area,
				      "contact": address.contact
				    });
			}

			addCustomerToDatabase(customerObject);				
		}
	}


	//Precheck if the table is free (for DINE orders alone)
	if(customerInfo.modeType == "DINE"){
		
		var table_req = customerInfo.mappedAddress;

		
		if(table_req != "" && table_req != "None"){

		    $.ajax({
		      type: 'GET',
		      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/_design/kot-fetch/_view/fetchbytable?startkey=["'+table_req+'"]&endkey=["'+table_req+'"]',
		      timeout: 10000,
		      success: function(data) {
		      	if(data.rows.length >= 1){
					showToast('Warning: Table <b>'+table_req+'</b> is not free. Please check in <b>Live Orders</b>.', '#e67e22');
		            return "";
		        }		        
		        else{
		          	processNewKOT();
		        }
		      },
		      error: function(data) {
		        showToast('System Error: Unable to read Table info.', '#e74c3c');
		        return "";
		      }

		    });
		}
		else{
			processNewKOT();
		}
	}
	else{
		processNewKOT();	
	}
  

  //PROCESS KOT --> All set... Punch KOT now!
  function processNewKOT(){

    //Check for KOT index on Server
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_KOT_INDEX" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_INDEX'){

	          var num = parseInt(data.docs[0].value) + 1;
	          var kot = 'K' + num;

	          var memory_revID = data.docs[0]._rev;

	          updateKOTIndexOnServer(num, memory_revID);

	          function updateKOTIndexOnServer(num, updateRevID){

                    	  //Update KOT number on server
                          var updateData = {
                            "_rev": updateRevID,
                            "identifierTag": "ACCELERATE_KOT_INDEX",
                            "value": num
                          }

                          $.ajax({
                            type: 'PUT',
                            url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_KOT_INDEX/',
                            data: JSON.stringify(updateData),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: 10000,
                            success: function(data) {
                              
                            },
                            error: function(data) {
                              showToast('System Error: Unable to update KOT Index. Next KOT Number might be faulty. Please contact Accelerate Support.', '#e74c3c');
                            }
                          });
	          }


	          
	         
	          var today = getCurrentTime('DATE');
	          var time = getCurrentTime('TIME');

	          var specialRemarksInfo = window.localStorage.specialRequests_comments ? window.localStorage.specialRequests_comments : '';
	          var allergyData = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData) : [];

	          var obj = {}; 
	          obj.KOTNumber = kot;
	          obj.orderDetails = orderMetaInfo;
	          obj.table = customerInfo.mappedAddress;

	          obj.customerName = customerInfo.name;
	          obj.customerMobile = customerInfo.mobile; 
	          obj.guestCount = customerInfo.count && customerInfo.count != '' ? parseInt(customerInfo.count) : '';

	          obj.machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
	          
	          var sessionInfo = window.localStorage.setSessionData ? JSON.parse(window.localStorage.setSessionData) : {};
	          obj.sessionName = sessionInfo.name ? sessionInfo.name : '';

	          obj.stewardName = loggedInStaffInfo.name;
	          obj.stewardCode = loggedInStaffInfo.code;

	          obj.date = today;
	          obj.timePunch = time;
	          obj.timeKOT = "";
	          obj.timeBill = "";
	          obj.timeSettle = "";

	          obj.cart = cart_products;
	          obj.specialRemarks = specialRemarksInfo;
	          obj.allergyInfo = allergyData;

	          obj.extras = otherCharges;
	          obj.discount = {};
	          obj.customExtras = {};

	        
	          //Set _id from Branch mentioned in Licence
	          var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
	          if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
	          	showToast('Invalid Licence Error: KOT can not be generated. Please contact Accelerate Support if problem persists.', '#e74c3c');
	          	return '';
	          }

	          obj._id = accelerate_licencee_branch+'_KOT_'+kot;
	        

	          var remember_obj = '';
	          var original_order_object_cart = obj.cart;

	          //Post to local Server
	          $.ajax({
	            type: 'POST',
	            url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/',
	            data: JSON.stringify(obj),
	            contentType: "application/json",
	            dataType: 'json',
	            timeout: 10000,
	            success: function(data) {
	              if(data.ok){

	              	//Show minimum cooking time...
					var display_minimum_cooking_time_flag = window.localStorage.appOtherPreferences_minimumCookingTime && window.localStorage.appOtherPreferences_minimumCookingTime == 1 ? true : false;

					if(display_minimum_cooking_time_flag && minimum_cooking_time > 0){
						flashMinimumCookingTime(minimum_cooking_time);
					}



	              	if(orderMetaInfo.modeType == 'DINE'){

	              		var guestObject = {
	              			"guestName" : obj.customerName,
	              			"guestContact" : obj.customerMobile,
	              			"guestCount" : obj.guestCount
	              		}

	              		addToTableMapping(obj.table, kot, obj.stewardName, guestObject, 'ORDER_PUNCHING');
	              		

	              		/*
	              		clearAllMetaData();
	              		renderCustomerInfo();
	              		$("#add_item_by_search").focus();
	              		*/

	              		pushCurrentOrderAsEditKOT(obj);

	              		if(silentFlag == 'SILENTLY'){
	              			showToast('<b>Skipped Printing!</b> KOT #'+kot+' generated Successfully.', '#27ae60');
	              		}
	              		else{
	              			initialiseKOTPrinting();
	              			showToast('KOT #'+kot+' generated Successfully', '#27ae60');
	              		}
	              	}
	              	else if(orderMetaInfo.modeType == 'TOKEN'){

	              		//Clear Token
						window.localStorage.claimedTokenNumber = '';
						window.localStorage.claimedTokenNumberTimestamp = '';	              		
	 					
	 					pushCurrentOrderAsEditKOT(obj);
	              		generateBillFromKOT(kot, 'ORDER_PUNCHING');

	              		if(silentFlag == 'SILENTLY'){
	              			showToast('<b>Skipped Printing!</b> KOT #'+kot+' generated Successfully.', '#27ae60');
	              		}
	              		else{
	              			initialiseKOTPrinting();
	              			showToast('KOT #'+kot+' generated Successfully', '#27ae60');
	              		}

	              	}
	              	else if(orderMetaInfo.modeType == 'PARCEL' || orderMetaInfo.modeType == 'DELIVERY'){

	              		if(orderMetaInfo.modeType == 'PARCEL'){
	              			//Clear Token
							window.localStorage.claimedTokenNumber = '';
							window.localStorage.claimedTokenNumberTimestamp = '';	 
	              		}
	              		
	              		//If an online order ==> Save Mapping
	              		if(obj.orderDetails.isOnline){
	              			saveOnlineOrderMapping(obj);
	              			getOnlineOrdersCount();
	              		}
	              		

	              		pushCurrentOrderAsEditKOT(obj);
	              		generateBillFromKOT(kot, 'ORDER_PUNCHING');

	              		if(silentFlag == 'SILENTLY'){
	              			showToast('<b>Skipped Printing!</b> KOT #'+kot+' generated Successfully.', '#27ae60');
	              		}
	              		else{
	              			initialiseKOTPrinting();
	              			showToast('KOT #'+kot+' generated Successfully', '#27ae60');
	              		}
	              	}


	              	//Send KOT for Printing
	              	function initialiseKOTPrinting(){
			              	

	              	 /*
						**********************************************
						OLD - Direct Printing from Client (deprecated)
						**********************************************
					


			              	var isKOTRelayingEnabled = window.localStorage.appOtherPreferences_KOTRelayEnabled ? (window.localStorage.appOtherPreferences_KOTRelayEnabled == 1 ? true : false) : false;
			              	var isKOTRelayingEnabledOnDefault = window.localStorage.appOtherPreferences_KOTRelayEnabledDefaultKOT ? (window.localStorage.appOtherPreferences_KOTRelayEnabledDefaultKOT == 1 ? true : false) : false;

			              	var default_set_KOT_printer = window.localStorage.systemOptionsSettings_defaultKOTPrinter ? window.localStorage.systemOptionsSettings_defaultKOTPrinter : '';
                        	var default_set_KOT_printer_data = null;
                        	var only_KOT_printer = null;


                        	findDefaultKOTPrinter();

                        	function findDefaultKOTPrinter(){

	                              var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

	                              var g = 0;
	                              while(allConfiguredPrintersList[g]){

	                                if(allConfiguredPrintersList[g].type == 'KOT'){
		                              	for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
		                                    if(allConfiguredPrintersList[g].list[a].name == default_set_KOT_printer){
		                                      	default_set_KOT_printer_data = allConfiguredPrintersList[g].list[a];
		                                    }
											else if(only_KOT_printer == null){
		                                    	only_KOT_printer = allConfiguredPrintersList[g].list[a];
		                                    }
	                                	}

	                                	break;
	                                }
	                               
	                                g++;
	                              }
	                        }

	                        if(default_set_KOT_printer_data == null){
	                        	default_set_KOT_printer_data = only_KOT_printer;
	                        }


			              	if(isKOTRelayingEnabled){

			              		showPrintingAnimation();

			              		var relayRuleList = window.localStorage.custom_kot_relays ? JSON.parse(window.localStorage.custom_kot_relays) : [];
			              		var relaySkippedItems = [];

			              		populateRelayRules();

			              		function populateRelayRules(){
				              		var n = 0;
				              		while(relayRuleList[n]){

				              			relayRuleList[n].subcart = [];

				              			for(var i = 0; i < obj.cart.length; i++){
				              				if(obj.cart[i].category == relayRuleList[n].name && relayRuleList[n].printer != ''){
				              					relayRuleList[n].subcart.push(obj.cart[i]);
				              				}
				              			}	

				              			if(n == relayRuleList.length - 1){
				              				generateRelaySkippedItems();
				              			}

				              			n++;
				              		}

				              		if(relayRuleList.length == 0){
				              			generateRelaySkippedItems();
				              		}
				              	}

				              	function generateRelaySkippedItems(){
				              		var m = 0;
				              		while(obj.cart[m]){

				              			if(relayRuleList.length != 0){
					              			for(var i = 0; i < relayRuleList.length; i++){
					              				if(obj.cart[m].category == relayRuleList[i].name && relayRuleList[i].printer != ''){
					              					//item found
					              					break;
					              				}

					              				if(i == relayRuleList.length - 1){ //last iteration and item not found
					              					relaySkippedItems.push(obj.cart[m])
					              				}
					              			}
					              		}
					              		else{ //no relays set, skip all items
					              			relaySkippedItems.push(obj.cart[m]);
					              		}	

				              			if(m == obj.cart.length - 1){ //last iteration

				              				//Print Relay Skipped items (if exists)
				              				var relay_skipped_obj = obj;
				              				relay_skipped_obj.cart = relaySkippedItems;
				              				
				              				if(relaySkippedItems.length > 0){

								              		var defaultKOTPrinter = window.localStorage.systemOptionsSettings_defaultKOTPrinter ? window.localStorage.systemOptionsSettings_defaultKOTPrinter : '';
								              		
								              		if(defaultKOTPrinter == ''){
								              			if(isKOTRelayingEnabledOnDefault){ //relay KOT on default printer as well. otherwise, complete order will be printed on default printer.
								              				sendToPrinter(relay_skipped_obj, 'KOT', default_set_KOT_printer_data);
								              			
								              				printRelayedKOT(relayRuleList);
								              			}
								              			else{
								              				var preserved_order = obj;
											              	preserved_order.cart = original_order_object_cart;
								              				
								              				sendToPrinter(preserved_order, 'KOT', default_set_KOT_printer_data);
								              				
								              				printRelayedKOT(relayRuleList);
								              			}
								              		}
								              		else{
														var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
													    var selected_printer = '';

													    var g = 0;
													    while(allConfiguredPrintersList[g]){
													      if(allConfiguredPrintersList[g].type == 'KOT'){
															for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
														        if(allConfiguredPrintersList[g].list[a].name == defaultKOTPrinter){
														        	selected_printer = allConfiguredPrintersList[g].list[a];

														        	if(isKOTRelayingEnabledOnDefault){
											              				sendToPrinter(relay_skipped_obj, 'KOT', selected_printer);
											              			
											              				printRelayedKOT(relayRuleList);
											              			}
											              			else{

											              				var preserved_order = obj;
											              				preserved_order.cart = original_order_object_cart;

											              				sendToPrinter(preserved_order, 'KOT', selected_printer);
											              				
											              				printRelayedKOT(relayRuleList);
											              			}

														        	break;
														        }
														    }
													      }
													      

													      if(g == allConfiguredPrintersList.length - 1){
													      	if(selected_printer == ''){ //No printer found, print on default!
													      		if(isKOTRelayingEnabledOnDefault){
										              				sendToPrinter(relay_skipped_obj, 'KOT', default_set_KOT_printer_data);

										              				printRelayedKOT(relayRuleList);
										              			}
										              			else{
										              				var preserved_order = obj;
											              			preserved_order.cart = original_order_object_cart;

										              				sendToPrinter(preserved_order, 'KOT', default_set_KOT_printer_data);

										              				printRelayedKOT(relayRuleList);
										              			}
													      	}
													      }
													      
													      g++;
													    }
								              		}
				              				}
				              				else{
												if(!isKOTRelayingEnabledOnDefault){
													var preserved_order = obj;
											        preserved_order.cart = original_order_object_cart;
											        
											        sendToPrinter(preserved_order, 'KOT', default_set_KOT_printer_data);
											    	printRelayedKOT(relayRuleList);
											    }
											    else{
											    	printRelayedKOT(relayRuleList, 'NO_DELAY_PLEASE');
											    }				              					
				              				}	
				              				
				              			}

				              			m++;
				              		}
				              	}

				              	function printRelayedKOT(relayedList, optionalRequest){

				              		var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
								    var g = 0;
								    var allPrintersList = [];

								    while(allConfiguredPrintersList[g]){

								      	if(allConfiguredPrintersList[g].type == 'KOT'){ //filter only KOT Printers
									      for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
									          allPrintersList.push({
									            "name": allConfiguredPrintersList[g].list[a].name,
									            "target": allConfiguredPrintersList[g].list[a].target,
									            "template": allConfiguredPrintersList[g].list[a]
									          });
									      }

									      //Start relay after some significant delay. 
									      //Printing of relay skipped items might not be completed yet...
									      if(optionalRequest == 'NO_DELAY_PLEASE'){
									      		startRelayPrinting(0);
									      }
									      else{
					              			  setTimeout(function(){ 
										      	 startRelayPrinting(0);
										      }, 888);
										  }

									      break;
									    }

								      	if(g == allConfiguredPrintersList.length - 1){
									      	if(optionalRequest == 'NO_DELAY_PLEASE'){
									      		  startRelayPrinting(0);
										    }
										    else{
						              			  setTimeout(function(){ 
											      	 startRelayPrinting(0);
											      }, 888);
											}
								      	}
								      
								      	g++;
								    }


								    function startRelayPrinting(index){
								    	
								    	console.log('Relay Print - Round '+index+' on '+allPrintersList[index].name);
								    	
								    	var relayedItems = [];
								    	for(var i = 0; i < relayedList.length; i++){
								    		if(relayedList[i].subcart.length > 0 && relayedList[i].printer == allPrintersList[index].name){
								    			relayedItems = relayedItems.concat(relayedList[i].subcart)	
								    		}

								    		if(i == relayedList.length - 1){ //last iteration
								    			if(relayedItems.length > 0){
								    				var relayedNewObj = obj;
								    				relayedNewObj.cart = relayedItems;
								    				
								    				sendToPrinter(relayedNewObj, 'KOT', allPrintersList[index].template);

								    				if(allPrintersList[index+1]){
								    					//go to next after some delay
				              							setTimeout(function(){ 
								    						startRelayPrinting(index+1);
								    					}, 999);
								    				}
								    				else{
								    					finishPrintingAnimation();
								    				}
								    			}
								    			else{
								    				//There are no items to relay. Go to next.
								    				if(allPrintersList[index+1]){
								    					startRelayPrinting(index+1);
								    				}
								    				else{
								    					finishPrintingAnimation();
								    				}
								    			}
								    		}
								    	}
								    }
								    

								    //LEGACY Start
								    function startRelayPrinting(index){

								    	console.log('Relay Print - Round '+index+' on '+allPrintersList[index].name)

										if(index == 0){
								    		showPrintingAnimation();
								    	}

										//add some delay
				              			setTimeout(function(){ 
				              			
								    		var relayedItems = [];
								    		for(var i = 0; i < relayedList.length; i++){
								    			if(relayedList[i].subcart.length > 0 && relayedList[i].printer == allPrintersList[index].name){
								    				relayedItems = relayedItems.concat(relayedList[i].subcart)	
								    			}

								    			if(i == relayedList.length - 1){ //last iteration
								    				var relayedNewObj = obj;
								    				relayedNewObj.cart = relayedItems;

								    				if(relayedItems.length > 0){
								    					
								    					sendToPrinter(relayedNewObj, 'KOT', allPrintersList[index].template);
								    					
								    					if(allPrintersList[index+1]){
								    						startRelayPrinting(index+1);
								    					}
								    					else{
								    						finishPrintingAnimation();
								    					}
								    				}
								    				else{
								    					if(allPrintersList[index+1]){
								    						startRelayPrinting(index+1);
								    					}
								    					else{
								    						finishPrintingAnimation();
								    					}
								    				}
								    			}
								    		}

								    	}, 999);
								    }
								    // LEGACY End

				              	}
			              	}
			              	else{ //no relay (normal case)
			              		
			              		var defaultKOTPrinter = window.localStorage.systemOptionsSettings_defaultKOTPrinter ? window.localStorage.systemOptionsSettings_defaultKOTPrinter : '';
			              		
			              		if(defaultKOTPrinter == ''){
			              			sendToPrinter(obj, 'KOT');
			              		}
			              		else{
									var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
								    var selected_printer = '';

								    var g = 0;
								    while(allConfiguredPrintersList[g]){
								      if(allConfiguredPrintersList[g].type == 'KOT'){
										for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
									        if(allConfiguredPrintersList[g].list[a].name == defaultKOTPrinter){
									        	selected_printer = allConfiguredPrintersList[g].list[a];
									        	sendToPrinter(obj, 'KOT', selected_printer);
									        	break;
									        }
									    }
								      }
								      

								      if(g == allConfiguredPrintersList.length - 1){
								      	if(selected_printer == ''){ //No printer found, print on default!
								      		sendToPrinter(obj, 'KOT');
								      	}
								      }
								      
								      g++;
								    }
			              		}
			              			
			              	}


			            */


			            /*
							LATEST - Printing from Single Server (Pre-release 2019 March)
			            */

			              var printRequestObject = obj;

			              printRequestObject.printRequest = {
			              	"KOT": printRequestObject._id,
							"action": "KOT_NEW",
							"table": obj.table,
							"staffName": obj.stewardName,
							"staffCode": obj.stewardCode,
							"machine": window.localStorage.appCustomSettings_SystemName && window.localStorage.appCustomSettings_SystemName != "" ? window.localStorage.appCustomSettings_SystemName : window.localStorage.accelerate_licence_machineUID,
							"time": moment().format('HHmm'),
							"date": moment().format('DD-MM-YYYY'),
							"comparison": []
			              };

			              delete printRequestObject._rev;
			              delete printRequestObject._id;

				          //Post to local Server
				          $.ajax({
				            type: 'POST',
				            url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot_print_requests/',
				            data: JSON.stringify(printRequestObject),
				            contentType: "application/json",
				            dataType: 'json',
				            timeout: 10000,
				            success: function(data) {
				              	if(data.ok){
					          
					          	}
					          	else{
					          		showToast('Print Failed: KOT was not printed.', '#e74c3c');
					          	}
					        },
					        error: function(data){  
					           	if(data.responseJSON.error == "conflict"){
					           		showToast('The same KOT is yet to be printed. Failed!!!!!', '#e74c3c');
					           	} 
					            else{
					           		showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
					           	}
					        }
					      });  			             

			        } //end - initialise KOT Prints

	              }
	              else{
	                showToast('Warning: KOT was not Generated. Try again.', '#e67e22');
	              }
	            },
	            error: function(data){  
	            	if(data.responseJSON.error == "conflict"){
	            		showToast('KOT Number Conflict: <b style="color: #c9ff49; text-decoration: underline; cursor: pointer" onclick="renderPage(\'system-settings\', \'System Settings\'); openSystemSettings(\'quickFixes\');">Apply Quick Fix #1</b> and try again. Please contact Accelerate Support if problem persists.', '#e74c3c');
	            	} 
	            	else{
	            		showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
	            	}  
	            }
	          });  
			  //End - post KOT to Server

          }
          else{
            showToast('Not Found Error: KOT Index data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Index data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Index. Please contact Accelerate Support.', '#e74c3c');
      }

    });
  }//process KOT



}


function saveOnlineOrderMapping(orderObject){

	var systemDate = getCurrentTime('DATE_DD-MM-YY');

	//Pass the info to the Server Mapping
    var objectData = {
    	  "_id" : orderObject.orderDetails.onlineOrderDetails.orderSource+'_'+orderObject.orderDetails.reference,
		  "onlineOrder": orderObject.orderDetails.reference,
		  "source": orderObject.orderDetails.onlineOrderDetails.orderSource,
		  "type": orderObject.orderDetails.modeType,
		  "name": orderObject.customerName,
		  "mobile": orderObject.customerMobile,
		  "timeReceive": orderObject.orderDetails.onlineOrderDetails.onlineTime,
		  "timePunch": orderObject.timePunch,
		  "timeDispatch": "",
		  "agentName": "",
		  "agentNumber": "",
		  "modeOfPayment": orderObject.orderDetails.onlineOrderDetails.paymentMode,
		  "amount": orderObject.orderDetails.onlineOrderDetails.onlineAmount,
		  "date": orderObject.orderDetails.onlineOrderDetails.onlineDate,
		  "systemBill": orderObject.KOTNumber,
		  "onlineStatus": 1,
		  "systemStatus": 1,
		  "systemDate": systemDate  
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_online_orders/',
      data: JSON.stringify(objectData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
      	if(data.ok){

      	}
      	else{
      		showToast('System Error: Unable to modify Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
      	}
        
      },
      error: function(data) {
      	if(data.statusText == "Conflict"){
      		showToast('Warning! This order (#'+orderObject.orderDetails.reference+') was already punched.', '#e67e22');
      	}
        else{
        	showToast('System Error: Unable to update Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
      	}
      }

    }); 	
}


let flashMinimumCookingTimeInterval;
function flashMinimumCookingTime(time_calculated){

	clearInterval(flashMinimumCookingTimeInterval);


	var x = document.getElementById("cookingTimeContainer");
	x.className = "show";

	flashMinimumCookingTimeInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);

	var time_targetted = moment();
	time_targetted.add(time_calculated,'m');

	var time_targetted_fancy = time_targetted.format('hh:mm a');

	document.getElementById("cookingTimeCounterDisplayCount").innerHTML = time_targetted_fancy;
	document.getElementById("cookingTimeCounterDisplayMinutes").innerHTML = time_calculated + ' mins'
}


function hideCookingTime(){
	var x = document.getElementById("cookingTimeContainer");
	x.className = "";
}



/*Add to edit KOT*/
function pushCurrentOrderAsEditKOT(kot){
    
    //var kot = JSON.parse(decodeURI(encodedKOT));

    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.count = parseInt(kot.guestCount);
    customerInfo.mappedAddress = kot.table;
    customerInfo.mode = kot.orderDetails.mode;
    customerInfo.modeType = kot.orderDetails.modeType;
    customerInfo.reference = kot.orderDetails.reference;
    customerInfo.isOnline = kot.orderDetails.isOnline;

    if(kot.specialRemarks && kot.specialRemarks != ''){
    	window.localStorage.specialRequests_comments = kot.specialRemarks;
    }
    else{
    	window.localStorage.specialRequests_comments = '';
    }

    if(kot.allergyInfo && kot.allergyInfo != []){
    	window.localStorage.allergicIngredientsData = JSON.stringify(kot.allergyInfo);
    }
    else{
    	window.localStorage.allergicIngredientsData = '';
    }

    //Pending new order will be removed off the cart.
    window.localStorage.accelerate_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);
    window.localStorage.edit_KOT_originalCopy = JSON.stringify(kot); //decodeURI(encodedKOT);

    //record max cart index
		var i = 0;
		var maxCartIndex = 0;

		while(i < kot.cart.length){
          if(maxCartIndex <= kot.cart[i].cartIndex){
			    maxCartIndex = kot.cart[i].cartIndex;
          }

          i++;
        }


    window.localStorage.maxCartIndex = maxCartIndex;

    renderCustomerInfo();
}

function clearAllMetaData(){
	//to remove cart info, customer info
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

	customerInfo.name = "";
	customerInfo.mobile ="";
	customerInfo.count = "";
	customerInfo.mappedAddress = "";
	customerInfo.reference = "";
	customerInfo.isOnline = false;

	window.localStorage.customerData = JSON.stringify(customerInfo);
	window.localStorage.accelerate_cart = '';
	window.localStorage.edit_KOT_originalCopy = '';
	window.localStorage.userAutoFound = '';
	window.localStorage.userDetailsAutoFound = '';

	window.localStorage.specialRequests_comments = '';
	window.localStorage.allergicIngredientsData = '[]';

	window.localStorage.hasUnsavedChangesFlag = 0;
	window.localStorage.maxCartIndex = 0;
 	//document.getElementById("leftdiv").style.borderColor = "#FFF";
}



function freshOrderOnTable(TableNumber, tableObject, optionalSaveFlag){

	/* skip if in Editing Mode & has unsaved changes */
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != '' && window.localStorage.hasUnsavedChangesFlag == 1){
		showToast('Warning: There are unsaved changes. Print the changed KOT to continue.', '#e67e22');
		return '';
	}

	//to remove cart info, customer info
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

	/* skip if not DINE mode */
	if(!customerInfo.modeType || customerInfo.modeType != 'DINE'){
		var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
		
		if(billing_modes.length == 0){
			showToast('Warning: There are no billing modes created.', '#e67e22');
			return '';
		}

		var n = 0;
		while(billing_modes[n]){
			if(billing_modes[n].type == 'DINE'){
				customerInfo.mode = billing_modes[n].name;
				customerInfo.modeType = 'DINE';
				
				break;
			}

			if(billing_modes.length == n){
				showToast('Warning: There are no billing modes of type Dine created.', '#e67e22');
				return '';
			}

			n++;
		}		
	}

	customerInfo.name = (tableObject.guestName && tableObject.guestName != '') ? tableObject.guestName : '';
	customerInfo.mobile = (tableObject.guestContact && tableObject.guestContact != '') ? tableObject.guestContact : '';
	customerInfo.count = (tableObject.guestCount && tableObject.guestCount != '') ? tableObject.guestCount : '';
	customerInfo.mappedAddress = TableNumber;
	customerInfo.reference = (tableObject.reservationMapping && tableObject.reservationMapping != '') ? tableObject.reservationMapping : '';
	customerInfo.isOnline = false;

	window.localStorage.customerData = JSON.stringify(customerInfo);
	window.localStorage.edit_KOT_originalCopy = '';

	if(optionalSaveFlag && optionalSaveFlag == 1){
		
			/* fetch cart from saved */

		    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_SAVED_ORDERS" } }

		    $.ajax({
		      type: 'POST',
		      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
		      data: JSON.stringify(requestData),
		      contentType: "application/json",
		      dataType: 'json',
		      timeout: 10000,
		      success: function(data) {
		        if(data.docs.length > 0){
		          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_ORDERS'){

						var holding_orders = data.docs[0].value;

						var n = 0;
						while(holding_orders[n]){

							if(holding_orders[n].customerDetails.mappedAddress == TableNumber){
								
								window.localStorage.edit_KOT_originalCopy = '';
								window.localStorage.accelerate_cart = '';
								window.localStorage.customerData = '';

								addHoldOrderToCurrent(encodeURI(JSON.stringify(holding_orders[n])), n);
								return '';
							}
							n++;
						}

		          }
		        }		        
		      }
		    });	
	}
	else{

		window.localStorage.accelerate_cart = '';
	
		window.localStorage.userAutoFound = '';
		window.localStorage.userDetailsAutoFound = '';
		window.localStorage.specialRequests_comments = '';
		window.localStorage.allergicIngredientsData = '[]';


		window.localStorage.hasUnsavedChangesFlag = 0;
		window.localStorage.maxCartIndex = 0;
	 	//document.getElementById("leftdiv").style.borderColor = "#FFF";

		renderCart();
		renderCustomerInfo();
		renderTables();

		$('#add_item_by_search').focus();
	}
}


/* Make a new order against a Customer Data provided, start with Empty Cart */
function freshOrderForCustomer(customerEncoded){

	/* skip if in Editing Mode & has unsaved changes */
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != '' && window.localStorage.hasUnsavedChangesFlag == 1){
		showToast('Warning: There are unsaved changes. Print the changed KOT to continue.', '#e67e22');
		return '';
	}

	var newCustomerObj = JSON.parse(decodeURI(customerEncoded));

	//to remove cart info, customer info
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

	/* skip if not DINE mode */
	if(!customerInfo.modeType || customerInfo.modeType != 'DINE'){
		var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
		
		if(billing_modes.length == 0){
			showToast('Warning: There are no billing modes created.', '#e67e22');
			return '';
		}

		var n = 0;
		while(billing_modes[n]){
			if(billing_modes[n].type == 'DINE'){
				customerInfo.mode = billing_modes[n].name;
				customerInfo.modeType = 'DINE';
				
				break;
			}

			if(billing_modes.length == n){
				showToast('Warning: There are no billing modes of type Dine created.', '#e67e22');
				return '';
			}

			n++;
		}		
	}

	customerInfo.name = newCustomerObj.name;
	customerInfo.mobile = newCustomerObj.mobile;
	customerInfo.mappedAddress = "";
	customerInfo.reference = "";
	customerInfo.count = "";
	customerInfo.isOnline = false;


	window.localStorage.customerData = JSON.stringify(customerInfo);
	window.localStorage.edit_KOT_originalCopy = '';

	window.localStorage.accelerate_cart = '';
	
	window.localStorage.userAutoFound = 1;
	window.localStorage.userDetailsAutoFound = JSON.stringify(newCustomerObj);



	window.localStorage.hasUnsavedChangesFlag = 0;
	window.localStorage.maxCartIndex = 0;

 	document.getElementById("leftdiv").style.borderColor = "#FFF";

	renderCart();
	renderCustomerInfo();
	renderTables();
}




function addToTableMapping(tableID, kotID, assignedTo, guestObject, optionalPageRef){

	if(tableID == "None"){ //Dummy Case
		return "";
	}

    var today = new Date();
    var hour = today.getHours();
    var mins = today.getMinutes();

    if(hour<10) {
      	hour = '0'+hour;
   	} 

    if(mins<10) {
        mins = '0'+mins;
    }

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
      timeout: 10000,
      success: function(data) {
        if(data.rows.length == 1){

              var tableData = data.rows[0].value;

              var remember_id = null;
              var remember_rev = null;

              if(tableData.table == tableID){

                remember_id = tableData._id;
                remember_rev = tableData._rev;

				if(tableData.status != 0 && tableData.status != 5){
					showToast('Warning: Table #'+tableID+' was not free. But Order is punched.', '#e67e22');
			    }
			    else{
	                tableData.assigned = assignedTo;
	                tableData.remarks = "";
	                tableData.KOT = kotID;
	                tableData.status = 1;
	                tableData.lastUpdate = hour+''+mins; 

	                if(guestObject != ""){
	                	tableData.guestName = guestObject.guestName; 
		                tableData.guestContact = guestObject.guestContact; 
		                tableData.guestCount = guestObject.guestCount; 
		                tableData.reservationMapping = "";
	                } 
	                else{
	                	tableData.guestName = ""; 
		                tableData.guestContact = ""; 
		                tableData.reservationMapping = "";
		                tableData.guestCount = 0;
	                }
	                
                }            


                    //Update
                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_tables/'+remember_id+'/',
                      data: JSON.stringify(tableData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        renderTables();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });   

              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
        }
        else{
          //showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}



function billTableMapping(tableID, billNumber, payableAmount, status, optionalPageRef){

	if(status != 1 && status != 2 && status != 3){
		showToast('Warning: Table #'+tableID+' was not mapped. But Bill is generated.', '#e67e22');
		return '';
	}

    var today = new Date();
    var hour = today.getHours();
    var mins = today.getMinutes();

    if(hour<10) {
    	hour = '0'+hour;
    } 

    if(mins<10) {
        mins = '0'+mins;
    }


    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableID+'"]&endkey=["'+tableID+'"]',
      timeout: 10000,
      success: function(data) {
        if(data.rows.length == 1){

              var tableData = data.rows[0].value;

              var remember_id = null;
              var remember_rev = null;

              if(tableData.table == tableID){

                remember_id = tableData._id;
                remember_rev = tableData._rev;

                tableData.remarks = payableAmount;
                tableData.KOT = billNumber;
                tableData.status = status;
                tableData.lastUpdate = hour+''+mins;            


                    //Update
                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_tables/'+remember_id+'/',
                      data: JSON.stringify(tableData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
		                      	if(optionalPageRef && optionalPageRef == 'ORDER_PUNCHING'){
		                      		renderTables();
		                      	}else if(optionalPageRef && optionalPageRef == 'SEATING_STATUS'){
		                      		preloadTableStatus();
		                      	}
		                      	else if(optionalPageRef && optionalPageRef == 'LIVE_ORDERS'){
		                      		renderAllKOTs();
		                      	}
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });   

              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


function pickTableForNewOrder(currentTableID){

	//To display Large (default) or Small Tables
	var smallTableFlag = '';

             
	//PRELOAD TABLE MAPPING
    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/all/',
      timeout: 10000,
      success: function(data) {
        if(data.total_rows > 0){

              var tableData = data.rows;
              tableData.sort(function(obj1, obj2) {
                return obj1.key - obj2.key; //Key is equivalent to sortIndex
              });

               
              if(tableData.length < 50 && tableData.length > 30){ //As per UI, it can include 30 large tables 
              	smallTableFlag = ' mediumTile';
              }
              else if(tableData.length > 50){
              	smallTableFlag = ' smallTile';
              }

				    var requestData = {
				      "selector"  :{ 
				                    "identifierTag": "ACCELERATE_TABLE_SECTIONS" 
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
				          if(data.docs[0].identifierTag == 'ACCELERATE_TABLE_SECTIONS'){

				            var tableSections = data.docs[0].value;
				            
							document.getElementById("pickTableForNewOrderModal").style.display = 'block';	
							$('#tableEasyInputBox').focus();
							$('#tableEasyInputBox').select();     
							
							var renderSectionArea = '';
							var renderTableArea = ''


									//First Iteration
								    $.each(tableSections, function(key_1, sectionName) {
								    	renderTableArea = '';
								    	$.each(tableData, function(key_2, mytable) {

												if(mytable.value.type == sectionName){

								              			if(mytable.value.status != 0){ /*Occuppied*/
															if(mytable.value.status == 1){
								              					renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" onclick="retrieveTableInfoForNewOrder(\''+mytable.value.table+'\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';	
															}	
															else if(mytable.value.status == 2){
																renderTableArea = renderTableArea + '<tag onclick="pickTableForNewOrderHide(); preSettleBill(\''+mytable.value.KOT+'\', \'ORDER_PUNCHING\')" class="tableTileYellow'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned && mytable.value.assigned != '' ? mytable.value.assigned : mytable.value.capacity+' Seater' )+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Bill'+(mytable.value.remarks && mytable.value.remarks != '' ? ' <b><i class="fa fa-inr"></i>'+mytable.value.remarks+'</b>' : '')+'</tag>'+
																					        	'</tag>';	
															}								
															else if(mytable.value.status == 5){
																if(currentTableID != '' && currentTableID == mytable.value.table){
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned != ""? (mytable.value.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.value.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																						        	'</tag>';	
																}	
																else{
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableReserved'+smallTableFlag+'" onclick="pickTableForNewOrderHide(); retrieveTableInfo(\''+mytable.value.table+'\', \'FREE\', \''+(mytable.value.assigned != "" && mytable.value.assigned != "Hold Order" ? mytable.value.assigned : '')+'\', '+(mytable.value.assigned != "" && mytable.value.assigned == "Hold Order" ? 1 : 0)+')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned == 'Hold Order' ? '<i class="fa fa-cloud-download"></i>' : (mytable.value.guestName && mytable.value.guestName != "" ? 'For '+mytable.value.guestName : 'For Guest'))+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'">'+(mytable.value.assigned == 'Hold Order' ? 'Saved Order' : 'Reserved')+'</tag>'+
																						        	'</tag>';	
																}

															}									
															else{
								              				renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" onclick="retrieveTableInfoForNewOrder(\''+mytable.value.table+'\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';											
															}


								              			}
								              			else{

								              				if(currentTableID != '' && currentTableID == mytable.value.table){
								              					renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')" class="tableTileBlue'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'" style="color: #FFF !important">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'" style="color: #FFF !important">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF !important"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';
															}	
															else{
																renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')" class="tableTileGreen'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																					        	'</tag>';
															}							        	              				
								              			}
								              		
							              		}							           

								    	 });

										if(renderTableArea != ''){
								        renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																	   '<h1 class="seatingPlanHead'+smallTableFlag+'">'+sectionName+'</h1>'+
																	   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+'</div>'+
																	'</div>';
										}



								    });

								    $('#pickTableForNewOrderModalContent').html(renderSectionArea);







							// SEARCH FOR TABLES

							var easyActionTool = $('#tableEasyInputBox').keyup(function(e) {
								if(e.which == 13){

									var isClicked = false;
									
									$("#pickTableForNewOrderModalContent .temporaryTableSelection").each(function(){
							            $(this).click();
							            e.preventDefault(); 
							            isClicked = true;
							            easyActionTool.unbind();
							        });

							        if(!isClicked){ //Hide
							        	showToast('Warning! No free table picked', '#e67e22');
							        }
								}
								else if(e.which == 27){
									pickTableForNewOrderHide();
									easyActionTool.unbind();
								}
							    else{

								    var searchField = $(this).val();

								    renderSectionArea = '';
								    renderTableArea = '';

								    var atleastOneTableSelected = false;

								    $.each(tableSections, function(key_1, sectionName) {
								    	renderTableArea = '';
								    	$.each(tableData, function(key_2, mytable) {


									     		var shortlistFlag = false;

												if(mytable.value.type == sectionName){

													if(searchField == ' '){ /* TWEAK to remove first Space */
														$('#tableEasyInputBox').val('');
														searchField = '';
													}

													shortlistFlag = (mytable.value.table.toUpperCase() == searchField.toUpperCase()) ? true : false;
													
													if(shortlistFlag){
														atleastOneTableSelected = true;
													}

													if(searchField != ''){ //Searched Case
								              			if(mytable.value.status != 0){ /*Occuppied*/
															if(mytable.value.status == 1){
								              					renderTableArea = renderTableArea + '<tag class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileRed'+smallTableFlag+'" onclick="retrieveTableInfoForNewOrder(\''+mytable.value.table+'\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';	
															}	
															else if(mytable.value.status == 2){
																renderTableArea = renderTableArea + '<tag onclick="pickTableForNewOrderHide(); preSettleBill(\''+mytable.value.KOT+'\', \'ORDER_PUNCHING\')" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileYellow'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned && mytable.value.assigned != '' ? mytable.value.assigned : mytable.value.capacity+' Seater' )+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Bill'+(mytable.value.remarks && mytable.value.remarks != '' ? ' <b><i class="fa fa-inr"></i>'+mytable.value.remarks+'</b>' : '')+'</tag>'+
																					        	'</tag>';	
															}								
															else if(mytable.value.status == 5){
																if(currentTableID != '' && currentTableID == mytable.value.table){
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')">'+
									              													'<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																						            '<tag class="tableTitle'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+mytable.value.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+(mytable.value.assigned != ""? (mytable.value.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.value.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important"><i class="fa fa-check"></i></tag>'+
																						        	'</tag>';	
																}	
																else{
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableReserved'+smallTableFlag+'" onclick="pickTableForNewOrderHide(); retrieveTableInfo(\''+mytable.value.table+'\', \'FREE\', \''+(mytable.value.assigned != "" && mytable.value.assigned != "Hold Order" ? mytable.value.assigned : '')+'\', '+(mytable.value.assigned != "" && mytable.value.assigned == "Hold Order" ? 1 : 0)+')">'+
																						            '<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned == 'Hold Order' ? '<i class="fa fa-cloud-download"></i>' : (mytable.value.guestName && mytable.value.guestName != "" ? 'For '+mytable.value.guestName : 'For Guest'))+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'">'+(mytable.value.assigned == 'Hold Order' ? 'Saved Order' : 'Reserved')+'</tag>'+
																						        	'</tag>';	
																}

															}									
															else{
								              				renderTableArea = renderTableArea + '<tag onclick="retrieveTableInfoForNewOrder(\''+mytable.value.table+'\')" class="'+(shortlistFlag ? '' : 'temporaryTableNotFiltered')+' tableTileRed'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';											
															}


								              			}
								              			else{

								              				if(currentTableID != '' && currentTableID == mytable.value.table){
								              					renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileBlue'+smallTableFlag+'">'+
																					            '<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																					            '<tag class="tableTitle'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';
															}	
															else{
																renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileGreen'+smallTableFlag+'">'+
																					            '<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																					        	'</tag>';
															}							        	              				
								              			}													
													} //Not searched!
													else{
								              			if(mytable.value.status != 0){ /*Occuppied*/
															if(mytable.value.status == 1){
								              					renderTableArea = renderTableArea + '<tag onclick="retrieveTableInfoForNewOrder(\''+mytable.value.table+'\')" class="tableTileRed'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';	
															}	
															else if(mytable.value.status == 2){
																renderTableArea = renderTableArea + '<tag onclick="pickTableForNewOrderHide(); preSettleBill(\''+mytable.value.KOT+'\', \'ORDER_PUNCHING\')" class="tableTileYellow'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned && mytable.value.assigned != '' ? mytable.value.assigned : mytable.value.capacity+' Seater' )+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Bill'+(mytable.value.remarks && mytable.value.remarks != '' ? ' <b><i class="fa fa-inr"></i>'+mytable.value.remarks+'</b>' : '')+'</tag>'+
																					        	'</tag>';	
															}								
															else if(mytable.value.status == 5){
																if(currentTableID != '' && currentTableID == mytable.value.table){
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned != ""? (mytable.value.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.value.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																						        	'</tag>';	
																}	
																else{
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableReserved'+smallTableFlag+'" onclick="pickTableForNewOrderHide(); retrieveTableInfo(\''+mytable.value.table+'\', \'FREE\', \''+(mytable.value.assigned != "" && mytable.value.assigned != "Hold Order" ? mytable.value.assigned : '')+'\', '+(mytable.value.assigned != "" && mytable.value.assigned == "Hold Order" ? 1 : 0)+')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.value.assigned == 'Hold Order' ? '<i class="fa fa-cloud-download"></i>' : (mytable.value.guestName && mytable.value.guestName != "" ? 'For '+mytable.value.guestName : 'For Guest'))+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'">'+(mytable.value.assigned == 'Hold Order' ? 'Saved Order' : 'Reserved')+'</tag>'+
																						        	'</tag>';	
																}

															}									
															else{
								              				renderTableArea = renderTableArea + '<tag onclick="retrieveTableInfoForNewOrder(\''+mytable.value.table+'\')" class="tableTileRed'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';											
															}


								              			}
								              			else{

								              				if(currentTableID != '' && currentTableID == mytable.value.table){
								              					renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')" class="tableTileBlue'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'" style="color: #FFF !important">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'" style="color: #FFF !important">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF !important"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';
															}	
															else{
																renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.value.table+'\')" class="tableTileGreen'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.value.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.value.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																					        	'</tag>';
															}							        	              				
								              			}
								              		}

							              		}							           

								    	 });


										if(searchField != '' && atleastOneTableSelected){
											$('#tableEasyInputBoxStatus').html('');
										}
										else if(searchField != '' && !atleastOneTableSelected){
											$('#tableEasyInputBoxStatus').html('<i class="fa fa-exclamation-circle" style="color: #e74c3c" title="Unknown Table Number"></i>');
										}
										else if(searchField == ''){
											 $('#tableEasyInputBoxStatus').html('');
										}

										if(renderTableArea != ''){
								        renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																	   '<h1 class="seatingPlanHead'+smallTableFlag+'">'+sectionName+'</h1>'+
																	   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+'</div>'+
																	'</div>';
										}


								    });

								    $('#pickTableForNewOrderModalContent').html(renderSectionArea);
								}
							});   



				          }
				          else{
				            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
				          }
				        }
				        else{
				          showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
				        }

				      },
				      error: function(data) {
				        showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
				      }

				    });
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}

function pickDummyTableForNewOrder(){
	//assign a dummy table value
	setCustomerInfoTable('None')
}


function pickTableForNewOrderHide(){
	document.getElementById("pickTableForNewOrderModalContent").innerHTML = '';
	document.getElementById("pickTableForNewOrderModal").style.display = 'none';
}


/*Set Delivery address*/
function pickAddressForNewOrder(encodedCurrentAddress){
		
		//General Address popup
		document.getElementById("pickAddressForNewOrderModal").style.display = 'block';
		clearDefaultDeliveryAddressContents();

		if(encodedCurrentAddress && encodedCurrentAddress != ''){
			var address = JSON.parse(decodeURI(encodedCurrentAddress));
			
			document.getElementById("delivery_address_parcel_name").value = address.name;
			document.getElementById("delivery_address_parcel_contact").value = address.contact;
			document.getElementById("delivery_address_parcel_flatNo").value = address.flatNo;
			document.getElementById("delivery_address_parcel_flatName").value = address.flatName;
			document.getElementById("delivery_address_parcel_landmark").value = address.landmark;
			document.getElementById("delivery_address_parcel_area").value = address.area;

			$("#delivery_address_parcel_name").focus();
		}
		else{
			//pre-fill name and mobile
			document.getElementById("delivery_address_parcel_name").value = document.getElementById("customer_form_data_name").value;
			document.getElementById("delivery_address_parcel_contact").value = document.getElementById("customer_form_data_mobile").value;
			
			if(document.getElementById("delivery_address_parcel_name").value == ''){
				$("#delivery_address_parcel_name").focus();
			}
			else if(document.getElementById("delivery_address_parcel_contact").value == ''){
				$("#delivery_address_parcel_contact").focus();
			}
			else{
				$("#delivery_address_parcel_flatNo").focus();
			}			
		}



          var easyActionTool = $(document).on('keydown',  function (e) {
            console.log('[Delivery Address] Am secretly running... ')
            if($('#pickAddressForNewOrderModal').is(':visible')) {
                 switch(e.which){
                  case 27:{ // Escape (Close)
                    pickAddressForNewOrderHide();
                    easyActionTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)
                    $('#pickAddressForNewOrderConfirmButton').click();
                    break;
                  }
                 }
            }
          });
}

/* Choose from Saved Addresses List */
function chooseAddressFromSavedList(){

	document.getElementById("chooseAddressForNewOrderModal").style.display = 'block';
	hideNewSavedDeliveryAddressArea(); 

	var addressOptionsAvailable = false;
	var userInfoAutoFound;
	var addressObj;

	if(!window.localStorage.userAutoFound || window.localStorage.userAutoFound == ''){
		addressOptionsAvailable = false;
	}
	else{
		userInfoAutoFound = window.localStorage.userDetailsAutoFound ? JSON.parse(window.localStorage.userDetailsAutoFound) : {};
		if(!jQuery.isEmptyObject(userInfoAutoFound)){
			addressObj = userInfoAutoFound.savedAddresses;
			if(addressObj && addressObj.length > 0){
				addressOptionsAvailable = true;
			}
		}
	}


	//close this window and open normal address window 
	if(!addressOptionsAvailable){
		chooseAddressFromSavedListHide();
		pickAddressForNewOrder();
	}
	
	var registeredMobile = userInfoAutoFound.mobile;
	var savedAddressesList = '';

	var n = 0;
	while(addressObj[n]){

		savedAddressesList += '<div class="col-sm-5 addressChoose" style="padding: 10px">'+    
                           '<p class="featureName"><b>'+addressObj[n].name+'</b><br> '+addressObj[n].flatNo+' '+addressObj[n].flatName+'<br> '+addressObj[n].landmark+' '+addressObj[n].area+'<br> '+( addressObj[n].contact && addressObj[n].contact != '' ? 'Mob. <b style="color: #da3769; font-weight: 400; letter-spacing: 2px;">'+addressObj[n].contact+'</b>' : '' )+'</p>'+
                            '<button class="btn btn-sm btn-outline" onclick="useThisSavedAddress(\''+encodeURI(JSON.stringify(addressObj[n]))+'\')">Use Address</button>'+
                            '<span onclick="deleteThisSavedAddress(\''+registeredMobile+'\', \''+addressObj[n].id+'\')" class="btn btn-sm" style="border: none; display: inline; float: right; color: #e74c3c"><i class="fa fa-trash-o"></i></span>'+
                        '</div>';
		n++;
	}

	document.getElementById("areaForSavedAddressRender").innerHTML = savedAddressesList;
}

function useThisSavedAddress(encodedCurrentAddress){

	var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData) : {};
	customerInfo.mappedAddress = decodeURI(encodedCurrentAddress); //make just stringified only

	window.localStorage.customerData = JSON.stringify(customerInfo);
	chooseAddressFromSavedListHide();
	renderCustomerInfo();
}


function deleteThisSavedAddress(mobile, addressID){
	//delete particular address from server copy

	var addressOptionsAvailable = false;
	var userInfoAutoFound;
	var addressObj;

	var memoriseAddressForRecovery;

	if(!window.localStorage.userAutoFound || window.localStorage.userAutoFound == ''){
		addressOptionsAvailable = false;
	}
	else{
		userInfoAutoFound = window.localStorage.userDetailsAutoFound ? JSON.parse(window.localStorage.userDetailsAutoFound) : {};
		if(!jQuery.isEmptyObject(userInfoAutoFound)){
			addressObj = userInfoAutoFound.savedAddresses;
			if(addressObj && addressObj.length > 0){
				addressOptionsAvailable = true;
			}
		}
	}


	var n = 0;
	while(addressObj[n]){

		if(addressObj[n].id == addressID){
			memoriseAddressForRecovery = addressObj[n];
			addressObj.splice(n, 1);
			break;
		}

		n++;
	}

	userInfoAutoFound.savedAddresses = addressObj;
	window.localStorage.userDetailsAutoFound = JSON.stringify(userInfoAutoFound);

	if(window.localStorage.userAutoFound && window.localStorage.userAutoFound == 1){//update the server as well
		chooseAddressFromSavedList();
		console.log('******** REMINDER: UPDATE SERVER')
		removeCustomerAddressFromDatabase(mobile, addressID);


		//Undo delete
		var encodedAddress = encodeURI(JSON.stringify(memoriseAddressForRecovery));
		showUndo('Deleted', 'saveNewDeliveryAddressAutoRecovery(\''+encodedAddress+'\')');
	}

}

function clearDefaultDeliveryAddressContents(){
			document.getElementById("delivery_address_parcel_name").value = '';
			document.getElementById("delivery_address_parcel_contact").value = '';
			document.getElementById("delivery_address_parcel_flatNo").value = '';
			document.getElementById("delivery_address_parcel_flatName").value = '';
			document.getElementById("delivery_address_parcel_landmark").value = '';
			document.getElementById("delivery_address_parcel_area").value = '';	
}


function chooseAddressFromSavedListHide(){
	document.getElementById("chooseAddressForNewOrderModal").style.display = 'none';
}

function openNewSavedDeliveryAddressArea(){

	document.getElementById("addNewSavedWindow").style.display = 'block';
	document.getElementById("areaForSavedAddressRender").style.display = 'none';
	document.getElementById("addNewSavedDeliveryAddressButton").style.display = 'none';

	//pre-fill name and mobile
	document.getElementById("add_new_deliveryAddress_name").value = document.getElementById("customer_form_data_name").value;
	document.getElementById("add_new_deliveryAddress_contact").value = document.getElementById("customer_form_data_mobile").value;
	
	if(document.getElementById("add_new_deliveryAddress_name").value == ''){
		$("#add_new_deliveryAddress_name").focus();
	}
	else if(document.getElementById("add_new_deliveryAddress_contact").value == ''){
		$("#add_new_deliveryAddress_contact").focus();
	}
	else{
		$("#add_new_deliveryAddress_flatNo").focus();
	}
}

function hideNewSavedDeliveryAddressArea(){
	document.getElementById("addNewSavedWindow").style.display = 'none';
	document.getElementById("areaForSavedAddressRender").style.display = 'block';
	document.getElementById("addNewSavedDeliveryAddressButton").style.display = 'block';
}

function saveNewDeliveryAddressAutoRecovery(encodedAddress){
	var address = JSON.parse(decodeURI(encodedAddress));

	if(window.localStorage.userAutoFound && window.localStorage.userAutoFound == 1){
		
		

		//modify user auto found details
		var backup_userInfoAutoFound = window.localStorage.userDetailsAutoFound ? JSON.parse(window.localStorage.userDetailsAutoFound) : {};
		if(!jQuery.isEmptyObject(backup_userInfoAutoFound)){
			if(backup_userInfoAutoFound.savedAddresses){
				backup_userInfoAutoFound.savedAddresses.push(address);
			}
			else{
				var tempAddressHolder = [];
				tempAddressHolder.push(address)
				backup_userInfoAutoFound.savedAddresses = tempAddressHolder;
			}
			
			window.localStorage.userDetailsAutoFound = JSON.stringify(backup_userInfoAutoFound);
		}

		//update the server as well
		console.log('******** REMINDER: UPDATE SERVER')
		updateCustomerAddressOnDatabase(backup_userInfoAutoFound.mobile, address);

	}

	chooseAddressFromSavedList();
}



function saveNewDeliveryAddress(newAddressAssignedID){

	/* NOTE: If user auto-found (already registered user) --> Save to Server as well */

	var addressOptionsAvailable = false
	var addressObj;
	var userInfoAutoFound;

	if(!window.localStorage.userAutoFound || window.localStorage.userAutoFound == ''){
		addressOptionsAvailable = false;
	}
	else{
		userInfoAutoFound = window.localStorage.userDetailsAutoFound ? JSON.parse(window.localStorage.userDetailsAutoFound) : {};
		if(!jQuery.isEmptyObject(userInfoAutoFound)){
			addressObj = userInfoAutoFound.savedAddresses;
			if(addressObj && addressObj.length > 0){
				addressOptionsAvailable = true;
			}
		}
	}
	

	var address = {};

	if(!addressOptionsAvailable){ //Not registered user or regstrd user with NO available saved addresses
		address.id = 1;
		address.name = document.getElementById("delivery_address_parcel_name").value;
		address.contact = document.getElementById("delivery_address_parcel_contact").value;
		address.flatNo = document.getElementById("delivery_address_parcel_flatNo").value;
		address.flatName = document.getElementById("delivery_address_parcel_flatName").value;
		address.landmark = document.getElementById("delivery_address_parcel_landmark").value;
		address.area = document.getElementById("delivery_address_parcel_area").value;
	}
	else{

		var nextAddressID = 1;

		var n = 0;
		while(addressObj[n]){
			if(nextAddressID < addressObj[n].id){
				nextAddressID = addressObj[n].id;
			}
			n++;
		}

		address.id = nextAddressID + 1;
		address.name = document.getElementById("add_new_deliveryAddress_name").value;
		address.contact = document.getElementById("add_new_deliveryAddress_contact").value;
		address.flatNo = document.getElementById("add_new_deliveryAddress_flatNo").value;
		address.flatName = document.getElementById("add_new_deliveryAddress_flatName").value;
		address.landmark = document.getElementById("add_new_deliveryAddress_landmark").value;
		address.area = document.getElementById("add_new_deliveryAddress_area").value;
	}


	//quick validation
	if(address.name == '' && address.contact == '' && address.flatNo == '' && address.flatName == '' && address.landmark == '' && address.area == ''){
		showToast('Warning: All fields in Delivery Address is empty', '#e67e22');
		return '';
	}

	if(address.contact == ''){
		showToast('Warning: Please add the Mobile Number', '#e67e22');
		return '';
	}

	if(address.flatNo == '' && address.flatName == ''){
		showToast('Warning: Flat/House Number and Name required', '#e67e22');
		return '';
	}


	if(window.localStorage.userAutoFound && window.localStorage.userAutoFound == 1){
		//User found --> Update address to the Server
		//update the server as well
		
		console.log('******** REMINDER: UPDATE SERVER')
		updateCustomerAddressOnDatabase(userInfoAutoFound.mobile, address);

		//modify user auto found details
		var backup_userInfoAutoFound = window.localStorage.userDetailsAutoFound ? JSON.parse(window.localStorage.userDetailsAutoFound) : {};
		if(!jQuery.isEmptyObject(backup_userInfoAutoFound)){
			if(backup_userInfoAutoFound.savedAddresses){
				backup_userInfoAutoFound.savedAddresses.push(address);
			}
			else{
				var tempAddressHolder = [];
				tempAddressHolder.push(address)
				backup_userInfoAutoFound.savedAddresses = tempAddressHolder;
			}
			
			window.localStorage.userDetailsAutoFound = JSON.stringify(backup_userInfoAutoFound);
		}

	}


	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

	customerInfo.mappedAddress = JSON.stringify(address);
	window.localStorage.customerData = JSON.stringify(customerInfo);
	pickAddressForNewOrderHide();
	chooseAddressFromSavedListHide();
	renderCustomerInfo();
}

function pickAddressForNewOrderHide(){
	document.getElementById("pickAddressForNewOrderModal").style.display = 'none';
}


/*Set Token No.*/
function setTokenManually(){

						    var requestData = {
						      "selector"  :{ 
						                    "identifierTag": "ACCELERATE_TOKEN_INDEX" 
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
						          if(data.docs[0].identifierTag == 'ACCELERATE_TOKEN_INDEX'){

						            var lastToken = parseInt(data.docs[0].value);

									if(!lastToken || lastToken == ''){
										lastToken = 1;
									}

									document.getElementById("next_token_value_set").value = lastToken;
									document.getElementById("setTokenOptionsModal").style.display = 'block';

									$("#next_token_value_set").focus();
    								$("#next_token_value_set").select();

						          }
						          else{
						            showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
						          }
						        }
						        else{
						          showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
						        }

						      },
						      error: function(data) {
						        showToast('System Error: Unable to read Token Index. Please contact Accelerate Support.', '#e74c3c');
						      }

						    });
}

function setTokenManuallyHide(){
	document.getElementById("setTokenOptionsModal").style.display = 'none';
}

function setTokenManuallySave(){


						    var requestData = {
						      "selector"  :{ 
						                    "identifierTag": "ACCELERATE_TOKEN_INDEX" 
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
						          if(data.docs[0].identifierTag == 'ACCELERATE_TOKEN_INDEX'){

									var token = document.getElementById("next_token_value_set").value;

									if(token == ''){
										token = 1;
									}

									token = parseInt(token);
									updateTokenCountOnServer(token+1, data.docs[0]._rev);

									window.localStorage.claimedTokenNumber = token;
									window.localStorage.claimedTokenNumberTimestamp = new Date();
									
									//After setting the Token
									var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
									
									if(jQuery.isEmptyObject(customerInfo)){
										customerInfo.name = "";
										customerInfo.mobile = "";
										customerInfo.count = "";
										customerInfo.mode = "";
										customerInfo.modeType = "";
										customerInfo.mappedAddress = "";
										customerInfo.reference = "";
										customerInfo.isOnline = false;
									}

									customerInfo.mappedAddress = token;

									window.localStorage.customerData = JSON.stringify(customerInfo);

									setTokenManuallyHide();
									renderCustomerInfo();

						          }
						          else{
						            showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
						          }
						        }
						        else{
						          showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
						        }

						      },
						      error: function(data) {
						        showToast('System Error: Unable to read Token Index. Please contact Accelerate Support.', '#e74c3c');
						      }

						    });

}

function restartTokenManuallySave(){

						    var requestData = {
						      "selector"  :{ 
						                    "identifierTag": "ACCELERATE_TOKEN_INDEX" 
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
						          if(data.docs[0].identifierTag == 'ACCELERATE_TOKEN_INDEX'){

											updateTokenCountOnServer(2, data.docs[0]._rev);

											window.localStorage.claimedTokenNumber = 1;
											window.localStorage.claimedTokenNumberTimestamp = new Date();
									
											//After setting the Token
											var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
											
											if(jQuery.isEmptyObject(customerInfo)){
												customerInfo.name = "";
												customerInfo.mobile = "";
												customerInfo.count = "";
												customerInfo.mode = "";
												customerInfo.modeType = "";
												customerInfo.mappedAddress = "";
												customerInfo.reference = "";
												customerInfo.isOnline = false;
											}

											customerInfo.mappedAddress = 1;

											setTokenManuallyHide();
											renderCustomerInfo();

						          }
						          else{
						            showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
						          }
						        }
						        else{
						          showToast('Not Found Error: Token Index data not found. Please contact Accelerate Support.', '#e74c3c');
						        }

						      },
						      error: function(data) {
						        showToast('System Error: Unable to read Token Index. Please contact Accelerate Support.', '#e74c3c');
						      }

						    });

}


/*Add item-wise comments*/
function addCommentToItem(cart_index){


	//Prevent if in editing mode and its a Prebilled order (delivery/takeaway)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){ //Editing Mode
		var calculableOriginalKOT = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
			
			if(window.localStorage.appOtherPreferences_orderEditingAllowed && window.localStorage.appOtherPreferences_orderEditingAllowed == 1){

			}
			else{
				if(calculableOriginalKOT.orderDetails.modeType == 'PARCEL' || calculableOriginalKOT.orderDetails.modeType == 'TOKEN' || calculableOriginalKOT.orderDetails.modeType == 'DELIVERY'){
					showToast('Warning: This order can not be edited. KOT already printed.', '#e67e22');
					return '';
				}
			}	


	}


	var text = document.getElementById("add_item_wise_comment").value;
	var cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];


		var n = 0;
		while(cart_products[n]){
			if(cart_products[n].cartIndex == cart_index){
				cart_products[n].comments = text;
				break;
			}
			n++;
		}	

	window.localStorage.accelerate_cart = JSON.stringify(cart_products);

	if(text != ''){
		showToast('Comment saved successfully', '#27ae60');
	}
	else{
		showToast('No Comments added', '#27ae60');
	}

	hideItemWiseCommentModal();
	renderCart();

	$("#add_item_by_search").focus();
}

function openItemWiseCommentModal(itemCode, variant, cart_index){

		var cart_products = window.localStorage.accelerate_cart ?  JSON.parse(window.localStorage.accelerate_cart) : [];
		var commentsAdded = false; 
		var variantTitle = '';
		var itemTitle = '';


			var n = 0;
			while(cart_products[n]){
				if(cart_products[n].cartIndex == cart_index){

					itemTitle = cart_products[n].name;
					if(cart_products[n].hasOwnProperty('comments')){
						document.getElementById("add_item_wise_comment").value = cart_products[n].comments;
					}
					else{
						document.getElementById("add_item_wise_comment").value = "";
					}
					
					break;
				}
				n++;
			}		

			if(variant != ''){
				variantTitle = ' ('+variant+')';
			}
		


		var suggestionsDataList = [];
		var modesTag = '';

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_SAVED_COMMENTS" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_COMMENTS'){

		            var modes = data.docs[0].value;
		            modes.sort(); //alphabetical sorting 

		            suggestionsDataList = modes;

					for (var i=0; i<modes.length; i++){
						modesTag = modesTag + '<button  style="margin: 0 5px 5px 0" class="btn btn-outline" onclick="addFromSuggestions(\''+modes[i]+'\')">'+modes[i]+'</button>';
	        		}

					if(!modesTag)
						document.getElementById("savedCommentsSuggestions").innerHTML = '';
					else
						document.getElementById("savedCommentsSuggestions").innerHTML = modesTag;

	          }
	          else{
	            showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });  




	    document.getElementById("itemWiseCommentsModal").style.display = 'block';
	    document.getElementById("itemWiseCommentsModalTitle").innerHTML = "Comments for <b>"+itemTitle+"</b>"+variantTitle;
	    document.getElementById("itemWiseCommentsModalActions").innerHTML = '<button  class="btn btn-default" onclick="hideItemWiseCommentModal()" style="float: left">Cancel</button>'+
               									'<button id="itemWiseCommentsModalActions_SAVE" type="button" class="btn btn-success" onclick="addCommentToItem('+cart_index+')" style="float: right">Save Comment</button>';


		  //Esc --> Hide

          /*
            Actions Tool - Modal
          */


          var easyActionsTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#itemWiseCommentsModal').is(':visible')) {

                  if(e.which == 27){ // Escape (Close)
                    document.getElementById("itemWiseCommentsModal").style.display ='none';
                    easyActionsTool.unbind();
                  }

            }
          });




				/*Select on Arrow Up/Down */
				var li = $('#commentSuggestionsRenderArea li');
				var liSelected = undefined;
				var duplicateClick = false;

				var firstClick = '';
				var firstClickTracked = false;
				var keypressCounter = 0;

				var easySelectionTool = $('#add_item_wise_comment').keyup(function(e) {

					if($('#itemWiseCommentsModal').is(':visible')) {
						
						keypressCounter++;
						
						if(firstClick == ''){
							firstClick = e.which;
						}

					    if (e.which === 40 || e.which === 38) {
					        /*
					        	Skip Search if the Up-Arrow or Down-Arrow
								is pressed inside the Search Input
					        */ 

						    if(e.which === 40){ 
						        if(liSelected){
						            liSelected.removeClass('selected');
						            next = liSelected.next();
						            if(next.length > 0){
						                liSelected = next.addClass('selected');
						            }else{
						                liSelected = li.eq(0).addClass('selected');
						            }
						        }else{
						            liSelected = li.eq(0).addClass('selected');
						        }
						    }else if(e.which === 38){

						    	/* TWEAK */
						    	$('#add_item_wise_comment').focus().val($('#add_item_wise_comment').val());


						        if(liSelected){
						            liSelected.removeClass('selected');
						            next = liSelected.prev();
						            if(next.length > 0){
						                liSelected = next.addClass('selected');
						            }else{
						                liSelected = li.last().addClass('selected');
						            }
						        }else{
						            liSelected = li.last().addClass('selected');
						        }
						    }


						    duplicateClick = false;
					    }
					    else if (e.which === 13) {
					        /*
					        	Add Item if the Enter Key
								is pressed inside the Search Input
					        */ 

					        //e.preventDefault();

					        $("#commentSuggestionsRenderArea li").each(function(){
						        if($(this).hasClass("selected")){
						        	$(this).click();
						        }
						    });

						    if(firstClick == 13 && !firstClickTracked){
						    	firstClickTracked = true;
						    	duplicateClick = false;
						    }
						    else{
							    if(duplicateClick){
							    	$('#itemWiseCommentsModalActions_SAVE').click();
							    	easySelectionTool.unbind();
							    }
							    else{
							    	duplicateClick = true;
							    }						    	
						    }


					    }
					    else if (e.which === 27) {
					        /*
					        	Close Window if the Escape Key
								is pressed inside the Search Input
					        */ 

					        hideItemWiseCommentModal();
					        easySelectionTool.unbind();

					    }
					    else{

					    	liSelected = undefined
					    	duplicateClick = false;

						    var searchField = $(this).val();
						    if (searchField === '') {
						        $('#commentSuggestionsRenderArea').html('');
						        return;
						    }

						    var name_regex = new RegExp("^"+ searchField, "i");
						   
						    var tabIndex = 1;
						    var itemsRenderList = '';
						    var itemsRenderAppendList = '';

						    $.each(suggestionsDataList, function(key_1, suggestionItem) {
						    	
									var suggestion_splits = suggestionItem.split(" ");
					    	 		var total_words = suggestion_splits.length;

					    	 		if(total_words == 1){
					    	 			if(suggestionItem.search(name_regex) != -1){
					    	 				tabIndex = -1;
								  			itemsRenderList += '<li class="ui-menu-item" onclick="addFromSuggestions(\''+suggestionItem+'\', \'SUGGESTION_LIST\'); " tabindex="'+tabIndex+'">'+suggestionItem+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 		}
					    	 		else{ //has more than one words

					    	 			//Starts with
					    	 			if(suggestionItem.search(name_regex) != -1){
											tabIndex = -1;
								  			itemsRenderList += '<li class="ui-menu-item" onclick="addFromSuggestions(\''+suggestionItem+'\', \'SUGGESTION_LIST\'); " tabindex="'+tabIndex+'">'+suggestionItem+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 			else{
						    	 			for(var n = 0; n < total_words; n++){
						    	 				if(suggestion_splits[n].search(name_regex) != -1){
							    	 				tabIndex = -1;
										  			itemsRenderAppendList += '<li class="ui-menu-item" onclick="addFromSuggestions(\''+suggestionItem+'\', \'SUGGESTION_LIST\'); " tabindex="'+tabIndex+'">'+suggestionItem+'</li>'
										            count++;
										            tabIndex++;

							    	 				break;
							    	 			}
						    	 			}
						    	 		}

					    	 		}

						    });

						    
						    if(itemsRenderList != '' || itemsRenderAppendList != '')
						    	$('#commentSuggestionsRenderArea').html('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_commentSuggestions">'+itemsRenderList+itemsRenderAppendList+'</ul>');
						    else
						    	$('#commentSuggestionsRenderArea').html('');


						    //Refresh dropdown list
						    li = $('#commentSuggestionsRenderArea li');
						}

					}//Modal visible
				});  


        $("#add_item_wise_comment").focus();
        $("#add_item_wise_comment").select();
}


function addFromSuggestions(suggestion, optionalSource){
	document.getElementById("add_item_wise_comment").value = suggestion;

	$('#add_item_wise_comment').focus().val($('#add_item_wise_comment').val());

	if(optionalSource == 'SUGGESTION_LIST'){
		$('#commentSuggestionsRenderArea').html('');
	}
}


function hideItemWiseCommentModal(){
	document.getElementById("itemWiseCommentsModal").style.display = 'none';
	$('#add_item_by_search').focus();
}


/* Special Request */

function openSpecialRequestModal(){

	var allergicIngredientsList = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData): [];


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

              var ingredientsList = data.docs[0].value;
              ingredientsList.sort(); //alphabetical sorting 
              var allergicTag = '';


	          	if(allergicIngredientsList.length > 0){ //there are already some allergic ingredients set
					for (var i=0; i<ingredientsList.length; i++){
						
						var n = 0;
						while(allergicIngredientsList[n]){
							if(allergicIngredientsList[n] == ingredientsList[i]){
								allergicTag = allergicTag + '<button  style="margin: 0 5px 5px 0" id="ing_'+ingredientsList[i].replace(/\s/g,'')+'" class="btn btn-outline ingredientButton activeIngredient" onclick="alterAllergicIngredientsList(\''+ingredientsList[i]+'\')"><tag class="activeIngredientButtonIcon"><i class="fa fa-ban"></i></tag>'+ingredientsList[i]+'</button>';
								break;
							}

							if(n == allergicIngredientsList.length-1){ //last iteration
								allergicTag = allergicTag + '<button  style="margin: 0 5px 5px 0" id="ing_'+ingredientsList[i].replace(/\s/g,'')+'" class="btn btn-outline ingredientButton" onclick="alterAllergicIngredientsList(\''+ingredientsList[i]+'\')"><tag class="activeIngredientButtonIcon"><i class="fa fa-ban"></i></tag>'+ingredientsList[i]+'</button>';
							}

							n++;
						}
	        		}
	        	}
	        	else{ 
					for (var i=0; i<ingredientsList.length; i++){
						allergicTag = allergicTag + '<button  style="margin: 0 5px 5px 0" id="ing_'+ingredientsList[i].replace(/\s/g,'')+'"  class="btn btn-outline ingredientButton" onclick="alterAllergicIngredientsList(\''+ingredientsList[i]+'\')"><tag class="activeIngredientButtonIcon"><i class="fa fa-ban"></i></tag>'+ingredientsList[i]+'</button>';
	        		}
	        	}
        		
				if(!allergicTag){
					document.getElementById("specialRequestsAllergicSuggestions").innerHTML = '<tag style="font-style: italic; font-size: 12px; color: #f76850;">Suggestions not Available! Cooking Ingredients list is not updated.</tag>';
				}
				else{
					document.getElementById("specialRequestsAllergicSuggestions").innerHTML = allergicTag;
				}

          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  


	document.getElementById("specialRequestsModal").style.display = 'block';
	document.getElementById("specialRequestsModalActions").innerHTML = ''+
		'<button  class="btn btn-danger" onclick="clearSpecialRequestModal()" style="float: left">Clear</button>'+
        '<button id="specialRequestCommentsModalActions_SAVE" type="button" class="btn btn-success" onclick="saveSpecialRequest()" style="float: right">Set and Proceed</button>';	

	if(window.localStorage.specialRequests_comments && window.localStorage.specialRequests_comments != ''){
		$('#specialRequests_comments').val(window.localStorage.specialRequests_comments);
		$('#specialRequests_comments').focus();
		$('#specialRequests_comments').select();
	}
	else{
		$('#specialRequests_comments').focus();
	}

    
    //Enter to Save, Escape to Hide
    var duplicateClick = false;
    var easyActionsTool = $('#specialRequests_comments').keyup(function(e) {
    	if($('#specialRequestsModal').is(':visible')) {
			if (e.which === 13) {
				if(duplicateClick){
					$('#specialRequestCommentsModalActions_SAVE').click();
					easyActionsTool.unbind();
				}
				else{
					duplicateClick = true;
				}
			}
			else if(e.which === 27){ // Escape (Close)
                    document.getElementById("specialRequestsModal").style.display ='none';
                    easyActionsTool.unbind();
            }
        }
    });

}

function hideSpecialRequestModal(){
	document.getElementById("specialRequestsModal").style.display = 'none';
}

function clearSpecialRequestModal(){
	document.getElementById("specialRequestsModal").style.display = 'none';
	window.localStorage.specialRequests_comments = '';
	window.localStorage.allergicIngredientsData = '[]';
	renderCustomerInfo();
}

function saveSpecialRequest(){
	var comments = document.getElementById("specialRequests_comments").value;
	if(comments && comments!= ''){
		window.localStorage.specialRequests_comments = comments;
	}	
	else{
		window.localStorage.specialRequests_comments = '';
	}

	hideSpecialRequestModal();
	renderCustomerInfo();
}

function alterAllergicIngredientsList(ingredientName){

	$('#specialRequests_comments').focus();

	var allergicIngredientsList = window.localStorage.allergicIngredientsData ? JSON.parse(window.localStorage.allergicIngredientsData): [];
	
	if(allergicIngredientsList.length == 0){
		allergicIngredientsList.push(ingredientName); //Add it
		var className = ingredientName.replace(/\s/g,'');
		$('#ing_'+className).addClass('activeIngredient');
		window.localStorage.allergicIngredientsData = JSON.stringify(allergicIngredientsList);
		return '';
	}

	var n = 0;
	while(allergicIngredientsList[n]){

		if(allergicIngredientsList[n] == ingredientName){
			//Already present --> Remove it
			allergicIngredientsList.splice(n,1);
			window.localStorage.allergicIngredientsData = JSON.stringify(allergicIngredientsList);

			var className = ingredientName.replace(/\s/g,'');
			$('#ing_'+className).removeClass('activeIngredient');

			break;
		}

		if(n == allergicIngredientsList.length-1){ //last iteration
			//Not present --> Add it 
			allergicIngredientsList.push(ingredientName);
			var className = ingredientName.replace(/\s/g,'');
			$('#ing_'+className).addClass('activeIngredient');

			window.localStorage.allergicIngredientsData = JSON.stringify(allergicIngredientsList);
			break;
		}

		n++;
	}	


}




function initOrderPunch(){
		//Focus on to "Add item"
		$("#add_item_by_search").focus();

		/*Remove suggestions if focus out*/ /*TWEAK*/
		$("#add_item_by_search").focusout(function(){
			setTimeout(function(){ 
				$('#searchResultsRenderArea').html('');
			}, 300);	 /*delay added for the focusout to understand if modal is opened*/
		});
}



/*Auto Suggetion - MENU*/
function initMenuSuggestion(){

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

	          	//Process whole menu (list of only Menu Items)
	          	var menu_processed = [];
	          	$.each(mastermenu, function(key_1, subMenu) {
					$.each(subMenu.items, function(key_2, items) {
						items.category = subMenu.category;
						menu_processed.push(items);
					});
				});


				/*Select on Arrow Up/Down */
				var li = $('#searchResultsRenderArea li');
				var liSelected = undefined;

				$('#add_item_by_search').keyup(function(e) {

					if($('#customOptionsList').is(':visible')){ // **TWEAK**
						//Do not navigate when the custom item choose modal is shown
						return '';
					}


				    if (e.which === 40 || e.which === 38 || e.which === 18) {
				        /*
				        	Skip Search if the Up-Arrow or Down-Arrow
							is pressed inside the Search Input.

							Add comment to last item, if ALT pressed.
				        */ 

					    if(e.which === 40){ 
					        if(liSelected){
					            liSelected.removeClass('selected');
					            next = liSelected.next();
					            if(next.length > 0){
					                liSelected = next.addClass('selected');
					            }else{
					                liSelected = li.eq(0).addClass('selected');
					            }
					        }else{
					            liSelected = li.eq(0).addClass('selected');
					        }
					    }else if(e.which === 38){

					    	/* TWEAK */
					    	$('#add_item_by_search').focus().val($('#add_item_by_search').val());


					        if(liSelected){
					            liSelected.removeClass('selected');
					            next = liSelected.prev();
					            if(next.length > 0){
					                liSelected = next.addClass('selected');
					            }else{
					                liSelected = li.last().addClass('selected');
					            }
					        }else{
					            liSelected = li.last().addClass('selected');
					        }
					    }
					    else if(e.which === 18){

							//UX Improvements
							//add comment to last added item
							var iteration_count = 0;
							$("#cartDetails .itemCommentButton").each(function(){

								if(iteration_count == 0){
									$(this).click();
								}

								iteration_count++;
							});							    	
					    }


				    }
				    else if (e.which === 13) {

				        /*
				        	Add Item if the Enter Key
							is pressed inside the Search Input
				        */ 

				        $("#searchResultsRenderArea li").each(function(){
					        if($(this).hasClass("selected")){
					        	$(this).click();
					        }
					    });

				    }
				    else{

				    	liSelected = undefined

					    var searchField = $(this).val();
					    if (searchField === '') {
					        $('#searchResultsRenderArea').html('');
					        return;
					    }

					    var regex = new RegExp(searchField, "i");
					    var name_regex = new RegExp("^" + searchField, "i");

					    var count = 0;
					    var tabIndex = 1;
					    var itemsList = '';
					    var itemsAppendList = '';

					    $.each(menu_processed, function(key_2, items) {

					    		if(!items.shortCode){
					    			items.shortCode = '';
					    		}

					    		items.itemCode = items.code.toString();

								if(items.itemCode.search(name_regex) != -1){
					    	 		tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="additemtocart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.code+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
					    	 	}
					    	 	else if(items.shortCode.search(name_regex) != -1){
					    	 		tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="additemtocart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.code+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
					    	 	}
					    	 	else{

					    	 			var item_name = items.name;

					    	 			if(item_name.search(name_regex) != -1){
					    	 				tabIndex = -1;
								  			itemsList += '<li class="ui-menu-item" onclick="additemtocart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.code+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 			else if(item_name.search(regex) != -1){

					    	 				tabIndex = -1;
								  			itemsAppendList += '<li class="ui-menu-item" onclick="additemtocart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.code+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 	}
					    });


						//Render the list
						var isSomeItemsFound = false; 
					    if(itemsList != '' || itemsAppendList != ''){
					    	isSomeItemsFound = true;
					    	$('#searchResultsRenderArea').html('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_itemSuggestions">'+itemsList+itemsAppendList+'</ul>');
					    }
					    else{

						  // LOGGED IN USER INFO
						  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
						        
						  if(jQuery.isEmptyObject(loggedInStaffInfo)){
						    loggedInStaffInfo.name = "";
						    loggedInStaffInfo.code = "";
						    loggedInStaffInfo.role = "";
						  }

						  //either profile not chosen, or not an admin
						  var isUserAnAdmin = false
						  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
						    isUserAnAdmin = true;
						  }


					    	var temp_item = $('#add_item_by_search').val();

					    	var customAdditionContent = '';
					    	if(isUserAnAdmin){
					    		customAdditionContent = '<li class="ui-menu-item" onclick="addSpecialCustomItem(\''+temp_item+'\')" tabindex="'+tabIndex+'"><i class="fa fa-plus-circle" style="color: #18ca8b"></i> <i>add</i> <b style="font-size: 120%">'+temp_item+'</b></li>';
					    	}

					    	var custom_template = 	'<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_itemSuggestions">'+
					    								'<span style="display: inline-block; padding: 8px 0 4px 8px; font-size: 12px; text-align: center; color: #c6c6c6; font-style: italic">No matching items found.</span>'+ customAdditionContent +
										    	   	'</ul>';
					    	
					    	$('#searchResultsRenderArea').html(custom_template);
					    }

					    if(isSomeItemsFound){
					    	var track_index = 0;
					    	$("#searchResultsRenderArea li").each(function(){

					    		if(track_index == 0){
					    			$(this).addClass("selected");
					    		}

					    		track_index++;
						    });
					    }

					    //Refresh dropdown list
					    li = $('#searchResultsRenderArea li');
					    if(isSomeItemsFound){
					    	liSelected = li.eq(0).addClass('selected');
					    }

					}
				});   
          }
        }
      }

    });
}



/* Shift Item Wizard */
function openShiftItemWizard(source_table, current_kot, billing_mode, encoded_item){

	var item = JSON.parse(decodeURI(encoded_item));

	document.getElementById("shiftItemWizardModal").style.display = 'block';
	document.getElementById("shiftItemWizardText").innerHTML = "Shift <b>"+item.name+ (item.isCustom ? ' ('+item.variant+')' : '') +"</b>";

	document.getElementById("shiftItemWizard_quantity").value = item.qty;
	document.getElementById("shiftItemWizard_target").value = (source_table == 1 ? 2 : 1);	
	document.getElementById("shiftItemWizard_source").value = source_table;

	document.getElementById("shiftItemWizardModalConsent").innerHTML = ''+
						'<button class="btn btn-default" onclick="shiftItemWizardModalHide()" style="float: left">Close</button>'+
               			'<button class="btn btn-success" onclick="proceedShiftItem(\''+source_table+'\', \''+current_kot+'\', \''+billing_mode+'\', \''+encoded_item+'\')" style="float: right">Shift Item</button>'

	$('#shiftItemWizard_quantity').select();
}

function shiftItemWizardModalHide(){
	document.getElementById("shiftItemWizardModal").style.display = 'none';
}

function proceedShiftItem(source_table, current_kot, billing_mode, encoded_item){


  // LOGGED IN USER INFO
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }
 else{
  	showToast('No Permission: Only an Admin can <b>shift items</b>.', '#e67e22');
  	shiftItemWizardModalHide();
  	return '';
  }




	var item = JSON.parse(decodeURI(encoded_item));
	var outgoing_item = item;
	
	var target_table = document.getElementById("shiftItemWizard_target").value;
	if(target_table == ""){
		showToast('Warning! Please enter a New Table to which item has to be transfered.', '#e67e22');
		$('#shiftItemWizard_target').select();
		return "";
	}
	if(target_table == source_table){
		showToast('Warning! Item cannot be transfered to same table!', '#e67e22');
		$('#shiftItemWizard_target').select();
		return "";
	}

	var target_quantity = document.getElementById("shiftItemWizard_quantity").value;
	if(target_quantity == ""){
		showToast('Warning! Please enter quantity of items to be transfered.', '#e67e22');
		$('#shiftItemWizard_quantity').select();
		return "";
	}
	if(target_quantity > item.qty){
		showToast('Warning! Quantity has to be less than '+item.qty, '#e67e22');
		$('#shiftItemWizard_quantity').select();
		return "";
	}
	if(target_quantity < 1){
		showToast('Warning! Transfer atleast 1 quantity.', '#e67e22');
		$('#shiftItemWizard_quantity').select();
		return "";
	}



	//Check if target table is free:

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+target_table+'"]&endkey=["'+target_table+'"]',
      timeout: 10000,
      success: function(data) {
        if(data.rows.length == 1){

              var tableData = data.rows[0].value;

              if(tableData.table == target_table){

		          			//target table is free
		          			if(tableData.status == 0){
		          				if($('#shiftItemWizardModal').is(':visible')) { //to prevent double entry
		          					placeNewOrder(target_table, billing_mode, encoded_item);
		          				}
		          				shiftItemWizardModalHide();
		          			}

		          			//table contains running order
		          			if(tableData.status == 1){
		          				if($('#shiftItemWizardModal').is(':visible')) { //to prevent double entry
		          					appendNewItem(target_table, billing_mode, encoded_item, tableData.KOT);
		          				}
		          				shiftItemWizardModalHide();
		          			}

		          			if(tableData.status == 2){
		          				showToast('Warning! Table #'+target_table+' is already billed. Item can not be transfered to this table.', '#e67e22');
								$('#shiftItemWizard_target').select();
								return "";
		          			}

		          			if(tableData.status == 5){
		          				showToast('Warning! Table #'+target_table+' is Reserved. Item can not be transfered to this table.', '#e67e22');
								$('#shiftItemWizard_target').select();
								return "";
		          			}

              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });


	//to place new order with this item on new table
    function placeNewOrder(table_number, billing_mode, encoded_item){

    	var transfer_item = JSON.parse(decodeURI(encoded_item));
    	target_quantity = parseInt(target_quantity);
    	transfer_item.qty = target_quantity;
    	transfer_item.cartIndex = 1;

		var cart_products = [];
		cart_products.push(transfer_item);

		var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
		
		var selectedBillingModeName = billing_mode;
		var selectedBillingModeInfo = '';
		
		var n = 0;
		while(billing_modes[n]){
			if(billing_modes[n].name == selectedBillingModeName){
				selectedBillingModeInfo = billing_modes[n];
				break;
			}
			n++;
		}



	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

		          	var params = data.docs[0].value;

		          	var selectedModeExtrasList = selectedBillingModeInfo.extras;
		          	var cartExtrasList = [];

		          	if(selectedModeExtrasList == undefined){
		          		showToast("Something went wrong. Try again.", '#e74c3c');
		          	}

		          	var n = 0;
		          	var m = 0;
		          	while(selectedModeExtrasList[n]){
		          		m = 0;
		          		while(params[m]){	  
		          			if(selectedModeExtrasList[n].name == params[m].name){  
		          				params[m].value = parseFloat(selectedModeExtrasList[n].value);    			
		          				cartExtrasList.push(params[m]);
		          			}
		          			
		          			m++;
		          		}
		          		n++;
		          	}
		          	
		          	generateKOTSilently(cart_products, selectedBillingModeInfo, cartExtrasList)	

	          }
	          else{
	            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });

    }	


	function generateKOTSilently(cart_products, selectedBillingModeInfo, selectedModeExtras){
			
			/*Process Figures*/
			var subTotal = 0;
			var packagedSubTotal = 0;

			var n = 0;
			while(cart_products[n]){
				subTotal = subTotal + cart_products[n].qty * cart_products[n].price;

				if(cart_products[n].isPackaged){
					packagedSubTotal = packagedSubTotal + cart_products[n].qty * cart_products[n].price;
				}

				n++;
			}

			  /*Calculate Taxes and Other Charges*/ 

			  //Note: Skip tax and other extras (with isCompulsary no) on packaged food Pepsi ect. (marked with 'isPackaged' = true)

	          var otherCharges = [];        
	          var k = 0;

	          if(selectedModeExtras.length > 0){
	          	for(k = 0; k < selectedModeExtras.length; k++){

	          		var tempExtraTotal = 0;

	          		if(selectedModeExtras[k].value != 0){
	          			if(selectedModeExtras[k].excludePackagedFoods){
			          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = (selectedModeExtras[k].value * (subTotal-packagedSubTotal))/100;
			          			}
			          			else if(selectedModeExtras[k].unit == 'FIXED'){
			          				tempExtraTotal = selectedModeExtras[k].value;
			          			}          				
	          			}
	          			else{
			          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = selectedModeExtras[k].value * subTotal/100;
			          			}
			          			else if(selectedModeExtras[k].unit == 'FIXED'){
			          				tempExtraTotal = selectedModeExtras[k].value;
			          			}                 				
	          			}


	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		otherCharges.push({
				 		"name": selectedModeExtras[k].name,
						"value": selectedModeExtras[k].value,
						"unit": selectedModeExtras[k].unit,
						"amount": tempExtraTotal,
						"isPackagedExcluded": selectedModeExtras[k].excludePackagedFoods
	          		})
	          	}
	          }

		  // LOGGED IN USER INFO

		  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
		        
		  if(jQuery.isEmptyObject(loggedInStaffInfo)){
		    loggedInStaffInfo.name = "";
		    loggedInStaffInfo.code = "";
		    loggedInStaffInfo.role = "";
		  }


		var spremarks = '';

		var orderMetaInfo = {};
		orderMetaInfo.mode = billing_mode;
		orderMetaInfo.modeType = 'DINE';
		orderMetaInfo.reference = "";
		orderMetaInfo.isOnline = false;
	   
	    //Check for KOT index on Server
	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_KOT_INDEX" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_INDEX'){

		          var num = parseInt(data.docs[0].value) + 1;
		          var kot = 'K' + num;
		          var memory_revID = data.docs[0]._rev;
		         
		          	updateKOTIndexOnServer(num, memory_revID)

	          	  	function updateKOTIndexOnServer(num, updateRevID){

                    	  //Update KOT number on server
                          var updateData = {
                            "_rev": updateRevID,
                            "identifierTag": "ACCELERATE_KOT_INDEX",
                            "value": num
                          }

                          $.ajax({
                            type: 'PUT',
                            url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_KOT_INDEX/',
                            data: JSON.stringify(updateData),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: 10000,
                            success: function(data) {
                              
                            },
                            error: function(data) {
                              showToast('System Error: Unable to update KOT Index. Next KOT Number might be faulty. Please contact Accelerate Support.', '#e74c3c');
                            }
                          });
	          		}



		          var today = getCurrentTime('DATE');
		          var time = getCurrentTime('TIME');

		          var specialRemarksInfo = '';
		          var allergyData = [];

		          var obj = {}; 
		          obj.KOTNumber = kot;
		          obj.orderDetails = orderMetaInfo;
		          obj.table = target_table;

		          obj.customerName = "";
		          obj.customerMobile = ""; 
		          obj.guestCount = 0;

		          obj.machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
		          
		          var sessionInfo = window.localStorage.setSessionData ? JSON.parse(window.localStorage.setSessionData) : {};
		          obj.sessionName = sessionInfo.name ? sessionInfo.name : '';

		          obj.stewardName = loggedInStaffInfo.name;
		          obj.stewardCode = loggedInStaffInfo.code;

		          obj.date = today;
		          obj.timePunch = time;
		          obj.timeKOT = time;
		          obj.timeBill = "";
		          obj.timeSettle = "";

		          obj.cart = cart_products;
		          obj.specialRemarks = specialRemarksInfo;
		          obj.allergyInfo = allergyData;

		          obj.extras = otherCharges;
		          obj.discount = {};
		          obj.customExtras = {};

		        
		          //Set _id from Branch mentioned in Licence
		          var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
		          if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
		          	showToast('Invalid Licence Error: KOT can not be generated. Please contact Accelerate Support if problem persists.', '#e74c3c');
		          	return '';
		          }

		          obj._id = accelerate_licencee_branch+'_KOT_'+kot;
		        
		          var remember_obj = '';

		          //Post to local Server
		          $.ajax({
		            type: 'POST',
		            url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/',
		            data: JSON.stringify(obj),
		            contentType: "application/json",
		            dataType: 'json',
		            timeout: 10000,
		            success: function(data) {
		              if(data.ok){
		              		if(obj.orderDetails.modeType == 'DINE'){
		              		  addToTableMapping(target_table, kot, "", "", 'ORDER_PUNCHING');
		              		}

		              		updateSourceKOT();
		              }
		              else{
		                showToast('Warning: New KOT was not Modified. Try again.', '#e67e22');
		              }
		            },
		            error: function(data){           
		              showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
		            }
		          });  
				  //End - post KOT to Server

		          
	          }
	          else{
	            showToast('Not Found Error: KOT Index data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: KOT Index data not found. Please contact Accelerate Support.', '#e74c3c');
	        }

	      },
	      error: function(data) {
	        showToast('System Error: Unable to read KOT Index. Please contact Accelerate Support.', '#e74c3c');
	      }
	    });
	}




    //to append this item to existing order   
	function appendNewItem(table_number, billing_mode, encoded_item, running_KOTNumber){
		
		/*
			to generate edited KOT silently
		*/

    	var incoming_item = JSON.parse(decodeURI(encoded_item));
    	target_quantity = parseInt(target_quantity);
    	incoming_item.qty = target_quantity;


	    //Set _id from Branch mentioned in Licence
	    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
	    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
	      showToast('Invalid Licence Error: KOT can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
	      return '';
	    }

	    var kot_request_data = accelerate_licencee_branch +"_KOT_"+ running_KOTNumber;

	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+kot_request_data,
	      timeout: 10000,
	      success: function(data) {
	        if(data._id == kot_request_data){
	          
	          var kot = data;

	          //Exit if billing modes are not matching
	          if(kot.orderDetails.mode != billing_mode){
					showToast('Warning! The order on Table #'+target_table+' was punched on different Billing Mode', '#e67e22');
					$('#shiftItemWizard_target').select();
					return "";
	          }

	          //Updates the Cart
	          var existing_cart = kot.cart;

	          	//Check if this incoming item already added
	          	var i = 0;
				var maxCartIndex = 0;

				while(i < existing_cart.length){
		          if(maxCartIndex <= existing_cart[i].cartIndex){
					    maxCartIndex = existing_cart[i].cartIndex;
		          }

		          i++;
		        }

		        incoming_item.cartIndex = maxCartIndex + 1;
		        existing_cart.push(incoming_item);

		        //update the cart
	           	kot.cart = existing_cart;


				/* RECALCULATE New Figures*/
				var subTotal = 0;
				var packagedSubTotal = 0;

				var n = 0;
				while(kot.cart[n]){
					subTotal = subTotal + kot.cart[n].qty * kot.cart[n].price;

					if(kot.cart[n].isPackaged){
						packagedSubTotal += kot.cart[n].qty * kot.cart[n].price;
					}

					n++;
				}

				/*Calculate Taxes and Other Charges*/
		        var k = 0;
		        if(kot.extras.length > 0){
		          	for(k = 0; k < kot.extras.length; k++){

		          		var tempExtraTotal = 0;

		          		if(kot.extras[k].isPackagedExcluded){
				          		if(kot.extras[k].value != 0){
				          			if(kot.extras[k].unit == 'PERCENTAGE'){
				          				tempExtraTotal = (kot.extras[k].value * (subTotal - packagedSubTotal))/100;
				          			}
				          			else if(kot.extras[k].unit == 'FIXED'){
				          				tempExtraTotal = kot.extras[k].value;
				          			}
				          		}
				        }
				        else{
				          		if(kot.extras[k].value != 0){
				          			if(kot.extras[k].unit == 'PERCENTAGE'){
				          				tempExtraTotal = kot.extras[k].value * subTotal/100;
				          			}
				          			else if(kot.extras[k].unit == 'FIXED'){
				          				tempExtraTotal = kot.extras[k].value;
				          			}
				          		}			        	
				        }


		          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

		          		kot.extras[k] = {
					 		"name": kot.extras[k].name,
							"value": kot.extras[k].value,
							"unit": kot.extras[k].unit,
							"amount": tempExtraTotal,
							"isPackagedExcluded": kot.extras[k].isPackagedExcluded
		          		};
		          	}
		        }

		        /*Calculate Discounts if Any*/     
		        if(kot.discount){
		          		var tempExtraTotal = 0;
		          		if(kot.discount.value != 0){
		          			if(kot.discount.unit == 'PERCENTAGE'){
		          				tempExtraTotal = kot.discount.value * subTotal/100;
		          			}
		          			else if(kot.discount.unit == 'FIXED'){
		          				tempExtraTotal = kot.discount.value;
		          			}
		          		}

		          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

		          		kot.discount.amount = tempExtraTotal;
		        }


		        /*Calculate Custom Extras if Any*/     
		        if(kot.customExtras){
		          		var tempExtraTotal = 0;
		          		if(kot.customExtras.value != 0){
		          			if(kot.customExtras.unit == 'PERCENTAGE'){
		          				tempExtraTotal = kot.customExtras.value * subTotal/100;
		          			}
		          			else if(kot.customExtras.unit == 'FIXED'){
		          				tempExtraTotal = kot.customExtras.value;
		          			}
		          		}

		          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

		          		kot.customExtras.amount = tempExtraTotal;
		        }


	          	  	//Update on Server
	                $.ajax({
	                  type: 'PUT',
	                  url: COMMON_LOCAL_SERVER_IP+'accelerate_kot/'+(kot._id)+'/',
	                  data: JSON.stringify(kot),
	                  contentType: "application/json",
	                  dataType: 'json',
	                  timeout: 10000,
	                  success: function(data) {
	                  	  updateSourceKOT();  
	                  },
	                  error: function(data) {
	                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
	                  }
	                });         

	        }
	        else{
	          showToast('Not Found Error: #'+running_KOTNumber+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
	        }
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
	      }
	    }); 
	}


	//Finally make changes in the source KOT
	function updateSourceKOT(){

	    //Set _id from Branch mentioned in Licence
	    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
	    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
	      showToast('Invalid Licence Error: KOT can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
	      return '';
	    }

	    var kot_request_data = accelerate_licencee_branch +"_KOT_"+ current_kot;

	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+kot_request_data,
	      timeout: 10000,
	      success: function(data) {
	        if(data._id == kot_request_data){
	          
	          var kot = data;
	          var remember_id = kot._id;
	          var remember_rev = kot._rev;
	          var remember_table = kot.table;

	          //Updates the Cart
	          var existing_cart = kot.cart;

	          var allQuantityTransfered = false;
	          var new_changed_quantity = 0;
	          if(outgoing_item.qty == target_quantity){
	          	allQuantityTransfered = true; // meaning remove it from cart.
	          }
	          else{
	          	new_changed_quantity = parseInt(outgoing_item.qty) - parseInt(target_quantity);
	          }

	          var i = 0;
			  while(i < existing_cart.length){
			  	
			  	if(existing_cart[i].code == outgoing_item.code){
			  		if(existing_cart[i].isCustom && outgoing_item.isCustom){
			  			if(existing_cart[i].variant == outgoing_item.variant){

			  							if(new_changed_quantity > 0){
											existing_cart[i].qty = new_changed_quantity;
										}
										else{
											existing_cart.splice(i,1);
										}

										break;
			  			}
			  		}
			  		else{
			  							if(new_changed_quantity > 0){
											existing_cart[i].qty = new_changed_quantity;
										}
										else{
											existing_cart.splice(i,1);
										}

										break;
			  		}
			  	}

			  	i++;
			  }


			  	if(existing_cart.length == 0){
			  		//Cart got empty --> Delete KOT!
			  		removeEmptyKOT(remember_id, remember_rev, remember_table);
			  		return "";
			  	}


		        //update the cart
	           	kot.cart = existing_cart;


				/* RECALCULATE New Figures*/
				var subTotal = 0;
				var packagedSubTotal = 0;

				var n = 0;
				while(kot.cart[n]){
					subTotal = subTotal + kot.cart[n].qty * kot.cart[n].price;

					if(kot.cart[n].isPackaged){
						packagedSubTotal += kot.cart[n].qty * kot.cart[n].price;
					}

					n++;
				}

				/*Calculate Taxes and Other Charges*/
		        var k = 0;
		        if(kot.extras.length > 0){
		          	for(k = 0; k < kot.extras.length; k++){

		          		var tempExtraTotal = 0;

		          		if(kot.extras[k].isPackagedExcluded){
				          		if(kot.extras[k].value != 0){
				          			if(kot.extras[k].unit == 'PERCENTAGE'){
				          				tempExtraTotal = (kot.extras[k].value * (subTotal - packagedSubTotal))/100;
				          			}
				          			else if(kot.extras[k].unit == 'FIXED'){
				          				tempExtraTotal = kot.extras[k].value;
				          			}
				          		}
				        }
				        else{
				          		if(kot.extras[k].value != 0){
				          			if(kot.extras[k].unit == 'PERCENTAGE'){
				          				tempExtraTotal = kot.extras[k].value * subTotal/100;
				          			}
				          			else if(kot.extras[k].unit == 'FIXED'){
				          				tempExtraTotal = kot.extras[k].value;
				          			}
				          		}			        	
				        }


		          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

		          		kot.extras[k] = {
					 		"name": kot.extras[k].name,
							"value": kot.extras[k].value,
							"unit": kot.extras[k].unit,
							"amount": tempExtraTotal,
							"isPackagedExcluded": kot.extras[k].isPackagedExcluded
		          		};
		          	}
		        }

		        /*Calculate Discounts if Any*/     
		        if(kot.discount){
		          		var tempExtraTotal = 0;
		          		if(kot.discount.value != 0){
		          			if(kot.discount.unit == 'PERCENTAGE'){
		          				tempExtraTotal = kot.discount.value * subTotal/100;
		          			}
		          			else if(kot.discount.unit == 'FIXED'){
		          				tempExtraTotal = kot.discount.value;
		          			}
		          		}

		          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

		          		kot.discount.amount = tempExtraTotal;
		        }


		        /*Calculate Custom Extras if Any*/     
		        if(kot.customExtras){
		          		var tempExtraTotal = 0;
		          		if(kot.customExtras.value != 0){
		          			if(kot.customExtras.unit == 'PERCENTAGE'){
		          				tempExtraTotal = kot.customExtras.value * subTotal/100;
		          			}
		          			else if(kot.customExtras.unit == 'FIXED'){
		          				tempExtraTotal = kot.customExtras.value;
		          			}
		          		}

		          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

		          		kot.customExtras.amount = tempExtraTotal;
		        }


	          	  	//Update on Server
	                $.ajax({
	                  type: 'PUT',
	                  url: COMMON_LOCAL_SERVER_IP+'accelerate_kot/'+(kot._id)+'/',
	                  data: JSON.stringify(kot),
	                  contentType: "application/json",
	                  dataType: 'json',
	                  timeout: 10000,
	                  success: function(data) {
	                  	  shiftingCompleted();  
	                  },
	                  error: function(data) {
	                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
	                  }
	                });         

	        }
	        else{
	          showToast('Not Found Error: #'+running_KOTNumber+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
	        }
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
	      }
	    }); 
	}

	function removeEmptyKOT(id, revID, tableNumber){

	    $.ajax({
	      type: 'DELETE',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/'+id+'?rev='+revID,
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {


	      		//Free Table
			    $.ajax({
			      type: 'GET',
			      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+tableNumber+'"]&endkey=["'+tableNumber+'"]',
			      timeout: 10000,
			      success: function(data) {
			        if(data.rows.length == 1){

			              var tableData = data.rows[0].value;

			              var remember_id = null;
			              var remember_rev = null;

			              if(tableData.table == tableNumber){

			                remember_id = tableData._id;
			                remember_rev = tableData._rev;

			                tableData.assigned = "";
			                tableData.remarks = "";
			                tableData.KOT = "";
			                tableData.status = 0;
			                tableData.lastUpdate = "";   
			                tableData.guestName = ""; 
			                tableData.guestContact = ""; 
			                tableData.reservationMapping = ""; 
			                tableData.guestCount = ""; 

			                //appendToLog(tableNumber+' : Removing Empty KOT mapping after shifting all items');            


			                    //Update
			                    $.ajax({
			                      type: 'PUT',
			                      url: COMMON_LOCAL_SERVER_IP+'accelerate_tables/'+remember_id+'/',
			                      data: JSON.stringify(tableData),
			                      contentType: "application/json",
			                      dataType: 'json',
			                      timeout: 10000,
			                      success: function(data) {
			                        shiftingCompleted();
			                      },
			                      error: function(data) {
			                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
			                      }
			                    });   

			              }
			              else{
			                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
			              }
			        }
			        else{
			          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
			        }

			      },
			      error: function(data) {
			        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
			      }

			    }); //end of freeing table     	
	        
	      },
	      error: function(data) {
	        showToast('Server Warning: Unable to modify Order KOT. Please contact Accelerate Support.', '#e67e22');
	      }
	    }); 		
	}

	function shiftingCompleted(){

		var item_nice_name = outgoing_item.name + (outgoing_item.isCustom ? ' ('+outgoing_item.variant+')' : '');

		shiftItemWizardModalHide();
		showToast('<b>'+item_nice_name+'</b> has been shifted successfully to Table #<b>'+target_table+'</b>', '#27ae60');
		
		clearCurrentEditingOrder();
		renderPage('new-order', 'Punch Order');
	}


}



