
var currentPage = 1;
var totalPages = 1;
var displayType = 'PENDING';
var filterResultsCount = 0;

function loadAllPendingSettlementBills(optionalSource, optionalAnimationFlag){

	console.log('*** Rendering Page: '+currentPage+" (of "+totalPages+")")

	if(optionalAnimationFlag && optionalAnimationFlag == 'LOADING_ANIMATION'){
		//Show Animation
		document.getElementById("billBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';
	}

	//Adjust server source db
	SELECTED_INVOICE_SOURCE_DB = 'accelerate_wounded';

    // LOGGED IN USER INFO
    var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
          
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
    }	

    if(loggedInStaffInfo.role == 'ADMIN' && loggedInStaffInfo.code == '9884179675'){
    	SELECTED_INVOICE_SOURCE_DB = 'accelerate_invoices';
    }




	/*
		Frame the FILTER
	*/

	var isFilterApplied = false;
	var filterObject;
		  
	var filter_start = '';
	var filter_end = '';
	var filter_key = '';


	if(window.localStorage.billFilterCriteria && window.localStorage.billFilterCriteria != ''){
		isFilterApplied = true;
		filterObject = JSON.parse(window.localStorage.billFilterCriteria);

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




	$("#billSelection_settled").removeClass("billTypeSelectionBox");
	$("#billSelection_pending").addClass("billTypeSelectionBox");
	document.getElementById("billDetailedDisplayRender").innerHTML = ''


	document.getElementById("billTypeTitle").innerHTML = 'Pending Bills';
	document.getElementById("billTypeTitle").style.color = '#f39c12';

	if(currentPage == 1){
		if(isFilterApplied){
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterResultsCounter"></count></button>';
		}
		else{
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModalBills(\'PENDING\')">Apply Filter</button>';
		}
	}

	
	//reset pagination counter
	if(displayType != 'PENDING'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'PENDING';
		renderBillPageDefault();
	}

	//to load settled bills count
	if(optionalSource && optionalSource == 'EXTERNAL'){
		renderBillPageDefault();
		calculateSettledCount();
	}

	if(isFilterApplied){

		//just to get the COUNT
		updatePendingCount();

		switch(filterObject.searchMode){

			case "customer":{
				/*
					FILTER USING CUSTOMER MOBILE NUMBER 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+ 
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');					
					}
				});  


				break;
			}


			case "amount":{
				/*
					FILTER USING BILL AMOUNT
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbyamount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbyamount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+ 
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');					
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
					}
				});  


				break;
			}


			case "discount":{
				/*
					FILTER DISCOUNTED OR NON-DISCOUNTED ORDERS
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbydiscount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbydiscount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
					}
				});  


				break;
			}


			case "refund":{
				/*
					FILTER REFUNDED OR NON ORDERS
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbyrefund?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbyrefund?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
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

						    //Set _id from Branch mentioned in Licence
						    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
						    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
						      showToast('Invalid Licence Error: KOT can not be generated. Please contact Accelerate Support if problem persists.', '#e74c3c');
						      return '';
						    }

						    var bill_request_data = accelerate_licencee_branch +"_BILL_"+ filter_key;

						    $.ajax({
						      type: 'GET',
						      url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/'+bill_request_data,
						      timeout: 10000,
						      success: function(data) {
						        if(data._id != ""){

							          var bill = data;

								      var resultRender = '';
									  resultRender 				+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
																	'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
																	'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
										                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
										                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
										                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
										                            '        <td>'+bill.stewardName+'</td>'+
										                            '    </tr>';


										document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
										'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
										'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
								      
								      	renderBillPageDefault('PENDING');
							        }
							        else{
							        	totalPages = 0;
							        	filterResultsCount = 0;
									    document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
										renderBillPageDefault('PENDING');
										return '';
									    
							        }

							      },
							      error: function(data) {
							        showToast('Error: Bill #'+filter_key+' not found.', '#e74c3c');
								  	totalPages = 0;
								  	filterResultsCount = 0;
									document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
									renderBillPageDefault('PENDING');
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');					
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
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('PENDING');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Unsettled Bills. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';
				      
				      	renderBillPageDefault('PENDING');

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('PENDING');
					}
				});  


				break;
			}			

			default:{
				showToast('System Error: Filter criteria did not found. Please contact Accelerate Support if problem persists.', '#e74c3c');
				document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
				renderBillPageDefault('PENDING');			
			}
			
		}


	}
	else{ //Filter Not Applied

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bills/_view/all?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("pendingBillsCount").innerHTML = 0;
		      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">There are no Unsettled Bills.</p>';
				return '';
		      }

		      document.getElementById("pendingBillsCount").innerHTML = data.total_rows;
		      totalPages = Math.ceil(data.total_rows/10);
		      
		      var resultsList = data.rows;
		      var resultRender = '';
		      var n = 0;
		      while(resultsList[n]){

		      	var bill = resultsList[n].doc;

				resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
													'        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
													'        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td><b style="color: #f39c12; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+bill.payableAmount+'</b></td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
		      	n++;
		      }

				document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">Bill</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th> <th style="text-align: left">Amount Payable</th>'+
							'<th style="text-align: left">Steward</th></tr></thead><tbody>'+resultRender+'</tbody></table>';

		      	renderBillPageDefault('PENDING')

		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">Somethin went wrong. Try again.</p>';
		    }

		  });  		
	}


}

function updatePendingCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bills/_view/all?descending=true&include_docs=false',
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("pendingBillsCount").innerHTML = 0;
				return '';
		      }

		      document.getElementById("pendingBillsCount").innerHTML = data.total_rows;
		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    }

		  });
}

function updateSettledCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB,
		    timeout: 10000,
		    success: function(data) {

		      if(data.db_name == SELECTED_INVOICE_SOURCE_DB){
		      	document.getElementById("settledBillsCount").innerHTML = parseInt(data.doc_count) - 5; // 5 other docs (VERY IMP!!!)
		      	console.log('~ minus 5 : THIS IS VERY IMPORTANT!')
		      }
		      else{
		      	document.getElementById("settledBillsCount").innerHTML = 0;
				return '';
		      }

		      
		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    }

		  });
}

function calculateSettledCount(){


		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB,
		    timeout: 10000,
		    success: function(data) {

		      if(data.db_name == SELECTED_INVOICE_SOURCE_DB){
		      	document.getElementById("settledBillsCount").innerHTML = parseInt(data.doc_count) - 5; // 5 other docs (VERY IMP!!!)
		      	console.log('~ minus 5 : THIS IS VERY IMPORTANT!')
		      }
		      else{
		      	document.getElementById("settledBillsCount").innerHTML = 0;
				return '';
		      }

		      
		    }
		    
		  });
}

function getPaymentCodeEquivalentName(code){

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

		return code;
	}
	else{
		return 'Paid';
	}
}


function loadAllSettledBills(optionalAnimationFlag){


	if(optionalAnimationFlag && optionalAnimationFlag == 'LOADING_ANIMATION'){
		//Show Animation
		document.getElementById("billBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';
	}

	/*
		Frame the FILTER
	*/

	var isFilterApplied = false;
	var filterObject;
		  
	var filter_start = '';
	var filter_end = '';
	var filter_key = '';


	if(window.localStorage.billFilterCriteria && window.localStorage.billFilterCriteria != ''){
		isFilterApplied = true;
		filterObject = JSON.parse(window.localStorage.billFilterCriteria);

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




	$("#billSelection_settled").addClass("billTypeSelectionBox");
	$("#billSelection_pending").removeClass("billTypeSelectionBox");
	document.getElementById("billDetailedDisplayRender").innerHTML = ''


	document.getElementById("billTypeTitle").innerHTML = 'Settled Bills';
	document.getElementById("billTypeTitle").style.color = '#22b396';

	if(currentPage == 1){
		if(isFilterApplied){
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearAppliedFilter(\'SETTLED\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterResultsCounter"></count></button>';
		}
		else{
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModalBills(\'SETTLED\')">Apply Filter</button>';
		}
	}


	//reset pagination counter
	if(displayType != 'SETTLED'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'SETTLED';
		renderBillPageDefault();
	}

		//Preload payment modes
		if(currentPage == 1)
		{


		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ACCELERATE_PAYMENT_MODES" 
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
		          if(data.docs[0].identifierTag == 'ACCELERATE_PAYMENT_MODES'){

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
		updateSettledCount();


		switch(filterObject.searchMode){

			case "customer":{
				/*
					FILTER USING CUSTOMER MOBILE NUMBER 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');					
					}
				});  


				break;
			}


			case "amount":{
				/*
					FILTER USING BILL AMOUNT 
				*/

			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbyamount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbyamount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');					
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
					}
				});  


				break;
			}


			case "discount":{
				/*
					FILTER DISCOUNTED OR NON-DISCOUNTED ORDERS
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbydiscount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbydiscount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
					}
				});  


				break;
			}


			case "refund":{
				/*
					FILTER REFUNDED OR NON ORDERS
				*/


			  	//TWEAK -- Get the count for Pagination
			  	if(currentPage == 1){
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbyrefund?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbyrefund?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }

					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
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

						    //Set _id from Branch mentioned in Licence
						    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
						    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
						      showToast('Invalid Licence Error: KOT can not be generated. Please contact Accelerate Support if problem persists.', '#e74c3c');
						      return '';
						    }

						    var bill_request_data = accelerate_licencee_branch +"_INVOICE_"+ filter_key;

						    $.ajax({
						      type: 'GET',
						      url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/'+bill_request_data,
						      timeout: 10000,
						      success: function(data) {
						        if(data._id != ""){

							          	var bill = data;
										totalPages = 1;

								      	var resultRender = '';
								      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
							                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
							                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
							                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
							                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
							                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
							                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
							                            '    </tr>';


										document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
									      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
									      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
						      
							      		renderBillPageDefault('SETTLED')
							      		
							        }
							        else{
							        	totalPages = 0;
							        	filterResultsCount = 0;
									    document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
										renderBillPageDefault('SETTLED');
										return '';
									    
							        }

							      },
							      error: function(data) {
							        showToast('Error: Invoice #'+filter_key+' not found.', '#e74c3c');
								  	totalPages = 0;
								  	filterResultsCount = 0;
									document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
									renderBillPageDefault('SETTLED');
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }


					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }


					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');					
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
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
								document.getElementById("filterResultsCounter").innerHTML = '';
								filterResultsCount = 0;
								renderBillPageDefault('SETTLED');
								return '';
						    }


						}
					});  
				}

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching results found in Settled Bills. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('SETTLED');
						return '';
					  }


					    var n = 0;
					    while(resultsList[n]){
					      	var bill = resultsList[n].doc;

					      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
				                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
				                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
				                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
				                            '    </tr>';
					      	n++;
					    }


						document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
			      
				      	renderBillPageDefault('SETTLED')

					},
					error: function(data){
						showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
						document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
						renderBillPageDefault('SETTLED');					
					}
				});  


				break;
			}


			default:{
				showToast('System Error: Filter criteria did not found. Please contact Accelerate Support if problem persists.', '#e74c3c');
				document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" style="background: #ef1717 !important" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Error!<count id="filterResultsCounter"></count></button>';
				renderBillPageDefault('SETTLED');			
			}

		}


	}
	else{ //Filter Not Applied

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoices/_view/all?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("settledBillsCount").innerHTML = 0;
		      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">There are no Unsettled Bills.</p>';
				return '';
		      }

		      document.getElementById("settledBillsCount").innerHTML = data.total_rows;
		      totalPages = Math.ceil(data.total_rows/10);
		      
		      var resultsList = data.rows;
		      var resultRender = '';
		      var n = 0;
		      while(resultsList[n]){

		      	var bill = resultsList[n].doc;

		      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'SETTLED\')">'+
	                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
	                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
	                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
	                            '        <td>'+(bill.customerName != '' ? bill.customerName+'<br>' : '')+bill.customerMobile+'</td>'+
	                            '        <td><b style="color:#22b396; font-family:\'Oswald\'; font-size: 135%"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</b></td>'+
	                            '        <td>'+getPaymentCodeEquivalentName(bill.paymentMode)+(bill.refundDetails ? '<tag style="display: block; color: #f59d13; font-size: 11px;"><i class="fa fa-inr"></i>'+bill.refundDetails.amount+' refunded</tag>' : '')+'</td>'+
	                            '    </tr>';
		      	n++;
		      }


				document.getElementById("billBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr> <th style="text-align: left">Invoice</th> <th style="text-align: left">Date</th>'+
				      						'<th style="text-align: left">Details</th> <th style="text-align: left">Customer</th>'+
				      						'<th style="text-align: left">Paid Amount</th> <th style="text-align: left">Payment</th></tr></thead><tbody>'+resultRender+'<tbody></table>';
	      
		      	renderBillPageDefault('SETTLED')

		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">Somethin went wrong. Try again.</p>';
		    
		    }

		  });  		
	}

}



function renderBillPageDefault(target){

	if(totalPages == 0){
		document.getElementById("navigationAssitantBills").innerHTML = '';
	}
	else if(totalPages == 1){
		document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>';
	}
	else if(totalPages > 1){
		if(currentPage == 1){
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage+1)+'\', \''+target+'\')"><i class="fa fa-chevron-right"></i></button>';	
		}
		else if(currentPage == totalPages){
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage-1)+'\', \''+target+'\')"><i class="fa fa-chevron-left"></i></button>';		
		}
		else{
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage+1)+'\', \''+target+'\')"><i class="fa fa-chevron-right"></i></button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage-1)+'\', \''+target+'\')"><i class="fa fa-chevron-left"></i></button>';	
		}
	}
	else{
		document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>'+                    
                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;"><i class="fa fa-chevron-right"></i></button>'+
                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;"><i class="fa fa-chevron-left"></i></button>';
	}
}


function gotoBillPage(toPageID, target){
	currentPage = parseInt(toPageID);

	if(target == 'PENDING'){
		loadAllPendingSettlementBills();
	}
	else if(target == 'SETTLED'){
		loadAllSettledBills();
	}

	renderBillPageDefault(target);
}


function viewDeliveryAddressFromBill(addressContent) {
	var address = JSON.parse(decodeURI(addressContent));
	document.getElementById("addressViewFromBillModal").style.display = 'block';

	document.getElementById("addressViewFromBillModalContent").innerHTML = ''+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;"><b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.name+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+address.flatNo+(address.flatName && address.flatName != '' ? ', '+address.flatName : '')+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+address.landmark+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0 0 5px 0;">'+address.area+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+(address.contact && address.contact != '' ? 'Mob. <tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+address.contact+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>' : '')+'</p>';
}

function viewDeliveryAddressFromBillHide() {
	document.getElementById("addressViewFromBillModal").style.display = 'none';
}

function openSelectedBill(encodedBill, type){

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




	var bill = JSON.parse(decodeURI(encodedBill));

	if(type == 'PENDING'){

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
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.extras[m].name+' ('+(bill.extras[m].unit == 'PERCENTAGE' ? bill.extras[m].value+'%' : 'Rs. '+bill.extras[m].value)+')</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(Math.round(bill.extras[m].amount * 100) / 100)+'</td> </tr>';
				charges_extra += bill.extras[m].amount;
				m++;
			}
		}

		if(!jQuery.isEmptyObject(bill.customExtras)){
			if(bill.customExtras.amount && bill.customExtras.amount != 0){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.customExtras.type+' ('+(bill.customExtras.unit == 'PERCENTAGE' ? bill.customExtras.value+'%' : 'Rs. '+bill.customExtras.value)+')</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(Math.round(bill.customExtras.amount * 100) / 100)+'</td> </tr>';
				charges_extra += bill.customExtras.amount;
			}
		}

		if(!jQuery.isEmptyObject(bill.discount)){
			if(bill.discount.amount && bill.discount.amount != 0){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Discounts<tag onclick="openDiscountDetailsInfo(\''+encodeURI(JSON.stringify(bill.discount))+'\')" class="refundIssueSmallButton"><i class="fa fa-question"></i></tag></td> <td style="text-align: right">'+(bill.discount.amount && bill.discount.amount != 0 ? '<tag style="color: red">- <i class="fa fa-inr"></i>'+(Math.round(bill.discount.amount * 100) / 100)+'</tag>' : '0')+'</td> </tr>';
				charges_extra = charges_extra - bill.discount.amount;
			}
		}

		grandSumCalculated = subTotal + charges_extra;
		grandSumCalculated = parseFloat(grandSumCalculated).toFixed(2);

		if(bill.calculatedRoundOff != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Calculated Round Off</td> <td style="text-align: right">'+(bill.calculatedRoundOff > 0 ? '<tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>' : '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>')+'</td> </tr>';
		}

		otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Payable Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+parseFloat(bill.payableAmount).toFixed(2)+'</td> </tr>';



		var deliveryOrderSubOption = '';
		var deliveryAgentDetailsContent = '';

		if(bill.orderDetails.modeType == 'DELIVERY'){
			if(jQuery.isEmptyObject(bill.deliveryDetails)){
					deliveryOrderSubOption = 	'<li class="floaty-list-item floaty-list-item--blue" id="triggerClick_AssignAgentButton" onclick="assignDeliveryAgent(\''+bill.billNumber+'\', \'GENERATED_BILLS\')">'+
			                                      '<tag style="color: #FFF; text-align: center; padding-top: 5px; font-size: 20px;" class="absolute-center">'+
			                                        '<i class="fa fa-truck"></i>'+
			                                      '</tag>'+
			                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Assign Delivery Agent</span>'+
			                                    '</li>';
			}
			else{
				if(bill.deliveryDetails.name == '' && bill.deliveryDetails.mobile == ''){
					deliveryOrderSubOption = 	'<li class="floaty-list-item floaty-list-item--blue" id="triggerClick_AssignAgentButton" onclick="assignDeliveryAgent(\''+bill.billNumber+'\', \'GENERATED_BILLS\')">'+
			                                      '<tag style="color: #FFF; text-align: center; padding-top: 5px; font-size: 20px;" class="absolute-center">'+
			                                        '<i class="fa fa-truck"></i>'+
			                                      '</tag>'+
			                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Assign Delivery Agent</span>'+
			                                    '</li>';
				}		
				else{
					deliveryAgentDetailsContent = '<div class="deliveryAddress"> <p class="deliveryTitle">Delivery Details</p>'+( bill.deliveryDetails.name != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.deliveryDetails.name+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.deliveryDetails.mobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.deliveryDetails.mobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div>';
				}		
			}
        }


        //Submenu options
        var subOptions = '';

        if(isUserAnAdmin){
        	subOptions = '<div class="floaty" style="right: -10px; top: 0">'+
                                  '<div class="floaty-btn small" id="triggerClick_settleBillButton" style="box-shadow: none;" onclick="settleBillAndPush(\''+encodedBill+'\', \'GENERATED_BILLS\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-check"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Settle Bill</span>'+
                                  '</div>'+
                                  '<ul class="floaty-list" style="margin-top: 60px !important; padding-left: 3px;">'+
                                    '<li class="floaty-list-item floaty-list-item--violet" id="triggerClick_PrintDuplicateBillButton" onclick="printDuplicateBill(\''+encodedBill+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-print whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Print Duplicate Bill</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--palegreen" onclick="lateApplyDiscount(\''+encodedBill+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-bolt whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Offer Discount</span>'+
                                    '</li>'+ deliveryOrderSubOption +
                                    '<li class="floaty-list-item floaty-list-item--red" onclick="initiateCancelSettledBill(\''+bill.billNumber+'\',\''+bill.totalAmountPaid+'\', \''+(bill.paymentMode && bill.paymentMode != '' ? 'PAID' : 'UNPAID')+'\', \'GENERATED_BILLS_PENDING\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-trash-o whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Cancel Bill</span>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';
        }
        else{
            subOptions = '<div class="floaty" style="right: -10px; top: 0">' +
        					'<div class="floaty-btn small" style="box-shadow: none; background: #7571ce" id="triggerClick_PrintDuplicateBillButton" onclick="printDuplicateBill(\''+encodedBill+'\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-print"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Print Duplicate Bill</span>'+
                                  '</div>'+
                         '</div>';      	
        }




		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+ 
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.billNumber+'</tag><tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag></tag>'+(bill.orderDetails.modeType == 'DINE' ? '<tag class="billTypeSmallBox">Table <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? '<tag class="billTypeSmallBox">Token <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'DELIVERY' ? '<tag class="billTypeSmallBox viewAddressBox" onclick="viewDeliveryAddressFromBill(\''+encodeURI(bill.table)+'\')">View Address</b></tag>' : '')+'</h3>'+subOptions+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at <b style="color: #f39c12">'+getFancyTime(bill.timeBill)+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> KOT Number <tag style="color: #50aade; font-weight: bold;">'+bill.KOTNumber+'</tag></time>'+
												      '<div class="table-responsive" style="overflow-x: hidden !important">'+
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
												            '<div class="col-xs-4"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+((bill.customerName == '' && bill.customerMobile == '') ? '<p class="deliveryText" style="color: #ff8787">Not Available</p>' : '')+( bill.customerName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.customerName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.customerMobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.customerMobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												            '<div class="col-xs-4">'+deliveryAgentDetailsContent+'</div>'+
												            '<div class="col-xs-4"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p>'+( bill.stewardName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.stewardName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.stewardCode != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.stewardCode+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												         '</div>'+
												      '</div>'+
												      '<div class="clearfix"></div>'+
												'   </div>'+
												'</div>';



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

				
	}
	else if(type == 'SETTLED'){

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

		var otherCharges = '';
		if(!jQuery.isEmptyObject(bill.refundDetails) && bill.refundDetails.amount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Sub Total<tag style="color: red">*</tag></td> <td style="text-align: right"><i class="fa fa-inr"></i>'+subTotal+'</td> </tr>';
		}

		if(otherCharges == '') //if above condition fails
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Sub Total</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+subTotal+'</td> </tr>';
		
		var charges_extra = 0;
		if(!jQuery.isEmptyObject(bill.extras)){
			var m = 0;
			while(bill.extras[m]){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.extras[m].name+' ('+(bill.extras[m].unit == 'PERCENTAGE' ? bill.extras[m].value+'%' : 'Rs. '+bill.extras[m].value)+')</td>  <td style="text-align: right"><i class="fa fa-inr"></i>'+(Math.round(bill.extras[m].amount * 100) / 100)+'</td> </tr>';
				charges_extra += bill.extras[m].amount;
				m++;
			}
		}

		if(!jQuery.isEmptyObject(bill.customExtras)){
			if(bill.customExtras.amount && bill.customExtras.amount != 0){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.customExtras.type+' ('+(bill.customExtras.unit == 'PERCENTAGE' ? bill.customExtras.value+'%' : 'Rs. '+bill.customExtras.value)+')</td>  <td style="text-align: right"><i class="fa fa-inr"></i>'+(Math.round(bill.customExtras.amount * 100) / 100)+'</td> </tr>';
				charges_extra += bill.customExtras.amount;
			}
		}

		if(!jQuery.isEmptyObject(bill.discount)){
			if(bill.discount.amount && bill.discount.amount != 0){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Discounts<tag onclick="openDiscountDetailsInfo(\''+encodeURI(JSON.stringify(bill.discount))+'\')" class="refundIssueSmallButton"><i class="fa fa-question"></i></tag></td> <td style="text-align: right">'+(bill.discount.amount && bill.discount.amount != 0 ? '<tag style="color: red">- <i class="fa fa-inr"></i>'+(Math.round(bill.discount.amount * 100) / 100)+'</tag>' : '0')+'</td> </tr>';
				charges_extra = charges_extra - bill.discount.amount;
			}
		}

		grandSumCalculated = subTotal + charges_extra;
		grandSumCalculated = parseFloat(grandSumCalculated).toFixed(2);

		if(bill.calculatedRoundOff != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Calculated Round Off</td> <td style="text-align: right">'+(bill.calculatedRoundOff > 0 ? '<tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>' : '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>')+'</td> </tr>';
		}

		otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Total Payable Amount</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+parseFloat(bill.payableAmount).toFixed(2)+'</td> </tr>';
		

		
		//check if any tips/round off added
		if(bill.tipsAmount && bill.tipsAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Tips</td>  <td style="text-align: right"><tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+bill.tipsAmount+'</tag></td> </tr>';
		}

		if(bill.roundOffAmount && bill.roundOffAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Waived Round Off</td>  <td style="text-align: right"><tag style="color: #f15959">- <i class="fa fa-inr"></i>'+bill.roundOffAmount+'</tag></td> </tr>';
		}

		//Check for Refunds issued if any
		var isDone = false;
		var issued_refund = 0;
		if(!jQuery.isEmptyObject(bill.refundDetails)){
			if(bill.refundDetails.amount && bill.refundDetails.amount != 0){
				issued_refund = bill.refundDetails.amount;
				otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Paid Amount</b></td> <td style="font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+parseFloat(bill.totalAmountPaid).toFixed(2)+'</td> </tr>';
				otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Refund Issued</b><tag style="color: red">*</tag><tag onclick="openRefundDetailsInfo(\''+encodeURI(JSON.stringify(bill.refundDetails))+'\')" class="refundIssueSmallButton"><i class="fa fa-info"></i></tag></td> <td style="font-weight: bold; text-align: right">'+(issued_refund != 0 ? '<tag style="color: red">- <i class="fa fa-inr"></i>'+parseFloat(issued_refund).toFixed(2)+'</tag>' : '0')+'</td> </tr>';
				otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Net Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+parseFloat((bill.totalAmountPaid - issued_refund)).toFixed(2)+'</td> </tr>';
				
				isDone = true;
			}
		}

		if(!isDone){
			otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Paid Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+parseFloat(bill.totalAmountPaid).toFixed(2)+'</td> </tr>';
		}


		//Payment Splits, if applicable
		var paymentSplitList = '';
		var paymentOptionUsedButton = '';

		if(!jQuery.isEmptyObject(bill.paymentSplits)){
			var n = 0;
			while(bill.paymentSplits[n]){
				paymentSplitList += '<a href="#"><p class="splitPayListTitle">'+bill.paymentSplits[n].name+' <tag style="float: right; font-weight: bold;"><i class="fa fa-inr"></i>'+bill.paymentSplits[n].amount+'</tag>'+
										'<p class="splitPayListRef">'+(bill.paymentSplits[n].reference && bill.paymentSplits[n].reference != '' ? bill.paymentSplits[n].reference : '')+'</p>'+
									'</a>';
				n++;
			}

			//Undo Button
			if(isUserAnAdmin){
				paymentSplitList += '<a href="#" style="padding: 2px 16px; min-height: unset !important; height: 40px; font-size: 12px; color: #f39c12;" onclick="openUndoSettleWarning('+bill.billNumber+')">'+
										'<p class="splitPayListTitle"><i class="fa fa-warning"></i> Unsettle</p>'+
									'</a>';
			}

			paymentOptionUsedButton =  	'<div class="splitPayListDropdown">'+
										 	'<div class="splitPayListButton">Multiple Payments</div>'+
											'<div class="splitPayListDropdown-content"><div class="holdContentArea">'+paymentSplitList+'</div>'+
										 	'</div>'+
										'</div>';										
		}
		else{
			paymentSplitList = '<a href="#"><p class="splitPayListTitle">'+getPaymentCodeEquivalentName(bill.paymentMode)+' <tag style="float: right; font-weight: bold;"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</tag>'+
									'<p class="splitPayListRef">'+(bill.paymentReference && bill.paymentReference != '' ? bill.paymentReference : '')+'</p>'+
								'</a>';

			//Undo Button
			if(isUserAnAdmin){
				paymentSplitList += '<a href="#" style="padding: 2px 16px; min-height: unset !important; height: 40px; font-size: 12px; color: #f39c12;" onclick="openUndoSettleWarning('+bill.billNumber+')">'+
										'<p class="splitPayListTitle"><i class="fa fa-warning"></i> Unsettle</p>'+
									'</a>';
			}

			paymentOptionUsedButton =  	'<div class="splitPayListDropdown">'+
										 	'<div class="splitPayListButton">'+getPaymentCodeEquivalentName(bill.paymentMode)+'</div>'+
											'<div class="splitPayListDropdown-content"><div class="holdContentArea">'+paymentSplitList+'</div>'+
										 	'</div>'+
										'</div>';	
		}


		var deliveryOrderSubOption = '';
		var deliveryAgentDetailsContent = '';
		
		if(bill.orderDetails.modeType == 'DELIVERY'){
			if(jQuery.isEmptyObject(bill.deliveryDetails)){
					deliveryOrderSubOption = 	'<li class="floaty-list-item floaty-list-item--blue" id="triggerClick_AssignAgentButton" onclick="assignDeliveryAgent(\''+bill.billNumber+'\', \'GENERATED_BILLS_SETTLED\')">'+
			                                      '<tag style="color: #FFF; text-align: center; padding-top: 5px; font-size: 20px;" class="absolute-center">'+
			                                        '<i class="fa fa-truck"></i>'+
			                                      '</tag>'+
			                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Assign Delivery Agent</span>'+
			                                    '</li>';
			}
			else{
				if(bill.deliveryDetails.name == '' && bill.deliveryDetails.mobile == ''){
					deliveryOrderSubOption = 	'<li class="floaty-list-item floaty-list-item--blue" id="triggerClick_AssignAgentButton" onclick="assignDeliveryAgent(\''+bill.billNumber+'\', \'GENERATED_BILLS_SETTLED\')">'+
			                                      '<tag style="color: #FFF; text-align: center; padding-top: 5px; font-size: 20px;" class="absolute-center">'+
			                                        '<i class="fa fa-truck"></i>'+
			                                      '</tag>'+
			                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Assign Delivery Agent</span>'+
			                                    '</li>';
				}		
				else{
					deliveryAgentDetailsContent = '<div class="deliveryAddress" style="position: relative"> <p class="deliveryTitle">Delivery Details<tag class="billTypeSmallBox viewAddressBox" onclick="viewDeliveryAddressFromBill(\''+encodeURI(bill.table)+'\')" style="float: right; position: absolute; top: 4px; right: 4px;"><i class="fa fa-home"></i></tag></p>'+( bill.deliveryDetails.name != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.deliveryDetails.name+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.deliveryDetails.mobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.deliveryDetails.mobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div>';
				}				
			}
        }

        //Submenu options
        var subOptions = '';

        var totalTaxableExtras = 0; //for Refund (TWEAK)
       	for(var g = 0; g < bill.extras.length; g++){
            if(bill.extras[g].unit == 'PERCENTAGE'){
             	totalTaxableExtras += (bill.extras[g].value / 100);
            }
        }

        /* custom extras */
       	if(bill.customExtras.amount && bill.customExtras.amount != 0){
            if(bill.customExtras.unit == 'PERCENTAGE'){
                totalTaxableExtras += (bill.customExtras.value / 100);
            }
        }

        totalTaxableExtras = parseFloat(totalTaxableExtras).toFixed(2);
        totalTaxableExtras = parseFloat(totalTaxableExtras);


        var refundIssueStatus = '';
        if(!jQuery.isEmptyObject(bill.refundDetails)){
            refundIssueStatus = bill.refundDetails.status;
        }


        if(isUserAnAdmin){
        	subOptions = '<div class="floaty" style="right: -10px; top: 0">'+
                                  '<div class="floaty-btn small" style="box-shadow: none;" id="triggerClick_PrintDuplicateBillButton" onclick="printDuplicateBill(\''+encodedBill+'\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-print"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Print Duplicate Invoice</span>'+
                                  '</div>'+
                                  '<ul class="floaty-list" style="margin-top: 60px !important; padding-left: 3px;">'+
                                    deliveryOrderSubOption+
                                    '<li class="floaty-list-item floaty-list-item--yellow" id="triggerClick_IssueRefundButton" onclick="initiateRefundSettledBill(\''+refundIssueStatus+'\', \''+bill.billNumber+'\',\''+bill.totalAmountPaid+'\', \''+bill.paymentMode+'\', \''+totalTaxableExtras+'\', \''+(bill.paymentMode && bill.paymentMode != '' ? 'PAID' : 'UNPAID')+'\', \'GENERATED_BILLS_SETTLED\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 0px; font-size: 26px;" class="absolute-center">'+
                                        '<i class="fa fa-inr"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Issue Refund</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--red" id="triggerClick_CancelInvoiceButton" onclick="initiateCancelSettledBill(\''+bill.billNumber+'\',\''+bill.totalAmountPaid+'\', \''+(bill.paymentMode && bill.paymentMode != '' ? 'PAID' : 'UNPAID')+'\', \'GENERATED_BILLS_SETTLED\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-trash-o whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Cancel Invoice</span>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';
        }
        else{
        	subOptions = '<div class="floaty" style="right: -10px; top: 0">' +
        					'<div class="floaty-btn small" style="box-shadow: none;" id="triggerClick_PrintDuplicateBillButton" onclick="printDuplicateBill(\''+encodedBill+'\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-print"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Print Duplicate Invoice</span>'+
                                  '</div>'+
                         '</div>';      	
        }


		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.billNumber+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+paymentOptionUsedButton+'</h3>'+subOptions+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at <b style="color: #5dd2a1">'+getFancyTime(bill.timeBill)+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> KOT Number <tag style="color: #50aade; font-weight: bold;">'+bill.KOTNumber+'</tag></time>'+
												      '<div class="table-responsive" style="overflow-x: hidden !important">'+
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
												            '<div class="col-xs-4"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+((bill.customerName == '' && bill.customerMobile == '') ? '<p class="deliveryText" style="color: #ff8787">Not Available</p>' : '')+( bill.customerName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.customerName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.customerMobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.customerMobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												            '<div class="col-xs-4">'+deliveryAgentDetailsContent+'</div>'+
												            '<div class="col-xs-4"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p>'+( bill.stewardName != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.stewardName+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.stewardCode != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.stewardCode+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div> </div>'+
												         '</div>'+
												      '</div>'+
												      '<div class="clearfix"></div>'+
												'   </div>'+
												'</div>';


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

	}
	else{
		showToast('System Error: Failed to Render. Please contact Accelerate Support if problem persists.', '#e74c3c');
		return '';
	}	
}


function getPrimaryRefundStatus(status, amount){
	if(status == 2){
		return 'Partial Refund of <b><i class="fa fa-inr"></i>'+amount+'</b> issued';
	}
	else if(status == 3){
		return 'Full Refund of <b><i class="fa fa-inr"></i>'+amount+'</b> issued';
	}
	else{
		return '-';
	}
}

function openRefundDetailsInfo(encodedInfo){
	var info = JSON.parse(decodeURI(encodedInfo));

	document.getElementById("refundReasonPrimaryModal").style.display = 'block';
	document.getElementById("refundReasonPrimaryModalContent").innerHTML = ''+
												      '<div class="table-responsive" style="overflow-x: hidden !important">'+
												         '<table class="table">'+
												         	'<col width="35%">'+
												         	'<col width="65%">'+
												            (info.reason && info.reason != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Reason</td> <td>'+info.reason+'</td> </tr>' : '' )+
												            (info.comments && info.comments != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Comments</td> <td style="font-style: italic; font-weight: bold;">'+info.comments+'</td> </tr>' : '')+
												            (info.refundedBy && info.refundedBy != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Refunded By</td> <td>'+info.refundedBy+'</td> </tr>' : '')+
												            (info.timeRefund && info.timeRefund != '--:--' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Time</td> <td>'+getFancyTime(info.timeRefund)+'</td> </tr>' : '')+
												            '<tr><td style="color: #6f90b1; font-weight: bold;">Refund Status</td> <td>'+getPrimaryRefundStatus(info.status, info.amount)+'</td> </tr>'+
												            '<tr><td style="color: #6f90b1; font-weight: bold;">Refund Mode</td> <td>'+(info.mode == 'CASH' ? 'Cash' : 'Original Mode ('+info.mode+')')+'</td> </tr>'+
												            '</tbody>'+
												         '</table>'+
												      '</div>';

}

function openRefundDetailsInfoHide(){
	document.getElementById("refundReasonPrimaryModal").style.display = 'none';
}


function getDiscountTypeName(type){
	switch(type){
		case "COUPON":{
			return "Coupon Applied";
		}
		case "VOUCHER":{
			return "Voucher Redeemed";
		}
		case "NOCOSTBILL":{
			return "Marked as No Cost Bill";
		}
		case "REWARDS":{
			return "Redeemed Reward Points";
		}
		case "ONLINE":{
			return "Pre-applied Online Discount";
		}
		default:{
			return type;
		}
	}
}

function getDiscountRefName(type){
	switch(type){
		case "COUPON":{
			return "Coupon Code";
		}
		case "VOUCHER":{
			return "Voucher Code";
		}
		case "NOCOSTBILL":{
			return "Comments";
		}
		case "REWARDS":{
			return "Reference";
		}
		case "ONLINE":{
			return "Reference";
		}
		default:{
			return 'Reference';
		}
	}	
}

function openDiscountDetailsInfo(encodedInfo){
	var info = JSON.parse(decodeURI(encodedInfo));

	console.log(info)

	document.getElementById("discountReasonPrimaryModal").style.display = 'block';
	document.getElementById("discountReasonPrimaryModalContent").innerHTML = ''+
												      '<div class="table-responsive" style="overflow-x: hidden !important">'+
												         '<table class="table">'+
												         	'<col width="35%">'+
												         	'<col width="65%">'+
												            (info.type && info.type != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">Type</td> <td>'+getDiscountTypeName(info.type)+'</td> </tr>' : '' )+
												            (info.amount && info.amount != 0 ? '<tr><td style="color: #6f90b1; font-weight: bold;">Amount</td> <td style="font-weight: bold;"><i class="fa fa-inr"></i>'+info.amount+'</td> </tr>' : '')+
												            '<tr><td style="color: #6f90b1; font-weight: bold;">Discount Value</td> <td>'+(info.unit == 'PERCENTAGE' ? info.value+'%' : (info.unit == 'FIXED' ? '<i class="fa fa-inr"></i>'+info.value : '-'))+'</td> </tr>'+
												            (info.reference && info.reference != '' ? '<tr><td style="color: #6f90b1; font-weight: bold;">'+getDiscountRefName(info.type)+'</td> <td><b>'+info.reference+'</b></td> </tr>' : '')+
												            '</tbody>'+
												         '</table>'+
												      '</div>';

}

function openDiscountDetailsInfoHide(){
	document.getElementById("discountReasonPrimaryModal").style.display = 'none';
}



/* SEARCH AND FILTER */

function openFilterModalBills(optionalRoute){

	document.getElementById("searchFilterModal").style.display = 'block';

	if(optionalRoute == 'PENDING'){
		document.getElementById("actionButtonSearch").innerHTML = '<button  class="btn btn-success" onclick="filterSearchInitialize(\'PENDING\')" style="float: right">Proceed</button>';
	}
	else if(optionalRoute == 'SETTLED'){
		document.getElementById("actionButtonSearch").innerHTML = '<button  class="btn btn-success" onclick="filterSearchInitialize(\'SETTLED\')" style="float: right">Proceed</button>';
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

function changeFilterSearchCriteria(){

	var tempValue = '';
	if(document.getElementById("filter_search_key") != null){
		tempValue = document.getElementById("filter_search_key").value;
	}


	var criteria = document.getElementById("filterSearchCriteria").value;

	if(criteria == 'payment'){

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_PAYMENT_MODES" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_PAYMENT_MODES'){

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
	                    "identifierTag": "ACCELERATE_DINE_SESSIONS" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_DINE_SESSIONS'){

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
	                    "identifierTag": "ACCELERATE_CONFIGURED_MACHINES" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_CONFIGURED_MACHINES'){

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
	                    "identifierTag": "ACCELERATE_STAFF_PROFILES" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_STAFF_PROFILES'){

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
	else if(criteria == 'discount'){
	    document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="discounted">Discounted</option><option value="nondiscounted">Non Discounted</option></select>Orders</p>';
	}
	else if(criteria == 'refund'){
	    document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show Order with <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="norefund">No Refunds</option><option value="partialrefund">Partial Refund</option><option value="fullrefund">Full Refund</option></select>issued</p>';
	}
	else if(criteria == 'all'){
	    document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Showing <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="all">All the Orders</option></select></p>';
	}
	else{
		document.getElementById("filterSearchArea").innerHTML = '<input type="text" value="'+tempValue+'" class="form-control tip" id="filter_search_key" style="border: none; border-bottom: 2px solid; font-size: 36px; height: 60px; font-weight: 300; padding: 10px 3px;" placeholder="Search Here" required="required" />';
		$("#filter_search_key").focus();
	}
}

function filterSearchInitialize(optionalRoute){

	var dateFrom = '', dateTo = '', searchMode = 'bill', searchKey = '';

	dateFrom = document.getElementById("reportFromDate").value;
	dateTo = document.getElementById("reportToDate").value;

	searchMode = document.getElementById("filterSearchCriteria").value;

	if(searchMode == 'payment' || searchMode == 'type' || searchMode == 'steward' || searchMode == 'session' || searchMode == 'machine' || searchMode == 'discount' || searchMode == 'refund' || searchMode == 'all'){
		searchKey = document.getElementById("filterSearchCriteriaSelected").value;
	}
	else{
		searchKey = document.getElementById("filter_search_key").value;
		
		if(searchKey == ''){
			showToast('Warning: Please enter any Search Key.', '#e67e22');
			return '';
		}
	}

	//Show Animation
	document.getElementById("billBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';


	hideFilterModal();

	var searchObj = {};
	searchObj.dateFrom = dateFrom;
	searchObj.dateTo = dateTo;
	searchObj.searchMode = searchMode;
	searchObj.searchKey = searchKey;

	window.localStorage.billFilterCriteria = JSON.stringify(searchObj);

	document.getElementById("billBriefDisplayRender").innerHTML = '';

	if(optionalRoute == 'SETTLED'){
		loadAllSettledBills();
	}
	else{
		loadAllPendingSettlementBills('EXTERNAL');
	}
}

function clearAppliedFilter(optionalRoute){

	window.localStorage.billFilterCriteria = '';

	if(optionalRoute == 'SETTLED'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'SETTLED';

		loadAllSettledBills();
	}
	else{
		totalPages = 0;
		currentPage = 1;
		displayType = 'PENDING';

		loadAllPendingSettlementBills('EXTERNAL');
	}	
}



/* Assign Delivery Agent */
function assignDeliveryAgent(billNumber, optionalPageRef){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_STAFF_PROFILES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_STAFF_PROFILES'){

              var users = data.docs[0].value;
              users.sort(); //alphabetical sorting 

              if(users.length == 0){
                showToast('Warning: No User registered yet.', '#e67e22');
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
	                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="assignDeliveryAgentAfterProcess(\''+billNumber+'\', \''+users[n].code+'\', \''+users[n].name+'\', \''+optionalPageRef+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
	                }
	                else if(actualCounter == 1){
	                  isRendered = true;
	                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="assignDeliveryAgentAfterProcess(\''+billNumber+'\', \''+users[n].code+'\', \''+users[n].name+'\', \''+optionalPageRef+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
	                  renderContent += '</div>';
	                }
	                else if(actualCounter > 1 && actualCounter%2 == 0){
	                  renderContent += '<div class="row" style="margin: 4px 0 0 0">';
	                }

	                if(!isRendered){
	                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="assignDeliveryAgentAfterProcess(\''+billNumber+'\', \''+users[n].code+'\', \''+users[n].name+'\', \''+optionalPageRef+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
	                }

	                if(actualCounter > 1 && actualCounter%2 == 1){
	                  renderContent += '</div>';
	                }

	                actualCounter++;
	            }

                n++;
              }

              document.getElementById("deliveryBoysModal").style.display = 'block';

              if(renderContent == ''){
              	renderContent = '<p style="margin: 10px; color: #f12006; font-style: italic">No Delivery Agent profile created. Please <b onclick="renderPage(\'user-settings\', \'User Settings\');" style="color: #579eda; text-decoration: underline; cursor: pointer">Create a Profile</b></p>';
              }


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

function selectDeliveryBoyWindowSystemClose(){
  document.getElementById("deliveryBoysModal").style.display = 'none';
}

function assignDeliveryAgentAfterProcess(billNumber, code, name, optionalPageRef){

	selectDeliveryBoyWindowSystemClose();

	billNumber = parseInt(billNumber);

	var current_time = getCurrentTime('TIME');

    var deliveryObject = {
            "timeDelivery" : current_time,
            "name" : name,
            "mobile" : code
    }

    //Set _id from Branch mentioned in Licence
    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
      showToast('Invalid Licence Error: Bill can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
      return '';
    }


    var requestURL = 'accelerate_bills';
    var requestURLSource = 'PENDING';
	var invoice_request_data = accelerate_licencee_branch +"_BILL_"+ billNumber;

    if(optionalPageRef == 'GENERATED_BILLS_SETTLED'){
      requestURL = SELECTED_INVOICE_SOURCE_DB;
      requestURLSource = 'SETTLED';
      invoice_request_data = accelerate_licencee_branch +"_INVOICE_"+ billNumber;
    }

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/'+requestURL+'/'+invoice_request_data,
      timeout: 10000,
      success: function(firstdata) {
      	
        if(firstdata._id == invoice_request_data){

          var bill = firstdata;
          bill.deliveryDetails = deliveryObject;

                var encodedBill = encodeURI(JSON.stringify(bill));

                //Update Bill/Invoice on Server
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+requestURL+'/'+(bill._id)+'/',
                  data: JSON.stringify(bill),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Delivery agent <b>'+name+'</b> assigned', '#27ae60');
                      openSelectedBill(encodedBill, requestURLSource);
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


//Print Duplicate Bill
function printDuplicateBill(encodedBill){
	
	var bill = JSON.parse(decodeURI(encodedBill));
    sendToPrinter(bill, 'DUPLICATE_BILL');
    showToast('Duplicate Bill #'+bill.billNumber+' generated Successfully', '#27ae60');
}

//Offer Discount
function lateApplyDiscount(encodedBill){
	
	var bill = JSON.parse(decodeURI(encodedBill));

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_DISCOUNT_TYPES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_DISCOUNT_TYPES'){

              var modes = data.docs[0].value;
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                if(i == 0)
                    modesTag = '<option value="'+modes[i].name+'" selected="selected">'+modes[i].name+'</option>';
                  else
                    modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
              }

             if(!modesTag)
               document.getElementById("applyBillDiscountLate_type").innerHTML = '<option value="OTHER" selected="selected">Other</option>';
             else
               document.getElementById("applyBillDiscountLate_type").innerHTML = modesTag;
              
              document.getElementById("applyBillDiscountLate_grandSumDisplay").innerHTML = bill.grossCartAmount;
              document.getElementById("lateRefundModalActions").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" style="margin: 0; font-size: 15px; line-height: 2.5; text-transform: uppercase; border: none; border-radius: 0; width: 70%; float: right;" onclick="lateApplyDiscountConfirm(\''+bill.billNumber+'\')">Confirm</button>'+
              								'<button class="btn btn-default tableOptionsButton breakWord" style="margin: 0; border: none; font-size: 15px; line-height: 2.5; text-transform: uppercase; border-radius: 0; width: 30%; float: left;" onclick="lateApplyDiscountHide()">Close</button>';
        	  document.getElementById("lateRefundModal").style.display = 'block';

        	  $('#applyBillDiscountLate_value').focus();
  			  $('#applyBillDiscountLate_value').select();
          }
          else{
            showToast('Not Found Error: Discount Types data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Discount Types data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Discount Types data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}

function lateApplyDiscountHide(){
	document.getElementById("lateRefundModal").style.display = 'none';
}

function lateApplyDiscountValueFocus(){
	$('#applyBillDiscountLate_value').focus();
  	$('#applyBillDiscountLate_value').select();	
}


function estimateDiscountDisplay(){

  var tempTotal = parseFloat(document.getElementById("applyBillDiscountLate_grandSumDisplay").innerHTML).toFixed(2);
  var discValue = parseFloat(document.getElementById("applyBillDiscountLate_value").value).toFixed(2);

  if(document.getElementById("applyBillDiscountLate_value").value == ''){
    discValue = 0;
  }

  /*Calculations*/
  var roughDiscFigure = 0;
  if(document.getElementById("applyBillDiscountLate_unit").value == 'PERCENTAGE'){
    roughDiscFigure = tempTotal*discValue/100;
  }
  else{
    roughDiscFigure = discValue;
  }

  roughDiscFigure = Math.round(roughDiscFigure * 100) / 100;

  document.getElementById("applyBillDiscountLate_amount").innerHTML = roughDiscFigure;
}


function lateApplyDiscountConfirm(billNumber){

                  billNumber = parseInt(billNumber);

                  var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];

                  //Set _id from Branch mentioned in Licence
                  var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
                  if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
                    showToast('Invalid Licence Error: Bill can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
                    return '';
                  }

                  var bill_request_data = accelerate_licencee_branch +"_BILL_"+ billNumber;

                  $.ajax({
                    type: 'GET',
                    url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/'+bill_request_data,
                    timeout: 10000,
                    success: function(data) {
                      if(data._id == bill_request_data){

				          var billfile = data;

				          var grandPayableBill = 0;

				          /*Calculate Discount*/
				          var type = document.getElementById("applyBillDiscountLate_type").value;
				          var unit = document.getElementById("applyBillDiscountLate_unit").value;
				          var value = document.getElementById("applyBillDiscountLate_value").value;

				          var grandSum = 0;

				          var n = 0;
				          var netTaxableSum = 0;
				          while(billfile.cart[n]){
				            grandSum += (billfile.cart[n].price * billfile.cart[n].qty);
				            netTaxableSum += (billfile.cart[n].price * billfile.cart[n].qty);
				            n++;
				          }

				          grandPayableBill += grandSum;


				          var totalDiscount = 0;
				      
				          if(unit == 'PERCENTAGE'){
				            totalDiscount = grandSum*value/100;
				          }
				          else if(unit == 'FIXED'){

				            //calculate discount value
				            //discount should include sgst + cgst + etc...

				            //TotalUserDiscount = DiscountAmount + ExtrasVariation;

				            var extras_fraction = 0;
				            for(var g = 0; g < billfile.extras.length; g++){
				              if(billfile.extras[g].unit == 'PERCENTAGE'){
				                extras_fraction += (billfile.extras[g].value / 100);
				              }
				            }

				            /* custom extras */
				            if(billfile.customExtras.amount && billfile.customExtras.amount != 0){
				              if(billfile.customExtras.unit == 'PERCENTAGE'){
				                extras_fraction += (billfile.customExtras.value / 100);
				              }
				            }

				            var TotalUserDiscount = value;
				            totalDiscount = TotalUserDiscount/(1 + extras_fraction);
				          }

				          totalDiscount = Math.round(totalDiscount * 100) / 100;

				          //Cross Check if it matches with the BILLING MODE Restriction of Discounts
				          var g = 0;
				          var maximumReached = false;
				          while(billing_modes[g]){
				            if(billing_modes[g].name == billfile.orderDetails.mode){

				              if(!billing_modes[g].isDiscountable){
				                showToast('Error: Discount can not be applied on </b>'+billing_modes[g].name+'</b> orders', '#e74c3c');
				                return '';
				              }
				              else{
				                if(totalDiscount > billing_modes[g].maxDiscount){
				                  totalDiscount = billing_modes[g].maxDiscount;
				                  maximumReached = true;
				                }
				              }
				              break;
				            }
				            g++;
				          }


				          billfile.discount.amount = totalDiscount;
				          billfile.discount.type = type;
				          billfile.discount.unit = unit;
				          billfile.discount.value = value;
				          billfile.discount.reference = '';


				          /* Recalculate Tax Figures */
				          //Re-calculate tax figures (if any Discount applied)

				          netTaxableSum = netTaxableSum - totalDiscount;

				          if(totalDiscount > 0){
				            for(var g = 0; g < billfile.extras.length; g++){
				              
				              if(billfile.extras[g].unit == 'PERCENTAGE'){
				                var new_amount = (billfile.extras[g].value / 100) * netTaxableSum;
				                new_amount = Math.round(new_amount * 100) / 100;
				                billfile.extras[g].amount = new_amount;
				              }
				              else if(billfile.extras[g].unit == 'FIXED'){
				                //Do nothing
				              } 

				            }

				            /* custom extras */
				            if(billfile.customExtras.amount && billfile.customExtras.amount != 0){
				              if(billfile.customExtras.unit == 'PERCENTAGE'){
				                var new_amount = (billfile.customExtras.value / 100) * netTaxableSum;
				                new_amount = Math.round(new_amount * 100) / 100;
				                billfile.customExtras.amount = new_amount;
				              }
				              else if(billfile.customExtras.unit == 'FIXED'){
				                //Do nothing
				              }
				            }

				          }  

				          //add extras
				          if(!jQuery.isEmptyObject(billfile.extras)){
				            var m = 0;
				            while(billfile.extras[m]){
				              grandPayableBill += billfile.extras[m].amount;
				              m++;
				            }
				          } 

				          //add custom extras if any
				          if(!jQuery.isEmptyObject(billfile.customExtras)){
				            grandPayableBill += billfile.customExtras.amount;
				          }  

				          //substract discounts if any
				          if(!jQuery.isEmptyObject(billfile.discount)){
				            grandPayableBill -= billfile.discount.amount;
				          }  

				          grandPayableBill = Math.round(grandPayableBill * 100) / 100;
          				  var grandPayableBillRounded = properRoundOff(grandPayableBill);

				          billfile.payableAmount = properRoundOff(grandPayableBill);
				          billfile.calculatedRoundOff = Math.round((grandPayableBillRounded - grandPayableBill) * 100) / 100;


				          /*Save changes in Bill*/
				                
				                //Update
				                var updateData = billfile;

				                var encodedBill = encodeURI(JSON.stringify(billfile));

				                $.ajax({
				                  type: 'PUT',
				                  url: COMMON_LOCAL_SERVER_IP+'accelerate_bills/'+(billfile._id)+'/',
				                  data: JSON.stringify(updateData),
				                  contentType: "application/json",
				                  dataType: 'json',
				                  timeout: 10000,
				                  success: function(data) {
				                    if(maximumReached){
				                      showToast('Warning: Maximum discount (Rs. '+billing_modes[g].maxDiscount+') for </b>'+billing_modes[g].name+'</b> order reached', '#e67e22');
				                    }
				                    else{
				                      showToast('Discount of <i class="fa fa-inr"></i>'+totalDiscount+' Applied', '#27ae60');
				                    }

				                    loadAllPendingSettlementBills();
				                    openSelectedBill(encodedBill, 'PENDING');
				                    lateApplyDiscountHide();
				                  },
				                  error: function(data) {
				                      showToast('System Error: Unable to update the Bill. Please contact Accelerate Support.', '#e74c3c');
				                  }
				                }); 
                        
                      }
                      else{
                        showToast('Server Warning: Unable to modify bill data. Please contact Accelerate Support.', '#e67e22');
                      }
                    },
                    error: function(data) {
                      showToast('Server Warning: Unable to modify bill data. Please contact Accelerate Support.', '#e67e22');
                    }

                  });
}

