

function generateBillFromKOT(kotID){
//ask to confirm (display bill preview)
//ask for applying any discounts
//Merge, split bill options
//check for all linked tables (Order clubbed on T1, T2 and T3)

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

          document.getElementById("billPreviewContentTitle").innerHTML = "#"+kotfile.KOTNumber;

          var itemList = '';
          var subTotal = 0;
          var qtySum = 0;
          var grandPayableSum = 0;
          var n = 0;
          while(kotfile.cart[n]){
          	itemList = itemList + '<tr class="success">'+
								' <td class="text-center">'+(n+1)+'</td>'+
								' <td>'+kotfile.cart[n].name+(kotfile.cart[n].isCustom ? ' ('+kotfile.cart[n].variant+')': '')+'</td>'+
								' <td class="text-center"> <span class="text-center sprice"><i class="fa fa-inr"></i>'+kotfile.cart[n].price+'</span></td>'+
								' <td class="text-center">x '+kotfile.cart[n].qty+'</td>'+
								' <td class="text-right"><span class="text-right ssubtotal"><i class="fa fa-rupee"></i>'+(kotfile.cart[n].price*kotfile.cart[n].qty)+'</span></td>'+
								' </tr>';

								subTotal = subTotal + (kotfile.cart[n].price*kotfile.cart[n].qty);
								qtySum = qtySum + kotfile.cart[n].qty;
          	n++;
          }



          /*Other Charges*/ 
          var otherChargesSum = 0;        
          var otherCharges = '';
          var otherChargerRenderCount = 1;
          var i = 0;



          otherCharges = '<tr class="info">';

          if(kotfile.extras.length > 0){

          	for(i = 0; i < kotfile.extras.length; i++){
          		if(i%2 == 0){
          			otherCharges = otherCharges + '</tr><tr class="info">';
          		}

          		otherCharges = otherCharges + '<td width="35%" class="cartSummaryRow">'+kotfile.extras[i].name+' ('+(kotfile.extras[i].unit == 'PERCENTAGE'? kotfile.extras[i].value + '%': '<i class="fa fa-inr"></i>'+kotfile.extras[i].value)+')</td><td width="15%" class="text-right cartSummaryRow"><i class="fa fa-inr"></i>'+kotfile.extras[i].amount+'</td>';
          		otherChargesSum = otherChargesSum + kotfile.extras[i].amount;
          		
          	}
          }


          otherChargerRenderCount = otherChargerRenderCount + i;

          //Discount
          var discountTag = '';
          if(kotfile.discount.amount &&  kotfile.discount.amount != 0){
          	discountTag = '<td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px; color: #e74c3c !important">- <i class="fa fa-inr"></i>'+kotfile.discount.amount+'</td>';
          	//'<tr class="info"><td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px; color: #e74c3c !important">- <i class="fa fa-inr"></i>'+kotfile.discount.amount+'</td>';
          	otherChargesSum = otherChargesSum - kotfile.discount.amount;
          }
          else{
          	discountTag = '<td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td>';
          }



          //Customisable Extras
          var customExtraTag = '';
          if(kotfile.customExtras.amount &&  kotfile.customExtras.amount != 0){
          	customExtraTag = '<td width="35%" class="cartSummaryRow">'+kotfile.customExtras.type+' ('+(kotfile.customExtras.unit == 'PERCENTAGE'? kotfile.customExtras.value+'%' : 'Rs.'+kotfile.customExtras.value)+')</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;"><i class="fa fa-inr"></i>'+kotfile.customExtras.amount+'</td>';
          	otherChargesSum = otherChargesSum + kotfile.customExtras.amount;
          }
          else{
          	customExtraTag = '<td width="35%" class="cartSummaryRow">Other Charges</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td>';
          }   






          if(otherChargerRenderCount%2 == 0){
          	otherCharges = otherCharges + customExtraTag + '</tr>'+
          				'<tr class="info">'+discountTag+
          				'<td class="cartSummaryRow"></td><td class="cartSummaryRow"></td></tr>';
          }
          else{
          	otherCharges = otherCharges + '</tr> <tr class="info">'+customExtraTag+discountTag+'</tr>';
          }


          grandPayableSum = subTotal + otherChargesSum;

          grandPayableSum = Math.round(grandPayableSum * 100) / 100


          var discountButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type != 'COUPON' && kotfile.discount.type != 'NOCOSTBILL' && kotfile.discount.type != 'VOUCHER'){ /*Discount is Applied Already*/
          	discountButtonPart ='                        <div class="">'+
								'                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeBillDiscountOnKOT(\''+kotfile.KOTNumber+'\')">Remove Discount</button>'+
								'                        </div>';
          } 
          else{         	
          	discountButtonPart ='                        <div class="" id="applyBillDiscountWindow">'+
								'                          <div id="applyBillDiscountWindowActions" style="display: none">'+
								'                             <div class="row">'+
								'                                <div class="col-lg-12">'+
								'                                  <div class="form-group" style="margin-bottom: 5px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">TYPE</label>'+
								'                                    <select name="unit" id="applyBillDiscountWindow_type" class="form-control input-tip select2" style="width:100%;">'+
								'                                       <option value="OTHER" selected="selected">Other</option>'+
								'                                    </select>'+
								'                                 </div>'+
								'                                 <div class="form-group" style="margin-bottom: 5px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">UNIT</label>'+
								'                                    <select name="unit" id="applyBillDiscountWindow_unit" class="form-control input-tip select2" style="width:100%;" onchange="changeDiscountTypeBillingOptions()">'+
								'                                       <option value="PERCENTAGE" selected="selected">Percentage (%)</option>'+
								'                                       <option value="FIXED">Fixed Amount (Rs)</option>'+
								'                                    </select>'+
								'                                 </div>'+
								'                                   <div class="form-group" style="margin-bottom: 2px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">DISCOUNT VALUE</label>'+
								'                                      <input type="number" value="0" placeholder="Value" style="text-align: center; color: #444" class="form-control tip" id="applyBillDiscountWindow_value" onkeyup="roughCalculateDiscount()" required="required" />'+
								'                                   </div>'+
								'                                   <p style="font-size: 11px; color: #2ecc71">Discount Amount: <tag id="applyBillDiscountWindow_amount">0</tag></p>'+
								'                                </div>'+
								'                                '+
								'                             </div> '+
								'                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyBillDiscountWindow(\''+kotfile.KOTNumber+'\')">Cancel</button>                           '+
								'                          </div>'+
								'                          <div id="applyBillDiscountButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyBillDiscountButton" onclick="openApplyBillDiscountWindow(\''+kotfile.KOTNumber+'\')">Apply Discount</button></div>'+
								'                        </div>';
          }


          var couponButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type == 'COUPON'){ /*Coupon is Applied Already*/         	
          	couponButtonPart ='                        	 <div class="">'+
								'                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeBillCouponOnKOT(\''+kotfile.KOTNumber+'\')">Remove Coupon</button>'+
								'                        </div>';
          }   
          else{       	
          	couponButtonPart ='                        <div class="" id="applyBillCouponWindow">'+
								'                          <div id="applyBillCouponWindowActions" style="display: none">'+
								'                             <div class="row">'+
								'                                <div class="col-lg-12">'+
								'                                   <div class="form-group" style="margin-bottom: 2px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">COUPON CODE</label>'+
								'                                      <input type="text" value="" placeholder="Coupon Code" style="text-align: center; color: #444; margin-bottom: 5px; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;" class="form-control tip" id="applyBillCouponWindow_code" required="required" />'+
								'                                   </div>'+
								'                                </div>'+
								'                                '+
								'                             </div> '+
								'                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyBillCouponWindow(\''+kotfile.KOTNumber+'\')">Cancel</button>                           '+
								'                          </div>'+
								'                          <div id="applyBillCouponButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyBillCouponButton" onclick="openApplyBillCouponWindow(\''+kotfile.KOTNumber+'\')">Apply Coupon</button></div>'+
								'                        </div>';
          }


          var noCostButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type == 'NOCOSTBILL'){ /*No Cost is Applied Already*/         	
          	noCostButtonPart ='                        	 <div class="">'+
								'                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeNoCostBillOnKOT(\''+kotfile.KOTNumber+'\')">Remove No Cost Bill</button>'+
								'                        </div>';
          }   
          else{       	
          	noCostButtonPart ='                        <div class="" id="applyNoCostBillWindow">'+
								'                          <div id="applyNoCostBillWindowActions" style="display: none">'+
								'                             <div class="row">'+
								'                                <div class="col-lg-12">'+
								'                                   <div class="form-group" style="margin-bottom: 2px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">COMMENTS</label>'+
								'                                      <input type="text" value="" placeholder="Comments" style="text-align: center; color: #444; margin-bottom: 5px; font-size: 14px;" class="form-control tip" id="applyNoCostBillWindow_comments" required="required" />'+
								'                                   </div>'+
								'                                </div>'+
								'                                '+
								'                             </div> '+
								'                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyNoCostBillWindow(\''+kotfile.KOTNumber+'\')">Cancel</button>                           '+
								'                          </div>'+
								'                          <div id="applyNoCostBillButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyNoCostBillButton" onclick="openMarkNoCostBill(\''+kotfile.KOTNumber+'\')">No Cost Bill</button></div>'+
								'                        </div>';
          }


          var customExtrasButtonPart = '';
          if(kotfile.customExtras.amount && kotfile.customExtras.amount != ''){ /*Custom Extra is Applied Already*/
          	customExtrasButtonPart ='                        <div class="">'+
								'                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeCustomExtraOnKOT(\''+kotfile.KOTNumber+'\')">Remove '+kotfile.customExtras.type+'</button>'+
								'                        </div>';
          } 
          else{         	
          	customExtrasButtonPart ='                        <div class="" id="applyCustomExtraWindow">'+
								'                          <div id="applyCustomExtraWindowActions" style="display: none">'+
								'                             <div class="row">'+
								'                                <div class="col-lg-12">'+
								'                                  <div class="form-group" style="margin-bottom: 5px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">TYPE</label>'+
								'                                    <select name="unit" id="applyCustomExtraWindow_type" class="form-control input-tip select2" style="width:100%;">'+
								'                                       <option value="OTHER" selected="selected">Other</option>'+
								'                                    </select>'+
								'                                 </div>'+
								'                                 <div class="form-group" style="margin-bottom: 5px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">UNIT</label>'+
								'                                    <select name="unit" id="applyCustomExtraWindow_unit" class="form-control input-tip select2" style="width:100%;" onchange="changeCustomExtraTypeOptions()">'+
								'                                       <option value="PERCENTAGE" selected="selected">Percentage (%)</option>'+
								'                                       <option value="FIXED">Fixed Amount (Rs)</option>'+
								'                                    </select>'+
								'                                 </div>'+
								'                                   <div class="form-group" style="margin-bottom: 2px">'+
								'                                    <label style="font-size: 10px; font-weight: 300">VALUE</label>'+
								'                                      <input type="number" value="0" placeholder="Value" style="text-align: center; color: #444" class="form-control tip" id="applyCustomExtraWindow_value" onkeyup="roughCalculateCustomExtraValue()" required="required" />'+
								'                                   </div>'+
								'                                   <p style="font-size: 11px; color: #2ecc71">Extra Amount: <tag id="applyCustomExtraWindow_amount">0</tag></p>'+
								'                                </div>'+
								'                                '+
								'                             </div> '+
								'                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyCustomExtraWindow(\''+kotfile.KOTNumber+'\')">Cancel</button>                           '+
								'                          </div>'+
								'                          <div id="applyCustomExtraButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyCustomExtraButton" onclick="openApplyCustomExtraWindow(\''+kotfile.KOTNumber+'\')">Add Extra Charges</button></div>'+
								'                        </div>';
          }




          document.getElementById("billPreviewContent").innerHTML = '<div class="row">'+
								'                    <div class="col-sm-8">'+
								'                        <h1 style="text-align: center; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: 400; color: #444">Bill Preview</h1>'+
								'                        <table class="table table-striped table-condensed table-hover list-table" style="margin:0px; z-index: 2;">'+
								'                           <colgroup>'+
								'                              <col width="10%">'+
								'                              <col width="40%">'+
								'                              <col width="15%">'+
								'                              <col width="20%">'+
								'                              <col width="15%">'+
								'                           </colgroup>'+
								'                           <thead id="cartTitleHead">'+
								'                              <tr class="success cartTitleRow">'+
								'                                 <th class="satu cartTitleRow"></th>'+
								'                                 <th class="cartTitleRow">Item</th>'+
								'                                 <th class="cartTitleRow">Price</th>'+
								'                                 <th class="cartTitleRow">Qty</th>'+
								'                                 <th class="cartTitleRow">Subtotal</th>'+
								'                              </tr>'+
								'                           </thead>'+
								'                        </table>'+
								'                        <table class="table table-striped table-condensed table-hover list-table" style="margin:0px;">'+
								'                            <colgroup>'+
								'                              <col width="10%">'+
								'                              <col width="40%">'+
								'                              <col width="15%">'+
								'                              <col width="20%">'+
								'                              <col width="15%">'+
								'                            </colgroup>                            '+
								'                            <tbody>'+itemList+
								'                            </tbody>'+
								'                        </table>'+
								'                        <table class="table table-condensed totals" style="margin: 0">'+
								'                           <tbody>'+
								'                              <tr class="info">'+
								'                                 <td width="35%" class="cartSummaryRow">Total Items</td>'+
								'                                 <td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;"><span id="count">'+qtySum+'</span></td>'+
								'                                 <td width="35%" class="cartSummaryRow">Total</td>'+
								'                                 <td width="15%" class="text-right cartSummaryRow" colspan="2"><span id="total"><i class="fa fa-inr"></i><tag id="grandSumDisplay">'+subTotal+'</tag></span></td>'+
								'                              </tr>'+otherCharges+
								'                              <tr class="success cartSumRow">'+
								'                                 <td colspan="2" class="cartSumRow" style="font-weight: 400 !important; font-size: 16px;">Total Payable</td>'+
								'                                 <td class="text-right cartSumRow" colspan="2"><span id="total-payable"><i class="fa fa-inr"></i><tag>'+grandPayableSum+'</tag></span></td>'+
								'                              </tr>'+
								'                           </tbody>'+
								'                        </table>                        '+
								'                    </div>'+
								'                    <div class="col-sm-4">'+
								'                        <h1 style="text-align: center; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: 400; color: #444">Options</h1>'+discountButtonPart+couponButtonPart+customExtrasButtonPart+
								'                        <div class="">'+
								'                          <button class="btn btn-default tableOptionsButton breakWord" onclick="redeemPointsIfAny()">Redeem Points</button>'+
								'                        </div>'+noCostButtonPart+
								'                        <div class="">'+
								'                          <button class="btn btn-default tableOptionsButton breakWord" onclick="mergeDifferentBills(\''+kotfile.table+'\')">Merge Bills</button>'+
								'                        </div>'+
								'                    </div>'+
								'                </div>';

			document.getElementById("billPreviewContentActions").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" onclick="confirmBillGeneration()">Confirm</button>'+
                        		'<button style="margin: 0" class="btn btn-default tableOptionsButton breakWord" onclick="hideBillPreviewModal()">Close</button>'

          document.getElementById("billPreviewModal").style.display = 'block';
	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	hideOccuppiedSeatOptions();
}

/* APPLY COUPON */

function openApplyBillCouponWindow(kotID){

	/*Change apply button action*/
	document.getElementById("applyBillCouponButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyBillCouponButton" onclick="applyBillCouponOnKOT(\''+kotID+'\')">Apply Discount</button>';

	//minimize all other open windows
	//closeApplyBillDiscountWindow(kotID);
	//closeApplyNoCostBillWindow(kotID);

	document.getElementById("applyBillCouponWindow").classList.add('billOptionWindowFrame');
	document.getElementById("applyBillCouponWindowActions").style.display = 'block';
	document.getElementById("applyBillCouponButton").classList.remove('btn-default');
	document.getElementById("applyBillCouponButton").classList.add('btn-success');

}


function removeBillCouponOnKOT(kotID){

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

			if(kotfile.discount.amount){
				kotfile.discount = {};
			}
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Coupon removed', '#27ae60');
		           	generateBillFromKOT(kotID);

		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	
}


function applyBillCouponOnKOT(kotID){

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {

          var kotfile = JSON.parse(data);
          
          var userMobile = kotfile.customerMobile;
          var code = document.getElementById("applyBillCouponWindow_code").value;
          var grandSum = 0;

          if(code == ''){
          	return '';
          }

          var n = 0;
          while(kotfile.cart[n]){
          	grandSum = grandSum + (kotfile.cart[n].price * kotfile.cart[n].qty);
          	n++;
          }

          /*Redeem Coupon*/

			var admin_data = {
				"token": window.localStorage.loggedInAdmin,
				"mobile": userMobile,
				"code": code,
				"totalBillAmount": grandSum
			}

			$.ajax({
				type: 'POST',
				url: 'https://www.zaitoon.online/services/posredeemcoupon.php',
				data: JSON.stringify(admin_data),
				contentType: "application/json",
				dataType: 'json',
				success: function(data) {
					if(data.status){

						/*Apply Discount*/
						if(data.isValid){
							totalDiscount = data.discount;

							totalDiscount = Math.round(totalDiscount * 100) / 100;

							kotfile.discount.amount = totalDiscount;
							kotfile.discount.type = 'COUPON';
							kotfile.discount.unit = 'FIXED';
							kotfile.discount.value = totalDiscount;
							kotfile.discount.reference = code;
						       
						       var newjson = JSON.stringify(kotfile);
						       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
						         if(err){
						            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
						           }
						           else{
						           	showToast('Redeemed Succesfully! Discount of <i class="fa fa-inr"></i>'+totalDiscount+' Applied', '#27ae60');
						           	generateBillFromKOT(kotID);

						           }
						       }); 			


						}
						else{
							showToast('Oops! '+data.validityError, '#e67e22');
						}
					}
					else
					{
						if(data.errorCode == 404){
							window.localStorage.loggedInAdmin = "";
							showToast(data.error, '#e74c3c');
						}
						else{
							showToast(data.error, '#e74c3c');
						}
					}


				}
			});	  


	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	
}


function closeApplyBillCouponWindow(kotID){
	
	/*Change apply button action*/
	document.getElementById("applyBillCouponButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton" id="applyBillCouponButton" onclick="openApplyBillCouponWindow(\''+kotID+'\')">Apply Coupon</button>';

	document.getElementById("applyBillCouponWindow").classList.remove('billOptionWindowFrame');
	document.getElementById("applyBillCouponWindowActions").style.display = 'none';	

	document.getElementById("applyBillCouponButton").classList.remove('btn-success');
	document.getElementById("applyBillCouponButton").classList.add('btn-remove');
}





/*APPLY DISCOUNT*/

function openApplyBillDiscountWindow(kotID){

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
	        	if(i == 0)
	          		modesTag = '<option value="'+modes[i].name+'" selected="selected">'+modes[i].name+'</option>';
	          	else
	          		modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
	        }

	        if(!modesTag)
	          document.getElementById("applyBillDiscountWindow_type").innerHTML = '<option value="OTHER" selected="selected">Other</option>';
	        else
	          document.getElementById("applyBillDiscountWindow_type").innerHTML = modesTag;

	      /*Change apply button action*/
	      document.getElementById("applyBillDiscountButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyBillDiscountButton" onclick="applyBillDiscountOnKOT(\''+kotID+'\')">Apply Discount</button>';
    }
    });
      } else {
        showToast('System Error: Unable to read Discount Types data. Please contact Accelerate Support.', '#e74c3c');
      } 


	//minimize all other open windows
	//closeApplyBillCouponWindow(kotID);
	//closeApplyNoCostBillWindow(kotID);


	document.getElementById("applyBillDiscountWindow").classList.add('billOptionWindowFrame');
	document.getElementById("applyBillDiscountWindowActions").style.display = 'block';
	document.getElementById("applyBillDiscountButton").classList.remove('btn-default');
	document.getElementById("applyBillDiscountButton").classList.add('btn-success');

}


function removeBillDiscountOnKOT(kotID){

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

			if(kotfile.discount.amount){
				kotfile.discount = {};
			}
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Discount removed', '#27ae60');
		           	generateBillFromKOT(kotID);

		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	
}


function applyBillDiscountOnKOT(kotID){

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

          /*Calculate Discount*/
          var type = document.getElementById("applyBillDiscountWindow_type").value;
          var unit = document.getElementById("applyBillDiscountWindow_unit").value;
          var value = document.getElementById("applyBillDiscountWindow_value").value;

          var grandSum = 0;

          var n = 0;
          while(kotfile.cart[n]){
          	grandSum = grandSum + (kotfile.cart[n].price * kotfile.cart[n].qty);
          	n++;
          }

          	var totalDiscount = 0;
			if(unit == 'PERCENTAGE'){
				totalDiscount = grandSum*value/100;
			}
			else if(unit == 'FIXED'){
				totalDiscount = value;
			}

			totalDiscount = Math.round(totalDiscount * 100) / 100;


			kotfile.discount.amount = totalDiscount;
			kotfile.discount.type = type;
			kotfile.discount.unit = unit;
			kotfile.discount.value = value;
			kotfile.discount.reference = '';
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Discount of <i class="fa fa-inr"></i>'+totalDiscount+' Applied', '#27ae60');
		        	generateBillFromKOT(kotID);
		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	
}



function changeDiscountTypeBillingOptions(){
	roughCalculateDiscount();
}

function roughCalculateDiscount(){

	var tempTotal = parseFloat(document.getElementById("grandSumDisplay").innerHTML);
	var discValue = parseFloat(document.getElementById("applyBillDiscountWindow_value").value);

	if(document.getElementById("applyBillDiscountWindow_value").value == ''){
		discValue = 0;
	}

	/*Calculations*/
	var roughDiscFigure = 0;
	if(document.getElementById("applyBillDiscountWindow_unit").value == 'PERCENTAGE'){
		roughDiscFigure = tempTotal*discValue/100;
	}
	else{
		roughDiscFigure = discValue;
	}

	roughDiscFigure = Math.round(roughDiscFigure * 100) / 100;

	document.getElementById("applyBillDiscountWindow_amount").innerHTML = roughDiscFigure;
}

function closeApplyBillDiscountWindow(kotID){
	
	/*Change apply button action*/
	document.getElementById("applyBillDiscountButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton breakWord" id="applyBillDiscountButton" onclick="openApplyBillDiscountWindow(\''+kotID+'\')">Apply Discount</button>';

	document.getElementById("applyBillDiscountWindow").classList.remove('billOptionWindowFrame');
	document.getElementById("applyBillDiscountWindowActions").style.display = 'none';	

	document.getElementById("applyBillDiscountButton").classList.remove('btn-success');
	document.getElementById("applyBillDiscountButton").classList.add('btn-remove');
}







/*APPLY EXTRA CHARGES*/

function openApplyCustomExtraWindow(kotID){

    if(fs.existsSync('./data/static/billingparameters.json')) {
        fs.readFile('./data/static/billingparameters.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var modes = JSON.parse(data);
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

	        for (var i=0; i<modes.length; i++){
	        	if(i == 0)
	          		modesTag = '<option value="'+modes[i].name+'" selected="selected">'+modes[i].name+'</option>';
	          	else
	          		modesTag = modesTag + '<option value="'+modes[i].name+'">'+modes[i].name+'</option>';
	        }

	        if(!modesTag)
	          document.getElementById("applyCustomExtraWindow_type").innerHTML = '<option value="OTHER" selected="selected">Other</option>';
	        else
	          document.getElementById("applyCustomExtraWindow_type").innerHTML = modesTag;

	      /*Change apply button action*/
	      document.getElementById("applyCustomExtraButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyCustomExtraButton" onclick="applyCustomExtraOnKOT(\''+kotID+'\')">Add Extra Charges</button>';
    }
    });
      } else {
        showToast('System Error: Unable to read Billing Parameters data. Please contact Accelerate Support.', '#e74c3c');
      } 

	document.getElementById("applyCustomExtraWindow").classList.add('billOptionWindowFrame');
	document.getElementById("applyCustomExtraWindowActions").style.display = 'block';
	document.getElementById("applyCustomExtraButton").classList.remove('btn-default');
	document.getElementById("applyCustomExtraButton").classList.add('btn-success');

}


function removeCustomExtraOnKOT(kotID){

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

			if(kotfile.customExtras.amount){
				kotfile.customExtras = {};
			}
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Extra Charge removed', '#27ae60');
		           	generateBillFromKOT(kotID);

		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	
}


function applyCustomExtraOnKOT(kotID){

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

          /*Calculate Discount*/
          var type = document.getElementById("applyCustomExtraWindow_type").value;
          var unit = document.getElementById("applyCustomExtraWindow_unit").value;
          var value = document.getElementById("applyCustomExtraWindow_value").value;

          var grandSum = 0;

          var n = 0;
          while(kotfile.cart[n]){
          	grandSum = grandSum + (kotfile.cart[n].price * kotfile.cart[n].qty);
          	n++;
          }

          	var totalExtraCharge = 0;
			if(unit == 'PERCENTAGE'){
				totalExtraCharge = grandSum*value/100;
			}
			else if(unit == 'FIXED'){
				totalExtraCharge = value;
			}

			totalExtraCharge = Math.round(totalExtraCharge * 100) / 100;


			kotfile.customExtras.amount = totalExtraCharge;
			kotfile.customExtras.type = type;
			kotfile.customExtras.unit = unit;
			kotfile.customExtras.value = value;
			kotfile.customExtras.reference = '';
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast(type+' of <i class="fa fa-inr"></i>'+totalExtraCharge+' added', '#27ae60');
		        	generateBillFromKOT(kotID);
		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	
	
}


function closeApplyCustomExtraWindow(kotID){
	
	/*Change apply button action*/
	document.getElementById("applyCustomExtraButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton breakWord" id="applyCustomExtraButton" onclick="openApplyCustomExtraWindow(\''+kotID+'\')">Add Extra Charge</button>';

	document.getElementById("applyCustomExtraWindow").classList.remove('billOptionWindowFrame');
	document.getElementById("applyCustomExtraWindowActions").style.display = 'none';	

	document.getElementById("applyCustomExtraButton").classList.remove('btn-success');
	document.getElementById("applyCustomExtraButton").classList.add('btn-remove');
}


function changeCustomExtraTypeOptions(){
	roughCalculateCustomExtraValue();
}

function roughCalculateCustomExtraValue(){

	var tempTotal = parseFloat(document.getElementById("grandSumDisplay").innerHTML);
	var extraChargeValue = parseFloat(document.getElementById("applyCustomExtraWindow_value").value);

	console.log(tempTotal+'     '+extraChargeValue)

	if(document.getElementById("applyCustomExtraWindow_value").value == ''){
		extraChargeValue = 0;
	}

	/*Calculations*/
	var roughFigure = 0;
	if(document.getElementById("applyCustomExtraWindow_unit").value == 'PERCENTAGE'){
		roughFigure = tempTotal*extraChargeValue/100;
	}
	else{
		roughFigure = extraChargeValue;
	}

	roughFigure = Math.round(roughFigure * 100) / 100;

	document.getElementById("applyCustomExtraWindow_amount").innerHTML = roughFigure;
}





/* NO COST BILL */

function openMarkNoCostBill(kotID){
	/*Change apply button action*/
	document.getElementById("applyNoCostBillButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyNoCostBillButton" onclick="markNoCostBill(\''+kotID+'\')">Confirm</button>';

	//minimize all other open windows
	//closeApplyBillCouponWindow(kotID);
	//closeApplyBillDiscountWindow(kotID);

	document.getElementById("applyNoCostBillWindow").classList.add('billOptionWindowFrame');
	document.getElementById("applyNoCostBillWindowActions").style.display = 'block';
	document.getElementById("applyNoCostBillButton").classList.remove('btn-default');
	document.getElementById("applyNoCostBillButton").classList.add('btn-success');

}

function closeApplyNoCostBillWindow(kotID){
	/*Change apply button action*/
	document.getElementById("applyNoCostBillButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton breakWord" id="applyNoCostBillButton" onclick="openMarkNoCostBill(\''+kotID+'\')">No Cost Bill</button>';

	document.getElementById("applyNoCostBillWindow").classList.remove('billOptionWindowFrame');
	document.getElementById("applyNoCostBillWindowActions").style.display = 'none';	

	document.getElementById("applyNoCostBillButton").classList.remove('btn-success');
	document.getElementById("applyNoCostBillButton").classList.add('btn-remove');

}


function markNoCostBill(kotID){ //APPLY FULL DISCOUNT

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

          /*Calculate Discount*/
          var comments = document.getElementById("applyNoCostBillWindow_comments").value;

          if(comments == ''){
          	showToast('Warning: Add some comments why you are marking this order as No Cost Bill', '#e67e22');
          	return '';
          }

          var grandSum = 0;

          var n = 0;
          while(kotfile.cart[n]){
          	grandSum = grandSum + (kotfile.cart[n].price * kotfile.cart[n].qty);
          	n++;
          }

          var otherExtras = 0;
          var m = 0;
          while(kotfile.extras[m]){
          	otherExtras += kotfile.extras[m].amount;
          	m++;
          }

          var o = 0;
          while(kotfile.customExtras[o]){
          	otherExtras += kotfile.customExtras[0].amount;
          	o++;
          }

          	var totalDiscount = grandSum + otherExtras;

			kotfile.discount.amount = totalDiscount;
			kotfile.discount.type = 'NOCOSTBILL';
			kotfile.discount.unit = 'FIXED';
			kotfile.discount.value = totalDiscount;
			kotfile.discount.reference = comments;
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Marked as No Cost Bill with a discount of <i class="fa fa-inr"></i>'+totalDiscount, '#27ae60');
		        	generateBillFromKOT(kotID);
		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	
}

function removeNoCostBillOnKOT(kotID){
	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

			if(kotfile.discount.amount){
				kotfile.discount = {};
			}
		       
		       var newjson = JSON.stringify(kotfile);
		       fs.writeFile('./data/KOT/'+kotID+'.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to make changes. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Removed No Cost Bill', '#27ae60');
		           	generateBillFromKOT(kotID);

		        	}
		       }); 			

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

}


function hideBillPreviewModal(){
	document.getElementById("billPreviewModal").style.display = 'none';
}