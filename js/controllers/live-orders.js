function renderAllKOTs() {

    document.getElementById("fullKOT").innerHTML = '';

    dirname = './data/KOT'
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            showToast('System Error: Unable to load Live Orders. Please contact Accelerate Support.', '#e74c3c');
            return;
        }


        filenames.forEach(function(filename) {
            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, data) {
                if (err) {
                    showToast('System Error: Unable to load a few Live Orders. Please contact Accelerate Support.', '#e74c3c');
                    return;
                } else {

                    if(filename.toLowerCase().indexOf(".json") < 0){ //Neglect any files other than JSON
                        return '';
                    }


                    var kot = JSON.parse(data);

                    if(kot.orderDetails.modeType == 'DINE'){
                        var i = 0;
                        var fullKOT = "";
                        var begKOT = "";
                        var itemsInCart = "";
                        var items = "";

                        begKOT = '<li> <a href="#" onclick="liveOrderOptions(\''+encodeURI(JSON.stringify(kot))+'\')"> <h2>' + kot.KOTNumber + ' <tag class="tableName">'+kot.table+'</tag></h2><div class="itemList"> <table>';
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
                        finalRender(fullKOT)
                    }
                }

            });
        });


    });
}

function finalRender(fullKOT) {
    document.getElementById("fullKOT").innerHTML = document.getElementById("fullKOT").innerHTML + fullKOT;
}


function liveOrderOptions(encodedKOT){
    
    var kot = JSON.parse(decodeURI(encodedKOT));

    document.getElementById("liveOrderOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+kot.table+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="pushToEditKOT(\''+encodedKOT+'\')">Edit Order</button>'+ 
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="pickTableForTransferOrder(\''+kot.table+'\', \''+kot.KOTNumber+'\')">Change Table</button>'+ 
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="liveOrderOptionsClose(); generateBillFromKOT(\''+kot.KOTNumber+'\', \'LIVE_ORDERS\')">Generate Bill</button>'+ 
                  '<button class="btn btn-danger tableOptionsButtonBig" onclick="cancelKOTOrder(\''+kot.KOTNumber+'\')">Cancel Order</button>'+  
                  '<button class="btn btn-default tableOptionsButton" onclick="liveOrderOptionsClose()">Close</button>';

    document.getElementById("liveOrderOptionsModal").style.display = 'block';
}

function liveOrderOptionsClose(){
    document.getElementById("liveOrderOptionsModal").style.display = 'none';
}



/* cancel the KOT */
function cancelKOTOrder(kotID){

}



/*Add to edit KOT*/
function pushToEditKOT(encodedKOT){
    
    var kot = JSON.parse(decodeURI(encodedKOT));
   
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
        document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
                                                '<button type="button" class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
    }    

    overWriteCurrentOrder(encodedKOT)
}

function overWriteCurrentOrderModalClose(){
    document.getElementById("overWriteCurrentOrderModal").style.display = 'none';  
}

function overWriteCurrentOrder(encodedKOT){
    var kot = JSON.parse(decodeURI(encodedKOT));

    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.mappedAddress = kot.table;
    customerInfo.mode = kot.orderDetails.mode;
    customerInfo.modeType = kot.orderDetails.modeType;
    customerInfo.reference = kot.orderDetails.reference;

    //Pending new order will be removed off the cart.
    window.localStorage.zaitoon_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);
    window.localStorage.edit_KOT_originalCopy = decodeURI(encodedKOT);
    renderPage('new-order', 'Running Order');
}



/* transfer KOT to different table */

/* Seat selector */

function pickTableForTransferOrder(currentTableID, kotID){

            liveOrderOptionsClose();

            //PRELOAD TABLE MAPPING
            if(fs.existsSync('./data/static/tablemapping.json')) {
                fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
              if (err){
              } else {

                    if(data == ''){ data = '[]'; }

                      var tableMapping = JSON.parse(data);
                      tableMapping.sort(); //alphabetical sorting 
                      window.localStorage.tableMappingData = JSON.stringify(tableMapping);

                      //PRELOAD TABLES
            
                          if(fs.existsSync('./data/static/tables.json')) {
                            fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
                          if (err){
                              showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
                          } else {

                              if(data == ''){ data = '[]'; }

                                  var tables = JSON.parse(data);
                                  tables.sort(); //alphabetical sorting 


                                 //PRELOAD TABLE SECTIONS
                                if(fs.existsSync('./data/static/tablesections.json')) {
                                    fs.readFile('./data/static/tablesections.json', 'utf8', function readFileCallback(err, data){
                                  if (err){
                                      showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
                                  } else {

                                      if(data == ''){ data = '[]'; }

                                          var tableSections = JSON.parse(data);
                                          tableSections.sort(); //alphabetical sorting 

                                

                                        if(0){
                                          
                                        }
                                        else{
                                          var renderSectionArea = '';

                                          var n = 0;
                                          while(tableSections[n]){
                                    
                                            var renderTableArea = ''
                                            for(var i = 0; i<tables.length; i++){
                                                if(tables[i].type == tableSections[n]){

                                                    var tableOccupancyData = getTransferTableLiveStatus(tables[i].name);

                                                    if(tableOccupancyData){ /*Occuppied*/
                                                        if(tableOccupancyData.status == 1){
                                                            if(currentTableID != '' && currentTableID == tables[i].name){
                                                            renderTableArea = renderTableArea + '<tag class="tableTileBlue" onclick="transferKOTAfterProcess(\''+tables[i].name+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle">'+tables[i].name+'</tag>'+
                                                                                                '<tag class="tableCapacity">Current Table</tag>'+
                                                                                                '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                                '</tag>';   
                                                            }   
                                                            else{
                                                                    renderTableArea = renderTableArea + '<tag class="tableTileRedDisable">'+
                                                                                            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo">Occuppied</tag>'+
                                                                                            '</tag>';                                                       
                                                            }
                                                        }                                   
                                                        else if(tableOccupancyData.status == 5){
                                                            if(currentTableID != '' && currentTableID == tables[i].name){
                                                            renderTableArea = renderTableArea + '<tag class="tableTileBlue" onclick="transferKOTAfterProcess(\''+tables[i].name+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle">'+tables[i].name+'</tag>'+
                                                                                                '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ""? "For "+tableOccupancyData.assigned : "-")+'</tag>'+
                                                                                                '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                                '</tag>';   
                                                            }   
                                                            else{
                                                            renderTableArea = renderTableArea + '<tag class="tableReserved" onclick="transferKOTAfterProcess(\''+tables[i].name+'\', \''+kotID+'\')">'+
                                                                                                '<tag class="tableTitle">'+tables[i].name+'</tag>'+
                                                                                                '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ""? "For "+tableOccupancyData.assigned : "-")+'</tag>'+
                                                                                                '<tag class="tableInfo">Reserved</tag>'+
                                                                                                '</tag>';   
                                                            }

                                                        }                                   
                                                        else{
                                                        renderTableArea = renderTableArea + '<tag class="tableTileRedDisable">'+
                                                                                            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo">Occuppied</tag>'+
                                                                                            '</tag>';                                           
                                                        }

                                                    }
                                                    else{

                                                        if(currentTableID != '' && currentTableID == tables[i].name){
                                                            renderTableArea = renderTableArea + '<tag onclick="transferKOTAfterProcess(\''+tables[i].name+'\', \''+kotID+'\')" class="tableTileBlue">'+
                                                                                            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
                                                                                            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
                                                                                            '<tag class="tableInfo" style="color: #FFF"><i class="fa fa-check"></i></tag>'+
                                                                                            '</tag>';
                                                        }   
                                                        else{
                                                            renderTableArea = renderTableArea + '<tag onclick="transferKOTAfterProcess(\''+tables[i].name+'\', \''+kotID+'\')" class="tableTileGreen">'+
                                                                                            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
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
                                }
                                });
                                  } else {
                                    showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
                                  } 

                        }
                        });
                          } else {
                            showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
                          } 


            }
            });
             }
}


function pickTableForTransferOrderHide(){
    document.getElementById("pickTableForTransferOrderModalContent").innerHTML = '';
    document.getElementById("pickTableForTransferOrderModal").style.display = 'none';
}



function getTransferTableLiveStatus(tableID){
    /*returns table occupancy data*/
    if(!window.localStorage.tableMappingData){
        return '';
    }

    var tableMapData = JSON.parse(window.localStorage.tableMappingData);

    var n = 0;
    while(tableMapData[n]){
        if(tableMapData[n].table == tableID){
            return tableMapData[n];
        }
        n++;
    }

    return '';
}


function transferKOTAfterProcess(tableNumber, kotID){


    /*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {

          var kotfile = JSON.parse(data);

          if(kotfile.table == tableNumber){ //same table
            return '';
          }

          if(kotfile.orderDetails.modeType != 'DINE'){
            showToast('Meh? Order is not a Dine-In order', '#e67e22');
            return '';
          }

          kotfile.table = tableNumber;

          console.log('WRITE CODE: TO SEND KOT TO KITCHEN --> Table Changed')


          var json = JSON.stringify(kotfile); //convert it back to json
          var file = './data/KOT/'+kotID+'.json';
          fs.writeFile(file, json, 'utf8', (err) => {
              if(err){
                showToast('System Error: Unable to transfer the Order. Please contact Accelerate Support.', '#e74c3c');
              }
              else{          
                    showToast('Order transfered to Table '+tableNumber+' Successfully', '#27ae60');
                    pickTableForTransferOrderHide();  
                    liveOrderOptionsClose();    
                    renderAllKOTs();          
              }
                 
           });


    }});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  

}


