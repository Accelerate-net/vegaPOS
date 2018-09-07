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
		//console.log(myChart.toBase64Image())
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

				    		//Now check in custom extras
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
				    	

				    		//Now check in custom extras
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

			//Step 6: Total Refunds Issued
			renderRefundsIssued(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  
}



//Step 6
function renderRefundsIssued(fromDate, toDate, netSalesWorth, graphData){


		//Refunded but NOT cancelled
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/refund-summary/_view/allrefunds?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_refundCount = 0;
				var temp_refundSum = 0;

				if(data.rows.length > 0){
					temp_refundCount = data.rows[0].value.count;
					temp_refundSum = data.rows[0].value.sum;
				}


				//Cancelled and Refunded Orders
				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/refund-summary/_view/allrefunds?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
					timeout: 10000,
					success: function(seconddata) {

						if(seconddata.rows.length > 0){
							temp_refundCount += seconddata.rows[0].value.count;
							temp_refundSum += seconddata.rows[0].value.sum;
						}

						netSalesWorth += temp_refundSum;


						if(temp_refundSum > 0){
							graphData.push({
								"name": 'Refunds',
								"value": temp_refundSum
							})
						}		

						//time to render...
						if(temp_refundCount > 0){
							document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Refunds Issued</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_refundCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_refundSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
						}
						else{
							document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Refunds Issued</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
						}

						//Step 7: Summarize Totals
						renderSummaryFinal(netSalesWorth, graphData);

					},
					error: function(data){

					}
				});  


			},
			error: function(data){

			}
		});  		
}


//Step 7
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



/**************************************
 	SINGLE CLICK REPORT GENERATOR
***************************************/

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
                                        '<button data-hold="" text-hold="" id="reportActionButtonDownload" onclick="reportActionDownload()" style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Download</button>'+
                                        '<button data-hold="" id="reportActionButtonPrint" onclick="reportActionPrint()" style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-print"></i> Print</button>'+
                                        '<button data-hold="" text-hold="" id="reportActionButtonEmail" onclick="reportActionEmail()" class="btn btn-success btn-sm"><i class="fa fa-envelope"></i> Email</button>'+
                                      '</div></center>';	

    document.getElementById("singleClickReport_ErrorContent").style.display = 'none';


    //Clear all graph data
    window.localStorage.graphImageDataWeeklyBW = '';
    window.localStorage.graphImageDataWeekly = '';
    window.localStorage.graphImageDataPayments = '';
    window.localStorage.graphImageDataBills = '';

    
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

	function stopReportAnimation(optionalSource){		
		if(optionalSource == 'ERROR'){
	    		document.getElementById("reportPercentageArea").innerHTML = '<img src="images/common/error_triangle.png" class="staryDoneIcon">';
	    		$('#reportPercentageArea').addClass('animateShake');
	    		$('.progress__value').css("stroke", "#FFF");
	    		$('.progress__meter').css("stroke", "#FFF");
	    		$('.generatingText').css("display", "none");
	    		$('#postReportActions').css("display", "none");

	    		playNotificationSound('DISABLE');
		}
		else{

		}
	}




	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : '01-01-2018'; //Since the launch of Vega POS
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

	var completeReportInfo = [];
	var netSalesWorth = 0;
	var netGuestsCount = '###';
	var reportInfoExtras = [];
	var completeErrorList = []; //In case any API call causes Error
	var detailedListByBillingMode = []; //Billing mode wise
	var detailedListByPaymentMode = []; //Payment mode wise
	var weeklyProgressThisWeek = []; //This Week sales
	var weeklyProgressLastWeek = []; //Last Week sales
	var paymentGraphData = []; //For payment graphs
	var billsGraphData = []; //For bills graphs


	//Starting point
	runReportAnimation(0);
	setTimeout(singleClickTotalPaid, 1000);


	//Step 1: Total Paid Amount
	function singleClickTotalPaid(){
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

				netSalesWorth = temp_totalPaid;

				//Step 1-2:
				singleClickTotalGuests();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 1,
					"error": "Failed to load net sales figure. Report can not be generated."
				});
				stopReportAnimation('ERROR');
				singleClickLoadErrors();
				return '';
			}
		});  
	}	


	//Step 1-2: Total Number of Guests
	function singleClickTotalGuests(){

		runReportAnimation(3); //of Step 1 which takes 3 units

		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/totalguests?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					netGuestsCount = data.rows[0].value.sum;
				}

				//Step 2:
				singleClickExtraCharges();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 1.2,
					"error": "Failed to sum up the number of guests"
				});
				return '';
			}
		});  
	}		


	//Step 2: 
	function singleClickExtraCharges(){

		runReportAnimation(5); //of Step 1-2 which takes 2 units

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
						completeErrorList.push({
						    "step": 2,
							"error": "Failed to read applied charges"
						});

						//Skip and go to next step
						singleClickDiscountsOffered(); 
						return '';
		          	}
		          	else{

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

					    		//Now check in custom extras
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

										reportInfoExtras.push({
												"name": modes[0].name,
												"value": temp_sum
										});

								    	//Check if next mode exists...
								    	if(modes[1]){
								    		singleClickExtraChargesCallback(1, modes);
								    	}
								    	else{
								    		//Step 3: Total Discount offered
								    		singleClickDiscountsOffered();
								    	}

									},
									error: function(data){
										completeErrorList.push({
										    "step": 2,
											"error": "Failed to read applied charges"
										});

										//Skip and go to next step
										singleClickDiscountsOffered(); 
										return '';
									}
								}); 

					    },
					    error: function(data){
							completeErrorList.push({
							    "step": 2,
								"error": "Failed to read applied charges"
							});	

							//Skip and go to next step
							singleClickDiscountsOffered(); 
							return '';	    	
					    }
					  });  
					} //else - modes
	          }
	          else{
				completeErrorList.push({
				    "step": 2,
					"error": "Failed to read applied charges"
				});

				//Skip and go to next step
				singleClickDiscountsOffered(); 
				return '';
	          }
	        }
	        else{
				completeErrorList.push({
				    "step": 2,
					"error": "Failed to read applied charges"
				});

				//Skip and go to next step
				singleClickDiscountsOffered(); 
				return '';
	        }
	      },
	      error: function(data) {
				completeErrorList.push({
				    "step": 2,
					"error": "Failed to read applied charges"
				});

				//Skip and go to next step
				singleClickDiscountsOffered(); 
				return '';
	      }

	    });	
	}


	//Step 2 - Callback
	function singleClickExtraChargesCallback(index, modes){

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
				    	

				    		//Now check in custom extras
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


									reportInfoExtras.push({
										"name": modes[index].name,
										"value": temp_sum
									});

							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		singleClickExtraChargesCallback(index+1, modes);
							    	}
							    	else{
							    		//Step 3: Total Discount offered
							    		singleClickDiscountsOffered();
							    	}

								},
								error: function(data){
									completeErrorList.push({
									    "step": 2,
										"error": "Failed to read applied charges"
									});

									//Skip and go to next step
									singleClickDiscountsOffered(); 
									return '';
								}
							}); 
				    },
				    error: function(data){
						completeErrorList.push({
						    "step": 2,
							"error": "Failed to read applied charges"
						});

						//Skip and go to next step
						singleClickDiscountsOffered(); 
						return '';
				    }
				  }); 

	}	//End step 2 callback


	//Step 3: Discounts Offered
	function singleClickDiscountsOffered(){

		runReportAnimation(15); //of Step 2 which takes 10 units

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

				completeReportInfo.push({
						"name": "Discounts",
						"type": "NEGATIVE",
						"value": temp_discountedOrdersSum,
						"count": temp_discountedOrdersCount
				});	

				//Step 4: Total Round Off made
				singleClickRoundOffsMade();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 3,
					"error": "Failed to read discounts offered"
				});				

				//Skip and go to next step
				singleClickRoundOffsMade(); 
				return '';
			}
		});  			
	}



	//Step 4: RoundOffs made
	function singleClickRoundOffsMade(){

		runReportAnimation(20); //of Step 3 which takes 5 units

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

				completeReportInfo.push({
						"name": "Round Off",
						"type": "NEGATIVE",
						"value": temp_roundOffSum,
						"count": temp_roundOffCount
				});	

				//Step 5: Total Tips received
				singleClickTipsReceived();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 4,
					"error": "Failed to read round-off amount"
				});				

				//Skip and go to next step
				singleClickTipsReceived(); 
				return '';
			}
		});  	
	}



	//Step 5: Total Tips Received
	function singleClickTipsReceived(){

		runReportAnimation(25); //of Step 4 which takes 5 units

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


				completeReportInfo.push({
						"name": "Tips",
						"type": "POSITIVE",
						"value": temp_tipsSum,
						"count": temp_tipsCount
				});	

				//Step 6: Refunds Issued
				singleClickRefundsIssued();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 5,
					"error": "Failed to read tips received"
				});				

				//Skip and go to next step
				singleClickRefundsIssued(); 
				return '';
			}
		});  		
	}


	//Step 6: Total Refunds Issued
	function singleClickRefundsIssued(){

		runReportAnimation(30); //of Step 5 which takes 5 units

		//Refunded but NOT cancelled
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/refund-summary/_view/allrefunds?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_refundCount = 0;
				var temp_refundSum = 0;

				if(data.rows.length > 0){
					temp_refundCount = data.rows[0].value.count;
					temp_refundSum = data.rows[0].value.sum;
				}


				//Cancelled and Refunded Orders
				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/_design/refund-summary/_view/allrefunds?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
					timeout: 10000,
					success: function(seconddata) {

						if(seconddata.rows.length > 0){
							temp_refundCount += seconddata.rows[0].value.count;
							temp_refundSum += seconddata.rows[0].value.sum;
						}

						netSalesWorth += temp_refundSum;

						completeReportInfo.push({
								"name": "Refunds Issued",
								"type": "NEGATIVE",
								"value": temp_refundSum,
								"count": temp_refundCount
						});	

						//Step 7: Render everything 
						singleClickSummaryFinal();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 6,
							"error": "Failed to read refunds issued"
						});				

						//Skip and go to next step
						singleClickSummaryFinal(); 
						return '';
					}
				});  


			},
			error: function(data){
				completeErrorList.push({
				    "step": 6,
					"error": "Failed to read refunds issued"
				});				

				//Skip and go to next step
				singleClickSummaryFinal(); 
				return '';
			}
		});  		
	}


	//Step 7 : Render 
	function singleClickSummaryFinal(){

		/*
			Intermediate validation pit-stop:
			Ensure if all the data so far is good to render the
			final report, in the final step.

			If it fails at this step, terminate the process here
			and kill the progress status animation
		*/

		//Step 8: Detailed by Billing Modes
		singleClickDetailedByModes();
	}


	//Step 8: Details by Billing Modes
	function singleClickDetailedByModes(){

		runReportAnimation(40); //of Step 6 which takes 10 units

		billsGraphData = [];

		//Preload Billing Parameters
	    var requestParamData = {
	      "selector"  :{ 
	                    "identifierTag": "ZAITOON_BILLING_PARAMETERS" 
	                  },
	      "fields"    : ["identifierTag", "value"]
	    }

	    $.ajax({
	      type: 'POST',
	      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
	      data: JSON.stringify(requestParamData),
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {

	        if(data.docs.length > 0){
	          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

		          	var billingExtras = data.docs[0].value;

		          	if(billingExtras.length == 0){
						completeErrorList.push({
						    "step": 8,
							"error": "Failed to calculate sales by different billing modes"
						});				

						//Skip and go to next step
						singleClickDetailedByPayment(); 
						return '';
		          	}
		          	else{


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

						          	if(modes.length == 0){
										completeErrorList.push({
										    "step": 8,
											"error": "Failed to calculate sales by different billing modes"
										});				

										//Skip and go to next step
										singleClickDetailedByPayment(); 
										return '';
						          	}
						          	else{

							          	//For a given BILLING MODE, the total Sales in the given DATE RANGE
										$.ajax({
										    type: 'GET',
										    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
										    timeout: 10000,
										    success: function(data) {

										    	var preserved_sum = 0;
										    	var preserved_count = 0;
										    	if(data.rows.length > 0){
										    		preserved_sum = data.rows[0].value.sum;
										    		preserved_count = data.rows[0].value.count;
										    	}

										    	//Extras in this given Billing Mode
										    	var splitExtrasInGivenMode = [];

										    	if(billingExtras[0]){
										    		preProcessBillingSplits(0, billingExtras, splitExtrasInGivenMode)
										    	}

										    	function preProcessBillingSplits(splitIndex, paramsList, formedSplitList){


										          	//For a given Billing Mode, amount split by billing params
													$.ajax({
													    type: 'GET',
													    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyrefundmodes_splitbyextras?startkey=["'+modes[0].name+'", "'+paramsList[splitIndex].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'", "'+paramsList[splitIndex].name+'","'+toDate+'"]',
													    timeout: 10000,
													    success: function(data) {
													    	
													    	var temp_count = 0;
													    	var temp_sum = 0;

													    	if(data.rows.length > 0){
													    		temp_count = data.rows[0].value.count;
													    		temp_sum = data.rows[0].value.sum;
													    	}

													    		//Now check in custom extras also
														    	$.ajax({
																	type: 'GET',
																	url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyrefundmodes_splitbycustomextras?startkey=["'+modes[0].name+'", "'+paramsList[splitIndex].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'", "'+paramsList[splitIndex].name+'","'+toDate+'"]',
																	timeout: 10000,
																	success: function(data) {

																		if(data.rows.length > 0){
																		    temp_count += data.rows[0].value.count;
																		    temp_sum += data.rows[0].value.sum;
																		}

																		//Finally, push it
															    		splitExtrasInGivenMode.push({
															    			"name": paramsList[splitIndex].name,
															    			"value": temp_sum,
															    			"count": temp_count
															    		});

															    		//Check if next exists in params list:
															    		if(paramsList[splitIndex + 1]){
															    			preProcessBillingSplits(splitIndex + 1, paramsList, splitExtrasInGivenMode);
															    		}
															    		else{ 	//Proceed to next BILLING MODE
															    			
																		    	detailedListByBillingMode.push({
																				    "name": modes[0].name,
																				   	"value": preserved_sum,
																				   	"count": preserved_count,
																				   	"split": splitExtrasInGivenMode
																				})

																				billsGraphData.push({
																					"name": modes[0].name,
																					"value": preserved_sum 
																				});

																		    	//Check if next exits in BILLING_MODES
																		    	if(modes[1]){
																		    		singleClickDetailedByModesCallback(1, modes, paramsList);
																		    	}
																		    	else{
																		    		singleClickRenderBillsGraph();
																		    	}															    			

															    		}

																	},
																	error: function(data){
																		completeErrorList.push({
																		    "step": 8,
																			"error": "Failed to calculate sales by different billing modes"
																		});				

																		//Skip and go to next step
																		singleClickDetailedByPayment(); 
																		return '';
																	}
																}); 


													    },
													    error: function(data){
															completeErrorList.push({
															    "step": 8,
																"error": "Failed to calculate sales by different billing modes"
															});				

															//Skip and go to next step
															singleClickDetailedByPayment(); 
															return '';
													    }
													
													});  
										    	} //end - pre process





										    },
										    error: function(data){
												completeErrorList.push({
												    "step": 8,
													"error": "Failed to calculate sales by different billing modes"
												});				

												//Skip and go to next step
												singleClickDetailedByPayment(); 
												return '';										    	
										    }
										});  
									} //else - mode
					          }
					        }
					      },
					      error: function(data){
								completeErrorList.push({
								    "step": 8,
									"error": "Failed to calculate sales by different billing modes"
								});				

								//Skip and go to next step
								singleClickDetailedByPayment(); 
								return '';
					      }
					    });


		          	}
	          }
	          else{
				completeErrorList.push({
				    "step": 8,
					"error": "Failed to calculate sales by different billing modes"
				});				

				//Skip and go to next step
				singleClickDetailedByPayment(); 
				return '';
	          }
	        }
	        else{
				completeErrorList.push({
				    "step": 8,
					"error": "Failed to calculate sales by different billing modes"
				});				

				//Skip and go to next step
				singleClickDetailedByPayment(); 
				return '';
	        }
	        
	      },
	      error: function(data) {
				completeErrorList.push({
				    "step": 8,
					"error": "Failed to calculate sales by different billing modes"
				});				

				//Skip and go to next step
				singleClickDetailedByPayment(); 
				return '';
	      }

	    });	

	}


	//Step 8 : Callback
	function singleClickDetailedByModesCallback(index, modes, paramsList){

							          	//For a given BILLING MODE, the total Sales in the given DATE RANGE
										$.ajax({
										    type: 'GET',
										    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
										    timeout: 10000,
										    success: function(data) {

										    	var preserved_sum = 0;
										    	var preserved_count = 0;
										    	if(data.rows.length > 0){
										    		preserved_sum = data.rows[0].value.sum;
										    		preserved_count = data.rows[0].value.count;
										    	}

										    	//Extras in this given Billing Mode
										    	var splitExtrasInGivenMode = [];

										    	if(paramsList[0]){
										    		preProcessBillingSplits(0, paramsList, splitExtrasInGivenMode)
										    	}

										    	function preProcessBillingSplits(splitIndex, paramsList, formedSplitList){

										          	//For a given Billing Mode, amount split by billing params
													$.ajax({
													    type: 'GET',
													    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyrefundmodes_splitbyextras?startkey=["'+modes[index].name+'", "'+paramsList[splitIndex].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'", "'+paramsList[splitIndex].name+'","'+toDate+'"]',
													    timeout: 10000,
													    success: function(data) {
													    	
													    	var temp_count = 0;
													    	var temp_sum = 0;

													    	if(data.rows.length > 0){
													    		temp_count = data.rows[0].value.count;
													    		temp_sum = data.rows[0].value.sum;
													    	}

													    		//Now check in custom extras also
														    	$.ajax({
																	type: 'GET',
																	url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbyrefundmodes_splitbycustomextras?startkey=["'+modes[index].name+'", "'+paramsList[splitIndex].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'", "'+paramsList[splitIndex].name+'","'+toDate+'"]',
																	timeout: 10000,
																	success: function(data) {

																		if(data.rows.length > 0){
																		    temp_count += data.rows[0].value.count;
																		    temp_sum += data.rows[0].value.sum;
																		}


																		//Finally, push it
															    		splitExtrasInGivenMode.push({
															    			"name": paramsList[splitIndex].name,
															    			"value": temp_sum,
															    			"count": temp_count
															    		});

															    		//Check if next exists in params list:
															    		if(paramsList[splitIndex + 1]){
															    			preProcessBillingSplits(splitIndex + 1, paramsList, splitExtrasInGivenMode);
															    		}
															    		else{ 	//Proceed to next BILLING MODE
															    			
																		    	detailedListByBillingMode.push({
																				    "name": modes[index].name,
																				   	"value": preserved_sum,
																				   	"count": preserved_count,
																				   	"split": splitExtrasInGivenMode
																				})

																				billsGraphData.push({
																					"name": modes[index].name,
																					"value": preserved_sum 
																				});

																		    	//Check if next exits in BILLING_MODES
																		    	if(modes[index+1]){
																		    		singleClickDetailedByModesCallback(index+1, modes, paramsList);
																		    	}
																		    	else{
																		    		singleClickRenderBillsGraph();
																		    	}															    			

															    		}

																	},
																	error: function(data){
																		completeErrorList.push({
																		    "step": 8,
																			"error": "Failed to calculate sales by different billing modes"
																		});				

																		//Skip and go to next step
																		singleClickDetailedByPayment(); 
																		return '';
																	}
																}); 


													    },
													    error: function(data){
															completeErrorList.push({
															    "step": 8,
																"error": "Failed to calculate sales by different billing modes"
															});				

															//Skip and go to next step
															singleClickDetailedByPayment(); 
															return '';
													    }
													
													});  
										    	} //end - pre process


										    },
										    error: function(data){
												completeErrorList.push({
												    "step": 8,
													"error": "Failed to calculate sales by different billing modes"
												});				

												//Skip and go to next step
												singleClickDetailedByPayment(); 
												return '';										    	
										    }
										});  

	}



	//Step 8-9: Render Graph (Bills)
	function singleClickRenderBillsGraph(){

			window.localStorage.graphImageDataBills = '';

			if(billsGraphData.length == 0){
				//Skip and go to next step
				singleClickDetailedByPayment(); 
				return '';
			}

			var graph_labels = [];
			var graph_data = [];
			var graph_background = [];
			var graph_border = [];

			var m = 0;
			var totalBaseSum = 0;
			while(billsGraphData[m]){
				totalBaseSum += billsGraphData[m].value;
				m++;
			} 

			var n = 0;
			while(billsGraphData[n]){
				var colorSet = random_rgba_color_set();

				graph_labels.push(billsGraphData[n].name);
				graph_data.push(parseFloat(((billsGraphData[n].value/totalBaseSum)*100)).toFixed(1))
				graph_background.push(colorSet[0])
				graph_border.push(colorSet[1])

				n++;
			}


			var ctx = document.getElementById("reportGraphBills").getContext('2d');
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
				var temp_graph = myChart.toBase64Image();

				window.localStorage.graphImageDataBills = temp_graph;

				//Go to Step 9
				singleClickDetailedByPayment();
			}
	}


	//Step 9: Details by Payment types
	function singleClickDetailedByPayment(){

		runReportAnimation(65); //of Step 8 which takes 25 units

		paymentGraphData = [];

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

	              	if(modes.length == 0){
						completeErrorList.push({
						    "step": 9,
							"error": "Failed to calculate sales by different payment modes"
						});				

						//Skip and go to next step
						singleClickWeeklyProgress(); 
						return '';
		          	}
		          	else{
						
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
								    			paymentGraphData.push({
										    		"name": modes[0].name,
										    		"value": temp_sum
										    	})
								    		}	

								    		detailedListByPaymentMode.push({
								    			"name": modes[0].name,
								    			"value": temp_sum,
								    			"count": temp_count
								    		});									


									    	//Check if next mode exists...
									    	if(modes[1]){
									    		singleClickDetailedByPaymentCallback(1, modes, paymentGraphData);
									    	}
									    	else{
									    		//Step 10: Weekly Progress
									    		singleClickWeeklyProgress();
									    	}

										},
										error: function(data){
											completeErrorList.push({
											    "step": 9,
												"error": "Failed to calculate sales by different payment modes"
											});				

											//Skip and go to next step
											singleClickWeeklyProgress(); 
											return '';
										}
									}); 


						    },
						    error: function(data){
								completeErrorList.push({
								    "step": 9,
									"error": "Failed to calculate sales by different payment modes"
								});				

								//Step 9-10: Render the Payment Graph 
								singleClickRenderPaymentsGraph(); 
								return '';
						    }
						  }); 
					} 

	          }
	          else{
				completeErrorList.push({
				    "step": 9,
					"error": "Failed to calculate sales by different payment modes"
				});				

				//Skip and go to next step
				singleClickWeeklyProgress(); 
				return '';
	          }
	        }
	        else{
				completeErrorList.push({
				    "step": 9,
					"error": "Failed to calculate sales by different payment modes"
				});				

				//Skip and go to next step
				singleClickWeeklyProgress(); 
				return '';
	        }
	      },
	      error: function(data) {
				completeErrorList.push({
				    "step": 9,
					"error": "Failed to calculate sales by different payment modes"
				});				

				//Skip and go to next step
				singleClickWeeklyProgress(); 
				return '';
	      }

	    });
	}

	//Step 9: Callback
	function singleClickDetailedByPaymentCallback(index, modes, paymentGraphData){

						  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE

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
								    			paymentGraphData.push({
										    		"name": modes[index].name,
										    		"value": temp_sum
										    	})
								    		}	

								    		detailedListByPaymentMode.push({
								    			"name": modes[index].name,
								    			"value": temp_sum,
								    			"count": temp_count
								    		});									


									    	//Check if next mode exists...
									    	if(modes[index+1]){
									    		singleClickDetailedByPaymentCallback(index+1, modes, paymentGraphData);
									    	}
									    	else{
									    		//Step 9-10: Render the Payment Graph 
									    		singleClickRenderPaymentsGraph();
									    	}

										},
										error: function(data){
											completeErrorList.push({
											    "step": 9,
												"error": "Failed to calculate sales by different payment modes"
											});				

											//Skip and go to next step
											singleClickWeeklyProgress(); 
											return '';
										}
									}); 
							},
					      	error: function(data) {
								completeErrorList.push({
								    "step": 9,
									"error": "Failed to calculate sales by different payment modes"
								});				

								//Skip and go to next step
								singleClickWeeklyProgress(); 
								return '';					        	
					      	}
					    });
	}


	//Step 9-10: Render Graph (Payments)
	function singleClickRenderPaymentsGraph(){

			window.localStorage.graphImageDataPayments = '';

			if(paymentGraphData.length == 0){
				//Skip and go to next step
				singleClickWeeklyProgress(); 
				return '';
			}

			var graph_labels = [];
			var graph_data = [];
			var graph_background = [];
			var graph_border = [];

			var m = 0;
			var totalBaseSum = 0;
			while(paymentGraphData[m]){
				totalBaseSum += paymentGraphData[m].value;
				m++;
			} 

			var n = 0;
			while(paymentGraphData[n]){
				var colorSet = random_rgba_color_set();

				graph_labels.push(paymentGraphData[n].name);
				graph_data.push(parseFloat(((paymentGraphData[n].value/totalBaseSum)*100)).toFixed(1))
				graph_background.push(colorSet[0])
				graph_border.push(colorSet[1])

				n++;
			}


			var ctx = document.getElementById("reportGraphPayments").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'pie',
			    data: {
			        labels: graph_labels,
			        datasets: [{
			            label: 'Payment Types',
			            data: graph_data,
			            backgroundColor: graph_background,
			            borderColor: graph_border,
			            borderWidth: 1
			        }]
			    },
			    options: {	    	
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
				var temp_graph = myChart.toBase64Image();

				window.localStorage.graphImageDataPayments = temp_graph;

				//Go to Step 10
				singleClickWeeklyProgress();
			}
	}


	//Step 10: Weekly Progress
	function singleClickWeeklyProgress(){

		runReportAnimation(75); //of Step 9 which takes 10 units
		
		/*
			Note: Rough figure only, refunds not included.
		*/

		var lastWeek_start = moment(fromDate, 'YYYYMMDD').subtract(13, 'days').format('YYYYMMDD');

		var currentIndex = 1;

		calculateSalesByDate(currentIndex, lastWeek_start)

		function calculateSalesByDate(index, mydate){

			runReportAnimation(74 + index);

			$.ajax({
			    type: 'GET',
				url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+mydate+'"]&endkey=["'+mydate+'"]',
				timeout: 10000,
				success: function(data) {

					var temp_totalOrders = 0;
					var temp_totalPaid = 0;
					var fancyDay = moment(mydate, 'YYYYMMDD').format('ddd');
					var fancyDate = moment(mydate, 'YYYYMMDD').format('MMM D');

					if(data.rows.length > 0){
						temp_totalOrders = data.rows[0].value.count;
						temp_totalPaid = data.rows[0].value.sum;
					}

					if(index <= 7){
						weeklyProgressLastWeek.push({
							"name": fancyDay+' ('+fancyDate+')',
							"value": temp_totalPaid
						});
					}
					else if(index <= 14){
						weeklyProgressThisWeek.push({
							"name": fancyDay+' ('+fancyDate+')',
							"value": temp_totalPaid
						});
					}


					//Next iterations
					if(index < 14){
						var nextDate = moment(fromDate, 'YYYYMMDD').subtract((13 - index), 'days').format('YYYYMMDD');
						calculateSalesByDate(index+1, nextDate);
					}
					else{
						singleClickWeeklyWeeklyGraphRenderer();
					}

				},
				error: function(data){
					completeErrorList.push({
					    "step": 9,
						"error": "Failed to calculate sales by different payment modes"
					});				

					//Skip and go to next step
					singleClickWeeklyWeeklyGraphRenderer(); 
					return '';						
				}
			});  
		}

	}

	//Step 11: Render Weekly Graph
	function singleClickWeeklyWeeklyGraphRenderer(){

		runReportAnimation(90); //of Step 10 which takes 14 units

		if(fromDate != toDate){
			//Skip and go to next step
			singleClickGenerateAllReports();
			return '';
		}
		else{
			window.localStorage.graphImageDataWeekly = '';
			window.localStorage.graphImageDataWeeklyBW = '';
			weeklyGraphBW();
		}

		function weeklyGraphBW(){

			var graph_labels = [];
			var graph_data = [];

			var graph_border = ["rgba(0, 0, 0, 1)"];
			var graph_border_last = ["rgba(144, 144, 144, 1)"];

			//This Weeks data
			var n = 0;
			while(weeklyProgressThisWeek[n]){
				graph_labels.push(weeklyProgressThisWeek[n].name);
				graph_data.push(parseInt(weeklyProgressThisWeek[n].value));

				n++;
			}

			//Last Weeks (exclude labels)
			var graph_data_last = [];
			var k = 0;
			while(weeklyProgressLastWeek[k]){
				graph_data_last.push(parseInt(weeklyProgressLastWeek[k].value));
				
				k++;
			}

			var ctx = document.getElementById("weeklyTrendLineChartBW").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: graph_labels,
			        datasets: [{
			            label: 'This Week',
			            data: graph_data,
			            fill: false,
			            borderColor: graph_border,
			            borderWidth: 2
			            
			        },{
			            label: 'Last Week',
			            data: graph_data_last,
			            fill: false,
			            borderColor: graph_border_last,
			            borderWidth: 2,
			            borderDash: [10,5]
			        }]
			    },
			    options: {	    	
			        scales: {
			            yAxes: [{
			            	display:true,
			                ticks: {
			                    beginAtZero:true,
			                    display: true
			                },
			                gridLines: {
		                    	display:true
		                	}
			            }],
			            xAxes: [{
			            	display:true,
			                ticks: {
			                    beginAtZero:true,
			                    display: true
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
				var temp_graph = myChart.toBase64Image();
				window.localStorage.graphImageDataWeeklyBW = temp_graph;

				weeklyGraphColored();			
			}
		}



		function weeklyGraphColored(){ //Colorfull Graph!

			var graph_labels = [];
			var graph_data = [];

			var graph_background = ["rgba(103, 210, 131, 0.2)"];
			var graph_background_last = ["rgba(255, 177, 0, 0.2)"];

			var graph_border = ["rgba(103, 210, 131, 1)"];
			var graph_border_last = ["rgba(255, 177, 0, 1)"];

			//This Weeks data
			var n = 0;
			while(weeklyProgressThisWeek[n]){
				graph_labels.push(weeklyProgressThisWeek[n].name);
				graph_data.push(parseInt(weeklyProgressThisWeek[n].value));

				n++;
			}


			//Last Weeks (exclude labels)
			var graph_data_last = [];
			var k = 0;
			while(weeklyProgressLastWeek[k]){
				graph_data_last.push(parseInt(weeklyProgressLastWeek[k].value));
				
				k++;
			}

			var ctx = document.getElementById("weeklyTrendLineChart").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: graph_labels,
			        datasets: [{
			            label: 'This Week',
			            data: graph_data,
			            borderColor: graph_border,
			            backgroundColor: graph_background,
			            borderWidth: 2
			            
			        },{
			            label: 'Last Week',
			            data: graph_data_last,
			            backgroundColor: graph_background_last,
			            borderColor: graph_border_last,
			            borderWidth: 2,
			            borderDash: [10,5]
			        }]
			    },
			    options: {	    	
			        scales: {
			            yAxes: [{
			            	display:true,
			                ticks: {
			                    beginAtZero:true,
			                    display: true
			                },
			                gridLines: {
		                    	display:true
		                	}
			            }],
			            xAxes: [{
			            	display:true,
			                ticks: {
			                    beginAtZero:true,
			                    display: true
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
				var temp_graph = myChart.toBase64Image();
				window.localStorage.graphImageDataWeekly = temp_graph;

				singleClickGenerateAllReports();
			}
		}
	}


	//Step 12: Final Reports Render Stage
	function singleClickGenerateAllReports(){


	    //PENDING --> TOTAL CALCULATED ROUND OFFFFF
	    console.log('PENDING API --> TOTAL CALCULATED ROUND OFFFFF')
	   

		runReportAnimation(95); //of Step 11 which completed the data processing

		var reportInfo_branch = 'IIT Madras';
		var reportInfo_admin = 'Sahadudheen';
		var reportInfo_time = '03:01 AM, 28-08-2018';
		var reportInfo_address = 'Zaitoon Multicuisine 1, Vantage Building, Mahatma Gandhi Road, Subramaniam Colony, Adyar, Chennai - 41';

		generateReportContentDownload();

		function generateReportContentDownload(){

			//To display weekly graph or not
			var hasWeeklyGraphAttached = false;
			if(window.localStorage.graphImageDataWeekly && window.localStorage.graphImageDataWeekly != ''){
				hasWeeklyGraphAttached = true;
			}

			var graphRenderSectionContent = '';
			var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

			var reportInfo_title = 'Sales Report of <b>'+fancy_from_date+'</b>';
			var temp_report_title = 'Sales Report of '+fancy_from_date;
			if(fromDate != toDate){
				fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
				var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

				reportInfo_title = 'Sales Report from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
				temp_report_title = 'Sales Report from '+fancy_from_date+' to '+fancy_to_date;
			}
		    else{ //Render graph only if report is for a day

		      if(hasWeeklyGraphAttached){

		      	var temp_image_name = reportInfo_branch+'_'+fromDate;
		      	temp_image_name = temp_image_name.replace(/\s/g,'');

		        graphRenderSectionContent = ''+
		          '<div class="summaryTableSectionHolder">'+
		          '<div class="summaryTableSection">'+
		             '<div class="tableQuickHeader">'+
		                '<h1 class="tableQuickHeaderText">WEEKLY SALES TREND</h1>'+
		             '</div>'+
		             '<div class="weeklyGraph">'+
		                '<img src="'+window.localStorage.graphImageDataWeekly+'" style="max-width: 90%">'+
		             '</div>'+
		          '</div>'+
		          '</div>';
		      }
		    }

		    var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;

		    //Quick Summary Content
		    var quickSummaryRendererContent = '';

		    var a = 0;
		    while(reportInfoExtras[a]){
		      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+reportInfoExtras[a].name+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(reportInfoExtras[a].value).toFixed(2)+'</td></tr>';
		      a++;
		    }


		    var b = 1; //first one contains total paid
		    while(completeReportInfo[b]){
		      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[b].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[b].type == 'NEGATIVE' && completeReportInfo[b].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[b].value).toFixed(2)+'</td></tr>';
		      b++;
		    }


		    //Sales by Billing Modes Content
		    var salesByBillingModeRenderContent = '';
		    var c = 0;
		    var billSharePercentage = 0;
		    while(detailedListByBillingMode[c]){
		      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
		      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
		      c++;
		    }

			//To display bills graph or not
			var hasBillsGraphAttached = false;
			if(window.localStorage.graphImageDataBills && window.localStorage.graphImageDataBills != '' && window.localStorage.graphImageDataBills != 'data:,'){
				hasBillsGraphAttached = true;
			}

		    var salesByBillingModeRenderContentFinal = '';
		    if(salesByBillingModeRenderContent != ''){

		    	if(hasBillsGraphAttached){
				      salesByBillingModeRenderContentFinal = ''+
				        '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           	'<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">SUMMARY BY BILLS</h1>'+
				           	'</div>'+
				           	'<div class="tableGraphRow">'+
						        '<div class="tableGraph_Graph"> <img src="'+window.localStorage.graphImageDataBills+'" width="200px"> </div>'+
						        '<div class="tableGraph_Table">'+	
					              '<table style="width: 100%">'+
					                 '<col style="width: 70%">'+
					                 '<col style="width: 30%">'+
					                 salesByBillingModeRenderContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+	
				        '</div>'+
				        '</div>';
				}
				else{
				      salesByBillingModeRenderContentFinal = ''+
				        '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">SUMMARY BY BILLS</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 salesByBillingModeRenderContent+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';				
				}
		    }


		    //Sales by Payment Types Content
		    var salesByPaymentTypeRenderContent = '';
		    var d = 0;
		    var paymentSharePercentage = 0;
		    while(detailedListByPaymentMode[d]){
		      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
		      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
		      d++;
		    }

			//To display payment graph or not
			var hasPaymentsGraphAttached = false;
			if(window.localStorage.graphImageDataPayments && window.localStorage.graphImageDataPayments != '' && window.localStorage.graphImageDataPayments != 'data:,'){
				hasPaymentsGraphAttached = true;
			}

		    var salesByPaymentTypeRenderContentFinal = '';
		    if(salesByPaymentTypeRenderContent != ''){

		    	if(hasPaymentsGraphAttached){
			      salesByPaymentTypeRenderContentFinal = ''+
			        '<div class="summaryTableSectionHolder">'+
			        '<div class="summaryTableSection">'+
			           	'<div class="tableQuickHeader">'+
			              '<h1 class="tableQuickHeaderText">SUMMARY BY PAYMENT</h1>'+
			           	'</div>'+
			           	'<div class="tableGraphRow">'+
					        '<div class="tableGraph_Graph"> <img src="'+window.localStorage.graphImageDataPayments+'" width="200px"> </div>'+
					        '<div class="tableGraph_Table">'+	
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 salesByPaymentTypeRenderContent+
				              '</table>'+
				           '</div>'+
				        '</div>'+
			        '</div>'+
			        '</div>';
			    }
			    else{
			    	salesByPaymentTypeRenderContentFinal = ''+
			        '<div class="summaryTableSectionHolder">'+
			        '<div class="summaryTableSection">'+
			           '<div class="tableQuickHeader">'+
			              '<h1 class="tableQuickHeaderText">SUMMARY BY PAYMENT</h1>'+
			           '</div>'+
			           '<div class="tableQuick">'+
			              '<table style="width: 100%">'+
			                 '<col style="width: 70%">'+
			                 '<col style="width: 30%">'+
			                 salesByPaymentTypeRenderContent+
			              '</table>'+
			           '</div>'+
			        '</div>'+
			        '</div>';
			    }
		    }

		    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://zaitoon.online/pos/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px;text-align:center}.factsBox{margin-right: 5px; width:18%; display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#aba9a9;font-style:italic;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:35%;display:block;text-align:center;float:right;position:absolute;top:20px;left:62%}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:55%;display:block;min-height:250px;}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
		    
		    var finalReport_downloadContent = cssData+
			    '<body>'+
			      '<div class="mainHeader">'+
			         '<div class="headerLeftBox">'+
			            '<div id="logo">'+
			               '<img src="https://zaitoon.online/pos/email_logo.png">'+
			            '</div>'+
			            '<p class="headerAddress">'+reportInfo_address+'</p>'+
			         '</div>'+
			         '<div class="headerRightBox">'+
			            '<h1 class="headerBranch">'+reportInfo_branch+'</h1>'+
			            '<p class="headerAdmin">'+reportInfo_admin+'</p>'+
			            '<p class="headerTimestamp">'+reportInfo_time+'</p>'+
			         '</div>'+
			      '</div>'+
			      '<div class="introFacts">'+
			         '<h1 class="reportTitle">'+reportInfo_title+'</h1>'+
			         '<div class="factsArea">'+
			            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
			            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netSalesWorth).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Sales</p></div>'+ 
			            '<div class="factsBox"><h1 class="factsBoxFigure">'+netGuestsCount+'</h1><p class="factsBoxBrief">Guests</p></div>'+ 
			            '<div class="factsBox"><h1 class="factsBoxFigure">'+completeReportInfo[0].count+'</h1><p class="factsBoxBrief">Bills</p></div>'+
			         '</div>'+
			      '</div>'+graphRenderSectionContent+
			      (hasWeeklyGraphAttached ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>' : '')+
			      '<div class="summaryTableSectionHolder">'+
			        '<div class="summaryTableSection">'+
			           '<div class="tableQuickHeader">'+
			              '<h1 class="tableQuickHeaderText">Quick Summary</h1>'+
			           '</div>'+
			           '<div class="tableQuick">'+
			              '<table style="width: 100%">'+
			                 '<col style="width: 70%">'+
			                 '<col style="width: 30%">'+
			                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Net Sales Worth</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
			                 quickSummaryRendererContent+
			                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Gross Sales</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value).toFixed(2)+'</td></tr>'+
			              '</table>'+
			           '</div>'+
			        '</div>'+
			      '</div>'+
			      '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+
			      salesByBillingModeRenderContentFinal+
			      salesByPaymentTypeRenderContentFinal+
			      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
			         '<p class="footerNote">care@zaitoon.online | www.zaitoon.online | support@accelerate.net.in</p>'+
			      '</div>'+
			    '</body>';

				var finalContent_EncodedDownload = encodeURI(finalReport_downloadContent);
				$('#reportActionButtonDownload').attr('data-hold', finalContent_EncodedDownload);

				var finalContent_EncodedText = encodeURI(fancy_report_title_name);
				$('#reportActionButtonDownload').attr('text-hold', finalContent_EncodedText);

				generateReportContentEmail();

		}

		function generateReportContentEmail(){

				runReportAnimation(97);

				//To display weekly graph or not
				var hasWeeklyGraphAttached = false;
				if(window.localStorage.graphImageDataWeekly && window.localStorage.graphImageDataWeekly != ''){
					hasWeeklyGraphAttached = true;
				}

				var graphRenderSectionContent = '';
				var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

				var reportInfo_title = 'Sales Report of <b>'+fancy_from_date+'</b>';
				var temp_report_title = 'Sales Report of '+fancy_from_date;
				if(fromDate != toDate){
					fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
					var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

					reportInfo_title = 'Sales Report from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
					temp_report_title = 'Sales Report from '+fancy_from_date+' to '+fancy_to_date;
				}
			    else{ //Render graph only if report is for a day

			      if(hasWeeklyGraphAttached){

			      	var temp_image_name = reportInfo_branch+'_'+fromDate;
			      	temp_image_name = temp_image_name.replace(/\s/g,'');

			        graphRenderSectionContent = ''+
			          '<div class="summaryTableSectionHolder">'+
			          '<div class="summaryTableSection">'+
			             '<div class="tableQuickHeader">'+
			                '<h1 class="tableQuickHeaderText">WEEKLY SALES TREND</h1>'+
			             '</div>'+
			             '<div class="weeklyGraph">'+
			                '<img src="https://zaitoon.online/pos/report_trend_images_repo/'+temp_image_name+'.png" style="max-width: 90%">'+
			             '</div>'+
			          '</div>'+
			          '</div>';
			      }
			    }

			    var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;

			    //Quick Summary Content
			    var quickSummaryRendererContent = '';

			    var a = 0;
			    while(reportInfoExtras[a]){
			      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+reportInfoExtras[a].name+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(reportInfoExtras[a].value).toFixed(2)+'</td></tr>';
			      a++;
			    }


			    var b = 1; //first one contains total paid
			    while(completeReportInfo[b]){
			      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[b].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[b].type == 'NEGATIVE' && completeReportInfo[b].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[b].value).toFixed(2)+'</td></tr>';
			      b++;
			    }


			    //Sales by Billing Modes Content
			    var salesByBillingModeRenderContent = '';
			    var c = 0;
			    var billSharePercentage = 0;
			    while(detailedListByBillingMode[c]){
			      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
			      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
			      c++;
			    }

				//To display bills graph or not
				var hasBillsGraphAttached = false;
				if(window.localStorage.graphImageDataBills && window.localStorage.graphImageDataBills != '' && window.localStorage.graphImageDataBills != 'data:,'){
					hasBillsGraphAttached = true;
				}

			    var salesByBillingModeRenderContentFinal = '';
			    if(salesByBillingModeRenderContent != ''){
					      salesByBillingModeRenderContentFinal = ''+
					        '<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">SUMMARY BY BILLS</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 '<col style="width: 70%">'+
					                 '<col style="width: 30%">'+
					                 salesByBillingModeRenderContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
					        '</div>';
			    }


			    //Sales by Payment Types Content
			    var salesByPaymentTypeRenderContent = '';
			    var d = 0;
			    var paymentSharePercentage = 0;
			    while(detailedListByPaymentMode[d]){
			      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
			      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
			      d++;
			    }

			    var salesByPaymentTypeRenderContentFinal = '';
			    if(salesByPaymentTypeRenderContent != ''){
				    	salesByPaymentTypeRenderContentFinal = ''+
				        '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">SUMMARY BY PAYMENT</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 salesByPaymentTypeRenderContent+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';
			    }

			    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://zaitoon.online/pos/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px;text-align:center}.factsBox{margin-right: 5px; width:18%; display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#aba9a9;font-style:italic;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:35%;display:block;text-align:center;float:right;position:absolute;top:20px;left:62%}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:55%;display:block;min-height:250px;}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
			    
			    var finalReport_emailContent = '<html>'+cssData+
				    '<body>'+
				      '<div class="mainHeader">'+
				         '<div class="headerLeftBox">'+
				            '<div id="logo">'+
				               '<img src="https://zaitoon.online/pos/email_logo.png">'+
				            '</div>'+
				            '<p class="headerAddress">'+reportInfo_address+'</p>'+
				         '</div>'+
				         '<div class="headerRightBox">'+
				            '<h1 class="headerBranch">'+reportInfo_branch+'</h1>'+
				            '<p class="headerAdmin">'+reportInfo_admin+'</p>'+
				            '<p class="headerTimestamp">'+reportInfo_time+'</p>'+
				         '</div>'+
				      '</div>'+
				      '<div class="introFacts">'+
				         '<h1 class="reportTitle">'+reportInfo_title+'</h1>'+
				         '<div class="factsArea">'+
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netSalesWorth).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Sales</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+netGuestsCount+'</h1><p class="factsBoxBrief">Guests</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+completeReportInfo[0].count+'</h1><p class="factsBoxBrief">Bills</p></div>'+
				         '</div>'+
				      '</div>'+graphRenderSectionContent+
				      (hasWeeklyGraphAttached ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>' : '')+
				      '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">Quick Summary</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Net Sales Worth</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
				                 quickSummaryRendererContent+
				                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Gross Sales</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value).toFixed(2)+'</td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				      '</div>'+
				      '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+
				      salesByBillingModeRenderContentFinal+
				      salesByPaymentTypeRenderContentFinal+
				      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
				         '<p class="footerNote">care@zaitoon.online | www.zaitoon.online | support@accelerate.net.in</p>'+
				      '</div>'+
				    '</body>'+
				    '<html>';

				var finalContent_EncodedEmail = encodeURI(finalReport_emailContent);
				$('#reportActionButtonEmail').attr('data-hold', finalContent_EncodedEmail);

				var myFinalCollectionText = {
					"reportTitle" : fancy_report_title_name,
					"imageName": reportInfo_branch+'_'+fromDate
				}

				var finalContent_EncodedText = encodeURI(JSON.stringify(myFinalCollectionText));
				$('#reportActionButtonEmail').attr('text-hold', finalContent_EncodedText);	

				generateReportContentPrint();		
		}

		function generateReportContentPrint(){

			runReportAnimation(99);

			var graphRenderSectionContent = '';
			var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

			var reportInfo_title = 'Sales Report of <b>'+fancy_from_date+'</b>';
			var temp_report_title = 'Sales Report of '+fancy_from_date;
			if(fromDate != toDate){
				fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
				var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

				reportInfo_title = 'Sales Report from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
				temp_report_title = 'Sales Report from '+fancy_from_date+' to '+fancy_to_date;
			}


		    //Quick Summary Content
		    var quickSummaryRendererContent = '';

		    var a = 0;
		    while(reportInfoExtras[a]){
		      quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+reportInfoExtras[a].name+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(reportInfoExtras[a].value).toFixed(2)+'</td></tr>';
		      a++;
		    }

		    var b = 1; //first one contains total paid
		    while(completeReportInfo[b]){
		      quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+completeReportInfo[b].name+'</td><td style="font-size: 11px; text-align: right">'+(completeReportInfo[b].type == 'NEGATIVE' && completeReportInfo[b].value != 0 ? '- ' : '')+'<span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[b].value).toFixed(2)+'</td></tr>';
		      b++;
		    }

		    var printSummaryAll = ''+
		    	'<div class="KOTContent">'+
		    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">OVERALL SUMMARY</h2>'+
			         '<table style="width: 100%">'+
			            '<col style="width: 85%">'+
			            '<col style="width: 15%">'+ 
			            '<tr><td style="font-size: 11px"><b>Net Sales Worth</b></td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
			            quickSummaryRendererContent+
			            '<tr><td style="font-size: 13px"><b>Gross Sales</b></td><td style="font-size: 13px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[0].value).toFixed(2)+'</td></tr>'+
			         '</table>'+
			    '</div>';

		    //Sales by Billing Modes Content
		    var printSummaryBillsContent = '';
		    var c = 0;
		    var billSharePercentage = 0;
		    while(detailedListByBillingMode[c]){
		      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
		      printSummaryBillsContent += '<tr><td style="font-size: 11px">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span style="font-style:italic; font-size: 60%; display: block;">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
		      c++;
		    }

		    var printSummaryBills = '';
		    if(printSummaryBillsContent != ''){
				printSummaryBills = ''+
			    	'<div class="KOTContent">'+
			    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">BILLING MODES</h2>'+
				         '<table style="width: 100%">'+
				            '<col style="width: 85%">'+
				            '<col style="width: 15%">'+ 
				            printSummaryBillsContent+
				         '</table>'+
				    '</div>';	
		    }


		    //Sales by Payment Types Content
		    var printSummaryPaymentContent = '';
		    var d = 0;
		    var paymentSharePercentage = 0;
		    while(detailedListByPaymentMode[d]){
		      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
		      printSummaryPaymentContent += '<tr><td style="font-size: 11px">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span style="font-style:italic; font-size: 60%; display: block;">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>'; 
		      d++;
		    }

		    var printSummaryPayment = '';
		    if(printSummaryPaymentContent != ''){
			    printSummaryPayment = ''+
			    	'<div class="KOTContent">'+
			    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">PAYMENT TYPES</h2>'+
				         '<table style="width: 100%">'+
				            '<col style="width: 85%">'+
				            '<col style="width: 15%">'+ 
				            printSummaryPaymentContent+
				         '</table>'+
				    '</div>';	
		    }


		    var printSummaryCounts = ''+
			    	'<div class="KOTContent">'+
			    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">OTHER DETAILS</h2>'+
				         '<table style="width: 100%">'+
				            '<col style="width: 85%">'+
				            '<col style="width: 15%">'+ 
				            '<tr><td style="font-size: 10px">Total Guests</td><td style="font-size: 13px">'+netGuestsCount+'</td></tr>'+
				            '<tr><td style="font-size: 10px">Total Bills</td><td style="font-size: 13px">'+completeReportInfo[0].count+'</td></tr>'+
				         '</table>'+
				    '</div>';




		    var cssData = '<head> <style type="text/css"> .KOTContent,.KOTHeader,.KOTNumberArea,.KOTSummary{width:100%;background-color:none}.subLabel,body{font-family:sans-serif}.KOTNumber,.invoiceNumber,.subLabel{letter-spacing:2px}#logo{min-height:60px;width:100%;border-bottom:2px solid #000}.KOTHeader,.KOTNumberArea{min-height:30px;padding:5px 0;border-bottom:1px solid #7b7b7b}.KOTContent{min-height:100px;font-size:11px;padding-top:6px;border-bottom:2px solid}.KOTSummary{font-size:11px;padding:5px 0;border-bottom:1px solid}.KOTContent td,.KOTContent table{border-collapse:collapse}.KOTContent td{border-bottom:1px dashed #444;padding:7px 0}.invoiceHeader,.invoiceNumberArea{padding:5px 0;border-bottom:1px solid #7b7b7b;width:100%;background-color:none}.KOTSpecialComments{min-height:20px;width:100%;background-color:none;padding:5px 0}.invoiceNumberArea{min-height:30px}.invoiceContent{min-height:100px;width:100%;background-color:none;font-size:11px;padding-top:6px;border-bottom:1px solid}.invoiceCharges{min-height:90px;font-size:11px;width:100%;background-color:none;padding:5px 0;border-bottom:2px solid}.invoiceCustomText,.invoicePaymentsLink{background-color:none;border-bottom:1px solid;width:100%}.invoicePaymentsLink{min-height:72px}.invoiceCustomText{padding:5px 0;font-size:12px;text-align:center}.subLabel{display:block;font-size:8px;font-weight:300;text-transform:uppercase;margin-bottom:5px}p{margin:0}.itemComments,.itemOldComments{font-style:italic;margin-left:10px}.serviceType{border:1px solid;padding:4px;font-size:12px;display:block;text-align:center;margin-bottom:8px}.tokenNumber{display:block;font-size:16px;font-weight:700}.billingAddress,.timeStamp{font-weight:300;display:block}.billingAddress{font-size:12px;line-height:1.2em}.mobileNumber{display:block;margin-top:8px;font-size:12px}.timeStamp{font-size:11px}.KOTNumber{font-size:15px;font-weight:700}.commentsSubText{font-size:12px;font-style:italic;font-weight:300;display:block}.invoiceNumber{font-size:15px;font-weight:700}.timeDisplay{font-size:75%;display:block}.rs{font-size:60%}.paymentSubText{font-size:10px;font-weight:300;display:block}.paymentSubHead{font-size:12px;font-weight:700;display:block}.qrCode{width:100%;max-width:120px;text-align:right}.addressContact,.addressText{color:gray;text-align:center}.addressText{font-size:10px;padding:5px 0}.addressContact{font-size:9px;padding:0 0 5px}.gstNumber{font-weight:700;font-size:10px}.attendantName,.itemQuantity{font-size:12px}#defaultScreen{position:fixed;left:0;top:0;z-index:100001;width:100%;height:100%;overflow:visible;background-image:url(../data/photos/brand/pattern.jpg);background-repeat:repeat;padding-top:100px}.attendantName{font-weight:300;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.itemComments,.itemQuantity{font-weight:700;display:block}.itemOldComments{display:block;text-decoration:line-through}.itemOldQuantity{font-size:12px;text-decoration:line-through;display:block} </style> </head>';

		    var data_custom_header_image = window.localStorage.bill_custom_header_image ? window.localStorage.bill_custom_header_image : '';

		    var finalReport_printContent = cssData +
		    	'<body>'+
			      '<div id="logo">'+
			        '<center><img src=\''+data_custom_header_image+'\'/></center>'+
			      '</div>'+
			      '<div class="KOTHeader" style="padding: 0; background: #444;">'+
			      	'<p style="text-align: center; font-size: 16px; font-weight: bold; text-transform: uppercase; padding-top: 6px; color: #FFF;">'+reportInfo_branch+'</p>'+
			      '</div>'+
			      '<div class="KOTNumberArea">'+
			         '<table style="width: 100%">'+
			            '<col style="width: 50%">'+
			            '<col style="width: 50%">'+
			            '<tr>'+
			               '<td style="vertical-align: top">'+
			               '<p>'+
			                  '<tag class="subLabel">Admin</tag>'+
			                  '<tag class="KOTNumber" style="font-size: 13; font-weight: 300; letter-spacing: unset;">'+reportInfo_admin+'</tag>'+
			               '</p>'+
			               '</td>'+
			               '<td style="vertical-align: top">'+
			                  '<p style=" text-align: right; float: right">'+
			                     '<tag class="subLabel">TIME STAMP</tag>'+
			                     '<tag class="timeStamp">'+reportInfo_time+'</tag>'+
			                  '</p>'+
			               '</td>'+
			            '</tr>'+
			         '</table>'+
			      '</div>'+
			      '<h1 style="margin: 6px 3px; padding-bottom: 5px; font-weight: 400; text-align: center; font-size: 15px; border-bottom: 2px solid; }">'+reportInfo_title+'</h1>'+
			   	  printSummaryAll+printSummaryBills+printSummaryPayment+printSummaryCounts+
			   	'</body>';

				var finalContent_EncodedPrint = encodeURI(finalReport_printContent);
				$('#reportActionButtonPrint').attr('data-hold', finalContent_EncodedPrint);

				runReportAnimation(100); //Done!
		}
	}	




	//Step 12: Final Render Stage - EMAIL
	function singleClickWeeklyFinalReportRender(graphImage){
		runReportAnimation(100); //of Step 11 which completed the data processing


		var reportInfo_branch = 'IIT Madras';
		var reportInfo_admin = 'Sahadudheen';
		var reportInfo_time = '03:01 AM, 28-08-2018';
		var reportInfo_address = 'Zaitoon Multicuisine 1, Vantage Building, Mahatma Gandhi Road, Subramaniam Colony, Adyar, Chennai - 41';


		if(graphImage && graphImage != ''){
			window.localStorage.graphImageDataWeekly = graphImage;
		}
		else{
			window.localStorage.graphImageDataWeekly = '';
		}


		var graphRenderSectionContent = '';
		var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

		var reportInfo_title = 'Sales Report of <b>'+fancy_from_date+'</b>';
		var temp_report_title = 'Sales Report of '+fancy_from_date;
		if(fromDate != toDate){
			fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
			var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

			reportInfo_title = 'Sales Report from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
			temp_report_title = 'Sales Report from '+fancy_from_date+' to '+fancy_to_date;
		}
	    else{ //Render graph only if report is for a day

	      if(graphImage){

	      	var temp_image_name = reportInfo_branch+'_'+fromDate;
	      	temp_image_name = temp_image_name.replace(/\s/g,'');

	        graphRenderSectionContent = ''+
	          '<div class="summaryTableSectionHolder">'+
	          '<div class="summaryTableSection">'+
	             '<div class="tableQuickHeader">'+
	                '<h1 class="tableQuickHeaderText">WEEKLY SALES TREND</h1>'+
	             '</div>'+
	             '<div class="weeklyGraph">'+
	                '<img src="https://zaitoon.online/pos/report_trend_images_repo/'+temp_image_name+'.png" style="max-width: 90%">'+
	             '</div>'+
	          '</div>'+
	          '</div>';
	      }
	    }

	    var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;


	    //Quick Summary Content
	    var quickSummaryRendererContent = '';

	    var a = 0;
	    while(reportInfoExtras[a]){
	      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+reportInfoExtras[a].name+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(reportInfoExtras[a].value).toFixed(2)+'</td></tr>';
	      a++;
	    }

	    //PENDING --> TOTAL CALCULATED ROUND OFFFFF
	    console.log('PENDING API --> TOTAL CALCULATED ROUND OFFFFF')

	    var b = 1; //first one contains total paid
	    while(completeReportInfo[b]){
	      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[b].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[b].type == 'NEGATIVE' && completeReportInfo[b].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[b].value).toFixed(2)+'</td></tr>';
	      b++;
	    }


	    //Sales by Billing Modes Content
	    var salesByBillingModeRenderContent = '';
	    var c = 0;
	    var billSharePercentage = 0;
	    while(detailedListByBillingMode[c]){
	      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
	      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
	      c++;
	    }

	    var salesByBillingModeRenderContentFinal = '';
	    if(salesByBillingModeRenderContent != ''){
	      salesByBillingModeRenderContentFinal = ''+
	        '<div class="summaryTableSectionHolder">'+
	        '<div class="summaryTableSection">'+
	           '<div class="tableQuickHeader">'+
	              '<h1 class="tableQuickHeaderText">SUMMARY BY BILLS</h1>'+
	           '</div>'+
	           '<div class="tableQuick">'+
	              '<table style="width: 100%">'+
	                 '<col style="width: 70%">'+
	                 '<col style="width: 30%">'+
	                 salesByBillingModeRenderContent+
	              '</table>'+
	           '</div>'+
	        '</div>'+
	        '</div>';
	    }

	    //Sales by Payment Types Content
	    var salesByPaymentTypeRenderContent = '';
	    var d = 0;
	    var paymentSharePercentage = 0;
	    while(detailedListByPaymentMode[d]){
	      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
	      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
	      d++;
	    }

	    var salesByPaymentTypeRenderContentFinal = '';
	    if(salesByPaymentTypeRenderContent != ''){
	      salesByPaymentTypeRenderContentFinal = ''+
	        '<div class="summaryTableSectionHolder">'+
	        '<div class="summaryTableSection">'+
	           '<div class="tableQuickHeader">'+
	              '<h1 class="tableQuickHeaderText">SUMMARY BY PAYMENT</h1>'+
	           '</div>'+
	           '<div class="tableQuick">'+
	              '<table style="width: 100%">'+
	                 '<col style="width: 70%">'+
	                 '<col style="width: 30%">'+
	                 salesByPaymentTypeRenderContent+
	              '</table>'+
	           '</div>'+
	        '</div>'+
	        '</div>';
	    }




	    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://zaitoon.online/pos/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px 25px;text-align:center}.factsBox{margin-right: 5px; width:20%;display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#aba9a9;font-style:italic;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:30%;display:inline-block;text-align:center;float:right;margin-top:30px}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:65%;display:inline-block}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
	    

	    var finalReport_emailContent = '<html>'+cssData+
		    '<body>'+
		      '<div class="mainHeader">'+
		         '<div class="headerLeftBox">'+
		            '<div id="logo">'+
		               '<img src="https://zaitoon.online/pos/email_logo.png">'+
		            '</div>'+
		            '<p class="headerAddress">'+reportInfo_address+'</p>'+
		         '</div>'+
		         '<div class="headerRightBox">'+
		            '<h1 class="headerBranch">'+reportInfo_branch+'</h1>'+
		            '<p class="headerAdmin">'+reportInfo_admin+'</p>'+
		            '<p class="headerTimestamp">'+reportInfo_time+'</p>'+
		         '</div>'+
		      '</div>'+
		      '<div class="introFacts">'+
		         '<h1 class="reportTitle">'+reportInfo_title+'</h1>'+
		         '<div class="factsArea">'+
		            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
		            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netSalesWorth).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Sales</p></div>'+ 
		            '<div class="factsBox"><h1 class="factsBoxFigure">'+netGuestsCount+'</h1><p class="factsBoxBrief">Guests</p></div>'+ 
		            '<div class="factsBox"><h1 class="factsBoxFigure">'+completeReportInfo[0].count+'</h1><p class="factsBoxBrief">Bills</p></div>'+
		         '</div>'+
		      '</div>'+graphRenderSectionContent+
		      '<div class="summaryTableSectionHolder">'+
		        '<div class="summaryTableSection">'+
		           '<div class="tableQuickHeader">'+
		              '<h1 class="tableQuickHeaderText">Quick Summary</h1>'+
		           '</div>'+
		           '<div class="tableQuick">'+
		              '<table style="width: 100%">'+
		                 '<col style="width: 70%">'+
		                 '<col style="width: 30%">'+
		                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Net Sales Worth</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
		                 quickSummaryRendererContent+
		                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Gross Sales</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value).toFixed(2)+'</td></tr>'+
		              '</table>'+
		           '</div>'+
		        '</div>'+
		      '</div>'+
		      salesByBillingModeRenderContentFinal+
		      salesByPaymentTypeRenderContentFinal+
		      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
		         '<p class="footerNote">care@zaitoon.online | www.zaitoon.online | support@accelerate.net.in</p>'+
		      '</div>'+
		    '</body>'+
		    '<html>';



	}	




	function singleClickLoadErrors(){
		//Display if any errors
		if(completeErrorList.length > 0){
			var renderError = '<b style="color: #ff5050">Report might contain Errors</b><br><i style="color: #ffb836; font-size: 80%">The following errors occured while generating the Report and it might show incorrect figures. Try again.</i><br><br>';
			var n = 0;
			while(completeErrorList[n]){
				renderError += 'E'+completeErrorList[n].step+': '+completeErrorList[n].error+'<br>';
				n++;
			}

			document.getElementById("singleClickReport_ErrorContent").style.display = 'block';
			document.getElementById("singleClickReport_ErrorContent").innerHTML = renderError;
		}
	}
}



//REPORT ACTIONS:

function reportActionEmail(){
	var mailContentEncoded = $('#reportActionButtonEmail').attr('data-hold');
	var mailContent = decodeURI(mailContentEncoded);

	var textContentEncoded = $('#reportActionButtonEmail').attr('text-hold');
	var textContent = JSON.parse(decodeURI(textContentEncoded));

	var graphImage = window.localStorage.graphImageDataWeekly ? window.localStorage.graphImageDataWeekly : '';

	var temp_image_name = (textContent.imageName).replace(/\s/g,'');

	var data = {
		"token": window.localStorage.loggedInAdmin,
		"name": "Sahad",
		"email": "sahadudheen.mp@gmail.com",
		"title": textContent.reportTitle,
		"content": mailContent,
		"image": graphImage,
		"imageName": temp_image_name
	}

	showLoading(10000, 'Mailing Report...');

	$.ajax({
		type: 'POST',
		url: 'https://www.zaitoon.online/services/possendreportasemail.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		timeout: 10000,
		success: function(data) {
			hideLoading();
			if(data.status){
				showToast('The Report has been mailed', '#27ae60');
			}
			else
			{
				showToast(data.error, '#e74c3c');
			}
		},
		error: function(data){
			hideLoading();
			showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
		}
	});	

}

function reportActionDownload(){
	var htmlContentEncoded = $('#reportActionButtonDownload').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	var textContentEncoded = $('#reportActionButtonDownload').attr('text-hold');
	var textContent = decodeURI(textContentEncoded);

	generatePDFReport(htmlContent, textContent);
}

function reportActionPrint(){
	var htmlContentEncoded = $('#reportActionButtonPrint').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	printPDFReport(htmlContent);
}
