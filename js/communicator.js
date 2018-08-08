const ipc = require('electron').ipcRenderer;

function sendToPrinter(orderObject, type, optionalRequest){

 return '';

	/*
		type - Either KOT or BILL
		optionalRequest - 'DUPLICATE' in case of Duplicate Printing
	*/	


//Fixed data

var data_custom_header_image = 'data:image/png;base64,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';

var data_custom_top_right_name = 'GSTIN';
var data_custom_top_right_value = 'AAD9929392999';

var data_custom_bottom_pay_heading = "Scan & Pay Online!";
var data_custom_bottom_pay_brief = "Get 5% off next time when you pay online!";
var data_custom_bottom_pay_url = ""; //Auto generate Payment Link

var data_custom_footer_comments = "Order Online on www.zaitoon.online";

var data_custom_footer_address = "Zaitoon Multicuisine 1, Vantage Building, Mahatma Gandhi Road, Subramaniam Colony, Adyar, Chennai - 41";
var data_custom_footer_contact = "7299939974 | care@zaitoon.online | www.zaitoon.online";

var data_custom_scanpay_enabled = 1;
var showScanPay = false;

//Scan and Pay
if(data_custom_scanpay_enabled == 1){
   if(orderObject.orderDetails.isOnline){ //DISABLE FOR PREPAID ORDERS
      if(orderObject.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID'){
         showScanPay = false;
      }
      else{
         showScanPay = true;
      }
   }
   else{
      showScanPay = true;
   }
}  


/*
   PRINTING BILL
*/

if(type == 'BILL'){

var $j = jQuery.noConflict();
var qrcode = $j('#dummyQRCodeHolder').qrcode({width: 64, height: 64, text : "https://www.zaitoon.online" });


//Render Items
var sub_total = 0;

var itemsList = '';
var n = 0;
while(orderObject.cart[n]){

   itemsList +=   '<tr>'+
                        '<td>'+(n+1)+'</td>'+
                        '<td>'+orderObject.cart[n].name+(orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</td>'+
                        '<td><rs class="rs">Rs.</rs>'+orderObject.cart[n].price+'</td>'+
                        '<td>x '+orderObject.cart[n].qty+'</td>'+
                        '<td style="text-align: right;"><rs class="rs">Rs.</rs>'+(orderObject.cart[n].price * orderObject.cart[n].qty)+'</td>'+
                  '</tr>';

   sub_total += orderObject.cart[n].price * orderObject.cart[n].qty;

   n++;
}


//Render Extras
var extras_sum = 0;

var extrasList = '';
var m = 0;
while(orderObject.extras[m]){

   extrasList +=  '<tr>'+
                     '<td>'+orderObject.extras[m].name+' ('+(orderObject.extras[m].unit == 'PERCENTAGE'? orderObject.extras[m].value + '%': 'Rs.'+orderObject.extras[m].value)+')</td>'+
                     '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>'+orderObject.extras[m].amount+'</td>'+
                  '</tr>';

   extras_sum += orderObject.extras[m].amount;

   m++;
}


//Render Custom Extras
var custom_extras_sum = 0;

var customExtrasList = '';
if(orderObject.customExtras.amount &&  orderObject.customExtras.amount != 0){

   customExtrasList +=  '<tr>'+
                           '<td>'+orderObject.customExtras.type+' ('+(orderObject.customExtras.unit == 'PERCENTAGE'? orderObject.customExtras.value + '%': 'Rs.'+orderObject.customExtras.value)+')</td>'+
                           '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>'+orderObject.customExtras.amount+'</td>'+
                        '</tr>';

   custom_extras_sum = orderObject.customExtras.amount;
}


//Render Discounts
var discount_sum = 0;

var discountList = '';
if(orderObject.discount.amount &&  orderObject.discount.amount != 0){

   discountList +=   '<tr>'+
                        '<td>Discount</td>'+
                       '<td style="text-align: right;">'+'- <rs class="rs">Rs.</rs>'+orderObject.discount.amount+'</td>'+
                     '</tr>';

   discount_sum = orderObject.discount.amount;
}


//Render User Info
var userInfo = '';
var billHeaderRender = '';

if(orderObject.orderDetails.modeType == 'DELIVERY'){

   var deliveryAddress = JSON.parse(orderObject.table)

   userInfo = '<td style="vertical-align: top">'+
                  '<p>'+'<label class="subLabel">Delivery To</label>'+
                     '<tag class="billingAddress">'+(deliveryAddress.name != '' ? deliveryAddress.name+'<br>' : '')+
                     (deliveryAddress.flatNo != '' ? '#'+deliveryAddress.flatNo+',' : '' )+deliveryAddress.flatName+'<br>'+
                     (deliveryAddress.landmark != '' ? deliveryAddress.landmark+',' : '' )+deliveryAddress.area+'<br>'+
                     (deliveryAddress.contact != '' ? '<tag class="mobileNumber">Mob. <b>'+deliveryAddress.contact+'</b>' : '')+'</tag>'+
                  '</p>'+
               '</td>';

   if(orderObject.orderDetails.isOnline){
      billHeaderRender = userInfo +                
                  '<td style="vertical-align: top">'+
                     '<p style=" text-align: right; float: right">'+
                        '<tag class="serviceType" style="padding: 0; font-size: 10px;"><tag style="color: #FFF; font-weight: bold; display: block; background: black; padding: 2px;">DELIVERY</tag>'+(orderObject.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID' ? '<tag style="display: block; padding: 2px;">PREPAID</tag>' : '<tag style="display: block; padding: 2px;">CASH</tag>')+'</tag>'+
                        '<tag class="subLabel">Order No</tag>'+
                        '<tag class="tokenNumber">'+(orderObject.orderDetails.reference != '' ? orderObject.orderDetails.reference : '- - - -')+'</tag>'+
                        '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                        '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                     '</p>'+
                     '<tag>'+'</tag>'+
                  '</td>';
   }
   else{
       billHeaderRender = userInfo +                
                  '<td style="vertical-align: top">'+
                     '<p style=" text-align: right; float: right">'+
                        '<tag class="serviceType" style="padding: 0; font-size: 10px;"><tag style="color: #FFF; font-weight: bold; display: block; background: black; padding: 2px;">DELIVERY</tag><tag style="display: block; padding: 2px;">CASH</tag></tag>'+
                        '<tag class="subLabel">Order No</tag>'+
                        '<tag class="tokenNumber">'+(orderObject.orderDetails.reference != '' ? orderObject.orderDetails.reference : '- - - -')+'</tag>'+
                        '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                        '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                     '</p>'+
                     '<tag>'+'</tag>'+
                  '</td>';     
   }
}
else if(orderObject.orderDetails.modeType == 'PARCEL'){
    userInfo = '<td style="vertical-align: top; position: relative">'+
                  '<p>'+'<label class="subLabel">Billed To</label>'+
                     '<tag class="billingAddress">'+
                     (orderObject.customerName != '' ? orderObject.customerName+'<br>' : '')+
                     (orderObject.customerMobile != '' ? '<tag class="mobileNumber">Mob. <b>'+orderObject.customerMobile+'</b>' : '')+ '</tag>'+
                     '<tag class="serviceType" style="border-radius: 3px; font-size: 80%; display: inline-block; margin: 10px 0 0 0;">PARCEL</tag>'+
                  '</p>'+
               '</td>';  

   if(orderObject.orderDetails.isOnline){
      billHeaderRender = userInfo +                
                  '<td style="vertical-align: top">'+
                     '<p style=" text-align: right; float: right">'+
                        '<tag class="serviceType">'+(orderObject.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID' ? 'PREPAID' : 'CASH')+'</tag>'+
                        '<tag class="subLabel" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">Order No</tag>'+
                        '<tag class="tokenNumber" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">'+orderObject.orderDetails.reference+'</tag>'+
                        '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                        '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                     '</p>'+
                     '<tag>'+'</tag>'+
                  '</td>';  
   }   
   else{
      billHeaderRender = userInfo +                
                  '<td style="vertical-align: top">'+
                     '<p style=" text-align: right; float: right">'+
                        '<tag class="serviceType">'+(orderObject.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID' ? 'PREPAID' : 'CASH')+'</tag>'+
                        '<tag class="subLabel" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">Order No</tag>'+
                        '<tag class="tokenNumber" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">'+orderObject.orderDetails.reference+'</tag>'+
                        '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                        '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                     '</p>'+
                     '<tag>'+'</tag>'+
                  '</td>';  
   }          
}
else{

   if(orderObject.customerName != '' || orderObject.customerMobile != ''){
       userInfo = '<td style="vertical-align: top; position: relative">'+
                     '<p>'+'<label class="subLabel">Billed To</label>'+
                        '<tag class="billingAddress">'+
                        (orderObject.customerName != '' ? orderObject.customerName+'<br>' : '')+
                        (orderObject.customerMobile != '' ? '<tag class="mobileNumber">Mob. <b>'+orderObject.customerMobile+'</b>' : '')+ '</tag>'+
                        '<tag class="serviceType" style="margin: 5px 0 5px 0; position: absolute; bottom:0 ; border: none; font-size: 11px; text-align: left; padding: 0">'+(orderObject.orderDetails.modeType == 'DINE' ? 'Dine' : (orderObject.orderDetails.modeType == 'TOKEN' ? 'Self Service' : 'Service'))+'</tag>'+
                     '</p>'+
                  '</td>';  

       billHeaderRender = userInfo +                
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">'+(orderObject.orderDetails.modeType == 'DINE' ? 'Table No' : (orderObject.orderDetails.modeType == 'TOKEN' ? 'Token No' : ''))+'</tag>'+
                     '<tag class="tokenNumber">'+(orderObject.orderDetails.modeType == 'DINE' ? orderObject.table : (orderObject.orderDetails.modeType == 'TOKEN' ? orderObject.table : '- - - -'))+'</tag>'+
                     '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                     '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
               '</td>';                  
   }
   else{
       billHeaderRender = ''+
                  '<td style="vertical-align: top">'+
                     '<p>'+
                        '<tag class="subLabel">'+(orderObject.orderDetails.modeType == 'DINE' ? 'Table No' : (orderObject.orderDetails.modeType == 'TOKEN' ? 'Token No' : ''))+'</tag>'+
                        '<tag class="tokenNumber">'+(orderObject.orderDetails.modeType == 'DINE' ? orderObject.table : (orderObject.orderDetails.modeType == 'TOKEN' ? orderObject.table : '..'))+'</tag>'+                        
                     '</p>'+
                  '</td>'+                  
                  '<td style="vertical-align: top">'+
                     '<p style=" text-align: right; float: right">'+
                        '<tag class="subLabel" style="margin: 0">'+data_custom_top_right_name+'</tag>'+
                        '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                        '<tag class="serviceType" style="margin: 5px 0 0 0; border: none; font-size: 11px; text-align: right; padding: 0">'+(orderObject.orderDetails.modeType == 'DINE' ? 'Dine' : (orderObject.orderDetails.modeType == 'TOKEN' ? 'Self Service' : 'Service'))+'</tag>'+
                     '</p>'+
                     '<tag>'+'</tag>'+
                  '</td>';    
   }

}



var html_template = ''+
      '<div id="logo">'+
        '<center><img src=\''+data_custom_header_image+'\'/></center>'+
      '</div>'+
      '<div class="invoiceHeader">'+
         '<table style="width: 100%">'+
            '<col style="width: 60%">'+
            '<col style="width: 40%">'+
            '<tr>'+ billHeaderRender +
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
              '<tag class="invoiceNumber">'+orderObject.billNumber+'</tag>'+
            '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">INOVICE DATE</tag>'+
                     '<tag class="timeStamp">'+orderObject.date+'<time class="timeDisplay">'+getFancyTime(orderObject.timeBill)+'</time></tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
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
            '<col style="width: 15%">'+ itemsList +
         '</table>'+
      '</div>'+
      '<div class="invoiceCharges">'+
         '<table style="width: 100%">'+
            '<col style="width: 80%">'+
            '<col style="width: 20%">'+
            '<tr>'+
               '<td>Sub Total</td>'+
               '<td style="text-align: right;"><rs class="rs">Rs.</rs>'+sub_total+'</td>'+
            '</tr>'+ extrasList + customExtrasList + discountList +
            '<tr>'+
               '<td style="font-weight: bold; text-transform: uppercase">Total Payable</td>'+
               '<td style="text-align: right; font-size: 21px; font-weight: bold"><rs class="rs">Rs.</rs>'+orderObject.payableAmount+'</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoicePaymentsLink" style="'+(showScanPay ? '' : 'display: none')+'">'+
       '<table style="width: 100%">'+
            '<col style="width: 60%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td >'+
                  '<p>'+
                    '<tag class="paymentSubHead">'+data_custom_bottom_pay_heading+'</tag>'+
                    '<tag class="paymentSubText">'+data_custom_bottom_pay_brief+'</tag>'+
                  '</p>'+ 
               '</td>'+
               '<td style="float: right">'+
                  '<div class="qrCode">'+qrcode+'</div>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="invoiceCustomText">'+
         '<table style="width: 100%">'+
            '<col style="width: 100%">'+
            '<tr>'+
               '<td>'+data_custom_footer_comments+'</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<p class="addressText">'+data_custom_footer_address+'</p>'+
      '<p class="addressContact">'+data_custom_footer_contact+'</p>';
}




/*
   PRINTING KOT
*/



if(type == 'KOT'){

   if(optionalRequest == 'EDITING'){
      //Editing KOT
   }

//Render Items
var total_items = 0;
var total_quantity = 0;

var itemsList = '';
var n = 0;
while(orderObject.cart[n]){

   itemsList +='<tr>'+
                  '<td>'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments">- '+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td style="text-align: right">'+
                     '<p>'+
                        '<tag class="itemQuantity">'+orderObject.cart[n].qty+'</tag>'+
                     '</p>'+
                  '</td>'+
               '</tr>'

            /* Editing Cases
            '<tr>'+
               '<td>Malabar Chicken Biriyani'+
                  '<comments class="itemOldComments">add extra raita</comments>'+
                  '<newcomments class="itemComments">add extra spicy raita</newcomments>'+
               '</td>'+
               '<td style="text-align: right">'+
                  '<p>'+
                     '<tag class="itemQuantity">2</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
            '<tr>'+
               '<td>Barbeque Spicy (Single)</td>'+
               '<td style="text-align: right">'+
                  '<p>'+
                     '<tag class="itemOldQuantity">1</tag>'+
                     '<tag class="itemQuantity">2</tag>'+
                  '</p>'+
            '</td>'+
            '</tr>'+

            */

   total_quantity += orderObject.cart[n].qty;

   n++;
}

total_items = n;


var html_template = ''+
      '<div id="logo">'+
        '<center><img src=\''+data_custom_header_image+'\'/></center>'+
      '</div>'+
      '<div class="KOTHeader">'+
         '<table style="width: 100%">'+
            '<col style="width: 33%">'+
            '<col style="width: 33%">'+
            '<col style="width: 33%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel" style="margin: 5px 0 0 0">'+(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL' ? 'TYPE' : 'STEWARD')+'</tag>'+
                     '<tag class="attendantName">'+(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL' ? orderObject.orderDetails.mode : orderObject.stewardName)+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="serviceType" style="'+( orderObject.orderDetails.modeType == 'PARCEL' || orderObject.orderDetails.modeType == 'DELIVERY' ? 'display: none' : '' )+'">'+(orderObject.orderDetails.modeType == 'DINE' ? 'ON TABLE' : (orderObject.orderDetails.modeType == 'TOKEN' ? 'SELF SERVICE' : ''))+'</tag>'+
                     '<tag class="serviceType" style="padding: 0; font-size: 10px; '+( orderObject.orderDetails.modeType == 'PARCEL' || orderObject.orderDetails.modeType == 'DELIVERY' ? '' : 'display: none' )+'"><tag style="color: #FFF; font-weight: bold; display: block; background: black; padding: 2px;">'+(orderObject.orderDetails.modeType == 'PARCEL' ? 'PARCEL' : (orderObject.orderDetails.modeType == 'DELIVERY' ? 'DELIVERY' : ''))+'</tag>'+(orderObject.orderDetails.reference != ''  ? '<tag style="display: block; padding: 2px;">#'+orderObject.orderDetails.reference+'</tag>' : '<tag style="display: block; padding: 2px;">'+orderObject.customerName+'</tag>')+'</tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
               '</td>'+
               '<td style="vertical-align: top; '+(orderObject.orderDetails.modeType == 'DINE' || orderObject.orderDetails.modeType == 'TOKEN' ? '' : 'display: none')+'">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">'+(orderObject.orderDetails.modeType == 'DINE' ? 'Table No' : (orderObject.orderDetails.modeType == 'TOKEN' ? 'Token No' : ''))+'</tag>'+
                     '<tag class="tokenNumber">'+orderObject.table+'</tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
               '</td>'+
            '</tr>'+
         '</table>'+
         
      '</div>'+

      '<div class="KOTNumberArea">'+

         '<table style="width: 100%">'+
            '<col style="width: 60%">'+
            '<col style="width: 40%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
               '<p>'+
                  '<tag class="subLabel">KOT NO</tag>'+
                  '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
               '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME STAMP</tag>'+
                     '<tag class="timeStamp">'+getFancyTime(orderObject.timePunch)+'<time class="timeDisplay">'+orderObject.date+'</time></tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
               '</td>'+
            '</tr>'+
         '</table>'+



      '</div>'+
      '<div class="KOTContent">'+
         '<table style="width: 100%">'+
            '<col style="width: 85%">'+
            '<col style="width: 15%">'+ itemsList +
         '</table>'+
      '</div>'+
      '<div class="KOTSummary">'+
         '<table style="width: 100%">'+
            '<col style="width: 80%">'+
            '<col style="width: 20%">'+
            '<tr>'+
               '<td>Number of Items</td>'+
               '<td style="text-align: right;">'+total_items+'</td>'+
            '</tr>'+
            '<tr>'+
               '<td>Total Quantity</td>'+
               '<td style="text-align: right;">'+total_quantity+'</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="KOTSpecialComments" style="'+(orderObject.specialRemarks != '' ? '' : 'display: none')+'">'+
       '<table style="width: 100%">'+
            '<col style="width: 100%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                     '<p>'+
                        '<tag class="subLabel">SPECIAL COMMENTS</tag>'+
                        '<tag class="commentsSubText">'+orderObject.specialRemarks+'</tag>'+
                     '</p>'+  
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>'+
      '<div class="KOTSpecialComments" style="'+(orderObject.allergyInfo.length > 0 ? '' : 'display: none')+'">'+
       '<table style="width: 100%">'+
            '<col style="width: 100%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                     '<p>'+
                        '<tag class="subLabel">ALLERGY WARNING</tag>'+
                        '<tag class="commentsSubText">'+((orderObject.allergyInfo).toString())+'</tag>'+
                     '</p>'+  
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';
}




  //ipc.send('print-to-pdf', html_template);


  ipc.send("printPDF", html_template);
}
