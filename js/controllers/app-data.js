
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



function openNewCancellationReason(){
  document.getElementById("add_new_CancellationReason_name").value = '';
  document.getElementById("newCancellationReasonArea").style.display = "block";
  $("#add_new_CancellationReason_name").focus();
  document.getElementById("openNewCancellationReasonButton").style.display = "none";
}

function hideNewCancellationReason(){
  
  document.getElementById("newCancellationReasonArea").style.display = "none";
  document.getElementById("openNewCancellationReasonButton").style.display = "block";
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
    case "cancellationReasons":{
      fetchAllCancellationReasons();
      break;
    }     
	}
}


function openOtherDeleteConfirmation(type, functionName){
	document.getElementById("settingsDeleteConfirmationConsent").innerHTML = '<button class="btn btn-default" onclick="cancelOtherDeleteConfirmation()" style="float: left">Cancel</button>'+
                  							'<button class="btn btn-danger" onclick="'+functionName+'(\''+type+'\')">Delete</button>';

	document.getElementById("settingsDeleteConfirmationText").innerHTML = 'Are you sure want to delete <b>'+type+'</b>?';
	document.getElementById("settingsDeleteConfirmation").style.display = 'block';
}

function cancelOtherDeleteConfirmation(){
	document.getElementById("settingsDeleteConfirmation").style.display = 'none';
}

/* read dine sessions */
function fetchAllDineSessions(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/fetch/ACCELERATE_DINE_SESSIONS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var params = result.data;
              params.sort(function(a, b) {
                if(a.startTime < b.startTime) { return -1; }
                if(a.startTime > b.startTime) { return 1; }
                return 0;
              });

              var paramsTag = '';

              for (var i=0; i<params.length; i++){
                paramsTag = paramsTag + '<tr role="row" class="lastAddedItemAnimator" last-added-highlighter-key="'+params[i].name+'"> <td>#'+(i+1)+'</td> <td>'+params[i].name+'</td> <td>'+moment(params[i].startTime,"HHmm").format("hh:mm a")+'</td> <td>'+moment(params[i].endTime,"HHmm").format("hh:mm a")+'</td> <td onclick="deleteDineSessionConfirm(\''+params[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
              }

              if(!paramsTag)
                document.getElementById("dineSessionsTable").innerHTML = '<p style="color: #bdc3c7">No sessions added yet.</p>';
              else
                document.getElementById("dineSessionsTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Session</th> <th style="text-align: left">Start Time</th> <th style="text-align: left">End Time</th> <th style="text-align: left"></th> </tr> </thead>'+
                                        '<tbody>'+paramsTag+'</tbody>';

               //If adding new item, animate last added item
              if(optionalHighlighter && optionalHighlighter != ""){
                animateLastAddedItem('dineSessionsTable', optionalHighlighter);
              }
        }
        else{
          document.getElementById("dineSessionsTable").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
          showNotification('NOT_FOUND_ERROR', 'Dine Sessions data not found');
        }
      },
      error: function(error) {
        document.getElementById("dineSessionsTable").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
        showNotification('SERVER_ERROR', 'Unable to read Dine Sessions data', error);
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
  paramObj.endTime = ((paramObj.endTime).toString()).replace (/:/g, "");
	
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
                  "identifierTag": "ACCELERATE_DINE_SESSIONS",
                  "value": sessionsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_DINE_SESSIONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                      fetchAllDineSessions(paramObj.name); //refresh the list
                      hideNewDineSession();
                  },
                  error: function(data) {
                      showToast('System Error: Unable to update Dine Sessions data.', '#e74c3c');
                  }
                });  

             }
                
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


function deleteDineSessionConfirm(name){
	openOtherDeleteConfirmation(name, 'deleteDineSession');
}


/* delete a dine session */
function deleteDineSession(sessionName) {  


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
                  "identifierTag": "ACCELERATE_DINE_SESSIONS",
                  "value": dineSessionsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_DINE_SESSIONS/',
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
                    showToast('System Error: Unable to make changes in Dine Sessions data.', '#e74c3c');
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

    cancelOtherDeleteConfirmation()

}





/*read cooking ingredients*/
function fetchAllCookingIngredients(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/fetch/ACCELERATE_COOKING_INGREDIENTS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var modes = result.data;
              //alphabetical sorting 
              modes.sort(function (a, b) {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
              });
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<button style="margin-right: 5px; width: 45%; text-align: left; padding: 5px;" class="btn btn-outline savedCommentButton lastAddedItemAnimator" last-added-highlighter-key="'+modes[i]+'" onclick="deleteCookingIngredient(\''+modes[i]+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-minus-circle"></i></tag>'+modes[i]+'</button>';
              }

              if(!modesTag)
                document.getElementById("cookingIngredientsInfo").innerHTML = '<p style="color: #bdc3c7">No ingredient added yet.</p>';
              else
                document.getElementById("cookingIngredientsInfo").innerHTML = modesTag;

              //If adding new item, animate last added item
              if(optionalHighlighter && optionalHighlighter != ""){
                animateLastAddedItem('cookingIngredientsInfo', optionalHighlighter);
              }
        }
        else{
          document.getElementById("cookingIngredientsInfo").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
          showNotification('NOT_FOUND_ERROR', 'Cooking Ingredients data not found');
        }
      },
      error: function(error) {
        document.getElementById("cookingIngredientsInfo").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
        showNotification('SERVER_ERROR', 'Unable to read Cooking Ingredients data', error);
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
    'new_ingredient_name' : commentName,
  }

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/new/ACCELERATE_COOKING_INGREDIENTS',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllCookingIngredients(commentName); //refresh the list
      
        //not adding via  Undo function
        if(!optionalParameter || optionalParameter == ''){
          openNewCookingIngredient();
        }
      }
      else{
        showNotification('SAVE_ERROR', 'Unable to save Cooking Ingredients data');
      }
    },
    error: function(error) {
      if(error.responseJSON.data){
        showNotification('SERVER_ERROR', error.responseJSON.data, error);
      }
      else{
        showNotification('SERVER_ERROR', 'Unable to save Cooking Ingredients data', error);
      }
    }
  });    
}

/* delete ingredient */
function deleteCookingIngredient(commentName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_COOKING_INGREDIENTS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_COOKING_INGREDIENTS'){

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
                  "identifierTag": "ACCELERATE_COOKING_INGREDIENTS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/accelerate_settings/ACCELERATE_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ACCELERATE_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_COOKING_INGREDIENTS/',
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
                    showToast('System Error: Unable to make changes in Cooking Ingredients data.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Cooking Ingredients data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cooking Ingredients data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Cooking Ingredients data.', '#e74c3c');
      }

    });  

    cancelOtherDeleteConfirmation()
}


/* Fetch all cancellation reasons */
function fetchAllCancellationReasons(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/fetch/ACCELERATE_CANCELLATION_REASONS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var modes = result.data;
              //alphabetical sorting 
              modes.sort(function (a, b) {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
              });
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<button style="width: 90%; text-align: left;" class="btn btn-outline savedCommentButton lastAddedItemAnimator" last-added-highlighter-key="'+modes[i]+'" onclick="deleteCancellationReason(\''+modes[i]+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-minus-circle"></i></tag>'+modes[i]+'</button>';
              }

              if(!modesTag)
                document.getElementById("cancellationReasonInfo").innerHTML = '<p style="color: #bdc3c7">No reasons added yet.</p>';
              else
                document.getElementById("cancellationReasonInfo").innerHTML = modesTag;    
        
              //If adding new item, animate last added item
              if(optionalHighlighter && optionalHighlighter != ""){
                animateLastAddedItem('cancellationReasonInfo', optionalHighlighter);
              }
        }
        else{
          document.getElementById("cancellationReasonInfo").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
          showNotification('NOT_FOUND_ERROR', 'Cancellation Reasons data not found');
        }
      },
      error: function(error) {
        document.getElementById("cancellationReasonInfo").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
        showNotification('SERVER_ERROR', 'Unable to read Cancellation Reasons data', error);
      }
    });
}


/* add new reason */
function addNewCancellationReason(optionalParameter) {  

  var commentName = '';
  if(!optionalParameter || optionalParameter == ''){
    commentName = document.getElementById("add_new_CancellationReason_name").value;
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
                    "identifierTag": "ACCELERATE_CANCELLATION_REASONS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_CANCELLATION_REASONS'){

             var commentsList = data.docs[0].value;
             var flag = 0;

             for (var i=0; i<commentsList.length; i++) {
               if (commentsList[i] == commentName){
                  flag = 1;
                  break;
               }
             }


             if(flag == 1){
               showToast('Warning: Reason already exists. Please add a different name.', '#e67e22');
             }
             else{
                commentsList.push(commentName);

                //Update
                var updateData = {
                  "_rev": data.docs[0]._rev,
                  "identifierTag": "ACCELERATE_CANCELLATION_REASONS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/accelerate_settings/ACCELERATE_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ACCELERATE_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_CANCELLATION_REASONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                      fetchAllCancellationReasons(commentName); //refresh the list
                    
                      //not adding via  Undo function
                      if(!optionalParameter || optionalParameter == ''){
                        openNewCancellationReason();
                      }
                  },
                  error: function(data) {
                     
                    showToast('System Error: Unable to update Cancellation Reasons data.', '#e74c3c');
                  }

                });  

             }
                
          }
          else{
            showToast('Not Found Error: Cancellation Reasons data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cancellation Reasons data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Cancellation Reasons data.', '#e74c3c');
      }

    });  
  
}

/* delete reason */
function deleteCancellationReason(commentName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_CANCELLATION_REASONS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_CANCELLATION_REASONS'){

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
                  "identifierTag": "ACCELERATE_CANCELLATION_REASONS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/accelerate_settings/ACCELERATE_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ACCELERATE_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_CANCELLATION_REASONS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {
                    /* on successful delete */
                    fetchAllCancellationReasons();

                    showUndo('Deleted', 'addNewCancellationReason(\''+commentName+'\')');
                  },
                  error: function(data) {
                    showToast('System Error: Unable to make changes in Cancellation Reasons data.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Cancellation Reasons data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Cancellation Reasons data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Cancellation Reasons data.', '#e74c3c');
      }

    });  

    cancelOtherDeleteConfirmation()
}






/* read saved comments */
function fetchAllSavedComments(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/fetch/ACCELERATE_SAVED_COMMENTS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){

              var modes = result.data;
              //alphabetical sorting 
              modes.sort(function (a, b) {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
              });
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<button style="margin-right: 5px" class="btn btn-outline savedCommentButton lastAddedItemAnimator" last-added-highlighter-key="'+modes[i]+'" onclick="deleteSavedComment(\''+modes[i]+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-minus-circle"></i></tag>'+modes[i]+'</button>';
              }

              if(!modesTag)
                document.getElementById("savedCommentsInfo").innerHTML = '<p style="color: #bdc3c7">No comments added yet.</p>';
              else
                document.getElementById("savedCommentsInfo").innerHTML = modesTag; 
        
              //If adding new item, animate last added item
              if(optionalHighlighter && optionalHighlighter != ""){
                animateLastAddedItem('savedCommentsInfo', optionalHighlighter);
              }
        }
        else{
          document.getElementById("savedCommentsInfo").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
          showNotification('NOT_FOUND_ERROR', 'Saved Comments data not found');
        }
      },
      error: function(error) {
        document.getElementById("savedCommentsInfo").innerHTML = '<p style="color: #bdc3c7">Unable to load the content. Please try again.</p>';
        showNotification('SERVER_ERROR', 'Unable to read Saved Comments data', error);
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
                    "identifierTag": "ACCELERATE_SAVED_COMMENTS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_COMMENTS'){

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
                  "identifierTag": "ACCELERATE_SAVED_COMMENTS",
                  "value": commentsList
                }

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SAVED_COMMENTS/',
                  data: JSON.stringify(updateData),
                  contentType: "application/json",
                  dataType: 'json',
                  timeout: 10000,
                  success: function(data) {

                    fetchAllSavedComments(commentName); //refresh the list
                    
                    //not adding via  Undo function
                    if(!optionalParameter || optionalParameter == ''){
                      openNewSavedComment();
                    }

                  },
                  error: function(data) {
                     
                    showToast('System Error: Unable to update Saved Comments data.', '#e74c3c');
                  }

                });  

             }
                
          }
          else{
            showToast('Not Found Error: Saved Comments data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Comments data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Comments data.', '#e74c3c');
      }

    });  
  
}

/* delete a comment */
function deleteSavedComment(commentName) {  

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_SAVED_COMMENTS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_SAVED_COMMENTS'){

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
                  "identifierTag": "ACCELERATE_SAVED_COMMENTS",
                  "value": commentsList
                }


                //curl -X PUT http://admin:admin@127.0.0.1:5984/accelerate_settings/ACCELERATE_COOKING_INGREDIENTS -d "{ \"identifierTag\":\"ACCELERATE_COOKING_INGREDIENTS\", \"value\": [\"single\", \"double\"], \"_rev\": \"5-c473c61cde88000585e8576c5c8e8f13\" }"

                $.ajax({
                  type: 'PUT',
                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_SAVED_COMMENTS/',
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
                    showToast('System Error: Unable to make changes in Saved Comments data.', '#e74c3c');
                  }

                });  
                
          }
          else{
            showToast('Not Found Error: Saved Comments data not found.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Saved Comments data not found.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Saved Comments data.', '#e74c3c');
      }

    });  

  cancelOtherDeleteConfirmation()
}

