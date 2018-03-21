
var currentPage = 0;
var totalPages = 0;


function loadAllPendingSettlementBills(){
	$("#billSelection_settled").removeClass("billTypeSelectionBox");
	$("#billSelection_pending").addClass("billTypeSelectionBox");


	currentPage = 0;
	totalPages = 0;

	document.getElementById("billTypeTitle").innerHTML = 'Pending Bills';

	var totalResultsCount = 0;
	var fileCount = 0;
	var iterationRound = 0;

	var resultRender = '';

    dirname = './data/bills'
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            showToast('System Error: Unable to load Unsettled Bills. Please contact Accelerate Support.', '#e74c3c');
            return;
        }

        fileCount = filenames.length;

        if(fileCount == 0){
        	document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Unsettled Bills';
        	return '';
        }

        filenames.forEach(function(filename) {

        	iterationRound++;

            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, data) {
                if (err) {
                    showToast('System Error: Unable to load a few Unsettled Bills. Please contact Accelerate Support.', '#e74c3c');
                    return;
                } else {

                    if(filename.toLowerCase().indexOf(".json") < 0){ //Neglect any files other than JSON
                        if(iterationRound == fileCount && totalResultsCount == 0){
                        	document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Unsettled Bills';
                        }
                        return '';
                    }
                    	
                    	var bill = JSON.parse(data);
                    	totalResultsCount++;


				      	resultRender += '   <tr role="row" class="billsListSingle" onclick="openSelectedBill(\''+encodeURI(JSON.stringify(bill))+'\', \'PENDING\')">'+
			                            '        <td>#'+bill.billNumber+'</td>'+
			                            '        <td>'+getFancyTime(bill.timeBill)+'<br>'+bill.date+'</td>'+
			                            '        <td>'+bill.orderDetails.mode+'<br>'+( bill.orderDetails.modeType == 'DINE' ? 'Table #'+bill.table : '' + bill.orderDetails.modeType == 'TOKEN' ? 'Token #'+bill.table : '')+'</td>'+
			                            '        <td>'+bill.customerName+'<br>'+bill.customerMobile+'</td>'+
			                            '        <td>'+bill.stewardName+'</td>'+
			                            '    </tr>';


                    	if(iterationRound == fileCount){

                    		totalPages = Math.ceil(totalResultsCount/10);

						      if(totalResultsCount == 0){
						      	document.getElementById("billBriefDisplayRender").innerHTML = 'There are no Unsettled Bills';
						      	return '';
						      }


                    			document.getElementById("pendingBillsCount").innerHTML = totalResultsCount;

						      	document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
						      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
						      						'<th style="text-align: left">Attended By</th></tr></thead><tbody>'+resultRender+'</tbody>';

						      	renderBillPageDefault()                    	
                    	}
                    	

                } //end of else

            });
        });


    });

}


function loadAllSettledBills(){
	$("#billSelection_settled").addClass("billTypeSelectionBox");
	$("#billSelection_pending").removeClass("billTypeSelectionBox");

	currentPage = 0;
	totalPages = 0;

	document.getElementById("billTypeTitle").innerHTML = 'Settled Bills';

	  $.ajax({
	    type: 'GET',
	    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_all_docs?limit=10&descending=true&include_docs=true',
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
                            '        <td>'+resultsList[n].doc.timeBill+'<br>'+resultsList[n].doc.date+'</td>'+
                            '        <td>'+resultsList[n].doc.orderDetails.mode+'<br>'+( resultsList[n].doc.orderDetails.modeType == 'DINE' ? 'Table #'+resultsList[n].doc.table : '' + resultsList[n].doc.orderDetails.modeType == 'TOKEN' ? 'Token #'+resultsList[n].doc.table : '')+'</td>'+
                            '        <td>'+resultsList[n].doc.customerName+'<br>'+resultsList[n].doc.customerMobile+'</td>'+
                            '        <td><i class="fa fa-inr"></i> '+resultsList[n].doc.totalAmountPaid+'</td>'+
                            '        <td>'+resultsList[n].doc.modeOfPayment+'</td>'+
                            '    </tr>';
	      	n++;
	      }


			document.getElementById("billBriefDisplayRender").innerHTML = '<thead style="background: #f4f4f4;"><tr> <th style="text-align: left">#</th> <th style="text-align: left">Date</th>'+
				      						'<th style="text-align: left">Table</th> <th style="text-align: left">Customer</th>'+
				      						'<th style="text-align: left">Amount</th> <th style="text-align: left">Mode</th> </tr></thead><tbody>'+resultRender+'<tbody>';
	      
	      	renderBillPageDefault()

	    },
	    error: function(data){
	    	showToast('Local Server not responding. Please try again.', '#e74c3c');
	    }

	  });  

	renderBillPageDefault()
}

function renderBillPageDefault(){

	console.log(totalPages)

	if(totalPages == 0){
		document.getElementById("navigationAssitantBills").innerHTML = '';
	}
	else if(totalPages == 1){
		document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>';
	}
	else if(totalPages > 1){
		if(currentPage == 1){
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage+1)+'\')"><i class="fa fa-chevron-right"></i></button>';	
		}
		else if(currentPage == totalPages){
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage-1)+'\')"><i class="fa fa-chevron-left"></i></button>';		
		}
		else{
			document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">'+currentPage+' of '+totalPages+'</button>'+                    
	                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage+1)+'\')"><i class="fa fa-chevron-right"></i></button>'+
	                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;" onclick="gotoBillPage(\''+(currentPage-1)+'\')"><i class="fa fa-chevron-left"></i></button>';	
		}
	}
	else{
		document.getElementById("navigationAssitantBills").innerHTML = '<button class="btn btn-success btn-sm" style="background: none; color: black; border: none; border-radius: 0;">1 of 1</button>'+                    
                            '<button class="btn btn-success btn-sm" style="float: right;  border: none; border-radius: 0;"><i class="fa fa-chevron-right"></i></button>'+
                            '<button class="btn btn-success btn-sm" style="float: right; border: none; border-radius: 0;"><i class="fa fa-chevron-left"></i></button>';
	}
}


function gotoBillPage(toPageID){
	currentPage = parseInt(toPageID);
	renderBillPageDefault();
}


function openSelectedBill(encodedBill, type){

	var bill = JSON.parse(decodeURI(encodedBill));

	console.log(bill)


	if(type == 'PENDING'){

		var itemsList = '';
		var n = 0;
		var subTotal = 0;
		while(bill.cart[n]){
			if(bill.cart[n].isCustom)
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+' ('+bill.cart[n].variant+')</td> <td>'+bill.cart[n].qty+'</td> <td><i class="fa fa-inr"></i> '+bill.cart[n].price+'</td> <td><i class="fa fa-inr"></i> '+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			else
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+'</td> <td>'+bill.cart[n].qty+'</td> <td><i class="fa fa-inr"></i> '+bill.cart[n].price+'</td> <td><i class="fa fa-inr"></i> '+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			
			subTotal += bill.cart[n].price * bill.cart[n].qty;

			n++;
		}

		var otherCharges = '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Sub Total</b></td> <td></td> <td><i class="fa fa-inr"></i> '+subTotal+'</td> </tr>';
		
		if(!jQuery.isEmptyObject(bill.extras)){
			var m = 0;
			while(bill.extras[m]){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>'+bill.extras[m].name+' ('+(bill.extras[m].unit == 'PERCENTAGE' ? bill.extras[m].value+'%' : 'Rs. '+bill.extras[m].value)+')</b></td> <td></td> <td><i class="fa fa-inr"></i> '+bill.extras[m].amount+'</td> </tr>';
				m++;
			}
		}

		if(!jQuery.isEmptyObject(bill.discount)){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Discounts</b></td> <td></td> <td><i class="fa fa-inr"></i> '+bill.discount.amount+'</td> </tr>';
		}

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#'+bill.billNumber+(bill.orderDetails.modeType == 'DINE' ? '<tag class="billTypeSmallBox">Table No. '+bill.table+'</tag>' : '<tag class="billTypeSmallBox">'+bill.orderDetails.mode+'</tag>')+'</h3><button class="btn btn-success btn-sm" style="float: right" onclick="settleBillAndPush(\''+encodedBill+'\', \'GENERATED_BILLS\')">Settle Bill</button>'+
												      '</div>'+
												      '<div class="table-responsive">'+
												         '<table class="table">'+
												            '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">#</th> <th style="text-align: left">Item</th> <th style="text-align: left">Quantity</th> <th style="text-align: left">Unit Price</th> <th style="text-align: left">Total</th> </tr> </thead>'+
												            '<tbody>'+itemsList+otherCharges+
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
		while(bill.cart[n]){
			if(bill.cart[n].isCustom)
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+' ('+bill.cart[n].variant+')</td> <td>'+bill.cart[n].qty+'</td> <td><i class="fa fa-inr"></i> '+bill.cart[n].price+'</td> <td><i class="fa fa-inr"></i> '+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			else
				itemsList += '<tr> <td>'+(n+1)+'</td> <td>'+bill.cart[n].name+'</td> <td>'+bill.cart[n].qty+'</td> <td><i class="fa fa-inr"></i> '+bill.cart[n].price+'</td> <td><i class="fa fa-inr"></i> '+(bill.cart[n].price * bill.cart[n].qty)+'</td> </tr>';
			
			subTotal += bill.cart[n].price * bill.cart[n].qty;

			n++;
		}

		var otherCharges = '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Sub Total</b></td> <td></td> <td><i class="fa fa-inr"></i> '+subTotal+'</td> </tr>';
		
		if(!jQuery.isEmptyObject(bill.extras)){
			var m = 0;
			while(bill.extras[m]){
				otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>'+bill.extras[m].name+' ('+(bill.extras[m].unit == 'PERCENTAGE' ? bill.extras[m].value+'%' : 'Rs. '+bill.extras[m].value)+')</b></td> <td></td> <td><i class="fa fa-inr"></i> '+bill.extras[m].amount+'</td> </tr>';
				m++;
			}
		}

		if(!jQuery.isEmptyObject(bill.discount)){
			otherCharges += '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Discounts</b></td> <td></td> <td><i class="fa fa-inr"></i> '+bill.discount.amount+'</td> </tr>';
		}

		document.getElementById("billDetailedDisplayRender").innerHTML = ''+
												'<div class="box box-primary">'+
												'   <div class="box-body">'+
												      '<div class="box-header" style="padding: 10px 0px">'+
												         '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">#'+bill.billNumber+'<tag class="onlinePrepaid"><i class="fa fa-credit-card"></i> Card Payment</tag></h3><button class="btn btn-success btn-sm" style="float: right">Print</button>'+
												      '</div>'+
												      '<div class="table-responsive">'+
												         '<table class="table">'+
												            '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">#</th> <th style="text-align: left">Item</th> <th style="text-align: left">Quantity</th> <th style="text-align: left">Unit Price</th> <th style="text-align: left">Total</th> </tr> </thead>'+
												            '<tbody>'+itemsList+otherCharges+
												            '</tbody>'+
												         '</table>'+
												         '<div class="row" style="margin-top: 40px">'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Customer Details</p> <p class="deliveryText">Anas Jafry</p> <p class="deliveryText">Mob. <b>8075815178</b></p> </div> </div>'+
												            '<div class="col-xs-2"></div>'+
												            '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Steward Details</p> <p class="deliveryText">Maneesh</p> <p class="deliveryText">Code: <b>8924829922</b></p> </div> </div>'+
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