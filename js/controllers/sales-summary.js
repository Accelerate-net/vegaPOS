function fetchSalesSummary(fromDate, toDate) {


	/*
			Summary - BILLING MODE wise
	*/


	//Note: Dates in YYYYMMDD format

	//Default - today's summary
	if(!fromDate || fromDate == '' || !toDate || toDate == ''){
		fromDate = getCurrentTime('DATE_STAMP');
		toDate = fromDate;
	}


	fromDate = '20180320';
	toDate = getCurrentTime('DATE_STAMP');

	document.getElementById("summaryRender_billingMode").innerHTML = '';


		if(fs.existsSync('./data/static/billingmodes.json')) {
	      fs.readFile('./data/static/billingmodes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 

	          	modes = []

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_billingMode").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no billing modes added</tag>';
	          		return '';
	          	}

	          	var summaryRow = '';

	          	var grandSum = 0;
	          	var grandCount = 0;

	          	//For a given BILLING MODE, the total Sales in the given DATE RANGE
				$.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {


				    	if(data.rows.length > 0){
				    		var result = data.rows[0].value;
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+result.sum+'<br><count class="summaryCount">'+(result.count != 0? result.count+' Orders' : 'No Orders')+'</count></td> </tr>';
				    		
				    		grandSum += result.sum;
				    		grandCount += result.count;

				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
				    	}


				    	//Check if next mode exists...
				    	if(modes[1]){
				    		fetchSalesSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount);
				    	}

				    },
				    error: function(data){

				    }
				});  

		}
		});
	    } 

}


function fetchSalesSummaryCallback(index, modes, fromDate, toDate, grandSum, grandCount){

	console.log(index)

				$.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    		var result = data.rows[0].value;
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+result.sum+'<br><count class="summaryCount">'+(result.count != 0? result.count+' Orders' : 'No Orders')+'</count></td> </tr>';
				    		
				    		grandSum += result.sum;
				    		grandCount += result.count;

				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
				    	}

				    	//Check if next mode exists...
				    	if(modes[index+1]){
				    		fetchSalesSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1"><i class="fa fa-inr"></i>'+grandSum+'<br><count class="summaryCount">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count></td>'+
														                                      '</tr> '
				    	}


				    },
				    error: function(data){

				    }
				});  	
}







function fetchPaymentModeWiseSummary(fromDate, toDate) {

	/*
			Summary - PAYMENT MODE wise
	*/


	//Note: Dates in YYYYMMDD format

	//Default - today's summary
	if(!fromDate || fromDate == '' || !toDate || toDate == ''){
		fromDate = getCurrentTime('DATE_STAMP');
		toDate = fromDate;
	}


	fromDate = '20180320';
	toDate = getCurrentTime('DATE_STAMP');

		if(fs.existsSync('./data/static/paymentmodes.json')) {
	      fs.readFile('./data/static/paymentmodes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_paymentMode").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	var iterationCount = 0;

	          	//For a given PAYMENT MODE, the total Sales in the given DATE RANGE
	          	var n = 0;
	          	while(modes[n]){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[n].code+'","'+fromDate+'"]&endkey=["'+modes[n].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    		modes[iterationCount].count = data.rows[0].value.count;
				    		modes[iterationCount].amount = data.rows[0].value.sum;
				    		console.log('Single '+modes[iterationCount].name+': '+data.rows[0].value.sum)
				    	}
				    	else{
				    		modes[iterationCount].count = 0;
				    		modes[iterationCount].amount = 0;
				    	}

				    	iterationCount++;
				    	
				    	//finally check for split payments
				    	if(iterationCount == modes.length){
				    		findSplitPayments(modes, fromDate, toDate);
				  		}

				    },
				    error: function(data){

				    }
				  });  

				  n++;
				}

		}
		});
	    } 

}





function findSplitPayments(modes, fromDate, toDate){

	modes.sort();

	var m = 0;
	var iterationInnerCount = 0;

	while(modes[m]){

		$.ajax({
			type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[m].code+'","'+fromDate+'"]&endkey=["'+modes[m].code+'","'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

					

				    	if(data.rows.length > 0){
				    		modes[iterationInnerCount].count += data.rows[0].value.count;
				    		modes[iterationInnerCount].amount += data.rows[0].value.sum;
				    		console.log('Splitted '+modes[iterationInnerCount].name+': '+data.rows[0].value.sum)
				    	}
				    		
				    	iterationInnerCount++;

				    	//finally render
				    	if(iterationInnerCount == modes.length){
				    		renderSplitPayments(modes);
				    		console.log('---------------------------------')
				  		}				    	


			},
			error: function(data){

			}
		}); 

		m++;
	}
}


function renderSplitPayments(modes){

	modes.sort();

	var summaryRow = '';

	var n = 0;
	while(modes[n]){
		if(modes[n].count != 0){
			summaryRow += '<tr> <td>'+modes[n].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+modes[n].amount+'<br><count class="summaryCount">'+(modes[n].count != 0? modes[n].count+' Orders' : 'No Orders')+'</count></td> </tr>';
		}
		else{
			summaryRow += '<tr> <td>'+modes[n].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
		}

		if(n == modes.length - 1){ //last iteration
			document.getElementById("summaryRender_paymentMode").innerHTML = '<tbody>'+
										                                    '<tr class="summaryRowTitle" style="background: #f9f9f9">'+
										                                       '<td>Mode of Payment</td>'+
										                                       '<td class="summaryLine3">Amount</td>'+
										                                    '</tr>'+summaryRow+
										                                    '</tbody>';
		}

		n++;
	}

}


//http://127.0.0.1:5984/zaitoon_invoices/_design/accelerate/_view/invoices?startkey=%2220180320%22&endkey=%2220180323%22