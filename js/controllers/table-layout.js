
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

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/all/',
      timeout: 10000,
      success: function(data) {
        if(data.total_rows > 0){

              var tableData = data.rows;
              tableData.sort(function(obj1, obj2) {
                return obj1.key - obj2.key; //Key is equivalent to sortIndex
              });
               

              var tablesList = '';

              for (var i=0; i<tableData.length; i++){
                tablesList = tablesList + '<tr role="row"> <td>'+tableData[i].value.sortIndex+'</td> <td>'+(tableData[i].value.status == 0 ? '<i class="fa fa-circle" style="color: #2ecc71; padding-right: 7px; font-size: 75%; position: relative; top: -1px;"></i></i>' : (tableData[i].value.status == 1 ? '<i class="fa fa-circle" style="color: #e74c3c; padding-right: 7px; font-size: 75%; position: relative; top: -1px;"></i></i>' : '<i class="fa fa-circle" style="color: #ecaa40; padding-right: 7px; font-size: 75%; position: relative; top: -1px;"></i></i>'))+'<b style="font-size: 120%">'+tableData[i].value.table+'</b></td> <td style="text-align: center">'+tableData[i].value.type+'</td> <td style="text-align: center">'+tableData[i].value.capacity+'</td> <td onclick="deleteSingleTableConsent(\''+tableData[i].value.table+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
              }

              document.getElementById("allTablesList").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">Index</th> <th style="text-align: left">Table</th> <th style="text-align: center">Section</th> <th style="text-align: center">Capacity</th> <th style="text-align: left"></th> </tr> </thead> <tbody>'+
                                        '<tbody>'+tablesList+'</tbody>';         
        }
        else{
          document.getElementById("allTablesList").innerHTML = '<p style="color: #bdc3c7">No Table added yet.</p>';
        }
      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });
}


function fetchAllTableSections(){

    var requestData = {
      "selector"  :{ 
                    "identifierTag": "ACCELERATE_TABLE_SECTIONS" 
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
          if(data.docs[0].identifierTag == 'ACCELERATE_TABLE_SECTIONS'){

              var table = data.docs[0].value;
              table.sort();

              var tablesList = '';

              for (var i=0; i<table.length; i++){
                tablesList = tablesList + '<tr> <td style="text-align: left">#'+(i+1)+'</td><td style="text-align: left">'+table[i]+'</td> <td style="text-align: center; cursor: pointer" onclick="deleteSingleTableSectionConsent(\''+table[i]+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
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
          else{
            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
          }
        }
        else{
          showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

}



function openTableDeleteConfirmation(type, functionName, warning){
  document.getElementById("tableDeleteConfirmationConsent").innerHTML = '<button  class="btn btn-default" onclick="cancelTableDeleteConfirmation()" style="float: left">Cancel</button>'+
                                '<button  class="btn btn-danger" onclick="'+functionName+'(\''+type+'\')">Delete</button>';

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

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbyname?startkey=["'+name+'"]&endkey=["'+name+'"]',
      timeout: 10000,
      success: function(data) {
        if(data.rows.length == 1){

              var tableData = data.rows[0].value;

              var remember_id = null;
              var remember_rev = null;

              if(tableData.table == name){

                if(tableData.status != 0){
                  showToast('Warning: Table <b>'+name+'</b> is not free. Free the Table and try again.', '#e67e22');
                  return '';
                }

                remember_id = tableData._id;
                remember_rev = tableData._rev;

                  //Delete
                  $.ajax({
                    type: 'DELETE',
                    url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/'+remember_id+'?rev='+remember_rev,
                    contentType: "application/json",
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data) {
                      fetchAllTables();
                    },
                    error: function(data) {
                      showToast('Server Warning: Unable to modify Tables data. Please contact Accelerate Support.', '#e67e22');
                    }
                  }); 

              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

    cancelTableDeleteConfirmation()
}


function deleteSingleTableSectionConsent(name){
  openTableDeleteConfirmation(name, 'deleteSingleTableSection', 'All the Tables mapped to the Section <b>'+name+'</b> will also get deleted.');
}


/* delete a table section */
function deleteSingleTableSection(sectionName) {  

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/all/',
      timeout: 10000,
      success: function(data) {
        if(data.total_rows > 0){

              var tableData = data.rows;

              var allFreeTables = true;
              
              if(tableData.length == 0){ //There are no tables added under this
                    
                    //Now proceed to delete
                    var requestData = {
                      "selector"  :{ 
                                    "identifierTag": "ACCELERATE_TABLE_SECTIONS" 
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
                          if(data.docs[0].identifierTag == 'ACCELERATE_TABLE_SECTIONS'){

                              var sections = data.docs[0].value;
                              for (var i=0; i<sections.length; i++) {  
                                if (sections[i] == sectionName){
                                  sections.splice(i,1);
                                  break;
                                }
                              }
                                
                              //Update
                              var updateData = {
                                "_rev": data.docs[0]._rev,
                                "identifierTag": "ACCELERATE_TABLE_SECTIONS",
                                "value": sections
                              }

                              $.ajax({
                                type: 'PUT',
                                url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_TABLE_SECTIONS/',
                                data: JSON.stringify(updateData),
                                contentType: "application/json",
                                dataType: 'json',
                                timeout: 10000,
                                success: function(data) {
                                  fetchAllTableSections();
                                  return '';
                                },
                                error: function(data) {
                                  showToast('System Error: Unable to update Table Sections data. Please contact Accelerate Support.', '#e74c3c');
                                }

                              });  

                          }
                          else{
                            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
                          }
                        }
                        else{
                          showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
                        }

                      },
                      error: function(data) {
                        showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
                      }

                    });     

              }
              else{ //tables added part

                for (var i=0; i<tableData.length; i++) {

                   if (tableData[i].value.type == sectionName){
                      if(tableData[i].value.status != 0){
                        allFreeTables = false;
                        showToast('Warning: Some tables under this Section are not free. Free those Tables to continue.', '#e67e22');
                        return '';
                      }
                   }

                   if((i == tableData.length - 1) && allFreeTables){
                      
                      //Now proceed to delete
                      var requestData = {
                        "selector"  :{ 
                                      "identifierTag": "ACCELERATE_TABLE_SECTIONS" 
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
                            if(data.docs[0].identifierTag == 'ACCELERATE_TABLE_SECTIONS'){

                                var sections = data.docs[0].value;
                                for (var i=0; i<sections.length; i++) {  
                                  if (sections[i] == sectionName){
                                    sections.splice(i,1);
                                    break;
                                  }
                                }
                                  
                                //Update
                                var updateData = {
                                  "_rev": data.docs[0]._rev,
                                  "identifierTag": "ACCELERATE_TABLE_SECTIONS",
                                  "value": sections
                                }

                                $.ajax({
                                  type: 'PUT',
                                  url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_TABLE_SECTIONS/',
                                  data: JSON.stringify(updateData),
                                  contentType: "application/json",
                                  dataType: 'json',
                                  timeout: 10000,
                                  success: function(data) {
                                    fetchAllTableSections();
                                    deleteAllMappedTables(sectionName)
                                  },
                                  error: function(data) {
                                    showToast('System Error: Unable to update Table Sections data. Please contact Accelerate Support.', '#e74c3c');
                                  }

                                });  

                            }
                            else{
                              showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
                            }
                          }
                          else{
                            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
                          }

                        },
                        error: function(data) {
                          showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
                        }

                      });                 

                   } //enf IF

                 } //end FOR

              } //end Else (tables added part)
        }
        else{
          showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

    cancelTableDeleteConfirmation()
}






function deleteAllMappedTables(sectionName){

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/filterbysection?startkey=["'+sectionName+'"]&endkey=["'+sectionName+'"]',
      timeout: 10000,
      success: function(data) {

        if(data.rows.length > 0){

              var tableData = data.rows;

              var index = 0;
              processTable(0);

              function processTable(index){

                  if(index == tableData.length){ //last iteration
                    fetchAllTables();
                    return "";
                  }

                  var remember_id = tableData[index].value._id;
                  var remember_rev = tableData[index].value._rev;

                  //Delete
                  $.ajax({
                    type: 'DELETE',
                    url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/'+remember_id+'?rev='+remember_rev,
                    contentType: "application/json",
                    dataType: 'json',
                    timeout: 10000,
                    success: function(data) {
                      processTable(index + 1);
                    },
                    error: function(data) {
                      processTable(index + 1);
                      showToast('Server Warning: Unable to modify Tables data. Please contact Accelerate Support.', '#e67e22');
                    }
                  });
              }
        }
        else{
          showToast('Not Found Error: There are no Tables mapped to this Section. Please contact Accelerate Support.', '#e74c3c');
        }

      },
      error: function(data) {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      }

    });

}


function addNewTableSection(){
   
   var sectionName = document.getElementById("add_new_tableSection_name").value;
  
   if(sectionName == ''){ 
      showToast('Warning: Please set a name', '#e67e22');
      return '';
   }
   else{ 


      var requestData = {
        "selector"  :{ 
                      "identifierTag": "ACCELERATE_TABLE_SECTIONS" 
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
            if(data.docs[0].identifierTag == 'ACCELERATE_TABLE_SECTIONS'){

                var table = data.docs[0].value;

                if(table == []){
                  table.push(sectionName);
                }
                else{

                 var isAlreadyThere = false;

                 for (var i=0; i<table.length; i++) {
                   if (table[i] == sectionName){
                      isAlreadyThere = true;
                      break;
                   }
                 }

                 if(isAlreadyThere){
                   showToast('Warning: Table Section already exists. Please choose a different name.', '#e67e22');
                 }
                 else{

                    table.push(sectionName);

                    //Update
                    var updateData = {
                      "_rev": data.docs[0]._rev,
                      "identifierTag": "ACCELERATE_TABLE_SECTIONS",
                      "value": table
                    }

                    $.ajax({
                      type: 'PUT',
                      url: COMMON_LOCAL_SERVER_IP+'accelerate_settings/ACCELERATE_TABLE_SECTIONS/',
                      data: JSON.stringify(updateData),
                      contentType: "application/json",
                      dataType: 'json',
                      timeout: 10000,
                      success: function(data) {
                        hideNewTableSectionModal();
                        fetchAllTableSections();
                      },
                      error: function(data) {
                        showToast('System Error: Unable to update Table Sections data. Please contact Accelerate Support.', '#e74c3c');
                      }

                    });  

                 }
                     
              }
                  
            }
            else{
              showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
            }
          }
          else{
            showToast('Not Found Error: Table Sections data not found. Please contact Accelerate Support.', '#e74c3c');
          }

        },
        error: function(data) {
          showToast('System Error: Unable to read Table Sections data. Please contact Accelerate Support.', '#e74c3c');
        }

    });
  }

}


function addNewTable() {  
   
  var paramObj = {};
  paramObj.table = document.getElementById("add_new_table_name").value;
  paramObj.capacity = document.getElementById("add_new_table_capacity").value;
  paramObj.type = document.getElementById("add_new_table_type").value;
  
  paramObj.sortIndex = parseInt(document.getElementById("add_new_table_sortIndex").value);
  paramObj.KOT = "";
  paramObj.status = 0;
  paramObj.lastUpdate = "";
  paramObj.assigned = "";
  paramObj.remarks = "";

  paramObj.capacity = parseFloat(paramObj.capacity);

  if(Number.isNaN(paramObj.capacity)){
    showToast('Warning: Invalid Capacity value. It has to be a Number.', '#e67e22');
    return '';
  } 

   if(paramObj.table == '') {
      showToast('Warning: Please set a name', '#e67e22');
      return '';
   }
   else if(paramObj.sortIndex == "" || paramObj.sortIndex == 0){
      showToast('Warning: Please set sort index', '#e67e22');
      return '';
   }
   else if(paramObj.type == ''){
      showToast('Warning: Table Section is missing', '#e67e22');
      return '';    
   }
   else{ 


        $.ajax({
          type: 'GET',
          url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/_design/filter-tables/_view/all/',
          timeout: 10000,
          success: function(data) {
              if(data.total_rows > 0){

                      var tableData = data.rows;
                      var isAlreadyThere = false;


                       for (var i=0; i<tableData.length; i++) {
                         if (tableData[i].value.table == paramObj.table || tableData[i].value.sortIndex == paramObj.sortIndex){
                            isAlreadyThere = true;
                            break;
                         }
                       }

                       if(isAlreadyThere){
                         showToast('Warning: Table Name and Sort Index already added. Please choose a different name and sort index', '#e67e22');
                       }
                       else{

                            paramObj._id = (paramObj.sortIndex).toString();

                            //Post to local Server
                            $.ajax({
                              type: 'POST',
                              url: COMMON_LOCAL_SERVER_IP+'/accelerate_tables/',
                              data: JSON.stringify(paramObj),
                              contentType: "application/json",
                              dataType: 'json',
                              timeout: 10000,
                              success: function(data) {
                                if(data.ok){
                                  hideNewTableModal();
                                  fetchAllTables();
                                }
                                else{
                                  showToast('Warning: Table was not added. Try again.', '#e67e22');
                                }
                              },
                              error: function(data){           
                                showToast('System Error: Unable to update Tables data. Please contact Accelerate Support.', '#e74c3c');
                              }
                            });  
                            //End - post KOT to Server
                       }
              }
              else{
                showToast('Not Found Error: Tables data not found. Please contact Accelerate Support.', '#e74c3c');
              }
          },
          error: function(data) {
            showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
          }

      });

   }
}