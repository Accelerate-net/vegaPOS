function setSummaryDateRange(){

	var dateoptions = {
		maxDate: "+0D", 
		dateFormat: "dd-mm-yy"
	};

	var $j = jQuery.noConflict();
	$j( "#reportFromDate" ).datepicker(dateoptions);
	$j( "#reportToDate" ).datepicker(dateoptions);
	
	var today = getCurrentTime('DATE_DD-MM-YY');
	document.getElementById("reportFromDate").value = today;
	document.getElementById("reportToDate").value = today;
}

function fetchSalesSummary() {
	/*
			Summary - BILLING MODE wise
	*/

	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_billingMode").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	var graphData = [];

	document.getElementById("summaryRender_billingMode").innerHTML = '';

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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_billingMode").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">Oho! There are no billing modes added</tag>';
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
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr onclick="openDetailedByMode(\''+modes[0].name+'\', \''+fromDate+'\', \''+toDate+'\')" class="detailedByMode"> <td>'+modes[0].name+'<tag class="viewOptionsIcon">View Details</tag></td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+(result.count != 0? result.count+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(result.sum).toFixed(2)+'</td> </tr>';
				    		
				    		grandSum += result.sum;
				    		grandCount += result.count;

				    		if(result.sum > 0){
				    			graphData.push({
						    		"name": modes[0].name,
						    		"value": result.sum
						    	})
				    		}

				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
				    	}




				    	//Check if next mode exists...
				    	if(modes[1]){
				    		fetchSalesSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount, graphData);
				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
							renderGraph_SalesSummary(graphData);
				    	}

				    },
				    error: function(data){
				    	document.getElementById("summaryRender_billingMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
				    }
				});  
          }
        }
      }

    });

}


function fetchSalesSummaryCallback(index, modes, fromDate, toDate, grandSum, grandCount, graphData){

				$.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    		var result = data.rows[0].value;
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr onclick="openDetailedByMode(\''+modes[index].name+'\', \''+fromDate+'\', \''+toDate+'\')" class="detailedByMode"> <td>'+modes[index].name+'<tag class="viewOptionsIcon">View Details</tag></td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+(result.count != 0? result.count+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(result.sum).toFixed(2)+'</td> </tr>';
				    		
				    		grandSum += result.sum;
				    		grandCount += result.count;

				    		if(result.sum > 0){
				    			graphData.push({
						    		"name": modes[index].name,
						    		"value": result.sum
						    	})
				    		}				    		

				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
				    	}

				    	//Check if next mode exists...
				    	if(modes[index+1]){
				    		fetchSalesSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount, graphData);
				    	}
				    	else{
				    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
							renderGraph_SalesSummary(graphData);
				    	}


				    },
				    error: function(data){

				    }
				});  	
}


function renderGraph_SalesSummary(graphData){

	var graph_labels = [];
	var graph_data = [];
	var graph_background = [];
	var graph_border = [];

	var m = 0;
	var totalBaseSum = 0;
	while(graphData[m]){
		totalBaseSum += graphData[m].value;
		m++;
	} 

	var n = 0;
	while(graphData[n]){
		var colorSet = random_rgba_color_set();

		graph_labels.push(graphData[n].name);
		graph_data.push(parseFloat(((graphData[n].value/totalBaseSum)*100)).toFixed(1))
		graph_background.push(colorSet[0])
		graph_border.push(colorSet[1])

		n++;
	}


	var ctx = document.getElementById("billingModesPieChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'pie',
	    data: {
	        labels: graph_labels,
	        datasets: [{
	            label: 'Billing Modes',
	            data: graph_data,
	            backgroundColor: graph_background,
	            borderColor: graph_border,
	            borderWidth: 1
	        }]
	    },
	    options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems) {
                        return ' '+graph_labels[tooltipItems.index]+' '+graph_data[tooltipItems.index] + '%';
                    }
                }
            },		    	
	        scales: {
	            yAxes: [{
	            	display:false,
	                ticks: {
	                    beginAtZero:true,
	                    display: false
	                },
	                gridLines: {
                    	display:false
                	}
	            }]
	        },
	        animation: {
                onComplete: convertGraph
            }
	    }
	});	

	function convertGraph(){
		console.log(myChart.toBase64Image())
	}
}


function openDetailedByMode(selectedBillingMode, fromDate, toDate){
	//given this mode of billing, render the payments made via different modes

		document.getElementById("summaryRenderArea_billingMode_detailed").style.display = "block";
		document.getElementById("summaryRenderArea_billingMode_detailed_title").innerHTML = 'Payment Summary for <b>'+selectedBillingMode+'</b>';


		document.getElementById("summaryRender_billingMode_detailed").innerHTML = '';

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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_billingMode_detailed").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingandpaymentmodes?startkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingandpaymentmodes_multiple?startkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}

									console.log('>> '+selectedBillingMode+' paid through '+modes[0].name+': '+temp_sum)

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_billingMode_detailed").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							    	}

							    	//Check if next mode exists...
							    	if(modes[1]){
							    		openDetailedByModeCallback(1, modes, fromDate, toDate, selectedBillingMode);
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


function openDetailedByModeCallback(index, modes, fromDate, toDate, selectedBillingMode){
	          	

	          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingandpaymentmodes?startkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingandpaymentmodes_multiple?startkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}

									console.log('>> '+selectedBillingMode+' paid through '+modes[index].name+': '+temp_sum)

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_billingMode_detailed").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							    		
							    	}

							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		openDetailedByModeCallback(index+1, modes, fromDate, toDate, selectedBillingMode);
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






function fetchPaymentModeWiseSummary() {

	/*
			Summary - PAYMENT MODE wise
	*/


	$("#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_paymentMode").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	var graphData = [];

	document.getElementById("summaryRender_paymentMode").innerHTML = '';

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

						    		if(temp_sum > 0){
						    			graphData.push({
								    		"name": modes[0].name,
								    		"value": temp_sum
								    	})
						    		}										

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							    	}
							    	else{
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							    	}


							    	//Check if next mode exists...
							    	if(modes[1]){
							    		fetchPaymentModeWiseSummaryCallback(1, modes, fromDate, toDate, graphData);
							    	}
							    	else{
							    		renderGraph_PaymentModeWiseSummary(graphData);
							    	}

								},
								error: function(data){

								}
							}); 


				    },
				    error: function(data){
				    	document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
				    }
				  });  

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

function fetchPaymentModeWiseSummaryCallback(index, modes, fromDate, toDate, graphData){

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

						    		if(temp_sum > 0){
						    			graphData.push({
								    		"name": modes[index].name,
								    		"value": temp_sum
								    	})
						    		}										

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							    	}
							    	else{
							    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							    	}


							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchPaymentModeWiseSummaryCallback(index+1, modes, fromDate, toDate, graphData);
							    	}
							    	else{
							    		renderGraph_PaymentModeWiseSummary(graphData);
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


function renderGraph_PaymentModeWiseSummary(graphData){

	var graph_labels = [];
	var graph_data = [];
	var graph_background = [];
	var graph_border = [];

	var m = 0;
	var totalBaseSum = 0;
	while(graphData[m]){
		totalBaseSum += graphData[m].value;
		m++;
	} 

	var n = 0;
	while(graphData[n]){
		var colorSet = random_rgba_color_set();

		graph_labels.push(graphData[n].name);
		graph_data.push(parseFloat(((graphData[n].value/totalBaseSum)*100)).toFixed(1))
		graph_background.push(colorSet[0])
		graph_border.push(colorSet[1])

		n++;
	}

	var ctx = document.getElementById("paymentModesPieChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'pie',
	    data: {
	        labels: graph_labels,
	        datasets: [{
	            label: 'Billing Modes',
	            data: graph_data,
	            backgroundColor: graph_background,
	            borderColor: graph_border,
	            borderWidth: 1
	        }]
	    },
	    options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems) {
                        return ' '+graph_labels[tooltipItems.index]+' '+graph_data[tooltipItems.index] + '%';
                    }
                }
            },	    	
	        scales: {
	            yAxes: [{
	            	display:false,
	                ticks: {
	                    beginAtZero:true,
	                    display: false
	                },
	                gridLines: {
                    	display:false
                	}
	            }]
	        }
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


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_turnOver").style.display = "block";



	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : '01-01-2018'; //Since the launch of Vega POS
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	var graphData = [];

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

			if(temp_totalPaid > 0){
				graphData.push({
					"name": "Total Paid Amount",
					"value": temp_totalPaid
				});
			}
			
			//time to render...
			if(temp_totalOrders > 0){
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr class="summaryRowHighlight"> <td><b>Gross Sales Amount</b></td> <td class="summaryLineBlack" style="color: #3498db; font-weight: bold; font-size: 24px; text-align: right"><count class="summaryCount" style="padding-right: 5px; font-weight: 400">from '+temp_totalOrders+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_totalPaid).toFixed(2)+'</td> </tr>';
				netSalesWorth = temp_totalPaid; 
				document.getElementById("overallBarChart").style.display = 'block';
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tag style="padding: 20px 0; text-align: center; display: block; color: gray">Auch! There are no settled orders</tag>';
				document.getElementById("overallBarChart").style.display = 'none';
				return ''; //No orders found
			}

			//Step 2: Total Charges collected
			renderChargesCollected(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){
			document.getElementById("summaryRender_turnOver").innerHTML = '<p style="margin: 0 0 25px 0; font-size: 18px; color: #949494; font-weight: 300; text-align: center">Something went wrong!</p>';
		}
	});  


}

//Step 2
function renderChargesCollected(fromDate, toDate, netSalesWorth, graphData){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_BILLING_PARAMETERS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

	          	var modes = data.docs[0].value;
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

									if(temp_sum > 0){
									    graphData.push({
											"name": modes[0].name,
											"value": temp_sum
										})
									}	

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>'+modes[0].name+'</td> <td class="summaryLineGreen" style="text-align: right">+ <i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
							    	}
							    	else{
							    		document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>'+modes[0].name+'</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
							    	}


							    	//Check if next mode exists...
							    	if(modes[1]){
							    		fetchOverAllTurnOverCallback(1, modes, fromDate, toDate, netSalesWorth, graphData);
							    	}
							    	else{
							    		//Step 3: Total Discount offered
							    		renderDiscountsOffered(fromDate, toDate, netSalesWorth, graphData);
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
          else{
            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
      }

    });	
}



function fetchOverAllTurnOverCallback(index, modes, fromDate, toDate, netSalesWorth, graphData){

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

									if(temp_sum > 0){
									    graphData.push({
											"name": modes[index].name,
											"value": temp_sum
										})
									}	

									//time to render...
							    	if(temp_count > 0){
							    		document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>'+modes[index].name+'</td> <td class="summaryLineGreen" style="text-align: right">+ <i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
							    	}
							    	else{
							    		document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>'+modes[index].name+'</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
							    	}


							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchOverAllTurnOverCallback(index+1, modes, fromDate, toDate, netSalesWorth, graphData);
							    	}
							    	else{
							    		//Step 3: Total Discount offered
							    		renderDiscountsOffered(fromDate, toDate, netSalesWorth, graphData);
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
function renderDiscountsOffered(fromDate, toDate, netSalesWorth, graphData){

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

			if(temp_discountedOrdersSum > 0){
				graphData.push({
					"name": 'Discount',
					"value": temp_discountedOrdersSum
				})
			}				
			
			//time to render...
			if(temp_discountedOrdersCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Discount Offered</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_discountedOrdersCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_discountedOrdersSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Discount Offered</td> <td style="text-align: right">-</td></tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}

			//Step 4: Total Round Off made
			renderRoundOffMade(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  	
}


//Step 4
function renderRoundOffMade(fromDate, toDate, netSalesWorth, graphData){

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


			if(temp_roundOffSum > 0){
				graphData.push({
					"name": 'Round Off',
					"value": temp_roundOffSum
				})
			}		


			//time to render...
			if(temp_roundOffCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Round Off Amount</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_roundOffCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_roundOffSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Round Off Amount</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}

			//Step 5: Total Tips received
			renderTipsReceived(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  
}


//Step 5
function renderTipsReceived(fromDate, toDate, netSalesWorth, graphData){

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


			if(temp_tipsSum > 0){
				graphData.push({
					"name": 'Tips',
					"value": temp_tipsSum
				})
			}		


			
			//time to render...
			if(temp_tipsCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Tips Received</td> <td class="summaryLineGreen" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_tipsCount+' Orders</count>+ <i class="fa fa-inr"></i>'+parseFloat(temp_tipsSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Tips Received</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}

			//Step 6: Summarize Totals
			renderSummaryFinal(netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  
}


//Step 6
function renderSummaryFinal(netSalesWorth, graphData){

	if(netSalesWorth > 0){
		graphData.push({
			"name": 'Gross Sales',
			"value": netSalesWorth
		})
	}	

	if(netSalesWorth > 0){
		document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Sales Net Worth</td> <td class="summaryLineBlack" style="text-align: right"><i class="fa fa-inr"></i>'+parseFloat(netSalesWorth).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
	}

	renderGraph_overallSummary(graphData);
}




function renderGraph_overallSummary(graphData){

	var graph_labels = [];
	var graph_data = [];
	var graph_background = [];
	var graph_border = [];

	var n = 0;
	while(graphData[n]){
		var colorSet = random_rgba_color_set();

		graph_labels.push(graphData[n].name);
		graph_data.push(parseFloat(graphData[n].value).toFixed(2))
		graph_background.push(colorSet[0])
		graph_border.push(colorSet[1])

		n++;
	}

	var ctx = document.getElementById("overallBarChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: graph_labels,
	        datasets: [{
	            label: 'Overall Figures',
	            data: graph_data,
	            backgroundColor: graph_background,
	            borderColor: graph_border,
	            borderWidth: 1
	        }]
	    },
	    options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems) {
                        return ' '+graph_labels[tooltipItems.index]+' Rs. '+graph_data[tooltipItems.index];
                    }
                }
            },	    	
	        scales: {
	            yAxes: [{
	            	display:false,
	                ticks: {
	                    beginAtZero:true,
	                    display: false
	                },
	                gridLines: {
                    	display:false
                	}
	            }]
	        }
	    }
	});	
}







function fetchDiscountSaleSummary(){
	
	/*
		Total Discounts offered in given date range
	*/


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_discountSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


		var graphData = [];
		var total_Count = 0;
		var total_Sum = 0;

		document.getElementById("summaryRender_discountSummary").innerHTML = '';



	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_DISCOUNT_TYPES" 
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
	          if(data.docs[0].identifierTag == 'ZAITOON_DISCOUNT_TYPES'){

		          	var modes = data.docs[0].value;
		          	modes.sort(); //alphabetical sorting 

		          	//Reserved Keywords - Voucher, Coupon etc.
		          	modes.push({"name":"COUPON","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
		          	modes.push({"name":"VOUCHER","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
		          	modes.push({"name":"REWARDS","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
		          	modes.push({"name":"NOCOSTBILL","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});
		          	modes.push({"name":"ONLINE","maxDiscountUnit":"AMOUNT","maxDiscountValue":10000});

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

					    	total_Count += parseInt(temp_count);
					    	total_Sum += parseFloat(temp_sum);

					    	//beautify name
					    	if(modes[0].name == 'COUPON'){modes[0].name = 'Coupons'}
					    	if(modes[0].name == 'VOUCHER'){modes[0].name = 'Vouchers'}
					    	if(modes[0].name == 'REWARDS'){modes[0].name = 'Reward Points'}
					    	if(modes[0].name == 'NOCOSTBILL'){modes[0].name = 'No Cost Bill'}
					    	if(modes[0].name == 'ONLINE'){modes[0].name = 'Pre-applied Online Discounts'}

							if(temp_sum > 0){
							    graphData.push({
									"name": modes[0].name,
									"value": temp_sum
								})
							}	

							//time to render...
							if(temp_count > 0){
								document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							}

							//Check if next mode exists...
							if(modes[1]){
								fetchDiscountSaleSummaryCallback(1, modes, fromDate, toDate, graphData, total_Count, total_Sum);
							}
							else{
					    		document.getElementById("summaryRender_discountSummary").innerHTML += '<tr class="summaryRowHighlight">'+
															                                       '<td>Over All</td>'+
															                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+total_Count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(total_Sum).toFixed(2)+'</td>'+
															                                      '</tr> '

								renderGraph_DiscountSummary(graphData);
							}

					    },
					    error: function(data){
					    	document.getElementById("summaryRender_discountSummary").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
					    }
					  });  
	          }
	        } 
	      }
	    });

}


function fetchDiscountSaleSummaryCallback(index, modes, fromDate, toDate, graphData, total_Count, total_Sum){

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

				    	total_Count += parseInt(temp_count);
				    	total_Sum += parseFloat(temp_sum);
				    	

				    	//beautify name
				    	if(modes[index].name == 'COUPON'){modes[index].name = 'Coupons'}
				    	if(modes[index].name == 'VOUCHER'){modes[index].name = 'Vouchers'}
				    	if(modes[index].name == 'REWARDS'){modes[index].name = 'Reward Points'}
				    	if(modes[index].name == 'NOCOSTBILL'){modes[index].name = 'No Cost Bill'}
				    	if(modes[index].name == 'ONLINE'){modes[index].name = 'Pre-applied Online Discounts'}

						
						if(temp_sum > 0){
						    graphData.push({
								"name": modes[index].name,
								"value": temp_sum
							})
						}										


						//time to render...
						if(temp_count > 0){
							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
						}
						else{
							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
						}

						//Check if next mode exists...
						if(modes[index+1]){
							fetchDiscountSaleSummaryCallback(index+1, modes, fromDate, toDate, graphData, total_Count, total_Sum);
						}
						else{

							document.getElementById("summaryRender_discountSummary").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+total_Count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(total_Sum).toFixed(2)+'</td>'+
														                                      '</tr> '
							renderGraph_DiscountSummary(graphData)
						}

				    },
				    error: function(data){

				    }
				  }); 

}




function renderGraph_DiscountSummary(graphData){

	var graph_labels = [];
	var graph_data = [];
	var graph_background = [];
	var graph_border = [];

	var m = 0;
	var totalBaseSum = 0;
	while(graphData[m]){
		totalBaseSum += graphData[m].value;
		m++;
	} 

	var n = 0;
	while(graphData[n]){
		var colorSet = random_rgba_color_set();

		graph_labels.push(graphData[n].name);
		graph_data.push(parseFloat(((graphData[n].value/totalBaseSum)*100)).toFixed(1))
		graph_background.push(colorSet[0])
		graph_border.push(colorSet[1])

		n++;
	}


	var ctx = document.getElementById("discountSummaryPieChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'pie',
	    data: {
	        labels: graph_labels,
	        datasets: [{
	            label: 'Billing Modes',
	            data: graph_data,
	            backgroundColor: graph_background,
	            borderColor: graph_border,
	            borderWidth: 1
	        }]
	    },
	    options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems) {
                        return ' '+graph_labels[tooltipItems.index]+' '+graph_data[tooltipItems.index] + '%';
                    }
                }
            },		    	
	        scales: {
	            yAxes: [{
	            	display:false,
	                ticks: {
	                    beginAtZero:true,
	                    display: false
	                },
	                gridLines: {
                    	display:false
                	}
	            }]
	        }
	    }
	});	
}






function fetchCancellationSummary(){
	
	/*
		Total Refunds issued for CANCELLED INVOICES in given date range
	*/

	//$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_cancellationSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	document.getElementById("summaryRender_cancellationSummary").innerHTML = '';

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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_cancellationSummary").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	var grandSum = 0;
	          	var grandCount = 0;

	          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/refund-summary/_view/sumbyrefundmodes?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {
				    	
				    	if(data.rows.length > 0){
					    	var temp_count = data.rows[0].value.count;
					    	var temp_sum = data.rows[0].value.sum;

					    	grandSum += temp_sum;
				    		grandCount += temp_count;

							if(temp_count > 0){
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							}
						}
						else{
							document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
						}
						
						if(modes[1]){
				    		fetchCancellationSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
				    	}

				    },
				    error: function(data){
				    	document.getElementById("summaryRender_cancellationSummary").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
				    }
				  });  

          }
          else{
            showToast('Not Found Error: Payment Modes data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Payment Modes data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


function fetchCancellationSummaryCallback(index, modes, fromDate, toDate, grandSum, grandCount){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/refund-summary/_view/sumbyrefundmodes?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    
					    	var temp_count = data.rows[0].value.count;
					    	var temp_sum = data.rows[0].value.sum;

					    	grandSum += temp_sum;
				    		grandCount += temp_count;

							if(temp_count > 0){
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							}
						}
						else{
							document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
						}
						
				    	//Check if next mode exists...
				    	if(modes[index+1]){
				    		fetchCancellationSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
				    	}
				    },
				    error: function(data){

				    }
				  });  

}







function fetchRefundSummary(){

	/*
		Total Refunds issued in given date range
	*/


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_refundSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	document.getElementById("summaryRender_refundSummary").innerHTML = '';

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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_refundSummary").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	var grandSum = 0;
	          	var grandCount = 0;

	          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/refund-summary/_view/sumbyrefundmodes?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {
				    	
				    	if(data.rows.length > 0){
					    	var temp_count = data.rows[0].value.count;
					    	var temp_sum = data.rows[0].value.sum;

					    	grandSum += temp_sum;
				    		grandCount += temp_count;

							if(temp_count > 0){
								document.getElementById("summaryRender_refundSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_refundSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							}
						}
						else{
							document.getElementById("summaryRender_refundSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
						}
						
						if(modes[1]){
				    		fetchRefundSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		document.getElementById("summaryRender_refundSummary").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
				    	}

				    },
				    error: function(data){
				    	document.getElementById("summaryRender_refundSummary").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
				    }
				  });  

          }
          else{
            showToast('Not Found Error: Payment Modes data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Payment Modes data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

	fetchCancellationSummary();
}




function fetchRefundSummaryCallback(index, modes, fromDate, toDate, grandSum, grandCount){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/refund-summary/_view/sumbyrefundmodes?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    
					    	var temp_count = data.rows[0].value.count;
					    	var temp_sum = data.rows[0].value.sum;

					    	grandSum += temp_sum;
				    		grandCount += temp_count;

							if(temp_count > 0){
								document.getElementById("summaryRender_refundSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_refundSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
							}
						}
						else{
							document.getElementById("summaryRender_refundSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
						}
						
				    	//Check if next mode exists...
				    	if(modes[index+1]){
				    		fetchRefundSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		document.getElementById("summaryRender_refundSummary").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Over All</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
				    	}

				    },
				    error: function(data){

				    }
				  });  
}



// Single Click Report

function fetchSingleClickReport(){


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("singleClickReport_RenderArea").style.display = "block";

	//Initialise animation contents
	document.getElementById("singleClickReport_RenderContent").innerHTML = ''+
                                      '<center><div class="reportDemo">'+
                                          '<svg class="progress" width="120"> <circle class="progress__meter" cx="60" cy="60" r="54" stroke-width="12" /> <circle class="progress__value" cx="60" cy="60" r="54" stroke-width="12" /> </svg>'+
                                          '<tag class="reportPercentage" id="reportPercentageArea"><span id="reportPercentageFigure">0</span><span style="font-size: 60%">%</span></tag>'+
                                          '<p class="generatingText">Generating Report</p>'+
                                      '</div>'+
                                      '<div id="postReportActions" style="display: none">'+
                                        '<p style="font-size: 26px; color: #777; font-weight: 300; margin-top: -15px">Your Report is Ready!</p>'+
                                        '<button style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Download</button>'+
                                        '<button style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-print"></i> Print</button>'+
                                        '<button class="btn btn-success btn-sm"><i class="fa fa-envelope"></i> Email</button>'+
                                      '</div></center>';	

    
    //Initialise animation
	var progressValue = document.querySelector('.progress__value');
	var RADIUS = 54;
	var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

	function runReportAnimation(value){

		if(value > 100){
		 	value = 100;
		}

	    var progress = value / 100;
	    var dashoffset = CIRCUMFERENCE * (1 - progress);
	    progressValue.style.strokeDashoffset = dashoffset;
	    document.getElementById("reportPercentageFigure").innerHTML = value;

	    //When it is 100%
	    if(value == 100){
	    	setTimeout(function(){
	    		document.getElementById("reportPercentageArea").innerHTML = '<img src="images/common/report_ready.png" class="staryDoneIcon">';
	    		$('#reportPercentageArea').addClass('zoomIn');
	    		$('.progress__value').css("stroke", "#FFF");
	    		$('.progress__meter').css("stroke", "#FFF");
	    		$('.generatingText').css("display", "none");
	    		$('#postReportActions').css("display", "block");

	    		playNotificationSound('DONE');
	    	}, 10);
	    }
	
		progressValue.style.strokeDasharray = CIRCUMFERENCE;		
	}

	runReportAnimation(0);





	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : '01-01-2018'; //Since the launch of Vega POS
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

	var completeReportInfo = [];
	var completeErrorList = []; //In case any API call causes Error




var uniter = 1;
function tester () {
	uniter += 1;
	runReportAnimation(uniter, progressValue, RADIUS, CIRCUMFERENCE);
  
  setTimeout(tester, 20);
}


setTimeout(tester, 1000);



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

			completeReportInfo.push({
					"name": "Total Paid Amount",
					"value": temp_totalPaid,
					"count": temp_totalOrders,
					"split": []
			});

			//Step 2: Total Charges collected
			console.log(completeReportInfo)

		},
		error: function(data){

		}
	});  


}


