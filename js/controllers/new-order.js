
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
      		cart_products.push({"name": productToAdd.name, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "variant": productToAdd.variant, "code": productToAdd.code, "qty": 1});
      }

		window.localStorage.zaitoon_cart = JSON.stringify(cart_products)
}

function additemtocart(encodedItem, optionalSource){

	var productToAdd = JSON.parse(decodeURI(encodedItem));
	
	if(productToAdd.isCustom){
		//Pop up
		
		var i = 0;
		var optionList = '';
		while(productToAdd.customOptions[i]){
			optionList = optionList + '<li onclick="addCustomToCart(\''+productToAdd.name+'\', \''+productToAdd.code+'\', \''+productToAdd.customOptions[i].customPrice+'\', \''+productToAdd.customOptions[i].customName+'\', \'SUGGESTION\')">'+
										'<a>'+productToAdd.customOptions[i].customName+' <tag style="float: right"><i class="fa fa-inr"></i> '+productToAdd.customOptions[i].customPrice+'</tag></a>'+
									  '</li>';
			i++;
		}
		document.getElementById("customiseItemModal").style.display ='block';
		document.getElementById("customiseItemTitle").innerHTML = "Choice of <b>"+productToAdd.name+"</b>";
		document.getElementById("customOptionsList").innerHTML = '<ol class="rectangle-list">'+optionList+'</ol>';
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

function addCustomToCart(name, code, price, variant, optionalSource){

		var productToAdd = {};
		productToAdd.name = name;
		productToAdd.code = code;
		productToAdd.price = price;
		productToAdd.variant = variant;
		productToAdd.isCustom = true;

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

function deleteItem(item, isCustom, variant){

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

    window.localStorage.zaitoon_cart = JSON.stringify(cart_products)
    renderCart()

}

function changeqty(item, isCustom, variant){

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
							temp = document.getElementById("qty"+cart_products[i].code+cart_products[i].variant).value;
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



    window.localStorage.zaitoon_cart = JSON.stringify(cart_products)
    renderCart()
}


function renderCart(){

	//Render Cart Items based on local storage
	var cart_products = window.localStorage.zaitoon_cart ?  JSON.parse(window.localStorage.zaitoon_cart) : [];

	var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];
	
	var selectedBillingModeName = document.getElementById("customer_form_data_mode").value;
	var selectedBillingModeInfo = '';
	
	var n = 0;
	while(billing_modes[n]){
		if(billing_modes[n].name == selectedBillingModeName){
			selectedBillingModeInfo = billing_modes[n];
			break;
		}
		n++;
	}

		if(fs.existsSync('./data/static/billingparameters.json')) {
	      fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var params = JSON.parse(data);

	          	var selectedModeExtrasList = (selectedBillingModeInfo.extras).split(",");
	          	var cartExtrasList = [];

	          	var n = 0;
	          	var m = 0;
	          	while(selectedModeExtrasList[n]){
	          		m = 0;
	          		while(params[m]){	  
	          			if(selectedModeExtrasList[n] == params[m].name)        			
	          				cartExtrasList.push(params[m]);
	          			m++;
	          		}
	          		n++;
	          	}

	          	renderCartAfterProcess(cart_products, selectedBillingModeInfo, cartExtrasList)	          	

		}
		});
	    } else {
	      showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
	    }	

}

function renderCartAfterProcess(cart_products, selectedBillingModeInfo, selectedModeExtras){

	/*
		cart_products - cart of items 
		selectedBillingModeInfo - info relating to the particular mode like minBillAmount, isDiscountable? etc.
		selectedModeExtras - extras of taxes to be calculated		
	*/

	if(cart_products.length < 1){
		document.getElementById("cartTitleHead").innerHTML = '';
		document.getElementById("summaryDisplay").innerHTML = '';
		document.getElementById("summarySumDisplay").innerHTML = '<div style="height: 30vh !important;"></div>';

		document.getElementById("cartDetails").innerHTML = '<p style="font-size: 21px; margin: 50px 0 0 0 ; text-align: center; font-weight: 300; color: #b9b9b9; }">'+
							'<img style="width: 25%; margin: 20px 0px 5px 0px;" src="images/common/emptycart.png"><br>Order Cart is empty!</p>';
		
		document.getElementById("cartActionButtons").innerHTML = '';

		return 0;
	}

	var i = 0;
	var temp = '';
	var totqty = 0;
	var tot = 0;
	var grandPayableSum = 0;

	var hasUnsavedChanges = false;

	var variantName = '';
	var notifyIcon = '';


	//Editing Mode (Check for unsaved changes w.r.t Original Cart)
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		while(i < cart_products.length){
			variantName = '';
			notifyIcon = '';

			var tempItemCheck = checkForItemChanges(cart_products[i].code, cart_products[i].variant, cart_products[i].qty);

			switch(tempItemCheck){
				case 'QUANTITY_INCREASE':{
					notifyIcon = '<i class="fa fa-caret-up" style="color: #2ecc71; padding-left: 3px; font-size: 12px"></i>';
					hasUnsavedChanges = true;
					break;
				}
				case 'QUANTITY_DECREASE':{
					notifyIcon = '<i class="fa fa-caret-down" style="color: #c0392b; padding-left: 3px; font-size: 12px"></i>';
					break;
				}
				case 'NEW_ITEM':{
					notifyIcon = '<i class="fa fa-star" style="color: #ffa500; padding-left: 3px; font-size: 10px"></i>';
					hasUnsavedChanges = true;
					break;
				}
				default:{
					notifyIcon = '';
					break;
				}
			}

			totqty = totqty + cart_products[i].qty
			tot = tot + (cart_products[i].price*cart_products[i].qty)
			var itemrem = cart_products[i].code;

			if(cart_products[i].isCustom){
				variantName = ' ('+cart_products[i].variant+')';
			}

			temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button type="button" class="btn btn-block btn-xs edit btn-success" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td>'+
				'<td style="vertical-align: middle">'+
					'<input style="width: 80%; float: left" class="form-control input-qty kb-pad text-center rquantity" id="qty'+cart_products[i].code+cart_products[i].variant+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')">'+notifyIcon+
				'</td>'+
				'<td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
			i++
		}
	}
	else{ //New Order
		while(i < cart_products.length){
			variantName = '';
			totqty = totqty + cart_products[i].qty
			tot = tot + (cart_products[i].price*cart_products[i].qty)
			var itemrem = cart_products[i].code;

			if(cart_products[i].isCustom){
				variantName = ' ('+cart_products[i].variant+')';
			}

			temp = '<tr class="success"><td class="text-center"><i class="fa fa-trash-o tip pointer posdel" title="Remove" onclick="deleteItem(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></i></td><td><button type="button" class="btn btn-block btn-xs edit btn-success" onclick="openItemWiseCommentModal(\''+cart_products[i].code+'\', \''+( cart_products[i].isCustom? cart_products[i].variant : '')+'\')"><span class="sname">'+cart_products[i].name+variantName+((cart_products[i].hasOwnProperty('comments') && cart_products[i].comments != '') ? '<i class="fa fa-comment-o" style="float: right"></i>' : '')+'</span></button></td><td class="text-center"> <span class="text-right sprice"><i class="fa fa-inr"></i>'+cart_products[i].price+'</span></td><td><input class="form-control input-qty kb-pad text-center rquantity" id="qty'+cart_products[i].code+cart_products[i].variant+'" name="quantity[]" type="text" value="'+cart_products[i].qty+'" data-item="2" onchange="changeqty(\''+itemrem+'\', \''+cart_products[i].isCustom+'\', \''+cart_products[i].variant+'\')"></td><td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+cart_products[i].price*cart_products[i].qty+'</span></td></tr>' + temp
			i++
		}
	}

	if(checkIfItemDeleted() == 'DELETED'){
		hasUnsavedChanges = true;
		temp = '<tr class="success"><td colspan="5" style="color: #e74c3c; text-align: center"><i class="fa fa-exclamation-circle"></i> Removed some items</td></tr>' + temp;
	}
	
	document.getElementById("cartTitleHead").innerHTML = '<tr class="success cartTitleRow"> <th class="satu cartTitleRow" onclick="clearCartConsent()"><i class="fa fa-trash-o"></i></th><th class="cartTitleRow">Item</th> <th class="cartTitleRow">Price</th> <th class="cartTitleRow" >Qty</th> <th class="cartTitleRow">Subtotal</th>  </tr>';
	document.getElementById("cartDetails").innerHTML = temp;
	




	/*Calculate Taxes and Other Charges*/ 
	//---------------------------------//

	/* IMPORTANT NOTE:
		>> 	In editing mode, the Extras, Discounts, Other Charges has to be re-calculated w.r.t the original kot parameters.
			NOT w.r.t the modeType (VERY IMPORTANT).
		>>	Calculations w.r.t the modeType is done only while punching new order for display purposes.
		>>	Once KOT is punched, everything is w.r.t the data inside the KOT JSON!
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
          		if(selectedModeExtras[k].value != 0){
          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
          				tempExtraTotal = selectedModeExtras[k].value * tot/100;
          			}
          			else if(selectedModeExtras[k].unit == 'FIXED'){
          				tempExtraTotal = selectedModeExtras[k].value;
          			}
          		}

          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

          		otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+selectedModeExtras[k].name+' ('+(selectedModeExtras[k].unit == 'PERCENTAGE'? selectedModeExtras[k].value + '%': '<i class="fa fa-inr"></i>'+selectedModeExtras[k].value)+')</td><td width="15%" class="text-right cartSummaryRow"><i class="fa fa-inr"></i>'+tempExtraTotal+'</td>';
          	
          		otherChargesSum = otherChargesSum + tempExtraTotal;
          		
          	}
          }

		otherChargerRenderCount = otherChargerRenderCount + k;
		

		//Calculate Discount and Custom Extra

		discountValue = calculableOriginalKOT.discount.amount ? calculableOriginalKOT.discount.amount : 0;

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
          	otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+( otherCustomChargesValue != 0 ? calculableOriginalKOT.customExtras.type+' ('+(calculableOriginalKOT.customExtras.unit == 'PERCENTAGE'? calculableOriginalKOT.customExtras.value+'%' : 'Rs.'+calculableOriginalKOT.customExtras.value)+') ' : 'Other Charges' )+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(otherCustomChargesValue != 0 ? '<i class="fa fa-inr"></i>'+otherCustomChargesValue : '0')+'</td></tr>'+
          				'<tr class="info"><td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(discountValue != 0? '<tag style="color: #e74c3c">- <i class="fa fa-inr"></i>'+discountValue+'</tag>' : '0')+'</td>'+
          				'<td class="cartSummaryRow"></td><td class="cartSummaryRow"></td></tr>';
          }
          else{
          	otherCharges = otherCharges + '</tr> <tr class="info"><td width="35%" class="cartSummaryRow">'+( otherCustomChargesValue != 0 ? calculableOriginalKOT.customExtras.type+' ('+(calculableOriginalKOT.customExtras.unit == 'PERCENTAGE'? calculableOriginalKOT.customExtras.value+'%' : 'Rs.'+calculableOriginalKOT.customExtras.value)+') ' : 'Other Charges' )+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(otherCustomChargesValue != 0 ? '<i class="fa fa-inr"></i>'+otherCustomChargesValue : '0')+'</td>'+
          					'<td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">'+(discountValue != 0? '<tag style="color: #e74c3c">- <i class="fa fa-inr"></i>'+discountValue+'</tag>' : '0')+'</td></tr>';
          }
    }
    else{ //Not editing, new order being punched - Discount, other charges can not be applied at this stage -> both equals to 0
          
          if(selectedModeExtras.length > 0){

          	for(var k = 0; k < selectedModeExtras.length; k++){
          		if(k%2 == 0){
          			otherCharges = otherCharges + '</tr><tr class="info">';
          		}

          		var tempExtraTotal = 0;
          		if(selectedModeExtras[k].value != 0){
          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
          				tempExtraTotal = selectedModeExtras[k].value * tot/100;
          			}
          			else if(selectedModeExtras[k].unit == 'FIXED'){
          				tempExtraTotal = selectedModeExtras[k].value;
          			}
          		}

          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

          		otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+selectedModeExtras[k].name+' ('+(selectedModeExtras[k].unit == 'PERCENTAGE'? selectedModeExtras[k].value + '%': '<i class="fa fa-inr"></i>'+selectedModeExtras[k].value)+')</td><td width="15%" class="text-right cartSummaryRow"><i class="fa fa-inr"></i>'+tempExtraTotal+'</td>';
          	
          		otherChargesSum = otherChargesSum + tempExtraTotal;
          		
          	}
          }


          otherChargerRenderCount = otherChargerRenderCount + k;



          if(otherChargerRenderCount%2 == 0){
          	otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">Other Charges</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td></tr>'+
          				'<tr class="info"><td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td>'+
          				'<td class="cartSummaryRow"></td><td class="cartSummaryRow"></td></tr>';
          }
          else{
          	otherCharges = otherCharges + '</tr> <tr class="info"><td width="35%" class="cartSummaryRow">Other Charges</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td>'+
          					'<td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td></tr>';
          }
    }

          grandPayableSum = tot + otherChargesSum + otherCustomChargesValue - discountValue;

          grandPayableSum = Math.round(grandPayableSum * 100) / 100


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
                        '            Total Payable'+
                        '         </td>'+
                        '         <td class="text-right cartSumRow" colspan="2" ><span id="total-payable"><i class="fa fa-inr"></i>'+grandPayableSum+'</span></td>'+
                        '      </tr>'+ 
    					'   </tbody>'+
                        '</table>';




//Editing Mode
if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

	var editingKOTContent = window.localStorage.edit_KOT_originalCopy ? JSON.parse(window.localStorage.edit_KOT_originalCopy) : [];

 	//EDIT - Actions     
 	if(selectedBillingModeInfo.type == 'PARCEL' || selectedBillingModeInfo.type == 'TOKEN'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-12" style="padding: 0">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button type="button" style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="clearCurrentEditingOrder()">Hide</button>'+
                           '</div>'+
                        '</div>'+
                     '</div>';
 	}   
 	else if(selectedBillingModeInfo.type == 'DINE'){

 		if(hasUnsavedChanges){
			document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
	                        '<div class="col-xs-4" style="padding: 0;">'+
	                           '<div class="btn-group-vertical btn-block">'+
	                              '<button type="button" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelKOT()">Cancel</button>'+
	                              '<button type="button" class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" onclick="clearCurrentEditingOrder()">Hide</button>'+
	                           '</div>'+
	                        '</div>'+
	                        '<div class="col-xs-4" style="padding: 0 4px;">'+
	                           '<div class="btn-group-vertical btn-block">'+
	                              '<button type="button" style="margin-bottom: 4px; height:71px; background: #34495e !important" class="btn bg-purple btn-block btn-flat" onclick="undoChangesInKOT()">Undo Changes</button>'+
	                           '</div>'+
	                        '</div>'+
	                        '<div class="col-xs-4" style="padding: 0">'+
	                           '<div class="btn-group-vertical btn-block">'+
	                              '<button type="button" style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()">Print Changed KOT</button>'+
	                           '</div>'+
	                        '</div>'+                           
	                     '</div>';
 		}
 		else{
	 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
	                        '<div class="col-xs-4" style="padding: 0;">'+
	                           '<div class="btn-group-vertical btn-block">'+
	                              '<button type="button" style="margin-bottom: 4px" class="btn btn-danger btn-block btn-flat" onclick="cancelKOT()">Cancel</button>'+
	                              '<button type="button" class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" onclick="clearCurrentEditingOrder()">Hide</button>'+
	                           '</div>'+
	                        '</div>'+
	                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
	                           '<button type="button" class="btn btn-success btn-block btn-flat" onclick="compareChangesAndGnerateBillFromKOT(\''+editingKOTContent.KOTNumber+'\', \'ORDER_PUNCHING\')" style="height:71px;">Print Bill</button>'+
	                        '</div>'+                            
	                     '</div>';
 		}
 	}  		
}
else{
 	//NEW ORDER - Actions     
 	if(selectedBillingModeInfo.type == 'TOKEN'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button type="button" style="margin-bottom: 4px; height:71px; background: #bdc3c7 !important" class="btn bg-purple btn-block btn-flat" onclick="clearCurrentOrder()">Close</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
                           '<button type="button" class="btn btn-success btn-block btn-flat" id="payment" style="height:71px;" onclick="generateKOT()">Print KOT & Bill</button>'+
                        '</div>'+
                     '</div>';
 	}   
 	else if(selectedBillingModeInfo.type == 'PARCEL'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button type="button" style="margin-bottom: 4px" class="btn btn-warning btn-block btn-flat" onclick="addToHoldKOT()">Hold</button>'+
                              '<button type="button" class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" onclick="clearCurrentOrder()">Close</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
                           '<button type="button" class="btn btn-success btn-block btn-flat" id="payment" style="height:71px;" onclick="generateKOT()">Print KOT & Bill</button>'+
                        '</div>'+
                     '</div>';
 	}
 	else if(selectedBillingModeInfo.type == 'DINE'){
 		document.getElementById("cartActionButtons").innerHTML = '<div class="row">'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button type="button" style="margin-bottom: 4px" class="btn btn-warning btn-block btn-flat" onclick="addToHoldKOT()">Hold</button>'+
                              '<button type="button" class="btn bg-purple btn-block btn-flat" style="background: #bdc3c7 !important" onclick="clearCurrentOrder()">Close</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-8" style="padding: 0 0 0 4px;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button type="button" style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()">Print KOT</button>'+
                           '</div>'+
                        '</div>'+                    
                     '</div>';
 	}  
}

    
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


function compareChangesAndGnerateBillFromKOT(kotID, optionalPageRef){
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
			return 'ERROR';
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
                              '<button type="button" style="margin-bottom: 4px" class="btn btn-warning btn-block btn-flat" id="suspend">Hold</button>'+
                              '<button type="button" class="btn btn-danger btn-block btn-flat" id="reset">Cancel</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-4" style="padding: 0 4px;">'+
                           '<div class="btn-group-vertical btn-block">'+
                              '<button type="button" style="margin-bottom: 4px; height:71px; background: #2980b9 !important" class="btn bg-purple btn-block btn-flat" onclick="generateKOT()">Print KOT</button>'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-xs-4" style="padding: 0;">'+
                           '<button type="button" class="btn btn-success btn-block btn-flat" id="payment" style="height:71px;">Print Bill</button>'+
                        '</div>'+
                     '</div>';

*/

function cancelKOT(){
	//cancel the original_KOT in local storage
}

function clearCurrentOrder(){
	clearAllMetaData();
	renderCustomerInfo();
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

	
	var holding_orders = window.localStorage.holdingOrdersData ? JSON.parse(window.localStorage.holdingOrdersData): [];
	holding_orders.splice(id,1);

	window.localStorage.holdingOrdersData = JSON.stringify(holding_orders);
	showToast('Order has been moved off the Hold List', '#27ae60');


	var order = JSON.parse(decodeURI(encodedItem));
	window.localStorage.customerData = JSON.stringify(order.customerDetails);
	window.localStorage.zaitoon_cart = JSON.stringify(order.cartDetails);

	//Remove from Table mapping (if already added)
	if(order.customerDetails.modeType == 'DINE' && order.customerDetails.mappedAddress != ''){
			removeTableFromReserveList(order.customerDetails.mappedAddress)
	}


	renderCustomerInfo();
}

function confirmHoldOverWritingModal(encodedItem, id){
	document.getElementById("overWriteHoldOrderModal").style.display = 'block';
	document.getElementById("overWriteHoldOrderModalActions").innerHTML = '<button type="button" class="btn btn-default" onclick="confirmHoldOverWritingModalHide()" style="float: left">Cancel</button>'+
                  						'<button type="button" class="btn btn-danger" onclick="openHeldOrderConfirm(\''+encodedItem+'\', \''+id+'\')">Open Held Order</button>';
}

function confirmHoldOverWritingModalHide(){
	document.getElementById("overWriteHoldOrderModal").style.display = 'none';
}


function openHeldOrderConfirm(encodedItem, id){

	window.localStorage.edit_KOT_originalCopy = '';
	window.localStorage.zaitoon_cart = '';
	window.localStorage.customerData = '';

	addHoldOrderToCurrent(encodedItem);

	confirmHoldOverWritingModalHide();

}


function generateInvoice(){
	//generate Invoice for original_KOT
}

function clearCurrentEditingOrder(){
	//clear customer info, cart
	window.localStorage.zaitoon_cart = "";
	window.localStorage.customerData = "";

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

		var holding_orders = window.localStorage.holdingOrdersData ? JSON.parse(window.localStorage.holdingOrdersData): [];

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
		window.localStorage.holdingOrdersData = JSON.stringify(holding_orders);

		//Mark the table as 'Reserved' if added to hold list
		if(customerInfo.modeType == 'DINE' && customerInfo.mappedAddress != ''){
			addTableToReserveList(customerInfo.mappedAddress, 'Hold Order')
		}

		clearAllMetaData();
		renderCustomerInfo();

		showToast('The Order has been moved to Hold List', '#27ae60');
	}	
}

function removeAllHoldOrders(){
	window.localStorage.holdingOrdersData = '';
	renderCustomerInfo();
}




function addTableToReserveList(tableID, optionalComments){

		var comments = optionalComments;

		if(fs.existsSync('./data/static/tablemapping.json')) {
	      fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	       
	    } else {
	    	if(data == ''){ data = '[]'; }
	          var tableMapping = JSON.parse(data); 

	          var isUpdated = false;

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

	          		isUpdated = true;

	          		break;
	          	}
	          }

	          if(!isUpdated){
	          	tableMapping.push({ "table": tableID, "assigned": comments, "KOT": "", "status": 5, "lastUpdate": timestamp });
		      }

		       var newjson = JSON.stringify(tableMapping);
		       fs.writeFile('./data/static/tablemapping.json', newjson, 'utf8', (err) => {
		       }); 

		}
		});
	    }
}


function removeTableFromReserveList(tableID){
		if(fs.existsSync('./data/static/tablemapping.json')) {
	      fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	       
	    } else {
	    	if(data == ''){ data = '[]'; }
	          var tableMapping = JSON.parse(data); 

	          for(var i=0; i<tableMapping.length; i++){
	          	if(tableMapping[i].table == tableID){

	          		if(tableMapping[i].status != 5){
	          			return '';
	          		}

	          		tableMapping.splice(i,1);

	          		break;
	          	}
	          }

		       var newjson = JSON.stringify(tableMapping);
		       fs.writeFile('./data/static/tablemapping.json', newjson, 'utf8', (err) => {
		         
		       }); 

		}
		});
	    }
}




/*Clear cart*/
function clearCart(){
	window.localStorage.zaitoon_cart = "";
	renderCart();
	hideClearCartModal();
}

function clearCartConsent(){
	document.getElementById("clearCartConsentModal").style.display = "block";
}

function hideClearCartModal(){
	document.getElementById("clearCartConsentModal").style.display = "none";
}


/*customer info*/
function renderCustomerInfo(){

	//Check if New Order / Editing KOT
	var isEditingKOT = false;
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
		isEditingKOT = true;
		var kotCopy = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : {};
		document.getElementById("ongoingOrderTitle").innerHTML = '<tag class="blink_me">Running Order</tag> <tag style="float: right; font-weight: 300;">Table <b>#'+kotCopy.table+'</b></tag>';
	}
	else{

		//Check if any order in Hold List
		if(window.localStorage.holdingOrdersData && window.localStorage.holdingOrdersData != ''){
			
			var holding_orders = window.localStorage.holdingOrdersData ? JSON.parse(window.localStorage.holdingOrdersData): [];
			

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

				var displayAddress = holding_orders[n].customerDetails.mappedAddress;
				if(holding_orders[n].customerDetails.mappedAddress == ''){
					if(holding_orders[n].customerDetails.modeType =='DINE'){
						displayAddress = '<tag style="font-weight: 400">'+holding_orders[n].customerDetails.mode+'</tag>';
					}
					else if(holding_orders[n].customerDetails.modeType =='PARCEL'){
						displayAddress = '<tag style="font-weight: 400">'+holding_orders[n].customerDetails.mode+'</tag>';
					}
				}

				holdListRender += '<a href="#" onclick="addHoldOrderToCurrent(\''+encodeURI(JSON.stringify(holding_orders[n]))+'\')"><p class="holdTableName">'+displayAddress+
									'<tag class="holdTimeAgo">'+getFormattedTime(holding_orders[n].timestamp)+' ago</tag></p>'+
									'<p class="holdItemsBrief">'+itemList+'</p>'+
								  '</a>';
				n++;
			}

			if(holding_orders.length != 0){
				document.getElementById("ongoingOrderTitle").innerHTML = 'New Order'+
													        '<div class="holddropdown">'+
											                 	'<div class="holddropbtn">'+n+' '+(n == 1? 'Order': 'Orders')+' on Hold</div>'+
											                 	'<div class="holddropdown-content"><div class="holdContentArea">'+holdListRender+'</div>'+
											                 	'<div class="holdCancelButton" onclick="removeAllHoldOrders()">Remove All</div>'+
											                 	'</div>'+
											               	'</div>';
			}
			else{
				document.getElementById("ongoingOrderTitle").innerHTML = 'New Order'
			}
		}
		else{
			document.getElementById("ongoingOrderTitle").innerHTML = 'New Order'
		}
	}

	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	var billingModesInfo = {};


	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
	}




		if(fs.existsSync('./data/static/billingmodes.json')) {
	      fs.readFile('./data/static/billingmodes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to load Billing Modes. Please contact Accelerate Support.', '#e74c3c');
	    	renderCart();
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	billingModesInfo = JSON.parse(data);
	          	billingModesInfo.sort(); //alphabetical sorting 

	          	window.localStorage.billingModesData = data; /*For cart rendering purpose*/
	          	
				/*Billing modes not set or not rendering*/
				if(jQuery.isEmptyObject(billingModesInfo)){
					document.getElementById("orderCustomerInfo").innerHTML = '<p style="text-align: center; color: #dd4b39;">Billing Modes not set. <tag class="extrasSelButton" onclick="renderPage(\'bill-settings\', \'Bill Settings\'); openBillSettings(\'billingModes\')">Adding Billing Modes</tag> to continue</p>';
					showToast('Warning: Billing Modes are not set', '#e67e22');
					return '';
				}

				if(jQuery.isEmptyObject(customerInfo)){
					customerInfo.name = "";
					customerInfo.mobile = "";
					customerInfo.mode = "";
					customerInfo.modeType = "";
					customerInfo.mappedAddress = "";
					customerInfo.reference = "";
				}
				else{

					var modeOptions = '';
					var n = 0;
					while(billingModesInfo[n]){
						modeOptions = modeOptions + '<option value="'+billingModesInfo[n].name+'">'+billingModesInfo[n].name+'</option>';
						n++;
					}
					

					var selectMappedAddressButton = '';
					var tempModeType = customerInfo.modeType;
					
					if(customerInfo.mode == ""){ //Mode not set
						tempModeType = billingModesInfo[0].type; //First value in modes list - temporarily by default
					}

					//Ask for MappedAddress value
					if(!isEditingKOT){
						if(tempModeType == 'PARCEL'){ //ask for address
							selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag>';
							
							if(customerInfo.mappedAddress){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag class="btn btn-default" onclick="pickAddressForNewOrder(\''+customerInfo.mappedAddress+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}
						else if(tempModeType == 'DINE'){ //ask for table
							selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-danger" style="width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickTableForNewOrder()">Select Table</tag>';
							
							if(customerInfo.mappedAddress){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-default" onclick="pickTableForNewOrder(\''+customerInfo.mappedAddress+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}					
						else if(tempModeType == 'TOKEN'){ //assign token
							var tempToken = window.localStorage.lastPrintedToken;
							if(!tempToken || tempToken == ''){
								tempToken = 1;
							}
							customerInfo.mappedAddress = tempToken;
							selectMappedAddressButton = '<label class="cartCustomerLabel">Token No.</label><tag class="btn btn-default" onclick="setTokenManually()" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
						}
					}
					else{

						if(tempModeType == 'PARCEL'){ //ask for address
							selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag class="btn btn-danger" style=" width: 100%; text-overflow: ellipsis; overflow: hidden;" onclick="pickAddressForNewOrder()">Set Address</tag>';
							
							if(customerInfo.mappedAddress){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Address</label><tag class="btn btn-default" onclick="pickAddressForNewOrder(\''+customerInfo.mappedAddress+'\')" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}
						else if(tempModeType == 'DINE'){ //ask for table
							selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-danger disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">Not Set</tag>';
							
							if(customerInfo.mappedAddress){
								selectMappedAddressButton = '<label class="cartCustomerLabel">Table No.</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
							}
						}					
						else if(tempModeType == 'TOKEN'){ //assign token
							var tempToken = window.localStorage.lastPrintedToken;
							if(!tempToken || tempToken == ''){
								tempToken = 1;
							}
							customerInfo.mappedAddress = tempToken;
							selectMappedAddressButton = '<label class="cartCustomerLabel">Token No.</label><tag class="btn btn-default disabled" style="width: 100%; text-overflow: ellipsis; overflow: hidden;">'+customerInfo.mappedAddress+'</tag>';
						}						
					}	





			
					if(isEditingKOT){ //Editing KOT
					
					document.getElementById("orderCustomerInfo").innerHTML = '<div class="row" style="padding: 0 15px"> '+
			                                 '<div class="col-xs-8" style="padding: 0; padding-right: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<div class="input-group" style="width:100%;">'+
			                                       		 '<label class="cartCustomerLabel">Order Type</label>'+
			                                             '<input type="text" value="'+customerInfo.mode+'" id="customer_form_data_mode" class="form-control kb-text" disabled/>'+
			                                       '</div>'+
			                                       '<div style="clear:both;"></div>'+
			                                    '</div>'+
			                                ' </div>'+
			                                 '<div class="col-xs-4" style="padding: 0; padding-left: 2px">'+selectMappedAddressButton+
			                                 '</div> '+                       
			                           '</div>'+
			                           '<div class="row" style="padding: 0 15px">'+
			                                 '<div class="col-xs-6" style="padding: 0; padding-right: 2px">'+
			                                   ' <div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="text" onchange="changeCustomerInfo(\'mobile\')" value="'+customerInfo.mobile+'" id="customer_form_data_mobile" onkeyup="suggestCustomerInfoFromMobile(this)" class="form-control kb-text" placeholder="Guest Mobile" />'+
			                                    '</div>'+
			                                 '</div>   '+      			                           
			                                 '<div class="col-xs-6" style="padding: 0; padding-left: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="text" onchange="changeCustomerInfo(\'name\')" value="'+customerInfo.name+'" id="customer_form_data_name" class="form-control kb-text" placeholder="Guest Name" />'+
			                                    '</div>'+
			                                 '</div>'+               
			                           '</div>';
					}
					else{ //New Order
					
					document.getElementById("orderCustomerInfo").innerHTML = '<div class="row" style="padding: 0 15px"> '+
			                                 '<div class="col-xs-8" style="padding: 0; padding-right: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<div class="input-group" style="width:100%;">'+
			                                       		 '<label class="cartCustomerLabel">Order Type</label>'+
			                                             '<select name="group" onchange="changeCustomerInfo(\'mode\')" id="customer_form_data_mode" class="form-control input-tip select2">'+modeOptions+'</select>'+
			                                       '</div>'+
			                                       '<div style="clear:both;"></div>'+
			                                    '</div>'+
			                                ' </div>'+
			                                 '<div class="col-xs-4" style="padding: 0; padding-left: 2px">'+selectMappedAddressButton+
			                                 '</div> '+                       
			                           '</div>'+
			                           '<div class="row" style="padding: 0 15px">'+
			                                 '<div class="col-xs-6" style="padding: 0; padding-right: 2px">'+
			                                   ' <div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="text" onchange="changeCustomerInfo(\'mobile\')" value="'+customerInfo.mobile+'" id="customer_form_data_mobile" onkeyup="suggestCustomerInfoFromMobile(this)" class="form-control kb-text" placeholder="Guest Mobile" />'+
			                                    '</div>'+
			                                 '</div>   '+    			                           
			                                 '<div class="col-xs-6" style="padding: 0; padding-left: 2px">'+
			                                    '<div class="form-group" style="margin-bottom:5px;">'+
			                                       '<input type="text" onchange="changeCustomerInfo(\'name\')" value="'+customerInfo.name+'" id="customer_form_data_name" class="form-control kb-text" placeholder="Guest Name" />'+
			                                    '</div>'+
			                                 '</div>'+                 
			                           '</div>';
			        }	


			        document.getElementById("customer_form_data_mode").value = customerInfo.mode;

			        /*First dropdown item as default*/ /*TWEAK*/
			        if(customerInfo.mode == ""){
			        	$("#customer_form_data_mode").val($("#customer_form_data_mode option:first").val());
			        	customerInfo.modeType = billingModesInfo[0].type;
			        	customerInfo.mode = billingModesInfo[0].name;
			        }

			        window.localStorage.customerData = JSON.stringify(customerInfo);

			        renderCart();
				}
		}
		});
	    }
	    else{
	    	showToast('System Error: Unable to load Billing Modes. Please contact Accelerate Support.', '#e74c3c');
	    	renderCart();
	    }	

}

function suggestCustomerInfoFromMobile(inputElement){

	var mobileNumber = inputElement.value;

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
	      if(data.docs.length != 0){
	      	if(data.docs[0].name != ''){
	      		document.getElementById("customer_form_data_name").value = data.docs[0].name;
	      		changeCustomerInfo('name');
	      	}

	      	//Set Address if mode == 'PARCEL'
	      	if(data.docs[0].savedAddresses){
	      		var customerInfo = window.localStorage.customerData ? JSON.parse(window.localStorage.customerData) : [];

	      		if(customerInfo.modeType == 'PARCEL'){
	      			saveNewDeliveryAddressAuto(data.docs[0].savedAddresses[0]);
	      		}
	      	}

	      }
	    }
	  });  
	}
}

function changeCustomerInfo(type){
	var value = document.getElementById("customer_form_data_"+type).value;
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];


	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
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
			case "mode":{
				customerInfo.mode = value;

				//Set mode type
				var n = 0;
				while(billing_modes[n]){
					if(billing_modes[n].name == value){

						//reset address if type changed
						if(customerInfo.modeType != billing_modes[n].type){
							customerInfo.mappedAddress = "";
						}

						customerInfo.modeType = billing_modes[n].type;
						break;
					}
					n++;
				}

				window.localStorage.customerData = JSON.stringify(customerInfo);
				renderCart();
				renderCustomerInfo();
				return '';
			}
			case "reference":{
				customerInfo.reference = value;
				break;
			}										
		}

	window.localStorage.customerData = JSON.stringify(customerInfo);
	

	console.log('customer info changed')
}

function setCustomerInfoTable(tableID){
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
	}

	customerInfo.mappedAddress = tableID;

	window.localStorage.customerData = JSON.stringify(customerInfo);

	pickTableForNewOrderHide();
	renderCustomerInfo();
}



function renderCategoryTab(defaultTab){

		if(fs.existsSync('./data/static/menuCategories.json')) {
	      fs.readFile('./data/static/menuCategories.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Menu Categories data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var categories = JSON.parse(data);
	          	categories.sort(); //alphabetical sorting 
	          	var categoryTag = '';


				for (var i=0; i<categories.length; i++){
					if(categories[i] == defaultTab)
					{
						categoryTag = categoryTag + '<button type="button" class="btn btn-outline-sub activeCatTab" onclick="renderMenu(\''+categories[i]+'\')">'+categories[i]+'</button>'
					}	
					else{
						categoryTag = categoryTag + '<button type="button" class="btn btn-outline-sub" onclick="renderMenu(\''+categories[i]+'\')">'+categories[i]+'</button>'
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
		});
	    } else {
	      showToast('System Error: Unable to read Menu Categories data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}

function renderMenu(subtype){

		if(fs.existsSync('./data/static/mastermenu.json')) {
	      fs.readFile('./data/static/mastermenu.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {


	    /* PERSONALISATIONS */
		var showPhotosFlag = window.localStorage.appCustomSettings_ImageDisplay == 'true' ? true: false;


	          		var mastermenu = JSON.parse(data); 

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
								itemsInSubMenu = itemsInSubMenu + '<button onclick="additemtocart(\''+temp+'\')" type="button" type="button" class="btn btn-both btn-flat product"><span class="bg-img" style="background: none !important;"><img src="data/photos/menu/'+mastermenu[i].items[j].code+'.jpg" alt="'+mastermenu[i].items[j].name+'" style="width: 110px; height: 110px;"></span><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
							}
							else{
								itemsInSubMenu = itemsInSubMenu + '<button onclick="additemtocart(\''+temp+'\')" type="button" type="button" class="btn btn-both btn-flat product"><span class="bg-img"><div id="itemImage">'+getImageCode(mastermenu[i].items[j].name)+'</div></span><span><span>'+mastermenu[i].items[j].name+'</span></span></button>';
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
				measures.fullHeight = document.getElementById("fullRightPanel").offsetHeight;
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
		});
	    } else {
	      showToast('System Error: Unable to read Menu data. Please contact Accelerate Support.', '#e74c3c');
	    }	
	
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
					console.log(changed_cart_products[n].name+' x '+changed_cart_products[n].qty+' ('+(changed_cart_products[n].qty-original_cart_products[i].qty)+' More)');
				}
				else if(changed_cart_products[i].qty < original_cart_products[n].qty){ //qty decreased
					console.log(changed_cart_products[n].name+' x '+changed_cart_products[n].qty+' ('+(original_cart_products[n].qty-changed_cart_products[i].qty)+' Less)');
				}
				else{ //same qty
					console.log(original_cart_products[n].name+' x '+original_cart_products[n].qty);
				}

				break;
				
			}
			else if(original_cart_products[n].isCustom && (original_cart_products[n].code == changed_cart_products[i].code) && (original_cart_products[n].variant == changed_cart_products[i].variant)){
				
				//itemFound = true;

			}

			//Last iteration to find the item
			if(i == changed_cart_products.length-1){
				if(!itemFound){ //Item Deleted
					console.log(original_cart_products[n].name+' x 0 (Deleted)');
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
			if(m == original_cart_products.length-1){
				//console.log('** New Item: '+changed_cart_products[j].name)
				console.log(changed_cart_products[j].name+' x '+changed_cart_products[j].qty+' (New)');
			}
		} 

		j++;
	}

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
	
	var selectedBillingModeName = document.getElementById("customer_form_data_mode").value;
	var selectedBillingModeInfo = '';
	
	var n = 0;
	while(billing_modes[n]){
		if(billing_modes[n].name == selectedBillingModeName){
			selectedBillingModeInfo = billing_modes[n];
			break;
		}
		n++;
	}


		if(fs.existsSync('./data/static/billingparameters.json')) {
	      fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var params = JSON.parse(data);

	          	var selectedModeExtrasList = (selectedBillingModeInfo.extras).split(",");
	          	var cartExtrasList = [];

	          	var n = 0;
	          	var m = 0;
	          	while(selectedModeExtrasList[n]){
	          		m = 0;
	          		while(params[m]){	  
	          			if(selectedModeExtrasList[n] == params[m].name)        			
	          				cartExtrasList.push(params[m])
	          			
	          			m++;
	          		}
	          		n++;
	          	}

	          	generateKOTAfterProcess(cart_products, selectedBillingModeInfo, cartExtrasList)	          	

		}
		});
	    } else {
	      showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}


function generateKOTAfterProcess(cart_products, selectedBillingModeInfo, selectedModeExtras){
	/*Process Figures*/
	var subTotal = 0;

	var n = 0;
	while(cart_products[n]){
		subTotal = subTotal + cart_products[n].qty * cart_products[n].price;
		n++;
	}

		  /*Calculate Taxes and Other Charges*/ 
          var otherCharges = [];        
          var k = 0;

          if(selectedModeExtras.length > 0){
          	for(k = 0; k < selectedModeExtras.length; k++){

          		var tempExtraTotal = 0;
          		if(selectedModeExtras[k].value != 0){
          			if(selectedModeExtras[k].unit == 'PERCENTAGE'){
          				tempExtraTotal = selectedModeExtras[k].value * subTotal/100;
          			}
          			else if(selectedModeExtras[k].unit == 'FIXED'){
          				tempExtraTotal = selectedModeExtras[k].value;
          			}
          		}

          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

          		otherCharges.push({
			 		"name": selectedModeExtras[k].name,
					"value": selectedModeExtras[k].value,
					"unit": selectedModeExtras[k].unit,
					"amount": tempExtraTotal
          		})
          	}
          }


    //Get customer info.
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		showToast('Customer Details missing', '#e74c3c');
		return '';
	}

	if(customerInfo.mappedAddress == ''){
		showToast('Table Number or Address missing', '#e74c3c');
		return '';
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
   
      //Check if file exists

      fs.readFile('./data/static/lastKOT.txt', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read order related data. Please contact Accelerate Support.', '#e74c3c');
       } else{
          var num = parseInt(data) + 1;
          var kot = 'KOT' + num;
         

          var today = getCurrentTime('DATE');
          var time = getCurrentTime('TIME');

          var obj = {}; 
          obj.KOTNumber = kot;
          obj.orderDetails = orderMetaInfo;
          obj.table = customerInfo.mappedAddress;
          obj.customerName = customerInfo.name;
          obj.customerMobile = customerInfo.mobile; 
          obj.stewardName = loggedInStaffInfo.name;
          obj.stewardCode = loggedInStaffInfo.code;
          obj.orderStatus = 1;
          obj.date = today;
          obj.timePunch = time;
          obj.timeKOT = "";
          obj.timeBill = "";
          obj.timeSettle = "";
          obj.cart = cart_products;
          obj.specialRemarks = 'SPECIAL COMMENTS';
          obj.extras = otherCharges,
          obj.discount = {},
          obj.customExtras = {}

          var json = JSON.stringify(obj); //convert it back to json
          var file = './data/KOT/'+kot+'.json';
          fs.writeFile(file, json, 'utf8', (err) => {
              if(err){
				showToast('System Error: Unable to generate KOT. Please contact Accelerate Support.', '#e74c3c');
              }
              else{          
              	if(orderMetaInfo.modeType == 'DINE'){
              		addToTableMapping(obj.table, kot, obj.customerName);
              		showToast('#'+kot+' generated Successfully', '#27ae60');
		           	clearAllMetaData();
	              	renderCustomerInfo();
	              	$("#add_item_by_search").focus();

              	}
              	else if(orderMetaInfo.modeType == 'TOKEN'){
              		/*Increment Token Counter*/
              		var tempToken = window.localStorage.lastPrintedToken;
              		if(!tempToken || tempToken == ''){
              			tempToken = 1;
              		}
              		showToast('#'+kot+' generated Successfully', '#27ae60');
              		window.localStorage.lastPrintedToken = parseInt(tempToken) + 1;
              		clearAllMetaData();
              		renderCustomerInfo();
              		$("#add_item_by_search").focus();
              	}
              	else if(orderMetaInfo.modeType == 'PARCEL'){
              		showToast('#'+kot+' generated Successfully', '#27ae60');
              		clearAllMetaData();
              		renderCustomerInfo();
              		$("#add_item_by_search").focus();
              	}
              }
              	 
           });


          fs.writeFile("./data/static/lastKOT.txt", num, 'utf8', (err) => {
              if(err)
                 showToast('System Error: Unable to modify order related data. Please contact Accelerate Support.', '#e74c3c');
           });
       }
       });
}

function clearAllMetaData(){
	//to remove cart info, customer info
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

	customerInfo.name = "";
	customerInfo.mobile ="";
	customerInfo.mappedAddress = "";
	customerInfo.reference = "";

	window.localStorage.customerData = JSON.stringify(customerInfo);
	window.localStorage.zaitoon_cart = '';
}

function addToTableMapping(tableID, kotID, assignedTo){


          var today = new Date();
          var hour = today.getHours();
          var mins = today.getMinutes();

          if(hour<10) {
              hour = '0'+hour;
          } 

          if(mins<10) {
              mins = '0'+mins;
          }

		if(fs.existsSync('./data/static/tablemapping.json')) {
	      fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to map KOT and Table. Please contact Accelerate Support.', '#e74c3c');
	    } else {
	    	if(data == ''){ data = '[]'; }
	          var tableMapping = JSON.parse(data); 

	          var isUpdated = false;

	          var timestamp = getCurrentTime('TIME');

	          for(var i=0; i<tableMapping.length; i++){
	          	if(tableMapping[i].table == tableID){

	          		isUpdated = true;

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

	          if(!isUpdated){
	          	tableMapping.push({ "table": tableID, "assigned": assignedTo, "KOT": kotID, "status": 1, "lastUpdate": timestamp });
		      }

		       var newjson = JSON.stringify(tableMapping);
		       fs.writeFile('./data/static/tablemapping.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to map KOT and Table. Please contact Accelerate Support.', '#e74c3c');
		           }
		       }); 

		}
		});
	    } else {
	      showToast('System Error: Unable to map KOT and Table. Please contact Accelerate Support.', '#e74c3c');
	    }


}


function getTableLiveStatus(tableID){
	/*returns table occupancy data*/
	if(!window.localStorage.tableMappingData){
		return '';
	}

	var tableMapData = JSON.parse(window.localStorage.tableMappingData);

	var n = 0;
	while(tableMapData[n]){
		if(tableMapData[n].table == tableID){
			return tableMapData[n];
		}
		n++;
	}

	return '';
}

function pickTableForNewOrder(currentTableID){

			//PRELOAD TABLE MAPPING
		    if(fs.existsSync('./data/static/tablemapping.json')) {
		        fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
		      if (err){
		      } else {

		          	if(data == ''){ data = '[]'; }

		              var tableMapping = JSON.parse(data);
		              tableMapping.sort(); //alphabetical sorting 
		              window.localStorage.tableMappingData = JSON.stringify(tableMapping);

		              //PRELOAD TABLES
		    
						  if(fs.existsSync('./data/static/tables.json')) {
					        fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
					      if (err){
					          showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
					      } else {

					          if(data == ''){ data = '[]'; }

					              var tables = JSON.parse(data);
					              tables.sort(); //alphabetical sorting 


					             //PRELOAD TABLE SECTIONS
							    if(fs.existsSync('./data/static/tablesections.json')) {
							        fs.readFile('./data/static/tablesections.json', 'utf8', function readFileCallback(err, data){
							      if (err){
							          showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
							      } else {

							          if(data == ''){ data = '[]'; }

							              var tableSections = JSON.parse(data);
							              tableSections.sort(); //alphabetical sorting 

							              

							            if(0){

							            	
							              
							            }
							            else{
							              var renderSectionArea = '';

							              var n = 0;
							              while(tableSections[n]){
							        
							              	var renderTableArea = ''
							              	for(var i = 0; i<tables.length; i++){
							              		if(tables[i].type == tableSections[n]){

							              			var tableOccupancyData = getTableLiveStatus(tables[i].name);

							              			if(tableOccupancyData){ /*Occuppied*/
														if(tableOccupancyData.status == 1 || tableOccupancyData.status == 2){
							              				renderTableArea = renderTableArea + '<tag class="tableTileRedDisable">'+
																				            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																				            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo">Occuppied</tag>'+
																				        	'</tag>';	
														}									
														else if(tableOccupancyData.status == 5){
															if(currentTableID != '' && currentTableID == tables[i].name){
								              				renderTableArea = renderTableArea + '<tag class="tableTileBlue" onclick="setCustomerInfoTable(\''+tables[i].name+'\')">'+
																					            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																					            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ""? "For "+tableOccupancyData.assigned : "-")+'</tag>'+
																					            '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																					        	'</tag>';	
															}	
															else{
								              				renderTableArea = renderTableArea + '<tag class="tableReserved" onclick="setCustomerInfoTable(\''+tables[i].name+'\')">'+
																					            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																					            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ""? "For "+tableOccupancyData.assigned : "-")+'</tag>'+
																					            '<tag class="tableInfo">Reserved</tag>'+
																					        	'</tag>';	
															}

														}									
														else{
							              				renderTableArea = renderTableArea + '<tag class="tableTileRedDisable">'+
																				            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																				            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo">Occuppied</tag>'+
																				        	'</tag>';											
														}


							              			}
							              			else{

							              				if(currentTableID != '' && currentTableID == tables[i].name){
							              					renderTableArea = renderTableArea + '<tag onclick="setCustomerInfoTable(\''+tables[i].name+'\')" class="tableTileBlue">'+
																				            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																				            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
																				        	'</tag>';
														}	
														else{
															renderTableArea = renderTableArea + '<tag onclick="setCustomerInfoTable(\''+tables[i].name+'\')" class="tableTileGreen">'+
																				            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																				            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
																				            '<tag class="tableInfo">Free</tag>'+
																				        	'</tag>';
														}							        	              				
							              			}

							              		}
							              	}

							              	renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
																	   '<h1 class="seatingPlanHead">'+tableSections[n]+'</h1>'+
																	   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
																	    '</div>'+
																	'</div>'

							              	n++;
							              }
							              
							              document.getElementById("pickTableForNewOrderModalContent").innerHTML = renderSectionArea;		            	
							              document.getElementById("pickTableForNewOrderModal").style.display = 'block';	
							            }
							    }
							    });
							      } else {
							        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
							      } 

					    }
					    });
					      } else {
					        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
					      } 


		    }
		    });
		     }
}


function pickTableForNewOrderHide(){
	document.getElementById("pickTableForNewOrderModalContent").innerHTML = '';
	document.getElementById("pickTableForNewOrderModal").style.display = 'none';
}


/*Set Delivery address*/
function pickAddressForNewOrder(currentAddress){
	document.getElementById("pickAddressForNewOrderModal").style.display = 'block';

	if(currentAddress){
		currentAddress = currentAddress.replace(/, /g, '\n');
		document.getElementById("delivery_address_parcel").value = currentAddress;
	}
}

function saveNewDeliveryAddress(){
	var address = document.getElementById("delivery_address_parcel").value;
	address = address.replace(/\n/g, ', ');
	address = address.replace(/, ,/g, ','); /*TWEAK*/
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(address != ''){
		customerInfo.mappedAddress = address;
		window.localStorage.customerData = JSON.stringify(customerInfo);
		pickAddressForNewOrderHide();
		renderCustomerInfo();
	}
	else{
		showToast('Warning: Delivery Address is empty', '#e67e22');                                 
	}
}

function saveNewDeliveryAddressAuto(address){
	address = address.replace(/\n/g, ', ');
	address = address.replace(/, ,/g, ','); /*TWEAK*/
	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(address != ''){
		customerInfo.mappedAddress = address;
		window.localStorage.customerData = JSON.stringify(customerInfo);
		pickAddressForNewOrderHide();
		renderCustomerInfo();
	}
}

function pickAddressForNewOrderHide(){
	document.getElementById("pickAddressForNewOrderModal").style.display = 'none';
}


/*Set Token No.*/
function setTokenManually(){
	var lastToken = window.localStorage.lastPrintedToken;

	if(!lastToken || lastToken == ''){
		lastToken = 1;
	}

	document.getElementById("next_token_value_set").value = lastToken;
	document.getElementById("setTokenOptionsModal").style.display = 'block';
}

function setTokenManuallyHide(){
	document.getElementById("setTokenOptionsModal").style.display = 'none';
}

function setTokenManuallySave(){
	var lastToken = window.localStorage.lastPrintedToken;

	if(!lastToken || lastToken == ''){
		lastToken = 1;
	}

	var token = document.getElementById("next_token_value_set").value;

	if(token == ''){
		token = 1;
	}
	else if(lastToken == token){
		//do nothing
	}
	else{
		//save new token
		window.localStorage.lastPrintedToken = token;
	}




	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
	}

	customerInfo.mappedAddress = token;

	window.localStorage.customerData = JSON.stringify(customerInfo);

	setTokenManuallyHide();
	renderCustomerInfo();
}

function restartTokenManuallySave(){
	window.localStorage.lastPrintedToken = 1;


	var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
	
	if(jQuery.isEmptyObject(customerInfo)){
		customerInfo.name = "";
		customerInfo.mobile = "";
		customerInfo.mode = "";
		customerInfo.modeType = "";
		customerInfo.mappedAddress = "";
		customerInfo.reference = "";
	}

	customerInfo.mappedAddress = 1;

	setTokenManuallyHide();
	renderCustomerInfo();
}


/*Add item-wise comments*/
function addCommentToItem(itemCode, variant){

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
	showToast('Comment saved successfully', '#27ae60');
	hideItemWiseCommentModal();
	renderCart();

	$("#add_item_by_search").focus();
}

function openItemWiseCommentModal(itemCode, variant){

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

		if(fs.existsSync('./data/static/savedcomments.json')) {
	      fs.readFile('./data/static/savedcomments.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 
	          	var modesTag = '';

				for (var i=0; i<modes.length; i++){
					modesTag = modesTag + '<button type="button" style="margin-right: 5px" class="btn btn-outline" onclick="addFromSuggestions(\''+modes[i]+'\')">'+modes[i]+'</button>';
        		}

				if(!modesTag)
					document.getElementById("savedCommentsSuggestions").innerHTML = '';
				else
					document.getElementById("savedCommentsSuggestions").innerHTML = modesTag;
		}
		});
	    }


	    document.getElementById("itemWiseCommentsModal").style.display = 'block';
	    document.getElementById("itemWiseCommentsModalTitle").innerHTML = "Comments for <b>"+itemTitle+"</b>"+variantTitle;
	    document.getElementById("itemWiseCommentsModalActions").innerHTML = '<button type="button" class="btn btn-default" onclick="hideItemWiseCommentModal()" style="float: left">Cancel</button>'+
               									'<button id="itemWiseCommentsModalActions_SAVE" type="button" class="btn btn-success" onclick="addCommentToItem(\''+itemCode+'\', \''+variant+'\')" style="float: right">Save Comment</button>';

        $("#add_item_wise_comment").focus();

        var duplicateClick = false;
        $('#add_item_wise_comment').keyup(function(e) {
			if (e.which === 13) {
				if(duplicateClick){
					$('#itemWiseCommentsModalActions_SAVE').click();
				}
				else{
					duplicateClick = true;
				}
			}
        });
}

function addFromSuggestions(suggestion){
	document.getElementById("add_item_wise_comment").value = suggestion;
}

function hideItemWiseCommentModal(){
	document.getElementById("itemWiseCommentsModal").style.display = 'none';
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

		if(fs.existsSync('./data/static/mastermenu.json')) {
	      fs.readFile('./data/static/mastermenu.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	    	return '';
	        
	    } else {
	          	
	          	var mastermenu = JSON.parse(data);

				    /*Select on Arrow Up/Down */
					var li = $('#searchResultsRenderArea li');

					var liSelected = undefined;

				$('#add_item_by_search').keyup(function(e) {



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
					    var renderContent = '<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow: scroll">';
					    var count = 0;
					    var tabIndex = 1;
					    var itemsList = '';

					    $.each(mastermenu, function(key_1, subMenu) {
					    	
					    	itemsList = '';
					    	count = 0;
					    	$.each(subMenu.items, function(key_2, items) {

						        if ((items.name.search(regex) != -1)) {
						        	tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="additemtocart(\''+encodeURI(JSON.stringify(items))+'\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')</li>'
						            count++;
						            tabIndex++;
						        }
						           		

					    	 });

					    	if(count > 0){
					    		renderContent += '<label class="menuSuggestionSubMenu">'+subMenu.category+'</label>'+itemsList;
					    	}

					    });

					    renderContent += '</ul>';

					    $('#searchResultsRenderArea').html(renderContent);

					    //Refresh dropdown list
					    li = $('#searchResultsRenderArea li');
					}

				});




		}
		});
	    } else {
	      return '';
	    }		

}