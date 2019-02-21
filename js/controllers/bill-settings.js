
function openNewBill(){
	document.getElementById("newBillArea").style.display = "block";
  $("#add_new_param_name").focus();
	document.getElementById("openNewBillButton").style.display = "none";
}

function hideNewBill(){
	
	document.getElementById("newBillArea").style.display = "none";
	document.getElementById("openNewBillButton").style.display = "block";
}


function addExtraToInput(name, value, id){

  document.getElementById("selectedBillingModeExtras").innerHTML += '<div id="bill_extra_'+(name.replace(/\s/g,''))+'" class="row" style="padding: 0 15px; margin-bottom: 5px;"> <p class="billModeLabel"><tag class="billModeNamed">'+name+'</tag><tag class="billModeDeleteIcon" onclick="removeBillModeExtra(\''+name+'\', \''+id+'\')"><i class="fa fa-minus"></i></tag></p>'+
                                              '<input type="number" id="bill_extra_in_'+(name.replace(/\s/g,''))+'" value="'+value+'" class="form-control tip billModeInput"/> </div>';
                                 
  $('#bill_extra_in_'+(name.replace(/\s/g,''))).focus();
  $('#bill_extra_in_'+(name.replace(/\s/g,''))).select();

  document.getElementById(id).style.display = "none";
}

function removeBillModeExtra(name, old_id){
  $("#bill_extra_"+(name.replace(/\s/g,''))).remove();
  document.getElementById(old_id).style.display = 'inline-block'; 
}


function openNewMode(){

    /*render extras list*/

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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

              var modes = data.docs[0].value;
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<tag class="extrasSelButton" onclick="addExtraToInput(\''+modes[i].name+'\', \''+modes[i].value+'\', \'extra_'+i+'\')" id="extra_'+i+'">'+modes[i].name+' ('+(modes[i].unit == 'FIXED'? 'Rs. '+modes[i].value : modes[i].value+'%')+')</tag>';
              }

              if(!modesTag){
                  document.getElementById("extrasList").innerHTML = '<i>*Please update <b style="cursor: pointer" onclick="openBillSettings(\'billingExtras\')">Taxes & Other Extras</b> first.</i>';
              }
              else{            
                  document.getElementById("extrasList").innerHTML = 'Choose from List: '+modesTag;
              }

              document.getElementById("newModeArea").style.display = "block";
              $("#add_new_mode_name").focus();
              document.getElementById("openNewModeButton").style.display = "none";

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

function hideNewMode(){
	
	document.getElementById("newModeArea").style.display = "none";
	document.getElementById("openNewModeButton").style.display = "block";
}

function openNewOrderSource(){

              //Preload Billing Modes data
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
                  console.log(data)
                  if(data.docs.length > 0){
                    if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_MODES'){

                        var modes = data.docs[0].value;

                        openNewOrderSourceAfterProcess(modes);

                    }
                    else{
                      openNewOrderSourceAfterProcess([]);
                    }
                  }
                  else{
                    openNewOrderSourceAfterProcess([]);
                  }
                  
                },
                error: function(data) {
                  openNewOrderSourceAfterProcess([]);
                }

              });


}

function openNewOrderSourceAfterProcess(billingModes){

  document.getElementById("newOrderSourceArea").style.display = "block";
  $("#add_new_source_name").focus();
  document.getElementById("openNewOrderSourceButton").style.display = "none";

  //Options to Choose for default delivery/takeaway
  if(billingModes.length > 0){
    
    var atleastOneFound_delivery = false;
    var atleastOneFound_takeaway = false;

    var defaultTemplate_delivery = '<option value="NONE" selected="selected">Not Set</option>';
    var defaultTemplate_takeaway = '<option value="NONE" selected="selected">Not Set</option>';
    
    var n = 0;
    while(billingModes[n]){
      if(billingModes[n].type == 'DELIVERY'){
        defaultTemplate_delivery += '<option value="'+billingModes[n].name+'">'+billingModes[n].name+'</option>';
        atleastOneFound_delivery = true;
      }
      else if(billingModes[n].type == 'PARCEL'){
        defaultTemplate_takeaway += '<option value="'+billingModes[n].name+'">'+billingModes[n].name+'</option>';
        atleastOneFound_takeaway = true;
      }
      
      n++;
    }  

    if(atleastOneFound_delivery){
      document.getElementById("add_new_source_default_delivery").innerHTML = defaultTemplate_delivery;
    }

    if(defaultTemplate_takeaway){
      document.getElementById("add_new_source_default_takeaway").innerHTML = defaultTemplate_takeaway;
    }
    
  }

}

function hideNewOrderSource(){
	
	document.getElementById("newOrderSourceArea").style.display = "none";
	document.getElementById("openNewOrderSourceButton").style.display = "block";

}



function openNewPaymentMode(){
  document.getElementById("newPaymentModeArea").style.display = "block";
  $("#add_new_payment_name").focus();
  document.getElementById("openNewPaymentModeButton").style.display = "none";
}

function hideNewPaymentMode(){
  
  document.getElementById("newPaymentModeArea").style.display = "none";
  document.getElementById("openNewPaymentModeButton").style.display = "block";

}



function openNewDiscountType(){
  document.getElementById("newDiscountTypeArea").style.display = "block";
  $("#add_new_discount_name").focus();
  document.getElementById("openNewDiscountButton").style.display = "none";
}

function hideNewDiscountType(){
  
  document.getElementById("newDiscountTypeArea").style.display = "none";
  document.getElementById("openNewDiscountButton").style.display = "block";

}



function openBillSettings(id){
	
	/*Tweak - Hide all */
	$( "#detailsDisplayBillSettings" ).children().css( "display", "none" );
	$( "#detailsNewBillSettings" ).children().css( "display", "none" );

	document.getElementById("openNewPaymentModeButton").style.display = "block";
	document.getElementById("openNewModeButton").style.display = "block";
	document.getElementById("openNewBillButton").style.display = "block";
  document.getElementById("openNewOrderSourceButton").style.display = "block";
  document.getElementById("openNewDiscountButton").style.display = "block";

	document.getElementById(id).style.display = "block";

	switch(id){
		case "billLayout":{
			renderBillLayout();
			break;
		}
    case "billingExtras":{
      fetchAllParams();
      break;
    }
		case "billingModes":{
			fetchAllModes();
			break;
		}
		case "paymentModes":{
			fetchAllPaymentModes();
			break;
		}	
    case "orderSources":{
      fetchAllOrderSources();
      break;
    } 	
    case "discountTypes":{
      fetchAllDiscountTypes();
      break;
    }
	}
}


function openSettingsDeleteConfirmation(type, functionName){
	document.getElementById("settingsDeleteConfirmationConsent").innerHTML = '<button class="btn btn-default" onclick="cancelSettingsDeleteConfirmation()" style="float: left">Cancel</button>'+
                  							'<button class="btn btn-danger" onclick="'+functionName+'(\''+type+'\')">Delete</button>';

	document.getElementById("settingsDeleteConfirmationText").innerHTML = 'Are you sure want to delete <b>'+type+'</b>?';
	document.getElementById("settingsDeleteConfirmation").style.display = 'block';
}

function cancelSettingsDeleteConfirmation(){
	document.getElementById("settingsDeleteConfirmation").style.display = 'none';
}



/* read billing params */
function fetchAllParams(){

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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

              var params = data.docs[0].value;
              params.sort(); //alphabetical sorting 
              var paramsTag = '';

              for (var i=0; i<params.length; i++){
                paramsTag = paramsTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+params[i].name+'</td> <td style="text-align: center">'+(params[i].unit == 'FIXED' ? '<i class="fa fa-inr"></i>'+params[i].value : params[i].value + '%' )+'</td> <td>'+params[i].unitName+'</td> <td style="text-align: center">'+(params[i].excludePackagedFoods? "No": "Yes")+'</td> <td onclick="deleteParameterConfirm(\''+params[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
              }

              if(!paramsTag)
                document.getElementById("billingParamsTable").innerHTML = '<p style="color: #bdc3c7">No parameters added yet.</p>';
              else
                document.getElementById("billingParamsTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Name</th> <th style="text-align: center; font-size: 80%; font-weight: 600;">Standard Value</th> <th style="text-align: center">Unit</th> <th style="text-align: center; font-size: 80%; font-weight: 600;">Applicable on Packaged Items</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+paramsTag+'</tbody>';

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


/* add new param */
function addParameter() {  

	var paramObj = {};
	paramObj.name = document.getElementById("add_new_param_name").value;
  paramObj.name = (paramObj.name).replace (/,/g, "");
	paramObj.excludePackagedFoods = document.getElementById("add_new_param_compulsary").value == 'YES'? true: false;
	paramObj.value = document.getElementById("add_new_param_value").value;
	var tempUnit = document.getElementById("add_new_param_unit").value;


	paramObj.value = parseFloat(paramObj.value);

	if(tempUnit == 'PERCENTAGE'){
		paramObj.unit = 'PERCENTAGE',
		paramObj.unitName = 'Percentage (%)';

	}
	else if(tempUnit == 'FIXED'){
		paramObj.unit = 'FIXED',
		paramObj.unitName = 'Fixed Amount (Rs)';
	}
	else{
		showToast('System Error: Something went wrong. Please contact Accelerate Support.', '#e74c3c');
		return '';
	}


	if(paramObj.name == ''){
		showToast('Warning: Please set a name.', '#e67e22');
		return '';
	}
	else if(paramObj.value == ''){
		showToast('Warning: Please set a value.', '#e67e22');
		return '';
	}
	else if(Number.isNaN(paramObj.value)){
		showToast('Warning: Invalid value.', '#e67e22');
		return '';
	}	


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

             var billingParamsList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<billingParamsList.length; i++) {
               if (billingParamsList[i].name == paramObj.name){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Billing Parameter already exists with same name.', '#e67e22');
             }
             else{

                billingParamsList.push(paramObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILLING_PARAMETERS",
                  "value": billingParamsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILLING_PARAMETERS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllParams(); //refresh the list
                      hideNewBill();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
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
        showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
}


function deleteParameterConfirm(name){
	openSettingsDeleteConfirmation(name, 'deleteParameter');
}


/* delete a param */
function deleteParameter(paramName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILLING_PARAMETERS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_PARAMETERS'){

               var billingParamsList = data.docs[0].value;

               for (var i=0; i<billingParamsList.length; i++) {  
                 if (billingParamsList[i].name == paramName){
                    billingParamsList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILLING_PARAMETERS",
                  "value": billingParamsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILLING_PARAMETERS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllParams();
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
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
        showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 

   cancelSettingsDeleteConfirmation()
}



/*Discount Types*/

function fetchAllDiscountTypes(){

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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_DISCOUNT_TYPES'){

              var modes = data.docs[0].value;
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+modes[i].name+'</td> <td>'+(modes[i].maxDiscountUnit == 'PERCENTAGE'? (modes[i].maxDiscountValue+'%'): ('<i class="fa fa-inr"></i>'+modes[i].maxDiscountValue))+'</td> <td onclick="deleteDiscountTypeConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
              }

              if(!modesTag)
                document.getElementById("discountTypesTable").innerHTML = '<p style="color: #bdc3c7">No discount types added yet.</p>';
              else
                document.getElementById("discountTypesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Type Name</th> <th style="text-align: left">Max Discount</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+modesTag+'</tbody>';

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




/* add new discount type */
function addDiscountType(optionalName, optionalUnit, optionalValue) {  

  var paramObj = {};

  if(!optionalName || optionalName == ''){
    paramObj.name = document.getElementById("add_new_discount_name").value;
  }
  else{
    paramObj.name = optionalName;
  }

  if(!optionalUnit || optionalUnit == ''){
    paramObj.maxDiscountUnit = document.getElementById("add_new_discount_unit").value;
  }
  else{
    paramObj.maxDiscountUnit = optionalUnit;
  }

  if(!optionalValue || optionalValue == ''){
    paramObj.maxDiscountValue = document.getElementById("add_new_discount_maxValue").value;
  }
  else{
    paramObj.maxDiscountValue = optionalValue;
  }


  paramObj.maxDiscountValue = parseFloat(paramObj.maxDiscountValue);

  if(paramObj.name == ''){
    showToast('Warning: Please set a name', '#e67e22');
    return '';
  }


  if((paramObj.name).toUpperCase() == 'COUPON' || (paramObj.name).toUpperCase() == 'VOUCHER' || (paramObj.name).toUpperCase() == 'NOCOSTBILL' || (paramObj.name).toUpperCase() == 'REWARDS' || (paramObj.name).toUpperCase() == 'ONLINE'){
    showToast('Warning: Reserved Keyword. Please set different a name', '#e67e22');
    return '';
  }



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_DISCOUNT_TYPES" 
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_DISCOUNT_TYPES'){

             var discountsList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<discountsList.length; i++) {
               if (discountsList[i].name == paramObj.name){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Discount Name already exists. Please set a different name.', '#e67e22');
             }
             else{

                discountsList.push(paramObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_DISCOUNT_TYPES",
                  "value": discountsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_DISCOUNT_TYPES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllDiscountTypes(); //refresh the list
                      hideNewDiscountType();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Discount Types data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
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


function deleteDiscountTypeConfirm(name){
  openSettingsDeleteConfirmation(name, 'deleteDiscountType');
}


/* delete a discount type */
function deleteDiscountType(discountName) {  


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_DISCOUNT_TYPES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_DISCOUNT_TYPES'){

               var discountsList = data.docs[0].value;

               var memory_value = '';
               var memory_unit = '';

               for (var i=0; i<discountsList.length; i++) {  
                 if (discountsList[i].name == discountName){
                    memory_value = discountsList[i].maxDiscountValue;
                    memory_unit = discountsList[i].maxDiscountUnit;
                    discountsList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_DISCOUNT_TYPES",
                  "value": discountsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_DISCOUNT_TYPES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllDiscountTypes();

                    showUndo('Deleted', 'addDiscountType(\''+discountName+'\', \''+memory_unit+'\', \''+memory_value+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Discount Types data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  
                
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

    cancelSettingsDeleteConfirmation()
}



/* read billing params */
function fetchAllModes(){


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
              fetchAllModesAfterProcess(params)

          }
          else{
            fetchAllModesAfterProcess([])
          }
        }
        else{
          fetchAllModesAfterProcess([])
        }
        
      },
      error: function(data) {
        fetchAllModesAfterProcess([])
      }

    });
}

function fetchAllModesAfterProcess(extrasInfo){
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_MODES'){

              var modes = data.docs[0].value;
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

              for (var i=0; i<modes.length; i++){

                var extras_list = '';
                for(var n=0; n < modes[i].extras.length; n++){

                  var k = 0;
                  var metaType = '';
                  while(extrasInfo[k]){
                    if(extrasInfo[k].name == modes[i].extras[n].name){
                      metaType = extrasInfo[k].unit;
                      break;
                    }
                    k++;
                  }

                  extras_list += modes[i].extras[n].name + ' <tag style="font-size: 80%; color: gray">('+(metaType == 'PERCENTAGE' ? modes[i].extras[n].value+'%' : (metaType == 'FIXED' ? '<i class="fa fa-inr"></i>'+modes[i].extras[n].value : modes[i].extras[n].value ) )+')</tag>';
                  if(n != modes[i].extras.length - 1){
                    extras_list += ', <br>';
                  }
                }

                modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td><p style="margin: 0">'+modes[i].name+'</p><p style="margin: 0; font-size: 65%; color: #f39c12;">'+modes[i].type+'</p></td> <td>'+extras_list+'</td> <td>'+(modes[i].isDiscountable?"Yes": "No")+'</td> <td>'+(modes[i].maxDiscount != 0? '<i class="fa fa-inr"></i>'+modes[i].maxDiscount :'-')+'</td> <td onclick="deleteModeConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
              }

              if(!modesTag){
                document.getElementById("billingModesTable").innerHTML = '<p style="color: #bdc3c7">No modes added yet.</p>';
              }else{
                document.getElementById("billingModesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Mode</th> <th style="text-align: left">Extras Collected</th> <th style="text-align: left">Discountable</th><th style="text-align: left">Max Discount</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+modesTag+'</tbody>';
              }

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


/* add new mode */
function addMode() {  

	var paramObj = {};
	paramObj.name = document.getElementById("add_new_mode_name").value;
	paramObj.isDiscountable = document.getElementById("add_new_mode_discountable").value == 'YES'? true: false;
	paramObj.type = document.getElementById("add_new_mode_type").value;
	paramObj.maxDiscount = document.getElementById("add_new_mode_maxDisc").value;
	paramObj.maxDiscount = parseFloat(paramObj.maxDiscount);


  var extrasObj = [];

  var extrasList = $('#selectedBillingModeExtras .row .billModeNamed');
  var k = 0;
  $("#selectedBillingModeExtras .row .billModeInput").each(function(){ 
    if($(this).val() > 0){
      extrasObj.push( {"name": extrasList.eq(k).html(), "value": parseFloat($(this).val()).toFixed(2)} )
    }
    k++;
  });
  
  paramObj.extras = extrasObj;

	if(paramObj.name == ''){
		showToast('Warning: Please set a name', '#e67e22');
		return '';
	}
	else if(Number.isNaN(paramObj.maxDiscount) && paramObj.isDiscountable){
		showToast('Warning: Invalid maximum discount amount', '#e67e22');
		return '';
	}	

	if(paramObj.isDiscountable && !paramObj.maxDiscount){
		showToast('Warning: Please set a non-zero maximum discount, as you have marked it Discountable', '#e67e22');
		return '';
	}	

	if(!paramObj.isDiscountable){
		paramObj.maxDiscount = "";
	}


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILLING_MODES" 
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_MODES'){

             var billingModesList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<billingModesList.length; i++) {
               if (billingModesList[i].name == paramObj.name){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Billing Mode already exists. Please set a different name.', '#e67e22');
             }
             else{

                billingModesList.push(paramObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILLING_MODES",
                  "value": billingModesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILLING_MODES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllModes(); //refresh the list
                      hideNewMode();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
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

function deleteModeConfirm(name){
	openSettingsDeleteConfirmation(name, 'deleteMode');
}

/* delete a param */
function deleteMode(modeName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILLING_MODES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILLING_MODES'){

               var billingModesList = data.docs[0].value;

               for (var i=0; i<billingModesList.length; i++) {  
                 if (billingModesList[i].name == modeName){
                    billingModesList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILLING_MODES",
                  "value": billingModesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILLING_MODES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllModes();
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
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

   cancelSettingsDeleteConfirmation()
}



/* read payment modes */
function fetchAllPaymentModes(){

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
                modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+modes[i].name+'</td> <td>'+modes[i].code+'</td> '+(modes[i].code == 'PREPAID' || modes[i].code == 'CASH' ? '<td> <i class="fa fa-lock" style="color: #90d899"></i> </td>' : '<td onclick="deletePaymentModeConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td>')+'</tr>';
              }

              if(!modesTag)
                document.getElementById("paymentModesTable").innerHTML = '<p style="color: #bdc3c7">No payment modes added yet.</p>';
              else
                document.getElementById("paymentModesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Payment Mode</th> <th style="text-align: left">Code</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+modesTag+'</tbody>';

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




/* add new payment mode */
function addPaymentMode(optionalName, optionalCode) {  

	var paramObj = {};

  if(!optionalName || optionalName == ''){
    paramObj.name = document.getElementById("add_new_payment_name").value;
  }
  else{
    paramObj.name = optionalName;
  }

  if(!optionalCode || optionalCode == ''){
    paramObj.code = document.getElementById("add_new_payment_code").value;
  }
  else{
    paramObj.code = optionalCode;
  }


	if(paramObj.name == ''){
		showToast('Warning: Please set a name', '#e67e22');
		return '';
	}
	else if(paramObj.code == ''){
		showToast('Warning: Please set a code', '#e67e22');
		return '';
	}

  if(paramObj.code == 'MULTIPLE'){
    showToast('Warning: Reserved Keyword. Please set different a code', '#e67e22');
    return '';
  }



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_PAYMENT_MODES" 
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_PAYMENT_MODES'){

             var paymentTypesList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<paymentTypesList.length; i++) {
               if (paymentTypesList[i].name == paramObj.name || paymentTypesList[i].code == paramObj.code){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Payment Mode already exists.', '#e67e22');
             }
             else{

                paymentTypesList.push(paramObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_PAYMENT_MODES",
                  "value": paymentTypesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_PAYMENT_MODES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllPaymentModes(); //refresh the list
                      hideNewPaymentMode();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
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


function deletePaymentModeConfirm(name){
	openSettingsDeleteConfirmation(name, 'deletePaymentMode');
}


/* delete a payment mode */
function deletePaymentMode(modeName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_PAYMENT_MODES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_PAYMENT_MODES'){

               var modesList = data.docs[0].value;

               var memory_code = '';

               for (var i=0; i<modesList.length; i++) {  
                 if (modesList[i].name == modeName){
                    memory_code = modesList[i].code;
                    modesList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_PAYMENT_MODES",
                  "value": modesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_PAYMENT_MODES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllPaymentModes();

                    showUndo('Deleted', 'addPaymentMode(\''+modeName+'\', \''+memory_code+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
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

    cancelSettingsDeleteConfirmation()
}



// ORDER SOURCES
function fetchAllOrderSources(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_ORDER_SOURCES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_ORDER_SOURCES'){

              var modes = data.docs[0].value;
              window.localStorage.addedOrderSourcesData = JSON.stringify(modes);

              var modesTag = '';
              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+modes[i].name+
                ((modes[i].defaultDelivery != '' && modes[i].defaultDelivery != 'NONE') ? '<tag style="display: block; font-size: 10px; color: gray">Default Delivery Mode: <tag style="color: #f39c12">'+modes[i].defaultDelivery+'</tag>' : '')+
                ((modes[i].defaultTakeaway != '' && modes[i].defaultTakeaway != 'NONE') ? '<tag style="display: block; font-size: 10px; color: gray">Default Takeaway Mode: <tag style="color: #f39c12">'+modes[i].defaultTakeaway+'</tag>' : '')+
                '</td> <td>'+modes[i].code+'</td> '+(modes[i].code == 'SYSTEM' || modes[i].code == 'ONLINE' ? '<td> <i class="fa fa-lock" style="color: #90d899"></i> </td>' : '<td onclick="deleteOrderSourceConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td>')+'</tr>';
              }

              if(!modesTag)
                document.getElementById("orderSourcesTable").innerHTML = '<p style="color: #bdc3c7">No Order Sources added yet.</p>';
              else
                document.getElementById("orderSourcesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Payment Mode</th> <th style="text-align: left">Code</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+modesTag+'</tbody>';

          }
          else{
            showToast('Not Found Error: Order Sources data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Order Sources data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Order Sources data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


/* add new payment mode */
function addOrderSource(optionalName, optionalCode, optionalDelivery, optionalTakeaway) {  

  var paramObj = {};

  if(!optionalName || optionalName == ''){
    paramObj.name = document.getElementById("add_new_source_name").value;
  }
  else{
    paramObj.name = optionalName;
  }

  if(!optionalCode || optionalCode == ''){
    paramObj.code = document.getElementById("add_new_source_code").value;
  }
  else{
    paramObj.code = optionalCode;
  }

  if(!optionalDelivery || optionalDelivery == ''){
    paramObj.defaultDelivery = $('#add_new_source_default_delivery').val();
  }
  else{
    paramObj.defaultDelivery = optionalDelivery;
  }

  if(!optionalTakeaway || optionalTakeaway == ''){
    paramObj.defaultTakeaway = $('#add_new_source_default_takeaway').val();
  }
  else{
    paramObj.defaultTakeaway = optionalTakeaway;
  }


  if(paramObj.name == ''){
    showToast('Warning: Please set a name', '#e67e22');
    return '';
  }
  else if(paramObj.code == ''){
    showToast('Warning: Please set a code', '#e67e22');
    return '';
  }

  
  

  // if(paramObj.code == ''){
  //   showToast('Warning: Reserved Keyword. Please set different a code', '#e67e22');
  //   return '';
  // }


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_ORDER_SOURCES" 
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_ORDER_SOURCES'){

             var orderSourcesList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<orderSourcesList.length; i++) {
               if (orderSourcesList[i].name == paramObj.name || orderSourcesList[i].code == paramObj.code){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Order Source already exists.', '#e67e22');
             }
             else{

                orderSourcesList.push(paramObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_ORDER_SOURCES",
                  "value": orderSourcesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_ORDER_SOURCES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllOrderSources(); //refresh the list
                      hideNewOrderSource();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Order Sources data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
          }
          else{
            showToast('Not Found Error: Order Sources data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Order Sources data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Order Sources data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
}


function deleteOrderSourceConfirm(name){
  openSettingsDeleteConfirmation(name, 'deleteOrderSource');
}


/* delete a payment mode */
function deleteOrderSource(modeName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_ORDER_SOURCES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_ORDER_SOURCES'){

               var modesList = data.docs[0].value;

               var memory_code = '';
               var memory_delivery_default = '';
               var memory_takeaway_default = '';

               for (var i=0; i<modesList.length; i++) {  
                 if (modesList[i].name == modeName){
                    memory_code = modesList[i].code;
                    memory_delivery_default = modesList[i].defaultDelivery;
                    memory_takeaway_default = modesList[i].defaultTakeaway;
                    modesList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_ORDER_SOURCES",
                  "value": modesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_ORDER_SOURCES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllOrderSources();

                    showUndo('Deleted', 'addOrderSource(\''+modeName+'\', \''+memory_code+'\', \''+memory_delivery_default+'\', \''+memory_takeaway_default+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Order Sources data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Order Sources data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Order Sources data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Order Sources data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 

    cancelSettingsDeleteConfirmation()
}








function renderBillLayout(){

  var data_custom_header_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '';
  if(data_custom_header_client_name == ''){
     data_custom_header_client_name = 'Invoice';
  }

  document.getElementById('billLayoutRenderArea').innerHTML = ''+
      '<style type="text/css"> #logo{} .invoiceHeader{ min-height: 105px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .invoiceNumberArea{ min-height: 30px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .invoiceContent{ min-height: 100px; width: 100%; background-color: none; font-size: 11px; padding-top: 6px; border-bottom: 1px dashed; } .invoiceCharges{ min-height: 90px; font-size: 11px; width: 100%; background-color: none; padding: 5px 0; border-bottom: 2px solid; } .invoicePaymentsLink{ min-height: 100px; width: 100%; background-color: none; border-bottom: 1px solid; } .invoiceCustomText{ width: 100%; background-color: none; padding: 5px 0; border-bottom: 1px solid; font-size: 12px; text-align: center; } .subLabel{ display: block; font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif; margin-bottom: 5px; } p{ margin: 0; } .serviceType{ border: 1px solid; padding: 4px; font-size: 12px; display: block; text-align: center; margin-bottom: 8px; } .tokenNumber{ display: block; font-size: 16px; font-weight: bold; } .billingAddress{ display: block; font-size: 12px; font-weight: 300; line-height: 1.2em; } .mobileNumber{ display: block; margin-top: 8px; font-size: 12px; } .timeStamp{ display: block; font-size: 11px; font-weight:300; } .invoiceNumber{ letter-spacing: 2px; font-size: 15px; font-weight: bold; } .timeDisplay{ font-size: 75%; display: block; } .rs{ font-size: 60%; } .paymentSubText{ font-size: 10px; font-weight: 300; display: block; } .paymentSubHead{ font-size: 12px; font-weight: bold; display: block; } .qrCode{ width: 100%; max-width: 120px; text-align: right } .addressText{ font-size: 10px; color: gray; padding: 5px 0; text-align: center; } .addressContact{ font-size: 9px; color: gray; padding: 0 0 5px 0; text-align: center; } .gstNumber{ font-weight: bold; font-size: 10px; } </style>'+
      '<div id="logo" style="border: 1px solid red; cursor: pointer;" onclick="viewHeaderImageContent()">'+
        '<center id="data_custom_header_image"><tag style="color: red; font-size: 24px; font-weight: bold; margin-top: 12px; display: block">'+data_custom_header_client_name+'</tag></center>'+
      '</div>'+
      '<div class="invoiceHeader">'+
         '<table style="width: 100%">'+
            '<col style="width: 60%">'+
            '<col style="width: 40%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p><label class="subLabel">Billed To</label>'+
                     '<tag class="billingAddress">Abhijith C S<br>Room No. 404<br>Alakananda Hostel, IIT Madras</tag>'+
                    '<tag class="mobileNumber">Mob. <b>9043960876</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="serviceType">Self Service</tag>'+
                     '<tag class="subLabel">Token No</tag>'+
                     '<tag class="tokenNumber">103</tag>'+
                     '<tag class="subLabel" style="margin: 5px 0 0 0"><input onfocus="selectLayoutInputText(this)" type="text" id="data_custom_top_right_name" style="border: none; border-bottom: 1px solid red; color: red; text-align: right; letter-spacing: 2px; outline: none;" value=""></tag><tag class="supportText" style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">To display necessary information like GST Number or Licence Number etc.</tag>'+
                     '<tag class="gstNumber"><input type="text" style="border: none; border-bottom: 1px solid red; text-align:right; font-weight: bold; outline: none; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_top_right_value" value=""></tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoiceNumberArea">'+
         '<table style="width: 100%">'+
            '<col style="width: 60%">'+
            '<col style="width: 40%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
            '<p>'+
              '<tag class="subLabel">INVOICE NO</tag>'+
              '<tag class="invoiceNumber">131444</tag>'+
            '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">INOVICE DATE</tag>'+
                     '<tag class="timeStamp">13th March, 2018<time class="timeDisplay">03:02 PM</time></tag>'+
                  '</p>'+
                  '<tag></tag>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoiceContent">'+
         '<table style="width: 100%">'+
            '<col style="width: 8%">'+
            '<col style="width: 53%">'+
            '<col style="width: 12%">'+
            '<col style="width: 12%">'+
            '<col style="width: 15%">'+
            '<tr>'+
               '<td>1</td>'+
               '<td>Malabar Chicken Biriyani</td>'+
               '<td><rs class="rs">Rs.</rs>90</td>'+
               '<td>x 2</td>'+
               '<td style="text-align: right;"><rs class="rs">Rs.</rs>180</td>'+
            '</tr>'+
            '<tr>'+
               '<td>2</td>'+
               '<td>Barbeque Spicy (Half)</td>'+
               '<td><rs class="rs">Rs.</rs>110</td>'+
               '<td>x 1</td>'+
               '<td style="text-align: right;"><rs class="rs">Rs.</rs>110</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoiceCharges">'+
         '<table style="width: 100%">'+
            '<col style="width: 80%">'+
            '<col style="width: 20%">'+
            '<tr>'+
               '<td>Sub Total</td>'+
               '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>290</td>'+
            '</tr>'+
            '<tr>'+
               '<td>Service Charges (Rs. 5)</td>'+
               '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>5</td>'+
            '</tr>'+
            '<tr>'+
               '<td>GST (5%)</td>'+
               '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>14.3</td>'+
            '</tr>'+
            '<tr>'+
               '<td style="font-weight: bold; text-transform: uppercase">Total Payable</td>'+
               '<td style="text-align: right; font-size: 21px; font-weight: bold"><rs class="rs">Rs.</rs>309</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoicePaymentsLink">'+
       '<table style="width: 100%">'+
            '<col style="width: 60%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: middle">'+
                  '<tag class="supportText" style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">If the <b>Online Easy Scan & Pay</b> is enabled, this part will be visible on the Bill (not on Prepaid Bills)</tag>'+
                  '<p>'+
                    '<tag class="paymentSubHead"><input type="text" style="border:none; font-weight: bold; outline: none; border-bottom: 1px solid red; text-align: left; width: 100%; font-size: 12px; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_bottom_pay_heading" value=""></tag>'+
                    '<tag class="paymentSubText"><textarea class="addressText" style="margin: 0px; width: 100%; border: 1px solid red; margin-top: 5px; padding: 5px; outline: none; text-align: left; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_bottom_pay_brief"></textarea></tag>'+
                  '</p>'+ 
               '</td>'+
               '<td>'+
                  '<img src="./images/common/sample_qr.jpg" class="qrCode">'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoiceCustomText">'+
         '<table style="width: 100%">'+
            '<col style="width: 100%">'+
            '<tr>'+
               '<td><input type="text" style="border:none; outline: none; border-bottom: 1px solid red; text-align: center; width: 100%; font-size: 12px; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_footer_comments" value=""></td><tag class="supportText" style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">Add any note here like running promotions, upcoming events etc.</tag>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<textarea class="addressText" style="margin: 0px; width: 100%; border: 1px solid red; margin-top: 5px; padding: 5px; outline: none; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_footer_address"></textarea><tag class="supportText" style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">To display restaurant address and contact information</tag>'+
      '<input type="text" style="border:none; outline: none; border-bottom: 1px solid red; text-align: center; width: 100%; font-size: 9px; color: red;" onfocus="selectLayoutInputText(this)" id="data_custom_footer_contact" value="">';  



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILL_LAYOUT" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILL_LAYOUT'){

              var layoutData = data.docs[0].value;
              
              var data_custom_header_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '';
              if(data_custom_header_client_name == ''){
                 data_custom_header_client_name = 'Invoice';
              }

              var n = 0;
              while(layoutData[n]){
                if(layoutData[n].name == 'data_custom_header_image'){ //Special case for logo image
                  if(layoutData[n].value != ''){
                    $('#'+layoutData[n].name).html('<img src="'+layoutData[n].value+'" style="max-width: 90%">');
                  }
                  else{
                    $('#'+layoutData[n].name).html('<tag style="color: red; font-size: 24px; font-weight: bold; margin-top: 12px; display: block">'+data_custom_header_client_name+'</tag>');
                  }
                }
                else{
                  $('#'+layoutData[n].name).val(layoutData[n].value);
                }
                
                n++;
              }

          }
          else{
            showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
      }

    });

}


function saveLayoutChanges(){

  var new_top_right_name = $('#data_custom_top_right_name').val();
  var new_top_right_value = $('#data_custom_top_right_value').val();
  var new_bottom_pay_heading = $('#data_custom_bottom_pay_heading').val();
  var new_bottom_pay_brief = $('#data_custom_bottom_pay_brief').val();
  var new_footer_comments = $('#data_custom_footer_comments').val();
  var new_footer_address = $('#data_custom_footer_address').val();
  var new_footer_contact = $('#data_custom_footer_contact').val();

  if(new_footer_address == '' || new_footer_contact == ''){
    showToast('Warning! Add Restaurant Address and Contact details in the bottom most area.', '#e67e22');
    return '';
  }

  if(new_footer_comments == ''){
    showToast('Warning! Add any note or custom tag line, just above the Address/Contact area.', '#e67e22');
    return '';
  }

  var billLayoutObject = [
    {
      "name": "data_custom_top_right_name",
      "value": new_top_right_name
    },
    {
      "name": "data_custom_top_right_value",
      "value": new_top_right_value
    },
    {
      "name": "data_custom_bottom_pay_heading",
      "value": new_bottom_pay_heading
    },
    {
      "name": "data_custom_bottom_pay_brief",
      "value": new_bottom_pay_brief
    },
    {
      "name": "data_custom_footer_comments",
      "value": new_footer_comments
    },
    {
      "name": "data_custom_footer_address",
      "value": new_footer_address
    },
    {
      "name": "data_custom_footer_contact",
      "value": new_footer_contact
    }
  ];

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILL_LAYOUT" 
                  }
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILL_LAYOUT'){

              var layoutData = data.docs[0].value;

              var n = 0;
              while(layoutData[n]){
                if(layoutData[n].name == 'data_custom_header_image'){
                  billLayoutObject.push(layoutData[n]);
                  break;
                }

                n++;
              }


                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILL_LAYOUT",
                  "value": billLayoutObject
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILL_LAYOUT/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      applyBillLayout();
                      renderBillLayout();
                      showToast('Bill Layout updated successfully', '#27ae60');
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Billing Layout data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  


          }
          else{
            showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
      }
    });
}

function selectLayoutInputText(element){
  $(element).select();
}


/* SETTING UP THE LOGO */

//Photo Cropper
function viewHeaderImageContent(){

  document.getElementById("photoCropperModal").style.display = 'block';

      var image;
      
      var cropBoxData;
      var canvasData;
      var cropper;

      var resultImage;

      var handleFileSelect = function(input) {

        document.getElementById("uploadedItemImageContainer").style.display = 'block';

            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = function (evt) {
                resultImage = evt.target.result;
                $('#uploadedItemImage').attr('src', evt.target.result);
                image = document.getElementById('uploadedItemImage');

                cropper = new Cropper(image, {
                  autoCropArea: 0.8,
                  scalable: true,
                  ready: function () {
                    cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
                  }
                }); 
      
            };
        
            reader.readAsDataURL(file);
      };


      //File Upload
      $("#itemPhotoFileInput").change(function(){
          handleFileSelect(this);
      });

        //Saved Cropped Image
        $("#cropUploadedImageButton").click(function(){
          cropBoxData = cropper.getCropBoxData();
          canvasData = cropper.getCroppedCanvas({
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high',
        });

          
          var newFile = canvasData.toDataURL();
          cropper.destroy();

          pushLogoToServer(newFile);
          hidePhotoCropper();
    });
}

function hidePhotoCropper(){
  document.getElementById("uploadedItemImageContainer").style.display = 'none';
  document.getElementById("photoCropperModal").style.display = 'none';
}


function pushLogoToServer(encodedData){

    var new_url = encodedData;
 
    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_BILL_LAYOUT" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILL_LAYOUT'){

              var layoutData = data.docs[0].value;

              var n = 0;
              while(layoutData[n]){
                if(layoutData[n].name == 'data_custom_header_image'){
                  layoutData[n].value = new_url;
                  break;
                }

                n++;
              }


                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILL_LAYOUT",
                  "value": layoutData
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILL_LAYOUT/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      window.localStorage.bill_custom_header_image = new_url;
                      renderBillLayout();
                      showToast('Bill Image Header saved successfully', '#27ae60');
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Billing Layout data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  
          }
          else{
            showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
      }
    });
}



function removeLogoImage(){

    hidePhotoCropper();

    var new_url = '';
 
    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_BILL_LAYOUT" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_BILL_LAYOUT'){

              var layoutData = data.docs[0].value;

              var n = 0;
              while(layoutData[n]){
                if(layoutData[n].name == 'data_custom_header_image'){
                  layoutData[n].value = new_url;
                  break;
                }

                n++;
              }


                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_BILL_LAYOUT",
                  "value": layoutData
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_BILL_LAYOUT/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      window.localStorage.bill_custom_header_image = new_url;
                      renderBillLayout();
                      showToast('Bill Image Header removed successfully', '#27ae60');
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Billing Layout data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  
          }
          else{
            showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Billing Layout data not found. Please contact Accelerate Support.', '#e74c3c');
      }
    });
}
