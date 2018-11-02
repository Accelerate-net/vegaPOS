function openSystemSettings(id, optionalHighlight){
	
	/*Tweak - Hide all */
	$( "#detailsDisplaySystemSettings" ).children().css( "display", "none" );
	$( "#detailsNewSystemSettings" ).children().css( "display", "none" );

	document.getElementById(id).style.display = "block";

	switch(id){
    case "personalOptions":{
      renderPersonalisations();
      break;
    } 
    case "systemOptions":{
      renderSystemOptions(optionalHighlight);
      break;
    } 
    case "configureSystem":{
      renderConfigureSystem();
      break;
    } 
    case "keyboardShortcuts":{
      renderCurrentKeys();
      break;
    } 
    case "kitchenSections":{
      renderCurrentKOTRelays();
      break;
    } 
    case "systemSecurity":{
      renderSecurityOptions();
      break;
    }          
	}
}




/*read system configuration data*/
function renderConfigureSystem(){

    var licenseRequest = window.localStorage.accelerate_licence_number ? window.localStorage.accelerate_licence_number : '';

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_CONFIGURED_MACHINES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_CONFIGURED_MACHINES'){

              var machinesList = data.docs[0].value;
              var machineData = '';

              var n = 0;
              while(machinesList[n]){
                if(machinesList[n].licence == licenseRequest){
                  machineData = machinesList[n];
                  break;
                }
                n++;
              }

              //Machine Registered Already
              if(machineData != ''){

                document.getElementById("configureSystemActivationWarning").style.display = 'none';
                document.getElementById("configureSystemDetailsRender").style.display = 'table';

                $('#system_configure_license_number').val(machineData.licence);
                $('#edit_main_system_name').val(machineData.machineCustomName);

                if(machineData.isActive){
                  if(machineData.isTrial){
                    $('#system_configure_license_expiry').val('Trial expires on '+machineData.dateExpire);
                  }
                  else{
                    $('#system_configure_license_expiry').val('Valid till '+machineData.dateExpire);
                  }
                }
                else{
                  if(machineData.isTrial){
                    $('#system_configure_license_expiry').val('Trial expired '+machineData.dateExpire);
                  }
                  else{
                    $('#system_configure_license_expiry').val('Inactive');
                  }
                }

                $('#system_configure_license_issued').val(machineData.dateInstall);
                $('#system_configure_license_uid').val(machineData.machineUID);
                
                //Server IP Address
                var default_url = 'http://admin:admin@127.0.0.1:5984/';
                var saved_url = window.localStorage.serverConnectionURL ? window.localStorage.serverConnectionURL : '';

                if(saved_url == ''){
                  $('#system_configure_server_address').val(default_url);
                }
                else{
                  $('#system_configure_server_address').val(saved_url);
                }

              }
              else{ //Machine not Activated yet.
                document.getElementById("configureSystemActivationWarning").style.display = 'block';
                document.getElementById("configureSystemDetailsRender").style.display = 'none';
              }
          }
          else{
            showToast('Not Found Error: Configured Systems data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Configured Systems data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Configured Systems data. Please contact Accelerate Support.', '#e74c3c');
      }
    });  
}


function openActivationModal(){
  document.getElementById("applicationActivationModal").style.display = 'block';
  $('#activation_code_entered').focus();
}

function openActivationModalHide(){
  document.getElementById("applicationActivationModal").style.display = 'none';
}

function proceedToActivation(){

  var activation_code = document.getElementById("activation_code_entered").value;

  if(activation_code == ''){
    showToast('Warning! Enter Activation Code', '#e67e22');
    return '';
  }

      activation_code = activation_code.toUpperCase();

      var admin_data = {
        "code": activation_code,
        "secret": "ACCELERATE_VEGA"
      }


      showLoading(10000, 'Activating Application');

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/posactivateapplication.php',
        data: JSON.stringify(admin_data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {

          hideLoading();

          if(data.status){
            pushLicenseToLocaServer(data.response);
          }
          else{
            if(data.errorCode == 404){
              showToast(data.error, '#e74c3c');
              return '';
            }
          }
        },
        error: function(data){
          hideLoading();
          showToast('Failed to reach Activation Server. Please check your connection.', '#e74c3c');
          return '';
        }
      });     
}



function pushLicenseToLocaServer(licenceObject){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_CONFIGURED_MACHINES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_CONFIGURED_MACHINES'){

             var machinesList = data.docs[0].value;

             for (var i=0; i<machinesList.length; i++) {
               if(machinesList[i].licence == licenceObject.licence){
                  showToast('Activation Error: Licence already used. Please contact Accelerate Support.', '#e74c3c');
                  return '';
               }
             }

              machinesList.push(licenceObject);
              var remember_rev = data.docs[0]._rev;
              createFirstTimeActivationStubsFromSettings(licenceObject, machinesList, remember_rev);
              
          }
          else{
            showToast('Not Found Error: System Configurations data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: System Configurations data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read System Configurations data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
}


/* create stubs */
function createFirstTimeActivationStubsFromSettings(licenceObject, machinesList, remember_rev){

  firstTimeStub_personalisations();

  //Step 1 : Personalisations 
  function firstTimeStub_personalisations(){

    var requestData = {"selector": { "identifierTag": "ZAITOON_PERSONALISATIONS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_PERSONALISATIONS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence. Please contact Accelerate Support.', '#e74c3c');
                return '';
              }


              var isAlreadyFound = false;
              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){
                    isAlreadyFound = true;
                    break;
                }
              }  


              if(!isAlreadyFound){
                //Add stub and update
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "theme", "value": "skin-green" }, { "name": "menuImages", "value": "YES" }, { "name": "punchingRightScreen", "value": "TABLE" }, { "name": "virtualKeyboard", "value": 0 }, { "name": "screenLockOptions", "value": "" }, { "name": "screenLockDuration", "value": "30" }, { "name": "securityPasscodeProtection", "value": "NO" } ] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_PERSONALISATIONS",
                  "value": settingsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_PERSONALISATIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_system_options();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create Personalisations stub data. Please contact Accelerate Support.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_system_options();
              }
                          
          }
          else{
            showToast('Configurations Error: Personalisations data not found. Please contact Accelerate Support.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: Personalisations data not found. Please contact Accelerate Support.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read Personalisations data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });      
  }


  //Step 2 : System Options
  function firstTimeStub_system_options(){

    var requestData = {"selector": { "identifierTag": "ZAITOON_SYSTEM_OPTIONS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_SYSTEM_OPTIONS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence. Please contact Accelerate Support.', '#e74c3c');
                return '';
              }


              var isAlreadyFound = false;
              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){
                    isAlreadyFound = true;
                    break;
                }
              }  


              if(!isAlreadyFound){
                //Add stub and update
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "notifications", "value": "ERRORS" }, { "name": "orderEditingAllowed", "value": "YES" }, { "name": "resetCountersAfterReport", "value": "YES" }, { "name": "onlineOrders", "value": "YES" }, { "name": "defaultPrepaidName", "value": "Razor" }, { "name": "reportEmailList", "value": "" }, { "name": "defaultDeliveryMode", "value": "Delivery - Zatioon App" }, { "name": "defaultTakeawayMode", "value": "NONE" }, { "name": "defaultDineMode", "value": "Dine In" }, { "name": "defaultKOTPrinter", "value": "" }, { "name": "KOTRelayEnabled", "value": "YES" }, { "name": "scanPayEnabled", "value": "YES" }, { "name": "scanPayAPI", "value": "" }, { "name": "showDefaultQRCode", "value": "NO" }, { "name": "showDefaultQRTarget", "value": "" }, { "name": "sendMetadataToQR", "value": "NO" } ] } 
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_SYSTEM_OPTIONS",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SYSTEM_OPTIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_custom_shortcuts();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create System Options stub data. Please contact Accelerate Support.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_custom_shortcuts();
              }
                          
          }
          else{
            showToast('Configurations Error: System Options data not found. Please contact Accelerate Support.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: System Options data not found. Please contact Accelerate Support.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read System Options data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });      
  }



  //Step 3 : Custom Shortcuts
  function firstTimeStub_custom_shortcuts(){

    var requestData = {"selector": { "identifierTag": "ZAITOON_SHORTCUT_KEYS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_SHORTCUT_KEYS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence. Please contact Accelerate Support.', '#e74c3c');
                return '';
              }


              var isAlreadyFound = false;
              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){
                    isAlreadyFound = true;
                    break;
                }
              }  


              if(!isAlreadyFound){
                //Add stub and update
                var new_stub = { "systemName": licenceObject.machineUID, "data": [{ "name": "Show Spotlight Search", "value": "" }, { "name": "Select Billing Mode", "value": "" }, { "name": "Set Table/Address", "value": "" }, { "name": "Focus Guest Details", "value": "" }, { "name": "Focus Item Search", "value": "" }, { "name": "Set Special Comments", "value": "" }, { "name": "Save Current Order", "value": "" }, { "name": "Close Order", "value": "" }, { "name": "Cancel Order", "value": "" }, { "name": "Print KOT", "value": "" }, { "name": "Print Item View", "value": "" }, { "name": "Print Bill", "value": "" }, { "name": "Print Duplicate Bill", "value": "" }, { "name": "Settle Bill", "value": "f3" }, { "name": "Assign Delivery Agent", "value": "f2" }, { "name": "Issue Refund", "value": "" }, { "name": "Cancel Invoice", "value": "" }, { "name": "Refresh Application", "value": "" }, { "name": "Refresh Online Orders", "value": "" }, { "name": "Go to All Bills", "value": "" }, { "name": "Switch User", "value": "shift+c" } ] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_SHORTCUT_KEYS",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SHORTCUT_KEYS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_configured_printers();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create Custom Shortcuts stub data. Please contact Accelerate Support.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_configured_printers();
              }
                          
          }
          else{
            showToast('Configurations Error: Custom Shortcuts data not found. Please contact Accelerate Support.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: Custom Shortcuts data not found. Please contact Accelerate Support.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read Custom Shortcuts data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });      
  }



  //Step 4 : Configured Printer
  function firstTimeStub_configured_printers(){

    var requestData = {"selector": { "identifierTag": "ZAITOON_CONFIGURED_PRINTERS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_CONFIGURED_PRINTERS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence. Please contact Accelerate Support.', '#e74c3c');
                return '';
              }


              var isAlreadyFound = false;
              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){
                    isAlreadyFound = true;
                    break;
                }
              }  


              if(!isAlreadyFound){
                //Add stub and update
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "Kitchen", "type": "NETWORK", "address": "http://192.0.1.2:9204/", "actions": [ "KOT" ], "height": "", "width": "123" }, { "name": "Desk", "type": "NETWORK", "address": "http://192.0.1.3:14214/", "actions": [ "BILL" ], "height": "", "width": "123" }, { "name": "AC Dine Hall", "type": "NETWORK", "address": "http://192.0.3.129:8090", "height": "", "width": "320", "actions": "BILL,DUPLICATE BILL" } ] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_CONFIGURED_PRINTERS",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_CONFIGURED_PRINTERS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_kot_relays();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create Configured Printers stub data. Please contact Accelerate Support.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_kot_relays();
              }
                          
          }
          else{
            showToast('Configurations Error: Configured Printers data not found. Please contact Accelerate Support.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: Configured Printers data not found. Please contact Accelerate Support.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read Configured Printers data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });      
  }


  //Step 5 : KOT Relays
  function firstTimeStub_kot_relays(){

    var requestData = {"selector": { "identifierTag": "ZAITOON_KOT_RELAYING" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_KOT_RELAYING'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence. Please contact Accelerate Support.', '#e74c3c');
                return '';
              }


              var isAlreadyFound = false;
              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){
                    isAlreadyFound = true;
                    break;
                }
              }  


              if(!isAlreadyFound){
                //Add stub and update
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "Ice Creams", "printer": "Juice Counter" }, { "name": "Milk Shakes", "printer": "Juice Counter" }, { "name": "Fresh Juices", "printer": "Juice Counter" } ] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_KOT_RELAYING",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_KOT_RELAYING/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      finalActivateLicence();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create KOT Relays stub data. Please contact Accelerate Support.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                finalActivateLicence();
              }
                          
          }
          else{
            showToast('Configurations Error: KOT Relays data not found. Please contact Accelerate Support.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: KOT Relays data not found. Please contact Accelerate Support.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read KOT Relays data. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });      
  }


  //Step : Final (Create all)
  function finalActivateLicence(){

                //Update configured machines
                var updateData = {
                  "_rev": remember_rev,
                  "identifierTag": "ZAITOON_CONFIGURED_MACHINES",
                  "value": machinesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_CONFIGURED_MACHINES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Activation Successful', '#27ae60');
                      openActivationModalHide();

                      window.localStorage.accelerate_licence_number = licenceObject.licence;
                      window.localStorage.accelerate_licence_machineUID = licenceObject.machineUID;
                      renderConfigureSystem();
                      
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update System Configurations data. Please contact Accelerate Support.', '#e74c3c');
                  }
                });  
  }

}


function showMasterResetConfirm(){
  document.getElementById("masterResetConfirmModal").style.display = 'block';
}

function masterResetConfirmHide(){
  document.getElementById("masterResetConfirmModal").style.display = 'none';
}

//Remove the licence
function confirmLicenceRemove(){
  window.localStorage.clear();
  masterResetConfirmHide();
  showToast('Reset has been completed successfully', '#27ae60');
  applyLicenceTerms();
}


/*read system options data*/
function renderSystemOptions(optionalHighlight){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SYSTEM_OPTIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_SYSTEM_OPTIONS'){

              var settingsList = data.docs[0].value;

              //Preload Billing Modes data
              var requestData = {
                "selector"  :{ 
                              "identifierTag": "ZAITOON_BILLING_MODES" 
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
                  console.log(data)
                  if(data.docs.length > 0){
                    if(data.docs[0].identifierTag == 'ZAITOON_BILLING_MODES'){

                        var modes = data.docs[0].value;
                        modes.sort(); //alphabetical sorting 

                        renderSystemOptionsAfterProcess(settingsList, modes, optionalHighlight);

                    }
                    else{
                      renderSystemOptionsAfterProcess(settingsList, [], optionalHighlight);
                    }
                  }
                  else{
                    renderSystemOptionsAfterProcess(settingsList, [], optionalHighlight);
                  }
                  
                },
                error: function(data) {
                  renderSystemOptionsAfterProcess(settingsList, [], optionalHighlight);
                }

              });


          }
          else{
            showToast('Not Found Error: System Options data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: System Options data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read System Options data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}

function renderSystemOptionsAfterProcess(settingsList, billingModes, optionalHighlight){

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
              var g = 0;
              var KOTPrintersList = [];

              while(allConfiguredPrintersList[g]){
                if(allConfiguredPrintersList[g].type == 'KOT'){
                  for(var a = 0; a < allConfiguredPrintersList[g].list.length; a++){
                    KOTPrintersList.push({
                      "name": allConfiguredPrintersList[g].list[a].name,
                      "target": allConfiguredPrintersList[g].list[a].target
                    });
                  }
                  break;
                }
                g++;
              }


              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    var params = settingsList[n].data;
                    var isOnlineOrdersEnabled = false;
                    var isScanPayActive = false;
                    var isCustomQREnabled = false;

                    //Render
                    for (var i=0; i<params.length; i++){

                      switch(params[i].name){
                        case "notifications": {
                          document.getElementById("systemOptionNotification").value = params[i].value
                          break;
                        }
                        case "onlineOrders": {
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionOnlineOrders").value = params[i].value;
                            isOnlineOrdersEnabled = true;
                          }
                          else{
                            document.getElementById("systemOptionOnlineOrders").value = 'NO';
                            isOnlineOrdersEnabled = false;
                          }
                          break;
                        }
                        case "orderEditingAllowed": {
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionEditingAllowed").value = params[i].value;
                          }
                          else{
                            document.getElementById("systemOptionEditingAllowed").value = 'NO';
                          }
                          break;
                        }
                        case "billSettleLater": {
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionSettleLater").value = params[i].value;
                          }
                          else{
                            document.getElementById("systemOptionSettleLater").value = 'NO';
                          }
                          break;
                        }
                        case "adminIdleLogout": {
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionAdminIdleLogout").value = params[i].value;
                          }
                          else{
                            document.getElementById("systemOptionAdminIdleLogout").value = 'NO';
                          }
                          break;
                        }
                        case "KOTRelayEnabled": {
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionKOTRelayEnabled").value = params[i].value;
                          }
                          else{
                            document.getElementById("systemOptionKOTRelayEnabled").value = 'NO';
                          }
                          break;
                        }
                        case "resetCountersAfterReport": {
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionResetCounter").value = params[i].value;
                          }
                          else{
                            document.getElementById("systemOptionResetCounter").value = 'NO';
                          }
                          break;
                        }
                        case "reportEmailList": {
                          document.getElementById("systemOptionReport_email_list").value = params[i].value;
                          
                          break;
                        }
                        case "defaultPrepaidName": {
                          if(isOnlineOrdersEnabled){
                            document.getElementById("systemOptionOnlineOrders_prepaidTag").style.display = 'table-row';
                            document.getElementById("systemOptionOnlineOrders_prepaid_keyword").value = params[i].value;
                          }  
                          else{
                            document.getElementById("systemOptionOnlineOrders_prepaidTag").style.display = 'none';
                            document.getElementById("systemOptionOnlineOrders_prepaid_keyword").value = params[i].value;
                          }  
                          break;
                        }
                        
                        case "defaultDeliveryMode": {
                          if(isOnlineOrdersEnabled){

                            //Render Modes
                            var n = 0;
                            var defaultTemplate = '<option value="NONE">Not Set</option>';
                            var atleastOneFound = false;
                            while(billingModes[n]){
                              if(billingModes[n].type == 'DELIVERY'){
                                defaultTemplate += '<option value="'+billingModes[n].name+'" '+(params[i].value == billingModes[n].name ? 'selected' : '')+'>'+billingModes[n].name+'</option>';
                                atleastOneFound = true;
                              }
                              n++;
                            }

                            document.getElementById("systemOptionOnlineOrders_default_delivery").style.display = 'table-row';
                            document.getElementById("systemOptionOnlineOrder_Default_Delivery").innerHTML = atleastOneFound ? defaultTemplate : '<option value="NONE" selected>Not Set</option>';

                          }  
                          else{
                            document.getElementById("systemOptionOnlineOrders_default_delivery").style.display = 'none';
                          }  
                          break;
                        }
                        case "defaultTakeawayMode": {
                          if(isOnlineOrdersEnabled){

                            //Render Modes
                            var n = 0;
                            var defaultTemplate = '<option value="NONE">Not Set</option>';
                            var atleastOneFound = false;
                            while(billingModes[n]){
                              if(billingModes[n].type == 'PARCEL'){
                                defaultTemplate += '<option value="'+billingModes[n].name+'" '+(params[i].value == billingModes[n].name ? 'selected' : '')+'>'+billingModes[n].name+'</option>';
                                atleastOneFound = true;
                              }
                              n++;
                            }

                            document.getElementById("systemOptionOnlineOrders_default_takeaway").style.display = 'table-row';
                            document.getElementById("systemOptionOnlineOrder_Default_Takeaway").innerHTML = atleastOneFound ? defaultTemplate : '<option value="NONE" selected>Not Set</option>';
                            
                          }  
                          else{
                            document.getElementById("systemOptionOnlineOrders_default_takeaway").style.display = 'none';
                          }  
                          break;
                        }
                        case "defaultDineMode": {

                            //Render Modes
                            var n = 0;
                            var defaultTemplate = '<option value="NONE">Not Set</option>';
                            var atleastOneFound = false;
                            while(billingModes[n]){
                              if(billingModes[n].type == 'DINE'){
                                defaultTemplate += '<option value="'+billingModes[n].name+'" '+(params[i].value == billingModes[n].name ? 'selected' : '')+'>'+billingModes[n].name+'</option>';
                                atleastOneFound = true;
                              }
                              n++;
                            }

                            document.getElementById("systemOptionDefaultDineMode").innerHTML = atleastOneFound ? defaultTemplate : '<option value="NONE" selected>Not Set</option>';
                            break;
                        }
                        case "defaultKOTPrinter": {

                            //Render Modes
                            var n = 0;
                            var defaultTemplate = '<option value="NONE">Not Set</option>';
                            var atleastOneFound = false;
                            while(KOTPrintersList[n]){
                              defaultTemplate += '<option value="'+KOTPrintersList[n].name+'" '+(params[i].value == KOTPrintersList[n].name ? 'selected' : '')+'>'+KOTPrintersList[n].name+'</option>';
                              atleastOneFound = true;
                              
                              n++;
                            }

                            document.getElementById("systemOptionDefaultKOTPrinter").innerHTML = atleastOneFound ? defaultTemplate : '<option value="NONE" selected>Not Set</option>';
                            break;
                        }
                        case "scanPayEnabled":{
                          if(params[i].value == 'YES'){
                            document.getElementById("systemOptionScanPay").value = params[i].value;
                            isScanPayActive = true;
                          }
                          else{
                            document.getElementById("systemOptionScanPay").value = 'NO';
                            isScanPayActive = false;
                          }
                          break;
                        }
                        case "scanPayAPI":{
                          if(isScanPayActive){
                            document.getElementById("scanPay_base_api").style.display = 'table-row';
                            $('#systemOptionScanPayAPIAddress').val(params[i].value);
                          }
                          else{
                            document.getElementById("scanPay_base_api").style.display = 'none';
                          }
                          break;
                        }
                        case "showDefaultQRCode":{
                          if(!isScanPayActive){

                            document.getElementById("scanPay_show_custom_qr").style.display = 'table-row';

                            if(params[i].value == 'YES'){
                              document.getElementById("systemOptionShowQRCode").value = params[i].value;
                              isCustomQREnabled = true;
                            }
                            else{
                              document.getElementById("systemOptionShowQRCode").value = 'NO';
                              isCustomQREnabled = false;
                            }
                          }
                          else{
                            document.getElementById("scanPay_show_custom_qr").style.display = 'none';
                          }

                          break;
                        }
                        case "showDefaultQRTarget":{
                          if(!isScanPayActive && isCustomQREnabled){
                            document.getElementById("scanPay_custom_url").style.display = 'table-row';
                            $('#systemOptionQRCodeaTargetURL').val(params[i].value);
                          }
                          else{
                            document.getElementById("scanPay_custom_url").style.display = 'none';
                          }

                          break;
                        }
                        case "sendMetadataToQR":{
                          if(!isScanPayActive && isCustomQREnabled){

                            document.getElementById("scanPay_show_custom_metadata").style.display = 'table-row';

                            if(params[i].value == 'YES'){
                              document.getElementById("systemOptionSendMetaData").value = params[i].value;
                            }
                            else{
                              document.getElementById("systemOptionSendMetaData").value = 'NO';
                            }
                          }
                          else{
                            document.getElementById("scanPay_show_custom_metadata").style.display = 'none';
                          }

                          break;
                        }


                      }
                
                    } //end FOR (Render)

                  break;
                }  
              } //end - FOR


              //Optional highlighter
              if(optionalHighlight && optionalHighlight != ''){
                switch(optionalHighlight){
                  case "HIGHLIGHT_DEFAULT_KOT_PRINTER":{
                    document.getElementById("systemOptionDefaultKOTPrinter_holder").style = "background: #ffe6bf";
                    break;
                  }
                }
              }
              else{ //if not set, reset to default values
                document.getElementById("systemOptionDefaultKOTPrinter_holder").style = "background: none !important; border-top: 1px dashed #f5f5f5;";
              }

}



/*read personalisation data*/
function renderPersonalisations(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_PERSONALISATIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_PERSONALISATIONS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    var params = settingsList[n].data;
                    var isScreenIdleEnabled = false;

                    //Render
                    for (var i=0; i<params.length; i++){
                      if(params[i].name == "theme"){
                        /*TWEAK*/
                        var themeName = params[i].value;
                        themeName = themeName.replace(/skin-/g,"");
                        themeName = themeName.replace(/-/g," ");
                        if((themeName.split(" ")).length == 1){
                          themeName = themeName+' Dark';
                        }

                        document.getElementById("title_"+params[i].value).innerHTML = themeName+'<tag class="selectThemeTitleDefaulted"> <i style="color: #2ecc71" class="fa fa-check-circle"></i></tag>';
                      }
                      else if(params[i].name == "menuImages"){
                        document.getElementById("personalisationEditImage").value = params[i].value;
                      }
                      else if(params[i].name == "punchingRightScreen"){
                        document.getElementById("personalisationRightDisplayChoice").value = params[i].value;
                      }
                      else if(params[i].name == "virtualKeyboard"){
                        document.getElementById("personalisationEditKeyboard").value = 0; //params[i].value;
                      }
                      else if(params[i].name == "systemName"){
                        document.getElementById("edit_main_system_name").value = params[i].value;
                      }
                      else if(params[i].name == "screenLockOptions"){
                        if(params[i].value == 'SCREENSAVER' || params[i].value == 'LOCKSCREEN'){
                          document.getElementById("personalisationInactiveScreen").value = params[i].value;
                          isScreenIdleEnabled = true;
                        }
                        else{
                          document.getElementById("personalisationInactiveScreen").value = 'NONE';
                          isScreenIdleEnabled = false;
                        }
                        
                      }
                      else if(params[i].name == "screenLockDuration"){
                        if(isScreenIdleEnabled){
                          document.getElementById("personalisationInactiveScreen_TimeOptions").style.display = 'table-row';
                          document.getElementById("personalisationIdleDuration").value = params[i].value;
                        }  
                        else{
                          document.getElementById("personalisationInactiveScreen_TimeOptions").style.display = 'none';
                          document.getElementById("personalisationIdleDuration").value = params[i].value;
                        }    
                      }                        
                    } //end FOR (Render)

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: Personalisations data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Personalisations data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Personalisations data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}



/*read security data*/
function renderSecurityOptions(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_PERSONALISATIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_PERSONALISATIONS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    var params = settingsList[n].data;

                    //Render
                    for (var i=0; i<params.length; i++){         
                      if(params[i].name == "securityPasscodeProtection"){
                        document.getElementById("securityPasscodeProtection").value = params[i].value;
                        if(document.getElementById("securityPasscodeProtection").value == 'YES'){
                          document.getElementById("passcodeActionsArea").style.display = 'table-row';
                        }
                        else{
                          document.getElementById("passcodeActionsArea").style.display = 'none';
                        }
                      }                      
                    } //end FOR (Render)

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: Security Information data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Security Information data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Security Information data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}


function changeSystemOptionsFile(type, changedValue){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SYSTEM_OPTIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_SYSTEM_OPTIONS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    for (var i=0; i<settingsList[n].data.length; i++){
                      if(settingsList[n].data[i].name == type){
                        
                        settingsList[n].data[i].value = changedValue;
                        console.log(changedValue, machineName)

                        //Update
                        var updateData = {
                          "_rev": data.docs[0]._rev,
                          "identifierTag": "ZAITOON_SYSTEM_OPTIONS",
                          "value": settingsList
                        }

                        $.ajax({
                          type: 'PUT',
                          url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SYSTEM_OPTIONS/',
                          data: JSON.stringify(updateData),
                          contentType: "application/json",
                          dataType: 'json',
                          timeout: 10000,
                          success: function(data) {

                              renderSystemOptions();

                              if(type == 'onlineOrders'){
                                renderSideNavigation();
                                recheckCloudConnectionStatus();
                              }

                          },
                          error: function(data) {
                            showToast('System Error: Unable to update System Options data. Please contact Accelerate Support.', '#e74c3c');
                          }

                        });  

                        break;
                      }
                    }

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: System Options data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: System Options data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read System Options data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
 
}


function changePersonalisationFile(type, changedValue){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_PERSONALISATIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_PERSONALISATIONS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    for (var i=0; i<settingsList[n].data.length; i++){
                      if(settingsList[n].data[i].name == type){
                        
                        settingsList[n].data[i].value = changedValue;


                        //Update
                        var updateData = {
                          "_rev": data.docs[0]._rev,
                          "identifierTag": "ZAITOON_PERSONALISATIONS",
                          "value": settingsList
                        }

                        $.ajax({
                          type: 'PUT',
                          url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_PERSONALISATIONS/',
                          data: JSON.stringify(updateData),
                          contentType: "application/json",
                          dataType: 'json',
                          timeout: 10000,
                          success: function(data) {

                              renderPersonalisations();
                              renderSecurityOptions();

                          },
                          error: function(data) {
                            console.log(data)
                            showToast('System Error: Unable to update Personalisations data. Please contact Accelerate Support.', '#e74c3c');
                          }

                        });  

                        break;
                      }
                    }

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: Personalisations data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Personalisations data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Personalisations data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}

/*actions*/
function changePersonalisationTheme(themeName){

  //document.getElementById("mainAppBody").classList;
  var tempList = document.getElementById("mainAppBody").classList.toString();
  tempList = tempList.split(" ");

  tempList[0] = themeName;

  tempList = tempList.toString();
  tempList = tempList.replace (/,/g, " ");

  document.getElementById("mainAppBody").className = tempList;

  //Tweak
  var x = document.getElementsByClassName("selectThemeTitleDefaulted");
  var n = 0;
  while(x[n]){
    $(".selectThemeTitleDefaulted").html("");
    n++;
  }

  document.getElementById("title_"+themeName).innerHTML += '<tag class="selectThemeTitleDefaulted"> <i style="color: #2ecc71" class="fa fa-check-circle"></i></tag>';
            

  //Update
  window.localStorage.appCustomSettings_Theme = themeName;
  changePersonalisationFile("theme", themeName);

  showToast('Theme changed successfully', '#27ae60');
}


function changePersonalisationImage(){
  var optName = document.getElementById("personalisationEditImage").value == 'YES'? true: false;

  if(optName){
    showToast('Photos will be displayed in the Menu', '#27ae60');
  }
  else{
    showToast('Photos has been disabled in the Menu', '#27ae60');
  }

  //Update
  window.localStorage.appCustomSettings_ImageDisplay = optName;
  changePersonalisationFile("menuImages", document.getElementById("personalisationEditImage").value);
}

function changePersonalisationRightDisplay(){
  var optName = document.getElementById("personalisationRightDisplayChoice").value;

  if(optName == 'MENU'){
    showToast('Menu will be displayed in the Right Panel of Orders Page', '#27ae60');
  }
  else if(optName == 'TABLE'){
    showToast('Table Layout will be displayed in the Right Panel of Orders Page', '#27ae60');
  }

  //Update
  window.localStorage.appCustomSettings_OrderPageRightPanelDisplay = optName;
  changePersonalisationFile("punchingRightScreen", optName);
}



function changePersonalisationLock(){
  var optName = document.getElementById("personalisationInactiveScreen").value;

  if(optName == 'SCREENSAVER'){
    showToast('Screen Saver will be displayed when the Screen is idle', '#27ae60');
    document.getElementById("personalisationInactiveScreen_TimeOptions").style.display = 'table-row';
  }
  else if(optName == 'LOCKSCREEN'){
    if(window.localStorage.appCustomSettings_InactivityToken && window.localStorage.appCustomSettings_InactivityToken != ''){
      showToast('Screen will be Locked when the Screen is idle', '#27ae60');
      document.getElementById("personalisationInactiveScreen_TimeOptions").style.display = 'table-row';
    }
    else{
      showToast('Warning! Set the Screen Passcode before enabling this option', '#e67e22');
      openSystemSettings('systemSecurity');
      return '';
    }
  }
  else{
    optName = '';
    document.getElementById("personalisationInactiveScreen_TimeOptions").style.display = 'none';
  }


  //Update
  window.localStorage.appCustomSettings_InactivityEnabled = optName;
  changePersonalisationFile("screenLockOptions", optName);

  initScreenSaver();
}


function changeSystemName(){
  var newValue = document.getElementById("edit_main_system_name").value;
  if(newValue == ''){
    showToast('Warning: System Name can not be left blank', '#e67e22');
    return '';
  }

  if(newValue == 'Nameless Machine'){
    showToast('Warning: System Name can not be set as Nameless Machine', '#e67e22');
    return '';  
  }

  document.getElementById("thisSystemName").innerHTML = newValue;
  window.localStorage.appCustomSettings_SystemName = newValue;
  changeConfiguredMachineName(newValue);
}

function changeConfiguredMachineName(newValue){

    var licenseRequest = window.localStorage.accelerate_licence_number ? window.localStorage.accelerate_licence_number : '';

    if(licenseRequest == ''){
      showToast('System Error: Licence Number not found. Please contact Accelerate Support.', '#e74c3c');
      return '';
    }

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_CONFIGURED_MACHINES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_CONFIGURED_MACHINES'){

              var machinesList = data.docs[0].value;

              var n = 0;
              while(machinesList[n]){
                if(machinesList[n].licence == licenseRequest){
                  machinesList[n].machineCustomName = newValue;
                  break;
                }

                n++;
              }


                        //Update
                        var updateData = {
                          "_rev": data.docs[0]._rev,
                          "identifierTag": "ZAITOON_CONFIGURED_MACHINES",
                          "value": machinesList
                        }

                        $.ajax({
                          type: 'PUT',
                          url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_CONFIGURED_MACHINES/',
                          data: JSON.stringify(updateData),
                          contentType: "application/json",
                          dataType: 'json',
                          timeout: 10000,
                          success: function(data) {

                          },
                          error: function(data) {
                            showToast('System Error: Unable to update Configured Systems data. Please contact Accelerate Support.', '#e74c3c');
                          }

                        });  

          }
          else{
            showToast('Not Found Error: Configured Systems data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Configured Systems data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Configured Systems data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}


function changePersonalisationIdleDuration(){
  var optName = document.getElementById("personalisationIdleDuration").value;

  //Update
  window.localStorage.appCustomSettings_InactivityScreenDelay = optName;
  changePersonalisationFile("screenLockDuration", optName);

  initScreenSaver();
}


function changePersonalisationKeyboard(){
  var optName = parseFloat(document.getElementById("personalisationEditKeyboard").value);


  if(optName == 0){
    showToast('Virtual Keyboard disabled', '#27ae60');
  }
  else if(optName == 1){
    showToast('Virtual Keyboard gets activated on Input only', '#27ae60');
  }
  else if(optName == 2){
    showToast('Virtual Keyboard is enabled', '#27ae60');
  }


  //Update
  window.localStorage.appCustomSettings_Keyboard = optName;
  changePersonalisationFile("virtualKeyboard", optName);
}


/*Security Options*/

function changeSecurityPasscodeProtection(){
  var optName = document.getElementById("securityPasscodeProtection").value == 'YES'? true: false;

  //Disable --> Enable (Ask to set a code)
  if(optName){
    document.getElementById("setNewPassCodeModal").style.display = 'block';
    $("#screenlock_passcode_new").focus();
  }
  else{ //Enable --> Disable (Ask to confirm the code)
    document.getElementById("confirmCurrentPassCodeModal").style.display = 'block'; 
    $("#screenlock_passcode_old_confirm").focus();
  }
}

//To ENABLE
function securityPasscodeProtectionSetCode(){

  var newCode = document.getElementById("screenlock_passcode_new").value;
  var confirmCode = document.getElementById("screenlock_passcode_confirm").value;

  if(newCode == '' || confirmCode == '')
  {
    showToast('Warning! Confirm the passcodes', '#e67e22');
    return '';
  }

  if(newCode.length != 4 || confirmCode.length != 4)
  {
    showToast('Warning! Passcode must be 4 characters long.', '#e67e22');
    return '';
  }

  if(newCode == confirmCode){
    showToast('Passcode Protection has been enabled', '#27ae60');
    
    //Update
    window.localStorage.appCustomSettings_InactivityToken = btoa(newCode);
    window.localStorage.appCustomSettings_PasscodeProtection = true;
    changePersonalisationFile("securityPasscodeProtection", 'YES');  

    securityPasscodeProtectionSetCodeHIDE();
  }
  else{
    showToast('Failed! Codes doesn\'t match.', '#e74c3c');
  }


}

function securityPasscodeProtectionSetCodeHIDE(){
  document.getElementById("setNewPassCodeModal").style.display = 'none';
  renderSecurityOptions();
}

//To DISABLE
function securityPasscodeProtectionConfirmCode(){
  var currentPassword = '';
  if(window.localStorage.appCustomSettings_InactivityToken && window.localStorage.appCustomSettings_InactivityToken != ''){
    currentPassword = atob(window.localStorage.appCustomSettings_InactivityToken)
  }else{
    showToast('Something went wrong. Try Passcode Reset Tool.', '#e74c3c');
  }

  var enteredPassword = document.getElementById("screenlock_passcode_old_confirm").value;

  if(enteredPassword == currentPassword){
    showToast('Passcode Protection has been disabled', '#27ae60');

    //Update
    window.localStorage.appCustomSettings_PasscodeProtection = false;
    changePersonalisationFile("securityPasscodeProtection", 'NO'); 
    window.localStorage.appCustomSettings_InactivityToken = '';

    securityPasscodeProtectionConfirmCodeHIDE();

    //Disable Lockscreen (Screensaver);
    if(window.localStorage.appCustomSettings_InactivityEnabled == 'LOCKSCREEN'){
      window.localStorage.appCustomSettings_InactivityEnabled = '';
    }

  }
  else{
    showToast('Failed! Incorrect code.', '#e74c3c');
  } 


}

function securityPasscodeProtectionConfirmCodeHIDE(){
  document.getElementById("confirmCurrentPassCodeModal").style.display = 'none';
  renderSecurityOptions();
}



/*Change Passcode to New*/
function changePasscodeToNew(){
  document.getElementById("setChangePassCodeModal").style.display = 'block';
  $("#screenlock_passcode_original").focus();
}

function setChangedPasscodeToNew(){
  var code_original = document.getElementById("screenlock_passcode_original").value;
  var code_one = document.getElementById("screenlock_passcode_new_1").value;
  var code_two = document.getElementById("screenlock_passcode_new_2").value;

  if(code_one.length != 4 || code_two.length != 4)
  {
    showToast('Warning! Passcode must be 4 characters long.', '#e67e22');
    return '';
  }


  var currentPassword = '';
  if(window.localStorage.appCustomSettings_InactivityToken && window.localStorage.appCustomSettings_InactivityToken != ''){
    currentPassword = atob(window.localStorage.appCustomSettings_InactivityToken)
  }else{
    showToast('Something went wrong. Try Passcode Reset Tool.', '#e74c3c');
  }  

  if(code_one != code_two){
    showToast('Failed! Codes doesn\'t match.', '#e74c3c');
    

  }
  else if(code_original != currentPassword){
    showToast('Failed! Current Passcode doesn\'t match.', '#e74c3c');
  }
  else{
    showToast('New Passcode has been enabled', '#27ae60');

    //Update
    window.localStorage.appCustomSettings_InactivityToken = btoa(code_one);
    window.localStorage.appCustomSettings_PasscodeProtection = true;
    changePersonalisationFile("securityPasscodeProtection", 'YES');  

    changePasscodeToNewHIDE();    
  }
}

function changePasscodeToNewHIDE(){
  document.getElementById("setChangePassCodeModal").style.display = 'none';
  renderSecurityOptions();
}



/*Recovery*/
function recoveryPasscodeLogin(){

    showToast('Login to the Server and Prove your identity. We will reset your Screen Lock Code!', '#8e44ad')

    document.getElementById("loginModalResetCodeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<span class="avatar"><img src="data/photos/brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Login to the Server</h1>'+
                                   '</header>'+
                                   '<form style="margin: 0">'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Username" type="text" id="loginReset_server_username" value="" class="form-control loginWindowInput"> </div> </div>'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Password" type="password" id="loginReset_server_password" value="" class="form-control loginWindowInput"> </div> </div>'+                     
                                    '</div>'+
                                    '<button  onclick="performRecoveryResetLogin()" class="btn btn-success loginWindowButton">Login</button>'+
                                    '<button  onclick="cancelLoginResetWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                   '</form>'+
                                '</section>';

    document.getElementById("loginModalResetPasscode").style.display = 'block';
    $("#loginReset_server_username").focus();
}

function cancelLoginResetWindow(){
    document.getElementById("loginModalResetPasscode").style.display = 'none';
}


function performRecoveryResetLogin(){

  var username = document.getElementById("loginReset_server_username").value;
  var password = document.getElementById("loginReset_server_password").value;

  if(username == '' || password ==''){
    showToast('Warning! Enter credentials correctly', '#e67e22');
    return '';
  }

  var tempToken = '';
  if(window.localStorage.loggedInAdmin && window.localStorage.loggedInAdmin != ''){
    tempToken = window.localStorage.loggedInAdmin;
  }

  var data = {
    "mobile": username,
    "password": password,
    "token": tempToken
  }

  showLoading(10000, 'Logging on to the Server');  

  $.ajax({
    type: 'POST',
    url: 'https://www.zaitoon.online/services/posserverrecoverylogin.php',
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    success: function(data) {
      hideLoading();
      if(data.status){
        window.localStorage.appCustomSettings_InactivityToken = btoa('0000');
        showToast('Screen Lock successfully reset to <b>0000</b>. Change it now.', '#27ae60');
        initScreenSaver(); //Screensaver changes
        cancelLoginResetWindow();
      }
      else
      {
        showToast(data.error, '#e74c3c');
      }

    },
    error: function(data){
      hideLoading();
      showToast('Server not responding. Check your connection.', '#e74c3c');
    }

  });    
}



/* System Options */

function changeSystemOptionOnlineOrders(){
  var optName = document.getElementById("systemOptionOnlineOrders").value == 'YES'? true: false;

  //Update
  window.localStorage.systemOptionsSettings_OnlineOrders = optName;
  changeSystemOptionsFile("onlineOrders", document.getElementById("systemOptionOnlineOrders").value);
}

function changeSystemOptionNotification(){
  var optName = document.getElementById("systemOptionNotification").value;

  //Update
  window.localStorage.systemOptionsSettings_notifications = optName;
  NOTIFICATION_FILTER = optName;
  changeSystemOptionsFile("notifications", optName);
}


function changeSystemOptionEditingKOTAllowed(){
  var optName = document.getElementById("systemOptionEditingAllowed").value;

  //Update
  window.localStorage.appOtherPreferences_orderEditingAllowed = (optName == 'YES' ? 1 : 0);
  changeSystemOptionsFile("orderEditingAllowed", optName);
}


function changeSystemOptionKOTRelaying(){
  var optName = document.getElementById("systemOptionKOTRelayEnabled").value;

  //Update
  window.localStorage.appOtherPreferences_KOTRelayEnabled = (optName == 'YES' ? 1 : 0);
  changeSystemOptionsFile("KOTRelayEnabled", optName);
}

function changeSystemOptionSettleLater(){
  var optName = document.getElementById("systemOptionSettleLater").value;

  //Update
  window.localStorage.appOtherPreferences_SettleLater = (optName == 'YES' ? 1 : 0);
  changeSystemOptionsFile("billSettleLater", optName);
}



function changeSystemOptionAdminIdleLogout(){
  var optName = document.getElementById("systemOptionAdminIdleLogout").value;

  //Update
  window.localStorage.appOtherPreferences_AdminIdleLogout = (optName == 'YES' ? 1 : 0);
  changeSystemOptionsFile("adminIdleLogout", optName);
}



function changeSystemOptionResetCounter(){
  var optName = document.getElementById("systemOptionResetCounter").value;

  //Update
  window.localStorage.appOtherPreferences_resetCountersAfterReport = (optName == 'YES' ? 1 : 0);
  changeSystemOptionsFile("resetCountersAfterReport", optName);  
}



function changeSystemOptionDefaultKOTPrinter(){
  var optName = document.getElementById("systemOptionDefaultKOTPrinter").value;

  //Update
  window.localStorage.systemOptionsSettings_defaultKOTPrinter = optName;
  changeSystemOptionsFile("defaultKOTPrinter", optName); 
}

function changeSystemOptionDefaultDineMode(){
  var optName = document.getElementById("systemOptionDefaultDineMode").value;

  //Update
  window.localStorage.systemOptionsSettings_defaultDineMode = optName;
  changeSystemOptionsFile("defaultDineMode", optName); 
}


function systemOptionPrepaidKeyword(){
  var optName = document.getElementById("systemOptionOnlineOrders_prepaid_keyword").value;

  //Update
  window.localStorage.systemOptionsSettings_defaultPrepaidName = optName;
  changeSystemOptionsFile("defaultPrepaidName", optName); 
}


function systemOptionEmailListValidator(){

  var emails = document.getElementById("systemOptionReport_email_list").value;

  emails = emails.replace(/\s/g,'');

  if(emails == ''){ //Unset
    window.localStorage.appOtherPreferences_reportEmailList = emails;
    changeSystemOptionsFile("reportEmailList", emails); 
    return '';    
  }

  //Validate first
  var emailList = emails.split(',');
  var allEmailsValid = true;

  for (var i = 0; i < emailList.length; i++) { 
      if(!validateEmail(emailList[i].trim())) {
        showToast('Warning: Invalid list of Emails. Emails not saved.', '#e67e22');
        allEmailsValid = false;
        return '';
      }
  }

  //Update
  if(allEmailsValid){
    window.localStorage.appOtherPreferences_reportEmailList = emails;
    changeSystemOptionsFile("reportEmailList", emails); 
  }

  function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
  }

}


function systemOptionOnlineOrderDefaultDelivery(){
  var optName = document.getElementById("systemOptionOnlineOrder_Default_Delivery").value;

  //Update
  window.localStorage.systemOptionsSettings_defaultDeliveryMode = optName;
  changeSystemOptionsFile("defaultDeliveryMode", optName); 
}


function systemOptionOnlineOrderDefaultTakeaway(){
  var optName = document.getElementById("systemOptionOnlineOrder_Default_Takeaway").value;

  //Update
  window.localStorage.systemOptionsSettings_defaultTakeawayMode = optName;
  changeSystemOptionsFile("defaultTakeawayMode", optName); 
}


// KITCHEN SECTIONS (for KOT relaying)

function renderCurrentKOTRelays(){

    //Preload menu categories
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_MENU_CATEGORIES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_MENU_CATEGORIES'){

              var categories = data.docs[0].value;
              categories.sort(); //alphabetical sorting 

              renderCurrentKOTRelaysAfterProcess(categories);

              var categoryTag = '';
          }
          else{
            showToast('Not Found Error: Menu Category data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu Category data not found. Please contact Accelerate Support.', '#e74c3c');
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu Category data. Please contact Accelerate Support.', '#e74c3c');
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
                    "identifierTag": "ZAITOON_KOT_RELAYING" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_KOT_RELAYING'){

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
            showToast('Not Found Error: KOT Relaying data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relaying data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relaying data. Please contact Accelerate Support.', '#e74c3c');
      }

    });   
}


function unsetKOTRelay(brief){

    var requestData = { "selector" :{ "identifierTag": "ZAITOON_KOT_RELAYING" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_KOT_RELAYING'){

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
            showToast('Not Found Error: KOT Relaying data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relaying data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relaying data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}

function saveToRelayData(customList, rev){

                    //Update
                    var updateData = {
                      "_rev": rev,
                      "identifierTag": "ZAITOON_KOT_RELAYING",
                      "value": customList
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_KOT_RELAYING/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        renderCurrentKOTRelays();
                        applyKOTRelays();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update KOT Relaying data. Please contact Accelerate Support.', '#e74c3c');
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


    var requestData = { "selector" :{ "identifierTag": "ZAITOON_KOT_RELAYING" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_KOT_RELAYING'){

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
            showToast('Not Found Error: KOT Relays data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: KOT Relays data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read KOT Relays data. Please contact Accelerate Support.', '#e74c3c');
      }

    }); 
}




// CUSTOM KEYSBOARD SHORTCUTS 

function renderCurrentKeys(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SHORTCUT_KEYS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_SHORTCUT_KEYS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var renderContent = '';

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    var params = settingsList[n].data;
                    //Render
                    for (var i=0; i<params.length; i++){

                      var key_selected = (params[i].value).split('+'); 

                      renderContent += '<div class="row" style="margin-top: 5px">'+
                                          '<div class="col-sm-8">'+
                                             '<p style="color: #000; font-weight: 500; margin: 0; padding: 5px 0;">'+params[i].name+'</p>'+
                                          '</div>'+
                                          '<div class="col-sm-4">'+
                                             (params[i].value != '' ? '<tag class="removeShortCutIcon" onclick="unsetShortcutKey(\''+params[i].name+'\')"><i class="fa fa-minus-circle"></i></tag>' : '')+
                                             '<button class="btn btn-sm btn-default" onclick="openKeySelectionModal(\''+params[i].name+'\', \''+key_selected[0]+'\', \''+(key_selected[1] ? key_selected[1] : '')+'\')" style="width: 100%; font-weight: bold; text-transform: uppercase">'+(key_selected[0] && key_selected[0] != '' ? key_selected[0]+(key_selected[1] ? ' + '+key_selected[1] : '') : '<tag style="font-style: italic; text-transform: initial; color: #5d5d5d; font-weight: initial;">Not Set</tag>')+'</button>'+
                                          '</div>'+
                                      '</div>';
                    } //end FOR (Render)

                    document.getElementById("shortCutsRenderPlane").innerHTML = renderContent;

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: Shortcut Keys data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Shortcut Keys data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Shortcut Keys data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
}



function openKeySelectionModal(brief, key_one, key_two){

  document.getElementById("selectShortKeysModal").style.display = 'block'; 
  document.getElementById("selectShortKeysModalBrief").innerHTML = 'Select the short keys to <b>'+brief+'</b>'; 
  document.getElementById("selectShortKeysModalActions").innerHTML = '<button class="btn btn-default" style="width: 30%; border: none; border-radius: 0" onclick="selectShortKeysModalHide()" style="float: left">Cancel</button>'+
                                                '<button style="width: 70%; border: none; border-radius: 0; margin: 0; float: right;" class="btn btn-success" onclick="saveShortKeySelection(\''+brief+'\')">Save</button>'; 

   $("#wholeKeyboard .keySelectionDetector").each(function(){
      if($(this).attr("key-value") == key_one || $(this).attr("key-value") == key_two){
        $(this).addClass('active');
      }
      else{
        $(this).removeClass('active');
      }
  });  
}

function selectShortKeysModalHide(){
  document.getElementById("selectShortKeysModal").style.display = 'none';
}


function saveShortKeySelection(brief){

  var selectedNormalKey = '';
  var selectedTriggerKey = '';


  $("#wholeKeyboard .keySelectionDetector").each(function(){
      if($(this).hasClass("active")){
        if($(this).attr("key-value") == 'ctrl' || $(this).attr("key-value") == 'shift' || $(this).attr("key-value") == 'alt'){
          selectedTriggerKey = $(this).attr("key-value");
        }
        else{
          selectedNormalKey = $(this).attr("key-value");
        }
      }
  });  

  //Check if Criteria has been followed
  if(selectedNormalKey == '' && selectedTriggerKey == ''){
    showToast('Error: Select atleast one key', '#e74c3c');
    return '';
  }

  if(selectedNormalKey == '' && selectedTriggerKey != ''){
    showToast('Error: Select atleast one key other than Shift or Ctrl or Alt', '#e74c3c');
    return '';
  }


  var reservedKeysData = [{ "name": "Select all text", "value": "ctrl+a" }, { "name": "Copy selected text", "value": "ctrl+c" }, { "name": "Cut currently selected text", "value": "ctrl+x" }, { "name": "Paste clipboard text", "value": "ctrl+v" } ];
  
  for (var i=0; i<reservedKeysData.length; i++){

      var key_selected = (reservedKeysData[i].value).split('+'); 

      if(selectedTriggerKey != ''){
          if((key_selected[0] == selectedTriggerKey && key_selected[1] == selectedNormalKey) || (key_selected[1] == selectedTriggerKey && key_selected[0] == selectedNormalKey)){
              showToast('Error: It is a System Reserved key. Choose a different Key.', '#e74c3c');
              return '';
          }
      }
      else{
          if((key_selected[0] == selectedNormalKey) && key_selected.length == 1){
              showToast('Error: It is a System Reserved key. Choose a different Key.', '#e74c3c');
              return '';
          }
      }
  }

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SHORTCUT_KEYS" 
                  }
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
          if(data.docs[0].identifierTag == 'ZAITOON_SHORTCUT_KEYS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var replaceIndex = -1;

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    //inner FOR
                    for (var i=0; i<settingsList[n].data.length; i++){

                      var key_selected = (settingsList[n].data[i].value).split('+'); 

                      if(selectedTriggerKey != ''){
                        if((key_selected[0] == selectedTriggerKey && key_selected[1] == selectedNormalKey) || (key_selected[1] == selectedTriggerKey && key_selected[0] == selectedNormalKey)){
                          showToast('Error: Shortcut Key already exists. Choose a different Key.', '#e74c3c');
                          return '';
                        }
                      }
                      else{
                        if((key_selected[0] == selectedNormalKey) && key_selected.length == 1){
                          showToast('Error: Shortcut Key already exists. Choose a different Key.', '#e74c3c');
                          return '';
                        }
                      }

                      //Find the index at which the key has to be set
                      if(settingsList[n].data[i].name == brief){
                        replaceIndex = i;
                      }

                      if((i == settingsList[n].data.length - 1) && replaceIndex > -1){ //last iteration and replace index is found
                        settingsList[n].data[replaceIndex].value = selectedTriggerKey != '' ? selectedTriggerKey+'+'+selectedNormalKey : selectedNormalKey;
                        selectShortKeysModalHide();
                        saveToShortcutData(settingsList, data.docs[0]._rev);
                      }
                    } //end inner FOR

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: Shortcut Keys data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Shortcut Keys data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Shortcut Keys data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}

function saveToShortcutData(settingsList, rev){

                    //Update
                    var updateData = {
                      "_rev": rev,
                      "identifierTag": "ZAITOON_SHORTCUT_KEYS",
                      "value": settingsList
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SHORTCUT_KEYS/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        renderCurrentKeys();
                        applyShortcuts();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Shortcut Keys data. Please contact Accelerate Support.', '#e74c3c');
                      }
                    });     
}


function unsetShortcutKey(brief){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SHORTCUT_KEYS" 
                  }
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
          if(data.docs[0].identifierTag == 'ZAITOON_SHORTCUT_KEYS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){

                    for (var i=0; i<settingsList[n].data.length; i++){
                      if(settingsList[n].data[i].name == brief){
                        settingsList[n].data[i].value = '';
                        break;
                      }
                    }

                    saveToShortcutData(settingsList, data.docs[0]._rev);

                  break;
                }
              }

          }
          else{
            showToast('Not Found Error: Shortcut Keys data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Shortcut Keys data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Shortcut Keys data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}

function recordShortKey(element){

  //Criterias
  /*
    > Max 2 Keys
    > Either Single Key from F1 - F12 or A - Z
    > Or a combination of one key and Shift/Ctrl/Alt
    > Shift or Ctrl or Alt => Only one at a time
  */

  //Pre check : Max of 2 keys at a time.
  var selectedKeysCount = 0;
  var hasCtrlShiftAltSelected = false;
  var hasNormalKeySelected = false;


  $("#wholeKeyboard .keySelectionDetector").each(function(){
      if($(this).hasClass("active")){
        if($(this).attr("key-value") == 'ctrl' || $(this).attr("key-value") == 'shift' || $(this).attr("key-value") == 'alt'){
          hasCtrlShiftAltSelected = true;
        }
        else{
          hasNormalKeySelected = true;
        }
        selectedKeysCount++;
      }
  });  

  if(element.classList.contains("active")){
    element.classList.remove("active")
  }
  else{
    if(selectedKeysCount < 2){
      if($(element).attr("key-value") == 'ctrl' || $(element).attr("key-value") == 'shift' || $(element).attr("key-value") == 'alt'){
        if(hasCtrlShiftAltSelected){
          showToast('Warning: Shift or Ctrl or Alt - Use only one at a time', '#e67e22');
          return '';
        }
        else{
          element.classList.add("active");
        }
      }
      else{ //Any Normal Key
        if(hasNormalKeySelected){
          showToast('Warning: Use Shift or Ctrl or Alt if you want', '#e67e22');
          return '';
        }
        else{
          element.classList.add("active");
        }        
      }
      
    }
    else{
      showToast('Warning: Maximum of 2 keys can be selected', '#e67e22');
      return '';
    }
  }
} 


function openDefaultKeys(){
  document.getElementById("systemReservedShortCutsModal").style.display = 'block';

  var dataSet = [{ "name": "Select all text", "value": "ctrl+a" }, { "name": "Copy selected text", "value": "ctrl+c" }, { "name": "Cut currently selected text", "value": "ctrl+x" }, { "name": "Paste clipboard text", "value": "ctrl+v" } ];

  var renderContent = '';

  var n = 0;
  while(dataSet[n]){

    var key_selected = (dataSet[n].value).split('+'); 

    renderContent += '<div class="row" style="margin-top: 5px">'+
                       '<div class="col-sm-8"> <p style="color: #000; font-weight: 500; margin: 0; padding: 5px 0;">'+dataSet[n].name+'</p> </div>'+
                       '<div class="col-sm-4"> <button class="btn btn-sm btn-default" style="width: 100%; font-weight: bold; text-transform: uppercase" disabled>'+(key_selected[0] && key_selected[0] != '' ? key_selected[0]+(key_selected[1] ? ' + '+key_selected[1] : '') : '<tag style="font-style: italic; text-transform: initial; color: #5d5d5d; font-weight: initial;">Not Set</tag>')+'</button> </div>'+
                    '</div>'
    n++;
  }

  document.getElementById("renderAreaSystemShorts").innerHTML = renderContent;
}


function systemReservedShortCutsModalHide(){
  document.getElementById("systemReservedShortCutsModal").style.display = 'none'; 
}



/* Scan & Pay Part */
function changeSystemOptionScanPay(){
  var optName = document.getElementById("systemOptionScanPay").value;

  //Update
  window.localStorage.scanPaySettings_scanPayEnabled = optName;
  changeSystemOptionsFile("scanPayEnabled", optName);
}

function systemOptionSetAPIAddress(){

  var url = document.getElementById("systemOptionScanPayAPIAddress").value;
  url = url.replace(/\s/g,'');

  if(url == ''){ //Unset
    //disable scan & pay!
    document.getElementById("systemOptionScanPay").value = 'NO';
    window.localStorage.scanPaySettings_scanPayAPI = '';
    changeSystemOptionScanPay();
    return '';    
  }
  else{
    window.localStorage.scanPaySettings_scanPayAPI = url;
    changeSystemOptionsFile("scanPayAPI", url); 
  }
}

function changeSystemOptionShowQRCode(){
  var optName = document.getElementById("systemOptionShowQRCode").value;

  //Update
  window.localStorage.scanPaySettings_showDefaultQR = optName;
  changeSystemOptionsFile("showDefaultQRCode", optName);
}

function systemOptionQRCodeTarget(){

  var url = document.getElementById("systemOptionQRCodeaTargetURL").value;
  url = url.replace(/\s/g,'');

  if(url == ''){ //Unset
    //disable scan & pay!
    document.getElementById("systemOptionShowQRCode").value = 'NO';
    window.localStorage.scanPaySettings_defaultQRTarget = '';
    changeSystemOptionShowQRCode();
    return '';    
  }
  else{
    window.localStorage.scanPaySettings_defaultQRTarget = url;
    changeSystemOptionsFile("showDefaultQRTarget", url); 
  }
}

function changeSystemOptionSendMetaData(){
  var optName = document.getElementById("systemOptionSendMetaData").value;

  //Update
  window.localStorage.scanPaySettings_sendMetadataToQR = optName;
  changeSystemOptionsFile("sendMetadataToQR", optName);
}





