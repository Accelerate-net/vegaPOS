
function switchLiveOrderRenderType(){
  
  var filterLiveOrdersFlag = window.localStorage.filterLiveOrdersKOTFlag ? window.localStorage.filterLiveOrdersKOTFlag : 'DINE';

  if(filterLiveOrdersFlag == 'DINE'){
    window.localStorage.filterLiveOrdersKOTFlag = 'OTHER';
    $('#switchLiveOrderRenderTypeButton').html('Showing Delivery and Parcel Orders');
    renderAllKOTs();
  }
  else{
    window.localStorage.filterLiveOrdersKOTFlag = 'DINE';
    $('#switchLiveOrderRenderTypeButton').html('Showing Dine Orders');
    renderAllKOTs();
  }

}

function getAddressFormattedLive(kot){

  if(kot.orderDetails.modeType == 'PARCEL'){
    return (kot.customerName != "" ? '<b>'+kot.customerName+'</b>' : '') + (kot.customerMobile != '' ? '<tag style="display: block">Mob. '+kot.customerMobile+'</tag>' : '');
  }
  else if(kot.orderDetails.modeType == 'TOKEN'){
    return "Token <b>#"+kot.table+"</b>";
  }
  else if(kot.orderDetails.modeType == 'DELIVERY'){
    var address = JSON.parse(decodeURI(kot.table));
    
    var result = (address.name != '' ? '<b>'+address.name+'</b><br>' : '')+
    (address.flatNo != '' ? address.flatNo+', ' : '') + (address.flatName != '' ? address.flatName+'<br>' : '<br>')+
    (address.landmark != '' ? address.landmark+', ' : '') + (address.area != '' ? address.area+'<br>' : '<br>')+
    (address.contact != '' ? 'Mob. <b>'+address.contact+'</b>' : '');
    return result;
  }
}

function renderAllKOTs() {

    var filterLiveOrdersFlag = window.localStorage.filterLiveOrdersKOTFlag ? window.localStorage.filterLiveOrdersKOTFlag : 'DINE';
    if(filterLiveOrdersFlag == 'DINE'){
      $('#switchLiveOrderRenderTypeButton').html('Showing Dine Orders');
    }
    else{
      $('#switchLiveOrderRenderTypeButton').html('Showing Delivery and Parcel Orders');
    }

    $('#switchLiveOrderRenderTypeButton').removeClass('hiddenLiveButton');
    document.getElementById("switchLiveOrderRenderTypeButton").style.display = 'block';


    //document.getElementById("fullKOT").innerHTML = '';

    var runningKOTList = [];

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_all_docs',
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.total_rows > 0){
            
            runningKOTList = data.rows;

            var n = 0;
            var running_count_dine = 0;
            var running_count_other = 0;

            while(runningKOTList[n]){

                var requestData = { "selector" :{ "_id": runningKOTList[n].id }}
                var tempStore = n;

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

                            if(filterLiveOrdersFlag == 'DINE'){

                              if(running_count_dine == 0){
                                  document.getElementById("liveKOTMain").innerHTML = '<div class="col-xs-12 kotListing"> <ul id="fullKOT"> </ul> </div>';
                              }

                              if(kot.orderDetails.modeType == 'DINE'){

                                  running_count_dine++;

                                  var i = 0;
                                  var fullKOT = "";
                                  var begKOT = "";
                                  var itemsInCart = "";
                                  var items = "";

                                  begKOT = '<li> <a href="#" '+getColorPaper(kot.timeKOT == '' ? kot.timePunch : kot.timeKOT)+' onclick="liveOrderOptions(\''+kot.KOTNumber+'\')"> <h2>' + kot.KOTNumber + ' <tag class="tableName">'+kot.table+'</tag></h2><div class="itemList"> <table>';
                                  while (i < kot.cart.length) {
                                      itemsInCart = itemsInCart + '<tr> <td class="name">' +(kot.cart[i].isCustom ? kot.cart[i].name+' ('+kot.cart[i].variant+')' : kot.cart[i].name )+ '</td> <td class="price">x ' + kot.cart[i].qty + '</td> </tr>';
                                      i++;
                                  }

                                  items = begKOT + itemsInCart + '</table> </div>'+(i > 6?'<more class="more">More Items</more>':'')+
                                                          '<tag class="bottomTag">'+
                                                          '<p class="tagSteward">' +(kot.stewardName != ''? kot.stewardName   : 'Unknown Staff')+ '</p>'+
                                                          '<p class="tagUpdate">'+(kot.timeKOT == ''? 'First KOT Printed '+getFormattedTime(kot.timePunch)+' ago': 'KOT Edited '+getFormattedTime(kot.timeKOT)+' ago' )+'</p>'+
                                                          '</tag> </a>';

                                  fullKOT = fullKOT + items + '</li>';
                                  finalRender(fullKOT);
                              }
                            }
                            else{

                              if(running_count_other == 0){
                                  document.getElementById("liveKOTMain").innerHTML =  '<div class="col-xs-12 kotListing"><div class="col-xs-12 kotListing" style="padding: 45px 40px">'+
                                                                                      '<div class="box box-primary">'+
                                                                                        '<div class="box-body">'+
                                                                                            '<div class="box-header" style="padding: 10px 0px">'+
                                                                                               '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Active Non-Dine Orders</h3>'+
                                                                                            '</div>'+
                                                                                            '<div class="table-responsive">'+
                                                                                                '<table class="table" style="margin: 0">'+
                                                                                                    '<col width="20%"><col width="40%"><col width="20%"><col width="20%">'+
                                                                                                    '<thead style="background: #f4f4f4;">'+
                                                                                                        '<tr>'+
                                                                                                            '<th style="text-align: left">KOT No.</th>'+
                                                                                                            '<th style="text-align: left">Order Summary</th>'+
                                                                                                            '<th style="text-align: center">Punched</th>'+
                                                                                                            '<th style="text-align: left">Reference</th>'+
                                                                                                        '</tr>'+
                                                                                                    '</thead>'+
                                                                                                '</table>'+
                                                                                                '<table class="table" style="margin: 0">'+
                                                                                                    '<col width="20%"><col width="40%"><col width="20%"><col width="20%">'+
                                                                                                    '<tbody id="fullKOT"></tbody>'+
                                                                                                '</table>'+
                                                                                            '</div>'+
                                                                                            '<div class="clearfix"></div>'+
                                                                                        '</div>'+
                                                                                    '</div>'+
                                                                                    '</div></div>';
                              }

                              if(kot.orderDetails.modeType != 'DINE'){
                                  
                                    running_count_other++;

                                    var n = 0;
                                    var itemsList = '';
                                    while(kot.cart[n]){
                                      itemsList = itemsList + kot.cart[n].name + (kot.cart[n].isCustom ? '- '+kot.cart[n].variant : '') + ' ('+kot.cart[n].qty+'). ';
                                      n++;
                                    }

                                    var tableList =               '<tr style="font-size: 16px;" class="liveOrderNonDine" onclick="liveOrderOptionsNonDine(\''+kot.KOTNumber+'\')">'+
                                                                      '<td><b>#'+kot.KOTNumber+'</b><tag style="display: block; color: #dc2e6f">'+kot.orderDetails.modeType+'</tag>'+(kot.orderDetails.reference != '' ? '<tag style="display: block; color: gray">Ref. <b>'+kot.orderDetails.reference+'</b></tag>' : '')+'</td>'+
                                                                      '<td style="font-size: 95%">'+itemsList+'</td>'+
                                                                      '<td style="text-align: center">'+getFormattedTime(kot.timePunch)+' ago</td>'+
                                                                      '<td style="text-align: left; font-size: 14px;">'+getAddressFormattedLive(kot)+'</td>'+
                                                                  '</tr>';
 
                                  finalRender(tableList); 
                                                           
                              }
                          } //Else
                    } //data.docs
                    
                   
                    if(tempStore == runningKOTList.length - 1){ //last iteration
                      if(filterLiveOrdersFlag == 'DINE'){
                        if(running_count_dine == 0){
                          document.getElementById("liveKOTMain").innerHTML = '<tag style="font-size: 32px; font-weight: 200; color: #cecfd0; text-align: center; padding-top: 25%; display: block">No active Dine Orders</tag>';
                        }
                      }
                      else{
                        if(running_count_other == 0){
                          document.getElementById("liveKOTMain").innerHTML = '<tag style="font-size: 32px; font-weight: 200; color: #cecfd0; text-align: center; padding-top: 25%; display: block">No active Non-Dine Orders</tag>';
                        }
                      }
                    }


                  }//Success

                });  

                n++;   
            }


        }
        else{
          document.getElementById("liveKOTMain").innerHTML = '<tag style="font-size: 32px; font-weight: 200; color: #cecfd0; text-align: center; padding-top: 25%; display: block">No active Orders</tag>';
          
          setTimeout(function(){
            $('#switchLiveOrderRenderTypeButton').addClass('hiddenLiveButton'); 
          }, 500);

          setTimeout(function(){
            document.getElementById("switchLiveOrderRenderTypeButton").style.display = 'none'; 
          }, 2499);

          return '';
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    }); 
}

function getColorPaper(lastUpdate){
  
  var recordedTime = moment(lastUpdate, 'hhmm');
  var timeNow = moment(new Date(), 'hhmm');
  var duration = (moment.duration(timeNow.diff(recordedTime))).asSeconds();

  if(duration < 0){
    var midnight = moment('2359', 'hhmm');
    var firstDuration = (moment.duration(recordedTime.diff(midnight))).asSeconds();
    var secondDuration = (moment.duration(midnight.diff(timeNow))).asSeconds();
    duration = firstDuration + secondDuration;
  }

  if(duration > 900 && duration < 1800){ //More than 15 minutes
    return 'style="background: #ffc"'; //Yellow
  }
  else if(duration >= 1800){ //More than 30 Minutes
    return 'style="background: #fcc"'; //Red
  }
  
}


function finalRender(fullKOT) {
  document.getElementById("fullKOT").innerHTML += fullKOT;
}

function liveOrderOptionsNonDine(kotID){

  // LOGGED IN USER INFO

  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  //either profile not chosen, or not an admin
  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }



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
          var kot = data.docs[0];

          if(isUserAnAdmin){
            document.getElementById("liveOrderOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader"><b>'+kot.KOTNumber+'</b> - '+kot.orderDetails.modeType+'</h1>'+
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="liveOrderOptionsNonDineClose(); generateBillFromKOT(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-file-text-o" style=""></i><tag style="padding-left: 15px">Generate Bill</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+ 
                        '<button class="btn btn-danger tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="cancelRunningKOTOrder(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-ban" style=""></i><tag style="padding-left: 15px">Cancel Order</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+  
                        '<button class="btn btn-default tableOptionsButton" onclick="liveOrderOptionsNonDineClose()">Close</button>';
          }
          else{
            document.getElementById("liveOrderOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader"><b>'+kot.KOTNumber+'</b> - '+kot.orderDetails.modeType+'</h1>'+
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="liveOrderOptionsNonDineClose(); generateBillFromKOT(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-file-text-o" style=""></i><tag style="padding-left: 15px">Generate Bill</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+ 
                        '<button class="btn btn-default tableOptionsButton" onclick="liveOrderOptionsNonDineClose()">Close</button>';
          }


          document.getElementById("liveOrderOptionsModal").style.display = 'block';


          /*
            EasySelect Tool (LISTS)
          */
          var li = $('#liveOrderOptionsModalContent .easySelectTool_liveOrderOption');
          var liSelected = li.eq(0).addClass('selectOptionLiveOrder');

          var easySelectTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#liveOrderOptionsModal').is(':visible')) {

                 switch(e.which){
                  case 38:{ //  ^ Up Arrow 

                    if(liSelected){
                        liSelected.removeClass('selectOptionLiveOrder');
                        next = liSelected.prev();
                      if(next.length > 0){
                        liSelected = next.addClass('selectOptionLiveOrder');
                      }else{
                        liSelected = li.last().addClass('selectOptionLiveOrder');
                      }
                    }else{
                      liSelected = li.last().addClass('selectOptionLiveOrder');
                    }                      

                    break;
                  }
                  case 40:{ // Down Arrow \/ 

                    if(liSelected){
                      liSelected.removeClass('selectOptionLiveOrder');
                      next = liSelected.next();
                      if(next.length > 0){
                        liSelected = next.addClass('selectOptionLiveOrder');
                      }else{
                        liSelected = li.eq(0).addClass('selectOptionLiveOrder');
                      }
                    }else{
                      liSelected = li.eq(0).addClass('selectOptionLiveOrder');
                    }

                    break;
                  }
                  case 27:{ // Escape (Close)
                    document.getElementById("liveOrderOptionsModal").style.display ='none';
                    easySelectTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)

                    $("#liveOrderOptionsModal .easySelectTool_liveOrderOption").each(function(){
                      if($(this).hasClass("selectOptionLiveOrder")){
                        $(this).click();
                        e.preventDefault(); 
                        easySelectTool.unbind();   
                      }
                    });    

                    break;
                  }
                 }
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

function liveOrderOptionsNonDineClose(){
    document.getElementById("liveOrderOptionsModal").style.display = 'none';
}



function liveOrderOptions(kotID){


  // LOGGED IN USER INFO

  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  //either profile not chosen, or not an admin
  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }


 
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
          var kot = data.docs[0];

          if(isUserAnAdmin){
            document.getElementById("liveOrderOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+kot.table+'</b></h1>'+
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="pushToEditKOT(\''+kotID+'\')"><i class="fa fa-pencil-square-o" style=""></i><tag style="padding-left: 15px">Edit Order</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+ 
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="pickTableForTransferOrder(\''+kot.table+'\', \''+kot.KOTNumber+'\')"><i class="fa fa-exchange" style=""></i><tag style="padding-left: 15px">Change Table</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+ 
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="liveOrderOptionsClose(); generateBillFromKOT(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-file-text-o" style=""></i><tag style="padding-left: 15px">Generate Bill</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+ 
                        '<button class="btn btn-danger tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="cancelRunningKOTOrder(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-ban" style=""></i><tag style="padding-left: 15px">Cancel Order</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+  
                        '<button class="btn btn-default tableOptionsButton" onclick="liveOrderOptionsClose()">Close</button>';
          }
          else{
            document.getElementById("liveOrderOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+kot.table+'</b></h1>'+
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="pushToEditKOT(\''+kotID+'\')"><i class="fa fa-pencil-square-o" style=""></i><tag style="padding-left: 15px">Edit Order</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+
                        '<button class="btn btn-success tableOptionsButtonBig easySelectTool_liveOrderOption" onclick="liveOrderOptionsClose(); generateBillFromKOT(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-file-text-o" style=""></i><tag style="padding-left: 15px">Generate Bill</tag><tag class="listSelectionIcon"><i class="fa fa-caret-right"></i></tag></button>'+
                        '<button class="btn btn-default tableOptionsButton" onclick="liveOrderOptionsClose()">Close</button>';
          }

          document.getElementById("liveOrderOptionsModal").style.display = 'block';


          /*
            EasySelect Tool (LISTS)
          */
          var li = $('#liveOrderOptionsModalContent .easySelectTool_liveOrderOption');
          var liSelected = li.eq(0).addClass('selectOptionLiveOrder');

          var easySelectTool = $(document).on('keydown',  function (e) {
            console.log('Am secretly running...')
            if($('#liveOrderOptionsModal').is(':visible')) {

                 switch(e.which){
                  case 38:{ //  ^ Up Arrow 

                    if(liSelected){
                        liSelected.removeClass('selectOptionLiveOrder');
                        next = liSelected.prev();
                      if(next.length > 0){
                        liSelected = next.addClass('selectOptionLiveOrder');
                      }else{
                        liSelected = li.last().addClass('selectOptionLiveOrder');
                      }
                    }else{
                      liSelected = li.last().addClass('selectOptionLiveOrder');
                    }                      

                    break;
                  }
                  case 40:{ // Down Arrow \/ 

                    if(liSelected){
                      liSelected.removeClass('selectOptionLiveOrder');
                      next = liSelected.next();
                      if(next.length > 0){
                        liSelected = next.addClass('selectOptionLiveOrder');
                      }else{
                        liSelected = li.eq(0).addClass('selectOptionLiveOrder');
                      }
                    }else{
                      liSelected = li.eq(0).addClass('selectOptionLiveOrder');
                    }

                    break;
                  }
                  case 27:{ // Escape (Close)
                    document.getElementById("liveOrderOptionsModal").style.display ='none';
                    easySelectTool.unbind();
                    break;  
                  }
                  case 13:{ // Enter (Confirm)

                    $("#liveOrderOptionsModal .easySelectTool_liveOrderOption").each(function(){
                      if($(this).hasClass("selectOptionLiveOrder")){
                        $(this).click();
                        e.preventDefault(); 
                        easySelectTool.unbind();   
                      }
                    });    

                    break;
                  }
                 }
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

function liveOrderOptionsClose(){
    document.getElementById("liveOrderOptionsModal").style.display = 'none';
}

function cancelRunningKOTOrder(kotID, pageRef){
  liveOrderOptionsClose();
  liveOrderOptionsNonDineClose();
  cancelRunningOrder(kotID, pageRef);
}


/*Add to edit KOT*/
function pushToEditKOT(kotID){
 
    liveOrderOptionsClose();

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
          var kot = data.docs[0];

          if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

              var alreadyEditingKOT = JSON.parse(window.localStorage.edit_KOT_originalCopy);
              if(alreadyEditingKOT.KOTNumber == kot.KOTNumber)//if thats the same order, neglect.
              {
                  renderPage('new-order', 'Editing Order');
                  return '';
              }
              else{
                  showToast('Warning! There is already an active order being modified. Please complete it to continue.', '#e67e22');
                  return '';
              }
          }

          if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){
              showToast('Warning! There is a new order being punched. Please complete it to continue.', '#e67e22');
              
              document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
              document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Close</button>'+
                                                      '<button class="btn btn-danger" onclick="overWriteCurrentOrderConsent(\''+(encodeURI(JSON.stringify(kot)))+'\')">Proceed to Over Write</button>';
          
              return '';
          }    

          overWriteCurrentOrder(kot);

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



function overWriteCurrentOrderModalClose(){
    document.getElementById("overWriteCurrentOrderModal").style.display = 'none';  
}

function overWriteCurrentOrderConsent(encodedKOT){
  var kot = JSON.parse(decodeURI(encodedKOT));
  overWriteCurrentOrder(kot);
}

function overWriteCurrentOrder(kot){

    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.count = kot.guestCount;
    customerInfo.mappedAddress = kot.table;
    customerInfo.mode = kot.orderDetails.mode;
    customerInfo.modeType = kot.orderDetails.modeType;
    customerInfo.reference = kot.orderDetails.reference;
    customerInfo.isOnline = kot.orderDetails.isOnline;


    if(kot.specialRemarks && kot.specialRemarks != ''){
      window.localStorage.specialRequests_comments = kot.specialRemarks;
    }
    else{
      window.localStorage.specialRequests_comments = '';
    }

    if(kot.allergyInfo && kot.allergyInfo != []){
      window.localStorage.allergicIngredientsData = JSON.stringify(kot.allergyInfo);
    }
    else{
      window.localStorage.allergicIngredientsData = '';
    }


    //Pending new order will be removed off the cart.
    window.localStorage.zaitoon_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);
    window.localStorage.edit_KOT_originalCopy = JSON.stringify(kot);
    renderPage('new-order', 'Running Order');
}



/* transfer KOT to different table */

/* Seat selector */

function pickTableForTransferOrder(currentTableID, kotID){

    liveOrderOptionsClose();
   
    //To display Large (default) or Small Tables
    var smallTableFlag = '';

    //PRELOAD TABLE MAPPING
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

              var tables = data.docs[0].value;
              tables.sort();
 
              if(tables.length < 50 && tables.length > 30){ //As per UI, it can include 30 large tables 
                smallTableFlag = ' mediumTile';
              }
              else if(tables.length > 50){
                smallTableFlag = ' smallTile';
              }
 
                    var requestData = {
                      "selector"  :{ 
                                    "identifierTag": "ZAITOON_TABLE_SECTIONS" 
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
                          if(data.docs[0].identifierTag == 'ZAITOON_TABLE_SECTIONS'){

                              var tableSections = data.docs[0].value;
                              tableSections.sort(); //alphabetical sorting 

  
                                          var renderSectionArea = '';

                                          var n = 0;
                                          while(tableSections[n]){
                                    
                                            var renderTableArea = ''
                                            for(var i = 0; i<tables.length; i++){
                                                if(tables[i].type == tableSections[n]){

                                                    if(tables[i].status != 0){ /*Occuppied*/
                                                        if(tables[i].status == 1){
                                                            if(currentTableID != '' && currentTableID == tables[i].table){
                                                                renderTableArea = renderTableArea + '<tag class="tableTileBlue'+smallTableFlag+'" onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                                '<tag class="tableCapacity'+smallTableFlag+'">Current Table</tag>'+
                                                                                                '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                                '</tag>';   
                                                            }   
                                                            else{
                                                                renderTableArea = renderTableArea + '<tag class="tableTileRedDisable'+smallTableFlag+'">'+
                                                                                            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
                                                                                            '</tag>';                                                       
                                                            }
                                                        }                                   
                                                        else if(tables[i].status == 5){
                                                            if(currentTableID != '' && currentTableID == tables[i].table){
                                                                renderTableArea = renderTableArea + '<tag class="tableTileBlue'+smallTableFlag+'" onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                                '<tag class="tableCapacity'+smallTableFlag+'">'+(tables[i].assigned != ""? "For "+tables[i].assigned : "-")+'</tag>'+
                                                                                                '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                                '</tag>';   
                                                            }   
                                                            else{
                                                                renderTableArea = renderTableArea + '<tag class="tableReserved'+smallTableFlag+'" onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                                '<tag class="tableCapacity'+smallTableFlag+'">'+(tables[i].assigned != ""? "For "+tables[i].assigned : "-")+'</tag>'+
                                                                                                '<tag class="tableInfo'+smallTableFlag+'">Reserved</tag>'+
                                                                                                '</tag>';   
                                                            }

                                                        }                                   
                                                        else{
                                                            renderTableArea = renderTableArea + '<tag class="tableTileRedDisable'+smallTableFlag+'">'+
                                                                                            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo'+smallTableFlag+'">Running</tag>'+
                                                                                            '</tag>';                                           
                                                        }

                                                    }
                                                    else{

                                                        if(currentTableID != '' && currentTableID == tables[i].table){
                                                            renderTableArea = renderTableArea + '<tag onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')" class="tableTileBlue'+smallTableFlag+'">'+
                                                                                            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo'+smallTableFlag+'" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                            '</tag>';
                                                        }   
                                                        else{
                                                            renderTableArea = renderTableArea + '<tag onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')" class="tableTileGreen'+smallTableFlag+'">'+
                                                                                            '<tag class="tableTitle'+smallTableFlag+'">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity'+smallTableFlag+'">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo'+smallTableFlag+'">Free</tag>'+
                                                                                            '</tag>';
                                                        }                                                                   
                                                    }

                                                }
                                            }

                                            renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
                                                                       '<h1 class="seatingPlanHead'+smallTableFlag+'">'+tableSections[n]+'</h1>'+
                                                                       '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
                                                                        '</div>'+
                                                                    '</div>'

                                            n++;
                                          }
                                          
                                          document.getElementById("pickTableForTransferOrderModalContent").innerHTML = renderSectionArea;                        
                                          document.getElementById("pickTableForTransferOrderModal").style.display = 'block'; 
                  
                                          var easyActionsTool = $(document).on('keydown',  function (e) {
                                            console.log('Am secretly running...')
                                            if($('#pickTableForTransferOrderModal').is(':visible')) {

                                                  if(e.which == 27){ // Escape (Close)
                                                    document.getElementById("pickTableForTransferOrderModal").style.display ='none';
                                                    easyActionsTool.unbind();
                                                  }

                                            }
                                          });

                          }
                          else{
                            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
                          }
                        }
                        else{
                          showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
                        }

                      },
                      error: function(data) {
                        showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
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


function pickTableForTransferOrderHide(){
    document.getElementById("pickTableForTransferOrderModalContent").innerHTML = '';
    document.getElementById("pickTableForTransferOrderModal").style.display = 'none';
}


function transferKOTAfterProcess(tableNumber, kotID){

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


          if(kotfile.table == tableNumber){ //same table
            return '';
          }

          if(kotfile.orderDetails.modeType != 'DINE'){
            showToast('Error: Order is not a Dine-In order', '#e67e22');
            return '';
          }

          var tableID_old = kotfile.table;
          var tableID_new = tableNumber;

          kotfile.table = tableNumber;

          console.log('WRITE CODE: TO SEND KOT TO KITCHEN --> Table Changed')

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
                    showToast('Order transfered to Table '+tableNumber+' Successfully', '#27ae60');
                    pickTableForTransferOrderHide();  
                    liveOrderOptionsClose();    
                    renderAllKOTs();  

                    console.log('********* CHANGE TABLE MAPPING!!!')
                    swapTableMapping(tableID_old, tableID_new);

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


function swapTableMapping(old, newTable){

  console.log('Swap', old, newTable)

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

                var nextIndex = -1;
                var memory_status, memory_assigned, memory_KOT, memory_lastTime;
                




                //Find Old Value
                for(var i=0; i<tableMapping.length; i++){
                  if(tableMapping[i].table == old){ 

                      memory_status = tableMapping[i].status;
                      memory_assigned = tableMapping[i].assigned;
                      memory_KOT = tableMapping[i].KOT;
                      memory_lastTime = tableMapping[i].lastUpdate;

                      tableMapping[i].status = 0;
                      tableMapping[i].assigned = "";
                      tableMapping[i].KOT = "";
                      tableMapping[i].lastUpdate = "";

                      replaceWithNewTable();

                      break;
                  }
                }


                function replaceWithNewTable(){
                  //Find New Table
                  for(var j=0; j<tableMapping.length; j++){
                    if(tableMapping[j].table == newTable){ 
                        tableMapping[j].status = memory_status;
                        tableMapping[j].assigned = memory_assigned;
                        tableMapping[j].KOT = memory_KOT;
                        tableMapping[j].lastUpdate = memory_lastTime; 

                        updateChangesOnServer();

                        break;
                    }     
                  }             
                }


                function updateChangesOnServer(){
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

                          },
                          error: function(data) {
                            showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                          }

                        });    
                }         

                    
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


