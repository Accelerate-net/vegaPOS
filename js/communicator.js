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

     var selected_printer = null;
     var b = 0;
     while(allActivePrinters[b]){
      if(allActivePrinters[b].type == 'REPORT'){
         selected_printer = allActivePrinters[b].list[0];
         break;
      }
      b++;
     }

     if(selected_printer && selected_printer != '' && selected_printer != null){
      ipc.send("printSmallReport", html_template, selected_printer);
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

function sendToPrinter(orderObject, type, optionalTargetPrinter){

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

/*
   BILL LAYOUT DATA
*/

var data_custom_header_image = window.localStorage.bill_custom_header_image ? window.localStorage.bill_custom_header_image : '';

var data_custom_top_right_name = window.localStorage.bill_custom_top_right_name ? window.localStorage.bill_custom_top_right_name : '';
var data_custom_top_right_value = window.localStorage.bill_custom_top_right_value ? window.localStorage.bill_custom_top_right_value : '';

var data_custom_bottom_pay_heading = window.localStorage.bill_custom_bottom_pay_heading ? window.localStorage.bill_custom_bottom_pay_heading : '';
var data_custom_bottom_pay_brief = window.localStorage.bill_custom_bottom_pay_brief ? window.localStorage.bill_custom_bottom_pay_brief : '';
var data_custom_bottom_pay_url = ""; //Auto generate Payment Link

var data_custom_footer_comments = window.localStorage.bill_custom_footer_comments ? window.localStorage.bill_custom_footer_comments : '';

var data_custom_footer_address = window.localStorage.bill_custom_footer_address ? window.localStorage.bill_custom_footer_address : '';
var data_custom_footer_contact = window.localStorage.bill_custom_footer_contact ? window.localStorage.bill_custom_footer_contact : '';

var data_custom_header_client_name = window.localStorage.accelerate_licence_client_name ? window.localStorage.accelerate_licence_client_name : '';
if(data_custom_header_client_name == ''){
   data_custom_header_client_name = 'Invoice';
}

/*
   SCAN PAY OPTIONS
*/

var data_custom_scanpay_enabled = window.localStorage.scanPaySettings_scanPayEnabled ? (window.localStorage.scanPaySettings_scanPayEnabled == 'YES' ? true : false) : false;
var showScanPay = false;

//Scan and Pay
if(data_custom_scanpay_enabled){
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

//Scan Pay options
var data_scan_pay_api = window.localStorage.scanPaySettings_scanPayAPI ? window.localStorage.scanPaySettings_scanPayAPI : '';
if(data_scan_pay_api == ''){
   showScanPay = false;
}

var showDefaultQRCode = false;
var data_scan_pay_default_qr_show = window.localStorage.scanPaySettings_showDefaultQR ? (window.localStorage.scanPaySettings_showDefaultQR == 'YES' ? true : false) : false;
if(data_scan_pay_default_qr_show){
   showDefaultQRCode = true;
}

var data_scan_pay_target_qrcode = window.localStorage.scanPaySettings_defaultQRTarget ? window.localStorage.scanPaySettings_defaultQRTarget : '';
if(data_scan_pay_target_qrcode == ''){
   showDefaultQRCode = false;
}

var data_scan_pay_sendmetadata_qrcode = window.localStorage.scanPaySettings_sendMetadataToQR ? window.localStorage.scanPaySettings_sendMetadataToQR : '';
var sendMetaDataToDefaultQR = false;
if(data_scan_pay_sendmetadata_qrcode == 'YES'){
   sendMetaDataToDefaultQR = true;
}

//If Scan Pay is ENABLED, do not show custom QR at all!
if(data_custom_scanpay_enabled){
   showDefaultQRCode = false;
}


/*
   PRINTING BILL
*/


if(type == 'BILL'){

   //Scan & Pay QR Code Options
   if(showScanPay || showDefaultQRCode){
      if(showScanPay){
         console.log('AM HERE!!!!')
         //Create payment link online and then proceed to generate bill
         var payment_link_api = 'https://www.accelerateengine.app/pos/collect/createpayment.php';
         var license_number = window.localStorage.accelerate_licence_number ? window.localStorage.accelerate_licence_number : '';

         var data = {
            "token": window.localStorage.loggedInAdmin,
            "bill": orderObject.billNumber,
            "amount": orderObject.payableAmount,
            "license": license_number,
            "customerMobile": orderObject.customerMobile,
            "customerName": orderObject.customerName
         }

         var items = '';

         showLoading(10000, 'Creating Payment Link...');

         $.ajax({
            type: 'POST',
            url: payment_link_api,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(netdata) {
               hideLoading();
               if(netdata.status){
                  generateQRCode('SCAN_PAY', orderObject.billNumber, orderObject.outletCode, orderObject.customerMobile, netdata.uid);
               }
               else
               {
                  showToast('Warning! Failed to create the Online Payment Link.', '#e67e22');
                  renderBillTemplate(''); //remove qr code
               }
            },
            error: function(data){
               hideLoading();
               showToast('Warning! Failed to create the Online Payment Link.', '#e67e22');
            }
         });
      }
      else if(showDefaultQRCode){
         generateQRCode('CUSTOM_QR', orderObject.billNumber, orderObject.outletCode, orderObject.customerMobile)
      }
   }
   else{
      renderBillTemplate('');
   }


   function generateQRCode(type, billNumber, outletCode, customerMobile, uniquePaymentCode){

      var qr_code_options = {};

      if(type == 'SCAN_PAY'){
         qr_code_options.width = 64;
         qr_code_options.height = 64; 
         qr_code_options.text = data_scan_pay_api+'/?bill='+billNumber+'&outlet='+outletCode+'&customer='+customerMobile+'&uid='+uniquePaymentCode
      }
      else if(type == 'CUSTOM_QR'){
         qr_code_options.width = 64;
         qr_code_options.height = 64;
         qr_code_options.text = sendMetaDataToDefaultQR ? data_scan_pay_target_qrcode+'/?bill='+billNumber+'&outlet='+outletCode+'&customer='+customerMobile : data_scan_pay_target_qrcode;
      }
         
      var $j = jQuery.noConflict();
      var qrcode = $j('#dummyQRCodeHolder').qrcode(qr_code_options, function(){
         //Success Callback

      });
      //console.log(qrcode)
      renderBillTemplate(qrcode);
   }


   function renderBillTemplate(optionalQRCode){

      var optional_qrcode_template = '';
      if(optionalQRCode && optionalQRCode != ''){
         optional_qrcode_template = optionalQRCode;
      }

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
                           '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>'+(Math.round(orderObject.extras[m].amount * 100) / 100)+'</td>'+
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
                                 '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>'+(Math.round(orderObject.customExtras.amount * 100) / 100)+'</td>'+
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

      /* min cooking time */
      var minimum_cooking_time = 0;
      
      var mct = 0;
      while(orderObject.cart[mct]){
         if(orderObject.cart[mct].cookingTime && orderObject.cart[mct].cookingTime > 0){
            if(minimum_cooking_time <= orderObject.cart[mct].cookingTime){
               minimum_cooking_time = orderObject.cart[mct].cookingTime;
            }
         }

         mct++;
      }



      //Render User Info
      var userInfo = '';
      var billHeaderRender = '';
      var billBottomRender = '';

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
                              '<tag class="subLabel" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">Order No</tag>'+
                              '<tag class="tokenNumber">'+(orderObject.orderDetails.reference != '' ? orderObject.orderDetails.reference : '')+'</tag>'+
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
                              '<tag class="subLabel" style="'+(orderObject.orderDetails.reference != '' ? '' : 'display: none')+'">Order No</tag>'+
                              '<tag class="tokenNumber">'+(orderObject.orderDetails.reference != '' ? orderObject.orderDetails.reference : '')+'</tag>'+
                              '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                              '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                           '</p>'+
                           '<tag>'+'</tag>'+
                        '</td>';     
         }

         //Bottom of the Bill (for Delivery and Parcel only)
         billBottomRender =   '<div class="billBottomContainer">'+
                                 '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                                 '</div>'+   
                              '</div>'; 
      }
      else if(orderObject.orderDetails.modeType == 'PARCEL'){
          userInfo = '<td style="vertical-align: top; position: relative">'+
                        '<p>'+'<label class="subLabel" style="'+(orderObject.customerName == '' && orderObject.customerMobile == '' ? 'display: none' : '')+'">Billed To</label>'+
                           '<tag class="billingAddress">'+
                           (orderObject.customerName != '' ? orderObject.customerName+'<br>' : '')+
                           (orderObject.customerMobile != '' ? '<tag class="mobileNumber">Mob. <b>'+orderObject.customerMobile+'</b>' : '')+ '</tag>'+
                           '<tag class="serviceType" style="border-radius: 3px; font-size: 80%; display: inline-block; margin: 10px 0 0 0;">'+(orderObject.table && orderObject.table != "" ? 'Parcel #<b>'+orderObject.table+'</b>' : 'Parcel')+'</tag>'+
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

        
         //Bottom of the Bill (for Delivery and Parcel only)
         billBottomRender =   '<div class="billBottomContainer">'+
                                 '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                                 '</div>'+   
                              '</div>'; 

         
         //Show minimum cooking time...
         var flag_one_enabled = window.localStorage.appOtherPreferences_minimumCookingTime ? window.localStorage.appOtherPreferences_minimumCookingTime : 0;
         var flag_two_print = window.localStorage.appOtherPreferences_expectedReadyTime ? window.localStorage.appOtherPreferences_expectedReadyTime : 0;
           
         if((flag_one_enabled == 1 && flag_two_print == 1) && minimum_cooking_time > 0){

            billBottomRender += '<div class="billBottomContainer">'+
                                 '<div style="text-align: center; font-size:12px; color: #000; background: #FFF; padding: 3px 0; text-transform:uppercase">Order to be ready by <b style="font-size: 14px; padding: 0 4px; background: #000; color: #FFF">'+(addMinutesToTime(minimum_cooking_time, orderObject.timePunch))+'</b>'+
                                 '</div>'+   
                              '</div>';    
         }

      }
      else{

         if(orderObject.customerName != '' || orderObject.customerMobile != ''){
             userInfo = '<td style="vertical-align: top; position: relative">'+
                           '<p>'+'<label class="subLabel" style="'+(orderObject.customerName == '' && orderObject.customerMobile == '' ? 'display: none' : '')+'">Billed To</label>'+
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


      if(orderObject.orderDetails.modeType == 'TOKEN'){

         //Show minimum cooking time...
         var flag_one_enabled = window.localStorage.appOtherPreferences_minimumCookingTime ? window.localStorage.appOtherPreferences_minimumCookingTime : 0;
         var flag_two_print = window.localStorage.appOtherPreferences_expectedReadyTime ? window.localStorage.appOtherPreferences_expectedReadyTime : 0;
           
         if((flag_one_enabled == 1 && flag_two_print == 1) && minimum_cooking_time > 0){

            billBottomRender += '<div class="billBottomContainer">'+
                                 '<div style="text-align: center; font-size:12px; color: #FFF; background: #000; padding: 3px 0; text-transform: uppercase">Order to be ready by <b style="font-size: 14px;">'+(addMinutesToTime(minimum_cooking_time, orderObject.timePunch))+'</b>'+
                                 '</div>'+   
                              '</div>';    
         }
      }



      var html_template = ''+
            '<div id="logo">'+
              (data_custom_header_image != '' ? '<center><img style="max-width: 90%" src=\''+data_custom_header_image+'\'/></center>' : '<h1 style="text-align: center">'+data_custom_header_client_name+'</h1>')+
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
                           '<tag class="subLabel">INVOICE DATE</tag>'+
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
                  '</tr>'+ discountList + extrasList + customExtrasList +
                  '<tr>'+
                     '<td style="font-weight: bold; text-transform: uppercase">Total Payable</td>'+
                     '<td style="text-align: right; font-size: 21px; font-weight: bold"><rs class="rs">Rs.</rs>'+orderObject.payableAmount+'</td>'+
                  '</tr>'+
               '</table>'+
            '</div>'+
            '<div class="invoicePaymentsLink" style="'+(optional_qrcode_template != '' ? '' : 'display: none')+'">'+
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
                        '<div class="qrCode">'+optional_qrcode_template+'</div>'+
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
            '<p class="addressContact">'+data_custom_footer_contact+'</p>'+ billBottomRender;

            postContentToTemplate(html_template);
   } //End - Render Bill Template Function.

}





/*
   PRINTING DUPLICATE BILL
*/

if(type == 'DUPLICATE_BILL'){

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
                     '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>'+ (Math.round(orderObject.extras[m].amount * 100) / 100) +'</td>'+
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
                           '<td style="text-align: right;">'+'<rs class="rs">Rs.</rs>'+ (Math.round(orderObject.customExtras.Amount * 100) / 100) +'</td>'+
                        '</tr>';

   custom_extras_sum = orderObject.customExtras.amount;
}


//Render Discounts
var discount_sum = 0;

var discountList = '';
if(orderObject.discount.amount && orderObject.discount.amount != 0){

   discountList +=   '<tr>'+
                        '<td>Discount</td>'+
                       '<td style="text-align: right;">'+'- <rs class="rs">Rs.</rs>'+orderObject.discount.amount+'</td>'+
                     '</tr>';

   discount_sum = orderObject.discount.amount;
}



//Refunds Issued
var refunds_sum = 0;

var refundList = '';
if(orderObject.refundDetails){
   if(orderObject.refundDetails.amount != 0){
      refundList +=  '<tr>'+
                        '<td>Total Paid</td>'+
                        '<td style="text-align: right;"><rs class="rs">Rs.</rs>'+orderObject.totalAmountPaid+'</td>'+
                     '</tr>'+
                     '<tr>'+
                        '<td>Refunds</td>'+
                        '<td style="text-align: right;">- <rs class="rs">Rs.</rs>'+orderObject.refundDetails.amount+'</td>'+
                     '</tr>';

      refunds_sum = orderObject.refundDetails.amount;
   }
}


//Render User Info
var userInfo = '';
var billHeaderRender = '';
var billBottomRender = '';

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
                        '<tag class="serviceType" style="padding: 0; font-size: 10px;"><tag style="color: #FFF; font-weight: bold; display: block; background: black; padding: 2px;">DELIVERY '+orderObject.KOTNumber+'</tag>'+(orderObject.orderDetails.onlineOrderDetails.paymentMode == 'PREPAID' ? '<tag style="display: block; padding: 2px;">PREPAID</tag>' : '<tag style="display: block; padding: 2px;">CASH</tag>')+'</tag>'+
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
                        '<tag class="serviceType" style="padding: 0; font-size: 10px;"><tag style="color: #FFF; font-weight: bold; display: block; background: black; padding: 2px;">DELIVERY '+orderObject.KOTNumber+'</tag><tag style="display: block; padding: 2px;">CASH</tag></tag>'+
                        '<tag class="subLabel">Order No</tag>'+
                        '<tag class="tokenNumber">'+(orderObject.orderDetails.reference != '' ? orderObject.orderDetails.reference : '- - - -')+'</tag>'+
                        '<tag class="subLabel" style="margin: 5px 0 0 0">'+data_custom_top_right_name+'</tag>'+
                        '<tag class="gstNumber">'+data_custom_top_right_value+'</tag>'+
                     '</p>'+
                     '<tag>'+'</tag>'+
                  '</td>';     
   }

         //Bottom of the Bill (for Delivery and Parcel only)
         billBottomRender =   '<div class="billBottomContainer">'+
                                 '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                                 '</div>'+   
                              '</div>'; 
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

         //Bottom of the Bill (for Delivery and Parcel only)
         billBottomRender =   '<div class="billBottomContainer">'+
                                 '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                                 '</div>'+   
                              '</div>';        
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
        (data_custom_header_image != '' ? '<center><img style="max-width: 90%" src=\''+data_custom_header_image+'\'/></center>' : '<h1 style="text-align: center">'+data_custom_header_client_name+'</h1>')+
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
                     '<tag class="subLabel">INVOICE DATE</tag>'+
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
            '</tr>'+ discountList + extrasList + customExtrasList +
            refundList +
            '<tr>'+
               '<td style="font-weight: bold; text-transform: uppercase">Total Paid</td>'+
               '<td style="text-align: right; font-size: 21px; font-weight: bold"><rs class="rs">Rs.</rs>'+orderObject.payableAmount+'</td>'+
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
      '<p class="addressContact">'+data_custom_footer_contact+'</p>' + billBottomRender;


      postContentToTemplate(html_template);
}






/*
   PRINTING EXPENSE SLIP
*/

if(type == 'EXPENSE_SLIP'){

   var titleContent = '';
   var mainContent = '';

   switch(orderObject.type){
      case "EXPENSE":{
         titleContent = '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">EXPENSE SLIP</div>';
      
         mainContent = '<tr> <td style="font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Reference No.</tag> '+orderObject.reference+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Issued To</tag> '+orderObject.issuedTo+' ('+orderObject.issuedToType+')</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Details</tag> '+orderObject.details.purpose+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Total Amount</tag> '+orderObject.amount+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Approver</tag> '+orderObject.details.authorizedBy+'</td> </tr>';

         if(orderObject.paymentStatus == 'PAID'){
            mainContent +=    '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Date of Payment</tag> '+orderObject.dateOfPayment+'</td> </tr>'+
                              '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Mode of Payment</tag> '+orderObject.modeOfPayment+'</td> </tr>';
         }
         else{
            mainContent +=    '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px; font-style: italic">*Payment is Pending</td> </tr>';
         }

         break;
      }
      case "SALARY":{
         titleContent = '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">SALARY SLIP</div>';
      
         mainContent = '<tr> <td style="font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Reference No.</tag> '+orderObject.reference+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Issued To</tag> '+orderObject.issuedTo+' ('+orderObject.details.staffCode+')</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Month</tag> '+orderObject.details.salaryIssuingMonth+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Total Amount</tag> '+orderObject.amount+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Comments</tag> '+orderObject.details.comments+'</td> </tr>';

         if(orderObject.paymentStatus == 'PAID'){
            mainContent +=    '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Date of Payment</tag> '+orderObject.dateOfPayment+'</td> </tr>'+
                              '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Mode of Payment</tag> '+orderObject.modeOfPayment+'</td> </tr>';
         }
         else{
            mainContent +=    '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px; font-style: italic">*Payment is Pending</td> </tr>';
         }

         break;
      }
      case "CREDIT":{
         titleContent = '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">CREDIT SLIP</div>';
      
         mainContent = '<tr> <td style="font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Reference No.</tag> '+orderObject.reference+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Received From</tag> '+orderObject.details.receivedFrom+' ('+orderObject.details.receivedType+')</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Purpose</tag> '+orderObject.details.purpose+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Total Amount</tag> '+orderObject.amount+'</td> </tr>';

         if(orderObject.paymentStatus == 'PAID'){
            mainContent +=    '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Date of Payment</tag> '+orderObject.dateOfPayment+'</td> </tr>'+
                              '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Mode of Payment</tag> '+orderObject.modeOfPayment+'</td> </tr>';
         }
         else{
            mainContent +=    '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px; font-style: italic">*Payment is Pending</td> </tr>';
         }

         break;
      }
      case "PURCHASE":{
         titleContent = '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">PURCHASE SLIP</div>';
      
         mainContent = '<tr> <td style="font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Reference No.</tag> '+orderObject.reference+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Purchased From</tag> '+orderObject.issuedTo+' ('+orderObject.issuedToType+')</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Inventory</tag> '+orderObject.details.itemsPurchased+'</td> </tr>'+
                       '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Total Amount</tag> '+orderObject.amount+'</td> </tr>';

         if(orderObject.paymentStatus == 'PAID'){
            mainContent +=    '<tr> <td style="padding-top: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Date of Payment</tag> '+orderObject.dateOfPayment+'</td> </tr>'+
                              '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px;"> <tag style="display: block; text-transform: uppercase; font-size: 11px; font-weight: bold;">Mode of Payment</tag> '+orderObject.modeOfPayment+'</td> </tr>';
         }
         else{
            mainContent +=    '<tr> <td style="padding-top: 10px; padding-bottom: 10px; font-size: 14px; font-style: italic">*Payment is Pending</td> </tr>';
         }

         break;
      }  

   }

  

var html_template = ''+
      '<div id="logo">'+
        (data_custom_header_image != '' ? '<center><img style="max-width: 90%" src=\''+data_custom_header_image+'\'/></center>' : '<h1 style="text-align: center">'+data_custom_header_client_name+'</h1>')+
      '</div>'+ titleContent +
      '<div class="invoiceContent">'+
         '<table style="width: 100%">'+ mainContent +
         '</table>'+
      '</div>'+
      '<div class="invoiceCharges">'+
         '<table style="width: 100%">'+
            '<col style="width: 50%">'+
            '<col style="width: 50%">'+
            '<tr>'+
               '<td colspan="2">The above computer generated details has been verified against the records.</td>'+
            '</tr>'+
            '<tr>'+
               '<td></td>'+
               '<td></td>'+
            '</tr>'+ 
            '<tr>'+
               '<td>.............</td>'+
               '<td style="text-align: right;">.............</td>'+
            '</tr>'+ 
            '<tr>'+
               '<td style="font-weight: bold;">Date</td>'+
               '<td style="text-align: right; font-weight: bold;">Sign</td>'+
            '</tr>'+ 
         '</table>'+
      '</div>';

      postContentToTemplate(html_template);
}



/*
   PRINTING KOT
*/

if(type == 'KOT'){

//Render Items
var total_items = 0;
var total_quantity = 0;

/* min cooking time */
var minimum_cooking_time = 0;

var itemsList = '';
var n = 0;
while(orderObject.cart[n]){

   //Minimum cooking time
   if(orderObject.cart[n].cookingTime && orderObject.cart[n].cookingTime > 0){
      if(minimum_cooking_time <= orderObject.cart[n].cookingTime){
         minimum_cooking_time = orderObject.cart[n].cookingTime;
      }
   }

   itemsList +='<tr>'+
                  '<td><span style="font-size:18px">'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</span>'+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments">- '+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td style="text-align: right">'+
                     '<p>'+
                        '<tag class="itemQuantity" style="font-size:18px">'+orderObject.cart[n].qty+'</tag>'+
                     '</p>'+
                  '</td>'+
               '</tr>';

   total_quantity += orderObject.cart[n].qty;

   n++;
}

total_items = n;


var kot_header_content = '';
var kot_footer_content = '';

if(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL'){
   
   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">'+(orderObject.orderDetails.modeType == 'DELIVERY' ? 'PARCEL' : 'PARCEL <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">#'+orderObject.table+'</b>')+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';

   kot_footer_content = '<div class="billBottomContainer">'+
                           '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                           '</div>'+   
                        '</div>'; 

   //Show minimum cooking time...
   var flag_one_enabled = window.localStorage.appOtherPreferences_minimumCookingTime ? window.localStorage.appOtherPreferences_minimumCookingTime : 0;
   var flag_two_print = window.localStorage.appOtherPreferences_expectedReadyTime ? window.localStorage.appOtherPreferences_expectedReadyTime : 0;
           
   if((flag_one_enabled == 1 && flag_two_print == 1) && orderObject.orderDetails.modeType == 'PARCEL' && minimum_cooking_time > 0){
      kot_footer_content += '<div class="billBottomContainer">'+
                              '<div style="text-align: center; font-size:12px; text-transform:uppercase; background: #FFF; color: #000; padding: 3px 0">Order to be ready by <b style="font-size: 14px; padding: 0 4px; background:#000; color: #FFF">'+addMinutesToTime(minimum_cooking_time, orderObject.timePunch)+'</b>'+
                              '</div>'+   
                           '</div>'; 
   }
}
else if(orderObject.orderDetails.modeType == 'TOKEN'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">SELF SERVICE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  

   //Show minimum cooking time...
   var flag_one_enabled = window.localStorage.appOtherPreferences_minimumCookingTime ? window.localStorage.appOtherPreferences_minimumCookingTime : 0;
   var flag_two_print = window.localStorage.appOtherPreferences_expectedReadyTime ? window.localStorage.appOtherPreferences_expectedReadyTime : 0;
           
   if((flag_one_enabled == 1 && flag_two_print == 1) && minimum_cooking_time > 0){
      kot_footer_content += '<div class="billBottomContainer">'+
                              '<div style="text-align: center; font-size:12px; text-transform:uppercase; background: #FFF; color: #000; padding: 3px 0">Order to be ready by <b style="font-size: 14px; padding: 0 4px; background:#000; color: #FFF">'+addMinutesToTime(minimum_cooking_time, orderObject.timePunch)+'</b>'+
                              '</div>'+   
                           '</div>'; 
   }

}
else if(orderObject.orderDetails.modeType == 'DINE'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">ON TABLE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  

   if(orderObject.stewardName != ""){

      kot_footer_content = '<div class="billBottomContainer" style="background: #FFF">'+
                              '<div style="padding: 2px 0; color: #000; text-align: center;">'+
                                 '<tag style="font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;">PUNCHED BY </tag>'+
                                 '<b style="text-transform: uppercase; font-size:11px;">'+orderObject.stewardName+'</b>'+
                              '</div>'+   
                           '</div>';
   } 
}

var html_template = kot_header_content +
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
      '</div>' + kot_footer_content;

      postContentToTemplate(html_template);
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
                  '<td><span style="font-size: 18px">'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</span>'+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments">- '+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td class="itemQuantity" style="text-align: right; font-size: 18px">'+orderObject.cart[n].qty+
                  '</td>'+
               '</tr>'

   total_quantity += orderObject.cart[n].qty;

   n++;
}

total_items = n;

var kot_header_content = '';
var kot_footer_content = '';

if(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL'){
   
   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">DUPLICATE KOT</div>'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">'+(orderObject.orderDetails.modeType == 'DELIVERY' ? 'PARCEL' : 'PARCEL <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">#'+orderObject.table+'</b>')+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';

   kot_footer_content = '<div class="billBottomContainer">'+
                           '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                           '</div>'+   
                        '</div>'; 
}
else if(orderObject.orderDetails.modeType == 'TOKEN'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">DUPLICATE KOT</div>'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">SELF SERVICE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  
}
else if(orderObject.orderDetails.modeType == 'DINE'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">DUPLICATE KOT</div>'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">ON TABLE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  

   if(orderObject.stewardName != ""){

      kot_footer_content = '<div class="billBottomContainer" style="background: #FFF">'+
                              '<div style="padding: 2px 0; color: #000; text-align: center;">'+
                                 '<tag style="font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;">PUNCHED BY </tag>'+
                                 '<b style="text-transform: uppercase; font-size:11px;">'+orderObject.stewardName+'</b>'+
                              '</div>'+   
                           '</div>';
   } 
}

var html_template = kot_header_content +
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
      '</div>' + kot_footer_content;

      postContentToTemplate(html_template);
}






/*
   PRINTING CANCELLED KOT
*/

if(type == 'CANCELLED_KOT'){

//Render Items
var total_items = 0;
var total_quantity = 0;

var itemsList = '';
var n = 0;
while(orderObject.cart[n]){

   itemsList +='<tr>'+
                  '<td><span style="font-size: 18px; text-decoration: line-through; str">'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</span>'+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments" style="text-decoration: line-through; font-size: 11px;">- '+orderObject.cart[n].comments+'</newcomments>' : '')+
                  '</td>'+
                  '<td class="itemQuantity" style="text-align: right; font-size: 18px; text-decoration: line-through;">' +orderObject.cart[n].qty+
                  '</td>'+
               '</tr>'

   total_quantity += orderObject.cart[n].qty;

   n++;
}

total_items = n;

var kot_header_content = '';
var kot_footer_content = '';

if(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL'){
   
   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">-- ORDER CANCELLED --</div>'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">'+(orderObject.orderDetails.modeType == 'DELIVERY' ? 'PARCEL' : 'PARCEL <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">#'+orderObject.table+'</b>')+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';

   kot_footer_content = '<div class="billBottomContainer">'+
                           '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                           '</div>'+   
                        '</div>'; 
}
else if(orderObject.orderDetails.modeType == 'TOKEN'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">-- ORDER CANCELLED --</div>'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">SELF SERVICE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  
}
else if(orderObject.orderDetails.modeType == 'DINE'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<div style="text-align: center; font-size:14px; font-weight: bold; margin: 5px 0; background: #000; color: #FFF; padding: 4px 0">-- ORDER CANCELLED --</div>'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">ON TABLE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  

   if(orderObject.stewardName != ""){

      kot_footer_content = '<div class="billBottomContainer">'+
                              '<div style="padding: 2px 0; text-align: center;">'+
                                 '<tag style="font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;">TAKEN BY </tag>'+
                                 '<b style="text-transform: uppercase; font-size:11px;">'+orderObject.stewardName+'</b>'+
                              '</div>'+   
                           '</div>';
   } 
}

var html_template = kot_header_content +
      '<div class="KOTContent">'+
         '<table style="width: 100%">'+
            '<col style="width: 85%">'+
            '<col style="width: 15%">'+ itemsList +
         '</table>'+
      '</div>' + kot_footer_content;

      postContentToTemplate(html_template);
}


/*
   PRINTING ITEMS VIEW
*/

if(type == 'VIEW'){

//Render Items
var total_items = 0;
var total_quantity = 0;

var itemsList = '';
var n = 0;
while(orderObject.cart[n]){

   itemsList +='<tr>'+
                  '<td><span style="font-size: 13px">'+orderObject.cart[n].name + (orderObject.cart[n].isCustom ? ' ('+orderObject.cart[n].variant+')' : '')+'</span>'+
                  (orderObject.cart[n].comments && orderObject.cart[n].comments != '' ? '<newcomments class="itemComments" style="font-size: 11px; display: inline-block;"> ['+orderObject.cart[n].comments+']</newcomments>' : '')+
                  '</td>'+
                  '<td style="text-align: right">'+
                     '<span class="itemQuantity" style="font-size: 13px">'+orderObject.cart[n].qty+'</span>'+
                  '</td>'+
               '</tr>'

   total_quantity += orderObject.cart[n].qty;

   n++;
}

total_items = n;



var view_header_content = '';
var view_footer_content = '';

if(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL'){
   
   view_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">'+(orderObject.orderDetails.modeType == 'DELIVERY' ? 'PARCEL' : 'PARCEL <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">#'+orderObject.table+'</b>')+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';

   view_footer_content = '<div class="billBottomContainer">'+
                           '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                           '</div>'+   
                        '</div>'; 
}
else if(orderObject.orderDetails.modeType == 'TOKEN'){

   view_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">SELF SERVICE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  
}
else if(orderObject.orderDetails.modeType == 'DINE'){

   view_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 35%">'+
            '<col style="width: 30%">'+
            '<col style="width: 35%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="border: none; margin-bottom: 2px;"><b style="font-size: 30px; background: #000; color: #FFF; border-radius: 3px; padding: 2px 4px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  

   if(orderObject.stewardName != ""){

      view_footer_content = '<div class="billBottomContainer" style="background: #FFF">'+
                              '<div style="padding: 2px 0; color: #000; text-align: center;">'+
                                 '<tag style="font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;">PUNCHED BY </tag>'+
                                 '<b style="text-transform: uppercase; font-size:11px;">'+orderObject.stewardName+'</b>'+
                              '</div>'+   
                           '</div>';
   } 
}

var html_template = view_header_content +
      '<div class="KOTContent" style="min-height: unset">'+
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
      '</div>'+ view_footer_content;

      postContentToTemplate(html_template);
}


   function postContentToTemplate(html_template){

        if(type == 'DUPLICATE_KOT' || type == 'CANCELLED_KOT'){ //TWEAK -- Redirect Cancelled Order KOTs and Duplicate KOTs to Kitchen.
            type = 'KOT';
        }

        if(type == 'EXPENSE_SLIP'){
            type = 'REPORT';
        }

        //ipc.send('print-to-pdf', html_template);
        var selected_printer = null;

         if(!optionalTargetPrinter || optionalTargetPrinter == '' || optionalTargetPrinter == undefined){
            var b = 0;
            while(allActivePrinters[b]){
               if(allActivePrinters[b].type == type){
                  selected_printer = allActivePrinters[b].list[0];
                  break;
               }
               b++;
            }
         }
         else if(optionalTargetPrinter != ''){
            selected_printer = optionalTargetPrinter;
         }

        if(selected_printer && selected_printer != '' && selected_printer != null){
            ipc.send("printBillDocument", html_template, selected_printer);
        }
        else{
            showToast('Print Error: Print failed. No printer configured for '+type, '#e74c3c');   
            return '';
        }
   }

}




function sendKOTChangesToPrinter(orderObject, compareObject, optionalTargetPrinter){

 console.log('hilll...')
 
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
                     '<td style="font-size: 18px">'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].newComments && compareObject[n].newComments != '' ? '<newcomments class="itemComments">- '+compareObject[n].newComments+'</newcomments>' : '')+
                     '</td>'+
                     '<td style="text-align: right;">'+
                        '<span class="itemQuantity" style="font-size: 18px">'+ (compareObject[n].qty - compareObject[n].oldValue) +'</span>'+
                     '</td>'+
                  '</tr>'
   }
   else if(compareObject[n].change == 'QUANTITY_DECREASE'){

      itemsList +='<tr>'+
                     '<td style="font-size: 18px; text-decoration: line-through;">'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].comments && compareObject[n].comments != '' ? '<newcomments style="text-decoration: line-through;" class="itemComments">- '+compareObject[n].comments+'</newcomments>' : '')+
                     '<span style="margin-top: 3px; display: block; font-size: 12px; font-weight: bold;"><span style="display: inline-block; background: #000; color: #FFF; padding: 2px 4px;">ITEM CANCELLED</span></span>'+
                     '</td>'+
                     '<td style="text-align: right;">'+
                        '<span class="itemQuantity" style="font-size: 18px; text-decoration: line-through;">'+ (compareObject[n].oldValue - compareObject[n].qty) + '</span>'+
                     '</td>'+
                  '</tr>'

   }
   else if(compareObject[n].change == 'ITEM_DELETED'){
      itemsList +='<tr>'+
                     '<td style="font-size: 18px; text-decoration: line-through;">'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].comments && compareObject[n].comments != '' ? '<newcomments style="text-decoration: line-through;" class="itemComments">- '+compareObject[n].comments+'</newcomments>' : '')+
                     '<span style="margin-top: 3px; display: block; font-size: 12px; font-weight: bold;"><span style="display: inline-block; background: #000; color: #FFF; padding: 2px 4px;">ITEM CANCELLED</span></span>'+
                     '</td>'+
                     '<td style="text-align: right;">'+
                        '<span class="itemQuantity" style="font-size: 18px; text-decoration: line-through;">'+ compareObject[n].qty + '</span>'+
                     '</td>'+
                  '</tr>'
   }
   else if(compareObject[n].change == 'NEW_ITEM'){
      itemsList +='<tr>'+
                     '<td style="font-size: 18px">'+compareObject[n].name + (compareObject[n].isCustom ? ' ('+compareObject[n].variant+')' : '')+
                     (compareObject[n].newComments && compareObject[n].newComments != '' ? '<newcomments class="itemComments">- '+compareObject[n].newComments+'</newcomments>' : '')+
                     '</td>'+
                     '<td style="text-align: right;">'+
                        '<span class="itemQuantity" style="font-size: 18px">'+ compareObject[n].qty +'</span>'+
                     '</td>'+
                  '</tr>'
   }

   total_quantity += compareObject[n].qty;

   n++;
}

total_items = n;


var kot_header_content = '';
var kot_footer_content = '';

if(orderObject.orderDetails.modeType == 'DELIVERY' || orderObject.orderDetails.modeType == 'PARCEL'){
   
   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">'+(orderObject.orderDetails.modeType == 'DELIVERY' ? 'PARCEL' : 'PARCEL <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">#'+orderObject.table+'</b>')+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';

   kot_footer_content = '<div class="billBottomContainer">'+
                           '<div style="text-align: center; font-size:14px; font-weight: bold; background: #000; color: #FFF; padding: 3px 0">'+ orderObject.orderDetails.mode + ' - <b style="font-size: 16px;">'+orderObject.KOTNumber+'</b>'+
                           '</div>'+   
                        '</div>'; 
}
else if(orderObject.orderDetails.modeType == 'TOKEN'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">SELF SERVICE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  
}
else if(orderObject.orderDetails.modeType == 'DINE'){

   kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">KOT NO</tag>'+
                     '<tag class="KOTNumber">'+orderObject.KOTNumber+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">ON TABLE <b style="font-size: 18px; padding: 1px 5px; background: #000; font-weight: bold; color: #FFF; border-radius: 2px;">'+orderObject.table+'</b></tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+(orderObject.timeKOT == "" ? getFancyTime(orderObject.timePunch) : getFancyTime(orderObject.timeKOT))+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';  

   if(orderObject.stewardName != ""){

      kot_footer_content = '<div class="billBottomContainer" style="background: #FFF">'+
                              '<div style="padding: 2px 0; color: #000; text-align: center;">'+
                                 '<tag style="font-size: 8px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; font-family: sans-serif;">PUNCHED BY </tag>'+
                                 '<b style="text-transform: uppercase; font-size:11px;">'+orderObject.stewardName+'</b>'+
                              '</div>'+   
                           '</div>';
   } 
}

var html_template = kot_header_content +
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
      '</div>' + kot_footer_content;


         var selected_printer = null;

         if(!optionalTargetPrinter || optionalTargetPrinter == '' || optionalTargetPrinter == undefined){
            var b = 0;
            while(allActivePrinters[b]){
               if(allActivePrinters[b].type == 'KOT'){
                  selected_printer = allActivePrinters[b].list[0];
                  break;
               }
               b++;
            }
         }
         else if(optionalTargetPrinter != ''){
            selected_printer = optionalTargetPrinter;
         }


        if(selected_printer && selected_printer != '' && selected_printer != null){
         
         ipc.send("printBillDocument", html_template, selected_printer);


         /* For Zamrud : AUTO PRINT VIEW */
         if(0){
            setTimeout(function(){

               postContentToView(html_template);

               function postContentToView(html_template){
                  var selected_printer_view = null;
                  var b = 0;
                  while(allActivePrinters[b]){
                        if(allActivePrinters[b].type == 'VIEW'){
                           selected_printer_view = allActivePrinters[b].list[0];
                           break;
                        }
                        b++;
                  }

                  if(selected_printer_view && selected_printer_view != '' && selected_printer_view != null){
                     ipc.send("printBillDocument", html_template, selected_printer_view);
                  }
                  else{
                     showToast('Print Error: Print failed. No printer configured for printing Views', '#e74c3c');   
                     return '';
                  }
               }
            }, 2000);
         }
            


        }
        else{
         showToast('Print Error: Print failed. No printer configured for '+type, '#e74c3c');   
         return '';
        }
}


function printMessageInKitchen(messageObject, optionalTargetPrinter){

 var allActivePrinters = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

 if(allActivePrinters.length == 0){
   showToast('Print Error: No configured printers found. Print failed. Please contact Accelerate Support.', '#e74c3c');
   return '';
 }

var kot_header_content = ''+
      '<div class="KOTHeader" style="min-height: unset">'+
         '<table style="width: 100%">'+
            '<col style="width: 30%">'+
            '<col style="width: 40%">'+
            '<col style="width: 30%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                  '<p>'+
                     '<tag class="subLabel">FROM</tag>'+
                     '<tag class="KOTNumber">'+messageObject.user+'</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top">'+
                  '<p style="margin: 0">'+
                     '<tag class="serviceType" style="font-size: 16px; font-weight: bold;">MESSAGE</tag>'+
                  '</p>'+
               '</td>'+
               '<td style="vertical-align: top;">'+
                  '<p style=" text-align: right; float: right">'+
                     '<tag class="subLabel">TIME</tag>'+
                     '<tag class="timeStamp" style="font-size: 14px; font-weight: bold;">'+getFancyTime(messageObject.time)+'</tag>'+
                  '</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';

var html_template = kot_header_content +
      '<table style="width: 100%">'+
            '<col style="width: 100%">'+
            '<tr>'+
               '<td style="vertical-align: top">'+
                     '<p>'+
                        '<tag style="margin-top: 10px; font-size: 21px; line-height: 1.5em; font-weight: bold;">'+messageObject.message+'</tag>'+
                     '</p>'+  
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';


         var selected_printer = null;

         if(!optionalTargetPrinter || optionalTargetPrinter == '' || optionalTargetPrinter == undefined){
            var b = 0;
            while(allActivePrinters[b]){
               if(allActivePrinters[b].type == 'KOT'){
                  selected_printer = allActivePrinters[b].list[0];
                  break;
               }
               b++;
            }
         }
         else if(optionalTargetPrinter != ''){
            selected_printer = optionalTargetPrinter;
         }


        if(selected_printer && selected_printer != '' && selected_printer != null){
         ipc.send("printBillDocument", html_template, selected_printer);
        }
        else{
         showToast('Print Error: Print failed. No printer configured for '+type, '#e74c3c');   
         return '';
        }
}



function testPrinterWorking(targetPrinter, sample_code){

         var selected_printer = null;

         if(!targetPrinter || targetPrinter == '' || targetPrinter == undefined){
            showToast('Print Error: No target printer mentioned.', '#e74c3c');   
            return '';
         }
         else if(targetPrinter != ''){
            selected_printer = targetPrinter;
         }


          var allActivePrinters = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];

          if(allActivePrinters.length == 0){
            showToast('Print Error: No configured printers found. Print failed. Please contact Accelerate Support.', '#e74c3c');
            return '';
          }


 var current_time = moment().format('hh:mm:ss a | Do MMMM, YYYY');


 var html_template = ''+
      '<table style="width: 100%; margin: 20px 0">'+
            '<col style="width: 100%">'+
            '<tr>'+
               '<td style="border: 2px solid #444; padding: 6px 2px; margin: 5px 0">'+
                     '<p style="margin: 10px 0; text-align: center; font-size: 21px; line-height: 1.5em; font-weight: bold;">Test '+targetPrinter.name+'</p>'+
                     '<h1 style="font-size: 38px; margin:0; text-align: center; letter-spacing: 5px; font-weight: bold;">'+sample_code+'</h1>'+
                     '<p style="margin: 5px 0; text-align: center;">'+current_time+'</p>'+
               '</td>'+
            '</tr>'+
         '</table>'+
      '</div>';


        if(selected_printer && selected_printer != '' && selected_printer != null){
         ipc.send("printBillDocument", html_template, selected_printer);
        }
        else{
         showToast('Print Error: Print failed.', '#e74c3c');   
         return '';
        }
}

