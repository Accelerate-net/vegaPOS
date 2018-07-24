const ipc = require('electron').ipcRenderer;



function sendToPrinter(orderObject, type, optionalRequest){

	/*
		type - Either KOT or BILL
		optionalRequest - 'DUPLICATE' in case of Duplicate Printing
	*/	


//Fixed data
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
   if(orderObject.orderDetails.notes != '' && orderObject.orderDetails.notes == 'PREPAID'){
      showScanPay = false;
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

   billHeaderRender = userInfo +                
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="serviceType" style="padding: 0; font-size: 10px;"><tag style="color: #FFF; font-weight: bold; display: block; background: black; padding: 2px;">DELIVERY</tag>'+(orderObject.orderDetails.notes == 'PREPAID' ? '<tag style="display: block; padding: 2px;">PREPAID</tag>' : '<tag style="display: block; padding: 2px;">CASH</tag>')+'</tag>'+
                     '<tag class="subLabel">Order No</tag>'+
                     '<tag class="tokenNumber">'+(orderObject.orderDetails.reference != '' ? orderObject.orderDetails.reference : '- - - -')+'</tag>'+
                     '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                     '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
               '</td>';
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

   billHeaderRender = userInfo +                
               '<td style="vertical-align: top">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="serviceType">'+(orderObject.orderDetails.notes == 'PREPAID' ? 'PREPAID' : 'CASH')+'</tag>'+
                     '<tag class="subLabel" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">Order No</tag>'+
                     '<tag class="tokenNumber" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">'+orderObject.orderDetails.reference+'</tag>'+
                     '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                     '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                  '</p>'+
                  '<tag>'+'</tag>'+
               '</td>';               
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
'<!DOCTYPE html>'+
'<html>'+
   '<head>'+ '<style type="text/css"> body{ font-family: sans-serif; } #logo{min-height: 70px; width: 100%;} .invoiceHeader{ width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .invoiceNumberArea{ min-height: 30px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .invoiceContent{ min-height: 100px; width: 100%; background-color: none; font-size: 11px; padding-top: 6px; border-bottom: 1px dashed; } .invoiceCharges{ min-height: 90px; font-size: 11px; width: 100%; background-color: none; padding: 5px 0; border-bottom: 2px solid; } .invoicePaymentsLink{ min-height: 72px; width: 100%; background-color: none; border-bottom: 1px solid; } .invoiceCustomText{ width: 100%; background-color: none; padding: 5px 0; border-bottom: 1px solid; font-size: 12px; text-align: center; } .subLabel{ display: block; font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif; margin-bottom: 5px; } p{ margin: 0; } .serviceType{ border: 1px solid; padding: 4px; font-size: 12px; display: block; text-align: center; margin-bottom: 8px; } .tokenNumber{ display: block; font-size: 16px; font-weight: bold; } .billingAddress{ display: block; font-size: 12px; font-weight: 300; line-height: 1.2em; } .mobileNumber{ display: block; margin-top: 8px; font-size: 12px; } .timeStamp{ display: block; font-size: 11px; font-weight:300; } .invoiceNumber{ letter-spacing: 2px; font-size: 15px; font-weight: bold; } .timeDisplay{ font-size: 75%; display: block; } .rs{ font-size: 60%; } .paymentSubText{ font-size: 10px; font-weight: 300; display: block; } .paymentSubHead{ font-size: 12px; font-weight: bold; display: block; } .qrCode{ width: 100%; max-width: 120px; text-align: right} .addressText{ font-size: 10px; color: gray; padding: 5px 0; text-align: center; } .addressContact{ font-size: 9px; color: gray; padding: 0 0 5px 0; text-align: center; } .gstNumber{ font-weight: bold; font-size: 10px; } </style>'+ 
   '</head>'+
   '<body>'+
      '<div id="logo" style="background: gray">'+
        '<img src="data/photos/brand/invoice-logo.png">'+
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
      '<p class="addressContact">'+data_custom_footer_contact+'</p>'+
   '</body>'+
'</html>';
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
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments">'+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td style="font-weight: 300; font-size: 75%">Rs.'+orderObject.cart[n].price+'</td>'+
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
'<!DOCTYPE html>'+
'<html>'+
   '<head>'+
      '<style type="text/css">body{ font-family: sans-serif; } #logo{ min-height: 70px; width: 100%; background-color: none; } .KOTHeader{ min-height: 30px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .KOTNumberArea{ min-height: 30px; width: 100%; padding: 5px 0; background-color: none; border-bottom: 1px solid #7b7b7b; } .KOTContent{ min-height: 100px; width: 100%; background-color: none; font-size: 11px; padding-top: 6px; border-bottom: 2px solid; } .KOTSummary{ font-size: 11px; width: 100%; background-color: none; padding: 5px 0; border-bottom: 1px solid; } .KOTContent tr, .KOTContent td { border-bottom: 1px dashed; padding: 5px 0; } .KOTSpecialComments{ min-height: 20px; width: 100%; background-color: none; padding: 5px 0; } .subLabel{ display: block; font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif; margin-bottom: 5px; } p{ margin: 0; } .serviceType{ border: 1px solid; padding: 4px; font-size: 12px; display: block; text-align: center; margin-bottom: 8px; } .tokenNumber{ display: block; font-size: 16px; font-weight: bold; } .billingAddress{ display: block; font-size: 12px; font-weight: 300; line-height: 1.2em; } .mobileNumber{ display: block; margin-top: 8px; font-size: 12px; } .timeStamp{ display: block; font-size: 11px; font-weight:300; } .KOTNumber{ letter-spacing: 2px; font-size: 15px; font-weight: bold; } .timeDisplay{ font-size: 75%; display: block; } .commentsSubText{ font-size: 12px; font-style: italic; font-weight: 300; display: block; } .paymentSubHead{ font-size: 12px; font-weight: bold; display: block; } .qrCode{ width: 100%; max-width: 120px; text-align: right } .addressText{ font-size: 10px; color: gray; padding: 5px 0; text-align: center; } .addressContact{ font-size: 9px; color: gray; padding: 0 0 5px 0; text-align: center; } .attendantName{ font-weight: 300; font-size: 12px; } .itemOldComments{ display: block; font-style: italic; margin-left: 10px; text-decoration: line-through; } .itemComments{ display: block; font-style: italic; font-weight: bold; margin-left: 10px; } .itemQuantity{ font-size: 12px; font-weight: bold; display: block; } .itemOldQuantity{ font-size: 12px; text-decoration: line-through; display: block; } </style>'+
   '</head>'+
   '<body>'+
      '<div id="logo" style="background: gray">'+
        '<img src="data/photos/brand/invoice-logo.png">'+
      '</div>'+
      '<div class="KOTHeader">'+
         '<table style="width: 100%">'+
            '<col style="width: 33%">'+
            '<col style="width: 33%">'+
            '<col style="width: 33%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel" style="margin: 5px 0 0 0">STEWARD</tag>'+
                     '<tag class="attendantName">'+orderObject.stewardName+'</tag>'+
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
            '<col style="width: 75%">'+
            '<col style="width: 15%">'+
            '<col style="width: 10%">'+ itemsList +
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
      '</div>'+      
   '</body>'+
'</html>'
}




  ipc.send('print-to-pdf', html_template);

}
