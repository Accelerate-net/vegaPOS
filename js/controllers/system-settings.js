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
    case "keyboardShortcuts":{
 
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


/*read personalisation data*/
function renderPersonalisations(){

    if(fs.existsSync('./data/static/personalisations.json')) {
        fs.readFile('./data/static/personalisations.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Personalisations data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var params = JSON.parse(data);

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
            else if(params[i].name == "virtualKeyboard"){
              document.getElementById("personalisationEditKeyboard").value = params[i].value;
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
          }

    }
    });
      } else {
        showToast('System Error: Unable to read Personalisations data. Please contact Accelerate Support.', '#e74c3c');
      }   
}



/*read security data*/
function renderSecurityOptions(){

    if(fs.existsSync('./data/static/personalisations.json')) {
        fs.readFile('./data/static/personalisations.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Security Information. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var params = JSON.parse(data);

 
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
          }

    }
    });
      } else {
        showToast('System Error: Unable to read Security Information. Please contact Accelerate Support.', '#e74c3c');
      }   
}



function changePersonalisationFile(type, changedValue){

    if(fs.existsSync('./data/static/personalisations.json')) {
        fs.readFile('./data/static/personalisations.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to modify Personalisations data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var params = JSON.parse(data);


                  for (var i=0; i<params.length; i++){
                    if(params[i].name == type){
                      params[i].value = changedValue;
                      break;
                    }
                  }

           var newjson = JSON.stringify(params);
           fs.writeFile('./data/static/personalisations.json', newjson, 'utf8', (err) => {
             if(err){
                showToast('System Error: Unable to save Personalisations data. Please contact Accelerate Support.', '#e74c3c');
               }
               else{
                renderPersonalisations();
                renderSecurityOptions();
               }
           }); 

    }
    });
      } else {
        showToast('System Error: Unable to modify Personalisations data. Please contact Accelerate Support.', '#e74c3c');
      }   
 
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

/* Production unit: 

  var resetLinks = [{
                    "name": "Billing Modes",
                    "url": "./data/static/billingmodes.json",
                    "type": "json"
                  }, {
                    "name": "Billing Parameters",
                    "url": "./data/static/billingparameters.json",
                    "type": "json"
                  }, {
                    "name": "Cooking Ingredients",
                    "url": "./data/static/cookingingredients.json",
                    "type": "json"
                  }, {
                    "name": "Dine Sessions",
                    "url": "./data/static/dinesessions.json",
                    "type": "json"
                  }, {
                    "name": "Discount Types",
                    "url": "./data/static/discounttypes.json",
                    "type": "json"
                  }, {
                    "name": "Master Menu",
                    "url": "./data/static/mastermenu.json",
                    "type": "json"
                  }, {
                    "name": "Menu Categories",
                    "url": "./data/static/menuCategories.json",
                    "type": "json"
                  }, {
                    "name": "Payment Modes",
                    "url": "./data/static/paymentmodes.json",
                    "type": "json"
                  }, {
                    "name": "Personalisations",
                    "url": "./data/static/personalisations.json",
                    "type": "json"
                  }, {
                    "name": "Saved Comments",
                    "url": "./data/static/savedcomments.json",
                    "type": "json"
                  }, {
                    "name": "Tables",
                    "url": "./data/static/tables.json",
                    "type": "json"
                  }, {
                    "name": "Table Mapping",
                    "url": "./data/static/tablemapping.json",
                    "type": "json"
                  }, {
                    "name": "Table Sections",
                    "url": "./data/static/tablesections.json",
                    "type": "json"
                  }, {
                    "name": "User Profiles",
                    "url": "./data/static/userprofiles.json",
                    "type": "json"
                  }, {
                    "name": "KOT Number Count",
                    "url": "./data/static/lastKOT.txt",
                    "type": "counter"
                  }, {
                    "name": "Tables",
                    "url": "./data/static/tables.json",
                    "type": "json"
                  }, {
                    "name": "Tables",
                    "url": "./data/static/tables.json",
                    "type": "json"
                  }];

  */


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
