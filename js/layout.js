let fs = require('fs');


/* GLOBAL TIME DISPLAY */

/* Analogue Clock */
function updateClock() {
            var now = moment(),
                second = now.seconds() * 6,
                minute = now.minutes() * 6 + second / 60,
                hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;
            $('#hour').css("transform", "rotate(" + hour + "deg)");
            $('#minute').css("transform", "rotate(" + minute + "deg)");
            $('#second').css("transform", "rotate(" + second + "deg)");

            document.getElementById('globalTimeDisplay').innerHTML = moment().format('h:mm:ss a');

            document.getElementById('globalDateDisplay').innerHTML = moment().format('dddd, ') + '<b style="font-size: 120%;">'+moment().format('D')+'</b>' + moment().format(' MMM, YYYY');
}

function timedUpdate () {
  updateClock();
  setTimeout(timedUpdate, 1000);
}

timedUpdate();

//Disable ' key --> JSON Safe
function enableJSONSafe(){
          $(document).on('keydown',  function (e) {
                if(e.which == 222){
                  e.preventDefault();
                }
          });  
}

enableJSONSafe();

// Render SIDE NAVIGATION bar
function renderSideNavigation(){

   var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
    }


    //Online orders enabled 
    var isOnlineOrdersEnabled = window.localStorage.accelerate_licence_online_enabled ? window.localStorage.accelerate_licence_online_enabled : 0; 
    var isOnlineOrdersAccepted = window.localStorage.systemOptionsSettings_OnlineOrders ? window.localStorage.systemOptionsSettings_OnlineOrders : false;
    
    var onlineOrdersIcon = '';
    if(isOnlineOrdersEnabled == 1 && (isOnlineOrdersAccepted == 'true' || isOnlineOrdersAccepted == true)){
      onlineOrdersIcon =  '<li onclick="renderPage(\'online-orders\', \'Online Orders\')">'+
                            '<a href="#">'+
                              '<tag class="onlineOrderCountLabel" style="display: none" id="onlineOrderCounter">'+'</tag>'+
                              '<img src="images/navigation/navigate_online.png" width="32px">'+
                              '<span class="navSideName">Online Orders</span>'+
                            '</a>'+
                          '</li>';
    }

    //either profile not chosen, or not an admin
    if(loggedInStaffInfo.code == '' || loggedInStaffInfo.role != 'ADMIN'){ 

        document.getElementById("sidemenuNavigationBar").innerHTML = ''+
                    '<li onclick="renderPage(\'new-order\', \'Punch Order\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_punching.png" width="32px">'+
                          '<span class="navSideName">Punch Order</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'live-orders\', \'Live Orders\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_live.png" width="32px">'+
                          '<span class="navSideName">Live Orders</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'seating-status\', \'Seating Status\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_seating.png" width="32px">'+
                          '<span class="navSideName">Seating Status</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'settled-bills\', \'Generated Bills\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_bills.png" width="32px">'+
                          '<span class="navSideName">Generated Bills</span>'+
                        '</a>'+
                    '</li>';  
      }
      else{ 
        document.getElementById("sidemenuNavigationBar").innerHTML = ''+
                    '<li onclick="renderPage(\'new-order\', \'Punch Order\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_punching.png" width="32px">'+
                          '<span class="navSideName">Punch Order</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'live-orders\', \'Live Orders\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_live.png" width="32px">'+
                          '<span class="navSideName">Live Orders</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'seating-status\', \'Seating Status\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_seating.png" width="32px">'+
                          '<span class="navSideName">Seating Status</span>'+
                        '</a>'+
                    '</li>'+
                    onlineOrdersIcon +                 
                    '<li onclick="renderPage(\'reward-points\', \'Reward Points\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_rewards.png" width="32px">'+
                          '<span class="navSideName">Reward Points</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'settled-bills\', \'Generated Bills\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_bills.png" width="32px">'+
                          '<span class="navSideName">Generated Bills</span>'+
                        '</a>'+
                    '</li>'+
                    '<li onclick="renderPage(\'expenses-and-payments\', \'Expenses & Payments\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_expenses.png" width="32px">'+
                          '<span class="navSideName">Expenses & Payments</span>'+
                        '</a>'+
                    '</li>'+
                     '<li id="sidebarTools" class="treeview mm_products" onclick="activateSidebarElement(\'sidebarTools\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_tools.png" width="32px">'+
                          '<span class="navSideName">Tools</span>'+
                        '</a>'+
                        '<ul class="treeview-menu">'+
                            '<li onclick="renderPage(\'cancelled-bills\', \'Cancellations\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Cancellations</a></li>'+
                            '<li onclick="renderPage(\'manage-menu\', \'Manage Menu\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Manage Menu</a></li>'+
                            '<li onclick="renderPage(\'photos-manager\', \'Photos Manager\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Photos Manager</a></li>'+
                            '<li onclick="renderPage(\'sales-summary\', \'Reports & Summary\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Reports & Summary</a></li>'+
                            '<li onclick="renderPage(\'table-layout\', \'Table Layout\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Table Layout</a></li>'+
                        '</ul>'+
                    '</li>'+
                    '<li id="sidebarSettings" class="treeview mm_products" onclick="activateSidebarElement(\'sidebarSettings\')">'+
                        '<a href="#">'+
                          '<img src="images/navigation/navigate_settings.png" width="32px">'+
                          '<span class="navSideName">Settings</span>'+
                        '</a>'+
                        '<ul class="treeview-menu">'+
                            '<li onclick="renderPage(\'app-data\', \'App Data\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>App Data</a></li>'+
                            '<li onclick="renderPage(\'bill-settings\', \'Billing Settings\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Billing Settings</a></li>'+ 
                            '<li onclick="renderPage(\'printer-settings\', \'Configure Printers\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Configure Printers</a></li>'+
                            '<li onclick="renderPage(\'system-settings\', \'System Settings\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>System Settings</a></li>'+
                            '<li onclick="renderPage(\'user-settings\', \'Users Settings\')">'+
                                '<a href="#"><i class="fa fa-circle-o"></i>Users Settings</a></li>'+
                        '</ul>'+
                    '</li>';  
      }
}

renderSideNavigation();


/* Apply LICENCE */
function applyLicenceTerms(){

    var licenceRequest = window.localStorage.accelerate_licence_number ? window.localStorage.accelerate_licence_number : '';

    if(licenceRequest == ''){
      document.getElementById("applicationActivationLock").style.display = 'block';
      playNotificationSound('ERROR');
      return '';
    }

    //Read from Server, apply changes, and save to LocalStorage
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_CONFIGURED_MACHINES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_CONFIGURED_MACHINES'){

              var machinesList = data.docs[0].value;

              var n = 0;
              while(machinesList[n]){

                if(machinesList[n].licence == licenceRequest){

                  document.getElementById("applicationExpireLock").style.display = 'none';

                  window.localStorage.accelerate_licence_number = machinesList[n].licence;
                  window.localStorage.accelerate_licence_branch = machinesList[n].branch;
                  window.localStorage.accelerate_licence_branch_name = machinesList[n].branchName ? machinesList[n].branchName : machinesList[n].branch;
                  window.localStorage.accelerate_licence_client_name = machinesList[n].client ? machinesList[n].client : '';
                  window.localStorage.accelerate_licence_machineUID = machinesList[n].machineUID;
                  window.localStorage.appCustomSettings_SystemName = machinesList[n].machineCustomName;
                  window.localStorage.accelerate_licence_online_enabled = machinesList[n].isOnlineEnabled ? 1 : 0;
                  
                  //Licence Expire Check
                  var myDate = moment(machinesList[n].dateExpire, 'DD-MM-YYYY')
                  var diff_temp = moment().diff(myDate, 'days');
                  if(diff_temp > 0){ //Expired!
                    document.getElementById("applicationExpireLock").style.display = 'block';
                    showToast('Licence Expired: Please contact Accelerate Support to renew the Licence.', '#e74c3c');
                    return '';  
                  }

                  //Check if Local Server is Running
                  testLocalServerConnection();
                  applySystemOptionSettings();
                  applyPersonalisations();
                  applyBillLayout();
                  applyShortcuts();
                  applyKOTRelays();
                  autoSessionSwitchChecker();
                  applyConfiguredPrinters();
                  applyOrderSources();

                  //If Online enabled
                  if(machinesList[n].isOnlineEnabled){
                    getServerConnectionStatus();
                    getOnlineOrdersCount();
                  }

                  break;
                }

                if(n == machinesList.length - 1){ //Last iteration
                  document.getElementById("applicationActivationLock").style.display = 'block';
                  playNotificationSound('ERROR');
                  return '';                  
                }

                n++;
              }

          }
          else{
            showToast('Server Error: Configured Systems data not found.', '#e74c3c');
            document.getElementById("applicationActivationLock").style.display = 'block';
            return '';          
          }
        }
        else{
            showToast('Server Error: Configured Systems data not found.', '#e74c3c');
            document.getElementById("applicationActivationLock").style.display = 'block';
            return '';    
        }
        
      },
      error: function(data) {
        document.getElementById("serverConnectionFailureLock").style.display = 'block';
        return '';          
      }
    });  
  
}

applyLicenceTerms();

function removeWelcomeScreen(){
  document.getElementById("welcomeScreenLock").style.display = 'none';
}

/* apply added ORDER SOURCES */
function applyOrderSources(){
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_ORDER_SOURCES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_ORDER_SOURCES'){
              var order_sources_list = data.docs[0].value;
              window.localStorage.addedOrderSourcesData = JSON.stringify(order_sources_list);
          }
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Order Sources data.', '#e74c3c');
      }
    });
}

/* apply configured printers */
function applyConfiguredPrinters(){

  var printersList = window.localStorage.connectedPrintersList ? JSON.parse(window.localStorage.connectedPrintersList) : [];

  var list_bills = [];
  var list_bills_duplicate = [];
  var list_kot = [];
  var list_report = [];
  var list_view = [];


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_CONFIGURED_PRINTERS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_CONFIGURED_PRINTERS'){

            var printersList = data.docs[0].value;

            var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
            if(!machineName || machineName == ''){
                machineName = 'Any';
            }

              var printers = [];

              for(var i=0; i<printersList.length; i++){
                if(printersList[i].systemName == machineName){
                  printers = printersList[i].data;
                  break;
                }
              }


              //Sort Printers
              var n = 0;
              while(printers[n]){

                for(var p = 0; p < printers[n].actions.length; p++){
                  switch(printers[n].actions[p]){
                    case "KOT":{
                      list_kot.push({
                        "target" : printers[n].type,
                        "name" : printers[n].name,
                        "settings": {
                                      "marginsType": 1, //No Margin
                                      "printBackground": true, 
                                      "pageSize": {
                                        "height": printers[n].height > 0 ? printers[n].height * 1000 : 891000,
                                        "width": printers[n].width * 1000
                                      },
                                      "silent": true
                                    }
                      });
                      break;
                    }
                    case "BILL":{
                      list_bills.push({
                        "target" : printers[n].type,
                        "name" : printers[n].name,
                        "settings": {
                                      "marginsType": 1, //No Margin
                                      "printBackground": true, 
                                      "pageSize": {
                                        "height": printers[n].height > 0 ? printers[n].height * 1000 : 891000,
                                        "width": printers[n].width * 1000
                                      },
                                      "silent": true
                                    }
                      });
                      break;
                    }
                    case "DUPLICATE_BILL":{
                      list_bills_duplicate.push({
                        "target" : printers[n].type,
                        "name" : printers[n].name,
                        "settings": {
                                      "marginsType": 1, //No Margin
                                      "printBackground": true, 
                                      "pageSize": {
                                        "height": printers[n].height > 0 ? printers[n].height * 1000 : 891000,
                                        "width": printers[n].width * 1000
                                      },
                                      "silent": true
                                    }
                      });
                      break;
                    }
                    case "REPORT":{
                      list_report.push({
                        "target" : printers[n].type,
                        "name" : printers[n].name,
                        "settings": {
                                      "marginsType": 1, //No Margin
                                      "printBackground": true, 
                                      "pageSize": {
                                        "height": printers[n].height > 0 ? printers[n].height * 1000 : 891000,
                                        "width": printers[n].width * 1000
                                      },
                                      "silent": true
                                    }
                      });
                      break;
                    }
                    case "VIEW":{
                      list_view.push({
                        "target" : printers[n].type,
                        "name" : printers[n].name,
                        "settings": {
                                      "marginsType": 1, //No Margin
                                      "printBackground": true, 
                                      "pageSize": {
                                        "height": printers[n].height > 0 ? printers[n].height * 1000 : 891000,
                                        "width": printers[n].width * 1000
                                      },
                                      "silent": true
                                    }
                      });
                      break;
                    }
                  }
                }
                n++;
              }

              var printersMasterList = [
                {"type": "KOT", "list": list_kot},
                {"type": "BILL", "list": list_bills},
                {"type": "DUPLICATE_BILL", "list": list_bills_duplicate},
                {"type": "REPORT", "list": list_report},
                {"type": "VIEW", "list": list_view}
              ];

              window.localStorage.configuredPrintersData = JSON.stringify(printersMasterList);

          }
          else{
            showToast('Not Found Error: Configured Printers data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Configured Printers data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Configured Printers data.', '#e74c3c');
      }

    });  
}





/* Easy Activation */
function activateApplicationFromHomeScreen(){
  document.getElementById("applicationActivationLockDefault").style.display = 'none';
  document.getElementById("applicationActivationLockActive").style.display = 'block';
  $('#activation_code_home_entered').focus();
}

function activateApplicationFromHomeHide(){
  document.getElementById("applicationActivationLockDefault").style.display = 'none';
  document.getElementById("applicationActivationLockActive").style.display = 'block';
}


function viewServerURL(){
  
  document.getElementById("serverConnectionURLDisplayModal").style.display = 'block';

  var default_ip = '127.0.0.1';
  var default_port = '5984';
  var default_username = 'admin';
  var default_password = 'admin';

  var saved_url = window.localStorage.serverConnectionURL ? JSON.parse(decodeURI(window.localStorage.serverConnectionURL)) : '';

  if(saved_url == ''){
    $('#add_custom_server_ip').val(default_ip);
    $('#add_custom_server_port').val(default_port);
    $('#add_custom_server_username').val(default_username);
    $('#add_custom_server_password').val(default_password);
  }
  else{
    $('#add_custom_server_ip').val(saved_url.ip);
    $('#add_custom_server_port').val(saved_url.portNumber);
    $('#add_custom_server_username').val(saved_url.username);
    $('#add_custom_server_password').val(saved_url.password);
  }
}

function viewServerURLHide(){
  document.getElementById("serverConnectionURLDisplayModal").style.display = 'none';
}

function setServerConnectionURL(){

  var userURL = {
    'ip' : $('#add_custom_server_ip').val(),
    'portNumber' : $('#add_custom_server_port').val(),
    'username': $('#add_custom_server_username').val(),
    'password': $('#add_custom_server_password').val()
  };

  userURL.ip = (userURL.ip).replace(/\s/g,'');
  userURL.portNumber = (userURL.portNumber).replace(/\s/g,'');
  userURL.username = (userURL.username).replace(/\s/g,'');
  userURL.password = (userURL.password).replace(/\s/g,'');

  var default_url = 'http://admin:admin@127.0.0.1:5984/';

  if(userURL.ip != '' && userURL.portNumber != ''){
    
    window.localStorage.serverConnectionURL = encodeURI(JSON.stringify(userURL));
    
    if(userURL.username != '' && userURL.password != ''){
      COMMON_LOCAL_SERVER_IP = 'http://'+userURL.username+':'+userURL.password+'@'+userURL.ip+':'+userURL.portNumber+'/';
    }
    else{
      COMMON_LOCAL_SERVER_IP = 'http://'+userURL.ip+':'+userURL.portNumber+'/';
    }

    viewServerURLHide();
  }
  else{
    COMMON_LOCAL_SERVER_IP = default_url;
    showToast('Error: Add valid Server Credentials', '#e74c3c');
  }
}


function goProceedToActivation(){

  var activation_code = document.getElementById("activation_code_home_entered").value;

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
        url: 'https://accelerateengine.app/apis/posactivateapplication.php',
        data: JSON.stringify(admin_data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {

          hideLoading();

          if(data.status){
            pushLicenseToLocaServerFromHome(data.response);
          }
          else{
            if(data.errorCode == 404){
              showToast(data.error, '#2c3e50');
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


function pushLicenseToLocaServerFromHome(licenceObject){


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_CONFIGURED_MACHINES" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
          if(data.docs[0].identifierTag == 'ACCELERATE_CONFIGURED_MACHINES'){

             var machinesList = data.docs[0].value;

             for (var i=0; i<machinesList.length; i++) {
               if(machinesList[i].licence == licenceObject.licence){
                  showToast('Activation Error: Licence already used.', '#e74c3c');
                  return '';
               }
             }

              machinesList.push(licenceObject);
              var remember_rev = data.docs[0]._rev;
              createFirstTimeActivationStubs(licenceObject, machinesList, remember_rev);
              
          }
          else{
            showToast('Not Found Error: System Configurations data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: System Configurations data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('Server Connection Error: Unable to read System Configurations. Check Server Credentials.', '#e74c3c');
      }

    });  
}


/* create stubs */
function createFirstTimeActivationStubs(licenceObject, machinesList, remember_rev){

  firstTimeStub_personalisations();

  //Step 1 : Personalisations 
  function firstTimeStub_personalisations(){

    var requestData = {"selector": { "identifierTag": "ACCELERATE_PERSONALISATIONS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_PERSONALISATIONS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence.', '#e74c3c');
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
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "theme", "value": "skin-yellow" }, { "name": "menuImages", "value": "NO" }, { "name": "punchingRightScreen", "value": "MENU" }, { "name": "virtualKeyboard", "value": 0 }, { "name": "screenLockOptions", "value": "" }, { "name": "screenLockDuration", "value": "30" }, { "name": "securityPasscodeProtection", "value": "NO" } ] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_PERSONALISATIONS",
                  "value": settingsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_PERSONALISATIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_system_options();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create Personalisations stub data.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_system_options();
              }
                          
          }
          else{
            showToast('Configurations Error: Personalisations data not found.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: Personalisations data not found.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read Personalisations data.', '#e74c3c');
        return '';
      }

    });      
  }


  //Step 2 : System Options
  function firstTimeStub_system_options(){

    var requestData = {"selector": { "identifierTag": "ACCELERATE_SYSTEM_OPTIONS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_SYSTEM_OPTIONS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence.', '#e74c3c');
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
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "notifications", "value": "ALL" }, { "name": "syncOnlineMenu", "value": "NO" }, { "name": "minimumCookingTime", "value": "NO" }, { "name": "expectedReadyTime", "value": "NO" }, { "name": "ServerBasedKOTPrinting", "value": "NO" }, { "name": "KOTJammingWarning", "value": "YES" }, { "name": "orderEditingAllowed", "value": "YES" }, { "name": "onlineOrdersNotification", "value": "YES" }, { "name": "billSettleLater", "value": "NO" }, { "name": "adminIdleLogout", "value": "NO" }, { "name": "resetCountersAfterReport", "value": "NO" }, { "name": "onlineOrders", "value": "NO" }, { "name": "defaultPrepaidName", "value": "Razorpay" }, { "name": "reportEmailList", "value": "" }, { "name": "defaultDeliveryMode", "value": "" }, { "name": "defaultTakeawayMode", "value": "" }, { "name": "defaultDineMode", "value": "" }, { "name": "KOTRelayEnabled", "value": "NO" }, { "name": "KOTRelayEnabledDefaultKOT", "value": "NO" }, { "name": "defaultKOTPrinter", "value": "" }, { "name": "scanPayEnabled", "value": "NO" }, { "name": "scanPayAPI", "value": "" }, { "name": "showDefaultQRCode", "value": "NO" }, { "name": "showDefaultQRTarget", "value": "https://www.accelerate.net.in" }, { "name": "sendMetadataToQR", "value": "NO" } ] } 
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_SYSTEM_OPTIONS",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SYSTEM_OPTIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_custom_shortcuts();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create System Options stub data.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_custom_shortcuts();
              }
                          
          }
          else{
            showToast('Configurations Error: System Options data not found.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: System Options data not found.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read System Options data.', '#e74c3c');
        return '';
      }

    });      
  }



  //Step 3 : Custom Shortcuts
  function firstTimeStub_custom_shortcuts(){

    var requestData = {"selector": { "identifierTag": "ACCELERATE_SHORTCUT_KEYS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_SHORTCUT_KEYS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence.', '#e74c3c');
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
                var new_stub = { "systemName": licenceObject.machineUID, "data": [ { "name": "Show Spotlight Search", "value": "shift+f" }, { "name": "Show Recent Bills", "value": "shift+r" }, { "name": "Start Text To Kitchen", "value": "" }, { "name": "Select Billing Mode", "value": "shift+m" }, { "name": "Set Table/Address", "value": "shift+t" }, { "name": "Focus Guest Details", "value": "" }, { "name": "Focus Item Search", "value": "" }, { "name": "Set Special Comments", "value": "" }, { "name": "Save Current Order", "value": "" }, { "name": "Close Order", "value": "" }, { "name": "Cancel Order", "value": "" }, { "name": "Print KOT", "value": "shift+k" }, { "name": "Generate KOT Silently", "value": "" }, { "name": "Print Item View", "value": "shift+v" }, { "name": "Print Bill", "value": "shift+b" }, { "name": "Generate Bill Silently", "value": "" }, { "name": "Print Duplicate Bill", "value": "shift+d" }, { "name": "Settle Bill", "value": "" }, { "name": "Assign Delivery Agent", "value": "" }, { "name": "Issue Refund", "value": "" }, { "name": "Cancel Invoice", "value": "" }, { "name": "Refresh Application", "value": "" }, { "name": "Refresh Online Orders", "value": "" }, { "name": "Go to All Bills", "value": "" }, { "name": "Switch User", "value": "shift+u" } ] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_SHORTCUT_KEYS",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SHORTCUT_KEYS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_configured_printers();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create Custom Shortcuts stub data.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_configured_printers();
              }
                          
          }
          else{
            showToast('Configurations Error: Custom Shortcuts data not found.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: Custom Shortcuts data not found.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read Custom Shortcuts data.', '#e74c3c');
        return '';
      }

    });      
  }



  //Step 4 : Configured Printer
  function firstTimeStub_configured_printers(){

    var requestData = {"selector": { "identifierTag": "ACCELERATE_CONFIGURED_PRINTERS" }}

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_CONFIGURED_PRINTERS'){

              var settingsList = data.docs[0].value;
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence.', '#e74c3c');
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
                var new_stub = { "systemName": licenceObject.machineUID, "data": [] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_CONFIGURED_PRINTERS",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_CONFIGURED_PRINTERS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      firstTimeStub_kot_relay();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create Configured Printers stub data.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                firstTimeStub_kot_relay();
              }
                          
          }
          else{
            showToast('Configurations Error: Configured Printers data not found.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: Configured Printers data not found.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read Configured Printers data.', '#e74c3c');
        return '';
      }

    });      
  }



  //Step 5 : KOT Relay Data
  function firstTimeStub_kot_relay(){

    var requestData = {"selector": { "identifierTag": "ACCELERATE_KOT_RELAYING" }}

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
              var machineName = licenceObject.machineUID;

              if(!machineName || machineName == ''){
                showToast('Licence Error: Machine Name not issued in Licence.', '#e74c3c');
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
                var new_stub = { "systemName": licenceObject.machineUID, "data": [] }
                settingsList.push(new_stub);
              
                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_KOT_RELAYING",
                  "value": settingsList
                }


                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_KOT_RELAYING/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      finalActivateLicence();
                  },
                  error: function(data) {
                      showToast('Configurations Error: Unable to create KOT Relaying stub data.', '#e74c3c');
                      return '';
                  }
                });  
              } 
              else{
                finalActivateLicence();
              }
                          
          }
          else{
            showToast('Configurations Error: KOT Relaying data not found.', '#e74c3c');
            return '';
          }
        }
        else{
          showToast('Configurations Error: KOT Relaying data not found.', '#e74c3c');      
          return '';
        }
        
      },
      error: function(data) {
        showToast('Configurations Error: Unable to read KOT Relaying data.', '#e74c3c');
        return '';
      }

    });      
  }



  //Step : Final (Create all)
  function finalActivateLicence(){

                //Update configured machines
                var updateData = {
                  "_rev": remember_rev,
                  "identifierTag": "ACCELERATE_CONFIGURED_MACHINES",
                  "value": machinesList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_CONFIGURED_MACHINES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      showToast('Activation Successful', '#27ae60');
                      activateApplicationFromHomeHide();

                      window.localStorage.accelerate_licence_number = licenceObject.licence;
                      window.localStorage.accelerate_licence_machineUID = licenceObject.machineUID;
                                
                      document.getElementById("applicationActivationLock").style.display = 'none';
                      applyLicenceTerms();    
                      
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update System Configurations data.', '#e74c3c');
                  }
                });  
  }

}




/* Apply Personalisations */
function applyPersonalisations(){
  
    //Read from Server, apply changes, and save to LocalStorage
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_PERSONALISATIONS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_PERSONALISATIONS'){

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
                      if(params[i].name == "theme"){

                        /*Change Theme*/
                        var tempList = document.getElementById("mainAppBody").classList.toString();
                        tempList = tempList.split(" ");

                        tempList[0] = params[i].value;

                        tempList = tempList.toString();
                        tempList = tempList.replace (/,/g, " ");

                        document.getElementById("mainAppBody").className = tempList; 

                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_Theme = params[i].value;
                      }
                      else if(params[i].name == "menuImages"){

                        var tempVal = params[i].value == 'YES'? true: false;

                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_ImageDisplay = tempVal;
                      }
                      else if(params[i].name == "punchingRightScreen"){

                        if(params[i].value != 'MENU' && params[i].value != 'TABLE'){
                          params[i].value = 'MENU';
                        }

                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_OrderPageRightPanelDisplay = params[i].value;
                      }
                      else if(params[i].name == "virtualKeyboard"){
                        var tempVal = params[i].value;
                        tempVal = parseFloat(tempVal);
                        
                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_Keyboard = tempVal;
                      }
                      else if(params[i].name == "screenLockOptions"){
                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_InactivityEnabled = tempVal;
                      } 
                      else if(params[i].name == "screenLockDuration"){
                        var tempVal = params[i].value;
                        tempVal = parseInt(tempVal);
                        
                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_InactivityScreenDelay = tempVal;
                      } 
                      else if(params[i].name == "securityPasscodeProtection"){

                        var tempVal = params[i].value == 'YES'? true: false;

                        if(tempVal){
                          lockScreen();
                        }

                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_PasscodeProtection = tempVal;
                      }                      
                    } //end FOR (Render)

                    break;
                }
              }


              //REMOVE WELCOME SCREEN
              setTimeout(function() { removeWelcomeScreen(); }, 300);
              
          }
          else{
            showToast('Not Found Error: Personalisations data not found.', '#e74c3c');
            
            //REMOVE WELCOME SCREEN
            setTimeout(function() { removeWelcomeScreen(); }, 300);
          }
        }
        else{
          showToast('Not Found Error: Personalisations data not found.', '#e74c3c');
          
          //REMOVE WELCOME SCREEN
          setTimeout(function() { removeWelcomeScreen(); }, 300);        
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Personalisations data.', '#e74c3c');

        //REMOVE WELCOME SCREEN
        setTimeout(function() { removeWelcomeScreen(); }, 300);
      }

    });  
  
}

/* Apply Bill Layout */
function applyBillLayout(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_BILL_LAYOUT" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_BILL_LAYOUT'){

              var layoutData = data.docs[0].value;

              var n = 0;
              while(layoutData[n]){
                
                switch(layoutData[n].name){
                  case "data_custom_header_image":{
                    window.localStorage.bill_custom_header_image = layoutData[n].value;
                    break;
                  }
                  case "data_custom_top_right_name":{
                    window.localStorage.bill_custom_top_right_name = layoutData[n].value;
                    break;
                  }
                  case "data_custom_top_right_value":{
                    window.localStorage.bill_custom_top_right_value = layoutData[n].value;
                    break;
                  }
                  case "data_custom_bottom_pay_heading":{
                    window.localStorage.bill_custom_bottom_pay_heading = layoutData[n].value;
                    break;
                  }
                  case "data_custom_bottom_pay_brief":{
                    window.localStorage.bill_custom_bottom_pay_brief = layoutData[n].value;
                    break;
                  }
                  case "data_custom_footer_comments":{
                    window.localStorage.bill_custom_footer_comments = layoutData[n].value;
                    break;
                  }
                  case "data_custom_footer_address":{
                    window.localStorage.bill_custom_footer_address = layoutData[n].value;
                    break;
                  }
                  case "data_custom_footer_contact":{
                    window.localStorage.bill_custom_footer_contact = layoutData[n].value;
                    break;
                  }
                }

                n++;
              }

          }
          else{
            showToast('Not Found Error: Billing Layout data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Billing Layout data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Billing Layout data not found.', '#e74c3c');
      }

    });

}



/* Apply Shortcuts */
function applyShortcuts(){
  
    //Read from Server, apply changes, and save to LocalStorage
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_SHORTCUT_KEYS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_SHORTCUT_KEYS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){
                    window.localStorage.custom_shortcut_keys = JSON.stringify(settingsList[n].data);
                    initialiseKeyboardShortcuts();
                    break;
                }
              }

          }
          else{
            showToast('Not Found Error: Keyboard Shortcuts data not found.', '#e74c3c');
            initialiseKeyboardShortcuts();
          }
        }
        else{
          showToast('Not Found Error: Keyboard Shortcuts data not found.', '#e74c3c');
          initialiseKeyboardShortcuts();
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Keyboard Shortcuts data.', '#e74c3c');
        initialiseKeyboardShortcuts();
      }

    });    
}





/* KEYBOARD SHORTCUTS using MousetrapJS */

function initialiseKeyboardShortcuts(){

  /* Default Shortcuts */
  Mousetrap.bind(['f1'], function() {
    showSpotlight();
    return false;
  })



  var shortcutsData = window.localStorage.custom_shortcut_keys ? JSON.parse(window.localStorage.custom_shortcut_keys) : [];

  var n = 0;
  while(shortcutsData[n]){

    if(shortcutsData[n].value != ''){
      switch(shortcutsData[n].name){

        case "Show Spotlight Search":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              showSpotlight();
            }
            
            return false;
          })

          break;
        } 
        case "Show Recent Bills":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              showRecentBillsPreview();
            }
            
            return false;
          })

          break;
        }
        case "Start Text To Kitchen":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              openTalkToKitchen();
            }
            
            return false;
          })

          break;
        } 
        case "Select Billing Mode":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if(currentRunningPage == 'new-order'){
              if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
                requestUserToWait();
              }
              else{
                $('#customer_form_data_mode').click();
              }
              
            }
            
            return false;
          })

          break;
        }
        case "Set Table/Address":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              $("#triggerClick_TableAddressButton").click();
            }
            
            return false;
          })

          break;
        }
        case "Focus Guest Details":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            $('#customer_form_data_mobile').focus().val($('#customer_form_data_mobile').val());
            return false;
          })

          break;
        }
        case "Focus Item Search":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            $('#add_item_by_search').focus().val($('#add_item_by_search').val());
            return false;
          })

          break;
        }
        case "Set Special Comments":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              $("#triggerClick_SpecialRequestsButton").click();
            }
            
            return false;
          })

          break;
        }
        case "Save Current Order":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              $("#triggerClick_saveOrderButton").click();
            }
            
            return false;
          })

          break;
        }
        case "Close Order":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              $("#triggerClick_closeOrderButton").click();
            }
            
            return false;
          })

          break;
        }
        case "Cancel Order":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              $("#triggerClick_cancelOrderButton").click();
            }
            
            return false;
          })

          break;
        }
        case "Print KOT":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              if($('#triggerClick_PrintKOTButton').hasClass("shortcutSafe")){
               $("#triggerClick_PrintKOTButton").click(); //to avoid double clicks
              }
            }
           
            return false;
          })

          break;
        }
        case "Generate KOT Silently":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make shortcut printing safe
              requestUserToWait();
            }
            else{
              if($('#triggerClick_PrintKOTSilentlyButton').hasClass("shortcutSafe")){
               $("#triggerClick_PrintKOTSilentlyButton").click(); //to avoid double clicks
              }
            }
            
            return false;
          })

          break;
        }
        case "Print Bill":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              if($('#triggerClick_PrintBillButton').hasClass("shortcutSafe")){
                $("#triggerClick_PrintBillButton").click(); //to avoid double clicks
              } 
            }
            
            return false;
          })
          break;
        }
        case "Generate Bill Silently":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#billPreviewModal').is(':visible')) {
              if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
                requestUserToWait();
              }
              else{
                $("#billButtonAction_generateSilently").click();
              }
            }
            return false;
          })

          break;
        }        
        case "Print Item View":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              if($('#triggerClick_PrintItemViewButton').hasClass("shortcutSafe")){
                $("#triggerClick_PrintItemViewButton").click(); //to avoid double clicks
              }
              
            }
            
            return false;
          })
          break;
        }
        case "Print Duplicate Bill":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            $("#triggerClick_PrintDuplicateBillButton").click();
            return false;
          })
          break;
        }
        case "Settle Bill":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            } 
            else{
              $("#triggerClick_settleBillButton").click();
            }
            
            return false;
          })
          break;
        }
        case "Assign Delivery Agent":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            $("#triggerClick_AssignAgentButton").click();
            return false;
          })
          break;
        }
        case "Issue Refund":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            $("#triggerClick_IssueRefundButton").click();
            return false;
          })
          break;
        }
        case "Cancel Invoice":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              $("#triggerClick_CancelInvoiceButton").click();
            }
            
            return false;
          })
          break;
        }
        case "Refresh Application":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              renderPage('new-order', 'Punch Order');
            }
            
            return false;
          })
          break;
        }
        case "Refresh Online Orders":{
          Mousetrap.bind([shortcutsData[n].value], function() {

            if($('#onlineOrders_incoming').hasClass('billTypeSelectionBox')){
              $("#triggerClick_refreshOnlineButton_Pending").click();
            }
            else if($('#onlineOrders_live').hasClass('billTypeSelectionBox')){
              $("#triggerClick_refreshOnlineButton_Live").click();
            }
            else if($('#onlineOrders_completed').hasClass('billTypeSelectionBox')){
              $("#triggerClick_refreshOnlineButton_Completed").click();
            }
            
            return false;
          })
          break;
        }
        case "Go to All Bills":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{
              renderPage('settled-bills', 'Generated Bills');
            }
            
            return false;
          })
          break;
        }
        case "Switch User":{
          Mousetrap.bind([shortcutsData[n].value], function() {
            if($('#generalPrintingProgressModal').is(':visible')) { //to make printing safe
              requestUserToWait();
            }
            else{ 
              $("#currentUserProfileDisplay").click();
            }
            
            return false;
          })

          break;
        }
      }
    }

    n++;
  }

}



function requestUserToWait(){
  
  document.getElementById("pleaseWaitWarning").style.display = 'block';
  playNotificationSound('ENABLE');

  setTimeout(function(){ 
    document.getElementById("pleaseWaitWarning").style.display = 'none';
  }, 1300);
}


/* Apply Personalisations */
function applySystemOptionSettings(){
  
    //Read from Server, apply changes, and save to LocalStorage
    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_SYSTEM_OPTIONS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_SYSTEM_OPTIONS'){

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              var isServerBasedKOTPrintingEnabled = false;

              for(var n=0; n<settingsList.length; n++){

                if(settingsList[n].systemName == machineName){

                    var params = settingsList[n].data;

                    //Render
                    for (var i=0; i<params.length; i++){
                      if(params[i].name == "notifications"){           
                        window.localStorage.systemOptionsSettings_notifications = params[i].value;
                        NOTIFICATION_FILTER = params[i].value;
                      }
                      else if(params[i].name == "onlineOrders"){

                        var tempVal = params[i].value == 'YES'? true: false;

                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_OnlineOrders = tempVal;
                      }
                      
                      else if(params[i].name == "ServerBasedKOTPrinting"){
                        var tempVal = params[i].value == 'YES'? 1: 0;

                        if(tempVal == 1){
                          isServerBasedKOTPrintingEnabled = true;
                        }

                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_serverBasedKOTPrinting = tempVal;
                      }
                      else if(params[i].name == "KOTJammingWarning"){
                        var tempVal = params[i].value == 'YES'? true: false;

                        if(tempVal && isServerBasedKOTPrintingEnabled){
                          checkForJammedKOTs();
                        }

                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_KOTJammingWarning = tempVal;
                      }
                      else if(params[i].name == "resetCountersAfterReport"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_resetCountersAfterReport = tempVal;
                      }
                      else if(params[i].name == "orderEditingAllowed"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_orderEditingAllowed = tempVal;
                      }
                      else if(params[i].name == "syncOnlineMenu"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_syncOnlineMenu = tempVal;
                      }
                      else if(params[i].name == "minimumCookingTime"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_minimumCookingTime = tempVal;
                      }
                      else if(params[i].name == "expectedReadyTime"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_expectedReadyTime = tempVal;
                      }
                      else if(params[i].name == "onlineOrdersNotification"){

                        var tempVal = (params[i].value == 'YES'? true: false);

                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_OnlineOrdersNotification = tempVal;
                      }
                      else if(params[i].name == "billSettleLater"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_SettleLater = tempVal;
                      }
                      else if(params[i].name == "adminIdleLogout"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_AdminIdleLogout = tempVal;
                      }
                      else if(params[i].name == "KOTRelayEnabled"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_KOTRelayEnabled = tempVal;
                      }
                      else if(params[i].name == "KOTRelayEnabledDefaultKOT"){

                        var tempVal = (params[i].value == 'YES'? 1: 0);

                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_KOTRelayEnabledDefaultKOT = tempVal;
                      }
                      else if(params[i].name == "defaultPrepaidName"){
                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_defaultPrepaidName = tempVal;
                      }
                      else if(params[i].name == "reportEmailList"){
                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.appOtherPreferences_reportEmailList = tempVal;
                      }
                      else if(params[i].name == "defaultDeliveryMode"){
                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_defaultDeliveryMode = tempVal;
                      } 
                      else if(params[i].name == "defaultTakeawayMode"){
                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_defaultTakeawayMode = tempVal;
                      } 
                      else if(params[i].name == "defaultDineMode"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_defaultDineMode = tempVal;
                      }
                      else if(params[i].name == "defaultKOTPrinter"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.systemOptionsSettings_defaultKOTPrinter = tempVal;
                      }
                      else if(params[i].name == "scanPayEnabled"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.scanPaySettings_scanPayEnabled = tempVal;
                      }
                      else if(params[i].name == "scanPayAPI"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.scanPaySettings_scanPayAPI = tempVal;
                      }
                      else if(params[i].name == "showDefaultQRCode"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.scanPaySettings_showDefaultQR = tempVal;
                      }
                      else if(params[i].name == "showDefaultQRTarget"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.scanPaySettings_defaultQRTarget = tempVal;
                      }         
                      else if(params[i].name == "sendMetadataToQR"){

                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.scanPaySettings_sendMetadataToQR = tempVal;
                      }             
                    } //end FOR (Render)

                    break;
                }
              }

          }
          else{
            showToast('Not Found Error: System Options data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: System Options data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read System Options data.', '#e74c3c');
      }

    });  
  
}



function applySystemName(){
  if(window.localStorage.appCustomSettings_SystemName && window.localStorage.appCustomSettings_SystemName != ''){
    document.getElementById("thisSystemName").innerHTML = '<tag class="noSystemNameSet" onclick="renderPage(\'system-settings\', \'System Settings\'); openSystemSettings(\'configureSystem\');">'+window.localStorage.appCustomSettings_SystemName+'</tag>';
  }
  else{
    window.localStorage.appCustomSettings_SystemName = 'Nameless Machine';
    document.getElementById("thisSystemName").innerHTML = '<tag class="noSystemNameSet" onclick="renderPage(\'system-settings\', \'System Settings\'); openSystemSettings(\'configureSystem\');">Nameless Machine</tag>';
  }
}

applySystemName();



/*Start Up Sound*/
//playNotificationSound('STARTUP');


/* Expand/Contract Sidebar */
function activateSidebarElement(barID){

  if (document.getElementById(barID).classList.contains('active')){
    document.getElementById(barID).classList.remove('active');
  }
  else{
    document.getElementById(barID).classList.add('active');
  }
}


function activateSidebar(){

  if (document.getElementsByTagName("body")[0].classList.contains('sidebar-collapse')){
    document.getElementsByTagName("body")[0].classList.remove('sidebar-collapse');
  }
  else{
    document.getElementsByTagName("body")[0].classList.add('sidebar-collapse');
  }
}


/* Virtual Keyboard */

/* 

// Disabled for Version 1 (No Touch Support) on 15.05.2018

$(function () {
    "use strict";
    jqKeyboard.init();
});
*/

/* Server Connectivity */
function pingServer(){

      var admin_data = {
        "token": window.localStorage.loggedInAdmin
      }

      $.ajax({
        type: 'POST',
        url: 'https://www.accelerateengine.app/apis/pospingserver.php',
        data: JSON.stringify(admin_data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 2000,
        success: function(data) {
          if(data.status){
            return true;
          }
          else
          {
            if(data.errorCode == 404){
              window.localStorage.loggedInAdmin = "";
              showToast(data.error, '#2c3e50');
              return false;
            }
            return false;
          }
        },
        error: function(data){
          showToast('Failed to ping the Cloud Server. Please check your connection.', '#e74c3c');
          return false;
        }
      });     
}


function renderServerConnectionStatus(){

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


  //Online orders enabled 
  var isOnlineOrdersEnabled = window.localStorage.accelerate_licence_online_enabled ? window.localStorage.accelerate_licence_online_enabled : 0; 
  var isOnlineOrdersAccepted = window.localStorage.systemOptionsSettings_OnlineOrders ? window.localStorage.systemOptionsSettings_OnlineOrders : false;

  if(isUserAnAdmin && (isOnlineOrdersEnabled == 1 && (isOnlineOrdersAccepted == 'true' || isOnlineOrdersAccepted == true))){
    
      var admin_data = {
        "token": window.localStorage.loggedInAdmin,
      }

      $.ajax({
        type: 'POST',
        url: 'https://www.accelerateengine.app/apis/pospingserver.php',
        data: JSON.stringify(admin_data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 2000,
        success: function(data) {
          if(data.status){
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatus"><i class="fa fa-globe globeRotation"></i> Connected</tag>';
          }
          else
          {
            if(data.errorCode == 404){
              window.localStorage.loggedInAdmin = "";
              showToast(data.error, '#2c3e50');
              document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-globe"></i> Re-authenticate</tag>';
              return '';
            }
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-globe"></i> Not Connected</tag>';
          }
        },
        error: function(data){
          showToast('Failed to ping the Cloud Server. Please check your connection.', '#e74c3c');
          document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-exclamation-triangle"></i> Error in Connection</tag>';
        }
      });
  }
}



function getServerConnectionStatus(){


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


  //Online orders enabled 
  var isOnlineOrdersEnabled = window.localStorage.accelerate_licence_online_enabled ? window.localStorage.accelerate_licence_online_enabled : 0; 
  var isOnlineOrdersAccepted = window.localStorage.systemOptionsSettings_OnlineOrders ? window.localStorage.systemOptionsSettings_OnlineOrders : false;

  if(isUserAnAdmin && (isOnlineOrdersEnabled == 1 && (isOnlineOrdersAccepted == 'true' || isOnlineOrdersAccepted == true))){
    
      var admin_data = {
        "token": window.localStorage.loggedInAdmin,
      }

      $.ajax({
        type: 'POST',
        url: 'https://www.accelerateengine.app/apis/pospingserver.php',
        data: JSON.stringify(admin_data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 2000,
        success: function(data) {

          if(data.status){
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatus"><i class="fa fa-globe globeRotation"></i> Connected</tag>';
          }
          else
          {
            if(data.errorCode == 404){
              window.localStorage.loggedInAdmin = "";
              showToast(data.error, '#2c3e50');
              document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-globe"></i> Re-authenticate</tag>';
              return '';
            }
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-globe"></i> Not Connected</tag>';
          }
        },
        error: function(data){
          showToast('Failed to ping the Cloud Server. Please check your connection.', '#e74c3c');
          document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-exclamation-triangle"></i> Error in Connection</tag>';
        }
      });

    //Repeat
    var t = setTimeout(function() {
      getServerConnectionStatus()
    }, 60000);
  
  }
  else{
    document.getElementById("globalServerConnectionStatusHolder").style.display = 'none';
  }

}



/* Session Auto Switcher */
function autoSessionSwitchChecker(){



    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_DINE_SESSIONS" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
          if(data.docs[0].identifierTag == 'ACCELERATE_DINE_SESSIONS'){

            var sessionsList = data.docs[0].value;
            var currentSession = window.localStorage.setSessionData ? JSON.parse(window.localStorage.setSessionData) : [];
             
            var timeNow = moment(new Date(), 'hhmm');
            var recordedTime = moment(currentSession.timeTo, 'hhmm');

            var duration = (moment.duration(timeNow.diff(recordedTime))).asSeconds();
            

            if(duration){ //Session over by more than 5 minutes
               for (var i=0; i<sessionsList.length; i++) {

                  if(sessionsList[i].name != currentSession.name){
                      var rec_start = moment(sessionsList[i].startTime, 'hhmm');
                      var rec_end = moment(sessionsList[i].endTime, 'hhmm');

                      var timeStart = (moment.duration(timeNow.diff(rec_start))).asSeconds();
                      var timeEnd = (moment.duration(timeNow.diff(rec_end))).asSeconds();
                      

                      if(timeStart > 0 && timeEnd < 0){
                        //This is the Next Session!
                        showSessionSuggestion(currentSession, sessionsList[i]);
                        break;
                      }
                  }
              }
            }

          }
        }
      }
    });

    //Repeat
    var t = setTimeout(function() {
      autoSessionSwitchChecker()
    }, 300000);
}


function showSessionSuggestion(currentSession, suggestedSession){

  document.getElementById("sessionSwapWarning").style.display = 'block';

  document.getElementById("sessionSwapWarningContent").innerHTML = 'The current <b>'+currentSession.name+' Session</b> (from '+(getFancyTime(currentSession.timeFrom))+' to '+(getFancyTime(currentSession.timeTo))+') has ended already. Do you want to switch to the next <b>'+suggestedSession.name+' Session</b> ('+(getFancyTime(suggestedSession.startTime))+' - '+(getFancyTime(suggestedSession.endTime))+')?';
  document.getElementById("sessionSwapWarningActions").innerHTML = '<button class="btn btn-default" onclick="hideSessionSuggestion()" style="float: left">Not Now</button>'+
                  '<button class="btn btn-success" onclick="acceptSessionSuggestion(\''+encodeURI(JSON.stringify(suggestedSession))+'\')" style="float: right">Switch Session</button>';

}

function hideSessionSuggestion(){
  document.getElementById("sessionSwapWarning").style.display = 'none';
}

function acceptSessionSuggestion(encodedSession){
  var sessionObject = JSON.parse(decodeURI(encodedSession));
  hideSessionSuggestion();
  switchSession(sessionObject.name, sessionObject.startTime, sessionObject.endTime);
}


/* CouchDB Local Server Connection Test */
var checkServerRefreshInterval;
var serverRefreshCounter = 10;

function testLocalServerConnection(retryFlag){

        serverRefreshCounter = 10;
        clearInterval(checkServerRefreshInterval);

        showLoading(10000, 'Trying to reach the Server'); 
        $.ajax({
            type: 'GET',
            url: COMMON_LOCAL_SERVER_IP,
            timeout: 10000,
            success: function(data) {
              
              hideLoading();
              document.getElementById("serverConnectionFailureLock").style.display = 'none';

              if(retryFlag && retryFlag == 1){
                playNotificationSound('STARTUP');
                showToast('Connected to the Server', '#27ae60');
                applyLicenceTerms(); //TWEAK
              }

              clearInterval(checkServerRefreshInterval);
            },
            error: function(data){

              hideLoading();

              checkServerRefreshInterval = window.setInterval(function() { 
                if(serverRefreshCounter == 1){
                  serverRefreshCounter = 10;
                  testLocalServerConnection(1);
                }
                else{
                  serverRefreshCounter--;
                }

                document.getElementById("refreshServerCheckCounter").innerHTML = 'Auto retry in '+serverRefreshCounter+' seconds';
              }, 1000);

              document.getElementById("serverConnectionFailureLock").style.display = 'block';
              playNotificationSound('ERROR');
              showToast('The local Server is not running or not connected. Please check the connection and start the server.', '#8e44ad')
            }
        });     
}





/*Check Login*/
function checkLogin(){

  if(window.localStorage.loggedInAdmin == ""){
    window.localStorage.loggedInAdminData = '';
  }

  var loggedInAdminInfo = window.localStorage.loggedInAdminData ? JSON.parse(window.localStorage.loggedInAdminData): {};
  
  if(jQuery.isEmptyObject(loggedInAdminInfo)){
    loggedInAdminInfo.name = "";
    loggedInAdminInfo.mobile = "";
    loggedInAdminInfo.branch = "";
    loggedInAdminInfo.branchCode = "";
  }


  if(loggedInAdminInfo.name == '' || loggedInAdminInfo.branch == ''){ //Not logged in
    document.getElementById("loginModalHomeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<span class="avatar"><img src="brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Login to Cloud Server</h1>'+
                                   '</header>'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Username" type="text" id="loginHome_server_username" value="" class="form-control loginWindowInput"> </div> </div>'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Password" type="password" id="loginHome_server_password" value="" class="form-control loginWindowInput"> </div> </div>'+                     
                                    '</div>'+
                                    '<button  onclick="doHomeLogin()" class="btn btn-success loginWindowButton">Login</button>'+
                                    '<button  onclick="cancelLoginWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                '</section>';

    document.getElementById("loginModalHome").style.display = 'block';
    $("#loginHome_server_username").focus();
  }
  else{ //logged in

    document.getElementById("loginModalHomeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<span class="avatar"><img src="brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 24px; margin-bottom: 0; color: #3e5b6b; font-family: \'Roboto\';">'+loggedInAdminInfo.branch+'</h1>'+
                                      '<p style="font-size: 14px; color: #72767d;">Logged In as <b>'+loggedInAdminInfo.name+'</b></p>'+
                                   '</header>'+
                                   '<div style="margin: 15px 0">'+
                                    '<button  onclick="doHomeLogout()" class="btn btn-danger loginWindowButton">Logout Now</button>'+
                                    '<button  onclick="cancelLoginWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                   '</div>'+
                                '</section>';

    document.getElementById("loginModalHome").style.display = 'block';
  }
}

/*Recovery Login*/
function recoveryLogin(){

    showToast('Login to the Server and Prove your identity. We will reset your Screen Lock Code!', '#8e44ad')

    document.getElementById("loginModalHomeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<span class="avatar"><img src="brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Login to the Server</h1>'+
                                   '</header>'+
                                   '<div style="margin: 0">'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Username" type="text" id="loginHome_server_username" value="" class="form-control loginWindowInput"> </div> </div>'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Password" type="password" id="loginHome_server_password" value="" class="form-control loginWindowInput"> </div> </div>'+                     
                                    '</div>'+
                                    '<button  onclick="performRecoveryLogin()" class="btn btn-success loginWindowButton">Login</button>'+
                                    '<button  onclick="cancelLoginWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                   '</div>'+
                                '</section>';

    document.getElementById("loginModalHome").style.display = 'block';
    $("#loginHome_server_username").focus();
}

function performRecoveryLogin(){

  var username = document.getElementById("loginHome_server_username").value;
  var password = document.getElementById("loginHome_server_password").value;

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
    url: 'https://www.accelerateengine.app/apis/posserverrecoverylogin.php',
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
        cancelLoginWindow();
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

function doHomeLogin(){
  var username = document.getElementById("loginHome_server_username").value;
  var password = document.getElementById("loginHome_server_password").value;

  if(username == '' || password ==''){
    showToast('Warning! Enter credentials correctly', '#e67e22');
    return '';
  }

  var data = {
    "mobile": username,
    "password": password
  }

  showLoading(10000, 'Logging on to the Server');

  $.ajax({
    type: 'POST',
    url: 'https://www.accelerateengine.app/apis/posserverlogin.php',
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    success: function(data) {
      hideLoading();
      if(data.status){

        var userInfo = {};
        userInfo.name = data.user;
        userInfo.mobile = data.mobile;
        userInfo.branch = data.branch;
        userInfo.branchCode = data.branchCode;

        window.localStorage.loggedInAdminData = JSON.stringify(userInfo);

        window.localStorage.loggedInAdmin = data.response;
        showToast('Succesfully logged in to '+data.branch, '#27ae60');
        initScreenSaver(); //Screensaver changes
        cancelLoginWindow();
        renderServerConnectionStatus();
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

function doHomeLogout(){
  window.localStorage.loggedInAdmin = '';
  window.localStorage.loggedInAdminData = '';
  showToast('You have been logged out from the Cloud Server', '#27ae60');
  initScreenSaver(); //Screensaver changes
  cancelLoginWindow();
  renderServerConnectionStatus(); 
}

function cancelLoginWindow(){
  document.getElementById("loginModalHome").style.display = 'none';
}



//ONLINE ORDERS PENDING COUNT
function getOnlineOrdersCount() {

  window.localStorage.lastOnlineNotificationCount = 0;

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


  //Online orders enabled 
  var isOnlineOrdersEnabled = window.localStorage.accelerate_licence_online_enabled ? window.localStorage.accelerate_licence_online_enabled : 0; 
  var isOnlineOrdersAccepted = window.localStorage.systemOptionsSettings_OnlineOrders ? window.localStorage.systemOptionsSettings_OnlineOrders : false;
  var isOnlineShowingNotifications = window.localStorage.systemOptionsSettings_OnlineOrdersNotification && window.localStorage.systemOptionsSettings_OnlineOrdersNotification != 'false' ? window.localStorage.systemOptionsSettings_OnlineOrdersNotification : false;
  if(isUserAnAdmin && (isOnlineOrdersEnabled == 1 && (isOnlineOrdersAccepted == 'true' || isOnlineOrdersAccepted == true))){
    
      //Refresh Badge Counts
      var admin_data = {};
      admin_data.token = window.localStorage.loggedInAdmin;  
      admin_data.status = 0;
      
      $.ajax({
        type: 'POST',
        url: 'https://www.accelerateengine.app/apis/fetchorders.php',
        data: JSON.stringify(admin_data),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(netdata) {
          if(netdata.status){
                        if(netdata.count != 0){
                          document.getElementById('onlineOrderCounter').style.display = 'inline-block';
                          document.getElementById('onlineOrderCounter').innerHTML = netdata.count;


                          var last_seen_count = window.localStorage.lastOnlineNotificationCount ? parseInt(window.localStorage.lastOnlineNotificationCount) : 0;
                          var new_count = netdata.count;

                          if(new_count > last_seen_count && isUserAnAdmin && isOnlineShowingNotifications){
                            document.getElementById('onlineOrderReceivedAlert').style.display = 'block';
                            document.getElementById('onlineOrderReceivedAlertCount').innerHTML = netdata.count;

                            playNotificationSound('BELL');
                          }
                          else{
                            document.getElementById('onlineOrderReceivedAlert').style.display = 'none';                           
                          }
                        }
                        else{
                          document.getElementById('onlineOrderCounter').style.display = 'none';
                          document.getElementById('onlineOrderReceivedAlert').style.display = 'none';
                        }
          }
          else{
            document.getElementById('onlineOrderCounter').style.display = 'none';
            document.getElementById('onlineOrderReceivedAlert').style.display = 'none';
          }
        },
        error: function(data){
          document.getElementById('onlineOrderCounter').style.display = 'none';
          document.getElementById('onlineOrderReceivedAlert').style.display = 'none';
        }
      });
  
    var t = setTimeout(function(){
      getOnlineOrdersCount();
    }, 10000); 
  
  }
}


function goToOnlineOrders(){

  var online_count = document.getElementById('onlineOrderReceivedAlertCount').innerHTML;
  document.getElementById('onlineOrderReceivedAlert').style.display = 'none';

  window.localStorage.lastOnlineNotificationCount = parseInt(online_count);

  renderPage('online-orders', 'Online Orders');
}


function recheckCloudConnectionStatus(){

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


  //Online orders enabled 
  var isOnlineOrdersEnabled = window.localStorage.accelerate_licence_online_enabled ? window.localStorage.accelerate_licence_online_enabled : 0; 
  var isOnlineOrdersAccepted = window.localStorage.systemOptionsSettings_OnlineOrders ? window.localStorage.systemOptionsSettings_OnlineOrders : false;

  if(isUserAnAdmin && (isOnlineOrdersEnabled == 1 && (isOnlineOrdersAccepted == 'true' || isOnlineOrdersAccepted == true))){
    document.getElementById("globalServerConnectionStatusHolder").style.display = 'block';
    getServerConnectionStatus();
    getOnlineOrdersCount();
  }
  else{
    document.getElementById("globalServerConnectionStatusHolder").style.display = 'none';
  } 
}



/*Track Inactivity*/
var IDLE_TIMEOUT = 900; //default time delay = 15mins
var idleSecondsCounter = 0;
var refreshInterval;

function initScreenSaver(){

  initAdminIdle();

  idleSecondsCounter = 0;
  clearInterval(refreshInterval);


      //Screensaver or Lockscreen part
      if(window.localStorage.appCustomSettings_InactivityEnabled && window.localStorage.appCustomSettings_InactivityEnabled != ''){
        
        if(window.localStorage.appCustomSettings_InactivityEnabled == 'LOCKSCREEN'){
              //Lock Screen options
              /*IMPORTANT -- run only if Lock Code is set*/
              if(window.localStorage.appCustomSettings_InactivityToken && window.localStorage.appCustomSettings_InactivityToken != ''){
                  if(window.localStorage.appCustomSettings_InactivityScreenDelay && window.localStorage.appCustomSettings_InactivityScreenDelay != ''){
                    IDLE_TIMEOUT = window.localStorage.appCustomSettings_InactivityScreenDelay;
                  }

                  refreshInterval = window.setInterval(function() { CheckIdleTime('LOCKSCREEN'); }, 1000);  
              }    
            
        }
        else if(window.localStorage.appCustomSettings_InactivityEnabled == 'SCREENSAVER'){
              //Screen Saver options
              if(window.localStorage.appCustomSettings_InactivityScreenDelay && window.localStorage.appCustomSettings_InactivityScreenDelay != ''){
                IDLE_TIMEOUT = window.localStorage.appCustomSettings_InactivityScreenDelay;
              }

              var loggedInAdminInfo = window.localStorage.loggedInAdminData ? JSON.parse(window.localStorage.loggedInAdminData): {};
              if(loggedInAdminInfo.name && loggedInAdminInfo.name != ''){
                    document.getElementById("inactivityUserName").innerHTML = 'Logged in as <b>'+loggedInAdminInfo.name+'</b>';
              }
              if(loggedInAdminInfo.branch && loggedInAdminInfo.branch != ''){
                    document.getElementById("inactivityBranchName").innerHTML = '<b>'+loggedInAdminInfo.branch+'</b>';
              }

              refreshInterval = window.setInterval(function() { CheckIdleTime('SCREENSAVER'); }, 1000);
          
        }

      

        //Start Tracking Events
        document.onclick = function() {
            idleSecondsCounter = 0;
        };

        document.onmousemove = function() {
            idleSecondsCounter = 0;
        };

        document.onkeypress = function() {
            idleSecondsCounter = 0;
        };

      }

}

initScreenSaver();


function CheckIdleTime(mode) {
      
    idleSecondsCounter++;

    //Screensaver or LockScreen
      if(mode == 'SCREENSAVER'){
        if (idleSecondsCounter >= IDLE_TIMEOUT) {
          document.getElementById("inactivityTimeLapsed").innerHTML = convertTimeLapsed(idleSecondsCounter);
          document.getElementById("inactivity").style.display = 'block';
        }
        else{
          document.getElementById("inactivity").style.display = 'none';
        }
      }
      else if(mode == 'LOCKSCREEN'){
            if (idleSecondsCounter >= IDLE_TIMEOUT) {
              document.getElementById("inactivityLock").style.display = 'block';
              $('#lockScreePasscode').focus();
            }
      }
}


/* 
  IDLE ADMIN - Logout 
*/

var admin_idleSecondsCounter = 0;
var admin_refreshInterval;
function initAdminIdle(){

  admin_idleSecondsCounter = 0;
  clearInterval(admin_refreshInterval);


      if(window.localStorage.appOtherPreferences_AdminIdleLogout && window.localStorage.appOtherPreferences_AdminIdleLogout == 1){
          admin_refreshInterval = window.setInterval(function() { AdminCheckIdleTime(); }, 1000);
      

          //Start Tracking Events
          document.addEventListener('onclick', function() {
              admin_idleSecondsCounter = 0;
          }); 

          document.addEventListener('mousemove', function() {
              admin_idleSecondsCounter = 0;
          }); 

          document.addEventListener('onkeypress', function() {
              admin_idleSecondsCounter = 0;
          }); 
      }



}

function AdminCheckIdleTime(){
      
      admin_idleSecondsCounter++;

      if(!window.localStorage.appOtherPreferences_AdminIdleLogout || window.localStorage.appOtherPreferences_AdminIdleLogout != 1){
        admin_idleSecondsCounter = 0;
        clearInterval(admin_refreshInterval);
        return "";
      }

          if (admin_idleSecondsCounter == 114) { // 2 mins less 6 seconds

              // LOGGED IN USER INFO
              var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
                    
              if(jQuery.isEmptyObject(loggedInStaffInfo)){
                loggedInStaffInfo.name = "";
                loggedInStaffInfo.code = "";
                loggedInStaffInfo.role = "";
              }

              if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){
                showLoading(6000, 'Admin logging out...');
              }
          }
          else if (admin_idleSecondsCounter == 120) { // 2 mins

              // LOGGED IN USER INFO
              var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
                    
              if(jQuery.isEmptyObject(loggedInStaffInfo)){
                loggedInStaffInfo.name = "";
                loggedInStaffInfo.code = "";
                loggedInStaffInfo.role = "";
              }

              if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){
                removeAdminPrevilages();
              }
          }
}



function removeAdminPrevilages(){

  // LOGGED IN USER INFO
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){
    loggedInStaffInfo.role = 'STEWARD';
    window.localStorage.loggedInStaffData = JSON.stringify(loggedInStaffInfo);
    
    // What to do after setting Profile?
    renderSideNavigation();

    if(currentRunningPage != ''){
      renderPage(currentRunningPage);
    }
    else{ //render default page
      renderPage('new-order', 'Punch Order');
    }


    //ask for passcode again
    var temp_profile = loggedInStaffInfo;
    temp_profile.role = 'ADMIN';
    var temp_profile_encode = JSON.stringify(temp_profile);
    admin_idleSecondsCounter = 0;

    switchProfile(temp_profile_encode);

    showToast('Message: You are not an admin now. Login again to get the Admin access.', '#e67e22');
  }  
}


function convertTimeLapsed(seconds){
  if(seconds < 60){
    return seconds+'s';
  }
  else if(seconds < 3600){
    return parseInt(seconds/60)+'m '+(seconds%60)+'s';
  }
  else{
    return parseInt(seconds/3600)+'h '+parseInt(parseInt(seconds%3600)/60)+'m '+((seconds%3600)%60)+'s';
  }
}


/*Lock Screen*/
$("#lockScreePasscode").keyup(function(){
    if($(this).val().length == 4){
      if(!validateScreenLockCode($(this).val()))//Wrong Passcode
      {
        playNotificationSound('ERROR');
        $("#lockScreePasscode").css("background-color", "#fdb6c2");
      }
      else{
        //Unlock Screen
        playNotificationSound('STARTUP');
        $(this).val('');
        document.getElementById("inactivityLock").style.display = 'none';
      }
    }
    else{
      $("#lockScreePasscode").css("background-color", "");
    }
    
});


function validateScreenLockCode(code){
  var value = '';
  if(window.localStorage.appCustomSettings_InactivityToken && window.localStorage.appCustomSettings_InactivityToken != ''){
            value = atob(window.localStorage.appCustomSettings_InactivityToken);
            if(value == code){ //Code matches
              return true;
            }
            else{
              return false;
            }
  }
  else{
    return false;
  }  
  
}

function lockScreen(){
  document.getElementById("inactivityLock").style.display = 'block';
  $('#lockScreePasscode').focus();
}


function switchProfile(encodedProfile){

   var userProfile = JSON.parse(decodeURI(encodedProfile));

   var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
    }

    if(loggedInStaffInfo.code == userProfile.code){ //Same as already logged in profile
      //if logged in as admin, but admin access was revoked due to idle.
      if(userProfile.role == 'ADMIN' && loggedInStaffInfo.role == 'STEWARD'){
        //ask for password again
      }
      else{
        selectStewardWindowClose(); //Skip
        return '';
      }
    }

    if(userProfile.role != 'STEWARD'){
      //Ask for Admin Password
      enableAdminUser(userProfile);
      selectStewardWindowClose();
      return '';
    }
    else{
      //Do nothing
    }
 
    loggedInStaffInfo.name = userProfile.name;
    loggedInStaffInfo.code = userProfile.code;
    loggedInStaffInfo.role = userProfile.role;

    window.localStorage.loggedInStaffData = JSON.stringify(loggedInStaffInfo);

    // What to do after setting Profile?
    renderCurrentUserDisplay();
    renderSideNavigation();

    if(currentRunningPage != ''){
      renderPage(currentRunningPage);
    }
    else{ //render default page
      renderPage('new-order', 'Punch Order');
    }

    selectStewardWindowClose();
    recheckCloudConnectionStatus();

    $("#customer_form_data_mobile").focus();
}


/*Steward Selection*/
function selectStewardWindow(){
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
  }

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_STAFF_PROFILES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_STAFF_PROFILES'){

              var users = data.docs[0].value;
              users.sort(); //alphabetical sorting 

              if(users.length == 0){
                showToast('Warning: No User registered yet.', '#e67e22');
                return '';
              }

              var n = 0;
              var renderContent = '';
              var isRendered = false;
              var currentUserFound = false;
              var renderCount = 0;

              while(users[n]){

                isRendered = false;

                if(users[n].role == 'STEWARD' || users[n].role == 'ADMIN'){ //Show only Stewards and Admins
                  if(renderCount == 0){
                    isRendered = true;
                    renderContent = '<tag onclick="selectStewardWindowClose()" class="stewardWindowClose" id="stewardWindowCloseButton">X</tag> <div class="row" style="margin: 0">';
                    renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchProfile(\''+encodeURI(JSON.stringify(users[n]))+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                  }
                  else if(renderCount == 1){
                    isRendered = true;
                    renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchProfile(\''+encodeURI(JSON.stringify(users[n]))+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                    renderContent += '</div>';
                  }
                  else if(renderCount > 1 && renderCount%2 == 0){
                    renderContent += '<div class="row" style="margin: 4px 0 0 0">';
                  }

                  if(!isRendered){
                    renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchProfile(\''+encodeURI(JSON.stringify(users[n]))+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                  }

                  if(renderCount > 1 && renderCount%2 == 1){
                    renderContent += '</div>';
                  }
                  renderCount++;
                }

                //Find Current User
                if(loggedInStaffInfo.code == users[n].code){
                  currentUserFound = true;
                }

                n++;
              }

              document.getElementById("stewardModalHomeContent").innerHTML = renderContent;
              document.getElementById("stewardModalHome").style.display = 'block';

              if(currentUserFound){
                document.getElementById("user_switch_"+loggedInStaffInfo.code).classList.add('selectUserProfile');
              }


              /*
                EasySelect Tool (TWO COLUMN - MULTI ROW GRID)
              */
              var tiles = $('#stewardModalHomeContent .easySelectTool_StewardProfile');
              var tileSelected = undefined; //Check for active selection
              var i = 0;
              var currentIndex = 0;
              var lastIndex = 0;

              $.each(tiles, function() {
                if($(tiles[i]).hasClass("selectUserProfile")){
                  tileSelected = tiles.eq(i);
                  currentIndex = i;
                }

                lastIndex = i;
                i++;
              });  

              var easySelectTool = $(document).on('keydown',  function (e) {
                
                if($('#stewardModalHome').is(':visible')) {

                     e.preventDefault();

                     switch(e.which){
                      case 37:{ //  < Left Arrow

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex--;
                              if(currentIndex < 0){
                                currentIndex = lastIndex;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 38:{ //  ^ Up Arrow 
                  
                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              if(currentIndex < 2){
                                if(currentIndex == 0){ //First Col. (FIRST ROW)
                                    if(lastIndex%2 == 1){ //Last Col.
                                      currentIndex = lastIndex - 1;
                                    }
                                    else if(lastIndex%2 == 0){ //First Col.
                                      currentIndex = lastIndex;
                                    }
                                }
                                else if(currentIndex == 1){ //Last Col. (FIRST ROW)
                                    if(lastIndex%2 == 1){ //Last Col.
                                      currentIndex = lastIndex;
                                    }
                                    else if(lastIndex%2 == 0){ //First Col.
                                      currentIndex = lastIndex - 1;
                                    }
                                }
                              }
                              else{
                                currentIndex = currentIndex - 2;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 39:{ // Right Arrow >

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex++;
                              if(currentIndex > lastIndex){
                                currentIndex = 0;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 40:{ // Down Arrow \/ 

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex = currentIndex + 2;
                              if(currentIndex > lastIndex){
                                currentIndex = currentIndex % 2;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 27:{ // Escape (Close)
                        $('#stewardWindowCloseButton').click();
                        easySelectTool.unbind();
                        break;  
                      }
                      case 13:{ // Enter (Confirm)

                        $("#stewardModalHomeContent .easySelectTool_StewardProfile").each(function(){
                          if($(this).hasClass("selectUserProfile")){
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
            showToast('Not Found Error: Registered Users data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Registered Users data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Registered Users data.', '#e74c3c');
      }

    });  

}

function selectStewardWindowClose(){
  document.getElementById("stewardModalHome").style.display = 'none';
}

function renderCurrentUserDisplay(){
   var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
  }

  if(loggedInStaffInfo.name != '' && loggedInStaffInfo.code != ''){
    document.getElementById("currentUserProfileDisplay").innerHTML = '<tag class="currentUserImage"/>'+getImageCode(loggedInStaffInfo.name)+'</tag><span style="font-weight: 400; padding-right: 38px;">'+loggedInStaffInfo.name+'</span>';
  }
  else{
    document.getElementById("currentUserProfileDisplay").innerHTML = '<img src="images/common/default_user.png" class="user-image" alt="Avatar" /> <span style="font-style: italic; font-weight: 300">Profile Not Selected</span>';
  }
}

renderCurrentUserDisplay();




/* SESSION SELECTION */

function switchSession(name, from, to){

   var setSessionInfo = window.localStorage.setSessionData ? JSON.parse(window.localStorage.setSessionData): {};
  
  if(jQuery.isEmptyObject(setSessionInfo)){
    setSessionInfo.name = "";
    setSessionInfo.timeFrom = "";
    setSessionInfo.timeTo = "";
  }
 
    setSessionInfo.name = name;
    setSessionInfo.timeFrom = from;
    setSessionInfo.timeTo = to;

    window.localStorage.setSessionData = JSON.stringify(setSessionInfo);
    renderCurrentSessionDisplay();
    selectSessionWindowClose();
}

function selectSessionWindow(){
  var setSessionInfo = window.localStorage.setSessionData ? JSON.parse(window.localStorage.setSessionData): {};
  
  if(jQuery.isEmptyObject(setSessionInfo)){
    setSessionInfo.name = "";
    setSessionInfo.code = "";
  }


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_DINE_SESSIONS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_DINE_SESSIONS'){

              var sessions = data.docs[0].value;
              sessions.sort(); //alphabetical sorting 

              if(sessions.length == 0){
                showToast('Warning: No Session created yet.', '#e67e22');
                return '';
              }

              var n = 0;
              var renderContent = '';
              var isRendered = false;
              var currentSessionFound = false;
              while(sessions[n]){

                isRendered = false;

                if(n == 0){
                  isRendered = true;
                  renderContent = '<tag onclick="selectSessionWindowClose()" class="stewardWindowClose" id="sessionWindowCloseButton">X</tag> <div class="row" style="margin: 0">';
                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchSession(\''+sessions[n].name+'\', \''+sessions[n].startTime+'\', \''+sessions[n].endTime+'\')" class="stewardProfile easySelectTool_Session" id="session_switch_'+sessions[n].name+'"> <h1 class="stewardName" style="padding-top: 11px">'+sessions[n].name+'<span style="padding-top: 4px; display: block; font-size: 60%; color: #8a8080">'+getFancyTime(sessions[n].startTime)+' - '+getFancyTime(sessions[n].endTime)+'</span></h1> <div class="stewardIcon">'+(n+1)+'</div> </div> </div>';
                }
                else if(n == 1){
                  isRendered = true;
                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchSession(\''+sessions[n].name+'\', \''+sessions[n].startTime+'\', \''+sessions[n].endTime+'\')" class="stewardProfile easySelectTool_Session" id="session_switch_'+sessions[n].name+'"> <h1 class="stewardName" style="padding-top: 11px">'+sessions[n].name+'<span style="padding-top: 4px; display: block; font-size: 60%; color: #8a8080">'+getFancyTime(sessions[n].startTime)+' - '+getFancyTime(sessions[n].endTime)+'</span></h1> <div class="stewardIcon">'+(n+1)+'</div> </div> </div>';
                  renderContent += '</div>';
                }
                else if(n > 1 && n%2 == 0){
                  renderContent += '<div class="row" style="margin: 4px 0 0 0">';
                }

                if(!isRendered){
                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchSession(\''+sessions[n].name+'\', \''+sessions[n].code+'\')" class="stewardProfile easySelectTool_Session" id="session_switch_'+sessions[n].name+'"> <h1 class="stewardName" style="padding-top: 11px">'+sessions[n].name+'<span style="padding-top: 4px; display: block; font-size: 60%; color: #8a8080">'+getFancyTime(sessions[n].startTime)+' - '+getFancyTime(sessions[n].endTime)+'</span></h1> <div class="stewardIcon">'+(n+1)+'</div> </div> </div>';
                }

                if(n > 1 && n%2 == 1){
                  renderContent += '</div>';
                }

                //Find Current User
                if(setSessionInfo.name == sessions[n].name){
                  currentSessionFound = true;
                }

                n++;
              }

              document.getElementById("sessionModalHomeContent").innerHTML = renderContent;
              document.getElementById("sessionModalHome").style.display = 'block';

              if(currentSessionFound){
                document.getElementById("session_switch_"+setSessionInfo.name).classList.add('selectUserProfile');
              }


              /*
                EasySelect Tool (TWO COLUMN - MULTI ROW GRID)
              */
              var tiles = $('#sessionModalHomeContent .easySelectTool_Session');
              var tileSelected = undefined; //Check for active selection
              var i = 0;
              var currentIndex = 0;
              var lastIndex = 0;

              $.each(tiles, function() {
                if($(tiles[i]).hasClass("selectUserProfile")){
                  tileSelected = tiles.eq(i);
                  currentIndex = i;
                }

                lastIndex = i;
                i++;
              });  

              var easySelectTool = $(document).on('keydown',  function (e) {
                 
                if($('#sessionModalHome').is(':visible')) {

                     switch(e.which){
                      case 37:{ //  < Left Arrow

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex--;
                              if(currentIndex < 0){
                                currentIndex = lastIndex;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 38:{ //  ^ Up Arrow 
                  
                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              if(currentIndex < 2){
                                if(currentIndex == 0){ //First Col. (FIRST ROW)
                                    if(lastIndex%2 == 1){ //Last Col.
                                      currentIndex = lastIndex - 1;
                                    }
                                    else if(lastIndex%2 == 0){ //First Col.
                                      currentIndex = lastIndex;
                                    }
                                }
                                else if(currentIndex == 1){ //Last Col. (FIRST ROW)
                                    if(lastIndex%2 == 1){ //Last Col.
                                      currentIndex = lastIndex;
                                    }
                                    else if(lastIndex%2 == 0){ //First Col.
                                      currentIndex = lastIndex - 1;
                                    }
                                }
                              }
                              else{
                                currentIndex = currentIndex - 2;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 39:{ // Right Arrow >

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex++;
                              if(currentIndex > lastIndex){
                                currentIndex = 0;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 40:{ // Down Arrow \/ 

                          if(tileSelected){
                              tileSelected.removeClass('selectUserProfile');

                              currentIndex = currentIndex + 2;
                              if(currentIndex > lastIndex){
                                currentIndex = currentIndex % 2;
                              }

                              if(tiles.eq(currentIndex)){
                                  tileSelected = tiles.eq(currentIndex);
                                  tileSelected = tileSelected.addClass('selectUserProfile');
                              }
                          }else{
                              tileSelected = tiles.eq(0).addClass('selectUserProfile');
                          }      

                        break;
                      }
                      case 27:{ // Escape (Close)
                        $('#sessionWindowCloseButton').click();
                        easySelectTool.unbind();
                        break;  
                      }
                      case 13:{ // Enter (Confirm)

                        $("#sessionModalHomeContent .easySelectTool_Session").each(function(){
                          if($(this).hasClass("selectUserProfile")){
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
            showToast('Not Found Error: Dine Sessions data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Dine Sessions data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Dine Sessions data.', '#e74c3c');
      }

    });


}

function selectSessionWindowClose(){
  document.getElementById("sessionModalHome").style.display = 'none';
}

function renderCurrentSessionDisplay(){
   var setSessionInfo = window.localStorage.setSessionData ? JSON.parse(window.localStorage.setSessionData): {};
  
  if(jQuery.isEmptyObject(setSessionInfo)){
    setSessionInfo.name = "";
    setSessionInfo.timeFrom = "";
    setSessionInfo.timeTo = "";
  }

  if(setSessionInfo.name != '' && setSessionInfo.timeFrom != '' && setSessionInfo.timeTo != ''){
    document.getElementById("currentSessionDisplay").innerHTML = '<b>'+setSessionInfo.name+'</b> Session';
    document.getElementById("currentSessionDisplayTime").innerHTML = getFancyTime(setSessionInfo.timeFrom) +' - '+getFancyTime(setSessionInfo.timeTo);
  }
  else{
    document.getElementById("currentSessionDisplay").innerHTML = '<span><b>Session Not Set</b></span>';
    document.getElementById("currentSessionDisplayTime").innerHTML = '<i style="text-transform: none">Choose a Session</i>';
  }
}

renderCurrentSessionDisplay();


// SPOTLIGHT SEARCH TOOL

function renderSpotlightPreview(type, encodedData){

  var renderTemplate = '';

  switch(type){
    case "Clear":{
      renderTemplate = '';

      break;
    }
    case "Tables":{
      
      var info = JSON.parse(decodeURI(encodedData));
      if(info.status == 0){
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_free.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Free Table</div><p style="font-size: 12px; color: #879094;">'+(info.capacity)+' Seater</p>';
      }
      else if(info.status == 5){
        if(info.assigned == "Hold Order"){
          renderTemplate = '<div style="height: 96px"><img src="images/common/table_saved.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #ecaa40;">Order Saved</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">'+getFormattedTime(info.lastUpdate)+' ago</p>';
        }
        else{
          renderTemplate = '<div style="height: 96px"><img src="images/common/table_reserved.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #ecaa40;">Reserved '+(info.assigned != '' ? 'For '+info.assigned : '')+'</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">'+getFormattedTime(info.lastUpdate)+' ago</p>';
        }
      }
      else if(info.status == 2){
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_occuppied.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #ef9a12;">Bill Printed</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">Updated '+getFormattedTime(info.lastUpdate)+' ago</p>'; 
      }
      else{
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_occuppied.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #e74c3c;">Running Order</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">Updated '+getFormattedTime(info.lastUpdate)+' ago</p>'; 
      }
      break;
    }
    case "Orders":{
      
      var info = JSON.parse(decodeURI(encodedData));

      if(info.orderStatus == 1){ //Active
          renderTemplate = '<div style="height: 96px"><img src="images/common/spotlight_cooking.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+(info.orderDetails.modeType == 'TOKEN' ? '<p class="spotlightOrderTag">Token #'+info.table+'</p>' : (info.orderDetails.modeType == 'DINE' ? '<p class="spotlightOrderTag">Table #'+info.table+'</p>' : ''))+'</div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Running Order</div><p class="spotlightOrderTime">Order punched '+getFormattedTime(info.timePunch)+' ago'+(info.stewardName != '' ? ' by <b>'+info.stewardName+'</b>' : '')+'</p>'; 
      }
      else if(info.orderStatus == 2){ //Bill Printed
          renderTemplate = '<div style="height: 96px"><img src="images/common/spotlight_billed.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+(info.orderDetails.modeType == 'TOKEN' ? '<p class="spotlightOrderTag">Token #'+info.table+'</p>' : (info.orderDetails.modeType == 'DINE' ? '<p class="spotlightOrderTag">Table #'+info.table+'</p>' : ''))+'</div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Billed #'+info.billNumber+'</div><p class="spotlightOrderTime">Billed at '+getFancyTime(info.timeBill)+(info.stewardName != '' ? ' by <b>'+info.stewardName+'</b>' : '')+'</p>'; 
          renderTemplate += '<div style="margin-top: 10px;"><button onclick="preSettleBill(\''+info.billNumber+'\', \'ORDER_PUNCHING\'); hideSpotlight();" class="btn btn-success">Settle Bill</button></div>';
      }
      else if(info.orderStatus == 3){ //Settled or Completed
        if(info.orderDetails.modeType == 'DINE' || info.orderDetails.modeType == 'TOKEN'){
          renderTemplate = '<div style="height: 96px; position: relative; display: inline-block;"><img src="images/common/spotlight_order_dine.png"><img style="position: absolute; bottom: 0; right: 0;" src="images/common/spotlight_check.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+'<p class="spotlightOrderTag">Bill <b>#'+info.billNumber+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> Dated '+info.date+'</p></div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Completed</div><p class="spotlightOrderTime">Bill settled at '+getFancyTime(info.timePunch)+(info.stewardName != '' ? ' by <b>'+info.stewardName+'</b>' : '')+'</p>'; 
        }
        else if(info.orderDetails.modeType == 'PARCEL'){
          renderTemplate = '<div style="height: 96px; position: relative; display: inline-block;"><img src="images/common/spotlight_order_takeaway.png" height="96px"><img style="position: absolute; bottom: 0; right: 0;" src="images/common/spotlight_check.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+'<p class="spotlightOrderTag">Bill <b>#'+info.billNumber+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> Dated '+info.date+'</p></div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Completed</div><p class="spotlightOrderTime">Order placed at '+getFancyTime(info.timePunch)+'</p>'+(info.orderDetails.reference ? '<p class="spotlightOrderTime">Ref. '+info.orderDetails.reference+' <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> '+info.customerName+' <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> '+info.customerMobile+' </p>' : '');
        }
        else if(info.orderDetails.modeType == 'DELIVERY'){
          renderTemplate = '<div style="height: 96px; position: relative; display: inline-block;"><img src="images/common/spotlight_order_delivery.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+'<p class="spotlightOrderTag">Bill <b>#'+info.billNumber+'</b> <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> Dated '+info.date+'</p></div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Completed</div><p class="spotlightOrderTime">Order placed at '+getFancyTime(info.timePunch)+'</p>'+(info.orderDetails.reference ? '<p class="spotlightOrderTime">Ref. '+info.orderDetails.reference+' <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> '+info.customerName+' <i class="fa fa-circle" style="font-size: 50%; position: relative; top: -2px; color: #7b7a7a;"></i> '+info.customerMobile+' </p>' : '');
        }

        renderTemplate += '<div style="margin-top: 10px;"><button onclick="printSettledDuplicateBill(\''+info.billNumber+'\'); hideSpotlight();" class="btn btn-default">Print Duplicate Bill</button></div>';

      }
      else{
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_occuppied.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #e74c3c;">Running Order</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">Updated '+getFormattedTime(info.lastUpdate)+' ago</p>'; 
      }
      break;
    }
    case "Menu":{
      
      var info = JSON.parse(decodeURI(encodedData));
      if(info.isAvailable){
        renderTemplate = '<div style="padding: 0 25px; height: 96px; position: relative; display: inline-block;">'+(info.isPhoto ? '<img id="spotlight_menu_item_'+info.code+'" src="images/common/download_in_progress.jpg" style="height: 96px; border-radius: 10%;"><div class="spotlightMenuItemPrice"><i class="fa fa-inr"></i>'+info.price+'</div>' : '<img src="images/common/spotlight_food.png"><div class="spotlightMenuItemPriceNoImage"><i class="fa fa-inr"></i>'+info.price+'</div>')+' </div> <div class="name" style="font-family: \'Oswald\', sans-serif;"><b style="font-size: 120%">'+info.name+'</b></div> <div id="spotlight_menu_current_item_displayed" onclick="markSpotlightMenuItemAvailability(\''+info.code+'\')" class="spotlightItemAvailable">Available</div>'; 
        if(info.isPhoto){renderItemImageFromServer(info.code);}
      }
      else{
        renderTemplate = '<div style="padding: 0 25px; height: 96px; position: relative; display: inline-block;">'+(info.isPhoto ? '<img id="spotlight_menu_item_'+info.code+'" src="images/common/download_in_progress.jpg" style="height: 96px; border-radius: 10%;"><div class="spotlightMenuItemPrice"><i class="fa fa-inr"></i>'+info.price+'</div>' : '<img src="images/common/spotlight_food.png"><div class="spotlightMenuItemPriceNoImage"><i class="fa fa-inr"></i>'+info.price+'</div>')+'</div> <div class="name" style="font-family: \'Oswald\', sans-serif;"><b style="font-size: 120%">'+info.name+'</b></div> <div id="spotlight_menu_current_item_displayed" onclick="markSpotlightMenuItemAvailability(\''+info.code+'\')" class="spotlightItemNOTAvailable">Out of Stock</div>'; 
        if(info.isPhoto){renderItemImageFromServer(info.code);}
      }

      renderTemplate += '<div style="padding: 0 25px; font-family: sans-serif; font-size: 14px; color: #83838a;">'+(info.vegFlag == 1 ? '<img src="images/common/food_veg.png" style="width: 15px; display: inline-block; margin-top: -1px;">' : '')+(info.vegFlag == 2 ? '<img src="images/common/food_nonveg.png" style="width: 15px; display: inline-block; margin-top: -1px;">' : '')+(info.ingredients && info.ingredients != [] ? ' Contains <b>'+((info.ingredients.toString()).replace(/,/g , ", "))+'</b>' : '')+'</div>';

      break;
    }
    case "Customers":{
      
      var info = JSON.parse(decodeURI(encodedData));
      var shortSummary = '';
      if((!info.visits || info.visits == 0) && (!info.orders || info.orders == 0)){
        shortSummary = '';
      }
      else if((info.visits || info.visits != 0) && (!info.orders || info.orders == 0)){
        shortSummary = 'Visited '+(info.visits ? info.visits : 'a few')+' times, no online orders yet.';
      }
      else if((!info.visits || info.visits == 0) && (info.orders || info.orders != 0)){
        shortSummary = 'Ordered '+(info.orders ? info.orders : 'a few')+' times, never visited.';
      }
      else if((info.visits || info.visits != 0) && (info.orders || info.orders != 0)){
        shortSummary = 'Visited '+(info.visits ? info.visits : 'a few')+' times and '+(info.orders ? info.orders : 'a few')+' online orders';
      }

      renderTemplate = '<div style="height: 96px;"><img src="images/common/spotlight_contact.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;"><b style="font-size: 120%">'+info.name+'</b></div> <div style="font-family: sans-serif; font-size: 18px; color: #e74c3c;"><i class="fa fa-phone"></i> '+info.mobile+'</div>'+(shortSummary != '' ? '<p style="font-size: 12px; color: #565656; display: inline-block; margin: 0; border: 1px solid #87878a; padding: 2px 8px; border-radius: 3px; min-width: 75%;">'+shortSummary+'</p>' : '')+(info.last != '' ? '<p style="font-size: 10px; padding: 0 10%; text-align: center; color: #87878a; margin: 4px;">Last visited on <b>'+info.last+'</b></p>' : ''); 
      
      break;
    }
  }

  document.getElementById("spotlightPreview").innerHTML = renderTemplate;
}

function hideSpotlight(){
  document.getElementById("spotlightSearchTool").style.display = "none";
}

function renderItemImageFromServer(itemCode){

        itemCode = parseInt(itemCode);

        $.ajax({
            type: 'GET',
            url: COMMON_LOCAL_SERVER_IP+'/accelerate_menu_images/'+itemCode,
            timeout: 10000,
            success: function(serverData) {
              if(serverData.data != ''){
                $('#spotlight_menu_item_'+itemCode).attr("src", serverData.data);
              }
              else{
                $('#spotlight_menu_item_'+itemCode).attr("src", 'images/common/download_failed.jpg');
              }
            },
            error: function(data){
              $('#spotlight_menu_item_'+itemCode).attr("src", 'images/common/download_failed.jpg');
            }
        });    
}

function showSpotlight(){

        var cancelSpotlightTool = $(document).on('keydown',  function (e) {
          if($('#spotlightSearchTool').is(':visible')) {
              if(e.which == 27){
                hideSpotlight();
                cancelSpotlightTool.unbind();
              }      
          }
        });

        document.getElementById("spotlightSearchTool").style.display = "block";
        document.getElementById("spotlightRenderPanel").style.display = "none";
        
        $("#spotlightSearchKey").focus();

        //Initialise
        $('#spotlightSearchKey').val(''); //initialise
        renderSpotlightPreview('Clear'); /*TWEAK*/
        $('#spotlightResultsRenderArea').html('');

        var spotlightData;

        /*Select on Arrow Up/Down */
        var li = $('#spotlightResultsRenderArea li');
        var liSelected = undefined;

        var autoSearchEnabled = false;
        var isMenuAndTablesLoaded = false;



        $('#spotlightSearchKey').keyup(function(e) {

            /*
              1@. Search for Tables
              2*. If the input contains '#' in the beginning => Search for Orders
              3*. If the input contains '@' in the beginning => Search for Customers
              4@. Any Text input, search in the Menu

              *Note: Pause auto-search and wait for the Enter Key to be pressed to search.
              @Note: Poll Only Once. Dont continuesly request server. Load whole menu/tables at once then filter.
            */

            var searchKey = $(this).val();
            var spotlightType = '';

            if(searchKey.startsWith("@")){ //Phone Number search
              autoSearchEnabled = true;
              spotlightType = 'CUSTOMER';
            }
            else if(searchKey.startsWith("#")){ //Order Number search
              autoSearchEnabled = true;
              spotlightType = 'ORDER';
            }
            else{ //Tables or any item in the Menu
              autoSearchEnabled = false;
              spotlightType = '';
            }

            renderSpotlightPreview('Clear'); /*TWEAK*/


            if(searchKey.length == 0 || !searchKey.replace(/\s/g, '').length){
              document.getElementById("noResultSpotlight").style.display = 'none'; 
              document.getElementById("spotlightRenderPanel").style.display = 'none';
              return '';
            }

            if (e.which === 40 || e.which === 38) {
                /*
                  Skip Search if the Up-Arrow or Down-Arrow
                  is pressed inside the Search Input
                */ 
            
              if(searchKey == ''){
                isMenuAndTablesLoaded = false;
                renderSpotlightPreview('Clear');
                return '';
              }


              if(e.which === 40){ 
                  if(liSelected){
                      liSelected.removeClass('active');
                      next = liSelected.next();
                      if(next.length > 0){
                          liSelected = next.addClass('active');
                          renderSpotlightPreview(liSelected.attr("spot-preview-type"), liSelected.attr("spot-preview-data"));

                      }else{
                          liSelected = li.eq(0).addClass('active');
                          renderSpotlightPreview(liSelected.attr("spot-preview-type"), liSelected.attr("spot-preview-data"));
                      }
                  }else{
                      liSelected = li.eq(0).addClass('active');
                      renderSpotlightPreview(liSelected.attr("spot-preview-type"), liSelected.attr("spot-preview-data"));
                  }
              }else if(e.which === 38){

                  $('#spotlightSearchKey').focus().val($('#spotlightSearchKey').val()); //TWEAK!

                  if(liSelected){
                      liSelected.removeClass('active');
                      next = liSelected.prev();
                      if(next.length > 0){
                          liSelected = next.addClass('active');
                          renderSpotlightPreview(liSelected.attr("spot-preview-type"), liSelected.attr("spot-preview-data"));
                      }else{
                          liSelected = li.last().addClass('active');
                          renderSpotlightPreview(liSelected.attr("spot-preview-type"), liSelected.attr("spot-preview-data"));
                      }
                  }else{
                      liSelected = li.last().addClass('active');
                      renderSpotlightPreview(liSelected.attr("spot-preview-type"), liSelected.attr("spot-preview-data"));
                  }
              }


            }
            else if (e.which === 13) {
                /*
                  If the Enter Key is pressed inside the Search Input
                */ 

                if($(this).val() == ''){
                  renderSpotlightPreview('Clear');
                  return '';
                }

                $("#spotlightResultsRenderArea li").each(function(){
                  if($(this).hasClass("active")){
                    $(this).click();
                    hideSpotlight();
                  }
                });

            }
            else{

              if(!searchKey || searchKey == ''){
                isMenuAndTablesLoaded = false;
                $('#spotlightResultsRenderArea').html('')
                return '';
              }

              if(autoSearchEnabled){
                $('#spotlightResultsRenderArea').html('');
              }

              //PULL DATA
              switch(spotlightType){

                case "ORDER":{

                    var orderNumber = searchKey.substring(1); //to remove '@' in the beginning

                    //Search for KOTs

                    //Set _id from Branch mentioned in Licence
                    var accelerate_licencee_branch = window.localStorage.accelerate_licence_branch ? window.localStorage.accelerate_licence_branch : ''; 
                    if(!accelerate_licencee_branch || accelerate_licencee_branch == ''){
                      showToast('Invalid Licence Error: KOT can not be fetched. Please contact Accelerate Support if problem persists.', '#e74c3c');
                      return '';
                    }

                    searchOrderForBills();

                    function searchOrderForBills(){

                          //Search for BILLS
                          var bill_request_data = accelerate_licencee_branch +"_BILL_"+ orderNumber;

                          $.ajax({
                            type: 'GET',
                            url: COMMON_LOCAL_SERVER_IP+'/accelerate_bills/'+bill_request_data,
                            timeout: 10000,
                            success: function(data) {
                              if(data._id == bill_request_data){

                                var bill = data;
                                bill.orderStatus = 2;
                                var billList = [];
                                billList.push(bill);

                                spotlightData = [{ "category": "Orders", "list": billList}];

                                liSelected = undefined

                                var renderContent = '<ul class="ng-spotlight-results-category">';
                                var count = 0;
                                var tabIndex = 1;
                                var itemsList = '';

                                $.each(spotlightData, function(key_1, spotResult) {

                                  itemsList = '';
                                  count = 0;

                                  switch(spotResult.category){
                                    case "Orders":{
                                        $.each(spotResult.list, function(key_2, spotItem) {

                                                tabIndex = -1;

                                                var tempData = encodeURI(JSON.stringify(spotItem));
                                                itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Orders" spot-preview-data="'+tempData+'" onclick="openPastOrder(\''+tempData+'\', \'PENDING\')"><name style="display: inline-block; width: 50%">#'+(spotItem.billNumber != '' ? spotItem.billNumber : '')+'<date style="font-size: 80%; color: #737475; padding-left: 5px">'+spotItem.date+'</date></name><tag style="float: right; padding: 1px 3px 0 0; font-size: 85%;"> '+spotItem.customerName+'</tag></li>';
                                                
                                                count++;
                                                tabIndex++;
                                          
                                        });
                                        break;
                                    }
                                  }


                                  if(count > 0){
                                    renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                                    document.getElementById("noResultSpotlight").style.display = 'none'; 
                                    document.getElementById("spotlightRenderPanel").style.display = 'block';
                                  }
                                  else{
                                    document.getElementById("noResultSpotlight").style.display = 'block'; 
                                    document.getElementById("spotlightRenderPanel").style.display = 'none';
                                  }

                                });

                                renderContent += '</ul>';

                                $('#spotlightResultsRenderArea').html(renderContent);

                                //Refresh dropdown list
                                li = $('#spotlightResultsRenderArea li');

                              }
                              else{
                                searchOrderForInvoices();
                              }
                            },
                            error: function(data) {
                              searchOrderForInvoices();
                            }
                            });
                    }

                    function searchOrderForInvoices(){

                                //Search for INVOICE
                                var invoice_request_data = accelerate_licencee_branch +"_INVOICE_"+ orderNumber;

                                $.ajax({
                                  type: 'GET',
                                  url: COMMON_LOCAL_SERVER_IP+'/accelerate_invoices/'+invoice_request_data,
                                  timeout: 10000,
                                  success: function(data) {
                                    if(data._id == invoice_request_data){

                                      var bill = data;
                                      bill.orderStatus = 3;
                                      var billList = [];
                                      billList.push(bill);

                                      spotlightData = [{ "category": "Orders", "list": billList}];

                                      liSelected = undefined

                                      var renderContent = '<ul class="ng-spotlight-results-category">';
                                      var count = 0;
                                      var tabIndex = 1;
                                      var itemsList = '';

                                      $.each(spotlightData, function(key_1, spotResult) {

                                        itemsList = '';
                                        count = 0;

                                        switch(spotResult.category){
                                          case "Orders":{
                                              $.each(spotResult.list, function(key_2, spotItem) {

                                                      tabIndex = -1;

                                                      var tempData = encodeURI(JSON.stringify(spotItem));
                                                      itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Orders" spot-preview-data="'+tempData+'" onclick="openPastOrder(\''+tempData+'\', \'SETTLED\')"><name style="display: inline-block; width: 50%">#'+(spotItem.billNumber != '' ? spotItem.billNumber : '')+'<date style="font-size: 80%; color: #737475; padding-left: 5px">'+spotItem.date+'</date></name><tag style="float: right; padding: 1px 3px 0 0; font-size: 85%;"> '+spotItem.customerName+'</tag></li>';
                                                      
                                                      count++;
                                                      tabIndex++;
                                                
                                              });
                                              break;
                                          }
                                        }


                                        if(count > 0){
                                          renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                                          document.getElementById("noResultSpotlight").style.display = 'none'; 
                                          document.getElementById("spotlightRenderPanel").style.display = 'block';
                                        }
                                        else{
                                          document.getElementById("noResultSpotlight").style.display = 'block'; 
                                          document.getElementById("spotlightRenderPanel").style.display = 'none';
                                        }

                                      });

                                      renderContent += '</ul>';

                                      $('#spotlightResultsRenderArea').html(renderContent);

                                      //Refresh dropdown list
                                      li = $('#spotlightResultsRenderArea li');

                                    }
                                    else{
                                      spotlightData = [];
                                      document.getElementById("noResultSpotlight").style.display = 'block'; 
                                      document.getElementById("spotlightRenderPanel").style.display = 'none';
                                    }
                                  },
                                  error: function(data) {
                                      spotlightData = [];
                                      document.getElementById("noResultSpotlight").style.display = 'block'; 
                                      document.getElementById("spotlightRenderPanel").style.display = 'none';
                                  }
                                });  
                    }

                  
                    break;
                }
                case "CUSTOMER":{

                    var mobileNumber = searchKey.substring(1); //to remove '@' in the beginning


                    $.ajax({
                      type: 'GET',
                      url: COMMON_LOCAL_SERVER_IP+'/accelerate_users/'+mobileNumber,
                      timeout: 10000,
                      success: function(data) {
                        if(data._id == mobileNumber){ //USER FOUND!!!

                          spotlightData = [{ 
                                  "category": "Customers", 
                                  "list": [{ 
                                    "name": data.name, 
                                    "mobile": data.mobile, 
                                    "last": "", 
                                    "visits": 0, 
                                    "orders": 0 
                                  }]
                                }];
                        
                          liSelected = undefined

                          var renderContent = '<ul class="ng-spotlight-results-category">';
                          var count = 0;
                          var tabIndex = 1;
                          var itemsList = '';

                          $.each(spotlightData, function(key_1, spotResult) {

                            itemsList = '';
                            count = 0;

                            switch(spotResult.category){
                              case "Customers":{
                                  $.each(spotResult.list, function(key_2, spotItem) {

                                          tabIndex = -1;

                                          var tempData = encodeURI(JSON.stringify(spotItem));
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Customers" spot-preview-data="'+tempData+'" onclick="freshOrderForCustomer(\''+tempData+'\')"><i class="fa fa-user" style="float: left; display: table-cell; width: 8%; padding: 2px 0 0 0;"></i> <name style="display: inline-block; width: 50%">'+spotItem.name+'</name><tag style="float: right; padding: 1px 3px 0 0; font-size: 85%;"> <i class="fa fa-phone" style="font-size: 85% !important; padding-right: 0.2em"></i>'+spotItem.mobile+'</tag></li>';
                                          
                                          count++;
                                          tabIndex++;
                                    
                                  });
                                  break;
                              }
                            }


                            if(count > 0){
                              renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                              document.getElementById("noResultSpotlight").style.display = 'none'; 
                              document.getElementById("spotlightRenderPanel").style.display = 'block';
                            }
                            else{
                              document.getElementById("noResultSpotlight").style.display = 'block'; 
                              document.getElementById("spotlightRenderPanel").style.display = 'none';
                            }

                          });

                          renderContent += '</ul>';

                          $('#spotlightResultsRenderArea').html(renderContent);

                          //Refresh dropdown list
                          li = $('#spotlightResultsRenderArea li');

                        }
                        else{ //USER NOT FOUND
                          spotlightData = [];
                          document.getElementById("noResultSpotlight").style.display = 'block'; 
                          document.getElementById("spotlightRenderPanel").style.display = 'none';
                        }

                      }
                    });  

                  break;
                }
                default:{

                  
                  /* Search Tables and then Menu */
                  //Load only once - static data.

                  if(!isMenuAndTablesLoaded){

                    var mobileNumber = searchKey;

                    preloadTablesData();

                    //Preload TABLES data
                    function preloadTablesData(){
                      $.ajax({
                        type: 'GET',
                        url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/all/',
                        timeout: 10000,
                        success: function(data) {
                          if(data.total_rows > 0){

                              var tableData = data.rows;
                              tableData.sort(function(obj1, obj2) {
                                return obj1.key - obj2.key; //Key is equivalent to sortIndex
                              });

                              //Process data to required format
                              var tableMapping = [];
                              for(var q = 0; q < tableData.length; q++){
                                tableMapping.push(tableData[q].value);
                              }

                              preloadMenuData(tableMapping);

                          }
                          else{
                            preloadMenuData([]);
                          }
                        },
                        error: function(data) {
                          preloadMenuData([]);
                        }
                      });
                    
                    //End - Tables data
                    }


                    function preloadMenuData(tableMapping){

                              //Preload MENU data
                              var requestMenuData = {
                                "selector"  :{ 
                                              "identifierTag": "ACCELERATE_MASTER_MENU" 
                                            },
                                "fields"    : ["_rev", "identifierTag", "value"]
                              }

                              $.ajax({
                                type: 'POST',
                                url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
                                data: JSON.stringify(requestMenuData),
                                contentType: "application/json",
                                dataType: 'json',
                                timeout: 10000,
                                success: function(menudata) {
                                  if(menudata.docs.length > 0){
                                    if(menudata.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

                                        var mastermenu = menudata.docs[0].value; 
                                        var menuitems = [];
                                        var menu_index = 0;
                                        var n = 0;
                                        while(mastermenu[n]){

                                          for(var i = 0; i < mastermenu[n].items.length; i++){
                                            menuitems[menu_index] = mastermenu[n].items[i];
                                            menuitems[menu_index].category = mastermenu[n].category;
                                            menu_index++;
                                          }

                                          n++;
                                        }  

                                        populateSpotlightData(tableMapping, menuitems); 

                                    }
                                  }
                                },
                                error: function(data){
                                  populateSpotlightData(tableMapping, []);
                                }

                              }); 
                              //End - Menu data

                    }

                    function populateSpotlightData(tableMapping, menuitems){

                                        isMenuAndTablesLoaded = true;

                                        spotlightData = [{
                                                            "category": "Tables",
                                                            "list": tableMapping
                                                          },
                                                          {
                                                            "category": "Menu",
                                                            "list": menuitems
                                                          }];

                                        liSelected = undefined

                                        var renderContent = '<ul class="ng-spotlight-results-category">';
                                        var count = 0;
                                        var tabIndex = 1;
                                        var itemsList = '';

                                        var regex = new RegExp(searchKey, "i"); //NB: Not for Order or Customer Search

                                        var general_query_atleast_one_result = false;

                                        $.each(spotlightData, function(key_1, spotResult) {

                                          itemsList = '';
                                          count = 0;

                                          switch(spotResult.category){
                                            case "Tables":{
                                                $.each(spotResult.list, function(key_2, spotItem) {

                                                  if ((spotItem.table.search(regex) != -1)) {
                                                        tabIndex = -1;

                                                        var tempData = encodeURI(JSON.stringify(spotItem));

                                                        if(spotItem.status == 0){
                                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #2ecc71"></i> Table #'+(spotItem.table)+'</li>';
                                                        }
                                                        else if(spotItem.status == 1){
                                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #e74c3c"></i> Table #'+(spotItem.table)+'</li>';
                                                        }
                                                        else if(spotItem.status == 2){
                                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #ef9912"></i> Table #'+(spotItem.table)+'</li>';
                                                        }
                                                        else if(spotItem.status == 5){
                                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\'))> <i class="fa fa-circle" style="color: #ecaa40"></i> Table #'+(spotItem.table)+'</li>';
                                                        }
                                                        
                                                        count++;
                                                        tabIndex++;

                                                        general_query_atleast_one_result = true;
                                                  }
                                                });
                                                break;
                                            }
                                            case "Menu":{
                                                $.each(spotResult.list, function(key_2, spotItem) {

                                                  if ((spotItem.name.search(regex) != -1)) {
                                                        tabIndex = -1;  

                                                        var tempData = encodeURI(JSON.stringify(spotItem));

                                                        if(spotItem.isAvailable){ //Item Available
                                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="spotlightTriggerMenuItem(\''+tempData+'\')"> <i class="fa fa-check" style="color: #2ecc71; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                                        }
                                                        else{
                                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="spotlightTriggerMenuItem(\''+tempData+'\')"> <i class="fa fa-times" style="color: #e74c3c; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                                        } //Not available

                                                        count++;
                                                        tabIndex++;

                                                        general_query_atleast_one_result = true;
                                                  }
                                                });
                                                break;
                                            }
                                          }

                                          if(count > 0){
                                            renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                                          }

                                          if(general_query_atleast_one_result){
                                            document.getElementById("noResultSpotlight").style.display = 'none'; 
                                            document.getElementById("spotlightRenderPanel").style.display = 'block';
                                          }
                                          else{
                                            document.getElementById("noResultSpotlight").style.display = 'block'; 
                                            document.getElementById("spotlightRenderPanel").style.display = 'none';
                                          }

                                        });

                                        renderContent += '</ul>';

                                        $('#spotlightResultsRenderArea').html(renderContent);

                                        //Refresh dropdown list
                                        li = $('#spotlightResultsRenderArea li');                                      

                    }
                  
                  }//!isMenuAndTablesLoaded
                  else{

                        liSelected = undefined

                        var renderContent = '<ul class="ng-spotlight-results-category">';
                        var count = 0;
                        var tabIndex = 1;
                        var itemsList = '';

                        var general_query_atleast_one_result = false;

                        var regex = new RegExp(searchKey, "i"); //NB: Not for Order or Customer Search

                        $.each(spotlightData, function(key_1, spotResult) {

                          itemsList = '';
                          count = 0;

                          switch(spotResult.category){
                            case "Tables":{
                                $.each(spotResult.list, function(key_2, spotItem) {

                                  if ((spotItem.table.search(regex) != -1)) {
                                        tabIndex = -1;

                                        var tempData = encodeURI(JSON.stringify(spotItem));

                                        if(spotItem.status == 0){
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #2ecc71"></i> Table #'+(spotItem.table)+'</li>';
                                        }
                                        else if(spotItem.status == 1){
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #e74c3c"></i> Table #'+(spotItem.table)+'</li>';
                                        }
                                        else if(spotItem.status == 2){
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #ef9912"></i> Table #'+(spotItem.table)+'</li>';
                                        }
                                        else if(spotItem.status == 5){
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="spotlightTriggerTable(\''+tempData+'\')"> <i class="fa fa-circle" style="color: #ecaa40"></i> Table #'+(spotItem.table)+'</li>';
                                        }

                                        
                                        count++;
                                        tabIndex++;

                                        general_query_atleast_one_result = true;
                                  }
                                });
                                break;
                            }
                            case "Menu":{
                                $.each(spotResult.list, function(key_2, spotItem) {
                                  
                                  if ((spotItem.name.search(regex) != -1)) {
                                        tabIndex = -1;

                                        var tempData = encodeURI(JSON.stringify(spotItem));

                                        if(spotItem.isAvailable){ //Item Available
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="spotlightTriggerMenuItem(\''+tempData+'\')"> <i class="fa fa-check" style="color: #2ecc71; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                        }
                                        else{
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="spotlightTriggerMenuItem(\''+tempData+'\')"> <i class="fa fa-times" style="color: #e74c3c; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                        } //Not available

                                        count++;
                                        tabIndex++;

                                        general_query_atleast_one_result = true;

                                  }
                                });
                                break;
                            }
                          }


                          if(count > 0){
                            renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                          }

                          if(general_query_atleast_one_result){
                            document.getElementById("noResultSpotlight").style.display = 'none'; 
                            document.getElementById("spotlightRenderPanel").style.display = 'block';
                          }
                          else{
                            document.getElementById("noResultSpotlight").style.display = 'block'; 
                            document.getElementById("spotlightRenderPanel").style.display = 'none';
                          }

                        });

                        renderContent += '</ul>';

                        $('#spotlightResultsRenderArea').html(renderContent);

                        //Refresh dropdown list
                        li = $('#spotlightResultsRenderArea li');                    
                  }

                  break;
                }
              }   
              
          }

        });
}


/* Options for Spotlight Menu item click */
function spotlightTriggerMenuItem(tempData){

  if(currentRunningPage == 'new-order'){
    if($('#spotlightSearchTool').is(':visible')) {
      additemtocart(tempData, 'ATTACHED_WITHIN');
    }
  }
  else if(currentRunningPage == 'manage-menu'){
    
    var spotlight_item = JSON.parse(decodeURI(tempData));

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MASTER_MENU" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

              var mastermenu = data.docs[0].value;
        
              for (var i=0; i<mastermenu.length; i++){
                for(var j=0; j<mastermenu[i].items.length; j++){

                  if(mastermenu[i].items[j].code == spotlight_item.code){
                    openSubMenu(mastermenu[i].category, mastermenu[i].items[j].code);
                    break;
                  }
              
                }         
              }

          }
        }
      }
    }); 


  } 
}

/* Options for Spotlight Table click */
function spotlightTriggerTable(encodedData){
  
  var tableData = JSON.parse(decodeURI(encodedData));

  if(currentRunningPage == 'new-order'){

    if(tableData.status == 0){
      retrieveTableInfo(tableData.table, 'FREE');
    }
    else if(tableData.status == 1){
      retrieveTableInfo(tableData.table, 'MAPPED');
    }
    else if(tableData.status == 2){
      preSettleBill(tableData.KOT, 'ORDER_PUNCHING');
    }
    else if(tableData.status == 5){
      retrieveTableInfo(tableData.table, 'FREE', (tableData.assigned != "" && tableData.assigned != "Hold Order" ? tableData.assigned : ''), (tableData.assigned != "" && tableData.assigned == "Hold Order" ? 1 : 0));
    }

  }
  else if(currentRunningPage == 'live-orders'){

    if(tableData.status == 1){
      liveOrderOptions(tableData.KOT);
    }
    else{
      showToast('No active order found on this Table', '#27ae60');
    }

  }
  else if(currentRunningPage == 'seating-status'){

    if(tableData.status == 0){
      openFreeSeatOptions(tableData.table);
    }
    else if(tableData.status == 1 || tableData.status == 2){
      openOccuppiedSeatOptions(encodedData);
    }
    else if(tableData.status == 5){
      openReservedSeatOptions(tableData.table, tableData.assigned, (tableData.assigned != "" && tableData.assigned == "Hold Order" ? 1 : 0));
    }

  }

}


/* 
  ** EASY COPY TOOL **

  Wrap around the Text to be Copied as follows:
  
  <tag class="easyCopyToolParent">
    <tag class="easyCopyToolText">TEXT_TO_BE_COPIED</tag>
    <tag class="easyCopyToolButton" onclick="easyCopyToClipboard(this)"><i class="fa fa-files-o"></i></tag>
  </tag>

*/

function easyCopyToClipboard(element) {

    var toolElement = $(element).parent();
    var textElement = toolElement.find(".easyCopyToolText");

    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(textElement.html()).select();
    document.execCommand("copy");
    $temp.remove();

    //UI Changes
    $(element).addClass('easyCopyToolEffect');
    setTimeout(function(){
      $(element).removeClass('easyCopyToolEffect');
    }, 1000);
}




// ADMIN USER SETTINGS
function enableAdminUser(profileUser){

  if(profileUser.name != '' && profileUser.code != ''){
    document.getElementById("adminUserModalHomeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                    '<header>'+
                                      '<span class="avatarTransparent"><img src="images/common/passcode_lock.png" id="adminUserLockIcon"></span>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Login as <b>'+profileUser.name+'</b></h1>'+
                                      '<hr style="margin-bottom: 15px; margin-top: 5px;">'+
                                      '<p style="font-size: 12px; letter-spacing: 4px; color: #959595;">ENTER PASSCODE</p>'+
                                    '</header>'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<div class="col-sm-3"> <div class="form-group"> <input placeholder="-" onfocus="this.select()" onkeyup="jumpToNextPasscode(event, this, \'2\')" maxlength="1" type="password" id="adminUserPasscode_1" value="" class="form-control adminUserPasscodeInput"> </div> </div>'+    
                                        '<div class="col-sm-3"> <div class="form-group"> <input placeholder="-" onfocus="this.select()" onkeyup="jumpToNextPasscode(event, this, \'3\')" maxlength="1" type="password" id="adminUserPasscode_2" value="" class="form-control adminUserPasscodeInput"> </div> </div>'+    
                                        '<div class="col-sm-3"> <div class="form-group"> <input placeholder="-" onfocus="this.select()" onkeyup="jumpToNextPasscode(event, this, \'4\')" maxlength="1" type="password" id="adminUserPasscode_3" value="" class="form-control adminUserPasscodeInput"> </div> </div>'+    
                                        '<div class="col-sm-3"> <div class="form-group"> <input placeholder="-" onfocus="this.select()" onkeyup="processPasscodeAndLogin(event, this, \''+profileUser.code+'\')" maxlength="1" type="password" id="adminUserPasscode_4" value="" class="form-control adminUserPasscodeInput"> </div> </div>'+                     
                                    '</div>'+
                                '</section>';

    document.getElementById("adminUserModalHome").style.display = 'block';
    $("#adminUserPasscode_1").focus();
    $("#adminUserPasscode_1").select(); 
  }
  else{
    showToast('Error: Unknown User.', '#e74c3c');
  } 
}

function jumpToNextPasscode(event, element, next_id){

  if($('#adminUserPasscode_1').hasClass('redInputError')){
    clearErrorOnInput();
  }
  
  if(event.which == 8){ //Backspace

    if($(element).val() == ''){

      var prev_id = next_id - 2;
      if(prev_id < 1){
        prev_id = 1;
      }

      $('#adminUserPasscode_'+prev_id).focus();
      $('#adminUserPasscode_'+prev_id).select();
    }

    return '';

  }
  
  if($(element).val() != ''){
    $('#adminUserPasscode_'+next_id).focus();
    $('#adminUserPasscode_'+next_id).select();
  }  
}

function processPasscodeAndLogin(event, element, userCode){

  if(userCode == ''){
    showToast('Warning: User not found', '#e67e22');
    return '';
  }

  if($('#adminUserPasscode_1').hasClass('redInputError')){
    clearErrorOnInput();
  }

  if(event.which == 8){ //Backspace

    if($(element).val() == ''){
      $('#adminUserPasscode_3').focus();
      $('#adminUserPasscode_3').select();
    }

    return '';
  }

  validateAndLoginAdminUser(userCode);

}


function validateAndLoginAdminUser(userCode){
  
  //Validate
  var n = 1;
  var enteredPasscode = '';
  while(n <= 4){
    if($('#adminUserPasscode_'+n).val() == ''){
      $('#adminUserPasscode_'+n).focus();
      $('#adminUserPasscode_'+n).select(); 
      return '';  
    }
    else{
      enteredPasscode = enteredPasscode + $('#adminUserPasscode_'+n).val();
    }
    n++;
  }

    enteredPasscode = parseInt(enteredPasscode);

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_STAFF_PROFILES" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_STAFF_PROFILES'){

              var users = data.docs[0].value; 

              if(users.length == 0){
                showToast('Warning: No User registered yet.', '#e67e22');
                return '';
              }

              var n = 0;
              while(users[n]){
                if(userCode == users[n].code){

                  if(enteredPasscode == users[n].password){
                    proceedToSetAdminUser(users[n]);
                    enableAdminUserHideWindow();
                  }
                  else{
                    //Failed Case
                    $('#adminUserLockIcon').addClass('bounceIn');
                    $('#adminUserPasscode_1').addClass('redInputError');
                    $('#adminUserPasscode_2').addClass('redInputError');
                    $('#adminUserPasscode_3').addClass('redInputError');
                    $('#adminUserPasscode_4').addClass('redInputError');
                    setTimeout(function(){
                      $('#adminUserLockIcon').removeClass('bounceIn');
                    }, 1000);  

                    playNotificationSound('DISABLE');
                  }

                  break;
                }
                n++;
              }
          }
          else{
            showToast('Not Found Error: Registered Users data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Registered Users data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Registered Users data.', '#e74c3c');
      }

    });  
}

function proceedToSetAdminUser(userProfile){

   var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
    }

    loggedInStaffInfo.name = userProfile.name;
    loggedInStaffInfo.code = userProfile.code;
    loggedInStaffInfo.role = userProfile.role;

    window.localStorage.loggedInStaffData = JSON.stringify(loggedInStaffInfo);
    
    // What to do after setting Profile?
    renderCurrentUserDisplay();
    renderSideNavigation();

    if(currentRunningPage != ''){
      renderPage(currentRunningPage);
    }
    else{ //render default page
      renderPage('new-order', 'Punch Order');
    }
    
    selectStewardWindowClose();
    recheckCloudConnectionStatus();

    $("#customer_form_data_mobile").focus();
}


function clearErrorOnInput(){
  $('#adminUserPasscode_1').removeClass('redInputError');
  $('#adminUserPasscode_2').removeClass('redInputError');
  $('#adminUserPasscode_3').removeClass('redInputError');
  $('#adminUserPasscode_4').removeClass('redInputError');
}

function enableAdminUserHideWindow(){
  document.getElementById("adminUserModalHome").style.display = 'none';
}




/*
  Spotlight Render Preview Options:
*/

//MENU

//To mark item availability and un-availability
function markSpotlightMenuItemAvailability(code, type){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_MASTER_MENU" 
                  },
      "fields"    : ["_rev", "identifierTag", "value"]
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
          if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

              var mastermenu = data.docs[0].value;
              mastermenu.sort(); //alphabetical sorting 

              var remember_name = '';
              var remember_avail = 0;

              var isItemFound = false;

        
              for (var i=0; i<mastermenu.length && !isItemFound; i++){
                for(var j=0; j<mastermenu[i].items.length && !isItemFound; j++){

                  if(mastermenu[i].items[j].code == code){

                    isItemFound = true;

                    mastermenu[i].items[j].isAvailable = !mastermenu[i].items[j].isAvailable;

                    remember_name = mastermenu[i].items[j].name;
                    remember_avail = mastermenu[i].items[j].isAvailable ? 1 : 0;

                    if(document.getElementById("spotlight_menu_current_item_displayed").innerHTML != 'Available'){
                      document.getElementById("spotlight_menu_current_item_displayed").innerHTML = 'Available';
                      $('#spotlight_menu_current_item_displayed').removeClass('spotlightItemNOTAvailable');
                      $('#spotlight_menu_current_item_displayed').addClass('spotlightItemAvailable');
                    }
                    else{
                      document.getElementById("spotlight_menu_current_item_displayed").innerHTML = 'Out of Stock';
                      $('#spotlight_menu_current_item_displayed').removeClass('spotlightItemAvailable');
                      $('#spotlight_menu_current_item_displayed').addClass('spotlightItemNOTAvailable');
                    }

                            //Update
                            var updateData = {
                              "_rev": data.docs[0]._rev,
                              "identifierTag": "ACCELERATE_MASTER_MENU",
                              "value": mastermenu
                            }

                            $.ajax({
                              type: 'PUT',
                              url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_MASTER_MENU/',
                              data: JSON.stringify(updateData),
                              contentType: "application/json",
                              dataType: 'json',
                              timeout: 10000,
                              success: function(data) {
                                hideSpotlight();
                                showToast('Availability'+(remember_name != '' ? ' of <b>'+remember_name+'</b> ' : ' ')+'has been updated', '#48929B');
                                initMenuSuggestion();
                                
                                //Update online menu (if feature is enabled)
                                var online_flag = 0;
                                online_flag = window.localStorage.appOtherPreferences_syncOnlineMenu ? window.localStorage.appOtherPreferences_syncOnlineMenu : 0;

                                if(online_flag == 1){
                                    sendConfirmationResponseToCloud(code, remember_avail);
                                }
                                
                                return '';
                              },
                              error: function(data) {
                                showToast('System Error: Unable to update Menu data.', '#e74c3c');
                              }

                            });    

                            break;
                  }
              
                }         
              }

          }
          else{
            showToast('Not Found Error: Menu data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Menu data not found.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Menu data.', '#e74c3c');
      }

    }); 


      //Send update to Cloud Server
      function sendConfirmationResponseToCloud(id, status){

          var data = {
            "token": window.localStorage.loggedInAdmin,
            "code": id,
            "status": status
          }

          showLoading(10000, 'Updating Online Menu');

          $.ajax({
            type: 'POST',
            url: 'https://www.accelerateengine.app/apis/itemstatus.php',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            timeout: 10000,
            success: function(data) {

              hideLoading();

              if(data.status){

              }
              else{
                showToast('Cloud Server Warning: Online Menu not updated', '#e67e22');
              }
            },
            error: function(data){
              hideLoading();
              showToast('Failed to reach Cloud Server. Please check your connection.', '#e74c3c');
              return '';
            }
          });       
      }

}



function openPastOrder(encodedData, type){
  var billData = JSON.parse(decodeURI(encodedData));
  
  if(type == 'PENDING'){
    renderPage('settled-bills', 'Generated Bills');
    loadAllPendingSettlementBills('EXTERNAL', 'LOADING_ANIMATION');
    openSelectedBill(encodedData, 'PENDING');
  }
  else if(type == 'SETTLED'){
    renderPage('settled-bills', 'Generated Bills');
    loadAllSettledBills('LOADING_ANIMATION');
    openSelectedBill(encodedData, 'SETTLED');
  }

}




/* Apply KOT Relays */
function applyKOTRelays(){
  
    //Read from Server, apply changes, and save to LocalStorage
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

              var settingsList = data.docs[0].value;

              var machineName = window.localStorage.accelerate_licence_machineUID ? window.localStorage.accelerate_licence_machineUID : '';
              if(!machineName || machineName == ''){
                machineName = 'Any';
              }

              for(var n=0; n<settingsList.length; n++){
                if(settingsList[n].systemName == machineName){
                    window.localStorage.custom_kot_relays = JSON.stringify(settingsList[n].data);
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



/* TEXT TO KITCHEN */
function openTalkToKitchen(){


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
  else{
    showToast('No Permission: Only an Admin can use <b>Text to Kitchen</b> feature.', '#e67e22');
    return '';
  }



  document.getElementById("textToKitchenWizard").style.display = "block";
  
  $('#tok_input').val('');
  $('#tok_input').focus();

  //Preload KOT Printers 
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


    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_TEXT_TO_KITCHEN_LOG" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_TEXT_TO_KITCHEN_LOG'){
            var text_log = data.docs[0].value;
            renderTextToKitchenWindow(KOTPrintersList, text_log);  
          }
          else{
            renderTextToKitchenWindow(KOTPrintersList, []);  
          }
        }
        else{
          renderTextToKitchenWindow(KOTPrintersList, []);    
        }
      },
      error: function(data) {
        renderTextToKitchenWindow(KOTPrintersList, []);  
      }
    });



        var cancelTextToKitchenWizard = $(document).on('keydown',  function (e) {
          if($('#textToKitchenWizard').is(':visible')) {
              if(e.which == 27){
                hideTalkToKitchen();
                cancelTextToKitchenWizard.unbind();
              }      
          }
        });


        $('#tok_input').keyup(function(e) {
            if (e.which === 13) {
              $('#sendMessageToKitchenButton').click();
            }
        });
}

function renderTextToKitchenWindow(printer_list, chat_log){
  
  var n = 0;
  var printerRender = '';
  while(printer_list[n]){
    printerRender += '<li class="ng-spotlight-results-list-item textToKitchenPrinter myPrinter" printer-name="'+printer_list[n].name+'" printer-code="'+printer_list[n].target+'" onclick="triggerActiveTargetPrinter(this)">'+
                        '<name class="textToKitchenName">'+
                          '<span class="tok_icon_printer"><i class="fa fa-print" style="margin-right: 10px"></i></span>'+
                          '<span class="tok_icon_check"><i class="fa fa-check" style="margin-right: 10px"></i></span>'+
                          printer_list[n].name+'</name>'+
                      '</li>';
    n++;
  }  

  if(printerRender == ''){
    printerRender = '<p style="font-size: 12px; margin: 10px; text-align: center; font-weight: 300; color: #b9b9b9; letter-spacing: 0;">Oops! There are no Printers set up.</p>';
  }

  document.getElementById("tok_allPrinterRender").innerHTML = printerRender;


  var m = 0;
  var chatRender = '';
  while(chat_log[m]){

    var printers_done = '';
    for(var k = 0; k < chat_log[m].target.length; k++){

      if(k == 0){
        printers_done = chat_log[m].target[k];
      }
      else if(k < chat_log[m].target.length - 1){
        printers_done += ', '+chat_log[m].target[k];
      }
      else if(k == chat_log[m].target.length - 1){
        printers_done += ' and '+chat_log[m].target[k];
      }
    }

    chatRender = '<div class="textToKitchenChatBox">'+
                    '<span class="currentUserImage textToKitchenIcon">'+getImageCode(chat_log[m].user)+'</span>'+
                    '<span class="textToKitchenChat"> <span class="textToKitchenChatContent">'+chat_log[m].message+'</span>'+
                    '<span class="textToKitchenChatData">Sent to <b>'+printers_done+'</b> by '+chat_log[m].user+' on '+chat_log[m].date+'</span> </span>'+
                    '<span class="textToKitchenTime">'+getFancyTime(chat_log[m].time)+'</span>'+
                  '</div>' + chatRender;
    m++;
  }

  if(chatRender == ""){
    chatRender = '<p style="margin-top: 50px; font-size: 12px; margin: 30px 0 0 0; text-align: center; font-weight: 300; color: #b9b9b9; letter-spacing: 0;">Outbox is Empty</p>';
  }

  document.getElementById("tok_allChats").innerHTML = chatRender;


}

function triggerActiveTargetPrinter(target){
  if($(target).hasClass('myPrinter')){
    $(target).removeClass('myPrinter');
  }
  else{
    $(target).addClass('myPrinter');
  }
}


function sendMessageToKitchen(){

  var chat_text = document.getElementById("tok_input").value;
  if(chat_text == "" || chat_text.trim() == ""){
    showToast('Warning: Please add some message.', '#e67e22');
    return "";
  }

  var selected_printers_names = [];
  $("#tok_allPrinterRender li").each(function(){ 
    if($(this).hasClass("myPrinter")){
      selected_printers_names.push($(this).attr("printer-name"));
    } 
  });

  if(selected_printers_names.length == 0){
    showToast('Warning: Please select atleast a Kitchen Section.', '#e67e22');
    return "";
  }

  //Get staff info.
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ?  JSON.parse(window.localStorage.loggedInStaffData) : {};
  
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = 'Default';
    loggedInStaffInfo.code = '0000000000';
  } 


  var messageObj = {
    "user": loggedInStaffInfo.name,
    "time": getCurrentTime('TIME'),
    "date": getCurrentTime('DATE_DD-MM-YY'),
    "target": selected_printers_names,
    "message": chat_text
  }


                    //Relay Printing
                    var allConfiguredPrintersList = window.localStorage.configuredPrintersData ? JSON.parse(window.localStorage.configuredPrintersData) : [];
                    var g = 0;
                    var allPrintersList = [];


                    for (var k = 0; k < allConfiguredPrintersList.length; k++){
                      if(allConfiguredPrintersList[k].type == "KOT"){
                        allPrintersList = allConfiguredPrintersList[k].list;
                        break;
                      }
                    }

                    if(allPrintersList.length > 1){
                      doMessagePrint(0);
                    }
                    else if(allPrintersList.length == 1){
                      for(var b = 0; b < messageObj.target.length; b++){
                        if(allPrintersList[0].name == messageObj.target[b]){
                          printMessageInKitchen(messageObj, allPrintersList[0]);  
                          break;
                        }
                      }                 
                    }

                    function doMessagePrint(index){

                        if(!messageObj.target[index]){
                          return "";
                        }

                        for(var a = 0; a < allPrintersList.length; a++){
                          if(allPrintersList[a].name == messageObj.target[index]){

                            printMessageInKitchen(messageObj, allPrintersList[a]);

                            //add some delay
                            setTimeout(function(){
                              doMessagePrint(index + 1);
                            }, 1000);

                            break;
                          }
                        }                      
                    }



  saveToChatLog(messageObj);

  playNotificationSound('SEND');
  showToast('Your message has been sent', '#27ae60');

  hideTalkToKitchen();
}

function hideTalkToKitchen(){
  document.getElementById("textToKitchenWizard").style.display = "none";
}

function saveToChatLog(messageObj){

    var requestData = { "selector" :{ "identifierTag": "ACCELERATE_TEXT_TO_KITCHEN_LOG" } }

    $.ajax({
      type: 'POST',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_settings/_find',
      data: JSON.stringify(requestData),
      contentType: "application/json",
      dataType: 'json',
      timeout: 10000,
      success: function(data) {

        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ACCELERATE_TEXT_TO_KITCHEN_LOG'){
            
            var text_log = data.docs[0].value;
            if(text_log.length < 20){ //max log size --> 20
              text_log.push(messageObj);
            }
            else{
              text_log.splice(0, 1); //remove first entry
              text_log.push(messageObj); //append this content to the log as latest entry
            }

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ACCELERATE_TEXT_TO_KITCHEN_LOG",
                      "value": text_log
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_TEXT_TO_KITCHEN_LOG/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {

                      },
                      error: function(data) {
                      
                      }
                    }); 

          }
          else{
            
          }
        }
        else{
            
        }
      },
      error: function(data) {
        
      }
    });
}


//Error Logging
function appendToLog(text){
  var time_now = moment().format('DD-MM-YYYY hh:mm:ss');

  if(fs.existsSync('log_script.txt')) {
       fs.readFile('log_script.txt', 'utf8', function readFileCallback(err, data){
       if (err){
           
       } else {
          var file_text = data;
          file_text = file_text + '\n'  + time_now + ' > ' + text;
          fs.writeFile('log_script.txt', file_text, 'utf8', (err) => {
             
          }); 
      }});
  }
}



/* KOT Jamming Flash Alert */
function checkForJammedKOTs() {

  var pending_orders = 0;
  var pending_requests = 0;

  checkForOrders();

  function checkForOrders(){
        $.ajax({
            type: 'GET',
            url: COMMON_LOCAL_SERVER_IP+'/accelerate_taps_orders/_design/orders/_view/view',
            timeout: 10000,
            success: function(data) {
              pending_orders = data.total_rows;
              checkForRequests();
            },
            error: function() {
              checkForRequests();
            }
        }); 
  }

  function checkForRequests(){
        $.ajax({
            type: 'GET',
            url: COMMON_LOCAL_SERVER_IP+'/accelerate_kot_print_requests/_design/print-requests/_view/fetchall',
            timeout: 10000,
            success: function(data) {
              pending_requests = data.total_rows;
              renderWarnings();
            },
            error: function() {
              renderWarnings();
            }
        }); 
  }  

  function renderWarnings(){
    if(pending_orders > 3 || pending_requests > 6){
        if(pending_orders >= pending_requests){
          document.getElementById("KOTJammingWarning").style.display = 'block';
          document.getElementById("KOTJammingWarningText").innerHTML = '<b style="font-size: 120%">'+pending_orders+'</b> Orders '+(pending_requests > 0 ? '& <b style="font-size: 120%">'+pending_requests+'</b> KOTs ': '')+'Pending';
        }
        else{
          document.getElementById("KOTJammingWarning").style.display = 'block';
          document.getElementById("KOTJammingWarningText").innerHTML = '<b style="font-size: 120%">'+pending_requests+'</b> KOTs '+(pending_orders > 0 ? '& <b style="font-size: 120%">'+pending_orders+'</b> Orders ': '')+'Pending';
        }

        setTimeout(checkForJammedKOTs, 5000); //check every 5s
    }
    else{
        if($('#KOTJammingWarning').is(':visible')) {
          document.getElementById("KOTJammingWarning").style.display = 'none';
        }

        setTimeout(checkForJammedKOTs, 120000); //check every 2m
    }    
  }

}

function pauseJammedKOTWarning(){
    var warn_text = document.getElementById("KOTJammingWarningText").innerHTML;
    showToast('Warning Ignored: '+warn_text+'. Please contact Accelerate Support if problem persists.', '#e67e22');
    document.getElementById("KOTJammingWarning").style.display = 'none';
}

  