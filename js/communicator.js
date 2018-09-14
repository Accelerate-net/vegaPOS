const ipc = require('electron').ipcRenderer;

/* 
   GENERATE PDF REPORTS
*/

function generatePDFReport(html_template, report_title){
   ipc.send("generatePDFReportA4", html_template, report_title);
}

function printPDFReport(html_template){

    var allActivePrinters = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

    if(allActivePrinters.length == 0){
      showToast('Print Error: No configured printers found. Print failed. Please contact Accelerate Support.', '#e74c3c');
      return '';
    }

     var selected_printers = null;
     var b = 0;
     while(allActivePrinters[b]){
      if(allActivePrinters[b].type == 'REPORT'){
         selected_printers = allActivePrinters[b].list;
         break;
      }
      b++;
     }

     if(selected_printers && selected_printers.length > 0){
      ipc.send("printSmallReport", html_template, selected_printers);
     }
     else{
      showToast('Print Error: Print failed. No printer configured to print Reports.', '#e74c3c');   
      return '';
     }
}

function getPrinterList(optionalRequest){
   window.localStorage.connectedPrintersList = '';
   ipc.send("getMeAllPrinters", optionalRequest);
}   

ipc.on('all-printers-list', function (event, listOfPrinters, optionalRequest) {

   if(listOfPrinters.length > 0){
      window.localStorage.connectedPrintersList = JSON.stringify(listOfPrinters);
   }
   else{
      window.localStorage.connectedPrintersList = '';
   }

   if(optionalRequest == 'REFRESH'){
      showToast('Printers list refreshed successfully', '#27ae60');
      openNewPrinterReRender();
   }

});


/*
   PRINT BILLS
*/

function sendToPrinter(orderObject, type, optionalRequest){

 //return '';

 var allActivePrinters = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

 if(allActivePrinters.length == 0){
   showToast('Print Error: No configured printers found. Print failed. Please contact Accelerate Support.', '#e74c3c');
   return '';
 }

	/*
		type - Either KOT or EDIT_KOT or BILL
		optionalRequest - 'DUPLICATE' in case of Duplicate Printing
	*/	


//Fixed data

var data_custom_header_image = window.localStorage.bill_custom_header_image ? window.localStorage.bill_custom_header_image : '';

var data_custom_top_right_name = window.localStorage.bill_custom_top_right_name ? window.localStorage.bill_custom_top_right_name : '';
var data_custom_top_right_value = window.localStorage.bill_custom_top_right_value ? window.localStorage.bill_custom_top_right_value : '';

var data_custom_bottom_pay_heading = window.localStorage.bill_custom_bottom_pay_heading ? window.localStorage.bill_custom_bottom_pay_heading : '';
var data_custom_bottom_pay_brief = window.localStorage.bill_custom_bottom_pay_brief ? window.localStorage.bill_custom_bottom_pay_brief : '';
var data_custom_bottom_pay_url = ""; //Auto generate Payment Link

var data_custom_footer_comments = window.localStorage.bill_custom_footer_comments ? window.localStorage.bill_custom_footer_comments : '';

var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';
var data_custom_footer_contact = window.localStorage.bill_custom_footer_contact ? window.localStorage.bill_custom_footer_contact : '';

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

//Scan & Pay QR Code Options
var qr_code_options = {
   width: 64, 
   height: 64, 
   text : "https://www.zaitoon.online"
};

console.log('Started')
   
var $j = jQuery.noConflict();
var qrcode = $j('#dummyQRCodeHolder').qrcode(qr_code_options, function(){
   console.log('Completed')
});


console.log('End')

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
                        '<tag class="serviceType">CASH</tag>'+
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
        (data_custom_header_image != '' ? '<center><img src=\''+data_custom_header_image+'\'/></center>' : '<h1>Invoice</h1>')+
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
   PRINTING DUPLICATE BILL
*/

if(type == 'DUPLICATE_BILL'){

   console.log('1')

var $j = jQuery.noConflict();
var qrcode = $j('#dummyQRCodeHolder').qrcode({width: 64, height: 64, text : "https://www.zaitoon.online" });

console.log(qrcode)

console.log('2')

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
                        '<tag class="serviceType">CASH</tag>'+
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
        (data_custom_header_image != '' ? '<center><img src=\''+data_custom_header_image+'\'/></center>' : '<h1>Invoice</h1>')+
      '</div>'+
      '<div class="invoiceHeader">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0;">DUPLICATE INVOICE</div>'+
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
                  '<td><span style="font-size:18px">'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</span>'+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments">- '+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td style="text-align: right">'+
                     '<p>'+
                        '<tag class="itemQuantity" style="font-size:18px">'+orderObject.cart[n].qty+'</tag>'+
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





/*
   PRINTING DUPLICATE KOT
*/

if(type == 'DUPLICATE_KOT'){

//Render Items
var total_items = 0;
var total_quantity = 0;

var itemsList = '';
var n = 0;
while(orderObject.cart[n]){

   itemsList +='<tr>'+
                  '<td><span style="font-size:18px">'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</span>'+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments">- '+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td style="text-align: right">'+
                     '<p>'+
                        '<tag class="itemQuantity" style="font-size:18px">'+orderObject.cart[n].qty+'</tag>'+
                     '</p>'+
                  '</td>'+
               '</tr>'

   total_quantity += orderObject.cart[n].qty;

   n++;
}

total_items = n;


var html_template = ''+
      '<div class="KOTHeader">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">DUPLICATE KOT</div>'+
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


/*
   PRINTING EDITED KOT
*/



if(type == 'EDIT_KOT'){

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


  if(type == 'DUPLICATE_KOT') //TWEAK
      type = 'KOT';

  //ipc.send('print-to-pdf', html_template);
  var selected_printers = null;
  var b = 0;
  while(allActivePrinters[b]){
   if(allActivePrinters[b].type == type){
      selected_printers = allActivePrinters[b].list;
      break;
   }
   b++;
  }

  if(selected_printers && selected_printers.length > 0){
   ipc.send("printBillDocument", html_template, selected_printers);
  }
  else{
   showToast('Print Error: Print failed. No printer configured for '+type, '#e74c3c');   
   return '';
  }

}




function sendKOTChangesToPrinter(orderObject, compareObject){
console.log(compareObject)
 var allActivePrinters = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

 if(allActivePrinters.length == 0){
   showToast('Print Error: No configured printers found. Print failed. Please contact Accelerate Support.', '#e74c3c');
   return '';
 }

//Fixed data

var data_custom_header_image = window.localStorage.bill_custom_header_image ? window.localStorage.bill_custom_header_image : '';

var data_custom_top_right_name = window.localStorage.bill_custom_top_right_name ? window.localStorage.bill_custom_top_right_name : '';
var data_custom_top_right_value = window.localStorage.bill_custom_top_right_value ? window.localStorage.bill_custom_top_right_value : '';

var data_custom_bottom_pay_heading = window.localStorage.bill_custom_bottom_pay_heading ? window.localStorage.bill_custom_bottom_pay_heading : '';
var data_custom_bottom_pay_brief = window.localStorage.bill_custom_bottom_pay_brief ? window.localStorage.bill_custom_bottom_pay_brief : '';
var data_custom_bottom_pay_url = ""; //Auto generate Payment Link

var data_custom_footer_comments = window.localStorage.bill_custom_footer_comments ? window.localStorage.bill_custom_footer_comments : '';

var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';
var data_custom_footer_contact = window.localStorage.bill_custom_footer_contact ? window.localStorage.bill_custom_footer_contact : '';

/*
   PRINTING EDITED KOT
*/


//Render Items
var total_items = 0;
var total_quantity = 0;

var itemsList = '';
var n = 0;
while(compareObject[n]){ 

   if(compareObject[n].change == 'QUANTITY_INCREASE'){
      itemsList +='<tr>'+
                     '<td>'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].newComments && compareObject[n].newComments != '' ? '<newcomments class="itemComments">- '+compareObject[n].newComments+'</newcomments>' : '')+
                     '<span style="margin-top: 3px; display:block; font-size: 8px; font-weight: bold;"><span style="display: inline-block; border: 1px solid #444; padding: 2px 4px;">MORE QUANTITY</span></span>'+
                     '</td>'+
                     '<td style="text-align: right">'+
                        '<p>'+
                           '<tag class="itemOldQuantity">'+compareObject[n].oldValue+'</tag>'+
                           '<tag class="itemQuantity">+ '+(compareObject[n].qty - compareObject[n].oldValue)+'</tag>'+
                        '</p>'+
                     '</td>'+
                  '</tr>'
   }
   else if(compareObject[n].change == 'QUANTITY_DECREASE'){
      itemsList +='<tr>'+
                     '<td>'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].newComments && compareObject[n].newComments != '' ? '<newcomments class="itemComments">- '+compareObject[n].newComments+'</newcomments>' : '')+
                     '<span style="margin-top: 3px; display:block; font-size: 8px; font-weight: bold;"><span style="display: inline-block; border: 1px solid #444; padding: 2px 4px;">LESS QUANTITY</span></span>'+
                     '</td>'+
                     '<td style="text-align: right">'+
                        '<p>'+
                           '<tag class="itemOldQuantity">'+compareObject[n].oldValue+'</tag>'+
                           '<tag class="itemQuantity">- '+(compareObject[n].oldValue - compareObject[n].qty)+'</tag>'+
                        '</p>'+
                     '</td>'+
                  '</tr>'
   }
   else if(compareObject[n].change == 'ITEM_DELETED'){
      itemsList +='<tr>'+
                     '<td>'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     '<span style="margin-top: 3px; display:block; font-size: 8px; font-weight: bold;"><span style="display: inline-block; border: 1px solid #444; padding: 2px 4px;">ITEM CANCELLED</span></span>'+
                     '</td>'+
                     '<td style="text-align: right">'+
                        '<p>'+
                           '<tag class="itemOldQuantity">'+compareObject[n].qty+'</tag>'+
                        '</p>'+
                     '</td>'+
                  '</tr>'
   }
   else if(compareObject[n].change == 'NEW_ITEM'){
      itemsList +='<tr>'+
                     '<td>'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].newComments && compareObject[n].newComments != '' ? '<newcomments class="itemComments">- '+compareObject[n].newComments+'</newcomments>' : '')+
                     '</td>'+
                     '<td style="text-align: right">'+
                        '<p>'+
                           '<tag class="itemQuantity">'+compareObject[n].qty+'</tag>'+
                        '</p>'+
                     '</td>'+
                  '</tr>'
   }


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

   total_quantity += compareObject[n].qty;

   n++;
}

total_items = n;

var html_template = ''+
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


  //ipc.send('print-to-pdf', html_template);

  var selected_printers = null;
  var b = 0;
  while(allActivePrinters[b]){
   if(allActivePrinters[b].type == 'KOT'){
      selected_printers = allActivePrinters[b].list;
      break;
   }
   b++;
  }

  if(selected_printers && selected_printers.length > 0){
   ipc.send("printBillDocument", html_template, selected_printers);
  }
  else{
   showToast('Print Error: Print failed. No printer configured for '+type, '#e74c3c');   
   return '';
  }

}



