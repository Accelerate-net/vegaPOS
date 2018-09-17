	
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
function saveToCart(productToAdd){

		var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];

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
      		cart_products.push({"name": productToAdd.name, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "isPackaged": productToAdd.isPackaged, "variant": productToAdd.variant, "code": productToAdd.code, "ingredients": productToAdd.ingredients ? productToAdd.ingredients : "", "qty": 1});
      }

	  window.localStorage.zaitoon_cart = JSON.stringify(cart_products)
}

function additemtocart(encodedItem, optionalSource){

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
		//Pop up
		
		var i = 0;
		var optionList = '';
		while(productToAdd.customOptions[i]){
			optionList = optionList + '<li class="easySelectTool_customItem" onclick="addCustomToCart(\''+productToAdd.name+'\', \''+productToAdd.code+'\', \''+productToAdd.customOptions[i].customPrice+'\', \''+productToAdd.customOptions[i].customName+'\', \'SUGGESTION\', \''+(productToAdd.ingredients ? encodeURI(JSON.stringify(productToAdd.ingredients)) : '')+'\')">'+
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
	else if(!productToAdd.isCustom){
		saveToCart(productToAdd)
		renderCart()

		if(optionalSource == 'SUGGESTION'){
			$('#searchResultsRenderArea').html('');
			document.getElementById("add_item_by_search").value = '';
		}
	}	

	$("#add_item_by_search").focus();
}

function addCustomToCart(name, code, price, variant, optionalSource, encodedIngredients){

		var ingredientsTemp = encodedIngredients && encodedIngredients != '' ? JSON.parse(decodeURI(encodedIngredients)) : '';

		var productToAdd = {};
		productToAdd.name = name;
		productToAdd.code = code;
		productToAdd.price = price;
		productToAdd.variant = variant;
		productToAdd.isCustom = true;
		productToAdd.ingredients = ingredientsTemp;

		saveToCart(productToAdd)
		document.getElementById("customiseItemModal").style.display ='none'
		renderCart()

		if(optionalSource == 'SUGGESTION'){
			$('#searchResultsRenderArea').html('');
			document.getElementById("add_item_by_search").value = '';
		}

		$("#add_item_by_search").focus();		
}

function hideCustomiseItem(){
	document.getElementById("customiseItemModal").style.display ='none';
}


/* Special Custom Item */
//To be entered manually

function addSpecialCustomItem(){
	document.getElementById("newManualCustomItemModal").style.display ='block';
	$('#add_new_manual_custom_name').val('');
	$('#add_new_manual_custom_price').val(0);
	$('#add_new_manual_custom_name').focus();


          var easyActionsTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#newManualCustomItemModal').is(':visible')) {

                  if(e.which == 27){ // Escape (Close)
                    document.getElementById("newManualCustomItemModal").style.display ='none';
                    easyActionsTool.unbind();
                  }

            }
          });

}

function addSpecialCustomItemHide(){
	document.getElementById("newManualCustomItemModal").style.display ='none';	
}

function addManualCustomItem(){
	var name = $('#add_new_manual_custom_name').val();
	var price = $('#add_new_manual_custom_price').val();
	price = parseInt(price);

	if(name == ''){
		showToast('Warning: Add a Custom Name', '#e67e22');
		return '';
	}

	if(price == '' || price < 1){
		showToast('Warning: Add a Custom Price greater than 1', '#e67e22');
		return '';
	}

		var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
		
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
		productToAdd.code = top_manual_index;
		productToAdd.price = price;
		productToAdd.isCustom = false;
		productToAdd.isPackaged = true;

		saveToCart(productToAdd);

		addSpecialCustomItemHide();
		renderCart();
}



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
	var cart_products = JSON.parse(window.localStorage.zaitoon_cart)

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
    	window.localStorage.zaitoon_cart = '';
    }
    else{
    	window.localStorage.zaitoon_cart = JSON.stringify(cart_products)
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
	var cart_products = JSON.parse(window.localStorage.zaitoon_cart)
	

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



    window.localStorage.zaitoon_cart = JSON.stringify(cart_products)
    renderCart();

    $('#add_item_by_search').focus();
}


function renderCart(optionalFocusKey){ //optionalFocusKey --> Which input field to be focused

	//Render Cart Items based on local storage
	var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];

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
	                    "identifierTag": "ZAITOON_BILLING_PARAMETERS" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

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

		          	renderCartAfterProcess(cart_products, selectedBillingModeInfo, cartExtrasList, optionalFocusKey);	          	

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

function renderCartAfterProcess(cart_products, selectedBillingModeInfo, selectedModeExtras, optionalFocusKey){

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

			document.getElementById("cartDetails").innerHTML = '<p style="font-size: 21px; margin: 50px 0 0 0 ; text-align: center; font-weight: 300; color: #b9b9b9; }">'+
								'<img style="width: 25%; margin: 20px 0px 5px 0px;" src="images/common/emptycart.png"><br>Order Cart is empty!</p>';
			
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
		while(i < cart_products.length){
			variantName = '';
			notifyIcon = '';
			particularItemHasChanges = false;

			var tempItemCheck = checkForItemChanges(cart_products[i].code, cart_products[i].variant, cart_products[i].qty);

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
									temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"' : '')+'><span class="sname">'+cart_products[i].name+variantName+'<i class="bannedIngredient fa fa-ban" title="Contains Allergic Ingredients"></i>'+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
											'<td style="vertical-align: middle">'+
											'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
											'</td>'+
											'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
													
									break;
								}
							}

							if(a == allergicIngredients.length - 1 && !itemContainsAllergicIngredient){ //Last iteration
								temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"' : '')+'><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
									'<td style="vertical-align: middle">'+
									'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
									'</td>'+
									'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
								
							}

							a++;
						}			
					}
					else{
						temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"' : '')+'><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
							'<td style="vertical-align: middle">'+
							'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
							'</td>'+
							'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
						
					}
				}
				else{
					temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" '+(particularItemHasChanges ? 'onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"' : '')+'><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
						'<td style="vertical-align: middle">'+
						'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" '+(disableQuantityChange ? 'disabled' : '')+'>'+notifyIcon+
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
								temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"><span class="sname">'+cart_products[i].name+variantName+'<i class="bannedIngredient fa fa-ban" title="Contains Allergic Ingredients"></i>'+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
								break;
							}
						}

						if(a == allergicIngredients.length - 1 && !itemContainsAllergicIngredient){ //Last iteration
							temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
						}

						a++;
					}			
				}
				else{
					temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
				}
			}
			else{
				temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button class="btn btn-block btn-xs edit btn-success itemCommentButton" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity itemQuantityInput" id="qty'+cart_products[i].code+(cart_products[i].variant && cart_products[i].variant != '' && cart_products[i].variant != undefined ? cart_products[i].variant : '')+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onkeyup="senseQuantityChange(event, \''+cart_products[i].code+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp;
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
		                           	  (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px;" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+ 	
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button id="triggerClick_PrintItemViewButton" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat" onclick="printCurrentKOTView(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Print View</button>'+
		                           '</div>'+
		                        '</div>'+	
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button class="btn btn-success btn-block btn-flat" id="payment" style="height:71px;" onclick="generateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" id="triggerClick_PrintBillButton">Proceed to Bill</button>'+
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
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px;" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="undoChangesInKOT()">Undo Changes</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()" id="triggerClick_PrintKOTButton">Print Changed KOT</button>'+
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
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button id="triggerClick_PrintItemViewButton" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat" onclick="printCurrentKOTView(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Print View</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0;">'+
		                           '<button  class="btn btn-success btn-block btn-flat" onclick="compareChangesAndGenerateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" style="height:71px;" id="triggerClick_PrintBillButton">Proceed to Bill</button>'+
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
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px;" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="undoChangesInKOT()">Undo Changes</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button  style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()" id="triggerClick_PrintKOTButton">Print Changed KOT</button>'+
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
		                              (isUserAnAdmin ? '<button id="triggerClick_cancelOrderButton" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelRunningOrder(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Cancel</button><button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>' : '<button  class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important; height: 71px" id="triggerClick_HideCartButton" onclick="clearCurrentEditingOrder()">Hide</button>')+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0 4px;">'+
		                           '<div class="btn-group-vertical btn-block">'+
		                              '<button id="triggerClick_PrintItemViewButton" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat" onclick="printCurrentKOTView(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')">Print View</button>'+
		                           '</div>'+
		                        '</div>'+
		                        '<div class="col-xs-4" style="padding: 0">'+
		                           '<button  class="btn btn-success btn-block btn-flat" onclick="compareChangesAndGenerateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" style="height:71px;" id="triggerClick_PrintBillButton">Proceed to Bill</button>'+
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
                           '<button  class="btn btn-success btn-block btn-flat" id="triggerClick_PrintKOTButton" style="height:71px;" onclick="generateKOT()">Print KOT & Bill</button>'+
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
                           '<button  class="btn btn-success btn-block btn-flat" id="triggerClick_PrintKOTButton" style="height:71px;" onclick="generateKOT()">Print KOT & Bill</button>'+
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
                              '<button  style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()" id="triggerClick_PrintKOTButton">Print KOT</button>'+
                           '</div>'+
                        '</div>'+                    
                     '</div>';
 	}  
}

	//optionalFocusKey --> Which input field to be focused after cart is rendered
	if(optionalFocusKey && optionalFocusKey != '' && optionalFocusKey != undefined){
		/* cuurently used for quantity up and down operation only!  --> ADD MORE */
		$('#'+optionalFocusKey).focus();
	}
}



/* To Print Current KOT View */
function printCurrentKOTView(kotID, optionalSource){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          var kot = data.docs[0];
          sendToPrinter(kot, 'VIEW');
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
	window.localStorage.zaitoon_cart = '';
	window.localStorage.edit_KOT_originalCopy = '';
	window.localStorage.userAutoFound = '';
	window.localStorage.userDetailsAutoFound = '';

	window.localStorage.specialRequests_comments = '';
	window.localStorage.allergicIngredientsData = '[]';

	window.localStorage.hasUnsavedChangesFlag = 0;
 	document.getElementById("leftdiv").style.borderColor = "#FFF";

	renderCustomerInfo();
	renderTables();
}

function undoChangesInKOT(){
	//Reset zaitoon_cart same as the originalKOT Cart

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

		window.localStorage.zaitoon_cart = JSON.stringify(originalData.cart);
		showToast('Undone the changes!', '#27ae60');

		renderCustomerInfo();
	}
	else{
		showToast('Oops! Failed to undo the changes.', '#e74c3c');
		return '';
	}
}


function compareChangesAndGenerateBillFromKOT(kotID, optionalPageRef){

	/*
		Proceed to bill generation only if,
			1. There are no un-printed items in active Cart
			2. Meaning, zaitoon_cart equals cart in originalKOT
	*/

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){


		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		
		var changedCustomerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
		if(jQuery.isEmptyObject(changedCustomerInfo)){
			showToast('Customer Details missing', '#e74c3c');
			return '';
		}

		var changed_cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
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
				if(!original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code)){
					
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
				else if(original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code) && (original_cart_products[n].variant == changed_cart_products[i].variant)){
					
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
				if(!changed_cart_products[j].isCustom && (changed_cart_products[j].code == original_cart_products[m].code)){
					//Item Found
					break;
				}
				else if(changed_cart_products[j].isCustom && (changed_cart_products[j].code == original_cart_products[m].code) && (changed_cart_products[j].variant == original_cart_products[m].variant)){
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




function checkForItemChanges(code, variant, quantity){

/*
	Check if a particular item in zaitoon_cart has any change w.r.t originalCart 
	(useful while editing an order)
*/
	var isCustom = true;
	if(!variant || variant == ''){
		isCustom = false;
	}

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
		
		var changed_cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
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
				if(!isCustom && (code == original_cart_products[m].code)){
					//Item Found
					if(quantity > original_cart_products[m].qty){ //qty increased
						return 'QUANTITY_INCREASE';
					}
					else if(quantity < original_cart_products[m].qty){ //qty decreased
						return 'QUANTITY_DECREASE';
					}
					
					break;
				}
				else if(isCustom && (code == original_cart_products[m].code) && (variant == original_cart_products[m].variant)){
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
	Check if any item in zaitoon_cart has been deleted w.r.t originalCart 
	(useful while editing an order)
*/

	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){


		var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

		var changed_cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
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
				if(!original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code)){
					
					itemFound = true;
					break;
				}
				else if(original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code) && (original_cart_products[n].variant == changed_cart_products[i].variant)){
					
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
	else if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){
		confirmHoldOverWritingModal(encodedItem, id);
		return '';
	}


    var requestData = { "selector" :{ "identifierTag": "ZAITOON_SAVED_ORDERS" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_ORDERS'){

				var holding_orders = data.docs[0].value;
				holding_orders.splice(id,1);

				showToast('Order loaded from the Saved Orders', '#27ae60');

				var order = JSON.parse(decodeURI(encodedItem));
				window.localStorage.customerData = JSON.stringify(order.customerDetails);
				window.localStorage.zaitoon_cart = JSON.stringify(order.cartDetails);

				//Remove from Table mapping (if already added)
				if(order.customerDetails.modeType == 'DINE' && order.customerDetails.mappedAddress != ''){
					removeTableFromReserveList(order.customerDetails.mappedAddress)
				}


                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_SAVED_ORDERS",
                      "value": holding_orders
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SAVED_ORDERS/',
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
	window.localStorage.zaitoon_cart = '';
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

	    var requestData = { "selector" :{ "identifierTag": "ZAITOON_SAVED_ORDERS" } }

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
	      data: JSON.stringify(requestData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {

	        if(data.docs.length > 0){
	          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_ORDERS'){

					var holding_orders = data.docs[0].value;
					console.log('Current:', holding_orders)

					var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData): [];
					var product_cart = window.localStorage.zaitoon_cart ? JSON.parse(window.localStorage.zaitoon_cart): [];

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
	                      "identifierTag": "ZAITOON_SAVED_ORDERS",
	                      "value": holding_orders
	                    }

	                    $.ajax({
	                      type: 'PUT',
	                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SAVED_ORDERS/',
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

    var requestData = { "selector" :{ "identifierTag": "ZAITOON_SAVED_ORDERS" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_ORDERS'){

					var holding_orders = []

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_SAVED_ORDERS",
                      "value": holding_orders
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SAVED_ORDERS/',
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

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

	          		var tableMapping = data.docs[0].value;


		          	for(var i=0; i<tableMapping.length; i++){
		          		if(tableMapping[i].status == 5 && tableMapping[i].assigned == 'Hold Order'){

		          			tableMapping[i].assigned = "";
		          			tableMapping[i].KOT = "";
		          			tableMapping[i].status = 0;
		          			tableMapping[i].lastUpdate = "";
		          		}
		          	}


                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_TABLES_MASTER",
                      "value": tableMapping
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
                      data: JSON.stringify(updateData),
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


function addTableToReserveList(tableID, optionalComments){

	var comments = optionalComments;

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

	          var tableMapping = data.docs[0].value;
	          var timestamp = getCurrentTime('TIME');

	          for(var i=0; i<tableMapping.length; i++){
	          	if(tableMapping[i].table == tableID){

	          		if(tableMapping[i].status != 0){
	          			return '';
	          		}

	          		tableMapping[i].assigned = comments;
	          		tableMapping[i].KOT = "";
	          		tableMapping[i].status = 5;
	          		tableMapping[i].lastUpdate = timestamp;
	          		
	          		break;
	          	}
	          }

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_TABLES_MASTER",
                      "value": tableMapping
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
                      data: JSON.stringify(updateData),
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

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

	          var tableMapping = data.docs[0].value;

	          for(var i=0; i<tableMapping.length; i++){
	          	if(tableMapping[i].table == tableID){

	          		if(tableMapping[i].status != 5){
	          			return '';
	          		}

	          		tableMapping[i].status = 0;
	          		tableMapping[i].assigned = "";
	          		tableMapping[i].lastUpdate = "";
	          		tableMapping[i].KOT = "";

	          		break;
	          	}
	          }

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_TABLES_MASTER",
                      "value": tableMapping
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
                      data: JSON.stringify(updateData),
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

		window.localStorage.zaitoon_cart = "";
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
function renderCustomerInfo(){

    var requestData = { "selector" :{ "identifierTag": "ZAITOON_SAVED_ORDERS" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_ORDERS'){

				var holding_orders = data.docs[0].value;
				renderCustomerInfoBeforeProcess(holding_orders);  
          }
          else{
            renderCustomerInfoBeforeProcess([]);  
          }
        }
        else{
        	renderCustomerInfoBeforeProcess([]);    
        }
      },
      error: function(data) {
      	renderCustomerInfoBeforeProcess([]);  
      }
    });
}

function renderCustomerInfoBeforeProcess(holding_orders){

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
                    "identifierTag": "ZAITOON_BILLING_MODES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_MODES'){

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
						else if(tempModeType == 'PARCEL'){ //ask for address
							
							selectMappedAddressButton = '<label class="cartCustomerLabel">Mode</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">Parcel</tag>';
						}
						else if(tempModeType == 'DINE'){ //ask for table
							selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-danger" style="width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickTableForNewOrder()">Select Table</tag>';
							
							if(customerInfo.mappedAddress){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag id="triggerClick_TableAddressButton" class="btn btn-default" onclick="pickTableForNewOrder(\''+customerInfo.mappedAddress+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}					
						else if(tempModeType == 'TOKEN'){ //assign token
							
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
								renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList);
							}
							else{ //Claim a Token from Server

							    var requestData = {
							      "selector"  :{ 
							                    "identifierTag": "ZAITOON_TOKEN_INDEX" 
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
							          if(data.docs[0].identifierTag == 'ZAITOON_TOKEN_INDEX'){

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

										renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList);
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
						else if(tempModeType == 'PARCEL'){ //ask for address
							selectMappedAddressButton = '<label class="cartCustomerLabel">Mode</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">Parcel</tag>';
						}
						else if(tempModeType == 'DINE'){ //ask for table
							selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-danger disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">Not Set</tag>';
							
							if(customerInfo.mappedAddress && customerInfo.mappedAddress != ''){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}					
						else if(tempModeType == 'TOKEN'){ //assign token

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
								renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList);
							}
							else{ //Claim a Token from Server

							    var requestData = {
							      "selector"  :{ 
							                    "identifierTag": "ZAITOON_TOKEN_INDEX" 
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
							          if(data.docs[0].identifierTag == 'ZAITOON_TOKEN_INDEX'){

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
										selectMappedAddressButton = '<label class="cartCustomerLabel">Token No.</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							          	
							          	renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList);
							         
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
					} //Editing	

					if(tempModeType != 'TOKEN'){ /* TWEAK */
						renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList);
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



function renderCustomerInfoAfterProcess(isEditingKOT, customerInfo, selectMappedAddressButton, tempModeType, billingModesList){


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

			        renderCart();
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


			                          //Update token number on server
			                          var updateData = {
			                            "_rev": revID,
			                            "identifierTag": "ZAITOON_TOKEN_INDEX",
			                            "value": nextToken
			                          }

			                          $.ajax({
			                            type: 'PUT',
			                            url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TOKEN_INDEX/',
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


function suggestCustomerInfoFromMobile(mode, inputElement){

	var mobileNumber = '';

	if(mode == 'GENERIC'){
		mobileNumber = inputElement.value
	}
	else if(mode == 'DIRECT'){
		mobileNumber = inputElement;
	}

	if(mobileNumber.length == 10){

	  var requestData = {
	    "selector"  :{ 
	                  "mobile": mobileNumber 
	                },
	    "fields"    : ["name", "mobile", "savedAddresses"]
	  }

	  $.ajax({
	    type: 'POST',
	    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_users/_find',
	    data: JSON.stringify(requestData),
	    contentType: "application/json",
	    dataType: 'json',
	    timeout: 10000,
	    success: function(data) {
	      hideLoading();
	      if(data.docs.length != 0){ //USER FOUND!!!

	      	window.localStorage.userAutoFound = 1;
	      	window.localStorage.userDetailsAutoFound = JSON.stringify(data.docs[0]);

	      	var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData) : {};
	      	
	      	if(data.docs[0].name != ''){
	      		document.getElementById("customer_form_data_name").value = data.docs[0].name;
	      		customerInfo.name = data.docs[0].name;
	      	}

	      	//Set Address if any saved address found and the mode == 'PARCEL'
	      	var savedAddressesEncoded = '';
	      	if(data.docs[0].savedAddresses){

	      		savedAddressesEncoded = encodeURI(JSON.stringify(data.docs[0].savedAddresses));
	      	
	      		//set default address to 1st saved address
		      	if(customerInfo.modeType == 'DELIVERY' && data.docs[0].savedAddresses.length > 0){
		      		customerInfo.mappedAddress = JSON.stringify(data.docs[0].savedAddresses[0]);   			
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
	renderCustomerInfo();


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
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

              var tables = data.docs[0].value;
              tables.sort();

              if(tables.length < 50 && tables.length > 30){ //As per UI, it can include 30 large tables 
              	smallTableFlag = ' mediumTile';
              }
              else if(tables.length > 50){
              	smallTableFlag = ' smallTile';
              }
 

				    var requestData = {
				      "selector"  :{ 
				                    "identifierTag": "ZAITOON_TABLE_SECTIONS" 
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
				          if(data.docs[0].identifierTag == 'ZAITOON_TABLE_SECTIONS'){

				              var tableSections = data.docs[0].value;
				              tableSections.sort(); //alphabetical sorting 


							              var renderSectionArea = '';

							              var n = 0;
							              while(tableSections[n]){
							        
							              	var renderTableArea = ''
							              	for(var i = 0; i<tables.length; i++){
							              		if(tables[i].type == tableSections[n]){

							              			if(tables[i].status != 0){ /*Occuppied*/
														if(tables[i].status == 1){
								              				renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" style="cursor: pointer" onclick="retrieveTableInfo(\''+tables[i].table+'\', \'MAPPED\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">'+(currentTableID != '' && currentTableID == tables[i].table ? '<i class="fa fa-check" style="color: #FFF"></i>' : 'Running')+'</tag>'+
																					        	'</tag>';	
														}
														else if(tables[i].status == 2){
															renderTableArea = renderTableArea + '<tag class="tableTileYellow'+smallTableFlag+'" style="cursor: pointer" onclick="pickTableForNewOrderHide(); preSettleBill(\''+tables[i].KOT+'\', \'ORDER_PUNCHING\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">'+(currentTableID != '' && currentTableID == tables[i].table ? '<i class="fa fa-check" style="color: #FFF"></i>' : 'Billed')+'</tag>'+
																					        	'</tag>';	
														}									
														else if(tables[i].status == 5){
															if(currentTableID != '' && currentTableID == tables[i].table){
								              				renderTableArea = renderTableArea + '<tag class="tableTileBlue'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tables[i].table+'\', \'FREE\', \''+(tables[i].assigned != "" && tables[i].assigned != "Hold Order" ? tables[i].assigned : '')+'\', '+(tables[i].assigned != "" && tables[i].assigned == "Hold Order" ? 1 : 0)+')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(tables[i].assigned != ""? (tables[i].assigned == 'Hold Order' ? 'Saved Order' : 'For '+tables[i].assigned) : "-")+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';	
															}	
															else{
								              				renderTableArea = renderTableArea + '<tag class="tableReserved'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tables[i].table+'\', \'FREE\', \''+(tables[i].assigned != "" && tables[i].assigned != "Hold Order" ? tables[i].assigned : '')+'\', '+(tables[i].assigned != "" && tables[i].assigned == "Hold Order" ? 1 : 0)+')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+(tables[i].assigned != ""? (tables[i].assigned == 'Hold Order' ? 'Saved Order' : 'For '+tables[i].assigned) : "-")+'</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Reserved</tag>'+
																					        	'</tag>';	
															}

														}									
														else{
							              				renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" style="cursor: pointer" onclick="retrieveTableInfo(\''+tables[i].table+'\', \'MAPPED\')">'+
																				            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																				            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																				        	'</tag>';											
														}


							              			}
							              			else{

							              				if(currentTableID != '' && currentTableID == tables[i].table){
							              					renderTableArea = renderTableArea + '<tag class="tableTileBlue'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tables[i].table+'\', \'FREE\')">'+
																				            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																				            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																				        	'</tag>';
														}	
														else{
															renderTableArea = renderTableArea + '<tag class="tableTileGreen'+smallTableFlag+'" onclick="retrieveTableInfo(\''+tables[i].table+'\', \'FREE\')">'+
																				            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
																				            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																				        	'</tag>';
														}							        	              				
							              			}

							              		}
							              	}

							              	renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																	   '<h1 class="seatingPlanHead'+smallTableFlag+'" style="font-weight: 400; font-size: 18px; background: #f6f6f6; margin: 5px 5px; padding: 10px;">'+tableSections[n]+'</h1>'+
																	   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
																	    '</div>'+
																	'</div>'

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


function retrieveTableInfo(tableID, statusCode, optionalCustomerName, optionalSaveFlag){

	/* warn if unsaved order (Not editing case) */
	if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){
	    if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){
	        showToast('Warning! There is an unsaved order being punched. Please complete it to continue.', '#e67e22');
	        
	       // document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
	        //document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button  class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
	          //                                      '<button  class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
	    	return '';
	    }    
	}
	

	if(statusCode == 'MAPPED'){

		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
		          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

			          var tableMapping = data.docs[0].value;
			          for(var i=0; i<tableMapping.length; i++){
			          	if(tableMapping[i].table == tableID){
			          		moveToEditKOT(tableMapping[i].KOT);
			          	}
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
	}
	else if(statusCode == 'FREE'){
		freshOrderOnTable(tableID, optionalCustomerName, optionalSaveFlag);
	}
}



function retrieveTableInfoForNewOrder(tableID){

	/* warn if unsaved order (Not editing case) */
	if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){
	    if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){
	        showToast('Warning! There is an unsaved order being punched. Please complete it to continue.', '#e67e22');
	        
	       // document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
	        //document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button  class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
	          //                                      '<button  class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
	    	return '';
	    }    
	}
	
		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
		          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

			          var tableMapping = data.docs[0].value;
			          for(var i=0; i<tableMapping.length; i++){
			          	if(tableMapping[i].table == tableID){
			          		moveToEditKOT(tableMapping[i].KOT);
			          	}
			          }
		                

		              pickTableForNewOrderHide();
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



/*Add to edit KOT*/
function moveToEditKOT(kotID){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          	var kot = data.docs[0];

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
		    if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){

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
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}

function overWriteCurrentRunningOrder(kot){

    //var kot = JSON.parse(decodeURI(encodedKOT));


    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.count = kot.guestCount;
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
    window.localStorage.zaitoon_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);

    //window.localStorage.edit_KOT_originalCopy = decodeURI(encodedKOT);
    window.localStorage.edit_KOT_originalCopy = JSON.stringify(kot);


    //renderPage('new-order', 'Running Order');
    renderCustomerInfo();
	initOrderPunch();
	renderTables();
}






function renderCategoryTab(defaultTab){


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
								itemsInSubMenu = itemsInSubMenu + '<button onclick="additemtocart(\''+temp+'\')" type="button" type="button" class="btn btn-both btn-flat product"><tag id="menu_image_holder_'+mastermenu[i].items[j].code+'"><div id="itemImage" style="position: relative">'+(mastermenu[i].items[j].vegFlag == 2 ? '<img src="images/common/food_nonveg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+(mastermenu[i].items[j].vegFlag == 1 ? '<img src="images/common/food_veg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+getImageCode(mastermenu[i].items[j].name)+'</div></tag><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
								fetchImageFromServer(mastermenu[i].items[j].code, mastermenu[i].items[j].vegFlag);
							}
							else{
								itemsInSubMenu = itemsInSubMenu + '<button onclick="additemtocart(\''+temp+'\')" type="button" type="button" class="btn btn-both btn-flat product"><span class="bg-img"><div id="itemImage" style="position: relative">'+(mastermenu[i].items[j].vegFlag == 2 ? '<img src="images/common/food_nonveg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+(mastermenu[i].items[j].vegFlag == 1 ? '<img src="images/common/food_veg.png" style="width: 15px; position: absolute; top: 3px; right: 3px;">' : '')+getImageCode(mastermenu[i].items[j].name)+'</div></span><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
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
            url: COMMON_LOCAL_SERVER_IP+'/zaitoon_menu_images/'+itemCode,
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

function generateKOT(){
	//Editing Case
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		generateEditedKOT();
	}
	else if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){ //New Order Case
		generateNewKOT();
	}
}

/*Generate KOT for Editing Order */
function generateEditedKOT(){
	var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
	
	var changedCustomerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	if(jQuery.isEmptyObject(changedCustomerInfo)){
		showToast('Customer Details missing', '#e74c3c');
		return '';
	}

	var changed_cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
	if(changed_cart_products.length == 0){
		showToast('Empty Cart! Add items and try again', '#e74c3c');
		return '';
	}


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
			if(!checkingItem.isCustom && (checkingItem.code == changed_cart_products[i].code)){
				
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
				}
				else{ //same qty
					//console.log(checkingItem.name+' x '+checkingItem.qty);
				}

				break;
				
			}
			else if(checkingItem.isCustom && (checkingItem.code == changed_cart_products[i].code) && (checkingItem.variant == changed_cart_products[i].variant)){
				
				itemFound = true;

				//Change in Quantity
				if(changed_cart_products[i].qty > checkingItem.qty){ //qty increased
					//console.log(checkingItem.name+' x '+changed_cart_products[i].qty+' ('+(changed_cart_products[n].qty-original_cart_products[i].qty)+' More)');
					
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
				}
				else{ //same qty
					//console.log(checkingItem.name+' x '+checkingItem.qty);
				}

				break;

			}

			//Last iteration to find the item
			if(i == changed_cart_products.length-1){
				if(!itemFound){ //Item Deleted
					if(checkingItem.isCustom){
						//console.log(checkingItem.name+' - '+checkingItem.variant+' x 0 (Deleted)');
						
						var tempItem = checkingItem;
						tempItem.change = "ITEM_DELETED";
						tempItem.oldValue = "";
						if(changed_cart_products[i].comments != '' && checkingItem.comments != changed_cart_products[i].comments){
							tempItem.newComments = changed_cart_products[i].comments;
						}
						comparisonResult.push(tempItem);
					}
					else{
						//console.log(checkingItem.name+' x 0 (Deleted)');
						
						var tempItem = checkingItem;
						tempItem.change = "ITEM_DELETED";
						tempItem.oldValue = "";
						if(changed_cart_products[i].comments != '' && checkingItem.comments != changed_cart_products[i].comments){
							tempItem.newComments = changed_cart_products[i].comments;
						}
						comparisonResult.push(tempItem);
					}
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
				if(!changed_cart_products[j].isCustom && (changed_cart_products[j].code == original_cart_products[m].code)){
					//Item Found
					break;
				}
				else if(changed_cart_products[j].isCustom && (changed_cart_products[j].code == original_cart_products[m].code) && (changed_cart_products[j].variant == original_cart_products[m].variant)){
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
				generateEditedKOTAfterProcess(originalData.KOTNumber, changed_cart_products, changedCustomerInfo, comparisonResult)
			} 

			j++;
		}
	}

}


function generateEditedKOTAfterProcess(kotID, newCart, changedCustomerInfo, compareObject){
	
    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          
          var kot = data.docs[0];

          //Updates the KOT
          kot.customerMobile = changedCustomerInfo.mobile;
          kot.customerName = changedCustomerInfo.name;
          kot.guestCount = changedCustomerInfo.count;
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


          	  //Update on Server
              
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kot._id)+'/',
                  data: JSON.stringify(kot),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                  	  clearAllMetaData();
                  	  renderCustomerInfo();
                      sendKOTChangesToPrinter(kot, compareObject);
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


/* to quick view what items got removed */
function quickViewRemovedItems(){

	var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];
	var changed_cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
	


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
			if(!original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code)){			
				itemFound = true;
				break;
			}
			else if(original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code) && (original_cart_products[n].variant == changed_cart_products[i].variant)){
				
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
		addCustomToCart(item.name, item.code, item.price, item.variant, '',  item.ingredients ? encodeURI(JSON.stringify(item.ingredients)) : "");
	}
	else{
		additemtocart(encodedItem, 'DELETE_REVERSAL');
	}
	
	quickViewRemovedItems();
}


/* Generate KOT for Fresh Order */
function generateNewKOT(){

	//Render Cart Items based on local storage
	var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
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
                    "identifierTag": "ZAITOON_BILLING_PARAMETERS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

	          	var params = data.docs[0].value;

	          	var selectedModeExtrasList = selectedBillingModeInfo.extras;
	          	var cartExtrasList = [];

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
	          	
	          	generateKOTAfterProcess(cart_products, selectedBillingModeInfo, cartExtrasList)	

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

	customerData._id = customerData.mobile;

	//Post to local Server
	$.ajax({
	    type: 'POST',
	    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_users/',
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

    var requestData = { "selector" :{ "_id": mobile }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_users/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          		var userData = data.docs[0];
          		userData.savedAddresses.push(newAddress);

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_users/'+mobile+'/',
                  data: JSON.stringify(userData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                  	console.log(data)
                  },
                  error: function(data) {
                      
                  }
                }); 
        }
      },
      error: function(data) {
        
      }

    }); 
}


function removeCustomerAddressFromDatabase(mobile, addressID){

    var requestData = { "selector" :{ "_id": mobile }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_users/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          		var userData = data.docs[0];
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
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_users/'+mobile+'/',
                  data: JSON.stringify(userData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                  	console.log(data)
                  },
                  error: function(data) {
                      
                  }
                }); 
        }
      },
      error: function(data) {
        
      }

    }); 
}


function generateKOTAfterProcess(cart_products, selectedBillingModeInfo, selectedModeExtras){
		
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


    //Get customer info.
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		showToast('Customer Details missing', '#e74c3c');
		return '';
	}

	if(customerInfo.mobile == '' && customerInfo.modeType == 'PARCEL'){
		showToast('Please enter Customer Contact Number', '#e74c3c');
		return '';
	}

	if(customerInfo.mappedAddress == '' && customerInfo.modeType != 'PARCEL'){
		switch(customerInfo.modeType){
			case "TOKEN":{
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
			"mode": "VIP Guest",
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
   
    //Check for KOT index on Server
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_KOT_INDEX" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_KOT_INDEX'){

	          var num = parseInt(data.docs[0].value) + 1;
	          var kot = 'KOT' + num;

	          var memory_revID = data.docs[0]._rev;
	         
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


	          //Post to local Server
	          $.ajax({
	            type: 'POST',
	            url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/',
	            data: JSON.stringify(obj),
	            contentType: "application/json",
	            dataType: 'json',
	            timeout: 10000,
	            success: function(data) {
	              if(data.ok){

	              	//Send KOT for Printing
	              	sendToPrinter(obj, 'KOT');

	              	if(orderMetaInfo.modeType == 'DINE'){
	              		addToTableMapping(obj.table, kot, obj.customerName, 'ORDER_PUNCHING');
	              		showToast('#'+kot+' generated Successfully', '#27ae60');

	              		
	              		clearAllMetaData();
	              		renderCustomerInfo();
	              		$("#add_item_by_search").focus();
	              	}
	              	else if(orderMetaInfo.modeType == 'TOKEN'){

	              		showToast('#'+kot+' generated Successfully', '#27ae60');

	              		//Clear Token
						window.localStorage.claimedTokenNumber = '';
						window.localStorage.claimedTokenNumberTimestamp = '';	              		
	 					
	 					pushCurrentOrderAsEditKOT(obj);
	              		generateBillFromKOT(kot, 'ORDER_PUNCHING')
	              	}
	              	else if(orderMetaInfo.modeType == 'PARCEL' || orderMetaInfo.modeType == 'DELIVERY'){
	              		showToast('#'+kot+' generated Successfully', '#27ae60');
	              		
	              		//If an online order ==> Save Mapping
	              		if(obj.orderDetails.isOnline){
	              			saveOnlineOrderMapping(obj);
	              			getOnlineOrdersCount();
	              		}
	              		

	              		pushCurrentOrderAsEditKOT(obj);
	              		generateBillFromKOT(kot, 'ORDER_PUNCHING')
	              	}

                          

                    	  //Update KOT number on server

                          var updateData = {
                            "_rev": memory_revID,
                            "identifierTag": "ZAITOON_KOT_INDEX",
                            "value": num
                          }

                          $.ajax({
                            type: 'PUT',
                            url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_KOT_INDEX/',
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
	              else{
	                showToast('Warning: KOT was not Generated. Try again.', '#e67e22');
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
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/',
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



/*Add to edit KOT*/
function pushCurrentOrderAsEditKOT(kot){
    
    //var kot = JSON.parse(decodeURI(encodedKOT));

    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.count = kot.guestCount;
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
    window.localStorage.zaitoon_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);
    window.localStorage.edit_KOT_originalCopy = JSON.stringify(kot); //decodeURI(encodedKOT);

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
	window.localStorage.zaitoon_cart = '';
	window.localStorage.edit_KOT_originalCopy = '';
	window.localStorage.userAutoFound = '';
	window.localStorage.userDetailsAutoFound = '';

	window.localStorage.specialRequests_comments = '';
	window.localStorage.allergicIngredientsData = '[]';

	window.localStorage.hasUnsavedChangesFlag = 0;
 	//document.getElementById("leftdiv").style.borderColor = "#FFF";
}


function freshOrderOnTable(TableNumber, optionalCustomerName, optionalSaveFlag){

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

	customerInfo.name = (optionalCustomerName && optionalCustomerName != '') ? optionalCustomerName : '';
	customerInfo.mobile = "";
	customerInfo.count = "";
	customerInfo.mappedAddress = TableNumber;
	customerInfo.reference = "";
	customerInfo.isOnline = false;

	window.localStorage.customerData = JSON.stringify(customerInfo);
	window.localStorage.edit_KOT_originalCopy = '';

	if(optionalSaveFlag && optionalSaveFlag == 1){
		
			/* fetch cart from saved */

		    var requestData = { "selector" :{ "identifierTag": "ZAITOON_SAVED_ORDERS" } }

		    $.ajax({
		      type: 'POST',
		      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
		      data: JSON.stringify(requestData),
		      contentType: "application/json",
		      dataType: 'json',
		      timeout: 10000,
		      success: function(data) {
		        if(data.docs.length > 0){
		          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_ORDERS'){

						var holding_orders = data.docs[0].value;

						var n = 0;
						while(holding_orders[n]){

							if(holding_orders[n].customerDetails.mappedAddress == TableNumber){
								
								window.localStorage.edit_KOT_originalCopy = '';
								window.localStorage.zaitoon_cart = '';
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

		window.localStorage.zaitoon_cart = '';
	
		window.localStorage.userAutoFound = '';
		window.localStorage.userDetailsAutoFound = '';
		window.localStorage.specialRequests_comments = '';
		window.localStorage.allergicIngredientsData = '[]';


		window.localStorage.hasUnsavedChangesFlag = 0;
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

	window.localStorage.zaitoon_cart = '';
	
	window.localStorage.userAutoFound = 1;
	window.localStorage.userDetailsAutoFound = JSON.stringify(newCustomerObj);



	window.localStorage.hasUnsavedChangesFlag = 0;
 	document.getElementById("leftdiv").style.borderColor = "#FFF";

	renderCart();
	renderCustomerInfo();
	renderTables();
}




function addToTableMapping(tableID, kotID, assignedTo, optionalPageRef){

          var today = new Date();
          var hour = today.getHours();
          var mins = today.getMinutes();

          if(hour<10) {
              hour = '0'+hour;
          } 

          if(mins<10) {
              mins = '0'+mins;
          }

		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
		          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

			          var tableMapping = data.docs[0].value;
			          var timestamp = getCurrentTime('TIME');

			          for(var i=0; i<tableMapping.length; i++){
			          	if(tableMapping[i].table == tableID){

			          		if(tableMapping[i].status != 0 && tableMapping[i].status != 5){
								showToast('Warning: Table #'+tableID+' was not free. But Order is punched.', '#e67e22');
			          		}
			          		else{
			          			tableMapping[i].status = 1;
			          			tableMapping[i].assigned = assignedTo;
			          			tableMapping[i].KOT = kotID;
			          			tableMapping[i].lastUpdate = hour+''+mins;
			          		}
			          	}
			          }

		                    //Update
		                    var updateData = {
		                      "_rev": data.docs[0]._rev,
		                      "identifierTag": "ZAITOON_TABLES_MASTER",
		                      "value": tableMapping
		                    }

		                    $.ajax({
		                      type: 'PUT',
		                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
		                      data: JSON.stringify(updateData),
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



function billTableMapping(tableID, billNumber, status, optionalPageRef){

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



		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
		          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

			          var tableMapping = data.docs[0].value;
			          var timestamp = getCurrentTime('TIME');

			          for(var i=0; i<tableMapping.length; i++){
			          	if(tableMapping[i].table == tableID){
			          		tableMapping[i].status = status;
			          		tableMapping[i].KOT = billNumber;
			          		tableMapping[i].lastUpdate = hour+''+mins;
			          	}
			          }

		                    //Update
		                    var updateData = {
		                      "_rev": data.docs[0]._rev,
		                      "identifierTag": "ZAITOON_TABLES_MASTER",
		                      "value": tableMapping
		                    }

		                    $.ajax({
		                      type: 'PUT',
		                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
		                      data: JSON.stringify(updateData),
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
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

              var tables = data.docs[0].value;
              tables.sort();
 
              if(tables.length < 50 && tables.length > 30){ //As per UI, it can include 30 large tables 
              	smallTableFlag = ' mediumTile';
              }
              else if(tables.length > 50){
              	smallTableFlag = ' smallTile';
              }

				    var requestData = {
				      "selector"  :{ 
				                    "identifierTag": "ZAITOON_TABLE_SECTIONS" 
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
				          if(data.docs[0].identifierTag == 'ZAITOON_TABLE_SECTIONS'){

				            var tableSections = data.docs[0].value;
				            
							document.getElementById("pickTableForNewOrderModal").style.display = 'block';	
							$('#tableEasyInputBox').focus();
							$('#tableEasyInputBox').select();     
							
							var renderSectionArea = '';
							var renderTableArea = ''


									//First Iteration
								    $.each(tableSections, function(key_1, sectionName) {
								    	renderTableArea = '';
								    	$.each(tables, function(key_2, mytable) {

												if(mytable.type == sectionName){

								              			if(mytable.status != 0){ /*Occuppied*/
															if(mytable.status == 1){
								              					renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" onclick="retrieveTableInfoForNewOrder(\''+mytable.table+'\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';	
															}	
															else if(mytable.status == 2){
																renderTableArea = renderTableArea + '<tag onclick="pickTableForNewOrderHide(); preSettleBill(\''+mytable.KOT+'\', \'ORDER_PUNCHING\')" class="tableTileYellow'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Billed</tag>'+
																					        	'</tag>';	
															}								
															else if(mytable.status == 5){
																if(currentTableID != '' && currentTableID == mytable.table){
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+mytable.table+'\')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.assigned != ""? (mytable.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																						        	'</tag>';	
																}	
																else{
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableReserved'+smallTableFlag+'" onclick="pickTableForNewOrderHide(); retrieveTableInfo(\''+mytable.table+'\', \'FREE\', \''+(mytable.assigned != "" && mytable.assigned != "Hold Order" ? mytable.assigned : '')+'\', '+(mytable.assigned != "" && mytable.assigned == "Hold Order" ? 1 : 0)+')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.assigned != ""? (mytable.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'">Reserved</tag>'+
																						        	'</tag>';	
																}

															}									
															else{
								              				renderTableArea = renderTableArea + '<tag class="tableTileRed'+smallTableFlag+'" onclick="retrieveTableInfoForNewOrder(\''+mytable.table+'\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';											
															}


								              			}
								              			else{

								              				if(currentTableID != '' && currentTableID == mytable.table){
								              					renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.table+'\')" class="tableTileBlue'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'" style="color: #FFF !important">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'" style="color: #FFF !important">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF !important"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';
															}	
															else{
																renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.table+'\')" class="tableTileGreen'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																					        	'</tag>';
															}							        	              				
								              			}
								              		
							              		}							           

								    	 });


								        renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																	   '<h1 class="seatingPlanHead'+smallTableFlag+'">'+sectionName+'</h1>'+
																	   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
																	    '</div>'+
																	'</div>'



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
								    	$.each(tables, function(key_2, mytable) {


									     		var shortlistFlag = false;

												if(mytable.type == sectionName){

													if(searchField == ' '){ /* TWEAK to remove first Space */
														$('#tableEasyInputBox').val('');
														searchField = '';
													}

													shortlistFlag = (mytable.table.toUpperCase() == searchField.toUpperCase()) ? true : false;
													
													if(shortlistFlag){
														atleastOneTableSelected = true;
													}

													if(searchField != ''){ //Searched Case
								              			if(mytable.status != 0){ /*Occuppied*/
															if(mytable.status == 1){
								              					renderTableArea = renderTableArea + '<tag class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileRed'+smallTableFlag+'" onclick="retrieveTableInfoForNewOrder(\''+mytable.table+'\')">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';	
															}	
															else if(mytable.status == 2){
																renderTableArea = renderTableArea + '<tag onclick="pickTableForNewOrderHide(); preSettleBill(\''+mytable.KOT+'\', \'ORDER_PUNCHING\')" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileYellow'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Billed</tag>'+
																					        	'</tag>';	
															}								
															else if(mytable.status == 5){
																if(currentTableID != '' && currentTableID == mytable.table){
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+mytable.table+'\')">'+
									              													'<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																						            '<tag class="tableTitle'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+mytable.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+(mytable.assigned != ""? (mytable.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important"><i class="fa fa-check"></i></tag>'+
																						        	'</tag>';	
																}	
																else{
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableReserved'+smallTableFlag+'" onclick="pickTableForNewOrderHide(); retrieveTableInfo(\''+mytable.table+'\', \'FREE\', \''+(mytable.assigned != "" && mytable.assigned != "Hold Order" ? mytable.assigned : '')+'\', '+(mytable.assigned != "" && mytable.assigned == "Hold Order" ? 1 : 0)+')">'+
																						            '<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.assigned != "" ? (mytable.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'">Reserved</tag>'+
																						        	'</tag>';	
																}

															}									
															else{
								              				renderTableArea = renderTableArea + '<tag onclick="retrieveTableInfoForNewOrder(\''+mytable.table+'\')" class="'+(shortlistFlag ? '' : 'temporaryTableNotFiltered')+' tableTileRed'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';											
															}


								              			}
								              			else{

								              				if(currentTableID != '' && currentTableID == mytable.table){
								              					renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.table+'\')" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileBlue'+smallTableFlag+'">'+
																					            '<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																					            '<tag class="tableTitle'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: '+(shortlistFlag ? '#FFF' : '#2775a9')+' !important"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';
															}	
															else{
																renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.table+'\')" class="'+(shortlistFlag ? 'temporaryTableSelection' : 'temporaryTableNotFiltered')+' tableTileGreen'+smallTableFlag+'">'+
																					            '<tag class="currentTableSelectionCaretIcon"><i class="fa fa-caret-right"></i></tag>'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
																					        	'</tag>';
															}							        	              				
								              			}													
													} //Not searched!
													else{
								              			if(mytable.status != 0){ /*Occuppied*/
															if(mytable.status == 1){
								              					renderTableArea = renderTableArea + '<tag onclick="retrieveTableInfoForNewOrder(\''+mytable.table+'\')" class="tableTileRed'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';	
															}	
															else if(mytable.status == 2){
																renderTableArea = renderTableArea + '<tag onclick="pickTableForNewOrderHide(); preSettleBill(\''+mytable.KOT+'\', \'ORDER_PUNCHING\')" class="tableTileYellow'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Billed</tag>'+
																					        	'</tag>';	
															}								
															else if(mytable.status == 5){
																if(currentTableID != '' && currentTableID == mytable.table){
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+mytable.table+'\')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.assigned != ""? (mytable.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																						        	'</tag>';	
																}	
																else{
									              				renderTableArea = renderTableArea + '<tag style="position: relative" class="tableReserved'+smallTableFlag+'" onclick="pickTableForNewOrderHide(); retrieveTableInfo(\''+mytable.table+'\', \'FREE\', \''+(mytable.assigned != "" && mytable.assigned != "Hold Order" ? mytable.assigned : '')+'\', '+(mytable.assigned != "" && mytable.assigned == "Hold Order" ? 1 : 0)+')">'+
																						            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																						            '<tag class="tableCapacity'+smallTableFlag+'">'+(mytable.assigned != ""? (mytable.assigned == 'Hold Order' ? 'Saved Order' : "For "+mytable.assigned) : "-")+'</tag>'+
																						            '<tag class="tableInfo'+smallTableFlag+'">Reserved</tag>'+
																						        	'</tag>';	
																}

															}									
															else{
								              				renderTableArea = renderTableArea + '<tag onclick="retrieveTableInfoForNewOrder(\''+mytable.table+'\')" class="tableTileRed'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
																					        	'</tag>';											
															}


								              			}
								              			else{

								              				if(currentTableID != '' && currentTableID == mytable.table){
								              					renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.table+'\')" class="tableTileBlue'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'" style="color: #FFF !important">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'" style="color: #FFF !important">'+mytable.capacity+' Seater</tag>'+
																					            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF !important"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';
															}	
															else{
																renderTableArea = renderTableArea + '<tag style="position: relative" onclick="setCustomerInfoTable(\''+mytable.table+'\')" class="tableTileGreen'+smallTableFlag+'">'+
																					            '<tag class="tableTitle'+smallTableFlag+'">'+mytable.table+'</tag>'+
																					            '<tag class="tableCapacity'+smallTableFlag+'">'+mytable.capacity+' Seater</tag>'+
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


								        renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																	   '<h1 class="seatingPlanHead'+smallTableFlag+'">'+sectionName+'</h1>'+
																	   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
																	    '</div>'+
																	'</div>'


								    });

								    $('#pickTableForNewOrderModalContent').html(renderSectionArea);
								}
							});   


							       //        var renderSectionArea = '';

							       //        var n = 0;
							       //        while(tableSections[n]){
							        
							       //        	var renderTableArea = ''
							       //        	for(var i = 0; i<tables.length; i++){
							       //        		if(tables[i].type == tableSections[n]){

							       //        			if(tables[i].status != 0){ /*Occuppied*/
														// if(tables[i].status == 1){
							       //        					renderTableArea = renderTableArea + '<tag class="easyActionTool_tablesListed tableTileRedDisable'+smallTableFlag+'">'+
														// 						            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 						            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
														// 						            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
														// 						        	'</tag>';	
														// }	
														// else if(tables[i].status == 2){
														// 	renderTableArea = renderTableArea + '<tag class="easyActionTool_tablesListed tableTileYellowDisable'+smallTableFlag+'">'+
														// 						            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 						            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
														// 						            '<tag class="tableInfo'+smallTableFlag+'">Billed</tag>'+
														// 						        	'</tag>';	
														// }								
														// else if(tables[i].status == 5){
														// 	if(currentTableID != '' && currentTableID == tables[i].table){
								      //         				renderTableArea = renderTableArea + '<tag class="easyActionTool_tablesListed tableTileBlue'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+tables[i].table+'\')">'+
														// 							            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 							            '<tag class="tableCapacity'+smallTableFlag+'">'+(tables[i].assigned != ""? "For "+tables[i].assigned : "-")+'</tag>'+
														// 							            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
														// 							        	'</tag>';	
														// 	}	
														// 	else{
								      //         				renderTableArea = renderTableArea + '<tag class="easyActionTool_tablesListed tableReserved'+smallTableFlag+'" onclick="setCustomerInfoTable(\''+tables[i].table+'\')">'+
														// 							            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 							            '<tag class="tableCapacity'+smallTableFlag+'">'+(tables[i].assigned != ""? "For "+tables[i].assigned : "-")+'</tag>'+
														// 							            '<tag class="tableInfo'+smallTableFlag+'">Reserved</tag>'+
														// 							        	'</tag>';	
														// 	}

														// }									
														// else{
							       //        				renderTableArea = renderTableArea + '<tag class="easyActionTool_tablesListed tableTileRedDisable'+smallTableFlag+'">'+
														// 						            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 						            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
														// 						            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
														// 						        	'</tag>';											
														// }


							       //        			}
							       //        			else{

							       //        				if(currentTableID != '' && currentTableID == tables[i].table){
							       //        					renderTableArea = renderTableArea + '<tag onclick="setCustomerInfoTable(\''+tables[i].table+'\')" class="easyActionTool_tablesListed tableTileBlue'+smallTableFlag+'">'+
														// 						            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 						            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
														// 						            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
														// 						        	'</tag>';
														// }	
														// else{
														// 	renderTableArea = renderTableArea + '<tag onclick="setCustomerInfoTable(\''+tables[i].table+'\')" class="easyActionTool_tablesListed tableTileGreen'+smallTableFlag+'">'+
														// 						            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
														// 						            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
														// 						            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
														// 						        	'</tag>';
														// }							        	              				
							       //        			}

							       //        		}
							       //        	}

							       //        	renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
														// 			   '<h1 class="seatingPlanHead'+smallTableFlag+'">'+tableSections[n]+'</h1>'+
														// 			   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
														// 			    '</div>'+
														// 			'</div>'

							       //        	n++;
							       //        }
							              
							       //        document.getElementById("pickTableForNewOrderModalContent").innerHTML = renderSectionArea;		            	


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
                           '<p class="featureName">'+addressObj[n].name+'<br> '+addressObj[n].flatNo+' '+addressObj[n].flatName+'<br> '+addressObj[n].landmark+' '+addressObj[n].area+'<br> '+( addressObj[n].contact && addressObj[n].contact != '' ? 'Mob. '+addressObj[n].contact : '' )+'</p>'+
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
						                    "identifierTag": "ZAITOON_TOKEN_INDEX" 
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
						          if(data.docs[0].identifierTag == 'ZAITOON_TOKEN_INDEX'){

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
						                    "identifierTag": "ZAITOON_TOKEN_INDEX" 
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
						          if(data.docs[0].identifierTag == 'ZAITOON_TOKEN_INDEX'){

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
						                    "identifierTag": "ZAITOON_TOKEN_INDEX" 
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
						          if(data.docs[0].identifierTag == 'ZAITOON_TOKEN_INDEX'){

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
function addCommentToItem(itemCode, variant){


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
	var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];

	if(variant){
		var n = 0;
		while(cart_products[n]){
			if(cart_products[n].code == itemCode && cart_products[n].variant == variant){
				cart_products[n].comments = text;
				break;
			}
			n++;
		}	
	}
	else{
		var n = 0;
		while(cart_products[n]){
			if(cart_products[n].code == itemCode){
				cart_products[n].comments = text;
				break;
			}
			n++;
		}			
	}

	window.localStorage.zaitoon_cart = JSON.stringify(cart_products);

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

function openItemWiseCommentModal(itemCode, variant){

		console.log('Open ITEM COMMENT')

		var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];
		var commentsAdded = false; 
		var variantTitle = '';
		var itemTitle = '';

		if(variant != ''){
			var n = 0;
			while(cart_products[n]){
				if(cart_products[n].code == itemCode && cart_products[n].variant == variant){
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

			variantTitle = ' ('+variant+')'; /*TWEAK*/
		}
		else{
			var n = 0;
			while(cart_products[n]){
				if(cart_products[n].code == itemCode){

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
		}


		var suggestionsDataList = [];
		var modesTag = '';

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_SAVED_COMMENTS" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_COMMENTS'){

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
               									'<button id="itemWiseCommentsModalActions_SAVE" type="button" class="btn btn-success" onclick="addCommentToItem(\''+itemCode+'\', \''+variant+'\')" style="float: right">Save Comment</button>';


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

				console.log(keypressCounter)
				
				var easySelectionTool = $('#add_item_wise_comment').keyup(function(e) {

					if($('#itemWiseCommentsModal').is(':visible')) {
						
						keypressCounter++;
						console.log(keypressCounter)
						
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

						    var regex = new RegExp(searchField, "i");
						    var renderContent = '';
						    var count = 0;
						    var tabIndex = 1;
						    var itemsRenderList = '';

						    $.each(suggestionsDataList, function(key_1, suggestionItem) {
						    	
						    		itemsRenderList = '';
						    		count = 0;

							        if ((suggestionItem.search(regex) != -1)) {
							        	tabIndex = -1;
							  			itemsRenderList += '<li class="ui-menu-item" onclick="addFromSuggestions(\''+suggestionItem+'\', \'SUGGESTION_LIST\'); " tabindex="'+tabIndex+'">'+suggestionItem+'</li>'
							            count++;
							            tabIndex++;
							        }
							           		

						    		if(count > 0){
						    			renderContent += itemsRenderList;
						    		}

						    });

						    
						    if(renderContent != '')
						    	$('#commentSuggestionsRenderArea').html('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow: scroll">'+renderContent+'</ul>');
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
                    "identifierTag": "ZAITOON_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_COOKING_INGREDIENTS'){

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

				/*Select on Arrow Up/Down */
				var li = $('#searchResultsRenderArea li');
				var liSelected = undefined;

				$('#add_item_by_search').keyup(function(e) {

					if($('#customOptionsList').is(':visible')){ // **TWEAK**
						//Do not navigate when the custom item choose modal is shown
						return '';
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
					    var renderContent = '';
					    var count = 0;
					    var tabIndex = 1;
					    var itemsList = '';

					    $.each(mastermenu, function(key_1, subMenu) {
					    	
					    	itemsList = '';
					    	count = 0;
					    	$.each(subMenu.items, function(key_2, items) {

					    		if(!items.shortCode){
					    			items.shortCode = '';
					    		}

						        if ((items.name.search(regex) != -1) || (items.price.search(regex) != -1) || (items.shortCode.search(regex) != -1)) {
						        	tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="additemtocart(\''+encodeURI(JSON.stringify(items))+'\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
						        }
						           		

					    	 });

					    	if(count > 0){
					    		renderContent += '<label class="menuSuggestionSubMenu">'+subMenu.category+'</label>'+itemsList;
					    	}

					    });

					    
					    if(renderContent != '')
					    	$('#searchResultsRenderArea').html('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow: scroll">'+renderContent+'</ul>');
					    else
					    	$('#searchResultsRenderArea').html('');

					    //Refresh dropdown list
					    li = $('#searchResultsRenderArea li');
					}
				});   
          }
        }
      }

    });
}








