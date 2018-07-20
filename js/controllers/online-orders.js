
function renderLiveOnlineOrders(){
	$("#onlineOrders_incoming").removeClass("billTypeSelectionBox");
	$("#onlineOrders_live").addClass("billTypeSelectionBox");
	$("#onlineOrders_billed").removeClass("billTypeSelectionBox");

	document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Live Orders</h3>'+
																'<button class="btn btn-success btn-sm" style="float: right" onclick="renderLiveOnlineOrders()">Refresh</button>';


	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_ONLINE_ORDERS_MAPPING" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_ONLINE_ORDERS_MAPPING'){

	          	var onlineOrdersMapping = data.docs[0].value;

	          	console.log(onlineOrdersMapping)
	          	var items = '';
				for (var i=0; i<onlineOrdersMapping.length; i++){
					if(onlineOrdersMapping[i].systemStatus == 1){
						items = items + '<tr role="row" id="onlineLiveListing_'+onlineOrdersMapping[i].onlineOrder+'" class="onlineOrderListing" onclick="fetchSystemKOT(\''+onlineOrdersMapping[i].systemBill+'\', \''+onlineOrdersMapping[i].amount+'\')"> <td>'+onlineOrdersMapping[i].onlineOrder+'<br>'+(onlineOrdersMapping[i].type == 'TAKEAWAY' ? '<tag class="onlineTakeAwayTag">TAKE AWAY</tag>' : '<tag class="onlineDeliveryTag">DELIVERY</tag>')+'</td> <td>'+onlineOrdersMapping[i].name+'<br>'+onlineOrdersMapping[i].mobile+'</td>'+
										'<td><i class="fa fa-inr"></i> '+onlineOrdersMapping[i].amount+'</td> <td>'+getFancyTime(onlineOrdersMapping[i].lastUpdate)+'</td> </tr>';
				
					}
				}

				if(items != ''){
	        		document.getElementById("onlineOrders").innerHTML = items;
	        	}
	        	else{
	        		document.getElementById("itemInfo").innerHTML = '';
	        		document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Live Orders</td></tr>';
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

function fetchSystemKOT(kotID, amount){

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
          	renderSystemOrderDisplay(kot, amount);

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







function renderBilledOnlineOrders(){
	$("#onlineOrders_incoming").removeClass("billTypeSelectionBox");
	$("#onlineOrders_live").removeClass("billTypeSelectionBox");
	$("#onlineOrders_billed").addClass("billTypeSelectionBox");

	document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Billed Orders</h3>'+
																'<button class="btn btn-success btn-sm" style="float: right" onclick="renderBilledOnlineOrders()">Refresh</button>';

	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';

}

function renderOnlineOrders(){

	$("#onlineOrders_incoming").addClass("billTypeSelectionBox");
	$("#onlineOrders_live").removeClass("billTypeSelectionBox");
	$("#onlineOrders_billed").removeClass("billTypeSelectionBox");


	document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Incoming Orders</h3>'+
																'<button class="btn btn-success btn-sm" style="float: right" onclick="renderOnlineOrders()">Refresh</button>';

	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';



	var data = {
		"token": window.localStorage.loggedInAdmin,
		"status": 5
	}

	var items = '';

	showLoading(10000, 'Loading...');

	$.ajax({
		type: 'POST',
		url: 'https://www.zaitoon.online/services/posfetchonlineorders.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		timeout: 10000,
		success: function(data) {
			hideLoading();
			if(data.status){
				var i = 0;
				while(data.response[i]){
					items = items + '<tr role="row" id="onlineListing_'+data.response[i].orderID+'" class="onlineOrderListing" onclick="fetchOrderDetails(\''+data.response[i].orderID+'\')"> <td>'+data.response[i].orderID+'<br>'+(data.response[i].isTakeaway? '<tag class="onlineTakeAwayTag">TAKE AWAY</tag>' : '<tag class="onlineDeliveryTag">DELIVERY</tag>')+'</td> <td>'+data.response[i].userName+'<br>'+data.response[i].userID+'</td>'+
						'<td><i class="fa fa-inr"></i> '+data.response[i].amountPaid+'</td> <td>'+data.response[i].timePlace+'</td> </tr>';
				
					if(i == 0){
						fetchOrderDetails(data.response[i].orderID);
					}

					i++;
				}

				window.localStorage.lastOrderFetchData = JSON.stringify(data.response);
				if(items != ''){
	        		document.getElementById("onlineOrders").innerHTML = items;
	        	}
	        	else{
	        		document.getElementById("itemInfo").innerHTML = '';
	        		document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Incoming Orders</td></tr>';
	        	}
	        	document.getElementById("incomingOrdersCount").innerHTML = data.count;


			}
			else
			{
				document.getElementById("itemInfo").innerHTML = '';
				document.getElementById("incomingOrdersCount").innerHTML = data.count;
	        	document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Incoming Orders</td></tr>';
			}

			if(data.errorCode == 404){
				forceLogoutOnlineOrders(data.error);
			}

		},
		error: function(data){
			hideLoading();
			showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
		}
	});	

}



function forceLogoutOnlineOrders(customeError){
	window.localStorage.loggedInAdmin = "";
	
	if(customeError)
		showToast(customeError, '#e74c3c');
	else
		showToast('You have been logged out', '#e74c3c');
}



function fetchOrderDetails(orderID){

	var lastOrderFetchInfo = window.localStorage.lastOrderFetchData ?  JSON.parse(window.localStorage.lastOrderFetchData) : [];
	
	var i = 0;
	while(i < lastOrderFetchInfo.length){

		if(lastOrderFetchInfo[i].orderID == orderID){

			$("#onlineOrders>tr.onlineOrderListingBorder").removeClass("onlineOrderListingBorder");
			$("#onlineListing_"+orderID).addClass("onlineOrderListingBorder");


			document.getElementById("renderOnlineOrderArea").style.display = 'block';


			if(lastOrderFetchInfo[i].isPrepaid){
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #'+orderID+
									'<tag class="onlinePrepaid">PREPAID ORDER</tag> </h3> '+
									'<button class="btn btn-success btn-sm" style="float: right" onclick="punchOnlineOrderToKOT(\''+encodeURI(JSON.stringify(lastOrderFetchInfo[i]))+'\')">Punch Order</button>';
			}
			else{
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #'+orderID+
									'<tag class="onlineCOD">Cash on Delivery</tag> </h3> '+
									'<button class="btn btn-success btn-sm" style="float: right" onclick="punchOnlineOrderToKOT(\''+encodeURI(JSON.stringify(lastOrderFetchInfo[i]))+'\')">Punch Order</button>';
			}
				
			
			var j = 0;
			var allItems = "";
			var myCart = lastOrderFetchInfo[i].cart.items;

			while(j < myCart.length){
				allItems = allItems + '<tr> <td>'+(j+1)+'</td> <td>'+myCart[j].itemName+'</td> <td style="text-align: center">'+myCart[j].qty+'</td>'+
							'<td style="text-align: center"><i class="fa fa-inr"></i> '+myCart[j].itemPrice+'</td> <td style="text-align: right"><i class="fa fa-inr"></i> '+myCart[j].qty*myCart[j].itemPrice+'</td> </tr>'; 
				j++;
			}
			
			//Other Calculations
			allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Sub Total</b></td>  <td style="text-align: right"><i class="fa fa-inr"></i> '+lastOrderFetchInfo[i].amountPaid+'</td> </tr>';
			allItems = allItems +'<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Extras</b></td>  <td style="text-align: right"><i class="fa fa-inr"></i> 0</td> </tr>';
			allItems = allItems +'<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Discounts</b></td>  <td style="text-align: right"><i class="fa fa-inr"></i> 0</td> </tr>';

			if(lastOrderFetchInfo[i].isPrepaid){
				allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Amount Received</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i> '+lastOrderFetchInfo[i].amountPaid+'</b></td> </tr>';
			}
			else{
				allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Cash to be Collected</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i> '+lastOrderFetchInfo[i].amountPaid+'</b></td> </tr>';
			}
			
			
			document.getElementById("itemInfo").innerHTML = allItems;


			if(!lastOrderFetchInfo[i].isTakeaway){
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Delivery Address</p>'+
																			'<p class="deliveryText">'+lastOrderFetchInfo[i].deliveryAddress.name+'<br>'+lastOrderFetchInfo[i].deliveryAddress.flatNo+', '+lastOrderFetchInfo[i].deliveryAddress.flatName+
																			'<br>'+lastOrderFetchInfo[i].deliveryAddress.landmark+'<br>'+lastOrderFetchInfo[i].deliveryAddress.area+'</p> <p class="deliveryText">Mob. <b>'+lastOrderFetchInfo[i].deliveryAddress.contact+
																			'</b></p> </div>';
			}
			else{
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+
															'<p class="deliveryText" style="font-size: 21px;">'+lastOrderFetchInfo[i].userName+'</p> <p class="deliveryText" style="font-size: 21px;">Mob. '+lastOrderFetchInfo[i].userID+'</p> </div>';
			}

			if(lastOrderFetchInfo[i].comments && lastOrderFetchInfo[i].comments != ''){
				document.getElementById("commentsInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">COMMENTS TO CHEF</p> <p class="deliveryComment">'+lastOrderFetchInfo[i].comments+'</p> </div>';
			}
			else{
				document.getElementById("commentsInfo").innerHTML = '';
			}

			break;
		}

		i++;
	}

}

function renderSystemOrderDisplay(orderObj, onlineAmount){

	console.log(orderObj)
	orderObj.reference = 10066601;

			document.getElementById("renderOnlineOrderArea").style.display = 'block';
			$("#onlineOrders>tr.onlineOrderListingBorder").removeClass("onlineOrderListingBorder");
			$("#onlineLiveListing_"+orderObj.reference).addClass("onlineOrderListingBorder");


			if(orderObj.notes == "PREPAID"){
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #'+orderObj.reference+
									'<tag class="onlinePrepaid">PREPAID ORDER</tag> </h3> '+
									'<button class="btn btn-success btn-sm" style="float: right">Generate Bill</button>';
			}
			else{
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #'+orderObj.reference+
									'<tag class="onlineCOD">Cash on Delivery</tag> </h3> '+
									'<button class="btn btn-success btn-sm" style="float: right">Generate Bill</button>';
			}
				
			
			var j = 0;
			var allItems = "";
			var myCart = orderObj.cart;

			while(j < myCart.length){
				allItems = allItems + '<tr> <td>'+(j+1)+'</td> <td>'+myCart[j].name+'</td> <td style="text-align: center">'+myCart[j].qty+'</td>'+
							'<td style="text-align: center"><i class="fa fa-inr"></i> '+myCart[j].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i> '+myCart[j].qty*myCart[j].price+'</td> </tr>'; 
				j++;
			}
			
			//Other Calculations
			if(orderObj.notes == "PREPAID"){
				allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Amount Received</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i> '+onlineAmount+'</b></td> </tr>';
			}
			else{
				allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Cash to be Collected</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i> '+onlineAmount+'</b></td> </tr>';
			}
			
			document.getElementById("itemInfo").innerHTML = allItems;

			if(orderObj.orderDetails.modeType == 'DELIVERY'){
				var address = JSON.parse(decodeURI(orderObj.table));
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Delivery Address</p>'+
																			'<p class="deliveryText">'+address.name+'<br>'+address.flatNo+', '+address.flatName+
																			'<br>'+address.landmark+'<br>'+address.area+'</p> <p class="deliveryText">Mob. <b>'+address.contact+
																			'</b></p> </div>';
			}
			else{
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+
															'<p class="deliveryText" style="font-size: 21px;">'+orderObj.customerName+'</p> <p class="deliveryText" style="font-size: 21px;">Mob. '+orderObj.customerMobile+'</p> </div>';
			}
}




function punchOnlineOrderToKOT(encodedOrder){

	var order = JSON.parse(decodeURI(encodedOrder));
	console.log(order)

	var customerInfo = '';

	if(order.isTakeaway){ //Set default Takeaway Order
		customerInfo = {
			"name": order.userName,
			"mobile": order.userID,
			"mode": "Takeaway - Zatioon App",
			"modeType": "PARCEL",
			"mappedAddress": JSON.stringify(order.deliveryAddress),
			"reference": order.orderID,
			"notes": order.isPrepaid ? "PREPAID" : "COD",
			"prediscount": order.cart.cartDiscount
		}	
	}
	else{ //Set default Delivery Order
		customerInfo = {
			"name": order.userName,
			"mobile": order.userID,
			"mode": "Delivery - Zatioon App",
			"modeType": "DELIVERY",
			"mappedAddress": JSON.stringify(order.deliveryAddress),
			"reference": order.orderID,
			"notes": order.isPrepaid ? "PREPAID" : "COD",
			"prediscount": order.cart.cartDiscount
		}		
	}


	var cart = [];

	var n = 0;
	while(order.cart.items[n]){

		if(order.cart.items[n].isCustom){
		cart.push({
					"name": order.cart.items[n].itemName,
					"price": order.cart.items[n].itemPrice,
					"isCustom": true,
					"variant": order.cart.items[n].variant,
					"code": order.cart.items[n].itemCode,
					"qty": order.cart.items[n].qty
				});
		}
		else{
		cart.push({
					"name": order.cart.items[n].itemName,
					"price": order.cart.items[n].itemPrice,
					"isCustom": false,
					"code": order.cart.items[n].itemCode,
					"qty": order.cart.items[n].qty
				});
		}

		n++;
	}


	/* warn if unsaved order (Not editing case) */
	if(!window.localStorage.edit_KOT_originalCopy || window.localStorage.edit_KOT_originalCopy == ''){
	    if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){
	        showToast('Warning! There is an unsaved order being punched. Please complete it to continue.', '#e67e22');
	    	return '';
	    }    
	}
	
	if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
	    showToast('Warning! There is an order being modified. Please complete it to continue.', '#e67e22');
	    return '';
	     
	}

	window.localStorage.zaitoon_cart = JSON.stringify(cart);
	window.localStorage.customerData = JSON.stringify(customerInfo);
}