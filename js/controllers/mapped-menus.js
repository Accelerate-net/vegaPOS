

let ALREADY_DOWNLOADED_MAPPED_MENU;
let ALREADY_DOWNLOADED_MASTER_MENU;
let ALREADY_DOWNLOADED_MASTER_MENU_ITEMS;


function openOtherMappedMenu(menuTypeCode){

  window.localStorage.current_opened_menu_mapping = menuTypeCode;

  ALREADY_DOWNLOADED_MAPPED_MENU = [];
  ALREADY_DOWNLOADED_MASTER_MENU = [];
  ALREADY_DOWNLOADED_MASTER_MENU_ITEMS = [];

  var systemMenu = '';
  var mappedMenu = '';

  var formatted_name_menu = ((menuTypeCode).toLowerCase());

  document.getElementById("mappedMenuHeadTitle").innerHTML = 'Mapped <tag style="text-transform:capitalize">'+formatted_name_menu+'</tag> Menu';


  preloadSystemMenu();

  function preloadSystemMenu(){

      var requestData = {
        "selector"  :{ 
                      "identifierTag": "ACCELERATE_MASTER_MENU" 
                    },
        "fields"    : ["_rev", "identifierTag", "value"]
      }

      $.ajax({
        type: 'POST',
        url: COMMON_LOCAL_SERVER_IP + '/accelerate_settings/_find',
        data: JSON.stringify(requestData),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          if(data.docs.length > 0){
            if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

                var mastermenu = data.docs[0].value;
                var list = [];
          
                for (var i=0; i<mastermenu.length; i++){
                  for(var j=0; j<mastermenu[i].items.length; j++){
                    list[mastermenu[i].items[j].code] = mastermenu[i].items[j];
                    list[mastermenu[i].items[j].code].category = mastermenu[i].category;
                  }         
                }

                ALREADY_DOWNLOADED_MASTER_MENU = mastermenu;
                ALREADY_DOWNLOADED_MASTER_MENU_ITEMS = list;

                systemMenu = list;
                preloadMenuMappings();

            }
            else{
              showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
              preloadMenuMappings();
            }
          }
          else{
            showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
            preloadMenuMappings();
          }
          
        },
        error: function(data) {
          showToast('System Error: Unable to read Menu data. Please contact Accelerate Support.', '#e74c3c');
          preloadMenuMappings();
        }

      });   
  }


  function preloadMenuMappings(){

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_other_menu_mappings/MENU_'+menuTypeCode+'/',
      timeout: 10000,
      success: function(data) {
        if(data._id != ""){

            var otherMenu = data;
            mappedMenu = data.value;

            ALREADY_DOWNLOADED_MAPPED_MENU = mappedMenu;

            proceedToValidation();

        }
        else{
          proceedToValidation();
        }
      },
      error: function(data) {
        showToast('System Error: <b>'+menuTypeCode+'</b> Menu data not found. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });   

  }


  function proceedToValidation(){

    var otherMenuData = mappedMenu;
    var renderContent = '';

    for(var n = 0; n < otherMenuData.length; n++){

      var systemItem = getSystemEquivalentItem(otherMenuData[n].systemCode, otherMenuData[n].systemVariant);
        
      if(systemItem == "NOT_FOUND"){

        if(otherMenuData[n].systemCode == ""){
        
          renderContent += '<tr role="row" class="selectMappedRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                            '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                            '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                            '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+ 
                            '<td style="color: red;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-warning"></i></td>'+
                            '<td style="background: red; color: #FFF; text-align: right;"></td>'+
                            '<td style="background: red; color: #FFF"><b>Not Mapped</b></td>'+
                            '<td style="background: red;"></td>'+
                          '</tr>';
        }
        else{
          renderContent += '<tr role="row" class="selectMappedRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+
                          '<td style="color: red;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-warning"></i></td>'+
                          '<td style="background: red; color: #FFF; text-align: right;"><b>'+otherMenuData[n].systemCode+'</b></td>'+
                          '<td style="background: red; color: #FFF"><b>Incorrect Mapping</b></td>'+
                          '<td style="background: red;"></td>'+
                        '</tr>';
        }
      }
      else{

        var equivalent_variant = "";
        var equivalent_price = "";

        if(systemItem.isCustom && otherMenuData[n].systemVariant != ""){
          for(var i = 0; i < systemItem.customOptions.length; i++){
            if(systemItem.customOptions[i].customName == otherMenuData[n].systemVariant){
              equivalent_variant = systemItem.customOptions[i].customName;
              equivalent_price = systemItem.customOptions[i].customPrice;
              break;
            }
          }

          if(equivalent_variant == ""){
            equivalent_variant = "VARIANT_MISMATCH";
          }
        }
        else if(systemItem.isCustom && otherMenuData[n].systemVariant == ""){
          equivalent_variant = "VARIANT_MISMATCH";
        }

        renderContent += '<tr role="row" class="selectMappedRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+
                          '<td style="color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-long-arrow-right"></i></td>'+
                          '<td style="text-align: right; font-weight: bold; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+systemItem.code+'</td>'+
                          '<td style="font-weight: 400; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+systemItem.name + (equivalent_variant != "" ? (equivalent_variant == "VARIANT_MISMATCH" ? ' <tag class="mappedInvalidVariant">INVALID VARIANT</tag>' : ' <tag class="mappedVariantTag">('+equivalent_variant+')</tag>') : '')+'</td>'+
                          '<td style="text-align: right; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(systemItem.isCustom ? (equivalent_price != "" ? '<i class="fa fa-inr"></i>'+equivalent_price : "") : '<i class="fa fa-inr"></i>'+systemItem.price)+'</td>'+
                        '</tr>';

      }
    } 

    if(renderContent == ""){
      renderContent = '<p style="margin: 30px 0 0 0; text-align: center; color: #ccc;">Oops! Validator did not return any results.</p>';
    }
    else{
      document.getElementById("mappedMenuValidationResultsContentHeader").innerHTML = ''+
                      '<tr>'+ 
                        '<td style="color: #FFF; background: #526079; font-weight: bold">#</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold; text-transform: capitalize">'+formatted_name_menu+' Name</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold; text-transform: capitalize">'+formatted_name_menu+' Price</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold"></td>'+
                        '<td colspan="3" style="color: #FFF; background: #1abc62; font-weight: bold; text-align: center;">System Mapping</td>'+
                      '</tr>';
    }


    document.getElementById("mappedMenuValidationResultsWindow").style.display = 'block';
    document.getElementById("mappedMenuValidationResultsContent").innerHTML = renderContent;
  }


  function getSystemEquivalentItem(code, variant){

    var systemDefaultItem = '';

    if(systemMenu[code]){
      systemDefaultItem = systemMenu[code];
    }
    else{
      systemDefaultItem = "NOT_FOUND";
    }


    return systemDefaultItem;
  }


}


function getAlreadyMappedProduct(itemCode, variantSelected){
	
	if(ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode]){
		
		if(ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].isCustom){
			if(!variantSelected || variantSelected == undefined || variantSelected == ""){
				return "INCORRECT_VARIANT";
			}

			for(var n = 0; n < ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].customOptions.length; n++){
				if(ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].customOptions[n].customName == variantSelected){
				
					return {
						"code" : itemCode,
						"name" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].name,
						"price" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].customOptions[n].customPrice,
						"isCustom" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].isCustom,
						"variant" : variantSelected,
						"category" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].category
					}	

					break;
				}
			}


			return "INCORRECT_MAPPING";
		}
		else{
			return {
				"code" : itemCode,
				"name" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].name,
				"price" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].price,
				"isCustom" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].isCustom,
				"variant" : variantSelected,
				"category" : ALREADY_DOWNLOADED_MASTER_MENU_ITEMS[itemCode].category
			}
		}

	}

	return "INCORRECT_MAPPING";
}

function triggerMappedPriceChanges(element){

	var new_value = $(element).val();
	var original_value = $('#mappedOriginalItemPriceValue').text(); 
	
	if(new_value != original_value){
		document.getElementById("alreadyMappedProductPriceWarningText").style.display = 'inline-block';
	}
	else{
		document.getElementById("alreadyMappedProductPriceWarningText").style.display = 'none';
	}

	document.getElementById("mappingItemAddContinueButton").style.display = 'block';
}


function triggerProcessingMappedPriceChanges(element){

	var new_value = $(element).val();
	var original_value = $('#mappedProcessingOriginalItemPriceValue').text(); 
	
	if(new_value != original_value){
		document.getElementById("processingMappedProductPriceWarningText").style.display = 'inline-block';
	}
	else{
		document.getElementById("processingMappedProductPriceWarningText").style.display = 'none';
	}
}


function openItemForEditing(listIndex){

	//Clear cache
	window.localStorage.accelerate_temporary_mapped_item = ""; 

	if(!ALREADY_DOWNLOADED_MAPPED_MENU[listIndex]){
		showToast('Warning! No more details found.', '#e67e22');
		return '';
	}

	if(ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].systemCode != ""){

		var already_mapped_product = getAlreadyMappedProduct(ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].systemCode, ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].systemVariant);

		var renderContent = '';

		if(already_mapped_product == "INCORRECT_MAPPING"){
			renderContent = ''+
				'<div class="row">'+
					'<div class="col-sm-12">'+
					   '<h1 style="text-align: left; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: bold; font-family: \'Roboto\'; color: red">Error in Mapping <i class="fa fa-warning"></i></h1>'+
					   '<input type="hidden" id="mapping_added_item_code_hidden" value="0">'+
					   '<input type="hidden" id="mapping_added_item_variant_hidden" value="">'+
					   '<div class="mapItemMainHolder" style="background: red">'+
					   		'<p class="mapItemWindowItemName">Incorrect Mapping</p>'+
					   		'<p class="mapItemWindowCategory"><b>'+ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].systemCode+'</b> not found</p>'+
					   '</div>'+
					'</div>'+
				'</div>';
		}
		else if(already_mapped_product == "INCORRECT_VARIANT"){
			renderContent = ''+
				'<div class="row">'+
					'<div class="col-sm-12">'+
					   '<h1 style="text-align: left; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: bold; font-family: \'Roboto\'; color: red">Error in Mapping <i class="fa fa-warning"></i></h1>'+
					   '<input type="hidden" id="mapping_added_item_code_hidden" value="0">'+
					   '<input type="hidden" id="mapping_added_item_variant_hidden" value="">'+
					   '<div class="mapItemMainHolder" style="background: red">'+
					   		'<p class="mapItemWindowItemName">Incorrect Variant</p>'+
					   		'<p class="mapItemWindowCategory"><b>'+(ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].systemVariant != "" ? ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].systemVariant+' is Incorrect' : 'Variant Not Found')+'</b></p>'+
					   '</div>'+
					'</div>'+
				'</div>';
		}
		else{

			var itemHasPriceMapped = ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].mappedPrice != "" ? true : false;

			renderContent = ''+
				'<div class="row">'+
					'<div class="col-sm-12">'+
					   '<h1 style="text-align: left; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: bold; font-family: \'Roboto\'; color: #1abc80">Already Mapped <i class="fa fa-check-circle"></i></h1>'+
					   '<input type="hidden" id="mapping_added_item_code_hidden" value="'+already_mapped_product.code+'">'+
					   '<input type="hidden" id="mapping_added_item_variant_hidden" value="'+(already_mapped_product.isCustom ? already_mapped_product.variant : '')+'">'+
					   '<div class="mapItemMainHolder">'+
					   		'<p class="mapItemWindowItemName">'+already_mapped_product.name+( already_mapped_product.isCustom ? '<tag class="mapItemWindowVariant">('+already_mapped_product.variant+')</tag>' : '' )+'</p>'+
					   		'<p class="mapItemWindowCategory">'+already_mapped_product.category+'</p>'+
					   		'<div class="mapItemPriceContainer">'+
					   			'<tag class="inrMappedItem"><i class="fa fa-inr"></i></tag>'+
					   			'<input id="changePriceOfAlreadyMappedItem" onkeyup="triggerMappedPriceChanges(this)" value="'+(itemHasPriceMapped ? ALREADY_DOWNLOADED_MAPPED_MENU[listIndex].mappedPrice : already_mapped_product.price)+'" type="number">'+
					   			'<tag class="mappedOriginalItemPriceWarn" id="alreadyMappedProductPriceWarningText" style="'+(itemHasPriceMapped ? '' : 'display: none')+'">Original price is <i class="fa fa-inr"></i><b id="mappedOriginalItemPriceValue">'+already_mapped_product.price+'</b></tag>'+
					   		'</div>'+
					   '</div>'+
					'</div>'+
				'</div>';

			document.getElementById("mappingItemAddContinueButton").style.display = 'block';
		}

		document.getElementById("temporaryMappedItemRenderArea").innerHTML = renderContent;
	}
	else{
		document.getElementById("temporaryMappedItemRenderArea").innerHTML = '<p style="margin: 40px 0 0 0; font-size: 28px; font-weight: 300; color: #d2d6de; text-align: center;">Map any item from the menu</p>';
	}



	var mappedItem = ALREADY_DOWNLOADED_MAPPED_MENU[listIndex];

	$('#mapping_add_item_hidden_index').val(listIndex);
	$('#mapping_price_mapped_hidden_flag').val(mappedItem.mappedPrice != "" ? mappedItem.mappedPrice : 0);


	document.getElementById("mapItemFromSystemMenuTitle").innerHTML = '<tag style="background: #526079; padding: 5px 10px; color: #FFF; font-weight: bold; font-family: \'Roboto\'; border-radius: 3px;">'+mappedItem.mappedName+(mappedItem.mappedVariant != "" ? ' ('+mappedItem.mappedVariant+')' : '')+'</tag><tag style="font-weight: 300"> to map</tag>';
	document.getElementById("mapItemFromSystemMenuModal").style.display = 'block';


	if(mappedItem.systemCode != ""){
		$('#mapping_add_item_by_search').focus();
	}


	initMappingFromMenuSuggestion();
	initMappingFromMenuPunch();



	//Keyboard Shortcuts
	var easyActionTool = $(document).on('keydown',  function (e) {
            if($('#mapItemFromSystemMenuModal').is(':visible')) {
                 switch(e.which){
                  case 27:{ // Escape (Close)
                    mapItemFromSystemMenuHide();
                    easyActionTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm) 
                   	if($("#editPriceOfProcessingMappedItem").is(":focus") || $("#changePriceOfAlreadyMappedItem").is(":focus")){
                   		saveCurrentMappingData('OPEN_NEXT_INDEX');
                   	}
                    break;
                  }
                 }
            }
    });
}


function mapItemFromSystemMenuHide(){
	window.localStorage.accelerate_temporary_mapped_item = "";
	document.getElementById("mapItemFromSystemMenuModal").style.display = 'none';
}




function initMappingFromMenuPunch(){
		//Focus on to "Add item"
		$("#mapping_add_item_by_search").focus();

		/*Remove suggestions if focus out*/ /*TWEAK*/
		$("#mapping_add_item_by_search").focusout(function(){
			setTimeout(function(){ 
				$('#mappingSearchResultsRenderArea').html('');
			}, 300);	 /*delay added for the focusout to understand if modal is opened*/
		});
}


/*Auto Suggetion - MENU*/
function initMappingFromMenuSuggestion(){

	          	var mastermenu = ALREADY_DOWNLOADED_MASTER_MENU; 

	          	//Process whole menu (list of only Menu Items)
	          	var menu_processed = [];
	          	$.each(mastermenu, function(key_1, subMenu) {
					$.each(subMenu.items, function(key_2, items) {
						items.category = subMenu.category;
						menu_processed.push(items);
					});
				});


				/*Select on Arrow Up/Down */
				var li = $('#mappingSearchResultsRenderArea li');
				var liSelected = undefined;

				$('#mapping_add_item_by_search').keyup(function(e) {

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
					    	$('#mapping_add_item_by_search').focus().val($('#mapping_add_item_by_search').val());


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

				        $("#mappingSearchResultsRenderArea li").each(function(){
					        if($(this).hasClass("selected")){
					        	$(this).click();
					        }
					    });

				    }
				    else{

				    	liSelected = undefined

					    var searchField = $(this).val();
					    if (searchField === '') {
					        $('#mappingSearchResultsRenderArea').html('');
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

					    		if(!items.shortNumber){
					    			items.shortNumber = '';
					    		}

					    		items.itemCode = items.shortNumber.toString();

								if(items.itemCode.search(name_regex) != -1){
					    	 		tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="addItemMappingToTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
					    	 	}
					    	 	else if(items.shortCode.search(name_regex) != -1){
					    	 		tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="addItemMappingToTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
					    	 	}
					    	 	else{

					    	 			var item_name = items.name;

					    	 			if(item_name.search(name_regex) != -1){
					    	 				tabIndex = -1;
								  			itemsList += '<li class="ui-menu-item" onclick="addItemMappingToTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 			else if(item_name.search(regex) != -1){

					    	 				tabIndex = -1;
								  			itemsAppendList += '<li class="ui-menu-item" onclick="addItemMappingToTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 	}
					    });


						//Render the list
						var isSomeItemsFound = false; 
					    if(itemsList != '' || itemsAppendList != ''){
					    	isSomeItemsFound = true;
					    	$('#mappingSearchResultsRenderArea').html('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 320px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_itemSuggestions">'+itemsList+itemsAppendList+'</ul>');
					    }
					    else{

					    	var custom_template = 	'<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_itemSuggestions">'+
					    								'<span style="display: inline-block; padding: 8px 0 4px 8px; font-size: 12px; text-align: center; color: #c6c6c6; font-style: italic">No matching items found in the Menu.</span>'+ 
										    	   	'</ul>';
					    	
					    	$('#mappingSearchResultsRenderArea').html(custom_template);
					    }

					    if(isSomeItemsFound){
					    	var track_index = 0;
					    	$("#mappingSearchResultsRenderArea li").each(function(){

					    		if(track_index == 0){
					    			$(this).addClass("selected");
					    		}

					    		track_index++;
						    });
					    }

					    //Refresh dropdown list
					    li = $('#mappingSearchResultsRenderArea li');
					    if(isSomeItemsFound){
					    	liSelected = li.eq(0).addClass('selected');
					    }

					}
				});   

}



function addItemMappingToTempCart(encodedItem, category, optionalSource){

	var systemProductToMap = JSON.parse(decodeURI(encodedItem));

	if(systemProductToMap.isCustom){

		//Pop up
		var i = 0;
		var optionList = '';
		while(systemProductToMap.customOptions[i]){
			optionList = optionList + '<li class="easySelectTool_customItem" onclick="addCustomisationItemMapping(\''+systemProductToMap.name+'\', \''+systemProductToMap.category+'\', \''+systemProductToMap.code+'\', \''+systemProductToMap.customOptions[i].customPrice+'\', \''+systemProductToMap.customOptions[i].customName+'\')">'+
										'<a>'+systemProductToMap.customOptions[i].customName+'<tag class="spotlightCustomItemTick"><i class="fa fa-check"></i></tag> <tag style="float: right"><i class="fa fa-inr"></i>'+systemProductToMap.customOptions[i].customPrice+'</tag></a>'+
									  '</li>';
			i++;
		}
		
		document.getElementById("mapCustomisationsForItemModal").style.display ='block';
		document.getElementById("mapCustomisationsForItemTitle").innerHTML = "Choice of <b>"+systemProductToMap.name+"</b>";
		document.getElementById("customOptionsForMappingItemRender").innerHTML = '<ol class="rectangle-list">'+optionList+'</ol>';


          /*
            EasySelect Tool (LISTS)
          */
          var li = $('#customOptionsForMappingItemRender .easySelectTool_customItem');
          var liSelected = li.eq(0).addClass('selectCustomItem');

          var easySelectTool = $(document).on('keydown',  function (e) {
             
            if($('#customOptionsForMappingItemRender').is(':visible')) {

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
                    document.getElementById("mapCustomisationsForItemModal").style.display ='none';
                    easySelectTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)

                    $("#customOptionsForMappingItemRender .easySelectTool_customItem").each(function(){
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
	else if(!systemProductToMap.isCustom){
		
		saveMappingToLocalMemory(systemProductToMap, optionalSource)

		$('#mapping_add_item_by_search').val('');
		$('#mappingSearchResultsRenderArea').html('');  


		$('#editPriceOfProcessingMappedItem').focus();
		$('#editPriceOfProcessingMappedItem').select();

	}	

}



function mapCustomisationsForItemModalHIDE(){
	document.getElementById("mapCustomisationsForItemModal").style.display ='none';
}


function addCustomisationItemMapping(name, category, code, price, variant){

		var systemProductToMap = {};
		systemProductToMap.name = name;
		systemProductToMap.category = category;
		systemProductToMap.code = code;
		systemProductToMap.price = price;
		systemProductToMap.variant = variant;

		systemProductToMap.isCustom = true;

		saveMappingToLocalMemory(systemProductToMap);

		document.getElementById("mapCustomisationsForItemModal").style.display ='none';

		$('#mapping_add_item_by_search').val('');
		$('#mappingSearchResultsRenderArea').html('');
}



/*Add Item to Mapping Cart */
function saveMappingToLocalMemory(productToAdd, optionalSource){
	var mapped_product = {"name": productToAdd.name, "category": productToAdd.category, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "variant": productToAdd.variant, "code": productToAdd.code};
      
    window.localStorage.accelerate_temporary_mapped_item = JSON.stringify(mapped_product);

    renderTemporaryMappedItemPreview();
}





function renderTemporaryMappedItemPreview(){

	if(!window.localStorage.accelerate_temporary_mapped_item || window.localStorage.accelerate_temporary_mapped_item == ""){
		document.getElementById("temporaryMappedItemRenderArea").innerHTML = '<p style="margin: 40px 0 0 0; font-size: 28px; font-weight: 300; color: #d2d6de; text-align: center;">Map any item from the menu</p>';
		document.getElementById("mappingItemAddContinueButton").style.display = 'none';
		return '';
	}

	var mapped_product = JSON.parse(window.localStorage.accelerate_temporary_mapped_item);

	var mappedPriceAddedValue = $('#mapping_price_mapped_hidden_flag').val();


	var renderContent = ''+
		'<div class="row">'+
			'<div class="col-sm-12">'+
			   '<h1 style="text-align: left; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: bold; font-family: \'Roboto\'; color: #f3ae12">Mapping To</h1>'+
			   '<input type="hidden" id="mapping_added_item_code_hidden" value="'+mapped_product.code+'">'+
			   '<input type="hidden" id="mapping_added_item_variant_hidden" value="'+(mapped_product.isCustom ? mapped_product.variant : '')+'">'+
			   '<div class="mapItemMainHolder" style="background: #f3ae12">'+
			   		'<p class="mapItemWindowItemName">'+mapped_product.name+( mapped_product.isCustom ? '<tag class="mapItemWindowVariant">('+mapped_product.variant+')</tag>' : '' )+'</p>'+
			   		'<p class="mapItemWindowCategory">'+mapped_product.category+'</p>'+
			   		'<div class="mapItemPriceContainer">'+
			   			'<tag class="inrMappedItem"><i class="fa fa-inr"></i></tag>'+
			   			'<input id="editPriceOfProcessingMappedItem" onkeyup="triggerProcessingMappedPriceChanges(this)" value="'+(mappedPriceAddedValue == 0 ? mapped_product.price : mappedPriceAddedValue)+'" type="number">'+
			   			'<tag class="mappedOriginalItemPriceWarn" id="processingMappedProductPriceWarningText" style="'+(mappedPriceAddedValue == 0 ? 'display: none' : '')+'">Original price is <i class="fa fa-inr"></i><b id="mappedProcessingOriginalItemPriceValue">'+mapped_product.price+'</b></tag>'+
			   		'</div>'+
			   '</div>'+
			'</div>'+
		'</div>';

	document.getElementById("temporaryMappedItemRenderArea").innerHTML = renderContent;
	document.getElementById("mappingItemAddContinueButton").style.display = 'block';

	$('#editPriceOfProcessingMappedItem').focus();
	$('#editPriceOfProcessingMappedItem').select();
}


function saveCurrentMappingData(optionalFlag){
	

	//After successful completion, goto next index
	var currentListedIndex = $('#mapping_add_item_hidden_index').val();
	currentListedIndex = parseInt(currentListedIndex);

	var mapped_code = $('#mapping_added_item_code_hidden').val();
	if(mapped_code == 0){
		showToast('Incorrect Mapping: Please map a valid item from the menu', '#e67e22');
		return '';
	}

	var mapped_variant = $('#mapping_added_item_variant_hidden').val();
	var mapped_price = 0;

	if($('#changePriceOfAlreadyMappedItem').length == 0) {
  		mapped_price = $('#editPriceOfProcessingMappedItem').val(); 
	}
	else{
		mapped_price = $('#changePriceOfAlreadyMappedItem').val(); 
	}

	mapped_price = parseInt(mapped_price);

	if(isNaN(mapped_price) || mapped_price < 1){
		showToast('Invalid Price: Please add the correct price', '#e67e22');
		return '';	
	}


	//Check if there are actually any changes?
	var arleady_mapped_code = ALREADY_DOWNLOADED_MAPPED_MENU[currentListedIndex].systemCode;
	var arleady_mapped_variant = ALREADY_DOWNLOADED_MAPPED_MENU[currentListedIndex].systemVariant;
	var arleady_mapped_price = ALREADY_DOWNLOADED_MAPPED_MENU[currentListedIndex].mappedPrice;

	if(arleady_mapped_code == mapped_code && arleady_mapped_variant == mapped_variant && arleady_mapped_price == mapped_price){
		
	}
	else{

		//Submit Changes
		var menuTypeCode = window.localStorage.current_opened_menu_mapping ? window.localStorage.current_opened_menu_mapping : "";

	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_other_menu_mappings/MENU_'+menuTypeCode+'/',
	      timeout: 10000,
	      success: function(data) {
	        if(data._id != ""){

	        	var otherMenuUpdateData = data

	            var otherMenu = data.value;
	            otherMenu[currentListedIndex].systemCode = mapped_code;
	            otherMenu[currentListedIndex].systemVariant = mapped_variant;
	            otherMenu[currentListedIndex].mappedPrice = mapped_price;

	            ALREADY_DOWNLOADED_MAPPED_MENU = otherMenu;

	            otherMenuUpdateData.value = otherMenu;


		          	  	//Update on Server
		                $.ajax({
		                  type: 'PUT',
		                  url: COMMON_LOCAL_SERVER_IP+'/accelerate_other_menu_mappings/MENU_'+menuTypeCode+'/',
		                  data: JSON.stringify(otherMenuUpdateData),
		                  contentType: "application/json",
		                  dataType: 'json',
		                  timeout: 10000,
		                  success: function(data) {
		                  	  reRenderOtherMappedMenu();
		                  },
		                  error: function(data) {
		                    showToast('System Error: <b>'+menuTypeCode+'</b> mapping data was not updated', '#e74c3c');
	        				return '';
		                  }
		                });   

	        }
	        else{
	        	showToast('System Error: <b>'+menuTypeCode+'</b> Menu data not found. Please contact Accelerate Support.', '#e74c3c');
	        	return '';
	        }
	      },
	      error: function(data) {
	        showToast('System Error: <b>'+menuTypeCode+'</b> Menu data not found. Please contact Accelerate Support.', '#e74c3c');
	        return '';
	      }

	    });
	}   


	document.getElementById("mapItemFromSystemMenuModal").style.display = 'none';

	if(optionalFlag == 'OPEN_NEXT_INDEX'){
		openItemForEditing(currentListedIndex + 1);
	}
}


function reRenderOtherMappedMenu(){

	if(window.localStorage.current_opened_menu_mapping == "" || !window.localStorage.current_opened_menu_mapping){
		return '';
	}


    var otherMenuData = ALREADY_DOWNLOADED_MAPPED_MENU;
    var renderContent = '';

    var formatted_name_menu = (window.localStorage.current_opened_menu_mapping).toLowerCase();


    for(var n = 0; n < otherMenuData.length; n++){

      var systemItem = getSystemEquivalentItem(otherMenuData[n].systemCode, otherMenuData[n].systemVariant);
        
      if(systemItem == "NOT_FOUND"){

        if(otherMenuData[n].systemCode == ""){
        
          renderContent += '<tr role="row" class="selectMappedRow mappedItemsTableRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                            '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                            '<td class="mappedItemsTableCol" style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                            '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+ 
                            '<td style="color: red;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-warning"></i></td>'+
                            '<td style="background: red; color: #FFF; text-align: right;"></td>'+
                            '<td style="background: red; color: #FFF"><b>Not Mapped</b></td>'+
                            '<td style="background: red;"></td>'+
                          '</tr>';
        }
        else{
          renderContent += '<tr role="row" class="selectMappedRow mappedItemsTableRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                          '<td class="mappedItemsTableCol" style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+
                          '<td style="color: red;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-warning"></i></td>'+
                          '<td style="background: red; color: #FFF; text-align: right;"><b>'+otherMenuData[n].systemCode+'</b></td>'+
                          '<td style="background: red; color: #FFF"><b>Incorrect Mapping</b></td>'+
                          '<td style="background: red;"></td>'+
                        '</tr>';
        }
      }
      else{

        var equivalent_variant = "";
        var equivalent_price = "";

        if(systemItem.isCustom && otherMenuData[n].systemVariant != ""){
          for(var i = 0; i < systemItem.customOptions.length; i++){
            if(systemItem.customOptions[i].customName == otherMenuData[n].systemVariant){
              equivalent_variant = systemItem.customOptions[i].customName;
              equivalent_price = systemItem.customOptions[i].customPrice;
              break;
            }
          }

          if(equivalent_variant == ""){
            equivalent_variant = "VARIANT_MISMATCH";
          }
        }
        else if(systemItem.isCustom && otherMenuData[n].systemVariant == ""){
          equivalent_variant = "VARIANT_MISMATCH";
        }

        renderContent += '<tr role="row" class="selectMappedRow mappedItemsTableRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                          '<td class="mappedItemsTableCol" style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+
                          '<td style="color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-long-arrow-right"></i></td>'+
                          '<td style="text-align: right; font-weight: bold; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+systemItem.code+'</td>'+
                          '<td style="font-weight: 400; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+systemItem.name + (equivalent_variant != "" ? (equivalent_variant == "VARIANT_MISMATCH" ? ' <tag class="mappedInvalidVariant">INVALID VARIANT</tag>' : ' <tag class="mappedVariantTag">('+equivalent_variant+')</tag>') : '')+'</td>'+
                          '<td style="text-align: right; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(systemItem.isCustom ? (equivalent_price != "" ? '<i class="fa fa-inr"></i>'+equivalent_price : "") : '<i class="fa fa-inr"></i>'+systemItem.price)+'</td>'+
                        '</tr>';

      }
    } 

    if(renderContent == ""){
      renderContent = '<p style="margin: 30px 0 0 0; text-align: center; color: #ccc;">Oops! Validator did not return any results.</p>';
    }
    else{
      document.getElementById("mappedMenuValidationResultsContentHeader").innerHTML = ''+
                      '<tr>'+ 
                        '<td style="color: #FFF; background: #526079; font-weight: bold">#</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold; text-transform: capitalize">'+formatted_name_menu+' Name</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold; text-transform: capitalize">'+formatted_name_menu+' Price</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold"></td>'+
                        '<td colspan="3" style="color: #FFF; background: #1abc62; font-weight: bold; text-align: center;">System Mapping</td>'+
                      '</tr>';
    }


    document.getElementById("mappedMenuValidationResultsWindow").style.display = 'block';
    document.getElementById("mappedMenuValidationResultsContent").innerHTML = renderContent;


  function getSystemEquivalentItem(code, variant){

  	var systemMenu = ALREADY_DOWNLOADED_MASTER_MENU_ITEMS;

    var systemDefaultItem = '';

    if(systemMenu[code]){
      systemDefaultItem = systemMenu[code];
    }
    else{
      systemDefaultItem = "NOT_FOUND";
    }

    return systemDefaultItem;
  }

}


//Search Mapped Menu
function searchMappedMenuByName(element){

  var input, list, tr, td, i, txtValue;
  input = $(element).val();

  list = document.getElementById("mappedMenuValidationResultsContent");
  tr = list.getElementsByTagName("tr");

  var name_regex = new RegExp("^"+ input, "i");

  var atleastOneResultFlag = false;


  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;

      var suggestion_splits = txtValue.split(" ");
      var total_words = suggestion_splits.length;

      if(total_words == 1){
          if(txtValue.search(name_regex) != -1){

            $(tr[i]).removeClass('mappedResultsTableSearchHide');
            $(tr[i]).addClass('mappedResultsTableSearchShow');
            
            atleastOneResultFlag = true;
          } else {

            $(tr[i]).addClass('mappedResultsTableSearchHide');
            $(tr[i]).removeClass('mappedResultsTableSearchShow');

          }
      }
      else{
          if(txtValue.search(name_regex) != -1){
            
            $(tr[i]).removeClass('mappedResultsTableSearchHide');
            $(tr[i]).addClass('mappedResultsTableSearchShow');
            
            atleastOneResultFlag = true;
          
          } else {
              for(var n = 1; n < total_words; n++){
                  if(suggestion_splits[n].search(name_regex) != -1){
                      $(tr[i]).removeClass('mappedResultsTableSearchHide');
                      $(tr[i]).addClass('mappedResultsTableSearchShow');

                      atleastOneResultFlag = true;
                      break;
                  }

                  if(n == total_words - 1){
                    $(tr[i]).addClass('mappedResultsTableSearchHide');
                    $(tr[i]).removeClass('mappedResultsTableSearchShow');
                  }
              }  
                       
          }
      }

    }       
  }


  if(!atleastOneResultFlag){
    document.getElementById("mappedResultsSearchWarningText").innerText = 'No matching results found';
    document.getElementById("mappedMenuValidationResultsContentHeader").style.display = 'none';
  }
  else{
    document.getElementById("mappedResultsSearchWarningText").innerText = '';
    document.getElementById("mappedMenuValidationResultsContentHeader").style.display = '';
  }

}


function downloadMappedMenuAsExcel(){

}
