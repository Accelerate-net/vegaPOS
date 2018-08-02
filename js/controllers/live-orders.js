function renderAllKOTs() {

    document.getElementById("fullKOT").innerHTML = '';

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
            while(runningKOTList[n]){

                var requestData = { "selector" :{ "_id": runningKOTList[n].id }}

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

                            if(n == 0){
                                document.getElementById("liveKOTMain").innerHTML = '<div class="col-xs-12 kotListing"> <ul id="fullKOT"> </ul> </div>';
                            }

                            if(kot.orderDetails.modeType == 'DINE'){
                                var i = 0;
                                var fullKOT = "";
                                var begKOT = "";
                                var itemsInCart = "";
                                var items = "";

                                begKOT = '<li> <a href="#" onclick="liveOrderOptions(\''+kot.KOTNumber+'\')"> <h2>' + kot.KOTNumber + ' <tag class="tableName">'+kot.table+'</tag></h2><div class="itemList"> <table>';
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
                  }
                });  

                n++;        
            }
        }
        else{
          document.getElementById("liveKOTMain").innerHTML = '<tag style="font-size: 32px; font-weight: 200; color: #cecfd0; text-align: center; padding-top: 25%; display: block">No active Dine orders</tag>';
          return '';
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOTs data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    }); 
}


function finalRender(fullKOT) {
    document.getElementById("fullKOT").innerHTML = document.getElementById("fullKOT").innerHTML + fullKOT;
}


function liveOrderOptions(kotID){
 
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

          document.getElementById("liveOrderOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+kot.table+'</b></h1>'+
                        '<button class="btn btn-success tableOptionsButtonBig" onclick="pushToEditKOT(\''+kotID+'\')"><i class="fa fa-pencil-square-o" style=""></i><tag style="padding-left: 15px">Edit Order</tag></button>'+ 
                        '<button class="btn btn-success tableOptionsButtonBig" onclick="pickTableForTransferOrder(\''+kot.table+'\', \''+kot.KOTNumber+'\')"><i class="fa fa-exchange" style=""></i><tag style="padding-left: 15px">Change Table</tag></button>'+ 
                        '<button class="btn btn-success tableOptionsButtonBig" onclick="liveOrderOptionsClose(); generateBillFromKOT(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-file-text-o" style=""></i><tag style="padding-left: 15px">Generate Bill</tag></button>'+ 
                        '<button class="btn btn-danger tableOptionsButtonBig" onclick="cancelRunningKOTOrder(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')"><i class="fa fa-ban" style=""></i><tag style="padding-left: 15px">Cancel Order</tag></button>'+  
                        '<button class="btn btn-default tableOptionsButton" onclick="liveOrderOptionsClose()">Close</button>';

          document.getElementById("liveOrderOptionsModal").style.display = 'block';

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
              document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Close</button>'+
                                                      '<button type="button" class="btn btn-danger" onclick="overWriteCurrentOrderConsent(\''+(encodeURI(JSON.stringify(kot)))+'\')">Proceed to Over Write</button>';
          
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
                                                                renderTableArea = renderTableArea + '<tag class="tableTileBlue" onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                                '<tag class="tableCapacity">Current Table</tag>'+
                                                                                                '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                                '</tag>';   
                                                            }   
                                                            else{
                                                                renderTableArea = renderTableArea + '<tag class="tableTileRedDisable">'+
                                                                                            '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo">Running</tag>'+
                                                                                            '</tag>';                                                       
                                                            }
                                                        }                                   
                                                        else if(tables[i].status == 5){
                                                            if(currentTableID != '' && currentTableID == tables[i].table){
                                                                renderTableArea = renderTableArea + '<tag class="tableTileBlue" onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                                '<tag class="tableCapacity">'+(tables[i].assigned != ""? "For "+tables[i].assigned : "-")+'</tag>'+
                                                                                                '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                                '</tag>';   
                                                            }   
                                                            else{
                                                                renderTableArea = renderTableArea + '<tag class="tableReserved" onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                                '<tag class="tableCapacity">'+(tables[i].assigned != ""? "For "+tables[i].assigned : "-")+'</tag>'+
                                                                                                '<tag class="tableInfo">Reserved</tag>'+
                                                                                                '</tag>';   
                                                            }

                                                        }                                   
                                                        else{
                                                            renderTableArea = renderTableArea + '<tag class="tableTileRedDisable">'+
                                                                                            '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo">Running</tag>'+
                                                                                            '</tag>';                                           
                                                        }

                                                    }
                                                    else{

                                                        if(currentTableID != '' && currentTableID == tables[i].table){
                                                            renderTableArea = renderTableArea + '<tag onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')" class="tableTileBlue">'+
                                                                                            '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                            '</tag>';
                                                        }   
                                                        else{
                                                            renderTableArea = renderTableArea + '<tag onclick="transferKOTAfterProcess(\''+tables[i].table+'\', \''+kotID+'\')" class="tableTileGreen">'+
                                                                                            '<tag class="tableTitle">'+tables[i].table+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo">Free</tag>'+
                                                                                            '</tag>';
                                                        }                                                                   
                                                    }

                                                }
                                            }

                                            renderSectionArea = renderSectionArea + '<div class="row" style="margin: 0">'+
                                                                       '<h1 class="seatingPlanHead">'+tableSections[n]+'</h1>'+
                                                                       '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
                                                                        '</div>'+
                                                                    '</div>'

                                            n++;
                                          }
                                          
                                          document.getElementById("pickTableForTransferOrderModalContent").innerHTML = renderSectionArea;                        
                                          document.getElementById("pickTableForTransferOrderModal").style.display = 'block'; 
                                    
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

    console.log('transfer', tableNumber, kotID)

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
                var oldValueDetected = false;

                for(var i=0; i<tableMapping.length; i++){
                  
                  if(tableMapping[i].table == old){ 

                    oldValueDetected = true;

                    if(nextIndex == -1){ // OLD Table < NEW Table
                      memory_status = tableMapping[i].status;
                      memory_assigned = tableMapping[i].assigned;
                      memory_KOT = tableMapping[i].KOT;
                      memory_lastTime = tableMapping[i].lastUpdate;

                      tableMapping[i].status = 0;
                      tableMapping[i].assigned = "";
                      tableMapping[i].KOT = "";
                      tableMapping[i].lastUpdate = "";
                      console.log('Swapped @1')
                    }
                    else{
                      tableMapping[i].status = 0;
                      tableMapping[i].assigned = "";
                      tableMapping[i].KOT = "";
                      tableMapping[i].lastUpdate = ""; 

                      tableMapping[nextIndex].status = memory_status;
                      tableMapping[nextIndex].assigned = memory_assigned;
                      tableMapping[nextIndex].KOT = memory_KOT;
                      tableMapping[nextIndex].lastUpdate = memory_lastTime; 
                      console.log('Swapped @2')

                      break;
                    }
                  }
                  else if(tableMapping[i].table == newTable){
                    nextIndex = i;

                    if(oldValueDetected){
                      tableMapping[nextIndex].status = memory_status;
                      tableMapping[nextIndex].assigned = memory_assigned;
                      tableMapping[nextIndex].KOT = memory_KOT;
                      tableMapping[nextIndex].lastUpdate = memory_lastTime;    
                      console.log('Swapped @3')  

                      break;                
                    }
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


