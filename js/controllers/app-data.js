
function openNewSavedComment(){
  document.getElementById("add_new_savedComment").value = '';
	document.getElementById("newSavedCommentArea").style.display = "block";
  $("#add_new_savedComment").focus();
	document.getElementById("openNewSavedCommentButton").style.display = "none";
}

function hideNewSavedComment(){
	
	document.getElementById("newSavedCommentArea").style.display = "none";
	document.getElementById("openNewSavedCommentButton").style.display = "block";
}



function openNewCookingIngredient(){
  document.getElementById("add_new_CookingIngredient_name").value = '';
  document.getElementById("newCookingIngredientArea").style.display = "block";
  $("#add_new_CookingIngredient_name").focus();
  document.getElementById("openNewCookingIngredientButton").style.display = "none";
}

function hideNewCookingIngredient(){
  
  document.getElementById("newCookingIngredientArea").style.display = "none";
  document.getElementById("openNewCookingIngredientButton").style.display = "block";
}




function openNewDineSession(){
	document.getElementById("newDineSessionArea").style.display = "block";
  $("#add_new_dineSession_name").focus();
	document.getElementById("openNewSessionButton").style.display = "none";
}

function hideNewDineSession(){
	
	document.getElementById("newDineSessionArea").style.display = "none";
	document.getElementById("openNewSessionButton").style.display = "block";
}

function openOtherSettings(id){
	
	/*Tweak - Hide all */
	$( "#detailsDisplayOtherSettings" ).children().css( "display", "none" );
	$( "#detailsNewOtherSettings" ).children().css( "display", "none" );
	document.getElementById("openNewSessionButton").style.display = "block";
	document.getElementById("openNewSavedCommentButton").style.display = "block"; 
  document.getElementById("openNewCookingIngredientButton").style.display = "block";
  
	document.getElementById(id).style.display = "block";

	switch(id){
		case "dineSessions":{
			fetchAllDineSessions();
			break;
		}
		case "savedComments":{
			fetchAllSavedComments();
			break;
		}	
    case "ingredientsList":{
      fetchAllCookingIngredients();
      break;
    }           
	}
}


function openOtherDeleteConfirmation(type, functionName){
	document.getElementById("settingsDeleteConfirmationConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="cancelOtherDeleteConfirmation()" style="float: left">Cancel</button>'+
                  							'<button type="button" class="btn btn-danger" onclick="'+functionName+'(\''+type+'\')">Delete</button>';

	document.getElementById("settingsDeleteConfirmationText").innerHTML = 'Are you sure want to delete <b>'+type+'</b>?';
	document.getElementById("settingsDeleteConfirmation").style.display = 'block';
}

function cancelOtherDeleteConfirmation(){
	document.getElementById("settingsDeleteConfirmation").style.display = 'none';
}

/* read dine sessions */
function fetchAllDineSessions(){

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

              var params = data.docs[0].value;
              params.sort(); //alphabetical sorting 
              var paramsTag = '';

              for (var i=0; i<params.length; i++){
                paramsTag = paramsTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+params[i].name+'</td> <td>'+moment(params[i].startTime,"HHmm").format("hh:mm a")+'</td> <td>'+moment(params[i].endTime,"HHmm").format("hh:mm a")+'</td> <td onclick="deleteDineSessionConfirm(\''+params[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
              }

              if(!paramsTag)
                document.getElementById("dineSessionsTable").innerHTML = '<p style="color: #bdc3c7">No sessions added yet.</p>';
              else
                document.getElementById("dineSessionsTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Session</th> <th style="text-align: left">Start Time</th> <th style="text-align: left">End Time</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+paramsTag+'</tbody>';

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


/* add new dine session */
function addDineSession(optionalName, optionalStart, optionalEnd) {  

	var paramObj = {};

  if(!optionalName || optionalName == ''){
    paramObj.name = document.getElementById("add_new_dineSession_name").value;
  }
  else{
    paramObj.name = optionalName;
  }

  if(!optionalStart || optionalStart == ''){
    paramObj.startTime = document.getElementById("add_new_dineSession_from").value;
  }
  else{
    paramObj.startTime = optionalStart;
  }

  if(!optionalEnd || optionalEnd == ''){
    paramObj.endTime = document.getElementById("add_new_dineSession_to").value;
  }
  else{
    paramObj.endTime = optionalEnd;
  }


  paramObj.startTime = ((paramObj.startTime).toString()).replace (/:/g, "");
  paramObj.startTime = parseFloat(paramObj.startTime);

  paramObj.endTime = ((paramObj.endTime).toString()).replace (/:/g, "");
  paramObj.endTime = parseFloat(paramObj.endTime);
	
	if(paramObj.name == ''){
		showToast('Warning: Please set a name.', '#e67e22');
		return '';
	}
	else if(paramObj.startTime == '' || paramObj.endTime == ''){
		showToast('Warning: Please set Start Time and End Time', '#e67e22');
		return '';
	}
	else if(Number.isNaN(paramObj.startTime) || Number.isNaN(paramObj.endTime)){
		showToast('Warning: Invalid time value.', '#e67e22');
		return '';
	}	

  if(paramObj.endTime <= paramObj.startTime){
    showToast('Warning: End Time must be greater than Start Time', '#e67e22');
    return '';
  }


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_DINE_SESSIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_DINE_SESSIONS'){

             var sessionsList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<sessionsList.length; i++) {
               if (sessionsList[i].name == paramObj.name){
                  flag = 1;
                  break;
               }
             }

             if(flag == 1){
               showToast('Warning: Session Name already exists. Please set a different name.', '#e67e22');
             }
             else{

                sessionsList.push(paramObj);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_DINE_SESSIONS",
                  "value": sessionsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_DINE_SESSIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllDineSessions(); //refresh the list
                      hideNewDineSession();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
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


function deleteDineSessionConfirm(name){
	openOtherDeleteConfirmation(name, 'deleteDineSession');
}


/* delete a dine session */
function deleteDineSession(sessionName) {  


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_DINE_SESSIONS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_DINE_SESSIONS'){

               var dineSessionsList = data.docs[0].value;

               var memory_start = '';
               var memory_end = '';

               for (var i=0; i<dineSessionsList.length; i++) {  
                 if (dineSessionsList[i].name == sessionName){
                    memory_start = dineSessionsList[i].startTime;
                    memory_end = dineSessionsList[i].endTime;
                    dineSessionsList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_DINE_SESSIONS",
                  "value": dineSessionsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_DINE_SESSIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllDineSessions();

                    showUndo('Deleted', 'addDineSession(\''+sessionName+'\', \''+memory_start+'\', \''+memory_end+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
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

    cancelOtherDeleteConfirmation()

}





/*read cooking ingredients*/
function fetchAllCookingIngredients(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_COOKING_INGREDIENTS'){

              var modes = data.docs[0].value;
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<button style="margin-right: 5px" class="btn btn-outline savedCommentButton" onclick="deleteCookingIngredient(\''+modes[i]+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-minus-circle"></i></tag>'+modes[i]+'</button>';
              }

              if(!modesTag)
                document.getElementById("cookingIngredientsInfo").innerHTML = '<p style="color: #bdc3c7">No ingredient added yet.</p>';
              else
                document.getElementById("cookingIngredientsInfo").innerHTML = modesTag;            
          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}


/* add new ingredient */
function addNewCookingIngredient(optionalParameter) {  

  var commentName = '';
  if(!optionalParameter || optionalParameter == ''){
    commentName = document.getElementById("add_new_CookingIngredient_name").value;
  }
  else{
    commentName = optionalParameter;
  }
  
  if(commentName == ''){
    showToast('Warning: Please set a name', '#e67e22');
    return '';
  }


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_COOKING_INGREDIENTS'){

             var commentsList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<commentsList.length; i++) {
               if (commentsList[i] == commentName){
                  flag = 1;
                  break;
               }
             }


             if(flag == 1){
               showToast('Warning: Ingredient already exists. Please add a different name.', '#e67e22');
             }
             else{
                commentsList.push(commentName);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_COOKING_INGREDIENTS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/zaitoon_settings/ZAITOON_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ZAITOON_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_COOKING_INGREDIENTS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                      fetchAllCookingIngredients(); //refresh the list
                    
                      //not adding via  Undo function
                      if(!optionalParameter || optionalParameter == ''){
                        openNewCookingIngredient();
                      }
                  },
                  error: function(data) {
                    console.log(data)
                    showToast('System Error: Unable to update Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
  
}

/* delete ingredient */
function deleteCookingIngredient(commentName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_COOKING_INGREDIENTS'){

               var commentsList = data.docs[0].value;

               for (var i=0; i<commentsList.length; i++) {  
                 if (commentsList[i] == commentName){
                    commentsList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_COOKING_INGREDIENTS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/zaitoon_settings/ZAITOON_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ZAITOON_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_COOKING_INGREDIENTS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllCookingIngredients();

                    showUndo('Deleted', 'addNewCookingIngredient(\''+commentName+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

    cancelOtherDeleteConfirmation()
}







/* read saved comments */
function fetchAllSavedComments(){


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SAVED_COMMENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_COMMENTS'){

              var modes = data.docs[0].value;
              modes.sort(); //alphabetical sorting 
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<button style="margin-right: 5px" class="btn btn-outline savedCommentButton" onclick="deleteSavedComment(\''+modes[i]+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-minus-circle"></i></tag>'+modes[i]+'</button>';
              }

              if(!modesTag)
                document.getElementById("savedCommentsInfo").innerHTML = '<p style="color: #bdc3c7">No comments added yet.</p>';
              else
                document.getElementById("savedCommentsInfo").innerHTML = modesTag; 

          }
          else{
            showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
        }
        
      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

}




/* add new comment */
function addNewComment(optionalParameter) {  

  var commentName = '';
  if(!optionalParameter || optionalParameter == ''){
    commentName = document.getElementById("add_new_savedComment").value;
  }
  else{
    commentName = optionalParameter;
  }

	if(commentName == ''){
		showToast('Warning: Please set a name', '#e67e22');
		return '';
	}


    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SAVED_COMMENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_COMMENTS'){

             var commentsList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<commentsList.length; i++) {
               if (commentsList[i] == commentName){
                  flag = 1;
                  break;
               }
             }


             if(flag == 1){
               showToast('Warning: Comment already exists. Please add a different comment.', '#e67e22');
             }
             else{

                commentsList.push(commentName);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_SAVED_COMMENTS",
                  "value": commentsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SAVED_COMMENTS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                    fetchAllSavedComments(); //refresh the list
                    
                    //not adding via  Undo function
                    if(!optionalParameter || optionalParameter == ''){
                      openNewSavedComment();
                    }

                  },
                  error: function(data) {
                    console.log(data)
                    showToast('System Error: Unable to update Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  

             }
                
          }
          else{
            showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  
  
}

/* delete a comment */
function deleteSavedComment(commentName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ZAITOON_SAVED_COMMENTS" 
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
          if(data.docs[0].identifierTag == 'ZAITOON_SAVED_COMMENTS'){

               var commentsList = data.docs[0].value;

               for (var i=0; i<commentsList.length; i++) {  
                 if (commentsList[i] == commentName){
                    commentsList.splice(i,1);
                    break;
                 }
               }

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ZAITOON_SAVED_COMMENTS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/zaitoon_settings/ZAITOON_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ZAITOON_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'zaitoon_settings/ZAITOON_SAVED_COMMENTS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllSavedComments();

                    showUndo('Deleted', 'addNewComment(\''+commentName+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Comments data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
      }

    });  

  cancelOtherDeleteConfirmation()
}

