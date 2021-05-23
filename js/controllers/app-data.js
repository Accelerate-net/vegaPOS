
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
  $("#add_new_dineSession_name").val('');
  $("#add_new_dineSession_from").val('');
  $("#add_new_dineSession_to").val('');
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
      url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_DINE_SESSIONS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var params = result.data.value;
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
		showNotification('DATA_WARNING', 'Please set a name');
		return '';
	}
	else if(paramObj.startTime == '' || paramObj.endTime == ''){
		showNotification('DATA_WARNING', 'Please set Start Time and End Time');
		return '';
	}
	else if(Number.isNaN(paramObj.startTime) || Number.isNaN(paramObj.endTime)){
		showNotification('DATA_WARNING', 'Invalid time value');
		return '';
	}	

  if(paramObj.endTime <= paramObj.startTime){
    showNotification('DATA_WARNING', 'End Time must be greater than Start Time');
    return '';
  }

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_DINE_SESSIONS/newentry',
    data: JSON.stringify(paramObj),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllDineSessions(paramObj.name); //refresh the list
        hideNewDineSession();
      }
      else{
        showNotification('SAVE_ERROR', 'Unable to save Dine Sessions data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to save Dine Sessions data', error);
    }
  });  
}

function deleteDineSessionConfirm(name){
	openOtherDeleteConfirmation(name, 'deleteDineSession');
}

/* delete a dine session */
function deleteDineSession(sessionName) {
  var requestData = {
    'session_name' : sessionName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_DINE_SESSIONS/removeentry',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        /* on successful delete */
        fetchAllDineSessions();
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete Dine Sessions data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to make changes in Dine Sessions data', error);
    }
  });  

  cancelOtherDeleteConfirmation();
}

/*read cooking ingredients*/
function fetchAllCookingIngredients(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_COOKING_INGREDIENTS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var modes = result.data.value;
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

  commentName = commentName.trim();
  if(commentName == ''){
    showNotification('DATA_WARNING', 'Please set a name');
    return '';
  }

  var requestData = {
    'new_ingredient_name' : commentName,
  }

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_COOKING_INGREDIENTS/newentry',
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
      showNotification('SERVER_ERROR', 'Unable to save Cooking Ingredients data', error);
    }
  });    
}

/* delete ingredient */
function deleteCookingIngredient(commentName) {  

  var requestData = {
    'ingredient_name' : commentName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_COOKING_INGREDIENTS/removeentry',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        /* on successful delete */
        fetchAllCookingIngredients();

        showUndo('Deleted', 'addNewCookingIngredient(\''+commentName+'\')');
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete Cooking Ingredients data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to make changes in Cooking Ingredients data', error);
    }
  });  

  cancelOtherDeleteConfirmation();    
}

/* Fetch all cancellation reasons */
function fetchAllCancellationReasons(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_CANCELLATION_REASONS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var modes = result.data.value;
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
  
  commentName = commentName.trim();
  if(commentName == ''){
    showNotification('DATA_WARNING', 'Please set a name');
    return '';
  }

  var requestData = {
    'new_reason_name' : commentName,
  }

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_CANCELLATION_REASONS/newentry',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllCancellationReasons(commentName); //refresh the list
      
        //not adding via  Undo function
        if(!optionalParameter || optionalParameter == ''){
          openNewCancellationReason();
        }
      }
      else{
        showNotification('SAVE_ERROR', 'Unable to save Cancellation Reasons data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to save Cancellation Reasons data', error);
    }
  });  
}

/* delete reason */
function deleteCancellationReason(commentName) {  

  var requestData = {
    'reason_name' : commentName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_CANCELLATION_REASONS/removeentry',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        /* on successful delete */
        fetchAllCancellationReasons();

        showUndo('Deleted', 'addNewCancellationReason(\''+commentName+'\')');
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete Cancellation Reasons data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to make changes in Cancellation Reasons data', error);
    }
  });  

  cancelOtherDeleteConfirmation();
}

/* read saved comments */
function fetchAllSavedComments(optionalHighlighter){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_SAVED_COMMENTS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){

              var modes = result.data.value;
              //alphabetical sorting 
              modes.sort(function (a, b) {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
              });
              var modesTag = '';

              for (var i=0; i<modes.length; i++){
                modesTag = modesTag + '<button style="margin-right: 5px; min-width: 30%; text-align: left;" class="btn btn-outline savedCommentButton lastAddedItemAnimator" last-added-highlighter-key="'+modes[i]+'" onclick="deleteSavedComment(\''+modes[i]+'\')"><tag class="savedCommentButtonIcon"><i class="fa fa-minus-circle"></i></tag>'+modes[i]+'</button>';
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

  commentName = commentName.trim();
	if(commentName == ''){
		showNotification('DATA_WARNING', 'Please set a name');
		return '';
	}

  var requestData = {
    'new_comment' : commentName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_SAVED_COMMENTS/newentry',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllSavedComments(commentName); //refresh the list
        
        //not adding via  Undo function
        if(!optionalParameter || optionalParameter == ''){
          openNewSavedComment();
        }
      }
      else{
        showNotification('SAVE_ERROR', 'Unable to save Saved Comments data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to save Saved Comments data', error);
    }
  });   
}

/* delete a comment */
function deleteSavedComment(commentName) {  

  var requestData = {
    'saved_comment' : commentName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_SAVED_COMMENTS/removeentry',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        /* on successful delete */
        fetchAllSavedComments();

        showUndo('Deleted', 'addNewComment(\''+commentName+'\')');
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete Saved Comments data');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to make changes in Saved Comments data', error);
    }
  });
  cancelOtherDeleteConfirmation();
}

