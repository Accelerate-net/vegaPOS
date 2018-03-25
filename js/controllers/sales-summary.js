function setSummaryDateRange(){
	var today = getCurrentTime('DATE_YYYY-MM-DD');
	document.getElementById("reportFromDate").value = today;
	document.getElementById("reportToDate").value = today;
}

function fetchSalesSummary() {


	/*
			Summary - BILLING MODE wise
	*/


	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

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







function fetchPaymentModeWiseSummary() {

	/*
			Summary - PAYMENT MODE wise
	*/


	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


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







function fetchOverAllTurnOver(){
	
	/*
		Total Amount got Paid
		Total Charges Collected
		Total Discounts Offered
		Total Round Off issued
		Total Tips received
		and the final Turnover
	*/

	var netSalesWorth = 0;

	/*
		totalPaid = netSalesWorth + extras - discount - roundOff + tips
		
		So, 
			netSalesWorth --> totalPaid - extras - tips + discount + roundoff;
	*/


	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	fromDate = '20180320';
	toDate = getCurrentTime('DATE_STAMP');

	document.getElementById("summaryRender_turnOver").innerHTML = '';

	//Step 1: Total Paid Amount
	
	$.ajax({
	    type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
		timeout: 10000,
		success: function(data) {

			var temp_totalOrders = 0;
			var temp_totalPaid = 0;

			if(data.rows.length > 0){
				temp_totalOrders = data.rows[0].value.count;
				temp_totalPaid = data.rows[0].value.sum;
			}
			
			//time to render...
			if(temp_totalOrders > 0){
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Gross Sales Amount</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_totalPaid+'<br><count class="summaryCount">'+temp_totalOrders+' Orders</count></td> </tr>';
				netSalesWorth = temp_totalPaid; 
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no settled orders</tag>';
				return ''; //No orders found
			}

			//Step 2: Total Charges collected
			renderChargesCollected(fromDate, toDate, netSalesWorth);

		},
		error: function(data){

		}
	});  


}

//Step 2
function renderChargesCollected(fromDate, toDate, netSalesWorth){

		if(fs.existsSync('./data/static/billingparameters.json')) {
	      fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 

	          	if(modes.length == 0){
	          		return '';
	          	}

	          	//For a given BILLING PARAMETER, the total Sales in the given DATE RANGE

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}

									netSalesWorth -= temp_sum;

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_sum+'<br><count class="summaryCount">'+temp_count+' Orders</count></td> </tr>';
							    	}
							    	else{
							    		document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
							    	}


							    	//Check if next mode exists...
							    	if(modes[1]){
							    		fetchOverAllTurnOverCallback(1, modes, fromDate, toDate, netSalesWorth);
							    	}
							    	else{
							    		//Step 3: Total Discount offered
							    		renderDiscountsOffered(fromDate, toDate, netSalesWorth);
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



function fetchOverAllTurnOverCallback(index, modes, fromDate, toDate, netSalesWorth){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}

									netSalesWorth -= temp_sum;

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_sum+'<br><count class="summaryCount">'+temp_count+' Orders</count></td> </tr>';
							    	}
							    	else{
							    		document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
							    	}


							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchOverAllTurnOverCallback(index+1, modes, fromDate, toDate, netSalesWorth);
							    	}
							    	else{
							    		//Step 3: Total Discount offered
							    		renderDiscountsOffered(fromDate, toDate, netSalesWorth);
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


//Step 3
function renderDiscountsOffered(fromDate, toDate, netSalesWorth){

	$.ajax({
	    type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/grandtotal_discounts?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
		timeout: 10000,
		success: function(data) {

			var temp_discountedOrdersCount = 0;
			var temp_discountedOrdersSum = 0;

			if(data.rows.length > 0){
				temp_discountedOrdersCount = data.rows[0].value.count;
				temp_discountedOrdersSum = data.rows[0].value.sum;
			}

			netSalesWorth += temp_discountedOrdersSum;
			
			//time to render...
			if(temp_discountedOrdersCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Total Discount Offered</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_discountedOrdersSum+'<br><count class="summaryCount">'+temp_discountedOrdersCount+' Orders</count></td> </tr>';
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Total Discount Offered</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
			}

			//Step 4: Total Round Off made
			renderRoundOffMade(fromDate, toDate, netSalesWorth);

		},
		error: function(data){

		}
	});  	
}


//Step 4
function renderRoundOffMade(fromDate, toDate, netSalesWorth){

	$.ajax({
	    type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/grandtotal_roundoff?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
		timeout: 10000,
		success: function(data) {

			var temp_roundOffCount = 0;
			var temp_roundOffSum = 0;

			if(data.rows.length > 0){
				temp_roundOffCount = data.rows[0].value.count;
				temp_roundOffSum = data.rows[0].value.sum;
			}
			
			netSalesWorth += temp_roundOffSum;

			//time to render...
			if(temp_roundOffCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Total Round Off Amount</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_roundOffSum+'<br><count class="summaryCount">'+temp_roundOffCount+' Orders</count></td> </tr>';
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Total Round Off Amount</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
			}

			//Step 5: Total Tips received
			renderTipsReceived(fromDate, toDate, netSalesWorth);

		},
		error: function(data){

		}
	});  
}


//Step 5
function renderTipsReceived(fromDate, toDate, netSalesWorth){

	$.ajax({
	    type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/grandtotal_tips?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
		timeout: 10000,
		success: function(data) {

			var temp_tipsCount = 0;
			var temp_tipsSum = 0;

			if(data.rows.length > 0){
				temp_tipsCount = data.rows[0].value.count;
				temp_tipsSum = data.rows[0].value.sum;
			}

			netSalesWorth -= temp_tipsSum;
			
			//time to render...
			if(temp_tipsCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Total Tips Received</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_tipsSum+'<br><count class="summaryCount">'+temp_tipsCount+' Orders</count></td> </tr>';
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>Total Tips Received</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
			}

			//Step 6: Summarize Totals
			renderSummaryFinal(netSalesWorth);

		},
		error: function(data){

		}
	});  
}


//Step 6
function renderSummaryFinal(netSalesWorth){
	
	if(netSalesWorth > 0){
		document.getElementById("summaryRender_turnOver").innerHTML += '<tr> <td>New Sales Worth</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+netSalesWorth+'</td> </tr>';
	}
}




function fetchDiscountSaleSummary(){
	
	/*
		Total Discounts offered in given date range
	*/


	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	fromDate = '20180320';
	toDate = getCurrentTime('DATE_STAMP');



		document.getElementById("summaryRender_discountSummary").innerHTML = '';

		if(fs.existsSync('./data/static/discounttypes.json')) {
	      fs.readFile('./data/static/discounttypes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 

	          	//Reserved Keywords - Voucher, Coupon etc.
	          	modes.push({"name":"COUPON","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
	          	modes.push({"name":"VOUCHER","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
	          	modes.push({"name":"REWARDS","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
	          	modes.push({"name":"NOCOSTBILL","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_discountSummary").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no billing parameters added</tag>';
	          		return '';
	          	}

	          	//For a given BILLING PARAMETER, the total Sales in the given DATE RANGE

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbydiscounts?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {
				    	
				    	var temp_count = 0;
				    	var temp_sum = 0;

				    	if(data.rows.length > 0){
				    		temp_count = data.rows[0].value.count;
				    		temp_sum = data.rows[0].value.sum;
				    	}

				    	//beautify name
				    	if(modes[0].name == 'COUPON'){modes[0].name = 'Coupons'}
				    	if(modes[0].name == 'VOUCHER'){modes[0].name = 'Vouchers'}
				    	if(modes[0].name == 'REWARDS'){modes[0].name = 'Reward Points'}
				    	if(modes[0].name == 'NOCOSTBILL'){modes[0].name = 'No Cost Bill'}
						
						//time to render...
						if(temp_count > 0){
							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_sum+'<br><count class="summaryCount">'+temp_count+' Orders</count></td> </tr>';
						}
						else{
							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
						}

						//Check if next mode exists...
						if(modes[1]){
							fetchDiscountSaleSummaryCallback(1, modes, fromDate, toDate);
						}

				    },
				    error: function(data){

				    }
				  });  

		}
		});
	    } 

}




function fetchDiscountSaleSummaryCallback(index, modes, fromDate, toDate){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbydiscounts?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	var temp_count = 0;
				    	var temp_sum = 0;

				    	if(data.rows.length > 0){
				    		temp_count = data.rows[0].value.count;
				    		temp_sum = data.rows[0].value.sum;
				    	}
				    	

				    	//beautify name
				    	if(modes[index].name == 'COUPON'){modes[index].name = 'Coupons'}
				    	if(modes[index].name == 'VOUCHER'){modes[index].name = 'Vouchers'}
				    	if(modes[index].name == 'REWARDS'){modes[index].name = 'Reward Points'}
				    	if(modes[index].name == 'NOCOSTBILL'){modes[index].name = 'No Cost Bill'}

						//time to render...
						if(temp_count > 0){
							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>'+temp_sum+'<br><count class="summaryCount">'+temp_count+' Orders</count></td> </tr>';
						}
						else{
							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3"><i class="fa fa-inr"></i>0<br><count class="summaryCount">No Orders</count></td> </tr>';
						}

						//Check if next mode exists...
						if(modes[index+1]){
							fetchDiscountSaleSummaryCallback(index+1, modes, fromDate, toDate);
						}

				    },
				    error: function(data){

				    }
				  }); 

}






//http://127.0.0.1:5984/zaitoon_invoices/_design/accelerate/_view/invoices?startkey=%2220180320%22&endkey=%2220180323%22