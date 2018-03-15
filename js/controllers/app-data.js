
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

		if(fs.existsSync('./data/static/dinesessions.json')) {
	      fs.readFile('./data/static/dinesessions.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var params = JSON.parse(data);
	          	params.sort(); //alphabetical sorting 
	          	var paramsTag = '';

				for (var i=0; i<params.length; i++){
					paramsTag = paramsTag + '<tr role="row"> <td>#'+(i+1)+'</td> <td>'+params[i].name+'</td> <td>'+moment(params[i].startTime,"HHmm").format("HH:mm a")+'</td> <td>'+moment(params[i].endTime,"HHmm").format("hh:mm a")+'</td> <td onclick="deleteDineSessionConfirm(\''+params[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
				}

				if(!paramsTag)
					document.getElementById("dineSessionsTable").innerHTML = '<p style="color: #bdc3c7">No sessions added yet.</p>';
				else
					document.getElementById("dineSessionsTable").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left"></th> <th style="text-align: left">Session</th> <th style="text-align: left">Time From</th> <th style="text-align: left">Time To</th> <th style="text-align: left"></th> </tr> </thead>'+
																	'<tbody>'+paramsTag+'</tbody>';
		}
		});
	    } else {
	      showToast('System Error: Unable to read Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
	    }	
}


/* add new dine session */
function addDineSession() {  

	var paramObj = {};
	paramObj.name = document.getElementById("add_new_dineSession_name").value;
	paramObj.startTime = document.getElementById("add_new_dineSession_from").value;
  paramObj.endTime = document.getElementById("add_new_dineSession_to").value;

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

      //Check if file exists
      if(fs.existsSync('./data/static/dinesessions.json')) {
         fs.readFile('./data/static/dinesessions.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(paramObj); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/dinesessions.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllDineSessions(); //refresh the list
                hideNewDineSession();

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i].name == paramObj.name){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Parameter already exists. Please choose a different name.', '#e67e22');
             }
             else{
                obj.push(paramObj);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/dinesessions.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
                    }
		            else{
			                fetchAllDineSessions(); //refresh the list
			                hideNewDineSession();
		              	
		              }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(paramObj);
         fs.writeFile('./data/static/dinesessions.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllDineSessions(); //refresh the list
                hideNewDineSession();         	
           }
         });
      }
  
}


function deleteDineSessionConfirm(name){
	openOtherDeleteConfirmation(name, 'deleteDineSession');
}


/* delete a dine session */
function deleteDineSession(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/dinesessions.json')) {
       fs.readFile('./data/static/dinesessions.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
       } else {
       	if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i].name == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/dinesessions.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
        
        	/* on successful delete */
   			  fetchAllDineSessions();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Dine Sessions data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelOtherDeleteConfirmation()

}





/*read cooking ingredients*/
function fetchAllCookingIngredients(){

    if(fs.existsSync('./data/static/cookingingredients.json')) {
        fs.readFile('./data/static/cookingingredients.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var modes = JSON.parse(data);
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
    });
      } else {
        showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
      } 
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

     //Check if file exists
      if(fs.existsSync('./data/static/cookingingredients.json')) {
         fs.readFile('./data/static/cookingingredients.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(commentName); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/cookingingredients.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllCookingIngredients(); //refresh the list
                
                //not adding via  Undo function
                if(!optionalParameter || optionalParameter == ''){
                  openNewCookingIngredient();
                }

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i] == commentName){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Comment already exists. Please add a different comment.', '#e67e22');
             }
             else{
                obj.push(commentName);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/cookingingredients.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
                    }
                else{
                      fetchAllCookingIngredients(); //refresh the list
                      

                      //not adding via  Undo function
                      if(!optionalParameter || optionalParameter == ''){
                        openNewCookingIngredient();
                      }
                    
                  }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(commentName);
         fs.writeFile('./data/static/cookingingredients.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllCookingIngredients(); //refresh the list
                
                //not adding via  Undo function
                if(!optionalParameter || optionalParameter == ''){
                  openNewCookingIngredient();
                }         
           }
         });
      }
  
}

/* delete ingredient */
function deleteCookingIngredient(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/cookingingredients.json')) {
       fs.readFile('./data/static/cookingingredients.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
       } else {
        if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i] == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/cookingingredients.json', newjson, 'utf8', (err) => {
         if(err){
            showToast('System Error: Unable to make changes in Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
         }
         else{
          /* on successful delete */
          fetchAllCookingIngredients();

          showUndo('Deleted', 'addNewCookingIngredient(\''+name+'\')');

         }
          
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Cooking Ingredients data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelOtherDeleteConfirmation()

}







/* read saved comments */
function fetchAllSavedComments(){

		if(fs.existsSync('./data/static/savedcomments.json')) {
	      fs.readFile('./data/static/savedcomments.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
	    } else {

	    		if(data == ''){ data = '[]'; }

	          	var modes = JSON.parse(data);
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
		});
	    } else {
	      showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
	    }	
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

     //Check if file exists
      if(fs.existsSync('./data/static/savedcomments.json')) {
         fs.readFile('./data/static/savedcomments.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(commentName); //add some data
            var json = JSON.stringify(obj);
            fs.writeFile('./data/static/savedcomments.json', json, 'utf8', (err) => {
                if(err){
                  showToast('System Error: Unable to save Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
              }
              else{

                fetchAllSavedComments(); //refresh the list
                
                //not adding via  Undo function
                if(!optionalParameter || optionalParameter == ''){
                  openNewSavedComment();
                }

              }
            });
         }
         else{
             var flag=0;
             if(data == ''){ data = '[]'; }
             var obj = [];
             obj = JSON.parse(data);
             for (var i=0; i<obj.length; i++) {
               if (obj[i] == commentName){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Comment already exists. Please add a different comment.', '#e67e22');
             }
             else{
                obj.push(commentName);
                var json = JSON.stringify(obj);
                fs.writeFile('./data/static/savedcomments.json', json, 'utf8', (err) => {
                     if(err){
                        showToast('System Error: Unable to save Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
                    }
		            else{
			                fetchAllSavedComments(); //refresh the list
			                

                      //not adding via  Undo function
                      if(!optionalParameter || optionalParameter == ''){
                        openNewSavedComment();
                      }
		              	
		              }
                  });  

             }
                 
         }
          
   }});
      } else {
         obj.push(commentName);
         fs.writeFile('./data/static/savedcomments.json', obj, 'utf8', (err) => {
            if(err){
               showToast('System Error: Unable to save Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
           }
           else{
                fetchAllSavedComments(); //refresh the list
                
                //not adding via  Undo function
                if(!optionalParameter || optionalParameter == ''){
                  openNewSavedComment();
                }       	
           }
         });
      }
  
}

/* delete a comment */
function deleteSavedComment(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/savedcomments.json')) {
       fs.readFile('./data/static/savedcomments.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
       } else {
       	if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i] == name){
            obj.splice(i,1);
            break;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/savedcomments.json', newjson, 'utf8', (err) => {
         if(err){
            showToast('System Error: Unable to make changes in Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
         }
         else{
          /* on successful delete */
          fetchAllSavedComments();

          showUndo('Deleted', 'addNewComment(\''+name+'\')');

         }
        	
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Saved Comments data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelOtherDeleteConfirmation()

}

