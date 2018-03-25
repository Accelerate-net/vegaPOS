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



	document.getElementById("summaryRender_paymentMode").innerHTML = '';

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

	          	//For a given PAYMENT MODE, the total Sales in the given DATE RANGE

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {
				    	
				    	var temp_count = 0;
				    	var temp_sum = 0;

				    	if(data.rows.length > 0){
				    		temp_count = data.rows[0].value.count;
				    		temp_sum = data.rows[0].value.sum;
				    	}

				    		//Now check in split payments
					    	$.ajax({
								type: 'GET',
								url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_sum+'<br><count class="summaryCount">'+temp_count+' Orders</count></td> </tr>';
							    	}
							    	else{
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
							    	}


							    	//Check if next mode exists...
							    	if(modes[1]){
							    		fetchPaymentModeWiseSummaryCallback(1, modes, fromDate, toDate);
							    	}

								},
								error: function(data){

								}
							}); 


				    },
				    error: function(data){

				    }
				  });  

		}
		});
	    } 

}





function fetchPaymentModeWiseSummaryCallback(index, modes, fromDate, toDate){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	var temp_count = 0;
				    	var temp_sum = 0;

				    	if(data.rows.length > 0){
				    		temp_count = data.rows[0].value.count;
				    		temp_sum = data.rows[0].value.sum;
				    	}
				    	

				    		//Now check in split payments
					    	$.ajax({
								type: 'GET',
								url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_sum+'<br><count class="summaryCount">'+temp_count+' Orders</count></td> </tr>';
							    	}
							    	else{
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
							    	}


							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchPaymentModeWiseSummaryCallback(index+1, modes, fromDate, toDate);
							    	}

								},
								error: function(data){

								}
							}); 


				    },
				    error: function(data){

				    }
				  }); 

}


//http://127.0.0.1:5984/zaitoon_invoices/_design/accelerate/_view/invoices?startkey=%2220180320%22&endkey=%2220180323%22