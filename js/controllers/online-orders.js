/* STATUS CODES
onlineStatus 
	0 - Not Confirmed
	1 - Confirmed
	2 - Completed/Dispatched
*/



function renderOnlineOrders(){

	document.getElementById("summaryHeadingOnline").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Pending Orders</h3>'+
																'<button class="btn btn-success btn-sm" id="triggerClick_refreshOnlineButton_Pending" style="float: right" onclick="renderOnlineOrders()">Refresh</button>';

	document.getElementById("orderInfo").innerHTML = '';
	document.getElementById("onlineOrders").innerHTML = '';
	document.getElementById("renderOnlineOrderArea").style.display = 'none';

	var data = {
		"token": window.localStorage.loggedInAdmin,
		"status": 0
	}

	var items = '';

	showLoading(10000, 'Loading...');

	$.ajax({
		type: 'POST',
		url: 'https://www.accelerateengine.app/apis/posfetchonlineorders.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		timeout: 10000,
		success: function(netdata) {
			hideLoading();
			if(netdata.status){

				//netdata.response = [];

				//Online Content
				var i = 0;
				while(netdata.response[i]){

					items = items + '<tr role="row" id="onlineListing_'+netdata.response[i].orderID+'" class="onlineOrderListing" onclick="fetchOrderDetails(\''+netdata.response[i].orderID+'\')"> <td>'+netdata.response[i].orderID+'<br>'+(netdata.response[i].isTakeaway? '<tag class="onlineTakeAwayTag">TAKE AWAY</tag>' : '<tag class="onlineDeliveryTag">DELIVERY</tag>')+'</td> <td><tag style="display: block">'+netdata.response[i].userName+'</tag><tag style="display: block">'+netdata.response[i].userID+'<tag></td>'+
						'<td><tag style="display: block; text-align: center"><i class="fa fa-inr"></i>'+netdata.response[i].amountPaid+'</tag><tag style="display: block; text-align: center !important">'+(netdata.response[i].isPrepaid ? '<tag style="color: #545454; font-size: 10px;">Prepaid</tag>' : '<tag style="color: #1abc62; font-size: 10px;">Cash</tag>')+'</tag></td> <td><tag style="display: block">'+netdata.response[i].timePlace+'</tag><type class="orderSourceLabel" style="'+getSourceClass(netdata.response[i].orderSource)+'">'+netdata.response[i].orderSource+'</type></td> </tr>';

					i++;
				}			

				window.localStorage.lastOrderFetchData = JSON.stringify(netdata.response);
				
				if(items != ''){
				    document.getElementById("onlineOrders").innerHTML = items;

				    document.getElementById("onlineOrderDetailsRender").style.display = 'block';
				    document.getElementById("onlineOrderNoneWarning").style.display = 'none';
				}
				else{
				   	document.getElementById("itemInfo").innerHTML = '';
				    document.getElementById("onlineOrders").innerHTML = '<tr><td colspan="4" style="color: #b1b1b1; padding: 20px 0 0 0">There are no Pending Orders</td></tr>';
				
				    document.getElementById("onlineOrderDetailsRender").style.display = 'none';
				    document.getElementById("onlineOrderNoneWarning").style.display = 'block';
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


function getSourceClass(source){

	var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toUpperCase() : 'ACCELERATE';

	if(source == 'SWIGGY'){
		return 'background: #f37f1c';
	}
	else if(source == temp_licenced_client){
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

	document.getElementById("responseActionsBar").innerHTML = '';

	var lastOrderFetchInfo = window.localStorage.lastOrderFetchData ?  JSON.parse(window.localStorage.lastOrderFetchData) : [];
	
	var i = 0;
	while(i < lastOrderFetchInfo.length){

		if(lastOrderFetchInfo[i].orderID == orderID){

			$("#onlineOrders>tr.onlineOrderListingBorder").removeClass("onlineOrderListingBorder");
			$("#onlineListing_"+orderID).addClass("onlineOrderListingBorder");


			document.getElementById("renderOnlineOrderArea").style.display = 'block';

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




function punchOnlineOrderToKOT(encodedOrder){

	var order = JSON.parse(decodeURI(encodedOrder));
	var customerInfo = '';

	/************************ THIS SHOULD DISTINGUISH BETWEEN ZAITOON_TAKEAWAY or ZAITOON_DELIVERY ******************/
	console.log('/************************ THIS SHOULD DISTINGUISH BETWEEN ZAITOON_TAKEAWAY or ZAITOON_DELIVERY ******************/')
	var online_order_source = order.source ? order.source : 'ACCELERATE'; 
	if(online_order_source == ''){
		showToast('Error: This order can not be punched. Order Source is missing.', '#e74c3c');
		return '';
	}

	console.log(order)

	var cart = [];

	var n = 0;
	while(order.cart.items[n]){

		if(order.cart.items[n].isCustom){
		cart.push({
					"cartIndex": n + 1,
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
					"cartIndex": n + 1,
					"name": order.cart.items[n].itemName,
					"price": order.cart.items[n].itemPrice,
					"isCustom": false,
					"code": order.cart.items[n].itemCode,
					"qty": order.cart.items[n].qty
				});
		}

		n++;
	}

	/*
		
		NOW CREATE THE CORRESPONDING TAPS ORDER

	*/


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
        url: 'https://www.accelerateengine.app/apis/posconfirmorder.php',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {

          hideLoading();

          if(data.status){
            
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

}



