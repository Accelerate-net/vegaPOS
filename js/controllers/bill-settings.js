
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




function renderBillLayout(){

  document.getElementById('billLayoutRenderArea').innerHTML = ''+
      '<style type="text/css"> #logo{ background: url(../data/photos/brand/invoice-logo.png) no-repeat center center; min-height: 70px; width: 100%; background-color: none; } .invoiceHeader{ min-height: 105px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .invoiceNumberArea{ min-height: 30px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .invoiceContent{ min-height: 100px; width: 100%; background-color: none; font-size: 11px; padding-top: 6px; border-bottom: 1px dashed; } .invoiceCharges{ min-height: 90px; font-size: 11px; width: 100%; background-color: none; padding: 5px 0; border-bottom: 2px solid; } .invoicePaymentsLink{ min-height: 100px; width: 100%; background-color: none; border-bottom: 1px solid; } .invoiceCustomText{ width: 100%; background-color: none; padding: 5px 0; border-bottom: 1px solid; font-size: 12px; text-align: center; } .subLabel{ display: block; font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif; margin-bottom: 5px; } p{ margin: 0; } .serviceType{ border: 1px solid; padding: 4px; font-size: 12px; display: block; text-align: center; margin-bottom: 8px; } .tokenNumber{ display: block; font-size: 16px; font-weight: bold; } .billingAddress{ display: block; font-size: 12px; font-weight: 300; line-height: 1.2em; } .mobileNumber{ display: block; margin-top: 8px; font-size: 12px; } .timeStamp{ display: block; font-size: 11px; font-weight:300; } .invoiceNumber{ letter-spacing: 2px; font-size: 15px; font-weight: bold; } .timeDisplay{ font-size: 75%; display: block; } .rs{ font-size: 60%; } .paymentSubText{ font-size: 10px; font-weight: 300; display: block; } .paymentSubHead{ font-size: 12px; font-weight: bold; display: block; } .qrCode{ width: 100%; max-width: 120px; text-align: right } .addressText{ font-size: 10px; color: gray; padding: 5px 0; text-align: center; } .addressContact{ font-size: 9px; color: gray; padding: 0 0 5px 0; text-align: center; } .gstNumber{ font-weight: bold; font-size: 10px; } </style>'+
      '<div id="logo">'+

        '<center><img id="data_custom_header_image" src="'+'data:image/png;base64,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'+'"></center>'+
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
                     '<tag class="subLabel" style="margin: 5px 0 0 0"><input onfocus="selectLayoutInputText(this)" type="text" id="data_custom_top_right_name" style="border: none; border-bottom: 1px solid red; color: red; text-align: right; letter-spacing: 2px; outline: none;" value=""></tag><tag style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">To display necessary information like GST Number or Licence Number etc.</tag>'+
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
                  '<tag style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">If the <b>Online Easy Scan & Pay</b> is enabled, this part will be visible on the Bill (not on Prepaid Bills)</tag>'+
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
               '<td><input type="text" style="border:none; outline: none; border-bottom: 1px solid red; text-align: center; width: 100%; font-size: 12px; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_footer_comments" value=""></td><tag style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">Add any note here like running promotions, upcoming events etc.</tag>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<textarea class="addressText" style="margin: 0px; width: 100%; border: 1px solid red; margin-top: 5px; padding: 5px; outline: none; color: red" onfocus="selectLayoutInputText(this)" id="data_custom_footer_address"></textarea><tag style="position: absolute; right: -50%; display: block; font-style: italic; font-size: 10px; color: #11ab8c; width: 45%; text-align: left;">To display restaurant address and contact information</tag>'+
      '<input type="text" style="border:none; outline: none; border-bottom: 1px solid red; text-align: center; width: 100%; font-size: 9px; color: red;" onfocus="selectLayoutInputText(this)" id="data_custom_footer_contact" value="">';  



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_BILL_LAYOUT" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_BILL_LAYOUT'){

              var layoutData = data.docs[0].value;

              var n = 0;
              while(layoutData[n]){
                $('#'+layoutData[n].name).val(layoutData[n].value);
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
                    "identifierTag": "ZAITOON_BILL_LAYOUT" 
                  }
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
          if(data.docs[0].identifierTag == 'ZAITOON_BILL_LAYOUT'){

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
                  "identifierTag": "ZAITOON_BILL_LAYOUT",
                  "value": billLayoutObject
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_BILL_LAYOUT/',
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
