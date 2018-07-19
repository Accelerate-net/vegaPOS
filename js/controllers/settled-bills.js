
var currentPage = 1;
var totalPages = 1;
var displayType = 'PENDING';
var filterResultsCount = 0;

function loadAllPendingSettlementBills(optionalSource){

	console.log('*** Rendering Page: '+currentPage+" (of "+totalPages+")")


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

	if(currentPage == 1){
		if(isFilterApplied){
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearAppliedFilter(\'PENDING\')"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterResultsCounter"></count></button>';
		}
		else{
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModal(\'PENDING\')">Apply Filter</button>';
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbymobile?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbystewardname?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbymachine?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbysession?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbydiscount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbydiscount?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';

					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbytable?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }

				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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

							    var requestData = { "selector" :{ "billNumber": filter_key } }

							    $.ajax({
							      type: 'POST',
							      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_find',
							      data: JSON.stringify(requestData),
							      contentType: "application/json",
							      dataType: 'json',
							      timeout: 10000,
							      success: function(data) {
							        if(data.docs.length > 0){

							          totalPages = 1;
							          var bill = data.docs[0];

								      var resultRender = '';
									  resultRender 				+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
										                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
										                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
										                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
										                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
										                            '        <td>'+bill.stewardName+'</td>'+
										                            '    </tr>';


										document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
											'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
											'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
								      
								      	renderBillPageDefault('PENDING');
							        }
							        else{
							        	totalPages = 0;
							        	filterResultsCount = 0;
									    document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
										renderBillPageDefault('PENDING');
										return '';
									    
							        }

							      },
							      error: function(data) {
							        showToast('System Error: Unable to fetch data from the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
								  	totalPages = 0;
								  	filterResultsCount = 0;
									document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbybillingmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
						url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							totalPages = Math.ceil(data.rows.length/10);
							filterResultsCount = data.rows.length;
							document.getElementById("filterResultsCounter").innerHTML = ' ('+filterResultsCount+')';
							
					    	if(totalPages == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
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
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-filters/_view/filterbypaymentmode?startkey=["'+filter_key+'", "'+filter_start+'"]&endkey=["'+filter_key+'", "'+filter_end+'"]&descending=false&include_docs=true&limit=10&skip='+((currentPage-1)*10),
					timeout: 10000,
					success: function(data) {

				      var resultsList = data.rows;
				      var resultRender = '';

					  if(resultsList.length == 0){
					  	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">No matching results found. Modify the filter and try again.</p>';
						document.getElementById("filterResultsCounter").innerHTML = '';
						filterResultsCount = 0;
						renderBillPageDefault('PENDING');
						return '';
					  }


				      var n = 0;
				      while(resultsList[n]){
				      	var bill = resultsList[n].value;
						resultRender 			+=  '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
						                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
						                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
						                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
						                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
						                            '        <td>'+bill.stewardName+'</td>'+
						                            '    </tr>';
				      	n++;
				      }


						document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
							'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
				      
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
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_design/bills/_view/all?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {

		      if(data.total_rows == 0){
		      	document.getElementById("pendingBillsCount").innerHTML = 0;
		      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">There are no Unsettled Bills.</p>';
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
				                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '' + bill.orderDetails.modeType == 'DELIVERY' ? 'Delivery' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
				                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
				                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
				                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
				                            '        <td>'+bill.stewardName+'</td>'+
				                            '    </tr>';
		      	n++;
		      }


				document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
					'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
					'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';
		      
		      	renderBillPageDefault('PENDING')

		    },
		    error: function(data){
		    	showToast('Local Server not responding. Please try again.', '#e74c3c');
		    }

		  });  		
	}


}

function updatePendingCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_design/bills/_view/all?descending=true&include_docs=false&limit=10',
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

function calculateSettledCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoices/_view/all',
		    contentType: "application/json",
		    dataType: 'json',
		    timeout: 10000,
		    success: function(data) {
		    	
		      if(data.total_rows == 0){
		      	document.getElementById("settledBillsCount").innerHTML = 0;
		      }
		      else{
				document.getElementById("settledBillsCount").innerHTML = data.total_rows;
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
	}
	else{
		return 'Paid';
	}
}


function loadAllSettledBills(){

	$("#billSelection_settled").addClass("billTypeSelectionBox");
	$("#billSelection_pending").removeClass("billTypeSelectionBox");
	document.getElementById("billDetailedDisplayRender").innerHTML = ''


	//reset pagination counter
	if(displayType != 'SETTLED'){
		totalPages = 0;
		currentPage = 1;
		displayType = 'SETTLED';
		renderBillPageDefault();
	}

		//Preload payment modes
		if(!window.localStorage.availablePaymentModes || window.localStorage.availablePaymentModes == '')
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


	document.getElementById("billTypeTitle").innerHTML = 'Settled Bills';
	document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="openFilterModal(\'SETTLED\')">Filter</button>';

	  $.ajax({
	    type: 'GET',
	    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoices/_view/all?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
	    contentType: "application/json",
	    dataType: 'json',
	    timeout: 10000,
	    success: function(data) {

	      if(data.total_rows == 0){
	      	document.getElementById("settledBillsCount").innerHTML = 0;
	      	document.getElementById("billBriefDisplayRender").innerHTML = '<p style="color: #bdc3c7; margin: 10px 0 0 0;">There are no Settled Bills.</p>';
			return '';
	      }

	      document.getElementById("settledBillsCount").innerHTML = data.total_rows;

	      totalPages = Math.ceil(data.total_rows/10);
	      
	      var resultsList = data.rows;

	      var resultRender = '';
	      var n = 0;
	      while(resultsList[n]){
	   
	      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(resultsList[n].doc))+'\', \'SETTLED\')">'+
                            '        <td>#'+resultsList[n].doc.billNumber+'</td>'+
                            '        <td>'+getFancyTime(resultsList[n].doc.timeBill)+'<br><tag style="font-size: 85%">'+resultsList[n].doc.date+'</tag></td>'+
                            '        <td>'+resultsList[n].doc.orderDetails.mode+'<br>'+( resultsList[n].doc.orderDetails.modeType == 'DINE' ? 'Table #'+resultsList[n].doc.table : '' + resultsList[n].doc.orderDetails.modeType == 'TOKEN' ? 'Token #'+resultsList[n].doc.table : '')+'</td>'+
                            '        <td>'+(resultsList[n].doc.customerName != '' ? resultsList[n].doc.customerName+'<br>' : '')+resultsList[n].doc.customerMobile+'</td>'+
                            '        <td><i class="fa fa-inr"></i>'+resultsList[n].doc.totalAmountPaid+'</td>'+
                            '        <td>'+getPaymentCodeEquivalentName(resultsList[n].doc.paymentMode)+'</td>'+
                            '    </tr>';
	      	n++;
	      }


			document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
				      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
				      						'<th style="text-align: left">Amount</th> <th style="text-align: left">Mode</th> </tr></thead><tbody>'+resultRender+'<tbody>';
	      
	      	renderBillPageDefault('SETTLED')

	    },
	    error: function(data){
	    	showToast('Local Server not responding. Please try again.', '#e74c3c');
	    }

	  });  
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
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;"><b>'+address.name+'</b></p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+address.flatNo+(address.flatName && address.flatName != '' ? ', '+address.flatName : '')+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+address.landmark+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0 0 5px 0;">'+address.area+'</p>'+
		'<p style="font-size: 16px; padding-left: 10px; margin: 0;">'+(address.contact && address.contact != '' ? 'Mob. '+address.contact : '')+'</p>';
}

function viewDeliveryAddressFromBillHide() {
	document.getElementById("addressViewFromBillModal").style.display = 'none';
}

function openSelectedBill(encodedBill, type){

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
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.extras[m].name+' ('+(bill.extras[m].unit == 'PERCENTAGE' ? bill.extras[m].value+'%' : 'Rs. '+bill.extras[m].value)+')</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+bill.extras[m].amount+'</td> </tr>';
				charges_extra += bill.extras[m].amount;
				m++;
			}
		}

		if(!jQuery.isEmptyObject(bill.customExtras)){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">'+bill.customExtras.type+' ('+(bill.customExtras.unit == 'PERCENTAGE' ? bill.customExtras.value+'%' : 'Rs. '+bill.customExtras.value)+')</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+bill.customExtras.amount+'</td> </tr>';
			charges_extra += bill.customExtras.amount;
		}

		if(!jQuery.isEmptyObject(bill.discount)){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Discounts</td> <td style="text-align: right">'+(bill.discount.amount && bill.discount.amount != 0 ? '<tag style="color: red">- <i class="fa fa-inr"></i>'+bill.discount.amount+'</tag>' : '0')+'</td> </tr>';
			charges_extra = charges_extra - bill.discount.amount;
		}

		grandSumCalculated = subTotal + charges_extra;

		otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Grand Total</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+grandSumCalculated+'</td> </tr>';
		
		if(bill.calculatedRoundOff != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Calculated Round Off</td> <td style="text-align: right">'+(bill.calculatedRoundOff > 0 ? '<tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>' : '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>')+'</td> </tr>';
		}

		otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Payable Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+bill.payableAmount+'</td> </tr>';

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+ 
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#'+bill.billNumber+(bill.orderDetails.modeType == 'DINE' ? '<tag class="billTypeSmallBox">Table <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? '<tag class="billTypeSmallBox">Token <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'DELIVERY' ? '<tag class="billTypeSmallBox viewAddressBox" onclick="viewDeliveryAddressFromBill(\''+encodeURI(bill.table)+'\')">View Address</b></tag>' : '')+'</h3><button class="btn btn-success" style="float: right; color: #FFF" onclick="settleBillAndPush(\''+encodedBill+'\', \'GENERATED_BILLS\')">Settle Bill</button>'+
												      '</div>'+
												      '<time class="billSettleDate">'+(getSuperFancyDate(bill.date))+' at '+getFancyTime(bill.timeBill)+'</time>'+
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
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+((bill.customerName == '' && bill.customerMobile == '') ? '<p class="deliveryText" style="color: #ff8787">Not Available</p>' : '')+( bill.customerName != '' ? '<p class="deliveryText">'+bill.customerName+'</p>' : '')+( bill.customerMobile != '' ? '<p class="deliveryText">Mob. <b>'+bill.customerMobile+'</b></p>' : '')+' </div> </div>'+
												            '<div class="col-xs-2"></div>'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p>'+( bill.stewardName != '' ? '<p class="deliveryText">'+bill.stewardName+'</p>' : '')+( bill.stewardCode != '' ? '<p class="deliveryText">Mob. <b>'+bill.stewardCode+'</b></p>' : '')+' </div> </div>'+
												         '</div>'+
												      '</div>'+
												      '<div class="clearfix"></div>'+
												'   </div>'+
												'</div>';


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
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Discounts</td> <td style="text-align: right">'+(bill.discount.amount && bill.discount.amount != 0 ? '<tag style="color: red">- <i class="fa fa-inr"></i>'+bill.discount.amount+'</tag>' : '0')+'</td> </tr>';
			charges_extra = charges_extra - bill.discount.amount;
		}

		grandSumCalculated = subTotal + charges_extra;
		otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Grand Total</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+grandSumCalculated+'</td> </tr>';

		if(bill.calculatedRoundOff != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Calculated Round Off</td> <td style="text-align: right">'+(bill.calculatedRoundOff > 0 ? '<tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>' : '<tag style="color: #f15959">- <i class="fa fa-inr"></i>'+Math.abs(bill.calculatedRoundOff)+'</tag>')+'</td> </tr>';
		}

		otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Total Payable Amount</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+bill.payableAmount+'</td> </tr>';
		

		
		//check if any tips/round off added
		if(bill.tipsAmount && bill.tipsAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Tips</td>  <td style="text-align: right"><tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+bill.tipsAmount+'</tag></td> </tr>';
		}

		if(bill.roundOffAmount && bill.roundOffAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Waived Round Off</td>  <td style="text-align: right"><tag style="color: #f15959">- <i class="fa fa-inr"></i>'+bill.roundOffAmount+'</tag></td> </tr>';
		}

		otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Paid Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+bill.totalAmountPaid+'</td> </tr>';



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

			paymentOptionUsedButton =  	'<div class="splitPayListDropdown">'+
										 	'<div class="splitPayListButton">'+getPaymentCodeEquivalentName(bill.paymentMode)+'</div>'+
											'<div class="splitPayListDropdown-content"><div class="holdContentArea">'+paymentSplitList+'</div>'+
										 	'</div>'+
										'</div>';	
		}


		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#'+bill.billNumber+paymentOptionUsedButton+'</h3><button class="btn btn-default" style="float: right">Print Duplicate</button>'+
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
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p>'+((bill.customerName == '' && bill.customerMobile == '') ? '<p class="deliveryText" style="color: #ff8787">Not Available</p>' : '')+( bill.customerName != '' ? '<p class="deliveryText">'+bill.customerName+'</p>' : '')+( bill.customerMobile != '' ? '<p class="deliveryText">Mob. <b>'+bill.customerMobile+'</b></p>' : '')+' </div> </div>'+
												            '<div class="col-xs-2"></div>'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p>'+( bill.stewardName != '' ? '<p class="deliveryText">'+bill.stewardName+'</p>' : '')+( bill.stewardCode != '' ? '<p class="deliveryText">Mob. <b>'+bill.stewardCode+'</b></p>' : '')+' </div> </div>'+
												         '</div>'+
												      '</div>'+
												      '<div class="clearfix"></div>'+
												'   </div>'+
												'</div>';


	}
	else{
		return '';
	}	
}




/* SEARCH AND FILTER */

function openFilterModal(optionalRoute){

	document.getElementById("searchFilterModal").style.display = 'block';

	if(optionalRoute == 'PENDING'){
		document.getElementById("actionButtonSearch").innerHTML = '<button type="button" class="btn btn-success" onclick="filterSearchInitialize(\'PENDING\')" style="float: right">Proceed</button>';
	}
	else if(optionalRoute == 'SETTLED'){
		document.getElementById("actionButtonSearch").innerHTML = '<button type="button" class="btn btn-success" onclick="filterSearchInitialize(\'SETTLED\')" style="float: right">Proceed</button>';
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
	                modesTag = modesTag + '<option value="'+modes[i].type+'">'+modes[i].name+'</option>';
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
	                    "identifierTag": "ZAITOON_REGISTERED_MACHINES" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_REGISTERED_MACHINES'){

	              var modes = data.docs[0].value;
	              modes.sort(); //alphabetical sorting 
	              var modesTag = '';


	              for (var i=0; i<modes.length; i++){
	                modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
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

	else if(criteria == 'discount'){
	    document.getElementById("filterSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="discounted">Discounted</option><option value="nondiscounted">Non Discounted</option></select>Orders</p>';
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

	if(searchMode == 'payment' || searchMode == 'type' || searchMode == 'steward' || searchMode == 'session' || searchMode == 'machine' || searchMode == 'discount'){
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

	window.localStorage.billFilterCriteria = JSON.stringify(searchObj);

	document.getElementById("billBriefDisplayRender").innerHTML = '';

	if(optionalRoute == 'SETTLED'){
		loadAllSettledBills();
	}
	else{
		loadAllPendingSettlementBills('EXTERNAL');
	}

	hideFilterModal();
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
