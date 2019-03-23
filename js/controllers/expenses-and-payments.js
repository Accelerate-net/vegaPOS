
var currentPage = 1;
var totalPages = 1;
var filterResultsCount = 0;

function loadAllAddedExpenses(optionalSource, optionalAnimationFlag){

	console.log('*** Rendering Page: '+currentPage+" (of "+totalPages+")")

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
	var filterObject;
		  
	var filter_start = '';
	var filter_end = '';

	if(window.localStorage.expensesFilterCriteria && window.localStorage.expensesFilterCriteria != ''){
		isFilterApplied = true;
		filterObject = JSON.parse(window.localStorage.expensesFilterCriteria);

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


	var sampleData = [{ "uid": "12", "type": "SALARY", "reference": "SAL19139", "issuedBy": "Sahadudheen", "issuedTo": "Muhammed Ameen", "issuedToType": "Staff", "amount": "2000", "paymentStatus": "PAID", "modeOfPayment": "TRANSFER", "dateOfPayment": "21-03-2019", "date": "13-03-2019", "time": "12:10 PM", "details": { "salaryIssuingMonth": "February 2019", "staffCode": "9043960876", "comments": "Advance" } }, { "uid": "13", "type": "PURCHASE", "reference": "PU1129", "issuedBy": "Sahadudheen", "issuedTo": "Ali Mutton Stall", "issuedToType": "Vendor", "amount": "1200", "paymentStatus": "PAID", "modeOfPayment": "CASH", "dateOfPayment": "21-03-2019", "date": "13-03-2019", "time": "12:10 PM", "details": { "itemsPurchased": "1 Kg Mutton Legs" } }, { "uid": "13", "type": "EXPENSE", "reference": "", "issuedBy": "Sahadudheen", "issuedTo": "Abhijith", "issuedToType": "Staff", "amount": "300", "paymentStatus": "PAID", "modeOfPayment": "CASH", "dateOfPayment": "21-03-2019", "date": "13-03-2019", "time": "12:10 PM", "details": { "purpose": "Transfer", "authorizedBy": "Manager" } }, { "uid": "13", "type": "CREDIT", "reference": "239_PAY", "issuedBy": "Sahadudheen", "issuedTo": "Account", "issuedToType": "Account", "amount": "300", "paymentStatus": "PAID", "modeOfPayment": "CASH", "dateOfPayment": "21-03-2019", "date": "13-03-2019", "time": "12:10 PM", "details": { "purpose": "Transfer", "receivedFrom": "Abhijith", "receivedType": "Staff", "receivedCode": "9043960876" } }]


	if(currentPage == 1){
		if(isFilterApplied){
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterButton" onclick="clearFilterModalExpenses()"><span class="clearFilterInsideButton"><i class="fa fa-times"></i></span>Filter Applied<count id="filterResultsCounter"></count></button>';
		}
		else{
			document.getElementById("billTypeTitleButton").innerHTML = '<button class="billsFilterApplyButton" onclick="openFilterModalExpenses()">Apply Filter</button>';
		}
	}

	fetchExpensesFromCloudServer(0);	

	function fetchExpensesFromCloudServer(index){

		var data = {
			"token": window.localStorage.loggedInAdmin,
			"id": index
		}

		showLoading(10000, 'Searching...');

		$.ajax({
			type: 'POST',
			url: 'https://www.accelerateengine.app/apis/possearchrewards.php',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			timeout: 10000,
			success: function(data) {
			  
			  hideLoading();

			  var expensesData = sampleData;
			  var expensesDataTotal = 120;

		      if(expensesData.length == 0){
		      	document.getElementById("addedExpensesCount").innerHTML = 0;
		      	document.getElementById("expenseBriefDisplayRender").innerHTML = '<p style="color: #a9a9a9; margin: 12px 0; border-bottom: 1px solid #f9f9f9; border-top: 1px solid #f9f9f9; padding: 10px 8px;">There are no Unsettled Bills.</p>';
				return '';
		      }

		      document.getElementById("addedExpensesCount").innerHTML = expensesData.length;
		      totalPages = Math.ceil(expensesDataTotal/10);
		      
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


			},
			error: function(data){
				hideLoading();
				showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
			}
		});	

	}
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
			url: 'https://www.zaitoon.online/services/erpfetchstafflistsalary.php',
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
			url: 'https://www.zaitoon.online/services/erpnewstockmetadata.php',
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
			  		showToast('Warning! There are no staff accounts added on Desk Portal.', '#e67e22');
			  		return '';
			  	}

			  	if(metaInventoryList.length == 0){
			  		showToast('Warning! There are no vendors added on Desk Portal.', '#e67e22');
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
			url: 'https://www.zaitoon.online/services/erpfetchstafflistsalary.php',
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
			url: 'https://www.zaitoon.online/services/erpnewstockmetadata.php',
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
				url: 'https://www.zaitoon.online/services/erpaddsalaryslip.php',
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
				url: 'https://www.zaitoon.online/services/erpaddinventorypurchasehistory.php',
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
			console.log(newExpenseObject)
			return '';

			var data = {};
	    	data.details = newExpenseObject;
		    data.token = window.localStorage.loggedInAdmin;

		    showLoading(10000, 'Saving...');
            

			$.ajax({
				type: 'POST',
				url: 'https://www.zaitoon.online/services/erpaddsalaryslip.php',
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





function printExpenseSlip(encodedExpense){
	var expensesData = JSON.parse(decodeURI(encodedExpense));
}


function initiateRemoveExpenseRecord(encodedExpense){
	var expensesData = JSON.parse(decodeURI(encodedExpense));
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

	              document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>Payments</p>';
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

	              document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show only <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>Orders</p>';
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

	              document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Show orders <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection">'+modesTag+'</select>Session alone</p>';
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
	              	hideFilterModal();
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
	    document.getElementById("filterExpensesSearchArea").innerHTML = '<p style="margin-top: 15px; font-size: 24px; font-weight: 300;">Showing <select id="filterSearchCriteriaSelected" class="form-control myInlineModeSelection"><option value="all">All the Orders</option></select></p>';
	}
	else{
		document.getElementById("filterExpensesSearchArea").innerHTML = '<input type="text" value="'+tempValue+'" class="form-control tip" id="filter_search_key" style="border: none; border-bottom: 2px solid; font-size: 36px; height: 60px; font-weight: 300; padding: 10px 3px;" placeholder="Search Here" required="required" />';
		$("#filter_search_key").focus();
	}
}


function filterByDateInitialize(optionalRoute){

	//Show Animation
	document.getElementById("expenseBriefDisplayRender").innerHTML = '<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>'+
										'<div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div> <div class="row" style="padding: 3px 0;"> <div class="infoTile" style="border: none; width: 100%; line-height: 1.2em;"> <div class="infoTileHead" style="width: 60%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 10%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> <div class="infoTileHead" style="width: 20%; height: 24px; display: inline-block;"> <div class="loaderDummyTile" style="height: 24px"></div> </div> </div> </div>';

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

	hideFilterModal();

	var searchObj = {};
	searchObj.dateFrom = dateFrom;
	searchObj.dateTo = dateTo;
	searchObj.searchMode = searchMode;
	searchObj.searchKey = searchKey;

	window.localStorage.billFilterCriteria = JSON.stringify(searchObj);

	document.getElementById("expenseBriefDisplayRender").innerHTML = '';

	if(optionalRoute == 'SETTLED'){
		loadAllSettledBills();
	}
	else{
		loadAllPendingSettlementBills('EXTERNAL');
	}
}

function clearFilterModalExpenses(optionalRoute){

	window.localStorage.expensesFilterCriteria = '';

	totalPages = 0;
	currentPage = 1;
	loadAllAddedExpenses();	
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
              
              document.getElementById("applyBillDiscountLate_grandSumDisplay").innerHTML = bill.payableAmount;
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
				          while(billfile.cart[n]){
				            grandSum = grandSum + (billfile.cart[n].price * billfile.cart[n].qty);
				            n++;
				          }

				          grandPayableBill += grandSum;


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


				          var totalDiscount = 0;
				      
				          if(unit == 'PERCENTAGE'){
				            totalDiscount = grandSum*value/100;
				          }
				          else if(unit == 'FIXED'){
				            totalDiscount = value;
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


				          //substract discounts if any
				          if(!jQuery.isEmptyObject(billfile.discount)){
				            grandPayableBill -= billfile.discount.amount;
				          }  

				          billfile.payableAmount = properRoundOff(grandPayableBill);

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

