
var currentExpensePage = 1;
var totalExpensePages = 1;
var filterExpenseResultsCount = 0;

function loadAllAddedExpenses(optionalSource, optionalAnimationFlag){

	console.log('*** Rendering Page: '+currentExpensePage+" (of "+totalExpensePages+")")

	if(optionalAnimationFlag && optionalAnimationFlag == 'LOADING_ANIMATION'){
		//Show Animation
		document.getElementById("expenseBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';
	}
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
	var filterObject = '';
		  
	var filter_start = '';
	var filter_end = '';

	if(window.localStorage.expenseFilterCriteria && window.localStorage.expenseFilterCriteria != ''){
		isFilterApplied = true;
		filterObject = JSON.parse(window.localStorage.expenseFilterCriteria);
		currentExpensePage = 1;

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
	}


	if(currentExpensePage == 1){
		if(isFilterApplied){
			document.getElementById("expenseTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearFilterModalExpenses()"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterExpenseResultsCounter"></count></button>';
		}
		else{
			document.getElementById("expenseTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModalExpenses()">Apply Filter</button>';
		}
	}

	fetchExpensesFromCloudServer(currentExpensePage);	

	function fetchExpensesFromCloudServer(index){

		var data = {
			"token": window.localStorage.loggedInAdmin,
			"index": index, //1 (for first 10), 2 (for 10 to 20) etc...
			"filter": filterObject
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/posfetchexpensesmaster.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {

			  hideLoading();

			if(data.status){
		     
			  var expensesData = data.response;
			  var expensesDataTotal = data.totalCount;
			  var filterResultsCount = data.filterCount ? data.filterCount : 0;

		      if(expensesData.length == 0){
		      	document.getElementById("addedExpensesCount").innerHTML = 0;
		      	document.getElementById("expenseBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">There are no Expense Records found.</p>';
				return '';
		      }

		      document.getElementById("addedExpensesCount").innerHTML = expensesDataTotal;
		      totalExpensePages = Math.ceil(expensesDataTotal/10);
		      
			 
		      if(isFilterApplied){ //Filter applied case
		      	
		      	totalExpensePages = Math.ceil(filterResultsCount/10);

		      	document.getElementById("filterExpenseResultsCounter").innerHTML = ' ('+filterResultsCount+')';
		      
				if(totalExpensePages == 0){
					document.getElementById("expenseBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">No matching records found in Expenses. Modify the filter and try again.</p>';
					document.getElementById("filterExpenseResultsCounter").innerHTML = '';
					filterResultsCount = 0;
					renderExpensePageDefault();
					return '';
			    }
		      }

		      renderExpensePageDefault();

		     
		      var resultRender = '';
		      var n = 0;
		      while(expensesData[n]){

				resultRender +=  					'   <tr role="row" class="billsListSingle" onclick="openSelectedExpense(\''+encodeURI(JSON.stringify(expensesData[n]))+'\')">'+
													'        <td><b style="color: '+getTypeColor(expensesData[n].type)+'">#'+expensesData[n].uid+'</b></td>'+
													'        <td>'+expensesData[n].time+'<br><tag style="font-size: 85%">'+expensesData[n].date+'</tag></td>'+
						                            '        <td><tag style="font-size: 15px; font-weight: bold; color: '+getTypeColor(expensesData[n].type)+'">'+expensesData[n].type+'</tag>'+(expensesData[n].reference && expensesData[n].reference != "" ? '<tag style="display: block; font-size: 11px; color: #888;">'+expensesData[n].reference+'</tag>' : '')+'</td>'+
						                            '        <td>'+expensesData[n].issuedTo+(expensesData[n].issuedToType && expensesData[n].issuedToType != '' ? '<tag style="display: block; font-size: 11px; color: #888;">'+expensesData[n].issuedToType+'</tag>' : '')+'</td>'+
						                            '        <td><b style="color: '+getTypeColor(expensesData[n].type)+'; font-family:\'Oswald\'; font-size: 135%;"><i class="fa fa-inr"></i>'+expensesData[n].amount+'</b></td>'+
						                            '        <td>'+expensesData[n].issuedBy+'</td>'+
						                            '    </tr>';
		      	n++;
		      }

				document.getElementById("expenseBriefDisplayRender").innerHTML = '<table class="table"><thead style="background: #f4f4f4;"><tr><th style="text-align: left">#ID</th><th style="text-align: left">Date</th>'+
							'<th style="text-align: left">Type</th> <th style="text-align: left">Issued To</th> <th style="text-align: left">Amount</th>'+
							'<th style="text-align: left">Admin</th></tr></thead><tbody>'+resultRender+'</tbody></table>';


			}
			else{
				showToast('Cloud Server Error: '+data.error, '#e74c3c');
				document.getElementById("expenseBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">Connection Error. Unable to load data from the cloud server.<p style="text-align: center"><tag style="color: #999; border: 1px solid #999; padding: 0 10px; font-size: 12px; border-radius: 3px; text-transform: uppercase; cursor: pointer; display: inline-block;" onclick="loadAllAddedExpenses(); checkLogin();">Refresh</tag></p></p>';
			}

		  },
		  error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
		  		document.getElementById("expenseBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">Connection Error. Unable to load data from the cloud server.</p>';
		  }
		});	

	}





				//Floating Button Animation
				var $floaty = $('.floaty-alternative');

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

function getTypeColor(type){
	if(type == "PURCHASE"){
		return "#ED4C67"; //pink
	}
	else if(type == "SALARY"){
		return "#39acef"; //blue
	}
	else if(type == "EXPENSE"){
		return "#f39c12"; //yellow
	}
	else if(type == "CREDIT"){
		return "#1abc9c"; //green
	}
}


function renderExpensePageDefault(){

	if(totalExpensePages == 0){
		document.getElementById("navigationAssitantExpenses").innerHTML = '';
	}
	else if(totalExpensePages == 1){
		document.getElementById("navigationAssitantExpenses").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>';
	}
	else if(totalExpensePages > 1){
		if(currentExpensePage == 1){
			document.getElementById("navigationAssitantExpenses").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentExpensePage+' of '+totalExpensePages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoExpensePage(\''+(currentExpensePage+1)+'\')"><i class="fa fa-chevron-right"></i></button>';	
		}
		else if(currentExpensePage == totalExpensePages){
			document.getElementById("navigationAssitantExpenses").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentExpensePage+' of '+totalExpensePages+'</button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoExpensePage(\''+(currentExpensePage-1)+'\')"><i class="fa fa-chevron-left"></i></button>';		
		}
		else{
			document.getElementById("navigationAssitantExpenses").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentExpensePage+' of '+totalExpensePages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoExpensePage(\''+(currentExpensePage+1)+'\')"><i class="fa fa-chevron-right"></i></button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoExpensePage(\''+(currentExpensePage-1)+'\')"><i class="fa fa-chevron-left"></i></button>';	
		}
	}
	else{
		document.getElementById("navigationAssitantExpenses").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>'+                    
                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;"><i class="fa fa-chevron-right"></i></button>'+
                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;"><i class="fa fa-chevron-left"></i></button>';
	}
}


function gotoExpensePage(toPageID){
	currentExpensePage = parseInt(toPageID);
	loadAllAddedExpenses();
}


function openSelectedExpense(encodedExpense){

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


		var expensesData = JSON.parse(decodeURI(encodedExpense));


		var mainContent = '';
        var subOptions = ''; //Submenu options

		if(expensesData.type == 'SALARY'){

		 	mainContent = 	'<tr class="blueOdd">'+
							   '<td colspan="2"><b>Entry Info</b></td>'+
							'</tr>'+
							'<tr class="blueEven	">'+
							   '<td>Salary Added Date</td>'+
							   '<td>'+expensesData.time+' on '+expensesData.date+'</td>'+
							'</tr>'+
							'<tr class="blueEven">'+
							   '<td>Reference Number</td>'+
							   '<td>'+(expensesData.reference && expensesData.reference != '' ? expensesData.reference : '-')+'</td>'+
							'</tr>'+
							'<tr class="blueEven">'+
							   '<td>Added by</td>'+
							   '<td>'+expensesData.issuedBy+'</td>'+
							'</tr>'+
							'<tr class="blueOdd">'+
							   '<td colspan="2"><b>Salary Details</b></td>'+
							'</tr>'+
							'<tr class="blueEven">'+
							   '<td>Issued To</td>'+
							   '<td>'+expensesData.issuedTo+' <tag style="font-size: 85%; color: gray">(Staff ID: <b>'+expensesData.details.staffCode+'</b>)</tag></td>'+
							'</tr>'+
							'<tr class="blueEven">'+
							   '<td>Month</td>'+
							   '<td><b>'+expensesData.details.salaryIssuingMonth+'</b></td>'+
							'</tr>'+
							(expensesData.details.comments && expensesData.details.comments != "" ? '<tr class="blueEven">'+ '<td>Comments</td>'+ '<td><b>'+expensesData.details.comments+'</b></td>'+ '</tr>' : '')+ //comments if any
							'<tr class="blueEven">'+
							   '<td>Salary Amount</td>'+
							   '<td><b><i class="fa fa-inr"></i> '+expensesData.amount+'</b></td>'+
							'</tr>'+
							'<tr class="blueOdd">'+
							   '<td colspan="2"><b>Payment Details</b></td>'+
							'</tr>'+
							'<tr class="blueEven">'+
							   '<td>Date of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.dateOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>'+
							'<tr class="blueEven">'+
							   '<td>Mode of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.modeOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>';
		

        	subOptions = '<div class="floaty" style="right: -10px; top: 0">'+
                                  '<div class="floaty-btn small" id="triggerClick_settleBillButton" style="box-shadow: none; background: #39acef" onclick="addNewExpense(\'SALARY\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-plus"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Add New Salary</span>'+
                                  '</div>'+
                                  '<ul class="floaty-list" style="margin-top: 60px !important; padding-left: 3px;">'+
                                    '<li class="floaty-list-item floaty-list-item--violet" onclick="printExpenseSlip(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-print whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Print Salary Slip</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--red" onclick="initiateRemoveExpenseRecord(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-trash-o whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Remove Record</span>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';

		}
		else if(expensesData.type == 'PURCHASE'){

		 	mainContent = 	'<tr class="pinkOdd">'+
							   '<td colspan="2"><b>Entry Info</b></td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Purchase Added Date</td>'+
							   '<td>'+expensesData.time+' on '+expensesData.date+'</td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Reference Number</td>'+
							   '<td>'+(expensesData.reference && expensesData.reference != '' ? expensesData.reference : '-')+'</td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Added by</td>'+
							   '<td>'+expensesData.issuedBy+'</td>'+
							'</tr>'+
							'<tr class="pinkOdd">'+
							   '<td colspan="2"><b>Purchase Details</b></td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Purchased From</td>'+
							   '<td>'+expensesData.issuedTo+' <tag style="font-size: 85%; color: gray">('+expensesData.issuedToType+')</tag></td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Inventory Purchased</td>'+
							   '<td><b>'+expensesData.details.itemsPurchased+'</b></td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Total Amount</td>'+
							   '<td><b><i class="fa fa-inr"></i> '+expensesData.amount+'</b></td>'+
							'</tr>'+
							'<tr class="pinkOdd">'+
							   '<td colspan="2"><b>Payment Details</b></td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Date of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.dateOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>'+
							'<tr class="pinkEven">'+
							   '<td>Mode of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.modeOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>';
		

        	subOptions = '<div class="floaty" style="right: -10px; top: 0">'+
                                  '<div class="floaty-btn small" id="triggerClick_settleBillButton" style="box-shadow: none; background: #ED4C67" onclick="addNewExpense(\'PURCHASE\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-plus"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Add Purchase Record</span>'+
                                  '</div>'+
                                  '<ul class="floaty-list" style="margin-top: 60px !important; padding-left: 3px;">'+
                                    '<li class="floaty-list-item floaty-list-item--violet" onclick="printExpenseSlip(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-print whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Print Purchase Slip</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--red" onclick="initiateRemoveExpenseRecord(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-trash-o whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Remove Record</span>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';
		}
		else if(expensesData.type == 'EXPENSE'){

		 	mainContent = 	'<tr class="brownOdd">'+
							   '<td colspan="2"><b>Entry Info</b></td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Expense Added Date</td>'+
							   '<td>'+expensesData.time+' on '+expensesData.date+'</td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Reference Number</td>'+
							   '<td>'+(expensesData.reference && expensesData.reference != '' ? expensesData.reference : '-')+'</td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Added by</td>'+
							   '<td>'+expensesData.issuedBy+'</td>'+
							'</tr>'+
							'<tr class="brownOdd">'+
							   '<td colspan="2"><b>Expense Details</b></td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Issued To</td>'+
							   '<td>'+expensesData.issuedTo+' <tag style="font-size: 85%; color: gray">('+expensesData.issuedToType+')</tag></td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Details</td>'+
							   '<td><b>'+expensesData.details.purpose+'</b></td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Total Amount</td>'+
							   '<td><b><i class="fa fa-inr"></i> '+expensesData.amount+'</b></td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Approver</td>'+
							   '<td>'+expensesData.details.authorizedBy+'</td>'+
							'</tr>'+
							'<tr class="brownOdd">'+
							   '<td colspan="2"><b>Payment Details</b></td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Date of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.dateOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>'+
							'<tr class="brownEven">'+
							   '<td>Mode of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.modeOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>';
		

        	subOptions = '<div class="floaty" style="right: -10px; top: 0">'+
                                  '<div class="floaty-btn small" id="triggerClick_settleBillButton" style="box-shadow: none; background: #f39c12" onclick="addNewExpense(\'EXPENSE\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-plus"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Add Expense</span>'+
                                  '</div>'+
                                  '<ul class="floaty-list" style="margin-top: 60px !important; padding-left: 3px;">'+
                                    '<li class="floaty-list-item floaty-list-item--violet" onclick="printExpenseSlip(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-print whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Print Expense Slip</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--red" onclick="initiateRemoveExpenseRecord(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-trash-o whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Remove Record</span>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';
		}
		else if(expensesData.type == 'CREDIT'){

		 	mainContent = 	'<tr class="greenOdd">'+
							   '<td colspan="2"><b>Entry Info</b></td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Credit Added Date</td>'+
							   '<td>'+expensesData.time+' on '+expensesData.date+'</td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Reference Number</td>'+
							   '<td>'+(expensesData.reference && expensesData.reference != '' ? expensesData.reference : '-')+'</td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Added by</td>'+
							   '<td>'+expensesData.issuedBy+'</td>'+
							'</tr>'+
							'<tr class="greenOdd">'+
							   '<td colspan="2"><b>Credit Amount Details</b></td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Received From</td>'+
							   '<td>'+expensesData.details.receivedFrom+' <tag style="font-size: 85%; color: gray">('+expensesData.details.receivedType+')</tag></td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Details</td>'+
							   '<td><b>'+expensesData.details.purpose+'</b></td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Total Amount</td>'+
							   '<td><b><i class="fa fa-inr"></i> '+expensesData.amount+'</b></td>'+
							'</tr>'+
							'<tr class="greenOdd">'+
							   '<td colspan="2"><b>Payment Details</b></td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Date of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.dateOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>'+
							'<tr class="greenEven">'+
							   '<td>Mode of Payment</td>'+
							   '<td>'+(expensesData.paymentStatus == 'PAID' ? expensesData.modeOfPayment : '<i>Not Paid Yet</i>')+'</td>'+
							'</tr>';


        	subOptions = '<div class="floaty" style="right: -10px; top: 0">'+
                                  '<div class="floaty-btn small" id="triggerClick_settleBillButton" style="box-shadow: none; background: #1abc9c" onclick="addNewExpense(\'CREDIT\')">'+
                                    '<svg width="24" height="24" viewBox="0 0 24 24" class="floaty-btn-icon floaty-btn-icon-plus absolute-center">'+
										'<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" fill="#fff"/>'+
    									'<path d="M0-.75h24v24H0z" fill="none"/>'+
                                    '</svg>'+
                                    '<tag style="color: #FFF; text-align: center; padding-top: 9px; font-size: 18px;" class="floaty-btn-icon floaty-btn-icon-create absolute-center">'+
                                      '<i class="fa fa-plus"></i>'+
                                    '</tag>'+
                                    '<span class="floaty-btn-label" style="left: unset; right: 55px !important; top: 8px;">Add Credit Slip</span>'+
                                  '</div>'+
                                  '<ul class="floaty-list" style="margin-top: 60px !important; padding-left: 3px;">'+
                                    '<li class="floaty-list-item floaty-list-item--violet" onclick="printExpenseSlip(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-print whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Print Credit Slip</span>'+
                                    '</li>'+
                                    '<li class="floaty-list-item floaty-list-item--red" onclick="initiateRemoveExpenseRecord(\''+encodedExpense+'\')">'+
                                      '<tag style="color: #FFF; text-align: center; padding-top: 7px; font-size: 18px;" class="absolute-center">'+
                                        '<i class="fa fa-trash-o whiteWash"></i>'+
                                      '</tag>'+
                                      '<span class="floaty-list-item-label" style="left: unset; right: 50px !important">Remove Record</span>'+
                                    '</li>'+     
                                  '</ul>'+
                                '</div>';						
		}
        

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+ 
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#<tag class="easyCopyToolParent"><tag class="easyCopyToolText">'+expensesData.uid+'</tag><tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag></tag> <tag class="billTypeSmallBox viewAddressBox" style="width: 85px !important; display: inline-block; text-align: center; font-weight: bold; background: '+getTypeColor(expensesData.type)+'">'+expensesData.type+'</b></tag> </h3>'+subOptions+
												      '</div>'+
												      '<time class="billSettleDate">'+expensesData.date+' at <b style="color: #a26969">'+expensesData.time+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; padding: 0 4px;"></i> Added by <tag style="color: #a26969; font-weight: bold;">'+expensesData.issuedBy+'</tag></time>'+
												      '<div class="table-responsive" style="overflow-x: hidden !important">'+
												         '<table class="table">'+
												         	'<col width="40%">'+
												         	'<col width="60%">'+
												            '<tbody>'+mainContent+'</tbody>'+
												         '</table>'+
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


/* Expense Actions */

function addNewExpense(type) {
	
	if(type == 'SALARY'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpfetchstafflistsalary.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
			  
			  hideLoading();

			  if(data.status){

			  	var staffMasterList = data.response;

			  	if(staffMasterList.length == 0){
			  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
			  		return '';
			  	}

			  	var staffSelectionContent = '';
			  	var seletectedSalaryProfilePhoto = '';
			  	var seletectedSalaryProfileAmount = 0;

			  	var n = 0;
			  	while(staffMasterList[n]){

			  		var staffList = '';

			  		for(var i = 0; i < staffMasterList[n].staff.length; i++){

			  			if(n == 0 && i == 0){ //default profile
			  				if(staffMasterList[n].staff[i].photoURL != ''){
			  					seletectedSalaryProfilePhoto = '<img src="'+staffMasterList[n].staff[i].photoURL+'" width="120px" style="border: 2px solid #e9e9e9; right: 15px; top: -62px; padding: 2px; position: absolute; max-height: 120px;">';
			  				}
			  				else{
			  					seletectedSalaryProfilePhoto = '<img src="images/common/dummy_person.png" width="120px" style="border: 2px solid #e9e9e9; right: 15px; top: -62px; padding: 2px; position: absolute; max-height: 120px;">';
			  				}

			  				seletectedSalaryProfileAmount = staffMasterList[n].staff[i].payAmountDue;
			  			}

			  			staffList += '<option data-holder="'+encodeURI(JSON.stringify(staffMasterList[n].staff[i]))+'" value="'+staffMasterList[n].staff[i].employeeID+'">'+staffMasterList[n].staff[i].fName+' '+staffMasterList[n].staff[i].lName+' ('+staffMasterList[n].staff[i].employeeID+')</option>';

			  			if(i == staffMasterList[n].staff.length - 1){ //last iteration	
			  				staffSelectionContent += '<optgroup label="'+staffMasterList[n].role+'">'+staffList+'</optgroup>';
			  			}
			  		}
			  		
			  		n++;
			  	}

			  	document.getElementById("issueSalaryModal").style.display = 'block';
			  	document.getElementById("issueSalaryModalContent").innerHTML = '<div class="row" style="margin-top: 15px;">'+
									  	'<div class="col-sm-8">'+
						                  '<label class="myReservationLabel">Staff</label>'+
						                  '<select class="form-control" onchange="adjustSalaryValues()" id="selectedStaffProfileOption">'+staffSelectionContent+'</select>'+
						               	'</div>'+
						               	'<div class="col-sm-4" id="selectedSalaryProfilePhoto">'+seletectedSalaryProfilePhoto+'</div>'+
							            '</div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Date of Payment</label> <div class="input-group date"> <input type="text"class="form-control" id="salary_date_of_payment"> <span class="input-group-addon" style="line-height: 22px;"><i class="fa fa-calendar"></i></span> </div> </div> <div class="col-sm-6"> <label class="myReservationLabel">Issuing Month</label> <div class="input-group date"> <input type="text" id="salary_month" class="form-control"> <span class="input-group-addon" style="line-height: 22px;"><i class="fa fa-calendar"></i></span> </div> </div> </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Amount</label> <input type="number" value="'+seletectedSalaryProfileAmount+'" id="salary_amount" class="form-control input-lg" placeholder="0" style="font-weight: bold; font-size: 24px;"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Payment Mode</label> <select class="form-control" id="salary_mode_of_payment"> <option value="CASH">Cash</option> <option value="CHEQUE">Cheque</option> <option value="TRANSFER">Bank Transfer</option> </select> </div> </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Transaction Reference</label> <input type="text" id="salary_transaction_reference" class="form-control input-lg" placeholder="Reference"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Comments</label> <textarea class="form-control input-lg" id="salary_comments" placeholder="Comments"></textarea> </div> </div>'+
							         	'</div>';


					var dateoptions = {
						maxDate: "+0D", 
						dateFormat: "dd-mm-yy" 
					};

					var monthoptions = {
				        changeMonth: true,
				        changeYear: true,
				        dateFormat: 'MM yy'
					}

					var $j = jQuery.noConflict();
					$j("#salary_date_of_payment").datepicker(dateoptions);
					$j("#salary_month").datepicker(monthoptions);

			  }
			  else{
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			}
		});	


	}
	else if(type == 'PURCHASE'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpnewstockmetadata.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
		
			  hideLoading();

			  if(data.status){

				var metaVendorsList = data.vendors;
                var metaInventoryList = data.inventories;

			  	if(metaVendorsList.length == 0){
			  		showToast('Warning! There are no vendor accounts added on Desk Portal.', '#e67e22');
			  		return '';
			  	}

			  	if(metaInventoryList.length == 0){
			  		showToast('Warning! There are no inventories added on Desk Portal.', '#e67e22');
			  		return '';
			  	}

			  	var vendorSelectionContent = '';
			  	var inventorySelectionContent = '';

			  	var m = 0;
			  	while(metaVendorsList[m]){
			  		vendorSelectionContent += '<option value="'+metaVendorsList[m].code+'">'+metaVendorsList[m].name+'</option>';
			  		m++;
			  	}


			  	var n = 0;
			  	var defaultInventoryUnit = '';
			  	while(metaInventoryList[n]){

			  		var inventoryList = '';

			  		for(var i = 0; i < metaInventoryList[n].items.length; i++){

			  			if(n == 0 && i == 0){
			  				defaultInventoryUnit = metaInventoryList[n].items[i].unit;
			  			}

			  			inventoryList += '<option data-holder="'+encodeURI(JSON.stringify(metaInventoryList[n].items[i]))+'" value="'+metaInventoryList[n].items[i].code+'">'+metaInventoryList[n].items[i].name+'</option>';

			  			if(i == metaInventoryList[n].items.length - 1){ //last iteration	
			  				inventorySelectionContent += '<optgroup label="'+metaInventoryList[n].category+'">'+inventoryList+'</optgroup>';
			  			}
			  		}
			  		
			  		n++;
			  	}


			  	document.getElementById("issuePurchaseSlipModal").style.display = 'block';
			  	document.getElementById("issuePurchaseSlipModalContent").innerHTML = ''+
                                       '<div class="row">'+
                                          '<div class="col-md-12">'+
                                             '<form class="form-horizontal tabular-form">'+
                                                '<div class="form-group">'+
                                                   '<label class="col-sm-3 control-label">Vendor</label>'+
                                                   '<div style="padding: 0 0 0 16px; display: inline-block; width: 60%">'+
                                                      '<select id="purchase_name_of_vendor" class="form-control" class="form-control" style="padding: 0">'+ vendorSelectionContent + 
                                                      '</select>' +
                                                   '</div>'+
                                                '</div>'+
                                                '<div class="form-group">'+
                                                   '<label for="form-name" class="col-sm-3 control-label">Inventory</label>'+
                                                   '<div style="padding: 0 0 0 16px; display: inline-block; width: 60%">'+
                                                      '<select id="purchase_name_of_inventory" onchange="adjustInventoryUnit()" class="form-control" class="form-control" style="padding: 0">'+ inventorySelectionContent +
                                                      '</select>'+
                                                   '</div>'+
                                                '</div>'+
                                                '<div class="form-group"> <label for="form-name" class="col-sm-3 control-label">Purchased Quantity</label> <div class="col-sm-6"> <input type="number" value="0" class="form-control" id="purchase_quantity_of_inventory" style="font-size: 24px; height: 48px; font-weight: bold; letter-spacing: 3px; padding: 0 12px;"> </div> <label class="col-sm-2 control-label" style="padding-left: 0; text-align: left; color: #ff9e01; font-size: 24px;" id="purchase_unit_of_inventory">'+defaultInventoryUnit+'</label> </div>'+
                                                '<div class="form-group"> <label for="form-name" class="col-sm-3 control-label">Date of Purchase</label> <div class="col-sm-8"> <input type="text" id="purchase_date_of_purchase" class="form-control"> </div> </div>'+
                                                '<div class="form-group"> <label for="form-name" class="col-sm-3 control-label" style="margin-top: 8px;">Total Amount</label> <div class="col-sm-8"> <input type="number" id="purchase_total_amount" class="form-control" value="0" style="font-size: 24px; height: 48px; font-weight: bold; letter-spacing: 3px; padding: 0 12px;"> </div> </div>'+
                                                '<div class="form-group"> <label for="form-name" class="col-sm-3 control-label">Mode of Payment</label> <div class="col-sm-8"> <select class="form-control" style="height: 40px" id="purchase_mode_of_payment"> <option value="CREDIT">Credit</option> <option value="CHEQUE">Cheque</option> <option value="CASH">Cash</option> </select> </div> </div>'+
                                                '<div class="form-group"> <label for="form-name" class="col-sm-3 control-label">Remarks</label> <div class="col-sm-8"> <input type="text" id="purchase_comments" class="form-control"> </div> </div>'+    
                                             '</form>'+
                                          '</div>'+
                                       '</div>';


					var dateoptions = {
						maxDate: "+0D", 
						dateFormat: "dd-mm-yy" 
					};

					var $j = jQuery.noConflict();
					$j("#purchase_date_of_purchase").datepicker(dateoptions);

			  }
			  else{
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			}
		});	
	}
	else if(type == 'EXPENSE'){

			  	document.getElementById("recordExpenseModal").style.display = 'block';
			  	document.getElementById("recordExpenseModalContent").innerHTML = ''+
			  							'<div class="row" style="margin-top: 15px;"> <div class="col-sm-6" id="expense_beneficiary_content"> <label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Beneficiary Type</label> <select class="form-control" id="expense_issued_to_type" onchange="adjustBeneficiaryInfo()"> <option value="OTHER">Others</option> <option value="STAFF">Staff</option> <option value="AGENT">Agent</option> <option value="VENDOR">Vendor</option>  </select> </div> </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Date of Payment</label> <div class="input-group date"> <input type="text"class="form-control" id="expense_date_of_payment"> <span class="input-group-addon" style="line-height: 21px;"><i class="fa fa-calendar"></i></span> </div> </div> <div class="col-sm-6"> <label class="myReservationLabel">Approver</label> <select class="form-control" id="expense_approver"> <option value="SELF">Self</option> <option value="MANAGER">Branch Manager</option> <option value="ACCOUNTANT">Accounts Head</option> <option value="DIRECTOR">Director</option> </select> </div> </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Amount</label> <input type="number" value="0" id="expense_amount" class="form-control input-lg" placeholder="0" style="font-weight: bold; font-size: 24px;"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Payment Mode</label> <select class="form-control" id="expense_mode_of_payment"> <option value="CASH">Cash</option> <option value="CHEQUE">Cheque</option> <option value="TRANSFER">Bank Transfer</option> </select> </div> </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Purpose</label> <input type="text" id="expense_purpose" class="form-control input-lg" placeholder="Purpose"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Comments</label> <textarea class="form-control input-lg" id="expense_comments" placeholder="Comments"></textarea> </div> </div>';

					var dateoptions = {
						maxDate: "+0D", 
						dateFormat: "dd-mm-yy" 
					};

					var $j = jQuery.noConflict();
					$j("#expense_date_of_payment").datepicker(dateoptions);
	}
	else if(type == 'CREDIT'){

			  	document.getElementById("recordCreditModal").style.display = 'block';
			  	document.getElementById("recordCreditModalContent").innerHTML = ''+
			  							'<div class="row" style="margin-top: 15px;"> <div class="col-sm-6" id="amount_payer_content"> <label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Payer Type</label> <select class="form-control" id="credit_received_from_type" onchange="adjustPayerInfo()"> <option value="OTHER">Others</option> <option value="STAFF">Staff</option> <option value="AGENT">Agent</option> <option value="VENDOR">Vendor</option>  </select> </div> </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Date of Payment</label> <div class="input-group date"> <input type="text"class="form-control" id="credit_date_of_payment"> <span class="input-group-addon" style="line-height: 21px;"><i class="fa fa-calendar"></i></span> </div> </div>  <div class="col-sm-6"> <label class="myReservationLabel">Payment Mode</label> <select class="form-control" id="credit_mode_of_payment"> <option value="CASH">Cash</option> <option value="CHEQUE">Cheque</option> <option value="TRANSFER">Bank Transfer</option> </select> </div>  </div>'+
							            '<div class="row" style="margin-top: 15px;"> <div class="col-sm-6"> <label class="myReservationLabel">Amount Received</label> <input type="number" value="0" id="credit_amount" class="form-control input-lg" placeholder="0" style="font-weight: bold; font-size: 24px;"> </div> <div class="col-sm-6"> <label class="myReservationLabel">Purpose</label> <input type="text" id="credit_purpose" class="form-control input-lg" placeholder="Purpose"> </div></div>';

					var dateoptions = {
						maxDate: "+0D", 
						dateFormat: "dd-mm-yy" 
					};

					var $j = jQuery.noConflict();
					$j("#credit_date_of_payment").datepicker(dateoptions);
	}
}

function hideIssueSalarySlipModal(){
	document.getElementById("issueSalaryModal").style.display = 'none';
}

function hideIssuePurchaseSlipModal(){
	document.getElementById("issuePurchaseSlipModal").style.display = 'none';
}

function hideRecordExpenseModal(){
	document.getElementById("recordExpenseModal").style.display = 'none';
}

function hideRecordCreditModal(){
	document.getElementById("recordCreditModal").style.display = 'none';
}

function adjustSalaryValues(){
	var e = document.getElementById("selectedStaffProfileOption");
	var optionSelected = e.options[e.selectedIndex];
	var staffSelected = JSON.parse(decodeURI($(optionSelected).attr("data-holder")));

	if(staffSelected.photoURL != ''){
		document.getElementById("selectedSalaryProfilePhoto").innerHTML = '<img src="'+staffSelected.photoURL+'" width="120px" style="border: 2px solid #e9e9e9; right: 15px; top: -62px; padding: 2px; position: absolute; max-height: 120px;">';
	}
	else{
		document.getElementById("selectedSalaryProfilePhoto").innerHTML = '<img src="images/common/dummy_person.png" width="120px" style="border: 2px solid #e9e9e9; right: 15px; top: -62px; padding: 2px; position: absolute; max-height: 120px;">';
	}

	$('#salary_amount').val(staffSelected.payAmountDue);
}

function adjustInventoryUnit(){
	var e = document.getElementById("purchase_name_of_inventory");
	var optionSelected = e.options[e.selectedIndex];
	var inventorySelected = JSON.parse(decodeURI($(optionSelected).attr("data-holder")));

	$('#purchase_unit_of_inventory').html(inventorySelected.unit);
	$('#purchase_quantity_of_inventory').focus();
	$('#purchase_quantity_of_inventory').select();
}

function adjustBeneficiaryInfo(){
	var e = document.getElementById("expense_issued_to_type");
	var optionSelected = e.options[e.selectedIndex];
	var beneficiarySelected = $(optionSelected).val();
	
	if(beneficiarySelected == 'STAFF'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpfetchstafflistsalary.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
			  
			  hideLoading();

			  if(data.status){

			  	var staffMasterList = data.response;

			  	if(staffMasterList.length == 0){
			  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
			  		document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
			  		return '';
			  	}

			  	var staffSelectionContent = '';

			  	var n = 0;
			  	while(staffMasterList[n]){

			  		var staffList = '';

			  		for(var i = 0; i < staffMasterList[n].staff.length; i++){
			  			staffList += '<option value="'+staffMasterList[n].staff[i].employeeID+'">'+staffMasterList[n].staff[i].fName+' '+staffMasterList[n].staff[i].lName+' ('+staffMasterList[n].staff[i].employeeID+')</option>';

			  			if(i == staffMasterList[n].staff.length - 1){ //last iteration	
			  				staffSelectionContent += '<optgroup label="'+staffMasterList[n].role+'">'+staffList+'</optgroup>';
			  			}
			  		}
			  		
			  		n++;
			  	}

			  	document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label>'+
			  				'<select class="form-control" id="expense_issued_to">'+staffSelectionContent+'</select>';

			  }
			  else{
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  	document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
			}
		});			
	}
	else if(beneficiarySelected == 'VENDOR'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpnewstockmetadata.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
		
			  hideLoading();

			  if(data.status){

				var metaVendorsList = data.vendors;

			  	if(metaVendorsList.length == 0){
			  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
			  		document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
			  		return '';
			  	}

			  	var vendorSelectionContent = '';

			  	var m = 0;
			  	while(metaVendorsList[m]){
			  		vendorSelectionContent += '<option value="'+metaVendorsList[m].code+'">'+metaVendorsList[m].name+'</option>';
			  		m++;
			  	}

			  	document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label>'+
			  				'<select class="form-control" id="expense_issued_to">'+vendorSelectionContent+'</select>';

			  }
			  else{
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  	document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
			}
		});	
	}	
	else if(beneficiarySelected == 'AGENT'){
		document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Agent Name">';
	}	
	else if(beneficiarySelected == 'OTHER'){
		document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
	}	
	else{
		document.getElementById("expense_beneficiary_content").innerHTML = '<label class="myReservationLabel">Issued To (Beneficiary)</label> <input type="text" value="" id="expense_issued_to" class="form-control input-lg" placeholder="Beneficiary Name">';
	}
}



function adjustPayerInfo(){
	var e = document.getElementById("credit_received_from_type");
	var optionSelected = e.options[e.selectedIndex];
	var beneficiarySelected = $(optionSelected).val();
	
	if(beneficiarySelected == 'STAFF'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpfetchstafflistsalary.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
			  
			  hideLoading();

			  if(data.status){

			  	var staffMasterList = data.response;

			  	if(staffMasterList.length == 0){
			  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
			  		document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
			  		return '';
			  	}

			  	var staffSelectionContent = '';

			  	var n = 0;
			  	while(staffMasterList[n]){

			  		var staffList = '';

			  		for(var i = 0; i < staffMasterList[n].staff.length; i++){
			  			staffList += '<option value="'+staffMasterList[n].staff[i].employeeID+'">'+staffMasterList[n].staff[i].fName+' '+staffMasterList[n].staff[i].lName+' ('+staffMasterList[n].staff[i].employeeID+')</option>';

			  			if(i == staffMasterList[n].staff.length - 1){ //last iteration	
			  				staffSelectionContent += '<optgroup label="'+staffMasterList[n].role+'">'+staffList+'</optgroup>';
			  			}
			  		}
			  		
			  		n++;
			  	}

			  	document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label>'+
			  				'<select class="form-control" id="credit_received_from">'+staffSelectionContent+'</select>';

			  }
			  else{
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  	document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
			}
		});			
	}
	else if(beneficiarySelected == 'VENDOR'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpnewstockmetadata.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
		
			  hideLoading();

			  if(data.status){

				var metaVendorsList = data.vendors;

			  	if(metaVendorsList.length == 0){
			  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
			  		document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
			  		return '';
			  	}

			  	var vendorSelectionContent = '';

			  	var m = 0;
			  	while(metaVendorsList[m]){
			  		vendorSelectionContent += '<option value="'+metaVendorsList[m].code+'">'+metaVendorsList[m].name+'</option>';
			  		m++;
			  	}

			  	document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label>'+
			  				'<select class="form-control" id="credit_received_from">'+vendorSelectionContent+'</select>';

			  }
			  else{
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  	document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
			}
		});	
	}	
	else if(beneficiarySelected == 'AGENT'){
		document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Agent Name">';
	}	
	else if(beneficiarySelected == 'OTHER'){
		document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
	}	
	else{
		document.getElementById("amount_payer_content").innerHTML = '<label class="myReservationLabel">Received From (Payer)</label> <input type="text" value="" id="credit_received_from" class="form-control input-lg" placeholder="Payer Name">';
	}
}


function proceedToIssueSalarySlip(){

		var newSalarySlip = {};

		newSalarySlip.month = document.getElementById("salary_month").value;
		newSalarySlip.date = document.getElementById("salary_date_of_payment").value;
		newSalarySlip.mode = document.getElementById("salary_mode_of_payment").value;
		newSalarySlip.employeeCode = document.getElementById("selectedStaffProfileOption").value;
		newSalarySlip.amount = document.getElementById("salary_amount").value;
     	newSalarySlip.reference = document.getElementById("salary_transaction_reference").value;
     	newSalarySlip.comments = document.getElementById("salary_comments").value;

		if(newSalarySlip.employeeCode == ""){
			showToast('Warning! Select Employee', '#e67e22');
		}
		else if(newSalarySlip.amount == "" || newSalarySlip.amount == 0){
			showToast('Warning! Invalid Amount', '#e67e22');
		}
		else if(newSalarySlip.date == "" || newSalarySlip.month == ""){
			showToast('Warning! Add Date and Issuing Month', '#e67e22');
		}
		else if(newSalarySlip.mode == ""){
			showToast('Warning! Select Payment Mode', '#e67e22');
		}
		else{

			
			newSalarySlip.month = standardiseMonth(newSalarySlip.month);
								
			var data = {};
	    	data.details = newSalarySlip;
		    data.token = window.localStorage.loggedInAdmin;

		    showLoading(10000, 'Saving...');
            

			$.ajax({
				type: 'POST',
				url: 'https://www.accelerateengine.app/apis/erpaddsalaryslip.php',
				data: JSON.stringify(data),
				contentType: "application/json",
				dataType: 'json',
				timeout: 10000,
				success: function(data) {
				  
				  hideLoading();

				  if(data.status){	
				  	hideIssueSalarySlipModal();
				  	showToast('Payment Slip generated Successfully!', '#27ae60');
				  	loadAllAddedExpenses('EXTERNAL', 'LOADING_ANIMATION');
				  }
				  else{
				  	showToast('Error: '+data.error, '#e74c3c');
				  }
				},
				error: function(data){
					hideLoading();
					showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				}
			});	


		}


		function standardiseMonth(input){
			var temp = input.split(' ');
			var month = temp[0];

			return temp[1]+''+getMonthDigit(month)

		}


		function getMonthDigit(text){
		    switch(text) {
		        case 'January':
		            return '01'
		        case 'February':
		            return '02'
		        case 'March':
		            return '03'
		        case 'April':
		            return '04'
		        case 'May':
		            return '05'
		        case 'June':
		            return '06'
		        case 'July':
		            return '07'
		        case 'August':
		            return '08'   
		        case 'September':
		            return '09'
		        case 'October':
		            return '10'
		        case 'November':
		            return '11'
		        case 'December':
		            return '12'                
		    }
		}

}



function proceedToGeneratePurchaseEntry(){

		var newPurchaseEntry = {};

		newPurchaseEntry.vendorId = document.getElementById("purchase_name_of_vendor").value;
		newPurchaseEntry.item = document.getElementById("purchase_name_of_inventory").value;
		newPurchaseEntry.units = document.getElementById("purchase_quantity_of_inventory").value;
		newPurchaseEntry.paymentMode = document.getElementById("purchase_mode_of_payment").value;
		newPurchaseEntry.remarks = document.getElementById("purchase_comments").value;
		newPurchaseEntry.amount = document.getElementById("purchase_total_amount").value;
		newPurchaseEntry.date = document.getElementById("purchase_date_of_purchase").value;
		

		if(newPurchaseEntry.vendorId == ""){
			showToast('Warning! Choose a Vendor', '#e67e22');
	  	}      
	  	else if(newPurchaseEntry.item == ""){
	  	    showToast('Warning! Choose an Inventory', '#e67e22'); 
		}
		else if(newPurchaseEntry.units == "" || newPurchaseEntry.units < 1){
		    showToast('Warning! Enter the purchased quantity', '#e67e22');  		
		}
		else if(newPurchaseEntry.date == ""){
		    showToast('Warning! Enter purchase date', '#e67e22'); 
		}
		else if(newPurchaseEntry.paymentMode == ""){
		    showToast('Warning! Choose a payment method', '#e67e22');
		}
		else if(newPurchaseEntry.amount == "" || newPurchaseEntry.totalAmount < 1){
		    showToast('Warning! Enter the total amount', '#e67e22'); 
		}
		else{

		    newPurchaseEntry.token = window.localStorage.loggedInAdmin;

		    showLoading(10000, 'Saving...');
            
			$.ajax({
				type: 'POST',
				url: 'https://www.accelerateengine.app/apis/erpaddinventorypurchasehistory.php',
				data: JSON.stringify(newPurchaseEntry),
				contentType: "application/json",
				dataType: 'json',
				timeout: 10000,
				success: function(data) {
				  
				  hideLoading();

				  if(data.status){	
				  	hideIssuePurchaseSlipModal();
				  	showToast('Purchase Entry added Successfully!', '#27ae60');
				  	loadAllAddedExpenses('EXTERNAL', 'LOADING_ANIMATION');
				  }
				  else{
				  	showToast('Error: '+data.error, '#e74c3c');
				  }
				},
				error: function(data){
					hideLoading();
					showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				}
			});	


		}

}



function proceedToRecordExpense(){

		var newExpenseObject = {};

		newExpenseObject.date = document.getElementById("expense_date_of_payment").value;
		newExpenseObject.mode = document.getElementById("expense_mode_of_payment").value;
		newExpenseObject.amount = document.getElementById("expense_amount").value;
		newExpenseObject.approver = document.getElementById("expense_approver").value;
     	newExpenseObject.purpose = document.getElementById("expense_purpose").value;
     	newExpenseObject.issuedTo = document.getElementById("expense_issued_to").value;
     	newExpenseObject.issuedToType = document.getElementById("expense_issued_to_type").value;

		if(newExpenseObject.approver == ""){
			showToast('Warning! Select an Approver', '#e67e22');
		}
		else if(newExpenseObject.issuedTo == ""){
			showToast('Warning! Add a Beneficiary', '#e67e22');
		}
		else if(newExpenseObject.issuedToType == ""){
			showToast('Warning! Select Beneficiary Type', '#e67e22');
		}
		else if(newExpenseObject.amount == "" || newExpenseObject.amount < 1){
			showToast('Warning! Invalid Amount', '#e67e22');
		}
		else if(newExpenseObject.date == ""){
			showToast('Warning! Add the Date', '#e67e22');
		}
		else if(newExpenseObject.mode == ""){
			showToast('Warning! Select the Payment Mode', '#e67e22');
		}
		else if(newExpenseObject.purpose == ""){
			showToast('Warning! Add Purpose', '#e67e22');
		}
		else{

			var data = {};
	    	data.details = newExpenseObject;
		    data.token = window.localStorage.loggedInAdmin;

		    showLoading(10000, 'Saving...');
            

			$.ajax({
				type: 'POST',
				url: 'https://www.accelerateengine.app/apis/posaddexpenserecord.php',
				data: JSON.stringify(data),
				contentType: "application/json",
				dataType: 'json',
				timeout: 10000,
				success: function(data) {
				  
				  hideLoading();

				  if(data.status){	
				  	hideRecordExpenseModal();
				  	showToast('Expense Record saved Successfully!', '#27ae60');
				  	loadAllAddedExpenses('EXTERNAL', 'LOADING_ANIMATION');
				  }
				  else{
				  	showToast('Error: '+data.error, '#e74c3c');
				  }
				},
				error: function(data){
					hideLoading();
					showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				}
			});	


		}
}




function proceedToRecordCredit(){

		var newCreditObject = {};

		newCreditObject.date = document.getElementById("credit_date_of_payment").value;
		newCreditObject.mode = document.getElementById("credit_mode_of_payment").value;
		newCreditObject.amount = document.getElementById("credit_amount").value;
		newCreditObject.purpose = document.getElementById("credit_purpose").value;
     	newCreditObject.creditFrom = document.getElementById("credit_received_from").value;
     	newCreditObject.creditFromType = document.getElementById("credit_received_from_type").value;

		if(newCreditObject.creditFrom == ""){
			showToast('Warning! Add a Payer', '#e67e22');
		}
		else if(newCreditObject.creditFromType == ""){
			showToast('Warning! Select Payer Type', '#e67e22');
		}
		else if(newCreditObject.amount == "" || newCreditObject.amount < 1){
			showToast('Warning! Invalid Amount', '#e67e22');
		}
		else if(newCreditObject.date == ""){
			showToast('Warning! Add the Date', '#e67e22');
		}
		else if(newCreditObject.mode == ""){
			showToast('Warning! Select the Payment Mode', '#e67e22');
		}
		else if(newCreditObject.purpose == ""){
			showToast('Warning! Add Purpose', '#e67e22');
		}
		else{

			var data = {};
	    	data.details = newCreditObject;
		    data.token = window.localStorage.loggedInAdmin;

		    showLoading(10000, 'Saving...');
            

			$.ajax({
				type: 'POST',
				url: 'https://www.accelerateengine.app/apis/posaddcreditrecord.php',
				data: JSON.stringify(data),
				contentType: "application/json",
				dataType: 'json',
				timeout: 10000,
				success: function(data) {
				  
				  hideLoading();

				  if(data.status){	
				  	hideRecordExpenseModal();
				  	showToast('Credit Record saved Successfully!', '#27ae60');
				  	loadAllAddedExpenses('EXTERNAL', 'LOADING_ANIMATION');
				  }
				  else{
				  	showToast('Error: '+data.error, '#e74c3c');
				  }
				},
				error: function(data){
					hideLoading();
					showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				}
			});	


		}
}




//Print Slip
function printExpenseSlip(encodedExpense){
	var expensesData = JSON.parse(decodeURI(encodedExpense));
	sendToPrinter(expensesData, 'EXPENSE_SLIP');
	showToast('Slip generated Successfully', '#27ae60');
}

function initiateRemoveExpenseRecord(encodedExpense){
	
		var expensesData = JSON.parse(decodeURI(encodedExpense));

		var data = {
			"token": window.localStorage.loggedInAdmin,
			"type": expensesData.type,
			"uid": expensesData.uid
		}

		showLoading(10000, 'Deleting...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/posremoveexpenserecord.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
		
			  hideLoading();

			  if(data.status){
			  	showToast('Expense record removed Successfully', '#27ae60');
			  }
			  else{
			  	showToast('Error: '+data.error, '#e74c3c');
			  }

			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			}
		});	

}

/*

FILTERS

*/

function openFilterModalExpenses(){

	document.getElementById("searchExpensesFilterModal").style.display = 'block';

	var options = {
		maxDate: "+0D", 
		dateFormat: "dd-mm-yy"
	};

	var $j = jQuery.noConflict();
	$j( "#reportFromDate" ).datepicker(options);
	$j( "#reportToDate" ).datepicker(options);

	$("#filter_search_key").focus();
}

function hideExpensesFilterModal(){
	document.getElementById("searchExpensesFilterModal").style.display = 'none';
}

function changeExpenseFilterSearchCriteria(){

	var tempValue = '';
	if(document.getElementById("filter_search_key") != null){
		tempValue = document.getElementById("filter_search_key").value;
	}


	var criteria = document.getElementById("filterSearchCriteria").value;

	if(criteria == 'admin'){

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

	              var staffMasterList = data.docs[0].value;
	              var staffList = [];

	              var q = 0;
	              while(staffMasterList[q]){
	              	if(staffMasterList[q].role == 'ADMIN'){
	              		staffList.push(staffMasterList[q])
	              	}
	              	q++;
	              }
	              


	              var modesTag = '';


	              for (var i=0; i<staffList.length; i++){
	                modesTag = modesTag + '<option value="'+staffList[i].code+'">'+staffList[i].name+'</option>';
	              }

	              if(staffList.length == 0){
	              	showToast('Error: No Admin Profiles added.', '#e74c3c');
	              	hideExpensesFilterModal();
	              	return '';
	              }

	              document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show expenses added by <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select></p>';
	          }
	          else{
	            showToast('Not Found Error: Staff Profiles data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Staff Profiles data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Staff Profiles data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
	}
	else if(criteria == 'type'){

	    document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+
	    							'<option value="CREDIT">Credit</option>'+
	    							'<option value="EXPENSE">Expense</option>'+
	    							'<option value="PURCHASE">Purchase</option>'+
	    							'<option value="SALARY">Salary</option>'+
	    						'</select>Records</p>';
	          
	}
	else if(criteria == 'issuedto'){

		var data = {
			"token": window.localStorage.loggedInAdmin
		}

		showLoading(10000, 'Loading...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/erpnewstockmetadata.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
		
			  hideLoading();

			  if(data.status){

				var metaVendorsList = data.vendors;

			  	if(metaVendorsList.length == 0){
			  		showToast('Warning! There are no vendors accounts added on Desk Portal.', '#e67e22');
			  	}

			  	var vendorSelectionContent = '';

			  	var m = 0;
			  	while(metaVendorsList[m]){
			  		vendorSelectionContent += '<option value="VENDOR_'+metaVendorsList[m].code+'">'+metaVendorsList[m].name+'</option>';
			  		m++;
			  	}

			  	vendorSelectionContent = '<optgroup label="Vendors">'+vendorSelectionContent+'</optgroup>' + '';
			  	
			  	loadStaffData(vendorSelectionContent);

			  }
			  else{
			  	loadStaffData('');
			  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			  }

			},
			error: function(data){
				hideLoading();
				loadStaffData('');
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			}
		});	


		function loadStaffData(vendorContent){
			
			var data = {
				"token": window.localStorage.loggedInAdmin
			}

			showLoading(10000, 'Loading...');

			$.ajax({
				type: 'POST',
				url: 'https://www.accelerateengine.app/apis/erpfetchstafflistsalary.php',
				data: JSON.stringify(data),
				contentType: "application/json",
				dataType: 'json',
				timeout: 10000,
				success: function(data) {
				  
				  hideLoading();

				  if(data.status){

				  	var staffMasterList = data.response;

				  	if(staffMasterList.length == 0){
				  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
				  	}

				  	var staffSelectionContent = '';

				  	var n = 0;
				  	while(staffMasterList[n]){

				  		var staffList = '';

				  		for(var i = 0; i < staffMasterList[n].staff.length; i++){

				  			staffList += '<option value="STAFF_'+staffMasterList[n].staff[i].employeeID+'">'+staffMasterList[n].staff[i].fName+' '+staffMasterList[n].staff[i].lName+' ('+staffMasterList[n].staff[i].employeeID+')</option>';

				  			if(i == staffMasterList[n].staff.length - 1){ //last iteration	
				  				staffSelectionContent += '<optgroup label="'+staffMasterList[n].role+'">'+staffList+'</optgroup>';
				  			}
				  		}
				  		
				  		n++;
				  	}

				  	renderOptions(vendorContent, staffSelectionContent);
				  
				  }
				  else{
				  	renderOptions(vendorContent, '');
				  	showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				  }

				},
				error: function(data){
					hideLoading();
					renderOptions(vendorContent, '');
					showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
				}
			});	
		}

		function renderOptions(vendorContent, staffContent){
			document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show expenses issued to <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+vendorContent+''+staffContent+'</select> only</p>';
		}


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
	              	hideExpensesFilterModal();
	              	return '';
	              }

	              document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show orders billed on <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>only</p>';
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
	              	hideExpensesFilterModal();
	              	return '';
	              }

	              document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show orders punched by <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select></p>';
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
	    document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="discounted">Discounted</option><option value="nondiscounted">Non Discounted</option></select>Orders</p>';
	}
	else if(criteria == 'refund'){
	    document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show Order with <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="norefund">No Refunds</option><option value="partialrefund">Partial Refund</option><option value="fullrefund">Full Refund</option></select>issued</p>';
	}
	else if(criteria == 'all'){
	    document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Showing <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="all">All Expenses</option></select></p>';
	}
	else{
		document.getElementById("filterExpensesSearchArea").innerHTML = '<input type="text" value="'+tempValue+'" class="form-control tip" id="filter_search_key" style="border: none; border-bottom: 2px solid; font-size: 36px; height: 60px; font-weight: 300; padding: 10px 3px;" placeholder="Search Here" required="required" />';
		$("#filter_search_key").focus();
	}
}


function filterExpenseSearchInitialize(optionalRoute){

	var dateFrom = '', dateTo = '', searchMode = 'uid', searchKey = '';

	dateFrom = document.getElementById("reportFromDate").value;
	dateTo = document.getElementById("reportToDate").value;

	searchMode = document.getElementById("filterSearchCriteria").value;

	if(searchMode == 'all' || searchMode == 'admin' || searchMode == 'issuedto' || searchMode == 'type'){
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
	document.getElementById("expenseBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';


	hideExpensesFilterModal();

	var searchObj = {};
	searchObj.dateFrom = dateFrom;
	searchObj.dateTo = dateTo;
	searchObj.searchMode = searchMode;
	searchObj.searchKey = searchKey;

	window.localStorage.expenseFilterCriteria = JSON.stringify(searchObj);

	document.getElementById("expenseBriefDisplayRender").innerHTML = '';

	loadAllAddedExpenses();
}

function clearFilterModalExpenses(optionalRoute){

	window.localStorage.expenseFilterCriteria = '';

	totalExpensePages = 0;
	currentExpensePage = 1;
	loadAllAddedExpenses();	
}
