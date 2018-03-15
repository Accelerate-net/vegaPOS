
function openNewTableModal(){

  /*Render Sections dropdown*/
  var table_sections = window.localStorage.tableSections ?  JSON.parse(window.localStorage.tableSections) : [];
  if(table_sections.length > 0){

    var i = 0;
    var optionsList = '';
    while(table_sections[i]){
      if(i == 0)
        optionsList = optionsList + '<option value="'+table_sections[i]+'" selected="selected">'+table_sections[i]+'</option>';
      else
        optionsList = optionsList + '<option value="'+table_sections[i]+'">'+table_sections[i]+'</option>';

      i++;
    }

    document.getElementById("add_new_table_type").innerHTML = optionsList;

    document.getElementById("newTableModal").style.display = "block";
    $("#add_new_table_name").focus();
    document.getElementById("openNewTableButton").style.display = "none";
  }
  else{
    fetchAllTableSections(); /*Tweak*/
  }
}

function hideNewTableModal(){
  document.getElementById("newTableModal").style.display = "none";
  document.getElementById("openNewTableButton").style.display = "block";
}


function openNewTableSectionModal(){
  document.getElementById("newTableSectionModal").style.display = "block";
  $("#add_new_tableSection_name").focus();
  document.getElementById("openNewTableSectionButton").style.display = "none";
}

function hideNewTableSectionModal(){
  document.getElementById("newTableSectionModal").style.display = "none";
  document.getElementById("openNewTableSectionButton").style.display = "block";
}

function fetchAllTables(){
    if(fs.existsSync('./data/static/tables.json')) {
        fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var table = JSON.parse(data);
              table.sort(); //alphabetical sorting 
              var tablesList = '';

        for (var i=0; i<table.length; i++){
          tablesList = tablesList + '<tr role="row"> <td>'+table[i].name+'</td> <td>'+table[i].type+'</td> <td>'+table[i].capacity+'</td> <td onclick="deleteSingleTableConsent(\''+table[i].name+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
        }

        if(!tablesList)
          document.getElementById("allTablesList").innerHTML = '<p style="color: #bdc3c7">No Table added yet.</p>';
        else
          document.getElementById("allTablesList").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">Table</th> <th style="text-align: left">Section</th> <th style="text-align: left">Capacity</th> <th style="text-align: left"></th> </tr> </thead> <tbody>'+
                                  '<tbody>'+tablesList+'</tbody>';
    }
    });
      } else {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      } 
}


function fetchAllTableSections(){
    if(fs.existsSync('./data/static/tablesections.json')) {
        fs.readFile('./data/static/tablesections.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var table = JSON.parse(data);
              table.sort(); //alphabetical sorting 
              var tablesList = '';

        for (var i=0; i<table.length; i++){
          tablesList = tablesList + '<tr> <th style="text-align: left">#'+(i+1)+'</th><th style="text-align: left">'+table[i]+'</th> <th style="text-align: left" onclick="deleteSingleTableSectionConsent(\''+table[i]+'\')"> <i class="fa fa-trash-o"></i> </th> </tr>';
        }

        if(!tablesList){
          document.getElementById("openNewTableButton").style.display = "none"; /* Tweak */
          document.getElementById("allTableSectionList").innerHTML = '<p style="color: #bdc3c7">No Table Section added yet.</p>';
        }
        else{
          window.localStorage.tableSections = JSON.stringify(table);
          document.getElementById("openNewTableButton").style.display = "block"; /* Tweak */
          document.getElementById("allTableSectionList").innerHTML = '<thead style="background: #f4f4f4;">'+tablesList+'</thead>';
        }
    }
    });
      } else {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      } 
}



function openTableDeleteConfirmation(type, functionName, warning){
  document.getElementById("tableDeleteConfirmationConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="cancelTableDeleteConfirmation()" style="float: left">Cancel</button>'+
                                '<button type="button" class="btn btn-danger" onclick="'+functionName+'(\''+type+'\')">Delete</button>';

  document.getElementById("tableDeleteConfirmationText").innerHTML = (warning ? warning+' ' : '' )+'Are you sure want to delete <b>'+type+'</b>?';
  document.getElementById("tableDeleteConfirmation").style.display = 'block';
}

function cancelTableDeleteConfirmation(){
  document.getElementById("tableDeleteConfirmation").style.display = 'none';
}




function deleteSingleTableConsent(name){
  openTableDeleteConfirmation(name, 'deleteSingleTable');
}


/* delete a table */
function deleteSingleTable(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/tables.json')) {
       fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
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
       fs.writeFile('./data/static/tables.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Tables data. Please contact Accelerate Support.', '#e74c3c');
        
          /* on successful delete */
          fetchAllTables();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Tables data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelTableDeleteConfirmation()
}


function deleteSingleTableSectionConsent(name){
  openTableDeleteConfirmation(name, 'deleteSingleTableSection', 'All the Tables mapped to the Section <b>'+name+'</b> will also get deleted.');
}


/* delete a table section */
function deleteSingleTableSection(name) {  

   //Check if file exists
   if(fs.existsSync('./data/static/tablesections.json')) {
       fs.readFile('./data/static/tablesections.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
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
       fs.writeFile('./data/static/tablesections.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Tables data. Please contact Accelerate Support.', '#e74c3c');
        

          /* on successful delete */
          fetchAllTableSections();
          deleteAllMappedTables(name);
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Tables data. Please contact Accelerate Support.', '#e74c3c');
   }

   cancelTableDeleteConfirmation()
}

function deleteAllMappedTables(name){

   //Check if file exists
   if(fs.existsSync('./data/static/tables.json')) {
       fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
       } else {
        if(data == ''){ data = '[]'; }
       var obj = JSON.parse(data); //now it an object
       for (var i=0; i<obj.length; i++) {  
         if (obj[i].type == name){
            obj.splice(i,1);
            i--;
         }
       }
       var newjson = JSON.stringify(obj);
       fs.writeFile('./data/static/tables.json', newjson, 'utf8', (err) => {
         if(err)
            showToast('System Error: Unable to make changes in Tables data. Please contact Accelerate Support.', '#e74c3c');
        
          /* on successful delete */
          fetchAllTables();
       }); 
      }});
   } else {
      showToast('System Error: Unable to modify Tables data. Please contact Accelerate Support.', '#e74c3c');
   }
 
}


function addNewTableSection(){
   
   var sectionName = document.getElementById("add_new_tableSection_name").value;
  
   if(sectionName == ''){ 
      showToast('Warning: Please set a name', '#e67e22');
      return '';
   }
   else{ 
      //Check if file exists
      if(fs.existsSync('./data/static/tablesections.json')) {
         fs.readFile('./data/static/tablesections.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(sectionName); //add some data
             var json = JSON.stringify(obj); //convert it back to json
             fs.writeFile('./data/static/tablesections.json', json, 'utf8', (err) => {
                  if(err)
                     showToast('System Error: Unable to modify Table Sections data. Please contact Accelerate Support.', '#e74c3c');
                  hideNewTableSectionModal();
                  fetchAllTableSections();
               });
         }
         else{
             var flag=0;
             var obj = JSON.parse(data); //now it an object
             for (var i=0; i<obj.length; i++) {
               if (obj[i] == sectionName){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Table Section already exists. Please choose a different name.', '#e67e22');
             }
             else{
                obj.push(sectionName); //add some data
                var json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('./data/static/tablesections.json', json, 'utf8', (err) => {
                     if(err)
                        showToast('System Error: Unable to modify Table Section data. Please contact Accelerate Support.', '#e74c3c');
                      hideNewTableSectionModal();
                      fetchAllTableSections();
                });  
             }
                 
         }
          
   }});
      } else {
         
         obj.push(sectionName);
         var json = JSON.stringify(obj);
         fs.writeFile('./data/static/tablesections.json', json, 'utf8', (err) => {
            if(err)
               showToast('System Error: Unable to modify Table Section data. Please contact Accelerate Support.', '#e74c3c');
            hideNewTableSectionModal();
            fetchAllTableSections();
         });
      }
   }  


}


function addNewTable() {  
   
  var paramObj = {};
  paramObj.name = document.getElementById("add_new_table_name").value;
  paramObj.capacity = document.getElementById("add_new_table_capacity").value;
  paramObj.type = document.getElementById("add_new_table_type").value;

  paramObj.capacity = parseFloat(paramObj.capacity);

  if(Number.isNaN(paramObj.capacity)){
    showToast('Warning: Invalid Capacity value. It has to be a Number.', '#e67e22');
    return '';
  } 

   if(paramObj.name == '') {
      showToast('Warning: Please set a name', '#e67e22');
      return '';
   }
   else if(paramObj.type == ''){
      showToast('Warning: Table Section is missing', '#e67e22');
      return '';    
   }
   else{ 
      //Check if file exists
      if(fs.existsSync('./data/static/tables.json')) {
         fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
       if (err){
           showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
       } else {
         if(data==""){
            var obj = []
            obj.push(paramObj); //add some data
             var json = JSON.stringify(obj); //convert it back to json
             fs.writeFile('./data/static/tables.json', json, 'utf8', (err) => {
                  if(err)
                     showToast('System Error: Unable to modify Tables data. Please contact Accelerate Support.', '#e74c3c');
                      
                      hideNewTableModal();
                      fetchAllTables();
               });
         }
         else{
             var flag=0;
             var obj = JSON.parse(data); //now it an object
             for (i=0; i<obj.length; i++) {
               if (obj[i].name == paramObj.name){
                  flag=1;
                  break;
               }
             }
             if(flag==1){
               showToast('Warning: Table Name already exists. Please choose a different name.', '#e67e22');
             }
             else{
                obj.push(paramObj); //add some data
                var json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('./data/static/tables.json', json, 'utf8', (err) => {
                     if(err)
                        showToast('System Error: Unable to modify Tables data. Please contact Accelerate Support.', '#e74c3c');
                      
                      hideNewTableModal();
                      fetchAllTables();
                });  
             }
                 
         }
          
   }});
      } else {
         
         obj.push(paramObj);
         var json = JSON.stringify(obj);
         fs.writeFile('./data/static/tables.json', json, 'utf8', (err) => {
            if(err)
               showToast('System Error: Unable to modify Tables data. Please contact Accelerate Support.', '#e74c3c');
        
                      hideNewTableModal();
                      fetchAllTables();
         });
      }
   }
}


function deleteAll(){
   fs.unlinkSync('./data/static/tables.json');
}



//fetchAll()

//addTable("Table-","T4","4","Normal")