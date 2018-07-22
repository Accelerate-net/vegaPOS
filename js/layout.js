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

            document.getElementById('globalTimeDisplay').innerHTML = moment().format('h:mm:ss a')
}

function timedUpdate () {
  updateClock();
  setTimeout(timedUpdate, 1000);
}

timedUpdate();


/* Apply Personalisations */
function applyPersonalisations(){
  
    //Read from Server, apply changes, and save to LocalStorage
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
                      else if(params[i].name == "systemName"){
                        var tempVal = params[i].value;
                        
                        /*update localstorage*/             
                        window.localStorage.appCustomSettings_SystemName = tempVal;
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

applyPersonalisations();



function applySystemName(){
  if(window.localStorage.appCustomSettings_SystemName && window.localStorage.appCustomSettings_SystemName != ''){
    document.getElementById("thisSystemName").innerHTML = window.localStorage.appCustomSettings_SystemName;
  }
  else{
    window.localStorage.appCustomSettings_SystemName = 'No Name System';
    document.getElementById("thisSystemName").innerHTML = 'No Name System';
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
        "token": window.localStorage.loggedInAdmin,
      }

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/pospingserver.php',
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
              showToast(data.error, '#e74c3c');
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

      var admin_data = {
        "token": window.localStorage.loggedInAdmin,
      }

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/pospingserver.php',
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
              showToast(data.error, '#e74c3c');
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



function getServerConnectionStatus(){

      var admin_data = {
        "token": window.localStorage.loggedInAdmin,
      }

      $.ajax({
        type: 'POST',
        url: 'https://www.zaitoon.online/services/pospingserver.php',
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
              showToast(data.error, '#e74c3c');
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
    }, 300000);

}

getServerConnectionStatus();


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

testLocalServerConnection();





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
                                      '<span class="avatar"><img src="data/photos/brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Login to Cloud Server</h1>'+
                                   '</header>'+
                                   '<form style="margin: 0">'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Username" type="text" id="loginHome_server_username" value="" class="form-control loginWindowInput"> </div> </div>'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Password" type="password" id="loginHome_server_password" value="" class="form-control loginWindowInput"> </div> </div>'+                     
                                    '</div>'+
                                    '<button type="button" onclick="doHomeLogin()" class="btn btn-success loginWindowButton">Login</button>'+
                                    '<button type="button" onclick="cancelLoginWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                   '</form>'+
                                '</section>';

    document.getElementById("loginModalHome").style.display = 'block';
    $("#loginHome_server_username").focus();
  }
  else{ //logged in

    document.getElementById("loginModalHomeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<span class="avatar"><img src="data/photos/brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 24px; margin-bottom: 0; color: #3e5b6b; font-family: \'Roboto\';">'+loggedInAdminInfo.branch+'</h1>'+
                                      '<p style="font-size: 14px; color: #72767d;">Logged In as <b>'+loggedInAdminInfo.name+'</b></p>'+
                                   '</header>'+
                                   '<form style="margin: 15px 0">'+
                                    '<button type="button" onclick="doHomeLogout()" class="btn btn-danger loginWindowButton">Logout Now</button>'+
                                    '<button type="button" onclick="cancelLoginWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                   '</form>'+
                                '</section>';

    document.getElementById("loginModalHome").style.display = 'block';
  }
}

/*Recovery Login*/
function recoveryLogin(){

    showToast('Login to the Server and Prove your identity. We will reset your Screen Lock Code!', '#8e44ad')

    document.getElementById("loginModalHomeContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<span class="avatar"><img src="data/photos/brand/brand-square.jpg" alt=""></span>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Login to the Server</h1>'+
                                   '</header>'+
                                   '<form style="margin: 0">'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Username" type="text" id="loginHome_server_username" value="" class="form-control loginWindowInput"> </div> </div>'+
                                        '<div class="col-lg-12"> <div class="form-group"> <input placeholder="Password" type="password" id="loginHome_server_password" value="" class="form-control loginWindowInput"> </div> </div>'+                     
                                    '</div>'+
                                    '<button type="button" onclick="performRecoveryLogin()" class="btn btn-success loginWindowButton">Login</button>'+
                                    '<button type="button" onclick="cancelLoginWindow()" class="btn btn-default loginWindowButton">Cancel</button>'+
                                   '</form>'+
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
    url: 'https://www.zaitoon.online/services/posserverlogin.php',
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

  //Refresh Badge Counts
  var admin_data = {};
  admin_data.token = window.localStorage.loggedInAdmin;  
  admin_data.status = 1;
  
  $.ajax({
    type: 'POST',
    url: 'https://www.zaitoon.online/services/fetchorders.php',
    data: JSON.stringify(admin_data),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    success: function(data) {
      if(data.status){
        document.getElementById('onlineOrderCounter').style.display = 'inline-block';
        document.getElementById('onlineOrderCounter').innerHTML = data.count;
      }
      else{
        document.getElementById('onlineOrderCounter').style.display = 'none';
      }
    },
    error: function(data){
      document.getElementById('onlineOrderCounter').style.display = 'none';
    }
  });


  var t = setTimeout(function() {
    getOnlineOrdersCount()
  }, 60000); 
}

getOnlineOrdersCount();




/*Track Inactivity*/
var IDLE_TIMEOUT = 900; //default time delay = 15mins
var idleSecondsCounter = 0;
var refreshInterval;

function initScreenSaver(){

  idleSecondsCounter = 0;
  clearInterval(refreshInterval);

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
            }
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
}


function switchProfile(name, code){

   var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
    }
 
    loggedInStaffInfo.name = name;
    loggedInStaffInfo.code = code;

    window.localStorage.loggedInStaffData = JSON.stringify(loggedInStaffInfo);
    renderCurrentUserDisplay();
    selectStewardWindowClose();

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
                    "identifierTag": "ZAITOON_STAFF_PROFILES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_STAFF_PROFILES'){

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
              while(users[n]){

                isRendered = false;

                if(n == 0){
                  isRendered = true;
                  renderContent = '<tag onclick="selectStewardWindowClose()" class="stewardWindowClose" id="stewardWindowCloseButton">X</tag> <div class="row" style="margin: 0">';
                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchProfile(\''+users[n].name+'\', \''+users[n].code+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                }
                else if(n == 1){
                  isRendered = true;
                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchProfile(\''+users[n].name+'\', \''+users[n].code+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                  renderContent += '</div>';
                }
                else if(n > 1 && n%2 == 0){
                  renderContent += '<div class="row" style="margin: 4px 0 0 0">';
                }

                if(!isRendered){
                  renderContent += '<div class="col-sm-6" style="margin: 0; padding: 0"> <div onclick="switchProfile(\''+users[n].name+'\', \''+users[n].code+'\')" class="stewardProfile easySelectTool_StewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                }

                if(n > 1 && n%2 == 1){
                  renderContent += '</div>';
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
                console.log('Am secretly running...')
                if($('#stewardModalHome').is(':visible')) {

                  console.log(e.which)

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

                              currentIndex = currentIndex - 2;

                              if(currentIndex < 0){
                                if(Math.abs(currentIndex)%2 == 1)
                                  currentIndex = lastIndex;
                                else
                                  currentIndex = lastIndex - 1;
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
            showToast('Not Found Error: Registered Users data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Registered Users data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Registered Users data. Please contact Accelerate Support.', '#e74c3c');
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
    document.getElementById("currentUserProfileDisplay").innerHTML = '<tag class="currentUserImage"/>'+getImageCode(loggedInStaffInfo.name)+'</tag><span style="font-weight: 400">'+loggedInStaffInfo.name+'</span>';
  }
  else{
    document.getElementById("currentUserProfileDisplay").innerHTML = '<img src="images/default_user.png" class="user-image" alt="Avatar" /> <span>Profile Not Selected</span>';
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
                    "identifierTag": "ZAITOON_DINE_SESSIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_DINE_SESSIONS'){

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
                console.log('Am secretly running...')
                if($('#sessionModalHome').is(':visible')) {

                  console.log(e.which)

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

                              currentIndex = currentIndex - 2;

                              if(currentIndex < 0){
                                if(Math.abs(currentIndex)%2 == 1)
                                  currentIndex = lastIndex;
                                else
                                  currentIndex = lastIndex - 1;
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
            showToast('Not Found Error: Dine Sessions data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Dine Sessions data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
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
    document.getElementById("currentSessionDisplay").innerHTML = '<span>Sessions not Set</span>';
  }
}

renderCurrentSessionDisplay();


// SPOTLIGHT SEARCH TOOL

function renderSpotlightPreview(type, encodedData){

  var renderTemplate = '';

  switch(type){
    case "Clear":{
      renderTemplate = '';
      console.log('Render Preview... [Clear]')
      break;
    }
    case "Tables":{
      console.log('Render Preview... [Tables]')
      var info = JSON.parse(decodeURI(encodedData));
      if(info.status == 0){
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_free.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Free Table</div>'; 
      }
      else if(info.status == 5){
        if(info.assigned == "Hold Order"){
          renderTemplate = '<div style="height: 96px"><img src="images/common/table_saved.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #ecaa40;">Order Saved</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">'+getFormattedTime(info.lastUpdate)+' ago</p>';
        }
        else{
          renderTemplate = '<div style="height: 96px"><img src="images/common/table_reserved.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #ecaa40;">Reserved '+(info.assigned != '' ? 'For '+info.assigned : '')+'</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">'+getFormattedTime(info.lastUpdate)+' ago</p>';
        }
      }
      else{
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_occuppied.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #e74c3c;">Running Order</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">Updated '+getFormattedTime(info.lastUpdate)+' ago</p>'; 
      }
      break;
    }
    case "Orders":{
      console.log('Render Preview... [Orders]')
      var info = JSON.parse(decodeURI(encodedData));

      if(info.orderStatus == 1){ //Active
          renderTemplate = '<div style="height: 96px"><img src="images/common/spotlight_cooking.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+(info.orderDetails.modeType == 'TOKEN' ? '<p class="spotlightOrderTag">Token #'+info.table+'</p>' : (info.orderDetails.modeType == 'DINE' ? '<p class="spotlightOrderTag">Table #'+info.table+'</p>' : ''))+'</div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Running Order</div><p class="spotlightOrderTime">Order punched '+getFormattedTime(info.timePunch)+' ago'+(info.stewardName != '' ? ' by <b>'+info.stewardName+'</b>' : '')+'</p>'; 
      }
      else if(info.orderStatus == 2){ //Bill Printed
          renderTemplate = '<div style="height: 96px"><img src="images/common/spotlight_billed.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">'+info.orderDetails.mode+(info.orderDetails.modeType == 'TOKEN' ? '<p class="spotlightOrderTag">Token #'+info.table+'</p>' : (info.orderDetails.modeType == 'DINE' ? '<p class="spotlightOrderTag">Table #'+info.table+'</p>' : ''))+'</div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Billed #'+info.billNumber+'</div><p class="spotlightOrderTime">Billed at '+getFancyTime(info.timeBill)+(info.stewardName != '' ? ' by <b>'+info.stewardName+'</b>' : '')+'</p>'; 
          renderTemplate += '<div style="margin-top: 10px;"><button onclick="preSettleBill(\''+info.billNumber+'\', \'ORDER_PUNCHING\')" class="btn btn-success">Settle Bill</button></div>';
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

        renderTemplate += '<div style="margin-top: 10px;"><button onlclick="printDuplicateBill(\''+info.billNumber+'\')" class="btn btn-default">Print Duplicate Bill</button></div>';

      }
      else{
        renderTemplate = '<div style="height: 96px"><img src="images/common/table_occuppied.png"></div> <div class="name" style="font-family: \'Oswald\', sans-serif;">Table <b style="font-size: 120%">'+info.table+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #e74c3c;">Running Order</div><p style="font-size: 12px; margin-top: 14px; color: #879094;">Updated '+getFormattedTime(info.lastUpdate)+' ago</p>'; 
      }
      break;
    }
    case "Menu":{
      console.log('Render Preview... [Menu]')
      var info = JSON.parse(decodeURI(encodedData));
      if(info.isAvailable){
        renderTemplate = '<div style="height: 96px; position: relative; display: inline-block;">'+(info.isPhoto ? '<img src="data/photos/menu/'+info.code+'.jpg" style="height: 96px; border-radius: 10%;"><div class="spotlightMenuItemPrice"><i class="fa fa-inr"></i>'+info.price+'</div>' : '<img src="images/common/spotlight_food.png"><div class="spotlightMenuItemPriceNoImage"><i class="fa fa-inr"></i>'+info.price+'</div>')+' </div> <div class="name" style="font-family: \'Oswald\', sans-serif;"><b style="font-size: 120%">'+info.name+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #26b764;">Available</div>'; 
      }
      else{
        renderTemplate = '<div style="height: 96px; position: relative; display: inline-block;">'+(info.isPhoto ? '<img src="data/photos/menu/'+info.code+'.jpg" style="height: 96px; border-radius: 10%;"><div class="spotlightMenuItemPrice"><i class="fa fa-inr"></i>'+info.price+'</div>' : '<img src="images/common/spotlight_food.png"><div class="spotlightMenuItemPriceNoImage"><i class="fa fa-inr"></i>'+info.price+'</div>')+'</div> <div class="name" style="font-family: \'Oswald\', sans-serif;"><b style="font-size: 120%">'+info.name+'</b></div> <div style="font-family: sans-serif; font-size: 24px; color: #e74c3c;">Out of Stock</div>'; 
      }
      break;
    }
    case "Customers":{
      console.log('Render Preview... [Customers]')
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


function showSpotlight(){

        document.getElementById("spotlightSearchTool").style.display = "block";
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
                    var requestData = { "selector" :{ "KOTNumber": orderNumber } }

                    $.ajax({
                      type: 'POST',
                      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_kot/_find',
                      data: JSON.stringify(requestData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        if(data.docs.length > 0){

                          var bill = data.docs[0];
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
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Orders" spot-preview-data="'+tempData+'" onclick="openPastOrder(\''+tempData+'\')"><i class="fa '+(spotItem.orderStatus == 1 ? 'fa-refresh' : (spotItem.orderStatus == 2 ? 'fa-print' : (spotItem.orderStatus == 3 ? 'fa-check': '')))+'" style="float: left; display: table-cell; width: 8%; padding: 2px 0 0 0;"></i> <name style="display: inline-block; width: 50%">#'+(spotItem.billNumber != '' ? spotItem.billNumber : spotItem.KOTNumber)+'<date style="font-size: 80%; color: #737475; padding-left: 5px">'+spotItem.date+'</date></name><tag style="float: right; padding: 1px 3px 0 0; font-size: 85%;"> '+spotItem.customerName+'</tag></li>';
                                          
                                          count++;
                                          tabIndex++;
                                    
                                  });
                                  break;
                              }
                            }


                            if(count > 0){
                              renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                            }

                          });

                          renderContent += '</ul>';

                          $('#spotlightResultsRenderArea').html(renderContent);

                          //Refresh dropdown list
                          li = $('#spotlightResultsRenderArea li');

                        }
                        else{

                          //Search for BILLS

                          orderNumber = parseInt(orderNumber);
                          var requestDataBill = { "selector" :{ "billNumber": orderNumber } }

                          $.ajax({
                            type: 'POST',
                            url: COMMON_LOCAL_SERVER_IP+'/zaitoon_bills/_find',
                            data: JSON.stringify(requestDataBill),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: 10000,
                            success: function(data) {
                              if(data.docs.length > 0){

                                var bill = data.docs[0];
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
                                                itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Orders" spot-preview-data="'+tempData+'" onclick="openPastOrder(\''+tempData+'\')"><i class="fa '+(spotItem.orderStatus == 1 ? 'fa-refresh' : (spotItem.orderStatus == 2 ? 'fa-print' : (spotItem.orderStatus == 3 ? 'fa-check': '')))+'" style="float: left; display: table-cell; width: 8%; padding: 2px 0 0 0;"></i> <name style="display: inline-block; width: 50%">#'+(spotItem.billNumber != '' ? spotItem.billNumber : spotItem.KOTNumber)+'<date style="font-size: 80%; color: #737475; padding-left: 5px">'+spotItem.date+'</date></name><tag style="float: right; padding: 1px 3px 0 0; font-size: 85%;"> '+spotItem.customerName+'</tag></li>';
                                                
                                                count++;
                                                tabIndex++;
                                          
                                        });
                                        break;
                                    }
                                  }


                                  if(count > 0){
                                    renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                                  }

                                });

                                renderContent += '</ul>';

                                $('#spotlightResultsRenderArea').html(renderContent);

                                //Refresh dropdown list
                                li = $('#spotlightResultsRenderArea li');

                              }
                              else{
                                //Search for INVOICE

                                var requestDataInvoice = { "selector" :{ "billNumber": orderNumber } }

                                $.ajax({
                                  type: 'POST',
                                  url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_find',
                                  data: JSON.stringify(requestDataInvoice),
                                  contentType: "application/json",
                                  dataType: 'json',
                                  timeout: 10000,
                                  success: function(data) {
                                    if(data.docs.length > 0){

                                      var bill = data.docs[0];
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
                                                      itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Orders" spot-preview-data="'+tempData+'" onclick="openPastOrder(\''+tempData+'\')"><i class="fa '+(spotItem.orderStatus == 1 ? 'fa-refresh' : (spotItem.orderStatus == 2 ? 'fa-print' : (spotItem.orderStatus == 3 ? 'fa-check': '')))+'" style="float: left; display: table-cell; width: 8%; padding: 2px 0 0 0;"></i> <name style="display: inline-block; width: 50%">#'+(spotItem.billNumber != '' ? spotItem.billNumber : spotItem.KOTNumber)+'<date style="font-size: 80%; color: #737475; padding-left: 5px">'+spotItem.date+'</date></name><tag style="float: right; padding: 1px 3px 0 0; font-size: 85%;"> '+spotItem.customerName+'</tag></li>';
                                                      
                                                      count++;
                                                      tabIndex++;
                                                
                                              });
                                              break;
                                          }
                                        }


                                        if(count > 0){
                                          renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                                        }

                                      });

                                      renderContent += '</ul>';

                                      $('#spotlightResultsRenderArea').html(renderContent);

                                      //Refresh dropdown list
                                      li = $('#spotlightResultsRenderArea li');

                                    }
                                    else{
                                      //Search for INVOICE
                                      spotlightData = [];
                                    }
                                  }
                                });  

                              } //end - search invoices
                            }
                          });  


                        } //end - search bills
                      }
                    });  

                  break;
                }
                case "CUSTOMER":{

                    var mobileNumber = searchKey.substring(1); //to remove '@' in the beginning

                    var requestData = {
                      "selector"  :{ 
                                    "mobile": mobileNumber 
                                  },
                      "fields"    : ["name", "mobile", "savedAddresses"]
                    }

                    $.ajax({
                      type: 'POST',
                      url: COMMON_LOCAL_SERVER_IP+'/zaitoon_users/_find',
                      data: JSON.stringify(requestData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        if(data.docs.length != 0){ //USER FOUND!!!

                          console.log(data.docs[0])
                          
                          spotlightData = JSON.parse('[{ "category": "Customers", "list": [{ "name": "Abhijith", "mobile": "9043960876", "last": "4th July, 2018", "visits": 1, "orders": 0 }, { "name": "Anas Jafry", "mobile": "9884179675", "last": "3rd July, 2018", "visits": 3, "orders": 12 }] }]');
                        
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
                            }

                          });

                          renderContent += '</ul>';

                          $('#spotlightResultsRenderArea').html(renderContent);

                          //Refresh dropdown list
                          li = $('#spotlightResultsRenderArea li');

                        }
                        else{ //USER NOT FOUND
                          spotlightData = [];
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


                    //Preload TABLES data
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

                            //Preload MENU data
                            var requestMenuData = {
                              "selector"  :{ 
                                            "identifierTag": "ZAITOON_MASTER_MENU" 
                                          },
                              "fields"    : ["_rev", "identifierTag", "value"]
                            }

                            $.ajax({
                              type: 'POST',
                              url: COMMON_LOCAL_SERVER_IP+'/zaitoon_settings/_find',
                              data: JSON.stringify(requestMenuData),
                              contentType: "application/json",
                              dataType: 'json',
                              timeout: 10000,
                              success: function(menudata) {
                                if(menudata.docs.length > 0){
                                  if(menudata.docs[0].identifierTag == 'ZAITOON_MASTER_MENU'){

                                      var mastermenu = menudata.docs[0].value; 
                                      var menuitems = [];
                                      var n = 0;
                                      while(mastermenu[n]){
                                        menuitems = menuitems.concat(mastermenu[n].items)
                                        n++;
                                      }

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
                                                        itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="retrieveTableInfo(\''+spotItem.table+'\', \'FREE\')"> <i class="fa fa-circle" style="color: #2ecc71"></i> Table #'+(spotItem.table)+'</li>';
                                                      }
                                                      else if(spotItem.status == 1 || spotItem.status == 2){
                                                        itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="retrieveTableInfo(\''+spotItem.table+'\', \'MAPPED\')"> <i class="fa fa-circle" style="color: #e74c3c"></i> Table #'+(spotItem.table)+'</li>';
                                                      }
                                                      else if(spotItem.status == 5){
                                                        itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="retrieveTableInfo(\''+spotItem.table+'\', \'FREE\', \''+(spotItem.assigned != "" && spotItem.assigned != "Hold Order" ? spotItem.assigned : '')+'\', '+(spotItem.assigned != "" && spotItem.assigned == "Hold Order" ? 1 : 0)+')"> <i class="fa fa-circle" style="color: #ecaa40"></i> Table #'+(spotItem.table)+'</li>';
                                                      }
                                                      
                                                      count++;
                                                      tabIndex++;
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
                                                        itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="additemtocart(\''+tempData+'\')"> <i class="fa fa-check" style="color: #2ecc71; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                                      }
                                                      else{
                                                        itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="additemtocart(\''+tempData+'\')"> <i class="fa fa-times" style="color: #e74c3c; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                                      } //Not available

                                                      count++;
                                                      tabIndex++;
                                                }
                                              });
                                              break;
                                          }
                                        }


                                        if(count > 0){
                                          renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
                                        }

                                      });

                                      renderContent += '</ul>';

                                      $('#spotlightResultsRenderArea').html(renderContent);

                                      //Refresh dropdown list
                                      li = $('#spotlightResultsRenderArea li');                                      

                                  }
                                }
                              }

                            }); 
                            //End - Menu data

                                
                          }
                        }
                      }
                    });
                    //End - Tables data
                  
                  }//!isMenuAndTablesLoaded
                  else{

                        liSelected = undefined

                        var renderContent = '<ul class="ng-spotlight-results-category">';
                        var count = 0;
                        var tabIndex = 1;
                        var itemsList = '';

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
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="retrieveTableInfo(\''+spotItem.table+'\', \'FREE\')"> <i class="fa fa-circle" style="color: #2ecc71"></i> Table #'+(spotItem.table)+'</li>';
                                        }
                                        else if(spotItem.status == 1 || spotItem.status == 2){
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="retrieveTableInfo(\''+spotItem.table+'\', \'MAPPED\')"> <i class="fa fa-circle" style="color: #e74c3c"></i> Table #'+(spotItem.table)+'</li>';
                                        }
                                        else if(spotItem.status == 5){
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Tables" spot-preview-data="'+tempData+'" onclick="retrieveTableInfo(\''+spotItem.table+'\', \'FREE\', \''+(spotItem.assigned != "" && spotItem.assigned != "Hold Order" ? spotItem.assigned : '')+'\', '+(spotItem.assigned != "" && spotItem.assigned == "Hold Order" ? 1 : 0)+')"> <i class="fa fa-circle" style="color: #ecaa40"></i> Table #'+(spotItem.table)+'</li>';
                                        }
                                        
                                        count++;
                                        tabIndex++;
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
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="additemtocart(\''+tempData+'\')"> <i class="fa fa-check" style="color: #2ecc71; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                        }
                                        else{
                                          itemsList += '<li class="ng-spotlight-results-list-item" spot-preview-type="Menu" spot-preview-data="'+tempData+'" onclick="additemtocart(\''+tempData+'\')"> <i class="fa fa-times" style="color: #e74c3c; float: left; display: table-cell; width: 8%; padding: 3px 0 0 0;"></i> <name style="display: inline-block; width: 65%">'+spotItem.name+'</name><tag style="float: right; padding: 2px 3px 0 0; font-size: 85%;"> <i class="fa fa-inr" style="font-size: 85% !important"></i>'+spotItem.price+'</tag></li>';
                                        } //Not available

                                        count++;
                                        tabIndex++;
                                  }
                                });
                                break;
                            }
                          }


                          if(count > 0){
                            renderContent += '<div class="ng-spotlight-results-list-header">'+spotResult.category+'</div>'+itemsList;
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






