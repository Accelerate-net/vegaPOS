
var currentPage = 1;
var totalPages = 1;
var displayType = 'PENDING';

function loadAllPendingSettlementBills(optionalSource){

	console.log('*** Rendering Page: '+currentPage+" (of "+totalPages+")")


	$("#billSelection_settled").removeClass("billTypeSelectionBox");
	$("#billSelection_pending").addClass("billTypeSelectionBox");
	document.getElementById("billDetailedDisplayRender").innerHTML = ''

	document.getElementById("billTypeTitle").innerHTML = 'Pending Bills';

	var totalResultsCount = 0;
	var fileCount = 0;
	var iterationRound = 0;

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

	var resultRender = '';

    dirname = './data/bills'
    fs.readdir(dirname, function(err, filenames) {

        if (err) {
            showToast('System Error: Unable to load Unsettled Bills. Please contact Accelerate Support.', '#e74c3c');
            return;
        }

		fileCount = filenames.length;
	    if(fileCount == 0){
	    	document.getElementById("pendingBillsCount").innerHTML = 0;
	    	document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Unsettled Bills';
	    	return '';
	    }
        
        filenames.sort();
        filenames.reverse();

        filenames.forEach(function(filename) {       	

        	iterationRound++;
            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, data) {
                if (err) {
                    showToast('System Error: Unable to load a few Unsettled Bills. Please contact Accelerate Support.', '#e74c3c');
                    return;
                } else {


		            if(filename.toLowerCase().indexOf(".json") < 0){ //Neglect any files other than JSON
		                if(iterationRound == fileCount && totalResultsCount == 0){
		                    document.getElementById("pendingBillsCount").innerHTML = 0;
		                    document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Unsettled Bills';
		                }
		                return '';
		            } 


                    totalResultsCount++;

                    console.log('Current Page: '+currentPage)
                    console.log('Total Results: '+totalResultsCount)

                    if((currentPage-1)*10 == totalResultsCount){
                    	currentPage--;
                    }

                	//Skip first 10 (for second page), first 20 (for third page) etc.
                	if(((currentPage-1)*10) < totalResultsCount && totalResultsCount <= (currentPage*10)){
                    	
                    	var bill = JSON.parse(data);
                    	


				      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
			                            '        <td>'+( bill.orderDetails.modeType == 'DINE' ? 'Table <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token <tag style="font-size: 120%; color: #ED4C67">#'+bill.table+'</tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? 'Parcel' : '')+'<br><tag style="font-size: 85%">'+bill.orderDetails.mode+'</tag></td>'+
			                            '        <td>'+getFancyTime(bill.timeBill)+'<br><tag style="font-size: 85%">'+bill.date+'</tag></td>'+
			                            '        <td><b style="color: #ED4C67">#'+bill.billNumber+'</b></td>'+
			                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
			                            '        <td>'+bill.stewardName+'</td>'+
			                            '    </tr>';


                    } //skip end


                    	if(iterationRound == fileCount){

                    		  totalPages = Math.ceil(totalResultsCount/10);
						      if(totalResultsCount == 0){
						      	document.getElementById("pendingBillsCount").innerHTML = 0;
						      	document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Unsettled Bills';
						      	return '';
						      }


                    			document.getElementById("pendingBillsCount").innerHTML = totalResultsCount;

						      	document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr><th style="text-align: left">Table</th><th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Bill No</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';

						      	renderBillPageDefault('PENDING')                    	
                    	}
                    	

                } //end of else

            });
        });


    });

}

function calculateSettledCount(){

		  $.ajax({
		    type: 'GET',
		    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_all_docs',
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
			if(fs.existsSync('./data/static/paymentmodes.json')) {
		      fs.readFile('./data/static/paymentmodes.json', 'utf8', function readFileCallback(err, data){
				    if (err){
				    } else {
						if(data == ''){ data = '[]'; }

						window.localStorage.availablePaymentModes = data;
					}
			   });
		   	}	
		}


	document.getElementById("billTypeTitle").innerHTML = 'Settled Bills';

	  $.ajax({
	    type: 'GET',
	    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_all_docs?descending=true&include_docs=true&limit=10&skip='+((currentPage-1)*10),
	    contentType: "application/json",
	    dataType: 'json',
	    timeout: 10000,
	    success: function(data) {

	      if(data.total_rows == 0){
	      	document.getElementById("settledBillsCount").innerHTML = 0;
	      	document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Settled Bills';
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
                            '        <td>'+resultsList[n].doc.customerName+'<br>'+resultsList[n].doc.customerMobile+'</td>'+
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
		otherCharges += '<tr style="background: #f4f4f4"> <td></td> <td></td> <td colspan="2"><b>Total Payable Amount</b></td> <td style="font-size: 150%; font-weight: bold; text-align: right"><i class="fa fa-inr"></i>'+grandSumCalculated+'</td> </tr>';

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+ 
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#'+bill.billNumber+(bill.orderDetails.modeType == 'DINE' ? '<tag class="billTypeSmallBox">Table <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'TOKEN' ? '<tag class="billTypeSmallBox">Token <b>#'+bill.table+'</b></tag>' : '' + bill.orderDetails.modeType == 'PARCEL' ? '<tag class="billTypeSmallBox viewAddressBox" onclick="viewDeliveryAddressFromBill(\''+encodeURI(bill.table)+'\')">View Address</b></tag>' : '')+'</h3><button class="btn btn-success" style="float: right; color: #FFF" onclick="settleBillAndPush(\''+encodedBill+'\', \'GENERATED_BILLS\')">Settle Bill</button>'+
												      '</div>'+
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
		
		//check if any tips/round off added
		if(bill.tipsAmount && bill.tipsAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Tips</td>  <td style="text-align: right"><tag style="color: #08ca08">+ <i class="fa fa-inr"></i>'+bill.tipsAmount+'</tag></td> </tr>';
		}

		if(bill.roundOffAmount && bill.roundOffAmount != 0){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td colspan="2">Round Off</td>  <td style="text-align: right"><tag style="color: #f15959">- <i class="fa fa-inr"></i>'+bill.roundOffAmount+'</tag></td> </tr>';
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