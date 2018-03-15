let fs = require('fs');


/* Apply Personalisations */
function applyPersonalisations(){
  
    //Read from File, apply changes, and save to LocalStorage

    if(fs.existsSync('./data/static/personalisations.json')) {
        fs.readFile('./data/static/personalisations.json', 'utf8', function readFileCallback(err, data){
      if (err){
      } else {

          if(data == ''){ data = '[]'; }

          var params = JSON.parse(data);

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
          }

    }
    });
  }
  
}

applyPersonalisations();

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
$(function () {
    "use strict";
    jqKeyboard.init();
});


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
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatus"><i class="fa fa-circle"></i> Connected</tag>';
          }
          else
          {
            if(data.errorCode == 404){
              window.localStorage.loggedInAdmin = "";
              showToast(data.error, '#e74c3c');
              document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-circle"></i> Re-authenticate</tag>';
            }
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-circle"></i> Re-authenticate</tag>';
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
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatus"><i class="fa fa-circle"></i> Connected</tag>';
          }
          else
          {
            if(data.errorCode == 404){
              window.localStorage.loggedInAdmin = "";
              showToast(data.error, '#e74c3c');
              document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-circle"></i> Re-authenticate</tag>';
            }
            document.getElementById('globalServerConnectionStatus').innerHTML = '<tag class="serverStatusRed"><i class="fa fa-circle"></i> Re-authenticate</tag>';
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



/*Check Login*/
function checkLogin(){
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

/* Time Display */

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function getCurrentTimeForDisplay() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('globalTimeDisplay').innerHTML = h + ":" + m + ":" + s;
  var t = setTimeout(function() {
    getCurrentTimeForDisplay()
  }, 500);
}

getCurrentTimeForDisplay();


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
}


/*Steward Selection*/
function selectStewardWindow(){
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
  }


    if(fs.existsSync('./data/static/userprofiles.json')) {
        fs.readFile('./data/static/userprofiles.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read User Profiles. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var users = JSON.parse(data);
              users.sort(); //alphabetical sorting 

              if(users.length == 1){
                showToast('Warning: No other profiles created yet.', '#e67e22');
                return '';
              }

              if(users.length == 0){
                showToast('Warning: No profile created yet.', '#e67e22');
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
                  renderContent = '<tag onclick="selectStewardWindowClose()" class="stewardWindowClose">X</tag> <div class="row" style="margin: 0">';
                  renderContent += '<div onclick="switchProfile(\''+users[n].name+'\', \''+users[n].code+'\')" class="col-sm-6" style="margin: 0; padding: 0"> <div class="stewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                }
                else if(n == 1){
                  isRendered = true;
                  renderContent += '<div onclick="switchProfile(\''+users[n].name+'\', \''+users[n].code+'\')" class="col-sm-6" style="margin: 0; padding: 0"> <div class="stewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
                  renderContent += '</div>';
                }
                else if(n > 1 && n%2 == 0){
                  renderContent += '<div class="row" style="margin: 4px 0 0 0">';
                }

                if(!isRendered){
                  renderContent += '<div onclick="switchProfile(\''+users[n].name+'\', \''+users[n].code+'\')" class="col-sm-6" style="margin: 0; padding: 0"> <div class="stewardProfile" id="user_switch_'+users[n].code+'"> <h1 class="stewardName">'+users[n].name+'</h1> <div class="stewardIcon">'+getImageCode(users[n].name)+'</div> </div> </div>';
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

    }
    });
      } else {
        showToast('System Error: Unable to read User Profiles. Please contact Accelerate Support.', '#e74c3c');
      } 
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
    document.getElementById("currentUserProfileDisplay").innerHTML = '<tag class="currentUserImage"/>'+getImageCode(loggedInStaffInfo.name)+'</tag><span style="font-weight: bold">'+loggedInStaffInfo.name+'</span>';
  }
  else{
    document.getElementById("currentUserProfileDisplay").innerHTML = '<img src="images/default_user.png" class="user-image" alt="Avatar" /> <span>Profile Not Selected</span>';
  }
}

renderCurrentUserDisplay();

