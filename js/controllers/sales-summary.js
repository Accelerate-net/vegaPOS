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

	//Adjust server source db
	SELECTED_INVOICE_SOURCE_DB = 'accelerate_wounded';

    // LOGGED IN USER INFO
    var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
          
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
    }	

    if(loggedInStaffInfo.role == 'ADMIN' && loggedInStaffInfo.code == '9884179675'){
    	SELECTED_INVOICE_SOURCE_DB = 'accelerate_invoices';
    }
}


/* To generate EXCEL REPORTS */
function generateExcelReports(){
	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("excelReport_RenderArea").style.display = "block";
}

function downloadExcelReport(type){

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);	

	switch(type){

		case "OVERALL_REPORT":{

			showLoading(50000, 'Generating Report...');

			var masterRowsData = [];
			var master_serial_number = 1;
			var masterRowsHeadings = [];

			dateWiseExcelSummary(fromDate);

			function dateWiseExcelSummary(request_date){


				/*******************************************
					LEVEL - ONE (Process Overall Summary)
				********************************************/

					var excelReportData_Overall = [];
					excelReportTotalPaidAmount();

					/*
						Total Amount got Paid
						Total Charges Collected
						Total Discounts Offered
						Total Round Off issued
						Total Tips received
						and the final Turnover
					*/

					
					/*
						totalPaid = netSalesWorth + extras - discount - roundOff + tips
						
						So, 
							netSalesWorth --> totalPaid - extras - tips + discount + roundoff;
					*/

					var netSalesWorth = 0;


					//Step 1: Total Paid Amount
					function excelReportTotalPaidAmount(){	
						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_totalOrders = 0;
								var temp_totalPaid = 0;

								if(data.rows.length > 0){
									temp_totalOrders = data.rows[0].value.count;
									temp_totalPaid = data.rows[0].value.sum;
								}

								excelReportData_Overall.push({
									"name": "Total Sales",
									"value": temp_totalPaid
								});

								netSalesWorth = temp_totalPaid;

							
								//Step 2: Total Charges collected
								excelReportChargesCollected();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to fetch Total Paid Amount. Please contact Accelerate Support.', '#e74c3c');
							}
						}); 
					}//end - step 1




					//Step 2: Total Charges collected
					function excelReportChargesCollected(){

					    var requestData = {
					      "selector"  :{ 
					                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
					          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

						          	  var modes = data.docs[0].value;
						          	  modes.sort(); //alphabetical sorting 

						          	  if(modes.length == 0){
						          	  	//No billing parameters found, Skip to next step.
						          	  	excelReportDiscountsOffered();
						          	  	return '';
						          	  }


						          	  //For a given BILLING PARAMETER, the total Sales in the given DATE RANGE
									  $.ajax({
									    type: 'GET',
									    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[0].name+'","'+request_date+'"]&endkey=["'+modes[0].name+'","'+request_date+'"]',
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
													url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[0].name+'","'+request_date+'"]&endkey=["'+modes[0].name+'","'+request_date+'"]',
													timeout: 10000,
													success: function(data) {

														if(data.rows.length > 0){
														    temp_count += data.rows[0].value.count;
														    temp_sum += data.rows[0].value.sum;
														}

													    excelReportData_Overall.push({
															"name": modes[0].name,
															"value": temp_sum
														})

														netSalesWorth -= temp_sum;
													
												    	//Check if next mode exists...
												    	if(modes[1]){
												    		excelReportChargesCollectedCallback(1, modes);
												    	}
												    	else{
												    		//Step 3: Total Discount offered
												    		excelReportDiscountsOffered();
												    	}

													},
													error: function(data){
														hideLoading();
														showToast('System Error: Failed to calculate custom extras. Please contact Accelerate Support.', '#e74c3c');
													}
												}); 


									    },
									    error: function(data){
									    	hideLoading();
									    	showToast('System Error: Failed to calculate extra charges. Please contact Accelerate Support.', '#e74c3c');
									    }
									  });  

					          }
					          else{
					          	hideLoading();
					            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
					          }
					        }
					        else{
					          hideLoading();
					          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
					        }
					        
					      },
					      error: function(data) {
					      	hideLoading();
					        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
					      }

					    });	
					} //end step 2


					//step 2 - callback
					function excelReportChargesCollectedCallback(index, modes){

						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[index].name+'","'+request_date+'"]&endkey=["'+modes[index].name+'","'+request_date+'"]',
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
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[index].name+'","'+request_date+'"]&endkey=["'+modes[index].name+'","'+request_date+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
											    temp_sum += data.rows[0].value.sum;
											}

										    excelReportData_Overall.push({
												"name": modes[index].name,
												"value": temp_sum
											})

											netSalesWorth -= temp_sum;
											
									    	//Check if next mode exists...
									    	if(modes[index+1]){
									    		excelReportChargesCollectedCallback(index+1, modes);
									    	}
									    	else{
									    		//Step 3: Total Discount offered
									    		excelReportDiscountsOffered();
									    	}

										},
										error: function(data){
											hideLoading();
											showToast('System Error: Failed to calculate custom extras. Please contact Accelerate Support.', '#e74c3c');
										}
									}); 


						    },
						    error: function(data){
						    	hideLoading();
						    	showToast('System Error: Failed to calculate extra charges. Please contact Accelerate Support.', '#e74c3c');
						    }
						  }); 

					}


					//Step 3: Total Discount offered 					
					function excelReportDiscountsOffered(){

						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_discounts?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_discountedOrdersCount = 0;
								var temp_discountedOrdersSum = 0;

								if(data.rows.length > 0){
									temp_discountedOrdersCount = data.rows[0].value.count;
									temp_discountedOrdersSum = data.rows[0].value.sum;
								}


								excelReportData_Overall.push({
									"name": 'Discount',
									"value": temp_discountedOrdersSum
								})	

								netSalesWorth += temp_discountedOrdersSum;	
								
								//Step 4: Total Round Off made
								excelReportRoundOffMade();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to calculate discounts. Please contact Accelerate Support.', '#e74c3c');
							}
						});  	
					} //end - step 3


					//Step 4: Total Round Off made
					function excelReportRoundOffMade(){

						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_roundoff?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_roundOffCount = 0;
								var temp_roundOffSum = 0;

								if(data.rows.length > 0){
									temp_roundOffCount = data.rows[0].value.count;
									temp_roundOffSum = data.rows[0].value.sum;
								}
								
								excelReportData_Overall.push({
									"name": 'Waive Off',
									"value": temp_roundOffSum
								})	

								netSalesWorth += temp_roundOffSum;

								//Step 5: Total Tips received
								excelReportTipsReceived();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to calculate round off amounts. Please contact Accelerate Support.', '#e74c3c');
							}
						});  
					} //end - step 4


					//Step 5: Total Tips received
					function excelReportTipsReceived(){

						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_tips?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_tipsCount = 0;
								var temp_tipsSum = 0;

								if(data.rows.length > 0){
									temp_tipsCount = data.rows[0].value.count;
									temp_tipsSum = data.rows[0].value.sum;
								}

								excelReportData_Overall.push({
									"name": 'Tips',
									"value": temp_tipsSum
								})

								netSalesWorth -= temp_tipsSum;

								//Step 6: Total Refunds Issued
								excelReportRefundsIssued();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to calculate tips amounts. Please contact Accelerate Support.', '#e74c3c');
							}
						}); 
					} // end - step 5


					//Step 6: Total Refunds Issued
					function excelReportRefundsIssued(){

						//Refunded but NOT cancelled
						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_refundCount = 0;
								var temp_refundSum = 0;

								if(data.rows.length > 0){
									temp_refundCount = data.rows[0].value.count;
									temp_refundSum = data.rows[0].value.sum;
								}


								excelReportData_Overall.push({
									"name": 'Refunds',
									"value": temp_refundSum
								})


								/*
									Process Figures
								*/

								var grandTotalPaid = excelReportData_Overall[0].value;
								excelReportData_Overall[0].value = netSalesWorth; //Gross Sales
										

								excelReportData_Overall.push({
									"name": 'Net Sales',
									"value": grandTotalPaid - temp_refundSum
								})



								//Step 7: Process Report (Final)
								excelReportFinal();


								/*
									Cancelled and Refunded Orders (Neglected)
									Note: removed the concept of Refund on Cancelled Invoices 
								*/

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to calculate refund amount. Please contact Accelerate Support.', '#e74c3c');
							}
						});  

					} //end - step 6


					//Step 7: Process Report (Final)
					function excelReportFinal(){
						excelReportSummaryByBillingModes();
					}





				/*******************************************
					LEVEL - TWO (Summary by Billing Modes)
				********************************************/

				var excelReportData_BillingModes = [];


				function excelReportSummaryByBillingModes() {

					/*
							Summary - BILLING MODE wise
					*/

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

					          	if(modes.length == 0){
					          		//Skip and go to next level
					          		excelReportSummaryByPaymentModes();
					          		return '';
					          	}

					          	//For a given BILLING MODE, the total Sales in the given DATE RANGE
								$.ajax({
								    type: 'GET',
								    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[0].name+'","'+request_date+'"]&endkey=["'+modes[0].name+'","'+request_date+'"]',
								    timeout: 10000,
								    success: function(data) {
								    	
								    	var temp_sum = 0;

										if(data.rows.length > 0){
											temp_sum = data.rows[0].value.sum;
										}


										//Check for any refunds in this mode.
										$.ajax({
											type: 'GET',
										    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode_refundedamounts?startkey=["'+modes[0].name+'","'+request_date+'"]&endkey=["'+modes[0].name+'","'+request_date+'"]',
										    timeout: 10000,
											success: function(data) {

												var refunded_sum = 0;
												if(data.rows.length > 0){
													refunded_sum = data.rows[0].value.sum;
												}




												excelReportData_BillingModes.push({
											   		"name": modes[0].name,
											   		"value": temp_sum - refunded_sum
												})


										    	//Check if next mode exists...
										    	if(modes[1]){
										    		excelReportSummaryByBillingModesCallback(1, modes);
										    	}
										    	else{

													//Process Figures
										    		var billingModesGrandTotal = 0;
													for(var i = 0; i < excelReportData_BillingModes.length; i++){
													    billingModesGrandTotal += excelReportData_BillingModes[i].value;
													}

													excelReportData_BillingModes.push({
														"name": "Total by Billing Modes",
														"value": billingModesGrandTotal
												   	})


										    		//Go to next LEVEL THREE
										    		excelReportSummaryByPaymentModes();
										    	}


											},
											error: function(data){
												document.getElementById("summaryRender_billingMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';													    	
											}
										});  



								    },
								    error: function(data){
								    	hideLoading();
								    	showToast('System Error: Failed to build billing mode summary. Please contact Accelerate Support.', '#e74c3c');	
								    }
								});  
				          }
				        }
				      },
				      error: function(data){
				      	hideLoading();
				      	showToast('System Error: Failed to read billing modes data. Please contact Accelerate Support.', '#e74c3c');
				      }

				    });

				}


				function excelReportSummaryByBillingModesCallback(index, modes){

								$.ajax({
								    type: 'GET',
								    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+request_date+'"]&endkey=["'+modes[index].name+'","'+request_date+'"]',
								    timeout: 10000,
								    success: function(data) {
								    	
								    	var temp_sum = 0;

										if(data.rows.length > 0){
											temp_sum = data.rows[0].value.sum;
										}



										//Check for any refunds in this mode.
										$.ajax({
											type: 'GET',
										    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode_refundedamounts?startkey=["'+modes[index].name+'","'+request_date+'"]&endkey=["'+modes[index].name+'","'+request_date+'"]',
										    timeout: 10000,
											success: function(data) {

												var refunded_sum = 0;
												if(data.rows.length > 0){
													refunded_sum = data.rows[0].value.sum;
												}


												excelReportData_BillingModes.push({
											   		"name": modes[index].name,
											   		"value": temp_sum - refunded_sum
												})


										    	//Check if next mode exists...
										    	if(modes[index+1]){
										    		excelReportSummaryByBillingModesCallback(index+1, modes);
										    	}
										    	else{

													//Process Figures
										    		var billingModesGrandTotal = 0;
													for(var i = 0; i < excelReportData_BillingModes.length; i++){
													    billingModesGrandTotal += excelReportData_BillingModes[i].value;
													}

													excelReportData_BillingModes.push({
														"name": "Total by Billing Modes",
														"value": billingModesGrandTotal
												   	})



										    		//Go to next LEVEL THREE
										    		excelReportSummaryByPaymentModes();
										    	}


											},
											error: function(data){
												document.getElementById("summaryRender_billingMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';													    	
											}
										});  



								    },
								    error: function(data){
								    	hideLoading();
								    	showToast('System Error: Failed to build billing mode summary. Please contact Accelerate Support.', '#e74c3c');
								    }
								});  	
				}




				/**********************************************
					LEVEL - THREE (Summary by Payment Modes)
				***********************************************/

				var excelReportData_PaymentModes = [];

				function excelReportSummaryByPaymentModes() {

					/*
							Summary - PAYMENT MODE wise
					*/

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

					          	if(modes.length == 0){
					          		//Skip, go to next level FOUR
					          		levelFour();
					          		return '';
					          	}

					          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
								  $.ajax({
								    type: 'GET',
								    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[0].code+'","'+request_date+'"]&endkey=["'+modes[0].code+'","'+request_date+'"]',
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
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[0].code+'","'+request_date+'"]&endkey=["'+modes[0].code+'","'+request_date+'"]',
												timeout: 10000,
												success: function(data) {

													if(data.rows.length > 0){
													    temp_count += data.rows[0].value.count;
													    temp_sum += data.rows[0].value.sum;
													}




													//Check if any refunds issued 
													$.ajax({
														type: 'GET',
														url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_refundedamounts?startkey=["'+modes[0].code+'","'+request_date+'"]&endkey=["'+modes[0].code+'","'+request_date+'"]',
														timeout: 10000,
														success: function(data) {

															var refund_amount = 0;
															if(data.rows.length > 0){
															    refund_amount = data.rows[0].value.sum;
															}


												    		excelReportData_PaymentModes.push({
														   		"name": modes[0].name,
														   		"value": temp_sum - refund_amount
														   	})
												    											

													    	//Check if next mode exists...
													    	if(modes[1]){
													    		excelReportSummaryByPaymentModesCallback(1, modes);
													    	}
													    	else{

													    		//Process Figures
													    		var paymentGrandTotal = 0;
													    		for(var i = 0; i < excelReportData_PaymentModes.length; i++){
													    			paymentGrandTotal += excelReportData_PaymentModes[i].value;
													    		}

													    		excelReportData_PaymentModes.push({
															   		"name": "Total by Payment Modes",
															   		"value": paymentGrandTotal
															   	})


													    		//Go to next LEVEL FOUR
													    		levelFour();
													    	}


														},
														error: function(data){
															document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
														}
													}); 




												},
												error: function(data){
													hideLoading();
													showToast('System Error: Failed to build payment mode summary. Please contact Accelerate Support.', '#e74c3c');
												}
											}); 


								    },
								    error: function(data){
								    	hideLoading();
								    	showToast('System Error: Failed to build billing mode summary. Please contact Accelerate Support.', '#e74c3c');
								    }
								  });  

				          }
				          else{
				          		hideLoading();
				            	showToast('Not Found Error: Billing Payment data not found. Please contact Accelerate Support.', '#e74c3c');
				          }
				        }
				        else{
				        	hideLoading();
				          	showToast('Not Found Error: Billing Payment data not found. Please contact Accelerate Support.', '#e74c3c');
				        }
				        
				      },
				      error: function(data) {
				      	hideLoading();
				        showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
				      }

				    });

				}

				
				function excelReportSummaryByPaymentModesCallback(index, modes){

					  $.ajax({
					    type: 'GET',
					    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[index].code+'","'+request_date+'"]&endkey=["'+modes[index].code+'","'+request_date+'"]',
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
									url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[index].code+'","'+request_date+'"]&endkey=["'+modes[index].code+'","'+request_date+'"]',
									timeout: 10000,
									success: function(data) {

										if(data.rows.length > 0){
										    temp_count += data.rows[0].value.count;
										    temp_sum += data.rows[0].value.sum;
										}



													//Check if any refunds issued 
													$.ajax({
														type: 'GET',
														url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_refundedamounts?startkey=["'+modes[index].code+'","'+request_date+'"]&endkey=["'+modes[index].code+'","'+request_date+'"]',
														timeout: 10000,
														success: function(data) {

															var refund_amount = 0;
															if(data.rows.length > 0){
															    refund_amount = data.rows[0].value.sum;
															}


												    		excelReportData_PaymentModes.push({
														   		"name": modes[index].name,
														   		"value": temp_sum - refund_amount
														   	})
												    											

													    	//Check if next mode exists...
													    	if(modes[index+1]){
													    		excelReportSummaryByPaymentModesCallback(index+1, modes);
													    	}
													    	else{

													    		//Process Figures
													    		var paymentGrandTotal = 0;
													    		for(var i = 0; i < excelReportData_PaymentModes.length; i++){
													    			paymentGrandTotal += excelReportData_PaymentModes[i].value;
													    		}

													    		excelReportData_PaymentModes.push({
															   		"name": "Total by Payment Modes",
															   		"value": paymentGrandTotal
															   	})


													    		//Go to next LEVEL FOUR
													    		levelFour();
													    	}


														},
														error: function(data){
															document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
														}
													}); 

									},
									error: function(data){
										hideLoading();
										showToast('System Error: Failed to build payment mode summary. Please contact Accelerate Support.', '#e74c3c');
									}
								}); 


					    },
					    error: function(data){
					    	hideLoading();
					    	showToast('System Error: Failed to build payment mode summary. Please contact Accelerate Support.', '#e74c3c');
					    }
					  }); 

				}


				/**********************************************
					LEVEL - FOUR (Final Call)
				***********************************************/
				function levelFour(){

					var summary_row_data_basic = [
						master_serial_number, //Sl No.
						moment(request_date, 'YYYYMMDD').format('DD-MM-YYYY'), //date
						moment(request_date, 'YYYYMMDD').format('dddd') //day
					]

					if(master_serial_number == 1){ //only on the first iteration
						masterRowsHeadings = ["Sl No.", "Date", "Day"];
					}

					var summary_row_data_sales = [];
					for(var i = 0; i < excelReportData_Overall.length; i++){
						summary_row_data_sales.push(excelReportData_Overall[i].value);

						if(master_serial_number == 1){ //only on the first iteration
							masterRowsHeadings.push(excelReportData_Overall[i].name);
						}
					}

					var summary_row_data_billing = [];
					for(var i = 0; i < excelReportData_BillingModes.length; i++){
						summary_row_data_billing.push(excelReportData_BillingModes[i].value);
						
						if(master_serial_number == 1){ //only on the first iteration
							masterRowsHeadings.push(excelReportData_BillingModes[i].name);
						}
					}

					var summary_row_data_payment = [];
					for(var i = 0; i < excelReportData_PaymentModes.length; i++){
						summary_row_data_payment.push(excelReportData_PaymentModes[i].value);
					
						if(master_serial_number == 1){ //only on the first iteration
							masterRowsHeadings.push(excelReportData_PaymentModes[i].name);
						}
					}

					var summary_row_data_final = summary_row_data_basic.concat(summary_row_data_sales);
					summary_row_data_final = summary_row_data_final.concat(summary_row_data_billing);
					summary_row_data_final = summary_row_data_final.concat(summary_row_data_payment);

					masterRowsData.push(summary_row_data_final);

					if(request_date < toDate){ //next date exists
						//iterate to next date
						var next_date = moment(request_date, "YYYYMMDD").add(1, 'days').format("YYYYMMDD");
						
						master_serial_number++;
						dateWiseExcelSummary(next_date);
					}
					else{
						//proceed to report generation
						hideLoading();
						showToast('Sales Summary generated successfully!', '#27ae60');

						generateExcel();
					}

				}




				//generate report
				function generateExcel(){

				      		var main_header_title_nulls = [];
				      		var q = 0;
				      		while(masterRowsData[q]){
				      			main_header_title_nulls.push("");
				      			q++;
				      		}

							var report_date_range = moment(fromDate, 'YYYYMMDD').format('DD-MM-YYYY');
							var report_date_title = ' on ' + moment(fromDate, 'YYYYMMDD').format('D MMM, YYYY');
							if(fromDate != toDate){
								report_date_range += '_to_' + moment(toDate, 'YYYYMMDD').format('DD-MM-YYYY');
								report_date_title = ' from ' + moment(fromDate, 'YYYYMMDD').format('D MMM, YYYY') + ' to ' + moment(toDate, 'YYYYMMDD').format('D MMM, YYYY');
							}


				      		var temp_branch_name = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : 'UNKNOWN_BRANCH';
				      		var temp_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : 'UNKNOWN_CLIENT'; 

				      		temp_branch_name = temp_branch_name.toUpperCase();
				      		temp_client_name = temp_client_name.toUpperCase();
				      		report_date_title = report_date_title.toUpperCase();

							var header = []; //main head
							header.push(["SALES SUMMARY - " + temp_client_name +" "+ temp_branch_name + report_date_title].concat(main_header_title_nulls));
							


							//Sub Headings
							var sub_heading = ["Date", "", ""];
							for(var a = 0; a < excelReportData_Overall.length; a++){
								if(a == 0)
									sub_heading.push("Overall Summary");
								else
									sub_heading.push("");
							}

							for(var a = 0; a < excelReportData_BillingModes.length; a++){
								if(a == 0)
									sub_heading.push("Summary by Billing Modes");
								else
									sub_heading.push("");
							}

							for(var a = 0; a < excelReportData_PaymentModes.length; a++){
								if(a == 0)
									sub_heading.push("Summary by Payment Modes");
								else
									sub_heading.push("");
							}



							header.push(sub_heading);
							header.push(masterRowsHeadings);


							var data = header.concat(masterRowsData); //all other data


							/* CELL MERGES */

							var mergeList = [];
							
							var mainHeadingMergeIndex = header[1].length - 1;
							var mainHeadingMergeRange = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1", "AA1", "AB1", "AC1", "AD1", "AE1", "AF1", "AG1", "AH1", "AI1", "AJ1"];
							mergeList[0] = XLSX.utils.decode_range("A1:"+mainHeadingMergeRange[mainHeadingMergeIndex]);
							
							//A1.s = {fill:{fgColor: {rgb:"86BC25"}}};

							var subHeadingMergeRange = ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2", "L2", "M2", "N2", "O2", "P2", "Q2", "R2", "S2", "T2", "U2", "V2", "W2", "X2", "Y2", "Z2", "AA2", "AB2", "AC2", "AD2", "AE2", "AF2", "AG2", "AH2", "AI2", "AJ2"];
							
							mergeList[1] = XLSX.utils.decode_range("A2:C2");
							
							var overall_end_index = 3 + (excelReportData_Overall.length - 1);
							mergeList[2] = XLSX.utils.decode_range("D2:" + subHeadingMergeRange[overall_end_index]);

							var billing_end_index = 3 + (excelReportData_Overall.length) + (excelReportData_BillingModes.length - 1);
							mergeList[3] = XLSX.utils.decode_range(subHeadingMergeRange[overall_end_index + 1] +':'+ subHeadingMergeRange[billing_end_index]);
						
							var payments_end_index = 3 + (excelReportData_Overall.length) + (excelReportData_BillingModes.length) + (excelReportData_PaymentModes.length - 1);
							mergeList[4] = XLSX.utils.decode_range(subHeadingMergeRange[billing_end_index + 1] +':'+ subHeadingMergeRange[payments_end_index]);
							

							/* generate worksheet */
							var ws = XLSX.utils.aoa_to_sheet(data);

							/* add merges */
							if(!ws['!merges']) ws['!merges'] = [];

							for(var w = 0; w < mergeList.length; w++){
								ws['!merges'].push(mergeList[w]);
							}
							
							

							/* generate workbook */
							var wb = XLSX.utils.book_new();
							XLSX.utils.book_append_sheet(wb, ws, "Sales Summary");

							/* generate file and download */
							const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
							saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sales_summary_"+temp_client_name.toLowerCase()+"_"+temp_branch_name.toLowerCase()+"_"+report_date_range+".xlsx");
							

				}



			}

			break;

		} // end - OVERALL_SUMMARY



		case "INVOICE_REPORT":{

			showLoading(50000, 'Generating Report...');

		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
		          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

			          	var params = data.docs[0].value;

			          	dateWiseAllInvoicesExcel(fromDate, toDate, params);	

		          }
		          else{
		            hideLoading();
		            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
		          }
		        }
		        else{
		          hideLoading();
		          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
		        }
		        
		      },
		      error: function(data) {
		      	hideLoading();
		        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
		      }

		    });


					

			function dateWiseAllInvoicesExcel(request_date_start, request_date_end, billingParameters){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/fetchall?startkey=["'+request_date_start+'"]&endkey=["'+request_date_end+'"]&descending=false&include_docs=true',
					timeout: 10000,
					success: function(data) {
						
						var resultsList = data.rows;
						var invoiceList = [];

						if(resultsList.length == 0){
							hideLoading();
							showToast('Warning: There are no invoices found on the given dates.', '#e67e22');
							return "";
						}


			            resultsList.sort(function(doc1, doc2) { //sort by bill number
							if (doc1.id < doc2.id)
    							return -1;
  
  							if (doc1.id > doc2.id)
    							return 1;
  
  							return 0;
			            });

				      	var n = 0;
				      	while(resultsList[n]){ //iterating through each invoice

				      		//Get formatted cart items
				      		var cart_items_formatted = '';
				      		var sub_total = 0;
				      		for(var i = 0; i < resultsList[n].doc.cart.length; i++){

				      			var current_item = resultsList[n].doc.cart[i];
				      			var beautified_item = current_item.name;

				      			sub_total += current_item.price * current_item.qty;

				      			if(current_item.isCustom){
				      				beautified_item += ' ('+current_item.variant+')';
				      			}

				      			beautified_item += ' x '+ current_item.qty;

				      			if(cart_items_formatted == ''){
				      				cart_items_formatted = beautified_item;
				      			}
				      			else{
				      				cart_items_formatted += ', ' + beautified_item;
				      			}
				      		}



				      		//Get extras
				      		var all_extras = [];
				      		for(var i = 0; i < resultsList[n].doc.extras.length; i++){
				      			all_extras[resultsList[n].doc.extras[i].name] = resultsList[n].doc.extras[i].amount;
				      		}

				      		//Get custom extras, if any.
				      		if(resultsList[n].doc.customExtras){
				      			if(resultsList[n].doc.customExtras.amount != 0){
				      				all_extras[resultsList[n].doc.customExtras.type] += resultsList[n].doc.customExtras.amount;
				      			}
				      		}

				      		var invoice_info_extras = [];
				      		var m = 0;
				      		while(billingParameters[m]){
				      			if(all_extras[billingParameters[m].name] && all_extras[billingParameters[m].name] != ''){
				      				invoice_info_extras.push(all_extras[billingParameters[m].name]);
				      			}
				      			else{
				      				invoice_info_extras.push(0);
				      			}
				      			m++;
				      		}

				      		
				      		var invoice_info_basic = [
				      			n + 1, //Sl No.
				      			resultsList[n].doc.billNumber, //Bill Number
				      			resultsList[n].doc.date, //Invoice Date
				      			moment(resultsList[n].doc.date, 'DD-MM-YYYY').format('dddd'), //Day
				      			moment(resultsList[n].doc.timeBill, 'hhmm').format('hh:mm A'), //Time
				      			resultsList[n].doc.orderDetails.mode, //Billing Mode
				      			resultsList[n].doc.orderDetails.modeType, //Type of Mode (DINE, PARCEL etc.)
				      			cart_items_formatted, //items list
				      			sub_total //sub_total
				      		];

				      		var invoice_info_payment = [
				      			resultsList[n].doc.discount.amount ? resultsList[n].doc.discount.amount : 0, //Discounts 
				      			resultsList[n].doc.calculatedRoundOff ? resultsList[n].doc.calculatedRoundOff : 0, //Round offs
				      			resultsList[n].doc.payableAmount, //payable amount
				      			resultsList[n].doc.totalAmountPaid, //amount paid
				      			resultsList[n].doc.paymentMode, //mode of payment
				      			resultsList[n].doc.refundDetails ? resultsList[n].doc.refundDetails.amount : 0, //refunded amounts
				      			resultsList[n].doc.refundDetails ? (parseFloat((resultsList[n].doc.totalAmountPaid - resultsList[n].doc.refundDetails.amount)).toFixed(2)) : resultsList[n].doc.totalAmountPaid //gross amount
				      		];

				      		var invoice_info_formatted = invoice_info_basic.concat(invoice_info_extras);
				      		invoice_info_formatted = invoice_info_formatted.concat(invoice_info_payment);

				      		invoiceList.push(invoice_info_formatted);

				      		if(n == resultsList.length - 1){ //last iteration

				      			hideLoading();
				      			showToast('Invoice Summary generated successfully!', '#27ae60');

				      			generateExcel(invoiceList, billingParameters);
				      		}

				      		n++;
				      	}


				      	function generateExcel(invoiceData, billingParameters){

				      		var main_header_title_nulls = []; 
				      		var extras_header_titles = [];
				      		var q = 0;
				      		while(billingParameters[q]){
				      			extras_header_titles.push(billingParameters[q].name + ' (' + (billingParameters[q].unit == 'PERCENTAGE' ? billingParameters[q].value + '%' : 'Rs. '+billingParameters[q].value)+ ')');
				      			main_header_title_nulls.push("");
				      			q++;
				      		}

							var report_date_range = request_date_start;
							var report_date_title = ' on ' + moment(request_date_start, 'YYYYMMDD').format('D MMM, YYYY');
							if(request_date_start != request_date_end){
								report_date_range += '_to_' + request_date_end;
								report_date_title = ' from ' + moment(request_date_start, 'YYYYMMDD').format('D MMM, YYYY') + ' to ' + moment(request_date_end, 'YYYYMMDD').format('D MMM, YYYY');
							}


				      		var temp_branch_name = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : 'UNKNOWN_BRANCH';
				      		var temp_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : 'UNKNOWN_CLIENT'; 

				      		temp_branch_name = temp_branch_name.toUpperCase();
				      		temp_client_name = temp_client_name.toUpperCase();
				      		report_date_title = report_date_title.toUpperCase();

							var header = [
							  ["INVOICE SUMMARY - " + temp_client_name +" "+ temp_branch_name + report_date_title, "", "", "", "", "", "", "", "", ""].concat(main_header_title_nulls.concat(["", "", "", "", "", "", ""])),
							  ["Sl. No.", "Invoice No.", "Date", "Day", "Time", "Billing Mode", "Type", "Items", "Sub Total"].concat(extras_header_titles.concat(["Discount", "Waive Off", "Payable Amount", "Amount Paid", "Mode of Payment", "Refunds", "Gross Amount"]))
							];

							var data = header.concat(invoiceData);

							/* merge cells A1:I1 */
							var mergeBoundaryIndex = header[1].length - 1;
							var mergeBoundary = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1", "AA1", "AB1", "AC1", "AD1", "AE1", "AF1", "AG1", "AH1", "AI1", "AJ1"];
							var merge = XLSX.utils.decode_range("A1:"+mergeBoundary[mergeBoundaryIndex]);

							/* generate worksheet */
							var ws = XLSX.utils.aoa_to_sheet(data);

							/* add merges */
							if(!ws['!merges']) ws['!merges'] = [];
							ws['!merges'].push(merge);

							/* generate workbook */
							var wb = XLSX.utils.book_new();
							XLSX.utils.book_append_sheet(wb, ws, "All Invoices");

							/* generate file and download */
							const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
							saveAs(new Blob([wbout], { type: "application/octet-stream" }), "invoice_summary_"+temp_client_name.toLowerCase()+"_"+temp_branch_name.toLowerCase()+"_"+report_date_range+".xlsx");
							

				      	}

					},
					error: function(data){
						hideLoading();
						showToast('System Error: Unable to read Invoices data. Please contact Accelerate Support.', '#e74c3c');
					}
				});  

			}

			break;
		} // end - INVOICE_REPORT


		case "BILL_CANCELLATIONS":{

			showLoading(50000, 'Generating Report...');

		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
		          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

			          	var params = data.docs[0].value;

			          	dateWiseAllInvoicesExcel(fromDate, toDate, params);	

		          }
		          else{
		            hideLoading();
		            showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
		          }
		        }
		        else{
		          hideLoading();
		          showToast('Not Found Error: Billing Parameters data not found. Please contact Accelerate Support.', '#e74c3c');
		        }
		        
		      },
		      error: function(data) {
		      	hideLoading();
		        showToast('System Error: Unable to read Parameters Modes data. Please contact Accelerate Support.', '#e74c3c');
		      }

		    });


					

			function dateWiseAllInvoicesExcel(request_date_start, request_date_end, billingParameters){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-summary/_view/fetchall?startkey=["'+request_date_start+'"]&endkey=["'+request_date_end+'"]&descending=false&include_docs=true',
					timeout: 10000,
					success: function(data) {
						
						var resultsList = data.rows;
						var invoiceList = [];
						
						if(resultsList.length == 0){
							hideLoading();
							showToast('Warning: There are no cancelled invoices found on the given dates.', '#e67e22');
							return "";
						}

			            resultsList.sort(function(doc1, doc2) { //sort by bill number
							if (doc1.id < doc2.id)
    							return -1;
  
  							if (doc1.id > doc2.id)
    							return 1;
  
  							return 0;
			            });

				      	var n = 0;
				      	while(resultsList[n]){ //iterating through each invoice

				      		//Get formatted cart items
				      		var cart_items_formatted = '';
				      		var sub_total = 0;
				      		for(var i = 0; i < resultsList[n].doc.cart.length; i++){

				      			var current_item = resultsList[n].doc.cart[i];
				      			var beautified_item = current_item.name;

				      			sub_total += current_item.price * current_item.qty;

				      			if(current_item.isCustom){
				      				beautified_item += ' ('+current_item.variant+')';
				      			}

				      			beautified_item += ' x '+ current_item.qty;

				      			if(cart_items_formatted == ''){
				      				cart_items_formatted = beautified_item;
				      			}
				      			else{
				      				cart_items_formatted += ', ' + beautified_item;
				      			}
				      		}


				      		//Get extras
				      		var all_extras = [];
				      		for(var i = 0; i < resultsList[n].doc.extras.length; i++){
				      			all_extras[resultsList[n].doc.extras[i].name] = resultsList[n].doc.extras[i].amount;
				      		}

				      		//Get custom extras, if any.
				      		if(resultsList[n].doc.customExtras){
				      			if(resultsList[n].doc.customExtras.amount != 0){
				      				all_extras[resultsList[n].doc.customExtras.type] += resultsList[n].doc.customExtras.amount;
				      			}
				      		}

				      		var invoice_info_extras = [];
				      		var m = 0;
				      		while(billingParameters[m]){
				      			if(all_extras[billingParameters[m].name] && all_extras[billingParameters[m].name] != ''){
				      				invoice_info_extras.push(all_extras[billingParameters[m].name]);
				      			}
				      			else{
				      				invoice_info_extras.push(0);
				      			}
				      			m++;
				      		}

				      		
				      		var invoice_info_basic = [
				      			n + 1, //Sl No.
				      			resultsList[n].doc.billNumber, //Bill Number
				      			resultsList[n].doc.date, //Invoice Date
				      			moment(resultsList[n].doc.date, 'DD-MM-YYYY').format('dddd'), //Day
				      			moment(resultsList[n].doc.cancelDetails.timeCancel, 'hhmm').format('hh:mm A'), //Time
				      			resultsList[n].doc.orderDetails.mode, //Billing Mode
				      			resultsList[n].doc.orderDetails.modeType, //Type of Mode (DINE, PARCEL etc.)
				      			cart_items_formatted, //items list
				      			resultsList[n].doc.cancelDetails.status == 5 ? "Unsettled" : "Settled",
				      			resultsList[n].doc.cancelDetails.cancelledBy, //cancelled by
				      			resultsList[n].doc.cancelDetails.reason, // reason for cancellation
				      			resultsList[n].doc.cancelDetails.comments, //comments
				      			sub_total //sub_total
				      		];

				      		var invoice_info_payment = [
				      			resultsList[n].doc.discount.amount ? resultsList[n].doc.discount.amount : 0, //Discounts 
				      			resultsList[n].doc.calculatedRoundOff ? resultsList[n].doc.calculatedRoundOff : 0, //Round offs
				      			resultsList[n].doc.payableAmount, //payable amount
				      			resultsList[n].doc.totalAmountPaid, //amount paid
				      			resultsList[n].doc.paymentMode, //mode of payment
				      			resultsList[n].doc.refundDetails ? resultsList[n].doc.refundDetails.amount : 0, //refunded amounts
				      			resultsList[n].doc.refundDetails ? (parseFloat((resultsList[n].doc.totalAmountPaid - resultsList[n].doc.refundDetails.amount)).toFixed(2)) : resultsList[n].doc.totalAmountPaid //gross amount
				      		];

				      		var invoice_info_formatted = invoice_info_basic.concat(invoice_info_extras);
				      		invoice_info_formatted = invoice_info_formatted.concat(invoice_info_payment);

				      		invoiceList.push(invoice_info_formatted);

				      		if(n == resultsList.length - 1){ //last iteration

				      			hideLoading();
				      			showToast('Cancelled Invoices Summary generated successfully!', '#27ae60');

				      			generateExcel(invoiceList, billingParameters);
				      		}

				      		n++;
				      	}


				      	function generateExcel(invoiceData, billingParameters){

				      		var main_header_title_nulls = []; 
				      		var extras_header_titles = [];
				      		var q = 0;
				      		while(billingParameters[q]){
				      			extras_header_titles.push(billingParameters[q].name + ' (' + (billingParameters[q].unit == 'PERCENTAGE' ? billingParameters[q].value + '%' : 'Rs. '+billingParameters[q].value)+ ')');
				      			main_header_title_nulls.push("");
				      			q++;
				      		}

							var report_date_range = request_date_start;
							var report_date_title = ' on ' + moment(request_date_start, 'YYYYMMDD').format('D MMM, YYYY');
							if(request_date_start != request_date_end){
								report_date_range += '_to_' + request_date_end;
								report_date_title = ' from ' + moment(request_date_start, 'YYYYMMDD').format('D MMM, YYYY') + ' to ' + moment(request_date_end, 'YYYYMMDD').format('D MMM, YYYY');
							}


				      		var temp_branch_name = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : 'UNKNOWN_BRANCH';
				      		var temp_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : 'UNKNOWN_CLIENT'; 

				      		temp_branch_name = temp_branch_name.toUpperCase();
				      		temp_client_name = temp_client_name.toUpperCase();
				      		report_date_title = report_date_title.toUpperCase();

							var header = [
							  ["CANCELLED INVOICES SUMMARY - " + temp_client_name +" "+ temp_branch_name + report_date_title, "", "", "", "", "", "", "", "", "", "", "", "", ""].concat(main_header_title_nulls.concat(["", "", "", "", "", "", ""])),
							  ["Sl. No.", "Invoice No.", "Date", "Day", "Time", "Billing Mode", "Type", "Items", "Status", "Cancelled By", "Reason", "Remarks", "Sub Total"].concat(extras_header_titles.concat(["Discount", "Waive Off", "Payable Amount", "Paid Amount", "Mode of Payment", "Refunds", "Gross Amount"]))
							];

							var data = header.concat(invoiceData);

							/* merge cells A1:I1 */
							var mergeBoundaryIndex = header[1].length - 1;
							var mergeBoundary = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1", "AA1", "AB1", "AC1", "AD1", "AE1", "AF1", "AG1", "AH1", "AI1", "AJ1"];
							var merge = XLSX.utils.decode_range("A1:"+mergeBoundary[mergeBoundaryIndex]);

							/* generate worksheet */
							var ws = XLSX.utils.aoa_to_sheet(data);

							/* add merges */
							if(!ws['!merges']) ws['!merges'] = [];
							ws['!merges'].push(merge);

							/* generate workbook */
							var wb = XLSX.utils.book_new();
							XLSX.utils.book_append_sheet(wb, ws, "Cancelled Invoices");

							/* generate file and download */
							const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
							saveAs(new Blob([wbout], { type: "application/octet-stream" }), "cancelled_invoices_summary_"+temp_client_name.toLowerCase()+"_"+temp_branch_name.toLowerCase()+"_"+report_date_range+".xlsx");
							

				      	}

					},
					error: function(data){
						hideLoading();
						showToast('System Error: Unable to read Invoices data. Please contact Accelerate Support.', '#e74c3c');
					}
				});  

			}

			break;
		} // end - BILL_CANCELLATIONS



		case "ITEM_CANCELLATIONS":{

			showLoading(50000, 'Generating Report...');

			dateWiseCancelledItemsExcel(fromDate, toDate);


			function dateWiseCancelledItemsExcel(request_date_start, request_date_end){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_item_cancellations/_design/cancellation-summary/_view/fetchall?startkey=["'+request_date_start+'"]&endkey=["'+request_date_end+'"]&descending=false',
					timeout: 10000,
					success: function(data) {
						
						var resultsList = data.rows;
						var cancelledItemsList = [];
						
						if(resultsList.length == 0){
							hideLoading();
							showToast('Warning: There are no items cancelled on the given dates.', '#e67e22');
							return "";
						}


				      	
				      	var itemCounter = 1;

				      	var n = 0;
				      	while(resultsList[n]){ //iterating through each item

				      		var cancelledItem = resultsList[n].value;
				      		
				      		for(var c = 0; c < cancelledItem.itemsRemoved.length; c++){
					      		
					      		cancelledItemsList.push([
									itemCounter, //Sl No.
					      			cancelledItem.date, //Date
					      			moment(cancelledItem.time, 'hhmm').format('hh:mm A'), //Time
					      			cancelledItem.mode, //Billing Mode
					      			cancelledItem.modeType, //Type of Mode (DINE, PARCEL etc.)
					      			cancelledItem.itemsRemoved[c].name + (cancelledItem.itemsRemoved[c].isCustom ? ' ('+cancelledItem.itemsRemoved[c].variant+')' : ''), //item
					      			cancelledItem.itemsRemoved[c].qty,
					      			cancelledItem.stewardName, //requested by
					      			cancelledItem.itemsRemoved[c].comments, // reason for cancellation
					      			cancelledItem.adminName, //approved by
					      			cancelledItem.customerName,
					      			cancelledItem.customerMobile,
					      			cancelledItem.guestCount,
					      			cancelledItem.KOTNumber,
					      			(cancelledItem.modeType == 'DINE' ? cancelledItem.table : '')
					      		]);

					      		itemCounter++;
				      		}


				      		if(n == resultsList.length - 1){ //last iteration

				      			hideLoading();
				      			showToast('Cancelled Items Summary generated successfully!', '#27ae60');

				      			generateExcel(cancelledItemsList);
				      		}

				      		n++;
				      	}


				      	function generateExcel(cancelledItemsData){

							var report_date_range = request_date_start;
							var report_date_title = ' on ' + moment(request_date_start, 'YYYYMMDD').format('D MMM, YYYY');
							if(request_date_start != request_date_end){
								report_date_range += '_to_' + request_date_end;
								report_date_title = ' from ' + moment(request_date_start, 'YYYYMMDD').format('D MMM, YYYY') + ' to ' + moment(request_date_end, 'YYYYMMDD').format('D MMM, YYYY');
							}


				      		var temp_branch_name = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : 'UNKNOWN_BRANCH';
				      		var temp_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : 'UNKNOWN_CLIENT'; 

				      		temp_branch_name = temp_branch_name.toUpperCase();
				      		temp_client_name = temp_client_name.toUpperCase();
				      		report_date_title = report_date_title.toUpperCase();

							var header = [
							  ["CANCELLED ITEMS DETAILS - " + temp_client_name +" "+ temp_branch_name + report_date_title, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
							  ["Sl. No.", "Date", "Time", "Billing Mode", "Type", "Item", "Quantity", "Requested By", "Comments", "Approver", "Guest Name", "Guest Mobile", "Number of Guests", "KOT Number", "Table Reference"]
							];

							var data = header.concat(cancelledItemsData);

							/* merge cells A1:I1 */
							var mergeBoundaryIndex = header[1].length - 1;
							var mergeBoundary = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1", "AA1", "AB1", "AC1", "AD1", "AE1", "AF1", "AG1", "AH1", "AI1", "AJ1"];
							var merge = XLSX.utils.decode_range("A1:"+mergeBoundary[mergeBoundaryIndex]);

							/* generate worksheet */
							var ws = XLSX.utils.aoa_to_sheet(data);

							/* add merges */
							if(!ws['!merges']) ws['!merges'] = [];
							ws['!merges'].push(merge);

							/* generate workbook */
							var wb = XLSX.utils.book_new();
							XLSX.utils.book_append_sheet(wb, ws, "Cancelled Items");

							/* generate file and download */
							const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
							saveAs(new Blob([wbout], { type: "application/octet-stream" }), "cancelled_items_summary_"+temp_client_name.toLowerCase()+"_"+temp_branch_name.toLowerCase()+"_"+report_date_range+".xlsx");
							

				      	}

					},
					error: function(data){
						hideLoading();
						showToast('System Error: Unable to read Cancelled Items data. Please contact Accelerate Support.', '#e74c3c');
					}
				});  

			}

			break;
		} // end - ITEM_CANCELLATIONS


	}
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    		
				    		var result = data.rows[0].value;

							//Check for any refunds in this mode.
							$.ajax({
								type: 'GET',
							    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode_refundedamounts?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
							    timeout: 10000,
								success: function(data) {

									var refunded_sum = 0;
									if(data.rows.length > 0){
										refunded_sum = data.rows[0].value.sum;
									}

						    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr onclick="openDetailedByMode(\''+modes[0].name+'\', \''+fromDate+'\', \''+toDate+'\')" class="detailedByMode"> <td>'+modes[0].name+'<tag class="viewOptionsIcon">View Details</tag></td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+(result.count != 0? result.count+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(result.sum - refunded_sum).toFixed(2)+'</td> </tr>';
						    		
						    		grandSum += (result.sum - refunded_sum);
						    		grandCount += result.count;

						    		if(result.sum - refunded_sum > 0){
						    			graphData.push({
								    		"name": modes[0].name,
								    		"value": result.sum - refunded_sum
								    	})
						    		}

							    	

							    	//Check if next mode exists...
							    	if(modes[1]){
							    		fetchSalesSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount, graphData);
							    	}
							    	else{
							    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
																	                                       '<td>Overall</td>'+
																	                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
																	                                      '</tr> '
										renderGraph_SalesSummary(graphData);

										//if today's summary
										var std_today = getCurrentTime('DATE_STAMP');
										if(fromDate == toDate && fromDate == std_today){
											fetchSalesSummaryUnbilledKOT();
										}
							    	}

								},
								error: function(data){
									document.getElementById("summaryRender_billingMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';													    	
								}
							});  

				    	}
				    	else{
				    				
				    				document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
				    	

							    	//Check if next mode exists...
							    	if(modes[1]){
							    		fetchSalesSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount, graphData);
							    	}
							    	else{
							    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
																	                                       '<td>Overall</td>'+
																	                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
																	                                      '</tr> '
										renderGraph_SalesSummary(graphData);

										//if today's summary
										var std_today = getCurrentTime('DATE_STAMP');
										if(fromDate == toDate && fromDate == std_today){
											fetchSalesSummaryUnbilledKOT();
										}
							    	}
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    		
				    		var result = data.rows[0].value;

							//Check for any refunds in this mode.
							$.ajax({
								type: 'GET',
							    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode_refundedamounts?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
							    timeout: 10000,
								success: function(data) {

									var refunded_sum = 0;
									if(data.rows.length > 0){
										refunded_sum = data.rows[0].value.sum;
									}


									document.getElementById("summaryRender_billingMode").innerHTML += '<tr onclick="openDetailedByMode(\''+modes[index].name+'\', \''+fromDate+'\', \''+toDate+'\')" class="detailedByMode"> <td>'+modes[index].name+'<tag class="viewOptionsIcon">View Details</tag></td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+(result.count != 0? result.count+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(result.sum- refunded_sum).toFixed(2)+'</td> </tr>';
				    		
						    		grandSum += (result.sum - refunded_sum);
						    		grandCount += result.count;


						    		if(result.sum - refunded_sum > 0){
						    			graphData.push({
								    		"name": modes[index].name,
								    		"value": result.sum - refunded_sum
								    	})
						    		}	



							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchSalesSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount, graphData);
							    	}
							    	else{
							    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
																	                                       '<td>Total Settled Amount</td>'+
																	                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i><b>'+parseFloat(grandSum).toFixed(2)+'</b></td>'+
																	                                      '</tr> '
										renderGraph_SalesSummary(graphData);

										//if today's summary
										var std_today = getCurrentTime('DATE_STAMP');
										if(fromDate == toDate && fromDate == std_today){
											fetchSalesSummaryUnbilledKOT();
										}
							    	}



								},
								error: function(data){
									document.getElementById("summaryRender_billingMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';													    	
								}
							});  

		
				    	}
				    	else{
				    		
				    				document.getElementById("summaryRender_billingMode").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right"><i class="fa fa-inr"></i>0</td> </tr>';
				    	

							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchSalesSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount, graphData);
							    	}
							    	else{
							    		document.getElementById("summaryRender_billingMode").innerHTML += '<tr class="summaryRowHighlight">'+
																	                                       '<td>Total Settled Amount</td>'+
																	                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i><b>'+parseFloat(grandSum).toFixed(2)+'</b></td>'+
																	                                      '</tr> '
										renderGraph_SalesSummary(graphData);

										//if today's summary
										var std_today = getCurrentTime('DATE_STAMP');
										if(fromDate == toDate && fromDate == std_today){
											fetchSalesSummaryUnbilledKOT();
										}
							    	}
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




function fetchSalesSummaryUnbilledKOT() {

	/*
			Summary - BILLING MODE wise (Unbilled Amounts)
	*/

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	          	var grandSum = 0;
	          	var grandCount = 0;

				$.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/_design/kot-summary/_view/sumbycart',
				    timeout: 10000,
				    success: function(data) {


				    	if(data.rows.length > 0){
				    		var result = data.rows[0].value;

				    		grandSum = result.sum;
				    		grandCount = result.count;
				    	
				    		//Sum of Extras
							$.ajax({
							    type: 'GET',
							    url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/_design/kot-summary/_view/sumbyextras',
							    timeout: 10000,
							    success: function(newdata) {


							    	if(newdata.rows.length > 0){
							    		var newresult = newdata.rows[0].value;
							    		grandSum += newresult.sum;

							    		var html_content = $('#summaryRender_billingMode').html();
							    		html_content += '<tr class="summaryRowHighlight" style="background: #e2e2e2">'+
														    '<td>Live Orders</td>'+
														    '<td class="summaryLine1" style="text-align: right; color: #444; font-size: 110%;"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														'</tr>';

										$('#summaryRender_billingMode').html(html_content);

							    		fetchSalesSummaryUnbilledBills(fromDate, toDate, grandSum, grandCount);
							    	}
							    },
							    error: function(data){
							    	fetchSalesSummaryUnbilledBills(fromDate, toDate, 0, 0);	
							    }
							});  

				    	}
				    	else{
				    		fetchSalesSummaryUnbilledBills(fromDate, toDate, 0, 0);
				    	}
				    },
				    error: function(data){
				    	fetchSalesSummaryUnbilledBills(fromDate, toDate, 0, 0);
				    }
				});  


}


function fetchSalesSummaryUnbilledBills(fromDate, toDate, grandSum, grandCount){

	//dates expected as DD-MM-YYYY
	fromDate = getHumanStandardDate(fromDate);
	toDate = getHumanStandardDate(toDate);

				$.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-summary/_view/sumbytotalpayable?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    		var result = data.rows[0].value;
				    		
				    		var billed_sum = result.sum;
				    		var billed_count = result.count;


							    		var html_content = $('#summaryRender_billingMode').html();
							    		html_content += '<tr class="summaryRowHighlight" style="background: #e2e2e2">'+
														    '<td>Pending Settlement</td>'+
														    '<td class="summaryLine1" style="text-align: right; color: #444; font-size: 110%;"><count class="summaryCount" style="padding-right: 5px">'+(billed_count != 0 ? billed_count+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(billed_sum).toFixed(2)+'</td>'+
														'</tr>';

										$('#summaryRender_billingMode').html(html_content);

				    	}
				    },
				    error: function(data){

				    }
				});  	
}






function openDetailedByMode(selectedBillingMode, fromDate, toDate){
	//given this mode of billing, render the payments made via different modes

		document.getElementById("summaryRenderArea_billingMode_detailed").style.display = "block";
		document.getElementById("summaryRenderArea_billingMode_detailed_title").innerHTML = 'Payment Summary for <b>'+selectedBillingMode+'</b>';


		document.getElementById("summaryRender_billingMode_detailed").innerHTML = '';

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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_billingMode_detailed").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingandpaymentmodes?startkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingandpaymentmodes_multiple?startkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[0].code+'","'+toDate+'"]',
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingandpaymentmodes?startkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingandpaymentmodes_multiple?startkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[index].code+'","'+toDate+'"]',
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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_paymentMode").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	//For a given PAYMENT MODE, the total Sales in the given DATE RANGE

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}



											//Check if any refunds issued 
											$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_refundedamounts?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													var refund_amount = 0;
													if(data.rows.length > 0){
													    refund_amount = data.rows[0].value.sum;
													}

										    		if(temp_sum-refund_amount > 0){
										    			graphData.push({
												    		"name": modes[0].name,
												    		"value": temp_sum-refund_amount
												    	})
										    		}			


													//time to render...
											    	if(temp_count > 0){
											    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr onclick="openDetailedByExtras(\''+modes[0].code+'\', \''+fromDate+'\', \''+toDate+'\', \''+temp_count+'\', \''+(temp_sum-refund_amount)+'\')" class="detailedByMode"> <td>'+modes[0].name+'<tag class="viewOptionsIcon">View Details</tag></td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum-refund_amount).toFixed(2)+'</td> </tr>';
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
													document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
												}
											}); 

							

								},
								error: function(data){
									document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}




											//Check if any refunds issued 
											$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_refundedamounts?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													var refund_amount = 0;
													if(data.rows.length > 0){
													    refund_amount = data.rows[0].value.sum;
													}

										    		if(temp_sum-refund_amount > 0){
										    			graphData.push({
												    		"name": modes[index].name,
												    		"value": temp_sum-refund_amount
												    	})
										    		}			


													//time to render...
											    	if(temp_count > 0){
											    		document.getElementById("summaryRender_paymentMode").innerHTML += '<tr onclick="openDetailedByExtras(\''+modes[index].code+'\', \''+fromDate+'\', \''+toDate+'\', \''+temp_count+'\', \''+(temp_sum-refund_amount)+'\')" class="detailedByMode"> <td>'+modes[index].name+'<tag class="viewOptionsIcon">View Details</tag></td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum-refund_amount).toFixed(2)+'</td> </tr>';
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
													document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
												}
											}); 


								},
								error: function(data){
									document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
								}
							}); 


				    },
				    error: function(data){
				    	document.getElementById("summaryRender_paymentMode").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
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




function openDetailedByExtras(selectedPaymentMode, fromDate, toDate, grandCount, grandSum){
		
		//given this mode of payment, render the extras comings under this

		document.getElementById("summaryRenderArea_paymentMode_detailed").style.display = "block";
		document.getElementById("summaryRenderArea_paymentMode_detailed_title").innerHTML = 'Detailed Summary for <b>'+selectedPaymentMode+'</b>';


		document.getElementById("summaryRender_paymentMode_detailed").innerHTML = '';

		var cumulativeSum = 0;

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

	            var modes = data.docs[0].value;

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_paymentMode_detailed").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no billing parameters added.</tag>';
	          		return '';
	          	}

	          	  //For a given EXTRAS, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	var temp_count = 0;
				    	var temp_sum = 0;

				    	if(data.rows.length > 0){
				    		temp_count = data.rows[0].value.count;
				    		temp_sum = data.rows[0].value.sum;
				    	}


				    		//Now check in custom Extras
					    	$.ajax({
								type: 'GET',
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_custom?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}


									//Now check in split payments
							    	$.ajax({
										type: 'GET',
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_sum += data.rows[0].value.sum;
											}


											//Now check in split payments with custom extras
									    	$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple_custom?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													if(data.rows.length > 0){
													    temp_sum += data.rows[0].value.sum;
													}

													
													//time to render...
											    	if(temp_sum > 0){
											    		document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right">'+(temp_count > 0 ? '<count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count>' : '')+'<i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
											    	}

											    	cumulativeSum += temp_sum;

											    	//Check if next mode exists...
											    	if(modes[1]){
											    		openDetailedByExtrasCallback(1, modes, fromDate, toDate, selectedPaymentMode, grandCount, grandSum, cumulativeSum);
											    	}
											    	else{
											    		
											    		if(cumulativeSum > 0){
											    			document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Sales Amount</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum-cumulativeSum).toFixed(2)+'</td> </tr>';
											    		}

											    		document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Grand Total</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td> </tr>';
											    	}
													

												},
												error: function(data){

												}
											}); //split payments with custom extras



										},
										error: function(data){

										}
									}); //split payments



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
	            showToast('Not Found Error: Payments data not found. Please contact Accelerate Support.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Payments data not found. Please contact Accelerate Support.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
	      }

	    });
}


function openDetailedByExtrasCallback(index, modes, fromDate, toDate, selectedPaymentMode, grandCount, grandSum, cumulativeSum){
	          	
	          	  //For a given PAYMENT MODE, the extras in the given DATE RANGE
				  
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_custom?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}


						    		//Now check in split payments
							    	$.ajax({
										type: 'GET',
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_sum += data.rows[0].value.sum;
											}


								    		//Now check in split payments with custom extras
									    	$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple_custom?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													if(data.rows.length > 0){
													    temp_sum += data.rows[0].value.sum;
													}


													//time to render...
											    	if(temp_sum > 0){
											    		document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right">'+(temp_count > 0 ? '<count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Orders</count>' : '')+'<i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';	
											    	}

											    	cumulativeSum += temp_sum;

											    	//Check if next mode exists...
											    	if(modes[index+1]){
											    		openDetailedByExtrasCallback(index+1, modes, fromDate, toDate, selectedPaymentMode, grandCount, grandSum, cumulativeSum);
											    	}
											    	else{
											    		
											    		if(cumulativeSum > 0){
											    			document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Sales Amount</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum-cumulativeSum).toFixed(2)+'</td> </tr>';
											    		}

											    		document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Grand Total</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td> </tr>';
											    	}													

												},
												error: function(data){

												}
											}); //split payments with custom extras
										



										},
										error: function(data){

										}
									}); //split payments




								},
								error: function(data){

								}
							}); 


				    },
				    error: function(data){

				    }
				  });  
}








function fetchTimeSlotWiseSummary(){
	
	/*
			Summary - TIME SLOT wise
	*/	

	$("#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_timeSlotWise").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	/* check for filters */
	var filter_type = document.getElementById("timeslotSummaryOrderTypeButton").innerHTML;
	var custom_filter_url = '';
	
	if(filter_type == "All Orders"){
		custom_filter_url = COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/timeslotwise_countoverall?startkey=["ANY_MODE","'+fromDate+'", 0]&endkey=["ANY_MODE","'+toDate+'", 23]';
	}	
	else{
		custom_filter_url = COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/timeslotwise_countbymode?startkey=["'+filter_type+'", "'+fromDate+'", 0]&endkey=["'+filter_type+'", "'+toDate+'", 23]';
	}



	var graphData = [];

	document.getElementById("summaryRender_timeSlotWise").innerHTML = '';
	document.getElementById("timeSlotBarChartHolder").innerHTML = '<canvas id="timeSlotBarChart" width="100" height="100"></canvas>';
	

	showLoading(50000, 'Rendering Graph...');

	$.ajax({
		type: 'GET',
		url: custom_filter_url,
		timeout: 50000,
		success: function(data) {

			hideLoading();


			var itemsList = data.rows;
			if(itemsList.length == 0){
				document.getElementById("summaryRender_timeSlotWise").innerHTML = '<p style="margin:80px 0 0 0; color: #a9a9a9; text-align: center;">No settled invoices found on the given dates</p>';
				return '';
			}



			var master_filter_type = 'BILLS';
			if(document.getElementById("timeslotSummaryDisplayFilterButton").innerHTML == 'Number of Guests'){
				master_filter_type = 'GUESTS';
			}


			reduceBySlot(itemsList);
			
			function reduceBySlot(listOfItems){

				//Reduce Function 
				var reduced_list = listOfItems.reduce(function (accumulator, item) {
					if(accumulator[item.key[2]]){
						accumulator[item.key[2]].number_of_guests += item.value; //number of guests
						accumulator[item.key[2]].count++; //number of such orders
					}
					else{
						accumulator[item.key[2]] = {
							"hour_slot": item.key[2],
							"count": 1,
							"number_of_guests": item.value,
						};
					}

				  	return accumulator;
				}, {});


				var formattedList = [];
				var keysCount = Object.keys(reduced_list);

				var counter = 1;
				for (x in reduced_list) {
				    formattedList.push({
				    	"number_of_guests": reduced_list[x].number_of_guests,
				    	"count": reduced_list[x].count,
				    	"hour_slot": reduced_list[x].hour_slot
				    });

				    if(counter == keysCount.length){ //last iteration
				    	renderSummaryList(formattedList);
				    }

				    counter++;
				}
				
			}



			function renderSummaryList(itemsFilteredList){

				//Final formatting of the list.
				//Add zero values for all other times slots which are not in the list.

				for(var g = 0; g < 24; g++){
					
					var n = 0;
					while(itemsFilteredList[n]){
						if(itemsFilteredList[n].hour_slot == g){
							//Already added slot
							break;
						}

						if(n == itemsFilteredList.length - 1){ //last iteration, slot not present
							itemsFilteredList.push({
						    	"number_of_guests": 0,
						    	"count": 0,
						    	"hour_slot": g
						    });
						}

						n++;
					}

				}


					// Ascending: Sorting
					itemsFilteredList.sort(function(obj1, obj2) {
			            return obj1.hour_slot - obj2.hour_slot;
			        });
			        

			        //Remove 12:00 Midnight to 11:00 Midnight (if all zeros in between)
			        var midnightEmptyCheck = true;
			        var m = 0;
			        while(itemsFilteredList[m] && m <= 11){

			        	if(itemsFilteredList[m].count != 0){
			        		midnightEmptyCheck = false;
			        		break;
			        	}
			        	m++;
			        }

			        if(midnightEmptyCheck){
			        	itemsFilteredList = itemsFilteredList.splice(11, 23);	
			        }


					for(var i = 0; i < itemsFilteredList.length; i++){

						var fancy_slot = '';

						if(itemsFilteredList[i].hour_slot == 0){
							fancy_slot = 'Midnight';
						}
						else if(itemsFilteredList[i].hour_slot < 12){
							fancy_slot = itemsFilteredList[i].hour_slot +'am';
						}
						else{
							if(itemsFilteredList[i].hour_slot != 12){
								fancy_slot = (itemsFilteredList[i].hour_slot-12) +'pm';
							}
							else{
								fancy_slot = "12 Noon";
							}
						}

						graphData.push({
							"name": fancy_slot,
							"value": itemsFilteredList[i].number_of_guests,
							"bills": itemsFilteredList[i].count
						})
					}


					renderGraph_TimeSlotWiseSummary(graphData, master_filter_type);
			}

		},
		error: function(data){
			hideLoading();
			document.getElementById("summaryRender_timeSlotWise").innerHTML = '<p style="margin:80px 0 0 0; color: #a9a9a9; text-align: center;">Unable to generate the Time Slot Summary on the given dates</p>';
			showToast('Not Found Error: Time Slot Summary data not found. Please contact Accelerate Support.', '#e74c3c');
			return '';								    	
		}
	});  

}


function renderGraph_TimeSlotWiseSummary(graphData, requestType){

	var graph_labels = [];
	var graph_data = [];
	var graph_background = [];
	var graph_border = [];

	var n = 0;
	while(graphData[n]){
		
		graph_labels.push(graphData[n].name);
		
		if(requestType == 'BILLS'){
			graph_data.push(graphData[n].bills);
		}
		else{
			graph_data.push(graphData[n].value);
		}

		graph_background.push("rgba(2, 208, 255, 1)") //bright blue color
		graph_border.push("rgba(2, 208, 255, 1)") //bright blue color

		n++;
	}

	var ctx = document.getElementById("timeSlotBarChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: graph_labels,
	        datasets: [{
	            label: requestType == 'BILLS' ? 'Number of Bills' : 'Number of Guests',
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
                        if(graph_labels[tooltipItems.index+1]){
                        	return ' '+graph_data[tooltipItems.index]+' '+(requestType == 'BILLS' ? 'bills' : 'guests')+' between '+graph_labels[tooltipItems.index]+' and '+graph_labels[tooltipItems.index+1];
                        }
                        else{
                        	return ' '+graph_data[tooltipItems.index]+' '+(requestType == 'BILLS' ? 'bills' : 'guests')+' between '+graph_labels[tooltipItems.index]+' and '+graph_labels[0];
                        }
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
	            }],
	            xAxes: [{
	                gridLines: {
                    	display:false
                	}
	            }]
	        }
	    }
	});		
}


//Filters
function changeTimeslotSummaryDisplayFilter(){

	var x = document.getElementById("timeslotSummaryDisplayFilterButton");

	if(x.innerHTML == 'Number of Guests'){
		x.innerHTML = 'Generated Bills';
	}
	else if(x.innerHTML == 'Generated Bills'){
		x.innerHTML = 'Number of Guests';
	}

	refreshTimeSlotGraph();
}

function changeTimeslotSummaryOrderType(){

	if($('#billingModesModalHome').is(':visible')){
		document.getElementById("billingModesModalHome").style.display = "none";
		return '';
	}


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


				var billingModes = data.docs[0].value;
				document.getElementById("billingModesModalHome").style.display = "block";

				var renderContent = '<button class="billModeListedButton" onclick="setTimeSlotOrderType(\'All Orders\')">All Orders<span class="modeSelectionBrief">DEFAULT</span></button>';
				var n = 0;
				while(billingModes[n]){
					renderContent += '<button class="billModeListedButton" onclick="setTimeSlotOrderType(\''+billingModes[n].name+'\')">'+billingModes[n].name+'<span class="modeSelectionBrief">'+billingModes[n].type+'</span></button>';
					n++;
				}

				document.getElementById("billingModesModalHomeContent").innerHTML = '<div id="billingModesModalList">'+renderContent+'</div>';

          }
          else{
            showToast('Not Found Error: Billing Modes data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Modes data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
      }

    });


}


function setTimeSlotOrderType(type){
	if(type != ''){
		document.getElementById("timeslotSummaryOrderTypeButton").innerHTML = type;
	}
	
	document.getElementById("billingModesModalHome").style.display = "none";


	refreshTimeSlotGraph();
}


function refreshTimeSlotGraph(){
	fetchTimeSlotWiseSummary();
}








function fetchSessionWiseSummary() {

	/*
			Summary - SESSION wise
	*/


	$("#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_sessionWise").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);


	var graphData = [];

	document.getElementById("summaryRender_sessionWise").innerHTML = '';
	document.getElementById("sessionsPieChartHolder").innerHTML = '<canvas id="sessionsPieChart" width="100" height="100"></canvas>';


	$.ajax({
		type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sessionwisesales?startkey=["'+fromDate+'"]&endkey=["'+toDate+'",{}]',
		timeout: 50000,
		success: function(data) {

			var itemsList = data.rows;
			if(itemsList.length == 0){
				document.getElementById("summaryRender_sessionWise").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">No settled invoices found on the given dates</p>';
				return '';
			}

			reduceByDate(itemsList);
			
			function reduceByDate(listOfItems){
				//Reduce Function 
				var reduced_list = listOfItems.reduce(function (accumulator, item) {
					if(accumulator[item.key[1]]){
						accumulator[item.key[1]].amount += item.value; //total amount
						accumulator[item.key[1]].number_of_guests += item.key[2]; //number of guests
						accumulator[item.key[1]].count++; //number of orders
					}
					else{
						accumulator[item.key[1]] = {
							"session": item.key[1],
							"amount": item.value,
							"count": 1,
							"number_of_guests": item.key[2],
						};
					}

				  	return accumulator;
				}, {});


				var formattedList = [];
				var keysCount = Object.keys(reduced_list);

				var counter = 1;
				for (x in reduced_list) {
				    formattedList.push({
				    	"number_of_guests": reduced_list[x].number_of_guests,
				    	"count": reduced_list[x].count,
				    	"amount": reduced_list[x].amount,
				    	"session": reduced_list[x].session
				    });

				    if(counter == keysCount.length){ //last iteration
				    	// Ascending: Sorting
				    	formattedList.sort(function(obj1, obj2) {
		                	return obj2.count - obj1.count;
		              	});

				    	renderSummaryList(formattedList);
				    }

				    counter++;
				}
				
			}

			function renderSummaryList(itemsFilteredList){

				if(itemsFilteredList.length > 0){ 

					var upper_limit = 15;
					if(itemsFilteredList.length < 15){ //max of 20 items
						upper_limit = itemsFilteredList.length;
					}

					var renderContent = '';
					for(var i = 0; i < upper_limit; i++){
						renderContent += '<tr> <td>'+itemsFilteredList[i].session+'</td> <td class="summaryLine3" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+itemsFilteredList[i].count+' Orders'+(itemsFilteredList[i].number_of_guests && itemsFilteredList[i].number_of_guests > 0 ? ' and '+itemsFilteredList[i].number_of_guests+' Guests' : '')+'</count><i class="fa fa-inr"></i>'+parseFloat(itemsFilteredList[i].amount).toFixed(2)+'</td> </tr>';
					
						if(itemsFilteredList[i].amount > 0 && itemsFilteredList[i].session != "Unknown"){
						    graphData.push({
								"name": itemsFilteredList[i].session,
								"value": itemsFilteredList[i].amount
							})
						}			

					}

					document.getElementById("summaryRender_sessionWise").innerHTML = renderContent + '<p style=" margin: 0 0 0 5px; font-size: 11px; font-style: italic; color: #777; ">*Indicative figures only. Refunds are <b>not</b> deducted.</p>';

					//render the graph
					renderGraph_SessionWiseSummary(graphData);

				} 
				else{ 
					document.getElementById("summaryRender_sessionWise").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no settled invoices on the given dates</p>';
				}
			}
		},
		error: function(data){
			document.getElementById("summaryRender_sessionWise").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">Unable to generate the Session Summary on the given dates</p>';
			showToast('Not Found Error: Session Summary data not found. Please contact Accelerate Support.', '#e74c3c');
			return '';								    	
		}
	});  
}



function renderGraph_SessionWiseSummary(graphData){

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

	var ctx = document.getElementById("sessionsPieChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'pie',
	    data: {
	        labels: graph_labels,
	        datasets: [{
	            label: 'Sessions',
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
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr class="summaryRowHighlight"> <td><b>Total Sales Volume</b></td> <td class="summaryLineBlack" style="color: #3498db; font-weight: bold; font-size: 24px; text-align: right"><count class="summaryCount" style="padding-right: 5px; font-weight: 400">from '+temp_totalOrders+' Orders</count><i class="fa fa-inr"></i><tag id="figureTotalSalesVolume">'+parseFloat(temp_totalPaid).toFixed(2)+'</tag></td> </tr>';
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
                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

	          	var modes = data.docs[0].value;
	          	modes.sort(); //alphabetical sorting 

	          	if(modes.length == 0){
	          		return '';
	          	}

	          	//For a given BILLING PARAMETER, the total Sales in the given DATE RANGE

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
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
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_discounts?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_roundoff?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
					"name": 'Waive Off',
					"value": temp_roundOffSum
				})
			}		


			//time to render...
			if(temp_roundOffCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Waive Off Amount</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_roundOffCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_roundOffSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Waive Off Amount</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
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
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_tips?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_refundCount = 0;
				var temp_refundSum = 0;

				if(data.rows.length > 0){
					temp_refundCount = data.rows[0].value.count;
					temp_refundSum = data.rows[0].value.sum;
				}

				netRefundsProcessed = temp_refundSum;

				if(temp_refundSum > 0){
					graphData.push({
						"name": 'Refunds',
						"value": temp_refundSum
					})
				}		

				//time to render...
				if(temp_refundCount > 0){
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Refunds Issued</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_refundCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_refundSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;

					//Adjust total sales volume
					var x = document.getElementById("figureTotalSalesVolume");
					var total_sales_volume_without_refund = x.innerHTML;
					document.getElementById("figureTotalSalesVolume").innerHTML = parseFloat(total_sales_volume_without_refund - temp_refundSum).toFixed(2);
				}
				else{
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Total Refunds Issued</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
				}

				//Step 7: Render Calculated Round Offs
				renderCalculatedRoundOffs(fromDate, toDate, netSalesWorth, graphData);

			},
			error: function(data){

			}
		});  		
}


//Step 7
function renderCalculatedRoundOffs(fromDate, toDate, netSalesWorth, graphData){

		//Total Calculated Round Offs
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_calculatedroundoff?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_sum = 0;

				if(data.rows.length > 0){
					temp_sum = data.rows[0].value.sum;
				}

				graphData.push({
					"name": 'Calculated Round Off',
					"value": temp_sum
				})

				//time to render...
				if(temp_sum < 0){
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Calculated Round Off</td> <td class="summaryLineRed" style="text-align: right">- <i class="fa fa-inr"></i>'+parseFloat(temp_sum * -1).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
				}
				else if(temp_sum > 0){
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Calculated Round Off</td> <td class="summaryLineGreen" style="text-align: right">+ <i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
				}
				else{
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Calculated Round Off</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
				}

				//Step 7: Render Gross Cart amount
				renderGrossAmount(fromDate, toDate, netSalesWorth, graphData);

			},
			error: function(data){

			}
		}); 

}


//Step 8
function renderGrossAmount(fromDate, toDate, netSalesWorth, graphData){
		
		//Total Cart Amount
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_grossamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_sum = 0;
				var temp_count = 0;

				if(data.rows.length > 0){
					temp_sum = data.rows[0].value.sum;
					temp_count = data.rows[0].value.count;
				}

				graphData.push({
					"name": 'Gross Sales',
					"value": temp_sum
				})


				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Gross Sales</td> <td style="text-align: right"><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;


				//Step 10: Final Render Call
				renderSummaryFinal(netSalesWorth, graphData);

			},
			error: function(data){

			}
		}); 
}



//Step 10
function renderSummaryFinal(netSalesWorth, graphData){
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
					    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbydiscounts?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
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
															                                       '<td>Overall</td>'+
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbydiscounts?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
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
														                                       '<td>Overall</td>'+
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
		All the CANCELLED INVOICES in given date range
	*/

	$( "#summaryRenderArea" ).children().css( "display", "none" );
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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_cancellationSummary").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no billing modes added</tag>';
	          		return '';
	          	}

	          	var grandSum = 0;
	          	var grandCount = 0;

	          	  //For a given BILLING MODE, the total cancelled bills in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {
				    	
				    	if(data.rows.length > 0){
					    	var temp_count = data.rows[0].value.count;
					    	var temp_sum = data.rows[0].value.sum;

					    	grandSum += temp_sum;
				    		grandCount += temp_count;

							if(temp_count > 0){
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right; color: #dd4b39"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Bills</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right; color: #dd4b39"><i class="fa fa-inr"></i>0</td> </tr>';
							}
						}
						else{
							document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[0].name+'</td> <td class="summaryLine3" style="text-align: right; color: #dd4b39"><i class="fa fa-inr"></i>0</td> </tr>';
						}
						
						if(modes[1]){
				    		fetchCancellationSummaryCallback(1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr class="summaryRowHighlight">'+
														                                       '<td>Overall</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Bills' : 'No Bills')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
				    	}

				    },
				    error: function(data){
				    	document.getElementById("summaryRender_cancellationSummary").innerHTML = '<p style="margin: 25px 0 25px 5px; font-size: 18px; color: #949494; font-weight: 300;"><img src="images/common/smiley_confused.png" width="50px"> Something went wrong!</p>';
				    }
				  });  

          }
          else{
            showToast('Not Found Error: Billing Modes data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Modes data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


function fetchCancellationSummaryCallback(index, modes, fromDate, toDate, grandSum, grandCount){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {

				    	if(data.rows.length > 0){
				    
					    	var temp_count = data.rows[0].value.count;
					    	var temp_sum = data.rows[0].value.sum;

					    	grandSum += temp_sum;
				    		grandCount += temp_count;

							if(temp_count > 0){
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right; color: #dd4b39"><count class="summaryCount" style="padding-right: 5px">from '+temp_count+' Bills</count><i class="fa fa-inr"></i>'+parseFloat(temp_sum).toFixed(2)+'</td> </tr>';
							}
							else{
								document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right; color: #dd4b39"><i class="fa fa-inr"></i>0</td> </tr>';
							}
						}
						else{
							document.getElementById("summaryRender_cancellationSummary").innerHTML += '<tr> <td>'+modes[index].name+'</td> <td class="summaryLine3" style="text-align: right; color: #dd4b39"><i class="fa fa-inr"></i>0</td> </tr>';
						}
						
				    	//Check if next mode exists...
				    	if(modes[index+1]){
				    		fetchCancellationSummaryCallback(index+1, modes, fromDate, toDate, grandSum, grandCount);
				    	}
				    	else{
				    		
							appendTotalFigures();

							//append UNPAID & PAID total figures
							function appendTotalFigures(){

								var total_paid_sum = 0;
								var total_paid_count = 0;
								var total_unpaid_sum = 0;
								var total_unpaid_count = 0;

								findPaidFigure();

								function findPaidFigure(){

									$.ajax({
									    type: 'GET',
									    url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-summary/_view/sumbypaymentstatus?startkey=["PAID", "'+fromDate+'"]&endkey=["PAID", "'+toDate+'"]',
									    timeout: 10000,
									    success: function(data) {

									    	if(data.rows.length > 0){
										    	total_paid_count = data.rows[0].value.count;
										    	total_paid_sum = data.rows[0].value.sum;
											}

											findUnpaidFigure();
											
									    },
									    error: function(data) {
									    	findUnpaidFigure();
									    }
									}); 
								} 	


								function findUnpaidFigure(){

									$.ajax({
									    type: 'GET',
									    url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-summary/_view/sumbypaymentstatus?startkey=["UNPAID","'+fromDate+'"]&endkey=["UNPAID","'+toDate+'"]',
									    timeout: 10000,
									    success: function(data) {

									    	if(data.rows.length > 0){
										    	total_unpaid_count = data.rows[0].value.count;
										    	total_unpaid_sum = data.rows[0].value.sum;
											}

											renderTotals();
											
									    },
									    error: function(data) {
									    	renderTotals();
									    }
									}); 

								}	

								function renderTotals(){
								
									document.getElementById("summaryRender_cancellationSummary").innerHTML += ''+
													'<tr class="summaryRowHighlight" style="background: #eee;">'+
														'<td>Cancelled before Settlement</td>'+
														'<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(total_unpaid_count != 0 ? total_unpaid_count+' Bills' : 'No Bills')+'</count><i class="fa fa-inr"></i>'+parseFloat(total_unpaid_sum).toFixed(2)+'</td>'+
													'</tr>'+
													'<tr class="summaryRowHighlight" style="background: #eee;">'+
														'<td>Cancelled after Settlement</td>'+
														'<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(total_paid_count != 0 ? total_paid_count+' Bills' : 'No Bills')+'</count><i class="fa fa-inr"></i>'+parseFloat(total_paid_sum).toFixed(2)+'</td>'+
													'</tr>'+
													'<tr class="summaryRowHighlight">'+
														'<td>Overall Cancellations</td>'+
														'<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Bills' : 'No Bills')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
													'</tr>';

								}						
							}



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

	          	if(modes.length == 0){
	          		document.getElementById("summaryRender_refundSummary").innerHTML = '<tag style="padding: 20px 0; display: block; color: gray">There are no payments modes added</tag>';
	          		return '';
	          	}

	          	var grandSum = 0;
	          	var grandCount = 0;

	          	  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/sumbyrefundmodes?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
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
														                                       '<td>Overall</td>'+
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

}




function fetchRefundSummaryCallback(index, modes, fromDate, toDate, grandSum, grandCount){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/sumbyrefundmodes?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
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
														                                       '<td>Overall</td>'+
														                                       '<td class="summaryLine1" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">'+(grandCount != 0 ? grandCount+' Orders' : 'No Orders')+'</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td>'+
														                                      '</tr> '
				    	}

				    },
				    error: function(data){

				    }
				  });  
}


//ITEM CANCELLATION REPORT
function fetchItemCancellations(){

	/*
		Top Items cancelled from different orders in given date range
	*/


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_itemCancellationSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

	document.getElementById("summaryRender_itemCancellationSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9; text-align: center" class="blink_me">Please Wait! The Report is being generated.</p>';
	document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';

	document.getElementById("itemCancellationSummaryReportOptions").innerHTML = ''+
									'<div id="itemCancellationSummaryReportActions" style="display: none">'+
                                        '<button data-hold="" text-hold="" id="itemCancellationSummaryReportAction_Download" onclick="itemCancellationReportActionDownload()" style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Download</button>'+
                                      '</div></center>';	

	

	showLoading(50000, 'Generating Report...');

	$.ajax({
		type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/accelerate_item_cancellations/_design/cancellation-summary/_view/itemscount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'",{}]&group=true',
		timeout: 50000,
		success: function(data) {

			hideLoading();

			var itemsList = data.rows;
			if(itemsList.length == 0){
				document.getElementById("summaryRender_itemCancellationSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items cancelled on the given dates</p>';
				document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';
				return '';
			}

			reduceByDate(itemsList);
			
			function reduceByDate(listOfItems){
				//Reduce Function 
				var reduced_list = listOfItems.reduce(function (accumulator, item) {
					if(accumulator[item.key[2]]){
						accumulator[item.key[2]].count += item.value;
					}
					else{
						accumulator[item.key[2]] = {
							"category": item.key[1],
							"count": item.value
						};
					}

				  	return accumulator;
				}, {});

				var formattedList = [];
				var keysCount = Object.keys(reduced_list);

				var counter = 1;
				for (x in reduced_list) {
				    formattedList.push({
				    	"name": x,
				    	"count": reduced_list[x].count,
				    	"category": reduced_list[x].category
				    });

				    if(counter == keysCount.length){ //last iteration
				    	// Ascending: Sorting
				    	formattedList.sort(function(obj1, obj2) {
		                	return obj2.count - obj1.count;
		              	});

				    	renderMostCancelledItems(formattedList);
				    }

				    counter++;
				}
				
			}

			function renderMostCancelledItems(itemsFilteredList){

				if(itemsFilteredList.length > 0){ 

					var upper_limit = 15;
					if(itemsFilteredList.length < 15){ //max of 20 items
						upper_limit = itemsFilteredList.length;
					}

					var renderContent = '';
					for(var i = 0; i < upper_limit; i++){
						renderContent += '<tr> <td><i class="fa fa-circle" style="color: #dd4b39; font-size: 12px; margin-right: 10px; top: -1px; position: relative;"></i><b style="color: #dd4b39; font-size: 17px; font-weight: 500; }">'+itemsFilteredList[i].name+(itemsFilteredList[i].category != '' && itemsFilteredList[i].category != 'UNKNOWN' ? '<tag style="color: gray; margin-left: 6px; font-size: 12px;">'+itemsFilteredList[i].category+'</tag>' : '')+'</b></td> <td class="summaryLine3" style="text-align: center; color: #dd4b39">'+itemsFilteredList[i].count+'</td> </tr>';
					}

					document.getElementById("summaryRender_itemCancellationSummary").innerHTML = renderContent;
					document.getElementById("completeItemCancellationSummaryButton").style.display = 'inline-block';
				} 
				else{ 
					document.getElementById("summaryRender_itemCancellationSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items cancelled on the given dates</p>';
					document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';
				}
			}
		},
		error: function(data){
			hideLoading();
			document.getElementById("summaryRender_itemCancellationSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">Unable to generate the Item Cancellations Summary on the given dates</p>';
			showToast('Not Found Error: Item Cancellations data not found. Please contact Accelerate Support.', '#e74c3c');
			document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';
			return '';								    	
		}
	});  

}



function generateOverallItemCancellationReport(){
	/*
		Items cancelled from orders in given date range
	*/

	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_itemCancellationSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

	document.getElementById("summaryRender_itemCancellationSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9; text-align: center" class="blink_me">Please Wait! The Report is being generated.</p>';
	document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';
	document.getElementById("itemCancellationSummaryReportActions").style.display = 'none';


	showLoading(50000, 'Generating Report...');

	$.ajax({
		type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/accelerate_item_cancellations/_design/cancellation-summary/_view/fetchall?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]&descending=false',
		timeout: 50000,
		success: function(data) {

			hideLoading();

			var itemsList = data.rows;

			if(itemsList.length == 0){
				document.getElementById("summaryRender_itemCancellationSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items cancelled on the given dates</p>';
				document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';
				return '';
			}


						//render data
						var renderContent = '';

						var n = 0;
						while(itemsList[n]){

							var cancelledData = itemsList[n].value;
							
							for(var i = 0; i < cancelledData.itemsRemoved.length; i++){
								renderContent += ''+
										'<tr>'+
											'<td>'+
												'<tag style="font-size: 12px">'+moment(cancelledData.time, 'hhmm').format('hh:mm A')+'</tag>'+
												'<tag style="color: #9c9c9c; font-size: 10px; display: block">'+cancelledData.date+'</tag>'+
											'</td>'+
											'<td style="font-weight: bold; font-family: \'Oswald\'; color: #6f6f6f;">'+cancelledData.itemsRemoved[i].qty+' <tag style="font-weight: 300;">x</tag></td>'+
											'<td>'+
												'<tag style="font-weight: 600; color: #6f6f6f;">'+cancelledData.itemsRemoved[i].name+'</tag>'+
												'<tag style="display: block; font-style: italic; color: #f39c12; font-size: 11px;">'+cancelledData.itemsRemoved[i].comments+'</tag>'+
											'</td>'+
											'<td>'+(cancelledData.modeType == 'DINE' ? 'Table #'+cancelledData.table : cancelledData.mode)+'</td>'+
											'<td>'+
												'<tag>by '+cancelledData.stewardName+'</tag>'+
												'<tag style="display: block; font-size: 11px; color: #999;">'+cancelledData.adminName+' approved</tag>'+
											'</td>'+
										'</tr>';
							}

							n++;
						}
					
						document.getElementById("summaryRender_itemCancellationSummary").innerHTML = renderContent;
						document.getElementById("completeItemCancellationSummaryButton").style.display = 'none';
						document.getElementById("itemCancellationSummaryReportActions").style.display = 'block';
					

						//Build Content for actions
						generateItemReportContentDownload();

						function generateItemReportContentDownload(){


							//Get staff info.
							var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
							
							if(jQuery.isEmptyObject(loggedInStaffInfo)){
								loggedInStaffInfo.name = 'Staff';
								loggedInStaffInfo.code = '0000000000';
							}	


							var reportInfo_branch = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '';
								
							if(reportInfo_branch == ''){
								showToast('System Error: Branch name not found. Please contact Accelerate Support.', '#e74c3c');
								return '';
							}


							var temp_address_modified = (window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '') + ' - ' + (window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '');  

							var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';

							var reportInfo_admin = loggedInStaffInfo.name;
							var reportInfo_time = moment().format('h:mm a, DD-MM-YYYY');
							var reportInfo_address = data_custom_footer_address != '' ? data_custom_footer_address : temp_address_modified;



							var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

							var reportInfo_title = 'Item Cancellations on <b>'+fancy_from_date+'</b>';
							var temp_report_title = 'Item Cancellations on '+fancy_from_date;
							if(fromDate != toDate){
								fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
								var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

								reportInfo_title = 'Item Cancellations from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
								temp_report_title = 'Item Cancellations from '+fancy_from_date+' to '+fancy_to_date;
							}

						    var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;


							var quickRendererContent = '';
							var n = 0;
							while(itemsList[n]){ 

								var cancelledData = itemsList[n].value;
								
								for(var i = 0; i < cancelledData.itemsRemoved.length; i++){
									quickRendererContent += ''+
											'<tr>'+
												'<td style="padding: 6px 0">'+
													'<tag style="font-size: 12px">'+moment(cancelledData.time, 'hhmm').format('hh:mm A')+'</tag>'+
													'<tag style="color: #9c9c9c; font-size: 10px; display: block">'+cancelledData.date+'</tag>'+
												'</td>'+
												'<td style="padding: 6px 0; font-weight: bold; font-family: \'Oswald\'; color: #6f6f6f;">'+cancelledData.itemsRemoved[i].qty+' <tag style="font-weight: 300;">x</tag></td>'+
												'<td style="padding: 6px 0">'+
													'<tag style="font-size: 13px; font-weight: 400; color: #6f6f6f;">'+cancelledData.itemsRemoved[i].name+'</tag>'+
													'<tag style="display: block; font-style: italic; color: #f39c12; font-size: 11px;">'+cancelledData.itemsRemoved[i].comments+'</tag>'+
												'</td>'+
												'<td style="text-align: center; padding: 6px 0; font-size: 12px;">'+(cancelledData.modeType == 'DINE' ? 'Table #'+cancelledData.table : cancelledData.mode)+'</td>'+
												'<td style="text-align: center; padding: 6px 0; font-size: 12px;">'+cancelledData.stewardName+'</td>'+
												'<td style="text-align: center; padding: 6px 0; font-size: 12px;">'+cancelledData.adminName+'</td>'+
											'</tr>';
								}

								n++;
							}


							var downloadRenderContent = ''+
																  '<div class="summaryTableSectionHolder">'+
															        '<div class="summaryTableSection">'+
															           '<div class="tableQuickHeader">'+
															              '<h1 class="tableQuickHeaderText">Item Cancellations</h1>'+
															           '</div>'+
															           '<div class="tableQuick">'+
															              '<table style="width: 100%">'+
															              	'<tr>'+
															              		'<td style="color: #FFF; background: #3c5163; padding: 10px 0 10px 4px; font-size: 15px;"></td>'+
															              		'<td colspan="2" style="color: #FFF; background: #3c5163; padding: 10px 0; font-size: 15px;">Item</td>'+
															              		'<td style="text-align: center; color: #FFF; background: #3c5163; padding: 10px 0; font-size: 15px;">Source</td>'+
															              		'<td style="text-align: center; color: #FFF; background: #3c5163; padding: 10px 0; font-size: 15px;">Captain</td>'+
															              		'<td style="text-align: center; color: #FFF; background: #3c5163; padding: 10px 0; font-size: 15px;">Approver</td>'+
															              	'<tr>'+ quickRendererContent+
															              '</table>'+
															           '</div>'+
															        '</div>'+
															      '</div>';


							var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';

						    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://accelerateengine.app/clients/'+temp_licenced_client+'/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px;text-align:center}.factsBox{margin-right: 5px; width:18%; display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#000;font-weight:bold;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:35%;display:block;text-align:center;float:right;position:absolute;top:20px;left:62%}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:55%;display:block;min-height:250px;}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
						    
						    var finalReport_downloadContent = cssData+
							    '<body>'+
							      '<div class="mainHeader">'+
							         '<div class="headerLeftBox">'+
							            '<div id="logo">'+
							               '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/email_logo.png">'+
							            '</div>'+
							            '<p class="headerAddress">'+reportInfo_address+'</p>'+
							         '</div>'+
							         '<div class="headerRightBox">'+
							            '<h1 class="headerBranch">'+reportInfo_branch+'</h1>'+
							            '<p class="headerAdmin">'+reportInfo_admin+'</p>'+
							            '<p class="headerTimestamp">'+reportInfo_time+'</p>'+
							         '</div>'+
							      '</div>'+
							      '<div class="introFacts" style="min-height: 0; margin-bottom: -25px;">'+
							         '<h1 class="reportTitle">'+reportInfo_title+'</h1>'+
							      '</div>'+
							      downloadRenderContent +
							      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
							         '<p class="footerNote">www.accelerate.net.in | support@accelerate.net.in</p>'+
							      '</div>'+
							    '</body>';

								var finalContent_EncodedDownload = encodeURI(finalReport_downloadContent);
								$('#itemCancellationSummaryReportAction_Download').attr('data-hold', finalContent_EncodedDownload);

								var finalContent_EncodedText = encodeURI(fancy_report_title_name);
								$('#itemCancellationSummaryReportAction_Download').attr('text-hold', finalContent_EncodedText);

						}

			
		},
		error: function(data){
			hideLoading();
			document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">Unable to generate the Item Cancellation Summary on the given dates</p>';
			showToast('Not Found Error: Item Cancellations data not found. Please contact Accelerate Support.', '#e74c3c');
			return '';								    	
		}
	});  
}


//ITEM REPORT ACTIONS
function itemCancellationReportActionDownload(){
	
	var htmlContentEncoded = $('#itemCancellationSummaryReportAction_Download').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	var textContentEncoded = $('#itemCancellationSummaryReportAction_Download').attr('text-hold');
	var textContent = decodeURI(textContentEncoded);

	showToast('Downloading Report', '#27ae60');
	generatePDFReport(htmlContent, textContent);
}





//ITEM WISE REPORT
function fetchItemSummary(){

	/*
		Top Items sold in given date range
	*/


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_itemSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

	document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9; text-align: center" class="blink_me">Please Wait! The Report is being generated.</p>';
	document.getElementById("completeItemSummaryButton").style.display = 'none';

	document.getElementById("itemSummaryReportOptions").innerHTML = ''+
									'<div id="itemSummaryReportActions" style="display: none">'+
                                        '<button data-hold="" text-hold="" id="itemSummaryReportAction_Download" onclick="itemReportActionDownload()" style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-download"></i> Download</button>'+
                                        '<button data-hold="" id="itemSummaryReportAction_Print" onclick="itemReportActionPrint()" style="margin-right: 5px" class="btn btn-success btn-sm"><i class="fa fa-print"></i> Print</button>'+
                                      '</div></center>';	

	//The total Sales w.r.t Items in the given DATE RANGE
	
	showLoading(50000, 'Generating Report...');

	$.ajax({
		type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/order-summary/_view/itemsCount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'",{}]&group=true',
		timeout: 50000,
		success: function(data) {

			hideLoading();

			var itemsList = data.rows;
			if(itemsList.length == 0){
				document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items sold on the given dates</p>';
				document.getElementById("completeItemSummaryButton").style.display = 'none';
				return '';
			}

			reduceByDate(itemsList);
			
			function reduceByDate(listOfItems){
				//Reduce Function 
				var reduced_list = listOfItems.reduce(function (accumulator, item) {
					if(accumulator[item.key[2]]){
						accumulator[item.key[2]].count += item.value;
					}
					else{
						accumulator[item.key[2]] = {
							"category": item.key[1],
							"count": item.value
						};
					}

				  	return accumulator;
				}, {});

				var formattedList = [];
				var keysCount = Object.keys(reduced_list);

				var counter = 1;
				for (x in reduced_list) {
				    formattedList.push({
				    	"name": x,
				    	"count": reduced_list[x].count,
				    	"category": reduced_list[x].category
				    });

				    if(counter == keysCount.length){ //last iteration
				    	// Ascending: Sorting
				    	formattedList.sort(function(obj1, obj2) {
		                	return obj2.count - obj1.count;
		              	});

				    	renderTopSellingItems(formattedList);
				    }

				    counter++;
				}
				
			}

			function renderTopSellingItems(itemsFilteredList){

				if(itemsFilteredList.length > 0){ 

					var upper_limit = 15;
					if(itemsFilteredList.length < 15){ //max of 20 items
						upper_limit = itemsFilteredList.length;
					}

					var renderContent = '';
					for(var i = 0; i < upper_limit; i++){
						renderContent += '<tr> <td><i class="fa fa-star" style="color: #ffd63f; font-size: 12px; margin-right: 10px; top: -1px; position: relative;"></i><b style="color: #e69d17; font-size: 17px; font-weight: 500; }">'+itemsFilteredList[i].name+(itemsFilteredList[i].category != '' && itemsFilteredList[i].category != 'UNKNOWN' ? '<tag style="color: gray; margin-left: 6px; font-size: 12px;">'+itemsFilteredList[i].category+'</tag>' : '')+'</b></td> <td class="summaryLine3" style="text-align: center; color: #e69d17">'+itemsFilteredList[i].count+'</td> </tr>';
					}

					document.getElementById("summaryRender_itemSummary").innerHTML = renderContent;
					document.getElementById("completeItemSummaryButton").style.display = 'inline-block';
				} 
				else{ 
					document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items sold on the given dates</p>';
					document.getElementById("completeItemSummaryButton").style.display = 'none';
				}
			}
		},
		error: function(data){
			hideLoading();
			document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">Unable to generate the Item Summary on the given dates</p>';
			showToast('Not Found Error: Order Summary data not found. Please contact Accelerate Support.', '#e74c3c');
			document.getElementById("completeItemSummaryButton").style.display = 'none';
			return '';								    	
		}
	});  

}


function generateOverallItemReport(){
	/*
		Items sold in given date range
	*/

	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_itemSummary").style.display = "block";

	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : getCurrentTime('DATE_STAMP');
	fromDate = getSummaryStandardDate(fromDate);

	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	toDate = getSummaryStandardDate(toDate);

	document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9; text-align: center" class="blink_me">Please Wait! The Report is being generated.</p>';
	document.getElementById("completeItemSummaryButton").style.display = 'none';
	document.getElementById("itemSummaryReportActions").style.display = 'none';

	//The total Sales w.r.t Items in the given DATE RANGE

	showLoading(50000, 'Generating Report...');

	$.ajax({
		type: 'GET',
		url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/order-summary/_view/itemsCount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'",{}]&group=true',
		timeout: 50000,
		success: function(data) {

			hideLoading();

			var itemsList = data.rows;

			if(itemsList.length == 0){
				document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items sold on the given dates</p>';
				document.getElementById("completeItemSummaryButton").style.display = 'none';
				return '';
			}

			reduceByDate(itemsList);
			
			function reduceByDate(listOfItems){
				//Reduce Function 
				var reduced_list = listOfItems.reduce(function (accumulator, item) {
				
				var accumulator_item_name = item.key[3] && item.key[3] != "" ? item.key[2] + ' ('+item.key[3]+')' : item.key[2];

					if(accumulator[accumulator_item_name]){
						accumulator[accumulator_item_name].count += item.value;
					}
					else{
						accumulator[accumulator_item_name] = {
							"category": item.key[1],
							"count": item.value,
							"price": item.key[4]
						};
					}

				  	return accumulator;
				}, {});


				var formattedList = [];
				var keysCount = Object.keys(reduced_list);

				var counter = 1;
				for (x in reduced_list) {
				    formattedList.push({
				    	"name": x,
				    	"count": reduced_list[x].count,
				    	"saleAmount": reduced_list[x].count * reduced_list[x].price,
				    	"category": reduced_list[x].category
				    });

				    if(counter == keysCount.length){ //last iteration
				    	// Ascending: Sorting
				    	formattedList.sort(function(obj1, obj2) {
		                	return obj2.count - obj1.count;
		              	});

				    	renderAllItemsSummary(formattedList);
				    }

				    counter++;
				}
				
			}

			function renderAllItemsSummary(itemsFilteredList){

				var categorySortedList = itemsFilteredList.reduce(function (accumulator, item) {
					if(accumulator[item.category]){
						accumulator[item.category].push({
							"name": item.name,
							"count": item.count,
							"saleAmount": item.saleAmount
						});
					}
					else{
						accumulator[item.category] = [];
						accumulator[item.category].push({
							"name": item.name,
							"count": item.count,
							"saleAmount": item.saleAmount
						});
					}

				  	return accumulator;
				}, {});



				var formattedCategoryList = [];
				var categoryCount = Object.keys(categorySortedList);

				var counter = 1;
				for (x in categorySortedList) {

					var n = 0;
					var sub_list = [];
					while(categorySortedList[x][n]){
						sub_list.push({
					    	"name": categorySortedList[x][n].name,
					    	"count": categorySortedList[x][n].count,
					    	"saleAmount": categorySortedList[x][n].saleAmount
						});
						n++;
					}


				    formattedCategoryList.push({
				    	"category": x,
				    	"items": sub_list
				    });

				    if(counter == categoryCount.length){ //last iteration
				    	renderAllItemsSummaryAfterProcess(formattedCategoryList);
				    }

				    counter++;
				}


				

				function renderAllItemsSummaryAfterProcess(categorisedItemsList){

					console.log(categorisedItemsList)

					if(categorisedItemsList.length > 0){ 

						var renderContent = '';

						var n = 0;
						while(categorisedItemsList[n]){ //render category

							var category_name = categorisedItemsList[n].category;
							if(category_name == 'UNKNOWN'){
								category_name = 'Unknown Category';
							}
							else if(category_name == 'MANUAL_UNKNOWN'){
								category_name = '<i style="color: #adadad">Manually Added Items</i>';
							}

							
							var renderItemsList = '';
							var itemsTotalSales = 0;
							for(var i = 0; i < categorisedItemsList[n].items.length; i++){
								itemsTotalSales += categorisedItemsList[n].items[i].saleAmount;
								renderItemsList += '<tr> <td><b style="color: #3e3e3e; font-size: 16px; font-weight: 400; }">'+categorisedItemsList[n].items[i].name+'</b></td> <td class="summaryLine3" style="text-align: center; font-size: 16px; color: #3e3e3e">'+categorisedItemsList[n].items[i].count+'</td> </tr>';
							}

							renderContent += '<tr class="summaryRowHighlight"><td style="font-size: 18px; font-weight: 600; background: #666; color: #FFF;">'+category_name+'</td> <td style="font-size: 18px; font-weight: 600; text-align: center; background: #666; color: #FFF;"><i class="fa fa-inr"></i>'+itemsTotalSales+'</td> </tr>' + renderItemsList;

							n++;
						}
					
						document.getElementById("summaryRender_itemSummary").innerHTML = renderContent;
						document.getElementById("completeItemSummaryButton").style.display = 'none';
						document.getElementById("itemSummaryReportActions").style.display = 'block';
					

						//Build Content for actions
						generateItemReportContentDownload();

						function generateItemReportContentDownload(){


							//Get staff info.
							var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
							
							if(jQuery.isEmptyObject(loggedInStaffInfo)){
								loggedInStaffInfo.name = 'Staff';
								loggedInStaffInfo.code = '0000000000';
							}	


							var reportInfo_branch = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '';
								
							if(reportInfo_branch == ''){
								showToast('System Error: Branch name not found. Please contact Accelerate Support.', '#e74c3c');
								return '';
							}


							var temp_address_modified = (window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '') + ' - ' + (window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '');  

							var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';

							var reportInfo_admin = loggedInStaffInfo.name;
							var reportInfo_time = moment().format('h:mm a, DD-MM-YYYY');
							var reportInfo_address = data_custom_footer_address != '' ? data_custom_footer_address : temp_address_modified;



							var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

							var reportInfo_title = 'Item wise Sales on <b>'+fancy_from_date+'</b>';
							var temp_report_title = 'Item wise Sales on '+fancy_from_date;
							if(fromDate != toDate){
								fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
								var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

								reportInfo_title = 'Item wise Sales from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
								temp_report_title = 'Item wise Sales from '+fancy_from_date+' to '+fancy_to_date;
							}

						    var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;



							var quickSummaryRendererContent = '';
							var categorySplitRenderContent = '';

							var n = 0;
							while(categorisedItemsList[n]){ //render category

								var category_name = categorisedItemsList[n].category;
								if(category_name == 'UNKNOWN'){
									category_name = 'Unknown Category';
								}
								else if(category_name == 'MANUAL_UNKNOWN'){
									category_name = '<i>Manually Added Items</i>';
								}

								var categoryWiseSum = 0;

								for(var i = 0; i < categorisedItemsList[n].items.length; i++){
									
									quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+categorisedItemsList[n].items[i].name+'</td><td class="tableQuickAmount">'+categorisedItemsList[n].items[i].count+'</td></tr>';
									categoryWiseSum += categorisedItemsList[n].items[i].saleAmount;

									if(i == categorisedItemsList[n].items.length - 1){ //last iteration
										
										categorySplitRenderContent += ''+
																  '<div class="summaryTableSectionHolder">'+
															        '<div class="summaryTableSection">'+
															           '<div class="tableQuickHeader">'+
															              '<h1 class="tableQuickHeaderText">'+category_name+'<tag style="float: right; margin-right: 20px; letter-spacing: unset !important"><tag style="font-size: 60%">Rs.</tag>'+categoryWiseSum+'</tag></h1>'+
															           '</div>'+
															           '<div class="tableQuick">'+
															              '<table style="width: 100%">'+
															                 '<col style="width: 70%">'+
															                 '<col style="width: 30%">'+
															                 quickSummaryRendererContent+
															              '</table>'+
															           '</div>'+
															        '</div>'+
															      '</div>';

										quickSummaryRendererContent = '';										

									}
								}

								n++;
							}

							var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';

						    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://accelerateengine.app/clients/'+temp_licenced_client+'/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px;text-align:center}.factsBox{margin-right: 5px; width:18%; display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#000;font-weight:bold;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:35%;display:block;text-align:center;float:right;position:absolute;top:20px;left:62%}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:55%;display:block;min-height:250px;}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
						    
						    var finalReport_downloadContent = cssData+
							    '<body>'+
							      '<div class="mainHeader">'+
							         '<div class="headerLeftBox">'+
							            '<div id="logo">'+
							               '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/email_logo.png">'+
							            '</div>'+
							            '<p class="headerAddress">'+reportInfo_address+'</p>'+
							         '</div>'+
							         '<div class="headerRightBox">'+
							            '<h1 class="headerBranch">'+reportInfo_branch+'</h1>'+
							            '<p class="headerAdmin">'+reportInfo_admin+'</p>'+
							            '<p class="headerTimestamp">'+reportInfo_time+'</p>'+
							         '</div>'+
							      '</div>'+
							      '<div class="introFacts" style="min-height: 0; margin-bottom: -25px;">'+
							         '<h1 class="reportTitle">'+reportInfo_title+'</h1>'+
							      '</div>'+
							      categorySplitRenderContent+
							      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
							         '<p class="footerNote">www.accelerate.net.in | support@accelerate.net.in</p>'+
							      '</div>'+
							    '</body>';

								var finalContent_EncodedDownload = encodeURI(finalReport_downloadContent);
								$('#itemSummaryReportAction_Download').attr('data-hold', finalContent_EncodedDownload);

								var finalContent_EncodedText = encodeURI(fancy_report_title_name);
								$('#itemSummaryReportAction_Download').attr('text-hold', finalContent_EncodedText);

								generateItemReportContentPrint();
						}



						function generateItemReportContentPrint(){


							//Get staff info.
							var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
							
							if(jQuery.isEmptyObject(loggedInStaffInfo)){
								loggedInStaffInfo.name = 'Staff';
								loggedInStaffInfo.code = '0000000000';
							}	


							var reportInfo_branch = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '';
								
							if(reportInfo_branch == ''){
								showToast('System Error: Branch name not found. Please contact Accelerate Support.', '#e74c3c');
								return '';
							}

							var temp_address_modified = (window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '') + ' - ' + (window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '');
							var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';

							var reportInfo_admin = loggedInStaffInfo.name;
							var reportInfo_time = moment().format('h:mm a, DD-MM-YYYY');
							var reportInfo_address = data_custom_footer_address != '' ? data_custom_footer_address : temp_address_modified;


							var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

							var reportInfo_title = 'Item wise Sales on <b>'+fancy_from_date+'</b>';
							var temp_report_title = 'Item wise Sales on '+fancy_from_date;
							if(fromDate != toDate){
								fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
								var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

								reportInfo_title = 'Item wise Sales from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
								temp_report_title = 'Item wise Sales from '+fancy_from_date+' to '+fancy_to_date;
							}

						    var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;



						    //Quick Summary Content
							var quickSummaryRendererContent = '';
							var categorySplitRenderContent = '';

							var n = 0;
							while(categorisedItemsList[n]){ //render category

								var category_name = categorisedItemsList[n].category;
								if(category_name == 'UNKNOWN'){
									category_name = 'Unknown Category';
								}
								else if(category_name == 'MANUAL_UNKNOWN'){
									category_name = '<i>Manually Added Items</i>';
								}

								var categoryItemsAmount = 0;

								for(var i = 0; i < categorisedItemsList[n].items.length; i++){
									
									quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+categorisedItemsList[n].items[i].name+'</td><td style="font-size: 11px; text-align: right">'+categorisedItemsList[n].items[i].count+'</td></tr>';
									
									categoryItemsAmount += categorisedItemsList[n].items[i].saleAmount;


									if(i == categorisedItemsList[n].items.length - 1){ //last iteration
										
										categorySplitRenderContent += ''+
										'<div class="KOTContent">'+
								    		 '<h2 style="text-align: left; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">'+category_name+' <tag style="float: right">Rs. '+categoryItemsAmount+'</tag></h2>'+
									         '<table style="width: 100%">'+
									            '<col style="width: 85%">'+
									            '<col style="width: 15%">'+ 
									            quickSummaryRendererContent+
									         '</table>'+
									    '</div>';	

										quickSummaryRendererContent = '';	
									}
								}

								n++;
							}


						    var cssData = '<head> <style type="text/css"> .KOTContent,.KOTHeader,.KOTNumberArea,.KOTSummary{width:100%;background-color:none}.subLabel,body{font-family:sans-serif}.KOTNumber,.invoiceNumber,.subLabel{letter-spacing:2px}#logo{min-height:60px;width:100%;border-bottom:2px solid #000}.KOTHeader,.KOTNumberArea{min-height:30px;padding:5px 0;border-bottom:1px solid #7b7b7b}.KOTContent{min-height:100px;font-size:11px;padding-top:6px;border-bottom:2px solid}.KOTSummary{font-size:11px;padding:5px 0;border-bottom:1px solid}.KOTContent td,.KOTContent table{border-collapse:collapse}.KOTContent td{border-bottom:1px dashed #444;padding:7px 0}.invoiceHeader,.invoiceNumberArea{padding:5px 0;border-bottom:1px solid #7b7b7b;width:100%;background-color:none}.KOTSpecialComments{min-height:20px;width:100%;background-color:none;padding:5px 0}.invoiceNumberArea{min-height:30px}.invoiceContent{min-height:100px;width:100%;background-color:none;font-size:11px;padding-top:6px;border-bottom:1px solid}.invoiceCharges{min-height:90px;font-size:11px;width:100%;background-color:none;padding:5px 0;border-bottom:2px solid}.invoiceCustomText,.invoicePaymentsLink{background-color:none;border-bottom:1px solid;width:100%}.invoicePaymentsLink{min-height:72px}.invoiceCustomText{padding:5px 0;font-size:12px;text-align:center}.subLabel{display:block;font-size:8px;font-weight:300;text-transform:uppercase;margin-bottom:5px}p{margin:0}.itemComments,.itemOldComments{font-style:italic;margin-left:10px}.serviceType{border:1px solid;padding:4px;font-size:12px;display:block;text-align:center;margin-bottom:8px}.tokenNumber{display:block;font-size:16px;font-weight:700}.billingAddress,.timeStamp{font-weight:300;display:block}.billingAddress{font-size:12px;line-height:1.2em}.mobileNumber{display:block;margin-top:8px;font-size:12px}.timeStamp{font-size:11px}.KOTNumber{font-size:15px;font-weight:700}.commentsSubText{font-size:12px;font-style:italic;font-weight:300;display:block}.invoiceNumber{font-size:15px;font-weight:700}.timeDisplay{font-size:75%;display:block}.rs{font-size:60%}.paymentSubText{font-size:10px;font-weight:300;display:block}.paymentSubHead{font-size:12px;font-weight:700;display:block}.qrCode{width:100%;max-width:120px;text-align:right}.addressContact,.addressText{color:gray;text-align:center}.addressText{font-size:10px;padding:5px 0}.addressContact{font-size:9px;padding:0 0 5px}.gstNumber{font-weight:700;font-size:10px}.attendantName,.itemQuantity{font-size:12px}#defaultScreen{position:fixed;left:0;top:0;z-index:100001;width:100%;height:100%;overflow:visible;background-image:url(../brand/pattern.jpg);background-repeat:repeat;padding-top:100px}.attendantName{font-weight:300;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.itemComments,.itemQuantity{font-weight:700;display:block}.itemOldComments{display:block;text-decoration:line-through}.itemOldQuantity{font-size:12px;text-decoration:line-through;display:block} </style> </head>';

						    var data_custom_header_image = window.localStorage.bill_custom_header_image ? window.localStorage.bill_custom_header_image : '';

						    var data_custom_header_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '';
							if(data_custom_header_client_name == ''){
							   data_custom_header_client_name = 'Item Report';
							}

						    var finalReport_printContent = cssData +
						    	'<body>'+
							      '<div id="logo">'+
							        (data_custom_header_image != '' ? '<center><img style="max-width: 90%" src=\''+data_custom_header_image+'\'/></center>' : '<h1 style="text-align: center">'+data_custom_header_client_name+'</h1>')+
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
							   	  categorySplitRenderContent+
							   	'</body>';

								var finalContent_EncodedPrint = encodeURI(finalReport_printContent);
								$('#itemSummaryReportAction_Print').attr('data-hold', finalContent_EncodedPrint);

						}

					}
					else{ 
						document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">There are no items sold on the given dates</p>';
					}
				}
			}
		},
		error: function(data){
			hideLoading();
			document.getElementById("summaryRender_itemSummary").innerHTML = '<p style="margin:30px 0; color: #a9a9a9">Unable to generate the Item Summary on the given dates</p>';
			showToast('Not Found Error: Order Summary data not found. Please contact Accelerate Support.', '#e74c3c');
			return '';								    	
		}
	});  
}


//ITEM REPORT ACTIONS
function itemReportActionDownload(){
	var htmlContentEncoded = $('#itemSummaryReportAction_Download').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	var textContentEncoded = $('#itemSummaryReportAction_Download').attr('text-hold');
	var textContent = decodeURI(textContentEncoded);

	showToast('Downloading Report', '#27ae60');
	generatePDFReport(htmlContent, textContent);
}

function itemReportActionPrint(){
	var htmlContentEncoded = $('#itemSummaryReportAction_Print').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	showToast('Printing Report', '#27ae60');
	printPDFReport(htmlContent);
}







/**************************************
 	SINGLE CLICK REPORT GENERATOR
***************************************/

function fetchSingleClickReport(){

	/*
		Allow to generate report only if 
		there are no bills pending for settlement
	*/


	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : '01-01-2018'; //Since the launch of Vega POS
	
	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	

				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/showall?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							if(data.rows.length > 0){
								showToast('Warning: Please settle all the pending bills on the given dates to continue.', '#e67e22');
							}
							else{
								fetchSingleClickReportAfterApproval();
							}
						},
						error: function(data) {
							showToast('Error: Unable to generate the report. Please try again.', '#e74c3c');
						}
					});  

}

function fetchSingleClickReportAfterApproval(){	


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
	var netGuestsCount = '-';
	var netRefundsProcessed = 0;
	var reportInfoExtras = [];
	var completeErrorList = []; //In case any API call causes Error
	var detailedListByBillingMode = []; //Billing mode wise
	var detailedListByPaymentMode = []; //Payment mode wise

	var weeklyProgressThisWeek = []; //This Week sales
	var weeklyProgressLastWeek = []; //Last Week sales
	var paymentGraphData = []; //For payment graphs
	var billsGraphData = []; //For bills graphs

	var startingBillNumber = '-';
	var endingBillNumber = '-';
	var netCancelledBills = 0;
	var netCancelledBillsSum = 0;

	//Net Sales Worth = Total Paid - (All the other charges) - (Discounts & Refunds) + (Tips)

	//Starting point
	runReportAnimation(0);
	setTimeout(singleClickTotalPaid, 1000);


	//Step 1: Total Paid Amount
	function singleClickTotalPaid(){
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/totalguests?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					netGuestsCount = data.rows[0].value.sum;
				}

				//Step 1-3:
				singleClickLastInvoiceNumbers();

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

	//Step 1-3: First and last invoice number
	function singleClickLastInvoiceNumbers(){

		runReportAnimation(5); //of Step 1-2 which takes 1 units

		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoices/_view/getlastbill?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					startingBillNumber = data.rows[0].value;
					endingBillNumber = data.rows[data.rows.length - 1].value;
				}

				//Step 2:
				singleClickExtraCharges();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 1.3,
					"error": "Failed to find the starting and ending invoice numbers"
				});
				return '';
			}
		});  
	}		


	//Step 2: 
	function singleClickExtraCharges(){

		runReportAnimation(9); //of Step 1-3 which takes 1 units

	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

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
					    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
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
									url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
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
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
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
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_discounts?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_roundoff?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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
						"name": "Waive Off",
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
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_tips?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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

		runReportAnimation(28); //of Step 5 which takes 3 units

		//Refunded but NOT cancelled
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_refundCount = 0;
				var temp_refundSum = 0;

				if(data.rows.length > 0){
					temp_refundCount = data.rows[0].value.count;
					temp_refundSum = data.rows[0].value.sum;
				}

				netRefundsProcessed = temp_refundSum;

				completeReportInfo.push({
					"name": "Refunds Issued",
					"type": "NEGATIVE",
					"value": temp_refundSum,
					"count": temp_refundCount
				});	

				//Step 6.1 : Get cancelled invoices count
				singleClickCancelledInvoices();


				/*
					Cancelled and Refunded Orders 
					(neglected and moved to under different header)
				*/
				 

			},
			error: function(data){
				completeErrorList.push({
				    "step": 6,
					"error": "Failed to read refunds issued"
				});				

				//Step 6.1 : Get cancelled invoices count
				singleClickCancelledInvoices(); 
				return '';
			}
		});  		
	}


	//Step 6.1 : Get cancelled invoices count
	function singleClickCancelledInvoices(){

		runReportAnimation(30); //of Step 6 which takes 2 units
	
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoices/_view/getcount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					netCancelledBills = data.rows[0].value.count;
					netCancelledBillsSum = data.rows[0].value.sum;
				}

				//Step 7: Render everything 
				singleClickSummaryFinal();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 6.1,
					"error": "Failed to find the number of cancelled invoices"
				});
				
				//Step 7: Render everything 
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
										    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
										    timeout: 10000,
										    success: function(data) {

										    	var preserved_sum = 0;
										    	var preserved_count = 0;
										    	if(data.rows.length > 0){
										    		preserved_sum = data.rows[0].value.sum;
										    		preserved_count = data.rows[0].value.count;
										    	}


										    	//Check for any refunds in this mode.
										    	//For this given BILLING MODE, Check for any refunds in this mode.
									          	$.ajax({
												    type: 'GET',
												    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode_refundedamounts?startkey=["'+modes[0].name+'","'+fromDate+'"]&endkey=["'+modes[0].name+'","'+toDate+'"]',
												    timeout: 10000,
												    success: function(data) {

												    	var refunded_sum = 0;
												    	if(data.rows.length > 0){
												    		refunded_sum = data.rows[0].value.sum;
												    	}


														detailedListByBillingMode.push({
															"name": modes[0].name,
															"value": preserved_sum - refunded_sum,
															"count": preserved_count
														});


														billsGraphData.push({
															"name": modes[0].name,
															"value": preserved_sum - refunded_sum 
														});

														//Check if next exits in BILLING_MODES
														if(modes[1]){
															singleClickDetailedByModesCallback(1, modes);
														}
														else{
															singleClickRenderBillsGraph();
														}	


												    },
												    error: function(data){
														completeErrorList.push({
														    "step": 8,
															"error": "Failed to calculate refunds in different billing modes"
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


	//Step 8 : Callback
	function singleClickDetailedByModesCallback(index, modes){

							          	//For a given BILLING MODE, the total Sales in the given DATE RANGE
										$.ajax({
										    type: 'GET',
										    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
										    timeout: 10000,
										    success: function(data) {

										    	var preserved_sum = 0;
										    	var preserved_count = 0;
										    	if(data.rows.length > 0){
										    		preserved_sum = data.rows[0].value.sum;
										    		preserved_count = data.rows[0].value.count;
										    	}


										    	//Check for any refunds in this mode.
										    	//For this given BILLING MODE, Check for any refunds in this mode.
									          	$.ajax({
												    type: 'GET',
												    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmode_refundedamounts?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
												    timeout: 10000,
												    success: function(data) {

												    	var refunded_sum = 0;
												    	if(data.rows.length > 0){
												    		refunded_sum = data.rows[0].value.sum;
												    	}

														detailedListByBillingMode.push({
															"name": modes[index].name,
															"value": preserved_sum - refunded_sum,
															"count": preserved_count
														});


														billsGraphData.push({
															"name": modes[index].name,
															"value": preserved_sum - refunded_sum 
														});

														//Check if next exits in BILLING_MODES
														if(modes[index+1]){
															singleClickDetailedByModesCallback(index+1, modes);
														}
														else{
															singleClickRenderBillsGraph();
														}	


												    },
												    error: function(data){
														completeErrorList.push({
														    "step": 8,
															"error": "Failed to calculate refunds in different billing modes"
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

	              	if(modes.length == 0){
						completeErrorList.push({
						    "step": 9,
							"error": "Failed to calculate sales by different payment modes"
						});				

						//Skip and go to next step
						singleClickPaymentModesSplitByExtras(); 
						return '';
		          	}
		          	else{
						
						  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE

						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
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
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
											    temp_sum += data.rows[0].value.sum;
											}


											//Check if any refunds issued 
											$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_refundedamounts?startkey=["'+modes[0].code+'","'+fromDate+'"]&endkey=["'+modes[0].code+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													var refund_amount = 0;

													if(data.rows.length > 0){
													    refund_amount = data.rows[0].value.sum;
													}

										    		if(temp_sum > 0){
										    			paymentGraphData.push({
												    		"name": modes[0].name,
												    		"value": temp_sum - refund_amount
												    	})
										    		}	

										    		detailedListByPaymentMode.push({
										    			"name": modes[0].name,
										    			"code": modes[0].code,
										    			"value": temp_sum - refund_amount,
										    			"count": temp_count
										    		});									


											    	//Check if next mode exists...
											    	if(modes[1]){
											    		singleClickDetailedByPaymentCallback(1, modes, paymentGraphData);
											    	}
											    	else{
											    		//Step 10: Weekly Progress
											    		singleClickPaymentModesSplitByExtras();
											    	}

												},
												error: function(data){
													completeErrorList.push({
													    "step": 9,
														"error": "Failed to calculate sales by different payment modes"
													});				

													//Skip and go to next step
													singleClickPaymentModesSplitByExtras(); 
													return '';
												}
											}); 



										},
										error: function(data){
											completeErrorList.push({
											    "step": 9,
												"error": "Failed to calculate sales by different payment modes"
											});				

											//Skip and go to next step
											singleClickPaymentModesSplitByExtras(); 
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
				singleClickPaymentModesSplitByExtras(); 
				return '';
	          }
	        }
	        else{
				completeErrorList.push({
				    "step": 9,
					"error": "Failed to calculate sales by different payment modes"
				});				

				//Skip and go to next step
				singleClickPaymentModesSplitByExtras(); 
				return '';
	        }
	      },
	      error: function(data) {
				completeErrorList.push({
				    "step": 9,
					"error": "Failed to calculate sales by different payment modes"
				});				

				//Skip and go to next step
				singleClickPaymentModesSplitByExtras(); 
				return '';
	      }

	    });
	}

	//Step 9: Callback
	function singleClickDetailedByPaymentCallback(index, modes, paymentGraphData){

						  //For a given PAYMENT MODE, the total Sales in the given DATE RANGE

						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
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
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_multiple?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
											    temp_sum += data.rows[0].value.sum;
											}



											//Check if any refunds issued 
											$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmode_refundedamounts?startkey=["'+modes[index].code+'","'+fromDate+'"]&endkey=["'+modes[index].code+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													var refund_amount = 0;

													if(data.rows.length > 0){
													    refund_amount = data.rows[0].value.sum;
													}

										    		if(temp_sum > 0){
										    			paymentGraphData.push({
												    		"name": modes[index].name,
												    		"value": temp_sum - refund_amount
												    	})
										    		}	

										    		detailedListByPaymentMode.push({
										    			"name": modes[index].name,
										    			"code": modes[index].code,
										    			"value": temp_sum - refund_amount,
										    			"count": temp_count
										    		});									


											    	//Check if next mode exists...
											    	if(modes[index+1]){
											    		singleClickDetailedByPaymentCallback(index+1, modes, paymentGraphData);
											    	}
											    	else{
											    		//Step 10: Weekly Progress
											    		singleClickPaymentModesSplitByExtras();
											    	}

												},
												error: function(data){
													completeErrorList.push({
													    "step": 9,
														"error": "Failed to calculate sales by different payment modes"
													});				

													//Skip and go to next step
													singleClickPaymentModesSplitByExtras(); 
													return '';
												}
											}); 


										},
										error: function(data){
											completeErrorList.push({
											    "step": 9,
												"error": "Failed to calculate sales by different payment modes"
											});				

											//Skip and go to next step
											singleClickPaymentModesSplitByExtras(); 
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
								singleClickPaymentModesSplitByExtras(); 
								return '';					        	
					      	}
					    });
	}


	//Step 9.1: Render Graph (Payments)
	function singleClickRenderPaymentsGraph(){

			window.localStorage.graphImageDataPayments = '';

			if(paymentGraphData.length == 0){
				//Skip and go to next step
				singleClickPaymentModesSplitByExtras(); 
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

				//Go to Step 9.2
				singleClickPaymentModesSplitByExtras();
			}
	}


	//Step 9.2: Payment Modes (detailed w.r.t Extras, SGST, CGST etc.)
	function singleClickPaymentModesSplitByExtras(){
		
		runReportAnimation(70); //of Step 9.1 which takes 5 units
	
		preloadExtrasValues();

		//Preload Billing Parameters (Extras and Custom Extras)
		function preloadExtrasValues(){
			
			    var requestData = {
			      "selector"  :{ 
			                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
			          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

			            var modes = data.docs[0].value;

			          	if(modes.length == 0){
			          		completeErrorList.push({
							    "step": 9.2,
								"error": "Failed to calculate the extras and custom extras against each payment modes"
							});	

							singleClickWeeklyProgress();	

			          		return '';
			          	}
			          	else{
			          		//Start Processing
			          		getDetailedByExtras(0, modes);
			          	}

			          }
			          else{
			          		completeErrorList.push({
							    "step": 9.2,
								"error": "Failed to calculate the extras and custom extras against each payment modes"
							});	

							singleClickWeeklyProgress();	

			          		return '';
			          }
			        }
			        else{
			          	completeErrorList.push({
						    "step": 9.2,
							"error": "Failed to calculate the extras and custom extras against each payment modes"
						});	

						singleClickWeeklyProgress();	

			          	return '';
					}
			        
			      },
			      error: function(data) {
			      	completeErrorList.push({
					    "step": 9.2,
						"error": "Failed to calculate the extras and custom extras against each payment modes"
					});	
					
					singleClickWeeklyProgress();	

			      	return '';  

			      }

			    });
		}



		//START PROCESSING
		function getDetailedByExtras(greatIndex, modes){
			
			/*
				For a given payment mode, calculate the extras and custom extras 
				coming under this mode. For ex., for Cash Rs. 200, CGST Rs. 5, 
				SGST Rs. 5 etc.
			*/

			var extrasTemplate = [];

			if(detailedListByPaymentMode[greatIndex]){
				getDetailedExtrasForPaymentMode(detailedListByPaymentMode[greatIndex].code, modes)
			}
			else{
				singleClickWeeklyProgress();
			}


			function getDetailedExtrasForPaymentMode(selectedPaymentMode, modes){

			          	  //For a given EXTRAS, the total Sales in the given DATE RANGE
						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
						    timeout: 10000,
						    success: function(data) {

						    	var temp_count = 0;
						    	var temp_sum = 0;

						    	if(data.rows.length > 0){
						    		temp_count = data.rows[0].value.count;
						    		temp_sum = data.rows[0].value.sum;
						    	}


						    		//Now check in custom Extras
							    	$.ajax({
										type: 'GET',
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_custom?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
											    temp_sum += data.rows[0].value.sum;
											}


											//Now check in split payments
									    	$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													
													if(data.rows.length > 0){
													    temp_sum += data.rows[0].value.sum;
													}


													//Now check in split payments with custom extras
											    	$.ajax({
														type: 'GET',
														url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple_custom?startkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[0].name+'","'+toDate+'"]',
														timeout: 10000,
														success: function(data) {

															if(data.rows.length > 0){
															    temp_sum += data.rows[0].value.sum;
															}

															temp_sum = parseFloat(temp_sum).toFixed(2);
															temp_sum = parseFloat(temp_sum);

															extrasTemplate.push({
																"name": modes[0].name,
																"amount": temp_sum
															});

													    	//Check if next mode exists...
													    	if(modes[1]){
													    		getDetailedExtrasForPaymentModeCallback(1, modes, selectedPaymentMode);
													    	}
													    	else{

													    		//Save changes
													    		detailedListByPaymentMode[greatIndex].detailedExtras = extrasTemplate;

													    		getDetailedByExtras(greatIndex + 1, modes);
													    	}
															

														},
														error: function(data){
											          		completeErrorList.push({
															    "step": 9.2,
																"error": "Failed to calculate the extras and custom extras against each payment modes"
															});	

															singleClickWeeklyProgress();	

											          		return '';
														}
													}); //split payments with custom extras



												},
												error: function(data){
									          		completeErrorList.push({
													    "step": 9.2,
														"error": "Failed to calculate the extras and custom extras against each payment modes"
													});	

													singleClickWeeklyProgress();	

									          		return '';
												}
											}); //split payments



										},
										error: function(data){
							          		completeErrorList.push({
											    "step": 9.2,
												"error": "Failed to calculate the extras and custom extras against each payment modes"
											});	

											singleClickWeeklyProgress();	

							          		return '';
										}
									}); 


						    },
						    error: function(data){
				          		completeErrorList.push({
								    "step": 9.2,
									"error": "Failed to calculate the extras and custom extras against each payment modes"
								});	

								singleClickWeeklyProgress();	

				          		return '';
						    }
						  });  


			} // end - getDetailedExtrasForPaymentMode


			function getDetailedExtrasForPaymentModeCallback(index, modes, selectedPaymentMode){
	          	
	          	  //For a given PAYMENT MODE, the extras in the given DATE RANGE
				  
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_custom?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
									    temp_sum += data.rows[0].value.sum;
									}


						    		//Now check in split payments
							    	$.ajax({
										type: 'GET',
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_sum += data.rows[0].value.sum;
											}


								    		//Now check in split payments with custom extras
									    	$.ajax({
												type: 'GET',
												url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbypaymentmodeandextras_multiple_custom?startkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedPaymentMode+'","'+modes[index].name+'","'+toDate+'"]',
												timeout: 10000,
												success: function(data) {

													if(data.rows.length > 0){
													    temp_sum += data.rows[0].value.sum;
													}

													temp_sum = parseFloat(temp_sum).toFixed(2);
													temp_sum = parseFloat(temp_sum);

													extrasTemplate.push({
														"name": modes[index].name,
														"amount": temp_sum
													});

											    	//Check if next mode exists...
											    	if(modes[index+1]){
											    		getDetailedExtrasForPaymentModeCallback(index+1, modes, selectedPaymentMode);
											    	}
											    	else{

											    		//Save changes
													    detailedListByPaymentMode[greatIndex].detailedExtras = extrasTemplate;

											    		getDetailedByExtras(greatIndex + 1, modes);
											    	}													

												},
												error: function(data){
											      	completeErrorList.push({
													    "step": 9.2,
														"error": "Failed to calculate the extras and custom extras against each payment modes"
													});	
													
													singleClickWeeklyProgress();	

											      	return ''; 
												}
											}); //split payments with custom extras
										



										},
										error: function(data){
									      	completeErrorList.push({
											    "step": 9.2,
												"error": "Failed to calculate the extras and custom extras against each payment modes"
											});	
											
											singleClickWeeklyProgress();	

									      	return ''; 
										}
									}); //split payments




								},
								error: function(data){
							      	completeErrorList.push({
									    "step": 9.2,
										"error": "Failed to calculate the extras and custom extras against each payment modes"
									});	
									
									singleClickWeeklyProgress();	

							      	return ''; 
								}
							}); 


				    },
				    error: function(data){
				      	completeErrorList.push({
						    "step": 9.2,
							"error": "Failed to calculate the extras and custom extras against each payment modes"
						});	
						
						singleClickWeeklyProgress();	

				      	return ''; 
				    }
				  });  

			} // end - getDetailedExtrasForPaymentModeCallback


		} // end - getDetailedByExtras


	}



	//Step 10: Weekly Progress
	function singleClickWeeklyProgress(){


		runReportAnimation(75); //of Step 9 which takes 5 units
		
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
				url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+mydate+'"]&endkey=["'+mydate+'"]',
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

		runReportAnimation(95); //of Step 11 which completed the data processing


		//Get staff info.
		var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
		
		if(jQuery.isEmptyObject(loggedInStaffInfo)){
			loggedInStaffInfo.name = 'Staff';
			loggedInStaffInfo.code = '0000000000';
		}	


		var reportInfo_branch = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '';
			
		if(reportInfo_branch == ''){
			showToast('System Error: Branch name not found. Please contact Accelerate Support.', '#e74c3c');
			return '';
		}

		var temp_address_modified = (window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '') + ' - ' + (window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '');
		var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';

		var reportInfo_admin = loggedInStaffInfo.name;
		var reportInfo_time = moment().format('h:mm a, DD-MM-YYYY');
		var reportInfo_address = data_custom_footer_address != '' ? data_custom_footer_address : temp_address_modified;


		//Reset Token Number and KOT Number (if preference set)
		resetBillingCounters();

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
		      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
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
		      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
		      d++;
		    }

		    //Detailed Payment (Extras and Custom Extras for each payment mode)
		    var detailedByExtrasForPaymentRenderContent = '';
		    var detailedExtrasContentHeader = '';
		    var t = 0;
		    while(detailedListByPaymentMode[t]){

		    	var detailedExtrasContent = '';
		    	var netAmount = detailedListByPaymentMode[t].value;

		    	for(var e = 0; e < detailedListByPaymentMode[t].detailedExtras.length; e++){
		    	
		    		detailedExtrasContent += '<td class="tableQuickAmount" style="text-align: center;">'+detailedListByPaymentMode[t].detailedExtras[e].amount+'</td>';
		    	
		    		netAmount -= detailedListByPaymentMode[t].detailedExtras[e].amount;

			    	if(t == 0){
			    		detailedExtrasContentHeader += '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">'+detailedListByPaymentMode[t].detailedExtras[e].name+'</td>';
			    	}
		    	}

		    	detailedByExtrasForPaymentRenderContent += '' +
									    		'<tr>'+
									    			'<td class="tableQuickBrief">'+detailedListByPaymentMode[t].name+'</td>'+
									    			'<td class="tableQuickAmount" style="text-align: center"><span class="price">Rs.</span>'+parseFloat(netAmount).toFixed(0)+'</td>'+
									    			detailedExtrasContent +
									    			'<td class="tableQuickAmount" style="text-align: center"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[t].value).toFixed(0)+'</td>'+
									    		'</tr>';


		    	t++;
		    }

		    detailedExtrasContentHeader = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14;">Mode</td> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Gross</td>' + detailedExtrasContentHeader + '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Total</td> </tr>';
		    detailedByExtrasForPaymentRenderContent = detailedExtrasContentHeader + detailedByExtrasForPaymentRenderContent;


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


		    var detailedByExtrasForPaymentRenderContentFinal = '';
		    if(detailedByExtrasForPaymentRenderContent != ''){

		    	detailedByExtrasForPaymentRenderContentFinal = ''+
			        '<div class="summaryTableSectionHolder">'+
			        '<div class="summaryTableSection">'+
			           '<div class="tableQuickHeader">'+
			              '<h1 class="tableQuickHeaderText">DETAILED CHARGES</h1>'+
			           '</div>'+
			           '<div class="tableQuick">'+
			              '<table style="width: 100%">'+
			                 '<col style="width: 70%">'+
			                 '<col style="width: 30%">'+
			                 detailedByExtrasForPaymentRenderContent+
			              '</table>'+
			           '</div>'+
			        '</div>'+
			        '</div>';	
		    }


		    //Bill Cancellations
			var downloadSummaryCancellations = '';
			if(netCancelledBills > 0){
			    	downloadSummaryCancellations = ''+
				        '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">BILL CANCELLATIONS</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 '<tr><td class="tableQuickBrief">Number of Bills</td><td class="tableQuickAmount">'+netCancelledBills+'</td></tr>'+
				                 '<tr><td class="tableQuickBrief">Cancelled Amount</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(netCancelledBillsSum).toFixed(0)+'</td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';		    	
			}



		    var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';
		    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://accelerateengine.app/clients/'+temp_licenced_client+'/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px;text-align:center}.factsBox{margin-right: 5px; width:18%; display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#000;font-weight:bold;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:35%;display:block;text-align:center;float:right;position:absolute;top:20px;left:62%}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:55%;display:block;min-height:250px;}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
		    
		    var finalReport_downloadContent = cssData+
			    '<body>'+
			      '<div class="mainHeader">'+
			         '<div class="headerLeftBox">'+
			            '<div id="logo">'+
			               '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/email_logo.png">'+
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
			            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Sales</p></div>'+ 
			            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netSalesWorth).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
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
			                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Gross Amount</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
			                 quickSummaryRendererContent+
			                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Net Sales</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(2)+'</td></tr>'+
			              '</table>'+
			           '</div>'+
			        '</div>'+
			      '</div>'+
			      '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+
			      salesByBillingModeRenderContentFinal+
			      salesByPaymentTypeRenderContentFinal+
			      detailedByExtrasForPaymentRenderContentFinal+
			      downloadSummaryCancellations+
			      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
			         '<p class="footerNote">www.accelerate.net.in | support@accelerate.net.in</p>'+
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

				var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';

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
			                '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/report_trend_images_repo/'+temp_image_name+'.png" style="max-width: 90%">'+
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
			      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
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
			      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
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


			    //Detailed Payment (Extras and Custom Extras for each payment mode)
			    var detailedByExtrasForPaymentRenderContent = '';
			    var detailedExtrasContentHeader = '';
			    var t = 0;
			    while(detailedListByPaymentMode[t]){

			    	var detailedExtrasContent = '';
			    	var netAmount = detailedListByPaymentMode[t].value;

			    	for(var e = 0; e < detailedListByPaymentMode[t].detailedExtras.length; e++){
			    	
			    		detailedExtrasContent += '<td class="tableQuickAmount" style="text-align: center;">'+detailedListByPaymentMode[t].detailedExtras[e].amount+'</td>';
			    	
			    		netAmount -= detailedListByPaymentMode[t].detailedExtras[e].amount;

				    	if(t == 0){
				    		detailedExtrasContentHeader += '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">'+detailedListByPaymentMode[t].detailedExtras[e].name+'</td>';
				    	}
			    	}

			    	detailedByExtrasForPaymentRenderContent += '' +
										    		'<tr>'+
										    			'<td class="tableQuickBrief">'+detailedListByPaymentMode[t].name+'</td>'+
										    			'<td class="tableQuickAmount" style="text-align: center"><span class="price">Rs.</span>'+parseFloat(netAmount).toFixed(0)+'</td>'+
										    			detailedExtrasContent +
										    			'<td class="tableQuickAmount" style="text-align: center"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[t].value).toFixed(0)+'</td>'+
										    		'</tr>';


			    	t++;
			    }

			    detailedExtrasContentHeader = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14;">Mode</td> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Gross</td>' + detailedExtrasContentHeader + '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Total</td> </tr>';
			    detailedByExtrasForPaymentRenderContent = detailedExtrasContentHeader + detailedByExtrasForPaymentRenderContent;

			    var detailedByExtrasForPaymentRenderContentFinal = '';
			    if(detailedByExtrasForPaymentRenderContent != ''){

			    	detailedByExtrasForPaymentRenderContentFinal = ''+
				        '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">DETAILED CHARGES</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 detailedByExtrasForPaymentRenderContent+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';	
			    }



			    //Bill Cancellations
			    var emailSummaryCancellations = '';
			    if(netCancelledBills > 0){
			    	emailSummaryCancellations = ''+
				        '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">BILL CANCELLATIONS</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 '<tr><td class="tableQuickBrief">Number of Bills</td><td class="tableQuickAmount">'+netCancelledBills+'</td></tr>'+
				                 '<tr><td class="tableQuickBrief">Cancelled Amount</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(netCancelledBillsSum).toFixed(0)+'</td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';		    	
			    }



			    var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';
			    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://accelerateengine.app/clients/'+temp_licenced_client+'/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px;text-align:center}.factsBox{margin-right: 5px; width:18%; display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#000;font-weight:bold;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:35%;display:block;text-align:center;float:right;position:absolute;top:20px;left:62%}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:55%;display:block;min-height:250px;}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
			    
			    var finalReport_emailContent = '<html>'+cssData+
				    '<body>'+
				      '<div class="mainHeader">'+
				         '<div class="headerLeftBox">'+
				            '<div id="logo">'+
				               '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/email_logo.png">'+
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
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Sales</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netSalesWorth).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
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
				                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Gross Sales</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
				                 quickSummaryRendererContent+
				                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Net Sales</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(2)+'</td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				      '</div>'+
				      '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+
				      salesByBillingModeRenderContentFinal+
				      salesByPaymentTypeRenderContentFinal+
				      detailedByExtrasForPaymentRenderContentFinal+
				      emailSummaryCancellations+
				      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
				         '<p class="footerNote">www.accelerate.net.in | support@accelerate.net.in</p>'+
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
			            '<tr><td style="font-size: 11px"><b>Gross Sales</b></td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
			            quickSummaryRendererContent+
			            '<tr><td style="font-size: 13px"><b>Net Sales</b></td><td style="font-size: 13px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(2)+'</td></tr>'+
			         '</table>'+
			    '</div>';

		    //Sales by Billing Modes Content
		    var printSummaryBillsContent = '';
		    var c = 0;
		    var billSharePercentage = 0;
		    while(detailedListByBillingMode[c]){
		      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
		      printSummaryBillsContent += '<tr><td style="font-size: 11px">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #000">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span style="font-weight:bold; font-size: 60%; display: block;">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
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
		      printSummaryPaymentContent += '<tr><td style="font-size: 11px">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #000">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span style="font-weight:bold; font-size: 60%; display: block;">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>'; 
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


		    //Bill Cancellations
		    var printSummaryCancellations = '';
		    if(netCancelledBills > 0){
		    	printSummaryCancellations = ''+
			    	'<div class="KOTContent">'+
			    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">BILL CANCELLATIONS</h2>'+
				         '<table style="width: 100%">'+
				            '<col style="width: 85%">'+
				            '<col style="width: 15%">'+ 
				            	'<tr>'+
				            		'<td style="font-size: 11px">Number of Bills</td>'+
				            		'<td style="font-size: 11px; text-align: right">'+netCancelledBills+'</td>'+
				            	'</tr>'+
				            	'<tr>'+
				            		'<td style="font-size: 11px">Cancelled Amount</td>'+
				            		'<td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(netCancelledBillsSum).toFixed(0)+'</td>'+
				            	'</tr>'+
				         '</table>'+
				    '</div>';			    	
		    }



		    //Other Details
		    var printSummaryCounts = ''+
			    	'<div class="KOTContent">'+
			    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">OTHER DETAILS</h2>'+
				         '<table style="width: 100%">'+
				            '<col style="width: 85%">'+
				            '<col style="width: 15%">'+ 
				            '<tr><td style="font-size: 10px">Total Guests</td><td style="font-size: 13px; text-align: right;">'+netGuestsCount+'</td></tr>'+
				            '<tr><td style="font-size: 10px">First Bill No.</td><td style="font-size: 13px; text-align: right;">'+startingBillNumber+'</td></tr>'+
				            '<tr><td style="font-size: 10px">Last Bill No.</td><td style="font-size: 13px; text-align: right;">'+endingBillNumber+'</td></tr>'+
				            '<tr><td style="font-size: 10px">Total Bills</td><td style="font-size: 13px; text-align: right;">'+completeReportInfo[0].count+'</td></tr>'+
				            (netCancelledBills == 0 ? '<tr><td style="font-size: 10px">Cancelled Bills</td><td style="font-size: 13px; text-align: right;">0</td></tr>' : '')+
				         '</table>'+
				    '</div>';




		    var cssData = '<head> <style type="text/css"> .KOTContent,.KOTHeader,.KOTNumberArea,.KOTSummary{width:100%;background-color:none}.subLabel,body{font-family:sans-serif}.KOTNumber,.invoiceNumber,.subLabel{letter-spacing:2px}#logo{min-height:60px;width:100%;border-bottom:2px solid #000}.KOTHeader,.KOTNumberArea{min-height:30px;padding:5px 0;border-bottom:1px solid #7b7b7b}.KOTContent{min-height:100px;font-size:11px;padding-top:6px;border-bottom:2px solid}.KOTSummary{font-size:11px;padding:5px 0;border-bottom:1px solid}.KOTContent td,.KOTContent table{border-collapse:collapse}.KOTContent td{border-bottom:1px dashed #444;padding:7px 0}.invoiceHeader,.invoiceNumberArea{padding:5px 0;border-bottom:1px solid #7b7b7b;width:100%;background-color:none}.KOTSpecialComments{min-height:20px;width:100%;background-color:none;padding:5px 0}.invoiceNumberArea{min-height:30px}.invoiceContent{min-height:100px;width:100%;background-color:none;font-size:11px;padding-top:6px;border-bottom:1px solid}.invoiceCharges{min-height:90px;font-size:11px;width:100%;background-color:none;padding:5px 0;border-bottom:2px solid}.invoiceCustomText,.invoicePaymentsLink{background-color:none;border-bottom:1px solid;width:100%}.invoicePaymentsLink{min-height:72px}.invoiceCustomText{padding:5px 0;font-size:12px;text-align:center}.subLabel{display:block;font-size:8px;font-weight:300;text-transform:uppercase;margin-bottom:5px}p{margin:0}.itemComments,.itemOldComments{font-style:italic;margin-left:10px}.serviceType{border:1px solid;padding:4px;font-size:12px;display:block;text-align:center;margin-bottom:8px}.tokenNumber{display:block;font-size:16px;font-weight:700}.billingAddress,.timeStamp{font-weight:300;display:block}.billingAddress{font-size:12px;line-height:1.2em}.mobileNumber{display:block;margin-top:8px;font-size:12px}.timeStamp{font-size:11px}.KOTNumber{font-size:15px;font-weight:700}.commentsSubText{font-size:12px;font-style:italic;font-weight:300;display:block}.invoiceNumber{font-size:15px;font-weight:700}.timeDisplay{font-size:75%;display:block}.rs{font-size:60%}.paymentSubText{font-size:10px;font-weight:300;display:block}.paymentSubHead{font-size:12px;font-weight:700;display:block}.qrCode{width:100%;max-width:120px;text-align:right}.addressContact,.addressText{color:gray;text-align:center}.addressText{font-size:10px;padding:5px 0}.addressContact{font-size:9px;padding:0 0 5px}.gstNumber{font-weight:700;font-size:10px}.attendantName,.itemQuantity{font-size:12px}#defaultScreen{position:fixed;left:0;top:0;z-index:100001;width:100%;height:100%;overflow:visible;background-image:url(../brand/pattern.jpg);background-repeat:repeat;padding-top:100px}.attendantName{font-weight:300;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.itemComments,.itemQuantity{font-weight:700;display:block}.itemOldComments{display:block;text-decoration:line-through}.itemOldQuantity{font-size:12px;text-decoration:line-through;display:block} </style> </head>';

		    var data_custom_header_image = window.localStorage.bill_custom_header_image ? window.localStorage.bill_custom_header_image : '';

		    var data_custom_header_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '';
			if(data_custom_header_client_name == ''){
			   data_custom_header_client_name = 'Report';
			}

		    var finalReport_printContent = cssData +
		    	'<body>'+
			      '<div id="logo">'+
			        (data_custom_header_image != '' ? '<center><img style="max-width: 90%" src=\''+data_custom_header_image+'\'/></center>' : '<h1 style="text-align: center">'+data_custom_header_client_name+'</h1>')+
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
			   	  printSummaryAll + printSummaryBills + printSummaryPayment + printSummaryCancellations + printSummaryCounts +
			   	'</body>';

				var finalContent_EncodedPrint = encodeURI(finalReport_printContent);
				$('#reportActionButtonPrint').attr('data-hold', finalContent_EncodedPrint);

				runReportAnimation(100); //Done!
		}
	}	




	//Step 12: Final Render Stage - EMAIL
	function singleClickWeeklyFinalReportRender(graphImage){
		runReportAnimation(100); //of Step 11 which completed the data processing

		//Get staff info.
		var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
		
		if(jQuery.isEmptyObject(loggedInStaffInfo)){
			loggedInStaffInfo.name = 'Staff';
			loggedInStaffInfo.code = '0000000000';
		}	


		var reportInfo_branch = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '';
		var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';

		if(reportInfo_branch == ''){
			showToast('System Error: Branch name not found. Please contact Accelerate Support.', '#e74c3c');
			return '';
		}

		var temp_address_modified = (window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '') + ' - ' + (window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '');
		var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';

		var reportInfo_admin = loggedInStaffInfo.name;
		var reportInfo_time = moment().format('h:mm a, DD-MM-YYYY');
		var reportInfo_address = data_custom_footer_address != '' ? data_custom_footer_address : temp_address_modified;


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
	                '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/report_trend_images_repo/'+temp_image_name+'.png" style="max-width: 90%">'+
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
	      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #000">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
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
	      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #000">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
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




	    var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';
	    var cssData = '<head> <style type="text/css"> body{font-family:sans-serif;margin:0}#logo{min-height:60px;width:100%}.mainHeader{background:url(https://accelerateengine.app/clients/'+temp_licenced_client+'/pattern.jpg) #c63931;width:100%;min-height:95px;padding:10px 0;border-bottom:2px solid #a8302b}.headerLeftBox{width:55%;display:inline-block;padding-left:25px}.headerRightBox{width:35%;float:right;display:inline-block;text-align:right;padding-right:25px}.headerAddress{margin:0 0 5px;font-size:14px;color:#e4a1a6}.headerBranch{margin:10px 0;font-weight:700;text-transform:uppercase;font-size:21px;padding:3px 8px;color:#c63931;display:inline-block;background:#FFF}.headerAdmin{margin:0 0 3px;font-size:16px;color:#FFF}.headerTimestamp{margin:0 0 5px;font-size:12px;color:#e4a1a6}.reportTitle{margin:15px 0;font-size:26px;font-weight:400;text-align:center;color:#3498db}.introFacts{background:0 0;width:100%;min-height:95px;padding:10px 0}.factsArea{display:block;padding:10px 25px;text-align:center}.factsBox{margin-right: 5px; width:20%;display:inline-block;text-align:left;padding:20px 15px;border:2px solid #a8302b;border-radius:5px;color:#FFF;height:65px;background:#c63931}.factsBoxFigure{margin:0 0 8px;font-weight:700;font-size:32px}.factsBoxFigure .factsPrice{font-weight:400;font-size:40%;color:#e4a1a6;margin-left:2px}.factsBoxBrief{margin:0;font-size:16px;color:#F1C40F;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.summaryTableSectionHolder{width:100%}.summaryTableSection{padding:0 25px;margin-top:30px}.summaryTableSection table{border-collapse:collapse}.summaryTableSection td{border-bottom:1px solid #fdebed}.tableQuick{padding:10px}.tableQuickHeader{min-height:40px;background:#c63931;border-bottom:3px solid #a8302b;border-top-right-radius:15px;color:#FFF}.tableQuickHeaderText{margin:0 0 0 25px;font-size:18px;letter-spacing:2px;text-transform:uppercase;padding-top:10px;font-weight:700}.smallOrderCount{font-size:80%;margin-left:15px;color:#000;font-weight:bold;}.tableQuickBrief{padding:10px;font-size:16px;color:#a71a14}.tableQuickAmount{padding:10px;font-size:18px;text-align:right;color:#a71a14}.tableQuickAmount .price{font-size:70%;margin-right:2px}.tableGraphRow{position:relative}.tableGraph_Graph{width:30%;display:inline-block;text-align:center;float:right;margin-top:30px}.footerNote,.weeklyGraph{text-align:center;margin:0}.tableGraph_Table{padding:10px;width:65%;display:inline-block}.weeklyGraph{padding:25px;border:1px solid #f2f2f2;border-top:none}.footerNote{font-size:12px;color:#595959}@media screen and (max-width:1000px){.headerLeftBox{display:none!important}.headerRightBox{padding-right:5px!important;width:90%!important}.reportTitle{font-size:18px!important}.tableQuick{padding:0 0 5px!important}.factsArea{padding:5px!important}.factsBox{width:90%!important;margin:0 0 5px!important}.smallOrderCount{margin:0!important;display:block!important}.summaryTableSection{padding:0 5px!important}}</style> </head>';
	    

	    var finalReport_emailContent = '<html>'+cssData+
		    '<body>'+
		      '<div class="mainHeader">'+
		         '<div class="headerLeftBox">'+
		            '<div id="logo">'+
		               '<img src="https://accelerateengine.app/clients/'+temp_licenced_client+'/email_logo.png">'+
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
		            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Sales</p></div>'+ 
		            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netSalesWorth).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
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
		                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Gross Sales</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netSalesWorth).toFixed(2)+'</td></tr>'+
		                 quickSummaryRendererContent+
		                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Net Sales</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value - netRefundsProcessed).toFixed(2)+'</td></tr>'+
		              '</table>'+
		           '</div>'+
		        '</div>'+
		      '</div>'+
		      salesByBillingModeRenderContentFinal+
		      salesByPaymentTypeRenderContentFinal+
		      '<div style="border-top: 2px solid #989898; padding: 12px; background: #f2f2f2;">'+
		         '<p class="footerNote">www.accelerate.net.in | support@accelerate.net.in</p>'+
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

	function resetBillingCounters(){
		var isEnabledVariabled = window.localStorage.appOtherPreferences_resetCountersAfterReport ? window.localStorage.appOtherPreferences_resetCountersAfterReport : '';
		if(isEnabledVariabled == 1){
			var present_day_today = getCurrentTime('DATE_STAMP');
			if(fromDate == toDate && fromDate == present_day_today){
				resetBillingKOTIndex();
			}
		}
	}

	function resetBillingKOTIndex(){
   
	    //Check for KOT index on Server
	    var requestData = {
	      "selector"  :{ 
	                    "identifierTag": "ACCELERATE_KOT_INDEX" 
	                  },
	      "fields"    : ["_rev", "identifierTag", "value"]
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
	          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_INDEX'){

	          		var temp_value = parseInt(data.docs[0].value);

	          		//TWEAK
	          		/* to be safe with KOT number. 2 different KOTs with same KOTNumber should not exists at a time */
	          		/* assuming a max of 100 KOTs active at a time */
	          		if(temp_value < 100){
	          			resetBillingTokenIndex();
	          			return '';
	          		}

		          	var memory_revID = data.docs[0]._rev;

	                    	  //Update KOT number on server
	                          var updateData = {
	                            "_rev": memory_revID,
	                            "identifierTag": "ACCELERATE_KOT_INDEX",
	                            "value": 1
	                          }

	                          $.ajax({
	                            type: 'PUT',
	                            url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_KOT_INDEX/',
	                            data: JSON.stringify(updateData),
	                            contentType: "application/json",
	                            dataType: 'json',
	                            timeout: 10000,
	                            success: function(data) {
	                              resetBillingTokenIndex();
	                            },
	                            error: function(data) {
	                              resetBillingTokenIndex();
	                            }
	                          });
	             
	          }
	          else{
	            resetBillingTokenIndex();
	          }
	        }
	        else{
	          resetBillingTokenIndex();
	        }

	      },
	      error: function(data) {
	        resetBillingTokenIndex();
	      }

	    });		
	}

	function resetBillingTokenIndex(){

						    var requestData = {
						      "selector"  :{ 
						                    "identifierTag": "ACCELERATE_TOKEN_INDEX" 
						                  },
						      "fields"    : ["_rev", "identifierTag", "value"]
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
						          if(data.docs[0].identifierTag == 'ACCELERATE_TOKEN_INDEX'){

										window.localStorage.claimedTokenNumber = 1;
										window.localStorage.claimedTokenNumberTimestamp = new Date();

				                          //Update token number on server
				                          var updateData = {
				                            "_rev": data.docs[0]._rev,
				                            "identifierTag": "ACCELERATE_TOKEN_INDEX",
				                            "value": 2
				                          }

				                          $.ajax({
				                            type: 'PUT',
				                            url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_TOKEN_INDEX/',
				                            data: JSON.stringify(updateData),
				                            contentType: "application/json",
				                            dataType: 'json',
				                            timeout: 10000,
				                            success: function(data) {
				                            	showToast('KOT and Token Numbers are automatically reset. Change your preferences from System Options.', '#27ae60'); 
				                            }
				                          });  

						          }

						        }
						      }
						    });
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

	var email_list = window.localStorage.appOtherPreferences_reportEmailList ? window.localStorage.appOtherPreferences_reportEmailList : '';

	if(email_list == ''){
		showToast('Warning: No Emails added. Please configure atleast one Email from System Options', '#e67e22');
		return '';
	}
	else{
		  //Validate first
		  var emailList = email_list.split(',');

		  for (var i = 0; i < emailList.length; i++) { 
		      if(!validateEmail(emailList[i].trim())) {
		        showToast('Warning: Invalid list of Emails. Edit the list from System Options', '#e67e22');
		        return '';
		      }
		  }

		  function validateEmail(email) {
		      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		      return re.test(email);
		  }
	}

	var temp_licenced_client = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name.toLowerCase() : 'common';

	var data = {
		"token": window.localStorage.loggedInAdmin,
		"name": temp_licenced_client.toUpperCase(),
		"email": email_list,
		"title": textContent.reportTitle,
		"content": mailContent,
		"image": graphImage,
		"imageName": temp_image_name
	}

	showLoading(10000, 'Mailing Report...');

	$.ajax({
		type: 'POST',
		url: 'https://www.accelerateengine.app/apis/possendreportasemail.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		timeout: 10000,
		success: function(data) {
			hideLoading();
			if(data.status){
				showToast('The Report has been mailed. It may take <b>upto 5 mins</b> to receive the mail.', '#27ae60');
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

	showToast('Downloading the Report...', '#27ae60');

	var htmlContentEncoded = $('#reportActionButtonDownload').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	var textContentEncoded = $('#reportActionButtonDownload').attr('text-hold');
	var textContent = decodeURI(textContentEncoded);

	generatePDFReport(htmlContent, textContent);
}

function reportActionPrint(){
	var htmlContentEncoded = $('#reportActionButtonPrint').attr('data-hold');
	var htmlContent = decodeURI(htmlContentEncoded);

	showToast('Printing the Report...', '#27ae60');
	printPDFReport(htmlContent);
}
