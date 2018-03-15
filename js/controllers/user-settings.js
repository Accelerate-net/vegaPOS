

function openDeleteUserConsent(code, name){

	document.getElementById("deleteUserConsentModalText").innerHTML = 'Are you sure want to remove <b>'+name+'</b> from the list?';
	document.getElementById("deleteUserConsentModalConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="hideDeleteUserConsent()" style="float: left">Cancel</button>'+
                  							'<button type="button" class="btn btn-danger" onclick="deleteUserFromUserProfile(\''+code+'\', \''+name+'\')">Delete</button>';
	
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


    if(fs.existsSync('./data/static/userprofiles.json')) {
        fs.readFile('./data/static/userprofiles.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read User Profiles. Please contact Accelerate Support.', '#e74c3c');
      } else {

        if(data == ''){ data = '[]'; }

        var users = JSON.parse(data);
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

        document.getElementById("allUsersRenderArea").innerHTML = userRenderContent;

    }
    });
      } else {
        showToast('System Error: Unable to read User Profiles. Please contact Accelerate Support.', '#e74c3c');
      } 

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


    if(fs.existsSync('./data/static/userprofiles.json')) {
        fs.readFile('./data/static/userprofiles.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read User Profiles. Please contact Accelerate Support.', '#e74c3c');
      } else {

	         if(data==""){
	            var obj = []
	            obj.push(newObj); //add some data
	            json = JSON.stringify(obj);
	            fs.writeFile('./data/static/userprofiles.json', json, 'utf8', (err) => {
	              if(err){
	                  showToast('System Error: Unable to save User Profiles data. Please contact Accelerate Support.', '#e74c3c');
	              }
	              else{
	                fetchAllUsersInfo(); //refresh the list
	                hideNewUser();
	              }
	            });
	         }
	         else{
	             var flag=0;
	             if(data == ''){ data = '[]'; }
	             var obj = JSON.parse(data);
	             for (var i=0; i<obj.length; i++) {
	               if (obj[i].code == newObj.code){
	                  flag=1;
	                  break;
	               }
	             }
	             if(flag==1){
	               showToast('Warning: Some user has already been registered with the mobile number. Please choose a different name.', '#e67e22');
	             }
	             else{
	                obj.push(newObj);
	                json = JSON.stringify(obj);
	                fs.writeFile('./data/static/userprofiles.json', json, 'utf8', (err) => {
	                     if(err){
	                        showToast('System Error: Unable to save User Profiles data. Please contact Accelerate Support.', '#e74c3c');
	                    }
			            else{

			                fetchAllUsersInfo(); //refresh the list
	                		hideNewUser();
			              	
			              }
	                  });  
	             } 
	         }
    }
    });
      } else {
        showToast('System Error: Unable to read User Profiles. Please contact Accelerate Support.', '#e74c3c');
      } 

}


function deleteUserFromUserProfile(code, name){

   //Check if file exists
   if(fs.existsSync('./data/static/userprofiles.json')) {
       fs.readFile('./data/static/userprofiles.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read User Profiles data. Please contact Accelerate Support.', '#e74c3c');
       } else {
       	
       	if(data == ''){ data = '[]'; }
       
       	var obj = JSON.parse(data); //now it an object
       
	       for (var i=0; i<obj.length; i++) {  
	         if (obj[i].code == code){
	            obj.splice(i,1);
	            break;
	         }
	       }

	       var newjson = JSON.stringify(obj);
	       fs.writeFile('./data/static/userprofiles.json', newjson, 'utf8', (err) => {
	         if(err){
	            showToast('System Error: Unable to make changes in User Profiles data. Please contact Accelerate Support.', '#e74c3c');
	          
	          }else{
					showToast(name+' has been removed successfully', '#27ae60');
					fetchAllUsersInfo();
					hideDeleteUserConsent();

					removeFromCurrentUser(code);
	          }
	       }); 
      }
  });
   } else {
      showToast('System Error: Unable to modify User Profiles data. Please contact Accelerate Support.', '#e74c3c');
   }
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