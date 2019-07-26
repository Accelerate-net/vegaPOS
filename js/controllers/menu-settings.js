function openMenuSettings(id, optionalHighlight){
	
	/*Tweak - Hide all */
	$( "#detailsDisplayMenuSettings" ).children().css( "display", "none" );
	document.getElementById(id).style.display = "block";

	switch(id){
    case "kitchenSections":{
      renderCurrentKOTRelays();
      break;
    } 
    case "menuCatalog":{
      renderMenuCatalog();
      break;
    }       
	}
}




//MENU CATALOG (for Taps devices)

function renderMenuCatalog(){

    //Preload menu categories
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
                  },
      "fields"    : ["identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

              var categories = data.docs[0].value;
              categories.sort(); //alphabetical sorting 

              loadCatalogData(categories);
          }
          else{
            showToast('Not Found Error: Menu Category data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu Category data not found.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Category data.', '#e74c3c');
      }

    });    
}


function loadCatalogData(categoriesList) {

    if(categoriesList.length == 0){
      document.getElementById("menuCatalogRenderPlane").innerHTML = '<p style="margin: 10px; color: #f12006; font-style: italic">No categories added yet. Please <b onclick="renderPage(\'manage-menu\', \'Manage Menu\');" style="color: #579eda; text-decoration: underline; cursor: pointer">Add a Category</b> and try again.</p>';
      return '';
    }

    //Preload menu catalog
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATALOG" 
                  },
      "fields"    : ["identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATALOG'){

              var catalogData = data.docs[0].value;

              catalogData.sort(function(doc1, doc2) { //sort by name
                if (doc1.name < doc2.name)
                  return -1;
  
                if (doc1.name > doc2.name)
                  return 1;
  
                return 0;
              });

              
              var renderContent = '';

              var n = 0;
              while(categoriesList[n]){

                      var registered_top_level_category = getTopLevelCategory(categoriesList[n]);
                      
                      renderContent += '<div class="row" style="margin-top: 5px">'+
                                          '<div class="col-sm-8">'+
                                             '<p style="color: #000; font-weight: 500; margin: 0; padding: 5px 0;">'+categoriesList[n]+'</p>'+
                                          '</div>'+
                                          '<div class="col-sm-4">'+
                                             (registered_top_level_category != '' ? '<tag class="removeShortCutIcon" onclick="removeCategoryFromMenuCatalog(\''+categoriesList[n]+'\')"><i class="fa fa-minus-circle"></i></tag>' : '')+
                                             '<button class="btn btn-sm btn-default" onclick="openMenuCatalogAssigner(\''+categoriesList[n]+'\', \''+registered_top_level_category+'\')" style="width: 100%; font-weight: bold; color: #dd397d">'+(registered_top_level_category != '' ? registered_top_level_category : '<tag style="font-style: italic; text-transform: initial; color: #5d5d5d; font-weight: initial;">Not Classified</tag>')+'</button>'+
                                          '</div>'+
                                      '</div>';
                      
                      n++;
              }

              function getTopLevelCategory(category_name) {
                for(var i = 0; i < catalogData.length; i++){
                  if(catalogData[i].name == category_name){
                    return catalogData[i].mainType;
                    break;
                  }
                }

                return "";
              }


              document.getElementById("menuCatalogRenderPlane").innerHTML = renderContent;
          }
          else{
            showToast('Not Found Error: Menu Catalog data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu Catalog data not found.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Catalog data.', '#e74c3c');
      }

    });  
}


function removeCategoryFromMenuCatalog(category_name) {


      var requestData = {
        "selector"  :{ 
                      "identifierTag": "ACCELERATE_MENU_CATALOG" 
                    },
        "fields"    : ["identifierTag", "value", "_rev"]
      }

      $.ajax({
        type: 'POST',
        url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
        data: JSON.stringify(requestData),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          if(data.docs.length > 0){
            if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATALOG'){

                var catalogData = data.docs[0].value;

                var n = 0;
                while(catalogData[n]){
                  if(catalogData[n].name == category_name){ 
                    catalogData.splice(n, 1);
                    break;
                  }
                  n++;
                }

                //Update 
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_MENU_CATALOG",
                  "value": catalogData
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MENU_CATALOG/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      openSystemSettings('menuCatalog');
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Menu Catalog data.', '#e74c3c');
                  }
                });  

                
            }
            else{
              showToast('Not Found Error: Menu Catalog data not found.', '#e74c3c');
            }
          }
          else{
            showToast('Not Found Error: Menu Catalog data not found.', '#e74c3c');
          }
        },
        error: function(data) {
          showToast('System Error: Unable to read Menu Catalog data.', '#e74c3c');
        }

      });  

  
      document.getElementById("addCatalogNameModal").style.display = 'none'; 
}

function openMenuCatalogAssigner(category_name, current_value) {
  
  document.getElementById("addCatalogNameModal").style.display = 'block';  
  document.getElementById("addCatalogNameModalBrief").innerHTML = 'Set Top Level Category for <b>'+category_name+'</b> as'; 
  document.getElementById("addCatalogNameModalConsent").innerHTML = '<button class="btn btn-default" style="width: 100%; border: none; border-radius: 0" onclick="setMenuCatalogAssigner(\''+category_name+'\', \''+current_value+'\')">Set</button>';


  if(current_value && current_value != ''){
    $('#addCatalogNameModalInput').val(current_value);
    $('#addCatalogNameModalInput').focus();
    $('#addCatalogNameModalInput').select();
  }
  else{
    $('#addCatalogNameModalInput').val('');
    $('#addCatalogNameModalInput').focus();
  }
}

function setMenuCatalogAssigner(category_name, current_value) {

  var updated_name = $('#addCatalogNameModalInput').val();
  var trimmed_name = updated_name.replace(/\s/g,'');

  if(trimmed_name.length == 0){
    updated_name = '';
  }

  if(current_value == updated_name){
    document.getElementById("addCatalogNameModal").style.display = 'none'; 
    return '';
  }

  if(updated_name == ''){ //remove category from catalog
    removeCategoryFromMenuCatalog(category_name);
  }
  else{ //update category in catalog

      updated_name = updated_name.toUpperCase();

      var requestData = {
        "selector"  :{ 
                      "identifierTag": "ACCELERATE_MENU_CATALOG" 
                    },
        "fields"    : ["identifierTag", "value", "_rev"]
      }

      $.ajax({
        type: 'POST',
        url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
        data: JSON.stringify(requestData),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          if(data.docs.length > 0){
            if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATALOG'){

                var catalogData = data.docs[0].value;

                if(catalogData.length == 0){
                      var newEntry = {
                        "name": category_name,
                        "mainType": updated_name
                      }

                      catalogData.push(newEntry);
                }
                else{
                  var n = 0;
                  while(catalogData[n]){
                    if(catalogData[n].name == category_name){ 
                      catalogData[n].mainType = updated_name;
                      break;
                    }


                    //if not found in catalog, add as a new entry
                    if(n == catalogData.length - 1){ //last iteration
                      var newEntry =     {
                        "name": category_name,
                        "mainType": updated_name
                      }

                      catalogData.push(newEntry);

                      break;
                    }

                    n++;
                  }
                }

                //Update 
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_MENU_CATALOG",
                  "value": catalogData
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MENU_CATALOG/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      openSystemSettings('menuCatalog');
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Menu Catalog data.', '#e74c3c');
                  }
                });  

                
            }
            else{
              showToast('Not Found Error: Menu Catalog data not found.', '#e74c3c');
            }
          }
          else{
            showToast('Not Found Error: Menu Catalog data not found.', '#e74c3c');
          }
        },
        error: function(data) {
          showToast('System Error: Unable to read Menu Catalog data.', '#e74c3c');
        }

      });  

  }

  document.getElementById("addCatalogNameModal").style.display = 'none'; 
}



// KITCHEN SECTIONS (for KOT relaying)

function renderCurrentKOTRelays(){

    //Preload menu categories
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MENU_CATEGORIES" 
                  },
      "fields"    : ["identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_MENU_CATEGORIES'){

              var categories = data.docs[0].value;
              categories.sort(); //alphabetical sorting 

              renderCurrentKOTRelaysAfterProcess(categories);

              var categoryTag = '';
          }
          else{
            showToast('Not Found Error: Menu Category data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu Category data not found.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Category data.', '#e74c3c');
      }

    });    
}

function renderCurrentKOTRelaysAfterProcess(categoriesList){

    if(window.localStorage.appOtherPreferences_KOTRelayEnabled && window.localStorage.appOtherPreferences_KOTRelayEnabled == 1){
      document.getElementById("kot_relay_not_enabled_label").style.display = 'none';
    }
    else{
      document.getElementById("kot_relay_not_enabled_label").style.display = 'block';
    }


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_KOT_RELAYING" 
                  },
      "fields"    : ["identifierTag", "value"]
    }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_RELAYING'){

              var sectionsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var renderContent = '';
              var addedRelaysList = [];
              var registered_pinter_temp = '';

              for(var n=0; n<sectionsList.length; n++){

                if(sectionsList[n].systemName == machineName){

                    addedRelaysList = sectionsList[n].data;
                    
                    //Render
                    for (var i=0; i<categoriesList.length; i++){

                      registered_pinter_temp = getRegisteredPrinterName(categoriesList[i]);
                      
                      renderContent += '<div class="row" style="margin-top: 5px">'+
                                          '<div class="col-sm-8">'+
                                             '<p style="color: #000; font-weight: 500; margin: 0; padding: 5px 0;">'+categoriesList[i]+'</p>'+
                                          '</div>'+
                                          '<div class="col-sm-4">'+
                                             (registered_pinter_temp != '' ? '<tag class="removeShortCutIcon" onclick="unsetKOTRelay(\''+categoriesList[i]+'\')"><i class="fa fa-minus-circle"></i></tag>' : '')+
                                             '<button class="btn btn-sm btn-default" onclick="openKOTRelaySelectionModal(\''+categoriesList[i]+'\', \''+registered_pinter_temp+'\')" style="width: 100%; font-weight: bold; color: #1261ad">'+(registered_pinter_temp != '' ? registered_pinter_temp : '<tag style="font-style: italic; text-transform: initial; color: #5d5d5d; font-weight: initial;">Default Printer</tag>')+'</button>'+
                                          '</div>'+
                                      '</div>';

                    } //end FOR (Render)

                    document.getElementById("kitchenSectionsRenderPlane").innerHTML = renderContent;

                  break;
                }
              }

              function getRegisteredPrinterName(categoryName){
                var m = 0;
                while(addedRelaysList[m]){
                  if(addedRelaysList[m].name == categoryName){
                    if(addedRelaysList[m].printer != '')
                      return addedRelaysList[m].printer;
                    else 
                      return '';
                  }

                  if(m == addedRelaysList.length - 1){ //Last iteration and not found
                    return '';
                  }
                  m++;
                }

                if(addedRelaysList.length == 0){
                  return '';
                }
              }
          }
          else{
            showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relaying data.', '#e74c3c');
      }

    });   
}


function unsetKOTRelay(brief){

    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_KOT_RELAYING" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_RELAYING'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){

                    for (var i=0; i<settingsList[n].data.length; i++){
                      if(settingsList[n].data[i].name == brief){
                        settingsList[n].data[i].printer = '';
                        break;
                      }
                    }

                    saveToRelayData(settingsList, data.docs[0]._rev);

                  break;
                }
              }


          }
          else{
            showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relaying data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relaying data.', '#e74c3c');
      }

    });  

}

function saveToRelayData(customList, rev){

                    //Update
                    var updateData = {
                      "_rev": rev,
                      "identifierTag": "ACCELERATE_KOT_RELAYING",
                      "value": customList
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_KOT_RELAYING/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        renderCurrentKOTRelays();
                        applyKOTRelays();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update KOT Relaying data.', '#e74c3c');
                      }
                    });     
}


function openKOTRelaySelectionModal(brief, current_printer){

    var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
    var g = 0;
    var allPrintersList = [];

    while(allConfiguredPrintersList[g]){
      
      for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
        if(!isItARepeat(allConfiguredPrintersList[g].list[a].name)){
          allPrintersList.push({
            "name": allConfiguredPrintersList[g].list[a].name,
            "target": allConfiguredPrintersList[g].list[a].target
          });
          }
      }
      
      g++;
    }

    function isItARepeat(name){
      var h = 0;
      while(allPrintersList[h]){
        if(allPrintersList[h].name == name){
          return true;
        }

        if(h == allPrintersList.length - 1){ // last iteration
          return false;
        }
        h++;
      }
    }


  document.getElementById("selectKOTRelayPrinterModal").style.display = 'block';
  document.getElementById("selectKOTRelayPrinterBrief").innerHTML = 'Relay all <b>'+brief+'</b> items to the Printer'; 
  document.getElementById("selectKOTRelayPrinterActions").innerHTML = '<button class="btn btn-default" style="width: 100%; border: none; border-radius: 0" onclick="selectKOTRelayModalHide()">Cancel</button>';


  if(allPrintersList.length == 0){
    document.getElementById("selectKOTRelayPrinterList").innerHTML = '<tag style="font-size: 15px; text-align: center; display: block; padding: 20px; border-top: 1px solid #f3f3f3; color: #ef8e8e;">There are no printers configured. Please <a href="#" onclick="renderPage(\'printer-settings\', \'Configure Printers\');">Configure a Printer</a> and try again.</tag>';
  }
  else{
    var printerRenderContent = '';

    var k = 0;
    while(allPrintersList[k]){
      printerRenderContent += '<div class="myListedPrinter" onclick="mapKOTRelayPrinter(\''+brief+'\', \''+allPrintersList[k].name+'\')" style="cursor: pointer">'+
                                '<center><img src="images/common/printer.png" style="width: 64px; height: 64px;"></center>'+
                                (allPrintersList[k].name == current_printer ? '<tag class="myListedPrinterDelete" style="color: #62ce62; font-size: 25px; padding: 5px 10px;"><i class="fa fa-check-circle"></i></tag>' : '')+
                                '<h1 class="myListedPrinterHead">'+allPrintersList[k].name+'</h1>'+
                                '<p class="myListedPrinterAddress">'+allPrintersList[k].target+'</p>'+
                              '</div>';
      k++;
    }


    document.getElementById("selectKOTRelayPrinterList").innerHTML = printerRenderContent;
  }

}

function selectKOTRelayModalHide(){
  document.getElementById("selectKOTRelayPrinterModal").style.display = 'none';
}

function mapKOTRelayPrinter(category, printer_name){

    if(printer_name == '' || category == ''){
      showToast('Warning: Parameters missing', '#e67e22');
      selectKOTRelayModalHide();
      return '';
    }


    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_KOT_RELAYING" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_KOT_RELAYING'){

              var settingsList = data.docs[0].value;
              var remember_rev_tag = data.docs[0]._rev;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var replaceIndex = -1;

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    if(settingsList[n].data.length != 0){
                        //inner FOR
                        for (var i=0; i<settingsList[n].data.length; i++){

                          //Find the index at which the key has to be set
                          if(settingsList[n].data[i].name == category){
                            replaceIndex = i;
                          }

                          if(i == settingsList[n].data.length - 1){ //last iteration
                           
                            if(replaceIndex > -1){ //replace index is found
                              settingsList[n].data[replaceIndex].printer = printer_name;

                              selectKOTRelayModalHide();
                              saveToRelayData(settingsList, remember_rev_tag);
                              break;
                            }
                            else{
                              settingsList[n].data.push({ //add as a new entry
                                "name": category,
                                "printer": printer_name
                              });
                              
                              selectKOTRelayModalHide();
                              saveToRelayData(settingsList, remember_rev_tag);
                              break;

                            }
                          }
                        } //end inner FOR
                    }
                    else{
                        settingsList[n].data.push({ //add as a new entry
                                  "name": category,
                                  "printer": printer_name
                                });
                                
                        selectKOTRelayModalHide();
                        saveToRelayData(settingsList, remember_rev_tag);
                    }

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: KOT Relays data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relays data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relays data.', '#e74c3c');
      }

    }); 
}

