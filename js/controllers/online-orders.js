/* STATUS CODES
onlineStatus 
	0 - Not Confirmed
	1 - Confirmed
	2 - Completed/Dispatched

systemStatus
	1 - KOT Punched
	2 - Bill Generated
	3 - Bill Settled
*/



function renderOnlineOrders(){

	$("#onlineOrders_incoming").addClass("billTypeSelectionBox");
	$("#onlineOrders_live").removeClass("billTypeSelectionBox");
	$("#onlineOrders_completed").removeClass("billTypeSelectionBox");


	document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Pending Orders</h3>'+
																'<button class="btn btn-success btn-sm" id="triggerClick_refreshOnlineButton_Pending" style="float: right" onclick="renderOnlineOrders()">Refresh</button>';

	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("onlineOrders").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';

	displayOrderCounts();


	var data = {
		"token": window.localStorage.loggedInAdmin,
		"status": 0
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
		success: function(netdata) {
			hideLoading();
			if(netdata.status){

				//Online Content
				var i = 0;
				while(netdata.response[i]){

					netdata.response[i].orderSource = 'ZAITOON';
					console.log('AM HARD CODED!')

					items = items + '<tr role="row" id="onlineListing_'+netdata.response[i].orderID+'" class="onlineOrderListing" onclick="fetchOrderDetails(\''+netdata.response[i].orderID+'\')"> <td>'+netdata.response[i].orderID+'<br>'+(netdata.response[i].isTakeaway? '<tag class="onlineTakeAwayTag">TAKE AWAY</tag>' : '<tag class="onlineDeliveryTag">DELIVERY</tag>')+'</td> <td><tag style="display: block">'+netdata.response[i].userName+'</tag><tag style="display: block">'+netdata.response[i].userID+'<tag></td>'+
						'<td><tag style="display: block; text-align: center"><i class="fa fa-inr"></i>'+netdata.response[i].amountPaid+'</tag><tag style="display: block; text-align: center !important">'+(netdata.response[i].isPrepaid ? '<tag style="color: #545454; font-size: 10px;">Prepaid</tag>' : '<tag style="color: #1abc62; font-size: 10px;">Cash</tag>')+'</tag></td> <td><tag style="display: block">'+netdata.response[i].timePlace+'</tag><type class="orderSourceLabel" style="'+getSourceClass(netdata.response[i].orderSource)+'">'+netdata.response[i].orderSource+'</type></td> </tr>';

					i++;
				}			


				window.localStorage.lastOrderFetchData = JSON.stringify(netdata.response);
				
				if(items != ''){
				    document.getElementById("onlineOrders").innerHTML = items;
				}
				else{
				   	document.getElementById("itemInfo").innerHTML = '';
				    document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Pending Orders</td></tr>';
				}
				
				document.getElementById("incomingOrdersCount").innerHTML = netdata.response.length;
				//End of Online Content

			}
			else
			{
				document.getElementById("itemInfo").innerHTML = '';
				document.getElementById("incomingOrdersCount").innerHTML = netdata.count;
	        	document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Pending Orders</td></tr>';
			}

			if(netdata.errorCode == 404 || netdata.errorCode == 400){
				document.getElementById("itemInfo").innerHTML = '';
				document.getElementById("incomingOrdersCount").innerHTML = '..';
	        	document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Pending Orders</td></tr>';

				forceLogoutOnlineOrders(netdata.error);
			}

		},
		error: function(data){
			hideLoading();
			showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
		}
	});	

}




function renderLiveOnlineOrders(){

	$("#onlineOrders_incoming").removeClass("billTypeSelectionBox");
	$("#onlineOrders_live").addClass("billTypeSelectionBox");
	$("#onlineOrders_completed").removeClass("billTypeSelectionBox");

	document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Confirmed Orders</h3>'+
																'<button class="btn btn-success btn-sm" style="float: right" id="triggerClick_refreshOnlineButton_Live" onclick="renderLiveOnlineOrders()">Refresh</button>';


	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("onlineOrders").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';


	displayOrderCounts();


                var requestData = { "selector" :{ "onlineStatus": 1 }}

                $.ajax({
                  type: 'POST',
                  url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/_find',
                  data: JSON.stringify(requestData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    if(data.docs.length > 0){

                    	var onlineOrdersMapping = data.docs;



			          	var items = '';
						for (var i=0; i<onlineOrdersMapping.length; i++){
							items = items + '<tr role="row" id="onlineLiveListing_'+onlineOrdersMapping[i].onlineOrder+'" class="onlineOrderListing" onclick="fetchSystemOrder(\''+encodeURI(JSON.stringify(onlineOrdersMapping[i]))+'\')"> <td>'+onlineOrdersMapping[i].onlineOrder+'<br>'+(onlineOrdersMapping[i].type == 'DELIVERY'? '<tag class="onlineDeliveryTag">DELIVERY</tag>' : '<tag class="onlineTakeAwayTag">TAKE AWAY</tag>')+'</td> <td><tag style="display: block">'+onlineOrdersMapping[i].name+'</tag><tag style="display: block">'+onlineOrdersMapping[i].mobile+'<tag></td>'+
								'<td><tag style="display: block; text-align: center;">'+(onlineOrdersMapping[i].amount ? '<i class="fa fa-inr"></i>'+onlineOrdersMapping[i].amount : '')+'</tag><tag style="display: block; text-align: center !important">'+((onlineOrdersMapping[i].modeOfPayment).toUpperCase() == 'PREPAID' ? '<tag style="color: #545454; font-size: 10px;">Prepaid</tag>' : '<tag style="color: #1abc62; font-size: 10px;">Cash</tag>')+'</tag></td> <td><tag style="display: block">'+getFancyTime(onlineOrdersMapping[i].timePunch)+'</tag><type class="orderSourceLabel" style="'+getSourceClass(onlineOrdersMapping[i].source)+'">'+onlineOrdersMapping[i].source+'</type></td> </tr>';
						}

						if(items != ''){
			        		document.getElementById("onlineOrders").innerHTML = items;
			        	}
			        	else{
			        		document.getElementById("itemInfo").innerHTML = '';
			        		document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Confirmed Orders</td></tr>';
			        	}
                    }
                    else{
						document.getElementById("itemInfo").innerHTML = '';
			        	document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Confirmed Orders</td></tr>';
                    }
                  },
			      error: function(data) {
			        showToast('System Error: Unable to read Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
			      }

                });  
}




function undoFilterDateOnlineOrders(){
	window.localStorage.onlineOrders_filterDate = '';
	renderCompletedOnlineOrders();
}

function applyFilterDateOnlineOrders(){
	window.localStorage.onlineOrders_filterDate = $('#onlineOrderDateSelectionOnDateValue').val();
	renderCompletedOnlineOrders();
}

function openFilterDateOnlineOrders(){
	window.localStorage.onlineOrders_filterDate = getCurrentTime('DATE_DD-MM-YY');
	renderCompletedOnlineOrders();
}

function renderCompletedOnlineOrders(){

	$("#onlineOrders_incoming").removeClass("billTypeSelectionBox");
	$("#onlineOrders_live").removeClass("billTypeSelectionBox");
	$("#onlineOrders_completed").addClass("billTypeSelectionBox");

	var todayDate = getCurrentTime('DATE_DD-MM-YY');
	var filterDateApplied = window.localStorage.onlineOrders_filterDate ? window.localStorage.onlineOrders_filterDate : '';


	if(filterDateApplied == ''){
		filterDateApplied = todayDate;
		document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Today\'s Completed Orders<tag class="onlineOrderDateSelection" onclick="openFilterDateOnlineOrders()"><i class="fa fa-calendar"></i></tag></h3>'+
																'<button class="btn btn-success btn-sm" style="float: right" id="triggerClick_refreshOnlineButton_Completed" onclick="renderCompletedOnlineOrders()">Refresh</button>';
	}
	else{
		document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Completed Orders on <input type="text" class="onlineOrderDateSelectionOnDate" id="onlineOrderDateSelectionOnDateValue" value="'+filterDateApplied+'" onchange="applyFilterDateOnlineOrders()"><tag class="onlineOrderDateSelection" onclick="undoFilterDateOnlineOrders()"><i class="fa fa-undo"></i></tag></h3>';
	
		var options = {
			maxDate: "+0D", 
			dateFormat: "dd-mm-yy"
		};

		var $j = jQuery.noConflict();
		$j( "#onlineOrderDateSelectionOnDateValue" ).datepicker(options);
	}		



	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("onlineOrders").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';

	displayOrderCounts();

    var requestData = { "selector" :{ "onlineStatus": 2, "systemDate": filterDateApplied }} //Show only todays completed orders be default

                $.ajax({
                  type: 'POST',
                  url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/_find',
                  data: JSON.stringify(requestData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    if(data.docs.length > 0){

                    	var onlineOrdersMapping = data.docs;

			          	var items = '';
						for (var i=0; i<onlineOrdersMapping.length; i++){
							items = items + '<tr role="row" id="onlineLiveListing_'+onlineOrdersMapping[i].onlineOrder+'" class="onlineOrderListing" onclick="fetchSystemOrder(\''+encodeURI(JSON.stringify(onlineOrdersMapping[i]))+'\')"> <td>'+onlineOrdersMapping[i].onlineOrder+'<br>'+(onlineOrdersMapping[i].type == 'DELIVERY'? '<tag class="onlineDeliveryTag">DELIVERY</tag>' : '<tag class="onlineTakeAwayTag">TAKE AWAY</tag>')+'</td> <td><tag style="display: block">'+onlineOrdersMapping[i].name+'</tag><tag style="display: block">'+onlineOrdersMapping[i].mobile+'<tag></td>'+
								'<td><tag style="display: block; text-align: center;">'+(onlineOrdersMapping[i].amount ? '<i class="fa fa-inr"></i>'+onlineOrdersMapping[i].amount : '')+'</tag><tag style="display: block; text-align: center !important">'+((onlineOrdersMapping[i].modeOfPayment).toUpperCase() == 'PREPAID' ? '<tag style="color: #545454; font-size: 10px;">Prepaid</tag>' : '<tag style="color: #1abc62; font-size: 10px;">Cash</tag>')+'</tag></td> <td><tag style="display: block">'+getFancyTime(onlineOrdersMapping[i].timePunch)+'</tag><type class="orderSourceLabel" style="'+getSourceClass(onlineOrdersMapping[i].source)+'">'+onlineOrdersMapping[i].source+'</type></td> </tr>';
						}

						if(items != ''){
			        		document.getElementById("onlineOrders").innerHTML = items;
			        	}
			        	else{
			        		document.getElementById("itemInfo").innerHTML = '';
			        		document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Completed Orders</td></tr>';
			        	}
                    }
                    else{
						document.getElementById("itemInfo").innerHTML = '';
			        	document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Completed Orders</td></tr>';
                    }
                  },
			      error: function(data) {
			        showToast('System Error: Unable to read Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
			      }

                });  
}




function fetchSystemOrder(encodedMapping){

	var mappingObject = JSON.parse(decodeURI(encodedMapping));
	var requestID = mappingObject.systemBill;

	if(mappingObject.systemStatus == 1){ //Fetch KOT
	    var requestData = { "selector" :{ "KOTNumber": requestID }}

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
	          	renderSystemOrderDisplay(kot, mappingObject);

	        }
	        else{
	          showToast('Not Found Error: #'+mappingObject.systemBill+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
	          
	          //Show remove mapping option
	          showRemoveInvoiceMapping(mappingObject);
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });  
	}
	else if(mappingObject.systemStatus == 2){ //Fetch Bill
		var billNum = parseInt(requestID);
	    var requestData = { "selector" :{ "billNumber": billNum }}

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_find',
	      data: JSON.stringify(requestData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {
	        if(data.docs.length > 0){

	          	var bill = data.docs[0];
	          	renderSystemOrderDisplay(bill, mappingObject);

	        }
	        else{
	          showToast('Not Found Error: Bill #'+billNum+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
	       	
	       	  //Show remove mapping option
	          showRemoveInvoiceMapping(mappingObject);
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Bill data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    }); 
	} 	
	else if(mappingObject.systemStatus == 3){ //Fetch Bill
		var billNum = parseInt(requestID);
	    var requestData = { "selector" :{ "billNumber": billNum }}

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_find',
	      data: JSON.stringify(requestData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {
	        if(data.docs.length > 0){

	          	var bill = data.docs[0];
	          	renderSystemOrderDisplay(bill, mappingObject);

	        }
	        else{
	          showToast('Not Found Error: Bill #'+billNum+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
	        
	          //Show remove mapping option
	          showRemoveInvoiceMapping(mappingObject);

	        }
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Bill data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    }); 
	} 	
	else{
		showToast('System Error: Unable to render the order. Please contact Accelerate Support.', '#e74c3c');
		return '';
	}

}


function showRemoveInvoiceMapping(mappingObject, optionalPageRef){
	document.getElementById("removeOnlineOrderInvoiceModal").style.display = 'block';
	document.getElementById("removeOnlineOrderInvoiceText").innerHTML = 'This order #'+mappingObject.onlineOrder+' was Cancelled/Removed. Do you want to erase this mapping?';
	document.getElementById("removeOnlineOrderInvoiceConsent").innerHTML = '<button  class="btn btn-default" onclick="showRemoveInvoiceMappingHide()" style="float: left">Hide</button>'+
                                '<button  class="btn btn-danger" onclick="removeMappingFromFile(\''+mappingObject._id+'\', \''+mappingObject._rev+'\')">Erase Mapping</button>';
	
}

function showRemoveInvoiceMappingHide(){
	document.getElementById("removeOnlineOrderInvoiceModal").style.display = 'hide';
}

function removeMappingFromFile(id, revID){

	showRemoveInvoiceMappingHide();

    $.ajax({
      type: 'DELETE',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/'+id+'?rev='+revID,
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        renderLiveOnlineOrders();
      },
      error: function(data) {
        showToast('Server Warning: Unable to modify Online Orders. Please contact Accelerate Support.', '#e67e22');
      }
    }); 
}



function displayOrderCounts(){

				var todayDate = getCurrentTime('DATE_DD-MM-YY');

                $.ajax({
                  type: 'GET',
                  url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/_design/filter-by/_view/status?startkey=[1,"01-01-2018"]&endkey=[1,"'+todayDate+'"]',
                  timeout: 10000,
                  success: function(data) {
                  	if(data.rows.length > 0){
                  		document.getElementById("liveOrdersCount").innerHTML = data.rows[0].value;
                  	}
                  	else{
                  		document.getElementById("liveOrdersCount").innerHTML = 0;
                  	}
                  },
			      error: function(data) {
			        showToast('System Error: Unable to read Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
			      }

                }); 


                $.ajax({
                  type: 'GET',
                  url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/_design/filter-by/_view/status?startkey=[2,"'+todayDate+'"]&endkey=[2,"'+todayDate+'"]',
                  timeout: 10000,
                  success: function(data) {
                  	if(data.rows.length > 0){
                  		document.getElementById("completedOrdersCount").innerHTML = data.rows[0].value;
                  	}
                  	else{
                  		document.getElementById("completedOrdersCount").innerHTML = 0;
                  	}
                  },
			      error: function(data) {
			        showToast('System Error: Unable to read Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
			      }

                }); 	
}


function getSourceClass(source){

	if(source == 'SWIGGY'){
		return 'background: #f37f1c';
	}
	else if(source == 'ZAITOON'){
		return 'background: #49575f; border-bottom: 2px solid #d4412f;';
	}
	else if(source == 'UBER EATS'){
		return 'background: #2eb768';
	}
	else if(source == 'ZOMATO'){
		return 'background: #e23a25';
	}
	else if(source == 'FOOD PANDA'){
		return 'background: #bf9c4d; border-bottom: 2px solid #6f5957;';
	}
	else{
		return 'background: #3c8dbc';
	}
	
}


function forceLogoutOnlineOrders(customeError){
	window.localStorage.loggedInAdmin = "";
	
	if(customeError)
		showToast(customeError, '#e74c3c');
	else
		showToast('You have been logged out', '#e74c3c');

	checkLogin();
}



function fetchOrderDetails(orderID){

	var lastOrderFetchInfo = window.localStorage.lastOrderFetchData ?  JSON.parse(window.localStorage.lastOrderFetchData) : [];
	
	var i = 0;
	while(i < lastOrderFetchInfo.length){

		if(lastOrderFetchInfo[i].orderID == orderID){

			$("#onlineOrders>tr.onlineOrderListingBorder").removeClass("onlineOrderListingBorder");
			$("#onlineListing_"+orderID).addClass("onlineOrderListingBorder");


			document.getElementById("renderOnlineOrderArea").style.display = 'block';

			lastOrderFetchInfo[i].orderSource = 'ZAITOON';
			console.log('AM HARD CODED TOOOO!')

			if(lastOrderFetchInfo[i].isPrepaid){
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderID+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
									'<tag class="onlinePrepaid">PREPAID ORDER</tag> <type class="orderSourceExpLabel" style="'+getSourceClass(lastOrderFetchInfo[i].orderSource)+'">'+lastOrderFetchInfo[i].orderSource+' - '+(lastOrderFetchInfo[i].isTakeaway ? 'TAKE AWAY' : 'DELIVERY')+'</type> </h3> '+
									'<button class="btn btn-success btn-sm" style="float: right" onclick="punchOnlineOrderToKOT(\''+encodeURI(JSON.stringify(lastOrderFetchInfo[i]))+'\')">Punch Order</button>';
			}
			else{
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderID+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
									'<tag class="onlineCOD">Cash on Delivery</tag> <type class="orderSourceExpLabel" style="'+getSourceClass(lastOrderFetchInfo[i].orderSource)+'">'+lastOrderFetchInfo[i].orderSource+' - '+(lastOrderFetchInfo[i].isTakeaway ? 'TAKE AWAY' : 'DELIVERY')+'</type> </h3> '+
									'<button class="btn btn-success btn-sm" style="float: right" onclick="punchOnlineOrderToKOT(\''+encodeURI(JSON.stringify(lastOrderFetchInfo[i]))+'\')">Punch Order</button>';
			}

			var statusHeader = ''+
				'<div class="row">'+
				  '<div class="col-sm-12">'+
				      '<p style="color: #656565; margin: 0px; font-size: 12px">'+
				          '<i class="fa fa-clock-o"></i> Placed at <b class="ng-binding">'+lastOrderFetchInfo[i].timePlace+'</b>'+
				          '<date style="float: right">'+lastOrderFetchInfo[i].date+'</date>'+
				      '</p>'+
				  '</div>'+
				'</div>';		
				
			document.getElementById("statusHeaderBar").innerHTML = statusHeader;	


			
			var j = 0;
			var allItems = "";
			var myCart = lastOrderFetchInfo[i].cart.items;

			while(j < myCart.length){
				allItems = allItems + '<tr> <td>'+(j+1)+'</td> <td>'+myCart[j].itemName+(myCart[j].isCustom ? '<tag style="color: #ff8100; font-size: 80%; margin-left: 5px;">'+myCart[j].variant+'</tag>' : '')+'</td> <td style="text-align: center">'+myCart[j].qty+'</td>'+
							'<td style="text-align: center"><i class="fa fa-inr"></i>'+myCart[j].itemPrice+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+myCart[j].qty*myCart[j].itemPrice+'</td> </tr>'; 
				j++;
			}
			
			//Other Calculations
			allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Sub Total</b></td>  <td style="text-align: right"><i class="fa fa-inr"></i>'+lastOrderFetchInfo[i].cart.cartTotal+'</td> </tr>';
			allItems = allItems +'<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Extras</b></td>  <td style="text-align: right"><i class="fa fa-inr"></i>'+lastOrderFetchInfo[i].cart.cartExtra+'</td> </tr>';
			allItems = allItems +'<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Discounts</b></td>  <td style="text-align: right">'+(lastOrderFetchInfo[i].cart.cartDiscount != 0 ? '- <i class="fa fa-inr"></i>'+lastOrderFetchInfo[i].cart.cartDiscount : '<i class="fa fa-inr"></i>0')+'</td> </tr>';

			if(lastOrderFetchInfo[i].isPrepaid){
				allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Total Amount Received</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i>'+lastOrderFetchInfo[i].amountPaid+'</b></td> </tr>';
			}
			else{
				allItems = allItems + '<tr style="background: #fcfcfc"> <td></td><td></td> <td colspan="2"><b>Cash to be Collected</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i>'+lastOrderFetchInfo[i].amountPaid+'</b></td> </tr>';
			}
			
			
			document.getElementById("itemInfo").innerHTML = allItems;


			if(!lastOrderFetchInfo[i].isTakeaway){
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Delivery Address</p>'+
																			'<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].deliveryAddress.name+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag><br><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].deliveryAddress.flatNo+', '+lastOrderFetchInfo[i].deliveryAddress.flatName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
																			'<br><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].deliveryAddress.landmark+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag><br><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].deliveryAddress.area+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p> <p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].deliveryAddress.contact+'</tag><tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag></tag>'+
																			'</b></p> </div>';
			}
			else{
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+
															'<p class="deliveryText" style="font-size: 21px;"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].userName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p> <p class="deliveryText" style="font-size: 21px;">Mob. <tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].userID+'</tag><tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag></tag></p> </div>';
			}

			if(lastOrderFetchInfo[i].comments && lastOrderFetchInfo[i].comments != ''){
				document.getElementById("commentsInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">COMMENTS TO CHEF</p> <p class="deliveryComment"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+lastOrderFetchInfo[i].comments+'</tag><tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag></tag></p> </div>';
			}
			else{
				document.getElementById("commentsInfo").innerHTML = '';
			}

			break;
		}

		i++;
	}

}

function renderSystemOrderDisplay(orderObj, mappingObject){

			document.getElementById("renderOnlineOrderArea").style.display = 'block';
			document.getElementById("responseActionsBar").innerHTML = '';

			$("#onlineOrders>tr.onlineOrderListingBorder").removeClass("onlineOrderListingBorder");
			$("#onlineLiveListing_"+orderObj.orderDetails.reference).addClass("onlineOrderListingBorder");

			var actionButton = '';

			if(mappingObject.systemStatus == 1){
				actionButton = '<button class="btn btn-success btn-sm" style="float: right" onclick="generateBillFromKOT(\''+orderObj.KOTNumber+'\', \'ONLINE_ORDERS\');">Generate Bill</button>';				
			}
			else if(mappingObject.systemStatus == 2){
				actionButton = '<button class="btn btn-success btn-sm" style="float: right" onclick="onlineOrderEasySettleBill(\''+orderObj.billNumber+'\')">Settle Bill</button>';	
			}
			else if(mappingObject.systemStatus == 3){
				actionButton = '<span class="btn btn-default" style="float: right; color: gray !important; background: none !important; border: none !important">Invoice #<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderObj.billNumber+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></span>';	
			}

			if(orderObj.orderDetails.onlineOrderDetails.paymentMode == "PREPAID"){
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderObj.orderDetails.reference+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
									'<tag class="onlinePrepaid">PREPAID ORDER</tag> <type class="orderSourceExpLabel" style="'+getSourceClass(orderObj.orderDetails.onlineOrderDetails.orderSource)+'">'+(orderObj.orderDetails.onlineOrderDetails.orderSource ? orderObj.orderDetails.onlineOrderDetails.orderSource+' - ' : '')+(orderObj.orderDetails.modeType == 'DELIVERY' ? 'DELIVERY' : 'TAKE AWAY')+'</type> </h3> '+ actionButton
			}
			else{
				document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderObj.orderDetails.reference+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
									'<tag class="onlineCOD">Cash on Delivery</tag> <type class="orderSourceExpLabel" style="'+getSourceClass(orderObj.orderDetails.onlineOrderDetails.orderSource)+'">'+(orderObj.orderDetails.onlineOrderDetails.orderSource ? orderObj.orderDetails.onlineOrderDetails.orderSource+' - ' : '')+(orderObj.orderDetails.modeType == 'DELIVERY' ? 'DELIVERY' : 'TAKE AWAY')+'</type> </h3> '+ actionButton
			}

			var statusHeader = ''+
				'<div class="row">'+
				  '<div class="col-sm-12">'+
				      '<p style="color: #656565; margin: 0px; font-size: 12px">'+
				          '<i class="fa fa-clock-o"></i> Punched at <b class="ng-binding">'+getFancyTime(orderObj.timePunch)+'</b>'+
				          '<tag style="'+(orderObj.timeBill && orderObj.timeBill != '' ? '' : 'display: none')+'"> <i class="fa fa-check-square-o" style="padding-left: 10px"></i>  Billed at <b class="ng-binding">'+getFancyTime(orderObj.timeBill)+'</b></tag>'+
				          '<tag style="'+(mappingObject.agentName && mappingObject.agentName != '' ? '' : 'display: none')+'"> <i class="fa fa-person" style="padding-left: 10px"></i>  Dispated through <b class="ng-binding">'+mappingObject.agentName+'</b> (Mob. '+mappingObject.agentNumber+')</tag>'+
				          '<tag style="'+(mappingObject.type == 'PARCEL' ? '' : 'display: none')+'"> <i class="fa fa-gift" style="padding-left: 10px"></i>  Ready at <b class="ng-binding">'+getFancyTime(mappingObject.timeDispatch)+'</b></tag>'+
				          '<date style="float: right">'+orderObj.date+'</date>'+
				      '</p>'+
				  '</div>'+
				'</div>';		
				
			document.getElementById("statusHeaderBar").innerHTML = statusHeader;	


			var j = 0;
			var allItems = "";
			var myCart = orderObj.cart;
			var totalSum = 0;

			while(j < myCart.length){
				allItems = allItems + '<tr> <td>'+(j+1)+'</td> <td>'+myCart[j].name+(myCart[j].isCustom ? '<tag style="color: #ff8100; font-size: 80%; margin-left: 5px;">'+myCart[j].variant+'</tag>' : '')+'</td> <td style="text-align: center">'+myCart[j].qty+'</td>'+
							'<td style="text-align: center"><i class="fa fa-inr"></i>'+myCart[j].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+myCart[j].qty*myCart[j].price+'</td> </tr>'; 
				
				totalSum += myCart[j].price * myCart[j].qty;

				j++;
			}


          /*Other Charges*/ 
          var otherChargesSum = 0;        
          var otherCharges = '';
          var otherChargerRenderCount = 1;
          var i = 0;

          otherCharges = '<tr class="info">';

          if(orderObj.extras.length > 0){
            for(i = 0; i < orderObj.extras.length; i++){
              otherCharges = otherCharges + '<tr style="background: #fefefe; font-size: 90%"> <td></td><td></td> <td colspan="2">'+orderObj.extras[i].name+' ('+(orderObj.extras[i].unit == 'PERCENTAGE'? orderObj.extras[i].value + '%': '<i class="fa fa-inr"></i>'+orderObj.extras[i].value)+')</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+orderObj.extras[i].amount+'</td> </tr>'
              otherChargesSum = otherChargesSum + orderObj.extras[i].amount;
            }
          }

          otherChargerRenderCount = otherChargerRenderCount + i;


          //Discount
          var discountTag = '';
          if(orderObj.discount.amount &&  orderObj.discount.amount != 0){
            discountTag = '<tr style="background: #fefefe; font-size: 90%"> <td></td><td></td> <td colspan="2">Discount</td> <td style="text-align: right; color: #e74c3c !important">- <i class="fa fa-inr"></i>'+orderObj.discount.amount+'</td> </tr>';
          	otherChargesSum -= orderObj.discount.amount;
          }

          //Customisable Extras
          var customExtraTag = '';
          if(orderObj.customExtras.amount &&  orderObj.customExtras.amount != 0){
            customExtraTag = '<tr style="background: #fefefe; font-size: 90%"> <td></td><td></td> <td colspan="2">'+orderObj.customExtras.type+' ('+(orderObj.customExtras.unit == 'PERCENTAGE'? orderObj.customExtras.value+'%' : '<i class="fa fa-inr"></i>'+orderObj.customExtras.value)+')</td> <td style="text-align: right; color: #e74c3c !important">- <i class="fa fa-inr"></i>'+orderObj.customExtras.amount+'</td> </tr>';
			otherChargesSum = otherChargesSum + orderObj.customExtras.amount;
          }

          totalSum += otherChargesSum;


			//Other Calculations
			var finalBar = '';
			if(orderObj.orderDetails.onlineOrderDetails.paymentMode == "PREPAID"){
				finalBar = '<tr style="background: #f4f4f4;"> <td></td><td></td> <td colspan="2"><b>Total Received Amount</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i>'+Math.round(totalSum)+'</b></td> </tr>';
			}
			else{
				finalBar = '<tr style="background: #f4f4f4;"> <td></td><td></td> <td colspan="2"><b>Total Payable Amount</b></td>  <td style="text-align: right"><b><i class="fa fa-inr"></i>'+Math.round(totalSum)+'</b></td> </tr>';
			}
			
			document.getElementById("itemInfo").innerHTML = allItems + otherCharges + discountTag + customExtraTag + finalBar;

			if(orderObj.orderDetails.modeType == 'DELIVERY'){
				var address = JSON.parse(decodeURI(orderObj.table));
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Delivery Address</p>'+
																			'<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.name+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag><br><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.flatNo+', '+address.flatName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
																			'<br><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.landmark+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag><br><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.area+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p> <p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.contact+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+
																			'</b></p> </div>';
			}
			else{
				document.getElementById("addressInfo").innerHTML = '<div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+
															'<p class="deliveryText" style="font-size: 21px;"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderObj.customerName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p> <p class="deliveryText" style="font-size: 21px;">Mob. <tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+orderObj.customerMobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p> </div>';
			}


			//Frame response actions - INTERNET Necessary!
			if(orderObj.orderDetails.modeType == 'DELIVERY'){
				if(mappingObject.systemStatus == 1){ //Not billed yet --> Option for Cancel
					if(mappingObject.onlineStatus == 1){
						document.getElementById("responseActionsBar").innerHTML = '<div class="row" style="margin-top: 10px"> <div class="col-xs-5"> <button class="btn btn-danger btn-sm" style="float: left" onclick="cancelOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Cancel</button> </div> <div class="col-xs-2"> </div> <div class="col-xs-5"> <button class="btn btn-success btn-sm" style="float: right" onclick="dispatchOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Dispatch Now</button> </div> </div>';
					}
					else if(mappingObject.onlineStatus == 2){
						document.getElementById("responseActionsBar").innerHTML = '<div class="row" style="margin-top: 10px"> <div class="col-xs-5"> <button class="btn btn-danger btn-sm" style="float: left" onclick="cancelOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Cancel</button> </div> <div class="col-xs-2"> </div> </div>';
					}
				}
				else{
					if(mappingObject.onlineStatus == 1){
						document.getElementById("responseActionsBar").innerHTML = '<div class="row" style="margin-top: 10px"> <div class="col-xs-5"> <button class="btn btn-danger btn-sm" style="float: left" disabled>Cancel</button> </div> <div class="col-xs-2"> </div> <div class="col-xs-5"> <button class="btn btn-success btn-sm" style="float: right" onclick="dispatchOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Dispatch Now</button> </div> </div>';
					}
					else if(mappingObject.onlineStatus == 2){
						document.getElementById("responseActionsBar").innerHTML = '';
					}
				}
			}
			else if(orderObj.orderDetails.modeType == 'PARCEL'){
				if(mappingObject.systemStatus == 1){ //Not billed yet --> Option for Cancel
					if(mappingObject.onlineStatus == 1){
						document.getElementById("responseActionsBar").innerHTML = '<div class="row" style="margin-top: 10px"> <div class="col-xs-5"> <button class="btn btn-danger btn-sm" style="float: left" onclick="cancelOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Cancel</button> </div> <div class="col-xs-2"> </div> <div class="col-xs-5"> <button class="btn btn-success btn-sm" style="float: right" onclick="markReadyOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Order Ready</button> </div> </div>';
					}
					else if(mappingObject.onlineStatus == 2){
						document.getElementById("responseActionsBar").innerHTML = '<div class="row" style="margin-top: 10px"> <div class="col-xs-5"> <button class="btn btn-danger btn-sm" style="float: left" onclick="cancelOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Cancel</button> </div> <div class="col-xs-2"> </div> </div>';
					} 
				}
				else{
					if(mappingObject.onlineStatus == 1){
						document.getElementById("responseActionsBar").innerHTML = '<div class="row" style="margin-top: 10px"> <div class="col-xs-5"> <button class="btn btn-danger btn-sm" style="float: left" disabled>Cancel</button> </div> <div class="col-xs-2"> </div> <div class="col-xs-5"> <button class="btn btn-success btn-sm" style="float: right" onclick="markReadyOnlineOrder(\''+encodeURI(JSON.stringify(mappingObject))+'\')">Order Ready</button> </div> </div>';
					}
					else if(mappingObject.onlineStatus == 2){
						document.getElementById("responseActionsBar").innerHTML = '';
					}
				}
			}

			document.getElementById("commentsInfo").innerHTML = '';

}

function cancelOnlineOrder(encodedMapping){
	var mappingObject = JSON.parse(decodeURI(encodedMapping));
}


function dispatchOnlineOrder(encodedMapping){
	var mappingObject = JSON.parse(decodeURI(encodedMapping));
	selectDeliveryBoyWindow(encodedMapping);
}

function markReadyOnlineOrder(encodedMapping){
	var mappingObject = JSON.parse(decodeURI(encodedMapping));


	//Send request to CLOUD SERVER
	sendConfirmationResponseToCloud(mappingObject.onlineOrder)

	function sendConfirmationResponseToCloud(orderID){

      var data = {
        "token": window.localStorage.loggedInAdmin,
        "id": orderID,
        "agent": ""
      }

      showLoading(10000, 'Updating Order Status');

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/posdispatchorder.php',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {

          hideLoading();

          if(data.status){
            readyOrderAfterProcess();
          }
          else{
            showToast('Cloud Server Error: ' + data.error, '#e74c3c');
            return '';
          }
        },
        error: function(data){
          hideLoading();
          showToast('Failed to reach Cloud Server. Please check your connection.', '#e74c3c');
          return '';
        }
      });    		
	}

	function readyOrderAfterProcess(){		
		updateOnlineOrdersMappingDispatch(mappingObject._id, "", "");
	 	selectDeliveryBoyWindowClose();
	}	
}

function dispatchOnlineOrderAfterProcess(encodedMapping, agentCode, agentName){

	var mappingObject = JSON.parse(decodeURI(encodedMapping));

	//Send request to CLOUD SERVER
	sendConfirmationResponseToCloud(mappingObject.onlineOrder, agentCode)

	function sendConfirmationResponseToCloud(orderID, agentCode){

      var data = {
        "token": window.localStorage.loggedInAdmin,
        "id": orderID,
        "agent": agentCode
      }

      showLoading(10000, 'Dispatching Order');

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/posdispatchorder.php',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {

          hideLoading();

          if(data.status){
            dispatchAfterProcess();
          }
          else{
            showToast('Cloud Server Error: ' + data.error, '#e74c3c');
            return '';
          }
        },
        error: function(data){
          hideLoading();
          showToast('Failed to reach Cloud Server. Please check your connection.', '#e74c3c');
          return '';
        }
      });    		
	}

	function dispatchAfterProcess(){		
		updateSystemBillAgent(mappingObject.systemBill, agentCode, agentName, mappingObject.systemStatus);
		updateOnlineOrdersMappingDispatch(mappingObject._id, agentName, agentCode);

	 	selectDeliveryBoyWindowClose();
	}	
}

function updateOnlineOrdersMappingDispatch(id, name, code){

    var requestData = { "selector" :{ "_id": id}}

                $.ajax({
                  type: 'POST',
                  url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/_find',
                  data: JSON.stringify(requestData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    if(data.docs.length > 0){

                    	var onlineOrdersMapping = data.docs[0];

                    	onlineOrdersMapping.timeDispatch = getCurrentTime('TIME');
                    	onlineOrdersMapping.onlineStatus = 2;
                    	onlineOrdersMapping.agentName = name;
                    	onlineOrdersMapping.agentNumber = code;

		                //Update Mapping on Server
		                $.ajax({
		                  type: 'PUT',
		                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_online_orders/'+id+'/',
		                  data: JSON.stringify(onlineOrdersMapping),
		                  contentType: "application/json",
		                  dataType: 'json',
		                  timeout: 10000,
		                  success: function(data) {
		                  	  if(name && name != '')
		                      	showToast('Delivery agent <b>'+name+'</b> assigned', '#27ae60');
		                      else
		                      	showToast('Order Status updated', '#27ae60');

		                      renderLiveOnlineOrders();
		                  },
		                  error: function(data) {
		                      showToast('System Error: Unable to update the Invoice. Please contact Accelerate Support.', '#e74c3c');
		                  }
		                }); 

                    }
                    else{
                    	showToast('Error: Online Order mapping not found on System. Please contact Accelerate Support.', '#e74c3c');
                    }
                  },
			      error: function(data) {
			        showToast('System Error: Unable to read Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
			      }

                });  
}

function updateSystemBillAgent(billNumber, code, name, status){

	billNumber = parseInt(billNumber);

	var current_time = getCurrentTime('TIME');

    var deliveryObject = {
            "timeDelivery" : current_time,
            "name" : name,
            "mobile" : code
    }

    var requestURL = 'zaitoon_bills';

    if(status == 3){
      requestURL = 'zaitoon_invoices';
    }

    var requestData = { "selector" :{ "billNumber": billNumber }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/'+requestURL+'/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(firstdata) {
      	console.log(firstdata)
        if(firstdata.docs.length > 0){

          var bill = firstdata.docs[0];
          bill.deliveryDetails = deliveryObject;

                //Update Bill/Invoice on Server
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+requestURL+'/'+(bill._id)+'/',
                  data: JSON.stringify(bill),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Invoice. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 
          
        }
        else{
          showToast('Not Found Error: Invoice #'+billNumber+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(firstdata) {
        showToast('System Error: Unable to read Invoices data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}



function punchOnlineOrderToKOT(encodedOrder){

	var order = JSON.parse(decodeURI(encodedOrder));
	var customerInfo = '';

	var online_order_source = order.source ? order.source : 'ZAITOON'; 
	if(online_order_source == ''){
		showToast('Error: This order can not be punched. Order Source is missing.', '#e74c3c');
		return '';
	}


	/* --- Start --- 
		Find if any default billing modes set against the given ORDER SOURCE.
	*/

	var default_order_sources_modes = window.localStorage.addedOrderSourcesData ? JSON.parse(window.localStorage.addedOrderSourcesData) : []; 
	
	var defaultModesFound_delivery = '';
	var defaultModesFound_takeaway = '';

	var h = 0;
	while(default_order_sources_modes[h]){
		if(default_order_sources_modes[h].code == online_order_source){
			if(default_order_sources_modes[h].defaultDelivery != 'NONE' && default_order_sources_modes[h].defaultDelivery != ''){
				defaultModesFound_delivery = default_order_sources_modes[h].defaultDelivery;
			}
			if(default_order_sources_modes[h].defaultTakeaway != 'NONE' && default_order_sources_modes[h].defaultTakeaway != ''){
				defaultModesFound_takeaway = default_order_sources_modes[h].defaultTakeaway;
			}
			break;
		}
		h++;
	}

	/* --- End --- */

	var default_parcel_mode = window.localStorage.systemOptionsSettings_defaultTakeawayMode ? window.localStorage.systemOptionsSettings_defaultTakeawayMode : ''; 
	var default_delivery_mode = window.localStorage.systemOptionsSettings_defaultDeliveryMode ? window.localStorage.systemOptionsSettings_defaultDeliveryMode : '';

	if(default_parcel_mode == 'NONE'){
		default_parcel_mode = '';
	}

	if(default_delivery_mode == 'NONE'){
		default_delivery_mode = '';
	}

	var onlineOrderObject = {
		"onlineOrderNumber": order.orderID,
		"preDiscount": order.cart.cartDiscount,
		"orderSource": online_order_source,
		"onlineAmount": order.amountPaid,	
		"paymentMode": order.isPrepaid ? "PREPAID" : "COD",
		"onlineTime": order.timePlace,
		"onlineDate": order.date,
	}

	if(order.isTakeaway){ //Set default Takeaway Order

		if(defaultModesFound_takeaway == '' && default_parcel_mode == ''){
			showToast('Warning! Default billing mode for Online Takeaway orders is not set.', '#e67e22');
			return '';
		}

		customerInfo = {
			"name": order.userName,
			"mobile": order.userID,
			"mode": defaultModesFound_takeaway != '' ? defaultModesFound_takeaway : default_parcel_mode,
			"modeType": "PARCEL",
			"mappedAddress": JSON.stringify(order.deliveryAddress),
			"reference": order.orderID,
			"isOnline": true,
			"onlineOrderDetails" : onlineOrderObject
		}	
	}
	else{ //Set default Delivery Order
	
		if(defaultModesFound_delivery == '' && default_delivery_mode == ''){
			showToast('Warning! Default billing mode for Online Delivery orders is not set.', '#e67e22');
			return '';
		}

		customerInfo = {
			"name": order.userName,
			"mobile": order.userID,
			"mode": defaultModesFound_delivery != '' ? defaultModesFound_delivery : default_delivery_mode,
			"modeType": "DELIVERY",
			"mappedAddress": JSON.stringify(order.deliveryAddress),
			"reference": order.orderID,
			"isOnline": true,
			"onlineOrderDetails" : onlineOrderObject
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


	//Confirm Online (Update Cloud Server)
	sendConfirmationResponseToCloud(order.orderID);

	function sendConfirmationResponseToCloud(orderID){

      var data = {
        "token": window.localStorage.loggedInAdmin,
        "id": orderID
      }

      showLoading(10000, 'Confirming Order');

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/posconfirmorder.php',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {

          hideLoading();

          if(data.status){
            proceedToPunchOrder();
          }
          else{
            showToast('Cloud Server Error: ' + data.error, '#e74c3c');
            return '';
          }
        },
        error: function(data){
          hideLoading();
          showToast('Failed to reach Cloud Server. Please check your connection.', '#e74c3c');
          return '';
        }
      });    		
	}

	function proceedToPunchOrder(){
		window.localStorage.specialRequests_comments = (order.comments && order.comments != '' ? order.comments : '');

		window.localStorage.zaitoon_cart = JSON.stringify(cart);
		window.localStorage.customerData = JSON.stringify(customerInfo);

		renderPage('new-order', 'Punch Order');
	}
}


/*Steward Selection*/
function selectDeliveryBoyWindow(encodedMapping){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_STAFF_PROFILES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_STAFF_PROFILES'){

              var users = data.docs[0].value;
              users.sort(); //alphabetical sorting 

              if(users.length == 0){
                showToast('Warning: No Staff registered yet.', '#e67e22');
                return '';
              }

              var n = 0;
              var renderContent = '';
              var isRendered = false;
              var actualCounter = 0;

              while(users[n]){

              	if(users[n].role == 'AGENT'){

	                isRendered = false;

	                if(actualCounter == 0){
	                  isRendered = true;
	                  renderContent = '<div class="row" style="margin: 0">';
	                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="dispatchOnlineOrderAfterProcess(\''+encodedMapping+'\', \''+users[n].code+'\', \''+users[n].name+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
	                }
	                else if(actualCounter == 1){
	                  isRendered = true;
	                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="dispatchOnlineOrderAfterProcess(\''+encodedMapping+'\', \''+users[n].code+'\', \''+users[n].name+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
	                  renderContent += '</div>';
	                }
	                else if(actualCounter > 1 && actualCounter%2 == 0){
	                  renderContent += '<div class="row" style="margin: 4px 0 0 0">';
	                }

	                if(!isRendered){
	                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="dispatchOnlineOrderAfterProcess(\''+encodedMapping+'\', \''+users[n].code+'\', \''+users[n].name+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
	                }

	                if(actualCounter > 1 && actualCounter%2 == 1){
	                  renderContent += '</div>';
	                }

	                actualCounter++;
	            }

                n++;
              }

              document.getElementById("deliveryBoysModal").style.display = 'block';
              document.getElementById("deliveryBoysModalContent").innerHTML = '<div class="modal-header" style="padding: 0; border: none"> <div class="row"><h1 style="margin: 0; font-size: 14px; color: #FFF; padding: 10px 25px; text-align: left; font-weight: bold; text-transform: uppercase; background: #607e8c;">Select a Delivery Agent</h1></div> </div> </div>'+
              										'<div style="padding: 10px 10px 5px 10px">'+renderContent + '</div></div><div class="modal-footer" style="padding: 5px 0 0 0; border: none"> <div class="row"> <button class="btn btn-default" onclick="selectDeliveryBoyWindowSystemClose()" id="deliveryBoyWindowCloseButton" style="width: 100%; height: 40px; border: none">Close</button> </div> </div> </div>';

              //<div class="row"><button>Close</button><tag >X</tag>Hello</div>';

              /*
                EasySelect Tool (TWO COLUMN - MULTI ROW GRID)
              */
              var tiles = $('#deliveryBoysModalContent .easySelectTool_StewardProfile');
              var tileSelected = undefined; //Check for active selection
              var i = 0;
              var currentIndex = 0;
              var lastIndex = 0;

              $.each(tiles, function() {
                if($(tiles[i]).hasClass("selectUserProfile")){
                  tileSelected = tiles.eq(i);
                  currentIndex = i;
                }

                lastIndex = i;
                i++;
              });  

              var easySelectTool = $(document).on('keydown',  function (e) {

                console.log('Am secretly running...')
                if($('#deliveryBoysModal').is(':visible')) {

                  console.log(e.which)

                     switch(e.which){
                      case 37:{ //  < Left Arrow

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex--;
                              if(currentIndex < 0){
                                currentIndex = lastIndex;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 38:{ //  ^ Up Arrow 
                  
                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              if(currentIndex < 2){
                                if(currentIndex == 0){ //First Col. (FIRST ROW)
                                    if(lastIndex%2 == 1){ //Last Col.
                                      currentIndex = lastIndex - 1;
                                    }
                                    else if(lastIndex%2 == 0){ //First Col.
                                      currentIndex = lastIndex;
                                    }
                                }
                                else if(currentIndex == 1){ //Last Col. (FIRST ROW)
                                    if(lastIndex%2 == 1){ //Last Col.
                                      currentIndex = lastIndex;
                                    }
                                    else if(lastIndex%2 == 0){ //First Col.
                                      currentIndex = lastIndex - 1;
                                    }
                                }
                              }
                              else{
                                currentIndex = currentIndex - 2;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 39:{ // Right Arrow >

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex++;
                              if(currentIndex > lastIndex){
                                currentIndex = 0;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 40:{ // Down Arrow \/ 

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex = currentIndex + 2;
                              if(currentIndex > lastIndex){
                                currentIndex = currentIndex % 2;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 27:{ // Escape (Close)
                        $('#deliveryBoyWindowCloseButton').click();
                        easySelectTool.unbind();
                        break;  
                      }
                      case 13:{ // Enter (Confirm)

                        $("#deliveryBoysModalContent .easySelectTool_StewardProfile").each(function(){
                          if($(this).hasClass("selectUserProfile")){
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
          else{
            showToast('Not Found Error: Registered Users data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Registered Users data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Registered Users data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}

function selectDeliveryBoyWindowClose(){
  document.getElementById("deliveryBoysModal").style.display = 'none';
}


