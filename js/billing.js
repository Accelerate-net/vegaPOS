
function generateBillFromKOT(kotID, optionalPageRef){

/*
  optionalPageRef -- from which page the function is called.
  Based on this info, let us execute callback functions after generateBillFromKOT are executed. 
*/

  if(!optionalPageRef){
    optionalPageRef = '';
  }


  //If there is any change in customer data w.r.t OriginalKOT, do make the changes now;
  var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};
  if(jQuery.isEmptyObject(customerInfo)){
    showToast('Customer Details missing', '#e74c3c');
    return '';
  } 


  /*Read mentioned KOT - kotID*/

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          if(kotfile.customerName != customerInfo.name || kotfile.customerMobile != customerInfo.mobile || kotfile.guestCount != customerInfo.count){
            console.log('KOT not updated on server.. please update me ***')
            kotfile.customerName = customerInfo.name;
            kotfile.customerMobile = customerInfo.mobile;
            kotfile.guestCount = customerInfo.count ? customerInfo.count : '';

            generateBillSuccessCallback('CHANGE_CUSTOMERINFO', optionalPageRef, kotfile); 
          }

          generateBillFromKOTAfterProcess(kotfile, optionalPageRef);
          
        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}

function properRoundOff(amount){
  return Math.round(amount);
}



function generateBillFromKOTAfterProcess(kotfile, optionalPageRef){

/*
  optionalPageRef -- from which page the function is called.
  Based on this info, let us execute callback functions after generateBillFromKOT are executed. 
*/

          document.getElementById("billPreviewContentTitle").innerHTML = kotfile.orderDetails.modeType == 'DINE' ? 'Table <b>'+kotfile.table+'</b> <tag style="float: right">#'+kotfile.KOTNumber+'</tag>' : kotfile.orderDetails.mode+'<tag style="float: right">#'+kotfile.KOTNumber+'</tag>';

          var itemList = '';
          var subTotal = 0;
          var qtySum = 0;
          var grandPayableSum = 0;
          var grandPayableSumRounded = 0;

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



          //Auto Calculate Discount (for Prepaid Orders from App) 
          /* 
            Classify those as 'Zaitoon App' discounts which are pre-applied discounts 
            Condition: No other discount applied.
          */

          if(!kotfile.discount.amount ||  kotfile.discount.amount == 0){
            if(kotfile.orderDetails.isOnline){
              if(kotfile.orderDetails.onlineOrderDetails.preDiscount && kotfile.orderDetails.onlineOrderDetails.preDiscount != 0){
                savePrediscountToKOT(kotfile.KOTNumber, kotfile.orderDetails.onlineOrderDetails.preDiscount, optionalPageRef);
                return '';
              }
            }
          }



          //Discount
          var discountTag = '';
          if(kotfile.discount.amount && kotfile.discount.amount != 0){
            discountTag = '<td width="35%" class="cartSummaryRow">Discount '+(kotfile.discount.unit == 'PERCENTAGE' ? '('+kotfile.discount.value+'%)' : kotfile.discount.unit == 'FIXED' ? '(<i class="fa fa-inr"></i>'+kotfile.discount.value+')' : '')+'</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px; color: #e74c3c !important">- <i class="fa fa-inr"></i>'+kotfile.discount.amount+'</td>';
            //'<tr class="info"><td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px; color: #e74c3c !important">- <i class="fa fa-inr"></i>'+kotfile.discount.amount+'</td>';
            otherChargesSum = otherChargesSum - kotfile.discount.amount;
          }
          else{
            discountTag = '<td width="35%" class="cartSummaryRow">Discount</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;">0</td>';
          }



          //Customisable Extras
          var customExtraTag = '';
          if(kotfile.customExtras.amount &&  kotfile.customExtras.amount != 0){
            customExtraTag = '<td width="35%" class="cartSummaryRow">'+kotfile.customExtras.type+' ('+(kotfile.customExtras.unit == 'PERCENTAGE'? kotfile.customExtras.value+'%' : '<i class="fa fa-inr"></i>'+kotfile.customExtras.value)+')</td><td width="15%" class="text-right cartSummaryRow" style="padding-right:10px;"><i class="fa fa-inr"></i>'+kotfile.customExtras.amount+'</td>';
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
          grandPayableSum = Math.round(grandPayableSum * 100) / 100;
          grandPayableSumRounded = properRoundOff(grandPayableSum);

          var discountButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type != 'COUPON' && kotfile.discount.type != 'NOCOSTBILL' && kotfile.discount.type != 'VOUCHER' && kotfile.discount.type != 'REWARDS'){ /*Discount is Applied Already*/
            discountButtonPart ='                        <div class="">'+
                '                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeBillDiscountOnKOT(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Remove Discount</button>'+
                '                        </div>';
          } 
          else{           
            discountButtonPart ='        <div class="" id="applyBillDiscountWindow">'+
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
                '                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyBillDiscountWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Cancel</button>'+
                '                          </div>'+
                '                          <div id="applyBillDiscountButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyBillDiscountButton" onclick="openApplyBillDiscountWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Apply Discount</button></div>'+
                '                        </div>';
          }


          var couponButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type == 'COUPON'){ /*Coupon is Applied Already*/           
            couponButtonPart ='                          <div class="">'+
                '                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeBillCouponOnKOT(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Remove Coupon</button>'+
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
                '                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyBillCouponWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Cancel</button> '+
                '                          </div>'+
                '                          <div id="applyBillCouponButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyBillCouponButton" onclick="openApplyBillCouponWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Apply Coupon</button></div>'+
                '                        </div>';
          }


          var noCostButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type == 'NOCOSTBILL'){ /*No Cost is Applied Already*/          
            noCostButtonPart ='                          <div class="">'+
                '                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeNoCostBillOnKOT(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Remove No Cost Bill</button>'+
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
                '                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyNoCostBillWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Cancel</button> '+
                '                          </div>'+
                '                          <div id="applyNoCostBillButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyNoCostBillButton" onclick="openMarkNoCostBill(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">No Cost Bill</button></div>'+
                '                        </div>';
          }



          var rewardsButtonPart = '';
          if(kotfile.discount.amount && kotfile.discount.type == 'REWARDS'){ /*Rewards is Applied Already*/           
            rewardsButtonPart = '        <div class="">'+
                '                          <button class="btn btn-danger tableOptionsButton breakWord" id="applyRewardPointsButton" onclick="removeRewardsOnKOT(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Remove Reward Points</button>'+
                '                        </div>';
          }   
          else{         
            rewardsButtonPart = '        <div class="">'+
                '                          <button class="btn btn-default tableOptionsButton breakWord" id="applyRewardPointsButton" onclick="redeemPointsIfAny(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Redeem Points</button>'+
                '                        </div>';
          }




          var customExtrasButtonPart = '';
          if(kotfile.customExtras.amount && kotfile.customExtras.amount != ''){ /*Custom Extra is Applied Already*/
            customExtrasButtonPart ='                        <div class="">'+
                '                          <button class="btn btn-danger tableOptionsButton breakWord" onclick="removeCustomExtraOnKOT(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Remove '+kotfile.customExtras.type+'</button>'+
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
                '                              <button class="btn btn-default tableOptionsButton breakWord" onclick="closeApplyCustomExtraWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Cancel</button> '+
                '                          </div>'+
                '                          <div id="applyCustomExtraButtonWrap"><button class="btn btn-default tableOptionsButton breakWord" id="applyCustomExtraButton" onclick="openApplyCustomExtraWindow(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Add Extra Charges</button></div>'+
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
                '                                 <td colspan="2" class="cartSumRow" style="font-weight: 400 !important; font-size: 14px;">Total Amount</td>'+
                '                                 <td class="text-right cartSumRow" colspan="2" style="font-weight: 400 !important; font-size: 80%;"><span id="total-payable"><i class="fa fa-inr"></i><tag>'+grandPayableSum+'</tag></span></td>'+
                '                              </tr>'+
                '                              <tr class="success cartSumRow">'+
                '                                 <td colspan="2" class="cartSumRow" style="font-weight: 400 !important; font-size: 16px;">Payable Amount</td>'+
                '                                 <td class="text-right cartSumRow" colspan="2"><span id="total-payable"><i class="fa fa-inr"></i><tag>'+grandPayableSumRounded+'</tag></span></td>'+
                '                              </tr>'+
                '                           </tbody>'+
                '                        </table>                        '+
                '                    </div>'+
                '                    <div class="col-sm-4">'+
                '                        <h1 style="text-align: center; margin-top: 10px; font-size: 14px; text-transform: uppercase; font-weight: 400; color: #444">Options</h1>'+discountButtonPart+couponButtonPart+customExtrasButtonPart+rewardsButtonPart+noCostButtonPart+
                '                        <div class="">'+
                '                          <button class="btn btn-default tableOptionsButton breakWord" onclick="renderPage(\'seating-status\'); hideBillPreviewModal();">Merge Bills</button>'+
                '                        </div>'+
                '                    </div>'+
                '                </div>';

          document.getElementById("billPreviewContentActions").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" onclick="confirmBillGeneration(\''+kotfile.KOTNumber+'\', \''+optionalPageRef+'\')">Generate Bill</button>'+
                            '<button style="margin: 0" class="btn btn-default tableOptionsButton breakWord" onclick="hideBillPreviewModal()">Close</button>'

          document.getElementById("billPreviewModal").style.display = 'block';
}



/* APPLY COUPON */

function openApplyBillCouponWindow(kotID, optionalPageRef){

  /*Change apply button action*/
  document.getElementById("applyBillCouponButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyBillCouponButton" onclick="applyBillCouponOnKOT(\''+kotID+'\', \''+optionalPageRef+'\')">Apply Discount</button>';

  //minimize all other open windows
  //closeApplyBillDiscountWindow(kotID);
  //closeApplyNoCostBillWindow(kotID);

  document.getElementById("applyBillCouponWindow").classList.add('billOptionWindowFrame');
  document.getElementById("applyBillCouponWindowActions").style.display = 'block';
  document.getElementById("applyBillCouponButton").classList.remove('btn-default');
  document.getElementById("applyBillCouponButton").classList.add('btn-success');

  $('#applyBillCouponWindow_code').focus();
  $('#applyBillCouponWindow_code').select();

}


function removeBillCouponOnKOT(kotID, optionalPageRef){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          if(kotfile.discount.amount){
            kotfile.discount = {};
          }

          /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Coupon removed', '#27ae60');
                      generateBillFromKOT(kotID, optionalPageRef);
                      generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);

                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 

}


function applyBillCouponOnKOT(kotID, optionalPageRef){


    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

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

          showLoading(10000, 'Applying Coupon');

          $.ajax({
            type: 'POST',
            url: 'https://www.zaitoon.online/services/posredeemcoupon.php',
            data: JSON.stringify(admin_data),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
              hideLoading();
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
                       

                      /*Save changes in KOT*/
                      //Update
                      var updateData = kotfile;

                      $.ajax({
                        type: 'PUT',
                        url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                        data: JSON.stringify(updateData),
                        contentType: "application/json",
                        dataType: 'json',
                        timeout: 10000,
                        success: function(data) {
                          showToast('Discount of <i class="fa fa-inr"></i>'+totalDiscount+' Applied', '#27ae60');
                          generateBillFromKOT(kotID, optionalPageRef);
                          generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                        },
                        error: function(data) {
                            showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
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
          },
          error: function(data){
            hideLoading();
            showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
          }
          });   
          //End - Redeem


        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 


}


function closeApplyBillCouponWindow(kotID, optionalPageRef){
  
  /*Change apply button action*/
  document.getElementById("applyBillCouponButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton" id="applyBillCouponButton" onclick="openApplyBillCouponWindow(\''+kotID+'\', \''+optionalPageRef+'\')">Apply Coupon</button>';

  document.getElementById("applyBillCouponWindow").classList.remove('billOptionWindowFrame');
  document.getElementById("applyBillCouponWindowActions").style.display = 'none'; 

  document.getElementById("applyBillCouponButton").classList.remove('btn-success');
  document.getElementById("applyBillCouponButton").classList.add('btn-remove');
}





/*APPLY DISCOUNT*/

function openApplyBillDiscountWindow(kotID, optionalPageRef){

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
              document.getElementById("applyBillDiscountButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyBillDiscountButton" onclick="applyBillDiscountOnKOT(\''+kotID+'\', \''+optionalPageRef+'\')">Apply Discount</button>';
        
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


  //minimize all other open windows
  //closeApplyBillCouponWindow(kotID);
  //closeApplyNoCostBillWindow(kotID);


  document.getElementById("applyBillDiscountWindow").classList.add('billOptionWindowFrame');
  document.getElementById("applyBillDiscountWindowActions").style.display = 'block';
  document.getElementById("applyBillDiscountButton").classList.remove('btn-default');
  document.getElementById("applyBillDiscountButton").classList.add('btn-success');

  $('#applyBillDiscountWindow_value').focus();
  $('#applyBillDiscountWindow_value').select();

}


function removeBillDiscountOnKOT(kotID, optionalPageRef){


    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          if(kotfile.discount.amount){
            kotfile.discount = {};
          }

          /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;
                
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                    showToast('Discount removed', '#27ae60');
                    generateBillFromKOT(kotID, optionalPageRef);
                    generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                  
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}


function applyBillDiscountOnKOT(kotID, optionalPageRef){

    var billing_modes = window.localStorage.billingModesData ? JSON.parse(window.localStorage.billingModesData): [];

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

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

          //Cross Check if it matches with the BILLING MODE Restriction of Discounts
          var g = 0;
          var maximumReached = false;
          while(billing_modes[g]){
            if(billing_modes[g].name == kotfile.orderDetails.mode){

              if(!billing_modes[g].isDiscountable){
                showToast('Error: Discount can not be applied on </b>'+billing_modes[g].name+'</b> orders', '#e74c3c');
                return '';
              }
              else{
                if(totalDiscount > billing_modes[g].maxDiscount){
                  totalDiscount = billing_modes[g].maxDiscount;
                  maximumReached = true;
                }
              }
              break;
            }
            g++;
          }


          kotfile.discount.amount = totalDiscount;
          kotfile.discount.type = type;
          kotfile.discount.unit = unit;
          kotfile.discount.value = value;
          kotfile.discount.reference = '';

          /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                    if(maximumReached){
                      showToast('Warning: Maximum discount (Rs. '+billing_modes[g].maxDiscount+') for </b>'+billing_modes[g].name+'</b> order reached', '#e67e22');
                    }
                    else{
                      showToast('Discount of <i class="fa fa-inr"></i>'+totalDiscount+' Applied', '#27ae60');
                    }

                    generateBillFromKOT(kotID, optionalPageRef);
                    generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 

}



function changeDiscountTypeBillingOptions(){
  roughCalculateDiscount();
}

function roughCalculateDiscount(){

  var tempTotal = parseFloat(document.getElementById("grandSumDisplay").innerHTML).toFixed(2);
  var discValue = parseFloat(document.getElementById("applyBillDiscountWindow_value").value).toFixed(2);

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

function closeApplyBillDiscountWindow(kotID, optionalPageRef){
  
  /*Change apply button action*/
  document.getElementById("applyBillDiscountButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton breakWord" id="applyBillDiscountButton" onclick="openApplyBillDiscountWindow(\''+kotID+'\', \''+optionalPageRef+'\')">Apply Discount</button>';

  document.getElementById("applyBillDiscountWindow").classList.remove('billOptionWindowFrame');
  document.getElementById("applyBillDiscountWindowActions").style.display = 'none'; 

  document.getElementById("applyBillDiscountButton").classList.remove('btn-success');
  document.getElementById("applyBillDiscountButton").classList.add('btn-remove');
}



/*APPLY EXTRA CHARGES*/

function openApplyCustomExtraWindow(kotID, optionalPageRef){

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
              document.getElementById("applyCustomExtraButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyCustomExtraButton" onclick="applyCustomExtraOnKOT(\''+kotID+'\', \''+optionalPageRef+'\')">Add Extra Charges</button>';
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

    document.getElementById("applyCustomExtraWindow").classList.add('billOptionWindowFrame');
    document.getElementById("applyCustomExtraWindowActions").style.display = 'block';
    document.getElementById("applyCustomExtraButton").classList.remove('btn-default');
    document.getElementById("applyCustomExtraButton").classList.add('btn-success');


  $('#applyCustomExtraWindow_value').focus();
  $('#applyCustomExtraWindow_value').select();

}


function removeCustomExtraOnKOT(kotID, optionalPageRef){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          if(kotfile.customExtras.amount){
            kotfile.customExtras = {};
          }

          /*Save changes in KOT*/
              
                //Update
                var updateData = kotfile;

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Extra Charge removed', '#27ae60');
                      generateBillFromKOT(kotID, optionalPageRef);
                      generateBillSuccessCallback('CHANGE_CUSTOMEXTRA', optionalPageRef, kotfile);
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}


function savePrediscountToKOT(kotID, amount, optionalPageRef){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

              var kotfile = data.docs[0];

              kotfile.discount.amount = amount;
              kotfile.discount.type = 'Zaitoon App';
              kotfile.discount.unit = 'FIXED';
              kotfile.discount.value = amount;
              kotfile.discount.reference = 'App Pre-applied Discount';
                       
                
                //Update
                var updateData = kotfile;

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                          showToast('Discount of <i class="fa fa-inr"></i>'+amount+' pre-applied.', '#27ae60');
                          generateBillFromKOT(kotID, optionalPageRef);
                          generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}



function applyCustomExtraOnKOT(kotID, optionalPageRef){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

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
           

          /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast(type+' of <i class="fa fa-inr"></i>'+totalExtraCharge+' added', '#27ae60');
                      generateBillFromKOT(kotID, optionalPageRef);
                      generateBillSuccessCallback('CHANGE_CUSTOMEXTRA', optionalPageRef, kotfile);
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}


function closeApplyCustomExtraWindow(kotID, optionalPageRef){
  
  /*Change apply button action*/
  document.getElementById("applyCustomExtraButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton breakWord" id="applyCustomExtraButton" onclick="openApplyCustomExtraWindow(\''+kotID+'\', \''+optionalPageRef+'\')">Add Extra Charge</button>';

  document.getElementById("applyCustomExtraWindow").classList.remove('billOptionWindowFrame');
  document.getElementById("applyCustomExtraWindowActions").style.display = 'none';  

  document.getElementById("applyCustomExtraButton").classList.remove('btn-success');
  document.getElementById("applyCustomExtraButton").classList.add('btn-remove');
}


function changeCustomExtraTypeOptions(){
  roughCalculateCustomExtraValue();
}

function roughCalculateCustomExtraValue(){

  var tempTotal = parseFloat(document.getElementById("grandSumDisplay").innerHTML).toFixed(2);
  var extraChargeValue = parseFloat(document.getElementById("applyCustomExtraWindow_value").value).toFixed(2);

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

function openMarkNoCostBill(kotID, optionalPageRef){
  /*Change apply button action*/
  document.getElementById("applyNoCostBillButtonWrap").innerHTML = '<button class="btn btn-success tableOptionsButton breakWord" id="applyNoCostBillButton" onclick="markNoCostBill(\''+kotID+'\', \''+optionalPageRef+'\')">Confirm</button>';

  //minimize all other open windows
  //closeApplyBillCouponWindow(kotID);
  //closeApplyBillDiscountWindow(kotID);

  document.getElementById("applyNoCostBillWindow").classList.add('billOptionWindowFrame');
  document.getElementById("applyNoCostBillWindowActions").style.display = 'block';
  document.getElementById("applyNoCostBillButton").classList.remove('btn-default');
  document.getElementById("applyNoCostBillButton").classList.add('btn-success');


  $('#applyNoCostBillWindow_comments').focus();
  $('#applyNoCostBillWindow_comments').select();

  
}

function closeApplyNoCostBillWindow(kotID, optionalPageRef){
  /*Change apply button action*/
  document.getElementById("applyNoCostBillButtonWrap").innerHTML = '<button class="btn btn-default tableOptionsButton breakWord" id="applyNoCostBillButton" onclick="openMarkNoCostBill(\''+kotID+'\', \''+optionalPageRef+'\')">No Cost Bill</button>';

  document.getElementById("applyNoCostBillWindow").classList.remove('billOptionWindowFrame');
  document.getElementById("applyNoCostBillWindowActions").style.display = 'none'; 

  document.getElementById("applyNoCostBillButton").classList.remove('btn-success');
  document.getElementById("applyNoCostBillButton").classList.add('btn-remove');

}


function markNoCostBill(kotID, optionalPageRef){ //APPLY FULL DISCOUNT

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

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


                /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;
                
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                      showToast('Marked as No Cost Bill with a discount of <i class="fa fa-inr"></i>'+totalDiscount, '#27ae60');
                      generateBillFromKOT(kotID, optionalPageRef);
                      generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                  
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });    
}

function removeNoCostBillOnKOT(kotID, optionalPageRef){


    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          if(kotfile.discount.amount){
            kotfile.discount = {};
          }

          /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;
                
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Removed No Cost Bill', '#27ae60');
                      generateBillFromKOT(kotID, optionalPageRef);
                      generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}


/* REDEEM POINTS */

function redeemPointsIfAny(kotID, optionalPageRef){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          var userMobile = kotfile.customerMobile;
          var grandSum = 0;

          var n = 0;
          while(kotfile.cart[n]){
            grandSum = grandSum + (kotfile.cart[n].price * kotfile.cart[n].qty);
            n++;
          }



        /*Redeem Points*/
        
        var admin_data = {
          "token": window.localStorage.loggedInAdmin,
          "mobile": userMobile,
          "totalBillAmount": grandSum
        }

        showLoading(10000, 'Redeeming Points');

        $.ajax({
          type: 'POST',
          url: 'https://www.zaitoon.online/services/posredeempoints.php',
          data: JSON.stringify(admin_data),
          contentType: "application/json",
          dataType: 'json',
          timeout: 10000,
          success: function(data) {
            hideLoading();
            if(data.status){

              /*Apply Redeemed Discount*/
              if(data.isValid){
                totalDiscount = data.discount;

                totalDiscount = Math.round(totalDiscount * 100) / 100;

                kotfile.discount.amount = totalDiscount;
                kotfile.discount.type = 'REWARDS';
                kotfile.discount.unit = 'FIXED';
                kotfile.discount.value = totalDiscount;
                kotfile.discount.reference = data.referenceID;
                     
                
                  /*Save changes in KOT*/
              
                  //Update
                  var updateData = kotfile;

                  $.ajax({
                    type: 'PUT',
                    url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                    data: JSON.stringify(updateData),
                    contentType: "application/json",
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data) {
                        showToast(data.pointsRedeemed+ ' points redeemed Succesfully! Discount of <i class="fa fa-inr"></i>'+totalDiscount+' Applied', '#27ae60');
                        generateBillFromKOT(kotID, optionalPageRef);
                        generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                        
                    },
                    error: function(data) {
                        showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
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


          },
          error: function(data){
            hideLoading();
            showToast('Error! Unable to reach the Cloud Server. Check your connection.', '#e74c3c');
          }
        });   
        //End - Redeem




        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   

}


function removeRewardsOnKOT(kotID, optionalPageRef){

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];

          if(kotfile.discount.amount){
            kotfile.discount = {};
          }

          /*Save changes in KOT*/
                
                //Update
                var updateData = kotfile;
                
                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kotfile._id)+'/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                    showToast('Reward Points Discount removed', '#27ae60');
                    generateBillFromKOT(kotID, optionalPageRef);
                    generateBillSuccessCallback('CHANGE_DISCOUNT', optionalPageRef, kotfile);
                  
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update the Order. Please contact Accelerate Support.', '#e74c3c');
                  }
                }); 

        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    });     
}


function hideBillPreviewModal(){
  document.getElementById("billPreviewModal").style.display = 'none';
}




//What to do after any successful execution of Bill Options (Apply/Remove Coupon, Apply/Remove Discount etc.)
function generateBillSuccessCallback(action, optionalPageRef, modifiedKOTFile){


  if(!action || action == '' || !optionalPageRef || optionalPageRef == '' || !modifiedKOTFile){
    return '';
  }

  var alreadyEditingKOT = [];
  if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
    alreadyEditingKOT = JSON.parse(window.localStorage.edit_KOT_originalCopy);     
  }
  else{
    return '';
  }
  

  switch (optionalPageRef){
    case 'ORDER_PUNCHING':{
      /*  Replace the Discount and Custom Extras sections
        in the KOT_originalCopy */

      if(action == 'CHANGE_DISCOUNT'){
        alreadyEditingKOT.discount = modifiedKOTFile.discount;
        window.localStorage.edit_KOT_originalCopy = JSON.stringify(alreadyEditingKOT);  
        renderCustomerInfo();
      }
      else if(action == 'CHANGE_CUSTOMEXTRA'){
        alreadyEditingKOT.customExtras = modifiedKOTFile.customExtras;
        window.localStorage.edit_KOT_originalCopy = JSON.stringify(alreadyEditingKOT);  
        renderCustomerInfo();
      }
      else if(action == 'CHANGE_CUSTOMERINFO'){
        alreadyEditingKOT.customerName = modifiedKOTFile.customerName;
        alreadyEditingKOT.customerMobile = modifiedKOTFile.customerMobile;
        alreadyEditingKOT.guestCount = modifiedKOTFile.guestCount;
        window.localStorage.edit_KOT_originalCopy = JSON.stringify(alreadyEditingKOT); 

              //Update changes on Server
              var requestData = { "selector" :{ "KOTNumber": alreadyEditingKOT.KOTNumber }}

              $.ajax({
                type: 'POST',
                url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
                data: JSON.stringify(requestData),
                contentType: "application/json",
                dataType: 'json',
                timeout: 10000,
                success: function(data) {
                  if(data.docs.length > 0){
                    
                    var kot = data.docs[0];

                    kot.customerMobile = alreadyEditingKOT.customerMobile;
                    kot.customerName = alreadyEditingKOT.customerName;
                    kot.guestCount = alreadyEditingKOT.guestCount;

                          //Update on Server
                          $.ajax({
                            type: 'PUT',
                            url: COMMON_LOCAL_SERVER_IP+'zaitoon_kot/'+(kot._id)+'/',
                            data: JSON.stringify(kot),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: 10000,
                            success: function(data) {
                              console.log('Saved KOT on Server')
                            }
                          });         
                  }
                }
              });         
      }

      break;
    }
    case 'LIVE_ORDERS':{
      break;
    }
    case 'ONLINE_ORDERS':{
      break;
    }
    case 'SEATING_STATUS':{
      break;
    }
  }

}



function releaseTableAfterBillSettle(tableID, billNumber, optionalPageRef){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

            var tableMapping = data.docs[0].value;
            var timestamp = getCurrentTime('TIME');

            for(var i=0; i<tableMapping.length; i++){
              if(tableMapping[i].table == tableID){

                tableMapping[i].assigned = "";
                tableMapping[i].KOT = "";
                tableMapping[i].status = 0;
                tableMapping[i].lastUpdate = timestamp;
                
                break;
              }
            }

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_TABLES_MASTER",
                      "value": tableMapping
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        if(optionalPageRef && optionalPageRef == 'ORDER_PUNCHING'){
                          renderTables();
                        }
                        else if(optionalPageRef && optionalPageRef == 'SEATING_STATUS'){
                          preloadTableStatus();
                        }
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }

                    });             

                
          }
          else{
            showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}



/* SAMPLE BILL - Format

{
  "billNumber": "100021",
  "paymentMode": "Cash",
  "totalAmountPaid": 234.5,
  "paymentReference": "paytm",
  "KOTNumber": "KOT1228",
  "orderDetails": {
    "mode": "AC Dine",
    "modeType": "DINE",
    "reference": ""
  },
  "table": "T1",
  "customerName": "Abhijith C S",
  "customerMobile": "9043960876",
  "stewardName": "Abhijith C S",
  "stewardCode": "9043960876",
  "orderStatus": 1,
  "date": "19-03-2018",
  "timePunch": "1408",
  "timeKOT": "",
  "timeBill": "",
  "timeSettle": "",
  "cart": [{
    "name": "Malabar Chicken Biriyani",
    "price": "90",
    "isCustom": false,
    "code": "3158",
    "qty": 1
  }],
  "specialRemarks": "SPECIAL COMMENTS",
  "extras": [{
    "name": "CGST",
    "value": 5,
    "unit": "PERCENTAGE",
    "amount": 4.5
  }, {
    "name": "SGST",
    "value": 5,
    "unit": "PERCENTAGE",
    "amount": 4.5
  }, {
    "name": "Service Charge",
    "value": 50,
    "unit": "FIXED",
    "amount": 50
  }],
  "discount": {
    "amount": 9,
    "type": "Staffs Guest",
    "unit": "PERCENTAGE",
    "value": "10",
    "reference": ""
  },
  "customExtras": {
    "amount": 4.5,
    "type": "Parcel Charges",
    "unit": "PERCENTAGE",
    "value": "5",
    "reference": ""
  }
}

*/




function confirmBillGeneration(kotID, optionalPageRef){


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_BILL_INDEX" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_BILL_INDEX'){

            var billNumber = parseInt(data.docs[0].value) + 1;
            confirmBillGenerationAfterProcess(billNumber, kotID, optionalPageRef, data.docs[0]._rev)
                
          }
          else{
            showToast('Not Found Error: Bill Index data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Bill Index data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Bill Index. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


function confirmBillGenerationAfterProcess(billNumber, kotID, optionalPageRef, revID){

    var memory_id = '';
    var memory_rev = '';

    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

          var kotfile = data.docs[0];
          
          memory_id = data.docs[0]._id;
          memory_rev = data.docs[0]._rev;

          kotfile.billNumber = billNumber,
          kotfile.paymentMode = "";
          kotfile.totalAmountPaid = "";
          kotfile.paymentReference = "";


          /* BILL SUM CALCULATION */

          //Calculate Sum to be paid
          var grandPayableBill = 0;
          var n = 0;
          while(kotfile.cart[n]){
            grandPayableBill += kotfile.cart[n].price * kotfile.cart[n].qty;
            n++;
          }

          //add extras
          if(!jQuery.isEmptyObject(kotfile.extras)){
            var m = 0;
            while(kotfile.extras[m]){
              grandPayableBill += kotfile.extras[m].amount;
              m++;
            }
          } 

          //add custom extras if any
          if(!jQuery.isEmptyObject(kotfile.customExtras)){
            grandPayableBill += kotfile.customExtras.amount;
          }  


          //substract discounts if any
          if(!jQuery.isEmptyObject(kotfile.discount)){
            grandPayableBill -= kotfile.discount.amount;
          }  

          grandPayableBill = parseFloat(grandPayableBill).toFixed(2);   
          grandPayableBillRounded = properRoundOff(grandPayableBill);   

          kotfile.payableAmount = grandPayableBillRounded;
          kotfile.calculatedRoundOff = Math.round((grandPayableBillRounded - grandPayableBill) * 100) / 100;

          kotfile.timeBill = getCurrentTime('TIME');
          

          //Remove Unwanted Stuff
          delete kotfile.specialRemarks;
          delete kotfile.allergyInfo;

          var c = 0;
          while(kotfile.cart[c]){
            
            delete kotfile.cart[c].ingredients;
            delete kotfile.cart[c].comments;
            
            c++;
          }


          /*Save NEW BILL*/

            //Remove _rev and _id (KOT File Scraps!)
            var newBillFile = kotfile;
            delete newBillFile._id;
            delete newBillFile._rev

            //Post to local Server
            $.ajax({
              type: 'POST',
              url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/',
              data: JSON.stringify(newBillFile),
              contentType: "application/json",
              dataType: 'json',
              timeout: 10000,
              success: function(data) {
                if(data.ok){

                          showToast('Bill #'+billNumber+' generated Successfully', '#27ae60');

                          sendToPrinter(newBillFile, 'BILL');

                          clearAllMetaDataOfBilling();
                          hideBillPreviewModal();

                          if(kotfile.orderDetails.modeType == 'DINE'){
                            billTableMapping(kotfile.table, billNumber, 2, optionalPageRef);
                          }
                          
                          deleteKOTFromServer(memory_id, memory_rev);

                          //If an online order ==> Update Mapping
                          if(kotfile.orderDetails.isOnline){
                            //Skip this step, if auto settle for PREPAID orders
                            if(kotfile.orderDetails.onlineOrderDetails.paymentMode != 'PREPAID'){  
                              updateOnlineOrderMapping(kotfile, 'GENERATE', optionalPageRef);
                            }
                          }


                          if(optionalPageRef == 'ORDER_PUNCHING'){
                            renderCustomerInfo();
                            if(kotfile.orderDetails.modeType != 'DINE'){
                              //Pop up bill settlement window
                              settleBillAndPush(encodeURI(JSON.stringify(kotfile)), 'ORDER_PUNCHING');
                            }
                          }
                          else if(optionalPageRef == 'ONLINE_ORDERS'){
                            if(kotfile.orderDetails.isOnline){
                              //Already updated in updateOnlineOrderMapping() call.
                              if(kotfile.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID'){
                                preSettleBill(newBillFile.billNumber, 'ONLINE_ORDERS');
                              }

                            }
                            else{
                              renderLiveOnlineOrders();
                            }
                          }
                          else if(optionalPageRef == 'SEATING_STATUS'){
                            //Already handled inside billTableMapping() call
                          }
                          else if(optionalPageRef == 'LIVE_ORDERS'){
                            //Already handled inside billTableMapping() call
                          }

                          //Update bill number on server
                          var updateData = {
                            "_rev": revID,
                            "identifierTag": "ZAITOON_BILL_INDEX",
                            "value": billNumber
                          }

                          $.ajax({
                            type: 'PUT',
                            url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_BILL_INDEX/',
                            data: JSON.stringify(updateData),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: 10000,
                            success: function(data) {
                              
                            },
                            error: function(data) {
                              showToast('System Error: Unable to update Billing Index. Next Bill Number might be faulty. Please contact Accelerate Support.', '#e74c3c');
                            }

                          });  
                }
                else{
                  showToast('Warning: Bill was not Generated. Try again.', '#e67e22');
                }
              },
              error: function(data){           
                showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
              }
            });  
            //End - post KOT to Server



        }
        else{
          showToast('Not Found Error: Order #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read the Order. Please contact Accelerate Support.', '#e74c3c');
      }

    });    
}




function deleteKOTFromServer(id, revID){
    $.ajax({
      type: 'DELETE',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/'+id+'?rev='+revID,
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
      
      },
      error: function(data) {
        showToast('Server Warning: Unable to modify Order KOT. Please contact Accelerate Support.', '#e67e22');
      }
    }); 
}

function deleteBillFromServer(billNumber){

                  billNumber = parseInt(billNumber);


                  var requestData = { "selector" :{ "billNumber": billNumber }, "fields" : ["_id", "_rev"] }

                  $.ajax({
                    type: 'POST',
                    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_find',
                    data: JSON.stringify(requestData),
                    contentType: "application/json",
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data) {
                      if(data.docs.length > 0){

                        //Proceed to Delete
                        $.ajax({
                          type: 'DELETE',
                          url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/'+data.docs[0]._id+'?rev='+data.docs[0]._rev,
                          contentType: "application/json",
                          dataType: 'json',
                          timeout: 10000,
                          success: function(data) {
                          
                          },
                          error: function(data) {
                            showToast('Server Warning: Unable to modify bill data. Please contact Accelerate Support.', '#e67e22');
                          }
                        }); 

                      }
                      else{
                        showToast('Server Warning: Unable to modify bill data. Please contact Accelerate Support.', '#e67e22');
                      }
                    },
                    error: function(data) {
                      showToast('Server Warning: Unable to modify bill data. Please contact Accelerate Support.', '#e67e22');
                    }

                  });

}




function clearAllMetaDataOfBilling(){
  //to remove cart info, customer info
  var customerInfo = window.localStorage.customerData ?  JSON.parse(window.localStorage.customerData) : {};

  customerInfo.name = "";
  customerInfo.mobile = "";
  customerInfo.mappedAddress = "";
  customerInfo.reference = "";
  customerInfo.count = "";
  customerInfo.isOnline = false;

  window.localStorage.customerData = JSON.stringify(customerInfo);
  window.localStorage.zaitoon_cart = '';
  window.localStorage.userAutoFound = '';
  window.localStorage.userDetailsAutoFound = '';

  window.localStorage.specialRequests_comments = '';
  window.localStorage.allergicIngredientsData = '';

  window.localStorage.edit_KOT_originalCopy = '';
}



/* SETTLE BILL */
function settleBillAndPush(encodedBill, optionalPageRef){

  var bill = JSON.parse(decodeURI(encodedBill));

  //Check if Prepaid Order ==> If YES, auto-settle
  if(bill.orderDetails.isOnline && bill.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID'){
    settleBillAndPushAuto(bill, optionalPageRef);
    return '';
  }

  //Calculate Sum to be paid
  var grandPayableBill = 0;
  var n = 0;
  while(bill.cart[n]){
    grandPayableBill += bill.cart[n].price * bill.cart[n].qty;
    n++;
  }

  //add extras
  if(!jQuery.isEmptyObject(bill.extras)){
    var m = 0;
    while(bill.extras[m]){
      grandPayableBill += bill.extras[m].amount;
      m++;
    }
  } 

  //add custom extras if any
  if(!jQuery.isEmptyObject(bill.customExtras)){
    grandPayableBill += bill.customExtras.amount;
  }  


  //substract discounts if any
  if(!jQuery.isEmptyObject(bill.discount)){
    grandPayableBill -= bill.discount.amount;
  }  

  grandPayableBill = parseFloat(grandPayableBill).toFixed(2);
  grandPayableBill = properRoundOff(grandPayableBill);  

  window.localStorage.billSettleSplitPlayHoldList = '';

  document.getElementById("billSettlementDetailsModal").style.display = 'block';
  document.getElementById("billSettlementPreviewContentTitle").innerHTML = 'Settle Bill <b>#'+bill.billNumber+'</b>'+ (bill.orderDetails.modeType == 'DINE' ? '<tag style="float: right">Table <b>#'+bill.table+'</b></tag>' : '') + (bill.orderDetails.modeType == 'TOKEN' ? '<tag style="float: right">Token <b>#'+bill.table+'</b></tag>' : '');


  var optionsList = '';


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
                showToast('No Payment Mode added yet. Please add it under Billing Settings to continue.', '#e74c3c');
                document.getElementById("billSettlementDetailsModal").style.display = 'none';
                return '';
              }

              for (var i = 0; i < modes.length; i++){
                optionsList += '<button class="btn btn-success paymentModeOption" onclick="addToSplitPay(\''+modes[i].code+'\', \''+modes[i].name+'\')" id="billPayment_'+modes[i].code+'">'+modes[i].name+'</button>';
              }

              document.getElementById("billSettlementDetailsContent").innerHTML = '<h1 style="margin-bottom: 0; text-align: center; font-size: 48px; font-weight: bold; color: #00a584;"><i class="fa fa-inr"></i><tag id="fullAmount">'+grandPayableBill+'</tag></h1>'+
                            '<p style="color: gray; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-align: center; ">Total Amount to be paid</p>'+
                            '<hr><div class="row" style="padding: 0 20px; margin: 0"><center>'+optionsList+'</center></div>';

              document.getElementById("billSettlementSplitDetailsContent").innerHTML = "";

              document.getElementById("billSettlementPreviewContentActions").innerHTML = '<div class="col-sm-4" style="padding: 0">'+
                                                               '<button type="button" class="btn btn-default" onclick="hideSettleBillAndPush()" style="width: 100%; border: none; border-radius: 0; height: 50px;">Not Now</button>'+
                                                            '</div>'+
                                                            '<div class="col-sm-8" style="padding: 0">'+
                                                                '<button type="button" class="btn btn-success" onclick="settleBillAndPushAfterProcess(\''+encodedBill+'\', \''+optionalPageRef+'\')" style="width: 100%; border: none; border-radius: 0; height: 50px;">Confirm</button>'+
                                                            '</div>';

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



function preSettleBill(billNumber, optionalPageRef){

    if(!optionalPageRef || optionalPageRef == ''){
      optionalPageRef = 'ORDER_PUNCHING';
    }

    billNumber = parseInt(billNumber);

    var requestData = { "selector" :{ "billNumber": billNumber }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){

          var billfile = data.docs[0];
          settleBillAndPush(encodeURI(JSON.stringify(billfile)), optionalPageRef);

        }
        else{
          showToast('Not Found Error: Bill #'+billNumber+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Bills data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}


function onlineOrderEasySettleBill(billNumber){

    billNumber = parseInt(billNumber);

    var requestData = { "selector" :{ "billNumber": billNumber }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){

          var billfile = data.docs[0];
          settleBillAndPush(encodeURI(JSON.stringify(billfile)), 'ONLINE_ORDERS');

        }
        else{
          showToast('Not Found Error: Bill #'+billNumber+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Bills data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}




function addToSplitPay(mode, modeName){
  
  var splitPayHoldList = window.localStorage.billSettleSplitPlayHoldList ? JSON.parse(window.localStorage.billSettleSplitPlayHoldList): [];

  var fullAmount = document.getElementById("fullAmount").innerHTML;
  if(!fullAmount || fullAmount == ''){
    fullAmount = 0;
  }
  else{
    fullAmount = parseFloat(fullAmount).toFixed(2);
  }

  /*check if already clicked*/
  var alreadyAdded = false;
  var n = 0;
  while(splitPayHoldList[n]){
    if(splitPayHoldList[n].code == mode){
      splitPayHoldList.splice(n,1);
      alreadyAdded = true;

      document.getElementById("billPayment_"+mode).innerHTML = modeName; 
        
      break;
    }
    n++;
  }

  if(!alreadyAdded){

    var j = 0;
    var cumulativeSum = 0;
    while(splitPayHoldList[j]){
      cumulativeSum += parseFloat(splitPayHoldList[j].amount);
      j++;
    }

    if(cumulativeSum > fullAmount){
      cumulativeSum = fullAmount; //To avoid negative suggestions
    }

    var differenceAmount = parseFloat((fullAmount-cumulativeSum)).toFixed(2);

    if(splitPayHoldList.length == 0)
      splitPayHoldList.push({"name": modeName, "code": mode, "amount": parseFloat(fullAmount)});
    else
      splitPayHoldList.push({"name": modeName, "code": mode, "amount": parseFloat(differenceAmount)});

    document.getElementById("billPayment_"+mode).innerHTML += ' <i class="fa fa-check"></i>';
  }


  window.localStorage.billSettleSplitPlayHoldList = JSON.stringify(splitPayHoldList);
  renderSplitPayPart(mode);
}



function renderSplitPayPart(optionalFocusCode){
 var splitPayHoldList = window.localStorage.billSettleSplitPlayHoldList ? JSON.parse(window.localStorage.billSettleSplitPlayHoldList): [];
 
  var fullAmount = document.getElementById("fullAmount").innerHTML;
  if(!fullAmount || fullAmount == ''){
    fullAmount = 0;
  }
  else{
    fullAmount = parseFloat(fullAmount).toFixed(2);
  }

  var splitTotalAmount = 0;

 if(splitPayHoldList.length > 0){

  var splitDetails = '';
  for(var i = 0; i < splitPayHoldList.length; i++){

    splitTotalAmount += parseFloat(splitPayHoldList[i].amount);

    splitDetails += '<div class="row" style="border: 1px solid #ddd; margin: 2px 15px;">'+
                        '<div class="col-sm-4 paymentModeOptionSelected">'+
                            '<p style="font-size: 18px; padding-top: 12px;">'+
                            '<tag class="paymentModeOptionSelectedDeleteButton" onclick="addToSplitPay(\''+splitPayHoldList[i].code+'\', \''+splitPayHoldList[i].name+'\')"><i class="fa fa-minus-circle"></i></tag>'+splitPayHoldList[i].name+'</p>'+
                        '</div>'+
                        '<div class="col-sm-4"> <input type="text" value="'+(splitPayHoldList[i].reference && splitPayHoldList[i].reference != ''? splitPayHoldList[i].reference : '')+'" onkeyup="adjustBillSplit(\''+splitPayHoldList[i].code+'\')" onchange="renderSplitPayPart()" placeholder="References" style="border: none; height: 43px; font-size: 16px; text-align: center;" class="form-control tip" id="billSplitComments_'+splitPayHoldList[i].code+'"/> </div>'+
                        '<div class="col-sm-4">'+
                           '<div class="form-group" style="margin-bottom: 2px">'+
                              '<input type="number" value="'+(splitPayHoldList[i].amount != ''? splitPayHoldList[i].amount : 0)+'" onkeyup="adjustBillSplit(\''+splitPayHoldList[i].code+'\')" onchange="renderSplitPayPart()" placeholder="00.00" style="border: none; height: 43px; font-size: 24px; text-align: right;" class="form-control tip" id="billSplitValue_'+splitPayHoldList[i].code+'"/>'+
                           '</div>'+
                        '</div>'+
                    '</div>'
  }


  var warningAmount = '';

  splitTotalAmount = parseFloat(splitTotalAmount).toFixed(2);

  splitTotalAmount = parseFloat(splitTotalAmount);
  fullAmount = parseFloat(fullAmount);

  if(splitTotalAmount < fullAmount){
    warningAmount = '<tag style="color: #f15959; font-weight: initial"> - '+parseFloat(fullAmount-splitTotalAmount).toFixed(2)+'</tag>';
  }
  else if(splitTotalAmount > fullAmount){
    warningAmount = '<tag style="color: #08ca08; font-weight: initial"> + '+parseFloat(splitTotalAmount-fullAmount).toFixed(2)+'</tag>';
  }
  else{
    warningAmount = '';
  }

  document.getElementById("billSettlementSplitDetailsContent").innerHTML = '<p style="color: gray; margin-top: 15px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; text-align: center; ">PAYMENT SPLIT</p>'+
                                      splitDetails + 
                                      '<div class="row" style="border: 1px solid #ddd; margin: 4px 15px; background: #eeeeee">'+
                                              '<div class="col-sm-6"> <p style="font-size: 18px; padding-top: 12px; padding-left: 20px">Grand Sum</p> </div>'+
                                              '<div class="col-sm-6">'+
                                                 '<div class="form-group" style="margin-bottom: 2px"> <p style="background: none; margin: 0; border: none; font-weight: bold; height: 43px; font-size: 24px; text-align: right;" class="form-control tip" />'+parseFloat(fullAmount).toFixed(2)+''+warningAmount+'</p> </div>'+
                                              '</div>'+
                                      '</div> '+
                                      (splitTotalAmount < fullAmount ? '<p style="margin: 0; text-align: right; margin-right: 15px; font-size: 12px; color: #f15959;">Deficit amount of <i class="fa fa-inr"></i>'+parseFloat(fullAmount-splitTotalAmount).toFixed(2)+' will be marked as Round Off</p>' : '')+
                                      (splitTotalAmount > fullAmount ? '<p style="margin: 0; text-align: right; margin-right: 15px; font-size: 12px; color: #08ca08;">Extra amount of <i class="fa fa-inr"></i>'+parseFloat(splitTotalAmount-fullAmount).toFixed(2)+' will be marked as Tips</p>' : '');
                                      

  if(!optionalFocusCode || optionalFocusCode == ''){

  }
  else{
    $("#billSplitValue_"+optionalFocusCode).focus();
    $("#billSplitValue_"+optionalFocusCode).select();
  }

 }
 else{
  document.getElementById("billSettlementSplitDetailsContent").innerHTML = "";
 }
}


function adjustBillSplit(code){

    var amountValue = document.getElementById("billSplitValue_"+code).value;
    if(!amountValue || amountValue == ''){
      amountValue = 0;
    }

    amountValue = parseFloat(amountValue).toFixed(2);
    amountValue = parseFloat(amountValue);

    var referenceValue = document.getElementById("billSplitComments_"+code).value;
    if(!referenceValue || referenceValue == ''){
      referenceValue = '';
    }


    var splitPayHoldList = window.localStorage.billSettleSplitPlayHoldList ? JSON.parse(window.localStorage.billSettleSplitPlayHoldList): [];

    var n = 0;
    while(splitPayHoldList[n]){
      if(splitPayHoldList[n].code == code){
        splitPayHoldList[n].amount = amountValue;
        splitPayHoldList[n].reference = referenceValue;
        break;
      }
      n++;
    }

    window.localStorage.billSettleSplitPlayHoldList = JSON.stringify(splitPayHoldList);
} 



function hideSettleBillAndPush(){
  window.localStorage.billSettleSplitPlayHoldList = '';
  document.getElementById("billSettlementDetailsModal").style.display = 'none';
}


//settle bill and post to local server

function settleBillAndPushAfterProcess(encodedBill, optionalPageRef){

    var bill = JSON.parse(decodeURI(encodedBill));

    var splitPayHoldList = window.localStorage.billSettleSplitPlayHoldList ? JSON.parse(window.localStorage.billSettleSplitPlayHoldList): [];

    if(splitPayHoldList.length == 0){
      showToast('Warning: Click on a Payment Method to continue', '#e67e22');
      return '';
    }

    var paymentModeSelected = '';
    if(splitPayHoldList.length > 1){
      paymentModeSelected = 'MULTIPLE';
    }
    else{
      paymentModeSelected = splitPayHoldList[0].code;

      var comments = splitPayHoldList[0].reference;
      if(comments && comments != ''){
        bill.paymentReference = comments;
      }
    }

    var splitObj = [];

    var totalSplitSum = 0;
    var n = 0;
    var actualNoZeroSplits = 0;
    while(splitPayHoldList[n]){

      if(splitPayHoldList[n].amount > 0){ //Skip Zeros
          totalSplitSum += parseFloat(splitPayHoldList[n].amount);
          splitObj.push(splitPayHoldList[n]);
          actualNoZeroSplits++;
      }
      
      n++;
    } 

    totalSplitSum = parseFloat(totalSplitSum).toFixed(2);
    totalSplitSum = parseFloat(totalSplitSum);


    //In case multiple selected but value added only for one, all others kept empty
    if(splitPayHoldList.length > 1 && actualNoZeroSplits == 1){
      paymentModeSelected = splitObj[0].code;

      var comments = splitObj[0].reference;
      if(comments && comments != ''){
        bill.paymentReference = comments;
      }      
    }   

    bill.timeSettle = getCurrentTime('TIME');
    bill.totalAmountPaid = parseFloat(totalSplitSum).toFixed(2);
    bill.paymentMode = paymentModeSelected;
    bill.dateStamp = getCurrentTime('DATE_STAMP');


    //Split Payment details
    if(paymentModeSelected == 'MULTIPLE'){
      bill.paymentSplits = splitObj;
    }



    //Compare Full Payable Amount
    var fullAmount = document.getElementById("fullAmount").innerHTML;
    if(!fullAmount || fullAmount == ''){
      fullAmount = 0;
    }
    else{
      fullAmount = parseFloat(fullAmount).toFixed(2);
    }


    var maxTolerance = fullAmount*0.05;
    if(maxTolerance < 10){
      maxTolerance = 10;
    }

    if(totalSplitSum < fullAmount && fullAmount-totalSplitSum > maxTolerance){
      showToast('Warning: Huge difference in the sum. Please make sure the split amounts are correct.', '#e67e22');
      return '';
    }

    //Round Off or Tips calculation - auto
    if(totalSplitSum < fullAmount){
      bill.roundOffAmount = parseFloat(fullAmount - totalSplitSum).toFixed(2);
      bill.roundOffAmount = parseFloat(bill.roundOffAmount);
    }

    if(totalSplitSum > fullAmount){
      bill.tipsAmount = parseFloat(totalSplitSum - fullAmount).toFixed(2);
      bill.tipsAmount = parseFloat(bill.tipsAmount);
    }

    bill.totalAmountPaid = parseFloat(bill.totalAmountPaid);


    //Clean _rev and _id (bill Scraps)
    var finalInvoice = bill;
    delete finalInvoice._id;
    delete finalInvoice._rev

          //Post to local Server
          $.ajax({
            type: 'POST',
            url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/',
            data: JSON.stringify(finalInvoice),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
              if(data.ok){
                showToast("Bill #"+bill.billNumber+" is settled successfully", '#27ae60');
                //Successfully pushed
                hideSettleBillAndPush();

                //If an online order ==> Update Mapping
                if(bill.orderDetails.isOnline){
                  console.log('Update settled...!!!!')
                  updateOnlineOrderMapping(bill, 'SETTLE', optionalPageRef);
                }                

                deleteBillFromServer(bill.billNumber);

                //Free the mapped Table
                if(bill.orderDetails.modeType == 'DINE')
                  releaseTableAfterBillSettle(bill.table, bill.billNumber, optionalPageRef)

                //re-render page
                if(optionalPageRef == 'GENERATED_BILLS'){
                  loadAllPendingSettlementBills('EXTERNAL');
                }

              }
              else{
                showToast('Warning: Bill #'+tableID+' was not Settled. Try again.', '#e67e22');
              }
            },
            error: function(data){           
              showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
            }
          });    
}


function settleBillAndPushAuto(bill, optionalPageRef){

    bill.paymentReference = "Prepaid Order";
    bill.timeSettle = getCurrentTime('TIME');
    bill.totalAmountPaid = Math.round(bill.payableAmount * 100) / 100;
    bill.paymentMode = "PREPAID";
    bill.dateStamp = getCurrentTime('DATE_STAMP');

console.log('To update AUTO SETTLE')

    //Clean _rev and _id (bill Scraps)
    var finalInvoice = bill;
    delete finalInvoice._id;
    delete finalInvoice._rev

          //Post to local Server
          $.ajax({
            type: 'POST',
            url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/',
            data: JSON.stringify(finalInvoice),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(data) {
              if(data.ok){
                showToast("Prepaid Order #"+bill.orderDetails.reference+" - bill settled automatically", '#27ae60');
                //Successfully pushed
                hideSettleBillAndPush();

                //If an online order ==> Update Mapping
                if(bill.orderDetails.isOnline){
                  updateOnlineOrderMapping(bill, 'SETTLE', optionalPageRef);
                  console.log('DOCTOR!')
                }           

                deleteBillFromServer(bill.billNumber);

                //Free the mapped Table
                if(bill.orderDetails.modeType == 'DINE')
                  releaseTableAfterBillSettle(bill.table, bill.billNumber, optionalPageRef)

                //re-render page
                if(optionalPageRef == 'GENERATED_BILLS')
                  loadAllPendingSettlementBills('EXTERNAL'); 

              }
              else{
                showToast('Warning: Bill #'+tableID+' was not Settled. Try again.', '#e67e22');
              }
            },
            error: function(data){           
              showToast('System Error: Unable to save data to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
            }
          });    
}



function updateOnlineOrderMapping(orderObject, action, optionalPageRef){

    var requestData = {
      "selector"  :{ 
                    "_id": orderObject.orderDetails.onlineOrderDetails.orderSource +'_'+orderObject.orderDetails.reference
                  }
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_online_orders/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){

              var onlineOrdersMapping = data.docs[0];

              onlineOrdersMapping.systemBill = orderObject.billNumber;

              if(action == 'GENERATE'){
                onlineOrdersMapping.systemStatus = 2;
              }
              else if(action == 'SETTLE'){
                onlineOrdersMapping.systemStatus = 3;
              }

              console.log(onlineOrdersMapping)

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_online_orders/'+orderObject.orderDetails.onlineOrderDetails.orderSource +'_'+orderObject.orderDetails.reference+'/',
                  data: JSON.stringify(onlineOrdersMapping),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      if(optionalPageRef && optionalPageRef == 'ONLINE_ORDERS'){
                        renderLiveOnlineOrders();
                      }
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Online Orders Mapping. Please contact Accelerate Support.', '#e74c3c');
                  }
                });  
        }
        else{
          showToast('Not Found Error: Online Orders Mapping data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Online Orders Mapping data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}



// BILL CANCELLATION

function initiateCancelSettledBill(billNumber, totalPaid, paymentStatus, optionalPageRef){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_CANCELLATION_REASONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_CANCELLATION_REASONS'){

              var reasonsList = data.docs[0].value;
              initiateCancelSettledBillAfterProcess(billNumber, totalPaid, paymentStatus, optionalPageRef, reasonsList);
                        
          }
          else{
            showToast('Warning: Cancellation Reasons data not found. Please contact Accelerate Support.', '#e67e22');
            var reasonsList = ["Not Satisfied"];
            initiateCancelSettledBillAfterProcess(billNumber, totalPaid, paymentStatus, optionalPageRef, reasonsList);
          }
        }
        else{
          showToast('Warning: Cancellation Reasons data not found. Please contact Accelerate Support.', '#e67e22');
          var reasonsList = ["Not Satisfied"];
          initiateCancelSettledBillAfterProcess(billNumber, totalPaid, paymentStatus, optionalPageRef, reasonsList);
        }

      },
      error: function(data) {
        showToast('Warning: Unable to read Cancellation Reasons data. Please contact Accelerate Support.', '#e67e22');
        var reasonsList = ["Not Satisfied"];
        initiateCancelSettledBillAfterProcess(billNumber, totalPaid, paymentStatus, optionalPageRef, reasonsList);
      }

    });  
}

function initiateCancelSettledBillAfterProcess(billNumber, totalPaid, paymentStatus, optionalPageRef, reasonsList){
  
  document.getElementById("billCancellationsReasonModal").style.display = 'block';
  document.getElementById("billCancellationsReasonModalActions").innerHTML = '<button class="btn btn-default" onclick="initiateCancelSettledBillHide()" style="float: left">Close</button>'+
                  '<button class="btn btn-danger" onclick="processCancelSettledBill(\''+billNumber+'\', \''+optionalPageRef+'\')" style="float: right">Proceed to Cancel</button>';

  var n = 0;
  var reasonRender = '';
  while(reasonsList[n]){
    reasonRender += '<option value="'+reasonsList[n]+'">'+reasonsList[n]+'</option>';
    n++;
  }

  document.getElementById("bill_cancel_why_reason").innerHTML = reasonRender;

  if(paymentStatus == 'PAID'){ //Order is PAID
    document.getElementById("refundCancelOrderBar").style.display = 'block';
    document.getElementById("refundCancelOrderBar").innerHTML = '<label>Refund Status</label> <select id="bill_cancel_why_isrefund" class="form-control" onchange="changeBillCancelWhyIsRefunding('+totalPaid+')"> <option value="1" selected>No Refund</option> <option value="2">Partial Refund</option> <option value="3">Full Refund</option> </select>';
    $('#bill_cancel_why_isrefund').val(1);
  }
  else{
    document.getElementById("refundCancelOrderBar").style.display = 'none';
  }

  document.getElementById("refundCancelOrderAmountBar").style.display = 'none';
  document.getElementById("refundCancelOrderModeBar").style.display = 'none';

  $('#bill_cancel_why_comments').val('');
  $('#bill_cancel_why_comments').focus();
}


function changeBillCancelWhyIsRefunding(totalPaid){
  if($('#bill_cancel_why_isrefund').val() > 1){
    document.getElementById("refundCancelOrderAmountBar").style.display = 'block';
    document.getElementById("refundCancelOrderModeBar").style.display = 'block';

    document.getElementById("bill_cancel_why_refundamount").value = totalPaid;
    $('#bill_cancel_why_refundamount').focus();
    $('#bill_cancel_why_refundamount').select();
  } 
  else{
    document.getElementById("refundCancelOrderAmountBar").style.display = 'none';
    document.getElementById("refundCancelOrderModeBar").style.display = 'none';
  }
}


function initiateCancelSettledBillHide(){
  document.getElementById("billCancellationsReasonModal").style.display = 'none';
}

function processCancelSettledBill(billNumber, optionalPageRef){

    billNumber = parseInt(billNumber);

    var current_time = getCurrentTime('TIME');
    var why_reason = $('#bill_cancel_why_reason').val();
    var why_comments = $('#bill_cancel_why_comments').val();

    var staffData = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData) : {};
    if(!staffData.name || staffData.name == ''){
      showToast('Warning! Staff information not available. Select Staff Profile and try again.', '#e67e22');
      return '';
    }

    if(why_comments == '' || why_comments.length < 3){
      showToast('Warning! Please add some comments.', '#e67e22');
      return '';      
    }

    var refund_status = 0;
    var refund_amount = '';
    var refund_mode = '';

    if(document.getElementById("refundCancelOrderBar").style.display == 'block'){
      //Discount Part
      refund_status = $('#bill_cancel_why_isrefund').val();
      
      if(refund_status > 1){
        refund_mode = $('#bill_cancel_why_refundmode').val();
        refund_amount = $('#bill_cancel_why_refundamount').val();

        if(refund_amount == 0 || refund_amount == ''){
          showToast('Warning! Please mention the Refund Amount issued.', '#e67e22');
          return '';     
        }
      }
    }


    var refund_status_flag = 5;
    if(optionalPageRef == 'GENERATED_BILLS_SETTLED'){
      refund_status_flag = 6;
    }

    refund_amount = Math.round(refund_amount * 100)/100;

    var cancelObj = {
            "timeCancel" : current_time,
            "cancelledBy" : staffData.name,
            "reason" : why_reason,
            "comments" : why_comments,
            "status" : refund_status_flag, //SETTLED BILL or PENDING BILL
            "refundStatus" : refund_status,
            "refundAmount" : refund_amount,
            "refundMode" : refund_mode
    }

    initiateCancelSettledBillHide();


    var requestURL = 'zaitoon_bills';
    var requestURLSource = 'BILL';


    if(optionalPageRef == 'GENERATED_BILLS_SETTLED'){
      requestURL = 'zaitoon_invoices';
      requestURLSource = 'INVOICE';
    }


    var requestData = { "selector" :{ "billNumber": billNumber }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/'+requestURL+'/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(firstdata) {
        if(firstdata.docs.length > 0){

          var bill = firstdata.docs[0];

          var memory_rev = firstdata.docs[0]._rev;
          var memory_id = firstdata.docs[0]._id;
          var memory_type = firstdata.docs[0].orderDetails.modeType;
          var memory_table = firstdata.docs[0].table;
          
          var cancelBillFile = bill;
          delete cancelBillFile._id;
          delete cancelBillFile._rev;

          cancelBillFile.cancelDetails = cancelObj;

          //Refund Object
          if(cancelObj.refundAmount && cancelObj.refundAmount != '' && cancelObj.refundAmount > 0){
            
            var refund_obj_mode = 'CASH';
            if(cancelObj.refundMode == 'ORIGINAL'){
              refund_obj_mode = bill.paymentMode;
            }

            cancelBillFile.refundDetails = {
              "refundAmount": cancelObj.refundAmount,
              "refundMode": refund_obj_mode
            }
          }

            deleteCancelledInvoiceFromServer(memory_id, memory_rev, memory_type, memory_table, requestURLSource, optionalPageRef);

            //Post to local Server
            $.ajax({
              type: 'POST',
              url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_invoices/',
              data: JSON.stringify(cancelBillFile),
              contentType: "application/json",
              dataType: 'json',
              timeout: 10000,
              success: function(data) {
                if(data.ok){
                  showToast('Invoice #'+billNumber+' has been Cancelled successfully', '#27ae60');
                }
                else{
                  showToast('Warning: Cancelled Invoice was not Generated. Try again.', '#e67e22');
                }
              },
              error: function(data){           
                showToast('System Error: Unable to save Cancelled Invoice to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
              }
            });  
            //End - post KOT to Server          
          
        }
        else{
          showToast('Not Found Error: Invoice #'+billNumber+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(firstdata) {
        showToast('System Error: Unable to read Invoices data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
}

function deleteCancelledInvoiceFromServer(id, revID, type, table, requestURLSource, optionalPageRef){

  var requestLink = 'zaitoon_bills';
  if(requestURLSource == 'BILL'){
    requestLink = 'zaitoon_bills';
  }
  else if(requestURLSource == 'INVOICE'){
    requestLink = 'zaitoon_invoices';
  }


    $.ajax({
      type: 'DELETE',
      url: COMMON_LOCAL_SERVER_IP+'/'+requestLink+'/'+id+'?rev='+revID,
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(optionalPageRef == 'GENERATED_BILLS_SETTLED'){
          loadAllSettledBills();
        }
        else if(optionalPageRef == 'GENERATED_BILLS_PENDING'){
          loadAllPendingSettlementBills();

          if(type == 'DINE'){
            updateTableMappingAfterCancellation(table, 'GENERATED_BILLS_PENDING');
          }

        }
      },
      error: function(data) {
        showToast('Server Warning: Unable to update Invoices. Please contact Accelerate Support.', '#e67e22');
      }
    });   
}




/*
  CANCEL RUNNING ORDER
*/

function cancelRunningOrder(kotID, optionalPageRef){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_CANCELLATION_REASONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_CANCELLATION_REASONS'){

              var reasonsList = data.docs[0].value;
              cancelRunningOrderAfterProcess(kotID, optionalPageRef, reasonsList)
                        
          }
          else{
            showToast('Warning: Cancellation Reasons data not found. Please contact Accelerate Support.', '#e67e22');
            var reasonsList = ["Not Satisfied"];
            cancelRunningOrderAfterProcess(kotID, optionalPageRef, reasonsList)
          }
        }
        else{
          showToast('Warning: Cancellation Reasons data not found. Please contact Accelerate Support.', '#e67e22');
          var reasonsList = ["Not Satisfied"];
          cancelRunningOrderAfterProcess(kotID, optionalPageRef, reasonsList)
        }

      },
      error: function(data) {
        showToast('Warning: Unable to read Cancellation Reasons data. Please contact Accelerate Support.', '#e67e22');
        var reasonsList = ["Not Satisfied"];
        cancelRunningOrderAfterProcess(kotID, optionalPageRef, reasonsList)
      }

    });  
}




function cancelRunningOrderAfterProcess(kotID, optionalPageRef, reasonsList){

  document.getElementById("orderCancellationsReasonModal").style.display = 'block';
  document.getElementById("orderCancellationsReasonModalActions").innerHTML = '<button class="btn btn-default" onclick="initiateCancelOrderHide()" style="float: left">Close</button>'+
                  '<button class="btn btn-danger" onclick="processCancelRunningOrder(\''+kotID+'\', \''+optionalPageRef+'\')" style="float: right">Proceed to Cancel</button>';


  var n = 0;
  var reasonRender = '';
  while(reasonsList[n]){
    reasonRender += '<option value="'+reasonsList[n]+'">'+reasonsList[n]+'</option>';
    n++;
  }

  document.getElementById("order_cancel_why_reason").innerHTML = reasonRender;

  $('#order_cancel_why_comments').val('');
  $('#order_cancel_why_comments').focus();  
}


function initiateCancelOrderHide(){
  document.getElementById("orderCancellationsReasonModal").style.display = 'none';
}


function processCancelRunningOrder(kotID, optionalPageRef){


    var current_time = getCurrentTime('TIME');
    var why_reason = $('#order_cancel_why_reason').val();
    var why_comments = $('#order_cancel_why_comments').val();
    
    var why_food_status = $('#order_cancel_food_status').val();
    why_food_status = parseInt(why_food_status);


    var staffData = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData) : {};
    if(!staffData.name || staffData.name == ''){
      showToast('Warning! Staff information not available. Select Staff Profile and try again.', '#e67e22');
      return '';
    }

    if(why_comments == '' || why_comments.length < 3){
      showToast('Warning! Please add some comments.', '#e67e22');
      return '';      
    }


    var cancelObj = {
            "timeCancel" : current_time,
            "cancelledBy" : staffData.name,
            "reason" : why_reason,
            "comments" : why_comments,
            "status" : why_food_status, //FOOD WASTED or NOT
            "refundStatus" : 0,
            "refundAmount" : '',
            "refundMode" : ''
    }

    initiateCancelOrderHide();


    var requestData = { "selector" :{ "KOTNumber": kotID }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(firstdata) {
        if(firstdata.docs.length > 0){

            var kot = firstdata.docs[0];

            var memory_rev = firstdata.docs[0]._rev;
            var memory_id = firstdata.docs[0]._id;
            var memory_type = firstdata.docs[0].orderDetails.modeType;
            var memory_table = firstdata.docs[0].table;
            
            var cancelOrderFile = kot;
            delete cancelOrderFile._id;
            delete cancelOrderFile._rev;

            cancelOrderFile.cancelDetails = cancelObj;

            deleteCancelledKOTFromServer(memory_id, memory_rev, memory_type, memory_table, kotID, optionalPageRef);

              //Post to local Server
              $.ajax({
                type: 'POST',
                url: COMMON_LOCAL_SERVER_IP+'/zaitoon_cancelled_orders/',
                data: JSON.stringify(cancelOrderFile),
                contentType: "application/json",
                dataType: 'json',
                timeout: 10000,
                success: function(data) {
                  if(data.ok){
                    showToast('Order #'+kotID+' has been Cancelled successfully', '#27ae60');
                  }
                  else{
                    showToast('Warning: KOT was not Generated. Try again.', '#e67e22');
                  }
                },
                error: function(data){           
                  showToast('System Error: Unable to save Cancelled Order to the local server. Please contact Accelerate Support if problem persists.', '#e74c3c');
                }
              });  
              //End - post KOT to Server   


        }
        else{
          showToast('Not Found Error: #'+kotID+' not found on Server. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}

function deleteCancelledKOTFromServer(id, revID, type, table, kotID, optionalPageRef){
    $.ajax({
      type: 'DELETE',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/'+id+'?rev='+revID,
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(optionalPageRef == 'ORDER_PUNCHING'){
        
          clearAllMetaData();
          renderCustomerInfo();

          if(type == 'DINE'){
            updateTableMappingAfterCancellation(table, 'ORDER_PUNCHING');
          }
          
        }
        else if(optionalPageRef == 'LIVE_ORDERS'){
          if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
            var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : []; 
            if(originalData.KOTNumber == kotID){ //Editing Order being cancelled
              clearAllMetaData();
            }
          }
        
          renderAllKOTs();
        
          if(type == 'DINE'){
            updateTableMappingAfterCancellation(table, 'LIVE_ORDERS');
          }
          
        }
        else if(optionalPageRef == 'SEATING_STATUS'){
          if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){
            var originalData = window.localStorage.edit_KOT_originalCopy ?  JSON.parse(window.localStorage.edit_KOT_originalCopy) : []; 
            if(originalData.KOTNumber == kotID){ //Editing Order being cancelled
              clearAllMetaData();
            }
          }
        
          if(type == 'DINE'){
            updateTableMappingAfterCancellation(table, 'SEATING_STATUS');
          }
          else{
            preloadTableStatus();
          }
        }
      },
      error: function(data) {
        showToast('Server Warning: Unable to update Orders. Please contact Accelerate Support.', '#e67e22');
      }
    });   
}


function updateTableMappingAfterCancellation(tableID, optionalPageRef){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_TABLES_MASTER" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_TABLES_MASTER'){

                    var tableMapping = data.docs[0].value;

                    for(var i=0; i<tableMapping.length; i++){
                      if(tableMapping[i].table == tableID){

                        tableMapping[i].status = 0;
                        tableMapping[i].assigned = "";
                        tableMapping[i].lastUpdate = "";
                        tableMapping[i].KOT = "";

                        break;
                      }
                    }

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ZAITOON_TABLES_MASTER",
                      "value": tableMapping
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_TABLES_MASTER/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        if(optionalPageRef == 'ORDER_PUNCHING'){
                          renderTables();
                        }
                        else if(optionalPageRef == 'SEATING_STATUS'){
                          preloadTableStatus();
                        }
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });     
          }
          else{
            showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}
