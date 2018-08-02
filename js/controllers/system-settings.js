function openSystemSettings(id){
	
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
      renderSystemOptions();
      break;
    } 
    case "keyboardShortcuts":{
      renderCurrentKeys();
      break;
    } 
    case "systemSecurity":{
      renderSecurityOptions();
      break;
    }  
    case "resetOptions":{
 
      break;
    }            
	}
}


/*read system options data*/
function renderSystemOptions(){

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

                        renderSystemOptionsAfterProcess(settingsList, modes);

                    }
                    else{
                      renderSystemOptionsAfterProcess(settingsList, []);
                    }
                  }
                  else{
                    renderSystemOptionsAfterProcess(settingsList, []);
                  }
                  
                },
                error: function(data) {
                  renderSystemOptionsAfterProcess(settingsList, []);
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

function renderSystemOptionsAfterProcess(settingsList, billingModes){

console.log(billingModes)
              var machineName = 'Kitchen Kiosk';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    var params = settingsList[n].data;
                    var isOnlineOrdersEnabled = false;

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

                      }
                
                    } //end FOR (Render)

                  break;
                }  
              } //end - FOR
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

              var machineName = 'Kitchen Kiosk';
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

              var machineName = 'Kitchen Kiosk';
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

              var machineName = 'Kitchen Kiosk';
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

              var machineName = 'Kitchen Kiosk';
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

  document.getElementById("thisSystemName").innerHTML = newValue;
  window.localStorage.appCustomSettings_SystemName = newValue;
  changePersonalisationFile('systemName', newValue);
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
                                    '<button type="button" onclick="performRecoveryResetLogin()" class="btn btn-success loginWindowButton">Login</button>'+
                                    '<button type="button" onclick="cancelLoginResetWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
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



/*RESET OPTIONS*/

function masterResetConfirm(){
  document.getElementById("masterResetConfirmModal").style.display = 'block';
}

function masterResetConfirmHide(){
  document.getElementById("masterResetConfirmModal").style.display = 'none';
}


function masterResetAction(){

  masterResetConfirmHide();
  document.getElementById("fullScreenLoader").style.display = 'block';

  //test unit
  var resetLinks = [{
                    "name": "Billing Modes",
                    "url": "./data/static/test.json",
                    "type": "json"
                  }, {
                    "name": "Billing Parameters",
                    "url": "./data/static/test.json",
                    "type": "json"
                  }];

  //DELETE MENU IMAGES !

  var n = 0;
  var actualCount = 1;
  while(resetLinks[n]){

       var content;
       if(resetLinks[n].type == 'json'){
        content = JSON.stringify([]);
        }else if(resetLinks[n].type == 'counter'){
          content = 1;
        }else{
          content = '';
        }
       fs.writeFile(resetLinks[n].url, content, 'utf8', (err) => {
         if(err){
            showToast('System Reset failed!', 'red');
            document.getElementById("fullScreenLoader").style.display = 'none';
            return '';
         }

         if(actualCount == resetLinks.length){
          resetFinished();
         }

         actualCount++;

       }); 
    n++;
  }
  
}

function resetFinished(){
  showToast('System Reset Completed!', 'green');
  document.getElementById("fullScreenLoader").style.display = 'none';  
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
  changeSystemOptionsFile("notifications", optName);
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

              var machineName = 'Kitchen Kiosk';
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

              var machineName = 'Kitchen Kiosk';
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

              var machineName = 'Kitchen Kiosk';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var replaceIndex = -1;

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










