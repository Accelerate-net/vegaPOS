
function openNewBill(){
	document.getElementById("newBillArea").style.display = "block";
  $("#add_new_param_name").focus();
	document.getElementById("openNewBillButton").style.display = "none";
}

function hideNewBill(){
	
	document.getElementById("newBillArea").style.display = "none";
	document.getElementById("openNewBillButton").style.display = "block";
}


function addExtraToInput(name, id){
  if(document.getElementById("add_new_mode_extras").value == "" || document.getElementById("add_new_mode_extras").value =="Choose from below list"){
    document.getElementById("add_new_mode_extras").value = name;
  }
  else{
    document.getElementById("add_new_mode_extras").value = document.getElementById("add_new_mode_extras").value + ',' +name;
  }

  document.getElementById(id).style.display = "none";
}


function openNewMode(){

  document.getElementById("add_new_mode_extras").value="";

  /*render extras list*/

    if(fs.existsSync('./data/static/billingparameters.json')) {
        fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
      if (err){
          
      } else {

          if(data == ''){ data = '[]'; }

              var modes = JSON.parse(data);
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

        for (var i=0; i<modes.length; i++){
          modesTag = modesTag + '<tag class="extrasSelButton" onclick="addExtraToInput(\''+modes[i].name+'\', \'extra_'+i+'\')" id="extra_'+i+'">'+modes[i].name+' ('+(modes[i].unit == 'FIXED'? 'Rs. '+modes[i].value : modes[i].value+'%')+')</tag>';
        }

        if(!modesTag){
            document.getElementById("extrasList").innerHTML = '<i>*Please update <b style="cursor: pointer" onclick="openBillSettings(\'billingExtras\')">Taxes & Other Extras</b> first.</i>';
        }
        else{            
            document.getElementById("extrasList").innerHTML = 'Extras List: '+modesTag;
        }

          document.getElementById("newModeArea").style.display = "block";
          $("#add_new_mode_name").focus();
          document.getElementById("openNewModeButton").style.display = "none";
    }
    });
  }

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

		if(fs.existsSync('./data/static/billingparameters.json')) {
	      fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var params = JSON.parse(data);
	          	params.sort(); //alphabetical sorting 
	          	var paramsTag = '';

				for (var i=0; i<params.length; i++){
					paramsTag = paramsTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+params[i].name+'</td> <td>'+params[i].value+'</td> <td>'+params[i].unitName+'</td> <td>'+(params[i].isCompulsary?"Yes": "No")+'</td> <td onclick="deleteParameterConfirm(\''+params[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
				}

				if(!paramsTag)
					document.getElementById("billingParamsTable").innerHTML = '<p style="color: #bdc3c7">No parameters added yet.</p>';
				else
					document.getElementById("billingParamsTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Name</th> <th style="text-align: left">Value</th> <th style="text-align: left">Unit</th> <th style="text-align: left">Compulsary</th> <th style="text-align: left"></th> </tr> </thead>'+
																	'<tbody>'+paramsTag+'</tbody>';
		}
		});
	    } else {
	      showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}


/* add new param */
function addParameter() {  

	var paramObj = {};
	paramObj.name = document.getElementById("add_new_param_name").value;
  paramObj.name = (paramObj.name).replace (/,/g, "");
	paramObj.isCompulsary = document.getElementById("add_new_param_compulsary").value == 'YES'? true: false;
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


      //Check if file exists
      if(fs.existsSync('./data/static/billingparameters.json')) {
         fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(paramObj); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/billingparameters.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllParams(); //refresh the list
                hideNewBill();

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i].name == paramObj.name){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Parameter already exists. Please choose a different name.', '#e67e22');
             }
             else{
                obj.push(paramObj);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/billingparameters.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
                    }
		            else{
			                fetchAllParams(); //refresh the list
			                hideNewBill();
		              	
		              }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(paramObj);
         fs.writeFile('./data/static/billingparameters.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllParams(); //refresh the list
                hideNewBill();         	
           }
         });
      }
  
}


function deleteParameterConfirm(name){
	openSettingsDeleteConfirmation(name, 'deleteParameter');
}


/* delete a param */
function deleteParameter(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/billingparameters.json')) {
       fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
       } else {
       	if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i].name == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/billingparameters.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
        
        	/* on successful delete */
   			fetchAllParams();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelSettingsDeleteConfirmation()

}



/*Discount Types*/

function fetchAllDiscountTypes(){

    if(fs.existsSync('./data/static/discounttypes.json')) {
        fs.readFile('./data/static/discounttypes.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Discount Types data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var modes = JSON.parse(data);
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

        for (var i=0; i<modes.length; i++){
          modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+modes[i].name+'</td> <td>'+(modes[i].maxDiscountUnit == 'PERCENTAGE'? (modes[i].maxDiscountValue+'%'): ('<i class="fa fa-inr"></i> '+modes[i].maxDiscountValue))+'</td> <td onclick="deleteDiscountTypeConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
        }

        if(!modesTag)
          document.getElementById("discountTypesTable").innerHTML = '<p style="color: #bdc3c7">No discount types added yet.</p>';
        else
          document.getElementById("discountTypesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Type Name</th> <th style="text-align: left">Max Discount</th> <th style="text-align: left"></th> </tr> </thead>'+
                                  '<tbody>'+modesTag+'</tbody>';
    }
    });
      } else {
        showToast('System Error: Unable to read Discount Types data. Please contact Accelerate Support.', '#e74c3c');
      } 
}




/* add new discount type */
function addDiscountType() {  

  var paramObj = {};
  paramObj.name = document.getElementById("add_new_discount_name").value;
  paramObj.maxDiscountUnit = document.getElementById("add_new_discount_unit").value;
  paramObj.maxDiscountValue = document.getElementById("add_new_discount_maxValue").value;

  paramObj.maxDiscountValue = parseFloat(paramObj.maxDiscountValue);

  if(paramObj.name == ''){
    showToast('Warning: Please set a name', '#e67e22');
    return '';
  }


  if((paramObj.name).toUpperCase() == 'COUPON' || (paramObj.name).toUpperCase() == 'VOUCHER' || (paramObj.name).toUpperCase() == 'NOCOSTBILL' || (paramObj.name).toUpperCase() == 'REWARDS'){
    showToast('Warning: Reserved Keyword. Please set different a name', '#e67e22');
    return '';
  }

      //Check if file exists
      if(fs.existsSync('./data/static/discounttypes.json')) {
         fs.readFile('./data/static/discounttypes.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Discount Types data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(paramObj); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/discounttypes.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Discount Types data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllDiscountTypes(); //refresh the list
                hideNewDiscountType();

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i].name == paramObj.name){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Discount type name already exists. Please choose a different name', '#e67e22');
             }
             else{
                obj.push(paramObj);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/discounttypes.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Discount Types data. Please contact Accelerate Support.', '#e74c3c');
                    }
                else{
                      fetchAllDiscountTypes(); //refresh the list
                      hideNewDiscountType();
                    
                  }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(paramObj);
         fs.writeFile('./data/static/discounttypes.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Discount Types data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllDiscountTypes(); //refresh the list
                hideNewDiscountType();           
           }
         });
      }
  
}


function deleteDiscountTypeConfirm(name){
  openSettingsDeleteConfirmation(name, 'deleteDiscountType');
}


/* delete a discount type */
function deleteDiscountType(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/discounttypes.json')) {
       fs.readFile('./data/static/discounttypes.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Discount Types data. Please contact Accelerate Support.', '#e74c3c');
       } else {
        if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i].name == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/discounttypes.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Discount Types data. Please contact Accelerate Support.', '#e74c3c');
        
          /* on successful delete */
          fetchAllDiscountTypes();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Discount Types data. Please contact Accelerate Support.', '#e74c3c');
   }


   cancelSettingsDeleteConfirmation()
}



/* read billing params */
function fetchAllModes(){

		if(fs.existsSync('./data/static/billingmodes.json')) {
	      fs.readFile('./data/static/billingmodes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 
	          	var modesTag = '';

				for (var i=0; i<modes.length; i++){
					modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td><p style="margin: 0">'+modes[i].name+'</p><p style="margin: 0; font-size: 65%; color: #f39c12;">'+modes[i].type+'</p></td> <td>'+( modes[i].extras == ''? '-' :((modes[i].extras).toString()).replace(/\,/g , ", "))+'</td> <td>'+(modes[i].minimumBill != 0? '<i class="fa fa-inr"></i>'+modes[i].minimumBill :'-')+'</td> <td>'+(modes[i].isDiscountable?"Yes": "No")+'</td> <td>'+(modes[i].maxDiscount != 0? '<i class="fa fa-inr"></i>'+modes[i].maxDiscount :'-')+'</td> <td onclick="deleteModeConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
				}

				if(!modesTag){
					document.getElementById("billingModesTable").innerHTML = '<p style="color: #bdc3c7">No modes added yet.</p>';
				}else{
					document.getElementById("billingModesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Mode</th> <th style="text-align: left">Extras Collected</th> <th style="text-align: left">Min Bill Amount</th> <th style="text-align: left">Discountable</th><th style="text-align: left">Max Discount</th> <th style="text-align: left"></th> </tr> </thead>'+
																	'<tbody>'+modesTag+'</tbody>';
        }
		}
		});
	    } else {
	      showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}




/* add new mode */
function addMode() {  

	var paramObj = {};
	paramObj.name = document.getElementById("add_new_mode_name").value;
	paramObj.isDiscountable = document.getElementById("add_new_mode_discountable").value == 'YES'? true: false;
	paramObj.extras = document.getElementById("add_new_mode_extras").value;
	paramObj.type = document.getElementById("add_new_mode_type").value;
	paramObj.minimumBill = document.getElementById("add_new_mode_minBill").value;
	paramObj.maxDiscount = document.getElementById("add_new_mode_maxDisc").value;

	paramObj.minimumBill = parseFloat(paramObj.minimumBill);
	paramObj.maxDiscount = parseFloat(paramObj.maxDiscount);

	paramObj.extras = paramObj.extras == 'Choose from below'? '': paramObj.extras;

	console.log(paramObj)

	if(paramObj.name == ''){
		showToast('Warning: Please set a name', '#e67e22');
		return '';
	}
	else if(Number.isNaN(paramObj.minimumBill)){
		showToast('Warning: Invalid minimum bill amount. Keep it as Zero or any number', '#e67e22');
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

      //Check if file exists
      if(fs.existsSync('./data/static/billingmodes.json')) {
         fs.readFile('./data/static/billingmodes.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(paramObj); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/billingmodes.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllModes(); //refresh the list
                hideNewMode();

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i].name == paramObj.name){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Mode already exists. Please choose a different name.', '#e67e22');
             }
             else{
                obj.push(paramObj);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/billingmodes.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
                    }
		            else{
			                fetchAllModes(); //refresh the list
			                hideNewMode();
		              	
		              }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(paramObj);
         fs.writeFile('./data/static/billingmodes.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllModes(); //refresh the list
                hideNewMode();         	
           }
         });
      }
  
}

function deleteModeConfirm(name){
	openSettingsDeleteConfirmation(name, 'deleteMode');
}

/* delete a param */
function deleteMode(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/billingmodes.json')) {
       fs.readFile('./data/static/billingmodes.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
       } else {
       	if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i].name == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/billingmodes.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
        
        	/* on successful delete */
   			fetchAllModes();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelSettingsDeleteConfirmation()

}



/* read payment modes */
function fetchAllPaymentModes(){

		if(fs.existsSync('./data/static/paymentmodes.json')) {
	      fs.readFile('./data/static/paymentmodes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Billing Modes data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 
	          	var modesTag = '';

				for (var i=0; i<modes.length; i++){
					modesTag = modesTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+modes[i].name+'</td> <td>'+modes[i].code+'</td> <td onclick="deletePaymentModeConfirm(\''+modes[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
				}

				if(!modesTag)
					document.getElementById("paymentModesTable").innerHTML = '<p style="color: #bdc3c7">No payment modes added yet.</p>';
				else
					document.getElementById("paymentModesTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Payment Mode</th> <th style="text-align: left">Code</th> <th style="text-align: left"></th> </tr> </thead>'+
																	'<tbody>'+modesTag+'</tbody>';
		}
		});
	    } else {
	      showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}




/* add new payment mode */
function addPaymentMode() {  

	var paramObj = {};
	paramObj.name = document.getElementById("add_new_payment_name").value;
	paramObj.code = document.getElementById("add_new_payment_code").value;

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

      //Check if file exists
      if(fs.existsSync('./data/static/paymentmodes.json')) {
         fs.readFile('./data/static/paymentmodes.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(paramObj); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/paymentmodes.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllPaymentModes(); //refresh the list
                hideNewPaymentMode();

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i].name == paramObj.name){
                  flag=1;
                  break;
               }
               else if (obj[i].code == paramObj.code){
                  flag=2;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Mode Name already exists. Please choose a different name', '#e67e22');
             }
             else if(flag==2){
             	showToast('Warning: Mode Code already exists. Please choose a different code', '#e67e22');
             }
             else{
                obj.push(paramObj);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/paymentmodes.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
                    }
		            else{
			                fetchAllPaymentModes(); //refresh the list
			                hideNewPaymentMode();
		              	
		              }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(paramObj);
         fs.writeFile('./data/static/paymentmodes.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllPaymentModes(); //refresh the list
                hideNewPaymentMode();         	
           }
         });
      }
  
}


function deletePaymentModeConfirm(name){
	openSettingsDeleteConfirmation(name, 'deletePaymentMode');
}


/* delete a payment mode */
function deletePaymentMode(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/paymentmodes.json')) {
       fs.readFile('./data/static/paymentmodes.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
       } else {
       	if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i].name == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/paymentmodes.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
        
        	/* on successful delete */
   			fetchAllPaymentModes();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Payment Modes data. Please contact Accelerate Support.', '#e74c3c');
   }


   cancelSettingsDeleteConfirmation()
}


