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
					excelReportGrossCartAmount();

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
					var netEffectiveCartAmount = 0;
					var grossEffectivePaidAmount = 0;


					//Step 0: Net Cart Amount
					function excelReportGrossCartAmount(){	
						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_netamount?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_totalOrders = 0;
								var temp_totalNet = 0;

								if(data.rows.length > 0){
									temp_totalOrders = data.rows[0].value.count;
									temp_totalNet = data.rows[0].value.sum;
								}

								excelReportData_Overall.push({
									"name": "Gross Sales",
									"value": temp_totalNet
								});


								netEffectiveCartAmount = temp_totalNet;

							
								//Step 1: Total Paid Amount
								excelReportTotalPaidAmount();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to fetch Gross Sales.', '#e74c3c');
							}
						}); 
					}//end - step 1


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

								grossEffectivePaidAmount = temp_totalPaid;

								netSalesWorth = temp_totalPaid;

								//Step 2: Total Charges collected
								excelReportChargesCollected();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to fetch Total Paid Amount.', '#e74c3c');
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
														showToast('System Error: Failed to calculate custom extras.', '#e74c3c');
													}
												}); 


									    },
									    error: function(data){
									    	hideLoading();
									    	showToast('System Error: Failed to calculate extra charges.', '#e74c3c');
									    }
									  });  

					          }
					          else{
					          	hideLoading();
					            showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
					          }
					        }
					        else{
					          hideLoading();
					          showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
					        }
					        
					      },
					      error: function(data) {
					      	hideLoading();
					        showToast('System Error: Unable to read Parameters Modes data.', '#e74c3c');
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
											showToast('System Error: Failed to calculate custom extras.', '#e74c3c');
										}
									}); 


						    },
						    error: function(data){
						    	hideLoading();
						    	showToast('System Error: Failed to calculate extra charges.', '#e74c3c');
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
								showToast('System Error: Failed to calculate discounts.', '#e74c3c');
							}
						});  	
					} //end - step 3


					//Step 4: Total Round Off made
					function excelReportRoundOffMade(){

						$.ajax({
						    type: 'GET',
							url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_calculatedroundoff?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
							timeout: 10000,
							success: function(data) {

								var temp_roundOffCount = 0;
								var temp_roundOffSum = 0;

								if(data.rows.length > 0){
									temp_roundOffCount = data.rows[0].value.count;
									temp_roundOffSum = data.rows[0].value.sum;
								}
								
								excelReportData_Overall.push({
									"name": 'Calculated Round Off',
									"value": temp_roundOffSum
								})	

								netSalesWorth += temp_roundOffSum;

								//Step 4.1: Total Waive Offs
								excelReportWaiveOffs();

							},
							error: function(data){
								hideLoading();
								showToast('System Error: Failed to calculate round off amounts.', '#e74c3c');
							}
						});  
					} //end - step 4


					//Step 4.1: Total Waive Offs
					function excelReportWaiveOffs(){

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
								showToast('System Error: Failed to calculate waive off amounts.', '#e74c3c');
							}
						});  
					} //end - step 4.1



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
								showToast('System Error: Failed to calculate tips amounts.', '#e74c3c');
							}
						}); 
					} // end - step 5


					//Step 6: Total Refunds Issued
					function excelReportRefundsIssued(){

						/*
							Cancelled and Refunded Orders (Neglected)
							Note: removed the concept of Refund on Cancelled Invoices 
						*/


						findGrossRefund();

						var total_tendered_refunds_sum = 0;

						//Refunded Gross amount (Net amount + extras) Actuall amount handed over to customer
						function findGrossRefund(){

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

									total_tendered_refunds_sum = temp_refundSum;

									findNetRefund();

								},
								error: function(data){
									hideLoading();
									showToast('System Error: Failed to calculate refund amount.', '#e74c3c');
								}
							});
						}

						function findNetRefund(){

							$.ajax({
							    type: 'GET',
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds_netamount?startkey=["'+request_date+'"]&endkey=["'+request_date+'"]',
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


									excelReportData_Overall.push({
										"name": 'Net Amount',
										"value": grossEffectivePaidAmount - total_tendered_refunds_sum
									})

									//Step 7: Process Report (Final)
									excelReportFinal();

								},
								error: function(data){
									hideLoading();
									showToast('System Error: Failed to calculate refund amount.', '#e74c3c');
								}
							});
						}  


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
								    	showToast('System Error: Failed to build billing mode summary.', '#e74c3c');	
								    }
								});  
				          }
				        }
				      },
				      error: function(data){
				      	hideLoading();
				      	showToast('System Error: Failed to read billing modes data.', '#e74c3c');
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
								    	showToast('System Error: Failed to build billing mode summary.', '#e74c3c');
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
													showToast('System Error: Failed to build payment mode summary.', '#e74c3c');
												}
											}); 


								    },
								    error: function(data){
								    	hideLoading();
								    	showToast('System Error: Failed to build billing mode summary.', '#e74c3c');
								    }
								  });  

				          }
				          else{
				          		hideLoading();
				            	showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
				          }
				        }
				        else{
				        	hideLoading();
				          	showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
				        }
				        
				      },
				      error: function(data) {
				      	hideLoading();
				        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
										showToast('System Error: Failed to build payment mode summary.', '#e74c3c');
									}
								}); 


					    },
					    error: function(data){
					    	hideLoading();
					    	showToast('System Error: Failed to build payment mode summary.', '#e74c3c');
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
		            showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
		          }
		        }
		        else{
		          hideLoading();
		          showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
		        }
		        
		      },
		      error: function(data) {
		      	hideLoading();
		        showToast('System Error: Unable to read Parameters Modes data.', '#e74c3c');
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
							  ["Sl. No.", "Invoice No.", "Date", "Day", "Time", "Billing Mode", "Type", "Items", "Sub Total"].concat(extras_header_titles.concat(["Discount", "Waive Off", "Payable Amount", "Amount Paid", "Mode of Payment", "Refunds", "Net Amount"]))
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
						showToast('System Error: Unable to read Invoices data.', '#e74c3c');
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
		            showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
		          }
		        }
		        else{
		          hideLoading();
		          showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
		        }
		        
		      },
		      error: function(data) {
		      	hideLoading();
		        showToast('System Error: Unable to read Parameters Modes data.', '#e74c3c');
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
							  ["Sl. No.", "Invoice No.", "Date", "Day", "Time", "Billing Mode", "Type", "Items", "Status", "Cancelled By", "Reason", "Remarks", "Sub Total"].concat(extras_header_titles.concat(["Discount", "Waive Off", "Payable Amount", "Paid Amount", "Mode of Payment", "Refunds", "Net Amount"]))
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
						showToast('System Error: Unable to read Invoices data.', '#e74c3c');
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
						showToast('System Error: Unable to read Cancelled Items data.', '#e74c3c');
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
	            showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
            showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Payment data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
											    			document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Gross Sales</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum-cumulativeSum).toFixed(0)+'</td> </tr>';
											    		}

											    		document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Net Amount</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td> </tr>';
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
	            showToast('Not Found Error: Payments data not found.', '#e74c3c');
	          }
	        }
	        else{
	          showToast('Not Found Error: Payments data not found.', '#e74c3c');
	        }
	        
	      },
	      error: function(data) {
	        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
											    			document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Gross Sales</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum-cumulativeSum).toFixed(0)+'</td> </tr>';
											    		}

											    		document.getElementById("summaryRender_paymentMode_detailed").innerHTML += '<tr> <td style="background: #fffff0; font-weight: bold;">Net Amount</td> <td class="summaryLine3" style="text-align: right; background: #fffff0; font-weight: bold;"><count class="summaryCount" style="padding-right: 5px">from '+grandCount+' Orders</count><i class="fa fa-inr"></i>'+parseFloat(grandSum).toFixed(2)+'</td> </tr>';
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
			showToast('Not Found Error: Time Slot Summary data not found.', '#e74c3c');
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
            showToast('Not Found Error: Billing Modes data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Modes data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Billing Modes data.', '#e74c3c');
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
			showToast('Not Found Error: Session Summary data not found.', '#e74c3c');
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
		totalPaid = netSalesWorth + extras - discount - roundOff + tips - waiveOff
		
		So, 
			netSalesWorth --> totalPaid - extras - tips + discount + roundoff + waiveOff;
	*/


	$( "#summaryRenderArea" ).children().css( "display", "none" );
	document.getElementById("summaryRenderArea_turnOver").style.display = "block";
	document.getElementById("quickSalesFigure_FactsBox").style.display = "none";



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
					"name": "Net Amount",
					"value": temp_totalPaid
				});
			}
			
			//time to render...
			if(temp_totalOrders > 0){
				document.getElementById("summaryRender_turnOver").innerHTML += '<tr class="summaryRowHighlight"> <td><b>Net Amount</b></td> <td class="summaryLineBlack" style="color: #3498db; font-weight: bold; font-size: 24px; text-align: right"><count class="summaryCount" style="padding-right: 5px; font-weight: 400">from '+temp_totalOrders+' Orders</count><i class="fa fa-inr"></i><tag id="figureTotalSalesVolume">'+parseFloat(temp_totalPaid).toFixed(2)+'</tag></td> </tr>';
				netSalesWorth = temp_totalPaid;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tag style="padding: 20px 0; text-align: center; display: block; color: gray">Auch! There are no settled orders</tag>';
				return ''; //No orders found
			}

			//Step 2:
			renderTipsReceived(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){
			document.getElementById("summaryRender_turnOver").innerHTML = '<p style="margin: 0 0 25px 0; font-size: 18px; color: #949494; font-weight: 300; text-align: center">Something went wrong!</p>';
		}
	});  


}


//Step 2: Tips Received
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
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Tips Received</td> <td class="summaryLineGreen" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_tipsCount+' Orders</count>+ <i class="fa fa-inr"></i>'+parseFloat(temp_tipsSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Tips Received</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}

			//Step 3: 
			renderWaiveOffMade(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  
}



//Step 3: Waive Off Amounts
function renderWaiveOffMade(fromDate, toDate, netSalesWorth, graphData){

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
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Waived Off Amount</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_roundOffCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_roundOffSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Waived Off Amount</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}

			//Step 4:
			renderCalculatedRoundOffs(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  
}


//Step 4: Calculated Round Offs
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

				//Step 5:
				renderChargesCollected(fromDate, toDate, netSalesWorth, graphData);

			},
			error: function(data){

			}
		}); 

}



//Step 5: Extras and Custom Extras collected
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
							    		renderChargesCollectedCallback(1, modes, fromDate, toDate, netSalesWorth, graphData);
							    	}
							    	else{
							    		//Step 6: 
							    		renderRefundsIssued(fromDate, toDate, netSalesWorth, graphData);
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
            showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Parameters data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Parameters Modes data.', '#e74c3c');
      }

    });	
}



function renderChargesCollectedCallback(index, modes, fromDate, toDate, netSalesWorth, graphData){

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
							    		renderChargesCollectedCallback(index+1, modes, fromDate, toDate, netSalesWorth, graphData);
							    	}
							    	else{
							    		//Step 6:
							    		renderRefundsIssued(fromDate, toDate, netSalesWorth, graphData);
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



//Step 6: Total Refunds Issued
function renderRefundsIssued(fromDate, toDate, netSalesWorth, graphData){

	findGrossRefund();


	//Refunded actual amount (Net Refund + Extras)
	function findGrossRefund(){
		
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

				grossRefundsProcessed = temp_refundSum;

				findNetRefund();

			},
			error: function(data){

			}
		});

	} 



	//Net refund amoun
	function findNetRefund(){
		
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds_netamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				var temp_refundCount = 0;
				var temp_refundSum = 0;

				if(data.rows.length > 0){
					temp_refundCount = data.rows[0].value.count;
					temp_refundSum = data.rows[0].value.sum;
				}

				graphData.push({
					"name": 'Refunds',
					"value": temp_refundSum,
					"grossRefundValue": grossRefundsProcessed
				})

				actualNetRefundAmount = temp_refundSum;



				//time to render...
				if(temp_refundCount > 0){
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Refunds</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_refundCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_refundSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;

					//Adjust total sales volume
					var x = document.getElementById("figureTotalSalesVolume");
					var total_sales_volume_without_refund = x.innerHTML;
					document.getElementById("figureTotalSalesVolume").innerHTML = parseFloat(total_sales_volume_without_refund - grossRefundsProcessed).toFixed(2);
				}
				else{
					document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Refunds</td> <td style="text-align: right">-</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
				}



				//Step 7: 
				renderDiscountsOffered(fromDate, toDate, netSalesWorth, graphData);

			},
			error: function(data){

			}
		});

	} 		
}


//Step 7: Total Discounts Offered
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

			graphData.push({
				"name": 'Discount',
				"value": temp_discountedOrdersSum
			})		
			
			//time to render...
			if(temp_discountedOrdersCount > 0){
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Discounts</td> <td class="summaryLineRed" style="text-align: right"><count class="summaryCount" style="padding-right: 5px">from '+temp_discountedOrdersCount+' Orders</count>- <i class="fa fa-inr"></i>'+parseFloat(temp_discountedOrdersSum).toFixed(2)+'</td> </tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}
			else{
				document.getElementById("summaryRender_turnOver").innerHTML = '<tr> <td>Discounts</td> <td style="text-align: right">-</td></tr>' + document.getElementById("summaryRender_turnOver").innerHTML;
			}

			//Step 8:
			renderGrossAmount(fromDate, toDate, netSalesWorth, graphData);

		},
		error: function(data){

		}
	});  	
}






//Step 8: Gross Sales
function renderGrossAmount(fromDate, toDate, netSalesWorth, graphData){
		
		//Total Cart Amount
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_netamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
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


				//Step 9: Final Render Call
				renderSummaryFinal(netSalesWorth, graphData);

			},
			error: function(data){

			}
		}); 
}


//Step 10
function renderSummaryFinal(netSalesWorth, graphData){

	document.getElementById("quickSalesFigure_FactsBox").style.display = 'block';

	document.getElementById("quickSalesFigure_FactsBox").innerHTML = ''+
		'<div class="col-sm-3" style="padding: 0 5px;"> <div class="quickSummaryBox"> <div class="quickSummaryFigure zoomIn" id="quickSalesFigure_net">...</div> <div class="quickSummaryTag zoomIn">Net Amount</div> </div> </div>'+
		'<div class="col-sm-3" style="padding: 0 5px;"> <div class="quickSummaryBox"> <div class="quickSummaryFigure zoomIn" id="quickSalesFigure_gross">...</div> <div class="quickSummaryTag zoomIn">Gross Sales</div> </div> </div>'+
		'<div class="col-sm-3" style="padding: 0 5px;"> <div class="quickSummaryBox"> <div class="quickSummaryFigure zoomIn" id="quickSalesFigure_discount">...</div> <div class="quickSummaryTag zoomIn">Discounts</div> </div> </div>'+
		'<div class="col-sm-3" style="padding: 0 5px;"> <div class="quickSummaryBox"> <div class="quickSummaryFigure zoomIn" id="quickSalesFigure_refund">...</div> <div class="quickSummaryTag zoomIn">Refunds</div> </div> </div>';
   
	document.getElementById("quickSalesFigure_net").innerHTML = parseFloat(graphData[0].value - graphData[graphData.length - 3].grossRefundValue).toFixed(0);
	document.getElementById("quickSalesFigure_gross").innerHTML = parseFloat(graphData[graphData.length - 1].value).toFixed(0);
	document.getElementById("quickSalesFigure_discount").innerHTML = (graphData[graphData.length - 2].value > 0 ? '-' : '') + parseFloat(graphData[graphData.length - 2].value).toFixed(0);
	document.getElementById("quickSalesFigure_refund").innerHTML = (graphData[graphData.length - 3].value > 0 ? '-' : '') + parseFloat(graphData[graphData.length - 3].value).toFixed(0);

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
            showToast('Not Found Error: Billing Modes data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Modes data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Billing Modes data.', '#e74c3c');
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
            showToast('Not Found Error: Payment Modes data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Payment Modes data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Payment Modes data.', '#e74c3c');
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
			showToast('Not Found Error: Item Cancellations data not found.', '#e74c3c');
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
												'<tag style="font-weight: 600; color: #6f6f6f;">'+cancelledData.itemsRemoved[i].name+(cancelledData.itemsRemoved[i].isCustom ? ' <tag style="font-size: 80%; font-weight: 400">('+cancelledData.itemsRemoved[i].variant+')</tag>' : '')+'</tag>'+
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
								showToast('System Error: Branch name not found.', '#e74c3c');
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
			showToast('Not Found Error: Item Cancellations data not found.', '#e74c3c');
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
						renderContent += '<tr> <td><i class="fa fa-star" style="color: #ffd63f; font-size: 12px; margin-right: 10px; top: -1px; position: relative;"></i><b style="color: #e69d17; font-size: 17px; font-weight: 500; }">'+itemsFilteredList[i].name+(itemsFilteredList[i].category != '' && itemsFilteredList[i].category != 'MANUAL_UNKNOWN' ? '<tag style="color: gray; margin-left: 6px; font-size: 12px;">'+itemsFilteredList[i].category+'</tag>' : '')+'</b></td> <td class="summaryLine3" style="text-align: center; color: #e69d17">'+itemsFilteredList[i].count+'</td> </tr>';
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
			showToast('Not Found Error: Order Summary data not found.', '#e74c3c');
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
								showToast('System Error: Branch name not found.', '#e74c3c');
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
								showToast('System Error: Branch name not found.', '#e74c3c');
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
			showToast('Not Found Error: Order Summary data not found.', '#e74c3c');
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
		1. there are no live orders
		2. there are no bills pending for settlement
	*/


	//Note: Dates in YYYYMMDD format
	var fromDate = document.getElementById("reportFromDate").value;
	fromDate = fromDate && fromDate != '' ? fromDate : '01-01-2018'; //Since the launch of Vega POS
	
	var toDate = document.getElementById("reportToDate").value;
	toDate = toDate && toDate != '' ? toDate : getCurrentTime('DATE_STAMP');
	

	checkForRunningOrders();

	function checkForRunningOrders(){

	    $.ajax({
	      type: 'GET',
	      url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot/_design/kot-fetch/_view/fetchall',
	      contentType: "application/json",
	      dataType: 'json',
	      timeout: 10000,
	      success: function(data) {
	        if(data.total_rows > 0){
	            showToast('Warning: Please generate bills for all the <b>'+data.rows.length+' live orders</b> to continue.', '#e67e22');
	            return '';
	        }
	        else{
	        	checkForPendingBills();
	        }
	      },
	      error: function(data) {
	        showToast('Error: Unable to generate the report. Please try again.', '#e74c3c');
	        return '';
	      }

	    }); 
	}


	function checkForPendingBills(){
				  	
				  	$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/_design/bill-filters/_view/showall?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]&descending=false',
						timeout: 10000,
						success: function(data) {

							if(data.rows.length > 0){
								showToast('Warning: Please settle all the pending bills on the given dates to continue.', '#e67e22');
								return '';
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
    window.localStorage.graphImageDataHourly = '';

    
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

	//preload data
	var DATA_BILLING_PARAMETERS = [];
	var DATA_BILLING_MODES = [];
	var DATA_PAYMENT_MODES = [];

	var completeReportInfo = [];
	var netSalesWorth = 0;
	var netGuestsCount = '-';
	var netCartSum = 0;

	var grossRefundsProcessed = 0;
	var actualNetRefundAmount = 0;

	var reportInfoExtras = [];
	var completeErrorList = []; //In case any API call causes Error

	var detailedListByBillingMode = []; //Billing mode wise
	var detailedListByPaymentMode = []; //Payment mode wise

	var weeklyProgressThisWeek = []; //This Week sales
	var weeklyProgressLastWeek = []; //Last Week sales
	var paymentGraphData = []; //For payment graphs
	var billsGraphData = []; //For bills graphs

	var overalSalesTrend = []; //Sales trend: lastday, current week, previous week etc. 
	var sessionWiseSalesData = []; //Session wise sales
	var hourlySalesData = []; //hourly sales
	var dayByDaySalesData = []; //complete current month daily sales
	var monthByMonthSalesData = []; //month by month sales
	
	var invoiceCancellationsData = []; //bill cancellations
	var invoiceCancellationsMetaData = {}; //bill cancellations summary figures

	var detailedDiscountsData = []; //Discounts offered
	var detailedTopItemsData = []; //Top 20 items
	var detailedItemCategoryWiseData = []; //Top 20 items

	var cancellationsData_items = []; //Item cancellations list
	var cancellationsData_orders = []; //Order Cancellations list
	var cancellationsData_invoices = []; //Invoice Cancellations list

	var startingBillNumber = '-';
	var endingBillNumber = '-';
	var netCancelledBills = 0;
	var netCancelledBillsSum = 0;


	//Starting point
	runReportAnimation(0);
	setTimeout(preloadRequiredData, 1000);


	//Step 0: Preload necessary data
	function preloadRequiredData(){

		preloadBillingParameters();

		function preloadBillingParameters(){

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
			          	
			          	DATA_BILLING_PARAMETERS = data.docs[0].value;
		         		
						preloadBillingModes();
		          }
		        }
		        else{
		        	showToast('System Error: Failed to read Billing Parameters data. Please contact Accelerate Support if problem persists.', '#e74c3c');
					return '';
		        }
		      },
		      error: function(data) {
					showToast('System Error: Failed to read Billing Parameters data. Please contact Accelerate Support if problem persists.', '#e74c3c');
					return '';
		      }

		    });				
		}

		function preloadBillingModes(){

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

			              	DATA_BILLING_MODES = data.docs[0].value;

			              	preloadPaymentModes();
			          }
			        }
			        else{
			        	showToast('System Error: Failed to read Billing Modes data. Please contact Accelerate Support if problem persists.', '#e74c3c');
						return '';
			        }
			      },
			      error: function(data) {
						showToast('System Error: Failed to read Billing Modes data. Please contact Accelerate Support if problem persists.', '#e74c3c');
						return '';
			      }

			    });			
		}

		function preloadPaymentModes(){

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

			              	DATA_PAYMENT_MODES = data.docs[0].value;

			              	//Step 1:
			              	singleClickTotalPaid();
			          }
			        }
			        else{
			        	showToast('System Error: Failed to read Payment Modes data. Please contact Accelerate Support if problem persists.', '#e74c3c');
						return '';
			        }
			  },
			  error: function(data) {
				showToast('System Error: Failed to read Payment Modes data. Please contact Accelerate Support if problem persists.', '#e74c3c');
				return '';
			  }

		    });			
		}

		
	}


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
						"name": "Net Amount",
						"value": temp_totalPaid,
						"count": temp_totalOrders,
						"split": []
				});

				netSalesWorth = temp_totalPaid;

				//Step 2:
				singleClickNetAmount();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 1,
					"error": "Failed to load total paid amount."
				});

				stopReportAnimation('ERROR');
				singleClickLoadErrors();
				return '';
			}
		});  
	}	


	//Step 2: Find Gross Cart Amount
	function singleClickNetAmount(){

		runReportAnimation(1); //Step 1 takes 1 unit time
		
			//Total Cart Amount
			$.ajax({
			    type: 'GET',
				url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_netamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
				timeout: 10000,
				success: function(data) {

					if(data.rows.length > 0){
						netCartSum = data.rows[0].value.sum;
					}

					//Step 3:
					singleClickTotalGuests();

				},
				error: function(data){
					completeErrorList.push({
					    "step": 2,
						"error": "Failed to load gross sales figure."
					});
				
					stopReportAnimation('ERROR');
					singleClickLoadErrors();
					return '';
				}
			}); 
	}



	//Step 3: Total Number of Guests
	function singleClickTotalGuests(){

		runReportAnimation(2); //Step 2 takes 1 unit time

		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/totalguests?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					netGuestsCount = data.rows[0].value.sum;
				}

				//Step 4:
				singleClickLastInvoiceNumbers();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 3,
					"error": "Failed to calculate the total number of guests."
				});
				return '';
			}
		});  
	}		

	//Step 4: First and last invoice number
	function singleClickLastInvoiceNumbers(){

		runReportAnimation(3); //Step 3 takes 1 unit time

		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoices/_view/getlastbill?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					startingBillNumber = data.rows[0].value;
					endingBillNumber = data.rows[data.rows.length - 1].value;
				}

				//Step 5:
				singleClickExtraCharges();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 4,
					"error": "Failed to find the starting and ending invoice numbers."
				});

				singleClickExtraCharges();
				return '';
			}
		});  
	}		


	//Step 5: 
	function singleClickExtraCharges(){

		runReportAnimation(4); //Step 4 takes 1 unit time

		          	var modes = DATA_BILLING_PARAMETERS;

		          	if(modes.length == 0){

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
								    		//Step 6: Total Discount offered
								    		singleClickDiscountsOffered();
								    	}

									},
									error: function(data){
										completeErrorList.push({
										    "step": 5,
											"error": "Failed to calculate the extra charges applied on the bills."
										});

										//Skip and go to next step
										singleClickDiscountsOffered(); 
										return '';
									}
								}); 

					    },
					    error: function(data){
							completeErrorList.push({
							    "step": 5,
								"error": "Failed to calculate the extra charges applied on the bills."
							});	

							//Skip and go to next step
							singleClickDiscountsOffered(); 
							return '';	    	
					    }
					  });  
					} //else - modes

	}


	//Step 5 - Callback
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
							    		//Step 6: Total Discount offered
							    		singleClickDiscountsOffered();
							    	}

								},
								error: function(data){
									completeErrorList.push({
									    "step": 5,
										"error": "Failed to calculate the extra charges applied on the bills."
									});

									//Skip and go to next step
									singleClickDiscountsOffered(); 
									return '';
								}
							}); 
				    },
				    error: function(data){
						completeErrorList.push({
						    "step": 5,
							"error": "Failed to calculate the extra charges applied on the bills."
						});

						//Skip and go to next step
						singleClickDiscountsOffered(); 
						return '';
				    }
				  }); 

	}	//End step 5 callback



	//Step 6: Discounts Offered
	function singleClickDiscountsOffered(){

		runReportAnimation(7); //Step 5 takes 3 unit time

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


				//Step 7: Total calculated round offs
				singleClickCalculatedRoundOffs();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 6,
					"error": "Failed to calculate the discounts applied on the bills."
				});				

				//Skip and go to next step
				singleClickCalculatedRoundOffs(); 
				return '';
			}
		});  			
	}



	//Step 7 : Calculated Round Offs
	function singleClickCalculatedRoundOffs(){

			runReportAnimation(8); //Step 6 takes 1 unit time

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

					completeReportInfo.push({
							"name": "Calculated Round Off",
							"type": temp_sum < 0 ? "NEGATIVE" : "POSITIVE",
							"value": Math.abs(temp_sum),
							"count": 0
					});	

					//Step 8: Total Waive Off made
					singleClickWaiveOffsMade();

				},
				error: function(data){
					completeErrorList.push({
					    "step": 7,
						"error": "Failed to calculate the sum of Round-off amounts."
					});				

					//Skip and go to next step
					singleClickWaiveOffsMade(); 
					return '';
				}
			}); 

	}




	//Step 8: Waive Offs made
	function singleClickWaiveOffsMade(){

		runReportAnimation(9); //Step 7 takes 1 unit time

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

				//Step 9: Total Tips received
				singleClickTipsReceived();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 8,
					"error": "Failed to calculate the sum of Waived-off amounts."
				});				

				//Skip and go to next step
				singleClickTipsReceived(); 
				return '';
			}
		});  	
	}




	//Step 9: Total Tips Received
	function singleClickTipsReceived(){

		runReportAnimation(10); //Step 8 takes 1 unit time

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

				//Step 10: Refunds Issued
				singleClickRefundsIssued();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 9,
					"error": "Failed to calculate the sum of tips received."
				});				

				//Skip and go to next step
				singleClickRefundsIssued(); 
				return '';
			}
		});  		
	}


	//Step 10: Total Refunds Issued
	function singleClickRefundsIssued(){

		runReportAnimation(11); //Step 9 takes 1 unit time

		/*
			Cancelled and Refunded Orders 
			(neglected and moved to under different header)
		*/


		findGrossRefund();


		//Refunded gross amount (gross Amount + Extras)
		function findGrossRefund(){
			
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

					grossRefundsProcessed = temp_refundSum;

					findNetRefund();					 

				},
				error: function(data){
					completeErrorList.push({
					    "step": 10,
						"error": "Failed to calculate the total refunds issued."
					});				

					//Step 11: Get cancelled invoices count
					singleClickCancelledInvoices(); 
					return '';
				}
			});
		}


		//Refunded Net amount
		function findNetRefund(){
			
			$.ajax({
			    type: 'GET',
				url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds_netamount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
				timeout: 10000,
				success: function(data) {

					var temp_refundCount = 0;
					var temp_refundSum = 0;

					if(data.rows.length > 0){
						temp_refundCount = data.rows[0].value.count;
						temp_refundSum = data.rows[0].value.sum;
					}

					actualNetRefundAmount = temp_refundSum;

					completeReportInfo.push({
						"name": "Refunds Issued",
						"type": "NEGATIVE",
						"value": temp_refundSum,
						"count": temp_refundCount
					});	

					//Step 11: Get cancelled invoices count
					singleClickCancelledInvoices();

				},
				error: function(data){
					completeErrorList.push({
					    "step": 10,
						"error": "Failed to calculate the total refunds issued."
					});				

					//Step 11: Get cancelled invoices count
					singleClickCancelledInvoices(); 
					return '';
				}
			});
		}


	}


	//Step 11: Get cancelled invoices count
	function singleClickCancelledInvoices(){

		runReportAnimation(12); //Step 10 takes 1 unit time
	
		$.ajax({
		    type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoices/_view/getcount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]',
			timeout: 10000,
			success: function(data) {

				if(data.rows.length > 0){
					netCancelledBills = data.rows[0].value.count;
					netCancelledBillsSum = data.rows[0].value.sum;
				}

				//Step 12: Detailed sales trend
				singleClickDetailedSalesTrend();

			},
			error: function(data){
				completeErrorList.push({
				    "step": 11,
					"error": "Failed to find the number of cancelled invoices."
				});
				
				//Step 12: Detailed sales trend
				singleClickDetailedSalesTrend();
				return '';
			}
		});  

		
	}



	//Step 12: Quick Sales Trend
	function singleClickDetailedSalesTrend(){

		runReportAnimation(13); //Step 11 takes 1 unit time

		if(fromDate != toDate){ //Skip if the report is being NOT generated for a Single Day
			singleClickSessionWise();
			return '';
		}


		//PRE-FORMATTING
		var trendDate_yesterday = moment(fromDate, 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD'); //Yesterday
		
		var trendDate_currentWeek_from = moment(fromDate, 'YYYYMMDD').subtract(6, 'days').format('YYYYMMDD');
		var trendDate_currentWeek_to = moment(fromDate, 'YYYYMMDD').format('YYYYMMDD');

		var trendDate_previousWeek_from = moment(fromDate, 'YYYYMMDD').subtract(13, 'days').format('YYYYMMDD');
		var trendDate_previousWeek_to = moment(fromDate, 'YYYYMMDD').subtract(7, 'days').format('YYYYMMDD');

		var trendDate_currentMonth_from = moment(fromDate, 'YYYYMMDD').startOf('month').format('YYYYMMDD');
		var trendDate_currentMonth_to = moment(fromDate, 'YYYYMMDD').format('YYYYMMDD');
		
		var trendDate_previousMonth_from = moment(fromDate, 'YYYYMMDD').subtract(1, 'months').startOf('month').format('YYYYMMDD');
		var trendDate_previousMonth_to = moment(fromDate, 'YYYYMMDD').subtract(1, 'months').format('YYYYMMDD');
		var trendDate_previousMonth_end = moment(fromDate, 'YYYYMMDD').subtract(1, 'months').endOf('month').format('YYYYMMDD');

		var trendDate_lastYear_from = moment(fromDate, 'YYYYMMDD').subtract(1, 'years').startOf('month').format('YYYYMMDD');
		var trendDate_lastYear_to = moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('YYYYMMDD');
		var trendDate_lastYear_end = moment(fromDate, 'YYYYMMDD').subtract(1, 'years').endOf('month').format('YYYYMMDD');

		overalSalesTrend[0] = {
			"tag": "Today",
			"range": moment(fromDate, 'YYYYMMDD').format('Do MMMM'),
			"amount": 0,
			"count": 0,
			"dateFrom": fromDate,
			"dateTo": fromDate
		}

		overalSalesTrend[1] = {
			"tag": "Yesterday",
			"range": moment(fromDate, 'YYYYMMDD').subtract(1, 'days').format('Do MMMM'),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_yesterday,
			"dateTo": trendDate_yesterday
		}

		overalSalesTrend[2] = {
			"tag": "Current Week",
			"range": moment(fromDate, 'YYYYMMDD').subtract(6, 'days').format('Do MMM') +" - "+ moment(fromDate, 'YYYYMMDD').format('Do MMM'),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_currentWeek_from,
			"dateTo": trendDate_currentWeek_to
		}

		overalSalesTrend[3] = {
			"tag": "Previous Week",
			"range": moment(fromDate, 'YYYYMMDD').subtract(13, 'days').format('Do MMM') + " - " + moment(fromDate, 'YYYYMMDD').subtract(7, 'days').format('Do MMM'),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_previousWeek_from,
			"dateTo": trendDate_previousWeek_to
		}

		overalSalesTrend[4] = {
			"tag": "Current Month ("+moment(fromDate, 'YYYYMMDD').format('MMMM')+")",
			"range": (moment(fromDate, 'YYYYMMDD').startOf('month').format('Do MMM') != moment(fromDate, 'YYYYMMDD').format('Do MMM')) ? moment(fromDate, 'YYYYMMDD').startOf('month').format('Do ') + " - " + moment(fromDate, 'YYYYMMDD').format('Do MMMM, YYYY') : moment(fromDate, 'YYYYMMDD').format('Do MMMM') + " (Today)",
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_currentMonth_from,
			"dateTo": trendDate_currentMonth_to
		}

		overalSalesTrend[5] = {
			"tag": "Previous Month ("+moment(fromDate, 'YYYYMMDD').subtract(1, 'months').format('MMMM')+") - Till "+ moment(fromDate, 'YYYYMMDD').subtract(1, 'months').format('Do'),
			"range": (moment(fromDate, 'YYYYMMDD').subtract(1, 'months').startOf('month').format('Do') != moment(fromDate, 'YYYYMMDD').subtract(1, 'months').format('Do') ? moment(fromDate, 'YYYYMMDD').subtract(1, 'months').startOf('month').format('Do ') + " - " + moment(fromDate, 'YYYYMMDD').subtract(1, 'months').format('Do MMMM, YYYY') : moment(fromDate, 'YYYYMMDD').subtract(1, 'months').startOf('month').format('Do MMMM')),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_previousMonth_from,
			"dateTo": trendDate_previousMonth_to
		}

		overalSalesTrend[6] = {
			"tag": "Previous Month ("+moment(fromDate, 'YYYYMMDD').subtract(1, 'months').format('MMMM')+") - Overall",
			"range": moment(fromDate, 'YYYYMMDD').subtract(1, 'months').startOf('month').format('Do ') + " - " + moment(fromDate, 'YYYYMMDD').subtract(1, 'months').endOf('month').format('Do MMMM, YYYY'),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_previousMonth_from,
			"dateTo": trendDate_previousMonth_end
		}

		overalSalesTrend[7] = {
			"tag": "Last Year "+moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('MMM (YYYY)')+" - Till " + moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('Do'),
			"range": (moment(fromDate, 'YYYYMMDD').subtract(1, 'years').startOf('month').format('Do') != moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('Do') ? moment(fromDate, 'YYYYMMDD').subtract(1, 'years').startOf('month').format('Do ') + " - " + moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('Do MMMM, YYYY') : moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('Do MMMM, YYYY')),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_lastYear_from,
			"dateTo": trendDate_lastYear_to
		}

		overalSalesTrend[8] = {
			"tag": "Last Year "+moment(fromDate, 'YYYYMMDD').subtract(1, 'years').format('MMM (YYYY)')+" - Overall",
			"range": moment(fromDate, 'YYYYMMDD').subtract(1, 'years').startOf('month').format('Do') +" - "+ moment(fromDate, 'YYYYMMDD').subtract(1, 'years').endOf('month').format('Do MMMM, YYYY'),
			"amount": 0,
			"count": 0,
			"dateFrom": trendDate_lastYear_from,
			"dateTo": trendDate_lastYear_end
		}

		
		generateSalesTrend(0);

		//To calculate yesterday's sales
		function generateSalesTrend(index){
			
			$.ajax({
			    type: 'GET',
				url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+overalSalesTrend[index].dateFrom+'"]&endkey=["'+overalSalesTrend[index].dateTo+'"]',
				timeout: 10000,
				success: function(data) {

					var temp_totalOrders = 0;
					var temp_totalPaid = 0;

					if(data.rows.length > 0){
						temp_totalOrders = data.rows[0].value.count;
						temp_totalPaid = data.rows[0].value.sum;
					}


					//Refunds issued
					$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds?startkey=["'+overalSalesTrend[index].dateFrom+'"]&endkey=["'+overalSalesTrend[index].dateTo+'"]',
						timeout: 10000,
						success: function(data) {

							var temp_refundSum = 0;

							if(data.rows.length > 0){
								temp_refundSum = data.rows[0].value.sum;
							}


							overalSalesTrend[index].amount = temp_totalPaid - temp_refundSum;
							overalSalesTrend[index].count = temp_totalOrders;

							if(overalSalesTrend[index + 1]){
								generateSalesTrend(index + 1);
							}
							else{
								singleClickSessionWise();
							}
											 
						},
						error: function(data){
							completeErrorList.push({
							    "step": 12,
								"error": "Unable to get the sales trend figures. Calculating the total refunds failed."
							});	

							overalSalesTrend = [];
							singleClickSessionWise();
							return '';
						}
					});

				},
				error: function(data){
					completeErrorList.push({
					    "step": 12,
						"error": "Unable to get the sales trend figures. Calculating the total sales failed."
					});

					overalSalesTrend = [];
					singleClickSessionWise();
					return '';
				}
			});  
		}



	}



	//Step 13: Session Wise sales
	function singleClickSessionWise() {

		runReportAnimation(18); //Step 12 takes 5 unit time

		//Preload Sessions
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

	              var sessionsData = data.docs[0].value;
	              computeSessionWiseSales(sessionsData);
	          }
	        }
	        else{
				completeErrorList.push({
				    "step": 13,
					"error": "Failed to load sessions data."
				});
					
				sessionWiseSalesData = [];
				singleClickHourlyTrend();
				return '';	
	        }
	        
	      },
	      error: function(data) {
				completeErrorList.push({
				    "step": 13,
					"error": "Failed to load sessions data."
				});
					
				sessionWiseSalesData = [];
				singleClickHourlyTrend();
				return '';	
	      }

	    });		 


	    function computeSessionWiseSales(sessionData){

			$.ajax({
				type: 'GET',
				url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sessionwisesales?startkey=["'+fromDate+'"]&endkey=["'+toDate+'",{}]',
				timeout: 50000,
				success: function(data) {

					var itemsList = data.rows;
					if(itemsList.length == 0){

						singleClickHourlyTrend();
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

						    	sessionWiseSalesData = formattedList;

						    	//Format
						    	for(var t = 0; t < sessionWiseSalesData.length; t++){
						    		for(var a = 0; a < sessionData.length; a++){
						    			if(sessionWiseSalesData[t].session == sessionData[a].name){
						    				sessionWiseSalesData[t].range = moment(sessionData[a].startTime,"HHmm").format("hh:mm a") +' to '+ moment(sessionData[a].endTime,"HHmm").format("hh:mm a");
						    				break;
						    			}
						    		}	
						    	}

						    	//Go to Step 14: Hourly Sales Trend
						    	singleClickHourlyTrend();
						    }

						    counter++;
						}
						
					}

				},
				error: function(data){
						completeErrorList.push({
						    "step": 13,
							"error": "Failed to load session wise sales."
						});
						

						sessionWiseSalesData = [];

						singleClickHourlyTrend();
						return '';							    	
				}
			}); 

		} //end - computeSessionWiseSales() 		
	}



	//Step 14: Hourly Sales Trend
	function singleClickHourlyTrend(){

		runReportAnimation(19); //Step 13 takes 1 unit time

		var custom_filter_url = custom_filter_url = COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/timeslotwise_sumoverall?startkey=["ANY_MODE","'+fromDate+'", 0]&endkey=["ANY_MODE","'+toDate+'", 23]';

		$.ajax({
			type: 'GET',
			url: custom_filter_url,
			timeout: 50000,
			success: function(data) {

				var itemsList = data.rows;

				if(itemsList.length == 0){
					singleClickDayByDaySales(); //Step 15
					return '';
				}


				reduceBySlot(itemsList);
				
				function reduceBySlot(listOfItems){

					//Reduce Function 
					var reduced_list = listOfItems.reduce(function (accumulator, item) {
						if(accumulator[item.key[2]]){
							accumulator[item.key[2]].amount += item.value; //sum
							accumulator[item.key[2]].count++; //number of such orders
						}
						else{
							accumulator[item.key[2]] = {
								"hour_slot": item.key[2],
								"count": 1,
								"amount": item.value,
							};
						}

					  	return accumulator;
					}, {});


					var formattedList = [];
					var keysCount = Object.keys(reduced_list);

					var counter = 1;
					for (x in reduced_list) {
					    formattedList.push({
					    	"amount": reduced_list[x].amount,
					    	"count": reduced_list[x].count,
					    	"hour_slot": reduced_list[x].hour_slot
					    });

					    if(counter == keysCount.length){ //last iteration
					    	formatHourlyList(formattedList);
					    }

					    counter++;
					}
					
				}



				function formatHourlyList(itemsFilteredList){

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
							    	"amount": 0,
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

				        //add guest count as well
				        hourlySalesData = itemsFilteredList;

						appendHourlyGuestCount(hourlySalesData);
				}

			},
			error: function(data){
					
					completeErrorList.push({
					    "step": 14,
						"error": "Failed to load the hourly sales data."
					});

					hourlySalesData = [];

					singleClickDayByDaySales();
					return '';									    	
			}
		}); 

	
		function appendHourlyGuestCount(myData){
			
			var hourlySalesDataTemp = myData;

			$.ajax({
				type: 'GET',
				url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/timeslotwise_countoverall?startkey=["ANY_MODE","'+fromDate+'", 0]&endkey=["ANY_MODE","'+toDate+'", 23]',
				timeout: 50000,
				success: function(data) {

					var itemsList = data.rows;
					if(itemsList.length == 0){

						for(var i = 0; i < hourlySalesDataTemp; i++){
							hourlySalesDataTemp[i].number_of_guests = 0;
						}

						hourlySalesData = hourlySalesDataTemp;

						//Plot graph for day-by-day sales
						renderHourlyGraph(); 
						return '';
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
						    	addToSummaryData(formattedList);
						    }

						    counter++;
						}
						
					}



					function addToSummaryData(countList){

							for(var g = 0; g < 24; g++){
							
								var n = 0;
								while(countList[n]){
									if(countList[n].hour_slot == g){
										//Already added slot
										break;
									}

									if(n == countList.length - 1){ //last iteration, slot not present
										countList.push({
									    	"number_of_guests": 0,
									    	"count": 0,
									    	"hour_slot": g
									    });
									}

									n++;
								}
							}


							// Ascending: Sorting
							countList.sort(function(obj1, obj2) {
					            return obj1.hour_slot - obj2.hour_slot;
					        });
					       
						
							for(var i = 0; i < countList.length; i++){
								for(var s = 0; s < hourlySalesDataTemp.length; s++){
									if(countList[i].hour_slot == hourlySalesDataTemp[s].hour_slot){
										hourlySalesDataTemp[s].number_of_guests = countList[i].number_of_guests;
										break;
									}
								}
							}

							hourlySalesData = hourlySalesDataTemp;
							renderHourlyGraph();
					}

				},
				error: function(data){
					renderHourlyGraph();
					return '';								    	
				}
			});  


			
		}


		function renderHourlyGraph(){

			window.localStorage.graphImageDataHourly = '';

			var isAllZero = true;
			for(var h = 0; h < hourlySalesData.length; h++){
				if(hourlySalesData[h].count != 0){
					isAllZero = false;
					break;
				}
			}

			if(isAllZero){
				//Skip and go to next step
				singleClickDayByDaySales(); 
				return '';
			}


			var graph_labels = [];
			var graph_data = [];
			var graph_background = [];
			var graph_border = [];

			var n = 0;
			while(hourlySalesData[n]){
				
				var slot_name = hourlySalesData[n].hour_slot;

				if(slot_name == 0){
					slot_name = 'Midnight';
				}
				else if(slot_name < 12){
					slot_name = slot_name + 'am';
				}
				else if(slot_name == 12){
					slot_name = '12 Noon';
				}
				else{
					slot_name = (slot_name-12) + 'pm';
				}

				graph_labels.push(slot_name);
				graph_data.push(hourlySalesData[n].amount);

				graph_background.push("rgba(2, 208, 255, 1)") //bright blue color
				graph_border.push("rgba(2, 208, 255, 1)") //bright blue color

				n++;
			}

			var ctx = document.getElementById("hourlyTrendLineChart").getContext('2d');
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: graph_labels,
			        datasets: [{
			            label: 'Sales Amount',
			            data: graph_data,
			            backgroundColor: graph_background,
			            borderColor: graph_border,
			            borderWidth: 1
			        }]
			    },
			    options: {   	
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
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
			        },
			        animation: {
		                onComplete: convertGraph
		            }
			    }

			});	

			function convertGraph(){
				var temp_graph = myChart.toBase64Image();

				window.localStorage.graphImageDataHourly = temp_graph;

				//Go to Step 15
				singleClickDayByDaySales();
			}

		}


	}





	//Step 15: Day-by-day Sales (for the Current Month)
	function singleClickDayByDaySales(){

		runReportAnimation(20); //Step 14 takes 1 unit time

		if(fromDate != toDate){ //Skip if the report is being NOT generated for a Single Day
			singleClickDetailedByModes();
			return '';
		}

		//Preload Billing Parameters
		var modes = DATA_BILLING_PARAMETERS;

		var start_date = moment(fromDate, 'YYYYMMDD').startOf('month').format('YYYYMMDD');

		generateSalesByDate(0);
	
		function generateSalesByDate(majorIndex) {

			/* for animation sake */
			runReportAnimation(20 + majorIndex);
			
			
			var processing_date = moment(start_date, 'YYYYMMDD').add(majorIndex, 'days').format('YYYYMMDD');
			var extrasTemplate = [];

			calculateTotalPaid();

			function calculateTotalPaid(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+processing_date+'"]&endkey=["'+processing_date+'"]',
					timeout: 10000,
					success: function(data) {

						var temp_totalOrders = 0;
						var temp_totalPaid = 0;

						if(data.rows.length > 0){
							temp_totalOrders = data.rows[0].value.count;
							temp_totalPaid = data.rows[0].value.sum;
						}

						dayByDaySalesData.push({
								"date": moment(processing_date, 'YYYYMMDD').format('DD MMM \'YY'),
								"day": moment(processing_date, 'YYYYMMDD').format('dddd'),
								"count": temp_totalOrders,
								"netAmount": temp_totalPaid
						});


						calculateDiscountApplied();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 15,
							"error": "Unable to find the daily sales trend. Calculating the net amount failed."
						});
					
						dayByDaySalesData = [];
						singleClickMonthByMonthSales();
						return '';
					}
				});  
			}

			function calculateDiscountApplied(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_discounts?startkey=["'+processing_date+'"]&endkey=["'+processing_date+'"]',
					timeout: 10000,
					success: function(data) {

						var discAmount = 0;

						if(data.rows.length > 0){
							discAmount = data.rows[0].value.sum;
						}

						dayByDaySalesData[majorIndex].discount = discAmount;


						calculateGrossAmount();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 15,
							"error": "Unable to find the daily sales trend. Calculating discounts failed."
						});
					
						dayByDaySalesData = [];
						singleClickMonthByMonthSales();
						return '';
					}
				});  

			}


			function calculateGrossAmount(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_netamount?startkey=["'+processing_date+'"]&endkey=["'+processing_date+'"]',
					timeout: 10000,
					success: function(data) {

						var gross_cart = 0;

						if(data.rows.length > 0){
							gross_cart = data.rows[0].value.sum;
						}

						dayByDaySalesData[majorIndex].grossSales = gross_cart;


						//Find Refunds
						calculateRefundAmount();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 15,
							"error": "Unable to find the daily sales trend. Calculating the gross sales failed."
						});
						
						dayByDaySalesData = [];
						singleClickMonthByMonthSales();
						return '';
					}
				});  
			}


			function calculateRefundAmount(){

				findGrossRefund();

				//Refunded net amount (gross Amount + Extras)
				function findGrossRefund(){
					
					$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds?startkey=["'+processing_date+'"]&endkey=["'+processing_date+'"]',
						timeout: 10000,
						success: function(data) {

							var temp_refundSum = 0;

							if(data.rows.length > 0){
								temp_refundSum = data.rows[0].value.sum;
							}

							dayByDaySalesData[majorIndex].netRefund = temp_refundSum;

							findNetRefund();					 

						},
						error: function(data){
							completeErrorList.push({
							    "step": 15,
								"error": "Unable to find the daily sales trend. Calculating the refunds failed."
							});	

							dayByDaySalesData = [];
							singleClickMonthByMonthSales();
							return '';
						}
					});
				}


				//Refunded gross amount
				function findNetRefund(){
					
					$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds_netamount?startkey=["'+processing_date+'"]&endkey=["'+processing_date+'"]',
						timeout: 10000,
						success: function(data) {

							var temp_refundSum = 0;

							if(data.rows.length > 0){
								temp_refundSum = data.rows[0].value.sum;
							}

							dayByDaySalesData[majorIndex].grossRefund = temp_refundSum;

							//Calculate Extras
							calculateExtraCharges();

						},
						error: function(data){
							completeErrorList.push({
							    "step": 15,
								"error": "Unable to find the daily sales trend. Calculating the refunds failed."
							});				
							
							dayByDaySalesData = [];
							singleClickMonthByMonthSales();
							return '';
						}
					});
				}


			}


			function calculateExtraCharges(){

				          	  //For a given BILLING PARAMETER, the total Sales in the given DATE RANGE
							  $.ajax({
							    type: 'GET',
							    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[0].name+'","'+processing_date+'"]&endkey=["'+modes[0].name+'","'+processing_date+'"]',
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
											url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[0].name+'","'+processing_date+'"]&endkey=["'+modes[0].name+'","'+processing_date+'"]',
											timeout: 10000,
											success: function(data) {

												if(data.rows.length > 0){
												    temp_count += data.rows[0].value.count;
												    temp_sum += data.rows[0].value.sum;
												}

												extrasTemplate.push({
														"name": modes[0].name,
														"value": temp_sum
												});

										    	//Check if next mode exists...
										    	if(modes[1]){
										    		calculateExtraChargesCallback(1, modes);
										    	}
										    	else{

										    		dayByDaySalesData[majorIndex].extras = extrasTemplate;

										    		//Next Step
										    		calculateTotalGuests();
										    	}

											},
											error: function(data){
												completeErrorList.push({
												    "step": 15,
													"error": "Unable to find the daily sales trend. Calculating the charges applied failed."
												});

												dayByDaySalesData = [];
												singleClickMonthByMonthSales();
												return '';
											}
										}); 

							    },
							    error: function(data){
									completeErrorList.push({
									    "step": 15,
										"error": "Unable to find the daily sales trend. Calculating the charges applied failed."
									});	

									dayByDaySalesData = [];
									singleClickMonthByMonthSales();
									return '';   	
							    }
							  });  


			}


			//Callback
			function calculateExtraChargesCallback(index, modes){

						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[index].name+'","'+processing_date+'"]&endkey=["'+modes[index].name+'","'+processing_date+'"]',
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
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[index].name+'","'+processing_date+'"]&endkey=["'+modes[index].name+'","'+processing_date+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
											    temp_sum += data.rows[0].value.sum;
											}


											extrasTemplate.push({
												"name": modes[index].name,
												"value": temp_sum
											});

									    	//Check if next mode exists...
									    	if(modes[index+1]){
									    		calculateExtraChargesCallback(index+1, modes);
									    	}
									    	else{

									    		dayByDaySalesData[majorIndex].extras = extrasTemplate;

									    		//Then go to next step
									    		calculateTotalGuests();
									    	}

										},
										error: function(data){
											completeErrorList.push({
											    "step": 15,
												"error": "Unable to find the daily sales trend. Calculating the charges applied failed."
											});

											dayByDaySalesData = [];
											singleClickMonthByMonthSales();
											return '';
										}
									}); 
						    },
						    error: function(data){
								completeErrorList.push({
								    "step": 15,
									"error": "Unable to find the daily sales trend. Calculating the charges applied failed."
								});

								dayByDaySalesData = [];
								singleClickMonthByMonthSales();
								return '';
						    }
						  }); 

			}	//End step 2 callback




			function calculateTotalGuests(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/totalguests?startkey=["'+processing_date+'"]&endkey=["'+processing_date+'"]',
					timeout: 10000,
					success: function(data) {

						var total_guests = 0;

						if(data.rows.length > 0){
							total_guests = data.rows[0].value.sum;
						}

						dayByDaySalesData[majorIndex].guestCount = total_guests;


						//Check for next iteration
						checkForNextDate();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 15,
							"error": "Unable to find the daily sales trend. Finding the total guests count failed."
						});

						dayByDaySalesData = [];
						singleClickMonthByMonthSales();
						return '';
					}
				});  
			}

			function checkForNextDate() {
				if(processing_date == fromDate){
					singleClickMonthByMonthSales();
					return '';
				}
				else{
					generateSalesByDate(majorIndex + 1);
				}
			}


		} // end - generateSalesByDate()


	} // end - singleClickDayByDaySales()



	//Step 16: Month by Month Sales
	function singleClickMonthByMonthSales(){

		runReportAnimation(55); //Step 15 takes ~35 unit time


		var current_year = moment(fromDate, 'YYYYMMDD').format('YYYY');
		var current_month = moment(fromDate, 'YYYYMMDD').format('MM');

		var begin_date = moment(current_year + '0101', 'YYYYMMDD').format('YYYYMMDD');


		//Preload Billing Parameters
		var modes = DATA_BILLING_PARAMETERS;
		
		generateMonthlySchedule(0);

		function generateMonthlySchedule(majorIndex){

			var date_starting = moment(begin_date, 'YYYYMMDD').add(majorIndex, 'months').format('YYYYMMDD');
			var date_ending = moment(date_starting, 'YYYYMMDD').endOf('month').format('YYYYMMDD');
		
			var processing_month = moment(date_starting, 'YYYYMMDD').format('MM');

			if(processing_month == current_month){ //Until today only.
				date_ending = moment(toDate, 'YYYYMMDD').format('YYYYMMDD');
			}

			monthByMonthSalesData[majorIndex] = {
				"tag": moment(date_starting, 'YYYYMMDD').format('MMMM, YYYY'),
				"range": moment(date_starting, 'YYYYMMDD').format('Do') +" - "+ moment(date_ending, 'YYYYMMDD').format('Do MMM'),
				"days": moment(date_ending, 'YYYYMMDD').diff(moment(date_starting, 'YYYYMMDD'), 'days') + 1,
				"date_start": moment(date_starting, 'YYYYMMDD').format('YYYYMMDD'),
				"date_end": moment(date_ending, 'YYYYMMDD').format('YYYYMMDD'),
				"netAmount": 0,
				"grossSales": 0,
				"netRefund": 0,
				"grossRefund": 0,
				"count": 0,
				"guestCount": 0
			}

			if(processing_month >= current_month){

				//Stop, go to next step
				generateMonthlySales(0);
				return '';
			}
			else{
				generateMonthlySchedule(majorIndex + 1);
			}

		}



		//Now calculate sales as per Schedule
		function generateMonthlySales(secondaryIndex){


			var extrasTemplate = [];

			calculateTotalPaid();

			function calculateTotalPaid(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_paidamount?startkey=["'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
					timeout: 10000,
					success: function(data) {

						var temp_totalOrders = 0;
						var temp_totalPaid = 0;

						if(data.rows.length > 0){
							temp_totalOrders = data.rows[0].value.count;
							temp_totalPaid = data.rows[0].value.sum;
						}

						monthByMonthSalesData[secondaryIndex].netAmount = temp_totalPaid;
						monthByMonthSalesData[secondaryIndex].count = temp_totalOrders;

						calculateGrossAmount();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 16,
							"error": "Unable to generate the monthly sales trend. Calculating the net amount failed."
						});

						monthByMonthSalesData = [];
						singleClickDiscountDetails();
						return '';
					}
				});  
			}


			function calculateGrossAmount(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/grandtotal_netamount?startkey=["'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
					timeout: 10000,
					success: function(data) {

						var gross_cart = 0;

						if(data.rows.length > 0){
							gross_cart = data.rows[0].value.sum;
						}

						monthByMonthSalesData[secondaryIndex].grossSales = gross_cart;


						//Find Refunds
						calculateRefundAmount();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 16,
							"error": "Unable to generate the monthly sales trend. Calculating the gross sales failed."
						});

						monthByMonthSalesData = [];
						singleClickDiscountDetails();
						return '';
					}
				});  
			}


			function calculateRefundAmount(){

				findGrossRefund();

				//Refunded net amount (gross Amount + Extras)
				function findGrossRefund(){
					
					$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds?startkey=["'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
						timeout: 10000,
						success: function(data) {

							var temp_refundSum = 0;

							if(data.rows.length > 0){
								temp_refundSum = data.rows[0].value.sum;
							}

							monthByMonthSalesData[secondaryIndex].netRefund = temp_refundSum;

							findNetRefund();					 

						},
						error: function(data){
							completeErrorList.push({
							    "step": 16,
								"error": "Unable to generate the monthly sales trend. Calculating the refunds failed."
							});				

							monthByMonthSalesData = [];
							singleClickDiscountDetails();
							return '';
						}
					});
				}


				//Refunded gross amount
				function findNetRefund(){
					
					$.ajax({
					    type: 'GET',
						url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/refund-summary/_view/allrefunds_netamount?startkey=["'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
						timeout: 10000,
						success: function(data) {

							var temp_refundSum = 0;

							if(data.rows.length > 0){
								temp_refundSum = data.rows[0].value.sum;
							}

							monthByMonthSalesData[secondaryIndex].grossRefund = temp_refundSum;

							//Calculate Extras
							calculateExtraCharges();

						},
						error: function(data){
							completeErrorList.push({
							    "step": 16,
								"error": "Unable to generate the monthly sales trend. Calculating the refunds failed."
							});				

							monthByMonthSalesData = [];
							singleClickDiscountDetails();
							return '';
						}
					});
				}


			}


			function calculateExtraCharges(){

				          	  //For a given BILLING PARAMETER, the total Sales in the given DATE RANGE
							  $.ajax({
							    type: 'GET',
							    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[0].name+'","'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+modes[0].name+'","'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
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
											url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[0].name+'","'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+modes[0].name+'","'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
											timeout: 10000,
											success: function(data) {

												if(data.rows.length > 0){
												    temp_count += data.rows[0].value.count;
												    temp_sum += data.rows[0].value.sum;
												}

												extrasTemplate.push({
														"name": modes[0].name,
														"value": temp_sum
												});

										    	//Check if next mode exists...
										    	if(modes[1]){
										    		calculateExtraChargesCallback(1, modes);
										    	}
										    	else{

										    		monthByMonthSalesData[secondaryIndex].extras = extrasTemplate;

										    		//Next Step
										    		calculateTotalGuests();
										    	}

											},
											error: function(data){
												completeErrorList.push({
												    "step": 16,
													"error": "Unable to generate the monthly sales trend. Calculating the applied charges failed."
												});

												monthByMonthSalesData = [];
												singleClickDiscountDetails();
												return '';
											}
										}); 

							    },
							    error: function(data){
									completeErrorList.push({
									    "step": 16,
										"error": "Unable to generate the monthly sales trend. Calculating the applied charges failed."
									});	

									monthByMonthSalesData = [];
									singleClickDiscountDetails();
									return '';  	
							    }
							  });  


			}


			//Callback
			function calculateExtraChargesCallback(index, modes){

						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras?startkey=["'+modes[index].name+'","'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+modes[index].name+'","'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
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
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbyextras_custom?startkey=["'+modes[index].name+'","'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+modes[index].name+'","'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
											    temp_sum += data.rows[0].value.sum;
											}


											extrasTemplate.push({
												"name": modes[index].name,
												"value": temp_sum
											});

									    	//Check if next mode exists...
									    	if(modes[index+1]){
									    		calculateExtraChargesCallback(index+1, modes);
									    	}
									    	else{

									    		monthByMonthSalesData[secondaryIndex].extras = extrasTemplate;

									    		//Then go to next step
									    		calculateTotalGuests();
									    	}

										},
										error: function(data){
											completeErrorList.push({
											    "step": 16,
												"error": "Unable to generate the monthly sales trend. Calculating the applied charges failed."
											});

											monthByMonthSalesData = [];
											singleClickDiscountDetails();
											return '';
										}
									}); 
						    },
						    error: function(data){
								completeErrorList.push({
								    "step": 16,
									"error": "Unable to generate the monthly sales trend. Calculating the applied charges failed."
								});

								monthByMonthSalesData = [];
								singleClickDiscountDetails();
								return '';
						    }
						  }); 

			}	//End step 2 callback




			function calculateTotalGuests(){

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/totalguests?startkey=["'+monthByMonthSalesData[secondaryIndex].date_start+'"]&endkey=["'+monthByMonthSalesData[secondaryIndex].date_end+'"]',
					timeout: 10000,
					success: function(data) {

						var total_guests = 0;

						if(data.rows.length > 0){
							total_guests = data.rows[0].value.sum;
						}

						monthByMonthSalesData[secondaryIndex].guestCount = total_guests;


						//Check for next iteration
						checkForNextDate();

					},
					error: function(data){
						completeErrorList.push({
						    "step": 16,
							"error": "Unable to generate the monthly sales trend. Finding total number of guests failed."
						});

						monthByMonthSalesData = [];
						singleClickDiscountDetails();
						return '';
					}
				});  
			}

			function checkForNextDate() {
				if(monthByMonthSalesData[secondaryIndex + 1]){
					generateMonthlySales(secondaryIndex + 1);
				}
				else{
					singleClickDiscountDetails();
					return '';
				}
			}


		}

	}



	//Step 17: Discounts Summary
	function singleClickDiscountDetails(){

		runReportAnimation(70); //Step 16 takes ~15 unit time

		fetchDiscountSaleSummary();

		function fetchDiscountSaleSummary(){

			var total_Count = 0;
			var total_Sum = 0;

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
								    detailedDiscountsData.push({
										"name": modes[0].name,
										"amount": temp_sum,
										"count": temp_count
									})
								}	

								//Check if next mode exists...
								if(modes[1]){
									fetchDiscountSaleSummaryCallback(1, modes, fromDate, toDate, detailedDiscountsData, total_Count, total_Sum);
								}
								else{
						    		singleClickTopSellingItems();
								}

						    },
						    error: function(data){
								completeErrorList.push({
								    "step": 17,
									"error": "Failed to calculate discounts summary."
								});

								detailedDiscountsData = [];
								singleClickTopSellingItems();
								return '';
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
						    detailedDiscountsData.push({
								"name": modes[index].name,
								"amount": temp_sum,
								"count": temp_count
							})
						}										

						//Check if next mode exists...
						if(modes[index+1]){
							fetchDiscountSaleSummaryCallback(index+1, modes, fromDate, toDate, detailedDiscountsData, total_Count, total_Sum);
						}
						else{
							singleClickTopSellingItems();
						}

				    },
				    error: function(data){
								completeErrorList.push({
								    "step": 17,
									"error": "Failed to calculate discounts summary."
								});

								detailedDiscountsData = [];
								singleClickTopSellingItems();
								return '';
				    }
				  }); 

		}


	}


	//Step 18: Find Top Selling items
	function singleClickTopSellingItems(){

		runReportAnimation(72); //Step 17 takes 2 unit time

		$.ajax({
			type: 'GET',
			url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/order-summary/_view/itemsCount?startkey=["'+fromDate+'"]&endkey=["'+toDate+'",{}]&group=true',
			timeout: 50000,
			success: function(data) {

				var itemsList = data.rows;

				if(itemsList.length == 0){
					singleClickCancellationDetails();
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
					detailedTopItemsData = itemsFilteredList;
					//singleClickCancellationDetails();
					processGroupWiseSales(itemsList);
				}
			},
			error: function(data){
						completeErrorList.push({
						    "step": 18,
							"error": "Unable to find the top selling items."
						});

						detailedTopItemsData = [];
						singleClickCancellationDetails();
						return '';						    	
			}

		});  


		function processGroupWiseSales(itemsMasterList){
			
			var itemsList = itemsMasterList;

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

					if(x == 'MANUAL_UNKNOWN' || x == 'UNKNOWN'){
						x = 'Uncategorized';
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
					
					if(categorisedItemsList.length > 0){ 
						var n = 0;
						while(categorisedItemsList[n]){ //render category
							
							var itemsTotalSales = 0;
							var itemsTotalCount = 0;

							for(var i = 0; i < categorisedItemsList[n].items.length; i++){
								itemsTotalSales += categorisedItemsList[n].items[i].saleAmount;
								itemsTotalCount += categorisedItemsList[n].items[i].count;
							}

							categorisedItemsList[n].totalSales = itemsTotalSales;
							categorisedItemsList[n].totalCount = itemsTotalCount;
							delete categorisedItemsList[n].items;

							if(n == categorisedItemsList.length - 1){ //last iteration
								detailedItemCategoryWiseData = categorisedItemsList;
								
								//Process data
								processCategoryWiseData();
								return '';
							}

							n++;
						}
					}
				}



			}

		} // end - processGroupWiseSales();	


		function processCategoryWiseData(){

		    //Preload menu catalog
		    var requestData = {
		      "selector"  :{ 
		                    "identifierTag": "ACCELERATE_MENU_CATALOG" 
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
		          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATALOG'){

		              var catalogData = data.docs[0].value;

		              var n = 0;
		              while(detailedItemCategoryWiseData[n]){
		                detailedItemCategoryWiseData[n].topCategory = getTopLevelCategory(detailedItemCategoryWiseData[n].category);
		              	n++;
		              }

		              function getTopLevelCategory(category_name) {
		                for(var i = 0; i < catalogData.length; i++){
		                  if(catalogData[i].name == category_name){
		                    return catalogData[i].mainType;
		                    break;
		                  }
		                }

		                return "Uncategorized";
		              }


		              //Step 19:
		              singleClickCancellationDetails();
		          }
		        }
		      },
		      error: function(data) {
						completeErrorList.push({
						    "step": 18,
							"error": "Unable to calculate category wise item sales."
						});

						detailedItemCategoryWiseData = [];
						singleClickCancellationDetails();
						return '';	
		      }

		    });  			
		}	
	

	}






	//Step 19: Cancellation Details
	function singleClickCancellationDetails(){

		runReportAnimation(73); //Step 18 takes 1 unit time

		if(fromDate != toDate){
			findInvoiceCancellationsSummary();
			return '';
		}
		else{
			findItemCancellations();
			return '';
		}



		//Item Cancellations
		function findItemCancellations(){

				$.ajax({
					type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_item_cancellations/_design/cancellation-summary/_view/fetchall?startkey=["'+fromDate+'"]&endkey=["'+toDate+'"]&descending=false',
					timeout: 50000,
					success: function(data) {

						cancellationsData_items = data.rows;
						findOrderCancellations();
						
					},
					error: function(data){
							completeErrorList.push({
							    "step": 19,
								"error": "Unable to generate Cancellation Details. Loading the cancelled items failed."
							});

							findOrderCancellations();
							return '';		    	
					}
				}); 
			
		}


		//Find Order Cancellations
		function findOrderCancellations(){

				var filter_start = moment(fromDate, 'YYYYMMDD').format('DD-MM-YYYY');

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_orders/_design/order-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_start+'"]&descending=false&include_docs=true',
					timeout: 10000,
					success: function(data) {

				      cancellationsData_orders = data.rows;

				      findInvoiceCancellations();

					},
					error: function(data){
							completeErrorList.push({
							    "step": 19,
								"error": "Unable to generate Cancellation Details. Loading the cancelled orders failed."
							});

							findInvoiceCancellations();
							return '';	
					}
				});  
		}


		//Cancelled Invoices
		function findInvoiceCancellations(){

				var filter_start = moment(fromDate, 'YYYYMMDD').format('DD-MM-YYYY');

				$.ajax({
				    type: 'GET',
					url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-filters/_view/showall?startkey=["'+filter_start+'"]&endkey=["'+filter_start+'"]&descending=false&include_docs=true',
					timeout: 10000,
					success: function(data) {

				      cancellationsData_invoices = data.rows;

				      findInvoiceCancellationsSummary();

					},
					error: function(data){
							completeErrorList.push({
							    "step": 19,
								"error": "Unable to generate Cancellation Details. Loading the cancelled invoices failed."
							});

							findInvoiceCancellationsSummary();
							return '';	
					}
				});  

		}


		//Bill Cancellations Summary
		function findInvoiceCancellationsSummary(){

			fetchCancellationSummary();

			function fetchCancellationSummary(){


			              	var modes = DATA_BILLING_MODES;

				          	if(modes.length == 0){
				          		singleClickDetailedByModes();
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
							    	
							    	var temp_count = 0;
							    	var temp_sum = 0;

							    	if(data.rows.length > 0){
								    	temp_count = data.rows[0].value.count;
								    	temp_sum = data.rows[0].value.sum;

								    	grandSum += temp_sum;
							    		grandCount += temp_count;
							    	}

							    		invoiceCancellationsData.push({
							    			"mode": modes[0].name,
							    			"type": modes[0].type,
							    			"amount": temp_sum,
							    			"count": temp_count
							    		});


										if(modes[1]){
								    		fetchCancellationSummaryCallback(1, modes, grandSum, grandCount);
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

													invoiceCancellationsMetaData.total_unpaid_count = total_unpaid_count;
													invoiceCancellationsMetaData.total_unpaid_sum = total_unpaid_sum;
													invoiceCancellationsMetaData.total_paid_count = total_paid_count;
													invoiceCancellationsMetaData.total_paid_sum = total_paid_sum;
													invoiceCancellationsMetaData.grand_count = grandCount;
													invoiceCancellationsMetaData.grand_sum = grandSum;
													
													singleClickDetailedByModes();
												}						
											}

								    	}
									
							    },
							    error: function(data){
									completeErrorList.push({
									    "step": 19,
										"error": "Failed to load the cancelled invoices. Cancellation Summary can not be generated."
									});

									invoiceCancellationsData = [];
									singleClickDetailedByModes();
									return '';
							    }
							  });  
			}


			function fetchCancellationSummaryCallback(index, modes, grandSum, grandCount){

							  $.ajax({
							    type: 'GET',
							    url: COMMON_LOCAL_SERVER_IP+'/accelerate_cancelled_invoices/_design/invoice-summary/_view/sumbybillingmode?startkey=["'+modes[index].name+'","'+fromDate+'"]&endkey=["'+modes[index].name+'","'+toDate+'"]',
							    timeout: 10000,
							    success: function(data) {

							    	var temp_count = 0;
							    	var temp_sum = 0;

							    	if(data.rows.length > 0){
								    	temp_count = data.rows[0].value.count;
								    	temp_sum = data.rows[0].value.sum;

								    	grandSum += temp_sum;
							    		grandCount += temp_count;
							    	}


									invoiceCancellationsData.push({
							    		"mode": modes[index].name,
							   			"type": modes[index].type,
							   			"amount": temp_sum,
							   			"count": temp_count
							   		});
									
									
							    	//Check if next mode exists...
							    	if(modes[index+1]){
							    		fetchCancellationSummaryCallback(index+1, modes, grandSum, grandCount);
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

												invoiceCancellationsMetaData.total_unpaid_count = total_unpaid_count;
												invoiceCancellationsMetaData.total_unpaid_sum = total_unpaid_sum;
												invoiceCancellationsMetaData.total_paid_count = total_paid_count;
												invoiceCancellationsMetaData.total_paid_sum = total_paid_sum;
												invoiceCancellationsMetaData.grand_count = grandCount;
												invoiceCancellationsMetaData.grand_sum = grandSum;
												
												singleClickDetailedByModes();
											}						
										}


							    	}
							    },
							    error: function(data){
									completeErrorList.push({
									    "step": 19,
										"error": "Failed to load the cancelled invoices. Cancellation Summary can not be generated."
									});

									invoiceCancellationsData = [];
									singleClickDetailedByModes();
									return '';
							    }
							  });  

			}


		}
	}



	//Step 20: Detailed by Billing Modes
	function singleClickDetailedByModes(){

		runReportAnimation(77); //Step 19 takes 4 unit time

		billsGraphData = [];


					              	var modes = DATA_BILLING_MODES;

						          	if(modes.length == 0){
										//Skip and go to next step
										singleClickBillingModesSplitByExtras(); 
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
															"type": modes[0].type,
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
														    "step": 20,
															"error": "Detailed summary by billing modes can not be generated. Failed to calculate refunds against different billing modes."
														});				

														//Skip and go to next step
														singleClickBillingModesSplitByExtras(); 
														return '';										    	
												    }
												});  
												
	


										    },
										    error: function(data){
												completeErrorList.push({
												    "step": 20,
													"error": "Detailed summary by billing modes can not be generated. Failed to calculate total sales under different billing modes."
												});				

												//Skip and go to next step
												singleClickBillingModesSplitByExtras(); 
												return '';										    	
										    }
										});  
									} //else - mode

	}


	//Step 20: Callback
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
															"type": modes[index].type,
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
														    "step": 20,
															"error": "Detailed summary by billing modes can not be generated. Failed to calculate refunds against different billing modes."
														});				

														//Skip and go to next step
														singleClickBillingModesSplitByExtras(); 
														return '';										    	
												    }
												});  

		

										    },
										    error: function(data){
												completeErrorList.push({
												    "step": 20,
													"error": "Detailed summary by billing modes can not be generated. Failed to calculate total sales under different billing modes."
												});				

												//Skip and go to next step
												singleClickBillingModesSplitByExtras(); 
												return '';										    	
										    }
										});  

	}



	//Step 21: Render Graph (Bills)
	function singleClickRenderBillsGraph(){

			runReportAnimation(81); //Step 20 takes 4 unit time

			window.localStorage.graphImageDataBills = '';

			var isAllZeros = true;
			for(var h = 0; h < billsGraphData.length; h++){
				if(billsGraphData[h].value != 0){
					isAllZeros = false;
					break;
				}
			}

			if(billsGraphData.length == 0 || isAllZeros){
				//Skip and go to next step
				singleClickBillingModesSplitByExtras(); 
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

				if(billsGraphData[n].value != 0){
					var colorSet = random_rgba_color_set();

					graph_labels.push(billsGraphData[n].name);
					graph_data.push(parseFloat(((billsGraphData[n].value/totalBaseSum)*100)).toFixed(1))
					graph_background.push(colorSet[0])
					graph_border.push(colorSet[1])
				}

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

				//Go to Step 22
				singleClickBillingModesSplitByExtras();
			}
	}



	//Step 22: Billing Modes (detailed w.r.t Extras, SGST, CGST etc.)
	function singleClickBillingModesSplitByExtras(){
		
		runReportAnimation(81); //Step 21 takes 0 unit time

		var modes = DATA_BILLING_PARAMETERS;

		if(modes.length == 0){
			singleClickDetailedByPayment();	
			return '';
		}
		else{
			//Start Processing
			getDetailedByExtras(0, modes);
		}



		//START PROCESSING
		function getDetailedByExtras(greatIndex, modes){

			/* for animation sake */ 
			if(greatIndex < 3){
				runReportAnimation(81 + greatIndex);
			}
			
			/*
				For a given billing mode, calculate the extras and custom extras 
				coming under this mode. For ex., for Cash Rs. 200, CGST Rs. 5, 
				SGST Rs. 5 etc.
			*/

			var extrasTemplate = [];

			if(detailedListByBillingMode[greatIndex]){
				getDetailedExtrasForBillingMode(detailedListByBillingMode[greatIndex].name, modes)
			}
			else{
				singleClickDetailedByPayment();
				return '';
			}


			function getDetailedExtrasForBillingMode(selectedBillingMode, modes){

			          	  //For a given EXTRAS, the total Sales in the given DATE RANGE
						  $.ajax({
						    type: 'GET',
						    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmodeandextras?startkey=["'+selectedBillingMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[0].name+'","'+toDate+'"]',
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
										url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmodeandextras_custom?startkey=["'+selectedBillingMode+'","'+modes[0].name+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[0].name+'","'+toDate+'"]',
										timeout: 10000,
										success: function(data) {

											if(data.rows.length > 0){
											    temp_count += data.rows[0].value.count;
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
													getDetailedExtrasForBillingModeCallback(1, modes, selectedBillingMode);
										    	}
										    	else{
													//Save changes
										    		detailedListByBillingMode[greatIndex].detailedExtras = extrasTemplate;
													
													getDetailedByExtras(greatIndex + 1, modes);
												}
							

										},
										error: function(data){
							          		completeErrorList.push({
											    "step": 22,
												"error": "Failed to calculate the extras and custom extras against each billing mode."
											});	

							          		detailedListByBillingMode = [];
											singleClickDetailedByPayment();	
							          		return '';
										}
									}); 


						    },
						    error: function(data){
				          		completeErrorList.push({
								    "step": 22,
									"error": "Failed to calculate the extras and custom extras against each billing mode."
								});	

				          		detailedListByBillingMode = [];
								singleClickDetailedByPayment();	
				          		return '';
						    }
						  });  


			} // end - getDetailedExtrasForBillingMode


			function getDetailedExtrasForBillingModeCallback(index, modes, selectedBillingMode){
	          	
	          	  //For a given PAYMENT MODE, the extras in the given DATE RANGE
				  
				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmodeandextras?startkey=["'+selectedBillingMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[index].name+'","'+toDate+'"]',
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
								url: COMMON_LOCAL_SERVER_IP+'/'+SELECTED_INVOICE_SOURCE_DB+'/_design/invoice-summary/_view/sumbybillingmodeandextras_custom?startkey=["'+selectedBillingMode+'","'+modes[index].name+'","'+fromDate+'"]&endkey=["'+selectedBillingMode+'","'+modes[index].name+'","'+toDate+'"]',
								timeout: 10000,
								success: function(data) {

									if(data.rows.length > 0){
									    temp_count += data.rows[0].value.count;
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
							    		getDetailedExtrasForBillingModeCallback(index+1, modes, selectedBillingMode);
							    	}
									else{
										//Save changes
										detailedListByBillingMode[greatIndex].detailedExtras = extrasTemplate;

										getDetailedByExtras(greatIndex + 1, modes);
									}													


								},
								error: function(data){
							      	completeErrorList.push({
									    "step": 22,
										"error": "Failed to calculate the extras and custom extras against each billing mode."
									});	
									
									detailedListByBillingMode =[];
									singleClickDetailedByPayment();	

							      	return ''; 
								}
							}); 


				    },
				    error: function(data){
				      	completeErrorList.push({
						    "step": 22,
							"error": "Failed to calculate the extras and custom extras against each billing mode."
						});	
						
						detailedListByBillingMode =[];
						singleClickDetailedByPayment();	

				      	return ''; 
				    }
				  });  

			} // end - getDetailedExtrasForBillingModeCallback


		} // end - getDetailedByExtras


	}




	//Step 23: Details by Payment types
	function singleClickDetailedByPayment(){

		runReportAnimation(84); //Step 22 takes 3 unit time

		paymentGraphData = [];


	              	var modes = DATA_PAYMENT_MODES;

	              	if(modes.length == 0){		
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
											    		//Step 24:
											    		singleClickRenderPaymentsGraph();
											    	}

												},
												error: function(data){
													completeErrorList.push({
													    "step": 23,
														"error": "Failed to calculate sales against different payment modes"
													});				

													//Skip and go to next step
													detailedListByPaymentMode = [];
													singleClickPaymentModesSplitByExtras(); 
													return '';
												}
											}); 



										},
										error: function(data){
											completeErrorList.push({
											    "step": 23,
												"error": "Failed to calculate sales against different payment modes"
											});				

											//Skip and go to next step
											detailedListByPaymentMode = [];
											singleClickPaymentModesSplitByExtras(); 
											return '';
										}
									}); 


						    },
						    error: function(data){
								completeErrorList.push({
								    "step": 23,
									"error": "Failed to calculate sales against different payment modes"
								});				

								
								detailedListByPaymentMode = [];
								singleClickPaymentModesSplitByExtras(); 
								return '';
						    }
						  }); 
					} 

	          


	}

	//Step 23: Callback
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
											    		//Step 24:
											    		singleClickRenderPaymentsGraph();
											    	}

												},
												error: function(data){
													completeErrorList.push({
													    "step": 23,
														"error": "Failed to calculate sales against different payment modes"
													});				

													//Skip and go to next step
													detailedListByPaymentMode = [];
													singleClickPaymentModesSplitByExtras(); 
													return '';
												}
											}); 


										},
										error: function(data){
											completeErrorList.push({
											    "step": 23,
												"error": "Failed to calculate sales against different payment modes"
											});				

											//Skip and go to next step
											detailedListByPaymentMode = [];
											singleClickPaymentModesSplitByExtras(); 
											return '';
										}
									}); 
							},
					      	error: function(data) {
								completeErrorList.push({
								    "step": 23,
									"error": "Failed to calculate sales against different payment modes"
								});				

								//Skip and go to next step
								detailedListByPaymentMode = [];
								singleClickPaymentModesSplitByExtras(); 
								return '';					        	
					      	}
					    });
	}


	//Step 24: Render Graph (Payments)
	function singleClickRenderPaymentsGraph(){

			runReportAnimation(89); //Step 23 takes 5 unit time

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

				//Go to Next Step
				singleClickPaymentModesSplitByExtras();
			}
	}


	//Step 25: Payment Modes (detailed w.r.t Extras, SGST, CGST etc.)
	function singleClickPaymentModesSplitByExtras(){
		
		runReportAnimation(89); //Step 24 takes 0 unit time
	
		var modes = DATA_BILLING_PARAMETERS;
		if(modes.length == 0){
			singleClickWeeklyProgress();	
			return '';
		}


		getDetailedByExtras(0, modes);

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
				return '';
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
															    "step": 25,
																"error": "Failed to calculate the extras and custom extras against each payment mode."
															});	

											          		detailedListByPaymentMode = [];
															singleClickWeeklyProgress();	
											          		return '';
														}
													}); //split payments with custom extras



												},
												error: function(data){
									          		completeErrorList.push({
													    "step": 25,
														"error": "Failed to calculate the extras and custom extras against each payment mode."
													});	

									          		detailedListByPaymentMode = [];
													singleClickWeeklyProgress();
									          		return '';
												}
											}); //split payments



										},
										error: function(data){
							          		completeErrorList.push({
											    "step": 25,
												"error": "Failed to calculate the extras and custom extras against each payment mode."
											});	

							          		detailedListByPaymentMode = [];
											singleClickWeeklyProgress();	
							          		return '';
										}
									}); 


						    },
						    error: function(data){
				          		completeErrorList.push({
								    "step": 25,
									"error": "Failed to calculate the extras and custom extras against each payment mode."
								});	

				          		detailedListByPaymentMode = [];
								singleClickWeeklyProgress();	
				          		return '';
						    }
						  });  


			} // end - getDetailedExtrasForPaymentMode


			//Callback
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
													    "step": 25,
														"error": "Failed to calculate the extras and custom extras against each payment mode."
													});	
													
													detailedListByPaymentMode = [];
													singleClickWeeklyProgress();	
											      	return ''; 
												}
											}); //split payments with custom extras
										



										},
										error: function(data){
									      	completeErrorList.push({
											    "step": 25,
												"error": "Failed to calculate the extras and custom extras against each payment mode."
											});	
											
											detailedListByPaymentMode = [];
											singleClickWeeklyProgress();	
									      	return ''; 
										}
									}); //split payments




								},
								error: function(data){
							      	completeErrorList.push({
									    "step": 25,
										"error": "Failed to calculate the extras and custom extras against each payment mode."
									});	
									
									detailedListByPaymentMode = [];
									singleClickWeeklyProgress();	
							      	return ''; 
								}
							}); 


				    },
				    error: function(data){
				      	completeErrorList.push({
						    "step": 25,
							"error": "Failed to calculate the extras and custom extras against each payment mode."
						});	
						
						detailedListByPaymentMode = [];
						singleClickWeeklyProgress();	
				      	return ''; 
				    }
				  });  

			} // end - getDetailedExtrasForPaymentModeCallback


		} // end - getDetailedByExtras


	}



	//Step 26: Weekly Progress
	function singleClickWeeklyProgress(){

		runReportAnimation(93); //Step 25 takes 4 unit time
		
		/*
			Note: Rough figure only, refunds not included.
		*/

		var lastWeek_start = moment(fromDate, 'YYYYMMDD').subtract(13, 'days').format('YYYYMMDD');

		var currentIndex = 1;

		calculateSalesByDate(currentIndex, lastWeek_start)

		function calculateSalesByDate(index, mydate){

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
					    "step": 26,
						"error": "Unable to generate the weekly sales trend. Failed to load the sales data."
					});				

					//Skip and go to next step
					weeklyProgressThisWeek = [];
					weeklyProgressLastWeek = [];

					singleClickWeeklyWeeklyGraphRenderer(); 
					return '';						
				}
			});  
		}

	}

	//Step 27: Render Weekly Graph
	function singleClickWeeklyWeeklyGraphRenderer(){

		runReportAnimation(97); //Step 26 takes 4 unit time

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


	//Step 28: Final Reports Render Stage
	function singleClickGenerateAllReports(){

		runReportAnimation(97); //Step 27 takes 0 unit time

		//Get staff info.
		var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
		
		if(jQuery.isEmptyObject(loggedInStaffInfo)){
			loggedInStaffInfo.name = 'Staff';
			loggedInStaffInfo.code = '0000000000';
		}	


		var reportInfo_branch = window.localStorage.accelerate_licence_branch_name ? window.localStorage.accelerate_licence_branch_name : '';
			
		if(reportInfo_branch == ''){
			showToast('System Error: Branch name not found.', '#e74c3c');
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

			var fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY - dddd');

			var reportInfo_title = 'Sales Report of <b>'+fancy_from_date+'</b>';
			var temp_report_title = 'Sales Report of '+fancy_from_date;
			
			if(fromDate != toDate){
				fancy_from_date = moment(fromDate, 'YYYYMMDD').format('Do MMMM YYYY');
				var fancy_to_date = moment(toDate, 'YYYYMMDD').format('Do MMMM YYYY');

				reportInfo_title = 'Sales Report from <b>'+fancy_from_date+'</b> to <b>'+fancy_to_date+'</b>';
				temp_report_title = 'Sales Report from '+fancy_from_date+' to '+fancy_to_date;
			}

			var fancy_report_title_name = reportInfo_branch+' - '+temp_report_title;


			//Render Templates
			var quickSummaryRendererContent = ''; //Quick Summary
			var weeklyTrendRenderContent = ''; //Weekly Trend
			var hourlySalesSummaryTemplate = ''; //Hourly Trend
			var dayByDaySalesSummaryTemplate = ''; //Day by Day Summary
			var sessionSummaryTemplate = ''; //Session Summary
			var downloadSummaryCancellations = ''; //Bill Cancellations
			var reducedBillingModesContentFinal = ''; //Reduced Billing Modes (DINE, DELIVERY etc.)
			var salesByBillingModeRenderContentFinal = ''; //By Billing Modes
			var salesByPaymentTypeRenderContentFinal = ''; //By Payment Modes
			var topSellingTemplate = ''; //Top Selling
			var categoryWiseSalesSummaryTemplate = ''; //Category wise report
			var discountSummaryTemplate = ''; //Discounts

			var cancelledItemsSummaryTemplate = '';
			var cancelledOrdersSummaryTemplate = '';
			var cancelledInvoicesSummaryTemplate = '';


			renderWeeklyTrend();

			/* WEEKLY SALES COMPARISON */
			function renderWeeklyTrend(){

				if(fromDate != toDate){
					renderHourlyTrend();
					return ''; //Skip this
				}

				var hasWeeklyGraphAttached = false; //To display weekly graph or not
				if(window.localStorage.graphImageDataWeekly && window.localStorage.graphImageDataWeekly != ''){
					hasWeeklyGraphAttached = true;
				}

				var weeklyTrendSummaryTableContent = '';
				for(var i = 0; i < overalSalesTrend.length; i++){
					weeklyTrendSummaryTableContent += '<tr><td class="tableQuickBrief">'+overalSalesTrend[i].tag+'<span style="color: #5a5757; display: block; font-size:12px">'+overalSalesTrend[i].range+'</span></td><td class="tableQuickAmount"><span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-size: 12px; font-style: italic; margin-right: 15px">'+(overalSalesTrend[i].count > 0 ? 'from '+overalSalesTrend[i].count+' orders' : 'No orders')+'</span><span class="price">Rs.</span>'+overalSalesTrend[i].amount+'</td></tr>';
				}

				var weeklyTrendSummaryTableTemplate = '';

				if(weeklyTrendSummaryTableContent != ''){
					weeklyTrendSummaryTableTemplate = ''+
					           '<div class="tableQuick" style="margin-top: 20px;">'+
					              '<table style="width: 100%">'+
					                 '<col style="width: 70%">'+
					                 '<col style="width: 30%">'+
					             	 weeklyTrendSummaryTableContent+
					              '</table>'+
					           '</div>';
				}


				var oneLineSummary = '';

				if(overalSalesTrend[2].amount >= overalSalesTrend[3].amount && overalSalesTrend[3].amount > 0){
					//percentage increase
					var percentage_increase = parseFloat(((overalSalesTrend[2].amount - overalSalesTrend[3].amount) * 100)/overalSalesTrend[3].amount).toFixed(1);
					if(percentage_increase < 5 && percentage_increase > 1){
						//Slight increase in sales
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #1eb194; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #1abc9c;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="218.623,195.004 271.438,119.425 253.165,106.656 322.534,74.229 315.939,150.522 297.668,137.755 227.994,237.459 153.407,194.118 97.979,266.002 72.639,246.461 145.21,152.345" fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Slight Increase in Sales by <tag style="font-size: 26px">'+percentage_increase+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
					else if(percentage_increase >= 5 && percentage_increase < 10){
						//Noticeable increase
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #1eb194; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #1abc9c;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="218.623,195.004 271.438,119.425 253.165,106.656 322.534,74.229 315.939,150.522 297.668,137.755 227.994,237.459 153.407,194.118 97.979,266.002 72.639,246.461 145.21,152.345" fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Noticeable Increase in Sales by <tag style="font-size: 26px">'+percentage_increase+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
					else if(percentage_increase >= 10 && percentage_increase < 20){
						//Good Increase
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #1eb194; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #1abc9c;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="218.623,195.004 271.438,119.425 253.165,106.656 322.534,74.229 315.939,150.522 297.668,137.755 227.994,237.459 153.407,194.118 97.979,266.002 72.639,246.461 145.21,152.345" fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Good Increase in Sales by <tag style="font-size: 26px">'+percentage_increase+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
					else if(percentage_increase >= 20){
						//Fantastic increase
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #1eb194; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #1abc9c;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="218.623,195.004 271.438,119.425 253.165,106.656 322.534,74.229 315.939,150.522 297.668,137.755 227.994,237.459 153.407,194.118 97.979,266.002 72.639,246.461 145.21,152.345" fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Fantastic Boost in Sales by <tag style="font-size: 26px">'+percentage_increase+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
				}
				else if(overalSalesTrend[3].amount >= overalSalesTrend[2].amount && overalSalesTrend[2].amount > 0){
					//percentage decrease
					var percentage_decrease = parseFloat(((overalSalesTrend[3].amount - overalSalesTrend[2].amount) * 100)/overalSalesTrend[2].amount).toFixed(1);
					if(percentage_decrease < 5 && percentage_decrease > 1){
						//Slight decrease in sales
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #d24a39; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #e85948;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="211.232,145.228 264.046,220.807 245.774,233.575 315.143,266.002 308.548,189.709 290.276,202.477 220.604,102.772 146.016,146.113 90.588,74.229 65.247,93.771 137.819,187.887 " fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Slight Decrease in Sales by <tag style="font-size: 26px">-'+percentage_decrease+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
					else if(percentage_decrease >= 5 && percentage_decrease < 10){
						//Noticeable decrease
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #d24a39; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #e85948;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="211.232,145.228 264.046,220.807 245.774,233.575 315.143,266.002 308.548,189.709 290.276,202.477 220.604,102.772 146.016,146.113 90.588,74.229 65.247,93.771 137.819,187.887 " fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Noticeable Decrease in Sales by <tag style="font-size: 26px">-'+percentage_decrease+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
					else if(percentage_decrease >= 10 && percentage_decrease < 20){
						//Good decrease
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #d24a39; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #e85948;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="211.232,145.228 264.046,220.807 245.774,233.575 315.143,266.002 308.548,189.709 290.276,202.477 220.604,102.772 146.016,146.113 90.588,74.229 65.247,93.771 137.819,187.887 " fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Huge Decrease in Sales by <tag style="font-size: 26px">-'+percentage_decrease+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
					else if(percentage_decrease >= 20){
						//Tremendous decrease
						oneLineSummary = 	'<div style="width: 100%; margin-top: 20px; display: block; height: 50px; background: #d24a39; position: relative;">'+
												'<div style="position: absolute; left: 0; top: 0; width: 30px; padding: 10px;background: #e85948;"><svg version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve"> <g> <g> <polygon points="40,310 40,0 0,0 0,350 350,350 350,310" fill="#fff"/> <polygon points="211.232,145.228 264.046,220.807 245.774,233.575 315.143,266.002 308.548,189.709 290.276,202.477 220.604,102.772 146.016,146.113 90.588,74.229 65.247,93.771 137.819,187.887 " fill="#fff"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>'+
												'<div><p style="color: #FFF;font-weight: bold;font-size: 18px;margin: 0;padding: 7px 15px 0 65px;text-align: left;">Extremly Huge Decrease in Sales by <tag style="font-size: 26px">-'+percentage_decrease+'</tag>% from previous Week</p></div>'+
											'</div>';
					}
				}

				if(oneLineSummary != ''){
					weeklyTrendSummaryTableTemplate += oneLineSummary;
				}



				weeklyTrendRenderContent = ''+
				        '<div class="summaryTableSectionHolder">'+
				          '<div class="summaryTableSection">'+
				             '<div class="tableQuickHeader">'+
				                '<h1 class="tableQuickHeaderText">SALES TREND</h1>'+
				             '</div>'+
				             (hasWeeklyGraphAttached ? '<div class="weeklyGraph"><img src="'+window.localStorage.graphImageDataWeekly+'" style="max-width: 90%"></div>' : '')+
				             weeklyTrendSummaryTableTemplate+
				          '</div>'+
				        '</div>';

				renderHourlyTrend();
			}



			/* HOURLY SALES TREND */
			function renderHourlyTrend(){

				var hasHourlyGraphAttached = false;
				if(window.localStorage.graphImageDataHourly && window.localStorage.graphImageDataHourly != ''){
					hasHourlyGraphAttached = true;
				}

				var hourlySalesSummaryContent = '';
				var hourlySalesSummaryContent_firstHalf = '';
				var hourlySalesSummaryContent_secondHalf = '';

				for(var g = 0; g < hourlySalesData.length; g++){

					var slot_name = hourlySalesData[g].hour_slot;
					
					if(slot_name == 0){
						slot_name = 'Midnight to 1 am';
					}
					else if(slot_name == 11){
						slot_name = '11 am to 12 Noon';
					}
					else if(slot_name < 12){
						slot_name = slot_name + ' am to '+(slot_name+1)+' am';
					}
					else if(slot_name == 12){
						slot_name = '12 Noon to 1 pm';
					}
					else if(slot_name == 23){
						slot_name = '11 pm to Midnight';
					}
					else{
						slot_name = (slot_name-12) + ' pm to ' +(slot_name-12+1)+' pm';
					}


					if(g <= hourlySalesData.length/2){
						hourlySalesSummaryContent_firstHalf +='<tr><td class="tableQuickBrief" style="font-size: 13px">'+slot_name+'</td><td class="tableQuickBrief" style="color: #5a5757; text-align: center; font-size:12px">'+(hourlySalesData[g].number_of_guests > 0 ? hourlySalesData[g].number_of_guests : '-')+'</td><td class="tableQuickBrief" style="text-align: center; font-size:12px">'+hourlySalesData[g].count+'</td><td class="tableQuickAmount" style="font-size: 13px"><span class="price">Rs.</span>'+hourlySalesData[g].amount+'</td></tr>';
					}
					else{
						hourlySalesSummaryContent_secondHalf += '<tr><td class="tableQuickBrief" style="font-size: 13px">'+slot_name+'</td><td class="tableQuickBrief" style="color: #5a5757; text-align: center; font-size:12px">'+(hourlySalesData[g].number_of_guests > 0 ? hourlySalesData[g].number_of_guests : '-')+'</td><td class="tableQuickBrief" style="text-align: center; font-size:12px">'+hourlySalesData[g].count+'</td><td class="tableQuickAmount" style="font-size: 13px"><span class="price">Rs.</span>'+hourlySalesData[g].amount+'</td></tr>';
					}
				}

				if(hourlySalesData.length > 0){
					hourlySalesSummaryContent = ''+
							'<div style="position: relative; margin-top: 20px">'+
								'<div style="width: 48%; display: block; float: left;">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Time Slot</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Guests</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Bills</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales</td>'+
						                 hourlySalesSummaryContent_firstHalf+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						        '<div style="width: 48%; float: right; display:block">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Time Slot</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Guests</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Bills</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales</td>'+
						                 hourlySalesSummaryContent_secondHalf+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						    '</div>';

					hourlySalesSummaryTemplate = ''+	
							'<div class="summaryTableSectionHolder">'+
						        '<div class="summaryTableSection">'+
						           '<div class="tableQuickHeader">'+
						              '<h1 class="tableQuickHeaderText">HOURLY SALES TREND</h1>'+
						           '</div>'+
						           (hasHourlyGraphAttached ? '<div class="weeklyGraph"><img src="'+window.localStorage.graphImageDataHourly+'" style="max-width: 90%"></div>' : '')+
						           hourlySalesSummaryContent+
						        '</div>'+
						    '</div>';	
				}


				renderSessionSummary();
			}


			/* SESSION SUMMARY */
			function renderSessionSummary(){

				var sessionSummaryContent = '';
				for(var i = 0; i < sessionWiseSalesData.length; i++){
					sessionSummaryContent += '<tr><td class="tableQuickBrief"><b>'+sessionWiseSalesData[i].session+'</b> Session'+(sessionWiseSalesData[i].range ? '<span style="color: #5a5757; display: block; font-size:12px">'+sessionWiseSalesData[i].range+'</span>' : '')+'</td> <td class="tableQuickBrief" style="color: #5a5757; font-style: italic">'+(sessionWiseSalesData[i].number_of_guests > 0 ? sessionWiseSalesData[i].number_of_guests + ' guests': '')+'</td> <td class="tableQuickBrief" style="color: #5a5757; font-style: italic">'+(sessionWiseSalesData[i].count > 0 ? sessionWiseSalesData[i].count + ' bills' : 'No bills')+'</td> <td class="tableQuickAmount"><span class="price">Rs.</span>'+sessionWiseSalesData[i].amount+'</td></tr>';
				}

				if(sessionSummaryContent != ''){
					sessionSummaryTemplate = ''+
						'<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">SESSION WISE SALES</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 sessionSummaryContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
				}

				renderDiscounts();
			}


			/* DISCOUNTS */
			function renderDiscounts(){

				var discountSummaryContent = '';
				var effective_sum = 0;
				for(var i = 0; i < detailedDiscountsData.length; i++){
					discountSummaryContent += '<tr><td class="tableQuickBrief">'+detailedDiscountsData[i].name+'<span style="color: #5a5757; font-size:12px; font-style: italic; margin-left: 10px">on '+detailedDiscountsData[i].count+' orders</span></td> <td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedDiscountsData[i].amount).toFixed(2)+'</td></tr>';
					effective_sum += detailedDiscountsData[i].amount;
				}

				if(discountSummaryContent != ''){
					discountSummaryTemplate = ''+
						'<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">DISCOUNTS SUMMARY</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 discountSummaryContent+
					                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(effective_sum).toFixed(2)+'</b></td></tr>'+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
				}

				renderTopSelling();				
			}


			/* TOP SELLING ITEMS */
			function renderTopSelling(){

				var topSellingContent = '';
				for(var i = 0; i < detailedTopItemsData.length; i++){
					topSellingContent +='<tr>'+
											'<td><svg version="1.1" id="Capa_1" x="0px" y="0px" width="15px" height="15px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve"> <path style="fill:#FFDC64;" d="M499.92,188.26l-165.839-15.381L268.205,19.91c-4.612-10.711-19.799-10.711-24.411,0l-65.875,152.97 L12.08,188.26c-11.612,1.077-16.305,15.52-7.544,23.216l125.126,109.922L93.044,483.874c-2.564,11.376,9.722,20.302,19.749,14.348 L256,413.188l143.207,85.034c10.027,5.954,22.314-2.972,19.75-14.348l-36.619-162.476l125.126-109.922 C516.225,203.78,511.532,189.337,499.92,188.26z"/> <path style="fill:#FFC850;" d="M268.205,19.91c-4.612-10.711-19.799-10.711-24.411,0l-65.875,152.97L12.08,188.26 c-11.612,1.077-16.305,15.52-7.544,23.216l125.126,109.922L93.044,483.874c-2.564,11.376,9.722,20.302,19.749,14.348l31.963-18.979 c4.424-182.101,89.034-310.338,156.022-383.697L268.205,19.91z"/> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></td>'+
											'<td class="tableQuickBrief">'+detailedTopItemsData[i].name+(detailedTopItemsData[i].category != "MANUAL_UNKNOWN" && detailedTopItemsData[i].category != "UNKNOWN" ? '<span style="margin-left: 10px; color: #5a5757; font-size:12px; font-style: italic">'+detailedTopItemsData[i].category+'</span>' : '')+'</td> <td class="tableQuickAmount"><b>'+detailedTopItemsData[i].count+'</b></td>'+
										'</tr>';
				}

				if(topSellingContent != ''){
					topSellingTemplate = ''+
						'<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">TOP SELLING ITEMS</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 topSellingContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
				}

				renderCategoryWiseSales();

			}



			/* CATEGORY WISE ITEM SALES */
			function renderCategoryWiseSales(){

				detailedItemCategoryWiseData.sort(function(category1, category2) { //sort by sales
					if (category1.totalSales > category2.totalSales)
    					return -1;
					if (category1.totalSales < category2.totalSales)
    					return 1;
  
  					return 0;
			    });

				var categoryWiseSalesSummaryContent = '';

				var halfCount = 0;
				var leftHalfContent = '';
				var rightHalfContent = '';

				var maxRows = Math.ceil(detailedItemCategoryWiseData.length/2); 
				if(maxRows > 25){ //Max is 25
					maxRows = 25;
				}

				var isFirstIteration = true;

				for(var g = 0; g < detailedItemCategoryWiseData.length; g++){

					halfCount++;

					if(halfCount <= maxRows){
						leftHalfContent +='<tr><td class="tableQuickBrief" style="font-size: 13px">'+detailedItemCategoryWiseData[g].category+'</td><td class="tableQuickBrief" style="color: #5a5757; text-align: center; font-size:12px">'+detailedItemCategoryWiseData[g].totalCount+'</td><td class="tableQuickAmount" style="font-size: 13px"><span class="price">Rs.</span>'+detailedItemCategoryWiseData[g].totalSales+'</td></tr>';
					}
					else if(halfCount >= maxRows+1 && halfCount <= 2*maxRows){
						rightHalfContent +='<tr><td class="tableQuickBrief" style="font-size: 13px">'+detailedItemCategoryWiseData[g].category+'</td><td class="tableQuickBrief" style="color: #5a5757; text-align: center; font-size:12px">'+detailedItemCategoryWiseData[g].totalCount+'</td><td class="tableQuickAmount" style="font-size: 13px"><span class="price">Rs.</span>'+detailedItemCategoryWiseData[g].totalSales+'</td></tr>';
					}
					else{
						//Time to render and reset the counter
						halfCount = 0; 
						g--;

						categoryWiseSalesSummaryContent += (isFirstIteration ? '' : '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>')+
							'<div style="position: relative; margin-top: 5px">'+
								'<div style="width: 48%; display: block; float: left;">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Category</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Units Sold</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales Volume</td>'+
						                 leftHalfContent+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						        '<div style="width: 48%; float: right; display:block">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Category</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Units Sold</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales Volume</td>'+
						                 rightHalfContent+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						    '</div>';

						//reset template
	    				leftHalfContent = '';
						rightHalfContent = '';

						isFirstIteration = false;
					}
				}

				//Render the remaining content
				if(rightHalfContent != ''){
					categoryWiseSalesSummaryContent += (isFirstIteration ? '' : '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>')+
							'<div style="position: relative; margin-top: 5px">'+
								'<div style="width: 48%; display: block; float: left;">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Category</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Units Sold</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales Volume</td>'+
						                 leftHalfContent+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						        '<div style="width: 48%; float: right; display:block">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Category</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Units Sold</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales Volume</td>'+
						                 rightHalfContent+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						    '</div>';	
				}
				else if(leftHalfContent != '' && rightHalfContent == ''){
					categoryWiseSalesSummaryContent += (isFirstIteration ? '' : '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>')+
							'<div style="position: relative; margin-top: 5px">'+
								'<div style="width: 48%; display: block; float: left;">'+
						           '<div class="tableQuick">'+
						              '<table style="width: 100%">'+
						                 '<col style="width: 70%">'+
						                 '<col style="width: 30%">'+
						                 '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Category</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Units Sold</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Sales Volume</td>'+
						                 leftHalfContent+
						              '</table>'+
						           '</div>'+
						        '</div>'+
						    '</div>';	
				}


				if(detailedItemCategoryWiseData.length > 0){
					categoryWiseSalesSummaryTemplate = ''+	
							'<div class="summaryTableSectionHolder">'+
						        '<div class="summaryTableSection">'+
						           '<div class="tableQuickHeader">'+
						              '<h1 class="tableQuickHeaderText">CATEGORY WISE SALES</h1>'+
						           '</div>'+
						           categoryWiseSalesSummaryContent+
						        '</div>'+
						    '</div>';	
				}

				renderCrispSummary(detailedItemCategoryWiseData);

				function renderCrispSummary(myData){
					
					var data = myData;

					var reduced_data = data.reduce(function (accumulator, item) {
						if(accumulator[item.topCategory]){
							accumulator[item.topCategory].totalSales += item.totalSales;
							accumulator[item.topCategory].totalCount += item.totalCount;
						}
						else{
							accumulator[item.topCategory] = item;
						}

					  	return accumulator;
					}, {});



					var shortListedData = [];
					for(var key in reduced_data){
						shortListedData.push({
							"topCategory": reduced_data[key].topCategory,
							"totalSales": reduced_data[key].totalSales,
							"totalCount": reduced_data[key].totalCount
						});
					}

					shortListedData.sort(function(category1, category2) { //sort by sales
						if (category1.totalSales > category2.totalSales)
	    					return -1;
						if (category1.totalSales < category2.totalSales)
	    					return 1;
	  
	  					return 0;
				    });

				    var crispSummaryContent = '';
					for(var i = 0; i < shortListedData.length; i++){
						crispSummaryContent += '<tr><td class="tableQuickBrief"><b>'+(shortListedData[i].topCategory).toUpperCase()+'</b> Category</td> <td class="tableQuickBrief" style="color: #5a5757; font-style: italic">'+shortListedData[i].totalCount + ' units sold</td> <td class="tableQuickAmount"><span class="price">Rs.</span>'+shortListedData[i].totalSales+'</td></tr>'; 
					}


					if(crispSummaryContent != ''){
							categoryWiseSalesSummaryTemplate = '' +
								'<div class="summaryTableSectionHolder">'+
							        '<div class="summaryTableSection">'+
							           '<div class="tableQuickHeader">'+
							              '<h1 class="tableQuickHeaderText">MENU SUMMARY</h1>'+
							           '</div>'+
							           '<div class="tableQuick">'+
							              '<table style="width: 100%">'+
							                 crispSummaryContent+
							              '</table>'+
							           '</div>'+
							        '</div>'+
						        '</div>'+
						        (maxRows <= 12 ? '' : '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>')+ //break the page
						        categoryWiseSalesSummaryTemplate;
					}

				}

				renderCancellationSummary();
			}





			/* CANCELLATION SUMMARY */
			function renderCancellationSummary(){
				
				//Cancelled Items
				var cancelledItemsSummaryContent = '';

				for(var n = 0; n < cancellationsData_items.length; n++){

							var cancelledData = cancellationsData_items[n].value;

							for(var i = 0; i < cancelledData.itemsRemoved.length; i++){
								
								cancelledItemsSummaryContent += ''+
										'<tr>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-size: 12px">'+moment(cancelledData.time, 'hhmm').format('hh:mm A')+'</tag>'+
												'<tag style="color: #5a5757; font-size: 10px; display: block">'+cancelledData.date+'</tag>'+
											'</td>'+
											'<td class="tableQuickBrief" style="font-weight: bold; color: #6f6f6f; text-align: right">'+cancelledData.itemsRemoved[i].qty+' <tag style="font-weight: 300;">x</tag></td>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-weight: 600; color: #6f6f6f; font-size: 14px">'+cancelledData.itemsRemoved[i].name+(cancelledData.itemsRemoved[i].isCustom ? ' <tag style="font-weight: 300; font-size: 80%">('+cancelledData.itemsRemoved[i].variant+')</tag>' : '')+'</tag>'+
												'<tag style="display: block; font-style: italic; color: #f39c12; font-size: 11px;">'+cancelledData.itemsRemoved[i].comments+'</tag>'+
											'</td>'+
											'<td class="tableQuickBrief" style="font-size: 14px">'+(cancelledData.modeType == 'DINE' ? 'Table #'+cancelledData.table : cancelledData.mode)+'</td>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-size: 14px">by '+cancelledData.stewardName+'</tag>'+
												'<tag style="display: block; font-size: 11px; color: #5a5757;">'+cancelledData.adminName+' approved</tag>'+
											'</td>'+
										'</tr>';
							}

				}

				if(cancelledItemsSummaryContent != ''){
					cancelledItemsSummaryTemplate = ''+
						'<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">ITEM CANCELLATIONS</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 cancelledItemsSummaryContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
				}



				//Cancelled Orders
				var cancelledOrdersSummaryContent = '';
				for(var i = 0; i < cancellationsData_orders.length; i++){

					var cancelledData = cancellationsData_orders[i].value;
					
					var number_of_items = 0;
					var order_value = 0;
					for(var a = 0; a < cancelledData.cart.length; a++){
						number_of_items += cancelledData.cart[a].qty;
						order_value += cancelledData.cart[a].qty * cancelledData.cart[a].price;
					}

					cancelledOrdersSummaryContent += ''+
										'<tr>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-size: 12px">'+moment(cancelledData.cancelDetails.timeCancel, 'hhmm').format('hh:mm A')+'</tag>'+
												'<tag style="color: #5a5757; font-size: 10px; display: block">'+cancelledData.date+'</tag>'+
											'</td>'+
											'<td class="tableQuickBrief" style="font-weight: bold; font-size: 12px"><span class="price" style="font-weight: 300; font-size: 80%">Rs.</span>'+order_value+'<tag style="font-weight: 300; color: #5a5757; display: block; font-size: 11px">'+(number_of_items > 1 ? number_of_items +' Items' : number_of_items+' Item')+'</tag></td>'+
											'<td class="tableQuickBrief">'+
												'<tag style="color: #5a5757; font-size: 13px">'+cancelledData.cancelDetails.reason+'</tag>'+
												'<tag style="display: block; font-style: italic; color: #f39c12; font-size: 11px;">'+cancelledData.cancelDetails.comments+'</tag>'+
											'</td>'+
											'<td class="tableQuickBrief" style="font-size: 14px">'+(cancelledData.orderDetails.modeType == 'DINE' ? 'Table #'+cancelledData.table : cancelledData.orderDetails.mode)+'</td>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-size: 14px">by '+(cancelledData.stewardName != '' ? cancelledData.stewardName : 'Unknown')+'</tag>'+
												'<tag style="display: block; font-size: 11px; color: #5a5757;">'+cancelledData.cancelDetails.cancelledBy+' approved</tag>'+
											'</td>'+
										'</tr>';
				}


				if(cancelledOrdersSummaryContent != ''){
					cancelledOrdersSummaryTemplate = ''+
						'<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">ORDER CANCELLATIONS</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 cancelledOrdersSummaryContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
				}


				//Cancelled Invoices
				var cancelledInvoicesSummaryContent = '';
				for(var i = 0; i < cancellationsData_invoices.length; i++){

					var cancelledData = cancellationsData_invoices[i].value;
					
					var number_of_items = 0;
					for(var a = 0; a < cancelledData.cart.length; a++){
						number_of_items += cancelledData.cart[a].qty;
					}

					cancelledInvoicesSummaryContent += ''+
										'<tr>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-size: 12px">'+moment(cancelledData.cancelDetails.timeCancel, 'hhmm').format('hh:mm A')+'</tag>'+
												'<tag style="color: #5a5757; font-size: 10px; display: block">'+cancelledData.date+'</tag>'+
											'</td>'+
											'<td class="tableQuickBrief" style="font-size: 14px">Bill #'+cancelledData.billNumber+'<tag style="display: block; font-size: 11px; color: #5a5757;">'+cancelledData.orderDetails.mode+'</tag></td>'+
											'<td class="tableQuickBrief" style="font-weight: bold; font-size: 12px"><span class="price" style="font-weight: 300; font-size: 80%">Rs. </span>'+cancelledData.payableAmount+'<tag style="font-weight: 300; display: block; font-size: 11px; color: #5a5757">'+(number_of_items > 1 ? number_of_items +' Items' : number_of_items+' Item')+'</tag></td>'+
											'<td class="tableQuickBrief">'+
												'<tag style="color: #5a5757; font-size: 13px">'+cancelledData.cancelDetails.reason+'</tag>'+
												'<tag style="display: block; font-style: italic; color: #f39c12; font-size: 11px;">'+cancelledData.cancelDetails.comments+'</tag>'+
											'</td>'+
											'<td class="tableQuickBrief">'+
												'<tag style="font-size: 14px">by '+(cancelledData.stewardName != '' ? cancelledData.stewardName : 'Unknown')+'</tag>'+
												'<tag style="display: block; font-size: 11px; color: #5a5757;">'+cancelledData.cancelDetails.cancelledBy+' approved</tag>'+
											'</td>'+
										'</tr>';
				}


				if(cancelledInvoicesSummaryContent != ''){
					cancelledInvoicesSummaryTemplate = ''+
						'<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">INVOICE CANCELLATIONS</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 cancelledInvoicesSummaryContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
				}

				renderDaywiseSummary();
			}



			/* DAY BY DAY SALES SUMMARY */
			function renderDaywiseSummary(){
			
				var dayByDaySalesSummaryContent = '';
				var dayByDaySalesSummaryHeader = '';
				var dayByDaySalesSummaryOverflowContent = '';


			    for(var i = 0; i < dayByDaySalesData.length; i++){ //while(detailedListByPaymentMode[t]){

			    	var detailedExtrasContent = '';

			    	for(var e = 0; e < dayByDaySalesData[i].extras.length; e++){
			    	
			    		detailedExtrasContent += '<td class="tableQuickAmount" style="text-align: right; font-size: 14px;">'+parseFloat(dayByDaySalesData[i].extras[e].value).toFixed(2)+'</td>';
			    
				    	if(i == 0){
				    		dayByDaySalesSummaryHeader += '<td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">'+dayByDaySalesData[i].extras[e].name+'</td>';
				    	}
			    	}

			    	if(i < 15){
				    	dayByDaySalesSummaryContent	+= 	'<tr>'+
											    			'<td class="tableQuickBrief" style="font-size: 13px">'+dayByDaySalesData[i].date+'<span style="color: #5a5757; display: block; font-size:12px">'+dayByDaySalesData[i].day+'</span></td>'+
											    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: center; color: #5a5757;"><b>'+dayByDaySalesData[i].count+'</b></td>'+
											    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: right">'+parseFloat(dayByDaySalesData[i].grossSales).toFixed(0)+'</td>'+
											    			detailedExtrasContent +
											    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: right">'+parseFloat(dayByDaySalesData[i].grossRefund + dayByDaySalesData[i].discount).toFixed(0)+'</td>'+
											    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: right">'+parseFloat(dayByDaySalesData[i].netAmount - dayByDaySalesData[i].netRefund).toFixed(0)+'</td>'+
											    		'</tr>';
					}
					else{
						dayByDaySalesSummaryOverflowContent += 	'<tr>'+
													    			'<td class="tableQuickBrief" style="font-size: 13px">'+dayByDaySalesData[i].date+'<span style="color: #5a5757; display: block; font-size:12px">'+dayByDaySalesData[i].day+'</span></td>'+
													    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: center; color: #5a5757;"><b>'+dayByDaySalesData[i].count+'</b></td>'+
													    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: right">'+parseFloat(dayByDaySalesData[i].grossSales).toFixed(0)+'</td>'+
													    			detailedExtrasContent +
													    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: right">'+parseFloat(dayByDaySalesData[i].grossRefund + dayByDaySalesData[i].discount).toFixed(0)+'</td>'+
													    			'<td class="tableQuickAmount" style="font-size: 14px; text-align: right">'+parseFloat(dayByDaySalesData[i].netAmount - dayByDaySalesData[i].netRefund).toFixed(0)+'</td>'+
													    		'</tr>';
					}


			    }

			    if(dayByDaySalesSummaryContent != ''){
			    	dayByDaySalesSummaryHeader = '<tr> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14;">Date</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Bills</td> <td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Gross</td>' + dayByDaySalesSummaryHeader + '<td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Discounts/ Refunds</td><td class="tableQuickBrief" style="font-size: 14px; font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right">Net</td> </tr>';
			    
					dayByDaySalesSummaryTemplate = ''+
				        '<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">Day to Day Sales</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 '<col style="width: 70%">'+
					                 '<col style="width: 30%">'+
					                 dayByDaySalesSummaryHeader+
					                 dayByDaySalesSummaryContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	


			    }

			    if(dayByDaySalesSummaryOverflowContent != ''){
			    
					dayByDaySalesSummaryTemplate += '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>' +
				        '<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">Day to Day Sales</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 '<col style="width: 70%">'+
					                 '<col style="width: 30%">'+
					                 dayByDaySalesSummaryHeader+
					                 dayByDaySalesSummaryOverflowContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	


			    }


			    renderQuickSummary();
			}




		    


			/* QUICK SUMMARY */
			function renderQuickSummary(){
			    var effective_gross = netCartSum - completeReportInfo[1].value - completeReportInfo[5].value;
				quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[1].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[1].type == 'NEGATIVE' && completeReportInfo[1].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[1].value).toFixed(2)+'</td></tr>';
				quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[5].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[5].type == 'NEGATIVE' && completeReportInfo[5].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[5].value).toFixed(2)+'</td></tr>';
				quickSummaryRendererContent += '<tr><td class="tableQuickBrief"><b>Effective Gross</b></td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(effective_gross).toFixed(2)+'</td></tr>';

			    var a = 0;
			    while(reportInfoExtras[a]){
			      quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+reportInfoExtras[a].name+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(reportInfoExtras[a].value).toFixed(2)+'</td></tr>';
			      a++;
			    }

			    quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[2].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[2].type == 'NEGATIVE' && completeReportInfo[2].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[2].value).toFixed(2)+'</td></tr>';
			    quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[3].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[3].type == 'NEGATIVE' && completeReportInfo[3].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[3].value).toFixed(2)+'</td></tr>';
			    quickSummaryRendererContent += '<tr><td class="tableQuickBrief">'+completeReportInfo[4].name+'</td><td class="tableQuickAmount">'+(completeReportInfo[4].type == 'NEGATIVE' && completeReportInfo[4].value != 0 ? '- ' : '')+'<span class="price">Rs.</span>'+parseFloat(completeReportInfo[4].value).toFixed(2)+'</td></tr>';
			
			    renderBillingModes();
			}




			/* BY BILLING MODES */
			function renderBillingModes(){

				var salesByBillingModeRenderContent = '';

			    var c = 0;
			    var billSharePercentage = 0;
			    var individualNetBillingMode = 0;
			    while(detailedListByBillingMode[c]){
			      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
			      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
			      individualNetBillingMode += detailedListByBillingMode[c].value;
			      c++;
			    }


				//To display bills graph or not
				var hasBillsGraphAttached = false;
				if(window.localStorage.graphImageDataBills && window.localStorage.graphImageDataBills != '' && window.localStorage.graphImageDataBills != 'data:,'){
					hasBillsGraphAttached = true;
				}

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
						                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(individualNetBillingMode).toFixed(0)+'</b></td></tr>'+
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
					                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(individualNetBillingMode).toFixed(0)+'</b></td></tr>'+
					              '</table>'+
					           '</div>'+
					        '</div>'+
					        '</div>';				
					}
			    }


			    renderReducedBillingModes();
			}




		    /* SUMMARY BY BILLING MODES */
		    function renderReducedBillingModes(){

				var originalBillingModesList = detailedListByBillingMode;
				var extrasKeysMasterHashMap = [];
				var extrasKeysMasterList = [];
				var reducedBillingModesGrandTotal = 0;

				var reducedBillingModesList = originalBillingModesList.reduce(function (accumulator, item) {
						if(accumulator[item.type]){
							accumulator[item.type].detailedExtras = accumulator[item.type].detailedExtras.concat(item.detailedExtras);
							accumulator[item.type].value += item.value;
							accumulator[item.type].count += item.count;
						}
						else{
							accumulator[item.type] = item;
						}

					  	return accumulator;
				}, {});

				for(var key in reducedBillingModesList){
					var originalExtras = reducedBillingModesList[key].detailedExtras;
					var reducedExtras = originalExtras.reduce(function (accumulator, item) {
						if(accumulator[item.name]){
							accumulator[item.name].amount += item.amount;
						}
						else{
							accumulator[item.name] = item;

							if(!extrasKeysMasterHashMap[item.name]){
								extrasKeysMasterHashMap[item.name] = item.name;
							}
						}

					  	return accumulator;
					}, {});


					reducedBillingModesGrandTotal += reducedBillingModesList[key].value;
					reducedBillingModesList[key].detailedExtras = reducedExtras;
				}

				for(var key in extrasKeysMasterHashMap){
					extrasKeysMasterList.push(extrasKeysMasterHashMap[key]);
				}


				//Time to render
				var reducedBillingModesContentHeader = '';
				var reducedBillingModesContent = '';

				var isFirstIteration = true;
				var reducedBillSharePercentage = 0;
			    for(var key in reducedBillingModesList){

			    	var detailedExtrasContent = '';

			    	for(var e = 0; e < extrasKeysMasterList.length; e++){
			    		detailedExtrasContent += '<td class="tableQuickAmount" style="text-align: right; font-size: 14px;">'+parseFloat(reducedBillingModesList[key].detailedExtras[extrasKeysMasterList[e]].amount).toFixed(2)+'</td>';
				    	
				    	if(isFirstIteration){
				    		reducedBillingModesContentHeader += '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right; font-size: 14px;">'+extrasKeysMasterList[e]+'</td>';
				    	}
			    	}

			    	isFirstIteration = false;

			    	reducedBillSharePercentage = parseFloat((100*reducedBillingModesList[key].value)/reducedBillingModesGrandTotal).toFixed(0);
			    	reducedBillingModesContent += '' +
										    	'<tr>'+
										   			'<td class="tableQuickBrief">'+getFancyNameForBillingType(reducedBillingModesList[key].type) + (reducedBillSharePercentage > 0 ? ' <span style="color: #5a5757">('+reducedBillSharePercentage+'%)</span>' : '')+'</td>'+
										   			'<td class="tableQuickAmount" style="text-align: left; font-size: 14px; color: #5a5757">'+reducedBillingModesList[key].count+'</td>'+
										   			detailedExtrasContent +
										   			'<td class="tableQuickAmount" style="text-align: right; font-size: 14px;">'+parseFloat(reducedBillingModesList[key].value).toFixed(0)+'</td>'+
										   			'<td class="tableQuickAmount" style="text-align: center; font-size: 14px; color: #5a5757">'+(reducedBillingModesList[key].count > 0 ? parseFloat(reducedBillingModesList[key].value/reducedBillingModesList[key].count).toFixed(0) : '-' )+'</td>'+
										   		'</tr>';

			    }

			    function getFancyNameForBillingType(type){
			    	if(type == 'DELIVERY'){
			    		return 'Home Delivery';
			    	}
			    	else if(type == 'PARCEL'){
			    		return 'Takeaway';
			    	}
			    	else if(type == 'TOKEN'){
			    		return 'Token Based';
			    	}
			    	else if(type == 'DINE'){
			    		return 'Dine In';
			    	}
			    }

				reducedBillingModesContentHeader = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: left; font-size: 14px;">Main Type</td> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: left; font-size: 14px;">Bills</td>' + reducedBillingModesContentHeader + '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right; font-size: 14px;">Net</td> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center; font-size: 14px;">Avg.</td> </tr>';
				reducedBillingModesContent = reducedBillingModesContentHeader + reducedBillingModesContent;
			    
			    if(reducedBillingModesContent != ''){

			    	reducedBillingModesContentFinal = ''+
				        '<div class="summaryTableSectionHolder">'+
					        '<div class="summaryTableSection">'+
					           '<div class="tableQuickHeader">'+
					              '<h1 class="tableQuickHeaderText">DETAILED CHARGES</h1>'+
					           '</div>'+
					           '<div class="tableQuick">'+
					              '<table style="width: 100%">'+
					                 '<col style="width: 70%">'+
					                 '<col style="width: 30%">'+
					                 reducedBillingModesContent+
					              '</table>'+
					           '</div>'+
					        '</div>'+
				        '</div>';	
			    }

			    renderPaymentModes();

			}


		    /* BY PAYMENT MODES */
		    function renderPaymentModes(){

		    	var salesByPaymentTypeRenderContent = '';

			    var d = 0;
			    var paymentSharePercentage = 0;
			    var individualNetPaymentMode = 0;
			    while(detailedListByPaymentMode[d]){
			      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
			      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
			      individualNetPaymentMode += detailedListByPaymentMode[d].value;
			      d++;
			    }

			    //Detailed Payment (Extras and Custom Extras for each payment mode)
			    var detailedByExtrasForPaymentRenderContent = '';
			    var detailedExtrasContentHeader = '';

			    var individualColumnSum_Extras = [];
			    //initialise with 0's
			    for(var e = 0; e < detailedListByPaymentMode[0].detailedExtras.length; e++){
			    	individualColumnSum_Extras.push(0);
			    }


			    var individualColumnSum_Net = 0;
			    var individualColumnSum_Gross = 0;

			    var t = 0;
			    while(detailedListByPaymentMode[t]){

			    	var detailedExtrasContent = '';
			    	var netAmount = detailedListByPaymentMode[t].value;

			    	for(var e = 0; e < detailedListByPaymentMode[t].detailedExtras.length; e++){
			    	
			    		detailedExtrasContent += '<td class="tableQuickAmount" style="text-align: right; font-size: 14px;">'+parseFloat(detailedListByPaymentMode[t].detailedExtras[e].amount).toFixed(2)+'</td>';
			    	
			    		netAmount -= detailedListByPaymentMode[t].detailedExtras[e].amount;

			    		individualColumnSum_Extras[e] += detailedListByPaymentMode[t].detailedExtras[e].amount; //hold sum of all CGST for Cash, Card, PayTM etc.

				    	if(t == 0){
				    		detailedExtrasContentHeader += '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right; font-size: 14px;">'+detailedListByPaymentMode[t].detailedExtras[e].name+'</td>';
				    	}
			    	}

			    	individualColumnSum_Gross += detailedListByPaymentMode[t].value; //last column (gross)
			    	individualColumnSum_Net += netAmount; //first column (net)

			    	detailedByExtrasForPaymentRenderContent += '' +
										    		'<tr>'+
										    			'<td class="tableQuickBrief">'+detailedListByPaymentMode[t].name+'</td>'+
										    			'<td class="tableQuickAmount" style="text-align: right; font-size: 14px;">'+parseFloat(netAmount).toFixed(0)+'</td>'+
										    			detailedExtrasContent +
										    			'<td class="tableQuickAmount" style="text-align: right; font-size: 14px;">'+parseFloat(detailedListByPaymentMode[t].value).toFixed(0)+'</td>'+
										    		'</tr>';


			    	t++;
			    }

			    if(detailedListByPaymentMode.length != 0){

			    	var detailed_footer_content = '';
			    	for(var i = 0; i < individualColumnSum_Extras.length; i++){
			    		detailed_footer_content += '<td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14; text-align: right; font-size: 14px;">'+parseFloat(individualColumnSum_Extras[i]).toFixed(2)+'</td>';
			    	}

				    detailedExtrasContentHeader = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: left; font-size: 14px;">Payment Mode</td> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center; text-align: right; font-size: 14px;">Gross</td>' + detailedExtrasContentHeader + '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: right; font-size: 14px;">Net</td> </tr>';
				    var detailedExtrasContentFooter = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14;">Total</td> <td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14; text-align: right; font-size: 14px;">'+parseFloat(individualColumnSum_Net).toFixed(0)+'</td>' + detailed_footer_content + '<td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14; text-align: right; font-size: 14px;">'+parseFloat(individualColumnSum_Gross).toFixed(0)+'</td> </tr>';
				    
				    detailedByExtrasForPaymentRenderContent = detailedExtrasContentHeader + detailedByExtrasForPaymentRenderContent + detailedExtrasContentFooter;
			    }



				//To display payment graph or not
				var hasPaymentsGraphAttached = false;
				if(window.localStorage.graphImageDataPayments && window.localStorage.graphImageDataPayments != '' && window.localStorage.graphImageDataPayments != 'data:,'){
					hasPaymentsGraphAttached = true;
				}

			    
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
					                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(individualNetPaymentMode).toFixed(0)+'</b></td></tr>'+
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
				                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(individualNetPaymentMode).toFixed(0)+'</b></td></tr>'+
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

				    salesByPaymentTypeRenderContentFinal += detailedByExtrasForPaymentRenderContentFinal;
			    }


			    renderCancellations();
			}


		    
			

			function renderCancellations(){

				var cancellationBriefContent = '';
				for(var i = 0; i < invoiceCancellationsData.length; i++){
					if(invoiceCancellationsData[i].amount > 0){
						cancellationBriefContent += '<tr><td class="tableQuickBrief">'+invoiceCancellationsData[i].mode+'</td><td class="tableQuickAmount"><span style="font-size: 11px; padding-right: 5px; color: #5a5757">from '+invoiceCancellationsData[i].count+' Bills</span><span class="price">Rs.</span>'+invoiceCancellationsData[i].amount+'</td></tr>';
					}
				}


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
				                 cancellationBriefContent+
				                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid">Cancelled before Settlement</td><td class="tableQuickAmount" style="border-top: 2px solid"><span style="font-size: 11px; padding-right: 5px; color: #5a5757">'+(invoiceCancellationsMetaData.total_unpaid_count > 0 ? 'from '+invoiceCancellationsMetaData.total_unpaid_count+' Bills' : 'No Bills')+'</span><span class="price">Rs.</span>'+parseFloat(invoiceCancellationsMetaData.total_unpaid_sum).toFixed(0)+'</td></tr>'+
				                 '<tr><td class="tableQuickBrief">Cancelled after Settlement</td><td class="tableQuickAmount"><span style="font-size: 11px; padding-right: 5px; color: #5a5757">'+(invoiceCancellationsMetaData.total_paid_count > 0 ? 'from '+invoiceCancellationsMetaData.total_paid_count+' Bills' : 'No Bills')+'</span><span class="price">Rs.</span>'+parseFloat(invoiceCancellationsMetaData.total_paid_sum).toFixed(0)+'</td></tr>'+
				                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Overall Cancellations</td><td class="tableQuickAmount" style="background: #f3eced; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span style="font-size: 11px; padding-right: 5px; color: #5a5757">'+(invoiceCancellationsMetaData.grand_count > 0 ? 'from '+invoiceCancellationsMetaData.grand_count+' Bills' : 'No Bills')+'</span><span class="price">Rs.</span>'+parseFloat(invoiceCancellationsMetaData.grand_sum).toFixed(0)+'</td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';		    	
				}

				finalRender();
			} 


			function finalRender(){

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
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value - grossRefundsProcessed).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Amount</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netCartSum).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+netGuestsCount+'</h1><p class="factsBoxBrief">Guests</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+completeReportInfo[0].count+'</h1><p class="factsBoxBrief">Bills</p></div>'+
				         '</div>'+
				      '</div>'+
				      '<div class="summaryTableSectionHolder">'+
				        '<div class="summaryTableSection">'+
				           '<div class="tableQuickHeader">'+
				              '<h1 class="tableQuickHeaderText">Quick Summary</h1>'+
				           '</div>'+
				           '<div class="tableQuick">'+
				              '<table style="width: 100%">'+
				                 '<col style="width: 70%">'+
				                 '<col style="width: 30%">'+
				                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Gross Sales</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netCartSum).toFixed(2)+'</td></tr>'+
				                 quickSummaryRendererContent+
				                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Net Amount</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value - grossRefundsProcessed).toFixed(2)+'</td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				      '</div>'+
				      (weeklyTrendRenderContent != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ weeklyTrendRenderContent : '')+
				      (salesByBillingModeRenderContentFinal != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ salesByBillingModeRenderContentFinal : '')+
					  (reducedBillingModesContentFinal != '' ? reducedBillingModesContentFinal : '')+
				      (salesByPaymentTypeRenderContentFinal != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ salesByPaymentTypeRenderContentFinal : '')+
				      (discountSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ discountSummaryTemplate : '')+
				      (downloadSummaryCancellations != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ downloadSummaryCancellations : '')+
				      (hourlySalesSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ hourlySalesSummaryTemplate : '')+
				      (sessionSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+sessionSummaryTemplate : '')+
				      (dayByDaySalesSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ dayByDaySalesSummaryTemplate : '')+
				      (topSellingTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ topSellingTemplate : '')+
				   	  (cancelledItemsSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ cancelledItemsSummaryTemplate : '')+
					  (cancelledOrdersSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ cancelledOrdersSummaryTemplate : '')+					    
				      (cancelledInvoicesSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ cancelledInvoicesSummaryTemplate : '')+					    
				      (categoryWiseSalesSummaryTemplate != '' ? '<div style="page-break-before: always; margin-top: 20px"></div><div style="height: 30px; width: 100%; display: block"></div>'+ categoryWiseSalesSummaryTemplate : '')+
				    '</body>';

					var finalContent_EncodedDownload = encodeURI(finalReport_downloadContent);
					$('#reportActionButtonDownload').attr('data-hold', finalContent_EncodedDownload);

					var finalContent_EncodedText = encodeURI(fancy_report_title_name);
					$('#reportActionButtonDownload').attr('text-hold', finalContent_EncodedText);

					generateReportContentEmail();
			}
		}

		function generateReportContentEmail(){

				runReportAnimation(98);

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
			    var individualNetBillingMode = 0;
			    while(detailedListByBillingMode[c]){
			      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
			      salesByBillingModeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #5a5757">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
			      individualNetBillingMode += detailedListByBillingMode[c].value;
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
					                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(individualNetBillingMode).toFixed(0)+'</b></td></tr>'+
					              '</table>'+
					           '</div>'+
					        '</div>'+
					        '</div>';
			    }


			    //Sales by Payment Types Content
			    var salesByPaymentTypeRenderContent = '';
			    var d = 0;
			    var paymentSharePercentage = 0;
			    var individualNetPaymentMode = 0;
			    while(detailedListByPaymentMode[d]){
			      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
			      salesByPaymentTypeRenderContent += '<tr><td class="tableQuickBrief">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #5a5757">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span class="smallOrderCount" style="color: #5a5757; font-weight: 300; font-style: italic">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td class="tableQuickAmount"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>';
			      individualNetPaymentMode += detailedListByPaymentMode[d].value;
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
				                 '<tr><td class="tableQuickBrief" style="border-top: 2px solid;"><b>Total</b></td><td class="tableQuickAmount" style="border-top: 2px solid;"><span class="price">Rs.</span><b>'+parseFloat(individualNetPaymentMode).toFixed(0)+'</b></td></tr>'+
				              '</table>'+
				           '</div>'+
				        '</div>'+
				        '</div>';
			    }


			    //Detailed Payment (Extras and Custom Extras for each payment mode)
			    var detailedByExtrasForPaymentRenderContent = '';
			    var detailedExtrasContentHeader = '';
			    

			    var individualColumnSum_Extras = [];
			    //initialise with 0's
			    for(var e = 0; e < detailedListByPaymentMode[0].detailedExtras.length; e++){
			    	individualColumnSum_Extras.push(0);
			    }


			    var individualColumnSum_Net = 0;
			    var individualColumnSum_Gross = 0;


			    var t = 0;
			    while(detailedListByPaymentMode[t]){

			    	var detailedExtrasContent = '';
			    	var netAmount = detailedListByPaymentMode[t].value;

			    	for(var e = 0; e < detailedListByPaymentMode[t].detailedExtras.length; e++){
			    	
			    		detailedExtrasContent += '<td class="tableQuickAmount" style="text-align: center;">'+detailedListByPaymentMode[t].detailedExtras[e].amount+'</td>';
			    	
			    		netAmount -= detailedListByPaymentMode[t].detailedExtras[e].amount;

			    		individualColumnSum_Extras[e] += detailedListByPaymentMode[t].detailedExtras[e].amount; //hold sum of all CGST for Cash, Card, PayTM etc.

				    	if(t == 0){
				    		detailedExtrasContentHeader += '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">'+detailedListByPaymentMode[t].detailedExtras[e].name+'</td>';
				    	}
			    	}

			    	individualColumnSum_Gross += detailedListByPaymentMode[t].value; //last column (gross)
			    	individualColumnSum_Net += netAmount; //first column (net)

			    	detailedByExtrasForPaymentRenderContent += '' +
										    		'<tr>'+
										    			'<td class="tableQuickBrief">'+detailedListByPaymentMode[t].name+'</td>'+
										    			'<td class="tableQuickAmount" style="text-align: center"><span class="price">Rs.</span>'+parseFloat(netAmount).toFixed(0)+'</td>'+
										    			detailedExtrasContent +
										    			'<td class="tableQuickAmount" style="text-align: center"><span class="price">Rs.</span>'+parseFloat(detailedListByPaymentMode[t].value).toFixed(0)+'</td>'+
										    		'</tr>';


			    	t++;
			    }


			    if(detailedListByPaymentMode.length != 0){

			    	var detailed_footer_content = '';
			    	for(var i = 0; i < individualColumnSum_Extras.length; i++){
			    		detailed_footer_content += '<td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14; text-align: center">'+parseFloat(individualColumnSum_Extras[i]).toFixed(2)+'</td>';
			    	}

				    detailedExtrasContentHeader = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14;">Mode</td> <td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Gross</td>' + detailedExtrasContentHeader + '<td class="tableQuickBrief" style="font-weight: bold; border-bottom: 2px solid #a71a14; text-align: center">Net</td> </tr>';
				    var detailedExtrasContentFooter = '<tr> <td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14;">Total</td> <td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14; text-align: center"><span class="price">Rs.</span>'+parseFloat(individualColumnSum_Net).toFixed(0)+'</td>' + detailed_footer_content + '<td class="tableQuickBrief" style="font-weight: bold; border-top: 2px solid #a71a14; text-align: center"><span class="price">Rs.</span>'+parseFloat(individualColumnSum_Gross).toFixed(0)+'</td> </tr>';
				    
				    detailedByExtrasForPaymentRenderContent = detailedExtrasContentHeader + detailedByExtrasForPaymentRenderContent + detailedExtrasContentFooter;
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
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(completeReportInfo[0].value - grossRefundsProcessed).toFixed(0)+' <span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Net Amount</p></div>'+ 
				            '<div class="factsBox"><h1 class="factsBoxFigure">'+parseFloat(netCartSum).toFixed(0)+'<span class="factsPrice">INR</span></h1><p class="factsBoxBrief">Gross Sales</p></div>'+ 
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
				                 '<tr><td class="tableQuickBrief" style="font-weight: bold;">Gross Sales</td><td class="tableQuickAmount" style="font-weight: bold;"><span class="price">Rs.</span>'+parseFloat(netCartSum).toFixed(2)+'</td></tr>'+
				                 quickSummaryRendererContent+
				                 '<tr><td class="tableQuickBrief" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e">Net Amount</td><td class="tableQuickAmount" style="background: #f3eced; font-size: 120%; font-weight: bold; color: #292727; border-bottom: 2px solid #b03c3e"><span class="price">Rs.</span>'+parseFloat(completeReportInfo[0].value - grossRefundsProcessed).toFixed(2)+'</td></tr>'+
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

		    /*
				0 - Net Amount (Total Paid Amount)
				1 - Discounts
				2 - Calculated Round Off
				3 - Waive Off
				4 - Tips
				5 - Refund Issued/Item Cancellations
		    */

		    var effective_gross = netCartSum - completeReportInfo[1].value - completeReportInfo[5].value;
			quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+completeReportInfo[1].name+'</td><td style="font-size: 11px; text-align: right">'+(completeReportInfo[1].type == 'NEGATIVE' && completeReportInfo[1].value != 0 ? '- ' : '')+'<span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[1].value).toFixed(2)+'</td></tr>';
			quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+completeReportInfo[5].name+'</td><td style="font-size: 11px; text-align: right">'+(completeReportInfo[5].type == 'NEGATIVE' && completeReportInfo[5].value != 0 ? '- ' : '')+'<span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[5].value).toFixed(2)+'</td></tr>';
			quickSummaryRendererContent += '<tr><td style="font-size: 11px; border-bottom: 1px solid;"><b>Effective Gross</b></td><td style="font-size: 11px; border-bottom: 1px solid; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(effective_gross).toFixed(2)+'</td></tr>';

		    var a = 0;
		    while(reportInfoExtras[a]){
		      quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+reportInfoExtras[a].name+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(reportInfoExtras[a].value).toFixed(2)+'</td></tr>';
		      a++;
		    }

		    quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+completeReportInfo[2].name+'</td><td style="font-size: 11px; text-align: right">'+(completeReportInfo[2].type == 'NEGATIVE' && completeReportInfo[2].value != 0 ? '- ' : '')+'<span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[2].value).toFixed(2)+'</td></tr>';
		    quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+completeReportInfo[3].name+'</td><td style="font-size: 11px; text-align: right">'+(completeReportInfo[3].type == 'NEGATIVE' && completeReportInfo[3].value != 0 ? '- ' : '')+'<span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[3].value).toFixed(2)+'</td></tr>';
		    quickSummaryRendererContent += '<tr><td style="font-size: 11px">'+completeReportInfo[4].name+'</td><td style="font-size: 11px; text-align: right">'+(completeReportInfo[4].type == 'NEGATIVE' && completeReportInfo[4].value != 0 ? '- ' : '')+'<span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[4].value).toFixed(2)+'</td></tr>';



		    var printSummaryAll = ''+
		    	'<div class="KOTContent">'+
		    		 '<h2 style="text-align: center; margin: 5px 0 3px 0; font-weight: bold; border-bottom: 1px solid #444;">OVERALL SUMMARY</h2>'+
			         '<table style="width: 100%">'+
			            '<col style="width: 85%">'+
			            '<col style="width: 15%">'+ 
			            '<tr><td style="font-size: 11px"><b>Gross Sales</b></td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(netCartSum).toFixed(2)+'</td></tr>'+
			            quickSummaryRendererContent+
			            '<tr><td style="font-size: 13px"><b>Net Amount</b></td><td style="font-size: 13px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(completeReportInfo[0].value - grossRefundsProcessed).toFixed(2)+'</td></tr>'+
			         '</table>'+
			    '</div>';

		    //Sales by Billing Modes Content
		    var printSummaryBillsContent = '';
		    var c = 0;
		    var billSharePercentage = 0;
		    var billShareGrandTotal = 0;
		    while(detailedListByBillingMode[c]){
		      billShareGrandTotal += detailedListByBillingMode[c].value;

		      billSharePercentage = parseFloat((100*detailedListByBillingMode[c].value)/completeReportInfo[0].value).toFixed(0);
		      printSummaryBillsContent += '<tr><td style="font-size: 11px">'+detailedListByBillingMode[c].name+' '+(billSharePercentage > 0 ? '<span style="color: #000">('+billSharePercentage+'%)</span>' : '')+(detailedListByBillingMode[c].count > 0 ? '<span style="font-weight:bold; font-size: 60%; display: block;">'+detailedListByBillingMode[c].count+' orders</span>' : '')+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(detailedListByBillingMode[c].value).toFixed(0)+'</td></tr>';
		      c++;
		    }

		    


		    var printSummaryBills = '';
		    if(printSummaryBillsContent != ''){

		    	printSummaryBillsContent += '<tr><td style="font-size: 12px; font-weight: bold;">Total</td><td style="font-size: 12px; text-align: right;"><span style="font-size: 60%">Rs.</span>'+parseFloat(billShareGrandTotal).toFixed(0)+'</td></tr>';
		      
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
		    var paymentShareGrandTotal = 0;
		    while(detailedListByPaymentMode[d]){
		      paymentShareGrandTotal += detailedListByPaymentMode[d].value;

		      paymentSharePercentage = parseFloat((100*detailedListByPaymentMode[d].value)/completeReportInfo[0].value).toFixed(0);
		      printSummaryPaymentContent += '<tr><td style="font-size: 11px">'+detailedListByPaymentMode[d].name+' '+(paymentSharePercentage > 0 ? '<span style="color: #000">('+paymentSharePercentage+'%)</span>' : '')+(detailedListByPaymentMode[d].count > 0 ? '<span style="font-weight:bold; font-size: 60%; display: block;">'+detailedListByPaymentMode[d].count+' orders</span>' : '')+'</td><td style="font-size: 11px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(detailedListByPaymentMode[d].value).toFixed(0)+'</td></tr>'; 
		      d++;
		    }

		    var printSummaryPayment = '';
		    if(printSummaryPaymentContent != ''){

		    	printSummaryPaymentContent += '<tr><td style="font-size: 12px; font-weight: bold;">Total</td><td style="font-size: 12px; text-align: right"><span style="font-size: 60%">Rs.</span>'+parseFloat(paymentShareGrandTotal).toFixed(0)+'</td></tr>';

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


/*
	Step by Step Cost of Operations
	********************************

	Step 1: singleClickTotalPaid 1
	Step 2: singleClickNetAmount 1
	Step 3: singleClickTotalGuests 1
	Step 4: singleClickLastInvoiceNumbers 1
	Step 5: singleClickExtraCharges 2 x n(Extras) 
	Step 6: singleClickDiscountsOffered 1
	Step 7: singleClickCalculatedRoundOffs 1
	Step 8: singleClickWaiveOffsMade 1
	Step 9: singleClickTipsReceived 1
	Step 10: singleClickRefundsIssued 2
	Step 11: singleClickCancelledInvoices 1
	Step 12: singleClickDetailedSalesTrend 2 x (8 sets)
	Step 13: singleClickSessionWise 1 [with small reduce]
	Step 14: singleClickHourlyTrend 1 [with huge reduce]
	Step 15: singleClickDayByDaySales 5 fixed + 2 x n(Extras) ... for 27 days etc
	Step 16: singleClickMonthByMonthSales 5 fixed + 2 x n(Extras) ... for 4 months etc
	Step 17: singleClickDiscountDetails 1 + n(DiscountTypes)
	Step 18: singleClickTopSellingItems 1 [with huge reduce]
	Step 19: singleClickCancellationDetails 3 + 2 + n(BillModes)
	Step 20: singleClickDetailedByModes 2 x n(BillModes)
	Step 21: singleClickRenderBillsGraph 0
	Step 22: singleClickBillingModesSplitByExtras 2 x n(Extras)
	Step 23: singleClickDetailedByPayment 3 x n(PaymentModes)
	Step 24: singleClickRenderPaymentsGraph 0
	Step 25: singleClickPaymentModesSplitByExtras 4 x n(Extras)
	Step 26: singleClickWeeklyProgress 14
	Step 27: singleClickWeeklyWeeklyGraphRenderer 0
	Step 28: singleClickGenerateAllReports 0 [with huge data processing]
*/



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
