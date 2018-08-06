/*REFERENCE:
Cancel Status 
0 - Cancelled Immediately, No food prepared
1 - Cancelled after KOT, FOOD WASTAGE
5 - Cancelled after Billing
6 - Cancelled after Bill Settled

Refund Status
0 - Not Appicable (Not Paid)
1 - No Refund
2 - Partial Refund
3 - Full Refund

timeCancel:
cancelledBy:
reason:
comments:
status:
refundStatus:
refundAmount:
refundMode:

*/


var currentPage = 1;
var totalPages = 1;
var displayType = 'UNBILLED';
var filterResultsCount = 0;



function loadAllCancelledUnbilled(optionalSource){

	console.log('*** Rendering Page: '+currentPage+" (of "+totalPages+")")

	/*
		Frame the FILTER
	*/

	var isFilterApplied = false;
	var filterObject;
		  
	var filter_start = '';
	var filter_end = '';
	var filter_key = '';


	if(window.localStorage.cancelledFilterCriteria && window.localStorage.cancelledFilterCriteria != ''){
		isFilterApplied = true;
		filterObject = JSON.parse(window.localStorage.cancelledFilterCriteria);

		if(filterObject.dateFrom == ''){
			filter_start = '01-01-2018'; //Since the launch of Vega POS
		}
		else{
			filter_start = filterObject.dateFrom;
		}

		if(filterObject.dateTo == ''){
			filter_end = getCurrentTime('DATE_DD-MM-YY'); //Today
		}
		else{
			filter_end = filterObject.dateTo;
		}

		if(filterObject.searchKey == ''){
			filter_end = '';
		}	
		else{
			filter_key = filterObject.searchKey;
		}				
	}


	$("#billSelection_invoiced").removeClass("billTypeSelectionBox");
	$("#billSelection_unbilled").addClass("billTypeSelectionBox");
	document.getElementById("billDetailedDisplayRender").innerHTML = ''

	document.getElementById("billTypeTitle").innerHTML = 'Cancelled Orders';

	if(currentPage == 1){
		if(isFilterApplied){
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterResultsCounter"></count></button>';
		}
		else{
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModal(\'UNBILLED\')">Apply Filter</button>';
		}
	}

	
	//reset pagination counter
	if(displayType != 'UNBILLED'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'UNBILLED';
		renderCancelledPageDefault();
	}

	//to load settled bills count
	if(optionalSource && optionalSource == 'EXTERNAL'){
		renderCancelledPageDefault();
		calculateCancelledCount();
	}

	if(isFilterApplied){

		//just to get the COUNT
		updateUnbilledCount();

		switch(filterObject.searchMode){

			case "customer":{
				/*
					FILTER USING CUSTOMER MOBILE NUMBER 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');					
					}
				});  


				break;
			}

			case "steward":{
				/*
					FILTER USING STEWARD NAME
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');
					}
				});  


				break;
			}

			case "machine":{
				/*
					FILTER USING MACHINE NAME
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');
					}
				});  


				break;
			}

			case "session":{
				/*
					FILTER USING DINE SESSION NAME
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');
					}
				});  


				break;
			}

			case "refund":{
				/*
					FILTER REFUNDED OR NON-REFUNDED ORDERS
				*/

			  	//TWEAK: No refund for Unbilled orders!

				document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
				document.getElementById("filterResultsCounter").innerHTML = '';
				filterResultsCount = 0;
				renderBillPageDefault('UNBILLED');

				break;
			}

			case "table":{
				/*
					FILTER USING TABLE NUMBER 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');
					}
				});  


				break;
			}

			case "bill":{
				/*
					FILTER USING BILL NUMBER 
				*/
								filter_key = parseInt(filter_key);
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;

							    var requestData = { "selector" :{ "billNumber": filter_key } }

							    $.ajax({
							      type: 'POST',
							      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_find',
							      data: JSON.stringify(requestData),
							      contentType: "application/json",
							      dataType: 'json',
							      timeout: 10000,
							      success: function(data) {
							        if(data.docs.length > 0){

							          totalPages = 1;
							          var bill = data.docs[0];

								      var resultRender = '';
									  resultRender 				+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
										                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
										                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
										                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
										                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
										                            '        <td>'+bill.stewardName+'</td>'+
										                            '    </tr>';


										document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
											'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
											'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
								      
								      	renderCancelledPageDefault('UNBILLED');
							        }
							        else{
							        	totalPages = 0;
							        	filterResultsCount = 0;
									    document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
										renderCancelledPageDefault('UNBILLED');
										return '';
									    
							        }

							      },
							      error: function(data) {
							        showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
								  	totalPages = 0;
								  	filterResultsCount = 0;
									document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
									renderCancelledPageDefault('UNBILLED');
									return '';
								  }

							    });

				break;
			}

			case "type":{
				/*
					FILTER USING BILLING MODE
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');
					}
				});  


				break;
			}


			case "payment":{
				/*
					FILTER USING PAYMENT MODE
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');					
					}
				});  


				break;
			}

			case "all":{
				/*
					FILTER ALL BILLS
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('UNBILLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/order-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Orders. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderCancelledPageDefault('UNBILLED');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
				      	renderCancelledPageDefault('UNBILLED');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('UNBILLED');
					}
				});  


				break;
			}			

			default:{
				showToast('System Error: Filter criteria did not found. Please contact Accelerate Support if problem persists.', '#e74c3c');
				document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
				renderCancelledPageDefault('UNBILLED');			
			}
			
		}


	}
	else{ //Filter Not Applied

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/orders/_view/all?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("cancelledOrdersCount").innerHTML = 0;
		      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">There are no Cancelled Orders.</p>';
				return '';
		      }

		      document.getElementById("cancelledOrdersCount").innerHTML = data.total_rows;
		      totalPages = Math.ceil(data.total_rows/10);
		      
		      var resultsList = data.rows;
		      var resultRender = '';
		      var n = 0;
		      while(resultsList[n]){

		      	var bill = resultsList[n].doc;
		      	console.log(bill)
				resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'UNBILLED\')">'+
				                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
				                            '        <td>'+getFancyTime(bill.timePunch)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td><b style="color: #ED4C67">#'+bill.KOTNumber+'</b></td>'+
				                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
				                            '        <td>'+bill.stewardName+'</td>'+
				                            '    </tr>';
		      	n++;
		      }


				document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
					'<th style="text-align: left">Order No</th> <th style="text-align: left">Customer</th>'+
					'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
		      
		      	renderCancelledPageDefault('UNBILLED')

		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">Somethin went wrong. Try again.</p>';
		    }

		  });  		
	}
}


function updateUnbilledCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/_design/orders/_view/all?descending=true&include_docs=false',
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("cancelledOrdersCount").innerHTML = 0;
				return '';
		      }

		      document.getElementById("cancelledOrdersCount").innerHTML = data.total_rows;
		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    }

		  });
}



function updateCancelledCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoices/_view/all?descending=true&include_docs=false',
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("cancelledInvoicesCount").innerHTML = 0;
				return '';
		      }

		      document.getElementById("cancelledInvoicesCount").innerHTML = data.total_rows;
		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    }

		  });
}

function calculateCancelledCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoices/_view/all',
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {
		    	
		      if(data.total_rows == 0){
		      	document.getElementById("cancelledInvoicesCount").innerHTML = 0;
		      }
		      else{
				document.getElementById("cancelledInvoicesCount").innerHTML = data.total_rows;
			  }
		    }
		  });  
}

function converPaymentCode(code){

	var list = window.localStorage.availablePaymentModes ? JSON.parse(window.localStorage.availablePaymentModes) : [];

	if(code == 'MULTIPLE'){
		return 'Multiple';
	}

	if(!code || code == ''){
		return 'Paid';
	}

	if(list.length > 0){
		var n = 0;
		while(list[n]){
			if(list[n].code == code)
			{
				return list[n].name;
			}
			n++
		}
	}
	else{
		return 'Paid';
	}
}



function loadAllCancelledInvoices(){

	/*
		Frame the FILTER
	*/

	var isFilterApplied = false;
	var filterObject;
		  
	var filter_start = '';
	var filter_end = '';
	var filter_key = '';


	if(window.localStorage.cancelledFilterCriteria && window.localStorage.cancelledFilterCriteria != ''){
		isFilterApplied = true;
		filterObject = JSON.parse(window.localStorage.cancelledFilterCriteria);

		if(filterObject.dateFrom == ''){
			filter_start = '01-01-2018'; //Since the launch of Vega POS
		}
		else{
			filter_start = filterObject.dateFrom;
		}

		if(filterObject.dateTo == ''){
			filter_end = getCurrentTime('DATE_DD-MM-YY'); //Today
		}
		else{
			filter_end = filterObject.dateTo;
		}

		if(filterObject.searchKey == ''){
			filter_end = '';
		}	
		else{
			filter_key = filterObject.searchKey;
		}				
	}


	$("#billSelection_invoiced").addClass("billTypeSelectionBox");
	$("#billSelection_unbilled").removeClass("billTypeSelectionBox");
	document.getElementById("billDetailedDisplayRender").innerHTML = ''

	document.getElementById("billTypeTitle").innerHTML = 'Cancelled Invoices';

	if(currentPage == 1){
		if(isFilterApplied){
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearAppliedFilterCancelled(\'CANCELLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterResultsCounter"></count></button>';
		}
		else{
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModal(\'CANCELLED\')">Apply Filter</button>';
		}
	}


	//reset pagination counter
	if(displayType != 'CANCELLED'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'CANCELLED';
		renderCancelledPageDefault();
	}

		//Preload payment modes
		if(currentPage == 1)
		{

		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ZAITOON_PAYMENT_MODES" 
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
		          if(data.docs[0].identifierTag == 'ZAITOON_PAYMENT_MODES'){

		              var modes = data.docs[0].value;
		              if(modes.length > 0)
		              	window.localStorage.availablePaymentModes = JSON.stringify(modes);
		          }
		        }
		      }

		    });

		}


	if(isFilterApplied){

		//just to get the COUNT
		updateCancelledCount();


		switch(filterObject.searchMode){

			case "customer":{
				/*
					FILTER USING CUSTOMER MOBILE NUMBER 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');					
					}
				});  


				break;
			}

			case "steward":{
				/*
					FILTER USING STEWARD NAME
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }




						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');
					}
				});  


				break;
			}

			case "machine":{
				/*
					FILTER USING MACHINE NAME
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }

					    

						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');
					}
				});  


				break;
			}
			case "session":{

				/*
					FILTER USING DINE SESSION NAME
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');
					}
				});  


				break;
			}


			case "refund":{
				/*
					FILTER REFUNDED OR NON-REFUNDED ORDERS
				*/

				console.log('am here')

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbyrefund?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbyrefund?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');
					}
				});  


				break;
			}


			case "table":{
				/*
					FILTER USING TABLE NUMBER 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');
					}
				});  


				break;
			}


			case "bill":{
				/*
					FILTER USING BILL NUMBER 
				*/
								filter_key = parseInt(filter_key);
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;

							    var requestData = { "selector" :{ "billNumber": filter_key } }

							    $.ajax({
							      type: 'POST',
							      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_find',
							      data: JSON.stringify(requestData),
							      contentType: "application/json",
							      dataType: 'json',
							      timeout: 10000,
							      success: function(data) {
							        if(data.docs.length > 0){

							          	totalPages = 1;
							          	var bill = data.docs[0];

								      	var resultRender = '';
								      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
							                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
							                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
							                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
							                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
							                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
							                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
							                            '    </tr>';


										document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
									      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
									      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
						      
							      		renderCancelledPageDefault('CANCELLED')
							      		
							        }
							        else{
							        	totalPages = 0;
							        	filterResultsCount = 0;
									    document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
										renderCancelledPageDefault('CANCELLED');
										return '';
									    
							        }

							      },
							      error: function(data) {
							        showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
								  	totalPages = 0;
								  	filterResultsCount = 0;
									document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
									renderCancelledPageDefault('CANCELLED');
									return '';
								  }

							    });

				break;
			}

			case "type":{
				/*
					FILTER USING BILLING MODE
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }


					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');
					}
				});  


				break;
			}


			case "payment":{
				/*
					FILTER USING PAYMENT MODE
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }


					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');					
					}
				});  


				break;
			}


			case "all":{
				/*
					FILTER ALL
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderCancelledPageDefault('CANCELLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoice-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found in Cancelled Invoices. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderCancelledPageDefault('CANCELLED');
						return '';
					  }


					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
				                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
			      
				      	renderCancelledPageDefault('CANCELLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderCancelledPageDefault('CANCELLED');					
					}
				});  


				break;
			}


			default:{
				showToast('System Error: Filter criteria did not found. Please contact Accelerate Support if problem persists.', '#e74c3c');
				document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilterCancelled(\'UNBILLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
				renderCancelledPageDefault('CANCELLED');			
			}

		}


	}
	else{ //Filter Not Applied

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/invoices/_view/all?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("cancelledInvoicesCount").innerHTML = 0;
		      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">There are no Cancelled Invoices.</p>';
				return '';
		      }

		      document.getElementById("cancelledInvoicesCount").innerHTML = data.total_rows;
		      totalPages = Math.ceil(data.total_rows/10);
		      
		      var resultsList = data.rows;
		      var resultRender = '';
		      var n = 0;
		      while(resultsList[n]){

		      	var bill = resultsList[n].doc;

		      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedCancelledBill(\''+encodeURI(JSON.stringify(bill))+'\', \'CANCELLED\')">'+
	                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
	                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
	                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
	                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
	                            '        <td>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? '<i class="fa fa-inr"></i>'+bill.totalAmountPaid : 'Unpaid')+'</td>'+
	                            '        <td>'+(bill.cancelDetails.refundStatus > 1 ? '<i class="fa fa-inr"></i>'+bill.cancelDetails.refundAmount+'<br>Refunded' : '<tag style="color: #dcdcdc">No Refund</tag>')+'</td>'+
	                            '    </tr>';
		      	n++;
		      }

				document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
				      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
				      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Status</th> </tr></thead><tbody>'+resultRender+'<tbody>';
	      
		      	renderCancelledPageDefault('CANCELLED')

		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">Somethin went wrong. Try again.</p>';
		    
		    }

		  });  		
	}

}



function renderCancelledPageDefault(target){

	if(totalPages == 0){
		document.getElementById("navigationAssitantBills").innerHTML = '';
	}
	else if(totalPages == 1){
		document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>';
	}
	else if(totalPages > 1){
		if(currentPage == 1){
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoCancelledBillPage(\''+(currentPage+1)+'\', \''+target+'\')"><i class="fa fa-chevron-right"></i></button>';	
		}
		else if(currentPage == totalPages){
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoCancelledBillPage(\''+(currentPage-1)+'\', \''+target+'\')"><i class="fa fa-chevron-left"></i></button>';		
		}
		else{
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoCancelledBillPage(\''+(currentPage+1)+'\', \''+target+'\')"><i class="fa fa-chevron-right"></i></button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoCancelledBillPage(\''+(currentPage-1)+'\', \''+target+'\')"><i class="fa fa-chevron-left"></i></button>';	
		}
	}
	else{
		document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>'+                    
                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;"><i class="fa fa-chevron-right"></i></button>'+
                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;"><i class="fa fa-chevron-left"></i></button>';
	}
}


function gotoCancelledBillPage(toPageID, target){
	currentPage = parseInt(toPageID);

	if(target == 'UNBILLED'){
		loadAllCancelledUnbilled();
	}
	else if(target == 'CANCELLED'){
		loadAllCancelledInvoices();
	}

	renderCancelledPageDefault(target);
}


function checkDeliveryAddr(addressContent) {
	var address = JSON.parse(decodeURI(addressContent));
	document.getElementById("addressViewFromBillModal").style.display = 'block';

	document.getElementById("addressViewFromBillModalContent").innerHTML = ''+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;"><b>'+address.name+'</b></p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+address.flatNo+(address.flatName && address.flatName != '' ? ', '+address.flatName : '')+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+address.landmark+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0 0 5px 0;">'+address.area+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+(address.contact && address.contact != '' ? 'Mob. '+address.contact : '')+'</p>';
}

function checkDeliveryAddrHide() {
	document.getElementById("addressViewFromBillModal").style.display = 'none';
}

function openSelectedCancelledBill(encodedBill, type){

	var bill = JSON.parse(decodeURI(encodedBill));

	if(type == 'UNBILLED'){

		var itemsList = '';
		var n = 0;

		var totalQuantity = 0;

		while(bill.cart[n]){
			if(bill.cart[n].isCustom)
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+' ('+bill.cart[n].variant+')</td> <td style="text-align: center">'+bill.cart[n].qty+'</td> <td style="text-align: center"><i class="fa fa-inr"></i>'+bill.cart[n].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			else
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+'</td> <td style="text-align: center">'+bill.cart[n].qty+'</td> <td style="text-align: center"><i class="fa fa-inr"></i>'+bill.cart[n].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			
			totalQuantity = totalQuantity + bill.cart[n].qty;

			n++;
		}

		var otherCharges = '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Number of Items</td> <td style="text-align: right">'+n+'</td> </tr>'+
				'<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Total Quantity</td> <td style="text-align: right">'+totalQuantity+'</td> </tr>';

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+ 
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.KOTNumber+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+(bill.orderDetails.modeType == 'DINE' ? '<tag class="billTypeSmallBox">Table <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? '<tag class="billTypeSmallBox">Token <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'DELIVERY' ? '<tag class="billTypeSmallBox viewAddressBox" onclick="checkDeliveryAddr(\''+encodeURI(bill.table)+'\')">View Address</b></tag>' : '')+'</h3><button class="btn btn-danger" onclick="cancelDetailsDisplay(\''+(encodeURI(JSON.stringify(bill.cancelDetails)))+'\')" style="float: right">Cancellation Details</button>'+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at '+getFancyTime(bill.timePunch)+'</time>'+
												      '<div class="table-responsive">'+
												         '<table class="table">'+
												         	'<col width="5%">'+
												         	'<col width="50%">'+
												         	'<col width="15%">'+
												         	'<col width="15%">'+
												         	'<col width="15%">'+												         
												            '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">#</th> <th style="text-align: left">Item</th> <th style="text-align: cetner">Quantity</th> <th style="text-align: center">Unit Price</th> <th style="text-align: right">Total</th> </tr> </thead>'+
												            '<tbody>'+itemsList+'</tbody><tbody class="billRowOtherCharges" style="border-top: 1px solid">'+otherCharges+
												            '</tbody>'+
												         '</table>'+
												         '<div class="row" style="margin-top: 40px">'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+((bill.customerName == '' && bill.customerMobile == '') ? '<p class="deliveryText" style="color: #ff8787">Not Available</p>' : '')+( bill.customerName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.customerName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.customerMobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.customerMobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												            '<div class="col-xs-2"></div>'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p>'+( bill.stewardName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.stewardName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.stewardCode != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.stewardCode+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												         '</div>'+
												      '</div>'+
												      '<div class="clearfix"></div>'+
												'   </div>'+
												'</div>';


	}
	else if(type == 'CANCELLED'){

		var itemsList = '';
		var n = 0;
		var subTotal = 0;
		var grandSumCalculated = 0;
		while(bill.cart[n]){
			if(bill.cart[n].isCustom)
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+' ('+bill.cart[n].variant+')</td> <td style="text-align: center">'+bill.cart[n].qty+'</td> <td style="text-align: center"><i class="fa fa-inr"></i>'+bill.cart[n].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			else
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+'</td> <td style="text-align: center">'+bill.cart[n].qty+'</td> <td style="text-align: center"><i class="fa fa-inr"></i>'+bill.cart[n].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			
			subTotal += bill.cart[n].price * bill.cart[n].qty;

			n++;
		}

		var otherCharges = '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Sub Total</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+subTotal+'</td> </tr>';
		
		var charges_extra = 0;
		if(!jQuery.isEmptyObject(bill.extras)){
			var m = 0;
			while(bill.extras[m]){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.extras[m].name+' ('+(bill.extras[m].unit == 'PERCENTAGE' ? bill.extras[m].value+'%' : 'Rs. '+bill.extras[m].value)+')</td>  <td style="text-align: right"><i class="fa fa-inr"></i>'+bill.extras[m].amount+'</td> </tr>';
				charges_extra += bill.extras[m].amount;
				m++;
			}
		}

		if(!jQuery.isEmptyObject(bill.customExtras)){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.customExtras.type+' ('+(bill.customExtras.unit == 'PERCENTAGE' ? bill.customExtras.value+'%' : 'Rs. '+bill.customExtras.value)+')</td>  <td style="text-align: right"><i class="fa fa-inr"></i>'+bill.customExtras.amount+'</td> </tr>';
			charges_extra += bill.customExtras.amount;
		}

		if(!jQuery.isEmptyObject(bill.discount)){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Discounts</td> <td style="text-align: right">'+(bill.discount.amount && bill.discount.amount != 0 ? '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+bill.discount.amount+'</tag>' : '0')+'</td> </tr>';
			charges_extra = charges_extra - bill.discount.amount;
		}

		grandSumCalculated = subTotal + charges_extra;
		grandSumCalculated = parseFloat(grandSumCalculated).toFixed(2);
		otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Grand Total</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+grandSumCalculated+'</td> </tr>';

		if(bill.calculatedRoundOff != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Calculated Round Off</td> <td style="text-align: right">'+(bill.calculatedRoundOff > 0 ? '<tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>' : '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>')+'</td> </tr>';
		}

		otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Total Payable</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+parseFloat(bill.payableAmount).toFixed(2)+'</td> </tr>';
		

		
		//check if any tips/round off added
		if(bill.tipsAmount && bill.tipsAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Tips</td>  <td style="text-align: right"><tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+bill.tipsAmount+'</tag></td> </tr>';
		}

		if(bill.roundOffAmount && bill.roundOffAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Waived Round Off</td>  <td style="text-align: right"><tag style="color: #f15959">- <i class="fa fa-inr"></i>'+bill.roundOffAmount+'</tag></td> </tr>';
		}

		otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Paid Amount</b></td> <td style="font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+(bill.totalAmountPaid && bill.totalAmountPaid != '' ? parseFloat(bill.totalAmountPaid).toFixed(2) : '0')+'</td> </tr>';
		
		//Refunds
		var net_refund = 0;
		if(!jQuery.isEmptyObject(bill.refundDetails)){
			otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Refunds</b></td> <td style="font-weight: bold; text-align: right">'+(bill.refundDetails.amount && bill.refundDetails.amount != 0 ? '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+parseFloat(bill.refundDetails.amount).toFixed(2)+'</tag>' : '0')+'</td> </tr>';
			net_refund = bill.refundDetails.amount;
		}

		var gross_calculated_amount = 0;
		
		if(bill.totalAmountPaid && bill.totalAmountPaid != ''){
			gross_calculated_amount = bill.totalAmountPaid - net_refund;
		}
		else{
			gross_calculated_amount = net_refund - bill.payableAmount;
		}

		otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Gross Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right">'+(gross_calculated_amount < 0 ? '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+parseFloat(Math.abs(gross_calculated_amount)).toFixed(2)+'</tag>' : '<i class="fa fa-inr"></i>'+parseFloat(gross_calculated_amount).toFixed(2))+'</td> </tr>';
		

		//Payment Splits, if applicable
		var paymentSplitList = '';
		var paymentOptionUsedButton = '';

		if(bill.cancelDetails.refundStatus == 2){

			paymentOptionUsedButton =  	'<div class="splitPayListDropdown">'+
										 	'<div class="splitPayListButton">Partial Refund</div>'+
										'</div>';	
		}
		else if(bill.cancelDetails.refundStatus == 3){

			paymentOptionUsedButton =  	'<div class="splitPayListDropdown">'+
										 	'<div class="splitPayListButton">Full Refund</div>'+
										'</div>';	
		}


		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.billNumber+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+paymentOptionUsedButton+'</h3><button class="btn btn-danger" onclick="cancelDetailsDisplay(\''+(encodeURI(JSON.stringify(bill.cancelDetails)))+'\')" style="float: right">Cancellation Details</button>'+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at '+getFancyTime(bill.timeBill)+'</time>'+
												      '<div class="table-responsive">'+
												         '<table class="table">'+
												         	'<col width="5%">'+
												         	'<col width="50%">'+
												         	'<col width="15%">'+
												         	'<col width="15%">'+
												         	'<col width="15%">'+
												            '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">#</th> <th style="text-align: left">Item</th> <th style="text-align: center">Quantity</th> <th style="text-align: center">Unit Price</th> <th style="text-align: right">Total</th> </tr> </thead>'+
												            '<tbody>'+itemsList+'</tbody><tbody class="billRowOtherCharges" style="border-top: 1px solid">'+otherCharges+
												            '</tbody>'+
												         '</table>'+
												         '<div class="row" style="margin-top: 40px">'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+((bill.customerName == '' && bill.customerMobile == '') ? '<p class="deliveryText" style="color: #ff8787">Not Available</p>' : '')+( bill.customerName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.customerName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.customerMobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.customerMobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												            '<div class="col-xs-2"></div>'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p>'+( bill.stewardName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.stewardName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.stewardCode != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"> <tag class="easyCopyToolText">'+bill.stewardCode+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												         '</div>'+
												      '</div>'+
												      '<div class="clearfix"></div>'+
												'   </div>'+
												'</div>';


	}
	else{
		showToast('System Error: Failed to Render. Please contact Accelerate Support if problem persists.', '#e74c3c');
		return '';
	}	
}




/* SEARCH AND FILTER */

function openFilterModal(optionalRoute){

	document.getElementById("searchFilterModal").style.display = 'block';

	if(optionalRoute == 'UNBILLED'){
		document.getElementById("actionButtonSearch").innerHTML = '<button type="button" class="btn btn-success" onclick="filterSearchCancelledInitialize(\'UNBILLED\')" style="float: right">Proceed</button>';
	}
	else if(optionalRoute == 'CANCELLED'){
		document.getElementById("actionButtonSearch").innerHTML = '<button type="button" class="btn btn-success" onclick="filterSearchCancelledInitialize(\'CANCELLED\')" style="float: right">Proceed</button>';
	}


	var options = {
		maxDate: "+0D", 
		dateFormat: "dd-mm-yy"
	};

	var $j = jQuery.noConflict();
	$j( "#reportFromDate" ).datepicker(options);
	$j( "#reportToDate" ).datepicker(options);


	$("#filter_search_key").focus();
}

function hideFilterModal(){
	document.getElementById("searchFilterModal").style.display = 'none';
}

function changeCancelledFilterSearchCriteria(){

	var tempValue = '';
	if(document.getElementById("filter_search_key") != null){
		tempValue = document.getElementById("filter_search_key").value;
	}


	var criteria = document.getElementById("filterSearchCriteria").value;

	if(criteria == 'payment'){

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_PAYMENT_MODES" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_PAYMENT_MODES'){

	              var modes = data.docs[0].value;
	              modes.sort(); //alphabetical sorting 
	              var modesTag = '';


	              for (var i=0; i<modes.length; i++){
	                modesTag = modesTag + '<option value="'+modes[i].code+'">'+modes[i].name+'</option>';
	              }

	              if(modes.length == 0){
	              	showToast('Error: No Payment Modes added.', '#e74c3c');
	              	hideFilterModal();
	              	return '';
	              }

	              document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>Payments</p>';
	          }
	          else{
	            showToast('Not Found Error: Billing Payment data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Payment data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
	}
	else if(criteria == 'type'){

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

	              var modes = data.docs[0].value;
	              modes.sort(); //alphabetical sorting 
	              var modesTag = '';


	              for (var i=0; i<modes.length; i++){
	                modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
	              }

	              if(modes.length == 0){
	              	showToast('Error: No Billing Modes added.', '#e74c3c');
	              	hideFilterModal();
	              	return '';
	              }

	              document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>Orders</p>';
	          }
	          else{
	            showToast('Not Found Error: Billing Payment data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Payment data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
	}
	else if(criteria == 'session'){

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_DINE_SESSIONS" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_DINE_SESSIONS'){

	              var modes = data.docs[0].value;
	              modes.sort(); //alphabetical sorting 
	              var modesTag = '';


	              for (var i=0; i<modes.length; i++){
	                modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
	              }

	              if(modes.length == 0){
	              	showToast('Error: No Dine Sessions created.', '#e74c3c');
	              	hideFilterModal();
	              	return '';
	              }

	              document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show orders <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>Session alone</p>';
	          }
	          else{
	            showToast('Not Found Error: Dine Sessions data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Dine Sessions data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
	}
	else if(criteria == 'machine'){

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_CONFIGURED_MACHINES" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_CONFIGURED_MACHINES'){

	              var modes = data.docs[0].value;
	              modes.sort(); //alphabetical sorting 
	              var modesTag = '';


	              for (var i=0; i<modes.length; i++){
	                modesTag = modesTag + '<option value="'+modes[i].machineUID+'">'+modes[i].machineCustomName+'</option>';
	              }

	              if(modes.length == 0){
	              	showToast('Error: No Machines registered.', '#e74c3c');
	              	hideFilterModal();
	              	return '';
	              }

	              document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show orders billed on <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>only</p>';
	          }
	          else{
	            showToast('Not Found Error: Registered Machines data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Registered Machines data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Registered Machines data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
	}
	else if(criteria == 'steward'){

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

	              var modes = data.docs[0].value;
	              modes.sort(); //alphabetical sorting 
	              var modesTag = '';


	              for (var i=0; i<modes.length; i++){
	                modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
	              }

	              if(modes.length == 0){
	              	showToast('Error: No Staff profiles created.', '#e74c3c');
	              	hideFilterModal();
	              	return '';
	              }

	              document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show orders punched by <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select></p>';
	          }
	          else{
	            showToast('Not Found Error: Staff data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Staff data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Staff data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
	}
	else if(criteria == 'refund'){
	    document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only Orders with <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="fullrefund">Full Refund</option><option value="partialrefund">Partial Refund</option><option value="norefund">No Refund</option></select>issued</p>';
	}
	else if(criteria == 'all'){
	    document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Showing <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="all">All the Orders</option></select></p>';
	}
	else{
		document.getElementById("filterSearchArea").innerHTML = '<input type="text" value="'+tempValue+'" class="form-control tip" id="filter_search_key" style="border: none; border-bottom: 2px solid; font-size: 36px; height: 60px; font-weight: 300; padding: 10px 3px;" placeholder="Search Here" required="required" />';
		$("#filter_search_key").focus();
	}
}

function filterSearchCancelledInitialize(optionalRoute){

	var dateFrom = '', dateTo = '', searchMode = 'bill', searchKey = '';

	dateFrom = document.getElementById("reportFromDate").value;
	dateTo = document.getElementById("reportToDate").value;

	searchMode = document.getElementById("filterSearchCriteria").value;

	if(searchMode == 'payment' || searchMode == 'type' || searchMode == 'steward' || searchMode == 'session' || searchMode == 'machine' || searchMode == 'refund' || searchMode == 'all'){
		searchKey = document.getElementById("filterSearchCriteriaSelected").value;
	}
	else{
		searchKey = document.getElementById("filter_search_key").value;
		
		if(searchKey == ''){
			showToast('Warning: Please enter any Search Key.', '#e67e22');
			return '';
		}
	}

	var searchObj = {};
	searchObj.dateFrom = dateFrom;
	searchObj.dateTo = dateTo;
	searchObj.searchMode = searchMode;
	searchObj.searchKey = searchKey;

	window.localStorage.cancelledFilterCriteria = JSON.stringify(searchObj);

	document.getElementById("billBriefDisplayRender").innerHTML = '';

	if(optionalRoute == 'CANCELLED'){
		loadAllCancelledInvoices();
	}
	else{
		loadAllCancelledUnbilled('EXTERNAL');
	}

	hideFilterModal();
}

function clearAppliedFilterCancelled(optionalRoute){

	window.localStorage.cancelledFilterCriteria = '';

	if(optionalRoute == 'CANCELLED'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'CANCELLED';

		loadAllCancelledInvoices();
	}
	else{
		totalPages = 0;
		currentPage = 1;
		displayType = 'UNBILLED';

		loadAllCancelledUnbilled('EXTERNAL');
	}	
}

function getCancelledOrderStatus(code){
	
	code = parseInt(code);

	switch(code){
		case 0:{
			return "Cancelled immediately, No food prepared."
			break;
		}
		case 1:{
			return "Cancelled after Order punched, caused food wastage.";
			break;
		}
		case 5:{
			return "Cancelled after billing, not paid.";
			break;
		}
		case 6:{
			return "Cancelled after Bill was paid.";
			break;
		}				
		default:{
			return 'Unknown';
		}
	}
}


function getCancelledRefundStatus(code, amount){
	
	code = parseInt(code);

	switch(code){
		case 0:{
			return "Refund not applicable"
			break;
		}
		case 1:{
			return "No Refund issued";
			break;
		}
		case 2:{
			return "Partial Refund of <b>Rs. "+amount+"</b> issued";
			break;
		}
		case 3:{
			return "Full Refund of <b>Rs. "+amount+"</b> issued";
			break;
		}				
		default:{
			if(amount && amount != '' && amount != 0){
				return "Refund of <b>Rs. "+amount+"</b> was issued";
			}
			else{
				return "-";
			}
		}
	}
}

function cancelDetailsDisplay(encodedReason){
	var cancelObj = JSON.parse(decodeURI(encodedReason));

	document.getElementById("cancelReasonModal").style.display = 'block';
	document.getElementById("cancelReasonModalContent").innerHTML = ''+
												      '<div class="table-responsive">'+
												         '<table class="table">'+
												         	'<col width="35%">'+
												         	'<col width="65%">'+
												            (cancelObj.reason && cancelObj.reason != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Reason</td> <td>'+cancelObj.reason+'</td> </tr>' : '' )+
												            (cancelObj.comments && cancelObj.comments != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Comments</td> <td style="font-style: italic; font-weight: bold;">'+cancelObj.comments+'</td> </tr>' : '')+
												            (cancelObj.cancelledBy && cancelObj.cancelledBy != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Cancelled By</td> <td>'+cancelObj.cancelledBy+'</td> </tr>' : '')+
												            (cancelObj.timeCancel && cancelObj.timeCancel != '--:--' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Time</td> <td>'+getFancyTime(cancelObj.timeCancel)+'</td> </tr>' : '')+
												            (cancelObj.status ? '<tr><td style="color: #6f90b1; font-weight: bold;">Order Status</td> <td>'+getCancelledOrderStatus(cancelObj.status)+'</td> </tr>' : '')+
												            (cancelObj.refundStatus ? '<tr><td style="color: #6f90b1; font-weight: bold;">Refund Status</td> <td>'+getCancelledRefundStatus(cancelObj.refundStatus, cancelObj.refundAmount)+'</td> </tr>' : '')+
												            (cancelObj.refundStatus && cancelObj.refundStatus > 1  ? '<tr><td style="color: #6f90b1; font-weight: bold;">Refund Mode</td> <td>'+(cancelObj.refundMode == 'CASH' ? 'Cash' : 'Original Mode')+'</td> </tr>' : '')+
												            '</tbody>'+
												         '</table>'+
												      '</div>';
}

function cancelDetailsDisplayHide(){
	document.getElementById("cancelReasonModal").style.display = 'none';
}
