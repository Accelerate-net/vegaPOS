

function openDeleteUserConsent(code, name){

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
	document.getElementById("openNewUserButton").style.display = "none";
}

function hideNewUser(){
	
	document.getElementById("newUserArea").style.display = "none";
	document.getElementById("openNewUserButton").style.display = "block";
}


function fetchAllUsersInfo(){

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

		        var n = 0;
		        var userRenderContent = '';
		        while(users[n]){
		        	userRenderContent = userRenderContent + '<tr role="row" class="odd">'+
		        					'<td>#'+(n+1)+'</td> <td>'+users[n].name+'</td>'+
		        					'<td>'+(users[n].role == 'ADMIN'? 'Admin': 'Staff')+'</td>'+
		        					'<td>'+users[n].code+'</td>'+
		        					'<td onclick="openDeleteUserConsent(\''+users[n].code+'\', \''+users[n].name+'\')"> <i style="cursor: pointer" class="fa fa-trash-o"></i> </td> </tr>';
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

function addNewUserProfile(){

	var role = document.getElementById("user_profile_new_user_role").value;
	var name = document.getElementById("user_profile_new_user_name").value;
	var mobile = document.getElementById("user_profile_new_user_mobile").value;

	var newObj = {};
	newObj.name = name;
	newObj.code = mobile;
	newObj.role = role;
	newObj.password = "";

	if(role == '' || name == '' || mobile == ''){
		showToast('Warning: Missing some values', '#e67e22');
		return '';
	}

	if(isNaN(mobile) || mobile.length != 10){
		showToast('Warning: Invalid mobile number', '#e67e22');
		return '';
	}


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_STAFF_PROFILES" 
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
      	console.log(data)
        if(data.docs.length > 0){
          if(data.docs[0].identifierTag == 'ZAITOON_STAFF_PROFILES'){

             var staffList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<staffList.length; i++) {
               if (staffList[i].code == mobile){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Mobile Number already registered. Please add a different mobile.', '#e67e22');
             }
             else{

                staffList.push(newObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_STAFF_PROFILES",
                  "value": staffList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_STAFF_PROFILES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

			            fetchAllUsersInfo(); //refresh the list
	                	hideNewUser();
                  
                  },
                  error: function(data) {
                    showToast('System Error: Unable to update Users data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
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


function deleteUserFromUserProfile(code, name){


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_STAFF_PROFILES" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_STAFF_PROFILES'){

               var staffList = data.docs[0].value;

               for (var i=0; i<staffList.length; i++) {  
                 if (staffList[i].code == code){
                    staffList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_STAFF_PROFILES",
                  "value": staffList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_STAFF_PROFILES/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
					showToast(name+' has been removed successfully', '#27ae60');
					fetchAllUsersInfo();
					hideDeleteUserConsent();

					removeFromCurrentUser(code);
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Registered Users data. Please contact Accelerate Support.', '#e74c3c');
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