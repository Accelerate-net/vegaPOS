

function openDeleteUserConsent(code, name){

    // LOGGED IN USER INFO
    var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
          
    if(jQuery.isEmptyObject(loggedInStaffInfo)){
      loggedInStaffInfo.name = "";
      loggedInStaffInfo.code = "";
      loggedInStaffInfo.role = "";
    }

    //either profile not chosen, or not an admin
    if(code == '9884179675' && name == 'Jafry'){ 
      showToast('Warning! This user profile is protected, can not be deleted.', '#e67e22');
      return '';
    }


	document.getElementById("deleteUserConsentModalText").innerHTML = 'Are you sure want to remove <b>'+name+'</b> from the list?';
	document.getElementById("deleteUserConsentModalConsent").innerHTML = '<button  class="btn btn-default" onclick="hideDeleteUserConsent()" style="float: left">Cancel</button>'+
                  							'<button  class="btn btn-danger" onclick="deleteUserFromUserProfile(\''+code+'\', \''+name+'\')">Delete</button>';
	
	document.getElementById("deleteUserConsentModal").style.display = "block";

} 

function hideDeleteUserConsent(){
	document.getElementById("deleteUserConsentModal").style.display = "none";
} 


function openNewUser(){
	document.getElementById("newUserArea").style.display = "block";
	$("#user_profile_new_user_name").focus();
  $("#user_profile_new_user_name").val('');
  $("#user_profile_new_user_mobile").val('');
	document.getElementById("openNewUserButton").style.display = "none";
}

function hideNewUser(){
	
	document.getElementById("newUserArea").style.display = "none";
	document.getElementById("openNewUserButton").style.display = "block";
}


function fetchAllUsersInfo(){
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

    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/user/fetch',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
            var users = result.data;
            //alphabetical sorting 
            users.sort(function (a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });

            var n = 0;
            var userRenderContent = '';
            while(users[n]){
              userRenderContent = userRenderContent + '<tr role="row" class="odd">'+
                      '<td>#'+(n+1)+'</td> <td>'+users[n].name+'</td>'+
                      '<td>'+getUserDesignation(users[n].role)+'</td>'+
                      '<td>'+users[n].code+'</td>'+
                      '<td>'+(users[n].role != 'ADMIN' || (loggedInStaffInfo.code == users[n].code || loggedInStaffInfo.code == '9884179675') ? '<tag style="cursor: pointer; width: 30px; display: inline-block; text-align: center;" onclick="openDeleteUserConsent(\''+users[n].code+'\', \''+users[n].name+'\')"><i class="fa fa-trash-o"></i></tag>' : '')+(loggedInStaffInfo.code == users[n].code ? '<tag style="width: 30px; color: #36d24a; display: inline-block; text-align: center; cursor: pointer" onclick="openChangePasscodeWindow(\''+users[n].code+'\', \''+users[n].name+'\')"><i class="fa fa-key"></i></tag>' : '')+'</td> </tr>';
              n++;
            }
        
            if(userRenderContent == ''){
              document.getElementById("allUsersRenderArea").innerHTML = '<p style="margin: 10px 0 0 0; color: #bdc3c7">No Registered Users found</p>';
            }
            else{
              document.getElementById("allUsersRenderArea").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Name</th> <th style="text-align: left">Role</th> <th style="text-align: left">Phone</th> <th style="text-align: left"></th> </tr> </thead> <tbody>'+userRenderContent+'</tbody>';
            }

        }
        else{
          showNotification('NOT_FOUND_ERROR', 'Registered Users data not found');
        }
      },
      error: function(error) {
        showNotification('SERVER_ERROR', 'Unable to read Registered Users data', error);
      }
    });


    function getUserDesignation(type) {
      if(type == 'ADMIN'){
        return 'Admin';
      }
      else if(type == 'STEWARD'){
        return 'Staff';
      }
      else if(type == 'AGENT'){
        return 'Delivery';
      }
    }
}


function openChangePasscodeWindow(code, name){

  if(name != '' && code != ''){
    document.getElementById("adminPasswordChangeModalContent").innerHTML = '<section id="main" style="padding: 35px 44px 20px 44px">'+
                                   '<header>'+
                                      '<h1 style="font-size: 21px; font-family: \'Roboto\'; color: #3e5b6b;">Change Passcode for <b>'+name+'</b></h1>'+
                                      '<hr style="margin-bottom: 15px; margin-top: 5px;">'+
                                   '</header>'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<p style="font-size: 12px; letter-spacing: 4px; color: #728890;">CURRENT PASSCODE</p>'+
                                        '<div class="col-sm-12"> <div class="form-group"> <input placeholder="- - - -" style="letter-spacing: 6px; font-weight: bold;" maxlength="4" type="password" id="passcode_old" class="form-control adminUserPasscodeInput"> </div> </div>'+    
                                    '</div>'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<p style="font-size: 12px; letter-spacing: 4px; color: #728890;">NEW PASSCODE</p>'+
                                        '<div class="col-sm-12"> <div class="form-group"> <input placeholder="- - - -" style="letter-spacing: 6px; font-weight: bold;" maxlength="4" type="password" id="passcode_new_1" class="form-control adminUserPasscodeInput"> </div> </div>'+    
                                    '</div>'+
                                    '<div class="row" style="margin: 15px 0">'+
                                        '<p style="font-size: 12px; letter-spacing: 4px; color: #728890;">CONFIRM PASSCODE</p>'+
                                        '<div class="col-sm-12"> <div class="form-group"> <input placeholder="- - - -" style="letter-spacing: 6px; font-weight: bold;" maxlength="4" type="password" id="passcode_new_2" class="form-control adminUserPasscodeInput"> </div> </div>'+                        
                                    '</div>'+
                                '</section>';

    document.getElementById("adminPasswordChangeModalHome").style.display = 'block';
  
    $('#passcode_old').focus();
    $('#passcode_old').val('');
    $('#passcode_new_1').val('');
    $('#passcode_new_2').val('');

  }
  else{
    showToast('Error: Unknown User.', '#e74c3c');
  } 

}

function changeAdminPassword(){

  var code_current = $('#passcode_old').val();
  var code_new_1 = $('#passcode_new_1').val();
  var code_new_2 = $('#passcode_new_2').val();

  code_new_1 = code_new_1.replace(/\s/g,'');
  code_new_2 = code_new_2.replace(/\s/g,'');

  if(code_new_1 == '' || isNaN(code_new_1) || code_new_1.length < 4){
    showToast('Warning: Invalid Code. Enter a 4 digit number only.', '#e67e22');
    return '';
  }
  else if(code_new_2 == '' || isNaN(code_new_2) || code_new_2.length < 4){
    showToast('Warning: Confirm Passcode is invalid.', '#e67e22');
    return '';
  }
  else if(code_new_1 != code_new_2){
    showToast('Warning: Passcodes do not match.', '#e67e22');
    return '';
  }
  else if(code_new_1 == code_current){
    showToast('Warning: Do not use the same passcode.', '#e67e22');
    return '';
  }

  // LOGGED IN USER INFO
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  //either profile not chosen, or not an admin
  if(loggedInStaffInfo.code == '' || loggedInStaffInfo.role != 'ADMIN'){ 
    showToast('Warning: You are not an Admin.', '#e67e22');
    return '';
  }

  var request_object = {
    'code': loggedInStaffInfo.code,
    'current_passcode': code_current,
    'updating_passcode': code_new_1
  }

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/user/changepasscode',
    data: JSON.stringify(request_object),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllUsersInfo(); //refresh the list
        adminPasswordChangeModalHide();
        showToast('New Passcode has been set for <b>'+loggedInStaffInfo.name+'</b>', '#27ae60');
      }
      else{
        showNotification('UPDATE_ERROR', 'Unable to update the passcode');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to change the passcode', error);
    }
  });
}

function adminPasswordChangeModalHide(){
  document.getElementById("adminPasswordChangeModalHome").style.display = 'none';
}

function addNewUserProfile(){
	var role = document.getElementById("user_profile_new_user_role").value;
	var name = document.getElementById("user_profile_new_user_name").value;
	var mobile = document.getElementById("user_profile_new_user_mobile").value;

	var newObj = {};
	newObj.name = name;
	newObj.code = mobile;
	newObj.role = role;
	newObj.password = null;

	if(role == '' || name == '' || mobile == ''){
		showToast('Warning: Missing some values', '#e67e22');
		return '';
	}

	if(isNaN(mobile) || mobile.length != 10){
		showToast('Warning: Invalid mobile number', '#e67e22');
		return '';
	}
  if(newObj.role == "ADMIN"){
    newObj.password = 1234;
  }

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/user/create',
    data: JSON.stringify(newObj),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        if(role == 'ADMIN'){
          showToast('Success! You may change default password <b>1234</b>', '#27ae60');
        }

        fetchAllUsersInfo(); //refresh the list
        hideNewUser();
      }
      else{
        showNotification('CREATE_ERROR', 'Unable to create user');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to create user', error);
    }
  });
}


function deleteUserFromUserProfile(code, name){
  var requestData = {
    'delete_user_code' : code
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/user/delete',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        showToast(name+' has been removed successfully', '#27ae60');
        fetchAllUsersInfo();
        hideDeleteUserConsent();

        removeFromCurrentUser(code);
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete user');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to delete user', error);
    }
  });
}


function removeFromCurrentUser(code){
 //Remove the current user if deleting the same user
   var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
  
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
  }

  if(loggedInStaffInfo.code == code){
  	window.localStorage.loggedInStaffData = '';
  	renderCurrentUserDisplay();
  }
}