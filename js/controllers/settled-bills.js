
var currentPage = 1;
var totalPages = 1;
var displayType = 'PENDING';
var filterResultsCount = 0;

function loadAllPendingSettlementBills(optionalSource, optionalAnimationFlag){

	if(optionalAnimationFlag && optionalAnimationFlag == 'LOADING_ANIMATION'){
		//Show Animation
		document.getElementById("billBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';
	}

	//Adjust server source db
	SELECTED_INVOICE_SOURCE_DB = 'accelerate_invoices';

    // LOGGED IN USER INFO
    var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
          
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
																	'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
							        showToast('Error: Bill #'+filter_key+' not found.', '#e67e22');
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
													'        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
		    	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">Something went wrong. Try again.</p>';
		    }

		  });  		
	}



	//Get Star Rating
	function getStarRating(bill){

						    var starRating = '';
						    var commentsAdded = '';
					      	
					      	if(bill.customerReview && bill.customerReview != ''){
					      		commentsAdded = '<i class="fa fa-comments" style="color:#87ceeb; margin-left: 4px;"></i>';
					      	}

					      	if(bill.customerRating){
					      		for(var i = 1; i <= 5; i++){
					      			if(i <= bill.customerRating){ //Filled 
					      				starRating += '<i class="fa fa-star"></i>';
					      			}
					      			else{ //Empty
					      				starRating += '<i class="fa fa-star-o"></i>';
					      			}
					      		}

					      		if(bill.customerRating == 1){
					      			starRating = '<tag style="color: #ff3117; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 2 || bill.customerRating == 3){
					      			starRating = '<tag style="color: #ffc000; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 4){
					      			starRating = '<tag style="color: #a2da4f; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 5){
					      			starRating = '<tag style="color: #31d040; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      	}

					      	return starRating;
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

		      	var count = parseInt(data.doc_count) - 5;
		      	if(count < 0){
		      		count = 0;
		      	}

		      	document.getElementById("settledBillsCount").innerHTML = count; // 5 other docs (VERY IMP!!!)
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
			      
				      	renderBillPageDefault('SETTLED');

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
							                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
							        showToast('Error: Invoice #'+filter_key+' not found.', '#e67e22');
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
				                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
	                            '        <td><b style="color: #555">#'+bill.billNumber+'</b>'+getStarRating(bill)+'</td>'+
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
		    	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">Something went wrong. Try again.</p>';
		    
		    }

		  });  		
	}


	//Get Star Rating
	function getStarRating(bill){

						    var starRating = '';
						    var commentsAdded = '';
					      	
					      	if(bill.customerReview && bill.customerReview != ''){
					      		commentsAdded = '<i class="fa fa-comments" style="color:#87ceeb; margin-left: 4px;"></i>';
					      	}

					      	if(bill.customerRating){
					      		for(var i = 1; i <= 5; i++){
					      			if(i <= bill.customerRating){ //Filled 
					      				starRating += '<i class="fa fa-star"></i>';
					      			}
					      			else{ //Empty
					      				starRating += '<i class="fa fa-star-o"></i>';
					      			}
					      		}

					      		if(bill.customerRating == 1){
					      			starRating = '<tag style="color: #ff3117; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 2 || bill.customerRating == 3){
					      			starRating = '<tag style="color: #ffc000; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 4){
					      			starRating = '<tag style="color: #a2da4f; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 5){
					      			starRating = '<tag style="color: #31d040; display: block; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      	}

					      	return starRating;
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
				itemsList += '<tr> <td>'+(n+1)+'</td> <td class="deleteItemWrap" style="padding-left: 25px">'+bill.cart[n].name+' ('+bill.cart[n].variant+')<tag class="deleteItemIcon" onclick="deleteItemFromBill(\''+bill._id+'\', \''+bill.cart[n].code+'\', \''+bill.cart[n].variant+'\')"><i class="fa fa-minus-circle"></i></tag></td> <td style="text-align: center">'+bill.cart[n].qty+'</td> <td style="text-align: center"><i class="fa fa-inr"></i>'+bill.cart[n].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			else
				itemsList += '<tr> <td>'+(n+1)+'</td> <td class="deleteItemWrap" style="padding-left: 25px">'+bill.cart[n].name+'<tag class="deleteItemIcon" onclick="deleteItemFromBill(\''+bill._id+'\', \''+bill.cart[n].code+'\', \'\')"><i class="fa fa-minus-circle"></i></tag></td> <td style="text-align: center">'+bill.cart[n].qty+'</td> <td style="text-align: center"><i class="fa fa-inr"></i>'+bill.cart[n].price+'</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			
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
        	subOptions = '<div class="floaty" style="right: -10px; top: 5px">'+
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
                                    '<li class="floaty-list-item floaty-list-item--violet" id="triggerClick_PrintDuplicateBillButton" onclick="printDuplicateBillDisplayOptions(\''+encodedBill+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-print whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Print Duplicate Bill</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--palegreen" style="background: #688679" onclick="addItemToGeneratedBill(\''+bill.billNumber+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-plus whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Add Item</span>'+
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
            subOptions = '<div class="floaty" style="right: -10px; top: 5px">' +
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



        var isAlreadyRenderingFlag = document.getElementById("billDetailedDisplayRender").innerHTML != '' ? true : false;

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary '+(!isAlreadyRenderingFlag ? 'billDetailedDisplayHolder' : '')+'">'+
												'   <div class="box-body">'+ 
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.billNumber+'</tag><tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag></tag>'+(bill.orderDetails.modeType == 'DINE' ? '<tag class="billTypeSmallBox">Table <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? '<tag class="billTypeSmallBox">Token <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'DELIVERY' ? '<tag class="billTypeSmallBox viewAddressBox" onclick="viewDeliveryAddressFromBill(\''+encodeURI(bill.table)+'\')">View Address</b></tag>' : '')+'</h3>'+subOptions+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at <b style="color: #f39c12">'+getFancyTime(bill.timeBill)+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> KOT Number <tag style="color: #50aade; font-weight: bold;">'+bill.KOTNumber+'</tag>'+(bill.customerRating && bill.customerRating != "" ? ' <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> <tag class="ratingView" onclick="readCustomerComments('+bill.customerRating+', '+( bill.customerReview && bill.customerReview != '' ? '\''+bill.customerReview+'\'' : '\'\'' )+')">Rated '+getStarRating(bill)+'</tag>' : '')+'</time>'+
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
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Sub Total after Refund<tag style="display: block; color: #f59d13; font-size: 11px;">Refund of <i class="fa fa-inr"></i>'+bill.refundDetails.netAmount+' applied</tag></td> <td style="text-align: right"><i class="fa fa-inr"></i>'+(subTotal-bill.refundDetails.netAmount)+'</td> </tr>';
		
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
					deliveryAgentDetailsContent = '<div class="deliveryAddress" style="position: relative"> <p class="deliveryTitle">Delivery Details<tag class="billTypeSmallBox viewAddressBox" onclick="viewDeliveryAddressFromBill(\''+encodeURI(bill.table)+'\')" style="float: right; position: absolute; top: 4px; right: 4px; padding: 1px 3px; text-align: center; border-radius: 4px;"><i class="fa fa-home"></i></tag></p>'+( bill.deliveryDetails.name != '' ? '<p class="deliveryText"><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.deliveryDetails.name+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></p>' : '')+( bill.deliveryDetails.mobile != '' ? '<p class="deliveryText">Mob. <b><tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.deliveryDetails.mobile+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag></b></p>' : '')+' </div>';
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
        	subOptions = '<div class="floaty" style="right: -10px; top: 5px">'+
                                  '<div class="floaty-btn small" style="box-shadow: none;" id="triggerClick_PrintDuplicateBillButton" onclick="printDuplicateBillDisplayOptions(\''+encodedBill+'\')">'+
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
        	subOptions = '<div class="floaty" style="right: -10px; top: 5px">' +
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


        var isAlreadyRenderingFlag = document.getElementById("billDetailedDisplayRender").innerHTML != '' ? true : false;

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary '+(!isAlreadyRenderingFlag ? 'billDetailedDisplayHolder' : '')+'">'+
												'   <div class="box-body">'+
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+bill.billNumber+'</tag> <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag> </tag>'+paymentOptionUsedButton+'</h3>'+subOptions+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at <b style="color: #5dd2a1">'+getFancyTime(bill.timeBill)+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> KOT Number <tag style="color: #50aade; font-weight: bold;">'+bill.KOTNumber+'</tag>'+(bill.customerRating && bill.customerRating != "" ? ' <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> <tag class="ratingView" onclick="readCustomerComments('+bill.customerRating+', '+( bill.customerReview && bill.customerReview != '' ? '\''+bill.customerReview+'\'' : '\'\'' )+')">Rated '+getStarRating(bill)+'</tag>' : '')+'</time>'+
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


	//Get Star Rating
	function getStarRating(bill){

						    var starRating = '';
						    var commentsAdded = '';
					      	
					      	if(bill.customerReview && bill.customerReview != ''){
					      		commentsAdded = '<i class="fa fa-comments" style="color:#87ceeb; margin-left: 4px;"></i>';
					      	}

					      	if(bill.customerRating){
					      		for(var i = 1; i <= 5; i++){
					      			if(i <= bill.customerRating){ //Filled 
					      				starRating += '<i class="fa fa-star"></i>';
					      			}
					      			else{ //Empty
					      				starRating += '<i class="fa fa-star-o"></i>';
					      			}
					      		}

					      		if(bill.customerRating == 1){
					      			starRating = '<tag style="color: #ff3117; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 2 || bill.customerRating == 3){
					      			starRating = '<tag style="color: #ffc000; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 4){
					      			starRating = '<tag style="color: #a2da4f; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      		else if(bill.customerRating == 5){
					      			starRating = '<tag style="color: #31d040; font-size: 10px;">' + starRating + commentsAdded + '</tag>';
					      		}
					      	}

					      	return starRating;
	}

}


function printDuplicateBillDisplayOptions(encodedBill){

	var bill = JSON.parse(decodeURI(encodedBill));

	if(bill.orderDetails.modeType == 'DINE' || bill.orderDetails.modeType == 'PARCEL' || bill.orderDetails.modeType == 'TOKEN'){
		document.getElementById("duplicateBillOptionsRender").innerHTML = ''+
			'<div class="col-sm-4"> <tag onclick="printDuplicateBill(\''+encodedBill+'\', \'ORIGINAL\'); printDuplicateBillDisplayOptionsHide();" class="duplicatePrintOptionButton">Print Original</tag> </div>'+
			'<div class="col-sm-4"> <tag onclick="printDuplicateBillAskForAddress(\''+encodedBill+'\')" class="duplicatePrintOptionButton">With Address</tag> </div>'+ 
			'<div class="col-sm-4"> <tag onclick="printDuplicateBill(\''+encodedBill+'\'); printDuplicateBillDisplayOptionsHide();" class="duplicatePrintOptionButton">Print Duplicate</tag> </div>';
	}
	else if(bill.orderDetails.modeType == 'DELIVERY'){
		document.getElementById("duplicateBillOptionsRender").innerHTML = ''+
			'<div class="col-sm-4"> <tag onclick="printDuplicateBill(\''+encodedBill+'\', \'ORIGINAL\'); printDuplicateBillDisplayOptionsHide();" class="duplicatePrintOptionButton">Print Original</tag> </div>'+
			'<div class="col-sm-4"> <tag onclick="printDuplicateBill(\''+encodedBill+'\'); printDuplicateBillDisplayOptionsHide();" class="duplicatePrintOptionButton">Print Duplicate</tag> </div>';
	}


	document.getElementById("duplicateBillOptionsModal").style.display = 'block';

}

function printDuplicateBillDisplayOptionsHide(){
	document.getElementById("duplicateBillOptionsRender").innerHTML = '';
	document.getElementById("duplicateBillOptionsModal").style.display = 'none';
}

function resetDuplicateInvoiceAddress(){
	document.getElementById("duplicateInvoice_Address_name").value = '';
	document.getElementById("duplicateInvoice_Address_contact").value = '';
	document.getElementById("duplicateInvoice_Address_flatName").value = '';
	document.getElementById("duplicateInvoice_Address_flatNo").value = '';
	document.getElementById("duplicateInvoice_Address_area").value = '';
	document.getElementById("duplicateInvoice_Address_landmark").value = '';
	document.getElementById("duplicateInvoice_Address_remarks").value = '';
}


function printDuplicateBillAskForAddress(encodedBill){
	var bill = JSON.parse(decodeURI(encodedBill));

	document.getElementById("duplicateBillOptionsRender").innerHTML = ''+
					'<div class="row" id="addNewSavedWindow" style="padding: 0 30px 0 15px; display: block; display: block;">'+
                        '<h1 style="font-size: 18px; color: #1abc9c; text-align: left; padding-left: 15px; margin-top: 0;">Billing Address for Invoice #<b>'+bill.billNumber+'</b></h1>'+
                        '<div class="col-sm-12">'+
                           '<div class="form-group">'+
                              '<input type="text" value="'+bill.customerName+'" placeholder="Guest Name" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_name" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-sm-12">'+
                           '<div class="form-group">'+
                              '<input type="number" value="'+bill.customerMobile+'" placeholder="Mobile Number" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_contact" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-sm-6">'+
                           '<div class="form-group">'+
                              '<input type="text" value="" placeholder="Office/House No" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_flatNo" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-sm-6">'+
                           '<div class="form-group">'+
                              '<input type="text" value="" placeholder="Office/House Name" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_flatName" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-sm-6">'+
                           '<div class="form-group">'+
                              '<input type="text" value="" placeholder="Landmark" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_landmark" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-sm-6">'+
                           '<div class="form-group">'+
                              '<input type="text" value="" placeholder="Area" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_area" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<div class="col-sm-12">'+
                           '<div class="form-group">'+
                              '<input type="text" value="" placeholder="Custom Remarks" style="border: none; border-bottom: 1px solid" class="form-control tip" id="duplicateInvoice_Address_remarks" required="required">'+
                           '</div>'+
                        '</div>'+
                        '<button class="btn btn-default" onclick="resetDuplicateInvoiceAddress()" style="float: left; margin-left: 15px">Reset</button>'+
                        '<button class="btn btn-success" onclick="proceedDuplicateInvoiceWithAddress(\''+encodedBill+'\')" style="float: right; margin-right: 15px">Print with Address</button>'+
                     '</div>';
}


function proceedDuplicateInvoiceWithAddress(encodedBill){
	
	var bill = JSON.parse(decodeURI(encodedBill));

	var addressObject = {};

	addressObject.name = document.getElementById("duplicateInvoice_Address_name").value;
	addressObject.contact = document.getElementById("duplicateInvoice_Address_contact").value;
	addressObject.flatNo = document.getElementById("duplicateInvoice_Address_flatNo").value;
	addressObject.flatName = document.getElementById("duplicateInvoice_Address_flatName").value;
	addressObject.landmark = document.getElementById("duplicateInvoice_Address_landmark").value;
	addressObject.area = document.getElementById("duplicateInvoice_Address_area").value;
	addressObject.remarks = document.getElementById("duplicateInvoice_Address_remarks").value;

	//quick validation
	if(addressObject.name == '' && addressObject.contact == '' && addressObject.flatNo == '' && addressObject.flatName == '' && addressObject.landmark == '' && addressObject.area == '' && addressObject.remarks == ''){
		showToast('Warning: All fields in Billing Address is empty', '#e67e22');
		return '';
	}

   	sendToPrinter(bill, 'DUPLICATE_ORIGINAL_BILL', '', addressObject);
    showToast('Duplicate Bill #'+bill.billNumber+' generated Successfully', '#27ae60');
	printDuplicateBillDisplayOptionsHide();
}



function readCustomerComments(rating, comments){

	if(!comments || comments == undefined || comments == ''){

		return '';
	}


								var starRating = '';

						      	for(var i = 1; i <= 5; i++){
					      			if(i <= rating){ //Filled 
					      				starRating += '<i class="fa fa-star"></i>';
					      			}
					      			else{ //Empty
					      				starRating += '<i class="fa fa-star-o"></i>';
					      			}
					      		}

					      		if(rating == 1){
					      			starRating = '<tag style="color: #ff3117; font-size: 24px; position: relative; top: 2px; margin-left: 4px; letter-spacing: 1px;">' + starRating + '</tag>';
					      		}
					      		else if(rating == 2 || rating == 3){
					      			starRating = '<tag style="color: #ffc000; font-size: 24px; position: relative; top: 2px; margin-left: 4px; letter-spacing: 1px;">' + starRating + '</tag>';
					      		}
					      		else if(rating == 4){
					      			starRating = '<tag style="color: #a2da4f; font-size: 24px; position: relative; top: 2px; margin-left: 4px; letter-spacing: 1px;">' + starRating + '</tag>';
					      		}
					      		else if(rating == 5){
					      			starRating = '<tag style="color: #31d040; font-size: 24px; position: relative; top: 2px; margin-left: 4px; letter-spacing: 1px;">' + starRating + '</tag>';
					      		}


	if(comments != ''){
		document.getElementById("customerReviewViewModal").style.display = 'block';
		document.getElementById("customerReviewViewModalContent").innerHTML = '<p style="font-size: 21px; font-weight: 300; color: #616161;">Customer rated this order '+starRating+'</p><p style="font-family: \'Oswald\'; font-size: 21px; font-style: italic; color: #4aa9d0;"><b style="color: #616161; font-weight: 300;">Says</b> "'+comments+'"</p>';
	}
}

function customerReviewViewModalHide(){
	document.getElementById("customerReviewViewModalContent").innerHTML = '';
	document.getElementById("customerReviewViewModal").style.display = 'none';	
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
	            showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
	            showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
	            showToast('Not Found Error: Dine Sessions data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Dine Sessions data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Dine Sessions data.', '#e74c3c');
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
	            showToast('Not Found Error: Registered Machines data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Registered Machines data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Registered Machines data.', '#e74c3c');
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
	            showToast('Not Found Error: Staff data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Staff data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Staff data.', '#e74c3c');
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

                 
                if($('#deliveryBoysModal').is(':visible')) {

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
            showToast('Not Found Error: Registered Users data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Registered Users data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Registered Users data.', '#e74c3c');
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

                      var isAutoSMSFeatureEnabled = window.localStorage.systemOptionsSettings_DeliverySMSNotification && window.localStorage.systemOptionsSettings_DeliverySMSNotification == 'true' ? true : false;

                      if(isAutoSMSFeatureEnabled){
                      	sendOrderDispatchSMS(bill);
                      }

                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Invoice.', '#e74c3c');
                  }
                }); 
          
        }
        else{
          showToast('Not Found Error: Invoice #'+billNumber+' not found on Server.', '#e74c3c');
        }
        
      },
      error: function(firstdata) {
        showToast('System Error: Unable to read Invoices data.', '#e74c3c');
      }

    });  
}


function sendOrderDispatchSMS(bill){

	var address = JSON.parse(bill.table);

	if(!(address.contact).match(/^\d{10}$/)){
		return '';
	}
	

          var admin_data = {
            "token": window.localStorage.loggedInAdmin,
            "customerName": address.name,
            "customerMobile": address.contact,
            "totalBillAmount": bill.payableAmount,
            "accelerateLicence": window.localStorage.accelerate_licence_number,
            "accelerateClient": window.localStorage.accelerate_licence_client_name,
            "agentName": bill.deliveryDetails.name,
            "agentMobile": bill.deliveryDetails.mobile
          }


          showLoading(10000, 'Sending SMS to Customer');

          $.ajax({
            type: 'POST',
            url: 'https://www.accelerateengine.app/apis/posdeliverydispatchsms.php',
            data: JSON.stringify(admin_data),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
              hideLoading();
              if(data.status){

              }
              else{
              	showToast('Failed to send SMS: '+data.error, '#e74c3c');
              }

            },
            error: function(data){
              hideLoading();
              showToast('Failed to send SMS: Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
            }
          });  
}



//Print Duplicate Bill
function printDuplicateBill(encodedBill, optionalFlag){
	
	var bill = JSON.parse(decodeURI(encodedBill));

	if(optionalFlag == 'ORIGINAL'){
		sendToPrinter(bill, 'DUPLICATE_ORIGINAL_BILL');
	}
	else{
   		sendToPrinter(bill, 'DUPLICATE_BILL');
   	}

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
            showToast('Not Found Error: Discount Types data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Discount Types data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Discount Types data.', '#e74c3c');
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
				          var grandPackagedSum = 0;

				          var n = 0;
				          while(billfile.cart[n]){
				            grandSum += billfile.cart[n].price * billfile.cart[n].qty;

				            if(billfile.cart[n].isPackaged){
				              grandPackagedSum += billfile.cart[n].price * billfile.cart[n].qty;
				            }

				            n++;
				          }

				          grandPayableBill += grandSum;


				          var totalDiscount = 0;
				          var TotalUserDiscount = value;
				      
				          if(unit == 'PERCENTAGE'){
				            totalDiscount = (grandSum) * (TotalUserDiscount/100);
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

				                if(totalDiscount > grandSum){
				                  totalDiscount = grandSum;
				                  maximumReached = true;
				                }

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

				            var calculable_sum_for_all = grandSum - totalDiscount;
				            var calculable_sum_for_packaged = (grandSum - grandPackagedSum) - totalDiscount;

				            if(calculable_sum_for_all < 0){
				              calculable_sum_for_all = 0;
				            }

				            if(calculable_sum_for_packaged < 0){
				              calculable_sum_for_packaged = 0;
				            }


				            for(var g = 0; g < billfile.extras.length; g++){
				              
				              if(billfile.extras[g].unit == 'PERCENTAGE'){
				              
				                if(billfile.extras[g].isPackagedExcluded){
				                  var new_amount = (billfile.extras[g].value / 100) * calculable_sum_for_packaged;
				                  new_amount = Math.round(new_amount * 100) / 100;
				                  billfile.extras[g].amount = new_amount;
				                }
				                else{
				                  var new_amount = (billfile.extras[g].value / 100) * calculable_sum_for_all;
				                  new_amount = Math.round(new_amount * 100) / 100;
				                  billfile.extras[g].amount = new_amount; 
				                }


				              }
				              else if(billfile.extras[g].unit == 'FIXED'){
				                //Do nothing
				              } 

				            }

				            /* custom extras */
				            if(billfile.customExtras.amount && billfile.customExtras.amount != 0){
				              if(billfile.customExtras.unit == 'PERCENTAGE'){

				                var new_amount = (billfile.customExtras.value / 100) * calculable_sum_for_all;
				                new_amount = Math.round(new_amount * 100) / 100;
				                billfile.customExtras.amount = new_amount;
				              }
				              else if(billfile.customExtras.unit == 'FIXED'){
				                //Do nothing
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
				                      showToast('System Error: Unable to update the Bill.', '#e74c3c');
				                  }
				                }); 
                        
                      }
                      else{
                        showToast('Server Warning: Unable to modify bill data.', '#e67e22');
                      }
                    },
                    error: function(data) {
                      showToast('Server Warning: Unable to modify bill data.', '#e67e22');
                    }

                  });
}



//Add item to generated bill
function addItemToGeneratedBill(billNumber){
	
	billNumber = parseInt(billNumber);

	window.localStorage.accelerate_edit_bill_items = '';
	document.getElementById("lateItemAddContinueButton").style.display = 'none';

	document.getElementById("lateAddItemToBill").style.display = 'block';
	$('#late_add_hidden_bill_number').val(billNumber);
	$('#lateAddItemToBillTitle').html('Adding new items to <b>Bill #'+billNumber+'</b>');

	$('#temporaryCartRenderArea').html('<p style="margin: 100px 0 0 0; font-size: 28px; font-weight: 300; color: #d2d6de; text-align: center;">Add any item from the Menu!</p>');

	initLateMenuSuggestion();
	initLateOrderPunch();
}

function addItemToGeneratedBillHide(){
	window.localStorage.accelerate_edit_bill_items = '';
	document.getElementById("lateAddItemToBill").style.display = 'none';
}


function initLateOrderPunch(){
		//Focus on to "Add item"
		$("#late_add_item_by_search").focus();

		/*Remove suggestions if focus out*/ /*TWEAK*/
		$("#late_add_item_by_search").focusout(function(){
			setTimeout(function(){ 
				$('#lateSearchResultsRenderArea').html('');
			}, 300);	 /*delay added for the focusout to understand if modal is opened*/
		});
}


/*Auto Suggetion - MENU*/
function initLateMenuSuggestion(){

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
				var li = $('#lateSearchResultsRenderArea li');
				var liSelected = undefined;

				$('#late_add_item_by_search').keyup(function(e) {

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
					    	$('#late_add_item_by_search').focus().val($('#late_add_item_by_search').val());


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

				        $("#lateSearchResultsRenderArea li").each(function(){
					        if($(this).hasClass("selected")){
					        	$(this).click();
					        }
					    });

				    }
				    else{

				    	liSelected = undefined

					    var searchField = $(this).val();
					    if (searchField === '') {
					        $('#lateSearchResultsRenderArea').html('');
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
						  			itemsList += '<li class="ui-menu-item" onclick="additemtoTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
					    	 	}
					    	 	else if(items.shortCode.search(name_regex) != -1){
					    	 		tabIndex = -1;
						  			itemsList += '<li class="ui-menu-item" onclick="additemtoTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
						            count++;
						            tabIndex++;
					    	 	}
					    	 	else{

					    	 			var item_name = items.name;

					    	 			if(item_name.search(name_regex) != -1){
					    	 				tabIndex = -1;
								  			itemsList += '<li class="ui-menu-item" onclick="additemtoTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 			else if(item_name.search(regex) != -1){

					    	 				tabIndex = -1;
								  			itemsAppendList += '<li class="ui-menu-item" onclick="additemtoTempCart(\''+encodeURI(JSON.stringify(items))+'\', \'ATTACHED_WITHIN\', \'SUGGESTION\')" tabindex="'+tabIndex+'">'+items.name+' (<i class="fa fa-inr"></i>'+items.price+')<span style="float: right; margin-left: 4px; color: #f39c12; letter-spacing: 0.05em">'+items.shortNumber+'</span>'+(items.isAvailable ? '' : '<span style="float: right; color: #dd3976"><i class="fa fa-times"></i></span>')+'</li>'
								            count++;
								            tabIndex++;
					    	 			}
					    	 	}
					    });


						//Render the list
						var isSomeItemsFound = false; 
					    if(itemsList != '' || itemsAppendList != ''){
					    	isSomeItemsFound = true;
					    	$('#lateSearchResultsRenderArea').html('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 320px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_itemSuggestions">'+itemsList+itemsAppendList+'</ul>');
					    }
					    else{
					    	
					    	var custom_template = 	'<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content" style="display: block; top: 0; left: 0; min-width: 320px; position: relative; max-height: 420px !important; overflow-y: auto; overflow-x: hidden" id="uiBeauty_itemSuggestions">'+
					    								'<span style="display: inline-block; padding: 8px 0 4px 8px; font-size: 12px; text-align: center; color: #c6c6c6; font-style: italic">No matching items found in the Menu.</span>'+ 
										    	   	'</ul>';
					    	
					    	$('#lateSearchResultsRenderArea').html(custom_template);
					    }

					    if(isSomeItemsFound){
					    	var track_index = 0;
					    	$("#lateSearchResultsRenderArea li").each(function(){

					    		if(track_index == 0){
					    			$(this).addClass("selected");
					    		}

					    		track_index++;
						    });
					    }

					    //Refresh dropdown list
					    li = $('#lateSearchResultsRenderArea li');
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



function additemtoTempCart(encodedItem, category, optionalSource){

	var productToAdd = JSON.parse(decodeURI(encodedItem));

	if(productToAdd.isCustom){

		//Pop up
		var i = 0;
		var optionList = '';
		while(productToAdd.customOptions[i]){
			optionList = optionList + '<li class="easySelectTool_customItem" onclick="addCustomToCartLate(\''+productToAdd.name+'\', \''+productToAdd.category+'\', \''+productToAdd.code+'\', \''+productToAdd.cookingTime+'\', \''+productToAdd.customOptions[i].customPrice+'\', \''+productToAdd.customOptions[i].customName+'\', \'SUGGESTION\', \''+(productToAdd.ingredients ? encodeURI(JSON.stringify(productToAdd.ingredients)) : '')+'\', \'\', \''+productToAdd.isPackaged+'\')">'+
										'<a>'+productToAdd.customOptions[i].customName+'<tag class="spotlightCustomItemTick"><i class="fa fa-check"></i></tag> <tag style="float: right"><i class="fa fa-inr"></i>'+productToAdd.customOptions[i].customPrice+'</tag></a>'+
									  '</li>';
			i++;
		}
		document.getElementById("customiseItemLateModal").style.display ='block';
		document.getElementById("customiseItemLateTitle").innerHTML = "Choice of <b>"+productToAdd.name+"</b>";
		document.getElementById("customOptionsLateList").innerHTML = '<ol class="rectangle-list">'+optionList+'</ol>';


          /*
            EasySelect Tool (LISTS)
          */
          var li = $('#customOptionsLateList .easySelectTool_customItem');
          var liSelected = li.eq(0).addClass('selectCustomItem');

          var easySelectTool = $(document).on('keydown',  function (e) {
             
            if($('#customOptionsLateList').is(':visible')) {

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
                    document.getElementById("customiseItemLateModal").style.display ='none';
                    easySelectTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)

                    $("#customOptionsLateList .easySelectTool_customItem").each(function(){
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
		
		saveToCartLate(productToAdd, optionalSource)

		$('#late_add_item_by_search').val('');
		$('#lateSearchResultsRenderArea').html('');
	}	


	$("#late_add_item_by_search").focus();
}

function addCustomToCartLate(name, category, code, cookTime, price, variant, optionalSource, encodedIngredients, cart_index, packagedExclusionFlag){

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

		saveToCartLate(productToAdd);

		document.getElementById("customiseItemLateModal").style.display ='none';

		$('#late_add_item_by_search').val('');
		$('#lateSearchResultsRenderArea').html('');
}

function hideCustomiseItemLate(){
	document.getElementById("customiseItemLateModal").style.display ='none';
}



/*Add Item to Temp. Cart */
function saveToCartLate(productToAdd, optionalSource){
	var cart_products = window.localStorage.accelerate_edit_bill_items && window.localStorage.accelerate_edit_bill_items != '' ? JSON.parse(window.localStorage.accelerate_edit_bill_items) : [];
    cart_products.push({"name": productToAdd.name, "category": productToAdd.category, "price": productToAdd.price, "isCustom": productToAdd.isCustom, "isPackaged": productToAdd.isPackaged, "variant": productToAdd.variant, "code": productToAdd.code, "qty": 1, "cookingTime" : productToAdd.cookingTime ? parseInt(productToAdd.cookingTime) : 0});
      
    window.localStorage.accelerate_edit_bill_items = JSON.stringify(cart_products);

    renderTemporaryCartPreview(cart_products);
}

function deleteFromTemporaryCart(index){
	var cart_products = window.localStorage.accelerate_edit_bill_items && window.localStorage.accelerate_edit_bill_items != '' ? JSON.parse(window.localStorage.accelerate_edit_bill_items) : [];
    cart_products.splice(index, 1);

    window.localStorage.accelerate_edit_bill_items = JSON.stringify(cart_products);

    renderTemporaryCartPreview(cart_products);
}

function increaseItemTemporaryCart(index){
	var cart_products = window.localStorage.accelerate_edit_bill_items && window.localStorage.accelerate_edit_bill_items != '' ? JSON.parse(window.localStorage.accelerate_edit_bill_items) : [];
    cart_products[index].qty++;

    window.localStorage.accelerate_edit_bill_items = JSON.stringify(cart_products);
    renderTemporaryCartPreview(cart_products);
}

function reduceItemTemporaryCart(index){
	var cart_products = window.localStorage.accelerate_edit_bill_items && window.localStorage.accelerate_edit_bill_items != '' ? JSON.parse(window.localStorage.accelerate_edit_bill_items) : [];
    cart_products[index].qty--;

    if(cart_products[index].qty == 0){
    	cart_products.splice(index, 1);
    }

    window.localStorage.accelerate_edit_bill_items = JSON.stringify(cart_products);
    renderTemporaryCartPreview(cart_products);
}

function renderTemporaryCartPreview(cart_products){

	if(cart_products.length == 0){
		document.getElementById("temporaryCartRenderArea").innerHTML = '<p style="margin: 100px 0 0 0; font-size: 28px; font-weight: 300; color: #d2d6de; text-align: center;">Add any item from the Menu!</p>';
		document.getElementById("lateItemAddContinueButton").style.display = 'none';
		return '';
	}

	var itemsContent = '';
	var n = 0;
	while(cart_products[n]){
		itemsContent += ''+
				'<tr class="success">'+
		            '<td class="text-center" style="cursor: pointer" onclick="deleteFromTemporaryCart('+n+')"><i class="fa fa-trash-o"></i></td>'+
		            '<td>'+cart_products[n].name+(cart_products[n].isCustom ? ' ('+cart_products[n].variant+')' : '')+'</td>'+
		            '<td class="text-center"> <span class="text-center sprice"><i class="fa fa-inr"></i>'+cart_products[n].price+'</span></td>'+
		            '<td class="text-center">'+
		            	'<tag style="margin-right: 10px; color: #e26767; width: 15px; cursor: pointer;" onclick="reduceItemTemporaryCart('+n+')"><i class="fa fa-minus-circle"></i></tag>'+
		            	'x '+cart_products[n].qty+
		            	'<tag style="margin-left: 10px; color: #33a24f; width: 15px; cursor: pointer;" onclick="increaseItemTemporaryCart('+n+')"><i class="fa fa-plus-circle"></i></tag>'+
		            '</td>'+
		            '<td class="text-center"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+(cart_products[n].price * cart_products[n].qty)+'</span></td>'+
		        '</tr>';
		n++;
	}


	var renderContent = ''+
		'<div class="row">'+
			'<div class="col-sm-12">'+
			   '<h1 style="text-align: center; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: 400; color: #444">New Items Preview</h1>'+
			   '<table class="table table-striped table-condensed table-hover list-table" style="margin:0px; z-index: 2;">'+
			      '<colgroup> <col width="10%"> <col width="40%"> <col width="15%"> <col width="20%"> <col width="15%"> </colgroup>'+
			      '<thead id="cartTitleHead"> <tr class="success cartTitleRow"> <th class="satu cartTitleRow"></th> <th class="cartTitleRow">Item</th> <th class="cartTitleRow">Price</th> <th class="cartTitleRow">Qty</th> <th class="cartTitleRow">Subtotal</th> </tr> </thead>'+
			   '</table>'+
			   '<table class="table table-striped table-condensed table-hover list-table" style="margin:0px;">'+
			      '<colgroup> <col width="10%"> <col width="40%"> <col width="15%"> <col width="20%"> <col width="15%"> </colgroup>'+
			      '<tbody>' + itemsContent + '</tbody>' +
			   '</table>'+
			'</div>'+
		'</div>';

	document.getElementById("temporaryCartRenderArea").innerHTML = renderContent;
	document.getElementById("lateItemAddContinueButton").style.display = 'block';
}


function processLateAddedItems(){
	
	var new_cart = window.localStorage.accelerate_edit_bill_items && window.localStorage.accelerate_edit_bill_items != '' ? JSON.parse(window.localStorage.accelerate_edit_bill_items) : [];

	var billNumber = $('#late_add_hidden_bill_number').val();
	
	if(billNumber == '' || new_cart.length == 0){
		showToast('Error: Something went wrong.', '#e74c3c');
		return '';
	}

	//Open the bill
	billNumber = parseInt(billNumber);

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
          var bill_cart = billfile.cart;

          var extended_cart = [];

          var maxCartIndex = 0;
          
          var n = 0;
          while(bill_cart[n]){
          	if(bill_cart[n].cartIndex >= maxCartIndex){
          		maxCartIndex = bill_cart[n].cartIndex;
          	}
          	n++;
          }

          //process new items
          for(var i = 0; i < new_cart.length; i++){

          	var isItemAlreadyExists = false;
          	
          	//check if this same item already exists in the bill
          	var m = 0;
          	while(bill_cart[m]){
          		if(new_cart[i].isCustom){
          			if(bill_cart[m].code == new_cart[i].code && bill_cart[m].variant == new_cart[i].variant){
          				//same found
          				bill_cart[m].qty += new_cart[i].qty;
          				isItemAlreadyExists = true;
          				break;
          			}
          		}
          		else{
          			if(bill_cart[m].code == new_cart[i].code){
          				//same found
          				bill_cart[m].qty += new_cart[i].qty;
          				isItemAlreadyExists = true;
          				break;
          			}
          		}
          		m++;
          	}

          	//item doesn't exists
          	if(!isItemAlreadyExists){
          		extended_cart.push(new_cart[i]);
          	}
          }

          //Updated bill cart 
          billfile.cart = bill_cart.concat(extended_cart);

          processNewFiguresAndSave();

          /* NEW FIGURES */
          function processNewFiguresAndSave(){

			/* RECALCULATE New Figures*/
			var subTotal = 0;
			var packagedSubTotal = 0;

			var n = 0;
			while(billfile.cart[n]){
				subTotal = subTotal + billfile.cart[n].qty * billfile.cart[n].price;

				if(billfile.cart[n].isPackaged){
					packagedSubTotal += billfile.cart[n].qty * billfile.cart[n].price;
				}

				n++;
			}

			var grandPayableBill = subTotal;

	        /*Calculate Discounts if Any*/ 
	        var net_discount = 0;    
	        if(billfile.discount){
	          		var tempExtraTotal = 0;
	          		if(billfile.discount.value != 0){
	          			if(billfile.discount.unit == 'PERCENTAGE'){
	          				tempExtraTotal = billfile.discount.value * subTotal/100;
	          			}
	          			else if(billfile.discount.unit == 'FIXED'){
	          				tempExtraTotal = billfile.discount.value;
	          			}
	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		billfile.discount.amount = tempExtraTotal;
	          		net_discount = tempExtraTotal;
	          		grandPayableBill -= tempExtraTotal;
	        }



			/*Calculate Taxes and Other Charges*/
	        var k = 0;
	        var effective_discountable_sum = subTotal - net_discount;
	        if(billfile.extras.length > 0){
	          	for(k = 0; k < billfile.extras.length; k++){

	          		var tempExtraTotal = 0;

	          		if(billfile.extras[k].isPackagedExcluded){
			          		if(billfile.extras[k].value != 0){
			          			if(billfile.extras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = (billfile.extras[k].value * (effective_discountable_sum - packagedSubTotal))/100;
			          			}
			          			else if(billfile.extras[k].unit == 'FIXED'){
			          				tempExtraTotal = billfile.extras[k].value;
			          			}
			          		}
			        }
			        else{
			          		if(billfile.extras[k].value != 0){
			          			if(billfile.extras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = billfile.extras[k].value * effective_discountable_sum/100;
			          			}
			          			else if(billfile.extras[k].unit == 'FIXED'){
			          				tempExtraTotal = billfile.extras[k].value;
			          			}
			          		}			        	
			        }


	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		billfile.extras[k] = {
				 		"name": billfile.extras[k].name,
						"value": billfile.extras[k].value,
						"unit": billfile.extras[k].unit,
						"amount": tempExtraTotal,
						"isPackagedExcluded": billfile.extras[k].isPackagedExcluded
	          		};

	          		grandPayableBill += tempExtraTotal;
	          	}
	        }


	        /*Calculate Custom Extras if Any*/     
	        if(billfile.customExtras){
	          		var tempExtraTotal = 0;
	          		if(billfile.customExtras.value != 0){
	          			if(billfile.customExtras.unit == 'PERCENTAGE'){
	          				tempExtraTotal = billfile.customExtras.value * effective_discountable_sum/100;
	          			}
	          			else if(billfile.customExtras.unit == 'FIXED'){
	          				tempExtraTotal = billfile.customExtras.value;
	          			}
	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		billfile.customExtras.amount = tempExtraTotal;

	          		grandPayableBill += tempExtraTotal;
	        }


          grandPayableBill = parseFloat(grandPayableBill).toFixed(2);   
          var grandPayableBillRounded = properRoundOff(grandPayableBill);   

          billfile.payableAmount = grandPayableBillRounded;
          billfile.grossCartAmount = subTotal;
          billfile.grossPackagedAmount = packagedSubTotal;

          billfile.calculatedRoundOff = Math.round((grandPayableBillRounded - grandPayableBill) * 100) / 100;






          		var encodedBill = encodeURI(JSON.stringify(billfile));

                //Update Bill on Server
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/'+(billfile._id)+'/',
                  data: JSON.stringify(billfile),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('New items successfully to the Bill #'+billNumber, '#27ae60');
                      addItemToGeneratedBillHide();
                      
                      loadAllPendingSettlementBills();
				      openSelectedBill(encodedBill, 'PENDING');
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Bill #'+billNumber, '#e74c3c');
                  }
                }); 

          }//processNewFiguresAndSave


        }
        else{
          showToast('Not Found Error: Bill #'+billNumber+' not found on Server.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('Not Found Error: Bill #'+billNumber+' not found on Server.', '#e74c3c');
      }

    });  
}


function deleteItemFromBill(billNumber, itemCode, itemVariant){

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
	  	showToast('No Permission: Only an Admin can <b>edit the items</b>.', '#e67e22');
	  	return '';
	  }


  	$.ajax({
	    type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/'+billNumber,
		timeout: 10000,
		success: function(data) {

			if(data.cart.length == 1){
				showToast('Error: Only item in the bill. This item can not be cancelled.', '#e74c3c');
				return '';
			}

			var m = 0;
			while(data.cart[m]){
				if(data.cart[m].code == itemCode){
					data.cart.splice(m,1);
					deleteItemFromBillAfterProcess(data, data._rev);
					break;
				}
				m++;
			}

		},
      	error: function(data) {
        	showToast('Not Found Error: Invoice data not found.', '#e74c3c');
      	}
	});  

}



function deleteItemFromBillAfterProcess(billfile, revID){

			/* RECALCULATE New Figures*/
			var subTotal = 0;
			var packagedSubTotal = 0;

			var n = 0;
			while(billfile.cart[n]){
				subTotal = subTotal + billfile.cart[n].qty * billfile.cart[n].price;

				if(billfile.cart[n].isPackaged){
					packagedSubTotal += billfile.cart[n].qty * billfile.cart[n].price;
				}

				n++;
			}

			var grandPayableBill = subTotal;

	        /*Calculate Discounts if Any*/ 
	        var net_discount = 0;    
	        if(billfile.discount){
	          		var tempExtraTotal = 0;
	          		if(billfile.discount.value != 0){
	          			if(billfile.discount.unit == 'PERCENTAGE'){
	          				tempExtraTotal = billfile.discount.value * subTotal/100;
	          			}
	          			else if(billfile.discount.unit == 'FIXED'){
	          				tempExtraTotal = billfile.discount.value;
	          			}
	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		billfile.discount.amount = tempExtraTotal;
	          		net_discount = tempExtraTotal;
	          		grandPayableBill -= tempExtraTotal;
	        }



			/*Calculate Taxes and Other Charges*/
	        var k = 0;
	        var effective_discountable_sum = subTotal - net_discount;
	        if(billfile.extras.length > 0){
	          	for(k = 0; k < billfile.extras.length; k++){

	          		var tempExtraTotal = 0;

	          		if(billfile.extras[k].isPackagedExcluded){
			          		if(billfile.extras[k].value != 0){
			          			if(billfile.extras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = (billfile.extras[k].value * (effective_discountable_sum - packagedSubTotal))/100;
			          			}
			          			else if(billfile.extras[k].unit == 'FIXED'){
			          				tempExtraTotal = billfile.extras[k].value;
			          			}
			          		}
			        }
			        else{
			          		if(billfile.extras[k].value != 0){
			          			if(billfile.extras[k].unit == 'PERCENTAGE'){
			          				tempExtraTotal = billfile.extras[k].value * effective_discountable_sum/100;
			          			}
			          			else if(billfile.extras[k].unit == 'FIXED'){
			          				tempExtraTotal = billfile.extras[k].value;
			          			}
			          		}			        	
			        }


	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		billfile.extras[k] = {
				 		"name": billfile.extras[k].name,
						"value": billfile.extras[k].value,
						"unit": billfile.extras[k].unit,
						"amount": tempExtraTotal,
						"isPackagedExcluded": billfile.extras[k].isPackagedExcluded
	          		};

	          		grandPayableBill += tempExtraTotal;
	          	}
	        }


	        /*Calculate Custom Extras if Any*/     
	        if(billfile.customExtras){
	          		var tempExtraTotal = 0;
	          		if(billfile.customExtras.value != 0){
	          			if(billfile.customExtras.unit == 'PERCENTAGE'){
	          				tempExtraTotal = billfile.customExtras.value * effective_discountable_sum/100;
	          			}
	          			else if(billfile.customExtras.unit == 'FIXED'){
	          				tempExtraTotal = billfile.customExtras.value;
	          			}
	          		}

	          		tempExtraTotal = Math.round(tempExtraTotal * 100) / 100;

	          		billfile.customExtras.amount = tempExtraTotal;

	          		grandPayableBill += tempExtraTotal;
	        }


          grandPayableBill = parseFloat(grandPayableBill).toFixed(2);   
          var grandPayableBillRounded = properRoundOff(grandPayableBill);   

          billfile.payableAmount = grandPayableBillRounded;
          billfile.grossCartAmount = subTotal;
          billfile.grossPackagedAmount = packagedSubTotal;

          billfile.calculatedRoundOff = Math.round((grandPayableBillRounded - grandPayableBill) * 100) / 100;


      		var encodedBill = encodeURI(JSON.stringify(billfile));

            //Update Bill on Server
            $.ajax({
              type: 'PUT',
              url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/'+(billfile._id)+'/',
              data: JSON.stringify(billfile),
              contentType: "application/json",
              dataType: 'json',
              timeout: 10000,
              success: function(data) {
                  showToast('Saved Changes', '#27ae60');
                  addItemToGeneratedBillHide();
                  
                  loadAllPendingSettlementBills();
			      openSelectedBill(encodedBill, 'PENDING');
              },
              error: function(data) {
                  showToast('System Error: Unable to update the Bill', '#e74c3c');
              }
            }); 
	
}


function lateApplyDiscountValueFocus(){
	$('#applyBillDiscountLate_value').focus();
  	$('#applyBillDiscountLate_value').select();	
}

