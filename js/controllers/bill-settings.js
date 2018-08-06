
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

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

	document.getElementById(id).style.display = "block";

	switch(id){
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
    case "discountTypes":{
      fetchAllDiscountTypes();
      break;
    }
	}
}


function openSettingsDeleteConfirmation(type, functionName){
	document.getElementById("settingsDeleteConfirmationConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="cancelSettingsDeleteConfirmation()" style="float: left">Cancel</button>'+
                  							'<button type="button" class="btn btn-danger" onclick="'+functionName+'(\''+type+'\')">Delete</button>';

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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

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
                    "identifierTag": "ZAITOON_BILLING_PARAMETERS" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_PARAMETERS'){

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
                  "identifierTag": "ZAITOON_BILLING_PARAMETERS",
                  "value": billingParamsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_BILLING_PARAMETERS/',
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
                    "identifierTag": "ZAITOON_BILLING_PARAMETERS" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
                  "identifierTag": "ZAITOON_BILLING_PARAMETERS",
                  "value": billingParamsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_BILLING_PARAMETERS/',
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_DISCOUNT_TYPES'){

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
                    "identifierTag": "ZAITOON_DISCOUNT_TYPES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_DISCOUNT_TYPES'){

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
                  "identifierTag": "ZAITOON_DISCOUNT_TYPES",
                  "value": discountsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_DISCOUNT_TYPES/',
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
                    "identifierTag": "ZAITOON_DISCOUNT_TYPES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
                  "identifierTag": "ZAITOON_DISCOUNT_TYPES",
                  "value": discountsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_DISCOUNT_TYPES/',
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
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_MODES'){

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
                    "identifierTag": "ZAITOON_BILLING_MODES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_BILLING_MODES'){

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
                  "identifierTag": "ZAITOON_BILLING_MODES",
                  "value": billingModesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_BILLING_MODES/',
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
                    "identifierTag": "ZAITOON_BILLING_MODES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
                  "identifierTag": "ZAITOON_BILLING_MODES",
                  "value": billingModesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_BILLING_MODES/',
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
                    "identifierTag": "ZAITOON_PAYMENT_MODES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_PAYMENT_MODES'){

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
                  "identifierTag": "ZAITOON_PAYMENT_MODES",
                  "value": paymentTypesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_PAYMENT_MODES/',
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
                    "identifierTag": "ZAITOON_PAYMENT_MODES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
                  "identifierTag": "ZAITOON_PAYMENT_MODES",
                  "value": modesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_PAYMENT_MODES/',
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


